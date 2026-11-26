/* ===== 石なげ小鬼・小鬼のおかしら（中ボスとモブの四組目） =====
   迷宮に住みつく小鬼（生きているもの）。拍に合わせて石を投げるのは、遊び歌。おかしらの大岩には門の紋章がある＝封印の石を壊して遊んでいる。
   見た目の決まり：
   - 人型（小さい）の骨格。大きな頭、後ろへ長くのびた耳、かぎ鼻、にやけた口。目はにぶい色で光らない。腰に石の袋。
   - 攻撃は光らない（石は光らない）。読むのは音（投げるときの「ポイ」、飛んでいる石の「ヒュ・ヒュ・ヒュ」）と、足元に広がる石の影。「ヒュ・ヒュ・ヒュ」の次の拍で落ちる。
   - いちばん大事な原則（構えで数が分かる）：手に持った石の数＝投げる数。モブは両手に一つずつ（二つ）。おかしらは三つでお手玉（三つ）。お手玉の拍が、そのまま石の拍。
   - おかしらだけの技「大きな岩」（赤い光、重い）は、封印の石を頭の上へ持ち上げる構え。ふだんから背中側の床に置いてある。
   - 弾いた石は足元に落ちる（次のこうげきで投げ返せる）。大きな岩は弾くと三つに割れる。 */
const IMV={
 n:{lbl:'覚悟1 ふつう',name:'石なげ小鬼',skin:['#34461e','#5e7a3a','#7e9a52','#9cb46a'],vein:0,eyes:0},
 r:{lbl:'覚悟2 赤い',name:'赤い石なげ小鬼',skin:['#4a2420','#8a4a3a','#aa6a52','#c4846a'],vein:1,eyes:0},
 k:{lbl:'覚悟3 黒い',name:'黒い石なげ小鬼',skin:['#1c1e1a','#3e4038','#5a5c52','#74766a'],vein:2,eyes:1},
 v:{lbl:'覚悟4 紫の',name:'紫の石なげ小鬼',skin:['#2a1c3a','#4e3a64','#6a5084','#8468a0'],vein:2,eyes:2}};
const IMEYE='#cabe84',IMEYE2='#8a3a4a',IMTOOTH='#cfc6a6',IMMOUTH='#3a141a',IMTONGUE='#8a3a40',IMHAIR=['#d6caa4','#ece2c2','#a2967a'],IMSCAR='#a87a68',IMNAIL='#d8d0b4',
 ROCK=['#7a6e66','#a0948a','#463e3a'],ROCKHI='#cec4b6',SEAL=['#5e5a66','#807a8a','#33303a'],SEALG='#8a7030',
 IMRAG=['#5a4430','#7a6044','#2a1e14'],IMROPE='#9a8a64',IMNAVY=['#2e3a5e','#404e7a','#181e34'],IMNAVYG='#8a7030';
/* ===== 頭：1画素ずつ手で打ったドット絵（左を向く） =====
   記号：x 黒の線／1 肌の影／2 肌／3 肌の明るい面／4 いちばん明るい面／e 白目（にごった黄。光らない）／p 黒目／m 口の中／t 歯／n 耳の内側／o 舌／w 白い毛／s 古傷／k いぼ
   まゆの骨が目の上に張り出し、その下でぎょろ目が主人公を見る。鼻は鉤のように垂れて口にかぶさる。口は耳のほうへ切れ上がり、歯は欠けて不ぞろい。耳は長く、後ろへのびる。 */
const IMHEAD={
 imp:{piv:[11,14],ctr:[8,7],
  face:[
"......xxxxx......",
"....xx443332x....",
"...x4433322221x..",
"...x433221222221x",
"..x4332212222221x",
".x443333222222221x",
".xx1111xx22222221x",
"..x1pee1122222221x",
"..xx1ee1122222221x",
".x3x1122222222221x",
"x43x2222222222221x",
"x321x1xxxxx222221x",
".x21xtmtmtx22221x.",
"..xx.xmmmtm1221x..",
"......x222221xx...",
".......xxxxxx....."],
  ear:{at:[12,0],rows:[
"........xx",
".......x4x",
"......x44x",
".....x4n2x",
"....x4nn1x",
"...x3nn21x",
"..x3nn21x.",
".x3nn21x..",
"x3nn21x...",
"x2221x....",
"xxxx......"]},
  earFlat:{at:[13,4],rows:[
"...xxxxx...",
"xxx44443xx.",
"x33nnnn21xx",
"x2211111x..",
"xxxxxxx...."]},
  mouth:{y:11,laugh:[
"x321xtmtmtx22221x",
".x21xmmmmmx2221x.",
"..xx.xmoomt1221x.",
"......xt22221xx.."],
   o:[
"x321x1xxx1222221x",
".x21xmmmx122221x.",
"..xx.xmmx11221x..",
"......x222221xx.."]},
  eye:[[4,7],[5,7],[6,7],[5,8],[6,8]],
  eyes:{wide:'epeee',shut:'xx1x2',daze:'xexxe'},
  vein:[[9,2],[10,3],[10,4],[11,5],[12,6]],third:[[7,3],[8,3]],more:[[[12,9],[13,9]],[[11,2],[12,2]]]},
 impM:{piv:[14,19],ctr:[11,9],front:15,
  face:[
"........xxxxxx........",
"......xx4443332x......",
".....x44433322221x....",
"....x4433221111221x...",
"...x443322222222221x..",
"...x4332211111122221x.",
"..x43322222222222221x.",
".xuuuuu43222222222221x",
"xuuwwwwwv22222222221x.",
".xvwvwvvx12222222221x.",
"..xx1eeesx12222222221x.",
"...x1111x1s222222221x..",
"...x112222222222222x...",
"...x222222222222221x...",
"...x12222222222221x....",
"...xuuuuuuuuu12221x...",
"..xuuuuuuuuuuuuu221x",
"..xuuuwuuuuwuuuuw121x",
".xuwwwwuwwwwwwwwv121x..",
".xvxwvxwwvxwvxwvx1x....",
"....xwwvwwvwwvwwx1x....",
"....xwwvwwvwwvwx.......",
".....xwvwwvwwvx........",
".....xwvwwvwvx.........",
"......xvwwvwx..........",
"......xwvwvx...........",
".......xvwx............"],
  ear:{at:[15,0],rows:[
"...........ww",
"..........xwx",
".........x4nx",
"........x4n.x",
".......x4nn1x",
"......x4nnn1x",
".....x3nnn21x",
"....x3nnn21x.",
"...x3nnn21x..",
"..x3nn221x...",
".x32n21x.....",
"x22221x......",
"xxxxx........"]},
  earFlat:{at:[16,6],rows:[
"...xxxxxxx....",
"xxx4444443xxww",
"x33nnnn.n21xx.",
"x22111111x....",
"xxxxxxxxx....."]},
  mouth:{y:19,laugh:[
".xvxxmoomxxwvxwvx1x"],
   o:[
".xvxwxmmxwxwvxwvx1x"]},
  eye:[[5,9],[6,9],[7,9],[5,10],[6,10]],
  eyes:{wide:'epeee',shut:'xx1x2',daze:'xexxe'},
  vein:[[12,2],[13,3],[14,4],[15,5],[16,6],[17,7]],third:[[9,4],[10,4]],more:[[[16,11],[17,11]],[[14,1],[15,1]]],beard:[9,26]}};
function imGrid(H,P){const g=H.face.map(r=>r.split(''));const put=(ox,oy,rows)=>rows.forEach((r,y)=>[...r].forEach((c,x)=>{if(c==='.')return;const Y=oy+y,X=ox+x;while(g.length<=Y)g.push([]);while(g[Y].length<=X)g[Y].push('.');g[Y][X]=c}));
 const ear=P.ear>=.5?H.earFlat:H.ear;put(ear.at[0],ear.at[1],ear.rows);
 const g2=P.grin||0;if(P.ear>=.5)put(0,H.mouth.y,H.mouth.o);else if(g2>=.6)put(0,H.mouth.y,H.mouth.laugh);
 const es=P.daze?'daze':(P.ear>=.5||P.ear<=-.5)?'wide':/* ear<=-.5＝びくっとして目をむく（耳は寝かせない） */g2>=.9?'shut':null;if(es)H.eye.forEach(([x,y],i)=>{g[y][x]=H.eyes[es][i]});
 /* 外まわりの黒は描かない（体全体の輪郭線が引く）。内側の線だけ残す */
 const W=Math.max(...g.map(r=>r.length)),at=(x,y)=>(g[y]&&g[y][x])||'.';const o=g.map((r,y)=>r.map((c,x)=>c==='x'&&[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>at(x+a,y+b)==='.')?'.':c));return o}
function imStamp(B,H,P,at,a,V,y0){y0=y0||0;const g=imGrid(H,P),sk=V.skin,col={'1':sk[0],'2':sk[1],'3':sk[2],'4':sk[3],x:OUT,p:OUT,e:IMEYE,m:IMMOUTH,t:IMTOOTH,n:mix(sk[0],'#9a4a4a',.45),o:IMTONGUE,w:IMHAIR[0],u:IMHAIR[1],v:IMHAIR[2],s:IMSCAR,k:sk[0]};
 const ax=Math.round(at[0]),ay=Math.round(at[1]),[px,py]=H.piv,c=Math.cos(a),s=Math.sin(a),h=g.length,w=Math.max(...g.map(r=>r.length));
 const L2D=(lx,ly)=>{const dx=lx+.5-px,dy=ly+.5-py;return[ax+dx*c-dy*s,ay+dx*s+dy*c]};
 if(a===0){g.forEach((r,y)=>r.forEach((ch,x)=>{if(ch!=='.'&&y>=y0)B.set(ax+x-px,ay+y-py,col[ch],1)}))}
 else{const R=Math.hypot(w,h)+2;for(let Y=Math.floor(ay-R);Y<=ay+R;Y++)for(let X=Math.floor(ax-R);X<=ax+R;X++){const dx=X+.5-ax,dy=Y+.5-ay,lx=Math.floor(dx*c+dy*s+px),ly=Math.floor(-dx*s+dy*c+py);const ch=ly>=y0&&g[ly]&&g[ly][lx];if(ch&&ch!=='.')B.set(X,Y,col[ch],1)}}
 const put=(x,y,cc)=>{const d=L2D(x,y);B.set(Math.floor(d[0]),Math.floor(d[1]),cc,1)};
 if(y0)return{ctr:L2D(H.ctr[0],H.ctr[1]),L2D};
 /* 覚悟の段：頭に黒い筋、光らない目が増える */
 if(V.vein>=1)H.vein.forEach(([x,y])=>put(x,y,'#1a1220'));
 if(V.eyes>=1){put(H.third[0][0],H.third[0][1],IMEYE2);put(H.third[1][0],H.third[1][1],OUT)}
 if(V.eyes>=2)for(const e of H.more){put(e[0][0],e[0][1],IMEYE2);put(e[1][0],e[1][1],OUT)}
 return{ctr:L2D(H.ctr[0],H.ctr[1]),L2D}}
/* 石と、石の袋。rF/rB＝前・後ろの手に石、jug/jn＝お手玉（数）、bigUp＝大岩を頭の上へ。石は攻略でいちばん大事な情報なので、光らせずに、ふちの明るい一点で数えやすくする */
function rock(B,x,y,r,c){B.disc(x,y,r,(c||ROCK)[0],(c||ROCK)[1],(c||ROCK)[2]);if(!c&&r>=1.5)B.set(x-r*.45,y-r*.45,ROCKHI,1)}
const BIGR=7.4;
function sealRock(B,x,y,r){rock(B,x,y,r,SEAL);/* 閉じた門の紋章（くすんだ金）：アーチと、まん中の合わせ目。削られて欠けている */for(let a=Math.PI;a<=Math.PI*2.01;a+=.3)B.set(x+Math.cos(a)*r*.5,y+Math.sin(a)*r*.5+r*.1,SEALG,2);B.line(x-r*.5,y+r*.12,x-r*.5,y+r*.5,SEALG);B.line(x+r*.5,y+r*.12,x+r*.5,y+r*.5,SEALG);B.line(x,y-r*.35,x,y+r*.5,SEALG);
 B.line(x+r*.35,y-r*.8,x+r*.75,y-r*.15,SEAL[2]);B.line(x+r*.42,y-r*.7,x+r*.8,y-r*.1,SEAL[2]);/* 爪で削った欠け */for(const[dx,dy]of[[-.3,-.6],[.6,.3],[-.7,.0]])B.set(x+r*dx,y+r*dy,SEAL[2],2)}
const impRockR=k=>2.2*k/.7;
function impBehind(B,J,T,P,S){if(S.big&&!(P.bigUp>0)&&!P.bigGone)sealRock(B,J.hip[0]+(14*J.k)+3+(P.bigX||0),FL-BIGR+.5,BIGR)}
function impFront(B,J,T,P,S){const k=J.k,rr=impRockR(k);
 if(P.rF)rock(B,J.hdF[0]-1,J.hdF[1]-rr*.7,rr);if(P.rB)rock(B,J.hdB[0],J.hdB[1]-rr*.7,rr);
 if(P.jug>0&&P.jn>0){const c=J.jc||[J.head[0]-13*k/.7,J.head[1]+1];for(let i=0;i<P.jn;i++){const a=(T/39+i/3)*Math.PI*2;rock(B,c[0]+Math.cos(a)*4*k,c[1]+Math.sin(a)*7*k,rr)}}
 if(P.bigUp&&J.big)sealRock(B,J.big[0],J.big[1],BIGR)}
const lerpP=(a,b,u)=>[lerp(a[0],b[0],u),lerp(a[1],b[1],u)];
/* ===== 体：騎士の部品を使わない、小鬼だけの体 =====
   約2頭身。猫背で、腹が出て、脚は短く、腕は長い（手が地面に届きそう）。大きな手に爪。手が大きいのは、石を持つ手がいちばん大事だから。
   モブ：門番の前垂れとは関係のない、ただの麻のぼろ布の腰巻と縄の帯。腰に石の袋。
   おかしら：拾った門番の紺の前垂れ（金のふちがすり切れている）を、首に結んでマントにしている。あごひげの先を、削り取った封印のかけらで結ぶ（首飾りはやめた）。年寄りで、まゆと耳の先に白い毛、目をまたぐ古傷、欠けた歯。 */
function imArm(B,sh,el,hd,k,sk,front){const b=front?sk[1]:sk[0],h=front?sk[2]:sk[1],l=sk[0];
 B.thick(sh,el,1.05*k,b,h,l);B.thick(lerpP(el,hd,.1),lerpP(el,hd,.8),1.35*k,b,h,l);B.disc(el[0],el[1],1.25*k,b,h,l);
 const u=[hd[0]-el[0],hd[1]-el[1]],L=Math.hypot(u[0],u[1])||1,d=[u[0]/L,u[1]/L],n=[-d[1],d[0]];B.disc(hd[0],hd[1],1.75*k,b,h,l);
 for(const s of[-1,0,1]){const p=[hd[0]+d[0]*2.2*k+n[0]*s*1.3*k,hd[1]+d[1]*2.2*k+n[1]*s*1.3*k];B.set(p[0],p[1],front?b:l,1);B.set(p[0]+d[0]*1.1,p[1]+d[1]*1.1,IMNAIL,1)}}
function imHand(B,el,hd,k,sk,front){const b=front?sk[1]:sk[0],h=front?sk[2]:sk[1],l=sk[0];const u=[hd[0]-el[0],hd[1]-el[1]],L=Math.hypot(u[0],u[1])||1,d=[u[0]/L,u[1]/L],n=[-d[1],d[0]];B.disc(hd[0],hd[1],1.75*k,b,h,l);
 for(const s of[-1,0,1]){const p=[hd[0]+d[0]*2.2*k+n[0]*s*1.3*k,hd[1]+d[1]*2.2*k+n[1]*s*1.3*k];B.set(p[0],p[1],b,1);B.set(p[0]+d[0]*1.1,p[1]+d[1]*1.1,IMNAIL,1)}}
function imLeg(B,hp,kn,ft,k,sk,front){const b=front?sk[1]:sk[0],h=front?sk[2]:sk[1],l=sk[0];
 B.thick(hp,kn,1.55*k,b,h,l);const an=[ft[0]+.5*k,ft[1]-1.6*k];B.thick(kn,an,1.05*k,b,h,l);B.disc(kn[0],kn[1],1.3*k,b,h,l);
 B.poly([[ft[0]-5.5*k,ft[1]],[ft[0]+2.2*k,ft[1]],[ft[0]+1.8*k,ft[1]-2.4*k],[ft[0]-1.6*k,ft[1]-2.2*k],[ft[0]-4.5*k,ft[1]-1.2*k]],b,h,l);
 for(const i of[0,1.6])B.set(ft[0]-5.8*k+i*k,ft[1]-.6,IMNAIL,1)}
function impFig(B,ox,oy,S,P0,T){const P=Object.assign({},PDEF,S.pose||{},P0||{});P.cr=(P.cr||0)*.62;
 const J=joints(ox,oy,S,P);J.P=P;P.T=T;const k=S.k,V=IMV[P.tint]||IMV.n,sk=V.skin,L=-J.lean,h=J.hip,R=v=>add(h,rot(v,L)),isM=!!S.big;
 if(S.behind)S.behind(B,J,T,P);
 /* おかしらのマント（門番の紺の前垂れの切れ端）：背中側に垂れる。すそはぼろぼろ */
 if(isM){const w=Math.sin(T*.06)*1.2,top=[R([-1.5*k,-11.5*k]),R([3*k,-12*k]),R([7*k,-9*k]),R([(10.5+w*.5)*k,-2*k])],hem=[],n=6,x0=h[0]+(11+w)*k,x1=h[0]+.5*k;
  for(let i=0;i<=n;i++){const t2=i/n;hem.push([lerp(x0,x1,t2),FL-2-((i%2)?3.5*k:0)-t2*3*k])}B.poly([...top,...hem,R([0,-2*k])],IMNAVY[0],IMNAVY[1],IMNAVY[2]);
  /* すり切れた金のふち（門番の前垂れと同じ金）。ところどころ切れている */for(let i=0;i<=24;i++){const u=i/24;if(hsh(i,7)<.3)continue;const p=u<.5?lerpP(top[2],top[3],u*2):lerpP(top[3],hem[0],(u-.5)*2);B.set(p[0],p[1],IMNAVYG,2)}
  /* 閉じた門の紋章の名残：アーチの半分だけ */const m=R([7*k,-5*k]);for(let a2=Math.PI;a2<=Math.PI*1.55;a2+=.3)B.set(m[0]+Math.cos(a2)*2,m[1]+Math.sin(a2)*2,IMNAVYG,2);B.line(m[0]-2,m[1],m[0]-2,m[1]+2,IMNAVYG,2)}
 const hb=R([-1.8*k,-10.5*k]),HD=IMHEAD[isM?'impM':'imp'];let a=-P.lean*.35-P.hd;if(Math.abs(a)<.12)a=0;
 {const dx=HD.ctr[0]+.5-HD.piv[0],dy=HD.ctr[1]+.5-HD.piv[1];J.head=[Math.round(hb[0])+dx*Math.cos(a)-dy*Math.sin(a),Math.round(hb[1])+dx*Math.sin(a)+dy*Math.cos(a)]}
 /* 大きな岩：頭の上にのせ、両手をのばして両わきを支える（腕は届くところまでのびる） */
 if(P.bigUp){const top=J.head[1]-HD.ctr[1]-1,c1=[J.head[0]+1,top-BIGR+3],c0=[J.hip[0]+(14*k)+3,FL-BIGR+.5],u=Math.min(1,P.bigUp),e=u*u*(3-2*u),c=[c0[0]+(c1[0]-c0[0])*e,c0[1]+(c1[1]-c0[1])*e];/* bigUp 0→1：背中側の床から頭の上へ持ち上げる */J.big=c;for(const[s,sh,ky]of[[-1,J.shF,'F'],[1,J.shB,'B']]){const hd=[c[0]+s*(BIGR-1),c[1]+2],d=Math.hypot(hd[0]-sh[0],hd[1]-sh[1]),L=Math.max(7*k,d/2+.6);J['hd'+ky]=hd;J['el'+ky]=ik(sh,hd,L,L,s<0?1:-1)}}
 /* お手玉：石の輪は顔の前。両手は輪の下で受ける（手が拍ごとに上下する） */
 if(P.jug>0&&P.jn>0){const kk=k/.7,c=[J.head[0]-13*kk,J.head[1]+1];J.jc=c;const bob=Math.sin(T/39*Math.PI*6)*1;for(const[s,sh,ky,bd]of[[-1,J.shF,'F',1],[1,J.shB,'B',1]]){const hd=[c[0]+s*3*k,c[1]+7*k+(s<0?bob:-bob)],d=Math.hypot(hd[0]-sh[0],hd[1]-sh[1]),L=Math.max(7*k,d/2+.6);J['hd'+ky]=hd;J['el'+ky]=ik(sh,hd,L,L,bd)}}
 imArm(B,J.shB,J.elB,J.hdB,k,sk,false);
 imLeg(B,J.hpB,J.kneeB,J.footB,k,sk,false);
 /* 胴：猫背の背中のこぶと、前へ出た腹 */
 B.poly([R([-2.5*k,-9.5*k]),R([2.5*k,-10.5*k]),R([5*k,-6.5*k]),R([3.5*k,.5*k]),R([-2.5*k,.5*k]),R([-4.5*k,-4*k])],sk[1],sk[2],sk[0]);
 B.disc(...R([2.4*k,-8*k]),3.2*k,sk[1],sk[2],sk[0]);/* 背中のこぶ */
 const bc=R([-2.2*k,-3.6*k]);B.disc(bc[0],bc[1],5.3*k,sk[1],sk[3],sk[0]);/* 腹 */
 B.set(bc[0]-1,bc[1]+1,sk[0],1);/* へそ */for(let i=0;i<3;i++)B.set(...R([(-1+i*.9)*k,(-6.8+i*.2)*k]),sk[0],1);/* あばら */
 for(let i=0;i<3;i++)B.set(...R([(4.6-i*.3)*k,(-7-i*1.6)*k]),sk[3],1);/* 背骨のでっぱり */
 /* 腰巻と縄の帯 */
 const rg=[R([-4.6*k,-.8*k]),R([4*k,-1*k]),R([4.6*k,2.6*k]),R([3*k,1.8*k]),R([2*k,3.4*k]),R([.4*k,2.2*k]),R([-1*k,3.8*k]),R([-2.6*k,2.4*k]),R([-4.2*k,3*k])];
 B.poly(rg,IMRAG[0],IMRAG[1],IMRAG[2]);
 for(let i=0;i<=8;i++){const p=R([lerp(-4.6,4.2,i/8)*k,(-.9-(i%2)*.3)*k]);B.set(p[0],p[1],i%2?IMROPE:mix(IMROPE,'#000000',.4),1)}
 /* 腰の石の袋：口から石がのぞく */const pc=R([3.6*k,1.8*k]);B.disc(pc[0],pc[1],2.5*k,IMRAG[0],IMRAG[1],IMRAG[2]);B.line(pc[0]-1,pc[1]-2.2*k,pc[0]+1,pc[1]-2.2*k,IMROPE);B.set(pc[0]-1,pc[1]-2.6*k,ROCK[1],1);B.set(pc[0]+1,pc[1]-2.8*k,ROCK[0],1);
 imLeg(B,J.hpF,J.kneeF,J.footF,k,sk,true);
 /* 首と頭：頭は肩より前に出る（猫背）。体がかたむいても、頭はあまりかたむかない */
 if(P.bigUp)imArm(B,J.shF,J.elF,J.hdF,k,sk,true);/* 岩を持ち上げるときは、腕は大きな頭のうしろを通る */
 B.thick(R([-.5*k,-9*k]),hb,1.6*k,sk[1],sk[2],sk[0]);
 const ST=imStamp(B,HD,P,hb,a,V);J.head=ST.ctr;
 /* おかしらのあごひげ：胸まで垂れ、体に遅れて揺れる。先を封印のかけらで結ぶ（削り取ったかけら）。手と石より奥に描く */
 if(HD.beard){const kk=k/.7,c0=ST.L2D(HD.beard[0],HD.beard[1]-.5),sw=Math.sin(T*.07)*1+P.lean*4,up=P.ear>=.5?1:0;
  const end=[c0[0]+sw+(up?-5*kk:1.5*kk),c0[1]+(up?2:3.5)*kk],mid=[lerp(c0[0],end[0],.5)+(up?-2:1.2)*kk,lerp(c0[1],end[1],.5)];
  J.beard=[mid,end];J.beardDraw=()=>{  B.tube(c0,mid,end,1.1*kk,.5*kk,IMHAIR[0],IMHAIR[1],IMHAIR[2],1);for(let i=1;i<1;i++){const u=i/4,p=[(1-u)*(1-u)*c0[0]+2*u*(1-u)*mid[0]+u*u*end[0],(1-u)*(1-u)*c0[1]+2*u*(1-u)*mid[1]+u*u*end[1]];B.set(p[0]+(i%2?1:-1),p[1],IMHAIR[2],1)}
  B.set(end[0],end[1]-1,IMROPE,1);B.set(end[0]+1,end[1]-1,IMROPE,1);B.disc(end[0]+.5,end[1]+1.4,1.2*kk,SEAL[0],SEAL[1],SEAL[2],1);B.set(end[0]+.5,end[1]+1.4,SEALG,1)}}
 /* ひげをなでる（おかしらの、ひまなとき） */
 if(P.stroke>0&&J.beard){const b=ST.L2D(9,22.5+Math.sin(T*.22)*2.5),hd=[b[0]+1,b[1]],d=Math.hypot(hd[0]-J.shF[0],hd[1]-J.shF[1]),L2=Math.max(7*k,d/2+.6),u2=Math.min(1,P.stroke);J.hdF=lerpP(J.hdF,hd,u2);J.elF=ik(J.shF,J.hdF,L2,L2,1)}
 /* おかしらのひげ飾り：削り取った封印のかけら（くすんだ金の紋のかけら）で、あごひげの先を結ぶ */
 if(!P.bigUp)imArm(B,J.shF,J.elF,J.hdF,k,sk,true);
 /* ひげは手前の腕より手前：腕はひげの奥を通る（貫通して見えない）。なでるときだけ、手をひげの上に出す */
 if(HD.front){imStamp(B,HD,P,hb,a,V,HD.front);if(J.beardDraw)J.beardDraw();if(P.stroke>.5&&!P.bigUp)imHand(B,J.elF,J.hdF,k,sk,true)}
 if(V.vein>=2){for(const[a2,b2]of[[J.shF,J.elF],[J.elF,J.hdF]])for(let i=0;i<4;i++)B.set(lerp(a2[0],b2[0],i/4)+(i%2),lerp(a2[1],b2[1],i/4),'#1a1220',2)}
 if(S.front)S.front(B,J,T,P);
 return J}
const IMBASE={hk:2.05,lk:.5,tk:.66,pal:Object.assign({},PAL.guard),
 behind:(B,J,T,P)=>impBehind(B,J,T,P,SPEC[P._who]||{}),front:(B,J,T,P)=>impFront(B,J,T,P,SPEC[P._who]||{})};
Object.assign(PDEF,{ear:0,grin:0,rF:0,rB:0,jug:0,jn:0,bigUp:0,bigGone:0,bigX:0,parried:0,daze:0,stroke:0});
const IMPOSE={ua:2.0,fa:2.4,sw:null,ua2:1.5,fa2:2.0,ff:-6,fb:6,cr:2.4,lean:.16,hd:-.05};
SPEC.imp=Object.assign({},IMBASE,{name:'石なげ小鬼',k:.7,draw:(B,ox,oy,S,P,T)=>impFig(B,ox,oy,S,Object.assign({},P,{_who:'imp'}),T),knightLike:true,tintable:true,pose:IMPOSE});
SPEC.impM=Object.assign({},IMBASE,{name:'小鬼のおかしら',k:.875,big:true,draw:(B,ox,oy,S,P,T)=>impFig(B,ox,oy,S,Object.assign({},P,{_who:'impM'}),T),knightLike:true,tintable:true,pose:IMPOSE});
for(const k of['imp','impM'])SPEC[k+'@w']=flashSpec(k);

/* 石の飛び方：投げた手から、主人公の頭へ、高い山なり。1拍ごとに「ヒュ」（音の輪）、足元の影が一段ずつ濃く大きくなり、4拍目で落ちる。
   拍はおかしら13F（4拍目＝52F）、石なげ小鬼（モブ）16F（4拍目＝64F。2026-11-25：序盤のモブに13Fは速い） */
const LOB=52,BEAT=13,BEAT_MOB=16,HEADP=[HXX+4,FL-15];
function soundArc(B,c,d){if(d<0||d>=8)return;const r=2+d*.9;for(let a=-.8;a<=.8;a+=.2){B.set(c[0]-Math.cos(a)*r,c[1]+Math.sin(a)*r,d<4?'#a8a0b0':'#6a6278',4);B.set(c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r,d<4?'#a8a0b0':'#6a6278',4)}}
function lobFx(B,t,t0,from,P,big,bt){bt=bt||BEAT;const lob=bt*4,d=t-t0;if(d<0)return;const r=big?BIGR:impRockR(.7);
 if(d<=lob){const u=d/lob,x=lerp(from[0],HEADP[0],u),y=lerp(from[1],HEADP[1],u)-58*4*u*(1-u);(big?sealRock:rock)(B,x,y,r);
  const st=Math.min(3,Math.floor(d/bt)),w=3+st*3;for(let dx=-w;dx<=w;dx++)if((dx+st)%(4-st)===0||st===3)B.set(HXX+5+dx,FL+1,st>=2?'#000000':'#1a1620',5);/* 足元の影 */
  for(const b of[bt,bt*2,bt*3])soundArc(B,[x,y],d-b)}
 else if(!P.parried){const e=d-lob;if(e<18){const x=HEADP[0]-e*1.1,y=HEADP[1]-e*2.2+e*e*.22;if(y<FL-1)rock(B,x,y,r);else rock(B,x,FL-r,r)}}}
/* 大きな岩：持ち上げた頭の上から、短い山なりで投げる */
function bigFx(B,t,t0,t1,from,P){if(t<t0)return;if(t<=t1){const u=(t-t0)/(t1-t0);sealRock(B,lerp(from[0],HEADP[0]+4,u),lerp(from[1],HEADP[1]-2,u)-14*4*u*(1-u),BIGR)}
 else if(!P.parried){const e=t-t1;if(e<26){sealRock(B,HEADP[0]+4-e*.4,Math.min(FL-BIGR,HEADP[1]-2+e*e*.3),BIGR);if(e>8&&e<20)for(let i=0;i<5;i++)B.set(HEADP[0]+i*3-6,FL-1-(i%2),ROCK[0],5)}}}
const rocksAtFeet=(B,n)=>{for(let i=0;i<n;i++)rock(B,HXX+14+i*6,FL-2-(i%2),impRockR(.7))};

/* 構え */
const IMW1={ua:-2.5,fa:-2.0,rF:1},IMW1J={ua:-2.5,fa:-2.0},/* お手玉のときは、振りかぶりで手に石を足さない（石の数＝投げる数） */IMR1={ua:-1.0,fa:-.55,rF:0,lean:.24},IMW2={ua2:-2.3,fa2:-1.9,rB:1},IMR2={ua2:-1.0,fa2:-.6,rB:0,lean:.24};
const IM2={ua:1.6,fa:-.4,ua2:1.3,fa2:-.7,rF:1,rB:1,cr:3.2,lean:.12,grin:.6};/* 二つ投げ：両手に石を一つずつ持ち、ひざで拍をとる */
const IMJ={ua:2.6,fa:-2.3,ua2:2.4,fa2:-2.0,jug:1,jn:3,cr:2.6,lean:.02,hd:-.25,grin:.8};/* 三つ投げ：三つでお手玉 */
const IMB={ua:-1.85,fa:-1.6,ua2:-1.4,fa2:-1.75,bigUp:1,cr:4.2,lean:-.04,ff:-8,fb:8,hd:-.1,grin:.2};/* 大きな岩：封印の石を頭の上へ */
const IMBT={ua:2.5,fa:2.8,ua2:2.3,fa2:2.7,bigUp:0,cr:3,lean:.42,ff:-9,fb:7,grin:1};
const impIdlePP=(P,t)=>{P.cr=(P.cr||0)+Math.abs(Math.sin(t*Math.PI/48))*.5};
const handF=J=>add(J.hip,[-5*J.k,-20*J.k]);

function imCards(f,pre,isM){const ox=isM?4:10,bg='def',S=SPEC[f],k=S.k;
 mv({f,ox,id:pre+'_idle',n:'立ち絵',bg,len:96,keys:[K(0,{}),K(96,{})],pp:impIdlePP,
  cap:isM?'年寄りの小鬼。もじゃもじゃの白いまゆ、ふくらんだ白い口ひげ、胸まで流れるあごひげ（先を封印のかけらで結ぶ）。拾った門番の紺の前垂れをマントにしている。目をまたぐ古傷、耳の先の白い毛。背中側の床に、門の紋章が彫られた大きな石（封印の石）。':'約2頭身。張り出したまゆの骨の下で、にごった黄色のぎょろ目が主人公を見る。鉤のように垂れた鼻、耳のほうへ切れ上がった口と不ぞろいの歯、後ろへのびた長い耳。猫背で腹が出て、脚は短く、腕は長い。大きな手に白い爪。麻のぼろ布の腰巻と縄の帯、腰に石の袋。',
  why:'子どもが遊ぶように、石を投げに来る。悪意より遊び。だから顔はいつもにやけている。'});
 if(!isM)mv({f,ox,id:pre+'_bored',n:'ひまなとき：小石を拾う',bg,len:150,
  keys:[K(0,{}),K(16,{}),K(28,{ua:2.6,fa:2.2,lean:.45,cr:4,hd:.3},'io'),K(44,{ua:2.6,fa:2.2,lean:.45,cr:4,hd:.3}),K(56,{ua:-2.6,fa:-2.6,rF:1,lean:.05,hd:-.2},'io'),K(84,{ua:-2.6,fa:-2.6,rF:1,lean:.05,hd:-.2}),K(92,{ua:-1.2,fa:-.4,rF:0,lean:-.12,hd:-.35,grin:1},'out'),K(120,{grin:1},'io'),K(150,{})],
  pp:(P,t)=>{impIdlePP(P,t);if(t>=44&&t<56)P.rF=1;if(t>=92&&t<120)P.cr+=((t>>2)&1)*.6},
  fx:(B,J,t)=>{if(t>=92&&t<130){const d=t-92;rock(B,J.head[0]+4+d*1.6,J.head[1]-6-d*1.2+d*d*.09,1.6)}},
  cap:'しゃがんで床の小石を拾い、鼻先でにおいをかいで、後ろへぽいと放る。肩をゆらして笑う。光らない。',
  why:'石は遊び道具。ここでは何を見ても遊ぶ。'});
 else mv({f,ox,id:pre+'_bored',n:'ひまなとき：封印の石を削り、ひげをなでる',bg,len:210,
  keys:[K(0,{}),K(20,{}),K(34,{ua2:.3,fa2:.15,hd:.7,lean:-.08},'io'),K(130,{ua2:.3,fa2:.15,hd:.7,lean:-.08}),K(144,{grin:1,stroke:1},'io'),K(190,{grin:1,stroke:1}),K(210,{})],
  pp:(P,t)=>{impIdlePP(P,t);if(t>=34&&t<130)P.fa2=.15+Math.sin(t*.8)*.25},
  fx:(B,J,t)=>{if(t>=36&&t<130&&(t%6)<2){const c=[J.hip[0]+12*J.k,FL-9];for(let i=0;i<3;i++)B.set(c[0]+i-1,c[1]-((t+i)%3),ROCK[1],5)}},
  cap:'後ろ手で、背中側の大きな石の紋章を爪でガリガリ削る。石くずが飛ぶ。削り終えると、こちらを見て目を細め、満足そうにひげをなでる。光らない。',
  why:'門の紋章は封印の印。小鬼たちは、それを遊びで壊している。封印がゆるむ理由の一つ。'});
 mv({f,ox,id:pre+'_enter',n:isM?'出現：大きな石を引きずってくる':'出現：上から飛び降りる',bg,len:110,
  keys:isM?[K(0,{x:44,ua2:.4,fa2:.2,lean:.3,bigX:0}),K(56,{x:0,ua2:.4,fa2:.2,lean:.3},'lin'),K(60,{ua2:-.9,fa2:-1.5,lean:.1},'out'),K(64,{ua2:.6,fa2:.1,lean:.2},'in')/* 石をぽんとたたく */,K(68,{grin:1},'io'),K(110,{})]:[K(0,{lift:70,ua:-2.4,fa:-2.2,ua2:-2.2,fa2:-2.0,cr:0}),K(18,{lift:0,ua:-2.4,fa:-2.2,ua2:-2.2,fa2:-2.0,cr:0},'in'),K(22,{cr:6,lean:.3}),K(30,{cr:1.5},'out'),K(40,{grin:1}),K(70,{grin:1}),K(90,{},'io'),K(110,{})],
  pp:(P,t)=>{if(isM&&t<56){const s=Math.sin(t*TAU_/16);P.ff=-6+s*3;P.fb=6-s*3}if(t>=40&&t<70)P.lean=(P.lean||0)+((t>>2)&1)*.06},
  fx:(B,J,t)=>{if(!isM&&t>=18&&t<26)for(let i=0;i<6;i++)B.set(J.footF[0]-6+i*3,FL-((t+i)%2),'#6a6278',5)},
  cap:isM?'背中で大きな封印の石を引きずって歩いてくる。止まって、石をぽんとたたき、にやりとする。':'上の暗がりから飛び降りて、しゃがんで着地する。ケケケと肩をゆらして笑う。',
  why:isM?'封印の石は、おかしらのお気に入りのおもちゃ。いつも持ち歩いている。':'迷宮の高いところに住みつく。どこからでも降ってくる。'});
 /* 攻撃 */
 if(!isM)mv({f,ox,id:pre+'_two',n:'二つ投げ（ヒュ・ヒュ・ヒュ・ドン・ドン）',bg,len:150,
  keys:[K(0,{}),K(8,IM2,'out'),K(26,IM2),K(28,Object.assign({},IM2,IMW1),'out'),K(30,Object.assign({},IM2,IMR1),'in'),K(42,Object.assign({},IM2,IMR1,IMW2),'out'),K(44,Object.assign({},IM2,IMR1,IMW2)),K(46,Object.assign({},IM2,IMR1,IMR2),'in'),K(63,{grin:1},'io'),K(150,{})],
  pp:(P,t)=>{if(t>=14&&t<30)P.cr+=Math.abs(Math.sin((t-14)*Math.PI/16))*.9;/* ひざで1拍（16F）とって、その拍のまま30Fで投げる */if(t>=30)P.rF=0;if(t>=46)P.rB=0},
  cues:[{t:30,col:'w',silent:true},{t:46,col:'w',silent:true}],hits:[30+BEAT_MOB*4,46+BEAT_MOB*4],
  fx:(B,J,t,S2,M)=>{const P=J.P||{};lobFx(B,t,30,handF(J),P,0,BEAT_MOB);lobFx(B,t,46,handF(J),P,0,BEAT_MOB)},
  cap:'袋から石を二つ出し、両手に一つずつ持って、ひざで拍をとる（手の石の数＝投げる数）。ポイ、ポイと16Fおきに二つ投げる。石は光らない。飛んでいる石がヒュ・ヒュ・ヒュと鳴るたび、足元の影が一段ずつ大きく濃くなり、その次の拍（投げてから64F）で落ちる。二つ目はその16F後。拍はおかしら（13F）よりゆっくり。',
  why:'拍（リズム）の読み方は、おかしらで先に教わっている。光の代わりに、音と影で数える。持っている石が二つなら二つ来る。'});
 else{mv({f,ox,id:pre+'_three',n:'三つ投げ（お手玉から・ドン・ドン・ドン）',bg,len:160,
  keys:[K(0,{}),K(8,IMJ,'out'),K(26,IMJ),K(28,Object.assign({},IMJ,IMW1J),'out'),K(30,Object.assign({},IMJ,IMR1),'in'),K(41,Object.assign({},IMJ,IMW1J),'out'),K(43,Object.assign({},IMJ,IMR1),'in'),K(54,Object.assign({},IMJ,IMW1J),'out'),K(56,Object.assign({},IMJ,IMR1),'in'),K(72,{grin:1},'io'),K(160,{})],
  pp:(P,t)=>{P.jn=t<30?3:t<43?2:t<56?1:0;if(t>=56)P.jug=0},
  cues:[{t:30,col:'w',silent:true},{t:43,col:'w',silent:true},{t:56,col:'w',silent:true}],hits:[30+LOB,43+LOB,56+LOB],
  fx:(B,J,t,S2,M)=>{const P=J.P||{};for(const t0 of[30,43,56])lobFx(B,t,t0,handF(J),P);if(t>=8&&t<56&&(t-4)%13<3)soundArc(B,add(J.sc,[-5*J.k,-18*J.k]),(t-4)%13)/* 受ける音は投げる拍（17・30・43F）にそろえる */},
  cap:'石を三つ出して、お手玉をする（石の数＝投げる数）。お手玉は13Fの拍で、受けるたびに小さく音が鳴る。その拍のまま一つずつ投げる。石は光らない。ヒュ・ヒュ・ヒュの次の拍（投げてから52F）で落ち、13Fおきに三つ。',
  why:'拍で来る攻撃は、ここで初めて教わる（中ボスで先に出す）。お手玉の拍が、そのまま石の落ちる拍になる。数は手の石で、間はお手玉で、構えのうちに全部見えている。'});
  mv({f,ox,id:pre+'_big',n:'大きな岩（赤・重い）',bg,len:130,
   keys:[K(0,{}),K(10,IMB,'out'),K(54,IMB),K(56,Object.assign({},IMB,{lean:-.2,cr:3.6}),'out'),K(60,IMBT,'in'),K(66,IMBT),K(90,IMBT),K(110,{},'io'),K(130,{})],
   pp:(P,t)=>{if(t>=10&&t<56){const s=(t>>1)&1;P.x=(P.x||0)+(s?.6:-.6);P.cr=(P.cr||0)+s*.5;/* 重くてひざがふるえる */}if(t>=60)P.bigGone=1},
   cues:[{t:40,col:'r',at:J=>add(J.head,[0,-14*J.k])}],hits:[68],hitCol:'r',
   fx:(B,J,t)=>{bigFx(B,t,60,68,add(J.head,[-4,-12]),J.P||{})},
   cap:'背中側の封印の石を、両手で頭の上へ持ち上げる。重くてひざがふるえ、体が小刻みにゆれる（お手玉とはまるでちがう形）。石が赤く光り、いつもの間で、主人公へ投げつける。重い一撃。弾くと、石は三つに割れて足元に落ちる（三つとも投げ返せる）。',
   why:'中ボスだけの技（モブより一つ多い）。拍ではなく光で来るので、読み方がお手玉とまったくちがう。赤＝重い、の約束どおり。封印の石を投げてしまうほど、遊びに容赦がない。'});}
 /* パリィされ：攻撃した部位（石）が弾き落とされる。小鬼は、小＝びくっと目をむく、大＝地団駄を踏んで怒る */
 const kit=(kind,th,P)=>kind==='s'?{ear:-1,hd:(P.hd||0)-.25,x:(P.x||0)+1,grin:0}:{ear:1,grin:0,ua:-2.6,fa:-2.3,ua2:-2.4,fa2:-2.1,lean:-.3,hd:-.3,cr:1};
 const stamp=(P,t,Hc,stop)=>{P.parried=1;const H=Hc[Hc.length-1],d=t-H-stop;if(d>=0&&d<36){const s=(d>>2)&1;P.ff=s?-9:-5;P.fb=s?3:7;P.cr=(P.cr||0)+s*.8}};
 if(!isM)parriedCard({id:pre+'_pry',src:pre+'_two',n:'パリィされ：二つ投げ（小→大）',kit,rx:[{kind:'s'},{kind:'b'}],pp:stamp,
  fx:(B,J,t,Hc)=>rocksAtFeet(B,Hc.filter(H=>t>=H).length),
  cap:'一つ目を弾くと、石は足元に落ちる。小鬼はびくっと首をすくめ、目をむく。二つ目も弾かれると、両手を振り上げて地団駄を踏む（子どものように怒る）。足元の石は、次のこうげきで投げ返せる。',
  why:'弾かれるのは小鬼ではなく石。小鬼のほうは、遊びをじゃまされた子どもの反応で返す。'});
 else{parriedCard({id:pre+'_pry',src:pre+'_three',n:'パリィされ：三つ投げ（小→大）',kit,rx:[{kind:'s'},{kind:'s'},{kind:'b'}],pp:stamp,
  fx:(B,J,t,Hc)=>rocksAtFeet(B,Hc.filter(H=>t>=H).length),
  cap:'弾いた石は一つずつ足元にたまる。おかしらは一つ弾かれるたびにびくっとし、三つ目で地団駄を踏む。たまった石は、次のこうげきでまとめて投げ返せる（小鬼のおかしらで最初に教わる）。',
  why:'投げ返しは、弾いた数だけ得をする仕組み。ここで覚えて、牙の盗賊の短剣でも使う。'});
  parriedCard({id:pre+'_prybig',src:pre+'_big',n:'パリィされ：大きな岩（三つに割れる）',kit,rx:[{kind:'b'}],pp:stamp,
   fx:(B,J,t,Hc,stop)=>{const d=t-Hc[0];if(d>=0){if(d<10)for(let i=0;i<10;i++){const a=i/10*TAU_;B.set(HEADP[0]+4+Math.cos(a)*(3+d),HEADP[1]+Math.sin(a)*(3+d)*.6,SEAL[1],5)}if(d>=4)rocksAtFeet(B,3)}},
   cap:'大きな岩を弾くと、三つに割れて足元に落ちる。おかしらは両手を振り上げて地団駄を踏む。割れた三つは、次のこうげきで投げ返せる。',
   why:'重い一撃を弾いたごほうびが、投げ返し三つぶん。封印の石は、主人公の手でさらに割られる（勝つほど、くらやみに材料を渡している）。'})}
 /* ブレイク：しりもちをついて目を回す。袋から石がこぼれる */
 const BRK=t=>({cr:7.5,lean:-.32+Math.sin(t*.1)*.04,ff:-12,fb:-3,ua:1.0,fa:.6,ua2:.8,fa2:.4,hd:.32+Math.sin(t*.13)*.12,ear:1,grin:0,x:2,daze:1});
 parriedCard({id:pre+'_brk',src:isM?pre+'_big':pre+'_two',n:'ブレイク：しりもちをついて目を回す',len:isM?230:250,kit,rx:isM?[{kind:'b'}]:[{kind:'s'},{kind:'b'}],pp:stamp,brk:{at:6,P:BRK,star:J=>add(J.head,[0,-12])},
  fx:(B,J,t,Hc)=>{rocksAtFeet(B,isM?3:Hc.filter(H=>t>=H).length);const T0=Hc[Hc.length-1]+20;if(t>T0)for(let i=0;i<3;i++)rock(B,J.hip[0]+8+i*4,FL-2,impRockR(J.k)*.8)},
  cap:'ブレイクに必要な四度目（この絵では最後に弾いたもの）で、しりもちをついて、袋から石がこぼれる。後ろ手をついたまま、頭をふらふらさせて目を回す。頭の上をうすい青の星が回る。',
  why:'石を持っていない＝投げられない＝いま斬れる。小さな体に大きな頭なので、目を回す形がいちばん読みやすい。'});
 recoverCard({id:pre+'_rec',f,ox,bg,n:'ブレイク：斬られて、飛び起きる',P:BRK,idle:()=>Object.assign({},IMPOSE,{grin:.4}),snap:4,star:J=>add(J.head,[0,-12]),
  react:(P,a,b)=>{const A=kb(a,6),Bk=kb(b,8);P.hd=(P.hd||0)-.4*Math.max(A,Bk);P.ear=1},
  cap:'しりもちのまま斬られると、ぎゃっと頭をのけぞらせる。二太刀目のあと、ぴょんと飛び起きて身構える（少し低くしゃがみすぎてから収まる）。',
  why:'起きるときは一瞬。ゆっくり起きると「まだ斬れる」と勘ちがいさせる。'});
 hurtMove(f,pre+'_hurt',{react:(P,a,b)=>{const A=kb(a,6),Bk=kb(b,9),m=Math.max(A,Bk),last=b>=0?b:a;P.lift=(P.lift||0)+4*m;/* 着地したら耳が戻って、またにやける */P.ear=m>.3?1:0;P.grin=m>.3?0:(last>=12?1:0);P.lean=(P.lean||0)-.25*m;P.x=(P.x||0)+2*A+3*Bk},
  cap:'斬られると、ぎゃっと飛び上がり、耳を後ろへ寝かせる。着地すると、またにやける。',
  why:'痛がるが、こりない。遊びはやめない。'});
 /* 撃破：ひっくり返り、石がころがり、体が足元の暗がりへ沈む。石だけが残る */
 mv({f,ox,id:pre+'_down',n:'撃破：暗がりへ沈む',bg,len:140,noHero:true,
  keys:[K(0,{}),K(6,{lift:6,ear:1,lean:-.3},'out'),K(16,{cr:7.5,lean:-.8,ff:-14,fb:-1,ua:-.6,fa:-.9,ua2:-.4,fa2:-.7,hd:.5,ear:1,daze:1},'in'),K(40,{cr:7.5,lean:-.8,ff:-12,fb:-3,ua:1.0,fa:.6,ua2:.8,fa2:.4,hd:.4,ear:1,daze:1}),K(100,{cr:7.5,lean:-.8,ff:-14,fb:-1,ua:-.6,fa:-.9,ua2:-.4,fa2:-.7,hd:.5,ear:1,daze:1,lift:-62},'in'),K(140,{lift:-62})],
  post:(B,J,t)=>{for(let i=0;i<B.c.length;i++){const y=i/CW|0;if(y>FL&&(B.t[i]===1||B.t[i]===2||B.t[i]===3)){B.c[i]=0;B.t[i]=0}}
   if(t>=40){const u=Math.min(1,(t-40)/60),x0=J.hip[0];for(let dx=-14;dx<=14;dx++){if(Math.abs(dx)<14*Math.min(1,u*1.5)+2&&hsh(dx,t>>3)<.8)B.set(x0+dx,FL+1,'#0c0910',5)}}
   if(t>=16){const n=isM?3:2;for(let i=0;i<n;i++){const d=Math.min(1,(t-16)/20);rock(B,J.hip[0]-6+i*7+d*(i-1)*6,FL-2,impRockR(J.k)*.9)}}},
  cap:'最後の一撃で飛び上がり、ひっくり返る。袋の石がころがり出る。しばらくして、体が足元の暗がりへずぶずぶと沈んでいく。床には石だけが残る。',
  why:'生きているものも、倒れればくらやみに拾われる。遊び道具だけが残る。何度も見るので短く。'});
}
imCards('imp','im',false);imCards('impM','imM',true);

/* 資料集に入れる */
MOVES_OF.imp=['im_idle','im_bored','im_two'];
MOVES_OF.impM=['imM_idle','imM_bored','imM_three','imM_big'];
Object.assign(MCAT_ENTER,{imp:['im_enter'],impM:['imM_enter']});Object.assign(MCAT_DOWN,{imp:['im_down'],impM:['imM_down']});Object.assign(MCAT_HURT,{imp:['im_hurt'],impM:['imM_hurt']});
Object.assign(MCAT_PARRY,{imp:['im_pry'],impM:['imM_pry','imM_prybig']});Object.assign(MCAT_BREAK,{imp:['im_brk','im_rec'],impM:['imM_brk','imM_rec']});
FORMS.push({key:'impM',ttl:'小鬼のおかしら',en:'THE STONE-TOSSING IMPS · 中ボスとモブ',stage:[],sox:62,vt:'IMV',vnote:'覚悟の段は、生きたまま浸食されていく段階。肌の色が変わるだけでなく、赤い段から頭に黒い筋、黒い段から腕にも筋が走って額に光らない目が一つ開き、紫の段では目が三つになる。石（攻撃の道具）の色はどの段でも変えない。',
 variants:[['n','緑の肌'],['r','赤い肌。頭に黒い筋'],['k','黒い肌。腕にも筋、額に目'],['v','紫の肌。目が三つ']],
 lore:'迷宮に住みつく小鬼たち。拍に合わせて石を投げるのは、遊び歌のようなもの。悪意より遊び。おかしらがいつも持ち歩く大きな石には、門の紋章が彫られている。封印の石を、遊びで削り、投げ、壊している。',
 parts:[['張り出したまゆと、ぎょろ目','目はにぶい黄色で光らない。笑うと細くなり、斬られると見開き、ブレイクで回る'],['鉤鼻と切れ上がった口','いつも遊んでいる顔。斬られても、こりずにまたにやける。おかしらは歯が欠けている'],['大きな手と白い爪','石を持つ手。手の石の数＝投げる数なので、手を大きく描く'],['紺のマント（おかしら）','倒れた門番から拾った前垂れ。すり切れた金のふちと、閉じた門の紋章の名残。小鬼も、倒れたものを拾って使う'],['白いひげ（おかしら）','顔の芯。口ひげが口をおおい、笑うとひげの下で口が開く。あごひげは遅れて揺れ、先を封印の石から削り取ったかけらで結ぶ（封印を壊して遊んでいる証拠）。ひまなときは満足そうになでる'],['手の石・お手玉','持っている石の数＝投げる数。お手玉の拍＝落ちる拍（いちばん大事な原則）'],['腰の石の袋','ブレイクでこぼれる。石がない＝投げられない＝すき'],['封印の石（おかしら）','門の紋章（閉じた門）が彫られた石。遊びで削られ、欠けている。大きな岩の技で投げる'],['光らない石','攻撃は音（ポイ・ヒュ・ヒュ・ヒュ）と足元の影で読む。大きな岩だけが赤く光る']],
 pal:[['#5e7a3a','緑の肌','光らない'],['#7a6e66','石','投げる石。ふちの明るい一点で数えやすく（光らない）'],['#5e5a66','封印の石','門の紋章（くすんだ金）'],['#cabe84','にごった黄色の目','光らない。合図の白・金と取り違えないよう、にごらせる'],['#2e3a5e','紺のマント','門番の前垂れと同じ紺']],
 pair:{key:'imp',ttl:'石なげ小鬼（モブ）',diff:[['同じ骨格','人型（小さい）。おかしらは1.25倍で、封印の石を持ち歩く'],['技','モブは「二つ投げ」。おかしらは「三つ投げ」＋「大きな岩（赤）」。拍で来る攻撃と投げ返しは、おかしらで先に教わる'],['構え','両手に一つずつ＝二つ。お手玉＝三つ。石を頭の上へ＝大きな岩'],['身なり','モブは麻のぼろ布だけ。おかしらは白いひげと、拾った門番の紺のマント。年寄りで、古傷']]}});
FORMS.push({key:'imp',ttl:'石なげ小鬼',en:'MOB · 小鬼のおかしらと同じ骨格',stage:[],sox:62,vt:'IMV',vnote:'覚悟の段は小鬼のおかしらと同じ（黒い筋、額の目、目が三つ）。',
 variants:[['n','緑の肌'],['r','赤い肌'],['k','黒い肌。額に目'],['v','紫の肌。目が三つ']],
 lore:'迷宮に住みつく小鬼。上の暗がりから降ってきて、石を二つ投げる。ひまなときは床の小石を拾っては放って遊ぶ。',
 parts:[['両手の石','二つ持っていたら二つ来る'],['腰の石の袋','ブレイクでこぼれる'],['光らない石','音と影で読む']],
 pal:[['#5e7a3a','緑の肌','光らない'],['#7a6e66','石','投げる石']]});
