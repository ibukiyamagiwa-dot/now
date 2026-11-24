/* ===== 資料集ページ：見えているカードだけ動かす ===== */
let SPD=1,ANIM=[];const BGC={};
function bgData(kind,ctx){if(BGC[kind])return BGC[kind];bgFill(ctx,kind);return BGC[kind]=ctx.getImageData(0,0,CW,CH)}
function paint(ctx,B,bg){const im=new ImageData(new Uint8ClampedArray(bg.data),bg.width,bg.height);for(let i=0;i<B.c.length;i++){const c=B.c[i];if(!c)continue;const[r,g,b]=rgb(c);im.data[i*4]=r;im.data[i*4+1]=g;im.data[i*4+2]=b;im.data[i*4+3]=255}ctx.putImageData(im,0,0)}
function el(t,cls,html){const e=document.createElement(t);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}
function moveCard(M,cat){const c=el('figure','card');if(cat)c.dataset.cat=cat;const cv=el('canvas');cv.width=CW;cv.height=CH;c.appendChild(cv);
 let kd=KINDOF(M.id);if(cat&&cat!=='atk'&&kd==='atk')kd=cat==='idle'?'stand':'show';if(M.hero)kd='hero';const tag=kd==='hero'?`<span class="tag ex">主人公</span>`:kd==='main'?`<span class="tag st">立ち絵</span>`:kd==='stand'?`<span class="tag st">派生の立ち絵</span>`:kd==='show'?`<span class="tag sh">演出</span>`:EXMV[M.id]?`<span class="tag ex">いまの技：${EXMV[M.id]}</span>`:`<span class="tag nw">新しい技（案）</span>`;
 const lights=(M.cues||[]).map(c=>c.col).filter((v,i,a)=>a.indexOf(v)===i).map(c=>`<i class="lt ${c}"></i>`).join('');
 const gap=(M.cues&&M.hits&&M.cues.length&&M.hits.length)?`<span class="gap">合図→当たり ${M.hits[0]-M.cues[0].t}F</span>`:'';
 const ctag=cat?`<span class="tag ct ct-${cat}">${(MCATS.concat(HCATS).find(c=>c[0]===cat)||[,''])[1]}</span>`:'';const meta=el('figcaption','',`<div class="row">${ctag}<b>${M.n}</b>${tag}</div><p class="read"><span class="k">読み方</span>${M.cap}${(M.cues||[]).some(c=>cueHidden(M,c))?'<br><small>※ 二撃目以降の光は、覚悟「みならい」（下の帯の0）でだけ出る。ふだんは構えで数と間を読む。</small>':''}</p><p class="why"><span class="k">意味</span>${M.why||''}</p><div class="row foot">${lights}${gap}<span class="fr"></span></div>`);
 c.appendChild(meta);const a={cv,ctx:cv.getContext('2d'),M,t:0,vis:false,pause:false,fr:meta.querySelector('.fr'),draw(){paint(this.ctx,frame(this.M,Math.floor(this.t)),bgData(this.M.bg||'def',this.ctx));this.fr.textContent=Math.floor(this.t)%this.M.len+'F'}};
 cv.onclick=()=>{a.pause=!a.pause;c.classList.toggle('paused',a.pause)};ANIM.push(a);a.draw();return c}
function stageCard(s){const c=el('figure','card stage');const cv=el('canvas');cv.width=SW;cv.height=SH;c.appendChild(cv);
 c.appendChild(el('figcaption','',`<div class="row"><b>ステージ：${s.n}</b><span class="tag nw">専用ステージ</span></div><p class="read"><span class="k">見えるもの</span>${s.cap}</p><p class="why"><span class="k">意味</span>${s.why}</p>`));
 const a={cv,ctx:cv.getContext('2d'),t:0,vis:false,pause:false,draw(){stageFrame(s,Math.floor(this.t)).toCanvas(this.ctx)}};cv.onclick=()=>{a.pause=!a.pause;c.classList.toggle('paused',a.pause)};ANIM.push(a);a.draw();return c}
/* 立ち絵：大きく、地面だけ */
function standCanvas(key,w,h,ox,sc,ext){const cv=el('canvas','stand');cv.width=w;cv.height=h;const S=SPEC[key];const idle=MV.find(m=>m.f===key&&/idle/.test(m.id));
 const a={cv,ctx:cv.getContext('2d'),t:0,vis:false,pause:false,draw(){const B=new Buf(w,h),tt=Math.floor(this.t);const P=idle?poseAt0(idle,tt%idle.len,Object.assign({},PDEF,S.pose)):{};if(idle&&idle.pp)idle.pp(P,tt%idle.len);if(KTINT&&S.tintable)P.tint=KTINT;if(ext)Object.assign(P,ext);P.chainL=P.chainL||22;
   (S.draw||knight)(B,ox,h-6,S,P,tt);if(key==='lord'||key==='lord2')pool(B,joints(ox,h-6,S,Object.assign({},PDEF,S.pose)),tt,key==='lord'?16:24);B.outline();if(S.aura)(S.aura.smoke?auraSmoke(B,S.aura,tt,1):aura(B,S.aura,tt));const ctx=this.ctx;ctx.clearRect(0,0,w,h);B.toCanvas(ctx)}};ANIM.push(a);a.draw();return cv}
function ladder(keys,notes){const wrap=el('div','ladder');keys.forEach((k,i)=>{const col=el('div','step');const S=SPEC[k];col.appendChild(standCanvas(k,80,104,44));col.appendChild(el('div','lname',S.name));col.appendChild(el('div','ladd',notes[i]));wrap.appendChild(col);if(i<keys.length-1)wrap.appendChild(el('div','arrow','→'))});return wrap}
function build(){const root=document.getElementById('book');
 root.appendChild(heroSec());root.appendChild(ladderSec());
 FORMS.forEach((F,i)=>{const sec=el('section','form');sec.id=F.key;
  const head=el('div','fhead');head.appendChild(el('div','num',String(i+1).padStart(2,'0')));head.appendChild(el('div','',`<div class="en">${F.en}</div><h2>${F.ttl}</h2>`));sec.appendChild(head);sec.dataset.title=F.ttl;
  const top=el('div','ftop');const art=el('div','art');art.appendChild(standCanvas(F.key,110,120,F.sox||62));if(F.old)art.appendChild(el('div','old',`<img src="${OLDIMG[F.old]}" alt=""><span>いまのゲーム</span>`));top.appendChild(art);
  const txt=el('div','ftxt');txt.appendChild(el('p','lore',F.lore));
  const pl=el('div','pal');F.pal.forEach(p=>pl.appendChild(el('div','chip',`<i style="background:${p[0]}"></i><b>${p[1]}</b><span>${p[2]}</span>`)));txt.appendChild(pl);top.appendChild(txt);sec.appendChild(top);
  if(F.states){sec.appendChild(el('h3','','首が減ると'));const w=el('div','ladder');F.states.forEach(([n,e,d],i)=>{const col=el('div','step');col.appendChild(standCanvas(F.key,110,112,F.sox||62,null,e));col.appendChild(el('div','lname',n));col.appendChild(el('div','ladd',d));w.appendChild(col);if(i<F.states.length-1)w.appendChild(el('div','arrow','→'))});sec.appendChild(w)}
  if(F.variants){sec.appendChild(el('h3','','覚悟による色の段 <small>のまれていく段階</small>'));sec.appendChild(el('p','note',F.vnote||'ゲームでは覚悟2から体の色が変わる（赤い→黒い→紫の）。色の段は「くらやみにのまれていく段階」なので、色だけでなく、のまれた分だけ部品も増やす。怒りのひびと炎の赤は、どの段でも同じ明るさで光り、体の色より目立つ。'));
   const VT=F.vt?window[F.vt]||eval(F.vt):DR,w=el('div','ladder');F.variants.forEach(([t,n],i)=>{const col=el('div','step');col.appendChild(standCanvas(F.key,110,112,F.sox||62,null,{tint:t}));col.appendChild(el('div','lname',VT[t].lbl));col.appendChild(el('div','ladd','<b>'+(F.vt?VT[t].name.replace(VT.n.name,F.ttl):VT[t].name.replace('くらやみの竜',F.ttl))+'</b><br>'+n));w.appendChild(col);if(i<F.variants.length-1)w.appendChild(el('div','arrow','→'))});sec.appendChild(w)}
  if(F.pair){const Pp=F.pair;sec.appendChild(el('h3','',`モブ：${Pp.ttl} <small>同じ骨格・技が1つ少ない</small>`));const w=el('div','ladder');[[Pp.key,Pp.ttl],[F.key,F.ttl+'（中ボス）']].forEach(([k,n],i)=>{const col=el('div','step');col.appendChild(standCanvas(k,120,96,k===F.key?(F.sox||62):66));col.appendChild(el('div','lname',n));w.appendChild(col);if(!i)w.appendChild(el('div','arrow','→'))});sec.appendChild(w);
   const dt=el('table','parts');dt.innerHTML='<tr><th>くらべる所</th><th>モブと中ボス</th></tr>'+Pp.diff.map(p=>`<tr><td>${p[0]}</td><td>${p[1]}</td></tr>`).join('');sec.appendChild(dt)}
  const tb=el('table','parts');tb.innerHTML='<tr><th>部品</th><th>意味</th></tr>'+F.parts.map(p=>`<tr><td>${p[0]}</td><td>${p[1]}</td></tr>`).join('');sec.appendChild(tb);
  const ids=movesFor(F.key);sec.appendChild(el('h3','',`モーション <small>${ids.length}</small>`));const tabs=el('div','mtabs'),g=el('div','grid');
  MCATS.forEach(([c,n])=>{const k=c==='all'?ids.length:ids.filter(id=>catOf(F.key,id)===c).length;if(!k)return;const bt=el('button',c==='all'?'on':'',`${n}<small>${k}</small>`);bt.onclick=()=>{tabs.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===bt));g.querySelectorAll('.card').forEach(cd=>cd.style.display=(c==='all'||cd.dataset.cat===c)?'':'none')};tabs.appendChild(bt)});
  sec.appendChild(tabs);ids.forEach(id=>g.appendChild(moveCard(MV.find(m=>m.id===id),catOf(F.key,id))));sec.appendChild(g);
  if(F.stage.length){sec.appendChild(el('h3','','専用ステージ'));const sg=el('div','sgrid');F.stage.forEach(id=>sg.appendChild(stageCard(STAGES.find(s=>s.id===id))));sec.appendChild(sg)}
  root.appendChild(sec)});
 root.appendChild(orderSec());
 const io=new IntersectionObserver(es=>es.forEach(e=>{const a=ANIM.find(a=>a.cv===e.target);if(a)a.vis=e.isIntersecting}),{rootMargin:'100px'});ANIM.forEach(a=>io.observe(a.cv));
 let last=0;const loop=ts=>{requestAnimationFrame(loop);if(ts-last<32)return;const dt=(ts-last)/16.67;last=ts;if(!SPD)return;for(const a of ANIM)if(a.vis&&!a.pause){a.t+=Math.min(4,dt)*SPD;a.draw()}};requestAnimationFrame(loop);
 document.querySelectorAll('#spd button[data-s]').forEach(b=>b.onclick=()=>{SPD=+b.dataset.s;document.querySelectorAll('#spd button[data-s]').forEach(x=>x.classList.toggle('on',x===b))});
 document.querySelectorAll('#spd button[data-k]').forEach(b=>b.onclick=()=>{MINARAI=b.dataset.k==='m';KTINT=b.dataset.k==='n'||b.dataset.k==='m'?null:b.dataset.k;document.querySelectorAll('#spd button[data-k]').forEach(x=>x.classList.toggle('on',x===b));for(const a of ANIM)a.draw()});
 router(root)}
/* ===== 1体ずつ見る：目次と、上の帯と、ページの切りかえ ===== */
const NAVG=[['はじめに',[['toc','目次'],['rules','約束'],['hero','主人公'],['ladder','階段'],['order','強さの順'],['next','この先']]],['門の系統',['gate','dgate','lord','lord2']],['赤の系統',['red','red2','fallen','fallen2']],['竜',['dragon','hydra']],['中ボスとモブ',['boarM','boar','shadeM','shade','samuraiM','samurai','impM','imp']]];
const TTL=k=>(FORMS.find(F=>F.key===k)||{}).ttl||k;
function tocSec(){const s=el('section','toc');s.id='toc';s.appendChild(el('h2','','目次'));s.appendChild(el('p','lead','見たいキャラをえらぶ。各ページのモーションは「出現・待機・攻撃・やられ・撃破」で絞りこめる。下の帯の「覚悟」で、段ごとの姿（色と、のまれた分だけ増える部品）に切りかわる。段を描いてあるのは、くらやみの竜・三つ首の竜（亡骸）・イノシシ。門の番人たちと赤の系統は、どの覚悟でも同じ姿。'));
 NAVG.slice(1).forEach(([g,keys])=>{s.appendChild(el('h4','',g));const w=el('div','tgrid');keys.forEach(k=>{const F=FORMS.find(x=>x.key===k);if(!F)return;const a=el('a','tcard');a.href='#'+k;a.appendChild(standCanvas(k,110,100,F.sox||62));const ids=movesFor(k),cnt=MCATS.slice(1).map(([c,n])=>{const v=ids.filter(id=>catOf(k,id)===c).length;return v?`<span class="ct ct-${c}">${n} ${v}</span>`:''}).join('');a.appendChild(el('div','tname',`<b>${F.ttl}</b><div class="tcnt">${cnt}</div>`));w.appendChild(a)});s.appendChild(w)});return s}
function router(root){const nx=document.getElementById('next');if(nx)root.appendChild(nx);root.insertBefore(tocSec(),root.firstChild);
 const order=NAVG.flatMap(([g,ks])=>ks.map(k=>Array.isArray(k)?k[0]:k));
 document.getElementById('nav').innerHTML=NAVG.map(([g,ks])=>`<span class="ng"><i>${g}</i>${ks.map(k=>Array.isArray(k)?`<a href="#${k[0]}" data-k="${k[0]}">${k[1]}</a>`:`<a href="#${k}" data-k="${k}">${TTL(k)}</a>`).join('')}</span>`).join('');
 /* ページの下に、前後の移動 */order.forEach((k,i)=>{const sec=document.getElementById(k);if(!sec)return;const f=el('div','pnext');const pv=order[i-1],nv=order[i+1];f.innerHTML=(pv?`<a href="#${pv}">← ${TTL(pv)==='toc'?'目次':(NAVG[0][1].find(x=>x[0]===pv)||[0,TTL(pv)])[1]}</a>`:'<span></span>')+(nv?`<a href="#${nv}">${(NAVG[0][1].find(x=>x[0]===nv)||[0,TTL(nv)])[1]} →</a>`:'<span></span>');sec.appendChild(f)});
 const show=()=>{let k=(location.hash||'#toc').slice(1);if(!document.getElementById(k)||!order.includes(k))k='toc';[...root.children].forEach(c=>{if(c.tagName==='SECTION')c.style.display=c.id===k?'':'none'});document.querySelectorAll('#nav a').forEach(a=>{const on=a.dataset.k===k;a.classList.toggle('on',on);if(on)a.scrollIntoView({block:'nearest',inline:'center'})});document.querySelector('header.cover').style.display=k==='toc'?'':'none';window.scrollTo(0,0)};
 window.addEventListener('hashchange',show);show()}
function heroSec(){const s=el('section','hero');s.id='hero';s.appendChild(el('div','fhead','<div class="num">00</div><div><div class="en">THE KNIGHT</div><h2>主人公</h2></div>'));
 s.appendChild(el('p','lead','名実ともに騎士。顔は見せない。だれもが自分を重ねられる。盾は顔の代わりで、キャラクターの中心。最初は何も描かれていない盾に、歩んだ道のりが刻まれていく。'));
 {const ids=HMV_IDS,tabs=el('div','mtabs'),g=el('div','grid');s.appendChild(el('h3','',`モーション <small>${ids.length}</small>`));
  HCATS.forEach(([c,n])=>{const k=c==='all'?ids.length:ids.filter(id=>MV.find(m=>m.id===id).cat===c).length;if(!k)return;const bt=el('button',c==='all'?'on':'',`${n}<small>${k}</small>`);bt.onclick=()=>{tabs.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===bt));g.querySelectorAll('.card').forEach(cd=>cd.style.display=(c==='all'||cd.dataset.cat===c)?'':'none')};tabs.appendChild(bt)});
  s.appendChild(tabs);ids.forEach(id=>{const M=MV.find(m=>m.id===id);g.appendChild(moveCard(M,M.cat))});s.appendChild(g)}
 s.appendChild(el('h3','','クリアチェッカーの差分'));
 const g=el('div','hgrid');HVARS.forEach(v=>{const c=el('figure','card hv');const S=heroVar(v.o||{});const cv=standCanvas2(S,60,56,34);c.appendChild(cv);c.appendChild(el('figcaption','',`<div class="row"><b>${v.n}</b><span class="tag ex">${v.how}</span></div><p class="why">${v.why}</p>`));g.appendChild(c)});s.appendChild(g);return s}
function standCanvas2(S,w,h,ox){const cv=el('canvas','stand');cv.width=w;cv.height=h;const a={cv,ctx:cv.getContext('2d'),t:0,vis:false,pause:false,draw(){const B=new Buf(w,h),tt=Math.floor(this.t);knight(B,ox,h-4,S,{V:S.V},tt);B.outline();const F=new Buf(w,h);F.blit(B,true);this.ctx.clearRect(0,0,w,h);F.toCanvas(this.ctx)}};ANIM.push(a);a.draw();return cv}
function ladderSec(){const s=el('section','lad');s.id='ladder';
 s.appendChild(el('h2','','禍々しさの階段'));s.appendChild(el('p','lead','同じ土台（筒形の兜、前垂れ、「閉じた門」の紋章）に、段ごとに部品を足す。門の系統は一本の鎖が、赤の系統は「ないはずのもの」が、全員をつなぐ。'));s.appendChild(el('h4','','門の系統'));
 s.appendChild(ladder(['gate','dgate','lord','lord2'],['手首のかせと短い鎖','鎖が長く黒く床を引きずる　＋兜の目3つ ＋裾の触手','鎖が門までつながる　＋門の角 ＋鍵 ＋封印 ＋影の目 ＋溜まり　約4頭身','鎖がちぎれる　＋開いた胸 ＋一つ目 ＋背の触手 ＋腕の触手']));

 s.appendChild(el('h4','','赤の系統'));s.appendChild(ladder(['red','red2','fallen','fallen2'],['ぬしと同じ兜・封印・前垂れ　ただし角なし、ひびなし、鎖なし','−マント　ただ一つ「捨てる」段','＋片方の角 ＋割れた封印 ＋触手のマント ＋背と腕の触手','＋門のアーチ ＋核 ＋両方の角　鎧は殻だけ']));
 s.appendChild(el('p','note','<b>二つの世界線</b>：赤い騎士は、のまれなかった世界線の門のぬし。だから兜・封印・前垂れの形はぬしと同じで、違うのは「角・ひび・鎖があるかないか」だけ。赤い門のぬしで、ないはずのものが一つずつ生えてくる。'));
 s.appendChild(el('p','note','<b>鎖の一本線</b>：かせ → 長く黒い鎖 → 門までつながる鎖 → ちぎれた鎖。どの段にいても、鎖を見れば「門に仕える者」の系統だとわかる。<br><b>黒い門番 ＜ 門のぬし</b>：黒い門番は人の形のまま。くらやみの元は、ぬしの足元の溜まり。'));
 return s}
function orderSec(){const s=el('section','ord');s.id='order';s.appendChild(el('h2','','強さの順'));
 s.appendChild(el('p','lead','後に出る者ほど手ごわく。前の者を弱くするのではなく、後の者に技と読み方を足して並べた。数は攻撃の技だけ（立ち絵・演出は除く）。'));
 const rows=[['門番','gate','覚悟0のボス'],['くらやみの竜','dragon','覚悟1〜3'],['黒い門番','dgate','中ボス（覚悟3〜）'],['三つ首の竜','hydra','竜のあと（隠れボス）'],['門のぬし','lord','覚悟4'],['暗い門のぬし','lord2','第二形態'],['赤い騎士','red','ぬしの次'],['本気の赤い騎士','red2','第二形態'],['赤い門のぬし','fallen','いちばん奥'],['第二形態','fallen2','最後']];
 let h='<tr><th>だれ</th><th>技</th><th>連撃</th><th>最大</th><th>赤</th><th>紫の輪</th><th>光らない</th><th>押せば罰</th><th>打ち合い</th></tr>';
 for(const[n,k,w]of rows){const ids=MOVES_OF[k].filter(id=>KINDOF(id)==='atk');let mh=0,mu=0,r=0,f=0,d=0,pu=0,ra=0;for(const id of ids){const m=MV.find(x=>x.id===id),hc=(m.hits||[]).length,cs=m.cues||[];mh=Math.max(mh,hc);if(hc>1)mu++;if(cs.some(c=>c.col==='r')||m.hitCol==='r')r++;if(cs.some(c=>c.col==='p'))f++;if(hc&&!cs.length)d++;if(m.heroP||/zanshin|zanpunish|seefeint|counter/.test(id))pu++;if(cs.some(c=>c.col==='g'))ra++}
  h+=`<tr><td><b>${n}</b><br><small>${w}</small></td><td>${ids.length}</td><td>${mu}</td><td>${mh}</td><td>${r}</td><td>${f}</td><td>${d}</td><td>${pu}</td><td>${ra}</td></tr>`}
 const t=el('table','parts');t.innerHTML=h;s.appendChild(t);
 s.appendChild(el('p','note','<b>数だけでは決まらない</b>：本気の赤い騎士は、体の動きで読めない居合が中心で、光らない技と「溜め＋ふり」がある。赤い門のぬしは、赤い騎士の決まり（見抜く・返す・残心）とぬしの触手を両方持つ。第二形態は「光らない＋拍」「水面＋フェイント」「光らない＋水面」のように、読み方を二つ重ねた技がある。重ねるのは、それぞれ先に教わった読み方だけ。'));return s}
window.addEventListener('DOMContentLoaded',build);
