/* ===== 状態 ===== */
const S=4,LW=240,LH=135,HX=62,EX=176,FLOOR=106;
let G;
function baseG(){return{mode:'run',sel:1,hero:{hp:100,max:100,mk:0,pot:3},stats:{parry:0,just:0,guard:0,hit:0,early:0,chase:0,heavy:0,miss:0},mkFlash:0,stop:0,shk:0,fl:[],pts:[],txt:[],rings:[],marks:[],knock:0,vib:'e',stopMax:0,ko:null,cam:{x0:0,y0:0,z:4},anim:0,order:makeOrder(),soulRun:0}}
function newRun(k){if(k==null)k=REC.lastK!=null?REC.lastK:0;if(!kOpen(k))k=0;REC.lastK=k;saveRec();RM2=freshMods();G=baseG();G.K=k;G.order=makeOrder(k);G.runLen=G.order.length;G.Kmin=k;G.hero.pot=KAKU[k].pot;G.runT=0;G.ranks=[];startBattle(0,false)}
function startBattle(i,retry){
 G.bi=i;let key=G.order[i];{const K0=G.mode==='run'?G.K:G.mode==='prac'?PV+1:1,vv=EN[key].variants,vk=vv&&vv[tintOf(K0)];if(vk&&(G.mode!=='prac'||isSeen(vk)))key=vk}const d=EN[key],hp=Math.round(d.hp*(1+.06*i)*kEff().hp);
 if(retry&&G.snap){Object.assign(G.hero,G.snap);G.hero.hp=Math.max(G.hero.hp,Math.min(G.hero.max,P.retryHp))}else G.snap={hp:G.hero.hp,mk:G.hero.mk,pot:G.hero.pot};
 G.en=Object.assign({},d,{key,hpMax:hp,hp,brk:0,broken:0,hurt:0,guardUp:!!d.shield,rage:false,stance:false});G.fled=false;G.hero.psn=0;G.floorD=0;markSeen(key);
 {const e=G.en,K=G.mode==='run'?G.K:G.mode==='prac'?PV+1:1,sc=(1+.06*i)*kEff().hp;
  if(key==='hydra'){const hh=Math.round(hp/3);e.uhp=[hh,hh,hh];e.uhp0=hh;e.swarm=3;e.hpMax=e.hp=hh*3}
  if(key==='slime'){const U=K>=3?[1,1,1,2.4]:K===2?[1,1,1,1]:[1,1,1];e.uhp=U.map(u=>Math.round(18*u*sc));e.ubig=U.map(u=>u>1);e.swarm=U.length;e.hpMax=e.hp=e.uhp.reduce((a,b)=>a+b,0)}
  if(K>=2&&!d.gold&&!d.noTint){const tt=tintOf(K);e.tint=tt;e.col=tt==='r'?mixHex(d.col,'#d83a2a',.7):tt==='k'?mixHex(d.col,'#2a1838',.62):mixHex(d.col,'#4a1a7a',.6);e.name=(tt==='r'?'赤い':tt==='k'?'黒い':'紫の')+d.name;if(K>=3)e.eye=tt==='v'?'#ff6ad8':'#ff4040'}}
 G.state='cmd';G.t=0;G.bored=null;G.strikes=[];G.bs={parry:0,hurt:0,n:0,just:0,hits:0};G.streak=0;G.ko=null;G.rings=[];G.marks=[];G.knock=0;if(!usable(G.sel))G.sel=1;G.hpose=null;G.act=null;G.pts=[];G.txt=[];G.fl=[];G.stop=0;G.pings=[];G.ex=null;G.fxAt=null;G.rally=null;if(G.en.mid){G.en.demo=true;G.banner={s:'中ボス　'+G.en.name,t:0};flash(['#000000','#3a1a2a','#000000']);SFX.rage()}
 if(d.boss&&!d.cine&&!retry&&G.mode!=='tut'){G.state='bintro';G.t=0;G.binName=key==='hydra'&&G.mode==='run'?'？？？':d.name}
  if(RIG.enter(G.en)&&G.state==='cmd'&&!retry&&!G.pmv&&!G.rp&&G.mode!=='tut'){G.state='enter';G.t=0;G.enter={t:0,dx:0,f:'idle',cs:null,rig:RIG.enter(G.en)}}
  if((key==='lord'||key==='red'||key==='fallen')&&!retry&&!G.pmv){G.state='enter';G.t=0;G.enter={t:0,dx:key==='fallen'?0:120,f:'idle',cs:null,rise:key==='fallen'}}
 if(key==='hydra'&&G.mode==='run'){G.banner={s:'？？？',t:0};flash(['#000000','#1a3a22','#000000'])}
 msg(`${d.name}があらわれた！ ── ${d.hint}`);syncStats();
 if(!retry){const cs=[];if(d.vcard&&!TIPS['var_'+key]){TIPS['var_'+key]=1;cs.push([null,d.vcard])}if(key==='red'&&G.mode==='run')cs.push([null,'門のぬしは崩れ落ちた……　そのとき、門の奥から、赤い騎士が歩み出てきた']);if(key==='hydra'&&G.mode==='run')cs.push([null,'くらやみの竜を倒した……　だが、さらに奥から、首が三つある何かがせまってくる']);{const bk=key.replace(/M$/,''),mk=bk+'M',same=bk!==key||EN[mk]?[bk,mk]:[key];if(!same.some(k=>TIPS['en_'+k])){same.forEach(k=>TIPS['en_'+k]=1);hlMsg()}}
  if(has('brk')&&!TIPS.brkIntro){TIPS.brkIntro=1;cs.push(['brk','これは「ブレイク」　パリィを重ねると敵が崩れて、次の攻撃のダメージが上がります'])}
  if(cs.length){try{localStorage.setItem('parryRPG.tips',JSON.stringify(TIPS))}catch(e){}if(G.state==='enter')G.enter.cs=cs;else if(G.state==='bintro')G.binCs=cs;else showCards(cs)}}
}
function msg(s){$('msg').textContent=aW(s)}
function hlMsg(){const m=$('msg');m.classList.remove('hl');void m.offsetWidth;m.classList.add('hl');setTimeout(()=>m.classList.remove('hl'),2600)}
function syncStats(){const s=G.stats;$('stats').textContent=`パリィ ${s.parry}／ジャスト ${s.just}／ガード ${s.guard}／被弾 ${s.hit}／早押し ${s.early}／重い一撃 ${s.heavy}／追撃 ${s.chase}／追撃失敗 ${s.miss}`+(typeof RM2==='object'&&RM2&&Object.keys(RM2.taken).length?`\nこの周の強化：${UP.filter(u=>RM2.taken[u.id]).map(u=>u.name).join('・')}`:'')}

