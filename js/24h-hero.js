/* ===== 資料集の骨組みで描く主人公（URL に ?new をつけたときだけ） =====
   見本は design/v2（engine.js の Buf、rig.js の knight、specs.js の SPEC.hero・heroShield、hurt.js の HUP・HDN・HDN2・HUPS・HREST、heromv.js の HATK・HP_）。
   主人公に要る部品だけを移し、名前はすべて HERO の中に閉じこめる（ゲームの knight・OUT などとぶつけない）。
   手触りは変えない：こうげきの体の動きは、ゲームの時刻（G.act の C＝剣先が光る、I＝当たる）と【こうげきの斬り下ろしフレーム】から決め、
   踏みこみの距離はゲームの lungeK・lungeD のまま（姿勢の x は使わない）。
   いま資料集のとおりに動くのは、構え・待機・こうげき3種（T004）。まもる・かいふく・出現・やられ・撃破（T082）とまほう（T083）は仮の構え。 */
const HERO=(()=>{
 const OUT='#120910',W=64,H=60,OX=30,OY=H-3,TAU=Math.PI*2;
 /* ---- 画素の入れ物（engine.js の Buf） ---- */
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
  thick(a,b,r,base,hi,lo,tag){const n=Math.max(2,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])));const m=new Set();for(let i=0;i<=n;i++){const t=i/n,cx=a[0]+(b[0]-a[0])*t,cy=a[1]+(b[1]-a[1])*t;for(let y=Math.floor(cy-r);y<=Math.ceil(cy+r);y++)for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++){const dx=x+.5-cx,dy=y+.5-cy;if(dx*dx+dy*dy<=r*r)m.add((y+1024)*4096+x+1024)}}this.shade(m,base,hi,lo,tag)}
  outline(){const a=[];for(let y=0;y<this.h;y++)for(let x=0;x<this.w;x++){if(this.t[y*this.w+x])continue;if(this.tag(x-1,y)===1||this.tag(x+1,y)===1||this.tag(x,y-1)===1||this.tag(x,y+1)===1)a.push(x,y)}for(let i=0;i<a.length;i+=2)this.set(a[i],a[i+1],OUT,3)}
 }
 const rot=(p,a)=>[p[0]*Math.cos(a)-p[1]*Math.sin(a),p[0]*Math.sin(a)+p[1]*Math.cos(a)],add=(a,b)=>[a[0]+b[0],a[1]+b[1]],dir=(a,L)=>[Math.cos(a)*L,Math.sin(a)*L],lerp=(a,b,t)=>a+(b-a)*t;
 function ik(Hp,F,a,b,bend){const dx=F[0]-Hp[0],dy=F[1]-Hp[1];let d=Math.hypot(dx,dy);d=Math.min(d,a+b-.01);const A=Math.atan2(dy,dx),c=Math.acos(Math.max(-1,Math.min(1,(a*a+d*d-b*b)/(2*a*d))));return add(Hp,dir(A+bend*c,a))}
 const ez={io:t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,out:t=>1-Math.pow(1-t,3),in:t=>t*t*t};

 /* ---- 騎士の骨組み（rig.js）：角度は描く向き。0＝右、π＝左。左を向いて描き、最後に左右を返して右向きにする ---- */
 const PDEF={x:0,lean:0,cr:0,ff:-6,fb:5,kn:0,ua:1.95,fa:2.75,sw:3.4,ua2:1.75,fa2:1.9,hd:0,lift:0};
 const PRO={lk:.74,tk:.86};
 /* 主人公の形と色（specs.js の PAL.hero・SPEC.hero・W_HERO） */
 const S={k:.72,hk:1.45,
  pal:{arm:'#b8bcc8',armHi:'#e8eaf0',armLo:'#686c7e',trim:'#8a8ea0',trimHi:'#c8ccd8',trimLo:'#4a4e5e',chest:'#c4c8d4',glove:'#5a4a40',eye:'#ffffff',under:'#4a4850',underHi:'#6a6870',underLo:'#2a2830',foot:'#686c7e',footHi:'#a0a4b4'},
  helm:{plume:'#a83a3e',plumeHi:'#d06060',plumeLo:'#6a2028'},
  cape:{len:20,wide:1.5,col:'#8a2a30',hi:'#b84448',lo:'#4a1420'},
  w:{len:28,w:1.25,col:'#c0c6d6',hi:'#c0c6d6',lo:'#7c84a0',guard:'#e8d8a0',guardHi:'#ffffff',grip:'#3a2a24',gw:2},/* 剣28、刃は手元の銀を土台に一色（先だけ白くならない） */
  pose:{ua:1.95,fa:2.85,sw:-2.6,ua2:1.75,fa2:1.95,ff:-5,fb:5}};/* 肘を曲げて前腕を前へ。剣は手首から立てる */
 function joints(ox,oy,Q){const k=S.k,lk=PRO.lk,tk=PRO.tk,hk=S.hk;
  const cr=Q.cr+Q.kn*9*k*lk,hip=[ox+Q.x*k,oy-20*k*lk+cr-Q.lift*k];
  const sc=add(hip,rot([0,-14*k*tk],-Q.lean)),neck=add(sc,rot([0,-2*k],-Q.lean)),head=add(neck,rot([0,-5*k*hk],-Q.lean-Q.hd));
  const shF=add(sc,rot([-3.5*k,-.5*k],-Q.lean)),shB=add(sc,rot([4*k,-.5*k],-Q.lean));
  const elF=add(shF,dir(Q.ua,7*k)),hdF=add(elF,dir(Q.fa,6.5*k)),elB=add(shB,dir(Q.ua2,7*k)),hdB=add(elB,dir(Q.fa2,6.5*k));
  let footF=[hip[0]+Q.ff*k,oy-Q.lift*k],footB=[hip[0]+Q.fb*k,oy-Q.lift*k],kneeF,kneeB;
  const hpF=add(hip,[-2*k,0]),hpB=add(hip,[2*k,0]);
  if(Q.kn>0){const kb=ik(hpB,footB,10*k*lk,10*k*lk,1);kneeB=[lerp(kb[0],hip[0]+3*k,Q.kn),lerp(kb[1],oy-1.5*k,Q.kn)];footB=[lerp(footB[0],kneeB[0]+9*k,Q.kn),oy];kneeF=ik(hpF,footF,10*k*lk,10*k*lk,1)}
  else{kneeF=ik(hpF,footF,10*k*lk,10*k*lk,1);kneeB=ik(hpB,footB,10*k*lk,10*k*lk,1)}
  return{k,hip,sc,neck,head,shF,shB,elF,hdF,elB,hdB,footF,footB,kneeF,kneeB,hpF,hpB,lean:Q.lean}}
 function drawLeg(B,Hp,K,F,front){const k=S.k,p=S.pal,d=front?0:1;
  B.thick(Hp,K,2.2*k,d?p.underLo:p.under,d?p.under:p.underHi,p.underLo);B.thick(K,F,1.8*k,d?p.underLo:p.under,d?p.under:p.underHi,p.underLo);
  const sh=[lerp(K[0],F[0],.15),lerp(K[1],F[1],.15)],sf=[lerp(K[0],F[0],.8),lerp(K[1],F[1],.8)];B.thick(sh,sf,2*k,d?p.armLo:p.arm,d?p.arm:p.armHi,p.armLo);
  B.disc(K[0],K[1],1.9*k,d?p.arm:p.armHi,p.armHi,p.armLo);
  B.poly([[F[0]-5*k,F[1]],[F[0]+2.5*k,F[1]],[F[0]+2.5*k,F[1]-3.5*k],[F[0]-1.5*k,F[1]-4*k]],p.foot,p.footHi,p.trimLo)}
 function drawTorso(B,J){const k=S.k,p=S.pal,L=-J.lean,h=J.hip,R=v=>add(h,rot([v[0],v[1]*(v[1]<0?PRO.tk:1)],L));
  B.poly([R([-5*k,-2*k]),R([5*k,-2*k]),R([6*k,4*k]),R([1*k,5*k]),R([-1*k,5*k]),R([-6*k,4*k])],p.armLo,p.arm,p.armLo);
  B.poly([R([-4*k,0]),R([4*k,0]),R([4.5*k,-6*k]),R([-4.5*k,-6*k])],p.under,p.underHi,p.underLo);
  B.poly([R([-3*k,-5*k]),R([3*k,-5*k]),R([7*k,-11*k]),R([6*k,-15*k]),R([-6*k,-15*k]),R([-7*k,-11*k])],p.arm,p.armHi,p.armLo);
  B.poly([R([-2.5*k,-6*k]),R([2.5*k,-6*k]),R([5.5*k,-12*k]),R([-5.5*k,-12*k])],p.chest,p.armHi,p.armLo);
  B.poly([R([-4.5*k,-1*k]),R([4.5*k,-1*k]),R([4.5*k,-2.6*k]),R([-4.5*k,-2.6*k])],p.trim,p.trimHi,p.trimLo)}
 /* 丸い兜：顔は見せない。羽根飾りは前へ進む者の印 */
 function drawHead(B,J,Q,T){const k=S.k*S.hk,p=S.pal,hm=S.helm,a=-J.lean-Q.hd,R=v=>add(J.head,rot(v,a));
  const w=Math.sin(T*.08)*1;for(let i=0;i<5;i++){const t=i/4;B.disc(...R([(1+t*7)*k,(-5.5+t*t*4+w*t)*k]),(1.6-t*.6)*k,hm.plume,hm.plumeHi,hm.plumeLo)}
  B.poly([R([-3.2*k,3.8*k]),R([3.6*k,3.8*k]),R([4.2*k,-1*k]),R([3*k,-4*k]),R([0,-5.4*k]),R([-3*k,-4*k]),R([-4.2*k,-1*k])],p.arm,p.armHi,p.armLo);
  for(let x=-4;x<=.6;x+=.5)B.set(...R([x*k,-.3*k]),OUT,2);for(let x=-3.6;x<=.4;x+=.5)B.set(...R([x*k,.2*k]),p.armLo,2);
  for(let y=-5;y<=-1;y+=.5)B.set(...R([-1.4*k,y*k]),p.armHi,2);for(let i=0;i<3;i++)B.set(...R([(-2.6+i*1)*k,2*k]),OUT,2)}
 function drawArm(B,sh,el,hd,front){const k=S.k,p=S.pal;B.thick(sh,el,1.7*k,front?p.under:p.underLo,front?p.underHi:p.under,p.underLo);B.thick([lerp(el[0],hd[0],.1),lerp(el[1],hd[1],.1)],[lerp(el[0],hd[0],.75),lerp(el[1],hd[1],.75)],1.9*k,front?p.arm:p.armLo,front?p.armHi:p.arm,p.armLo);B.disc(hd[0],hd[1],1.9*k,p.glove,p.arm,OUT);B.poly([[sh[0]-4*k,sh[1]+2*k],[sh[0]-3.5*k,sh[1]-2.5*k],[sh[0],sh[1]-3.5*k],[sh[0]+3.5*k,sh[1]-2.5*k],[sh[0]+4*k,sh[1]+2*k],[sh[0],sh[1]+3*k]],front?p.arm:p.armLo,front?p.armHi:p.arm,p.armLo)}
 /* 刃は必ず黒で縁どる：パリィのゲームでは刃の位置が一番大事な情報 */
 function drawBlade(B,hd,ang){const W2=S.w,k=S.k,len=W2.len*k,wd=W2.w*k,u=dir(ang,1),n=[-u[1],u[0]],Pp=(a,b)=>[hd[0]+u[0]*a+n[0]*b,hd[1]+u[1]*a+n[1]*b];
  B.thick(Pp(-3*k,0),Pp(-1*k,0),1.1*k,W2.grip,W2.grip,OUT);B.disc(...Pp(-3.6*k,0),1.3*k,W2.guard,W2.guard,OUT);
  B.poly([Pp(0,-wd-1),Pp(len*.9,-wd*.8-1),Pp(len+1.5,0),Pp(len*.9,wd*.8+1),Pp(0,wd+1)],OUT,null,null,1);B.poly([Pp(1*k,-wd),Pp(len*.9,-wd*.8),Pp(len,0),Pp(len*.9,wd*.8),Pp(1*k,wd)],W2.col,W2.hi,W2.lo);
  B.thick(Pp(.5*k,-W2.gw*k),Pp(.5*k,W2.gw*k),.9*k,W2.guard,W2.guardHi,OUT);return Pp(len,0)}
 function drawCape(B,J,T){const c=S.cape,k=S.k,w=Math.sin(T*.07)*1.6,L=c.len*k*PRO.lk,h=J.hip,cw=c.wide;
  const a=add(J.shB,[3.5*k*cw,1*k]),b=[h[0]+(11*cw+w)*k,h[1]+L*.5],d=[h[0]+(9*cw+w*1.3)*k,h[1]+L],e=[h[0]+2*k,h[1]+L*.92];
  B.poly([J.neck,J.shB,a,b,d,e,add(h,[2*k,-2*k])],c.col,c.hi,c.lo)}
 /* はじまりの盾：鉄のふちと木の面、中央の鉄の突起だけ（差分はクリアチェッカーのごほうびを入れるときに足す） */
 function drawShield(B,J,front){const k=J.k*1.55,c=add(J.hdB,[front?-.5*k:2.6*k,front?1.5*k:-.5*k]);
  const P0=[[c[0]-4*k,c[1]-5*k],[c[0]-1.5*k,c[1]-5.6*k],[c[0]+1.5*k,c[1]-5.6*k],[c[0]+4*k,c[1]-5*k],[c[0]+3.8*k,c[1]+.5*k],[c[0]+2*k,c[1]+4*k],[c[0],c[1]+5.6*k],[c[0]-2*k,c[1]+4*k],[c[0]-3.8*k,c[1]+.5*k]];
  B.poly(P0,'#b8bcc8','#e8eaf0','#565a6c');B.poly(P0.map(p=>[c[0]+(p[0]-c[0])*.8,c[1]+(p[1]-c[1])*.82]),'#76563c','#9a7250','#36281e');B.disc(c[0],c[1]-.5*k,1.3*k,'#b8bcc8','#ffffff','#565a6c')}
 function knight(B,ox,oy,Q,T){const J=joints(ox,oy,Q);
  drawCape(B,J,T);drawArm(B,J.shB,J.elB,J.hdB,false);drawLeg(B,J.hpB,J.kneeB,J.footB,false);
  drawTorso(B,J);drawLeg(B,J.hpF,J.kneeF,J.footF,true);drawHead(B,J,Q,T);
  drawShield(B,J,Q.shieldFront);J.tip=drawBlade(B,J.hdF,Q.sw);drawArm(B,J.shF,J.elF,J.hdF,true);return J}

 /* ---- 姿勢（hurt.js・heromv.js）。振りの向きが補間で逆回りしないよう、同じ角度を2πずらして書いてある ---- */
 const HUP={ua:-1.9,fa:-2.3,sw:-1.2,lean:-.1,cr:1,ff:-8,fb:6},HDN={ua:-3.5,fa:-3.75,sw:-3.25,lean:.3,ff:-10,fb:6},HDN2={ua:-3.7,fa:-3.95,sw:-3.45,lean:.35,ff:-10,fb:6,cr:1},HUPS={ua:-2.5,fa:-2.2,sw:-1.7,lean:.15,ff:-10,fb:6},HREST={ua:1.95-TAU,fa:2.85-TAU,sw:-2.6};
 /* 仮の構え（T082・T083 で資料集の動きに置きかえる）。x は使わない（位置はゲームが動かす） */
 const HP_={guard:{ua:1.25,fa:-.2,sw:-1.3,ua2:2.95,fa2:3.05,cr:2,lean:-.08},parry:{ua:2.9,fa:-2.6,sw:-2.2,lean:.15},parryFT:{ua:-2.75,fa:-2.2,sw:-1.75,lean:.22},
  parryH:{ua:2.7,fa:-2.4,sw:-2.0,cr:3,lean:.1,ff:-9,fb:8},parryHFT:{ua:-2.8,fa:-2.25,sw:-1.8,cr:2,lean:.15,ff:-9,fb:8},dodge:{lean:-.35,cr:3,ff:-3,fb:8,ua:1.6,fa:1.9,sw:2.6},
  hurt:{lean:-.3,hd:-.3,ua:1.2,fa:1.0,sw:2.4,cr:1},magic:{ua:2.2,fa:-1.9,sw:-1.57,cr:.5,hd:.15},kneel:{kn:1,lean:.35,ua:1.5,fa:1.7,sw:1.45,hd:.3},early:{ua:2.75,fa:-2.45,sw:-2.0,lean:-.12,cr:-.5}};
 const BASE=Object.assign({},PDEF,S.pose);
 const K=(t,p,e)=>({t,p,e});
 function keyAt(keys,t){let a=keys[0],b=keys[0];for(let i=0;i<keys.length;i++){if(keys[i].t<=t)a=keys[i];if(keys[i].t>=t){b=keys[i];break}if(i===keys.length-1)b=keys[i]}
  if(a===b||b.t===a.t)return Object.assign({},BASE,a.p);const u=ez[b.e||'io']((t-a.t)/(b.t-a.t)),o=Object.assign({},BASE);
  for(const k of new Set([...Object.keys(a.p),...Object.keys(b.p)])){const A=a.p[k]!==undefined?a.p[k]:BASE[k],Bv=b.p[k]!==undefined?b.p[k]:BASE[k];o[k]=typeof A==='number'&&typeof Bv==='number'?lerp(A,Bv,u):(u<.5?A:Bv)}return o}
 /* こうげき（heromv.js の HATK と heroAtkCard）。資料集は光る時刻 HGL＝20、当たり HHIT＝光って20F後。ゲームでは C と I に合わせる */
 function atkKeys(A){const C=A.C,I=A.I,SW=P.heroSwingF,D=A.d||0;
  const L=[K(0,{}),K(Math.max(D,C-10),{}),K(C,HUP,'out'),K(I-SW,HUP),K(I,HDN,'in'),K(I+4,HDN2)];
  if(A.chase==='ok')return L.concat([K(I+5,HDN2),K(I+8,HUPS,'in'),K(I+12,HUPS),K(I+22,HREST,'out')]);/* 追撃：斬り下ろしのあとに斬り上げる */
  if(A.chase==='crit')return L.concat([K(I+12,HDN2),K(I+16,HREST,'out')]);/* 重い一撃：振り切って粘る */
  return L.concat([K(I+8,HDN2)])}
 const ANG=['ua','fa','sw','ua2','fa2'];
 function nearTo(from,to){const o=Object.assign({},to);for(const k of ANG)if(typeof o[k]==='number'&&typeof from[k]==='number'){while(o[k]-from[k]>Math.PI)o[k]-=TAU;while(o[k]-from[k]<-Math.PI)o[k]+=TAU}return o}
 function mixP(A,B2,u){const T=nearTo(A,B2),o=Object.assign({},A);for(const k in T)if(typeof T[k]==='number'&&typeof A[k]==='number')o[k]=A[k]+(T[k]-A[k])*u;return o}
 const R0=()=>({key:'',from:null,at:0,prev:null,memo:-1,memoK:'',P:null,J:null,img:{},last:-1}),R=R0();
 /* G.anim は戦いごとに0に戻る。時計が戻ったら、前の戦いの姿勢・つなぎ・絵の覚えを捨てる（T107：t-R.at がマイナスになり、姿勢が引き伸ばされていた） */
 function clock(t){if(t<R.last)Object.assign(R,R0());R.last=t}
 function target(k){const A=G.act&&G.act.n===1?G.act:null,t=G.anim;
  if(A)return['atk',keyAt(atkKeys(A),A.t)];
  if(G.act&&G.act.n===2)return['magic',Object.assign({},BASE,HP_.magic)];
  const stop=G.stop>0;
  if(k==='guard')return['guard',Object.assign({},BASE,HP_.guard)];
  if(k==='parry')return[stop?'parry':'parryFT',Object.assign({},BASE,stop?HP_.parry:HP_.parryFT)];
  if(k==='parryH')return[stop?'parryH':'parryHFT',Object.assign({},BASE,stop?HP_.parryH:HP_.parryHFT)];
  if(k==='dodge')return['dodge',Object.assign({},BASE,HP_.dodge)];
  if(k==='early')return['early',Object.assign({},BASE,HP_.early)];
  if(k==='hit')return['hurt',Object.assign({},BASE,HP_.hurt)];
  if(k==='down')return['down',Object.assign({},BASE,HP_.kneel)];
  /* 待機：肘を曲げた構えで、ゆっくり息（hh_idle） */
  const P0=Object.assign({},BASE);P0.cr+=Math.max(0,Math.sin(t*.105))*.8;return['idle',P0]}
 /* 1フレームに1回だけ姿勢を進める。姿勢の種類が変わったら、前の姿勢から 6F でつなぐ */
 function pose(k){const t=G.anim;clock(t);const mk=t+'|'+k;if(R.memoK===mk&&R.P)return R.P;R.memoK=mk;
  const[key,T]=target(k);if(key!==R.key){R.key=key;R.from=R.prev;R.at=t}
  let P0=T;if(R.from&&key!=='atk'&&t-R.at<6)P0=mixP(R.from,T,ez.io(Math.min(1,Math.max(0,(t-R.at)/6))));
  R.prev=P0;R.P=P0;return P0}
 /* 姿勢から絵へ。やられ中は赤くする（仮。T082 で資料集の白と赤の光に） */
 const HURTC='#ff7b86';
 function mixHex2(a,b,t){const A=parseInt(a.slice(1),16),Bc=parseInt(b.slice(1),16),f=s=>Math.round(((A>>s)&255)*(1-t)+((Bc>>s)&255)*t);return'#'+((1<<24)+(f(16)<<16)+(f(8)<<8)+f(0)).toString(16).slice(1)}
 function render(P0,hit){const t=G.anim,k=JSON.stringify(P0)+'|'+(hit?1:0)+'|'+t;if(R.img.k===k)return R.img.c;
  const B=new Buf(W,H),J=knight(B,W-OX,OY,P0,t);R.J=J;B.outline();
  const cv=document.createElement('canvas');cv.width=W;cv.height=H;const cx=cv.getContext('2d'),im=cx.createImageData(W,H),memo={};
  for(let i=0;i<B.c.length;i++){const c0=B.c[i];if(!c0)continue;const c=memo[c0]||(memo[c0]=hit&&B.t[i]!==3?mixHex2(c0,HURTC,.45):c0),n=parseInt(c.slice(1),16),x=i%W,y=(i/W)|0,j=(y*W+(W-1-x))*4;
   im.data[j]=n>>16&255;im.data[j+1]=n>>8&255;im.data[j+2]=n&255;im.data[j+3]=255}
  cx.putImageData(im,0,0);R.img={k,c:cv};return cv}
 /* 画面の座標（左右を返したあと）：絵は足元のまん中を (x, FLOOR) に合わせて置く */
 const scr=(p,x,y)=>({x:Math.round(x-OX+(W-1-p[0])),y:Math.round(y-OY+p[1])});
 /* 剣の手元と剣先（跡を描くため、ある時刻の姿勢で） */
 function bladeAt(P0,x,y){const J=joints(W-OX,OY,P0),tp=add(J.hdF,dir(P0.sw,S.w.len*S.k));return[scr(J.hdF,x,y),scr(tp,x,y)]}
 const HSL=['#dff2ff','#8ab8e0','#5a7ca8'];
 /* 刃の跡：振った道すじを、刃の外側半分に、うすい青で */
 function trail(A,x,y,t0,t1){for(let s=t0;s<=t1;s+=.25){const[h,tp]=bladeAt(keyAt(atkKeys(A),s),x,y),u=(s-t0)/Math.max(1,t1-t0);for(let q=.45;q<=1.02;q+=.05)px(lerp(h.x,tp.x,q),lerp(h.y,tp.y,q),q>.85||u>.7?HSL[0]:HSL[1])}}
 function draw(x,y,k,hit){const P0=pose(k),img=render(P0,hit);l.drawImage(img,Math.round(x-OX),Math.round(y-OY));
  const A=G.act&&G.act.n===1?G.act:null;if(!A||!R.J)return;const tp=scr(R.J.tip,x,y),t=A.t,I=A.I,SW=P.heroSwingF;
  /* 剣先の光（押す合図）：振りかぶって止まった瞬間に、うすい青の小さな十字 */
  const d=t-A.C;if(d>=0&&d<6&&!A.chase){const r=3-(d>>1);for(let i=-r;i<=r;i++){px(tp.x+i,tp.y,HSL[0]);px(tp.x,tp.y+i,HSL[0])}}
  if(A.chase&&A.chase!=='miss'&&t<I&&(G.anim>>1)%2)pxStar(tp.x,tp.y,A.chase==='crit'?4:3,A.chase==='crit'?HSL[0]:HSL[1]);
  if(t>=I-SW&&t<I+3)trail(A,x,y,Math.max(I-SW,t-3),Math.min(t,I+1));
  if(A.chase==='ok'&&t>=I+5&&t<I+12)trail(A,x,y,Math.max(I+5,t-3),Math.min(t,I+9))}
 /* うそつきの影が主人公をまねる（shade.js の shadeMimic＝主人公の形、大きさ k、長い剣21）ときに、主人公の形だけを描いて返す。sword=false で剣なし */
 const W_MIM={len:21,w:1.1,col:'#d8dce8',hi:'#ffffff',lo:'#7a8098',guard:'#2a1a22',guardHi:'#6a4a50',grip:'#2a1a22',gw:2};
 function fig(w,h,ox,oy,Q,T,k,sword){const k0=S.k,w0=S.w;S.k=k;S.w=W_MIM;const B=new Buf(w,h),q=Object.assign({},PDEF,Q);let J;
  try{J=joints(ox,oy,q);drawCape(B,J,T);drawArm(B,J.shB,J.elB,J.hdB,false);drawLeg(B,J.hpB,J.kneeB,J.footB,false);drawTorso(B,J);drawLeg(B,J.hpF,J.kneeF,J.footF,true);drawHead(B,J,q,T);drawShield(B,J,q.shieldFront);
   if(sword&&q.sw!=null)J.tip=drawBlade(B,J.hdF,q.sw);drawArm(B,J.shF,J.elF,J.hdF,true)}finally{S.k=k0;S.w=w0}return{B,J}}
 return{on:()=>typeof NEWDRAW!=='undefined'&&NEWDRAW,draw,fig,pose}})();/* pose はテスト（tests/newdraw.mjs）が姿勢を見るため */
