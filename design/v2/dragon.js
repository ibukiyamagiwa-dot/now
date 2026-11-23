/* ===== くらやみの竜（描き直し 2）=====
   くらやみが「竜のまね」をして、初めて形を持った生き物。機械ではなく、ぬれた肉。
   低く這う姿勢、高い肩、背の扇の翼。あごの下の触手、ずれて並ぶ三つの目、裂けるほど開く口、皮膚の下を這うもの。
   拍は灯りではなく体で見せる：前足の足踏み、尾で床を打つ、のど袋がふくらむ。 */
const DR={
 n:{lbl:'覚悟1 ふつう',name:'くらやみの竜',sk:['#0b0711','#1e1129','#312040','#4c3462','#74549a'],rim:'#a47cd6',bel:['#22182c','#3e2e48','#5c4866','#7a6684'],mem:['#0c0714','#1a0f27','#2a1a3c','#42285a'],vein:'#5e3676',bone:['#3a3040','#76687a','#b0a2ac','#e4d8de'],eye:'#ffd75e',gold:['#5a3e12','#a8822a','#e8c050'],crack:'#3a1a30',weye:0,feel:5,frill:1,smoke:0,drip:1,more:0},
 r:{lbl:'覚悟2 赤い',name:'赤いくらやみの竜',sk:['#100508','#280c16','#3e1622','#5c2434','#84384c'],rim:'#c4626e',bel:['#2a0e14','#4a2228','#683a40','#8a565c'],mem:['#120408','#200a10','#32121c','#4a1a2c'],vein:'#7a2434',bone:['#3e2c30','#7a6264','#b49c9c','#e6d4d2'],eye:'#ffd75e',gold:['#5a3e12','#a8822a','#e8c050'],crack:'#5a1424',weye:1,feel:7,frill:3,smoke:0,drip:2,more:0},
 k:{lbl:'覚悟3 黒い',name:'黒いくらやみの竜',sk:['#030205','#09070c','#141018','#221c29','#352c3e'],rim:'#5e4e78',bel:['#0e0b12','#1a1620','#28222e','#38303e'],mem:['#020103','#06040a','#0e0a14','#18121f'],vein:'#2a2038',bone:['#24202a','#4a4450','#7a727c','#9e96a0'],eye:'#ff4040',gold:['#2e2410','#5a4a24','#8a7640'],crack:'#24101c',weye:2,feel:10,frill:5,smoke:2,drip:3,more:0},
 v:{lbl:'覚悟4 紫の',name:'紫のくらやみの竜',sk:['#0a0418','#1a0a30','#2c1450','#44247a','#6438a8'],rim:'#a676f4',bel:['#20103a','#3a2260','#56387e','#72549a'],mem:['#08021a','#120630','#200c46','#341662'],vein:'#6a34aa',bone:['#3a2a50','#74609a','#ac9ad0','#e0d2f4'],eye:'#ff6ad8',gold:['#3e2a14','#7a5a2a','#b08a44'],crack:'#3a1050',weye:2,feel:12,frill:7,smoke:1,drip:2,more:1}};
const DPAL={body:DR.n.sk[2],hi:DR.n.sk[3],lo:DR.n.sk[1],eye:DR.n.eye};
const DPDEF={wcount:-1,tcount:-1,ccount:-1,x:0,cr:0,nx:0,ny:0,hy:0,jaw:0,wing:0,lift:0,rage:0,dead:0,eyes:3,fl:0,fr:0,tailUp:0,slap:0,sweep:0,sac:0,feel:0,melt:0,quiver:0,twitch:0};
const MK=(x,y)=>(y+1024)*4096+x+1024,UK=k=>[(k%4096)-1024,Math.floor(k/4096)-1024];
function dDisc(m,cx,cy,r,lump,seed){const L=lump||0,s=seed||0;for(let y=Math.floor(cy-r*1.3-1);y<=Math.ceil(cy+r*1.3+1);y++)for(let x=Math.floor(cx-r*1.3-1);x<=Math.ceil(cx+r*1.3+1);x++){const dx=x+.5-cx,dy=y+.5-cy,a=Math.atan2(dy,dx),rr=r*(1+L*(Math.sin(a*5+s)*.6+Math.sin(a*3-s*1.7)*.4));if(dx*dx+dy*dy<=rr*rr)m.add(MK(x,y))}return m}
function dCurve(m,f,r0,r1,N,lump,seed){for(let i=0;i<=N;i++){const t=i/N,p=f(t);dDisc(m,p[0],p[1],typeof r0==='function'?r0(t):lerp(r0,r1,t),lump,(seed||0)+i*.9)}return m}
const cub=(a,b,c,d)=>t=>{const u=1-t;return[u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*c[0]+t*t*t*d[0],u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*c[1]+t*t*t*d[1]]};
const LP=(a,b,t)=>[lerp(a[0],b[0],t),lerp(a[1],b[1],t)];
/* ぬれた肉の陰影：上が明るく、下が暗い。背中側のふちに光。重なりの境目は暗い線で分ける */
function dShade(B,m,R,rim,seamC,useSeam){const has=(x,y)=>m.has(MK(x,y)),out=[];
 for(const k of m){const[x,y]=UK(k);let seam=false;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]])if(useSeam&&!has(x+dx,y+dy)&&B.tag(x+dx,y+dy)===1)seam=true;
  const run=(dx,dy)=>{let n=0;while(n<4&&has(x+dx*(n+1),y+dy*(n+1)))n++;return n},u=run(0,-1),d=run(0,1),l=run(-1,0),r=run(1,0),ul=run(-1,-1);
  let s=0;if(u===0)s+=2;else if(u===1)s+=1;if(ul<=1&&u<=2)s+=1;if(l===0)s+=1;if(d===0)s-=2;else if(d===1)s-=1;if(r===0)s-=1;if(d===2&&u>=3&&((x+y)&1))s-=1;
  let c=s>=3?R[4]:s>=2?R[3]:s>=0?R[2]:s>=-1?R[1]:R[0];if(rim&&r===0&&u<=2&&l>0)c=rim;if(seam)c=seamC||R[1];out.push([x,y,c])}
 for(const[x,y,c]of out)B.set(x,y,c,1);return m}
function dTent(B,pts,r0,r1,R,rim,sm){const m=new Set();for(let i=0;i+1<pts.length;i++){const N=Math.max(2,Math.ceil(Math.hypot(pts[i+1][0]-pts[i][0],pts[i+1][1]-pts[i][1])));for(let j=0;j<=N;j++){const t=(i+j/N)/(pts.length-1);dDisc(m,lerp(pts[i][0],pts[i+1][0],j/N),lerp(pts[i][1],pts[i+1][1],j/N),lerp(r0,r1,t))}}return dShade(B,m,R,rim,null,sm)}
function dClr(B,x,y){x=Math.round(x);y=Math.round(y);if(x<0||y<0||x>=B.w||y>=B.h)return;const i=y*B.w+x;B.c[i]=0;B.t[i]=0}
const hsh=(x,y)=>{const s=Math.sin(x*127.1+y*311.7)*43758.5453;return s-Math.floor(s)};

function drawDragon(B,ox,oy,S,P0,T){const P=Object.assign({},DPDEF,S.pose||{});for(const[a,v]of Object.entries(P0||{}))if(v!==undefined&&!(typeof v==='number'&&!isFinite(v)))P[a]=v;
 const k=S.k||1,D=DR[P.tint||S.tint||'n'],dd=Math.max(0,Math.min(1,P.dead)),rg=P.rage>0,fd=c=>dd>0?mix(c,'#07040b',.3*dd):c;
 const SK=D.sk.map(fd),BE=D.bel.map(fd),ME=D.mem.map(fd),BO=D.bone.map(fd),FAR=a=>a.map(c=>mix(c,'#000000',.4)),rim=dd>.5?null:fd(D.rim);
 const bx=ox+P.x*k,br=Math.sin(T*.07)*(1-dd),qv=P.quiver?Math.sin(T*1.7)*P.quiver:0;
 const wl=x=>Math.max(0,Math.min(1.2,(14-x)/34)),Q=(x,y)=>[bx+(x+qv)*k,oy+(y+P.cr*(y<-6?.7:.25)-P.lift*wl(x)+dd*Math.max(0,-y-4)*.5)*k];
 const tops=[],J={k,D,dead:dd};
 /* ===== 背の扇の翼（奥）：膜の内側がこちらを向く。膜の目、ふちから垂れる細い触手 ===== */
 const wg=lerp(P.wing,-1.7,dd),W=Q(-1,-41-4*wg+br*.6),S0=Q(-5,-27),A=[Q(19,-22),Q(9,-27)];
 const TP=[[-15,-53,8],[-1,-63,10],[14,-61,9],[27,-51,7],[33,-37,4]].map(([x,y,a],i)=>Q(x+Math.sin(T*.03+i)*.4,y-a*wg));
 const SC=[];for(let i=0;i<4;i++)SC.push(LP(LP(TP[i],TP[i+1],.5),W,.36));SC.push(LP(LP(TP[4],A[0],.5),W,.24));
 const wp=[W,TP[0],SC[0],TP[1],SC[1],TP[2],SC[2],TP[3],SC[3],TP[4],SC[4],A[0],A[1],S0],wm=B.mask(wp),md=Math.max(...TP.map(t=>Math.hypot(t[0]-W[0],t[1]-W[1])));
 const segd=(p,a,b)=>{const vx=b[0]-a[0],vy=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*vx+(p[1]-a[1])*vy)/(vx*vx+vy*vy)));return Math.hypot(p[0]-a[0]-vx*t,p[1]-a[1]-vy*t)};
 for(const key of wm){const[x,y]=UK(key),p=[x+.5,y+.5],nb=Math.min(...TP.map(t=>segd(p,W,t))),dw=Math.hypot(p[0]-W[0],p[1]-W[1])/md;B.set(x,y,dw>.8?ME[0]:nb<1.8?ME[3]:nb<3.4?ME[2]:ME[1],1)}
 /* 膜の血管：骨から枝分かれ */for(let i=0;i<5;i++){const a=LP(W,TP[i],.45),b=SC[i],c=LP(a,b,.55);B.line(a[0],a[1],c[0],c[1],fd(D.vein),1);B.line(c[0],c[1],c[0]+(b[0]-a[0])*.3+1,c[1]+(b[1]-a[1])*.3,fd(D.vein),1);const a2=LP(W,TP[i],.75);if(i<4){const c2=LP(a2,SC[i],.4);B.line(a2[0],a2[1],c2[0],c2[1],fd(D.vein),1)}}
 /* 破れ */for(const[i,s,r]of[[0,.7,1],[1,.62,1.5],[2,.8,1],[3,.66,1.2]]){const p=LP(W,SC[i],s),rr=r+D.more*.8+(D.frill>4?.5:0);for(let y=-2;y<=2;y++)for(let x=-2;x<=2;x++)if(x*x+y*y*1.4<=rr*rr)dClr(B,p[0]+x,p[1]+y)}
 /* ふちのぎざぎざ */for(let i=0;i<5;i++)for(let s=.1;s<.92;s+=.13){const a=i<4?TP[i]:TP[4],b=SC[i],p=LP(a,b,s);if(hsh(i,s*9)>.45){dClr(B,p[0],p[1]+1);dClr(B,p[0]+1,p[1]+1)}}
 /* 腕と指（肉）、先は骨のとげ */dTent(B,[S0,LP(S0,W,.5),W],2.6,1.8,SK,rim);for(const t of TP){const m1=LP(W,t,.55);dTent(B,[W,[m1[0]-1,m1[1]-1],LP(W,t,.78)],1.6,.9,SK,rim);dTent(B,[LP(W,t,.74),t],1,.4,BO)}
 tops.push(...TP.map(t=>t[1]));
 /* 膜の目：のまれるほど開く。こちらを見る */if(dd<.5)for(let i=0;i<3;i++){const p=LP(LP(LP(W,TP[i+1],.55),LP(W,TP[i+2],.55),.5),W,.05),x=Math.round(p[0]),y=Math.round(p[1]),bl=((T>>1)+i*37)%97<4,cnt=P.wcount>=0,lv=cnt?(i<P.wcount?3:0):bl?0:D.weye;
  B.line(x-1,y-1,x+1,y-1,fd(D.vein),1);if(lv===3){B.line(x-2,y-1,x+2,y-1,fd(D.vein),1);B.line(x-2,y,x+2,y,D.eye,2);B.set(x,y,'#120008',2);B.line(x-1,y+1,x+1,y+1,mix(D.eye,'#000000',.45),2)}else if(lv===0){B.line(x-1,y,x+1,y,ME[0],1)}else if(lv===1){B.set(x-1,y,ME[0],1);B.set(x,y,D.eye,2);B.set(x+1,y,ME[0],1)}else{B.set(x-1,y,D.eye,2);B.set(x,y,D.eye,2);B.set(x+1,y,mix(D.eye,'#000000',.4),2);B.set(x-1,y,'#100008',2);B.set(x,y+1,ME[0],1)}}
 /* ふちから垂れる細い触手（覚悟で長くなる） */if(dd<.8)for(let i=0;i<5;i++){const a=SC[i],L=D.frill+(i%2),sw=Math.sin(T*.05+i*1.9)*1.5;const pts=[a,[a[0]+sw*.5,a[1]+L*.5],[a[0]+sw,a[1]+L]];for(let j=0;j<L;j++){const q=LP(pts[0],pts[2],j/L);B.set(q[0]+Math.sin(j*.8+T*.06+i)*.8,q[1],j<L-1?ME[2]:ME[3],1)}}
 /* ===== 奥の脚 ===== */
 const lift=Math.max(0,P.lift-6)*.9,legHind=(hx,ft,R,thr)=>{const H=Q(hx,-17),F=[bx+ft*k-dd*4,oy],Kn=[lerp(H[0],F[0],.5)-6*k,lerp(H[1],F[1],.45)],An=[F[0]+4*k,F[1]-4*k];
   dDisc(new Set(),0,0,0);const m=new Set();dDisc(m,H[0],H[1],thr*k,.06,hx);dCurve(m,t=>LP(H,Kn,t),thr*.7*k,2.6*k,8);dCurve(m,t=>LP(Kn,An,t),2.6*k,1.9*k,8);dCurve(m,t=>LP(An,F,t),1.9*k,1.4*k,5);dShade(B,m,R,R===SK?rim:null,null,R===SK);
   for(let i=0;i<3;i++){const c=[F[0]-1-i*2.2,F[1]];B.line(c[0],c[1]-1,c[0]-2,c[1],BO[2],1);B.set(c[0]-2,c[1],BO[3],1)}};
 const legFront=(sx,fx,up,R,thr)=>{const Sh=Q(sx,-21),F=[bx+fx*k-up*2-dd*6,oy-up*11*k-lift*k],El=[lerp(Sh[0],F[0],.45)+6*k,lerp(Sh[1],F[1],.5)-2*k],Wr=[F[0]+2.5*k,F[1]-3*k];
   const m=new Set();dDisc(m,Sh[0],Sh[1],thr*k,.06,sx);dCurve(m,t=>LP(Sh,El,t),thr*.7*k,2.4*k,8);dCurve(m,t=>LP(El,Wr,t),2.4*k,1.8*k,8);dDisc(m,Wr[0],Wr[1],2*k);dShade(B,m,R,R===SK?rim:null,null,R===SK);
   /* 長すぎる四本の指 */for(let i=0;i<4;i++){const e=[F[0]-5*k+i*1.6*k,F[1]+(up>.2?-1+i*.8:0)],c=R===SK?BO:FAR(BO);dTent(B,[Wr,LP(Wr,e,.6),e],.8,.5,R);B.set(e[0]-1,e[1],c[3],1);B.set(e[0]-2,e[1]+(up>.2?1:0),c[2],1)}return F};
 legHind(16,14,FAR(SK),5);const FF=legFront(-8,-14,P.fr,FAR(SK),4);
 /* ===== 尾：床をなでて、先が三つに裂ける。途中に門の要石が肉に埋まっている ===== */
 const tb=Q(17,-19),rest=Q(37,-38+Math.sin(T*.04)*2),UP=Q(26,-58),SL=[bx+28*k,oy-1],SW=[HXX+16,oy-3],LM=[bx+52*k,oy-2];
 let tip=rest;tip=LP(tip,UP,P.tailUp);tip=LP(tip,SL,P.slap);tip=LP(tip,SW,P.sweep);tip=LP(tip,LM,dd);tip=[tip[0]-P.twitch*3,tip[1]-P.twitch*7];
 const c1=LP(LP(Q(32,-10),Q(30,-2),P.sweep),Q(32,-6),dd),c2=[lerp(c1[0],tip[0],.5)+6*(1-P.sweep)*(1-dd)*(1-P.slap),lerp(c1[1],tip[1],.6)+(P.slap>.5?-8*P.slap:0)];
 const tf0=cub(tb,c1,c2,tip),wv=(1-dd)*(1-P.sweep)*(1-P.slap),tf=t=>{const p=tf0(t),q=tf0(Math.min(1,t+.02)),a=Math.atan2(q[1]-p[1],q[0]-p[0])+1.57,o=Math.sin(T*.06-t*5)*1.6*t*wv;return[p[0]+Math.cos(a)*o,p[1]+Math.sin(a)*o]};
 {const m=new Set();dCurve(m,tf,t=>(5.6-4.4*t)*k,0,36,.04,3);dShade(B,m,SK,rim);
  for(let i=1;i<9;i++){const t=i/10,p=tf(t),q=tf(t+.02),a=Math.atan2(q[1]-p[1],q[0]-p[0])-1.57,L=(3.2-t*2.4)*k,r=(5.6-4.4*t)*k;const b=[p[0]+Math.cos(a)*(r-.5),p[1]+Math.sin(a)*(r-.5)];if(i!==5)dTent(B,[b,[b[0]+Math.cos(a+.5)*L,b[1]+Math.sin(a+.5)*L]],.9,.3,BO)}
  /* 要石：門のアーチのいちばん上の石。肉に半分埋まっている */{const p=tf(.68),q=tf(.7),a=Math.atan2(q[1]-p[1],q[0]-p[0]),L=v=>add(p,rot(v,a)),G=['#2a2632','#5a5466','#8a8498','#b8b2c4'].map(fd);B.poly([L([-2.2,-2]),L([2.2,-2]),L([3.2,-6.4]),L([-3.2,-6.4])],G[1],G[3],G[0]);B.line(...L([0,-3]),...L([0,-5.6]),G[0],1);for(const s of[-2.6,2.6]){const e=L([s,-2.4]);B.set(e[0],e[1],SK[3],1)}const e=L([0,-1.6]);B.set(e[0],e[1],SK[3],1)}
  /* 先は三つに裂けた触手 */const te=tf(1),tq=tf(.96),ta=Math.atan2(te[1]-tq[1],te[0]-tq[0]);J.tendrils=[];for(let i=-1;i<=1;i++){const a=ta+i*.7+Math.sin(T*.08+i)*.25*(1-dd),L=(4+(i===0?1.5:0)+D.more*2)*k,m1=[te[0]+Math.cos(a)*L*.5,te[1]+Math.sin(a)*L*.5],e=[m1[0]+Math.cos(a+.6*Math.sin(T*.06+i))*L*.5,m1[1]+Math.sin(a+.6*Math.sin(T*.06+i))*L*.5];dTent(B,[te,m1,e],1.1,.35,SK);J.tendrils.push(e)}
  J.tail=te}
 /* ===== 胴：肩が高く、あばらが浮く。ぬれた光 ===== */
 const tor=new Set();dDisc(tor,...Q(-11,-20),(8.2+br*.4)*k,.05,1);dDisc(tor,...Q(-4,-24),8.4*k,.05,2);dDisc(tor,...Q(4,-20),7.2*k,.05,3);dDisc(tor,...Q(13,-19),7*k,.05,4);dShade(B,tor,SK,rim);
 {const has=(x,y)=>tor.has(MK(x,y));for(const key of tor){const[x,y]=UK(key);if(B.tag(x,y)!==1)continue;let d=0;while(d<5&&has(x,y+d+1))d++;if(d<4&&x<bx+17*k&&B.get(x,y)!==SK[0]){const f=(x+Math.round(y*.3))%3===0;B.set(x,y,d===0?BE[0]:f?BE[1]:d===1?BE[1]:d===2?BE[2]:BE[3],1)}}}
 /* あばら：息にあわせて動く */for(let i=0;i<4;i++){const x0=-7+i*5+br*.3,f=t=>Q(x0-t*3,-27+t*12+Math.abs(i-1.5)*.5);for(let t=.08;t<.86;t+=.06){const p=f(t),x=Math.round(p[0]),y=Math.round(p[1]);if(B.get(x,y)===SK[2]||B.get(x,y)===SK[3]){B.set(x,y,SK[1],1);if(B.get(x-1,y)===SK[2])B.set(x-1,y,SK[3],1)}}}
 /* 胴の三つの筋：ふだんは閉じた目のすじ。尾の技では、床を打つたびに後ろから一つずつ開く */for(let i=0;i<3;i++){const p=Q([9,2,-5][i],[-25,-27,-25][i]).map(Math.round),x=p[0],y=p[1],op=P.tcount>i;
  B.line(x-2,y-1,x+2,y-1,SK[0],1);B.line(x-1,y-2,x+1,y-2,SK[3],1);if(op){B.line(x-2,y,x+2,y,D.eye,2);B.set(x,y,'#120008',2);B.line(x-1,y+1,x+1,y+1,mix(D.eye,'#000000',.45),2);B.set(x,y+1,'#120008',2)}else{B.line(x-2,y,x+2,y,SK[0],1);B.line(x-1,y+1,x+1,y+1,SK[1],1)}}
 /* いぼ、ぬれた光 */for(const[x,y]of[[-9,-26],[-3,-29],[6,-25],[12,-24],[-14,-24]]){const p=Q(x,y);if(B.get(Math.round(p[0]),Math.round(p[1]))){B.set(p[0],p[1],SK[3],1);B.set(p[0],p[1]+1,SK[1],1)}}
 if(dd<.5)for(const[x,y]of[[-6,-31],[-5,-31],[3,-27]]){const p=Q(x,y);if(B.tag(Math.round(p[0]),Math.round(p[1]))===1)B.set(p[0],p[1],mix(SK[4],'#ffffff',.45),1)}
 /* ===== 手前の後ろ脚 ===== */legHind(12,10,SK,6.8);
 /* ===== 首：弓なりに上がって、頭は低く前へ。のどの板、埋まった金のかせ、のど袋 ===== */
 const Hb=dd>0?LP(Q(-27-P.nx,-18+P.ny),[bx-32*k,oy-5],dd):Q(-27-P.nx,-18+P.ny),N0=Q(-13,-25),N1=LP(Q(-16-P.nx*.2,-39+P.ny*.1),Q(-18,-14),dd),N2=LP(Q(-25-P.nx*.6,-33+P.ny*.6),Q(-28,-8),dd),nf=cub(N0,N1,N2,Hb),nr=t=>(6.6-2.6*t)*k;
 const nm=new Set();dCurve(nm,nf,nr,0,40,.05,5);
 /* 皮膚の下を這うもの */const cp=(T%240)/70;if(cp<1&&dd<.3){const p=nf(cp),q=nf(Math.min(1,cp+.02)),a=Math.atan2(q[1]-p[1],q[0]-p[0])-1.57;dDisc(nm,p[0]+Math.cos(a)*(nr(cp)-1),p[1]+Math.sin(a)*(nr(cp)-1),2.2*k)}
 dShade(B,nm,SK,rim,null,true);
 const nrm=t=>{const p=nf(t),q=nf(Math.min(1,t+.02)),pp=nf(Math.max(0,t-.02)),a=Math.atan2(q[1]-pp[1],q[0]-pp[0]);return[p,[Math.sin(a),-Math.cos(a)],a]};
 /* のどの板（下側） */for(let i=2;i<38;i++){const t=i/40,[p,n]=nrm(t),dn=n[1]>0?n:[-n[0],-n[1]];for(let j=1;j<=2;j++){const q=[p[0]+dn[0]*(nr(t)-j),p[1]+dn[1]*(nr(t)-j)];if(B.tag(Math.round(q[0]),Math.round(q[1]))===1)B.set(q[0],q[1],i%3===0?BE[1]:j===1?BE[2]:BE[3],1)}}
 /* 首の背のとげ */for(let i=1;i<7;i++){const t=i/7.5,[p,n]=nrm(t),up=n[1]<0?n:[-n[0],-n[1]],r=nr(t),b=[p[0]+up[0]*(r-.5),p[1]+up[1]*(r-.5)],L=(3.2-t*1.2)*k*(1-dd*.5);dTent(B,[b,[b[0]+up[0]*L+1.6*L*.4,b[1]+up[1]*L]],.9,.3,BO)}
 /* 金のかせ：昔ぬしがつないだ輪。肉が両側から盛り上がって、埋まっている。片側で割れている */{const t=.34,[c,n,a]=nrm(t),r=nr(t),G=D.gold.map(fd),tg=[Math.cos(a),Math.sin(a)];
  for(const s of[-2.4,2.4]){const m=new Set();dDisc(m,c[0]+tg[0]*s,c[1]+tg[1]*s,r+1,.08,s);dShade(B,m,SK,rim)}
  for(let q=0;q<6.28;q+=.07){if(q>3.6&&q<4.4)continue;const p=[c[0]+n[0]*Math.cos(q)*(r+.4)+tg[0]*Math.sin(q)*1.4,c[1]+n[1]*Math.cos(q)*(r+.4)+tg[1]*Math.sin(q)*1.4];if(Math.sin(q)>.55)continue;B.set(p[0],p[1],Math.cos(q)>.6?G[2]:Math.cos(q)<-.5?G[0]:G[1],1)}
  for(const q of[.3,1.2,2.5]){const p=[c[0]+n[0]*Math.cos(q)*(r+.4),c[1]+n[1]*Math.cos(q)*(r+.4)];B.set(p[0],p[1]-1,SK[3],1)}const g=[c[0]+n[0]*(r-.6),c[1]+n[1]*(r-.6)];if(dd<.5)B.set(g[0],g[1],'#fff0b0',2)}
 /* のど袋：炎の前にふくらむ。うすい皮の向こうに火が透ける */if(P.sac>.02){const[p,n]=nrm(.6),dn=n[1]>0?n:[-n[0],-n[1]],r=nr(.6),R0=(1.6+P.sac*5.2)*k,c=[p[0]+dn[0]*(r-1+P.sac*2.4),p[1]+dn[1]*(r-1+P.sac*2.4)],m=new Set();dDisc(m,c[0],c[1],R0,.06,T*.2);
  const hot=['#3a0c14','#7a1e1c','#c2402a','#ff7a3a','#ffc070'],sc=P.sac;dShade(B,m,[mix(BE[0],hot[0],sc),mix(BE[1],hot[1],sc),mix(BE[2],hot[2],sc*.85),mix(BE[3],hot[3],sc*.8),mix(BE[3],hot[4],sc*.7)],null);
  for(let i=0;i<3;i++){const a=i*2.1+.4;B.line(c[0],c[1],c[0]+Math.cos(a)*R0*.9,c[1]+Math.sin(a)*R0*.9,mix(BE[0],'#200408',.5),1)}if(sc>.4){B.set(c[0],c[1],'#ffe0a0',1);B.set(c[0]+1,c[1],'#ffc070',1)}J.sac=c}
 /* ===== 頭：低く、前へ。ずれて並ぶ三つの目、裂ける口、あごの下の触手 ===== */
 const hs=1.15*k,ha=P.hy*.02+dd*.35,ja=dd>0?.25*dd:.06+P.jaw*.5+Math.max(0,P.jaw-.7)*1.5,R=v=>add(Hb,rot([v[0]*hs,v[1]*hs],ha)),hg=[2,1],Jw=v=>add(R(hg),rot([(v[0]-hg[0])*hs,(v[1]-hg[1])*hs],ha+ja));
 /* 奥の角 */dTent(B,[R([3,-6]),R([10,-12]),R([7,-19])],1.4,.4,FAR(BO));
 /* 下あご */{const m=new Set();dCurve(m,t=>LP(Jw([1,2.2]),Jw([-15,1.8]),t),t=>(3-1.2*t)*hs,0,14,.04,7);dShade(B,m,SK,rim)}
 if(ja>.04){const m=B.mask([R([3,1]),R([-17,.6]),Jw([-16,1.4]),Jw([3,2])]);for(const key of m){const[x,y]=UK(key);B.set(x,y,(x+y)%5?'#2a0612':'#3e0c1c',1)}
  if(rg)for(let i=0;i<4;i++){const p=LP(R([0,1.5]),Jw([0,2]),.5);B.set(p[0]-i*2,p[1],i%2?'#ff6030':'#ffb060',1)}
  /* 奥の歯の列（開くほど見える） */const rows=P.jaw>.7?3:1;for(let r=0;r<rows;r++)for(let x=-14+r*3;x<=0;x+=2){const p=LP(R([x,.8]),Jw([x,1.8]),.3+r*.2);B.set(p[0],p[1],BO[2+(x&1)],1)}}
 /* 頭蓋と鼻先 */{const m=new Set();dDisc(m,...R([-1,-4]),5.4*hs,.06,8);dCurve(m,t=>LP(R([-4,-3.4]),R([-16,-1.2]),t),t=>(4-1.4*t)*hs,0,14,.04,9);dDisc(m,...R([-7,-6.2]),2.3*hs);dDisc(m,...R([1,-1]),4*hs,.05,10);dShade(B,m,SK,rim,null,true)}
 /* 裂ける口：大きく開くと、口の端がほおの奥まで裂ける */if(P.jaw>.7){const a=R([-2,1.2]),b=R([6,-1]);B.line(a[0],a[1],b[0],b[1],'#2a0612',1);for(let x=-1;x<6;x+=2){const p=LP(a,b,(x+2)/8);B.set(p[0],p[1]-1,BO[3],1);B.set(p[0]+1,p[1]+1,BO[2],1)}}
 /* 歯：ふぞろいの細い歯 */const tl=[2,1,2,1,2,1,1,1],open_=ja>.15;for(let i=0;i<8;i++){const x=-15+i*2;if(!open_&&i%2)continue;for(let j=0;j<tl[i];j++){B.set(...R([x,1.2+j*.9]),j?BO[2]:BO[3],1);if(open_||i%4===2)B.set(...Jw([x+1,1.4-j*.9]),j?BO[2]:BO[3],1)}}B.line(...R([-16,1]),...R([1,1.6]),'#1a040c',1);
 /* 鼻のすじ、鼻の穴、目のくぼみ、ぬれた光 */B.line(...R([-6,-5.2]),...R([-16,-3]),SK[3],1);B.set(...R([-15,-2]),SK[0],1);B.set(...R([-14,-2.2]),SK[0],1);
 if(dd<.5){B.set(...R([-3,-8.8]),mix(SK[4],'#ffffff',.5),1);B.set(...R([-11,-5.4]),mix(SK[4],'#ffffff',.35),1)}
 /* 目：大きいのが一つ、小さいのが二つ。ずれて並び、ばらばらにまばたく */const eyes=[[-9,-4.4,2],[-5.4,-6.4,1],[-4.4,-3.2,1]];const ep=eyes.map(([x,y])=>R([x,y]).map(Math.round));eyes.forEach(([x,y,w],i)=>{const[px,py]=ep[i];for(let yy=-1;yy<=1;yy++)for(let xx=-1;xx<=w;xx++)B.set(px+xx,py+yy,SK[0],1)});
 {const a=R([-12,-6.2]),b=R([-6,-7.8]);B.line(a[0],a[1],b[0],b[1],SK[4],1);B.line(a[0],a[1]+1,b[0],b[1]+1,SK[3],1)}
 eyes.forEach(([x,y,w],i)=>{const[px,py]=ep[i],open=P.eyes>i&&dd<.95&&!(((T>>1)+i*29+40)%83<3),ec=rg?mix(D.eye,'#ffffff',.3):D.eye,ww=w+(rg&&w===2?1:0);
  for(let j=0;j<ww;j++)B.set(px+j,py,open?ec:SK[1],open?2:1);if(open&&w===2){B.set(px+1,py,'#120008',2);B.set(px,py+1,mix(D.eye,'#000000',.55),2)}});
 /* 手前の角：門のアーチの曲がり方。節のある骨 */{const h=[R([0,-7.6]),R([7,-15]),R([2,-22])];dTent(B,[h[0],LP(h[0],h[1],.6),LP(h[1],h[2],.45),h[2]],1.9*hs,.4,BO,null,true);for(const s of[.2,.36,.52,.68]){const p=bz2(h,s);B.set(p[0],p[1],BO[0],1);B.set(p[0]+1,p[1],BO[1],1)}tops.push(h[2][1])}
 /* ほおと後頭部の小さなとげ */for(const[a,b]of[[[4,-3],[8,-2]],[[3,-6],[7,-7]],[[2,1],[6,2.5]]])dTent(B,[R(a),R(b)],.8,.3,BO);
 /* あごの下の触手：ふだんは垂れて揺れる。のびて刺すこともある */J.feelers=[];const nf_=D.feel,cnt=3+D.more*2;for(let i=0;i<cnt;i++){const s=Jw([-12+i*(10/(cnt-1)),3.6]),sw=Math.sin(T*.07+i*1.7)*1.6*(1-P.feel),L=(nf_+(i%2)*2)*k*(dd>.5?.6:1),
   rest=[s[0]+sw-(rg?2:0)*(i-1),s[1]+L],tgt=[HXX+8+i*2,oy-15+i*3],e=LP(rest,tgt,P.feel),m=[lerp(s[0],e[0],.5)+Math.sin(T*.09+i)*1.2,lerp(s[1],e[1],.5)];dTent(B,[s,m,e],1.1+P.feel*.5,.35+P.feel*.3,SK);J.feelers.push(e)}
 /* くらやみのよだれ */if(dd<.5){const ph=(T*.25+3)%22,p=Jw([-14,3]);for(let j=0;j<Math.min(ph,7);j++)B.set(p[0],p[1]+j,j>4?D.sk[1]:D.sk[2],1)}
 /* ===== 手前の前脚 ===== */const NF=legFront(-10,-18,P.fl,SK,5.4);
 /* ===== ひび：ふだんは古い傷あと。怒ると皮が裂けて、中の赤が光る（光の赤＝重い） ===== */
 /* 三本の大きな傷：尾の側から順に、肩、首。炎の前に一度消え、拍ごとに一本ずつ赤がたまる */const cr=[[[11,-26],[13,-21],[10,-16]],[[0,-31],[2,-26],[0,-21],[3,-16]],[[-12,-28],[-15,-23],[-12,-18]],[[-6,-18],[-8,-14]]];cr.forEach((c,ci)=>{const pts=c.map(p=>Q(...p)),on=rg&&(P.ccount<0||(ci<3&&ci<P.ccount)),full=P.ccount>=0&&ci<P.ccount;for(let i=0;i+1<pts.length;i++){B.line(...pts[i],...pts[i+1],on?'#ff4a3a':fd(D.crack),1);if(on&&full){const w=LP(pts[i],pts[i+1],.5);B.set(w[0]+1,w[1],'#ff4a3a',1)}if(on){const m=LP(pts[i],pts[i+1],.5);B.set(m[0],m[1],'#ffc070',1);B.set(m[0]-1,m[1],SK[3],1)}}});
 if(rg&&(P.ccount<0||P.ccount>=3)){for(const t of[.3,.55,.8]){const[p]=nrm(t);B.line(p[0]-1,p[1]-2,p[0]+1,p[1]+1,'#ff4a3a',1);B.set(p[0],p[1],'#ffc070',1)}}
 /* ===== 紫の段：目が体じゅうに増える（上位の存在の視線） ===== */
 if(D.more&&dd<.5){const sp=[nf(.22),nf(.5),nf(.72),Q(-12,-16),tf(.3),tf(.55)];sp.forEach((p,i)=>{const o=((T>>1)+i*41)%71>3,x=Math.round(p[0]),y=Math.round(p[1]);B.set(x-1,y-1,SK[1],1);B.set(x,y-1,SK[1],1);B.set(x+1,y-1,SK[1],1);if(o){B.set(x-1,y,D.eye,2);B.set(x,y,'#120008',2);B.set(x+1,y,D.eye,2)}else B.line(x-1,y,x+1,y,SK[0],1)})}
 /* ===== 黒い段から：背から、くらやみがのぼる ===== */
 if(D.smoke&&dd<.5){for(let i=0;i<10*D.smoke;i++){const s=(i*37%100)/100,b=LP(LP(Q(-6,-30),Q(14,-24),s),Q(4,-31),.2),ph=(T*.35+i*13)%18,x=b[0]+Math.sin(ph*.4+i)*1.3,y=b[1]-ph-2;if(!B.get(Math.round(x),Math.round(y)))B.set(x,y,ph<9?INK.hi:INK.col,4)}}
 /* しずく：腹とあごから */if(dd<.5)for(let i=0;i<D.drip;i++){const p=[Q(-6,-12),Q(6,-13),Jw([-8,4])][i%3],ph=(T*.4+i*23)%26,y=p[1]+ph*.7;if(y<oy-1){B.set(p[0],y,D.sk[2],4);if(ph>3)B.set(p[0],y-1,D.sk[1],4)}}
 /* ===== 溶ける／形になる：melt=1で床のくらやみだけ。上から消え、境目は液のしずく ===== */
 if(P.melt>0){const yT=oy-76*(1-P.melt);for(let y=0;y<B.h;y++)for(let x=0;x<B.w;x++){const i=y*B.w+x;if(B.t[i]!==1&&B.t[i]!==2)continue;const h=hsh(x,y);if(y<yT-h*3)dClr(B,x,y);else if(y<yT+3+h*2){B.c[i]=h<.5?INK.hi:INK.col;B.t[i]=1}}
  for(let x=Math.round(bx-30*k);x<bx+40*k;x++){const w=Math.sin((x-bx)*.15+T*.1);if(P.melt>.05&&B.get(x,oy-1)===0&&hsh(x,1)<.85)B.set(x,oy-1,w>0?INK.hi:INK.col,1)}}
 Object.assign(J,{hip:Q(13,-19),sc:Q(-4,-30),top:Math.min(...tops),head:R([-6,-4]),mouth:R([-16,1.5]),chest:Q(-5,-21),foot:NF,ffoot:FF,k});return J}
function bz2(h,t){const u=1-t;return[u*u*h[0][0]+2*u*t*h[1][0]+t*t*h[2][0],u*u*h[0][1]+2*u*t*h[1][1]+t*t*h[2][1]]}

/* 三つ首：亡骸＋裂け目＋三本の指 */
function drawHydra(B,ox,oy,S,P0,T){const P=Object.assign({},DPDEF,{f0:0,f1:0,f2:0,rift:1,j0:0,j1:0,j2:0,lit:[0,0,0],curl:0},S.pose||{},P0||{}),k=S.k||1;
 const J=drawDragon(B,ox,oy,{k,pose:{},tint:S.tint},{dead:1,x:P.x,tint:P.tint},T);const c=add(J.chest,[0,-3*k]),rw=7*k*P.rift,rh=9*k*P.rift;
 /* 裂け目：触手に縁どられた、門のアーチと同じ形 */if(P.rift>0){for(let y=-rh;y<=rh;y++)for(let x=-rw;x<=rw;x++){if((x*x)/(rw*rw)+(y*y)/(rh*rh)<=1)B.set(c[0]+x,c[1]+y,((x+y+(T>>2))%7)?'#120a1c':'#3a1a5a',1)}
  for(let a=0;a<6.28;a+=.25){const p=[c[0]+Math.cos(a)*rw,c[1]+Math.sin(a)*rh],o=dir(a+Math.sin(T*.07+a*3)*.4,3*k);B.thick(p,add(p,o),1*k,INK.col,INK.hi,INK.lo)}}
 /* 三本の指：付け根は裂け目のふちに一列。節は3つ、先は白い爪、真ん中がいちばん長い */
 const fin=[];for(let i=0;i<3;i++){if(P.curl>=1)break;const L=(i===1?40:33)*k*(1-P.curl*.75),ext=P['f'+i]||0,root=[c[0]-1*k,c[1]+(-5+i*5)*k],baseA=-2.55+i*.5+Math.sin(T*.05+i*2)*.06,curlA=P.curl*2.4,
   rest=[root[0]+Math.cos(baseA-curlA)*L,root[1]+Math.sin(baseA-curlA)*L],tip=ext>0?[lerp(rest[0],HXX_+10,ext),lerp(rest[1],FL_-14-i*2,ext)]:rest,
   m1=[lerp(root[0],tip[0],.35)+Math.cos(baseA+1.2)*6*k,lerp(root[1],tip[1],.35)+Math.sin(baseA+1.2)*6*k],m2=[lerp(root[0],tip[0],.7)+Math.cos(baseA-1.2)*5*k,lerp(root[1],tip[1],.7)+Math.sin(baseA-1.2)*5*k];
  /* 首：S字。付け根が太く、先へ細る */const pts=[];for(let s=0;s<=1;s+=.04){const u=1-s;pts.push([u*u*u*root[0]+3*u*u*s*m1[0]+3*u*s*s*m2[0]+s*s*s*tip[0],u*u*u*root[1]+3*u*u*s*m1[1]+3*u*s*s*m2[1]+s*s*s*tip[1]])}
  for(let n=0;n+1<pts.length;n++)B.thick(pts[n],pts[n+1],(3.6-n/pts.length*1.6)*k,'#4e4460','#7e7494','#241e30');
  /* 節は3つ（指の関節）。横じわは細く */for(const q of[8,16,24]){const p=pts[q];if(!p)continue;for(let d=-2.5;d<=2.5;d+=.5)B.set(p[0]+d*.35,p[1]+d*.9,'#241e30',2)}
  /* 頭（指先）：あご・歯・目。角に見えるのは平たい白い爪 */const ang=Math.atan2(tip[1]-pts[pts.length-3][1],tip[0]-pts[pts.length-3][0]),R=v=>add(tip,rot(v,ang)),jw=P['j'+i]||0;
  B.poly([R([-3*k,-3.5*k]),R([7*k,-2*k]),R([9*k,-.5*k]),R([-2*k,1*k])],'#5e5272','#8e84a8','#241e30');B.poly([R([-1*k,.8*k]),R([8*k,1*k+jw*3.5*k]),R([-1*k,3.5*k])],'#463c56','#766c8c','#241e30');
  if(jw>.2)for(let n=0;n<3;n++){B.set(...R([(1+n*2.4)*k,.4*k]),'#e8e0d0',2);B.set(...R([(1+n*2.4)*k,(1.6+jw*2.4)*k]),'#e8e0d0',2)}
  B.poly([R([-3*k,-3.4*k]),R([2*k,-4.6*k]),R([5*k,-3.2*k]),R([0,-2.4*k])],'#e8e0d0','#ffffff','#a8a090');
  B.set(...R([2.5*k,-1.4*k]),P.lit[i]?'#ffffff':'#ff3050',2);fin.push(R([9*k,0]))}
 J.fingers=fin;J.rift=c;return J}
Object.assign(PDEF,DPDEF,{f0:0,f1:0,f2:0,j0:0,j1:0,j2:0,curl:0,rift:1});
SPEC.dragon={name:'くらやみの竜',k:1,draw:drawDragon,pose:{},aura:{r:2,c1:'#22142e',c2:'#1a1024',rim:'#6a3a90'}};
SPEC.hydra={name:'三つ首の竜',k:1,draw:drawHydra,pose:{},aura:{r:3,c1:'#2a1840',c2:'#1e1230',rim:'#c070ff'}};
