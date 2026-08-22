# -*- coding: utf-8 -*-
"""Збирає index.html з частин у parts/."""
import io, os, subprocess, sys
os.chdir(os.path.dirname(os.path.abspath(__file__)))
R=lambda p: io.open(p,encoding='utf-8').read()

subprocess.check_call([sys.executable,'parts/build_vocab.py'])

HEAD = '''<!DOCTYPE html>
<html lang="uk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#FFC814">
<meta name="description" content="Німецька з нуля до C1 українською: 100 днів-уроків, 2000 слів із транскрипцією, 75 правил граматики і 12 типів вправ.">
<title>Deutsch: Von Null bis C1 — 100 днів</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%23FFC814'/%3E%3Ctext x='50' y='72' font-size='62' font-family='Arial Black,sans-serif' font-weight='900' text-anchor='middle' fill='%23221F1A'%3ED%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fira+Sans+Condensed:wght@700;800&family=Fira+Sans:ital,wght@0,400;0,500;0,700;1,400&family=Fira+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
'''

parts = [
    HEAD, R('parts/style.css'), '</style>\n</head>\n<body>\n',
    R('parts/body.html'),
    '\n<script>\n/* ===== ДАНІ ===== */\n',
    R('parts/vocab.js'),
    R('parts/_grammar_old.js'),
    R('parts/_levels_old.js'),
    R('parts/sentences.js'),
    R('parts/gaps.js'),
    R('parts/videos.js'),
    '\n/* ===== ДОДАТОК ===== */\n',
    R('parts/app1.js'), R('parts/app2.js'), R('parts/app3.js'),
    '\n</script>\n</body>\n</html>\n',
]
out=''.join(parts)
io.open('index.html','w',encoding='utf-8').write(out)
print('index.html %.1f KB'%(len(out.encode('utf-8'))/1024))
