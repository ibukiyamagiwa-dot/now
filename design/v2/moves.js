/* ===== 全モーション =====
   f:だれ  n:名前  cap:読み方（プレイヤーは何を見ればいいか）  why:この動きにした理由
   cues:合図の光（t:フレーム col:w白 r赤 p紫 g金）  hits:当たる瞬間  trails:剣の軌跡 */
const K=(t,p,e)=>({t,p,e});
const MV=[];const mv=o=>{MV.push(o);return o};
const sway=(a,b,len,n)=>{const ks=[];for(let i=0;i<=n;i++)ks.push(K(Math.round(len*i/n),i%2?b:a));return ks};
/* 共通の姿勢 */
const X={ua:1.75,fa:-.5,sw:-2.25,ua2:1.4,fa2:-2.5,sw2:-.85};
const KNEEL={kn:1,lean:.35,ua:1.5,fa:1.7,sw:1.45,ua2:1.6,fa2:2.0,hd:-.3};

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
mv({f:'dgate',id:'dg_sweep',n:'マントの触手払い',bg:'gate',len:100,cap:'体を沈めたら、低い払い。マントの裾が先に開く。',why:'人の剣では届かない「低さ」で、のまれていることを伝える。',
 keys:[K(0,X),K(16,Object.assign({},X,{cr:4,lean:-.1})),K(44,Object.assign({},X,{cr:4,lean:.2,x:-6}),'in'),K(90,X)],cues:[{t:16,col:'w',at:J=>add(J.hip,[8,10])}],hits:[44],
 fx:(B,J,t)=>{if(t>=36&&t<56){const u=Math.min(1,(t-36)/8),k=J.k,r=add(J.hip,[6*k,8*k]);tentacle(B,r,[lerp(r[0]+10,60,u),FL-2],[lerp(r[0],HXX+6,u),FL-6],2.4*k,.6*k,true)}}});
mv({f:'dgate',id:'dg_feint',n:'手の触手フェイント',bg:'gate',len:100,cap:'紫の輪が出たら、ふりだけ。手から触手がのびかけて、止まる。押したら負け。',why:'剣ではなく「手」がのびる＝人の動きじゃないから、止まっても不自然に見えない。',
 keys:[K(0,X),K(16,{ua:2.9,fa:3.0,sw:-1.5,x:-2}),K(36,{ua:2.9,fa:3.0,sw:-1.5,x:-2}),K(70,X)],cues:[{t:16,col:'p',at:J=>J.hdF}],
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
 keys:[K(0,LI),K(14,Object.assign({},LI,{lean:-.15,x:3})),K(40,{kn:1,lean:.3,ua:2.2,fa:1.3,sw:1.57,ua2:2.0,fa2:1.4,hd:-.4},'out'),K(140,{kn:1,lean:.3,ua:2.2,fa:1.3,sw:1.57,ua2:2.0,fa2:1.4,hd:-.4})],
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
 keys:[K(0,L2I),K(30,Object.assign({},L2I,{door:0,lean:-.2})),K(70,{door:0,kn:1,lean:.5,ua:2.2,fa:1.3,sw:1.57,hd:-.6,ten:[-.8,-.8,-.8]},'out'),K(150,{door:0,kn:1,lean:.5,ua:2.2,fa:1.3,sw:1.57,hd:-.6,ten:[-.8,-.8,-.8]})],
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
mv({f:'red',id:'r_zanshin',n:'残心',bg:'red',len:130,cap:'振り抜いたあと、長く止まる。この間が反撃のすき。',why:'強い者ほど、斬ったあとも気を抜かない。止まって見えるが、ここが唯一のすき。',
 keys:[K(0,RI),K(14,R8),K(28,R8),K(40,Object.assign({},RCUT,{sw:2.2,ua:2.6,fa:2.3}),'in'),K(100,Object.assign({},RCUT,{sw:2.2,ua:2.6,fa:2.3})),K(126,RI)],
 cues:[{t:12,col:'w'}],hits:[40],trails:[[36,42,'w']],fx:(B,J,t)=>{if(t>=50&&t<96&&(t/6|0)%2)B.set(J.head[0]-6,J.head[1]-8,'#ffd040',4)}});
mv({f:'red',id:'r_rage',n:'本気を出す：マントを斬る',bg:'red',len:180,noHero:true,cap:'自分のマントを斬り落とし、剣を鞘に納める。目の光が白くなる。',why:'飾りを捨てる＝本気。鞘に納める＝次は居合。白い目＝「もう光でしか見えない速さ」の予告。',
 fAt:t=>t<120?'red':'red2',
 keys:[K(0,RI),K(20,{ua:-1.0,fa:-.4,sw:.3}),K(30,{ua:2.4,fa:1.2,sw:.2,capeOff:0},'in'),K(60,{ua:2.4,fa:1.2,sw:.2,capeOff:1}),K(90,{ua:1.7,fa:2.2,sw:0,cr:2}),K(118,{ua:1.7,fa:2.2,sw:0,cr:3}),K(120,{ua:1.7,fa:2.2,sw:null,sheath:1,ff:-11,fb:8,cr:4,lean:-.15}),K(180,{ua:1.7,fa:2.2,sw:null,sheath:1,ff:-11,fb:8,cr:4,lean:-.15})],
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
mv({f:'red2',id:'r2_last',n:'最期：立ったまま',bg:'red',len:160,noHero:true,cap:'剣を床に突き立て、それに手を添えたまま立ち尽くす。倒れない。',why:'剣を極めた者は、倒れずに終わる。だからこそ、次に「のまれた」姿が出たときの痛みが大きい。',
 keys:[K(0,Object.assign({},RI,{sheath:0})),K(30,{ua:2.3,fa:1.4,sw:1.57,ua2:2.1,fa2:1.2,sheath:0,cr:3,hd:-.35,lean:.1},'out'),K(160,{ua:2.3,fa:1.4,sw:1.57,ua2:2.1,fa2:1.2,sheath:0,cr:3,hd:-.35,lean:.1})],
 fx:(B,J,t)=>{if(t>60){/* 白い目の光が、ゆっくり消える */const a=Math.max(0,1-(t-60)/60);if(a>0&&(t%Math.max(2,Math.round(10-a*8))<5))B.set(J.head[0]-3,J.head[1],'#ffffff',4)}}});

/* ---------- 赤い門のぬし ---------- */
const FI={ua:1.95,fa:2.7,sw:3.5,ua2:1.3,fa2:2.0};
const glitch=(P,t)=>{const g=(t*7919)%97;if(g<6){P.x=(P.x||0)+(g%2?2:-2);P.hd=(P.hd||0)+.25}};
/* 黒い水面：穴の底の床。体の下半分を水面で隠す */
const water=(B,t)=>{for(let x=0;x<CW;x++){const w=Math.sin(x*.3+t*.1)>.6;B.set(x,FL,w?'#3a2a50':'#1a1428',6);B.set(x,FL+1,'#0c0a14',6)}};
mv({f:'fallen',id:'f_rise',n:'登場：穴の底の水から',bg:'hole',len:160,noHero:true,cap:'黒い水面から、赤い騎士がゆっくり立ち上がる。構えは、あの正眼のまま。',why:'「同じ構え」で出てくるのがいちばん怖い。剣の型は体が覚えている。',
 keys:[K(0,Object.assign({},FI,{lift:-46,lean:.4,hd:-.6})),K(100,Object.assign({},FI,{lift:0,lean:.3,hd:-.5}),'io'),K(120,FI,'out'),K(160,FI)],
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
 post:(B,J,t)=>{water(B,t);reflection(B,t,'red',{},EXX)}});
mv({f:'fallen2',id:'f2_ring',n:'門の輪の触手',bg:'hole',len:140,cap:'輪の赤い目が一つずつ光る。光った順に、輪から触手が来る。',why:'門のぬしの「目の順」の総まとめ。ここまで覚えたルールが最後に全部効く。',
 keys:[K(0,F2I),K(130,F2I)],cues:[0,1,2].map(i=>({t:14+i*10,col:'w',at:J=>{const c=add(J.sc,[4*J.k,-4*J.k]),a=Math.PI+(2+i*4)/24*Math.PI;return add(c,dir(a,19*J.k))}})),hits:[42,52,62],
 fx:(B,J,t)=>{for(let i=0;i<3;i++){const imp=42+i*10,d=t-imp;if(d>=-8&&d<12){const u=d<0?(d+8)/8:1-d/12,c=add(J.sc,[4*J.k,-4*J.k]),a=Math.PI+(2+i*4)/24*Math.PI,p=add(c,dir(a,19*J.k));tentacle(B,p,[lerp(p[0],60,u),p[1]-14],[lerp(p[0],HXX+8,u),lerp(p[1],FL-12,u)],2,.5,true)}}},
 post:(B,J,t)=>{water(B,t);reflection(B,t,'red',{},EXX)}});
mv({f:'fallen2',id:'f2_four',n:'四連撃',bg:'hole',len:150,cap:'白く光ったら四連。剣、剣、触手、最後の一撃だけ赤い光で重い。',why:'赤い騎士の二連撃と、ぬしの三連の合体。「二人ぶん」がひとつの体で来る。',
 keys:[K(0,F2I),K(14,R8),K(28,R8),K(40,RCUT,'in'),K(46,Object.assign({},RCUT,{ua:2.0,fa:-2.6,sw:-2.4})),K(52,Object.assign({},RCUT,{ua:3.1,fa:3.0,sw:2.9}),'in'),K(58,Object.assign({},RCUT,{ua:3.1,fa:3.0,sw:2.9,ua2:3.0,fa2:3.1})),K(70,R8),K(76,RCUT,'in'),K(100,RCUT),K(140,F2I)],
 cues:[{t:12,col:'w'},{t:48,col:'r'}],hits:[40,52,62,76],trails:[[37,42,'w'],[49,54,'w'],[73,78,'r']],
 fx:(B,J,t)=>{if(t>=58&&t<70){const u=t<62?(t-58)/4:1-(t-62)/8;tentacle(B,J.hdB,add(J.hdB,[-10*u,-8]),[lerp(J.hdB[0],HXX+10,u),lerp(J.hdB[1],FL-12,u)],1.8,.5,true)}},
 post:(B,J,t)=>{water(B,t);reflection(B,t,'red',{},EXX)}});
mv({f:'fallen2',id:'f2_core',n:'胸の核：重い一撃',bg:'hole',len:130,cap:'胸の核が赤く光る。輪の触手がすべて前に倒れてくる。重い。',why:'暗い門のぬしの「胸の口」の位置と同じ。胸＝いちばん重い、を最後まで守る。',
 keys:[K(0,F2I),K(16,Object.assign({},F2I,{lean:-.2,cr:1})),K(40,Object.assign({},F2I,{lean:-.2,cr:1})),K(48,Object.assign({},F2I,{lean:.4,x:-10}),'in'),K(80,Object.assign({},F2I,{lean:.4,x:-10})),K(120,F2I)],
 cues:[{t:20,col:'r',at:J=>add(J.sc,[0,9*J.k])}],hits:[48],hitCol:'r',
 fx:(B,J,t)=>{if(t>=20&&t<48&&(t/3|0)%2)glow(B,Math.round(J.sc[0]),Math.round(J.sc[1]+10),4,'r');if(t>=44&&t<60){const u=t<48?(t-44)/4:1-(t-48)/12;for(let i=0;i<4;i++){const p=add(J.sc,[6,-10-i*4]);tentacle(B,p,[lerp(p[0],60,u),p[1]-10],[lerp(p[0],HXX+8,u),lerp(p[1],FL-10-i*3,u)],2,.5,false)}}},
 post:(B,J,t)=>{water(B,t);reflection(B,t,'red',{},EXX)}});
mv({f:'fallen2',id:'f2_rally',n:'五合の打ち合い',bg:'hole',len:180,cap:'金に光ったら打ち合い。五回。水面の赤い騎士も、同じ型で剣を振っている。',why:'本体と映り姿が同じ動きをする＝剣だけは、のまれていない。',
 keys:MV.find(m=>m.id==='r2_rally').keys.map(k=>K(k.t,Object.assign({},k.p,{sheath:0}),k.e)),cues:[0,1,2,3,4].map(i=>({t:14+i*28,col:'g'})),hits:[0,1,2,3,4].map(i=>26+i*28),hitCol:'g',
 fx:(B,J,t)=>{if(J.tip&&t>=14&&t<150)glow(B,Math.round(J.tip[0]),Math.round(J.tip[1]),3,'g')},
 post:(B,J,t)=>{water(B,t);const base=Object.assign({},PDEF,SPEC.red.pose);reflection(B,t,'red',poseAt0(MV.find(m=>m.id==='f2_rally'),t,base),EXX)}});
mv({f:'fallen2',id:'f2_end',n:'とどめ：映り姿と入れかわる',bg:'hole',len:200,noHero:true,cap:'打ち返しの白黒の一瞬に、本体と水面の映り姿が入れかわる。くらやみは水に沈み、赤い騎士が水面に立つ。',why:'白黒赤のとどめ演出の「反転」を、物語の反転にも使う。勝った瞬間に、救えたことがわかる。',
 fAt:t=>t<90?'fallen2':'red',
 keys:[K(0,F2I),K(60,Object.assign({},F2I,{lean:.3,cr:4})),K(89,Object.assign({},F2I,{lean:.3,cr:4})),K(90,{ua:2.3,fa:1.4,sw:1.57,ua2:2.1,fa2:1.2,cr:3,hd:-.35,lean:.1,capeOff:1}),K(200,{ua:2.3,fa:1.4,sw:1.57,ua2:2.1,fa2:1.2,cr:3,hd:-.35,lean:.1,capeOff:1})],
 post:(B,J,t)=>{water(B,t);if(t<90)reflection(B,t,'red',{},EXX);else reflection(B,t,'fallen2',{},EXX);
  if(t>=60&&t<90){/* 白黒赤：とどめの瞬間 */for(let i=0;i<B.c.length;i++){if(!B.c[i])continue;const c=rgb(B.c[i]),l=c[0]*.3+c[1]*.59+c[2]*.11;B.c[i]=(c[0]>150&&c[1]<90)?'#ff2040':l>60?'#ffffff':'#0c0a10'}}}});
