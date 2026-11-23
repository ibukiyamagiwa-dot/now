/* ===== くらやみの竜と、三つ首の竜（竜の亡骸・裂け目・指） =====
   竜：門のすき間から最初に漏れ出た、くらやみが初めて形を持った姿。首にちぎれた金のかせ（門のぬしと同じ金）。
   三つ首：竜の亡骸の胸が裂け、裂け目から上位の存在の「指先」が三本出てくる。見た目は三つ首の竜。 */
/* 覚悟で色が変わる（ゲームの tintOf：覚悟2 赤い、3 黒い、4 紫の）。色の段は「のまれていく段階」なので、色だけでなく、のまれた分だけ部品も増える。
   翼の目：閉じている→うす目→開く／くらやみの煙としずく：増える／金のかせ：くすむ→くらやみに埋もれる／紫だけ：目が体じゅうに増え、翼のふちから触手 */
const DTINT={
 n:{rim:'#8a64b0',lbl:'覚悟1 ふつう',name:'くらやみの竜',body:'#34223f',hi:'#5a3e70',lo:'#140c1c',scale:'#21152b',belly:'#46384e',bellyHi:'#665670',stone:'#6e6680',stoneHi:'#a8a0b8',stoneLo:'#3a3446',carve:'#47415a',mem:'#1e1226',memHi:'#3e2856',vein:'#120a1a',claw:'#d8d0c8',clawLo:'#8a8090',eye:'#ffd75e',gold:['#6a4a14','#b8902a','#f0c850'],crack:'#4a2236',weye:0,smoke:1,drip:0,extra:0,bury:0},
 r:{rim:'#b4606e',lbl:'覚悟2 赤い',name:'赤いくらやみの竜',body:'#3a1822',hi:'#62283a',lo:'#18080e',scale:'#2a1018',belly:'#54303a',bellyHi:'#74505a',stone:'#7a6670',stoneHi:'#b4a0a8',stoneLo:'#423238',carve:'#55404a',mem:'#2e1018',memHi:'#4a1e2a',vein:'#12060a',claw:'#ddd0c8',clawLo:'#8a7a80',eye:'#ffd75e',gold:['#6a4a14','#b8902a','#f0c850'],crack:'#6a2030',weye:1,smoke:1.5,drip:1,extra:0,bury:0},
 k:{rim:'#54466a',lbl:'覚悟3 黒い',name:'黒いくらやみの竜',body:'#17111d',hi:'#2e2438',lo:'#060409',scale:'#100a15',belly:'#26202c',bellyHi:'#3a3242',stone:'#4a4652',stoneHi:'#76707e',stoneLo:'#26222c',carve:'#302c38',mem:'#110b16',memHi:'#221a2a',vein:'#040206',claw:'#a8a0a0',clawLo:'#5a5258',eye:'#ff4040',gold:['#3a2e14','#6e5a2a','#a08a4a'],crack:'#3a1a26',weye:2,smoke:2.4,drip:2,extra:0,bury:.4},
 v:{rim:'#a070e0',lbl:'覚悟4 紫の',name:'紫のくらやみの竜',body:'#2c1650',hi:'#50308a',lo:'#10061e',scale:'#200f3c',belly:'#4a2e6e',bellyHi:'#6a4e90',stone:'#6a5a8a',stoneHi:'#a090c0',stoneLo:'#3a2e52',carve:'#4a3e66',mem:'#220e3e',memHi:'#3e2268',vein:'#0a0416',claw:'#e0d0f0',clawLo:'#8a7aa0',eye:'#ff6ad8',gold:['#4a3418','#8a6a30','#c8a050'],crack:'#4a1a50',weye:2,smoke:2,drip:1,extra:1,bury:.7}};
const DPAL=DTINT.n;
const DPDEF={x:0,cr:0,nx:0,ny:0,hy:0,jaw:0,wing:0,tail:0,lift:0,rage:0,dead:0,fl:0,eyes:1};
function bz(a,m,b,t){const u=1-t;return[u*u*a[0]+2*u*t*m[0]+t*t*b[0],u*u*a[1]+2*u*t*m[1]+t*t*b[1]]}
/* 立体感：形の上の2画素に中間の明るさを置く（左上から光） */
function vol(B,pts,base,mid,deep){const m=B.mask(pts);for(const key of m){const x=(key%4096)-1024,y=Math.floor(key/4096)-1024;if(B.get(x,y)!==base)continue;if(!m.has(key-4096*2)||!m.has(key-4096*2-1))B.set(x,y,mid,1);else if(deep&&!m.has(key+4096*3))B.set(x,y,deep,1)}}
function clr(B,x,y){x=Math.round(x);y=Math.round(y);if(x<0||y<0||x>=B.w||y>=B.h)return;const i=y*B.w+x;B.c[i]=0;B.t[i]=0}
function drawDragon(B,ox,oy,S,P0,T){const P=Object.assign({},DPDEF,S.pose||{},P0||{}),k=S.k||1,dead=P.dead,C0=DTINT[P.tint||S.tint||'n'];
 const C=dead?Object.fromEntries(Object.entries(C0).map(([a,v])=>[a,typeof v==='string'&&v[0]==='#'?mix(v,'#08050c',.4):v])):C0;
 const bx=ox+P.x*k,by=dead?oy-10*k:oy-(20+P.lift)*k+P.cr*k,Q=(x,y)=>[bx+x*k,by+y*k],dk=(c,t)=>mix(c,'#000000',t),rg=P.rage>0;
 const wg=dead?-2.2:P.wing,eyeC=rg?mix(C.eye,'#ffffff',.35):C.eye,tops=[];
 /* ---- 奥の大きな翼：内側（目のある側）がこちらを向く ---- */
 const S0=Q(4,-12),E=Q(22,-27-6*wg),W=Q(11,-45-10*wg),F=[Q(-1,-57-9*wg),Q(19,-61-10*wg),Q(36,-51-8*wg),Q(43,-32-4*wg)],R0=Q(22,-8);
 if(dead){F[0]=Q(-2,-24);F[1]=Q(14,-30);F[2]=Q(30,-18);F[3]=Q(40,-4)}
 const sc=(a,b,p)=>{const m=[(a[0]+b[0])/2,(a[1]+b[1])/2];return[lerp(m[0],W[0],p),lerp(m[1],W[1],p)]},SC=[sc(F[0],F[1],.42),sc(F[1],F[2],.4),sc(F[2],F[3],.38),sc(F[3],R0,.3)];
 {const wp=[W,F[0],SC[0],F[1],SC[1],F[2],SC[2],F[3],SC[3],R0,S0,E];B.poly(wp,C.mem,C.memHi,dk(C.mem,.5));const m=B.mask(wp),md=Math.max(...F.map(f=>Math.hypot(f[0]-W[0],f[1]-W[1])));for(const key of m){const x=(key%4096)-1024,y=Math.floor(key/4096)-1024;if(B.get(x,y)!==C.mem)continue;const d=Math.hypot(x-W[0],y-W[1])/md;if(d>.74)B.set(x,y,mix(C.mem,C.lo,.45),1);else if(d<.3&&(x+y)%2)B.set(x,y,mix(C.mem,C.memHi,.5),1)}for(const f of F)for(let s2=.12;s2<.9;s2+=.03){const p=[lerp(W[0],f[0],s2),lerp(W[1],f[1],s2)];for(const o of[[1,1],[2,1],[1,2]]){const q=[Math.round(p[0]+o[0]),Math.round(p[1]+o[1])];if(B.get(q[0],q[1])===C.mem||B.get(q[0],q[1])===mix(C.mem,C.lo,.45))B.set(q[0],q[1],o[0]===1&&o[1]===1?C.memHi:mix(C.mem,C.memHi,.5),1)}}}
 for(const s of SC){B.line(W[0],W[1],lerp(W[0],s[0],.85),lerp(W[1],s[1],.85),C.memHi,1)}for(let i=0;i<3;i++){const a=bz(W,SC[i],F[i+1],.5),b=SC[i];B.line(a[0],a[1],lerp(a[0],b[0],.6),lerp(a[1],b[1],.6),C.vein,1)}
 /* 膜の破れ：のまれるほど大きい */const holes=[[.62,0,2],[.8,1,1],[.55,2,1],[.85,2,2],[.7,3,1]];for(const[h,i,r]of holes){const p=[lerp(W[0],SC[i][0],h),lerp(W[1],SC[i][1],h)],rr=r+(C.extra?1:0);for(let y=-rr;y<=rr;y++)for(let x=-rr;x<=rr;x++)if(x*x+y*y*1.6<=rr*rr&&((x+y+i)&1||rr<2))clr(B,p[0]+x,p[1]+y)}
 for(let i=0;i<4;i++){const a=i?F[i]:F[0],b=SC[i];for(let s=.15;s<.95;s+=.17)if(((s*40|0)+i)%3===0){const p=[lerp(a[0],b[0],s),lerp(a[1],b[1],s)];clr(B,p[0],p[1]+1);clr(B,p[0]+1,p[1]+1)}}
 /* 骨：腕と四本の指、親指のかぎ爪 */const bone=mix(C.body,C.hi,.45);B.thick(S0,E,2.2*k,bone,C.hi,C.lo);B.thick(E,W,1.8*k,bone,C.hi,C.lo);B.disc(E[0],E[1],2*k,bone,C.hi,C.lo);B.disc(W[0],W[1],2*k,bone,C.hi,C.lo);for(const f of F){const m=[lerp(W[0],f[0],.5),lerp(W[1],f[1],.5)-1];B.tube(W,m,f,1.4*k,.6*k,mix(C.body,C.hi,.45),C.hi,C.lo)}for(const f of F)B.set(f[0],f[1],C.claw,1);
 B.line(W[0],W[1],W[0]-2*k,W[1]-2*k,C.claw,1);B.set(W[0]-3*k,W[1]-1*k,C.clawLo,1);tops.push(Math.min(...F.map(f=>f[1]),W[1]));
 /* 翼の裏の目：のまれるほど開く */if(!dead)for(let i=0;i<3;i++){const p=[lerp(W[0],SC[i+1][0],.5),lerp(W[1],SC[i+1][1],.5)],x=Math.round(p[0]),y=Math.round(p[1]),blink=((T>>2)+i*11)%53<2;
  if(C.weye===0||blink){B.line(x-1,y,x+1,y,C.vein,1);B.set(x,y+1,C.vein,1)}else if(C.weye===1){B.line(x-1,y-1,x+1,y-1,C.vein,1);B.line(x-1,y,x+1,y,dk(C.eye,.45),2);B.set(x,y,C.eye,2)}else{B.line(x-1,y-1,x+1,y-1,C.vein,1);B.line(x-1,y,x+1,y,C.eye,2);B.set(x,y,C.lo,2);B.set(x,y+1,dk(C.eye,.5),2)}}
 /* ---- 尾：先に門のアーチの「要石」 ---- */
 const ts=Math.max(0,P.tail),tw=Math.sin(T*.05)*1.5,t0=Q(18,-2),tm=Q(36,8+ts*4),tp=dead?Q(46,9):Q(42-ts*8,-16+P.tail*14+tw);
 B.tube(t0,tm,tp,5*k,1.8*k,C.body,C.hi,C.lo);for(let i=0;i<14;i++){const p=bz(t0,tm,tp,i/14);if(i%2)B.set(p[0],p[1]+1,C.belly,1)}
 for(const s of[.32,.52,.7]){const p=bz(t0,tm,tp,s),q=bz(t0,tm,tp,s+.04),a=Math.atan2(q[1]-p[1],q[0]-p[0])-1.57,h=(4.2-s*3)*k,L=v=>add(p,rot(v,a));B.poly([L([-1*k,-1.3*k]),L([-1*k,1.3*k]),L([h,1*k]),L([h+.5,-.8*k])],C.stone,C.stoneHi,C.stoneLo)}
 {const q=bz(t0,tm,tp,.94),a=Math.atan2(tp[1]-q[1],tp[0]-q[0]),L=v=>add(tp,rot(v,a));B.poly([L([-1,-2*k]),L([-1,2*k]),L([5*k,3.6*k]),L([5*k,-3.6*k])],C.stone,C.stoneHi,C.stoneLo);B.line(...L([1,0]),...L([4.5*k,0]),C.carve,1);B.set(...L([3*k,-2*k]),C.carve,1)}
 /* ---- 脚 ---- */const legH=(hip,toe,dkk,r)=>{const H=Q(...hip),Fo=[bx+toe*k,oy-1],Kn=ik(H,Fo,10*k,11*k,-1),Hk=[lerp(Kn[0],Fo[0],.55)+3*k,lerp(Kn[1],Fo[1],.55)];B.disc(H[0],H[1],r*k,dkk(C.body),dkk(C.hi),C.lo);B.thick(H,Kn,3.9*k,dkk(C.body),dkk(C.hi),C.lo);B.thick(Kn,Hk,2.8*k,dkk(C.body),dkk(C.hi),C.lo);B.thick(Hk,Fo,2.1*k,dkk(C.body),dkk(C.hi),C.lo);for(let i=0;i<3;i++){B.set(Fo[0]-2*k-i*1.4*k,Fo[1],dkk(C.claw),1);B.set(Fo[0]-2.6*k-i*1.4*k,Fo[1],C.clawLo,1)}return H};
 const up=dead?0:Math.max(0,P.lift)*.8,legF=(sh,toe,dkk,r)=>{const H=Q(...sh),Fo=[bx+toe*k,oy-1-up*k],Kn=ik(H,Fo,9*k,10*k,-1);B.disc(H[0],H[1],r*k,dkk(C.body),dkk(C.hi),C.lo);B.thick(H,Kn,3.6*k,dkk(C.body),dkk(C.hi),C.lo);B.thick(Kn,Fo,2.7*k,dkk(C.body),dkk(C.hi),C.lo);
  B.poly([[Fo[0]+1*k,Fo[1]-2*k],[Fo[0]-3*k,Fo[1]-2.5*k],[Fo[0]-4*k,Fo[1]+.5],[Fo[0]+1*k,Fo[1]+.5]],dkk(C.body),dkk(C.hi),C.lo);for(let i=0;i<3;i++){const c=[Fo[0]-4*k-i*.2,Fo[1]-1.6*k+i*1.1*k];B.line(c[0],c[1],c[0]-2*k,c[1]+.6*k,dkk(C.claw),1);B.set(c[0]-2*k,c[1]+.6*k,C.clawLo,1)}};
 const dd=c=>dk(c,.35);if(dead){legH([16,-2],30,dd,4.5)}else{legH([16,-2],24,dd,4.5);legF([-5,-1],-20,dd,3.6)}
 /* ---- 胴：鱗と腹の板 ---- */
 const tor=[Q(-14,-4),Q(-11,-11),Q(-4,-14),Q(6,-13),Q(14,-10),Q(20,-5),Q(21,1),Q(16,6),Q(6,8),Q(-6,8),Q(-13,4)];B.poly(tor,C.body,C.hi,C.lo);vol(B,tor,C.body,mix(C.body,C.hi,.5),mix(C.body,C.lo,.4));{const ch=Q(-9,-2);B.disc(ch[0],ch[1],8.5*k,C.body,C.hi,C.lo);const cm=[];for(let a=0;a<6.3;a+=.3)cm.push([ch[0]+Math.cos(a)*8.5*k,ch[1]+Math.sin(a)*8.5*k]);vol(B,cm,C.body,mix(C.body,C.hi,.5),mix(C.body,C.lo,.4))}
 {const m=B.mask(tor);for(const key of m){const x=(key%4096)-1024,y=Math.floor(key/4096)-1024,rx=Math.round(x-bx),ry=Math.round(y-by);if(B.get(x,y)!==C.body)continue;const row=((ry+40)/3|0),xo=(rx+80+(row%2)*2)%5,yo=(ry+40)%3;if(ry>-13&&ry<-7&&((yo===0&&(xo===0||xo===3))||(yo===1&&(xo===1||xo===2))))B.set(x,y,C.scale,1)}}
 const bel=[Q(-17,-3),Q(-15,3),Q(-6,6.8),Q(6,7),Q(15,5),Q(13,2.5),Q(4,4),Q(-7,2.5),Q(-12,-1),Q(-14,-5)];{const m=B.mask(bel);for(const key of m){const x=(key%4096)-1024,y=Math.floor(key/4096)-1024;if(B.tag(x,y)!==1)continue;B.set(x,y,(Math.round(x-bx)+Math.round(y-by)*(x<bx-8*k?1:0)+60)%3===0?mix(C.belly,C.lo,.5):y<by+4*k?C.bellyHi:C.belly,1)}}
 /* ---- 背の石：門のかけら。肩のいちばん大きい石に「閉じた門」の紋章 ---- */
 const stones=[[-3,-15,9,8,1],[6,-14,6,6,0],[12,-12,5,5,0],[17,-8,4,4,0]];for(const[x,y,w,h,em]of stones){const b=Q(x,y+2),tl=em?.12:.32,L=v=>add(b,rot([v[0]*k,v[1]*k],tl));const sh=em?[[-w/2,0],[w/2,0],[w/2,-h*.78],[w*.22,-h*.62],[w*.02,-h],[-w/2,-h*.86]]:[[-w/2,0],[w/2,0],[w/2-1,-h*.5],[-w*.1,-h-1],[-w/2,-h*.55]];B.poly(sh.map(L),C.stone,C.stoneHi,C.stoneLo);
  if(em){const c=Q(x,y-h/2+1),cx=Math.round(c[0]),cy=Math.round(c[1]);for(let i=-1;i<=1;i++)B.set(cx+i,cy-2,C.carve,1);for(let j=-1;j<=2;j++){B.set(cx-2,cy+j,C.carve,1);B.set(cx+2,cy+j,C.carve,1)}for(let j=0;j<=2;j++)B.set(cx,cy+j,C.carve,1)}else{const c=Q(x,y-h/2+1);B.line(c[0]-w/2+1,c[1],c[0]+w/2-1,c[1],C.carve,1)}}
 /* ---- 手前の後ろ脚 ---- */
 if(dead)legH([12,1],22,c=>c,6);else legH([12,0],12,c=>c,7.5);
 /* ---- 首：S字、のどの板、背の小さな棘 ---- */
 const N0=Q(-10,-9),NC=dead?Q(-22,2):Q(-29+P.nx*.4,-15+P.ny*.4),Hb=dead?Q(-21,7):Q(-19-P.nx,-41+P.ny+P.hy);
 const N1=dead?Q(-16,4):Q(-27-P.nx*.3,-14+P.ny*.3),N2=dead?Q(-20,6):Q(-5-P.nx*.7,-30+P.ny*.7),cb=t=>{const u=1-t;return[u*u*u*N0[0]+3*u*u*t*N1[0]+3*u*t*t*N2[0]+t*t*t*Hb[0],u*u*u*N0[1]+3*u*u*t*N1[1]+3*u*t*t*N2[1]+t*t*t*Hb[1]]};
 const nk=[];for(let i=0;i<=20;i++)nk.push(cb(i/20));{const m=new Set();for(let i=0;i<=60;i++){const p=cb(i/60),r=(6.2-2.4*i/60)*k;for(let y=Math.floor(p[1]-r);y<=Math.ceil(p[1]+r);y++)for(let x=Math.floor(p[0]-r);x<=Math.ceil(p[0]+r);x++){const dx=x+.5-p[0],dy=y+.5-p[1];if(dx*dx+dy*dy<=r*r)m.add((y+1024)*4096+x+1024)}}B.shade(m,C.body,C.hi,C.lo,1)}
 for(let i=1;i<20;i++){const a=nk[i-1],b=nk[i+1],tx=b[0]-a[0],ty=b[1]-a[1],L=Math.hypot(tx,ty)||1;let n=[-ty/L,tx/L];if(n[0]>0)n=[-n[0],-n[1]];const r=(6.2-2.4*i/20)*k;
  const p=add(nk[i],[n[0]*(r-1.6),n[1]*(r-1.6)]);B.set(p[0],p[1],i%2?C.bellyHi:C.belly,1);B.set(p[0]-n[0],p[1]-n[1],i%2?C.belly:mix(C.belly,C.lo,.5),1);
  if(i%3===1&&!dead){const q=add(nk[i],[-n[0]*(r+.2),-n[1]*(r+.2)]);B.poly([add(q,[n[1]*1.2,-n[0]*1.2]),add(q,[-n[1]*1.2,n[0]*1.2]),add(q,[-n[0]*2.4*k,-n[1]*2.4*k])],C.stone,C.stoneHi,C.stoneLo)}}
 /* ---- ちぎれた金のかせ（ぬしの金）と、垂れる鎖 ---- */
 {const i=9,a=nk[i-1],b=nk[i+1],tx=b[0]-a[0],ty=b[1]-a[1],L=Math.hypot(tx,ty)||1;let n=[-ty/L,tx/L];if(n[0]>0)n=[-n[0],-n[1]];const c=nk[i],r=(6.2-2.4*i/20)*k+1,G=C.gold;
  const tg=[tx/L,ty/L],e1=add(c,[n[0]*r,n[1]*r]),e2=add(c,[-n[0]*(r-.5),-n[1]*(r-.5)]);for(let a=0;a<6.28;a+=.08){if(a>3.5&&a<4.3)continue;for(const w of[0,1]){const p=add(c,[n[0]*Math.cos(a)*(r+w*.6)+tg[0]*(Math.sin(a)*2.2+w-.5),n[1]*Math.cos(a)*(r+w*.6)+tg[1]*(Math.sin(a)*2.2+w-.5)]);B.set(p[0],p[1],Math.sin(a)<-.3?G[2]:Math.sin(a)>.5?G[0]:G[1],1)}}for(const a of[.6,2.2,5.2]){const p=add(c,[n[0]*Math.cos(a)*r+tg[0]*Math.sin(a)*2.2,n[1]*Math.cos(a)*r+tg[1]*Math.sin(a)*2.2]);B.set(p[0],p[1],'#fff0b0',2)}
  B.line(e2[0],e2[1],e2[0]-n[0]*2+tx/L*2,e2[1]-n[1]*2+ty/L*2,G[0],1);
  if(!dead){const sw=Math.sin(T*.06)*.35;let p=add(e1,[0,1]);for(let j=0;j<4;j++){const q=add(p,dir(1.57+sw*(j+1)*.4,2.4*k));const m=[(p[0]+q[0])/2,(p[1]+q[1])/2];if(j%2){B.set(m[0],m[1]-1,G[1],2);B.set(m[0],m[1]+1,G[1],2)}else{B.set(m[0]-1,m[1],G[2],2);B.set(m[0]+1,m[1],G[1],2)}p=q}B.set(p[0]+1,p[1],G[0],2)}
  if(C.bury>0){for(let s=-r;s<=r;s+=1)if((s+r)/(2*r)<C.bury){const p=add(c,[n[0]*s,n[1]*s]);B.set(p[0],p[1],(Math.round(s)+(T>>3))%2?INK.col:INK.hi,1)}}}
 /* ---- 頭：左を向く。アーチの角、眉の張り、三つの目 ---- */
 const hs=1.15*k,ha=dead?.35:.06+P.hy*.012,R=v=>add(Hb,rot([v[0]*hs,v[1]*hs],ha)),J2=v=>add(Hb,rot([v[0]*hs,v[1]*hs],ha+(dead?.25:P.jaw*.55)));
 B.tube(R([3,-8]),R([14,-14]),R([11,-20]),1.5,.4,dk(C.stone,.35),dk(C.stoneLo,.2),C.stoneLo);
 const JW=[[5,3.5],[-2,2.4],[-17,1.4],[-17.5,3],[-13,5],[-5,6.6],[2,6.6],[6,5]];
 if(P.jaw>.15||dead){B.poly([R([4,2.6]),R([-18,.9]),J2([-17,1.8]),J2([4,3.6])],'#2a0a14','#3a1020','#14040a');if(rg)for(let i=0;i<5;i++)B.set(...R([-8+i*2,2.6+P.jaw*1.5]),'#ff8040',4)}
 B.poly(JW.map(J2),dk(C.body,.12),C.hi,C.lo);B.line(...J2([-16,3.6]),...J2([-18,5.6]),C.stone,1);B.line(...J2([-12,5.4]),...J2([-3,6.6]),C.lo,1);
 if(P.jaw>.15){for(let i=0;i<5;i++)B.set(...J2([-16+i*3,1.4]),C.claw,1)}else{B.set(...J2([-15,.6]),C.claw,1);B.set(...J2([-10,.9]),C.claw,1)}
 const SK=[[5,-2],[4,-7],[0,-10],[-5,-10],[-9,-8],[-12,-5.5],[-17,-4.5],[-19,-3.5],[-19.5,-1],[-18,.8],[-8,1.6],[0,3],[5,3.5]];
 B.poly(SK.map(R),C.body,C.hi,C.lo);vol(B,SK.map(R),C.body,mix(C.body,C.hi,.5));
 /* 眉の張りと、その下の目のくぼみ */B.thick(R([-1,-9.4]),R([-10,-7.2]),.8,C.hi,mix(C.hi,'#ffffff',.15),C.hi);for(let x=-10;x<=-1;x++)B.set(...R([x,-6.4-(x+10)*.08]),C.lo,1);
 B.line(...R([-12,-4.6]),...R([-18,-3.4]),mix(C.body,C.hi,.5),1);B.line(...R([-19,.6]),...R([-4,1.8]),C.lo,1);B.set(...R([-17,-2.2]),C.lo,1);B.set(...R([-16,-2.2]),C.lo,1);for(const x of[-14,-11,-7,-3])B.set(...R([x,-2.6+(x+14)*.05]),C.scale,1);
 for(const[x,y]of[[-16,-5],[-13,-5.6]])B.set(...R([x,y]),C.stone,1);
 if(P.jaw<=.15){B.line(...R([-16,1.6]),...R([-16,2.8]),C.claw,1);B.set(...R([-11,2.1]),C.claw,1);B.set(...R([-6,2.4]),C.claw,1)}else for(let i=0;i<5;i++)B.set(...R([-17+i*3,1.8]),C.claw,1);
 /* ほおのとげ（三本） */for(const[y,l]of[[1.5,6],[-1.5,7],[-4.5,5]])B.thick(R([4,y]),R([3+l,y+1.6]),.7,C.stone,C.stoneHi,C.stoneLo);
 /* 角：門のアーチの曲がり方（後ろへ上がり、先が前へ戻る） */const h0=R([0,-9]),h1=R([12,-16]),h2=R([5,-24]);B.tube(h0,h1,h2,2*hs,.5,C.stone,C.stoneHi,C.stoneLo);for(const s2 of[.22,.4,.58,.74]){const p=bz(h0,h1,h2,s2);B.set(p[0],p[1],C.stoneLo,1);B.set(p[0]+1,p[1],C.stoneLo,1)}
 tops.push(h2[1]);
 /* 鼻から、くらやみの息 */if(!dead){const ph=(T*.3)%30;if(ph<14){const p=R([-19,-2]);B.set(p[0]-ph*.4,p[1]-ph*.5,ph<7?INK.hi:INK.col,4);B.set(p[0]-ph*.4-1,p[1]-ph*.5+1,INK.col,4)}}

 /* 目：三つ（3は門の数字）。眉の下に、前から大きい順 */const eo=P.eyes&&!dead;for(const[x,y,w]of[[-9,-5.4,3],[-5,-6.2,1],[-2,-6.8,1]]){for(let i=0;i<w;i++)B.set(...R([x+i,y]),eo?eyeC:C.lo,2);if(eo&&w===3)B.set(...R([x+1,y]),C.lo,2);if(eo&&rg&&w===3)B.set(...R([x+1,y-1]),eyeC,2)}
 if(rg&&!dead)glow(B,Math.round(R([-8,3])[0]),Math.round(R([-8,3])[1]),3,'#ff6030');
 /* ---- 手前の前脚 ---- */
 if(dead){const H=Q(-8,2);B.disc(H[0],H[1],4*k,C.body,C.hi,C.lo);B.thick(H,[H[0]-8*k,oy-2],2.4*k,C.body,C.hi,C.lo)}else legF([-7,0],-17,c=>c,6);
 /* ---- ひび：ふだんは沈んだ色、怒ると赤く光る（光の赤＝重い） ---- */
 const crk=[[[-11,-7],[-13,-2],[-11,3]],[[6,-9],[9,-5],[7,-1],[10,3]],[[-6,-11],[-4,-7]],[[13,-6],[15,-2]]];for(const c of crk){const pts=c.map(p=>Q(...p));crack(B,pts,rg?'#ff4a3a':C.crack);if(rg)for(const p of pts)B.set(p[0],p[1],'#ffc070',1)}
 if(rg){const p=nk[13];crack(B,[add(p,[-1,-2]),add(p,[0,1]),add(p,[-1,3])],'#ff4a3a')}
 /* ---- 紫：目が体じゅうに増える（上位の存在の視線）。翼のふちから触手 ---- */
 if(C.extra&&!dead){for(const i of[5,12,16]){const p=nk[i];B.set(p[0],p[1],C.eye,2);B.set(p[0]+1,p[1],C.eye,2);B.set(p[0],p[1]-1,C.lo,2)}for(const[x,y]of[[2,-6],[10,-4],[16,-1]]){const p=Q(x,y);B.line(p[0]-1,p[1]-1,p[0]+1,p[1]-1,C.lo,2);B.line(p[0]-1,p[1],p[0]+1,p[1],C.eye,2);B.set(p[0],p[1],C.lo,2)}
  for(let i=1;i<4;i++){const a=SC[i],sw=Math.sin(T*.06+i*2)*3;tentacle(B,a,add(a,[3+sw,5]),add(a,[1-sw,10]),1.4,.4,i===2)}}
 /* ---- くらやみの煙（上る）としずく（落ちる） ---- */
 if(!dead){const ns=Math.round(7*C.smoke);for(let i=0;i<ns;i++){const s=(i*37%100)/100,base=bz(Q(-6,-14),Q(10,-17),Q(20,-6),s),ph=(T*.35+i*13)%16;const x=base[0]+Math.sin(ph*.4+i)*1.2,y=base[1]-ph-3;if(!B.get(Math.round(x),Math.round(y)))B.set(x,y,ph<8?INK.hi:INK.col,4)}
  const dr=[R([-12,4]),Q(-6,8),Q(8,8)];for(let i=0;i<C.drip+1;i++){const p=dr[i%3],ph=(T*.4+i*23)%26,y=p[1]+ph*.8;if(y<oy-1){B.set(p[0],y,INK.hi,4);if(ph>3)B.set(p[0],y-1,INK.col,4)}}}
 /* 背中側のふちの光：くらやみの中でも形が読める */if(!dead){const rc=C.rim,skip=new Set([...C.gold,C.claw,C.clawLo,C.eye,'#ff4a3a','#ffc070']);const L=[];for(let y=1;y<B.h-1;y++)for(let x=1;x<B.w-1;x++){const i=y*B.w+x;if(B.t[i]!==1||skip.has(B.c[i]))continue;if(B.t[i+1]===0&&(B.t[i-B.w]===0||B.t[i-B.w+1]===0))L.push(i)}for(const i of L)B.c[i]=rc}
 const top=Math.min(...tops);
 return{hip:[bx,by],sc:[bx+4*k,by-6*k],top,head:Hb,mouth:R([-18,1.5]),chest:[bx+2*k,by-3*k],tail:tp,k,dead:dead?1:0}}

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
Object.assign(PDEF,{nx:0,ny:0,hy:0,jaw:0,wing:0,tail:0,rage:0,dead:0,f0:0,f1:0,f2:0,j0:0,j1:0,j2:0,curl:0});
SPEC.dragon={name:'くらやみの竜',k:1,draw:drawDragon,pose:{},aura:{r:3,c1:'#2a1840',c2:'#1e1230',rim:'#8a4ab8'}};
SPEC.hydra={name:'三つ首の竜',k:1,draw:drawHydra,pose:{},aura:{r:3,c1:'#2a1840',c2:'#1e1230',rim:'#c070ff'}};
