# -*- coding: utf-8 -*-
"""Озвучує всі німецькі рядки локально через Piper (thorsten-high).

Без акаунтів, ключів і мережі. Запуск:
    .venv-tts/bin/python tools/gen_audio_local.py
    LIMIT=20 .venv-tts/bin/python tools/gen_audio_local.py   # пробний прогін

Відновлюваний: готові файли пропускає. Ім'я файлу — FNV-1a від оригінального
тексту, та сама функція живе в застосунку (parts/app1.js).
"""
import os, sys, io, json, re, wave, time, subprocess, tempfile

H=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT=os.path.join(H,'audio')
MODEL=os.path.join(H,'.voices','de_DE-thorsten-high.onnx')
LIMIT=int(os.environ.get('LIMIT','0'))
BITRATE=os.environ.get('BITRATE','40k')
import imageio_ffmpeg
FFMPEG=imageio_ffmpeg.get_ffmpeg_exe()   # mp3 грає скрізь без винятків, на відміну від aac

def fnv1a(s):
    h=0x811c9dc5
    for b in s.encode('utf-8'):
        h^=b; h=(h*0x01000193)&0xffffffff
    return format(h,'08x')

def speakable(t):
    """Синтезатору — причесаний текст; хеш рахуємо від оригіналу."""
    t=t.replace('→',', ').replace('/',', ')
    t=' '.join(t.split())
    t=re.sub(r'\s+([,.;:!?])', r'\1', t)
    t=re.sub(r'([.!?]),', r'\1', t)
    t=re.sub(r',{2,}', ',', t)
    return t.strip(' ,')

def path_for(text):
    hh=fnv1a(text)
    return os.path.join(OUT,hh[:2],hh+'.mp3')

texts=json.load(io.open(os.path.join(H,'tools','texts.json'),encoding='utf-8'))
if LIMIT: texts=texts[:LIMIT]
todo=[t for t in texts if not os.path.exists(path_for(t))]
print("рядків: %d · лишилось: %d"%(len(texts),len(todo)))
if not todo:
    print("усе вже озвучено"); sys.exit(0)

from piper import PiperVoice
from piper.config import SynthesisConfig
print("вантажу модель…")
voice=PiperVoice.load(MODEL)
cfg=SynthesisConfig(length_scale=1.05)      # трохи повільніше — для тих, хто вчить

t0=time.time(); done=0; failed=[]
tmpdir=tempfile.mkdtemp()
wav=os.path.join(tmpdir,'t.wav')
for t in todo:
    p=path_for(t)
    os.makedirs(os.path.dirname(p),exist_ok=True)
    try:
        with wave.open(wav,'wb') as wf:
            voice.synthesize_wav(speakable(t), wf, syn_config=cfg)
        r=subprocess.run([FFMPEG,'-y','-i',wav,'-codec:a','libmp3lame',
                          '-b:a',BITRATE,'-ac','1','-ar','22050',p],
                         capture_output=True)
        if r.returncode!=0 or not os.path.exists(p):
            failed.append(t)
    except Exception as e:
        failed.append(t)
    done+=1
    if done%25==0 or done==len(todo):
        el=time.time()-t0
        eta=el/done*(len(todo)-done)
        sys.stdout.write("\r  %d/%d · %.0f%% · лишилось ~%.0f хв   "%(
            done,len(todo),100*done/len(todo),eta/60)); sys.stdout.flush()

total=sum(os.path.getsize(os.path.join(dp,f))
          for dp,_,fs in os.walk(OUT) for f in fs)
n=sum(len(fs) for _,_,fs in os.walk(OUT))
print("\n\nготово за %.1f хв"%((time.time()-t0)/60))
print("файлів: %d · розмір: %.1f МБ"%(n,total/1048576))
if failed:
    print("не вдалося: %d"%len(failed))
    for x in failed[:10]: print("   ",x)
