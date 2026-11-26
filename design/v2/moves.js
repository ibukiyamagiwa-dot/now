/* ===== 全モーション =====
   f:だれ  n:名前  cap:読み方（プレイヤーは何を見ればいいか）  why:この動きにした理由
   cues:合図の光（t:フレーム col:w白 r赤 p紫 g金）  hits:当たる瞬間  trails:剣の軌跡 */
const K=(t,p,e)=>({t,p,e});
const MV=[];const mv=o=>{MV.push(o);return o};
/* 連撃の間を伸ばす（2026-11-25：一撃ごとに予兆→当たり28Fを置き、予兆の間は読めないほど激しく動かない。ゆっくり動くのはよい）。
   hs＝新しい当たりの時刻。how[i-1]＝i撃目の前の伸ばし方：数＝その古い時刻の姿勢で待つ（振る直前の構え）、's'＝その区間をゆっくりにする（タタンなど短い伸ばし）。
   書かなければ、前の当たりより後で当たりの3F前までの最後のキーで待つ。
   キー・合図・当たり・軌跡の時刻をずらし、時刻を使う関数（pp・fx・pre・post など）は、待っている間を同じ時刻に読みかえる */
const RESPACE=(M,hs,how)=>{if(typeof M==='string')M=MV.find(m=>m.id===M);if(!M)return;const o=(M.hits||[]).slice().sort((a,b)=>a-b);if(o.length!==hs.length)throw new Error('RESPACE '+M.id);
 const BP=[[0,0]],holds=[];let acc=0;/* 折れ線 [古い時刻, 新しい時刻] */
 for(let i=1;i<o.length;i++){const D=(hs[i]-hs[0])-(o[i]-o[0])-acc;if(D<0)throw new Error('RESPACE shrink '+M.id);if(!D)continue;const w=how&&how[i-1];
  if(w==='s'){BP.push([o[i-1],o[i-1]+acc]);acc+=D;BP.push([o[i],o[i]+acc])}
  else{const ks=M.keys.filter(k=>k.t>o[i-1]&&k.t<=o[i]-3),a=typeof w==='number'?w:ks.length?ks[ks.length-1].t:o[i]-3;BP.push([a,a+acc]);acc+=D;BP.push([a,a+acc]);holds.push([a,a+acc])}}
 const pl=(t,x,y)=>{if(t<=BP[0][x])return t;for(let q=1;q<BP.length;q++){const A=BP[q-1],B=BP[q];if(t<=B[x]){if(B[x]===A[x])return x===0?A[y]:A[y];return A[y]+(t-A[x])*(B[y]-A[y])/(B[x]-A[x])}}const L=BP[BP.length-1];return t+(L[y]-L[x])};
 const nT=t=>pl(t,0,1),oT=t=>pl(t,1,0);
 const base=Object.assign({},PDEF,(SPEC[M.f]||{}).pose),ks=M.keys.map(k=>K(nT(k.t),k.p,k.e));
 for(const[a,e]of holds){if(!M.keys.some(k=>k.t===a))ks.push(K(nT(a),poseAt0(M,a,base)));ks.push(K(e,poseAt0(M,a,base),'lin'))}
 M.keys=ks.sort((a,b)=>a.t-b.t);M.hits=M.hits.map(h=>Math.round(nT(h)));
 M.cues=(M.cues||[]).map(c=>{const i=o.findIndex(h=>Math.abs(h-(c.t+28))<=3);return Object.assign({},c,{t:i>=0?Math.round(nT(o[i]))-(o[i]-c.t):Math.round(nT(c.t))})});/* 合図は、その撃の当たりからの間を保つ */
 if(M.trails)M.trails=M.trails.map(r=>r&&(holds.some(([a])=>a>=r[0]&&a<r[1])?[Math.round(nT(r[1]))-(r[1]-r[0]),Math.round(nT(r[1])),...r.slice(2)]:[Math.round(nT(r[0])),Math.round(nT(r[1])),...r.slice(2)]));
 if(M.gifHits)M.gifHits=M.gifHits.map(h=>Math.round(nT(h)));M.len+=acc;
 for(const f of['pp','heroP','fAt','auraOff','auraK']){const g=M[f];if(g)M[f]=f==='pp'?(P,t,...r)=>g(P,oT(t),...r):(t,...r)=>g(oT(t),...r)}
 for(const f of['fx','post']){const g=M[f];if(g)M[f]=(B,J,t,...r)=>g(B,J,oT(t),...r)}
 if(M.pre){const g=M.pre;M.pre=(B,t,...r)=>g(B,oT(t),...r)}M.spaced=hs;return M};
const sway=(a,b,len,n)=>{const ks=[];for(let i=0;i<=n;i++)ks.push(K(Math.round(len*i/n),i%2?b:a));return ks};
/* 共通の姿勢 */
const X={ua:1.75,fa:-.5,sw:-2.25,ua2:1.4,fa2:-2.5,sw2:-.85};
const KNEEL={kn:1,lean:.35,ua:1.5,fa:1.7,sw:1.45,ua2:1.6,fa2:2.0,hd:.3};

/* ---------- 門番 ---------- */
mv({f:'gate',id:'g_idle',n:'立ち絵：交差の構え',bg:'gate',len:80,keys:sway({cr:0},{cr:1},80,2),
 cap:'剣を交差させて立つ。ここは通さない、という姿。',why:'交差した二本の剣は「通行止め」の印。門番の仕事が一目でわかる。'});
mv({f:'gate',id:'g_two',n:'二連撃',bg:'gate',len:100,cap:'白く光ったら、前の剣で一撃。後ろの剣を頭上へ上げて止まり、その剣先が白く光ったら二撃目。左右の剣が一本ずつ来る。',why:'交差をほどく動き＝構えが解ける瞬間が攻撃の始まり。二本の剣が順に来るので「二回」が見える。',
 keys:(()=>{/* 後ろの腕は、ひじと手首が人の曲がる向き（ひじ 0〜+0.6、手首 +0.45〜+0.6）のまま動くよう、角度を回る向きどおりに続けて書く。
   交差→下げる：前を通って剣先を下ろす。二撃目の構え：腕を後ろから頭上へ上げ、剣を肩の後ろへ寝かせる（兜に腕が重ならない）。振り：頭上を越えて前下へ（途中の54Fで頭上の前を通る）。 */
  const BL={ua2:-5.48,fa2:-5.38,sw2:-4.93},BU={ua2:-7.83,fa2:-7.23,sw2:-6.73},BM={ua2:-9.43,fa2:-8.93,sw2:-8.4},BS={ua2:-11.02,fa2:-10.62,sw2:-10.07};
  const F1={ua:-2.4,fa:-1.6,sw:-1.2,x:4,cr:2},H1={ua:2.8,fa:2.6,sw:2.2},H2={ua:2.6,fa:2.4,sw:2.0};
  return[K(0,X),K(14,Object.assign({},F1,BL)),K(28,Object.assign({},F1,BL)),K(42,Object.assign({},H1,BL,{x:-40,lean:.3}),'in'),K(45,Object.assign({},H1,BL,{x:-40,lean:.3})),
   K(49,Object.assign({},H1,BU,{x:-40,lean:.2}),'out'),K(52,Object.assign({},H1,BU,{x:-40,lean:.2})),K(54,Object.assign({},H1,BM,{x:-41,lean:.28}),'in'),K(56,Object.assign({},H2,BS,{x:-42,lean:.35}),'lin'),
   K(70,Object.assign({},H2,BS,{x:-40,lean:.3})),K(96,Object.assign({},X,{ua2:1.4-12.566,fa2:-2.5-6.283,sw2:-.85-6.283}))]})(),
 cues:[{t:14,col:'w'}],hits:[42,56],trails:[[38,44,'w'],[52,58,'w',2]]});
mv({f:'gate',id:'g_kneel',n:'膝をつく',bg:'gate',len:110,cap:'片膝をつき、剣を地面に突く。まだ交差はほどかない。',why:'倒れても剣を交差させたまま＝最後まで門を守ろうとした、という一瞬の物語。',
 keys:[K(0,X),K(10,Object.assign({},X,{lean:-.2,x:3})),K(34,Object.assign({},KNEEL,{sw2:1.2,ua2:1.7,fa2:1.4}),'out'),K(100,Object.assign({},KNEEL,{sw2:1.2,ua2:1.7,fa2:1.4}))],noHero:true});

/* ---------- 黒い門番 ---------- */
/* 予告の連撃（2026-11-26 作者）：攻撃する部位がいくつもある技は「予告 → 全部が引いて止まる → 予兆1回 → 予告どおりの攻撃」。
   予告は本番と同じ順・同じ間で、攻撃する部位の先が小さく光る（予兆の星より小さい、解錠のカチと同じ「見せる光」）。テンポは28Fを基準に技ごとに決める。
   予兆は一撃目にだけ出し、続きの撃の合図はみならいだけ（cards.js の cueHidden が yokoku を見る） */
const preStar=(B,p,t,s0)=>{if(p&&t>=s0&&t<s0+8)star(B,Math.round(p[0]),Math.round(p[1]),[2,3,3,2,2,1,1,1][t-s0],'w')};
const DGE={pre:[10,38,66],back:78,cue:88,hits:[116,144,172]};/* 兜の目→触手：28・28 */
mv({f:'dgate',id:'dg_idle',n:'立ち絵：にじむ',bg:'gate',len:90,cap:'門番と同じ構え。でも小さく震え、背中からくらやみがにじむ。',why:'シルエットは人のまま。のまれかけ＝まだ「門番」。ぬしより禍々しくしないための線引き。',
 keys:sway({cr:0,lean:.08},{cr:1,lean:.1},90,2),pp:(P,t)=>{if(t%23<2)P.x=(t%2?1:-1)}});
mv({f:'dgate',id:'dg_eyes',gifStart:0,n:'兜の目 → 触手',bg:'gate',len:200,yokoku:true,cap:'兜の目が一つ開くたびに、マントのすそから触手が一本のぞき、その先が小さく光る（予告。タン・タン・タン）。三本そろうと、全部がうしろへ引いて止まり、一本目の先が白く光る（予兆）。そこから予告と同じ順・同じ間で来る。目の数＝回数。',why:'「目が開いた数だけ来る」というルールを見た目に埋め込む。予告で数とリズムを先に聞かせ、予兆から一撃目までは28F。続きは聞いたリズムで弾けるので、反射神経に頼らない（2026-11-26 作者）。光るのは攻撃する触手の先。',
 keys:[K(0,{eyes:0}),K(10,{eyes:1}),K(38,{eyes:2}),K(66,{eyes:3}),K(200,{eyes:3})],pp:(P,t)=>{P.eyes=t<10?0:t<38?1:t<66?2:3},
 fx:(B,J,t)=>{const k=J.k;for(let i=0;i<3;i++){const e=DGE.pre[i],h=DGE.hits[i];if(t<e||t>=h+16)continue;
  /* のぞく（4Fで出て止まる・予告の光）→ 全部そろって引いて止まる（構え）→ 待つ（静）→ 当たる6F前から突く（動）→ 4F粘り、すそへ引っこむ */
  const r=[J.hip[0]+6*k,J.hip[1]+(2+i*5)*k],pk=Math.min(1,(t-e)/4),bk=t<DGE.back?0:Math.min(1,(t-DGE.back)/8),u=t<h-6?0:t<h+4?Math.min(1,(t-h+6)/6):Math.max(0,1-(t-h-4)/8);
  const tip0=[r[0]+6*k*pk,r[1]],tipB=[r[0]+11*k,r[1]-7*k],tw=t>=h+4?[lerp(tip0[0],tipB[0],u),lerp(tip0[1],tipB[1],u)]:[lerp(tip0[0],tipB[0],bk),lerp(tip0[1],tipB[1],bk)];
  const tip=[lerp(tw[0],HXX+8,u),lerp(tw[1],FL-14,u)],mid=[lerp(lerp(r[0]+2*k,r[0]+4*k,bk),HXX+20,u*.6),lerp(lerp(r[1]-4*k,r[1]-10*k,bk),r[1]-8,u)];
  tentacle(B,r,mid,tip,2*k,.5*k,true);preStar(B,tip0,t,e+4)}},
 cues:[0,1,2].map(i=>({t:DGE.hits[i]-28,col:'w',at:J=>[J.hip[0]+17*J.k,J.hip[1]+(2+i*5)*J.k-7*J.k]})),hits:DGE.hits});
mv({f:'dgate',id:'dg_sweep',n:'マントの触手払い',bg:'gate',len:100,cap:'体を沈めたら、低い払い。マントの裾が先に開く。ときどき赤い光（重い）。',why:'人の剣では届かない「低さ」で、のまれていることを伝える。',
 keys:[K(0,X),K(16,Object.assign({},X,{cr:4,lean:-.1})),K(44,Object.assign({},X,{cr:4,lean:.2,x:-6}),'in'),K(90,X)],cues:[{t:16,col:'w',at:J=>add(J.hip,[8,10])}],hits:[44],
 fx:(B,J,t)=>{if(t>=36&&t<56){const u=Math.min(1,(t-36)/8),k=J.k,r=add(J.hip,[6*k,8*k]);tentacle(B,r,[lerp(r[0]+10,60,u),FL-2],[lerp(r[0],HXX+6,u),FL-6],2.4*k,.6*k,true)}}});
mv({f:'dgate',id:'dg_feint',n:'手元の触手',bg:'gate',len:120,cap:'紫の輪が出たら、ふり。手から触手がのびかけて止まる。本物は、そのすぐ次の斬り。',why:'剣ではなく「手」がのびる＝人の動きじゃないから、止まっても不自然に見えない。ふりのすぐ後に本物、の型をここで覚える。',
 keys:[K(0,X),K(16,{ua:2.9,fa:3.0,sw:-1.5,x:-2}),K(36,{ua:2.9,fa:3.0,sw:-1.5,x:-2}),K(48,X),K(62,{ua:-2.4,fa:-1.6,sw:-1.2,ua2:1.0,fa2:.6,sw2:.2,x:4,cr:2}),K(76,{ua:2.8,fa:2.6,sw:2.2,x:-40,lean:.3},'in'),K(96,{ua:2.8,fa:2.6,sw:2.2,x:-40,lean:.3}),K(116,X)],cues:[{t:16,col:'p',at:J=>J.hdF},{t:48,col:'w'}],hits:[76],trails:[[72,78,'w']],
 fx:(B,J,t)=>{if(t>=16&&t<44){const u=t<28?(t-16)/12:1-(t-28)/16,k=J.k;tentacle(B,J.hdF,add(J.hdF,[-8*u,-4]),add(J.hdF,[-24*u,2]),1.6*k,.4*k,true)}}});
mv({f:'dgate',id:'dg_two',n:'くさった二連撃',bg:'gate',len:100,cap:'門番の二連撃と同じ流れ。刃のしずくが落ちたら合図。',why:'同じ動きを繰り返すことで「門番だったもの」とわかる。違いは色としずくだけ。',
 keys:MV.find(m=>m.id==='g_two').keys,cues:[{t:14,col:'w'}],hits:[42,56],trails:[[38,44,'p'],[52,58,'p',2]]});
/* dg_down は「たおれる：鎖だけが残る」（dg_down2）の土台。資料集のページには出さず、ゲームの撃破は dg_down2 に従う */
mv({f:'dgate',id:'dg_down',n:'たおれる：剣だけが残る',bg:'gate',len:120,noHero:true,cap:'体はくらやみに溶ける。交差した剣だけがその場に残る。',why:'溶けても剣は交差したまま＝最後まで門番だった。次の門のぬしへの「ここから先は別物」という区切り。',
 keys:[K(0,X),K(30,Object.assign({},KNEEL,{sw:-2.25,ua:1.75,fa:-.5,sw2:-.85,ua2:1.4,fa2:-2.5}),'out'),K(110,Object.assign({},KNEEL,{sw:-2.25,ua:1.75,fa:-.5,sw2:-.85,ua2:1.4,fa2:-2.5}))],
 post:(B,J,t)=>{if(t>40){const u=Math.min(1,(t-40)/50);for(let i=0;i<B.c.length;i++){if(B.t[i]===1&&B.c[i]!==W_ROT.col&&B.c[i]!==W_ROT.hi&&B.c[i]!==W_ROT.lo&&B.c[i]!==OUT){const x=i%CW,y=i/CW|0;if(((x*13+y*7)%17)/17<u)B.c[i]=(y+x)%3?INK.col:0,B.t[i]=B.c[i]?1:0}}}}});

/* ---------- 門のぬし ---------- */
const LI={ua:1.8,fa:2.9,sw:-1.75,ua2:1.6,fa2:2.4};
const LUP={ua:-2.1,fa:-1.3,sw:-.5,ua2:-1.9,fa2:-1.2,cr:2,x:3,lean:-.1};
const LDN={ua:2.7,fa:2.6,sw:2.45,ua2:2.5,fa2:2.6,x:-12,lean:.3,cr:3};
const LBK={ua:.4,fa:.1,sw:3.14,ua2:.6,fa2:.2,x:4,lean:-.15,cr:2};
const LDP={ua:.2,fa:-.4,sw:3.14,ua2:.3,fa2:-.2,x:8,lean:-.3,cr:6},LKU={ua:2.4,fa:1.4,sw:-1.57,ua2:2.2,fa2:1.4,x:2,cr:1},LKT={ua:2.5,fa:1.3,sw:-.95,ua2:2.3,fa2:1.3,x:2,cr:1};
const LTH={ua:3.1,fa:3.12,sw:3.14,ua2:3.0,fa2:3.1,x:-16,lean:.25,cr:3,ff:-12};
mv({f:'lord',id:'l_idle',n:'立ち絵：鍵の番人',bg:'lord',len:120,keys:sway({cr:1.5},{cr:2.5},120,2),
 cap:'鍵の大剣を立て、背中の鎖で門とつながっている。足元にはくらやみが溜まる。',why:'鎖＝門とつながっている。角＝門のアーチ。剣＝鍵。マントの裏の目＝閉じ込めたもの。「この先には何かがいる」を一枚で言う。'});
mv({f:'lord',id:'l_enter',n:'登場：鎖を引きずって',bg:'lord',len:140,noHero:true,cap:'鎖を引きずりながら、ゆっくり一歩ずつ前へ。',why:'鎖の長さぶんしか前に出られない。門から離れられない番人だと伝わる。',
 keys:[K(0,Object.assign({},LI,{x:30,chainL:30})),K(30,Object.assign({},LI,{x:20,cr:3,chainL:40})),K(50,Object.assign({},LI,{x:20,cr:1.5,chainL:40})),K(80,Object.assign({},LI,{x:8,cr:3,chainL:52})),K(100,Object.assign({},LI,{x:8,cr:1.5,chainL:52})),K(130,Object.assign({},LI,{x:0,chainL:60}))]});
mv({f:'lord',id:'l_two',n:'二連撃',bg:'lord',len:120,cap:'鍵を高く振り上げて白く光る。打ち下ろし、下で構え直して止まり、もう一度光ってすくい上げ。',why:'大きく重い剣は「振り上げ」が長い。構えが見える時間＝読む時間。',
 keys:[K(0,LI),K(16,LUP),K(30,LUP),K(44,LDN,'in'),K(52,LDN),K(58,{ua:3.0,fa:-2.6,sw:-2.5,ua2:2.8,fa2:-2.8,x:-14,lean:.1,cr:2},'in'),K(76,{ua:3.0,fa:-2.6,sw:-2.5,x:-14}),K(110,LI)],
 cues:[{t:16,col:'w'}],hits:[44,58],trails:[[40,46,'w'],[54,60,'w']]});
mv({f:'lord',id:'l_rev',n:'逆二連撃',bg:'lord',len:120,cap:'剣先を下げて白く光る。すくい上げから入り、頭上で止まってもう一度光り、打ち下ろしで終わる。',why:'二連撃と順番が逆。剣先の高さ（上か下か）で最初の一撃が読める。',
 keys:[K(0,LI),K(16,{ua:2.2,fa:1.2,sw:.6,x:4,cr:3,lean:-.1}),K(30,{ua:2.2,fa:1.2,sw:.6,x:4,cr:3}),K(44,{ua:3.0,fa:-2.6,sw:-2.5,x:-12,lean:.1},'in'),K(50,LUP),K(58,LDN,'in'),K(76,LDN),K(110,LI)],
 cues:[{t:16,col:'w'}],hits:[44,58],trails:[[40,46,'w'],[54,60,'w']]});
mv({f:'lord',id:'l_thrust',n:'赤い突き（一撃）',bg:'lord',len:120,cap:'鍵を体の後ろまで深く引き、腰を落として、ぴたりと止まる（溜め）。赤く光る。体ごと一突き。ひねらない。重い一撃で終わる。',why:'見分け方は構え。「深く引いて止まる」なら一撃。解錠（鍵を顔の前に立てて、カチ・カチと回して見せる）とは、光る前から形がちがう。',
 keys:[K(0,LI),K(16,LDP,'out'),K(40,LDP),K(46,Object.assign({},LTH,{x:-22}),'in'),K(72,Object.assign({},LTH,{x:-22})),K(110,LI)],
 cues:[{t:18,col:'r'}],hits:[46],hitCol:'r',trails:[[42,48,'r']]});
mv({f:'lord',id:'l_feint',n:'突きのフェイント',bg:'lord',len:110,cap:'紫の輪が出たら、ふり。鍵を引くが、突かずに戻す。押したら負け。',why:'赤い突きと「引き」までは同じ。輪の色だけで見分ける＝色のルールが試される。',
 keys:[K(0,LI),K(18,LBK),K(34,LBK),K(40,Object.assign({},LBK,{x:-2,lean:0})),K(56,Object.assign({},LBK,{x:4})),K(100,LI)],cues:[{t:18,col:'p'}]});
mv({f:'lord',id:'l_rally',n:'打ち合い',bg:'lord',len:130,cap:'剣が金色に光ったら打ち合い。押されたら、押し返す。',why:'金＝打ち合い、は全ボス共通。ぬしは重いので、押し合いの間が長い。',
 keys:[K(0,LI),K(14,LUP),K(30,LDN,'in'),K(36,Object.assign({},LDN,{x:-8})),K(50,LUP),K(66,LDN,'in'),K(72,Object.assign({},LDN,{x:-8})),K(120,LI)],
 cues:[{t:14,col:'g'},{t:50,col:'g'}],hits:[30,66],hitCol:'g',trails:[[26,32,'g'],[62,68,'g']],
 fx:(B,J,t)=>{if(J.tip&&t>=14&&t<80)glow(B,Math.round(J.tip[0]),Math.round(J.tip[1]),3,'g')}});
mv({f:'lord',id:'l_kneel',n:'膝をつく：封印がほどける',bg:'lord',len:150,noHero:true,cap:'鍵を床に突き立てて膝をつく。胸の封印がひび割れ、赤い目が開く。',why:'「倒した」ではなく「封印がほどけた」。この後の第二形態が、閉じこめていた中身だとわかる。',
 keys:[K(0,LI),K(14,Object.assign({},LI,{lean:-.15,x:3})),K(40,{kn:1,lean:.3,ua:2.2,fa:1.3,sw:1.57,ua2:2.0,fa2:1.4,hd:.4},'out'),K(140,{kn:1,lean:.3,ua:2.2,fa:1.3,sw:1.57,ua2:2.0,fa2:1.4,hd:.4})],
 fx:(B,J,t)=>{if(t>60){const k=J.k,c=add(J.sc,[-1*k,5*k]);const u=Math.min(1,(t-60)/40);crack(B,[c,add(c,[-4*k*u,-3*k*u]),add(c,[-6*k*u,1*k*u])],'#ff3050');crack(B,[c,add(c,[4*k*u,3*k*u])],'#ff3050');if(t>100&&(t/4|0)%2)glow(B,Math.round(c[0]),Math.round(c[1]),3,'#ff3050')}}});

/* ---------- 暗い門のぬし ---------- */
const L2I={ua:1.8,fa:2.9,sw:-1.75,ua2:1.0,fa2:1.4};
mv({f:'lord2',id:'l2_open',n:'本気：胸の扉が開く',bg:'lord',len:150,noHero:true,cap:'鎖がちぎれ、胸の扉が左右に開く。兜が割れ、一つ目がのぞく。',why:'門を守っていた者の体が、門そのものになる。「門の向こう」が胸から出てくる。',
 keys:[K(0,Object.assign({},L2I,{door:0,kn:1,lean:.3,ten:[-.6,-.6,-.6]})),K(30,Object.assign({},L2I,{door:0,kn:1,lean:.3})),K(60,Object.assign({},L2I,{door:0,kn:0,lean:-.2,cr:0}),'out'),K(80,Object.assign({},L2I,{door:1.2,lean:-.3,cr:0}),'out'),K(100,Object.assign({},L2I,{door:1}))],
 pp:(P,t)=>{P.ten=[0,0,0].map((_,i)=>Math.min(0,-.8+Math.max(0,(t-70-i*8)/20)))},
 fx:(B,J,t)=>{if(t>=60&&t<90){/* ちぎれた鎖のかけら */for(let i=0;i<6;i++){const u=(t-60)/30,x=J.sc[0]+10+i*5+u*20,y=J.sc[1]-4+i*3-u*14+u*u*30;B.set(x,y,i%2?'#b8902a':'#5e566e',4)}}
  if(t>=78&&t<86)ring(B,Math.round(J.sc[0]),Math.round(J.sc[1]+12),(t-78)*3,'p')}});
mv({f:'lord2',id:'l2_idle',n:'立ち絵',bg:'lord',len:120,keys:sway({cr:1.5,door:1},{cr:3,door:.8},120,2),
 cap:'胸の口が呼吸し、背中の触手三本が門のように広がる。',why:'ぬし（第一形態）より部品が多い＝情報量が多いほど強い、を体で見せる。'});
const L2B={pre:[12,40,68],back:78,hits:[118,146,174]};/* 背中の触手：28・28 */
const l2bTip=(J,i,ex)=>{const k=J.k,r=add(J.sc,[4*k,(-4+i*3)*k]),rest=[r[0]+(10+i*3)*k,r[1]-(16-i*7)*k];return ex>=0?rest:[lerp(rest[0],r[0]+3*k,-ex),lerp(rest[1],r[1],-ex)]};
mv({f:'lord2',id:'l2_back',gifStart:0,n:'背中の触手 ×3：目の順に',bg:'lord',len:200,yokoku:true,cap:'背中の触手の先の目が、一つずつ小さく光る（予告。タン・タン・タン）。三つ光ると、三本とも根元へ引いて止まり、一本目の目が白く光る（予兆）。そこから予告と同じ順・同じ間で来る。光った数＝回数。',why:'黒い門番の「目の数＝回数」と、予告→予兆→予告どおり、が同じルール。前に覚えたことがここで効く。',
 keys:[K(0,L2I),K(200,L2I)],pp:(P,t)=>{P.eyeOn=[0,1,2].map(i=>t>=L2B.pre[i]&&t<L2B.hits[i]+10);P.ten=[0,1,2].map(i=>{const d=t-L2B.hits[i],bk=t<L2B.back?0:-.45*Math.min(1,(t-L2B.back)/8);return d<-6?bk:d<0?lerp(bk,1,(d+6)/6):d<10?1:Math.max(0,1-(d-10)/12)})},
 fx:(B,J,t)=>{for(let i=0;i<3;i++)preStar(B,l2bTip(J,i,0),t,L2B.pre[i])},
 cues:[0,1,2].map(i=>({t:L2B.hits[i]-28,col:'w',at:J=>l2bTip(J,i,-.45)})),hits:L2B.hits});
mv({f:'lord2',id:'l2_arm',n:'腕の触手：のびる',bg:'lord',len:110,cap:'左腕だった触手が後ろへしなる。白く光ったら、のびてくる。',why:'人の腕の長さを超えて届く。「この距離なら安全」が通じない怖さ。',
 keys:[K(0,L2I),K(16,{ua2:-.4,fa2:-.9}),K(30,{ua2:-.4,fa2:-.9}),K(44,{ua2:3.0,fa2:3.1},'in'),K(60,{ua2:3.0,fa2:3.1}),K(100,L2I)],cues:[{t:16,col:'w',at:J=>J.hdB}],hits:[44],
 fx:(B,J,t)=>{if(t>=40&&t<64){const u=t<44?(t-40)/4:t<52?1:1-(t-52)/12;tentacle(B,J.hdB,add(J.hdB,[-16*u,-6]),[lerp(J.hdB[0],HXX+10,u),lerp(J.hdB[1],FL-12,u)],1.8*J.k,.5*J.k,true)}}});
mv({f:'lord2',id:'l2_tri',n:'剣と触手の三連',bg:'lord',len:140,cap:'白く光ったら三連。打ち下ろし、すくい上げ、最後に左腕の触手。一撃ごとに構えで止まって光る（触手の撃は触手の腕の先が光る）。',why:'剣と触手でリズムが変わる。剣の重さと触手の速さの差が、そのまま難しさになる。',
 keys:[K(0,L2I),K(14,LUP),K(28,LUP),K(42,LDN,'in'),K(48,Object.assign({},LDN,{ua:3.0,fa:-2.6,sw:-2.5})),K(56,Object.assign({},LDN,{ua:3.0,fa:-2.6,sw:-2.5,x:-14}),'in'),K(64,Object.assign({},LDN,{ua:3.0,fa:-2.6,sw:-2.5,ua2:-.4,fa2:-.9})),K(72,Object.assign({},LDN,{ua:3.0,fa:-2.6,sw:-2.5,ua2:3.0,fa2:3.1}),'in'),K(90,LDN),K(130,L2I)],
 cues:[{t:14,col:'w'}],hits:[42,56,72],trails:[[38,44,'w'],[52,58,'w']],
 fx:(B,J,t)=>{if(t>=68&&t<80){const u=t<72?(t-68)/4:1-(t-72)/8;tentacle(B,J.hdB,add(J.hdB,[-14*u,-8]),[lerp(J.hdB[0],HXX+10,u),lerp(J.hdB[1],FL-12,u)],1.8*J.k,.5*J.k,true)}}});
mv({f:'lord2',id:'l2_ext',n:'のびる刃',bg:'lord',len:120,cap:'鍵の刃先からくらやみがのびる。光は、のびた先に出る。赤なら本物、紫の輪ならふり。',why:'光の位置で「どこまで届くか」を先に教える。見る場所を一点に絞る。',
 keys:[K(0,L2I),K(16,LBK),K(34,LBK),K(46,Object.assign({},LTH,{x:-4}),'in'),K(62,Object.assign({},LTH,{x:-4})),K(110,L2I)],
 cues:[{t:18,col:'r',at:J=>J.tip?[J.tip[0]-20,J.tip[1]]:J.hdF}],hits:[46],hitCol:'r',
 fx:(B,J,t)=>{if(J.tip&&t>=18&&t<66){const u=t<46?Math.min(1,(t-18)/12)*.5:t<54?1:1-(t-54)/12;for(let i=0;i<30*u;i++){const x=J.tip[0]-i,y=J.tip[1]+Math.sin(i*.6+t*.4)*(i/30);B.set(x,y,INK.col,1);B.set(x,y-1,i%3?INK.hi:INK.eye,1)}}}});
mv({f:'lord2',id:'l2_dark',n:'ささやき：光が消える',bg:'lord',len:130,cap:'一つ目が閉じ、あたりが暗くなる。合図の光は出ない。鍵を振り上げる構えと、ささやく声で読む。',why:'光に頼りきったプレイヤーへの試験。ただし構え（鍵の高さ）だけは暗くても見えるよう、刃の縁を残す。',
 keys:[K(0,L2I),K(30,L2I),K(44,LUP),K(70,LDN,'in'),K(90,LDN),K(120,L2I)],hits:[70],
 post:(B,J,t)=>{const u=t<20?t/20:t<90?1:Math.max(0,1-(t-90)/20);const keep=new Set([W_KEY.col,W_KEY.hi,'#5e4a78','#9a80c0']);for(let i=0;i<B.c.length;i++){const x=i%CW,y=i/CW|0;if(B.t[i]===4||(x<44&&B.t[i]&&B.t[i]!==6)||(B.t[i]===1&&keep.has(B.c[i])&&u>.3))continue;if(((x+y)%2===0&&u>.3)||u>.8){B.c[i]='#06040a';B.t[i]=7}}
  if(u>.3&&t>=40&&t<70&&(t/5|0)%2){const p=add(J.head,[-14,-6]);for(let i=0;i<3;i++)B.set(p[0]-i*3,p[1]+(i%2),'#6a6080',4)}}});
mv({f:'lord2',id:'l2_maw',n:'胸の口：かみつき',bg:'lord',len:120,cap:'胸の扉が大きく開いて赤く光る。前に出て、かみつく。重い。当たると、ぬしが回復する。',why:'一番大事なもの（胸の中）を見せる攻撃は、一番重い。開いた口の大きさ＝重さ。食べて回復する、が絵でわかる。',
 keys:[K(0,L2I),K(16,Object.assign({},L2I,{door:1.6,lean:-.2})),K(36,Object.assign({},L2I,{door:1.6,lean:-.2})),K(48,Object.assign({},L2I,{door:1.8,lean:.4,x:-14}),'in'),K(56,Object.assign({},L2I,{door:.6,lean:.4,x:-14})),K(110,L2I)],
 cues:[{t:20,col:'r',at:J=>add(J.sc,[0,9*J.k])}],hits:[48],hitCol:'r',
 fx:(B,J,t)=>{if(t>=44&&t<56){const c=add(J.sc,[-4,10]),u=(t-44)/12;for(let i=0;i<7;i++){B.set(c[0]-10-i*2,c[1]-6+u*5,'#e8e0d0',4);B.set(c[0]-10-i*2,c[1]+6-u*5,'#e8e0d0',4)}}}});
mv({f:'lord2',id:'l2_rally',n:'打ち合い',bg:'lord',len:130,cap:'金に光ったら打ち合い。触手も一本、横から押してくる。',why:'第一形態と同じ打ち合いに、触手の「横からの圧」を一つ足すだけ。変化は一つずつ。',
 keys:MV.find(m=>m.id==='l_rally').keys.map(k=>K(k.t,Object.assign({},k.p,{ua2:1.0,fa2:1.4}),k.e)),cues:[{t:14,col:'g'},{t:50,col:'g'}],hits:[30,66],hitCol:'g',trails:[[26,32,'g'],[62,68,'g']]});
mv({f:'lord2',id:'l2_down',n:'たおれる：門が開く',bg:'lord',len:160,noHero:true,cap:'胸の扉が閉じ、ぬしは崩れる。床に刺さった鍵だけが残り、鎖がほどける。',why:'鍵が残る＝門が開く。倒したご褒美が「先へ進める」こととして目に見える。',
 keys:[K(0,L2I),K(30,Object.assign({},L2I,{door:0,lean:-.2})),K(70,{door:0,kn:1,lean:.5,ua:2.2,fa:1.3,sw:1.57,hd:.6,ten:[-.8,-.8,-.8]},'out'),K(150,{door:0,kn:1,lean:.5,ua:2.2,fa:1.3,sw:1.57,hd:.6,ten:[-.8,-.8,-.8]})],
 post:(B,J,t)=>{if(t>90){const u=Math.min(1,(t-90)/50);const W0=new Set([W_KEY.col,W_KEY.hi,W_KEY.lo,'#5e4a78','#9a80c0','#22142e',W_KEY.guard,W_KEY.guardHi]);for(let i=0;i<B.c.length;i++){if(B.t[i]===1&&!W0.has(B.c[i])){const x=i%CW,y=i/CW|0;if(((x*13+y*7)%17)/17<u){B.c[i]=y>FL-3?INK.col:0;B.t[i]=B.c[i]?5:0}}}}}});

/* ---------- 赤い騎士 ---------- */
const RI={ua:2.05,fa:2.55,sw:3.35,ua2:1.65,fa2:2.25,cr:2.6,lean:.1,ff:-10,fb:8};   /* 力んだ構え：肩をいからせ、前のめり */
const R8={ua:-.9,fa:-2.6,sw:-1.3,ua2:-.6,fa2:-2.8,cr:2};          /* 八相：上から */
const RG={ua:2.1,fa:2.4,sw:2.35,ua2:1.9,fa2:2.6,cr:3};           /* 下段：下から */
const RW={ua:1.2,fa:.6,sw:.45,ua2:1.0,fa2:.9,cr:2.5,lean:-.1};   /* 脇：剣を隠す */
const RCUT={ua:3.0,fa:2.7,sw:2.5,ua2:2.9,fa2:2.6,x:-44,lean:.25,ff:-12,fb:9};
/* 本気は抜き身の正眼で構える（冷静さを取り戻した、低く静かな構え）。居合は技を使うときだけ、剣を鞘に納めて構える */
const R2G={ua:2.45,fa:1.85,sw:2.7,ua2:2.25,fa2:1.75,cr:4.5,lean:.22,ff:-11,fb:9,sheath:0},R2B={ua:1.7,fa:2.2,sw:3.05,ua2:1.4,fa2:2.6,cr:4,lean:.15,ff:-11,fb:8,sheath:0};
mv({f:'red',id:'r_idle',n:'立ち絵：力んだ構え',bg:'red',len:120,keys:[K(0,{}),K(120,{})],
 cap:'肩をいからせた前のめりの構えで、切っ先をこちらの顔に向けている。肩で速く息をし、ときどき柄をぎゅっと握り直す（そのたびに肩が上がり、切っ先がわずかに沈む）。',why:'彼から見れば、主人公は「決して開けてはならない門」を開けて入ってきた侵略者。倒さねばという力みが、荒い息と握り直しに出る。怯えではなく攻め気。本気になると、握り直さなくなる。'});
mv({f:'red',id:'r_stance',n:'構えの切り替え',bg:'red',len:200,noHero:true,cap:'正眼→八相→下段→脇。構えで次の技が決まる。上なら打ち下ろし、下ならすくい上げ、脇なら見えない間合い。',why:'剣を極めた者は、技の前に「構え」を選ぶ。プレイヤーは構えを読めるようになると一段うまくなる。',
 keys:[K(0,RI),K(40,RI),K(50,R8,'out'),K(90,R8),K(100,RG,'out'),K(140,RG),K(150,RW,'out'),K(190,RW),K(200,RI)]});
mv({f:'red',id:'r_two',n:'勢いあまりの二連撃（V字）',bg:'red',len:110,cap:'白く光ると、剣を背中に倒れるほど大きく振りかぶり、体ごと打ち下ろす。止まりきれずに剣先が床すれすれまで落ち、前足が半歩すべって止まる。剣先を床すれすれに置いたまま、もう一度白く光ったら、腕ごと下から斬り上げる（剣先がV字を描く）。斬り上げたあと、体が伸びきって一瞬のけぞる。',why:'力みすぎて、一太刀で止まれない。落ちきった勢いが、そのまま二撃目の斬り上げになる。二撃目は「もう一回振る」ではなく、一撃目の続き。大きいぶん読みやすい＝最初のボス戦らしい手ごわさ。本気になると、同じ二連から振りかぶりも泳ぎも消える。',
 keys:[K(0,RI),K(14,Object.assign({},R8,{ua:-1.2,fa:-2.9,sw:-.6,lean:-.2,cr:3,x:6}),'out'),K(36,Object.assign({},R8,{ua:-1.25,fa:-2.95,sw:-.5,lean:-.22,cr:3.2,x:7})),K(39,{ua:-2.4,fa:-2.5,sw:-2.0,ua2:-2.2,fa2:-2.6,x:-10,lean:.15,cr:3},'in'),
  K(42,{ua:2.2,fa:2.0,sw:2.5,ua2:2.0,fa2:1.9,x:-40,lean:.4,ff:-15,fb:10,cr:4.2},'in'),
  K(46,{ua:1.6,fa:1.5,sw:2.15,ua2:1.4,fa2:1.4,x:-44,lean:.5,ff:-18,fb:12,cr:5.5},'out'),
  K(51,{ua:1.0,fa:1.15,sw:1.65,ua2:.9,fa2:1.05,x:-42,lean:.38,ff:-18,fb:12,cr:5.6},'io'),
  K(56,{ua:-2.6,fa:-2.95,sw:-2.35,ua2:-2.75,fa2:-3.05,x:-36,lean:.05,ff:-15,fb:10,cr:3},'in'),
  K(61,{ua:-2.0,fa:-2.2,sw:-1.6,ua2:-2.15,fa2:-2.3,x:-34,lean:-.12,ff:-14,fb:10,cr:2.2},'out'),K(84,{ua:-2.0,fa:-2.2,sw:-1.6,ua2:-2.15,fa2:-2.3,x:-34,lean:-.1,ff:-14,fb:10,cr:2.6}),K(104,RI,'io')],
 cues:[{t:14,col:'w'}],hits:[42,56],trails:[[39,47,'w',0,'arc'],[50,59,'w',0,'arc']]});
const RTH={ua:3.1,fa:3.12,sw:3.14,ua2:2.8,fa2:2.9,x:-40,lean:.2,ff:-13,fb:9};
mv({f:'red',id:'r_three',n:'三段突き',bg:'red',len:130,cap:'剣先を引いて光る。同じ高さに三回、引くたびに止まって光る。間はすべて同じ。三回目だけ赤い光＝重い。',why:'三回とも同じ間隔＝リズムを読めばよい。剣を極めた者は「同じ動きを同じように」繰り返せる。',
 keys:[K(0,RI),K(14,{ua:1.2,fa:3.0,sw:3.14,x:4,cr:3}),K(30,{ua:1.2,fa:3.0,sw:3.14,x:4,cr:3}),K(42,RTH,'in'),K(46,Object.assign({},RTH,{ua:2.0,fa:3.0,x:-36})),K(54,RTH,'in'),K(58,Object.assign({},RTH,{ua:2.0,fa:3.0,x:-36})),K(66,RTH,'in'),K(90,RTH),K(122,RI)],
 cues:[{t:14,col:'w'},{t:26,col:'w'},{t:38,col:'r'}],hits:[42,54,66],trails:[[40,43,'w'],[52,55,'w'],[64,67,'r']]});
mv({f:'red',id:'r_parry',n:'両手で叩き払う',bg:'red',len:100,cap:'こちらの攻撃を、両手で力いっぱい叩き払う。払った勢いで体が半歩前へ泳ぎ、あわてて構え直す。',why:'あなたがしてきたパリィを、相手もやる。ただし力ずく。払いが強すぎて体が流れる＝力み。本気の払いは、刃の角度だけで済ませる。',
 keys:[K(0,RI),K(20,RI),K(26,{ua:2.85,fa:-2.6,sw:-2.0,ua2:2.65,fa2:-2.7,lean:.22,cr:3,x:-6},'in'),K(40,{ua:2.85,fa:-2.6,sw:-2.0,ua2:2.65,fa2:-2.7,lean:.28,cr:3.2,x:-9,ff:-11}),K(60,RI,'io'),K(90,RI)],
 fx:(B,J,t)=>{if(t>=26&&t<34&&J.tip)spark(B,Math.round(J.tip[0]+2),Math.round(J.tip[1]+6),t-26,'w');if(t>=18&&t<30){/* あなたの斬撃 */for(let i=0;i<6;i++)B.set(HXX+20+(t-18)*3+i,FL-24+i,'#bfe8ff',4)}}});
mv({f:'red',id:'r_feint',n:'踏みこみのフェイント',bg:'red',len:100,cap:'肩をいからせて半歩踏み出し、剣を振りかぶりかけて、剣先に紫の輪。そこで止まる。押したら負け。',why:'力みが体に出る＝ふりも大きい。踏みこみの大きさに釣られずに、色を見る。本気になると、ふりは肩がわずかに沈むだけになる。',
 keys:[K(0,RI),K(18,RI),K(22,Object.assign({},R8,{ua:-.5,fa:-2.3,sw:-1.0,x:-6,lean:.12,cr:3}),'out'),K(34,Object.assign({},R8,{ua:-.5,fa:-2.3,sw:-1.0,x:-6,lean:.12,cr:3})),K(50,RI,'io'),K(100,RI)],cues:[{t:20,col:'p'}]});
mv({f:'red',id:'r_push',n:'押し合い：刃の位置で押す',bg:'red',len:130,cap:'金に光ったら打ち合い。刃が合わさる高さが毎回ちがう。',why:'力ではなく刃の位置で押してくる。だから押し合いの場所が毎回変わる（本気では五回）。',
 keys:[K(0,RI),K(12,R8),K(26,Object.assign({},RCUT,{x:-30}),'in'),K(36,Object.assign({},RCUT,{x:-26,sw:2.9})),K(50,RG),K(64,Object.assign({},RCUT,{x:-30,ua:2.6,fa:-2.8,sw:-2.7}),'in'),K(74,Object.assign({},RCUT,{x:-26,ua:2.6,fa:-2.9,sw:-2.9})),K(120,RI)],
 cues:[{t:12,col:'g'},{t:50,col:'g'}],hits:[26,64],hitCol:'g',trails:[[23,28,'g'],[61,66,'g']],
 fx:(B,J,t)=>{if(J.tip&&t>=12&&t<80)glow(B,Math.round(J.tip[0]),Math.round(J.tip[1]),3,'g')}});
mv({f:'red',id:'r_zanshin',n:'残心',bg:'red',len:130,cap:'振り抜いたあと、肩で息をしながら長く止まる。すきに見えるが、すきではない。ここで何かを押すと、もう一撃来る（次の「残心に手を出す」）。待てば、構えを解く。',why:'剣の心得のない者には、すきに見える。でも本当は真逆で、いちばん気を張っている瞬間。「構え中に斬ると返される」は居合のおかしらで先に教わっている。',
 keys:[K(0,RI),K(14,R8),K(28,R8),K(40,Object.assign({},RCUT,{sw:2.2,ua:2.6,fa:2.3}),'in'),K(100,Object.assign({},RCUT,{sw:2.2,ua:2.6,fa:2.3})),K(126,RI)],
 cues:[{t:12,col:'w'}],hits:[40],trails:[[36,42,'w']],fx:(B,J,t)=>{if(t>=50&&t<96&&(t/6|0)%2)B.set(J.head[0]-6,J.head[1]-8,'#ffd040',4)}});
mv({f:'red',id:'r_rage',n:'本気を出す：マントを斬る',bg:'red',len:190,noHero:true,cap:'自分のマントを斬り落とす。剣を下ろし、肩で大きく一つ息を吐く。いからせていた肩が落ち、目の光が白くなる。腰を深く落として、低い正眼に構え直す。',why:'飾りを捨てる＝本気。息を吐く＝力みを捨て、冷静さを取り戻す。握りしめていた手から余計な力が抜ける。それでも腰は低く、体ごと斬りにくる。白い目＝「もう光でしか見えない速さ」の予告。',
 fAt:t=>t<120?'red':'red2',
 keys:[K(0,RI),K(20,{ua:-1.0,fa:-.4,sw:.3}),K(30,{ua:2.4,fa:1.2,sw:.2,capeOff:0},'in'),K(60,{ua:2.4,fa:1.2,sw:.2,capeOff:1}),K(78,{ua:1.6,fa:1.7,sw:2.15,ua2:1.4,fa2:1.8,cr:1,lean:-.08,hd:-.1},'io'),K(96,{ua:1.6,fa:1.7,sw:2.15,ua2:1.4,fa2:1.8,cr:3,lean:.1,hd:.15},'io'),K(118,{ua:1.6,fa:1.7,sw:2.15,ua2:1.4,fa2:1.8,cr:3,lean:.1,hd:.15}),K(146,R2G,'io'),K(190,R2G)],
 pp:(P,t)=>{if(t>=30)P.capeOff=1},
 pre:(B,t)=>{if(t>=30){/* 斬り落とされたマントが床に落ちる */const u=Math.min(1,(t-30)/26),x=EXX+10,y=lerp(FL-24,FL-2,u*u);B.poly([[x,y],[x+12,y-6+u*6],[x+16,y+2],[x+3,y+3]],'#5a0e1c','#8a2030','#2a0610')}},
 fx:(B,J,t)=>{if(t>=28&&t<36)for(let i=0;i<14;i++)B.set(J.sc[0]+2+i,J.sc[1]-4+i,'#ffffff',4);if(J.head){/* 吐く息 */breath(B,add(J.head,[-4,2]),t-80,true)}}});

/* ---------- 本気の赤い騎士 ---------- */
const R2N={ua:1.7,fa:2.2,sw:null,sheath:1,ua2:1.4,fa2:2.6,ff:-12,fb:8,cr:4.5,lean:.18,hd:.1};
const IAI={ua:3.1,fa:3.0,sw:.15,ua2:.9,fa2:.6,sheath:0,x:-66,lean:.2,cr:5,ff:-14,fb:10};
const chinRing=(B,J,t,s)=>{const d=t-s;if(d<0||d>12||!J.hip)return;const c=add(J.hip,[-1*J.k,1*J.k]);for(let q=0;q<2;q++){const r=2+d*1.1+q*3;for(let a=-.8;a<=.8;a+=.16){B.set(c[0]-Math.cos(a)*r,c[1]+Math.sin(a)*r,q?'#6a6278':'#d8dce8',4);B.set(c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r,q?'#6a6278':'#d8dce8',4)}}};
/* 居合の技：正眼から剣を鞘に納め（チン）、居合の構えに入る。納刀そのものが「居合が来る」の予告。D フレームぶん後ろへずらす */
const IAIWRAP=(id,D)=>{const o=MV.find(x=>x.id===id),N=k=>k.p===R2N||k.p.sheath===1,lh=Math.max(...o.hits);
 let ks=o.keys.map(k=>K(k.t+D,k.p,k.e)).filter(k=>k.t>10);const cut=ks.findIndex(k=>k.t>lh+D&&N(k));if(cut>0){const tEnd=ks[cut-1].t;ks=ks.slice(0,cut).concat([K(tEnd+18,R2G,'io'),K(o.len+D,R2G)])}
 o.keys=[K(0,R2G),K(8,R2B,'io'),K(10,R2N,'snap')].concat(ks);o.len+=D;
 if(o.cues)o.cues=o.cues.map(c=>Object.assign({},c,{t:c.t+D}));o.hits=o.hits.map(h=>h+D);if(o.trails)o.trails=o.trails.map(r=>[r[0]+D,r[1]+D].concat(r.slice(2)));
 const fx0=o.fx;o.fx=(B,J,t)=>{chinRing(B,J,t,10);if(fx0&&t>=D)fx0(B,J,t-D)}};
mv({f:'red2',id:'r2_idle',n:'立ち絵：抜き身の正眼',bg:'red',len:120,keys:[K(0,{}),K(120,{})],cap:'抜き身の剣を両手で握り、腰を深く落とした低い正眼。切っ先はこちらの目に向いたまま、一度も動かない。ゆっくり深く息をしている。目の光が白い尾を引く。',why:'赤い騎士は肩で息をし、何度も柄を握り直していた。本気は止まったまま動かない＝冷静さを取り戻した。それでも腰は低く、体ごと斬りにくる構え。尾を引く目は、速さの予告。'});
mv({f:'red2',id:'r2_iai',n:'居合',bg:'red',len:120,cap:'正眼から一度、剣を鞘に納める（チン、と小さな音の輪）。腰を落として柄に手をかけ、目が白く光った瞬間から数えて、いつもの間で来る。見えるのは光と、斬ったあとだけ。斬り終えたら、抜き身のまま正眼に戻る。',why:'居合は、技を使うときだけ構える。納刀そのものが「居合が来る」の予告。途中の動きを描かない＝「見えない速さ」。でも合図から当たるまでの間は他と同じ。理不尽ではない。',
 keys:[K(0,R2N),K(40,R2N),K(41,IAI,'snap'),K(90,IAI),K(91,R2N,'snap'),K(120,R2N)],cues:[{t:14,col:'w',at:J=>add(J.head,[-3,0])}],hits:[42],
 fx:(B,J,t)=>{if(t>=41&&t<50){/* 一閃：画面を横切る白い線 */const y=FL-14;for(let x=0;x<CW;x++){if((x+t)%9<7-(t-41)*.6)B.set(x,y,'#ffffff',4)}for(let x=HXX;x<EXX;x++)if(t<44)B.set(x,y-1,'#bfe8ff',4)}}});
mv({f:'red2',id:'r2_double',n:'二重フェイント',bg:'red',len:140,cap:'正眼のまま、肩がほんのわずかに沈んで、剣先に紫の輪。二回とも押さない。そのあと八相へ上げて止まり、剣先に赤い光。重い斬り下ろし。',why:'通常の一回から増えた。確率で二回、まれに三回。本気のふりは動きが小さいぶん、色だけが頼り。「何回来るか」ではなく「色を見る」を最後まで試す。',
 keys:[K(0,R2G),K(16,Object.assign({},R2G,{cr:5.2,lean:.26})),K(22,R2G),K(42,Object.assign({},R2G,{cr:5.2,lean:.26})),K(48,R2G),K(52,R2G),K(66,Object.assign({},R8,{sheath:0,cr:4,ff:-11,fb:9}),'out'),K(94,Object.assign({},R8,{sheath:0,cr:4,ff:-11,fb:9})),K(96,Object.assign({},RCUT,{x:-48,cr:5,lean:.35,sheath:0}),'in'),K(118,Object.assign({},RCUT,{x:-48,cr:5,lean:.35,sheath:0})),K(140,R2G,'io')],
 cues:[{t:16,col:'p'},{t:42,col:'p'},{t:68,col:'r'}],hits:[96],hitCol:'r',trails:[[92,98,'r']]});
mv({f:'red2',id:'r2_rally',n:'五合の打ち合い',bg:'red',len:180,cap:'金に光ったら打ち合い。五回、刃の高さを変えてくる。',why:'押し合いの位置が変わる、を五回。最後の打ち合いが最長＝ここを越えれば勝ち、の山場。',
 keys:(()=>{const ks=[K(0,R2G),K(8,{ua:1.95,fa:2.7,sw:3.5,sheath:0})];const hs=[R8,RG,RI,R8,RG];hs.forEach((h,i)=>{const t=14+i*28;ks.push(K(t,Object.assign({},h,{sheath:0})));ks.push(K(t+12,Object.assign({},RCUT,{x:-28,sw:[2.4,-2.6,3.1,2.4,-2.6][i],fa:[2.6,-2.8,3.0,2.6,-2.8][i],sheath:0}),'in'))});ks.push(K(170,Object.assign({},RI,{sheath:0})));return ks})(),
 cues:[0,1,2,3,4].map(i=>({t:14+i*28,col:'g'})),hits:[0,1,2,3,4].map(i=>26+i*28),hitCol:'g',
 fx:(B,J,t)=>{if(J.tip&&t>=14&&t<150)glow(B,Math.round(J.tip[0]),Math.round(J.tip[1]),3,'g')}});
mv({f:'red2',id:'r2_last',n:'最期：構えたまま',bg:'red',len:220,noHero:true,cap:'鞘から抜いた剣を、顔の前に縦に立てて構える。美しい構えのまま、目の光だけがゆっくり消えていく。倒れない。',why:'剣を極めた者は、構えのまま終わる。この構えは、のちに水面から現れる姿と同じになる。',
 keys:[K(0,Object.assign({},RI,{sheath:0})),K(40,{ua:2.35,fa:-1.25,sw:-1.57,ua2:2.15,fa2:-1.45,sheath:0,cr:1,lean:.02,hd:.08},'out'),K(220,{ua:2.35,fa:-1.25,sw:-1.57,ua2:2.15,fa2:-1.45,sheath:0,cr:1,lean:.02,hd:.08})],
 pp:(P,t)=>{P.eyeOff=t<60?0:Math.min(1,(t-60)/100)},
 fx:(B,J,t)=>{if(t>=40&&t<56&&J.tip)star(B,Math.round(J.tip[0]),Math.round(J.tip[1]),[2,3,4,4,3,3,2,2,1,1,1,1,1,1,1,1][t-40],'w')}});
/* ---------- 赤い門のぬし ---------- */
const FI={ua:1.95,fa:2.7,sw:3.5,ua2:1.3,fa2:2.0};
/* 剣と触手の構え：剣は前、触手の腕は腰の後ろへ低く引きしぼる（剣も触手も構える＝二撃） */const FC={ua:2.15,fa:2.45,sw:3.25,ua2:.55,fa2:.15,cr:3,lean:.14,ff:-9,fb:7};
const glitch=(P,t)=>{const g=(t*7919)%97;if(g<6){P.x=(P.x||0)+(g%2?2:-2);P.hd=(P.hd||0)+.25}};
/* 黒い水面：穴の底の床。体の下半分を水面で隠す */
const water=(B,t)=>{for(let x=0;x<CW;x++){const w=Math.sin(x*.3+t*.1)>.6;B.set(x,FL,w?'#3a2a50':'#1a1428',6);B.set(x,FL+1,'#0c0a14',6)}};
mv({f:'fallen',id:'f_rise',n:'登場：穴の底の水から',bg:'hole',len:160,noHero:true,cap:'黒い水面から、赤い騎士がゆっくり立ち上がる。構えは、あの正眼のまま。',why:'「同じ構え」で出てくるのがいちばん怖い。剣の型は体が覚えている。',
 keys:[K(0,Object.assign({},FI,{lift:-46,lean:.4,hd:.6})),K(100,Object.assign({},FI,{lift:0,lean:.3,hd:.5}),'io'),K(120,FI,'out'),K(160,FI)],
 post:(B,J,t)=>{for(let y=FL+1;y<CH;y++)for(let x=0;x<CW;x++){if(B.t[y*CW+x]!==6){B.c[y*CW+x]=((x+y)%5?'#0c0a14':'#1a1428');B.t[y*CW+x]=6}}water(B,t)}});
mv({f:'fallen',id:'f_idle',n:'立ち絵：ときどき、ずれる',bg:'hole',len:120,keys:[K(0,{}),K(120,{})],pp:(P,t)=>glitch(P,t),
 cap:'切っ先は動かない。でも、ときどき体ごと「ずれる」。',why:'赤い騎士の「静」を残したまま、くらやみの「乱れ」だけを足す。違和感で、のまれたことを伝える。',post:(B,J,t)=>water(B,t)});
mv({f:'fallen',id:'f_cutten',n:'剣と触手',bg:'hole',len:130,cap:'腰を落とし、触手の腕を腰の後ろへ低く引きしぼる（剣も触手も構えている）。白く光ったら、剣の一撃。触手の腕を引いて止まり、腕の先が白く光ったら、左腕の触手。',why:'剣は赤い騎士のまま正確。触手はくらやみのもの。一つの攻撃に二人ぶんのリズムが混ざる。',
 keys:[K(0,FI),K(10,FC,'out'),K(36,Object.assign({},FC,{cr:3.5})),K(42,RCUT,'in'),K(50,Object.assign({},RCUT,{ua2:-.4,fa2:-.9})),K(56,Object.assign({},RCUT,{ua2:3.0,fa2:3.1}),'in'),K(80,RCUT),K(120,FI)],
 cues:[{t:14,col:'w'}],hits:[42,56],trails:[[39,44,'w']],pp:(P,t)=>glitch(P,t),post:(B,J,t)=>water(B,t),
 fx:(B,J,t)=>{if(t>=52&&t<66){const u=t<56?(t-52)/4:1-(t-56)/10;tentacle(B,J.hdB,add(J.hdB,[-10*u,-8]),[lerp(J.hdB[0],HXX+10,u),lerp(J.hdB[1],FL-12,u)],1.6,.5,true)}}});
mv({f:'fallen',id:'f_dark',n:'ささやき：くらやみの中の正眼',bg:'hole',len:130,cap:'あたりが暗くなり、合図の光は出ない。見えるのは銀の切っ先だけ。切っ先が沈んだら来る。',why:'ぬしの「ささやき」を受けついだ技。でも赤い騎士は、切っ先（剣だけは、のまれていない銀）で読ませてくれる。',
 keys:[K(0,FI),K(40,FI),K(56,Object.assign({},FI,{sw:3.75,cr:3})),K(70,RCUT,'in'),K(90,RCUT),K(120,FI)],hits:[70],
 post:(B,J,t)=>{water(B,t);const u=t<20?t/20:t<92?1:Math.max(0,1-(t-92)/20);for(let i=0;i<B.c.length;i++){const x=i%CW,y=i/CW|0;const kp=B.c[i]===W_LONG.col||B.c[i]===W_LONG.hi||B.c[i]===W_LONG.lo;if(B.t[i]===2||B.t[i]===4||kp||(x<44&&B.t[i]&&B.t[i]!==6))continue;if(((x+y)%2===0&&u>.3)||u>.8){B.c[i]='#06040a';B.t[i]=7}}if(J.tip&&u>.3)B.set(Math.round(J.tip[0]),Math.round(J.tip[1]),'#ffffff',4)}});
mv({f:'fallen',id:'f_double',n:'二重フェイント',bg:'hole',len:140,cap:'剣先に紫の輪が二回、本物は剣先に赤い光。のまれても、剣の駆け引きは覚えている。',why:'赤い騎士の技がそのまま残っている＝体は同じ人。確率も赤い騎士と同じにする。',
 keys:[K(0,FI),K(16,Object.assign({},FI,{cr:2.6,lean:.06})),K(24,FI),K(42,Object.assign({},FI,{cr:2.6,lean:.06})),K(50,FI),K(92,FI),K(98,RCUT,'in'),K(120,RCUT),K(136,FI)],
 cues:[{t:16,col:'p'},{t:42,col:'p'},{t:70,col:'r'}],hits:[98],hitCol:'r',trails:[[95,100,'r']],pp:(P,t)=>glitch(P,t),post:(B,J,t)=>water(B,t)});
mv({f:'fallen',id:'f_rally',n:'打ち合い',bg:'hole',len:130,cap:'金に光ったら打ち合い。押し合いの最中に、触手が横からはさまる。',why:'剣の位置で押す、は同じ。そこへくらやみが割りこむ。',
 keys:MV.find(m=>m.id==='r_push').keys,cues:[{t:12,col:'g'},{t:50,col:'g'}],hits:[26,64],hitCol:'g',trails:[[23,28,'g'],[61,66,'g']],pp:(P,t)=>glitch(P,t),post:(B,J,t)=>water(B,t),
 fx:(B,J,t)=>{if(J.tip&&t>=12&&t<80)glow(B,Math.round(J.tip[0]),Math.round(J.tip[1]),3,'g');if(t>=30&&t<44){const u=Math.sin((t-30)/14*Math.PI);tentacle(B,J.hdB,add(J.hdB,[-6,-14*u]),add(J.hdB,[-16*u,-10*u]),1.6,.5,true)}}});
mv({f:'fallen',id:'f_swallow',n:'のまれる：第二形態へ',bg:'hole',len:180,noHero:true,cap:'膝をついたところへ、水面のくらやみが這い上がる。赤い鎧だけが残り、中身がくらやみになる。',why:'倒したはずの人が、もう一度のまれる。二度目の「のまれる」は、一度目（門のぬし）より静かに描く。',
 fAt:t=>t<120?'fallen':'fallen2',
 keys:[K(0,FI),K(30,Object.assign({},KNEEL,{sw:1.57,ua:2.3,fa:1.4})),K(118,Object.assign({},KNEEL,{sw:1.57,ua:2.3,fa:1.4})),K(120,Object.assign({},KNEEL,{sw:1.57,ua:2.3,fa:1.4,lift:0})),K(160,FI,'out'),K(180,FI)],
 post:(B,J,t)=>{water(B,t);if(t>40&&t<120){const u=(t-40)/80;for(let i=0;i<B.c.length;i++){const x=i%CW,y=i/CW|0;if(B.t[i]===1&&y>FL-u*60&&((x*5+y*3)%7)/7<u*1.3&&B.c[i]!==W_LONG.col&&B.c[i]!==W_LONG.hi&&B.c[i]!==W_LONG.lo&&B.c[i]!==OUT)B.c[i]=(x+y)%3?INK.col:INK.hi}}
  if(t>=118&&t<126)for(let i=0;i<B.c.length;i++){if(B.c[i]&&B.t[i]!==6){B.c[i]=(t%2)?'#ffffff':'#140a10'}}}});

/* ---------- 赤い門のぬし 第二形態 ---------- */
/* 水面に映るのは、のまれる前の赤い騎士。勝ったとき、映り姿と本体が入れかわる */
function reflection(B,t,spec,P,ox,alpha){const R=new Buf(CW,CH);knight(R,ox,FL,SPEC[spec||'red'],P||{},t);for(let y=0;y<CH;y++)for(let x=0;x<CW;x++){const c=R.c[y*CW+x];if(!c)continue;const yy=FL+2+Math.round((FL-y)*.5),xx=x+Math.round(Math.sin(yy*.5+t*.12)*1);if(yy>FL+1&&yy<CH&&((xx+yy)%2===0||alpha>1))B.set(xx,yy,mix(c,'#0c0a14',.45),8)}}
const F2I={ua:1.95,fa:2.7,sw:3.5,ua2:1.2,fa2:1.8};
/* 四連撃の構え：剣を腰の後ろへ低く引き（脇構え）、触手の腕は前へ低く。門の輪の触手の構え：触手の腕を背後のアーチへ掲げ、首をそらす */
const RF4={ua:1.35,fa:.85,sw:.55,ua2:2.55,fa2:2.85,cr:5,lean:.2,ff:-13,fb:10},F2R={ua2:-1.35,fa2:-.75,hd:-.28,lean:-.1,cr:1};
mv({f:'fallen2',id:'f2_idle',n:'立ち絵：水に映る本当の姿',bg:'hole',len:120,keys:sway({cr:2},{cr:3},120,2),
 cap:'背中の触手が門のアーチになり、その内側は門の向こう。足元の水面には、のまれる前の赤い騎士が映っている。',why:'彼はもう「門」そのもの。でも水面の中では、まだ赤い騎士のまま。倒す理由が、絵の中にある。',
 post:(B,J,t)=>{water(B,t);reflection(B,t,'red',J.P||{},EXX)}});
mv({f:'fallen2',id:'f2_ring',n:'門の輪の触手',bg:'hole',len:140,cap:'触手の腕を背後のアーチへ掲げ、首をそらして輪を呼ぶ。輪の目が一つずつ光り、光った順に、輪から触手が来る。',why:'門のぬしの「目の順」の総まとめ。映り姿の居合（本体は動かず、水面が光る）と、光る前に見分けられるよう、本体がアーチを呼ぶ形を足した。',
 keys:[K(0,F2I),K(10,Object.assign({},F2I,F2R),'out'),K(72,Object.assign({},F2I,F2R)),K(92,F2I,'io'),K(138,F2I)],cues:[0,1,2].map(i=>({t:14+i*14,col:'w',at:J=>{const c=add(J.sc,[4*J.k,-4*J.k]),a=Math.PI+(2+i*4)/24*Math.PI;return add(c,dir(a,19*J.k))}})),hits:[42,56,70],
 fx:(B,J,t)=>{for(let i=0;i<3;i++){const imp=42+i*14,d=t-imp;if(d>=-8&&d<12){const u=d<0?(d+8)/8:1-d/12,c=add(J.sc,[4*J.k,-4*J.k]),a=Math.PI+(2+i*4)/24*Math.PI,p=add(c,dir(a,19*J.k));tentacle(B,p,[lerp(p[0],60,u),p[1]-14],[lerp(p[0],HXX+8,u),lerp(p[1],FL-12,u)],2,.5,true)}}},
 post:(B,J,t)=>{water(B,t);reflection(B,t,'red',J.P||{},EXX)}});
mv({f:'fallen2',id:'f2_four',n:'四連撃',bg:'hole',len:150,cap:'剣を腰の後ろへ低く引き（脇構え）、触手の腕を前へ低く出して、深く腰を落として止まる。白く光ったら四連。すくい上げ、打ち下ろし、触手、打ち下ろし。一撃ごとに構えで止まって光る（触手の撃は触手の腕の先が光る）。最後の打ち下ろしだけ赤い光で重い。',why:'赤い騎士の二連撃と、ぬしの三連の合体。「二人ぶん」がひとつの体で来る。構えも二人ぶん（剣と触手の両方が構える）。つばめ返し（八相＝剣が高い、剣だけが構える）と、剣の高さで光る前に見分けられる。',
 keys:[K(0,F2I),K(14,RF4,'out'),K(28,RF4),K(40,RCUT,'in'),K(46,Object.assign({},RCUT,{ua:2.0,fa:-2.6,sw:-2.4})),K(52,Object.assign({},RCUT,{ua:3.1,fa:3.0,sw:2.9}),'in'),K(58,Object.assign({},RCUT,{ua:3.1,fa:3.0,sw:2.9,ua2:3.0,fa2:3.1})),K(70,R8),K(76,RCUT,'in'),K(100,RCUT),K(140,F2I)],
 cues:[{t:12,col:'w'},{t:48,col:'r'}],hits:[40,52,62,76],trails:[[37,42,'w'],[49,54,'w'],[73,78,'r']],
 fx:(B,J,t)=>{if(t>=58&&t<70){const u=t<62?(t-58)/4:1-(t-62)/8;tentacle(B,J.hdB,add(J.hdB,[-10*u,-8]),[lerp(J.hdB[0],HXX+10,u),lerp(J.hdB[1],FL-12,u)],1.8,.5,true)}},
 post:(B,J,t)=>{water(B,t);reflection(B,t,'red',J.P||{},EXX)}});
mv({f:'fallen2',id:'f2_core',n:'胸の核：重い一撃',bg:'hole',len:130,cap:'胸の核が赤く光る。輪の触手がすべて前に倒れてくる。重い。',why:'暗い門のぬしの「胸の口」の位置と同じ。胸＝いちばん重い、を最後まで守る。',
 keys:[K(0,F2I),K(16,Object.assign({},F2I,{lean:-.2,cr:1})),K(40,Object.assign({},F2I,{lean:-.2,cr:1})),K(48,Object.assign({},F2I,{lean:.4,x:-10}),'in'),K(80,Object.assign({},F2I,{lean:.4,x:-10})),K(120,F2I)],
 cues:[{t:20,col:'r',at:J=>add(J.sc,[0,9*J.k])}],hits:[48],hitCol:'r',
 fx:(B,J,t)=>{if(t>=20&&t<48&&(t/3|0)%2)glow(B,Math.round(J.sc[0]),Math.round(J.sc[1]+10),4,'r');if(t>=44&&t<60){const u=t<48?(t-44)/4:1-(t-48)/12;for(let i=0;i<4;i++){const p=add(J.sc,[6,-10-i*4]);tentacle(B,p,[lerp(p[0],60,u),p[1]-10],[lerp(p[0],HXX+8,u),lerp(p[1],FL-10-i*3,u)],2,.5,false)}}},
 post:(B,J,t)=>{water(B,t);reflection(B,t,'red',J.P||{},EXX)}});
mv({f:'fallen2',id:'f2_rally',n:'五合の打ち合い',bg:'hole',len:180,cap:'金に光ったら打ち合い。五回。水面の赤い騎士も、同じ型で剣を振っている。',why:'本体と映り姿が同じ動きをする＝剣だけは、のまれていない。',
 keys:MV.find(m=>m.id==='r2_rally').keys.map(k=>K(k.t,Object.assign({},k.p,{sheath:0}),k.e)),cues:[0,1,2,3,4].map(i=>({t:14+i*28,col:'g'})),hits:[0,1,2,3,4].map(i=>26+i*28),hitCol:'g',
 fx:(B,J,t)=>{if(J.tip&&t>=14&&t<150)glow(B,Math.round(J.tip[0]),Math.round(J.tip[1]),3,'g')},
 post:(B,J,t)=>{water(B,t);const base=Object.assign({},PDEF,SPEC.red.pose);reflection(B,t,'red',poseAt0(MV.find(m=>m.id==='f2_rally'),t,base),EXX)}});
const VSTANCE={ua:2.35,fa:-1.25,sw:-1.57,ua2:2.15,fa2:-1.45,sheath:0,cr:1,lean:.02,hd:.08};
const LKN={kn:1,lean:.3,ua:2.2,fa:1.3,sw:1.57,ua2:2.0,fa2:1.4,hd:.6};
mv({f:'fallen2',id:'f2_end',auraOff:t=>t>=110,n:'とどめ：塵とともに入れかわる',bg:'hole',len:320,noHero:true,cap:'膝をついた本体が、上から塵になって崩れていく。崩れたぶんだけ、水面の映り姿が粒になって下から立ち上がる。現れるのは、本気の赤い騎士の最期と同じ、剣を縦に立てた構え。目に光はない。入れかわったあと、構えたまま、足元から塵になって消える。白い羽根が一枚、ゆっくり落ちて、水面に残る。',why:'救えたように見えて、何も残らない。最後に見えるのは、いちばん美しかった構え。残るのは羽根一枚。',
 keys:[K(0,F2I),K(30,LKN,'out'),K(320,LKN)],
 post:(B,J,t)=>{water(B,t);
  const N=(x,y)=>((x*73+y*151)%97)/97;
  const sw=t<60?0:Math.min(1,(t-60)/110);
  /* 本体：上から塵に（剣も含めてすべて） */if(sw>0){const lim=-10+sw*(CH+30);for(let i=0;i<B.c.length;i++){const x=i%CW,y=i/CW|0;if(B.t[i]!==1&&B.t[i]!==2&&B.t[i]!==3&&B.t[i]!==5&&!(B.t[i]===6&&y<FL))continue;if(y<lim+N(x,y)*10-5){if(y>=FL){B.c[i]=y===FL?'#1a1428':'#0c0a14';B.t[i]=6;continue}B.c[i]=(y>lim-4&&N(x,y)>.6)?'#6a6070':0;B.t[i]=B.c[i]?4:0}}}
  /* 赤い騎士：粒になって下から立ち上がり、最後は足元から塵に */
  if(sw>0){const G=new Buf(CW,CH);knight(G,EXX-4,FL,SPEC.red2,Object.assign({eyeOff:1},VSTANCE),t);G.outline();const top=FL+2-sw*(FL+2);const dust=t>=200?Math.min(1,(t-200)/80):0,bot=FL+2-dust*(FL+4);
   for(let i=0;i<G.c.length;i++){if(!G.c[i])continue;const x=i%CW,y=i/CW|0,n=N(x,y);if(y<top+n*12-6){if(y>top-8&&n>.85)B.set(x,y,G.c[i],4);continue}
    if(dust>0&&y>bot-n*12+6){if(y<bot+8&&n>.8)B.set(x,y-((t-200)%3),'#8a8090',4);continue}B.set(x,y,G.c[i],G.t[i]===3?3:1)}}
  /* 水面：はじめは同じ構えの赤い騎士が映り、立ち上がるほど薄れる */if(sw<1){const R=new Buf(CW,CH);knight(R,EXX-4,FL,SPEC.red2,Object.assign({eyeOff:1},VSTANCE),t);for(let i=0;i<R.c.length;i++){if(!R.c[i])continue;const x=i%CW,y=i/CW|0,yy=FL+2+Math.round((FL-y)*.5);if(yy>FL+1&&yy<CH&&(x+yy)%2===0&&N(x,yy)>sw)B.set(x,yy,mix(R.c[i],'#0c0a14',.4),8)}}
  /* 舞い上がる塵 */if(t>=70)for(let p=0;p<26;p++){const x=EXX-14+((p*37)%28),y=FL-6-((t*.5+p*9)%74);B.set(x+Math.sin(t*.05+p)*3,y,p%3?'#5a5060':'#a8a0b0',4)}
  /* 白い羽根：兜の高さから、ゆらゆらと落ちて水面に残る */if(t>=240){const u=Math.min(1,(t-240)/60),hx=EXX-2+Math.sin(t*.09)*6*(1-u),hy=lerp(FL-62,FL-2,u*u*(3-2*u)),ang=u<1?Math.sin(t*.09)*.6:0;
   for(let a=0;a<28;a++){const th=a/28*6.28;if(a%2)B.set(hx+Math.cos(th)*8,hy+Math.sin(th)*5,'#7a7088',4)}
   for(let i=0;i<7;i++){const px=hx+Math.cos(ang)*(i-3)*1.3,py=hy+Math.sin(ang)*(i-3)*1.3-(i>1&&i<6?1:0);B.disc(px,py,i===3?1.5:1.1,'#f4f0e8','#ffffff','#b8b0a0',4)}
   if(u>=1&&(t>>3)%2)for(let i=-8;i<=8;i+=4)B.set(hx+i,FL+1,'#e8e0d0',4)}
  /* はじめの一瞬：とどめの白黒赤 */if(t>=36&&t<56){for(let i=0;i<B.c.length;i++){if(!B.c[i])continue;const c=rgb(B.c[i]),l=c[0]*.3+c[1]*.59+c[2]*.11;B.c[i]=(c[0]>150&&c[1]<90)?'#ff2040':l>60?'#ffffff':'#0c0a10'}}}});
/* ===== 門の系統：新しいモーションと派生の立ち絵 ===== */
const XG=Object.assign({},X);
mv({f:'gate',id:'g_enter',n:'登場：剣を交差させる',bg:'gate',len:130,noHero:false,cap:'歩み出て、二本の剣を目の前で打ち合わせ、交差させる。',why:'最初に「通行止め」の構えを見せる。この先のボスはみな、この構えの意味を受けつぐ。',
 keys:[K(0,{x:30,ua:1.6,fa:1.8,sw:1.3,ua2:1.4,fa2:1.6,sw2:1.6}),K(40,{x:10,ua:1.6,fa:1.8,sw:1.3,ua2:1.4,fa2:1.6,sw2:1.6,cr:1}),K(60,{x:0,ua:-1.6,fa:-1.2,sw:-1.5,ua2:-1.3,fa2:-1.6,sw2:-1.4,cr:0}),K(72,XG,'in'),K(130,XG)],
 fx:(B,J,t)=>{if(t>=72&&t<80)star(B,Math.round(J.hdF[0]),Math.round(J.hdF[1]-10),[3,5,5,4,3,2,1,1][t-72],'w')}});
mv({f:'dgate',id:'dg_turn',n:'のまれかけ：門番が黒い門番になる',bg:'gate',len:210,noHero:true,cap:'門番の背中の下から、くらやみがじわじわ這い上がる。前線の先を細い黒い筋が走り、のまれたところは色が抜けて黒紫の筋が浮く。はじめはゆっくり、だんだん速く、背中から胸、腕、兜まで広がる。門番は前かがみに震えながら、交差の構えだけはほどかない。全身がのまれると、粒が入れかわるように黒い門番の姿に溶けかわり、兜の目が一つずつ開く。',why:'覚悟3で門番がこの姿になる理由を、一枚で見せる。門に背を向けて立っていた番人だから、背中から。最後まで交差をほどかないのは、のまれても門番の仕事だけは体に残っているから。',
 fAt:t=>t<150?'gate':'dgate',
 keys:[K(0,XG),K(30,XG),K(90,Object.assign({},XG,{lean:.18,cr:1.5,hd:.25})),K(140,Object.assign({},XG,{lean:.32,cr:3,hd:.45})),K(150,Object.assign({},XG,{lean:.3,cr:3,hd:.4})),K(172,Object.assign({},XG,{lean:.08,cr:0,hd:0}),'out'),K(210,Object.assign({},XG,{lean:.08}))],
 pp:(P,t)=>{P.eyes=t<174?0:t<182?1:t<190?2:3;if(t>40&&t<150){const a=Math.min(1,(t-40)/80);P.x=(P.x||0)+((t%4<2)?.5:-.5)*a}},
 post:(B,J,t)=>{/* 侵食の前線：背中の下（門のある側）から距離で広がる。進み方ははじめ遅く、だんだん速い */
  const o=[J.hip[0]+7*J.k,FL-2],prog=t<24?0:Math.min(1.25,Math.pow((t-24)/112,1.7)*1.25),G=['#4a4458','#262234','#6e6880'];/* のまれた色＝黒い門番の鋼の色（入れかわりで明るさが跳ねないように） */
  if(t<150&&prog>0)for(let i=0;i<B.c.length;i++){if((B.t[i]!==1&&B.t[i]!==2)||!B.c[i])continue;const x=i%CW,y=i/CW|0,f=Math.hypot((x-o[0])*1.25,y-o[1])/64+hsh(x>>1,y>>1)*.12;
   if(f<prog-.07){const L=rgb(B.c[i]).reduce((a,b)=>a+b,0)/765;const q=rgb(B.c[i]),tr=q[0]>150&&q[1]>110&&q[2]<120,bl=q[2]>q[0]+45&&q[2]>q[1]+30;B.c[i]=bl?mix(B.c[i],'#120c1c',.45):hsh(x,y)>.93||((x+y*2+Math.floor(f*30))%17===0)?INK.col:tr?(L>.5?'#7a50a0':'#4a3058'):L>.55?G[2]:L>.3?G[0]:G[1]}
   else if(f<prog){B.c[i]=(x+y)&1?'#5a2a78':INK.hi}
   else if(f<prog+.14&&((x*3+y*2+Math.floor(f*40))%13===0))B.c[i]=INK.col}
  /* 足元から、くらやみが染み出す */if(t>=20&&t<160){const r=Math.min(14,(t-20)*.2);for(let x=-r;x<=r;x++){const xx=Math.round(o[0]+x);if((xx+t>>2)%3)B.set(xx,FL+1,INK.col,6)}}
  /* 入れかわり：のまれた門番から、粒ごとに黒い門番の絵へ溶けかわる（白く光らせない） */
  if(t>=138&&t<150){const u=(t-138)/12,Bd=new Buf(CW,CH);knight(Bd,EXX,FL,SPEC.dgate,J.P,t);for(let i=0;i<B.c.length;i++){const x=i%CW,y=i/CW|0;if(hsh(x+7,y+3)<u){if(Bd.c[i]){B.c[i]=Bd.c[i];B.t[i]=Bd.t[i]}else if(B.t[i]===1){B.c[i]=0;B.t[i]=0}}}}}});
mv({f:'dgate',id:'dg_state',n:'派生の立ち絵：目の数',bg:'gate',len:180,noHero:true,cap:'目が1つ、2つ、3つ。開いている目の数で、のまれ具合がわかる。',why:'「目＝上位の存在の視線、のまれたものほど目が増える」というモチーフを、一体の中で見せる。',
 keys:[K(0,{}),K(180,{})],pp:(P,t)=>{P.eyes=t<60?1:t<120?2:3}});
mv({f:'dgate',id:'dg_down2',n:'たおれる：鎖だけが残る',bg:'gate',len:140,noHero:true,cap:'体はくらやみに溶ける。床には交差した剣と、黒い鎖だけが残る。',why:'残った鎖は、門のぬしの鎖と同じもの。この先にいる者の正体を、ここで一度だけ見せておく。',
 keys:MV.find(m=>m.id==='dg_down').keys,post:MV.find(m=>m.id==='dg_down').post});

mv({f:'lord',id:'l_plant',n:'派生の立ち絵：鍵を床に突く',bg:'lord',len:120,noHero:true,keys:sway({ua:2.2,fa:1.3,sw:1.57,ua2:2.0,fa2:1.4,cr:1.5,lean:.05},{ua:2.2,fa:1.3,sw:1.57,ua2:2.0,fa2:1.4,cr:2.5,lean:.08},120,2),
 cap:'鍵の大剣を床に突き立て、両手をかける。門の前に立ち続けてきた姿。',why:'戦う前の「番人」の姿。鍵を手放さない＝門を手放さない。'});
mv({f:'lord',id:'l_seal',n:'派生の立ち絵：封印が脈打つ',bg:'lord',len:120,noHero:true,keys:sway({cr:1.5},{cr:2.5},120,2),
 cap:'胸の封印のひびの奥で、赤い目がゆっくり脈打つ。',why:'この赤は、のまれなかった世界線の「赤い騎士」の名残。ぬしの中にまだ残っているもの。',
 fx:(B,J,t)=>{const c=add(J.sc,[0,(-9+14*.14)*J.k+9*J.k*.86]);const on=(t%40)<20;if(on){glow(B,Math.round(J.sc[0]),Math.round(J.sc[1]+5*J.k),3,'#ff3050')}}});

mv({f:'lord2',id:'l2_threat',n:'派生の立ち絵：門が口をあける',bg:'lord',len:120,noHero:true,keys:sway({door:1.5,lean:-.15,cr:1,ten:[.0,.0,.0]},{door:1.8,lean:-.2,cr:2},120,2),
 cap:'胸の扉を大きく開き、背中の触手を広げて立つ。',why:'体そのものが門。開いた扉の奥が「門の向こう」。'});
mv({f:'lord2',id:'l2_extf',n:'伸びる刃（ふり）',bg:'lord',len:120,cap:'のびた刃の先に紫の輪が出たら、ふり。押さずに待つ。本物は次の赤い光。',why:'本物（赤）とふり（紫の輪）は、刃が伸びるところまで同じ。見るのは光の色だけ。',
 keys:[K(0,L2I),K(16,LBK),K(40,LBK),K(52,Object.assign({},LBK,{x:-2})),K(70,LBK),K(110,L2I)],cues:[{t:18,col:'p',at:J=>J.tip?[J.tip[0]-20,J.tip[1]]:J.hdF}],
 fx:(B,J,t)=>{if(J.tip&&t>=18&&t<60){const u=Math.min(1,(t-18)/12)*.5*(t<44?1:Math.max(0,1-(t-44)/16));for(let i=0;i<30*u;i++){const x=J.tip[0]-i,y=J.tip[1]+Math.sin(i*.6+t*.4)*(i/30);B.set(x,y,INK.col,1);B.set(x,y-1,i%3?INK.hi:INK.eye,1)}}}});
/* 門の向こうの指の動き：縁にかかって指先がのぞく→合図で目が光り、いったん引く（構え）→3Fで突き出る→当たって口が裂け、伸びたまま粘る→もがきながら戻る */
const GFU=(t,cue,hit,i)=>t<cue?.1+.05*Math.sin(t*.31+i*2):t<hit-3?Math.max(.02,.1-(t-cue)*.02):t<hit?lerp(.02,1,(t-(hit-3))/3):t<hit+8?1:Math.max(.1,1-(t-hit-8)/22)+.04*Math.sin(t*.5+i);
const GFT=[[HXX+6,FL-30],[HXX+12,FL-17],[HXX+6,FL-5]];
const gfTip=(t,root,i,cue,hit)=>{const S=new Buf(CW,CH);return gateFinger(S,root,GFT[i],i,{k:1,T:t,u:GFU(t,cue,hit,i)}).ch[3]};
const gfDraw=(B,t,roots,cues,hits,k)=>{for(const i of[2,0,1]){if(t<12)continue;const cue=cues[i],hit=hits[i],u=GFU(t,cue,hit,i),em=Math.min(1,(t-12)/10);
 const r=gateFinger(B,roots[i],GFT[i],i,{k,T:t,u:u*em,lit:t>=cue&&t<cue+10,eye:t>=cue+10,mouth:t>=hit-1&&t<hit+14?1-Math.max(0,t-hit)/14:0,crack:t>=hit-3&&t<hit+2});
 if(t>=hit&&t<hit+10){const d=t-hit;for(let q=0;q<7;q++){const a=-2.6+q*.8+hsh(q,i)*.4,rr=2+d*1.6;B.set(r.tip[0]+Math.cos(a)*rr,r.tip[1]+Math.sin(a)*rr*.8+d*d*.06,q%2?INK.hi:INK.col,4)}}}};
/* 門の向こうの指：予告（指先の目が小さく光る。タン・タタ＝28・14、同じぬしの解錠と同じリズム）→ 三本とも奥へ引いて止まる → 一本目の目が白く光る（予兆）→ 予告どおりに3Fで突き出る */
const L2G={pre:[30,58,72],back:82,hits:[120,148,162]};
const GFU2=(t,i)=>{const h=L2G.hits[i];return t<L2G.back?.1+.05*Math.sin(t*.31+i*2):t<h-3?Math.max(.02,.1-(t-L2G.back)*.0135):t<h?lerp(.02,1,(t-(h-3))/3):t<h+8?1:Math.max(.1,1-(t-h-8)/22)+.04*Math.sin(t*.5+i)};
const gfTip2=(t,root,i)=>{const S=new Buf(CW,CH);return gateFinger(S,root,GFT[i],i,{k:1,T:t,u:GFU2(t,i)}).ch[3]};
const gfDraw2=(B,t,roots,k)=>{for(const i of[2,0,1]){if(t<12)continue;const p0=L2G.pre[i],hit=L2G.hits[i],u=GFU2(t,i),em=Math.min(1,(t-12)/10);
 const r=gateFinger(B,roots[i],GFT[i],i,{k,T:t,u:u*em,lit:t>=p0&&t<p0+8,eye:t>=L2G.hits[i]-18,mouth:t>=hit-1&&t<hit+14?1-Math.max(0,t-hit)/14:0,crack:t>=hit-3&&t<hit+2});
 if(t>=p0&&t<p0+8)preStar(B,r.tip,t,p0);
 if(t>=hit&&t<hit+10){const d=t-hit;for(let q=0;q<7;q++){const a=-2.6+q*.8+hsh(q,i)*.4,rr=2+d*1.6;B.set(r.tip[0]+Math.cos(a)*rr,r.tip[1]+Math.sin(a)*rr*.8+d*d*.06,q%2?INK.hi:INK.col,4)}}}};
mv({f:'lord2',id:'l2_gate',gifStart:0,n:'門の向こうの指',bg:'lord',len:200,yokoku:true,cap:'背後の大門のすき間が開く。すき間の縁に、内側から三本の指がかかる。灰紫の皮、節ごとの横じわ、白い平たい爪。上の指は爪がはがれ、下の指には古い金の指輪。指先の目が一つずつ小さく光る（予告。タン・タタ）。三本とも奥へ引いて止まり、一本目の目が白く光る（予兆）。予告どおりのリズムで一本ずつ突き出る。当たる瞬間、指先の腹が縦に裂けて口になる。動くたびに節が鳴る。',why:'三つ首の竜と同じ手の指（はがれた爪、金の指輪で同じと分かる）。門の向こうにいるのが何か、ここで一度だけのぞかせる。リズムは同じぬしの解錠（タン・タタ）と同じで、予告で先に聞かせる。引いてから突き出る＝構えと攻撃がはっきり分かれる。',
 keys:[K(0,L2I),K(20,Object.assign({},L2I,{door:1.4,lean:-.2})),K(200,Object.assign({},L2I,{door:1.4,lean:-.2}))],
 cues:[0,1,2].map(i=>({t:L2G.hits[i]-28,col:'w',at:J=>gfTip2(L2G.hits[i]-28,[CW-12,22+i*14],i)})),hits:L2G.hits,
 pre:(B,t)=>{/* 背後の門のすき間 */const o=Math.min(1,t/20)*4;for(let y=6;y<FL;y++)for(let x=CW-26;x<CW;x++){const cx=CW-12;const g=Math.abs(x-cx)<o+(y%7?0:1);B.set(x,y,g?(((x+y+(t/4|0))%5)?'#1a0a2a':'#c070ff'):((x-CW)%9===0||y%12===0?'#1a1420':'#2a2232'),6)}},
 /* 指はぬしより手前に描く（この技の主役は指。ぬしが指に隠れてよい。2026-11-26 作者） */fx:(B,J,t)=>gfDraw2(B,t,[0,1,2].map(i=>[CW-12,22+i*14]),1)});
/* ===== 追加の新しい技 ===== */
/* 鎖の拍：拍は28F（予兆→当たりと同じテンポ）。打つたびに床に暗い打ち跡が一つずつ残り（光らない）、三つそろった3拍目で鎖の先が白く光る（予兆）。4拍目で来る（2026-11-26 作者。前は拍10Fで数えられず、拍の火花が予兆と同じ白だった） */
const DGB={beats:[14,42,70],hit:98,x0:EXX-16,crack:[
 {rows:[[0,-4,3],[1,-3,1],[2,-3,-1],[2,1,2],[3,-2,-1],[4,-1,-1]],br:[[4,1],[5,2],[-5,1],[2,3]],ch:[[-6,-1,1],[5,-1,0],[6,0,1]]},
 {rows:[[0,-2,5],[1,-1,4],[2,0,2],[3,1,1],[1,-3,-3]],br:[[-4,1],[-5,2],[-6,2],[3,3],[6,1]],ch:[[-3,-1,0],[7,-1,1],[8,0,0],[-7,0,1]]},
 {rows:[[0,-5,1],[0,3,4],[1,-4,0],[1,3,3],[2,-2,0],[3,-2,-2],[4,-3,-3]],br:[[2,1],[5,1],[6,2],[-6,1],[-4,5]],ch:[[-7,-1,1],[3,-1,0],[6,0,1],[-8,0,0]]}]},XBU=Object.assign({},X,{ua2:-1.2,fa2:-.6}),XBD=Object.assign({},X,{ua2:.6,fa2:1.4});
mv({f:'dgate',id:'dg_beat',gifStart:0,n:'鎖の拍',bg:'gate',len:160,cap:'黒い鎖で床を打つ（ガン・ガン・ガン）。打つたびに床に暗い打ち跡が一つずつ残る。三つ目の打ち跡と同時に鎖の先が白く光り、次の拍で鎖が横から来る。',why:'拍で読む攻撃は、小鬼のおかしらで先に教わっている。「3」は門の数字。門番の誓いの鎖が、拍を刻む道具になった。拍は予兆→当たりと同じ28Fなので、打つ音を聞いていれば次の拍が当たり。数は光らない打ち跡で数える（目の数は「来る回数」の印なので使わない）。',
 keys:[K(0,X),K(8,XBU),K(14,XBD,'in'),K(34,XBU),K(42,XBD,'in'),K(62,XBU),K(70,XBD,'in'),K(92,XBD),K(98,Object.assign({},XBD,{ua2:.2,fa2:.3}),'in'),K(116,Object.assign({},XBD,{ua2:.2,fa2:.3})),K(150,X)],
 cues:[{t:70,col:'w',at:J=>[DGB.x0-24,FL-3]}],hits:[DGB.hit],
 fx:(B,J,t)=>{const h=J.hdB,bt=DGB.beats,hit=DGB.hit;
  /* 打ち跡：打った所に暗いひびが残る（光らない）。一つ目は足もとの前、主人公の側へ12画素おきに並び、三つ目がいちばん前 */
  if(t<hit+12)for(let i=0;i<3;i++){if(t<bt[i])continue;const mx=Math.round(DGB.x0-i*12);/* 床をえぐった跡：黒い割れ目と、割れた石の灰色のふち（光らない鈍い灰。暗いステージでも読めるように、ふちで床から浮かせる） */const D='#06030a',G='#6a6470',g='#4a4652';
   /* 割れ目は1つずつ手で描いた不ぞろいの形（三角にそろえない。2024-06-11「カベ破壊ひとつに」）：rows＝[深さ, 黒の左, 右]、br＝枝のひび、ch＝欠けた石 */const SH=DGB.crack[i];
   for(const[dy,x0,x1]of SH.rows){for(let dx=x0;dx<=x1;dx++)B.set(mx+dx,FL+dy,D,3);B.set(mx+x0-1,FL+dy,dy<2?G:g,3);B.set(mx+x1+1,FL+dy,(dy+i)%2?G:g,3)}
   for(const[dx,dy]of SH.br)B.set(mx+dx,FL+dy,D,3);for(const[dx,dy,c]of SH.ch)B.set(mx+dx,FL+dy,c?G:g,3)}
  if(t<hit-6){/* 鎖：打つ前の8Fは持ち上がり、打つとその拍の打ち跡の上に落ちる */let tip=0;for(let i=0;i<3;i++)if(t>=bt[i]-8)tip=i;
   const rising=bt.some(b=>t>=b-8&&t<b);const tx=DGB.x0-tip*12;
   for(let i=0;i<20;i++){const s=i/20,x=lerp(h[0],tx,s),y=rising?lerp(h[1],FL-10,s)-Math.sin(s*3.14)*4:lerp(h[1],FL-1,Math.min(1,s*1.3));B.set(x,y,i%2?'#22142e':'#4e2c70',1)}
   /* 打った瞬間の土煙（暗い紫。光らせない） */for(const b of bt)if(t>=b&&t<b+6){const u=t-b,mx=DGB.x0-bt.indexOf(b)*12;for(let j=0;j<5;j++)B.set(mx-4+j*2,FL-1-((u+j)%3)-(u>>1),j%2?'#3a2450':'#2a1a38',2)}}
  else if(t<hit+16){/* 4拍目：鎖が床をすべって横から来る（動） */const u=Math.min(1,(t-hit+6)/6),k=t<hit+4?1:Math.max(0,1-(t-hit-4)/12);for(let i=0;i<26;i++){const s=i/26,x0=DGB.x0-24,ex=lerp(x0,HXX+8,u*k),x=s<.5?lerp(h[0],x0,s*2):lerp(x0,ex,(s-.5)*2),y=s<.5?lerp(h[1],FL-1,s*2):lerp(FL-1,FL-10,(s-.5)*2*u*k)-Math.sin((s-.5)*6.28)*3*u;B.set(x,y,i%2?'#22142e':'#4e2c70',1)}}}});
mv({f:'lord2',id:'l2_pool',n:'足元の溜まりから',bg:'lord',len:130,cap:'ぬしの足元のくらやみが、床を這ってこちらの足元まで広がる。泡が白く光ったら、真下から触手が突き上がる。',why:'黒い門番を染めた「溜まり」が、ついにこちらへ届く。くらやみは悪意ではなく、ただ広がるもの。',
 keys:[K(0,L2I),K(16,Object.assign({},L2I,{lean:.15,cr:3})),K(120,Object.assign({},L2I,{lean:.15,cr:3})),K(128,L2I)],cues:[{t:22,col:'w',at:J=>[HXX+6,FL-2]}],hits:[50],
 pre:(B,t)=>{const u=Math.min(1,t/22);for(let x=Math.round(lerp(EXX-10,HXX-4,u));x<EXX;x++){B.set(x,FL,INK.hi,6);if((x+t)%4===0)B.set(x,FL-1,INK.col,6)}},
 fx:(B,J,t)=>{if(t>=18&&t<46&&(t>>2)%2){B.set(HXX+5,FL-2,'#9a5ad0',4);B.set(HXX+8,FL-3,'#9a5ad0',4)}if(t>=46&&t<70){const u=t<50?(t-46)/4:1-(t-50)/20;for(let i=0;i<3;i++){const x=HXX+3+i*3;B.tube([x,FL],[x+(i-1)*2,FL-10*u],[x+(i-1)*4,FL-22*u],2,.5,'#4e2c70','#9a5ad0','#22142e',1)}}}});
/* ===== 赤の系統（第2版） ===== */
mv({f:'red',id:'r_delay',n:'遅らせ突き',bg:'red',len:130,cap:'剣先を引いたまま長く溜める。溜めるあいだ、何度も柄を握り直す。体ではなく、光で押す。',why:'溜めの長さで焦らせる。早く斬りたい力みが、握り直しになって漏れる。本気の溜めは、ぴたりと止まったまま。',
 keys:[K(0,RI),K(14,{ua:1.2,fa:3.0,sw:3.14,x:4,cr:3}),K(60,{ua:1.2,fa:3.0,sw:3.14,x:5,cr:3.5}),K(80,RTH,'in'),K(100,RTH),K(126,RI)],cues:[{t:52,col:'w'}],hits:[80],trails:[[77,82,'w']]});
mv({f:'red',id:'r_swap',n:'逆の二連撃',bg:'red',len:110,cap:'構えのまま白く光る。すくい上げから入り、頭上で止まってもう一度光り、打ち下ろしで終わる。',why:'門のぬしと同じ技。同じ人だから、同じ型を持っている。',
 keys:[K(0,RI),K(14,RG),K(36,RG),K(42,Object.assign({},RCUT,{ua:2.0,fa:-2.6,sw:-2.4}),'in'),K(48,R8),K(56,Object.assign({},RCUT,{ua:3.1,fa:3.0,sw:2.9,x:-46}),'in'),K(84,Object.assign({},RCUT,{ua:3.1,fa:3.0,sw:2.9,x:-46})),K(104,RI)],cues:[{t:14,col:'w'}],hits:[42,56],trails:[[39,44,'w'],[52,58,'w']]});
mv({f:'red',id:'r_thrust',n:'突き',bg:'red',len:110,cap:'剣先を引いて赤く光る。まっすぐ一突き。重い。',why:'ぬしの「解錠」の突きと同じ動き。ただし鍵は回さない。この世界線では、門を開ける必要がないから。',
 keys:[K(0,RI),K(18,{ua:1.2,fa:3.0,sw:3.14,x:4,cr:3}),K(32,{ua:1.2,fa:3.0,sw:3.14,x:4,cr:3}),K(46,RTH,'in'),K(70,RTH),K(104,RI)],cues:[{t:18,col:'r'}],hits:[46],hitCol:'r',trails:[[43,48,'r']]});
mv({f:'red',id:'r_combo4',n:'四連撃',bg:'red',len:150,cap:'白く光ったら四連。打ち下ろし、すくい上げ、打ち下ろし、突き。一撃ごとに構えで止まって光る。最後の突きだけ赤い光。',why:'型を四つつなげる。後になるほど振りが大きく、踏みこみが深くなる＝力みで前へ前へ出る。それでも合図から当たりまでの間は同じ。',
 keys:[K(0,RI),K(12,R8),K(28,R8),K(40,RCUT,'in'),K(46,Object.assign({},RCUT,{ua:2.0,fa:-2.6,sw:-2.4})),K(52,Object.assign({},RCUT,{ua:3.1,fa:3.0,sw:2.9}),'in'),K(58,R8),K(64,RCUT,'in'),K(70,{ua:1.2,fa:3.0,sw:3.14,x:-30}),K(78,RTH,'in'),K(100,RTH),K(140,RI)],
 cues:[{t:12,col:'w'},{t:50,col:'r'}],hits:[40,52,64,78],trails:[[37,42,'w'],[49,54,'w'],[61,66,'w'],[75,80,'r']]});
mv({f:'red',id:'r_seal',n:'派生の立ち絵：ひびのない封印',bg:'red',len:120,noHero:true,keys:[K(0,{}),K(120,{})],
 cap:'胸に、門のぬしと同じ金の封印。ただし、ひびがない。中には赤。',why:'同じ人の、のまれなかった姿。ぬしの封印のひびの奥に見えた赤は、ここから来ている。',fx:(B,J,t)=>{if((t%60)<30)glow(B,Math.round(J.sc[0]),Math.round(J.sc[1]+5*J.k),3,'#ffe080')}});

/* 赤い門のぬし：二つの世界線が重なった姿。門のぬしの技を受けつぐ */
const FW=(id,src,extra)=>{const m=MV.find(x=>x.id===src);const o=Object.assign({},m,{f:'fallen',id,bg:'hole'},extra||{});const post0=o.post;o.post=(B,J,t,S)=>{if(post0)post0(B,J,t,S);water(B,t)};return mv(o)};
FW('f_back','l2_back',{n:'背中の触手：目の順に',cap:'背中の触手の先の目が、白く光った順に来る。ぬしと同じ技。',why:'世界線が重なり、ぬしの体の技が赤い騎士の体に出てきた。'});
FW('f_arm','l2_arm',{n:'腕の触手',cap:'左腕だった触手がしなる。白く光ったら、のびてくる。ときどき赤い光。',why:'暗い門のぬしと同じ腕。のまれた世界線の腕が、こちらの世界線の騎士についた。'});
FW('f_sa','l2_tri',{n:'剣と触手の三連',cap:'白く光ったら三連。打ち下ろし、すくい上げ、最後に左腕の触手。一撃ごとに構えで止まって光る（触手の撃は触手の腕の先が光る）。',why:'剣は赤い騎士、触手はぬし。一つの攻撃に二つの世界線が混ざる。'});
FW('f_reach','l2_ext',{n:'伸びる刃',cap:'銀の刃の先から、くらやみがのびる。赤なら本物、紫の輪ならふり。',why:'刃は銀のまま（のまれていない）。のびる部分だけが、くらやみ。'});
FW('f_maw','l2_maw',{n:'胸の口',cap:'ひびの入った封印が扉のように開いて赤く光る。かみつく。当たると回復される。',why:'ひびのなかった封印が、ここで割れる。のまれなかった世界線の最後の守りが開く。'});
mv({f:'fallen',id:'f_shift',n:'ずれた斬撃',bg:'hole',len:130,cap:'白く光ると、のまれる前の赤い騎士の影が、半歩先に斬る。本物はその影をなぞって来る。見るのは影ではなく光。',why:'二つの世界線が重なっている。のまれなかった方の動きが、一瞬だけ先に見える。',
 keys:[K(0,FI),K(14,R8),K(30,R8),K(42,RCUT,'in'),K(70,RCUT),K(120,FI)],cues:[{t:14,col:'w'}],hits:[42],trails:[[39,44,'w']],pp:(P,t)=>glitch(P,t),
 pre:(B,t,S,P)=>{if(t>=20&&t<44){const G=new Buf(CW,CH);const P2=poseAt0(MV.find(m=>m.id==='f_shift'),Math.min(t+8,42),Object.assign({},PDEF,SPEC.red.pose));knight(G,EXX-4,FL,SPEC.red,P2,t);for(let i=0;i<G.c.length;i++){const x=i%CW,y=i/CW|0;if(G.c[i]&&(x+y+t)%3===0)B.set(x,y,mix(G.c[i],'#1a1428',.35),8)}}},post:(B,J,t)=>water(B,t)});
mv({f:'fallen',id:'f_kneel',n:'派生の立ち絵：剣を支えに',bg:'hole',len:120,noHero:true,keys:sway({kn:1,lean:.35,ua:2.3,fa:1.4,sw:1.57,hd:.3},{kn:1,lean:.4,ua:2.3,fa:1.4,sw:1.57,hd:.35},120,2),
 cap:'片膝をつき、銀の剣を床に突いて体を支える。立ち上がるたびに、くらやみが増える。',why:'本気の赤い騎士の「立ったままの最期」の、のまれた側の続き。',post:(B,J,t)=>water(B,t)});
mv({f:'fallen2',id:'f2_reflect',n:'映り姿の居合',bg:'hole',len:130,cap:'足元の水面の、赤い騎士の映り姿の目が白く光る。いつもの間で、水の中から居合が来る。',why:'映り姿も、もう味方ではない。救いはどこにもない。',
 keys:[K(0,F2I),K(130,F2I)],cues:[{t:14,col:'w',at:J=>[EXX-3,FL+12]}],hits:[42],
 post:(B,J,t)=>{water(B,t);if(t<42||t>=60)reflection(B,t,'red',{},EXX);else{reflection(B,t,'red2',{ua:3.1,fa:3.0,sw:.15,sheath:0,lean:.2,cr:5},EXX-50)}if(t>=42&&t<50)for(let x=0;x<CW;x++)if((x+t)%9<6)B.set(x,FL+6,'#ffffff',4)}});
mv({f:'fallen2',id:'f2_look',n:'派生の立ち絵：水面を見下ろす',bg:'hole',len:120,noHero:true,keys:sway({hd:.9,lean:.45,cr:3,ua:2.3,fa:1.4,sw:1.7},{hd:.95,lean:.48,cr:3.5,ua:2.3,fa:1.4,sw:1.7},120,2),
 cap:'門になった騎士が、深く首を垂れて、足元の水面に映る自分を見下ろしている。',why:'見下ろしているのか、気づいてもいないのか。それはわからない。',post:(B,J,t)=>{water(B,t);reflection(B,t,'red',J.P||{},EXX)}});

/* ===== 赤い門のぬし：さらに新しい技 ===== */
mv({f:'fallen',id:'f_twin',n:'二つの高さ',bg:'hole',len:130,cap:'白く光ると、のまれる前の影が上（八相）に、本体が下（下段）に構える。上、下の順に二回来る。下の撃の前に、本体が下段で止まってもう一度光る。',why:'二つの世界線が、別々の構えを選んだ。影の構えが、一撃目の高さを教えてくれる。',
 keys:[K(0,FI),K(14,RG),K(40,RG),K(42,Object.assign({},RCUT,{ua:2.0,fa:-2.6,sw:-2.4}),'in'),K(54,Object.assign({},RCUT,{ua:2.0,fa:-2.6,sw:-2.4,x:-46})),K(90,Object.assign({},RCUT,{ua:2.0,fa:-2.6,sw:-2.4,x:-46})),K(124,FI)],cues:[{t:14,col:'w'},{t:26,col:'w'}],hits:[42,54],trails:[[50,56,'w']],pp:(P,t)=>glitch(P,t),
 pre:(B,t)=>{if(t>=14&&t<46){const G=new Buf(CW,CH);const P2=t<38?R8:Object.assign({},RCUT,{x:-30});knight(G,EXX-6,FL,SPEC.red,P2,t);for(let i=0;i<G.c.length;i++){const x=i%CW,y=i/CW|0;if(G.c[i]&&(x+y+t)%3===0)B.set(x,y,mix(G.c[i],'#1a1428',.35),8)}}},post:(B,J,t)=>water(B,t)});
mv({f:'fallen',id:'f_iai',n:'くらやみの居合',bg:'hole',len:130,cap:'腰の鞘に手をかける。目が白く光った瞬間から、いつもの間で来る。抜かれた刃の後ろに、くらやみが尾を引く。',why:'本気の赤い騎士の居合が、のまれたあとも体に残っている。刃は銀、尾はくらやみ。',
 keys:[K(0,FI),K(10,{ua:1.7,fa:2.2,sw:null,sheath:1,cr:4.5,lean:.18}),K(41,{ua:1.7,fa:2.2,sw:null,sheath:1,cr:4.5,lean:.18}),K(42,Object.assign({},IAI,{x:-58}),'snap'),K(90,Object.assign({},IAI,{x:-58})),K(91,FI,'snap'),K(130,FI)],cues:[{t:14,col:'w',at:J=>add(J.head,[-3,0])}],hits:[42],pp:(P,t)=>glitch(P,t),
 fx:(B,J,t)=>{if(t>=42&&t<54){const y=FL-14;for(let x=0;x<CW;x++){if((x+t)%9<7-(t-42)*.5){B.set(x,y,'#ffffff',4);B.set(x,y+1,INK.hi,4);B.set(x,y-1,INK.col,4)}}}},post:(B,J,t)=>water(B,t)});
mv({f:'fallen',id:'f_cage',n:'マントの触手の檻',bg:'hole',len:160,cap:'マントだった触手が三本、こちらのまわりの水面から立ち上がる。先の目が白く光った順に、閉じてくる。',why:'斬り捨てたマントが、くらやみになって戻り、こちらを囲う。「3」は門の数字。',
 keys:[K(0,FI),K(16,Object.assign({},FI,{lean:.2,cr:3})),K(150,Object.assign({},FI,{lean:.2,cr:3}))],cues:[0,1,2].map(i=>({t:22+i*14,col:'w',at:J=>[HXX-10+i*10,FL-30+((i%2)*6)]})),hits:[50,64,78],
 fx:(B,J,t)=>{for(let i=0;i<3;i++){const bx=HXX-10+i*10,imp=50+i*14,d=t-imp;if(t<14)continue;const rise=Math.min(1,(t-14)/10),cl=d<0?0:d<8?d/8:Math.max(0,1-(d-8)/14);const tip=[lerp(bx,HXX+4,cl),lerp(FL-30+((i%2)*6),FL-12,cl)];B.tube([bx,FL],[bx+(i-1)*3,FL-16*rise],[tip[0],lerp(FL,tip[1],rise)],1.8,.5,'#4e2c70','#9a5ad0','#22142e',1);B.set(...tip.map(Math.round),'#c070ff',2)}},post:(B,J,t)=>water(B,t)});
mv({f:'fallen2',id:'f2_close',n:'アーチが閉じる',bg:'hole',len:130,cap:'背中の門のアーチが少し後ろへ反り、赤く光ったら、門ごと前へ倒れてきてこちらを押しつぶす。重い。',why:'暗い門のぬしの「扉のかみ合わせ」と同じ考え。彼は門そのものだから、門として閉じる。',
 keys:[K(0,Object.assign({},F2I,{archTilt:0})),K(16,Object.assign({},F2I,{lean:-.2,archTilt:-.15})),K(40,Object.assign({},F2I,{lean:-.25,archTilt:-.2})),K(48,Object.assign({},F2I,{lean:.3,x:-8,archTilt:1.35}),'in'),K(80,Object.assign({},F2I,{lean:.3,x:-8,archTilt:1.35})),K(122,Object.assign({},F2I,{archTilt:0}))],cues:[{t:20,col:'r',at:J=>add(J.sc,[0,-24*J.k])}],hits:[48],hitCol:'r',
 fx:(B,J,t)=>{if(t>=48&&t<56)for(let x=HXX-6;x<HXX+30;x++)B.set(x,FL-1,'#ffb0a0',4)},post:(B,J,t)=>{water(B,t);reflection(B,t,'red',J.P||{},EXX)}});
mv({f:'fallen2',id:'f2_pulse',n:'核の拍',bg:'hole',len:150,cap:'胸の核が3回脈打つ（ドクン・ドクン・ドクン）。その次の拍で、銀の剣が来る。',why:'拍で読む攻撃は先に教わっている。核の拍は、心臓の名残。剣だけは、まだ赤い騎士の手で振られる。',
 keys:[K(0,F2I),K(14,R8),K(52,R8),K(60,RCUT,'in'),K(90,RCUT),K(140,F2I)],cues:[{t:32,col:'w'}],hits:[60],trails:[[57,62,'w']],
 pp:(P,t)=>{let c=0;for(const b of[20,32,44]){const d=t-b;if(d>=0&&d<8)c=Math.max(c,(1-d/8)*1.4)}P.core=c},
 fx:(B,J,t)=>{for(const b of[20,32,44]){const d=t-b;if(d>=0&&d<12){const c=add(J.sc,[0,5*J.k]);for(let a=0;a<48;a++){const th=a/48*6.28,r=4+d*2.2;if(a%2)B.set(c[0]+Math.cos(th)*r,c[1]+Math.sin(th)*r,d<6?'#ff3050':'#a01030',4)}}}},post:(B,J,t)=>{water(B,t);reflection(B,t,'red',J.P||{},EXX)}});

/* ===== 本気の赤い騎士：居合の技を足す ===== */
mv({f:'red2',id:'r2_iai2',n:'弐の居合（すれちがい・後ろから・タン……タン）',bg:'red',len:170,cap:'【構え】正眼から剣を鞘に納め（チン）、後ろ足を大きく引き、低く前のめりに構える（走り抜ける構え）。居合で斬り抜けて、こちらの後ろへ抜ける。背後で「カチン」と納刀の音。振り返りざまに、後ろからもう一度。2撃の間が長い（タン……タン）。見るのは目の光。斬り終えたら、抜き身のまま正眼に戻る。',why:'騎士が画面の反対側へ抜けて、逆の向きから来る。参段の居合（その場から動かない）とは、騎士の位置でひと目で分かれる。',
 keys:[K(0,R2N),K(12,Object.assign({},R2N,{cr:4,lean:.38,fb:15,ff:-5,x:4}),'out'),K(41,Object.assign({},R2N,{cr:4,lean:.38,fb:15,ff:-5,x:4})),K(42,IAI,'snap'),K(53,IAI),K(54,Object.assign({},R2N,{x:-62}),'snap'),K(83,Object.assign({},R2N,{x:-62})),K(84,Object.assign({},IAI,{x:0,lean:-.1}),'snap'),K(110,Object.assign({},IAI,{x:0})),K(111,R2N,'snap'),K(170,R2N)],
 cues:[{t:14,col:'w',at:J=>add(J.head,[-3,0])},{t:56,col:'w',at:J=>add(J.head,[-3,0])}],hits:[42,84],
 fx:(B,J,t)=>{for(const h of[42,84])if(t>=h&&t<h+8){for(let x=0;x<CW;x++)if((x+t)%9<7-(t-h)*.6)B.set(x,FL-14,'#ffffff',4)}
  if(t>=54&&t<68){/* 背後の納刀の音（二撃目の合図の2F前。目が光るときには、刃はもう鞘の中） */const c=add(J.hip,[-1*J.k,1*J.k]);for(let q=0;q<2;q++){const r=3+(t-54)*1.2+q*4;for(let a=-.9;a<=.9;a+=.15){B.set(c[0]-Math.cos(a)*r,c[1]+Math.sin(a)*r,q?'#6a6278':'#a8a0b0',4);B.set(c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r,q?'#6a6278':'#a8a0b0',4)}}}}});
mv({f:'red2',id:'r2_hold',n:'溜め（切っ先が動かない）',bg:'red',len:180,cap:'正眼のまま、さらに腰を沈めて長く動かない。切っ先も肩も止まっている。じれて押せば負け。切っ先が白く光ってから、いつもの間で、引きのない両手突き。',why:'赤い騎士の遅らせ突きは、溜めるあいだ何度も柄を握り直していた。本気は止まったまま待てる。光が出るまでは、何も始まっていない。',
 keys:[K(0,R2G),K(20,Object.assign({},R2G,{cr:5.5,lean:.28})),K(105,Object.assign({},R2G,{cr:5.5,lean:.28})),K(106,{ua:3.1,fa:3.12,sw:3.14,ua2:2.85,fa2:2.95,x:-54,lean:.38,ff:-15,fb:11,cr:4.5,sheath:0},'in'),K(140,{ua:3.1,fa:3.12,sw:3.14,ua2:2.85,fa2:2.95,x:-54,lean:.38,ff:-15,fb:11,cr:4.5,sheath:0}),K(160,R2G,'io'),K(180,R2G)],
 cues:[{t:78,col:'w'}],hits:[106],trails:[[103,108,'w',0,'line']]});
mv({f:'red2',id:'r2_thrust',n:'伸び突き（赤・片手）',bg:'red',len:140,cap:'両手で剣を腰まで深く引き、低く沈んで、引いた切っ先が赤く光る。突く瞬間に左手を離し、左腕を後ろへ振って、体を一本の線に伸ばし切る片手突き。遠くから届く。重い。',why:'本気が片手になるのは赤のときだけ。両手では届かない半歩を、捨て身で届かせる。光の色（赤）だけは嘘をつかない。',
 keys:[K(0,R2G),K(14,{ua:1.2,fa:3.0,sw:3.14,ua2:1.0,fa2:2.8,x:8,cr:5.5,lean:-.1,ff:-12,fb:10,sheath:0},'out'),K(41,{ua:1.2,fa:3.0,sw:3.14,ua2:1.0,fa2:2.8,x:8,cr:5.5,lean:-.1,ff:-12,fb:10,sheath:0}),K(42,{ua:3.05,fa:3.0,sw:3.14,ua2:.35,fa2:.6,lean:.45,ff:-16,fb:12,cr:4.5,x:-56,sheath:0},'in'),K(80,{ua:3.05,fa:3.0,sw:3.14,ua2:.35,fa2:.6,lean:.45,ff:-16,fb:12,cr:4.5,x:-56,sheath:0}),K(110,R2G,'io'),K(140,R2G)],
 cues:[{t:14,col:'r'}],hits:[42],hitCol:'r',
 fx:(B,J,t)=>{if(t>=42&&t<50&&J.tip)for(let x=Math.round(J.tip[0]);x<EXX;x++)if((x+t)%4)B.set(x,Math.round(J.tip[1]),'#ffb0a0',4)}});

/* ===== 赤い騎士：構え、返し斬り、フェイントを見抜く、残心の追い打ち =====
   主人公が押した瞬間を、主人公の姿勢（heroP）で見せる */
const HG={ua:2.6,fa:-2.2,sw:-1.65,cr:1.5,lean:-.05};   /* まもる（ガード） */
const HA={ua:2.8,fa:2.55,sw:3.05,x:-14,lean:.3,ff:-9,fb:6}; /* こうげき（斬りかかる）：刃は拳から前腕の続きで前へ（手首は下へ折らない＝手首の向き＋0.5） */
const RKA={ua:1.0,fa:.5,sw:.35,ua2:1.1,fa2:.7,cr:3.5,lean:-.05,ff:-10,fb:8}; /* 返しの構え：剣を後ろへ引き、剣先を外す */
mv({f:'red',id:'r_kamae',n:'返しの構え',bg:'red',len:120,keys:[K(0,RKA),K(120,RKA)],
 cap:'剣を後ろへ引き、剣先を相手から外して、腰を落として待つ。この構えのあいだに斬りかかると、返される。待てば、構えを解いて攻めてくる。',why:'剣先を向けない＝誘い。居合のおかしらで覚えた「構え中に斬ると返される」を、赤い騎士は剣を隠す形でやる。'});
mv({f:'red',id:'r_counter',n:'返し斬り',bg:'red',len:140,heroP:t=>t>=14&&t<30?HA:null,
 cap:'返しの構えに斬りかかると、片手で払われ、すぐに赤い光。いつもの間で返し斬りが来る。弾けば「居合返し」。',why:'返し斬りも、合図から当たりまでの間は同じ。だから、斬りかかってしまっても、読めば返せる。',
 keys:[K(0,RKA),K(20,RKA),K(26,{ua:2.6,fa:-2.3,sw:-2.2,ua2:1.0,fa2:2.0,cr:2}),K(32,R8),K(58,R8),K(60,RCUT,'in'),K(90,RCUT),K(130,RKA)],
 cues:[{t:32,col:'r'}],hits:[60],hitCol:'r',trails:[[57,62,'r']],
 fx:(B,J,t)=>{if(t>=24&&t<32&&J.tip)spark(B,Math.round(J.tip[0]),Math.round(J.tip[1]),t-24,'w')}});
mv({f:'red',id:'r_seefeint',n:'フェイントを見抜かれる',bg:'red',len:140,heroP:t=>t>=28&&t<44?HG:null,
 cap:'紫の輪（ふり）のときに、まもるを押してしまうと、見抜かれる。すぐに赤い光、いつもの間で本物の一撃。打ち合いの中のふりは別。',why:'倒さねばと張りつめているから、相手が構えた瞬間に飛びかかる。ふりは「待つ」ことを試す。押せば、その迷いを斬られる。',
 keys:[K(0,RI),K(18,RI),K(22,Object.assign({},R8,{ua:-.5,fa:-2.3,sw:-1.0,x:-6,lean:.12,cr:3}),'out'),K(30,Object.assign({},R8,{ua:-.5,fa:-2.3,sw:-1.0,x:-6,lean:.12,cr:3})),K(34,R8),K(60,R8),K(62,RCUT,'in'),K(92,RCUT),K(132,RI)],
 cues:[{t:20,col:'p'},{t:34,col:'r'}],hits:[62],hitCol:'r',trails:[[59,64,'r']],
 fx:(B,J,t)=>{if(t>=30&&t<36)B.set(J.head[0]-4,J.head[1],'#ffffff',4)}});
mv({f:'red',id:'r_zanpunish',n:'残心に手を出す',bg:'red',len:150,heroP:t=>t>=56&&t<72?HA:null,
 cap:'残心の最中に、こうげき・まもる・かいふく・まほうのどれかを押すと、もう一撃来る。赤い光、いつもの間で。待てば、構えを解く。',why:'残心は、すきではない。何かをしようとした瞬間が、いちばん危ない。',
 keys:[K(0,RI),K(12,R8),K(28,R8),K(40,Object.assign({},RCUT,{sw:2.2,ua:2.6,fa:2.3}),'in'),K(60,Object.assign({},RCUT,{sw:2.2,ua:2.6,fa:2.3})),K(66,Object.assign({},RCUT,{ua:2.0,fa:-2.6,sw:-2.4})),K(92,Object.assign({},RCUT,{ua:2.0,fa:-2.6,sw:-2.4})),K(94,Object.assign({},RCUT,{ua:3.1,fa:3.0,sw:2.9,x:-48}),'in'),K(120,Object.assign({},RCUT,{ua:3.1,fa:3.0,sw:2.9,x:-48})),K(146,RI)],
 cues:[{t:12,col:'w'},{t:66,col:'r'}],hits:[40,94],trails:[[36,42,'w'],[91,96,'r']]});
mv({f:'red2',id:'r2_seefeint',n:'フェイントを見抜かれる（本気）',bg:'red',len:150,heroP:t=>t>=30&&t<46?HG:null,
 cap:'紫の輪のときに、まもるを押してしまうと、すぐに剣先が赤く光る。八相へ短く上げ、体ごと斬り下ろす。赤い角ばった軌跡が残る。いつもの間で来る。',why:'迷いを見抜いた瞬間を、冷静に斬る。赤い角ばった軌跡は「見抜かれた」印。',
 keys:[K(0,R2G),K(16,Object.assign({},R2G,{cr:5.2,lean:.26})),K(22,R2G),K(34,Object.assign({},R8,{sheath:0,cr:4,ff:-11,fb:9}),'out'),K(58,Object.assign({},R8,{sheath:0,cr:4,ff:-11,fb:9})),K(62,Object.assign({},RCUT,{x:-46,cr:5,lean:.35,sheath:0}),'in'),K(96,Object.assign({},RCUT,{x:-46,cr:5,lean:.35,sheath:0})),K(130,R2G,'io'),K(150,R2G)],
 cues:[{t:16,col:'p'},{t:34,col:'r'}],hits:[62],hitCol:'r',trails:[[58,64,'r']]});

/* ===== 本気の赤い騎士：居合以外の技。弧の技と直線の技でメリハリをつける ===== */
const R2D={ua:1.95,fa:2.7,sw:3.5,ua2:1.5,fa2:2.3,sheath:0,cr:3,lean:.15};
mv({f:'red2',id:'r2_moon',n:'満月（弧）',bg:'red',len:140,cap:'正眼から、腕ごと頭上へ大きく振りかぶり、剣先が白く光る。体ごと踏みこんで、頭上から大きな弧で振り下ろす。剣先は前で床近くまで下りきり、そこから両手を腰へ引きつけて、低いところを手前へ斬り抜ける（引き斬り）。肘を少し曲げた低い構えで止まる。見るのは剣先。',why:'予備動作のない技の多い本気の中で、ただ一つ大きく見せる一撃。剣先の通り道が、上の弧と下の引きで大きな半月を描く。緊張の続く戦いの中の「緩」。',
 keys:[K(0,R2G),K(10,R2D),K(14,{ua:-2.6,fa:-2.2,sw:.2,sheath:0,cr:2,lean:-.1}),K(34,{ua:-2.6,fa:-2.2,sw:.2,sheath:0,cr:2.2,lean:-.12}),K(39,{ua:-2.7,fa:-2.75,sw:-2.0,ua2:-2.5,fa2:-2.8,x:-24,lean:.1,cr:3,sheath:0},'in'),
  K(42,{ua:2.95,fa:2.75,sw:2.35,ua2:2.75,fa2:2.65,x:-46,lean:.32,ff:-13,fb:9,cr:4.2,sheath:0},'in'),
  K(46,{ua:2.55,fa:2.45,sw:2.25,ua2:2.35,fa2:2.35,x:-46,lean:.38,ff:-14,fb:10,cr:5,sheath:0},'out'),
  K(56,{ua:1.75,fa:2.45,sw:2.6,ua2:1.6,fa2:2.35,x:-38,lean:.26,ff:-14,fb:10,cr:5.2,sheath:0},'io'),
  K(80,{ua:1.75,fa:2.45,sw:2.6,ua2:1.6,fa2:2.35,x:-38,lean:.24,ff:-14,fb:10,cr:5.2,sheath:0}),K(108,R2D,'io'),K(130,R2G,'io')],
 cues:[{t:14,col:'w'}],hits:[42],trails:[[34,58,'w',0,'arc']]});
mv({f:'red2',id:'r2_tsubame',n:'つばめ返し（弧が二つ）',bg:'red',len:150,cap:'白く光ったら、上からの円弧。剣を下に置いて止まり、もう一度光ったら下からの円弧。2撃の間はふつう（タン・タン）。見るのは剣先。',why:'円の技を二つ、向きを逆にしてつなぐ。二撃目の光は、一撃目の終わりに出る。',
 keys:[K(0,R2G),K(10,R2D),K(14,R8),K(42,Object.assign({},RCUT,{x:-46}),'in'),K(46,Object.assign({},RCUT,{x:-46,ua:2.4,fa:2.0,sw:1.95})),K(56,Object.assign({},RCUT,{x:-46,ua:2.2,fa:-2.6,sw:-2.2}),'in'),K(84,Object.assign({},RCUT,{x:-46,ua:2.2,fa:-2.6,sw:-2.2})),K(140,R2G)],
 cues:[{t:14,col:'w'},{t:28,col:'w'}],hits:[42,56],trails:[[36,44,'w',0,'arc'],[49,58,'w',0,'arc']]});
mv({f:'red2',id:'r2_juji',n:'十文字（タタン・重い）',bg:'red',len:150,cap:'正眼から剣を脇に引き、剣先が赤く光る。横一文字に薙いで、間を置かずに真上から唐竹割り。赤い角ばった軌跡が十字に残る。2撃とも重く、間が短い（タタン）。',why:'赤い角ばった軌跡は「重い一撃」の印。横と縦、二本の赤い線が交わって十字になる。弾き切れば、二度大きく返せる。',
 keys:[K(0,R2G),K(10,Object.assign({},RW,{sheath:0,cr:4})),K(38,Object.assign({},RW,{sheath:0,cr:4.5,x:4})),K(42,{ua:3.0,fa:3.0,sw:3.0,ua2:2.6,fa2:2.8,x:-44,lean:.25,ff:-13,fb:9,cr:4,sheath:0},'in'),K(44,{ua:-2.2,fa:-1.7,sw:-1.3,x:-44,lean:-.05,cr:3,sheath:0}),K(50,{ua:2.8,fa:2.5,sw:2.0,x:-48,lean:.35,ff:-13,fb:9,cr:5,sheath:0},'in'),K(84,{ua:2.8,fa:2.5,sw:2.0,x:-48,lean:.35,ff:-13,fb:9,cr:5,sheath:0}),K(144,R2G)],
 cues:[{t:14,col:'r'},{t:22,col:'r'}],hits:[42,50],hitCol:'r',trails:[[38,43,'r'],[45,51,'r']]});
mv({f:'red2',id:'r2_pierce',n:'貫き（直線・重い）',bg:'red',len:130,cap:'剣先をこちらに向けたまま、赤く光る。一直線に、遠くから貫いてくる。重い。',why:'直線の技の中でいちばん重いもの。剣先が一点しか動かないので、軌跡は短い一本の線。',
 keys:[K(0,R2G),K(10,{ua:1.2,fa:3.0,sw:3.14,sheath:0,x:8,cr:4}),K(38,{ua:1.2,fa:3.0,sw:3.14,sheath:0,x:10,cr:4.5,lean:-.1}),K(42,{ua:3.1,fa:3.12,sw:3.14,ua2:2.8,fa2:2.9,x:-56,lean:.3,ff:-15,fb:10,sheath:0},'in'),K(80,{ua:3.1,fa:3.12,sw:3.14,ua2:2.8,fa2:2.9,x:-56,lean:.3,ff:-15,fb:10,sheath:0}),K(124,R2G)],
 cues:[{t:14,col:'r'}],hits:[42],hitCol:'r',trails:[[38,44,'r',0,'line']]});
/* 打ち合い：溜めは大きな弧、詰めはまっすぐな線 */
const RLY=(f,id,n,bg,seq,cap,why,extra)=>{const ks=[K(0,f==='red2'?R2G:RI)],cues=[],hits=[],trs=[];let t=10;
 seq.forEach((g,i)=>{const arc=g==='tame';cues.push({t,col:'g'});const wind=arc?{ua:-2.6,fa:-2.2,sw:.2,cr:2,lean:-.1,sheath:0}:{ua:1.2,fa:3.0,sw:3.14,x:2,cr:3,sheath:0};const gap=arc?40:20;const hit=t+gap;
  ks.push(K(t,wind));ks.push(K(hit-2,wind));ks.push(K(hit,arc?{ua:3.0,fa:2.6,sw:2.1,x:-30,lean:.3,ff:-12,fb:9,sheath:0}:{ua:3.1,fa:3.12,sw:3.14,x:-30,lean:.25,ff:-12,fb:9,sheath:0},'in'));hits.push(hit);trs.push([hit-(arc?8:4),hit+2,'g',0,arc?'arc':'line']);t=hit+10});
 ks.push(K(t+20,f==='red2'?R2G:RI));return mv(Object.assign({f,id,n,bg,len:t+30,cap,why,keys:ks,cues,hits,hitCol:'g',trails:trs},extra||{}))};
RLY('red2','r2_rallyx','打ち合い：溜めは弧、詰めは線','red',['tume','tame','tume','tume','tame'],'金に光ったら打ち合い。長く溜めた合は、頭上から大きな弧。間の短い「詰め」の合は、まっすぐな突き。軌跡の形で、次の合の間がわかる。','溜めと詰めで、剣の通る道まで変わる。耳（間）と目（軌跡）の両方で、打ち合いのリズムを読ませる。');
RLY('red','r_rallyx','打ち合い：溜めは弧、詰めは線','red',['tume','tame','tume'],'金に光ったら打ち合い。溜めの合は大きな弧、詰めの合はまっすぐな突き。','本気の五合の前に、三合で同じ決まりを見せておく。');

mv({f:'red2',id:'r2_silent',n:'無音の居合（光らない）',bg:'red',len:140,cap:'正眼から剣を鞘に納める（チン）。そのあと合図の光は出ない。腰の鞘から「チャキ」と鯉口を切る音がする。その音から、いつもの間で来る。見るのは光ではなく、鞘と音。',why:'光らない攻撃は、ゆうれいの中ボスで先に教わっている。光に頼りきったプレイヤーへの、剣の達人からの試験。',
 keys:[K(0,R2N),K(14,Object.assign({},R2N,{cr:4.8})),K(41,Object.assign({},R2N,{cr:4.8})),K(42,IAI,'snap'),K(90,IAI),K(91,R2N,'snap'),K(140,R2N)],hits:[42],
 fx:(B,J,t)=>{if(t>=14&&t<30){/* 音の輪：光ではない（灰色の弧が三重に広がる） */const c=add(J.hip,[-1*J.k,1*J.k]);for(let q=0;q<3;q++){const r=3+(t-14)*1.1+q*4;if(r>22)continue;for(let a=-.9;a<=.9;a+=.12){B.set(c[0]-Math.cos(a)*r,c[1]+Math.sin(a)*r,q?'#6a6278':'#a8a0b0',4);B.set(c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r,q?'#6a6278':'#a8a0b0',4)}}}
  if(t>=42&&t<50){for(let x=0;x<CW;x++)if((x+t)%9<7-(t-42)*.6)B.set(x,FL-14,'#d8dce8',4)}}});

IAIWRAP('r2_iai',20);IAIWRAP('r2_iai2',20);IAIWRAP('r2_silent',20);
/* 本気の返しの構え：鯉口を切り、刃が少しだけ見えている＝もう抜いている */
const R2K={ua:1.75,fa:2.3,sw:null,sheath:1,ua2:1.3,fa2:2.4,cr:5.5,lean:.25,ff:-13,fb:9,hd:.12};
const bladePeek=(B,J)=>{const k=J.k,h=J.hip,a=add(h,[-1*k,1*k]);for(let i=0;i<4;i++){B.set(a[0]-2*k-i*1.1*k,a[1]+1*k+i*.4*k,i%2?'#ffffff':'#d8dce8',2)}};
mv({f:'red2',id:'r2_kamae',n:'返しの構え（本気）',bg:'red',len:120,keys:[K(0,R2K),K(120,R2K)],fx:(B,J)=>bladePeek(B,J),
 cap:'いつもより深く腰を落とし、鯉口を切っている。鞘の口から、刃が少しだけ見えている。このあいだに斬りかかると、返される。',why:'刃がもう見えている＝もう抜いている。居合の構えとの違いは、鞘の口の銀色だけ。見る場所を一つに絞る。'});
/* 本気の返し：居合の斬り上げ。下から上へ、画面を大きく裂く角ばった赤い斬撃 */
const riseCut=(B,t,h)=>{const d=t-h;if(d<0||d>18)return;const P=FX_R,p0=[HXX-10,FL+2],pm=[HXX+2,FL-34],p1=[HXX+36,FL-80];const grow=Math.min(1,(d+1)/2),fade=d<7?1:Math.max(0,1-(d-7)/11);
 const seg=(a,b,s0,s1,W)=>{for(let i=0;i<=40;i++){const s=i/40,g=s0+(s1-s0)*s;if(g>grow)break;const c=[lerp(a[0],b[0],s),lerp(a[1],b[1],s)],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy),n=[-dy/L,dx/L];
  const w=W*(g<.45?g/.45:(1-g)/.55)*fade;if(w<.3)continue;for(let o=-w;o<=w;o+=.5){const q=Math.abs(o)/w;if(fade<.6&&(i+t)%2)continue;B.set(c[0]+n[0]*o,c[1]+n[1]*o,q<.25?P.core:q<.55?P.hi:q<.85?P.mid:P.ol,4)}}};
 seg(p0,pm,0,.42,6);seg(pm,p1,.42,1,6.5);/* 角：折れ目に小さな光 */if(d<4)fxStar(B,pm[0],pm[1],d,P);if(d>=7)fxShards(B,pm[0],pm[1],d-7,P,5,14)};
mv({f:'red2',id:'r2_counter',n:'返し斬り（本気）：居合の斬り上げ',bg:'red',len:150,heroP:t=>t>=14&&t<30?HA:null,
 cap:'返しの構え（鯉口を切った居合の構え）に斬りかかると、鞘ごと受け止められ、すぐに目が赤く光る。さらに深く沈んで、いつもの間で居合。鞘から抜きざまに、下から上へ斬り上げる。床すれすれからこちらの頭上の先まで、画面を大きく裂く角ばった赤い斬撃が走る。斬り上げきった剣を頭上に立てて止まり、ゆっくり下ろして、チンと鞘に納める。弾けば居合返し。',why:'構えが居合なら、返しも居合。受けるのは剣ではなく鞘。もう抜く準備ができているから、受けた手のまま斬れる。下から上へ、画面の高さいっぱいの角ばった軌跡＝見落としようのない、重い返し（赤）。',
 keys:[K(0,R2K),K(20,R2K),K(26,Object.assign({},R2K,{lean:.05,cr:4.5})),K(34,Object.assign({},R2K,{cr:6.2,lean:.36,ff:-15,fb:11}),'out'),K(59,Object.assign({},R2K,{cr:6.3,lean:.38,ff:-15,fb:11})),
  K(60,{ua:-2.45,fa:-2.75,sw:-2.0,ua2:.4,fa2:.8,x:-24,lean:.12,cr:2.6,ff:-16,fb:11,sheath:0},'snap'),K(65,{ua:-1.95,fa:-2.05,sw:-1.5,ua2:.35,fa2:.7,x:-26,lean:-.08,cr:2,ff:-16,fb:11,sheath:0},'out'),
  K(96,{ua:-1.95,fa:-2.05,sw:-1.5,ua2:.35,fa2:.7,x:-26,lean:-.06,cr:2.2,ff:-16,fb:11,sheath:0}),K(116,Object.assign({},R2B,{x:-12}),'io'),K(118,Object.assign({},R2K,{x:-12}),'snap'),K(150,R2K,'io')],
 cues:[{t:32,col:'r',at:J=>add(J.head,[-3,0])}],hits:[60],hitCol:'r',
 fx:(B,J,t)=>{if(t<26||(t>=118))bladePeek(B,J);if(t>=24&&t<32)spark(B,Math.round(J.hip[0]-4),Math.round(J.hip[1]-2),t-24,'w');riseCut(B,t,60);chinRing(B,J,t,118)}});

/* ===== 強さの順を整える：後の者に技と読み方を足す ===== */
/* 門のぬし：黒い門番より上に。リズムの軸を足す */
mv({f:'lord',id:'l_unlock',n:'解錠（タン・タタ）',bg:'lord',len:192,cap:'鍵を顔の前に立て、空中でカチ（白）・カチ（赤）と二回まわして見せる。まわすたびに鍵の先が小さく光る（白は軽い、赤は重い）。見せ終えると鍵を深く引いて止まり、白く光って突き刺す（タン）。刺したまま鍵を逆へひねり戻して止まり、もう一度光ってから、見せたとおりに二度ひねる（タタ）。最後のひねりだけ赤くて重い。',why:'見分け方は構え。「鍵を立てて、回して見せる」なら連撃。見せた回数が、突きのあとのひねりの数で、見せた光の色がそのひねりの重さ。最初から深く引いて止まる赤い突き（一撃）とは形がちがう。予兆の光は、見せる動きが終わって引いた構えで止まってから出す（2026-11-25）。',
 keys:[K(0,LI),K(14,LKU,'out'),K(24,LKU),K(26,LKT,'in'),K(29,LKU),K(32,LKU),K(34,LKT,'in'),K(37,LKU),K(40,LBK),K(64,LBK),K(68,LTH,'in'),K(74,Object.assign({},LTH,{fa:-3.0,sw:3.0})),K(108,Object.assign({},LTH,{fa:-3.0,sw:3.0})),K(112,Object.assign({},LTH,{fa:3.0,sw:3.3}),'in'),K(119,Object.assign({},LTH,{fa:-3.0,sw:3.0})),K(126,Object.assign({},LTH,{fa:3.0,sw:3.3,x:-18}),'in'),K(162,LTH),K(186,LI)],
 cues:[{t:40,col:'w'},{t:84,col:'w'},{t:98,col:'r'}],hits:[68,112,126],trails:[[64,70,'w']],
 fx:(B,J,t)=>{/* 見せるカチ：鍵の先が小さく光る（予兆ではなく、ひねりの数と重さの印） */for(const[s0,c]of[[26,'w'],[34,'r']])if(t>=s0&&t<s0+8&&J.tip)star(B,Math.round(J.tip[0]),Math.round(J.tip[1]),[2,3,3,2,2,1,1,1][t-s0],c);
  for(const h of[112,126])if(t>=h&&t<h+6&&J.tip)star(B,Math.round(J.tip[0]+5),Math.round(J.tip[1]),[3,2,3,2,1,1][t-h],h===126?'r':'w')}});

/* ===== 門のぬしの打ち合い（いまのゲームの打ち合いに合わせる）=====
   誘いのひと振り（金）→踏みこみ・画面が締まる→合（ふつう／溜め／詰め／フェイント）→鍔迫り合い→最後のひと振り（赤）→打ち返し。途中で崩されると、くずし斬り（赤）。
   ぬしの剣は鍵。溜めは頭上の大きな弧、詰めは鍵の歯で短く突く線。鎖が、押し合いの力を見せる。 */
const RX=-14,LRI={ua:2.2,fa:2.0,sw:2.6,ua2:2.0,fa2:2.0,x:RX,cr:3,lean:.1},LOPEN={ua:-2.5,fa:-2.0,sw:.3,ua2:-2.3,fa2:-1.8,cr:3,lean:-.15,x:2},
 LOVR={ua:-2.75,fa:-2.75,sw:-1.55,ua2:-2.6,fa2:-2.6,cr:4.5,lean:-.22,x:RX+4},LARC={ua:3.0,fa:2.6,sw:2.1,ua2:2.8,fa2:2.5,x:RX-6,lean:.4,ff:-12,fb:9,cr:5},
 LLO={ua:.9,fa:2.4,sw:3.0,ua2:.9,fa2:2.2,x:RX+4,cr:4,lean:-.05},LJAB={ua:3.1,fa:3.12,sw:3.14,ua2:3.0,fa2:3.1,x:RX-6,lean:.3,cr:3,ff:-12},
 LUPR=Object.assign({},LUP,{x:RX+2}),LDNR=Object.assign({},LDN,{x:RX-6}),LLOCK={ua:2.2,fa:.9,sw:2.35,ua2:2.0,fa2:.9,x:RX-4,lean:.42,cr:4.5,ff:-11,fb:9},
 LSHOVE={ua:2.9,fa:2.9,sw:2.0,ua2:2.8,fa2:2.8,x:RX+8,lean:-.25,cr:2},LSPIN={ua:-2.4,fa:-1.0,sw:.6,ua2:-2.2,fa2:-1.0,x:RX+10,cr:5.5,lean:-.35},
 LLAST={ua:2.9,fa:2.9,sw:2.6,ua2:2.8,fa2:2.8,x:RX-6,lean:.55,cr:6,ff:-14,fb:10},LSTAG={ua:1.0,fa:.2,sw:-.6,ua2:.8,fa2:.4,x:RX+6,lean:-.45,cr:1},LSIDE={ua:-.3,fa:-1.2,sw:.2,ua2:-.1,fa2:-1.0,x:RX+6,cr:4,lean:-.2};
const HRG={ua:2.6,fa:-2.2,sw:-1.65,cr:1.5,x:-8},HRP={ua:-.2,fa:-1.0,sw:-1.9,lean:.15,x:-9},HRL={ua:2.9,fa:-1.2,sw:-.9,lean:.32,cr:3,x:-11},HRB={ua:-2.7,fa:-2.6,sw:.4,lean:-.4,cr:1,x:-2},HRC={ua:3.0,fa:2.7,sw:2.4,x:-104,lean:.35,ff:-9,fb:6};
/* 画面の上下が締まる（打ち合いのあいだ）。ぶつかる点の金の火花 */
const rbars=(B,h)=>{h=Math.round(h);for(let y=0;y<h;y++)for(let x=0;x<CW;x++){B.set(x,y,'#000000',4);B.set(x,CH-1-y,'#000000',4)}};
const clash=(B,d,x,y)=>{if(d<0||d>9)return;star(B,x,y,[5,6,5,4,3,3,2,2,1,1][d],'g');ring(B,x,y,3+d*1.3,'g')};
const CXP=[HXX+20,FL-24];
const slashC=(B,J,t,h,col)=>{const d=t-h;if(d<-1||d>6||!J.tip||!J.hdF)return;const c=J.hdF,R=Math.hypot(J.tip[0]-c[0],J.tip[1]-c[1]),u=Math.min(1,(d+1)/2),a0=4.4,a1=lerp(4.4,2.35,u);for(let w=0;w<4;w++){if(d>2&&w>4-d)continue;arc(B,c[0],c[1],R-w*1.2,a0,a1,col,1)}};
mv({f:'lord',id:'l_r_open',n:'打ち合い：誘いのひと振り（金）',bg:'lord',len:140,heroP:t=>t>=40&&t<50?HRP:t>=50?HRG:null,
 cap:'鍵を右肩にかつぎ、金に光る。大きな肩口からの一振り。これを弾いたときだけ打ち合いが始まる。弾いた瞬間、二人とも間合いへ踏みこみ、画面の上下が締まる。背中の鎖がぴんと張る。',why:'始まりの合図は金。弾けなければ何も始まらない（ただの一撃で終わる）。踏みこみと画面の締まりで「ここから決闘」と体で分かる。',
 keys:[K(0,LI),K(14,LOPEN,'out'),K(38,LOPEN),K(42,Object.assign({},LDN,{x:-12}),'in'),K(50,Object.assign({},LDN,{x:-12})),K(62,LRI,'out'),K(140,LRI)],
 cues:[{t:14,col:'g'}],hits:[42],hitCol:'g',pp:(P,t)=>{if(t>=50)P.chainL=12},
 fx:(B,J,t)=>{clash(B,t-42,CXP[0],CXP[1])},post:(B,J,t)=>{if(t>=44)rbars(B,Math.min(10,(t-44)*.6))}});
mv({f:'lord',id:'l_r_tame',n:'打ち合い：溜めの合（長い間・弧）',bg:'lord',len:120,heroP:t=>t>=48&&t<56?HRP:HRG,
 cap:'前の合から間が長い「溜め」の合。ぬしは鍵を頭上へまっすぐ掲げ、手首の鎖が腕に巻きついてきしむ。金に光ってから、頭上から大きな弧で打ち下ろす。',why:'間が長い合は、剣の通り道も大きな弧。耳（間）と目（軌跡）の両方で、次の合のリズムが分かる。赤い騎士の「溜めは弧」と同じ決まり。',
 keys:[K(0,LRI),K(8,LOVR,'out'),K(46,LOVR),K(48,LARC,'in'),K(60,LARC),K(84,LRI),K(120,LRI)],cues:[{t:20,col:'g'}],hits:[48],hitCol:'g',trails:[[40,50,'g',0,'arc']],
 pp:(P,t)=>{if(t>=10&&t<46){P.x+=Math.sin(t*1.9)*.4;P.chainL=10}},fx:(B,J,t)=>{clash(B,t,CXP[0],CXP[1]);clash(B,t-48,CXP[0],CXP[1]-6)},post:(B,J,t)=>rbars(B,10)});
mv({f:'lord',id:'l_r_tsume',n:'打ち合い：詰めの合（短い間・線）',bg:'lord',len:90,heroP:t=>t>=34&&t<42?HRP:HRG,
 cap:'前の合から間が短い「詰め」の合。振りかぶらない。鍵を腰に引いたまま金に光り、鍵の歯で短く、まっすぐ突く。軌跡は一本の線。',why:'間が短い合は、通り道も最短の線。弧が見えたら「長い」、線が見えたら「短い」。',
 keys:[K(0,LRI),K(4,LLO,'out'),K(32,LLO),K(34,LJAB,'in'),K(44,LJAB),K(60,LRI),K(90,LRI)],cues:[{t:6,col:'g'}],hits:[34],hitCol:'g',trails:[[30,36,'g',0,'line']],
 fx:(B,J,t)=>{clash(B,t,CXP[0],CXP[1]);clash(B,t-34,CXP[0]-2,CXP[1]+2)},post:(B,J,t)=>rbars(B,10)});
mv({f:'lord',id:'l_r_feint',n:'打ち合い：フェイント',bg:'lord',len:140,heroP:t=>t>=78&&t<86?HRP:HRG,
 cap:'振り上げて、鍵の輪（柄頭）が紫の輪に光る。振り下ろしかけて、途中でぴたりと止め、ゆっくり引き戻す。押せば崩される。間をおいて、金に光った本物が来る。',why:'打ち合いの中でも、紫の輪は「ふり」。止まった鍵を見て、押さずに待つ。',
 keys:[K(0,LRI),K(8,LUPR,'out'),K(14,LUPR),K(22,Object.assign({},LUPR,{ua:.4,fa:.2,sw:1.6,x:RX-4,lean:.2}),'in'),K(36,Object.assign({},LUPR,{ua:.4,fa:.2,sw:1.6,x:RX-4,lean:.2})),K(46,LUPR,'io'),K(76,LUPR),K(78,LDNR,'in'),K(92,LDNR),K(118,LRI),K(140,LRI)],
 cues:[{t:12,col:'p'},{t:50,col:'g'}],hits:[78],hitCol:'g',trails:[[74,80,'g',0,'arc']],fx:(B,J,t)=>{clash(B,t-78,CXP[0],CXP[1])},post:(B,J,t)=>rbars(B,10)});
mv({f:'lord',id:'l_r_lock',n:'打ち合い：鍔迫り合い',bg:'lord',len:110,heroP:t=>t<4?HRP:t<76?Object.assign({},HRL,{x:HRL.x+Math.sin(t*1.3)*.6}):t<84?Object.assign({},HRG,{x:-2,lean:-.2}):HRG,
 cap:'最後のひと振りの前は、刃と鍵がかみ合ったまま押し合う。鍵の歯が刃に食いこみ、金の火花が散り、背中の鎖が限界まできしむ。ぬしが体重をかけてのしかかり、二人の足が床を削る。押し合いのあと、突き放す。だから最後のひと振りは一拍遅れて来る。',why:'押し合いは「次が最後」の合図。ゲームでは残りの合の目盛りの最後が赤く脈打つ。急がず、突き放されてからの赤い光を待つ。',
 keys:[K(0,LDNR),K(6,LLOCK,'out'),K(72,LLOCK),K(78,LSHOVE,'out'),K(110,LSHOVE)],pp:(P,t)=>{if(t>=6&&t<72){P.x+=Math.sin(t*1.3)*.6;P.chainL=8}},
 fx:(B,J,t)=>{clash(B,t,CXP[0],CXP[1]);if(t>=6&&t<74&&t%3===0){const x=CXP[0]+((t*7)%5)-2,y=CXP[1]+((t*3)%5)-2;star(B,x,y,2,'g');B.set(x-3,y-2,'#fff3b0',4);B.set(x+2,y-3,'#ffd27a',4)}if(t>=6&&t<74&&t%6<3){for(const fx of[HXX+6,EXX+RX+4])B.set(fx+((t>>1)%3),FL-1,'#8a8094',4)}},post:(B,J,t)=>rbars(B,10)});
/* 暗い門のぬし：同じ打ち合いに、触手の合と重い合が混ざる */
const L2R=(id,src,n,cap,why)=>CL('lord2',id,src,{n,cap,why},p=>Object.assign({},p,{ua2:p.ua2!=null?p.ua2*.6+.6:1.0,fa2:1.4}));
/* 赤い門のぬし：赤い騎士の決まり（見抜く・返す・残心）を受けつぐ */
const FWR=(id,src,extra)=>{const m=MV.find(x=>x.id===src);const o=Object.assign({},m,{f:'fallen',id,bg:'hole'},extra||{});const post0=o.post,pp0=o.pp;o.pp=(P,t)=>{if(pp0)pp0(P,t);glitch(P,t)};o.post=(B,J,t,S)=>{if(post0)post0(B,J,t,S);water(B,t)};return mv(o)};
FWR('f_seefeint','r_seefeint',{n:'フェイントを見抜かれる',cap:'紫の輪でまもるを押すと、見抜かれる。赤い光、いつもの間で本物。左腕の触手が、そのあとを追ってくる。',why:'のまれても、剣の目は残っている。見抜く決まりは赤い騎士と同じ。',
 cues:[{t:20,col:'p'},{t:34,col:'r'},{t:48,col:'w',at:J=>J.hdB}],hits:[62,76],hitCol:'r',
 fx:(B,J,t)=>{if(t>=72&&t<84){const u=t<76?(t-72)/4:1-(t-76)/8;tentacle(B,J.hdB,add(J.hdB,[-10*u,-8]),[lerp(J.hdB[0],HXX+10,u),lerp(J.hdB[1],FL-12,u)],1.6,.5,true)}}});
FWR('f_counter','r_counter',{n:'返し斬り',cap:'返しの構えに斬りかかると、触手の腕で受け止められ、赤い光の返し斬り。弾けば居合返し。',why:'受けるのは剣でも鞘でもなく、くらやみの腕。剣の型に、のまれた体が混ざる。',keys:MV.find(x=>x.id==='r_counter').keys});
FWR('f_zanpunish','r_zanpunish',{n:'残心に手を出す',cap:'残心の最中に、こうげき・まもる・かいふく・まほうのどれかを押すと、もう一撃。赤い光。','why':'剣を極めた者の残心は、のまれても消えない。'});

/* 第二形態：いちばん手ごわく。読み方の軸を重ねる */
mv({f:'fallen2',id:'f2_mirror',n:'水面の先読み',bg:'hole',len:130,cap:'水面の映り姿が、本体より先に動く。合図の白い光は、水の中の剣先に出る。見るのは本体ではなく水面。',why:'映り姿は、のまれる前の赤い騎士。剣の型は、映り姿のほうが先に知っている。',
 keys:[K(0,F2I),K(14,R8),K(38,R8),K(42,RCUT,'in'),K(70,RCUT),K(124,F2I)],cues:[{t:14,col:'w',at:J=>[EXX-6,FL+16]}],hits:[42],trails:[[39,44,'w']],
 post:(B,J,t)=>{water(B,t);const M=MV.find(m=>m.id==='f2_mirror'),base=Object.assign({},PDEF,SPEC.red.pose);reflection(B,t,'red',poseAt0(M,Math.min(t+10,129),base),EXX)}});
mv({f:'fallen2',id:'f2_fingers',n:'アーチの奥の指',bg:'hole',len:150,cap:'背中の門のアーチの内側から、三本の指が這い出る。三つ首の竜と同じ指（上の指ははがれた爪、下の指には金の指輪）。指先の目が光った順に、いったん引いてから突き出て、当たる瞬間に指先が裂けて口になる。最後に、本体の銀の剣。4撃。',why:'暗い門のぬしの「門の向こうの指」と同じ手。彼の背中の門も、同じ向こう側につながっている。剣（騎士の名残）と指（向こうの者）が一つの技に混ざる。',
 keys:[K(0,F2I),K(58,F2I),K(64,R8),K(92,R8),K(96,RCUT,'in'),K(118,RCUT),K(152,F2I)],
 cues:[0,1,2].map(i=>({t:14+i*14,col:'w',at:J=>{const c=add(J.sc,[4*J.k,-4*J.k]);return gfTip(14+i*14,add(c,dir(Math.PI*(1.15+i*.35),12*J.k)),i,14+i*14,42+i*14)}})).concat([{t:68,col:'w'}]),hits:[42,56,70,96],trails:[[93,98,'w']],
 fx:(B,J,t)=>{const c=add(J.sc,[4*J.k,-4*J.k]);gfDraw(B,t,[0,1,2].map(i=>add(c,dir(Math.PI*(1.15+i*.35),12*J.k))),[14,28,42],[42,56,70],1)},
 post:(B,J,t)=>{water(B,t);reflection(B,t,'red',J.P||{},EXX)}});
mv({f:'fallen2',id:'f2_silent',n:'光らない核の拍',bg:'hole',len:150,cap:'胸の核が3回、光らずに脈打つ（ドクン・ドクン・ドクン）。音の輪だけが広がる。その次の拍で、銀の剣。',why:'「光らない」と「拍」の二つの読み方を重ねた。どちらも先に教わっているが、同時に来るのはここだけ。',
 keys:[K(0,F2I),K(14,R8),K(52,R8),K(56,RCUT,'in'),K(90,RCUT),K(140,F2I)],hits:[56],trails:[[53,58,'w']],
 pp:(P,t)=>{let c=0;for(const b of[20,32,44]){const d=t-b;if(d>=0&&d<8)c=Math.max(c,(1-d/8)*.8)}P.core=c},
 fx:(B,J,t)=>{for(const b of[20,32,44]){const d=t-b;if(d>=0&&d<14){const c=add(J.sc,[0,5*J.k]);for(let a=0;a<40;a++){const th=a/40*6.28,r=4+d*2;if(a%2)B.set(c[0]+Math.cos(th)*r,c[1]+Math.sin(th)*r,d<7?'#a8a0b0':'#6a6278',4)}}}},
 post:(B,J,t)=>{water(B,t);reflection(B,t,'red',J.P||{},EXX)}});
mv({f:'fallen2',id:'f2_juji',n:'十文字と触手（タタン・タン）',bg:'hole',len:150,cap:'剣を脇に引き、剣先が赤く光る。横一文字から唐竹割り（赤い角ばった軌跡、タタン）。最後に、輪の触手が一本、付け根で止まって白く光ってから来る（タン）。',why:'本気の赤い騎士の十文字に、門の触手が一撃足される。三撃目だけ軽いので、「最後まで赤」と思いこむと崩れる。',
 keys:[K(0,F2I),K(10,Object.assign({},RW,{cr:4})),K(38,Object.assign({},RW,{cr:4.5,x:4})),K(42,{ua:3.0,fa:3.0,sw:3.0,ua2:2.6,fa2:2.8,x:-36,lean:.25,ff:-13,fb:9,cr:4},'in'),K(44,{ua:-2.2,fa:-1.7,sw:-1.3,x:-36,lean:-.05,cr:3}),K(50,{ua:2.8,fa:2.5,sw:2.0,x:-40,lean:.35,ff:-13,fb:9,cr:5},'in'),K(90,{ua:2.8,fa:2.5,sw:2.0,x:-40,lean:.35,ff:-13,fb:9,cr:5}),K(144,F2I)],
 cues:[{t:14,col:'r'},{t:22,col:'r'},{t:36,col:'w',at:J=>add(J.sc,[4*J.k,-22*J.k])}],hits:[42,50,64],trails:[[38,43,'r'],[45,51,'r']],
 fx:(B,J,t)=>{if(t>=52&&t<76){const u=t<58?0:t<64?(t-58)/6:1-(t-64)/12,c=add(J.sc,[4*J.k,-22*J.k]);tentacle(B,c,[lerp(c[0],60,u),c[1]-6],[lerp(c[0],HXX+8,u),lerp(c[1],FL-12,u)],2,.5,true)}},
 post:(B,J,t)=>{water(B,t);reflection(B,t,'red',J.P||{},EXX)}});
RLY('fallen2','f2_rallyx','五合：溜めは弧、詰めは線','hole',['tume','tame','tume','tame','tume'],'金に光ったら打ち合い。五合。溜めは大きな弧、詰めはまっすぐな突き。水面の映り姿も、同じ型で剣を振る。','剣だけは、最後まで赤い騎士のもの。打ち合いの決まりも同じ。',{post:(B,J,t)=>{water(B,t);reflection(B,t,'red',J.P||{},EXX)}});

/* 強さの順を整える（2）：本気と第二形態にも、見抜く・残心の決まりを受けつがせる */
const CL=(f,id,src,extra,kmap)=>{const m=MV.find(x=>x.id===src);const o=Object.assign({},m,{f,id},extra||{});if(kmap)o.keys=m.keys.map(k=>K(k.t,kmap(k.p),k.e));return mv(o)};
CL('red2','r2_zanpunish','r_zanpunish',{n:'残心に手を出す（本気）',cap:'振り抜いたあと、息ひとつ乱さずに長く止まる残心。ここで何かを押すと、もう一撃（赤）。待てば、低い正眼に戻る。',why:'本気になっても、残心は残る。赤い騎士は肩で息をしながら止まっていた。本気は静かに止まる。むしろ、いちばん鋭い。'},p=>p===RI?R2G:Object.assign({},p,{sheath:0}));
const W2=(B,J,t)=>{water(B,t);reflection(B,t,'red',J.P||{},EXX)};
CL('fallen2','f2_seefeint','r_seefeint',{n:'フェイントを見抜かれる',bg:'hole',post:W2,cap:'紫の輪でまもるを押すと、見抜かれる。赤い光、本物の斬り下ろし。水面の映り姿も同じく斬る。'});
CL('fallen2','f2_zanpunish','r_zanpunish',{n:'残心に手を出す',bg:'hole',post:W2,cap:'残心の最中に何かを押すと、もう一撃（赤）。待てば構えを解く。'});
mv({f:'fallen2',id:'f2_dfeint',n:'水面の二重フェイント',bg:'hole',len:150,cap:'紫の輪は、本体ではなく水面の映り姿の目に出る。二回とも押さない。三回目、本体の剣先が赤く光ったら本物。',why:'見る場所（水面）と、押してはいけない（フェイント）の二つを重ねた。映り姿は、もう嘘もつく。',
 keys:[K(0,F2I),K(16,Object.assign({},F2I,{cr:2.6,lean:.06})),K(24,F2I),K(42,Object.assign({},F2I,{cr:2.6,lean:.06})),K(50,F2I),K(70,R8),K(96,R8),K(98,RCUT,'in'),K(124,RCUT),K(146,F2I)],
 cues:[{t:16,col:'p',at:J=>[EXX-6,FL+14]},{t:42,col:'p',at:J=>[EXX-6,FL+14]},{t:70,col:'r'}],hits:[98],hitCol:'r',trails:[[95,100,'r']],post:W2});

/* 強さの順を整える（3）：数でも後の者が上になるように */
const IAIS=(y)=>({ua:3.1,fa:3.0+y*.15,sw:3.14+y*.2,ua2:2.9,fa2:2.85+y*.15,sheath:0,x:-4,lean:.28,cr:5,ff:-12,fb:9});
const KAS={ua:-2.3,fa:-2.85,sw:3.1,ua2:-2.45,fa2:-2.95,x:10,cr:3.6,lean:.06,ff:-12,fb:9,sheath:0},KASb=Object.assign({},KAS,{ua:-2.0,fa:-2.6,ua2:-2.15,fa2:-2.7,lean:-.04,x:13});
mv({f:'red2',id:'r2_three',n:'参段（霞・上中下・タン・タタン）',bg:'red',len:170,cap:'【構え】正眼から両手を額の高さまで上げ、刃を水平に寝かせて切っ先をこちらの目に向ける「霞」の構え。本気の中で、ただ一つ手が高い構え。そこから一歩も動かずに、腕ごと三度振り抜く。一度目は額の高さを横一文字、二度目と三度目は胸の高さから膝の高さへ、ひと続きに斬り下ろす。振るたびに刃が飛ぶ斬撃になり、上・中・下の高さで飛んでくる（タン・タタン）。最後は低く沈んだ残心から、刃を一度鋭く振って血を払う（血振り）。構えは一瞬で取り（少し行き過ぎて戻る）、一振りごとに剣先をいったん頭上へ逃がしてから霞に戻る（来た道をなぞらない）。',why:'弐の居合は「納刀して、すれちがって、後ろから」。参段は「抜き身のまま、霞から、その場で飛ぶ斬撃が三つ」。手の高さ（霞は額、ほかは腰）で、ひと目で見分けられる。一撃で来る溜めは、手が低いまま深く沈む。',
 keys:[K(0,R2G),K(4,Object.assign({},KAS,{ua:-2.05,fa:-2.6,ua2:-2.2,fa2:-2.7,lean:-.08,cr:3.2}),'out'),K(10,KAS,'io'),K(27,KAS),K(28,KASb,'out'),K(30,{ua:-3.0,fa:-3.05,sw:3.0,ua2:-3.1,fa2:-3.1,x:4,lean:.26,cr:4,ff:-13,fb:10,sheath:0},'in'),K(35,{ua:2.8,fa:2.6,sw:2.35,ua2:2.6,fa2:2.5,x:4,lean:.3,cr:4.4,ff:-13,fb:10,sheath:0},'out'),
  K(42,{ua:-1.7,fa:-1.9,sw:-1.75,ua2:-1.85,fa2:-2.0,x:10,lean:-.05,cr:3.4,ff:-12,fb:9,sheath:0},'io'),K(50,KAS,'io'),K(57,KAS),K(58,KASb,'out'),K(60,{ua:3.0,fa:3.05,sw:3.12,ua2:2.85,fa2:2.95,x:2,lean:.3,cr:4.6,ff:-14,fb:10,sheath:0},'in'),K(66,{ua:2.55,fa:2.7,sw:2.75,ua2:2.4,fa2:2.6,x:0,lean:.38,cr:5.6,ff:-15,fb:11,sheath:0},'in'),
  K(72,{ua:2.3,fa:2.45,sw:2.3,ua2:2.15,fa2:2.35,x:0,lean:.36,cr:5.8,ff:-15,fb:11,sheath:0},'out'),K(102,{ua:2.3,fa:2.45,sw:2.3,ua2:2.15,fa2:2.35,x:0,lean:.34,cr:5.8,ff:-15,fb:11,sheath:0}),K(105,{ua:2.55,fa:2.75,sw:2.95,ua2:2.4,fa2:2.65,x:0,lean:.3,cr:5.6,ff:-15,fb:11,sheath:0},'in'),K(108,{ua:2.2,fa:2.35,sw:2.15,ua2:2.05,fa2:2.25,x:0,lean:.32,cr:5.8,ff:-15,fb:11,sheath:0},'out'),K(124,{ua:2.2,fa:2.35,sw:2.15,ua2:2.05,fa2:2.25,x:4,lean:.2,cr:5,ff:-14,fb:10,sheath:0}),K(144,R2G,'io'),K(170,R2G)],
 cues:[{t:14,col:'w'},{t:42,col:'w'},{t:50,col:'w'}],hits:[42,70,78],
 trails:[[29,35,'w',0,'arc'],[59,63,'w',0,'arc'],[63,70,'w',0,'arc']],
 fx:(B,J,t)=>{for(const s of[30,60,66])stomp(B,J,t,s);/* 飛ぶ斬撃：振った瞬間に出て、当たる瞬間にこちらへ届く三日月 */[[30,42,FL-26],[60,70,FL-15],[66,78,FL-5]].forEach(([s,h,y])=>{if(t>=s&&t<h+3){const u=Math.min(1,(t-s)/(h-s)),x=lerp(EXX-6,HXX+6,u);for(let a=-1.2;a<=1.2;a+=.08){const c=Math.cos(a),sn=Math.sin(a);for(let r=0;r<3;r++){const px=x+c*(9-r)-7,py=y+sn*(10-r*.8);B.set(px,py,r===0?'#ffffff':r===1?'#bfe8ff':'#6a7090',4)}}for(let k=1;k<6;k++){if((k+t)%2)continue;B.set(x+k*3,y-3,'#8a90a8',4);B.set(x+k*3+1,y+3,'#8a90a8',4)}}})}});
mv({f:'red2',id:'r2_holdfeint',n:'溜めの中のふり',bg:'red',len:190,cap:'正眼で長く溜める。途中で一度、肩がほんのわずかに沈んで、切っ先に紫の輪（ふり）。押さずに待つと、切っ先が白く光って、引きのない両手突き。',why:'「待つ」と「押さない」を重ねた。じれた心に、ふりが刺さる。押せば見抜かれる。',
 keys:[K(0,R2G),K(20,Object.assign({},R2G,{cr:5.5,lean:.28})),K(48,Object.assign({},R2G,{cr:5.9,lean:.32})),K(54,Object.assign({},R2G,{cr:5.5,lean:.28})),K(121,Object.assign({},R2G,{cr:5.5,lean:.28})),K(122,{ua:3.1,fa:3.12,sw:3.14,ua2:2.85,fa2:2.95,x:-54,lean:.38,ff:-15,fb:11,cr:4.5,sheath:0},'in'),K(150,{ua:3.1,fa:3.12,sw:3.14,ua2:2.85,fa2:2.95,x:-54,lean:.38,ff:-15,fb:11,cr:4.5,sheath:0}),K(170,R2G,'io'),K(190,R2G)],
 cues:[{t:48,col:'p'},{t:94,col:'w'}],hits:[122],trails:[[119,124,'w',0,'line']]});
CL('fallen2','f2_counter','r_counter',{n:'返し斬り',bg:'hole',post:W2,cap:'剣を引いて待つ構えに斬りかかると、アーチの触手が受け止め、赤い光の返し斬り。水面の映り姿も同じく返す。弾けば居合返し。'});
mv({f:'fallen2',id:'f2_silentiai',n:'水の中の無音の居合',bg:'hole',len:140,cap:'光らない。水面の映り姿の鞘から「チャキ」と音の輪が広がる。その音から、いつもの間で、本体が斬る。',why:'「光らない」と「見る場所（水面）」を重ねた。本気の赤い騎士の無音の居合を、映り姿が覚えている。',
 keys:[K(0,F2I),K(14,R8),K(41,R8),K(42,RCUT,'in'),K(80,RCUT),K(134,F2I)],hits:[42],trails:[[39,44,'w',0,'line']],
 fx:(B,J,t)=>{if(t>=14&&t<30){const c=[EXX-4,FL+12];for(let q=0;q<3;q++){const r=3+(t-14)*1.1+q*4;if(r>20)continue;for(let a=-.9;a<=.9;a+=.12){B.set(c[0]-Math.cos(a)*r,c[1]-Math.sin(a)*r*.5,q?'#6a6278':'#a8a0b0',4);B.set(c[0]+Math.cos(a)*r,c[1]-Math.sin(a)*r*.5,q?'#6a6278':'#a8a0b0',4)}}}},post:W2});
CL('fallen','f_silent','r2_silent',{n:'無音の居合',bg:'hole',post:(B,J,t)=>{const f=MV.find(x=>x.id==='r2_silent').fx;water(B,t)},cap:'光らない。腰の鞘から「チャキ」と音。その音から、いつもの間で来る。刃は銀、尾はくらやみ。',why:'本気の赤い騎士の技を、のまれても体が覚えている。'},p=>Object.assign({},p,{sheath:p.sheath}));
CL('fallen2','f2_tsubame','r2_tsubame',{n:'つばめ返し（タン・タン）',bg:'hole',post:W2,cap:'白く光ったら、上からの弧、続けて下からの弧。水面の映り姿も同じ弧を描く。'},p=>Object.assign({},p,{sheath:undefined}));

/* 連撃の合図：ゲームと同じく、一撃ごとに28F前の合図を置く（足りないものを補う） */
(()=>{const fix={g_two:'w',dg_two:'w',l_two:'w',l_rev:'w',l2_tri:'w',r_two:'w',r_swap:'w',r_combo4:'w',f_cutten:'w',f_sa:'w',f2_four:'w'};
 for(const id in fix){const m=MV.find(x=>x.id===id);if(!m)continue;m.cues=(m.cues||[]).slice();for(const h of m.hits||[])if(!m.cues.some(c=>c.col!=='p'&&c.t===h-28))m.cues.push({t:h-28,col:fix[id]});m.cues.sort((a,b)=>a.t-b.t)}})();
/* ---------- くらやみの竜 ---------- */
/* 拍は灯りで見せない。体で見せる：前足の足踏み（のしかかり）、尾で床を打つ（尾）、のど袋がふくらむ（炎）。音はそれに合わせて鳴る */
const DI={cr:0,nx:0,ny:0,hy:0,jaw:0,wing:0};
const lamps=(B,J,t,beats)=>{for(let i=0;i<3;i++){const x=J.sc[0]-8+i*8,y=(J.top!=null?J.top-6:J.sc[1]-40),on=t>=beats[i];B.disc(x,y,2,on?'#ffd080':'#3a2a40',on?'#fff0c0':'#4a3a50','#140a10',4)}};
const thud=(B,t,beats)=>{for(const b of beats)if(t>=b&&t<b+5)for(let x=EXX-30;x<EXX+30;x+=3)B.set(x,FL-((x+t)%2),'#8a8090',4)};
/* 足が床をたたいたときの土ぼこり（体が動いた結果だけ） */const ddust=(B,p,d,w)=>{if(d<0||d>9)return;for(let i=0;i<6;i++){const s=i<3?-1:1,x=p[0]+s*(2+d*(.6+i%3*.3))*(w||1),y=FL-1-(i%3)*d*.25;B.set(x,y,d<5?'#8a8094':'#4e4858',4)}};
const dpool=(B,cx,w,t,c)=>{for(let x=-w;x<=w;x++){const h=Math.max(0,(1-(x*x)/(w*w))*2.4+Math.sin(x*.7+t*.2)*.6);for(let y=0;y<h;y++)B.set(cx+x,FL-y,y<h-1?(c||INK.col):INK.hi,1)}};
mv({f:'dragon',ox:4,id:'d_enter',n:'登場：くらやみから形になる',bg:'lord',len:190,noHero:true,cap:'床のくらやみが泡立ち、下から竜の形に盛り上がる。三つの目が、ばらばらの順に一つずつ開く。最後に背の扇がひらく。',why:'くらやみが、初めて形を持った姿。だから最初は形がない。目がそろって開かないのは、まだ「生き物のまね」が上手くないから。',
 keys:[K(0,Object.assign({},DI,{melt:1,wing:-1.4,cr:6})),K(20,Object.assign({},DI,{melt:1,wing:-1.4,cr:6})),K(108,Object.assign({},DI,{melt:0,wing:-1.4,cr:4}),'io'),K(140,Object.assign({},DI,{wing:-1.4,cr:2})),K(156,Object.assign({},DI,{wing:.4,hy:-4,jaw:.6}),'out'),K(190,DI)],
 pp:(P,t)=>{P.eyes=t<110?0:t<120?1:t<132?2:3},pre:(B,t)=>{if(t<116)dpool(B,EXX+8,Math.round(Math.min(36,6+t*.9)-Math.max(0,t-70)*.6),t)}});
mv({f:'dragon',ox:4,id:'d_idle',n:'立ち絵',bg:'lord',len:160,keys:sway({cr:0,wing:0,hy:0,ny:0},{cr:1,wing:.12,hy:-2,ny:1},160,2),
 cap:'低く這い、肩だけが高い。あごの下の触手が揺れ、背の扇の膜には閉じた目。首の皮膚の下を、ときどき何かが這う。',why:'竜の形をしているが、竜ではない。くらやみが生き物のまねをしている。'});
mv({f:'dragon',ox:4,id:'d_slam',n:'のしかかり（拍）',bg:'lord',len:160,cap:'頭を上げて白く光ると、背の扇の三つの目がいったん閉じる。前足で床を踏み鳴らすたびに（ドン・ドン・ドン）、扇の目が一つずつ開く。三つ全部開いた次の拍で、立ち上がって全身で落ちてくる。',why:'からくり人形のランプと同じ「全部そろったら次の拍」。数える印は体の一部（扇の目）。足踏みの音でも同じ数になる。',
 keys:[K(0,DI),K(14,{ny:-4,hy:-4,wing:.3}),K(18,{fl:1,cr:-1,ny:-5,wing:.3}),K(22,{fl:0,cr:2,ny:-1,wing:.3},'in'),K(27,{fr:1,cr:-1,ny:-5,wing:.35}),K(32,{fr:0,cr:2,ny:-1,wing:.35},'in'),K(37,{fl:1,cr:-1,ny:-6,wing:.4}),K(42,{fl:0,cr:2,ny:-1,wing:.4},'in'),
  K(48,{lift:16,cr:-2,ny:-8,hy:-6,wing:1,jaw:.5},'out'),K(52,{lift:0,cr:6,x:-20,ny:4,hy:3,wing:.3},'in'),K(92,{cr:6,x:-20,ny:4,hy:3}),K(140,DI)],
 cues:[{t:14,col:'w',at:J=>J.head}],hits:[52],pp:(P,t)=>{P.wcount=t<14||t>=70?-1:t<22?0:t<32?1:t<42?2:3},fx:(B,J,t)=>{ddust(B,J.foot,t-22);ddust(B,J.ffoot,t-32);ddust(B,J.foot,t-42);ddust(B,J.foot,t-52,2.4)}});
mv({f:'dragon',ox:4,id:'d_stab',n:'三度の噛みつき',bg:'lord',len:150,cap:'首を縮めて白く光り、低く突っこんで噛む。二度目は口を大きく開け、三度目は口の端がほおまで裂けて、奥の歯の列が見える。光は一撃ごとに、首を縮めて止まった口に出る。',why:'光ってから当たるまでは、いつも同じ。開く口の大きさは怖さを増やすだけで、読み方は変わらない。',
 keys:[K(0,DI),K(14,{nx:-6,ny:-6,hy:-4,jaw:.4}),K(38,{nx:-7,ny:-7,hy:-5,jaw:.6}),K(42,{nx:12,ny:5,hy:3,jaw:.1,x:-10},'in'),K(46,{nx:11,ny:5,hy:3,jaw:.1,x:-10}),K(52,{nx:-4,ny:-3,jaw:.6,x:-6},'out'),K(58,{nx:-5,ny:-5,jaw:.85,x:-6},'out'),K(68,{nx:-5,ny:-5,jaw:.85,x:-6}),K(72,{nx:12,ny:6,hy:3,jaw:.1,x:-12},'in'),K(76,{nx:12,ny:6,hy:3,jaw:.1,x:-12}),K(82,{nx:-4,ny:-4,jaw:.9,x:-6},'out'),K(90,{nx:-6,ny:-6,jaw:1,x:-6,hy:-6},'out'),K(104,{nx:-6,ny:-6,jaw:1,x:-6,hy:-6}),K(108,{nx:13,ny:6,hy:3,jaw:.1,x:-12},'in'),K(114,{nx:13,ny:6,hy:3,jaw:.1,x:-12}),K(134,DI,'io')],
 cues:[{t:14,col:'w',at:J=>J.mouth},{t:44,col:'w',at:J=>J.mouth},{t:80,col:'w',at:J=>J.mouth}],hits:[42,72,108]});
mv({f:'dragon',ox:4,id:'d_tail',n:'尾の薙ぎ払い（拍）',bg:'lord',len:160,cap:'尾を高く上げ、先が白く光る。胴の横にある三つの閉じた筋が、尾で床を打つたびに（バン・バン・バン）後ろから一つずつ目になって開く。三つ全部開いた次の拍で、低く薙ぎ払う。',why:'のしかかりと同じ「目が全部開いたら次の拍」。尾は細くて見えにくいので、数える目は胴に置く。',
 keys:[K(0,DI),K(14,{tailUp:1,cr:1}),K(19,{tailUp:1}),K(23,{tailUp:.3,slap:1,cr:2},'in'),K(27,{tailUp:1,slap:0}),K(32,{tailUp:.3,slap:1,cr:2},'in'),K(36,{tailUp:1.1,slap:0}),K(41,{tailUp:.3,slap:1,cr:2},'in'),K(46,{tailUp:1.2,slap:0,x:6,cr:1,ny:-3}),K(50,{tailUp:0,sweep:1,x:-8,cr:3,ny:2},'in'),K(72,{sweep:1,x:-8,cr:3}),K(104,{sweep:0,x:0,cr:0}),K(150,DI)],
 cues:[{t:14,col:'w',at:J=>J.tail}],hits:[50],pp:(P,t)=>{P.tcount=t<14||t>=68?-1:t<23?0:t<32?1:t<41?2:3},fx:(B,J,t)=>{for(const b of[23,32,41])ddust(B,[J.tail[0],FL],t-b,1.4)}});
mv({f:'dragon',ox:4,id:'d_bitetail',n:'噛みつきから尾',bg:'lord',len:150,cap:'【構え】尾を高く上げたまま首を縮める（三度の噛みつきは尾が下がったまま）。白く光り、噛みつく。噛んだ勢いのまま体をひねり、高く上げた尾の先が白く光る。そのまま尾で低く薙ぎ払う。二回とも、光は一回ずつ。',why:'連撃の途中で「見る場所」が頭から尾へ移る。どちらも先に一つずつ教わった技なので、つなげても読める。竜をほんの少しだけ手ごわくする技。',
 keys:[K(0,DI),K(14,{nx:-6,ny:-6,hy:-4,jaw:.4,tailUp:.7}),K(38,{nx:-7,ny:-7,hy:-5,jaw:.6,tailUp:.8}),K(42,{nx:12,ny:5,hy:3,jaw:.1,x:-10,tailUp:.8},'in'),K(46,{nx:11,ny:5,hy:3,jaw:.1,x:-10,tailUp:.9}),K(52,{nx:-2,ny:-2,x:-4,tailUp:1.25,cr:1},'out'),K(68,{nx:-2,ny:-2,x:-4,tailUp:1.25,cr:1}),K(72,{tailUp:0,sweep:1,x:-8,cr:3,ny:2},'in'),K(92,{sweep:1,x:-8,cr:3}),K(120,{sweep:0,x:0,cr:0}),K(150,DI)],
 cues:[{t:14,col:'w',at:J=>J.mouth},{t:44,col:'w',at:J=>J.tail}],hits:[42,72]});
mv({f:'dragon',ox:4,id:'d_feel',n:'あごの触手',bg:'lord',len:130,cap:'あごの下の触手が逆立ち、先が白く光る。首は動かないまま、触手だけがのびて刺さる。',why:'見る場所が「頭」ではなく「あごの下」になる。竜のふりをした何かであることが、ここで一度だけはっきり見える。',
 keys:[K(0,DI),K(14,{ny:-3,hy:-3,feel:-.4}),K(40,{ny:-3,hy:-3,feel:-.5}),K(42,{ny:1,feel:1,x:-6},'in'),K(62,{ny:1,feel:1,x:-6}),K(84,{feel:0}),K(130,DI)],cues:[{t:14,col:'w',at:J=>J.feelers[1]}],hits:[42]});
mv({f:'dragon',ox:4,id:'d_rage',n:'怒り：皮が裂ける',bg:'lord',len:170,noHero:true,cap:'身を縮め、それから立ち上がって口を裂けるほど開き、全身をふるわせて吠える。古い傷あとの皮が裂け、中から赤い光がのぞく。扇がいっぱいに広がる。',why:'怒ると、攻撃の光にも赤（重い）が混ざりはじめる合図。赤は「中身」の色で、体の色ではない。',
 keys:[K(0,DI),K(22,Object.assign({},DI,{cr:4,ny:4,hy:4,wing:-.4})),K(44,{lift:9,hy:-10,ny:-8,jaw:1,wing:1.1,quiver:.7},'out'),K(110,{lift:9,hy:-10,ny:-8,jaw:1,wing:1.1,quiver:.5}),K(140,{rage:1,wing:.3}),K(170,{rage:1})],pp:(P,t)=>{P.rage=t>=60?1:0}});
mv({f:'dragon',ox:4,id:'d_breath',n:'赤い炎（拍・重い）',bg:'lord',len:170,cap:'怒ったあと。口元が赤く光ると、体の裂け目の赤い光がいったん全部消える。首をしゃくって飲みこむたびに、尾の側の傷から順に一本ずつ赤がたまり、のど袋もふくらむ。三本とも赤くなった次の拍で吐く。重い。',why:'赤がたまっていく先が、のど。三本そろったら次の拍。怒りの赤い炎は重いが、弾けば大きく反撃できる。',
 keys:[K(0,Object.assign({},DI,{rage:1})),K(14,{rage:1,ny:-4,hy:-6,sac:.1}),K(20,{rage:1,ny:-7,hy:-8,sac:.12}),K(23,{rage:1,ny:-2,hy:-3,sac:.4},'in'),K(29,{rage:1,ny:-7,hy:-8,sac:.42}),K(32,{rage:1,ny:-2,hy:-3,sac:.7},'in'),K(38,{rage:1,ny:-7,hy:-8,sac:.72}),K(41,{rage:1,ny:-2,hy:-3,sac:1},'in'),K(46,{rage:1,ny:-9,hy:-10,sac:1,lift:6,wing:.8}),K(50,{rage:1,ny:2,hy:2,jaw:1,sac:.1,lift:0,x:-4,wing:.6},'in'),K(80,{rage:1,ny:2,hy:2,jaw:1,x:-4}),K(150,Object.assign({},DI,{rage:1}))],
 cues:[{t:14,col:'r',at:J=>J.mouth}],hits:[50],hitCol:'r',pp:(P,t)=>{P.ccount=t<14||t>=56?-1:t<23?0:t<32?1:t<41?2:3},fx:(B,J,t)=>{if(t>=48&&t<76){const u=Math.min(1,(t-48)/4),f=t<70?1:(76-t)/6,m=J.mouth;for(let i=0;i<34*u*f;i++){const x=m[0]-i*1.4,y=m[1]+i*.22+Math.sin(i*.9+t*.7)*(1+i*.05);if(x<HXX-8)break;B.disc(x,y,1.2+i*.08,i%4?'#ff5a28':'#ffc040','#fff0a0','#a01a10',4)}}}});
mv({f:'dragon',ox:4,id:'d_dive',n:'影もぐり',bg:'lord',len:150,cap:'竜の体が頭からくずれて、床のくらやみの水たまりになる。水たまりが床をすべって、こちらの足元へ来る。足元の床が白く光る。そこから首が突き上がる。',why:'くらやみそのものだから、形を捨てられる。見る場所が竜から自分の足元へ変わる。',
 keys:[K(0,DI),K(8,Object.assign({},DI,{cr:4,ny:4})),K(30,Object.assign({},DI,{melt:1,cr:6}),'in'),K(104,Object.assign({},DI,{melt:1})),K(134,Object.assign({},DI,{melt:0}),'out'),K(150,DI)],cues:[{t:20,col:'w',at:J=>[HXX+4,FL-2]}],hits:[48],
 pre:(B,t)=>{if(t>=24&&t<110){const u=Math.min(1,(t-24)/16),back=t>78?Math.min(1,(t-78)/24):0,x=lerp(lerp(EXX+8,HXX+4,u),EXX+8,back);dpool(B,Math.round(x),12,t)}},
 fx:(B,J,t)=>{if(t>=44&&t<74){const u=t<48?(t-44)/4:1-(t-48)/26,b=[HXX+6,FL],D=J.D,h=[b[0]-2,b[1]-30*u];dTent(B,[[b[0]+3,b[1]],[b[0]+7,b[1]-15*u],h],5.4,3.4,D.sk,D.rim);
   const R=v=>[h[0]+v[0],h[1]+v[1]],m=new Set();dDisc(m,...R([0,-1]),4);dCurve(m,s=>LP(R([-1,-2]),R([-10,-7]),s),3,1.6,8);dShade(B,m,D.sk,D.rim);const j=new Set();dCurve(j,s=>LP(R([-1,1]),R([-9,3]),s),2.2,1.2,8);dShade(B,j,D.sk,D.rim);
   B.line(...R([-10,-5]),...R([-1,0]),'#2a0612',1);for(let i=0;i<4;i++){B.set(...R([-8+i*2,-4+i*.5]),D.bone[3],1);B.set(...R([-7+i*2,1+i*.4]),D.bone[2],1)}B.set(...R([-4,-4]),D.eye,2);B.set(...R([-3,-4]),D.eye,2);B.set(...R([-1,-5]),D.eye,2);B.set(...R([-1,-3]),D.eye,2);
   for(let i=0;i<3;i++){const s=R([-5+i*2,3]);B.line(s[0],s[1],s[0]+Math.sin(t*.3+i),s[1]+4,D.sk[3],1)}}},
 post:(B,J,t)=>{for(let y=FL+1;y<CH;y++)for(let x=0;x<CW;x++){const i=y*CW+x;if(B.t[i]===1||B.t[i]===3){B.c[i]=((x+y)%5?'#1a1220':'#2a1e30');B.t[i]=6}}}});
mv({f:'dragon',ox:4,id:'d_down',auraK:t=>t<60?1:Math.max(0,1-(t-60)/120),n:'たおれる：亡骸が残る',bg:'lord',len:210,noHero:true,cap:'のけぞって声にならない声で叫ぶ。前足が折れ、一度だけ起き上がろうとして、崩れ落ちる。扇は背にかぶさり、三つの目がばらばらに閉じる。最後に尾の先が一度だけ動く。亡骸の下から、くらやみがしみ出す。',why:'倒れたものは、くらやみに拾われる。この亡骸は消えない。次に「通り道」にされる。',
 keys:[K(0,DI),K(6,{x:2,lift:7,hy:-9,ny:-7,jaw:1,wing:1,quiver:1},'out'),K(34,{x:1,lift:5,hy:-7,ny:-5,jaw:.8,wing:.8,quiver:.4}),K(58,{x:0,dead:.4,jaw:.5,wing:.2,fl:.3},'in'),K(70,{x:0,dead:.3,ny:-4,jaw:.4,quiver:.3}),K(92,{dead:1,wing:-1,jaw:.2},'in'),K(150,{dead:1}),K(156,{dead:1,twitch:1},'out'),K(166,{dead:1,twitch:0}),K(210,{dead:1})],
 pp:(P,t)=>{P.eyes=t<112?3:t<126?2:t<142?1:0},pre:(B,t)=>{if(t>=160)dpool(B,EXX+8,Math.round(Math.min(38,(t-160)*.8)),t)},fx:(B,J,t)=>{ddust(B,[EXX-6,FL],t-92,3);ddust(B,[EXX+20,FL],t-94,2)}});
/* ---------- 三つ首の竜 ---------- */
const HI={rift:1,f0:0,f1:0,f2:0};
mv({f:'hydra',id:'h_enter',n:'登場：亡骸の胸が裂ける',bg:'hole',len:280,noHero:true,
 cap:'倒した竜の亡骸が、しばらく動かない。やがて関節の向きを無視してひきつりはじめ、胸の皮を内側から「指の形」が押し上げる。亡骸の三つの目が、白目のまま一斉に開く。胸が縦に裂け、あばらが外へ折れて飛ぶ。裂け目のふちに、まず白い爪が三つ、内側からかかる。中のものは亡骸の頭を糸で吊るように持ち上げ、落とす。それから三本の指が、関節を一つずつ鳴らしてのびきり、指先が縦に裂けて口になり、目が開く。声は出ない。',
 why:'竜は生き返らない。竜の体が「手袋」のように使われている。亡骸の頭を人形のように持ち上げるのは、中のものにとって、この体が道具でしかないから。指先が「頭になる」瞬間を見せることで、三つ首の正体の手がかりを最初に一度だけ置く。',
 keys:[K(0,{rift:0,emerge:0,heads:0,grip:1,press:0}),K(48,{rift:0,emerge:0,heads:0,grip:1,press:0}),K(84,{rift:0,emerge:0,heads:0,grip:1,press:1}),K(96,{rift:1,emerge:0,heads:0,grip:1,press:0},'out'),K(104,{rift:1,emerge:0,heads:0,grip:1}),K(124,{rift:1,emerge:.34,heads:0,grip:1},'out'),
  K(148,{rift:1,emerge:.34,heads:0,grip:1,puppet:0}),K(154,{rift:1,emerge:.34,heads:0,grip:1,puppet:1},'out'),K(170,{rift:1,emerge:.34,heads:0,grip:1,puppet:1}),K(174,{rift:1,emerge:.34,heads:0,grip:1,puppet:0},'in'),
  K(186,{rift:1,emerge:.55,heads:0,grip:.65},'out'),K(196,{rift:1,emerge:.55,heads:0,grip:.65}),K(206,{rift:1,emerge:.78,heads:0,grip:.3},'out'),K(216,{rift:1,emerge:.78,heads:0,grip:.3}),K(226,{rift:1,emerge:1,heads:0,grip:0},'out'),
  K(234,{rift:1,heads:0,j0:0,j1:0,j2:0}),K(246,{rift:1,heads:1,j0:1,j1:1,j2:1},'out'),K(262,{rift:1,heads:1,j0:1,j1:1,j2:1}),K(280,{rift:1,heads:1})],
 pp:(P,t)=>{const tw=[[34,39],[44,47],[55,61],[66,68],[76,80]];P.quiver=tw.some(([a,b])=>t>=a&&t<b)?(t%2?1.8:-1.8):0;P.ceye=t>=72&&t<236?3:0;P.lit=[0,0,0];if(t>=124&&t<148)P.grip=1+Math.sin(t*.9)*.08},
 fx:(B,J,t)=>{const c=J.rift;if(t>=88&&t<120){const u=t-88;for(let i=0;i<10;i++){const a=-2.8+i*.38,v=1.2+(i%3)*.5,x=c[0]+Math.cos(a)*v*u,y=c[1]+Math.sin(a)*v*u+.05*u*u;if(y<FL)B.set(x,y,i%2?'#ece6da':'#c8c0b4',4)}for(let i=0;i<8;i++){const a=-2.4+i*.5,x=c[0]+Math.cos(a)*u*.8,y=c[1]+Math.sin(a)*u*.6+.08*u*u;if(y<FL)B.set(x,y,i%2?INK.hi:'#7a2a3c',4)}}
  for(const b of[186,206,226])if(t>=b&&t<b+3)for(const f of J.fingers||[])if(f)B.set(f[0],f[1]-3,'#ffffff',4)}});
mv({f:'hydra',id:'h_idle',n:'立ち絵',bg:'hole',len:120,keys:sway({rift:1},{rift:1.05},120,2),
 cap:'動かない竜の亡骸、胸の裂け目、そこから伸びる三本の首。首の節は三つ、角に見えるのは白い爪、真ん中の首がいちばん長い。',why:'見た目は三つ首の竜。でも、よく見ると指の手がかりが並んでいる。気づいた人だけがぞっとする。'});
mv({f:'hydra',id:'h_order',n:'鳴いた数＝攻撃の数（光った首の順）',bg:'hole',len:170,cap:'首の関節がポキッと鳴る（首が一瞬かくっと折れる）たびに、その首が白く光る。鳴った数が、この番の攻撃の数。光った順に噛みつく。',why:'数えて、順番を覚える。鳴き声は声ではなく、指の関節を鳴らす音。数える決まりそのものが、正体の手がかりになっている。',
 keys:[K(0,HI),K(80,HI),K(84,Object.assign({},HI,{f2:1,j2:.8}),'in'),K(88,Object.assign({},HI,{f2:1,j2:.8})),K(96,HI,'io'),K(104,Object.assign({},HI,{f0:1,j0:.8}),'in'),K(108,Object.assign({},HI,{f0:1,j0:.8})),K(116,HI,'io'),K(124,Object.assign({},HI,{f1:1,j1:.8}),'in'),K(132,Object.assign({},HI,{f1:1,j1:.8})),K(150,HI,'io'),K(170,HI)],
 pp:(P,t)=>{P.lit=[t>=40&&t<108?1:0,t>=56&&t<128?1:0,t>=24&&t<88?1:0];for(const[b,i]of[[24,2],[40,0],[56,1]])P['snap'+i]=t>=b&&t<b+6?1:0},
 cues:[{t:56,col:'w',at:J=>J.fingers[2]},{t:76,col:'w',at:J=>J.fingers[0]},{t:96,col:'w',at:J=>J.fingers[1]}],hits:[84,104,124]});
mv({f:'hydra',id:'h_one',n:'三本同時',bg:'hole',len:130,cap:'三本の首が縦一列にそろい、関節を一度だけ同時に鳴らして、三本とも白く光る。三本がまっすぐ平行に突っこむ。高い・まん中・低い、の三か所に同時に当たる一撃が一回。',why:'鳴いた数は一回＝攻撃は一回。三本そろっていても、数えるのは鳴き声。握りしめ（赤・包む）とちがい、三本はまっすぐ平行に来る。',
 keys:[K(0,HI),K(14,Object.assign({},HI,{spread:-.3,j0:.5,j1:.5,j2:.5})),K(38,Object.assign({},HI,{spread:-.35,j0:.7,j1:.7,j2:.7,x:4})),K(42,{rift:1,spread:-.6,f0:1,f1:1,f2:1,j0:.9,j1:.9,j2:.9,tx0:HXX+14,ty0:FL-24,tx1:HXX+16,ty1:FL-14,tx2:HXX+14,ty2:FL-4},'in'),K(66,{rift:1,spread:-.6,f0:1,f1:1,f2:1,tx0:HXX+14,ty0:FL-24,tx1:HXX+16,ty1:FL-14,tx2:HXX+14,ty2:FL-4}),K(110,HI)],pp:(P,t)=>{P.lit=t>=14&&t<50?[1,1,1]:[0,0,0];const s=t>=12&&t<18?1:0;P.snap0=P.snap1=P.snap2=s},
 cues:[{t:14,col:'w',at:J=>J.fingers[1]}],hits:[42]});
mv({f:'hydra',id:'h_grab',n:'握りしめ（重い）',bg:'hole',len:150,cap:'裂け目が大きく開き、三本が手のひらを広げるように大きく開いて、赤く光る。上・前・下の三方向から弧を描いて回りこみ、こちらを包んで、握りつぶす。重い一撃が一回。',why:'三本が一点に閉じる動きは、手が握る動きそのもの。三本同時（白・平行）とちがい、こちらは広がってから包む。戦いの最中に一度だけ見せる、いちばん大きな手がかり。',
 keys:[K(0,HI),K(14,Object.assign({},HI,{rift:1.3,spread:1,j0:.3,j1:.3,j2:.3})),K(38,Object.assign({},HI,{rift:1.35,spread:1.15,j0:.5,j1:.5,j2:.5})),K(42,{rift:1.2,spread:.4,grab:1,f0:1,f1:1,f2:1,j0:.2,j1:.2,j2:.2},'in'),K(52,{rift:1.2,spread:.4,grab:1,f0:1,f1:1,f2:1,curl:.25}),K(76,{rift:1.2,spread:.4,grab:1,f0:1,f1:1,f2:1,curl:.25}),K(120,HI)],
 cues:[{t:14,col:'r',at:J=>J.rift}],hits:[42],hitCol:'r'});
mv({f:'hydra',id:'h_spit',n:'切り口の吐き出し（拍）',bg:'hole',len:150,cap:'首を一本落とすと、残った切り口がふくらんで、目の付いたくらやみのかたまりを高く放り上げる。ヒュ・ヒュ・ヒュと鳴るたびに、竜の亡骸の白目が一つずつ開く。足元に落ちる影がだんだん濃くなり、三つ開いた次の拍で落ちてくる。',why:'切っても、そこが新しい口になる。何拍目かは亡骸の目で、どこに落ちるかは足元の影で読む。投げ物と拍は、小鬼のおかしらで先に教わっている。',
 keys:[K(0,Object.assign({},HI,{stump:0})),K(14,Object.assign({},HI,{stump:.7})),K(20,Object.assign({},HI,{stump:1.3}),'in'),K(23,Object.assign({},HI,{stump:-.2})),K(30,Object.assign({},HI,{stump:0})),K(150,Object.assign({},HI,{stump:0}))],pp:(P,t)=>{P.cut=[1,0,0];P.ceye=t<24||t>=80?0:t<37?1:t<50?2:3},
 cues:[{t:14,col:'w',at:J=>J.fingers[0]||J.rift}],hits:[66],
 fx:(B,J,t)=>{const s=J.fingers[0]||J.rift;if(t>=20&&t<67){const u=(t-20)/46,x=lerp(s[0],HXX+6,u),y=lerp(s[1],FL-10,u)-Math.sin(u*3.14)*44,sh=Math.round(2+u*6);
   for(let xx=-sh;xx<=sh;xx++)if((xx+t)%2||u>.7)B.set(HXX+6+xx,FL,u>.7?'#000000':'#0a0610',6);
   const m=new Set();dDisc(m,x,y,4.2,.15,t*.3);dShade(B,m,['#05020a','#120a1e','#24143a','#3e2666','#6a46a0'],'#c8a2f4');B.set(x-1,y,'#ff3050',2);B.set(x,y,'#ff3050',2);B.set(x-1,y-1,'#2a0612',1);for(let i=0;i<3;i++)B.set(x+2-i*2,y+5+((t+i)%3),INK.hi,4)}}});
mv({f:'hydra',id:'h_down',auraK:t=>t<80?1:Math.max(0,1-(t-80)/140),n:'たおす：握って、引っこむ',bg:'hole',len:240,noHero:true,cap:'最後の一撃で、三本がいっせいに口を開けて広がり、けいれんする。力が抜けて垂れ下がったあと、三本がゆっくり同じ向きに丸まり、手首ごと持ち上がって握りこぶしになる。こぶしが一度だけ震えて、そのまま裂け目の奥へ引きずりこまれる。裂け目が閉じ、竜の亡骸は塵になる。',why:'倒したのではない。引っこめさせただけ。こぶしを掲げて止まる一瞬に、初めて「手だった」と気づける。切った首は切り株のまま、こぶしに混ざる。',
 keys:[K(0,HI),K(6,Object.assign({},HI,{spread:.8,j0:1,j1:1,j2:1,quiver:1}),'out'),K(30,Object.assign({},HI,{spread:.5,j0:.8,j1:.8,j2:.8,quiver:.6})),K(56,Object.assign({},HI,{spread:-.2,curl:.35,j0:.3,j1:.3,j2:.3,quiver:0}),'in'),K(70,Object.assign({},HI,{curl:.35,j0:.2,j1:.2,j2:.2})),
  K(104,Object.assign({},HI,{fist:1,curl:0,quiver:.15}),'io'),K(118,Object.assign({},HI,{fist:1,quiver:.4})),K(128,Object.assign({},HI,{fist:1,quiver:0})),K(160,{rift:1,fist:1,emerge:0},'in'),K(180,{rift:0,fist:1,emerge:0},'in'),K(240,{rift:0,fist:1,emerge:0})],
 pp:(P,t)=>{P.ceye=t<130?3:0;if(t>=6&&t<30)P.spread+=Math.sin(t*1.3)*.25},
 post:(B,J,t)=>{if(t>=180){const u=Math.min(1,(t-180)/50);for(let i=0;i<B.c.length;i++){const x=i%CW,y=i/CW|0;if(B.t[i]!==1&&B.t[i]!==3&&B.t[i]!==2)continue;if(((x*7+y*13)%11)/11<u){B.c[i]=((x+y)%6===0&&u<.9)?'#6a6070':0;B.t[i]=B.c[i]?4:0}}}}});
mv({f:'hydra',id:'h_pool',n:'足元の溜まり（光らない・拍）',bg:'hole',len:160,cap:'裂け目からくらやみが床を這い、こちらの足元に溜まる。光らない。ボコ・ボコと泡が二回はじけた次の拍で、真下から突き上げる。重い。',why:'光らない攻撃と拍は、どちらも先に教わっている（今のゲームの「くらやみの溜まり」）。',
 keys:[K(0,HI),K(160,HI)],hits:[64],hitCol:'r',
 pre:(B,t)=>{const u=Math.min(1,t/20);for(let x=Math.round(lerp(EXX-10,HXX-6,u));x<EXX;x++)B.set(x,FL,INK.hi,6)},
 fx:(B,J,t)=>{for(const b of[28,46])if(t>=b&&t<b+8){for(let q=0;q<2;q++){const r=2+(t-b)*.8+q*2;for(let a=0;a<6.28;a+=.5)B.set(HXX+4+Math.cos(a)*r,FL-2+Math.sin(a)*r*.4,'#a8a0b0',4)}}
  if(t>=60&&t<84){const u=t<64?(t-60)/4:1-(t-64)/20;for(let i=0;i<3;i++){const x=HXX+i*4;B.tube([x,FL],[x+(i-1)*2,FL-10*u],[x+(i-1)*3,FL-24*u],2,.5,INK.col,INK.hi,INK.lo,1)}}}});
mv({f:'hydra',id:'h_fake',n:'鳴いたのに来ない首',bg:'hole',len:170,cap:'三本が順に関節を鳴らす。鳴った首が光る。そのうち一本だけ、光が紫の輪になる。その首は、噛みつく間になっても前に出ず、その場で口を開けて鎌首をもたげるだけ（ふり）。来るのは白く光った首だけ。',why:'「鳴いた数＝攻撃の数」に、フェイントの色のルールを重ねた。数えるのは白い光だけ。フェイントは、うそつきの影で先に教わっている。',
 keys:[K(0,HI),K(80,HI),K(84,Object.assign({},HI,{f2:1,j2:.8}),'in'),K(88,Object.assign({},HI,{f2:1,j2:.8})),K(96,HI,'io'),K(100,Object.assign({},HI,{j0:1,curl:.15}),'out'),K(112,Object.assign({},HI,{j0:1,curl:.15})),K(118,HI,'io'),K(124,Object.assign({},HI,{f1:1,j1:.8}),'in'),K(132,Object.assign({},HI,{f1:1,j1:.8})),K(150,HI,'io'),K(170,HI)],
 pp:(P,t)=>{P.lit=[0,t>=96&&t<128?1:0,t>=56&&t<88?1:0];for(const[b,i]of[[56,2],[76,0],[96,1]])P['snap'+i]=t>=b&&t<b+6?1:0},
 cues:[{t:56,col:'w',at:J=>J.fingers[2]},{t:76,col:'p',at:J=>J.fingers[0]},{t:96,col:'w',at:J=>J.fingers[1]}],hits:[84,124]});
mv({f:'hydra',id:'h_rift',n:'裂け目のふちの触手',bg:'hole',len:130,cap:'裂け目が大きく開き、ふちの肉から太い触手が一本ずるりと出て、とぐろを巻きながら先を白く光らせる。弧を描いて、横からたたきつける。',why:'首だけでなく、裂け目そのものも向こう側の一部。首とちがい、横から弧で来る。',
 keys:[K(0,HI),K(14,Object.assign({},HI,{rift:1.4})),K(60,Object.assign({},HI,{rift:1.4})),K(90,HI)],cues:[{t:14,col:'w',at:J=>J.ttip||J.rift}],hits:[42],
 fx:(B,J,t)=>{if(t<10||t>=80)return;const c=add(J.rift,[-3,6]),F=['#1c0810','#4a1424','#7a2a3c','#a24a5a','#c87a86'];let pts;
  if(t<40){const u=Math.min(1,(t-10)/12),w=Math.sin(t*.25);pts=[c,add(c,[-4*u,8*u]),add(c,[-10*u+w,4*u]),add(c,[-12*u,-6*u]),add(c,[-6*u+w,-12*u])]}
  else{const u=t<42?(t-40)/2:Math.max(0,1-(t-46)/30),h=[HXX+10,FL-12];pts=[c,add(c,[-6,-14*u]),LP(add(c,[-14,-22]),[(c[0]+h[0])/2,FL-34],u),LP(add(c,[-10,-16]),add(h,[6,-10]),u),LP(add(c,[-6,-12]),h,u)]}
  const sm=[];for(let i=0;i+1<pts.length;i++)for(let s=0;s<1;s+=.25)sm.push(LP(pts[i],pts[i+1],s));sm.push(pts[pts.length-1]);dTent(B,sm,3.2,1,F,'#e0a0b0');
  for(let i=2;i<sm.length-1;i+=2){const p=sm[i];B.set(p[0]+1,p[1]+2,'#e8c8d0',1)}J.ttip=sm[sm.length-1]}});
mv({f:'hydra',id:'h_swap',n:'首のすり替え',bg:'hole',len:140,cap:'一本の首だけが白く光る。すぐに三本が交差して、位置を二度三度入れかわる。光った首は、目が白く光ったまま。入れかわりが止まった場所から、光った首だけが噛みつく。',why:'見る場所の読み合い。数でも順番でもなく、「光った首を目で追う」。目を離さなければ、どの高さから来るかがわかる。',
 keys:[K(0,HI),K(14,Object.assign({},HI,{j0:.4})),K(19,Object.assign({},HI,{swap:0})),K(24,Object.assign({},HI,{swap:1})),K(29,Object.assign({},HI,{swap:0})),K(34,Object.assign({},HI,{swap:1}),'out'),K(38,Object.assign({},HI,{swap:1})),K(42,Object.assign({},HI,{swap:1,f0:1,j0:.9}),'in'),K(64,Object.assign({},HI,{swap:1,f0:1})),K(100,Object.assign({},HI,{swap:0})),K(140,HI)],pp:(P,t)=>{P.lit=t>=14&&t<50?[1,0,0]:[0,0,0]},
 cues:[{t:14,col:'w',at:J=>J.fingers[0]}],hits:[42]});
mv({f:'hydra',id:'h_crawl',n:'指歩き（拍）',bg:'hole',len:160,cap:'まん中の首が白く光る。外の二本が床に指先をつき、指で歩くように亡骸ごと這い寄ってくる（トン・トン・トン）。つくたびに亡骸の白目が一つずつ開き、三つ開いた次の拍で、まん中の首が上から突き刺す。',why:'三本の首が「手」として床を歩く。いちばん冒涜的な姿で、拍は吐き出しと同じく亡骸の目で数える。',
 keys:[K(0,HI),K(14,Object.assign({},HI,{j1:.4})),K(19,Object.assign({},HI,{f0:.9,tx0:EXX-34,ty0:FL-1,x:0})),K(23,Object.assign({},HI,{f0:1,tx0:EXX-34,ty0:FL,x:-5}),'in'),K(28,Object.assign({},HI,{f2:.9,tx2:EXX-30,ty2:FL-1,x:-5})),K(32,Object.assign({},HI,{f2:1,tx2:EXX-36,ty2:FL,x:-10}),'in'),K(37,Object.assign({},HI,{f0:.9,tx0:EXX-44,ty0:FL-1,x:-10})),K(41,Object.assign({},HI,{f0:1,tx0:EXX-46,ty0:FL,x:-15}),'in'),
  K(46,Object.assign({},HI,{x:-15,j1:.8,emerge:1})),K(50,Object.assign({},HI,{x:-15,f1:1,j1:.2,tx1:HXX+8,ty1:FL-12}),'in'),K(70,Object.assign({},HI,{x:-15,f1:1,tx1:HXX+8,ty1:FL-12})),K(130,HI)],pp:(P,t)=>{P.ceye=t<23||t>=70?0:t<32?1:t<41?2:3;P.lit=[0,t>=14&&t<56?1:0,0]},
 cues:[{t:14,col:'w',at:J=>J.fingers[1]}],hits:[50],fx:(B,J,t)=>{for(const[b,i]of[[23,0],[32,2],[41,0]])if(t>=b&&t<b+6&&J.fingers[i])ddust(B,[J.fingers[i][0],FL],t-b,1)}});
mv({f:'hydra',id:'h_toy',n:'ひまなとき：亡骸をもてあそぶ',bg:'hole',len:320,cap:'こちらが攻めてこないと、指は竜の亡骸で遊びはじめる。頭をつつき、角に指をかけて持ち上げ、別の指であごを開け閉めして「しゃべらせる」。白目の亡骸がこちらを向いて口をぱくぱくさせ、飽きると、指を離して落とす。最後に胴を指先でトントンとたたく。',why:'この体は、中のものにとって手袋で、おもちゃ。待ち時間にも正体の手がかりを見せ、ぞっとさせる。攻撃ではないので光らない。',
 keys:[K(0,HI),K(40,HI),K(60,Object.assign({},HI,{f1:1,tx1:EXX-36,ty1:FL-14,j1:0})),K(64,Object.assign({},HI,{f1:1,tx1:EXX-35,ty1:FL-10})),K(68,Object.assign({},HI,{f1:1,tx1:EXX-36,ty1:FL-14})),K(72,Object.assign({},HI,{f1:1,tx1:EXX-35,ty1:FL-10})),
  K(90,Object.assign({},HI,{f1:1,tx1:EXX-30,ty1:FL-14,puppet:0})),K(116,Object.assign({},HI,{f1:1,tx1:EXX-24,ty1:FL-32,puppet:1})),
  K(130,Object.assign({},HI,{f1:1,tx1:EXX-24,ty1:FL-32,puppet:1,f0:1,tx0:EXX-40,ty0:FL-22})),K(200,Object.assign({},HI,{f1:1,tx1:EXX-24,ty1:FL-32,puppet:1,f0:1,tx0:EXX-40,ty0:FL-22})),
  K(212,Object.assign({},HI,{f1:.6,tx1:EXX-24,ty1:FL-32,puppet:0,f0:0}),'in'),K(236,HI),K(250,Object.assign({},HI,{f2:.8,tx2:EXX-4,ty2:FL-14})),K(254,Object.assign({},HI,{f2:.9,tx2:EXX-4,ty2:FL-11})),K(258,Object.assign({},HI,{f2:.8,tx2:EXX-4,ty2:FL-14})),K(262,Object.assign({},HI,{f2:.9,tx2:EXX-4,ty2:FL-11})),K(280,HI),K(320,HI)],
 pp:(P,t)=>{P.cjaw=t>=136&&t<200?(Math.sin((t-136)*.45)>0?.9:0):0;P.ceye=t>=120&&t<212?3:0},fx:(B,J,t)=>{if(t>=212&&t<222)ddust(B,[EXX-30,FL],t-212,2)}});
L2R('l2_r_open','l_r_open','打ち合い：誘いのひと振り（金）','鍵を肩にかつぎ、金に光る。背中の触手が三本、鍵の振りに合わせて後ろへしなる。弾けば打ち合いが始まり、画面の上下が締まる。','第一形態と同じ始まり。触手が鍵の振りに引っぱられて動く。');
L2R('l2_r_tame','l_r_tame','打ち合い：溜めの合（長い間・弧）','鍵を頭上へ掲げると、背中の触手が鍵に巻きつき、一緒に持ち上げる。金に光ってから、大きな弧で打ち下ろす。','溜めは弧。触手が鍵を持ち上げる絵で、溜めの重さを見せる。');
L2R('l2_r_tsume','l_r_tsume','打ち合い：詰めの合（短い間・線）','振りかぶらず、鍵の歯で短く突く。触手は動かない。軌跡は一本の線。','詰めは線。触手が止まっているのも「短い」の手がかり。');
L2R('l2_r_feint','l_r_feint','打ち合い：フェイント','鍵の輪が紫の輪に光る。振り下ろしかけて止め、引き戻す。間をおいて、金に光った本物。','紫の輪は「ふり」。暗い門のぬしは、フェイントのあとに触手の合を混ぜることがある。');
L2R('l2_r_lock','l_r_lock','打ち合い：鍔迫り合い','刃と鍵がかみ合ったまま押し合う。背中の触手が両側からのびて、かみ合った刃と鍵をいっしょに締めつける。突き放したあと、最後のひと振りは一拍遅れて来る。','触手まで押し合いに加わり、「最後の前」の圧を強くする。');
mv({f:'lord2',id:'l2_r_arm',n:'打ち合い：触手の合（金）',bg:'lord',len:100,heroP:t=>t>=44&&t<52?Object.assign({},HRP,{ua:.4,fa:-.6,sw:-2.4}):HRG,
 cap:'打ち合いの二合目に、鍵ではなく左腕の触手が来る。触手が後ろへしなって先が金に光り、横から巻きこむように打ってくる。弾くと、触手の先が刃にはじかれて火花が散る。',why:'いまのゲームの暗い門のぬしは、打ち合いの二合目が触手。剣とちがう高さと向きから来るので、打ち合いのリズムに「横」が混ざる。',
 keys:[K(0,Object.assign({},LRI,{ua2:1.0,fa2:1.4})),K(10,Object.assign({},LRI,{ua2:-.4,fa2:-.9}),'out'),K(42,Object.assign({},LRI,{ua2:-.4,fa2:-.9})),K(44,Object.assign({},LRI,{ua2:3.0,fa2:3.1}),'in'),K(60,Object.assign({},LRI,{ua2:3.0,fa2:3.1})),K(90,Object.assign({},LRI,{ua2:1.0,fa2:1.4}))],cues:[{t:16,col:'g',at:J=>J.hdB}],hits:[44],hitCol:'g',
 fx:(B,J,t)=>{if(t>=40&&t<60){const u=t<44?(t-40)/4:t<50?1:1-(t-50)/10;tentacle(B,J.hdB,add(J.hdB,[-6*u,-16*u]),[lerp(J.hdB[0],HXX+16,u),lerp(J.hdB[1],FL-26,u)],2.8*J.k,.9*J.k,true)}clash(B,t-44,HXX+16,FL-26)},post:(B,J,t)=>rbars(B,10)});
mv({f:'lord2',id:'l2_r_heavy',n:'打ち合い：重い合（赤い突き）',bg:'lord',len:110,heroP:t=>t>=40&&t<50?HRP:HRG,
 cap:'打ち合いの途中に一度だけ、鍵を深く引いて止まり、赤く光る。体ごと一突きの重い合。弾けば打ち合いは続く。',why:'いまのゲームの暗い門のぬしは、打ち合いの途中に重い合（赤）が一度混ざる。構えは、ぬしの「赤い突き（一撃）」と同じ「深く引いて止まる」。',
 keys:[K(0,Object.assign({},LRI,{ua2:1.0,fa2:1.4})),K(10,Object.assign({},LDP,{x:RX+12,ua2:.6,fa2:.4}),'out'),K(38,Object.assign({},LDP,{x:RX+12,ua2:.6,fa2:.4})),K(40,Object.assign({},LJAB,{x:RX-14}),'in'),K(56,Object.assign({},LJAB,{x:RX-14})),K(90,Object.assign({},LRI,{ua2:1.0,fa2:1.4}))],
 cues:[{t:12,col:'r'}],hits:[40],hitCol:'r',trails:[[36,42,'r',0,'line']],fx:(B,J,t)=>{clash(B,t-40,CXP[0]-2,CXP[1]+2)},post:(B,J,t)=>rbars(B,10)});
/* ===== 赤の系統の打ち合い（いまのゲームの打ち合いの全場面）=====
   赤い騎士＝騎士の剣の型。本気＝すべての合を居合で：抜いて、斬って、納める。赤い門のぬし＝同じ型にくらやみが割りこむ。第二形態＝水面の映り姿も同じ型で戦う（最後だけ、ずれる）。 */
const rsl=(B,J,t,h,col,a0,a1)=>{const d=t-h;if(d<-1||d>6||!J.tip||!J.hdF)return;const c=J.hdF,R=Math.hypot(J.tip[0]-c[0],J.tip[1]-c[1]),u=Math.min(1,(d+1)/2);for(let w=0;w<4;w++){if(d>2&&w>4-d)continue;arc(B,c[0],c[1],R-w*1.2,a0,lerp(a0,a1,u),col,1)}};
const ichi=(B,t,h,col,y)=>{const d=t-h;if(d<0||d>10)return;const[c1,c2]=FXC[col];for(let x=0;x<CW;x++){if((x+t)%9>=8-d*.7)continue;B.set(x,y,c2,4);if(d<4){B.set(x,y-1,c1,4);B.set(x,y+1,c1,4)}}};
const chin=(B,J,t,h)=>{const d=t-h;if(d<0||d>6||!J.hip)return;const p=add(J.hip,[-5*J.k,3*J.k]);star(B,Math.round(p[0]),Math.round(p[1]),[3,3,2,2,1,1,1][d],'w')};
const rip=(B,x,t,h)=>{const d=t-h;if(d<0||d>14)return;for(let a=0;a<6.28;a+=.25){const r=2+d*1.4;B.set(x+Math.cos(a)*r,FL+1+Math.sin(a)*r*.25,d<7?'#8a7aa8':'#4a3a60',6)}};
const counterFx=(B,t,h,col)=>{const k=t-h;if(k<0||k>20)return;const x1=Math.min(CW,HXX+(CW-HXX)*Math.min(1,k/3)),y=FL-15,f=k<8?1:1-(k-8)/12;for(let x=HXX-6;x<x1;x++){if(f<.5&&(x+t)%3)continue;B.set(x,y-1,'#d88a2a',4);B.set(x,y,'#ffffff',4);B.set(x,y+1,'#fff3b0',4)}};
/* 赤い騎士の型（剣） */
const QX=-14,QRI={ua:2.3,fa:2.2,sw:2.9,ua2:1.8,fa2:2.1,x:QX,cr:2.5,lean:.08},
 QOPEN=Object.assign({},R8,{x:0}),QOPENH=Object.assign({},RCUT,{x:-12}),
 QTAME={ua:-2.7,fa:-2.5,sw:.1,ua2:-2.5,fa2:-2.3,cr:3.5,lean:-.15,x:QX+4},QTAMEH={ua:3.0,fa:2.6,sw:2.1,ua2:2.8,fa2:2.5,x:QX-8,lean:.35,ff:-12,fb:9,cr:4},
 QTSU={ua:1.2,fa:3.0,sw:3.14,ua2:1.0,fa2:2.6,x:QX+4,cr:3},QTSUH=Object.assign({},RTH,{x:QX-10}),
 QF=Object.assign({},R8,{x:QX+2}),QFM={ua:1.0,fa:.6,sw:1.9,ua2:.9,fa2:.6,x:QX-2,lean:.15,cr:3},QCUT=Object.assign({},RCUT,{x:QX-8}),
 QHV={ua:.4,fa:.1,sw:3.14,ua2:.5,fa2:.2,x:QX+8,lean:-.25,cr:5.5},QHVH=Object.assign({},RTH,{x:QX-12,lean:.35}),
 QLK={ua:2.5,fa:1.7,sw:2.65,ua2:2.3,fa2:1.6,x:QX-4,lean:.42,cr:4,ff:-11,fb:9},QLK2={ua:2.3,fa:1.25,sw:2.4,ua2:2.1,fa2:1.2,x:QX-6,lean:.48,cr:4.5,ff:-12,fb:9},QSH={ua:2.8,fa:2.8,sw:2.4,ua2:2.4,fa2:2.4,x:QX+6,lean:-.2,cr:2},
 QLAST={ua:.9,fa:-.7,sw:-.6,ua2:.8,fa2:-.6,x:QX+6,cr:5.5,lean:-.3},QLASTH={ua:-2.5,fa:-2.2,sw:-1.1,ua2:-2.3,fa2:-2.0,x:QX-10,lean:.25,cr:2},
 QPOM={ua:2.7,fa:1.6,sw:-1.3,ua2:2.4,fa2:1.4,x:QX-4,lean:.3,cr:3},QKN={kn:1,lean:.35,ua:2.2,fa:1.3,sw:1.57,ua2:2.0,fa2:1.2,x:QX+6};
const QSTY={red:{f:'red',bg:'red',I:RI,tag:'赤い騎士'},fallen:{f:'fallen',bg:'hole',I:FI,tag:'赤い門のぬし',dark:1},fallen2:{f:'fallen2',bg:'hole',I:F2I,tag:'第二形態',dark:1,refl:1}};
function QR(st,id,n,len,keys,cues,hits,hitCol,heroP,cap,why,fx,extra){const S=QSTY[st];const pp0=extra&&extra.pp;
 const o={f:S.f,id,n,bg:S.bg,len,keys,cues,hits,hitCol,heroP,cap,why,fx:(B,J,t,Sp,M)=>{if(fx)fx(B,J,t);if(S.dark&&extra&&extra.tent)extra.tent(B,J,t)},
  pp:(P,t)=>{if(pp0)pp0(P,t);if(st==='fallen')glitch(P,t)},
  post:(B,J,t)=>{if(S.dark){water(B,t);for(const h of hits.concat(extra&&extra.rips||[]))rip(B,EXX+QX,t,h)}if(S.refl){const P=extra&&extra.reflP?extra.reflP(t,J.P):J.P;reflection(B,t,'red',P||{},EXX)}const bh=extra&&extra.bars?extra.bars(t):10;if(bh>0)rbars(B,bh)}};
 if(extra&&extra.trails)o.trails=extra.trails;return mv(o)}
const T8=(B,J,t,s,e)=>{if(t>=s&&t<e){const u=Math.sin((t-s)/(e-s)*Math.PI);tentacle(B,J.hdB,add(J.hdB,[-8*u,-14*u]),add(J.hdB,[-18*u,-6*u]),1.8,.5,true)}};
function QSET(st){const p=st==='red'?'r':st==='fallen'?'f':'f2',S=QSTY[st],D=S.dark;
 QR(st,p+'_q_open','打ち合い：誘いのひと振り（金）',140,[K(0,S.I),K(14,QOPEN,'out'),K(40,QOPEN),K(42,QOPENH,'in'),K(52,QOPENH),K(64,QRI,'out'),K(140,QRI)],[{t:14,col:'g'}],[42],'g',t=>t>=42&&t<52?HRP:t>=52?HRG:null,
  D?'八相に構えた剣が金に光る。弾けば二人が踏みこみ、画面の上下が締まる。触手が、踏みこみに遅れてついてくる。':'八相（剣を立てて肩の上）に構え、刃が金に光る。まっすぐな袈裟の一振り。弾いた瞬間、二人が同時に一歩踏みこみ、画面の上下が締まる。',
  '始まりの合図は金。騎士の礼のように、最初の一振りはいつも同じ型。',(B,J,t)=>clash(B,t-42,CXP[0],CXP[1]),{bars:t=>t<44?0:Math.min(10,(t-44)*.6),tent:(B,J,t)=>T8(B,J,t,52,70)});
 QR(st,p+'_q_tame','打ち合い：溜めの合（長い間・弧）',120,[K(0,QRI),K(8,QTAME,'out'),K(46,QTAME),K(48,QTAMEH,'in'),K(60,QTAMEH),K(84,QRI),K(120,QRI)],[{t:20,col:'g'}],[48],'g',t=>t>=48&&t<56?HRP:HRG,
  '前の合から間が長い「溜め」の合。剣を頭上から背中へ大きく倒し、切っ先が床を向くほど引きしぼる。金に光ってから、頭上を越える大きな弧で打ち下ろす。'+(D?' 弧のあとを、くらやみの尾が追う。':''),'溜めは弧。間が長いほど、剣の通る道も大きい。',(B,J,t)=>{clash(B,t,CXP[0],CXP[1]);clash(B,t-48,CXP[0],CXP[1]-6)},{trails:[[42,50,'g',0,'arc']]});
 QR(st,p+'_q_tsume','打ち合い：詰めの合（短い間・線）',90,[K(0,QRI),K(4,QTSU,'out'),K(32,QTSU),K(34,QTSUH,'in'),K(44,QTSUH),K(60,QRI),K(90,QRI)],[{t:6,col:'g'}],[34],'g',t=>t>=34&&t<42?HRP:HRG,
  '前の合から間が短い「詰め」の合。剣を引くだけで振りかぶらない。まっすぐ一突き。軌跡は一本の線。','詰めは線。弧か線かで、次の合の間が目でも分かる。',(B,J,t)=>{clash(B,t,CXP[0],CXP[1]);clash(B,t-34,CXP[0]-2,CXP[1]+2)},{trails:[[30,36,'g',0,'line']]});
 QR(st,p+'_q_feint','打ち合い：フェイント',140,[K(0,QRI),K(8,QF,'out'),K(14,QF),K(22,QFM,'in'),K(36,QFM),K(46,QF,'io'),K(76,QF),K(78,QCUT,'in'),K(92,QCUT),K(118,QRI),K(140,QRI)],[{t:12,col:'p'},{t:50,col:'g'}],[78],'g',t=>t>=78&&t<86?HRP:HRG,
  '八相から、切っ先が紫の輪に光る。振り下ろしかけて、刃がこちらの剣に触れる直前でぴたりと止まる。剣先だけを小さく回して構え直し、間をおいて、金に光った本物。'+(D?' 止めた瞬間、触手だけが勝手に前へ出かける。':''),'打ち合いの中でも、紫の輪は「ふり」。止まった刃を見て、押さずに待つ。',(B,J,t)=>{clash(B,t-78,CXP[0],CXP[1]);if(J.tip&&t>=36&&t<46){const a=(t-36)/10*6.28;B.set(J.tip[0]+Math.cos(a)*3,J.tip[1]+Math.sin(a)*3,'#e0c0ff',4)}},{trails:[[74,80,'g',0,'arc']],tent:(B,J,t)=>T8(B,J,t,22,36)});
 QR(st,p+'_q_heavy','打ち合い：重い合（赤い突き）',110,[K(0,QRI),K(10,QHV,'out'),K(38,QHV),K(40,QHVH,'in'),K(56,QHVH),K(90,QRI),K(110,QRI)],[{t:12,col:'r'}],[40],'r',t=>t>=40&&t<50?HRP:HRG,
  '打ち合いの途中に一度だけ、剣を体の後ろまで深く引いて低く沈み、赤く光る。体ごと一突き。弾けば打ち合いは続く。','重い合は赤。構えは「深く引いて止まる」で、門のぬしの赤い突きと同じ決まり。',(B,J,t)=>clash(B,t-40,CXP[0]-2,CXP[1]+2),{trails:[[36,42,'r',0,'line']]});
 QR(st,p+'_q_lock','打ち合い：鍔迫り合い',110,[K(0,QCUT),K(6,QLK,'out'),K(40,QLK2,'io'),K(72,QLK2),K(78,QSH,'out'),K(110,QSH)],[],[],'g',t=>t<4?HRP:t<76?Object.assign({},HRL,{x:HRL.x+Math.sin(t*1.3)*.6}):t<84?Object.assign({},HRG,{x:-2,lean:-.2}):HRG,
  '刃と刃がかみ合う。力では押さず、刃を自分の鍔元へすべらせながら、かみ合う位置を下げていく（火花が刃をつたって鍔へ走る）。いちばん力の入る位置まで下げたところで、手首を返して突き放す。最後のひと振りは、そのあと一拍遅れて来る。'+(D?' 押し合いのあいだ、背の触手がこちらの刃に巻きつこうとする。':''),
  '力ではなく、刃の位置で押す（赤い騎士の押し合いの決まり）。突き放されるまでは、最後の合は来ない。',(B,J,t)=>{clash(B,t,CXP[0],CXP[1]);if(t>=6&&t<74&&t%2===0){const u=Math.min(1,(t-6)/66),x=lerp(CXP[0]-4,CXP[0]+4,u),y=lerp(CXP[1]-6,CXP[1]+3,u);star(B,Math.round(x),Math.round(y),2,'g');B.set(x-2,y+2,'#fff3b0',4)}},{pp:(P,t)=>{if(t>=6&&t<72)P.x+=Math.sin(t*1.3)*.5},tent:(B,J,t)=>T8(B,J,t,14,70)});
}
QSET('red');QSET('fallen');QSET('fallen2');
/* ===== 打ち合いの二大見せ場：最後のひと振り→打ち返し、くずし斬り =====
   最後：弾いた瞬間に白く光って時が止まる→暗転して刃だけが光る（間）→一閃で斬り抜ける（残像）→遅れて大きな三日月と星と破片、画面が揺れる→相手それぞれの「負け方」。
   くずし：はね上げられた瞬間に赤くにじむ→締まりがほどけ、相手が赤い気配をまとってゆっくり構える→重い一撃の赤い三日月と破片、画面が揺れる。 */
const FX_G={ol:'#2a0e06',mid:'#d88a2a',hi:'#fff3b0',core:'#ffffff'},FX_R={ol:'#2a0408',mid:'#c8202c',hi:'#ff9a7a',core:'#fff0e0'};
const fxDark=(B,a)=>{for(let i=0;i<B.c.length;i++){if(B.t[i]===0){B.c[i]=a>.5?'#050308':'#0c0812';B.t[i]=6}else if(B.t[i]===6&&B.c[i])B.c[i]=mix(B.c[i],'#000000',.7*a)}};
const fxFill=(B,col)=>{for(let i=0;i<B.c.length;i++)if(B.t[i]===0||B.t[i]===6){B.c[i]=col;B.t[i]=6}};
const fxShake=(B,dx,dy)=>{const c=B.c.slice(),tg=B.t.slice();for(let y=0;y<CH;y++)for(let x=0;x<CW;x++){const sx=x-dx,sy=y-dy,i=y*CW+x;if(sx<0||sy<0||sx>=CW||sy>=CH){B.c[i]='#000000';B.t[i]=6;continue}const j=sy*CW+sx;B.c[i]=c[j];B.t[i]=tg[j]}};
const fxCres=(B,cx,cy,R,ang,k,P)=>{if(k<0||k>=18)return;const grow=Math.min(1,(k+1)/4),fade=k<9?1:1-(k-9)/9,sweep=2.5*grow,th=(5.4*(k<6?1:Math.max(.4,1-(k-6)/12)))*fade;for(let i=0;i<=46;i++){const s=i/46,a=ang-sweep/2+s*sweep,w=th*Math.sin(Math.PI*s);if(w<.4)continue;for(let r=-w;r<=w;r+=.5){const x=cx+Math.cos(a)*(R+r),y=cy+Math.sin(a)*(R+r)*.55,d=Math.abs(r)/w;B.set(x,y,d<.25?P.core:d<.55?P.hi:d<.85?P.mid:P.ol,4)}}};
const fxStar=(B,cx,cy,k,P)=>{if(k<0||k>=12)return;const L=k<3?14+k*4:Math.max(0,26-(k-3)*2.6),w=k<5?2:1;for(const a of[0,1.5708,.7854,-.7854]){const l=Math.abs(a)%1.57<.1?L:L*.6;for(let s=-l;s<=l;s+=.5){const x=cx+Math.cos(a)*s,y=cy+Math.sin(a)*s,d=Math.abs(s)/l;for(let o=-w+1;o<w;o++)B.set(x+(a===0?0:o),y+(a===0?o:0),d<.3?P.core:d<.7?P.hi:P.mid,4)}}if(k<4)for(let r=0;r<3;r++)for(let a=0;a<6.28;a+=.3)B.set(cx+Math.cos(a)*(4+k*3+r),cy+Math.sin(a)*(4+k*3+r),P.hi,4)};
const fxShards=(B,cx,cy,k,P,seed,n)=>{if(k<0||k>=24)return;for(let i=0;i<(n||16);i++){const h=hsh(i,seed||1),a=-3.14+h*3.6,v=1.4+hsh(seed||1,i)*2.6,x=cx+Math.cos(a)*v*k,y=cy+Math.sin(a)*v*k+.09*k*k;if(y>=FL)continue;const L=k<10?2:1;B.line(x,y,x-Math.cos(a)*L,y-Math.sin(a)*L,i%3?P.hi:P.core,4)}};
const fxLine=(B,t,c0)=>{const k=t-c0;if(k<0||k>30)return;const y=FL-15,x1=Math.min(CW,HXX+(CW-HXX)*Math.min(1,k/3)),th=k<3?3:k<10?2:k<20?1:0;if(k>=24&&(t%2))return;for(let x=HXX-6;x<x1;x++){const tap=Math.min(1,(x-HXX+6)/18,(CW-x)/30)*th;if(tap<=0)continue;for(let o=-Math.ceil(tap);o<=Math.ceil(tap);o++){const d=Math.abs(o)/(tap+.5);B.set(x,y+o,d<.3?'#ffffff':d<.6?'#fff3b0':d<.9?'#d88a2a':'#2a0e06',4)}}};
const fxGhost=(B,t,c0)=>{const k=t-c0;if(k<0||k>12)return;for(let i=1;i<=4;i++){const u=i/5;if(k>i*2+3)continue;const H=new Buf(CW,CH);drawHeroSmall(H,t,false,Object.assign({},HRC,{x:lerp(-8,-104,u)}));for(let j=0;j<H.c.length;j++){if(!H.c[j])continue;const x=j%CW,y=j/CW|0;if((x+y+i)%2)continue;B.set(x,y,mix(H.c[j],'#fff0c0',.5),4)}}};
const fxCrack=(B,cx,cy,k,col)=>{if(k<0||k>14)return;for(let i=0;i<5;i++){let x=cx,y=cy,a=-2.6+i*1.1;for(let s=0;s<Math.min(6,k+2);s++){const nx=x+Math.cos(a)*2.4,ny=y+Math.sin(a)*2.4;B.line(x,y,nx,ny,k<8?col:'#a8a0b0',4);x=nx;y=ny;a+=(hsh(i,s)-.5)*1.4}}};
const heroFin=t=>t<40?HRG:t<48?HRP:t<56?Object.assign({},HRG,{lean:.2,cr:3}):t<98?HRC:t<108?Object.assign({},HRC,{x:lerp(-104,-8,(t-98)/10),ua:2.6,fa:-2.2,sw:-1.65,lean:0}):null;
/* 最後のひと振り：o={f,id,n,bg,I,W,H,R,R2,cap,why,ex(B,J,t) 構えと負け方の演出,post2,pp,ox} */
function FINALE(o){const ec=[EXX+(o.cx||-18),FL-30];return mv({f:o.f,id:o.id,n:o.n,bg:o.bg,len:160,heroP:heroFin,cap:o.cap,why:o.why,
 keys:[K(0,o.I),K(10,o.W,'out'),K(38,o.W),K(40,o.H,'in'),K(86,o.H),K(92,o.R,'out'),K(124,o.R),K(140,o.R2||o.R,'io'),K(160,o.R2||o.R)],
 cues:[{t:12,col:'r',at:o.cueAt}],hits:[40],hitCol:'r',pp:(P,t)=>{if(o.pp)o.pp(P,t);if(t>=12&&t<38)P.x=(P.x||0)+Math.sin(t*2.1)*.35;if(t>=86&&t<92)P.x=(P.x||0)+(t%2?1.5:-1.5)},
 fx:(B,J,t)=>{if(o.ex)o.ex(B,J,t);
  if(t>=40&&t<48){const d=t-40;fxStar(B,CXP[0],CXP[1],d,FX_G);fxShards(B,CXP[0],CXP[1],d,FX_G,7,10)}
  if(t>=46&&t<56){const g=[HXX+12,FL-30];star(B,g[0],g[1],[1,2,3,4,5,4,3,2,1,1][t-46],'w')}
  fxGhost(B,t,56);fxLine(B,t,56);
  fxCres(B,ec[0],ec[1],20,3.3,t-86,FX_G);fxStar(B,ec[0]-2,ec[1],t-86,FX_G);fxShards(B,ec[0],ec[1],t-86,FX_G,3,22)},
 post:(B,J,t)=>{if(o.post2)o.post2(B,J,t);if(t>=44&&t<88)fxDark(B,t<48?(t-44)/4:t<82?1:(88-t)/6);rbars(B,t<100?10:Math.max(0,10-(t-100)*.4));if(t===40||t===41||t===56||t===86)fxFill(B,t===41?'#fff3d0':'#ffffff');if(t>=86&&t<93)fxShake(B,[2,-2,2,-1,1,-1,0][t-86],[1,-1,0,1,-1,0,0][t-86])}})}
/* くずし斬り：o={f,id,n,bg,A(はね上げる前),B(はね上げ),W(構え),H(一撃),Z(あと),cap,why,ex,post2} */
const heroCr=t=>t<4?HRG:t<30?Object.assign({},HRB,{x:Math.min(4,-2+(t-4)*.6)}):t<46?Object.assign({},HRG,{x:2,cr:3,lean:.05}):t<56?Object.assign({},HRP,{x:2}):null;
function CRUSH(o){return mv({f:o.f,id:o.id,n:o.n,bg:o.bg,len:140,heroP:heroCr,cap:o.cap,why:o.why,
 keys:[K(0,o.A),K(4,o.B,'in'),K(12,o.B),K(20,o.W,'out'),K(44,o.W),K(46,o.H,'in'),K(70,o.H),K(110,o.Z),K(140,o.Z)],
 cues:[{t:18,col:'r',at:o.cueAt}],hits:[46],hitCol:'r',pp:(P,t)=>{if(o.pp)o.pp(P,t);if(t>=46&&t<52)P.x=(P.x||0)+(t%2?1.5:-1.5)},
 fx:(B,J,t)=>{if(o.ex)o.ex(B,J,t);fxCrack(B,HXX+14,FL-26,t-4,'#ffffff');if(t>=4&&t<10)star(B,HXX+14,FL-26,[5,4,3,3,2,1][t-4],'r');
  if(t>=20&&t<46&&J.tip){const r=2+((t>>1)%3);for(let a=0;a<6.28;a+=.6)B.set(J.tip[0]+Math.cos(a)*r,J.tip[1]+Math.sin(a)*r,'#ff4040',4);for(let x=EXX-34;x<EXX+6;x+=2)if((x+t)%4<2)B.set(x,FL-1,'#ff4040',4)}
  const c=[HXX+12,FL-20];fxCres(B,c[0]+6,c[1],18,3.5,t-46,FX_R);fxStar(B,c[0],c[1],t-46,FX_R);fxShards(B,c[0],c[1],t-46,FX_R,5,18)},
 post:(B,J,t)=>{if(o.post2)o.post2(B,J,t);if(t>=4&&t<9)for(let i=0;i<B.c.length;i++){if(B.t[i]===0){B.c[i]=t<6?'#3a0810':'#1a0408';B.t[i]=6}}rbars(B,t<8?10:Math.max(0,10-(t-8)*.5));if(t>=20&&t<46)fxDark(B,.35);if(t===46)fxFill(B,'#ffd0c0');if(t===47)fxFill(B,'#3a0810');if(t>=46&&t<53)fxShake(B,[3,-3,2,-2,1,-1,0][t-46],[1,-1,1,0,-1,0,0][t-46])}})}
/* ----- 門のぬし ----- */
const chainWhirl=(B,J,t)=>{if(t>=10&&t<40&&J.hdF){for(let i=0;i<10;i++){const a=t*.5+i*.63,r=10+i*.6;B.set(J.hdF[0]+Math.cos(a)*r,J.hdF[1]+Math.sin(a)*r*.6,i%2?'#d8b050':'#8a6a20',4)}}};
FINALE({f:'lord',id:'l_r_last',n:'打ち合い：最後のひと振り（赤）と打ち返し',bg:'lord',I:LSHOVE,W:LSPIN,H:LLAST,R:LSTAG,R2:Object.assign({},LSTAG,{kn:.8,lean:.2}),cx:-16,
 cap:'突き放したあと、ぬしは鍵を背中まで大きく回し、背中の鎖が鍵のまわりで渦を巻く。両手で握って赤く光り、全身で打ち下ろす。弾いた瞬間、白く光って時が止まり、まわりが暗転して主人公の刃だけが光る。一閃。主人公はぬしの背後まで斬り抜け、残像が尾を引く。一拍遅れて、ぬしの胴に大きな金の三日月と星が咲き、破片が散り、画面が揺れる。ぬしはよろめき、鍵を床に突いて片ひざをつく。',
 why:'打ち合いの全部を弾ききったごほうびが、ゲームでいちばん大きな一撃（打ち返し）。止まる・暗転・一閃・遅れて斬れる、の順は、いまのゲームの打ち返しの演出と同じ時間で作っている。',ex:chainWhirl});
CRUSH({f:'lord',id:'l_r_crush',n:'打ち合い：くずし斬り（赤）',bg:'lord',A:LUPR,B:LDNR,W:LSIDE,H:Object.assign({},LJAB,{sw:2.6,fa:2.4,x:RX-8}),Z:LI,
 cap:'途中の合で弾けないと、鍵がこちらの刃を下からはね上げ、構えがくずれる。画面が赤くにじみ、刃のまわりにひびが走る。打ち合いは終わり、締まりがほどける。ぬしは鍵を横に低く引き、鍵の先で床を削りながら赤い気配をまとってゆっくり構える。重い横薙ぎ。赤い三日月が咲き、画面が揺れる。',
 why:'失敗の罰は、はっきり重く、はっきり怖く。でも合図から当たりまではいつもと同じなので、崩されてもまだ弾ける。弾ければ大きく反撃できる。',
 ex:(B,J,t)=>{if(t>=20&&t<46&&J.tip&&J.tip[1]>FL-8)for(let i=0;i<3;i++)B.set(J.tip[0]+i*2+((t+i)%3),FL-1-(i%2),i%2?'#ffd040':'#ff8040',4)}});
const L2X=p=>Object.assign({},p,{ua2:p.ua2!=null?p.ua2*.6+.6:1.0,fa2:1.4});
const tentLash=(B,J,t,a,b)=>{if(t>=a&&t<b&&J.hdB){const u=Math.sin((t-a)/(b-a)*Math.PI);for(let i=0;i<3;i++)tentacle(B,J.hdB,add(J.hdB,[-6*u-i*3,-10*u-i*4]),add(J.hdB,[-14*u-i*4,-4*u+i*5]),1.6,.5,i===1)}};
FINALE({f:'lord2',id:'l2_r_last',n:'打ち合い：最後のひと振り（赤）と打ち返し',bg:'lord',I:L2X(LSHOVE),W:L2X(LSPIN),H:L2X(LLAST),R:L2X(LSTAG),R2:L2X(Object.assign({},LSTAG,{kn:.8})),cx:-16,
 cap:'鍵を背中まで回し、背中の触手が鍵に巻きついて一緒に振りかぶる。触手ごと赤く光り、全身で打ち下ろす。弾けば時が止まり、暗転、一閃。遅れて金の三日月が咲き、ちぎれた触手が宙を舞って落ちる。',why:'第一形態と同じ見せ場に、触手が加わる。ごほうびの一閃で、触手まで斬れる。',
 ex:(B,J,t)=>{tentLash(B,J,t,10,40);if(t>=86&&t<120&&J.hdB){const k=t-86;for(let i=0;i<2;i++){const x=J.hdB[0]-6+i*10+k*.3*(i?1:-1),y=J.hdB[1]-10+.05*k*k;if(y<FL)tentacle(B,[x,y],[x+3,y+3],[x+1,y+7],1.4,.4,false)}}}});
CRUSH({f:'lord2',id:'l2_r_crush',n:'打ち合い：くずし斬り（赤）',bg:'lord',A:L2X(LUPR),B:L2X(LDNR),W:L2X(LSIDE),H:L2X(Object.assign({},LJAB,{sw:2.6,fa:2.4,x:RX-8})),Z:L2X(LI),
 cap:'はね上げられ、画面が赤くにじむ。ぬしは鍵を横に引き、背中の触手が床をはって左右からこちらを囲む。鍵と触手で同時に横に薙ぐ、重い一撃。',why:'失敗の罰は重く。合図から当たりまではいつもと同じ。',ex:(B,J,t)=>tentLash(B,J,t,20,50)});
/* ----- 赤い騎士・赤い門のぬし・第二形態（騎士の剣の型） ----- */
const kneelR=Object.assign({},QKN),tentCut=(B,J,t)=>{if(t>=86&&t<124&&J.hdB){const k=t-86,x=J.hdB[0]+k*.4,y=J.hdB[1]-8+.06*k*k;if(y<FL)tentacle(B,[x,y],[x+4,y+2],[x+2,y+7],1.6,.4,false)}};
for(const st of['red','fallen','fallen2']){const p=st==='red'?'r':st==='fallen'?'f':'f2',S=QSTY[st],D=S.dark,refl=S.refl;
 const post2=(B,J,t)=>{if(D){water(B,t);for(const h of[40,56,86])rip(B,EXX+QX,t,h)}if(refl)reflection(B,t,'red',t>=86?QLASTH:(J.P||{}),EXX)};
 FINALE({f:S.f,id:p+'_q_last',n:'打ち合い：最後のひと振り（赤）と打ち返し',bg:S.bg,I:QSH,W:QLAST,H:QLASTH,R:Object.assign({},QLASTH,{x:QX-6}),R2:kneelR,cx:-20,pp:st==='fallen'?(P,t)=>glitch(P,t):null,post2,
  cap:'突き放したあと、剣を下段から背中側へ低く引き、切っ先が床すれすれで赤く光る。地をすべるように踏みこみ、下から斜め上へ斬り上げる逆袈裟。弾いた瞬間、白く光って時が止まり、暗転して主人公の刃だけが光る。一閃、斬り抜け、残像。一拍遅れて金の三日月と星、破片。'+(st==='red'?'赤い騎士は振り上げた剣をそのまま止め、ゆっくり片ひざをつく。':st==='fallen'?'赤い門のぬしは片ひざをつき、斬られた触手が宙を舞って水面に落ちる。足元に大きな波紋。':'本体は片ひざをつく。でも水面の映り姿だけは、片ひざをつかず、振り上げた剣の残心のまま立っている。'),
  why:'最後だけ赤。下からの斬り上げで、ぬし（上から）との差を体で覚える。止まる・暗転・一閃・遅れて斬れる、はいまのゲームの打ち返しと同じ時間。',ex:D?tentCut:null});
 CRUSH({f:S.f,id:p+'_q_crush',n:'打ち合い：くずし斬り（赤）',bg:S.bg,A:QF,B:QPOM,W:QF,H:QCUT,Z:S.I,pp:st==='fallen'?(P,t)=>glitch(P,t):null,post2,
  cap:'途中の合で弾けないと、柄頭の鍵の輪で刃を下からはね上げられる。画面が赤くにじみ、刃のまわりにひびが走る。締まりがほどけ、八相に戻した剣が赤い気配をまとう。'+(D?'背の触手が、獲物を見つけたようにざわめく。':'')+'まっすぐな袈裟。赤い三日月が咲き、画面が揺れる。',
  why:'崩しは柄頭、斬るのは刃。剣の扱いそのものが罰になる。合図から当たりまではいつもと同じ。',ex:D?(B,J,t)=>T8(B,J,t,20,46):null})}
/* ===== 本気の赤い騎士：同じ騎士の型。でも剣の頂き =====
   赤い騎士は「力み」、本気は「削ぎ落とし」。どちらも全力で、ちがうのは無駄の量。
   本気は余裕ではない。主人公を心の底から倒しにくる。だから両手で握り、腰を深く落とし、体ごと斬る。
   頂きは「楽に勝てる」ことではなく「全部を一太刀に乗せられる」こと：予備動作がない、止まるところは震えずに止まる、刃の角度まで操る。
   片手になるのは赤（重い合・十文字）だけ。両手では届かない半歩を、左腕を後ろへ振って体を一本の線に伸ばし切って届かせる。 */
QSTY.red2={f:'red2',bg:'red',I:R2G,tag:'本気'};
const Z0={sheath:0},ZP=p=>Object.assign({},p,Z0),ZDEEP=p=>ZP(Object.assign({},p,{cr:(p.cr||2.5)+1.3,ff:(p.ff!=null?p.ff:-6)-3,fb:(p.fb!=null?p.fb:5)+3})),
 ZSAL=ZP({ua:2.0,fa:.3,sw:-1.57,ua2:1.6,fa2:2.0,cr:1,x:0,lean:0,hd:.1}),
 ZRI=ZP({ua:2.45,fa:1.85,sw:2.7,ua2:2.25,fa2:1.75,x:QX-2,cr:4.5,lean:.22,ff:-11,fb:9}),
 ZUP=ZP({ua:-2.95,fa:-2.95,sw:-1.57,ua2:-2.8,fa2:-2.8,cr:4,lean:.1,x:QX+2,ff:-10,fb:9}),
 ZTH=ZP({ua:3.05,fa:3.0,sw:3.14,ua2:2.85,fa2:2.9,x:QX-14,lean:.38,ff:-15,fb:11,cr:4}),
 ZLUNGE=ZP({ua:3.05,fa:3.0,sw:3.14,ua2:.35,fa2:.6,lean:.45,ff:-16,fb:12,cr:4.5,x:QX-16}),
 ZLV=ZP({ua:1.5,fa:2.2,sw:2.55,ua2:1.35,fa2:2.1,x:QX+10,cr:4.5,lean:-.05,ff:-11,fb:9}),
 ZLK=ZDEEP(Object.assign({},QLK,{lean:.48})),ZLK2=ZDEEP(Object.assign({},QLK2,{lean:.55,cr:5})),
 ZKN=ZP(Object.assign({},QKN,{ua:-2.8,fa:-2.4,sw:1.68-6.2832,ua2:-2.95,fa2:-2.5,lean:.25}));
const ghostArc=(B,J,t,h)=>{for(let g=1;g<=3;g++)rsl(B,J,t-g,h,'g',4.4,2.4)};
/* 踏みこみの土ぼこり：体ごと斬った重さを、前足で見せる */
const stomp=(B,J,t,h)=>{const d=t-h;if(d<0||d>8||!J.footF)return;const x0=J.footF[0],y=Math.round(J.footF[1]);for(let i=0;i<5;i++){const s=(i-2)*1.6,x=x0+s*(1+d*.45),yy=y-Math.round(Math.abs(s)*.2+d*.35*(i%2));if(d>5&&(i+t)%2)continue;B.set(x,yy,d<3?'#8a6a6a':'#5a4048',4)}};
QR('red2','r2_q_open','打ち合い：一礼と誘いのひと振り（金）',180,[K(0,R2G),K(6,ZSAL,'out'),K(18,ZSAL),K(32,ZDEEP(QOPEN),'io'),K(70,ZDEEP(QOPEN)),K(72,ZDEEP(QOPENH),'in'),K(82,ZDEEP(QOPENH)),K(94,ZRI,'out'),K(180,ZRI)],[{t:44,col:'g'}],[72],'g',t=>t>=72&&t<82?HRP:t>=82?HRG:null,
 '正眼から、刃を顔の前にまっすぐ立てて一礼する。礼を解くと、刃は立てたまま右肩の上へすべり、同時に腰が深く落ちて八相になる。そこで完全に止まり、間をおいて刃が金に光る。体ごと袈裟の一振り。弾けば踏みこみ、画面が締まる。振り抜いたあと、切っ先をこちらの目に向けた低い構えに収まり、以後はこの構えから打ち合う。','一礼は見下す礼ではなく、倒すべき相手と認めた礼。赤い騎士（立ったまま構える）より腰が低いのは、体ごと斬る覚悟。',(B,J,t)=>{clash(B,t-72,CXP[0],CXP[1]);stomp(B,J,t,72);if(t>=8&&t<18&&J.tip)star(B,J.tip[0],J.tip[1],2,'w')},{bars:t=>t<74?0:Math.min(10,(t-74)*.6)});
QR('red2','r2_q_tame','打ち合い：溜めの合（上段の静止・弧）',120,[K(0,ZRI),K(8,ZUP,'out'),K(46,ZUP),K(48,ZDEEP(QTAMEH),'in'),K(58,ZDEEP(QTAMEH)),K(84,ZRI,'io'),K(120,ZRI)],[{t:20,col:'g'}],[48],'g',t=>t>=48&&t<56?HRP:HRG,
 '両手で剣を頭上に立てた上段。息を深く吸って肩が上がり、そこで止まる。剣先はふるえない（赤い騎士は引きしぼってふるえる）。金に光ってから、吐く息と一緒に腰を落とし、頭上を越える大きな弧。刃のあとに三本の残像。前足が床を打つ。','溜めは弧。本気は力みで震えるかわりに、息で溜める。止まっている時間そのものが溜め。',(B,J,t)=>{clash(B,t,CXP[0],CXP[1]);clash(B,t-48,CXP[0],CXP[1]-6);ghostArc(B,J,t,48);stomp(B,J,t,48)},{trails:[[44,50,'g',0,'arc']],pp:(P,t)=>{if(t>=8&&t<48)P.cr-=.7*Math.min(1,(t-8)/14)}});
QR('red2','r2_q_tsume','打ち合い：詰めの合（予備動作なしの突き）',80,[K(0,ZRI),K(33,ZRI),K(34,ZTH,'snap'),K(44,ZTH),K(60,ZRI,'io'),K(80,ZRI)],[{t:6,col:'g'}],[34],'g',t=>t>=34&&t<42?HRP:HRG,
 '低い構えのまま、まったく動かない。剣先だけが金に光り、次の瞬間には両手突きが届いている。引く動きも、振りかぶりもない。後ろ足で床を蹴った分だけ、体が前へ出ている。軌跡は細く長い一本の線。','詰めは線。本気は予備動作が消える。光だけが頼り＝光ってから当たるまでは同じ、をいちばん純粋に見せる合。',(B,J,t)=>{clash(B,t,CXP[0],CXP[1]);clash(B,t-34,CXP[0]-2,CXP[1]+2);stomp(B,J,t,34);if(t>=34&&t<40&&J.tip)for(let x=Math.round(J.tip[0]);x<EXX+QX;x++)if((x+t)%2)B.set(x,Math.round(J.tip[1]),'#fff3b0',4)});
const ZFM2=ZDEEP(Object.assign({},QFM,{sw:2.4,fa:1.4,fa2:1.3}));
QR('red2','r2_q_feint','打ち合い：フェイント（刃を乗せる）',140,[K(0,ZRI),K(8,ZDEEP(QF),'out'),K(14,ZDEEP(QF)),K(22,ZDEEP(QFM),'in'),K(30,ZFM2),K(38,ZFM2),K(46,ZDEEP(QF),'io'),K(76,ZDEEP(QF)),K(78,ZDEEP(QCUT),'in'),K(92,ZDEEP(QCUT)),K(118,ZRI,'io'),K(140,ZRI)],[{t:12,col:'p'},{t:50,col:'g'}],[78],'g',t=>t>=78&&t<86?HRP:HRG,
 '振り下ろしかけて、刃がこちらの剣に触れた瞬間に止める。手首を返して刃を寝かせ、こちらの剣の上にそっと乗せる。そのまま滑らせて離す。斬る気がなかったのではない。斬れる位置まで来て、斬らなかった。間をおいて、金の本物。','フェイントの紫の輪は同じ。本気は「止める」だけでなく「乗せる」。全力で振った刃を、触れた瞬間に止められる＝剣の頂き。押せば、乗せた刃でそのまま崩される。',(B,J,t)=>{clash(B,t-78,CXP[0],CXP[1]);stomp(B,J,t,78);if(t>=30&&t<38&&J.tip)B.set(J.tip[0],J.tip[1],'#ffffff',4)},{trails:[[74,80,'g',0,'arc']]});
QR('red2','r2_q_heavy','打ち合い：重い合（赤い片手突き）',110,[K(0,ZRI),K(10,ZDEEP(QHV),'out'),K(38,ZDEEP(QHV)),K(40,ZLUNGE,'in'),K(56,ZLUNGE),K(90,ZRI,'io'),K(110,ZRI)],[{t:12,col:'r'}],[40],'r',t=>t>=40&&t<50?HRP:HRG,
 '両手で剣を体の後ろまで深く引き、低く沈んで赤く光る。突く瞬間に左手を柄から離し、左腕を後ろへ振って釣り合いをとり、体を頭から後ろ足まで一本の線に伸ばし切る。両手では届かない半歩を、片手で届かせる。','重い合は赤。構えは「深く引いて止まる」。片手は余裕ではなく、届かせるための捨て身。赤のときだけ片手になる。',(B,J,t)=>{clash(B,t-40,CXP[0]-2,CXP[1]+2);stomp(B,J,t,40)},{trails:[[36,42,'r',0,'line']]});
QR('red2','r2_q_lock','打ち合い：鍔迫り合い（刃の角度で勝つ）',110,[K(0,ZDEEP(QCUT)),K(6,ZLK,'out'),K(22,Object.assign({},ZLK,{x:ZLK.x+3,lean:.42}),'out'),K(60,ZLK2,'io'),K(70,ZLK2),K(74,ZDEEP(Object.assign({},QLK,{sw:1.6,fa:.6,fa2:.5,lean:.3})),'in'),K(80,ZDEEP(QSH),'out'),K(110,ZDEEP(QSH))],[],[],'g',
 t=>t<4?HRP:t<74?Object.assign({},HRL,{x:HRL.x+Math.sin(t*1.3)*.6}):t<80?Object.assign({},HRL,{sw:.4,fa:.6,lean:.1}):t<88?Object.assign({},HRG,{x:-2,lean:-.2}):HRG,
 '刃と刃がかみ合う。最初は彼の前足が半歩すべって押し返される（主人公の力は本物）。二人とも震えている。彼は押し返さず、さらに腰を沈め、体を低く前へ倒しながら、かみ合った刃の角度を少しずつ立てていく。角度が立ちきった瞬間、手首を返して刃を巻き、こちらの剣先を床へ払って突き放す。最後のひと振りは、そのあと一拍遅れて来る。','力では五分。勝つのは刃の角度と手首。押し合いで「技」の差を見せる一枚。突き放されるまで、最後の合は来ない。',
 (B,J,t)=>{clash(B,t,CXP[0],CXP[1]);if(t>=6&&t<70&&t%4===0){star(B,CXP[0]+1,CXP[1]-1,2,'g')}if(t>=8&&t<22&&J.footF&&t%2===0)B.set(J.footF[0]+2+(t-8)*.2,Math.round(J.footF[1]),'#5a4048',4);if(t>=70&&t<78){const a=(t-70)/8*6.28;for(let r=3;r<6;r++)B.set(CXP[0]+Math.cos(a)*r,CXP[1]+Math.sin(a)*r,'#fff3b0',4)}},{pp:(P,t)=>{if(t>=6&&t<72)P.x+=Math.sin(t*1.3)*.5}});
const crossCut=(B,t,h)=>{const d=t-h;if(d<0||d>16)return;const c=[HXX+10,FL-20],L=Math.min(30,(d+1)*12),f=d<8?1:(16-d)/8;for(let s=-L;s<=L;s++){if(f<.6&&(s+t)%2)continue;for(const[dx,dy]of[[1,0],[0,1]]){const x=c[0]+dx*s,y=c[1]+dy*s*.9;B.set(x,y,'#ffffff',4);B.set(x+dy,y+dx,'#ff9a7a',4);B.set(x-dy,y-dx,'#c8202c',4)}}};
FINALE({f:'red2',id:'r2_q_last',n:'打ち合い：最後のひと振り「十文字」（赤）と打ち返し',bg:'red',I:ZDEEP(QSH),W:ZUP,H:ZLUNGE,R:ZKN,R2:ZSAL,cx:-18,
 cap:'突き放したあと、両手の上段でいちど大きく息を吸い、止まる。剣先が赤く光る。左手を離し、体を一本の線に伸ばし切って、縦と横の二本の斬撃が同時に見える、たった一太刀の「十文字」。弾いた瞬間、時が止まり、暗転、主人公の一閃。遅れて金の三日月。彼は剣を床に突き立て、それにすがって片膝をつく。倒れはしない。剣を引き抜いて立ち、刃を顔の前に立てて、最初と同じ一礼をする。',
 why:'最後だけ赤。一太刀なのに二本見える＝剣の頂き。それでも当たりは一回、合図は一回。片膝をつく＝全部を出しきった代償。それでも倒れずに礼で終える＝騎士の誇り。始まりと終わりの一礼で、打ち合いが「決闘」だったと分かる。',ex:(B,J,t)=>{crossCut(B,t,40);stomp(B,J,t,40)}});
CRUSH({f:'red2',id:'r2_q_crush',n:'打ち合い：くずし斬り「巻き落とし」（赤）',bg:'red',A:ZDEEP(QF),B:ZDEEP(Object.assign({},QLK,{sw:2.3,fa:1.3,fa2:1.2,lean:.25})),W:ZLV,H:ZDEEP(Object.assign({},QLASTH,{x:QX-12})),Z:ZRI,
 cap:'途中の合で弾けないと、彼は刃をこちらの剣に絡めて、手首だけでくるりと巻き落とす。こちらの剣先が床を打ち、画面が赤くにじむ。締まりがほどけ、彼は両手の剣を下段に下ろし、低く沈んで赤く光る。床すれすれから斜め上へ、体ごと伸び上がる逆袈裟の一閃。',why:'崩しは「巻き落とし」、斬るのは逆袈裟。赤い騎士（柄頭と袈裟）と同じ罰の場面で、技の格がちがう。合図から当たりまではいつもと同じ。',
 ex:(B,J,t)=>{if(t>=0&&t<10){const a=t/10*6.28;for(let r=3;r<7;r++)B.set(CXP[0]+Math.cos(a)*r,CXP[1]+4+Math.sin(a)*r,'#fff3b0',4)}}});
/* ===== 突きのフェイント（打ち合いの中）：引いて紫の輪、突きかけて、切っ先が鍔の手前で止まる ===== */
const tfe=(f,id,I,W0,Hf0,Hr,bg,cap,why,ex)=>{const W=Object.assign({},W0,{x:(W0.x||0)+12}),Hf={};for(const k in Hr)Hf[k]=typeof Hr[k]==='number'&&typeof W[k]==='number'?lerp(W[k],Hr[k],.3):Hr[k];return mv({f,id,n:'打ち合い：突きのフェイント',bg,len:130,heroP:t=>t>=78&&t<86?HRP:HRG,cap,why,
 keys:[K(0,I),K(6,W,'out'),K(20,W),K(26,Hf,'in'),K(40,Hf),K(48,W,'io'),K(76,W),K(78,Hr,'in'),K(90,Hr),K(112,I),K(130,I)],cues:[{t:12,col:'p'},{t:50,col:'g'}],hits:[78],hitCol:'g',trails:[[74,80,'g',0,'line']],
 fx:(B,J,t)=>{clash(B,t-78,CXP[0]-2,CXP[1]+2);if(t>=26&&t<40&&J.tip&&t%3===0)B.set(J.tip[0]-1,J.tip[1],'#e0c0ff',4);if(ex)ex(B,J,t)},post:(B,J,t)=>{if(bg==='hole'){water(B,t);if(f==='fallen2')reflection(B,t,'red',J.P||{},EXX)}rbars(B,10)}})};
const half=(a,b)=>{const o={};for(const k in b)o[k]=typeof b[k]==='number'&&typeof a[k]==='number'?lerp(a[k],b[k],.55):b[k];return o};
tfe('lord','l_r_tfeint',LRI,LLO,half(LLO,LJAB),LJAB,'lord','鍵を腰に引き、鍵の歯が紫の輪に光る。突きかけて、鍵の先がこちらの鍔の手前、指一本のところでぴたりと止まる。引き戻して、間をおいて金の本物の突き。','突きにもフェイントがある。斬りのフェイント（振り下ろしかけて止まる）と同じく、紫の輪＝押さずに待つ。');
tfe('lord2','l2_r_tfeint',L2X(LRI),L2X(LLO),L2X(half(LLO,LJAB)),L2X(LJAB),'lord','鍵の歯が紫の輪に光り、突きかけて止まる。止めた瞬間、背中の触手だけが前へのびかける。間をおいて金の本物。','突きのフェイント。触手につられて押さない。',(B,J,t)=>tentLash(B,J,t,26,40));
for(const st of['red','fallen','fallen2']){const p=st==='red'?'r':st==='fallen'?'f':'f2',S=QSTY[st];tfe(S.f,p+'_q_tfeint',QRI,QTSU,half(QTSU,QTSUH),QTSUH,S.bg,'剣を引き、切っ先が紫の輪に光る。突きかけて、切っ先がこちらの鍔の手前でぴたりと止まる。'+(S.dark?'止めた瞬間、触手だけが前へ出かける。':'')+'引き戻して、間をおいて金の本物の突き。','突きのフェイント。斬りのフェイントと同じく、紫の輪＝押さずに待つ。',S.dark?(B,J,t)=>T8(B,J,t,26,40):null)}
tfe('red2','r2_q_tfeint',ZRI,ZRI,half(ZRI,ZTH),ZTH,'red','低い構えのまま動かず、切っ先だけが紫の輪に光る。両手突きが走り、切っ先がこちらの鍔に触れる寸前、髪一本の距離で止まる。そのまま切っ先で鍔をコツンと叩いて引く。間をおいて金の本物。','突きのフェイント。本気は全力の突きを「触れる寸前」で止められる。押せば、その距離からそのまま崩される。',(B,J,t)=>{if(t===40&&J.tip)star(B,J.tip[0],J.tip[1],2,'w')});
/* ===== ひまなとき（大ボス）：こちらが攻めてこないと見せる、その者らしい待機。光らない＝攻撃ではない ===== */
const GIB=MV.find(m=>m.id==='g_two').keys[0].p;
const tap=(B,x,y,t,s)=>{const d=t-s;if(d<0||d>6)return;B.set(x-d,y,'#c8c0b4',4);B.set(x+d,y,'#c8c0b4',4);if(d<2)B.set(x,y-1,'#ffffff',4)};
mv({f:'gate',id:'g_bored',n:'ひまなとき：門をふり返る',bg:'gate',len:200,cap:'剣先で床をこつ、こつと二度叩き、肩越しに背後の門をふり返る。門が閉じたままなのを確かめて、ほっとしたように構え直す。',why:'門番の仕事は、倒すことではなく門を守ること。こちらが来ないと、門の方が気になる。光らないので攻撃ではない。',
 keys:[K(0,GIB),K(20,Object.assign({},GIB,{sw:2.2,fa:2.4,cr:1}),'io'),K(34,Object.assign({},GIB,{sw:2.0,fa:2.3,cr:1.2})),K(38,Object.assign({},GIB,{sw:2.2,fa:2.4,cr:1})),K(44,Object.assign({},GIB,{sw:2.0,fa:2.3,cr:1.2})),K(48,Object.assign({},GIB,{sw:2.2,fa:2.4,cr:1})),K(70,Object.assign({},GIB,{hd:-.35,lean:-.12,x:3}),'io'),K(120,Object.assign({},GIB,{hd:-.35,lean:-.12,x:3})),K(128,Object.assign({},GIB,{hd:.05,cr:.6}),'io'),K(150,GIB,'io'),K(200,GIB)],
 fx:(B,J,t)=>{if(J.tip){tap(B,Math.round(J.tip[0]),FL,t,34);tap(B,Math.round(J.tip[0]),FL,t,44)}}});
mv({f:'dragon',ox:4,id:'d_bored',n:'ひまなとき：形がほどける',bg:'lord',len:220,cap:'形を保つのに飽きたように、尾の側から床へ溶けかけ、くらやみの水たまりがじわりと広がる。我に返ったように形に戻ると、あごの触手を逆立てて空気をなめ、こちらのにおいを探す。三つの目が、ばらばらにまばたく。',why:'くらやみは、もともと形を持たない。気をゆるめると、ほどける。光らないので攻撃ではない。',
 keys:[K(0,DI),K(50,Object.assign({},DI,{melt:.32,ny:2,hy:2,cr:1.5}),'io'),K(90,Object.assign({},DI,{melt:.32,ny:2,hy:2,cr:1.5})),K(104,Object.assign({},DI,{melt:0,ny:-2,hy:-2}),'out'),K(130,Object.assign({},DI,{feel:.55,nx:-2,ny:-3,jaw:.25}),'io'),K(170,Object.assign({},DI,{feel:.4,nx:-1,ny:-2,jaw:.15})),K(220,DI,'io')],
 pp:(P,t)=>{if((t>60&&t<66)||(t>150&&t<155))P.eyes=1;else if(t>110&&t<115)P.eyes=2}});
const LDRAG=Object.assign({},LI,{sw:2.0,fa:2.2,cr:1.5});
mv({f:'lord',id:'l_bored',n:'ひまなとき：鍵を引きずる',bg:'lord',len:220,cap:'大きな鍵の先を床に下ろし、半歩さがってから、ゆっくり半歩前へ出る。鍵の先が床をこすって、火花が細く散る（ギィ……）。それを二度くり返して、構え直す。',why:'門を開けるための鍵を、いまは持て余している。前へ出たいのに、門の前から離れられない。光らないので攻撃ではない。',
 keys:[K(0,LI),K(24,LDRAG,'io'),K(50,Object.assign({},LDRAG,{x:7,lean:-.08}),'io'),K(84,Object.assign({},LDRAG,{x:-2,lean:.08}),'io'),K(110,Object.assign({},LDRAG,{x:7,lean:-.08}),'io'),K(144,Object.assign({},LDRAG,{x:-2,lean:.08}),'io'),K(180,LI,'io'),K(220,LI)],
 fx:(B,J,t)=>{if(J.tip&&((t>54&&t<84)||(t>114&&t<144))&&t%3===0){const x=Math.round(J.tip[0]);B.set(x+2,FL,'#ffd27a',4);B.set(x+4,FL-1,'#d88a2a',4)}}});
mv({f:'lord2',id:'l2_bored',n:'ひまなとき：ささやきを聞く',bg:'lord',len:220,cap:'背中の触手の一本が、するすると兜の耳もとへ寄っていく。ぬしは首をかしげ、じっと動かずにささやきを聞いている。ほかの触手は、聞き耳を立てるように止まる。やがて触手が離れ、ぬしはこちらへ向き直る。',why:'暗い門のぬしは、もう一人で考えていない。門の向こうの何かが、ささやいて決めている。光らないので攻撃ではない。',
 keys:[K(0,L2I),K(70,Object.assign({},L2I,{hd:.32,lean:-.06}),'io'),K(150,Object.assign({},L2I,{hd:.36,lean:-.06})),K(176,Object.assign({},L2I,{hd:0}),'io'),K(220,L2I,'io')],
 fx:(B,J,t)=>{if(!J.head||!J.sc)return;const u=t<40?0:t<70?(t-40)/30:t<150?1:t<176?1-(t-150)/26:0;if(u>0){const s=add(J.sc,[5*J.k,-1*J.k]),e=add(J.head,[(5+Math.sin(t*.2))*J.k,(-1+Math.sin(t*.13))*J.k]),tip=LP(add(s,[8*J.k,-6*J.k]),e,u);tentacle(B,s,LP(s,add(s,[12*J.k,-16*J.k]),u),tip,1.6*J.k,.5*J.k,false);B.set(tip[0],tip[1],'#c070ff',2)}
  if(t>=80&&t<150&&(t>>3)%2){const h=J.head;B.set(h[0]+3,h[1]-4,'#8a7aa8',4);B.set(h[0]+5,h[1]-6,'#4e2c70',4)}}});
const RIB=Object.assign({},RI);
mv({f:'red',id:'r_bored',n:'ひまなとき：来いと招く',bg:'red',len:180,cap:'構えたまま、前足で床をドン、ドンと二度踏み鳴らす。切っ先をくいっ、くいっと二度跳ね上げて「来い」と招く。待つのが苦手な、力みの裏返し。',why:'彼は門を守るために、侵略者を倒しに来ている。待っていられない。光らないので攻撃ではない。',
 keys:[K(0,RIB),K(16,Object.assign({},RIB,{ff:-13,cr:2,lift:2}),'out'),K(20,Object.assign({},RIB,{ff:-11,cr:3.2,lift:0}),'in'),K(30,Object.assign({},RIB,{ff:-13,cr:2,lift:2}),'out'),K(34,Object.assign({},RIB,{ff:-11,cr:3.2,lift:0}),'in'),
  K(56,RIB),K(60,Object.assign({},RIB,{sw:3.95,fa:2.75}),'out'),K(66,RIB,'in'),K(74,RIB),K(78,Object.assign({},RIB,{sw:3.95,fa:2.75}),'out'),K(84,RIB,'in'),K(124,RIB,'io'),K(180,RIB)],
 fx:(B,J,t)=>{for(const s of[20,34])if(J.footF){const d=t-s;if(d>=0&&d<6){B.set(J.footF[0]-3-d,FL,'#8a6a6a',4);B.set(J.footF[0]+3+d,FL,'#8a6a6a',4)}}}});
mv({f:'red2',id:'r2_bored',n:'ひまなとき：目を閉じて待つ',bg:'red',len:240,cap:'低い正眼のまま、目の白い光をすっと消す。息だけが深く、ゆっくり続く。切っ先は少しも動かない。しばらくして、目の光がふっと戻る。',why:'焦らない。待つことができるのも、取り戻した冷静さ。目を閉じても構えは解けていない。光らないので攻撃ではない（合図の白い光とは逆に、光が消える）。',
 keys:[K(0,R2G),K(240,R2G)],pp:(P,t)=>{P.eyeOff=t<30?0:t<50?(t-30)/20:t<170?1:t<176?1-(t-170)/6:0;P.cr=(P.cr||0)+(t>=50&&t<170?Math.sin((t-50)*.04)*.35:0)}});
mv({f:'fallen',id:'f_bored',n:'ひまなとき：のまれる前の影',bg:'hole',len:220,cap:'となりに、のまれる前の赤い騎士の影がうっすら現れ、刃を顔の前に立てて一礼しようとする。本体は首をぎくりとそちらへ向け、背の触手が影に巻きつく。影はくらやみに引きずりこまれて消え、本体は何事もなかったように構え直す。',why:'二つの世界線は、まだせめぎ合っている。騎士の誇りは、ときどき顔を出しては、くらやみに引き戻される。光らないので攻撃ではない。',
 keys:[K(0,FI),K(60,FI),K(66,Object.assign({},FI,{hd:-.3,lean:-.1}),'snap'),K(140,Object.assign({},FI,{hd:-.3,lean:-.1})),K(160,FI,'io'),K(220,FI)],pp:(P,t)=>glitch(P,t),
 pre:(B,t)=>{if(t>=20&&t<150){const a=t<40?(t-20)/20:t<110?1:1-(t-110)/40,G=new Buf(CW,CH);knight(G,EXX+16,FL,SPEC.red,{ua:2.0,fa:.3,sw:-1.57,ua2:1.6,fa2:2.0,cr:1,hd:.1,lean:t>110?(t-110)*.01:0},t);for(let i=0;i<G.c.length;i++){const x=i%CW,y=i/CW|0;if(G.c[i]&&(x+y+t)%3<a*2)B.set(x,y,mix(G.c[i],'#1a1428',.4),8)}
  if(t>=96){const k=Math.min(1,(t-96)/14);for(let q=0;q<3;q++)B.tube([EXX+2,FL-34+q*6],[EXX+10,FL-44+q*8],[lerp(EXX+10,EXX+18,k),FL-30+q*9],1.4,.4,'#4e2c70','#9a5ad0','#22142e',1)}}},post:(B,J,t)=>water(B,t)});
mv({f:'fallen2',id:'f2_bored',n:'ひまなとき：映り姿が手を伸ばす',bg:'hole',len:220,cap:'門になった騎士は動かない。足元の水面の映り姿の赤い騎士だけが、ゆっくりと左手を上へ、水面へ向かって伸ばしてくる。指先が水面に触れたところで波紋が広がり、映り姿はもとの構えに戻る。',why:'映り姿は、のまれる前の自分。水面の向こうから、まだ手を伸ばしている。それは救いか、引きずりこもうとしているのか、分からない。光らないので攻撃ではない。',
 keys:[K(0,F2I),K(220,F2I)],
 post:(B,J,t)=>{water(B,t);const u=t<40?0:t<110?(t-40)/70:t<140?1:Math.max(0,1-(t-140)/40);reflection(B,t,'red',Object.assign({},J.P||{},{ua2:lerp(1.2,-1.6,u),fa2:lerp(1.8,-1.7,u),hd:-.2*u}),EXX);if(t>=110&&t<150){const d=t-110;for(let a=0;a<6.28;a+=.25){const r=2+d*.9;B.set(EXX-8+Math.cos(a)*r,FL+1+Math.sin(a)*r*.25,d<20?'#8a7aa8':'#4a3a60',6)}}}});
/* ===== 連撃は「静と動」で組み直す =====
   説明文どおりの向きで振る（打ち下ろし＝頭上から前下へ、すくい上げ＝前下から前上へ、突き＝まっすぐ前）。
   一撃ごとに：当たったポーズで3F止まる（止め）→次の構えへ2〜4Fで素早く移る→構えで止まる（静）→最後の3Fで振る（動）。
   二撃目・三撃目も、構えが一瞬止まって見えるので読める。最後の一撃は振り切ってから粘る。 */
const CB_TWO=new Set(['red','red2','fallen','fallen2']);
const CBP={down:{W:{ua:-1.9,fa:-1.6,sw:-.7,lean:-.15,cr:2.5,dx:4},S:{ua:2.5,fa:2.2,sw:2.65,lean:.32,cr:3.6,ff:-13,fb:9},F:{ua:2.2,fa:1.95,sw:2.4,lean:.36,cr:4,ff:-13,fb:9}},
 up:{W:{ua:1.9,fa:1.4,sw:2.0,lean:.2,cr:4.2,dx:2},S:{ua:-2.75,fa:-2.9,sw:-2.3,lean:.05,cr:2.6,ff:-12,fb:9},F:{ua:-2.2,fa:-2.3,sw:-1.75,lean:-.05,cr:2.2,ff:-12,fb:9}},
 thrust:{W:{ua:1.2,fa:3.0,sw:3.14,lean:-.14,cr:3.2,dx:10},S:{ua:3.1,fa:3.12,sw:3.14,lean:.3,cr:3.6,ff:-14,fb:10},F:{ua:3.1,fa:3.12,sw:3.14,lean:.34,cr:3.8,ff:-14,fb:10}}};
const COMBO=(id,seq,W0)=>{/* W0：最初の構え（予兆まで）を技ごとに変える。数の違う連撃が、同じ構えにならないように */const M=MV.find(m=>m.id===id);if(!M)return;const I=M.keys[0].p,two=CB_TWO.has(M.f),hs=M.hits;const xs=hs.map(h=>{const k=M.keys.find(k=>k.t===h);return k&&k.p.x!=null?k.p.x:-30});
 const mk=(o,x,extra)=>{const p=Object.assign({},o);delete p.dx;p.x=x;if(two){p.ua2=p.ua-.2;p.fa2=p.fa-.1}return Object.assign(p,extra||{})};
 let last=null;const ks=[K(0,I)];const c0=(M.cues&&M.cues[0]?M.cues[0].t:14);
 seq.forEach((T,i)=>{const h=hs[i],x=xs[i];let S,W;
  if(T==='tent'){const base=last||mk(CBP.down.F,x);W=Object.assign({},base,{ua2:-.4,fa2:-.9,lean:(base.lean||0)-.08});S=Object.assign({},base,{ua2:3.0,fa2:3.1,lean:(base.lean||0)+.18,x:(base.x||0)-4})}
  else{const P=CBP[T];W=mk(P.W,(i===0?0:(last&&last.x!=null?last.x:x))+P.W.dx);S=mk(P.S,x)}
  if(i===0&&W0){W=Object.assign({x:0},W0);delete W.via}
  if(i===0){ks.push(K(c0,W,'out'));ks.push(K(h-3,W));if(W0&&W0.via)ks.push(K(h-1,mk(CBP[W0.via].W,x)))/* 脇構えからのすくい上げは、前の低いところを通す（頭上を回らない） */}
  else{const hp=hs[i-1],gap=h-hp;ks.push(K(hp+3,last));const g=Math.max(2,Math.min(4,Math.floor((gap-6)/2)));ks.push(K(Math.min(h-4,hp+3+g),W,'out'));ks.push(K(h-3,W))}
  ks.push(K(h,S,'in'));last=S});
 const T=seq[seq.length-1],hl=hs[hs.length-1],F=T==='tent'?Object.assign({},last,{ua2:last.ua2,fa2:last.fa2}):mk(CBP[T].F,xs[xs.length-1]);
 ks.push(K(hl+3,last));ks.push(K(hl+8,F,'out'));ks.push(K(Math.min(M.len-24,hl+30),F));ks.push(K(M.len-6,I,'io'));
 M.keys=ks.sort((a,b)=>a.t-b.t);M.trails=hs.map((h,i)=>seq[i]==='tent'?null:[h-4,h+2,(M.hitCol==='r'&&i===hs.length-1)||(M.trails||[]).some(r=>r&&r[0]<=h&&r[1]>=h&&r[2]==='r')?'r':'w',0,seq[i]==='thrust'?'line':'arc']).filter(Boolean);M.combo=seq};
/* 連撃の間（2026-11-25）：一撃ごとに合図を置き、予兆の間は止まる長さへ伸ばす。数値はゲームの【連撃の間】（DEF の iv…）にそろえる。
   「タタン」（十文字・解錠のタタ・参段のタタン・十文字と触手のタタン）は二回当たる一回の攻撃として、間は14F（8Fは速すぎた） */
for(const[id,hs,how]of[['g_two',[42,86]],['dg_two',[42,86]],['l_two',[44,88]],['l_rev',[44,88]],['l2_tri',[42,86,132]],['f_sa',[42,86,132]],
 ['r_two',[42,84]],['r_swap',[42,84]],['r_combo4',[40,82,124,174]],['r_three',[42,78,114]],['r2_tsubame',[42,84]],['f2_tsubame',[42,84]],
 ['f_cutten',[42,86]],['f_twin',[42,84]],['f2_four',[40,82,124,174]],['f2_fingers',[42,56,70,114]],['d_stab',[42,80,124]],['d_bitetail',[42,82]],
 ['r2_three',[42,86,100],[57,'s']],['f2_juji',[42,56,100],['s',52]],['r2_juji',[42,56],['s']]])RESPACE(id,hs,how);
/* 合図は、攻撃するものに出す（2026-11-25 作者）：後ろの剣で振る撃は後ろの剣先、触手の撃は触手の腕の先 */
{const on=(id,i,o)=>{const M=MV.find(m=>m.id===id),h=M.hits.slice().sort((a,b)=>a-b)[i],c=M.cues.find(c=>Math.abs(h-(c.t+28))<=3);Object.assign(c,o)};
 on('g_two',1,{w:2});on('dg_two',1,{w:2});on('f_cutten',1,{at:J=>J.hdB});on('l2_tri',2,{at:J=>J.hdB});on('f_sa',2,{at:J=>J.hdB});on('f2_four',2,{at:J=>J.hdB})}

COMBO('l_two',['down','up']);COMBO('l_rev',['up','down']);COMBO('l2_tri',['down','up','tent']);COMBO('f_sa',['down','up','tent']);
COMBO('r_swap',['up','down']);COMBO('r_combo4',['down','up','down','thrust']);COMBO('f2_four',['up','down','tent','down'],Object.assign({via:'up'},RF4));
COMBO('r2_tsubame',['down','up']);COMBO('r_three',['thrust','thrust','thrust']);COMBO('f2_tsubame',['down','up']);
/* ===== 剣は腕で振る（桜井流モーションの見直しを含む） =====
   手首（剣の向き−前腕の向き。画面で時計回りを＋）は、握りこぶしで無理なく取れる範囲 +0.45〜+2.4 に収める。
   ＋側＝親指側へ立てる（剣が前腕より上・後ろへ立つ）は大きく取れる。−側＝手首を下へ折って剣を前腕の線より下げるのはだめ。
   剣先を下げるときは、手首を折らずに、肘を曲げ、腕ごとそこまで振り下ろす（前腕を下げ、上腕も前腕より 0.3 以上下へ）。
   手首を立てすぎたキー（＋2.4 超）は、腕ごと剣の向きへ回す。両手持ちなら左腕も同じだけ動かす。
   例外（意図して剣と前腕を一直線にするもの）：突き（剣も前腕もほぼ真横前）と、居合の一閃（一瞬で描く）。 */
const KNIGHT_F=new Set(['gate','dgate','lord','lord2','red','red2','fallen','fallen2']),WR=a=>{while(a>Math.PI)a-=6.2832;while(a<-Math.PI)a+=6.2832;return a};
const WLO=.45,WHI=2.4;
const wristFix=(f,p)=>{if(!p||typeof p.sw!=='number')return p;const S=Object.assign({},PDEF,(SPEC[f]&&SPEC[f].pose)||{});let ua=p.ua!=null?p.ua:S.ua,fa=p.fa!=null?p.fa:S.fa;
 if(Math.abs(WR(p.sw-Math.PI))<.2&&Math.abs(WR(fa-Math.PI))<.25)return p;/* 突き */if(p.kn>0)return p;/* 剣を床に突き立てて膝をつく */
 const w=WR(p.sw-fa);let dF=0,dU=0;
 if(w<WLO){dF=WR(w-WLO);const nf=fa+dF;const e=WR(nf-ua);if(e<.3)dU=e-.3}
 else if(w>WHI){dF=w-WHI;dU=dF}
 if(!dF&&!dU)return p;const ua2=p.ua2!=null?p.ua2:S.ua2,fa2=p.fa2!=null?p.fa2:S.fa2,two=Math.abs(WR(ua2-ua))<.6&&Math.abs(WR(fa2-fa))<.6;
 /* 腕を下げた結果、剣先が床に深く刺さるなら、刺さらないところまで戻す（床の奥行きのぶん 8 までは許す） */
 const Sp=SPEC[f];for(const s of[1,.75,.5,.25]){const q=Object.assign({},p,{ua:ua+dU*s,fa:fa+dF*s});if(two){q.ua2=ua2+dU*s;q.fa2=fa2+dF*s}
  if(!Sp||!Sp.w)return q;const P=Object.assign({},S,q);let J;try{J=joints(0,FL,Sp,P)}catch(e){return q}const ty=J.hdF[1]+Math.sin(P.sw)*Sp.w.len*Sp.k;if(ty<=FL+8)return q}
 return p};
const NOSWING=/iai|silent|three|reflect|_q_|_r_|rally|thrust|pierce|delay|tsuki|jab|lunge|moon/;
/* 振り切りの剣先は、真下（床に突き立てる向き）まで行かせない。前下がり 2.05 で止める */
const swRot=(p,d,s)=>{const F=Object.assign({},p);for(const[q,a]of[['ua',.45],['fa',.65],['sw',.8],['ua2',.45],['fa2',.65]])if(typeof F[q]==='number')F[q]+=d*a*s;
 if(typeof F.sw==='number'){const w0=WR(p.sw),w1=WR(F.sw);if(w0>=2.05&&w1<2.05&&w1>0){const back=2.05-w1;F.sw+=back;for(const q of['ua','fa','ua2','fa2'])if(typeof F[q]==='number')F[q]+=back*.8}}return F};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
for(const M of MV){if(!KNIGHT_F.has(M.f)||!M.keys)continue;
 M.keys=M.keys.map(k=>k.e==='snap'||k.p===IAI?k:K(k.t,wristFix(M.f,k.p),k.e));
 if(NOSWING.test(M.id)||!M.hits)continue;
 for(const h of M.hits){const i=M.keys.findIndex(k=>k.t===h);if(i<1||i>=M.keys.length-1)continue;const H=M.keys[i],Pv=M.keys[i-1],N=M.keys[i+1];
  if(typeof H.p.sw!=='number'||typeof Pv.p.sw!=='number'||H.e==='snap')continue;const ds=WR(H.p.sw-Pv.p.sw);if(Math.abs(ds)<1.0)continue;
  if(N.t-h<10||!same(N.p,H.p))continue;/* すぐ次の振りへつながる連撃は、次の振りが振り切りを兼ねる */
  const d=Math.sign(ds);
  /* 桜井流(1) 当たりの瞬間は「少し振り抜いた」ポーズで決める（振り抜いていないところで当てると手ごたえに欠ける） */
  const H2=wristFix(M.f,swRot(H.p,d,.3));
  /* 桜井流(2) 振り切り：当たりのあと5Fで、さらに振った向きへ進んで止まり、残る時間いっぱい粘る */
  const F=wristFix(M.f,Object.assign(swRot(H.p,d,1),{lean:(H.p.lean||0)+.06}));
  const holdEnd=M.keys.filter((k,j)=>j>i&&same(k.p,H.p)).map(k=>k.t).pop()||N.t;
  const nk=[];for(let j=0;j<M.keys.length;j++){const k=M.keys[j];if(j===i){nk.push(K(k.t,H2,k.e));nk.push(K(h+5,F,'out'));continue}if(j>i&&same(k.p,H.p))nk.push(K(k.t,F,k.e));else nk.push(k)}
  /* 桜井流(3) 戻りは、来た道をなぞらない：戻りの途中で剣先をいったん上へ逃がしてから構えに収まる */
  const r=nk.findIndex(k=>k.t>holdEnd);if(r>0){const A=nk[r-1],B=nk[r];if(B.t-A.t>=10&&typeof B.p.sw==='number'){const mid=Object.assign({},B.p);mid.sw=(typeof mid.sw==='number'?mid.sw:0)-.7*d;mid.cr=(mid.cr||0)+.6;nk.splice(r,0,K(Math.round(A.t+(B.t-A.t)*.55),wristFix(M.f,mid),'io'))}}
  M.keys=nk.sort((a,b)=>a.t-b.t)}}
/* ===== 桜井流の監査（番人系統：門番・黒い門番・門のぬし・暗い門のぬし・赤い騎士・本気・赤い門のぬし・第二形態）=====
   (a) 中割りでぬるくしない：構えから当たりまで 6F を超える振りは、構えのまま止めて、最後の 4F で一気に振る（構えが長く読める・振りは鋭い）。
       光らない技（ささやき）と、払いそのものを長く見せる技（マントの触手払い）は除く。
   (b) 体ごと：当たりの瞬間に体（前傾・踏みこみ・沈み）がほとんど動かない振りは、前傾+0.12、半歩（4）踏みこませる。
   (c) 禍々しい者（黒い門番・暗い門のぬし・赤い門のぬし・第二形態）：合図の前にくらやみが武器へ吸い寄せられ、当たるとくらやみが裂けて噴き出し、その中で赤い目が一瞬開く。 */
const SK_EX=/rally|_q_|_r_|l2_dark|f_dark|dg_sweep|iai|silent|reflect/;
for(const M of MV){if(!KNIGHT_F.has(M.f)||!M.keys||!M.hits||SK_EX.test(M.id))continue;
 /* (d) 連撃の止め：途中の一撃のあと、当たったポーズで3F止まってから次へ（静と動）。V字の二連撃（勢いで止まれない技）と、組み直した連撃は除く */
 if(!M.combo&&M.id!=='r_two'&&M.hits.length>1)for(const h of M.hits.slice(0,-1)){const i=M.keys.findIndex(k=>k.t===h);if(i<0||i>=M.keys.length-1)continue;const H=M.keys[i],N=M.keys[i+1];if(N.t>h+4&&!same(N.p,H.p))M.keys.splice(i+1,0,K(h+3,H.p,'io'))}
 for(const h of M.hits){let hi=M.keys.findIndex(k=>k.t===h);if(hi<1)continue;const H=M.keys[hi],Pv=M.keys[hi-1];if(H.e==='snap')continue;
  if(h-Pv.t>6&&!same(Pv.p,H.p)){M.keys.splice(hi,0,K(h-4,Pv.p,'io'));hi++;M.keys[hi]=K(h,H.p,'in')}
  const S=Object.assign({},PDEF,(SPEC[M.f]||{}).pose||{}),A=Object.assign({},S,M.keys[hi-1].p),B=Object.assign({},S,H.p);
  const body=Math.abs((B.lean||0)-(A.lean||0))+Math.abs((B.x||0)-(A.x||0))/20+Math.abs((B.cr||0)-(A.cr||0))/5;
  if(body<.12){const old=H.p,np=Object.assign({},old,{lean:(old.lean!=null?old.lean:S.lean||0)+.12,x:(old.x!=null?old.x:0)-4});M.keys=M.keys.map(k=>k.t>=h&&k.p===old?K(k.t,np,k.e):k)}}}
const DARK_F=new Set(['dgate','lord2','fallen','fallen2']);
const darkGather=(B,J,t,c)=>{const d=c-t;if(d<=0||d>14)return;const tg=J.tip||J.hdF||J.sc;if(!tg)return;for(let q=0;q<12;q++){const a=q*.52+c*.7,r=3+d*1.8+hsh(q,c)*3,x=tg[0]+Math.cos(a)*r,y=tg[1]+Math.sin(a)*r*.8;/* 吸い寄せられる黒いすじ：芯は黒、ふちは紫 */const x2=x-Math.cos(a)*3,y2=y-Math.sin(a)*2.4;B.line(x,y,x2,y2,INK.lo,4);B.set(x,y,q%3?INK.eye:INK.hi,4)}};
const darkBurst=(B,t,h,seed)=>{const d=t-h;if(d<0||d>18)return;const c=[HXX+5,FL-12];for(let q=0;q<7;q++){const a=-3.0+q*.55+hsh(q,seed)*.3,L=Math.min(1,(d+1)/3)*(12+hsh(seed,q)*10)*(d<11?1:1-(d-11)/7),bend=Math.sin(d*.4+q)*.6;let p=c;for(let s=0;s<L;s+=1){const aa=a+bend*s/L,np=[p[0]+Math.cos(aa),p[1]+Math.sin(aa)*.85],th=s<L*.5?2:1;for(let o=0;o<th;o++)B.set(np[0],np[1]+o,INK.lo,4);B.set(np[0],np[1]-1,INK.hi,4);if(s>L-2)B.set(np[0],np[1],INK.eye,4);p=np}}
 if(d>=3&&d<11){/* くらやみの裂け目の中で、赤い目が一瞬開く */const e=[c[0]+5+(seed%3),c[1]-8-(seed%4)];for(let xx=-1;xx<=3;xx++){B.set(e[0]+xx,e[1],INK.lo,4);B.set(e[0]+xx,e[1]-1,INK.lo,4);B.set(e[0]+xx,e[1]+1,INK.lo,4)}B.set(e[0]+1,e[1],INK.eye2,4);B.set(e[0]+2,e[1],'#ff9aa8',4)}};
for(const M of MV){if(!DARK_F.has(M.f)||!M.hits||/rally|_q_|_r_/.test(M.id))continue;const fx0=M.fx;M.fx=(B,J,t,S,Mm)=>{if(fx0)fx0(B,J,t,S,Mm);for(const c of(M.cues||[]))if(!c.at)darkGather(B,J,t,c.t);M.hits.forEach((h,i)=>darkBurst(B,t,h,i*7+h))}}
/* 赤い騎士と本気の角度は、いつも近い回り道で補間する。角度の差が半周をこえると、腕や剣が体の後ろを大回りして、
   振ってもいない「ひと振り」が一瞬見えてしまう（構えを移すだけの場面で、剣を振ったように見えた）。 */
for(const M of MV)if(KNIGHT_F.has(M.f)){M.keys=M.keys.map(k=>Object.assign({},k,{p:Object.assign({},k.p)}));for(let i=1;i<M.keys.length;i++){const a=M.keys[i-1].p,b=M.keys[i].p;for(const q of['ua','fa','sw','ua2','fa2']){const A=a[q]!=null?a[q]:PDEF[q];if(typeof b[q]!=='number'||typeof A!=='number')continue;while(b[q]-A>Math.PI)b[q]-=6.2832;while(b[q]-A<-Math.PI)b[q]+=6.2832}}}
/* 赤い騎士の力みと、本気の静けさ（すべての技にかける）
   赤い騎士：肩で速く息をし（約35Fで一往復）、ときどき柄をぎゅっと握り直す（そのたびに肩が上がり、切っ先がわずかに沈む）。振ったあとは勢いあまって体が前へ泳ぐ。侵略者を倒さねばという力み（怯えではなく、攻め気）。
   本気：ゆっくり深く息をし（約84Fで一往復）、握り直さず、振っても体は泳がない。斬るときは吐く息と一緒に腰が沈む。冷静に、でも全力。 */
const SQZ={r_delay:[22,34,46,58]};/* 柄を握り直す瞬間（技ごと。なければ72Fおき） */
for(const M of MV){if(M.f==='red'){const p0=M.pp,hs=M.hits||[],sq=SQZ[M.id];M.pp=(P,t)=>{if(p0)p0(P,t);if(M.id==='r_rage'&&t>=78)return;P.cr=(P.cr||0)+Math.sin(t*.18)*.35;
  const near=hs.some(h=>t>h-14&&t<h+18);const ph=sq?Math.max(0,...sq.map(s=>t>=s&&t<s+10?Math.sin(Math.PI*(t-s)/10):0)):(t%72<10?Math.sin(Math.PI*(t%72)/10):0);if(!near&&ph>0){P.cr+=.5*ph;if(P.sw!=null)P.sw-=.07*ph;P.lean=(P.lean||0)+.04*ph}
  for(const h of hs){const d=t-h;if(d>=0&&d<16){const u=1-d/16;P.lean=(P.lean||0)+.14*u*u;P.ff=(P.ff!=null?P.ff:-10)-2*u}}}}
 else if(M.f==='red2'&&M.id!=='r2_last'){const p0=M.pp,hs=M.hits||[];M.pp=(P,t)=>{if(p0)p0(P,t);P.cr=(P.cr||0)+Math.sin(t*.075)*.3;for(const h of hs){const d=t-h;if(d>=0&&d<12)P.cr+=1.0*(1-d/12)}}}}
/* 拍の攻撃は、合図から当たりまでが拍のぶん長い（ゲームと同じ）。のしかかり38F、尾と炎36F */
for(const id of ['d_slam','d_tail','d_breath','h_spit','h_crawl'])MV.find(m=>m.id===id).beat=true;
