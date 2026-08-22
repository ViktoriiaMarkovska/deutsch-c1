/* ================= НАВІГАЦІЯ ================= */
document.querySelectorAll("#tabs .tab").forEach(t=>t.addEventListener("click",()=>{
  document.querySelectorAll("#tabs .tab").forEach(x=>x.classList.toggle("is-on",x===t));
  document.querySelectorAll(".view").forEach(v=>v.classList.toggle("is-on",v.id==="v-"+t.dataset.v));
  window.scrollTo(0,0);
}));

/* ================= ШЛЯХ ================= */
const LVLC={A1:"bA1",A2:"bA2",B1:"bB1",B2:"bB2",C1:"bC1"};
const LOCK='<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
const STAR='<svg viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="m12 3 2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6L3.4 9.4l6-.8z"/></svg>';
const BOOK='<svg viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M9 8h6"/></svg>';

function renderPath(){
  const cur=currentDay();
  document.getElementById("pathWrap").innerHTML=LV.map(l=>{
    const done=lvlDone(l), pct=Math.round(done/DAYS[l].length*100);
    return '<div class="lvlband"><div class="lvlband__head"><div class="lvlband__card '+LVLC[l]+'">'
      +'<b>'+l+'</b><span>'+esc(LEVELS.find(x=>x.code===l).name)+' · '+DAYS[l].length+' днів</span>'
      +'<span class="lp">'+pct+'%</span></div></div>'
      +'<div class="path">'+DAYS[l].map((d,i)=>{
        const dn=dayDone(l,i), op=dayOpen(l,i), now=cur&&cur.lv===l&&cur.i===i;
        const cls="node"+(dn?" node--done":op?(now?" node--now":""):" node--lock");
        return '<div class="'+cls+'">'
          +(now?'<span class="now-here">ти тут</span>':'')
          +'<button class="node__btn" data-lv="'+l+'" data-i="'+i+'"'+(op?"":" disabled")+' aria-label="День '+(i+1)+': '+esc(d.theme)+'">'
          +(dn?STAR:op?(d.rule!=null?BOOK:'<b>'+(i+1)+'</b>'):LOCK)+'</button>'
          +(dayCrowns(l,i)>1?'<span class="node__crowns">×'+dayCrowns(l,i)+'</span>':'')
          +'<span class="node__lbl">'+(i+1)+' · '+esc(d.theme)+'</span></div>';
      }).join("")+'</div></div>';
  }).join("");
  document.querySelectorAll(".node__btn").forEach(b=>b.addEventListener("click",()=>openDay(b.dataset.lv,+b.dataset.i)));
  const w=document.getElementById("waldiHero"); if(w)w.innerHTML=waldi(state.xpToday>=GOAL?"happy":"idle",104);
  const ws=document.getElementById("waldiSay");
  if(ws)ws.textContent = state.streak>0
    ? "Серія: "+state.streak+" "+plural(state.streak,"день","дні","днів")+". "+(state.xpToday>=GOAL?"Сьогодні ціль уже закрита.":"Сьогодні ще нічого не зроблено — виправимо?")
    : "Привіт! Я Вальді. Разом дійдемо до C1 — по одному дню за раз.";
}
function currentDay(){
  for(const l of LV) for(let i=0;i<DAYS[l].length;i++)
    if(!dayDone(l,i) && dayOpen(l,i)) return DAYS[l][i];
  return null;
}

/* ---- картка дня ---- */
const sheet=document.getElementById("sheet"), sheetIn=document.getElementById("sheetIn");
sheet.addEventListener("click",e=>{if(e.target===sheet)closeSheet();});
function closeSheet(){sheet.classList.remove("is-on");document.body.style.overflow="";}
function openDay(lv,i){
  const d=DAYS[lv][i], g=d.rule!=null?G[lv][d.rule]:null;
  const knownN=d.words.filter(w=>state.known[wid(w)]).length;
  sheetIn.innerHTML='<div class="sheet__grab"></div>'
    +'<span class="eyebrow">'+lv+' · день '+(i+1)+' зі '+DAYS[lv].length+'</span>'
    +'<h2 style="font-size:clamp(24px,7vw,36px);text-transform:uppercase;margin:5px 0 0">'+esc(d.theme)+'</h2>'
    +'<div class="dayblock"><h4>20 слів дня · вивчено '+knownN+'</h4><div class="wordgrid">'
      +d.words.map(w=>'<div><b>'+esc(w.de)+'</b><span>'+esc(w.uk)+'</span></div>').join("")
    +'</div></div>'
    +(g?'<div class="dayblock"><h4>Правило дня · '+esc(g.tag)+'</h4>'
       +'<b style="font-family:var(--disp);font-size:17px;text-transform:uppercase">'+esc(g.t)+'</b>'
       +'<p style="font-size:15px;margin:7px 0 0">'+g.txt+'</p>'
       +(g.ex&&g.ex[0]?'<div class="ex" style="margin-top:10px"><b>'+esc(g.ex[0][0])+'</b><div class="tr">'+esc(tr(g.ex[0][0]))+'</div><span>'+esc(g.ex[0][1])+'</span></div>':'')
       +'</div>'
      :'<div class="dayblock"><h4>День закріплення</h4><p style="font-size:15px;margin:0">Нового правила сьогодні немає — сьогодні працює тільки повторення. Це не менш важливо: саме тут вчорашнє переходить у автоматизм.</p></div>')
    +(d.vid?'<div class="dayblock"><h4>Відео за бажанням</h4>'
       +'<a class="ytlink" href="https://www.youtube.com/results?search_query='+encodeURIComponent(d.vid.q)+'" target="_blank" rel="noopener">'
       +'<svg viewBox="0 0 24 24"><rect x="1.5" y="5" width="21" height="14" rx="4" fill="#E4342F"/><path d="M10 9.2v5.6l5-2.8z" fill="#fff"/></svg>'
       +'<span><b>'+esc(d.vid.q)+'</b><span>'+esc(d.vid.ch)+'</span></span></a>'
       +'<p class="note" style="margin-top:9px">Посилання відкриє пошук YouTube за цією темою — так воно не зламається, коли автор перезаллє відео.</p></div>':'')
    +'<div style="display:grid;gap:9px;margin-top:16px">'
      +'<button class="btn btn--green btn--wide" id="dStart">'+(dayDone(lv,i)?"Пройти ще раз":"Почати урок")+' · 14 вправ</button>'
      +'<button class="btn btn--wide" id="dWords">Спершу подивитись слова</button>'
    +'</div>';
  document.getElementById("dStart").addEventListener("click",()=>{
    closeSheet(); startLesson({lv,words:d.words,day:d,n:14});
  });
  document.getElementById("dWords").addEventListener("click",()=>{
    closeSheet(); vLv=lv; vQ=""; document.getElementById("vSearch").value="";
    document.querySelectorAll("#vLevels .pill").forEach(x=>x.classList.toggle("is-on",x.dataset.l===lv));
    renderVocab();
    document.querySelectorAll("#tabs .tab").forEach(x=>x.classList.toggle("is-on",x.dataset.v==="woerter"));
    document.querySelectorAll(".view").forEach(v=>v.classList.toggle("is-on",v.id==="v-woerter"));
    window.scrollTo(0,0);
    setTimeout(()=>{const el=[...document.querySelectorAll(".thblock>h3")].find(h=>h.textContent===d.theme); if(el)el.scrollIntoView({behavior:"smooth",block:"start"});},120);
  });
  sheet.classList.add("is-on"); document.body.style.overflow="hidden";
}

/* ================= СЛОВА ================= */
let vLv="A1",vQ="",vHide=false;
document.getElementById("vLevels").innerHTML=LV.map(l=>'<button class="pill'+(l==="A1"?" is-on":"")+'" data-l="'+l+'">'+l+'</button>').join("");
document.querySelectorAll("#vLevels .pill").forEach(p=>p.addEventListener("click",()=>{
  vLv=p.dataset.l;document.querySelectorAll("#vLevels .pill").forEach(x=>x.classList.toggle("is-on",x===p));renderVocab();}));
document.getElementById("vSearch").addEventListener("input",e=>{vQ=e.target.value.trim().toLowerCase();renderVocab();});
document.getElementById("vHideKnown").addEventListener("click",e=>{
  vHide=!vHide;e.target.classList.toggle("is-on",vHide);e.target.textContent=vHide?"Показати всі":"Сховати вивчені";renderVocab();});
function renderVocab(){
  const src=vQ?FLAT:ALL[vLv];
  const list=src.filter(w=>(!vQ||w.de.toLowerCase().includes(vQ)||w.uk.toLowerCase().includes(vQ))&&(!vHide||!state.known[wid(w)]));
  const groups={}; list.forEach(w=>{(groups[w.th]=groups[w.th]||[]).push(w);});
  document.getElementById("vList").innerHTML=Object.entries(groups).map(([th,ws])=>
    '<div class="thblock"><h3>'+esc(th)+'</h3>'+ws.map(w=>{
      const id=wid(w), k=!!state.known[id];
      return '<div class="w'+(k?" is-known":"")+'" data-id="'+esc(id)+'">'
        +'<button class="w__chk" aria-label="Позначити як вивчене"><svg viewBox="0 0 24 24"><path d="m5 12 5 5 9-10"/></svg></button>'
        +'<div><span class="w__de">'+esc(w.de)+'</span>'+(w.pl!=="—"?'<span class="w__pl">'+esc(w.pl)+'</span>':'')
        +'<div class="w__tr">'+esc(tr(w.de))+'</div><div class="w__uk">'+esc(w.uk)+'</div></div>'
        +(canSpeak()?'<button class="w__say" data-say="'+esc(w.de)+'" aria-label="Прослухати">'+SPKF+'</button>':'<span></span>')
        +'</div>';
    }).join("")+'</div>').join("") || '<p class="note">Нічого не знайшлося.</p>';
  document.querySelectorAll("#vList .w__chk").forEach(b=>b.addEventListener("click",()=>{
    const row=b.closest(".w"), id=row.dataset.id;
    state.known[id]=!state.known[id]; row.classList.toggle("is-known",!!state.known[id]);
    if(state.known[id])beep("ok");
    save(); vStat(); hud();
  }));
  document.querySelectorAll("#vList .w__say").forEach(b=>b.addEventListener("click",()=>say(b.dataset.say)));
  vStat();
}
function vStat(){
  const kc=knownCount();
  document.getElementById("vProg").style.width=(kc/TOTALW*100)+"%";
  document.getElementById("vCount").textContent=kc+" з "+TOTALW+" слів позначено як вивчені";
}

/* ================= ПРАВИЛА ================= */
let gLv="A1";
document.getElementById("gLevels").innerHTML=LV.map(l=>'<button class="pill'+(l==="A1"?" is-on":"")+'" data-l="'+l+'">'+l+'</button>').join("");
document.querySelectorAll("#gLevels .pill").forEach(p=>p.addEventListener("click",()=>{
  gLv=p.dataset.l;document.querySelectorAll("#gLevels .pill").forEach(x=>x.classList.toggle("is-on",x===p));renderG();}));
function renderG(){
  document.getElementById("gList").innerHTML=G[gLv].map((g,i)=>
    '<article class="rule" data-i="'+i+'">'
    +'<button class="rule__b"><span class="rule__n">'+(i+1)+'</span>'
      +'<span><span class="rule__t">'+esc(g.t)+'</span><span class="rule__tag">'+esc(g.tag)+'</span></span>'
      +'<span class="rule__plus">+</span></button>'
    +'<div class="rule__body"><p>'+g.txt+'</p>'
    + g.ex.map(e=>'<div class="ex">'
        +(canSpeak()?'<button class="ex__say" data-say="'+esc(e[0])+'" aria-label="Прослухати">'+SPKF+'</button>':'')
        +'<b>'+esc(e[0])+'</b><div class="tr">'+esc(tr(e[0]))+'</div><span>'+esc(e[1])+'</span></div>').join("")
    + (g.warn?'<div class="warn"><b>Увага:</b> '+g.warn+'</div>':'')
    +'</div></article>').join("");
  document.querySelectorAll("#gList .rule__b").forEach(b=>b.addEventListener("click",()=>b.closest(".rule").classList.toggle("is-open")));
  document.querySelectorAll("#gList .ex__say").forEach(b=>b.addEventListener("click",e=>{e.stopPropagation();say(b.dataset.say);}));
}
let dk="best";
function renderDecl(){
  document.getElementById("declBar").innerHTML=Object.entries(DECL).map(([k,v])=>'<button class="pill'+(k===dk?" is-on":"")+'" data-k="'+k+'">'+esc(v.label)+'</button>').join("");
  document.querySelectorAll("#declBar .pill").forEach(p=>p.addEventListener("click",()=>{dk=p.dataset.k;renderDecl();}));
  const d=DECL[dk];
  document.getElementById("declTbl").innerHTML='<thead><tr><th></th><th>чол.</th><th>жін.</th><th>сер.</th><th>множ.</th></tr></thead><tbody>'
    +d.rows.map(r=>'<tr><th>'+r[0]+'</th><td class="k-der">'+r[1]+'</td><td class="k-die">'+r[2]+'</td><td class="k-das">'+r[3]+'</td><td>'+r[4]+'</td></tr>').join("")+'</tbody>';
  document.getElementById("declNote").textContent=d.note;
}

/* ================= ТРЕНАЖЕР ================= */
let trLv="A1";
document.getElementById("trLevels").innerHTML=LV.map(l=>'<button class="pill'+(l==="A1"?" is-on":"")+'" data-l="'+l+'">'+l+'</button>').join("");
document.querySelectorAll("#trLevels .pill").forEach(p=>p.addEventListener("click",()=>{
  trLv=p.dataset.l;document.querySelectorAll("#trLevels .pill").forEach(x=>x.classList.toggle("is-on",x===p));renderTrainer();}));
function renderTrainer(){
  const d=ctx(trLv);
  document.getElementById("trGrid").innerHTML=EXKEYS.map(k=>{
    const e=EX[k], ok=e.need(d);
    return '<button class="tcard" data-k="'+k+'"'+(ok?"":" disabled style=\"opacity:.4\"")+'>'
      +'<span class="tcard__ic" style="background:'+e.ic+'"><svg viewBox="0 0 24 24">'+e.icon+'</svg></span>'
      +'<b>'+esc(e.name)+'</b><span>'+esc(ok?e.desc:"недоступно на цьому рівні")+'</span></button>';
  }).join("")
  +'<button class="tcard" data-k="mix" style="grid-column:1/-1"><span class="tcard__ic" style="background:var(--gold-d)">'
  +'<svg viewBox="0 0 24 24"><path d="M4 4h5v5H4zM15 4h5v5h-5zM4 15h5v5H4zM15 15h5v5h-5z"/></svg></span>'
  +'<b>Мікс усього</b><span>20 випадкових вправ з усіх типів — найближче до реального іспиту</span></button>';
  document.querySelectorAll("#trGrid .tcard").forEach(b=>b.addEventListener("click",()=>{
    const k=b.dataset.k;
    if(k==="mix") startLesson({lv:trLv,hearts:false,n:20});
    else startLesson({lv:trLv,hearts:false,only:k,n:14});
  }));
}

/* ================= ПРОФІЛЬ ================= */
const ACH=[
  {ic:"🐣",t:"Перший день",d:"пройти будь-який урок",ok:s=>s.lessons>=1},
  {ic:"🔥",t:"Тиждень",d:"серія 7 днів поспіль",ok:s=>s.best>=7},
  {ic:"💯",t:"Сто слів",d:"позначити 100 слів вивченими",ok:()=>knownCount()>=100},
  {ic:"📚",t:"Півтисячі",d:"позначити 500 слів вивченими",ok:()=>knownCount()>=500},
  {ic:"🏁",t:"A1 закрито",d:"пройти всі 20 днів A1",ok:()=>lvlDone("A1")===20},
  {ic:"🎧",t:"Вухо",d:"1000 XP",ok:s=>s.xp>=1000},
  {ic:"🥨",t:"Знавець артиклів",d:"200 правильних відповідей",ok:s=>s.correct>=200},
  {ic:"🌙",t:"Марафон",d:"серія 30 днів",ok:s=>s.best>=30},
  {ic:"👑",t:"Von Null bis C1",d:"пройти всі 100 днів",ok:()=>LV.every(l=>lvlDone(l)===20)}
];
function renderProfile(){
  const total=ALLDAYS.filter(d=>dayDone(d.lv,d.i)).length;
  const acc=state.answered?Math.round(state.correct/state.answered*100):0;
  document.getElementById("statGrid").innerHTML=
    [["Днів пройдено",total+" / 100"],["Слів вивчено",knownCount()+" / "+TOTALW],
     ["Усього XP",state.xp],["Найдовша серія",state.best+" "+plural(state.best,"день","дні","днів")],
     ["Уроків",state.lessons],["Влучність",acc+"%"],["Відповідей",state.answered],["Правильних",state.correct]]
    .map(([s,b])=>'<div class="sg"><b>'+b+'</b><span>'+s+'</span></div>').join("");
  document.getElementById("achList").innerHTML=ACH.map(a=>
    '<div class="achv'+(a.ok(state)?" is-on":"")+'"><span class="achv__ic">'+a.ic+'</span>'
    +'<span><b>'+a.t+'</b><span>'+a.d+'</span></span></div>').join("");
  const wp=document.getElementById("waldiProf");
  if(wp){
    wp.innerHTML=waldi(total===0?"idle":total>=50?"happy":"idle",104);
    document.getElementById("waldiProfSay").textContent =
      total===0 ? "Ще жодного дня. Почни з A1 — там усе з нуля, чесно."
      : total<20 ? "Пройдено "+total+" "+plural(total,"день","дні","днів")+". Перший рівень — найважчий, далі мозок звикає."
      : total<60 ? total+" днів позаду. Уже видно, що це не спроба, а звичка."
      : "Ти на фінішній прямій: "+total+" зі 100. Тримайся.";
  }
  document.getElementById("lvlRows").innerHTML=LEVELS.map(L2=>{
    const done=lvlDone(L2.code), pct=Math.round(done/20*100);
    return '<button class="lvlrow" data-c="'+L2.code+'" style="width:100%;text-align:left;cursor:pointer">'
      +'<span class="lvlrow__c '+LVLC[L2.code]+'">'+L2.code+'</span>'
      +'<span><span class="lvlrow__t">'+esc(L2.name)+'</span><span class="lvlrow__s">'+esc(L2.months)+' · '+done+' з 20 днів</span></span>'
      +'<span class="lvlrow__p">'+pct+'%</span></button>';
  }).join("");
  document.querySelectorAll("#lvlRows .lvlrow").forEach(b=>b.addEventListener("click",()=>showLvl(b.dataset.c)));
}
function showLvl(code){
  const L2=LEVELS.find(x=>x.code===code);
  document.getElementById("lvlDetail").innerHTML='<div class="tool">'
    +'<span class="eyebrow">'+L2.code+' · '+esc(L2.weeks)+'</span>'
    +'<h3 style="font-size:20px;text-transform:uppercase;margin:5px 0 9px">'+esc(L2.name)+'</h3>'
    +'<p style="font-size:15px;margin:0 0 12px">'+esc(L2.goal)+'</p>'
    +'<div class="dayblock" style="margin-top:0"><h4>Навички рівня</h4><ul style="margin:0;padding-left:17px;font-size:14.5px">'
      +L2.skills.map(s=>'<li style="margin-bottom:4px">'+esc(s)+'</li>').join("")+'</ul></div>'
    +'<div class="dayblock"><h4>Контрольні точки</h4><ul style="margin:0;padding-left:17px;font-size:14.5px">'
      +L2.tasks.map(s=>'<li style="margin-bottom:4px">'+esc(s)+'</li>').join("")+'</ul></div>'
    +'<div class="dayblock" style="background:var(--gold-l);border-color:var(--gold)"><h4>Milestone</h4>'
      +'<p style="margin:0;font-size:15px">'+esc(L2.milestone)+'</p></div>'
    +'</div>';
  document.getElementById("lvlDetail").scrollIntoView({behavior:"smooth",block:"nearest"});
}

/* планувальник */
const MS=[["A1",90],["A2",210],["B1",420],["B2",680],["C1",1000]];
function planner(){
  const m=+document.getElementById("mins").value;
  document.getElementById("minsOut").textContent=m;
  document.getElementById("forecast").innerHTML='<thead><tr><th>Рівень</th><th>Годин усього</th><th>За такого темпу</th></tr></thead><tbody>'
    +MS.map(([c,h])=>{
      const days=Math.round(h*60/m), mo=(days/30.4).toFixed(1);
      return '<tr><th>'+c+'</th><td>'+h+'</td><td>'+mo+' міс · '+days+' днів</td></tr>';
    }).join("")+'</tbody>';
}
document.getElementById("mins").addEventListener("input",planner);
document.getElementById("resetBtn").addEventListener("click",()=>{
  if(!confirm("Точно скинути весь прогрес? Це не можна відмінити."))return;
  state={known:{},days:{},xp:0,xpToday:0,xpDate:today(),streak:0,lastDay:"",best:0,answered:0,correct:0,lessons:0};
  save(); renderPath(); renderVocab(); renderProfile(); hud();
});

/* ================= СТАРТ ================= */
(async function(){
  await load();
  hud(); renderPath(); renderVocab(); renderG(); renderDecl(); renderTrainer(); renderProfile(); planner();
})();
