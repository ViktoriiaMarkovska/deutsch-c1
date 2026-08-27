# -*- coding: utf-8 -*-
"""Озвучує всі німецькі рядки через Google Cloud Text-to-Speech.

Запуск:
    GOOGLE_TTS_KEY=... python3 tools/gen_audio.py

Скрипт відновлюваний: уже згенеровані файли пропускає, тож його можна
спокійно перервати й запустити ще раз. Ім'я файлу — FNV-1a від тексту,
рівно та сама функція живе в застосунку, тому шлях збігається без маніфесту.
"""
import os, sys, io, json, base64, time, urllib.request, urllib.error

H=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT=os.path.join(H,'audio')
KEY=os.environ.get('GOOGLE_TTS_KEY','').strip()
VOICE=os.environ.get('GOOGLE_TTS_VOICE','de-DE-Neural2-F')
RATE=float(os.environ.get('GOOGLE_TTS_RATE','0.92'))

if not KEY:
    sys.exit("Немає ключа. Запусти так:\n  GOOGLE_TTS_KEY=твій_ключ python3 tools/gen_audio.py")

def fnv1a(s):
    h=0x811c9dc5
    for b in s.encode('utf-8'):
        h^=b
        h=(h*0x01000193)&0xffffffff
    return format(h,'08x')

def speakable(t):
    """Те, що піде в синтезатор. Хеш рахуємо від оригіналу, а озвучуємо
       причесаний варіант: стрілки й слеші синтезатор читає незграбно."""
    import re as _re
    t=t.replace('\u2192',', ').replace('/',', ')
    t=' '.join(t.split())
    t=_re.sub(r'\s+([,.;:!?])', r'\1', t)      # прибрати пробіл перед розділовим
    t=_re.sub(r'([.!?]),', r'\1', t)            # «Bock., Ich» -> «Bock. Ich»
    t=_re.sub(r',{2,}', ',', t)
    return t.strip(' ,')

def path_for(text):
    hh=fnv1a(text)
    return os.path.join(OUT,hh[:2],hh+'.mp3')

URL='https://texttospeech.googleapis.com/v1/text:synthesize?key='+KEY

def synth(text, tries=4):
    body=json.dumps({
        "input":{"text":speakable(text)},
        "voice":{"languageCode":"de-DE","name":VOICE},
        "audioConfig":{"audioEncoding":"MP3","speakingRate":RATE,"sampleRateHertz":24000}
    }).encode('utf-8')
    for a in range(tries):
        try:
            req=urllib.request.Request(URL,data=body,headers={'Content-Type':'application/json'})
            with urllib.request.urlopen(req,timeout=30) as r:
                return base64.b64decode(json.loads(r.read())['audioContent'])
        except urllib.error.HTTPError as e:
            msg=e.read().decode('utf-8','replace')[:300]
            if e.code in (429,500,503) and a<tries-1:
                time.sleep(2*(a+1)); continue
            sys.exit("\nПомилка Google TTS %s:\n%s"%(e.code,msg))
        except Exception:
            if a<tries-1: time.sleep(2*(a+1)); continue
            raise
    return None

texts=json.load(io.open(os.path.join(H,'tools','texts.json'),encoding='utf-8'))
LIMIT=int(os.environ.get('LIMIT','0'))          # для пробного запуску
if LIMIT: texts=texts[:LIMIT]
todo=[t for t in texts if not os.path.exists(path_for(t))]
print("усього рядків: %d · лишилось озвучити: %d"%(len(texts),len(todo)))
print("голос: %s · темп: %s"%(VOICE,RATE))
if not todo:
    print("усе вже озвучено"); sys.exit(0)

chars=sum(len(t) for t in todo)
print("символів цього запуску: %d\n"%chars)

done=0
for t in todo:
    p=path_for(t)
    os.makedirs(os.path.dirname(p),exist_ok=True)
    data=synth(t)
    if data:
        with open(p,'wb') as f: f.write(data)
    done+=1
    if done%50==0 or done==len(todo):
        pct=100*done//len(todo)
        sys.stdout.write("\r  %d/%d  %d%%"%(done,len(todo),pct)); sys.stdout.flush()

total=sum(os.path.getsize(os.path.join(dp,f))
          for dp,_,fs in os.walk(OUT) for f in fs)
print("\n\nготово. файлів: %d · розмір: %.1f МБ"%(len(texts),total/1048576))
