for(const k in LANC){const base=LANC[k.slice(0,3)+'idle']||LANC.lA_idle;for(const n in base)if(!(n in LANC[k]))LANC[k][n]=base[n]}
const ANC={"beast":[[6,-23],[8,-23],[10,-23]],"imp":[-11,-21],"golemS":[-9,-22],"golemR":[[-4,-20],[1,-20],[6,-20]],"armorSh":[-22,-28],"dollL":[[-5,-16],[-2,-16],[1,-16],[4,-16]],"dollK":[14,-16],"ghostS":[11,-36],"ghostH":[-8,-18],"samuraiH":[-10,-18],"samuraiBH":[-14,-24],"shadeT":[-17,-31],"bombF":[0,-21],"hydraN":[[-4,-34],[6,-42],[16,-40]],"hydraHead":[[15,12],[15,12]],"boarT":[-18,-12],"batT":[0,-6],"shroomT":[-11,-18],"slimeT":[-6,-8],"beastT":[-13,-12],"armorT":[-22,-18],"dollT":[-13,-4],"impT":[-11,-21],"knT":[[-7,-34],[-5,-34],[-3,-34],[-1,-34]],"knH":[[-10,-22],[3,-22]],"kgT":[[-8,-34],[-6,-34],[-4,-34],[-2,-34],[-7,-34],[-3,-34]],"kgH":[[-11,-22],[2,-22]],"kgC":[[7,-7],[11,-7],[15,-8]],"kgV":[-5,-44]};
const NCH='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!#$%&*+-/:;<=>?@^_~',NCACHE={};
function nCol(c,v,t){if(v==='w')return'#fff4ee';if(t==='r')c=mixHex(c,'#d83a2a',.32);else if(t==='k')c=mixHex(c,'#2a1838',.5);else if(t==='v')c=mixHex(c,'#4a1a7a',.45);if(v==='b')c=mixHex(c,'#6a6070',.62);return c}
function nspr(name,v,t){const k=name+'|'+v+'|'+(t||'');if(NCACHE[k])return NCACHE[k];const d=NSPR[name];if(d.z){d.r=d.r.map(r=>r.indexOf('`')<0?r:r.replace(/`(.)/g,(m,c)=>'.'.repeat(NCH.indexOf(c)+4)));d.z=0}const h=d.r.length,w=d.r[0].length,o=document.createElement('canvas');o.width=w;o.height=h;const x=o.getContext('2d');const cols=d.p.map(c=>nCol(c,v,t));
 d.r.forEach((r,y)=>{for(let i=0;i<w;i++){const ch=r[i];if(ch==='.')continue;x.fillStyle=cols[NCH.indexOf(ch)];x.fillRect(i,y,1,1)}});return NCACHE[k]=o}
function an_(k,x,y,i){return an(k,x,y,i)}
function an(k,x,y,i){const a=i==null?ANC[k]:ANC[k][i];return{x:x+a[0],y:y+a[1]}}
function eName(e){if(e.kind==='lord'||e.key==='gateK')return lordFrame(e);if(e.key==='gslime')return'gslime';if(e.key==='samuraiB')return'samuraiB';if(e.kind==='hydra')return'hydraBody';return e.kind==='boar'?(boarRun()?((G.anim>>1)%2?'boar0':'boar1'):'boar0'):e.kind==='echo'?((G.anim>>3)%2?'echo1':'echo2'):e.kind==='bat'?((G.anim>>3)%2?'bat1':'bat2'):e.kind==='dragon'?dragonFrame():e.kind}
function tailStrike(){if(G.state!=='enemy'||!G.en||G.en.kind!=='dragon')return null;return G.strikes.find(s=>!s.cx&&s.mv==='tail'&&G.et>=s.cue-1&&G.et<=s.impact+14)||null}
function dragonFrame(){const f2=(G.anim>>3)%2;if(G.state==='roar'&&G.t>=6&&G.t<66)return'dragonR'+f2;if(G.state==='blown'&&G.t>=12&&G.t<70)return'dragonR'+f2;if(tailStrike())return'dragonT'+f2;if(G.state==='enemy'){const s=G.strikes.find(s=>!s.done&&G.et>=s.cue-2)||G.strikes.find(s=>s.done&&!s.cx&&G.et<s.impact+8&&G.et>=s.impact);if(s){if(s.red)return'dragonR'+f2;if(s.mv==='stab'||s.mv==='breath')return'dragonM'+f2}}return'dragon'+((G.anim>>(G.en&&G.en.rage?2:3))%8)}
function glowLv(e){return e.kind==='dragon'&&e.rage&&e.lit?(G.anim>>3)%4:-1}
function eSpr(e,v){if(RIG.on(e))return RIG.img(e,v);const nm=eName(e);if(NSPR[nm])return nspr(nm,v,e.tint);return spr(nm,nm+v+e.col+glowLv(e),enemyPal(e,v))
}
const CACHE={};
function spr(name,key,pal){
 const k=name+key;if(CACHE[k])return CACHE[k];
 const rows=SPR[name],w=Math.max(...rows.map(r=>r.length)),h=rows.length,o=document.createElement('canvas');o.width=w;o.height=h;const x=o.getContext('2d');
 rows.forEach((r,y)=>{for(let i=0;i<r.length;i++){const col=pal[r[i]];if(r[i]!=='.'&&col){x.fillStyle=col;x.fillRect(i,y,1,1)}}});
 return CACHE[k]=o;
}
function rot90(src){const r=document.createElement('canvas');r.width=src.height;r.height=src.width;const x=r.getContext('2d');x.translate(r.width,0);x.rotate(Math.PI/2);x.drawImage(src,0,0);return r}
function px(x,y,col){l.fillStyle=col;l.fillRect(Math.round(x),Math.round(y),1,1)}
function pxLine(x0,y0,x1,y1,col){x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let er=dx+dy;l.fillStyle=col;for(let n=0;n<200;n++){l.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*er;if(e2>=dy){er+=dy;x0+=sx}if(e2<=dx){er+=dx;y0+=sy}}}
function outLine(x0,y0,x1,y1,col){for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]])pxLine(x0+a,y0+b,x1+a,y1+b,OUT);pxLine(x0,y0,x1,y1,col)}
function pxArc(cx,cy,r,a0,a1,col){if(!isFinite(r)||r>400)return;const st=1/Math.max(4,r);for(let a=a0;a<=a1;a+=st)px(cx+Math.cos(a)*r,cy+Math.sin(a)*r,col)}
function pxDisc(cx,cy,r,col){l.fillStyle=col;for(let y=-r;y<=r;y++){const w=Math.round(Math.sqrt(r*r-y*y));l.fillRect(Math.round(cx-w),Math.round(cy+y),w*2+1,1)}}
function pxStar(x,y,r,col){x=Math.round(x);y=Math.round(y);r=Math.round(r);const d=Math.round(r*.45);
 for(const[a,b,cc,dd]of[[x-r,y,x+r,y],[x,y-r,x,y+r],[x-d,y-d,x+d,y+d],[x-d,y+d,x+d,y-d]])outLine(a,b,cc,dd,col)}
function shadowPx(x,w){l.fillStyle='rgba(0,0,0,.45)';l.fillRect(Math.round(x-w),FLOOR,w*2+1,2);l.fillRect(Math.round(x-w+2),FLOOR+2,w*2-3,1)}

/* 背景（静的部分は一度だけ描く） */
const BG=document.createElement('canvas');BG.width=LW;BG.height=LH;
{const b=BG.getContext('2d');
 const band=['#1c0d16','#221019','#28141f','#2e1826'];
 for(let y=0;y<FLOOR;y++){b.fillStyle=band[Math.min(3,y/FLOOR*4|0)];b.fillRect(0,y,LW,1)}
 for(let y=4,i=0;y<FLOOR;y+=8,i++){b.fillStyle=OUT;b.fillRect(0,y,LW,1);b.fillStyle='rgba(255,220,230,.07)';b.fillRect(0,y+1,LW,1);
  for(let x=(i%2)*8;x<LW;x+=16){b.fillStyle=OUT;b.fillRect(x,y,1,8)}}
 const fl=['#24121b','#1f0f17','#1a0c13','#150a10','#10070c'];
 for(let y=FLOOR;y<LH;y++){b.fillStyle=fl[Math.min(4,(y-FLOOR)/6|0)];b.fillRect(0,y,LW,1)}
 b.fillStyle='rgba(255,220,230,.08)';for(let y=FLOOR+3,k=4;y<LH;y+=k,k+=2)b.fillRect(0,y,LW,1);
 b.fillStyle='rgba(255,220,230,.06)';for(let i=-6;i<=6;i++){for(let y=FLOOR;y<LH;y++){b.fillRect(Math.round(LW/2+i*(10+(y-FLOOR)*1.1)),y,1,1)}}
}
function drawBG(){
 l.drawImage(BG,0,0);
 for(const tx of [22,218]){
  const f=(G.anim>>3)%3,r=l.createRadialGradient(tx,38,1,tx,38,46+f*2);r.addColorStop(0,'rgba(255,170,80,.38)');r.addColorStop(1,'rgba(255,120,40,0)');l.fillStyle=r;l.fillRect(tx-50,0,100,100);
  l.fillStyle=OUT;l.fillRect(tx-2,41,5,9);l.fillStyle='#5a3a2a';l.fillRect(tx-1,42,3,7);
  const fh=[5,6,4][f];l.fillStyle='#ff8a3a';l.fillRect(tx-1,41-fh,3,fh);l.fillStyle='#ffd27a';l.fillRect(tx,41-fh+1,1,fh-1);px(tx+(f-1),40-fh,'#ff8a3a');
 }
}

/* 赤い光（重い一撃）を弾いたときの専用の動き：受けた重さで押し下げられ、足を滑らせて踏ん張り、剣をはね上げて返す
   0〜9F：押される（剣は下がり、盾は前）　10〜15F：はね上げ　16〜27F：元の位置へ　※止め（ヒットストップ）中は0Fのまま止まる */
const HV_T=28;
function hvU(){const p=G.hpose;return p&&p.k==='parryH'?HV_T-p.t:-1}
function hvX(){const u=hvU();if(u<0)return 0;if(u<10)return-Math.round(3+6*Math.min(1,u/8));if(u<20)return-9;return-Math.round(9*(1-(u-20)/8))}
/* 重い一撃を盾で受け止める立ち絵：身を低くして前のめり、足を前後に開き、両腕で大盾を構える。剣は振らず、後ろに下げたまま */
SPR.heroBrace=[
 "..........pp.....",
 ".........pppo....",
 "........ooooooo..",
 ".......osssssto..",
 ".......ossssstto.",
 ".......osstvvvvo.",
 "..c....ostssttto.",
 ".ccc...outttttuo.",
 "cccCo..oouuuuuo..",
 ".cCCooggoooooo...",
 "..cCotsssssstto..",
 "..cCotssgggsuto..",
 "...Cotsssgssuto..",
 "....ouuuuuuuuo...",
 "....otgggguuoo...",
 "...oottttuuuoo...",
 "..oubbo...oubbo..",
 ".oubbo.....oubbo.",
 "oubbo.......obbbo",
 "oooo........ooooo"];
SPR.shieldBig=[
 ".ooooooo.",
 "oqqqgqqqo",
 "oqqqgqqqo",
 "oqqqgqqqo",
 "ogggggggo",
 "oqqqgqqqo",
 "oqqqgqqqo",
 "oqqqgqqqo",
 ".oqqgqqo.",
 ".oqqgqqo.",
 "..oqgqo..",
 "...ogo...",
 "....o...."];
const SHIELD_W={o:OUT,q:'#ffffff',g:'#fff3b0'};
function heroBrace(x,y,u){const im=spr('heroBrace','n',HERO_PAL),ox=Math.round(x-8),oy=y-im.height;
 /* 剣：後ろへ下げたまま（振らない） */
 const hx=ox+5,hy=oy+12;outLine(hx,hy,hx-11,hy+7,'#e9f2ff');pxLine(hx-1,hy-2,hx+1,hy+2,'#e8c46a');
 l.drawImage(im,ox,oy);
 /* 大盾：受けた瞬間は白く光り、押されている間は細かく震える */
 const sh=u<10?((G.anim>>1)%2?1:0):0,sv=u<3?spr('shieldBig','w',SHIELD_W):spr('shieldBig','n',SHIELD_PAL);
 const sx=ox+12+sh,sy=oy+4;l.drawImage(sv,sx,sy);
 if(u<6){const k=u/6;pxArc(sx+9,sy+6,3+u*2,-1.2,1.2,`rgba(255,123,134,${1-k})`);pxArc(sx+9,sy+6,2+u,-1.0,1.0,`rgba(255,255,255,${1-k})`)}
 if(u>=10&&u<20&&(G.anim>>2)%2)px(sx+2,sy+1,'#ffffff')}
/* 主人公：本体はスプライト、剣と盾は姿勢ごとに付け替える */
function drawHero(){
 if(G.blow){const b=G.blow;if(b.x<-30)return;const img=(b.r>>2)%2?(CACHE.heroDown||(CACHE.heroDown=rot90(spr('hero','h',HERO_HIT)))):spr('hero','h',HERO_HIT);l.drawImage(img,Math.round(b.x-img.width/2),Math.round(FLOOR-24+b.y));return}
 if(G.uk){drawUKHero();return}
 const ps=G.hpose,k=ps?ps.k:'idle';let x=HX;const y=FLOOR,bob=(G.anim>>4)%2;
 x+=Math.round(lungeK(G.act)*lungeD());
 if(G.stop>0&&G.stopMax)x+=Math.round((G.vib==='h'?3:1)*G.stop/G.stopMax)*(G.anim%2?-1:1);
 if(G.state==='dying'||G.state==='lose'){shadowPx(x,12);l.drawImage(CACHE.heroDown||(CACHE.heroDown=rot90(spr('hero','h',HERO_HIT))),x-12,y-15);return}
 if(k==='dodge'){l.globalAlpha=.35;knight(x,y,'idle',0,false);l.globalAlpha=1;x-=11}
 if(k==='hit')x-=3;if(k==='parry')x+=2;
 if(k==='parryH'){const u=hvU();x+=hvX();if(u<20){const fx=x+4;for(let i=0;i<4;i++){const L=Math.min(9,2+u)-i*2;if(L>0)pxLine(fx+i,y-1+(i%2),fx+i+L,y-1+(i%2),i%2?'#6a5a4a':'#8a7a66')}shadowPx(x,10);heroBrace(x,y,u);return}}
 shadowPx(x,8);knight(x,y,k==='parryH'?'idle':k,bob,k==='hit');
}
function knight(x,y,k,bob,hit){
 const ox=Math.round(x-7),oy=y-24+bob;
 l.drawImage(spr('hero',hit?'h':'n',hit?HERO_HIT:HERO_PAL),ox,oy);
 const hu=-1,g=k==='guard';l.drawImage(spr('shield','n',SHIELD_PAL),ox+(g?11:7),oy+(g?7:10));
 let ang=-1.15;
 if(k==='ready')ang=-.45;if(k==='parry')ang=.05;if(k==='early')ang=-1.5;
 if(hu>=0){const L2=(a,b,q)=>a+(b-a)*Math.max(0,Math.min(1,q));ang=hu<10?.5+((G.anim>>1)%2?.05:0):hu<16?L2(.5,-2.05,(hu-10)/6):L2(-2.05,-1.15,(hu-16)/12)}
 const A=G.act&&G.act.n===1?G.act:null,I=A?A.I:0;
 const CA=A?contactPt().ac:0,L=(a0,a1,k)=>a0+(a1-a0)*Math.max(0,Math.min(1,k));
 if(A){const t=A.t;
  if(t>=8&&t<A.C)ang=-1.55+((G.anim>>2)%2?.06:0);
  else if(t>=A.C&&t<I-6)ang=chased(A)?-2.15:L(-1.55,-2.1,(t-A.C)/(I-6-A.C));
  else if(t>=I-6&&t<=I)ang=L(chased(A)?-2.15:-2.1,CA,(t-(I-6))/6);
  else if(A.chase==='ok'){if(t<=I+5)ang=L(CA,-1.3,(t-I)/5);else if(t<=I+8)ang=L(-1.3,CA+.15,(t-(I+5))/3);else ang=.95}
  else if(A.chase==='miss'&&t>=I+2)ang=1.25;
  else ang=L(CA,.6,(t-I)/(A.chase==='crit'?10:4))}
 if(G.act&&G.act.n===2)ang=-2.3;
 if(G.state==='ko'&&G.ko.parry&&G.t<=koZoomEnd())ang=.05;
 if(G.state==='win'||G.state==='clear'||(G.state==='ko'&&!G.act&&G.ko.shattered&&G.t>koZoomEnd()))ang=-1.57;
 if(A&&chased(A)&&A.t===I&&G.stop>0&&G.stopMax)ang+=(G.stopMax-G.stop)*P.bite;
 const hx=ox+13,hy=oy+14,ex=hx+Math.cos(ang)*15,ey=hy+Math.sin(ang)*15,nx=-Math.sin(ang),ny=Math.cos(ang);
 if(A){const t=A.t;
  if(t>=I-3&&t<I+4){const k=(t-(I-3))/7,a1=Math.min(ang,CA);pxArc(hx,hy,14,-2.1,a1,`rgba(255,255,255,${.9-k*.6})`);pxArc(hx,hy,16,-1.8,a1,`rgba(255,255,255,${.6-k*.5})`)}
  if(A.chase==='ok'&&t>=I+6&&t<I+13){const k=(t-(I+6))/7,cc='255,210,122';pxArc(hx,hy,15,-1.0,.95,`rgba(${cc},${1-k*.7})`);pxArc(hx,hy,17,-.8,.95,`rgba(${cc},${.8-k*.7})`);pxArc(hx,hy,13,-.9,.9,`rgba(${cc},${.6-k*.5})`)}}
 const ack=A&&chased(A)&&A.t<I;
 outLine(hx,hy,ex,ey,ack?(A.chase==='crit'?'#fff3b0':'#ffffff'):'#e9f2ff');
 if(ack&&(G.anim>>1)%2)pxStar(ex,ey,A.chase==='crit'?4:3,A.chase==='crit'?'#fff3b0':'#ffffff');
 if(G.act&&G.act.n===1&&!G.act.chase){const d=G.act.t-G.act.C;if(d>=0&&d<6)pxStar(ex,ey,2+Math.round(4*(1-d/6)),'#ffffff')}pxLine(hx+nx*2,hy+ny*2,hx-nx*2,hy-ny*2,'#e8c46a');
 if(k==='parry'){pxArc(hx,hy,19,-1.5,.7,'#bff4ff');pxArc(hx,hy,20,-1.3,.5,'#ffffff')}
 if(hu>=0&&hu<4){pxArc(hx,hy,19,-1.2,.9,'#ffffff');pxArc(hx,hy,21,-1,.8,'#ff7b86')}
 if(hu>=10&&hu<18){const q=(hu-10)/8,a1=Math.max(-2.05,.5-2.55*Math.min(1,(hu-10)/6));pxArc(hx,hy,16,a1,.5,`rgba(255,210,122,${1-q*.8})`);pxArc(hx,hy,18,a1,.4,`rgba(255,123,134,${.8-q*.7})`)}
}

/* 敵 */
function enemyPose(){
 let gold=false,lean=0,lunge=0,twitch=0,cue=-1,red=false,hold=0,fake=false,pulse=false,proj=false,rise=0,mv=null;
 if(G.state==='blown'){const t=G.t;if(t<34){lean=Math.min(1,t/16);if(t>=22){cue=t-22;red=true}}else lunge=Math.max(0,1-(t-34)/24);return{lean,lunge,twitch,cue,red,hold}}
 if(G.state==='enemy'){
  const LF=G.en.lungeF||4;for(const s of G.strikes){if(s.proj||s.cx)continue;if(s.ft){const d=G.et-s.impact;if(d>=0&&d<s.ft){lunge=Math.max(lunge,d<20?1:1-(d-20)/(s.ft-20));continue}}if(s.mv==='charge'||s.mv==='pool')continue;const sc=s.mv==='hslam'?.5:s.mv==='slam'?.45:s.mv==='stab'?.2:s.mv==='tail'||s.mv==='breath'||s.mv==='step'||s.mv==='bite'||s.mv==='arm'||s.mv==='bk'||s.mv==='reach'||s.mv==='vlash'||s.mv==='cape'?0:1;const d=G.et-s.impact;if(d>-LF&&d<9)lunge=Math.max(lunge,(d<0?(LF+d)/LF:1-d/9)*sc)}
  const s=G.strikes.find(s=>!s.done);
  if(s&&G.et>=s.start){
   lean=Math.min(1,(G.et-s.start)/10);
   if(G.et<s.cue){if(s.feint&&(s.cue-G.et)%38<5&&s.cue-G.et>12)twitch=1}
   else{cue=s.dark||s.lob||s.nolight?-1:G.et-s.cue;red=s.red;gold=!!s.rallyOpen;proj=s.proj;if(s.beats&&!s.lob){const k=G.et-s.cue;pulse=s.beats.some(b=>k>=b&&k<b+4);hold=Math.min(1,k/20)}if(s.fake){lean=0;lunge=cue<4?cue/4*.3:Math.max(0,.3*(1-(cue-4)/10));fake=true}else if(s.beat&&!s.dark){const B=s.bf||P.golemBeatF,N=s.bn||4;hold=s.mv==='smash'?Math.min(1,(Math.min(N,Math.floor(cue/B))+Math.min(1,(cue%B)/4)*(cue<B*N?1:0))/N):Math.min(1,cue/(B*2));pulse=cue>=B&&cue%B<B/2&&cue<=B*N+B/2}
   if(s.mv==='hslam')rise=Math.min(1,cue/(s.cl-4));if(s.mv==='slam'){const B=s.bf||10,kk=cue-(s.bo||0),h=Math.min(3,Math.max(0,Math.floor(kk/B))),lv=[.12,.45,.75,1],pv=h?lv[h-1]:0;rise=pv+(lv[h]-pv)*Math.min(1,Math.max(0,kk-h*B)/4)}mv=s.mv}
  }
 }
 if(G.state==='enemy'){for(const s of G.strikes){if((s.mv==='slam'||s.mv==='hslam')&&!s.done&&G.et>=s.impact-3)rise=Math.max(0,(s.impact-G.et)/3)}}
 return{lean,lunge,twitch,cue,red,hold,fake,pulse,proj,rise,mv,gold};
}
function drawEnemy(){
 const e=G.en,p=enemyPose();
 if(G.ko&&G.ko.shattered)return;
 if((G.state==='win'||G.state==='clear')&&(G.t>30||(G.t>>1)%2))return;
 const white=G.ko&&(G.stop>0||(G.ko.boss&&(!G.ko.lord||G.t<16)&&(G.anim>>1)%2));
 const v=white||e.hurt>5?'w':e.broken?'b':'n',pal=enemyPal(e,v),img=eSpr(e,v),w=img.width,h=img.height;
 const idle=(G.state!=='enemy'?(G.anim>>4)%2:0)+(e.fly?e.fly+Math.round(Math.sin(G.anim*.12)*2):0);
 const vb=G.stop>0&&G.stopMax?Math.round((G.vib==='e'?3:1)*G.stop/G.stopMax)*(G.anim%2?1:-1):0;
 const AN=G.ko?null:anticip(e);const x=(G.state==='enter'&&G.enter?G.enter.dx:0)+(AN?AN.dx:0)+(G.ko?G.ko.ex:e.kind==='boar'?boarX():Math.round(ENX(e)+p.lean*5-p.lunge*lungeDist(e)-p.twitch*6+Math.round(G.knock)+(e.hurt&&!G.stop?(e.hurt%4<2?2:-2):0)))+vb,y=FLOOR;
 const SC=e.sc||1,PX=e.kind==='ghost'&&!G.ko?(ghostAlpha().x??x):x;if(e.kind!=='ghost'||(ghostAlpha().a||0)>.2)shadowPx(PX,e.shw||((w*SC)>>1));if(SC>1){l.save();l.translate(PX,y);l.scale(SC,SC);l.translate(-PX,-y)}
 if(G.ko&&G.ko.sliced){
  const x0=x-(w>>1),y0=y-h,g=sliceGeo(w,h,x0,y0),o=sliceOff();
  l.save();l.beginPath();l.moveTo(g.ax,g.ay);l.lineTo(g.bx,g.by);l.lineTo(g.bx,y0-60);l.lineTo(g.ax,y0-60);l.closePath();l.clip();l.drawImage(img,x0+o.ux,y0+o.uy);l.restore();
  l.save();l.beginPath();l.moveTo(g.ax,g.ay);l.lineTo(g.bx,g.by);l.lineTo(g.bx,y+20);l.lineTo(g.ax,y+20);l.closePath();l.clip();l.drawImage(img,x0+o.lx,y0+o.ly);l.restore();
  if(G.ko.sliceT<10)outLine(g.ax+o.lx,Math.round(g.ay),g.bx+o.ux,Math.round(g.by)+o.uy,'#ffffff');
  if(SC>1)l.restore();return;
 }
 const AI=e.uhp&&e.kind!=='hydra'?aliveIdx():null,bigF=AI&&e.ubig[AI[0]],xs=AI?x-(AI.length-1)*9:x;
 if(AI){for(let k=AI.length-1;k>=1;k--){const u=AI[k],bob=Math.round(Math.abs(Math.sin(G.anim*.15+k*1.7))*3);if(e.ubig[u])l.drawImage(img,xs-(w>>1)+k*14+2,y-h*2-bob,w*2,h*2);else l.drawImage(img,xs-(w>>1)+k*14,y-h-bob)}}
 const bs=e.kind==='boar'&&boarStrike(),bd=bs&&bs.res==='parry'?G.et-bs.impact:-1;if(bd>=0&&bd<12){l.save();l.translate(x,y-h/2-Math.round(Math.sin(bd/12*Math.PI)*16));l.rotate(Math.PI/2*Math.floor(bd/3));l.drawImage(img,-(w>>1),-(h>>1));l.restore()}
 const GA=e.kind==='ghost'?ghostAlpha():null;let gx=xs;if(GA){l.globalAlpha=GA.a;gx=GA.x??xs}
 if(!G.ko)G.ex=GA&&GA.x!=null?GA.x:xs;
 if(bd>=0&&bd<12){}else if(AN){const W2=(bigF?w*2:w)*AN.sx,H2=(bigF?h*2:h)*AN.sy;l.drawImage(img,Math.round(gx-W2/2),Math.round(y-H2-idle),Math.round(W2),Math.round(H2))}
 else if(bigF)l.drawImage(img,xs-w,y-h*2-idle,w*2,h*2);else if(e.kind==='slime'&&e.key!=='gslime'){const L=nspr('slimeL',v,e.tint);l.drawImage(L,gx-(L.width>>1),y-L.height-idle)}else{const yy=y-h-idle-(p.hold?((G.anim>>2)%2):0)-Math.round((p.rise||0)*9);if(e.rim&&!G.ko&&v!=='w'){const so=silh(img);for(const[dx,dy]of[[-1,0],[1,0],[0,-1],[0,1]])l.drawImage(so,gx-(w>>1)+dx,yy+dy)}l.drawImage(img,gx-(w>>1),yy)}
 if(GA&&GA.d==null&&!G.ko){const t=an('ghostS',gx,y);outLine(t.x,t.y,t.x,y-4,'#6a5a3a');outLine(t.x,t.y,t.x-10,t.y-3,'#9aaac0');outLine(t.x-10,t.y-3,t.x-14,t.y,'#9aaac0')}
 if(GA&&GA.d!=null){const gx=GA.x,sw=GA.d>-4,hx0=gx-8,hy0=y-18,hx1=sw?gx-18:gx+3,hy1=sw?y-8:y-32,bx=sw?gx-24:gx-9,by=sw?y-16:y-36;outLine(hx0,hy0,hx1,hy1,'#5a4a3a');outLine(hx1,hy1,bx,by,'#d9e2f2');if(!sw&&GA.wind<8)pxStar(bx,by,3+((GA.wind>>1)%2),'#c8f0ff')}
 if(GA)l.globalAlpha=1;
 if(e.kind==='hydra'){drawHydra(x,y-Math.round((p.rise||0)*9),v,pal);drawHPool(v,e.tint)}
 if(e.kind==='doll'){const ds=G.state==='enemy'&&G.strikes.find(s=>s.mv==='tick'&&!s.done&&G.et>=s.cue),lit=ds?ds.beats.filter(b=>G.et-ds.cue>=b).length:0;for(let j=0;j<4;j++){const L=an('dollL',x,y,j),lx=L.x,ly=L.y,on=j<lit,fl=lit===4&&(G.anim>>1)%2;l.fillStyle=OUT;l.fillRect(lx-1,ly-1,4,4);l.fillStyle=on?(lit===4?(fl?'#ffffff':'#ff5a5a'):'#ffd75e'):'#3a2a20';l.fillRect(lx,ly,2,2)}}
 if(e.kind==='doll'){const sp=[.08,.16,.28,.45,.7][Math.min(4,e.wind||0)]*(G.state==='enemy'?1.6:1),an=G.anim*sp,K=an_('dollK',x,y),kx=K.x,ky=K.y;for(let j=0;j<2;j++){const a=an+j*Math.PI/2,dx=Math.round(Math.cos(a)*3),dy=Math.round(Math.sin(a)*3);outLine(kx-dx,ky-dy,kx+dx,ky+dy,'#e8c46a')}px(kx,ky,'#7a5a2a')}
 if(e.shield&&e.guardUp){const S2=an('armorSh',x,y);l.drawImage(nspr('armorShield',v,e.tint),S2.x,S2.y)}
 if(G.ko&&G.ko.parry&&G.stop>0){const k=Math.min(1,(G.ko.stop0-G.stop)/6),g=sliceGeo(w,h,x-(w>>1),y-h);outLine(g.ax,Math.round(g.ay),Math.round(g.ax+(g.bx-g.ax)*k),Math.round(g.ay+(g.by-g.ay)*k),'#e9fbff')}
 let tip;
 if(e.kind==='golem'){
  const sw=G.state==='enemy'?p.lunge:0,tr=p.hold&&!sw?((G.anim>>1)%2?1:-1):0,SH=an('golemS',x,y),ry=y-20-p.lean*6-p.hold*16,fx=Math.round(x-20-p.lean*3-sw*6+tr),fy=Math.round(ry+(y-8-ry)*sw),sx=SH.x,sy=SH.y;
  {const gs=G.state==='enemy'&&G.strikes.find(s=>s.mv==='smash'&&!s.done&&G.et>=s.cue),B=gs?(gs.bf||P.golemBeatF):12,lit=gs?Math.min(3,Math.floor((G.et-gs.cue)/B)):0,fl=lit===3&&(G.anim>>1)%2;for(let j=0;j<3;j++){const R=an('golemR',x,y,j),on=j<lit;l.fillStyle=OUT;l.fillRect(R.x-2,R.y-2,5,5);l.fillStyle=on?(lit===3?(fl?'#ffffff':'#ff5a5a'):'#ffd75e'):'#3a2a20';l.fillRect(R.x-1,R.y-1,3,3)}}
  for(let t=0;t<=1;t+=.1){const ax=sx+(fx-sx)*t,ay=sy+(fy-sy)*t;l.fillStyle=OUT;l.fillRect(Math.round(ax)-3,Math.round(ay)-3,7,7)}
  for(let t=0;t<=1;t+=.1){const ax=sx+(fx-sx)*t,ay=sy+(fy-sy)*t;l.fillStyle=nCol('#64626e',v,e.tint);l.fillRect(Math.round(ax)-2,Math.round(ay)-2,5,5)}
  {const F=nspr('fist',v,e.tint);l.drawImage(F,fx-(F.width>>1),fy-(F.height>>1));tip={x:fx-5,y:fy-6}}
 }else if(e.kind==='beast'){tip=p.proj?{x:an('beast',x,y,0).x,y:an('beast',x,y,0).y-8-idle}:{x:an('beastT',x,y).x,y:an('beastT',x,y).y-idle};const fly=G.state==='enemy'?G.strikes.filter(s=>s.proj&&!s.done&&G.et>=s.impact-12).length:0;for(let i=0;i<Math.max(0,(e.daggers||0)-fly);i++){const D=an('beast',x,y,i),bx=D.x,by=D.y-idle;outLine(bx+1,by,bx+3,by-7,OUT);outLine(bx,by,bx+2,by-7,'#d9e2f2');px(bx,by+1,'#7a4a2a')}}
 else if(e.kind==='shade'){tip=an('shadeT',x,y)}
 else if(e.kind==='armor'){tip=an('armorT',x,y)}
 else if(e.kind==='bat'){const T=an('batT',x,y);tip={x:T.x,y:T.y-idle}}
 else if(e.kind==='shroom'){const T=an('shroomT',x,y);tip={x:T.x,y:T.y-idle}}
 else if(e.kind==='slime'){tip=bigF?{x:xs-14,y:y-14-idle}:{x:xs-7,y:y-8-idle}}
 else if(e.kind==='bomb'){tip={x:x-6,y:y-10};if(e.fuse!=null&&e.fuse>0){const BF=an('bombF',x,y),bx=BF.x,by=BF.y,n=e.fuse*5;let ex=bx,ey=by;for(let i=0;i<n;i++){ex=bx+Math.round(i*.6);ey=by-1-i+(i%4===3?1:0);px(ex,ey,'#c8a060');px(ex+1,ey,'#5a4030')}if((G.anim>>2)%2)pxStar(ex,ey-1,e.fuse<=1?3:2,e.fuse<=1?'#ff4a5a':'#ffd27a')}}
 else if(e.kind==='samurai'){const H=an(e.key==='samuraiB'?'samuraiBH':'samuraiH',x,y);if(G.state==='enemy'){const ex=Math.round(H.x-14-p.lean*3),ey=Math.round(H.y-10-p.lean*6);outLine(H.x,H.y,ex,ey,v==='w'?'#fff4ee':'#d9e2f2');tip={x:ex,y:ey}}else tip={x:H.x-4,y:H.y-2}}
 else if(e.kind==='dragon'){const ts=tailStrike();if(ts){const tp=tailPose(ts,x,y);drawTail(tp,pal)}dragonBeatLamps(x,y);tip=p.mv==='tail'&&ts?(()=>{const tp=tailPose(ts,x,y);return{x:Math.round(tp.E[0]),y:Math.round(tp.E[1])}})():p.mv==='tail'?{x:x+37,y:y-38}:p.mv==='slam'?{x:x-14,y:y-40-Math.round((p.rise||0)*9)}:p.mv==='breath'?{x:x-34,y:y-57}:{x:x-36,y:y-17}}
 else if(e.kind==='imp'){const Hd=an('imp',x,y);tip={x:Hd.x,y:Hd.y};const thr=G.state==='enemy'&&G.strikes.some(s=>s.lob&&!s.done&&G.et>=s.cue&&G.et<s.cue+4);const ls=G.state==='enemy'&&G.strikes.find(s=>s.lob&&!s.done&&G.et>=s.start&&G.et<s.cue);if(!thr){const k=ls?Math.min(1,(G.et-ls.start)/Math.max(1,ls.cue-ls.start)):0,rx=Hd.x,ry=Math.round(Hd.y-10*k);disc(rx,ry,3,OUT);disc(rx,ry,2.2,'#8a7d74');px(rx-1,ry-1,'#c8bcb0')}}
 else if(e.kind==='knight'&&e.key==='gateK'){tip=drawGateK(e,x,y-idle,v)}
 else if(e.kind==='knight'){const ns=G.state==='enemy'&&G.strikes.find(s=>!s.done),k=ns&&G.et>=ns.start?Math.max(0,1-Math.abs(G.et-ns.cue)/10):0,LN=[6, 9, 7, 3],ct=nCol('#4a2260',v,e.tint),cT=nCol('#9a62b4',v,e.tint);
  if(!G.ko)for(let j=0;j<4;j++){const R=an('knT',x,y,j),L=LN[j];for(let i=0;i<L;i++){const f=i/L,sw=Math.sin(G.anim*.06+j*1.9+i*.45)*f*1.6,cu=-k*f*f*(5+j),yy=R.y+Math.round(i*(1-.3*k));px(Math.round(R.x+sw+cu),yy,i===L-1?cT:ct)}}
  tip=an('knH',x,y,ns?G.strikes.filter(s=>s.done).length%2:0)}
 else if(RIG.on(e)){tip=RIG.tip(e,x,y-idle)}
 else if(e.kind==='lord'){tip=drawLordFx(e,x,y-idle,v)}
 else if(e.kind==='boar'){tip=an('boarT',x,y)}
 else if(e.kind==='doll'){tip=an('dollT',x,y)}
 else if(e.kind==='ghost'){tip={x:x-9,y:y-14}}
 else if(e.kind==='echo'){tip={x:x-2,y:y-6-idle}}
 else if(e.kind==='hydra'){const hs=G.state==='enemy'&&G.strikes.find(s=>!s.done),ps=poolStrike();if(ps){tip={x:Math.round(poolX(ps,G.et)),y:FLOOR-4}}else if(hs&&hs.heads){const hp=hydraHeadPos(hs.heads[hs.heads.length>1?1:0],x,y);tip={x:Math.round(hp[0])-6,y:Math.round(hp[1])+2}}else tip={x:x-14,y:y-26-Math.round((p.rise||0)*9)}}
 else{tip={x:x-19,y:y-18-idle}}
 if(e.kind==='dragon')drawFire(x,y);
 if(e.broken&&RIG.on(e))RIG.brkStars(e,x,y-idle);
 else if(e.broken){for(let i=0;i<3;i++){const an=G.anim*.08+i*2.1;pxStar(x+Math.cos(an)*11,y-h-5+Math.sin(an)*2,2,'#e8c46a')}}
 if(tip){const SR=PORTV?LW-42:LW-10,SL=PORTV?42:10;tip={x:Math.max(SL,Math.min(SR,tip.x)),y:Math.max(14,tip.y)}}
 if(p.cue>=0&&p.cue<12){if(p.fake)pxArc(tip.x,tip.y,2+Math.round(p.cue/2),0,Math.PI*2,'#c9a8ff');else{pxStar(tip.x,tip.y,3+Math.round(6*(1-p.cue/12)),p.red?'#ff4a5a':p.gold?'#ffd27a':'#ffffff');if(p.gold)pxArc(tip.x,tip.y,3+p.cue,0,Math.PI*2,'#ffd27a')}}
 else if(p.pulse){pxStar(tip.x,tip.y,4,p.red?'#ff4a5a':'#ffffff')}
 if(SC>1)l.restore();
}
function pxEllipse(cx,cy,rx,ry,col){const st=1/Math.max(6,rx);for(let a=0;a<Math.PI*2;a+=st)px(cx+Math.cos(a)*rx,cy+Math.sin(a)*ry,col)}
function bolt(x0,y0,x1,y1,seed,col){let r=seed;const rnd=()=>{r=(r*16807)%2147483647;return r/2147483647};let ax=x0,ay=y0;for(let i=1;i<=8;i++){const k=i/8,nx=x0+(x1-x0)*k+(i<8?(rnd()-.5)*16:0),ny=y0+(y1-y0)*k;outLine(ax,ay,nx,ny,col);ax=nx;ay=ny}}
function drawSpell(a){
 const lv=a.lv,T=magT(lv),t=a.t,col=SCOL[lv];
 if(t<T+4){const k=Math.min(1,t/6),rot=G.anim*.1;pxEllipse(HX,FLOOR+1,Math.round((10+lv*3)*k),2+lv,col);for(let i=0;i<4+lv*2;i++){const an=rot+i*Math.PI*2/(4+lv*2);px(HX+Math.cos(an)*(10+lv*3)*k,FLOOR+1+Math.sin(an)*(2+lv),'#ffffff')}}
 if(lv===1&&t<T){const k=t/T,ox=HX+12+(EX-HX-24)*k,oy=FLOOR-26-Math.sin(k*Math.PI)*12;pxDisc(ox,oy,4,'#a8320c');pxDisc(ox,oy,3,'#ff9a3a');pxDisc(ox,oy,1,'#fff3b0')}
 if(lv===2){if(t<T&&(G.anim>>1)%2)pxStar(HX+6,FLOOR-38,3,'#ffe14a');
  if(t>=T&&t<T+12){for(let i=0;i<3;i++){if(t-T>=i*3){const sd=a.seed+i*97+((G.anim>>1)%3)*13;bolt(EX-6+(i-1)*10,-2,EX-6+(i-1)*3,FLOOR-8,sd,i===1?'#ffffff':'#ffe14a')}}}}
 if(lv===3){const k=Math.min(1,t/(T*.7));
  if(t<T+10){pxEllipse(EX-4,FLOOR+1,Math.round(26*k),Math.round(6*k),'#7fe3ff');pxEllipse(EX-4,FLOOR+1,Math.round(18*k),Math.round(4*k),'#e8c46a');
   for(let i=0;i<8;i++){const an=-G.anim*.06+i*Math.PI/4;px(EX-4+Math.cos(an)*22*k,FLOOR+1+Math.sin(an)*5*k,'#ffffff')}}
  if(t>=T-3&&t<T+20){const w=t<T?2:Math.min(28,6+(t-T)*4),fade=t>T+12?1-(t-T-12)/8:1,cx=EX-4;
   l.fillStyle=`rgba(127,227,255,${.55*fade})`;l.fillRect(Math.round(cx-w/2-3),0,w+6,FLOOR+2);
   l.fillStyle=`rgba(255,255,255,${.9*fade})`;l.fillRect(Math.round(cx-w/2),0,w,FLOOR+2)}}
}

function disc(cx,cy,r,col){cx=Math.round(cx);cy=Math.round(cy);l.fillStyle=col;const R=Math.max(0,r);for(let dy=-Math.floor(R);dy<=Math.floor(R);dy++){const dx=Math.floor(Math.sqrt(R*R-dy*dy));l.fillRect(cx-dx,cy+dy,dx*2+1,1)}}
function lerp2(a,b,t){return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]}
/* 尾：構え（3拍のカラカラ）→ 背中越しに振り下ろす（一定速度）→ 戻す */
function dragonBeatStrike(){return G.state==='enemy'&&G.en&&G.en.kind==='dragon'?G.strikes.find(s=>s.beat&&!s.done&&!s.cx&&G.et>=s.cue):null}
function dragonBeatLamps(x,y){const s=dragonBeatStrike();if(!s)return;const B=s.bf||9,lit=Math.min(3,Math.max(0,Math.floor((G.et-s.cue-(s.bo||0))/B))),fl=lit===3&&(G.anim>>1)%2;
 for(let j=0;j<3;j++){const lx=x-4+j*9,ly=y-74,on=j<lit;l.fillStyle=OUT;l.fillRect(lx-2,ly-2,6,6);l.fillStyle=on?(lit===3?(fl?'#ffffff':(s.red?'#ff3a3a':'#ff5a5a')):(s.red?'#ff8a5a':'#ffd75e')):'#3a2a20';l.fillRect(lx-1,ly-1,4,4)}}
function drawSlamShadow(){const s=G.state==='enemy'&&G.en&&G.en.kind==='dragon'&&G.strikes.find(x=>x.mv==='slam'&&!x.done&&G.et>=x.cue);if(!s)return;const B=s.bf||10,kk=G.et-s.cue-(s.bo||0),h=Math.min(3,Math.max(0,Math.floor(kk/B))),w=10+h*8,cx=HX+6,cy=FLOOR+1;l.globalAlpha=.35+h*.17;l.fillStyle='#000000';for(let dx=-w;dx<=w;dx++){const hh=Math.round(2.2*Math.sqrt(Math.max(0,1-(dx*dx)/(w*w))));l.fillRect(cx+dx,cy-hh,1,hh*2+1)}l.globalAlpha=1}
function tailPose(s,x,y){const B=[x+20,y-29],rest={C:[x+32,y-36],E:[x+38,y-46]},up={C:[x+44,y-80],E:[x+8,y-74]},hit={C:[x-26,y-96],E:[HX+16,y-3]};
 const k=G.et-s.cue,d=G.et-s.impact,SW=9;let C,E;
 if(d>0){const r=Math.min(1,d/14),q=r*r;C=lerp2(hit.C,rest.C,q);E=lerp2(hit.E,rest.E,q)}
 else if(d>=-SW){const t=(d+SW)/SW;C=lerp2(up.C,hit.C,t);E=lerp2(up.E,hit.E,t)}
 else{const Bt0=s.bf||9,h=Math.min(2,Math.max(0,Math.floor(k/Bt0))),u=Math.min(1,(h+Math.min(1,Math.max(0,k-h*Bt0)/4))/3),q=1-(1-u)*(1-u);C=lerp2(rest.C,up.C,q);E=lerp2(rest.E,up.E,q);const Bt=s.bf||9;if(k>=Bt&&k%Bt<3){E=[E[0]+((k%2)?2:-2),E[1]-2]}}
 return{B,C,E,sw:d>=-SW&&d<=0?(d+SW)/SW:-1}}
function bez(p,t){const u=1-t;return[u*u*p.B[0]+2*u*t*p.C[0]+t*t*p.E[0],u*u*p.B[1]+2*u*t*p.C[1]+t*t*p.E[1]]}
function drawTail(p,pal){const N=90,pts=[];for(let i=0;i<=N;i++)pts.push(bez(p,i/N));const rad=i=>1.3+2.7*Math.pow(1-i/N,.7);
 for(let i=0;i<=N;i++)disc(pts[i][0],pts[i][1],rad(i)+1,OUT);
 for(let i=0;i<=N;i++)disc(pts[i][0],pts[i][1],rad(i),pal[2]);
 for(let i=0;i<=N;i++)if(rad(i)>=1.5)disc(pts[i][0],pts[i][1]-rad(i)*.5,rad(i)*.45,pal[3]);
 const a=pts[N-3],b=pts[N],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1;outLine(Math.round(b[0]),Math.round(b[1]),Math.round(b[0]+dx/L*5),Math.round(b[1]+dy/L*5),pal.w);
 if(p.sw>0){for(let j=1;j<=4;j++){const q=p.sw-j*.12;if(q<0)break;const P2=tailPoseAt(p.B[0]-20,p.B[1]+29,q);px(P2[0],P2[1],j<2?'#ffffff':'#fff3b0');px(P2[0]+1,P2[1],'#e0707c')}}}
/* 三つ首の触手：深淵だまりから伸び上がり、拍ごとにうねって、竜の尾と同じく振り下ろす */
function htentStrike(){if(G.state!=='enemy'||!G.en||G.en.kind!=='hydra')return null;return G.strikes.find(s=>!s.cx&&s.mv==='htent'&&G.et>=s.cue-2&&G.et<=s.impact+16)||null}
function htentPose(s,x,y){const B=[x-22,y-1],k=G.et-s.cue,d=G.et-s.impact,SW=9,w=G.anim*.25,Bt=s.bf||12;
 const low={C1:[x-26,y-4],C2:[x-34,y-6],E:[x-38,y-4]},up={C1:[x-14,y-34],C2:[x-60,y-46],E:[x-34,y-80]},hit={C1:[x-30,y-58],C2:[HX+46,y-58],E:[HX+16,y-3]};
 let P,sw=-1;
 if(d>0){const r=Math.min(1,d/16),q=r*r;P={C1:lerp2(hit.C1,low.C1,q),C2:lerp2(hit.C2,low.C2,q),E:lerp2(hit.E,low.E,q)}}
 else if(d>=-SW){const t=(d+SW)/SW,q=t*t;sw=t;P={C1:lerp2(up.C1,hit.C1,q),C2:lerp2(up.C2,hit.C2,q),E:lerp2(up.E,hit.E,q)}}
 else{const u=Math.min(1,Math.max(0,k+2)/12),q=1-(1-u)*(1-u),jb=k>=Bt&&k%Bt<4?(4-k%Bt)*1.6:0;
  P={C1:lerp2(low.C1,up.C1,q),C2:lerp2(low.C2,up.C2,q),E:lerp2(low.E,up.E,q)};
  P.C1=[P.C1[0]+Math.sin(w)*3*q,P.C1[1]];P.C2=[P.C2[0]+Math.sin(w+1.7)*5*q-jb,P.C2[1]-jb];P.E=[P.E[0]+Math.sin(w+3)*4*q+jb*1.5,P.E[1]+Math.cos(w+2)*2*q-jb]}
 return{B,C1:P.C1,C2:P.C2,E:P.E,sw}}
function bez3(p,t){const u=1-t;return[u*u*u*p.B[0]+3*u*u*t*p.C1[0]+3*u*t*t*p.C2[0]+t*t*t*p.E[0],u*u*u*p.B[1]+3*u*u*t*p.C1[1]+3*u*t*t*p.C2[1]+t*t*t*p.E[1]]}
function drawHTent(x,y,v,tint,back){const s=htentStrike();if(!s)return;const p=htentPose(s,x,y);const N=80,pts=[];for(let i=0;i<=N;i++)pts.push(bez3(p,i/N));
 const rad=i=>1.2+4.3*Math.pow(1-i/N,.8),c1=nCol('#2a1838',v,tint),c2=nCol('#4e2a64',v,tint),c3=nCol('#8a5aa0',v,tint);
 if(back){for(let i=0;i<=N;i++)disc(pts[i][0],pts[i][1],rad(i)+1,OUT);for(let i=0;i<=N;i++)disc(pts[i][0],pts[i][1],rad(i),c1);for(let i=0;i<=N;i++)if(rad(i)>=1.6)disc(pts[i][0]-rad(i)*.3,pts[i][1]-rad(i)*.4,rad(i)*.5,c2);
  for(let i=6;i<N-6;i+=7){const a=pts[i-1],b=pts[i+1],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,r=rad(i)*.7;px(pts[i][0]+dy/L*r,pts[i][1]-dx/L*r,c3)}
  const a=pts[N-4],b=pts[N],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1;outLine(Math.round(b[0]),Math.round(b[1]),Math.round(b[0]+dx/L*3-dy/L*2),Math.round(b[1]+dy/L*3+dx/L*2),c3);return}
 for(let k=-3;k<=3;k++)if((G.anim>>2)%2||k%2)px(p.B[0]+k*2,p.B[1]+(Math.abs(k)>2?0:-1),c3);
 if(p.sw>0){for(let j=1;j<=4;j++){const q=p.sw-j*.12;if(q<0)break;const P2=lerp2([x-34,y-80],[HX+16,y-3],q*q);px(P2[0],P2[1],j<2?'#ffffff':'#e0c8ff');px(P2[0]+1,P2[1],c3)}}}
/* 三つ首の深淵だまり：幽霊の足音と同じ拍で3歩ぶん近づき、次の拍で触手の先がのぞき、その次の拍で足元から飛び出す */
function poolStrike(){if(G.state!=='enemy'||!G.en||G.en.kind!=='hydra')return null;return G.strikes.find(s=>!s.cx&&s.mv==='pool'&&G.et>=s.start&&G.et<=s.impact+22)||null}
function poolX(s,et){const B=s.bf||18,N=s.bn||3,k=et-s.cue,P0=EX-26,P1=HX+12,pos=j=>P0+(P1-P0)*j/N,j=Math.min(N,Math.floor(k/B));if(j<1)return pos(0);const f=Math.min(1,(k-j*B)/5),q=1-(1-f)*(1-f);return pos(j-1)+(pos(j)-pos(j-1))*q}
function drawHPool(v,tint){const s=poolStrike();if(!s)return;const B=s.bf||18,N=s.bn||3,k=G.et-s.cue,d=G.et-s.impact,x=Math.round(poolX(s,G.et)),y=FLOOR,c0=nCol('#140a1c',v,tint),c1=nCol('#2a1838',v,tint),c2=nCol('#4e2a64',v,tint),c3=nCol('#9a62b4',v,tint);
 const grow=Math.min(1,(G.et-s.start)/10),fade=d>14?Math.max(0,1-(d-14)/8):1,rw=Math.round((7+7*grow)*fade);if(rw<1)return;
 for(let dx=-rw;dx<=rw;dx++){const a=Math.abs(dx),hh=a<rw-2?3:a<rw?2:1;l.fillStyle=OUT;l.fillRect(x+dx,y-hh,1,hh+1);l.fillStyle=a<rw-3?c0:c1;l.fillRect(x+dx,y-hh+1,1,hh);px(x+dx,y-hh,((dx+(G.anim>>2))%3)?c2:c3)}
 for(let b=0;b<3;b++){const ph=(G.anim+b*11)%22,bx=x+((b*7+3)%(rw*2+1))-rw;if(ph<12)px(bx,y-4-(ph>>1),ph<8?c3:c2)}
 let h=0;const em=B*(N+1);
 if(d<0&&k>=em){const u=Math.min(1,(k-em)/6);h=4+u*12+Math.sin(G.anim*.4)*2}
 else if(d>=0){h=d<3?16+d*16:d<14?64:Math.max(0,64-(d-14)*8)}
 if(h<1)return;const w=G.anim*.3,P={B:[x,y-1],C1:[x+Math.sin(w)*2,y-h*.35],C2:[x-Math.sin(w+1.3)*3,y-h*.7],E:[x-2-(d>=0?Math.min(14,h*.25):0)+Math.sin(w+2)*2,y-h]};
 const NN=40,pts=[];for(let i=0;i<=NN;i++)pts.push(bez3(P,i/NN));const R=Math.min(1,h/24),rad=i=>(1.2+5.6*R)*Math.pow(1-i/NN,.75)+.9;
 for(let i=0;i<=NN;i++)disc(pts[i][0],pts[i][1],rad(i)+1,OUT);for(let i=0;i<=NN;i++)disc(pts[i][0],pts[i][1],rad(i),c1);for(let i=0;i<=NN;i++)if(rad(i)>=1.6)disc(pts[i][0]-rad(i)*.4,pts[i][1],rad(i)*.45,c2);
 for(let i=5;i<NN-4;i+=6)px(pts[i][0]+rad(i)*.6,pts[i][1],c3);px(pts[NN][0],pts[NN][1]-1,c3);
 for(let dx=-rw;dx<=rw;dx++){l.fillStyle=Math.abs(dx)<rw-2?c0:c1;l.fillRect(x+dx,y-1,1,2)}}
function tailPoseAt(x,y,t){const up=[x+8,y-74],hit=[HX+16,y-3];return lerp2(up,hit,t)}
/* 炎：3拍で口に火をためる → 火の玉が一定速度で飛んでくる */
function drawFire(x,y){if(G.state==='roar'&&G.t>=10&&G.t<56){for(let j=0;j<3;j++){const r=((G.t-10)*2.2+j*14)%42;if(r>3)pxArc(x-36,y-57,r,Math.PI*.55,Math.PI*1.45,j%2?'#ff7b86':'#ffd27a')}}if(G.state!=='enemy')return;const s=G.strikes.find(s=>s.mv==='breath'&&!s.done);if(!s)return;const k=G.et-s.cue,d=G.et-s.impact,B=s.bf||9,M=[x-36,y-57],T=[HX+14,y-14];if(k<0)return;
 if(d<-9){const n=Math.min(3,Math.floor(k/B)),fl=(G.anim>>1)%2,r=1+n*1.2+fl*.5;disc(M[0],M[1],r+1.5,'#7a1a10');disc(M[0],M[1],r+.6,'#ff7a3c');disc(M[0],M[1],r*.55,'#ffd27a');px(M[0],M[1],'#ffffff');if(k%B<2&&k>=B)pxArc(M[0],M[1],r+3+(k%B)*2,0,Math.PI*2,'#ff7a3c')}
 else{const t=(d+9)/9,P2=lerp2(M,T,t);for(let j=5;j>=1;j--){const q=Math.max(0,t-j*.07),Q=lerp2(M,T,q);disc(Q[0]+(Math.random()-.5)*2,Q[1]+(Math.random()-.5)*2,4.2-j*.6,j>3?'#7a1a10':'#ff7a3c')}disc(P2[0],P2[1],5.5,'#7a1a10');disc(P2[0],P2[1],4.5,'#ff7a3c');disc(P2[0],P2[1],3,'#ffd27a');disc(P2[0],P2[1],1.5,'#ffffff')}}

function boarStrike(){return G.state==='enemy'&&G.en&&G.en.kind==='boar'?G.strikes.find(s=>!s.cx&&s.mv==='charge'&&G.et>=s.start&&G.et<=s.impact+s.ft):null}
function boarRun(){const s=boarStrike();return!!s&&G.et>=s.cue&&G.et<s.impact}
function boarX(){const s=boarStrike();if(!s)return EX;const SX=EX+s.back;
 if(G.et<s.cue){const k=(G.et-s.start)/(s.cue-s.start);return Math.round(EX+(SX-EX)*Math.min(1,k*1.4)+((G.et>>2)%2&&k>.4?1:0))}
 if(G.et<s.impact)return Math.round(SX+(boarC(G.en)-SX)*(G.et-s.cue)/(s.impact-s.cue));
 const d=G.et-s.impact;
 if(s.res==='parry'){if(d<12)return Math.round(boarC(G.en)+(EX+46-boarC(G.en))*Math.sin(d/12*Math.PI/2));if(d<32)return EX+46;return Math.round(EX+46-46*Math.min(1,(d-32)/12))}
 if(d<10)return Math.round(boarC(G.en)+14*Math.sin(d/10*Math.PI/2));return Math.round(boarC(G.en)+14+(EX-boarC(G.en)-14)*Math.min(1,(d-10)/24))}
const GSTEP=20,GHX=HX+30;function ghostStart(n){return GHX+n*GSTEP}
/* 予備動作：予兆の瞬間に大きく身を縮めて引き、溜めて震え、伸びて飛びかかり、行き過ぎて戻る */
const ANT=new Set(['slime','beast','shroom','armor','bat','shade','samurai','bomb','knight']);
function anticip(e){if(G.state!=='enemy'||!ANT.has(e.kind)||e.skin)return null;const LF=e.lungeF||4;
 const s=G.strikes.find(s=>!s.cx&&!s.dark&&G.et>=s.cue&&(s.fake?G.et<=s.end:G.et<=s.impact+6));if(!s)return null;
 const k=G.et-s.cue,d=s.fake?-99:G.et-s.impact;
 if(d>0){const q=1-d/6;return{sx:1+.18*q,sy:1-.12*q,dx:0}}
 if(d>=-LF)return{sx:1.28,sy:.84,dx:0};
 const set=Math.min(1,k/4),tr=d>-12&&(G.anim>>1)%2?1:0;return{sx:1.18-.04*set,sy:.76+.06*set,dx:7+tr}}
function ghostAlpha(){const e=G.en;if(G.state==='ko'||G.state==='win'||G.state==='clear')return{a:1};
 if(G.state==='enemy'){const s=G.strikes.find(s=>!s.cx&&s.mv==='step'&&G.et>=s.cue+(s.bf||12)*((s.bn||2)+1)&&G.et<=s.impact+10);if(s){const d=G.et-s.impact,w=G.et-s.cue-(s.bf||12)*((s.bn||2)+1);return{a:d<=0?Math.min(.9,.25+w*.12):1-Math.max(0,d-4)/7,x:GHX,wind:d<=0?w:-1,d}}const w=G.strikes.find(s=>s.mv==='step'&&!s.done);if(w&&G.et<w.cue+4){const k=G.et-w.start;return{a:Math.min(.55,k/10)*(G.et<w.cue?1:1-(G.et-w.cue)/4),x:ghostStart(w.bn)}}return{a:.04}}
 return{a:e.hurt?.9:.32+.08*Math.sin(G.anim*.1)}}
/* 三つ首：首の位置（待機のゆらぎ・光る予告・噛みつき） */
function hydraHeadPos(i,x,y){const base=[[x-48,y-42],[x-30,y-58],[x-6,y-64]][i],sw=Math.sin(G.anim*.07+i*2.1)*2;let hx=base[0],hy=base[1]+sw;
 if(G.state==='enemy'){const s=G.strikes.find(s=>!s.cx&&s.heads&&s.heads.includes(i)&&s.res!=='cut'&&G.et>=s.cue-2&&G.et<=s.impact+8);if(s){const d=G.et-s.impact,T=s.heads.length>1?[HX+24+(i-1)*4,FLOOR-14+(i-1)*6]:[HX+24,FLOOR-14];
  if(d<-6){const k=Math.min(1,(G.et-s.cue+2)/8);hx+=8*k;hy-=6*k}else if(d<=0){const k=(d+6)/6;hx=hx+8+(T[0]-hx-8)*k;hy=hy-6+(T[1]-hy+6)*k}else{const k=1-d/8;hx=hx+(T[0]-hx)*k;hy=hy+(T[1]-hy)*k}}}
 return[hx,hy]}
function drawHydra(x,y,v,pal){const e=G.en,t=e.tint,cN=nCol('#241e34',v,t),cH=nCol('#3a3050',v,t),cR=nCol('#6a5a48',v,t),HA=ANC.hydraHead[0];
 for(let i=2;i>=0;i--){const B=[x+ANC.hydraN[i][0],y+ANC.hydraN[i][1]],alive=e.uhp[i]>0;
  if(!alive){const E=[B[0]-6,B[1]-7];for(let q=0;q<=1;q+=.1)disc(B[0]+(E[0]-B[0])*q,B[1]+(E[1]-B[1])*q,4,OUT);for(let q=0;q<=1;q+=.1)disc(B[0]+(E[0]-B[0])*q,B[1]+(E[1]-B[1])*q,3,cN);disc(E[0],E[1],2.5,'#5a1a22');px(E[0],E[1],'#a85ae0');continue}
  const H=hydraHeadPos(i,x,y),C=[B[0]+(H[0]-B[0])*.15+8,B[1]+(H[1]-B[1])*.75],P2={B,C,E:[H[0]+8,H[1]+2]},N=48,pts=[];for(let k=0;k<=N;k++)pts.push(bez(P2,k/N));
  const rad=k=>4.2-1.4*k/N;
  pts.forEach((q,k)=>disc(q[0],q[1],rad(k)+1,OUT));pts.forEach((q,k)=>disc(q[0],q[1],rad(k),cN));pts.forEach((q,k)=>disc(q[0]-1,q[1]-1,rad(k)*.4,cH));
  for(let k=8;k<N-6;k+=10){const a=pts[k],b2=pts[k+1],dx=b2[0]-a[0],dy=b2[1]-a[1],L=Math.hypot(dx,dy)||1;let nx=dy/L,ny=-dx/L;if(ny>0){nx=-nx;ny=-ny}outLine(Math.round(a[0]),Math.round(a[1]),Math.round(a[0]+nx*(rad(k)+3)),Math.round(a[1]+ny*(rad(k)+3)),cR)}
  const s=G.state==='enemy'&&G.strikes.find(s=>!s.cx&&s.heads&&s.heads.includes(i)&&!s.done&&G.et>=s.cue-2),op=!!s||(G.state==='roar');
  const pg=(G.pings||[]).find(p=>p.heads&&p.heads.includes(i)&&p.at!=null&&G.et-p.at<10);
  const im=nspr((op?'hydraHo':'hydraH')+i,pg&&(G.anim>>1)%2?'w':v,t);l.drawImage(im,Math.round(H[0])-HA[0],Math.round(H[1])-HA[1]);
  if(pg){const k=G.et-pg.at;pxArc(H[0]-3,H[1]-1,6+k,0,Math.PI*2,k<5?'#ffffff':['#ff8a6a','#8affa0','#8ac8ff'][i])}}}
/* 投石：放物線の岩と、足元で大きくなる影 */
function drawLob(){if(G.state!=='enemy'||(G.en.kind!=='imp'&&G.en.kind!=='hydra'))return;const AC=G.en.kind==='hydra';for(const s of G.strikes){if(!s.lob||s.done||G.et<s.cue)continue;
 const T=s.impact-s.cue,k=(G.et-s.cue)/T,x0=AC?EX-6:EX-8,y0=AC?FLOOR-38:FLOOR-20,x1=HX+24,y1=FLOOR-6,x=x0+(x1-x0)*k,y=y0+(y1-y0)*k-Math.sin(k*Math.PI)*((y0+y1)/2-32);
 const B=s.beats?s.beats[0]:13,kf=G.et-s.cue,st=Math.min(3,Math.floor(kf/B)),q=Math.min(1,(st+Math.min(1,(kf-st*B)/3))/4+(kf>=4*B-1?1:0)),R=12,sw=Math.max(1,Math.round(R*q)),cy=FLOOR+2;
 for(let dx=-R;dx<=R;dx++){const yy=Math.round(Math.sqrt(1-(dx/R)**2)*2.5);if((dx+G.anim)%3===0){px(x1+dx,cy-yy,'#8a6a70');px(x1+dx,cy+yy,'#8a6a70')}}
 l.fillStyle=kf>=4*B-2?'#ffffff':`rgba(0,0,0,${.35+.5*q})`;for(let dx=-sw;dx<=sw;dx++){const yy=Math.round(Math.sqrt(1-(dx/(sw+.01))**2)*2.4*Math.max(.4,q));l.fillRect(x1+dx,cy-yy,1,yy*2+1)}
 if(y>-6){disc(x,y,3.6,OUT);disc(x,y,2.8,AC?'#6ad04a':'#8a7d74');px(x-1,y-1,AC?'#d8ff9a':'#c8bcb0')}}}
function drawRocksFloor(){for(let i=0;i<(G.floorD||0);i++){const x=HX+18+i*7,y=FLOOR-(i%2);disc(x,y,3.4,OUT);disc(x,y,2.6,'#8a7d74');px(x-1,y-1,'#c8bcb0')}}
function bossHitFx(s){if(!s.mv)return;const hx=HX+14,fy=FLOOR;
 if(s.mv==='smash'){shake(P.shake*1.3);SFX.rock();for(let i=0;i<16;i++)G.pts.push({x:hx+6+Math.random()*22,y:fy,vx:(Math.random()-.5)*2.2,vy:-.6-Math.random()*1.6,t:0,life:30,col:i%2?'#6a5560':'#8f929e',sz:2,drag:.95,g:.1})}
 if(s.mv==='slam'||s.mv==='hslam'){shake(P.shake*1.4);for(let i=0;i<18;i++)G.pts.push({x:hx+10+Math.random()*30,y:fy,vx:(Math.random()-.5)*2.4,vy:-1-Math.random()*1.6,t:0,life:26,col:i%2?'#6a5560':'#3a2a32',sz:2,drag:.95,g:.1})}
 if(s.mv==='tail'||s.mv==='htent'||s.mv==='pool'){shake(P.shake*1.1);for(let i=0;i<14;i++)G.pts.push({x:hx+2+Math.random()*16,y:fy,vx:(Math.random()-.5)*2.6,vy:-.8-Math.random()*1.8,t:0,life:22,col:i%2?'#6a5560':'#fff3b0',sz:2,drag:.95,g:.12})}
 if(s.mv==='breath'){shake(P.shake*1.2);for(let i=0;i<24;i++)G.pts.push({x:hx+4,y:fy-16+Math.random()*10,vx:-1.6-Math.random(),vy:(Math.random()-.5)*1.2,t:0,life:22,col:i%3?'#ff7a3c':'#ffd27a',sz:2,drag:.94,g:-.02})}}
function drawBossFX(){if(G.state!=='enemy'||G.en.kind!=='dragon')return;const mx=EX-36,my=FLOOR-17;
 for(const s of G.strikes){const d=G.et-s.impact;
  if(s.mv==='stab'&&d>=-4&&d<=4){const k=1-Math.abs(d)/5,tx=Math.round(mx+(HX+14-mx)*k);for(let j=0;j<2;j++){outLine(mx,my+j*3,tx,FLOOR-15+j*3,OUT);outLine(mx,my+j*3-1,tx,FLOOR-16+j*3,'#e0707c')}}}}
function drawDaggers(){
 drawBossFX();drawLob();const ROCK=G.en&&G.en.kind==='imp';if(ROCK)drawRocksFloor();
 for(let i=0;i<(ROCK?0:G.floorD||0);i++){const x=HX+14+i*6,y=FLOOR+3-(i%2);l.fillStyle=OUT;l.fillRect(x-1,y-2,9,4);l.fillStyle='#d9e2f2';l.fillRect(x,y-1,5,2);l.fillStyle='#ffffff';l.fillRect(x+1,y-1,2,1);l.fillStyle='#7a4a2a';l.fillRect(x+5,y-1,2,2)}
 const a=G.act;if(G.state==='hero'&&a&&a.thr){for(const ht of a.thr){const k=(a.t-(ht-8))/8;if(k<0||k>1)continue;const x0=HX+12,y0=FLOOR-14,x1=EX-8,y1=FLOOR-18,x=Math.round(x0+(x1-x0)*k),y=Math.round(y0+(y1-y0)*k-Math.sin(k*Math.PI)*6);if(ROCK){disc(x,y,3,OUT);disc(x,y,2.2,'#8a7d74');continue}outLine(x-5,y-1,x+1,y-1,OUT);outLine(x-5,y+1,x+1,y+1,OUT);outLine(x-4,y,x,y,'#d9e2f2');px(x-5,y,'#7a4a2a');px(x-6,y,'#7a4a2a')}}
 if(G.state!=='enemy')return;for(const s of G.strikes){if(!s.proj||s.done||s.lob)continue;const F=12,k=(G.et-(s.impact-F))/F;if(k<0||k>1)continue;
 const x0=EX-6,y0=FLOOR-18,x1=HX+12,y1=FLOOR-14,x=Math.round(x0+(x1-x0)*k),y=Math.round(y0+(y1-y0)*k-Math.sin(k*Math.PI)*6);
 outLine(x-1,y-1,x+5,y-1,OUT);outLine(x-1,y+1,x+5,y+1,OUT);outLine(x,y,x+4,y,'#d9e2f2');px(x+5,y,'#7a4a2a');px(x+6,y,'#7a4a2a');if((G.anim>>1)%2)px(x+1,y-1,'#ffffff')}}
function drawFX(){
 drawDaggers();
 for(const p of G.pts){if(p.t>p.life*.7&&(p.t>>1)%2)continue;l.fillStyle=p.col;l.fillRect(Math.round(p.x),Math.round(p.y),p.sz,p.sz)}
 for(const m of G.marks){const k=m.t/m.life,sz=Math.round(m.size*(k<.3?.6+k*1.4:1.02-(k-.3)*.4)),x=Math.round(m.x),y=Math.round(m.y);
  if(m.kind==='x'){outLine(x-sz,y-sz,x+sz,y+sz,m.col);outLine(x-sz,y+sz,x+sz,y-sz,m.col);if(k<.4){pxLine(x-sz+1,y-sz,x+sz,y+sz-1,'#ffffff')}}
  else if(m.kind==='star')pxStar(x,y,sz,m.col);
  else{outLine(x-sz,y+sz,x+sz,y-sz,m.col)}}
 for(const r of G.rings){const k=r.t/r.life;if(k>.6&&(r.t>>1)%2)continue;pxArc(r.x,r.y,Math.round(r.r0+(r.r1-r.r0)*Math.sqrt(k)),0,Math.PI*2,r.col)}
 if(G.spark&&G.spark.t<16){const s=G.spark,k=s.t/16;pxStar(s.x,s.y,6+Math.round(10*k),'#e9fbff');if(k<.8)pxArc(s.x,s.y,4+Math.round(26*k),0,Math.PI*2,'#7fe3ff')}
 if(G.act&&G.act.n===2)drawSpell(G.act);
 if(G.state==='enemy'&&guideOn()){const s=G.strikes.find(s=>!s.done);if(s&&!s.fake&&G.et>=s.cue){const k=Math.max(0,(s.impact-G.et)/s.cl);pxArc(HX+6,FLOOR-14,10+Math.round(40*k),0,Math.PI*2,'#ffffff')}}
}
function drawTexts(){
 c.textAlign='center';const lo=PORTV?120:0,hi=PORTV?840:960,maxW=hi-lo-36;
 for(const t of G.txt){const k=t.t/(t.l||44);if(k>.75&&(t.t>>1)%2)continue;const C=G.cam;let fs=Math.round((t.big?32:16)*UIS);c.font=`${fs}px ${FONT}`;
  let lines=[t.s];if(t.big&&c.measureText(t.s).width>maxW){const i=t.s.indexOf('、');if(i>0&&i<t.s.length-1)lines=[t.s.slice(0,i+1),t.s.slice(i+1)]}
  const w0=Math.max(...lines.map(L=>c.measureText(L).width));if(w0>maxW){fs=Math.max(12,Math.floor(fs*maxW/w0));c.font=`${fs}px ${FONT}`}
  const w=Math.max(...lines.map(L=>c.measureText(L).width)),lh=Math.round(fs*1.15);
  let xx=(t.x-C.x0)*C.z;xx=Math.max(lo+18+w/2,Math.min(hi-18-w/2,xx));
  const yy=Math.max((PORTV?8:108)+fs,(t.y-Math.min(1,t.t/10)*6-C.y0)*C.z);
  c.lineWidth=Math.max(3,Math.round(fs/6));c.strokeStyle='#120509';
  lines.forEach((L,j)=>{c.strokeText(L,xx,yy+j*lh);c.fillStyle=t.col;c.fillText(L,xx,yy+j*lh)})}
 c.textAlign='left';
}
function gauge(x,y,w,v,max,col,label){
 c.fillStyle='#0d0509';c.fillRect(x,y,w,16);c.fillStyle=col;c.fillRect(x+4,y+4,Math.round((w-8)*Math.max(0,v/max)/4)*4,8);
 c.strokeStyle='#5a4050';c.lineWidth=4;c.strokeRect(x+2,y+2,w-4,12);
 c.font=`16px ${FONT}`;c.fillStyle='#efe6e8';c.fillText(label,x,y-6);
}
function enemyTag(e){if(!inBattle()||!e)return null;if(e.fuse!=null&&e.hp>0)return{s:e.fuse<=0?'爆発！':`爆発まで ${e.fuse}`,c:'#ff9a3a'};if(e.flee!=null&&e.hp>0)return{s:e.flee<=0?'逃げそう！':`逃げるまで ${e.flee+1}`,c:'#ffe878'};if(e.stance)return{s:'構え中',c:'#ff9a9a'};if(e.kind==='doll'&&inBattle())return{s:'ゼンマイ '+'●'.repeat(Math.min(4,(e.wind||0)))+'○'.repeat(Math.max(0,4-(e.wind||0))),c:'#e8c46a'};return null}
function drawTags(){const e=G.en,tg=enemyTag(e);if(!tg||e.kind==='bomb'||G.state==='ko'||G.state==='win')return;const C=G.cam,z=C.z,img=eSpr(e,'n');c.textAlign='center';c.font=`${Math.round(16*Math.min(UIS,1.5))}px ${FONT}`;c.lineWidth=6;c.strokeStyle='#120509';const xx=(EX-C.x0)*z,yy=(FLOOR-img.height*(e.sc||1)-8-C.y0)*z;c.strokeText(tg.s,xx,yy);c.fillStyle=tg.c;c.fillText(tg.s,xx,yy);c.textAlign='left'}
function drawHUD(){
 drawTags();
 if(PORTV){if(G.state==='enemy'&&guideOn())drawBar();if(G.state==='hero'&&heroGuide()&&G.act&&G.act.n===1&&G.act.t>=8)drawChaseBar();drawPrompt();return}
 const h=G.hero,e=G.en;
 c.fillStyle='rgba(12,5,9,.78)';c.fillRect(16,12,304,96);c.fillRect(640,12,304,96);
 gauge(28,44,280,h.hp,h.max,h.hp/h.max>.3?'#6fd18c':'#e2505c',`騎士　HP ${h.hp}/${h.max}`);
 if(lvMax()&&!(G.mode==='tut'&&TUT[G.tut.i].key!=='magic')){const lv=Math.floor(h.mk/100),bl=G.mkFlash>0&&(G.mkFlash>>1)%2;c.font=`16px ${FONT}`;c.fillStyle=bl?'#ffffff':'#7fe3ff';c.fillText(`見切り ${lv}段`,28,78);
  for(let i=0;i<lvMax();i++){const x=28+i*62;c.fillStyle='#0d0509';c.fillRect(x,84,58,16);const f=Math.max(0,Math.min(100,h.mk-i*100));c.fillStyle=f>=100?(bl?'#ffffff':'#7fe3ff'):'#2f6f86';c.fillRect(x+4,88,Math.round(50*f/100/2)*2,8);c.strokeStyle=f>=100?'#7fe3ff':'#5a4050';c.lineWidth=4;c.strokeRect(x+2,86,54,12)}}
 c.font=`16px ${FONT}`;c.fillStyle='#8dffb0';c.fillText(`薬 ×${h.pot}`,224,96);if(h.psn){c.fillStyle='#c98ae8';c.fillText(`毒 ${h.psn}`,150,96)}
 gauge(652,44,280,e.hp,e.hpMax,'#d8606b',`${e.name}${e.boss?'（ボス）':e.mid?'（中ボス）':''}　HP ${e.hp}`);
 if(G.mode==='tut'&&TUT[G.tut.i].key==='magic'&&!G.card){const k=(Math.sin(G.anim/8)+1)/2;c.strokeStyle=k>.5?'#fff3b0':'#e8c46a';c.lineWidth=4;c.strokeRect(20,62,196,44);c.font=`16px ${FONT}`;c.fillStyle='#fff3b0';c.fillText('◀ パリィで溜まる',224,78)}
 const showBrk=has('brk')&&G.mode!=='tut';if(showBrk){c.fillStyle='#efe6e8';c.fillText('ブレイク',652,96);}
 if(e.shield&&e.guardUp){c.fillStyle='#cfd8e6';c.fillText('盾：構え中',800,96)}
 {const tg=enemyTag(e);if(tg){c.fillStyle=tg.c;c.fillText(tg.s,800,96)}}
 for(let i=0;i<(showBrk?breakNeed():0);i++){c.fillStyle='#5a4050';c.fillRect(732+i*20,84,16,16);c.fillStyle=i<e.brk?'#e8c46a':'#2e1d29';c.fillRect(736+i*20,88,8,8)}
 c.textAlign='center';c.fillStyle='#bba9b0';c.fillText(G.mode==='tut'?tutLbl():floorLbl()+(FEAT.unlocks?`　魂 ${META.soul}`:''),480,32);c.textAlign='left';
 if(G.state==='enemy'||G.state==='cmd'){c.textAlign='center';c.font=`16px ${FONT}`;c.fillStyle=G.state==='enemy'?'#ff9a9a':'#e8c46a';c.fillText(G.state==='enemy'?'▼ 敵の攻撃':'▲ あなたの番',480,58);c.textAlign='left'}
 if(G.state==='pick')drawPick();
 if(G.state==='result')drawResult();
 if(G.state==='enemy'&&guideOn())drawBar();
 if(G.state==='hero'&&heroGuide()&&G.act&&G.act.n===1&&G.act.t>=8)drawChaseBar();
 drawPrompt();
 if(!MOB&&G.state==='cmd'&&G.mode!=='tut'&&(G.anim>>5)%2===0){c.textAlign='center';c.font=`16px ${FONT}`;c.fillStyle='#e8c46a';c.fillText(`▶ A で${cmdName(G.sel)}　（↑↓ でえらぶ）`,480,516);c.textAlign='left'}
}
function panel(x,y,w,h){c.fillStyle='rgba(12,5,9,.92)';c.fillRect(x,y,w,h);c.strokeStyle='#e8c46a';c.lineWidth=4;c.strokeRect(x+2,y+2,w-4,h-4)}
function drawPrompt(){
 const tp=PORTV?'':aW(tutPrompt()),tb=PORTV?null:G.tipBox;
 if(tp){const w=Math.max(360,tp.length*24+60),x=480-w/2;c.fillStyle='rgba(12,5,9,.85)';c.fillRect(x,118,w,52);c.strokeStyle=G.state==='tutok'?'#fff3b0':'#7fe3ff';c.lineWidth=4;c.strokeRect(x+2,120,w-4,48);
  c.textAlign='center';c.font=`24px ${FONT}`;c.fillStyle=(G.anim>>4)%2&&G.state!=='tutok'?'#ffffff':'#fff3b0';c.fillText(tp,480,153);c.textAlign='left'}
 if(tb){const w=Math.min(900,tb.s.length*17+60),x=480-w/2,y=tp?176:118;c.globalAlpha=Math.min(1,tb.t/12);c.fillStyle='rgba(12,5,9,.85)';c.fillRect(x,y,w,40);c.strokeStyle='#e8c46a';c.lineWidth=3;c.strokeRect(x+1,y+1,w-2,38);
  c.textAlign='center';c.font=`16px ${FONT}`;c.fillStyle='#fff3b0';c.fillText(tb.s,480,y+26);c.textAlign='left';c.globalAlpha=1}
 if(G.en&&G.en.sleep&&G.state!=='ko'&&G.state!=='tutok'){const C=G.cam,z=C.z;c.font=`${Math.round((16+((G.anim>>4)%3)*4)*UIS)}px ${FONT}`;c.fillStyle='#bba9b0';c.fillText('Zzz',(EX+6-C.x0)*z,(FLOOR-24-((G.anim>>3)%4)-C.y0)*z)}
}
function drawPick(){
 panel(180,130,600,300);c.textAlign='center';c.font=`32px ${FONT}`;c.fillStyle='#fff3b0';c.fillText('強化を1つ選ぶ',480,176);c.font=`16px ${FONT}`;c.fillStyle='#bba9b0';c.fillText('この周のあいだ有効',480,200);c.textAlign='left';
 G.opts.forEach((u,i)=>{const y=216+i*68,on=i===G.psel;c.fillStyle=on?'#4a2a3a':'#221520';c.fillRect(204,y,552,58);if(on){c.strokeStyle='#e8c46a';c.lineWidth=4;c.strokeRect(206,y+2,548,54)}
  c.font=`32px ${FONT}`;c.fillStyle=on?'#fff3b0':'#efe6e8';c.fillText((on?'▶ ':'　')+u.name,220,y+38);c.font=`16px ${FONT}`;c.fillStyle='#bba9b0';c.fillText(u.desc,500,y+36)});
}
function drawResult(){
 panel(140,60,680,430);c.textAlign='center';c.font=`32px ${FONT}`;
 c.fillStyle=G.won?'#fff3b0':'#ff9a9a';c.fillText(G.won?'くらやみの竜をたおした！':'力尽きた……',480,116);
 c.font=`16px ${FONT}`;c.fillStyle='#efe6e8';c.fillText(`第${G.bi+1}戦まで到達　この周で魂 +${G.soulRun}　（残り 魂 ${META.soul}）`,480,152);
 let y=200;
 G.learnedList.forEach((x,i)=>{if(G.t<27+i*23)return;c.font=`32px ${FONT}`;c.fillStyle='#fff3b0';c.fillText(`${qn(x.name)}を覚えた！`,480,y);c.font=`16px ${FONT}`;c.fillStyle='#bba9b0';c.fillText(x.desc,480,y+24);y+=62});
 const n=nextSys();c.font=`16px ${FONT}`;c.fillStyle='#c9a8ff';
 const ny=Math.max(y+6,280);c.fillText(n?`次の技：${qn(n.name)}まで 魂 あと${n.cost-META.soul}`:'技はすべて覚えた',480,ny);
 if(G.t>30){c.fillStyle='#e8c46a';c.fillText('▶ A で次の周へ',480,ny+40)}c.textAlign='left';
}
const BX=180,BW=600,BY=476;
const bspan=()=>Math.max(P.guardF,justF())+16,cspan=()=>P.cueF+4;
const bfx=(r,sp)=>Math.round((BX+BW*(1-r/sp))/4)*4;
function zoneLabel(t,x0,x1){c.textAlign='center';c.font=`${Math.round(16*Math.min(UIS,1.4))}px ${FONT}`;c.lineWidth=5;c.strokeStyle='#120509';c.strokeText(t,(x0+x1)/2,BY+40);c.fillStyle='#efe6e8';c.fillText(t,(x0+x1)/2,BY+40);c.textAlign='left'}
function marker(x){c.fillStyle='#120509';c.fillRect(x-6,BY-14,12,44);c.fillStyle='#ffffff';c.fillRect(x-3,BY-11,6,38)}
function bigZone(x0,x1,col){c.fillStyle='#ffffff';c.fillRect(x0-4,BY-8,x1-x0+8,32);c.fillStyle='#120509';c.fillRect(x0-1,BY-5,x1-x0+2,26);c.fillStyle=col;c.fillRect(x0,BY-4,x1-x0,24)}
function drawChaseBar(){
 const a=G.act,sp=cspan(),fx=r=>bfx(r,sp),tut=G.mode==='tut',ch=barMode()==='chase';
 c.fillStyle='rgba(12,5,9,.85)';c.fillRect(BX-12,BY-32,BW+24,tut?84:60);
 c.fillStyle='#3a3238';c.fillRect(BX,BY,BW,16);
 c.fillStyle='#b8923a';c.fillRect(fx(P.chaseF),BY+4,fx(-P.lateF)-fx(P.chaseF),8);
 if(!ch)bigZone(fx(P.critF),fx(-P.lateF),'#fff3b0');
 const r=a.I-a.t;if(r<=sp&&r>=-2)marker(fx(r));
 c.font=`16px ${FONT}`;c.fillStyle='#efe6e8';
 if(tut){c.fillText('剣が当たるまで',BX,BY-12);zoneLabel('追撃',fx(P.chaseF),ch?fx(-P.lateF):fx(P.critF));if(!ch)zoneLabel('重い一撃',fx(P.critF)-24,fx(-P.lateF)+24)}
 else c.fillText(`着弾まで ${Math.max(0,r)}F　はやい｜追撃｜重い一撃`,BX,BY-12);
}
function drawBar(){
 if(G.mode==='tut'&&(G.tut.watch||G.tut.after))return;
 const s=G.strikes.find(s=>!s.done);if(!s)return;
 const sp=bspan(),fx=r=>bfx(r,sp),bm=barMode(),tut=G.mode==='tut';if(bm==='none')return;
 c.fillStyle='rgba(12,5,9,.85)';c.fillRect(BX-12,BY-32,BW+24,tut?84:60);
 c.fillStyle='#3a3238';c.fillRect(BX,BY,BW,16);
 c.fillStyle='#2f5f9e';c.fillRect(fx(P.guardF),BY+4,fx(0)-fx(P.guardF),8);
 if(bm==='full'){c.fillStyle='#3e9e6a';c.fillRect(fx(justF()),BY+1,fx(0)-fx(justF()),14);for(let xx=fx(justF())+2;xx<fx(effParry());xx+=8){c.fillStyle='#9dffc4';c.fillRect(xx,BY+6,4,4)}}
 if(bm!=='guard')bigZone(fx(effParry()),fx(0),'#7fe3ff');
 const r=s.impact-G.et;
 if(r<=sp)marker(fx(r));
 if(G.et<G.lock){c.fillStyle='rgba(154,143,150,.5)';c.fillRect(BX,BY,BW,16)}
 c.font=`16px ${FONT}`;c.fillStyle='#efe6e8';
 if(tut){c.fillText('攻撃が当たるまで',BX,BY-12);
  const gEnd=bm==='guard'?fx(0):bm==='parry'?fx(effParry()):fx(justF());zoneLabel('ガード',fx(P.guardF),gEnd);
  if(bm==='full')zoneLabel('ジャスト',fx(justF())-8,fx(effParry())+8);
  if(bm!=='guard')zoneLabel('パリィ',fx(effParry()),fx(0)+20)}
 else c.fillText(`着弾まで ${Math.max(0,r)}F　早押し｜ガード｜ジャスト｜パリィ`,BX,BY-12);
}
function drawIai(){const I=G.iai;if(!I)return;const t=I.t++;if(t>34){G.iai=null;return}
 const y=Math.round(I.y),grow=Math.min(1,t/3),fade=t<16?1:Math.max(0,1-(t-16)/18),x0=Math.round(LW/2-LW*.6*grow),x1=Math.round(LW/2+LW*.6*grow);
 if(fade<=0)return;l.globalAlpha=fade;l.fillStyle='#7fe3ff';l.fillRect(x0,y-2,x1-x0,5);l.fillStyle='#ffffff';l.fillRect(x0,y-1,x1-x0,t<8?3:2);
 if(t<10){l.fillStyle='#ffffff';for(let i=0;i<5;i++){const xx=Math.round(HX+14+(EX-HX-20)*i/4);l.fillRect(xx,y-6+(i%2)*2,1,12-(i%2)*4)}}
 l.globalAlpha=1}
function draw(){
 if(G.mode==='title'){drawTitle();syncButtons();syncUI();return}
 drawBG();
 if(G.mode==='tut'&&TUT[G.tut.i].key==='pro'){l.fillStyle='rgba(70,0,18,.38)';l.fillRect(0,0,LW,LH)}
 if(G.act&&G.act.n===2&&G.act.lv>=3&&G.act.t<magT(3)+16){l.fillStyle='rgba(6,3,18,.55)';l.fillRect(0,0,LW,LH)}
 if(G.state==='ko'&&G.stop>0){l.fillStyle='rgba(8,2,6,.6)';l.fillRect(0,0,LW,LH)}
 const IA=(G.iai||G.xs)&&G.stop>0&&G.state!=='ko'&&!G.uk;if(IA){l.fillStyle='rgba(4,2,12,.7)';l.fillRect(0,0,LW,LH)}
 if(G.uk){const t=G.uk.t;l.fillStyle=`rgba(3,1,8,${t<UK.CUT?.86:t<UK.HIT?.72:t<UK.END-6?.5:.25})`;l.fillRect(0,0,LW,LH)}
 drawHole();drawEnemy();drawLordKo();drawSlamShadow();drawHero();drawFX();drawIai();drawUK();drawXSlash();drawWhis();drawRally();drawUKV();
 if(G.state==='enter'&&G.enter&&G.enter.t<70){l.fillStyle=`rgba(0,0,0,${Math.max(0,.92-G.enter.t/70*.92).toFixed(3)})`;l.fillRect(0,0,LW,LH)}
 const KC=G.state==='ko'&&G.t<=koZoomEnd()?G.ko.cam:IA?{z:S*1.4,fx:(HX+EX)/2,fy:FLOOR-30}:null,z=KC?KC.z:S,w=960/z,h=540/z;
 const x0=KC?Math.max(0,Math.min(LW-w,Math.round(KC.fx-w/2))):0,y0=KC?Math.max(0,Math.min(LH-h,Math.round(KC.fy-h/2))):0;
 const cz=z===S?{x0:0,y0:0,z}:{x0,y0,z};G.cam=cz;
 const q=v=>Math.round(v/z)*z,sx=q((Math.random()*2-1)*G.shk),sy=q((Math.random()*2-1)*G.shk*.6);
 c.imageSmoothingEnabled=false;c.fillStyle='#000';c.fillRect(0,0,960,540);
 c.drawImage(L,cz.x0,cz.y0,w,h,sx,sy,960,540);
 drawTexts();drawHUD();
 if(G.fl.length&&CFG.flash>0){c.globalAlpha=(RM?.25:.55)*CFG.flash/100;c.fillStyle=G.fl[0];c.fillRect(0,0,960,540);c.globalAlpha=1}
 if(G.state==='blown'&&G.t>78){c.globalAlpha=Math.min(1,(G.t-78)/34);c.fillStyle='#000';c.fillRect(0,0,960,540);c.globalAlpha=1}
 if(G.fadeIn>0){G.fadeIn--;c.globalAlpha=G.fadeIn/40;c.fillStyle='#000';c.fillRect(0,0,960,540);c.globalAlpha=1}
 if(G.banner&&++G.banner.t>150)G.banner=null;
 if(G.banner){const a=Math.min(1,G.banner.t/15,(150-G.banner.t)/25);c.globalAlpha=Math.max(0,a);c.textAlign='center';c.font=`${Math.round(32*Math.min(UIS,1.6))}px ${FONT}`;c.lineWidth=8;c.strokeStyle='#120509';c.strokeText(G.banner.s,480,230);c.fillStyle='#fff3b0';c.fillText(G.banner.s,480,230);c.globalAlpha=1;c.textAlign='left'}
 syncButtons();syncUI();
}
let lastKey='';
function syncButtons(){
 const h=G.hero,st=MENU?'menu':G.state,key=st+h.mk+h.pot+(h.psn||0)+(G.en&&G.en.stance)+(G.en&&G.en.guardUp)+(G.en&&G.en.swarm?aliveN():0)+'d'+(G.floorD||0)+G.sel+(G.psel||0)+META.lv+META.soul+G.mode+(G.tut?G.tut.i:'')+(G.tsel||0);if(key===lastKey)return;lastKey=key;
 $('skipTut').style.display=G.mode==='tut'?'':'none';$('menuBtn').style.display=G.mode==='title'?'none':'';
 if(st==='pick'){[1,2,3].forEach(n=>{const b=$('c'+n),u=G.opts[n-1];b.disabled=!u;b.textContent=u?u.name:'';b.classList.toggle('on',G.psel===n-1)})}
 else{$('c1').textContent=CMDN[1];$('c3').textContent=CMDN[3];
 for(const n of [1,2,3]){const b=$('c'+n);b.disabled=st!=='cmd'||!usable(n);b.classList.toggle('on',st==='cmd'&&G.sel===n);b.setAttribute('aria-pressed',st==='cmd'&&G.sel===n)}
 $('c2').textContent=cmdName(2);[1,2,3].forEach(n=>{const t=st==='cmd'?cmdTag(n):null;if(t)$('c'+n).textContent+=' '+t.s.split(' ')[0]})}
 if(st==='menu'||st==='title'){[1,2,3].forEach(n=>{$('c'+n).disabled=true;$('c'+n).classList.remove('on')});$('def').textContent='A：決定';return}
 $('def').textContent='A：'+(st==='blown'?'…':st==='cmd'?cmdName(G.sel):st==='hero'?(G.act&&G.act.n===1?'追撃':'…'):st==='tutok'?'次へ':st==='win'?'次へ':st==='pick'?'決定':st==='lose'?(FEAT.unlocks?'結果へ':'再挑戦'):st==='clear'?(FEAT.unlocks?'結果へ':'もう一度'):st==='result'?'次の周へ':st==='enemy'?'まもる':'…');
}

