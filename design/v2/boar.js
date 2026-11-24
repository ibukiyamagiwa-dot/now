/* ===== 四つ足：突進イノシシ・暴れ大イノシシ =====
   迷いこんだ生きた獣。下の階から何かが上がってくるので、上へ逃げてきた。主人公は下へ降りる者なので、ちょうど逃げ道をふさいでいる。
   攻めるのは怒りではなく、おびえ。だから白目をむき、背の毛が逆立つ。
   攻略でいちばん大事なのは「牙」（合図はいつも牙に出る）と「間合い」（遠いほど遅く着く）。牙を体でいちばん明るくする。
   中ボスは同じ骨格を大きくし、群れを守ってきた年寄りの印を足す：折れた牙、割れた額、長いたてがみ、割れたひづめ（地をかく癖＝溜め突進）。 */
const BMUD=['#07060a','#110d17','#1d1728'];/* 下の階の泥：黒に、ほんの少しの紫 */
const BV={
 n:{lbl:'覚悟1 ふつう',name:'突進イノシシ',coat:['#140c0a','#2e1c14','#4c3020','#6a4630','#8a6244'],mane:['#0c0706','#1e120e','#342018'],tusk:['#5e5446','#a89a84','#e8dcc6','#fffaf0'],mud:BMUD,eye:'#ffb070',sclera:'#d8d0c4',mudH:.35,smoke:0,third:0,vein:0},
 r:{lbl:'覚悟2 赤い',name:'赤い突進イノシシ',coat:['#160808','#341414','#52201c','#72322a','#94483c'],mane:['#0e0505','#220c0a','#3a1612'],tusk:['#5e5446','#a89a84','#e8dcc6','#fffaf0'],mud:BMUD,eye:'#ff5a3c',sclera:'#e8c8c0',mudH:.75,smoke:0,third:0,vein:1},
 k:{lbl:'覚悟3 黒い',name:'黒い突進イノシシ',coat:['#08070a','#1a171e','#2c2832','#423c48','#5c5464'],mane:['#050406','#121016','#221e28'],tusk:['#5e5446','#a89a84','#e8dcc6','#fffaf0'],mud:BMUD,eye:'#ff4040',sclera:'#c8c0c8',mudH:1.3,smoke:1,third:0,vein:1},
 v:{lbl:'覚悟4 紫の',name:'紫の突進イノシシ',coat:['#0c0614','#22122e','#3a2050','#56347a','#7650a0'],mane:['#08040e','#180c24','#2a163c'],tusk:['#5e5446','#a89a84','#e8dcc6','#fffaf0'],mud:BMUD,eye:'#ff6ad8',sclera:'#e0d0f0',mudH:1.7,smoke:1,third:1,vein:2}};
const BPDEF={seep:0,trem:0,look:0,x:0,y:0,cr:0,hd:0,run:0,runA:0,gal:0,paw:0,pawL:0,brs:0,roll:0,dead:0,blink:0,snort:0,dust:0,lean:0,daze:0,jaw:0};
function drawBoar(B,ox,oy,S,P0,T){const P=Object.assign({},BPDEF,S.pose||{});for(const[a,v]of Object.entries(P0||{}))if(v!==undefined&&!(typeof v==='number'&&!isFinite(v)))P[a]=v;
 if(P.hide)return{k:S.k||1,D:BV[P.tint||'n'],hoofs:[],gone:true};
 const k=S.k||1,D=BV[P.tint||S.tint||'n'],M=!!S.mid,dd=Math.max(0,Math.min(1,P.dead)),fd=c=>dd>0?mix(c,'#0a0608',.35*dd):c;
 const C=D.coat.map(fd),MA=D.mane.map(fd),TU=D.tusk,MU=D.mud.map(fd),FAR=a=>a.map(c=>mix(c,'#000000',.45));
 /* 体の回転（壁に激突・たおれる）：腰のあたりを中心に回す */
 const ro=P.roll,cx=ox+(P.x+(P.trem?Math.sin(T*2.3)*.6*P.trem:0))*k,cy=oy+P.y*k,piv=[cx,cy-10*k];
 const Q=(x,y)=>{let p=[cx+x*k,cy+(y+P.cr*(y<-4?.8:.2))*k];if(ro){const d=[p[0]-piv[0],p[1]-piv[1]],r=rot(d,ro);p=[piv[0]+r[0],piv[1]+r[1]]}return p};
 const br=Math.sin(T*.11)*(1-dd)*(P.runA?0:1);/* 息：おびえて浅く速い */
 const J={k,D};
 /* ===== 脚：肩と腰から、ひざ、ひづめ。足の運びは run（位相）と runA（振れ幅） ===== */
 const legs=[{h:[-9,-9],far:1,ph:.5,fr:1},{h:[9,-8],far:1,ph:0,fr:0},{h:[-7,-9],far:0,ph:0,fr:1},{h:[11,-8],far:0,ph:.5,fr:0}];
 const legL=M?[5.2,5]:[4.6,4.4],hoofs=[];
 function leg(L){const hp=Q(L.h[0],L.h[1]+(L.fr?br*.2:0));const ph=(P.run+L.ph)*Math.PI*2,A=P.runA;
  let fx=L.h[0]+(L.fr?-1:1)+Math.cos(ph)*5*A*(P.gal?1.3:1),fy=-Math.max(0,Math.sin(ph))*3.2*A;
  if(L.fr&&!L.far&&(P.paw||P.pawL)){fx+=-4*P.paw+P.pawL*7;fy=-8*P.paw}/* 前足で地をかく：持ち上げて、後ろへかく */
  let ft=[cx+fx*k,cy+fy*k];if(ro){const d=[ft[0]-piv[0],ft[1]-piv[1]],r=rot(d,ro);ft=[piv[0]+r[0],piv[1]+r[1]]}
  if(dd>.6&&L.fr)ft=LP(ft,add(hp,[-6*k,3*k]),(dd-.6)/.4);
  const kn=ik(hp,ft,legL[0]*k,legL[1]*k,L.fr?-1:1);
  const R=L.far?FAR(C):C,m=new Set();dCurve(m,t=>LP(hp,kn,t),3*k,1.7*k,6);dCurve(m,t=>LP(kn,ft,t),1.6*k,1.2*k,6);dShade(B,m,R,null,null,false);
  /* くらやみの泥：下の階を走ってきた跡。覚悟が上がるほど上までのぼる */
  const mh=Math.min(1,D.mudH+P.seep);for(const key of m){const[x,y]=UK(key),u=(ft[1]-y)/((ft[1]-hp[1])||1);if(u<mh*1.02+(hsh(x,0)-.5)*.18)B.set(x,y,L.far?MU[0]:(u<mh*.5?MU[1]:MU[2]),1)}
  /* ひづめ：二つに割れた黒いひづめ。中ボスは割れが深く、すり減っている（地をかく癖） */
  const hc=L.far?'#060406':'#16100e';B.set(ft[0]-1,ft[1]-1,hc,1);B.set(ft[0],ft[1]-1,M&&L.fr?'#2a2220':hc,1);B.set(ft[0]+1,ft[1]-1,hc,1);B.set(ft[0]-1,ft[1],hc,1);B.set(ft[0]+1,ft[1],hc,1);
  hoofs.push(ft)}
 legs.filter(L=>L.far).forEach(leg);
 /* ===== 胴：高い肩、低い腰。前が重い ===== */
 const body=new Set();const sp=cub([14,-11],[8,-15],[-2,-22],[-10,-21]);
 dCurve(body,t=>Q(...sp(t)),t=>lerp(6.2,9.2,t)*(M?1.08:1),0,12,.03,1);
 dDisc(body,...Q(12,-11),6.4,0,0);dDisc(body,...Q(-11,-15+br*.4),7.6*(M?1.06:1),.04,2);
 /* 腹の下がわは、えぐれて細い（やせて逃げてきた） */
 dShade(B,body,C,null,null,false);
 for(const key of body){const[x,y]=UK(key);const lo=Q(0,-8)[1];if(y>lo-1&&D.mudH+P.seep>1){const u=(y-(lo-1))/4;if(u<D.mudH+P.seep-1+hsh(x,y)*.4)B.set(x,y,y>lo+1?MU[1]:MU[2],1)}}
 /* 毛並み：胴に斜めの短い毛のすじ（ドットを一つおきに暗く） */
 for(const key of body){const[x,y]=UK(key);if(hsh(x,y)>.82&&B.get(x,y)===C[2]&&B.get(x,y-1)===C[2])B.set(x,y,C[1],1);else if(hsh(x,y)>.93&&B.get(x,y)===C[3])B.set(x,y,C[2],1)}
 /* 尾：短く、先に房。おびえると巻き上がる */
 {const a=Q(16,-12),b=add(a,rot([3*k,(-1-P.brs*2)*k],ro)),c=add(b,rot([1*k,(2-P.brs*4)*k],ro));B.line(a[0],a[1],b[0],b[1],C[1]);B.line(b[0],b[1],c[0],c[1],MA[1]);B.set(c[0],c[1]+1,MA[0],1)}
 /* ===== たてがみ：背の高いところに逆立つ硬い毛。おびえと怒りで立つ（brs）。中ボスは長く黒い ===== */
 const nb=M?13:9;for(let i=0;i<nb;i++){const t=i/(nb-1),p=sp(lerp(.15,1.05,t)),root=Q(p[0],p[1]-2.5),H=(M?3.2:2.2)+Math.sin(t*Math.PI)*(M?2.6:1.8)+P.brs*(M?2.2:1.6)+(i%2)*.8,a=-Math.PI/2+.55-t*.5+Math.sin(T*.3+i)*.04*P.brs+ro,tip=add(root,dir(a,H*k));
  const mid=LP(root,tip,.55);B.line(root[0],root[1],mid[0],mid[1],MA[2]);B.line(mid[0],mid[1],tip[0],tip[1],i%3?MA[1]:MA[0]);
  if(D.smoke&&!dd&&i%2===0){/* 黒い段から：毛の先から細い黒い煙 */const ph=(T*.5+i*7)%14;for(let j=0;j<3;j++){const q=add(tip,[Math.sin((ph+j*4)*.4+i)*1.2,-(ph*.6+j*2)]);if(ph+j*2<12)B.set(q[0],q[1],j?MU[1]:MU[2],5)}}}
 legs.filter(L=>!L.far).forEach(leg);
 /* ===== 頭：低く、前へ。鼻先は地面に近い。hd で下げる（突進の構え） ===== */
 const hA=-.12+P.hd*.55-P.snort*.12+P.daze*.3-P.look*.5,hb=Q(-16,-15),hq=(x,y)=>{const r=rot([x*k,y*k],hA+ro);return[hb[0]+r[0],hb[1]+r[1]]};
 const head=new Set();dCurve(head,t=>hq(lerp(2,-15,t),lerp(-3.5,.8,t)),t=>lerp(7,3.4,t)*(M?1.06:1),0,12,.02,3);dDisc(head,...hq(-2,-1),5.6,0,0);
 dShade(B,head,C,null,null,false);
 /* 鼻先（平たい円盤）。中ボスは鼻すじに古い傷 */
 const sn=hq(-17,1.2);B.disc(sn[0],sn[1],2.4*k,C[3],C[4],C[1],1);B.set(sn[0]-1*k,sn[1]-.4*k,'#120a08',1);B.set(sn[0]-1*k,sn[1]+.8*k,'#120a08',1);
 if(P.snort>0&&!dd){/* 鼻息：白い小さな息が二つ */for(let j=0;j<2;j++){const q=add(sn,[-3*k-P.snort*4-j*2,(j?2:-1)+Math.sin(T*.5+j)]);B.set(q[0],q[1],'#9a9090',5);B.set(q[0]-1,q[1],'#6a6266',5)}}
 /* 耳：寝かせた三角（おびえ） */{const e0=hq(0,-6.5),e1=hq(5.5,-9-P.brs*1.5),e2=hq(3,-4);B.poly([e0,e1,e2],C[2],C[3],C[1],1);B.set(...hq(3,-5.5),MA[1],1)}
 /* 中ボス：割れた額。何度も壁にぶつかってきた（弾かれると壁に激突する、の物語） */
 if(M){const a=hq(-4,-6),b=hq(-6.5,-4.5),c=hq(-6,-2.5);B.line(a[0],a[1],b[0],b[1],C[0]);B.line(b[0],b[1],c[0],c[1],C[0]);B.set(...hq(-3.5,-5.5),C[4],1);B.set(...hq(-7,-4),C[0],1)}
 /* 目：小さく、白目をむいている（おびえ）。紫の段では額に三つ目の細い目が開く（のまれるほど目が増える） */
 {const e=hq(-5,-3);if(!(P.blink>0||dd>.7)){B.set(e[0],e[1],D.sclera,2);B.set(e[0]-1,e[1],dd>.3?C[1]:D.eye,2);B.set(e[0]+1,e[1],D.sclera,2);B.set(e[0],e[1]+1,D.sclera,2);B.set(e[0]-1,e[1]-1,C[0],1);B.set(e[0],e[1]-1,C[0],1)}else B.line(e[0]-1,e[1],e[0]+1,e[1],C[0]);J.eye=e;
  if(D.third&&dd<.5){const f=hq(-2,-6);B.set(f[0],f[1]-1,D.eye,2);B.set(f[0],f[1],D.sclera,2);B.set(f[0],f[1]+1,D.eye,2)}
  if(D.vein){/* 赤い段から：目のまわりから首へ、くらやみの筋 */for(let i=0;i<2+D.vein;i++){const q=hq(-2+i*2.2,-1+((i*7)%3)*.8);B.set(q[0],q[1],MU[2],1)}}}
 /* 下あご（jaw）と牙。牙は体でいちばん明るい：合図はいつも牙の先に出る。中ボスの手前の牙は折れている */
 const jw=hq(-13,2.8+P.jaw*2);{const m=new Set();dCurve(m,t=>LP(hq(-1,2.8),jw,t),2.8*k,1.6*k,8);dShade(B,m,C.map(c=>mix(c,'#000000',.15)),null,null,false)}
 const tusk=(base,far,broken)=>{const L=(M?11:9.5)*(broken?.38:1),pts=[];for(let i=0;i<=10;i++){const t=i/10,p=hq(base[0]-Math.sin(t*2.6)*L*.42+t*L*.2,base[1]-t*L*.9);pts.push(p)}
  const lit=!far||M;for(let i=0;i<pts.length;i++){const p=pts[i],c=!lit?TU[1]:i>pts.length-3?TU[3]:i>3?TU[2]:TU[1];if(i)B.line(pts[i-1][0],pts[i-1][1],p[0],p[1],c,2);else B.set(p[0],p[1],c,2);if(i<6&&!far){B.set(p[0]+1,p[1],TU[1],2)}if(i<3)B.set(p[0]+1,p[1]+1,TU[0],2)}
  if(broken){const e=pts[pts.length-1];B.set(e[0]-1,e[1],TU[0],2);B.set(e[0],e[1]-1,TU[2],2)}return pts[pts.length-1]};
 const tf=tusk([-13.5,1.4],true,false);J.tip=tusk([-15.5,2.2],false,M);if(M)J.tip=tf;/* 中ボスは折れていない奥の牙が合図の場所 */
 J.tipNear=J.tip;J.head=hq(-6,-3);J.snout=sn;J.hoofs=hoofs;J.back=Q(-6,-24);J.hip=Q(10,-10);
 /* 気絶：頭のまわりを小さな星がまわる（ただの飾り、合図の色は使わない） */
 if(P.daze>0)for(let i=0;i<3;i++){const a=T*.18+i*2.1,q=add(hq(-3,-9),[Math.cos(a)*5*k,Math.sin(a)*1.6*k]);B.set(q[0],q[1],'#b8b0a0',5);B.set(q[0],q[1]-1,'#6a645a',5)}
 /* 土ぼこり（足元） */
 if(P.dust>0)for(let i=0;i<6;i++){const h=hsh(i,Math.floor(T/3)),q=[cx+(10+i*3+h*4)*k,cy-1-h*3*P.dust];B.set(q[0],q[1],i%2?'#4a4048':'#6a5c64',5)}
 return J}
