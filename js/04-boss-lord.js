/* ===== 門のぬし（覚悟3・9階の大ラスボス）=====
   予兆→着弾は常に28F。打ち合いは「前の着弾＝次の予兆」で28Fおきに続き、最後のひと振りだけ一拍（18F）遅れて来る。
   前半は剣の技、怒ると兜が割れて深淵の技（触腕・背の触手・伸びる刃・胸の口・ささやき）が混ざる。 */
const LMV={vlash:['idle','idle','idle'],cape:['cut2R','cut2R','cut2S'],cut:['cutR','cutM','cutS'],cut2:['cut2R','cut2M','cut2S'],thr:['thrR','thrR','thrS'],arm:['armR','armR','armR'],bk:['mawR','mawR','mawR'],reach:['cutR','cutM','cutS'],maw:['mawR','mawR','mawR']};
function lordTurn(){if(G.rp){G.en.tn=(G.en.tn||0)+1;return rpMake()}if(G.en.skin==='R')return redTurn();const e=G.en,B=e.form==='B',F=e.skin==='F',last=e.lastMv;e.tn=(e.tn||0)+1;const R=P.cueF;
 const pool=F&&!e.p2?['two','swap','combo4','dfeint','rally','rally','thrust','back','mix']:B?['arm','back','reach','maw','whis','sa','rally','rally','two','swap']:['two','swap','rally','rally','feint','thrust'];if(F&&e.p2)pool.push('combo4','dfeint','mix','mix');
 const mv=dbg.lordMv||G.pmv||(e.finale?'rally':e.tn===1?'two':B&&!(F&&!e.p2)&&!e.bFirst?(e.bFirst=1,'arm'):pick(pool.filter(m=>m!==last)));e.lastMv=mv;
 const L=lordMove(mv,e,B,F,R);
 /* 連携：技のあと、間を置かずに別の技が続くことがある（練習で技を選んだときは続けない） */
 const CH=['two','swap','thrust','feint'].concat(B?['arm','reach']:[]);
 if(!G.pmv&&!dbg.lordMv&&e.tn>1&&['two','swap','thrust','feint','arm','reach','maw','whis','sa','combo4'].includes(mv)&&Math.random()<(F?(e.p2?.5:.35):B?.42:.3)){
  const m2=pick(CH.filter(x=>x!==mv)),L2=lordMove(m2,e,B,F,R);L2[0]=Object.assign({},L2[0],{pre:Math.min(L2[0].pre||10,10)});
  if(!e.chainTip){e.chainTip=1;text(EXc(),FLOOR-70,'連携！','#ff9a9a',true)}return L.concat(leadFirst(L2))}
 return L}
function lordMove(mv,e,B,F,R){
 if(mv==='two')return[{pre:16,mv:'cut',m:1},{pre:8,mv:'cut2',m:1,iv:'ivLord2'}];
 if(mv==='swap')return[{pre:16,mv:'cut2',m:1},{pre:8,mv:'cut',m:1.1,iv:'ivLord2'}];
 if(mv==='thrust')return[{pre:24,mv:'thr',m:1.4,red:Math.random()<.5}];
 if(mv==='feint')return[{fake:true,pre:16,mv:'thr'},{pre:8,mv:'thr',m:1.2}];
 if(mv==='combo4')return[{pre:16,mv:'cut',m:1},{pre:6,mv:'cut2',m:1,iv:'ivLord4'},{pre:6,mv:'cut',m:1,iv:'ivLord4'},{pre:14,mv:'thr',m:1.4,red:true,iv:'ivLord4z'}];
 if(mv==='dfeint')return[{fake:true,pre:12,mv:'thr'},{fake:true,pre:4,mv:'cut'},{pre:6,mv:'thr',m:1.4,red:true}];
 if(mv==='rally'){const n=F?(e.p2?5:4):B?4:3;return rallyList(n,B,F&&Math.random()<.5?n-1:n,{vary:true,heavy:B||F,feint:F?.6:0})}
 if(mv==='arm')return[{pre:28,mv:'arm',m:1.5,red:Math.random()<.4}];
 if(mv==='back'){const ord=shuffle([0,1,2]),L=ord.map((h,i)=>({ping:true,pre:i?R:30,note:h}));ord.forEach((h,i)=>L.push(Object.assign({m:1,mv:'bk',ten:h,note:h,rhythm:true,st:30+R*i},i?{gap:R,cl:R}:{pre:R,cl:R})));tipOnce('eye',EYE_TIP);return L}
 /* 剣と触手：目が開いた順の触手のあいだに、剣が割り込む（拍は28Fのまま。触手→剣→触手→剣→触手） */
 if(mv==='mix'){const ord=shuffle([0,1,2]),L=ord.map((h,i)=>({ping:true,pre:i?R:30,note:h}));
  ord.forEach((h,i)=>{L.push(Object.assign({m:1,mv:'bk',ten:h,note:h,rhythm:true,st:30+R*i},i?{gap:R,cl:R}:{pre:R,cl:R}));if(i<2)L.push({gap:R,cl:R,mv:i?'cut2':'cut',m:1.1,rhythm:true,keep:true})});
  tipOnce('mix','開いた目の触手のあいだに剣が割り込む　剣は剣の光で弾く');return L}
 if(mv==='reach')return[{fake:true,pre:14,mv:'cut'},{pre:10,mv:'reach',m:1.5,red:true}];
 if(mv==='maw')return[{pre:26,mv:'maw',m:1.6,drain:true}];
 if(mv==='whis'){G.whis=1;SFX.whisper();tipOnce('whis','ささやき　光が消える　音と構えで読もう');return[{pre:26,mv:'cut',m:1.1,nolight:true},{pre:8,mv:'cut2',m:1.1,nolight:true,iv:'ivLordW'}]}
 return[{pre:14,mv:'cut',m:1},{pre:8,mv:'cut2',m:1,iv:'ivLordS'},{pre:10,mv:'arm',m:1.3,iv:'ivLordSz'}]}
function lordTent(P,r0,r1,v,e,N){const Lc=Math.hypot(P[1][0]-P[0][0],P[1][1]-P[0][1])+Math.hypot(P[2][0]-P[1][0],P[2][1]-P[1][1])+Math.hypot(P[3][0]-P[2][0],P[3][1]-P[2][1]);N=Math.max(N||30,Math.ceil(Lc/1.2));const Q={B:P[0],C1:P[1],C2:P[2],E:P[3]},pts=[];for(let i=0;i<=N;i++)pts.push(bez3(Q,i/N));const c1=nCol('#2a1838',v,e.tint),c2=nCol('#5a2e74',v,e.tint),c3=nCol('#b07ad0',v,e.tint),rd=i=>r0+(r1-r0)*i/N;
 for(let i=0;i<=N;i++)disc(pts[i][0],pts[i][1],rd(i)+1,OUT);for(let i=0;i<=N;i++)disc(pts[i][0],pts[i][1],rd(i),c1);for(let i=0;i<=N;i++)if(rd(i)>=1.5)disc(pts[i][0]-rd(i)*.35,pts[i][1]-rd(i)*.35,rd(i)*.45,c2);
 for(let i=4;i<N-3;i+=5){const a=pts[i-1],b=pts[i+1],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1;px(pts[i][0]+dy/L*rd(i)*.7,pts[i][1]-dx/L*rd(i)*.7,c3)}
 return pts}
function lineP(x0,y0,x1,y1,col){const n=Math.max(1,Math.round(Math.max(Math.abs(x1-x0),Math.abs(y1-y0))));for(let i=0;i<=n;i++)px(x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,col)}
function drawLordArm(s,x,y,A,v,e,cur){const R=[x+A.S2[0],y+A.S2[1]],H2=[HX+18,FLOOR-14],d=G.et-s.impact,u=Math.min(1,Math.max(0,(G.et-s.start)/14)),SW=6;
 const rest=[R[0]+6,R[1]+12],up=[R[0]+2,R[1]-34],C1=[R[0]+12,R[1]-6];let E,C2;
 if(d>0){const q=Math.min(1,d/12);E=lerp2(H2,rest,q*q);C2=lerp2([HX+60,FLOOR-58],[R[0]+16,R[1]-10],q)}
 else if(d>=-SW){const t=(d+SW)/SW,q=t*t;E=lerp2(up,H2,q);C2=lerp2([R[0]+14,R[1]-30],[HX+60,FLOOR-58],q)}
 else{const ea=1-(1-u)*(1-u);E=lerp2(rest,up,ea);E=[E[0]+(G.et<s.cue?Math.sin(G.anim*.1)*.7:0),E[1]];C2=lerp2([R[0]+16,R[1]-10],[R[0]+14,R[1]-30],ea)}
 const pts=lordTent([R,C1,C2,E],3.2,1.4,v,e);
 const a=pts[pts.length-4],b=pts[pts.length-1],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,tx=b[0]+ux*15,ty=b[1]+uy*15;
 lineP(b[0]-uy*3,b[1]+ux*3,b[0]+uy*3,b[1]-ux*3,'#c8a24a');lineP(b[0],b[1],tx,ty,v==='w'?'#fff4ee':'#c4ccd8');lineP(b[0]+uy,b[1]-ux,tx+uy*.6,ty-ux*.6,'#7a8292');
 for(let j=1;j<=2;j++)px(b[0]-ux*2+uy*j,b[1]-uy*2-ux*j+j,'#3a5ab0');
 if(d>=-SW&&d<=0)for(let j=1;j<=4;j++){const q=Math.max(0,((d+SW)/SW)-j*.14),P2=lerp2(up,H2,q*q);px(P2[0],P2[1],j<2?'#ffffff':'#e0c8ff');px(P2[0]+1,P2[1],'#b07ad0')}
 if(s===cur)G.lordTip={x:Math.round(tx),y:Math.round(ty)}}
function bkPoise(R,i){return[R[0]-8-i*10,R[1]-40+i*7]}
function drawLordBk(s,x,y,A,v,e,cur){if(!A.bk)return;const R=[x+A.bk[0],y+A.bk[1]],i=s.ten||0,d=G.et-s.impact,H2=[HX+16,FLOOR-18],SW=5,poise=bkPoise(R,i),side=[R[0]+6+i*4,R[1]-10-i*3],C1=[R[0]+4,R[1]-14];let E,C2;
 if(d>0){const q=Math.min(1,d/10);E=lerp2(H2,side,q);C2=lerp2([H2[0]+34,R[1]-50],[R[0]+8,R[1]-22],q)}
 else if(d>=-SW){const t=(d+SW)/SW,q=t*t;E=lerp2(poise,H2,q);C2=lerp2([poise[0]+6,poise[1]-14],[H2[0]+34,R[1]-50],q)}
 else{const k=G.et-s.cue,pb=k>=0?Math.min(1,k/8)*2:0;E=[poise[0]+pb+(k<0?Math.sin(G.anim*.09+i*2)*.8:0),poise[1]-pb];C2=[poise[0]+6,poise[1]-14]}
 lordTent([R,C1,C2,E],2.6,1,v,e,26);{const a=eyeAge(s);if(a>=0)abyssEye(E[0],E[1]-1,a)}
 if(d>=-SW&&d<=0)for(let j=1;j<=3;j++){const q=Math.max(0,((d+SW)/SW)-j*.16),P2=lerp2(poise,H2,q*q);px(P2[0],P2[1],j<2?'#ffffff':'#e0c8ff')}
 if(s===cur)G.lordTip={x:Math.round(E[0]),y:Math.round(E[1])}}
