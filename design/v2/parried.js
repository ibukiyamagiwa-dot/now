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
 /* 振り（弧）か突き（直線）か：軌跡の形で決める。軌跡の形が書いていなければ、剣と前腕が一直線かで決める */
 const kindOf=i=>{const h=hs[i],tr=(src.trails||[]).find(r=>r[0]<=h&&h<=r[1]+1),which=tr&&tr[3]===2?2:1,P=PS[i];if(tr&&tr[4]==='line')return{th:true,which};if(tr&&tr[4]==='arc')return{th:false,which};
  const sw=which===2?P.sw2:P.sw,fa=which===2?P.fa2:P.fa;if(sw==null||fa==null)return{th:false,which};let d=Math.abs(sw-fa)%TAU_;d=Math.min(d,TAU_-d);return{th:d<.35,which}};
 const RX=Hc.map((H,i)=>{const r=o.rx[i];if(!r)return null;const k=kindOf(i),th=r.th!=null?r.th:k.th;const T=r.T?r.T(PS[i]):o.kit(r.kind,th,PS[i],r.which||k.which,i);return{H,kind:r.kind,th,T:nearTo(PS[i],T)}});
 const wOf=(r,t)=>{const d=t-r.H;if(d<0)return 0;if(d<stop)return Math.min(1,(d+1)/4);const e=d-stop;if(r.kind==='s')return 1-easeIO(e/(r.th?8:6));if(o.brk&&r.H===Hc[last])return 1;return e<10?1:1-easeIO((e-10)/18)};
 return mv({f:src.f,ox:src.ox,id:o.id,n:o.n,bg:src.bg,len,keys,hits:[],gifHits:Hc,gifEnd:o.brk?Hc[last]+stop+o.brk.at+80:null,cat:o.brk?'break':'parried',
  fAt:src.fAt?t=>src.fAt(srcT(t)):null,
  cues:(src.cues||[]).map(c=>Object.assign({},c,{t:sh(c.t)})),trails:(src.trails||[]).map(r=>[sh(r[0]),Math.min(sh(r[1]),sh(r[0])+(r[1]-r[0])),...r.slice(2)]),
  heroP:t=>poseAt0({keys:hk},t,hbase()),
  pp:(P,t)=>{if(src.pp)src.pp(P,srcT(t));
   for(const r of RX){if(!r)continue;const w=wOf(r,t);blendP(P,r.T,w);const d=t-r.H;if(d>=0&&d<stop)P.x=(P.x||0)+((t&1)?1:-1)*(r.kind==='b'?2:1.4)*(1-d/stop)}/* 弾かれた側を大きく、横にだけ、だんだん小さく */
   if(o.brk){const T0=Hc[last]+stop+o.brk.at,u=easeIO((t-T0)/16);if(u>0){const Bp=nearTo(P,o.brk.P(t));blendP(P,Bp,u)}}
   if(o.pp)o.pp(P,t,Hc,stop)},
  pre:src.pre?(B,t,S2,P)=>src.pre(B,srcT(t),S2,P):null,
  fx:(B,J,t,S2,M)=>{if(src.fx)src.fx(B,J,srcT(t),S2,src);if(o.fx)o.fx(B,J,t,Hc,stop);if(o.brk&&t>=Hc[last]+stop+o.brk.at+10){const c=o.brk.star?o.brk.star(J):J.head?add(J.head,[0,o.brk.sy||-11]):null;if(c)brkStars(B,c,t)}},
  post:(B,J,t,S2)=>{if(o.post)o.post(B,J,t,Hc,stop);else if(src.post)src.post(B,J,srcT(t),S2);Hc.forEach((H,i)=>heroParryFx(B,t,H,stop,hk,i===last))},
  cap:o.cap,why:o.why})}

/* ブレイクから立て直すカード：崩れ待機 → 主人公が斬りかかる（やられと同じ二太刀） → 構えへ一気に戻る */
function recoverCard(o){const S=SPEC[o.f],base=Object.assign({},PDEF,S.pose),FI={id:o.id+'#f',f:o.f,ox:o.ox||0,len:60,keys:[K(0,o.P(0))]},F=o.hp?{x:o.hp[0],y:o.hp[1]}:frontOf(FI),X=Math.min(-4,-((F.x+4)-22-25)/.72),HM=heroAtk(X),hp=[F.x+4,F.y+(o.dy||0)],R0=HH2+16;
 return mv({f:o.f,ox:o.ox,id:o.id,n:o.n,bg:o.bg,len:o.len||150,noHero:true,keys:[K(0,{})],gifHits:[HH1,HH2],gifEnd:HH2+16+44,cat:'break',
  fAt:t=>(t>=HH1&&t<HH1+2)||(t>=HH2&&t<HH2+2)?o.f+'@w':o.f,
  pp:(P,t)=>{Object.assign(P,o.P(t));const a=hitT(t,HH1),b=hitT(t,HH2);for(const h of[HH1,HH2])if(t>=h&&t<h+HSTOP+2)P.x=(P.x||0)+((t&1)?1:-1)*2*(1-(t-h)/(HSTOP+2));
   if(o.react)o.react(P,a,b,t);if(t>=R0){const u=backOut((t-R0)/(o.snap||5));const I=nearTo(P,Object.assign({},o.idle?o.idle(t):base));for(const k in I){if(typeof I[k]!=='number')continue;const a0=P[k]==null?(PDEF[k]||0):P[k];P[k]=a0+(I[k]-a0)*u}if(o.after)o.after(P,t-R0)}},
  fx:(B,J,t,S2,M)=>{if(o.fx)o.fx(B,J,t,R0);const c=o.star?o.star(J):J.head?add(J.head,[0,o.sy||-11]):null;if(c&&t<R0)brkStars(B,c,t)},
  post:(B,J,t)=>{if(o.post)o.post(B,J,t,R0);drawHeroSmall(B,t,false,poseAt0(HM,t,PDEF));heroSlash(B,hp,t-HH1,false);heroSlash(B,[hp[0],hp[1]-2],t-HH2,true);heroSpark(B,hp,t-HH1);heroSpark(B,[hp[0]+1,hp[1]-3],t-HH2)},
  cap:o.cap,why:o.why})}


/* 騎士の姿の敵の弾かれ方。振り（弧）は「刃がはね上がり、体がのけぞる」、突き（直線）は「切っ先がそれて、勢いあまって前へ泳ぐ」。
   two＝両手持ち（両腕いっしょに）、lurch＝突きで泳ぐ量（力むほど大きい）、retract＝突きをそらされても泳がず、腕ごと引き戻す（削ぎ落とし）、big＝大でのけぞる量 */
function knightKit(c){const L=c.lurch==null?1:c.lurch,G=c.big==null?1:c.big;return(kind,th,P,which)=>{
 const A=which===2?['ua2','fa2','sw2']:['ua','fa','sw'],T={},add3=(a,b,d)=>{T[A[0]]=P[A[0]]+a;T[A[1]]=P[A[1]]+b;T[A[2]]=P[A[2]]+d;if(c.two&&which!==2&&P.ua2!=null){T.ua2=P.ua2+a;T.fa2=P.fa2+b}},x=P.x||0;
 if(!th){if(kind==='s'){if(c.still){add3(.45,.9,1.2);return Object.assign(T,{lean:(P.lean||0)-.03})}add3(.55,1.2,1.9);return Object.assign(T,{x:x+3,lean:(P.lean||0)-.2,hd:-.15})}
  if(c.two){add3(.75,1.25,1.55);return Object.assign(T,{x:x+3*G,ff:(P.ff==null?-9:P.ff)+4,fb:(P.fb==null?7:P.fb)-2,lean:(P.lean||0)-.25*G,hd:-.25*G})}
  T[A[0]]=4.9;T[A[1]]=5.4;T[A[2]]=5.8;if(which===2)Object.assign(T,{ua:5.0,fa:5.5,sw:5.9});else if(P.ua2!=null)Object.assign(T,{ua2:.6,fa2:.3},P.sw2!=null?{sw2:.1}:{});
  return Object.assign(T,{x:x+11*G,lean:-.4*G,hd:-.35*G,cr:1.5})}
 if(c.retract){if(kind==='s'){add3(-.25,-.35,.45);return Object.assign(T,{x:x+2,lean:(P.lean||0)-.05})}add3(-.35,-.5,.8);return Object.assign(T,{x:x+3,ff:(P.ff==null?-9:P.ff)+3,lean:(P.lean||0)-.08})}
 /* 前へ泳ぐ量は、主人公に重ならないよう、体の位置より前傾と前足で見せる */
 if(kind==='s'){add3(0,.3,.7);return Object.assign(T,{x:x-1.5*L,lean:Math.min(.6,(P.lean||0)+.2*L)})}
 add3(.2,.5,1.2);return Object.assign(T,{x:x-3*L,lean:Math.min(.55,(P.lean||0)+.3*L),hd:.25,ff:(P.ff==null?-7:P.ff)-2*L,cr:2.5})}}
/* 崩れ待機の剣先が床に刺さらないように、刺さるぶんだけ剣を起こす */
function noStab(f,P,ox){const S=SPEC[f];for(const w of[1,2]){const k=w===2?'sw2':'sw';if(P[k]==null)continue;for(let n=0;n<40;n++){const tp=tipOf(S,P,EXX+(ox||0),FL,w);if(!tp||tp[1]<=FL-1)break;P[k]+=Math.cos(P[k])<0?.06:-.06}}return P}
/* 騎士の姿の敵の崩れ待機：武器・ひざ・頭を全部下げる。剣先は床の上 */
function kBrk(f,o){o=o||{};const S=SPEC[f],two=CB_TWO.has(f),hasW2=!!S.w2;return t=>{const b=Math.sin(t*TAU_/(o.br||90));
 const P=Object.assign({},S.pose,{x:2,ua:1.5,fa:1.7,sw:2.3+Math.sin(t*.05)*.05,ua2:two?1.4:1.3,fa2:two?1.6:1.2,lean:.22+b*.03,hd:.42+b*.05,cr:(S.pose.cr||0)+2+b*(o.bob||.6)},hasW2?{sw2:.8+Math.sin(t*.05+1)*.05}:{},o.P?o.P(t):{});
 return noStab(f,P)}}
/* 崩れた隙間から、くらやみが漏れる（くらやみに関わる者）。光らない */
function leak(B,c,t){for(let i=0;i<5;i++){const ph=(t*.45+i*9)%26;if(ph>20)continue;const x=c[0]+((i*5)%7)-3+Math.sin((t+i*13)*.12),y=c[1]-ph*.8;B.set(x,y,ph<12?'#1a0f24':'#2c1a3c',5);if(ph<8)B.set(x+1,y,'#3a2450',5)}}
const idleOf=id=>{const M=MV.find(m=>m.id===id),S=SPEC[M.f],base=Object.assign({},PDEF,S.pose);return t=>{const P=Object.assign({},S.pose,poseAt0(M,t%M.len,base));if(M.pp)M.pp(P,t%M.len);return P}};

/* ---------- 門番：閉じた門（交差）が、こじ開けられる ---------- */
const G_BRK=t=>({ua:1.45,fa:1.75,sw:2.5+Math.sin(t*.05)*.05,ua2:1.25,fa2:.9,sw2:.75+Math.sin(t*.05+1)*.05,lean:.2,hd:.45+Math.sin(t*.09+1)*.06,cr:3.5+Math.sin(t*.09)*.6,x:2});
parriedCard({id:'g_pry',src:'g_two',n:'パリィされ：二連撃（小→大）',kit:knightKit({}),
 rx:[{kind:'s'},{kind:'b'}],
 fx:(B,J,t,Hc,stop)=>{const e=t-(Hc[1]+stop+38);if(e>=0&&e<8&&J.hdF&&J.hdB){/* 交差に戻ると、剣どうしが「キン」と鳴る */const c=LP(J.hdF,J.hdB,.5),q=add(c,[0,-9]);for(let i=-3+(e>>1);i<=3-(e>>1);i++){B.set(q[0]+i,q[1],'#c8ccd8',4);B.set(q[0],q[1]+i,'#c8ccd8',4)}}},
 cap:'一撃目を弾かれると、前の剣だけがはね上がり、体は半歩さがるだけ。そのまま後ろの剣の構えへつながる。二撃目（最後）を弾かれると、二本の剣が上へこじ開けられ、腕が大きく開いて体ごとのけぞる。しばらくして交差に戻り、剣どうしが「キン」と鳴る。',
 why:'交差した剣は「閉じた門」。弾くたびに門が少しずつこじ開けられる。小は刃だけ、大は門ごと開く。小で止まらないのは、連撃のリズム（静と動）を崩さないため。大の形は待機と全然ちがう極端な形にした（2023-08-29「ダメージモーション」）。'});
const GSRC={f:'gate',bg:'gate',len:100,keys:[K(0,{}),K(8,{}),K(HC,GW,'out'),K(HIT-4,GW),K(HIT,GS,'in'),K(100,{})],hits:[HIT],cues:[{t:HC,col:'w'}]};
parriedCard({id:'g_brk',src:GSRC,n:'ブレイク：交差がほどけて、待つ',len:210,kit:knightKit({}),
 rx:[{kind:'b'}],
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
parriedCard({id:'r2_pry',src:'r2_tsubame',minX:-20,n:'パリィされ：つばめ返し（小→大）',kit:knightKit({two:1,retract:1,still:1,big:.3}),
 rx:[{kind:'s'},{kind:'b'}],
 fx:(B,J,t,Hc,stop)=>{if(J.head)breath(B,add(J.head,[-4,2]),t-(Hc[1]+stop+8),true);const d=t-(Hc[1]+stop);if(d>=0&&d<14&&J.footF)for(let i=0;i<5;i++){const x=J.footF[0]+3+i*2+d*.3,y=FL-((i*3+d)%3);if(hsh(i,d)>.3)B.set(x,y,i%2?'#6a5a56':'#4a3c3a',5)}},
 cap:'一撃目を弾かれても、足は動かない。はね上がった刃をそのまま円く回して、二撃目（下からの弧）の構えに入る。二撃目を弾かれると、刃は両手のまま頭上へはね上げられ、前足が半歩すべって土ぼこりが立つ。息をひとつ吐いて、正眼に戻る。',
 why:'本気は「削ぎ落とし」。弾かれた勢いさえ、次の振りかぶりに使う（無駄がない）。それでも最後の一撃は止められない：前足が半歩すべるのは、鍔迫り合いの「力では五分」と同じ。弾かれても片手にならない（片手になるのは赤の捨て身だけ）。'});
parriedCard({id:'r2_brk',src:'r2_moon',minX:-20,n:'ブレイク：切っ先が落ちて、肩で息をする',len:230,kit:knightKit({two:1,retract:1,still:1,big:.3}),
 rx:[{kind:'b'}],
 brk:{at:4,P:R2_BRK},
 fx:(B,J,t,Hc,stop)=>{const T0=Hc[0]+stop+4+10;if(J.head&&t>=T0)breath(B,add(J.head,[-4,2]),(t-T0)%35,false)},
 cap:'四度目を弾かれると、はね上げられた刃が戻らず、切っ先が床の近くまで落ちる（下段）。腰が浮き、頭が垂れ、肩で速く息をする（35Fで一往復）。こちらが斬るまで、このまま。',
 why:'ふだんの本気は、ゆっくり深い息（84F）と動かない切っ先。崩れると、その「削ぎ落とし」がはがれて、赤い騎士の「力み」（肩で速く息）が戻る。本気の中にまだ赤い騎士がいる、と一度だけ見せる。切っ先が落ちて胸が空くので、どこから見てもすきだとわかる。'});
recoverCard({id:'r2_rec',f:'red2',bg:'red',n:'ブレイク：斬られて、息ひとつで正眼に戻る',P:R2_BRK,idle:()=>R2_IDLE,snap:4,
 react:(P,a,b)=>{const A=kb(a,6),Bk=kb(b,8);ADD(P,{x:2.5*A+4*Bk,lean:-.1*A-.14*Bk,hd:-.2*Bk})},
 fx:(B,J,t,R0)=>{if(J.head){if(t<R0)breath(B,add(J.head,[-4,2]),t%35,false);else breath(B,add(J.head,[-4,2]),t-R0,true)}},
 cap:'崩れたまま斬られると、本気でも押し下げられる。二太刀目のあと、深く一つ息を吐いて、一瞬で低い正眼に構え直す。少し沈みすぎてから収まる。息はまた、ゆっくり深くなる。',
 why:'「力み」から「削ぎ落とし」へ、息ひとつで戻る。本気になる場面（マントを斬る）と同じ、吐く息が合図。'});

/* ---------- 突進イノシシ・暴れ大イノシシ：ひっくり返ったまま、起きられない ---------- */
function boarBreak(key,pre,wall){const W=MV.find(m=>m.id===wall);if(!W)return;
 const BK=(P,t)=>{/* ひっくり返ったまま、足が弱く宙をかく。ときどき震える */P.x=4;P.roll=Math.PI;P.y=-2;P.run=t/9;P.runA=.15+Math.max(0,Math.sin(t*.05))*.1;P.daze=0;P.hd=(P.hd||0)+.3;P.trem=(t%60<14)?.5:0;P.blink=t%24<5?1:0};
 mv({f:key,ox:BOAR[key].ox,id:pre+'_brk',n:'ブレイク：ひっくり返ったまま、起きられない',bg:'def',len:200,keys:[K(0,{})],hits:[36],gifHits:[36],gifEnd:160,cat:'break',cues:W.cues,
  pp:(P,t)=>{W.pp(P,Math.min(t,70));if(t>=48){P.daze=0;P.hd=(P.hd||0)+.3}if(t>=70)BK(P,t)},
  fx:(B,J,t)=>{W.fx(B,J,t);if(t>=52&&J.head)brkStars(B,add(J.head,[-3,-7]),t)},
  cap:'四度目の突進を弾くと、壁にぶつかってひっくり返ったまま、起き上がれない。足が弱く宙をかき、ときどき体が震える。頭の下（ひっくり返っているので）を、うすい青の星が回る。',
  why:'ふつうに弾いたとき（壁に激突）は、しばらくして起きる。ブレイクは「起きない」ことで分ける。星は壁に激突のときの灰色の星とちがい、主人公の色。「こちらの番」。'});
 const WP=W.pp,FI={id:pre+'_brk#f',f:key,ox:BOAR[key].ox,len:60,keys:[K(0,{})],pp:(P,t)=>{boarIdle(P,0);BK(P,0)}};
 recoverCard({id:pre+'_rec',f:key,ox:BOAR[key].ox,bg:'def',n:'ブレイク：斬られて、跳ね起きる',hp:(()=>{const F=frontOf(FI);return[F.x,F.y]})(),
  P:t=>{const P=Object.assign({},BPDEF);boarIdle(P,t);BK(P,t);return P},
  react:(P,a,b)=>{const A=kb(a,6),Bk=kb(b,8);P.y=(P.y||0)-2*A-3*Bk;P.snort=Math.max(A,Bk);P.trem=Math.max(P.trem||0,A,Bk)},
  idle:t=>{const P=Object.assign({},BPDEF);return P},
  after:(P,d)=>{const Q=Object.assign({},BPDEF);boarIdle(Q,d);WP(Q,120+d);Object.assign(P,Q)},
  cap:'ひっくり返ったまま腹を斬られると、鳴いて跳ねる。二太刀目のあと、背中で一度はねてぱっと起き（中割りしない）、首を振って、後ずさって間合いへ戻る。',
  why:'起き上がりは壁に激突のときと同じ（回転の中割りで「立った」ように見せない）。戻ったら、また突進が来る。'})}
boarBreak('boar','b','b_wall');boarBreak('boarM','bM','bM_wall');

/* ---------- 本気の赤い騎士：突きをそらされても、泳がない ---------- */
parriedCard({id:'r2_pryT',src:'r2_hold',minX:-14,n:'パリィされ：溜めの突き（突き・大）',kit:knightKit({two:1,retract:1,still:1,big:.3}),rx:[{kind:'b'}],
 fx:(B,J,t,Hc,stop)=>{if(J.head)breath(B,add(J.head,[-4,2]),t-(Hc[0]+stop+4),true)},
 cap:'溜めの突きの切っ先をそらされると、腕ごと剣を引き戻し、前足が半歩さがる。体は一歩も前へ泳がない。息をひとつ吐いて、正眼に戻る。',
 why:'突きをそらされると、ふつうは勢いあまって前へ泳ぐ（赤い騎士がそう）。本気は泳がずに引き戻す＝削ぎ落とし。同じ「突きを弾く」でも、相手の格で崩れ方が変わる。'});

/* ---------- 黒い門番：のまれかけた門 ---------- */
parriedCard({id:'dg_pry',src:'dg_two',n:'パリィされ：くさった二連撃（小→大）',kit:knightKit({}),rx:[{kind:'s'},{kind:'b'}],
 fx:(B,J,t,Hc,stop)=>{const d=t-(Hc[1]+stop);if(d>=0&&d<30&&J.sc)leak(B,J.sc,t)},
 cap:'門番と同じく、小は前の剣だけがはね上がり、大は二本の剣がこじ開けられてのけぞる。こじ開けられた胸の隙間から、くらやみがしばらく漏れる。',
 why:'門番と同じ骨組み・同じ崩れ方（同じ系統）。違いは「開いたところから、くらやみが出る」こと。'});
const DGSRC=Object.assign({},GSRC,{f:'dgate',cues:[{t:HC,col:'w'}]});
const DG_BRK=kBrk('dgate',{P:t=>({sw2:.75,ua2:1.25,fa2:.9})});
parriedCard({id:'dg_brk',src:DGSRC,n:'ブレイク：交差がほどけ、くらやみが漏れる',len:210,kit:knightKit({}),rx:[{kind:'b'}],brk:{at:6,P:DG_BRK},
 fx:(B,J,t,Hc,stop)=>{if(t>=Hc[0]+stop+10&&J.sc)leak(B,J.sc,t)},
 cap:'交差がほどけ、二本の剣が両脇に垂れ、ひざが落ちて頭が垂れる（門番と同じ）。胸の隙間から、くらやみが細く立ちのぼり続ける。',
 why:'門が開いたまま＝向こうのものが漏れてくる。崩れているあいだ、くらやみに近づいていることも見せる。'});
recoverCard({id:'dg_rec',f:'dgate',bg:'gate',n:'ブレイク：斬られて、交差に戻る',P:DG_BRK,idle:idleOf('dg_idle'),
 react:(P,a,b)=>{const A=kb(a,7),Bk=kb(b,9);ADD(P,{x:5*A+8*Bk,lean:-.15*A-.2*Bk,hd:-.3*A-.35*Bk})},
 fx:(B,J,t,R0)=>{if(t<R0&&J.sc)leak(B,J.sc,t)},
 cap:'崩れたまま斬られて大きく押され、二本の剣を一気に交差へ戻す。くらやみの漏れが止まる。',why:'門番と同じ立て直し。閉じると漏れが止まる＝交差が「門を閉じる」ことの念押し。'});

/* ---------- 門のぬし：鍵（振り）と、赤い突き ---------- */
parriedCard({id:'l_pry',src:'l_two',n:'パリィされ：二連撃（小→大）',kit:knightKit({}),rx:[{kind:'s'},{kind:'b'}],
 cap:'一撃目を弾かれると、大きな鍵の先がはね上がり、体は半歩さがるだけ。二撃目（最後）を弾かれると、鍵ごと腕が頭の後ろまではね上げられ、体ごとのけぞる。',
 why:'門番と同じ崩れ方を、大きな体で。鍵は重いので、はね上がったあと戻るのが遅い（戻りの時間は同じでも、体が大きいぶん遅く見える）。'});
parriedCard({id:'l_pryT',src:'l_thrust',minX:-16,n:'パリィされ：赤い突き（突き・大）',kit:knightKit({lurch:.5}),rx:[{kind:'b'}],
 cap:'赤い突きの切っ先をそらされると、勢いで前へつんのめりかけるが、手首の鎖が後ろへ張って体を引き止める。半歩で止まり、鍵を引き戻す。',
 why:'突きをそらされると前へ泳ぐ（振りとは逆）。ぬしは鎖で門とつながっているので、泳ぎきれない。鎖は「つながれている」ことの印で、崩れ方にも出る。'});
const L_BRK=kBrk('lord',{bob:.8});
parriedCard({id:'l_brk',src:'l_thrust',minX:-16,n:'ブレイク：鍵の先が床に落ちる',len:220,kit:knightKit({lurch:.5}),rx:[{kind:'b'}],brk:{at:6,P:L_BRK},
 cap:'四度目を弾かれると、鍵の先が床まで落ち、肩が落ちて頭が垂れる。ひびの入った封印が、ゆっくり脈打つ。こちらが斬るまで、このまま。',
 why:'門の番人の格好のまま、鍵が持ち上がらない＝門を守る力が尽きた姿。'});
recoverCard({id:'l_rec',f:'lord',bg:'lord',n:'ブレイク：斬られて、鍵を構え直す',P:L_BRK,idle:idleOf('l_idle'),
 react:(P,a,b)=>{const A=kb(a,6),Bk=kb(b,8);ADD(P,{x:3*A+5*Bk,lean:-.1*A-.15*Bk,hd:-.25*Bk})},
 cap:'崩れたまま斬られ、二太刀目のあと鍵を一気に引き上げて構え直す。少し行き過ぎてから収まる。',why:'大きな体ほど、立て直しの「行き過ぎ」を大きく見せる（2022-10-24「やり過ぎてちょうどよい」）。'});

/* ---------- 暗い門のぬし：剣と、触手 ---------- */
const TENT_B=P=>({ua2:.5,fa2:.2,x:(P.x||0)+9,lean:-.35,hd:-.3,cr:1.5});/* 触手の腕が後ろへはじかれ、体ごとのけぞる */
parriedCard({id:'l2_pry',src:'l2_tri',n:'パリィされ：剣と触手の三連（小・小→大）',kit:knightKit({}),rx:[{kind:'s'},{kind:'s'},{kind:'b',T:TENT_B}],
 fx:(B,J,t,Hc,stop)=>{const d=t-(Hc[2]+stop);if(d>=0&&d<30&&J.hdB)leak(B,J.hdB,t)},
 cap:'剣の二撃は、小（鍵がはね上がって次へつながる）。最後の触手を弾かれると、触手は縮んで腕へ逃げこみ、腕ごと後ろへはじかれて体がのけぞる。腕の付け根から、くらやみが漏れる。',
 why:'弾かれる部位で崩れ方を分ける：鍵は「はね上がる」、触手は「縮んで逃げる」（生き物の反射）。'});
const L2_BRK=kBrk('lord2',{bob:.8,P:t=>({ua2:1.6+Math.sin(t*.07)*.15,fa2:1.9})});
parriedCard({id:'l2_brk',src:'l2_arm',n:'ブレイク：触手が垂れ、くらやみが漏れる',len:200,kit:knightKit({}),rx:[{kind:'b',T:TENT_B}],brk:{at:6,P:L2_BRK},
 fx:(B,J,t,Hc,stop)=>{if(t>=Hc[0]+stop+10&&J.sc)leak(B,J.sc,t)},
 cap:'四度目を弾かれると、鍵が床に落ち、触手の腕はだらりと垂れて、ときどき勝手にひくつく。胸のひびから、くらやみが立ちのぼる。',
 why:'ぬしの体は崩れても、くらやみの側（触手）は勝手に動く。持ち主の意志と関係なく動くものが、もう体に混ざっている。'});
recoverCard({id:'l2_rec',f:'lord2',bg:'lord',n:'ブレイク：斬られて、触手が持ち上げる',P:L2_BRK,idle:idleOf('l2_idle'),
 react:(P,a,b)=>{const A=kb(a,6),Bk=kb(b,8);ADD(P,{x:3*A+5*Bk,lean:-.1*A-.15*Bk,hd:-.25*Bk})},
 fx:(B,J,t,R0)=>{if(t<R0&&J.sc)leak(B,J.sc,t)},
 cap:'斬られたあと、ぬしが自分で立つのではなく、背中の触手が鍵の腕を持ち上げて構えに戻す。',why:'立て直すのも、もう本人の力ではない（打ち合いの「触手が鍵を持ち上げる」と同じ）。'});

/* ---------- 赤い騎士：力み ---------- */
parriedCard({id:'r_pry',src:'r_two',minX:-20,n:'パリィされ：勢いあまりの二連撃（小→大）',kit:knightKit({two:1,big:1.3}),rx:[{kind:'s'},{kind:'b'}],
 fx:(B,J,t,Hc,stop)=>{if(J.head)breath(B,add(J.head,[-4,2]),(t-(Hc[1]+stop))%20,false)},
 cap:'一撃目を弾かれると、刃がはね上がり半歩さがる。二撃目を弾かれると、両手のまま刃が頭上まではね上げられ、大きくのけぞって後ろへよろめく。肩で荒く息をしながら構え直す。',
 why:'本気とくらべて、崩れ方が大きい＝力み。強く打ちこんだぶん、強くはね返される。'});
parriedCard({id:'r_pryT',src:'r_three',minX:-12,n:'パリィされ：三段突き（突き：小・小→大）',kit:knightKit({two:1,lurch:1.6}),rx:[{kind:'s'},{kind:'s'},{kind:'b'}],
 cap:'突きの切っ先をそらされるたび、勢いあまって前へ泳ぐ。三突き目（赤）をそらされると、前へ大きくつんのめって半歩踏み出し、体勢を戻す。',
 why:'突きは振りと逆に「前へ泳ぐ」。赤い騎士は力むので泳ぎが大きい（本気は泳がない）。同じ技の形でも、崩れ方で二人の差が出る。'});
const R_BRK=kBrk('red',{br:24,bob:1.1,P:t=>{const g=t%48<8?Math.sin((t%48)/8*Math.PI):0;return{ua:1.85+g*.3,fa:1.8+g*.35,sw:2.45,ua2:1.75+g*.3,fa2:1.7+g*.35,lean:.08,hd:.5}}});
parriedCard({id:'r_brk',src:'r_thrust',minX:-12,n:'ブレイク：切っ先が上がらない',len:220,kit:knightKit({two:1,lurch:1.6}),rx:[{kind:'b'}],brk:{at:6,P:R_BRK},
 fx:(B,J,t,Hc,stop)=>{const T0=Hc[0]+stop+16;if(J.head&&t>=T0)breath(B,add(J.head,[-4,2]),(t-T0)%24,false)},
 cap:'四度目をそらされると、切っ先が床まで落ちる。肩でとても速く息をし（24Fで一往復）、ときどき柄を握り直して剣を上げようとするが、上がりきらずに落ちる。',
 why:'力みが空回りしている姿。立て直そうとする動き（握り直し）が、かえって「まだ崩れている」ことを強く見せる。'});
recoverCard({id:'r_rec',f:'red',bg:'red',n:'ブレイク：斬られて、肩をいからせて構え直す',P:R_BRK,idle:idleOf('r_idle'),snap:4,
 react:(P,a,b)=>{const A=kb(a,7),Bk=kb(b,9);ADD(P,{x:4*A+7*Bk,lean:-.15*A-.22*Bk,hd:-.25*A-.35*Bk})},
 fx:(B,J,t,R0)=>{if(J.head&&t<R0)breath(B,add(J.head,[-4,2]),t%24,false)},
 cap:'崩れたまま斬られ、大きくのけぞる。二太刀目のあと、踏みしめて肩をいからせ、切っ先をこちらの顔へ向け直す（斬られるほど力む）。',why:'やられと同じ性格。立て直しは怒りの力みで、行き過ぎも大きい。'});

/* ---------- 赤い門のぬし：剣と触手 ---------- */
parriedCard({id:'f_pry',src:'f_sa',minX:-20,n:'パリィされ：剣と触手の三連（小・小→大）',kit:knightKit({two:1}),rx:[{kind:'s'},{kind:'s'},{kind:'b',T:P=>Object.assign(TENT_B(P),{ua2:P.ua2,fa2:P.fa2})}],
 fx:(B,J,t,Hc,stop)=>{const d=t-(Hc[2]+stop);if(d>=0&&d<30&&J.sc)leak(B,J.sc,t)},
 cap:'剣の二撃は小。最後の触手を弾かれると、触手が縮んで逃げ、体ごとのけぞる。胸の口から、くらやみが漏れる。',
 why:'赤い騎士の剣の型に、触手の反射が混ざる（暗い門のぬしと同じ「縮んで逃げる」）。'});
const F_BRK=kBrk('fallen',{bob:.9});
parriedCard({id:'f_brk',src:'f_arm',minX:-20,n:'ブレイク：二つの世界線がずれる',len:200,kit:knightKit({two:1}),rx:[{kind:'b',T:TENT_B}],brk:{at:6,P:F_BRK},
 pp:(P,t,Hc,stop)=>{const T0=Hc[0]+stop+16;if(t>=T0&&(t%40)<6)P.x=(P.x||0)+((t&2)?3:-3)},
 fx:(B,J,t,Hc,stop)=>{if(t>=Hc[0]+stop+10&&J.sc)leak(B,J.sc,t)},
 cap:'四度目を弾かれると、切っ先が落ち、頭が垂れる。ときどき体が左右にずれて二重に見え（重なった二つの世界線がずれる）、胸の口からくらやみが漏れる。',
 why:'やられの「ずれ」が、崩れているあいだ何度も起きる。重なりを保つ力が弱っている。'});
recoverCard({id:'f_rec',f:'fallen',bg:'hole',n:'ブレイク：斬られて、重なり直す',P:F_BRK,idle:idleOf('f_idle'),
 react:(P,a,b)=>{const A=kb(a,6),Bk=kb(b,8);ADD(P,{x:3*A+5*Bk,lean:-.1*A-.15*Bk,hd:-.25*Bk})},
 fx:(B,J,t,R0)=>{if(t<R0&&J.sc)leak(B,J.sc,t)},
 cap:'斬られたあと、ずれていた体がぴたりと重なり直し、構えに戻る。',why:'重なりが戻る＝すきが閉じた合図。'});

/* ---------- 第二形態：本体が崩れても、映り姿は崩れない ---------- */
const F2_BRK=kBrk('fallen2',{bob:.9}),F2IDL=idleOf('f2_idle');
const f2post=(B,J,t)=>{water(B,t);reflection(B,t,'red',F2IDL(t),EXX)};
parriedCard({id:'f2_pry',src:'f2_tsubame',minX:-20,n:'パリィされ：つばめ返し（小→大）',kit:knightKit({two:1}),rx:[{kind:'s'},{kind:'b'}],
 post:(B,J,t)=>{water(B,t);reflection(B,t,'red',J.P||{},EXX)},
 cap:'本体の崩れ方は赤い騎士の型と同じ（小は刃がはね上がって次へ、大は両手のまま頭上へはね上げられてのけぞる）。水面の映り姿も、同じように弾かれる。',
 why:'弾かれるところまでは、本体と映り姿が連動する（決まりどおり）。ちがいが出るのはブレイクから。'});
parriedCard({id:'f2_brk',src:'f2_tsubame',minX:-20,n:'ブレイク：本体だけが崩れる',len:230,kit:knightKit({two:1}),rx:[{kind:'s'},{kind:'b'}],brk:{at:6,P:F2_BRK},
 post:(B,J,t,Hc,stop)=>{if(t>=Hc[1]+stop+6){water(B,t);reflection(B,t,'red',F2IDL(t),EXX)}else{water(B,t);reflection(B,t,'red',J.P||{},EXX)}},
 fx:(B,J,t,Hc,stop)=>{if(t>=Hc[1]+stop+10&&J.sc)leak(B,J.sc,t)},
 cap:'四度目を弾かれると、本体は切っ先を落として頭を垂れ、くらやみが漏れる。でも水面の映り姿だけは、構えたまま少しも崩れない。',
 why:'崩れるのは、くらやみの殻（本体）だけ。のまれる前の赤い騎士（映り姿）は崩れない＝主人公の剣は殻にしか届かない（やられと同じ設定）。'});
recoverCard({id:'f2_rec',f:'fallen2',bg:'hole',n:'ブレイク：斬られて、映り姿に合わせて立つ',P:F2_BRK,idle:F2IDL,
 react:(P,a,b)=>{const A=kb(a,6),Bk=kb(b,8);ADD(P,{x:3*A+5*Bk,lean:-.1*A-.15*Bk,hd:-.25*Bk})},
 fx:(B,J,t,R0)=>{if(t<R0&&J.sc)leak(B,J.sc,t)},post:(B,J,t)=>f2post(B,J,t),
 cap:'斬られたあと、本体が水面の映り姿と同じ構えへ、ぴたりと戻る。',why:'映り姿は一度も崩れていない。本体がそこへ「合わせ直す」。'});

/* ---------- くらやみの竜：頭がはね上がり、形を保てずに溶けかける ---------- */
const D_KIT=(kind,th,P)=>kind==='s'?{nx:(P.nx||0)-14,ny:(P.ny||0)-10,hy:(P.hy||0)-6,jaw:.95,x:(P.x||0)+3}:{x:(P.x||0)+12,nx:-10,ny:-10,hy:-9,jaw:1,lift:5,wing:.8,quiver:1};
const D_BRK=t=>{const b=Math.sin(t*TAU_/100);return{cr:5+b*.6,ny:5+b*.5,hy:4,nx:2,jaw:.45+Math.max(0,Math.sin(t*.13))*.1,wing:-.5,melt:.36+b*.06,quiver:t%50<10?.5:0}};
parriedCard({id:'d_pry',src:'d_stab',n:'パリィされ：三度の噛みつき（小・小→大）',kit:D_KIT,rx:[{kind:'s'},{kind:'s'},{kind:'b'}],
 cap:'噛みつきを弾かれるたび、頭が上へはね上げられて口が開ききり、すぐ首を縮めて次の噛みつきの構えへ。三度目を弾かれると、頭ごと体が後ろへのけぞって立ち上がりかけ、扇が開き、全身がふるえる。',
 why:'竜で弾かれる部位は頭（牙）。小は頭だけ、大は体ごと。剣の騎士と同じ「部位だけ／体ごと」の二段。'});
parriedCard({id:'d_brk',src:'d_feel',n:'ブレイク：形を保てず、溶けかける',len:220,kit:D_KIT,rx:[{kind:'b'}],brk:{at:6,P:D_BRK},
 cap:'四度目を弾かれると、低く崩れ、あごが床につく。扇がたたまれ、尾の側から体が床のくらやみへ溶けかけたまま、形に戻りきれない。ときどき震える。',
 why:'くらやみが「竜のまね」をしている生き物なので、崩れると「まね」が保てない（ひまなときの溶けかけと同じ動き）。崩れ＝正体がのぞく。'});
recoverCard({id:'d_rec',f:'dragon',ox:4,bg:'lord',n:'ブレイク：斬られて、竜の形に戻る',P:D_BRK,idle:idleOf('d_idle'),snap:6,
 react:(P,a,b)=>{const A=kb(a,6),Bk=kb(b,8);P.x=(P.x||0)+3*A+5*Bk;P.jaw=Math.max(P.jaw,A,Bk);P.quiver=Math.max(P.quiver||0,A,Bk)},
 cap:'崩れたまま斬られると、声のない叫び。二太刀目のあと、溶けかけた体がいっせいに竜の形へ戻り、頭を上げて構える。',why:'形に戻る＝「まね」をやり直す。戻りは一気に、少し行き過ぎて（頭が上がりすぎて）収まる。'});

/* ---------- 三つ首の竜：弾かれた指だけが縮む ---------- */
const H_ORDER=[2,0,1];
const H_KIT=(kind,th,P,w,i)=>{const f=H_ORDER[i];return kind==='s'?{['f'+f]:.12,['j'+f]:1}:{f0:0,f1:0,f2:0,j0:1,j1:1,j2:1,spread:.8,quiver:1}};
/* ブレイク：痛みで崩れるのではなく、上位の存在が一瞬こちらから目を離す。三本は動きを止め、指先の目はそろって裂け目の奥をふり向き、放っておかれた亡骸の頭ががくんと垂れる */
const H_BRK=t=>({rift:1,away:1,f0:0,f1:0,f2:0,j0:.1,j1:.1,j2:.1,spread:0,curl:0,quiver:0,droopC:1.2});
parriedCard({id:'h_pry',src:'h_order',n:'パリィされ：鳴いた数（小・小→大）',kit:H_KIT,rx:[{kind:'s'},{kind:'s'},{kind:'b'}],
 pp:(P,t,Hc,stop)=>{Hc.forEach((H,i)=>{const d=t-H;if(d>=0&&d<6)P['snap'+H_ORDER[i]]=1})},
 cap:'弾かれた指だけが、関節を鳴らして（ポキッ）付け根まで縮み、口が開く。ほかの指は止まらずに次の噛みつきへ。最後の指を弾かれると、三本ともいっせいに縮んで広がり、手がふるえる。',
 why:'弾かれ方も「別々の指」。痛みも驚きも、弾かれた一本にしか届かない。最後の大で「三本は一つの手」だとわかる（手の手がかり）。'});
parriedCard({id:'h_brk',src:'h_one',n:'ブレイク：こちらから目を離す',len:200,kit:H_KIT,rx:[{kind:'b'}],brk:{at:6,P:H_BRK,star:J=>J.fingers?add(J.fingers[1],[0,-10]):null},
 cap:'四度目を弾かれると、三本の指がぴたりと止まり、指先の目がそろって裂け目の奥（向こう側）をふり向く。持ち主に放っておかれた竜の亡骸の頭が、がくんと垂れる。何も動かない。頭の上を、うすい青の星が回る。',
 why:'上位の存在は、こちらの攻撃で弱ったりしない。すきは「こちらが強いから」ではなく「向こうが見ていないから」生まれる（上位の存在は、どの枝にも気づいていない）。「目」は上位の存在の視線。指が弱って垂れる形にすると、上位の存在が安く見える。'});
recoverCard({id:'h_rec',f:'hydra',bg:'hole',n:'ブレイク：目が、一瞬でこちらへ戻る',P:H_BRK,idle:()=>Object.assign({},HI,{away:0,droopC:0}),snap:3,star:J=>J.fingers?add(J.fingers[1],[0,-10]):null,
 react:(P,a,b)=>{P.snap1=a>=0&&a<6||b>=0&&b<6?1:0},
 cap:'斬られても、三本はふり向いたまま。斬られた指が関節を一度鳴らすだけ。二太刀目のあと、三本の指先の目が、一瞬でいっせいにこちらへ向き直る。亡骸の頭も、糸で吊られたように持ち上がる。',
 why:'戻りはゆっくりにしない（すきが閉じたことを一瞬で見せる）。ずっと向こうを見ていたものが、急にこちらを見る。'});


/* 種類に入れる（イノシシの「壁に激突」は、やられではなく、パリィされ（大）） */
Object.assign(MCAT_PARRY,{gate:['g_pry'],dgate:['dg_pry'],lord:['l_pry','l_pryT'],lord2:['l2_pry'],red:['r_pry','r_pryT'],red2:['r2_pry','r2_pryT'],fallen:['f_pry'],fallen2:['f2_pry'],dragon:['d_pry'],hydra:['h_pry'],boar:['b_wall'],boarM:['bM_wall']});
Object.assign(MCAT_BREAK,{gate:['g_brk','g_rec'],dgate:['dg_brk','dg_rec'],lord:['l_brk','l_rec'],lord2:['l2_brk','l2_rec'],red:['r_brk','r_rec'],red2:['r2_brk','r2_rec'],fallen:['f_brk','f_rec'],fallen2:['f2_brk','f2_rec'],dragon:['d_brk','d_rec'],hydra:['h_brk','h_rec'],boar:['b_brk','b_rec'],boarM:['bM_brk','bM_rec']});
for(const k of['boar','boarM'])MCAT_HURT[k]=(MCAT_HURT[k]||[]).filter(id=>!/_wall$/.test(id));
