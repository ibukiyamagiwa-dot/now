/* ===== 1周の中の強化（勝つたびに3択） ===== */
let RM2;
function freshMods(){return{parryW:0,atk:0,counter:0,guardCut:0,heal:0,fire:false,chase:0,triple:false,heavy:0,heavyMk:0,magic:0,mk:0,justC:false,brk:0,taken:{}}}
const UP=[
 {id:'parryW',name:'見切りの目',desc:'パリィの受付 +1F',apply:()=>RM2.parryW++},
 {id:'atk',name:'鋭い刃',desc:'たたかうの威力 +4',apply:()=>RM2.atk+=4},
 {id:'pot',name:'薬袋',desc:'薬 +1（最大5）',apply:()=>G.hero.pot=Math.min(5,G.hero.pot+1)},
 {id:'hp',name:'鍛えた体',desc:'最大HP +15（そのぶん回復）',apply:()=>{G.hero.max+=15;G.hero.hp+=15}},
 {id:'counter',name:'返しの冴え',desc:'パリィの反撃 +0.5倍',apply:()=>RM2.counter+=.5},
 {id:'guard',name:'堅い盾',desc:'ガードで受けるダメージ さらに-25%',apply:()=>RM2.guardCut=Math.min(.75,RM2.guardCut+.25)},
 {id:'heal',name:'勝利の息吹',desc:'勝ったときの回復 +20',apply:()=>RM2.heal+=20},
 {id:'fire',name:'炎の受け',desc:'パリィすると炎の追い打ち',req:'gauge',once:true,apply:()=>RM2.fire=true},
 {id:'chase',name:'追い打ち',desc:'追撃の倍率 +0.3',req:'chase',apply:()=>RM2.chase+=.3},
 {id:'triple',name:'三の太刀',desc:'追撃が三連撃になる',req:'chase',once:true,apply:()=>RM2.triple=true},
 {id:'heavy',name:'剛剣',desc:'重い一撃の倍率 +0.5',req:'heavy',apply:()=>RM2.heavy+=.5},
 {id:'heavyMk',name:'芯の手応え',desc:'重い一撃で見切り +25',req:'heavy',once:true,apply:()=>RM2.heavyMk+=25},
 {id:'magic',name:'魔力の高まり',desc:'まほうの威力 +25%',req:'gauge',apply:()=>RM2.magic+=.25},
 {id:'mk',name:'集中',desc:'パリィの見切り獲得 +15',req:'gauge',apply:()=>RM2.mk+=15},
 {id:'justC',name:'すれ違い斬り',desc:'ジャスト回避でも小さく反撃',req:'just',once:true,apply:()=>RM2.justC=true},
 {id:'brk',name:'崩しの技',desc:'ブレイクに必要なパリィ -1',req:'brk',apply:()=>RM2.brk++}
];
function rollOpts(){return shuffle(UP.filter(u=>(!u.req||has(u.req))&&!(u.once&&RM2.taken[u.id]))).slice(0,3)}
const effParry=()=>P.parryF+RM2.parryW;
const heroAtk=()=>P.heroAtk+RM2.atk;
const breakNeed=()=>Math.max(1,P.breakNeed-RM2.brk);

