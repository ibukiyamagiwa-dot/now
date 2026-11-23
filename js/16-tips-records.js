/* ===== 一言ヒント（初めての場面で一度だけ） ===== */
const KAKU=[
 {n:'みならい',atk:.7,hp:.9,pot:3,heal:20,guide:true,cap:'A',d:'敵の攻撃が弱く、パリィや追撃のゲージが出る　勝つとHPが20回復　ランクはAまで'},
 {n:'ふつう',atk:1,hp:1,pot:3,heal:0,guide:false,cap:'S',d:'基本の難しさ　勝ってもHPは回復しない'},
 {n:'つよき',atk:1.3,hp:1.2,pot:2,heal:0,guide:false,cap:'S',d:'敵の攻撃が1.3倍、HPが1.2倍　薬は2つから　やり直しは1周3回まで'},
 {n:'しにものぐるい',atk:1.6,hp:1.35,pot:1,heal:0,guide:false,noGuide:true,cap:'S',d:'敵の攻撃が1.6倍、HPが1.35倍　薬は1つから　ゲージなし　その場のやり直しはできない'},
 {n:'ならく',atk:1.9,hp:1.5,pot:1,heal:0,guide:false,noGuide:true,cap:'S',d:'敵の攻撃が1.9倍、HPが1.5倍　薬は1つから　ゲージなし　その場のやり直しはできない　いちばん奥で門のぬしが待つ'}];
const kNow=()=>KAKU[G&&G.K!=null?G.K:1];
let PV=0;const PVN=['','赤い','黒い','紫の'];
const tintOf=K=>K===2?'r':K===3?'k':K>=4?'v':null;
const kEff=()=>G&&G.mode==='run'?kNow():G&&G.mode==='prac'&&PV>0?KAKU[PV+1]:{hp:1,atk:1};
const pvOpen=v=>v===0||kOpen(v+1);
/* 覚悟は「ならく」以外、最初から選べる（チュートリアル後は覚悟0から始まる） */
const kOpen=k=>k<KAKU.length-1||!!((REC.k||{})[k-1]);
let REC={clears:0,bestRank:null,bestTime:null,bestChain:0};try{Object.assign(REC,JSON.parse(localStorage.getItem('parryRPG.rec')||'{}'))}catch(e){}
function saveRec(){try{localStorage.setItem('parryRPG.rec',JSON.stringify(REC))}catch(e){}}
const RANKC={S:'#fff3b0',A:'#7fe3ff',B:'#9dffc4',C:'#bba9b0'};
function capRank(r){const c=G&&G.mode==='run'?kNow().cap:'S';return'SABC'.indexOf(r)<'SABC'.indexOf(c)?c:r}
function battleRank(b){return capRank(battleRank0(b))}
function battleRank0(b){const n=Math.max(1,b.n||0),q=((b.parry||0)+.5*(b.just||0))/n;if(b.hurt===0&&q>=.6)return'S';if(b.hurt===0||q>=.5)return'A';if((b.hits||0)<=n/2)return'B';return'C'}
function runRank(rs){if(!rs.length)return'C';const v={S:3,A:2,B:1,C:0},a=rs.reduce((x,r)=>x+v[r],0)/rs.length;return a>=2.6?'S':a>=1.8?'A':a>=1?'B':'C'}
const fmtT=f=>{const sec=Math.round(f/60);return`${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`};
const betterRank=(a,b)=>!b||'SABC'.indexOf(a)<'SABC'.indexOf(b);
function topK(){let t=-1;for(const k in (REC.k||{}))t=Math.max(t,+k);return t}
function nextGoal(){const t=topK(),M=KAKU.length-1;if(t<0)return'次の目標：いちばん奥の門番をたおす';if(t<M)return`次の目標：覚悟${t+1}「${KAKU[t+1].n}」でクリア`;const r=REC.k[M].rank;if(r!=='S')return`次の目標：覚悟${M}でランク${'SABC'['SABC'.indexOf(r)-1]}`;return`次の目標：覚悟${M}の最短記録をちぢめる`}
const PGROUPS=[['ボス',['samuraiB','dragon','hydra','lord','red','fallen']],['中ボス',['boarM','shadeM','samuraiM','impM','dollM','ghostM','gateK']],['通常',['shroom','armor','bomb','boar','gslime','slime','bat','shade','samurai','imp','golem','beast','doll','ghost']]];
const PRAC=['lord','red','fallen','gateK','boarM','shadeM','samuraiM','impM','dollM','ghostM','samuraiB','slime','beast','shroom','imp','boar','bat','golem','armor','bomb','doll','gslime','samurai','shade','ghost','dragon','hydra'];
function markSeen(k){REC.seen=REC.seen||{};if(!REC.seen[k]){REC.seen[k]=1;saveRec()}}
const isSeen=k=>!!((REC.seen||{})[k]||TIPS['en_'+k]);
