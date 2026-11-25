/* ===== 自分の行動 ===== */
function cmd(n){
 if(G.state!=='cmd')return;ac();G.buf=0;const h=G.hero;
 if(n===2&&(!has('gauge')||h.mk<100)){msg(has('gauge')?'見切りが足りない':'まだ使えない');return}
 if(n===3&&h.pot<=0){msg('薬がない');return}
 if(G.en)G.en.lastAtk=n===1;const C=8+P.atkHoldF;G.act={n,t:0,lv:Math.floor(h.mk/100),chase:null,C,I:C+P.cueF};G.state='hero';
}
const CMDN=['','たたかう','まほう','かいふく'];
function cmdName(n){if(n===2&&!has('gauge'))return'？？？';const lv=Math.floor(G.hero.mk/100);return n===2&&lv?`まほう：${SPELL[lv]}`:CMDN[n]}
const SPELL=['','ほのお','かみなり','ひかり'],SCOL=['','#ff9a3a','#ffe14a','#7fe3ff'],magT=lv=>[0,12,16,30][lv];
function spellHit(lv){
 const e=G.en,mul=e.broken?P.breakMul:1,x=EX-6,y=FLOOR-14,em=e.magMul?e.magMul(lv):1,sw=e.swarm?aliveN():1;
 if(e.kind==='bomb'&&lv===1&&e.hp>0){text(EX-10,FLOOR-64,'誘爆！','#ffd27a',true);burst(x,y,'#ffd27a',30,3,2);ring(x,y,4,46,20,'#ffd27a');shake(P.shake*1.6);SFX.rage();hurt(8,'#ff9a3a');dmgEnemy(Math.max(1,e.hp),'#ffd27a','magic')}
 else if(e.uhp){e._an0=aliveN();const per=Math.round(magDmg(lv)*mul*em);let tot=0;e.uhp=e.uhp.map(v=>{const d=Math.min(v,per);tot+=d;return v-d});const keep=e.uhp.slice();e.uhp=keep;e.hp=e.uhp.reduce((a,b)=>a+b,0)+tot;dmgEnemy(tot,SCOL[lv],'magicAll')}
 else dmgEnemy(magDmg(lv)*mul*em*sw,SCOL[lv],'magic');
 if(em>1||sw>1)text(EX-4,FLOOR-74,sw>1?(e.kind==='hydra'?'首すべてに効いた！':'群れ全体に効いた！'):'よく効いた！','#fff3b0',true);else if(em<1)text(EX-4,FLOOR-74,'効きにくい…','#bba9b0',true);
 if(lv===1){SFX.fire();G.stop=P.stopMag1F;shake(P.shake*P.shakeMag1Mul);flash(['#5a2a10']);burst(x,y,'#ff9a3a',22,2,2);burst(x,y,'#fff3b0',10,2.6,1);ring(x,y,2,20,14,'#ff9a3a');mark(x,y,'star',8,'#ffd27a')}
 if(lv===2){SFX.thunder();G.stop=P.stopMag2F;shake(P.shake*P.shakeMag2Mul);flash(['#ffffff','#000000','#fff3a0','#000000']);burst(x,y,'#ffe14a',26,2.6,1);burst(x,y,'#ffffff',10,3,1);ring(x,y,2,30,16,'#ffe14a');mark(x,y,'star',12,'#ffffff')}
 if(lv===3){SFX.holy();G.stop=P.stopMag3F;shake(P.shake*P.shakeMag3Mul);flash(['#ffffff','#ffffff','#000000','#bff4ff','#000000','#ffffff']);
  for(let i=0;i<40;i++)G.pts.push({x:x+(Math.random()-.5)*30,y:FLOOR-Math.random()*40,vx:(Math.random()-.5)*.8,vy:-1-Math.random()*2,t:0,life:40+Math.random()*30,col:i%3?'#bff4ff':'#fff3b0',sz:i%4?1:2,drag:.98,g:-.01});
  ring(x,y,3,70,30,'#7fe3ff');ring(x,y,2,44,36,'#ffffff');text(EX-4,FLOOR-62,'大魔法！','#bff4ff',true)}
}
function cmdTag(n){const e=G.en,h=G.hero;if(!e||!inBattle()||e.hp<=0)return null;
 if(n===1){if(G.floorD>0)return{s:e.kind==='imp'?`◎ 岩${G.floorD}個を投げ返す`:`◎ 短剣${G.floorD}本を投げ返す`};if(e.stance&&!e.broken)return{s:'✕ 返される',bad:1};if(e.shield&&e.guardUp)return{s:'✕ 盾に防がれる',bad:1};if(e.hard||e.air)return{s:'△ 効きにくい',bad:1};return null}
 if(n===2){const lv=Math.floor(h.mk/100);if(!lv)return null;if(e.kind==='bomb'&&lv===1)return{s:'◎ 誘爆させる'};if(e.stance&&!e.broken)return{s:'◎ 構えを崩す'};if(e.swarm&&aliveN()>1)return{s:'◎ 群れ全体に効く'};const m=e.magMul?e.magMul(lv):1;if(m>1)return{s:'◎ よく効く'};if(m<1)return{s:'△ 効きにくい',bad:1};if(e.shield&&e.guardUp)return{s:'○ 盾を無視'};return null}
 if(n===3){if(h.psn)return{s:'◎ 毒も消える'};return null}return null}
function usable(n){const h=G.hero;if(!tutAllow(n))return false;return n===1||(n===2&&has('gauge')&&h.mk>=100)||(n===3&&h.pot>0)}
function gain(v){if(!has('gauge'))return;const h=G.hero,b=Math.floor(h.mk/100);h.mk=Math.min(lvMax()*100,h.mk+v);if(Math.floor(h.mk/100)>b){if(b===1)tipOnce('lv2','見切りは3段まで溜まる　溜めるほど強いまほうになる');SFX.full();G.mkFlash=24}}
function lose(v){G.hero.mk=Math.max(0,G.hero.mk-v)}
const chased=a=>a&&(a.chase==='ok'||a.chase==='crit');
function lungeK(a){if(!a||a.n!==1)return 0;const D=a.d||0,H=a.I-D+(a.chase==='ok'?(RM2.triple?24:16):a.chase==='crit'||a.chase==='miss'?8:2),R=a.chase==='ok'?10:7,t=a.t-D;if(t<=0)return 0;if(t<=8)return Math.sin(t/16*Math.PI);if(t<=H)return 1;return Math.max(0,Math.cos((t-H)/R*Math.PI/2))}
function move(d){if(G.state==='pick'){G.psel=(G.psel+d+3)%3;tone(1200,.03,'square',.04);return}if(G.state!=='cmd')return;ac();let n=G.sel;for(let i=0;i<3;i++){n=(n-1+d+3)%3+1;if(usable(n))break}G.sel=n;tone(1200,.03,'square',.04)}
function pick1(n){if(G.state==='pick'){ac();if(G.psel===n-1){if(G.t>12)choose(n-1)}else{G.psel=n-1;tone(1200,.03,'square',.04)}return}if(G.state!=='cmd'||!usable(n))return;ac();if(G.sel===n){if(G.t>=10)cmd(n)}else{G.sel=n;tone(1200,.03,'square',.04)}}
function mark(x,y,kind,size,col){G.marks.push({x,y,kind,size,col,t:0,life:kind==='slash'?8:14})}
function knock(px){G.knock=Math.max(G.knock||0,px)}
/* 主人公の剣の光・跡・火花はうすい青（合図の4色と分ける）。追撃の×だけ金 */
const HSWD=['#dff2ff','#8ab8e0','#5a7ca8'];
const MAT={golem:'rock',bomb:'rock',slime:'goo',armor:'metal',samurai:'metal'};
function matHit(e){const m=MAT[e.kind],x=EXc()-8,y=FLOOR-14;
 if(m==='rock'){SFX.rock();for(let i=0;i<10;i++)G.pts.push({x,y:y-4,vx:(Math.random()-.2)*2.4,vy:-1.4-Math.random()*1.4,t:0,life:26,col:i%2?shade(e.col,-.3):shade(e.col,.2),sz:2,drag:.98,g:.12})}
 else if(m==='goo'){SFX.goo();for(let i=0;i<12;i++)G.pts.push({x,y,vx:(Math.random()-.3)*2,vy:-1-Math.random()*1.6,t:0,life:24,col:i%3?e.col:shade(e.col,.4),sz:Math.random()<.4?2:1,drag:.98,g:.1})}
 else if(m==='metal'){SFX.metal();for(let i=0;i<10;i++){const an=Math.random()*Math.PI*2,v=2+Math.random()*2;G.pts.push({x,y:y-4,vx:Math.cos(an)*v,vy:Math.sin(an)*v-.6,t:0,life:10,col:i%2?HSWD[1]:HSWD[0],sz:1,drag:.9,g:.05})}}}
function dmgEnemy(v,col,kind){
 const e=G.en,sword=kind==='slash'||kind==='chase'||kind==='heavy';
 if(e.shield&&e.guardUp&&sword){tipOnce('shield','盾に剣は効きません　パリィで盾を崩しましょう');SFX.block();text(EXc()-6,FLOOR-40,'キン！','#cfd8e6',true);burst(EXc()-14,FLOOR-16,'#ffffff',10,1.6,1);G.vib='e';e.hurt=4;e.shkAt=G.anim;e.shkPush=false;return}
 if(e.hard&&(kind==='slash'||kind==='chase')){v*=.5;if(Math.random()<.5)text(EXc()+10,FLOOR-30,'かたい','#bba9b0')}
 if(e.air&&(kind==='slash'||kind==='chase')){v*=.5;if(Math.random()<.5)text(EXc()+10,FLOOR-34,'とどかない','#bba9b0')}
 if(rallyFoe(e)&&kind==='counter'&&!G.rp)v*=.6;
 v=Math.round(v);
 /* 3) 決着は打ち合い：各形態の残り2割は、打ち返しでしか削れない */
 if(rallyFoe(e)&&e.finale&&kind==='rally'&&!G.rp)v=Math.max(v,e.hp);
 if(rallyFoe(e)&&!G.rp&&G.mode!=='tut'&&kind!=='rally'){const fl=Math.ceil(e.hpMax*.2);if(e.hp-v<fl){v=Math.max(0,e.hp-fl);if(!e.finale){e.finale=true;e.finFail=0;text(EXc(),FLOOR-70,'踏みとどまった！','#ff9a9a',true);SFX.block();shake(P.shake);msg(`${e.name}は踏みとどまった　……打ち返しで決めろ`);tipOnce('finale','大ボスの最後の2割は、打ち合いの「打ち返し」でしか削れない')}if(v<=0){text(EXc()+6,FLOOR-40,'とどかない','#bba9b0');SFX.block();e.hurt=4;e.shkAt=G.anim;e.shkPush=false;return}}}
 const an0=e._an0??aliveN();e._an0=null;if(e.uhp&&kind!=='magicAll'){let r=v;for(let i=0;i<e.uhp.length&&r>0;i++){const d=Math.min(r,e.uhp[i]);e.uhp[i]-=d;r-=d}}e.hp=Math.max(0,e.hp-v);if(e.uhp)e.hp=e.uhp.reduce((a,b)=>a+b,0);e.hurt=10;e.hurtAt=G.anim;if(kind!=='counter'){e.shkAt=G.anim;e.shkPush=true}G.vib='e';matHit(e);
 if(e.swarm&&e.hp>0&&aliveN()<an0){const bx=EXc()-6;if(e.kind==='hydra'){burst(bx-10,FLOOR-40,e.col,22,2,2);SFX.crit();shake(P.shake*1.2);text(bx,FLOOR-60,`首を落とした！ あと${aliveN()}本`,'#9dffc4',true);{let c=0;G.strikes.forEach(x=>{if(x.heads&&!x.done&&x.heads.every(h=>e.uhp[h]<=0)){cancelS(x);x.res='cut';c++}});if(c&&G.state==='enemy')trimEnd()}}else{burst(bx,FLOOR-8,e.col,18,1.8,2);SFX.goo();text(bx,FLOOR-30,`あと${aliveN()}匹`,'#9dffc4',true)}}
 if(e.boss&&!e.noRage&&!e.rage&&e.hp>0&&e.hp<e.hpMax/2){e.rage=true;e.roared=false;shake(P.shake*.6);SFX.rage()}
 const nn=G.txt.filter(t=>t.t<24&&/^\d+$/.test(t.s)).length;text(EXc()-4+nn*12+(EXc()-HX<60?10:0),(EXc()-HX<60?FLOOR-60:FLOOR-44)-nn*9,String(v),col||'#fff',true);burst(EXc()-8,FLOOR-14,sword?HSWD[1]:(col||'#ffe7a8'),14,1.6,2);
}
function heroStep(){
 const a=G.act,h=G.hero,e=G.en;a.t++;
 const mul=e.broken?P.breakMul:1;
 if(a.n===1&&a.t===1&&G.floorD>0){a.thr=[];const n=G.floorD;for(let i=0;i<n;i++)a.thr.push(8+i*7);/* 投げ返しを先に終えてから、剣の動きを始める */a.d=8+(n-1)*7+20;a.C+=a.d;a.I+=a.d;G.floorD=0;text(HX+8,FLOOR-40,'投げ返し！','#d9e2f2',true)}
 if(a.n===1&&a.thr){for(const ht of a.thr){if(a.t===ht-8)SFX.slash();if(a.t===ht){e.kind==='imp'?SFX.rock():SFX.metal();dmgEnemy(heroAtk()*.7,'#d9e2f2','throw');burst(EX-8,FLOOR-18,'#d9e2f2',8,1.4,1);G.stop=P.stopThrowF;if(e.hp<=0)return ko(false)}}}
 if(a.n===1&&a.t===a.C)SFX.glint();
 if(a.n===1&&a.t===a.I&&e.stance&&!e.broken){const cp=contactPt();SFX.block();text(EX-10,FLOOR-56,'受け流された！','#ff9a9a',true);burst(cp.x,cp.y,'#fff3b0',14,2.2,1);mark(cp.x,cp.y,'star',8,'#ffffff');G.stop=P.stopDeflectF;shake(P.shake*P.shakeDeflectMul);
  e.stance=false;G.act=null;G.streak=0;startEnemy([{pre:4,m:1.3,red:true,counter:true,mv:e.kind==='lord'?'cut':undefined}]);return}
 if(a.n===1&&a.t===a.I){const gl=a.chase==='miss'&&a.early,cr=a.chase==='crit',cp=contactPt(),mx=cp.x,my=cp.y;
  if(gl)text(EX-14,FLOOR-56,'かすり','#9a8f96');
  if(cr){tutOn('heavy');G.stats.heavy++;syncStats();SFX.crit();gain(P.mkCrit);G.stop=P.stopCritF;shake(P.shake*P.shakeCritMul);flash(['#ffffff','#000000','#fff3b0','#000000']);
   mark(mx,my,'x',16,HSWD[0]);mark(mx,my,'star',14,HSWD[0]);ring(mx,my,3,34,18,HSWD[1]);burst(mx,my,HSWD[1],24,2.6,2);burst(mx,my,HSWD[0],10,3.4,1);knock(8);
   text(EX-14,FLOOR-56,'重い一撃！','#fff3b0',true);if(RM2.heavyMk)gain(RM2.heavyMk);dmgEnemy(heroAtk()*(P.critMul+RM2.heavy)*mul,'#fff3b0','heavy')}
  else{SFX.slash();dmgEnemy(heroAtk()*mul*(gl?P.missMul:1),'#ffe7a8','slash');mark(mx,my,'slash',7,HSWD[0]);G.stop=P.stopHit1F;shake(P.shake*P.shakeHit1Mul)}
  if(e.hp<=0)return ko(false)}
 if(a.n===1&&a.chase==='ok'&&(a.t===a.I+8||(RM2.triple&&a.t===a.I+16))){const cp=contactPt(),mx=cp.x,my=cp.y;tutOn('chase');G.stats.chase++;syncStats();
  SFX.chase();G.stop=P.stopChaseF;shake(P.shake*P.shakeChaseMul);flash(['#ffffff','#000000']);mark(mx,my,'x',11,'#ffd27a');mark(mx,my,'star',7,HSWD[0]);burst(mx,my,HSWD[1],16,2,2);knock(4);
  text(EX-14,FLOOR-56,a.t>a.I+8?'三の太刀！':'追撃！','#ffd27a',true);dmgEnemy(heroAtk()*(P.chaseMul+RM2.chase)*mul,'#ffd27a','chase');if(e.hp<=0)return ko(false)}
 if(a.n===2){const lv=a.lv,T=magT(lv),t=a.t;
  if(t===1){h.mk-=lv*100;SFX.cast(lv);text(HX,FLOOR-44,SPELL[lv]+'！',SCOL[lv],true);a.seed=1+(Math.random()*9999|0)}
  if(t<T){if(lv===1){const k=t/T;G.pts.push({x:HX+12+(EX-HX-24)*k,y:FLOOR-26-Math.sin(k*Math.PI)*12,vx:-.3,vy:-.2,t:0,life:10,col:t%2?'#ff9a3a':'#ffd27a',sz:2,drag:.9,g:-.02})}
   if(lv===2&&t%2)G.pts.push({x:HX+6+(Math.random()-.5)*10,y:FLOOR-38+(Math.random()-.5)*10,vx:(Math.random()-.5),vy:(Math.random()-.5),t:0,life:8,col:'#ffe14a',sz:1})
   if(lv===3)G.pts.push({x:EX-4+(Math.random()-.5)*44,y:FLOOR,vx:0,vy:-.6-Math.random()*.8,t:0,life:24,col:t%3?'#7fe3ff':'#fff3b0',sz:1,drag:1,g:-.01})}
  if(t===T){spellHit(lv);if(e.stance){e.stance=false;text(EX,FLOOR-56,'構えが崩れた','#fff3b0',true)}if(e.hp<=0)return ko(false)}
 }
 if(a.n===3&&a.t===8){tutOn('heal');h.pot--;if(h.psn){h.psn=0;text(HX,FLOOR-58,'毒が消えた','#c98ae8',true)}const v=Math.min(40,h.max-h.hp);h.hp+=v;SFX.heal();text(HX,FLOOR-40,'+'+v,'#8dffb0',true);burst(HX,FLOOR-14,'#8dffb0',16,.8,1)}
 if(a.t>=(a.n===1?a.I+(a.chase==='ok'?(RM2.triple?30:22):a.chase==='crit'?16:a.chase==='miss'?14:8):a.n===2?magT(a.lv)+16:20)){
  G.act=null;
  if(e.hp<=0)return win();
  if(e.broken){e.broken=0;e.brk=0;msg(`${e.name}は体勢を立て直した`)}
  if(e.shield&&!e.guardUp){e.guardUp=true;text(EX,FLOOR-40,'盾を構え直した','#cfd8e6')}
  if(G.mode==='tut'&&G.tut.done)return tutClear();
  if(e.sleep){G.state='cmd';G.t=0;return}
  if(e.rage&&e.roared===false){e.roared=true;G.state='roar';G.t=0;return}
  startEnemy();
 }
}
const ROAR_HOLD=66;
function roarStep(){const e=G.en;if(G.rh>0){G.rh--;return}const t=++G.t;if(t===2&&e.kind==='lord'&&!e.rhDone){e.rhDone=1;G.rh=ROAR_HOLD;G.t=1;return}
 if(e.kind==='lord'&&e.skin==='R'){if(t===1){SFX.block();shake(P.shake*.6)}
  if(t===22){SFX.kengeki();shake(P.shake*1.6);flash(['#ffffff','#5a0a10','#000000']);ring(EX,FLOOR-34,3,52,24,'#ff6a5a');if(e.p2)G.banner={s:'第二形態',t:0};text((HX+EX)/2+10,FLOOR-76,`${e.name}が本気になった！`,'#ff9a8a',true);msg(`${e.name}が本気になった！ 打ち合いが長く、速くなる`);for(let i=0;i<24;i++)G.pts.push({x:EX+(Math.random()-.5)*24,y:FLOOR-30+(Math.random()-.5)*30,vx:(Math.random()-.5)*2,vy:-.8-Math.random()*1.4,t:0,life:28,col:i%2?'#ff6a5a':'#ffd27a',sz:1,drag:.95,g:.02})}
  if(e.p2&&t>=24&&t<=58){e.hp=Math.round(e.hpMax*Math.min(1,(t-24)/34));if(t%6===0)SFX.tick(0,4)}
  if(t>=64){G.t=0;if(e.p2&&e.p2From==='enemy'){e.p2From=null;G.state='cmd';G.strikes=[];if(!usable(G.sel))G.sel=firstUsable();msg('A で決定（↑↓ でコマンドを選ぶ）')}else rageReady()}return}
 if(e.kind==='lord'){if(t===1){SFX.thud(1);shake(P.shake)}
  if(t===26){const FF=e.skin==='F';e.form='B';e.lit=true;markSeen('lordB');if(e.p2){if(!FF)e.name='暗い門のぬし';G.banner={s:'第二形態',t:0}}SFX.crack();SFX.roar();shake(P.shake*2.2);flash(['#ffffff','#3a0a4a','#000000','#c89aff','#000000']);ring(EX,FLOOR-34,3,56,26,'#c89aff');ring(EX,FLOOR-34,2,30,18,'#ffffff');text((HX+EX)/2+10,FLOOR-76,FF?'赤い門のぬしが、くらやみに呑まれていく……':'門のぬしが、くらやみを解き放った！','#e0b0ff',true);msg(FF?'赤い門のぬしが、くらやみに呑まれていく…… 剣のあいまに、くらやみの技が増える':'門のぬしが、くらやみを解き放った！ 剣に、くらやみの技が混ざる');for(let i=0;i<30;i++)G.pts.push({x:EX+6+(Math.random()-.5)*20,y:FLOOR-40+(Math.random()-.5)*24,vx:(Math.random()-.3)*2.4,vy:-.6-Math.random()*1.8,t:0,life:34,col:i%3?'#6a3a8a':'#e0b0ff',sz:i%4?1:2,drag:.96,g:-.01})}
  if(e.p2&&t>=30&&t<=74){e.hp=Math.round(e.hpMax*Math.min(1,(t-30)/44));if(t%6===0)SFX.tick(0,4)}
  if(t===40||t===54){SFX.wet();shake(P.shake)}
  if(t>26&&t<70&&t%4===0)G.pts.push({x:EX+10+Math.random()*14,y:FLOOR-30-Math.random()*24,vx:.3+Math.random()*.6,vy:-.4-Math.random()*.6,t:0,life:30,col:'#9060ac',sz:1,drag:.97,g:-.01});
  if(t>=80){G.t=0;if(e.p2&&e.p2From==='enemy'){e.p2From=null;G.state='cmd';G.strikes=[];if(!usable(G.sel))G.sel=firstUsable();msg('A で決定（↑↓ でコマンドを選ぶ）')}else rageReady()}return}
 if(e.kind==='hydra'){if(t===10){SFX.roar();shake(P.shake*2);flash(['#ffffff','#1a3a22','#000000']);const n0=aliveN();e.uhp=e.uhp.map(v=>v>0?v:Math.round(e.uhp0*.5));e.hp=e.uhp.reduce((a,b)=>a+b,0);e.lit=true;text(EX-24,FLOOR-70,aliveN()>n0?'首が生え直した！':'三つ首が怒った！','#9dffc4',true);msg('三つ首が怒った！ 首が生え直し、攻めが速くなる')}if(t===26||t===40){SFX.rage();shake(P.shake)}if(t>=72){G.t=0;rageReady()}return}
 if(t===10){e.col=e.col===EN.dragon.col?'#e0283c':mixHex(e.col,'#e0283c',.28);e.lit=true;SFX.roar();shake(P.shake*2);flash(['#ffffff','#5a0f18','#000000']);text(EX-24,FLOOR-34,'竜が怒った！','#ff7b86',true);msg('くらやみの竜が怒った！ 赤い炎は重いですが、弾けば大きく返せます')}
 if(t===26||t===40){SFX.rage();shake(P.shake*1.2)}
 if(t>=10&&t<50&&t%3===0)for(let i=0;i<3;i++)G.pts.push({x:EX-30,y:FLOOR-56,vx:-1.5-Math.random()*2,vy:(Math.random()-.5)*2.4,t:0,life:16,col:i%2?'#ff7b86':'#ffd27a',sz:1,drag:.95,g:0});
 if(t>=72){G.t=0;rageReady()}}

/* 怒りの咆哮のあと：すぐ斬らず、ひと呼吸の「来るぞ」を挟む（不意打ちにしない） */
const RAGE_READY=40;
function rageReady(){startEnemy();G.et=-RAGE_READY;G.rageRdy=RAGE_READY;text(HX+10,FLOOR-48,'来るぞ！','#ffe878',true);SFX.ready&&SFX.ready();msg('構えろ！ 怒りの一撃が来る')}
