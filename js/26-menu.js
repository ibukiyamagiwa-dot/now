/* ===== タイトルとメニュー ===== */
let MENU=null;
const HELP=[
 ['A（Space・Enter・画面タップ）','決める／まもる／追撃　ボタンはこれひとつ'],
 ['↑↓','コマンドを選ぶ　　Esc／P：メニュー'],
 ['敵が光ったら','すぐ押すとガード、引きつけて直前ならパリィ（反撃）'],
 ['少し早めに押す','ジャスト回避　ダメージを受けない'],
 ['たたかう','剣が光ったら、当たる少し手前で追撃、触れる瞬間なら重い一撃'],
 ['見切り','パリィで溜まる力　まほうで放つ　3段まで溜めると最強の「ひかり」'],
 ['かいふく','薬でHPが40戻る　ランクSで勝つと薬が1つ増える（3つまで）'],
 ['赤い光','重い攻撃　当たると痛いが、弾けば大きく返せる']
];
function pauseItems(){if(G.rp)return[{l:'つづける',h:'打ち合いにもどる',a:()=>closeMenu()},{l:'種類を変える',h:'同じボスで、別の打ち合いをえらぶ',a:()=>{RPB=G.rp.b;openPage('rp2')}},{l:'ボスを変える',h:'打ち合うボスをえらびなおす',a:()=>openPage('rp1')},{l:'せってい',h:'音・揺れ・光・ガイドを自分好みにする',a:()=>openPage('settings')}];const it=[{l:'つづける',h:'戦いにもどる',a:()=>closeMenu()},{l:'あそびかた',h:'操作とコツをもう一度見る',a:()=>openPage('help')},{l:'せってい',h:'音・揺れ・光・ガイドを自分好みにする',a:()=>openPage('settings')}];
 if(G.mode==='prac'){if(PMOVES[G.pkey])it.push({l:'技を変える',h:'れんしゅうする技をえらびなおす',a:()=>{PMK=G.pkey;openPage('pmv')}});it.push({l:'敵を変える',h:'れんしゅうする敵をえらびなおす',a:()=>openPage('practice')})}
 else if(G.mode==='tut')it.push({l:'チュートリアルを飛ばす',h:'練習をやめて、本番の戦いを始める',a:()=>{closeMenu();skipTut()}});
 else it.push({l:'チュートリアル',h:'最初の演出か、基本の練習から始める',a:()=>openPage('tutsel')});
 it.push({l:'タイトルへもどる',h:'いまの戦いをやめて、最初の画面へ',a:()=>{closeMenu();toTitle()}});return it}
function settingsItems(){return[
 {l:'タイミングガイド',h:'攻撃が当たるまでの残り時間を、バーと輪で見せる',v:()=>G&&G.mode==='run'&&kNow().noGuide?'出せない':G&&G.mode==='run'&&kNow().guide?'あり（みならい）':CFG.guide?'あり':'なし',adj:()=>{CFG.guide=!CFG.guide}},
 {l:'音の大きさ',h:'効果音の音量　0で無音',v:()=>CFG.vol+' / 10',adj:d=>{CFG.vol=clamp(CFG.vol+d,0,10)}},
 {l:'BGMの大きさ',h:'音楽の音量　0で無音',v:()=>CFG.bgm+' / 10',adj:d=>{CFG.bgm=clamp(CFG.bgm+d,0,10)}},
 {l:'画面の揺れ',h:'攻撃が当たったときに画面が揺れる強さ',v:()=>CFG.shake+'%',adj:d=>{CFG.shake=clamp(CFG.shake+d*25,0,100)}},
 {l:'画面の点滅',h:'ピカッと光る演出の強さ　まぶしいときは下げる',v:()=>CFG.flash+'%',adj:d=>{CFG.flash=clamp(CFG.flash+d*25,0,100)}},
 MOB?{l:'振動',h:'弾いた・当たった瞬間に端末が震える（iPhoneは非対応）',v:()=>CFG.vib?'あり':'なし',adj:()=>{CFG.vib=!CFG.vib;if(CFG.vib)buzz(30)}}:{l:'開発パネル',h:'数値を調整する盤を、画面の横に出す',v:()=>CFG.dev?'出す':'隠す',adj:()=>{CFG.dev=!CFG.dev;applyDev()}},
 ...(CFG.devKey?[{l:'開発者ページ',h:'パスワードを入れると、すぐ試遊したり数値を調整したりできる',a:()=>openDev()}]:[]),
 {l:'もどる',h:'ひとつ前の画面へ',a:()=>menuBack()}]}
const titleItems=()=>RP_PAGE?[{l:'打ち合いをえらぶ',h:'ボスと打ち合いの種類をえらぶ',a:()=>openMenu('rp1')},{l:'せってい',h:'音・揺れ・光・ガイドを自分好みにする',a:()=>openMenu('settings')}]:[
 {l:'はじめる',h:TDONE?'覚悟をえらんで、いちばん奥をめざす':'まずは短い練習から　そのまま本番へ進む',a:()=>startGame()},
 {l:'れんしゅう',h:'出会った敵と、何度でも戦える',a:()=>openMenu('practice')},
 {l:'チュートリアル',h:'最初の演出か、基本の練習から始める',a:()=>openMenu('tutsel')},
 {l:'あそびかた',h:'操作とコツをまとめて見る',a:()=>openMenu('help')},
 {l:'せってい',h:'音・揺れ・光・ガイドを自分好みにする',a:()=>openMenu('settings')}];
function menuItems(){return!MENU?[]:MENU.page==='pause'?pauseItems():MENU.page==='settings'?settingsItems():MENU.page==='practice'?practiceItems():MENU.page==='pmv'?pmvItems():MENU.page==='rp1'?rpItems():MENU.page==='rp2'?rp2Items():MENU.page==='kakugo'?kakuItems():MENU.page==='tutsel'?[{l:'最初の演出から',h:'くらやみの竜との戦いから、もう一度',a:()=>{closeMenu();startTut(0)}},{l:'練習から',h:'演出を飛ばして、たたかうの練習から',a:()=>{closeMenu();startTut(1)}},{l:'もどる',h:'ひとつ前の画面へ',a:()=>menuBack()}]:[{l:'もどる',h:'ひとつ前の画面へ',a:()=>menuBack()}]}
function openMenu(page){ac();MENU={page:page||'pause',sel:0,stack:[]};tone(900,.05,'square',.05)}
function openPage(p){MENU.stack.push(MENU.page);MENU.page=p;MENU.sel=0;tone(1100,.04,'square',.05)}
function menuBack(){if(!MENU)return;if(MENU.stack.length){MENU.page=MENU.stack.pop();MENU.sel=0}else MENU=null;tone(700,.04,'square',.05)}
function closeMenu(){MENU=null}
function menuMove(d){const L=menuItems(),n=L.length;let k=MENU.sel;for(let j=0;j<n;j++){k=(k+d+n)%n;if(!L[k].sep)break}MENU.sel=k;tone(1200,.03,'square',.04)}
function menuAct(i,d){const it=menuItems()[i];if(!it)return;if(it.adj){it.adj(d||1);saveCfg();tone(1300,.04,'square',.05)}else if(it.a){it.a()}}
function toTitle(){RM2=freshMods();G=baseG();G.mode='title';G.state='title';G.tsel=0;G.en=Object.assign({},EN.dragon,{key:'dragon',hpMax:1,hp:1});msg('A ではじめる（↑↓ で選ぶ）')}
function startGame(){ac();SFX.full();if(!TDONE)startTut(0);else{openMenu('kakugo');MENU.sel=kOpen(REC.lastK||0)?(REC.lastK||0):0}}
function titleMove(d){const n=titleItems().length;G.tsel=(G.tsel+d+n)%n;tone(1200,.03,'square',.04)}
function drawTitle(){
 drawBG();l.fillStyle='rgba(8,3,10,.35)';l.fillRect(0,0,LW,LH);
 const k=G.anim%160,lunge=k>=146?(k-146)/14:k<6?1-k/6:0;
 {const im=spr('dragon'+((G.anim>>3)%8),'dragontitle'+((G.anim>>3)%8),enemyPal({kind:'dragon',col:'#b8323f'},'n'));l.drawImage(im,Math.round(186-lunge*40)-(im.width>>1),FLOOR-im.height)}
 shadowPx(HX+10,8);knight(HX+10,FLOOR,k<8?'parry':'idle',(G.anim>>4)%2,false);
 if(k<10){pxStar(HX+30,FLOOR-16,6+Math.round(10*(k/10)),'#e9fbff');pxArc(HX+30,FLOOR-16,4+k*3,0,Math.PI*2,'#7fe3ff')}
 c.imageSmoothingEnabled=false;c.fillStyle='#000';c.fillRect(0,0,960,540);c.drawImage(L,0,0,LW,LH,0,0,960,540);
 if(k<3&&CFG.flash>0){c.globalAlpha=.35*CFG.flash/100;c.fillStyle='#fff';c.fillRect(0,0,960,540);c.globalAlpha=1}
}
/* --- DOM の UI（タイトル・メニュー・スマホ操作盤・スマホHUD） --- */
function helpRows(){return MOB?[
 ['タップ','画面下の大きなボタン、または戦闘画面のどこでも　まもる／追撃は、ぜんぶこれひとつ'],
 ['コマンド','たたかう・まほう・かいふくは、押した瞬間に決まる'],...HELP.slice(2)]:HELP}
const esc=t=>String(t).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
let ovKey='',padKey='',hudKey='',msgKey='';
function syncUI(){document.body.classList.toggle('blk',G.state==='blown'&&G.t>78);document.body.classList.toggle('intitle',G.mode==='title'||(G.state==='hole'&&G.t>70)||(G.state==='clear'&&G.t>50&&!!G.clr)||(G.state==='lose'&&G.t>20&&G.mode==='run'));renderCard();
 $('hMk').classList.toggle('hl',G.mode==='tut'&&TUT[G.tut.i].key==='magic'&&!G.card);renderOv();renderPad();syncHud();syncMsg()}
function ovCtx(){
 if(MENU)return{page:MENU.page,items:menuItems(),sel:MENU.sel,set:i=>{MENU.sel=i}};
 if(G.mode==='title')return{page:'title',items:titleItems(),sel:G.tsel,set:i=>{G.tsel=i}};
 if(G.state==='hole'&&G.t>70)return{page:'hole',items:holeItems(),sel:G.csel||0,set:i=>{G.csel=i}};
 if(G.state==='clear'&&G.t>50&&G.clr)return{page:'clear',items:clearItems(),sel:G.csel||0,set:i=>{G.csel=i}};
 if(G.state==='lose'&&G.t>20&&G.mode==='run')return{page:'lose',items:loseItems(),sel:G.csel||0,set:i=>{G.csel=i}};
 return null}
function renderOv(){
 const ov=$('ov'),cx=ovCtx();
 if(!cx){if(!ov.hidden){ov.hidden=true;ovKey=''}return}
 const items=cx.items,sel=cx.sel,page=cx.page;
 const key=[page,sel,JSON.stringify(CFG),G.mode,TDONE,JSON.stringify(REC),PV].join('|');if(key===ovKey)return;ovKey=key;ov.hidden=false;
 ov.className='ov pg-'+page+' '+(page==='title'?'title':page==='clear'||page==='lose'||page==='hole'?'box clear':'box');
 let h='';
 if(page==='title'){h+='<div class="logo"><h2>'+(RP_PAGE?'打ち合い道場':'いまだ！')+'</h2><p>'+(RP_PAGE?'いまだ！　打ち合いの練習':'引きつけて、弾け')+'</p></div>';
  if(REC.clears||REC.bestChain){const t=topK(),kr=t>=0?REC.k[t]:null;h+=`<div class="rec">${kr?`<span>覚悟${t}クリア <b style="color:${RANKC[kr.rank]}">${kr.rank}</b></span><span>最短 <b>${fmtT(kr.time)}</b></span>`:REC.bestRank?`<span>ベスト <b style="color:${RANKC[REC.bestRank]}">${REC.bestRank}</b></span>`:''}<span>最高連続パリィ <b>${REC.bestChain}</b></span>${REC.clears?`<span>クリア <b>${REC.clears}</b>回</span>`:''}</div><p class="goal">${nextGoal()}</p>`}}
 else if(page==='clear'){const c=G.clr,nw=f=>f?'<i>新記録！</i>':'';h+=`<h2 class="ovh">${c.first?'はじめてのクリア！':c.firstK?`覚悟${c.K}をはじめてクリア！`:(c.boss||'くらやみの竜')+'をたおした！'}</h2><p class="goal">覚悟${c.K}「${KAKU[c.K].n}」${c.K<KAKU.length-1&&c.firstK?`　覚悟${c.K+1}が選べるようになった！`:''}</p><div class="rank" style="color:${RANKC[c.rank]}">${c.rank}</div><dl class="res"><dt>ランク</dt><dd>${G.ranks.map(r=>`<b style="color:${RANKC[r]}">${r}</b>`).join(' ')}${nw(c.newRank&&!c.first)}</dd><dt>タイム</dt><dd>${fmtT(c.time)}${nw(c.newTime&&!c.first)}</dd><dt>パリィ率</dt><dd>${Math.round(c.pr*100)}%</dd><dt>最高連続パリィ</dt><dd>${c.chain}${nw(c.newChain)}</dd></dl><p class="goal">${nextGoal()}</p>`}
else if(page==='hole')h+=`<h2 class="ovh">暗い穴がある</h2>`;
else if(page==='lose')h+=`<h2 class="ovh">やられた……</h2><p class="goal">${floorLbl()}　${G.en.name}</p>`;
else if(page!=='clear'&&page!=='hole') h+=`<h2 class="ovh">${page==='pause'?'メニュー':page==='settings'?'せってい':page==='practice'?'れんしゅう':page==='tutsel'?'チュートリアル':page==='kakugo'?'覚悟をえらぶ':page==='pmv'?(PMK&&EN[PMK]?EN[PMK].name+'の技':'技をえらぶ'):page==='rp1'?'打ち合い道場':page==='rp2'?(RPB?RPB.l+'の打ち合い':'打ち合いの種類'):'あそびかた'}</h2>`;
 if(page==='help')h+='<dl class="help">'+helpRows().map(([a,b])=>`<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join('')+'</dl>';
 h+='<div class="list" role="menu">'+items.map((it,i)=>{const on=i===sel?' on':'';
  if(it.v)return`<div class="it set${on}" data-i="${i}" role="menuitem"><span>${esc(it.l)}</span><span class="val"><button data-i="${i}" data-d="-1" aria-label="${esc(it.l)}を下げる">◀</button><b>${esc(it.v())}</b><button data-i="${i}" data-d="1" aria-label="${esc(it.l)}を上げる">▶</button></span></div>`;
  if(it.sep)return`<div class="sep" aria-hidden="true">${esc(it.sep)}</div>`;
  return`<button class="it${on}${it.lock?' lock':''}${it.s?' two':''}${it.wide?' wide':''}" data-i="${i}" role="menuitem"><span class="lb">${it.dot?`<i class="dot" style="background:${it.dot}"></i>`:''}${esc(it.l)}</span>${it.s?`<small>${esc(it.s)}</small>`:''}</button>`}).join('')+'</div>';
 const cur=items[sel];if(cur&&page!=='help')h+=`<p class="ovhint">${esc(cur.h)}</p>`;
 if(page==='title')h+=`<p class="ver" id="verTap">試作 ver.0.2${CFG.devKey?'　開発者ページ：せっていの中':VTAP>0?'　あと'+(5-VTAP)+'回':''}</p>`;
 ov.innerHTML=h;
}
function renderPad(){
 if(!MOB)return;const st=G.state,h=G.hero,p=$('pad'),hide=G.mode==='title'||!!MENU;
 const lab=$('def').textContent.replace('A：','');
 const key=[hide,st,G.mode,h.mk,h.pot,h.psn,G.floorD,G.en&&G.en.stance,G.en&&G.en.guardUp,G.en&&aliveN(),G.tut?G.tut.i:'',[1,2,3].map(n=>usable(n)?1:0).join(''),lab].join('|');if(key===padKey)return;padKey=key;
 if(hide){p.innerHTML='';return}
 if(st==='cmd'){const lv=Math.floor(h.mk/100),u=n=>usable(n)?'':' disabled';
  const tg=n=>{const t=cmdTag(n);return t?`<em class="${t.bad?'bad':'good'}">${t.s}</em>`:''};
  p.innerHTML=`<button class="pb main" data-c="1"${u(1)}>たたかう${tg(1)}</button><div class="prow"><button class="pb" data-c="2"${u(2)}>${esc(cmdName(2).replace('まほう：',''))}${tg(2)||`<small>${lv?'見切り '+lv+'段で放つ':'見切りが足りない'}</small>`}</button><button class="pb" data-c="3"${u(3)}>かいふく${tg(3)||`<small>薬 ×${h.pot}</small>`}</button></div>`}
 else{const idle=lab==='…',sub='';
  p.innerHTML=`<button class="pb a${idle?' idle':''}" data-a="1">${esc(idle?'……':lab)}${sub?`<small>${sub}</small>`:''}</button>`}
}
function syncHud(){
 if(!PORTV||G.mode==='title'||!G.en)return;const h=G.hero,e=G.en,showMk=lvMax()&&!(G.mode==='tut'&&TUT[G.tut.i].key!=='magic'),showBrk=has('brk')&&G.mode!=='tut',bl=G.mkFlash>0&&(G.mkFlash>>1)%2;
 const key=[h.psn,h.hp,h.max,h.mk,h.pot,e.hp,e.hpMax,e.name,e.brk,e.guardUp,G.state,G.mode,G.bi,G.tut&&G.tut.i,bl,showMk].join('|');if(key===hudKey)return;hudKey=key;
 $('mStage').textContent=G.mode==='tut'?tutLbl(true):floorLbl();
 const t=$('mTurn');t.textContent=G.state==='enemy'?'▼ 敵の攻撃':G.state==='cmd'?'▲ あなたの番':'';t.className=G.state==='enemy'?'foe':'you';
 $('hHp').textContent=`${h.hp}/${h.max}`;$('hBar').style.width=Math.max(0,h.hp/h.max*100)+'%';$('hG').classList.toggle('low',h.hp/h.max<=.3);
 const mk=$('hMk');mk.classList.toggle('fl',!!bl);
 mk.innerHTML=showMk?'見切り<span class="seg">'+Array.from({length:lvMax()},(_,i)=>{const f=Math.max(0,Math.min(100,h.mk-i*100));return f>=100?'<i class="f"></i>':`<i class="p" style="--w:${f}%"></i>`}).join('')+'</span>':'';
 $('hPot').innerHTML=`薬 ×${h.pot}`+(h.psn?`<b class="psn">毒 ${h.psn}</b>`:'');
 $('eNm').textContent=e.name+(e.boss?'（ボス）':e.mid?'（中ボス）':'');$('eHp').textContent=`HP ${e.hp}`;$('eBar').style.width=Math.max(0,e.hp/e.hpMax*100)+'%';
 const n=showBrk?breakNeed():0;$('eSub').textContent=(n?'ブレイク '+'●'.repeat(Math.min(e.brk,n))+'○'.repeat(Math.max(0,n-e.brk)):'')+(e.shield&&e.guardUp?'　盾：構え中':'')+(enemyTag(e)?'　'+enemyTag(e).s:'');
}
function syncMsg(){
 if(!PORTV)return;const tp=G.mode==='title'?'':aW(tutPrompt()),tb=G.tipBox?G.tipBox.s:'',ln=tp||tb?'':$('msg').textContent,ok=G.state==='tutok';
 const key=[tp,tb,ln,ok].join('|');if(key===msgKey)return;msgKey=key;
 $('mPrompt').textContent=tp;$('mPrompt').classList.toggle('ok',ok);$('mTip').textContent=tb;$('mLine').textContent=ln;
}

