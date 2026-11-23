// 打ち返しの演出くらべ：本編と同じ js/ を読んだあとに動く。赤い騎士で打ち返しを繰り返し見せる。
UKV='A';
const UKPREV=true;
{const P0=press;press=function(){if(UKPREV)return;return P0.apply(this,arguments)}} // くらべ中は押しても何も起きない
(function(){REC.seen=REC.seen||{};REC.seen.red=1;try{localStorage.setItem('parryRPG.tutDone','1')}catch(_){}
 PV=0;PMV=null;startPractice('red');G.card=null;G.cards=[];if(G.enter)G.enter.t=999;let wait=40;
 function go(){const g=G;g.card=null;g.cards=[];g.state='enemy';g.strikes=[];g.et=0;g.endT=1e9;g.en.hp=g.en.hpMax;g.hero.hp=g.hero.max;g.txt=[];
  g.rally={on:false,w:1,kick:0,n:5,N:5};g.stop=UK.END;g.vib='e';g.uk={t:0,dmg:87};try{SFX.parry()}catch(_){}flash(['#ffffff','#000000']);msg('')}
 const T0=tick;tick=function(){if(G.card){G.card=null;G.cards=[]}if(G.state==='cmd'||G.state==='enter'){G.state='enemy';G.strikes=[];G.endT=1e9}
  if(!G.uk&&!G.stop){if(--wait<=0){wait=55;go()}}T0()};
 const bar=document.createElement('div');bar.id='ukbar';
 const P=[['0','今の（十字）','いま本編に入っている版。十字が細い線'],['A','一閃のみ','十字なし。一閃に太さの抑揚と暗い輪郭をつけ、当たった瞬間に太くはじけて火の粉が散る'],['B','三日月','敵の上に塗りの三日月（風切り）。後ろに衝撃の輪'],['C','画面ごと斬る','一閃の線で画面が上下にずれて、戻る'],['D','白黒反転','一瞬だけ墨絵のように白黒になり、赤い斬撃が走る'],['E','大ヒットマーク','斬った向きに長い棘の星＋衝撃の輪＋破片']];
 bar.innerHTML='<div class="r">'+P.map(([k,n])=>`<button data-v="${k}"><b>${k==='0'?'今':k}</b><span>${n}</span></button>`).join('')+'<button data-slow="1"><b>遅</b><span>スロー</span></button></div><p id="ukcap"></p>';
 const st=document.createElement('style');st.textContent=`#ukbar{background:#0e0914;padding:8px;font:14px/1.45 sans-serif;color:#e8dcf0;flex:none}
#ukbar .r{display:flex;flex-wrap:wrap;gap:6px}
#ukbar button{background:#2a2036;color:#e8dcf0;border:1px solid #4a3a5a;border-radius:8px;padding:8px 10px;font-size:14px;min-height:40px}
#ukbar button b{margin-right:6px;color:#e8c46a}#ukbar button.on{background:#e8c46a;color:#1a1008;border-color:#e8c46a}#ukbar button.on b{color:#1a1008}
#ukcap{margin:8px 2px 0;min-height:2.9em;color:#cdbfdc}
body.mob #pad,body.mob #mmsg,body.mob #mhud,body.mob #mMenu{display:none!important}
body.port #ukbar{flex:1;overflow-y:auto}
body.mob:not(.port) #ukbar{position:fixed;left:0;top:0;bottom:0;width:58px;padding:6px 4px;overflow-y:auto;z-index:99;background:rgba(14,9,20,.9)}
body.mob:not(.port) #ukbar .r{flex-direction:column}
body.mob:not(.port) .stage{padding-left:calc(60px + env(safe-area-inset-left))!important}
body.mob:not(.port) #ukbar button{padding:6px 0;min-height:44px}
body.mob:not(.port) #ukbar button b{margin:0}
body.mob:not(.port) #ukbar button span,body.mob:not(.port) #ukcap{display:none}`;document.head.appendChild(st);document.querySelector('canvas').after(bar);
 const set=k=>{UKV=k;wait=8;G.uk=null;G.stop=0;G.xs=null;bar.querySelectorAll('[data-v]').forEach(b=>b.classList.toggle('on',b.dataset.v===k));$('ukcap').textContent=P.find(p=>p[0]===k)[2]};
 bar.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;e.stopPropagation();try{ac()}catch(_){}if(b.dataset.v)set(b.dataset.v);if(b.dataset.slow){dbg.slow=!dbg.slow;b.classList.toggle('on',dbg.slow)}});
 ['pointerdown','touchstart'].forEach(ev=>bar.addEventListener(ev,e=>e.stopPropagation()));
 set('A');window.UKT=()=>G.uk?G.uk.t:-1})();
