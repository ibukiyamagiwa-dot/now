/* ===== 専用ステージ（ゲームと同じ 240×135） ===== */
const SW=240,SH=135,SFL=106;
function rect(B,x,y,w,h,c,tag=6){for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)B.set(xx,yy,typeof c==='function'?c(xx,yy):c,tag)}
function dith(a,b,t,x,y){const m=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];return t*16>m[y&3][x&3]?b:a}
function bricks(B,x0,y0,w,h,c1,c2,c3){rect(B,x0,y0,w,h,c1);for(let y=y0;y<y0+h;y+=6){for(let x=x0;x<x0+w;x++)B.set(x,y,c2,6);const off=((y-y0)/6)%2?6:0;for(let x=x0+off;x<x0+w;x+=12)for(let yy=y;yy<y+6;yy++)B.set(x,yy,c2,6)}for(let y=y0+1;y<y0+h;y+=6)for(let x=x0;x<x0+w;x+=3)if((x*7+y)%5===0)B.set(x,y,c3,6)}
function torch(B,x,y,t){rect(B,x,y,2,6,'#3a2a24');const f=(t/5|0)%3;B.set(x,y-1,'#ffd040',6);B.set(x+1,y-2+(f===1?0:1),'#ff8030',6);B.set(x,y-3+f%2,'#ffb040',6);for(let r=4;r<12;r++)for(let a=0;a<20;a++){const xx=Math.round(x+Math.cos(a/20*6.28)*r),yy=Math.round(y-2+Math.sin(a/20*6.28)*r);if(B.tag(xx,yy)===6&&(xx+yy)%(r>8?4:3)===0)B.set(xx,yy,mix(B.get(xx,yy),'#ff9040',.18),6)}}
function stoneFloor(B,c1,c2,c3){for(let y=SFL;y<SH;y++)for(let x=0;x<SW;x++){B.set(x,y,y===SFL?c3:((x+(y>SFL+10?6:0))%24===0||y===SFL+10||y===SFL+20)?c2:c1,6)}}
const STG={};
/* 関所：門番の持ち場。上げ下げ式の格子戸＝通行止め。旗の紋章は前垂れと同じ「閉じた門」 */
STG.gate=(B,t)=>{bricks(B,0,0,SW,SFL,'#262a38','#1a1c28','#30354a');
 rect(B,150,18,74,88,'#15161e');for(let x=152;x<224;x+=7)rect(B,x,18,2,86,'#4a4a58');for(let y=24;y<104;y+=9)rect(B,150,y,74,2,'#3a3a48');for(let x=152;x<224;x+=7)B.set(x,104,'#8a8aa0',6);
 rect(B,146,12,82,6,'#3a3e50');rect(B,146,12,82,1,'#5a5e74');rect(B,144,12,4,94,'#30354a');rect(B,226,12,4,94,'#30354a');
 for(const bx of [40,100]){rect(B,bx,14,16,30,'#2a3a6a');rect(B,bx,14,16,2,'#c8a050');rect(B,bx+5,22,6,9,'#c8a050');B.set(bx+8,22,'#140a10',6);for(let y=22;y<31;y++)B.set(bx+8,y,'#140a10',6);for(let i=0;i<8;i++)B.set(bx+i*2,44+(i%2),'#2a3a6a',6)}
 torch(B,30,58,t);torch(B,128,58,t);stoneFloor(B,'#2a2c3a','#202230','#3e4256')};
/* 大門の間：背後の大門は鎖と封印で閉じている。門の下からくらやみが漏れて、床にしみ出す */
STG.lord=(B,t,open)=>{rect(B,0,0,SW,SH,(x,y)=>dith('#0e0a12','#16101c',y/SFL,x,y));
 for(let i=0;i<4;i++){const x=16+i*58;rect(B,x,0,10,SFL,'#1c1622');rect(B,x,0,1,SFL,'#2a2232')}
 const gx=128,gy=6,gw=104,gh=SFL-gy;
 for(let y=gy;y<gy+gh;y++)for(let x=gx;x<gx+gw;x++){const cx=gx+gw/2,dx=(x-cx)/(gw/2),top=gy+30-Math.sqrt(Math.max(0,1-dx*dx))*30;if(y>=top)B.set(x,y,'#241c2c',6)}
 const half=open?3:0;for(let y=gy;y<gy+gh;y++)for(let x=gx+4;x<gx+gw-4;x++){const cx=gx+gw/2,dx=(x-cx)/(gw/2-4),top=gy+34-Math.sqrt(Math.max(0,1-dx*dx))*30;if(y<top)continue;const gap=Math.abs(x-cx)<half+(open?(y%7):0);
   if(gap){B.set(x,y,((x+y+t/4|0)%5)?'#3a1a5a':'#c070ff',6);continue}
   const L=x<cx,c=((x-gx)%13===0||(y-gy)%16===0)?'#1a1420':L?'#3a3046':'#342a40';B.set(x,y,c,6)}
 for(let y=gy+40;y<SFL;y+=16)for(let x=gx+8;x<gx+gw-8;x+=13)B.set(x,y,'#6a4a14',6);
 /* 封印：金の札。開いた門では破れて紫 */
 for(let i=0;i<3;i++){const x=gx+gw/2-2,y=gy+42+i*16;rect(B,x-3,y,10,6,open?'#4a2a6a':'#b8902a');rect(B,x-3,y,10,1,open?'#c070ff':'#f0c850');B.set(x+1,y+3,open?'#ff3050':'#6a4a14',6)}
 /* 鎖：門と、ぬしの背中をつなぐ */
if(open)for(let i=0;i<3;i++){const y0=gy+48+i*14;for(let x=gx-4;x<gx+12;x+=2)B.set(x,y0+(x-gx)*.6,'#5e566e',6)}
 if(open){/* 門のすき間から、目がのぞく */for(let i=0;i<5;i++){const x=gx+gw/2-1,y=gy+46+i*11;if(((t/9|0)+i)%4)B.set(x,y,'#ff3050',6)}}
 stoneFloor(B,'#1a1220','#140e18','#2a1e30');
 /* 門の下から漏れるくらやみ */for(let x=gx-30;x<SW;x++){const h=Math.max(0,Math.round((1-Math.abs(x-(gx+gw/2))/90)*(open?6:3)+Math.sin(x*.4+t*.05)));for(let y=SFL;y<SFL+h;y++)B.set(x,y,y===SFL?INK.hi:INK.col,6)}};
/* 誓いの間：天窓から一本の光。床には挑んで敗れた者たちの剣が墓標のように刺さる。奥に赤い旗 */
STG.red=(B,t,rage)=>{rect(B,0,0,SW,SH,(x,y)=>dith('#160e12','#1e1418',y/SFL,x,y));
 for(let i=0;i<5;i++){const x=10+i*52;rect(B,x,0,14,SFL,'#241a1e');rect(B,x+1,0,1,SFL,'#34262a');rect(B,x-2,0,18,5,'#2a1e22')}
 /* 赤い旗：本気では落ちている */if(!rage){rect(B,178,8,24,56,'#7a1422');rect(B,178,8,24,2,'#a82a34');for(let i=0;i<24;i+=4)B.set(178+i,64,'#7a1422',6);rect(B,189,18,2,28,'#d8dce8');rect(B,185,22,10,2,'#d8dce8')}
 else{rect(B,170,SFL-4,36,4,'#5a0e1c');rect(B,170,SFL-4,36,1,'#8a2030')}
 /* 天窓の光：本気では細く、彼だけを照らす */const lx=176,lw=rage?12:34;for(let y=0;y<SFL+6;y++)for(let x=lx-lw/2-y*.12;x<lx+lw/2+y*.12;x++){const xx=Math.round(x);if((xx+y)%(rage?2:3)===0)B.set(xx,y,mix(B.get(xx,y)||'#1e1418','#ffe0c0',rage?.25:.16),6)}
 stoneFloor(B,'#2a1c1e','#20161a','#3a2a2c');
 /* 墓標の剣 */for(let i=0;i<9;i++){const x=14+i*24+(i%3)*5,y=SFL+2+(i%2)*6,a=(i%3-1)*.15;for(let j=0;j<12;j++)B.set(Math.round(x+Math.sin(a)*j),y-j,j<9?'#8a8a98':'#5a4a40',6);for(let j=-2;j<=2;j++)B.set(x+j+Math.round(Math.sin(a)*9),y-9,'#5a4a40',6)}};
/* 穴の底：沈んだ誓いの間。剣は水面の下で逆さに映り、旗は水に沈む。光は頭上の穴からだけ */
STG.hole=(B,t,deep)=>{rect(B,0,0,SW,SH,(x,y)=>dith('#06040a','#0c0a14',y/SFL,x,y));
 for(let i=0;i<5;i++){const x=10+i*52;for(let y=20;y<SFL;y++)if((y+i)%7)B.set(x+((y*3+i)%5===0?1:0),y,'#140e18',6);rect(B,x,20,14,2,'#1a1220')}
 /* 頭上の穴 */for(let y=0;y<10;y++)for(let x=150-y*2;x<202+y*2;x++)if((x+y)%2===0||y<3)B.set(x,y,y<3?'#2a2440':'#140e20',6);
 for(let y=10;y<SFL;y++)for(let x=158;x<196;x++)if((x+y*3)%7===0)B.set(x,y,'#2a2440',6);
 /* 黒い水 */for(let y=SFL;y<SH;y++)for(let x=0;x<SW;x++){const w=Math.sin(x*.21+y*.9+t*.06)>.85;B.set(x,y,y===SFL?(Math.sin(x*.3+t*.1)>.5?'#3a2a50':'#1a1428'):w?'#1a1428':'#08060e',6)}
 /* 逆さの剣（水に映る墓標）と、沈んだ旗 */for(let i=0;i<9;i++){const x=14+i*24+(i%3)*5;for(let j=2;j<12;j++)if((j+x)%2)B.set(x,SFL+j,'#3a3448',6)}
 for(let i=0;i<24;i++)for(let j=0;j<6;j++)if((i+j)%2)B.set(180+i,SFL+14+j+Math.round(Math.sin(i*.4+t*.04)),'#3a0a14',6);
 if(deep){/* 第二形態：水面の下に門のアーチが透ける */for(let a=0;a<=40;a++){const th=Math.PI*a/40,x=Math.round(176-Math.cos(th)*30),y=Math.round(SFL+4+Math.sin(th)*22);B.set(x,y,'#3a1a5a',6);B.set(x,y+1,'#22142e',6)}}};
const STAGES=[
 {id:'s_gate',n:'関所',st:'gate',who:[['gate',{}]],cap:'門番の持ち場。背後の格子戸は下りたまま。',why:'格子戸＝通行止め。旗の紋章は門番の前垂れと同じ「閉じた門」で、だれの家来かがわかる。'},
 {id:'s_lord',n:'大門の間',st:'lord',who:[['lord',{chainL:58}]],cap:'背後に巨大な大門。ぬしの背中の鎖が門の封印につながる。門の下からくらやみが漏れ、床に溜まる。',why:'「ぬしが門を守っている」ことを、背景で一目で伝える。鎖が門につながっているので、ぬしを倒す＝門が開く、とわかる。'},
 {id:'s_lord2',n:'大門の間（開きかけ）',st:'lord',open:1,who:[['lord2',{}]],cap:'鎖はちぎれ、封印は破れ、門のすき間から紫の光と目がのぞく。',why:'第二形態になると同時に背景も変わる。ぬしが崩れたせいで、門が内側から押し開かれはじめた。'},
 {id:'s_red',n:'誓いの間',st:'red',who:[['red',{}]],cap:'天窓からの一本の光。床には、挑んで敗れた者たちの剣が墓標のように並ぶ。奥に赤い旗。',why:'剣の墓標＝この騎士に挑んだ者の数。静かで、整っていて、飾りがない＝赤い騎士の人柄そのもの。'},
 {id:'s_red2',n:'誓いの間（本気）',st:'red',rage:1,who:[['red2',{}]],cap:'赤い旗は落ち、光は細くなって騎士だけを照らす。',why:'マントを斬った＝旗も落ちる。光が細くなるのは、世界が彼一人に集まるから。'},
 {id:'s_hole',n:'穴の底',st:'hole',who:[['fallen',{}]],cap:'沈んだ誓いの間。剣の墓標は水に逆さに映り、旗は水の底。光は頭上の穴から細く。',why:'赤い騎士の部屋が、くらやみに沈んだ姿。部屋の作りが同じなので「同じ人」だとわかる。'},
 {id:'s_hole2',n:'穴の底（第二形態）',st:'hole',deep:1,who:[['fallen2',{}]],refl:true,cap:'水面の下に門のアーチが透ける。水には、のまれる前の赤い騎士が映る。',why:'映り姿は、とどめの演出で本体と入れかわる。最後の一撃の意味を、戦う前から背景に置いておく。'},
];
function stageFrame(s,t){const B=new Buf(SW,SH);STG[s.st](B,t,s.open||s.rage||s.deep);
 const H=new Buf(SW,SH);knight(H,SW-62,SFL,SPEC.hero,{},t);B.blit(H,true);
 for(const[w,P]of s.who){const S=SPEC[w];knight(B,176,SFL,S,P,t);if(w==='lord')pool(B,joints(176,SFL,S,Object.assign({},PDEF,S.pose)),t,16)}
 B.outline();
 if(s.refl){const R=new Buf(SW,SH);knight(R,176,SFL,SPEC.red,{},t);for(let y=0;y<SH;y++)for(let x=0;x<SW;x++){const c=R.c[y*SW+x];if(!c)continue;const yy=SFL+2+Math.round((SFL-y)*.5),xx=x+Math.round(Math.sin(yy*.5+t*.12));if(yy>SFL+1&&yy<SH&&(xx+yy)%2===0)B.set(xx,yy,mix(c,'#0c0a14',.4),8)}}
 if(s.st==='hole')for(let x=0;x<SW;x++)if(B.tag(x,SFL)!==1)B.set(x,SFL,Math.sin(x*.3+t*.1)>.5?'#3a2a50':'#1a1428',6);
 return B}
