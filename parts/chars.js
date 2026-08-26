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
    ? '<path d="M48 52c2-2.5 5.5-2.5 7.5 0M66 52c2-2.5 5.5-2.5 7.5 0" stroke="#2A1B0E" stroke-width="2.8" fill="none" stroke-linecap="round"/>'
    : '<circle cx="52" cy="52" r="3.6" fill="#2A1B0E"/><circle cx="70" cy="52" r="3.6" fill="#2A1B0E"/>'
      +'<circle cx="53" cy="51" r="1.3" fill="#fff"/><circle cx="71" cy="51" r="1.3" fill="#fff"/>';
  return '<svg class="ch ch--bruno" viewBox="0 0 120 140" width="'+size+'" role="img" aria-label="Бруно, бобер-інженер">'
  +'<ellipse cx="60" cy="132" rx="32" ry="4.5" fill="#221F1A" opacity=".10"/>'
  /* плаский хвіст */
  +'<ellipse cx="94" cy="112" rx="20" ry="12" fill="#6B4423" transform="rotate(18 94 112)"/>'
  +'<path d="M82 106h22M82 114h22M88 100v22" stroke="#4E3018" stroke-width="2" opacity=".5"/>'
  /* лапи */
  +'<rect x="42" y="112" width="14" height="16" rx="6" fill="#7A5230"/>'
  +'<rect x="62" y="112" width="14" height="16" rx="6" fill="#7A5230"/>'
  /* тіло */
  +'<ellipse cx="60" cy="92" rx="30" ry="27" fill="#8B5E34"/>'
  +'<ellipse cx="60" cy="97" rx="20" ry="20" fill="#B98A5A"/>'
  /* голова */
  +'<circle cx="61" cy="52" r="27" fill="#8B5E34"/>'
  /* вушка */
  +'<circle cx="40" cy="34" r="7" fill="#6B4423"/><circle cx="82" cy="34" r="7" fill="#6B4423"/>'
  /* морда */
  +'<ellipse cx="61" cy="64" rx="16" ry="12" fill="#D9B183"/>'
  +'<ellipse cx="61" cy="57" rx="6" ry="4.5" fill="#2A1B0E"/>'
  +eye
  /* два різці — головна прикмета бобра */
  +'<rect x="55" y="66" width="5.5" height="11" rx="1.6" fill="#fff"/>'
  +'<rect x="61.5" y="66" width="5.5" height="11" rx="1.6" fill="#fff"/>'
  /* каска інженера */
  +'<path d="M35 32a26 26 0 0 1 52 0z" fill="#FFC814"/>'
  +'<rect x="31" y="30" width="60" height="7" rx="3.5" fill="#E0A800"/>'
  +'<rect x="58" y="12" width="6" height="20" rx="3" fill="#E0A800"/>'
  +'</svg>';
}

/* --- Курт, кріт-машиніст U-Bahn. Ганяє на час. --- */
function kurt(size,mood){
  size=size||110; mood=mood||"idle";
  const eye = mood==="happy"
    ? '<path d="M48 54c2-2 5-2 7 0M67 54c2-2 5-2 7 0" stroke="#2B2438" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
    : '<path d="M47 54h8M66 54h8" stroke="#2B2438" stroke-width="3" stroke-linecap="round"/>';
  return '<svg class="ch ch--kurt" viewBox="0 0 120 140" width="'+size+'" role="img" aria-label="Курт, кріт-машиніст">'
  +'<ellipse cx="60" cy="132" rx="30" ry="4.5" fill="#221F1A" opacity=".10"/>'
  /* лапи-копалки */
  +'<ellipse cx="34" cy="96" rx="11" ry="13" fill="#E8A0A8" transform="rotate(-18 34 96)"/>'
  +'<path d="M27 90v14M32 88v16M37 90v14" stroke="#C97F88" stroke-width="2.2" stroke-linecap="round"/>'
  +'<ellipse cx="88" cy="96" rx="11" ry="13" fill="#E8A0A8" transform="rotate(18 88 96)"/>'
  +'<path d="M83 90v14M88 88v16M93 90v14" stroke="#C97F88" stroke-width="2.2" stroke-linecap="round"/>'
  /* ноги */
  +'<rect x="47" y="114" width="12" height="14" rx="5" fill="#4A4160"/>'
  +'<rect x="61" y="114" width="12" height="14" rx="5" fill="#4A4160"/>'
  /* тіло */
  +'<ellipse cx="60" cy="94" rx="27" ry="26" fill="#5C5175"/>'
  +'<ellipse cx="60" cy="99" rx="17" ry="18" fill="#7A6E94"/>'
  /* голова */
  +'<circle cx="60" cy="56" r="26" fill="#5C5175"/>'
  +eye
  /* рожевий ніс-п'ятачок */
  +'<ellipse cx="60" cy="68" rx="11" ry="8" fill="#E8A0A8"/>'
  +'<circle cx="56" cy="67" r="2" fill="#B9707A"/><circle cx="64" cy="67" r="2" fill="#B9707A"/>'
  /* кашкет машиніста */
  +'<path d="M34 40a26 26 0 0 1 52 0z" fill="#2B6FE8"/>'
  +'<rect x="30" y="38" width="60" height="8" rx="4" fill="#1D51B0"/>'
  +'<path d="M28 46h30v5H28z" fill="#16367A"/>'
  +'<circle cx="60" cy="30" r="7" fill="#FFC814"/>'
  +'<text x="60" y="34" font-size="9" font-family="Arial Black,sans-serif" font-weight="900" text-anchor="middle" fill="#1D51B0">U</text>'
  +'</svg>';
}

/* --- Ґрета, їжачка-булочниця. Слово дня. --- */
function greta(size,mood){
  size=size||110; mood=mood||"idle";
  const eye = mood==="happy"
    ? '<path d="M50 58c2-2.5 5.5-2.5 7.5 0M67 58c2-2.5 5.5-2.5 7.5 0" stroke="#3A2A18" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
    : '<circle cx="54" cy="58" r="3.4" fill="#3A2A18"/><circle cx="71" cy="58" r="3.4" fill="#3A2A18"/>'
      +'<circle cx="55" cy="57" r="1.2" fill="#fff"/><circle cx="72" cy="57" r="1.2" fill="#fff"/>';
  /* колючки — трикутники по дузі */
  let sp='';
  for(let i=0;i<11;i++){
    const a=Math.PI*(1.06+i*0.088), r=30;
    const cx=62+Math.cos(a)*r, cy=58+Math.sin(a)*r;
    const tx=62+Math.cos(a)*(r+13), ty=58+Math.sin(a)*(r+13);
    sp+='<path d="M'+(cx-6)+' '+cy+'L'+tx+' '+ty+'L'+(cx+6)+' '+cy+'z" fill="#6B4E2E"/>';
  }
  return '<svg class="ch ch--greta" viewBox="0 0 120 140" width="'+size+'" role="img" aria-label="Ґрета, їжачка-булочниця">'
  +'<ellipse cx="60" cy="132" rx="30" ry="4.5" fill="#221F1A" opacity=".10"/>'
  /* ніжки */
  +'<rect x="48" y="112" width="11" height="15" rx="5" fill="#C08A5A"/>'
  +'<rect x="63" y="112" width="11" height="15" rx="5" fill="#C08A5A"/>'
  /* тіло у фартуху */
  +'<ellipse cx="61" cy="94" rx="29" ry="26" fill="#8B6239"/>'
  +'<path d="M42 84h38v22a19 19 0 0 1-38 0z" fill="#F7F5EE"/>'
  +'<path d="M52 84h18v6H52z" fill="#E4342F" opacity=".85"/>'
  +sp
  /* голова */
  +'<circle cx="62" cy="58" r="26" fill="#D9AE7C"/>'
  +'<ellipse cx="62" cy="70" rx="14" ry="11" fill="#EBCFA8"/>'
  +'<ellipse cx="62" cy="64" rx="5.5" ry="4.5" fill="#3A2A18"/>'
  +eye
  /* кухарський ковпак, зсунутий набік */
  +'<ellipse cx="80" cy="30" rx="15" ry="11" fill="#fff"/>'
  +'<rect x="68" y="34" width="24" height="9" rx="4" fill="#F0EDE2"/>'
  /* крендель у лапці */
  +'<g transform="translate(22 86)">'
  +'<circle cx="12" cy="12" r="12" fill="none" stroke="#C98430" stroke-width="5"/>'
  +'<path d="M4 6c4 8 16 8 16 0" stroke="#C98430" stroke-width="5" fill="none" stroke-linecap="round"/>'
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
