/* ===== 打ち合い道場（別ページ）：門のぬし・赤い騎士・赤い門のぬしの打ち合いだけを、種類を選んで繰り返す ===== */
const RP_PAGE=window.PAGE==='rally';
const RP_BOSS=[{id:'lordA',key:'lord',l:'門のぬし',h:'3合　押し合いは最後',n:3},{id:'lordB',key:'lord',B:1,l:'暗い門のぬし',h:'4合　2合目は腕の触手',n:4,arm:1,real:{vary:true,heavy:true}},
 {id:'red',key:'red',l:'赤い騎士',h:'4合',n:4,real:{vary:true,heavy:true,feint:[.35,.12,.03]}},{id:'red2',key:'red',rage:1,l:'赤い騎士（本気）',h:'5合　押し合いの位置が変わる',n:5,lockVar:1,real:{vary:true,heavy:true,feint:[.5,.22,.08]}},
 {id:'fallen',key:'fallen',l:'赤い門のぬし',h:'5合　腕の触手入り　押し合いの位置が変わる',n:5,arm:1,lockVar:1,real:{vary:true,heavy:true,feint:.6}}];
const RP_TYPE=[['real','本番どおり','間合い・重い一撃・フェイントが本番と同じようにまざる'],['even','等間隔','間合いがいつも同じ　まずはこれで拍をつかむ'],['tsume','詰め','弾いた直後に、もう次の光'],['tame','溜め','一拍待ってから次の光'],
 ['alt','詰めと溜めが交互','緩急に慣れる'],['heavy','重い一撃入り','途中に赤い光の突き　盾で受け止める'],['feint','フェイント入り','途中に紫の輪の空振り　押さずに待つ'],['lock','押し合いが早い','最後のひとつ前で押し合い、一拍遅れる']];
let RPB=null;
function rpItems(){return RP_BOSS.map(b=>({l:b.l,h:b.h,a:()=>{RPB=b;openPage('rp2')}})).concat(RP_PAGE?[]:[{l:'もどる',h:'ひとつ前の画面へ',a:()=>menuBack()}])}
function rp2Items(){return RP_TYPE.map(([id,l,h])=>({l,h,a:()=>{closeMenu();startRally(RPB,id)}})).concat([{l:'もどる',h:'ボスをえらびなおす',a:()=>menuBack()}])}
function startRally(b,type){RM2=freshMods();G=baseG();G.mode='prac';G.pkey=b.key;G.pmv='rally';G.rp={b,type,ok:0,ng:0,miss:0};G.order=[b.key];G.hero.pot=3;startBattle(0,false);G.card=null;G.cards=[];G.binCs=null;
 const e=G.en;e.hp=e.hpMax=99999;e.noStance=1;if(b.B){e.form='B';e.lit=true;e.p2=true;e.roared=true;e.rage=true;e.bFirst=1;e.name='暗い門のぬし'}if(b.rage){e.rage=true;e.p2=true;e.roared=true}
 G.state='cmd';G.t=20;msg(`打ち合い道場：${e.name}「${RP_TYPE.find(x=>x[0]===type)[1]}」　金のひと振りから始まる`)}
function rpMake(){const r=G.rp,b=r.b,t=r.type;let o={},dl=b.n;
 if(t==='real'){o=b.real||{vary:true};if(b.lockVar&&Math.random()<.5)dl=b.n-1}
 else if(t==='tsume')o={gapAll:'t'};else if(t==='tame')o={gapAll:'m'};else if(t==='alt')o={gapAlt:true};else if(t==='heavy')o={heavy:true};else if(t==='feint')o={feint:1};else if(t==='lock')dl=b.n-1;
 return rallyList(b.n,!!b.arm,dl,o)}
function rpLbl(){const r=G.rp;return`道場：${G.en.name}「${RP_TYPE.find(x=>x[0]===r.type)[1]}」`}
function rpScore(){const r=G.rp;msg(`弾ききった ${r.ok}　崩された ${r.ng}　始まらず ${r.miss}　── メニューで種類を変える`)}
