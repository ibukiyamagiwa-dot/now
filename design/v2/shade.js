/* ===== 影の剣士・うそつきの影（中ボスとモブの二組目） =====
   倒れた剣士の「影」だけが、くらやみに拾われた。影はまねるだけなので「ふり」をする（フェイント）。
   見た目の決まり：
   - 体は平たい影（陰影は3段だけ、光らない）。目はない（影に目はない）。背中側の内側1画素だけ明るくして、暗い背景に溶けないようにする。
   - 剣だけは、体より明るい灰紫。合図はいつも剣先に出るので、攻略でいちばん見る場所をいちばん明るく。
   - かかとから床に、細い影の尾がのびて、画面の外（持ち主が倒れた場所）へ続く。影は持ち主から離れられない。
   - 踏みこまない。斬るときは、影が床をすべるように「のびる」（体が前へ引きのばされる）。人の間合いでないことが、影であることの手がかり。
   うそつきの影（中ボス）は、主人公もまねる。ときどき輪郭が、丸い兜と羽根飾りとマント（主人公の形）に入れかわる。 */
const SHBL=['#3a3250','#6a5e8a','#a89cc8'];
/* 覚悟の段：拾われた影が、くらやみにのまれていく段階。剣（合図が出る場所）の色は変えない。のまれるほど、影にない「目」が開く（光らない） */
const SHV={
 n:{lbl:'覚悟1 ふつう',name:'影の剣士',body:['#08060e','#120d1c','#1c1529','#2a2040'],rim:'#56467a',tail:'#0a0710',rip:0,eyes:0,tailW:1},
 r:{lbl:'覚悟2 赤い',name:'赤い影の剣士',body:['#0c0408','#1c0a12','#2c121c','#40202c'],rim:'#6a3a4e',tail:'#100608',rip:.35,eyes:0,tailW:1},
 k:{lbl:'覚悟3 黒い',name:'黒い影の剣士',body:['#030205','#09070c','#110e16','#1c1824'],rim:'#46405a',tail:'#020103',rip:.35,eyes:1,tailW:2},
 v:{lbl:'覚悟4 紫の',name:'紫の影の剣士',body:['#0a0414','#180a2a','#28143e','#3c2058'],rim:'#6a4a96',tail:'#0c0418',rip:.5,eyes:3,tailW:2}};
const SHEYE='#7a2a4a';
SPEC.shadeK={hk:1.2,lk:.9,name:'影の剣士',k:.86,pal:PAL.guard,helm:{type:'kettle'},cape:{len:11,col:'#3a4054',hi:'#6a7488',lo:'#1a1c24',tatter:3},
 w:Object.assign({},W_LONG,{len:21}),pose:{ua:1.85,fa:2.75,sw:3.7,ua2:1.45,fa2:1.85,ff:-6,fb:6,cr:1.5,lean:.1}};
SPEC.shadeMK=Object.assign({},SPEC.shadeK,{k:1.075,name:'うそつきの影',cape:{len:16,col:'#3a4054',hi:'#6a7488',lo:'#1a1c24',tatter:6}});
SPEC.shadeMimic=Object.assign({},SPEC.hero,{k:1.075,hk:1.45,w:Object.assign({},W_LONG,{len:21}),pose:SPEC.shadeK.pose});/* 主人公の形（丸い兜・羽根飾り・マント） */
/* 影に描きかえる：ふつうの騎士として描いてから、明るさで3段の影色に置きかえる。剣（体を描いたときにない画素）だけ明るい灰紫。
   flat＝床へ倒れて平たくなる（0〜1、負なら背が伸びる）、stretch＝前へ引きのばす、rip＝輪郭のゆらぎ、cut＝斬られた筋（すき間）、mimic＝主人公の形 */
function shadeDraw(B,ox,oy,S,P0,T){const P=Object.assign({},PDEF,S.pose,P0||{}),base=(P.mimic||0)>.5?SPEC.shadeMimic:S.base,V=SHV[P.tint]||SHV.n,SHP=V.body,SHRIM=V.rim,SHTAIL=V.tail;
 const W1=new Buf(B.w,B.h),J=knight(W1,ox,oy,base,P,T),W2=new Buf(B.w,B.h);knight(W2,ox,oy,base,Object.assign({},P,{sw:null,sw2:null}),T);
 const flat=P.flat||0,st=P.stretch||0,rip=Math.max(P.rip||0,V.rip),ax=J.footB?J.footB[0]:ox,cut=P.cut||0;
 const X=(x,y)=>{let nx=x<ax?ax-(ax-x)*(1+st):x;if(rip)nx+=Math.round(Math.sin(y*.9+T*.6)*rip);return nx},Y=y=>oy-(oy-y)*(1-flat);
 /* 床の影の尾：かかとから画面の外へ */const tx=Math.round(X(ax,oy-1));for(let x=tx-2;x<B.w;x++){B.set(x,oy-1,SHTAIL,3);if(x<tx+18||(x+T)%5)B.set(x,oy,SHTAIL,3);if(V.tailW>1&&(x<tx+30||(x*3+T)%7))B.set(x,oy-2,SHTAIL,3)}
 const L=c=>{if(!c||c[0]!=='#')return .2;const n=parseInt(c.slice(1),16);return(((n>>16)&255)*.3+((n>>8)&255)*.59+(n&255)*.11)/255};
 /* まず影色に置きかえ（変形なし）、そのあと出力の画素から元の画素を引く（のばしても、すき間ができない） */
 const src=new Buf(B.w,B.h);let x0=B.w,x1=0,y0=B.h,y1=0;
 for(let i=0;i<W1.c.length;i++){const c=W1.c[i];if(!c)continue;const x=i%B.w,y=(i/B.w)|0,blade=!W2.c[i],l=L(c);
  if(cut&&!blade){const ly=oy-cut*.62*J.k*14+(x-ox)*.45;if(Math.abs(y-ly)<1)continue}
  src.set(x,y,blade?(l>.75?SHBL[2]:l>.45?SHBL[1]:SHBL[0]):(l>.5?SHP[3]:l>.3?SHP[2]:l>.15?SHP[1]:SHP[0]),blade?2:1);x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}
 const out=new Buf(B.w,B.h),dx0=Math.floor(X(x0,y0))-4,dy0=Math.floor(Y(y0))-1;
 for(let y=Math.max(0,dy0);y<=Math.min(B.h-1,oy+1);y++)for(let x=Math.max(0,dx0);x<=Math.min(B.w-1,x1+4);x++){
  let sx=x;if(rip)sx-=Math.round(Math.sin(y*.9+T*.6)*rip);if(sx<ax)sx=ax-(ax-sx)/(1+st);const sy=oy-(oy-y)/Math.max(1-flat,.07);/* 平たくなっても、床に細い影として残る */
  let ssx=Math.round(sx),ssy=Math.round(sy);if(cut&&ssy<oy-cut*.62*J.k*14+(ssx-ox)*.45)ssx-=1;
  const c=src.get(ssx,ssy);if(c)out.set(x,y,c,src.tag(ssx,ssy))}
 /* 背中側（上と右）の内側1画素を明るく。平たいときはつけない（床の影になっている） */
 if(flat<.6)for(let i=0;i<out.c.length;i++){if(out.t[i]!==1)continue;const x=i%B.w,y=(i/B.w)|0;if(!out.get(x,y-1)||!out.get(x+1,y))out.c[i]=SHRIM}
 for(let i=0;i<out.c.length;i++)if(out.c[i]){B.c[i]=out.c[i];B.t[i]=out.t[i]}
 /* のまれるほど、影にない目が開く（黒い段で胸に一つ、紫の段で兜にも二つ）。光らない */
 if(V.eyes&&flat<.5){const ey=[[J.sc,[0,1]],[J.head,[-2,0]],[J.head,[1,0]]].slice(0,V.eyes);for(const[p0,o]of ey){if(!p0)continue;const q=[Math.round(X(p0[0],p0[1])+o[0]),Math.round(Y(p0[1])+o[1])];if(B.get(q[0],q[1])&&(T+q[0]*7)%140>6)B.set(q[0],q[1],SHEYE,1)}}
 const tr=v=>Array.isArray(v)?(v.length===2&&typeof v[0]==='number'?[X(v[0],v[1]),Y(v[1])]:v.map(tr)):v;for(const k in J)if(k!=='P'&&k!=='k')J[k]=tr(J[k]);return J}
SPEC.shade=Object.assign({},SPEC.shadeK,{draw:shadeDraw,knightLike:true,base:SPEC.shadeK,tintable:true});
SPEC.shadeM=Object.assign({},SPEC.shadeMK,{draw:shadeDraw,knightLike:true,base:SPEC.shadeMK,mid:true,tintable:true});
Object.assign(PDEF,{flat:0,stretch:0,rip:0,cut:0,mimic:0});
for(const k of['shade','shadeM'])SPEC[k+'@w']=flashSpec(k);

/* 構え・振りかぶり・のびる斬り */
/* 脇構え（剣を低く後ろへ）と、すくい上げ */const SHL={ua:1.25,fa:.75,sw:.45,lean:-.04,cr:3.2},SHR={ua:-2.55,fa:-2.75,sw:-2.65,lean:.22,cr:1,stretch:.85};
const SHW={ua:-2.4,fa:-1.8,sw:-1.2,lean:-.12,cr:2.2},SHS={ua:2.75,fa:2.55,sw:2.3,lean:.32,cr:1,stretch:.85},SHU={ua:2.2,fa:2.0,sw:1.6,cr:3,lean:.2},SHS2={ua:3.6,fa:3.9,sw:4.2,lean:.25,cr:1.5,stretch:.8};
/* ふり：のびかけて、途中で止まり、輪郭がゆらいで縮む */const SHF={ua:3.3,fa:3.5,sw:3.4,lean:.2,cr:1.5,stretch:.35,rip:1.6};
const shIdlePP=(P,t)=>{P.rip=(t%90<10)?.6:0};
function shCards(f,pre,isM){const ox=isM?2:6,bg='gate',nm=isM?'うそつきの影':'影の剣士';
 mv({f,ox,id:pre+'_idle',n:'立ち絵',bg,len:120,keys:sway({cr:1.5},{cr:2.3},120,2),pp:shIdlePP,
  cap:isM?'影の剣士より大きく、マントの影が長い。ときどき、輪郭がゆらぐ。':'平たい影の剣士。目はない。かかとから床に細い影の尾がのび、画面の外へ続いている。剣だけが、体より明るい。',
  why:'影なので陰影は3段だけ、光らない。剣は合図が出る場所なのでいちばん明るい。床の尾は、持ち主から離れられない影の印（その先で、持ち主が倒れている）。'});
 /* ひまなとき */
 if(!isM)mv({f,ox,id:pre+'_bored',n:'ひまなとき：持ち主のほうを見る',bg,len:160,
  keys:[K(0,{}),K(30,{}),K(44,{hd:-.35,lean:-.15,sw:3.2},'io'),K(96,{hd:-.35,lean:-.15,sw:3.2}),K(110,{},'io'),K(160,{})],pp:shIdlePP,
  cap:'構えたまま、首だけを後ろへ向けて、床の尾がのびていく先（画面の外）をしばらく見る。それから向き直る。光らない。',
  why:'影は、自分が誰の影だったかを覚えている。尾の先に、持ち主が倒れている。'});
 else mv({f,ox,id:pre+'_bored',n:'ひまなとき：主人公をまねる',bg,len:180,
  keys:[K(0,{}),K(40,{}),K(48,{ua:2.2,fa:2.0,sw:-2.3,lean:.05,cr:1},'io'),K(130,{ua:2.2,fa:2.0,sw:-2.3,lean:.05,cr:1}),K(140,{},'io'),K(180,{})],
  pp:(P,t)=>{P.mimic=t>=46&&t<132?1:0;if(t>=44&&t<50||t>=128&&t<134)P.rip=2},
  cap:'輪郭がゆらいで、丸い兜・羽根飾り・マントの形（主人公の形）に入れかわり、主人公と同じ構えで、同じ息をする。しばらくして、ゆらいでもとの剣士の影に戻る。',
  why:'影はまねる。うそつきの影は、目の前の主人公までまねはじめた。フェイントの名人であることの念押し（まねがうまいほど、ふりもうまい）。'});
 /* 出現：床の影のまますべってきて、立ち上がる */
 mv({f,ox,id:pre+'_enter',n:'出現：床から立ち上がる',bg,len:110,noHero:false,keys:[K(0,{x:-30,flat:1}),K(40,{x:0,flat:1},'out'),K(52,{x:0,flat:-.08},'out'),K(58,{flat:.04}),K(62,{flat:0}),K(110,{})],
  pp:(P,t)=>{if(t>=40&&t<58)P.rip=1.2},
  cap:'床の影のまま、画面の奥から床をすべってくる。主人公の前で止まり、一気に立ち上がる（少し背が伸びすぎてから収まる）。',
  why:'影は床にあるもの。立ち上がるのは、拾われて形をもらったから。'});
 /* 攻撃 */
 mv({f,ox,id:pre+'_strike',n:'のびる斬り（ときどき赤）',bg,len:110,keys:[K(0,{}),K(16,SHW,'out'),K(40,SHW),K(44,SHS,'in'),K(52,SHS),K(56,Object.assign({},SHS,{stretch:.3})),K(70,{},'io'),K(110,{})],
  cues:[{t:16,col:'w'}],hits:[44],
  cap:'剣を振りかぶって止まり、剣先が白く光る（ときどき赤）。足は動かないまま、影が床をすべるように前へのびて斬る。ゆっくり縮んで戻る。合図から当たりまで、いつもの間。',
  why:'人なら踏みこむところを、影は「のびる」。間合いが人とちがうので、影だとわかる。読み方はほかの剣士と同じ（剣先の光）。'});
 /* ふり→本物。影の剣士はふりのあと振りかぶりへ戻って止まってから次の合図。うそつきの影は戻らず、縮んで止まった姿勢のまま次の合図（2026-11-25 Ibuki。2026-11-26 理由を改めた：先に会ううそつきの影が「山」〈フェイントを初めて見せる壁〉、あとのモブの影の剣士が「谷」〈戻ってひと息つける〉。2023-05-10「単調な坂は山登りにならない」） */
 const SHF0=Object.assign({},SHF,{stretch:0,rip:2}),SHF1=Object.assign({},SHF,{stretch:0,rip:.4});/* SHF1：縮んで止まった姿勢。合図のあいだは輪郭のゆらぎも小さくする（静） */
 if(!isM)mv({f,ox,id:pre+'_feint',n:'ふり→本物',bg,len:150,keys:[K(0,{}),K(14,SHW,'out'),K(38,SHW),K(42,SHF,'in'),K(50,SHF0),K(58,SHW,'io'),K(88,SHW),K(92,SHS,'in'),K(100,SHS),K(118,{},'io'),K(150,{})],
  cues:[{t:14,col:'p'},{t:64,col:'w'}],hits:[92],
  cap:'振りかぶって、紫の輪。のびかけるが、途中で止まり、輪郭がゆらいで縮む（ふり）。もう一度振りかぶって止まってから白く光り、今度は本当にのびて斬る。',
  why:'影はまねるだけ。剣士の動きをなぞるが、ふりには中身がない＝のびきらずに、ゆらいで崩れる。紫の輪はフェイントの合図（決まりどおり）。影の剣士は、ふりのあと必ず振りかぶりへ戻って止まってから次の合図を出す（うそつきの影のあとに出る「谷」。ひと息つける）。'});
 else mv({f,ox,id:pre+'_feint',n:'ふり→本物（戻らない）',bg,len:130,keys:[K(0,{}),K(14,SHW,'out'),K(38,SHW),K(42,SHF,'in'),K(50,SHF1),K(76,SHF1),K(80,SHS,'in'),K(88,SHS),K(106,{},'io'),K(130,{})],
  cues:[{t:14,col:'p'},{t:52,col:'w'}],hits:[80],
  cap:'振りかぶって、紫の輪。のびかけて途中で止まり、縮む（ふり）。振りかぶりへは戻らない。縮んで止まった低い姿勢のまま白く光り、そこから本当にのびて斬る。',
  why:'フェイントを初めて見せる中ボスなので「山」にする：構えに戻る「間」がないぶん圧が強い。あとで出る影の剣士は戻って止まる「谷」（2023-05-10「単調な坂は山登りにならない」）。それでも合図は、縮みきって止まってから出し、光っているあいだは動かさない（静と動）。光ってから当たりまでは、いつもの28F。'});
 /* 本物が2回続く：一撃の「振りかぶり（剣が頭上）」とは構えを変える。剣を低く後ろへ引いた脇構え＝下から来る、二度来る */
 mv({f,ox,id:pre+'_two',n:'本物が2回続く（脇構え）',bg,len:130,keys:[K(0,{}),K(14,SHL,'out'),K(38,SHL),K(42,SHR,'in'),K(45,SHR),K(48,SHW,'out'),K(52,SHW),K(56,SHS,'in'),K(64,SHS),K(84,{},'io'),K(130,{})],
  cues:[{t:14,col:'w'},{t:28,col:'w'}],hits:[42,56],
  cap:'剣を低く後ろへ引いた脇構えで止まり（一撃のときの振りかぶりとは逆に、剣が下）、白く光る。すくい上げながらのびて斬り、のびたまま頭上で一瞬止まり、もう一度白く光ったぶん、打ち下ろす。',
  why:'予兆までの形が一撃と同じだと、何回来るかが光るまで分からない。構えで数を見分けられるように、剣の高さを逆にした（上なら一撃、下なら二撃）。根拠：2022-11-11「攻撃モーションの内訳」（構えは相手に次の行動を促すポーズ）。'});
 if(isM)mv({f,ox,id:pre+'_dfeint',n:'二重フェイント（中ボスだけ、戻らない）',bg,len:170,
  keys:[K(0,{}),K(14,SHW,'out'),K(38,SHW),K(42,SHF,'in'),K(50,SHF1),K(76,SHF1),K(80,Object.assign({},SHF,{stretch:.5}),'in'),K(86,SHF1),K(114,SHF1),K(118,SHS,'in'),K(126,SHS),K(144,{},'io'),K(170,{})],
  cues:[{t:14,col:'p'},{t:52,col:'p'},{t:90,col:'w'}],hits:[118],
  cap:'振りかぶって止まり、紫の輪。のびかけて止まり、縮む（ふり）。振りかぶりへは戻らず、縮んで止まった姿勢のまま、また紫の輪とふり。もう一度縮んで止まったところで白く光り、本当にのびて斬る。',
  why:'中ボスだけの技（モブより1つ多い）。構えに戻らずに続けて、圧を出す。それでも合図は、縮みきって止まっているときにだけ出す（振っている最中には光らない）。紫・紫・白は、縮んで止まるたびに出る（38・38Fおき。ふりから次の合図まではどれも10F）。'});
 /* パリィされ：影は弾かれると、輪郭がしぶきのようにゆらぎ、のびた体が縮む。大は床へ半分倒れて平たくなり、起き上がる */
 const SK=(kind,th,P,w)=>Object.assign(knightKit({})(kind,th,P,w),kind==='s'?{stretch:0,rip:2}:{stretch:-.1,flat:.45,rip:3,x:(P.x||0)+4});
 RESPACE(pre+'_two',[42,86]);/* 連撃の間（2026-11-25）：一撃ごとに合図、予兆の間は頭上で止まる。ゲームの【連撃の間】うそつきの影＝44 */
 parriedCard({id:pre+'_pry',src:pre+'_two',n:'パリィされ：本物が2回（小→大）',kit:SK,rx:[{kind:'s'},{kind:'b'}],
  cap:'一撃目を弾かれると、のびた体が一瞬で縮み、輪郭がしぶきのようにゆらぐ。そのまま次の構えへ。二撃目を弾かれると、剣がはね上がり、体が床へ半分倒れて平たくなり、ゆらぎながら起き上がる。',
  why:'影は光に弱い：弾かれる（刃と刃が当たって光る）と、形が保てずゆらぐ。大は「床の影に戻りかける」。'});
 const SBRK=t=>({flat:.86+Math.sin(t*.07)*.02,rip:.6,ua:1.6,fa:1.9,sw:2.5,lean:.15,hd:.4,cr:3});
 parriedCard({id:pre+'_brk',src:pre+'_strike',n:'ブレイク：床の影に戻りかける',len:200,kit:SK,rx:[{kind:'b'}],brk:{at:6,P:SBRK,star:J=>J.hip?[J.hip[0],FL-12]:null},
  cap:'四度目を弾かれると、立っていられず、床へ倒れて平たい影になる。剣士の形のまま床に伸び、ときどき輪郭がゆらぐ。頭の上（床の少し上）を、うすい青の星が回る。',
  why:'拾われて形をもらった影が、もとの「床の影」に戻りかけている。立っていないので、どこから見てもすき。'});
 recoverCard({id:pre+'_rec',f,ox,bg,n:'ブレイク：斬られて、立ち上がる',P:SBRK,idle:()=>Object.assign({},SPEC[f].pose,{flat:0,rip:0,stretch:0,cut:0,x:0}),snap:5,star:J=>J.hip?[J.hip[0],FL-12]:null,
  react:(P,a,b)=>{const A=kb(a,6),Bk=kb(b,8);P.rip=Math.max(P.rip||0,3*A,3*Bk)},
  cap:'床に伸びたまま斬られると、輪郭が大きくゆらぐ。二太刀目のあと、一気に立ち上がる（背が少し伸びすぎてから収まる）。',
  why:'立ち上がりは出現と同じ動き。一瞬で、行き過ぎるくらい大きく。'});
 /* やられ：斬られた筋がすき間になり、上半分が少しずれてから、つながる */
 hurtMove(f,pre+'_hurt',{react:(P,a,b)=>{const A=kb(a,6),Bk=kb(b,9);P.cut=Math.max(A,Bk)>.15?(Bk>A?1.3:1):0;P.rip=2.2*Math.max(A,Bk);P.x=(P.x||0)+2*A+3*Bk},
  cap:'斬られると、刃の通った筋が細いすき間になり、上半分がずれる。輪郭がゆらいで、すき間が閉じる。血も火花も出ない。',
  why:'影には中身がない。斬っても、光が通るだけ。'});
 /* 撃破：床の影に戻り、尾をたどって画面の外（持ち主のところ）へ引きこまれる */
 mv({f,ox,id:pre+'_down',n:'撃破：持ち主のところへ戻る',bg,len:130,noHero:true,keys:[K(0,{}),K(6,{lean:-.3,hd:-.3,rip:3},'out'),K(20,{flat:1,rip:1},'in'),K(36,{flat:1}),K(110,{flat:1,x:70},'in'),K(130,{flat:1,x:70})],
  pp:(P,t)=>{if(t<20)P.rip=2.5*(1-t/20)},
  cap:'最後の一撃で輪郭が大きくゆらぎ、床へ倒れて平たい影になる。それから、床の尾をたどるように、画面の外へ引きずられて消える。何も残らない。',
  why:'影は持ち主のところへ帰る（くらやみに拾われた影が、もとの場所へ）。何度も見るので短く。'});
}
shCards('shade','sh',false);shCards('shadeM','shM',true);

/* 資料集に入れる */
MOVES_OF.shade=['sh_idle','sh_bored','sh_strike','sh_feint','sh_two'];
MOVES_OF.shadeM=['shM_idle','shM_bored','shM_strike','shM_feint','shM_two','shM_dfeint'];
Object.assign(MCAT_ENTER,{shade:['sh_enter'],shadeM:['shM_enter']});Object.assign(MCAT_DOWN,{shade:['sh_down'],shadeM:['shM_down']});Object.assign(MCAT_HURT,{shade:['sh_hurt'],shadeM:['shM_hurt']});
Object.assign(MCAT_PARRY,{shade:['sh_pry'],shadeM:['shM_pry']});Object.assign(MCAT_BREAK,{shade:['sh_brk','sh_rec'],shadeM:['shM_brk','shM_rec']});
FORMS.push({key:'shadeM',ttl:'うそつきの影',en:'THE SHADOWS THAT PRETEND · 中ボスとモブ',stage:[],sox:66,vt:'SHV',vnote:'覚悟の段は、拾われた影がくらやみにのまれていく段階。体の影色が変わるだけでなく、輪郭がいつもゆらぎはじめ（赤い段から）、床の尾が太くなり（黒い段から）、影にはないはずの「目」が開く（黒い段で胸に一つ、紫の段で兜にも二つ。のまれるほど目が増える）。目は光らない。剣（合図が出る場所）の色はどの段でも変えない。',
 variants:[['n','灰紫の影'],['r','赤い影。輪郭がいつもゆらぐ'],['k','真っ黒な影。床の尾が太く、胸に目が一つ'],['v','紫の影。兜にも目が開き、目が三つ']],
 lore:'倒れた剣士の「影」だけが、くらやみに拾われたもの。中身がないので、影はまねることしかできない。剣士の動きをなぞるが、ふりには中身がない（フェイント）。うそつきの影は、もっと腕の立つ剣士の影。目の前の主人公までまねはじめている。',
 parts:[['平たい影の体（3段の影色）','影なので陰影が少なく、光らない。目もない'],['剣（体よりも明るい灰紫）','合図が出る場所。攻略でいちばん見る場所なので、いちばん明るい'],['床の影の尾','かかとから画面の外へ。持ち主から離れられない。その先で持ち主が倒れている（撃破で、尾をたどって帰る）'],['のびる斬り','踏みこまず、影が床をすべるように前へのびる。人の間合いではない'],['ゆらぐ輪郭','ふり（フェイント）・弾かれ・斬られで、形が保てずにゆらぐ'],['主人公の形（うそつきの影）','ときどき丸い兜・羽根飾り・マントの形に入れかわる。まねがうまいほど、ふりもうまい']],
 pal:[['#1c1529','影の体','光らない'],['#6a5e8a','剣','合図が出る場所'],['#4a3c66','背中側のふち','暗い背景に溶けないため'],['#0a0710','床の尾','持ち主のところへ']],
 pair:{key:'shade',ttl:'影の剣士（モブ）',diff:[['同じ骨格','人型の剣士。うそつきの影は1.25倍で、マントの影が長い'],['技','モブは「のびる斬り」「ふり→本物」「本物が2回続く」。うそつきの影は＋「二重フェイント」。フェイントのルールは、うそつきの影で先に教わる'],['まね','モブは持ち主のほうをふり返る。うそつきの影は主人公の形をまねる']]}});
FORMS.push({key:'shade',ttl:'影の剣士',en:'MOB · うそつきの影と同じ骨格',stage:[],sox:66,vt:'SHV',vnote:'覚悟の段はうそつきの影と同じ（輪郭のゆらぎ、太い尾、開く目）。',
 variants:[['n','灰紫の影'],['r','赤い影。輪郭がいつもゆらぐ'],['k','真っ黒な影。床の尾が太く、胸に目が一つ'],['v','紫の影。目が三つ']],
 lore:'倒れた剣士の影の一つ。技は「のびる斬り」「ふり→本物」「本物が2回続く」。フェイントのルールは、先にうそつきの影で教わっている。ひまなときは、床の尾がのびていく先（持ち主が倒れているほう）をふり返る。',
 parts:[['平たい影の体','光らない。目もない'],['剣（いちばん明るい）','合図が出る場所'],['床の影の尾','持ち主のところへ続く']],
 pal:[['#1c1529','影の体','光らない'],['#6a5e8a','剣','合図が出る場所'],['#0a0710','床の尾','持ち主のところへ']]});
