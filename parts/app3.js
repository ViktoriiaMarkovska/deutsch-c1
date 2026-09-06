/* ================= НАВІГАЦІЯ ================= */
document.querySelectorAll("#tabs .tab").forEach(t=>t.addEventListener("click",()=>{
  document.querySelectorAll("#tabs .tab").forEach(x=>x.classList.toggle("is-on",x===t));
  document.querySelectorAll(".view").forEach(v=>v.classList.toggle("is-on",v.id==="v-"+t.dataset.v));
  window.scrollTo(0,0);
}));

/* ================= ВУЛИЦЯ =================
   Кожен рівень — квартал зі своїм кольором. Кожен день — будинок:
   зачинені віконниці = ще зарано, відчинені двері = тобі сюди,
   світло у вікні = пройдено. Кожен п'ятий будинок — крамниця персонажа. */

const LVLC={A1:"bA1",A2:"bA2",B1:"bB1",B2:"bB2",C1:"bC1"};
/* крамниця на кожному п'ятому будинку, персонажі чергуються по колу */
const shopFor=i=> (i%5===4) ? CASTKEYS[Math.floor(i/5)%CASTKEYS.length] : null;

function renderStreet(){
  const cur=currentDay();
  document.getElementById("pathWrap").innerHTML=LV.map(l=>{
    const V=VIERTEL[l], done=lvlDone(l), pct=Math.round(done/DAYS[l].length*100);
    return '<section class="viertel" style="--road:'+V.road+';--sky:'+V.sky+';--roof:'+V.roof+'">'
      +'<div class="viertel__head"><div class="viertel__card '+LVLC[l]+'">'
        +'<b>'+l+'</b><span>'+esc(V.name)+' · '+DAYS[l].length+' будинків</span>'
        +'<span class="lp">'+pct+'%</span></div></div>'
      +'<div class="street" style="--tileL:'+houseTile(l)+';--tileR:'+houseTile(l)+'">'
      +DAYS[l].map((d,i)=>{
        const dn=dayDone(l,i), op=dayOpen(l,i), now=cur&&cur.lv===l&&cur.i===i;
        const st=dn?"done":op?(now?"now":"open"):"lock";
        const sh=shopFor(i);
        const sty=' style="--sx:'+houseShift(i)+'px;--sc:'+houseScale(i)+'"';
        if(sh){
          const c=CAST[sh];
          return '<div class="hs hs--shop'+(op?"":" hs--lock")+'"'+sty+'>'
            +'<button class="shop" data-task="'+sh+'" style="--c:'+c.color+'" aria-label="'+esc(c.name)+' · '+esc(c.shop)+'">'
              +'<span class="shop__awning"></span>'
              +'<span class="shop__face">'+c.draw(64)+'</span>'
              +'<span class="shop__sign">'+esc(c.shop)+'</span>'
            +'</button>'
            +'<span class="hs__lbl">'+esc(c.name)+'</span></div>';
        }
        return '<div class="hs hs--'+st+'"'+sty+'>'
          +(now?'<span class="now-here">ти тут</span>':'')
          +'<button class="house" data-lv="'+l+'" data-i="'+i+'" aria-label="День '+(i+1)+': '+esc(d.theme)+'">'
            +'<span class="house__num">'+(i+1)+'</span>'
            +'<span class="house__door">'+houseArt(st,i,l)+'</span>'
          +'</button>'
          +(dayCrowns(l,i)>1?'<span class="hs__crowns">×'+dayCrowns(l,i)+'</span>':'')
          +'<span class="hs__lbl">'+esc(d.theme)+'</span></div>';
      }).join("")
      +'</div></section>';
  }).join("");
  document.querySelectorAll(".house").forEach(b=>b.addEventListener("click",()=>openDay(b.dataset.lv,+b.dataset.i)));
  document.querySelectorAll(".shop").forEach(b=>b.addEventListener("click",()=>openTask(b.dataset.task)));
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

const TASKNAME={elsa:"Робота над помилками",bruno:"Словобуд",kurt:"Спринт на час",greta:"Слово дня"};

/* ---- день: одразу в урок, без стіни тексту ---- */
function openDay(lv,i){
  const d=DAYS[lv][i];
  startLesson({lv,words:d.words,day:d});
}

/* ================= ЗАВДАННЯ ПЕРСОНАЖІВ ================= */
const sheet=document.getElementById("sheet"), sheetIn=document.getElementById("sheetIn");
sheet.addEventListener("click",e=>{if(e.target===sheet)closeSheet();});
function closeSheet(){sheet.classList.remove("is-on");document.body.style.overflow="";}
function openSheet(html){
  sheetIn.innerHTML='<div class="sheet__grab"></div>'+html;
  sheet.classList.add("is-on"); document.body.style.overflow="hidden";
}
function charHead(k,sub){
  const c=CAST[k];
  return '<div class="chhead" style="--c:'+c.color+'">'+c.draw(84)
    +'<div><span class="eyebrow">'+esc(c.who)+'</span>'
    +'<h2 class="chhead__n">'+esc(c.name)+'</h2>'
    +'<p class="chhead__l">'+esc(sub||c.line)+'</p></div></div>';
}
function openTask(k){
  if(k==="elsa") taskMistakes();
  else if(k==="bruno") taskCompound();
  else if(k==="kurt") taskSprint();
  else if(k==="greta") taskWotd();
}

/* --- Ельза: робота над помилками --- */
function taskMistakes(){
  const due=dueMistakes(), all=allMistakes();
  if(!all.length){
    openSheet(charHead("elsa","Поки що порожньо. Помились кілька разів — і я почну збирати.")
      +'<p class="note">Тут з\'являється все, на чому ти спіткнулася в уроках. Слово повертається через день, потім через три, потім через тиждень — і зникає, коли ти відповіси правильно чотири рази поспіль.</p>');
    return;
  }
  const rows=all.slice().sort((a,b)=>(a.due||"").localeCompare(b.due||"")).slice(0,40);
  openSheet(charHead("elsa")
    +'<div class="dayblock"><h4>Зібрано '+all.length+' · дозріло '+due.length+'</h4>'
    +'<div class="mlist">'+rows.map(m=>
       '<div class="mrow'+((!m.due||m.due<=today())?" is-due":"")+'">'
       +'<b>'+esc(m.t)+'</b>'
       +'<span class="mrow__box">коробка '+(m.box||0)+'/4</span>'
       +'<span class="mrow__due">'+((!m.due||m.due<=today())?"сьогодні":esc(m.due))+'</span></div>').join("")
    +'</div></div>'
    +(due.length?'<button class="btn btn--green btn--wide" id="mStart" style="margin-top:14px">Повторити '+due.length+' '+plural(due.length,"слово","слова","слів")+'</button>'
                :'<p class="note">На сьогодні все повторено. Наступні слова дозріють завтра.</p>'));
  const b=document.getElementById("mStart");
  if(b)b.addEventListener("click",()=>{ closeSheet(); startMistakeLesson(dueMistakes()); });
}
function startMistakeLesson(due){
  const q=[];
  due.slice(0,15).forEach(m=>{
    const lv=m.lv||"A1";
    const w=FLAT.find(x=>x.de===m.t)||FLAT.find(x=>x.de.replace(ARTS,"")===String(m.t).replace(ARTS,""));
    const d=ctx(lv, w?[w]:ALL[lv]);
    if(w){
      const kinds=EXKEYS.filter(k=>k!=="pairs"&&k!=="build"&&k!=="listen"&&k!=="gap"&&EX[k].need(d));
      const k=kinds.length?rnd(kinds):"de_uk";
      const it=makeOne(d,k); if(it) q.push(it);
    } else {
      const sd=ctx(lv);
      const it=makeOne(sd,"build"); if(it) q.push(it);
    }
  });
  if(!q.length){alert("Нема чого повторювати.");return;}
  startLesson({lv:due[0].lv||"A1",queue:shuffle(q),mode:"review"});
}

/* --- Бруно: словобуд --- */
const COMPS=COMP.trim().split(";").map(x=>{
  const p=x.trim().split("|");
  return {whole:p[0],parts:p[1].split("+"),uk:p[2],ukParts:p[3].split("+"),note:p[4]||""};
}).filter(x=>x.whole);
let cIdx=0,cScore=0;
function taskCompound(){
  cScore=0; nextCompound();
}
function nextCompound(){
  const c=rnd(COMPS);
  const bare=c.whole.replace(ARTS,"");
  const decoys=distinct(COMPS.filter(x=>x!==c),3,c,x=>x.whole).map(x=>x.parts[rnd([0,1])]||x.parts[0]);
  const tiles=shuffle(c.parts.concat(decoys.filter(d=>c.parts.indexOf(d)<0)).slice(0,c.parts.length+3));
  openSheet(charHead("bruno")
    +'<div class="dayblock"><h4>Збери слово · рахунок '+cScore+'</h4>'
    +'<div class="cw__uk">'+esc(c.uk)+'</div>'
    +'<div class="cw__hint">'+esc(c.ukParts.join(" + "))+'</div>'
    +'<div class="cw__slot" id="cwSlot"></div>'
    +'<div class="tiles" id="cwTiles">'+tiles.map((t,i)=>'<button class="tile" data-t="'+esc(t)+'">'+esc(t)+'</button>').join("")+'</div>'
    +'<div class="cw__fb" id="cwFb"></div>'
    +'</div>'
    +'<div style="display:grid;gap:9px;margin-top:12px">'
    +'<button class="btn btn--green btn--wide" id="cwCheck" disabled>Перевірити</button>'
    +'<button class="btn btn--wide" id="cwSkip">Інше слово</button></div>');
  const slot=document.getElementById("cwSlot"), fb=document.getElementById("cwFb");
  const picked=[];
  const sync=()=>{ slot.innerHTML=picked.map(t=>'<span class="tile tile--in">'+esc(t)+'</span>').join("");
                   document.getElementById("cwCheck").disabled=!picked.length; };
  document.querySelectorAll("#cwTiles .tile").forEach(t=>t.addEventListener("click",()=>{
    if(t.classList.contains("used"))return;
    t.classList.add("used"); picked.push(t.dataset.t); sync();
  }));
  slot.addEventListener("click",()=>{ if(!picked.length)return; const last=picked.pop();
    const t=[...document.querySelectorAll("#cwTiles .tile")].find(x=>x.dataset.t===last&&x.classList.contains("used"));
    if(t)t.classList.remove("used"); sync(); });
  document.getElementById("cwCheck").addEventListener("click",()=>{
    const ok=picked.join("").toLowerCase()===c.parts.join("").toLowerCase();
    if(ok){
      cScore++; beep("ok"); addXP(2); say(c.whole);
      fb.className="cw__fb ok";
      fb.innerHTML='<b>'+esc(c.whole)+'</b><div class="tr">'+esc(tr(c.whole))+'</div>'
        +(c.note?'<p>'+esc(c.note)+'</p>':'');
      setTimeout(nextCompound,c.note?2600:1500);
    }else{
      beep("bad"); fb.className="cw__fb no";
      fb.innerHTML='<b>Правильно: '+esc(c.parts.join(" + "))+'</b>'
        +(c.note?'<p>'+esc(c.note)+'</p>':'');
      setTimeout(nextCompound,2400);
    }
  });
  document.getElementById("cwSkip").addEventListener("click",nextCompound);
}

/* --- Курт: спринт на 60 секунд --- */
let spT=null;
function taskSprint(){
  openSheet(charHead("kurt")
    +'<div class="dayblock"><h4>Рекорд: '+(state.sprintBest||0)+'</h4>'
    +'<p style="font-size:15px;margin:0 0 10px">Шістдесят секунд. Стільки слів, скільки встигнеш. Помилка не карає — просто йдемо далі.</p>'
    +'<span class="eyebrow">Рівень</span><div class="pillrow" id="spLv" style="margin-top:6px"></div></div>'
    +'<button class="btn btn--green btn--wide" id="spGo" style="margin-top:12px">Поїхали</button>');
  let lv="A1";
  document.getElementById("spLv").innerHTML=LV.map(l=>'<button class="pill'+(l==="A1"?" is-on":"")+'" data-l="'+l+'">'+l+'</button>').join("");
  document.querySelectorAll("#spLv .pill").forEach(p=>p.addEventListener("click",()=>{
    lv=p.dataset.l; document.querySelectorAll("#spLv .pill").forEach(x=>x.classList.toggle("is-on",x===p));}));
  document.getElementById("spGo").addEventListener("click",()=>{ closeSheet(); runSprint(lv); });
}
function runSprint(lv){
  const d=ctx(lv);
  let score=0, left=60;
  lessonEl.classList.add("is-on"); document.body.style.overflow="hidden";
  document.getElementById("lCount").textContent="";
  const tick=()=>{
    left--;
    document.getElementById("lBar").style.width=(left/60*100)+"%";
    const t=document.getElementById("spClock"); if(t)t.textContent="0:"+String(Math.max(0,left)).padStart(2,"0");
    if(left<=0){ clearInterval(spT); endSprint(score); }
  };
  clearInterval(spT); spT=setInterval(tick,1000);
  const step=()=>{
    const q=makeOne(d,rnd(["uk_de","de_uk","artikel"]));
    if(!q){endSprint(score);return;}
    lBody.innerHTML='<div class="sprintbar"><span class="sprintbar__c" id="spClock">1:00</span>'
      +'<span class="sprintbar__s">✓ '+score+'</span></div>'
      +'<div class="qtype">'+esc(q.head)+'</div>'+(q.body||"")
      +'<div class="opts'+(q.cols===3?" opts--3":" opts--2")+'">'
      +q.opts.map((o,i)=>'<button class="opt'+(q.art?" opt--art k-"+o:"")+'" data-i="'+i+'">'+esc(o)+'</button>').join("")+'</div>';
    lFoot.className="lfoot"; lFootIn.innerHTML='<p class="note" style="margin:0">Тисни варіант — далі одразу наступне.</p>';
    lBody.querySelectorAll(".opt").forEach(b=>b.addEventListener("click",()=>{
      const ok=+b.dataset.i===q.ans;
      b.classList.add(ok?"ok":"no");
      if(ok){score++;beep("ok");} else {beep("bad"); logMistake(lv,q.say);}
      setTimeout(()=>{ if(left>0) step(); },ok?170:520);
    }));
  };
  step();
}
function endSprint(score){
  clearInterval(spT);
  const rec=score>(state.sprintBest||0);
  if(rec) state.sprintBest=score;
  addXP(Math.round(score/2)); save();
  if(rec) confetti(); beep("win");
  document.getElementById("lBar").style.width="100%";
  lBody.innerHTML='<div class="endcard">'+kurt(150,"happy")
    +'<h2>'+(rec?"Новий рекорд":"Час вийшов")+'</h2>'
    +'<div class="endstats"><div class="endstat es-xp"><b>'+score+'</b><span>правильних</span></div>'
    +'<div class="endstat es-acc"><b>'+(state.sprintBest||0)+'</b><span>рекорд</span></div>'
    +'<div class="endstat es-time"><b>+'+Math.round(score/2)+'</b><span>XP</span></div></div></div>';
  lFoot.className="lfoot ok";
  lFootIn.innerHTML='<button class="btn btn--green btn--wide" id="spDone">Далі</button>';
  document.getElementById("spDone").addEventListener("click",()=>{
    lessonEl.classList.remove("is-on"); document.body.style.overflow="";
    renderStreet(); renderProfile(); renderQuests(); hud(); checkMilestone();
  });
}

/* --- Ґрета: слово дня --- */
const WOTDS=WOTD.trim().split(";").map(x=>{
  const p=x.trim().split("|");
  return {de:p[0],uk:p[1],story:p[2],ex:p[3],exUk:p[4]};
}).filter(x=>x.de);
function wotdToday(){
  const d=new Date(), n=Math.floor((d-new Date(d.getFullYear(),0,0))/864e5);
  return WOTDS[n%WOTDS.length];
}
function taskWotd(){
  const w=wotdToday();
  openSheet(charHead("greta")
    +'<div class="wotd">'
    +'<div class="wotd__de">'+esc(w.de)+'</div>'
    +'<div class="wotd__tr">'+esc(tr(w.de))+'</div>'
    +(canSpeak()?'<button class="speak speak--sm" id="wotdSay" aria-label="Прослухати">'+SPKF+'</button>':'')
    +'<div class="wotd__uk">'+esc(w.uk)+'</div>'
    +'<div class="wotd__story">'+esc(w.story)+'</div>'
    +'<div class="ex"><b>'+esc(w.ex)+'</b><div class="tr">'+esc(tr(w.ex))+'</div><span>'+esc(w.exUk)+'</span></div>'
    +'</div>'
    +'<p class="note">Завтра тут буде інше слово. Усього в Ґрети їх '+WOTDS.length+'.</p>');
  const b=document.getElementById("wotdSay");
  if(b){ b.addEventListener("click",()=>say(w.de)); setTimeout(()=>say(w.de),300); }
  if(state.wotdSeen!==today()){ state.wotdSeen=today(); addXP(2); save(); }
}

/* ================= ЩОДЕННІ ЗАВДАННЯ ================= */
function renderQuests(){
  const box=document.getElementById("quests"); if(!box)return;
  const qs=questsToday();
  const all=qs.every(questDone);
  const claimed=state.questClaimed===today();
  box.innerHTML=
    '<div class="quests__top"><span class="eyebrow">Завдання дня</span>'
    +((state.freeze||0)>0?'<span class="frz">❄ '+state.freeze+'</span>':'<span class="eyebrow">'+qs.filter(questDone).length+' з 3</span>')
    +'</div>'
    +qs.map(q=>{
      const cur=Math.min(q.get(state),q.goal), done=cur>=q.goal;
      return '<div class="q'+(done?" is-done":"")+'">'
        +'<span class="q__ic">'+(done?"✓":q.ic)+'</span>'
        +'<span class="q__b"><span class="q__t">'+esc(q.t)+'</span>'
        +'<span class="q__bar"><i style="width:'+Math.round(cur/q.goal*100)+'%"></i></span></span>'
        +'<span class="q__n">'+cur+'/'+q.goal+'</span></div>';
    }).join("")
    +'<div class="chest'+(all&&!claimed?" is-ready":"")+'">'
      +'<span style="font-size:24px">'+(claimed?"🎁":all?"🎁":"🔒")+'</span>'
      +'<span><b>'+(claimed?"Скриню відкрито":all?"Скриня готова":"Скриня")+'</b>'
      +'<span>'+(claimed?"Завтра будуть нові завдання."
                :all?"Заморозка серії та 20 XP."
                :"Виконай усі три завдання дня.")+'</span></span>'
      +(all&&!claimed?'<button class="btn btn--gold" id="qClaim">Забрати</button>':'')
    +'</div>';
  const b=document.getElementById("qClaim");
  if(b)b.addEventListener("click",()=>{
    if(claimQuests()){ beep("win"); confetti(); renderQuests(); hud(); }
  });
}

/* ================= ЕКРАН ЕТАПУ ================= */
function showMilestone(n){
  const el=document.getElementById("mile"), box=document.getElementById("mileIn");
  const days=ALLDAYS.filter(d=>dayDone(d.lv,d.i)).length;
  box.innerHTML=waldi("happy",150)
    +'<div class="mile__n">'+n+'</div>'
    +'<div class="mile__t">'+plural(n,"день поспіль","дні поспіль","днів поспіль")+'</div>'
    +'<p class="mile__p">'+esc(MILE_WORD[n]||"")+'</p>'
    +'<div class="mile__stats">'
      +'<div class="mile__s"><b>'+knownCount()+'</b><span>слів вивчено</span></div>'
      +'<div class="mile__s"><b>'+days+'</b><span>днів пройдено</span></div>'
      +'<div class="mile__s"><b>'+state.xp+'</b><span>усього XP</span></div>'
      +'<div class="mile__s"><b>'+state.bestCombo+'</b><span>найдовше комбо</span></div>'
    +'</div>'
    +'<button class="btn btn--green btn--wide" id="mileOk">Далі</button>';
  el.classList.add("is-on"); document.body.style.overflow="hidden";
  beep("win"); confetti();
  document.getElementById("mileOk").addEventListener("click",()=>{
    el.classList.remove("is-on"); document.body.style.overflow="";
    state.pendingMile=null; save();
  });
}
function checkMilestone(){ if(state.pendingMile) showMilestone(state.pendingMile); }

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
    if(state.known[id]) todBump("words");
    save(); vStat(); hud(); renderQuests();
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
  {ic:"📚",t:"Дві тисячі слів",d:"позначити 2000 слів вивченими",ok:()=>knownCount()>=2000},
  {ic:"🏁",t:"A1 закрито",d:"пройти всі 80 днів A1",ok:()=>lvlDone("A1")>=DAYS.A1.length},
  {ic:"🎧",t:"Вухо",d:"1000 XP",ok:s=>s.xp>=1000},
  {ic:"🥨",t:"Знавець артиклів",d:"200 правильних відповідей",ok:s=>s.correct>=200},
  {ic:"🌙",t:"Марафон",d:"серія 30 днів",ok:s=>s.best>=30},
  {ic:"👑",t:"Von Null bis C1",d:"пройти всі 322 дні",ok:()=>LV.every(l=>lvlDone(l)>=DAYS[l].length)}
];
function renderProfile(){
  const total=ALLDAYS.filter(d=>dayDone(d.lv,d.i)).length;
  const acc=state.answered?Math.round(state.correct/state.answered*100):0;
  document.getElementById("statGrid").innerHTML=
    [["Днів пройдено",total+" / "+ALLDAYS.length],["Слів вивчено",knownCount()+" / "+TOTALW],
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
    const done=lvlDone(L2.code), pct=Math.round(done/DAYS[L2.code].length*100);
    return '<button class="lvlrow" data-c="'+L2.code+'" style="width:100%;text-align:left;cursor:pointer">'
      +'<span class="lvlrow__c '+LVLC[L2.code]+'">'+L2.code+'</span>'
      +'<span><span class="lvlrow__t">'+esc(L2.name)+'</span><span class="lvlrow__s">'+esc(L2.months)+' · '+done+' з '+DAYS[L2.code].length+' днів</span></span>'
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

/* ---- вибір голосу ---- */
function renderVoicePicker(){
  const el=document.getElementById("voicePick"); if(!el)return;
  if(!deVoices.length){ el.innerHTML='<p class="note" style="margin:0">Браузер не дає списку голосів. Озвучка працюватиме системним голосом.</p>'; return; }
  el.innerHTML='<div class="vlist">'+deVoices.map((v,i)=>{
    const on=(state.voice? v.name===state.voice : i===0);
    const tag=voiceTag(v);
    return '<button class="vrow'+(on?" is-on":"")+'" data-n="'+esc(v.name)+'">'
      +'<span class="vrow__r"></span><b>'+esc(v.name)+'</b><span class="vrow__t">'+tag+'</span></button>';
  }).join("")+'</div>';
  el.querySelectorAll(".vrow").forEach(b=>b.addEventListener("click",()=>{
    state.voice=b.dataset.n; pickVoice(); save(); renderVoicePicker();
    say("Guten Tag! Ich helfe dir beim Deutschlernen.");
  }));
  renderVoiceHelp();
}
/* якщо все, що дає пристрій, звучить погано — розгортаємо інструкцію одразу */
function renderVoiceHelp(){
  const box=document.getElementById("voiceHelp"); if(!box)return;
  /* Записане аудіо звучить однаково на будь-якому пристрої, тож коли воно
     працює — решта підказок про системні голоси просто не потрібна. */
  if(audioOK===true){
    box.innerHTML='<div class="vok"><b>Записаний голос працює</b>'
      +'<p>Озвучку начитано наперед, тож вона звучить однаково на цьому '
      +'й на будь-якому іншому пристрої. Голоси системи нижче ні на що не впливають.</p></div>';
    return;
  }
  const h=VOICE_HELP[platformKey()]||VOICE_HELP.other;
  const best=deVoices.length?voiceScore(deVoices[0]):-99;
  const weak=best<38;
  const noFile=(audioOK===false);
  box.innerHTML=
    (noFile?'<div class="vwarn"><b>Записане аудіо не грає</b>'
        +'<p>Цей браузер не зміг відтворити наші файли, тому читає системний голос. '
        +'Спробуй оновити сторінку або відкрити в іншому браузері.</p></div>':'')
    +(weak?'<div class="vwarn"><b>Голос звучить роботом?</b>'
        +'<p>Це не сайт — це пристрій. '+(deVoices.length===1?'У тебе встановлено лише один німецький голос.':'Усі наявні голоси тут компактні.')
        +' Кращий ставиться безкоштовно за півхвилини.</p></div>':'')
    +'<details class="vhelp"'+(weak?' open':'')+'>'
    +'<summary>Як поставити кращий голос · '+esc(h.t)+'</summary>'
    +'<p class="note" style="margin:8px 0 10px">'+esc(h.note)+'</p>'
    +'<ol class="vsteps">'+h.steps.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ol>'
    +'</details>';
}
const rr=document.getElementById("rateRange");
if(rr){
  rr.addEventListener("input",e=>{
    state.rate=+e.target.value;
    document.getElementById("rateOut").textContent=state.rate.toFixed(2);
    save();
  });
}
const vt=document.getElementById("voiceTest");
if(vt)vt.addEventListener("click",()=>say("Guten Tag! Ich helfe dir beim Deutschlernen."));

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
  state={known:{},days:{},xp:0,xpToday:0,xpDate:today(),streak:0,lastDay:"",best:0,answered:0,correct:0,lessons:0,
    mistakes:{},voice:state.voice,rate:state.rate,sprintBest:0,wotdSeen:""};
  save(); renderStreet(); renderVocab(); renderProfile(); hud();
});

/* ================= СТАРТ ================= */
(async function(){
  await load();
  pickVoice();                       /* стан уже є — підхопить збережений голос */
  renderVoicePicker();
  hud(); renderStreet(); renderQuests(); renderVocab(); renderG(); renderDecl();
  renderTrainer(); renderProfile(); planner();
})();
