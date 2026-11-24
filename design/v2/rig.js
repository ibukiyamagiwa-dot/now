/* ===== 騎士の骨組み =====
   P（姿勢）：角度は画面の向き。0＝右、π/2＝下、π＝左（敵から見て騎士の方）、-π/2＝上。
   すべての門の番人は左を向いて立つ。 */
const PDEF={x:0,lean:0,cr:0,ff:-6,fb:5,kn:0,ua:1.95,fa:2.75,sw:3.4,ua2:1.75,fa2:1.9,sw2:null,hd:0,cw:0,lift:0,sheath:0,capeOff:0,oh:0};
const PRO={hk:1.45,lk:.74,tk:.86};
function joints(ox,oy,S,P){const k=S.k,lk=S.lk||PRO.lk,tk=S.tk||PRO.tk,hk=S.hk||PRO.hk;
 const cr=P.cr+P.kn*9*k*lk,hip=[ox+P.x*k,oy-20*k*lk+cr-P.lift*k];
 const sc=add(hip,rot([0,-14*k*tk],-P.lean)),neck=add(sc,rot([0,-2*k],-P.lean)),head=add(neck,rot([0,-5*k*hk],-P.lean-P.hd));
 const shF=add(sc,rot([-3.5*k,-.5*k],-P.lean)),shB=add(sc,rot([4*k,-.5*k],-P.lean));
 const elF=add(shF,dir(P.ua,7*k)),hdF=add(elF,dir(P.fa,6.5*k)),elB=add(shB,dir(P.ua2,7*k)),hdB=add(elB,dir(P.fa2,6.5*k));
 let footF=[hip[0]+P.ff*k,oy-P.lift*k],footB=[hip[0]+P.fb*k,oy-P.lift*k],kneeF,kneeB;
 const hpF=add(hip,[-2*k,0]),hpB=add(hip,[2*k,0]);
 if(P.kn>0){kneeB=[lerp(ik(hpB,footB,10*k*lk,10*k*lk,1)[0],hip[0]+3*k,P.kn),lerp(ik(hpB,footB,10*k*lk,10*k*lk,1)[1],oy-1.5*k,P.kn)];footB=[lerp(footB[0],kneeB[0]+9*k,P.kn),oy];kneeF=ik(hpF,footF,10*k*lk,10*k*lk,1)}
 else{kneeF=ik(hpF,footF,10*k*lk,10*k*lk,1);kneeB=ik(hpB,footB,10*k*lk,10*k*lk,1)}
 return{k,lk,hip,sc,neck,head,shF,shB,elF,hdF,elB,hdB,footF,footB,kneeF,kneeB,hpF,hpB,lean:P.lean}}
function C(S,n){return S.pal[n]}
function drawLeg(B,S,H,K,F,front){const k=S.k,p=S.pal,d=front?0:1;
 const U=p.under||p.armLo,UH=p.underHi||p.arm,UL=p.underLo||OUT;B.thick(H,K,2.2*k,d?UL:U,d?U:UH,UL);B.thick(K,F,1.8*k,d?UL:U,d?U:UH,UL);
 const sh=[lerp(K[0],F[0],.15),lerp(K[1],F[1],.15)],sf=[lerp(K[0],F[0],.8),lerp(K[1],F[1],.8)];B.thick(sh,sf,2*k,d?p.armLo:p.arm,d?p.arm:p.armHi,p.armLo);
 B.disc(K[0],K[1],1.9*k,d?p.arm:p.armHi,p.armHi,p.armLo);
 B.poly([[F[0]-5*k,F[1]],[F[0]+2.5*k,F[1]],[F[0]+2.5*k,F[1]-3.5*k],[F[0]-1.5*k,F[1]-4*k]],p.foot||p.trim,p.footHi||p.trimHi,p.trimLo)}
function drawTorso(B,S,J,P){const k=S.k,p=S.pal,L=-J.lean,h=J.hip,R=v=>add(h,rot([v[0],v[1]*(v[1]<0?(S.tk||PRO.tk):1)],L));
 /* 前垂れ（布）：所属と身分を示す布。色と紋章で誰の家来かが分かる */
 if(S.tabard&&!S.tabardFront){const t=S.tabard;B.poly([R([-4*k,-1*k]),R([4*k,-1*k]),R([3.5*k,t.len*k]),R([0,(t.len+1.5)*k]),R([-3.5*k,t.len*k])],t.col,t.hi,t.lo);if(t.mark)t.mark(B,R,k)}
 /* 草摺（腰の板）：太ももを覆う板。動くと揺れる */
 B.poly([R([-5*k,-2*k]),R([5*k,-2*k]),R([6*k,4*k]),R([1*k,5*k]),R([-1*k,5*k]),R([-6*k,4*k])],p.armLo,p.arm,p.armLo);
 B.poly([R([-4*k,0]),R([4*k,0]),R([4.5*k,-6*k]),R([-4.5*k,-6*k])],p.under||p.armLo,p.underHi||p.arm,p.underLo||OUT);
 B.poly([R([-3*k,-5*k]),R([3*k,-5*k]),R([7*k,-11*k]),R([6*k,-15*k]),R([-6*k,-15*k]),R([-7*k,-11*k])],p.arm,p.armHi,p.armLo);
 B.poly([R([-2.5*k,-6*k]),R([2.5*k,-6*k]),R([5.5*k,-12*k]),R([-5.5*k,-12*k])],p.chest||p.arm,p.armHi,p.armLo);
 B.poly([R([-4.5*k,-1*k]),R([4.5*k,-1*k]),R([4.5*k,-2.6*k]),R([-4.5*k,-2.6*k])],p.trim,p.trimHi,p.trimLo);
 if(S.chest&&!S.tabardFront)S.chest(B,R,k,P)}
function drawHead(B,S,J,P,T){const k=S.k*(S.hk||PRO.hk),p=S.pal,a=-J.lean-P.hd,R=v=>add(J.head,rot(v,a));
 const hm=S.helm;
 if(hm.type==='kettle'){B.poly([R([-4*k,-1*k]),R([4*k,-1*k]),R([4*k,4*k]),R([-4*k,4*k])],p.armLo,p.arm,p.armLo);B.poly([R([-7*k,-1*k]),R([7*k,-1*k]),R([6*k,-3*k]),R([-6*k,-3*k])],p.trim,p.trimHi,p.trimLo);B.disc(...R([0,-4*k]),4.3*k,p.arm,p.armHi,p.armLo);
  B.set(...R([-2.5*k,1.5*k]),p.eye,1);B.set(...R([-1.5*k,1.5*k]),p.eye,1);B.line(...R([-4*k,0]),...R([-4*k,3*k]),p.armLo)}
 else if(hm.type==='horned'){
  /* 角：門のアーチの形。門そのものを頭に戴いている */
  for(const s of [-1,1])horn(B,R,k,s,hm.hs||1,hm)
  B.poly([R([-5*k,4*k]),R([5*k,4*k]),R([5.5*k,-4*k]),R([3*k,-7*k]),R([-3*k,-7*k]),R([-5.5*k,-4*k])],p.arm,p.armHi,p.armLo);
  B.poly([R([-4.5*k,-6.5*k]),R([-3*k,-9.5*k]),R([-1.5*k,-6.5*k]),R([0,-10*k]),R([1.5*k,-6.5*k]),R([3*k,-9.5*k]),R([4.5*k,-6.5*k])],p.trim,p.trimHi,p.trimLo);
  B.poly([R([-5*k,-1*k]),R([2*k,-1*k]),R([2*k,.5*k]),R([-5*k,.5*k])],OUT,null,null);for(let i=0;i<3;i++)B.set(...R([(-4+i*1.2)*k,-.3*k]),p.eye,2)}
 else if(hm.type==='crest'){
  /* 赤い騎士：飾りのない兜と、後ろへ流れる一本の羽根飾り。装飾を足さないことが強さの表現 */
  if(hm.plume){const w=Math.sin(T*.08)*1.5;B.tube(R([1*k,-6*k]),R([9*k,-9*k+w]),R([15*k,-3*k+w*1.5]),2.2*k,.8*k,hm.plume,hm.plumeHi,hm.plumeLo)}
  B.poly([R([-4*k,4*k]),R([3.5*k,4.5*k]),R([4.5*k,-2.5*k]),R([2*k,-5.5*k]),R([-2*k,-5.5*k]),R([-4.5*k,-2.5*k])],p.arm,p.armHi,p.armLo);
  B.poly([R([-5*k,-.5*k]),R([1*k,-.5*k]),R([1*k,.8*k]),R([-5*k,.8*k])],OUT,null,null);B.poly([R([-3*k,.8*k]),R([-2*k,.8*k]),R([-2*k,3.5*k]),R([-3*k,3.5*k])],OUT,null,null);
  for(let i=0;i<2;i++)B.set(...R([(-4+i)*k,0]),p.eye,2)}
 if(hm.type==='bucket'||hm.type==='bhorn'){
  if(hm.type==='bhorn')for(const sd of (hm.sides||[-1,1])){const pts=[];for(let i=0;i<=10;i++){const t=i/10,a=t*Math.PI*.95;pts.push(R([sd*(3+Math.sin(a)*4.5)*k,(-5-(1-Math.cos(a))*4.2)*k]))}for(let i=0;i<10;i++)B.thick(pts[i],pts[i+1],(1.5-i*.08)*k,hm.horn,hm.hornHi,hm.hornLo);if(hm.rings)for(const i of[2,5]){B.set(...pts[i],hm.rings,2);B.set(pts[i][0]+1,pts[i][1],hm.rings,2)}
   const lp=R([sd*7.3*k,-8.5*k]);B.line(lp[0],lp[1],lp[0],lp[1]+2*k,'#5e566e');B.disc(lp[0],lp[1]+3*k,1.1*k,'#8a6a2a','#b8902a','#4a3414')}
  if(hm.plume){const w=Math.sin(T*.08)*1.2;for(let i=0;i<6;i++){const t=i/5;B.disc(...R([(.5+t*8)*k,(-5.4-1.2+t*t*5+w*t)*k]),(1.5-t*.6)*k,hm.plume,hm.plumeHi,hm.plumeLo)}}
  /* 筒形の兜：門番の兜は、ぬしの兜をまねた形（主従の印） */
  B.poly([R([-4.3*k,4.2*k]),R([4.3*k,4.2*k]),R([4.3*k,-4.2*k]),R([3.6*k,-4.8*k]),R([-3.6*k,-4.8*k]),R([-4.3*k,-4.2*k])],p.arm,p.armHi,p.armLo);
  const bd=hm.band||[p.trim,p.trimHi];for(let x=-4;x<=4;x+=.5)B.set(...R([x*k,-3.4*k]),bd[0],2);for(let x=-3.5;x<=3.5;x+=1.4)B.set(...R([x*k,-3.4*k]),bd[1],2);
  const ec=P.eyeOff?(P.eyeOff>=1?OUT:mix(hm.glow||OUT,OUT,P.eyeOff)):(hm.glow||OUT);
  if(hm.slant){/* 赤い騎士：太く黒い切れ込みが鼻先へ下がる（怒った眉の向き＝力み）。その奥に金の目が一つだけ光る。縦の線は目の下から */const sl=hm.slant,Y=x=>-.3-(x+1.8)*sl;for(let x=-4.4;x<=.8;x+=.3){B.set(...R([x*k,Y(x)*k]),OUT,2);B.set(...R([x*k,(Y(x)-.7)*k]),OUT,2)}for(let x=-3.7;x<=-2.3;x+=.3)B.set(...R([x*k,Y(x)*k]),x>-3.3&&x<-2.7?(hm.glowHi||ec):ec,2);for(let y=1;y<=2.6;y+=.5)B.set(...R([-1.6*k,y*k]),OUT,2)}
  else{for(let x=-4.2;x<=1.2;x+=.5)B.set(...R([x*k,-.4*k]),ec,2);for(let y=-2;y<=2.6;y+=.5)B.set(...R([-1.6*k,y*k]),OUT,2)}
  if(!hm.slant)for(let i=0;i<3;i++)for(let j=0;j<2;j++)B.set(...R([(1.2+j*1.2)*k,(1.6+i*.9)*k]),OUT,2);
  for(const d of (hm.dents||[]))for(let i=0;i<3;i++)B.set(...R([(d[0]+i*.4)*k,(d[1]+(i===1?.4:0))*k]),p.armLo,2);
  if(hm.cracks)for(const c of hm.cracks)B.set(...R([c[0]*k,c[1]*k]),hm.crackCol||'#4e2c70',2)}
 if(hm.type==='round'){
  /* 主人公：丸い兜。顔は見せない＝だれでもこの騎士になれる。羽根飾りは前へ進む者の印 */
  const w=Math.sin(T*.08)*1,pk=hm.pk||1,pn=hm.pn||5;for(let i=0;i<pn;i++){const t=i/(pn-1);B.disc(...R([(1+t*7*pk)*k,(-5.5-(pk-1)*2+t*t*4*pk+w*t)*k]),(1.6-t*.6)*pk*k,hm.plume,hm.plumeHi,hm.plumeLo)}
  if(hm.ridge)for(let y=-5;y<=-1;y+=.5)B.set(...R([-1.4*k,y*k]),hm.ridge,2);
  B.poly([R([-3.2*k,3.8*k]),R([3.6*k,3.8*k]),R([4.2*k,-1*k]),R([3*k,-4*k]),R([0,-5.4*k]),R([-3*k,-4*k]),R([-4.2*k,-1*k])],p.arm,p.armHi,p.armLo);
  for(let x=-4;x<=.6;x+=.5)B.set(...R([x*k,-.3*k]),OUT,2);for(let x=-3.6;x<=.4;x+=.5)B.set(...R([x*k,.2*k]),p.armLo,2);
  for(let y=-5;y<=-1;y+=.5)B.set(...R([-1.4*k,y*k]),p.armHi,2);for(let i=0;i<3;i++)B.set(...R([(-2.6+i*1)*k,2*k]),OUT,2)}
 if(hm.type==='crest'&&hm.detail){for(let y=-6;y<=-1.5;y+=.5)B.set(...R([-1.2*k,y*k]),p.armHi,2);for(const r of[[3,-3],[3,0],[3,3]])B.set(...R([r[0]*k,r[1]*k]),p.trimHi,2)}
 if(hm.extra&&!(P.eyeOff>0&&hm.eyeExtra))hm.extra(B,R,k,T,P)}
function drawArm(B,S,sh,el,hd,front){const k=S.k,p=S.pal;const U=p.under||p.armLo,UH=p.underHi||p.arm,UL=p.underLo||OUT;B.thick(sh,el,1.7*k,front?U:UL,front?UH:U,UL);B.thick([lerp(el[0],hd[0],.1),lerp(el[1],hd[1],.1)],[lerp(el[0],hd[0],.75),lerp(el[1],hd[1],.75)],1.9*k,front?p.arm:p.armLo,front?p.armHi:p.arm,p.armLo);B.disc(hd[0],hd[1],1.9*k,p.glove||p.armLo,p.arm,OUT);B.poly([[sh[0]-4*k,sh[1]+2*k],[sh[0]-3.5*k,sh[1]-2.5*k],[sh[0],sh[1]-3.5*k],[sh[0]+3.5*k,sh[1]-2.5*k],[sh[0]+4*k,sh[1]+2*k],[sh[0],sh[1]+3*k]],front?p.arm:p.armLo,front?p.armHi:p.arm,p.armLo)}
function drawBlade(B,S,hd,ang,W,front){const k=S.k,len=W.len*k,wd=(W.w||1.4)*k,u=dir(ang,1),n=[-u[1],u[0]],P=(a,b)=>[hd[0]+u[0]*a+n[0]*b,hd[1]+u[1]*a+n[1]*b];
 B.thick(P(-3*k,0),P(-1*k,0),1.1*k,W.grip||'#3a2420',W.grip||'#5a3a30',OUT);B.disc(...P(-3.6*k,0),1.3*k,W.pom||W.guard,W.guard,OUT);if(W.ring){B.disc(...P(-5.6*k,0),1.9*k,W.ring,W.ringHi||W.ring,OUT);B.disc(...P(-5.6*k,0),.8*k,OUT,null,null)}
 if(W.type==='key'){
  /* 鍵の大剣：門を閉じる鍵そのもの。歯の形が刃先に残る */
  B.poly([P(1*k,-wd*1.4),P(len*.86,-wd*1.1),P(len,0),P(len*.86,wd*1.1),P(1*k,wd*1.4)],W.col,W.hi,W.lo);
  for(let i=0;i<3;i++){const a=len*(.55+i*.1);B.poly([P(a,wd*1.1),P(a+2*k,wd*1.1),P(a+2*k,wd*2.6),P(a,wd*2.6)],W.col,W.hi,W.lo)}
  B.disc(...P(-5.5*k,0),2.6*k,W.guard,W.guardHi,OUT);B.disc(...P(-5.5*k,0),1.2*k,OUT,null,null)}
 else{/* 刃は必ず黒で縁どる：パリィのゲームでは刃の位置が一番大事な情報 */B.poly([P(0,-wd-1),P(len*.9,-wd*.8-1),P(len+1.5,0),P(len*.9,wd*.8+1),P(0,wd+1)],OUT,null,null,1);B.poly([P(1*k,-wd),P(len*.9,-wd*.8),P(len,0),P(len*.9,wd*.8),P(1*k,wd)],W.col,W.hi,W.lo)}
 B.thick(P(.5*k,-(W.gw||3)*k),P(.5*k,(W.gw||3)*k),.9*k,W.guard,W.guardHi||W.guard,OUT);
 return P(len,0)}
function drawCape(B,S,J,P,T){const c=S.cape;if(!c||P.capeOff>=1)return;const k=S.k,w=Math.sin(T*.07+(c.ph||0))*1.6+P.cw,L=c.len*k*(S.lk||PRO.lk),h=J.hip;
 const cw=c.wide||1,a=add(J.shB,[3.5*k*cw,1*k]),b=[h[0]+(11*cw+w)*k,h[1]+L*.5],d=[h[0]+(9*cw+w*1.3)*k,h[1]+L],e=[h[0]+2*k,h[1]+L*.92];
 const pts=[J.neck,J.shB,a,b];const n=c.tatter||0;if(n){for(let i=0;i<=n;i++){const t=i/n,x=lerp(b[0]+2*k,e[0],t),y=lerp(d[1],e[1],t)+((i%2)?-3*k:0);pts.push([x,y])}}else pts.push(d,e);pts.push(add(h,[2*k,-2*k]));
 B.poly(pts,c.col,c.hi,c.lo);if(c.extra)c.extra(B,J,T,{b,d,e,w})}
function drawTabardFront(B,S,J,P){const k=S.k,L=-J.lean,h=J.hip,R=v=>add(h,rot([v[0],v[1]*(v[1]<0?(S.tk||PRO.tk):1)],L));
 if(S.tabard&&S.tabardFront){const t=S.tabard,tw=t.w||4.5;B.poly([R([-tw*k,-12*k]),R([tw*k,-12*k]),R([(tw-.5)*k,t.len*k]),R([0,(t.len+1.5)*k]),R([-(tw-.5)*k,t.len*k])],t.col,t.hi,t.lo);
  if(t.edge){for(let y=-12;y<=t.len;y+=.5){B.set(...R([-(tw-.2-(y+12)/(t.len+12)*.5)*k,y*k]),t.edge,2);B.set(...R([(tw-.2-(y+12)/(t.len+12)*.5)*k,y*k]),t.edge,2)}for(let x=-(tw-.5);x<=tw-.5;x+=.5)B.set(...R([x*k,(t.len+1.5-Math.abs(x)/(tw-.5)*1.5)*k]),t.edge,2)}
  if(t.mark)t.mark(B,v=>R([v[0],v[1]-7*k]),k*1.2);if(t.over)t.over(B,R,k)}
 if(S.chest)S.chest(B,R,k,P)}
function knight(B,ox,oy,S,P0,T){const P=Object.assign({},PDEF,S.pose||{},P0||{}),J=joints(ox,oy,S,P);J.P=P;P.T=T;
 if(S.behind)S.behind(B,J,T,P);
 drawCape(B,S,J,P,T);
 if(S.tentB)tentacle(B,J.shB,add(J.elB,[2*S.k,-2*S.k]),J.hdB,2*S.k,.7*S.k,true);else drawArm(B,S,J.shB,J.elB,J.hdB,false);if(S.w2&&P.sw2!=null&&!S.w2front)J.tip2=drawBlade(B,S,J.hdB,P.sw2,S.w2,false);
 drawLeg(B,S,J.hpB,J.kneeB,J.footB,false);
 if(S.sheath)S.sheath(B,J,T,P);
 drawTorso(B,S,J,P);drawLeg(B,S,J.hpF,J.kneeF,J.footF,true);if(S.tabard&&S.tabardFront)drawTabardFront(B,S,J,P);if(S.chestFront)S.chestFront(B,J,P);
 drawHead(B,S,J,P,T);
 if(S.w2&&P.sw2!=null&&S.w2front)J.tip2=drawBlade(B,S,J.hdB,P.sw2,S.w2,false);
 if(S.mid)S.mid(B,J,T,P);
 if(S.w&&P.sw!=null)J.tip=drawBlade(B,S,J.hdF,P.sw,S.w,true);
 drawArm(B,S,J.shF,J.elF,J.hdF,true);
 if(S.front)S.front(B,J,T,P);
 return J}

/* 角：門のアーチの形。根元から外へ張り出し、先が内へ戻る */
function horn(B,R,k,s,hs,hm){const b=R([s*3.5*k,-5*k]),m=R([s*(7+hs*2.5)*k,-(9+hs*3)*k]),e=R([s*(3.5+hs)*k,-(15+hs*5)*k]);B.tube(b,m,e,2.2*k,.6*k,hm.horn||'#2a2434',hm.hornHi||'#6e6680',hm.hornLo||'#120e18');if(hm.hornTip)B.set(...e.map(Math.round),hm.hornTip,2)}

/* くらやみのオーラ：暗い背景に溶けないよう、体のまわりに紫のにじみと、背中側のふちに光を置く */
/* くらやみのまとう気配（竜・三つ首）：切り抜いたような縁取りをやめ、体にくっついた煙にする。
   ちらつかない（模様は場所で決まり、時間で入れかわらない）。背の上から細い煙がゆっくり立ちのぼり、足元は床に黒くにじむ。
   k（0〜1）で濃さを変え、たおれるときは少しずつ薄れて消える（ぱっと消えない）。 */
function auraSmoke(B,A,T,k){const W=B.w,H=B.h,isB=i=>{const t=B.t[i];return t===1||t===2||t===3};const hs=(x,y)=>{const s=Math.sin(x*127.1+y*311.7)*43758.5453;return s-Math.floor(s)};if(k<=0)return;
 const top=[],foot=new Set();for(let i=0;i<W*H;i++){if(!isB(i))continue;const x=i%W,y=i/W|0;if(y>0&&!isB(i-W))top.push([x,y]);if(y>=FL-3)foot.add(x)}
 /* 縁のすぐ外：上半分だけ、うすく。場所で決まる点描 */for(const[x,y]of top){if(y>FL-10)continue;const h=hs(x,y);if(h<.55*k&&B.t[(y-1)*W+x]===0)B.set(x,y-1,A.c1,9)}
 /* 立ちのぼる煙：背の上の決まった場所から、4Fに1ドットの速さでゆっくり上がり、上ほど途切れて消える */for(const[x,y]of top){const h=hs(x*3,y*7);if(h>.1*k||y>FL-12)continue;const ph=h*97,L=14;const o=((T*.25+ph)%L);const yy=y-2-o,xx=x+Math.round(Math.sin((T+ph*10)*.05)*1.2);const fade=o/L;if(hs(xx,Math.round(yy))<1-fade*1.1&&yy>2)B.set(xx,yy,fade<.4?A.c1:A.c2,9)}
 /* 足元のにじみ */for(const x of foot)for(const dx of[-2,-1,0,1,2]){const xx=x+dx;if(xx<0||xx>=W)continue;if(hs(xx,FL+1)<.8*k)B.set(xx,FL+1,A.c1,9);if(Math.abs(dx)<2&&hs(xx,FL+2)<.5*k)B.set(xx,FL+2,A.c2,9)}
 /* 背中側のふちの光（体の内側に描くので浮かない） */for(let i=0;i<W*H;i++){if(B.t[i]!==3)continue;const x=i%W,y=i/W|0;const rr=B.tag(x+1,y),u=B.tag(x,y-1);if(hs(x,y)>k)continue;if((rr!==1&&rr!==2&&rr!==3)&&(u!==1&&u!==2&&u!==3)&&B.tag(x-1,y)===1)B.set(x,y,A.rim,3);else if(rr!==1&&rr!==3&&B.tag(x-1,y)===1&&(x+y)%2)B.set(x,y,A.rim,3)}}
function aura(B,A,T){const W=B.w,H=B.h,d=new Int8Array(W*H).fill(-1),q=[];for(let i=0;i<W*H;i++){const t=B.t[i];if(t===1||t===2||t===3){d[i]=0;q.push(i)}}
 for(let h=0;h<q.length;h++){const i=q[h];if(d[i]>=A.r)continue;const x=i%W,y=i/W|0;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H)continue;const j=ny*W+nx;if(d[j]<0){d[j]=d[i]+1;q.push(j)}}}
 for(let i=0;i<W*H;i++){if(d[i]<=0)continue;const x=i%W,y=i/W|0,t=B.t[i];if(t===1||t===2||t===4)continue;const n=d[i],fl=((x*7+y*13+(T>>2))%11);
  if(n===1&&(x+y)%2===0)B.set(x,y,A.c1,9);else if(n===2&&(x+y)%3===0&&fl>2)B.set(x,y,A.c2,9);else if(n>=3&&fl===0&&y<B.h-8)B.set(x,y-((T>>3)%2),A.c2,9)}
 /* 背中側（右と上）のふちに、紫の光 */for(let i=0;i<W*H;i++){if(B.t[i]!==3)continue;const x=i%W,y=i/W|0;const r=B.tag(x+1,y),u=B.tag(x,y-1);if((r!==1&&r!==2&&r!==3)&&(u!==1&&u!==2&&u!==3)&&B.tag(x-1,y)===1)B.set(x,y,A.rim,3);else if(r!==1&&r!==3&&B.tag(x-1,y)===1&&(x+y)%2)B.set(x,y,A.rim,3)}}
