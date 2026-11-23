/* ===== チュートリアル：1段階に1つずつ、実戦の中で覚える ===== */
const TUT=[
 {key:'pro',title:'？？？',en:{base:'dragon',name:'くらやみの竜',hp:180,turn:()=>[{pre:46,m:.6,red:true}]},allow:[],loop:true,goal:'pro',
},
 {key:'attack',title:'たたかう',en:{base:'shroom',name:'ねむりキノコ',hp:10,sleep:true,col:'#d98a3a',poison:0},allow:[1],goal:'win',
  intro:[['enemyHp','敵のHPです　0にすれば勝ち'],['cmd1','「たたかう」で攻撃します']],
  ok:'たたかうは、これだけ　次は守りです'},
 {key:'guard',title:'まもる',en:{base:'golem',name:'練習ゴーレム',hp:999,atk:6,hard:false,turn:()=>[{pre:34}]},allow:[],loop:true,goal:'guard',need:2,watch:true,
  intro:[['enemy','まずは敵の攻撃を一度受けてみましょう　何もしなくて大丈夫です']],
  after:[['heroHp','攻撃を受けるとHPが減ります　0になると負けです'],['bar','下のゲージは、敵の攻撃が当たるまでの時間　白い印が右へ進みます'],['barGuard','印が青い帯に入ったら A　「ガード」でダメージが減ります']],
  ok:'ガードできました　次は、もう少し待ってみます'},
 {key:'parry',title:'パリィ',en:{base:'golem',name:'練習ゴーレム',hp:()=>Math.round(heroAtk()*P.counterMul),atk:6,hard:false,turn:()=>[{pre:34}]},allow:[],loop:true,goal:'win',
  intro:[['barParry','青い帯に入ってもすぐ押さず、右端の太い枠まで待ちます'],['barParry','太い枠で A を押すと「パリィ」　攻撃を弾いて、そのまま反撃します']],
  ok:'パリィ成功　弾いて反撃する、これがこのゲームの基本です'},
 {key:'just',title:'ジャスト回避',en:{base:'golem',name:'練習ゴーレム',hp:999,atk:6,hard:false,turn:()=>[{pre:34}]},allow:[],loop:true,cardsOnly:true,
  intro:[['barJust','太い枠の少し手前、点々の帯で A を押すと「ジャスト回避」'],['barJust','反撃はできませんが、ダメージを受けません　パリィが少し早かったときも、ここで助かります']]},
 {key:'chase',title:'追撃',en:{base:'beast',name:'ねむり盗賊',hp:999,sleep:true},allow:[1],goal:'chase',need:1,
  intro:[['cmd1','もう一度「たたかう」　今度は、攻撃中のゲージを見ます']],
  heroCards:[['cbar','攻撃中も、剣が当たるまでのゲージが出ます'],['cbarChase','印が黄色い帯に入ったら A　「追撃」でもう一回斬ります']],
  ok:'追撃できました　次は、もっとぎりぎりを狙います'},
 {key:'heavy',title:'重い一撃',en:{base:'beast',name:'ねむり盗賊',hp:999,sleep:true},allow:[1],goal:'heavy',need:1,
  heroCards:[['cbarHeavy','右端の太い枠で A を押すと「重い一撃」　追撃より大きなダメージです']],
  ok:'重い一撃が入りました'},
 {key:'heal',title:'かいふく',en:{base:'shroom',name:'ねむりキノコ',hp:999,sleep:true,col:'#d98a3a',poison:0},heroHp:40,allow:[3],goal:'heal',
  intro:[['heroHp','HPが減っています'],['cmd3','「かいふく」で薬を使うと、HPが40回復します'],['pot','薬の残りの数です　ランクSで勝つと1つ増えます（3つまで）']],
  ok:'回復できました　薬は数に限りがあります'},
 {key:'red',title:'赤い光',en:{base:'golem',name:'練習ゴーレム',hp:999,atk:6,hard:false,turn:()=>[{pre:34,red:true}]},allow:[],loop:true,goal:'parry',need:1,
  intro:[['enemy','赤く光る攻撃は重く、当たると大きなダメージです'],['barParry','でも右端の太い枠でパリィすれば「見切った！」　大きく反撃できます']],
  ok:'赤い光も、弾けば大きく返せます'},
 {key:'magic',title:'見切りとまほう',en:{base:'golem',name:'練習ゴーレム',hp:()=>Math.round(magDmg(1)),atk:6,hard:false,noCounter:true,turn:()=>[{pre:28}]},allow:[2],loop:'gauge',goal:'win',
  intro:[['gauge','これは「見切りゲージ」　パリィするたびに溜まります'],['enemy','この敵はパリィしても反撃しません　ゲージを溜めることに集中しましょう']],
  mid:[['gauge','1段溜まりました'],['cmd2','「まほう」でゲージを使って、魔法を撃てます'],['gauge','溜めるほど強い魔法になります　3段で最強の「ひかり」']],
  ok:'パリィで溜めて、まほうで撃つ　チュートリアルはここまでです'}
];
function barMode(){if(G.mode!=='tut')return'full';const k=TUT[G.tut.i].key;return k==='pro'?'none':k==='guard'?'guard':k==='parry'?'parry':k==='chase'?'chase':'full'}
let TDONE=false;try{TDONE=localStorage.getItem('parryRPG.tutDone')==='1'}catch(e){}
function floorLbl(){if(G.rp)return rpLbl();if(G.mode==='prac'){const pm=pmvOf();return'れんしゅう：'+G.en.name+(pm?'「'+pm[1]+'」':'')}return(G.bi>=runLen()?'？？？':G.bi>=runLen()-1?'いちばん奥':`地下${G.bi+1}階`)+`　覚悟${G.K}`}
const inBattle=()=>G.mode==='run'||G.mode==='prac';
function tutLbl(short){const i=G.tut.i,st=TUT[i];if(st.key==='pro')return'いちばん奥';return(short?'練習 ':'チュートリアル その')+`${i}／${TUT.length-1}：${st.title}`}
function proSlow(){if(G.mode!=='tut'||TUT[G.tut.i].key!=='pro'||G.state!=='enemy'||G.stop>0)return false;const s=G.strikes.find(s=>!s.done);return!!(s&&G.et>=s.cue-6&&!s.res)}
function prependCards(list){const pend=(G.card?[[G.card.at,G.card.s]]:[]).concat((G.cards||[]).map(c=>[c.at,c.s]));G.card=null;G.cards=[];showCards([...list,...pend])}
function startBlown(){const e=G.en;G.state='blown';G.t=0;G.strikes=[];G.blow=null;e.rage=true;e.col='#e0283c';e.lit=true;e.hurt=0;
 text(EX-10,FLOOR-64,'竜が怒った！','#ff7b86',true);SFX.rage();shake(P.shake*1.2);flash(['#5a0f18','#000000']);msg('くらやみの竜が怒った！')}
function blownStep(){const t=++G.t;
 if(t<34&&t%5===0)burst(EX-18,FLOOR-22,'#ff4a5a',5,.9,1);
 if(t===34){SFX.ko();noise(.6,.6,700);G.stop=10;shake(P.shake*2.4);flash(['#ffffff','#ff4a5a','#ffffff','#000000','#5a0f18']);
  for(let i=0;i<46;i++)G.pts.push({x:EX-34+Math.random()*12,y:FLOOR-34+Math.random()*28,vx:-3-Math.random()*4.5,vy:(Math.random()-.5)*1.6,t:0,life:28+Math.random()*24,col:i%3?'#ff7a3c':'#ffd27a',sz:2,drag:.97,g:0});
  G.blow={x:HX,y:0,vx:-2.4,vy:-3.4,r:0};text(HX,FLOOR-44,'ぐあっ！','#ff9a9a',true);SFX.hit()}
 if(G.blow){const b=G.blow;b.x+=b.vx;b.y+=b.vy;b.vy+=.13;b.r++}
 if(t>=132)endBlown()}
function endBlown(){startTut(1);G.fadeIn=40;G.banner={s:'ダンジョン入口',t:0};
 prependCards([[null,'くらやみの竜に吹き飛ばされ、ダンジョンの入口まで戻されてしまった'],[null,'もう一度、いちばん奥をめざそう　まずは基本から']])}
function setTutDone(){TDONE=true;try{localStorage.setItem('parryRPG.tutDone','1')}catch(e){}}
function startTut(i){
 if(TUT[i]&&TUT[i].key==='pro')markSeen('dragon');
 RM2=freshMods();G=baseG();G.mode='tut';G.tut={i,n:0,done:false,watch:!!TUT[i].watch};G.bi=0;
 const st=TUT[i],d=Object.assign({},EN[st.en.base],st.en),hp=typeof d.hp==='function'?d.hp():d.hp;
 G.en=Object.assign(d,{key:st.en.base,kind:EN[st.en.base].kind,hpMax:hp,hp,brk:0,broken:0,hurt:0,guardUp:false,rage:false});
 G.strikes=[];G.bs={parry:0,hurt:0};G.streak=0;G.t=0;G.sel=firstUsable();G.hpose=null;G.act=null;if(st.heroHp)G.hero.hp=st.heroHp;
 msg(tutLbl());if(st.cardsOnly)G.cardDone=()=>nextTut();showCards(st.intro);
 if(st.allow.length&&!st.loop){G.state='cmd'}else{G.state='cmd';G.t=-30;startEnemy()}
}
function tutAllow(n){return G.mode!=='tut'||TUT[G.tut.i].allow.includes(n)}
function firstUsable(){for(const n of [1,2,3])if(usable(n))return n;return 1}
function tutOn(ev){
 if(G.mode!=='tut')return;const st=TUT[G.tut.i],T=G.tut;
 if(T.watch){if(ev==='hit'){T.watch=false;T.after={t:45,cards:st.after}}return}
 if(st.key==='pro'){if(ev==='parry'||ev==='hit'){T.done=true;T.proHit=ev==='hit'}return}
 if(st.goal===ev||(st.goal==='guard'&&(ev==='parry'||ev==='just'))||(st.goal==='chase'&&ev==='heavy')){T.n++;if(T.n>=(st.need||1))T.done=true;else text(LW/2,52,`あと${(st.need||1)-T.n}回！`,'#fff3b0',true);return}
 const hint={guard:{hit:'ゲージが青い帯に入ったら A'},parry:{guard:'ガードになりました　太い枠まで待って',hit:'遅いです　太い枠のうちに A',early:'早いです　青い帯に入ってから'},
  chase:{miss:'ゲージが黄色い帯に入ったら A'},heavy:{ok:'追撃になりました　もう少しだけ右で',miss:'右端の太い枠で A'},magic:{hit:'太い枠でパリィ',guard:'ガードでは溜まりません　太い枠まで待って'},
  red:{guard:'ガードでは返せません　太い枠まで待って',hit:'遅いです　太い枠のうちに A',early:'早いです',just:'ジャスト回避です　もう少し待って太い枠で'}}[st.key];
 if(hint&&hint[ev])tip(hint[ev],90,true);
}
function tutClear(){const st=TUT[G.tut.i];if(st.key==='pro')return startBlown();G.state='tutok';G.t=0;if(st.key==='pro'){SFX.praise(2);text(LW/2,48,G.tut.proHit?'……！':'弾いた！','#fff3b0',true)}else{SFX.praise(4);confetti();text(LW/2,48,'できた！','#fff3b0',true)}msg((G.tut.proHit&&st.okHit?st.okHit:st.ok)+'　── A で次へ')}
function nextTut(){if(G.tut.i+1<TUT.length)startTut(G.tut.i+1);else{setTutDone();newRun();text(LW/2,48,'本番開始！','#fff3b0',true);msg('チュートリアル完了　いちばん奥のボスを倒せばクリアです');guideNote()}}
function guideNote(){const pend=(G.card?[[G.card.at,G.card.s]]:[]).concat((G.cards||[]).map(c=>[c.at,c.s]));G.card=null;G.cards=[];
 showCards([[null,'ここからは本番　地下1階から、いちばん奥をめざそう　覚悟「みならい」のいちばん奥では、門番が待っている'],[null,'最初の覚悟「みならい」では、本番でもゲージが出る'],['enemy','でも、ゲージばかり見ないでね　敵が光る瞬間と音を覚えておくと、上の覚悟で役に立つ'],...pend])}
function skipTut(){setTutDone();newRun();msg('チュートリアルを飛ばしました')}
function tutPrompt(){
 if(G.mode!=='tut')return'';const st=TUT[G.tut.i],a=G.act,sx=G.strikes&&G.strikes.find(s=>!s.done);
 if(G.state==='tutok')return st.key==='pro'?'':'できた！';
 if(G.state==='cmd'&&G.t>=0)return st.key==='magic'?'見切りが溜まった！ まほうを選んで A':st.key==='heal'?'かいふくを選んで A':'A で たたかう';
 if(G.state==='hero'&&a&&a.n===1){if(st.key==='chase'||st.key==='heavy')return st.key==='chase'?'ゲージが黄色い帯に入ったら A':'右端の太い枠で A';return''}
 if(G.state==='enemy'){
  if(st.key==='magic'&&G.hero.mk<100&&!(sx&&G.et>=sx.cue))return`太い枠でパリィして溜めよう（あと${Math.ceil((100-G.hero.mk)/P.mkParry)}回）`;
  if(st.key==='pro')return sx&&G.et>=sx.cue?'A で 弾け！':'……！';
  if(G.tut.watch||G.tut.after)return'見ていましょう……';
  if(st.cardsOnly)return'';
  if(st.key==='guard')return'ゲージが青い帯に入ったら A';
  return'右端の太い枠まで待って A'}
 return'';
}
function assistSlow(){
 if(G.mode!=='tut'||G.stop>0)return false;const st=TUT[G.tut.i];
 if(G.state==='enemy'){const s=G.strikes.find(s=>!s.done);return!!(s&&G.et>=s.cue&&!s.res)}
 if(G.state==='hero'&&G.act&&G.act.n===1&&(st.key==='chase'||st.key==='heavy'))return G.act.t>=G.act.C&&!G.act.chase;
 return false;
}
