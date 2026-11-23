/* ===== 技の書（周回をまたいで解放されるシステム） ===== */
const SYS=[
 {id:'chase',name:'追撃',cost:2,desc:'剣が当たる少し手前で A → 二の太刀'},
 {id:'gauge',name:'見切りと「ほのお」',cost:3,desc:'パリィで見切りが溜まり、まほうで放てる'},
 {id:'heavy',name:'重い一撃',cost:4,desc:'剣が触れる瞬間に A → 大きな一撃'},
 {id:'lv2',name:'「かみなり」',cost:4,desc:'見切りを2段まで貯められる'},
 {id:'just',name:'ジャスト回避',cost:5,desc:'パリィより少し早めに押しても無傷'},
 {id:'lv3',name:'「ひかり」',cost:5,desc:'見切りを3段まで貯められる'},
 {id:'brk',name:'ブレイク',cost:6,desc:'パリィを重ねて敵の体勢を崩す'}
];
let META={soul:0,lv:0};
try{const m=JSON.parse(localStorage.getItem('parryRPG.meta')||'null');if(m)META=Object.assign(META,m)}catch(e){}
function saveMeta(){try{localStorage.setItem('parryRPG.meta',JSON.stringify(META))}catch(e){}}
const FEAT={unlocks:false,picks:false};
const has=id=>!FEAT.unlocks||dbg.all||SYS.findIndex(x=>x.id===id)<META.lv;
const lvMax=()=>!has('gauge')?0:has('lv3')?3:has('lv2')?2:1;
const qn=n=>n.startsWith('「')?n:`「${n}」`;
const nextSys=()=>META.lv<SYS.length?SYS[META.lv]:null;

