/* ===== からくり人形・大からくり人形（中ボスとモブの五組目） =====
   門番が黒い門番になったあと、ぬしが代わりに作らせた、木と真鍮の人形（門のために作られたもの）。中身は空っぽで、歯車しかない。
   見た目の決まり：
   - 顔は門番の筒形の兜をまねた木の面。目の切れ込みは彫ってあるだけで、奥には何もない。切れ込みは途中で一段ずれている（まねきれていない）。
   - 背中にぜんまいの鍵。柄はぬしの鍵と同じ輪の形（門の系統）。拍ごとにカチッと四分の一ずつ回る＝鍵の回る速さが拍の速さ。
   - 胸にランプ四つ。消えていると暗い琥珀、灯るとくすんだ橙。数えるための目盛りで、合図ではない（光らせない。合図の白・赤・紫・金と分ける）。
   - 腹は空洞で、歯車がのぞく。関節は真鍮の球。
   - 大からくり人形（1.25倍）：腕の先の刃が二本。門番と同じ「交差した剣＝閉じた門」をまねる。
   - いちばん大事な原則（構えで数が分かる）：一回＝片腕の刃を頭上に掲げる／2回続ける＝二本の刃を頭上で交差／数え直し＝首をかしげたまま止まり、片腕がだらりと垂れる（鍵の逆回りは念押し）。
   - 攻撃の刃は光らない。キリッ（音）のあと、ランプが拍ごとに一つずつ灯り、四つ灯った次の拍で斬る。 */
const DLV={
 n:{lbl:'覚悟1 ふつう',name:'からくり人形',wood:['#4a3020','#7a5434','#a07448','#c09060'],mask:['#5e4228','#9a7a52','#c4a272'],stain:0,eyes:0},
 r:{lbl:'覚悟2 赤い',name:'赤いからくり人形',wood:['#4a2a1e','#7a4632','#9a6044','#b47a58'],mask:['#5e3a28','#94664c','#b88a66'],stain:1,eyes:0},
 k:{lbl:'覚悟3 黒い',name:'黒いからくり人形',wood:['#1e1614','#3a2c24','#544034','#6a5444'],mask:['#2a201a','#4e3e30','#6a5644'],stain:2,eyes:1},
 v:{lbl:'覚悟4 紫の',name:'紫のからくり人形',wood:['#1e1624','#3a2c44','#544060','#6a5478'],mask:['#2a2032','#4e3e5a','#6a5678'],stain:2,eyes:3}};
const DLBR=['#4e3c18','#806428','#a88a40'],DLHOLE='#1a100c',DLLAMP=['#3a2418','#b8642c','#d88a48'],DLSTEEL=['#6a7084','#b4b8c4','#dcdfe6'],DLEYE='#7a3a50',DLMUD=['#140c18','#22142e','#3a2048'];
Object.assign(PDEF,{dlLamp:0,dlKey:null,dlFace:0,dlSpin:0,dlApart:0,dlGear:1});
const sub_=(a,b)=>[a[0]-b[0],a[1]-b[1]];
/* 刃：腕の先に直にはめこんだ刃。刃は前腕の続き（手首で折れない）。パリィのゲームでは刃の位置が一番大事なので、必ず黒で縁どる */
function dlBlade(B,hd,ang,len,k){const u=dir(ang,1),n=[-u[1],u[0]],Pt=(a,b)=>[hd[0]+u[0]*a+n[0]*b,hd[1]+u[1]*a+n[1]*b],w=1.1*k;
 B.poly([Pt(0,-w-1),Pt(len*.88,-w*.8-1),Pt(len+1.5,0),Pt(len*.88,w*.8+1),Pt(0,w+1)],OUT,null,null,1);B.poly([Pt(.5*k,-w),Pt(len*.88,-w*.8),Pt(len,0),Pt(len*.88,w*.8),Pt(.5*k,w)],DLSTEEL[1],DLSTEEL[2],DLSTEEL[0]);
 B.thick(Pt(-.6*k,-1.6*k),Pt(-.6*k,1.6*k),.8*k,DLBR[1],DLBR[2],DLBR[0]);/* 手首の真鍮の受け金 */
 return Pt(len,0)}
const dlJoint=(B,p,r,front)=>{B.disc(p[0],p[1],r,front?DLBR[1]:DLBR[0],front?DLBR[2]:DLBR[1],DLBR[0])};
function dlLimb(B,a,b,r,W,front){B.thick(lerpP(a,b,.12),lerpP(a,b,.88),r,front?W[1]:W[0],front?W[2]:W[1],W[0])}
function dlFoot(B,ft,k,W,front){B.poly([[ft[0]-4.6*k,ft[1]],[ft[0]+2*k,ft[1]],[ft[0]+2*k,ft[1]-2.6*k],[ft[0]-3.4*k,ft[1]-2.6*k]],front?W[1]:W[0],front?W[2]:W[1],W[0])}
/* ぜんまいの鍵：背中から真鍮の軸がのび、先に輪（ぬしの鍵の柄と同じ輪）。輪は軸のまわりを回るので、回るにつれて縦につぶれて見える */
function dlKeyDraw(B,T0,k,ph){const a=T0([5*k,-12.6*k]),b=T0([7.6*k,-13*k]);B.thick(a,b,.7*k,DLBR[1],DLBR[2],DLBR[0]);B.disc(b[0],b[1],1*k,DLBR[1],DLBR[2],DLBR[0]);
 const c=T0([9.9*k,-13.4*k]),u=sub_(b,a),L=Math.hypot(u[0],u[1])||1,ax=[u[0]/L,u[1]/L],up=[ax[1],-ax[0]],r=2.2*k,cs=Math.cos(ph),pts=[];
 for(let i=0;i<=24;i++){const t=i/24*TAU_,x=Math.cos(t)*r,y=Math.sin(t)*r*cs;pts.push([c[0]+ax[0]*x+up[0]*y,c[1]+ax[1]*x+up[1]*y])}
 for(let i=0;i<24;i++)B.thick(pts[i],pts[i+1],.6*k,DLBR[1],DLBR[2],DLBR[0]);
 /* 輪の片側だけ明るい：回る向きが見えるように */const s=Math.sin(ph)>0?1:-1;B.set(c[0]+up[0]*r*cs,c[1]+up[1]*r*cs,s>0?DLBR[2]:DLBR[0],1)}
/* 木の面：門番の筒形の兜をまねた形。目の切れ込みは彫っただけで奥は空っぽ。切れ込みは途中で一段ずれる（まねきれていない） */
function dlMask(B,H,V,face){const M=V.mask,F=x=>lerp(x,-x,face);
 B.poly([H([-4.3,4.2]),H([4.3,4.2]),H([4.3,-4.2]),H([3.6,-4.8]),H([-3.6,-4.8]),H([-4.3,-4.2])],M[1],M[2],M[0]);
 /* 門番の兜の金の帯のまね：くすんだ真鍮を塗っただけ。ところどころはげている */for(let x=-4;x<=4;x+=.5){if(hsh(Math.round(x*2),5)<.25)continue;B.set(...H([x,-3.4]),DLBR[1],2)}
 for(let x=-4.2;x<=1.2;x+=.5)B.set(...H([F(x),x<-1.6?-.4:.1]),OUT,2);for(let y=-2;y<=2.6;y+=.5)B.set(...H([F(-1.6),y]),OUT,2);
 /* 木の合わせ目（二枚を張り合わせた面） */for(let y=-4;y<=3.6;y+=.5)B.set(...H([F(2.8),y]),M[0],2);
 /* 覚悟の段：空っぽのはずの切れ込みの奥に、光らない目が開く */
 if(V.eyes>=1&&face<.5){const E=V.eyes>=3?[-3.4,-2.4,-.6]:[-2.6];for(const x of E)B.set(...H([x,x<-1.6?-.4:.1]),DLEYE,2)}}
/* 胴：骨盤の箱・空洞の腹（歯車）・胸の箱（ランプ四つ）。T0＝胴の座標（腰が原点）を画面へ */
function dlTorso(B,T0,k,W,P,T,big){const tk=PRO.tk,Q=v=>T0([v[0],v[1]*(v[1]<0?tk:1)]);
 B.poly([Q([-3*k,-1*k]),Q([3*k,-1*k]),Q([3*k,-6.4*k]),Q([-3*k,-6.4*k])],DLHOLE,DLHOLE,DLHOLE);/* 空洞の腹 */
 B.thick(Q([.6*k,-.5*k]),Q([.6*k,-6.5*k]),.55*k,DLBR[0],DLBR[1],DLBR[0]);/* 背骨の真鍮の軸 */
 const g=Q([-.4*k,-3.6*k]),ga=T*.08*(P.dlGear==null?1:P.dlGear);B.disc(g[0],g[1],1.9*k,DLBR[1],DLBR[2],DLBR[0]);for(let i=0;i<6;i++){const a=ga+i/6*TAU_;B.set(g[0]+Math.cos(a)*2.5*k,g[1]+Math.sin(a)*2.5*k,DLBR[1],1)}B.set(g[0],g[1],DLHOLE,1);/* 歯車 */
 B.poly([Q([-4.6*k,-1.4*k]),Q([4.6*k,-1.4*k]),Q([5*k,3.2*k]),Q([-5*k,3.2*k])],W[1],W[2],W[0]);/* 骨盤の箱 */
 B.poly([Q([-5*k,-6.2*k]),Q([5.2*k,-6.2*k]),Q([6.4*k,-14.4*k]),Q([-6*k,-14.4*k])],W[1],W[3],W[0]);/* 胸の箱 */
 for(let y=-13.6;y<=-7;y+=.5)B.set(...Q([1.6*k,y*k]),W[0],2);/* 板の継ぎ目 */
 /* ランプ四つ：横一列。消えていると暗い琥珀、灯るとくすんだ橙。光らない（目盛り） */
 const n=Math.round(P.dlLamp||0),s=big?2:1,gp=1,w=4*s+3*gp,c=Q([(big?1.7:.9)*k,-10.6*k]),x0=Math.round(c[0]-w/2),y0=Math.round(c[1]-s/2);
 for(let y=-1;y<=s;y++)for(let x=-1;x<=w;x++)B.set(x0+x,y0+y,'#1e120c',2);
 for(let i=0;i<4;i++){const on=i<n;for(let y=0;y<s;y++)for(let x=0;x<s;x++)B.set(x0+i*(s+gp)+x,y0+y,on?(x+y===0&&s>1?DLLAMP[2]:DLLAMP[1]):DLLAMP[0],2)}}
/* 関節のしみ（覚悟の段）：関節のすき間から黒い泥がにじむ */
function dlStain(B,pts,lv){if(!lv)return;for(const[i,p]of pts.entries())for(let j=0;j<(lv>=2?4:2);j++){const h=hsh(i,j);B.set(p[0]+Math.round(h*3-1.5),p[1]+Math.round(hsh(j,i)*3-1.5),j%2?DLMUD[0]:DLMUD[1],2)}}
function dlFig(B,ox,oy,S,P0,T){const P=Object.assign({},PDEF,S.pose||{},P0||{});P.cr=(P.cr||0);
 const J=joints(ox,oy,S,P);J.P=P;P.T=T;const k=S.k,V=DLV[P.tint]||DLV.n,W=V.wood,L=-J.lean,h=J.hip,big=!!S.big;
 if(P.dlApart>0)return dlApart(B,J,S,P,T,V);
 const T0=v=>add(h,rot(v,L)),kp=P.dlKey==null?T*.04:P.dlKey;
 if(S.behind)S.behind(B,J,T,P);
 dlKeyDraw(B,T0,k,kp);
 /* 奥の腕 */dlLimb(B,J.shB,J.elB,1.35*k,W,false);dlLimb(B,J.elB,J.hdB,1.25*k,W,false);dlJoint(B,J.elB,1.3*k,false);
 if(big)J.tip2=dlBlade(B,J.hdB,P.sw2==null?P.fa2:P.sw2,S.w2.len*k,k);else{B.disc(J.hdB[0],J.hdB[1],1.3*k,W[0],W[1],W[0]);dlJoint(B,lerpP(J.elB,J.hdB,.86),.8*k,false)}
 dlJoint(B,J.shB,1.5*k,false);
 /* 奥の脚 */dlLimb(B,J.hpB,J.kneeB,1.6*k,W,false);dlLimb(B,J.kneeB,J.footB,1.4*k,W,false);dlJoint(B,J.kneeB,1.35*k,false);dlFoot(B,J.footB,k,W,false);
 dlTorso(B,T0,k,W,P,T,big);
 /* 手前の脚 */dlJoint(B,J.hpF,1.4*k,true);dlLimb(B,J.hpF,J.kneeF,1.6*k,W,true);dlLimb(B,J.kneeF,J.footF,1.4*k,W,true);dlJoint(B,J.kneeF,1.35*k,true);dlFoot(B,J.footF,k,W,true);
 /* 首（真鍮の棒）と面 */const kh=k*(S.hk||PRO.hk),a=-J.lean-P.hd-(P.dlSpin||0),H=v=>add(J.head,rot([v[0]*kh,v[1]*kh],a));
 B.thick(T0([.2*k,-13.2*k]),H([0,4.4]),.6*k,DLBR[0],DLBR[1],DLBR[0]);dlMask(B,H,V,P.dlFace||0);
 /* 手前の腕 */dlJoint(B,J.shF,1.6*k,true);dlLimb(B,J.shF,J.elF,1.4*k,W,true);dlLimb(B,J.elF,J.hdF,1.3*k,W,true);dlJoint(B,J.elF,1.35*k,true);
 J.tip=dlBlade(B,J.hdF,P.sw==null?P.fa:P.sw,S.w.len*k,k);
 dlStain(B,[J.shF,J.elF,J.kneeF,J.hpF,J.elB],V.stain);
 if(S.front)S.front(B,J,T,P);
 return J}
/* 撃破：関節からばらばらに崩れる。部品ごとに床へ落ちて止まる（少しずつ時間をずらす）。面は上を向いて落ち、鍵は胸の箱についたまま、しばらく回る */
function dlApart(B,J,S,P,T,V){const k=S.k,W=V.wood,L=-J.lean,h=J.hip,u0=P.dlApart,big=!!S.big;
 const fall=(d)=>{const u=Math.max(0,Math.min(1,u0*1.5-d));return u<.8?Math.pow(u/.8,2):1-Math.sin((u-.8)/.2*Math.PI)*.08};
 const seg=(a,b,tx,len,r,d,front)=>{const f=fall(d),y=FL-r-.5,a2=[tx,y],b2=[tx+len,y];dlLimb(B,lerpP(a,a2,f),lerpP(b,b2,f),r,W,front);return lerpP(a,a2,f)};
 /* 胴の箱：腰を軸に、前へ倒れて床に転がる */const ft=fall(.15),piv=[0,-6*k],Cp=add(h,rot(piv,L)),dst=[h[0]-2*k,FL-5*k],ang=L+ft*1.3;
 const T0=v=>add(lerpP(Cp,dst,ft),rot(sub_(v,piv),ang));
 const ends=[];
 ends.push(seg(J.shB,J.elB,h[0]+10*k,6*k,1.1*k,.05,false),seg(J.elB,J.hdB,h[0]+17*k,5*k,1*k,.1,false));
 if(big){const f=fall(.1),hd=lerpP(J.hdB,[h[0]+23*k,FL-1.5*k],f);dlBlade(B,hd,lerp(P.fa2,0,f),S.w2.len*k,k)}
 ends.push(seg(J.hpB,J.kneeB,h[0]+4*k,7*k,1.3*k,.2,false),seg(J.kneeB,J.footB,h[0]+12*k,6*k,1.1*k,.25,false));
 dlKeyDraw(B,T0,k,P.dlKey==null?T*.04:P.dlKey);dlTorso(B,T0,k,W,Object.assign({},P,{dlLamp:0,dlGear:P.dlGear}),T,big);
 ends.push(seg(J.hpF,J.kneeF,h[0]-16*k,7*k,1.3*k,.3,true),seg(J.kneeF,J.footF,h[0]-24*k,6*k,1.1*k,.35,true));
 ends.push(seg(J.shF,J.elF,h[0]-8*k,6*k,1.15*k,.1,true));const ef=fall(.12),hd=lerpP(J.hdF,[h[0]-30*k,FL-1.5*k],ef);dlLimb(B,lerpP(J.elF,[h[0]-36*k+6*k,FL-1.6*k],ef),hd,1.05*k,W,true);dlBlade(B,hd,lerp(P.fa,Math.PI,ef),S.w.len*k,k);
 /* 面：転がり落ちて、上を向いて止まる */const fm=fall(.4),kh=k*(S.hk||PRO.hk),mc=lerpP(J.head,[h[0]-20*k,FL-4.4*kh],fm),ma=lerp(-J.lean-P.hd,-Math.PI/2,fm),H=v=>add(mc,rot([v[0]*kh,v[1]*kh],ma));dlMask(B,H,V,0);
 J.ends=ends;J.mask=mc;return J}
const DLBASE={hk:1.3,lk:.8,tk:.86,knightLike:true,tintable:true};
SPEC.doll=Object.assign({},DLBASE,{name:'からくり人形',k:.8,w:{len:15},draw:(B,ox,oy,S,P,T)=>dlFig(B,ox,oy,S,P,T),pose:{}});
SPEC.dollM=Object.assign({},DLBASE,{name:'大からくり人形',k:1,big:true,mid:true,w:{len:16},w2:{len:16},draw:(B,ox,oy,S,P,T)=>dlFig(B,ox,oy,S,P,T),pose:{}});
for(const k of['doll','dollM'])SPEC[k+'@w']=flashSpec(k);

/* ===== 構え =====
   一回（モブ）：片腕の刃を頭上に掲げる。2回続ける（大）：二本の刃を頭上で交差。数え直し（大）：首をかしげたまま止まり、もう片腕がだらりと垂れる。 */
const DLI=20,DLPRE=24;/* 拍の長さ（ゲームの1ターン目）と、構えてから「キリッ」まで */
const DL_IDLE={ua:2.35,fa:4.2,sw:4.2,ua2:1.62,fa2:1.5,lean:.02,ff:-5,fb:5,hd:0};
const DLM_IDLE={ua:2.3,fa:1.05,sw:1.05,ua2:1.3,fa2:2.25,sw2:2.25,lean:.02,ff:-5,fb:5,hd:0};/* 交差の構え（門番のまね）。胸のランプを隠さないよう、腰の前で下向きに交差させる */
const DL_UP={ua:4.23,fa:4.93,sw:4.93,ua2:1.62,fa2:1.5,lean:-.04,hd:-.05,ff:-6,fb:6};/* 一回：片腕を頭上に */
const DLM_X={ua:3.98,fa:5.43,sw:5.43,ua2:5.33,fa2:3.98,sw2:3.98,lean:-.04,hd:-.05,ff:-6,fb:6};/* 2回続ける：頭上で交差 */
const DLM_X1={ua:2.4,fa:2.1,sw:2.1,ua2:5.13,fa2:4.73,sw2:4.73,lean:0,hd:-.05,ff:-6,fb:6};/* 一本斬ったあと：残りの一本だけ頭上（あと一回） */
const DLM_TILT={ua:4.23,fa:4.93,sw:4.93,ua2:1.4,fa2:1.42,sw2:1.42,lean:.1,hd:.95,ff:-5,fb:5,cr:1};/* 数え直し：首をかしげ、片腕が垂れる（壊れかけ） */
const DL_CHOP={ua:2.35,fa:2.8,sw:2.8,x:-46,lean:.22,ff:-10,fb:5};
const DLM_CHOP1={ua:2.35,fa:2.8,sw:2.8,x:-40,lean:.22,ff:-10,fb:5};
const DLM_CHOP2={ua2:2.35,fa2:2.8,sw2:2.8,x:-40,lean:.22,ff:-10,fb:5};
/* 拍ごとのカチッ：鍵が四分の一回り、体が小さくはねる。ランプは拍ごとに一つ灯る */
function dlTick(P,t,c0,n,I){I=I||DLI;const d=t-c0;if(d<0)return;const b=Math.min(n,Math.floor(d/I)),e=d-b*I;P.dlKey=(b+Math.min(1,e/3))*Math.PI/2;if(b>=1&&e<4)P.cr=(P.cr||0)+(4-e)*.18}
const dlLampN=(t,c0,I)=>t<c0?0:Math.min(4,Math.floor((t-c0)/(I||DLI)));
function dlCards(f,pre,isM){const ox=isM?6:10,bg='gate',S=SPEC[f],IDLE=isM?DLM_IDLE:DL_IDLE;
 const idlePP=(P,t)=>{const b=Math.floor(t/24),e=t-b*24;P.dlKey=(b+Math.min(1,e/4))*Math.PI/6;if(e<3)P.hd=(P.hd||0)+.06};
 mv({f,ox,id:pre+'_idle',n:isM?'立ち絵：交差の構え':'立ち絵',bg,len:96,keys:[K(0,IDLE),K(96,IDLE)],pp:idlePP,
  cap:isM?'二本の刃を腰の前で下向きに交差させて立つ（門番の交差の構えのまね。胸のランプは隠さない）。木と真鍮の体、門番の兜をまねた木の面。背中にぜんまいの鍵、胸にランプ四つ、空洞の腹に歯車。':'木と真鍮の人形。門番の筒形の兜をまねた木の面。目の切れ込みは彫ってあるだけで、奥には何もない。片腕の先が刃。背中にぜんまいの鍵（柄はぬしの鍵と同じ輪）。胸にランプ四つ。空洞の腹に歯車がのぞく。',
  why:'門番がのまれたあと、ぬしが代わりに作らせた番人。形だけをまねている。面の切れ込みが途中で一段ずれているのは、まねきれていないから。'});
 mv({f,ox,id:pre+'_bored',n:'ひまなとき：門をふり返る（門番のまね）',bg,len:200,
  keys:[K(0,IDLE),K(20,IDLE),K(28,Object.assign({},IDLE,{ua:2.1,fa:1.75,sw:1.75}),'io'),K(34,Object.assign({},IDLE,{ua:2.1,fa:1.6,sw:1.6})),K(40,Object.assign({},IDLE,{ua:2.1,fa:1.75,sw:1.75})),K(46,Object.assign({},IDLE,{ua:2.1,fa:1.6,sw:1.6})),K(52,Object.assign({},IDLE,{ua:2.1,fa:1.75,sw:1.75})),
   K(70,Object.assign({},IDLE,{ua:2.1,fa:1.75,sw:1.75,dlFace:0}),'io'),K(74,Object.assign({},IDLE,{ua:2.1,fa:1.75,sw:1.75,dlFace:1}),'snap'),K(130,Object.assign({},IDLE,{ua:2.1,fa:1.75,sw:1.75,dlFace:1})),K(134,Object.assign({},IDLE,{ua:2.1,fa:1.75,sw:1.75,dlFace:0}),'snap'),K(160,IDLE,'io'),K(200,IDLE)],
  pp:(P,t)=>{idlePP(P,t);if(t>=70&&t<78||t>=130&&t<138)P.hd=(P.hd||0)+((t>>1)&1?.12:-.12)},
  fx:(B,J,t)=>{for(const t0 of[34,46])if(t>=t0&&t<t0+5&&J.tip)for(let i=0;i<4;i++)B.set(J.tip[0]-3+i*2,FL-((t+i)%2),'#6a6278',5)},
  cap:'刃の先で床をこつ、こつと二度たたき、首だけがカクンと真後ろへ回って、背後の門を見る。しばらく見つめて、またカクンと戻る。光らない。',
  why:'門番のひまなとき（床をたたき、門をふり返る）をまねている。ただ、人形には首の筋がないので、首だけが真後ろまで回る。'});
 mv({f,ox,id:pre+'_enter',n:isM?'出現：ぜんまいが巻かれ、刃を交差させる':'出現：ぜんまいが巻かれる',bg,len:isM?172:152,
  /* ランプが四つ点いて消えてから（62F）、首がカクンと起き上がる */keys:[K(0,{ua:1.45,fa:1.55,sw:1.55,ua2:1.55,fa2:1.6,sw2:1.6,lean:.32,hd:.55,cr:3}),K(62,{ua:1.45,fa:1.55,sw:1.55,ua2:1.55,fa2:1.6,sw2:1.6,lean:.32,hd:.55,cr:3}),K(68,{ua:1.45,fa:1.55,sw:1.55,ua2:1.55,fa2:1.6,sw2:1.6,lean:.05,hd:-.1,cr:0},'snap'),K(86,IDLE,'out')].concat(isM?[K(106,Object.assign({},IDLE,{ua:2.4,fa:5.08,sw:5.08,ua2:.9,fa2:4.28,sw2:4.28})),K(110,IDLE,'in'),K(172,IDLE)]:[K(152,IDLE)]),
  pp:(P,t)=>{if(t<40){P.dlKey=t*t*.004;P.dlGear=t/40}else if(t<68){P.dlKey=6.4+(t-40)*.3;P.dlLamp=t<62?Math.min(4,Math.floor((t-50)/3)+1):0;if(t<50)P.dlLamp=0}else idlePP(P,t)},
  fx:(B,J,t)=>{if(isM&&t>=110&&t<118&&J.tip){const c=lerpP(J.tip,J.tip2||J.tip,.5);for(let i=0;i<6;i++){const a=i/6*TAU_,r=1+(t-110)*.8;B.set(c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r,DLBR[2],5)}}},
  cap:isM?'うなだれて止まっている。背中の鍵がひとりでに回りはじめ（キリキリ）、ランプが四つ順に点いて消えると、首がカクンと起き上がる。二本の刃を打ち合わせて、体の前で交差させる。':'うなだれて止まっている。背中の鍵がひとりでに回りはじめ（キリキリ）、ランプが四つ順に点いて消えると、首がカクンと起き上がって構える。',
  why:isM?'門番の登場（剣を打ち合わせて交差）のまね。打ち合わせの火花はくすんだ真鍮の色で、合図の光とは取り違えない。':'だれかが巻いているのではない。鍵は勝手に回る。'});
 /* 攻撃 */
 const C0=DLPRE,H1=C0+5*DLI;
 if(!isM){mv({f,ox,id:pre+'_one',n:'一回（ランプ四つの次の拍）',bg,len:H1+46,
   keys:[K(0,IDLE),K(10,DL_UP,'out'),K(H1-DLI,DL_UP),K(H1-11,Object.assign({},DL_UP,{x:-46,lean:.05}),'io'),K(H1-3,Object.assign({},DL_UP,{x:-46,lean:.05})),K(H1,DL_CHOP,'in'),K(H1+16,DL_CHOP),K(H1+40,IDLE,'io'),K(H1+46,IDLE)],
   pp:(P,t)=>{P.dlLamp=t<H1?dlLampN(t,C0):t<H1+16?4:0;if(t<C0){P.dlKey=Math.min(1,t/C0)*Math.PI*2-Math.PI*2}else dlTick(P,t,C0,4)},
   cues:[{t:C0,col:'w',silent:true}],hits:[H1],trails:[[H1-3,H1+2,'w',1,'arc']],
   cap:'片腕の刃を頭上に掲げて止まる（一回）。キリッと鳴ると、拍ごとに背中の鍵がカチッと回り、胸のランプが一つずつ灯る。四つ灯った次の拍で、すべり寄って斬り下ろす。刃は光らない。拍は20F（ゲームの1ターン目）。',
   why:'数えるのは光ではなく、胸の目盛り。ランプは合図ではないので、光らせず、くすんだ橙にする。拍の速さは、鍵がカチッと回る速さでも見える。'});
  mv({f,ox,id:pre+'_fast',n:'拍が速くなる（巻かれるほど速い）',bg,len:DLPRE+5*14+46,
   keys:[K(0,IDLE),K(10,DL_UP,'out'),K(DLPRE+70-14,DL_UP),K(DLPRE+70-8,Object.assign({},DL_UP,{x:-46,lean:.05}),'io'),K(DLPRE+70-3,Object.assign({},DL_UP,{x:-46,lean:.05})),K(DLPRE+70,DL_CHOP,'in'),K(DLPRE+86,DL_CHOP),K(DLPRE+110,IDLE,'io'),K(DLPRE+116,IDLE)],
   pp:(P,t)=>{const h=DLPRE+70;P.dlLamp=t<h?dlLampN(t,C0,14):t<h+16?4:0;if(t<C0){P.dlKey=Math.min(1,t/C0)*Math.PI*3-Math.PI*3}else dlTick(P,t,C0,4,14)},
   cues:[{t:C0,col:'w',silent:true}],hits:[DLPRE+70],trails:[[DLPRE+67,DLPRE+71,'w',1,'arc']],
   cap:'ターンごとにぜんまいが巻かれ、拍が20→18→16→14Fと速くなる（これは4ターン目の14F）。構えも数え方も同じで、鍵のカチッとランプの灯る間だけが詰まる。',
   why:'同じ技のまま拍の速さが変わる。速さは光る前から、構えている間の鍵の回り（巻かれた分だけ速い）と、灯るランプそのもので読める。'})}
 else{const C1=H1+24,H2=C1+5*DLI;
  mv({f,ox,id:pre+'_two',n:'2回続ける（交差から一本ずつ）',bg,len:H2+46,
   keys:[K(0,IDLE),K(10,DLM_X,'out'),K(H1-DLI,DLM_X),K(H1-11,Object.assign({},DLM_X,{x:-40,lean:.05}),'io'),K(H1-3,Object.assign({},DLM_X,{x:-40,lean:.05})),K(H1,Object.assign({},DLM_X,DLM_CHOP1),'in'),K(H1+12,Object.assign({},DLM_X,DLM_CHOP1)),K(C1-4,DLM_X1,'io'),
    K(H2-DLI,DLM_X1),K(H2-11,Object.assign({},DLM_X1,{x:-40,lean:.05}),'io'),K(H2-3,Object.assign({},DLM_X1,{x:-40,lean:.05})),K(H2,Object.assign({},DLM_X1,DLM_CHOP2),'in'),K(H2+16,Object.assign({},DLM_X1,DLM_CHOP2)),K(H2+40,IDLE,'io'),K(H2+46,IDLE)],
   pp:(P,t)=>{if(t<C0){P.dlKey=Math.min(1,t/C0)*Math.PI*2-Math.PI*2;P.dlLamp=0}else if(t<H1+12){dlTick(P,t,C0,4);P.dlLamp=t<H1?dlLampN(t,C0):4}else if(t<C1){P.dlLamp=0;/* 二本目のキリッまでも、鍵はなめらかに巻かれる */P.dlKey=Math.min(1,(t-(H1+12))/Math.max(1,C1-H1-12))*2*Math.PI}else{dlTick(P,t,C1,4);P.dlKey+=2*Math.PI;P.dlLamp=t<H2?dlLampN(t,C1):t<H2+16?4:0}},
   cues:[{t:C0,col:'w',silent:true},{t:C1,col:'w',silent:true}],hits:[H1,H2],trails:[[H1-3,H1+1,'w',1,'arc'],[H2-3,H2+1,'w',2,'arc']],
   cap:'二本の刃を頭上で交差させる（2回）。ランプが四つ灯った次の拍で手前の一本を斬り下ろし、ランプが消える。残った一本を頭上に掲げたまま、もう一度キリッ、四つ数えて次の拍で斬る。',
   why:'交差は門番の「閉じた門」のまね。掲げている刃の数＝残りの数。一本斬ると頭上の刃が一本になるので、あと一回だと見える。'});
  const R1=C0+3*DLI,HR=C0+8*DLI;
  mv({f,ox,id:pre+'_recount',n:'数え直し（ランプが途中で消える）',bg,len:HR+46,
   keys:[K(0,IDLE),K(10,DLM_TILT,'out'),K(R1,DLM_TILT),K(R1+2,Object.assign({},DLM_TILT,{hd:.98,cr:2}),'out'),K(R1+10,DLM_TILT,'io'),K(HR-DLI,DLM_TILT),K(HR-11,Object.assign({},DLM_TILT,{x:-40,lean:.12}),'io'),K(HR-3,Object.assign({},DLM_TILT,{x:-40,lean:.12})),K(HR,Object.assign({},DLM_TILT,DLM_CHOP1),'in'),K(HR+16,Object.assign({},DLM_TILT,DLM_CHOP1)),K(HR+40,IDLE,'io'),K(HR+46,IDLE)],
   pp:(P,t)=>{if(t<C0){const s=Math.floor(t/5),e=t-s*5;P.dlKey=-(s*.5+(e<2?e*.25:.5))+(e>=2&&e<4?.25:0);P.dlLamp=0}
    else if(t<R1){dlTick(P,t,C0,2);P.dlLamp=dlLampN(t,C0)}
    else if(t<C0+4*DLI){P.dlLamp=0;const e=t-R1;P.dlKey=Math.PI-Math.min(1,e/4)*Math.PI*.75+(e>=4&&e<8?((e>>1)&1)*.2:0)}
    else{dlTick(P,t,C0+3*DLI,4);P.dlKey+=Math.PI*.25;P.dlLamp=t<HR?dlLampN(t,C0+3*DLI):t<HR+16?4:0}},
   cues:[{t:C0,col:'w',silent:true}],hits:[HR],trails:[[HR-3,HR+1,'w',1,'arc']],
   fx:(B,J,t)=>{if(t>=R1&&t<R1+10){const c=add(J.sc,[12*J.k,-2*J.k]);for(let i=0;i<4;i++)B.set(c[0]+((t+i*3)%5)-2,c[1]-((t+i)%4),'#6a5a48',5)}},
   cap:'首をかしげたまま止まり、もう片腕がだらりと垂れる（壊れかけの構え）。背中の鍵が逆にギギッと空回りする。キリッのあと、ランプが二つ灯ったところで、ギギッと鳴って全部消え、一から数え直す。四つ灯った次の拍で斬る（キリッから8拍目）。',
   why:'中ボスだけの技（モブより一つ多い）。数が途中で戻るので、首をかしげた構えを見たら「一度消える」と読む。鍵の逆回りは念押し。'})}
 /* パリィされ：刃がはね上がり、首がカクンと一回転して戻る。大で真鍮の歯がこぼれる */
 const kit=(kind,th,P,which)=>{const A=which===2?['ua2','fa2','sw2']:['ua','fa','sw'],T={};
  if(kind==='s'){T[A[0]]=4.08;T[A[1]]=4.58;T[A[2]]=4.58;return Object.assign(T,{x:(P.x||0)+3,lean:(P.lean||0)-.15})}
  T[A[0]]=4.53;T[A[1]]=5.58;T[A[2]]=5.58;return Object.assign(T,{x:(P.x||0)+9,lean:-.35,cr:1.5,ff:-4,fb:8})};
 const spin=(P,t,Hc,stop)=>{const n=Hc.length;Hc.forEach((H,i)=>{const d=t-H-stop;if(d<0||d>=14)return;if(i<n-1)P.dlSpin=(P.dlSpin||0)+(d<3?d/3:1-(d-3)/8)*.5*(d<11?1:0);else P.dlSpin=(P.dlSpin||0)+(d<10?easeIO(d/10)*TAU_:0)});
  const H=Hc[n-1];if(t>=H)P.dlLamp=0};
 const teeth=(B,J,t,Hc,stop)=>{const H=Hc[Hc.length-1],d=t-H-stop;if(d<0)return;for(let i=0;i<5;i++){const h=hsh(i,9),x0=J.neck[0]+(h-.5)*4,y=Math.min(FL-1,J.neck[1]+(d*d)*.06*(1+h)-d*(.6+h*.4));B.set(x0+(i-2)*d*.25,y,i%2?DLBR[2]:DLBR[1],5)}};
 if(!isM)parriedCard({id:pre+'_pry',src:pre+'_one',n:'パリィされ：刃がはね上がり、首が一回転',kit,rx:[{kind:'b'}],pp:spin,fx:teeth,
  cap:'弾くと、刃がはね上がって体がのけぞる。首がカクンと一回転して元に戻り、首の付け根から真鍮の歯がこぼれる。ランプは消える。',
  why:'中身は歯車だけ。弾かれた衝撃で首の歯車が空回りして、首がまわってしまう。痛がらない（人形だから）。'});
 else parriedCard({id:pre+'_pry',src:pre+'_two',n:'パリィされ：2回続ける（小→大）',kit,rx:[{kind:'s'},{kind:'b'}],pp:spin,fx:teeth,
  cap:'一本目を弾くと、刃がはね上がり、首がカクンとかしぐ（そのまま残りの一本の構えへ）。二本目も弾かれると、のけぞって首がカクンと一回転し、真鍮の歯がこぼれる。',
  why:'小は連撃のリズムを崩さない。大は待機とまるでちがう形（首が回る）。'});
 /* ブレイク：ぜんまいが切れて、がくんと止まる。腕が垂れ、首が傾く。ランプは全部消え、鍵も止まる */
 const BRK=t=>({ua:1.45,fa:1.55,sw:1.55,ua2:1.55,fa2:1.6,sw2:1.6,lean:.3,hd:.58+Math.sin(t*.05)*.03,cr:3,ff:-5,fb:4,dlLamp:0,dlKey:0,dlGear:0});
 parriedCard({id:pre+'_brk',src:isM?pre+'_two':pre+'_one',n:'ブレイク：ぜんまいが切れて止まる',len:isM?330:220,kit,rx:isM?[{kind:'s'},{kind:'b'}]:[{kind:'b'}],pp:(P,t,Hc,stop)=>{spin(P,t,Hc,stop);const T0=Hc[Hc.length-1]+stop+6;if(t>=T0){P.dlLamp=0;P.dlKey=0;P.dlGear=0;P.dlSpin=0}},fx:teeth,brk:{at:6,P:BRK,star:J=>add(J.head,[0,-13*J.k])},
  cap:'四度目を弾くと、ぜんまいが切れて、がくんと止まる。腕が垂れ、首がかしぎ、ランプは全部消え、鍵も歯車も止まる。頭の上をうすい青の星が回る。',
  why:'鍵が止まっている＝数えていない＝いま斬れる。腕と首が下がるので、遠目にも「止まった」と分かる。'});
 recoverCard({id:pre+'_rec',f,ox,bg,n:'ブレイク：斬られて、鍵がひとりでに巻き戻る',P:BRK,idle:()=>Object.assign({},IDLE),snap:4,star:J=>add(J.head,[0,-13*J.k]),
  react:(P,a,b,t)=>{const A=kb(a,6),Bk=kb(b,8);P.x=(P.x||0)+2*A+3*Bk;P.hd=(P.hd||0)+.2*Math.max(A,Bk);const R0=HH2+16;if(t>=R0-14&&t<R0+6){P.dlKey=(t-(R0-14))*.9;P.dlGear=2}else if(t>=R0+6)idlePP(P,t)/* 構えへ戻ったら、待機の回り方に戻る */},
  cap:'止まったまま斬られる。二太刀目のあと、背中の鍵がひとりでにギギギと速く巻き戻り、構えへ一気に戻る（少し行き過ぎて収まる）。',
  why:'立て直しは一瞬。ゆっくり起きると「まだ斬れる」と勘ちがいさせる。巻く者はいないのに鍵が回る。'});
 hurtMove(f,pre+'_hurt',{react:(P,a,b)=>{const A=kb(a,6),Bk=kb(b,9),m=Math.max(A,Bk);P.x=(P.x||0)+3*A+5*Bk;P.lean=(P.lean||0)-.22*m;P.hd=(P.hd||0)-.35*A+.3*Bk},
  fx:(B,J,t,a,b,hp)=>{for(const d of[a,b]){if(d<0||d>=14)continue;for(let i=0;i<5;i++){const h=hsh(i,d>=0?3:4),x=hp[0]+4+d*(1+h)*.8,y=hp[1]-2-d*(1.2-h)+d*d*.08;if(y<FL)B.set(x,y,i%2?DLV.n.wood[3]:DLV.n.wood[1],5)}}},
  cap:'斬られると、木くずが飛び、首がカクッ、カクッと左右に振れる。声は出ない。',
  why:'痛がらない。木の体なので、斬られたところから木くずが飛ぶだけ。'});
 /* 撃破：関節からばらばらに崩れ、面が落ちる。鍵だけがしばらく回って止まる。関節のすき間から黒い泥がしみこむ */
 const DN=60,DE=DN+40;
 mv({f,ox,id:pre+'_down',n:'撃破：ばらばらに崩れる',bg,len:240,noHero:true,
  keys:[K(0,IDLE),K(6,Object.assign({},IDLE,{x:4,lean:-.3,hd:-.3}),'out'),K(20,BRK(0),'io'),K(DN,BRK(0))],
  pp:(P,t)=>{if(t<20){P.dlKey=t*.3}else if(t<DN){P.dlKey=6+(t-20)*.05;P.dlLamp=0;P.dlGear=.3}if(t>=DN){Object.assign(P,BRK(0));P.dlApart=Math.min(1,(t-DN)/DE);const e=t-DN;P.dlKey=6+(e<110?.35*e-(.35/220)*e*e:.35*110-(.35/220)*110*110);/* 鍵だけがしばらく回り、だんだん止まる */P.dlGear=0}},
  post:(B,J,t)=>{if(t<DN+50||!J.ends)return;const u=Math.min(1,(t-DN-50)/70);for(const[i,p]of J.ends.entries()){const n=Math.round(u*5);for(let j=0;j<n;j++){const h=hsh(i,j);B.set(p[0]+Math.round(h*4-2),p[1]+Math.round(hsh(j,i+3)*2-1),j%3?DLMUD[0]:DLMUD[1],5)}}
   if(J.mask){const n=Math.round(u*6);for(let j=0;j<n;j++)B.set(J.mask[0]+Math.round(hsh(j,7)*6-3),J.mask[1]+Math.round(hsh(7,j)*2),DLMUD[j%2],5)}
   const w=Math.round(u*16);for(let dx=-w;dx<=w;dx++)if(hsh(dx,3)<.7)B.set(J.hip[0]+dx,FL+1,DLMUD[0],5)},
  cap:'最後の一撃で止まり、関節からばらばらに崩れる。面が転がり落ちて上を向く。中は空っぽで、背中の鍵だけがしばらく回って止まる。やがて関節のすき間から黒い泥がしみこんでいく。',
  why:'中身は何もない。それでも、倒れたものはくらやみに拾われる。泥がしみた人形は、いつかまた組み直されるかもしれない。'});
}
dlCards('doll','dl',false);dlCards('dollM','dlM',true);
KSHOW.push('dl_fast');

/* 資料集に入れる */
MOVES_OF.doll=['dl_idle','dl_bored','dl_one','dl_fast'];
MOVES_OF.dollM=['dlM_idle','dlM_bored','dlM_two','dlM_recount'];
Object.assign(MCAT_ENTER,{doll:['dl_enter'],dollM:['dlM_enter']});Object.assign(MCAT_DOWN,{doll:['dl_down'],dollM:['dlM_down']});Object.assign(MCAT_HURT,{doll:['dl_hurt'],dollM:['dlM_hurt']});
Object.assign(MCAT_PARRY,{doll:['dl_pry'],dollM:['dlM_pry']});Object.assign(MCAT_BREAK,{doll:['dl_brk','dl_rec'],dollM:['dlM_brk','dlM_rec']});
FORMS.push({key:'dollM',ttl:'大からくり人形',en:'THE CLOCKWORK WARDENS · 中ボスとモブ',stage:[],sox:62,vt:'DLV',vnote:'覚悟の段は、空っぽの体にくらやみがしみこんでいく段階。赤い段から関節のすき間に黒い泥がにじみ、黒い段で木が黒ずみ、面の切れ込みの奥に光らない目が一つ開く（奥には何もないはずだった）。紫の段では目が三つ。ランプ（数える目盛り）の色はどの段でも変えない。',
 variants:[['n','木と真鍮'],['r','関節に黒い泥'],['k','黒ずんだ木。切れ込みの奥に目'],['v','紫の木。目が三つ']],
 lore:'門番が黒い門番にのまれたあと、門のぬしが代わりに作らせた番人。木と真鍮でできていて、中身は空っぽ、歯車しかない。顔は門番の兜をまねた木の面だが、まねきれていない。背中のぜんまいの鍵は、だれも巻いていないのに回る。',
 parts:[['木の面','門番の筒形の兜のまね。目の切れ込みは彫っただけで、奥には何もない。切れ込みが途中で一段ずれている（まねきれていない）'],['ぜんまいの鍵','柄はぬしの鍵と同じ輪の形（門の系統）。拍ごとにカチッと回る＝回る速さが拍の速さ。数え直しの構えでは逆にギギッと空回りする（念押し）'],['胸のランプ四つ','数えるための目盛りで、合図ではない。消えていると暗い琥珀、灯るとくすんだ橙。四つ灯った次の拍で斬る'],['頭上の刃の数','掲げている刃の数＝来る数。片腕＝一回、交差＝2回。一本斬ると頭上の刃が一本になる'],['首のかしげ（大）','数え直しの構え。首をかしげたまま止まり、片腕が垂れる。ランプが途中で消えると読む'],['空洞の腹の歯車','中身は空っぽ。ブレイクで歯車が止まる'],['二本の刃（大）','門番の交差した剣（閉じた門）のまね'],['光らない刃','攻撃は「キリッ」の音と、ランプの数で読む']],
 pal:[['#7a5434','木','光らない'],['#806428','真鍮','くすませる。合図の金と分ける'],['#b8642c','灯ったランプ','くすんだ橙。光らない目盛り'],['#3a2418','消えたランプ','暗い琥珀'],['#9a7a52','木の面','門番の兜のまね']],
 pair:{key:'doll',ttl:'からくり人形（モブ）',diff:[['同じ骨格','門番と同じ人の形（まねて作られた）。大は1.25倍で、刃が二本'],['技','モブは「一回」。大は「2回続ける」＋「数え直し」。数え直しは大で先に教わる'],['構え','片腕を頭上に＝一回。頭上で交差＝2回。首をかしげて片腕が垂れる＝数え直し'],['身なり','同じ木の面と鍵。大は交差の構えで立つ（門番のまね）']]}});
FORMS.push({key:'doll',ttl:'からくり人形',en:'MOB · 大からくり人形と同じ骨格',stage:[],sox:62,vt:'DLV',vnote:'覚悟の段は大からくり人形と同じ（関節の泥、切れ込みの奥の目）。',
 variants:[['n','木と真鍮'],['r','関節に黒い泥'],['k','黒ずんだ木。奥に目'],['v','紫の木。目が三つ']],
 lore:'門のために作られた木と真鍮の人形。キリッと鳴ってから、胸のランプが拍ごとに灯り、四つ灯った次の拍で斬る。ターンごとにぜんまいが巻かれて、拍が速くなる。',
 parts:[['頭上の片腕の刃','一回来る'],['胸のランプ四つ','目盛り。四つ灯った次の拍'],['背中の鍵','カチッと回る速さ＝拍の速さ']],
 pal:[['#7a5434','木','光らない'],['#b8642c','灯ったランプ','くすんだ橙']]});
