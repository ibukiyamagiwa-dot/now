/* ===== パラメーター表（仕様書の【】名＝そのままキー） ===== */
const DEF=[
 {k:'parryF',n:'【パリィの受付フレーム】',v:6,min:1,max:20,step:1,u:'F',g:'main'},
 {k:'justMul',n:'【ジャスト回避の受付倍率】',v:2,min:1,max:4,step:.5,u:'×',g:'main'},
 {k:'guardF',n:'【ガードの受付フレーム】',v:30,min:8,max:60,step:1,u:'F',g:'main'},
 {k:'cueF',n:'【予兆から着弾までのフレーム】',v:28,min:10,max:60,step:1,u:'F',g:'main'},
 {k:'parryStopF',n:'【パリィ時のヒットストップフレーム】',v:12,min:0,max:30,step:1,u:'F',g:'main'},
 {k:'shake',n:'【画面振動の強さ】',v:10,min:0,max:30,step:1,u:'',g:'main'},
 {k:'counterMul',n:'【反撃の倍率】',v:1.5,min:0,max:4,step:.1,u:'×',g:'main'},
 {k:'golemBeatF',n:'【岩の巨人：ゴンの間隔フレーム】',v:13,min:4,max:16,step:1,u:'F',g:'adv'},
 {k:'golemLastF',n:'【岩の巨人：最後のゴンから当たるまでのフレーム】',v:8,min:2,max:16,step:1,u:'F',g:'adv'},
 {k:'earlyLockF',n:'【早押しの硬直フレーム】',v:24,min:0,max:60,step:1,u:'F',g:'adv'},
 {k:'hitStopF',n:'【被弾時のヒットストップフレーム】',v:6,min:0,max:30,step:1,u:'F',g:'adv'},
 {k:'guardDmgMul',n:'【ガード時の被ダメージ倍率】',v:.5,min:0,max:1,step:.05,u:'×',g:'adv'},
 {k:'potCap',n:'【薬の所持上限】',v:3,min:1,max:9,step:1,u:'',g:'adv'},
 {k:'winHeal',n:'【勝利後のHP回復量】',v:0,old:[30],min:0,max:100,step:5,u:'',g:'adv'},
 {k:'retryHp',n:'【やり直し時の最低HP】',v:40,min:1,max:100,step:5,u:'',g:'adv'},
 {k:'breakNeed',n:'【ブレイクに必要なパリィ回数】',v:4,old:[3],min:1,max:10,step:1,u:'回',g:'adv'},
 {k:'breakMul',n:'【ブレイク中の与ダメージ倍率】',v:1.5,old:[2],min:1,max:4,step:.1,u:'×',g:'adv'},
 {k:'enemyAtkMul',n:'【敵の攻撃力倍率】',v:1,min:.2,max:3,step:.1,u:'×',g:'adv'},
 {k:'heroAtk',n:'【たたかうの攻撃力】',v:12,min:1,max:60,step:1,u:'',g:'adv'},
 {k:'mkParry',n:'【パリィの見切り獲得量】',v:50,min:0,max:100,step:5,u:'',g:'gauge'},
 {k:'mkJust',n:'【ジャストの見切り獲得量】',v:25,min:0,max:100,step:5,u:'',g:'gauge'},
 {k:'mkHit',n:'【被弾時の見切り減少量】',v:50,min:0,max:100,step:5,u:'',g:'gauge'},
 {k:'magBase',n:'【まほう1段の威力】',v:26,min:1,max:100,step:1,u:'',g:'gauge'},
 {k:'tutSlow',n:'【チュートリアルのスロー倍率】',v:1,min:1,max:3,step:.1,u:'×',g:'adv'},
 {k:'mkCarry',n:'【勝利後の見切り持ち越し率】',v:80,min:0,max:100,step:10,u:'%',g:'gauge'},
 {k:'atkHoldF',n:'【たたかうの振りかぶりフレーム】',v:8,min:0,max:60,step:1,u:'F',g:'gauge'},
 {k:'magBonus',n:'【段ごとの威力ボーナス】',v:.3,min:0,max:1.5,step:.1,u:'×',g:'gauge'},
 {k:'mkMiss',n:'【追撃失敗の見切り減少量】',v:25,min:0,max:100,step:5,u:'',g:'gauge'},
 {k:'missMul',n:'【早押し時の一撃目の倍率】',v:.5,min:0,max:1,step:.1,u:'×',g:'gauge'},
 {k:'chaseF',n:'【追撃の受付フレーム】',v:8,old:[5,6],min:1,max:14,step:1,u:'F',g:'gauge'},
 {k:'critF',n:'【重い一撃の受付フレーム】',v:3,old:[2],min:0,max:8,step:1,u:'F',g:'gauge'},
 {k:'lateF',n:'【追撃・重い一撃の遅れの許容フレーム】',v:2,min:0,max:6,step:1,u:'F',g:'gauge'},
 {k:'chaseMul',n:'【追撃の倍率】',v:.5,min:0,max:2,step:.1,u:'×',g:'gauge'},
 {k:'critMul',n:'【重い一撃の倍率】',v:2,min:0,max:3,step:.1,u:'×',g:'gauge'},
 {k:'hit1StopF',n:'【通常の一撃のヒットストップフレーム】',v:4,min:0,max:20,step:1,u:'F',g:'gauge'},
 {k:'chaseStopF',n:'【追撃のヒットストップフレーム】',v:8,min:0,max:30,step:1,u:'F',g:'gauge'},
 {k:'bite',n:'【ヒットストップ中の刃の食い込み】',v:.03,min:0,max:.1,step:.01,u:'',g:'gauge'},
 {k:'critStopF',n:'【重い一撃のヒットストップフレーム】',v:16,min:0,max:40,step:1,u:'F',g:'gauge'},
 {k:'mkCrit',n:'【重い一撃の見切り獲得量】',v:15,min:0,max:100,step:5,u:'',g:'gauge'},
 {k:'mkStreak',n:'【連続パリィ（3回以上）のボーナス見切り】',v:15,min:0,max:100,step:5,u:'',g:'adv'},
 {k:'autoNextF',n:'【勝利後に自動で次へ進むまでのフレーム】',v:80,min:20,max:240,step:10,u:'F',g:'adv'},
 {k:'koStopF',n:'【とどめのヒットストップフレーム】',v:26,old:[40],min:0,max:120,step:2,u:'F',g:'ko'},
 {k:'bossStopF',n:'【ボス撃破のヒットストップフレーム】',v:72,min:0,max:180,step:2,u:'F',g:'ko'},
 {k:'koSlowF',n:'【とどめ後のスローフレーム】',v:27,old:[45],min:0,max:120,step:5,u:'F',g:'ko'},
 {k:'koZoom',n:'【とどめのカメラ寄り】',v:2,min:0,max:2,step:1,u:'段',g:'ko'},
 {k:'koShake',n:'【とどめの画面振動】',v:24,min:0,max:40,step:1,u:'',g:'ko'},
 /* 合図・やられ・パリィされ（design/GAME_REQUESTS.md の「合図・軌跡」「やられ」「パリィされとブレイク」） */
 {k:'cue2K',n:'【速い連撃の二撃目以降の合図】（間が予兆→着弾より短い撃。この覚悟まで出す　0＝みならいだけ、4＝全部、-1＝出さない）',v:0,min:-1,max:4,step:1,u:'',g:'adv'},
 {k:'cueShowF',n:'【合図の表示フレーム】',v:18,min:6,max:30,step:1,u:'F',g:'adv'},
 {k:'hitFlashF',n:'【ヒットフラッシュ】',v:2,min:0,max:12,step:1,u:'F',g:'adv'},
 {k:'hurtShake',n:'【震えの大きさ】（やられ）',v:1.6,min:0,max:4,step:.1,u:'画素',g:'adv'},
 {k:'hurtShakeF',n:'【やられの震えの長さ】',v:8,min:1,max:30,step:1,u:'F',g:'adv'},
 {k:'hurtPush',n:'【やられの押され幅】',v:2,min:0,max:8,step:1,u:'画素',g:'adv'},
 {k:'pryShakeS',n:'【パリィされの震え幅】（小：連撃の途中）',v:1.4,min:0,max:4,step:.1,u:'画素',g:'adv'},
 {k:'pryShakeB',n:'【パリィされの震え幅】（大：最後の一撃・赤）',v:2,min:0,max:4,step:.1,u:'画素',g:'adv'},
 /* 【連撃の間】：パリィのタイミング同士の間（ヒットストップは数えない）。同じ技なら固定 */
 {k:'ivGate2',n:'【連撃の間】門番：二連撃',v:44,min:6,max:60,step:1,u:'F',g:'adv'},
 {k:'ivGateK2',n:'【連撃の間】黒い門番：二連撃',v:44,min:6,max:60,step:1,u:'F',g:'adv'},
 {k:'ivLord2',n:'【連撃の間】門のぬし：二連撃',v:44,min:6,max:60,step:1,u:'F',g:'adv'},
 {k:'ivLordW',n:'【連撃の間】門のぬし：ささやきの二連撃',v:44,min:6,max:60,step:1,u:'F',g:'adv'},
 {k:'ivLordS',n:'【連撃の間】門のぬし：剣二つと触腕（剣）',v:44,min:6,max:60,step:1,u:'F',g:'adv'},
 {k:'ivLordSz',n:'【連撃の間】門のぬし：剣二つと触腕（触腕）',v:46,min:6,max:60,step:1,u:'F',g:'adv'},
 {k:'ivLord4',n:'【連撃の間】門のぬし：四連撃（二・三撃目）',v:42,min:6,max:60,step:1,u:'F',g:'adv'},
 {k:'ivLord4z',n:'【連撃の間】門のぬし：四連撃（最後の突き）',v:50,min:6,max:60,step:1,u:'F',g:'adv'},
 {k:'ivRed2',n:'【連撃の間】赤い騎士：二連撃',v:42,min:6,max:60,step:1,u:'F',g:'adv'},
 {k:'ivRed4',n:'【連撃の間】赤い騎士：四連撃（二・三撃目）',v:42,min:6,max:60,step:1,u:'F',g:'adv'},
 {k:'ivRed4z',n:'【連撃の間】赤い騎士：四連撃（最後の突き）',v:50,min:6,max:60,step:1,u:'F',g:'adv'},
 {k:'ivRedT',n:'【連撃の間】赤い騎士：三段突き',v:36,min:6,max:60,step:1,u:'F',g:'adv'},
 {k:'ivDrS',n:'【連撃の間】くらやみの竜：三段突き（二撃目）',v:38,min:6,max:60,step:1,u:'F',g:'adv'},
 {k:'ivDrSz',n:'【連撃の間】くらやみの竜：三段突き（三撃目）',v:44,min:6,max:60,step:1,u:'F',g:'adv'},
 {k:'ivDrB',n:'【連撃の間】くらやみの竜：赤い息から突き',v:42,min:6,max:60,step:1,u:'F',g:'adv'},
 {k:'ivDrT',n:'【連撃の間】くらやみの竜：尾から突き',v:40,min:6,max:60,step:1,u:'F',g:'adv'},
 {k:'ivBat',n:'【連撃の間】夜のコウモリ：二連撃',v:42,min:6,max:60,step:1,u:'F',g:'adv'},
 {k:'ivBeast',n:'【連撃の間】牙の盗賊：短剣の投げ',v:40,min:6,max:60,step:1,u:'F',g:'adv'},
 {k:'ivShadeM',n:'【連撃の間】うそつきの影：本物が2回続く',v:44,min:6,max:60,step:1,u:'F',g:'adv'},
 {k:'ivImp',n:'【連撃の間】石なげ小鬼：拍（4拍目で石が落ちる）',v:16,min:8,max:30,step:1,u:'F',g:'adv'},
 {k:'ivImpM',n:'【連撃の間】小鬼のおかしら：拍（4拍目で石が落ちる）',v:13,min:8,max:30,step:1,u:'F',g:'adv'},
 /* ステージ（design/stages.md）：覚悟ごとの5段。場所の作りは同じで、光の色・強さだけ変える。色は【数値をコピー／読み込む】で変える */
 {k:'stgGlow0',n:'【通路の光の色】覚悟0 みならい（上の階）',v:'#6e523e',t:'col',g:'stg'},
 {k:'stgGlow1',n:'【通路の光の色】覚悟1 ふつう（迷宮の階）',v:'#6c4650',t:'col',g:'stg'},
 {k:'stgGlow2',n:'【通路の光の色】覚悟2 つよき（赤い階）',v:'#7a3e2e',t:'col',g:'stg'},
 {k:'stgGlow3',n:'【通路の光の色】覚悟3 しにものぐるい（黒い階）',v:'#5a5862',t:'col',g:'stg'},
 {k:'stgGlow4',n:'【通路の光の色】覚悟4 ならく（紫の階）',v:'#5a4678',t:'col',g:'stg'},
 {k:'stgGk0',n:'【通路の光の強さ】覚悟0 みならい',v:0.85,min:0,max:1.2,step:.05,u:'',g:'adv'},
 {k:'stgGk1',n:'【通路の光の強さ】覚悟1 ふつう',v:0.85,min:0,max:1.2,step:.05,u:'',g:'adv'},
 {k:'stgGk2',n:'【通路の光の強さ】覚悟2 つよき',v:0.9,min:0,max:1.2,step:.05,u:'',g:'adv'},
 {k:'stgGk3',n:'【通路の光の強さ】覚悟3 しにものぐるい',v:0.85,min:0,max:1.2,step:.05,u:'',g:'adv'},
 {k:'stgGk4',n:'【通路の光の強さ】覚悟4 ならく',v:0.95,min:0,max:1.2,step:.05,u:'',g:'adv'},
 {k:'stgLmax',n:'【背景の明るさの上限】（画面の真ん中 x 70〜215・y 12〜105 の L*。合図の赤 L* 57 より14暗く）',v:43,min:20,max:70,step:1,u:'',g:'adv'},
 {k:'stgFire01a',n:'【たいまつの火】覚悟0・1（暗い色）',v:'#a85a2a',t:'col',g:'stg'},
 {k:'stgFire01b',n:'【たいまつの火】覚悟0・1（明るい色）',v:'#c8703a',t:'col',g:'stg'},
 {k:'stgFire2a',n:'【たいまつの火】覚悟2（暗い色）',v:'#8a3020',t:'col',g:'stg'},
 {k:'stgFire2b',n:'【たいまつの火】覚悟2（明るい色）',v:'#b8482a',t:'col',g:'stg'},
];
const P={};DEF.forEach(d=>P[d.k]=d.v);
const justF=()=>Math.round((P.parryF+(typeof RM2==='object'&&RM2?RM2.parryW:0))*P.justMul);
const magDmg=lv=>P.magBase*lv*(1+P.magBonus*(lv-1))*(1+(typeof RM2==='object'&&RM2?RM2.magic:0));
const toJ=()=>{const o={};DEF.forEach(d=>o[d.n]=P[d.k]);return o};
const fmt=v=>Number.isInteger(v)?String(v):(+v.toFixed(2)).toString();
function applyJ(o){let n=0;for(const d of DEF){if(d.t==='col'){if(typeof o[d.n]==='string'&&/^#[0-9a-f]{6}$/i.test(o[d.n])){P[d.k]=o[d.n].toLowerCase();n++}continue}if(typeof o[d.n]==='number'){P[d.k]=Math.min(d.max,Math.max(d.min,o[d.n]));n++}}return n}
try{const s=JSON.parse(localStorage.getItem('parryRPG.P')||'null');if(s){for(const d of DEF)if(d.old&&d.old.includes(s[d.n]))delete s[d.n];applyJ(s)}}catch(e){}
function save(){try{const o={};DEF.forEach(d=>{if(P[d.k]!==d.v)o[d.n]=P[d.k]});localStorage.setItem('parryRPG.P',JSON.stringify(o))}catch(e){}}

/* 細かい項目は種類ごとの見出しに分け、ふだんは閉じておく（2022-12-06「調整をしやすくする仕組み」：めったに使わない数値は隠し、要点を見やすくする）。
   どの見出しに入るかは名前の頭で決まる（名前は種類→対象→強さの順。iv…＝連撃の間、stg…＝ステージ）。どれにも当たらないものは「戦いの決まり」 */
const ADV_SUB=[['戦いの決まり',null],['合図・やられ・パリィされ',/^(cue|hitFlash|hurt|pry)/],['連撃の間',/^iv/],['敵ごとの拍',/^golem/],['ステージ（背景）　色は「数値をコピー／読み込む」で変える',/^stg/]];
const advSub=d=>{const i=ADV_SUB.findIndex(([,re])=>re&&re.test(d.k));return i<0?0:i};
/* g の項目を、行を作る関数 row で並べる。細かい項目だけは、見出しごとに閉じた入れもの（sub）に入れる */
function defRows(g,row,sub){const L=DEF.filter(d=>d.g===g&&d.t!=='col');if(g!=='adv')return L.map(row).join('');
 return ADV_SUB.map(([nm],i)=>{const M=L.filter(d=>advSub(d)===i);return M.length?sub(nm,M.map(row).join('')):''}).join('')}
function buildPanel(){
 for(const g of ['main','gauge','ko','adv']){
  $(g).innerHTML=defRows(g,d=>`<div class="row"><label for="p_${d.k}">${d.n}</label><output id="o_${d.k}"></output><input type="range" id="p_${d.k}" min="${d.min}" max="${d.max}" step="${d.step}"></div>`,(nm,h)=>`<details><summary>${nm}</summary>${h}</details>`);
 }
 DEF.forEach(d=>{if(d.t==='col')return;const i=$('p_'+d.k);i.value=P[d.k];i.addEventListener('input',()=>{P[d.k]=+i.value;syncOut();save()})});
 syncOut();
}
function syncOut(){
 DEF.forEach(d=>{if(d.t==='col')return;$('o_'+d.k).textContent=fmt(P[d.k])+d.u;$('p_'+d.k).value=P[d.k]});
 $('der').textContent=`→ ジャスト回避の受付：${justF()}F（パリィ×倍率）`;
 $('der2').textContent=`→ まほうの威力：ほのお ${Math.round(magDmg(1))}／かみなり ${Math.round(magDmg(2))}／ひかり ${Math.round(magDmg(3))}　追撃は敵と同じく、剣が光ってから${P.cueF}F後に着弾　着弾の${P.chaseF}F前から押すと追撃、${P.critF}F前から（剣が触れる瞬間）なら重い一撃`;
 $('json').value=JSON.stringify(toJ(),null,1);
}
const dbg={bar:false,slow:false,god:false,fix:false,all:false};
let CFG={guide:false,vol:7,bgm:5,shake:100,flash:100,dev:false,vib:true};
/* ?new：資料集の骨組みの描き方（js/24r-rig.js）で描く。いまは門番だけ。保存はしない */
const NEWDRAW=/[?&]new(?:[&=]|$)/.test(location.search);
const MOB=matchMedia('(hover:none) and (pointer:coarse)').matches||/[?&]mob/.test(location.search);
let PORTV=false,UIS=1;
function layout(){PORTV=MOB&&innerHeight>innerWidth;UIS=PORTV?1.9:MOB?1.3:1;document.body.classList.toggle('mob',MOB);document.body.classList.toggle('port',PORTV)}
function aW(s){if(!MOB||!s)return s;return s.replace(/を選んで A/,'をタップ').replace(/A を押す/g,'タップする').replace(/A を押して/g,'タップして').replace(/A ?で ?/g,'タップで ').replace(/ ?A(?=[ →！　、「]|$)/g,'タップ').replace(/（↑↓[^）]*）/g,'')}
function buzz(ms){if(MOB&&CFG.vib&&navigator.vibrate)try{navigator.vibrate(ms)}catch(e){}}
try{Object.assign(CFG,JSON.parse(localStorage.getItem('parryRPG.cfg')||'{}'))}catch(e){}
function saveCfg(){try{localStorage.setItem('parryRPG.cfg',JSON.stringify(CFG))}catch(e){}}
function applyDev(){document.body.classList.toggle('nodev',!CFG.dev)}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const guideOn=()=>{if(dbg.bar)return true;if(G&&G.mode==='run'&&kNow().noGuide)return false;return CFG.guide||(G&&G.mode==='tut')||(G&&G.mode==='run'&&kNow().guide)};
const heroGuide=()=>{if(dbg.bar)return true;if(G.mode==='tut')return['chase','heavy'].includes(TUT[G.tut.i].key);if(G.mode==='run'&&kNow().noGuide)return false;return CFG.guide||(G.mode==='run'&&kNow().guide)};
[['dBar','bar'],['dSlow','slow'],['dGod','god'],['dFix','fix'],['dAll','all']].forEach(([id,k])=>$(id).addEventListener('change',e=>dbg[k]=e.target.checked));

