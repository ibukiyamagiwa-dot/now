/* ===== 入力 ===== */
document.addEventListener('keydown',e=>{
 const tg=e.target;if(tg.tagName==='TEXTAREA'||tg.tagName==='INPUT'||tg.tagName==='SELECT')return;{const dv=$('devp');if(dv&&!dv.hidden){if(e.key==='Escape')closeDev();return}}
 /* コマ送り（開発者ページの「止める」）：. で1F進める。押しっぱなしで続けて進む（2024-03-01「デバッグモード」、2023-02-28「エフェクトをスローで見てみよう」） */
 if(dbg.stop&&e.key==='.'&&!MENU&&G.mode!=='title'){e.preventDefault();try{tick()}catch(err){loopErr(err)}return}
 if(e.repeat)return;
 const isA=e.code==='Space'||e.key==='Enter'||'jkzJKZ'.includes(e.key),up=e.key==='ArrowUp'||e.key==='w'||e.key==='W',dn=e.key==='ArrowDown'||e.key==='s'||e.key==='S';
 if(e.key==='Escape'||e.key==='p'||e.key==='P'){e.preventDefault();if(MENU)menuBack();else if(G.mode!=='title')openMenu();return}
 if(!MENU&&G.mode==='run'&&(G.state==='clear'||G.state==='lose'||G.state==='hole')&&ovCtx()){if(isA||up||dn){e.preventDefault();if(tg.blur)tg.blur()}const its=ovCtx().items,n=its.length;if(up)G.csel=((G.csel||0)+n-1)%n;else if(dn)G.csel=((G.csel||0)+1)%n;else if(isA)its[G.csel||0].a();if(up||dn)tone(1200,.03,'square',.04);return}
 if(G.card&&!MENU&&G.mode!=='title'){if(isA||up||dn){e.preventDefault();if(tg.blur)tg.blur();if(isA)cardNext()}return}
 if(MENU||G.mode==='title'){if(isA||up||dn||e.key.startsWith('Arrow')){e.preventDefault();if(tg.blur)tg.blur()}
  if(MENU){if(isA)menuAct(MENU.sel,1);else if(up)menuMove(-1);else if(dn)menuMove(1);else if(e.key==='ArrowLeft')menuAct(MENU.sel,-1);else if(e.key==='ArrowRight')menuAct(MENU.sel,1)}
  else{ac();if(isA)titleItems()[G.tsel].a();else if(up||e.key==='ArrowLeft')titleMove(-1);else if(dn||e.key==='ArrowRight')titleMove(1)}
  return}
 const gameKey=e.code==='Space'||'123jkzJKZwsWS'.includes(e.key)||e.key==='Enter'||e.key.startsWith('Arrow');
 if((tg.tagName==='INPUT'||tg.tagName==='SUMMARY'||tg.tagName==='BUTTON')&&gameKey){
  if(tg.tagName==='INPUT'&&tg.type==='range'&&(e.key.startsWith('Arrow')||'wsWS'.includes(e.key)))return;
  e.preventDefault();tg.blur();
 }
 if(e.code==='Space'||e.key==='Enter'||'jkzJKZ'.includes(e.key)){e.preventDefault();press()}
 else if(e.key==='ArrowUp'||e.key==='ArrowLeft'||e.key==='w'||e.key==='W'){e.preventDefault();move(-1)}
 else if(e.key==='ArrowDown'||e.key==='ArrowRight'||e.key==='s'||e.key==='S'){e.preventDefault();move(1)}
 else if('123'.includes(e.key)&&G.state==='cmd'&&usable(+e.key)){G.sel=+e.key}
});
document.addEventListener('keyup',e=>{if(e.target.tagName==='BUTTON'&&(e.code==='Space'||e.key==='Enter'))e.preventDefault()});
document.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>b.blur()));
document.addEventListener('pointerdown',e=>{const v=e.target&&e.target.closest&&e.target.closest('#verTap');if(!v)return;e.preventDefault();e.stopPropagation();try{ac()}catch(_){}if(CFG.devKey)return;VTAP=(VTAP||0)+1;tone(900+VTAP*150,.04,'square',.05);if(VTAP>=5){CFG.devKey=true;saveCfg();tone(1800,.12,'square',.06)}ovKey=''},true);let VTAP=0;
$('def').addEventListener('pointerdown',e=>{e.preventDefault();ac();if(G.card&&!MENU)return cardNext();if(MENU){menuAct(MENU.sel,1);return}if(G.mode==='title'){titleItems()[G.tsel].a();return}press()});
$('def').addEventListener('click',e=>{if(e.detail===0)press()});
[1,2,3].forEach(n=>$('c'+n).addEventListener('click',()=>{if(G.card)return cardNext();pick1(n)}));
cv.addEventListener('pointerdown',e=>{e.preventDefault();ac();if(MENU||G.mode==='title')return;if(G.card)return cardNext();press()});
$('card').addEventListener('pointerdown',e=>{e.preventDefault();ac();cardNext()});
$('ov').addEventListener('click',e=>{const t=e.target.closest('[data-i]');if(!t)return;const i=+t.dataset.i,d=+(t.dataset.d||1);ac();const cx=ovCtx();if(!cx)return;
 cx.set(i);if(MENU)menuAct(i,d);else cx.items[i].a()});
$('pad').addEventListener('pointerdown',e=>{e.preventDefault();ac();if(MENU||G.mode==='title')return;if(G.card)return cardNext();
 const b=e.target.closest('.pb');if(b){b.classList.add('pr');setTimeout(()=>b.classList.remove('pr'),110)}
 if(G.state==='cmd'){if(!b||!b.dataset.c||b.disabled)return nudge();const n=+b.dataset.c;if(!usable(n))return nudge();G.sel=n;if(G.t>=10)cmd(n);else G.buf=n;return}
 press()});
$('mMenu').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();ac();if(MENU)menuBack();else if(G.mode!=='title')openMenu()});
['touchend','click'].forEach(ev=>document.addEventListener(ev,()=>ac(),{passive:true}));
document.addEventListener('contextmenu',e=>{if(MOB)e.preventDefault()});
addEventListener('resize',()=>{layout();ovKey=padKey=hudKey=msgKey=cardKey=''});
$('menuBtn').addEventListener('click',()=>{if(MENU)menuBack();else if(G.mode!=='title')openMenu()});
document.addEventListener('visibilitychange',()=>{if(document.hidden){try{bgmMute()}catch(_){}}if(document.hidden&&G&&G.mode!=='title'&&!MENU)openMenu()});
$('bPrev').addEventListener('click',()=>{G.hero.hp=G.hero.max;G.hero.pot=3;startBattle(Math.max(0,G.bi-1),false)});
$('bNext').addEventListener('click',()=>{G.hero.hp=G.hero.max;G.hero.pot=3;startBattle(Math.min(runLen()-1,G.bi+1),false)});
$('bRe').addEventListener('click',()=>startBattle(G.bi,true));
$('bMk').addEventListener('click',()=>{gain(100)});
$('bTut').addEventListener('click',()=>startTut(0));
$('skipTut').addEventListener('click',()=>skipTut());
if(!FEAT.unlocks)['bSoul','bForget'].forEach(id=>$(id).style.display='none'),$('dAll').closest('label').style.display='none';
$('bSoul').addEventListener('click',()=>{META.soul+=5;saveMeta();msg(`魂 ${META.soul}`)});
$('bForget').addEventListener('click',()=>{META={soul:0,lv:0};saveMeta();newRun();msg('技と魂をリセットしました')});
$('bCopy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('json').value);msg('数値をコピーしました')}catch(e){$('json').select();msg('選択しました　Ctrl+C でコピーしてください')}});
$('bLoad').addEventListener('click',()=>{try{const n=applyJ(JSON.parse($('json').value));syncOut();save();msg(`${n}項目を読み込みました`)}catch(e){msg('読み込めませんでした　JSONの形を確認してください')}});
$('bReset').addEventListener('click',()=>{DEF.forEach(d=>P[d.k]=d.v);syncOut();save();msg('初期値に戻しました')});


