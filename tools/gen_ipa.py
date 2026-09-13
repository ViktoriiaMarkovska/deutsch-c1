# -*- coding: utf-8 -*-
"""Генерує IPA-транскрипцію для всього, що застосунок колись показує.

Джерело — espeak-ng, який їде разом із Piper, тож ні мережі, ні ключів
не треба. Результат — parts/ipa.js: мапа «хеш тексту -> IPA», той самий
FNV-1a, що й для аудіофайлів, тому один ключ обслуговує і слова,
і речення, і приклади з правил.

Запуск:  .venv-tts/bin/python tools/gen_ipa.py
"""
import io, os, re, json, sys
H=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def fnv1a(s):
    h=0x811c9dc5
    for b in s.encode('utf-8'):
        h^=b; h=(h*0x01000193)&0xffffffff
    return format(h,'08x')

ARTS=re.compile(r'^(der|die|das)\s+', re.I)

texts=json.load(io.open(os.path.join(H,'tools','texts.json'),encoding='utf-8'))
need=set(texts)
# вправа «який артикль?» показує іменник БЕЗ артикля — це інший рядок
for t in texts:
    bare=ARTS.sub('',t)
    if bare!=t: need.add(bare)
need={t for t in need if t.strip()}
print("рядків до транскрипції:", len(need))

from piper.phonemize_espeak import EspeakPhonemizer
ph=EspeakPhonemizer()

VOW=set('aeiouɛɔɪʊøœyʏəɐɑæɒʌɜiːuː')

def tidy(s):
    """espeak дає свій робочий набір символів, а словники — інший.
       Наближаємо до словникової нотації й ставимо наголос на початок складу."""
    s=s.replace('ɾ','ʁ')          # німецьке r — увулярне
    s=s.replace('ɜ','ɐ')          # ненаголошене -er
    s=s.replace('ɑ','a')          # німецьке a переднішe за espeak-івське
    out=[]
    for w in s.split(' '):
        i=w.find('ˈ')
        if i>0:
            # зсуваємо наголос ліворуч через приголосні до межі складу
            j=i
            while j>0 and w[j-1] not in VOW and w[j-1] not in 'ːˌˈ':
                j-=1
            if j!=i:
                w=w[:j]+'ˈ'+w[j:i]+w[i+1:]
        out.append(w)
    return ' '.join(out)

def ipa(t):
    try:
        parts=ph.phonemize('de', t)
        s=' '.join(''.join(p) for p in parts).strip()
        s=re.sub(r'\s+',' ',s)
        return tidy(s.rstrip('.,;:!?').strip())
    except Exception:
        return ''

out={}
bad=0
for n,t in enumerate(sorted(need),1):
    v=ipa(t)
    if v: out[fnv1a(t)]=v
    else: bad+=1
    if n%1000==0:
        sys.stdout.write("\r  %d/%d"%(n,len(need))); sys.stdout.flush()

lines=['/* ================= IPA =================',
       '   Транскрипція від espeak-ng, згенерована tools/gen_ipa.py.',
       '   Ключ — FNV-1a від німецького тексту, та сама функція, що й для аудіо. */',
       'const IPA=']
lines.append(json.dumps(out, ensure_ascii=False, separators=(',',':'))+';')
io.open(os.path.join(H,'parts','ipa.js'),'w',encoding='utf-8').write('\n'.join(lines)+'\n')
size=os.path.getsize(os.path.join(H,'parts','ipa.js'))
print("\nзаписів: %d · без транскрипції: %d · файл: %.0f КБ"%(len(out),bad,size/1024))
