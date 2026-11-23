/* ===== くらやみの竜と、三つ首の竜（竜の亡骸・裂け目・指） =====
   竜：門のすき間から最初に漏れ出た、くらやみが初めて形を持った姿。首にちぎれた金のかせ（門のぬしと同じ金）。
   三つ首：竜の亡骸の胸が裂け、裂け目から上位の存在の「指先」が三本出てくる。見た目は三つ首の竜。 */
const DPAL={body:'#2a1a34',hi:'#4a2e5e',lo:'#120a1a',belly:'#3a2a40',bellyHi:'#5a4060',horn:'#6e6680',hornHi:'#a8a0b8',eye:'#ff3050',wing:'#1e1228',wingHi:'#3a2450',crack:'#9a3040',crackR:'#ff4040'};
const DPDEF={x:0,cr:0,nx:0,ny:0,hy:0,jaw:0,wing:0,tail:0,lift:0,rage:0,dead:0,fl:0,eyes:1};
function drawDragon(B,ox,oy,S,P0,T){const P=Object.assign({},DPDEF,S.pose||{},P0||{}),k=S.k||1,C=DPAL,dead=P.dead;
 const bx=ox+P.x*k,by=oy-(18+P.lift)*k+P.cr*k;
 const dk=c=>dead?mix(c,'#0a0610',.55):c;
 /* 尾 */const tw=Math.sin(T*.05)*2+P.tail*10;B.tube([bx+18*k,by+2*k],[bx+34*k,by+6*k-tw],[bx+48*k,by+(dead?14:-2)*k-tw*1.4],4*k,.8*k,dk(C.body),dk(C.hi),C.lo);
 for(let i=0;i<5;i++){const t=.2+i*.17,u=1-t;const p=[u*u*(bx+18*k)+2*u*t*(bx+34*k)+t*t*(bx+48*k),u*u*(by+2*k)+2*u*t*(by+6*k-tw)+t*t*(by+(dead?14:-2)*k-tw*1.4)];B.set(p[0],p[1]-3.5*k*(1-t),dk(C.horn),2)}
 /* 奥の脚 */const leg=(x,front,dkk)=>{const top=[bx+x*k,by+6*k],knee=[bx+(x+(front?-3:4))*k,oy-8*k+P.cr*.5*k],ft=[bx+(x+(front?-6:2))*k,oy];B.thick(top,knee,3.4*k,dkk(C.body),dkk(C.hi),C.lo);B.thick(knee,ft,2.6*k,dkk(C.body),dkk(C.hi),C.lo);for(let i=0;i<3;i++)B.set(ft[0]-3*k+i*1.5*k,ft[1]-.5,dkk(C.horn),2)};
 if(!dead){leg(14,false,c=>mix(c,'#000000',.3));leg(-6,true,c=>mix(c,'#000000',.3))}
 /* 奥の翼：ぼろぼろの膜。ぬしのマントと同じく、裏に目がある */const wg=P.wing,wb=[bx+6*k,by-8*k];
 if(!dead){const sh=[bx+8*k,by-9*k],el=[bx+(14+wg*3)*k,by-(30+wg*8)*k];const tips=[[bx+(6+wg*2)*k,by-(40+wg*10)*k],[bx+(26+wg*4)*k,by-(36+wg*12)*k],[bx+(40+wg*3)*k,by-(20+wg*8)*k]];
  const mem=[sh,el,tips[0],[bx+(12+wg*2)*k,by-(30+wg*7)*k],tips[1],[bx+(28+wg*3)*k,by-(22+wg*6)*k],tips[2],[bx+(32)*k,by-(6)*k],[bx+24*k,by-12*k],[bx+18*k,by-6*k]];
  B.poly(mem,C.wing,C.wingHi,C.lo);for(const t of tips){B.thick(el,t,.9*k,C.horn,C.hornHi,C.lo)}B.thick(sh,el,1.6*k,C.horn,C.hornHi,C.lo);
  /* 膜の破れ */for(let i=0;i<5;i++){const x=bx+(14+i*5)*k,y=by-(10+((i*7)%5))*k;B.set(x,y,0,0);B.set(x+1,y+1,0,0)}
  for(let i=0;i<4;i++){const x=bx+(16+i*5)*k,y=by-(20-i*2)*k;if(B.get(x,y)&&((T>>3)+i)%5)B.set(x,y,C.eye,2)}}
 /* 胴 */B.disc(bx+4*k,by,12*k,dk(C.body),dk(C.hi),C.lo);B.disc(bx+14*k,by+1*k,10*k,dk(C.body),dk(C.hi),C.lo);
 for(let i=0;i<5;i++)B.line(bx+(-4+i*4)*k,by+8*k,bx+(-2+i*4)*k,by+11*k,dk(C.belly),2);
 /* 背の棘：門の石のかけら */for(let i=0;i<6;i++){const x=bx+(-2+i*4)*k,y=by-11*k+Math.abs(i-2.5)*1.2*k;B.poly([[x-1.5*k,y+2*k],[x+1.5*k,y+2*k],[x+.5*k,y-3*k]],dk(C.horn),dk(C.hornHi),C.lo)}
 /* ひびと怒りの赤 */if(P.rage>0||dead===0){const rc=P.rage>0?C.crackR:C.crack;crack(B,[[bx-2*k,by-4*k],[bx+2*k,by],[bx,by+4*k]],rc);crack(B,[[bx+12*k,by-6*k],[bx+15*k,by-1*k]],rc)}
 /* 首：かせの位置で少し細い */const nb=[bx-6*k,by-6*k],hb=[bx-(18-P.nx)*k,by-(26-P.ny-P.hy)*k],nm=[bx-(16-P.nx*.4)*k,by-(10-P.ny*.4)*k];
 if(dead){/* 亡骸：首は床に垂れる */const hd=[bx-24*k,oy-4*k];B.tube(nb,[bx-14*k,by+2*k],hd,5*k,3.5*k,dk(C.body),dk(C.hi),C.lo);B.poly([[hd[0]-1*k,hd[1]-3*k],[hd[0]-12*k,hd[1]],[hd[0]-1*k,hd[1]+3*k]],dk(C.body),dk(C.hi),C.lo);return{hip:[bx,by],sc:[bx+6*k,by-2*k],head:hd,mouth:hd,chest:[bx+4*k,by-1*k],k,dead:1}}
 B.tube(nb,nm,hb,5.5*k,3.5*k,C.body,C.hi,C.lo);
 /* 金のかせ：ちぎれた輪と鎖。昔、門のぬしが鎖でつないでいた（ぬしの縁どりと同じ金） */const sk=[lerp(nb[0],hb[0],.45)+0,lerp(nb[1],hb[1],.45)];for(let a=0;a<6.28;a+=.35)B.set(sk[0]+Math.cos(a)*4.2*k,sk[1]+Math.sin(a)*1.6*k,(a*3|0)%2?'#b8902a':'#6a4a14',2);for(let i=1;i<=4;i++)B.set(sk[0]+1*k+(i%2),sk[1]+2*k+i*1.6*k+Math.sin(T*.08+i)*.6,i%2?'#b8902a':'#f0c850',2);
 /* 頭：左を向く。あごは jaw で開く */const ha=-.15+P.hy*.01,R=v=>add(hb,rot(v,ha));
 B.poly([R([3*k,-5*k]),R([-6*k,-6.5*k]),R([-18*k,-2*k]),R([-18*k,0]),R([-4*k,1*k]),R([4*k,1.5*k])],C.body,C.hi,C.lo);B.line(...R([-6*k,-2.5*k]),...R([-17*k,-.8*k]),C.lo,2);
 const J2=a=>add(hb,rot(a,ha+P.jaw*.6));B.poly([J2([3*k,1*k]),J2([-16*k,1.5*k]),J2([-15*k,4*k]),J2([2*k,5*k])],mix(C.body,'#000000',.15),C.hi,C.lo);
 if(P.jaw>.2){for(let i=0;i<4;i++){B.set(...R([(-12+i*3)*k,.8*k]),'#e8e0d0',2);B.set(...J2([(-11+i*3)*k,1.8*k]),'#e8e0d0',2)}const th=R([-6*k,2*k]);if(P.rage>0)glow(B,Math.round(th[0]),Math.round(th[1]),3,'#ff6030')}
 /* 角：門のアーチの曲がり方 */for(const s of[0,1]){const b=R([(1+s*2)*k,-4*k]),m=R([(6+s*3)*k,-10*k]),e=R([(2+s*2)*k,-15*k]);B.tube(b,m,e,1.4*k,.4*k,C.horn,C.hornHi,C.lo)}
 /* 目：三つ（3は門の数字） */for(let i=0;i<3;i++){const e=R([(-4+i*2.2)*k,(-2.6+i*.3)*k]);B.set(e[0],e[1],P.eyes?(P.rage>0?'#ffb040':C.eye):'#140a10',2)}
 /* 手前の脚 */leg(10,false,c=>c);leg(-10,true,c=>c);
 return{hip:[bx,by],sc:[bx+6*k,by-2*k],head:hb,mouth:R([-14*k,1*k]),chest:[bx+4*k,by-1*k],tail:[bx+48*k,by-2*k-tw*1.4],k}}

/* 三つ首：亡骸＋裂け目＋三本の指 */
function drawHydra(B,ox,oy,S,P0,T){const P=Object.assign({},DPDEF,{f0:0,f1:0,f2:0,rift:1,j0:0,j1:0,j2:0,lit:[0,0,0],curl:0},S.pose||{},P0||{}),k=S.k||1;
 const J=drawDragon(B,ox,oy,{k,pose:{}},{dead:1,x:P.x},T);const c=add(J.chest,[0,-3*k]),rw=7*k*P.rift,rh=9*k*P.rift;
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
