/* ===== 敵データ（pre＝予兆までの溜め、m＝攻撃倍率） ===== */
const pick=a=>dbg.fix?a[0]:a[Math.random()*a.length|0];
const EN={
 golem:{name:'岩の巨人',hp:60,atk:16,kind:'golem',col:'#8f929e',hint:'ゴンのたびに胸の印が灯る　3つ灯った次の拍で拳を振り下ろす',hard:true,lungeF:5,lungeD:56,turn:()=>[{pre:32,m:1.4,cl:48,beat:true,bf:12,bn:3,mv:'smash',ft:36}]},
 beast:{name:'牙の盗賊',hp:56,atk:7,kind:'beast',col:'#c77a45',thief:true,daggers:3,hint:'弾いた短剣は投げ返せる　爪を弾き損ねると見切りを盗まれる',turn:()=>{const n=G.en.daggers||0;return n&&Math.random()<.55?Array.from({length:n},(_,i)=>({pre:i?4:14,m:.8,proj:true})):[{pre:pick([10,22]),m:1.2,melee:true}]}},
 shroom:{name:'毒キノコ',hp:48,atk:8,kind:'shroom',col:'#c0392b',hint:'毒は毎ターン強くなる　かいふくで消せる',poison:5,turn:()=>[{pre:18}]},
 armor:{name:'鉄の守り手',hp:66,atk:11,kind:'armor',col:'#6f8aa8',hint:'盾で剣を防ぐ　パリィで崩せる　まほうは盾を無視',shield:true,turn:()=>[{pre:20,m:1.2}]},
 bat:{name:'夜のコウモリ',hp:42,atk:8,kind:'bat',col:'#7a4fa0',air:true,magMul:()=>2,hint:'剣が届きにくい　まほうがよく効く',drain:true,fly:12,turn:()=>[{pre:10},{pre:6}]},
 shade:{name:'影の剣士',hp:80,atk:12,kind:'shade',col:'#7d6bc0',hint:'紫の輪はフェイント　白か赤が本物',magMul:lv=>lv>=3?1.5:.5,redP:.35,turn:()=>pick([[{fake:true,pre:14},{pre:14,m:1.2}],[{pre:pick([10,30]),m:1.2}],[{pre:pick([10,30]),m:1.2}]])},
 slime:{name:'スライムの群れ',hp:54,atk:5,kind:'slime',col:'#4fae6a',swarm:3,hint:'1匹ずつ順に飛びかかる　まほうは全体に当たる',turn:()=>aliveIdx().map((u,j)=>({pre:j?pick([2,10]):14,m:G.en.ubig&&G.en.ubig[u]?1.8:1}))},
 gslime:{name:'金色のスライム',hp:36,atk:4,kind:'slime',col:'#e8c040',gold:true,hard:true,flee:2,hint:'3ターンで逃げる　倒せば薬と見切り',turn:()=>[{pre:pick([8,18])}]},
 samurai:{name:'居合の剣士',hp:72,atk:11,kind:'samurai',col:'#5a6fb0',hint:'構え中に斬りかかると返される　まほうで崩せる',turn:()=>[{pre:pick([12,30]),m:1.1}]},
 bomb:{name:'ばくだん岩',hp:52,atk:10,kind:'bomb',col:'#8a7d74',fuse:3,hint:'導火線が尽きると爆発する　爆発に注意',turn:()=>G.en.fuse<=0?[{pre:36,m:3,red:true,boom:true}]:[{pre:pick([12,22]),m:.8}]},
 samuraiB:{variants:{k:'gateK',v:'gateK'},rim:true,noIai:true,name:'門番',hp:110,atk:11,kind:'lord',skin:'G',col:'#44568a',boss:true,noRage:true,lungeD:76,lungeF:5,shw:15,hint:'交差した2本の剣で、かならず二連撃',turn:()=>[{pre:pick([14,30]),mv:'cut',m:1},{pre:8,mv:'cut2',m:1}]},
 boarM:{name:'暴れ大イノシシ',hp:96,atk:12,kind:'boar',col:'#8a5a3a',lungeD:0,mid:true,sc:1.25,hint:'光ったら突進　遠いほど遅く着く　弾けば壁に激突',turn:()=>{const e=G.en,back=e.demo?0:pick([0,20,40]),C=boarC(e),v=(EX-C)/28,cl=Math.round((EX+back-C)/v);return[{pre:40,m:1.4,mv:'charge',back,cl,ft:46}]}},
 shadeM:{name:'うそつきの影',hp:110,atk:12,kind:'shade',col:'#7d6bc0',mid:true,sc:1.25,magMul:lv=>lv>=3?1.5:.5,hint:'紫はフェイント　本物が2回続くこともある',turn:()=>G.en.demo?[{fake:true,pre:18},{pre:16,m:1.2}]:pick([[{fake:true,pre:14},{pre:14,m:1.2},{pre:8,m:1}],[{pre:pick([10,30]),m:1.3}],[{fake:true,pre:14},{fake:true,pre:6},{pre:12,m:1.2}]])},
 samuraiM:{name:'居合のおかしら',hp:110,atk:12,kind:'samurai',col:'#4a5fa0',mid:true,sc:1.25,hint:'構え中に斬ると返し斬り　それを弾けば居合返し',turn:()=>[{pre:pick([12,30]),m:1.2}]},
 impM:{name:'小鬼のおかしら',hp:90,atk:10,kind:'imp',col:'#7a9a3a',mid:true,sc:1.25,hint:'ヒュ・ヒュ・ヒュの次の拍で岩　3つ続けて投げる',turn:()=>{const n=G.en.demo?1:3,B=13,R={m:.9,proj:true,lob:true,rhythm:true,mv:'lob',cl:B*4,beats:[B,B*2,B*3]};return Array.from({length:n},(_,i)=>Object.assign({},R,i?{gap:B}:{pre:24}))}},
 dollM:{name:'大からくり人形',hp:110,atk:11,kind:'doll',col:'#b08a5a',mid:true,sc:1.25,hint:'ランプが4つ灯った次の拍で斬る　2回続ける',turn:()=>{const e=G.en,w=Math.min(3,e.wind||0);e.wind=w+1;const I=[20,18,16,14][w],S={m:1.1,mv:'tick',beats:[I,I*2,I*3,I*4],cl:I*5};return e.demo?[Object.assign({pre:24},S)]:[Object.assign({pre:24},S),Object.assign({pre:20},S)]}},
 ghostM:{name:'鉄ぐつの大ゆうれい',hp:110,atk:12,kind:'ghost',col:'#5a6a8a',mid:true,sc:1.25,hint:'光らない　足音が止まった次の拍で現れ、その次で斬る',turn:()=>{const n=G.en.demo?2:pick([2,4]),B=18;return[{pre:36,m:1.3,dark:true,beat:true,mv:'step',bf:B,bn:n,cl:B*(n+2)}]}},
 lord:{name:'門のぬし',rim:true,hp:170,atk:16,kind:'lord',col:'#44568a',boss:true,cine:true,noTint:true,iai:true,noRage:true,noCounterBrk:true,phases:2,lungeD:76,lungeF:5,shw:15,hint:'金に光るひと振りを弾くと打ち合い　弾ききれば打ち返し',turn:()=>lordTurn()},
 red:{name:'赤い騎士',rim:true,hp:200,atk:17,kind:'lord',skin:'R',col:'#b0242e',boss:true,noTint:true,iai:true,noRage:true,phases:2,cine:true,noCounterBrk:true,lungeD:76,lungeF:5,shw:15,hint:'金のひと振りから打ち合いが始まる',turn:()=>lordTurn()},
 fallen:{name:'赤い門のぬし',rim:true,hp:250,phases:2,atk:19,kind:'lord',skin:'F',form:'B',col:'#8a1a24',boss:true,cine:true,noTint:true,iai:true,noRage:true,noCounterBrk:true,lungeD:76,lungeF:5,shw:15,hint:'金のひと振りから打ち合いが始まる',turn:()=>lordTurn()},
 gateK:{name:'黒い門番',rim:true,skin:'K',lungeD:76,lungeF:5,shw:15,variantOf:'samuraiB',vcard:'門番の黒い姿　ほかの敵の色ちがいとはちがい、姿も技も強さもまるで別物　くらやみに飲まれかけている',hp:140,atk:15,kind:'knight',col:'#2a2838',mid:true,noTint:true,noIai:true,noCounterBrk:true,hint:'くらやみに飲まれた門番　触手は目を開いた順に来る',turn:()=>gateKTurn()},
 boar:{name:'突進イノシシ',hp:52,atk:11,kind:'boar',col:'#8a5a3a',lungeD:0,hint:'光ったら突進　遠いほど遅く着く　弾けば壁に激突',turn:()=>{const back=pick([0,0,40,40,20]),C=boarC(G.en),v=(EX-C)/28,cl=Math.round((EX+back-C)/v);return[{pre:36,m:1.3,mv:'charge',back,cl,ft:46}]}},
 imp:{name:'石なげ小鬼',hp:46,atk:9,kind:'imp',col:'#7a9a3a',hint:'ヒュ・ヒュ・ヒュの次の拍で岩が落ちる　弾いた岩は投げ返せる',turn:()=>{const n=2,B=13,R={m:.9,proj:true,lob:true,rhythm:true,mv:'lob',cl:B*4,beats:[B,B*2,B*3]};return Array.from({length:n},(_,i)=>Object.assign({},R,i?{gap:B}:{pre:24}))}},
 ghost:{name:'足音のゆうれい',hp:50,atk:11,kind:'ghost',col:'#5a6a8a',hint:'光らない　足音が止まった次の拍で現れ、その次で斬る',turn:()=>{const n=pick([2,4]),B=18;return[{pre:36,m:1.2,dark:true,beat:true,mv:'step',bf:B,bn:n,cl:B*(n+2)}]}},
 doll:{name:'からくり人形',hp:58,atk:10,kind:'doll',col:'#b08a5a',hint:'キリッのあと、ランプが4つ灯った次の拍で斬る',turn:()=>{const e=G.en,w=Math.min(3,e.wind||0);e.wind=w+1;const I=[20,18,16,14][w];return[{pre:24,m:1.1,mv:'tick',beats:[I,I*2,I*3,I*4],cl:I*5}]}},
 hydra:{name:'三つ首の竜',hp:230,atk:11,kind:'hydra',col:'#4f7a5a',boss:true,hard:false,lungeD:46,hint:'最初の音の数が攻撃の数　光った首の順に噛みつく',turn:()=>hydraTurn()},
 dragon:{name:'くらやみの竜',hp:180,atk:12,kind:'dragon',col:'#b8323f',boss:true,lungeD:46,hint:'怒ると赤い炎　重いが、弾けば大きく反撃',
  turn:()=>{const SL=[{pre:24,m:1.8,mv:'slam',beat:true,bf:10,bn:3,cl:38,bo:-2}],ST=[{pre:22,m:.8,mv:'stab'},{pre:2,m:.8,mv:'stab'},{pre:8,m:.8,mv:'stab'}],TL=[{pre:20,m:1.4,mv:'tail',beat:true,bf:9,bn:3,cl:36}];
   const base=pick([SL,ST,TL]);
   if(!G.en.rage)return base;return pick([base.map(x=>Object.assign({},x,{pre:Math.round(x.pre*.6)})),[{pre:26,m:2,red:true,mv:'breath',beat:true,bf:9,bn:3,cl:36},{pre:6,m:.8,mv:'stab'}],[{pre:20,m:1.4,mv:'tail',beat:true,bf:9,bn:3,cl:36},{pre:4,m:.8,mv:'stab'}]])}}
};
const RUN_LEN=6;const BOARC=90;const runLen=()=>G&&G.runLen||RUN_LEN;
function boarC(e){return HX+12+Math.round(((NSPR.boar0?NSPR.boar0.r[0].length:32)*((e&&e.sc)||1))/2)}
function hydraTurn(){const e=G.en,A=aliveIdx().filter(i=>e.uhp[i]>0),r=e.rage,B=r?17:20,cut=3-A.length;
 const opts=[];if(A.length>=1)opts.push('one');if(A.length>=2)opts.push('two');if(A.length>=3)opts.push('three');if(cut>=1)opts.push('spit','spit');if(cut>=2)opts.push('pool','pool');
 const mv=pick(opts);
 if(mv==='spit'){const b=13,S={m:1,proj:true,lob:true,rhythm:true,mv:'lob',spit:true,cl:b*4,beats:[b,b*2,b*3]};return r||cut>=2?[Object.assign({pre:26},S),Object.assign({gap:b},S)]:[Object.assign({pre:26},S)]}
 if(mv==='pool'){const B2=18,N=2;return[{pre:36,m:1.8,mv:'pool',beat:true,dark:true,bf:B2,bn:N,cl:B2*(N+2),red:r}]}
 if(mv==='one')return[{ping:true,pre:28,heads:A},{pre:B,cl:28,m:1.7,heads:A,mv:'bite',red:r}];
 const ord=shuffle(A).slice(0,mv==='two'?2:3);const L=ord.map((h,i)=>({ping:true,pre:i?B:28,heads:[h],note:h}));
 ord.forEach((h,i)=>L.push(Object.assign({m:1,heads:[h],note:h,mv:'bite',rhythm:true},i?{gap:B,cl:B,red:r&&i===ord.length-1&&Math.random()<.5}:{pre:B,cl:28})));return L}
