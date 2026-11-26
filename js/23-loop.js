/* ===== ループ：ゲーム時間はヒットストップで止まり、演出は動き続ける ===== */
function tick(){
 G.anim++;
 if(G.mode==='title')return;
 if(G.rp&&G.state==='cmd'&&!G.act&&(G.rpw=(G.rpw||0)+1)>=55){G.rpw=0;G.en.hp=G.en.hpMax;G.hero.hp=Math.max(G.hero.hp,Math.round(G.hero.max*.6));startEnemy()}else if(G.rp&&G.state!=='cmd')G.rpw=0;
 if(G.mode==='run'&&G.state!=='clear')G.runT=(G.runT||0)+1;
 if(G.mode==='tut'&&G.state==='hero'&&TUT[G.tut.i].heroCards&&!G.tut.hcShown&&G.act&&G.act.n===1&&G.act.t>=10){G.tut.hcShown=1;showCards(TUT[G.tut.i].heroCards);return}
 if(G.mode==='tut'&&G.tut.after&&--G.tut.after.t<=0){const cs=G.tut.after.cards;G.tut.after=null;showCards(cs);return}
 if(G.mode==='tut'&&G.state==='cmd'&&TUT[G.tut.i].mid&&G.hero.mk>=100&&!G.tut.midShown){G.tut.midShown=1;showCards(TUT[G.tut.i].mid);return}
 G.shk=G.shk>.3?G.shk*.82:0;
 if(G.fl.length)G.fl.shift();
 for(const p of G.pts){p.t++;p.x+=p.vx;p.y+=p.vy;const dr=p.drag||.9;p.vx*=dr;p.vy=p.vy*dr+(p.g??.07);if(p.bounce&&p.y>FLOOR+2&&p.vy>0){p.y=FLOOR+2;p.vy*=-.35;p.vx*=.6}}
 for(const r of G.rings)r.t++;
 G.rings=G.rings.filter(r=>r.t<r.life);
 G.pts=G.pts.filter(p=>p.t<p.life);
 for(const t of G.txt)t.t++;
 G.txt=G.txt.filter(t=>t.t<(t.l||44));
 if(G.spark)G.spark.t++;
 if(G.mkFlash>0)G.mkFlash--;
 if(G.tipBox&&--G.tipBox.t<=0)G.tipBox=null;
 for(const m of G.marks)m.t++;
 G.marks=G.marks.filter(m=>m.t<m.life);
 if(G.stop>G.stopMax){if(G.stop>=3&&G.stop>G.stopMax+2)buzz(Math.min(90,G.stop*5));G.stopMax=G.stop}
 if(G.uk)ukStep();
 if(G.bored&&(G.state!=='cmd'||G.anim-G.bored.at>=G.bored.len))G.bored=null;
 if(G.stop>0){G.stop--;return}
 G.stopMax=0;
 if(G.knock>0)G.knock=Math.max(0,G.knock-.6);
 if(G.rally){G.rally.w=Math.max(0,Math.min(1,(G.rally.w||0)+(G.rally.on?.14:-.07)));G.rally.kick*=.72;if(!G.rally.on&&G.rally.w<=0)G.rally=null}
 if(G.hpose&&--G.hpose.t<=0)G.hpose=null;
 if(G.en.hurt>0)G.en.hurt--;
 if(G.state==='cmd'&&G.buf&&G.t>=10){const n=G.buf;G.buf=0;if(usable(n)){G.sel=n;cmd(n)}}
 if(G.state==='hero')heroStep();
 else if(G.state==='enemy')enemyStep();
 else if(G.state==='ko')koStep();
 else if(G.state==='blown')blownStep();
 else if(G.state==='roar')roarStep();
 else if(G.state==='enter')enterStep();
 else if(G.state==='bintro')bintroStep();
 else if(G.state==='hole'){G.t++;holeStep()}
 else if(G.state==='dying'){if(++G.t>28){G.state='lose';G.t=0;SFX.lose();msg(FEAT.unlocks?`力尽きた…… 第${G.bi+1}戦まで到達　A で結果へ`:(G.mode==='run'&&retryLim()<=(G.retries||0)?'やられた…… この覚悟では、その場でやり直せない':'やられた…… A ですぐ再挑戦（この戦闘の最初から）'))}}
 else{G.t++;if(G.state==='cmd')boredStep();if(G.state==='tutok'&&G.t>=100)nextTut();if(G.state==='win'&&G.t>=P.autoNextF)(FEAT.picks?enterPick():next())}
}

