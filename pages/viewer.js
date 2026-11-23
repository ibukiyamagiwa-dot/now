// モーション・演出ビューア：本編と同じ js/ を読んだあとに動く。敵と技を選んで繰り返し見る。
var VSPD=1; // 再生速度（0で一時停止）。本編のループが window.VSPD を見る
(function(){REC.seen=REC.seen||{};Object.keys(EN).forEach(k=>REC.seen[k]=1);try{localStorage.setItem('parryRPG.tutDone','1')}catch(_){}
 const V={key:'red',pv:0,cat:'enemy',item:'turn',resp:'parry',loop:true,wait:20,ww:0,chase:null,done:false};
 const isLordish=k=>EN[k].kind==='lord'||k==='gateK';
 const ROLE=k=>EN[k].boss?'ボス':EN[k].mid?'中ボス':'通常';
 const ORDER=['shroom','armor','bomb','boar','gslime','slime','bat','shade','samurai','imp','golem','beast','doll','ghost','boarM','shadeM','samuraiM','impM','dollM','ghostM','gateK','samuraiB','dragon','hydra','lord','red','fallen'].filter(k=>EN[k]);
 Object.keys(EN).forEach(k=>{if(!ORDER.includes(k))ORDER.push(k)});
 function items(){const k=V.key,e=EN[k];
  if(V.cat==='enemy'){const L=[['turn',PMOVES[k]?'おまかせ（本番どおり）':'いつもの攻撃',e.hint]];if(PMOVES[k])PMOVES[k].forEach(m=>L.push([m[0],m[1],m[2]+(m[3]?'（第二形態）':'')]));L.push(['red1','赤いひと振り（試し）','重い攻撃をどう受けるかを見る用']);return L}
  if(V.cat==='hero')return[['h1','たたかう','剣で斬る。追加の入力なし'],['h2','追撃','当たる6F前に押す（二の太刀）'],['h3','重い一撃','当たる1F前に押す'],['m1','ほのお','見切り1段のまほう'],['m2','かみなり','見切り2段のまほう'],['m3','ひかり','見切り3段のまほう'],['h4','かいふく','薬を使う']];
  const L=[...(e.boss||e.mid?[['enter','登場',e.mid?'中ボスの名乗り':'ボスの登場演出']]:[]),['ko','撃破','重い一撃でとどめを刺す'],['brk','ブレイク','あと1回のパリィで崩れる状態から'],['iai',isLordish(k)?'見切り返し':'居合返し','構えからの反撃を弾く']];
  [['0','打ち返し：今（十字）'],['A','打ち返し：A 一閃のみ'],['B','打ち返し：B 三日月'],['C','打ち返し：C 画面ごと斬る'],['D','打ち返し：D 白黒反転'],['E','打ち返し：E 大ヒットマーク']].forEach(([v,n])=>L.push(['uk'+v,n,'打ち合いを弾ききったあとの一撃（どの敵でも出せる）']));
  if(e.phases===2)L.splice(2,0,['p2','第二形態へ','膝をついて姿が変わる']);return L}
 function vStart(keepEnter){PV=V.pv;const pm=V.cat==='enemy'&&PMOVES[V.key]&&PMOVES[V.key].find(m=>m[0]===V.item);PMV=pm?pm[0]:null;
  startPractice(V.key);G.card=null;G.cards=[];G.banner=null;if(!keepEnter&&G.enter)G.enter.t=999;if(!keepEnter&&G.state==='bintro'){G.state='cmd';G.t=0}G.hero.hp=G.hero.max;V.wait=keepEnter?50:16;V.ww=0;V.done=false;V.chase=null}
 function vGo(){const e=G.en,it=V.item;G.hero.hp=G.hero.max;G.hero.pot=3;if(it!=='ko')e.hp=e.hpMax;V.chase=null;V.wait=40;
  if(V.cat==='enemy'){if(it==='red1')startEnemy([{pre:20,m:1.3,red:true,mv:isLordish(V.key)?'cut':undefined}]);else startEnemy();return}
  if(V.cat==='hero'){const n=it[0]==='m'?2:it==='h4'?3:1;if(n===2)G.hero.mk=(+it[1])*100;V.chase=it==='h2'?'ok':it==='h3'?'crit':null;G.sel=n;cmd(n);return}
  if(it==='enter'){vStart(true);return}
  if(it==='ko'){e.hp=1;V.chase='crit';G.sel=1;cmd(1);return}
  if(it==='brk'){e.brk=Math.max(0,breakNeed()-1);startEnemy();return}
  if(it==='iai'){startEnemy([{pre:4,m:1.3,red:true,counter:true,mv:isLordish(V.key)?'cut':undefined}]);return}
  if(it==='p2'){if(e.p2){vStart();return}lordPhase2();return}
  if(it.startsWith('uk')){UKV=it.slice(2);G.state='enemy';G.strikes=[];G.endT=G.et+1;G.rally={on:false,w:1,kick:0,n:5,N:5};G.stop=UK.END;G.vib='e';G.uk={t:0,dmg:87};try{SFX.parry()}catch(_){}flash(['#ffffff','#000000']);return}}
 const SE=startEnemy;startEnemy=function(list){if(V.cat==='hero'&&!list){G.state='cmd';G.t=0;G.act=null;return}return SE(list)};
 function respK(){const r=V.resp==='mix'?['parry','just','guard','none'][Math.floor(Math.random()*4)]:V.resp;return r==='parry'?2:r==='just'?8:r==='guard'?18:null}
 const T0=tick;tick=function(){if(G.card){G.card=null;G.cards=[]}
  const st=G.state,ff=['fx','hero'].includes(V.cat)&&['iai','brk'].includes(V.item);
  if(st==='cmd'&&!G.act){if(V.wait>0)V.wait--;else if(!V.done){vGo();if(!V.loop)V.done=true}}
  else if(st==='enemy'){const first=G.strikes.find(x=>!x.done),tg=G.strikes.find(x=>!x.done&&!x.fake&&!x.cx&&!x.res);
   if(tg&&first===tg&&G.et>=G.lock){if(tg._vk===undefined)tg._vk=(V.cat==='fx'||tg.rally)?2:respK();if(tg._vk!=null&&G.et>=tg.impact-tg._vk&&!tg._vp){tg._vp=1;press()}}}
  else if(st==='hero'){const a=G.act;if(V.chase&&a&&a.n===1&&!a.chase){const r=a.I-a.t;if((V.chase==='ok'&&r===6)||(V.chase==='crit'&&r===1))press()}}
  else if(st==='win'||st==='clear'||st==='lose'){if(++V.ww>60){V.ww=0;if(V.loop)vStart();}}
  T0()};
 /* ---- 操作パネル ---- */
 const bar=document.createElement('div');bar.id='vw';
 bar.innerHTML=`<div class="rw"><select id="vEn"></select><select id="vPv"><option value="0">ふつう</option><option value="1">赤い（覚悟2）</option><option value="2">黒い（覚悟3）</option><option value="3">紫の（覚悟4）</option></select></div>
 <div class="rw tabs" id="vCat"><button data-c="enemy">敵の技</button><button data-c="hero">騎士の技</button><button data-c="fx">演出</button></div>
 <div class="rw chips" id="vIt"></div>
 <div class="rw chips" id="vRs"><span>受け方</span><button data-r="parry">パリィ</button><button data-r="just">ジャスト</button><button data-r="guard">ガード</button><button data-r="none">受けない</button><button data-r="mix">まぜる</button></div>
 <div class="rw chips" id="vPl"><button id="vPause">一時停止</button><button id="vStep">1コマ</button><span>速さ</span><button data-s="1">1×</button><button data-s=".5">½</button><button data-s=".25">¼</button><button id="vLoop">くり返し</button><button id="vGd">ガイド</button><button id="vRe">最初から</button></div>
 <p id="vInfo"></p><p id="vLive"></p>`;
 const st=document.createElement('style');st.textContent=`#vw{background:#0e0914;color:#e8dcf0;font:13px/1.4 sans-serif;padding:6px 8px 10px;flex:none}
#vw .rw{display:flex;flex-wrap:wrap;gap:5px;align-items:center;margin:4px 0}
#vw select{background:#1d1626;color:#e8dcf0;border:1px solid #4a3a5a;border-radius:6px;padding:6px;font-size:14px;max-width:100%}
#vw button{background:#1d1626;color:#e8dcf0;border:1px solid #3e3250;border-radius:6px;padding:6px 8px;font-size:13px;min-height:34px}
#vw button.on{background:#e8c46a;color:#1a1008;border-color:#e8c46a}
#vw .tabs button{flex:1;font-weight:bold}
#vw .chips span{color:#9a8fae;margin-right:2px}
#vInfo{margin:6px 2px 0;color:#cdbfdc;min-height:1.4em}#vLive{margin:2px;color:#8fd8ff;font-family:monospace;min-height:1.4em}
body.mob #pad,body.mob #mmsg,body.mob #mhud,body.mob #mMenu{display:none!important}
#card,.tipbox,#tip{display:none!important}
body.port #vw{flex:1;overflow-y:auto}
body.mob:not(.port) #vw{position:fixed;left:0;top:0;bottom:0;width:236px;overflow-y:auto;z-index:99}
body.mob:not(.port) .stage{padding-left:calc(238px + env(safe-area-inset-left))!important}
body.mob:not(.port) canvas{width:calc(100vw - 244px);height:auto}`;
 document.head.appendChild(st);document.querySelector('canvas').after(bar);
 const q=id=>document.getElementById(id);
 q('vEn').innerHTML=['通常','中ボス','ボス'].map(g=>`<optgroup label="${g}">`+ORDER.filter(k=>ROLE(k)===g).map(k=>`<option value="${k}">${EN[k].name}</option>`).join('')+'</optgroup>').join('');
 function paint(){q('vEn').value=V.key;q('vPv').value=V.pv;
  bar.querySelectorAll('[data-c]').forEach(b=>b.classList.toggle('on',b.dataset.c===V.cat));
  const L=items();if(!L.some(x=>x[0]===V.item))V.item=L[0][0];
  q('vIt').innerHTML=L.map(([id,n])=>`<button data-i="${id}" class="${id===V.item?'on':''}">${n}</button>`).join('');
  q('vRs').style.display=V.cat==='enemy'?'':'none';bar.querySelectorAll('[data-r]').forEach(b=>b.classList.toggle('on',b.dataset.r===V.resp));
  bar.querySelectorAll('[data-s]').forEach(b=>b.classList.toggle('on',+b.dataset.s===(VSPD||PSPD)));
  q('vPause').classList.toggle('on',VSPD===0);q('vPause').textContent=VSPD===0?'再生':'一時停止';q('vLoop').classList.toggle('on',V.loop);q('vGd').classList.toggle('on',!!CFG.guide);
  const cur=L.find(x=>x[0]===V.item);q('vInfo').textContent=(cur?cur[2]:'')}
 let PSPD=1;
 function restart(){UKV=V.item&&V.item.startsWith('uk')?V.item.slice(2):UKV;G.uk=null;G.stop=0;G.xs=null;vStart();paint()}
 q('vEn').onchange=e=>{V.key=e.target.value;restart()};q('vPv').onchange=e=>{V.pv=+e.target.value;restart()};
 bar.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;e.stopPropagation();try{ac()}catch(_){}
  if(b.dataset.c){V.cat=b.dataset.c;V.item=null;restart();return}
  if(b.dataset.i){V.item=b.dataset.i;restart();return}
  if(b.dataset.r){V.resp=b.dataset.r;paint();return}
  if(b.dataset.s){PSPD=+b.dataset.s;if(VSPD!==0)VSPD=PSPD;paint();return}
  if(b.id==='vPause'){VSPD=VSPD===0?PSPD:0;paint();return}
  if(b.id==='vStep'){VSPD=0;tick();paint();return}
  if(b.id==='vLoop'){V.loop=!V.loop;if(V.loop)V.done=false;paint();return}
  if(b.id==='vGd'){CFG.guide=!CFG.guide;paint();return}
  if(b.id==='vRe'){restart();return}});
 ['pointerdown','touchstart'].forEach(ev=>bar.addEventListener(ev,e=>e.stopPropagation()));
 (function live(){try{const s=G.strikes&&G.strikes.find(x=>!x.done&&!x.fake);const r=s&&G.state==='enemy'?s.impact-G.et:null;const last=G.strikes&&[...G.strikes].reverse().find(x=>x.done&&x.res);
  q('vLive').textContent=`状態 ${G.state}${r!=null&&isFinite(r)?`　着弾まで ${r}F`:''}${last?`　直前：${({parry:'パリィ',just:'ジャスト',guard:'ガード'})[last.res]||last.res}`:''}${G.stop>0?`　止め ${G.stop}F`:''}`}catch(_){}requestAnimationFrame(live)})();
 window.V_=V;window.G_=()=>G;CFG.guide=false;vStart();paint()})();
