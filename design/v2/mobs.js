/* ===== 中ボスとモブ：一組ずつ =====
   モブと中ボスは同じ骨格。中ボスはモブより技が1つ多い。新しいタイミングのルールは中ボスで先に出す。 */
SPEC.boar={name:'突進イノシシ',k:1,draw:drawBoar,pose:{},tintable:true};
SPEC.boarM={name:'暴れ大イノシシ',k:1.25,mid:true,draw:drawBoar,pose:{},tintable:true};

/* ---------- 突進イノシシ・暴れ大イノシシ ----------
   突進の時間はゲームと同じ：合図（走り出し）から着くまで、近い28F・中くらい35F・遠い41F（大イノシシは42F）。
   カードでは、ゲームの「近い」間合い（86画素）をカードの間合いに縮め、遠さも同じ割合で縮めて描く。 */
const BOAR={
 boar:{k:1,ox:8,reach:31,D:86,arr:[28,35,41]},
 boarM:{k:1.25,ox:4,reach:18,D:82,arr:[28,35,42]}};/* reach は骨格の単位（k をかける前） */
const BSNOUT=33;/* 腰の基準から鼻先まで（k=1） */
/* 走る位置：合図 c から着く h まで等速。速さは近い間合いと同じなので、遠いほど遅く着く */
function boarRun(P,t,c,h,x0,x1){const u=Math.max(0,Math.min(1,(t-c)/(h-c)));P.x=lerp(x0,x1,u);P.run=(t-c)/7;P.runA=1;P.gal=1;P.hd=1;P.brs=1;P.dust=1}
function boarHitPose(P,d){/* 当たった瞬間：牙で下からすくい上げ、勢いで頭がはね上がる（3F止め） */P.hd=-.6;P.jaw=1;P.cr=-1;P.brs=1}
/* 間合いを取る：後ずさり（足を逆に運ぶ） */
function boarBack(P,t,t0,t1,x0,x1){const u=Math.max(0,Math.min(1,(t-t0)/(t1-t0))),e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;P.x=lerp(x0,x1,e);if(t>t0&&t<t1){P.run=-(t-t0)/9;P.runA=.55}}
/* 待機の息：おびえて浅く速い。耳が動き、ときどきまばたき。尾をはらう */
function boarIdle(P,t){P.blink=(t%67<3)?1:0;P.brs=.25+.15*Math.sin(t*.09);P.snort=(t%53<6)?Math.sin((t%53)/6*Math.PI)*.6:0}
function boarCharge(key,id,n,o){const B0=BOAR[key],x1=-B0.reach,bk=(o.back||0)*B0.reach/B0.D,arr=B0.arr[o.back===40?2:o.back===20?1:0];
 const t0=o.t0||14,tb=o.tb||0,crs=t0+tb,c=crs+16+(o.extra||0),h=c+arr,len=h+48;
 return mv({f:key,ox:B0.ox,id,n,bg:'def',len,cap:o.cap,why:o.why,keys:[K(0,{})],hitCol:o.red?'r':'w',
  pp:(P,t)=>{boarIdle(P,t);P.x=0;
   if(t>=t0&&t<crs)boarBack(P,t,t0,crs,0,bk);if(t>=crs)P.x=bk;
   if(t>=crs&&t<c){/* 構え：頭を下げ、腰を落とし、後ろ足に重心。止まる（静） */const u=Math.min(1,(t-crs)/5);P.hd=u;P.cr=2*u;P.x=bk+1.5*u;P.brs=.6+.4*u;P.blink=0;if(o.pre)o.pre(P,t-crs,c-crs)}
   if(t>=c&&t<h)boarRun(P,t,c,h,bk+1.5,x1);
   if(t>=h&&t<h+4){P.x=x1;boarHitPose(P,t-h)}
   if(t>=h+4&&t<h+12){/* はね上げたまま粘る */P.x=x1+(t-h-4)*.3;P.hd=-.4;P.jaw=.6;P.brs=1}
   if(t>=h+12){/* 戻り：向きを変えずに後ずさって、もとの間合いへ */boarBack(P,t,h+12,h+40,x1+2.4,0);P.brs=.8;P.trem=.4}},
  cues:[{t:c,col:o.red?'r':'w'}],hits:[h],
  fx:(B,J,t,S,M)=>{if(t>=c&&t<h){/* 速さの線：走る向きの後ろに */for(let i=0;i<4;i++){const y=J.back[1]+6+i*4,x=J.hip[0]+6+((t*3+i*5)%9);B.line(x,y,x+5+i,y,o.red?'#7a3038':'#4a4458',5)}}
   if(o.fx)o.fx(B,J,t,c)}})}

/* 立ち絵 */
for(const key of['boar','boarM'])mv({f:key,ox:BOAR[key].ox,id:key==='boar'?'b_idle':'bM_idle',n:'立ち絵：おびえて、ふさぐ',bg:'def',len:160,keys:[K(0,{})],
 pp:(P,t)=>{boarIdle(P,t);P.cr=Math.max(0,Math.sin(t*.11))*.6;if(t%80>60&&t%80<70)P.look=.3},
 cap:key==='boar'?'低く構え、白目をむいて浅く速い息をする。耳は寝かせ、背の毛が少し立っている。牙が体でいちばん明るい。':'突進イノシシと同じ骨格で、ひとまわり大きい。手前の牙は折れ、額は割れ、たてがみは長く黒い。前足のひづめは割れて、すり減っている。合図は折れていない奥の長い牙に出る。',
 why:key==='boar'?'怒っているのではなく、おびえている。下の階から何かが上がってくるので、上へ逃げてきた獣。下へ降りる主人公は、ちょうど逃げ道をふさいでいる。合図はいつも牙に出るので、牙をいちばん明るくした。':'群れのしんがりを守ってきた年寄り。折れた牙と割れた額は、何度も弾かれて壁に激突してきた跡（弾けば壁に激突、の物語）。割れたひづめは、地をかく癖の跡で、溜め突進の手がかり。'});

/* 突進（近い／遠い）：モブと中ボスの両方 */
const CAPN='頭を下げて腰を落とし、ぴたりと止まる。牙が白く光った瞬間に走り出す。近い間合いからなら、光ってから28Fで着く。',
 CAPF='後ずさって間合いを大きく取ってから、頭を下げて止まる。牙が白く光ったら走り出すが、走る速さは同じなので、着くのは遅れる（遠い間合いで41F）。光の瞬間ではなく、走ってくる体を見て合わせる。';
const WHYN='走り出しと光が同じ瞬間。構えで止まるので、光る前から「来る」と分かる。',
 WHYF='このゲームでただ一つ、光ってから当たるまでが間合いで変わる攻撃。「光を見たら28F」をいったん忘れて、敵そのものを見る練習になる。後ずさる長さが、遅れの長さ。';
boarCharge('boar','b_near','突進（近い）',{cap:CAPN,why:WHYN});
boarCharge('boar','b_far','突進（遠い）',{back:40,tb:22,cap:CAPF,why:WHYF});
boarCharge('boarM','bM_near','突進（近い）',{cap:CAPN,why:WHYN});
boarCharge('boarM','bM_far','突進（遠い）',{back:40,tb:22,cap:CAPF.replace('41F','42F'),why:WHYF});
/* 中ボスだけの＋1：溜め突進（赤） */
boarCharge('boarM','bM_paw','溜め突進（赤・重い）',{back:20,tb:14,red:true,extra:30,
 pre:(P,d,L)=>{/* 前足で地を三回かく（ザッ・ザッ・ザッ）。たてがみが一回ごとに高く立つ。最後は止まる */const n=Math.min(3,Math.floor(d/10)),u=(d%10)/10;if(d<30){P.paw=Math.sin(u*Math.PI);P.pawL=u;P.dust=u>.5?1:0;P.cr=-1.2*P.paw}else{P.paw=0}P.brs=.6+n*.3;P.snort=(d>=30&&d<36)?1:0;P.hd=Math.min(1,.4+n*.2)},
 fx:(B,J,t,c)=>{const d=t-(c-46);if(d>=0&&d<30&&d%10>=5){const f=J.hoofs[2]||J.hoofs[0];for(let i=0;i<4;i++)B.set(f[0]+4+i*2+((d*3+i)%3),f[1]-1-((i*5+d)%3),i%2?'#4a4048':'#6a5c64',5)}},
 cap:'前足で地面を三回かく（ザッ・ザッ・ザッ）。かくたびにたてがみが高く立つ。鼻を一度鳴らして止まり、牙が赤く光って走り出す。重い。間合いのルールは突進と同じ（中くらいの間合いで35F）。',
 why:'地をかいたら赤。ふつうの突進は地をかかないので、構えの違いで重さが先に分かる。割れてすり減った前のひづめが、この癖の手がかり。年寄りが「ここを抜ける」と決めたときだけの突進。'});

/* 弾くと壁に激突（演出） */
for(const key of['boar','boarM']){const B0=BOAR[key],x1=-B0.reach,WX=key==='boar'?4:3;mv({f:key,ox:B0.ox,id:key==='boar'?'b_wall':'bM_wall',n:'弾くと、壁に激突',bg:'def',len:170,keys:[K(0,{})],
 pp:(P,t)=>{boarIdle(P,t);if(t<8){P.hd=1;P.cr=2;P.x=1.5}else if(t<36)boarRun(P,t,8,36,1.5,x1);
  else if(t<48){/* 弾かれる：鼻先からはね返り、回りながら後ろへ飛ぶ（ゲームと同じく90度ずつ回って見える） */const u=(t-36)/12;P.x=lerp(x1,WX,Math.sin(u*Math.PI/2));P.y=-Math.sin(u*Math.PI)*7;P.roll=Math.PI*u;P.hd=-.4;P.brs=1}
  else if(t<120){/* 壁に背からぶつかって落ち、ひっくり返ったまま足が宙をかく。頭のまわりに星 */const d=t-48;P.x=WX;P.roll=Math.PI;P.y=d<6?-3*Math.sin(d/6*Math.PI):-2;P.run=d/5;P.runA=d<40?.5:.2;P.daze=1;P.blink=d%20<4?1:0}
  else{/* 起き上がり、首を振って、もとの間合いへ戻る */const d=t-120;P.roll=d<3?Math.PI:0;P.y=d<3?-2-d*2:d<8?-6*(1-(d-3)/5):0;P.dust=d>=6&&d<14?1:0;/* 背中で一度はねて、ぱっと起きる（中割りで回さない） */P.x=lerp(WX,0,Math.min(1,Math.max(0,(d-12)/30)));P.daze=d<20?1:0;P.trem=.6;if(d>12&&d<42){P.run=d/6;P.runA=.6}}},
 cues:[{t:8,col:'w'}],hits:[36],
 fx:(B,J,t)=>{/* 右はしの石の壁 */for(let y=FL-36;y<=FL;y++)for(let x=CW-5;x<CW;x++)B.set(x,y,((x+y*3)%5)?'#2a2632':'#3a3644',6);if(t>=47&&t<60){for(let i=0;i<6;i++){const a=i*1.1,r=(t-47)*1.4;B.set(CW-6-Math.abs(Math.cos(a)*r),FL-18+Math.sin(a)*r,'#6a6070',5)}}},
 cap:'突進を弾くと、イノシシは鼻先からはね返り、回りながら後ろへ飛んで、背中から壁にぶつかる。ひっくり返ったまま足が宙をかき、頭のまわりを星がまわる。しばらくして起き上がり、首を振って間合いに戻る。',
 why:'弾いたごほうびが、いちばん分かりやすく見える敵。止まって目を回しているあいだが、反撃のすき。暴れ大イノシシの割れた額と折れた牙は、これを何度もくり返してきた跡。'})}

/* 中ボスの派生の立ち絵：下をふり返る */
mv({f:'boarM',ox:BOAR.boarM.ox,id:'bM_look',n:'下をかいで、おびえる',bg:'def',len:150,noHero:true,keys:[K(0,{})],
 pp:(P,t)=>{boarIdle(P,t);if(t>=10&&t<50){/* 鼻を床につけてかぐ */const u=Math.min(1,(t-10)/8);P.hd=1.3*u;P.cr=1.5*u;P.snort=(t%8<3)?.8:0}
  if(t>=50&&t<56){/* びくっとして頭を上げる（3F で一気に） */P.hd=-.2;P.look=1;P.brs=1.4;P.x=2}
  if(t>=56&&t<110){P.hd=-.1;P.look=.8;P.brs=1.4;P.x=2+Math.min(3,(t-56)*.2);P.trem=1;P.blink=0}
  if(t>=110){const u=Math.min(1,(t-110)/20);P.look=.8*(1-u);P.brs=1.4-u;P.x=5*(1-u);P.trem=1-u}},
 fx:(B,J,t)=>{if(t>=44&&t<70){/* 床の割れ目から、ほんのわずかにくらやみがにじむ */for(let i=0;i<5;i++){const x=J.snout[0]-2+i*2,y=FL+1;B.set(x,y,'#3a2a48',6);if((t+i)%6<3)B.set(x,y-1,'#1e1626',5)}}},
 cap:'ひまなとき。鼻を床につけて何かをかぐ。床の割れ目から、ほんの少しくらやみがにじむ。びくっと頭を上げ、たてがみを逆立てて、後ずさって震える。光らない＝攻撃ではない。',
 why:'イノシシが上へ逃げてきた理由を、一度だけ見せる。主人公はこれから、このイノシシがおびえて逃げてきた方へ降りていく。'});

/* たおれる（撃破）：泥に覆われて、爆散する。ザコは何度も倒すので短く、気持ちよく（「遅さは罪」「閃光、爆発、残煙」）
   【泥が覆う時間】○、【閃光】○、【かけらの数】○、【残煙】○ は、ゲームでは調整できる値にする */
const BDOWN={boar:{cover:[6,30],flash:36,n:18,len:96},boarM:{cover:[6,36],flash:42,n:28,len:110}};
/* 撃破の閃光（全員共通の芯）：ただの丸にしない（2023-01-02「閃光、爆発、残煙」：閃光は瞬間で「何か激しいことが起きた」と伝える。黒をまぜ、光の筋とフレアを描く）。
   形：芯の白＋長さも向きもばらばらの光の筋7本（左右対称にしない）＋横に長く細いフレア→筋が細って点になり、芯は黒紫に抜け、ところどころ切れた暗い衝撃の輪が広がって消える。白のふちには黒をまぜる（どんな背景でも見える）。明るい紫の輪は使わない（フェイントの合図） */
const FLSPK=[[-.35,1.0],[.45,.62],[1.25,.85],[1.95,.5],[2.55,1.1],[3.35,.7],[4.3,.9],[5.1,.55]];
function flashCore(B,c,d,k){if(d<-1||d>=7)return;const put=(x,y,col)=>B.set(c[0]+x,c[1]+y,col,4),W='#ffffff',D='#000000';
 if(d===-1){for(let y=-7;y<=7;y++)for(let x=-7;x<=7;x++){const q=Math.hypot(x,y*1.2);if(q<=4*k)put(x,y,W);else if(q<=6*k&&(x+y)&1)put(x,y,D)}return}
 if(d<=1){const R=(d?13:10)*k;/* 芯 */for(let y=-R;y<=R;y++)for(let x=-R;x<=R;x++){const q=Math.hypot(x,y*1.25);if(q<=R-1.5)put(x,y*1,W);else if(q<=R+.5)put(x,y,(x+y)&1?D:W)}
  /* 光の筋：ばらばらの長さと向き。根元は太く、先は細い。ふちに黒 */for(const[a,l]of FLSPK){const L=(18+l*20)*k*(d?1.25:1),w0=(d?2:3)*k;for(let r=R-2;r<L;r+=.5){const w=Math.max(.5,w0*(1-(r-R)/(L-R)));const x=Math.cos(a)*r,y=Math.sin(a)*r*.8,nx=-Math.sin(a),ny=Math.cos(a);for(let o=-w-1;o<=w+1;o+=.5){const col=Math.abs(o)>w?D:W;if(col===D&&r>L-3)continue;put(Math.round(x+nx*o),Math.round(y+ny*o*.8),col)}}}
  /* フレア：横に長い1画素の線（左右で長さをかえる） */for(let x=-46*k;x<=34*k;x++){if(Math.abs(x)<R)continue;put(x,0,Math.abs(x)>(x<0?40:28)*k?((x&1)?W:null):W);if(Math.abs(x)<(x<0?30:20)*k)put(x,1,D)}return}
 /* 2〜6：筋は点にほどけ、芯は黒紫に抜け、切れ目のある暗い衝撃の輪が広がる */const u=d-2,R=(15+u*4)*k;
 for(const[a,l]of FLSPK){const L=(18+l*20)*k*1.3;for(let r=R*.6;r<L*(1+u*.15);r+=3+u){if(hsh(Math.round(r),Math.round(a*10)+d)<.35+u*.12)continue;put(Math.round(Math.cos(a)*r),Math.round(Math.sin(a)*r*.8),u<2?'#d8d0e0':'#43365a')}}
 for(let t=0;t<Math.PI*2;t+=.6/R){const gap=vn2(t*3+d*.7)>.62;if(gap)continue;for(let w=0;w<(u<2?3:2);w++){const r=R-w;put(Math.round(Math.cos(t)*r),Math.round(Math.sin(t)*r*.75),w===0?((Math.round(t*20))&1?D:'#3e2e54'):u<1?'#d8d0e0':'#2c2238')}}}
function vn2(x){const i=Math.floor(x),f=x-i,h=n=>{const s=Math.sin(n*127.1)*43758.5;return s-Math.floor(s)};return h(i)+(h(i+1)-h(i))*f*f*(3-2*f)}
function boarBurst(B,c,d,n,k,mid){/* 閃光：中心は白、まわりに黒を混ぜる（明るい背景でも暗い背景でも見える） */
 flashCore(B,c,d,k);
 /* かけら：泥の塊が飛び、落ちて床にしみこむ */
 for(let i=0;i<n;i++){const a=-Math.PI*(.08+.84*hsh(i,1)),v=(1.4+hsh(i,2)*2.6)*k,s=hsh(i,3)>.45?3:2,tl=d-1;if(tl<0)continue;let x=c[0]+Math.cos(a)*v*tl,y=c[1]+Math.sin(a)*v*tl+.11*tl*tl;const land=y>=FL;if(land){y=FL;x=c[0]+Math.cos(a)*v*Math.min(tl,(Math.sqrt(Math.max(0,(Math.sin(a)*v)**2+.44*(FL-c[1])))-Math.sin(a)*v)/.22)}
  const life=34+hsh(i,4)*14;if(d<1)continue;if(tl>life)continue;const fade=land?Math.max(0,1-(tl-life*.55)/(life*.45)):1;if(fade<=0||(land&&hsh(i,tl)>fade))continue;
  for(let yy=0;yy<s;yy++)for(let xx=0;xx<s+(land?1:0);xx++)B.set(x+xx,y-yy,(yy===s-1||xx===0)&&!land?'#7a4aa8':land?BMUD[1]:(i+xx)%2?'#2c2238':'#1d1728',4)}
 /* 残煙：黒紫の煙が上へ。点が抜けて消える */
 if(d>=4&&d<44)for(let i=0;i<(mid?7:5);i++){const u=(d-4)/40,x=c[0]+(hsh(i,5)-.5)*16*k+Math.sin(d*.15+i)*2,y=c[1]-u*18*k-hsh(i,6)*4,r=(1.5+u*3)*k;for(let yy=-r;yy<=r;yy++)for(let xx=-r;xx<=r;xx++){if(xx*xx+yy*yy>r*r)continue;if(hsh(Math.round(x+xx),Math.round(y+yy)+d)<.5-u*.45)B.set(x+xx,y+yy,(xx+yy)&1?'#2c2238':'#43365a',5)}}}
for(const key of['boar','boarM']){const D_=BDOWN[key],M_=key==='boarM';mv({f:key,ox:BOAR[key].ox,id:M_?'bM_down':'b_down',n:'撃破：泥にのまれて、爆散',bg:'def',len:D_.len,noHero:true,keys:[K(0,{})],
 pp:(P,t)=>{if(t<6){P.hd=-.5;P.brs=1.4;P.x=2;P.jaw=1}
  else if(t<=D_.flash){const u=Math.min(1,(t-6)/16);P.dead=u*.7;P.cr=3*u;P.hd=1.1*u;P.y=4*u;P.brs=1.4*(1-u);P.x=2;if(t>D_.flash-8){P.trem=2;P.y-=.5}}
  else P.hide=1},
 fx:(B,J,t)=>{const c=[EXX+BOAR[key].ox-6*BOAR[key].k,FL-9*BOAR[key].k];
  if(!J.gone){/* 泥が足元から全身をのぼる。のぼりきると、体は泥の塊になってふくらむ */const u=Math.max(0,Math.min(1,(t-D_.cover[0])/(D_.cover[1]-D_.cover[0]))),Hh=30*BOAR[key].k,top=FL-u*u*(3-2*u)*Hh;
   for(let i=0;i<B.c.length;i++){if(B.t[i]!==1||!B.c[i])continue;const x=i%CW,y=i/CW|0;if(x<40)continue;const edge=top+(hsh(x,3)-.5)*3;if(y>=edge){const L=rgb(B.c[i]).reduce((a,b)=>a+b,0)/765;const top1=B.t[i-CW]!==1;B.c[i]=y<edge+1.5||top1?'#3e2e54':L>.35?BMUD[2]:L>.18?BMUD[1]:BMUD[0]}}
   /* のぼる泥の先：ところどころ紫がかったふちと、したたり */if(u>0&&u<1)for(let x=c[0]-26;x<c[0]+30;x+=3)if(B.tag(x,Math.round(top))===1&&hsh(x,Math.floor(t/3))>.5)B.set(x,top-1,'#4e2c70',4)}
  boarBurst(B,c,t-D_.flash,D_.n,BOAR[key].k,M_)},
 cap:'最後の一撃で鳴いて、前足が折れる。足元から黒紫の泥が一気に全身をのぼり、体が泥の塊になって震え、ふくらむ。閃光とともに泥のかけらが飛び散り、黒紫の煙が上がる。かけらは床に落ちて、しみこんで消える。何も残らない。',
 why:'柱の法則「倒れたものは、くらやみに拾われる」を、ザコの気持ちいい爆散のまま見せる。飛び散るのは血ではなく、くらやみの泥。しみこんで消えるのは、くらやみが材料を持ち帰ったから。何度も見る撃破なので、のぼる泥から消えるまでを約1.5秒（大イノシシは約1.8秒）に詰めた。'})}

SPEC.dragon.tintable=true;SPEC.hydra.tintable=true;
/* 三つ首の竜：亡骸の頭を前へ垂らし、角を親指の先から逃がす（親指と角が重なってシルエットが読めなかった） */
SPEC.hydra.pose=Object.assign({},SPEC.hydra.pose||{},{droopC:.6});

/* ひっくり返って背中で寝ているとき（壁に激突・ブレイク）：体の一番下（背中）が、床にちょうどつくように上下を合わせる。床に沈めず、浮かせもしない */
function drawBoarG(B,ox,oy,S,P0,T){const ro=(P0&&P0.roll)||0;if(Math.cos(ro)>-.6||(P0&&P0.air))return drawBoar(B,ox,oy,S,P0,T);
 /* 跳ねる高さ（y）は残す：y=-2 を「寝ている高さ」として床に合わせ、そこからの差だけ持ち上げる */
 const W=new Buf(B.w,B.h),J=drawBoar(W,ox,oy,S,Object.assign({},P0,{y:-2}),T);let my=-1;for(let i=0;i<W.c.length;i++)if(W.c[i]&&W.t[i]<=3)my=Math.max(my,(i/W.w)|0);if(my<0)return J;
 const dy=Math.round(oy-1-my+((P0.y==null?0:P0.y)+2)*(S.k||1));for(let i=0;i<W.c.length;i++)if(W.c[i]){const y=((i/W.w)|0)+dy;if(y>=0&&y<B.h){const j=y*B.w+i%W.w;B.c[j]=W.c[i];B.t[j]=W.t[i]}}
 const sh=v=>Array.isArray(v)?(v.length===2&&typeof v[0]==='number'?[v[0],v[1]+dy]:v.map(sh)):v;for(const k in J)J[k]=sh(J[k]);return J}
SPEC.boar.draw=drawBoarG;SPEC.boarM.draw=drawBoarG;
