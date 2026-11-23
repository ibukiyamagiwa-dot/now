/* ===== 全モーション =====
   f:だれ  n:名前  cap:読み方（プレイヤーは何を見ればいいか）  why:この動きにした理由
   cues:合図の光（t:フレーム col:w白 r赤 p紫 g金）  hits:当たる瞬間  trails:剣の軌跡 */
const K=(t,p,e)=>({t,p,e});
const MV=[];const mv=o=>{MV.push(o);return o};
const sway=(a,b,len,n)=>{const ks=[];for(let i=0;i<=n;i++)ks.push(K(Math.round(len*i/n),i%2?b:a));return ks};
/* 共通の姿勢 */
const X={ua:1.75,fa:-.5,sw:-2.25,ua2:1.4,fa2:-2.5,sw2:-.85};
const KNEEL={kn:1,lean:.35,ua:1.5,fa:1.7,sw:1.45,ua2:1.6,fa2:2.0,hd:.3};

/* ---------- 門番 ---------- */
mv({f:'gate',id:'g_idle',n:'立ち絵：交差の構え',bg:'gate',len:80,keys:sway({cr:0},{cr:1},80,2),
 cap:'剣を交差させて立つ。ここは通さない、という姿。',why:'交差した二本の剣は「通行止め」の印。門番の仕事が一目でわかる。'});
mv({f:'gate',id:'g_two',n:'二連撃',bg:'gate',len:100,cap:'白く光ったら、ふつうの二連撃。左右の剣が一本ずつ来る。',why:'交差をほどく動き＝構えが解ける瞬間が攻撃の始まり。二本の剣が順に来るので「二回」が見える。',
 keys:[K(0,X),K(14,{ua:-2.4,fa:-1.6,sw:-1.2,ua2:1.0,fa2:.6,sw2:.2,x:4,cr:2}),K(28,{ua:-2.4,fa:-1.6,sw:-1.2,ua2:1.0,fa2:.6,sw2:.2,x:4,cr:2}),K(42,{ua:2.8,fa:2.6,sw:2.2,x:-40,lean:.3},'in'),K(50,{ua:2.8,fa:2.6,sw:2.2,ua2:-2.2,fa2:-2.0,sw2:-1.4,x:-40,lean:.2}),K(56,{ua:2.6,fa:2.4,sw:2.0,ua2:2.9,fa2:2.8,sw2:2.5,x:-42,lean:.35},'in'),K(70,{ua:2.6,fa:2.4,sw:2.0,ua2:2.9,fa2:2.8,sw2:2.5,x:-40,lean:.3}),K(96,X)],
 cues:[{t:14,col:'w'}],hits:[42,56],trails:[[38,44,'w'],[52,58,'w',2]]});
mv({f:'gate',id:'g_kneel',n:'膝をつく',bg:'gate',len:110,cap:'片膝をつき、剣を地面に突く。まだ交差はほどかない。',why:'倒れても剣を交差させたまま＝最後まで門を守ろうとした、という一瞬の物語。',
 keys:[K(0,X),K(10,Object.assign({},X,{lean:-.2,x:3})),K(34,Object.assign({},KNEEL,{sw2:1.2,ua2:1.7,fa2:1.4}),'out'),K(100,Object.assign({},KNEEL,{sw2:1.2,ua2:1.7,fa2:1.4}))],noHero:true});

/* ---------- 黒い門番 ---------- */
mv({f:'dgate',id:'dg_idle',n:'立ち絵：にじむ',bg:'gate',len:90,cap:'門番と同じ構え。でも小さく震え、背中からくらやみがにじむ。',why:'シルエットは人のまま。のまれかけ＝まだ「門番」。ぬしより禍々しくしないための線引き。',
 keys:sway({cr:0,lean:.08},{cr:1,lean:.1},90,2),pp:(P,t)=>{if(t%23<2)P.x=(t%2?1:-1)}});
mv({f:'dgate',id:'dg_eyes',n:'兜の目 → 触手',bg:'gate',len:120,cap:'兜の目が一つずつ白く光る。光った順に、マントの触手が来る。目の数＝回数。',why:'「目が開いた数だけ来る」というルールを見た目に埋め込む。数えれば読める。',
 keys:[K(0,{eyes:0}),K(10,{eyes:1}),K(20,{eyes:2}),K(30,{eyes:3}),K(110,{eyes:3})],pp:(P,t)=>{P.eyes=t<10?0:t<20?1:t<30?2:3},
 fx:(B,J,t)=>{const k=J.k;for(let i=0;i<3;i++){const c=10+i*10,imp=c+28;if(t>=imp-8&&t<imp+6){const r=[J.hip[0]+6*k,J.hip[1]+8*k],u=Math.min(1,(t-imp+8)/8);tentacle(B,r,[lerp(r[0],HXX+20,u*.6),r[1]-8],[lerp(r[0]+6,HXX+8,u),lerp(r[1],FL-14,u)],2*k,.5*k,true)}}},
 cues:[{t:10,col:'w',at:J=>add(J.head,[-2,-5])},{t:20,col:'w',at:J=>add(J.head,[0,-5])},{t:30,col:'w',at:J=>add(J.head,[2,-5])}],hits:[38,48,58]});
mv({f:'dgate',id:'dg_sweep',n:'マントの触手払い',bg:'gate',len:100,cap:'体を沈めたら、低い払い。マントの裾が先に開く。ときどき赤い光（重い）。',why:'人の剣では届かない「低さ」で、のまれていることを伝える。',
 keys:[K(0,X),K(16,Object.assign({},X,{cr:4,lean:-.1})),K(44,Object.assign({},X,{cr:4,lean:.2,x:-6}),'in'),K(90,X)],cues:[{t:16,col:'w',at:J=>add(J.hip,[8,10])}],hits:[44],
 fx:(B,J,t)=>{if(t>=36&&t<56){const u=Math.min(1,(t-36)/8),k=J.k,r=add(J.hip,[6*k,8*k]);tentacle(B,r,[lerp(r[0]+10,60,u),FL-2],[lerp(r[0],HXX+6,u),FL-6],2.4*k,.6*k,true)}}});
mv({f:'dgate',id:'dg_feint',n:'手元の触手',bg:'gate',len:120,cap:'紫の輪が出たら、ふり。手から触手がのびかけて止まる。本物は、そのすぐ次の斬り。',why:'剣ではなく「手」がのびる＝人の動きじゃないから、止まっても不自然に見えない。ふりのすぐ後に本物、の型をここで覚える。',
 keys:[K(0,X),K(16,{ua:2.9,fa:3.0,sw:-1.5,x:-2}),K(36,{ua:2.9,fa:3.0,sw:-1.5,x:-2}),K(48,X),K(62,{ua:-2.4,fa:-1.6,sw:-1.2,ua2:1.0,fa2:.6,sw2:.2,x:4,cr:2}),K(76,{ua:2.8,fa:2.6,sw:2.2,x:-40,lean:.3},'in'),K(96,{ua:2.8,fa:2.6,sw:2.2,x:-40,lean:.3}),K(116,X)],cues:[{t:16,col:'p',at:J=>J.hdF},{t:48,col:'w'}],hits:[76],trails:[[72,78,'w']],
 fx:(B,J,t)=>{if(t>=16&&t<44){const u=t<28?(t-16)/12:1-(t-28)/16,k=J.k;tentacle(B,J.hdF,add(J.hdF,[-8*u,-4]),add(J.hdF,[-24*u,2]),1.6*k,.4*k,true)}}});
mv({f:'dgate',id:'dg_two',n:'くさった二連撃',bg:'gate',len:100,cap:'門番の二連撃と同じ流れ。刃のしずくが落ちたら合図。',why:'同じ動きを繰り返すことで「門番だったもの」とわかる。違いは色としずくだけ。',
 keys:MV.find(m=>m.id==='g_two').keys,cues:[{t:14,col:'w'}],hits:[42,56],trails:[[38,44,'p'],[52,58,'p',2]]});
mv({f:'dgate',id:'dg_down',n:'たおれる：剣だけが残る',bg:'gate',len:120,noHero:true,cap:'体はくらやみに溶ける。交差した剣だけがその場に残る。',why:'溶けても剣は交差したまま＝最後まで門番だった。次の門のぬしへの「ここから先は別物」という区切り。',
 keys:[K(0,X),K(30,Object.assign({},KNEEL,{sw:-2.25,ua:1.75,fa:-.5,sw2:-.85,ua2:1.4,fa2:-2.5}),'out'),K(110,Object.assign({},KNEEL,{sw:-2.25,ua:1.75,fa:-.5,sw2:-.85,ua2:1.4,fa2:-2.5}))],
 post:(B,J,t)=>{if(t>40){const u=Math.min(1,(t-40)/50);for(let i=0;i<B.c.length;i++){if(B.t[i]===1&&B.c[i]!==W_ROT.col&&B.c[i]!==W_ROT.hi&&B.c[i]!==W_ROT.lo&&B.c[i]!==OUT){const x=i%CW,y=i/CW|0;if(((x*13+y*7)%17)/17<u)B.c[i]=(y+x)%3?INK.col:0,B.t[i]=B.c[i]?1:0}}}}});

/* ---------- 門のぬし ---------- */
const LI={ua:1.8,fa:2.9,sw:-1.75,ua2:1.6,fa2:2.4};
const LUP={ua:-2.1,fa:-1.3,sw:-.5,ua2:-1.9,fa2:-1.2,cr:2,x:3,lean:-.1};
const LDN={ua:2.7,fa:2.6,sw:2.45,ua2:2.5,fa2:2.6,x:-12,lean:.3,cr:3};
const LBK={ua:.4,fa:.1,sw:3.14,ua2:.6,fa2:.2,x:4,lean:-.15,cr:2};
const LTH={ua:3.1,fa:3.12,sw:3.14,ua2:3.0,fa2:3.1,x:-16,lean:.25,cr:3,ff:-12};
mv({f:'lord',id:'l_idle',n:'立ち絵：鍵の番人',bg:'lord',len:120,keys:sway({cr:1.5},{cr:2.5},120,2),
 cap:'鍵の大剣を立て、背中の鎖で門とつながっている。足元にはくらやみが溜まる。',why:'鎖＝門とつながっている。角＝門のアーチ。剣＝鍵。マントの裏の目＝閉じ込めたもの。「この先には何かがいる」を一枚で言う。'});
mv({f:'lord',id:'l_enter',n:'登場：鎖を引きずって',bg:'lord',len:140,noHero:true,cap:'鎖を引きずりながら、ゆっくり一歩ずつ前へ。',why:'鎖の長さぶんしか前に出られない。門から離れられない番人だと伝わる。',
 keys:[K(0,Object.assign({},LI,{x:30,chainL:30})),K(30,Object.assign({},LI,{x:20,cr:3,chainL:40})),K(50,Object.assign({},LI,{x:20,cr:1.5,chainL:40})),K(80,Object.assign({},LI,{x:8,cr:3,chainL:52})),K(100,Object.assign({},LI,{x:8,cr:1.5,chainL:52})),K(130,Object.assign({},LI,{x:0,chainL:60}))]});
mv({f:'lord',id:'l_two',n:'二連撃',bg:'lord',len:120,cap:'鍵を高く振り上げて白く光る。打ち下ろし、すくい上げの二回。',why:'大きく重い剣は「振り上げ」が長い。構えが見える時間＝読む時間。',
 keys:[K(0,LI),K(16,LUP),K(30,LUP),K(44,LDN,'in'),K(52,LDN),K(58,{ua:3.0,fa:-2.6,sw:-2.5,ua2:2.8,fa2:-2.8,x:-14,lean:.1,cr:2},'in'),K(76,{ua:3.0,fa:-2.6,sw:-2.5,x:-14}),K(110,LI)],
 cues:[{t:16,col:'w'}],hits:[44,58],trails:[[40,46,'w'],[54,60,'w']]});
mv({f:'lord',id:'l_rev',n:'逆二連撃',bg:'lord',len:120,cap:'剣先を下げて白く光る。すくい上げから入り、打ち下ろしで終わる。',why:'二連撃と順番が逆。剣先の高さ（上か下か）で最初の一撃が読める。',
 keys:[K(0,LI),K(16,{ua:2.2,fa:1.2,sw:.6,x:4,cr:3,lean:-.1}),K(30,{ua:2.2,fa:1.2,sw:.6,x:4,cr:3}),K(44,{ua:3.0,fa:-2.6,sw:-2.5,x:-12,lean:.1},'in'),K(50,LUP),K(58,LDN,'in'),K(76,LDN),K(110,LI)],
 cues:[{t:16,col:'w'}],hits:[44,58],trails:[[40,46,'w'],[54,60,'w']]});
mv({f:'lord',id:'l_thrust',n:'赤い突き：解錠',bg:'lord',len:120,cap:'鍵を引いて赤く光る。まっすぐ突いて、ひねる。重い一撃。',why:'鍵を「差しこんで回す」動き。門を開ける動きで、あなたをこじ開けようとする。',
 keys:[K(0,LI),K(18,LBK),K(34,LBK),K(46,LTH,'in'),K(56,LTH),K(64,Object.assign({},LTH,{sw:3.14,fa:-3.0})),K(110,LI)],
 cues:[{t:18,col:'r'}],hits:[46],hitCol:'r',trails:[[42,48,'r']],
 fx:(B,J,t)=>{if(t>=52&&t<70&&J.tip){/* ひねり：歯がきらめく */const d=t-52;star(B,Math.round(J.tip[0]+6),Math.round(J.tip[1]),[3,2,3,2,1][d%5],'r')}}});
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
mv({f:'lord2',id:'l2_back',n:'背中の触手 ×3：目の順に',bg:'lord',len:130,cap:'背中の触手の先の目が、白く光った順に来る。光った数＝回数。',why:'黒い門番の「目の数＝回数」と同じルール。前に覚えたことがここで効く。',
 keys:[K(0,L2I),K(120,L2I)],pp:(P,t)=>{const on=[0,1,2].map(i=>t>=12+i*10&&t<12+i*10+40);P.eyeOn=on;P.ten=[0,1,2].map(i=>{const imp=40+i*10,d=t-imp;return d<-8?0:d<0?(d+8)/8:d<10?1:Math.max(0,1-(d-10)/12)})},
 cues:[0,1,2].map(i=>({t:12+i*10,col:'w',at:J=>{const k=J.k,r=add(J.sc,[4*k,(-4+i*3)*k]);return[r[0]+(10+i*3)*k,r[1]-(16-i*7)*k]}})),hits:[40,50,60]});
mv({f:'lord2',id:'l2_arm',n:'腕の触手：のびる',bg:'lord',len:110,cap:'左腕だった触手が後ろへしなる。白く光ったら、のびてくる。',why:'人の腕の長さを超えて届く。「この距離なら安全」が通じない怖さ。',
 keys:[K(0,L2I),K(16,{ua2:-.4,fa2:-.9}),K(30,{ua2:-.4,fa2:-.9}),K(44,{ua2:3.0,fa2:3.1},'in'),K(60,{ua2:3.0,fa2:3.1}),K(100,L2I)],cues:[{t:16,col:'w',at:J=>J.hdB}],hits:[44],
 fx:(B,J,t)=>{if(t>=40&&t<64){const u=t<44?(t-40)/4:t<52?1:1-(t-52)/12;tentacle(B,J.hdB,add(J.hdB,[-16*u,-6]),[lerp(J.hdB[0],HXX+10,u),lerp(J.hdB[1],FL-12,u)],1.8*J.k,.5*J.k,true)}}});
mv({f:'lord2',id:'l2_tri',n:'剣と触手の三連',bg:'lord',len:140,cap:'白く光ったら三連。打ち下ろし、すくい上げ、最後に左腕の触手。',why:'剣と触手でリズムが変わる。剣の重さと触手の速さの差が、そのまま難しさになる。',
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
const RI={ua:1.95,fa:2.7,sw:3.5,ua2:1.5,fa2:2.3};
const R8={ua:-.9,fa:-2.6,sw:-1.3,ua2:-.6,fa2:-2.8,cr:2};          /* 八相：上から */
const RG={ua:2.1,fa:2.4,sw:2.35,ua2:1.9,fa2:2.6,cr:3};           /* 下段：下から */
const RW={ua:1.2,fa:.6,sw:.45,ua2:1.0,fa2:.9,cr:2.5,lean:-.1};   /* 脇：剣を隠す */
const RCUT={ua:3.0,fa:2.7,sw:2.5,ua2:2.9,fa2:2.6,x:-44,lean:.25,ff:-12,fb:9};
mv({f:'red',id:'r_idle',n:'立ち絵：切っ先が動かない',bg:'red',len:120,keys:[K(0,{}),K(120,{})],
 cap:'息をしても、マントがゆれても、切っ先だけは一度も動かない。',why:'ほかのボスはみな揺れている。一体だけ止まっている＝剣を極めた者の「静」。動かないことが一番の強さの表現。'});
mv({f:'red',id:'r_stance',n:'構えの切り替え',bg:'red',len:200,noHero:true,cap:'正眼→八相→下段→脇。構えで次の技が決まる。上なら打ち下ろし、下ならすくい上げ、脇なら見えない間合い。',why:'剣を極めた者は、技の前に「構え」を選ぶ。プレイヤーは構えを読めるようになると一段うまくなる。',
 keys:[K(0,RI),K(40,RI),K(50,R8,'out'),K(90,R8),K(100,RG,'out'),K(140,RG),K(150,RW,'out'),K(190,RW),K(200,RI)]});
mv({f:'red',id:'r_two',n:'予備動作のない二連撃',bg:'red',len:110,cap:'構えのまま白く光り、振りかぶらずに来る。見るのは体ではなく光。',why:'振りかぶりが無い＝体の動きでは読めない。だからこそ光の合図が頼り。「光を見る」ゲームの最終試験。',
 keys:[K(0,RI),K(14,RI),K(36,Object.assign({},RI,{cr:2.5})),K(42,RCUT,'in'),K(48,Object.assign({},RCUT,{ua:2.0,fa:-2.6,sw:-2.4})),K(56,Object.assign({},RCUT,{ua:3.1,fa:3.0,sw:2.9,x:-46}),'in'),K(84,Object.assign({},RCUT,{ua:3.1,fa:3.0,sw:2.9,x:-46})),K(104,RI)],
 cues:[{t:14,col:'w'}],hits:[42,56],trails:[[39,44,'w'],[52,58,'w']]});
const RTH={ua:3.1,fa:3.12,sw:3.14,ua2:2.8,fa2:2.9,x:-40,lean:.2,ff:-13,fb:9};
mv({f:'red',id:'r_three',n:'三段突き',bg:'red',len:130,cap:'剣先を引いて光る。同じ高さに三回、間はすべて同じ。三回目だけ赤い光＝重い。',why:'三回とも同じ間隔＝リズムを読めばよい。剣を極めた者は「同じ動きを同じように」繰り返せる。',
 keys:[K(0,RI),K(14,{ua:1.2,fa:3.0,sw:3.14,x:4,cr:3}),K(30,{ua:1.2,fa:3.0,sw:3.14,x:4,cr:3}),K(42,RTH,'in'),K(46,Object.assign({},RTH,{ua:2.0,fa:3.0,x:-36})),K(54,RTH,'in'),K(58,Object.assign({},RTH,{ua:2.0,fa:3.0,x:-36})),K(66,RTH,'in'),K(90,RTH),K(122,RI)],
 cues:[{t:14,col:'w'},{t:26,col:'w'},{t:38,col:'r'}],hits:[42,54,66],trails:[[40,43,'w'],[52,55,'w'],[64,67,'r']]});
mv({f:'red',id:'r_parry',n:'片手でいなす',bg:'red',len:100,cap:'こちらの攻撃を、片手で払う。もう片方の手は腰のまま。',why:'あなたがしてきたパリィを、相手が片手でやる。「自分より上」が一目でわかる。',
 keys:[K(0,RI),K(20,RI),K(30,{ua:2.6,fa:-2.3,sw:-2.2,ua2:1.0,fa2:2.0,lean:-.05}),K(40,{ua:2.6,fa:-2.3,sw:-2.2,ua2:1.0,fa2:2.0}),K(90,RI)],
 fx:(B,J,t)=>{if(t>=26&&t<34&&J.tip)spark(B,Math.round(J.tip[0]+2),Math.round(J.tip[1]+6),t-26,'w');if(t>=18&&t<30){/* あなたの斬撃 */for(let i=0;i<6;i++)B.set(HXX+20+(t-18)*3+i,FL-24+i,'#bfe8ff',4)}}});
mv({f:'red',id:'r_feint',n:'気配だけのフェイント',bg:'red',len:100,cap:'体はほとんど動かない。肩がわずかに沈み、紫の輪だけが出る。押したら負け。',why:'剣を極めた者は、動かずに「来る」と思わせられる。動きが無いぶん、色のルールだけが頼り。',
 keys:[K(0,RI),K(18,RI),K(22,Object.assign({},RI,{cr:2.6,lean:.06})),K(32,RI),K(100,RI)],cues:[{t:20,col:'p',at:J=>add(J.head,[-3,0])}]});
mv({f:'red',id:'r_push',n:'押し合い：刃の位置で押す',bg:'red',len:130,cap:'金に光ったら打ち合い。刃が合わさる高さが毎回ちがう。',why:'力ではなく刃の位置で押してくる。だから押し合いの場所が毎回変わる（本気では五回）。',
 keys:[K(0,RI),K(12,R8),K(26,Object.assign({},RCUT,{x:-30}),'in'),K(36,Object.assign({},RCUT,{x:-26,sw:2.9})),K(50,RG),K(64,Object.assign({},RCUT,{x:-30,ua:2.6,fa:-2.8,sw:-2.7}),'in'),K(74,Object.assign({},RCUT,{x:-26,ua:2.6,fa:-2.9,sw:-2.9})),K(120,RI)],
 cues:[{t:12,col:'g'},{t:50,col:'g'}],hits:[26,64],hitCol:'g',trails:[[23,28,'g'],[61,66,'g']],
 fx:(B,J,t)=>{if(J.tip&&t>=12&&t<80)glow(B,Math.round(J.tip[0]),Math.round(J.tip[1]),3,'g')}});
mv({f:'red',id:'r_zanshin',n:'残心',bg:'red',len:130,cap:'振り抜いたあと、長く止まる。すきに見えるが、すきではない。ここで何かを押すと、もう一撃来る（次の「残心に手を出す」）。待てば、構えを解く。',why:'剣の心得のない者には、すきに見える。でも本当は真逆で、いちばん気を張っている瞬間。「構え中に斬ると返される」は居合のおかしらで先に教わっている。',
 keys:[K(0,RI),K(14,R8),K(28,R8),K(40,Object.assign({},RCUT,{sw:2.2,ua:2.6,fa:2.3}),'in'),K(100,Object.assign({},RCUT,{sw:2.2,ua:2.6,fa:2.3})),K(126,RI)],
 cues:[{t:12,col:'w'}],hits:[40],trails:[[36,42,'w']],fx:(B,J,t)=>{if(t>=50&&t<96&&(t/6|0)%2)B.set(J.head[0]-6,J.head[1]-8,'#ffd040',4)}});
mv({f:'red',id:'r_rage',n:'本気を出す：マントを斬る',bg:'red',len:180,noHero:true,cap:'自分のマントを斬り落とし、剣を鞘に納める。目の光が白くなる。',why:'飾りを捨てる＝本気。鞘に納める＝次は居合。白い目＝「もう光でしか見えない速さ」の予告。',
 fAt:t=>t<120?'red':'red2',
 keys:[K(0,RI),K(20,{ua:-1.0,fa:-.4,sw:.3}),K(30,{ua:2.4,fa:1.2,sw:.2,capeOff:0},'in'),K(60,{ua:2.4,fa:1.2,sw:.2,capeOff:1}),K(90,{ua:1.7,fa:2.2,sw:0,cr:2}),K(118,{ua:1.7,fa:2.2,sw:0,cr:3}),K(120,{ua:1.7,fa:2.2,sw:null,sheath:1,ff:-12,fb:8,cr:4.5,lean:.18,hd:.1}),K(180,{ua:1.7,fa:2.2,sw:null,sheath:1,ff:-12,fb:8,cr:4.5,lean:.18,hd:.1})],
 pp:(P,t)=>{if(t>=30)P.capeOff=1},
 pre:(B,t)=>{if(t>=30){/* 斬り落とされたマントが床に落ちる */const u=Math.min(1,(t-30)/26),x=EXX+10,y=lerp(FL-24,FL-2,u*u);B.poly([[x,y],[x+12,y-6+u*6],[x+16,y+2],[x+3,y+3]],'#5a0e1c','#8a2030','#2a0610')}},
 fx:(B,J,t)=>{if(t>=28&&t<36)for(let i=0;i<14;i++)B.set(J.sc[0]+2+i,J.sc[1]-4+i,'#ffffff',4)}});

/* ---------- 本気の赤い騎士 ---------- */
const R2I={ua:1.7,fa:2.2,sw:null,sheath:1};
const IAI={ua:3.1,fa:3.0,sw:.15,ua2:.9,fa2:.6,sheath:0,x:-66,lean:.2,cr:5,ff:-14,fb:10};
mv({f:'red2',id:'r2_idle',n:'立ち絵：納刀',bg:'red',len:120,keys:[K(0,{}),K(120,{})],cap:'低く構え、手は柄に。目の光が白い尾を引く。',why:'剣が見えない＝光でしか読めない。尾を引く目は、速さの予告。'});
mv({f:'red2',id:'r2_iai',n:'居合',bg:'red',len:120,cap:'目が白く光った瞬間から数えて、いつもの間で来る。見えるのは光と、斬ったあとだけ。',why:'途中の動きを描かない＝「見えない速さ」。でも合図から当たるまでの間は他と同じ。理不尽ではない。',
 keys:[K(0,R2I),K(40,R2I),K(41,IAI,'snap'),K(90,IAI),K(91,R2I,'snap'),K(120,R2I)],cues:[{t:14,col:'w',at:J=>add(J.head,[-3,0])}],hits:[42],
 fx:(B,J,t)=>{if(t>=41&&t<50){/* 一閃：画面を横切る白い線 */const y=FL-14;for(let x=0;x<CW;x++){if((x+t)%9<7-(t-41)*.6)B.set(x,y,'#ffffff',4)}for(let x=HXX;x<EXX;x++)if(t<44)B.set(x,y-1,'#bfe8ff',4)}}});
mv({f:'red2',id:'r2_double',n:'二重フェイント',bg:'red',len:140,cap:'紫の輪が二回。二回とも押さない。三回目の赤い光で本物の居合。',why:'通常の一回から増えた。確率で二回、まれに三回。「何回来るか」ではなく「色を見る」を最後まで試す。',
 keys:[K(0,R2I),K(16,Object.assign({},R2I,{cr:5,lean:-.05})),K(22,R2I),K(42,Object.assign({},R2I,{cr:5,lean:-.05})),K(48,R2I),K(96,R2I),K(97,IAI,'snap'),K(124,IAI),K(125,R2I,'snap')],
 cues:[{t:16,col:'p',at:J=>add(J.head,[-3,0])},{t:42,col:'p',at:J=>add(J.head,[-3,0])},{t:68,col:'r',at:J=>add(J.head,[-3,0])}],hits:[96],hitCol:'r',
 fx:(B,J,t)=>{if(t>=97&&t<104){for(let x=0;x<CW;x++)if((x+t)%9<6)B.set(x,FL-14,'#ffffff',4)}}});
mv({f:'red2',id:'r2_rally',n:'五合の打ち合い',bg:'red',len:180,cap:'金に光ったら打ち合い。五回、刃の高さを変えてくる。',why:'押し合いの位置が変わる、を五回。最後の打ち合いが最長＝ここを越えれば勝ち、の山場。',
 keys:(()=>{const ks=[K(0,R2I),K(8,{ua:1.95,fa:2.7,sw:3.5,sheath:0})];const hs=[R8,RG,RI,R8,RG];hs.forEach((h,i)=>{const t=14+i*28;ks.push(K(t,Object.assign({},h,{sheath:0})));ks.push(K(t+12,Object.assign({},RCUT,{x:-28,sw:[2.4,-2.6,3.1,2.4,-2.6][i],fa:[2.6,-2.8,3.0,2.6,-2.8][i],sheath:0}),'in'))});ks.push(K(170,Object.assign({},RI,{sheath:0})));return ks})(),
 cues:[0,1,2,3,4].map(i=>({t:14+i*28,col:'g'})),hits:[0,1,2,3,4].map(i=>26+i*28),hitCol:'g',
 fx:(B,J,t)=>{if(J.tip&&t>=14&&t<150)glow(B,Math.round(J.tip[0]),Math.round(J.tip[1]),3,'g')}});
mv({f:'red2',id:'r2_last',n:'最期：構えたまま',bg:'red',len:220,noHero:true,cap:'鞘から抜いた剣を、顔の前に縦に立てて構える。美しい構えのまま、目の光だけがゆっくり消えていく。倒れない。',why:'剣を極めた者は、構えのまま終わる。この構えは、のちに水面から現れる姿と同じになる。',
 keys:[K(0,Object.assign({},RI,{sheath:0})),K(40,{ua:2.35,fa:-1.25,sw:-1.57,ua2:2.15,fa2:-1.45,sheath:0,cr:1,lean:.02,hd:.08},'out'),K(220,{ua:2.35,fa:-1.25,sw:-1.57,ua2:2.15,fa2:-1.45,sheath:0,cr:1,lean:.02,hd:.08})],
 pp:(P,t)=>{P.eyeOff=t<60?0:Math.min(1,(t-60)/100)},
 fx:(B,J,t)=>{if(t>=40&&t<56&&J.tip)star(B,Math.round(J.tip[0]),Math.round(J.tip[1]),[2,3,4,4,3,3,2,2,1,1,1,1,1,1,1,1][t-40],'w')}});
/* ---------- 赤い門のぬし ---------- */
const FI={ua:1.95,fa:2.7,sw:3.5,ua2:1.3,fa2:2.0};
const glitch=(P,t)=>{const g=(t*7919)%97;if(g<6){P.x=(P.x||0)+(g%2?2:-2);P.hd=(P.hd||0)+.25}};
/* 黒い水面：穴の底の床。体の下半分を水面で隠す */
const water=(B,t)=>{for(let x=0;x<CW;x++){const w=Math.sin(x*.3+t*.1)>.6;B.set(x,FL,w?'#3a2a50':'#1a1428',6);B.set(x,FL+1,'#0c0a14',6)}};
mv({f:'fallen',id:'f_rise',n:'登場：穴の底の水から',bg:'hole',len:160,noHero:true,cap:'黒い水面から、赤い騎士がゆっくり立ち上がる。構えは、あの正眼のまま。',why:'「同じ構え」で出てくるのがいちばん怖い。剣の型は体が覚えている。',
 keys:[K(0,Object.assign({},FI,{lift:-46,lean:.4,hd:.6})),K(100,Object.assign({},FI,{lift:0,lean:.3,hd:.5}),'io'),K(120,FI,'out'),K(160,FI)],
 post:(B,J,t)=>{for(let y=FL+1;y<CH;y++)for(let x=0;x<CW;x++){if(B.t[y*CW+x]!==6){B.c[y*CW+x]=((x+y)%5?'#0c0a14':'#1a1428');B.t[y*CW+x]=6}}water(B,t)}});
mv({f:'fallen',id:'f_idle',n:'立ち絵：ときどき、ずれる',bg:'hole',len:120,keys:[K(0,{}),K(120,{})],pp:(P,t)=>glitch(P,t),
 cap:'切っ先は動かない。でも、ときどき体ごと「ずれる」。',why:'赤い騎士の「静」を残したまま、くらやみの「乱れ」だけを足す。違和感で、のまれたことを伝える。',post:(B,J,t)=>water(B,t)});
mv({f:'fallen',id:'f_cutten',n:'剣と触手',bg:'hole',len:130,cap:'白く光ったら、剣の一撃。そのすぐ後に、左腕の触手。',why:'剣は赤い騎士のまま正確。触手はくらやみのもの。一つの攻撃に二人ぶんのリズムが混ざる。',
 keys:[K(0,FI),K(14,FI),K(36,Object.assign({},FI,{cr:2.5})),K(42,RCUT,'in'),K(50,Object.assign({},RCUT,{ua2:-.4,fa2:-.9})),K(56,Object.assign({},RCUT,{ua2:3.0,fa2:3.1}),'in'),K(80,RCUT),K(120,FI)],
 cues:[{t:14,col:'w'}],hits:[42,56],trails:[[39,44,'w']],pp:(P,t)=>glitch(P,t),post:(B,J,t)=>water(B,t),
 fx:(B,J,t)=>{if(t>=52&&t<66){const u=t<56?(t-52)/4:1-(t-56)/10;tentacle(B,J.hdB,add(J.hdB,[-10*u,-8]),[lerp(J.hdB[0],HXX+10,u),lerp(J.hdB[1],FL-12,u)],1.6,.5,true)}}});
mv({f:'fallen',id:'f_dark',n:'ささやき：くらやみの中の正眼',bg:'hole',len:130,cap:'あたりが暗くなり、合図の光は出ない。見えるのは銀の切っ先だけ。切っ先が沈んだら来る。',why:'ぬしの「ささやき」を受けついだ技。でも赤い騎士は、切っ先（剣だけは、のまれていない銀）で読ませてくれる。',
 keys:[K(0,FI),K(40,FI),K(56,Object.assign({},FI,{sw:3.75,cr:3})),K(70,RCUT,'in'),K(90,RCUT),K(120,FI)],hits:[70],
 post:(B,J,t)=>{water(B,t);const u=t<20?t/20:t<92?1:Math.max(0,1-(t-92)/20);for(let i=0;i<B.c.length;i++){const x=i%CW,y=i/CW|0;const kp=B.c[i]===W_LONG.col||B.c[i]===W_LONG.hi||B.c[i]===W_LONG.lo;if(B.t[i]===2||B.t[i]===4||kp||(x<44&&B.t[i]&&B.t[i]!==6))continue;if(((x+y)%2===0&&u>.3)||u>.8){B.c[i]='#06040a';B.t[i]=7}}if(J.tip&&u>.3)B.set(Math.round(J.tip[0]),Math.round(J.tip[1]),'#ffffff',4)}});
mv({f:'fallen',id:'f_double',n:'二重フェイント',bg:'hole',len:140,cap:'紫の輪が二回、本物は赤い光。のまれても、剣の駆け引きは覚えている。',why:'赤い騎士の技がそのまま残っている＝体は同じ人。確率も赤い騎士と同じにする。',
 keys:[K(0,FI),K(16,Object.assign({},FI,{cr:2.6,lean:.06})),K(24,FI),K(42,Object.assign({},FI,{cr:2.6,lean:.06})),K(50,FI),K(92,FI),K(98,RCUT,'in'),K(120,RCUT),K(136,FI)],
 cues:[{t:16,col:'p',at:J=>add(J.head,[-3,0])},{t:42,col:'p',at:J=>add(J.head,[-3,0])},{t:70,col:'r'}],hits:[98],hitCol:'r',trails:[[95,100,'r']],pp:(P,t)=>glitch(P,t),post:(B,J,t)=>water(B,t)});
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
mv({f:'fallen2',id:'f2_idle',n:'立ち絵：水に映る本当の姿',bg:'hole',len:120,keys:sway({cr:2},{cr:3},120,2),
 cap:'背中の触手が門のアーチになり、その内側は門の向こう。足元の水面には、のまれる前の赤い騎士が映っている。',why:'彼はもう「門」そのもの。でも水面の中では、まだ赤い騎士のまま。倒す理由が、絵の中にある。',
 post:(B,J,t)=>{water(B,t);reflection(B,t,'red',J.P||{},EXX)}});
mv({f:'fallen2',id:'f2_ring',n:'門の輪の触手',bg:'hole',len:140,cap:'輪の赤い目が一つずつ光る。光った順に、輪から触手が来る。',why:'門のぬしの「目の順」の総まとめ。ここまで覚えたルールが最後に全部効く。',
 keys:[K(0,F2I),K(130,F2I)],cues:[0,1,2].map(i=>({t:14+i*10,col:'w',at:J=>{const c=add(J.sc,[4*J.k,-4*J.k]),a=Math.PI+(2+i*4)/24*Math.PI;return add(c,dir(a,19*J.k))}})),hits:[42,52,62],
 fx:(B,J,t)=>{for(let i=0;i<3;i++){const imp=42+i*10,d=t-imp;if(d>=-8&&d<12){const u=d<0?(d+8)/8:1-d/12,c=add(J.sc,[4*J.k,-4*J.k]),a=Math.PI+(2+i*4)/24*Math.PI,p=add(c,dir(a,19*J.k));tentacle(B,p,[lerp(p[0],60,u),p[1]-14],[lerp(p[0],HXX+8,u),lerp(p[1],FL-12,u)],2,.5,true)}}},
 post:(B,J,t)=>{water(B,t);reflection(B,t,'red',J.P||{},EXX)}});
mv({f:'fallen2',id:'f2_four',n:'四連撃',bg:'hole',len:150,cap:'白く光ったら四連。剣、剣、触手、最後の一撃だけ赤い光で重い。',why:'赤い騎士の二連撃と、ぬしの三連の合体。「二人ぶん」がひとつの体で来る。',
 keys:[K(0,F2I),K(14,R8),K(28,R8),K(40,RCUT,'in'),K(46,Object.assign({},RCUT,{ua:2.0,fa:-2.6,sw:-2.4})),K(52,Object.assign({},RCUT,{ua:3.1,fa:3.0,sw:2.9}),'in'),K(58,Object.assign({},RCUT,{ua:3.1,fa:3.0,sw:2.9,ua2:3.0,fa2:3.1})),K(70,R8),K(76,RCUT,'in'),K(100,RCUT),K(140,F2I)],
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
mv({f:'dgate',id:'dg_turn',n:'のまれかけ：門番が黒い門番になる',bg:'gate',len:180,noHero:true,cap:'門番の背中から、くらやみが這い上がる。兜の目が一つずつ開き、鎖が黒く長くのびる。',why:'覚悟3で門番がこの姿になる理由を、一枚で見せる。門に背を向けて立っていた番人だから、背中から。',
 fAt:t=>t<110?'gate':'dgate',
 keys:[K(0,XG),K(60,Object.assign({},XG,{lean:.25,cr:2,hd:.3})),K(108,Object.assign({},XG,{lean:.3,cr:3,hd:.4})),K(110,Object.assign({},XG,{lean:.3,cr:3,hd:.4,eyes:0})),K(140,Object.assign({},XG,{lean:.08,eyes:3})),K(180,Object.assign({},XG,{lean:.08,eyes:3}))],
 pp:(P,t)=>{if(t>=110)P.eyes=t<120?0:t<128?1:t<136?2:3},
 post:(B,J,t)=>{if(t>20&&t<110){const u=(t-20)/90;for(let i=0;i<B.c.length;i++){const x=i%CW,y=i/CW|0;if(B.t[i]!==1)continue;const dx=x-(J.hip[0]+4),dy=FL-y;if(dx>0&&dy<u*60&&((x*5+y*3)%7)/7<u*1.4)B.c[i]=(x+y)%3?INK.col:INK.hi}}
  if(t>=108&&t<112)for(let i=0;i<B.c.length;i++)if(B.c[i]&&B.t[i]===1)B.c[i]='#ffffff'}});
mv({f:'dgate',id:'dg_state',n:'派生の立ち絵：目の数',bg:'gate',len:180,noHero:true,cap:'目が1つ、2つ、3つ。開いている目の数で、のまれ具合がわかる。',why:'「目＝上位の存在の視線、のまれたものほど目が増える」というモチーフを、一体の中で見せる。',
 keys:[K(0,{}),K(180,{})],pp:(P,t)=>{P.eyes=t<60?1:t<120?2:3}});
mv({f:'dgate',id:'dg_chain',n:'鎖の打ち払い',bg:'gate',len:120,cap:'手首の黒い鎖を後ろへ引いて、白く光る。鞭のように横に払う。',why:'門番の短い鎖が、のまれて長く黒くなった。仕えるための鎖が、武器になってしまった。',
 keys:[K(0,X),K(16,Object.assign({},X,{ua2:.2,fa2:-.4,lean:-.1})),K(30,Object.assign({},X,{ua2:.2,fa2:-.4,lean:-.1})),K(44,Object.assign({},X,{ua2:2.9,fa2:3.0,lean:.2,x:-4}),'in'),K(70,Object.assign({},X,{ua2:2.9,fa2:3.0,lean:.2,x:-4})),K(110,X)],cues:[{t:16,col:'w',at:J=>J.hdB}],hits:[44],
 fx:(B,J,t)=>{if(t>=38&&t<60){const u=t<44?(t-38)/6:1-(t-44)/16,h=J.hdB;for(let i=0;i<24;i++){const s=i/24,x=lerp(h[0],HXX+8,s*u),y=h[1]+Math.sin(s*3.14)*(-10*(1-u))+s*(FL-14-h[1])*u;B.set(x,y,i%2?'#22142e':'#4e2c70',1)}}}});
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
mv({f:'lord2',id:'l2_whip',n:'ちぎれた鎖の鞭',bg:'lord',len:120,cap:'手首からちぎれた鎖を、触手が拾って振り回す。白く光ったら、上から叩きつける。',why:'門と自分をつないでいた鎖が、もう鞭でしかない。つながりが切れたことを技で見せる。',
 keys:[K(0,L2I),K(16,Object.assign({},L2I,{ua2:-1.2,fa2:-1.6,lean:-.15})),K(30,Object.assign({},L2I,{ua2:-1.2,fa2:-1.6,lean:-.15})),K(44,Object.assign({},L2I,{ua2:2.6,fa2:2.9,lean:.25}),'in'),K(70,Object.assign({},L2I,{ua2:2.6,fa2:2.9,lean:.25})),K(110,L2I)],cues:[{t:16,col:'w',at:J=>J.hdB}],hits:[44],
 fx:(B,J,t)=>{const h=J.hdB;let tip;if(t<44){const a=-1.4-Math.min(1,t/16)*.8;tip=add(h,dir(a,20))}else{const u=Math.min(1,(t-44)/4);tip=[lerp(h[0]-6,HXX+8,u),lerp(h[1]-20,FL-12,u)]}if(t>=44&&t>70)return;for(let i=0;i<20;i++){const s=i/20,x=lerp(h[0],tip[0],s),y=lerp(h[1],tip[1],s)-Math.sin(s*3.14)*6;B.set(x,y,i%2?'#5e566e':'#b8902a',1)}}});
mv({f:'lord2',id:'l2_gate',n:'門の向こうの指',bg:'lord',len:160,cap:'背後の大門のすき間が開き、中から三本の指が出てくる。光った指の順に来る。',why:'三つ首の竜と同じもの（上位の存在の指先）。門の向こうにいるのが何か、一度だけのぞかせる。',
 keys:[K(0,L2I),K(20,Object.assign({},L2I,{door:1.4,lean:-.2})),K(150,Object.assign({},L2I,{door:1.4,lean:-.2}))],
 cues:[0,1,2].map(i=>({t:30+i*10,col:'w',at:J=>[CW-8-i*6,20+i*14]})),hits:[58,68,78],
 pre:(B,t)=>{/* 背後の門のすき間 */const o=Math.min(1,t/20)*3;for(let y=6;y<FL;y++)for(let x=CW-24;x<CW;x++){const cx=CW-12;const g=Math.abs(x-cx)<o+(y%7?0:1);B.set(x,y,g?(((x+y+(t/4|0))%5)?'#3a1a5a':'#c070ff'):((x-CW)%9===0||y%12===0?'#1a1420':'#2a2232'),6)}},
 fx:(B,J,t)=>{for(let i=0;i<3;i++){const imp=58+i*10,d=t-imp,base=[CW-12,20+i*14];if(t<28)continue;let u=d<-10?.15:d<0?.15+(d+10)/10*.85:d<10?1:Math.max(.15,1-(d-10)/20);const tip=[lerp(base[0],HXX+8,u),lerp(base[1],FL-12-i*2,u)];
   /* 指：3つの節としわ。先は白い爪 */for(let s=0;s<=1;s+=.02){const x=lerp(base[0],tip[0],s),y=lerp(base[1],tip[1],s)-Math.sin(s*3.14)*8*u,r=2.4-s*1.2;for(let yy=-r;yy<=r;yy++)B.set(x,y+yy,(Math.abs(s-.33)<.02||Math.abs(s-.66)<.02)?'#2a2030':yy<-r+1?'#b0a8b8':yy>r-1?'#4a4050':'#7a7088',1)}B.set(tip[0],tip[1],'#e8e0d0',2);B.set(tip[0]+1,tip[1],'#e8e0d0',2)}}});

/* ===== 追加の新しい技 ===== */
mv({f:'dgate',id:'dg_beat',n:'鎖の拍',bg:'gate',len:150,cap:'黒い鎖で床を3回打つ（ガン・ガン・ガン）。その次の拍で、鎖が横から来る。',why:'拍で読む攻撃は、小鬼のおかしらで先に教わっている。「3」は門の数字。門番の誓いの鎖が、拍を刻む道具になった。',
 keys:[K(0,X),K(14,Object.assign({},X,{ua2:.6,fa2:1.4})),K(130,Object.assign({},X,{ua2:.6,fa2:1.4})),K(146,X)],cues:[{t:20,col:'w',at:J=>[J.hdB[0]+10,FL-2]}],hits:[48],
 fx:(B,J,t)=>{const h=J.hdB;const beats=[20,30,40];let up=1;for(const b of beats)if(t>=b&&t<b+4)up=0;if(t<48){for(let i=0;i<18;i++){const s=i/18,x=h[0]+s*14,y=lerp(h[1],FL-1,up?Math.min(1,s*1.4)*.7:Math.min(1,s*1.5));B.set(x,y,i%2?'#22142e':'#4e2c70',1)}for(const b of beats)if(t>=b&&t<b+5)spark(B,h[0]+13,FL-2,t-b,'w')}
  else if(t<64){const u=Math.min(1,(t-44)/4);for(let i=0;i<24;i++){const s=i/24,x=lerp(h[0],HXX+8,s*u),y=lerp(h[1],FL-14,s*u)-Math.sin(s*3.14)*4;B.set(x,y,i%2?'#22142e':'#4e2c70',1)}}}});
const LPULL={ua:.5,fa:.2,sw:-1.2,ua2:.4,fa2:.2,lean:-.25,cr:2,x:4};
mv({f:'lord',id:'l_pull',n:'門の重み',bg:'lord',len:140,cap:'背中の鎖を両手で引き、背後の門がきしむ。胸の封印が赤く光ったら、鍵の大剣を叩きつける。重い。',why:'ぬしの力は門とつながっていることから来る。鎖を引く＝門の重さを自分の一撃に乗せる。',
 keys:[K(0,LI),K(18,LPULL),K(36,Object.assign({},LPULL,{lean:-.3,x:6})),K(40,LUP),K(56,LUP),K(68,Object.assign({},LDN,{x:-16,cr:4}),'in'),K(100,Object.assign({},LDN,{x:-16,cr:4})),K(132,LI)],
 cues:[{t:40,col:'r',at:J=>add(J.sc,[0,5*J.k])}],hits:[68],hitCol:'r',trails:[[64,70,'r']],pp:(P,t)=>{P.chainL=t>=18&&t<40?44:60},
 fx:(B,J,t)=>{if(t>=18&&t<40&&(t>>1)%2)for(let i=0;i<3;i++)B.set(CW-2,J.sc[1]-6+i*8,'#c8a050',4);if(t>=68&&t<80){for(let x=HXX;x<EXX;x+=2)B.set(x,FL-1-((x+t)%3===0?1:0),'#ffb0a0',4)}}});
mv({f:'lord2',id:'l2_pool',n:'足元の溜まりから',bg:'lord',len:130,cap:'ぬしの足元のくらやみが、床を這ってこちらの足元まで広がる。泡が白く光ったら、真下から触手が突き上がる。',why:'黒い門番を染めた「溜まり」が、ついにこちらへ届く。くらやみは悪意ではなく、ただ広がるもの。',
 keys:[K(0,L2I),K(16,Object.assign({},L2I,{lean:.15,cr:3})),K(120,Object.assign({},L2I,{lean:.15,cr:3})),K(128,L2I)],cues:[{t:22,col:'w',at:J=>[HXX+6,FL-2]}],hits:[50],
 pre:(B,t)=>{const u=Math.min(1,t/22);for(let x=Math.round(lerp(EXX-10,HXX-4,u));x<EXX;x++){B.set(x,FL,INK.hi,6);if((x+t)%4===0)B.set(x,FL-1,INK.col,6)}},
 fx:(B,J,t)=>{if(t>=18&&t<46&&(t>>2)%2){B.set(HXX+5,FL-2,'#9a5ad0',4);B.set(HXX+8,FL-3,'#9a5ad0',4)}if(t>=46&&t<70){const u=t<50?(t-46)/4:1-(t-50)/20;for(let i=0;i<3;i++){const x=HXX+3+i*3;B.tube([x,FL],[x+(i-1)*2,FL-10*u],[x+(i-1)*4,FL-22*u],2,.5,'#4e2c70','#9a5ad0','#22142e',1)}}}});
mv({f:'lord2',id:'l2_doors',n:'扉のかみ合わせ',bg:'lord',len:120,cap:'胸の扉を大きく開いたまま前に出る。赤く光ったら、扉があごのように閉じて挟みにくる。重い。',why:'扉＝門。閉じる門に挟まれる。胸の口（回復）とは別の、扉そのものの技。',
 keys:[K(0,L2I),K(16,Object.assign({},L2I,{door:2,lean:-.1})),K(34,Object.assign({},L2I,{door:2.2,lean:.2,x:-14})),K(44,Object.assign({},L2I,{door:.2,lean:.35,x:-18}),'in'),K(70,Object.assign({},L2I,{door:.2,lean:.35,x:-18})),K(112,L2I)],
 cues:[{t:16,col:'r',at:J=>add(J.sc,[0,9*J.k])}],hits:[44],hitCol:'r'});

/* ===== 赤の系統（第2版） ===== */
mv({f:'red',id:'r_delay',n:'遅らせ突き',bg:'red',len:130,cap:'剣先を引いたまま長く溜める。体ではなく、光で押す。',why:'溜めの長さで焦らせる。剣を極めた者は「待つ」ことも技にする。',
 keys:[K(0,RI),K(14,{ua:1.2,fa:3.0,sw:3.14,x:4,cr:3}),K(60,{ua:1.2,fa:3.0,sw:3.14,x:5,cr:3.5}),K(80,RTH,'in'),K(100,RTH),K(126,RI)],cues:[{t:52,col:'w'}],hits:[80],trails:[[77,82,'w']]});
mv({f:'red',id:'r_swap',n:'逆の二連撃',bg:'red',len:110,cap:'構えのまま白く光る。すくい上げから入り、打ち下ろしで終わる。',why:'門のぬしと同じ技。同じ人だから、同じ型を持っている。',
 keys:[K(0,RI),K(14,RG),K(36,RG),K(42,Object.assign({},RCUT,{ua:2.0,fa:-2.6,sw:-2.4}),'in'),K(48,R8),K(56,Object.assign({},RCUT,{ua:3.1,fa:3.0,sw:2.9,x:-46}),'in'),K(84,Object.assign({},RCUT,{ua:3.1,fa:3.0,sw:2.9,x:-46})),K(104,RI)],cues:[{t:14,col:'w'}],hits:[42,56],trails:[[39,44,'w'],[52,58,'w']]});
mv({f:'red',id:'r_thrust',n:'突き',bg:'red',len:110,cap:'剣先を引いて赤く光る。まっすぐ一突き。重い。',why:'ぬしの「解錠」の突きと同じ動き。ただし鍵は回さない。この世界線では、門を開ける必要がないから。',
 keys:[K(0,RI),K(18,{ua:1.2,fa:3.0,sw:3.14,x:4,cr:3}),K(32,{ua:1.2,fa:3.0,sw:3.14,x:4,cr:3}),K(46,RTH,'in'),K(70,RTH),K(104,RI)],cues:[{t:18,col:'r'}],hits:[46],hitCol:'r',trails:[[43,48,'r']]});
mv({f:'red',id:'r_combo4',n:'四連撃',bg:'red',len:150,cap:'白く光ったら四連。打ち下ろし、すくい上げ、打ち下ろし、最後の突きだけ赤い光。',why:'型を四つつなげても、一つも崩れない。剣を極めた者の正確さ。',
 keys:[K(0,RI),K(12,R8),K(28,R8),K(40,RCUT,'in'),K(46,Object.assign({},RCUT,{ua:2.0,fa:-2.6,sw:-2.4})),K(52,Object.assign({},RCUT,{ua:3.1,fa:3.0,sw:2.9}),'in'),K(58,R8),K(64,RCUT,'in'),K(70,{ua:1.2,fa:3.0,sw:3.14,x:-30}),K(78,RTH,'in'),K(100,RTH),K(140,RI)],
 cues:[{t:12,col:'w'},{t:50,col:'r'}],hits:[40,52,64,78],trails:[[37,42,'w'],[49,54,'w'],[61,66,'w'],[75,80,'r']]});
mv({f:'red',id:'r_seal',n:'派生の立ち絵：ひびのない封印',bg:'red',len:120,noHero:true,keys:[K(0,{}),K(120,{})],
 cap:'胸に、門のぬしと同じ金の封印。ただし、ひびがない。中には赤。',why:'同じ人の、のまれなかった姿。ぬしの封印のひびの奥に見えた赤は、ここから来ている。',fx:(B,J,t)=>{if((t%60)<30)glow(B,Math.round(J.sc[0]),Math.round(J.sc[1]+5*J.k),3,'#ffe080')}});

/* 赤い門のぬし：二つの世界線が重なった姿。門のぬしの技を受けつぐ */
const FW=(id,src,extra)=>{const m=MV.find(x=>x.id===src);const o=Object.assign({},m,{f:'fallen',id,bg:'hole'},extra||{});const post0=o.post;o.post=(B,J,t,S)=>{if(post0)post0(B,J,t,S);water(B,t)};return mv(o)};
FW('f_back','l2_back',{n:'背中の触手：目の順に',cap:'背中の触手の先の目が、白く光った順に来る。ぬしと同じ技。',why:'世界線が重なり、ぬしの体の技が赤い騎士の体に出てきた。'});
FW('f_arm','l2_arm',{n:'腕の触手',cap:'左腕だった触手がしなる。白く光ったら、のびてくる。ときどき赤い光。',why:'暗い門のぬしと同じ腕。のまれた世界線の腕が、こちらの世界線の騎士についた。'});
FW('f_sa','l2_tri',{n:'剣と触手の三連',cap:'白く光ったら三連。打ち下ろし、すくい上げ、最後に左腕の触手。',why:'剣は赤い騎士、触手はぬし。一つの攻撃に二つの世界線が混ざる。'});
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
mv({f:'fallen',id:'f_twin',n:'二つの高さ',bg:'hole',len:130,cap:'白く光ると、のまれる前の影が上（八相）に、本体が下（下段）に構える。上、下の順に二回来る。',why:'二つの世界線が、別々の構えを選んだ。影の構えが、一撃目の高さを教えてくれる。',
 keys:[K(0,FI),K(14,RG),K(40,RG),K(42,Object.assign({},RCUT,{ua:2.0,fa:-2.6,sw:-2.4}),'in'),K(54,Object.assign({},RCUT,{ua:2.0,fa:-2.6,sw:-2.4,x:-46})),K(90,Object.assign({},RCUT,{ua:2.0,fa:-2.6,sw:-2.4,x:-46})),K(124,FI)],cues:[{t:14,col:'w'},{t:26,col:'w'}],hits:[42,54],trails:[[50,56,'w']],pp:(P,t)=>glitch(P,t),
 pre:(B,t)=>{if(t>=14&&t<46){const G=new Buf(CW,CH);const P2=t<38?R8:Object.assign({},RCUT,{x:-30});knight(G,EXX-6,FL,SPEC.red,P2,t);for(let i=0;i<G.c.length;i++){const x=i%CW,y=i/CW|0;if(G.c[i]&&(x+y+t)%3===0)B.set(x,y,mix(G.c[i],'#1a1428',.35),8)}}},post:(B,J,t)=>water(B,t)});
mv({f:'fallen',id:'f_iai',n:'くらやみの居合',bg:'hole',len:130,cap:'腰の鞘に手をかける。目が白く光った瞬間から、いつもの間で来る。抜かれた刃の後ろに、くらやみが尾を引く。',why:'本気の赤い騎士の居合が、のまれたあとも体に残っている。刃は銀、尾はくらやみ。',
 keys:[K(0,FI),K(10,{ua:1.7,fa:2.2,sw:null,sheath:1,cr:4.5,lean:.18}),K(41,{ua:1.7,fa:2.2,sw:null,sheath:1,cr:4.5,lean:.18}),K(42,Object.assign({},IAI,{x:-58}),'snap'),K(90,Object.assign({},IAI,{x:-58})),K(91,FI,'snap'),K(130,FI)],cues:[{t:14,col:'w',at:J=>add(J.head,[-3,0])}],hits:[42],pp:(P,t)=>glitch(P,t),
 fx:(B,J,t)=>{if(t>=42&&t<54){const y=FL-14;for(let x=0;x<CW;x++){if((x+t)%9<7-(t-42)*.5){B.set(x,y,'#ffffff',4);B.set(x,y+1,INK.hi,4);B.set(x,y-1,INK.col,4)}}}},post:(B,J,t)=>water(B,t)});
mv({f:'fallen',id:'f_cage',n:'マントの触手の檻',bg:'hole',len:160,cap:'マントだった触手が三本、こちらのまわりの水面から立ち上がる。先の目が白く光った順に、閉じてくる。',why:'斬り捨てたマントが、くらやみになって戻り、こちらを囲う。「3」は門の数字。',
 keys:[K(0,FI),K(16,Object.assign({},FI,{lean:.2,cr:3})),K(150,Object.assign({},FI,{lean:.2,cr:3}))],cues:[0,1,2].map(i=>({t:22+i*12,col:'w',at:J=>[HXX-10+i*10,FL-30+((i%2)*6)]})),hits:[50,62,74],
 fx:(B,J,t)=>{for(let i=0;i<3;i++){const bx=HXX-10+i*10,imp=50+i*12,d=t-imp;if(t<14)continue;const rise=Math.min(1,(t-14)/10),cl=d<0?0:d<8?d/8:Math.max(0,1-(d-8)/14);const tip=[lerp(bx,HXX+4,cl),lerp(FL-30+((i%2)*6),FL-12,cl)];B.tube([bx,FL],[bx+(i-1)*3,FL-16*rise],[tip[0],lerp(FL,tip[1],rise)],1.8,.5,'#4e2c70','#9a5ad0','#22142e',1);B.set(...tip.map(Math.round),'#c070ff',2)}},post:(B,J,t)=>water(B,t)});
mv({f:'fallen2',id:'f2_close',n:'アーチが閉じる',bg:'hole',len:130,cap:'背中の門のアーチが少し後ろへ反り、赤く光ったら、門ごと前へ倒れてきてこちらを押しつぶす。重い。',why:'暗い門のぬしの「扉のかみ合わせ」と同じ考え。彼は門そのものだから、門として閉じる。',
 keys:[K(0,Object.assign({},F2I,{archTilt:0})),K(16,Object.assign({},F2I,{lean:-.2,archTilt:-.15})),K(40,Object.assign({},F2I,{lean:-.25,archTilt:-.2})),K(48,Object.assign({},F2I,{lean:.3,x:-8,archTilt:1.35}),'in'),K(80,Object.assign({},F2I,{lean:.3,x:-8,archTilt:1.35})),K(122,Object.assign({},F2I,{archTilt:0}))],cues:[{t:20,col:'r',at:J=>add(J.sc,[0,-24*J.k])}],hits:[48],hitCol:'r',
 fx:(B,J,t)=>{if(t>=48&&t<56)for(let x=HXX-6;x<HXX+30;x++)B.set(x,FL-1,'#ffb0a0',4)},post:(B,J,t)=>{water(B,t);reflection(B,t,'red',J.P||{},EXX)}});
mv({f:'fallen2',id:'f2_pulse',n:'核の拍',bg:'hole',len:150,cap:'胸の核が3回脈打つ（ドクン・ドクン・ドクン）。その次の拍で、銀の剣が来る。',why:'拍で読む攻撃は先に教わっている。核の拍は、心臓の名残。剣だけは、まだ赤い騎士の手で振られる。',
 keys:[K(0,F2I),K(14,R8),K(52,R8),K(60,RCUT,'in'),K(90,RCUT),K(140,F2I)],cues:[{t:32,col:'w'}],hits:[60],trails:[[57,62,'w']],
 pp:(P,t)=>{let c=0;for(const b of[20,32,44]){const d=t-b;if(d>=0&&d<8)c=Math.max(c,(1-d/8)*1.4)}P.core=c},
 fx:(B,J,t)=>{for(const b of[20,32,44]){const d=t-b;if(d>=0&&d<12){const c=add(J.sc,[0,5*J.k]);for(let a=0;a<48;a++){const th=a/48*6.28,r=4+d*2.2;if(a%2)B.set(c[0]+Math.cos(th)*r,c[1]+Math.sin(th)*r,d<6?'#ff3050':'#a01030',4)}}}},post:(B,J,t)=>{water(B,t);reflection(B,t,'red',J.P||{},EXX)}});

/* ===== 本気の赤い騎士：居合の技を足す ===== */
const R2S={ua:1.7,fa:2.2,sw:null,sheath:1};
mv({f:'red2',id:'r2_iai2',n:'弐の居合（すれちがい・後ろから・タン……タン）',bg:'red',len:170,cap:'居合で斬り抜けて、こちらの後ろへ抜ける。背後で「カチン」と納刀の音。振り返りざまに、後ろからもう一度。2撃の間が長い（タン……タン）。見るのは目の光。',why:'騎士が画面の反対側へ抜けて、逆の向きから来る。参段の居合（その場から動かない）とは、騎士の位置でひと目で分かれる。',
 keys:[K(0,R2S),K(41,R2S),K(42,IAI,'snap'),K(60,IAI),K(61,Object.assign({},R2S,{x:-62}),'snap'),K(83,Object.assign({},R2S,{x:-62})),K(84,Object.assign({},IAI,{x:0,lean:-.1}),'snap'),K(110,Object.assign({},IAI,{x:0})),K(111,R2S,'snap'),K(170,R2S)],
 cues:[{t:14,col:'w',at:J=>add(J.head,[-3,0])},{t:56,col:'w',at:J=>add(J.head,[-3,0])}],hits:[42,84],
 fx:(B,J,t)=>{for(const h of[42,84])if(t>=h&&t<h+8){for(let x=0;x<CW;x++)if((x+t)%9<7-(t-h)*.6)B.set(x,FL-14,'#ffffff',4)}
  if(t>=62&&t<76){/* 背後の納刀の音 */const c=add(J.hip,[-1*J.k,1*J.k]);for(let q=0;q<2;q++){const r=3+(t-62)*1.2+q*4;for(let a=-.9;a<=.9;a+=.15){B.set(c[0]-Math.cos(a)*r,c[1]+Math.sin(a)*r,q?'#6a6278':'#a8a0b0',4);B.set(c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r,q?'#6a6278':'#a8a0b0',4)}}}}});
mv({f:'red2',id:'r2_hold',n:'溜め居合',bg:'red',len:180,cap:'柄に手をかけたまま、長く動かない。じれて押せば負け。目が白く光ってから、いつもの間で来る。',why:'遅らせ突きの居合版。待つのも技。光が出るまでは、何も始まっていない。',
 keys:[K(0,R2S),K(20,Object.assign({},R2S,{cr:5.5,lean:.22})),K(105,Object.assign({},R2S,{cr:5.5,lean:.22})),K(106,IAI,'snap'),K(140,IAI),K(141,R2S,'snap'),K(180,R2S)],
 cues:[{t:78,col:'w',at:J=>add(J.head,[-3,0])}],hits:[106],
 fx:(B,J,t)=>{if(t>=106&&t<114){for(let x=0;x<CW;x++)if((x+t)%9<7-(t-106)*.6)B.set(x,FL-14,'#ffffff',4)}}});
mv({f:'red2',id:'r2_thrust',n:'抜き突き',bg:'red',len:140,cap:'目が赤く光ったら、鞘から抜きざまに一直線の突き。重い。',why:'居合は横に斬るもの、という思いこみを崩す。光の色（赤）だけは嘘をつかない。',
 keys:[K(0,R2S),K(14,Object.assign({},R2S,{cr:5,lean:.2})),K(41,Object.assign({},R2S,{cr:5,lean:.2})),K(42,{ua:3.1,fa:3.12,sw:3.14,ua2:2.8,fa2:2.9,x:-52,lean:.3,ff:-15,fb:10,sheath:0,cr:4},'snap'),K(80,{ua:3.1,fa:3.12,sw:3.14,ua2:2.8,fa2:2.9,x:-52,lean:.3,ff:-15,fb:10,sheath:0,cr:4}),K(81,R2S,'snap'),K(140,R2S)],
 cues:[{t:14,col:'r',at:J=>add(J.head,[-3,0])}],hits:[42],hitCol:'r',
 fx:(B,J,t)=>{if(t>=42&&t<50&&J.tip)for(let x=Math.round(J.tip[0]);x<EXX;x++)if((x+t)%4)B.set(x,Math.round(J.tip[1]),'#ffb0a0',4)}});

/* ===== 赤い騎士：構え、返し斬り、フェイントを見抜く、残心の追い打ち =====
   主人公が押した瞬間を、主人公の姿勢（heroP）で見せる */
const HG={ua:2.6,fa:-2.2,sw:-1.65,cr:1.5,lean:-.05};   /* まもる（ガード） */
const HA={ua:3.0,fa:2.7,sw:2.4,x:-14,lean:.3,ff:-9,fb:6}; /* こうげき（斬りかかる） */
const RKA={ua:1.0,fa:.5,sw:.35,ua2:1.1,fa2:.7,cr:3.5,lean:-.05,ff:-10,fb:8}; /* 返しの構え：剣を後ろへ引き、剣先を外す */
mv({f:'red',id:'r_kamae',n:'返しの構え',bg:'red',len:120,keys:[K(0,RKA),K(120,RKA)],
 cap:'剣を後ろへ引き、剣先を相手から外して、腰を落として待つ。この構えのあいだに斬りかかると、返される。待てば、構えを解いて攻めてくる。',why:'剣先を向けない＝誘い。居合のおかしらで覚えた「構え中に斬ると返される」を、赤い騎士は剣を隠す形でやる。'});
mv({f:'red',id:'r_counter',n:'返し斬り',bg:'red',len:140,heroP:t=>t>=14&&t<30?HA:null,
 cap:'返しの構えに斬りかかると、片手で払われ、すぐに赤い光。いつもの間で返し斬りが来る。弾けば「居合返し」。',why:'返し斬りも、合図から当たりまでの間は同じ。だから、斬りかかってしまっても、読めば返せる。',
 keys:[K(0,RKA),K(20,RKA),K(26,{ua:2.6,fa:-2.3,sw:-2.2,ua2:1.0,fa2:2.0,cr:2}),K(32,R8),K(58,R8),K(60,RCUT,'in'),K(90,RCUT),K(130,RKA)],
 cues:[{t:32,col:'r'}],hits:[60],hitCol:'r',trails:[[57,62,'r']],
 fx:(B,J,t)=>{if(t>=24&&t<32&&J.tip)spark(B,Math.round(J.tip[0]),Math.round(J.tip[1]),t-24,'w')}});
mv({f:'red',id:'r_seefeint',n:'フェイントを見抜かれる',bg:'red',len:140,heroP:t=>t>=28&&t<44?HG:null,
 cap:'紫の輪（ふり）のときに、まもるを押してしまうと、見抜かれる。すぐに赤い光、いつもの間で本物の一撃。打ち合いの中のふりは別。',why:'剣を極めた者は、相手が構えた瞬間を逃さない。ふりは「待つ」ことを試す。押せば、その迷いを斬られる。',
 keys:[K(0,RI),K(18,RI),K(22,Object.assign({},RI,{cr:2.6,lean:.06})),K(30,RI),K(34,R8),K(60,R8),K(62,RCUT,'in'),K(92,RCUT),K(132,RI)],
 cues:[{t:20,col:'p',at:J=>add(J.head,[-3,0])},{t:34,col:'r'}],hits:[62],hitCol:'r',trails:[[59,64,'r']],
 fx:(B,J,t)=>{if(t>=30&&t<36)B.set(J.head[0]-4,J.head[1],'#ffffff',4)}});
mv({f:'red',id:'r_zanpunish',n:'残心に手を出す',bg:'red',len:150,heroP:t=>t>=56&&t<72?HA:null,
 cap:'残心の最中に、こうげき・まもる・かいふく・まほうのどれかを押すと、もう一撃来る。赤い光、いつもの間で。待てば、構えを解く。',why:'残心は、すきではない。何かをしようとした瞬間が、いちばん危ない。',
 keys:[K(0,RI),K(12,R8),K(28,R8),K(40,Object.assign({},RCUT,{sw:2.2,ua:2.6,fa:2.3}),'in'),K(60,Object.assign({},RCUT,{sw:2.2,ua:2.6,fa:2.3})),K(66,Object.assign({},RCUT,{ua:2.0,fa:-2.6,sw:-2.4})),K(92,Object.assign({},RCUT,{ua:2.0,fa:-2.6,sw:-2.4})),K(94,Object.assign({},RCUT,{ua:3.1,fa:3.0,sw:2.9,x:-48}),'in'),K(120,Object.assign({},RCUT,{ua:3.1,fa:3.0,sw:2.9,x:-48})),K(146,RI)],
 cues:[{t:12,col:'w'},{t:66,col:'r'}],hits:[40,94],trails:[[36,42,'w'],[91,96,'r']]});
mv({f:'red2',id:'r2_seefeint',n:'フェイントを見抜かれる（本気）',bg:'red',len:150,heroP:t=>t>=30&&t<46?HG:null,
 cap:'紫の輪のときに、まもるを押してしまうと、すぐに目が赤く光る。抜きざまに斬り下ろし、赤い角ばった軌跡を残す。いつもの間で来る。',why:'迷いを見抜いたときだけ、居合ではなく、赤い騎士のころの重い斬り下ろしで来る。赤い角ばった軌跡は「見抜かれた」印。',
 keys:[K(0,R2S),K(16,Object.assign({},R2S,{cr:5.2,lean:.22})),K(22,R2S),K(34,Object.assign({},R8,{sheath:0})),K(58,Object.assign({},R8,{sheath:0})),K(62,Object.assign({},RCUT,{x:-46,sheath:0}),'in'),K(96,Object.assign({},RCUT,{x:-46,sheath:0})),K(130,R2S),K(150,R2S)],
 cues:[{t:16,col:'p',at:J=>add(J.head,[-3,0])},{t:34,col:'r'}],hits:[62],hitCol:'r',trails:[[58,64,'r']]});

/* ===== 本気の赤い騎士：居合以外の技。弧の技と直線の技でメリハリをつける ===== */
const R2D={ua:1.95,fa:2.7,sw:3.5,ua2:1.5,fa2:2.3,sheath:0,cr:3,lean:.15};
mv({f:'red2',id:'r2_moon',n:'満月（弧）',bg:'red',len:140,cap:'鞘から抜いて頭上へ大きく振りかぶり、剣先が白く光る。大きな円を描いて振り下ろす。見るのは剣先。',why:'居合ばかりの中に混ざる、読みやすい一撃。緊張の続く本気の戦いの中の「緩」。',
 keys:[K(0,R2S),K(10,R2D),K(14,{ua:-2.6,fa:-2.2,sw:.2,sheath:0,cr:2,lean:-.1}),K(42,{ua:3.0,fa:2.6,sw:2.1,x:-46,lean:.3,ff:-13,fb:9,sheath:0},'in'),K(70,{ua:3.0,fa:2.6,sw:2.1,x:-46,lean:.3,ff:-13,fb:9,sheath:0}),K(100,R2D),K(130,R2S)],
 cues:[{t:14,col:'w'}],hits:[42],trails:[[34,46,'w',0,'arc']]});
mv({f:'red2',id:'r2_tsubame',n:'つばめ返し（弧が二つ）',bg:'red',len:150,cap:'白く光ったら、上からの円弧、続けて下からの円弧。2撃の間はふつう（タン・タン）。見るのは剣先。',why:'円の技を二つ、向きを逆にしてつなぐ。二撃目の光は、一撃目の終わりに出る。',
 keys:[K(0,R2S),K(10,R2D),K(14,R8),K(42,Object.assign({},RCUT,{x:-46}),'in'),K(46,Object.assign({},RCUT,{x:-46,ua:2.4,fa:2.0,sw:1.6})),K(56,Object.assign({},RCUT,{x:-46,ua:2.2,fa:-2.6,sw:-2.2}),'in'),K(84,Object.assign({},RCUT,{x:-46,ua:2.2,fa:-2.6,sw:-2.2})),K(140,R2S)],
 cues:[{t:14,col:'w'},{t:28,col:'w'}],hits:[42,56],trails:[[36,44,'w',0,'arc'],[49,58,'w',0,'arc']]});
mv({f:'red2',id:'r2_juji',n:'十文字（タタン・重い）',bg:'red',len:150,cap:'抜いて剣を脇に引き、目が赤く光る。横一文字に薙いで、間を置かずに真上から唐竹割り。赤い角ばった軌跡が十字に残る。2撃とも重く、間が短い（タタン）。',why:'赤い角ばった軌跡は「重い一撃」の印。横と縦、二本の赤い線が交わって十字になる。弾き切れば、二度大きく返せる。',
 keys:[K(0,R2S),K(10,Object.assign({},RW,{sheath:0,cr:4})),K(38,Object.assign({},RW,{sheath:0,cr:4.5,x:4})),K(42,{ua:3.0,fa:3.0,sw:3.0,ua2:2.6,fa2:2.8,x:-44,lean:.25,ff:-13,fb:9,cr:4,sheath:0},'in'),K(44,{ua:-2.2,fa:-1.7,sw:-1.3,x:-44,lean:-.05,cr:3,sheath:0}),K(50,{ua:2.8,fa:2.5,sw:2.0,x:-48,lean:.35,ff:-13,fb:9,cr:5,sheath:0},'in'),K(84,{ua:2.8,fa:2.5,sw:2.0,x:-48,lean:.35,ff:-13,fb:9,cr:5,sheath:0}),K(144,R2S)],
 cues:[{t:14,col:'r'},{t:22,col:'r'}],hits:[42,50],hitCol:'r',trails:[[38,43,'r'],[45,51,'r']]});
mv({f:'red2',id:'r2_pierce',n:'貫き（直線・重い）',bg:'red',len:130,cap:'剣先をこちらに向けたまま、赤く光る。一直線に、遠くから貫いてくる。重い。',why:'直線の技の中でいちばん重いもの。剣先が一点しか動かないので、軌跡は短い一本の線。',
 keys:[K(0,R2S),K(10,{ua:1.2,fa:3.0,sw:3.14,sheath:0,x:8,cr:4}),K(38,{ua:1.2,fa:3.0,sw:3.14,sheath:0,x:10,cr:4.5,lean:-.1}),K(42,{ua:3.1,fa:3.12,sw:3.14,ua2:2.8,fa2:2.9,x:-56,lean:.3,ff:-15,fb:10,sheath:0},'in'),K(80,{ua:3.1,fa:3.12,sw:3.14,ua2:2.8,fa2:2.9,x:-56,lean:.3,ff:-15,fb:10,sheath:0}),K(124,R2S)],
 cues:[{t:14,col:'r'}],hits:[42],hitCol:'r',trails:[[38,44,'r',0,'line']]});
/* 打ち合い：溜めは大きな弧、詰めはまっすぐな線 */
const RLY=(f,id,n,bg,seq,cap,why,extra)=>{const ks=[K(0,f==='red2'?R2S:RI)],cues=[],hits=[],trs=[];let t=10;
 seq.forEach((g,i)=>{const arc=g==='tame';cues.push({t,col:'g'});const wind=arc?{ua:-2.6,fa:-2.2,sw:.2,cr:2,lean:-.1,sheath:0}:{ua:1.2,fa:3.0,sw:3.14,x:2,cr:3,sheath:0};const gap=arc?40:20;const hit=t+gap;
  ks.push(K(t,wind));ks.push(K(hit-2,wind));ks.push(K(hit,arc?{ua:3.0,fa:2.6,sw:2.1,x:-30,lean:.3,ff:-12,fb:9,sheath:0}:{ua:3.1,fa:3.12,sw:3.14,x:-30,lean:.25,ff:-12,fb:9,sheath:0},'in'));hits.push(hit);trs.push([hit-(arc?8:4),hit+2,'g',0,arc?'arc':'line']);t=hit+10});
 ks.push(K(t+20,f==='red2'?R2S:RI));return mv(Object.assign({f,id,n,bg,len:t+30,cap,why,keys:ks,cues,hits,hitCol:'g',trails:trs},extra||{}))};
RLY('red2','r2_rallyx','打ち合い：溜めは弧、詰めは線','red',['tume','tame','tume','tume','tame'],'金に光ったら打ち合い。長く溜めた合は、頭上から大きな弧。間の短い「詰め」の合は、まっすぐな突き。軌跡の形で、次の合の間がわかる。','溜めと詰めで、剣の通る道まで変わる。耳（間）と目（軌跡）の両方で、打ち合いのリズムを読ませる。');
RLY('red','r_rallyx','打ち合い：溜めは弧、詰めは線','red',['tume','tame','tume'],'金に光ったら打ち合い。溜めの合は大きな弧、詰めの合はまっすぐな突き。','本気の五合の前に、三合で同じ決まりを見せておく。');

mv({f:'red2',id:'r2_silent',n:'無音の居合（光らない）',bg:'red',len:140,cap:'合図の光は出ない。腰の鞘から「チャキ」と鯉口を切る音がする。その音から、いつもの間で来る。見るのは光ではなく、鞘と音。',why:'光らない攻撃は、ゆうれいの中ボスで先に教わっている。光に頼りきったプレイヤーへの、剣の達人からの試験。',
 keys:[K(0,R2S),K(14,Object.assign({},R2S,{cr:4.8})),K(41,Object.assign({},R2S,{cr:4.8})),K(42,IAI,'snap'),K(90,IAI),K(91,R2S,'snap'),K(140,R2S)],hits:[42],
 fx:(B,J,t)=>{if(t>=14&&t<30){/* 音の輪：光ではない（灰色の弧が三重に広がる） */const c=add(J.hip,[-1*J.k,1*J.k]);for(let q=0;q<3;q++){const r=3+(t-14)*1.1+q*4;if(r>22)continue;for(let a=-.9;a<=.9;a+=.12){B.set(c[0]-Math.cos(a)*r,c[1]+Math.sin(a)*r,q?'#6a6278':'#a8a0b0',4);B.set(c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r,q?'#6a6278':'#a8a0b0',4)}}}
  if(t>=42&&t<50){for(let x=0;x<CW;x++)if((x+t)%9<7-(t-42)*.6)B.set(x,FL-14,'#d8dce8',4)}}});

/* 本気の返しの構え：鯉口を切り、刃が少しだけ見えている＝もう抜いている */
const R2K={ua:1.75,fa:2.3,sw:null,sheath:1,ua2:1.3,fa2:2.4,cr:5.5,lean:.25,ff:-13,fb:9,hd:.12};
const bladePeek=(B,J)=>{const k=J.k,h=J.hip,a=add(h,[-1*k,1*k]);for(let i=0;i<4;i++){B.set(a[0]-2*k-i*1.1*k,a[1]+1*k+i*.4*k,i%2?'#ffffff':'#d8dce8',2)}};
mv({f:'red2',id:'r2_kamae',n:'返しの構え（本気）',bg:'red',len:120,keys:[K(0,R2K),K(120,R2K)],fx:(B,J)=>bladePeek(B,J),
 cap:'いつもより深く腰を落とし、鯉口を切っている。鞘の口から、刃が少しだけ見えている。このあいだに斬りかかると、返される。',why:'刃がもう見えている＝もう抜いている。居合の構えとの違いは、鞘の口の銀色だけ。見る場所を一つに絞る。'});
mv({f:'red2',id:'r2_counter',n:'返し斬り（本気）',bg:'red',len:140,heroP:t=>t>=14&&t<30?HA:null,
 cap:'返しの構えに斬りかかると、鞘ごと受け止められ、すぐに目が赤く光る。抜きざまの斬り下ろしが、赤い角ばった軌跡を残して来る。弾けば居合返し。',why:'受けるのは剣ではなく鞘。もう抜く準備ができているから、受けた手のまま斬れる。',
 keys:[K(0,R2K),K(20,R2K),K(26,Object.assign({},R2K,{lean:.05,cr:4.5})),K(32,Object.assign({},R8,{sheath:0})),K(58,Object.assign({},R8,{sheath:0})),K(60,Object.assign({},RCUT,{x:-46,sheath:0}),'in'),K(92,Object.assign({},RCUT,{x:-46,sheath:0})),K(130,R2K)],
 cues:[{t:32,col:'r',at:J=>add(J.head,[-3,0])}],hits:[60],hitCol:'r',trails:[[56,62,'r']],
 fx:(B,J,t)=>{if(t<26)bladePeek(B,J);if(t>=24&&t<32)spark(B,Math.round(J.hip[0]-4),Math.round(J.hip[1]-2),t-24,'w')}});

/* ===== 強さの順を整える：後の者に技と読み方を足す ===== */
/* 門のぬし：黒い門番より上に。リズムの軸を足す */
mv({f:'lord',id:'l_unlock',n:'解錠（タン・タタ）',bg:'lord',len:130,cap:'鍵を引いて白く光る。突き刺して、すぐに二度ひねる。突きのあとの二撃は間が短い（タン・タタ）。最後のひねりだけ赤い光。',why:'鍵を差しこんで回す動きを、そのままリズムにした。三撃目が重いので、最後まで気を抜けない。',
 keys:[K(0,LI),K(18,LBK),K(34,LBK),K(46,LTH,'in'),K(52,Object.assign({},LTH,{fa:-3.0,sw:3.0})),K(56,Object.assign({},LTH,{fa:3.0,sw:3.3})),K(60,Object.assign({},LTH,{fa:-3.0,sw:3.0})),K(64,Object.assign({},LTH,{fa:3.0,sw:3.3,x:-18})),K(100,LTH),K(124,LI)],
 cues:[{t:18,col:'w'},{t:28,col:'w'},{t:36,col:'r'}],hits:[46,56,64],trails:[[42,48,'w']],
 fx:(B,J,t)=>{for(const h of[56,64])if(t>=h&&t<h+6&&J.tip)star(B,Math.round(J.tip[0]+5),Math.round(J.tip[1]),[3,2,3,2,1,1][t-h],h===64?'r':'w')}});

/* 赤い門のぬし：赤い騎士の決まり（見抜く・返す・残心）を受けつぐ */
const FWR=(id,src,extra)=>{const m=MV.find(x=>x.id===src);const o=Object.assign({},m,{f:'fallen',id,bg:'hole'},extra||{});const post0=o.post,pp0=o.pp;o.pp=(P,t)=>{if(pp0)pp0(P,t);glitch(P,t)};o.post=(B,J,t,S)=>{if(post0)post0(B,J,t,S);water(B,t)};return mv(o)};
FWR('f_seefeint','r_seefeint',{n:'フェイントを見抜かれる',cap:'紫の輪でまもるを押すと、見抜かれる。赤い光、いつもの間で本物。左腕の触手が、そのあとを追ってくる。',why:'のまれても、剣の目は残っている。見抜く決まりは赤い騎士と同じ。',
 cues:[{t:20,col:'p',at:J=>add(J.head,[-3,0])},{t:34,col:'r'},{t:48,col:'w',at:J=>J.hdB}],hits:[62,76],hitCol:'r',
 fx:(B,J,t)=>{if(t>=72&&t<84){const u=t<76?(t-72)/4:1-(t-76)/8;tentacle(B,J.hdB,add(J.hdB,[-10*u,-8]),[lerp(J.hdB[0],HXX+10,u),lerp(J.hdB[1],FL-12,u)],1.6,.5,true)}}});
FWR('f_counter','r_counter',{n:'返し斬り',cap:'返しの構えに斬りかかると、触手の腕で受け止められ、赤い光の返し斬り。弾けば居合返し。',why:'受けるのは剣でも鞘でもなく、くらやみの腕。剣の型に、のまれた体が混ざる。',keys:MV.find(x=>x.id==='r_counter').keys});
FWR('f_zanpunish','r_zanpunish',{n:'残心に手を出す',cap:'残心の最中に、こうげき・まもる・かいふく・まほうのどれかを押すと、もう一撃。赤い光。','why':'剣を極めた者の残心は、のまれても消えない。'});

/* 第二形態：いちばん手ごわく。読み方の軸を重ねる */
mv({f:'fallen2',id:'f2_mirror',n:'水面の先読み',bg:'hole',len:130,cap:'水面の映り姿が、本体より先に動く。合図の白い光は、水の中の剣先に出る。見るのは本体ではなく水面。',why:'映り姿は、のまれる前の赤い騎士。剣の型は、映り姿のほうが先に知っている。',
 keys:[K(0,F2I),K(14,R8),K(38,R8),K(42,RCUT,'in'),K(70,RCUT),K(124,F2I)],cues:[{t:14,col:'w',at:J=>[EXX-6,FL+16]}],hits:[42],trails:[[39,44,'w']],
 post:(B,J,t)=>{water(B,t);const M=MV.find(m=>m.id==='f2_mirror'),base=Object.assign({},PDEF,SPEC.red.pose);reflection(B,t,'red',poseAt0(M,Math.min(t+10,129),base),EXX)}});
mv({f:'fallen2',id:'f2_fingers',n:'アーチの奥の指',bg:'hole',len:150,cap:'門のアーチの内側から、三本の指が出てくる。光った指の順に来て、最後に銀の剣。4撃。',why:'暗い門のぬしの「門の向こうの指」と同じもの。彼の背中の門も、同じ向こう側につながっている。',
 keys:[K(0,F2I),K(50,F2I),K(56,R8),K(84,R8),K(88,RCUT,'in'),K(110,RCUT),K(144,F2I)],
 cues:[0,1,2].map(i=>({t:14+i*10,col:'w',at:J=>{const c=add(J.sc,[4*J.k,-4*J.k]);return add(c,dir(Math.PI*(1.15+i*.35),12*J.k))}})).concat([{t:60,col:'w'}]),hits:[42,52,62,88],trails:[[85,90,'w']],
 fx:(B,J,t)=>{for(let i=0;i<3;i++){const imp=42+i*10,d=t-imp,c=add(J.sc,[4*J.k,-4*J.k]),base=add(c,dir(Math.PI*(1.15+i*.35),12*J.k));if(t<10||d>20)continue;const u=d<-8?.1:d<0?.1+(d+8)/8*.9:Math.max(.1,1-d/20);const tip=[lerp(base[0],HXX+8,u),lerp(base[1],FL-12-i*2,u)];
   for(let s=0;s<=1;s+=.03){const x=lerp(base[0],tip[0],s),y=lerp(base[1],tip[1],s)-Math.sin(s*3.14)*6*u,r=2-s;for(let yy=-r;yy<=r;yy++)B.set(x,y+yy,(Math.abs(s-.33)<.03||Math.abs(s-.66)<.03)?'#2a2030':yy<-r+1?'#b0a8b8':'#7a7088',1)}B.set(tip[0],tip[1],'#e8e0d0',2)}},
 post:(B,J,t)=>{water(B,t);reflection(B,t,'red',J.P||{},EXX)}});
mv({f:'fallen2',id:'f2_silent',n:'光らない核の拍',bg:'hole',len:150,cap:'胸の核が3回、光らずに脈打つ（ドクン・ドクン・ドクン）。音の輪だけが広がる。その次の拍で、銀の剣。',why:'「光らない」と「拍」の二つの読み方を重ねた。どちらも先に教わっているが、同時に来るのはここだけ。',
 keys:[K(0,F2I),K(14,R8),K(52,R8),K(56,RCUT,'in'),K(90,RCUT),K(140,F2I)],hits:[56],trails:[[53,58,'w']],
 pp:(P,t)=>{let c=0;for(const b of[20,32,44]){const d=t-b;if(d>=0&&d<8)c=Math.max(c,(1-d/8)*.8)}P.core=c},
 fx:(B,J,t)=>{for(const b of[20,32,44]){const d=t-b;if(d>=0&&d<14){const c=add(J.sc,[0,5*J.k]);for(let a=0;a<40;a++){const th=a/40*6.28,r=4+d*2;if(a%2)B.set(c[0]+Math.cos(th)*r,c[1]+Math.sin(th)*r,d<7?'#a8a0b0':'#6a6278',4)}}}},
 post:(B,J,t)=>{water(B,t);reflection(B,t,'red',J.P||{},EXX)}});
mv({f:'fallen2',id:'f2_juji',n:'十文字と触手（タタン・タン）',bg:'hole',len:150,cap:'目が赤く光る。横一文字から唐竹割り（赤い角ばった軌跡、タタン）。最後に輪の触手が一本（白、タン）。',why:'本気の赤い騎士の十文字に、門の触手が一撃足される。三撃目だけ軽いので、「最後まで赤」と思いこむと崩れる。',
 keys:[K(0,F2I),K(10,Object.assign({},RW,{cr:4})),K(38,Object.assign({},RW,{cr:4.5,x:4})),K(42,{ua:3.0,fa:3.0,sw:3.0,ua2:2.6,fa2:2.8,x:-36,lean:.25,ff:-13,fb:9,cr:4},'in'),K(44,{ua:-2.2,fa:-1.7,sw:-1.3,x:-36,lean:-.05,cr:3}),K(50,{ua:2.8,fa:2.5,sw:2.0,x:-40,lean:.35,ff:-13,fb:9,cr:5},'in'),K(90,{ua:2.8,fa:2.5,sw:2.0,x:-40,lean:.35,ff:-13,fb:9,cr:5}),K(144,F2I)],
 cues:[{t:14,col:'r'},{t:22,col:'r'},{t:36,col:'w',at:J=>add(J.sc,[4*J.k,-22*J.k])}],hits:[42,50,64],trails:[[38,43,'r'],[45,51,'r']],
 fx:(B,J,t)=>{if(t>=58&&t<76){const u=t<64?(t-58)/6:1-(t-64)/12,c=add(J.sc,[4*J.k,-22*J.k]);tentacle(B,c,[lerp(c[0],60,u),c[1]-6],[lerp(c[0],HXX+8,u),lerp(c[1],FL-12,u)],2,.5,true)}},
 post:(B,J,t)=>{water(B,t);reflection(B,t,'red',J.P||{},EXX)}});
RLY('fallen2','f2_rallyx','五合：溜めは弧、詰めは線','hole',['tume','tame','tume','tame','tume'],'金に光ったら打ち合い。五合。溜めは大きな弧、詰めはまっすぐな突き。水面の映り姿も、同じ型で剣を振る。','剣だけは、最後まで赤い騎士のもの。打ち合いの決まりも同じ。',{post:(B,J,t)=>{water(B,t);reflection(B,t,'red',J.P||{},EXX)}});

/* 強さの順を整える（2）：本気と第二形態にも、見抜く・残心の決まりを受けつがせる */
const CL=(f,id,src,extra,kmap)=>{const m=MV.find(x=>x.id===src);const o=Object.assign({},m,{f,id},extra||{});if(kmap)o.keys=m.keys.map(k=>K(k.t,kmap(k.p),k.e));return mv(o)};
CL('red2','r2_zanpunish','r_zanpunish',{n:'残心に手を出す（本気）',cap:'抜いて振り抜いたあとの残心。ここで何かを押すと、もう一撃（赤）。待てば、鞘に納める。',why:'本気になっても、残心は残る。むしろ、いちばん鋭い。'},p=>Object.assign({},p,{sheath:0}));
const W2=(B,J,t)=>{water(B,t);reflection(B,t,'red',J.P||{},EXX)};
CL('fallen2','f2_seefeint','r_seefeint',{n:'フェイントを見抜かれる',bg:'hole',post:W2,cap:'紫の輪でまもるを押すと、見抜かれる。赤い光、本物の斬り下ろし。水面の映り姿も同じく斬る。'});
CL('fallen2','f2_zanpunish','r_zanpunish',{n:'残心に手を出す',bg:'hole',post:W2,cap:'残心の最中に何かを押すと、もう一撃（赤）。待てば構えを解く。'});
mv({f:'fallen2',id:'f2_dfeint',n:'水面の二重フェイント',bg:'hole',len:150,cap:'紫の輪は、本体ではなく水面の映り姿の目に出る。二回とも押さない。三回目、本体の目が赤く光ったら本物。',why:'見る場所（水面）と、押してはいけない（フェイント）の二つを重ねた。映り姿は、もう嘘もつく。',
 keys:[K(0,F2I),K(16,Object.assign({},F2I,{cr:2.6,lean:.06})),K(24,F2I),K(42,Object.assign({},F2I,{cr:2.6,lean:.06})),K(50,F2I),K(70,R8),K(96,R8),K(98,RCUT,'in'),K(124,RCUT),K(146,F2I)],
 cues:[{t:16,col:'p',at:J=>[EXX-6,FL+14]},{t:42,col:'p',at:J=>[EXX-6,FL+14]},{t:70,col:'r',at:J=>add(J.head,[-3,0])}],hits:[98],hitCol:'r',trails:[[95,100,'r']],post:W2});

/* 強さの順を整える（3）：数でも後の者が上になるように */
const IAIS=(y)=>({ua:3.1,fa:3.0+y*.15,sw:3.14+y*.2,ua2:.9,fa2:.6,sheath:0,x:-4,lean:.25,cr:5,ff:-12,fb:9});
mv({f:'red2',id:'r2_three',n:'参段の居合（その場・上中下・タン・タタン）',bg:'red',len:170,cap:'動かずに、その場で三度抜き打つ。刃は飛ぶ斬撃になって、上・中・下の三つの高さで飛んでくる。1撃目のあと少し間があり、2撃目と3撃目は続けて来る（タン・タタン）。',why:'弐の居合は「すれちがって、後ろから」。参段は「その場から、飛ぶ斬撃が三つ」。騎士が動くか動かないかで、ひと目で見分けられる。',
 keys:[K(0,R2S),K(26,Object.assign({},R2S,{cr:5.5})),K(30,IAIS(-1),'snap'),K(40,IAIS(-1)),K(44,Object.assign({},R2S,{cr:5.5}),'snap'),K(58,Object.assign({},R2S,{cr:5.5})),K(60,IAIS(0),'snap'),K(64,IAIS(0)),K(66,IAIS(1),'snap'),K(78,IAIS(1)),K(84,R2S,'snap'),K(170,R2S)],
 cues:[{t:14,col:'w',at:J=>add(J.head,[-3,0])},{t:42,col:'w',at:J=>add(J.head,[-3,0])},{t:50,col:'w',at:J=>add(J.head,[-3,0])}],hits:[42,70,78],
 fx:(B,J,t)=>{/* 飛ぶ斬撃：抜いた瞬間に出て、当たる瞬間にこちらへ届く三日月 */[[30,42,FL-26],[60,70,FL-15],[66,78,FL-5]].forEach(([s,h,y])=>{if(t>=s&&t<h+4){const u=Math.min(1,(t-s)/(h-s)),x=lerp(EXX-14,HXX+6,u);for(let a=-1.1;a<=1.1;a+=.12){const px=x+Math.cos(a)*5-5,py=y+Math.sin(a)*7;B.set(px,py,'#ffffff',4);B.set(px+1,py,'#bfe8ff',4)}for(let k=1;k<4;k++)B.set(x+k*4,y,'#8a90a8',4)}})}});
mv({f:'red2',id:'r2_holdfeint',n:'溜めの中のふり',bg:'red',len:190,cap:'柄に手をかけて長く溜める。途中で一度、紫の輪（ふり）。押さずに待つと、目が白く光って本物の居合。',why:'「待つ」と「押さない」を重ねた。じれた心に、ふりが刺さる。押せば見抜かれる。',
 keys:[K(0,R2S),K(20,Object.assign({},R2S,{cr:5.5,lean:.22})),K(48,Object.assign({},R2S,{cr:5.2,lean:.15})),K(54,Object.assign({},R2S,{cr:5.5,lean:.22})),K(121,Object.assign({},R2S,{cr:5.5,lean:.22})),K(122,IAI,'snap'),K(150,IAI),K(151,R2S,'snap'),K(190,R2S)],
 cues:[{t:48,col:'p',at:J=>add(J.head,[-3,0])},{t:94,col:'w',at:J=>add(J.head,[-3,0])}],hits:[122],
 fx:(B,J,t)=>{if(t>=122&&t<130){for(let x=0;x<CW;x++)if((x+t)%9<7-(t-122)*.6)B.set(x,FL-14,'#ffffff',4)}}});
CL('fallen2','f2_counter','r_counter',{n:'返し斬り',bg:'hole',post:W2,cap:'剣を引いて待つ構えに斬りかかると、アーチの触手が受け止め、赤い光の返し斬り。水面の映り姿も同じく返す。弾けば居合返し。'});
mv({f:'fallen2',id:'f2_silentiai',n:'水の中の無音の居合',bg:'hole',len:140,cap:'光らない。水面の映り姿の鞘から「チャキ」と音の輪が広がる。その音から、いつもの間で、本体が斬る。',why:'「光らない」と「見る場所（水面）」を重ねた。本気の赤い騎士の無音の居合を、映り姿が覚えている。',
 keys:[K(0,F2I),K(14,R8),K(41,R8),K(42,RCUT,'in'),K(80,RCUT),K(134,F2I)],hits:[42],trails:[[39,44,'w',0,'line']],
 fx:(B,J,t)=>{if(t>=14&&t<30){const c=[EXX-4,FL+12];for(let q=0;q<3;q++){const r=3+(t-14)*1.1+q*4;if(r>20)continue;for(let a=-.9;a<=.9;a+=.12){B.set(c[0]-Math.cos(a)*r,c[1]-Math.sin(a)*r*.5,q?'#6a6278':'#a8a0b0',4);B.set(c[0]+Math.cos(a)*r,c[1]-Math.sin(a)*r*.5,q?'#6a6278':'#a8a0b0',4)}}}},post:W2});
CL('fallen','f_silent','r2_silent',{n:'無音の居合',bg:'hole',post:(B,J,t)=>{const f=MV.find(x=>x.id==='r2_silent').fx;water(B,t)},cap:'光らない。腰の鞘から「チャキ」と音。その音から、いつもの間で来る。刃は銀、尾はくらやみ。',why:'本気の赤い騎士の技を、のまれても体が覚えている。'},p=>Object.assign({},p,{sheath:p.sheath}));
CL('fallen2','f2_tsubame','r2_tsubame',{n:'つばめ返し（タン・タン）',bg:'hole',post:W2,cap:'白く光ったら、上からの弧、続けて下からの弧。水面の映り姿も同じ弧を描く。'},p=>Object.assign({},p,{sheath:undefined}));

/* 連撃の合図：ゲームと同じく、一撃ごとに28F前の合図を置く（足りないものを補う） */
(()=>{const fix={g_two:'w',dg_two:'w',l_two:'w',l_rev:'w',l2_tri:'w',r_two:'w',r_swap:'w',r_combo4:'w',f_cutten:'w',f_sa:'w',f2_four:'w'};
 for(const id in fix){const m=MV.find(x=>x.id===id);if(!m)continue;m.cues=(m.cues||[]).slice();for(const h of m.hits||[])if(!m.cues.some(c=>c.col!=='p'&&c.t===h-28))m.cues.push({t:h-28,col:fix[id]});m.cues.sort((a,b)=>a.t-b.t)}})();
