/* ===== 資料集の骨組みで描く（URL に ?new をつけたときだけ。いまは門番だけ） =====
   見本は design/v2（engine.js の Buf、rig.js の knight、specs.js の SPEC.gate、moves.js の g_two・g_kneel、parried.js の g_pry・g_brk・g_rec、hurt.js の g_hurt）。
   門番に要る部品だけを移し、名前はすべて RIG の中に閉じこめる（ゲームの OUT・knight・ring などとぶつけない）。
   手触りは変えない：体の動きは、ゲームの合図と当たりの時刻（G.strikes の cue・impact）から決め、踏みこみの距離はゲームの lungeDist のまま。 */
const RIG=(()=>{
 const OUT='#120910',W=72,H=64,OX=36,TAU=Math.PI*2;
 /* ---- 画素の入れ物：多角形は画素の中心で判定し、左上を明るく右下を暗く塗る ---- */
 class Buf{
  constructor(w,h){this.w=w;this.h=h;this.c=new Array(w*h).fill(0);this.t=new Uint8Array(w*h)}
  set(x,y,c,tag=1){x=Math.round(x);y=Math.round(y);if(x<0||y<0||x>=this.w||y>=this.h||!c)return;const i=y*this.w+x;this.c[i]=c;this.t[i]=tag}
  tag(x,y){if(x<0||y<0||x>=this.w||y>=this.h)return 0;return this.t[y*this.w+x]}
  mask(pts){const m=new Set();let y0=Infinity,y1=-Infinity;for(const p of pts){y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1])}
   for(let y=Math.floor(y0);y<=Math.ceil(y1);y++){const yy=y+.5,xs=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];if((a[1]<=yy&&b[1]>yy)||(b[1]<=yy&&a[1]>yy))xs.push(a[0]+(yy-a[1])/(b[1]-a[1])*(b[0]-a[0]))}
    xs.sort((a,b)=>a-b);for(let k=0;k+1<xs.length;k+=2)for(let x=Math.ceil(xs[k]-.5);x<=Math.floor(xs[k+1]-.5);x++)m.add((y+1024)*4096+x+1024)}return m}
  shade(m,base,hi,lo,tag=1){for(const k of m){const x=(k%4096)-1024,y=Math.floor(k/4096)-1024;const L=!m.has(k-1),T=!m.has(k-4096),R=!m.has(k+1),D=!m.has(k+4096);
   this.set(x,y,(R||D)&&lo?lo:(L||T)&&hi?hi:base,tag)}}
  poly(pts,base,hi,lo,tag){this.shade(this.mask(pts),base,hi,lo,tag)}
  disc(cx,cy,r,base,hi,lo,tag){const m=new Set();for(let y=Math.floor(cy-r);y<=Math.ceil(cy+r);y++)for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++){const dx=x+.5-cx,dy=y+.5-cy;if(dx*dx+dy*dy<=r*r)m.add((y+1024)*4096+x+1024)}this.shade(m,base,hi,lo,tag)}
  line(x0,y0,x1,y1,c,tag=1){x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;for(let n=0;n<400;n++){this.set(x0,y0,c,tag);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx}if(e2<=dx){e+=dx;y0+=sy}}}
  thick(a,b,r,base,hi,lo,tag){const n=Math.max(2,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])));const m=new Set();for(let i=0;i<=n;i++){const t=i/n,cx=a[0]+(b[0]-a[0])*t,cy=a[1]+(b[1]-a[1])*t;for(let y=Math.floor(cy-r);y<=Math.ceil(cy+r);y++)for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++){const dx=x+.5-cx,dy=y+.5-cy;if(dx*dx+dy*dy<=r*r)m.add((y+1024)*4096+x+1024)}}this.shade(m,base,hi,lo,tag)}
  /* 輪郭線：体（tag 1）のまわりの空いた画素を黒で縁どる */
  outline(){const a=[];for(let y=0;y<this.h;y++)for(let x=0;x<this.w;x++){if(this.t[y*this.w+x])continue;if(this.tag(x-1,y)===1||this.tag(x+1,y)===1||this.tag(x,y-1)===1||this.tag(x,y+1)===1)a.push(x,y)}for(let i=0;i<a.length;i+=2)this.set(a[i],a[i+1],OUT,3)}
 }
 const rot=(p,a)=>[p[0]*Math.cos(a)-p[1]*Math.sin(a),p[0]*Math.sin(a)+p[1]*Math.cos(a)],add=(a,b)=>[a[0]+b[0],a[1]+b[1]],dir=(a,L)=>[Math.cos(a)*L,Math.sin(a)*L],lerp=(a,b,t)=>a+(b-a)*t;
 function ik(Hp,F,a,b,bend){const dx=F[0]-Hp[0],dy=F[1]-Hp[1];let d=Math.hypot(dx,dy);d=Math.min(d,a+b-.01);const A=Math.atan2(dy,dx),c=Math.acos(Math.max(-1,Math.min(1,(a*a+d*d-b*b)/(2*a*d))));return add(Hp,dir(A+bend*c,a))}

 /* ---- 騎士の骨組み（rig.js）：角度は画面の向き。0＝右、π/2＝下、π＝左（主人公の方） ---- */
 const PDEF={x:0,lean:0,cr:0,ff:-6,fb:5,kn:0,ua:1.95,fa:2.75,sw:3.4,ua2:1.75,fa2:1.9,sw2:null,hd:0,lift:0};
 const PRO={hk:1.45,lk:.74,tk:.86};
 function joints(ox,oy,S,P){const k=S.k,lk=S.lk||PRO.lk,tk=S.tk||PRO.tk,hk=S.hk||PRO.hk;
  const cr=P.cr+P.kn*9*k*lk,hip=[ox+P.x*k,oy-20*k*lk+cr-P.lift*k];
  const sc=add(hip,rot([0,-14*k*tk],-P.lean)),neck=add(sc,rot([0,-2*k],-P.lean)),head=add(neck,rot([0,-5*k*hk],-P.lean-P.hd));
  const shF=add(sc,rot([-3.5*k,-.5*k],-P.lean)),shB=add(sc,rot([4*k,-.5*k],-P.lean));
  const elF=add(shF,dir(P.ua,7*k)),hdF=add(elF,dir(P.fa,6.5*k)),elB=add(shB,dir(P.ua2,7*k)),hdB=add(elB,dir(P.fa2,6.5*k));
  let footF=[hip[0]+P.ff*k,oy-P.lift*k],footB=[hip[0]+P.fb*k,oy-P.lift*k],kneeF,kneeB;
  const hpF=add(hip,[-2*k,0]),hpB=add(hip,[2*k,0]);
  if(P.kn>0){const kb0=ik(hpB,footB,10*k*lk,10*k*lk,1);kneeB=[lerp(kb0[0],hip[0]+3*k,P.kn),lerp(kb0[1],oy-1.5*k,P.kn)];footB=[lerp(footB[0],kneeB[0]+9*k,P.kn),oy];kneeF=ik(hpF,footF,10*k*lk,10*k*lk,1)}
  else{kneeF=ik(hpF,footF,10*k*lk,10*k*lk,1);kneeB=ik(hpB,footB,10*k*lk,10*k*lk,1)}
  return{k,hip,sc,neck,head,shF,shB,elF,hdF,elB,hdB,footF,footB,kneeF,kneeB,hpF,hpB,lean:P.lean}}
 function drawLeg(B,S,Hp,K,F,front){const k=S.k,p=S.pal,d=front?0:1;
  const U=p.under,UH=p.underHi,UL=p.underLo;B.thick(Hp,K,2.2*k,d?UL:U,d?U:UH,UL);B.thick(K,F,1.8*k,d?UL:U,d?U:UH,UL);
  const sh=[lerp(K[0],F[0],.15),lerp(K[1],F[1],.15)],sf=[lerp(K[0],F[0],.8),lerp(K[1],F[1],.8)];B.thick(sh,sf,2*k,d?p.armLo:p.arm,d?p.arm:p.armHi,p.armLo);
  B.disc(K[0],K[1],1.9*k,d?p.arm:p.armHi,p.armHi,p.armLo);
  B.poly([[F[0]-5*k,F[1]],[F[0]+2.5*k,F[1]],[F[0]+2.5*k,F[1]-3.5*k],[F[0]-1.5*k,F[1]-4*k]],p.foot,p.footHi,p.trimLo)}
 function drawTorso(B,S,J){const k=S.k,p=S.pal,L=-J.lean,h=J.hip,R=v=>add(h,rot([v[0],v[1]*(v[1]<0?(S.tk||PRO.tk):1)],L));
  B.poly([R([-5*k,-2*k]),R([5*k,-2*k]),R([6*k,4*k]),R([1*k,5*k]),R([-1*k,5*k]),R([-6*k,4*k])],p.armLo,p.arm,p.armLo);
  B.poly([R([-4*k,0]),R([4*k,0]),R([4.5*k,-6*k]),R([-4.5*k,-6*k])],p.under,p.underHi,p.underLo);
  B.poly([R([-3*k,-5*k]),R([3*k,-5*k]),R([7*k,-11*k]),R([6*k,-15*k]),R([-6*k,-15*k]),R([-7*k,-11*k])],p.arm,p.armHi,p.armLo);
  B.poly([R([-2.5*k,-6*k]),R([2.5*k,-6*k]),R([5.5*k,-12*k]),R([-5.5*k,-12*k])],p.chest,p.armHi,p.armLo);
  B.poly([R([-4.5*k,-1*k]),R([4.5*k,-1*k]),R([4.5*k,-2.6*k]),R([-4.5*k,-2.6*k])],p.trim,p.trimHi,p.trimLo)}
 /* 前垂れ：紺に金のふち、「閉じた門」の紋章。門番が誰の家来かを示す */
 function drawTabard(B,S,J){const k=S.k,L=-J.lean,h=J.hip,R=v=>add(h,rot([v[0],v[1]*(v[1]<0?(S.tk||PRO.tk):1)],L)),t=S.tabard,tw=t.w;
  B.poly([R([-tw*k,-12*k]),R([tw*k,-12*k]),R([(tw-.5)*k,t.len*k]),R([0,(t.len+1.5)*k]),R([-(tw-.5)*k,t.len*k])],t.col,t.hi,t.lo);
  for(let y=-12;y<=t.len;y+=.5){B.set(...R([-(tw-.2-(y+12)/(t.len+12)*.5)*k,y*k]),t.edge,2);B.set(...R([(tw-.2-(y+12)/(t.len+12)*.5)*k,y*k]),t.edge,2)}
  for(let x=-(tw-.5);x<=tw-.5;x+=.5)B.set(...R([x*k,(t.len+1.5-Math.abs(x)/(tw-.5)*1.5)*k]),t.edge,2);
  const M=v=>R([v[0],v[1]-7*k]),q=k*1.2;B.poly([M([-2*q,1*q]),M([2*q,1*q]),M([2*q,6*q]),M([-2*q,6*q])],t.mark,null,null);B.line(...M([0,1.5*q]),...M([0,6*q]),'#140a10')}
 /* 筒形の兜：ぬしの兜をまねた形（主従の印）。目の切れ込みと、上から下まで貫く縦の線 */
 function drawHead(B,S,J,P){const k=S.k*(S.hk||PRO.hk),p=S.pal,a=-J.lean-P.hd,R=v=>add(J.head,rot(v,a)),hm=S.helm;
  B.poly([R([-4.3*k,4.2*k]),R([4.3*k,4.2*k]),R([4.3*k,-4.2*k]),R([3.6*k,-4.8*k]),R([-3.6*k,-4.8*k]),R([-4.3*k,-4.2*k])],p.arm,p.armHi,p.armLo);
  for(let x=-4;x<=4;x+=.5)B.set(...R([x*k,-3.4*k]),hm.band[0],2);for(let x=-3.5;x<=3.5;x+=1.4)B.set(...R([x*k,-3.4*k]),hm.band[1],2);
  for(let x=-4.2;x<=1.2;x+=.5)B.set(...R([x*k,-.4*k]),OUT,2);for(let y=-2;y<=2.6;y+=.5)B.set(...R([-1.6*k,y*k]),OUT,2);
  for(let i=0;i<3;i++)for(let j=0;j<2;j++)B.set(...R([(1.2+j*1.2)*k,(1.6+i*.9)*k]),OUT,2);
  for(const d of hm.dents)for(let i=0;i<3;i++)B.set(...R([(d[0]+i*.4)*k,(d[1]+(i===1?.4:0))*k]),p.armLo,2)}
 function drawArm(B,S,sh,el,hd,front){const k=S.k,p=S.pal;B.thick(sh,el,1.7*k,front?p.under:p.underLo,front?p.underHi:p.under,p.underLo);B.thick([lerp(el[0],hd[0],.1),lerp(el[1],hd[1],.1)],[lerp(el[0],hd[0],.75),lerp(el[1],hd[1],.75)],1.9*k,front?p.arm:p.armLo,front?p.armHi:p.arm,p.armLo);B.disc(hd[0],hd[1],1.9*k,p.glove,p.arm,OUT);B.poly([[sh[0]-4*k,sh[1]+2*k],[sh[0]-3.5*k,sh[1]-2.5*k],[sh[0],sh[1]-3.5*k],[sh[0]+3.5*k,sh[1]-2.5*k],[sh[0]+4*k,sh[1]+2*k],[sh[0],sh[1]+3*k]],front?p.arm:p.armLo,front?p.armHi:p.arm,p.armLo)}
 /* 刃は必ず黒で縁どる：パリィのゲームでは刃の位置がいちばん大事な情報 */
 function drawBlade(B,S,hd,ang,Wp){const k=S.k,len=Wp.len*k,wd=Wp.w*k,u=dir(ang,1),n=[-u[1],u[0]],Q=(a,b)=>[hd[0]+u[0]*a+n[0]*b,hd[1]+u[1]*a+n[1]*b];
  B.thick(Q(-3*k,0),Q(-1*k,0),1.1*k,Wp.grip,Wp.grip,OUT);B.disc(...Q(-3.6*k,0),1.3*k,Wp.guard,Wp.guard,OUT);
  B.poly([Q(0,-wd-1),Q(len*.9,-wd*.8-1),Q(len+1.5,0),Q(len*.9,wd*.8+1),Q(0,wd+1)],OUT,null,null,1);B.poly([Q(1*k,-wd),Q(len*.9,-wd*.8),Q(len,0),Q(len*.9,wd*.8),Q(1*k,wd)],Wp.col,Wp.hi,Wp.lo);
  B.thick(Q(.5*k,-Wp.gw*k),Q(.5*k,Wp.gw*k),.9*k,Wp.guard,Wp.guardHi,OUT);return Q(len,0)}
 /* かせ：手首の鉄の輪と、短く垂れる鎖（門に仕える誓い） */
 function cuff(B,h,k){B.disc(h[0]+.5*k,h[1]-1.2*k,1.6*k,'#5a5e6c','#9aa0b4','#1a1820',1)}
 function dangle(B,h,k,T,ph){for(let i=1;i<=3;i++){const x=h[0]+1*k+Math.sin(T*.08+i*.7+ph)*.6*i*.4,y=h[1]-.5*k+i*1.7*k;B.set(x,y,i%2?'#5a5e6c':'#9aa0b4',1);if(i%2)B.set(x+1,y,'#5a5e6c',1)}}
 const W_SHORT={len:17,w:1.3,col:'#c8ccd8',hi:'#ffffff',lo:'#6a7088',guard:'#8a6a3a',guardHi:'#c8a050',grip:'#4a3420',gw:2.5};
 const GATE={k:1,hk:1.3,lk:.8,
  pal:{arm:'#6a7488',armHi:'#9aa4b8',armLo:'#3a4054',trim:'#8a6a3a',trimHi:'#c8a050',trimLo:'#4a3420',chest:'#707a90',glove:'#3a2a24',under:'#2e3040',underHi:'#464a5c',underLo:'#181a24',foot:'#3a4054',footHi:'#6a7488'},
  helm:{band:['#8a6a3a','#c8a050'],dents:[[-3,-2],[2,1]]},
  tabard:{len:12,w:4.3,col:'#2e4288',hi:'#4a62b8',lo:'#1a2658',edge:'#c8a050',mark:'#e0b860'}};
 /* 描く順：後ろの腕→後ろの剣→後ろの脚→胴→前の脚→前垂れ→兜→前の剣→前の腕→かせ */
 function knight(B,ox,oy,S,P,T){const J=joints(ox,oy,S,P);
  drawArm(B,S,J.shB,J.elB,J.hdB,false);
  drawLeg(B,S,J.hpB,J.kneeB,J.footB,false);
  drawTorso(B,S,J);drawLeg(B,S,J.hpF,J.kneeF,J.footF,true);drawTabard(B,S,J);
  drawHead(B,S,J,P);
  if(P.sw2!=null)J.tip2=drawBlade(B,S,J.hdB,P.sw2,W_SHORT);
  J.tip=drawBlade(B,S,J.hdF,P.sw,W_SHORT);
  drawArm(B,S,J.shF,J.elF,J.hdF,true);
  cuff(B,J.hdF,S.k);dangle(B,J.hdF,S.k,T,0);cuff(B,J.hdB,S.k);dangle(B,J.hdB,S.k,T,1);
  return J}

 /* ---- 姿勢（moves.js・parried.js・hurt.js の門番） ---- */
 const BASE=Object.assign({},PDEF,{ua:1.75,fa:-.5,sw:-2.25,ua2:1.4,fa2:-2.5,sw2:-.85,ff:-6,fb:6});/* 交差の構え */
 const KNEEL=Object.assign({},BASE,{kn:1,lean:.35,ua:1.5,fa:1.7,sw:1.45,ua2:1.7,fa2:1.4,sw2:1.2,hd:.3});
 /* 後ろの腕（moves.js の g_two と同じ値）：BL＝剣を下げる、BU＝二撃目の構え（腕を後ろから頭上へ、剣は肩の後ろ）、BM＝振りの途中（頭上の前）、BS＝二撃目の当たり */
 const BL={ua2:.8,fa2:.9,sw2:1.35},BU={ua2:-1.55,fa2:-.95,sw2:-.45},BM={ua2:3.13,fa2:-2.65,sw2:-2.12},BS={ua2:1.55,fa2:1.95,sw2:2.5};
 const W1=Object.assign({},BASE,{ua:-2.4,fa:-1.6,sw:-1.2,x:4,cr:2},BL);/* 一撃目の構え：前の剣を頭上へ */
 const S1=Object.assign({},BASE,{ua:2.8,fa:2.6,sw:2.2,lean:.3},BL);/* 一撃目の当たり */
 const W2=Object.assign({},S1,BU,{lean:.2});/* 二撃目の構え：前の剣は下げたまま、後ろの剣を頭上へ（兜に腕を重ねない） */
 const M2=Object.assign({},S1,BM,{lean:.28});/* 二撃目の振りの途中：頭上を越えて前へ（近い回り道だと体の後ろを回ってしまうので、ここを通す） */
 const S2=Object.assign({},BASE,{ua:2.6,fa:2.4,sw:2.0,lean:.35},BS);/* 二撃目の当たり */
 const BRK=t=>Object.assign({},BASE,{ua:1.45,fa:1.75,sw:2.5+Math.sin(t*.05)*.05,ua2:1.25,fa2:.9,sw2:.75+Math.sin(t*.05+1)*.05,lean:.2,hd:.45+Math.sin(t*.09+1)*.06,cr:3.5+Math.sin(t*.09)*.6,x:2});/* 交差がほどけて、待つ */
 const IDLE=t=>Object.assign({},BASE,{cr:.5-.5*Math.cos(t/80*TAU)});/* 息で腰がわずかに上下する（80F） */
 const ANG=['ua','fa','sw','ua2','fa2','sw2'];
 const ease={io:u=>u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2,out:u=>1-Math.pow(1-u,3),in:u=>u*u*u,s:u=>u*u*(3-2*u),back:u=>{const c=1.9,v=u-1;return 1+(c+1)*v*v*v+c*v*v}};
 const cl01=u=>u<0?0:u>1?1:u;
 /* 角度は近い回り道で補間する（半周をこえる差は、体の後ろを大回りしてしまう） */
 function nearTo(from,to){const o=Object.assign({},to);for(const k of ANG)if(o[k]!=null&&from[k]!=null){while(o[k]-from[k]>Math.PI)o[k]-=TAU;while(o[k]-from[k]<-Math.PI)o[k]+=TAU}return o}
 const WR=a=>{while(a>Math.PI)a-=TAU;while(a<-Math.PI)a+=TAU;return a};
 /* 後ろの腕は、ひじ（前腕−上腕）と手首（剣−前腕）の曲がりを補間する。角度をばらばらに補間すると、途中でひじや手首が逆に折れることがある */
 function mixP(A,Bp,u){if(u<=0)return Object.assign({},A);const T=nearTo(A,Bp),o=Object.assign({},A);for(const k in T){if(typeof T[k]!=='number')continue;const a=A[k]==null?(PDEF[k]||0):A[k];o[k]=a+(T[k]-a)*u}
  if([A.ua2,A.fa2,A.sw2,T.ua2,T.fa2,T.sw2].every(v=>typeof v==='number')){const e0=WR(A.fa2-A.ua2),e1=WR(T.fa2-T.ua2),w0=WR(A.sw2-A.fa2),w1=WR(T.sw2-T.fa2);o.fa2=o.ua2+e0+(e1-e0)*u;o.sw2=o.fa2+w0+(w1-w0)*u}
  return o}

 /* 攻撃：構えて止まり、当たりの4F前から振る（番人系統の決まり）。当たったポーズで3F止まってから、次の構えか待機へ */
 const SWING=4,HOLD=3,RET=22,WIND=14;
 const isMain=s=>!s.fake&&!s.cx&&!s.ping;
 function afterHit(s,d,t){const SW=s.mv==='cut2'?S2:S1;return d<HOLD?SW:mixP(SW,IDLE(t),ease.io(cl01((d-HOLD)/RET)))}
 function attackPose(t){const ss=G.strikes.filter(isMain);let i=-1;for(let j=0;j<ss.length;j++)if(G.et>=ss[j].start)i=j;
  if(i<0)return IDLE(t);
  const s=ss[i],d=G.et-s.impact;if(d>=0)return afterHit(s,d,t);
  const prev=ss[i-1],from=prev?afterHit(prev,s.start-prev.impact,t):IDLE(t),WU=s.mv==='cut2'?W2:W1,SW=s.mv==='cut2'?S2:S1;
  if(G.et<s.impact-SWING){const span=Math.max(1,Math.min(WIND,s.cue-s.start));return mixP(from,WU,ease.out(cl01((G.et-s.start)/span)))}
  const u=ease.in(cl01((G.et-(s.impact-SWING))/SWING));if(s.mv==='cut2')return u<.5?mixP(WU,M2,u*2):mixP(M2,SW,(u-.5)*2);
  return mixP(WU,SW,u)}

 /* パリィされ（knightKit）：小＝連撃の途中、前の剣だけがはね上がる／大＝最後の一撃、二本の剣がこじ開けられて体ごとのけぞる */
 const STOP=12;
 function pryTarget(kind,which){const P=which===2?S2:S1;
  if(kind==='s'){const T={ua:P.ua+.55,fa:P.fa+1.2,sw:P.sw+1.9};return Object.assign(T,{x:(P.x||0)+3,lean:(P.lean||0)-.2,hd:-.15})}
  const T={ua2:4.9,fa2:5.4,sw2:5.8,ua:5.0,fa:5.5,sw:5.9};if(which!==2)Object.assign(T,{ua:4.9,fa:5.4,sw:5.8,ua2:.6,fa2:.3,sw2:.1});
  return Object.assign(T,{x:(P.x||0)+11,lean:-.4,hd:-.35,cr:1.5})}
 function pryW(r,d){if(d<0)return 0;if(d<STOP)return Math.min(1,(d+1)/4);const e=d-STOP;if(r.kind==='s')return 1-ease.s(cl01(e/6));return e<10?1:1-ease.s(cl01((e-10)/18))}
 /* やられ（g_hurt）：体ごと押されるが、交差はほどかない。二太刀目で腰が落ちる */
 const kb=(a,dur)=>a<0?0:a<4?Math.sin(a/4*Math.PI/2):Math.exp(-(a-4)/dur);

 function st(e){return e._rig||(e._rig={key:'',from:null,at:0,dur:1,ez:'io',prev:null,rx:[],seen:new WeakSet(),hurt:[],lastHurt:0,memo:-1,P:null,J:null,img:{}})}
 /* 1フレームに1回だけ姿勢を進める（同じフレームで何度呼ばれても同じ結果） */
 function pose(e){const R=st(e),t=G.anim;if(R.memo===t&&R.P)return R.P;R.memo=t;
  let key,T;
  if(G.ko){key='ko';const k=G.t-6;T=k<10?(R.prev||IDLE(t)):mixP(R.koFrom||(R.koFrom=Object.assign({},R.prev||BASE)),KNEEL,ease.out(cl01((k-10)/24)))}
  else if(e.broken){key='brk';T=BRK(t)}
  else if(G.state==='enemy'&&G.strikes&&G.strikes.some(isMain)){key='atk';T=attackPose(t)}
  else{key='idle';T=IDLE(t)}
  if(key!=='ko')R.koFrom=null;
  if(key!==R.key){const old=R.key;R.key=key;R.from=R.prev;R.at=t;
   if(key==='brk'){R.dur=16;R.ez='s'}else if(old==='brk'){R.dur=5;R.ez='back'}else if(key==='idle'){R.dur=20;R.ez='io'}else{R.dur=6;R.ez='io'}}
  let P=T;if(R.from&&t-R.at<R.dur&&key!=='ko'){const u=ease[R.ez](cl01((t-R.at)/R.dur));P=mixP(R.from,T,u)}
  /* パリィされた撃を拾う（最後の撃なら大） */
  if(G.state==='enemy'&&G.strikes){const ss=G.strikes.filter(isMain),last=ss[ss.length-1];for(const s of ss){if(s.done&&s.res==='parry'&&!R.seen.has(s)){R.seen.add(s);const which=s.mv==='cut2'?2:1,kind=s===last?'b':'s';R.rx.push({at:t-Math.max(0,G.et-s.impact),kind,which,T:pryTarget(kind,which)})}}}
  R.rx=R.rx.filter(r=>t-r.at<STOP+60);
  for(const r of R.rx){const w=pryW(r,t-r.at);if(w>0)P=mixP(P,r.T,w)}
  /* 斬られた瞬間を拾う（30F以内の二太刀目は大きく） */
  if(e.hurt>0&&!R.lastHurt){const two=R.hurt.length&&t-R.hurt[R.hurt.length-1].at<30;R.hurt.push({at:t,two})}R.lastHurt=e.hurt;
  R.hurt=R.hurt.filter(h=>t-h.at<60);
  for(const h of R.hurt){const a=kb(t-h.at,h.two?9:6),o=h.two?{x:7,lean:-.3,hd:-.3,cr:2}:{x:4,lean:-.22,hd:-.25};P=Object.assign({},P);for(const k in o)P[k]=(P[k]||0)+o[k]*a}
  R.prev=P;R.P=P;return P}

 /* 交差に戻るときの「キン」：両手の間に小さな十字 */
 function kin(B,J,e){const c=[(J.hdF[0]+J.hdB[0])/2,(J.hdF[1]+J.hdB[1])/2-9];for(let i=-3+(e>>1);i<=3-(e>>1);i++){B.set(c[0]+i,c[1],'#c8ccd8',4);B.set(c[0],c[1]+i,'#c8ccd8',4)}}
 /* 骨組みを画素にし、ゲームの色の決まり（nCol：白い光・覚悟の色・ブレイクの色あせ）を通して、キャンバスにする */
 function render(e,v){const R=st(e),P=pose(e),t=G.anim,k=t+'|'+v+'|'+(e.tint||'');if(R.img.k===k)return R.img.c;
  const B=new Buf(W,H),J=knight(B,OX,H,GATE,P,t);R.J=J;
  for(const r of R.rx){if(r.kind!=='b')continue;const d=t-r.at-(STOP+38);if(d>=0&&d<8)kin(B,J,d)}
  B.outline();
  const cv=document.createElement('canvas');cv.width=W;cv.height=H;const cx=cv.getContext('2d'),im=cx.createImageData(W,H),memo={};
  for(let i=0;i<B.c.length;i++){const c0=B.c[i];if(!c0)continue;const c=memo[c0]||(memo[c0]=B.t[i]===4?c0:nCol(c0,v,e.tint)),n=parseInt(c.slice(1),16);im.data[i*4]=n>>16&255;im.data[i*4+1]=n>>8&255;im.data[i*4+2]=n&255;im.data[i*4+3]=255}
  cx.putImageData(im,0,0);R.img={k,c:cv};return cv}
 /* 画面の座標：絵は足元のまん中を (x, y) に合わせて置かれる（drawEnemy と同じ） */
 const scr=(p,x,y)=>({x:Math.round(x-(W>>1)+p[0]),y:Math.round(y-H+p[1])});
 function tip(e,x,y){const R=st(e);if(!R.J)render(e,'n');const J=R.J,s=G.state==='enemy'&&G.strikes&&G.strikes.find(s=>!s.done&&isMain(s));const p=s&&s.mv==='cut2'&&J.tip2?J.tip2:J.tip;return scr(p,x,y)}
 /* ブレイクの印：主人公の色（うすい青）の小さな星を3つ、頭の上で回す（光らせない。金は打ち合いの合図の色なので使わない） */
 function brkStars(e,x,y){const R=st(e);if(!R.J)return;const c=scr(R.J.head,x,y),HSL=['#dff2ff','#8ab8e0','#5a7ca8'];
  for(let i=0;i<3;i++){const a=G.anim*.09+i*TAU/3,sx=Math.round(c.x+Math.cos(a)*6),sy=Math.round(c.y-11+Math.sin(a)*1.8),back=Math.sin(a)<0;
   px(sx,sy,back?HSL[1]:HSL[0]);const cc=back?HSL[2]:HSL[1];px(sx+1,sy,cc);px(sx-1,sy,cc);px(sx,sy+1,cc);px(sx,sy-1,cc)}}
 return{on:e=>typeof NEWDRAW!=='undefined'&&NEWDRAW&&!!e&&e.key==='samuraiB',img:render,tip,brkStars}})();
