/* ================= ВАЛЬДІ · маскот ================= */
/* Вальді — такса. Не сова: такса це найнімецькіший пес, якого лише можна уявити,
   а ще в неї довге тіло, у яке чудово вміщається довге німецьке слово.
   Нашийник у кольорах прапора: чорний · червоний · золотий. */
function waldi(mood,size){
  mood=mood||"idle"; size=size||120;
  var eye = mood==="sad" ? '<path d="M52 47c2-2 5-2 7 0M76 47c2-2 5-2 7 0" stroke="#221F1A" stroke-width="3.4" fill="none" stroke-linecap="round"/>'
        : mood==="happy" ? '<path d="M51 48c2.5-3 6.5-3 9 0M75 48c2.5-3 6.5-3 9 0" stroke="#221F1A" stroke-width="3.4" fill="none" stroke-linecap="round"/>'
        : '<circle cx="56" cy="48" r="4.2" fill="#221F1A"/><circle cx="80" cy="48" r="4.2" fill="#221F1A"/><circle cx="57.4" cy="46.6" r="1.5" fill="#fff"/><circle cx="81.4" cy="46.6" r="1.5" fill="#fff"/>';
  var mouth = mood==="sad" ? '<path d="M62 68c4-4 10-4 14 0" stroke="#221F1A" stroke-width="3" fill="none" stroke-linecap="round"/>'
        : mood==="happy" ? '<path d="M60 62c4 8 14 8 18 0" stroke="#221F1A" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M64 66c3 4 8 4 11 0z" fill="#E4342F"/>'
        : '<path d="M62 63c4 5 11 5 15 0" stroke="#221F1A" stroke-width="3" fill="none" stroke-linecap="round"/>';
  return '<svg class="waldi waldi--'+mood+'" viewBox="0 0 200 130" width="'+size+'" role="img" aria-label="Вальді, такса">'
  +'<ellipse cx="100" cy="122" rx="72" ry="6" fill="#221F1A" opacity=".08"/>'
  /* хвіст */
  +'<path class="w-tail" d="M168 78c12-4 16-16 10-26" stroke="#C98430" stroke-width="9" fill="none" stroke-linecap="round"/>'
  /* лапи */
  +'<rect x="58" y="96" width="17" height="22" rx="8" fill="#B0701F"/><rect x="86" y="96" width="17" height="22" rx="8" fill="#B0701F"/>'
  +'<rect x="126" y="96" width="17" height="22" rx="8" fill="#B0701F"/><rect x="148" y="96" width="17" height="22" rx="8" fill="#B0701F"/>'
  /* тіло — довге, як німецьке слово */
  +'<rect x="52" y="58" width="122" height="46" rx="23" fill="#E0A03C"/>'
  +'<rect x="52" y="76" width="122" height="28" rx="14" fill="#F0BA5F" opacity=".55"/>'
  /* голова */
  +'<circle cx="68" cy="52" r="34" fill="#E0A03C"/>'
  /* вуха */
  +'<path d="M40 34c-13 2-19 16-16 30 3 13 12 19 20 15 6-3 6-14 3-25-2-9-3-19-7-20z" fill="#7A431A"/>'
  +'<path d="M92 32c12 1 19 14 17 28-2 12-10 18-17 15-6-3-7-13-4-24 2-9 1-18 4-19z" fill="#8B4E1E"/>'
  /* морда */
  +'<ellipse cx="70" cy="66" rx="20" ry="14" fill="#F5CE8A"/>'
  +'<ellipse cx="70" cy="55" rx="8" ry="6" fill="#221F1A"/>'
  +eye+mouth
  /* нашийник у кольорах прапора */
  +'<rect x="98" y="58" width="7" height="44" fill="#221F1A"/><rect x="105" y="58" width="7" height="44" fill="#E4342F"/><rect x="112" y="58" width="7" height="44" fill="#FFC814"/>'
  +'</svg>';
}
var WALDI_LINES={
  start:["Los geht's! Починаємо.","Один урок — і день зарахований.","Я вже чекав. Берімося."],
  good:["Sehr gut! Так тримати.","Оце по-німецьки.","Bravo. Далі буде важче — і цікавіше."],
  bad:["Nicht schlimm. Помилка — це теж дані.","Спокійно. Я сам плутав der і die пів року.","Ще раз — і воно закріпиться."],
  done:["Fertig! День закрито.","Ще один день позаду. Завтра о тій самій порі?","Das war stark. Відпочинь."]
};
var pick=function(a){return a[Math.floor(Math.random()*a.length)];};

/* ================= ТРАНСКРИПЦІЯ ================= */
const VEX=["universit","variab","interview","investit","revoluti","evident","validit","prävention","privat","aktiv","positiv","negativ","motiv","servi","konserv","provinz","vision","vulkan","vitamin","video","klavier","vase","villa","vers","verb","vokab","vokal","virus","novemb","silvester","advent","vegetari","devise","provision","version","vitrine","revision","universum","souvenir","niveau","initiativ","alternativ","attraktiv","effektiv","intensiv","relativ","perspektiv","provokat","invest","konversat","reservier","serviert","novelle","villa"];
const PRE=["aus","ein","vor","auf","mit","ver","ent","über","unter","frei","früh","bahn","haupt","arbeits","hoch","an","um","zu","wieder","zusammen","fest","land","jahres","staats"];
const ARTS=/^(der|die|das)\s+/i;
function tr(s){
 var t=String(s).toLowerCase().replace(/[^a-zäöüß\s'\-\/,]/g,"");
 VEX.forEach(function(x){ if(t.indexOf(x)>-1) t=t.split(x).join(x.replace(/v/g,"в")); });
 t=t.replace(new RegExp("("+PRE.join("|")+")(sp|st)","g"),function(m,p,q){return p+(q==="st"?"шт":"шп");});
 t=t.replace(/(^|\s)sp/g,"$1шп").replace(/(^|\s)st/g,"$1шт");
 t=t.replace(/tsch/g,"ч").replace(/sch/g,"ш");
 t=t.replace(/chen(?=\s|$)/g,"хен").replace(/chs/g,"кс").replace(/ch/g,"х");
 t=t.replace(/ck/g,"к").replace(/ph/g,"ф").replace(/th/g,"т").replace(/qu/g,"кв").replace(/pf/g,"пф").replace(/dt/g,"т");
 t=t.replace(/tion/g,"ціон");
 t=t.replace(/ß/g,"с").replace(/ss/g,"с");
 t=t.replace(/s(?=[aeiouäöü])/g,"з");
 t=t.replace(/([bdfglmnprtz])\1/g,"$1");
 t=t.replace(/ig(?=keit|lich)/g,"іх");
 t=t.replace(/ie/g,"і").replace(/ei/g,"ай").replace(/ai/g,"ай").replace(/äu/g,"ой").replace(/eu/g,"ой").replace(/au/g,"ау");
 t=t.replace(/ig(?=\s|$)/g,"іх");
 t=t.replace(/([aeiouäöü])h/g,"$1");
 t=t.replace(/ä/g,"е").replace(/(^|\s)ö/g,"$1о").replace(/ö/g,"ьо").replace(/ü/g,"ю");
 t=t.replace(/ng/g,"нг").replace(/nk/g,"нк");
 var M={a:"а",b:"б",c:"к",d:"д",e:"е",f:"ф",g:"ґ",h:"г",i:"і",j:"й",k:"к",l:"л",m:"м",n:"н",o:"о",p:"п",q:"к",r:"р",s:"с",t:"т",u:"у",v:"ф",w:"в",x:"кс",y:"ю",z:"ц"};
 return t.replace(/[a-z]/g,function(c){return M[c]||c;});
}
/* транскрипція БЕЗ артикля — щоб не підказувати відповідь у вправі «der/die/das» */
function trBare(s){ return tr(String(s).replace(ARTS,"")); }

/* ================= ДАНІ ================= */
const LV=["A1","A2","B1","B2","C1"];
const parse=s=>s.split(";").map(x=>x.split("|"));
const ALL={}, THEMES={}; let TOTALW=0;
LV.forEach(l=>{ALL[l]=[];THEMES[l]=[];Object.entries(V[l]).forEach(([th,s])=>{
  const arr=parse(s).map(w=>({de:w[0],pl:w[1],uk:w[2],th,lv:l}));
  THEMES[l].push({th,words:arr}); arr.forEach(w=>{ALL[l].push(w);TOTALW++;});
});});
const FLAT=LV.flatMap(l=>ALL[l]);
const isNoun=w=>ARTS.test(w.de);
const NOUNS=FLAT.filter(isNoun).map(w=>({art:w.de.split(" ")[0].toLowerCase(),n:w.de.replace(ARTS,""),uk:w.uk,pl:w.pl,lv:w.lv}));
const NOUNS_LV={}; LV.forEach(l=>NOUNS_LV[l]=NOUNS.filter(n=>n.lv===l));
const SENTS={}, GAPS={}, VIDS={};
LV.forEach(l=>{
  SENTS[l]=SENT[l].split(";").map(x=>{const p=x.split("|");return {de:p[0],uk:p[1]};});
  GAPS[l]=GAP[l].split(";").map(x=>{const p=x.split("|");return {s:p[0],ans:p[1],wrong:p[2].split(","),uk:p[3],hint:p[4]};});
  VIDS[l]=VID[l].split(";").map(x=>{const p=x.split("|");return {ch:p[0],q:p[1]};});
});

/* ---- 100 днів: один день = одна тема з 20 слів ---- */
const DAYS={}; let prevRule=-1;
LV.forEach(l=>{
  DAYS[l]=THEMES[l].map((t,i)=>{
    const ri=Math.floor(i*G[l].length/THEMES[l].length);
    const rule = ri!==prevRule ? ri : null; prevRule=ri;
    return {lv:l,i,theme:t.th,words:t.words,rule,vid:VIDS[l][i]||null};
  });
  prevRule=-1;
});
const DAYKEY=(lv,i)=>lv+"#"+i;
const ALLDAYS=LV.flatMap(l=>DAYS[l]);

/* ================= СТАН ================= */
let state={known:{},days:{},xp:0,xpToday:0,xpDate:"",streak:0,lastDay:"",best:0,answered:0,correct:0,lessons:0,
  mistakes:{},voice:"",rate:0.95,sprintBest:0,wotdSeen:"",
  tod:{date:"",combo:0,days:0,perfect:0,words:0,mistakes:0,lessons:0,listen:0},
  freeze:0,questClaimed:"",miles:{},bestCombo:0};
const KEY="de-c1-v3";
const ST={
  async get(k){if(window.storage&&window.storage.get){try{return await window.storage.get(k);}catch(e){}}try{const v=localStorage.getItem(k);return v?{value:v}:null;}catch(e){return null;}},
  async set(k,v){if(window.storage&&window.storage.set){try{return await window.storage.set(k,v);}catch(e){}}try{localStorage.setItem(k,v);return 1;}catch(e){return null;}}
};
const today=()=>new Date().toISOString().slice(0,10);
const yday=()=>new Date(Date.now()-864e5).toISOString().slice(0,10);
async function load(){
  try{const r=await ST.get(KEY); if(r&&r.value) state=Object.assign(state,JSON.parse(r.value));}catch(e){}
  if(state.xpDate!==today()){state.xpDate=today();state.xpToday=0;}
  if(!state.tod||state.tod.date!==today())
    state.tod={date:today(),combo:0,days:0,perfect:0,words:0,mistakes:0,lessons:0,listen:0};
  /* Пропущений день не мусить убивати серію на сорок днів — саме через це
     люди найчастіше кидають. Одну прогалину закриває заморозка.          */
  if(state.lastDay && state.lastDay!==today() && state.lastDay!==yday()){
    const gap=Math.round((Date.parse(today())-Date.parse(state.lastDay))/864e5);
    if(gap===2 && (state.freeze||0)>0){
      state.freeze--; state.lastDay=yday(); state.frozeJust=true;
    } else state.streak=0;
  }
}
let saveT=null;
function save(){
  clearTimeout(saveT);
  saveT=setTimeout(async()=>{
    try{const ok=await ST.set(KEY,JSON.stringify(state)); if(!ok)throw 0;}
    catch(e){const n=document.getElementById("savedNote"); if(n)n.textContent="Увага: прогрес не зберігається — працює лише в цій сесії.";}
  },250);
}
const GOAL=30;
function addXP(n){
  state.xp+=n;
  if(state.xpDate!==today()){state.xpDate=today();state.xpToday=0;}
  state.xpToday+=n;
  if(state.xpToday>=GOAL && state.lastDay!==today()){
    state.lastDay=today(); state.streak+=1;
    if(state.streak>state.best) state.best=state.streak;
    const m=milestoneFor(state.streak);
    if(m && !state.miles[m]){ state.miles[m]=1; state.pendingMile=m; }
  }
  hud(); save();
}
/* ---- помилки за Лейтнером: коробки 0..4, повтор через 0/1/3/7/16 днів ----
   Раніше програма забувала помилки одразу. Тепер кожен промах живе доти,
   доки не буде відтворений правильно чотири рази поспіль.               */
const BOXDAYS=[0,1,3,7,16];
const addDays=n=>new Date(Date.now()+n*864e5).toISOString().slice(0,10);
const mkey=(lv,t)=>lv+"|"+String(t||"").trim();
function logMistake(lv,t){
  t=String(t||"").trim(); if(!t)return;
  const k=mkey(lv,t);
  const m=state.mistakes[k]||{t:t,lv:lv,box:0,n:0};
  m.n=(m.n||0)+1; m.box=0; m.due=today();
  state.mistakes[k]=m; save();
}
function logCorrect(lv,t){
  t=String(t||"").trim(); if(!t)return;
  const k=mkey(lv,t), m=state.mistakes[k];
  if(!m)return;
  m.box=Math.min(BOXDAYS.length-1,(m.box||0)+1);
  if(m.box>=BOXDAYS.length-1) delete state.mistakes[k];   /* засвоєно — відпускаємо */
  else m.due=addDays(BOXDAYS[m.box]);
  save();
}
const allMistakes=()=>Object.values(state.mistakes||{});
const dueMistakes=()=>{const t=today();return allMistakes().filter(m=>!m.due||m.due<=t);};

const dayDone=(lv,i)=>!!state.days[DAYKEY(lv,i)];
const dayCrowns=(lv,i)=>state.days[DAYKEY(lv,i)]||0;
const lvlDone=l=>DAYS[l].filter((d,i)=>dayDone(l,i)).length;
const knownCount=()=>Object.values(state.known).filter(Boolean).length;
function todBump(k,v){ if(!state.tod||state.tod.date!==today())
    state.tod={date:today(),combo:0,days:0,perfect:0,words:0,mistakes:0,lessons:0,listen:0};
  state.tod[k]=Math.max(state.tod[k]||0, v===undefined?(state.tod[k]||0)+1:v); }
const wid=w=>w.lv+"|"+w.de;
/* перший день рівня відкритий завжди — щоб не починати з нуля, якщо ти вже не з нуля */
const dayOpen=(lv,i)=> i===0 || dayDone(lv,i-1);

function hud(){
  document.getElementById("stFire").textContent=state.streak;
  document.getElementById("stXp").textContent=state.xp;
  document.getElementById("stWord").textContent=knownCount();
  const g=Math.min(100,Math.round(state.xpToday/GOAL*100));
  const gb=document.getElementById("goalBar"); if(gb)gb.style.width=g+"%";
  const gt=document.getElementById("goalTxt"); if(gt)gt.textContent=state.xpToday+" / "+GOAL+" XP";
  const gn=document.getElementById("goalNote");
  if(gn)gn.textContent = state.xpToday>=GOAL
    ? "Ціль на сьогодні виконана. Серія: "+state.streak+" "+plural(state.streak,"день","дні","днів")+". Далі — за бажанням."
    : "Один урок ≈ 30 XP — цього вистачає, щоб закрити день. Два уроки на день — і за 322 дні ти пройдеш усю програму.";
}
function plural(n,a,b,c){const n1=n%10,n2=n%100;return n2>=11&&n2<=14?c:n1===1?a:n1>=2&&n1<=4?b:c;}

/* ================= ЗВУК ================= */
let AC=null;
function beep(type){
  try{
    AC=AC||new (window.AudioContext||window.webkitAudioContext)();
    const seq = type==="ok" ? [[660,0],[880,.09]] : type==="bad" ? [[200,0],[150,.1]] : [[523,0],[659,.09],[784,.18],[1047,.27]];
    seq.forEach(([f,t])=>{
      const o=AC.createOscillator(),g=AC.createGain();
      o.type= type==="bad"?"square":"sine"; o.frequency.value=f;
      g.gain.setValueAtTime(.0001,AC.currentTime+t);
      g.gain.exponentialRampToValueAtTime(.14,AC.currentTime+t+.01);
      g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+t+.19);
      o.connect(g);g.connect(AC.destination);o.start(AC.currentTime+t);o.stop(AC.currentTime+t+.2);
    });
  }catch(e){}
}
/* ================= ОЗВУЧКА =================
   Головна причина «робота» в попередній версії: бралося просто перше-ліпше
   de-DE, а перше-ліпше майже завжди — стара Anna (macOS) або compact-голос.
   Тепер голоси ранжуються за якістю, і на кожній платформі вибирається
   найкращий доступний: Google Deutsch на Android, Katja/Conrad Online на
   Windows, Siri/Premium на Apple.                                          */
let deVoice=null, deVoices=[];
const VOICE_GOOD=[
  [/siri/i,60],[/premium/i,55],[/enhanced/i,50],[/neural/i,50],[/natural/i,50],
  [/\bonline\b/i,45],[/google/i,45],
  [/helena|martin|katja|conrad|petra|markus|hedda|stefan/i,40],
  [/sandy|reed|flo|rocko|eddy|shelley|grandma|grandpa/i,25]
];
const VOICE_BAD=[[/compact/i,-40],[/eloquence/i,-60],[/\banna\b|анна/i,-30]];
function voiceScore(v){
  let n=0; const name=v.name||"";
  VOICE_GOOD.forEach(([re,pts])=>{ if(re.test(name)) n+=pts; });
  VOICE_BAD.forEach(([re,pts])=>{ if(re.test(name)) n+=pts; });
  if(/^de[-_]DE/i.test(v.lang)) n+=10;          /* саме німецька Німеччини */
  if(v.localService===false) n+=8;              /* хмарні зазвичай нейронні */
  return n;
}
/* Голоси не можна «привезти» з сайту — їх дає сам пристрій. Зате майже
   скрізь кращий голос ставиться за півхвилини в налаштуваннях, тому
   показуємо інструкцію саме під ту систему, з якої зайшли.              */
function platformKey(){
  const ua=navigator.userAgent||"";
  if(/iPhone|iPad|iPod/.test(ua)) return "ios";
  if(/Android/.test(ua)) return "android";
  if(/Macintosh/.test(ua)) return (navigator.maxTouchPoints>1)?"ios":"mac";
  if(/Windows/.test(ua)) return "win";
  return "other";
}
const VOICE_HELP={
 ios:{t:"iPhone або iPad",note:"iOS ставить компактний голос за замовчуванням. «Покращений» звучить майже як людина і важить кілька мегабайтів.",
   steps:["Налаштування → Універсальний доступ","Усне мовлення → Голоси → Deutsch","Вибери Anna або Helena і натисни значок завантаження — це версія «Покращена» чи «Преміум»","Повернись сюди й онови сторінку"]},
 android:{t:"Android",note:"Стандартний рушій виробника часто звучить роботом. Google-івський — нейронний і безкоштовний.",
   steps:["Налаштування → Спеціальні можливості → Синтез мовлення","Механізм: вибери Google Text-to-speech","Шестерня поруч → Установити голосові дані → Deutsch","Повернись сюди й онови сторінку"]},
 mac:{t:"Mac",note:"У системі лежить компактна Anna. Покращені голоси качаються безкоштовно.",
   steps:["Системні параметри → Універсальний доступ → Мовлення","Системний голос → Керувати голосами","Знайди Deutsch і завантаж Anna (Покращена) або Helena","Онови сторінку"]},
 win:{t:"Windows",note:"Онлайн-голоси Katja й Conrad нейронні й помітно живіші за вбудовані.",
   steps:["Параметри → Час і мова → Мовлення","Додати голоси → Deutsch (Deutschland)","Після встановлення онови сторінку"]},
 other:{t:"Твій пристрій",note:"Якість озвучки задає система, а не сайт.",
   steps:["Пошукай у налаштуваннях «синтез мовлення» або «text-to-speech»","Додай німецький голос і вибери найкращий доступний","Онови сторінку"]}
};
function voiceTag(v){
  const n=voiceScore(v);
  return n<0?"застарілий":n>=38?"найкращий":n>=20?"хороший":"звичайний";
}
function pickVoice(){
  try{
    const vs=speechSynthesis.getVoices();
    if(!vs||!vs.length) return;
    deVoices=vs.filter(v=>/^de/i.test(v.lang)).sort((a,b)=>voiceScore(b)-voiceScore(a));
    const saved=state&&state.voice ? deVoices.find(v=>v.name===state.voice) : null;
    deVoice = saved || deVoices[0] || null;
  }catch(e){}
}
if(window.speechSynthesis){
  pickVoice();
  speechSynthesis.onvoiceschanged=function(){ pickVoice(); if(typeof renderVoicePicker==="function")renderVoicePicker(); };
}
/* ---- озвучка ----
   Спершу шукаємо заздалегідь записаний файл: тоді голос однаковий на
   будь-якому пристрої й не залежить від того, що поставив виробник.
   Якщо файлу немає (або аудіо ще не згенероване) — читає системний голос.
   Ім'я файлу — FNV-1a від тексту, та сама функція, що й у tools/gen_audio.py. */
const AUDIO_BASE="audio/";
let audioOK=null;            /* null — ще не знаємо, чи є записане аудіо */
const audioMiss={};          /* що вже точно не знайшлося — не смикаємо двічі */
let curAudio=null;
function fnv1a(str){
  let h=0x811c9dc5;
  const b=new TextEncoder().encode(str);
  for(let i=0;i<b.length;i++){ h^=b[i]; h=Math.imul(h,0x01000193)>>>0; }
  return ("0000000"+h.toString(16)).slice(-8);
}
function audioUrl(text){
  const hh=fnv1a(text);
  return AUDIO_BASE+hh.slice(0,2)+"/"+hh+".mp3";
}
/* iOS не дає грати звук, поки користувач не торкнувся сторінки:
   на першому ж дотику «розблоковуємо» аудіо тихим програванням */
let audioUnlocked=false;
function unlockAudio(){
  if(audioUnlocked)return; audioUnlocked=true;
  try{ const a=new Audio(); a.muted=true;
       a.src="data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCA";
       a.play().catch(()=>{}); }catch(e){}
}
["pointerdown","keydown"].forEach(ev=>document.addEventListener(ev,unlockAudio,{once:true,passive:true}));

function sayTTS(text){
  if(!window.speechSynthesis)return;
  try{
    if(!deVoice) pickVoice();
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(String(text));
    u.lang="de-DE";
    u.rate=(state&&state.rate)||0.95;
    u.pitch=1;
    if(deVoice)u.voice=deVoice;
    speechSynthesis.speak(u);
  }catch(e){}
}
function say(text){
  text=String(text);
  if(audioOK===false||audioMiss[text]){ sayTTS(text); return; }
  try{
    if(curAudio){ curAudio.pause(); curAudio=null; }
    if(window.speechSynthesis) speechSynthesis.cancel();
    const a=new Audio(audioUrl(text));
    a.playbackRate=Math.max(.7,Math.min(1.3,(state&&state.rate)||1));
    curAudio=a;
    let fellBack=false;                    /* і error, і play() можуть спрацювати
                                              на тому самому промаху — читаємо раз */
    const fallback=()=>{
      if(fellBack)return; fellBack=true;
      audioMiss[text]=1;
      if(audioOK===null){ audioOK=false;   /* цей браузер не тягне записане аудіо */
        if(typeof renderVoiceHelp==="function") renderVoiceHelp(); }
      sayTTS(text);
    };
    a.addEventListener("error",fallback,{once:true});
    a.addEventListener("playing",()=>{
      const was=audioOK; audioOK=true; fellBack=true;
      if(was!==true && typeof renderVoiceHelp==="function") renderVoiceHelp();
    },{once:true});
    const pr=a.play();
    if(pr&&pr.catch) pr.catch(fallback);
  }catch(e){ sayTTS(text); }
}
const canSpeak=()=>!!(window.speechSynthesis);
const SPK='<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4zM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
const SPKF='<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';

/* ================= ДРІБНИЦІ ================= */
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const rnd=a=>a[Math.floor(Math.random()*a.length)];
function distinct(pool,n,not,key){
  key=key||(x=>x); const out=[]; const seen=new Set([key(not)]); let guard=0;
  while(out.length<n && guard++<400){const c=rnd(pool); if(seen.has(key(c)))continue; seen.add(key(c)); out.push(c);}
  return out;
}
function confetti(){
  const c=document.createElement("div"); c.className="conf";
  const cols=["#FFC814","#E4342F","#1FB86B","#2B6FE8","#8B5CF6","#FF7A18"];
  for(let i=0;i<70;i++){
    const p=document.createElement("i");
    p.style.left=Math.random()*100+"vw"; p.style.top="-20px";
    p.style.background=cols[i%cols.length];
    p.style.animationDuration=(1.5+Math.random()*1.4)+"s";
    p.style.animationDelay=(Math.random()*.45)+"s";
    c.appendChild(p);
  }
  document.body.appendChild(c); setTimeout(()=>c.remove(),3200);
}
