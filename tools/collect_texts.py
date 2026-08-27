# -*- coding: utf-8 -*-
"""Збирає всі німецькі рядки, які застосунок колись озвучує."""
import re, io, os, json, sys
H=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R=lambda n: io.open(os.path.join(H,'parts',n),encoding='utf-8').read()
LV=['A1','A2','B1','B2','C1']
texts=[]

# 1. слова
v=R('vocab.js')
for lv in LV:
    p=v[v.index('V.%s = {'%lv):]; p=p[:p.index('\n};')]
    for th,body in re.findall(r'"([^"]+)":`([^`]*)`',p):
        for e in body.split(';'):
            de=e.split('|')[0].strip()
            if de: texts.append(de)

# 2. речення
s=R('sentences.js')
for lv in LV:
    b=re.search(r'SENT\.%s=`([^`]*)`'%lv,s).group(1)
    for it in b.split(';'):
        texts.append(it.split('|')[0].strip())

# 3. пропуски — озвучуємо з підставленою відповіддю
g=R('gaps.js')
for lv in LV:
    b=re.search(r'GAP\.%s=`([^`]*)`'%lv,g).group(1)
    for it in b.split(';'):
        p=it.split('|')
        if len(p)>=2: texts.append(p[0].replace('___',p[1]).strip())

# 4. приклади з правил
gr=R('_grammar_old.js')
for m in re.finditer(r'\[\["((?:[^"\\]|\\.)*)"',gr): texts.append(m.group(1))
for m in re.finditer(r'\],\["((?:[^"\\]|\\.)*)"',gr): texts.append(m.group(1))

# 5. складені слова, якщо є
if os.path.exists(os.path.join(H,'parts','compounds.js')):
    c=R('compounds.js')
    for m in re.finditer(r'`([^`]*)`',c):
        for it in m.group(1).split(';'):
            de=it.split('|')[0].strip()
            if de and re.search(r'[A-Za-zÄÖÜäöüß]',de): texts.append(de)

clean=[]
seen=set()
for t in texts:
    t=t.strip().replace('\\"','"')
    if not t or not re.search(r'[A-Za-zÄÖÜäöüß]',t): continue
    if t in seen: continue
    seen.add(t); clean.append(t)

chars=sum(len(t) for t in clean)
print("унікальних рядків:",len(clean))
print("символів:",chars)
print("безкоштовний ліміт Google WaveNet — 1 000 000 символів на місяць")
print("вкладаємось:", "так" if chars<1000000 else "НІ")
json.dump(clean,io.open(os.path.join(H,'tools','texts.json'),'w',encoding='utf-8'),ensure_ascii=False)
print("-> tools/texts.json")
