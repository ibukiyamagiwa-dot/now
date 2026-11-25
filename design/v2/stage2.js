/* ===== ステージの章（第2版）：覚悟ごとに切りかわる背景 =====
   覚悟で変えるのは「光」と「のまれ方」で、場所の作り（石・床・たいまつの位置）は変えない。同じ迷宮が、段ごとにくらやみにのまれていく。
   ゲームと同じ 240×135、床は y=106、主人公は x=62、敵は x=176。
   背景の約束（くわしくは design/stages.md）：
   1 合図 ＞ 敵 ＞ 床のふち ＞ 背景。背景は、画面の真ん中（敵と主人公のあいだ）ほど静かにし、描きこみは左右の端と上に寄せる。
   2 敵のうしろに「奥への通路」を置き、その光（逆光）の強さを段ごとに、その段の敵がいちばん立つ明るさにする。
   3 背景に合図の4色（白・赤・金・紫）を明るく使わない。動きはあってよいが、光る・輪になる・急に明るくなる動きはしない（予兆とまちがえるから）。
   4 段の印は、敵と同じ言葉で描く（赤い段のひびは敵の「筋」、黒い段のしみは敵の「泥」、紫の段の目は敵の「目」）。 */
let KSTG=1;/* 下の帯の覚悟（0〜4）。ステージのカードはこれで切りかわる */
const hsh2=(x,y)=>{const s=Math.sin(x*127.1+y*311.7)*43758.5453;return s-Math.floor(s)};
function vn(x,y,sc,seed){seed=seed||0;const X=x/sc,Y=y/sc,x0=Math.floor(X),y0=Math.floor(Y),fx=X-x0,fy=Y-y0,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy),h=(a,b)=>hsh2(a+seed*17,b-seed*13);return lerp(lerp(h(x0,y0),h(x0+1,y0),u),lerp(h(x0,y0+1),h(x0+1,y0+1),u),v)}
function lstar(h){if(!h)return 0;const f=v=>{v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)},[r,g,b]=rgb(h),Y=.2126*f(r)+.7152*f(g)+.0722*f(b);return Y>.008856?116*Math.cbrt(Y)-16:903.3*Y}
const EXS=176,HXS=62;
/* 段ごとの光。wall＝[目地, 面, 上の明るい縁]、far＝天井ぎわ、floor＝[手前, 奥, 線]、glow＝奥の通路の光（逆光）[芯, ふち]、gk＝逆光の強さ、torch＝たいまつ */
const LT=[
 {n:'みならい',st:'上の階',wall:['#171012','#2c2224','#3a2e2c'],far:'#120c0e',floor:['#120c0c','#22191a','#3c2e2a'],glow:['#6e523e','#3a2c24'],gk:.85,torch:{on:1,c:['#a85a2a','#c8703a'],pool:'#ff9a48',pk:.2},
  cap:'まだ地上に近い階。高い格子窓から、白い外の光がひとすじ落ちる。石のすきまに苔、天井から根。',why:'はじめて潜る人のための、いちばん明るく、いちばん静かな段。外の光が届くのはここだけ。あとの段で、この光が二度と来ないことが効いてくる。'},
 {n:'ふつう',st:'迷宮の階',wall:['#120910','#26141e','#321c28'],far:'#0e070c',floor:['#10070c','#1e0f17','#3a2230'],glow:['#6c4650','#34202a'],gk:.85,torch:{on:1,c:['#a85a2a','#c8703a'],pool:'#ff9040',pk:.2},
  cap:'いまのゲームの背景（赤黒い石、左右のたいまつ）を、そのまま正本にした段。奥の通路から、遠くのたいまつの光がにじむ。',why:'基準の段。ほかの段はここから「光だけ」を変える。場所が同じなので、段が上がるたびに「同じ迷宮が、のまれていく」と分かる。'},
 {n:'つよき',st:'赤い階',wall:['#140708','#2a1214','#38191a'],far:'#100506','floor':['#110606','#1f0c0c','#46201c'],glow:['#7a3e2e','#3a1a14'],gk:.9,torch:{on:1,c:['#8a3020','#b8482a'],pool:'#ff5030',pk:.22},rust:1,
  cap:'たいまつの火が赤くなり、奥の通路から石へ、赤い筋（ひび）がのびてくる。床には赤黒いしみ。',why:'赤い段の敵に走る「筋」と同じものが、壁にも走る。浸食は奥（下の階）から来るので、ひびは通路から外へ広がる。'},
 {n:'しにものぐるい',st:'黒い階',wall:['#0e0e12','#222226','#2c2c30'],far:'#0a0a0c',floor:['#0a0a0c','#18181b','#3a3a40'],glow:['#5a5862','#2e2d33'],gk:.85,torch:{on:0},ink:1,
  cap:'たいまつは消え、すすだけが残る。色が抜けて灰色になった石に、天井と目地から黒いしみが垂れる。奥の通路だけが、色のない灰の光でうすく明るい。',why:'黒い段の敵は黒い。だから、この段だけ逆光をいちばん強くして、敵を「赤い目の影」として立たせる。くらやみは光を奪うのではなく、色を奪う。'},
 {n:'ならく',st:'紫の階',wall:['#0c0812','#1e1828','#2a2236'],far:'#08050c','floor':['#08050c','#140e1c','#2e2240'],glow:['#5a4678','#281c3a'],gk:.95,torch:{on:0,gone:1},ink:2,eyes:1,crack:1,
  cap:'壁はほとんどくらやみに覆われ、ところどころに三つずつ目が開いている。目はばらばらにまばたき、こちらは見ない。光は床のひびの下から、紫にうすく上がってくる。',why:'紫の段の敵は紫に明るいので、ここでは逆光を弱め、背景を暗く沈めて、明るさの差で立たせる。光が上からでなく下から来る＝穴に近い。目は「のまれたものほど目が増える」。'}];
/* 描きこみの重み：画面の真ん中（主人公と敵のあいだ、x 80〜215）は静かに、端ほど描く（2023-11-17「監修あれこれ」三島道場：左右の遠景に情報量を割く） */
const edgeW=x=>{const d=Math.min(Math.abs(x-20),Math.abs(x-226));return Math.max(0,Math.min(1,1.15-d/52))};
/* 奥の通路：敵のうしろの大きなアーチ。中は遠くの光。端がかたい線にならないよう、ふちは石の色に溶かす */
const ARCH={x0:126,x1:236,top:20,spring:46};
function archIn(x,y){const{x0,x1,top,spring}=ARCH,cx=(x0+x1)/2,hw=(x1-x0)/2;if(x<x0||x>x1||y>=SFL)return-1;const dx=(x-cx)/hw;if(y<spring){const yt=spring-(spring-top)*Math.sqrt(Math.max(0,1-dx*dx));if(y<yt)return-1;return Math.min(1-Math.abs(dx),(y-yt)/12)}return 1-Math.abs(dx)}
function glowAt(L,x,y){/* 通路の光：床ぎわの中央がいちばん明るく、上へ・左右へ弱まる */const cx=(ARCH.x0+ARCH.x1)/2,u=1-Math.min(1,Math.abs(x-cx)/((ARCH.x1-ARCH.x0)/2)),v=Math.max(0,1-(SFL-y)/(SFL-ARCH.top));return Math.max(0,Math.min(1,(u*.75+.25)*(v*.8+.2)))*L.gk}
function stoneWall(B,L,t,K){const[jt,fc,hi]=L.wall;
 for(let y=0;y<SFL;y++)for(let x=0;x<SW;x++){
  const row=Math.floor((y-4)/8),ry=((y-4)%8+8)%8,off=(row&1)?8:0,bx=((x+off)%16+16)%16,id=row*31+Math.floor((x+off)/16);
  const jn=ry===0||bx===0,ew=edgeW(x),vary=hsh2(id,7);
  let c=jn?jt:ry===1&&!jn?mix(fc,hi,.4+ew*.6):fc;
  if(!jn&&vary<.25)c=mix(c,jt,.18+ .12*ew);/* 石ごとの色のずれ（端ほどはっきり） */
  if(!jn&&ew<.3)c=mix(c,fc,.5);/* 真ん中は目地の差を弱める */
  /* 天井ぎわと床ぎわは暗く（光が届かない） */const top=Math.max(0,1-y/34),low=Math.max(0,(y-(SFL-10))/10);c=dith(c,L.far,Math.min(.85,top*.9+low*.45),x,y);
  B.set(x,y,c,6)}}
/* 奥への通路：ゲームの床の線と同じ消失点（x 120、y ≈ 97。床の線はすべてここへ集まる）で奥行きを見せる。
   アーチをくり返さず、①壁の厚み（右の側面と、アーチの裏）②向こうの部屋の壁（石が半分の大きさ＝遠い）と床、の2つだけで見せる。
   向こうの壁は光を受けて明るく、石の目地は弱い（空気遠近）。色は平らな段で塗り、ディザでぼかさない */
const VP={x:SW/2,y:SFL-10/1.1},THK=.86,FAR=.5;
function archDraw(B,L,t,K){const{x0,x1}=ARCH,inA=(x,y,k)=>archIn(VP.x+(x-VP.x)/k,VP.y+(y-VP.y)/k)>=0;
 const yF=Math.round(VP.y+(SFL-VP.y)*FAR);/* 向こうの部屋の床の高さ */
 const fw=[.5,.66,.8].map(v=>Math.min(1,v*L.gk*1.15)),wallF=i=>mix(L.wall[1],L.glow[0],fw[i]);
 for(let y=0;y<SFL;y++)for(let x=x0;x<=x1;x++){const a=archIn(x,y);
  if(a<0){/* 入口の縁石：1段だけ明るい石 */const b=archIn(x,y+2),sd=archIn(x+2,y),s2=archIn(x-2,y);if(b>=0||sd>=0||s2>=0){if((x+y)%2===0)B.set(x,y,mix(L.wall[1],L.wall[2],.6),6)}continue}
  if(!inA(x,y,THK)){/* 壁の厚み：右の側面は向こうの光を受け（奥ほど明るい）、アーチの裏は暗い。側面の目地は消失点へすぼまる */
   const sx=(x-VP.x)/(ARCH.x1-VP.x),side=sx<1&&sx>THK-.01&&VP.y+(y-VP.y)/sx>ARCH.spring;let c;
   if(side){const dk=(1-sx)/(1-THK);c=mix(L.wall[1],L.glow[0],(.18+.32*dk)*L.gk);const y0=VP.y+(y-VP.y)/sx;if(((y0-4)%8+8)%8<1.2/sx)c=mix(c,L.wall[0],.4);if(Math.abs(sx-THK)<.012)c=mix(c,L.glow[0],.25)}
   else{const lip=inA(x,y+1,THK);c=lip?mix(L.wall[1],L.glow[0],.3*L.gk):mix(L.wall[0],L.wall[1],.45)}
   B.set(x,y,c,6);continue}
  /* 向こうの部屋 */let c;
  if(y>=yF){/* 床：光を受ける。線は消失点へ */const k=(y-yF)/(SFL-yF);c=mix(mix(L.floor[1],L.glow[0],.55*L.gk),L.floor[1],k*.5);
   const fx=(x-VP.x)/((y-VP.y)/(SFL-VP.y));if(((fx%16)+16)%16<1.2||y===yF)c=mix(c,L.wall[0],y===yF?.45:.22)}
  else{/* 壁：石は半分の大きさ（4段・8幅）。下ほど光が強い（3つの平らな段、境目は石の目地） */const row=Math.floor((yF-1-y)/4),ry=((yF-1-y)%4+4)%4,off=(row&1)?4:0,bx=((x+off)%8+8)%8;
   const band=row<3?2:row<7?1:0;c=wallF(band);if(!L.flatFar&&(ry===3||bx===0))c=mix(c,L.wall[0],.16+.06*(2-band))}
  B.set(x,y,c,6)}
 /* 向こうの部屋のたいまつ：小さく、にごった火（遠い）。光のたまりは描かない */if(L.torch&&L.torch.on){const tx=224,ty=yF-26;for(let i=0;i<4;i++)B.set(tx,ty+i,mix(L.wall[0],L.glow[0],.3),6);B.set(tx,ty-1,mix(L.torch.c[0],L.glow[0],.4),6);B.set(tx,ty-2,mix(L.torch.c[1],L.glow[0],.4),6)}}
function torchK(B,L,x,y,t){const T=L.torch;
 if(T.gone){/* 紫の段：たいまつ受けごと、くらやみに埋まっている */for(let i=0;i<9;i++)B.set(x,y+i,i%3?'#0e0a16':'#1a1226',6);return}
 /* 受け金 */for(let i=0;i<8;i++){B.set(x,y+i,'#120910',6);B.set(x+1,y+i,i<2?'#5a3a2a':'#3a2620',6)}B.set(x-1,y+1,'#3a2620',6);B.set(x+2,y+1,'#3a2620',6);
 if(!T.on){/* 消えたたいまつ：すすの跡が上へ */for(let j=1;j<16;j++)for(let i=-2;i<=2;i++)if(hsh2(x+i,y-j)<.55-j*.03-Math.abs(i)*.1)B.set(x+i,y-j,mix(B.get(x+i,y-j)||L.wall[1],'#050506',.55),6);return}
 const f=(t>>3)%3,fh=[5,6,4][f],R=40;/* 炎は形だけゆらぐ。明るさとたまりの大きさは変えない（光る動きにしない） *//* 光のたまり：規則的なディザで、なめらかに。輪や点の群れにしない */
 for(let yy=Math.max(0,y-R);yy<Math.min(SFL,y+R);yy++)for(let xx=x-R;xx<=x+R;xx++){if(B.tag(xx,yy)!==6)continue;const r=Math.hypot(xx-x,(yy-y+2)/.9);if(r>=R)continue;const k=Math.pow(1-r/R,1.6)*T.pk*4;B.set(xx,yy,dith(B.get(xx,yy),mix(B.get(xx,yy),T.pool,.2),Math.min(1,k),xx,yy),6)}
 for(let i=0;i<fh;i++){B.set(x,y-1-i,i>fh-3?T.c[0]:T.c[1],6);B.set(x+1,y-1-i,T.c[0],6)}B.set(x+(f-1),y-1-fh,T.c[0],6)}
function floorK(B,L,t){const[d,m,ln]=L.floor;
 for(let y=SFL;y<SH;y++)for(let x=0;x<SW;x++){const k=(y-SFL)/(SH-SFL);let c=dith(m,d,k,x,y);
  /* 奥の通路の光が床に落ちる（逆光の照り返し） */const g=glowAt(L,x,SFL)*Math.max(0,1-(y-SFL)/14);if(g>0)c=dith(c,mix(c,L.glow[0],.5),Math.min(1,g*1.4),x,y);
  B.set(x,y,c,6)}
 /* 石だたみの線：ゲームと同じ、真ん中から広がる */for(let y=SFL+3,k=4;y<SH;y+=k,k+=2)for(let x=0;x<SW;x++)B.set(x,y,mix(B.get(x,y),ln,.35),6);
 for(let i=-6;i<=6;i++)for(let y=SFL+1;y<SH;y++)B.set(Math.round(SW/2+i*(10+(y-SFL)*1.1)),y,mix(B.get(Math.round(SW/2+i*(10+(y-SFL)*1.1)),y)||m,ln,.3),6);
 /* 床のふち：足が乗る線。通路の光で縁が光る */for(let x=0;x<SW;x++){const g=glowAt(L,x,SFL);B.set(x,SFL,mix(ln,L.glow[0],Math.min(1,g*1.2)),6)}}
/* ---- 段の印 ---- */
function overlayK(B,L,t,K){
 if(K===0){/* 格子窓と、外の光のすじ。左下へ落ちて、主人公にはかからない */const wx=34,wy=8;for(let y=wy;y<wy+11;y++)for(let x=wx;x<wx+13;x++)B.set(x,y,(x-wx)%4===0||y===wy||x===wx+12?'#2a2428':'#5e6670',6);
  for(let y=wy+11;y<SH;y++){const x0=wx-(y-wy-11)*.42;for(let x=Math.floor(x0);x<x0+13;x++){if(x<0||x>=SW)continue;const e=Math.min(x-x0,x0+13-x)/3,k=Math.min(1,e)*(.42-(y-wy)/(SH-wy)*.22);B.set(x,y,dith(B.get(x,y),mix(B.get(x,y),'#c8d4dc',.16),k,x,y),6)}}
  /* 苔と根：端だけ */for(let x=0;x<SW;x++){const w=edgeW(x);if(w<.2)continue;for(let y=SFL-8;y<SFL;y++)if(hsh2(x,y)<w*.25*(y-(SFL-8))/8)B.set(x,y,hsh2(y,x)<.5?'#2a3420':'#3a4628',6);if(hsh2(x,1)<w*.18){const len=4+Math.floor(hsh2(x,2)*14);for(let y=0;y<len;y++)B.set(x+Math.round(Math.sin(y*.5+x)*.6),y,y===len-1?'#4a3a2a':'#2e221a',6)}}}
 if(L.rust){/* 赤い筋：通路の縁から外へ、枝分かれしながらのびる（敵の体に走る筋と同じ）。真ん中の高さでは細く短く */
  const vein=(x,y,an,len,dep,sd)=>{for(let i=0;i<len;i++){an+=(hsh2(i,sd)-.5)*.5;x+=Math.cos(an);y+=Math.sin(an);if(x<0||x>=SW||y<1||y>=SFL-1)return;const w=edgeW(x)+(y<30?.5:0);if(w<.3)return;/* 真ん中の高さ（主人公と敵のあいだ）には入れない */B.set(x,y,'#4e1214',6);if(dep===0&&w>.4)B.set(x,y+1,'#2a0a0c',6);if(dep===0&&i%6===2)B.set(x,y,'#6e2420',6);
   if(dep<2&&i>3&&hsh2(i,sd+5)<.09)vein(x,y,an+(hsh2(i,sd+6)<.5?-.7:.7),len*.45,dep+1,sd*3+i)}};
  [[ARCH.x0+2,40,3.5,52],[ARCH.x0+10,26,3.9,46],[ARCH.x0+28,21,4.3,30],[ARCH.x1-4,34,-.5,24],[ARCH.x1-12,24,-1.1,22],[ARCH.x0+48,20,4.6,20],[4,96,-.6,30],[236,92,3.6,18]].forEach(([x,y,an,len],i)=>vein(x,y,an,len,0,i*7+1));
  for(let i=0;i<14;i++){const x=Math.floor(hsh2(i,3)*SW),y=SFL+2+Math.floor(hsh2(i,4)*26);if(edgeW(x)<.25&&i%3)continue;for(let j=0;j<3+i%4;j++)B.set(x+j,y+(j&1),'#2a0a0a',6)}}
 if(L.ink){/* 黒いしみ：天井と目地から垂れる。段が深いほど多い */const N=L.ink===2?46:20;for(let i=0;i<N;i++){const x=Math.floor(hsh2(i,11)*SW),w=edgeW(x);if(L.ink===1&&hsh2(i,12)>w+.3)continue;const len=Math.floor((8+hsh2(i,13)*40)*(L.ink===2?1.6:1)*(.4+w*.8)),ph=(t*.05+i*7)%6;
   for(let y=0;y<Math.min(SFL,len+ph);y++){const ww=y<4?2:hsh2(i,y)<.5?1:0;for(let d=-ww;d<=ww;d++)B.set(x+d,y,y>len-2?'#16121c':'#06050a',6)}}
  if(L.ink===2){/* 紫の段：壁がほとんどくらやみ。石は、たいまつのあった所のまわりに少し残る */for(let y=0;y<SFL;y++)for(let x=0;x<SW;x++){const keep=!L.nokeep&&(Math.hypot(x-22,y-50)<16+vn(x,y,6,9)*16||Math.hypot(x-218,y-50)<12+vn(x,y,6,8)*14||(archIn(x,y)>=0));if(keep)continue;const cov=.55+edgeW(x)*.25+(1-y/SFL)*.35-vn(x,y,16,3)*.55-vn(x,y,5,4)*.18;if(cov>0)B.set(x,y,cov<.05&&vn(x,y-1,16,3)*.55<vn(x,y,16,3)*.55+.02?'#1c1428':'#0b0812',6)}}
  /* 床のくらやみ：通路から手前へ流れる */for(let x=ARCH.x0-30;x<SW;x++){const h=Math.max(0,Math.round((L.ink===2?5:3)*(1-Math.abs(x-(ARCH.x0+ARCH.x1)/2)/80)+Math.sin(x*.37+t*.04)));for(let y=SFL+1;y<SFL+1+h;y++)B.set(x,y,y===SFL+1?'#1e1628':'#07050b',6)}}
 if(K===3){/* 閉じた目がひとつずつ（黒い段の敵の額と同じ）。端のしみの中だけ */for(const[x,y]of [[14,30],[226,62],[36,70]]){for(let i=-3;i<=3;i++)B.set(x+i,y+(Math.abs(i)===3?0:1),'#2e2c34',6);for(let i=-2;i<=2;i++)B.set(x+i,y,'#06050a',6)}}
 if(L.eyes){/* 三つずつの目（「3」は門の数字）。端と上だけ。ばらばらにまばたき、こちらは見ない。光らない（白目はにごった灰紫） */
  const G=[[16,30],[24,78],[234,40],[206,9],[70,12],[134,8]];
  G.forEach(([x,y],g)=>{[[-7,2],[7,2],[0,-4]].forEach(([dx,dy],j)=>{const ex=x+dx,ey=y+dy,ph=(t+g*71+j*37)%260,shut=ph<10;
   if(shut){for(let i=-4;i<=4;i++)B.set(ex+i,ey,'#2a2034',6);return}
   for(let i=-4;i<=4;i++)B.set(ex+i,ey,Math.abs(i)===4?'#2a2034':'#4a3e56',6);for(let i=-3;i<=3;i++){B.set(ex+i,ey-1,Math.abs(i)===3?'#2a2034':'#3e3448',6);B.set(ex+i,ey+1,'#221a2c',6)}for(let i=-2;i<=2;i++){B.set(ex+i,ey-2,'#2a2034',6);B.set(ex+i,ey+2,'#16101e',6)}
   /* 瞳：主人公から遠ざかる向き（主人公を見ない） */const pdx=ex<HXS?-2:2;B.set(ex+pdx,ey,'#07040b',6);B.set(ex+pdx,ey-1,'#07040b',6);B.set(ex+pdx-1,ey,'#1a1224',6);B.set(ex+pdx+1,ey-1,'#1a1224',6)})})}
 if(L.crack){/* 床のひびの下から上がる紫の光（うすく）。ひびは床の奥の線ぞい */const cs=[[40,108],[96,110],[150,112],[200,109]];for(const[x0,y0]of cs){let x=x0,y=y0;for(let i=0;i<26;i++){x+=hsh2(i,x0)<.5?1:-1;if(i%2)x+=1;y+=hsh2(i,y0)<.35?1:0;if(y>=SH)break;B.set(x,y,'#3e2656',6);if(i%5===2)B.set(x,y-1,'#2a1a3c',6)}}
  for(let x=0;x<SW;x++)for(let y=SFL-16;y<SFL;y++){const near=Math.min(...cs.map(c=>Math.abs(c[0]+6-x)));if(near<14&&hsh2(x,y)<(1-near/14)*(y-(SFL-16))/16*.35)B.set(x,y,mix(B.get(x,y)||L.wall[1],'#4a2c66',.25),6)}}}
/* 迷宮の階：覚悟 K の段 */
STG.maze=(B,t,K)=>{const L=LT[K];stoneWall(B,L,t,K);archDraw(B,L,t,K);floorK(B,L,t);overlayK(B,L,t,K);torchK(B,L,22,41,t)};/* 右のたいまつは、通路の向こうの部屋へ（手前の壁には左だけ） */
/* ---- 絵を重ねる：背景・主人公・敵。敵と主人公は別の紙に描いて輪郭をつけてから重ねる（ゲームの絵と同じ） ---- */
function figBuf(key,x,tint,t,o){o=o||{};const S=SPEC[key],idle=MV.find(m=>m.f===key&&/idle/.test(m.id)),B=new Buf(SW,SH);
 const P=idle?poseAt0(idle,t%idle.len,Object.assign({},PDEF,S.pose)):{};if(idle&&idle.pp)idle.pp(P,t%idle.len);if(tint&&S.tintable)P.tint=tint;if(o.P)Object.assign(P,o.P);P.chainL=P.chainL||22;
 const ox=x+((idle&&idle.ox)||0);(S.draw||knight)(B,ox,SFL,S,P,t);if(key==='lord'||key==='lord2')pool(B,joints(ox,SFL,S,Object.assign({},PDEF,S.pose)),t,key==='lord'?16:24);B.outline();if(S.aura)(S.aura.smoke?auraSmoke(B,S.aura,t,1):aura(B,S.aura,t));return B}
function heroBuf(t){const H=new Buf(SW,SH);knight(H,SW-HXS,SFL,SPEC.hero,{},t);H.outline();const F=new Buf(SW,SH);F.blit(H,true);return F}
const TINTK=['n','n','r','k','v'];
function stageBg(s,t,K){const B=new Buf(SW,SH);if(s.k2)STG[s.st](B,t,K,s);else STG[s.st](B,t,s.open||s.rage||s.deep);return B}
function stageK(s){return s.fixK!=null?s.fixK:Math.max(s.kmin||0,Math.min(s.kmax==null?4:s.kmax,KSTG))}
function stageFrameK(s,t){if(s.custom)return s.custom(t);const K=stageK(s),B=stageBg(s,t,K);
 if(!s.noHero)B.blit(heroBuf(t));
 for(const[w,P]of s.who)B.blit(figBuf(w,EXS,TINTK[K],t,{P}));
 if(s.refl){/* 水に映る、のまれる前の赤い騎士 */const R=new Buf(SW,SH);knight(R,EXS,SFL,SPEC.red,{},t);for(let y=0;y<SH;y++)for(let x=0;x<SW;x++){const c=R.c[y*SW+x];if(!c)continue;const yy=SFL+2+Math.round((SFL-y)*.5),xx=x+Math.round(Math.sin(yy*.5+t*.12));if(yy>SFL+1&&yy<SH&&(xx+yy)%2===0)B.set(xx,yy,mix(c,'#0c0a14',.4),8)}}
 if(s.st==='hole')for(let x=0;x<SW;x++)if(B.tag(x,SFL)!==1)B.set(x,SFL,Math.sin(x*.3+t*.1)>.5?'#3a2a50':'#1a1428',6);
 return B}
/* ---- 白黒で確かめる（2024-05-07「色が薄れた世界」：背景を白黒にして、目立つ所と目立たない所を確かめる） ----
   数で点検する：①輪郭の差＝敵のふちの画素と、すぐ外の背景の明るさの差（L*、平均）／②芯の差＝敵の体の明るさと、まわりの背景の明るさの差／③合図の余白＝合図の4色のうち一番暗い色と、真ん中の背景の一番明るい所との差 */
const ROSTER=[['boar','boarM'],['boar','shade','shadeM','samurai','samuraiM'],['boar','imp','impM','doll','dollM','shade','samurai'],['imp','boar','doll','shade','samurai'],['imp','impM','doll','dollM','shade','samurai']];
const AUD={edge:14,core:10,cue:14};/* 合格の目安（L*の差）。edge＝輪郭、core＝芯、cue＝合図の余白 */
function audit1(bg,F){let ne=0,se=0,nc=0,sc=0,nr=0,sr=0;const W=SW,H=SH,isF=i=>F.c[i]&&F.t[i]!==0;
 for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const i=y*W+x;if(!isF(i)){continue}
  const nb=[i-1,i+1,i-W,i+W].filter(j=>!isF(j));if(nb.length){for(const j of nb){if(!bg.c[j])continue;ne++;se+=Math.abs(lstar(F.c[i])-lstar(bg.c[j]))}}
  else if(F.t[i]===1||F.t[i]===2){nc++;sc+=lstar(F.c[i])}}
 /* まわり：敵から3画素以内の背景 */for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){const i=y*W+x;if(isF(i)||!bg.c[i])continue;let near=false;for(let d=1;d<=3&&!near;d++)if(isF(i-d)||isF(i+d)||isF(i-W*d)||isF(i+W*d))near=true;if(near){nr++;sr+=lstar(bg.c[i])}}
 return{edge:ne?se/ne:0,core:nc&&nr?Math.abs(sc/nc-sr/nr):0,fig:nc?sc/nc:0,ring:nr?sr/nr:0}}
function zoneMax(bg){let m=0;for(let y=12;y<SFL;y++)for(let x=70;x<216;x++){const c=bg.c[y*SW+x];if(c)m=Math.max(m,lstar(c))}return m}
const CUEL=Math.min(...['#ffffff','#ff4040','#ffd040','#b060ff'].map(lstar));
function stageAudit(list){const rows=[];for(const it of list){const K=it.K,bg=stageBg(it.s,40,K),zm=zoneMax(bg);
  for(const w of it.who){const tn=it.tint||TINTK[K];let e=0,c=0,f=0,r=0;const T=[0,24,48,72];for(const t of T){const a=audit1(bg,figBuf(w,EXS,tn,t));e+=a.edge;c+=a.core;f+=a.fig;r+=a.ring}
   rows.push({K,st:it.s.n||it.s.st,w,ttl:(FORMS.find(F=>F.key===w)||{}).ttl||w,edge:e/T.length,core:c/T.length,fig:f/T.length,ring:r/T.length,zm,cue:CUEL-zm})}}return rows}
/* ===== 関所：門番の持ち場。迷宮の「奥への通路」を、格子戸で閉じた所（通路と同じ形・同じ光） =====
   覚悟0は門番。覚悟3・4は黒い門番：格子戸は内側から押し曲げられ、旗はくらやみに食われている */
function grate(B,L,t,K,broken){/* 落とし格子：壁の厚みの中ほど（0.93）に収める。棒は2画素で、向こうの光を受ける側（上・左）だけ明るい。下の端はとがる */
 const GS=.93,inG=(x,y)=>archIn(VP.x+(x-VP.x)/GS,VP.y+(y-VP.y)/GS)>=0,iron=mix(L.wall[0],'#3c3a44',.55),hi=mix(iron,L.glow[0],.45),lo='#09070c',cx=(ARCH.x0+ARCH.x1)/2;
 const lift=x=>broken?Math.max(0,24-Math.abs(x-cx)*.75):0;/* 黒い門番の版：下の真ん中が内側から押し上げられている */
 for(let y=0;y<SFL;y++)for(let x=ARCH.x0;x<=ARCH.x1;x++){if(!inG(x,y))continue;const bx=((x-ARCH.x0-4)%10+10)%10,ry=((y-ARCH.top-8)%14+14)%14,lf=lift(x),bot=SFL-1-lf;
  const isBar=bx<3,isRail=ry<3&&y>ARCH.top+4&&y<bot-4;let c=null;
  if(isBar&&y<=bot){const tip=y>bot-3;c=tip?(bx===1?(y===bot?hi:iron):(y<bot-1?(bx===0?hi:lo):null)):[hi,iron,lo][bx]}
  if(isRail){c=[hi,iron,lo][ry];if(isBar)c=(bx===1&&ry===1)?mix(hi,L.wall[2],.5):ry===2?lo:iron}
  if(broken&&!isBar&&y>bot-3&&y<=bot&&bx<4&&lf>0)c=lo;/* 曲がった棒の先 */
  if(c)B.set(x,y,c,6)}
 /* 格子の上の梁：鉄の帯と鋲 */for(let x=ARCH.x0;x<=ARCH.x1;x++)for(let y=0;y<SFL;y++){if(!inG(x,y)||inG(x,y-2))continue;B.set(x,y,iron,6);B.set(x,y+1,(x%6===0)?hi:lo,6);break}}
function banner(B,x,y,K,t){/* 旗：紺に金の「閉じた門」（門番の前垂れと同じ紋）。黒い段からは、下からくらやみに食われて短くなる */const eat=K>=3?(K===4?20:12):0,h=30;
 for(let yy=0;yy<h;yy++)for(let xx=0;xx<16;xx++){const tear=eat&&yy>h-eat+Math.floor(vn(xx+x,yy,3,x)*8)-4;if(tear)continue;let c=yy<2?'#6e5a36':'#24305a';if(xx===0||xx===15)c='#1a2446';
  if(K>=3&&!tear&&yy>h-eat-6&&hsh2(xx+x,yy)<.5)c='#0e0a14';B.set(x+xx,y+yy,c,6)}
 if(K<3||eat<20){const ex=x+5,ey=y+8;for(let yy=0;yy<9;yy++)for(let xx=0;xx<6;xx++){const ar=yy<2&&(xx===0||xx===5);if(!ar)B.set(ex+xx,ey+yy,xx===2||xx===3?(yy>2?'#140a10':'#6e5a36'):'#6e5a36',6)}}
 if(K>=3)for(let i=0;i<4;i++){const dx=x+3+i*3,len=4+((t>>3)+i*5)%9;for(let j=0;j<len;j++)B.set(dx,y+h-eat+2+j,'#07050b',6)}}
STG.gate2=(B,t,K)=>{const L=Object.assign({},LT[K],{flatFar:1,gk:Math.min(1,LT[K].gk*(K>=3?1.18:1))},K===4?{gk:1,glow:['#685290','#2e2242']}:{});/* 格子で光がさえぎられる分、通路の光を少し強く */stoneWall(B,L,t,K);archDraw(B,L,t,K);grate(B,L,t,K,K>=3);floorK(B,L,t);
 if(K>=3){const LL=Object.assign({},L,{rust:0,eyes:0,crack:0});overlayK(B,LL,t,K)}else if(K===0){/* 関所は浅い階でも苔は少ない（人の手が入っている） */}
 banner(B,30,12,K,t);banner(B,50,12,K,t);torchK(B,L,22,41,t);
 if(K===4){const LL=Object.assign({},L,{ink:0,rust:0});overlayK(B,Object.assign(LL,{eyes:1,crack:1}),t,K)}};
/* ===== 大門（門前で遠くに見る形と、大門の間で近くに見る形） =====
   門前：遠くの大門。形は迷宮の「奥への通路」と同じアーチ（どの階でも敵のうしろにあった通路は、ここへ続いていた）。遠いので空気にかすむ。
   大門の間：同じ門を真下から。大きすぎて下しか見えない */
function sealPlate(B,x,y,w,K,open){for(let yy=0;yy<5;yy++)for(let xx=-w;xx<=w;xx++){if(open&&(xx+yy*3)%4===0)continue;B.set(x+xx,y+yy,open?(yy===0?'#3a2e40':'#241c2a'):(yy===0?'#665636':K>=3?'#3e3628':'#54462c'),6)}B.set(x,y+2,'#1a1208',6)}
function leakDown(B,cx,y0,base,leak){for(let y=y0;y<base+12;y++){const w=y<base?Math.floor(leak*.6*((y-y0)/(base-y0))):leak*2+Math.floor((y-base)*leak*.8);for(let d=-w;d<=w;d++){const x=cx+d+(y>=base?Math.round(Math.sin(y*.7)*.5):0);if(y>=base&&hsh2(x,y)<Math.abs(d)/(w+1))continue;B.set(x,y,y<base?'#07040b':(Math.abs(d)===w?'#1c1426':'#07040b'),6)}}}
/* 門の扉：鉄で留めた厚い板。板は縦、鉄の帯は横に3本、帯には鋲。両わきに大きな蝶番。真ん中の合わせ目に封印の札3枚。
   pw＝板の幅（遠い門前は5、近い大門の間は11）。遠いほど空気にかすみ（色が光に寄り）、差が弱い */
function doorFace(B,L,K,inside,x0,x1,y0,y1,pw,haze,open,lit){lit=lit||.18;const cx=Math.round((x0+x1)/2),bh=Math.max(2,Math.round(pw*.55)),bands=[.22,.52,.82].map(v=>Math.round(y0+(y1-y0)*v));
 const wood=mix(mix('#2a2026',L.wall[1],.4),L.glow[0],lit>.3?.3:0),woodD=mix(wood,'#06040a',.35),iron=mix('#2e2c36',L.wall[0],.3),ironH=mix(iron,L.glow[0],.5),hz=c=>mix(c,L.glow[0],haze),hz2=c=>mix(c,L.glow[1],haze*.6);
 for(let y=y0;y<y1;y++)for(let x=x0;x<=x1;x++){if(!inside(x,y))continue;const px=((x-cx)%pw+pw)%pw,pl=Math.floor((x-cx)/pw);
  let c=(pl&1)?wood:mix(wood,woodD,.35);if(px===0)c=woodD;if(px===1)c=mix(c,L.wall[2],.25);
  /* 下ほど、向こうの光（すき間と床の照り返し）を受ける */const v=(y-y0)/(y1-y0);c=mix(c,L.glow[0],lit*(.4+.6*v)*L.gk);
  for(const by of bands){if(y>=by&&y<by+bh){c=y===by?ironH:y===by+bh-1?'#08060c':iron;if(px===Math.floor(pw/2)&&y===by+Math.floor(bh/2))c=ironH}}
  if(Math.abs(x-cx)<=(open?2+(y%9>6?1:0):0))c=open?dith('#2a1a3e','#4e3468',(y%11)/11,x,y):'#07050b';
  B.set(x,y,hz(c),6)}
 /* 蝶番：両わきから伸びる鉄のつめ */for(const by of bands)for(const sd of [-1,1]){const ex=sd<0?x0:x1;for(let i=0;i<pw*2.4;i++){const x=ex-sd*i,w=i<pw*2?bh+2:bh;for(let j=-1;j<w-1;j++){const y=by+j;if(!inside(x,y))continue;B.set(x,y,hz(j===-1?ironH:j===w-2?'#08060c':iron),6)}}}
 /* 封印の札3枚：鈍い金。開くと破れて黒ずむ */for(let i=0;i<3;i++){const y=Math.round(y0+(y1-y0)*(.3+i*.17)),w=Math.max(2,Math.round(pw*.45));for(let yy=0;yy<w+2;yy++)for(let xx=-w;xx<=w;xx++){if(!inside(cx+xx,y+yy))continue;if(open&&(xx+yy*3+i)%4===0)continue;B.set(cx+xx,y+yy,hz(open?(yy===0?'#3a2e40':'#241c2a'):(yy===0?'#665636':K>=3?'#3e3628':'#54462c')),6)}B.set(cx,y+1+(w>>1),'#1a1208',6)}}
function farGate(B,L,t,K){/* 門前：遠くの大門。通路と同じアーチの、厚い壁の奥に収まる。遠いので板は細く、色は光にかすむ */const cx=(ARCH.x0+ARCH.x1)/2,base=SFL-12;
 const inside=(x,y)=>archIn(VP.x+(x-VP.x)/THK,VP.y+(y-VP.y)/THK)>=0&&y<SFL;
 doorFace(B,L,K,inside,ARCH.x0,ARCH.x1,ARCH.top,SFL,5,.42,0);
 /* 鎖：右は封印から門の外へ。左はちぎれて垂れる（竜の首のかせの片割れ）。鈍い金 */for(let j=0;j<30;j++){const x=cx+3+j,y=Math.round(48+j*.3+Math.sin(j*.15)*2);if(j%2===0&&inside(x,y))B.set(x,y,j%4?'#54462c':'#6a5a3a',6)}
 for(let j=0;j<16;j++){const x=cx-3-Math.round(j*.4),y=48+j;if(j%2===0)B.set(x,y,j%4?'#54462c':'#6a5a3a',6)}
 /* 門の前の段：3段（手前ほど広い） */const haze=mix(L.wall[1],L.glow[0],.5);for(let st=0;st<3;st++){const y0=base+st*4;for(let y=y0;y<y0+4;y++)for(let x=ARCH.x0+10-st*10;x<SW;x++)B.set(x,y,y===y0?mix(haze,L.floor[2],.5):mix(L.floor[1],haze,.3-st*.08),6)}
 /* すき間から漏れるくらやみ：段が深いほど太い */leakDown(B,Math.round(cx),ARCH.top+20,base,[1,1,2,3,4][K])}
function nearGate(B,L,t,K,open){/* 大門の間：同じ門を真下から。板は太く、鉄の帯と鋲がはっきり見える（近い）。上は画面の外 */const gx0=110;
 doorFace(B,L,K,(x,y)=>x>=gx0&&y<SFL,gx0,SW+18,-30,SFL,11,0,open,open?.72:.62);
 /* 門の左の柱：大きな石の柱。右の面は向こうの光を受けない（門の手前） */for(let y=0;y<SFL;y++)for(let x=gx0-14;x<gx0;x++)B.set(x,y,x===gx0-14||y%16===0?L.wall[0]:x>=gx0-3?mix(L.wall[0],L.wall[1],.5):x===gx0-13?L.wall[2]:L.wall[1],6);
 /* 敷居 */for(let x=gx0-14;x<SW;x++){B.set(x,SFL-2,L.wall[2],6);B.set(x,SFL-1,L.wall[0],6)}}
STG.monzen=(B,t,K,s)=>{const L=LT[K];stoneWall(B,L,t,K);
 /* 段の印は、門より手前の壁にだけ（門が閉じているうちは、門に目やしみはかからない） */overlayK(B,Object.assign({},L,{crack:0,eyes:0,nokeep:1}),t,K);
 archDraw(B,Object.assign({},L,{torch:{on:0}}),t,K);farGate(B,L,t,K);floorK(B,L,t);if(L.ink)overlayInk(B,t,L.ink===2?4:2);torchK(B,L,22,41,t)};
/* ===== ならくの奥（覚悟4だけ）：大門の間・誓いの間・穴の底 =====
   初版の中身（鎖・封印・一本の光・剣の墓標・水）はそのまま残し、背景の約束に合わせて描き直した：
   敵のうしろは逆光、合図の色（赤い目・明るい紫・明るい金）は背景から外す */
function pillars(B,xs,c,hi,top){for(const x of xs)for(let y=top||0;y<SFL;y++)for(let i=0;i<12;i++){const xx=x+i;if(xx<0||xx>=SW)continue;B.set(xx,y,i===1?hi:i===11?mix(c,'#000',.4):c,6)}}
STG.lord=(B,t,K,s)=>{const open=s&&s.open,L=Object.assign({},LT[4],{gk:1,glow:open?['#6a5088','#30243e']:['#625474','#2e2640']});
 stoneWall(B,L,t,4);pillars(B,[8,64],'#18121e','#261e2e');
 if(open){/* 開きかけ：壁は一気にくらやみに覆われ、三つずつの目が開く（紫の階と同じ。光らない） */overlayK(B,Object.assign({},L,{rust:0,ink:2,crack:0,eyes:0,nokeep:1}),t,4)}
 nearGate(B,L,t,4,open);if(open)overlayK(B,Object.assign({},L,{rust:0,ink:0,crack:1,eyes:1}),t,4);
 floorK(B,L,t);overlayInk(B,t,open?6:3);torchK(B,Object.assign({},LT[4],{torch:{on:0}}),22,41,t)};
function overlayInk(B,t,h0){const cx=(ARCH.x0+ARCH.x1)/2;for(let x=ARCH.x0-40;x<SW;x++){const h=Math.max(0,Math.round(h0*(1-Math.abs(x-cx)/95)+Math.sin(x*.37+t*.04)));for(let y=SFL+1;y<SFL+1+h;y++)B.set(x,y,y===SFL+1?'#1e1628':'#07050b',6)}}
/* 誓いの間：くらやみのない、別の世界線の部屋。覚悟の光の外にある、ただ一つの場所（例外） */
const LR={wall:['#160e10','#261a1c','#342628'],far:'#100a0b',floor:['#140d0d','#241a1a','#463634'],glow:['#5a4436','#2c2018'],gk:0,torch:{on:0}};
STG.red=(B,t,K,s,lwo)=>{const rage=s&&s.rage;stoneWall(B,LR,t,1);pillars(B,[6,58,110],'#22181a','#33262a');pillars(B,[226],'#22181a','#33262a');
 /* 天窓の光：騎士のうしろに一本。明るさは逆光の上限まで（合図より暗い） */const lx=EXS,lw=lwo!=null?lwo:rage?14:40;
 for(let y=0;y<SFL;y++){const hw=lw/2+y*.14;for(let x=Math.round(lx-hw);x<=Math.round(lx+hw);x++){const e=Math.min(1,(hw-Math.abs(x-lx))/4),k=e*(rage?.85:.7)*(.55+.45*y/SFL);B.set(x,y,dith(B.get(x,y),mix(B.get(x,y),'#a88a70',.3),k,x,y),6)}}
 /* 赤い旗：騎士の真うしろには置かない（赤どうしで溶けるので）。右の柱に一枚。旗の紋も「閉じた門」 */
 if(!rage){for(let y=10;y<60;y++)for(let x=204;x<224;x++){const ed=x===204||x===223;B.set(x,y,y<12?'#7a1a22':ed?'#3a0a12':'#5a0e1a',6)}for(let i=0;i<20;i+=4)B.set(204+i,60,'#5a0e1a',6);
  for(let yy=0;yy<12;yy++)for(let xx=0;xx<8;xx++){if(yy<2&&(xx===0||xx===7))continue;B.set(210+xx,28+yy,xx===3||xx===4?(yy>3?'#2a0610':'#6e5838'):'#6e5838',6)}}
 else{for(let y=SFL-4;y<SFL;y++)for(let x=200;x<230;x++)B.set(x,y,y===SFL-4?'#5a0e1a':'#3a0a12',6)}
 floorK(B,LR,t);
 /* 墓標の剣：くらやみに堕ちた者や、門を開けようとした者のもの（彼が止めてきた数）。刃は鈍い灰（合図の白とまちがえない） */for(let i=0;i<9;i++){const x=14+i*24+(i%3)*5,y=SFL+2+(i%2)*6,a=(i%3-1)*.15;if(Math.abs(x-EXS)<16)continue;for(let j=0;j<12;j++)B.set(Math.round(x+Math.sin(a)*j),y-j,j<9?(j===8?'#62626e':'#4e4e5a'):'#3e3029',6);for(let j=-2;j<=2;j++)B.set(x+j+Math.round(Math.sin(a)*9),y-9,'#4a3a32',6)}};
/* 穴の底：沈んだ誓いの間。柱は同じ並び（同じ部屋）。光は頭上の穴からだけ、騎士のうしろに落ちる */
STG.hole=(B,t,K,s)=>{const deep=s&&s.deep,L=Object.assign({},LT[4],{gk:0});stoneWall(B,L,t,4);overlayK(B,Object.assign({},L,{eyes:0,crack:0,rust:0,nokeep:1}),t,4);pillars(B,[6,58,110,226],'#130e1a','#1e1828');
 /* 頭上の穴と、落ちる光（にごった灰紫） */for(let y=0;y<10;y++)for(let x=150-y*2;x<202+y*2;x++)if((x+y)%2===0||y<3)B.set(x,y,y<3?'#2a2440':'#140e20',6);
 for(let y=6;y<SFL;y++){const hw=20+y*.12;for(let x=Math.round(EXS-hw);x<=Math.round(EXS+hw);x++){const e=Math.min(1,(hw-Math.abs(x-EXS))/8),k=e*(.55+.35*y/SFL);B.set(x,y,dith(B.get(x,y),'#4e4668',Math.min(1,k*1.25),x,y),6)}}
 /* 黒い水：ゆっくり揺れる。逆さの剣の映り、沈んだ旗 */for(let y=SFL;y<SH;y++)for(let x=0;x<SW;x++){const w=Math.sin(x*.21+y*.9+t*.06)>.85;B.set(x,y,y===SFL?(Math.sin(x*.3+t*.1)>.5?'#3a2a50':'#1a1428'):w?'#1a1428':'#08060e',6)}
 for(let i=0;i<9;i++){const x=14+i*24+(i%3)*5;for(let j=2;j<12;j++)if((j+x)%2)B.set(x,SFL+j,'#2e283a',6)}
 for(let i=0;i<20;i++)for(let j=0;j<6;j++)if((i+j)%2)B.set(204+i,SFL+14+j+Math.round(Math.sin(i*.4+t*.04)),'#3a0a14',6);
 if(deep){for(let a=0;a<=40;a++){const th=Math.PI*a/40,x=Math.round(EXS-Math.cos(th)*30),y=Math.round(SFL+4+Math.sin(th)*22);B.set(x,y,'#3a1a5a',6);B.set(x,y+1,'#22142e',6)}}};
STG.gate=STG.gate2;
/* ---- ステージの一覧に足す：関所（黒い門番）、門前、迷宮の階（中ボスとモブ） ---- */
STAGES.splice(1,0,{id:'s_gate_k',n:'関所（黒い門番）',st:'gate',k2:1,kmin:3,kmax:4,who:[['dgate',{}]],cap:'格子戸は内側から押し上げられて曲がり、すき間から奥の光がさす。旗は下からくらやみに食われて短い。たいまつは消えている（覚悟3）／目が開いている（覚悟4）。',why:'同じ関所が、門番が倒れて拾われたあとの姿。格子が「内側から」曲がっている＝何かが下から上がってきた。下の帯の覚悟3・4で切りかわる。'});
STAGES.push({id:'s_mon',n:'門前',st:'monzen',k2:1,kmin:1,who:[['dragon',{}]],cap:'大門の手前の大広間。遠くに大門が見える。形は、どの階でも敵のうしろにあった「奥への通路」と同じアーチ。遠いので空気にかすむ。封印の金は鈍く、左の鎖はちぎれて垂れる。扉のすき間からくらやみが漏れ、段をつたって床へ広がる。',why:'通路は、ずっとここへ続いていた。竜は、このすき間から最初に漏れ出たもの。ちぎれた鎖は竜の首のかせの片割れ。漏れは覚悟の段が深いほど太い。門が閉じているうちは、門に目やしみはかからない。ならくでは、この先が大門の間（同じ門を真下から見る）。'},
 {id:'s_monh',n:'門前（三つ首）',st:'monzen',hy:1,k2:1,kmin:2,kmax:3,who:[['hydra',{}]],cap:'竜が倒れたあとの、同じ広間。背景は何も変えない。',why:'三つ首は竜の亡骸から出てくるので、場所が変わらないことが大事。勝って一息ついた同じ場所で、亡骸の胸が裂ける。出るのは覚悟2・3だけ。'});
['boarM','boar','shadeM','shade','samuraiM','samurai','impM','imp','dollM','doll'].forEach(k=>STAGES.push({id:'s_maze_'+k,n:'迷宮の階',st:'maze',k2:1,dyn:1,who:[[k,{}]]}));
function stageCap(s,K){if(!s.dyn)return{n:s.n,cap:s.cap,why:s.why};const L=LT[K];return{n:`${s.n}（覚悟${K}：${L.n}・${L.st}）`,cap:L.cap,why:L.why}}
/* ---- ステージの章のページ ---- */
const STGREP=[['boarM'],['shadeM'],['impM'],['shade'],['dollM']];
function stageSec(){const s=el('section','stagech');s.id='stage';
 s.appendChild(el('div','fhead','<div class="num">06</div><div><div class="en">THE STAGES</div><h2>ステージの章</h2></div>'));
 s.appendChild(el('p','lead','覚悟で変えるのは「光」と「のまれ方」だけ。石の積み方、床、たいまつの位置、奥への通路は、どの段でも同じ。だから段が上がるたびに「同じ迷宮が、くらやみにのまれていく」と分かる。専用ステージも同じ石・同じ床・同じ通路の形から作り、その段の光を受ける。敵は段ごとに色が変わるが、背景も同じ光の中にあるので浮かない。'));
 s.appendChild(el('h3','','背景の約束'));
 s.appendChild(el('ol','srules',[
  '<b>合図 ＞ 敵 ＞ 床のふち ＞ 背景。</b>背景は主役より目立たない。描きこみは左右の端と上に寄せ、主人公と敵のあいだ（x 80〜215）には旗・ひび・目などの印を置かない。<small>2022-10-28「判定のあるものを強調する」／2023-11-17「監修あれこれ」三島道場（左右の遠景に情報量）／2022-11-30「大事と小事を見分ける」</small>',
  '<b>敵のうしろに「奥への通路」を置き、その光で敵を逆光にする。</b>どの段でも、敵のまわりの背景は L* 20 以上にする。敵の黒い輪郭が見える明るさで、シルエットがいつも読める。光の強さは段ごとに、その段の敵がいちばん立つところに合わせる（黒い段がいちばん強い）。<small>2024-08-16「シルエットを意識しよう」／2024-09-20「同じ素材なら手前が強く、奥が弱いコントラスト」</small>',
  '<b>合図の4色より暗く。</b>画面の真ん中の背景は、いちばん明るい所でも L* 43 以下（合図の一番暗い色と14以上の差）。明るい紫・赤・金・白は背景に使わない。動きはあってよいが、光る・輪になる・急に明るくなる動きはしない（予兆とまちがえる）。たいまつの火も合図より暗い、にごった色にし、炎は形だけゆらす。<small>2022-11-04「ヒットマーク」（どんな背景でも見えるように）／2023-10-03「背景の何気ない動きや予兆」</small>',
  '<b>覚悟で変えるのは素材でなく光。</b>石は同じで、光の色・量・向きだけが変わる。光は、上の階の外の光 → たいまつ → 赤い火 → 色のない灰 → 下からの紫、と、上から下へ移っていく。<small>2022-09-07「素材を描かず光を描く」／2023-08-18「タッチを合わせる」（彩度をひかえ、光の影響を受けやすく）</small>',
  '<b>段の印は、敵と同じことばで描く。</b>赤い段の壁のひび＝敵の「筋」、黒い段のしみ＝敵の「泥」と額の閉じた目、紫の段の三つずつの目＝「のまれたものほど目が増える」。背景の目は光らず、主人公を見ない。背景と敵が同じ世界の、同じ変わり方をしている。<small>2023-10-24「キャラを立てるデザイン」／2022-07-12「アニメと実写が戦うような」（世界のルールをそろえる）</small>',
  '<b>白黒にして確かめる。</b>下の「白黒で見る」で、色をぬいても敵と合図が先に目に入るかを見る。数でも点検する（下の表）。<small>2024-05-07「色が薄れた世界」</small>'].map(x=>`<li>${x}</li>`).join('')));
 const bar=el('div','stbar');const bw=el('button','','白黒で見る');bw.onclick=()=>{s.classList.toggle('gray');bw.classList.toggle('on')};bar.appendChild(bw);s.appendChild(bar);
 s.appendChild(el('h3','','迷宮の階：覚悟ごとの5つの段'));
 s.appendChild(el('p','note','ふつうの戦い（モブと中ボス）の背景。立っているのは、その覚悟で実際に出てくる敵の、その段の色の姿。'));
 const g=el('div','sgrid');for(let K=0;K<5;K++)g.appendChild(stageCard({id:'s_lad'+K,n:'迷宮の階',st:'maze',k2:1,fixK:K,dyn:1,who:[[STGREP[K][0],{}]]}));s.appendChild(g);
 s.appendChild(el('h3','','専用ステージ'));
 s.appendChild(el('p','note','関所（門番）は覚悟0、関所（黒い門番）は3・4、門前（竜）は1〜4、門前（三つ首）は2・3に出る。大門の間・誓いの間・穴の底は覚悟4だけ。下の帯の覚悟で、出てくる段に切りかわる（その覚悟に出ないステージは、いちばん近い段で見せる）。'));
 const g2=el('div','sgrid');['s_gate','s_gate_k','s_mon','s_monh','s_lord','s_lord2','s_red','s_red2','s_red_end','s_hole','s_hole2'].forEach(id=>g2.appendChild(stageCard(STAGES.find(x=>x.id===id))));s.appendChild(g2);
 s.appendChild(el('h3','','誓いの間だけは、覚悟の光の外にある'));
 s.appendChild(el('p','note','誓いの間は、門が開かなかった別の世界線の部屋なので、くらやみがない。ならくの紫の中で、ここだけ暖かい石の色に戻る。その差が「ここは別の世界だ」という印になる。赤い騎士が倒れると部屋ごと暗くなり、次の穴の底で、同じ柱の並びが紫に沈んでいる。'));
 s.appendChild(el('h3','','点検の表'));
 s.appendChild(el('p','note',`輪郭の差＝敵のふちの画素と、すぐ外の背景との明るさの差（L*、待機の4コマの平均）。${AUD.edge}以上で合格。芯の差＝敵の体と、まわりの背景の明るさの差（参考）。合図の余白＝合図の4色の一番暗い色（L* ${CUEL.toFixed(0)}）と、画面の真ん中の背景の一番明るい所との差。${AUD.cue}以上で合格。`));
 const tb=el('div','sttable','<p class="note">点検中…</p>');s.appendChild(tb);
 setTimeout(()=>{const L=[];for(let K=0;K<5;K++)L.push({K,s:{st:'maze',k2:1,n:'迷宮の階'},who:ROSTER[K]});
  L.push({K:0,s:STAGES.find(x=>x.id==='s_gate'),who:['gate']},{K:3,s:STAGES.find(x=>x.id==='s_gate_k'),who:['dgate']},{K:4,s:STAGES.find(x=>x.id==='s_gate_k'),who:['dgate']});
  for(let K=1;K<5;K++)L.push({K,s:STAGES.find(x=>x.id==='s_mon'),who:['dragon']});for(let K=2;K<4;K++)L.push({K,s:STAGES.find(x=>x.id==='s_monh'),who:['hydra']});/* 三つ首は覚悟2・3だけ */
  for(const id of ['s_lord','s_lord2','s_red','s_red2','s_hole','s_hole2']){const st=STAGES.find(x=>x.id===id);L.push({K:4,s:st,who:st.who.map(w=>w[0])})}
  const R=stageAudit(L),ok=r=>r.edge>=AUD.edge&&r.cue>=AUD.cue,ng=R.filter(r=>!ok(r)).length;
  tb.innerHTML=`<p class="note"><b>${R.length}組のうち、合格 ${R.length-ng}・不合格 ${ng}</b></p><table><tr><th>覚悟</th><th>ステージ</th><th>敵</th><th>輪郭の差</th><th>芯の差</th><th>合図の余白</th><th></th></tr>${R.map(r=>`<tr class="${ok(r)?'':'bad'}"><td>${r.K}</td><td>${r.st}</td><td>${r.ttl}</td><td>${r.edge.toFixed(1)}</td><td>${r.core.toFixed(1)}</td><td>${r.cue.toFixed(1)}</td><td>${ok(r)?'○':'×'}</td></tr>`).join('')}</table>`},400);
 return s}
FORMS.forEach(F=>{if(['boarM','boar','shadeM','shade','samuraiM','samurai','impM','imp','dollM','doll'].includes(F.key)&&!(F.stage||[]).length)F.stage=['s_maze_'+F.key]});
