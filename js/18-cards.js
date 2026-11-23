/* ===== 解説カード（止めて、指し示して、1行で教える） ===== */
function showCards(list){if(!list||!list.length)return;G.cards=(G.cards||[]).concat(list.map(([at,s])=>({at,s})));if(!G.card)cardNext(true)}
function cardNext(first){if(G.card&&!first&&performance.now()-G.card.t0<250)return;
 const nx=(G.cards||[]).shift();if(!nx&&!first&&G.cardDone){const f=G.cardDone;G.cardDone=null;G.card=null;cardKey='';tone(1000,.04,'square',.05);return f()}if(G.card&&!first)tone(1000,.04,'square',.05);
 G.card=nx?Object.assign(nx,{t0:performance.now(),i:(G.card&&!first?G.card.i+1:(G.card?G.card.i+1:0)),n:0}):null;
 if(G.card)G.card.n=G.card.i+1+G.cards.length;cardKey=''}
let cardKey='';
function cvRect(x,y,w,h){const r=cv.getBoundingClientRect(),k=Math.max(r.width/960,r.height/540),ox=(r.width-960*k)/2,oy=(r.height-540*k)/2;return{left:r.left+ox+x*k,top:r.top+oy+y*k,width:w*k,height:h*k}}
function worldRect(x,y,w,h){const C=G.cam||{x0:0,y0:0,z:S};return cvRect((x-C.x0)*C.z,(y-C.y0)*C.z,w*C.z,h*C.z)}
function targetRect(at){
 const el=q=>{const e=document.querySelector(q);if(!e)return null;const r=e.getBoundingClientRect();return r.width&&r.height?r:null};
 switch(at){
  case'enemy':{const e=G.en;if(!e)return worldRect(EX-24,FLOOR-40,48,44);const im=eSpr(e,'n'),sc=e.sc||1,n=e.uhp&&e.kind!=='hydra'?aliveIdx().length:1,w=Math.round(im.width*sc)+8+(n-1)*14+(n>1?8:0),h=Math.round(im.height*sc)+6,xl=Math.round(EX-(n-1)*9-im.width*sc/2)-4;return e.kind==='hydra'?worldRect(xl-34,FLOOR-h-34,w+34,h+34):worldRect(xl,FLOOR-h,w,h)}
  case'hero':return worldRect(HX-12,FLOOR-36,44,40);
  case'heroHp':return PORTV?el('#hG')&&document.getElementById('hG').parentElement.getBoundingClientRect():cvRect(16,12,304,60);
  case'enemyHp':return PORTV?el('#eBar')&&document.getElementById('eBar').parentElement.parentElement.getBoundingClientRect():cvRect(640,12,304,60);
  case'gauge':return PORTV?el('#hMk'):cvRect(18,62,200,46);
  case'pot':return PORTV?el('#hPot'):cvRect(214,76,84,28);
  case'brk':return PORTV?el('#eSub'):cvRect(644,76,200,32);
  case'bar':case'cbar':return cvRect(BX-12,BY-32,BW+24,84);
  case'barGuard':{const fx=r=>bfx(r,bspan());return cvRect(fx(P.guardF)-4,BY-6,fx(0)-fx(P.guardF)+8,28)}
  case'barParry':{const fx=r=>bfx(r,bspan());return cvRect(fx(effParry())-4,BY-6,fx(0)-fx(effParry())+8,56)}
  case'barJust':{const fx=r=>bfx(r,bspan());return cvRect(fx(justF())-6,BY-6,fx(effParry())-fx(justF())+12,56)}
  case'cbarChase':{const fx=r=>bfx(r,cspan());return cvRect(fx(P.chaseF)-4,BY-6,fx(-P.lateF)-fx(P.chaseF)+8,56)}
  case'cbarHeavy':{const fx=r=>bfx(r,cspan());return cvRect(fx(P.critF)-6,BY-6,fx(-P.lateF)-fx(P.critF)+12,56)}
  case'menu':return MOB?el('#mMenu'):el('#menuBtn');
  case'cmd1':case'cmd2':case'cmd3':{const n=at[3];return MOB?el(`#pad [data-c="${n}"]`):el('#c'+n)}
 }return null}
function renderCard(){
 const box=$('card'),cd=G.card&&!MENU&&G.mode!=='title'?G.card:null;
 if(!cd){if(!box.hidden){box.hidden=true;cardKey=''}return}
 const sr=box.parentElement.getBoundingClientRect(),tr=targetRect(cd.at);
 const key=[cd.s,cd.i,tr&&[tr.left,tr.top,tr.width,tr.height].map(Math.round).join(','),sr.width,sr.height].join('|');if(key===cardKey)return;cardKey=key;
 box.hidden=false;const sp=box.querySelector('.spot'),cb=box.querySelector('.cbox');
 cb.querySelector('.ct').textContent=aW(cd.s);cb.querySelector('.cn').textContent=(MOB?'タップで次へ':'A で次へ')+(cd.n>1?`　${cd.i+1}／${cd.n}`:'')+'　▶';
 cb.style.top=cb.style.bottom='';
 if(tr){const p=6,L=tr.left-sr.left-p,T=tr.top-sr.top-p;sp.hidden=false;Object.assign(sp.style,{left:L+'px',top:T+'px',width:tr.width+p*2+'px',height:tr.height+p*2+'px'});box.classList.remove('nospot');
  const cy=T+tr.height/2;if(cy>sr.height/2)cb.style.bottom=Math.max(8,sr.height-T+12)+'px';else cb.style.top=Math.min(sr.height-120,T+tr.height+p*2+12)+'px'}
 else{sp.hidden=true;box.classList.add('nospot');cb.style.top='38%'}
}

