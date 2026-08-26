# -*- coding: utf-8 -*-
"""Зшиває словник із трьох джерел, прибирає дублікати й доганяє теми до розміру.

Джерела (у порядку пріоритету):
  _vocab_old.js    V.*   — початкова тисяча
  vocab_new_*.js   VN.*  — друга тисяча
  vocab_x_*.js     VX.*  — третя й четверта; може і додавати нові теми,
                           і дописувати слова в наявну тему з тією ж назвою
  vocab_fill.py    FILL  — пул замін на випадок колізій

Розмір теми залежить від рівня: A1/A2 по 20 слів, B1/B2/C1 по 30
(остання тема рівня — 20, щоб вийшло рівно 800).
"""
import re, sys, os, collections
HERE=os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0,HERE)
from vocab_fill import FILL

LV=['A1','A2','B1','B2','C1']
SIZE={'A1':20,'A2':20,'B1':30,'B2':30,'C1':30}
TARGET=800                       # слів на рівень

def themes(p): return re.findall(r'"([^"]+)":`([^`]*)`',p)
def block(txt,key):
    if key not in txt: return ''
    p=txt[txt.index(key):]
    return p[:p.index('\n};')]
def read(name):
    fp=os.path.join(HERE,name)
    return open(fp,encoding='utf-8').read() if os.path.exists(fp) else ''

old=read('_vocab_old.js')
new={lv:read('vocab_new_%s.js'%lv.lower()) for lv in LV}
ext={lv:read('vocab_x_%s.js'%lv.lower())   for lv in LV}

seen=set()
OUT=collections.OrderedDict()

def take(entries, bucket, limit):
    """Додає записи в тему, доки не набереться limit і поки слово нове."""
    for e in entries:
        if len(bucket)>=limit: break
        e=e.strip()
        if not e: continue
        de=e.split('|')[0].strip()
        if not de or de in seen: continue
        seen.add(de); bucket.append(e)

for lv in LV:
    OUT[lv]=collections.OrderedDict()
    sources=[(old,'V.%s = {'%lv), (new[lv],'VN.%s = {'%lv), (ext[lv],'VX.%s = {'%lv)]
    order=[]
    for txt,key in sources:
        b=block(txt,key)
        if not b: continue
        for th,body in themes(b):
            if th not in OUT[lv]:
                OUT[lv][th]=[]; order.append(th)
            OUT[lv][th].extend([x for x in body.split(';') if x.strip()])
    # тепер у кожній темі — сирий список; чистимо й ріжемо під розмір
    raw={th:OUT[lv][th] for th in order}
    OUT[lv]=collections.OrderedDict()
    n=len(order)
    for idx,th in enumerate(order):
        # остання тема рівня добирає залишок, щоб вийшло рівно TARGET
        used=sum(len(v) for v in OUT[lv].values())
        want=SIZE[lv]
        if idx==n-1: want=TARGET-used
        if want<=0: continue
        bucket=[]
        take(raw[th], bucket, want)
        pool=FILL.get(lv+'::'+th,'')
        if pool: take(pool.split(';'), bucket, want)
        OUT[lv][th]=bucket

short=[]
for lv in LV:
    for th,ents in OUT[lv].items():
        pass
    tot=sum(len(v) for v in OUT[lv].values())
    if tot!=TARGET: short.append((lv,tot))
for lv in LV:
    n=len(OUT[lv]); 
    for idx,(th,ents) in enumerate(OUT[lv].items()):
        want=SIZE[lv] if idx<n-1 else len(ents)
        if idx<n-1 and len(ents)!=want:
            short.append((lv+'::'+th, str(len(ents))+'/'+str(want)))

if short:
    print("STILL SHORT:")
    for a,b in short: print("   %s  %s"%(a,b))

lines=['const V = {};']
tot=0
for lv in LV:
    lines.append('V.%s = {'%lv)
    rows=[]
    for th,ents in OUT[lv].items():
        if not ents: continue
        tot+=len(ents)
        rows.append('"%s":`%s`'%(th,';'.join(ents)))
    lines.append(',\n'.join(rows))
    lines.append('};')
open(os.path.join(HERE,'vocab.js'),'w',encoding='utf-8').write('\n'.join(lines)+'\n')
print("рівні:", {lv:sum(len(e) for e in OUT[lv].values()) for lv in LV})
print("тем:", {lv:len([1 for e in OUT[lv].values() if e]) for lv in LV})
print("РАЗОМ", tot, "унікальних", len(seen))
