/* ===== 居合の剣士・居合のおかしら（中ボスとモブの三組目） =====
   人を斬るために降りてきた者たち（純粋な悪）。斬った者をくらやみに差し出し、力をもらっているつもりでいる。
   くらやみの側は、そんなつもりもなく、気にも留めていない。彼らが「力」だと思っているものは、ただの浸食。
   見た目の決まり：
   - 人型の剣士の骨格（影の剣士と同じ系統の骨組み）。深くかぶった笠で顔は見えない。笠の下に、光らない暗い目が二つ。
   - 刀はいつも鞘の中。抜くのは斬る一瞬だけ（途中は描かない）。合図は笠の下の目に出る（本気の赤い騎士の「目の光」の居合を、ここで先に教わる）。
   - 刀を持つ右腕が黒く染まっている（浸食）。本人は力だと思っている。おかしらは肩まで、首にも筋。覚悟の段が上がるほど広がる。
   - おかしらの鞘には、斬った数だけ刻み。
   - 返しの構えは「鯉口を切って、鞘の口から刃が少し見える」。居合の構えとの違いはこの銀色（本気の赤い騎士も同じ決まり）。
   - 構えで技を見分ける：居合＝腰を落として柄に手をかける／二の太刀（おかしら）＝さらに低く、左手で鞘を背中へ大きく引き上げる（鞘引き）。 */
const W_KATA={type:'long',len:20,w:1,col:'#c8ccd8',hi:'#ffffff',lo:'#6a7088',guard:'#2a2420',guardHi:'#6a5a40',grip:'#1a1420',gw:1.5};
/* 覚悟の段：浸食が広がる段階。lv＝浸食の深さ（モブ0から、おかしらは+1） */
const SMV={
 n:{lbl:'覚悟1 ふつう',name:'居合の剣士',lv:0,robe:['#3a4468','#5a6890','#1e2440']},
 r:{lbl:'覚悟2 赤い',name:'赤い居合の剣士',lv:1,robe:['#5a2a38','#80404e','#2e121c']},
 k:{lbl:'覚悟3 黒い',name:'黒い居合の剣士',lv:2,robe:['#26222e','#3e3848','#100e16']},
 v:{lbl:'覚悟4 紫の',name:'紫の居合の剣士',lv:3,robe:['#3a2458','#563880','#1c0e2e']}};
const INK2=['#141018','#2a2234','#08060c'],SMEYE='#6a2a2a',SMEYE2='#7a2a4a',STRAW=['#7a6a48','#a08a5e','#3e3422'];
/* 鞘：腰から後ろ上へ。sa＝鞘の角度、koi＝鯉口を切る（刃が少し見える）、notch＝刻みの数 */
function smSheath(B,J,T,P,S){const k=J.k,a=add(J.hip,[-1*k,1*k]),sa=P.sa==null?-.37:P.sa,b=add(a,dir(sa,19*k));
 B.thick(a,b,1.2*k,'#1e1418','#3a2a30','#0c0608');B.disc(...b,1*k,'#6a5a40','#8a7a58',OUT);
 for(let i=0;i<(S.notch||0);i++){const q=add(a,dir(sa,(6+i*1.2)*k));B.set(q[0],q[1]-1,(P.notchHi!=null&&Math.abs(P.notchHi-i)<.5)?'#d8c8a0':'#8a7a5e',2)}
}

const sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],mul=(a,s)=>[a[0]*s,a[1]*s],norm=a=>{const l=Math.hypot(a[0],a[1])||1;return[a[0]/l,a[1]/l]};
/* 笠と顔。hat＝笠がはね上がって顔がのぞく（0〜1）、drop＝笠が落ちる（0〜1） */
function smHead(B,R,k,T,P){const lv=P._lv||0,h=P.hat||0;
 B.poly([R([-3.2*k,3.6*k]),R([3*k,3.6*k]),R([3.4*k,-.5*k]),R([-3.4*k,-.5*k])],'#2a2026','#4a3a40','#120a0e');/* 顔は暗い */
 if(h>.3){/* のぞいた顔：黒い筋が頬をのぼり、口が笑っている */for(let i=0;i<3;i++)B.set(...R([(-2.6+i*.4)*k,(3.2-i*.9)*k]),INK2[0],2);B.line(...R([-2.8*k,2.6*k]),...R([-1*k,2.9*k]),'#8a4a4a')}
 const eyes=[[-2.6,1.2],[-1.2,1.2]];if(lv>=3)eyes.push([-1.9,2.4]);for(const e of eyes)B.set(...R([e[0]*k,e[1]*k]),lv>=3?SMEYE2:SMEYE,2);
 if(P.drop>0)return;/* 落ちた笠は別に描く */
 const tilt=-h*.6,lift=h*3,Q=v=>{const c=Math.cos(tilt),s=Math.sin(tilt);return R([v[0]*c-v[1]*s,v[0]*s+v[1]*c-lift*k])};
 const tat=lv>=2;B.poly([Q([-9.5*k,.2*k]),Q([-4*k,-2.6*k]),Q([.6*k,-5.4*k]),Q([5*k,-2.8*k]),Q([9*k,.2*k]),Q([0,-.6*k])],STRAW[0],STRAW[1],STRAW[2]);
 for(let x=-8;x<=8;x+=2)B.set(...Q([x*k,-.1*k]),STRAW[2],2);/* 編み目 */
 if(tat)for(const x of[-9,-6.5,7.5])B.set(...Q([x*k,1*k]),STRAW[2],2)/* ほつれ */}
function smHatOnFloor(B,x,y,lv){const c=STRAW;for(let i=-8;i<=8;i++){B.set(x+i,y,c[i<-3?2:i<3?1:0],2);if(Math.abs(i)<6)B.set(x+i,y-1,c[i<0?1:0],2);if(Math.abs(i)<3)B.set(x+i,y-2,c[1],2)}B.set(x-9,y,OUT,2);B.set(x+9,y,OUT,2)}
function smHilt(B,J,P){const k=J.k,a=add(J.hip,[-1*k,1*k]),sa=P.sa==null?-.37:P.sa;
 if(P.sheath){/* 柄：手で握っているときは手のほうへ向く */const koi=P.koi||0,u=P.grip?norm(sub(J.hdF,a)):dir(sa+Math.PI,1),m=add(a,mul(u,koi*5*k)),g=add(m,mul(u,6*k));
  if(koi)B.thick(a,m,.9*k,'#d8dce8','#ffffff','#6a7088');B.thick(add(m,[-u[1]*1.6*k,u[0]*1.6*k]),add(m,[u[1]*1.6*k,-u[0]*1.6*k]),.8*k,'#2a2420','#6a5a40',OUT);B.thick(m,g,1*k,'#1a1420','#3a2a30',OUT)}}
/* 浸食：刀を持つ右腕から広がる黒。光らない */
function smInk(B,J,T,P,S){smHilt(B,J,P);const k=J.k,lv=(S.lvBase||0)+(P._lv||0);
 B.thick(J.elF,J.hdF,1.6*k,INK2[0],INK2[1],INK2[2]);B.disc(J.hdF[0],J.hdF[1],1.7*k,INK2[0],INK2[1],INK2[2]);
 if(lv>=1){B.thick(J.shF,J.elF,1.5*k,INK2[0],INK2[1],INK2[2]);for(let i=0;i<4;i++){const t=i/4;B.set(lerp(J.shF[0],J.neck[0],t)+(i%2),lerp(J.shF[1],J.neck[1],t)-i,INK2[1],2)}}
 if(lv>=2)for(let j=0;j<3;j++){const s=add(J.shF,[j*1.5*k,1*k]);for(let i=0;i<5+j*2;i++)B.set(s[0]+i*.6*k+Math.sin(i+j)*.6,s[1]+i*1*k,INK2[(i+j)%2],2)}
 if(lv>=3){for(const e of[[.35,1],[.7,-1]]){const q=[lerp(J.elF[0],J.hdF[0],e[0]),lerp(J.elF[1],J.hdF[1],e[0])];B.set(q[0]+e[1],q[1],SMEYE2,2)}}}
function smDraw(B,ox,oy,S,P0,T){const P=Object.assign({},PDEF,S.pose,P0||{}),V=SMV[P.tint]||SMV.n;P._lv=V.lv;
 const S2=Object.assign({},S,{pal:Object.assign({},S.pal,{arm:V.robe[0],armHi:V.robe[1],armLo:V.robe[2],chest:V.robe[0]}),tabard:Object.assign({},S.tabard,{col:V.robe[0],hi:V.robe[1],lo:V.robe[2]}),mid:null});
 const J=knight(B,ox,oy,S2,P,T);
 if(P.drop>0){const f=Math.min(1,P.drop),hx=lerp(J.head[0],J.head[0]+10,f),hy=lerp(J.head[1]-3,FL,Math.pow(f,1.6));if(f<1){const W=new Buf(B.w,B.h);smHead(W,v=>add([hx,hy],rot(v,f*1.4)),S.k*S.hk,T,Object.assign({},P,{drop:0,hat:0}));for(let i=0;i<W.c.length;i++)if(W.c[i]&&(W.c[i]===STRAW[0]||W.c[i]===STRAW[1]||W.c[i]===STRAW[2])){B.c[i]=W.c[i];B.t[i]=2}}else smHatOnFloor(B,Math.round(hx),FL-1,V.lv)}
 return J}
const SMBASE={hk:1.2,lk:.92,pal:Object.assign({},PAL.guard,{trim:'#6a5030',trimHi:'#9a7a48',trimLo:'#3a2a18',glove:'#2a2026',under:'#22202c',underHi:'#34303e',underLo:'#121018',foot:'#2a2228',footHi:'#4a3e44'}),
 helm:{type:'kasa',extra:smHead},cape:null,tabard:{len:12,col:'#3a4468',hi:'#5a6890',lo:'#1e2440'},w:W_KATA,
 sheath:(B,J,T,P)=>smSheath(B,J,T,P,SPEC[P._who]||SMBASE),front:(B,J,T,P)=>smInk(B,J,T,P,SPEC[P._who]||SMBASE)};
Object.assign(PDEF,{sa:-.37,koi:0,grip:0,hat:0,drop:0,notchHi:null});
SPEC.samurai=Object.assign({},SMBASE,{name:'居合の剣士',k:.86,lvBase:0,notch:0,draw:(B,ox,oy,S,P,T)=>smDraw(B,ox,oy,S,Object.assign({},P,{_who:'samurai'}),T),knightLike:true,tintable:true,
 pose:{ua:1.5,fa:1.75,sw:null,sheath:1,ua2:1.55,fa2:2.5,ff:-5,fb:5,cr:.8,lean:.04}});
SPEC.samuraiM=Object.assign({},SMBASE,{name:'居合のおかしら',k:1.075,lvBase:1,notch:9,mid:true,draw:(B,ox,oy,S,P,T)=>smDraw(B,ox,oy,S,Object.assign({},P,{_who:'samuraiM'}),T),knightLike:true,tintable:true,
 pose:{ua:1.5,fa:1.75,sw:null,sheath:1,ua2:1.55,fa2:2.5,ff:-5,fb:5,cr:.8,lean:.04}});
for(const k of['samurai','samuraiM'])SPEC[k+'@w']=flashSpec(k);

/* 構え */
const SMI={ua:1.5,fa:1.75,sw:null,sheath:1,grip:0,koi:0,sa:-.37,ua2:1.55,fa2:2.5,ff:-5,fb:5,cr:.8,lean:.04,hd:0};/* 待機：自然体。左手は鞘、右手は下げたまま */
const SMK={ua:1.95,fa:1.55,sw:null,sheath:1,grip:1,sa:-.3,ua2:1.35,fa2:2.6,ff:-11,fb:8,cr:4,lean:.22,hd:.12};/* 居合の構え：腰を落として柄に手 */
const SMR=Object.assign({},SMK,{cr:5.3,lean:.28,ff:-12,fb:9,koi:1});/* 返しの構え：さらに沈み、鯉口を切る（刃が見える） */
const SMN={ua:2.15,fa:1.3,sw:null,sheath:1,grip:1,sa:-1.05,ua2:.25,fa2:-.35,ff:-13,fb:10,cr:6,lean:.36,hd:.2};/* 二の太刀の構え：さらに低く、左手で鞘を背中へ引き上げる */
const SMS={ua:3.08,fa:3.12,sw:3.16,ua2:.6,fa2:.1,sheath:0,grip:0,sa:-.5,x:-40,lean:.26,cr:4.6,ff:-14,fb:10,hd:.05};/* 一閃（抜いた瞬間＝当たり） */
const SMF=Object.assign({},SMS,{ua:2.5,fa:2.05,sw:2.45,lean:.22,cr:4});/* 血振り */
const SMU={ua:-2.2,fa:-1.95,sw:-1.55,ua2:-2.0,fa2:-1.7,sheath:0,x:-40,lean:-.06,cr:3,ff:-13,fb:10,hd:-.05};/* 頭上へ返す */
const SMD={ua:2.7,fa:2.45,sw:2.3,ua2:2.6,fa2:2.35,sheath:0,x:-42,lean:.34,cr:4.8,ff:-14,fb:10};/* 唐竹（打ち下ろし） */
const SMDF=Object.assign({},SMD,{ua:2.95,fa:2.9,sw:3.05,lean:.38,cr:5});/* 振り切り */
const SMUP={ua:-2.45,fa:-2.75,sw:-2.0,ua2:.4,fa2:.8,sheath:0,x:-26,lean:.0,cr:2.4,ff:-15,fb:11,grip:0};/* 返し斬り：抜きざまの斬り上げ */
const eyeAt=J=>add(J.head,[-2.4*J.k*1.2,1.2*J.k*1.2]);
const issen=(B,t,h,col)=>{const d=t-h;if(d<0||d>=9)return;const y=FL-14;for(let x=0;x<CW;x++)if((x+t)%9<7-d*.6)B.set(x,y,col||'#ffffff',4);if(d<3)for(let x=HXX;x<EXX;x++)B.set(x,y-1,'#bfe8ff',4)};
const smIdlePP=(P,t)=>{P.cr=(P.cr||0)+Math.sin(t*TAU_/96)*.35};

function smCards(f,pre,isM){const ox=isM?4:8,bg='def',nm=isM?'居合のおかしら':'居合の剣士',S=SPEC[f];
 mv({f,ox,id:pre+'_idle',n:'立ち絵',bg,len:96,keys:[K(0,SMI),K(96,SMI)],pp:smIdlePP,
  cap:isM?'居合の剣士より大きい。右腕は肩まで黒く、首にも黒い筋。鞘には、斬った数だけ刻みがある。':'深い笠で顔は見えない。笠の下に、光らない暗い目が二つ。刀を持つ右腕が、手首から肘まで黒い。刀はいつも鞘の中。',
  why:'刀を見せない＝読めるのは目の光だけ、という居合の約束を立ち絵から見せる。黒い腕は、本人が力だと思っている浸食。'});
 /* ひまなとき */
 if(!isM)mv({f,ox,id:pre+'_bored',n:'ひまなとき：黒い手を見る',bg,len:170,
  keys:[K(0,SMI),K(24,SMI),K(36,Object.assign({},SMI,{ua:2.9,fa:-2.5,hd:.25,lean:.0}),'io'),K(60,Object.assign({},SMI,{ua:2.9,fa:-2.2,hd:.25})),K(70,Object.assign({},SMI,{ua:2.9,fa:-2.6,hd:.25})),K(80,Object.assign({},SMI,{ua:2.9,fa:-2.2,hd:.25})),K(120,Object.assign({},SMI,{ua:2.9,fa:-2.5,hd:.25})),K(134,SMI,'io'),K(170,SMI)],
  pp:(P,t)=>{smIdlePP(P,t);if(t>=84&&t<120)P.cr+=((t>>2)&1)*.5},
  cap:'黒く染まった右手を顔の前へ上げ、握っては開いて、しげしげと見る。肩が小さく揺れる（笑っている）。それから手を下ろす。光らない。',
  why:'くらやみから力をもらったつもりでいる。実際は浸食されているだけ。プレイヤーには「それは力じゃない」と分かる。'});
 else mv({f,ox,id:pre+'_bored',n:'ひまなとき：刻みを数える',bg,len:190,
  keys:[K(0,SMI),K(24,SMI),K(38,Object.assign({},SMI,{sa:.15,ua2:1.9,fa2:1.2,hd:.45,lean:.12}),'io'),K(120,Object.assign({},SMI,{sa:.15,ua2:1.9,fa2:1.2,hd:.45,lean:.12})),K(132,Object.assign({},SMI,{sa:.15,ua2:1.9,fa2:1.2,hd:-.05,lean:.06}),'io'),K(160,Object.assign({},SMI,{sa:.15,ua2:1.9,fa2:1.2,hd:-.05})),K(176,SMI,'io'),K(190,SMI)],
  pp:(P,t)=>{smIdlePP(P,t);P.notchHi=t>=40&&t<120?Math.floor((t-40)/9):null},
  cap:'鞘を前へ傾け、うつむいて、刻みを一つずつ指でなぞる（なぞった刻みが白くなる）。数え終わると顔を上げ、主人公をじっと見る。光らない。',
  why:'次の刻みは、目の前の主人公。斬った数を誇るのは、それが力になると信じているから。'});
 /* 出現 */
 mv({f,ox,id:pre+'_enter',n:'出現：歩いてきて笠を上げる',bg,len:130,
  keys:[K(0,Object.assign({},SMI,{x:44})),K(48,Object.assign({},SMI,{x:0}),'lin'),K(60,SMI),K(70,Object.assign({},SMI,{ua:-2.6,fa:-1.0,hat:.45}),'out'),K(96,Object.assign({},SMI,{ua:-2.6,fa:-1.0,hat:.45})),K(106,SMI,'io'),K(130,SMI)],
  pp:(P,t)=>{if(t<48){const s=Math.sin(t*TAU_/16);P.ff=-5+s*4;P.fb=5-s*4;P.cr=(P.cr||0)+Math.abs(s)*.6}},
  cap:'ゆっくり歩いてきて止まる。笠のふちを指で上げ、主人公を値踏みするように見る（暗い顔と黒い筋が一瞬のぞく）。笠を下ろして、自然体で待つ。',
  why:'構えずに歩いてくる＝相手をなめている。斬ることしか考えていない者の余裕。'});
 /* 居合 */
 mv({f,ox,id:pre+'_iai',n:'居合（待ちは短いときと長いとき）',bg,len:160,
  keys:[K(0,SMI),K(10,SMK,'out'),K(40,SMK),K(67,Object.assign({},SMK,{cr:4.3})),K(68,SMS,'snap'),K(92,SMS),K(98,SMF,'out'),K(108,SMF),K(116,Object.assign({},SMK,{x:-40,grip:1}),'snap'),K(124,Object.assign({},SMK,{x:-40})),K(150,SMI,'io'),K(160,SMI)],
  cues:[{t:40,col:'w',at:eyeAt}],hits:[68],trails:[[66,69,'w',0,'line']],
  fx:(B,J,t)=>{issen(B,t,68);chinRing(B,J,t,116)},
  cap:'腰を落として柄に手をかけ、止まる。構えたまま待つ長さは、短いときと長いときがある。笠の下の目が白く光った瞬間から数えて、いつもの間で来る。見えるのは光と、斬ったあとだけ。斬ったまま止まり（残心）、血を振って、チンと納める。',
  why:'待つ長さで揺さぶられても、合図から当たりまでは他と同じ。見るのは刀ではなく目（刀は見えないので）。本気の赤い騎士の居合の、最初の練習。'});
 /* 返しの構え・返し斬り */
 mv({f,ox,id:pre+'_kamae',n:'返しの構え',bg,len:120,keys:[K(0,SMI),K(10,SMR,'out'),K(120,SMR)],pp:(P,t)=>{if(t<10)P.koi=t/10},
  cap:'居合の構えより深く沈み、鯉口を切る。鞘の口から刃が少しだけ見える（居合の構えとの違いは、この銀色）。このあいだに斬りかかると、返される。まほうなら崩せる。',
  why:'「構えに斬ると返される」のルールを、ここで先に教える（赤い騎士たちで試される）。見分ける場所を一つ（鞘の口の銀色）に絞る。'});
 mv({f,ox,id:pre+'_counter',n:'返し斬り（赤）',bg,len:150,heroP:t=>t>=14&&t<30?HA:null,
  keys:[K(0,SMR),K(22,SMR),K(26,Object.assign({},SMR,{lean:.12,cr:4.6,x:2})),K(32,Object.assign({},SMR,{cr:6,lean:.34,ff:-14,fb:10}),'out'),K(55,Object.assign({},SMR,{cr:6.1,lean:.36,ff:-14,fb:10})),K(56,SMUP,'snap'),K(60,Object.assign({},SMUP,{ua:-2.15,fa:-2.25,sw:-1.65}),'out'),K(90,Object.assign({},SMUP,{ua:-2.15,fa:-2.25,sw:-1.65})),K(104,Object.assign({},SMF,{x:-26}),'io'),K(112,Object.assign({},SMK,{x:-26,grip:1}),'snap'),K(140,SMI,'io'),K(150,SMI)],
  cues:[{t:28,col:'r',at:eyeAt}],hits:[56],hitCol:'r',trails:[[53,58,'r',0,'arc']],
  fx:(B,J,t)=>{if(t>=22&&t<30)spark(B,Math.round(J.hip[0]-6),Math.round(J.hip[1]+1),t-22,'w');chinRing(B,J,t,112)},
  cap:'返しの構えに斬りかかると、鞘ごと受け流される。すぐに目が赤く光り、さらに深く沈んで、いつもの間で抜きざまに下から斬り上げる（赤、重い）。弾けば居合返し（構えが崩れる）。',
  why:'受けるのは刀ではなく鞘。もう鯉口を切っているので、受けた手のまま抜ける。重い返しなので赤。'});
 if(isM){/* 二の太刀（中ボスだけ）：構えで見分ける。居合の構えより低く、鞘を背中へ大きく引き上げる */
  mv({f,ox,id:pre+'_ni',n:'二の太刀（中ボスだけ）',bg,len:170,
   keys:[K(0,SMI),K(10,SMN,'out'),K(55,SMN),K(56,SMS,'snap'),K(59,SMS),K(63,SMU,'out'),K(70,SMU),K(73,SMD,'in'),K(78,SMDF,'out'),K(100,SMDF),K(110,SMF,'io'),K(122,Object.assign({},SMK,{x:-42,grip:1}),'snap'),K(160,SMI,'io'),K(170,SMI)],
   cues:[{t:28,col:'w',at:eyeAt},{t:45,col:'w',at:eyeAt}],hits:[56,73],trails:[[54,57,'w',0,'line'],[70,75,'w',0,'arc']],
   fx:(B,J,t)=>{issen(B,t,56);chinRing(B,J,t,122)},
   cap:'居合の構えより低く沈み、左手で鞘を背中へ大きく引き上げて止まる（鞘引き）。目が白く二度光る。居合で斬り、斬った形で一瞬止まって、刀を頭上へ返して止まり、真上から打ち下ろす（二の太刀）。',
   why:'中ボスだけの技（モブより1つ多い）。何回来るかは構えで分かる：腰を落として柄に手＝一太刀、さらに低く鞘を背へ引く＝二太刀。予兆までの形が同じで数だけちがう技は作らない。根拠：2022-11-11「攻撃モーションの内訳」（構えは相手に次の行動を促すポーズ）。'});
 }
 /* パリィされ：刀がはね上がり、笠がはね上がって、暗い顔と黒い筋がのぞく */
 const kit=knightKit({}),hatPP=(P,t,Hc,stop)=>{const H=Hc[Hc.length-1],d=t-H;if(d>=0)P.hat=d<stop?Math.min(1,(d+1)/4):Math.max(0,1-(d-stop-14)/14)};
 parriedCard({id:pre+'_pry',src:isM?pre+'_ni':pre+'_iai',n:isM?'パリィされ：二の太刀（小→大）':'パリィされ：居合',kit,minX:-30,rx:isM?[{kind:'s',th:false},{kind:'b',th:false}]:[{kind:'b',th:false}],pp:hatPP,
  cap:isM?'一太刀目を弾かれると、刀がはね上がるが、そのまま頭上へ返して二太刀目へつなぐ。二太刀目を弾かれると、刀ごと腕がはね上げられてのけぞり、笠がはね上がって、黒い筋の走った顔が一瞬のぞく。':'一閃を弾かれると、刀ごと腕がはね上げられてのけぞる。笠がはね上がって、黒い筋の走った顔が一瞬のぞく。すぐに笠を下ろし、納めて構え直す。',
  why:'見えない速さの刀も、弾けば止まって見える。顔がのぞくのは、弾いた者だけのごほうび（何者かが少し分かる）。'});
 /* ブレイク：返し斬りを弾く（居合返し）と構えが崩れる */
 const BRK=t=>noStab(f,Object.assign({},S.pose,{x:2,ua:1.55,fa:1.75,sw:2.3+Math.sin(t*.05)*.05,sheath:0,grip:0,ua2:1.4,fa2:1.3,sa:-.6,lean:.26+Math.sin(t*TAU_/40)*.03,hd:.45,cr:3.2+Math.sin(t*TAU_/40)*.4,hat:.35}));
 parriedCard({id:pre+'_brk',src:pre+'_counter',n:'ブレイク：居合返しで構えが崩れる',len:220,kit,minX:-22,rx:[{kind:'b',th:false}],brk:{at:6,P:BRK,star:J=>add(J.head,[0,-12])},pp:hatPP,
  cap:'返し斬りを弾く（居合返し）と、刀がはね上げられて、構えが崩れる。抜き身の刀が床近くまで垂れ、鞘は腰からずれ、笠が傾いたまま、肩で速く息をする。頭の上を、うすい青の星が回る。',
  why:'刀を抜いたまま納められない＝居合ができない＝いま斬れる。いつも鞘の中にある刀が出ていることが、すきの印。'});
 recoverCard({id:pre+'_rec',f,ox,bg,n:'ブレイク：斬られて、納め直す',P:BRK,idle:()=>Object.assign({},SMK),snap:5,star:J=>add(J.head,[0,-12]),
  react:(P,a,b)=>{const A=kb(a,6),Bk=kb(b,8);P.lean-=.2*A+.25*Bk;P.x+=2*A+3*Bk},after:(P,d)=>{if(d>=2){P.sheath=1;P.sw=null;P.grip=1;P.hat=0}},fx:(B,J,t,R0)=>chinRing(B,J,t,R0+2),
  cap:'崩れたまま斬られると、のけぞる。二太刀目のあと、一瞬で刀を鞘へ納め（チン）、腰を落とした居合の構えに戻る（少し沈みすぎてから収まる）。',
  why:'納めた瞬間に、またいつもの「刀が見えない」状態に戻る。崩れているあいだだけが、刀の見える時間。'});
 /* やられ：浸食の黒がにじむ。血ではない */
 hurtMove(f,pre+'_hurt',{react:(P,a,b)=>{const A=kb(a,6),Bk=kb(b,9);P.lean=(P.lean||0)-.25*A-.3*Bk;P.x=(P.x||0)+2*A+3*Bk;P.hd=(P.hd||0)-.2*Math.max(A,Bk);P.hat=.5*Math.max(A,Bk)},
  fx:(B,J,t,a,b,hp)=>{ooze(B,hp,a,6,[INK2[0],INK2[1]]);ooze(B,[hp[0]+1,hp[1]-3],b,7,[INK2[0],INK2[1],'#3a2a4a'])},
  cap:'斬られると、のけぞって笠がはね上がる。傷から出るのは血ではなく、黒いもの（右腕と同じ浸食）。',
  why:'もう中まで浸食されている。本人は気づいていない。'});
 /* 撃破：ひざをつき、笠が落ち、腕の黒が一気に全身へ広がって、崩れる。くらやみは迎えにも来ない */
 mv({f,ox,id:pre+'_down',n:'撃破：浸食に崩れる',bg,len:150,noHero:true,
  keys:[K(0,SMI),K(6,Object.assign({},SMI,{lean:-.3,hd:-.3,x:4}),'out'),K(26,Object.assign({},SMI,{kn:1,lean:.35,hd:.35,ua:1.6,fa:1.5,ua2:1.4,fa2:1.6,x:4}),'in'),K(150,Object.assign({},SMI,{kn:1,lean:.38,hd:.42,ua:1.6,fa:1.5,ua2:1.4,fa2:1.6,x:4}))],
  pp:(P,t)=>{P.drop=t<20?0:Math.min(1,(t-20)/14)},
  post:(B,J,t)=>{const c=J.hdF;if(t<40)return;const u=Math.min(1,(t-40)/30),R=u*40,v=t<84?0:Math.min(1,(t-84)/40);
   for(let i=0;i<B.c.length;i++){const ty=B.t[i];if(ty!==1&&ty!==2)continue;const col=B.c[i];if(col===STRAW[0]||col===STRAW[1]||col===STRAW[2]){if(i/CW>FL-4)continue}const x=i%CW,y=i/CW|0,d=Math.hypot(x-c[0],y-c[1]);
    if(d<R+hsh(x,y)*6){if(v>0&&hsh(x*3,y*5)<v*1.7*(1.2-(FL-y)/50)){B.c[i]=0;B.t[i]=0;continue}B.c[i]=(x+y)%3?INK2[0]:INK2[1]}}
   if(v>0)for(let i=0;i<14;i++){const h=hsh(i,9),x=c[0]-14+h*30,y=FL-2-((t-84)*.35+hsh(9,i)*10)%18;if(hsh(i,t>>3)<1-v*.6)B.set(x,y,INK2[1],5)}},
  cap:'最後の一撃でのけぞり、ひざをつく。笠が落ちる。右腕の黒が一気に全身へ広がり、体ごと黒く染まって、下から崩れて消える。床には笠だけが残る。',
  why:'力だと思っていたものが、最後に本人をのみこむ。くらやみは迎えにも来ない（気にも留めていない）。何度も見るので短く。'});
}
smCards('samurai','sm',false);smCards('samuraiM','smM',true);

/* 資料集に入れる */
MOVES_OF.samurai=['sm_idle','sm_bored','sm_iai','sm_kamae','sm_counter'];
MOVES_OF.samuraiM=['smM_idle','smM_bored','smM_iai','smM_ni','smM_kamae','smM_counter'];
Object.assign(MCAT_ENTER,{samurai:['sm_enter'],samuraiM:['smM_enter']});Object.assign(MCAT_DOWN,{samurai:['sm_down'],samuraiM:['smM_down']});Object.assign(MCAT_HURT,{samurai:['sm_hurt'],samuraiM:['smM_hurt']});
Object.assign(MCAT_PARRY,{samurai:['sm_pry'],samuraiM:['smM_pry']});Object.assign(MCAT_BREAK,{samurai:['sm_brk','sm_rec'],samuraiM:['smM_brk','smM_rec']});
FORMS.push({key:'samuraiM',ttl:'居合のおかしら',en:'THE DRAWN-BLADE KILLERS · 中ボスとモブ',stage:[],sox:62,vt:'SMV',vnote:'覚悟の段は、浸食が広がる段階。着物の色が変わるだけでなく、右腕の黒が肩・首・胸へと広がり（おかしらは一段先）、黒い段から笠のふちがほつれ、紫の段では笠の下と黒い腕に、光らない目が増える。刀（合図は目に出る）と目の位置は、どの段でも変えない。',
 variants:[['n','藍の着物。右腕が黒い'],['r','赤い着物。黒が肩と首へ'],['k','黒い着物。黒が胸へ、笠がほつれる'],['v','紫の着物。目が増える']],
 lore:'人を斬るために、迷宮へ降りてきた者たち。斬った者をくらやみに差し出し、そのかわりに力をもらっているつもりでいる。だが、くらやみの側にはそんなつもりもなく、気にも留めていない。彼らが「力」だと思っているものは、ただの浸食。おかしらの鞘には、斬った数だけ刻みがある。',
 parts:[['深い笠','顔を見せない。笠の下の暗い目だけが見える。合図はこの目に出る'],['鞘の中の刀','抜くのは斬る一瞬だけ。途中は見えない。読めるのは目の光と、斬ったあと'],['黒い右腕','本人は力だと思っている浸食。斬るほど広がる（おかしらは肩まで、首にも筋）'],['鞘の刻み（おかしら）','斬った数。ひまなときに数えている。次の刻みは主人公'],['鯉口の銀色','返しの構えの印。居合の構えとの違いはここだけ'],['鞘引き（おかしら）','左手で鞘を背中へ引き上げた低い構え＝二の太刀が来る']],
 pal:[['#3a4468','藍の着物','光らない'],['#141018','黒い右腕','浸食。光らない'],['#7a6a48','笠','顔をかくす'],['#6a2a2a','笠の下の目','ふだんは光らない。合図のときだけ白く光る']],
 pair:{key:'samurai',ttl:'居合の剣士（モブ）',diff:[['同じ骨格','人型の剣士。おかしらは1.25倍で、黒が肩まで、鞘に刻み'],['技','モブは「居合」「返しの構え→返し斬り」。おかしらは＋「二の太刀」。「構えに斬ると返される」は、おかしらで先に教わる'],['構え','居合＝腰を落として柄に手。二の太刀＝さらに低く鞘を背へ引く。返しの構え＝鯉口の銀色']]}});
FORMS.push({key:'samurai',ttl:'居合の剣士',en:'MOB · 居合のおかしらと同じ骨格',stage:[],sox:62,vt:'SMV',vnote:'覚悟の段は居合のおかしらと同じ（黒が広がる、笠がほつれる、目が増える）。',
 variants:[['n','藍の着物。右腕が黒い'],['r','赤い着物。黒が肩と首へ'],['k','黒い着物。黒が胸へ'],['v','紫の着物。目が増える']],
 lore:'人を斬るために降りてきた剣士の一人。技は「居合」と「返しの構え→返し斬り」。ひまなときは、黒く染まった右手を眺めて笑っている（力をもらったつもりでいる）。',
 parts:[['深い笠','合図は笠の下の目に出る'],['鞘の中の刀','途中は見えない'],['黒い右腕','手首から肘まで。浸食']],
 pal:[['#3a4468','藍の着物','光らない'],['#141018','黒い右腕','浸食']]});
