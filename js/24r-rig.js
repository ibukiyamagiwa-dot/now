/* ===== 資料集の骨組みで描く。影の組（T094）と居合の組（T097）はいつも、門番はまだ URL に ?new をつけたときだけ =====
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
  get(x,y){x=Math.round(x);y=Math.round(y);if(x<0||y<0||x>=this.w||y>=this.h)return 0;return this.c[y*this.w+x]}
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
 function joints(ox,oy,S,posture){const k=S.k,lk=S.lk||PRO.lk,tk=S.tk||PRO.tk,hk=S.hk||PRO.hk;
  const cr=posture.cr+posture.kn*9*k*lk,hip=[ox+posture.x*k,oy-20*k*lk+cr-posture.lift*k];
  const sc=add(hip,rot([0,-14*k*tk],-posture.lean)),neck=add(sc,rot([0,-2*k],-posture.lean)),head=add(neck,rot([0,-5*k*hk],-posture.lean-posture.hd));
  const shF=add(sc,rot([-3.5*k,-.5*k],-posture.lean)),shB=add(sc,rot([4*k,-.5*k],-posture.lean));
  const elF=add(shF,dir(posture.ua,7*k)),hdF=add(elF,dir(posture.fa,6.5*k)),elB=add(shB,dir(posture.ua2,7*k)),hdB=add(elB,dir(posture.fa2,6.5*k));
  let footF=[hip[0]+posture.ff*k,oy-posture.lift*k],footB=[hip[0]+posture.fb*k,oy-posture.lift*k],kneeF,kneeB;
  const hpF=add(hip,[-2*k,0]),hpB=add(hip,[2*k,0]);
  if(posture.kn>0){const kb0=ik(hpB,footB,10*k*lk,10*k*lk,1);kneeB=[lerp(kb0[0],hip[0]+3*k,posture.kn),lerp(kb0[1],oy-1.5*k,posture.kn)];footB=[lerp(footB[0],kneeB[0]+9*k,posture.kn),oy];kneeF=ik(hpF,footF,10*k*lk,10*k*lk,1)}
  else{kneeF=ik(hpF,footF,10*k*lk,10*k*lk,1);kneeB=ik(hpB,footB,10*k*lk,10*k*lk,1)}
  return{k,hip,sc,neck,head,shF,shB,elF,hdF,elB,hdB,footF,footB,kneeF,kneeB,hpF,hpB,lean:posture.lean}}
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
 function drawHead(B,S,J,posture,T){const k=S.k*(S.hk||PRO.hk),p=S.pal,a=-J.lean-posture.hd,R=v=>add(J.head,rot(v,a)),hm=S.helm;
  /* 笠（居合）：兜はなく、笠と暗い顔だけ（iai.js の smHead） */
  if(hm.type==='kasa'){smHead(B,R,k,T,posture);return}
  /* 鍋形の兜（影の剣士。主人公の丸い兜と見分ける） */
  if(hm.type==='kettle'){B.poly([R([-4*k,-1*k]),R([4*k,-1*k]),R([4*k,4*k]),R([-4*k,4*k])],p.armLo,p.arm,p.armLo);B.poly([R([-7*k,-1*k]),R([7*k,-1*k]),R([6*k,-3*k]),R([-6*k,-3*k])],p.trim,p.trimHi,p.trimLo);B.disc(...R([0,-4*k]),4.3*k,p.arm,p.armHi,p.armLo);
   B.set(...R([-2.5*k,1.5*k]),p.eye,1);B.set(...R([-1.5*k,1.5*k]),p.eye,1);B.line(...R([-4*k,0]),...R([-4*k,3*k]),p.armLo);return}
  B.poly([R([-4.3*k,4.2*k]),R([4.3*k,4.2*k]),R([4.3*k,-4.2*k]),R([3.6*k,-4.8*k]),R([-3.6*k,-4.8*k]),R([-4.3*k,-4.2*k])],p.arm,p.armHi,p.armLo);
  for(let x=-4;x<=4;x+=.5)B.set(...R([x*k,-3.4*k]),hm.band[0],2);for(let x=-3.5;x<=3.5;x+=1.4)B.set(...R([x*k,-3.4*k]),hm.band[1],2);
  for(let x=-4.2;x<=1.2;x+=.5)B.set(...R([x*k,-.4*k]),OUT,2);for(let y=-2;y<=2.6;y+=.5)B.set(...R([-1.6*k,y*k]),OUT,2);
  for(let i=0;i<3;i++)for(let j=0;j<2;j++)B.set(...R([(1.2+j*1.2)*k,(1.6+i*.9)*k]),OUT,2);
  for(const d of hm.dents)for(let i=0;i<3;i++)B.set(...R([(d[0]+i*.4)*k,(d[1]+(i===1?.4:0))*k]),p.armLo,2)}
 function drawArm(B,S,sh,el,hd,front){const k=S.k,p=S.pal;B.thick(sh,el,1.7*k,front?p.under:p.underLo,front?p.underHi:p.under,p.underLo);B.thick([lerp(el[0],hd[0],.1),lerp(el[1],hd[1],.1)],[lerp(el[0],hd[0],.75),lerp(el[1],hd[1],.75)],1.9*k,front?p.arm:p.armLo,front?p.armHi:p.arm,p.armLo);B.disc(hd[0],hd[1],1.9*k,p.glove,p.arm,OUT);B.poly([[sh[0]-4*k,sh[1]+2*k],[sh[0]-3.5*k,sh[1]-2.5*k],[sh[0],sh[1]-3.5*k],[sh[0]+3.5*k,sh[1]-2.5*k],[sh[0]+4*k,sh[1]+2*k],[sh[0],sh[1]+3*k]],front?p.arm:p.armLo,front?p.armHi:p.arm,p.armLo)}
 /* マント（rig.js の drawCape）：背中から腰の後ろへ。tatter で裾を裂く */
 function drawCape(B,S,J,T){const c=S.cape;if(!c)return;const k=S.k,w=Math.sin(T*.07+(c.ph||0))*1.6,L=c.len*k*(S.lk||PRO.lk),h=J.hip;
  const cw=c.wide||1,a=add(J.shB,[3.5*k*cw,1*k]),b=[h[0]+(11*cw+w)*k,h[1]+L*.5],d=[h[0]+(9*cw+w*1.3)*k,h[1]+L],e=[h[0]+2*k,h[1]+L*.92];
  const pts=[J.neck,J.shB,a,b],n=c.tatter||0;if(n){for(let i=0;i<=n;i++){const t=i/n,x=lerp(b[0]+2*k,e[0],t),y=lerp(d[1],e[1],t)+((i%2)?-3*k:0);pts.push([x,y])}}else pts.push(d,e);pts.push(add(h,[2*k,-2*k]));
  B.poly(pts,c.col,c.hi,c.lo)}
 /* 刃は必ず黒で縁どる：パリィのゲームでは刃の位置がいちばん大事な情報 */
 function drawBlade(B,S,hd,ang,Wp){const k=S.k,len=Wp.len*k,wd=Wp.w*k,u=dir(ang,1),n=[-u[1],u[0]],Q=(a,b)=>[hd[0]+u[0]*a+n[0]*b,hd[1]+u[1]*a+n[1]*b];
  B.thick(Q(-3*k,0),Q(-1*k,0),1.1*k,Wp.grip,Wp.grip,OUT);B.disc(...Q(-3.6*k,0),1.3*k,Wp.guard,Wp.guard,OUT);
  B.poly([Q(0,-wd-1),Q(len*.9,-wd*.8-1),Q(len+1.5,0),Q(len*.9,wd*.8+1),Q(0,wd+1)],OUT,null,null,1);B.poly([Q(1*k,-wd),Q(len*.9,-wd*.8),Q(len,0),Q(len*.9,wd*.8),Q(1*k,wd)],Wp.col,Wp.hi,Wp.lo);
  B.thick(Q(.5*k,-Wp.gw*k),Q(.5*k,Wp.gw*k),.9*k,Wp.guard,Wp.guardHi,OUT);return Q(len,0)}
 /* かせ：手首の鉄の輪と、短く垂れる鎖（門に仕える誓い） */
 function cuff(B,h,k){B.disc(h[0]+.5*k,h[1]-1.2*k,1.6*k,'#5a5e6c','#9aa0b4','#1a1820',1)}
 function dangle(B,h,k,T,ph){for(let i=1;i<=3;i++){const x=h[0]+1*k+Math.sin(T*.08+i*.7+ph)*.6*i*.4,y=h[1]-.5*k+i*1.7*k;B.set(x,y,i%2?'#5a5e6c':'#9aa0b4',1);if(i%2)B.set(x+1,y,'#5a5e6c',1)}}
 const W_SHORT={len:17,w:1.3,col:'#c8ccd8',hi:'#ffffff',lo:'#6a7088',guard:'#8a6a3a',guardHi:'#c8a050',grip:'#4a3420',gw:2.5};
 const GATE={k:1,hk:1.3,lk:.8,cuff:true,
  pal:{arm:'#6a7488',armHi:'#9aa4b8',armLo:'#3a4054',trim:'#8a6a3a',trimHi:'#c8a050',trimLo:'#4a3420',chest:'#707a90',glove:'#3a2a24',under:'#2e3040',underHi:'#464a5c',underLo:'#181a24',foot:'#3a4054',footHi:'#6a7488'},
  helm:{band:['#8a6a3a','#c8a050'],dents:[[-3,-2],[2,1]]},
  tabard:{len:12,w:4.3,col:'#2e4288',hi:'#4a62b8',lo:'#1a2658',edge:'#c8a050',mark:'#e0b860'}};
 /* ---- 影の剣士・うそつきの影（design/v2/shade.js の SPEC.shadeK・SPEC.shadeMK・SHV・shadeDraw） ----
   2体とも影の剣士の大きさ（k=.86）で描く。うそつきの影の1.25倍は、ゲームがキャンバスごと拡大する（EN の sc）ので、資料集の k=1.075 と同じ大きさになる */
 const W_LONG={len:21,w:1.1,col:'#d8dce8',hi:'#ffffff',lo:'#7a8098',guard:'#2a1a22',guardHi:'#6a4a50',grip:'#2a1a22',gw:2};
 const PAL_GUARD={arm:'#6a7488',armHi:'#9aa4b8',armLo:'#3a4054',trim:'#8a6a3a',trimHi:'#c8a050',trimLo:'#4a3420',chest:'#707a90',glove:'#3a2a24',eye:'#ffe08a',under:'#2e3040',underHi:'#464a5c',underLo:'#181a24',foot:'#3a4054',footHi:'#6a7488'};
 const SHADE={hk:1.2,lk:.9,k:.86,pal:PAL_GUARD,helm:{type:'kettle'},cape:{len:11,col:'#3a4054',hi:'#6a7488',lo:'#1a1c24',tatter:3},w:W_LONG,
  pose:{ua:1.85,fa:2.75,sw:3.7,ua2:1.45,fa2:1.85,ff:-6,fb:6,cr:1.5,lean:.1}};
 const SHADE_M=Object.assign({},SHADE,{cape:{len:16,col:'#3a4054',hi:'#6a7488',lo:'#1a1c24',tatter:6}});
 /* 剣は体より明るい灰紫（合図が出る場所）。覚悟の段：拾われた影がくらやみにのまれていく。剣の色は変えない。のまれるほど影にない目が開く（光らない） */
 const SHBL=['#3a3250','#6a5e8a','#a89cc8'],SHEYE='#7a2a4a';
 const SHV={n:{body:['#08060e','#120d1c','#1c1529','#2a2040'],rim:'#56467a',tail:'#0a0710',rip:0,eyes:0,tailW:1},
  r:{body:['#0c0408','#1c0a12','#2c121c','#40202c'],rim:'#6a3a4e',tail:'#100608',rip:.35,eyes:0,tailW:1},
  k:{body:['#030205','#09070c','#110e16','#1c1824'],rim:'#46405a',tail:'#020103',rip:.35,eyes:1,tailW:2},
  v:{body:['#0a0414','#180a2a','#28143e','#3c2058'],rim:'#6a4a96',tail:'#0c0418',rip:.5,eyes:3,tailW:2}};
 /* ふつうの騎士として描いてから、明るさで3段の影色に置きかえる。剣（剣なしで描いたときにない画素）だけ明るい灰紫（design/v2/shade.js の shadeDraw）。
    stretch＝後ろのかかとより前を、前へ引きのばす（のびる）／flat＝床へ倒れて平たくなる（0〜1）／rip＝輪郭のゆらぎ／cut＝斬られた筋（すき間）。
    先に影色の絵を作ってから、出力の画素ごとに元の画素を引く（のばしても、すき間ができない）。背中側（上と右）の内側1画素を明るくして、暗い背景に溶けないようにする */
 function shadeDraw(B,ox,oy,S,posture,T,tint){const V=SHV[tint]||SHV.n;
  /* mimic＝主人公の形（丸い兜・羽根飾り・マント・盾）に入れかわる（shM_bored）。形だけ主人公の骨組み（js/24h-hero.js）から借りる */
  let W1,J,W2;if((posture.mimic||0)>.5&&typeof HERO!=='undefined'){const a=HERO.fig(B.w,B.h,ox,oy,posture,T,S.k,true);W1=a.B;J=a.J;W2=HERO.fig(B.w,B.h,ox,oy,posture,T,S.k,false).B}
  else{W1=new Buf(B.w,B.h);J=knight(W1,ox,oy,S,posture,T);W2=new Buf(B.w,B.h);knight(W2,ox,oy,S,Object.assign({},posture,{sw:null,sw2:null}),T)}
  const flat=posture.flat||0,st=posture.stretch||0,rip=Math.max(posture.rip||0,V.rip),ax=J.footB?J.footB[0]:ox,cut=posture.cut||0;
  const X=(x,y)=>{let nx=x<ax?ax-(ax-x)*(1+st):x;if(rip)nx+=Math.round(Math.sin(y*.9+T*.6)*rip);return nx},Y=y=>oy-(oy-y)*(1-flat);
  const tx=Math.round(X(ax,oy-1));for(let x=tx-2;x<B.w;x++){B.set(x,oy-1,V.tail,3);if(V.tailW>1&&(x<tx+30||(x*3+T)%7))B.set(x,oy-2,V.tail,3)}
  const L=c=>{if(!c||c[0]!=='#')return .2;const n=parseInt(c.slice(1),16);return(((n>>16)&255)*.3+((n>>8)&255)*.59+(n&255)*.11)/255};
  const src=new Buf(B.w,B.h);let x0=B.w,x1=0,y0=B.h;
  for(let i=0;i<W1.c.length;i++){const c=W1.c[i];if(!c)continue;const x=i%B.w,y=(i/B.w)|0,blade=!W2.c[i],l=L(c),SP=V.body;
   if(cut&&!blade){const ly=oy-cut*.62*J.k*14+(x-ox)*.45;if(Math.abs(y-ly)<1)continue}
   src.set(x,y,blade?(l>.75?SHBL[2]:l>.45?SHBL[1]:SHBL[0]):(l>.5?SP[3]:l>.3?SP[2]:l>.15?SP[1]:SP[0]),blade?2:1);x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y)}
  const out=new Buf(B.w,B.h),dx0=Math.floor(X(x0,y0))-4,dy0=Math.floor(Y(y0))-1;
  for(let y=Math.max(0,dy0);y<=Math.min(B.h-1,oy+1);y++)for(let x=Math.max(0,dx0);x<=Math.min(B.w-1,x1+4);x++){
   let sx=x;if(rip)sx-=Math.round(Math.sin(y*.9+T*.6)*rip);if(sx<ax)sx=ax-(ax-sx)/(1+st);const sy=oy-(oy-y)/Math.max(1-flat,.07);
   let ssx=Math.round(sx),ssy=Math.round(sy);if(cut&&ssy<oy-cut*.62*J.k*14+(ssx-ox)*.45)ssx-=1;
   const c=src.get(ssx,ssy);if(c)out.set(x,y,c,src.tag(ssx,ssy))}
  if(flat<.6)for(let i=0;i<out.c.length;i++){if(out.t[i]!==1)continue;const x=i%B.w,y=(i/B.w)|0;if(!out.get(x,y-1)||!out.get(x+1,y))out.c[i]=V.rim}
  for(let i=0;i<out.c.length;i++)if(out.c[i]){B.c[i]=out.c[i];B.t[i]=out.t[i]}
  if(V.eyes&&flat<.5){const ey=[[J.sc,[0,1]],[J.head,[-2,0]],[J.head,[1,0]]].slice(0,V.eyes);for(const[p0,o]of ey){const q=[Math.round(X(p0[0],p0[1])+o[0]),Math.round(Y(p0[1])+o[1])];if(B.get(q[0],q[1])&&(T+q[0]*7)%140>6)B.set(q[0],q[1],SHEYE,1)}}
  const tr=v=>Array.isArray(v)?(v.length===2&&typeof v[0]==='number'?[X(v[0],v[1]),Y(v[1])]:v.map(tr)):v;for(const k in J)if(k!=='k')J[k]=tr(J[k]);return J}
 /* 立ち絵（sh_idle・shM_idle）：腰が120Fでゆっくり上下し、90Fに一度、10Fだけ輪郭がゆらぐ */
 const SH_IDLE=t=>Object.assign({},PDEF,SHADE.pose,{cr:1.9-.4*Math.cos(t/120*TAU),rip:(t%90<10)?.6:0});
 /* ---- 影の技（design/v2/shade.js の sh_strike・sh_feint・sh_two・shM_feint・shM_dfeint）：資料集のキーを、ゲームの撃の時刻に置き直す ----
    キーは基本の姿勢（PDEF＋SHADE.pose）との差。補間は行き先のキーの ease（無ければ io）。足は動かさない（寄るのはゲームの lungeDist、体は stretch でのびる） */
 const SHW={ua:-2.4,fa:-1.8,sw:-1.2,lean:-.12,cr:2.2},SHS={ua:2.75,fa:2.55,sw:2.3,lean:.32,cr:1,stretch:.85};/* 振りかぶり／のびる斬りの当たり */
 const SHL={ua:1.25,fa:.75,sw:.45,lean:-.04,cr:3.2},SHR={ua:-2.55,fa:-2.75,sw:-2.65,lean:.22,cr:1,stretch:.85};/* 脇構え（剣を低く後ろへ）／すくい上げの当たり */
 const SHF={ua:3.3,fa:3.5,sw:3.4,lean:.2,cr:1.5,stretch:.35,rip:1.6},SHF0=Object.assign({},SHF,{stretch:0,rip:2}),SHF1=Object.assign({},SHF,{stretch:0,rip:.4});/* ふり／縮む／縮んで止まった姿勢（うそつきの影） */
 const SHBASE=Object.assign({},PDEF,{ua:1.85,fa:2.75,sw:3.7,ua2:1.45,fa2:1.85,ff:-6,fb:6,cr:1.5,lean:.1,flat:0,stretch:0,rip:0,cut:0});
 const EZ={lin:u=>u,io:u=>u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2,out:u=>1-Math.pow(1-u,3),in:u=>u*u*u,snap:u=>u<1?0:1};
 function shKeys(){const ss=G.strikes.filter(s=>!s.cx&&!s.ping),ks=[{t:0,p:{}}];let last=0;
  const put=(t,p,e)=>{t=Math.max(t,last);ks.push({t,p,e});last=t};
  for(let i=0;i<ss.length;i++){const s=ss[i],nx=ss[i+1],pv=ss[i-1],liar=pv&&pv.fake&&pv.aft==='afShadeM';
   if(s.fake){/* ふり：振りかぶって止まり（紫の輪）、ふりの時刻にのびかけて止まり、縮む。影の剣士は振りかぶりへ戻り、うそつきの影は縮んだ姿勢のまま */
    if(liar){put(s.fk-4,SHF1);put(s.fk,Object.assign({},SHF,{stretch:.5}),'in');put(s.fk+6,SHF1)}
    else{put(s.cue-14,{});put(s.cue,SHW,'out');put(s.fk-4,SHW);put(s.fk,SHF,'in');if(s.aft==='afShadeM')put(s.fk+8,SHF1);else{put(s.fk+8,SHF0);put(s.fk+16,SHW,'io')}}
    continue}
   const h=s.impact;
   if(nx&&!nx.fake&&nx.iv){/* 本物が2回続く：脇構えで止まり、すくい上げて頭上で止まる */put(s.cue-14,{});put(s.cue,SHL,'out');put(h-4,SHL);put(h,SHR,'in');put(h+3,SHR);put(h+6,SHW,'out');continue}
   if(liar)put(h-4,SHF1);else if(s.iv||(pv&&pv.fake))put(h-4,SHW);else{put(s.cue-14,{});put(s.cue,SHW,'out');put(h-4,SHW)}
   put(h,SHS,'in');put(h+8,SHS);if(!nx){put(h+12,Object.assign({},SHS,{stretch:.3}));put(h+26,{},'io')}else put(h+20,{},'io')}
  return ks}
 function shAtkAt(e,T){const R=st(e);if(R.skFor!==G.strikes){R.skFor=G.strikes;R.sk=shKeys()}const ks=R.sk;let a=ks[0],b=ks[0];
  for(let i=0;i<ks.length;i++){if(ks[i].t<=T)a=ks[i];if(ks[i].t>=T){b=ks[i];break}if(i===ks.length-1)b=ks[i]}
  const A=Object.assign({},SHBASE,a.p),Bp=Object.assign({},SHBASE,b.p);if(a===b||b.t===a.t)return A;
  const u=EZ[b.e||'io'](cl01((T-a.t)/(b.t-a.t))),o={};for(const k in Bp)o[k]=typeof A[k]==='number'&&typeof Bp[k]==='number'?A[k]+(Bp[k]-A[k])*u:(u<.5?A[k]:Bp[k]);return o}
 /* パリィされ（design/v2/shade.js の SK＝knightKit＋影）：小＝剣がはね上がり、のびた体が一瞬で縮んで輪郭がゆらぐ。大＝床へ半分倒れて平たくなり、ゆらぎながら起き上がる */
 function shPry(kind,hp){if(kind==='s')return{ua:hp.ua+.55,fa:hp.fa+1.2,sw:hp.sw+1.9,x:(hp.x||0)+3,lean:(hp.lean||0)-.2,hd:-.15,stretch:0,rip:2};
  return{ua:4.9,fa:5.4,sw:5.8,ua2:.6,fa2:.3,x:(hp.x||0)+4,lean:-.4,hd:-.35,cr:1.5,stretch:-.1,flat:.45,rip:3}}
 /* ブレイク（sh_brk）：床へ倒れて平たい影になり、剣士の形のまま床に伸びる。ときどき輪郭がゆらぐ */
 const SHBRK=t=>Object.assign({},SHBASE,{flat:.86+Math.sin(t*.07)*.02,rip:.6,ua:1.6,fa:1.9,sw:2.5,lean:.15,hd:.4,cr:3});
 /* ---- 影の出現・ひまなとき・撃破（design/v2/shade.js の sh_enter・shM_enter・sh_bored・shM_bored・sh_down・shM_down。T009） ----
    キーは基本の姿勢との差。補間は資料集と同じ（行き先のキーの ease、角度もそのまま）。x（横へすべる）は、骨組みの中ではなく画面で動かす（キャンバスからはみ出すので） */
 const KS=a=>a.map(([t,p,e])=>({t,p,e}));
 function keyAt(ks,T){let a=ks[0],b=null;for(const k of ks){if(k.t<=T)a=k;if(k.t>=T){b=k;break}}const A=Object.assign({},SHBASE,a.p);if(!b||b===a)return A;
  const Bp=Object.assign({},SHBASE,b.p),u=EZ[b.e||'io'](cl01((T-a.t)/(b.t-a.t))),o={};for(const k in Bp)o[k]=typeof A[k]==='number'&&typeof Bp[k]==='number'?A[k]+(Bp[k]-A[k])*u:(u<.5?A[k]:Bp[k]);return o}
 /* 出現：床の影のまますべってきて、一気に立ち上がる（少し背が伸びすぎて収まる）。110F */
 const SH_ENTER=KS([[0,{x:-30,flat:1}],[40,{x:0,flat:1},'out'],[52,{x:0,flat:-.08},'out'],[58,{flat:.04}],[62,{flat:0}],[110,{}]]),SH_ENTER_LEN=110;
 const shEnter=T=>{const o=keyAt(SH_ENTER,T);if(T>=40&&T<58)o.rip=1.2;return o};
 /* ひまなとき：影の剣士は首だけ後ろへ向けて尾の先（持ち主のほう）を見る（160F）。うそつきの影は主人公の形に入れかわって同じ構えで息をする（180F）。光らない */
 const SH_BORED=KS([[0,{}],[30,{}],[44,{hd:-.35,lean:-.15,sw:3.2},'io'],[96,{hd:-.35,lean:-.15,sw:3.2}],[110,{},'io'],[160,{}]]);
 const SHM_MIM={ua:2.2,fa:2.0,sw:-2.3,lean:.05,cr:1},SHM_BORED=KS([[0,{}],[40,{}],[48,SHM_MIM,'io'],[130,SHM_MIM],[140,{},'io'],[180,{}]]);
 function shBored(e,T){if(e.key!=='shadeM'){const o=keyAt(SH_BORED,T);o.rip=(T%90<10)?.6:0;return o}
  const o=keyAt(SHM_BORED,T);o.mimic=T>=46&&T<132?1:0;if(T>=44&&T<50||T>=128&&T<134)o.rip=2;return o}
 /* 撃破：輪郭が大きくゆらいで床に倒れ、平たい影になって、尾をたどって画面の外へ引きずられる。資料集の130Fを【撃破の長さ】へ縮める（ko2.js の koCore） */
 const SH_DOWN=KS([[0,{}],[6,{lean:-.3,hd:-.3,rip:3},'out'],[20,{flat:1,rip:1},'in'],[36,{flat:1}],[110,{flat:1,x:70},'in'],[130,{flat:1,x:70}]]),SH_DOWN_SRC=130;
 const downLen=e=>e.mid?P.koLenMid:P.koLenMob;
 function shDown(e,d){const T=Math.round(Math.max(0,d)*SH_DOWN_SRC/downLen(e)),o=keyAt(SH_DOWN,T);if(T<20)o.rip=2.5*(1-T/20);return o}
 /* 撃破の芯（全員共通、mobs.js の flashCore・ko2.js の koBurst）：閃光（白に黒のふち→黒紫の暗い衝撃の輪）、影のしぶきのかけら、残煙。画面に直接描く */
 const FLSPK=[[-.35,1.0],[.45,.62],[1.25,.85],[1.95,.5],[2.55,1.1],[3.35,.7],[4.3,.9],[5.1,.55]];
 const hs=(x,y)=>{const s=Math.sin(x*127.1+y*311.7)*43758.5453;return s-Math.floor(s)};
 function vn2(x){const i=Math.floor(x),f=x-i,h=n=>{const s=Math.sin(n*127.1)*43758.5;return s-Math.floor(s)};return h(i)+(h(i+1)-h(i))*f*f*(3-2*f)}
 const KOSH={frag:['#0e0a14','#1c1626','#3a3048','#120e18'],smoke:['#1c1626','#2e2638']};/* 影のしぶき */
 function flashCore(c,d,k){if(d<-1||d>=7)return;const put=(x,y,col)=>{if(col)px(Math.round(c[0]+x),Math.round(c[1]+y),col)},Wc='#ffffff',D='#000000';
  if(d===-1){for(let y=-7;y<=7;y++)for(let x=-7;x<=7;x++){const q=Math.hypot(x,y*1.2);if(q<=4*k)put(x,y,Wc);else if(q<=6*k&&(x+y)&1)put(x,y,D)}return}
  if(d<=1){const R=(d?13:10)*k;for(let y=-R;y<=R;y++)for(let x=-R;x<=R;x++){const q=Math.hypot(x,y*1.25);if(q<=R-1.5)put(x,y,Wc);else if(q<=R+.5)put(x,y,(x+y)&1?D:Wc)}
   for(const[a,l]of FLSPK){const L=(18+l*20)*k*(d?1.25:1),w0=(d?2:3)*k;for(let r=R-2;r<L;r+=.5){const w=Math.max(.5,w0*(1-(r-R)/(L-R)));const x=Math.cos(a)*r,y=Math.sin(a)*r*.8,nx=-Math.sin(a),ny=Math.cos(a);for(let o=-w-1;o<=w+1;o+=.5){const col=Math.abs(o)>w?D:Wc;if(col===D&&r>L-3)continue;put(Math.round(x+nx*o),Math.round(y+ny*o*.8),col)}}}
   for(let x=-46*k;x<=34*k;x++){if(Math.abs(x)<R)continue;put(x,0,Math.abs(x)>(x<0?40:28)*k?((x&1)?Wc:null):Wc);if(Math.abs(x)<(x<0?30:20)*k)put(x,1,D)}return}
  const u=d-2,R=(15+u*4)*k;
  for(const[a,l]of FLSPK){const L=(18+l*20)*k*1.3;for(let r=R*.6;r<L*(1+u*.15);r+=3+u){if(hs(Math.round(r),Math.round(a*10)+d)<.35+u*.12)continue;put(Math.round(Math.cos(a)*r),Math.round(Math.sin(a)*r*.8),u<2?'#d8d0e0':'#43365a')}}
  for(let t=0;t<Math.PI*2;t+=.6/R){if(vn2(t*3+d*.7)>.62)continue;for(let w=0;w<(u<2?3:2);w++){const r=R-w;put(Math.round(Math.cos(t)*r),Math.round(Math.sin(t)*r*.75),w===0?((Math.round(t*20))&1?D:'#3e2e54'):u<1?'#d8d0e0':'#2c2238')}}}
 function koBurst(c,d,n,k,mid,m){const FL=FLOOR;flashCore(c,d,k);
  for(let i=0;i<n;i++){const a=-Math.PI*(.08+.84*hs(i,1)),v=(1.4+hs(i,2)*2.6)*k,s=hs(i,3)>.45?3:2,tl=d-1;if(tl<0)continue;let x=c[0]+Math.cos(a)*v*tl,y=c[1]+Math.sin(a)*v*tl+.11*tl*tl;const land=y>=FL;if(land){y=FL;x=c[0]+Math.cos(a)*v*Math.min(tl,(Math.sqrt(Math.max(0,(Math.sin(a)*v)**2+.44*(FL-c[1])))-Math.sin(a)*v)/.22)}
   const life=34+hs(i,4)*14;if(d<1||tl>life)continue;const fade=land?Math.max(0,1-(tl-life*.55)/(life*.45)):1;if(fade<=0||(land&&hs(i,tl)>fade))continue;
   for(let yy=0;yy<s;yy++)for(let xx=0;xx<s+(land?1:0);xx++)px(Math.round(x+xx),Math.round(y-yy),(yy===s-1||xx===0)&&!land?m.frag[2]:land?m.frag[3]:(i+xx)%2?m.frag[0]:m.frag[1])}
  if(d>=4&&d<44)for(let i=0;i<(mid?7:5);i++){const u=(d-4)/40,x=c[0]+(hs(i,5)-.5)*16*k+Math.sin(d*.15+i)*2,y=c[1]-u*18*k-hs(i,6)*4,r=(1.5+u*3)*k;for(let yy=-r;yy<=r;yy++)for(let xx=-r;xx<=r;xx++){if(xx*xx+yy*yy>r*r)continue;if(hs(Math.round(x+xx),Math.round(y+yy)+d)<.5-u*.45)px(Math.round(x+xx),Math.round(y+yy),(xx+yy)&1?m.smoke[0]:m.smoke[1])}}}
 /* 撃破の閃光は倒れはじめの10F後（ko2.js の影の F＝[10,16]）、高さは床から16画素（中ボスは1.25倍） */
 const SH_FLASH=10,SH_FLASH_Y=16;
 /* 居合の撃破の芯：最後の一撃の14F後に閃光、かけらは浸食の黒い粒（ko2.js の sm、F＝[14,16]） */
 const KOSM={frag:['#07050a','#16121c','#3a2e4a','#0e0a12'],smoke:['#120e16','#241c2c']},SM_FLASH=14,SM_FLASH_Y=16;
 const downOf=e=>!on(e)?null:e.kind==='shade'?{len:downLen(e),flash:SH_FLASH,y:SH_FLASH_Y,mat:KOSH}:e.kind==='samurai'?{len:downLen(e),flash:SM_FLASH,y:SM_FLASH_Y,mat:KOSM}:null;
 function koFx(e){const D=downOf(e);if(!G.ko||G.ko.down0==null||!D)return;const d=G.t-G.ko.down0,k=e.mid?1.25:1;koBurst([G.ko.ex,FLOOR-D.y*k],d-D.flash,e.mid?P.koFragMid:P.koFragMob,k,!!e.mid,D.mat)}
 /* 影の姿勢を1フレームに1回進める（門番の pose と同じ組み立て。撃破は T009 まで、倒れる前の姿勢のまま） */
 function shState(e){const R=st(e),t=G.anim;if(R.memo===t&&R.posture)return R.posture;R.memo=t;
  let key,T;
  if(G.ko){key='ko';T=G.ko.down0!=null?shDown(e,G.t-G.ko.down0):(R.prev||SH_IDLE(t))}
  else if(G.state==='enter'&&G.enter&&G.enter.rig){key='enter';T=shEnter(G.enter.t)}
  else if(e.broken){key='brk';T=SHBRK(t)}
  else if(G.state==='enemy'&&G.strikes&&G.strikes.length){key='atk';T=shAtkAt(e,G.et)}
  else if(G.bored&&G.state==='cmd'&&e===G.en){key='bored';T=shBored(e,t-G.bored.at)}
  else{key='idle';T=SH_IDLE(t)}
  if(key!==R.key){const old=R.key;R.key=key;R.from=R.prev;R.at=t;
   if(key==='brk'){R.dur=16;R.ez='s'}else if(old==='brk'){R.dur=5;R.ez='back'}else if(key==='idle'){R.dur=20;R.ez='io'}else{R.dur=6;R.ez='io'}}
  let posture=T;if(R.from&&t-R.at<R.dur&&key!=='ko'&&key!=='enter'){const u=ease[R.ez](cl01((t-R.at)/R.dur));posture=mixP(R.from,T,u)}
  /* 出現と撃破は資料集のキーのまま（弾かれ・斬られを重ねない）。横へすべる分は画面で動かす */
  if(key==='enter'||(key==='ko'&&G.ko.down0!=null)){R.sdx=(posture.x||0)*SHADE.k*(e.sc||1);posture=Object.assign({},posture,{x:0});R.prev=posture;R.posture=posture;return posture}
  R.sdx=0;
  if(G.state==='enemy'&&G.strikes){const ss=G.strikes.filter(isMain),last=ss[ss.length-1];for(const s of ss){if(s.done&&s.res==='parry'&&!R.seen.has(s)){R.seen.add(s);const kind=s===last?'b':'s';R.rx.push({at:t-Math.max(0,G.et-s.impact),kind,T:shPry(kind,shAtkAt(e,s.impact))})}}}
  R.rx=R.rx.filter(r=>t-r.at<STOP+60);
  for(const r of R.rx){const w=pryW(r,t-r.at);if(w>0)posture=mixP(posture,r.T,w)}
  /* 弾かれた側は横にだけ大きく震えて、だんだん小さく（ゲームの止まり12Fのあいだ） */
  for(const r of R.rx){const d=t-r.at;if(d>=0&&d<STOP){posture=Object.assign({},posture);posture.x=(posture.x||0)+((t&1)?1:-1)*(r.kind==='b'?2:1.4)*(1-d/STOP)}}
  /* やられ（sh_hurt）：刃の通った筋が細いすき間になり、上半分がずれて、ゆらいで閉じる。血も火花も押し下がりも無い。ブレイク中は輪郭が大きくゆらぐだけ（sh_rec） */
  if(e.hurt>0&&!R.lastHurt){const two=R.hurt.length&&t-R.hurt[R.hurt.length-1].at<30;R.hurt.push({at:t,two})}R.lastHurt=e.hurt;
  R.hurt=R.hurt.filter(h=>t-h.at<60);
  if(R.hurt.length){let A=0,Bk=0;for(const h of R.hurt){if(h.two)Bk=Math.max(Bk,kb(t-h.at,9));else A=Math.max(A,kb(t-h.at,6))}const m=Math.max(A,Bk);posture=Object.assign({},posture);
   if(key==='brk')posture.rip=Math.max(posture.rip||0,3*m);else{posture.cut=m>.15?(Bk>A?1.3:1):0;posture.rip=Math.max(posture.rip||0,2.2*m);posture.x=(posture.x||0)+2*A+3*Bk}}
  R.prev=posture;R.posture=posture;return posture}
 /* 描く順：後ろの腕→後ろの剣→後ろの脚→胴→前の脚→前垂れ→兜→前の剣→前の腕→かせ */
 function knight(B,ox,oy,S,posture,T){const J=joints(ox,oy,S,posture);
  drawCape(B,S,J,T);
  drawArm(B,S,J.shB,J.elB,J.hdB,false);
  drawLeg(B,S,J.hpB,J.kneeB,J.footB,false);
  if(S.sheath)S.sheath(B,J,T,posture);if(S.robe)drawRobe(B,S,J);
  drawTorso(B,S,J);drawLeg(B,S,J.hpF,J.kneeF,J.footF,true);if(S.tabard)drawTabard(B,S,J);
  drawHead(B,S,J,posture,T);
  if(posture.sw2!=null)J.tip2=drawBlade(B,S,J.hdB,posture.sw2,W_SHORT);
  if(posture.sw!=null)J.tip=drawBlade(B,S,J.hdF,posture.sw,S.w||W_SHORT);
  drawArm(B,S,J.shF,J.elF,J.hdF,true);
  if(S.front)S.front(B,J,T,posture);
  if(S.cuff){cuff(B,J.hdF,S.k);dangle(B,J.hdF,S.k,T,0);cuff(B,J.hdB,S.k);dangle(B,J.hdB,S.k,T,1)}
  return J}

 /* ---- 居合の剣士・居合のおかしら（design/v2/iai.js の SPEC.samurai・SPEC.samuraiM・SMV・smDraw。T010） ----
    2体とも居合の剣士の大きさ（k=.86）で描く。おかしらの1.25倍は、ゲームがキャンバスごと拡大する（EN の sc）ので、資料集の k=1.075 と同じ大きさになる。
    刀はいつも鞘の中（sw＝null）。抜くのは斬る一瞬だけ。合図は笠の下の目に出る（目は光らない暗い色）。刀を持つ右腕が黒い（浸食） */
 const W_KATA={len:20,w:1,col:'#c8ccd8',hi:'#ffffff',lo:'#6a7088',guard:'#2a2420',guardHi:'#6a5a40',grip:'#1a1420',gw:1.5};
 /* 覚悟の段：浸食が広がる段階。lv＝浸食の深さ（モブ0から、おかしらは+1） */
 const SMV={n:{lv:0,robe:['#3a4468','#5a6890','#1e2440']},r:{lv:1,robe:['#5a2a38','#80404e','#2e121c']},k:{lv:2,robe:['#26222e','#3e3848','#100e16']},v:{lv:3,robe:['#3a2458','#563880','#1c0e2e']}};
 const INK2=['#141018','#2a2234','#08060c'],SMEYE='#6a2a2a',SMEYE2='#7a2a4a',STRAW=['#7a6a48','#a08a5e','#3e3422'];
 const sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],mul=(a,s)=>[a[0]*s,a[1]*s],norm=a=>{const l=Math.hypot(a[0],a[1])||1;return[a[0]/l,a[1]/l]};
 /* 着物の前垂れ（体の中に着る。rig.js の drawTorso の前垂れ） */
 function drawRobe(B,S,J){const k=S.k,L=-J.lean,h=J.hip,R=v=>add(h,rot([v[0],v[1]*(v[1]<0?(S.tk||PRO.tk):1)],L)),t=S.robe;
  B.poly([R([-4*k,-1*k]),R([4*k,-1*k]),R([3.5*k,t.len*k]),R([0,(t.len+1.5)*k]),R([-3.5*k,t.len*k])],t.col,t.hi,t.lo)}
 /* 鞘：腰から後ろ上へ。sa＝鞘の角度、notch＝刻みの数（おかしら）、notchHi＝なぞっている刻み */
 function smSheath(B,J,T,Q,S){const k=J.k,a=add(J.hip,[-1*k,1*k]),sa=Q.sa==null?-.37:Q.sa,b=add(a,dir(sa,19*k));
  B.thick(a,b,1.2*k,'#1e1418','#3a2a30','#0c0608');B.disc(...b,1*k,'#6a5a40','#8a7a58',OUT);
  for(let i=0;i<(S.notch||0);i++){const q=add(a,dir(sa,(6+i*1.2)*k));B.set(q[0],q[1]-1,(Q.notchHi!=null&&Math.abs(Q.notchHi-i)<.5)?'#d8c8a0':'#8a7a5e',2)}}
 /* 笠と顔。hat＝笠がはね上がって顔がのぞく（0〜1）、drop＝笠が落ちる */
 function smHead(B,R,k,T,Q){const lv=Q._lv||0,h=Q.hat||0;
  B.poly([R([-3.2*k,3.6*k]),R([3*k,3.6*k]),R([3.4*k,-.5*k]),R([-3.4*k,-.5*k])],'#2a2026','#4a3a40','#120a0e');
  if(h>.3){for(let i=0;i<3;i++)B.set(...R([(-2.6+i*.4)*k,(3.2-i*.9)*k]),INK2[0],2);B.line(...R([-2.8*k,2.6*k]),...R([-1*k,2.9*k]),'#8a4a4a')}
  const eyes=[[-2.6,1.2],[-1.2,1.2]];if(lv>=3)eyes.push([-1.9,2.4]);for(const e of eyes)B.set(...R([e[0]*k,e[1]*k]),lv>=3?SMEYE2:SMEYE,2);
  if(Q.drop>0)return;
  const tilt=-h*.6,lift=h*3,QT=v=>{const c=Math.cos(tilt),s=Math.sin(tilt);return R([v[0]*c-v[1]*s,v[0]*s+v[1]*c-lift*k])};
  B.poly([QT([-9.5*k,.2*k]),QT([-4*k,-2.6*k]),QT([.6*k,-5.4*k]),QT([5*k,-2.8*k]),QT([9*k,.2*k]),QT([0,-.6*k])],STRAW[0],STRAW[1],STRAW[2]);
  for(let x=-8;x<=8;x+=2)B.set(...QT([x*k,-.1*k]),STRAW[2],2);
  if(lv>=2)for(const x of[-9,-6.5,7.5])B.set(...QT([x*k,1*k]),STRAW[2],2)}
 function smHatOnFloor(B,x,y){const c=STRAW;for(let i=-8;i<=8;i++){B.set(x+i,y,c[i<-3?2:i<3?1:0],2);if(Math.abs(i)<6)B.set(x+i,y-1,c[i<0?1:0],2);if(Math.abs(i)<3)B.set(x+i,y-2,c[1],2)}B.set(x-9,y,OUT,2);B.set(x+9,y,OUT,2)}
 /* 柄（koi＝鯉口を切って刃が少し見える、grip＝柄を握っている） */
 function smHilt(B,J,Q){const k=J.k,a=add(J.hip,[-1*k,1*k]),sa=Q.sa==null?-.37:Q.sa;
  if(Q.sheath){const koi=Q.koi||0,u=Q.grip?norm(sub(J.hdF,a)):dir(sa+Math.PI,1),m=add(a,mul(u,koi*5*k)),g=add(m,mul(u,6*k));
   if(koi)B.thick(a,m,.9*k,'#d8dce8','#ffffff','#6a7088');B.thick(add(m,[-u[1]*1.6*k,u[0]*1.6*k]),add(m,[u[1]*1.6*k,-u[0]*1.6*k]),.8*k,'#2a2420','#6a5a40',OUT);B.thick(m,g,1*k,'#1a1420','#3a2a30',OUT)}}
 /* 浸食：刀を持つ右腕から広がる黒。光らない */
 function smInk(B,J,T,Q,S){smHilt(B,J,Q);const k=J.k,lv=(S.lvBase||0)+(Q._lv||0);
  B.thick(J.elF,J.hdF,1.6*k,INK2[0],INK2[1],INK2[2]);B.disc(J.hdF[0],J.hdF[1],1.7*k,INK2[0],INK2[1],INK2[2]);
  if(lv>=1){B.thick(J.shF,J.elF,1.5*k,INK2[0],INK2[1],INK2[2]);for(let i=0;i<4;i++){const t=i/4;B.set(lerp(J.shF[0],J.neck[0],t)+(i%2),lerp(J.shF[1],J.neck[1],t)-i,INK2[1],2)}}
  if(lv>=2)for(let j=0;j<3;j++){const s=add(J.shF,[j*1.5*k,1*k]);for(let i=0;i<5+j*2;i++)B.set(s[0]+i*.6*k+Math.sin(i+j)*.6,s[1]+i*1*k,INK2[(i+j)%2],2)}
  if(lv>=3){for(const e of[[.35,1],[.7,-1]]){const q=[lerp(J.elF[0],J.hdF[0],e[0]),lerp(J.elF[1],J.hdF[1],e[0])];B.set(q[0]+e[1],q[1],SMEYE2,2)}}}
 const SM_PAL=Object.assign({},PAL_GUARD,{trim:'#6a5030',trimHi:'#9a7a48',trimLo:'#3a2a18',glove:'#2a2026',under:'#22202c',underHi:'#34303e',underLo:'#121018',foot:'#2a2228',footHi:'#4a3e44'});
 const SAMU={k:.86,hk:1.2,lk:.92,pal:SM_PAL,helm:{type:'kasa'},robe:{len:12,col:'#3a4468',hi:'#5a6890',lo:'#1e2440'},w:W_KATA,lvBase:0,notch:0,
  pose:{ua:1.5,fa:1.75,sw:null,sheath:1,ua2:1.55,fa2:2.5,ff:-5,fb:5,cr:.8,lean:.04}};
 const SAMU_M=Object.assign({},SAMU,{lvBase:1,notch:9});
 /* 段の色で着物を塗りかえて描く（smDraw）。drop＝撃破で笠が落ちる */
 function smDraw(B,ox,oy,S0,posture,T,tint){const V=SMV[tint]||SMV.n,Q=Object.assign({},PDEF,S0.pose,posture,{_lv:V.lv});
  const S=Object.assign({},S0,{pal:Object.assign({},S0.pal,{arm:V.robe[0],armHi:V.robe[1],armLo:V.robe[2],chest:V.robe[0]}),robe:Object.assign({},S0.robe,{col:V.robe[0],hi:V.robe[1],lo:V.robe[2]}),
   sheath:(B2,J2,T2,P2)=>smSheath(B2,J2,T2,P2,S0),front:(B2,J2,T2,P2)=>smInk(B2,J2,T2,P2,S0)});
  const J=knight(B,ox,oy,S,Q,T);
  if(Q.drop>0){const f=Math.min(1,Q.drop),hx=lerp(J.head[0],J.head[0]+10,f),hy=lerp(J.head[1]-3,oy,Math.pow(f,1.6));
   if(f<1){const W2=new Buf(B.w,B.h);smHead(W2,v=>add([hx,hy],rot(v,f*1.4)),S.k*S.hk,T,Object.assign({},Q,{drop:0,hat:0}));for(let i=0;i<W2.c.length;i++)if(W2.c[i]&&(W2.c[i]===STRAW[0]||W2.c[i]===STRAW[1]||W2.c[i]===STRAW[2])){B.c[i]=W2.c[i];B.t[i]=2}}
   else smHatOnFloor(B,Math.round(hx),oy-1)}
  return J}
 /* 合図の場所：笠の下の目（iai.js の eyeAt） */
 const eyeAt=J=>add(J.head,[-2.4*J.k*1.2,1.2*J.k*1.2]);
 /* 立ち絵（sm_idle・smM_idle）：自然体。左手は鞘、右手は下げたまま。腰が96Fでゆっくり上下する */
 const SMI={ua:1.5,fa:1.75,sw:null,sheath:1,grip:0,koi:0,sa:-.37,ua2:1.55,fa2:2.5,ff:-5,fb:5,cr:.8,lean:.04,hd:0};
 const SM_IDLE=t=>Object.assign({},PDEF,SMI,{cr:SMI.cr+Math.sin(t*TAU/96)*.35});
 /* ---- 居合の技（iai.js の sm_iai・sm_kamae・sm_counter・smM_ni。T096）：資料集のキーを、ゲームの撃の時刻（構え始め・合図・当たり）に置き直す ----
    補間は資料集と同じ（行き先のキーの ease、角度もそのまま。頭上へ返す SMU は +2π で、刀を体の前に通す）。
    体が前へ出る分（x）はゲームの寄せ（lungeDist）にまかせ、骨組みでは動かさない（門番と同じ。手触りは変えない） */
 const SMK={ua:1.95,fa:1.55,sw:null,sheath:1,grip:1,sa:-.3,ua2:1.35,fa2:2.6,ff:-11,fb:8,cr:4,lean:.22,hd:.12};/* 居合の構え：腰を落として柄に手 */
 const SMR=Object.assign({},SMK,{cr:5.3,lean:.28,ff:-12,fb:9,koi:1});/* 返しの構え：さらに沈み、鯉口を切る（刃が見える） */
 const SMN={ua:2.15,fa:1.3,sw:null,sheath:1,grip:1,sa:-1.05,ua2:.25,fa2:-.35,ff:-13,fb:10,cr:6,lean:.36,hd:.2};/* 二の太刀の構え：さらに低く、左手で鞘を背中へ引き上げる */
 const SMS={ua:3.08,fa:3.12,sw:3.16,ua2:.6,fa2:.1,sheath:0,grip:0,sa:-.5,lean:.26,cr:4.6,ff:-14,fb:10,hd:.05};/* 一閃（抜いた瞬間＝当たり） */
 const SMF=Object.assign({},SMS,{ua:2.5,fa:2.05,sw:2.45,lean:.22,cr:4});/* 血振り */
 const SMU={ua:-2.2+TAU,fa:-1.95+TAU,sw:-1.55+TAU,ua2:-2.0+TAU,fa2:-1.7+TAU,sheath:0,lean:-.06,cr:3,ff:-13,fb:10,hd:-.05};/* 頭上へ返す（刀を前から上へ。背中側を回さない） */
 const SMD={ua:2.7,fa:2.45,sw:2.3,ua2:2.6,fa2:2.35,sheath:0,lean:.34,cr:4.8,ff:-14,fb:10};/* 唐竹（打ち下ろし） */
 const SMDF=Object.assign({},SMD,{ua:2.95,fa:2.9,sw:3.05,lean:.38,cr:5});/* 振り切り */
 const SMUP={ua:-2.45,fa:-2.75,sw:-2.0,ua2:.4,fa2:.8,sheath:0,lean:.0,cr:2.4,ff:-15,fb:11,grip:0};/* 返し斬り：抜きざまの斬り上げ */
 const SMUP2=Object.assign({},SMUP,{ua:-2.15,fa:-2.25,sw:-1.65});
 const SMF_UP=Object.assign({},SMF,{ua:SMF.ua-TAU,fa:SMF.fa-TAU,sw:SMF.sw-TAU});/* 斬り上げからの血振り（角度を同じ回りで続ける） */
 const SMBASE=Object.assign({},PDEF,SAMU.pose,{sheath:1,grip:0,koi:0,sa:-.37,hat:0,drop:0,notchHi:null,x:0});
 /* 撃の並びから、キー（ゲームの et の時刻）を作る。chin＝納刀（チン）の時刻 */
 function smKeys(){const ss=G.strikes.filter(isMain),ks=[];let last=0,chin=null;const put=(t,p,e)=>{t=Math.max(t,last);ks.push({t,p,e});last=t};
  const sink=(s,P0)=>{put(s.start+Math.max(1,Math.min(10,s.cue-s.start-2)),P0,'out')};
  for(let i=0;i<ss.length;i++){const s=ss[i],nx=ss[i+1],h=s.impact;
   if(s.counter){/* 返し斬り：受け流されて押され、合図までに深く沈みきり、抜きざまに斬り上げる（sm_counter） */
    put(s.start,Object.assign({},SMR,{lean:.12,cr:4.6}));put(s.cue,Object.assign({},SMR,{cr:6,lean:.34,ff:-14,fb:10}),'out');put(h-1,Object.assign({},SMR,{cr:6.1,lean:.36,ff:-14,fb:10}));
    put(h,SMUP,'snap');put(h+4,SMUP2,'out');put(h+34,SMUP2);put(h+48,SMF_UP,'io');put(h+56,Object.assign({},SMK,{grip:1}),'snap');chin=h+56;put(h+84,SMI,'io');continue}
   if(s.mv==='ni'){/* 二の太刀：鞘引きで止まり、一閃→斬った形で止め→頭上へ返して止め→打ち下ろし（smM_ni、RESPACE 後） */
    put(s.start,SMI);sink(s,SMN);put(h-1,SMN);put(h,SMS,'snap');put(h+3,SMS);put(h+7,SMU,'out');
    const h2=nx&&nx.mv==='ni2'?nx.impact:h+44;put(h2-3,SMU);put(h2,SMD,'in');put(h2+5,SMDF,'out');put(h2+27,SMDF);put(h2+37,SMF,'io');put(h2+49,Object.assign({},SMK,{grip:1}),'snap');chin=h2+49;put(h2+87,SMI,'io');i++;continue}
   /* 居合：腰を落として柄に手をかけて止まり、目が光ってから一閃。斬ったまま残心→血振り→チンと納める（sm_iai） */
   put(s.start,SMI);sink(s,SMK);put(h-1,Object.assign({},SMK,{cr:4.3}));put(h,SMS,'snap');put(h+24,SMS);put(h+30,SMF,'out');put(h+40,SMF);put(h+48,Object.assign({},SMK,{grip:1}),'snap');chin=h+48;put(h+56,SMK);put(h+82,SMI,'io')}
  return{ks,end:last,chin}}
 function smKeyAt(ks,T,keepX){let a=ks[0],b=null;for(const k of ks){if(k.t<=T)a=k;if(k.t>=T){b=k;break}}const A=Object.assign({},SMBASE,a.p);if(!b||b===a)return keepX?A:Object.assign(A,{x:0});
  const Bp=Object.assign({},SMBASE,b.p),u=EZ[b.e||'io'](cl01((T-a.t)/(b.t-a.t))),o={};for(const k in Bp)o[k]=typeof A[k]==='number'&&typeof Bp[k]==='number'?A[k]+(Bp[k]-A[k])*u:(u<.5?A[k]:Bp[k]);if(!keepX)o.x=0;return o}
 /* ---- 居合のパリィされ・ブレイク・やられ（iai.js の sm_pry・sm_brk・sm_rec・sm_hurt、smM_…。T011） ----
    パリィされ（knightKit）：小＝刀ごと腕がはね上がる（二の太刀の一太刀目。そのまま頭上へ返して二太刀目へ）／大＝刀ごと腕がはね上げられてのけぞり、笠がはね上がって顔がのぞく。
    ブレイク：居合返しで崩れる。抜き身の刀が床近くまで垂れ、鞘は腰からずれ、笠が傾いたまま肩で息をする。立て直しは一瞬で納刀（チン）して居合の構え。
    やられ：のけぞって笠がはね上がる。傷から出るのは血ではなく黒いもの（腕と同じ浸食） */
 function smPry(kind,hp){if(kind==='s')return{ua:hp.ua+.55,fa:hp.fa+1.2,sw:(hp.sw==null?3.16:hp.sw)+1.9,x:3,lean:(hp.lean||0)-.2,hd:-.15};
  return{ua:4.9,fa:5.4,sw:5.8,ua2:.6,fa2:.3,x:11,lean:-.4,hd:-.35,cr:1.5}}
 /* 刀の先が床に刺さらないように、剣の角度を上へ寄せる（parried.js の noStab） */
 function smNoStab(Q){for(let n=0;n<40;n++){const J=joints(OX,H,SAMU,Q),tp=add(J.hdF,dir(Q.sw,W_KATA.len*SAMU.k));if(tp[1]<=H-1)break;Q.sw+=Math.cos(Q.sw)<0?.06:-.06}return Q}
 const SMBRK=t=>smNoStab(Object.assign({},SMBASE,{x:2,ua:1.55,fa:1.75,sw:2.3+Math.sin(t*.05)*.05,sheath:0,grip:0,ua2:1.4,fa2:1.3,sa:-.6,lean:.26+Math.sin(t*TAU/40)*.03,hd:.45,cr:3.2+Math.sin(t*TAU/40)*.4,hat:.35}));
 const SMREC=Object.assign({},SMBASE,SMK,{grip:1,x:0});/* 立て直し：納刀して居合の構え */
 /* 傷からにじむ黒（hurt.js の ooze。血ではない） */
 function smOoze(B,c,d,n,cols){if(d<0||d>26)return;for(let i=0;i<n;i++){const h=hs(i,7),a=-2.6+h*2.2,v=.9+hs(i,3)*1.2,x=c[0]+Math.cos(a)*v*d*.9+3,y=c[1]+Math.sin(a)*v*d*.9+.05*d*d;if(y<H)B.set(x,y,cols[i%cols.length],4)}}
 /* ---- 居合の出現・ひまなとき・撃破（iai.js の sm_enter・smM_enter・sm_bored・smM_bored・sm_down・smM_down。T012） ----
    補間は資料集と同じ。腕を上げる動き（笠を上げる手・黒い手）は +2π の角度で、体の前を通す。横へ歩く分（x）は画面で動かす */
 const SMKS=a=>a.map(([t,p,e])=>({t,p:Object.assign({},SMI,p),e}));
 /* 出現：構えずに歩いてきて止まり、笠のふちを指で上げて値踏みし、下ろして待つ（130F） */
 const SM_ENTER=SMKS([[0,{x:44}],[48,{x:0},'lin'],[60,{}],[70,{ua:-2.6+TAU,fa:-1.0+TAU,hat:.45},'out'],[96,{ua:-2.6+TAU,fa:-1.0+TAU,hat:.45}],[106,{},'io'],[130,{}]]),SM_ENTER_LEN=130;
 function smEnter(T){const o=smKeyAt(SM_ENTER,T,true);if(T<48){const s=Math.sin(T*TAU/16);o.ff=-5+s*4;o.fb=5-s*4;o.cr=(o.cr||0)+Math.abs(s)*.6}return o}
 /* ひまなとき：居合の剣士は黒い右手を顔の前で握っては開いて眺め、肩を揺らして笑う（170F）。おかしらは鞘を傾けて刻みを一つずつなぞり、数え終えると主人公を見る（190F）。光らない */
 const SMB_H=v=>({ua:2.9,fa:v+TAU,hd:.25});
 const SM_BORED=SMKS([[0,{}],[24,{}],[36,Object.assign(SMB_H(-2.5),{lean:0}),'io'],[60,SMB_H(-2.2)],[70,SMB_H(-2.6)],[80,SMB_H(-2.2)],[120,SMB_H(-2.5)],[134,{},'io'],[170,{}]]);
 const SMM_CNT={sa:.15,ua2:1.9,fa2:1.2,hd:.45,lean:.12},SMM_LOOK={sa:.15,ua2:1.9,fa2:1.2,hd:-.05,lean:.06};
 const SMM_BORED=SMKS([[0,{}],[24,{}],[38,SMM_CNT,'io'],[120,SMM_CNT],[132,SMM_LOOK,'io'],[160,Object.assign({},SMM_LOOK,{lean:SMI.lean})],[176,{},'io'],[190,{}]]);
 function smBored(e,T){const M=e.key==='samuraiM',o=smKeyAt(M?SMM_BORED:SM_BORED,T,true);o.cr=(o.cr||0)+Math.sin(T*TAU/96)*.35;
  if(M)o.notchHi=T>=40&&T<120?Math.floor((T-40)/9):null;else if(T>=84&&T<120)o.cr+=((T>>2)&1)*.5;return o}
 /* 撃破：のけぞってひざをつき、笠が落ちる。右腕の黒が一気に全身へ広がり、下から崩れて消える。床には笠だけ。資料集の150Fを【撃破の長さ】へ縮める（ko2.js の koCore） */
 const SMKN={kn:1,lean:.35,hd:.35,ua:1.6,fa:1.5,ua2:1.4,fa2:1.6,x:4};
 const SM_DOWN=SMKS([[0,{}],[6,{lean:-.3,hd:-.3,x:4},'out'],[26,SMKN,'in'],[150,Object.assign({},SMKN,{lean:.38,hd:.42})]]),SM_DOWN_SRC=150;
 function smDown(e,d){const T=Math.round(Math.max(0,d)*SM_DOWN_SRC/downLen(e)),o=smKeyAt(SM_DOWN,T,true);o.drop=T<20?0:Math.min(1,(T-20)/14);return o}
 /* 黒が手から全身へ広がり（縮めた時刻の40F〜）、84F から下から崩れる。床に落ちた笠は残す（ko2.js が縮めずに渡す post と同じ時刻） */
 function smDownPost(B,J,d){const c=J.hdF;if(d<40||!c)return;const u=Math.min(1,(d-40)/30),Rr=u*40,v=d<84?0:Math.min(1,(d-84)/40),W2=B.w;
  for(let i=0;i<B.c.length;i++){const ty=B.t[i];if(ty!==1&&ty!==2)continue;const col=B.c[i];if((col===STRAW[0]||col===STRAW[1]||col===STRAW[2])&&i/W2>H-4)continue;const x=i%W2,y=i/W2|0,dd=Math.hypot(x-c[0],y-c[1]);
   if(dd<Rr+hs(x,y)*6){if(v>0&&hs(x*3,y*5)<v*1.7*(1.2-(H-y)/50)){B.c[i]=0;B.t[i]=0;continue}B.c[i]=(x+y)%3?INK2[0]:INK2[1]}}
  if(v>0)for(let i=0;i<14;i++){const h=hs(i,9),x=c[0]-14+h*30,y=H-2-((d-84)*.35+hs(9,i)*10)%18;if(hs(i,d>>3)<1-v*.6)B.set(x,y,INK2[1],5)}}
 /* 居合の姿勢を1フレームに1回進める。技のあとの残心・血振り・納刀は、敵の番が終わっても続けて見せる（返しの構えに入るときは、納刀までで切る） */
 function smState(e){const R=st(e),t=G.anim;if(R.memo===t&&R.posture)return R.posture;R.memo=t;
  let key,T;
  const has=G.strikes&&G.strikes.some(isMain);if(has&&R.skFor!==G.strikes){R.skFor=G.strikes;R.sm=smKeys()}
  /* 技の時刻：敵の番のあいだは G.et、番が終わったあとは G.et＋（番が終わってからのフレーム。G.eEnd は 21-enemy-turn.js が覚える） */
  const T0=!has?null:G.state==='enemy'?G.et:(G.state==='cmd'||G.state==='hero')&&G.eEnd!=null?G.et+(t-G.eEnd):null;R.curT=T0;
  if(G.ko){key='ko';T=G.ko.down0!=null?smDown(e,G.t-G.ko.down0):(R.prev||SM_IDLE(t))}
  else if(G.state==='enter'&&G.enter&&G.enter.rig){key='enter';T=smEnter(G.enter.t)}
  else if(e.broken){key='brk';T=SMBRK(t)}
  else if(T0!=null&&G.state==='enemy'){key='atk';T=smKeyAt(R.sm.ks,T0)}
  else if(R.recAt!=null&&t-R.recAt<30){key='rec';T=SMREC}
  else if(T0!=null&&T0<=(e.stance&&R.sm.chin!=null?R.sm.chin:R.sm.end)){key='atk';T=smKeyAt(R.sm.ks,T0)}
  else if(e.stance){key='stance';T=Object.assign({},SMBASE,SMR,{x:0})}
  else if(G.bored&&G.state==='cmd'&&e===G.en){key='bored';T=smBored(e,t-G.bored.at)}
  else{key='idle';T=SM_IDLE(t)}
  if(key!==R.key){const old=R.key;R.key=key;R.from=R.prev;R.at=t;
   if(key==='brk'){R.dur=16;R.ez='s'}else if(old==='brk'){R.dur=5;R.ez='back';if(key!=='ko'){R.recAt=t;key='rec';R.key='rec';T=SMREC}}else if(key==='stance'){R.dur=10;R.ez='io'}else if(key==='idle'){R.dur=20;R.ez='io'}else{R.dur=6;R.ez='io'}}
  /* 出現と撃破は資料集のキーのまま（弾かれ・斬られを重ねない）。横へ歩く・ずれる分は画面で動かす */
  if(key==='enter'||(key==='ko'&&G.ko.down0!=null)){R.sdx=(T.x||0)*SAMU.k*(e.sc||1);const o=Object.assign({},T,{x:0});R.chinD=null;R.downD=key==='ko'?G.t-G.ko.down0:null;R.prev=o;R.posture=o;return o}
  R.sdx=0;R.downD=null;
  let posture=T;if(R.from&&t-R.at<R.dur&&key!=='atk'&&key!=='ko'&&key!=='bored'){posture=mixP(R.from,T,ease[R.ez](cl01((t-R.at)/R.dur)))}
  if(key==='stance')posture=Object.assign({},posture,{koi:cl01((t-R.at)/10)});
  if(key==='rec'&&t-R.recAt>=2)posture=Object.assign({},posture,{sheath:1,sw:null,grip:1,hat:0});
  /* パリィされた撃を拾う（最後の撃なら大） */
  if(G.state==='enemy'&&has){const ss=G.strikes.filter(isMain),last=ss[ss.length-1];for(const s of ss){if(s.done&&s.res==='parry'&&!R.seen.has(s)){R.seen.add(s);const kind=s===last?'b':'s';R.rx.push({at:t-Math.max(0,G.et-s.impact),kind,T:smPry(kind,smKeyAt(R.sm.ks,s.impact))})}}}
  R.rx=R.rx.filter(r=>t-r.at<STOP+60);
  if(key!=='ko'){for(const r of R.rx){const w=pryW(r,t-r.at);if(w>0)posture=mixP(posture,r.T,w)}
   /* 大のパリィされ：笠がはね上がって顔がのぞき、しばらくして下ろす */
   for(const r of R.rx){if(r.kind!=='b')continue;const d=t-r.at,hat=d<0?0:d<STOP?Math.min(1,(d+1)/4):Math.max(0,1-(d-STOP-14)/14);if(hat>0)posture=Object.assign({},posture,{hat:Math.max(posture.hat||0,hat)})}}
  /* 斬られた瞬間を拾う（30F以内の二太刀目は大きく） */
  if(e.hurt>0&&!R.lastHurt){const two=R.hurt.length&&t-R.hurt[R.hurt.length-1].at<30;R.hurt.push({at:t,two})}R.lastHurt=e.hurt;
  R.hurt=R.hurt.filter(h=>t-h.at<60);
  if(R.hurt.length&&key!=='ko'){let A=0,Bk=0;for(const h of R.hurt){if(h.two)Bk=Math.max(Bk,kb(t-h.at,9));else A=Math.max(A,kb(t-h.at,6))}const m=Math.max(A,Bk);posture=Object.assign({},posture);
   if(key==='brk'){posture.lean-=.2*A+.25*Bk;posture.x=(posture.x||0)+2*A+3*Bk}
   else{posture.lean=(posture.lean||0)-.25*A-.3*Bk;posture.x=(posture.x||0)+2*A+3*Bk;posture.hd=(posture.hd||0)-.2*m;posture.hat=Math.max(posture.hat||0,.5*m)}}
  R.chinD=key==='atk'&&R.sm&&R.sm.chin!=null?T0-R.sm.chin:key==='rec'?t-R.recAt-2:null;
  R.prev=posture;R.posture=posture;return posture}
 /* 納刀の「チン」：柄の口から左右へ広がる小さな弧（iai.js の chinRing。光らない灰） */
 function chinFx(B,J,d){if(d<0||d>12||!J.hip)return;const c=add(J.hip,[-1*J.k,1*J.k]);for(let q=0;q<2;q++){const r=2+d*1.1+q*3;for(let a=-.8;a<=.8;a+=.16){B.set(c[0]-Math.cos(a)*r,c[1]+Math.sin(a)*r,q?'#6a6278':'#d8dce8',4);B.set(c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r,q?'#6a6278':'#d8dce8',4)}}}
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
 /* ひまなとき（moves.js の g_bored）：剣先で床を二度叩き（34F・44F）、肩越しに背後の門をふり返り、構え直す。光らない。
    資料集と同じく角度もそのまま補間する（近い回り道にすると、剣が床へ下りる向きが逆になる） */
 const BTAP={sw:2.2,fa:2.4,cr:1},BTAP2={sw:2.0,fa:2.3,cr:1.2},BLOOK={hd:-.35,lean:-.12,x:3};
 const BORED=[[0,{}],[20,BTAP,'io'],[34,BTAP2],[38,BTAP],[44,BTAP2],[48,BTAP],[70,BLOOK,'io'],[120,BLOOK],[128,{hd:.05,cr:.6},'io'],[150,{},'io'],[200,{}]].map(([t,p,e])=>({t,p:Object.assign({},BASE,p),e}));
 const BORED_LEN=200,BORED_TAPS=[34,44];
 function boredPose(d){let a=BORED[0],b=null;for(const k of BORED){if(k.t<=d)a=k;if(k.t>=d){b=k;break}}if(!b||b===a)return Object.assign({},a.p);
  const u=ease[b.e||'io'](cl01((d-a.t)/(b.t-a.t))),o={};for(const k of new Set([...Object.keys(a.p),...Object.keys(b.p)])){const A=a.p[k]??PDEF[k]??0,Bv=b.p[k]??PDEF[k]??0;o[k]=typeof A==='number'&&typeof Bv==='number'?A+(Bv-A)*u:(u<.5?A:Bv)}return o}
 /* 床を叩いた跡：剣先の下で左右へ広がる灰の点（光らせない。白は叩いた瞬間の1点だけ） */
 function tapFx(B,x,d){for(const s0 of BORED_TAPS){const q=d-s0;if(q<0||q>6)continue;B.set(x-q,H-1,'#c8c0b4',4);B.set(x+q,H-1,'#c8c0b4',4);if(q<2)B.set(x,H-2,'#ffffff',4)}}
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
  if(G.et<s.impact-SWING){const span=Math.max(1,Math.min(WIND,s.cue>s.start?s.cue-s.start:s.impact-SWING-s.start-2));/* 間が短い連撃は合図が前の撃の最中に来るので、振る前に止まる2Fを残して構えへ移る */return mixP(from,WU,ease.out(cl01((G.et-s.start)/span)))}
  const u=ease.in(cl01((G.et-(s.impact-SWING))/SWING));if(s.mv==='cut2')return u<.5?mixP(WU,M2,u*2):mixP(M2,SW,(u-.5)*2);
  return mixP(WU,SW,u)}

 /* パリィされ（knightKit）：小＝連撃の途中、前の剣だけがはね上がる／大＝最後の一撃、二本の剣がこじ開けられて体ごとのけぞる */
 const STOP=12;
 function pryTarget(kind,which){const posture=which===2?S2:S1;
  if(kind==='s'){const T={ua:posture.ua+.55,fa:posture.fa+1.2,sw:posture.sw+1.9};return Object.assign(T,{x:(posture.x||0)+3,lean:(posture.lean||0)-.2,hd:-.15})}
  const T={ua2:4.9,fa2:5.4,sw2:5.8,ua:5.0,fa:5.5,sw:5.9};if(which!==2)Object.assign(T,{ua:4.9,fa:5.4,sw:5.8,ua2:.6,fa2:.3,sw2:.1});
  return Object.assign(T,{x:(posture.x||0)+11,lean:-.4,hd:-.35,cr:1.5})}
 function pryW(r,d){if(d<0)return 0;if(d<STOP)return Math.min(1,(d+1)/4);const e=d-STOP;if(r.kind==='s')return 1-ease.s(cl01(e/6));return e<10?1:1-ease.s(cl01((e-10)/18))}
 /* やられ（g_hurt）：体ごと押されるが、交差はほどかない。二太刀目で腰が落ちる */
 const kb=(a,dur)=>a<0?0:a<4?Math.sin(a/4*Math.PI/2):Math.exp(-(a-4)/dur);

 /* 敵ごとの姿勢の覚え。G.anim は戦いごとに0に戻るので、時計が戻ったら覚えを捨てる（T107。前の戦いの姿勢で固まらないように） */
 const R0=()=>({key:'',from:null,at:0,dur:1,ez:'io',prev:null,rx:[],seen:new WeakSet(),hurt:[],lastHurt:0,memo:-1,posture:null,J:null,img:{},last:-1});
 function st(e){const R=e._rig||(e._rig=R0()),t=G.anim;if(t<R.last)Object.assign(R,R0());R.last=t;return R}
 /* 1フレームに1回だけ姿勢を進める（同じフレームで何度呼ばれても同じ結果） */
 function pose(e){const R=st(e),t=G.anim;if(R.memo===t&&R.posture)return R.posture;R.memo=t;
  let key,T;
  if(G.ko){key='ko';const k=G.t-6;T=k<10?(R.prev||IDLE(t)):mixP(R.koFrom||(R.koFrom=Object.assign({},R.prev||BASE)),KNEEL,ease.out(cl01((k-10)/24)))}
  else if(e.broken){key='brk';T=BRK(t)}
  else if(G.state==='enemy'&&G.strikes&&G.strikes.some(isMain)){key='atk';T=attackPose(t)}
  else if(G.bored&&G.state==='cmd'&&e===G.en){key='bored';T=boredPose(t-G.bored.at)}
  else{key='idle';T=IDLE(t)}
  if(key!=='ko')R.koFrom=null;
  if(key!==R.key){const old=R.key;R.key=key;R.from=R.prev;R.at=t;
   if(key==='brk'){R.dur=16;R.ez='s'}else if(old==='brk'){R.dur=5;R.ez='back'}else if(key==='idle'){R.dur=20;R.ez='io'}else{R.dur=6;R.ez='io'}}
  let posture=T;if(R.from&&t-R.at<R.dur&&key!=='ko'){const u=ease[R.ez](cl01((t-R.at)/R.dur));posture=mixP(R.from,T,u)}
  /* パリィされた撃を拾う（最後の撃なら大） */
  if(G.state==='enemy'&&G.strikes){const ss=G.strikes.filter(isMain),last=ss[ss.length-1];for(const s of ss){if(s.done&&s.res==='parry'&&!R.seen.has(s)){R.seen.add(s);const which=s.mv==='cut2'?2:1,kind=s===last?'b':'s';R.rx.push({at:t-Math.max(0,G.et-s.impact),kind,which,T:pryTarget(kind,which)})}}}
  R.rx=R.rx.filter(r=>t-r.at<STOP+60);
  for(const r of R.rx){const w=pryW(r,t-r.at);if(w>0)posture=mixP(posture,r.T,w)}
  /* 斬られた瞬間を拾う（30F以内の二太刀目は大きく） */
  if(e.hurt>0&&!R.lastHurt){const two=R.hurt.length&&t-R.hurt[R.hurt.length-1].at<30;R.hurt.push({at:t,two})}R.lastHurt=e.hurt;
  R.hurt=R.hurt.filter(h=>t-h.at<60);
  for(const h of R.hurt){const a=kb(t-h.at,h.two?9:6),o=h.two?{x:7,lean:-.3,hd:-.3,cr:2}:{x:4,lean:-.22,hd:-.25};posture=Object.assign({},posture);for(const k in o)posture[k]=(posture[k]||0)+o[k]*a}
  R.prev=posture;R.posture=posture;return posture}

 /* 交差に戻るときの「キン」：両手の間に小さな十字 */
 function kin(B,J,e){const c=[(J.hdF[0]+J.hdB[0])/2,(J.hdF[1]+J.hdB[1])/2-9];for(let i=-3+(e>>1);i<=3-(e>>1);i++){B.set(c[0]+i,c[1],'#c8ccd8',4);B.set(c[0],c[1]+i,'#c8ccd8',4)}}
 /* 骨組みを画素にし、ゲームの色の決まり（nCol：白い光・覚悟の色・ブレイクの色あせ）を通して、キャンバスにする */
 function render(e,v){const R=st(e),SH=e.kind==='shade',SM=e.kind==='samurai',posture=SH?shState(e):SM?smState(e):pose(e),t=G.anim,k=t+'|'+v+'|'+(e.tint||'');if(R.img.k===k)return R.img.c;
  /* 影は立ち絵・技（T093）・パリィされ・ブレイク・やられ（T008）。覚悟の段は影の色そのもので出すので、ゲームの段の色（nCol の tint）は重ねない */
  const B=new Buf(W,H),J=SH?shadeDraw(B,OX,H,e.key==='shadeM'?SHADE_M:SHADE,posture,t,e.tint):SM?smDraw(B,OX,H,e.key==='samuraiM'?SAMU_M:SAMU,posture,t,e.tint):knight(B,OX,H,GATE,posture,t);R.J=J;
  for(const r of R.rx){if(r.kind!=='b')continue;const d=t-r.at-(STOP+38);if(d>=0&&d<8)kin(B,J,d)}
  B.outline();
  if(!SH&&!SM&&R.key==='bored'&&G.bored&&J.tip)tapFx(B,Math.round(J.tip[0]),t-G.bored.at);
  if(SM&&R.chinD!=null)chinFx(B,J,R.chinD);
  if(SM&&R.downD!=null)smDownPost(B,J,R.downD);
  if(SM&&J.sc)for(const h of R.hurt){const c=[J.sc[0]-4,J.sc[1]+3];smOoze(B,h.two?[c[0]+1,c[1]-3]:c,t-h.at,h.two?7:6,h.two?[INK2[0],INK2[1],'#3a2a4a']:[INK2[0],INK2[1]])}
  const cv=document.createElement('canvas');cv.width=W;cv.height=H;const cx=cv.getContext('2d'),im=cx.createImageData(W,H),memo={};
  for(let i=0;i<B.c.length;i++){const c0=B.c[i];if(!c0)continue;const c=memo[c0]||(memo[c0]=B.t[i]===4?c0:nCol(c0,v,SH||SM?null:e.tint)),n=parseInt(c.slice(1),16);im.data[i*4]=n>>16&255;im.data[i*4+1]=n>>8&255;im.data[i*4+2]=n&255;im.data[i*4+3]=255}
  cx.putImageData(im,0,0);R.img={k,c:cv};return cv}
 /* 画面の座標：絵は足元のまん中を (x, y) に合わせて置かれる（drawEnemy と同じ） */
 const scr=(p,x,y)=>({x:Math.round(x-(W>>1)+p[0]),y:Math.round(y-H+p[1])});
 function tip(e,x,y){const R=st(e);if(!R.J)render(e,'n');const J=R.J,s=G.state==='enemy'&&G.strikes&&G.strikes.find(s=>!s.done&&isMain(s));const p=e.kind==='samurai'?(s&&s.mv==='ni2'&&J.tip?J.tip:eyeAt(J)):s&&s.mv==='cut2'&&J.tip2?J.tip2:J.tip;return scr(p,x,y)}
 /* ブレイクの印：主人公の色（うすい青）の小さな星を3つ、頭の上で回す（光らせない。金は打ち合いの合図の色なので使わない） */
 function brkStars(e,x,y){const R=st(e);if(!R.J)return;/* 影は床に伸びているので、星は床の少し上（sh_brk） */const c=scr(e.kind==='shade'?[R.J.hip[0],H-1]:R.J.head,x,y),HSL=['#dff2ff','#8ab8e0','#5a7ca8'];
  for(let i=0;i<3;i++){const a=G.anim*.09+i*TAU/3,sx=Math.round(c.x+Math.cos(a)*6),sy=Math.round(c.y-11+Math.sin(a)*1.8),back=Math.sin(a)<0;
   px(sx,sy,back?HSL[1]:HSL[0]);const cc=back?HSL[2]:HSL[1];px(sx+1,sy,cc);px(sx-1,sy,cc);px(sx,sy+1,cc);px(sx,sy-1,cc)}}
 /* 影の尾の続き：キャンバスの右の端から画面の外まで（かかとから床の線にも）。影は持ち主から離れられない */
 function tail(e,x,y){const R=st(e);if(!R.J)render(e,'n');const V=SHV[e.tint]||SHV.n,sc=e.sc||1,x0=Math.round(x+(W>>1)*sc),hx=Math.round(x+(R.J.footB[0]-OX)*sc),T=G.anim;
  for(let q=hx;q<LW+4;q++){if(q<hx+18||(q+T)%5)px(q,y,V.tail);if(q>=x0){px(q,y-1,V.tail);if(V.tailW>1&&(q*3+T)%7)px(q,y-2,V.tail)}}}
 /* どの敵を骨組みで描くか：作り直せた敵から順に ?new なしでも新しい絵にする（GAME_REQUESTS の「入れ方」）。影の組は T094、居合の組は T097 から常に、門番はまだ ?new のときだけ */
 const on=e=>!!e&&(e.kind==='shade'||e.kind==='samurai'||(typeof NEWDRAW!=='undefined'&&NEWDRAW&&e.key==='samuraiB'));
 /* own：パリィされ・やられまで骨組みで出す敵（ゲームの押し下がりを重ねない）。act：技の動きを骨組みで出す敵（ゲームの予備動作の伸び縮みを重ねない） */
 /* 影ののびる斬りの当たり（SHS）で、剣先が足元のまん中からどれだけ前に出るか（画素、前が負）。ゲームの寄せ（lungeDist）を、剣先が主人公に届く長さにするのに使う */
 const RCH={};function reach(e){const k=e.key==='shadeM'?'M':'n';if(RCH[k]==null){const B=new Buf(W,H),J=shadeDraw(B,OX,H,k==='M'?SHADE_M:SHADE,Object.assign({},SHBASE,SHS),0,null);RCH[k]=J.tip[0]-OX}return RCH[k]}
 const bored=e=>!on(e)?null:e.key==='samuraiB'?{len:BORED_LEN,taps:BORED_TAPS}:e.kind==='shade'?{len:e.key==='shadeM'?180:160,taps:[]}:e.kind==='samurai'?{len:e.key==='samuraiM'?190:170,taps:[]}:null;
 const enter=e=>!on(e)?0:e.kind==='shade'?SH_ENTER_LEN:e.kind==='samurai'?SM_ENTER_LEN:0,dx=e=>on(e)&&(e.kind==='shade'||e.kind==='samurai')?Math.round(st(e).sdx||0):0;
 return{on,reach,bored,enter,dx,down:downOf,koFx,own:e=>on(e)&&(e.key==='samuraiB'||e.kind==='shade'||e.kind==='samurai'),act:e=>on(e)&&(e.key==='samuraiB'||e.kind==='shade'||e.kind==='samurai'),img:render,tip,brkStars,tail}})();
