/* ===== 中ボスとモブ：一組ずつ =====
   モブと中ボスは同じ骨格。中ボスはモブより技が1つ多い。新しいタイミングのルールは中ボスで先に出す。 */
SPEC.boar={name:'突進イノシシ',k:1,draw:drawBoar,pose:{}};
SPEC.boarM={name:'暴れ大イノシシ',k:1.25,mid:true,draw:drawBoar,pose:{}};

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

/* たおれる：くらやみに拾われる */
for(const key of['boar','boarM'])mv({f:key,ox:BOAR[key].ox,id:key==='boar'?'b_down':'bM_down',n:'たおれる',bg:'def',len:190,noHero:true,keys:[K(0,{})],
 pp:(P,t)=>{if(t<8){P.hd=-.5;P.brs=1.4;P.x=2;P.jaw=1}
  else if(t<40){/* 前足が折れて、鼻から崩れる */const u=Math.min(1,(t-8)/20);P.dead=u*.8;P.cr=3*u;P.hd=1.1*u;P.y=6*u;P.roll=-.14*u;P.brs=1.4*(1-u)}
  else{const d=t-40;P.dead=Math.min(1,.8+d/40);P.cr=3;P.hd=1.1;P.y=6;P.roll=-.14;P.blink=1;
   if(d<30){P.run=d/4;P.runA=.3*(1-d/30)}/* 後ろ足が二度だけ宙をかく */
   P.seep=Math.max(0,(d-50)/80)*2.2}/* 倒れたものは、くらやみに拾われる：足元から黒い泥がのぼってくる */},
 cap:'頭をはね上げて鳴き、前足が折れて鼻から崩れる。後ろ足が二度だけ宙をかいて止まる。しばらくすると、足元から黒い泥がゆっくりのぼってくる。',
 why:'柱の法則「倒れたものは、くらやみに拾われる」。生きたまま逃げてきた獣も、倒れればくらやみの材料になる。勝つほど、くらやみに材料を渡している。'});
