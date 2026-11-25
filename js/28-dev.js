/* ===== 開発者ページ（パスワード 1210） ===== */
const DEVPW='1210';let devOK=false;try{devOK=sessionStorage.getItem('parryRPG.devok')==='1'}catch(e){}
function openDev(){let d=$('devp');if(!d){d=document.createElement('div');d.id='devp';document.body.appendChild(d)}d.hidden=false;devRender()}
function closeDev(){const d=$('devp');if(d)d.hidden=true}
function devRender(){const d=$('devp');
 if(!devOK){d.innerHTML=`<div class="dw"><h2>開発者ページ<button class="x" data-dv="close">✕</button></h2><p class="note">パスワードを入れてください</p><div class="rw"><input id="dvPw" type="password" inputmode="numeric" maxlength="8" autocomplete="off"><button class="go" data-dv="pw">開く</button></div><p class="err" id="dvErr"></p></div>`;setTimeout(()=>{const i=$('dvPw');if(i)i.focus()},50);return}
 const keys=Object.keys(EN),opt=(a,v)=>a.map(([k,n])=>`<option value="${k}"${k==v?' selected':''}>${n}</option>`).join('');
 const st=d._st||(d._st={en:'golem',pv:0,rage:false,mk:false,K:1,fl:1,tut:0});
 const groups=[['main','基本'],['gauge','見切りゲージと追撃'],['ko','とどめの演出'],['adv','細かい項目']];
 d.innerHTML=`<div class="dw"><h2>開発者ページ<button class="x" data-dv="close">✕</button></h2>
 <h3>すぐ試遊</h3>
 <div class="rw"><select id="dvEn">${opt(keys.map(k=>[k,EN[k].name+(EN[k].boss?'（ボス）':EN[k].mid?'（中ボス）':'')]),st.en)}</select><select id="dvPv">${opt([[0,'ふつう'],[1,'赤い'],[2,'黒い']],st.pv)}</select></div>
 <div class="rw"><label class="ck"><input type="checkbox" id="dvRage"${st.rage?' checked':''}>怒った状態から（ボス）</label><label class="ck"><input type="checkbox" id="dvMk"${st.mk?' checked':''}>見切りを満タンで</label></div>
 <div class="rw"><button class="go" data-dv="fight">この敵と戦う（練習）</button></div>
 <div class="rw"><select id="dvK">${opt(KAKU.map((k,i)=>[i,'覚悟'+i+' '+k.n]),st.K)}</select><select id="dvFl">${opt([1,2,3,4,5,6,7,8,9].map(i=>[i,'地下'+i+'階（いちばん奥：覚悟0は6階、1〜3は8階、4は9階）']).concat([[99,'隠しボス（三つ首）']]),st.fl)}</select></div>
 <div class="rw"><button class="go" data-dv="run">この階から本番を始める</button></div>
 <div class="rw"><select id="dvTut">${opt(TUT.map((t,i)=>[i,(t.key==='pro'?'最初の演出（竜）':i+'. '+t.title)]),st.tut)}</select><button data-dv="tut">チュートリアルのここから</button></div>
 <h3>デバッグ</h3>
 <div class="rw">${[['bar','受付バーと着弾リング'],['slow','スロー（1/4倍）'],['stop','止める（. キーで1F進める）'],['god','自分が倒れない'],['fix','敵の行動を固定']].map(([k,n])=>`<label class="ck"><input type="checkbox" data-dbg="${k}"${dbg[k]?' checked':''}>${n}</label>`).join('')}</div>
 <p class="note">見え方（動きを確かめる用。保存はしない）</p>
 <div class="rw">${[['bgOff','背景を消す（灰色）'],['foeSee','敵を半透明'],['heroSee','主人公を半透明'],['fxOff','光と粒を消す'],['uiOff','文字と枠を消す']].map(([k,n])=>`<label class="ck"><input type="checkbox" data-dbg="${k}"${dbg[k]?' checked':''}>${n}</label>`).join('')}</div>
 <div class="rw"><button data-dv="unlock">すべて解放（覚悟・練習・チュートリアル済み）</button><button data-dv="wipe">記録を消す</button></div>
 <h3>調整</h3><p class="note">単位はフレーム（60F＝1秒）　次の攻撃から反映　このブラウザに保存されます</p>
 ${groups.map(([g,n])=>`<p class="note" style="color:#e8c46a;margin-top:12px">${n}</p>`+defRows(g,x=>`<div class="pr"><span class="nm">${x.n.replace(/[【】]/g,'')}</span><span class="vl" id="dvv_${x.k}">${fmt(P[x.k])}${x.u}</span><div class="ct"><button class="x" data-st="${x.k}" data-d="-1">−</button><input type="range" data-pk="${x.k}" min="${x.min}" max="${x.max}" step="${x.step}" value="${P[x.k]}"><button class="x" data-st="${x.k}" data-d="1">＋</button></div></div>`,(nm,h)=>`<details><summary style="color:#fff3b0;font-size:15px;min-height:36px;cursor:pointer">${nm}</summary>${h}</details>`)).join('')}
 <div class="rw" style="margin-top:12px"><button data-dv="reset">すべて初期値に戻す</button><button data-dv="copy">数値をコピー</button><button data-dv="load">貼った数値を読み込む</button></div>
 <textarea id="dvJson" spellcheck="false">${esc(JSON.stringify(toJ(),null,1))}</textarea>
 <div class="rw"><button data-dv="close">ゲームにもどる</button></div><p class="err" id="dvErr"></p></div>`}
function devSet(k,v){const x=DEF.find(q=>q.k===k);P[k]=Math.min(x.max,Math.max(x.min,+(+v).toFixed(4)));save();try{syncOut()}catch(e){}const o=$('dvv_'+k);if(o)o.textContent=fmt(P[k])+x.u;const r=document.querySelector(`#devp [data-pk="${k}"]`);if(r)r.value=P[k];const j=$('dvJson');if(j)j.value=JSON.stringify(toJ(),null,1)}
function devStart(){const d=$('devp'),st=d._st;st.en=$('dvEn').value;st.pv=+$('dvPv').value;st.rage=$('dvRage').checked;st.mk=$('dvMk').checked;st.K=+$('dvK').value;st.fl=+$('dvFl').value;st.tut=+$('dvTut').value}
function devAfter(){const d=$('devp'),st=d._st;G.card=null;G.cards=[];if(st.mk)G.hero.mk=100*lvMax();const e=G.en;if(st.rage&&e&&e.boss){e.rage=true;e.roared=true;G.state='roar';G.t=0}closeDev();closeMenu()}
document.addEventListener('click',e=>{const d=$('devp');if(!d||d.hidden||!d.contains(e.target))return;const b=e.target.closest('[data-dv],[data-st]');if(!b)return;ac();
 if(b.dataset.st){const x=DEF.find(q=>q.k===b.dataset.st);devSet(x.k,P[x.k]+(+b.dataset.d)*x.step);return}
 const a=b.dataset.dv;
 if(a==='close'){closeDev();return}
 if(a==='pw'){const v=$('dvPw').value;if(v===DEVPW){devOK=true;try{sessionStorage.setItem('parryRPG.devok','1')}catch(e){}devRender()}else{$('dvErr').textContent='パスワードがちがいます';$('dvPw').value='';tone(200,.08,'square',.05)}return}
 if(a==='fight'){devStart();const st=d._st;PV=st.pv;startPractice(st.en);devAfter();return}
 if(a==='run'){devStart();const st=d._st;RM2=freshMods();G=baseG();G.K=st.K;G.Kmin=st.K;G.order=makeOrder(st.K);G.runLen=G.order.length;G.hero.pot=KAKU[st.K].pot;G.runT=0;G.ranks=[];const fl=st.fl===99?(G.order.push('hydra'),G.order.length):Math.min(st.fl,G.runLen);startBattle(fl-1,false);devAfter();return}
 if(a==='tut'){devStart();startTut(d._st.tut);closeDev();closeMenu();return}
 if(a==='unlock'){REC.k=REC.k||{};REC.beatFallen=1;for(let i=0;i<KAKU.length;i++)if(!REC.k[i])REC.k[i]={rank:'A',time:599};REC.seen=REC.seen||{};Object.keys(EN).forEach(k=>REC.seen[k]=1);saveRec();setTutDone();$('dvErr').textContent='すべて解放しました';return}
 if(a==='wipe'){if(!confirm('記録・解放・チュートリアル済みを消します'))return;try{['parryRPG.rec','parryRPG.tutDone','parryRPG.tips'].forEach(k=>localStorage.removeItem(k))}catch(e){}location.reload();return}
 if(a==='reset'){DEF.forEach(x=>P[x.k]=x.v);save();try{syncOut()}catch(e){}devRender();$('dvErr').textContent='初期値に戻しました';return}
 if(a==='copy'){const j=$('dvJson');navigator.clipboard&&navigator.clipboard.writeText(j.value).then(()=>{$('dvErr').textContent='コピーしました'},()=>{j.select()});return}
 if(a==='load'){try{const n=applyJ(JSON.parse($('dvJson').value));save();try{syncOut()}catch(e){}devRender();$('dvErr').textContent=n+'項目を読み込みました'}catch(err){$('dvErr').textContent='読み込めませんでした'}return}
});
document.addEventListener('input',e=>{const t=e.target;if(!t.closest||!t.closest('#devp'))return;if(t.dataset.pk)devSet(t.dataset.pk,t.value);if(t.dataset.dbg){dbg[t.dataset.dbg]=t.checked;const m={bar:'dBar',slow:'dSlow',god:'dGod',fix:'dFix'}[t.dataset.dbg];if(m&&$(m))$(m).checked=t.checked}});
document.addEventListener('keydown',e=>{const d=$('devp');if(d&&!d.hidden&&e.key==='Enter'&&e.target.id==='dvPw'){e.preventDefault();d.querySelector('[data-dv="pw"]').click()}},true);

