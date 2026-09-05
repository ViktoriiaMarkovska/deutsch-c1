/* ================= КАСТ ВУЛИЦІ =================
   Усі — звірі в тому ж пласкому стилі, що й Вальді: суцільні заливки,
   без обведень і градієнтів, читаються від 36px. Кожен тримає одну
   крамницю на вулиці й одне завдання.                                  */

/* --- Ельза, сорока. Збирає твої помилки, як сорока — блискітки.
       Профіль, а не «стовпчик»: інакше чорно-біла птаха читається як пінгвін.
       Прикмети сороки — довгий клиноподібний хвіст і біла пляма на плечі. --- */
function elsa(size,mood){
  size=size||110; mood=mood||"idle";
  const eye = mood==="happy"
    ? '<path d="M44 44c2-2.5 5.5-2.5 7.5 0" stroke="#F7F5EE" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
    : '<circle cx="47" cy="45" r="4.2" fill="#F7F5EE"/><circle cx="48" cy="44" r="1.9" fill="#1A1A22"/>';
  return '<svg class="ch ch--elsa" viewBox="0 0 120 140" width="'+size+'" role="img" aria-label="Ельза, сорока">'
  +'<ellipse cx="56" cy="130" rx="26" ry="4.5" fill="#221F1A" opacity=".10"/>'
  /* довгий клиноподібний хвіст — головна прикмета */
  +'<path d="M70 78L112 116l-9 6-38-32z" fill="#1F2A4D"/>'
  +'<path d="M68 80L104 114l-6 4-32-28z" fill="#33477F"/>'
  /* лапки */
  +'<path d="M50 112v12M46 124h9M62 112v12M58 124h9" stroke="#E8A33D" stroke-width="3.4" stroke-linecap="round" fill="none"/>'
  /* тіло у профіль */
  +'<ellipse cx="57" cy="84" rx="25" ry="27" fill="#1A1A22"/>'
  /* біле черево збоку, не по центру */
  +'<path d="M40 76c-6 12-4 26 6 32 8 5 16 1 18-6-10-2-20-12-24-26z" fill="#F7F5EE"/>'
  /* крило з білою плямою на плечі */
  +'<path d="M62 66c13 4 20 18 18 32-8 0-16-8-20-18z" fill="#33477F"/>'
  +'<path d="M62 68c6 2 10 6 12 11-5 1-10-2-12-7z" fill="#F7F5EE"/>'
  /* голова */
  +'<circle cx="52" cy="47" r="21" fill="#1A1A22"/>'
  /* гострий дзьоб */
  +'<path d="M32 45l-17 4 17 6z" fill="#E8A33D"/>'
  +eye
  /* блискітка — вкрадена помилка */
  +'<path d="m92 34 3 6.5 7 1-5 5 1.3 7-6.3-3.5-6.3 3.5 1.3-7-5-5 7-1z" fill="#FFC814"/>'
  +'</svg>';
}

/* --- Бруно, бобер-інженер. Будує довгі складені слова. --- */
function bruno(size,mood){
  size=size||110; mood=mood||"idle";
  const eye = mood==="happy"
    ? '<path d="M31 55c2-2.5 5.5-2.5 7.5 0" stroke="#2A1B0E" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
    : '<circle cx="34" cy="56" r="4" fill="#2A1B0E"/><circle cx="35.4" cy="54.8" r="1.5" fill="#fff"/>';
  return '<svg class="ch ch--bruno" viewBox="0 0 120 140" width="'+size+'" role="img" aria-label="Бруно, бобер-інженер">'
  +'<ellipse cx="58" cy="130" rx="30" ry="4.5" fill="#221F1A" opacity=".10"/>'
  /* плаский лускатий хвіст — головна прикмета, лежить позаду */
  +'<path d="M78 100c16-6 30-2 34 8 4 10-6 18-20 16-11-2-18-10-14-24z" fill="#6B4423"/>'
  +'<path d="M84 104l24 6M82 112l26 4M92 100l-4 22M102 102l-4 20" stroke="#4E3018" stroke-width="1.8" opacity=".55"/>'
  /* лапки */
  +'<path d="M46 112v14M42 126h10M62 112v14M58 126h10" stroke="#5E3F1F" stroke-width="4" stroke-linecap="round" fill="none"/>'
  /* тіло у профіль */
  +'<ellipse cx="60" cy="92" rx="26" ry="25" fill="#8B5E34"/>'
  +'<path d="M40 86c-5 10-2 22 8 26 7 3 14 0 16-6-9-2-19-8-24-20z" fill="#C89A6B"/>'
  /* голова в профіль */
  +'<circle cx="42" cy="58" r="21" fill="#8B5E34"/>'
  /* морда витягнута вліво */
  +'<path d="M24 56c-10 1-14 6-14 11 0 5 5 9 14 9 8 0 13-5 13-10s-5-10-13-10z" fill="#C89A6B"/>'
  +'<ellipse cx="12" cy="63" rx="4.5" ry="3.5" fill="#2A1B0E"/>'
  /* два різці — без них це не бобер */
  +'<rect x="15" y="70" width="5" height="12" rx="1.6" fill="#fff"/>'
  +'<rect x="21" y="70" width="5" height="12" rx="1.6" fill="#F2EEE2"/>'
  +eye
  /* вушко */
  +'<circle cx="54" cy="42" r="6.5" fill="#6B4423"/>'
  /* каска інженера, зсунута назад */
  +'<path d="M23 42a21 21 0 0 1 40-6l-2 6z" fill="#FFC814"/>'
  +'<rect x="20" y="40" width="46" height="7" rx="3.5" fill="#E0A800" transform="rotate(-6 43 43)"/>'
  /* олівець за вухом — підпис персонажа */
  +'<rect x="58" y="30" width="5" height="20" rx="1.5" fill="#E8A33D" transform="rotate(16 60 40)"/>'
  +'<path d="M63 28l3 5-5 1z" fill="#2A1B0E" transform="rotate(16 60 40)"/>'
  +'</svg>';
}

/* --- Курт, кріт-машиніст U-Bahn. Ганяє на час. --- */
function kurt(size,mood){
  size=size||110; mood=mood||"idle";
  /* кроти майже не бачать — очі завжди примружені */
  const eye = mood==="happy"
    ? '<path d="M33 56c2.5-3 6-3 8 0" stroke="#2B2438" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
    : '<path d="M32 57h9" stroke="#2B2438" stroke-width="3" stroke-linecap="round"/>';
  return '<svg class="ch ch--kurt" viewBox="0 0 120 140" width="'+size+'" role="img" aria-label="Курт, кріт-машиніст">'
  +'<ellipse cx="58" cy="130" rx="28" ry="4.5" fill="#221F1A" opacity=".10"/>'
  /* хвостик-ґудзик позаду */
  +'<path d="M84 104c8 2 12 8 10 14" stroke="#4A4160" stroke-width="5" fill="none" stroke-linecap="round"/>'
  /* ноги */
  +'<rect x="50" y="112" width="12" height="15" rx="5" fill="#4A4160"/>'
  +'<rect x="64" y="112" width="12" height="15" rx="5" fill="#4A4160"/>'
  /* тіло у профіль */
  +'<ellipse cx="62" cy="92" rx="26" ry="25" fill="#5C5175"/>'
  +'<path d="M43 86c-5 10-2 22 8 26 7 3 14 0 16-6-9-2-19-8-24-20z" fill="#8479A0"/>'
  /* голова */
  +'<circle cx="44" cy="60" r="20" fill="#5C5175"/>'
  /* рожевий ніс-рильце, витягнутий уперед */
  +'<path d="M26 58c-9 1-13 5-13 9s5 8 13 8c7 0 12-4 12-8s-5-9-12-9z" fill="#E8A0A8"/>'
  +'<circle cx="15" cy="65" r="2.6" fill="#B9707A"/><circle cx="15" cy="71" r="2.6" fill="#B9707A"/>'
  +eye
  /* лапи-лопати — ними він копає тунелі */
  +'<ellipse cx="42" cy="103" rx="9.5" ry="12" fill="#E8A0A8" transform="rotate(-26 42 103)"/>'
  +'<path d="M37 98v12M42 96v14M47 98v12" stroke="#C97F88" stroke-width="2.2" stroke-linecap="round"/>'
  /* кашкет машиніста з козирком уперед */
  +'<path d="M26 46a20 20 0 0 1 38-4l-2 5z" fill="#2B6FE8"/>'
  +'<rect x="24" y="44" width="42" height="7" rx="3.5" fill="#1D51B0" transform="rotate(-7 45 47)"/>'
  +'<path d="M26 48c-9 1-14 3-16 6l20 2z" fill="#16367A"/>'
  +'<circle cx="52" cy="34" r="7" fill="#FFC814"/>'
  +'<text x="52" y="38" font-size="9.5" font-family="Arial Black,sans-serif" font-weight="900" text-anchor="middle" fill="#1D51B0">U</text>'
  +'</svg>';
}

/* --- Ґрета, їжачка-булочниця. Слово дня. --- */
function greta(size,mood){
  size=size||110; mood=mood||"idle";
  const eye = mood==="happy"
    ? '<path d="M32 58c2-2.5 5.5-2.5 7.5 0" stroke="#3A2A18" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
    : '<circle cx="35" cy="59" r="3.8" fill="#3A2A18"/><circle cx="36.3" cy="57.9" r="1.4" fill="#fff"/>';
  /* колючки ростуть зі СПИНИ по верхній дузі тіла, не з голови */
  let sp='';
  const cx=64, cy=90, r=26;
  for(let i=0;i<19;i++){
    const a=Math.PI*(1.02+i*0.055);          /* від «загривка» назад до хвоста */
    const nx=Math.cos(a), ny=Math.sin(a);
    const tx=-ny, ty=nx;                      /* дотична — щоб розвести основу */
    const w=4.6, len=17+(i%3)*3.5;            /* довжина трохи гуляє — живіше */
    const b1x=cx+nx*r+tx*w, b1y=cy+ny*r+ty*w;
    const b2x=cx+nx*r-tx*w, b2y=cy+ny*r-ty*w;
    const px=cx+nx*(r+len), py=cy+ny*(r+len);
    sp+='<path d="M'+b1x.toFixed(1)+' '+b1y.toFixed(1)
       +'L'+px.toFixed(1)+' '+py.toFixed(1)
       +'L'+b2x.toFixed(1)+' '+b2y.toFixed(1)+'z" fill="#6B4E2E"/>';
  }
  return '<svg class="ch ch--greta" viewBox="0 0 120 140" width="'+size+'" role="img" aria-label="Ґрета, їжачка-булочниця">'
  +'<ellipse cx="60" cy="130" rx="29" ry="4.5" fill="#221F1A" opacity=".10"/>'
  /* лапки */
  +'<path d="M52 112v14M48 126h10M68 112v14M64 126h10" stroke="#B07C4C" stroke-width="4" stroke-linecap="round" fill="none"/>'
  +sp
  /* тіло у профіль */
  +'<ellipse cx="64" cy="90" rx="27" ry="25" fill="#8B6239"/>'
  /* фартух булочниці збоку */
  +'<path d="M46 84c-5 11-2 24 8 28 7 3 15 0 17-6-10-2-20-9-25-22z" fill="#F7F5EE"/>'
  +'<path d="M48 90c-2 5-2 10 0 14" stroke="#E4342F" stroke-width="3" fill="none" stroke-linecap="round" opacity=".85"/>'
  /* голова в профіль */
  +'<circle cx="44" cy="62" r="19" fill="#D9AE7C"/>'
  /* гостра мордочка — у їжака вона довга */
  +'<path d="M27 60c-11 1-16 5-16 9s5 8 15 8c8 0 13-4 13-8s-4-9-12-9z" fill="#EBCFA8"/>'
  +'<ellipse cx="11" cy="67" rx="4.2" ry="3.4" fill="#3A2A18"/>'
  +eye
  /* кухарський ковпак набік */
  +'<ellipse cx="46" cy="36" rx="15" ry="10" fill="#fff"/>'
  +'<rect x="33" y="41" width="26" height="8" rx="4" fill="#F0EDE2"/>'
  /* крендель у лапці — підпис персонажа */
  +'<g transform="translate(12 92) scale(.72)">'
  +'<circle cx="12" cy="12" r="11" fill="none" stroke="#C98430" stroke-width="5"/>'
  +'<path d="M4 7c4 8 16 8 16 0" stroke="#C98430" stroke-width="5" fill="none" stroke-linecap="round"/>'
  +'</g>'
  +'</svg>';
}

/* ---- реєстр: хто де стоїть і що дає ---- */
const CAST={
  elsa :{name:"Ельза", who:"сорока",            shop:"Гніздо",      task:"mistakes", color:"#2B3A6B", draw:elsa,
         line:"Я підбираю все, на чому ти спіткнулася. Повернемо це, поки не забулося."},
  bruno:{name:"Бруно", who:"бобер-інженер",     shop:"Майстерня",   task:"compound", color:"#8B5E34", draw:bruno,
         line:"Німці не вигадують нові слова — вони склеюють старі. Складаймо."},
  kurt :{name:"Курт",  who:"кріт-машиніст",     shop:"Станція",     task:"sprint",   color:"#5C5175", draw:kurt,
         line:"У розмові ніхто не чекає, поки ти згадаєш. Шістдесят секунд. Поїхали."},
  greta:{name:"Ґрета", who:"їжачка-булочниця",  shop:"Пекарня",     task:"wotd",     color:"#8B6239", draw:greta,
         line:"Одне слово на день, але до самого кореня. Свіже, ще тепле."}
};
const CASTKEYS=["elsa","bruno","kurt","greta"];
