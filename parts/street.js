/* ================= ВУЛИЦЯ =================
   Замість кружечків у порожнечі — німецька вуличка: будинки з гострими
   дахами обабіч дороги, бруківка, ліхтарі. Фасади — це один SVG-кахель,
   що повторюється по вертикалі як фон, тож хоч 20 днів, хоч 200 —
   малюється однаково швидко і нічого не ламається.                     */

/* палітра кварталу для кожного рівня */
const VIERTEL={
  A1:{name:"Фундамент",  road:"#EFE7D2", wall:["#F2C879","#E8A85C","#F5D9A0"], roof:"#B5502F", sky:"#FFF6E2"},
  A2:{name:"Alltag",     road:"#E7EAF2", wall:["#A8C4E8","#8FB0DE","#C6D8F0"], roof:"#2F4E7A", sky:"#F0F5FF"},
  B1:{name:"Selbstständig",road:"#EBE6F2",wall:["#C3B0E0","#AE97D4","#DACFEC"], roof:"#5B3F8C", sky:"#F6F2FF"},
  B2:{name:"Argument",   road:"#F3E7DC", wall:["#F0B98E","#E5A06D","#F7D4B8"], roof:"#9C4A1E", sky:"#FFF3E8"},
  C1:{name:"Nuance",     road:"#F2E4E4", wall:["#E8A6A2","#DC8B86","#F2C7C4"], roof:"#8E2B26", sky:"#FFEFEE"}
};

/* один фасад: вузький будинок із гострим дахом і вікнами */
function facade(x,w,h,wall,roof,base){
  const top=base-h;
  let s='';
  /* дах — трикутник, трохи ширший за стіни */
  s+='<path d="M'+(x-5)+' '+top+'L'+(x+w/2)+' '+(top-26)+'L'+(x+w+5)+' '+top+'z" fill="'+roof+'"/>';
  /* стіна */
  s+='<rect x="'+x+'" y="'+top+'" width="'+w+'" height="'+h+'" fill="'+wall+'"/>';
  /* вікна сіткою */
  const cols=w>60?2:1, rows=Math.max(1,Math.floor(h/42));
  const ww=w>60?18:20, wh=22;
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const wx=x+(w-(cols*ww+(cols-1)*10))/2+c*(ww+10);
      const wy=top+16+r*40;
      if(wy+wh>base-16) continue;
      s+='<rect x="'+wx+'" y="'+wy+'" width="'+ww+'" height="'+wh+'" rx="2" fill="#FFF8E0" opacity=".92"/>';
      s+='<path d="M'+(wx+ww/2)+' '+wy+'v'+wh+'M'+wx+' '+(wy+wh/2)+'h'+ww+'" stroke="'+roof+'" stroke-width="1.4" opacity=".55"/>';
    }
  }
  return s;
}

/* кахель фасадів для однієї сторони вулиці — повторюється по вертикалі */
function houseTile(lv,flip){
  const V=VIERTEL[lv]||VIERTEL.A1, W=170, H=430;
  let s='<svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'">';
  /* три будинки різної висоти, щоб силует не був монотонним */
  s+=facade(6,   62, 150, V.wall[0], V.roof, 150);
  s+=facade(76,  84, 196, V.wall[1], V.roof, 196);
  s+=facade(14,  74, 168, V.wall[2], V.roof, 372);
  s+=facade(98,  60, 132, V.wall[0], V.roof, 372);
  s+='<rect x="0" y="372" width="'+W+'" height="58" fill="'+V.roof+'" opacity=".13"/>';
  s+='</svg>';
  /* без лапок і з екранованим апострофом: інакше рядок рве атрибут style="…" */
  return "url(data:image/svg+xml,"+encodeURIComponent(s).replace(/'/g,"%27")+")";
}

/* будиночок-день: сорок архетипів по колу, палітра — від кварталу.
   Кожен рівень має свій колір, тож 40 архетипів × 5 палітр = 200 різних
   будинків, і в межах одного рівня жоден не повторюється.              */
function houseArt(stateName,n,lv){
  const V=VIERTEL[lv]||VIERTEL.A1;
  return HOUSES[n % HOUSES.length](V,stateName);
}

/* зсув і розмір будинку — детерміновані від номера, щоб вулиця
   не вишиковувалась під лінійку, але й не стрибала при перемальовуванні */
const OFFS=[0,54,88,38,-28,-74,-46,16,70,28,-58,-88,-22,46,76,-12,-68,-38,24,62,
            -50,34,80,-18,58,-80,12,-34,66,-62,20,-44,84,-26,48,-70,36,-16,72,-54];
const SCAL=[1,.95,1.06,.98,1.03,.93,1.07,.97,1.02,.94,1.05,.99,1.04,.96,1.01,
            .92,1.08,.98,1.03,.95];
function houseShift(i){ return OFFS[i % OFFS.length]; }
function houseScale(i){ return SCAL[i % SCAL.length]; }

/* ліхтар — ставиться між будинками для ритму */
const LAMP='<svg class="lamp" viewBox="0 0 24 80" aria-hidden="true">'
 +'<rect x="10" y="18" width="4" height="62" fill="#4A4238"/>'
 +'<path d="M6 10h12l3 10H3z" fill="#4A4238"/>'
 +'<ellipse cx="12" cy="15" rx="6" ry="5" fill="#FFD84D"/>'
 +'</svg>';
