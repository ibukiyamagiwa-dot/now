/* ===== 石なげ小鬼・小鬼のおかしら（中ボスとモブの四組目） =====
   迷宮に住みつく小鬼（生きているもの）。拍に合わせて石を投げるのは、遊び歌。おかしらの大岩には門の紋章がある＝封印の石を壊して遊んでいる。
   見た目の決まり：
   - 人型（小さい）の骨格。大きな頭、後ろへ長くのびた耳、かぎ鼻、にやけた口。目はにぶい色で光らない。腰に石の袋。
   - 攻撃は光らない（石は光らない）。読むのは音（投げるときの「ポイ」、飛んでいる石の「ヒュ・ヒュ・ヒュ」）と、足元に広がる石の影。「ヒュ・ヒュ・ヒュ」の次の拍で落ちる。
   - いちばん大事な原則（構えで数が分かる）：手に持った石の数＝投げる数。モブは両手に一つずつ（二つ）。おかしらは三つでお手玉（三つ）。お手玉の拍が、そのまま石の拍。
   - おかしらだけの技「大きな岩」（赤い光、重い）は、封印の石を頭の上へ持ち上げる構え。ふだんから背中側の床に置いてある。
   - 弾いた石は足元に落ちる（次のこうげきで投げ返せる）。大きな岩は弾くと三つに割れる。 */
const IMV={
 n:{lbl:'覚悟1 ふつう',name:'石なげ小鬼',skin:['#5e7a3a','#7e9a52','#34461e'],vein:0,eyes:0},
 r:{lbl:'覚悟2 赤い',name:'赤い石なげ小鬼',skin:['#8a4a3a','#aa6a52','#4a2420'],vein:1,eyes:0},
 k:{lbl:'覚悟3 黒い',name:'黒い石なげ小鬼',skin:['#3a3c36','#56584e','#1c1e1a'],vein:2,eyes:1},
 v:{lbl:'覚悟4 紫の',name:'紫の石なげ小鬼',skin:['#4e3a64','#6a5084','#2a1c3a'],vein:2,eyes:2}};
const IMEYE='#a85a3a',IMEYE2='#7a2a4a',IMTOOTH='#cfc6a6',ROCK=['#7a6e66','#a0948a','#463e3a'],SEAL=['#5e5a66','#807a8a','#33303a'],SEALG='#8a7030';
/* 頭：大きな頭、後ろへのびた耳、かぎ鼻、にやけた口。ear＝耳（1で後ろへ寝る、-1で立つ）、grin＝口を開けて笑う */
function impHead(B,R,k,T,P){const V=IMV[P.tint]||IMV.n,sk=V.skin,ear=P.ear||0,g=P.grin||0;
 B.poly([R([3*k,-2.2*k]),R([(8.5-ear*1.5)*k,(-5.5+ear*3.5)*k]),R([(9-ear)*k,(-4.6+ear*3.5)*k]),R([4*k,.2*k])],sk[0],sk[1],sk[2]);/* 耳 */
 B.disc(...R([0,-1.5*k]),4.4*k,sk[0],sk[1],sk[2]);/* 頭 */
 B.poly([R([-4*k,-.5*k]),R([3.4*k,0]),R([2.6*k,3.6*k]),R([-3.6*k,3.2*k])],sk[0],sk[1],sk[2]);/* あご */
 B.poly([R([-3.6*k,-1.6*k]),R([-7.4*k,.6*k]),R([-6.6*k,1.2*k]),R([-3.4*k,.6*k])],sk[0],sk[1],sk[2]);/* かぎ鼻 */
 const my=(1.9+g*.6)*k;B.thick(R([-4.2*k,my]),R([-.2*k,my-.4*k]),(.5+g*.6)*k,OUT,OUT,OUT);for(const x of[-3.4,-2.2,-1])B.set(...R([x*k,my-.5*k]),IMTOOTH,2);/* にやけた口と歯 */
 B.set(...R([-2.6*k,-1.8*k]),IMEYE,2);B.set(...R([-1.4*k,-1.8*k]),IMEYE,2);B.line(...R([-3.4*k,-2.7*k]),...R([-1*k,-2.4*k]),sk[2]);/* 目（光らない）とまゆ */
 if(V.eyes>=1)B.set(...R([-2*k,-4*k]),IMEYE2,2);if(V.eyes>=2){B.set(...R([1*k,-3.4*k]),IMEYE2,2);B.set(...R([-.6*k,1*k]),IMEYE2,2)}/* のまれるほど目が増える（光らない） */
 if(V.vein>=1)for(let i=0;i<4;i++)B.set(...R([(1.5+i*.5)*k,(-3+i*.9)*k]),'#1a1220',2)}
/* 石と、石の袋。rF/rB＝前・後ろの手に石、jug/jn＝お手玉（数）、bigUp＝大岩を頭の上へ */
function rock(B,x,y,r,c){B.disc(x,y,r,(c||ROCK)[0],(c||ROCK)[1],(c||ROCK)[2])}
function sealRock(B,x,y,r){rock(B,x,y,r,SEAL);/* 閉じた門の紋章（くすんだ金）：アーチと、まん中の合わせ目 */for(let a=Math.PI;a<=Math.PI*2.01;a+=.35)B.set(x+Math.cos(a)*r*.45,y+Math.sin(a)*r*.45+r*.1,SEALG,2);B.line(x-r*.45,y+r*.12,x-r*.45,y+r*.42,SEALG);B.line(x+r*.45,y+r*.12,x+r*.45,y+r*.42,SEALG);B.line(x,y-r*.3,x,y+r*.42,SEALG);
 B.line(x+r*.3,y-r*.7,x+r*.6,y-r*.1,SEAL[2])/* 欠け */}
const impRockR=k=>2.2*k/.7;
function impBehind(B,J,T,P,S){if(S.big&&!P.bigUp&&!P.bigGone){const k=J.k,r=6.5*k/1.075;sealRock(B,J.hip[0]+(14*k)+(P.bigX||0),FL-r+.5,r)}}
function impFront(B,J,T,P,S){const k=J.k,rr=impRockR(k);
 /* 腰の石の袋 */const pc=add(J.hip,[3*k,2*k]);B.disc(pc[0],pc[1],2.4*k,'#5a4430','#7a6044','#2a1e14');B.set(pc[0]-1,pc[1]-2*k,'#2a1e14',2);
 if(P.rF)rock(B,J.hdF[0]-1,J.hdF[1]-rr*.6,rr);if(P.rB)rock(B,J.hdB[0],J.hdB[1]-rr*.6,rr);
 if(P.jug>0&&P.jn>0){const c=add(J.sc,[-10*k,-8*k]);for(let i=0;i<P.jn;i++){const a=(T/39+i/3)*Math.PI*2;rock(B,c[0]+Math.cos(a)*4*k,c[1]+Math.sin(a)*7*k,rr)}}
 if(P.bigUp){const c=add(J.head,[0,-14*k]);sealRock(B,c[0],c[1],6.5*k/1.075)}
 const V=IMV[P.tint]||IMV.n;if(V.vein>=2){for(const[a,b]of[[J.shF,J.elF],[J.elF,J.hdF]])for(let i=0;i<4;i++)B.set(lerp(a[0],b[0],i/4)+(i%2),lerp(a[1],b[1],i/4),'#1a1220',2)}}
const lerpP=(a,b,u)=>[lerp(a[0],b[0],u),lerp(a[1],b[1],u)];
function impDraw(B,ox,oy,S,P0,T){const P=Object.assign({},PDEF,S.pose,P0||{}),V=IMV[P.tint]||IMV.n,sk=V.skin;
 const S2=Object.assign({},S,{pal:Object.assign({},S.pal,{arm:sk[0],armHi:sk[1],armLo:sk[2],chest:sk[0],under:sk[0],underHi:sk[1],underLo:sk[2],foot:sk[0],footHi:sk[1],glove:sk[0]})});
 return knight(B,ox,oy,S2,P,T)}
const IMBASE={hk:2.05,lk:.78,tk:.78,pal:Object.assign({},PAL.guard,{trim:'#5a4430',trimHi:'#7a6044',trimLo:'#2a1e14'}),helm:{type:'imp',extra:impHead},cape:null,
 tabard:{len:5,col:'#5a4430',hi:'#7a6044',lo:'#2a1e14'},behind:(B,J,T,P)=>impBehind(B,J,T,P,SPEC[P._who]||{}),front:(B,J,T,P)=>impFront(B,J,T,P,SPEC[P._who]||{})};
Object.assign(PDEF,{ear:0,grin:0,rF:0,rB:0,jug:0,jn:0,bigUp:0,bigGone:0,bigX:0,parried:0});
const IMPOSE={ua:2.0,fa:2.4,sw:null,ua2:1.5,fa2:2.0,ff:-6,fb:6,cr:2.4,lean:.16,hd:-.05};
SPEC.imp=Object.assign({},IMBASE,{name:'石なげ小鬼',k:.7,draw:(B,ox,oy,S,P,T)=>impDraw(B,ox,oy,S,Object.assign({},P,{_who:'imp'}),T),knightLike:true,tintable:true,pose:IMPOSE});
SPEC.impM=Object.assign({},IMBASE,{name:'小鬼のおかしら',k:.875,big:true,draw:(B,ox,oy,S,P,T)=>impDraw(B,ox,oy,S,Object.assign({},P,{_who:'impM'}),T),knightLike:true,tintable:true,pose:IMPOSE});
for(const k of['imp','impM'])SPEC[k+'@w']=flashSpec(k);

/* 石の飛び方：投げた手から、主人公の頭へ、高い山なり。13Fごとに「ヒュ」（音の輪）、足元の影が一段ずつ濃く大きくなり、4拍目（52F）で落ちる */
const LOB=52,BEAT=13,HEADP=[HXX+4,FL-15];
function soundArc(B,c,d){if(d<0||d>=8)return;const r=2+d*.9;for(let a=-.8;a<=.8;a+=.2){B.set(c[0]-Math.cos(a)*r,c[1]+Math.sin(a)*r,d<4?'#a8a0b0':'#6a6278',4);B.set(c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r,d<4?'#a8a0b0':'#6a6278',4)}}
function lobFx(B,t,t0,from,P,big){const d=t-t0;if(d<0)return;const r=big?6.5:impRockR(.7);
 if(d<=LOB){const u=d/LOB,x=lerp(from[0],HEADP[0],u),y=lerp(from[1],HEADP[1],u)-58*4*u*(1-u);(big?sealRock:rock)(B,x,y,r);
  const st=Math.min(3,Math.floor(d/BEAT)),w=3+st*3;for(let dx=-w;dx<=w;dx++)if((dx+st)%(4-st)===0||st===3)B.set(HXX+5+dx,FL+1,st>=2?'#000000':'#1a1620',5);/* 足元の影 */
  for(const b of[BEAT,BEAT*2,BEAT*3])soundArc(B,[x,y],d-b)}
 else if(!P.parried){const e=d-LOB;if(e<18){const x=HEADP[0]-e*1.1,y=HEADP[1]-e*2.2+e*e*.22;if(y<FL-1)rock(B,x,y,r);else rock(B,x,FL-r,r)}}}
/* 大きな岩：持ち上げた頭の上から、短い山なりで投げる */
function bigFx(B,t,t0,t1,from,P){if(t<t0)return;if(t<=t1){const u=(t-t0)/(t1-t0);sealRock(B,lerp(from[0],HEADP[0]+4,u),lerp(from[1],HEADP[1]-2,u)-14*4*u*(1-u),6.5)}
 else if(!P.parried){const e=t-t1;if(e<26){sealRock(B,HEADP[0]+4-e*.4,Math.min(FL-6,HEADP[1]-2+e*e*.3),6.5);if(e>8&&e<20)for(let i=0;i<5;i++)B.set(HEADP[0]+i*3-6,FL-1-(i%2),ROCK[0],5)}}}
const rocksAtFeet=(B,n)=>{for(let i=0;i<n;i++)rock(B,HXX+14+i*6,FL-2-(i%2),impRockR(.7))};

/* 構え */
const IMW1={ua:-2.5,fa:-2.0,rF:1},IMR1={ua:-1.0,fa:-.55,rF:0,lean:.24},IMW2={ua2:-2.3,fa2:-1.9,rB:1},IMR2={ua2:-1.0,fa2:-.6,rB:0,lean:.24};
const IM2={ua:1.6,fa:-.4,ua2:1.3,fa2:-.7,rF:1,rB:1,cr:3.2,lean:.12,grin:.6};/* 二つ投げ：両手に石を一つずつ持ち、ひざで拍をとる */
const IMJ={ua:2.2,fa:-1.2,ua2:1.9,fa2:-1.4,jug:1,jn:3,cr:2.6,lean:.02,hd:-.25,grin:.8};/* 三つ投げ：三つでお手玉 */
const IMB={ua:-1.85,fa:-1.6,ua2:-1.4,fa2:-1.75,bigUp:1,cr:4.2,lean:-.04,ff:-8,fb:8,hd:-.1,grin:.2};/* 大きな岩：封印の石を頭の上へ */
const IMBT={ua:2.5,fa:2.8,ua2:2.3,fa2:2.7,bigUp:0,cr:3,lean:.42,ff:-9,fb:7,grin:1};
const impIdlePP=(P,t)=>{P.cr=(P.cr||0)+Math.abs(Math.sin(t*Math.PI/48))*.5};
const handF=J=>add(J.hip,[-5*J.k,-20*J.k]);

function imCards(f,pre,isM){const ox=isM?4:10,bg='def',S=SPEC[f],k=S.k;
 mv({f,ox,id:pre+'_idle',n:'立ち絵',bg,len:96,keys:[K(0,{}),K(96,{})],pp:impIdlePP,
  cap:isM?'石なげ小鬼より大きく、背中側の床に、門の紋章が彫られた大きな石（封印の石）を置いている。':'大きな頭に、後ろへのびた耳、かぎ鼻、にやけた口。腰に石の袋。目はにぶい色で光らない。',
  why:'子どもが遊ぶように、石を投げに来る。悪意より遊び。だから顔はいつもにやけている。'});
 if(!isM)mv({f,ox,id:pre+'_bored',n:'ひまなとき：小石を拾う',bg,len:150,
  keys:[K(0,{}),K(16,{}),K(28,{ua:2.6,fa:2.2,lean:.45,cr:4,hd:.3},'io'),K(44,{ua:2.6,fa:2.2,lean:.45,cr:4,hd:.3}),K(56,{ua:-2.6,fa:-2.6,rF:1,lean:.05,hd:-.2},'io'),K(84,{ua:-2.6,fa:-2.6,rF:1,lean:.05,hd:-.2}),K(92,{ua:-1.2,fa:-.4,rF:0,lean:-.12,hd:-.35,grin:1},'out'),K(120,{grin:1},'io'),K(150,{})],
  pp:(P,t)=>{impIdlePP(P,t);if(t>=44&&t<56)P.rF=1;if(t>=92&&t<120)P.cr+=((t>>2)&1)*.6},
  fx:(B,J,t)=>{if(t>=92&&t<130){const d=t-92;rock(B,J.head[0]+4+d*1.6,J.head[1]-6-d*1.2+d*d*.09,1.6)}},
  cap:'しゃがんで床の小石を拾い、鼻先でにおいをかいで、後ろへぽいと放る。肩をゆらして笑う。光らない。',
  why:'石は遊び道具。ここでは何を見ても遊ぶ。'});
 else mv({f,ox,id:pre+'_bored',n:'ひまなとき：封印の石を削る',bg,len:170,
  keys:[K(0,{}),K(20,{}),K(34,{ua2:.3,fa2:.15,hd:.7,lean:-.08},'io'),K(130,{ua2:.3,fa2:.15,hd:.7,lean:-.08}),K(144,{grin:1},'io'),K(170,{})],
  pp:(P,t)=>{impIdlePP(P,t);if(t>=34&&t<130)P.fa2=.15+Math.sin(t*.8)*.25},
  fx:(B,J,t)=>{if(t>=36&&t<130&&(t%6)<2){const c=[J.hip[0]+12*J.k,FL-9];for(let i=0;i<3;i++)B.set(c[0]+i-1,c[1]-((t+i)%3),ROCK[1],5)}},
  cap:'後ろ手で、背中側の大きな石の紋章を爪でガリガリ削る。石くずが飛ぶ。削り終えると、こちらを見てにやりとする。光らない。',
  why:'門の紋章は封印の印。小鬼たちは、それを遊びで壊している。封印がゆるむ理由の一つ。'});
 mv({f,ox,id:pre+'_enter',n:isM?'出現：大きな石を引きずってくる':'出現：上から飛び降りる',bg,len:110,
  keys:isM?[K(0,{x:44,ua2:.4,fa2:.2,lean:.3,bigX:0}),K(56,{x:0,ua2:.4,fa2:.2,lean:.3},'lin'),K(68,{grin:1},'io'),K(110,{})]:[K(0,{lift:70,ua:-2.4,fa:-2.2,ua2:-2.2,fa2:-2.0,cr:0}),K(18,{lift:0,ua:-2.4,fa:-2.2,ua2:-2.2,fa2:-2.0,cr:0},'in'),K(22,{cr:6,lean:.3}),K(30,{cr:1.5},'out'),K(40,{grin:1}),K(70,{grin:1}),K(90,{},'io'),K(110,{})],
  pp:(P,t)=>{if(isM&&t<56){const s=Math.sin(t*TAU_/16);P.ff=-6+s*3;P.fb=6-s*3}if(t>=40&&t<70)P.lean=(P.lean||0)+((t>>2)&1)*.06},
  fx:(B,J,t)=>{if(!isM&&t>=18&&t<26)for(let i=0;i<6;i++)B.set(J.footF[0]-6+i*3,FL-((t+i)%2),'#6a6278',5)},
  cap:isM?'背中で大きな封印の石を引きずって歩いてくる。止まって、石をぽんとたたき、にやりとする。':'上の暗がりから飛び降りて、しゃがんで着地する。ケケケと肩をゆらして笑う。',
  why:isM?'封印の石は、おかしらのお気に入りのおもちゃ。いつも持ち歩いている。':'迷宮の高いところに住みつく。どこからでも降ってくる。'});
 /* 攻撃 */
 if(!isM)mv({f,ox,id:pre+'_two',n:'二つ投げ（ヒュ・ヒュ・ヒュ・ドン・ドン）',bg,len:130,
  keys:[K(0,{}),K(8,IM2,'out'),K(26,IM2),K(28,Object.assign({},IM2,IMW1),'out'),K(30,Object.assign({},IM2,IMR1),'in'),K(39,Object.assign({},IM2,IMR1,IMW2),'out'),K(41,Object.assign({},IM2,IMR1,IMW2)),K(43,Object.assign({},IM2,IMR1,IMR2),'in'),K(60,{grin:1},'io'),K(130,{})],
  pp:(P,t)=>{if(t>=8&&t<28)P.cr+=Math.abs(Math.sin((t-8)*Math.PI/13))*.9;if(t>=30)P.rF=0;if(t>=43)P.rB=0},
  cues:[{t:30,col:'w',silent:true},{t:43,col:'w',silent:true}],hits:[30+LOB,43+LOB],
  fx:(B,J,t,S2,M)=>{const P=J.P||{};lobFx(B,t,30,handF(J),P);lobFx(B,t,43,handF(J),P)},
  cap:'袋から石を二つ出し、両手に一つずつ持って、ひざで拍をとる（手の石の数＝投げる数）。ポイ、ポイと13Fおきに二つ投げる。石は光らない。飛んでいる石がヒュ・ヒュ・ヒュと鳴るたび、足元の影が一段ずつ大きく濃くなり、その次の拍（投げてから52F）で落ちる。二つ目はその13F後。',
  why:'拍（リズム）の読み方は、おかしらで先に教わっている。光の代わりに、音と影で数える。持っている石が二つなら二つ来る。'});
 else{mv({f,ox,id:pre+'_three',n:'三つ投げ（お手玉から・ドン・ドン・ドン）',bg,len:160,
  keys:[K(0,{}),K(8,IMJ,'out'),K(26,IMJ),K(28,Object.assign({},IMJ,IMW1),'out'),K(30,Object.assign({},IMJ,IMR1),'in'),K(41,Object.assign({},IMJ,IMW1),'out'),K(43,Object.assign({},IMJ,IMR1),'in'),K(54,Object.assign({},IMJ,IMW1),'out'),K(56,Object.assign({},IMJ,IMR1),'in'),K(72,{grin:1},'io'),K(160,{})],
  pp:(P,t)=>{P.jn=t<30?3:t<43?2:t<56?1:0;if(t>=56)P.jug=0},
  cues:[{t:30,col:'w',silent:true},{t:43,col:'w',silent:true},{t:56,col:'w',silent:true}],hits:[30+LOB,43+LOB,56+LOB],
  fx:(B,J,t,S2,M)=>{const P=J.P||{};for(const t0 of[30,43,56])lobFx(B,t,t0,handF(J),P);if(t>=8&&t<56&&(t-8)%13<3)soundArc(B,add(J.sc,[-5*J.k,-18*J.k]),(t-8)%13)},
  cap:'石を三つ出して、お手玉をする（石の数＝投げる数）。お手玉は13Fの拍で、受けるたびに小さく音が鳴る。その拍のまま一つずつ投げる。石は光らない。ヒュ・ヒュ・ヒュの次の拍（投げてから52F）で落ち、13Fおきに三つ。',
  why:'拍で来る攻撃は、ここで初めて教わる（中ボスで先に出す）。お手玉の拍が、そのまま石の落ちる拍になる。数は手の石で、間はお手玉で、構えのうちに全部見えている。'});
  mv({f,ox,id:pre+'_big',n:'大きな岩（赤・重い）',bg,len:130,
   keys:[K(0,{}),K(10,IMB,'out'),K(54,IMB),K(56,Object.assign({},IMB,{lean:-.2,cr:3.6}),'out'),K(60,IMBT,'in'),K(66,IMBT),K(90,IMBT),K(110,{},'io'),K(130,{})],
   pp:(P,t)=>{if(t>=10&&t<56)P.x=(P.x||0)+(((t>>1)&1)?.6:-.6);if(t>=60)P.bigGone=1},
   cues:[{t:40,col:'r',at:J=>add(J.head,[0,-14*J.k])}],hits:[68],hitCol:'r',
   fx:(B,J,t)=>{bigFx(B,t,60,68,add(J.head,[-4,-12]),J.P||{})},
   cap:'背中側の封印の石を、両手で頭の上へ持ち上げる。重くてひざがふるえ、体が小刻みにゆれる（お手玉とはまるでちがう形）。石が赤く光り、いつもの間で、主人公へ投げつける。重い一撃。弾くと、石は三つに割れて足元に落ちる（三つとも投げ返せる）。',
   why:'中ボスだけの技（モブより一つ多い）。拍ではなく光で来るので、読み方がお手玉とまったくちがう。赤＝重い、の約束どおり。封印の石を投げてしまうほど、遊びに容赦がない。'});}
 /* パリィされ：攻撃した部位（石）が弾き落とされる。小鬼は、小＝びくっと耳が立つ、大＝地団駄を踏んで怒る */
 const kit=(kind,th,P)=>kind==='s'?{ear:-1,hd:(P.hd||0)-.25,x:(P.x||0)+1,grin:0}:{ear:1,grin:0,ua:-2.6,fa:-2.3,ua2:-2.4,fa2:-2.1,lean:-.3,hd:-.3,cr:1};
 const stamp=(P,t,Hc,stop)=>{P.parried=1;const H=Hc[Hc.length-1],d=t-H-stop;if(d>=0&&d<36){const s=(d>>2)&1;P.ff=s?-9:-5;P.fb=s?3:7;P.cr=(P.cr||0)+s*.8}};
 if(!isM)parriedCard({id:pre+'_pry',src:pre+'_two',n:'パリィされ：二つ投げ（小→大）',kit,rx:[{kind:'s'},{kind:'b'}],pp:stamp,
  fx:(B,J,t,Hc)=>rocksAtFeet(B,Hc.filter(H=>t>=H).length),
  cap:'一つ目を弾くと、石は足元に落ちる。小鬼はびくっと耳を立てる。二つ目も弾かれると、両手を振り上げて地団駄を踏む（子どものように怒る）。足元の石は、次のこうげきで投げ返せる。',
  why:'弾かれるのは小鬼ではなく石。小鬼のほうは、遊びをじゃまされた子どもの反応で返す。'});
 else{parriedCard({id:pre+'_pry',src:pre+'_three',n:'パリィされ：三つ投げ（小→大）',kit,rx:[{kind:'s'},{kind:'s'},{kind:'b'}],pp:stamp,
  fx:(B,J,t,Hc)=>rocksAtFeet(B,Hc.filter(H=>t>=H).length),
  cap:'弾いた石は一つずつ足元にたまる。おかしらは一つ弾かれるたびにびくっとし、三つ目で地団駄を踏む。たまった石は、次のこうげきでまとめて投げ返せる（小鬼のおかしらで最初に教わる）。',
  why:'投げ返しは、弾いた数だけ得をする仕組み。ここで覚えて、牙の盗賊の短剣でも使う。'});
  parriedCard({id:pre+'_prybig',src:pre+'_big',n:'パリィされ：大きな岩（三つに割れる）',kit,rx:[{kind:'b'}],pp:stamp,
   fx:(B,J,t,Hc,stop)=>{const d=t-Hc[0];if(d>=0){if(d<10)for(let i=0;i<10;i++){const a=i/10*TAU_;B.set(HEADP[0]+4+Math.cos(a)*(3+d),HEADP[1]+Math.sin(a)*(3+d)*.6,SEAL[1],5)}if(d>=4)rocksAtFeet(B,3)}},
   cap:'大きな岩を弾くと、三つに割れて足元に落ちる。おかしらは両手を振り上げて地団駄を踏む。割れた三つは、次のこうげきで投げ返せる。',
   why:'重い一撃を弾いたごほうびが、投げ返し三つぶん。封印の石は、主人公の手でさらに割られる（勝つほど、くらやみに材料を渡している）。'})}
 /* ブレイク：しりもちをついて目を回す。袋から石がこぼれる */
 const BRK=t=>({cr:7.5,lean:-.32+Math.sin(t*.1)*.04,ff:-12,fb:-3,ua:1.0,fa:.6,ua2:.8,fa2:.4,hd:.32+Math.sin(t*.13)*.12,ear:1,grin:0,x:2});
 parriedCard({id:pre+'_brk',src:isM?pre+'_big':pre+'_two',n:'ブレイク：しりもちをついて目を回す',len:isM?230:250,kit,rx:isM?[{kind:'b'}]:[{kind:'s'},{kind:'b'}],pp:stamp,brk:{at:6,P:BRK,star:J=>add(J.head,[0,-12])},
  fx:(B,J,t,Hc)=>{rocksAtFeet(B,isM?3:Hc.filter(H=>t>=H).length);const T0=Hc[Hc.length-1]+20;if(t>T0)for(let i=0;i<3;i++)rock(B,J.hip[0]+8+i*4,FL-2,impRockR(J.k)*.8)},
  cap:'四度目を弾くと、しりもちをついて、袋から石がこぼれる。後ろ手をついたまま、頭をふらふらさせて目を回す。頭の上をうすい青の星が回る。',
  why:'石を持っていない＝投げられない＝いま斬れる。小さな体に大きな頭なので、目を回す形がいちばん読みやすい。'});
 recoverCard({id:pre+'_rec',f,ox,bg,n:'ブレイク：斬られて、飛び起きる',P:BRK,idle:()=>Object.assign({},IMPOSE,{grin:.4}),snap:4,star:J=>add(J.head,[0,-12]),
  react:(P,a,b)=>{const A=kb(a,6),Bk=kb(b,8);P.hd=(P.hd||0)-.4*Math.max(A,Bk);P.ear=1},
  cap:'しりもちのまま斬られると、ぎゃっと頭をのけぞらせる。二太刀目のあと、ぴょんと飛び起きて身構える（少し低くしゃがみすぎてから収まる）。',
  why:'起きるときは一瞬。ゆっくり起きると「まだ斬れる」と勘ちがいさせる。'});
 hurtMove(f,pre+'_hurt',{react:(P,a,b)=>{const A=kb(a,6),Bk=kb(b,9),m=Math.max(A,Bk);P.lift=(P.lift||0)+4*m;P.ear=1;P.grin=0;P.lean=(P.lean||0)-.25*m;P.x=(P.x||0)+2*A+3*Bk},
  cap:'斬られると、ぎゃっと飛び上がり、耳を後ろへ寝かせる。着地すると、またにやける。',
  why:'痛がるが、こりない。遊びはやめない。'});
 /* 撃破：ひっくり返り、石がころがり、体が足元の暗がりへ沈む。石だけが残る */
 mv({f,ox,id:pre+'_down',n:'撃破：暗がりへ沈む',bg,len:140,noHero:true,
  keys:[K(0,{}),K(6,{lift:6,ear:1,lean:-.3},'out'),K(16,{cr:7.5,lean:-.4,ff:-12,fb:-3,ua:1.0,fa:.6,ua2:.8,fa2:.4,hd:.3,ear:1},'in'),K(40,{cr:7.5,lean:-.4,ff:-12,fb:-3,ua:1.0,fa:.6,ua2:.8,fa2:.4,hd:.4,ear:1}),K(100,{cr:7.5,lean:-.4,ff:-12,fb:-3,ua:1.0,fa:.6,ua2:.8,fa2:.4,hd:.4,ear:1,lift:-62},'in'),K(140,{lift:-62})],
  post:(B,J,t)=>{for(let i=0;i<B.c.length;i++){const y=i/CW|0;if(y>FL&&(B.t[i]===1||B.t[i]===2||B.t[i]===3)){B.c[i]=0;B.t[i]=0}}
   if(t>=40){const u=Math.min(1,(t-40)/60),x0=J.hip[0];for(let dx=-14;dx<=14;dx++){if(Math.abs(dx)<14*Math.min(1,u*1.5)+2&&hsh(dx,t>>3)<.8)B.set(x0+dx,FL+1,'#0c0910',5)}}
   if(t>=16){const n=isM?3:2;for(let i=0;i<n;i++){const d=Math.min(1,(t-16)/20);rock(B,J.hip[0]-6+i*7+d*(i-1)*6,FL-2,impRockR(J.k)*.9)}}},
  cap:'最後の一撃で飛び上がり、ひっくり返る。袋の石がころがり出る。しばらくして、体が足元の暗がりへずぶずぶと沈んでいく。床には石だけが残る。',
  why:'生きているものも、倒れればくらやみに拾われる。遊び道具だけが残る。何度も見るので短く。'});
}
imCards('imp','im',false);imCards('impM','imM',true);

/* 資料集に入れる */
MOVES_OF.imp=['im_idle','im_bored','im_two'];
MOVES_OF.impM=['imM_idle','imM_bored','imM_three','imM_big'];
Object.assign(MCAT_ENTER,{imp:['im_enter'],impM:['imM_enter']});Object.assign(MCAT_DOWN,{imp:['im_down'],impM:['imM_down']});Object.assign(MCAT_HURT,{imp:['im_hurt'],impM:['imM_hurt']});
Object.assign(MCAT_PARRY,{imp:['im_pry'],impM:['imM_pry','imM_prybig']});Object.assign(MCAT_BREAK,{imp:['im_brk','im_rec'],impM:['imM_brk','imM_rec']});
FORMS.push({key:'impM',ttl:'小鬼のおかしら',en:'THE STONE-TOSSING IMPS · 中ボスとモブ',stage:[],sox:62,vt:'IMV',vnote:'覚悟の段は、生きたまま浸食されていく段階。肌の色が変わるだけでなく、赤い段から頭に黒い筋、黒い段から腕にも筋が走って額に光らない目が一つ開き、紫の段では目が三つになる。石（攻撃の道具）の色はどの段でも変えない。',
 variants:[['n','緑の肌'],['r','赤い肌。頭に黒い筋'],['k','黒い肌。腕にも筋、額に目'],['v','紫の肌。目が三つ']],
 lore:'迷宮に住みつく小鬼たち。拍に合わせて石を投げるのは、遊び歌のようなもの。悪意より遊び。おかしらがいつも持ち歩く大きな石には、門の紋章が彫られている。封印の石を、遊びで削り、投げ、壊している。',
 parts:[['大きな頭とにやけた口','いつも遊んでいる顔。斬られても、こりずにまたにやける'],['手の石・お手玉','持っている石の数＝投げる数。お手玉の拍＝落ちる拍（いちばん大事な原則）'],['腰の石の袋','ブレイクでこぼれる。石がない＝投げられない＝すき'],['封印の石（おかしら）','門の紋章（閉じた門）が彫られた石。遊びで削られ、欠けている。大きな岩の技で投げる'],['光らない石','攻撃は音（ポイ・ヒュ・ヒュ・ヒュ）と足元の影で読む。大きな岩だけが赤く光る']],
 pal:[['#5e7a3a','緑の肌','光らない'],['#7a6e66','石','投げる石。弾くと足元に落ちる'],['#5e5a66','封印の石','門の紋章（くすんだ金）'],['#a85a3a','にぶい目','光らない']],
 pair:{key:'imp',ttl:'石なげ小鬼（モブ）',diff:[['同じ骨格','人型（小さい）。おかしらは1.25倍で、封印の石を持ち歩く'],['技','モブは「二つ投げ」。おかしらは「三つ投げ」＋「大きな岩（赤）」。拍で来る攻撃と投げ返しは、おかしらで先に教わる'],['構え','両手に一つずつ＝二つ。お手玉＝三つ。石を頭の上へ＝大きな岩']]}});
FORMS.push({key:'imp',ttl:'石なげ小鬼',en:'MOB · 小鬼のおかしらと同じ骨格',stage:[],sox:62,vt:'IMV',vnote:'覚悟の段は小鬼のおかしらと同じ（黒い筋、額の目、目が三つ）。',
 variants:[['n','緑の肌'],['r','赤い肌'],['k','黒い肌。額に目'],['v','紫の肌。目が三つ']],
 lore:'迷宮に住みつく小鬼。上の暗がりから降ってきて、石を二つ投げる。ひまなときは床の小石を拾っては放って遊ぶ。',
 parts:[['両手の石','二つ持っていたら二つ来る'],['腰の石の袋','ブレイクでこぼれる'],['光らない石','音と影で読む']],
 pal:[['#5e7a3a','緑の肌','光らない'],['#7a6e66','石','投げる石']]});
