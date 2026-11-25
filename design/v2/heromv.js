/* ===== 主人公のモーション =====
   相手役は門番。敵の合図（白・赤）から当たりまでは28Fで、主人公の受け方を、その当たりの瞬間に重ねて見せる。
   主人公の剣の光・跡・火花は、敵の合図の4色と取り違えないよう、うすい青で描く（まほうの色だけは、ゲームの ほのお・かみなり・ひかり の色）。
   剣は腕で振る：刃は拳から前腕の続きで出し、手首を下へ折らない。 */
const HP_={
 guard:{ua:1.25,fa:-.2,sw:-1.3,ua2:2.95,fa2:3.05,cr:2,lean:-.08},  /* ガード：盾を前へ突き出して受ける（剣は盾の後ろで立てたまま） */
 parry:{ua:2.9,fa:-2.6,sw:-2.2,lean:.15,x:-2},                /* パリィ：当たる直前に、前へ弾く */
 parryFT:{ua:-2.75,fa:-2.2,sw:-1.75,lean:.22,x:-4},            /* パリィの振り切り：止まりが解けたら、刃を頭上まで払い上げて粘る */
 parryHFT:{ua:-2.8,fa:-2.25,sw:-1.8,cr:2,lean:.15,x:2,ff:-9,fb:8},
 parryH:{ua:2.7,fa:-2.4,sw:-2.0,cr:3,lean:.1,x:3,ff:-9,fb:8},  /* 赤をパリィ：腰を落として踏んばる */
 dodge:{x:12,lean:-.35,cr:3,ff:-3,fb:8,ua:1.6,fa:1.9,sw:2.6},  /* ジャスト回避：低く後ろへすり抜ける */
 hurt:{x:6,lean:-.3,hd:-.3,ua:1.2,fa:1.0,sw:2.4,cr:1},         /* やられ */
 magic:{ua:2.2,fa:-1.9,sw:-1.57,cr:.5,hd:.15},                 /* まほう：剣を顔の前に、まっすぐ縦に */
 kneel:{kn:1,lean:.35,ua:1.5,fa:1.7,sw:1.45,hd:.3},            /* 膝をつく（剣を床に突く） */
 early:{ua:2.75,fa:-2.45,sw:-2.0,lean:-.12,cr:-.5}};          /* 早押し：弾こうとして空振り、固まる */
const GW={ua:-2.4,fa:-1.6,sw:-1.2,ua2:1.0,fa2:.6,sw2:.2,x:4,cr:2},GS={ua:2.8,fa:2.6,sw:2.2,x:-40,lean:.3},GREC={ua:-2.2,fa:-1.9,sw:-1.5,x:-22,lean:-.3,hd:-.2,cr:1};
const HC=20,HIT=48;/* 門番の合図と、当たり（28F） */
const hbase=()=>Object.assign({},PDEF,SPEC.hero.pose);
function heroCard(o){const HM={keys:o.hero};const I=MV.find(m=>m.id==='g_idle'),gbase=Object.assign({},PDEF,SPEC.gate.pose);
 return mv({f:'gate',id:o.id,n:o.n,bg:'gate',len:o.len||120,hero:true,cat:o.cat,keys:o.gate||[K(0,{})],
  pp:(P,t)=>{if(!o.gate){Object.assign(P,poseAt0(I,t%I.len,gbase))}if(o.gpp)o.gpp(P,t)},
  heroP:t=>{const P=poseAt0(HM,t,hbase());if(o.hpp)o.hpp(P,t);return P},
  cues:o.cues||[],hits:[],fx:o.fx,post:o.post,cap:o.cap,why:o.why})}
const GSTRIKE=after=>[K(0,{}),K(8,{}),K(HC,GW,'out'),K(HIT-4,GW),K(HIT,GS,'in')].concat(after);
const ghit=(B,x,y,d,col,big)=>{if(d<0||d>=(big?12:8))return;const c=col||HSL;for(let i=0;i<(big?14:8);i++){const a=i/(big?14:8)*TAU+.4,r=2+d*(big?2:1.3);B.set(x+Math.cos(a)*r,y+Math.sin(a)*r*.8,i%2?c[1]:c[0],4)}if(d<(big?5:3)){const r=(big?7:4)-d;for(let i=-r;i<=r;i++){B.set(x+i,y,c[0],4);B.set(x,y+i,c[0],4)}}};
const CPX=HXX+16,CPY=FL-20;/* 刃と刃がぶつかる場所 */
/* 刃の手元と剣先（画面の向き） */
function heroBlade(t,keys){const P=poseAt0({keys},t,hbase()),J=joints(CW-HXX,FL,SPEC.hero,Object.assign({},hbase(),P)),h=J.hdF,tp=add(h,dir(P.sw,SPEC.hero.w.len*SPEC.hero.k));return[[CW-1-h[0],h[1]],[CW-1-tp[0],tp[1]],[CW-1-J.hdB[0],J.hdB[1]]]}
/* 刃そのものを光らせる（u＝つばから剣先へ、どこまで光ったか） */
function bladeGlow(B,h,tp,u,col,t){const dx=tp[0]-h[0],dy=tp[1]-h[1],L=Math.hypot(dx,dy),nx=-dy/L,ny=dx/L,n=Math.ceil(L);
 for(let i=3;i<=n;i++){const q=i/n;if(q>u)break;const x=h[0]+dx*q,y=h[1]+dy*q,edge=q>u-.12;
  B.set(x+nx,y+ny,col[0],4);B.set(x-nx,y-ny,col[0],4);if(((i+t)&1))B.set(x+nx*2,y+ny*2,col[0],4);else B.set(x-nx*2,y-ny*2,col[0],4);
  B.set(x,y,edge?'#ffffff':col[1],5)}}
/* 刃の振りの跡（太い三日月）：t0〜t1 の剣先を手元から扇で塗る */
function bladeArc(B,keys,t0,t1,cols){for(let s=t0;s<t1;s+=.25){const[h,tp]=heroBlade(s,keys);const k=(s-t0)/(t1-t0);for(let q=.45;q<=1.02;q+=.03){const x=lerp(h[0],tp[0],q),y=lerp(h[1],tp[1],q);B.set(x,y,q>.85||k>.7?cols[0]:cols[1],4)}}}
function afterimage(B,t,P,dx,col){const H=new Buf(CW,CH);knight(H,CW-HXX,FL,SPEC.hero,P,t);const F=new Buf(CW,CH);F.blit(H,true);for(let i=0;i<F.c.length;i++){const x=i%CW,y=(i/CW)|0;if(F.c[i]&&!B.c[i]&&((x+y+t)&1)){if(x+dx>=0&&x+dx<CW)B.set(x+dx,y,col,5)}}}

/* ---------- 出現・待機 ---------- */
heroCard({id:'hh_enter',cat:'enter',n:'出現：階段を降りてくる',len:110,
 hero:[K(0,{x:40,ff:-8,fb:6}),K(10,{x:32,ff:-2,fb:2}),K(20,{x:24,ff:-8,fb:6}),K(30,{x:16,ff:-2,fb:2}),K(40,{x:8,ff:-8,fb:6}),K(52,{x:0,ff:-5,fb:5,ua:1.6,fa:1.9,sw:2.4}),K(64,{ua:1.6,fa:1.9,sw:2.4}),K(70,{},'out'),K(110,{})],
 cap:'剣を下ろしたまま歩いて入ってくる。相手の前で足を止め、剣を起こして構える。',why:'主人公は「下へ降りていく者」。歩いてきて、立ち止まって構える。顔を見せないので、構えるまでの動きが「覚悟を決める」瞬間になる。'});
heroCard({id:'hh_idle',cat:'idle',n:'待機：構えて待つ',len:120,hpp:(P,t)=>{P.cr=(P.cr||0)+Math.max(0,Math.sin(t*.105))*.8},hero:[K(0,{}),K(120,{})],
 cap:'肘を曲げて剣を前に立て、盾を引いて待つ。ゆっくり息をして、肩がわずかに上下する。',why:'いつでも弾ける構え。ボタン一つでガードも攻撃もするので、待機は「どちらにも動ける」姿にした。'});

/* ---------- こうげき ---------- */
/* こうげきの時刻（ゲームと同じ。2026-11-26 Ibuki）：振りかぶって止まった瞬間に剣先が光り（HGL）、光ってから28Fで当たる（HHIT）。最後の6Fで斬り下ろす */
const HGL=20,HHIT=HGL+28;
const HATK=(X,extra)=>[K(0,{}),K(10,{}),K(HGL,Object.assign({x:X*.88},HUP),'out'),K(HHIT-6,Object.assign({x:X*.88},HUP)),K(HHIT,Object.assign({x:X},HDN),'in'),K(HHIT+7,Object.assign({x:X},HDN2))].concat(extra||[K(HHIT+27,Object.assign({x:X*.15,lean:-.1},HREST),'out'),K(HHIT+35,HREST),K(220,HREST)]);
const HX_=-((EXX-6)-22-25)/.72;/* 門番の胴まで届く踏みこみ */
function heroTip(t,HM){const P=poseAt0(HM,t,hbase()),H=new Buf(1,1),J=joints(CW-HXX,FL,SPEC.hero,Object.assign({},hbase(),P)),tp=add(J.hdF,dir(P.sw,SPEC.hero.w.len*SPEC.hero.k));return[CW-1-tp[0],tp[1]]}
function heroAtkCard(id,n,kind,cap,why){const extra=kind==='chase'?[K(HHIT+11,Object.assign({x:HX_},HDN2)),K(HHIT+15,Object.assign({x:HX_},HUPS),'in'),K(HHIT+21,Object.assign({x:HX_},HUPS)),K(HHIT+39,Object.assign({x:HX_*.15,lean:-.1},HREST),'out'),K(HHIT+47,HREST),K(220,HREST)]:kind==='heavy'?[K(HHIT+19,Object.assign({x:HX_},HDN2)),K(HHIT+39,Object.assign({x:HX_*.15,lean:-.1},HREST),'out'),K(HHIT+47,HREST),K(220,HREST)]:null;
 const HM={keys:HATK(HX_,extra)},hp=[EXX-6,FL-22];
 return heroCard({id,n,cat:'atk',len:140,hero:HM.keys,
  gate:[K(0,{}),K(HHIT,{}),K(HHIT+4,{x:kind==='heavy'?10:5,lean:-.25,hd:-.3},'out'),K(HHIT+(kind==='chase'?15:11),{x:kind==='heavy'?12:4,lean:-.2}),K(HHIT+(kind==='chase'?19:17),{x:kind==='chase'?10:kind==='heavy'?14:5,lean:-.3,hd:-.3},'out'),K(HHIT+57,{},'io'),K(140,{})],
  fx:(B,J,t)=>{/* 剣先の光（押す合図）：振りかぶりの最後に、うすい青で */const tp=heroTip(t,HM);if(t>=HGL&&t<HGL+6){const d=t-HGL;for(let i=-3+(d>>1);i<=3-(d>>1);i++){B.set(tp[0]+i,tp[1],HSL[0],4);B.set(tp[0],tp[1]+i,HSL[0],4)}}
   if(kind==='heavy'){if(t>=HHIT&&t<HHIT+4)for(let i=0;i<B.c.length;i++){if(B.t[i]===1&&(i%CW)>EXX-12)B.c[i]=((i%CW+((i/CW)|0))&1)?'#ffffff':'#fff3b0'}const d=t-HHIT;if(d>=0&&d<16){ghit(B,hp[0],hp[1],d,['#ffffff','#fff3b0'],true);if(d<4)for(let x=0;x<CW;x++)if((x+d)%3)B.set(x,hp[1]+((x*7)%5)-2,d<2?'#ffffff':'#fff3b0',5)}}
   else{heroSlash(B,hp,t-HHIT,false);heroSpark(B,hp,t-HHIT)}
   if(kind==='chase'){const d=t-HHIT-15;heroSlash(B,[hp[0],hp[1]-2],d,true);if(d>=0&&d<10){for(let i=-5+(d>>1);i<=5-(d>>1);i++){B.set(hp[0]+i,hp[1]-3+i,'#ffd27a',4);B.set(hp[0]+i,hp[1]-3-i,'#ffd27a',4)}}}},
  cap,why})}
heroAtkCard('hh_atk','こうげき：斬りかかる','one','駆け寄って振りかぶり、止まった瞬間に剣先がうすく光る。光ってから28Fで当たる（敵の予兆と同じ）。最後の6Fで斬り下ろす。','剣先の光は「押せる」合図。押さなければ、ふつうの一太刀で終わる。');
heroAtkCard('hh_chase','追撃：二の太刀','chase','剣先が光ってから当たるまでのあいだ（当たりの8F前から）に押すと、斬り下ろしのあとに、もう一度斬り上げる。二太刀目には金の×の印。','敵の連撃をタイミングで受けるのと同じく、自分の攻撃もタイミングで伸ばせる。「いまだ！」の名前どおり、攻めにもタイミングの遊びがある。');
heroAtkCard('hh_heavy','重い一撃','heavy','当たるちょうどその瞬間（3F）に押すと、重い一撃になる。当たった瞬間、相手が白く光り、画面が長く止まって揺れる。','いちばん狭い受付に、いちばん大きなごほうび。手応え（止まり・光・揺れ）を最大にして、狙いたくなるようにした。');

/* ---------- まもる（ガード・パリィ・ジャスト回避・早押し） ---------- */
const GUARDK=[K(0,{}),K(HIT-12,{}),K(HIT-6,HP_.guard,'out'),K(HIT,HP_.guard),K(HIT+3,Object.assign({},HP_.guard,{x:4,lean:-.15})),K(HIT+14,Object.assign({},HP_.guard,{x:3})),K(HIT+30,{},'io'),K(110,{})];
heroCard({id:'hh_guard',cat:'def',n:'ガード（30F・盾）',len:110,cues:[{t:HC,col:'w'}],gate:GSTRIKE([K(56,GS),K(80,{},'io'),K(110,{})]),
 hero:GUARDK,
 fx:(B,J,t)=>{const d=t-HIT;if(d<0||d>=10)return;const sh=heroBlade(t,GUARDK)[2],x=sh[0]+5,y=sh[1];ghit(B,x,y,d,['#c8ccd8','#7c84a0']);
  /* 受けた重さ：盾の後ろへ、押された線が3本 */if(d<6)for(let i=0;i<3;i++)for(let j=0;j<4-d/2;j++)B.set(sh[0]-6-j-d,y-4+i*4,'#7c84a0',4)},
 cap:'当たる30F前までに押すと、盾を前へ突き出して受ける。剣は盾の後ろで立てたまま。受けた勢いで少し押し下がる。火花は小さく、灰色。ダメージは減るが、少し受ける。','why':'いちばん広い受付。とりあえず身を守れる。盾で「耐える」、剣で「弾く」と道具を分けて、ガードとパリィの差を一目でわかるようにした（まほうの縦の剣とも形が別になる）。せっかく持っている盾を、ここで使う。'});
const PARRYK=[K(0,{}),K(HIT-3,{}),K(HIT,HP_.parry,'in'),K(HIT+12,HP_.parry),K(HIT+15,HP_.parryFT,'out'),K(HIT+34,HP_.parryFT),K(HIT+50,{},'io'),K(120,{})];
const PARRYHK=[K(0,{}),K(HIT-3,{}),K(HIT,HP_.parryH,'in'),K(HIT+18,HP_.parryH),K(HIT+21,HP_.parryHFT,'out'),K(HIT+40,HP_.parryHFT),K(HIT+56,{},'io'),K(130,{})];
function parryFx(B,t,keys,stop){const d=t-HIT,c=['#ffffff','#bfe8ff'];
 if(d>=0&&d<2)for(let i=0;i<B.c.length;i++)if(B.t[i]===1&&(i%CW)<HXX+9&&((i/CW)|0)>FL-40)B.c[i]=((i%CW+((i/CW)|0))&1)?'#ffffff':'#d8f2ff';/* 弾いた瞬間、主人公が白く光る */
 ghit(B,CPX,CPY,d,c,true);
 if(d>=0&&d<stop){/* 止まりのあいだ、弾いた点から集中線 */for(let i=0;i<16;i++){const a=i/16*TAU+.2,r0=9+(i%3)*2,r1=r0+5+((i*7)%5)-d*.3;if(r1<=r0)continue;for(let r=r0;r<r1;r++)B.set(CPX+Math.cos(a)*r,CPY+Math.sin(a)*r*.75,i%2?c[1]:c[0],5)}}
 if(d>=-3&&d<2)bladeArc(B,keys,HIT-3,Math.min(t,HIT)+.01,['#ffffff','#7cc8f0']);
 const e=t-(HIT+stop);if(e>=0&&e<8)bladeArc(B,keys,HIT+stop+Math.max(0,e-4),Math.min(t,HIT+stop+3)+.01,e<3?['#ffffff','#7cc8f0']:['#bfe8ff','#3a6a90'])}
heroCard({id:'hh_parry',cat:'def',n:'パリィ（6F）',len:120,cues:[{t:HC,col:'w'}],gate:GSTRIKE([K(HIT+12,GS),K(HIT+16,GREC,'out'),K(HIT+40,GREC),K(110,{},'io')]),
 hero:PARRYK,
 fx:(B,J,t)=>parryFx(B,t,PARRYK,12),
 cap:'当たる直前（6F）に押すと、刃で前へ弾く。弾いた瞬間に2F白く光り、刃のまわりに青白い集中線が走って、二人とも12F止まる。止まりが解けると、刃は太い三日月の跡を引いて頭上まで払い上がり、そこで粘る。門番の剣ははね上がり、体ごとのけぞって下がる。','why':'遊びの核で、成功の型。ジャスト回避（残像＝逃げた跡）より一段上に見せるため、パリィだけが「打ち勝った跡」（太い三日月）と、止まりの間の集中線を持つ。振り切りで粘るのは 2023-02-22「フォロースルーで印象が決まる」。'});
heroCard({id:'hh_parryH',cat:'def',n:'赤い光をパリィ',len:130,cues:[{t:HC,col:'r'}],gate:GSTRIKE([K(HIT+18,GS),K(HIT+22,Object.assign({},GREC,{x:-10,lean:-.45}),'out'),K(HIT+50,GREC),K(120,{},'io')]),
 hero:PARRYHK,
 fx:(B,J,t)=>{const d=t-HIT;parryFx(B,t,PARRYHK,18);if(d>=0&&d<26)for(let i=0;i<10;i++){const x=HXX+4-d*.5-i*1.5,y=FL-((i*3+d)%3);if(hsh(i,d)>.3)B.set(x,y,i%2?'#8a7a66':'#5a4a3e',5)}},
 cap:'赤い光（重い）でも、6Fで押せば弾ける。腰を落として踏んばり、足が床を削って土ぼこりが立つ。止まりは18F（ふつうより6F長い）。止まりが解けると、踏んばったまま刃を頭上まで払い上げる。','why':'重い一撃を弾いた手応えは、ふつうのパリィより重く長く。足元の土ぼこりで「押しこまれたのを止めた」と見せる。'});
heroCard({id:'hh_just',cat:'def',n:'ジャスト回避（12F）',len:120,cues:[{t:HC,col:'w'}],gate:GSTRIKE([K(HIT+10,GS),K(90,{},'io'),K(120,{})]),
 hero:[K(0,{}),K(HIT-4,{}),K(HIT,HP_.dodge,'out'),K(HIT+18,HP_.dodge),K(HIT+40,{},'io'),K(120,{})],
 fx:(B,J,t)=>{const d=t-HIT;if(d>=0&&d<14){afterimage(B,t,{},0,d<6?'#9dffc4':'#5a9a7a')}if(d>=0&&d<10)for(let i=0;i<6;i++){const a=i*1.05+d*.3;B.set(HXX+Math.cos(a)*(4+d),FL-16+Math.sin(a)*(4+d),'#9dffc4',4)}},
 cap:'弾くには少し早い（12F以内）とき、低く後ろへすり抜ける。いた場所に、うすい緑の残像が残り、門番の剣は残像を斬る。ダメージなし。','why':'パリィの半歩手前のごほうび。残像を斬らせて「かわした」が一目でわかる。緑はゲームの「ジャスト！」の色。'});
heroCard({id:'hh_early',cat:'def',n:'早押し（硬直24F）',len:130,cues:[{t:HC,col:'w'}],gate:GSTRIKE([K(56,GS),K(80,{},'io'),K(130,{})]),
 hero:[K(0,{}),K(12,{}),K(15,HP_.early,'in'),K(38,HP_.early),K(HIT,Object.assign({},HP_.early,{cr:0})),K(HIT+3,HP_.hurt,'out'),K(HIT+16,HP_.hurt),K(HIT+40,{},'io'),K(130,{})],
 hpp:(P,t)=>{if(t>=15&&t<HIT)P.x=(P.x||0)+((t%6<3)?.4:-.4)},
 fx:(B,J,t)=>{if(t>=15&&t<HIT){/* 固まっているあいだ、頭の上に小さな汗 */const y=FL-34-((t-15)%12)*.3;B.set(HXX-2,y,'#8ab8e0',4);B.set(HXX-2,y+1,'#5a7ca8',4)}ghit(B,HXX+6,FL-18,t-HIT,['#ff7060','#a02a30'])},
 cap:'あわてて、合図が光る前に押すと（当たりの30Fより前）、空振りして固まる（24F）。小刻みに震え、汗が浮く。固まっているあいだに合図が光り、当たる。','why':'あわてて押すと損をする、を体で見せる。合図を見たら、すぐではなく「いまだ！」で押す。'});

/* ---------- かいふく・まほう ---------- */
heroCard({id:'hh_heal',cat:'idle',n:'かいふく：薬を飲む',len:120,
 hero:[K(0,{}),K(10,{ua:1.7,fa:2.0,sw:2.6,cr:1},'out'),K(20,{ua:1.7,fa:2.0,sw:2.6,cr:1,hd:-.45,ua2:-2.2,fa2:-2.6}),K(44,{ua:1.7,fa:2.0,sw:2.6,cr:1,hd:-.45,ua2:-2.2,fa2:-2.6}),K(56,{ua:1.7,fa:2.0,sw:2.6,cr:0},'io'),K(76,{},'io'),K(120,{})],
 fx:(B,J,t)=>{if(t>=14&&t<48){/* 小瓶：盾の手で、かぶとの口元へ傾ける */const p=[HXX+3-(t<20?(20-t)*.4:0),FL-28+(t<20?(20-t)*.8:0)];for(let yy=0;yy<4;yy++)for(let xx=0;xx<3;xx++)B.set(p[0]+xx,p[1]+yy,yy===0?'#d8d0c0':(xx===1&&yy===1)?'#d8ffe8':'#4ac078',4);B.set(p[0]+1,p[1]-1,'#8a6a4a',4)}
  if(t>=28&&t<84)for(let i=0;i<12;i++){const u=((t-28)*1.1+i*7)%34,x=HXX-8+((i*5)%18),y=FL-1-u;if(u<30){B.set(x,y,u<14?'#8dffb0':'#4ac078',5);if(u<8)B.set(x,y-1,'#d8ffe8',5)}}},
 cap:'剣先を下ろし、盾の手で小瓶を取って、かぶとの口元へ傾ける。足元から緑の光の粒がのぼる。毒も消える。','why':'顔を見せないので、かぶとの口元へ傾けるだけ。緑はゲームの回復の数字と同じ色。'});
const SPC={1:['#ff9a3a','#ffd27a'],2:['#ffe14a','#fff6b0'],3:['#7fe3ff','#e8fbff']};
function magicCard(lv,id,n,cap,why){const T=[0,12,16,30][lv],c0=24,cast=c0+18,hit=cast+T,col=SPC[lv];
 const fin=lv===1?Object.assign({},HDN,{x:-6}):lv===2?{ua:-1.9,fa:-1.7,sw:-1.3,lean:-.1}:{ua:1.5,fa:1.7,sw:1.45,kn:.6,lean:.2};
 return heroCard({id,cat:'magic',n,len:hit+60,
  gate:[K(0,{}),K(hit,{}),K(hit+3,{x:5,lean:-.3,hd:-.3},'out'),K(hit+12,{x:4,lean:-.2}),K(hit+40,{},'io'),K(hit+60,{})],
  hero:[K(0,{}),K(10,{}),K(c0,HP_.magic,'out'),K(cast-2,HP_.magic),K(cast+2,fin,'in'),K(hit+8,fin),K(hit+40,{},'io'),K(hit+60,{})],
  fx:(B,J,t)=>{const tp=heroTip(t,{keys:[K(0,{}),K(10,{}),K(c0,HP_.magic,'out'),K(cast-2,HP_.magic),K(cast+2,fin,'in'),K(hit+8,fin),K(hit+40,{},'io'),K(hit+60,{})]});
   const MK=[K(0,{}),K(10,{}),K(c0,HP_.magic,'out'),K(cast-2,HP_.magic),K(cast+2,fin,'in'),K(hit+8,fin),K(hit+40,{},'io'),K(hit+60,{})];
   if(t>=c0&&t<cast+6){/* 見切りの光：つばから剣先へ、刃そのものが光で満ちていく。満ちたら剣先が星のように光り、放つと消える */const[h,bt]=heroBlade(t,MK),u=Math.min(1,(t-c0)/14);
    if(t<cast||((t-cast)&1)===0)bladeGlow(B,h,bt,t<cast?u:1-(t-cast)/6,col,t);
    const f=t-(c0+14);if(f>=0&&f<cast-c0-14){const r=f<2?6:3+((t>>1)&1);for(let i=-r;i<=r;i++){B.set(bt[0]+i,bt[1],Math.abs(i)<2?'#ffffff':col[1],5);B.set(bt[0],bt[1]+i,Math.abs(i)<2?'#ffffff':col[1],5)}}}
   const ex=EXX-6,ey=FL-20;
   /* 共通：唱えているあいだ、主人公の足元に魔法陣（段が上がるほど大きい）。光の粒がまわる */if(t>=c0&&t<hit+4){const k=Math.min(1,(t-c0)/6),rx=(10+lv*3)*k,ry=2+lv;for(let a=0;a<64;a++){const th=a/64*TAU;B.set(HXX+Math.cos(th)*rx,FL+1+Math.sin(th)*ry,col[0],4)}for(let i=0;i<4+lv*2;i++){const th=t*.1+i*TAU/(4+lv*2);B.set(HXX+Math.cos(th)*rx,FL+1+Math.sin(th)*ry,'#ffffff',4)}}
   if(lv===1&&t>=cast&&t<hit){/* ほのお：黒いふちの火の玉が弧を描いて飛び、火の粉を引く */const k=(t-cast)/T,x=lerp(HXX+14,ex,k),y=lerp(FL-26,ey,k)-Math.sin(k*Math.PI)*12;for(let i=1;i<8;i++){const q=[x-i*2.2,y+Math.sin(i*1.3+t)*1.2+i*.3];if((i+t)%2)B.set(q[0],q[1],i<3?col[1]:col[0],4)}B.disc(x,y,4.2,'#5a1a08',null,null,4);B.disc(x,y,3.2,col[0],null,null,4);B.disc(x,y,1.6,'#fff3b0',null,null,4)}
   if(lv===1){const d=t-hit;if(d>=0&&d<14){/* 爆ぜる：閃光→火の輪→黒い煙 */const r=3+d*1.6;for(let a=0;a<48;a++){const th=a/48*TAU;B.set(ex+Math.cos(th)*r,ey+Math.sin(th)*r*.8,d<4?'#ffffff':d<9?col[0]:'#3a2a28',4)}if(d<4)B.disc(ex,ey,6-d,'#fff3b0',null,null,4)}}
   if(lv===2&&t>=cast&&t<hit){/* かみなり：掲げた剣に雷が集まる */if((t>>1)%2)for(let i=0;i<5;i++)B.set(tp[0]+(hsh(i,t)-.5)*9,tp[1]+(hsh(t,i)-.5)*9,col[i%2],4)}
   if(lv===2&&t>=hit&&t<hit+12){/* 画面の上から、三本の雷が少しずつずれて落ちる（まん中は白） */for(let b=0;b<3;b++){if(t-hit<b*3)continue;let x=ex+(b-1)*10,y=0;const x1=ex+(b-1)*3,sd=b*97+(t>>1)%3*13;for(let i=1;i<=9;i++){const nx=lerp(ex+(b-1)*10,x1,i/9)+(i<9?(hsh(i,sd)-.5)*14:0),ny=ey*i/9+4;B.line(x,y,nx,ny,b===1?'#ffffff':col[0],4);B.line(x+1,y,nx+1,ny,b===1?col[1]:'#a88a20',4);x=nx;y=ny}}if(t-hit<3)for(let i=0;i<B.c.length;i++)if(!B.c[i]&&((i%CW+((i/CW)|0))&1))B.set(i%CW,(i/CW)|0,'#4a4420',5)}
   if(lv===3){/* ひかり：剣を床に突くと、画面が暗くなり、相手の足元に二重の魔法陣が広がる。天井から床まで、太い光の柱が開く */
    if(t>=cast&&t<hit+20){const dim=t<hit+12?1:1-(t-hit-12)/8;for(let i=0;i<B.c.length;i++)if(!B.c[i]&&((i%CW+((i/CW)|0)+(dim<.5?t:0))&1)&&dim>.3)B.set(i%CW,(i/CW)|0,'#06030f',6)}
    if(t>=cast&&t<hit+10){const k=Math.min(1,(t-cast)/(T*.7));for(const[rx,ry,c]of[[26*k,6*k,col[0]],[18*k,4*k,'#e8c46a']])for(let a=0;a<72;a++){const th=a/72*TAU;B.set(ex+Math.cos(th)*rx,FL+1+Math.sin(th)*ry,c,4)}for(let i=0;i<8;i++){const th=-t*.06+i*TAU/8;B.set(ex+Math.cos(th)*22*k,FL+1+Math.sin(th)*5*k,'#ffffff',4)}
     for(let i=0;i<6;i++){const u=((t-cast)*.9+i*7)%22;if(u<20)B.set(ex-18+i*7,FL-u,col[(i+t)%2],5)}}
    if(t>=hit-3&&t<hit+20){const w=t<hit?2:Math.min(28,6+(t-hit)*4),fade=t>hit+12?1-(t-hit-12)/8:1;for(let y=0;y<=FL+1;y++)for(let x=Math.round(ex-w/2-3);x<=ex+w/2+3;x++){const core=Math.abs(x-ex)<=w/2,keep=fade>=1||hsh(x,y+t)<fade;if(!keep)continue;B.set(x,y,core?((y+t)%7?'#ffffff':'#e8fbff'):((x+y)&1?col[0]:'#3a8aa8'),4)}}}
   const d=t-hit;if(d>=0&&d<12){ghit(B,ex,ey,d,col,true)}},
  cap,why})}
magicCard(1,'hh_fire','まほう：ほのお','剣を顔の前にまっすぐ立て、足元に魔法陣が回り、見切りの光がつばから剣先へのぼって刃が光で満ち、剣先が星のように光る（ゲージ1本）。剣を前へ振ると、黒いふちの火の玉が火の粉を引いて弧を描き、門番に当たって爆ぜる。','まほうの構えは、剣を顔の前に縦に立てる（本気の赤い騎士の最期の構えと同じ形＝二人は同じ剣の型を知っている）。');
magicCard(2,'hh_thunder','まほう：かみなり','構えから剣を頭上へ掲げると、剣に小さな雷が集まり、画面の上から三本の雷が少しずつずれて門番に落ちる（まん中は白）。落ちた瞬間、画面がうすく光る（ゲージ2本）。','掲げた剣が避雷針になる。ほのおより少し遅く、強い。');
magicCard(3,'hh_light','まほう：ひかり','構えから剣を床に突き立て、片ひざを落とす。画面が暗くなり、門番の足元に二重の魔法陣が広がって、光の粒がのぼる。天井から床まで、白い芯と水色のふちの太い光の柱が開く（ゲージ3本）。いちばん長く、いちばん強い。','剣を床に突く＝地の底へ祈る形。光の柱は、くらやみの底から立ちのぼる「別の世界線の光」とも読める。どのまほうも、相手の構えを崩す。');

/* ---------- やられ・撃破 ---------- */
heroCard({id:'hh_hurt',cat:'hurt',n:'やられ：斬られる',len:110,cues:[{t:HC,col:'w'}],gate:GSTRIKE([K(56,GS),K(80,{},'io'),K(110,{})]),
 hero:[K(0,{}),K(HIT,{}),K(HIT+3,HP_.hurt,'out'),K(HIT+16,HP_.hurt),K(HIT+40,{},'io'),K(110,{})],
 hpp:(P,t)=>{const d=t-HIT;if(d>=0&&d<6)P.x=(P.x||0)+((t&1)?1.4:-1.4)*(1-d/6)},
 post:(B,J,t)=>{const d=t-HIT;if(d>=0&&d<2)for(let i=0;i<B.c.length;i++)if(B.t[i]===1&&(i%CW)<HXX+12)B.c[i]=((i%CW+((i/CW)|0))&1)?'#ff9a8a':'#ffffff';ghit(B,HXX+6,FL-18,d,['#ff7060','#a02a30'])},
 cap:'押さずに当たると、白と赤に光って、のけぞって押し下がる。盾の腕がはね、剣先が下がる。すぐ構えに戻る。','why':'痛さは見せるが、長くは止めない（次の攻撃が来るかもしれない）。赤い火花は主人公が受けた傷の印。'});
heroCard({id:'hh_down',cat:'down',n:'撃破：力尽きる',len:200,cues:[{t:HC,col:'r'}],gate:GSTRIKE([K(56,GS),K(90,{},'io'),K(200,{})]),
 hero:[K(0,{}),K(HIT,{}),K(HIT+3,HP_.hurt,'out'),K(HIT+14,Object.assign({},HP_.hurt,{x:8})),K(HIT+34,Object.assign({},HP_.kneel,{x:6}),'io'),K(HIT+70,Object.assign({},HP_.kneel,{x:6})),K(HIT+96,Object.assign({},HP_.kneel,{x:7,lean:.9,hd:.9,ua:1.8,fa:1.6,sw:.6}),'in'),K(200,Object.assign({},HP_.kneel,{x:7,lean:.9,hd:.9,ua:1.8,fa:1.6,sw:.6}))],
 post:(B,J,t)=>{const d=t-HIT;if(d>=0&&d<2)for(let i=0;i<B.c.length;i++)if(B.t[i]===1&&(i%CW)<HXX+12)B.c[i]=((i%CW+((i/CW)|0))&1)?'#ff9a8a':'#ffffff';ghit(B,HXX+6,FL-18,d,['#ff7060','#a02a30'],true);
  if(t>HIT+100){/* 足元に、くらやみがほんの少しにじむ（倒れたものは、くらやみに拾われる） */const r=Math.min(12,(t-HIT-100)*.25);for(let x=-r;x<=r;x++){if((x+(t>>2))%3)B.set(HXX+Math.round(x),FL+1,INK.col,6)}}},
 cap:'赤い光の重い一撃を受けて大きくのけぞり、ひざから崩れて剣を床に突く。剣にすがって一度こらえ、そのまま前へ倒れる。最後に、足元にくらやみがほんの少しにじむ。','why':'倒れたものは、くらやみに拾われる。主人公も例外ではない、とだけほのめかす。剣を突いてこらえる姿は、門番や赤い騎士の膝をつく姿と同じ型。'});

/* 主人公のモーションの並び（主人公のページで使う） */
const HMV_IDS=['hh_enter','hh_idle','hh_heal','hh_atk','hh_chase','hh_heavy','hh_guard','hh_parry','hh_parryH','hh_just','hh_early','hh_fire','hh_thunder','hh_light','hh_hurt','hh_down'];
const HCATS=[['all','すべて'],['enter','出現'],['idle','待機'],['atk','攻撃'],['def','まもる'],['magic','まほう'],['hurt','やられ'],['down','撃破']];
