/* ===== とどめ：止めて、寄って、砕く（ボスは連鎖爆発のあとで砕く） ===== */
function contactPt(){const e=G.en;if(e._cp)return e._cp;
 const img=eSpr(e,'n'),w=img.width,h=img.height,d=img.getContext('2d').getImageData(0,0,w,h).data,y0=Math.floor(h*.35),y1=Math.floor(h*.85);
 let fx=0;outer:for(let i=0;i<w;i++)for(let y=y0;y<=y1;y++)if(d[(y*w+i)*4+3]>128){fx=i;break outer}
 const SC=e.sc||1,px=EX-((w*SC)>>1)+fx*SC+1,py=FLOOR-Math.round(h*SC*.5)-(e.fly||0),ac=Math.asin(Math.max(-.55,Math.min(.55,(py-(FLOOR-10))/15)));
 return e._cp={x:px,y:py,ac,hx:px-6-Math.round(15*Math.cos(ac))}}
const lungeD=()=>contactPt().hx-HX;
function heroX(){let x=HX+Math.round(rallyW()*8);const k=G.hpose?G.hpose.k:'idle';x+=Math.round(lungeK(G.act)*lungeD());if(k==='dodge')x-=11;if(k==='hit')x-=3;if(k==='parry')x+=2;x+=hvX();return x}
function koSlowLen(){return!G.ko?P.koSlowF:G.ko.boss?Math.max(P.koSlowF,45):G.ko.parry?Math.round(P.koSlowF*.6):P.koSlowF}
function koZoomEnd(){const k=G.ko;return Math.max(koSlowLen(),k.boss?48:k.parry?16:6)}
function ko(parry,quiet){
 if(G.en&&G.en.phases===2&&!G.en.p2)return lordPhase2(quiet);
 const e=G.en,b=!!e.boss,p=enemyPose();
 const ex=G.ex!=null?Math.round(G.ex):e.kind==='boar'?boarX():Math.round(ENX(e)+p.lean*5-p.lunge*lungeDist(e)-p.twitch*6),hx=heroX();
 G.strikes.forEach(x=>x.done=true);G.state='ko';G.t=0;e.hurt=0;e.broken=0;
 const l0=Math.min(hx,ex)-26,r0=Math.max(hx,ex)+34;let z=S;for(let zz=S+P.koZoom;zz>S;zz--){if(960/zz>=r0-l0+8){z=zz;break}}
 G.stop=quiet?P.stopKoQuietF:b?P.stopBossF:e.mid&&!parry?Math.round(P.stopKoF*P.stopKoMidMul):parry?Math.round(P.stopKoF*P.stopKoParryMul):P.stopKoF;
 G.ko={boss:b,parry:!!parry,shattered:false,sliced:false,ex,stop0:G.stop,cam:{z,fx:(l0+r0)/2,fy:FLOOR-22}};
 const f=[];
 if(parry){for(let i=0;i<(b?5:2);i++)f.push('#ffffff','#7fe3ff','#000000')}
 else for(let i=0;i<(b?8:5);i++){const cc=i%2?'#000000':'#ffffff';f.push(cc,cc)}
 if(!quiet){flash(f);shake(P.koShake*.4);SFX.ko()}if(parry)SFX.parry();
 G.txt=G.txt.filter(t=>t.big&&t.s!=='パリィ！');
 msg(quiet?`打ち返しで${e.name}を倒した！`:parry?`見切った！ ${e.name}を返し斬りで倒した！`:b?`${e.name}をたおした！`:`${e.name}を倒した！`);
}
function sliceGeo(w,h,x0,y0){return{ax:x0-6,ay:y0+h*.7,bx:x0+w+6,by:y0+h*.25}}
function sliceOff(){const k=Math.min(1,G.ko.sliceT/10);return{ux:Math.round(9*k),uy:-Math.round(5*k),lx:-Math.round(2*k),ly:0}}
function nudge(t){if(G.anim-(G.nudgeA??-99)<8)return;G.nudgeA=G.anim;tone(230,.035,'square',.035);ring(HX+8,FLOOR-16,3,9,8,'#7a6870');if(t)text(HX+8,FLOOR-40,t,'#bba9b0')}
function ring(x,y,r0,r1,life,col){G.rings.push({x,y,r0,r1,t:0,life,col})}
function boom(){
 const e=G.en,img=eSpr(e,'n'),x=G.ko.ex+(Math.random()-.5)*img.width*.8,y=FLOOR-Math.random()*img.height*.8;
 burst(x,y,'#ffd27a',18,1.8,2);burst(x,y,'#ffffff',8,2.6,1);ring(x,y,2,14,14,'#ffd27a');SFX.boom();shake(P.koShake*.5);flash(['#ffd27a']);
}
function shatter(){
 const e=G.en,K=G.ko,img=eSpr(e,'n'),w=img.width,h=img.height,x0=K.ex-(w>>1),y0=FLOOR-h,cx=K.ex,cy=FLOOR-h/2;
 const d=img.getContext('2d').getImageData(0,0,w,h).data,sg=sliceGeo(w,h,x0,y0),so=K.sliced?sliceOff():null;
 for(let by=0;by<h;by+=2)for(let bx=0;bx<w;bx+=2){const i=(by*w+bx)*4;if(d[i+3]<128)continue;
  let ox=0,oy=0,up=false;if(so){const X=x0+bx,yl=sg.ay+(sg.by-sg.ay)*(X-sg.ax)/(sg.bx-sg.ax);up=y0+by<yl;ox=up?so.ux:so.lx;oy=up?so.uy:so.ly}
  G.pts.push({x:x0+bx+ox,y:y0+by+oy,vx:(bx-w/2)*.07+(Math.random()-.5)*.9,vy:-1.1-Math.random()*1.6+(by-h/2)*.02-(up?.8:0),t:0,life:70+Math.random()*50,col:`rgb(${d[i]},${d[i+1]},${d[i+2]})`,sz:2,drag:.985,g:.06,bounce:true})}
 const ac2=K.parry?'#7fe3ff':'#e8c46a';
 burst(cx,cy,'#ffffff',24,3,2);burst(cx,cy,ac2,20,2.2,2);
 ring(cx,cy,3,60,22,'#ffffff');ring(cx,cy,2,36,30,ac2);
 G.ko.shattered=true;SFX.shatter();shake(P.koShake);flash(['#ffffff','#ffffff',ac2]);
 text(K.ex,FLOOR-(K.parry?20:46),G.ko.boss?'たおした！':'撃破！','#e8c46a',true);
}
function slice(){
 const K=G.ko,e=G.en,img=eSpr(e,'n'),cy=FLOOR-img.height/2;
 K.sliced=true;K.sliceT=0;SFX.slice();shake(P.koShake*.7);flash(['#ffffff','#7fe3ff']);
 burst(K.ex,cy,'#bff4ff',22,2.6,1);ring(K.ex,cy,2,28,16,'#7fe3ff');text(K.ex-6,FLOOR-36,'返し斬り！','#7fe3ff',true);
}
function koStep(){
 const K=G.ko;G.t++;if(K.sliced)K.sliceT++;
 if(G.act&&G.t>koZoomEnd()){if(G.act.t<30)G.act.t++;else G.act=null}
 if(K.parry&&G.t===1)slice();
 if(G.en.kind==='lord'&&G.en.cine)return lordKoStep(K);
 if(K.boss){if((!K.parry&&G.t===1)||G.t===10||G.t===20||G.t===30)boom();if(G.t===42)shatter();if(G.t>=120)win()}
 else{if(G.t===(K.parry?12:1))shatter();if(G.t>=(K.parry?50:50))win()}
}
function streakUp(x,y){G.streak++;const n=G.streak;if(G.mode==='run'){G.maxStreak=Math.max(G.maxStreak||0,n);if(n>REC.bestChain){REC.bestChain=n;G.newChain=true;saveRec()}}if(n<2)return;
 const w=n>=5?'達人！':n>=3?'見事！':'';if(G.rally&&G.rally.on){if(w&&has('brk'))gain(P.mkStreak);return}text(x+4,y-8,`${n}連続！`,'#bff4ff');
 if(w){text(x,y-40,w,'#fff3b0',true);SFX.praise(n);if(has('brk'))gain(P.mkStreak);burst(x,y-20,'#fff3b0',14,1.6,1)}}
function confetti(){const cols=['#ff7b86','#ffd27a','#7fe3ff','#9dffc4','#c9a8ff','#ffffff'];for(let i=0;i<70;i++)G.pts.push({x:Math.random()*LW,y:-Math.random()*40,vx:(Math.random()-.5)*.5,vy:.25+Math.random()*.6,t:0,life:110+Math.random()*50,col:cols[i%cols.length],sz:Math.random()<.3?2:1,drag:1,g:.004})}
function praiseLine(){const b=G.bs;if(b.hurt===0)return'ノーダメージ！';if(b.parry>=4)return'見事な見切り！';if(b.parry>=2)return'いい受けだった！';return''}
function win(){
 if(G.mode==='tut')return tutClear();
 if(G.en&&G.en.phases===2&&!G.en.p2)return lordPhase2();
 if(!G.rp&&!REC.beatFallen&&(G.mode==='run'?G.order[G.bi]:G.pkey)==='fallen'){REC.beatFallen=1;saveRec();G.dojoNew=true;text(EX-4,FLOOR-86,'れんしゅうに「打ち合い道場」が開いた','#c9a8ff',true)}
 const h=G.hero,hidH=G.mode==='run'&&(G.K===2||G.K===3)&&G.order[G.bi]==='dragon'&&!G.order.includes('hydra'),hidR=G.mode==='run'&&G.K===4&&G.order[G.bi]==='lord'&&!G.order.includes('red')&&/[SA]/.test(battleRank(G.bs)),hid=hidH||hidR,boss=G.bi>=runLen()-1&&!hid;if(hid){G.order.push(hidR?'red':'hydra');G.hidNext=true}const hole=G.mode==='run'&&G.order[G.bi]==='red'&&!G.order.includes('fallen');G.state=hole?'hole':boss?'clear':'win';G.t=0;G.csel=0;if(!hole){SFX.win();confetti()}
 if(G.en.gold){h.pot=Math.min(P.potCap,h.pot+1);gain(100);text(HX,FLOOR-56,'ごほうび！ 薬+1 見切り+1段','#ffe878',true);SFX.praise(5)}
 const rk=battleRank(G.bs);(G.ranks=G.ranks||[]).push(rk);
 if(G.en.mid&&G.mode==='run'){gain(100);let got='見切り+1段';if((rk==='S'||rk==='A')&&h.pot<P.potCap){h.pot++;got+='　薬+1'}text(HX+10,FLOOR-70,'中ボス撃破！ '+got,'#ffe878',true);SFX.praise(4)}text(LW/2,30,`ランク ${rk}`,RANKC[rk],true);if(rk==='S')SFX.praise(5);
 const pl=praiseLine();if(pl)text(LW/2,46,pl,'#fff3b0',true);
 G.gotPot=false;if(rk==='S'&&h.pot<P.potCap){h.pot++;G.gotPot=true;text(HX,FLOOR-44,'薬+1','#8dffb0')}
 if(FEAT.unlocks){const sg=boss?3:1;META.soul+=sg;G.soulRun+=sg;saveMeta();text(LW/2,56,`魂 +${sg}`,'#c9a8ff')}
 if(boss&&!hole)bookClear();
 else if(G.mode==='prac')msg(`${G.en.name}をたおした！ ランク ${rk}　── A でもう一度（メニューで敵を変える）`);
 else{const v=Math.max(0,Math.min(h.max-h.hp,P.winHeal+kNow().heal+RM2.heal));h.hp+=v;msg(`${G.en.name}をたおした！${v?` HP+${v}`:''}${G.gotPot?'　ランクSで薬+1':''}`)}
}
function bookClear(){const st=G.stats,tot=st.parry+st.just+st.guard+st.hit,pr=tot?st.parry/tot:0;let rr=runRank(G.ranks);const t=G.runT||0;
  const K=G.Kmin,kr=(REC.k=REC.k||{})[K]||{};rr=capRank(rr);
  G.clr={boss:EN[G.order[G.bi]].name,hydra:G.order[G.bi]==='hydra',K,rank:rr,time:t,pr,chain:G.maxStreak||0,newRank:betterRank(rr,kr.rank),newTime:kr.time==null||t<kr.time,newChain:!!G.newChain,first:!REC.clears,firstK:!kr.rank,unlock:K<3&&!(REC.k[K])&&K>=1};
  if(G.order[G.bi]==='hydra')REC.hydra=1;REC.clears++;REC.k[K]={rank:G.clr.newRank?rr:kr.rank,time:G.clr.newTime?t:kr.time};if(betterRank(rr,REC.bestRank))REC.bestRank=rr;if(REC.bestTime==null||t<REC.bestTime)REC.bestTime=t;saveRec();G.csel=0;msg(`${EN[G.order[G.bi]].name}をたおした！ ランク ${rr}　タイム ${fmtT(t)}`)}
function enterPick(){G.state='pick';G.t=0;G.opts=rollOpts();G.psel=0;msg('強化を1つ選ぶ（↑↓ で選んで A）')}
function choose(i){const u=G.opts[i];if(!u)return;u.apply();RM2.taken[u.id]=1;SFX.full();next();syncStats()}
function next(){G.fled=false;if(G.mode==='prac')return startPractice(G.pkey);G.hero.mk=Math.floor(G.hero.mk*P.mkCarry/100);startBattle(G.bi+1,false)}
function enterResult(won){G.state='result';G.t=0;G.won=won;G.learnedList=[];
 let n;while((n=nextSys())&&META.soul>=n.cost){META.soul-=n.cost;META.lv++;G.learnedList.push(n)}saveMeta();
 G.learnedList.forEach((x,i)=>setTimeout(()=>SFX.praise(4),450+i*380));if(G.learnedList.length)setTimeout(confetti,450);
 const m=nextSys();msg((G.learnedList.length?`覚えた技：${G.learnedList.map(x=>x.name).join('・')}`:'')+(m?`次の技${qn(m.name)}まで 魂 あと${m.cost-META.soul}`:'')+'A で次の周へ')}
function resultPress(){newRun()}

