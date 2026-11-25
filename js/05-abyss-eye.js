/* ===== 深淵の目：触手が「どの順で来るか」を見せる印。予兆（白い光・高い音）とは形・色・音・速さのすべてを変える
   ・目は攻撃と同じ拍（28F）で順に開き、開いたまま残る。3つ目の次の拍で1本目の予兆。残っている目＝残りの攻撃
   ・その触手の予兆（いつもの白い光）が出た瞬間に目は閉じる。弾く合図は白い光だけ */
const EYE_GAP=12,EYE_HOLD=42,EYE_TIP='開いた目は攻撃の順番　弾く合図はいつもの白い光';
function eyeFoe(){const e=G.en;return!!e&&(e.kind==='lord'||e.key==='gateK')}
function eyeAge(s){if(s.note==null||!eyeFoe()||G.et>=s.cue)return-1;const pg=(G.pings||[]).find(p=>p.note===s.note&&p.at!=null);return pg?G.et-pg.at:-1}
function abyssEye(x,y,age){x=Math.round(x);y=Math.round(y);const g='#b8f04a',h='#f4ffd0',pu='#140a16';/* 合図の色なので、被弾の白フラッシュにも染めない */
 if(age<3){l.fillStyle=OUT;l.fillRect(x-3,y-1,7,3);l.fillStyle=g;l.fillRect(x-2,y,5,1);return}
 l.fillStyle=OUT;l.fillRect(x-2,y-2,5,5);l.fillRect(x-3,y-1,7,3);
 l.fillStyle=g;l.fillRect(x-2,y-1,5,3);l.fillStyle=pu;l.fillRect(x-1,y-1,1,3);l.fillStyle=h;l.fillRect(x+1,y-1,1,1)}
function drawLordBkReady(x,y,A,v,e){if(!A.bk||!G.strikes)return;const R=[x+A.bk[0],y+A.bk[1]],act=new Set(G.strikes.filter(s=>s.mv==='bk'&&!s.cx&&G.et>=s.start&&G.et<=s.impact+12).map(s=>s.ten||0));
 const want=G.strikes.some(s=>s.mv==='bk'&&!s.done&&!s.cx);if(!want)return;
 for(let i=0;i<3;i++){if(act.has(i))continue;const P=bkPoise(R,i),E=[P[0]+Math.sin(G.anim*.09+i*2)*.8,P[1]];lordTent([R,[R[0]+4,R[1]-14],[P[0]+6,P[1]-14],E],2.6,1,v,e,26)}}
function drawLordReach(s,x,y,A,v,e,cur){const fh=[x+A.fh[0],y+A.fh[1]],d=G.et-s.impact,u=Math.min(1,Math.max(0,(G.et-s.start)/16)),H2=[HX+18,FLOOR-16],a=A.fa*Math.PI/180;let E,C;
 if(d>8)return;
 /* 引き戻す剣先は床より下へ行かない（床と間合い） */
 if(d>0){const k=1-d/8,sa=Math.sin(a),Ln=Math.min(20+30*k,sa>0?(FLOOR-1-fh[1])/sa:99);E=[fh[0]+Math.cos(a)*Ln,fh[1]+Math.sin(a)*Ln];C=lerp2(fh,E,.5)}
 else if(d>=-3){const t=(d+3)/3,hi=[fh[0]-20,fh[1]-46];E=lerp2(hi,H2,t*t);C=[(fh[0]+E[0])/2,Math.min(fh[1],E[1])-26*(1-t*.6)]}
 else{const Ln=18+22*u,a2=-76*Math.PI/180;E=[fh[0]+Math.cos(a2)*Ln,fh[1]+Math.sin(a2)*Ln];C=lerp2(fh,E,.5)}
 const N=26,pts=[];for(let i=0;i<=N;i++){const t=i/N,u2=1-t;pts.push([u2*u2*fh[0]+2*u2*t*C[0]+t*t*E[0],u2*u2*fh[1]+2*u2*t*C[1]+t*t*E[1]])}
 for(let i=0;i<N;i++){lineP(pts[i][0],pts[i][1]+1,pts[i+1][0],pts[i+1][1]+1,OUT);lineP(pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],v==='w'?'#fff4ee':'#d8e0ee')}
 const ct=nCol('#5e2e74',v,e.tint),cT=nCol('#b07ad0',v,e.tint);for(let i=1;i<N;i+=2){const p2=pts[i],q2=pts[i+1],dx=q2[0]-p2[0],dy=q2[1]-p2[1],L=Math.hypot(dx,dy)||1,o=(i%4<2?1:-1)*1.6;px(p2[0]+dy/L*o,p2[1]-dx/L*o,i%6<3?ct:cT);px(p2[0]+dy/L*o*.5,p2[1]-dx/L*o*.5,ct)}
 if(s===cur)G.lordTip={x:Math.round(E[0]),y:Math.round(E[1])}}
function drawLordMaw(s,x,y,A,v,e){const c=[x+A.ch[0],y+A.ch[1]+2],d=G.et-s.impact,k=G.et-s.cue;let o;
 if(d>4)o=Math.max(0,.3-(d-4)/20);else if(d>=0)o=d<2?1:.3;else if(k>=0)o=.85+Math.sin(G.anim*.5)*.08;else o=Math.min(.6,(G.et-s.start)/24);
 if(o<=.02)return;const w=Math.round(1+4*o),h=Math.round(4+9*o);
 for(let yy=-h;yy<=h;yy++){const ww=Math.round(w*Math.sqrt(Math.max(0,1-(yy*yy)/(h*h+.01))));l.fillStyle=OUT;l.fillRect(c[0]-ww-1,c[1]+yy,ww*2+3,1);l.fillStyle='#3a0618';l.fillRect(c[0]-ww,c[1]+yy,ww*2+1,1);if(ww>1){l.fillStyle='#0b0510';l.fillRect(c[0]-ww+1,c[1]+yy,ww*2-1,1)}if(yy%2===0&&ww>0){px(c[0]-ww,c[1]+yy,'#f2ecf6');px(c[0]+ww,c[1]+yy,'#f2ecf6')}}
 px(c[0],c[1]-1,'#ff6ad8');if(o>.5){px(c[0],c[1]+2,'#ff6ad8');px(c[0],c[1]-4,'#e0b0ff')}}
function lordTip(e,fr,x,y){const A=LANC[fr]||LANC.lA_idle,s=G.state==='enemy'&&G.strikes&&G.strikes.find(s=>!s.done);
 if(s&&(s.mv==='arm'||s.mv==='bk'||s.mv==='reach')&&G.lordTip)return G.lordTip;
 if(s&&s.mv==='cut2')return{x:x+A.bh[0]+2,y:y+A.bh[1]-2};
 if(s&&s.mv==='maw')return{x:x+A.ch[0],y:y+A.ch[1]};
 if(e.stance&&!s)return{x:x+A.vz[0],y:y+A.vz[1]-8};
 return{x:x+A.fs[0],y:y+A.fs[1]}}
function drawLordFx(e,x,y,v){const fr=lordFrame(e),A=LANC[fr]||LANC.lA_idle;G.lordTip=null;
 if(!G.ko&&e.skin!=='R'){const ns=G.state==='enemy'&&G.strikes.find(s=>!s.done),k=ns&&G.et>=ns.start?Math.max(0,1-Math.abs(G.et-ns.cue)/10):0,ct=nCol('#4a2260',v,e.tint),cT=nCol('#9a62b4',v,e.tint);
  for(let j=0;j<3;j++){const rx=x+A.vz[0]-2+j*2,ry=y+A.vz[1],L=4+(j%2)*3;for(let i=0;i<L;i++){const f=i/L,sw=Math.sin(G.anim*.06+j*1.9+i*.45)*f*1.4,cu=-k*f*f*(5+j*2);px(Math.round(rx+sw+cu),ry+Math.round(i*(1-.3*k)),i===L-1?cT:ct)}}}
 if(G.state==='enemy'&&G.strikes){const cur=G.strikes.find(s=>!s.done);
  for(const s of G.strikes){if(s.fake||s.cx)continue;const d=G.et-s.impact;if(G.et<s.start||d>12)continue;
   if(s.mv==='arm')drawLordArm(s,x,y,A,v,e,cur);else if(s.mv==='bk')drawLordBk(s,x,y,A,v,e,cur);else if(s.mv==='reach')drawLordReach(s,x,y,A,v,e,cur);else if(s.mv==='maw')drawLordMaw(s,x,y,A,v,e)}
  drawLordBkReady(x,y,A,v,e)}
 return lordTip(e,fr,x,y)}
/* 十字の斬撃（打ち返し・見切り返し） */
function drawXSlash(){const X=G.xs;if(!X)return;const t=X.t++;if(t>38){G.xs=null;return}
 const cx=G.ex??EX,cy=FLOOR-30,g=Math.min(1,t/3),fade=t<14?1:Math.max(0,1-(t-14)/24),L=40*g;if(fade<=0)return;l.globalAlpha=fade;
 for(const sg of[1,-1]){const x0=cx-L*.75,y0=cy-L*.75*sg,x1=cx+L*.75,y1=cy+L*.75*sg;lineP(x0,y0-1,x1,y1-1,'#7fe3ff');lineP(x0,y0+1,x1,y1+1,'#7fe3ff');lineP(x0,y0,x1,y1,'#ffffff')}
 if(t<10){for(let i=0;i<6;i++){const a=i*1.05+t*.3,r=8+t*2.4;pxStar(cx+Math.cos(a)*r,cy+Math.sin(a)*r,2,'#fff3b0')}}
 l.globalAlpha=1}
/* ささやき：光が消えるあいだ、画面の縁が紫ににじむ */
function drawWhis(){if(G.state!=='enemy'||!G.strikes||!G.strikes.some(s=>s.nolight&&!s.done))return;const a=.26+.06*Math.sin(G.anim*.15);
 for(let i=0;i<10;i++){l.fillStyle=`rgba(10,8,24,${(a*(1-i/10)).toFixed(3)})`;l.fillRect(i,0,1,LH);l.fillRect(LW-1-i,0,1,LH);l.fillRect(0,i,LW,1);l.fillRect(0,LH-1-i,LW,1)}
 for(let i=0;i<10;i++){const sx=(i*53+G.anim*.4)%LW,sy=(i*29+Math.sin(G.anim*.05+i)*8+LH)%LH;if((G.anim+i*7)%40<20)px(sx,sy,i%2?'#4a4a66':'#7a7a98')}}
/* 撃破：膝をつき、兜が割れ、深淵が抜けていく。残るのは青い飾り紐だけ */
function lordKoStep(K){const t=G.t,e=G.en;K.lord=true;
 if(t===1)K.lordF='clash';
 if(t===16){K.lordF='kneel';SFX.thud(0);shake(P.shake*1.5);for(let i=0;i<14;i++)G.pts.push({x:K.ex-14+Math.random()*28,y:FLOOR,vx:(Math.random()-.5)*1.6,vy:-.3-Math.random()*.8,t:0,life:26,col:'#6a5560',sz:1,drag:.95,g:.05})}
 if(t===40&&e.skin==='R'){SFX.metal();flash(['#ffffff','#5a3a10','#000000'])}
 if(t===40&&e.skin!=='R'){SFX.crack();flash(['#ffffff','#2a0a3a','#000000']);const A=LANC[(e.form==='B'?'lB_':'lA_')+'kneel'],hx=K.ex+A.vz[0],hy=FLOOR+A.vz[1]-8;K.helm=[{x:hx-3,y:hy,vx:-1.1,vy:-2.2},{x:hx+3,y:hy,vx:1.3,vy:-2.6}];K.void={x:hx,y:hy+3};
  for(let i=0;i<24;i++)G.pts.push({x:hx+(Math.random()-.5)*8,y:hy+(Math.random()-.5)*8,vx:(Math.random()-.5)*2,vy:-.8-Math.random()*1.4,t:0,life:40,col:i%3?'#6a3a8a':'#e0b0ff',sz:i%4?1:2,drag:.96,g:-.02})}
 if(K.helm)K.helm.forEach(h=>{h.x+=h.vx;h.y+=h.vy;h.vy+=.16;if(h.y>FLOOR-3){h.y=FLOOR-3;h.vy*=-.3;h.vx*=.6}});
 if(t>40&&t<100&&t%3===0)G.pts.push({x:K.ex-10+Math.random()*20,y:FLOOR-10-Math.random()*36,vx:(Math.random()-.5)*.4,vy:-.5-Math.random()*.6,t:0,life:40,col:e.skin==='R'?(Math.random()<.4?'#fff3b0':'#ffd27a'):Math.random()<.3?'#c89aff':'#4a2260',sz:Math.random()<.3?2:1,drag:.98,g:-.01});
 if(t===70&&e.skin!=='R')SFX.whisper();
 if(t===100){shatter();K.rib={x:K.ex+8,y:FLOOR-24,t:0}}
 if(t>=190)win()}
function drawLordKo(){const K=G.ko;if(!K||!K.lord)return;
 if(K.void&&!K.shattered){const v=K.void;for(let i=0;i<3;i++)disc(v.x+Math.sin(G.anim*.2+i)*1.5,v.y-i*2,3-i*.6,i?'#2a0a3a':'#0b0510');px(v.x-1,v.y,'#ff6ad8');px(v.x+2,v.y-1,'#ff6ad8')}
 if(K.helm)for(const h of K.helm){l.fillStyle=OUT;l.fillRect(Math.round(h.x)-3,Math.round(h.y)-3,7,7);l.fillStyle='#3e3b58';l.fillRect(Math.round(h.x)-2,Math.round(h.y)-2,5,5);px(h.x,h.y-2,'#c8a24a');px(h.x-1,h.y-2,'#c8a24a')}
 if(K.rib&&K.rib.y<FLOOR-1){K.rib.t++;K.rib.y+=.32;K.rib.x+=Math.sin(K.rib.t*.12)*.45}
 if(K.rib){const r=K.rib,sw=Math.sin(r.t*.2);px(r.x,r.y,'#3a5ab0');px(r.x+1,r.y+1+sw,'#3a5ab0');px(r.x+2,r.y+1,'#6a8ae0');px(r.x-1,r.y+1-sw,'#6a8ae0')}}
/* ボスの登場（門のぬしたち以外）：曲が自然に消える→地響き→名前→曲が始まる */
function bintroStep(){const t=++G.t;if(t===1)G.banner=null;
 if(t===50){SFX.thud(1);shake(P.shake*1.4);flash(['#000000','#24070f','#000000'])}
 if(t===58){SFX.thud(0);shake(P.shake*.7)}
 if(t===66){G.banner={s:G.binName||G.en.name,t:0};SFX.rage();shake(P.shake*.5)}
 if(t>=120){G.state='cmd';G.t=0;if(G.binCs&&G.binCs.length){showCards(G.binCs);G.binCs=null}}}
/* 登場：暗闇から足音、門の前で×に構え、名乗る */
function enterStep(){const E=G.enter,t=++E.t;const w=Math.min(1,Math.max(0,(t-16)/64)),ea=1-(1-w)*(1-w);E.dx=E.rise?0:Math.round(120*(1-ea));
 if(E.rise&&t<96&&t%3===0)G.pts.push({x:EX+(Math.random()-.5)*20,y:FLOOR-2-Math.random()*30,vx:(Math.random()-.5)*.4,vy:-.5-Math.random()*.7,t:0,life:36,col:Math.random()<.3?'#c89aff':'#4a2260',sz:Math.random()<.3?2:1,drag:.98,g:-.01});
 if(t<84)E.f=(t>>4)%2?'idle2':'idle';
 if(!E.rise&&(t===24||t===40||t===56||t===72)){SFX.thud(0);shake(P.shake*.5);for(let i=0;i<5;i++)G.pts.push({x:EX+E.dx-6+Math.random()*12,y:FLOOR,vx:(Math.random()-.5)*.8,vy:-.3-Math.random()*.4,t:0,life:18,col:'#4a4058',sz:1,drag:.95,g:0})}
 const RS=G.en.skin==='R';if(t===88)RS?SFX.metal():SFX.whisper();
 if(t===100){E.f='guard';SFX.block();SFX.metal();flash(RS?['#000000','#4a0a10','#000000']:['#000000','#3a1a4a','#000000']);shake(P.shake*.8)}
 if(t===106){G.banner={s:G.en.name,t:0};SFX.rage()}
 if(t>=150){G.state='cmd';G.t=0;G.enter=null;if(E.cs&&E.cs.length)showCards(E.cs)}}

