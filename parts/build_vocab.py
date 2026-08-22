# -*- coding: utf-8 -*-
import re, sys, collections
sys.path.insert(0,'parts')
from vocab_fill import FILL

LV=['A1','A2','B1','B2','C1']
def themes(p): return re.findall(r'"([^"]+)":`([^`]*)`',p)
def block(txt,key):
    p=txt[txt.index(key):]; return p[:p.index('\n};')]

old=open('parts/_vocab_old.js',encoding='utf-8').read()
seen=set(); OUT=collections.OrderedDict()
for lv in LV:
    OUT[lv]=collections.OrderedDict()
    for th,b in themes(block(old,'V.%s = {'%lv)):
        ents=[]
        for e in b.split(';'):
            de=e.split('|')[0]
            if de in seen: continue
            seen.add(de); ents.append(e)
        pool=FILL.get(lv+'::'+th,'')
        for e in (pool.split(';') if pool else []):
            if len(ents)>=20: break
            if not e.strip(): continue
            de=e.split('|')[0]
            if de in seen: continue
            seen.add(de); ents.append(e)
        OUT[lv][th]=ents

short=[]
for lv in LV:
    t=open('parts/vocab_new_%s.js'%lv.lower(),encoding='utf-8').read()
    for th,b in themes(block(t,'VN.%s = {'%lv)):
        ents=[]
        for e in b.split(';'):
            de=e.split('|')[0]
            if de in seen: continue
            seen.add(de); ents.append(e)
        pool=FILL.get(lv+'::'+th,'')
        for e in (pool.split(';') if pool else []):
            if len(ents)>=20: break
            if not e.strip(): continue
            de=e.split('|')[0]
            if de in seen: continue
            seen.add(de); ents.append(e)
        if len(ents)<20: short.append((lv,th,20-len(ents)))
        OUT[lv][th]=ents
for lv in LV:
    for th,ents in OUT[lv].items():
        if len(ents)!=20: short.append((lv,th,20-len(ents)))

if short:
    print("STILL SHORT:")
    for lv,th,n in short: print("  %s :: %s  -%d"%(lv,th,n))

lines=['const V = {};']
tot=0
for lv in LV:
    lines.append('V.%s = {'%lv)
    rows=[]
    for th,ents in OUT[lv].items():
        tot+=len(ents)
        rows.append('"%s":`%s`'%(th,';'.join(ents)))
    lines.append(',\n'.join(rows))
    lines.append('};')
open('parts/vocab.js','w',encoding='utf-8').write('\n'.join(lines)+'\n')
print("levels:", {lv:sum(len(e) for e in OUT[lv].values()) for lv in LV})
print("TOTAL", tot, "unique", len(seen))
