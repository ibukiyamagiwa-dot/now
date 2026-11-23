/* 主人公の差分：クリアチェッカーのごほうびで変わる部分。体つき・兜の形・剣の長さ・マントの位置は変えない */
const OPENGATE=(col)=>(B,R,k)=>{/* 開いた門：門を越えた者の印 */B.poly([R([-2.2*k,1*k]),R([-.5*k,1*k]),R([-.5*k,6*k]),R([-2.2*k,6*k])],col,null,null);B.poly([R([.5*k,1*k]),R([2.2*k,1*k]),R([2.2*k,6*k]),R([.5*k,6*k])],col,null,null)};
function heroVar_old(o){const S=JSON.parse(JSON.stringify({pal:SPEC.hero.pal,helm:SPEC.hero.helm,cape:SPEC.hero.cape}));const H=Object.assign({},SPEC.hero,S);
 H.pal=Object.assign({},H.pal,o.pal||{});H.helm=Object.assign({},H.helm,o.helm||{});H.cape=Object.assign({},H.cape,o.cape||{});if(o.tabard){H.tabard=o.tabard;H.tabardFront=true}if(o.capeExtra)H.cape.extra=o.capeExtra;H.V=o.V||{};return H}
/* 差分の上描き：体の要所の座標（J）に、意味のある変化を大きく描く */
const SCR=(B,a,b,hi,lo)=>{B.line(a[0],a[1],b[0],b[1],hi,2);B.line(a[0]+1,a[1]+1,b[0]+1,b[1]+1,lo,2)};
/* 盾への描きこみ：差分の中心は盾。盾を見れば「どこまで来た騎士か」が読める */
const HSH={
 scar:(B,c,k)=>{/* 大きな斜めの切り傷と、ふちの刻み：番人たちと渡り合った跡 */SCR(B,[c[0]-3*k,c[1]-3.5*k],[c[0]+2.5*k,c[1]+3*k],'#e8dcc0','#1a120c');SCR(B,[c[0]+1.5*k,c[1]-4*k],[c[0]+3*k,c[1]-1*k],'#e8dcc0','#1a120c');for(let i=0;i<5;i++){const x=c[0]-3*k+i*1.5*k;B.set(x,c[1]-5.4*k,0,0);B.set(x,c[1]-4.9*k,'#1a120c',2)}},
 gate:(B,c,k)=>{/* 開いた門の紋章：アーチの枠と、外へ開いた二枚の扉。真ん中は空いている */const G='#e0c070',x=c[0],y=c[1];
  for(const s of[-1,1]){for(let yy=-1.5;yy<=3.2;yy+=.5)B.set(x+s*1.8*k,y+yy*k,G,2);for(let t=0;t<=1;t+=.1){B.set(x+s*(1.8+t*1.3)*k,y+(-1.2+t*.6)*k,G,2);B.set(x+s*(1.8+t*1.3)*k,y+(3.2-t*.6)*k,G,2)}for(let yy=-.6;yy<=2.6;yy+=.5)B.set(x+s*3.1*k,y+yy*k,G,2)}
  for(let a=0;a<=3.14;a+=.2)B.set(x-Math.cos(a)*1.8*k,y-1.5*k-Math.sin(a)*1.4*k,G,2)},
 plume:(B,c,k)=>{/* 盾の角から垂れる白い羽根 */for(let i=0;i<6;i++)B.disc(c[0]+(3.8+i*.25)*k,c[1]-(4.5-i*1.4)*k,(1.3-i*.12)*k,'#e8e0d0','#ffffff','#9a9080')},
 ink:(B,c,k)=>{/* ふちからにじむくらやみ */for(let i=0;i<10;i++){const a=-2.6+i*.55,x=c[0]+Math.cos(a)*3.6*k,y=c[1]+Math.sin(a)*4.6*k;B.set(x,y,INK.col,2);B.set(x,y+1,INK.hi,2);if(i%3===0)B.set(x,y+2,INK.col,2)}},
};
function heroVar(o){const H=Object.assign({},SPEC.hero);H.pal=Object.assign({},SPEC.hero.pal,o.pal||{});H.helm=Object.assign({},SPEC.hero.helm,o.helm||{});H.cape=Object.assign({},SPEC.hero.cape,o.cape||{});
 if(o.tabard){H.tabard=o.tabard;H.tabardFront=true}if(o.capeExtra)H.cape.extra=o.capeExtra;H.V=Object.assign({},o.V||{});
 const fs=o.fronts||[];H.front=(B,J,T,P)=>{fs.forEach(f=>f(B,J,T,P))};return H}
const GOLDEDGE=(B,J)=>{const k=J.k,G=['#f0c850','#b8902a'];
 for(const s of[J.shF])for(let a=-2.6;a<=-.4;a+=.2)B.set(s[0]+Math.cos(a)*4*k,s[1]-.5*k+Math.sin(a)*3.6*k,G[0],2);
 for(const K of[J.kneeF])for(let a=0;a<6.28;a+=.5)B.set(K[0]+Math.cos(a)*1.9*k,K[1]+Math.sin(a)*1.9*k,G[(a*2|0)%2],2);
 for(let x=-4;x<=4;x+=.5)B.set(J.hip[0]+x*k,J.hip[1]-1.8*k,G[1],2)};
const INKCAPE=(B,J,T,c)=>{const k=J.k;for(let i=0;i<B.c.length;i++){if(!B.c[i])continue;const x=i%B.w,y=i/B.w|0;if(['#8a2a30','#b84448','#4a1420'].includes(B.c[i]))B.c[i]=y<J.sc[1]+3*k?B.c[i]:y<J.sc[1]+6*k?((x+y)%2?INK.hi:'#8a2a30'):(B.c[i]==='#b84448'?INK.hi:B.c[i]==='#4a1420'?INK.lo:INK.col)}
 for(let i=0;i<4;i++){const x=lerp(c.d[0],c.e[0],i/3)+1,y=lerp(c.d[1],c.e[1],i/3);tentacle(B,[x,y-1],[x+2+i,y+3],[x+(i%2?3:-1),y+6+i%2*2],1.1*k,.3*k,false)}};
const TAB={len:14,col:'#323e68',hi:'#46568a',lo:'#161e34',mark:OPENGATE('#e0c070')};
const PLU={plume:'#e8e0d0',plumeHi:'#ffffff',plumeLo:'#9a9080',pk:1.45,pn:7};
const GPAL={trim:'#b8902a',trimHi:'#f0c850',trimLo:'#6a4a14',foot:'#8a6a2a',footHi:'#c8a050'};
const GSH={rim:'#f0c850',face:'#3a3e68',faceHi:'#5a5e90',faceLo:'#1a1e3a'};
const HVARS=[
 {id:'base',n:'はじまり',how:'最初から',why:'傷のない鎧、何も描かれていない盾、赤い羽根。まだ何者でもない。'},
 {id:'scar',n:'傷だらけの盾',how:'門番を倒す',why:'傷は盾にだけ残る。大きな切り傷と、ふちの刻み。番人たちの剣を、この盾で受けてきた。',o:{V:{marks:[HSH.scar]}}},
 {id:'tabard',n:'開いた門',how:'門のぬしを倒す',why:'門番たちと同じ紺の長い布と、盾に金の「開いた門」。閉じた門を越えた者。',o:{tabard:TAB,V:{marks:[HSH.gate]}}},
 {id:'plume',n:'白い大羽根',how:'赤い騎士を倒す',why:'塵になった赤い騎士の、ただ一つの飾り。兜に大きく、盾の角にもひと房。受けついだのか、拾っただけか。',o:{helm:PLU,V:{marks:[HSH.plume]}}},
 {id:'gold',n:'金の縁どり',how:'ランクS',why:'肩・ひざ・帯に金。盾は紺に金のふち。誇りの色。……門のぬしの金も、昔はこう光っていた。',o:{pal:GPAL,helm:{ridge:'#f0c850'},V:GSH,fronts:[GOLDEDGE]}},
 {id:'ink',n:'くらやみのマント',how:'ならくをこえる',why:'マントがくらやみに染まり、盾のふちにもにじむ。いちばん深くまで降りた者。洗っても落ちない。',o:{capeExtra:INKCAPE,V:{marks:[HSH.ink]}}},
];
HVARS.push({id:'all',n:'ぜんぶ',how:'すべてそろえる',why:'盾は歩んだ道のりそのもの。それでも兜・剣・体つき・マントの位置は同じ。だれが見ても「あの騎士」。',o:{tabard:TAB,helm:Object.assign({},PLU,{ridge:'#f0c850'}),pal:GPAL,capeExtra:INKCAPE,fronts:[GOLDEDGE],V:Object.assign({},GSH,{marks:[HSH.gate,HSH.scar,HSH.ink,HSH.plume]})}});
/* 主人公のモーション（敵の左向きの骨組みで描いて、左右を反転する） */
const HMOT=[
 {n:'待機',p:{},why:'剣先を前に、盾を引いて待つ'},
 {n:'たたかう',p:{ua:3.0,fa:2.7,sw:2.4,x:-10,lean:.3,ff:-9,fb:6,ua2:.4,fa2:.8},why:'踏みこんで斬る'},
 {n:'重い一撃',p:{ua:-2.2,fa:-1.6,sw:-1.0,cr:2,lean:-.1,ua2:.5,fa2:1.0},why:'振りかぶり、画面が止まる'},
 {n:'ガード',p:{ua:2.6,fa:-2.2,sw:-1.65,cr:1.5,lean:-.05},why:'剣を立てて受ける'},
 {n:'盾で受ける',p:{shieldFront:1,ua2:2.9,fa2:3.0,ua:1.2,fa:1.6,sw:1.2,cr:3,lean:.1},why:'赤い光は、身を屈めて盾で耐える'},
 {n:'パリィ',p:{ua:2.9,fa:-2.6,sw:-2.2,lean:.15,x:-2},why:'当たる直前に、剣で弾く',fx:'spark'},
 {n:'ジャスト回避',p:{x:8,lean:-.35,cr:3,ff:-3,fb:8,ua:1.6,fa:1.9,sw:2.6},why:'少し早めに、すり抜ける'},
 {n:'まほう',p:{ua:-1.8,fa:-1.7,sw:-1.57,lean:-.1,cr:1},why:'剣を掲げ、見切りを放つ',fx:'magic'},
 {n:'倒れる',p:{kn:1,lean:.8,hd:.8,ua:1.8,fa:1.6,sw:.2,x:4},why:'膝から崩れる'},
];
