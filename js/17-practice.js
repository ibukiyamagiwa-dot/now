/* ===== 技の練習：門番たちの技をひとつ選んで、それだけを繰り返し出させる（開発用の技指定をそのまま遊びに出したもの）
   [技, 名前, 説明, 第二形態の技なら1]　第二形態の技は、第二形態に出会うまで？？？ */
const PMOVES={
 lord:[['two','二連撃','剣の二連撃'],['swap','逆の二連撃','二連撃の順番が逆'],['thrust','突き','ときどき赤い光'],['feint','突きのフェイント','紫の輪は空振り　本物は次の突き'],['rally','打ち合い','金のひと振りを弾くと始まる'],
  ['whis','ささやき','第二形態　光が消える　音と構えで読む',1],['back','背中の触手','第二形態　目が開いた順に3本',1],['arm','腕の触手','第二形態　ときどき赤い光',1],['sa','剣と触手の三連','第二形態　二連撃のあと腕の触手',1],['reach','伸びる刃','第二形態　紫の輪は空振り　本物は赤い光',1],['maw','胸の口','第二形態　当たると門のぬしが回復する',1]],
 fallen:[['mix','剣と触手','目の触手のあいだに剣が割り込む'],['whis','ささやき','光が消える　音と構えで読む'],['back','背中の触手','目が開いた順に3本'],['arm','腕の触手','ときどき赤い光'],['sa','剣と触手の三連','二連撃のあと腕の触手'],['reach','伸びる刃','紫の輪は空振り　本物は赤い光'],['maw','胸の口','当たると回復される'],
  ['combo4','四連撃','最後の突きは赤い光'],['dfeint','二重のフェイント','紫の輪が2つ　本物は赤い突き'],['rally','打ち合い','金のひと振りを弾くと始まる'],['two','二連撃','剣の二連撃'],['swap','逆の二連撃','二連撃の順番が逆']],
 gateK:[['vlash','かぶとの触手','目が開いた順に3本'],['cape','マントの触手','低く薙ぐ　ときどき赤い光'],['yank','手元の触手','紫の輪は空振り　本物は次の斬り'],['two','二連撃','剣の二連撃']],
 red:[['tri','三段突き','続けて3回　最後は赤い光'],['delay','遅らせ突き','長く溜める　動きでなく光で押す'],['rally','打ち合い','金のひと振りを弾くと始まる'],['two','二連撃','剣の二連撃'],['swap','逆の二連撃','二連撃の順番が逆'],['thrust','突き','赤い光'],['feint','フェイント','紫の輪は空振り　本物は次'],['combo4','四連撃','最後の突きは赤い光'],['dfeint','二重のフェイント','紫の輪が2つ　本物は赤い突き']]};
let PMK=null,PMV=null;
function pmvOk(k,m){return!m[3]||isSeen('lordB')||isSeen('red')||isSeen('fallen')}
function pmvOf(){return G&&G.pmv&&(PMOVES[G.pkey]||[]).find(m=>m[0]===G.pmv)||null}
const pmvDot=m=>m[0]==='rally'?'#e8c46a':/フェイント|紫の輪/.test(m[1]+m[2])?'#b07ae8':/赤い光/.test(m[2])?'#ff5a5a':null;
const pmvIt=k=>m=>pmvOk(k,m)?{l:m[1],s:m[2].replace(/^第二形態　/,''),dot:pmvDot(m),h:m[2],a:()=>{PMV=m[0];closeMenu();startPractice(k)}}:{l:'？？？',s:'第二形態に出会うと練習できる',h:'第二形態に出会うと練習できる',lock:true,a:()=>tone(200,.05,'square',.04)};
function pmvItems(){const k=PMK,L=PMOVES[k]||[];return[
 {l:'ふつうに戦う',h:EN[k].hint,a:()=>{PMV=null;closeMenu();startPractice(k)}},
 ...(L.some(m=>m[3])?[{sep:'第一形態の技'},...L.filter(m=>!m[3]).map(pmvIt(k)),{sep:'第二形態の技'},...L.filter(m=>m[3]).map(pmvIt(k))]:[{sep:'技'},...L.map(pmvIt(k))]),
 {l:'もどる',h:'ひとつ前の画面へ',a:()=>menuBack()}]}
function startPractice(k){RM2=freshMods();G=baseG();G.mode='prac';G.pkey=k;const pm=PMV&&(PMOVES[k]||[]).find(m=>m[0]===PMV);G.pmv=pm?pm[0]:null;G.order=[k];G.hero.pot=3;startBattle(0,false);G.card=null;G.cards=[];
 if(pm&&pm[3]&&k==='lord'){const e=G.en;e.form='B';e.lit=true;e.p2=true;e.roared=true;e.rage=true;e.bFirst=1;e.name='暗い門のぬし'}
 msg(pm?`れんしゅう：${G.en.name}「${pm[1]}」だけを出してくる　${pm[2]}`:`れんしゅう：${G.en.name}　何度でも戦える（やられない）`)}
function practiceItems(){return[{l:'タイミングガイド',h:'攻撃が当たるまでのゲージを出す',v:()=>G&&G.mode==='run'&&kNow().noGuide?'出せない':G&&G.mode==='run'&&kNow().guide?'あり（みならい）':CFG.guide?'あり':'なし',adj:()=>{CFG.guide=!CFG.guide}},
 {l:'敵の強さ',h:'赤い：攻撃1.3倍・HP1.2倍　黒い：攻撃1.6倍・HP1.35倍　紫の：攻撃1.9倍・HP1.5倍'+(!pvOpen(3)?'　（紫のは覚悟3をクリアで選べる）':''),v:()=>['ふつう','赤い','黒い','紫の'][PV],adj:d=>{const st=d<0?3:1;let n=PV;for(let j=0;j<4;j++){n=(n+st)%4;if(pvOpen(n))break}PV=n}},
 ...PGROUPS.flatMap(([g,ks])=>{const ok=ks.filter(k=>PRAC.includes(k)&&isSeen(k)),ng=ks.filter(k=>PRAC.includes(k)&&!isSeen(k)).length;if(!ok.length&&!ng)return[];
  return[{sep:g},...ok.map(k=>({l:(PV&&!EN[k].gold&&!EN[k].noTint?PVN[PV]:'')+EN[k].name,h:EN[k].hint,a:()=>{if(PMOVES[k]){PMK=k;openPage('pmv')}else{PMV=null;closeMenu();startPractice(k)}}})),...(ng?[{l:`まだ出会っていない ${ng}体`,h:'本番で出会うと、ここで練習できる',lock:true,wide:true,a:()=>tone(200,.05,'square',.04)}]:[])]}),
 ...(REC.beatFallen?[{l:'打ち合い道場',h:'門のぬし・赤い騎士・赤い門のぬしの打ち合いだけを練習する',a:()=>openPage('rp1')}]:[]),
 {l:'もどる',h:'ひとつ前の画面へ',a:()=>menuBack()}]}
function kakuItems(){return[...KAKU.map((k,i)=>kOpen(i)?{l:`覚悟${i}　${k.n}`,h:k.d+((REC.k||{})[i]?`　（ベスト ${REC.k[i].rank}・${fmtT(REC.k[i].time)}）`:''),a:()=>{closeMenu();newRun(i)}}:{l:'？？？',h:`覚悟${i-1}でクリアすると選べる`,lock:true,a:()=>tone(200,.05,'square',.04)}),{l:'もどる',h:'ひとつ前の画面へ',a:()=>menuBack()}]}
function retryLim(){return G.K<=1?Infinity:G.K===2?3:0}
function loseItems(){const lim=retryLim(),left=lim-(G.retries||0),it=[];
 if(left>0)it.push({l:'もう一度',h:(lim===Infinity?'この戦闘の最初から':`この戦闘の最初から　残り${left}回`)+'　HPは最低'+P.retryHp+'まで戻る',a:()=>{G.retries=(G.retries||0)+1;startBattle(G.bi,true)}});
 else it.push({l:'この覚悟で最初から',h:`覚悟${G.K}「${kNow().n}」の1階からやり直す`,a:()=>newRun(G.K)});if(G.K>0)it.push({l:'覚悟を下げてもう一度',h:`覚悟${G.K-1}「${KAKU[G.K-1].n}」で続ける　記録は下げた覚悟で残る`,a:()=>{G.K--;G.Kmin=Math.min(G.Kmin,G.K);startBattle(G.bi,true);msg(`覚悟を${G.K}「${kNow().n}」に下げた`)}});it.push({l:'タイトルへ',h:'この周をやめる',a:()=>toTitle()});return it}
function clearItems(){const n=G.K+1,nx=n<KAKU.length&&kOpen(n)?[{l:`次の覚悟へ　${KAKU[n].n}`,h:KAKU[n].d,a:()=>newRun(n)}]:[];return[...nx,{l:'もう一度挑む',h:'同じ覚悟で次の周へ',a:()=>newRun(G.K)},{l:'タイトルへ',h:'最初の画面にもどる',a:()=>toTitle()}]}
let TIPS={};try{TIPS=JSON.parse(localStorage.getItem('parryRPG.tips')||'{}')}catch(e){}
function tip(s,dur,force){G.tipBox={s,t:dur||150}}
function tipOnce(k,s){if(G.mode!=='run'||TIPS[k])return;TIPS[k]=1;try{localStorage.setItem('parryRPG.tips',JSON.stringify(TIPS))}catch(e){}tip(s,170)}

