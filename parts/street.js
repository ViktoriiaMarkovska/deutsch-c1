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

/* будиночок-день: дах, стіна, двері. Стан читається з першого погляду:
   зачинені віконниці — зарано, зелені двері — тобі сюди, світло — пройдено */
function houseArt(stateName,n,lv){
  const V=VIERTEL[lv]||VIERTEL.A1;
  const wall=V.wall[n%V.wall.length];
  const lit=stateName==="done", now=stateName==="now", lock=stateName==="lock";
  const gray="#D8CFBB", grayRoof="#B9AF98";
  const W=lock?gray:wall, R=lock?grayRoof:V.roof;
  let s='<svg viewBox="0 0 110 118" width="100%" height="100%" aria-hidden="true">';
  /* дах */
  s+='<path d="M6 44L55 8l49 36z" fill="'+R+'"/>';
  s+='<rect x="14" y="42" width="82" height="4" rx="2" fill="'+R+'"/>';
  /* стіна */
  s+='<rect x="16" y="46" width="78" height="66" rx="3" fill="'+W+'"/>';
  /* вікна обабіч дверей */
  const winF = lit?"#FFF3C4":(lock?"#C6BCA6":"#FFF8E0");
  s+='<rect x="24" y="54" width="17" height="17" rx="2" fill="'+winF+'"/>';
  s+='<rect x="69" y="54" width="17" height="17" rx="2" fill="'+winF+'"/>';
  s+='<path d="M32.5 54v17M24 62.5h17M77.5 54v17M69 62.5h17" stroke="'+R+'" stroke-width="1.5" opacity=".6"/>';
  /* двері */
  if(lock){
    s+='<rect x="42" y="76" width="26" height="36" rx="3" fill="#B9AF98"/>';
    s+='<path d="M55 76v36M44 88h22M44 100h22" stroke="#A2977E" stroke-width="2.4"/>';
  } else if(lit){
    s+='<rect x="42" y="76" width="26" height="36" rx="3" fill="#E0A800"/>';
    s+='<rect x="46" y="81" width="18" height="26" rx="2" fill="#FFF3C4"/>';
    s+='<path d="M55 81v26M46 94h18" stroke="#E0A800" stroke-width="2"/>';
  } else {
    s+='<rect x="42" y="76" width="26" height="36" rx="3" fill="'+(now?"#1FB86B":"#159154")+'"/>';
    if(now){ s+='<path d="M48 80h16v32H48z" fill="#D8F7E8"/>'; }
    s+='<circle cx="'+(now?"62":"63")+'" cy="96" r="2.6" fill="'+(now?"#159154":"#D8F7E8")+'"/>';
  }
  /* сходинка */
  s+='<rect x="38" y="110" width="34" height="5" rx="2" fill="'+R+'" opacity=".55"/>';
  s+='</svg>';
  return s;
}

/* ліхтар — ставиться між будинками для ритму */
const LAMP='<svg class="lamp" viewBox="0 0 24 80" aria-hidden="true">'
 +'<rect x="10" y="18" width="4" height="62" fill="#4A4238"/>'
 +'<path d="M6 10h12l3 10H3z" fill="#4A4238"/>'
 +'<ellipse cx="12" cy="15" rx="6" ry="5" fill="#FFD84D"/>'
 +'</svg>';
