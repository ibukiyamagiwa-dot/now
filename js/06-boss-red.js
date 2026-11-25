/* ===== 赤い騎士（深淵に飲まれなかった世界線の門番・隠しボス）：人の技だけ。打ち合いが核。本気になると長く速くなり、遅らせるひと振りの位置も変わる ===== */
function redTurn(){if(G.rp){G.en.tn=(G.en.tn||0)+1;return rpMake()}const e=G.en,r=e.rage,last=e.lastMv;e.tn=(e.tn||0)+1;const R=P.cueF,P2=x=>Math.round(x*(r?.7:1));
 const pool=r?['two','swap','rally','dfeint','combo4','thrust','rally','rally','tri','delay']:['two','swap','rally','feint','combo4','thrust','rally','tri','delay'];
 const mv=dbg.lordMv||G.pmv||(e.finale?'rally':e.tn===1?'rally':pick(pool.filter(m=>m!==last)));e.lastMv=mv;
 let L;
 if(mv==='two')L=[{pre:P2(14),mv:'cut',m:1.1},{pre:6,mv:'cut2',m:1.1,iv:'ivRed2'}];
 else if(mv==='swap')L=[{pre:P2(14),mv:'cut2',m:1.1},{pre:6,mv:'cut',m:1.2,iv:'ivRed2'}];
 else if(mv==='thrust')L=[{pre:P2(22),mv:'thr',m:1.5,red:true}];
 else if(mv==='feint')L=[{fake:true,pre:14,mv:'cut'},{pre:6,mv:'cut2',m:1.2}];
 else if(mv==='dfeint')L=[{fake:true,pre:12,mv:'thr'},{fake:true,pre:4,mv:'cut'},{pre:6,mv:'thr',m:1.4,red:true}];
 else if(mv==='combo4')L=[{pre:P2(16),mv:'cut',m:1},{pre:6,mv:'cut2',m:1,iv:'ivRed4'},{pre:6,mv:'cut',m:1,iv:'ivRed4'},{pre:14,mv:'thr',m:1.4,red:true,iv:'ivRed4z'}];
 /* 三段突き：前の突きが当たった瞬間に次の突きの光（間は詰めたまま、予兆→着弾は28F） */
 else if(mv==='tri')L=[{pre:P2(16),mv:'thr',m:1},{iv:'ivRedT',cl:R,mv:'thr',m:1},{iv:'ivRedT',cl:R,mv:'thr',m:1.5,red:true}];
 /* 遅らせ突き：構えたまま長く溜める。動きではなく光で押す */
 else if(mv==='delay')L=[{pre:P2(50),mv:'thr',m:1.5}];
 else{const n=r?5:4;L=rallyList(n,false,r&&Math.random()<.5?n-1:n,{vary:true,heavy:true,feint:r?[.5,.22,.08]:[.35,.12,.03]})}
 /* 反撃：こちらが「たたかう」で斬った直後のターンは、まず素早いひと振りを返してくる */
 if(e.lastAtk&&!G.pmv&&!dbg.lordMv&&Math.random()<(r?.75:.5)){e.lastAtk=false;text(EXc(),FLOOR-70,'切り返し！','#ff9a9a',true);return[{pre:2,mv:'cut2',m:.9}].concat(leadFirst(L))}
 return L}
