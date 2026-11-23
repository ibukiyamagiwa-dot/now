/* ===== カードの描画：一枚に「主人公」と「敵」と「床」 ===== */
const CW=136,CH=118,FL=94,EXX=92,HXX=26;
const SKY={def:['#1c1824','#241e2e'],gate:['#1e2230','#262c3c'],lord:['#140c18','#1e1424'],red:['#1e1418','#2a1c20'],hole:['#08060c','#100c18']};
function tipOf(S,P,ox,oy,which){const B0=new Buf(1,1),J=joints(ox,oy,S,Object.assign({},PDEF,S.pose,P));const W=which===2?S.w2:S.w,sw=which===2?P.sw2:P.sw;if(sw==null)return null;const h=which===2?J.hdB:J.hdF;return add(h,dir(sw,W.len*S.k))}
function trail(B,S,M,t,ox,oy,n,col,which){const base=Object.assign({},PDEF,S.pose);let prev=null;for(let i=n;i>=0;i--){const P=Object.assign({},base,poseAt0(M,t-i,base));const tp=tipOf(S,P,ox,oy,which);if(!tp)continue;const J=joints(ox,oy,S,P),hd=which===2?J.hdB:J.hdF;if(prev&&i>0){const c=FXC[col]||FXC.w;for(const s of [.7,.85,1]){B.line(lerp(prev[1][0],prev[0][0],s),lerp(prev[1][1],prev[0][1],s),lerp(hd[0],tp[0],s),lerp(hd[1],tp[1],s),s>.9?c[1]:c[0],4)}}prev=[tp,hd]}}
function drawHeroSmall(B,t,hit){const H=new Buf(CW,CH);const P=hit?{ua:-.2,fa:-1.0,sw:-1.9,lean:.15,x:-1}:{};knight(H,CW-HXX,FL,SPEC.hero,P,t);B.blit(H,true)}
function spark(B,x,y,t,col){const c=FXC[col]||FXC.w;for(let i=0;i<8;i++){const a=i/8*Math.PI*2+t*.3,r=2+t*1.2;if(t<6)B.set(x+Math.cos(a)*r,y+Math.sin(a)*r,i%2?c[0]:c[1],4)}if(t<3)star(B,x,y,4-t,col)}
function floor(B,kind){const y=FL;const c=kind==='hole'?['#0c0a14','#1a1428']:kind==='lord'?['#1a1220','#2a1e30']:kind==='red'?['#2a1c1e','#3a2a2c']:['#22222e','#30303e'];for(let x=0;x<CW;x++){B.set(x,y+1,c[1],6);for(let yy=y+2;yy<CH;yy++)B.set(x,yy,((x+yy)%7===0)?c[1]:c[0],6)}}
function bgFill(ctx,kind){const g=SKY[kind]||SKY.def;ctx.fillStyle=g[0];ctx.fillRect(0,0,CW,CH);ctx.fillStyle=g[1];for(let y=0;y<FL;y+=4)ctx.fillRect(0,y,CW,1)}
/* 1コマ描く */
function frame(M,t){const tt=t%M.len,S=SPEC[M.fAt?M.fAt(tt):M.f],B=new Buf(CW,CH),base=Object.assign({},PDEF,S.pose);floor(B,M.bg||'def');
 const P=poseAt0(M,tt,base);if(M.pp)M.pp(P,tt);
 const ox=EXX+(M.ox||0),oy=FL;
 const hit=M.hits&&M.hits.some(h=>tt>=h&&tt<h+8);if(!M.noHero)drawHeroSmall(B,tt,hit);
 if(M.pre)M.pre(B,tt,S,P);
 const J=knight(B,ox,oy,S,P,tt);J.P=P;
 if(M.fx)M.fx(B,J,tt,S,M);
 /* 共通：合図の光と、当たった瞬間の火花 */
 for(const c of (M.cues||[])){const d=tt-c.t;if(d>=0&&d<12){const tp=c.at?c.at(J):(c.w===2?J.tip2:J.tip)||J.hdF;if(c.col==='p')ring(B,tp[0],tp[1],3+d*.8,'p');else star(B,Math.round(tp[0]),Math.round(tp[1]),[2,4,5,5,4,4,3,3,2,2,1,1][d],c.col)}}
 for(const h of (M.hits||[])){const d=tt-h;if(d>=0&&d<8)spark(B,HXX+5,FL-12,d,M.hitCol||'w')}
 for(const tr of (M.trails||[]))if(tt>=tr[0]&&tt<=tr[1])trail(B,S,M,tt,ox,oy,4,tr[2]||'w',tr[3]);
 if(M.post)M.post(B,J,tt,S);
 B.outline();if(S.aura)aura(B,S.aura,tt);return B}
