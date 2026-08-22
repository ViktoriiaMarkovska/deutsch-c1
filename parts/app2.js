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

/* ================= ДВИГУН УРОКУ ================= */
let L=null;
const lessonEl=document.getElementById("lesson");
const lBody=document.getElementById("lBody"), lFoot=document.getElementById("lFoot"), lFootIn=document.getElementById("lFootIn");

function buildQueue(d,n){
  const avail=EXKEYS.filter(k=>EX[k].need(d));
  const q=[]; let guard=0;
  while(q.length<n && guard++<300){
    const k=avail[q.length%avail.length];
    try{ q.push(Object.assign({ex:k},EX[k].make(d))); }catch(e){}
  }
  return shuffle(q);
}
function startLesson(opts){
  const d=ctx(opts.lv,opts.words);
  const queue = opts.only ? Array.from({length:opts.n||14},()=>Object.assign({ex:opts.only},EX[opts.only].make(d)))
                          : buildQueue(d,opts.n||14);
  if(!queue.length){alert("Для цього рівня вправа недоступна.");return;}
  L={...opts,d,queue,i:0,hearts:opts.hearts===false?Infinity:5,right:0,t0:Date.now(),xp:0};
  lessonEl.classList.add("is-on");
  document.body.style.overflow="hidden";
  renderQ();
}
function endLesson(){
  lessonEl.classList.remove("is-on");
  document.body.style.overflow="";
  L=null; renderPath(); renderProfile(); hud();
}
document.getElementById("lQuit").addEventListener("click",()=>{
  if(!L)return;
  if(L.i>0 && L.done!==true && !confirm("Вийти з уроку? Прогрес цього уроку не збережеться."))return;
  endLesson();
});
function hearts(){
  const h=document.getElementById("lHearts");
  if(L.hearts===Infinity){h.innerHTML='<svg viewBox="0 0 24 24" fill="currentColor" style="opacity:.35"><path d="M12 20s-7-4.6-7-9.5A4 4 0 0 1 12 7a4 4 0 0 1 7 3.5C19 15.4 12 20 12 20z"/></svg><b style="color:var(--ink-30)">∞</b>';return;}
  h.innerHTML='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20s-7-4.6-7-9.5A4 4 0 0 1 12 7a4 4 0 0 1 7 3.5C19 15.4 12 20 12 20z"/></svg><b>'+L.hearts+'</b>';
}
function renderQ(){
  const q=L.queue[L.i];
  document.getElementById("lBar").style.width=Math.round(L.i/L.queue.length*100)+"%";
  hearts(); lFoot.className="lfoot"; L.locked=false; L.sel=null;
  let h='<div class="qtype">'+esc(q.head)+'</div>'+(q.body||"");
  if(q.k==="choice"){
    h+='<div class="opts'+(q.cols===3?"":" opts--2")+'" '+(q.cols===3?'style="display:grid;grid-template-columns:repeat(3,1fr);gap:9px"':'')+' id="qOpts">'
      + q.opts.map((o,i)=>'<button class="opt'+(q.art?" k-"+o:"")+'" data-i="'+i+'"'+(q.art?' style="text-align:center;font-family:var(--disp);font-weight:800;font-size:clamp(21px,6vw,30px);padding:18px 4px"':'')+'>'+esc(o)+'</button>').join("")
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
      +'<div style="display:grid;gap:9px">'+left.map(x=>'<button class="pair" data-i="'+x.i+'" data-s="de">'+esc(x.t)+'</button>').join("")+'</div>'
      +'<div style="display:grid;gap:9px">'+right.map(x=>'<button class="pair" data-i="'+x.i+'" data-s="uk">'+esc(x.t)+'</button>').join("")+'</div>'
      +'</div>';
  }
  lBody.innerHTML=h;
  lBody.parentElement.scrollTop=0;
  wire(q);
  lFootIn.innerHTML = q.k==="pairs" ? '<p class="note" style="margin:0">Тисни німецьке слово, тоді його переклад.</p>'
    : '<button class="btn btn--green btn--wide" id="lCheck" disabled>Перевірити</button>';
  const chk=document.getElementById("lCheck"); if(chk)chk.addEventListener("click",check);
}
function wire(q){
  const big=document.getElementById("bigSpeak");
  if(big){big.addEventListener("click",()=>say(q.say)); if(q.autoSay)setTimeout(()=>say(q.say),260);}
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
        sel=null; L.pairsLeft--; L.right+=.2;
        if(L.pairsLeft===0){ L.right=Math.round(L.right); addXP(2); L.xp+=2; setTimeout(next,340); }
      }else{
        beep("bad"); const a=sel,c=b; a.classList.add("no"); c.classList.add("no");
        if(L.hearts!==Infinity){L.hearts--;hearts();}
        setTimeout(()=>{a.classList.remove("no","is-sel");c.classList.remove("no");},550);
        sel=null;
        if(L.hearts===0)setTimeout(fail,600);
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
    inp.style.borderColor= ok?"var(--green)":"var(--red)";
    inp.style.background = ok?"var(--green-l)":"var(--red-l)";
    inp.blur();
  } else if(q.k==="build"){
    const got=[...document.getElementById("qSlot").children].map(x=>x.textContent).join(" ");
    ok=norm(got)===norm(q.ans); corr=q.ans;
  }
  if(ok){ L.right++; beep("ok"); addXP(1); L.xp+=1; }
  else { beep("bad"); if(L.hearts!==Infinity){L.hearts--;hearts();} }
  if(q.say)setTimeout(()=>say(q.say), ok?120:420);
  lFoot.className="lfoot "+(ok?"ok":"no");
  lFootIn.innerHTML=
    '<div class="verdict">'
    + (ok?'<svg viewBox="0 0 24 24" fill="none" stroke="var(--green-d)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/></svg>'
        :'<svg viewBox="0 0 24 24" fill="none" stroke="var(--red-d)" stroke-width="3" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="m9 9 6 6M15 9l-6 6"/></svg>')
    +'<div><b>'+(ok?pick(WALDI_LINES.good):"Правильно: "+esc(corr))+'</b>'
    + (ok?"":'<p>'+esc(pick(WALDI_LINES.bad))+'</p>')
    + (q.hint?'<span class="k">'+q.hint+'</span>':'')
    +'</div></div>'
    +'<button class="btn '+(ok?"btn--green":"btn--gold")+' btn--wide" id="lNext">Далі</button>';
  document.getElementById("lNext").addEventListener("click",next);
  if(L.hearts===0){ setTimeout(fail,300); }
}
function next(){
  if(L.hearts===0){fail();return;}
  L.i++;
  if(L.i>=L.queue.length) finish(); else renderQ();
}
function fail(){
  L.done=true;
  document.getElementById("lBar").style.width="100%";
  lBody.innerHTML='<div class="endcard">'+waldi("sad",150)
    +'<h2>Серця скінчилися</h2><p style="color:var(--ink-60);max-width:34ch;margin:0 auto">'
    +'Це не поразка — це сигнал, що тему варто пройти ще раз. Слова з цього уроку нікуди не поділися.</p></div>';
  lFoot.className="lfoot"; 
  lFootIn.innerHTML='<button class="btn btn--gold btn--wide" id="lRetry" style="margin-bottom:9px">Спробувати ще раз</button>'
    +'<button class="btn btn--wide" id="lBack">Вийти</button>';
  document.getElementById("lRetry").addEventListener("click",()=>{const o=L; endLesson(); startLesson(o);});
  document.getElementById("lBack").addEventListener("click",endLesson);
}
function finish(){
  L.done=true;
  const secs=Math.round((Date.now()-L.t0)/1000);
  const acc=Math.round(L.right/L.queue.length*100);
  state.answered+=L.queue.length; state.correct+=Math.round(L.right); state.lessons++;
  let bonus=10; if(acc>=100)bonus+=10;
  addXP(bonus); L.xp+=bonus;
  let crowned=false;
  if(L.day){
    const k=DAYKEY(L.day.lv,L.day.i), cur=state.days[k]||0;
    if(acc>=60 && cur<3){ state.days[k]=cur+1; crowned=true; }
    else if(!cur && acc>=60) state.days[k]=1;
  }
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
    +(crowned?'<p style="font-family:var(--mono);font-size:12px;color:var(--gold-d);letter-spacing:.08em;text-transform:uppercase">+1 корона за цей день</p>':'')
    +'</div>';
  lFoot.className="lfoot ok";
  lFootIn.innerHTML='<button class="btn btn--green btn--wide" id="lDone">Далі</button>';
  document.getElementById("lDone").addEventListener("click",endLesson);
}
