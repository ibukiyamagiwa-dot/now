/* 覚悟の段（ページ全体で切りかえる）：n ふつう／r 赤い／k 黒い／v 紫の。段を描いてある敵（tintable）だけ変わる */
let KTINT=null;
/* いちばん大事な原則（2026-11-25）：合図は一回の攻撃ごとに、どの覚悟でも出す。連撃も一撃ごとに当たりの28F前に置く。
   意図して間の速い連撃（前の当たりから28Fより短い撃、「タタン」）は二回当たる一回の攻撃で、続きの撃の合図は覚悟「みならい」（MINARAI）だけ出す（ゲームの【速い連撃の二撃目以降の合図】＝0）。
   速くても残す合図：フェイントの紫の輪、別の「見る場所」に順に灯る合図（目・首・輪・触手など、at のあるもの）、残心に手を出したときの一撃。
   同じ場所にもう一度出る合図は、at があっても速い続きなら隠す（CUE_HIDE）。
   予告の連撃（yokoku。2026-11-26）は、予告で順とリズムを先に見せ、予兆は一撃目だけ。続きの撃の合図は、間に関係なくみならいだけ出す。 */
let MINARAI=false;
const CUE_KEEP=new Set(['r_zanpunish','r2_zanpunish','f_zanpunish','f2_zanpunish']),CUE_HIDE=new Set([]);
function cueHidden(M,c){const id=M.cueOf||M.id,src=M.cueOf?MV.find(m=>m.id===M.cueOf):M,c0=c._src||c;if(!src||CUE_KEEP.has(id)||c0.col==='p')return false;
 const hs=(src.hits||[]).slice().sort((a,b)=>a-b);if(hs.length<2)return false;const i=hs.findIndex(h=>Math.abs(h-(c0.t+28))<=3);if(src.yokoku)return i>=1;/* 予告の連撃：予兆は一撃目だけ。続きは予告で聞いたリズム */if(i<1||hs[i]-hs[i-1]>=28)return false;/* 前の当たりから28F以上あれば、ふつうの一撃 */
 return CUE_HIDE.has(id)||!c0.at}
/* ===== カードの描画：一枚に「主人公」と「敵」と「床」 ===== */
const CW=136,CH=118,FL=94,HXX_=26,FL_=94,EXX=92,HXX=26;
const SKY={def:['#1c1824','#241e2e'],gate:['#1e2230','#262c3c'],lord:['#140c18','#1e1424'],red:['#1e1418','#2a1c20'],hole:['#08060c','#100c18']};
function tipOf(S,P,ox,oy,which){const B0=new Buf(1,1),J=joints(ox,oy,S,Object.assign({},PDEF,S.pose,P));const W=which===2?S.w2:S.w,sw=which===2?P.sw2:P.sw;if(sw==null)return null;const h=which===2?J.hdB:J.hdF;return add(h,dir(sw,W.len*S.k))}
function trail(B,S,M,t,ox,oy,n,col,which){const base=Object.assign({},PDEF,S.pose);let prev=null;for(let i=n;i>=0;i--){const P=Object.assign({},base,poseAt0(M,t-i,base));if(M.pp)M.pp(P,t-i);fixPose(S,M,P,ox);const tp=tipOf(S,P,ox,oy,which);if(!tp)continue;const J=joints(ox,oy,S,P),hd=which===2?J.hdB:J.hdF;if(prev&&i>0){const c=FXC[col]||FXC.w;for(const s of [.7,.85,1]){B.line(lerp(prev[1][0],prev[0][0],s),lerp(prev[1][1],prev[0][1],s),lerp(hd[0],tp[0],s),lerp(hd[1],tp[1],s),s>.9?c[1]:c[0],4)}}prev=[tp,hd]}}
function drawHeroSmall(B,t,hit,PO){const H=new Buf(CW,CH);const P=PO||(hit?{ua:-.2,fa:-1.0,sw:-1.9,lean:.15,x:-1}:{});knight(H,CW-HXX,FL,SPEC.hero,P,t);B.blit(H,true)}
function spark(B,x,y,t,col){const c=FXC[col]||FXC.w;for(let i=0;i<8;i++){const a=i/8*Math.PI*2+t*.3,r=2+t*1.2;if(t<6)B.set(x+Math.cos(a)*r,y+Math.sin(a)*r,i%2?c[0]:c[1],4)}if(t<3)star(B,x,y,4-t,col)}
function floor(B,kind){const y=FL;const c=kind==='hole'?['#0c0a14','#1a1428']:kind==='lord'?['#1a1220','#2a1e30']:kind==='red'?['#2a1c1e','#3a2a2c']:['#22222e','#30303e'];for(let x=0;x<CW;x++){B.set(x,y+1,c[1],6);for(let yy=y+2;yy<CH;yy++)B.set(x,yy,((x+yy)%7===0)?c[1]:c[0],6)}}
function bgFill(ctx,kind){const g=SKY[kind]||SKY.def;ctx.fillStyle=g[0];ctx.fillRect(0,0,CW,CH);ctx.fillStyle=g[1];for(let y=0;y<FL;y+=4)ctx.fillRect(0,y,CW,1)}
/* 1コマ描く */
function frame(M,t){const tt=t%M.len,S=SPEC[M.fAt?M.fAt(tt):M.f],B=new Buf(CW,CH),base=Object.assign({},PDEF,S.pose);floor(B,M.bg||'def');
 const P=poseAt0(M,tt,base);if(M.pp)M.pp(P,tt);fixPose(S,M,P,EXX+(M.ox||0));if(KTINT&&S.tintable&&!P.tintFix)P.tint=KTINT;
 const ox=EXX+(M.ox||0),oy=FL;
 const hit=M.hits&&M.hits.some(h=>tt>=h&&tt<h+8);if(!M.noHero)drawHeroSmall(B,tt,hit,M.heroP?M.heroP(tt):null);
 if(M.pre)M.pre(B,tt,S,P);
 const J=(S.draw||knight)(B,ox,oy,S,P,tt);J.P=P;
 if(M.fx)M.fx(B,J,tt,S,M);
 /* 共通：合図の光と、当たった瞬間の火花 */
 for(const c of (M.cues||[])){if(c.silent||(!MINARAI&&cueHidden(M,c)))continue;/* silent＝光らない予兆（音で読む）。点検用に時刻だけ持つ */const d=tt-c.t;if(d>=0&&d<18){const tp=cueAnchor(M,S,c,base,ox,oy)||(c.at?c.at(J):(c.w===2?J.tip2:J.tip)||J.hdF);if(c.col==='p'){ring(B,tp[0],tp[1],4+d*.9,'p');ring(B,tp[0],tp[1],3+d*.9,'p');if(d<8)ring(B,tp[0],tp[1],5+d*.9,'p')}else cueStar(B,Math.round(tp[0]),Math.round(tp[1]),d,c.col)}}
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
function tipsOf(S,M,t,ox,oy,n,which){const base=Object.assign({},PDEF,S.pose),out=[];for(let i=n;i>=0;i--){const P=Object.assign({},base,poseAt0(M,t-i,base));if(M.pp)M.pp(P,t-i);fixPose(S,M,P,ox);const tp=tipOf(S,P,ox,oy,which);if(tp)out.push(tp)}return out}
function arcTrail(B,S,M,t,ox,oy,n,col,which){/* 弧：太い三日月。外側ほど明るい */const c=FXC[col]||FXC.w;const base=Object.assign({},PDEF,S.pose);let prev=null;for(let i=n;i>=0;i--){const P=Object.assign({},base,poseAt0(M,t-i,base));if(M.pp)M.pp(P,t-i);fixPose(S,M,P,ox);const tp=tipOf(S,P,ox,oy,which);if(!tp)continue;const J=joints(ox,oy,S,P),hd=which===2?J.hdB:J.hdF;
  if(prev){for(const s of[.55,.65,.75,.85,.95,1.05]){B.line(lerp(prev[1][0],prev[0][0],s),lerp(prev[1][1],prev[0][1],s),lerp(hd[0],tp[0],s),lerp(hd[1],tp[1],s),s>.9?c[1]:s>.7?c[0]:mix(c[0],'#000000',.4),4)}}prev=[tp,hd]}}
function lineTrail(B,S,M,t,ox,oy,n,col,which){/* 直線：切っ先の通り道に細い一本線と、平行な速さの線 */const c=FXC[col]||FXC.w;const T=tipsOf(S,M,t,ox,oy,n,which);if(T.length<2)return;const a=T[0],b=T[T.length-1],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L;
  B.line(a[0],a[1],b[0],b[1],c[1],4);B.line(a[0]+nx,a[1]+ny,b[0]+nx,b[1]+ny,c[0],4);for(const o of[-3,3,5]){const s=.3+Math.abs(o)*.06;B.line(lerp(a[0],b[0],s)+nx*o,lerp(a[1],b[1],s)+ny*o,b[0]+nx*o-dx*.1,b[1]+ny*o-dy*.1,c[0],4)}}

/* 吐く息：見えにくいくらいの、うすい湯気。口元から前へ細く出て、ゆるく上へ広がりながら、点が抜けて消える（18F） */
function breath(B,p,d,big){if(d<0||d>=18)return;const u=d/18,L=Math.round(2+d*.45*(big?1.4:1));for(let i=0;i<L;i++)for(let j=0;j<=(i>2?1:0);j++){const x=p[0]-1-i-d*.35,y=p[1]-d*.22-i*.18+(j?-1:0)+Math.sin(i*.8+d*.35)*.5;if(hsh(i*7+j,d)>.35+u*.6&&((i+j+d)&1))B.set(x,y,u<.4?'#7c7480':'#5e5864',5)}}

/* 剣先を床に刺さないようにする（騎士の姿の敵すべて）。刺さるぶんだけ、手首を折らずに腕ごと持ち上げる（剣は腕で振る）。
   例外：剣や鍵を床に突き立てる姿と、水の下から出てくる姿（鞘に納めているあいだは剣先がない） */
const PLANT=new Set(['g_kneel','l_kneel','l2_down','f_kneel','f_swallow','f2_end','l_plant','f_rise']);
function liftTip(S,M,P,ox){if(!S||(S.draw&&!S.knightLike)||PLANT.has(M.id)||M.plant)return;const two=CB_TWO.has(M.f);
 for(const w of[1,2]){const k=w===2?'sw2':'sw';if(P[k]==null||(w===2&&!S.w2))continue;
  for(let n=0;n<70;n++){const tp=tipOf(S,P,ox,FL,w);if(!tp||tp[1]<=FL)break;const s=Math.cos(P[k])<0?.04:-.04;
   if(w===1){P.ua+=s;P.fa+=s;P.sw+=s;if(two&&P.ua2!=null){P.ua2+=s;P.fa2+=s}}else{P.ua2+=s;P.fa2+=s;P.sw2+=s}}}}

/* 踏みこんでも、主人公に体を重ねない（手前で止める）。剣は届いてよい。すれちがって後ろへ抜ける居合だけは例外 */
const PASS=new Set(['r2_iai','r2_iai2','r2_silent','f_silent','f_iai']),NEAR=HXX+8;
function fixPose(S,M,P,ox){if(!S||(S.draw&&!S.knightLike))return;if(!M.noHero&&!PASS.has(M.id)){const J=joints(ox,FL,S,Object.assign({},PDEF,S.pose,P)),f=Math.min(J.hip[0],J.sc[0],J.head[0],J.footF[0],J.kneeF[0],J.shF[0]);if(f<NEAR)P.x=(P.x||0)+(NEAR-f)}liftTip(S,M,P,ox)}

/* 合図の光は、剣先についていかず、光った場所に残る（振っている最中に光が動くと読みにくい）。光った瞬間の位置を一度だけ求めて覚えておく */
function cueAnchor(M,S,c,base,ox,oy){if(!M._cueP)M._cueP=new Map();if(M._cueP.has(c))return M._cueP.get(c);let tp=null;
 try{const P=poseAt0(M,c.t,base);if(M.pp)M.pp(P,c.t);fixPose(S,M,P,ox);const W=new Buf(CW,CH),J=(S.draw||knight)(W,ox,oy,S,P,c.t);J.P=P;tp=c.at?c.at(J):(c.w===2?J.tip2:J.tip)||J.hdF;tp=tp?[tp[0],tp[1]]:null}catch(e){tp=null}
 M._cueP.set(c,tp);return tp}
