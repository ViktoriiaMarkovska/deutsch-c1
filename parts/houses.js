/* ================= СОРОК БУДИНКІВ =================
   Кожен день на вулиці — своя будівля. Двадцять узято з упізнаваних
   німецьких пам'яток, двадцять — зі звичайної забудови, яку бачиш,
   гуляючи будь-яким містом. Силует, пропорції й деталі в кожної свої,
   тож сусідні будинки ніколи не збігаються.
   Усі малюються в полі 120×130, земля на y=118.                        */

/* палітра під стан: зачинено — сіре, пройдено — світиться, зараз — зелені двері */
function hp(V,st){
  if(st==="lock") return {w:"#D8CFBB",w2:"#CCC2AC",r:"#B9AF98",win:"#C6BCA6",fr:"#B4A98F",
                          door:"#B9AF98",acc:"#C4BAA4",dark:"#A2977E",gold:"#C9BFA8"};
  return {w:V.wall[0],w2:V.wall[2],r:V.roof,win:st==="done"?"#FFF3C4":"#FFF8E0",fr:V.roof,
          door:st==="done"?"#E0A800":(st==="now"?"#1FB86B":"#159154"),
          acc:V.wall[1],dark:"#6B4423",gold:st==="done"?"#FFC814":"#D9A200"};
}
/* дрібні цеглинки, з яких складається більшість фасадів */
function win(x,y,w,h,c,round){
  return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(round||1.5)+'" fill="'+c.win+'"/>'
       + '<path d="M'+(x+w/2)+' '+y+'v'+h+'M'+x+' '+(y+h/2)+'h'+w+'" stroke="'+c.fr+'" stroke-width="1.2" opacity=".55"/>';
}
function winRow(x,y,n,gap,w,h,c){
  let s=''; for(let i=0;i<n;i++) s+=win(x+i*(w+gap),y,w,h,c);
  return s;
}
function arch(x,y,w,h,c){
  return '<path d="M'+x+' '+(y+h)+'V'+(y+w/2)+'a'+(w/2)+' '+(w/2)+' 0 0 1 '+w+' 0V'+(y+h)+'z" fill="'+c.win+'"/>';
}
function dr(x,y,w,h,c,rounded){
  return rounded
    ? '<path d="M'+x+' '+(y+h)+'V'+(y+w/2)+'a'+(w/2)+' '+(w/2)+' 0 0 1 '+w+' 0V'+(y+h)+'z" fill="'+c.door+'"/>'
    : '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="2" fill="'+c.door+'"/>';
}
const G_=(s)=>'<svg viewBox="0 0 120 130" width="100%" height="100%" aria-hidden="true">'+s+'</svg>';

const HOUSES=[
/* 1 фахверк */ (V,st)=>{const c=hp(V,st);return G_(
 '<path d="M14 46 60 18l46 28z" fill="'+c.r+'"/>'
 +'<rect x="20" y="46" width="80" height="72" fill="#F2EAD6"/>'
 +'<path d="M20 46v72M100 46v72M20 70h80M20 94h80M34 46v72M60 46v72M86 46v72M20 46l14 24M100 46L86 70" stroke="'+c.dark+'" stroke-width="3.4"/>'
 +win(40,52,14,14,c)+win(66,52,14,14,c)+win(26,76,14,14,c)+win(80,76,14,14,c)
 +dr(52,96,18,22,c));},
/* 2 фахверк з еркером */ (V,st)=>{const c=hp(V,st);return G_(
 '<path d="M12 44 60 16l48 28z" fill="'+c.r+'"/>'
 +'<rect x="18" y="44" width="84" height="74" fill="#EFE6D0"/>'
 +'<path d="M18 44v74M102 44v74M18 72h84M32 44v74M88 44v74M18 96h84" stroke="'+c.dark+'" stroke-width="3.2"/>'
 +'<rect x="44" y="50" width="32" height="26" rx="2" fill="'+c.w+'"/>'
 +'<path d="M42 76h36l-4 6H46z" fill="'+c.r+'"/>'
 +win(48,54,9,16,c)+win(62,54,9,16,c)+win(24,100,12,12,c)+win(84,100,12,12,c)
 +dr(52,94,18,24,c));},
/* 3 берлінський Altbau */ (V,st)=>{const c=hp(V,st);return G_(
 '<rect x="16" y="26" width="88" height="92" fill="'+c.w+'"/>'
 +'<rect x="16" y="20" width="88" height="8" rx="2" fill="'+c.r+'"/>'
 +'<rect x="16" y="52" width="88" height="4" fill="'+c.acc+'"/><rect x="16" y="80" width="88" height="4" fill="'+c.acc+'"/>'
 +winRow(24,32,4,6,14,14,c)+winRow(24,60,4,6,14,14,c)
 +'<rect x="30" y="86" width="24" height="4" fill="'+c.r+'"/><rect x="66" y="86" width="24" height="4" fill="'+c.r+'"/>'
 +win(34,90,14,14,c)+win(70,90,14,14,c)
 +dr(52,98,18,20,c,1));},
/* 4 північна цегляна зі сходинковим фронтоном */ (V,st)=>{const c=hp(V,st);return G_(
 '<path d="M22 46h10v-8h10v-8h10v-8h16v8h10v8h10v8h10v72H22z" fill="#B0553A"/>'
 +'<path d="M22 46h76" stroke="'+c.r+'" stroke-width="3"/>'
 +arch(38,54,14,20,c)+arch(66,54,14,20,c)+arch(38,82,14,20,c)+arch(66,82,14,20,c)
 +dr(50,96,20,22,c,1)
 +'<path d="M30 60h6M84 60h6M30 88h6M84 88h6" stroke="#8E4230" stroke-width="3"/>');},
/* 5 баварське шале */ (V,st)=>{const c=hp(V,st);return G_(
 '<path d="M6 56 60 24l54 32z" fill="'+c.r+'"/>'
 +'<path d="M6 56h108l-6 8H12z" fill="'+c.dark+'"/>'
 +'<rect x="22" y="64" width="76" height="54" fill="'+c.w+'"/>'
 +'<rect x="18" y="86" width="84" height="6" rx="2" fill="'+c.dark+'"/>'
 +'<path d="M22 92h76M28 86v6M46 86v6M64 86v6M82 86v6" stroke="'+c.dark+'" stroke-width="2"/>'
 +win(32,68,14,14,c)+win(74,68,14,14,c)
 +'<circle cx="34" cy="90" r="3" fill="#E4342F"/><circle cx="52" cy="90" r="3" fill="#E4342F"/><circle cx="70" cy="90" r="3" fill="#E4342F"/><circle cx="88" cy="90" r="3" fill="#E4342F"/>'
 +dr(52,96,18,22,c));},
/* 6 шварцвальдський дім */ (V,st)=>{const c=hp(V,st);return G_(
 '<path d="M4 74 60 20l56 54z" fill="'+c.dark+'"/>'
 +'<path d="M14 74 60 30l46 44z" fill="'+c.r+'"/>'
 +'<rect x="26" y="74" width="68" height="44" fill="'+c.w+'"/>'
 +win(34,80,12,12,c)+win(54,80,12,12,c)+win(74,80,12,12,c)
 +dr(50,96,20,22,c)
 +'<path d="M26 96h68" stroke="'+c.dark+'" stroke-width="2.5"/>');},
/* 7 Plattenbau */ (V,st)=>{const c=hp(V,st);return G_(
 '<rect x="14" y="22" width="92" height="96" fill="#CFCCC4"/>'
 +'<rect x="14" y="18" width="92" height="6" fill="'+c.r+'"/>'
 +winRow(20,28,5,4,12,12,c)+winRow(20,48,5,4,12,12,c)+winRow(20,68,5,4,12,12,c)
 +'<rect x="20" y="88" width="34" height="14" fill="'+c.acc+'"/><rect x="66" y="88" width="34" height="14" fill="'+c.acc+'"/>'
 +dr(52,102,18,16,c));},
/* 8 сільська церква */ (V,st)=>{const c=hp(V,st);return G_(
 '<path d="M30 46 44 14l14 32z" fill="'+c.r+'"/>'
 +'<rect x="34" y="46" width="20" height="72" fill="'+c.w2+'"/>'
 +'<circle cx="44" cy="56" r="6" fill="'+c.win+'"/><path d="M44 52v8M40 56h8" stroke="'+c.fr+'" stroke-width="1.4"/>'
 +'<path d="M44 8v6M41 11h6" stroke="'+c.gold+'" stroke-width="2.6"/>'
 +'<path d="M56 62 78 44l26 18z" fill="'+c.r+'"/>'
 +'<rect x="58" y="62" width="46" height="56" fill="'+c.w+'"/>'
 +arch(66,70,12,20,c)+arch(86,70,12,20,c)
 +dr(74,96,18,22,c,1));},
/* 9 Кельнський собор */ (V,st)=>{const c=hp(V,st);return G_(
 '<path d="M28 44 36 8l8 36z" fill="'+c.r+'"/><path d="M76 44 84 8l8 36z" fill="'+c.r+'"/>'
 +'<rect x="28" y="44" width="16" height="74" fill="'+c.w2+'"/><rect x="76" y="44" width="16" height="74" fill="'+c.w2+'"/>'
 +'<rect x="44" y="62" width="32" height="56" fill="'+c.w+'"/>'
 +'<path d="M44 62 60 48l16 14z" fill="'+c.r+'"/>'
 +arch(32,54,8,14,c)+arch(80,54,8,14,c)
 +'<circle cx="60" cy="76" r="7" fill="'+c.win+'"/><path d="M60 69v14M53 76h14" stroke="'+c.fr+'" stroke-width="1.3"/>'
 +arch(31,80,10,16,c)+arch(79,80,10,16,c)
 +dr(51,94,18,24,c,1));},
/* 10 ратуша з годинником */ (V,st)=>{const c=hp(V,st);return G_(
 '<rect x="16" y="52" width="88" height="66" fill="'+c.w+'"/>'
 +'<path d="M12 52 60 30l48 22z" fill="'+c.r+'"/>'
 +'<rect x="50" y="14" width="20" height="38" fill="'+c.w2+'"/>'
 +'<path d="M48 14 60 2l12 12z" fill="'+c.r+'"/>'
 +'<circle cx="60" cy="28" r="7" fill="'+c.win+'"/><path d="M60 24v4l3 2" stroke="'+c.fr+'" stroke-width="1.6" fill="none"/>'
 +winRow(24,60,3,8,14,14,c)+'<rect x="76" y="60" width="14" height="14" rx="1.5" fill="'+c.win+'"/>'
 +arch(30,84,12,18,c)+arch(78,84,12,18,c)
 +dr(50,92,20,26,c,1));},
/* 11 вокзал */ (V,st)=>{const c=hp(V,st);return G_(
 '<rect x="14" y="54" width="92" height="64" fill="'+c.w+'"/>'
 +'<path d="M10 54h100l-5-12H15z" fill="'+c.r+'"/>'
 +'<circle cx="60" cy="34" r="10" fill="'+c.w2+'"/><circle cx="60" cy="34" r="7" fill="'+c.win+'"/>'
 +'<path d="M60 30v4l3 2" stroke="'+c.fr+'" stroke-width="1.5" fill="none"/>'
 +'<rect x="20" y="62" width="80" height="4" fill="'+c.acc+'"/>'
 +arch(24,70,14,22,c)+arch(84,70,14,22,c)
 +'<rect x="44" y="70" width="32" height="24" rx="2" fill="'+c.win+'"/>'
 +'<path d="M60 70v24M44 82h32" stroke="'+c.fr+'" stroke-width="1.3"/>'
 +dr(50,98,20,20,c,1)
 +'<rect x="14" y="112" width="92" height="6" fill="'+c.dark+'" opacity=".35"/>');},
/* 12 школа */ (V,st)=>{const c=hp(V,st);return G_(
 '<rect x="16" y="48" width="88" height="70" fill="'+c.w+'"/>'
 +'<path d="M12 48h96l-6-10H18z" fill="'+c.r+'"/>'
 +'<rect x="54" y="24" width="12" height="14" fill="'+c.w2+'"/><path d="M52 24 60 14l8 10z" fill="'+c.r+'"/>'
 +'<circle cx="60" cy="31" r="3" fill="'+c.gold+'"/>'
 +'<path d="M60 14V8h10l-4 3 4 3z" fill="#E4342F"/>'
 +winRow(24,56,4,6,14,16,c)+winRow(24,80,4,6,14,16,c)
 +dr(50,98,20,20,c)
 +'<path d="M46 118h28v-4H46z" fill="'+c.acc+'"/>');},
/* 13 пекарня */ (V,st)=>{const c=hp(V,st);return G_(
 '<path d="M14 44 60 18l46 26z" fill="'+c.r+'"/>'
 +'<rect x="20" y="44" width="80" height="74" fill="'+c.w+'"/>'
 +win(30,50,16,14,c)+win(74,50,16,14,c)
 +'<rect x="20" y="70" width="80" height="12" fill="none"/>'
 +'<path d="M20 70h80v10a5 5 0 0 1-5 5H25a5 5 0 0 1-5-5z" fill="#C98430"/>'
 +'<path d="M20 70h80" stroke="'+c.dark+'" stroke-width="2"/>'
 +'<rect x="26" y="88" width="30" height="30" rx="2" fill="'+c.win+'"/>'
 +'<path d="M41 88v30M26 103h30" stroke="'+c.fr+'" stroke-width="1.2"/>'
 +dr(66,92,22,26,c,1)
 +'<g transform="translate(52 44) scale(.55)"><circle cx="14" cy="14" r="11" fill="none" stroke="'+c.gold+'" stroke-width="5"/><path d="M6 8c4 8 16 8 16 0" stroke="'+c.gold+'" stroke-width="5" fill="none" stroke-linecap="round"/></g>');},
/* 14 аптека */ (V,st)=>{const c=hp(V,st);return G_(
 '<rect x="18" y="42" width="84" height="76" fill="'+c.w2+'"/>'
 +'<path d="M14 42h92l-6-10H20z" fill="'+c.r+'"/>'
 +'<rect x="46" y="16" width="28" height="18" rx="3" fill="#E4342F"/>'
 +'<path d="M60 20v10M55 25h10" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/>'
 +win(28,50,16,16,c)+win(76,50,16,16,c)
 +'<rect x="26" y="76" width="34" height="42" rx="2" fill="'+c.win+'"/>'
 +'<path d="M43 76v42M26 97h34" stroke="'+c.fr+'" stroke-width="1.2"/>'
 +dr(70,84,22,34,c,1));},
/* 15 кіоск-Späti */ (V,st)=>{const c=hp(V,st);return G_(
 '<rect x="26" y="60" width="68" height="58" fill="'+c.w+'"/>'
 +'<path d="M20 60h80l-5-10H25z" fill="'+c.r+'"/>'
 +'<path d="M22 70h76v8H22z" fill="repeating"/>'
 +'<path d="M22 70h76v9a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4z" fill="#2B6FE8"/>'
 +'<rect x="32" y="86" width="26" height="32" rx="2" fill="'+c.win+'"/>'
 +'<path d="M45 86v32M32 102h26" stroke="'+c.fr+'" stroke-width="1.2"/>'
 +dr(66,90,20,28,c)
 +'<rect x="32" y="52" width="56" height="6" rx="3" fill="'+c.gold+'"/>');},
/* 16 книгарня */ (V,st)=>{const c=hp(V,st);return G_(
 '<path d="M16 46 60 20l44 26z" fill="'+c.r+'"/>'
 +'<rect x="22" y="46" width="76" height="72" fill="'+c.w+'"/>'
 +win(32,52,14,14,c)+win(74,52,14,14,c)
 +'<rect x="22" y="72" width="76" height="8" fill="'+c.dark+'"/>'
 +'<rect x="28" y="84" width="36" height="34" rx="2" fill="'+c.win+'"/>'
 +'<path d="M32 90h10v22H32zM44 90h8v22h-8zM54 90h6v22h-6z" fill="'+c.acc+'"/>'
 +dr(72,90,20,28,c,1));},
/* 17 броварня */ (V,st)=>{const c=hp(V,st);return G_(
 '<rect x="18" y="52" width="84" height="66" fill="#9A6A3C"/>'
 +'<path d="M14 52h92l-6-12H20z" fill="'+c.r+'"/>'
 +'<rect x="74" y="20" width="16" height="20" rx="3" fill="'+c.acc+'"/>'
 +'<ellipse cx="82" cy="20" rx="8" ry="4" fill="'+c.gold+'"/>'
 +arch(28,62,16,24,c)+arch(52,62,16,24,c)
 +'<rect x="76" y="62" width="16" height="24" rx="2" fill="'+c.win+'"/>'
 +dr(48,92,24,26,c,1)
 +'<path d="M18 92h24M78 92h24" stroke="'+c.dark+'" stroke-width="3"/>');},
/* 18 музей із колонами */ (V,st)=>{const c=hp(V,st);return G_(
 '<path d="M8 46 60 20l52 26z" fill="'+c.r+'"/>'
 +'<rect x="10" y="46" width="100" height="6" fill="'+c.w2+'"/>'
 +'<rect x="18" y="52" width="8" height="56" fill="'+c.w2+'"/><rect x="38" y="52" width="8" height="56" fill="'+c.w2+'"/>'
 +'<rect x="58" y="52" width="8" height="56" fill="'+c.w2+'"/><rect x="78" y="52" width="8" height="56" fill="'+c.w2+'"/>'
 +'<rect x="94" y="52" width="8" height="56" fill="'+c.w2+'"/>'
 +'<rect x="14" y="108" width="92" height="10" fill="'+c.w+'"/>'
 +'<rect x="26" y="60" width="68" height="44" fill="'+c.w+'" opacity=".55"/>'
 +dr(50,80,20,28,c,1));},
/* 19 оперний театр */ (V,st)=>{const c=hp(V,st);return G_(
 '<path d="M26 60a34 34 0 0 1 68 0z" fill="'+c.r+'"/>'
 +'<rect x="26" y="60" width="68" height="58" fill="'+c.w+'"/>'
 +'<rect x="20" y="76" width="80" height="42" fill="'+c.w2+'"/>'
 +arch(30,84,14,22,c)+arch(52,84,16,22,c)+arch(76,84,14,22,c)
 +'<path d="M40 60h40v-6H40z" fill="'+c.acc+'"/>'
 +'<circle cx="60" cy="44" r="8" fill="'+c.win+'"/>'
 +dr(52,100,16,18,c,1));},
/* 20 Баугауз */ (V,st)=>{const c=hp(V,st);return G_(
 '<rect x="16" y="40" width="60" height="78" fill="'+c.w+'"/>'
 +'<rect x="76" y="62" width="30" height="56" fill="'+c.w2+'"/>'
 +'<rect x="22" y="48" width="48" height="60" fill="'+c.win+'"/>'
 +'<path d="M34 48v60M46 48v60M58 48v60M22 68h48M22 88h48" stroke="'+c.fr+'" stroke-width="1.6"/>'
 +win(82,70,18,14,c)+win(82,92,18,14,c)
 +dr(38,100,18,18,c)
 +'<rect x="16" y="36" width="60" height="5" fill="'+c.r+'"/>');},
/* 21 Ельбфілармонія */ (V,st)=>{const c=hp(V,st);return G_(
 '<rect x="20" y="66" width="80" height="52" fill="#A64B33"/>'
 +'<path d="M20 66h80v-4H20z" fill="'+c.r+'"/>'
 +'<path d="M20 66 34 40l14 12 12-14 14 12 12-10 14 26z" fill="'+c.w2+'"/>'
 +'<path d="M26 60h68" stroke="'+c.fr+'" stroke-width="1.4" opacity=".5"/>'
 +arch(28,74,12,18,c)+arch(48,74,12,18,c)+arch(68,74,12,18,c)+arch(86,74,10,18,c)
 +dr(50,98,20,20,c,1));},
/* 22 Фернзетурм */ (V,st)=>{const c=hp(V,st);return G_(
 '<path d="M54 118 57 46h6l3 72z" fill="'+c.w2+'"/>'
 +'<circle cx="60" cy="40" r="16" fill="'+c.acc+'"/>'
 +'<path d="M44 40h32" stroke="'+c.fr+'" stroke-width="2"/>'
 +'<circle cx="60" cy="34" r="5" fill="'+c.win+'"/>'
 +'<path d="M60 24V8" stroke="'+c.dark+'" stroke-width="3"/>'
 +'<circle cx="60" cy="7" r="3" fill="#E4342F"/>'
 +'<rect x="40" y="104" width="40" height="14" rx="3" fill="'+c.w+'"/>'
 +dr(52,106,16,12,c));},
/* 23 Бранденбурзька брама */ (V,st)=>{const c=hp(V,st);return G_(
 '<rect x="12" y="46" width="96" height="10" fill="'+c.w2+'"/>'
 +'<rect x="16" y="56" width="9" height="62" fill="'+c.w2+'"/><rect x="35" y="56" width="9" height="62" fill="'+c.w2+'"/>'
 +'<rect x="54" y="56" width="12" height="62" fill="'+c.w2+'"/>'
 +'<rect x="76" y="56" width="9" height="62" fill="'+c.w2+'"/><rect x="95" y="56" width="9" height="62" fill="'+c.w2+'"/>'
 +dr(50,74,20,44,c,1)
 +'<rect x="42" y="30" width="36" height="6" rx="2" fill="'+c.gold+'"/>'
 +'<path d="M48 30c0-8 6-12 12-12s12 4 12 12z" fill="'+c.gold+'"/>'
 +'<circle cx="60" cy="22" r="3" fill="'+c.w+'"/>');},
/* 24 Нойшванштайн */ (V,st)=>{const c=hp(V,st);return G_(
 '<rect x="26" y="58" width="52" height="60" fill="'+c.w2+'"/>'
 +'<rect x="78" y="42" width="20" height="76" fill="'+c.w2+'"/>'
 +'<rect x="14" y="72" width="16" height="46" fill="'+c.w2+'"/>'
 +'<path d="M24 58 52 26l28 32z" fill="'+c.r+'"/>'
 +'<path d="M76 42 88 16l12 26z" fill="'+c.r+'"/>'
 +'<path d="M12 72 22 52l10 20z" fill="'+c.r+'"/>'
 +arch(36,68,10,16,c)+arch(56,68,10,16,c)+arch(84,54,8,14,c)+arch(18,80,8,12,c)
 +arch(36,92,10,16,c)+arch(56,92,10,16,c)
 +dr(46,98,16,20,c,1));},
/* 25 Рейхстаг */ (V,st)=>{const c=hp(V,st);return G_(
 '<rect x="14" y="60" width="92" height="58" fill="'+c.w+'"/>'
 +'<path d="M34 60 60 40l26 20z" fill="'+c.r+'"/>'
 +'<rect x="34" y="56" width="52" height="6" fill="'+c.w2+'"/>'
 +'<rect x="40" y="62" width="7" height="34" fill="'+c.w2+'"/><rect x="53" y="62" width="7" height="34" fill="'+c.w2+'"/>'
 +'<rect x="66" y="62" width="7" height="34" fill="'+c.w2+'"/>'
 +'<path d="M46 40a14 14 0 0 1 28 0z" fill="'+c.win+'" opacity=".9"/>'
 +'<path d="M60 26v-6M52 34h16" stroke="'+c.fr+'" stroke-width="1.6"/>'
 +win(20,70,12,14,c)+win(90,70,12,14,c)
 +dr(50,96,20,22,c,1));},
/* 26 Фрауенкірхе */ (V,st)=>{const c=hp(V,st);return G_(
 '<rect x="30" y="70" width="60" height="48" fill="'+c.w+'"/>'
 +'<path d="M30 70a30 30 0 0 1 60 0z" fill="'+c.r+'"/>'
 +'<circle cx="60" cy="34" r="7" fill="'+c.w2+'"/>'
 +'<path d="M60 27v-7M57 22h6" stroke="'+c.gold+'" stroke-width="2.4"/>'
 +arch(38,78,12,18,c)+arch(70,78,12,18,c)
 +'<circle cx="60" cy="58" r="6" fill="'+c.win+'"/>'
 +dr(50,96,20,22,c,1)
 +'<rect x="26" y="112" width="68" height="6" fill="'+c.w2+'"/>');},
/* 27 Гольштейнські ворота */ (V,st)=>{const c=hp(V,st);return G_(
 '<circle cx="30" cy="76" r="22" fill="#9E5540"/><circle cx="90" cy="76" r="22" fill="#9E5540"/>'
 +'<rect x="8" y="76" width="44" height="42" fill="#9E5540"/><rect x="68" y="76" width="44" height="42" fill="#9E5540"/>'
 +'<path d="M14 54a16 16 0 0 1 32 0z" fill="'+c.r+'"/><path d="M74 54a16 16 0 0 1 32 0z" fill="'+c.r+'"/>'
 +'<rect x="46" y="60" width="28" height="58" fill="#8E4A38"/>'
 +'<path d="M44 60 60 46l16 14z" fill="'+c.r+'"/>'
 +arch(24,66,12,16,c)+arch(84,66,12,16,c)
 +dr(52,80,16,38,c,1));},
/* 28 Порта Ніґра */ (V,st)=>{const c=hp(V,st);return G_(
 '<rect x="14" y="34" width="92" height="84" fill="#8C8378"/>'
 +'<rect x="14" y="34" width="92" height="6" fill="#756D63"/>'
 +'<path d="M14 58h92M14 82h92" stroke="#756D63" stroke-width="2.4"/>'
 +arch(22,42,14,14,c)+arch(48,42,14,14,c)+arch(74,42,14,14,c)
 +arch(22,64,14,16,c)+arch(74,64,14,16,c)
 +'<path d="M44 118V96a16 16 0 0 1 32 0v22z" fill="'+c.door+'"/>'
 +'<rect x="98" y="28" width="10" height="90" fill="#7E766B"/>');},
/* 29 ратуша Бремена */ (V,st)=>{const c=hp(V,st);return G_(
 '<rect x="18" y="56" width="84" height="62" fill="'+c.w+'"/>'
 +'<path d="M40 56c0-14 4-22 20-22s20 8 20 22z" fill="'+c.r+'"/>'
 +'<path d="M18 56 30 40l12 16zM78 56l12-16 12 16z" fill="'+c.r+'"/>'
 +'<circle cx="60" cy="44" r="4" fill="'+c.gold+'"/>'
 +arch(26,64,12,18,c)+arch(48,64,12,18,c)+arch(70,64,12,18,c)+arch(88,64,10,18,c)
 +'<rect x="18" y="88" width="84" height="4" fill="'+c.acc+'"/>'
 +win(28,96,14,14,c)+win(78,96,14,14,c)
 +dr(50,94,20,24,c,1));},
/* 30 Сан-Сусі */ (V,st)=>{const c=hp(V,st);return G_(
 '<rect x="10" y="72" width="100" height="46" fill="'+c.w+'"/>'
 +'<path d="M44 72a16 16 0 0 1 32 0z" fill="'+c.r+'"/>'
 +'<rect x="10" y="66" width="100" height="7" rx="2" fill="'+c.w2+'"/>'
 +'<circle cx="60" cy="52" r="5" fill="'+c.gold+'"/>'
 +arch(18,80,12,18,c)+arch(36,80,12,18,c)+arch(72,80,12,18,c)+arch(90,80,12,18,c)
 +dr(50,84,20,34,c,1)
 +'<path d="M10 112h100" stroke="'+c.acc+'" stroke-width="4"/>');},
/* 31 маяк */ (V,st)=>{const c=hp(V,st);return G_(
 '<path d="M46 118 52 42h16l6 76z" fill="#F2EAD6"/>'
 +'<path d="M51 58h18v12H51zM49 82h22v12H49z" fill="#E4342F"/>'
 +'<rect x="46" y="34" width="28" height="10" rx="2" fill="'+c.dark+'"/>'
 +'<rect x="50" y="20" width="20" height="16" fill="'+c.win+'"/>'
 +'<path d="M50 28h20" stroke="'+c.fr+'" stroke-width="1.4"/>'
 +'<path d="M48 20h24l-4-6H52z" fill="'+c.r+'"/>'
 +'<path d="M74 26l16-6M74 32h18" stroke="'+c.gold+'" stroke-width="2.4" opacity=".8"/>'
 +dr(54,102,12,16,c,1)
 +'<path d="M34 118h52" stroke="'+c.acc+'" stroke-width="5"/>');},
/* 32 вітряк */ (V,st)=>{const c=hp(V,st);return G_(
 '<path d="M40 118 48 52h24l8 66z" fill="'+c.w+'"/>'
 +'<path d="M44 52h32l-4-10H48z" fill="'+c.r+'"/>'
 +'<path d="M60 42 34 22M60 42l26-20M60 42 40 68M60 42l20 26" stroke="'+c.dark+'" stroke-width="4" stroke-linecap="round"/>'
 +'<circle cx="60" cy="42" r="4" fill="'+c.acc+'"/>'
 +win(52,64,16,14,c)
 +dr(52,94,16,24,c,1));},
/* 33 водяний млин */ (V,st)=>{const c=hp(V,st);return G_(
 '<path d="M18 52 58 26l40 26z" fill="'+c.r+'"/>'
 +'<rect x="24" y="52" width="68" height="66" fill="'+c.w+'"/>'
 +win(34,60,14,14,c)+win(64,60,14,14,c)
 +dr(48,92,20,26,c)
 +'<circle cx="98" cy="88" r="20" fill="none" stroke="'+c.dark+'" stroke-width="4"/>'
 +'<path d="M98 68v40M78 88h40M84 74l28 28M112 74 84 102" stroke="'+c.dark+'" stroke-width="3"/>'
 +'<path d="M14 112h94" stroke="#7FB6D9" stroke-width="6" opacity=".7"/>');},
/* 34 Ульмський собор */ (V,st)=>{const c=hp(V,st);return G_(
 '<path d="M48 40 60 4l12 36z" fill="'+c.r+'"/>'
 +'<rect x="48" y="40" width="24" height="78" fill="'+c.w2+'"/>'
 +'<path d="M46 62 60 52l14 10z" fill="'+c.r+'" opacity=".7"/>'
 +'<rect x="24" y="76" width="24" height="42" fill="'+c.w+'"/><rect x="72" y="76" width="24" height="42" fill="'+c.w+'"/>'
 +'<path d="M22 76 36 62l14 14zM70 76l14-14 14 14z" fill="'+c.r+'"/>'
 +arch(54,46,12,14,c)+arch(30,84,12,16,c)+arch(78,84,12,16,c)
 +dr(52,94,16,24,c,1));},
/* 35 Вартбург на пагорбі */ (V,st)=>{const c=hp(V,st);return G_(
 '<path d="M4 118c14-16 32-24 56-24s42 8 56 24z" fill="'+c.acc+'" opacity=".55"/>'
 +'<rect x="30" y="56" width="46" height="46" fill="'+c.w2+'"/>'
 +'<rect x="76" y="42" width="18" height="60" fill="'+c.w2+'"/>'
 +'<path d="M74 42 85 22l11 20z" fill="'+c.r+'"/>'
 +'<path d="M28 56 53 38l25 18z" fill="'+c.r+'"/>'
 +'<path d="M30 52h46v-6H30z" fill="'+c.dark+'" opacity=".4"/>'
 +win(38,62,12,12,c)+win(58,62,12,12,c)+arch(80,54,10,14,c)
 +dr(44,80,18,22,c,1));},
/* 36 Цвінґер */ (V,st)=>{const c=hp(V,st);return G_(
 '<rect x="12" y="78" width="96" height="40" fill="'+c.w+'"/>'
 +'<rect x="42" y="52" width="36" height="66" fill="'+c.w2+'"/>'
 +'<path d="M40 52a20 20 0 0 1 40 0z" fill="'+c.r+'"/>'
 +'<circle cx="60" cy="28" r="5" fill="'+c.gold+'"/>'
 +arch(18,86,12,18,c)+arch(36,86,10,18,c)+arch(76,86,10,18,c)+arch(92,86,12,18,c)
 +arch(50,60,20,26,c)
 +dr(52,94,16,24,c,1)
 +'<path d="M12 78h96" stroke="'+c.acc+'" stroke-width="3"/>');},
/* 37 барвистий будинок у стилі Гундертвассера */ (V,st)=>{const c=hp(V,st);const on=st!=="lock";return G_(
 '<path d="M18 48q42-26 84 0v70H18z" fill="'+(on?"#E8A33D":c.w)+'"/>'
 +'<path d="M18 70q42-14 84 0v14q-42-14-84 0z" fill="'+(on?"#2B6FE8":c.w2)+'"/>'
 +'<path d="M18 96q42-12 84 0v10H18z" fill="'+(on?"#1FB86B":c.acc)+'"/>'
 +'<circle cx="36" cy="58" r="8" fill="'+c.win+'"/><circle cx="62" cy="54" r="9" fill="'+c.win+'"/><circle cx="88" cy="60" r="7" fill="'+c.win+'"/>'
 +'<circle cx="34" cy="80" r="6" fill="'+c.win+'"/><circle cx="86" cy="80" r="6" fill="'+c.win+'"/>'
 +dr(50,96,20,22,c,1)
 +'<path d="M18 48q42-26 84 0" stroke="'+(on?"#E4342F":c.r)+'" stroke-width="5" fill="none"/>');},
/* 38 склад Шпайхерштадт */ (V,st)=>{const c=hp(V,st);return G_(
 '<path d="M22 44h76v74H22z" fill="#A4553C"/>'
 +'<path d="M20 44 60 16l40 28z" fill="'+c.r+'"/>'
 +'<path d="M22 62h76M22 82h76M22 100h76" stroke="#8E4230" stroke-width="2"/>'
 +arch(30,50,12,16,c)+arch(54,50,12,16,c)+arch(78,50,12,16,c)
 +arch(30,86,12,16,c)+arch(78,86,12,16,c)
 +'<rect x="52" y="20" width="16" height="26" fill="#8E4230"/>'
 +'<path d="M60 24h14M74 24v6" stroke="'+c.dark+'" stroke-width="3"/>'
 +dr(50,90,20,28,c,1));},
/* 39 оранжерея */ (V,st)=>{const c=hp(V,st);return G_(
 '<path d="M16 118V64a44 30 0 0 1 88 0v54z" fill="'+c.win+'" opacity=".85"/>'
 +'<path d="M16 118V64a44 30 0 0 1 88 0v54" fill="none" stroke="'+c.fr+'" stroke-width="2.4"/>'
 +'<path d="M60 36v82M32 48v70M88 48v70M16 76h88M16 96h88" stroke="'+c.fr+'" stroke-width="1.8" opacity=".7"/>'
 +'<circle cx="60" cy="30" r="4" fill="'+c.gold+'"/>'
 +'<path d="M40 110c0-10 4-16 8-16s8 6 8 16z" fill="'+c.acc+'"/>'
 +'<path d="M70 110c0-8 3-13 6-13s6 5 6 13z" fill="'+c.acc+'"/>'
 +dr(52,98,16,20,c,1));},
/* 40 біргартен під каштаном */ (V,st)=>{const c=hp(V,st);return G_(
 '<circle cx="34" cy="46" r="24" fill="'+(st==="lock"?c.acc:"#4E9E5C")+'"/>'
 +'<circle cx="20" cy="58" r="14" fill="'+(st==="lock"?c.acc:"#3F8A4D")+'"/>'
 +'<rect x="31" y="60" width="7" height="58" fill="'+c.dark+'"/>'
 +'<rect x="52" y="70" width="56" height="48" fill="'+c.w+'"/>'
 +'<path d="M46 70h68l-6-12H52z" fill="'+c.r+'"/>'
 +win(60,78,14,14,c)+win(88,78,14,14,c)
 +dr(70,96,22,22,c,1)
 +'<rect x="14" y="104" width="26" height="4" fill="'+c.dark+'"/>'
 +'<rect x="16" y="108" width="4" height="10" fill="'+c.dark+'"/><rect x="34" y="108" width="4" height="10" fill="'+c.dark+'"/>');}
];
