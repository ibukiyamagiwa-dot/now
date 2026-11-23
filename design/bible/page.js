/* ===== 資料集ページ：見えているカードだけ動かす ===== */
let SPD=1,ANIM=[];const BGC={};
function bgData(kind,ctx){if(BGC[kind])return BGC[kind];bgFill(ctx,kind);return BGC[kind]=ctx.getImageData(0,0,CW,CH)}
function paint(ctx,B,bg){const im=new ImageData(new Uint8ClampedArray(bg.data),bg.width,bg.height);for(let i=0;i<B.c.length;i++){const c=B.c[i];if(!c)continue;const[r,g,b]=rgb(c);im.data[i*4]=r;im.data[i*4+1]=g;im.data[i*4+2]=b;im.data[i*4+3]=255}ctx.putImageData(im,0,0)}
function el(t,cls,html){const e=document.createElement(t);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}
function moveCard(M){const c=el('figure','card');const cv=el('canvas');cv.width=CW;cv.height=CH;c.appendChild(cv);
 const tag=EXMV[M.id]?`<span class="tag ex">いまの技：${EXMV[M.id]}</span>`:`<span class="tag nw">新しい案</span>`;
 const lights=(M.cues||[]).map(c=>c.col).filter((v,i,a)=>a.indexOf(v)===i).map(c=>`<i class="lt ${c}"></i>`).join('');
 const gap=(M.cues&&M.hits&&M.cues.length&&M.hits.length)?`<span class="gap">合図→当たり ${M.hits[0]-M.cues[0].t}F</span>`:'';
 const meta=el('figcaption','',`<div class="row"><b>${M.n}</b>${tag}</div><p class="read"><span class="k">読み方</span>${M.cap}</p><p class="why"><span class="k">意味</span>${M.why||''}</p><div class="row foot">${lights}${gap}<span class="fr"></span></div>`);
 c.appendChild(meta);const a={cv,ctx:cv.getContext('2d'),M,t:0,vis:false,pause:false,fr:meta.querySelector('.fr'),draw(){paint(this.ctx,frame(this.M,Math.floor(this.t)),bgData(this.M.bg||'def',this.ctx));this.fr.textContent=Math.floor(this.t)%this.M.len+'F'}};
 cv.onclick=()=>{a.pause=!a.pause;c.classList.toggle('paused',a.pause)};ANIM.push(a);a.draw();return c}
function stageCard(s){const c=el('figure','card stage');const cv=el('canvas');cv.width=SW;cv.height=SH;c.appendChild(cv);
 c.appendChild(el('figcaption','',`<div class="row"><b>ステージ：${s.n}</b><span class="tag nw">専用ステージ</span></div><p class="read"><span class="k">見えるもの</span>${s.cap}</p><p class="why"><span class="k">意味</span>${s.why}</p>`));
 const a={cv,ctx:cv.getContext('2d'),t:0,vis:false,pause:false,draw(){stageFrame(s,Math.floor(this.t)).toCanvas(this.ctx)}};cv.onclick=()=>{a.pause=!a.pause;c.classList.toggle('paused',a.pause)};ANIM.push(a);a.draw();return c}
/* 立ち絵：大きく、地面だけ */
function standCanvas(key,w,h,ox,sc){const cv=el('canvas','stand');cv.width=w;cv.height=h;const S=SPEC[key];const idle=MV.find(m=>m.f===key&&/idle/.test(m.id));
 const a={cv,ctx:cv.getContext('2d'),t:0,vis:false,pause:false,draw(){const B=new Buf(w,h),tt=Math.floor(this.t);const P=idle?poseAt0(idle,tt%idle.len,Object.assign({},PDEF,S.pose)):{};if(idle&&idle.pp)idle.pp(P,tt%idle.len);P.chainL=P.chainL||22;
   knight(B,ox,h-6,S,P,tt);if(key==='lord'||key==='lord2')pool(B,joints(ox,h-6,S,Object.assign({},PDEF,S.pose)),tt,key==='lord'?16:24);B.outline();const ctx=this.ctx;ctx.clearRect(0,0,w,h);B.toCanvas(ctx)}};ANIM.push(a);a.draw();return cv}
function ladder(keys,notes){const wrap=el('div','ladder');keys.forEach((k,i)=>{const col=el('div','step');const S=SPEC[k];col.appendChild(standCanvas(k,72,92,40));col.appendChild(el('div','lname',S.name));col.appendChild(el('div','ladd',notes[i]));wrap.appendChild(col);if(i<keys.length-1)wrap.appendChild(el('div','arrow','→'))});return wrap}
function build(){const root=document.getElementById('book');
 root.appendChild(ladderSec());
 FORMS.forEach((F,i)=>{const sec=el('section','form');sec.id=F.key;
  const head=el('div','fhead');head.appendChild(el('div','num',String(i+1).padStart(2,'0')));head.appendChild(el('div','',`<div class="en">${F.en}</div><h2>${F.ttl}</h2>`));sec.appendChild(head);
  const top=el('div','ftop');const art=el('div','art');art.appendChild(standCanvas(F.key,110,120,62));if(F.old)art.appendChild(el('div','old',`<img src="${OLDIMG[F.old]}" alt=""><span>いまのゲーム</span>`));top.appendChild(art);
  const txt=el('div','ftxt');txt.appendChild(el('p','lore',F.lore));
  const pl=el('div','pal');F.pal.forEach(p=>pl.appendChild(el('div','chip',`<i style="background:${p[0]}"></i><b>${p[1]}</b><span>${p[2]}</span>`)));txt.appendChild(pl);top.appendChild(txt);sec.appendChild(top);
  const tb=el('table','parts');tb.innerHTML='<tr><th>部品</th><th>意味</th></tr>'+F.parts.map(p=>`<tr><td>${p[0]}</td><td>${p[1]}</td></tr>`).join('');sec.appendChild(tb);
  sec.appendChild(el('h3','',`モーション <small>${MOVES_OF[F.key].length}</small>`));const g=el('div','grid');MOVES_OF[F.key].forEach(id=>g.appendChild(moveCard(MV.find(m=>m.id===id))));sec.appendChild(g);
  sec.appendChild(el('h3','','専用ステージ'));const sg=el('div','sgrid');F.stage.forEach(id=>sg.appendChild(stageCard(STAGES.find(s=>s.id===id))));sec.appendChild(sg);
  root.appendChild(sec)});
 const io=new IntersectionObserver(es=>es.forEach(e=>{const a=ANIM.find(a=>a.cv===e.target);if(a)a.vis=e.isIntersecting}),{rootMargin:'100px'});ANIM.forEach(a=>io.observe(a.cv));
 let last=0;const loop=ts=>{requestAnimationFrame(loop);if(ts-last<32)return;const dt=(ts-last)/16.67;last=ts;if(!SPD)return;for(const a of ANIM)if(a.vis&&!a.pause){a.t+=Math.min(4,dt)*SPD;a.draw()}};requestAnimationFrame(loop);
 document.querySelectorAll('#spd button').forEach(b=>b.onclick=()=>{SPD=+b.dataset.s;document.querySelectorAll('#spd button').forEach(x=>x.classList.toggle('on',x===b))});
 document.getElementById('nav').innerHTML=FORMS.map((F,i)=>`<a href="#${F.key}">${F.ttl}</a>`).join('')+'<a href="#impl">実装するなら</a>'}
function ladderSec(){const s=el('section','lad');s.id='ladder';
 s.appendChild(el('h2','','禍々しさの階段'));s.appendChild(el('p','lead','強さは「部品の数」で見せる。上の段ほど部品が増え、前の段の部品をかならず受けつぐ。だから並べると、だれがだれの先にいるかがわかる。'));
 s.appendChild(el('h4','','門の系統'));s.appendChild(ladder(['gate','dgate','lord','lord2'],['人・剣二本・紺の布','＋兜の目 ＋裾の触手　色が抜ける','＋門の角 ＋鎖 ＋鍵 ＋封印 ＋影の目 ＋溜まり　1.3倍','＋開いた胸 ＋一つ目 ＋背の触手 ＋腕の触手　鎖が切れる']));
 s.appendChild(el('h4','','赤の系統'));s.appendChild(ladder(['red','red2','fallen','fallen2'],['飾りは羽根一本だけ','−マント　ただ一つ「捨てる」段','＋片方の角 ＋触手のマント ＋腕の触手　赤が沈む','＋門のアーチ ＋核 ＋両方の角　鎧は殻だけ']));
 s.appendChild(el('p','note','<b>黒い門番 ＜ 門のぬし</b> の順を守るため、黒い門番は「人の形のまま」に止めた。くらやみの元はぬしの足元の溜まりで、黒い門番はそれに背中から染まっただけ。<br><b>本気の赤い騎士</b>だけは部品が減る。強さを「足す」ではなく「捨てる」で見せる唯一の段で、剣を極めた者らしさはここに出る。'));
 return s}
window.addEventListener('DOMContentLoaded',build);
