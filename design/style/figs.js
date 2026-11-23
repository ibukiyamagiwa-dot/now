/* ---- 色（ramp＝[明, 基本, 中, 暗]）。Bは彩度を抑える、Aは明るく素直、Cは渋く深く ---- */
const R={
 heroArm:{A:['#ffffff','#e4e8f4','#c0c6da','#8a92ac'],B:['#e8eaf0','#b8bcc8','#8a8ea0','#565a6c'],C:['#d8dae0','#a4a8b4','#767a88','#45485a']},
 heroCape:{A:['#ff8080','#e84848','#c03030','#801818'],B:['#d06060','#a83a3e','#7a2630','#4a1420'],C:['#a84a48','#86303a','#5e1e2a','#361018']},
 chain:{A:['#a0a0b0','#808090','#606070','#404050'],B:['#7a7880','#5a5860','#424048','#2a2830'],C:['#6a6870','#4e4c56','#383640','#222028']},
 blade:{A:['#ffffff','#e8ecf8','#c0c8dc','#8890a8'],B:['#f4f6fa','#d0d4e0','#9aa0b4','#5e6478'],C:['#e8eaf0','#b8bcc8','#8a8ea0','#565a6c']},
 wood:{A:['#d8a060','#b07838','#8a5828','#5a3818'],B:['#9a7250','#76563c','#56402e','#36281e'],C:['#806048','#604836','#443428','#2a2018']},
 gArm:{A:['#c8d4ec','#9aaad0','#7484b0','#4a5680'],B:['#9aa2b0','#727a8a','#545a68','#353a46'],C:['#8a909c','#646a76','#484c58','#2c3038']},
 gCloth:{A:['#5a7ae0','#3a5ac0','#2a4294','#1a2a60'],B:['#46568a','#323e68','#24304e','#161e34'],C:['#3e4a72','#2c3654','#1e263c','#121828']},
 gold:{A:['#fff0a0','#f0c850','#c8982a','#8a6414'],B:['#e0c070','#b8902a','#8a6a1e','#544010'],C:['#c8a860','#9a7a2a','#6e5420','#403010']},
 lArm:{A:['#7a7090','#5a5070','#423a56','#2a2438'],B:['#5e5868','#423c4e','#2e2a38','#1a1822'],C:['#55505e','#3c3846','#28252f','#16141a']},
 lCloth:{A:['#a03048','#7a1a30','#5a1022','#3a0816'],B:['#6a2232','#4e1624','#380e1a','#220810'],C:['#5e1e2c','#44141f','#2e0c16','#1c060c']},
 lCape:{A:['#4a4060','#342c48','#241e34','#141020'],B:['#342c3c','#241e2c','#18141e','#0e0c12'],C:['#2e2834','#201b26','#15121a','#0b090e']},
 ink:{A:['#7a50b0','#4a2a80','#2e1a54','#1a0e30'],B:['#4e2c70','#2e1a44','#1e1030','#0e0618'],C:['#40265c','#26163a','#180e26','#0a0612']},
 slime:{A:['#c0ffa0','#70e060','#40b040','#207a28'],B:['#8aa880','#5e8058','#405c3e','#263a26'],C:['#7a9474','#56704f','#3a5036','#22321f']},
};
/* 人型：等身は style ごと。H頭・T胴・L脚・肩幅・腰幅 */
const PROP={A:{H:15,T:8,L:7,sw:6,hw:5,arm:5},B:{H:11,T:11,L:11,sw:6,hw:4.5,arm:6.5},C:{H:7,T:14,L:17,sw:5.5,hw:4,arm:8.5}};
function human(B,ox,oy,st,d,sc=1){const p=PROP[st],H=p.H*sc*(d.headK||1),T=p.T*sc,L=p.L*sc,sw=p.sw*sc*(d.wide||1),hw=p.hw*sc*(d.wide||1),ar=p.arm*sc;
 const hip=oy-L,sh=hip-T,hc=sh-H*.42,J={ox,oy,hip,sh,hc,H,T,L,sw,hw,sc,st};
 J.hF=[ox-sw-ar*.35,hip-T*.25];J.hB=[ox+sw+ar*.2,hip-T*.2];J.shF=[ox-sw+1,sh+1.5*sc];J.shB=[ox+sw-1,sh+1.5*sc];
 if(d.armF)Object.assign(J,d.armF(J));
 if(d.behind)d.behind(B,J);
 if(d.cape)paint(B,mPoly([[ox+sw*.3,sh],[ox+sw+2*sc,sh+1],[ox+sw+6*sc,oy-1],[ox+1*sc,oy-1]]),R[d.cape][st],st);
 /* 後ろの腕と脚 */
 const legR=st==='C'?2:st==='A'?2.6:2.4;
 paint(B,U(mThick(J.shB,[J.shB[0]+1,(J.shB[1]+J.hB[1])/2],1.8*sc),mThick([J.shB[0]+1,(J.shB[1]+J.hB[1])/2],J.hB,1.6*sc)),R[d.arm][st].map(c=>mx(c,O,.25)),st);
 if(d.backHand)d.backHand(B,J);
 const fF=[ox-hw-1.5*sc,oy],fB=[ox+hw+1*sc,oy],kF=[ox-hw-.5*sc,hip+L*.5],kB=[ox+hw+.5*sc,hip+L*.52];
 const leg=(h,k,f,dk)=>{paint(B,U(mThick(h,k,legR*sc),mThick(k,f,(legR-.3)*sc)),R[d.leg||d.arm][st].map(c=>dk?mx(c,O,.25):c),st);paint(B,mPoly([[f[0]-3.5*sc,f[1]],[f[0]+2*sc,f[1]],[f[0]+2*sc,f[1]-2.5*sc],[f[0]-2*sc,f[1]-3*sc]]),R[d.arm][st].map(c=>mx(c,O,dk?.4:.15)),st)};
 leg([ox+hw*.5,hip],kB,fB,1);
 /* 胴 */
 paint(B,mPoly([[ox-sw,sh],[ox+sw,sh],[ox+hw+.5,hip-T*.35],[ox+hw,hip+1],[ox-hw,hip+1],[ox-hw-.5,hip-T*.35]]),R[d.arm][st],st);
 if(d.body)d.body(B,J);
 leg([ox-hw*.5,hip],kF,fF,0);
 if(d.skirt)d.skirt(B,J);
 if(d.helm)d.helm(B,J);
 if(d.weapon)d.weapon(B,J);
 /* 前の腕 */
 const el=[J.shF[0]-ar*.35,J.shF[1]+ar*.55];paint(B,U(mThick(J.shF,el,1.8*sc),mThick(el,J.hF,1.6*sc)),R[d.arm][st],st);
 paint(B,mEll(J.shF[0]+.5,J.shF[1],3*sc,2.6*sc),R[d.arm][st],st);
 if(d.front)d.front(B,J);return J}
function blade(B,h,ang,len,w,st,r){const u=[Math.cos(ang),Math.sin(ang)],n=[-u[1],u[0]],Q=(a,b)=>[h[0]+u[0]*a+n[0]*b,h[1]+u[1]*a+n[1]*b];
 paint(B,mPoly([Q(-1,-w-1),Q(len*.9,-w*.7-1),Q(len+1.5,0),Q(len*.9,w*.7+1),Q(-1,w+1)]),[O,O,O,O],'A',1);
 paint(B,mPoly([Q(1,-w),Q(len*.9,-w*.7),Q(len,0),Q(len*.9,w*.7),Q(1,w)]),r||R.blade[st],st==='A'?'A':'B',1,true);
 for(let i=-3;i<=3;i++)B.set(...Q(.5,i*.9),R.gold[st][i===0?0:2]);for(let i=1;i<=3;i++)B.set(...Q(-i,0),R.wood[st][2]);return Q(len,0)}
function dot(B,x,y,c){B.set(x,y,c,2)}
