/* 覚悟の段（ページ全体で切りかえる）：n ふつう／r 赤い／k 黒い／v 紫の。段を描いてある敵（tintable）だけ変わる */
let KTINT=null;
/* ===== カードの描画：一枚に「主人公」と「敵」と「床」 ===== */
const CW=136,CH=118,FL=94,HXX_=26,FL_=94,EXX=92,HXX=26;
const SKY={def:['#1c1824','#241e2e'],gate:['#1e2230','#262c3c'],lord:['#140c18','#1e1424'],red:['#1e1418','#2a1c20'],hole:['#08060c','#100c18']};
function tipOf(S,P,ox,oy,which){const B0=new Buf(1,1),J=joints(ox,oy,S,Object.assign({},PDEF,S.pose,P));const W=which===2?S.w2:S.w,sw=which===2?P.sw2:P.sw;if(sw==null)return null;const h=which===2?J.hdB:J.hdF;return add(h,dir(sw,W.len*S.k))}
function trail(B,S,M,t,ox,oy,n,col,which){const base=Object.assign({},PDEF,S.pose);let prev=null;for(let i=n;i>=0;i--){const P=Object.assign({},base,poseAt0(M,t-i,base));const tp=tipOf(S,P,ox,oy,which);if(!tp)continue;const J=joints(ox,oy,S,P),hd=which===2?J.hdB:J.hdF;if(prev&&i>0){const c=FXC[col]||FXC.w;for(const s of [.7,.85,1]){B.line(lerp(prev[1][0],prev[0][0],s),lerp(prev[1][1],prev[0][1],s),lerp(hd[0],tp[0],s),lerp(hd[1],tp[1],s),s>.9?c[1]:c[0],4)}}prev=[tp,hd]}}
function drawHeroSmall(B,t,hit,PO){const H=new Buf(CW,CH);const P=PO||(hit?{ua:-.2,fa:-1.0,sw:-1.9,lean:.15,x:-1}:{});knight(H,CW-HXX,FL,SPEC.hero,P,t);B.blit(H,true)}
function spark(B,x,y,t,col){const c=FXC[col]||FXC.w;for(let i=0;i<8;i++){const a=i/8*Math.PI*2+t*.3,r=2+t*1.2;if(t<6)B.set(x+Math.cos(a)*r,y+Math.sin(a)*r,i%2?c[0]:c[1],4)}if(t<3)star(B,x,y,4-t,col)}
function floor(B,kind){const y=FL;const c=kind==='hole'?['#0c0a14','#1a1428']:kind==='lord'?['#1a1220','#2a1e30']:kind==='red'?['#2a1c1e','#3a2a2c']:['#22222e','#30303e'];for(let x=0;x<CW;x++){B.set(x,y+1,c[1],6);for(let yy=y+2;yy<CH;yy++)B.set(x,yy,((x+yy)%7===0)?c[1]:c[0],6)}}
function bgFill(ctx,kind){const g=SKY[kind]||SKY.def;ctx.fillStyle=g[0];ctx.fillRect(0,0,CW,CH);ctx.fillStyle=g[1];for(let y=0;y<FL;y+=4)ctx.fillRect(0,y,CW,1)}
/* 1コマ描く */
function frame(M,t){const tt=t%M.len,S=SPEC[M.fAt?M.fAt(tt):M.f],B=new Buf(CW,CH),base=Object.assign({},PDEF,S.pose);floor(B,M.bg||'def');
 const P=poseAt0(M,tt,base);if(M.pp)M.pp(P,tt);if(KTINT&&S.tintable&&!P.tintFix)P.tint=KTINT;
 const ox=EXX+(M.ox||0),oy=FL;
 const hit=M.hits&&M.hits.some(h=>tt>=h&&tt<h+8);if(!M.noHero)drawHeroSmall(B,tt,hit,M.heroP?M.heroP(tt):null);
 if(M.pre)M.pre(B,tt,S,P);
 const J=(S.draw||knight)(B,ox,oy,S,P,tt);J.P=P;
 if(M.fx)M.fx(B,J,tt,S,M);
 /* 共通：合図の光と、当たった瞬間の火花 */
 for(const c of (M.cues||[])){const d=tt-c.t;if(d>=0&&d<18){const tp=c.at?c.at(J):(c.w===2?J.tip2:J.tip)||J.hdF;if(c.col==='p'){ring(B,tp[0],tp[1],4+d*.9,'p');ring(B,tp[0],tp[1],3+d*.9,'p');if(d<8)ring(B,tp[0],tp[1],5+d*.9,'p')}else cueStar(B,Math.round(tp[0]),Math.round(tp[1]),d,c.col)}}
 for(const h of (M.hits||[])){const d=tt-h;if(d>=0&&d<8)spark(B,HXX+5,FL-12,d,M.hitCol||'w')}
 for(const tr of (M.trails||[]))if(tt>=tr[0]&&tt<=tr[1])(tr[4]==='line'?lineTrail:tr[4]==='arc'?arcTrail:trail)(B,S,M,tt,ox,oy,tr[4]?8:4,tr[2]||'w',tr[3]);
 if(M.post)M.post(B,J,tt,S);
 B.outline();if(S.aura&&!(M.auraOff&&M.auraOff(tt))){if(S.aura.smoke)auraSmoke(B,S.aura,tt,M.auraK?M.auraK(tt):1);else aura(B,S.aura,tt)}return B}

/* 合図の光：大きな十字の星＋斜めの光＋まわりのにじみ。画面でいちばん目立つもの */
function cueStar(B,x,y,d,col){const R=[4,7,9,10,10,9,9,8,7,6,5,5,4,3,3,2,2,1][d]||1,[c1,c2]=FXC[col];
 for(let yy=-R-2;yy<=R+2;yy++)for(let xx=-R-2;xx<=R+2;xx++){const r=Math.hypot(xx,yy);if(r<R*.7&&r>1.5&&(xx+yy)%2===0&&B.tag(x+xx,y+yy)!==4)B.set(x+xx,y+yy,mix(c1,'#000000',.35),4)}
 for(let i=-R;i<=R;i++){const a=Math.abs(i)<R*.45?c2:c1;B.set(x+i,y,a,4);B.set(x,y+i,a,4);if(Math.abs(i)<R*.3){B.set(x+i,y-1,c2,4);B.set(x+i,y+1,c2,4);B.set(x-1,y+i,c2,4);B.set(x+1,y+i,c2,4)}}
 const dd=Math.round(R*.5);for(let i=-dd;i<=dd;i++){B.set(x+i,y+i,c1,4);B.set(x+i,y-i,c1,4)}
 B.set(x,y,'#ffffff',4);B.set(x+1,y,'#ffffff',4);B.set(x,y+1,'#ffffff',4);B.set(x-1,y,'#ffffff',4);B.set(x,y-1,'#ffffff',4)}

/* 剣の軌跡の二つの形。弧＝振り（円を描く）、直線＝突き・一文字（まっすぐ） */
function tipsOf(S,M,t,ox,oy,n,which){const base=Object.assign({},PDEF,S.pose),out=[];for(let i=n;i>=0;i--){const P=Object.assign({},base,poseAt0(M,t-i,base));if(M.pp)M.pp(P,t-i);const tp=tipOf(S,P,ox,oy,which);if(tp)out.push(tp)}return out}
function arcTrail(B,S,M,t,ox,oy,n,col,which){/* 弧：太い三日月。外側ほど明るい */const c=FXC[col]||FXC.w;const base=Object.assign({},PDEF,S.pose);let prev=null;for(let i=n;i>=0;i--){const P=Object.assign({},base,poseAt0(M,t-i,base));const tp=tipOf(S,P,ox,oy,which);if(!tp)continue;const J=joints(ox,oy,S,P),hd=which===2?J.hdB:J.hdF;
  if(prev){for(const s of[.55,.65,.75,.85,.95,1.05]){B.line(lerp(prev[1][0],prev[0][0],s),lerp(prev[1][1],prev[0][1],s),lerp(hd[0],tp[0],s),lerp(hd[1],tp[1],s),s>.9?c[1]:s>.7?c[0]:mix(c[0],'#000000',.4),4)}}prev=[tp,hd]}}
function lineTrail(B,S,M,t,ox,oy,n,col,which){/* 直線：切っ先の通り道に細い一本線と、平行な速さの線 */const c=FXC[col]||FXC.w;const T=tipsOf(S,M,t,ox,oy,n,which);if(T.length<2)return;const a=T[0],b=T[T.length-1],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L;
  B.line(a[0],a[1],b[0],b[1],c[1],4);B.line(a[0]+nx,a[1]+ny,b[0]+nx,b[1]+ny,c[0],4);for(const o of[-3,3,5]){const s=.3+Math.abs(o)*.06;B.line(lerp(a[0],b[0],s)+nx*o,lerp(a[1],b[1],s)+ny*o,b[0]+nx*o-dx*.1,b[1]+ny*o-dy*.1,c[0],4)}}

/* 吐く息：見えにくいくらいの、うすい湯気。口元から前へ細く出て、ゆるく上へ広がりながら、点が抜けて消える（18F） */
function breath(B,p,d,big){if(d<0||d>=18)return;const u=d/18,L=Math.round(2+d*.45*(big?1.4:1));for(let i=0;i<L;i++)for(let j=0;j<=(i>2?1:0);j++){const x=p[0]-1-i-d*.35,y=p[1]-d*.22-i*.18+(j?-1:0)+Math.sin(i*.8+d*.35)*.5;if(hsh(i*7+j,d)>.35+u*.6&&((i+j+d)&1))B.set(x,y,u<.4?'#7c7480':'#5e5864',5)}}
