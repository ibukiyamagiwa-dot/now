/* ===== パリィされ と ブレイク =====
   パリィされ：こちらに弾かれたとき。崩れるのは「攻撃した部位（刃・牙）」で、体ではない（体が崩れるのは「やられ」、構えが落ちるのは「ブレイク」）。
     小＝連撃の途中を弾かれた。刃がはね上がり、そのまま次の構えへつながる（連撃の「静と動」のリズムは崩さない）。
     大＝最後の一撃・赤い光を弾かれた。体ごとのけぞる、待機と全然ちがう極端な形（2023-08-29「ダメージモーション」）。
     弾いた瞬間は二人とも止まる（ゲームと同じ12F）。弾かれた側は止めきらず、約4Fでその形へ移り、横にだけ大きく震えて、だんだん小さく（2022-12-09「8つのヒットストップ仕様」）。
   ブレイク：パリィを4回決める（または返し技）と、構えそのものが落ちて、こちらが斬るまで続く状態。
     崩れる → 崩れ待機（くり返し。いつ見ても「いま斬れ」と読める） → 斬られて立て直す（構えへ一気に、少し行き過ぎて戻る／2022-10-24「やり過ぎてちょうどよい」）。
     頭の上の印は、合図の4色（白・赤・紫・金）を使わず、主人公の色（うすい青）の小さな星。「こちらの番」の印。 */
const TAU_=Math.PI*2,ANGS=['ua','fa','sw','ua2','fa2','sw2'];
/* 角度は近い回り道で（半周をこえる差は体の後ろを大回りする） */
function nearTo(from,to){const o=Object.assign({},to);for(const k of ANGS)if(o[k]!=null&&from[k]!=null){while(o[k]-from[k]>Math.PI)o[k]-=TAU_;while(o[k]-from[k]<-Math.PI)o[k]+=TAU_}return o}
function blendP(P,T,w){if(w<=0)return;for(const k in T){const a=P[k]==null?(PDEF[k]||0):P[k];P[k]=a+(T[k]-a)*w}}
const easeIO=u=>u<0?0:u>1?1:u*u*(3-2*u),backOut=u=>{u=Math.max(0,Math.min(1,u));const c=1.9,v=u-1;return 1+(c+1)*v*v*v+c*v*v};
/* ブレイクの印：主人公の色の小さな星が3つ、頭の上を回る（光らせない＝合図より目立たせない） */
function brkStars(B,c,t){for(let i=0;i<3;i++){const a=t*.09+i*TAU_/3,x=c[0]+Math.cos(a)*6,y=c[1]+Math.sin(a)*1.8,back=Math.sin(a)<0,col=back?HSL[2]:HSL[1];
 B.set(x,y,back?HSL[1]:HSL[0],back?5:4);for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]])B.set(x+dx,y+dy,col,back?5:4)}}
/* 主人公がパリィしたときの見せ方（主人公のモーションのパリィと同じ）：2F白く光る・集中線・大きな火花・振り切りの三日月 */
function heroParryFx(B,t,H,stop,keys,big){const d=t-H,c=['#ffffff','#bfe8ff'],bl=heroBlade(H,keys),cp=[lerp(bl[0][0],bl[1][0],.8),lerp(bl[0][1],bl[1][1],.8)];
 if(d>=0&&d<2){/* 主人公だけを白く（重なった敵は光らせない） */const H=new Buf(CW,CH);knight(H,CW-HXX,FL,SPEC.hero,Object.assign({},hbase(),poseAt0({keys},t,hbase())),t);const F=new Buf(CW,CH);F.blit(H,true);for(let i=0;i<F.c.length;i++)if(F.c[i]&&B.c[i]===F.c[i])B.c[i]=((i%CW+((i/CW)|0))&1)?'#ffffff':'#d8f2ff'}
 ghit(B,cp[0],cp[1],d,c,true);
 if(d>=0&&d<stop)for(let i=0;i<16;i++){const a=i/16*TAU_+.2,r0=9+(i%3)*2,r1=r0+5+((i*7)%5)-d*.3;for(let r=r0;r<r1;r++)B.set(cp[0]+Math.cos(a)*r,cp[1]+Math.sin(a)*r*.75,i%2?c[1]:c[0],5)}
 if(big){const e=t-(H+stop);if(e>=0&&e<8)bladeArc(B,keys,H+stop+Math.max(0,e-4),Math.min(t,H+stop+3)+.01,e<3?['#ffffff','#7cc8f0']:['#bfe8ff','#3a6a90'])}}

/* 弾かれた瞬間を足したカードを作る：もとの攻撃のカード（src）の時間に、弾いた止まり（stop）を差しこむ。
   rx[i]＝i撃目の弾かれ方 {kind:'s'|'b', T:(当たった姿勢)=>形}。brk＝最後に崩れる（ブレイク）なら {P:(t)=>崩れの姿勢, at:崩れ始め} */
function parriedCard(o){const src=typeof o.src==='string'?MV.find(m=>m.id===o.src):o.src,S=SPEC[src.f],base=Object.assign({},PDEF,S.pose),hs=src.hits,stop=o.stop||12;
 const Hc=hs.map((h,i)=>h+i*stop);/* 弾いた瞬間（カードの時間） */
 const srcT=t=>{let s=t;for(let i=0;i<hs.length;i++){if(t>=Hc[i]+stop)s-=stop;else if(t>Hc[i])return hs[i];else break}return s};
 const sh=x=>x+hs.filter(h=>h<x).length*stop;
 const cl=p=>o.minX!=null&&p.x!=null&&p.x<o.minX?Object.assign({},p,{x:o.minX}):p;/* 主人公に重ならない（弾いたところが見えるように） */
 const keys=[];for(const k of src.keys){keys.push(K(sh(k.t),cl(k.p),k.e))}hs.forEach((h,i)=>keys.push(K(Hc[i]+stop,cl(poseAt0(src,h,base)))));keys.sort((a,b)=>a.t-b.t);
 const SK={keys},PS=Hc.map(H=>Object.assign({},base,poseAt0(SK,H,base)));/* 当たった瞬間の姿勢 */
 const last=hs.length-1,len=o.len||(src.len+hs.length*stop+(o.brk?90:30));
 /* 主人公：弾く→止まる→（最後だけ）頭上まで払い上げて粘る */
 const hk=[K(0,{})];Hc.forEach((H,i)=>{hk.push(K(Math.max(hk[hk.length-1].t+1,H-3),{}));hk.push(K(H,HP_.parry,'in'));hk.push(K(H+stop,HP_.parry));
  if(i<last)hk.push(K(Math.min(H+stop+6,Hc[i+1]-4),{},'io'));else{hk.push(K(H+stop+3,HP_.parryFT,'out'));hk.push(K(H+stop+22,HP_.parryFT));hk.push(K(H+stop+38,{},'io'))}});hk.push(K(len,{}));
 const RX=Hc.map((H,i)=>{const r=o.rx[i];return r?{H,kind:r.kind,T:nearTo(PS[i],r.T(PS[i]))}:null});
 const wOf=(r,t)=>{const d=t-r.H;if(d<0)return 0;if(d<stop)return Math.min(1,(d+1)/4);const e=d-stop;if(r.kind==='s')return 1-easeIO(e/6);if(o.brk&&r.H===Hc[last])return 1;return e<10?1:1-easeIO((e-10)/18)};
 return mv({f:src.f,ox:src.ox,id:o.id,n:o.n,bg:src.bg,len,keys,hits:[],gifHits:Hc,gifEnd:o.brk?Hc[last]+stop+o.brk.at+80:null,cat:o.brk?'break':'parried',
  fAt:src.fAt?t=>src.fAt(srcT(t)):null,
  cues:(src.cues||[]).map(c=>Object.assign({},c,{t:sh(c.t)})),trails:(src.trails||[]).map(r=>[sh(r[0]),Math.min(sh(r[1]),sh(r[0])+(r[1]-r[0])),...r.slice(2)]),
  heroP:t=>poseAt0({keys:hk},t,hbase()),
  pp:(P,t)=>{if(src.pp)src.pp(P,srcT(t));
   for(const r of RX){if(!r)continue;const w=wOf(r,t);blendP(P,r.T,w);const d=t-r.H;if(d>=0&&d<stop)P.x=(P.x||0)+((t&1)?1:-1)*(r.kind==='b'?2:1.4)*(1-d/stop)}/* 弾かれた側を大きく、横にだけ、だんだん小さく */
   if(o.brk){const T0=Hc[last]+stop+o.brk.at,u=easeIO((t-T0)/16);if(u>0){const Bp=nearTo(P,o.brk.P(t));blendP(P,Bp,u)}}
   if(o.pp)o.pp(P,t,Hc,stop)},
  pre:src.pre?(B,t,S2,P)=>src.pre(B,srcT(t),S2,P):null,
  fx:(B,J,t,S2,M)=>{if(src.fx)src.fx(B,J,srcT(t),S2,src);if(o.fx)o.fx(B,J,t,Hc,stop);if(o.brk&&J.head&&t>=Hc[last]+stop+o.brk.at+10)brkStars(B,add(J.head,[0,o.brk.sy||-11]),t)},
  post:(B,J,t,S2)=>{if(src.post)src.post(B,J,srcT(t),S2);Hc.forEach((H,i)=>heroParryFx(B,t,H,stop,hk,i===last))},
  cap:o.cap,why:o.why})}

/* ブレイクから立て直すカード：崩れ待機 → 主人公が斬りかかる（やられと同じ二太刀） → 構えへ一気に戻る */
function recoverCard(o){const S=SPEC[o.f],base=Object.assign({},PDEF,S.pose),FI={id:o.id+'#f',f:o.f,ox:o.ox||0,len:60,keys:[K(0,o.P(0))]},F=o.hp?{x:o.hp[0],y:o.hp[1]}:frontOf(FI),X=Math.min(-4,-((F.x+4)-22-25)/.72),HM=heroAtk(X),hp=[F.x+4,F.y+(o.dy||0)],R0=HH2+16;
 return mv({f:o.f,ox:o.ox,id:o.id,n:o.n,bg:o.bg,len:o.len||150,noHero:true,keys:[K(0,{})],gifHits:[HH1,HH2],gifEnd:HH2+16+44,cat:'break',
  fAt:t=>(t>=HH1&&t<HH1+2)||(t>=HH2&&t<HH2+2)?o.f+'@w':o.f,
  pp:(P,t)=>{Object.assign(P,o.P(t));const a=hitT(t,HH1),b=hitT(t,HH2);for(const h of[HH1,HH2])if(t>=h&&t<h+HSTOP+2)P.x=(P.x||0)+((t&1)?1:-1)*2*(1-(t-h)/(HSTOP+2));
   if(o.react)o.react(P,a,b,t);if(t>=R0){const u=backOut((t-R0)/(o.snap||5));const I=nearTo(P,Object.assign({},o.idle?o.idle(t):base));for(const k in I){if(typeof I[k]!=='number')continue;const a0=P[k]==null?(PDEF[k]||0):P[k];P[k]=a0+(I[k]-a0)*u}if(o.after)o.after(P,t-R0)}},
  fx:(B,J,t,S2,M)=>{if(o.fx)o.fx(B,J,t,R0);if(J.head&&t<R0)brkStars(B,add(J.head,[0,o.sy||-11]),t)},
  post:(B,J,t)=>{drawHeroSmall(B,t,false,poseAt0(HM,t,PDEF));heroSlash(B,hp,t-HH1,false);heroSlash(B,[hp[0],hp[1]-2],t-HH2,true);heroSpark(B,hp,t-HH1);heroSpark(B,[hp[0]+1,hp[1]-3],t-HH2)},
  cap:o.cap,why:o.why})}

/* ---------- 門番：閉じた門（交差）が、こじ開けられる ---------- */
const G_BRK=t=>({ua:1.45,fa:1.75,sw:2.5+Math.sin(t*.05)*.05,ua2:1.25,fa2:.9,sw2:.75+Math.sin(t*.05+1)*.05,lean:.2,hd:.45+Math.sin(t*.09+1)*.06,cr:3.5+Math.sin(t*.09)*.6,x:2});
const G_SMALL={kind:'s',T:P=>({ua:P.ua+.55,fa:P.fa+1.2,sw:P.sw+1.9,x:(P.x||0)+3,lean:(P.lean||0)-.2,hd:-.15})};/* 刃だけがはね上がる */
parriedCard({id:'g_pry',src:'g_two',n:'パリィされ：二連撃（小→大）',
 rx:[G_SMALL,{kind:'b',T:P=>({ua:5.0,fa:5.5,sw:5.9,ua2:3.7,fa2:4.4,sw2:5.0,x:(P.x||0)+11,lean:-.4,hd:-.35,cr:1.5})}],
 fx:(B,J,t,Hc,stop)=>{const e=t-(Hc[1]+stop+38);if(e>=0&&e<8&&J.hdF&&J.hdB){/* 交差に戻ると、剣どうしが「キン」と鳴る */const c=LP(J.hdF,J.hdB,.5),q=add(c,[0,-9]);for(let i=-3+(e>>1);i<=3-(e>>1);i++){B.set(q[0]+i,q[1],'#c8ccd8',4);B.set(q[0],q[1]+i,'#c8ccd8',4)}}},
 cap:'一撃目を弾かれると、前の剣だけがはね上がり、体は半歩さがるだけ。そのまま後ろの剣の構えへつながる。二撃目（最後）を弾かれると、二本の剣が上へこじ開けられ、腕が大きく開いて体ごとのけぞる。しばらくして交差に戻り、剣どうしが「キン」と鳴る。',
 why:'交差した剣は「閉じた門」。弾くたびに門が少しずつこじ開けられる。小は刃だけ、大は門ごと開く。小で止まらないのは、連撃のリズム（静と動）を崩さないため。大の形は待機と全然ちがう極端な形にした（2023-08-29「ダメージモーション」）。'});
const GSRC={f:'gate',bg:'gate',len:100,keys:[K(0,{}),K(8,{}),K(HC,GW,'out'),K(HIT-4,GW),K(HIT,GS,'in'),K(100,{})],hits:[HIT],cues:[{t:HC,col:'w'}]};
parriedCard({id:'g_brk',src:GSRC,n:'ブレイク：交差がほどけて、待つ',len:210,
 rx:[{kind:'b',T:P=>({ua:4.9,fa:5.4,sw:5.8,ua2:.6,fa2:.3,sw2:.1,x:(P.x||0)+11,lean:-.4,hd:-.35,cr:1.5})}],
 brk:{at:6,P:G_BRK},
 cap:'四度目を弾かれると、こじ開けられた腕が戻らない。二本の剣は交差をほどいたまま両脇に垂れ、ひざが落ち、頭が前に垂れる。肩でゆっくり息をする。頭の上を、うすい青の小さな星が三つ回る。こちらが斬るまで、このまま。',
 why:'門番がはじめて交差をほどく＝閉じた門が開いた姿。どこから見ても「いま斬れ」とわかるよう、剣・ひざ・頭の三つを全部下げた。星は合図の4色ではなく主人公の色（うすい青）で、光らせない。「こちらの番」の印で、敵の合図より目立たせない。'});
recoverCard({id:'g_rec',f:'gate',bg:'gate',n:'ブレイク：斬られて、交差に戻る',P:G_BRK,
 react:(P,a,b)=>{const A=kb(a,7),Bk=kb(b,9);ADD(P,{x:5*A+8*Bk,lean:-.15*A-.2*Bk,hd:-.3*A-.35*Bk})},
 fx:(B,J,t,R0)=>{const e=t-(R0+4);if(e>=0&&e<8&&J.hdF&&J.hdB){const c=LP(J.hdF,J.hdB,.5),q=add(c,[0,-9]);for(let i=-4+(e>>1);i<=4-(e>>1);i++){B.set(q[0]+i,q[1],'#dfe2ea',4);B.set(q[0],q[1]+i,'#dfe2ea',4)}}},
 cap:'崩れたまま斬られると、ふだんより大きく押される（ブレイク中は1.5倍）。二太刀目のあと、二本の剣を一気に振り上げて交差に戻す。少し行き過ぎてから収まり、剣どうしが「キン」と鳴る。星が消える。',
 why:'立て直しは一瞬で、行き過ぎるくらい大きく（2022-10-24「やり過ぎてちょうどよい」）。ゆっくり戻ると「まだ斬れる」と誤解させる。「キン」が、すきが閉じた音。'});

/* ---------- 本気の赤い騎士：削ぎ落としが、崩れる ---------- */
const R2_IDLE={ua:2.45,fa:1.85,sw:2.7,ua2:2.25,fa2:1.75,cr:4.5,lean:.22,ff:-11,fb:9};
const R2_BRK=t=>{const b=Math.sin(t*TAU_/35);return{x:2,ua:1.95,fa:1.9,sw:2.6,ua2:1.8,fa2:1.8,cr:2.4+b*1.1,lean:.3+b*.04,hd:.38+b*.05,ff:-8,fb:7}};/* 下段に落ちた切っ先。肩で速く息（35F） */
const R2_UP=(P,a,b,c)=>{const o={ua:P.ua+a,fa:P.fa+b,sw:P.sw+c};if(P.ua2!=null)Object.assign(o,{ua2:P.ua2+a,fa2:P.fa2+b});return o};
parriedCard({id:'r2_pry',src:'r2_tsubame',minX:-20,n:'パリィされ：つばめ返し（小→大）',
 rx:[{kind:'s',T:P=>Object.assign(R2_UP(P,.45,.9,1.2),{lean:(P.lean||0)-.03})},{kind:'b',T:P=>Object.assign(R2_UP(P,.75,1.25,1.55),{ff:(P.ff==null?-11:P.ff)+4,fb:(P.fb==null?9:P.fb)-2,lean:(P.lean||0)-.08,hd:-.1})}],
 fx:(B,J,t,Hc,stop)=>{if(J.head)breath(B,add(J.head,[-4,2]),t-(Hc[1]+stop+8),true);const d=t-(Hc[1]+stop);if(d>=0&&d<14&&J.footF)for(let i=0;i<5;i++){const x=J.footF[0]+3+i*2+d*.3,y=FL-((i*3+d)%3);if(hsh(i,d)>.3)B.set(x,y,i%2?'#6a5a56':'#4a3c3a',5)}},
 cap:'一撃目を弾かれても、足は動かない。はね上がった刃をそのまま円く回して、二撃目（下からの弧）の構えに入る。二撃目を弾かれると、刃は両手のまま頭上へはね上げられ、前足が半歩すべって土ぼこりが立つ。息をひとつ吐いて、正眼に戻る。',
 why:'本気は「削ぎ落とし」。弾かれた勢いさえ、次の振りかぶりに使う（無駄がない）。それでも最後の一撃は止められない：前足が半歩すべるのは、鍔迫り合いの「力では五分」と同じ。弾かれても片手にならない（片手になるのは赤の捨て身だけ）。'});
parriedCard({id:'r2_brk',src:'r2_moon',minX:-20,n:'ブレイク：切っ先が落ちて、肩で息をする',len:230,
 rx:[{kind:'b',T:P=>Object.assign(R2_UP(P,.75,1.25,1.55),{ff:(P.ff==null?-11:P.ff)+4,fb:(P.fb==null?9:P.fb)-2,lean:(P.lean||0)-.08,hd:-.1})}],
 brk:{at:4,P:R2_BRK},
 fx:(B,J,t,Hc,stop)=>{const T0=Hc[0]+stop+4+10;if(J.head&&t>=T0)breath(B,add(J.head,[-4,2]),(t-T0)%35,false)},
 cap:'四度目を弾かれると、はね上げられた刃が戻らず、切っ先が床の近くまで落ちる（下段）。腰が浮き、頭が垂れ、肩で速く息をする（35Fで一往復）。こちらが斬るまで、このまま。',
 why:'ふだんの本気は、ゆっくり深い息（84F）と動かない切っ先。崩れると、その「削ぎ落とし」がはがれて、赤い騎士の「力み」（肩で速く息）が戻る。本気の中にまだ赤い騎士がいる、と一度だけ見せる。切っ先が落ちて胸が空くので、どこから見てもすきだとわかる。'});
recoverCard({id:'r2_rec',f:'red2',bg:'red',n:'ブレイク：斬られて、息ひとつで正眼に戻る',P:R2_BRK,idle:()=>R2_IDLE,snap:4,
 react:(P,a,b)=>{const A=kb(a,6),Bk=kb(b,8);ADD(P,{x:2.5*A+4*Bk,lean:-.1*A-.14*Bk,hd:-.2*Bk})},
 fx:(B,J,t,R0)=>{if(J.head){if(t<R0)breath(B,add(J.head,[-4,2]),t%35,false);else breath(B,add(J.head,[-4,2]),t-R0,true)}},
 cap:'崩れたまま斬られると、本気でも押し下げられる。二太刀目のあと、深く一つ息を吐いて、一瞬で低い正眼に構え直す。少し沈みすぎてから収まる。息はまた、ゆっくり深くなる。',
 why:'「力み」から「削ぎ落とし」へ、息ひとつで戻る。本気になる場面（マントを斬る）と同じ、吐く息が合図。'});

/* ---------- 突進イノシシ：ひっくり返ったまま、起きられない ---------- */
(()=>{const W=MV.find(m=>m.id==='b_wall');if(!W)return;
 const BK=(P,t)=>{/* ひっくり返ったまま、足が弱く宙をかく。ときどき震える */P.x=4;P.roll=Math.PI;P.y=-2;P.run=t/9;P.runA=.15+Math.max(0,Math.sin(t*.05))*.1;P.daze=0;P.hd=(P.hd||0)+.3;P.trem=(t%60<14)?.5:0;P.blink=t%24<5?1:0};
 mv({f:'boar',ox:BOAR.boar.ox,id:'b_brk',n:'ブレイク：ひっくり返ったまま、起きられない',bg:'def',len:200,keys:[K(0,{})],hits:[36],gifHits:[36],gifEnd:160,cat:'break',cues:W.cues,
  pp:(P,t)=>{W.pp(P,Math.min(t,70));if(t>=48){P.daze=0;P.hd=(P.hd||0)+.3}if(t>=70)BK(P,t)},
  fx:(B,J,t)=>{W.fx(B,J,t);if(t>=52&&J.head)brkStars(B,add(J.head,[-3,-7]),t)},
  cap:'四度目の突進を弾くと、壁にぶつかってひっくり返ったまま、起き上がれない。足が弱く宙をかき、ときどき体が震える。頭の下（ひっくり返っているので）を、うすい青の星が回る。',
  why:'ふつうに弾いたとき（壁に激突）は、しばらくして起きる。ブレイクは「起きない」ことで分ける。星は壁に激突のときの灰色の星とちがい、主人公の色。「こちらの番」。'});
 const WP=W.pp,FI={id:'b_brk#f',f:'boar',ox:BOAR.boar.ox,len:60,keys:[K(0,{})],pp:(P,t)=>{boarIdle(P,0);BK(P,0)}};
 recoverCard({id:'b_rec',f:'boar',ox:BOAR.boar.ox,bg:'def',n:'ブレイク：斬られて、跳ね起きる',hp:(()=>{const F=frontOf(FI);return[F.x,F.y]})(),
  P:t=>{const P=Object.assign({},BPDEF);boarIdle(P,t);BK(P,t);return P},
  react:(P,a,b)=>{const A=kb(a,6),Bk=kb(b,8);P.y=(P.y||0)-2*A-3*Bk;P.snort=Math.max(A,Bk);P.trem=Math.max(P.trem||0,A,Bk)},
  idle:t=>{const P=Object.assign({},BPDEF);return P},
  after:(P,d)=>{const Q=Object.assign({},BPDEF);boarIdle(Q,d);WP(Q,120+d);Object.assign(P,Q)},
  cap:'ひっくり返ったまま腹を斬られると、鳴いて跳ねる。二太刀目のあと、背中で一度はねてぱっと起き（中割りしない）、首を振って、後ずさって間合いへ戻る。',
  why:'起き上がりは壁に激突のときと同じ（回転の中割りで「立った」ように見せない）。戻ったら、また突進が来る。'})})();

/* 種類に入れる（イノシシの「壁に激突」は、やられではなく、パリィされ（大）） */
Object.assign(MCAT_PARRY,{gate:['g_pry'],red2:['r2_pry'],boar:['b_wall'],boarM:['bM_wall']});
Object.assign(MCAT_BREAK,{gate:['g_brk','g_rec'],red2:['r2_brk','r2_rec'],boar:['b_brk','b_rec']});
for(const k of['boar','boarM'])MCAT_HURT[k]=MCAT_HURT[k].filter(id=>!/_wall$/.test(id));
