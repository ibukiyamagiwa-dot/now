/* ===== 専用ステージ（ゲームと同じ 240×135） ===== */
const SW=240,SH=135,SFL=106;
function rect(B,x,y,w,h,c,tag=6){for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)B.set(xx,yy,typeof c==='function'?c(xx,yy):c,tag)}
function dith(a,b,t,x,y){const m=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];return t*16>m[y&3][x&3]?b:a}
function bricks(B,x0,y0,w,h,c1,c2,c3){rect(B,x0,y0,w,h,c1);for(let y=y0;y<y0+h;y+=6){for(let x=x0;x<x0+w;x++)B.set(x,y,c2,6);const off=((y-y0)/6)%2?6:0;for(let x=x0+off;x<x0+w;x+=12)for(let yy=y;yy<y+6;yy++)B.set(x,yy,c2,6)}for(let y=y0+1;y<y0+h;y+=6)for(let x=x0;x<x0+w;x+=3)if((x*7+y)%5===0)B.set(x,y,c3,6)}
function torch(B,x,y,t){rect(B,x,y,2,6,'#3a2a24');const f=(t/5|0)%3;B.set(x,y-1,'#ffd040',6);B.set(x+1,y-2+(f===1?0:1),'#ff8030',6);B.set(x,y-3+f%2,'#ffb040',6);for(let r=4;r<12;r++)for(let a=0;a<20;a++){const xx=Math.round(x+Math.cos(a/20*6.28)*r),yy=Math.round(y-2+Math.sin(a/20*6.28)*r);if(B.tag(xx,yy)===6&&(xx+yy)%(r>8?4:3)===0)B.set(xx,yy,mix(B.get(xx,yy),'#ff9040',.18),6)}}
function stoneFloor(B,c1,c2,c3){for(let y=SFL;y<SH;y++)for(let x=0;x<SW;x++){B.set(x,y,y===SFL?c3:((x+(y>SFL+10?6:0))%24===0||y===SFL+10||y===SFL+20)?c2:c1,6)}}
const STG={};
/* 関所・大門の間・誓いの間・穴の底の描き方は stage2.js（ステージの章）にある */
const STAGES=[
 {id:'s_gate',n:'関所',st:'gate',k2:1,fixK:0,who:[['gate',{}]],cap:'門番の持ち場。背後の格子戸は下りたまま。',why:'格子戸＝通行止め。旗の紋章は門番の前垂れと同じ「閉じた門」で、だれの家来かがわかる。'},
 {id:'s_lord',n:'大門の間',st:'lord',k2:1,fixK:4,who:[['lord',{chainL:58}]],cap:'背後に巨大な大門。門前で遠くに見えた門を、真下から見る。大きすぎて下しか見えない。ぬしの背中の鎖が門の封印につながる。壁はまだ石のままで、くらやみは門の下からだけ漏れる。',why:'「ぬしが門を守っている」ことを、背景で一目で伝える。鎖が門につながっているので、ぬしを倒す＝門が開く、とわかる。'},
 {id:'s_lord2',n:'大門の間（開きかけ）',st:'lord',open:1,k2:1,fixK:4,who:[['lord2',{}]],cap:'鎖はちぎれ、封印は破れて黒ずみ、門のすき間からうすい紫の光。壁は一気にくらやみに覆われ、三つずつの目が開く（紫の段の迷宮と同じ）。',why:'第二形態になると同時に背景も変わる。ぬしが崩れたせいで、門が内側から押し開かれはじめた。'},
 {id:'s_red',n:'誓いの間',st:'red',k2:1,fixK:4,tint0:1,who:[['red',{}]],cap:'天窓からの一本の光。床には、くらやみに堕ちた者や門を開けようとした者たちの剣が、墓標のように並ぶ（彼が止めてきた者たち）。赤い旗は右の柱に（騎士の真うしろに置くと、赤どうしで溶けるので）。',why:'剣の墓標＝この騎士が門の前で止めてきた者の数。静かで、整っていて、飾りがない＝赤い騎士の人柄そのもの。'},
 {id:'s_red2',n:'誓いの間（本気）',st:'red',rage:1,k2:1,fixK:4,tint0:1,who:[['red2',{}]],cap:'赤い旗は落ち、光は細くなって騎士だけを照らす。',why:'マントを斬った＝旗も落ちる。光が細くなるのは、世界が彼一人に集まるから。'},
 {id:'s_hole',n:'穴の底',st:'hole',k2:1,fixK:4,who:[['fallen',{}]],cap:'沈んだ誓いの間。剣の墓標は水に逆さに映り、旗は水の底。光は頭上の穴から細く。',why:'赤い騎士の部屋が、くらやみに沈んだ姿。部屋の作りが同じなので「同じ人」だとわかる。'},
 {id:'s_hole2',n:'穴の底（第二形態）',st:'hole',deep:1,k2:1,fixK:4,who:[['fallen2',{}]],refl:true,cap:'水面の下に門のアーチが透ける。水には、のまれる前の赤い騎士が映る。',why:'映り姿は、とどめの演出で本体と入れかわる。最後の一撃の意味を、戦う前から背景に置いておく。'},
];
/* 絵の重ね方（stageFrameK）は stage2.js */

/* 赤い騎士を倒したあと：誓いの間の光が細くなり、騎士は構えたまま闇に溶け、部屋も暗くなる。最後は主人公も闇に沈み、真っ暗な部屋だけが残る */
const VST2={ua:2.35,fa:-1.25,sw:-1.57,ua2:2.15,fa2:-1.45,sheath:0,cr:1,lean:.02,hd:.08,eyeOff:1};
function redEnd(t){t=t%300;const cl=(a,b)=>Math.max(0,Math.min(1,(t-a)/(b-a)));
 const lw=12*(1-cl(20,150)),dk=cl(50,170),dd=cl(90,210),hr=cl(170,230);
 const B=new Buf(SW,SH);STG.red(B,t,4,{rage:1},lw);
 const K=new Buf(SW,SH);knight(K,176,SFL,SPEC.red2,VST2,0);K.outline();
 for(let i=0;i<K.c.length;i++){if(!K.c[i])continue;const x=i%SW,y=i/SW|0,n=((x*73+y*151)%97)/97;if(n<dk*.9)continue;B.set(x,y,mix(K.c[i],'#060406',Math.min(1,dk*1.15)),1)}
 const H=new Buf(SW,SH);knight(H,SW-62,SFL,SPEC.hero,{},t);H.outline();const HF=new Buf(SW,SH);HF.blit(H,true);
 /* 部屋ごと暗く */for(let i=0;i<B.c.length;i++){if(B.c[i])B.c[i]=mix(B.c[i],'#020102',Math.min(1,dd*1.05))}
 /* 主人公も最後は闇に沈む。真っ暗な部屋だけが残る */for(let i=0;i<HF.c.length;i++){if(!HF.c[i])continue;B.set(i%SW,i/SW|0,mix(HF.c[i],'#020102',Math.min(1,dd*1.05)),HF.t[i])}
 return B}
STAGES.push({id:'s_red_end',n:'誓いの間（赤い騎士のあと）',custom:redEnd,cap:'倒したあと、天窓の光がゆっくり細くなり、構えたままの赤い騎士が闇に溶けていく。部屋ごと暗くなり、最後は何も見えなくなる。',why:'勝ったのに、何も明るくならない。光も、騎士も、部屋も消える。この闇の先に「穴」が開く。'});
