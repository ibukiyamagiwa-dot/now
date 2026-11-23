/* ================= 主人公 ================= */
function heroHelm(B,J){const{ox,hc,H,st,sc}=J,cx=ox-.5,r=R.heroArm[st];
 /* 首の鎖かたびら */paint(B,mPoly([[cx-H*.35,hc+H*.25],[cx+H*.4,hc+H*.25],[cx+H*.45,J.sh+1],[cx-H*.4,J.sh+1]]),R.chain[st],st);
 const top=st==='A'?0:H*.12;paint(B,U(mEll(cx,hc,H*.5,H*.5),mPoly([[cx-H*.28,hc-H*.3],[cx,hc-H*.5-top],[cx+H*.3,hc-H*.3]])),r,st);
 /* 羽根飾り：前へ進む者の印。赤はマントと同じ「主人公の色」 */const pr=R.heroCape[st];const py=hc-H*.45;
 if(st==='A'){paint(B,U(mEll(cx+H*.25,py-1,H*.28,H*.16),mEll(cx+H*.5,py+1,H*.22,H*.14)),pr,'A')}
 else{const n=st==='C'?6:5;for(let i=0;i<n;i++){const t=i/(n-1);paint(B,mEll(cx+H*(.05+t*.75),py+t*t*H*.55-1,H*(.2-t*.08),H*(.13-t*.04)),pr,st)}}
 /* 目のすき間：顔は見せない＝だれでもこの騎士になれる */const sy=Math.round(hc-H*.02);for(let x=Math.round(cx-H*.48);x<=Math.round(cx+H*(st==='A'?.05:.1));x++){B.set(x,sy,O,2);if(st!=='A')B.set(x,sy+1,mx(r[3],O,.3),2)}
 if(st!=='A'){/* 中央の筋 */for(let y=Math.round(hc-H*.5);y<sy;y++)B.set(Math.round(cx-H*.15),y,r[0],2);
  /* 息の穴 */for(let i=0;i<(st==='C'?5:3);i++)B.set(Math.round(cx-H*.3+i*(st==='C'?1:1.5)),Math.round(hc+H*.22),O,2);
  if(st==='C'){for(let i=0;i<4;i++)B.set(Math.round(cx+H*.3),Math.round(hc-H*.3+i*2),r[0],2)}}}
const HERO={arm:'heroArm',cape:'heroCape',helm:heroHelm,
 armF:J=>({hF:[J.ox-J.sw-PROP[J.st].arm*.5*J.sc,J.hip-J.T*.45]}),
 backHand:(B,J)=>{/* 盾：紋章のない、まっさらな盾。だれでもない騎士の盾 */const{st,sc}=J,c=[J.hB[0]+1,J.hB[1]-1],w=(st==='C'?4.5:st==='A'?5.5:5)*sc,h=w*1.5;
  paint(B,mPoly([[c[0]-w,c[1]-h*.55],[c[0]+w,c[1]-h*.55],[c[0]+w*.9,c[1]+h*.1],[c[0],c[1]+h*.6],[c[0]-w*.9,c[1]+h*.1]]),R.wood[st],st);
  if(st!=='A'){const g=R.heroArm[st];for(let x=Math.round(c[0]-w);x<=c[0]+w;x++)B.set(x,Math.round(c[1]-h*.55),g[1],1);for(let y=Math.round(c[1]-h*.5);y<c[1]+h*.5;y++)B.set(Math.round(c[0]),y,g[2],1)}},
 weapon:(B,J)=>{J.tip=blade(B,J.hF,-2.55,(J.st==='C'?22:J.st==='A'?16:19)*J.sc,1.1,J.st)}};

/* ================= 門番 ================= */
/* 兜：上が平らな筒形。門番の兜は、ぬしの兜をまねた形（主従の印） */
function bucket(B,J,ramp,o){const{ox,hc,H,st}=J,cx=ox-.5,w=H*(st==='C'?.52:.55),h=H*.56;
 paint(B,mPoly([[cx-w,hc-h+1],[cx-w+1,hc-h],[cx+w-1,hc-h],[cx+w,hc-h+1],[cx+w,hc+h],[cx-w,hc+h]]),ramp,st);
 if(st!=='A'){/* 上の帯と鋲 */const band=o.band||R.gold[st];for(let x=Math.round(cx-w);x<=cx+w;x++){B.set(x,Math.round(hc-h+2),band[st==='C'?2:1],2)}for(let x=Math.round(cx-w+1);x<cx+w;x+=st==='C'?2:3)B.set(x,Math.round(hc-h+2),band[0],2)}
 /* 十字ののぞき穴 */const sy=Math.round(hc-H*.05),gl=o.glow;for(let x=Math.round(cx-w+1);x<=Math.round(cx+w*(st==='A'?.1:.35));x++){B.set(x,sy,gl&&x<cx-1?gl:O,2)}
 if(st!=='A'){for(let y=sy-Math.round(H*.18);y<=sy+Math.round(H*.32);y++)B.set(Math.round(cx-w*.35),y,O,2);
  for(let i=0;i<(st==='C'?4:3);i++)for(let j=0;j<2;j++)B.set(Math.round(cx+w*.2+j*2),Math.round(hc+h*.35+i*1.6-1),O,2);
  /* へこみ：だれも通さなかったが、戦った数は多い */for(const d of (o.dents||[]))for(let i=0;i<3;i++)B.set(Math.round(cx+d[0]*w+i),Math.round(hc+d[1]*h+(i===1?1:0)),mx(ramp[3],O,.4),2)}}
const GATEMARK=(B,cx,y,s,col,st)=>{/* 紋章「閉じた門」：アーチと、真ん中の継ぎ目 */paint(B,U(mPoly([[cx-2.5*s,y+5*s],[cx-2.5*s,y+1.5*s],[cx+2.5*s,y+1.5*s],[cx+2.5*s,y+5*s]]),mEll(cx,y+1.6*s,2.5*s,1.6*s)),col,st==='C'?'B':st);for(let yy=Math.round(y+.5*s);yy<y+5*s;yy++)B.set(Math.round(cx),yy,O,2)};
function tabard(B,J,cloth,mark,stain){const{ox,hip,T,hw,st,sc}=J;paint(B,mPoly([[ox-hw+.5,hip-T*.75],[ox+hw-.5,hip-T*.75],[ox+hw-.5,hip+5*sc],[ox,hip+6.5*sc],[ox-hw+.5,hip+5*sc]]),cloth,st);
 GATEMARK(B,ox,hip-T*.55,st==='C'?.75*sc:st==='A'?1*sc:.85*sc,mark,st);
 if(stain&&st!=='A')for(let i=0;i<14;i++){const x=ox-hw+((i*7)%(hw*2)),y=hip+5*sc-((i*5)%(6*sc));B.set(x,y,R.ink[st][1],2)}}
/* 手首のかせ：門に仕える誓いの鎖。ぬしになると、これが門までつながる */
function shackle(B,h,st,n){const c=R.chain[st];B.set(h[0]-1,h[1]+1,c[0],2);B.set(h[0]+1,h[1]+1,c[0],2);for(let i=0;i<n;i++)B.set(h[0]+(i%2),h[1]+3+i*1.6,i%2?c[1]:c[0],2)}
const GUARD={arm:'gArm',
 armF:J=>({hF:[J.ox-1,J.sh+J.T*.55],hB:[J.ox+2,J.sh+J.T*.6]}),
 body:(B,J)=>tabard(B,J,R.gCloth[J.st],R.gold[J.st]),
 helm:(B,J)=>bucket(B,J,R.gArm[J.st],{dents:[[-.4,-.4],[.4,.1]]}),
 weapon:(B,J)=>{const L=(J.st==='C'?17:J.st==='A'?14:16)*J.sc;blade(B,J.hB,-.85,L,1,J.st);blade(B,J.hF,-2.3,L,1,J.st)},
 front:(B,J)=>{if(J.st!=='A')shackle(B,J.hF,J.st,3)}};

/* ================= 門のぬし ================= */
function lordHelm(B,J){const{ox,hc,H,st,sc}=J,cx=ox-.5,w=H*(st==='C'?.52:.55),h=H*.56;
 /* 角：門のアーチ。根元は兜の帯から */const hr=R.lArm[st];for(const s of[-1,1]){const pts=[];const n=12;for(let i=0;i<=n;i++){const t=i/n,a=t*Math.PI*.95;pts.push([cx+s*(w*.7+Math.sin(a)*H*.45),hc-h+1-(1-Math.cos(a))*H*.42])}
  let m=new Set();for(let i=0;i<n;i++)m=U(m,mThick(pts[i],pts[i+1],(st==='A'?2:1.7-i/n*.9)*sc));paint(B,m,hr,st);
  if(st!=='A'){/* 角に下がる錠前：かつて門を閉じた鍵 */const lx=Math.round(cx+s*(w*.7+H*.45)),ly=Math.round(hc-h-H*.38);for(let i=0;i<3;i++)B.set(lx,ly+i,R.chain[st][1],2);paint(B,mEll(lx,ly+4.5*sc,1.4*sc,1.2*sc),R.gold[st].map(c=>mx(c,O,.3)),st)}}
 bucket(B,J,R.lArm[st],{band:R.gold[st].map(c=>mx(c,'#2a2030',.35)),glow:'#ff3050',dents:[[-.5,-.2],[.2,.3],[-.1,-.55]]});
 if(st!=='A'){/* ひび：中から押されて割れかけている */const c=R.ink[st][0];[[0,-6],[1,-5],[1,-4],[2,-3]].forEach(([dx,dy])=>B.set(Math.round(cx+w*.5+dx),Math.round(hc+dy*sc*.6),c,2))}}
const LORD={arm:'lArm',cape:'lCape',wide:1.15,
 armF:J=>({hF:[J.ox-J.sw-2*J.sc,J.hip-J.T*.15]}),
 behind:(B,J)=>{/* 背中の鎖：門の封印へ */const{st,sc}=J;for(let i=0;i<3;i++){const a=[J.ox+J.sw-2,J.sh+3*sc+i*4*sc];for(let x=a[0];x<B.w;x+=2){const y=a[1]+Math.sin((x-a[0])/60*Math.PI)*5*sc+i*2;B.set(x,y,((x-a[0])/2|0)%2?R.chain[st][2]:R.chain[st][0],1)}}},
 body:(B,J)=>{const{st,sc,ox,sh,T}=J;tabard(B,J,R.gCloth[st].map(c=>mx(c,'#140a14',.45)),R.gold[st].map(c=>mx(c,'#2a2030',.35)),true);
  /* 胸の封印：金の札。ひびの奥に赤 */const c=[ox,sh+T*.32];paint(B,mEll(c[0],c[1],3.2*sc,2.6*sc),R.gold[st].map(c=>mx(c,'#2a2030',.25)),st);B.set(c[0],c[1],'#ff3050',2);if(st!=='A'){B.set(c[0]-1,c[1]-1,O,2);B.set(c[0]-2,c[1]-2,O,2);B.set(c[0]+1,c[1]+1,O,2)}},
 skirt:(B,J)=>{if(J.st==='A')return;/* マントの裏の目：閉じこめたものがのぞく */const{ox,hip,sc}=J;[[6,2],[8,6],[5,9],[9,11]].forEach(([dx,dy],i)=>{const x=ox+dx*sc,y=hip+dy*sc;if(B.tag(x,y)===1)B.set(x,y,i%2?'#ff3050':'#a01830',2)})},
 helm:lordHelm,
 weapon:(B,J)=>{const{st,sc}=J,L=(st==='C'?30:st==='A'?22:26)*sc,tip=blade(B,J.hF,-1.68,L,1.6*sc,st,R.lArm[st].map(c=>mx(c,'#c0c0d0',.35)));
  /* 鍵の歯 */if(st!=='A')for(let i=0;i<3;i++){const y=J.hF[1]-L*(.6+i*.1);paint(B,mPoly([[tip[0]+2,y],[tip[0]+4*sc,y],[tip[0]+4*sc,y+1.5*sc],[tip[0]+2,y+1.5*sc]]),R.lArm[st].map(c=>mx(c,'#c0c0d0',.35)),st)}
  /* 柄の輪：鍵の頭 */paint(B,mEll(J.hF[0]+.5,J.hF[1]+4*sc,2.4*sc,2.4*sc),R.gold[st].map(c=>mx(c,'#2a2030',.3)),st);B.set(J.hF[0]+.5,J.hF[1]+4*sc,O,2)},
 front:(B,J)=>{if(J.st!=='A')shackle(B,J.hF,J.st,2);/* 足元のくらやみ */const{ox,oy,st,sc}=J;for(let x=Math.round(ox-12*sc);x<ox+16*sc;x++){const h=1+((x*7)%5===0?1:0)+(st==='C'&&x%3===0?1:0);for(let i=0;i<h;i++)B.set(x,oy-i,i?R.ink[st][0]:R.ink[st][1],5)}}};

/* ================= スライム ================= */
function slime(B,ox,oy,st,sc=1){const r=R.slime[st],w=(st==='A'?10:st==='B'?10:11)*sc,h=(st==='A'?9:8)*sc;
 const m=U(mEll(ox,oy-h*.55,w,h*.7),mPoly([[ox-w,oy-h*.5],[ox+w,oy-h*.5],[ox+w+1,oy],[ox-w-1,oy]]));
 if(st==='A'){paint(B,m,r,'A');paint(B,mEll(ox-w*.45,oy-h*.95,w*.25,h*.15),['#ffffff','#ffffff','#ffffff','#ffffff'],'A',2);B.set(ox-3*sc,oy-h*.5,O,2);B.set(ox-3*sc,oy-h*.5+1,O,2);B.set(ox+1*sc,oy-h*.5,O,2);B.set(ox+1*sc,oy-h*.5+1,O,2);return}
 paint(B,m,r,st);
 /* 中に沈んでいるもの：迷宮で倒れた者の、さびた柄と兜のかけら。スライムは倒れた者を溶かして生きる */
 const rust=['#a06040','#7a4830','#5a3424','#3a2018'];
 paint(B,mThick([ox-4*sc,oy-3*sc],[ox+1*sc,oy-6*sc],.8*sc),rust,st==='C'?'C':'B',2);for(let i=-1;i<=1;i++)B.set(ox-1*sc+i,oy-5*sc+i,rust[0],2);
 paint(B,mEll(ox+5*sc,oy-3*sc,2.2*sc,1.6*sc),R.gArm[st].map(c=>mx(c,r[2],.45)),st==='C'?'C':'B',2);
 /* 目：Bは小さく鈍い光（考えていない）。Cは目がない */if(st==='B'){B.set(ox-5*sc,oy-9*sc,'#d8f0a0',2);B.set(ox-2*sc,oy-9*sc,'#d8f0a0',2)}
 if(st==='C'){for(let i=0;i<5;i++)B.set(ox-6*sc+i*3,oy-(4+((i*5)%6))*sc,mx(r[0],'#ffffff',.4),2)}
 B.set(ox-w*.5,oy-h*.95,mx(r[0],'#ffffff',.5),2)}
