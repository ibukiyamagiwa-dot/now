/* ===== 敵の行動：予兆（キラッ）から着弾までは常に一定 ===== */
/* 合図（予兆の光と音）は一回の攻撃ごとに出す。意図して間の速い連撃（前の当たりから【予兆から着弾までのフレーム】より短い撃）は「二回当たる一回の攻撃」なので、続きの撃には合図を出さない（覚悟「みならい」だけ出す：【速い連撃の二撃目以降の合図】）。紫の輪・別の「見る場所」（目・首・触手の目・ランプ・拍）・打ち合い・技の始まり（lead）は、いつも出す */
function cueK(){return G.mode==='run'?G.K:G.mode==='prac'?PV+1:G.mode==='tut'?0:1}
/* 連携・切り返しのあとに続く技は、その技の最初の本物の撃に合図を出す */
function leadFirst(L){const j=L.findIndex(x=>!x.fake&&!x.ping);return j<0?L:L.map((x,i)=>i===j?Object.assign({},x,{lead:true}):x)}
function cueHid(s){return s.nth>0&&s.prevG!=null&&s.prevG<P.cueF&&!s.fake&&!s.rally&&!s.lead&&!s.keep&&s.note==null&&!s.heads&&s.ten==null&&!s.beat&&!s.beats&&cueK()>P.cue2K}
/* ひまなとき（依頼の一覧「大ボスの『ひまなとき』の待機」、問3）：コマンドを選ばずに【ひまなときまでの秒】たつと、敵ごとの待機を一度だけ見せる。
   光らない・撃を作らないので攻撃ではない。「まもる」の意味は変えない。どの敵が持つかと長さ・音の時刻は boredOf が返す（いまは ?new の門番だけ） */
function boredOf(e){return RIG.bored(e)}
function boredStep(){const e=G.en;
 if(G.bored){const d=G.anim-G.bored.at;if(G.bored.taps.includes(d))SFX.kotsu();return}
 if(G.t!==Math.round(P.boredS*60)||G.mode==='tut'||G.rp||G.act||!e||e.hp<=0||e.broken||e.sleep)return;
 const b=boredOf(e);if(b)G.bored={at:G.anim,len:b.len,taps:b.taps}}
/* iv：【連撃の間】の名前（P のキー）。二撃目以降は、前の当たりから P[iv] F後に当たる（ヒットストップは数えない） */
function buildStrikes(L,t,lastI){const e=G.en,cl0=e.cue||P.cueF;let nth=0;const list=L.map(s=>{
  if(s.ping){t+=s.pre||0;G.pings.push({t,heads:s.heads||(s.head!=null?[s.head]:null),note:s.note??G.pings.length,done:false,i:G.pings.length});return null}
  /* ふり：aft（【ふりのあとの間】の名前）があれば、紫の輪から【予兆から着弾までのフレーム】後にふり（fk）、ふりから P[aft] 後に次の合図（次の撃は pre なし）。なければ前のとおり、輪の直後にふる */
  if(s.fake&&s.aft){t+=s.pre||0;const fk=t+cl0;const o={fake:true,aft:s.aft,mv:s.mv,cue:t,fk,end:fk+10,start:t-12,impact:Infinity,cl:cl0,m:0,red:false,res:null,done:false,cued:false};t=fk+P[s.aft];return o}
  if(s.fake){t+=s.pre||12;const o={fake:true,mv:s.mv,cue:t,end:t+14,start:t-12,impact:Infinity,cl:14,m:0,red:false,res:null,done:false,cued:false};t+=30;return o}
  const cl=s.cl||cl0,iv=s.iv&&nth>0?P[s.iv]:null,pI=lastI;if(s.gap!=null)t=lastI+s.gap;else if(iv!=null)t=lastI+iv;else t+=(s.pre||0)+cl;lastI=t;const red=!!s.red||(!!e.redP&&!dbg.fix&&Math.random()<e.redP);if(red)tipOnce('red','赤い光は重い攻撃　痛いですが、弾けば大きく返せます');
  const o={impact:t,cue:t-cl,cl,beat:!!s.beat,mv:s.mv,bf:s.bf,bn:s.bn,proj:!!s.proj,melee:!!s.melee,start:s.st!=null?s.st:iv!=null?Math.max(pI+3,t-cl-(s.pre||0)):t-cl-(s.pre||0),prevG:nth>0?t-pI:null,nth:nth++,iv:iv!=null,lead:!!s.lead,keep:!!s.keep,ft:s.ft||0,m:s.m||1,feint:!!s.feint,red,boom:!!s.boom,counter:!!s.counter,dark:!!s.dark,back:s.back||0,beats:s.beats,lob:!!s.lob,head:s.head,heads:s.heads,spit:!!s.spit,note:s.note,rhythm:!!s.rhythm,rally:!!s.rally,rallyOpen:!!s.rallyOpen,rallyEnd:!!s.rallyEnd,lock:!!s.lock,nc:!!s.nc,bo:s.bo||0,sdrain:!!s.drain,ten:s.ten,nolight:!!s.nolight,res:null,done:false,cued:false};t+=8;return o}).filter(Boolean);
 /* 次の撃までの間（静と動：当たったポーズで止まり、次の構えへ移って止まる） */
 const R=list.filter(x=>!x.fake);for(let i=0;i+1<R.length;i++)if(R[i+1].nth>0)R[i].nxG=R[i+1].impact-R[i].impact;return{list,t}}
function startEnemy(list){
 const e=G.en;
 if(!list){
  if(e.flee!=null&&inBattle()){if(e.flee<=0)return fleeAway();e.flee--}
  if(e.fuse!=null&&inBattle())e.fuse--;
 }
 if(list)e.wasCounter=true;
 G.pings=[];const BS=buildStrikes(list||e.turn(),0,0);G.strikes=BS.list;let t=BS.t;
 if(!list&&e.demo&&G.strikes.length)e.demo=false;
 G.et=0;G.endT=Math.max(t+8,...G.strikes.map(x=>x.ft&&isFinite(x.impact)?x.impact+x.ft:0));G.lock=-1;G.state='enemy';
 msg(list?`${e.name}の返し斬り！`:G.strikes.some(s=>s.boom)?`${e.name}が爆発する！`:`${e.name}の攻撃！`);
 if(G.strikes.some(s=>s.boom)){shake(P.shake*.6);SFX.rage()}
}
function fleeAway(){const e=G.en;G.state='win';G.t=0;G.fled=true;e.hp=0;SFX.miss();text(EX,FLOOR-50,'逃げられた…','#bba9b0',true);for(let i=0;i<10;i++)G.pts.push({x:EX-6+Math.random()*12,y:FLOOR-8,vx:1.2+Math.random(),vy:-.6-Math.random(),t:0,life:20,col:'#ffe878',sz:1});msg(`${e.name}は逃げていった　── A で次へ`)}
function turnEnd(){const e=G.en;
 if(e.wasCounter){e.wasCounter=false;e.stance=false;return}
 if(e.noStance){e.stance=false;return}if(e.iai&&inBattle()){if(e.stance)e.stance=false;else if(!e.broken&&(e.tn||0)>1&&Math.random()<(e.skin==='R'?.45:.3)){e.stance=true;text(EX,FLOOR-66,'構えた','#ff9a9a',true);SFX.block();msg(`${e.name}は構えている　斬りかかると返される`)}return}
 if(e.kind==='samurai'&&!e.noIai&&inBattle()){e.stance=!e.broken&&!e.stance;if(e.stance){text(EX,FLOOR-56,'構えた','#ff9a9a',true);SFX.block();msg(`${e.name}は構えている　斬りかかると返される`)}}
}
function enemyStep(){
 G.et++;G.fxAt=null;
 for(const s of G.strikes){
  if(!s.cued&&G.et>=s.cue){s.cued=true;if(s.lob)SFX.toss();else if(s.dark){}else if(s.mv==='tick'){SFX.kiri()}else if(s.heads&&G.en.kind==='hydra'){s.heads.forEach(h=>SFX.headCue(h));if(s.red)SFX.cueRed()}else if(s.note!=null){SFX.cue();if(!eyeFoe())SFX.ping(s.note)}else if(cueHid(s)){}else s.fake?SFX.cueFake():s.red?SFX.cueRed():SFX.cue();if(s.red&&G.en.kind==='dragon'){SFX.rage();shake(P.shake*.6)}if(s.rallyOpen)SFX.rallyCue();if((G.en.kind==='lord'||G.en.key==='gateK')&&!s.fake&&(s.mv==='arm'||s.mv==='bk'||s.mv==='maw'||s.mv==='reach'||s.mv==='vlash'||s.mv==='cape'))SFX.wet()}
  if(s.beat&&!s.done){const k=G.et-s.cue-(s.bo||0),B=s.bf||P.golemBeatF,N=s.bn||4;if(k>=B&&k%B===0&&k<=B*N){if(s.mv==='slam'||s.mv==='hslam'){SFX.thud(k/B-1);shake(P.shake*.25)}else if(s.mv==='tail'||s.mv==='htent')SFX.rattle(k/B-1);else if(s.mv==='breath'){SFX.charge(k/B-1);shake(P.shake*.15)}else if(s.mv==='smash'){SFX.gong(k/B-1);shake(P.shake*.3)}else if(s.mv==='step'&&k===B*(N+1)){}else if(s.mv==='pool'){SFX.step(k/B-1,N);const fx=poolX(s,G.et);for(let q=0;q<6;q++)G.pts.push({x:fx+(Math.random()-.5)*12,y:FLOOR-1,vx:(Math.random()-.5)*.9,vy:-.4-Math.random()*.7,t:0,life:18,col:'#6a3a8a',sz:1,drag:.95,g:.04})}else if(s.mv==='step'){SFX.step(k/B-1,N);const fx=ghostStart(N)-(k/B)*GSTEP;for(let q=0;q<5;q++)G.pts.push({x:fx+(Math.random()-.5)*6,y:FLOOR,vx:(Math.random()-.5)*.8,vy:-.3-Math.random()*.5,t:0,life:18,col:'#4a4058',sz:1,drag:.95,g:0});mark(fx,FLOOR+1,'star',1,'#6a6080')}else SFX.holdTick(k/B-1)}}
  if(s.mv==='pool'&&!s.done&&G.et-s.cue===(s.bf||12)*((s.bn||2)+1)){SFX.whisper();const fx=poolX(s,G.et);for(let q=0;q<10;q++)G.pts.push({x:fx+(Math.random()-.5)*10,y:FLOOR-2,vx:(Math.random()-.5)*.8,vy:-.6-Math.random()*.8,t:0,life:20,col:'#9a62b4',sz:1,drag:.96,g:.05})}
  if(s.mv==='step'&&!s.done&&G.et-s.cue===(s.bf||12)*((s.bn||2)+1)){SFX.whisper();for(let q=0;q<10;q++)G.pts.push({x:GHX+(Math.random()-.5)*14,y:FLOOR-6-Math.random()*20,vx:(Math.random()-.5)*.6,vy:-.4-Math.random()*.6,t:0,life:20,col:'#8a9ac8',sz:1,drag:.96,g:0})}
  if(s.beats&&!s.done){const k=G.et-s.cue,bi=s.beats.indexOf(k);if(bi>=0){if(s.lob){if(G._tk!==G.et){G._tk=G.et;SFX.whistle(bi)}}else SFX.tick(bi,s.beats.length)}}
  if(!s.done&&(s.mv==='tail'||s.mv==='htent')&&G.et===s.impact-9)SFX.whoosh();
  if(!s.done&&s.mv==='stab'&&G.et===s.impact-3)SFX.stab();
  if(!s.done&&s.lock&&G.rally&&G.rally.on&&G.et===s.start-16){SFX.grind();SFX.heart()}
  if(!s.done&&s.mv==='breath'&&G.et===s.impact-9)SFX.breath();
  if(s.fake){if(!s.done&&G.et>=s.end){s.done=true;if(G.lock<G.et-P.earlyLockF+1)text(EX-6,FLOOR-50,'フェイント','#c9a8ff')}continue}
  if(!s.done&&G.et>=s.impact)resolve(s);
 }
 {const s=boarStrike();if(s&&!s.done){if(G.et<s.cue&&G.et>s.start+4&&(G.et-s.start)%9===0){SFX.paw();for(let q=0;q<4;q++)G.pts.push({x:boarX()+8,y:FLOOR,vx:1+Math.random(),vy:-.4-Math.random()*.6,t:0,life:16,col:'#6a5560',sz:1,drag:.95,g:.05})}
   if(G.et===s.cue)SFX.snort();if(G.et>s.cue&&G.et<s.impact&&(G.et-s.cue)%5===0){SFX.gallop((G.et-s.cue)/(s.impact-s.cue));G.pts.push({x:boarX()+12,y:FLOOR,vx:1.5,vy:-.5,t:0,life:12,col:'#6a5560',sz:2,drag:.9,g:0})}}
  if(s&&s.res==='parry'&&G.et===s.impact+12&&G.en.hp>0){const e=G.en;SFX.rock();SFX.thud(2);shake(P.shake*2.2);flash(['#ffffff','#000000']);burst(EX+52,FLOOR-10,'#c8bcb0',22,2.2,2);ring(EX+52,FLOOR-10,3,24,14,'#fff3b0');text(EX-6,FLOOR-44,'壁に激突！','#fff3b0',true);if(!e.broken){e.broken=1;e.brk=0;text(EX-6,FLOOR-60,'目を回した！','#e8c46a',true);msg(`${e.name}は目を回している！ 次の一撃は${fmt(P.breakMul)}倍`)}}}
 for(const pg of G.pings||[]){if(!pg.done&&G.et>=pg.t){pg.done=true;pg.at=G.et;G.en.kind==='hydra'?(pg.heads||[pg.note]).forEach(h=>SFX.headPing(h)):eyeFoe()?SFX.eye(pg.note):SFX.ping(pg.note);if(G.en.kind==='echo'){ring(EX-2,FLOOR-30-(G.en.fly||0),2,30,18,'#7fe3e3');ring(EX-2,FLOOR-30-(G.en.fly||0),2,18,12,'#ffffff')}}}
 if(G.state!=='enemy')return;
 if(G.strikes.every(s=>s.done)&&G.et>=G.endT){if(G.hero.psn>0&&G.mode!=='tut'){SFX.poison();hurt(G.hero.psn,'#b06ad8');text(HX+10,FLOOR-30,'毒','#b06ad8');G.hero.psn+=3;if(G.hero.hp<=0){G.state='dying';G.t=0;return}}if(G.mode==='tut'){const st=TUT[G.tut.i];if(G.tut.done)return tutClear();if(st.loop===true||(st.loop==='gauge'&&G.hero.mk<100)){G.state='cmd';G.t=-20;startEnemy();return}}
 G.state='cmd';G.t=0;G.eEnd=G.anim;if(G.rally)G.rally.on=false;if(!usable(G.sel))G.sel=firstUsable();msg(G.mode==='tut'?tutLbl():'A で決定（↑↓ でコマンドを選ぶ）');turnEnd()}
}
function press(){
 ac();
 if(G.state==='win'){if(G.t>15)(FEAT.picks?enterPick():next());else nudge();return}
 if(G.state==='pick'){if(G.t>12)choose(G.psel);return}
 if(G.state==='lose'){if(G.t>20)(FEAT.unlocks?enterResult(false):G.mode==='run'?loseItems()[G.csel||0].a():startBattle(G.bi,true));else nudge();return}
 if(G.state==='hole'){if(G.t>70)holeItems()[G.csel||0].a();else nudge();return}
 if(G.state==='clear'){if(G.t>50)(FEAT.unlocks?enterResult(true):clearItems()[G.csel||0].a());else nudge();return}
 if(G.state==='result'){if(G.t>30)resultPress();return}
 if(G.state==='tutok'){if(G.t>20)nextTut();else nudge();return}
 if(G.state==='blown'){if(G.t>44&&G.t<128)G.t=128;else nudge();return}
 if(G.state==='ko'){if(G.t>30&&G.stop<=0)skipKo();else nudge();return}
 if(G.state==='roar'){if(G.rh>0){if(G.rh<ROAR_HOLD-24)G.rh=0;else nudge();return}if(G.en&&G.en.kind==='lord'&&G.t>8)skipRoar();else nudge();return}
 if(G.state==='bintro'){if(G.t>8&&G.t<66)G.t=65;else if(G.t>=70)G.t=119;else nudge();return}
 if(G.state==='enter'){if(G.enter&&G.enter.rig){if(G.enter.t>30)G.enter.t=G.enter.rig;else nudge();return}if(G.enter&&G.enter.t>30&&G.enter.t<140){G.enter.t=140;G.enter.dx=0;G.enter.f='guard';if(!G.banner)G.banner={s:G.en.name,t:0}}else nudge();return}
 if(G.state==='cmd'){if(G.t>=10)cmd(G.sel);else{G.buf=G.sel;nudge()}return}
 if(G.state==='hero'){const a=G.act;if(a&&a.n===1&&a.d&&a.t<a.d){nudge();return}if(a&&a.n===1&&!a.chase&&has('chase')){const r=a.I-a.t;
  if(r>P.chaseF||(r<-P.lateF&&r>=-14)){const early=r>0;tutOn('miss');a.chase='miss';a.early=early;G.stats.miss++;syncStats();lose(P.mkMiss);SFX.miss();text(heroX(),FLOOR-34,early?'はやい！':'おそい！','#ff9a9a');if(!early)pose('early',12)}
  else if(r>P.chaseF||r<-14)nudge();
  else if(r<=P.chaseF&&r>=-P.lateF){a.chase=r<=P.critF&&has('heavy')&&barMode()!=='chase'?'crit':'ok';if(a.chase==='ok'&&G.mode==='tut'&&TUT[G.tut.i].key==='heavy')tutOn('ok');SFX.accept(a.chase==='crit')}}else nudge();return}
 if(G.state!=='enemy')return nudge();
 if(G.mode==='tut'&&G.tut.watch){nudge('見ていよう');return}
 const s=G.strikes.find(s=>!s.done);
 if(!s||s.res||G.et<G.lock)return nudge();
 const r=s.impact-G.et;
 if(r>Math.max(P.guardF,justF())){G.lock=G.et+P.earlyLockF;G.stats.early++;syncStats();SFX.early();G.streak=0;tutOn('early');if(s.fake){text(HX,FLOOR-34,'フェイント！','#c9a8ff',true)}else text(HX,FLOOR-34,'はやい','#9a8f96');pose('early',P.earlyLockF);return}
 s.pr=r;s.res=r<=effParry()?'parry':r<=justF()&&has('just')?'just':'guard';{const bm=barMode();if(bm==='none')s.res='parry';if(bm==='guard'||(bm==='parry'&&s.res==='just'))s.res='guard'}
 pose(s.res==='guard'?'guard':'ready',r+1);
}
function EXc(){return G.fxAt!=null?G.fxAt:(G.ex??EX)}
function checkBreak(e){if(has('brk')&&e.brk>=breakNeed()&&e.hp>0){tipOnce('brk','ブレイク！ 次の攻撃のダメージが上がります');e.broken=1;e.brk=0;SFX.brk();text(EXc(),FLOOR-56,'ブレイク！','#e8c46a',true);if(e.kind==='doll'&&e.wind){e.wind=0;text(EXc(),FLOOR-40,'ゼンマイがほどけた','#fff3b0')}G.strikes.forEach(cancelS);G.endT=G.et+30;msg(`${e.name}の体勢が崩れた！ 次の一撃は${fmt(P.breakMul)}倍`)}}
function resolve(s){
 G.fxAt=G.en&&G.en.kind==='hydra'&&s.heads?HX+40:null;s.done=true;bossHitFx(s);if(G.bs){G.bs.n=(G.bs.n||0)+1;if(s.res==='just')G.bs.just=(G.bs.just||0)+1;if(!s.res)G.bs.hits=(G.bs.hits||0)+1}const h=G.hero,e=G.en,base=e.atk*s.m*P.enemyAtkMul*kEff().atk,cx=HX+16,cy=FLOOR-16;
 if(s.res==='parry'){
  tutOn('parry');G.stats.parry++;G.bs.parry++;gain(P.mkParry);SFX.parry();streakUp(cx,cy);G.stop=P.stopParryF;shake(P.shake*P.shakeParryMul);flash(['#ffffff','#000000','#c8f6ff','#000000']);
  burst(cx,cy,'#bff4ff',26,2.4,2);burst(cx,cy,'#ffffff',10,3.4,1);G.spark={x:cx,y:cy,t:0};
  text(cx,cy-24,'パリィ！','#7fe3ff',true);pose('parry',20);
  if(s.counter){G.txt=G.txt.filter(t=>t.s!=='パリィ！');G.stop=P.stopParryF+P.stopCounterAddF;G.vib='e';G.iai={t:0,y:cy-2};SFX.iai();shake(P.shake*P.shakeCounterMul);flash(['#ffffff','#000000','#000000','#7fe3ff','#000000']);text((HX+EX)/2,cy-40,e.kind==='lord'?'見切り返し！':'居合返し！','#fff3b0',true);if(e.kind==='lord'){G.iai=null;G.xs={t:0}}gain(25);for(let i=0;i<30;i++)G.pts.push({x:HX+20+Math.random()*(EX-HX-30),y:cy-2+(Math.random()-.5)*3,vx:(Math.random()-.5)*3.2,vy:-.6-Math.random()*1.6,t:0,life:22+Math.random()*16,col:i%3?'#fff3b0':'#ffffff',sz:1,drag:.95,g:.08})}
  else if(s.red){G.stop+=P.stopRedAddF;pose('parryH',HV_T);for(let i=0;i<10;i++)G.pts.push({x:HX+2+Math.random()*8,y:FLOOR-1,vx:-.4-Math.random()*1.4,vy:-.2-Math.random()*.6,t:0,life:18+Math.random()*10,col:i%2?'#8a7a66':'#5a4a3e',sz:i%3?1:2,drag:.93,g:.03});SFX.block();setTimeout(()=>{try{SFX.thud&&SFX.thud(1)}catch(_){}},60);flash(['#ffffff','#ff4a5a','#ffffff','#000000']);if(s.crush)text(cx+10,cy-44,'しのいだ！','#d9e2f2',true);else{text(cx+10,cy-44,'見切った！','#fff3b0',true);gain(25)}ring(cx,cy,3,40,20,'#ff7b86')}
  if(!e.noCounter&&!s.proj&&!s.nc)dmgEnemy(heroAtk()*(P.counterMul+RM2.counter)*(s.red?2:1)*(e.broken?P.breakMul:1),'#7fe3ff','counter');
  /* パリィされの震え：連撃の途中は小、最後の一撃・赤は大 */
  if(!s.counter){G.vib='p';e.pryAmp=s.red||!G.strikes.some(x=>!x.done&&!x.fake)?P.pryShakeB:P.pryShakeS}
  if(s.counter&&e.hp>0&&!e.broken&&!e.noCounterBrk){e.broken=1;e.brk=0;G.knock=10;text(EXc()+4,FLOOR-40,'構えが崩れた！','#e8c46a',true);msg(`${e.name}の構えが崩れた！ 次の一撃は${fmt(P.breakMul)}倍`)}
  if(RM2.fire&&e.hp>0){dmgEnemy(8,'#ff9a3a','fire');burst(EXc()-8,FLOOR-14,'#ff9a3a',14,1.6,2)}
  if(s.proj&&e.kind==='imp'&&e.hp>0){text(EXc()+8,FLOOR-48,`弾き落とした　足元に岩${G.floorD=(G.floorD||0)+1}個`,'#fff3b0',true);SFX.rock();for(let i=0;i<6;i++)G.pts.push({x:HX+24,y:FLOOR-6,vx:-.4+Math.random()*1.6,vy:-1.2-Math.random(),t:0,life:26,col:'#8a7d74',sz:1,drag:.98,g:.14,bounce:1})}
  else if(s.proj&&e.daggers>0&&e.hp>0){e.daggers--;text(EXc()+8,FLOOR-48,`叩き落とした　足元に${G.floorD=(G.floorD||0)+1}本`,'#fff3b0',true);SFX.metal();for(let i=0;i<6;i++)G.pts.push({x:HX+14,y:FLOOR-18,vx:-.4+Math.random()*1.6,vy:-1.6-Math.random(),t:0,life:30,col:'#d9e2f2',sz:1,drag:.98,g:.14,bounce:1})}
  if(e.shield&&e.guardUp){e.guardUp=false;text(EXc(),FLOOR-56,'盾が崩れた！','#fff3b0',true);SFX.block()}
  if(has('brk')&&G.mode!=='tut'&&!s.rally&&!s.crush){if((e.kind==='hydra'||s.rally)&&G.strikes.some(x=>!x.done&&x!==s))e.brkPend=(e.brkPend||0)+1;else{e.brk+=1+(e.brkPend||0);e.brkPend=0}}
  checkBreak(e);
 }else if(s.res==='just'){
  tutOn('just');tipOnce('just','ジャスト回避　ダメージを受けず、見切りも少し溜まります');G.stats.just++;gain(P.mkJust);SFX.just();G.stop=Math.round(P.stopParryF*P.stopJustMul);burst(cx-6,cy,'#9dffc4',12,1.3,1);
  text(cx,cy-24,'ジャスト！','#9dffc4',true);pose('dodge',18);if(RM2.justC)dmgEnemy(heroAtk()*.6,'#9dffc4','counter');
 }else if(s.res==='guard'){
  tutOn('guard');G.stats.guard++;G.streak=0;SFX.guard();G.stop=P.stopGuardF;shake(P.shake*P.shakeGuardMul);burst(cx,cy,'#9cc4ff',10,1,1);
  hurt(Math.max(1,Math.round(base*P.guardDmgMul*(1-RM2.guardCut))),'#9cc4ff');text(cx,cy-24,'ガード','#9cc4ff');pose('guard',12);
 }else{
  tutOn('hit');G.stats.hit++;G.streak=0;lose(P.mkHit);SFX.hit();G.stop=P.stopHitF;shake(P.shake*P.shakeHitMul);flash(['#5a0f18','#000000']);burst(cx-8,cy,'#ff7b86',16,1.6,2);
  const hv=Math.round(base*(s.red?1.5:1));hurt(hv,'#ff7b86');pose('hit',16);
  if(s.sdrain&&e.hp>0){const dv=Math.min(e.hpMax-e.hp,hv);if(dv>0){e.hp+=dv;SFX.maw();text(EXc(),FLOOR-50,'くらやみが吸った +'+dv,'#e0b0ff');burst(EXc()-4,FLOOR-28,'#b07ad0',12,1,1)}}

  if(e.drain&&e.hp>0){const dv=Math.min(e.hpMax-e.hp,hv);if(dv>0){tipOnce('drain','噛まれると、そのぶんコウモリが回復します');e.hp+=dv;text(EXc(),FLOOR-40,'吸血 +'+dv,'#ff7b86');burst(EXc()-6,FLOOR-14,'#ff7b86',10,1,1)}}
 }
 if(s.melee&&e.thief&&(s.res==='guard'||!s.res)&&h.mk>0){lose(60);text(EXc()-6,FLOOR-48,'見切りを盗まれた！','#ff9a9a',true);SFX.miss()}
 if(e.poison&&G.mode!=='tut'&&(s.res==='guard'||!s.res)&&h.hp>0){const was=h.psn||0;h.psn=Math.max(was,e.poison);if(!was){text(HX,FLOOR-56,'毒をうけた','#c98ae8',true);tipOnce('poison','毒は毎ターン強くなる　かいふくで消せる')}}
 if(s.boom){const bx=EXc()-6,by=FLOOR-14;burst(bx,by,'#ffd27a',30,3,2);burst(bx,by,'#ff7a3c',20,2.2,2);ring(bx,by,4,46,20,'#ffd27a');shake(P.shake*1.8);SFX.rage();
  if(s.res==='parry'){text(EXc()-10,FLOOR-64,'はね返した！','#fff3b0',true);dmgEnemy(Math.max(1,e.hp),'#ffd27a','counter')}
  else if(h.hp>0){e.hp=0;text(EXc()-10,FLOOR-64,'自爆した','#ffd27a',true)}}
 if(canRallyFrom(s))rallyFrom(s);
 rallyAfter(s);
 if(e.brkPend&&!G.strikes.some(x=>!x.done)){e.brk+=e.brkPend;e.brkPend=0;checkBreak(e)}
 if(s.rhythm&&G.stop>0&&G.strikes.some(x=>!x.done&&x!==s)){G.stop=Math.min(G.stop,P.stopRhythmMaxF);const d=G.stop;for(const x of G.strikes)if(!x.done){x.impact-=d;x.cue-=d;x.start-=d}for(const pg of G.pings||[])if(!pg.done)pg.t-=d}
 syncStats();
 if(e.hp<=0)return ko(s.res==='parry');
 if(h.hp<=0){G.strikes.forEach(x=>x.done=true);G.state='dying';G.t=0}
}
function hurt(v,col){G.vib='h';G.bs.hurt+=v;if(!dbg.god)G.hero.hp=Math.max(G.mode==='tut'||G.mode==='prac'?1:0,G.hero.hp-v);text(HX,FLOOR-40,'-'+v,col,true)}
