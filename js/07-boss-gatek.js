/* ===== 黒い門番（覚悟3・6階の中ボス）：深淵に飲まれかけた門番。剣はそのまま、触手が勝手に襲う ===== */
function gateKTurn(){const e=G.en,last=e.lastMv;e.tn=(e.tn||0)+1;const R=P.cueF;
 const mv=dbg.lordMv||G.pmv||(e.demo?'two':pick(['two','vlash','cape','yank'].filter(m=>m!==last)));e.lastMv=mv;
 if(mv==='two')return[{pre:16,mv:'cut',m:1},{pre:8,mv:'cut2',m:1}];
 if(mv==='yank')return[{fake:true,pre:16,mv:'yank'},{pre:8,mv:'cut',m:1.3}];
 if(mv==='cape')return[{pre:28,mv:'cape',m:1.5,red:Math.random()<.5}];
 const ord=shuffle([0,1,2]),L=ord.map((h,i)=>({ping:true,pre:i?R:30,note:h}));ord.forEach((h,i)=>L.push(Object.assign({m:.9,mv:'vlash',ten:h,note:h,rhythm:true,st:30+R*i},i?{gap:R,cl:R}:{pre:R,cl:R})));tipOnce('eye',EYE_TIP);return L}
function tentStab(s,R,poise,side,H2,v,e,cur,r0){const d=G.et-s.impact,SW=5,C1=[R[0]-2,R[1]+6];let E,C2;
 if(d>0){const q=Math.min(1,d/10);E=lerp2(H2,side,q);C2=lerp2([H2[0]+26,H2[1]-30],[R[0]-4,R[1]+4],q)}
 else if(d>=-SW){const t=(d+SW)/SW,q=t*t;E=lerp2(poise,H2,q);C2=lerp2([poise[0]+6,poise[1]-10],[H2[0]+26,H2[1]-30],q)}
 else{const u=Math.min(1,Math.max(0,(G.et-s.start)/10)),ea=1-(1-u)*(1-u);E=lerp2(side,poise,ea);C2=lerp2([R[0]-4,R[1]+4],[poise[0]+6,poise[1]-10],ea)}
 lordTent([R,C1,C2,E],r0,.9,v,e,22);{const a=eyeAge(s);if(a>=0)abyssEye(E[0],E[1]-1,a)}
 if(d>=-SW&&d<=0)for(let j=1;j<=3;j++){const q=Math.max(0,((d+SW)/SW)-j*.16),P2=lerp2(poise,H2,q*q);px(P2[0],P2[1],j<2?'#ffffff':'#e0c8ff')}
 if(s===cur)G.lordTip={x:Math.round(E[0]),y:Math.round(E[1])}}
function tentSweep(s,R,v,e,cur){const d=G.et-s.impact,SW=6,H2=[HX+14,FLOOR-3],rest=[R[0]+4,R[1]+3],up=[R[0]+6,R[1]-22],C1=[R[0]+8,R[1]+2];let E,C2;
 if(d>0){const q=Math.min(1,d/12);E=lerp2(H2,rest,q*q);C2=lerp2([(R[0]+H2[0])/2,FLOOR-1],[R[0]+12,R[1]-4],q)}
 else if(d>=-SW){const t=(d+SW)/SW,q=t*t;E=lerp2(up,H2,q);C2=lerp2([R[0]+12,R[1]-24],[(R[0]+H2[0])/2,FLOOR-1],q)}
 else{const u=Math.min(1,Math.max(0,(G.et-s.start)/14)),ea=1-(1-u)*(1-u);E=lerp2(rest,up,ea);C2=lerp2([R[0]+12,R[1]-4],[R[0]+12,R[1]-24],ea)}
 lordTent([R,C1,C2,E],3,1.2,v,e,30);
 if(d>=-SW&&d<=0)for(let j=1;j<=4;j++){const q=Math.max(0,((d+SW)/SW)-j*.14),P2=lerp2(up,H2,q*q);px(P2[0],P2[1],j<2?'#ffffff':'#e0c8ff')}
 if(s===cur)G.lordTip={x:Math.round(E[0]),y:Math.round(E[1])}}
/* 門のぬし：1本目を削りきると膝をつき、深淵を解き放って第2形態（体力は満タンに戻る） */
function lordPhase2(quiet){const e=G.en;e.p2=true;e.finale=false;e.finFail=0;e.hp=1;e.p2From=G.state;G.strikes.forEach(x=>x.done=true);G.act=null;e.broken=0;e.brk=0;e.brkPend=0;e.stance=false;e.rage=true;e.roared=true;
 G.state='roar';G.t=0;G.rh=0;G.stop=12;if(!quiet){flash(['#ffffff','#000000','#ffffff','#000000']);SFX.ko();shake(P.shake*1.4)}else{SFX.thud(1);shake(P.shake*.6)}text((HX+EX)/2+10,FLOOR-60,`${e.name}が膝をついた……`,'#e8c46a',true,ROAR_HOLD+20);msg(`${e.name}が膝をついた……`)}

