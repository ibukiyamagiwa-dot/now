/* ===== やられ（主人公の攻撃を受ける）と、足りなかった出現 =====
   主人公の斬りかかり：駆け寄る → 振りかぶって止まる（静） → 3Fで斬り下ろす（動） → 追撃の斬り上げ → 跳び退く。
   当たった瞬間に敵が白く光り、4Fだけ止まる（ヒットストップ）。そのあとの崩れ方は、敵ごとの設定で変える。
   主人公の剣の跡と火花は、合図の4色（白・赤・金・紫）と取り違えないよう、うすい青で描く。 */
const HH1=27,HH2=39,HSTOP=4,HSL=['#dff2ff','#8ab8e0','#5a7ca8'];
const TAU=Math.PI*2;
/* 主人公の姿勢：角度は描く向き（0＝右、π＝左）。振りの向きが補間で逆回りしないよう、同じ角度を2πずらして書く。
   剣は腕で振る：刃は拳から前腕の続きで出し、手首を下へ折らない（手首の向き＝剣−前腕は＋0.5前後）。剣先を下げるときは腕ごと下げる */
const HUP={ua:-1.9,fa:-2.3,sw:-1.2,lean:-.1,cr:1,ff:-8,fb:6},HDN={ua:-3.5,fa:-3.75,sw:-3.25,lean:.3,ff:-10,fb:6},HDN2={ua:-3.7,fa:-3.95,sw:-3.45,lean:.35,ff:-10,fb:6,cr:1},HUPS={ua:-2.5,fa:-2.2,sw:-1.7,lean:.15,ff:-10,fb:6},HREST={ua:2.7-TAU,fa:3.2-TAU,sw:-2.35};
function heroAtk(X,L){const l=L||0,A=(x,o)=>Object.assign({x,lift:l},o);return{keys:[K(0,{lift:0}),K(10,{lift:0}),K(20,A(X*.88,HUP),'out'),K(24,A(X*.88,HUP)),K(HH1,A(X,HDN),'in'),K(HH1+HSTOP+2,A(X,HDN2)),K(HH2-3,A(X,HDN2)),K(HH2,A(X,HUPS),'in'),K(HH2+HSTOP+3,A(X,HUPS)),K(HH2+20,Object.assign({x:X*.15,lean:-.1,lift:0},HREST),'out'),K(HH2+28,Object.assign({lift:0},HREST)),K(400,Object.assign({lift:0},HREST))]}}
/* 敵の当たり：白い光（2F）とヒットストップ */
const kb=(a,dur)=>a<0?0:a<4?Math.sin(a/4*Math.PI/2):Math.exp(-(a-4)/dur);/* やられの姿勢へは約4Fかけて移る（止めきらない）＝「8つのヒットストップ仕様」 */
function hitT(t,h){return t<h?-1:t-h}/* 斬られた側は止めない。止めるのは主人公の剣だけ */
const FLASH={};function flashSpec(key){if(FLASH[key])return FLASH[key];const S=SPEC[key],dr=S.draw||knight;
 return FLASH[key]=Object.assign({},S,{draw:(B,ox,oy,S2,P,T)=>{const T2=new Buf(B.w,B.h);const J=dr(T2,ox,oy,S,P,T);if(key==='hydra')for(let i=0;i<T2.c.length;i++)if(T2.c[i]){B.c[i]=T2.c[i];B.t[i]=T2.t[i]}const only=key==='hydra'?new Set([...HSK,...HNAIL,...HPAD]):null;for(let i=0;i<T2.c.length;i++)if(T2.c[i]&&(!only||only.has(T2.c[i]))){B.c[i]=T2.t[i]===1?'#fbf8ff':T2.c[i];B.t[i]=T2.t[i]}return J}})}
/* 敵の前のはし（主人公が届く場所）をはかる */
const FRONT={};function frontOf(I){if(FRONT[I.id])return FRONT[I.id];const S=SPEC[I.f];if(!S.draw){/* 騎士の姿：剣は前に出ているので、胴（腰）の位置で測る */const P=Object.assign({},PDEF,S.pose,poseAt0(I,0,Object.assign({},PDEF,S.pose)));if(I.pp)I.pp(P,0);const J=joints(EXX+(I.ox||0),FL,S,P);return FRONT[I.id]={x:Math.round(J.hip[0]-7*S.k),y:Math.round(J.hip[1]-9*S.k)}}const M=Object.assign({},I,{noHero:true,cues:[],hits:[]}),B=frame(M,0);let fx=CW,ys=[];for(let x=40;x<CW;x++){for(let y=FL-44;y<FL-3;y++)if(B.tag(x,y)===1){if(x<fx){fx=x;ys=[]}if(x<fx+6)ys.push(y)}if(fx<CW&&x>fx+6)break}
 return FRONT[I.id]={x:fx,y:ys.length?Math.round(ys.reduce((a,b)=>a+b,0)/ys.length):FL-20}}
/* 剣の跡（うすい青の三日月）と火花 */
function heroSlash(B,c,d,up){if(d<0||d>=6)return;const r=11,a0=up?2.2:-2.2,a1=up?.4:-.4;for(let i=0;i<=24;i++){const t=lerp(a0,a1,i/24),w=Math.sin(i/24*Math.PI)*2.2*(1-d/6);for(let j=0;j<=w;j++)B.set(c[0]+Math.cos(t)*(r-j)-4,c[1]+Math.sin(t)*(r-j)*.9,j?HSL[1]:HSL[0],4)}}
function heroSpark(B,c,d){if(d<0||d>=9)return;for(let i=0;i<10;i++){const a=i/10*TAU+.3,r=2+d*1.5;B.set(c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r*.8,i%2?HSL[1]:HSL[0],4)}if(d<3)for(let i=-3+d;i<=3-d;i++){B.set(c[0]+i,c[1],HSL[0],4);B.set(c[0],c[1]+i,HSL[0],4)}}
const INKC=['#0c0614','#22142e','#4e2c70'];
function ooze(B,c,d,n,cols){if(d<0||d>26)return;for(let i=0;i<n;i++){const h=hsh(i,7),a=-2.6+h*2.2,v=.9+hsh(i,3)*1.2,x=c[0]+Math.cos(a)*v*d*.9+3,y=c[1]+Math.sin(a)*v*d*.9+.05*d*d;if(y<FL)B.set(x,y,cols[i%cols.length],4)}}
function puff(B,p,d,col){if(d<0||d>20)return;for(let i=0;i<5;i++){const q=[p[0]-2-d*.35-i*.6,p[1]-d*.25+Math.sin(i+d*.3)];if((d+i)%3)B.set(q[0],q[1],col||'#8a8490',5)}}

/* やられのカードを作る。o.react(P,a,b,t)：立ち絵の姿勢に足す。o.fx(B,J,t,a,b,hp)：設定ごとの飾り */
function hurtMove(key,id,o){const I=MV.find(m=>m.f===key&&/_idle$/.test(m.id)),base=Object.assign({},PDEF,SPEC[key].pose),F=o.hp?{x:o.hp[0],y:o.hp[1]}:frontOf(I),X=Math.min(-4,-((F.x+(o.dig||4))-22-25)/.72),HM=heroAtk(X,o.lift),hp=[F.x+(o.dig||4),F.y+(o.dy||0)];
 return mv({f:key,ox:I.ox,id,n:o.n||'やられ：主人公の斬りかかり',bg:I.bg,len:o.len||130,noHero:true,keys:[K(0,{})],cap:o.cap,why:o.why,
  fAt:t=>(t>=HH1&&t<HH1+2)||(t>=HH2&&t<HH2+2)?key+'@w':key,
  pp:(P,t)=>{const tt=t%I.len;Object.assign(P,poseAt0(I,tt,base));if(I.pp)I.pp(P,tt);const a=hitT(t,HH1),b=hitT(t,HH2);
   for(const h of[HH1,HH2])if(t>=h&&t<h+HSTOP+2)P.x=(P.x||0)+((t&1)?1:-1)*1.6*(1-(t-h)/(HSTOP+2));/* ヒットストップの震え：斬られた側を大きく、横にだけ、だんだん小さく */
   o.react(P,a,b,t)},
  pre:I.pre,
  fx:(B,J,t,S,M)=>{if(I.fx)I.fx(B,J,t%I.len,S,M);if(o.fx)o.fx(B,J,t,hitT(t,HH1),hitT(t,HH2),hp)},
  post:(B,J,t,S)=>{if(o.post)o.post(B,J,t);else if(I.post)I.post(B,J,t%I.len,S);drawHeroSmall(B,t,false,poseAt0(HM,t,PDEF));heroSlash(B,hp,t-HH1,false);heroSlash(B,[hp[0],hp[1]-2],t-HH2,true);heroSpark(B,hp,t-HH1);heroSpark(B,[hp[0]+1,hp[1]-3],t-HH2)}})}
for(const k of Object.keys(SPEC))if(!k.includes('@'))SPEC[k+'@w']=flashSpec(k);

/* ---------- 門の系統 ---------- */
const ADD=(P,o)=>{for(const[k,v]of Object.entries(o))P[k]=(P[k]||0)+v};
hurtMove('gate','g_hurt',{react:(P,a,b)=>{const A=kb(a,6),Bk=kb(b,9);ADD(P,{x:4*A+7*Bk,lean:-.22*A-.3*Bk,hd:-.25*A-.3*Bk,cr:2*Bk})},
 fx:(B,J,t,a,b)=>{const d=b-14;if(d>=0&&d<6&&J.hdF&&J.hdB){const c=LP(J.hdF,J.hdB,.5);for(let i=0;i<6;i++){const q=add(c,dir(i*1.05+d*.4,2+d));B.set(q[0],q[1],HSL[1],4)}}},
 cap:'斬られると、体ごと後ろへ押される。でも腕は交差させたまま、ほどかない。二太刀目で腰が落ち、立ち直るときに交差した剣どうしが「キン」と鳴って構えに戻る。',
 why:'交差の構えは「ここは通さない」の印。斬られても、門番の仕事はほどけない。強くはないが、退かない者のやられ方。'});
hurtMove('dgate','dg_hurt',{react:(P,a,b,t)=>{const A=kb(a,7),Bk=kb(b,10);ADD(P,{x:4*A+6*Bk,lean:-.2*A-.25*Bk,hd:.3*Bk});if(b>8&&b<40)P.x+=(t%5<2?.8:0)},
 fx:(B,J,t,a,b,hp)=>{ooze(B,hp,a,10,INKC);ooze(B,[hp[0],hp[1]-3],b,14,INKC);const d=b;if(d>=0&&d<26&&J.hip){/* 背中の触手が反射で跳ねる（光らない＝攻撃ではない） */const u=Math.sin(Math.min(1,d/10)*Math.PI),r=add(J.hip,[5*J.k,-8*J.k]);tentacle(B,r,add(r,[8*u+3,-10*u-2]),add(r,[14*u+2,-4*u-1]),1.8*J.k,.4,false)}},
 cap:'斬られたところから、血ではなく、紫のふちの黒いくらやみがしみ出る。二太刀目で、背中から触手が反射的に跳ねて、すぐ戻る。光らないので攻撃ではない。しばらく小刻みに震える。',
 why:'体の中身は、もうくらやみに置きかわりかけている。触手が勝手に動くのは、本人の意思ではない。まだ人の形をしているぶん、のまれかけが痛々しく見える。'});
hurtMove('lord','l_hurt',{react:(P,a,b)=>{const A=kb(a,5),Bk=kb(b,12);ADD(P,{x:1.2*A+2*Bk,lean:-.08*A-.06*Bk,cr:2.5*Bk})},
 fx:(B,J,t,a,b,hp)=>{for(const d of[a,b])if(d>=0&&d<14)for(let i=0;i<5;i++){const x=(J.ank?J.ank[0]:hp[0]+14)+i*2+d*.4,y=FL-((i*3+d)%3);B.set(x,y,'#4a4058',5)}
  if(b>=2&&b<30&&J.sc){/* 封印のひびから、くらやみの筋が一本走る */const n=Math.min(6,b/2);for(let i=0;i<n;i++)B.set(J.sc[0]-1+i*.3,J.sc[1]+2+i,INKC[1],4)}},
 cap:'ほとんど下がらない。斬られても足が床を少し削るだけで、二太刀目では腰を沈めて受け止める。胸の封印のひびから、くらやみの筋が一本走る。',
 why:'ぬしは門そのものを背負っている。重いものは、押されても動かない。かわりに、傷はいつも封印のひびへ向かう＝くらやみは中から来ている。'});
hurtMove('lord2','l2_hurt',{react:(P,a,b,t)=>{const A=kb(a,6),Bk=kb(b,9);ADD(P,{x:2*A+4*Bk,lean:-.12*A-.2*Bk,hd:-.2*Bk})},
 fx:(B,J,t,a,b,hp)=>{ooze(B,hp,a,12,INKC);ooze(B,hp,b,18,INKC.concat(['#ff3050']));if(b>=0&&b<22){/* 傷口から、細い触手が三本はじけ出て、すぐ引っこむ */const u=Math.sin(Math.min(1,b/9)*Math.PI);for(let i=0;i<3;i++){const a2=-2.4+i*.55,L=(6+i*2)*u;tentacle(B,hp,add(hp,dir(a2,L*.5)),add(hp,dir(a2+.4,L)),1.2,.3,false)}if(b>=3&&b<7){B.set(hp[0]+1,hp[1],'#ff3050',4);B.set(hp[0]+2,hp[1],'#ff3050',4)}}},
 cap:'斬られたところが裂けて、くらやみが噴き出す。二太刀目では、傷口から細い触手が三本はじけ出し、その奥で赤い目が一瞬だけ開く。触手はすぐ引っこむ。光らないので攻撃ではない。',
 why:'もう斬っても「人」には届かない。斬るたびに、中にいるものが顔を出す。禍々しい者に共通の「くらやみが裂けて赤い目」は、攻撃のときだけでなく、やられでも見せる。'});

/* ---------- 赤の系統 ---------- */
hurtMove('red','r_hurt',{len:140,react:(P,a,b,t)=>{const A=kb(a,6),Bk=kb(b,8);ADD(P,{x:5*A+9*Bk,lean:-.28*A-.38*Bk,hd:-.3*A-.35*Bk});
  if(b>14&&b<60){/* 怒りで前へ：踏みこんで肩をいからせ、肩で速く息をする */const u=Math.min(1,(b-14)/5)*Math.max(0,1-(b-40)/20);ADD(P,{lean:.22*u,cr:2*u+Math.sin(b*.6)*.8*u,x:-2*u})}},
 fx:(B,J,t,a,b)=>{if(b>16&&b<70&&J.head)for(const s of[0,17,34])breath(B,add(J.head,[-4,2]),b-16-s);/* 肩で速く息をする（約35Fで一往復の半分ずつ） */const d=b-16;if(d>=0&&d<8)for(let i=0;i<5;i++)B.set((J.ank?J.ank[0]:EXX)-4+i*2,FL-(i%2),'#5a4448',5)},
 cap:'大きくのけぞり、二太刀目で後ろへよろめく。すぐに前の足で床を踏みしめ、肩をいからせて前へ乗り出し、肩で速く息をする。斬られるほど、力みが強くなる。',
 why:'彼から見れば、主人公は「決して開けてはならない門」を開けた侵略者。痛みより、倒さねばという気持ちが先に出る＝力み。'});
hurtMove('red2','r2_hurt',{len:140,react:(P,a,b)=>{const A=kb(a,4),Bk=kb(b,5);ADD(P,{x:1.2*A+2.2*Bk,lean:-.05*A-.07*Bk});if(b>10&&b<34){const u=Math.sin((b-10)/24*Math.PI);ADD(P,{cr:2*u})}},
 fx:(B,J,t,a,b)=>{if(J.head)breath(B,add(J.head,[-4,2]),b-12,true)},
 cap:'半歩も下がらない。切っ先はこちらの目に向いたまま、構えはくずれない。二太刀目のあと、腰を一度だけ深く沈めて、息をひとつ吐く。それだけ。',
 why:'本気は「削ぎ落とし」。痛みも怒りも、動きの無駄として捨てている。斬られたことを、息ひとつで飲みこむ。'});
hurtMove('fallen','f_hurt',{react:(P,a,b,t)=>{const A=kb(a,6),Bk=kb(b,8);ADD(P,{x:3*A+5*Bk,lean:-.15*A-.2*Bk});for(const d of[a,b])if(d>=0&&d<10)P.x+=(d%2?5:-4)*(1-d/10)},
 fx:(B,J,t,a,b,hp)=>{ooze(B,hp,b,12,INKC);for(const d of[a,b])if(d>=0&&d<10&&d%2===0){/* ずれた輪郭：一瞬、体が二重に見える（横の線） */for(let y=FL-46;y<FL;y+=3)if((y+d)%7<2)for(let x=hp[0]-2;x<hp[0]+26;x++)if(B.tag(x,y)===1&&(x+y)%2)B.set(x+6,y,'#6a1a2a',4)}},
 cap:'斬られた瞬間、体が左右にずれて、二重に見える。数コマで元に戻る。二太刀目では、傷からくらやみがこぼれる。',
 why:'二つの世界線が重なったまま、まだ一つに定まっていない。強い力を受けると、重なりがずれる。立ち絵の「ときどき、ずれる」と同じ現象。'});
hurtMove('fallen2','f2_hurt',{react:(P,a,b)=>{const A=kb(a,6),Bk=kb(b,9);ADD(P,{x:3*A+5*Bk,lean:-.15*A-.22*Bk,cr:1.5*Bk})},
 post:(B,J,t)=>{water(B,t);reflection(B,t,'red',{},EXX);for(const d of[t-HH1,t-HH2])if(d>=0&&d<24){const r=3+d*1.4;for(let i=0;i<20;i++){const a=i/20*TAU;if(Math.sin(a)>0)continue;B.set(EXX+Math.cos(a)*r,FL+3+Math.sin(a)*-r*.25,'#6a6080',4)}}},
 cap:'本体は斬られてよろめく。でも足元の水面の映り姿は、少しも揺れない。波紋だけが広がる。',
 why:'映り姿は、のまれる前の本当の姿。主人公の剣は、くらやみの殻にしか届かない。斬れるのは殻だけで、映り姿は最後まで斬れない（とどめで入れかわるまで）。'});

/* ---------- 竜 ---------- */
hurtMove('dragon','d_hurt',{dig:6,react:(P,a,b,t)=>{const A=kb(a,7),Bk=kb(b,10);ADD(P,{x:3*A+5*Bk,jaw:.6*A+1*Bk,quiver:.6*A+.8*Bk,cr:1.5*Bk});if(b>4&&b<40)P.melt=(P.melt||0)+.28*Math.sin((b-4)/36*Math.PI)},
 fx:(B,J,t,a,b,hp)=>{ooze(B,hp,a,10,INKC);ooze(B,hp,b,16,INKC)},
 cap:'斬られると口を開けて声のない叫びを上げ、体がふるえる。二太刀目では、斬られたところから体がくずれかけ、床に溶けそうになってから、形に戻る。',
 why:'くらやみが「竜のまね」をしているだけなので、強く斬られると形を保てなくなる。影もぐりで体を捨てられるのと同じ性質。'});
hurtMove('hydra','h_hurt',{hp:[66,FL-38],dig:0,lift:16,react:(P,a,b,t)=>{const A=kb(a,6),Bk=kb(b,9);P.snap1=Math.max(P.snap1||0,A>.3?1:0);P.snap0=Math.max(P.snap0||0,Bk>.4?1:0);P.curl=(P.curl||0)+.3*A+.4*Bk;P.j0=(P.j0||0)+Bk;P.j1=(P.j1||0)+A+Bk;P.j2=(P.j2||0)+Bk},
 cap:'主人公は亡骸を踏み台に跳び、指を斬る。斬られた指だけが、関節をポキッと鳴らしてかくっと折れ、裂け目へ少し引っこむ。二太刀目では三本とも口を開けて縮む。竜の亡骸は、まったく動かない。',
 why:'痛がるのは指だけ。亡骸はただの通り道なので、何も感じない。斬るたびに「この竜は死んでいる」ことがはっきりする。'});

/* ---------- 中ボスとモブ ---------- */
for(const key of['boar','boarM']){const M_=key==='boarM';hurtMove(key,M_?'bM_hurt':'b_hurt',{dig:3,react:(P,a,b,t)=>{const A=kb(a,6),Bk=kb(b,9),s=M_?.55:1;ADD(P,{x:(3*A+6*Bk)*s,hd:-.6*A-.5*Bk,jaw:A+Bk,brs:1});if(b>=0&&b<30){P.trem=1;P.blink=b<6?1:0}
  if(M_&&b>16&&b<40)P.look=(P.look||0)+Math.sin((b-16)*.7)*.4*(1-(b-16)/24)},
 fx:(B,J,t,a,b)=>{const d=b;if(d>=0&&d<10)for(let i=0;i<5;i++)B.set(J.hoofs&&J.hoofs[3]?J.hoofs[3][0]+2+i*2:EXX,FL-(i%2),'#4a4048',5)},
 cap:M_?'鳴いて頭をはね上げるが、ほとんど下がらない。二太刀目のあと、首を左右に振って、たてがみを鳴らしてから構え直す。':'キッと鳴いて頭をはね上げ、二太刀目で後ろへずり下がる。足が床を削り、しばらく震えて、白目をむいたまま構え直す。',
 why:M_?'何度も壁にぶつかってきた年寄りは、斬られ慣れている。首を振るのは、痛みを振り払う癖。':'おびえた獣は、斬られても逃げない。逃げ道は主人公のうしろにしかないから。'})}

/* ===== 足りなかった出現 ===== */
/* 赤い騎士：門のぬしが倒れた瞬間、門が一度だけ揺らぎ、向こうの世界線から歩み出てくる */
SPEC['red@enter']=Object.assign({},SPEC.red,{draw:(B,ox,oy,S,P,T)=>{const T2=new Buf(B.w,B.h),J=knight(T2,ox,oy,SPEC.red,P,T),r=P.rev||0;
 for(let i=0;i<T2.c.length;i++){if(!T2.c[i])continue;const x=i%B.w,y=Math.floor(i/B.w);if(r>=1||hsh(x,y)<r*1.15){B.c[i]=r>=1?T2.c[i]:mix(T2.c[i],'#9ab0d0',(1-r)*.55);B.t[i]=T2.t[i]}}return J}});
const RLOW={ua:1.75,fa:1.65,sw:2.35,ua2:1.6,fa2:1.5,sw2:null,lean:-.04,cr:0};
mv({f:'red',id:'r_enter',fAt:t=>t<76?'red@enter':'red',n:'登場：門の揺らぎから',bg:'red',len:170,
 keys:[K(0,Object.assign({x:8,rev:0},RLOW)),K(30,Object.assign({x:8,rev:0},RLOW)),K(58,Object.assign({x:8,rev:1},RLOW),'lin'),K(62,Object.assign({x:8,rev:1,ff:-9,fb:5},RLOW)),K(72,Object.assign({x:3,rev:1,ff:-4,fb:8},RLOW)),K(80,Object.assign({x:0,rev:1},RLOW)),K(98,Object.assign({x:0,rev:1},RLOW)),K(102,{x:0,rev:1},'in'),K(170,{rev:1})],
 pre:(B,t)=>{/* 揺らぐ縦の裂け目：銀青のふち、内側は向こうの世界線の色（赤い部屋のまま） */const cx=EXX+10;let w=0;if(t>=4&&t<18)w=.5;else if(t>=18&&t<62)w=lerp(1,15,Math.min(1,(t-18)/14));else if(t>=62&&t<80)w=15*(1-(t-62)/18);if(w<=0)return;
  for(let y=FL-52;y<=FL;y++){const ww=w+Math.sin(y*.45+t*.3)*1.5,e=Math.abs(Math.sin(y*.21+t*.17));for(let x=Math.floor(cx-ww);x<=cx+ww;x++){const ed=ww-Math.abs(x-cx);B.set(x,y,ed<1?(e>.5?'#9ab0d0':'#6a7ca0'):((x+y+t)%5?'#2a1a20':'#341f26'),6)}}},
 cap:'門のぬしが倒れた部屋に、縦に一本、銀青の揺らぎが走る。揺らぎが人の幅に開き、その中から、剣を下ろしたままの騎士が歩み出てくる。揺らぎが閉じると同時に、肩をいからせ、切っ先をこちらの顔に向ける。',
 why:'門は「向こう側」だけでなく、別の世界線ともつながる。揺らぎの奥に見えるのは、くらやみにのまれなかった世界線の、同じ部屋。彼は、門を開けた者を止めに来た。'});
/* 突進イノシシ：下から逃げてきて、主人公に出くわす */
mv({f:'boar',ox:BOAR.boar.ox,id:'b_enter',n:'登場：逃げてきて、出くわす',bg:'def',len:150,keys:[K(0,{})],
 pp:(P,t)=>{boarIdle(P,t);if(t<24){P.x=lerp(34,6,t/24);P.run=t/6;P.runA=1;P.gal=1;P.hd=.3;P.dust=1}
  else if(t<34){/* 主人公に気づいて急ブレーキ：頭を上げ、前足をつっぱり、床を削る */const u=(t-24)/10;P.x=lerp(6,0,Math.sin(u*Math.PI/2));P.hd=-.5;P.cr=-1;P.brs=1.5;P.dust=1;P.runA=0}
  else if(t<70){P.hd=-.3;P.brs=1.5;P.trem=1;P.look=t<50?.6:0;P.x=t<50?0:lerp(0,3,(t-50)/20)}
  else{const u=Math.min(1,(t-70)/14);P.x=3;P.hd=lerp(-.3,0,u);P.brs=lerp(1.5,.3,u);P.trem=1-u}},
 cap:'奥から走ってくるが、主人公に気づいて前足をつっぱり、床を削って止まる。一度うしろ（来た方）をふり返り、たてがみを逆立てて半歩さがり、頭を下げて構える。',
 why:'追ってくるものと、目の前の主人公にはさまれた。ふり返るのは、下の階を気にしているから。逃げ道がないので、ふさぐ者に向かうしかない。'});
mv({f:'boarM',ox:BOAR.boarM.ox,id:'bM_enter',n:'登場：しんがりが来る',bg:'def',len:170,keys:[K(0,{})],
 pp:(P,t)=>{boarIdle(P,t);if(t<60){P.x=lerp(30,0,t/60);P.run=t/12;P.runA=.55;P.hd=.2}
  else if(t<90){/* 止まって頭を上げ、こちらのにおいを確かめる */P.hd=-.35;P.snort=(t%14<5)?1:0;P.brs=.6}
  else if(t<120){/* 首を振ってたてがみを鳴らす */const u=(t-90)/30;P.look=Math.sin(u*Math.PI*4)*.35*(1-u);P.brs=1.2;P.trem=.6}
  else{const u=Math.min(1,(t-120)/12);P.hd=lerp(-.1,0,u);P.brs=lerp(1.2,.3,u)}},
 cap:'群れのあとから、ゆっくり重い足どりで歩いてくる。止まって頭を上げ、鼻を鳴らしてこちらのにおいを確かめ、首を振ってたてがみを鳴らしてから、頭を下げる。地はかかない。',
 why:'しんがりは走らない。群れを先に行かせてから来る。地をかくのは赤い溜め突進の合図なので、登場では決してかかない（合図の意味をにごさない）。'});

/* ===== モーションの種類（出現・待機・攻撃・やられ・撃破） ===== */
const MCAT_ENTER={gate:['g_enter'],dgate:['dg_turn'],lord:['l_enter'],lord2:['l2_open'],red:['r_enter'],red2:['r_rage'],fallen:['f_rise'],fallen2:['f_swallow'],dragon:['d_enter'],hydra:['h_enter'],boarM:['bM_enter'],boar:['b_enter']};
const MCAT_DOWN={gate:['g_kneel'],dgate:['dg_down2'],lord:['l_kneel'],lord2:['l2_down'],red:['r_rage'],red2:['r2_last'],fallen:['f_swallow'],fallen2:['f2_end'],dragon:['d_down'],hydra:['h_down'],boarM:['bM_down'],boar:['b_down']};
const MCAT_HURT={gate:['g_hurt'],dgate:['dg_hurt'],lord:['l_hurt'],lord2:['l2_hurt'],red:['r_hurt'],red2:['r2_hurt'],fallen:['f_hurt'],fallen2:['f2_hurt'],dragon:['d_hurt'],hydra:['h_hurt'],boarM:['bM_hurt','bM_wall'],boar:['b_hurt','b_wall']};
const MCATS=[['all','すべて'],['enter','出現'],['idle','待機'],['atk','攻撃'],['hurt','やられ'],['down','撃破']];
function catOf(key,id){if((MCAT_ENTER[key]||[]).includes(id))return'enter';if((MCAT_DOWN[key]||[]).includes(id))return'down';if((MCAT_HURT[key]||[]).includes(id))return'hurt';
 if(/_(idle|bored)$/.test(id)||KINDOF(id)==='stand'||['h_toy','bM_look','dg_state','r_stance','d_rage'].includes(id))return'idle';return'atk'}
/* 一覧に入れる：出現→待機→攻撃→やられ→撃破の順。前の形態の演出（変身）は、次の形態の出現にも出す */
function movesFor(key){const own=(MOVES_OF[key]||[]).slice(),all=[...new Set([...(MCAT_ENTER[key]||[]),...own,...(MCAT_HURT[key]||[]),...(MCAT_DOWN[key]||[])])].filter(id=>MV.find(m=>m.id===id));const ord={enter:0,idle:1,atk:2,hurt:3,down:4};return all.sort((a,b)=>ord[catOf(key,a)]-ord[catOf(key,b)])}
