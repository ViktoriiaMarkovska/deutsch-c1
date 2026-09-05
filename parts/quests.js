/* ================= ЩОДЕННІ ЗАВДАННЯ Й ЕТАПИ =================
   Три цілі на день. Вибір детермінований від дати, тож вони не
   перетасовуються при кожному перезавантаженні сторінки.          */

const QUESTS=[
  {id:"xp",       ic:"⚡", t:"Заробити 50 XP",              goal:50, get:s=>s.xpToday},
  {id:"combo",    ic:"🔥", t:"8 правильних поспіль",         goal:8,  get:s=>s.tod.combo},
  {id:"day",      ic:"🏠", t:"Пройти день на шляху",         goal:1,  get:s=>s.tod.days},
  {id:"perfect",  ic:"💎", t:"Урок без жодної помилки",      goal:1,  get:s=>s.tod.perfect},
  {id:"words",    ic:"📗", t:"Позначити 15 слів вивченими",  goal:15, get:s=>s.tod.words},
  {id:"mistakes", ic:"🐦", t:"Розібрати помилки в Ельзи",    goal:1,  get:s=>s.tod.mistakes},
  {id:"lessons",  ic:"📚", t:"Два уроки за день",            goal:2,  get:s=>s.tod.lessons},
  {id:"listen",   ic:"🎧", t:"10 вправ на слух",             goal:10, get:s=>s.tod.listen}
];

/* три різні завдання, однакові протягом доби */
function questsToday(){
  const seed=fnv1a(today());
  const pool=QUESTS.slice();
  const out=[];
  let n=parseInt(seed.slice(0,8),16);
  while(out.length<3 && pool.length){
    n=(n*1103515245+12345)>>>0;
    out.push(pool.splice(n%pool.length,1)[0]);
  }
  return out;
}
const questDone=q=>q.get(state)>=q.goal;
const questsAllDone=()=>questsToday().every(questDone);

/* нагорода за три виконані: заморозка серії плюс трохи XP */
function claimQuests(){
  if(state.questClaimed===today()||!questsAllDone())return false;
  state.questClaimed=today();
  state.freeze=Math.min(3,(state.freeze||0)+1);
  addXP(20);
  save();
  return true;
}

/* ---- етапи серії ---- */
const MILES=[3,7,14,30,50,100,200,365];
function milestoneFor(streak){
  return MILES.indexOf(streak)>=0 ? streak : null;
}
const MILE_WORD={
  3:"Три дні. Саме тут більшість і зупиняється — ти вже далі.",
  7:"Тиждень поспіль. Це вже не спроба, це звичка.",
  14:"Два тижні. Мозок перестав опиратися німецькій.",
  30:"Місяць. Тепер пропустити день буде просто шкода.",
  50:"П'ятдесят днів. Половина шляху до сотні.",
  100:"Сто днів поспіль. Це рівень, до якого доходять одиниці.",
  200:"Двісті. Тобі вже не треба нагадувати — ти просто приходиш.",
  365:"Рік. Цілий рік щодня. Немає чого додати."
};
