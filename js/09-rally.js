/* ===== 打ち合い（門のぬし・赤い騎士・赤い門のぬし）=====
   1) 金に光る「誘いのひと振り」を弾いたときだけ「打ち合い！」が始まる（弾けなければ始まらない）
   2) 始まると両者が間合いに踏み込み、画面の上下が締まる。目盛りで残りの合が見える
   3) 弾くたびに刃がぶつかって火花、次のひと振りは28Fおき。最後のひと振りの前は押し合いで溜めて一拍遅れる
   4) 途中で崩されると、重い「くずし斬り」が飛んでくる。弾ききれば打ち返し */
function trimEnd(){const live=G.strikes.filter(x=>!x.done);G.endT=Math.max(G.et+16,...live.map(x=>x.fake?x.end+8:x.impact+8+(x.ft||0)))}
function cancelS(x){if(!x.done){x.done=true;x.cx=true;x.cued=true}}
function rallyList(n,arm,dl,o){o=o||{};{const e=G.en;if(e&&e.finale&&!G.rp){const k=Math.floor((e.finFail||0)/2);if(k){const n2=Math.max(2,n-k);if(dl>=n2)dl=n2;n=n2}}}const R=P.cueF,L=[{pre:18,mv:'cut',m:1,rally:true,rallyOpen:true,nc:true}];
 /* 2合目以降の間合い：ふつう(+12)・詰め(+6)・溜め(+26)。最初・押し合い・最後は固定 */
 const mid=[];for(let i=2;i<n;i++)if(i!==dl)mid.push(i);
 const heavyAt=o.heavy&&mid.length?pick(mid):-1;
 /* フェイント：数で渡すと1回（その確率）。配列 [1回,2回,3回] で渡すと、回数ごとの確率で選び、入れる合をばらす（入れる合が足りなければその数まで） */
 let feints=new Set();
 if(Array.isArray(o.feint)){const r=Math.random();let acc=0,k=0;for(let j=o.feint.length-1;j>=0;j--){acc+=o.feint[j];if(r<acc){k=j+1;break}}k=Math.min(k,mid.length);if(k)feints=new Set(shuffle(mid.slice()).slice(0,k))}
 else if(o.feint&&mid.length&&Math.random()<o.feint)feints.add(pick(mid.filter(i=>i!==heavyAt).concat(mid.length===1?mid:[])));
 for(let i=1;i<=n;i++){const end=i===n,lk=i===dl,m2=arm&&i===2?'arm':i%2?'cut2':'cut';
  let g=R+(i===1?20:12)+(lk?18:0);if((o.vary||o.gapAll||o.gapAlt)&&i>=2&&!lk&&!end){const k=o.gapAll||(o.gapAlt?(i%2?'t':'m'):pick(['n','t','t','m']));g=k==='t'?R+6:k==='m'?R+26:g}
  if(feints.has(i)){L.push({fake:true,pre:6,mv:i%2?'cut':'cut2'});g=Math.max(g,R+32)}
  const hv=i===heavyAt;L.push({gap:g,cl:R,pre:12,mv:end?'cut':hv?'thr':m2,m:end?1.6:hv?1.5:1.2,red:end||hv,rally:true,rallyEnd:end,lock:lk,nc:true})}
 tipOnce('rally','金に光るひと振りを弾くと「打ち合い」が始まる　ぶつかるたびに構え直して光る　押し合いのあとのひと振りまで弾ききれ');return L}
function mkStrike(impact,o){const cl=P.cueF;return Object.assign({impact,cue:impact-cl,cl,beat:false,mv:'cut',proj:false,melee:false,start:impact-cl-8,ft:0,m:1,feint:false,red:false,boom:false,counter:false,dark:false,back:0,rhythm:false,rally:false,nc:false,res:null,done:false,cued:false},o)}
function rallyW(){return G.rally?G.rally.w||0:0}
function ENX(e){const w=e.kind==='lord'?rallyW():0;return EX+(HX+56-EX)*w+(G.rally?G.rally.kick:0)*w}
function lungeDist(e){/* 骨組みの影（?new）は体がのびるので、寄せは「のびた剣先が主人公の前【影の剣先が届く位置】に届く長さ」にする */if(e.kind==='shade'&&RIG.act(e))return Math.max(0,EX-heroX()-P.reachShade+RIG.reach(e)*(e.sc||1));const w=e.kind==='lord'?rallyW():0;return (e.lungeD||(e.kind==='dragon'?72:84))*(1-w)+14*w}
/* 持ち込み：門のぬしたちの連撃の最後（剣のひと振り）を、着弾の3F以内のぎりぎりで弾くと、そのまま打ち合いが始まる */
const MOCHI_F=3;
const rallyFoe=e=>!!e&&e.kind==='lord'&&['lord','red','fallen'].includes(e.key);
function canRallyFrom(s){const e=G.en;return!!(rallyFoe(e)&&!G.rp&&G.mode!=='tut'&&e.hp>0&&!e.broken&&s.res==='parry'&&s.pr!=null&&s.pr<=MOCHI_F&&!s.rally&&!s.fake&&!s.crush&&['cut','cut2','thr'].includes(s.mv)&&!(G.rally&&G.rally.on)&&G.strikes.every(x=>x===s||x.done||x.fake))}
function rallyFrom(s){const e=G.en,B=e.form==='B',F=e.skin==='F';let n,arm,o;
 if(e.skin==='R'){n=e.rage?5:4;arm=false;o={vary:true,heavy:true,feint:e.rage?.8:.5}}else{n=F?(e.p2?5:4):B?4:3;arm=B&&!F;o={vary:true,heavy:B||F,feint:F?.6:0}}
 G.strikes.filter(x=>x.fake&&!x.done).forEach(cancelS);
 const L=rallyList(n,arm,n,o).slice(1),r=buildStrikes(L,s.impact+8,s.impact);G.strikes.push(...r.list);
 G.rally={on:true,w:G.rally?G.rally.w:0,n:0,N:r.list.filter(x=>x.rally).length,kick:0};SFX.rallyStart();shake(P.shake*.8);flash(['#ffffff','#000000']);
 G.txt=G.txt.filter(t=>t.s!=='パリィ！');text((HX+EX)/2,FLOOR-74,'持ち込んだ！','#ffd27a',true);msg('打ち合いに持ち込んだ！ 弾き続けろ');trimEnd()}
function rallyAfter(s){const e=G.en;if(!s.rally)return;const rest=G.strikes.filter(x=>x.rally&&!x.done);
 if(s.rallyOpen){
  if(s.res==='parry'){G.rally={on:true,w:G.rally?G.rally.w:0,n:0,N:rest.length,kick:0};SFX.rallyStart();shake(P.shake*.8);flash(['#ffffff','#000000']);G.txt=G.txt.filter(t=>t.s!=='パリィ！');text((HX+EX)/2,FLOOR-74,'打ち合い！','#ffd27a',true);msg('打ち合い！ 弾き続けろ')}
  else{rest.forEach(cancelS);G.strikes.filter(x=>x.fake&&!x.done).forEach(cancelS);trimEnd();if(e.finale)e.finFail=(e.finFail||0)+1;if(G.rp){G.rp.miss++;rpScore()}}
  return}
 if(!G.rally||!G.rally.on)return;
 if(s.res!=='parry'){if(e.finale)e.finFail=(e.finFail||0)+1;if(G.rp){G.rp.ng++;rpScore()}rest.forEach(cancelS);G.strikes.filter(x=>x.fake&&!x.done).forEach(cancelS);G.rally.on=false;text(EXc(),FLOOR-70,'崩された！','#ff9a9a',true);SFX.miss();
  const o=mkStrike(G.et+12+P.cueF,{mv:'cut',m:1.8,red:true,crush:true,nc:true});G.strikes.push(o);trimEnd();msg(`${e.name}のくずし斬り！`);return}
 G.rally.n++;G.rally.kick=6;G.vib='e';if(!s.rallyEnd)G.stop=Math.min(G.stop,8);
 const cx=(heroX()+16+(G.ex??EX))/2,cy=FLOOR-22;for(let i=0;i<14;i++)G.pts.push({x:cx,y:cy,vx:(Math.random()-.5)*3.4,vy:-1.4-Math.random()*1.8,t:0,life:16,col:i%3?'#fff3b0':'#ffffff',sz:1,drag:.92,g:.12});ring(cx,cy,2,14,10,'#ffd27a');
 if(!s.rallyEnd){SFX.clang(G.rally.n);G.txt=G.txt.filter(t=>t.s!=='パリィ！');text(cx,FLOOR-46,['一','二','三','四','五','六'][G.rally.n-1]+'合！','#fff3b0',true);return}
 G.rally.on=false;G.txt=G.txt.filter(t=>t.s!=='パリィ！'&&t.s!=='見切った！');G.stop=UK.END;G.vib='e';G.uk={t:0,dmg:heroAtk()*(P.counterMul+RM2.counter)*(2.5+G.rally.N*.3)*1.3*(e.broken?P.breakMul:1)};{const fin=!G.rp&&(e.finale||G.uk.dmg>=e.hp);UKV=fin&&CFG.flash>=50?'D':'B'}SFX.parry();flash(['#ffffff','#000000']);
if(!G.rp)tipOnce('mochi','連撃の最後のひと振りを、ぎりぎりまで引きつけて弾くと、自分から打ち合いに持ち込める');if(G.rp){G.rp.ok++;setTimeout(()=>{if(G&&G.rp)rpScore()},900)}gain(50)}
/* 打ち返し「一閃」：間（暗転・刃が光る）→ 一閃（敵の背後まで斬り抜ける）→ 残心（そのまま止める）→ 斬れる（十字と数字）→ 戻る */
const UK={CUT:16,TXT:22,HIT:46,BACK:58,END:68};
let UKV='B';
/* ---- くらべ用：演出のパターン ---- */
const UKB=document.createElement('canvas');UKB.width=240;UKB.height=135;const ub=UKB.getContext('2d');
function ukCtr(){return{x:(G.ex??EX)-2,y:FLOOR-28}}
/* 太さに抑揚のある一閃（輪郭は暗く、芯は白） */
function ukLine(t){const k=t-UK.CUT,grow=Math.min(1,k/3),x0=HX-8,x1=Math.round(x0+(LW+12-x0)*grow),y=FLOOR-15,ex=(G.ex??EX);
 const hk=t>=UK.HIT&&t<UK.HIT+4,fade=t<UK.HIT?1:Math.max(0,1-(t-UK.HIT)/16);if(fade<=0)return;
 const base=k<3?4:k<10?3:2.2,mul=hk?1.7:1;l.globalAlpha=fade;
 for(let x=x0;x<x1;x++){const d=Math.abs(x-ex)/110,th=Math.max(0,(base*mul)*(1-d*d)*(x<HX?0.4:1));if(th<.4)continue;const T=Math.round(th);
  l.fillStyle='#2a0e06';l.fillRect(x,y-T-1,1,T*2+3);l.fillStyle='#d88a2a';l.fillRect(x,y-T,1,T*2+1);if(T>=1){l.fillStyle='#fff3b0';l.fillRect(x,y-T+1,1,Math.max(1,T*2-1))}l.fillStyle='#ffffff';l.fillRect(x,y,1,1)}
 l.globalAlpha=1}
function ukRing(cx,cy,rr,sy,lite){const n=Math.ceil(rr*8);for(let a=0;a<n;a++){const th=a/n*Math.PI*2,xx=cx+Math.cos(th)*rr,yy=cy+Math.sin(th)*rr*sy;px(xx,yy+1,'#2a0e06');px(xx,yy,lite);px(xx,yy-1,lite)}}
function ukHitInit(){const c=ukCtr(),U=G.uk;U.sh=[];
 const n=UKV==='E'?22:UKV==='B'?14:UKV==='A'?26:10;
 for(let i=0;i<n;i++){const a=UKV==='A'?(Math.random()<.5?-1:1)*(.3+Math.random()*1.2):Math.random()*Math.PI*2,v=UKV==='A'?.6+Math.random()*1.8:1.2+Math.random()*2.8;
  U.sh.push({x:UKV==='A'?HX+Math.random()*(LW-HX):c.x,y:UKV==='A'?FLOOR-15:c.y,vx:UKV==='A'?(Math.random()-.5)*1.2:Math.cos(a)*v,vy:UKV==='A'?Math.sin(a)*v:Math.sin(a)*v-.6,c:i%3?'#fff3b0':i%5?'#ffffff':'#d88a2a',s:UKV==='E'?(i%3?2:3):1})}}
function ukShards(t){const U=G.uk;if(!U.sh)return;for(const p of U.sh){p.x+=p.vx;p.y+=p.vy;p.vx*=.93;p.vy=p.vy*.93+.05;const life=t-UK.HIT;if(life>24)continue;
  if(p.s===1){px(p.x,p.y,p.c)}else{l.fillStyle='#2a0e06';l.fillRect(Math.round(p.x)-1,Math.round(p.y)-1,p.s+1,p.s+1);l.fillStyle=p.c;l.fillRect(Math.round(p.x),Math.round(p.y),p.s,p.s-1);px(p.x+p.s-1,p.y-1,p.c)}}}
/* B 三日月の風切り：塗りの扇。輪郭を暗く、芯を白く */
function ukCrescent(t){const k=t-UK.HIT;if(k<0||k>20)return;const c=ukCtr(),R=30,ang=-0.62,ca=Math.cos(ang),sa=Math.sin(ang),sweep=Math.min(1,(k+1)/3),thin=k<7?0:(k-7)/13;
 for(let y=-R;y<=R;y++)for(let x=-R;x<=R;x++){const u=x*ca+y*sa,v=-x*sa+y*ca;if(u<-R||u>-R+2*R*sweep)continue;const q=1-(u/R)*(u/R);if(q<=0)continue;
  const outer=13*q,inner=(2+11*thin)*q-3+thin*3;if(v>outer+1||v<inner-1)continue;
  let col;if(v>outer||v<inner)col='#2a0e06';else{const s=(v-inner)/Math.max(.5,outer-inner);col=s>.72?'#ffffff':s>.42?'#fff3b0':s>.18?'#f0a83a':'#9a3e12'}
  px(c.x+x,c.y+y,col)}
 if(k<10){l.globalAlpha=1-k/10;ukRing(c.x,c.y,6+k*3.4,.55,'#ffe7a8');l.globalAlpha=1}}
/* E 大きなヒットマーク：尖った星（斬った向きに長い棘）＋衝撃の輪＋破片 */
function ukStar(t){const k=t-UK.HIT;if(k<0||k>18)return;const c=ukCtr(),sc=k<2?.7+k*.3:k<5?1.3-(k-2)*.1:Math.max(0,1-(k-5)/13),R=17*sc,rot=-0.32+k*.01;if(R<1)return;
 const N=8,st=Math.PI*2/N,tip=[2.3,.75,1.15,.75,2.3,.75,1.15,.75],val=.3;
 const B=Math.ceil(R*2.5);for(let y=-B;y<=B;y++)for(let x=-B;x<=B;x++){const r=Math.hypot(x,y);let a=Math.atan2(y,x)-rot;a=((a%(Math.PI*2))+Math.PI*2)%(Math.PI*2);
  const i=Math.round(a/st)%N,f=Math.min(1,Math.abs(a-Math.round(a/st)*st)/(st/2)),Ra=R*(tip[i]*(1-f)+val*f);if(r>Ra+1.2)continue;
  const s=r/Ra,col=r>Ra?'#3a0a10':s<.28?'#ffffff':s<.55?'#fff3b0':s<.8?'#f0a83a':'#c0401a';px(c.x+x,c.y+y,col)}
 if(k<12){l.globalAlpha=1-k/12;ukRing(c.x,c.y,10+k*3.6,.6,'#ffffff');l.globalAlpha=1}}
/* C 画面ごと斬る：一閃の線で上下がずれて、戻る */
function ukSlice(t){const k=t-UK.HIT;if(k<0||k>16)return;const y=FLOOR-15,q=k/16,d=Math.round(15*(1-q)*(1-q));if(d<=0)return;
 ub.clearRect(0,0,240,135);ub.drawImage(L,0,0);l.fillStyle='#000';l.fillRect(0,0,LW,LH);
 l.drawImage(UKB,0,0,LW,y,d,-Math.round(d/3),LW,y);l.drawImage(UKB,0,y,LW,LH-y,-Math.round(d/3),y,LW,LH-y);
 l.fillStyle='#2a0e06';l.fillRect(0,y-2,LW,5);l.fillStyle='#f0a83a';l.fillRect(0,y-1,LW,3);l.fillStyle=k<4?'#ffffff':'#fff3b0';l.fillRect(0,y,LW,1)}
/* D 白黒反転：一瞬だけ墨絵になり、赤い斬撃が走る */
function ukInk(t){const k=t-UK.HIT;if(k<0||k>9)return;const im=l.getImageData(0,0,LW,LH),d=im.data;
 for(let i=0;i<d.length;i+=4){const lum=(d[i]*.3+d[i+1]*.59+d[i+2]*.11)/255;const ink=lum>.16;d[i]=ink?11:243;d[i+1]=ink?7:234;d[i+2]=ink?16:216}
 l.putImageData(im,0,0);const c=ukCtr(),ang=-0.55,ca=Math.cos(ang),sa=Math.sin(ang),L2=70*Math.min(1,(k+1)/2);
 for(let s=-L2;s<=L2;s++){const w=Math.max(0,4.5*(1-Math.pow(s/70,2)));const bx=c.x+s*ca,by=c.y+s*sa;for(let o=-Math.ceil(w);o<=Math.ceil(w);o++){const xx=bx-o*sa,yy=by+o*ca;px(xx,yy,Math.abs(o)<w*.35?'#ffffff':'#d81e2c')}}}
function drawUKV(){const U=G.uk;if(!U||UKV==='0')return;const t=U.t;if(t<UK.HIT)return;
 if(UKV==='B')ukCrescent(t);if(UKV==='E')ukStar(t);ukShards(t);if(UKV==='C')ukSlice(t);if(UKV==='D')ukInk(t)}

function ukStep(){const U=G.uk,e=G.en;if(U.hold>0){U.hold--;return}const t=++U.t;
 if(UKV==='D'&&t===UK.HIT+6&&!U.held){U.held=1;U.hold=22;G.stop+=22}
 if(t===7)tone(4600,.5,'sine',.06,4200);
 if(t===UK.CUT){SFX.iai();SFX.kengeki();shake(P.shake*1.2);flash(['#ffffff','#ffffff','#fff3b0','#000000','#000000']);
  for(let i=0;i<40;i++)G.pts.push({x:HX+10+Math.random()*(EX+40-HX),y:(FLOOR-15)+(Math.random()-.5)*3,vx:1.2+Math.random()*2.6,vy:(Math.random()-.5)*.8,t:0,life:18+Math.random()*20,col:i%3?'#fff3b0':'#ffffff',sz:1,drag:.9,g:0})}
 if(t===UK.TXT)text((HX+EX)/2,FLOOR-68,'打ち返し！','#fff3b0',true);
 if(t>UK.HIT&&e&&e.hurt>0)e.hurt--;
 if(t===UK.HIT){if(UKV==='0')G.xs={t:0};else ukHitInit();SFX.kengeki();try{SFX.thud(1)}catch(_){}shake(P.shake*3);flash(['#ffffff','#000000','#fff3b0','#000000']);if(e&&e.hp>0)dmgEnemy(U.dmg,'#fff3b0','rally');
  const ex=G.ex??EX;for(let i=0;i<36;i++){const a=Math.random()*Math.PI*2,v=1+Math.random()*3;G.pts.push({x:ex,y:FLOOR-28,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1,t:0,life:20+Math.random()*18,col:i%3?'#fff3b0':'#ffffff',sz:i%4?1:2,drag:.92,g:.06})}}
 if(t>=UK.END){G.uk=null;if(e&&e.hp<=0&&G.state==='enemy')ko(false,true)}}
function ukHeroX(){const U=G.uk,t=U.t,far=(G.ex??EX)+38,base=HX+Math.round(rallyW()*8);
 if(t<UK.CUT)return base;if(t<UK.BACK)return far;const q=Math.min(1,(t-UK.BACK)/(UK.END-UK.BACK));return Math.round(far+(base-far)*(1-Math.pow(1-q,3)))}
function drawUKHero(){const U=G.uk,t=U.t,y=FLOOR,x=ukHeroX(),base=HX+Math.round(rallyW()*8),far=(G.ex??EX)+38;
 if(t>=UK.CUT&&t<UK.CUT+12){const a=1-(t-UK.CUT)/12;for(let i=1;i<=4;i++){l.globalAlpha=.32*a*(1-i/5);knight(Math.round(base+(far-base)*i/5),y,'parry',0,false)}l.globalAlpha=1}
 if(t>=UK.BACK&&t<UK.END){l.globalAlpha=.25;knight(Math.round(x+(far-x)*.35),y,'idle',0,false);l.globalAlpha=1}
 shadowPx(x,8);knight(x,y,t<UK.CUT?'ready':t<UK.BACK?'parry':'idle',0,false);
 if(t>=4&&t<UK.CUT){const k=t-4,r=k<4?k:Math.max(0,8-k),bx=x+15,by=y-23;if(r>0){l.fillStyle='#ffffff';l.fillRect(bx-r,by,r*2+1,1);l.fillRect(bx,by-r,1,r*2+1);l.fillStyle='#fff3b0';l.fillRect(bx-1,by-1,3,3)}}}
function drawUK(){const U=G.uk;if(!U)return;const t=U.t;if(t<UK.CUT)return;if(UKV!=='0')return ukLine(t);
 const k=t-UK.CUT,grow=Math.min(1,k/3),x0=HX-6,x1=Math.round(x0+(LW+10-x0)*grow),fade=t<UK.HIT?1:Math.max(0,1-(t-UK.HIT)/14);if(fade<=0)return;
 const th=k<4?2:k<12?1:0;l.globalAlpha=fade;l.fillStyle='#c89a3a';l.fillRect(x0,(FLOOR-15)-th-1,x1-x0,th*2+3);l.fillStyle='#fff3b0';l.fillRect(x0,(FLOOR-15)-th,x1-x0,th*2+1);l.fillStyle='#ffffff';l.fillRect(x0,(FLOOR-15),x1-x0,1);
 if(k<8){l.fillStyle='#ffffff';for(let i=0;i<7;i++){const xx=Math.round(x0+(x1-x0)*i/6);l.fillRect(xx,(FLOOR-15)-7+(i%2)*3,1,14-(i%2)*6)}}
 l.globalAlpha=1}
/* 決闘の構図：画面の上下を締め、残りの合を目盛りで見せる。最後の溜め（押し合い）は目盛りが赤く脈打つ */
function drawRally(){const w=rallyW();if(w<=0)return;const hb=Math.round(11*w);l.fillStyle='#000';l.fillRect(0,0,LW,hb);l.fillRect(0,LH-hb,LW,hb);
 const R=G.rally;if(!R||!R.on||!G.en)return;const N=R.N||0,x0=Math.round((G.ex??EX)-(N*7)/2),y0=FLOOR-74;
 const nx=G.strikes&&G.strikes.find(s=>!s.done),lock=nx&&nx.lock&&G.et<nx.start;
 for(let i=0;i<N;i++){const x=x0+i*7,on=i<R.n,last=i===N-1,col=on?'#ffd27a':last?(lock&&(G.anim>>2)%2?'#ff4a5a':'#7a2a30'):'#4a4058';
  l.fillStyle=OUT;l.fillRect(x-1,y0-3,5,7);l.fillStyle=col;l.fillRect(x,y0-2,3,5);l.fillRect(x+1,y0-3,1,7)}
 if(lock){const cx=(heroX()+16+(G.ex??EX))/2,cy=FLOOR-24;if(G.anim%3===0)G.pts.push({x:cx+(Math.random()-.5)*3,y:cy+(Math.random()-.5)*4,vx:(Math.random()-.5)*1.6,vy:-.6-Math.random(),t:0,life:10,col:Math.random()<.5?'#fff3b0':'#ffd27a',sz:1,drag:.9,g:.1});px(cx,cy,'#ffffff');px(cx+1,cy-1,'#fff3b0')}}

