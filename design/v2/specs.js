/* ===== 8つの姿の設計：色と部品はすべて意味を持つ ===== */
const PAL={
 guard:{arm:'#6a7488',armHi:'#9aa4b8',armLo:'#3a4054',trim:'#8a6a3a',trimHi:'#c8a050',trimLo:'#4a3420',chest:'#707a90',glove:'#3a2a24',eye:'#ffe08a',under:'#2e3040',underHi:'#464a5c',underLo:'#181a24',foot:'#3a4054',footHi:'#6a7488'},
 dguard:{foot:'#262234',footHi:'#4a4458',arm:'#4a4458',armHi:'#6e6880',armLo:'#262234',trim:'#4a3058',trimHi:'#7a50a0',trimLo:'#22142e',chest:'#4e4860',glove:'#1a1220',eye:'#c070ff',under:'#2a2030',underHi:'#40304a',underLo:'#140c18'},
 lord:{foot:'#1c1824',footHi:'#3a3446',arm:'#3a3446',armHi:'#5e566e',armLo:'#1c1824',trim:'#b8902a',trimHi:'#f0c850',trimLo:'#6a4a14',chest:'#42384e',glove:'#1c1824',eye:'#ff3050',under:'#241c2a',underHi:'#3a2e40',underLo:'#100c14'},
 red:{arm:'#a8303a',armHi:'#d85a58',armLo:'#5e1626',trim:'#2a1a22',trimHi:'#4a3038',trimLo:'#160c12',chest:'#b8363e',glove:'#2a1a22',eye:'#ffe08a',under:'#2e2430',underHi:'#4a3c4a',underLo:'#1a1220'},
 redW:{arm:'#a8303a',armHi:'#d85a58',armLo:'#5e1626',trim:'#2a1a22',trimHi:'#4a3038',trimLo:'#160c12',chest:'#b8363e',glove:'#2a1a22',eye:'#ffffff',under:'#2e2430',underHi:'#4a3c4a',underLo:'#1a1220'},
 fallen:{arm:'#6e1a2a',armHi:'#9a3040',armLo:'#30081a',trim:'#1a0f24',trimHi:'#3a2450',trimLo:'#0c0614',chest:'#7a1e2e',glove:'#1a0f24',eye:'#ff3050',under:'#22142e',underHi:'#3e2456',underLo:'#0c0614'},
 hollow:{arm:'#5a1424',armHi:'#8a2838',armLo:'#2a0614',trim:'#1a0f24',trimHi:'#3a2450',trimLo:'#0c0614',chest:'#1a0f24',glove:'#22142e',eye:'#ff3050',under:'#1a0f24',underHi:'#4e2c70',underLo:'#0a0510'},
 hero:{arm:'#5a7ac0',armHi:'#8aaae8',armLo:'#2e3e70',trim:'#e8d8a0',trimHi:'#ffffff',trimLo:'#8a7a50',chest:'#5a7ac0',glove:'#3a2a24',eye:'#ffffff',under:'#3a3040',underHi:'#5a4a5a',underLo:'#1a1420'},
};
const W_LONG={type:'long',len:24,w:1.1,col:'#d8dce8',hi:'#ffffff',lo:'#7a8098',guard:'#2a1a22',guardHi:'#6a4a50',grip:'#2a1a22',gw:2};
const W_SHORT={type:'long',len:17,w:1.3,col:'#c8ccd8',hi:'#ffffff',lo:'#6a7088',guard:'#8a6a3a',guardHi:'#c8a050',grip:'#4a3420',gw:2.5};
const W_ROT={type:'long',len:17,w:1.4,col:'#8a70b0',hi:'#c8b0f0',lo:'#22142e',guard:'#4a3058',guardHi:'#7a50a0',grip:'#1a1220',gw:2.5};
const W_KEY={type:'key',len:28,w:1.8,col:'#8a8090',hi:'#c8c0d0',lo:'#3a3446',guard:'#b8902a',guardHi:'#f0c850',pom:'#b8902a',grip:'#241c2a',gw:3.5};
const W_HERO={type:'long',len:12,w:1.2,col:'#e0e4f0',hi:'#ffffff',lo:'#8088a0',guard:'#e8d8a0',guardHi:'#ffffff',grip:'#3a2a24',gw:2};
/* 門の紋章：前垂れに描く「閉じた門」。門番が誰の家来かを示す */
const gateMark=(col)=>(B,R,k)=>{B.poly([R([-2*k,1*k]),R([2*k,1*k]),R([2*k,6*k]),R([-2*k,6*k])],col,null,null);B.line(...R([0,1.5*k]),...R([0,6*k]),'#140a10')};

/* かせ：手首の鉄の輪。門に仕える誓いの鎖。門番は短く、黒い門番は長く黒く床を引きずり、ぬしは門までつながり、第二形態でちぎれる */
function cuff(B,h,k,col,hi){B.disc(h[0]+.5*k,h[1]-1.2*k,1.6*k,col,hi,'#1a1820',1)}
function dangle(B,h,k,n,col,hi,T,ph){for(let i=1;i<=n;i++){const x=h[0]+1*k+Math.sin(T*.08+i*.7+(ph||0))*.6*i*.4,y=h[1]-.5*k+i*1.7*k;B.set(x,y,i%2?col:hi,1);if(i%2)B.set(x+1,y,col,1)}}
function drag(B,a,k,len,T,col,hi){/* 床を引きずる鎖 */let p=a;const fl=a[1]+999;for(let i=1;i<=len;i++){const t=i/len,x=a[0]+t*len*1.8*k*.6+Math.sin(T*.05+i)*.4,y=Math.min(a[1]+t*30*k,a[1]+(i*2.2)*k);const yy=Math.min(y,B.__floor||y);B.set(x,yy,i%2?col:hi,1)}}
function stains(col){return (B,R,k)=>{for(let i=0;i<9;i++){const p=R([(-3+((i*5)%7))*k,(2+((i*3)%10))*k]);B.set(p[0],p[1],col,2)}}}
const SPEC={};
PAL.hero={arm:'#b8bcc8',armHi:'#e8eaf0',armLo:'#686c7e',trim:'#8a8ea0',trimHi:'#c8ccd8',trimLo:'#4a4e5e',chest:'#c4c8d4',glove:'#5a4a40',eye:'#ffffff',under:'#4a4850',underHi:'#6a6870',underLo:'#2a2830',foot:'#686c7e',footHi:'#a0a4b4'};
/* 主人公の盾：紋章のない、まっさらな盾。差分では、ここに歩んだ道のりが刻まれていく */
function heroShield(B,J,V){const k=J.k*1.55,c=add(J.hdB,[V.front?-.5*k:2.6*k,V.front?1.5*k:-.5*k]);const rim=V.rim||'#b8bcc8',face=V.face||'#76563c',fh=V.faceHi||'#9a7250',fl=V.faceLo||'#36281e';
 /* 盾：木の板を鉄のふちで締めた、紋章のない盾。この騎士の顔の代わり */
 const P0=[[c[0]-4*k,c[1]-5*k],[c[0]-1.5*k,c[1]-5.6*k],[c[0]+1.5*k,c[1]-5.6*k],[c[0]+4*k,c[1]-5*k],[c[0]+3.8*k,c[1]+.5*k],[c[0]+2*k,c[1]+4*k],[c[0],c[1]+5.6*k],[c[0]-2*k,c[1]+4*k],[c[0]-3.8*k,c[1]+.5*k]];
 B.poly(P0,rim,'#e8eaf0','#565a6c');B.poly(P0.map(p=>[c[0]+(p[0]-c[0])*.8,c[1]+(p[1]-c[1])*.82]),face,fh,fl);
 B.disc(c[0],c[1]-.5*k,1.3*k,rim,'#ffffff','#565a6c');/* 中央の鉄の突起 */
 if(V.notch)for(let i=0;i<V.notch;i++){const x=c[0]-3*k+i*1.5*k;B.set(x,c[1]-4.4*k,'#e8eaf0',2);B.set(x,c[1]-3.9*k,fl,2)}
 for(const m of (V.marks||[]))m(B,c,k,V)}
const HV={};/* 差分。体つき・兜の形・剣の長さ・マントの位置は変えない */
SPEC.hero={k:.72,hk:1.45,pal:PAL.hero,helm:{type:'round',plume:'#a83a3e',plumeHi:'#d06060',plumeLo:'#6a2028'},cape:{len:20,wide:1.5,col:'#8a2a30',hi:'#b84448',lo:'#4a1420'},w:Object.assign({},W_HERO,{len:19}),
 mid:(B,J,T,P)=>{heroShield(B,J,Object.assign({front:P.shieldFront},P.V||{}))},
 pose:{ua:2.4,fa:2.2,sw:-2.5,ua2:1.75,fa2:1.95,ff:-5,fb:5}};
/* 鞘：赤い騎士の腰。ふだんは空のまま。本気になると剣が納まる */
function sheathDraw(B,J,T,P){const k=J.k,h=J.hip,a=add(h,[-1*k,1*k]),b=add(h,[13*k,-5*k]);B.thick(a,b,1.2*k,'#2a1a22','#4a3038','#120810');B.line(...add(a,[0,0]),...add(a,[1*k,0]),'#c8a050');
 if(P.sheath){const g=add(a,[-4*k,2*k]);B.thick(a,g,1*k,'#2a1a22','#4a3038','#120810');B.thick(add(g,[-.5*k,-2*k]),add(g,[.5*k,2*k]),.8*k,'#6a4a50','#8a6a70','#120810')}}
/* 鎖：門のぬしと背後の大門をつなぐ。ぬしが倒れない限り門は開かない */
function chain(B,a,b,col,hi,broken){const n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/2.2);for(let i=0;i<=n;i++){if(broken&&i>n*broken)break;const t=i/n,x=lerp(a[0],b[0],t),y=lerp(a[1],b[1],t)+Math.sin(t*Math.PI)*4;B.set(x,y,i%2?col:hi,1);if(i%2)B.set(x,y-1,col,1)}}
function smoke(B,x,y,T,n,col){for(let i=0;i<n;i++){const ph=(T*.6+i*17)%24,xx=x+Math.sin((T+i*40)*.08)*3+(i%3-1)*2,yy=y-ph;if(ph<20)B.set(xx,yy,ph<10?col:'#3a2450',5)}}
function crack(B,pts,col){for(let i=0;i+1<pts.length;i++)B.line(...pts[i],...pts[i+1],col,1)}

SPEC.gate={hk:1.3,lk:.8,name:'門番',k:1,pal:PAL.guard,helm:{type:'bucket',band:['#8a6a3a','#c8a050'],dents:[[-3,-2],[2,1]]},
 tabard:{len:10,col:'#2a3a6a',hi:'#3e5090',lo:'#18224a',mark:gateMark('#c8a050')},
 w:W_SHORT,w2:W_SHORT,
 front:(B,J,T)=>{for(const[h,ph]of[[J.hdF,0],[J.hdB,1]]){cuff(B,h,J.k,'#5a5e6c','#9aa0b4');dangle(B,h,J.k,3,'#5a5e6c','#9aa0b4',T,ph)}},
 w2front:true,
 pose:{ua:1.75,fa:-.5,sw:-2.25,ua2:1.4,fa2:-2.5,sw2:-.85,ff:-6,fb:6}};

SPEC.dgate={hk:1.3,lk:.8,name:'黒い門番',k:1,pal:PAL.dguard,
 helm:{type:'bucket',band:['#4a3058','#7a50a0'],dents:[[-3,-2],[2,1]],cracks:[[2,-4],[2.5,-3],[3,-2]],extra:(B,R,k,T,P)=>{const op=P.eyes!=null?P.eyes:3;for(let i=0;i<3;i++){const p=R([(-2.4+i*2)*k,-2*k]);B.set(...p,i<op?INK.eye:'#140a10',2)}}},
 tabard:{len:11,col:'#1a1022',hi:'#2e1c3a',lo:'#0a0510',mark:gateMark('#4a3058')},
 cape:{len:13,col:'#22142e',hi:'#3a2450',lo:'#0c0614',tatter:4,extra:(B,J,T,c)=>{const k=J.k;for(let i=0;i<3;i++){const x=lerp(c.d[0],c.e[0],i/2),y=lerp(c.d[1],c.e[1],i/2),w=Math.sin(T*.1+i*2)*3;tentacle(B,[x,y-1],[x+2+w,y+4],[x-2+w*1.5,y+8],1.3*k,.4*k,false)}}},
 w:W_ROT,w2:W_ROT,
 mid:(B,J,T)=>{const k=J.k;/* くらやみが背中から這い上がる筋 */crack(B,[add(J.sc,[5*k,2*k]),add(J.sc,[2*k,-2*k]),add(J.sc,[3*k,-5*k])],INK.hi);crack(B,[add(J.hip,[4*k,-2*k]),add(J.hip,[1*k,-6*k])],INK.hi)},
 front:(B,J,T)=>{for(const tp of [J.tip,J.tip2])if(tp&&(T%20)<10)B.set(tp[0],tp[1]+2+((T/2|0)%3),INK.eye,5);
  for(const[h,ph]of[[J.hdF,0],[J.hdB,1]]){cuff(B,h,J.k,'#2a2434','#4a3058');dangle(B,h,J.k,4,'#22142e','#4e2c70',T,ph)}
  /* 長く黒い鎖が床を引きずる */const fy=J.footF[1]-1,h=J.hdB;for(let i=1;i<=22;i++){const t=i/22,x=h[0]+3+t*26,y=Math.min(fy,h[1]+t*40);B.set(x,y,i%2?'#22142e':'#4e2c70',1)}},
 w2front:true,
 pose:{ua:1.75,fa:-.5,sw:-2.25,ua2:1.4,fa2:-2.5,sw2:-.85,ff:-6,fb:6,lean:.08}};

const lordHelm={type:'bhorn',band:['#6a5020','#b8902a'],glow:'#ff3050',dents:[[-3.5,-1.5],[1,1.5],[-1,-3]],cracks:[[3,-4],[3.4,-3],[3,-2],[3.6,-1]],crackCol:'#ff3050',hs:1.3,horn:'#2a2434',hornHi:'#6e6680',hornLo:'#120e18',hornTip:'#b8902a',
 };
/* 足元のくらやみの溜まり：門の下から漏れ続けたものが、ぬしの足元に溜まっている */
function pool(B,J,T,w){const k=J.k,y=Math.round(J.footF[1]),x0=J.footF[0]-4*k,x1=J.footB[0]+(w||14)*k;for(let x=Math.round(x0);x<=x1;x++){const h=1+((x*7+Math.floor(T/8))%5===0?1:0);for(let i=0;i<h;i++)B.set(x,y-i,i?INK.hi:INK.col,5)}
 for(let i=0;i<4;i++){const ph=(T*.4+i*11)%18,x=lerp(x0,x1,(i*.27+.1)%1);if(ph<12)B.set(x,y-2-ph,ph<6?INK.hi:INK.col,5)}}
/* マントの裏の目：閉じ込めたものが、ぬしの影から外をのぞいている */
function capeEyes(B,J,T,n,col){const k=J.k;for(let i=0;i<n;i++){const op=((T/6|0)+i*3)%11>1;const x=J.hip[0]+(6+(i%3)*2.5)*k,y=J.hip[1]+(3+i*3.2)*k;if(B.get(x,y))B.set(x,y,op?col:'#140a10',2)}}
SPEC.lord={hk:1.1,lk:.9,tk:.95,name:'門のぬし',k:1.3,pal:PAL.lord,helm:lordHelm,
 tabard:{len:13,col:'#222842',hi:'#333c5e',lo:'#10142a',mark:(B,R,k)=>{gateMark('#8a6a2a')(B,R,k);stains('#2e1a44')(B,R,k)}},
 cape:{len:28,col:'#1c1622',hi:'#342a3c',lo:'#0c0a10',tatter:7,extra:(B,J,T)=>capeEyes(B,J,T,6,'#ff3050')},
 w:W_KEY,
 behind:(B,J,T,P)=>{const k=J.k,br=P.chainBr;for(let i=0;i<3;i++){const a=add(J.sc,[3*k,(-2+i*4)*k]);chain(B,a,[a[0]+(P.chainL||60),a[1]-10+i*12],'#5e566e','#b8902a',br)}},
 chest:(B,R,k,P)=>{/* 封印：胸の金の封。ひびの奥に赤い目がのぞく */const c=R([0,-9*k]);B.disc(c[0],c[1],3.2*k,'#b8902a','#f0c850','#6a4a14');B.disc(c[0],c[1],1.6*k,'#140a10',null,null);B.set(c[0],c[1],'#ff3050',2);crack(B,[[c[0]-3*k,c[1]-2*k],[c[0]-1*k,c[1]],[c[0]-2*k,c[1]+3*k]],'#140a10')},
 mid:(B,J,T)=>{smoke(B,J.sc[0],J.sc[1]-6,T,7,'#4e2c70')},
 front:(B,J,T)=>{pool(B,J,T,16);for(const h of[J.hdF])cuff(B,h,J.k,'#3a3446','#6a6080')},
 pose:{ua:1.8,fa:2.9,sw:-1.75,ua2:1.6,fa2:2.4,ff:-7,fb:7,cr:1.5,lean:.1}};

SPEC.lord2={hk:1.1,lk:.9,tk:.95,name:'暗い門のぬし',k:1.3,pal:Object.assign({},PAL.lord,{eye:'#ff3050'}),
 helm:Object.assign({},lordHelm,{extra:(B,R,k,T)=>{/* 兜が割れて、ひとつ目がのぞく */crack(B,[R([0,-7*k]),R([.5*k,-3*k]),R([-.5*k,1*k])],'#140a10');B.disc(...R([-1.5*k,-2*k]),1.6*k,'#ff3050','#ffb0a0','#a01030');B.set(...R([-2*k,-2*k]),'#140a10',2)}}),
 tabard:{len:9,col:'#1a1e34',hi:'#2a3050',lo:'#0c0e1a',mark:(B,R,k)=>{gateMark('#5a4418')(B,R,k);stains('#4e2c70')(B,R,k)}},
 cape:{len:28,col:'#140e1a',hi:'#2a1e34',lo:'#06040a',tatter:9,extra:(B,J,T)=>capeEyes(B,J,T,9,'#ff3050')},
 w:Object.assign({},W_KEY,{col:'#5e4a78',hi:'#9a80c0',lo:'#22142e'}),tentB:true,
 behind:(B,J,T,P)=>{const k=J.k;
  /* 千切れた鎖：門との結びつきが切れた */for(let i=0;i<2;i++){const a=add(J.sc,[3*k,(-1+i*5)*k]);chain(B,a,[a[0]+(14+i*4)*k,a[1]+(8+Math.sin(T*.1+i)*3)*k],'#5e566e','#b8902a')}
  /* 背中の触手3本：目の光る順に来る */const ten=P.ten||[0,0,0];for(let i=0;i<3;i++){const r=add(J.sc,[4*k,(-4+i*3)*k]),w=Math.sin(T*.06+i*2)*3,ex=Math.max(-1,Math.min(1,ten[i]||0)),rest=[r[0]+(10+i*3)*k,r[1]-(16-i*7)*k+w],tgt=[(typeof HXX!=='undefined'?HXX+8:r[0]-60),(typeof FL!=='undefined'?FL-14:r[1])],tip=ex>=0?[lerp(rest[0],tgt[0],ex),lerp(rest[1],tgt[1],ex)]:[lerp(rest[0],r[0]+3*k,-ex),lerp(rest[1],r[1],-ex)],mid=ex>0?[lerp(r[0]+(14+i*2)*k,(r[0]+tgt[0])/2,ex),r[1]-(20+i*4)*k*ex-(6-i*4)*k*(1-ex)]:[r[0]+(14+i*2)*k,r[1]-(6-i*4)*k];tentacle(B,r,mid,tip,2.3*k,.6*k,false);B.set(...tip.map(Math.round),P.eyeOn&&P.eyeOn[i]?'#ffffff':INK.eye,2)}},
 chest:(B,R,k,P)=>{/* 胸の扉が開く：体そのものが門になった */const o=P.door!=null?P.door:1;const c=R([0,-9*k]);
  B.disc(c[0],c[1],4*k,'#0a0306',null,null);for(let i=-3;i<=3;i+=2){B.set(c[0]+i*k,c[1]-3*k,'#e8e0d0',2);B.set(c[0]+i*k,c[1]+3*k,'#e8e0d0',2)}B.disc(c[0],c[1],1.8*k,'#ff3050','#ffb0a0','#a01030');B.set(c[0]-.5*k,c[1],'#140a10',2);
  for(const s of[-1,1]){const h=R([s*4*k,-9*k]),e=[h[0]+s*o*4*k,h[1]];B.poly([[h[0],h[1]-4*k],[e[0],h[1]-5*k],[e[0],h[1]+5*k],[h[0],h[1]+4*k]],'#42384e','#5e566e','#1c1824')}},
 mid:(B,J,T)=>{smoke(B,J.sc[0],J.sc[1]-6,T,10,'#6a3a90')},
 front:(B,J,T)=>{pool(B,J,T,24);cuff(B,J.hdF,J.k,'#3a3446','#6a6080');dangle(B,J.hdF,J.k,5,'#5e566e','#b8902a',T,0)},
 pose:{ua:1.8,fa:2.9,sw:-1.75,ua2:1.0,fa2:1.4,ff:-7,fb:7,cr:2,lean:.14}};

SPEC.red={hk:1.1,lk:.9,tk:.95,name:'赤い騎士',k:1,pal:PAL.red,
 helm:{type:'crest',detail:1,plume:'#e8e0d0',plumeHi:'#ffffff',plumeLo:'#9a9080'},
 cape:{len:24,col:'#5a0e1c',hi:'#8a2030',lo:'#2a0610'},
 w:W_LONG,sheath:sheathDraw,
 pose:{ua:1.95,fa:2.7,sw:3.5,ua2:1.5,fa2:2.3,ff:-9,fb:7,cr:1.5}};

SPEC.red2={hk:1.1,lk:.9,tk:.95,name:'本気の赤い騎士',k:1,pal:PAL.redW,
 helm:{type:'crest',plume:'#e8e0d0',plumeHi:'#ffffff',plumeLo:'#9a9080',extra:(B,R,k,T)=>{/* 目の光が白い尾を引く */for(let i=1;i<6;i++)B.set(...R([(-3+i*1.6)*k,(.2+i*.15)*k]),i<3?'#ffffff':'#bfe8ff',5)}},
 w:W_LONG,sheath:sheathDraw,
 pose:{ua:1.7,fa:2.2,sw:null,sheath:1,ua2:1.4,fa2:2.6,ff:-11,fb:8,cr:4,lean:-.15}};

const fallenHelm={type:'crest',extra:(B,R,k,T)=>{/* 片側だけ門のぬしの角：くらやみに半分のまれた */horn(B,R,k,1,1,{});
  /* 羽根飾りの代わりに、くらやみが垂れる */B.tube(R([1*k,-6*k]),R([7*k,-6*k]),R([9*k,2*k+Math.sin(T*.1)*1.5]),1.6*k,.5*k,INK.col,INK.hi,INK.lo);crack(B,[R([-1*k,-5*k]),R([0,-2*k]),R([-1*k,1*k])],INK.eye)}};
const fallenCape=(n)=>(B,J,T,P)=>{const k=J.k;/* 脱ぎ捨てたマントの代わりに、くらやみの触手がマントになった */for(let i=0;i<n;i++){const r=add(J.shB,[(1+i)*k,(1+i)*k]),w=Math.sin(T*.07+i*1.3)*3;tentacle(B,r,[r[0]+(6+i*2)*k+w,r[1]+12*k],[r[0]+(4+i*3)*k+w*1.6,r[1]+(26-i*2)*k],1.8*k,.5*k,i===1)}};
SPEC.fallen={hk:1.1,lk:.9,tk:.95,name:'赤い門のぬし',k:1,pal:PAL.fallen,helm:fallenHelm,
 w:W_LONG,tentB:true,sheath:sheathDraw,
 behind:fallenCape(4),
 mid:(B,J,T)=>{const k=J.k;/* 赤い鎧のひびから、くらやみがにじむ */crack(B,[add(J.sc,[-4*k,1*k]),add(J.sc,[-2*k,4*k]),add(J.sc,[-3*k,8*k])],INK.eye);crack(B,[add(J.kneeF,[-1*k,1*k]),add(J.kneeF,[0,4*k])],INK.eye);smoke(B,J.sc[0]+2,J.sc[1]-4,T,3,'#4e2c70')},
 pose:{ua:1.95,fa:2.7,sw:3.5,ua2:1.3,fa2:2.0,ff:-9,fb:7,cr:1.5}};

SPEC.fallen2={hk:1.1,lk:.9,tk:.95,name:'赤い門のぬし 第二形態',k:1.15,pal:PAL.hollow,
 helm:{type:'crest',extra:(B,R,k,T)=>{for(const s of[-1,1])B.tube(R([s*3*k,-5*k]),R([s*8*k,-11*k]),R([s*4.5*k,-18*k]),1.8*k,.5*k,'#2a2434','#6e6680','#120e18');B.disc(...R([-2*k,0]),1.4*k,'#ff3050','#ffb0a0','#a01030')}},
 w:W_LONG,tentB:true,
 behind:(B,J,T,P)=>{const k=J.k,c=add(J.sc,[4*k,-4*k]),R0=19*k;/* 背中の触手が門のアーチをつくる：彼自身が門になった。輪の内側は門の向こう側 */
  for(let y=-R0;y<=R0*.9;y++)for(let x=-R0;x<=R0;x++){const d=Math.hypot(x,Math.min(0,y));if(d<R0-2&&((x+y)&1)===0)B.set(c[0]+x,c[1]+y,'#120a1c',6)}
  const pts=[];for(let i=0;i<=24;i++){const a=Math.PI+i/24*Math.PI;pts.push(add(c,dir(a,R0)))}pts.unshift(add(c,[-R0,R0*.9]));pts.push(add(c,[R0,R0*.9]));
  for(let i=0;i+1<pts.length;i++)B.thick(pts[i],pts[i+1],2.2*k,INK.col,INK.hi,INK.lo);
  for(let i=1;i<pts.length-1;i+=3){const p=pts[i],o=dir(Math.atan2(p[1]-c[1],p[0]-c[0])+Math.sin(T*.06+i)*.4,7*k);tentacle(B,p,add(p,[o[0]*.6-1,o[1]*.6]),add(p,o),1.3*k,.4*k,false)}
  for(let i=2;i<pts.length-1;i+=4)B.set(...pts[i].map(Math.round),((T/7|0)+i)%5?INK.eye2:'#140a10',2)},
 chest:(B,R,k,P)=>{/* 中身のない鎧：胸の板の隙間から核の赤 */const c=R([0,-9*k]);B.disc(c[0],c[1],2.2*k,'#ff3050','#ffb0a0','#a01030');B.set(c[0],c[1],'#ffffff',2);
  for(const s of[-1,1])B.poly([R([s*1.8*k,-13*k]),R([s*6*k,-13*k]),R([s*5*k,-6*k]),R([s*1.8*k,-7*k])],'#5a1424','#8a2838','#2a0614')},
 mid:(B,J,T)=>{smoke(B,J.sc[0],J.sc[1]-6,T,8,'#6a3a90');smoke(B,J.hip[0],J.hip[1],T+9,6,'#6a3a90')},
 pose:{ua:1.95,fa:2.7,sw:3.5,ua2:1.2,fa2:1.8,ff:-9,fb:7,cr:2,lean:.05}};
const ORDER=['gate','dgate','lord','lord2','red','red2','fallen','fallen2'];
