/* ================= ГЕНЕРАТОРИ ВПРАВ =================
   Кожен повертає {k, head, body, opts, ans, hint, say, cols}
   k: choice | type | build | pairs                                        */
const EX={};

/* 1. Артикль. Транскрипція — БЕЗ артикля, інакше вправа сама себе видає. */
EX.artikel={name:"Артикль",desc:"der, die чи das — за формою слова",ic:"#2B6FE8",
  icon:'<path d="M4 7V5h16v2M12 5v14M9 19h6"/>',
  need:d=>d.nouns.length>0,
  make(d){
    const w=rnd(d.nouns);
    return {k:"choice",cols:3,head:"Який артикль?",
      body:'<div class="qword">'+esc(w.n)+'</div><div class="qsub">'+esc(w.uk)+'</div>'
           +'<div class="qtr">'+esc(trBare(w.n))+'</div>',
      opts:["der","die","das"], ans:["der","die","das"].indexOf(w.art),
      hint:ARTRULES[w.art], say:w.art+" "+w.n, art:true};
  }};

/* 2. Українською → німецькою */
EX.uk_de={name:"Переклад UK→DE",desc:"побачити переклад і згадати слово",ic:"#1FB86B",
  icon:'<path d="M4 12h16M14 6l6 6-6 6"/>',
  need:d=>d.words.length>3,
  make(d){
    const w=rnd(d.words), o=distinct(d.pool,3,w,x=>x.de);
    const all=shuffle([w].concat(o));
    return {k:"choice",head:"Як це німецькою?",
      body:'<div class="qword">'+esc(w.uk)+'</div>',
      opts:all.map(x=>x.de), ans:all.indexOf(w),
      hint:w.pl!=="—"?"Множина: "+w.de.replace(ARTS,"")+" "+w.pl:"", say:w.de};
  }};

/* 3. Німецькою → українською */
EX.de_uk={name:"Переклад DE→UK",desc:"впізнати слово в тексті",ic:"#8B5CF6",
  icon:'<path d="M20 12H4M10 6l-6 6 6 6"/>',
  need:d=>d.words.length>3,
  make(d){
    const w=rnd(d.words), o=distinct(d.pool,3,w,x=>x.uk);
    const all=shuffle([w].concat(o));
    return {k:"choice",head:"Що це означає?",
      body:'<div class="qword">'+esc(w.de)+'</div><div class="qtr">'+esc(tr(w.de))+'</div>',
      opts:all.map(x=>x.uk), ans:all.indexOf(w), hint:"", say:w.de};
  }};

/* 4. На слух */
EX.audio={name:"На слух",desc:"почути слово й упізнати його",ic:"#FF7A18",
  icon:'<path d="M11 5 6 9H3v6h3l5 4zM15.5 8.5a5 5 0 0 1 0 7"/>',
  need:d=>canSpeak()&&d.words.length>3,
  make(d){
    const w=rnd(d.words), o=distinct(d.pool,3,w,x=>x.de);
    const all=shuffle([w].concat(o));
    return {k:"choice",head:"Що ти чуєш?",
      body:'<button class="speak" id="bigSpeak" aria-label="Прослухати">'+SPKF+'</button>',
      opts:all.map(x=>x.de), ans:all.indexOf(w),
      hint:w.uk, say:w.de, autoSay:true};
  }};

/* 5. Впиши слово */
EX.type={name:"Впиши слово",desc:"згадати з нуля, без варіантів",ic:"#E4342F",
  icon:'<path d="M4 7h16M4 12h16M4 17h9"/>',
  need:d=>d.words.length>0,
  make(d){
    const w=rnd(d.words);
    return {k:"type",head:"Напиши німецькою",
      body:'<div class="qword">'+esc(w.uk)+'</div>'
        +(isNoun(w)?'<div class="qsub">не забудь артикль</div>':''),
      ans:w.de, alt:[w.de.replace(ARTS,"")], strictArt:isNoun(w),
      hint:"Вимова: "+tr(w.de), say:w.de};
  }};

/* 6. Множина */
/* Позначки словника: «—» немає множини · «-» форма не змінюється ·
   «-n/-e/-er/-s» додати закінчення · «¨» умлаут · «Daten» готова форма. */
function umlaut(s){
  if(/au/i.test(s)) return s.replace(/au(?!.*au)/i,m=>m[0]==="A"?"Äu":"äu");
  return s.replace(/(a|o|u)(?!.*[aou])/i,m=>({a:"ä",o:"ö",u:"ü",A:"Ä",O:"Ö",U:"Ü"}[m]||m));
}
function plForm(base,p){
  if(p==="—") return base;
  let b=base, rest=p;
  if(rest.charAt(0)==="¨"){ b=umlaut(base); rest=rest.slice(1); }
  if(rest===""||rest==="-") return b;
  if(rest.charAt(0)==="-") return b+rest.slice(1);
  return rest;
}
EX.plural={name:"Множина",desc:"іменник живе трійкою: артикль + слово + множина",ic:"#2B6FE8",
  icon:'<path d="M7 8h10M7 12h10M7 16h6M3 8h.01M3 12h.01M3 16h.01"/>',
  need:d=>d.plWords.length>6,
  make(d){
    const w=rnd(d.plWords), base=w.de.replace(ARTS,"");
    const right=plForm(base,w.pl);
    /* хибні варіанти — це той самий іменник з чужими закінченнями,
       так вправа перевіряє саме форму, а не впізнавання кореня */
    const marks=["-n","-en","-e","-er","¨-e","¨-er","-s","-"].filter(m=>plForm(base,m)!==right);
    const wrong=[];
    for(const m of shuffle(marks)){
      const f=plForm(base,m);
      if(f!==right && wrong.indexOf(f)<0) wrong.push(f);
      if(wrong.length===3) break;
    }
    if(wrong.length<3) return EX.de_uk.make(d);
    const all=shuffle([right].concat(wrong));
    return {k:"choice",head:"Яка множина?",
      body:'<div class="qword">'+esc(w.de)+'</div><div class="qsub">'+esc(w.uk)+'</div>',
      opts:all, ans:all.indexOf(right),
      hint:'Позначка «'+w.pl+'» означає: '+(w.pl.indexOf("¨")===0?"умлаут кореневої голосної":"додати закінчення")+'.',
      say:"die "+right};
  }};

/* 7. Пари */
EX.pairs={name:"Знайди пари",desc:"п'ять слів і п'ять перекладів",ic:"#1FB86B",
  icon:'<path d="M8 6H5v12h3M16 6h3v12h-3M9 12h6"/>',
  need:d=>d.words.length>=5,
  make(d){
    const ws=distinct(d.words,5,{de:""},x=>x.de);
    return {k:"pairs",head:"Склади пари",pairs:ws.map(w=>[w.de,w.uk]),hint:""};
  }};

/* 8. Збери речення */
EX.build={name:"Збери речення",desc:"порядок слів — головна складність німецької",ic:"#8B5CF6",
  icon:'<path d="M4 6h6v4H4zM14 6h6v4h-6zM9 14h6v4H9z"/>',
  need:d=>d.sents.length>0,
  make(d){
    const s=rnd(d.sents), parts=s.de.split(" ");
    return {k:"build",head:"Збери речення",
      body:'<div class="qsent">'+esc(s.uk)+'</div>',
      words:shuffle(parts), ans:s.de,
      hint:"Дієслово в простому реченні — завжди друге місце.", say:s.de};
  }};

/* 9. Пропуск: відмінки, прийменники, форми */
EX.gap={name:"Пропуск",desc:"відмінки, прийменники, дієслівні форми",ic:"#FF7A18",
  icon:'<path d="M4 12h4M16 12h4M10 9v6h4V9z"/>',
  need:d=>d.gaps.length>0,
  make(d){
    const g=rnd(d.gaps);
    const all=shuffle([g.ans].concat(g.wrong));
    return {k:"choice",head:"Встав пропущене",
      body:'<div class="qsent">'+esc(g.s).replace("___","<u> </u>")+'</div>'
           +'<div class="qsub" style="margin-top:9px">'+esc(g.uk)+'</div>',
      opts:all, ans:all.indexOf(g.ans), hint:g.hint, say:g.s.replace("___",g.ans)};
  }};

/* 10. Речення на слух */
EX.listen={name:"Речення на слух",desc:"почути ціле речення й зібрати його",ic:"#2B6FE8",
  icon:'<path d="M3 12h3l4-4v8l-4-4M14 9v6M17 7v10M20 10v4"/>',
  need:d=>canSpeak()&&d.sents.length>0,
  make(d){
    const s=rnd(d.sents), parts=s.de.split(" ");
    return {k:"build",head:"Послухай і збери",
      body:'<button class="speak" id="bigSpeak" aria-label="Прослухати">'+SPKF+'</button>',
      words:shuffle(parts), ans:s.de, hint:s.uk, say:s.de, autoSay:true};
  }};

/* 11. Артикль у множині — усі множини це die */
EX.artpl={name:"Артикль множини",desc:"перевірка на автоматизм: множина завжди die",ic:"#E4342F",
  icon:'<path d="M5 7h14M5 12h14M5 17h14"/>',
  need:d=>d.nouns.length>3,
  make(d){
    const w=rnd(d.nouns), sg=Math.random()<.5;
    const opts=["der","die","das"];
    return {k:"choice",cols:3,head:sg?"Артикль однини":"Артикль множини",
      body:'<div class="qword">'+esc(sg?w.n:w.n+" (Pl.)")+'</div><div class="qsub">'+esc(w.uk)+(sg?"":" — множина")+'</div>'
           +'<div class="qtr">'+esc(trBare(w.n))+'</div>',
      opts, ans:sg?opts.indexOf(w.art):1,
      hint:sg?ARTRULES[w.art]:"У множині рід зникає: усі іменники беруть die. Це найдешевше правило в німецькій.",
      say:(sg?w.art:"die")+" "+w.n};
  }};

/* 12. Напиши почуте */
EX.dictate={name:"Диктант",desc:"почути й записати — найважча й найкорисніша вправа",ic:"#8B5CF6",
  icon:'<path d="M12 3v10M9 6l3-3 3 3M5 15v4h14v-4"/>',
  need:d=>canSpeak()&&d.words.length>0,
  make(d){
    const w=rnd(d.words);
    return {k:"type",head:"Запиши те, що чуєш",
      body:'<button class="speak" id="bigSpeak" aria-label="Прослухати">'+SPKF+'</button>',
      ans:w.de, alt:[w.de.replace(ARTS,"")], strictArt:false,
      hint:w.uk+" · "+tr(w.de), say:w.de, autoSay:true};
  }};

const EXKEYS=["artikel","uk_de","de_uk","audio","type","plural","pairs","build","gap","listen","artpl","dictate"];

/* контекст даних для генераторів */
function ctx(lv,words){
  const pool=ALL[lv];
  const ws=words||pool;
  return {
    lv, words:ws, pool,
    nouns: ws.filter(isNoun).map(w=>({art:w.de.split(" ")[0].toLowerCase(),n:w.de.replace(ARTS,""),uk:w.uk,pl:w.pl})),
    plWords: ws.filter(w=>isNoun(w)&&w.pl!=="—"&&w.pl!=="-"),
    sents:SENTS[lv], gaps:GAPS[lv]
  };
}

/* ================= ДВИГУН УРОКУ =================
   Три відмінності від попередньої версії:
   1. Життя безлімітні. Помилка не «віднімає серце», а повертає питання
      в кінець черги — урок не закінчиться, поки слово не сяде.
   2. Слова вводяться картками-знайомствами прямо в уроці: вивчив четвірку —
      одразу її й перевірив. Ніякої стіни тексту перед стартом.
   3. У кожної вправи є підказка на вимогу. Вона нічого не забирає,
      лише знімає бонус за бездоганний урок.                              */
let L=null;
const lessonEl=document.getElementById("lesson");
const lBody=document.getElementById("lBody"), lFoot=document.getElementById("lFoot"), lFootIn=document.getElementById("lFootIn");

/* ---- підказка: будуємо риштування під конкретний тип вправи ---- */
function answerOf(q){
  return q.k==="choice" ? q.opts[q.ans] : (q.ans||"");
}
function hintFor(q){
  const a=answerOf(q);
  switch(q.ex){
    case "artikel": case "artpl":
      return q.hint||"Дивись на закінчення слова — воно майже завжди й вирішує рід.";
    case "uk_de":
      return "Починається на <b>"+esc(a.replace(ARTS,"").slice(0,2))+"…</b> · вимова: "+esc(tr(a));
    case "de_uk": case "audio":
      return "Вимова: <b>"+esc(tr(q.say||a))+"</b>";
    case "type":
      return "Вимова: <b>"+esc(tr(a))+"</b> · "+a.replace(ARTS,"").length+" літер у слові";
    case "dictate":
      return "Вимова: <b>"+esc(tr(a))+"</b>";
    case "plural":
      return q.hint||"Подивись на позначку множини у словнику.";
    case "build": case "listen":
      return "Перше слово: <b>"+esc(String(q.ans).split(" ")[0])+"</b>. Дієслово в простому реченні — на другому місці.";
    case "gap":
      return q.hint||"Подивись, якого відмінка вимагає прийменник.";
    default:
      return q.hint||"Спробуй пригадати корінь слова.";
  }
}

/* ---- картки-знайомства: вчимо перед тим, як питати ----
   П'ятірка слів на одній картці, а не двадцять карток поспіль:
   так знайомство займає чотири кроки замість двадцяти.                 */
function teachGroup(ws,n,total){
  return {k:"teach",ex:"teach",head:"Нові слова · "+n+" з "+total,
    say:ws[0].de, words:ws,
    body:'<div class="teach teach--list">'
      +ws.map((w,i)=>'<div class="tw" data-say="'+esc(w.de)+'">'
        +'<div class="tw__l"><b>'+esc(w.de)+'</b>'
        +(w.pl&&w.pl!=="—"?'<i>мн. '+esc(plForm(w.de.replace(ARTS,""),w.pl))+'</i>':'')
        +'<span class="tw__tr">'+esc(tr(w.de))+'</span></div>'
        +'<div class="tw__uk">'+esc(w.uk)+'</div>'
        +(canSpeak()?'<button class="tw__say" aria-label="Прослухати">'+SPKF+'</button>':'')
        +'</div>').join("")
      +'</div>'
      +'<p class="teach__tip">Тисни на слово, щоб почути. Далі — вправи саме на ці п\'ять.</p>'};
}
function teachRule(g){
  return {k:"teach",ex:"teach",head:"Правило дня",
    say:(g.ex&&g.ex[0])?g.ex[0][0]:"",
    body:'<div class="teach teach--rule">'
      +'<div class="teach__tag">'+esc(g.tag)+'</div>'
      +'<div class="teach__title">'+esc(g.t)+'</div>'
      +'<p class="teach__txt">'+g.txt+'</p>'
      +((g.ex&&g.ex[0])?'<div class="ex"><b>'+esc(g.ex[0][0])+'</b><div class="tr">'+esc(tr(g.ex[0][0]))+'</div><span>'+esc(g.ex[0][1])+'</span></div>':'')
      +(canSpeak()&&g.ex&&g.ex[0]?'<button class="speak speak--sm" id="bigSpeak" aria-label="Прослухати">'+SPKF+'</button>':'')
      +'</div>'};
}

/* ---- складання черги ---- */
function makeOne(d,k){ try{ return Object.assign({ex:k},EX[k].make(d)); }catch(e){ return null; } }

function buildQueue(d,n){
  const avail=EXKEYS.filter(k=>EX[k].need(d));
  const q=[]; let guard=0;
  while(q.length<n && guard++<300){
    const k=avail[q.length%avail.length];
    const item=makeOne(d,k); if(item) q.push(item);
  }
  return shuffle(q);
}

/* урок дня: 4 нових слова → вправи на них → наступна четвірка */
function buildDayQueue(day){
  const lv=day.lv, q=[];
  const rule = day.rule!=null ? G[lv][day.rule] : null;
  if(rule) q.push(teachRule(rule));
  const groups=[];
  for(let i=0;i<day.words.length;i+=5) groups.push(day.words.slice(i,i+5));
  groups.forEach((grp,gi)=>{
    q.push(teachGroup(grp,gi+1,groups.length));
    const d=ctx(lv,grp);
    const avail=EXKEYS.filter(k=>EX[k].need(d));
    /* по три вправи на четвірку — різних типів */
    shuffle(avail).slice(0,3).forEach(k=>{ const it=makeOne(d,k); if(it) q.push(it); });
  });
  /* фінальний блок: змішані вправи на всі 20 слів дня */
  const dAll=ctx(lv,day.words);
  buildQueue(dAll,5).forEach(x=>q.push(x));
  return q;
}

function startLesson(opts){
  const d=ctx(opts.lv,opts.words);
  let queue;
  if(opts.day)        queue=buildDayQueue(opts.day);
  else if(opts.queue) queue=opts.queue;
  else if(opts.only)  queue=Array.from({length:opts.n||14},()=>makeOne(d,opts.only)).filter(Boolean);
  else                queue=buildQueue(d,opts.n||14);
  if(!queue.length){alert("Для цього рівня вправа недоступна.");return;}
  L={...opts,d,queue,i:0,right:0,asked:0,solved:0,t0:Date.now(),xp:0,hintsUsed:0,total:queue.length};
  lessonEl.classList.add("is-on");
  document.body.style.overflow="hidden";
  renderQ();
}
function endLesson(){
  lessonEl.classList.remove("is-on");
  document.body.style.overflow="";
  try{speechSynthesis.cancel();}catch(e){}
  L=null; renderStreet(); renderProfile(); hud();
}
document.getElementById("lQuit").addEventListener("click",()=>{
  if(!L)return;
  if(L.i>0 && L.done!==true && !confirm("Вийти з уроку? Прогрес цього уроку не збережеться."))return;
  endLesson();
});

function lessonProgress(){
  const remain=L.queue.length-L.i;
  const denom=Math.max(1,L.solved+remain);
  return Math.round(L.solved/denom*100);
}
function comboBadge(){
  const el=document.getElementById("lCombo"); if(!el)return;
  const c=L.combo||0;
  if(c<3){ el.className="combo"; el.textContent=""; return; }
  el.className="combo is-on"+(c>=10?" combo--hot":"");
  el.textContent = c>=10 ? c+" поспіль · ×2 XP" : c+" поспіль";
}
function renderQ(){
  const q=L.queue[L.i];
  document.getElementById("lBar").style.width=lessonProgress()+"%";
  document.getElementById("lCount").textContent=L.solved+" / "+Math.max(L.total,L.solved+(L.queue.length-L.i));
  comboBadge();
  lFoot.className="lfoot"; L.locked=false; L.sel=null; L.hintOpen=false;
  let h='<div class="qtype">'+esc(q.head)+'</div>'+(q.body||"");
  if(q.k==="choice"){
    h+='<div class="opts'+(q.cols===3?" opts--3":" opts--2")+'" id="qOpts">'
      + q.opts.map((o,i)=>'<button class="opt'+(q.art?" opt--art k-"+o:"")+'" data-i="'+i+'">'+esc(o)+'</button>').join("")
      +'</div>';
  } else if(q.k==="type"){
    h+='<input class="typein" id="qType" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="німецькою…">';
  } else if(q.k==="build"){
    h+='<div class="slot" id="qSlot"></div><div class="tiles" id="qTiles">'
      + q.words.map((w,i)=>'<button class="tile" data-i="'+i+'">'+esc(w)+'</button>').join("")+'</div>';
  } else if(q.k==="pairs"){
    const left=shuffle(q.pairs.map((p,i)=>({t:p[0],i,s:"de"})));
    const right=shuffle(q.pairs.map((p,i)=>({t:p[1],i,s:"uk"})));
    L.pairsLeft=q.pairs.length;
    h+='<div class="pairs" id="qPairs">'
      +'<div class="pairs__col">'+left.map(x=>'<button class="pair" data-i="'+x.i+'" data-s="de">'+esc(x.t)+'</button>').join("")+'</div>'
      +'<div class="pairs__col">'+right.map(x=>'<button class="pair" data-i="'+x.i+'" data-s="uk">'+esc(x.t)+'</button>').join("")+'</div>'
      +'</div>';
  }
  /* підказка живе в тому місці, що раніше було порожнім */
  if(q.k!=="teach" && q.k!=="pairs"){
    h+='<div class="hintbox" id="hintBox">'
      +'<button class="hintbtn" id="hintBtn"><span class="hintbtn__ic">?</span>Підказка</button>'
      +'<div class="hintbody" id="hintBody"></div></div>';
  }
  lBody.innerHTML=h;
  lBody.parentElement.scrollTop=0;
  wire(q);
  if(q.k==="teach"){
    lFootIn.innerHTML='<button class="btn btn--green btn--wide" id="lNext">Зрозуміло</button>';
    document.getElementById("lNext").addEventListener("click",next);
  } else if(q.k==="pairs"){
    lFootIn.innerHTML='<p class="note" style="margin:0">Тисни німецьке слово, тоді його переклад.</p>';
  } else {
    lFootIn.innerHTML='<button class="btn btn--green btn--wide" id="lCheck" disabled>Перевірити</button>';
    document.getElementById("lCheck").addEventListener("click",check);
  }
  const hb=document.getElementById("hintBtn");
  if(hb)hb.addEventListener("click",()=>{
    if(L.hintOpen)return;
    L.hintOpen=true; L.hintsUsed++;
    document.getElementById("hintBox").classList.add("is-open");
    document.getElementById("hintBody").innerHTML=hintFor(q);
  });
}
function wire(q){
  const big=document.getElementById("bigSpeak");
  if(big){big.addEventListener("click",()=>say(q.say)); if(q.autoSay||q.k==="teach")setTimeout(()=>say(q.say),260);}
  lBody.querySelectorAll(".tw").forEach(row=>row.addEventListener("click",()=>{
    say(row.dataset.say);
    row.classList.add("is-said"); setTimeout(()=>row.classList.remove("is-said"),400);
  }));
  if(q.k==="choice"){
    lBody.querySelectorAll(".opt").forEach(b=>b.addEventListener("click",()=>{
      if(L.locked)return;
      lBody.querySelectorAll(".opt").forEach(x=>x.classList.remove("is-sel"));
      b.classList.add("is-sel"); L.sel=+b.dataset.i;
      document.getElementById("lCheck").disabled=false;
    }));
  }
  if(q.k==="type"){
    const inp=document.getElementById("qType");
    inp.addEventListener("input",()=>{document.getElementById("lCheck").disabled=!inp.value.trim();});
    inp.addEventListener("keydown",e=>{if(e.key==="Enter"&&inp.value.trim()){e.preventDefault();check();}});
    setTimeout(()=>inp.focus(),80);
  }
  if(q.k==="build"){
    const slot=document.getElementById("qSlot"), tiles=document.getElementById("qTiles");
    const sync=()=>{document.getElementById("lCheck").disabled=!slot.children.length;};
    tiles.querySelectorAll(".tile").forEach(t=>t.addEventListener("click",()=>{
      if(L.locked)return;
      const c=t.cloneNode(true); c.classList.remove("used");
      c.addEventListener("click",()=>{ if(L.locked)return; c.remove(); t.classList.remove("used"); sync(); });
      slot.appendChild(c); t.classList.add("used"); sync();
    }));
  }
  if(q.k==="pairs"){
    let sel=null;
    lBody.querySelectorAll(".pair").forEach(b=>b.addEventListener("click",()=>{
      if(b.classList.contains("gone"))return;
      if(!sel){ sel=b; b.classList.add("is-sel"); if(b.dataset.s==="de")say(q.pairs[+b.dataset.i][0]); return; }
      if(sel===b){ sel.classList.remove("is-sel"); sel=null; return; }
      if(sel.dataset.s===b.dataset.s){ sel.classList.remove("is-sel"); sel=b; b.classList.add("is-sel"); return; }
      if(sel.dataset.i===b.dataset.i){
        beep("ok"); [sel,b].forEach(x=>{x.classList.remove("is-sel");x.classList.add("gone");});
        sel=null; L.pairsLeft--;
        if(L.pairsLeft===0){ L.right++; L.solved++; L.asked++; addXP(2); L.xp+=2; setTimeout(next,340); }
      }else{
        beep("bad"); const a=sel,c=b; a.classList.add("no"); c.classList.add("no");
        setTimeout(()=>{a.classList.remove("no","is-sel");c.classList.remove("no");},550);
        sel=null;
      }
    }));
  }
}
const norm=s=>String(s).toLowerCase().replace(/[.,!?;:]/g,"").replace(/\s+/g," ").trim();
function check(){
  if(L.locked)return; L.locked=true;
  const q=L.queue[L.i]; let ok=false, corr="";
  if(q.k==="choice"){
    ok = L.sel===q.ans; corr=q.opts[q.ans];
    lBody.querySelectorAll(".opt").forEach(b=>{
      const i=+b.dataset.i;
      if(i===q.ans)b.classList.add("ok");
      else if(i===L.sel)b.classList.add("no");
      b.classList.remove("is-sel");
    });
  } else if(q.k==="type"){
    const v=norm(document.getElementById("qType").value);
    const accept=[q.ans].concat(q.strictArt?[]:(q.alt||[]));
    ok=accept.some(a=>norm(a)===v); corr=q.ans;
    const inp=document.getElementById("qType");
    inp.classList.add(ok?"ok":"no"); inp.blur();
  } else if(q.k==="build"){
    const got=[...document.getElementById("qSlot").children].map(x=>x.textContent).join(" ");
    ok=norm(got)===norm(q.ans); corr=q.ans;
  }
  L.asked++;
  if(ok){
    L.right++; L.solved++; beep("ok");
    L.combo=(L.combo||0)+1;
    if(L.combo>state.bestCombo) state.bestCombo=L.combo;
    todBump("combo",L.combo);
    const gain=L.combo>=10?2:1;          /* з десятого поспіль XP іде подвійний */
    addXP(gain); L.xp+=gain;
    if(q.ex==="audio"||q.ex==="listen"||q.ex==="dictate") todBump("listen");
    if(!q.retried) logCorrect(L.lv,q.say);
  } else {
    L.combo=0;
    beep("bad");
    logMistake(L.lv,q.say);
    /* безлімітні життя: питання не зникає, а повертається наприкінці */
    if(!q.retried){
      const again=Object.assign({},q,{retried:true});
      L.queue.push(again);
    } else { L.solved++; }
  }
  if(q.say)setTimeout(()=>say(q.say), ok?120:420);
  lFoot.className="lfoot "+(ok?"ok":"no");
  lFootIn.innerHTML=
    '<div class="verdict">'
    + (ok?'<svg viewBox="0 0 24 24" fill="none" stroke="var(--green-d)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/></svg>'
        :'<svg viewBox="0 0 24 24" fill="none" stroke="var(--red-d)" stroke-width="3" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="m9 9 6 6M15 9l-6 6"/></svg>')
    +'<div><b>'+(ok?esc(pick(WALDI_LINES.good)):"Правильно: "+esc(corr))+'</b>'
    + (ok?"":'<p>'+esc(q.retried?"Це слово повернеться ще раз наприкінці.":"Не страшно — покажу його ще раз у кінці уроку.")+'</p>')
    + (q.hint?'<span class="k">'+q.hint+'</span>':'')
    +'</div></div>'
    +'<button class="btn '+(ok?"btn--green":"btn--gold")+' btn--wide" id="lNext">Далі</button>';
  document.getElementById("lNext").addEventListener("click",next);
}
function next(){
  if(L.queue[L.i] && L.queue[L.i].k==="teach"){ L.solved++; L.total++; }
  L.i++;
  if(L.i>=L.queue.length) finish(); else renderQ();
}
function finish(){
  L.done=true;
  const secs=Math.round((Date.now()-L.t0)/1000);
  const acc=L.asked?Math.round(L.right/L.asked*100):100;
  state.answered+=L.asked; state.correct+=L.right; state.lessons++;
  todBump("lessons");
  if(acc>=100 && !L.hintsUsed) todBump("perfect");
  if(L.day) todBump("days");
  let bonus=10;
  if(acc>=100 && !L.hintsUsed) bonus+=10;
  addXP(bonus); L.xp+=bonus;
  let crowned=false;
  if(L.day){
    const k=DAYKEY(L.day.lv,L.day.i), cur=state.days[k]||0;
    if(cur<3){ state.days[k]=cur+1; crowned=true; }
  }
  if(L.mode==="sprint" && L.right>(state.sprintBest||0)) state.sprintBest=L.right;
  save(); beep("win"); confetti();
  document.getElementById("lBar").style.width="100%";
  lBody.innerHTML='<div class="endcard">'+waldi("happy",160)
    +'<h2>'+(L.day?"День пройдено":"Готово")+'</h2>'
    +'<p style="color:var(--ink-60)">'+esc(pick(WALDI_LINES.done))+'</p>'
    +'<div class="endstats">'
    +'<div class="endstat es-xp"><b>+'+L.xp+'</b><span>XP</span></div>'
    +'<div class="endstat es-acc"><b>'+acc+'%</b><span>влучність</span></div>'
    +'<div class="endstat es-time"><b>'+Math.floor(secs/60)+":"+String(secs%60).padStart(2,"0")+'</b><span>час</span></div>'
    +'</div>'
    +(crowned?'<p class="endcrown">+1 корона за цей день</p>':'')
    +(L.hintsUsed?'<p class="note">Підказок узято: '+L.hintsUsed+'. Це нормально — вони для того й є.</p>':'')
    +'</div>';
  lFoot.className="lfoot ok";
  lFootIn.innerHTML='<button class="btn btn--green btn--wide" id="lDone">Далі</button>';
  document.getElementById("lDone").addEventListener("click",endLesson);
}
