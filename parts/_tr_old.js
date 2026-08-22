const VEX=["universit","variab","interview","investit","revoluti","evident","validit","prävention","privat","aktiv","positiv","negativ","motiv","servi","konserv","provinz","vision","vulkan","vitamin","video"];
const PRE=["aus","ein","vor","auf","mit","ver","ent","über","unter","frei","früh","bahn","haupt","arbeits","hoch","an","um","zu","wieder","zusammen","fest","land","jahres","staats"];
function tr(s){
 var t=s.toLowerCase().replace(/[^a-zäöüß\s'-]/g,"");
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
