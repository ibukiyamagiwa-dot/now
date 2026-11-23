/* ===== いまだ！ デザイン資料集：ドット絵の骨組み =====
   すべての門の番人を同じ骨組みで描く。赤い騎士と赤い門のぬしは同じ体に「くらやみ」を足しただけ、ということが絵の作りからも保証される。 */
const OUT='#120910';
const RGB={};function rgb(h){if(RGB[h])return RGB[h];const n=parseInt(h.slice(1),16);return RGB[h]=[n>>16&255,n>>8&255,n&255]}
function mix(a,b,t){const A=rgb(a),B=rgb(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')}
class Buf{
 constructor(w,h){this.w=w;this.h=h;this.c=new Array(w*h).fill(0);this.t=new Uint8Array(w*h)}
 set(x,y,c,tag=1){x=Math.round(x);y=Math.round(y);if(x<0||y<0||x>=this.w||y>=this.h||!c)return;const i=y*this.w+x;this.c[i]=c;this.t[i]=tag}
 get(x,y){if(x<0||y<0||x>=this.w||y>=this.h)return 0;return this.c[y*this.w+x]}
 tag(x,y){if(x<0||y<0||x>=this.w||y>=this.h)return 0;return this.t[y*this.w+x]}
 /* 多角形：画素の中心で判定するので、にじまない */
 mask(pts){const m=new Set();let y0=Infinity,y1=-Infinity;for(const p of pts){y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1])}
  for(let y=Math.floor(y0);y<=Math.ceil(y1);y++){const yy=y+.5,xs=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];if((a[1]<=yy&&b[1]>yy)||(b[1]<=yy&&a[1]>yy))xs.push(a[0]+(yy-a[1])/(b[1]-a[1])*(b[0]-a[0]))}
   xs.sort((a,b)=>a-b);for(let k=0;k+1<xs.length;k+=2)for(let x=Math.ceil(xs[k]-.5);x<=Math.floor(xs[k+1]-.5);x++)m.add((y+1024)*4096+x+1024)}return m}
 /* 陰影つき：左上が明るく、右下が暗い */
 shade(m,base,hi,lo,tag=1){for(const k of m){const x=(k%4096)-1024,y=Math.floor(k/4096)-1024;const L=!m.has(k-1),T=!m.has(k-4096),R=!m.has(k+1),D=!m.has(k+4096);
  this.set(x,y,(R||D)&&lo?lo:(L||T)&&hi?hi:base,tag)}}
 poly(pts,base,hi,lo,tag){this.shade(this.mask(pts),base,hi,lo,tag)}
 disc(cx,cy,r,base,hi,lo,tag){const m=new Set();for(let y=Math.floor(cy-r);y<=Math.ceil(cy+r);y++)for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++){const dx=x+.5-cx,dy=y+.5-cy;if(dx*dx+dy*dy<=r*r)m.add((y+1024)*4096+x+1024)}this.shade(m,base,hi,lo,tag)}
 line(x0,y0,x1,y1,c,tag=1){x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;for(;;){this.set(x0,y0,c,tag);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx}if(e2<=dx){e+=dx;y0+=sy}}}
 thick(a,b,r,base,hi,lo,tag){const n=Math.max(2,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])));const m=new Set();for(let i=0;i<=n;i++){const t=i/n,cx=a[0]+(b[0]-a[0])*t,cy=a[1]+(b[1]-a[1])*t;for(let y=Math.floor(cy-r);y<=Math.ceil(cy+r);y++)for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++){const dx=x+.5-cx,dy=y+.5-cy;if(dx*dx+dy*dy<=r*r)m.add((y+1024)*4096+x+1024)}}this.shade(m,base,hi,lo,tag)}
 /* 触手：二次ベジェの管。太さは根元から先へ細る */
 tube(p0,p1,p2,r0,r1,base,hi,lo,tag=1){const m=new Set();const N=60;for(let i=0;i<=N;i++){const t=i/N,u=1-t,cx=u*u*p0[0]+2*u*t*p1[0]+t*t*p2[0],cy=u*u*p0[1]+2*u*t*p1[1]+t*t*p2[1],r=r0+(r1-r0)*t;for(let y=Math.floor(cy-r);y<=Math.ceil(cy+r);y++)for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++){const dx=x+.5-cx,dy=y+.5-cy;if(dx*dx+dy*dy<=r*r)m.add((y+1024)*4096+x+1024)}}this.shade(m,base,hi,lo,tag)}
 /* 輪郭線：体のまわりの空いた画素を黒で縁どる */
 outline(){const add=[];for(let y=0;y<this.h;y++)for(let x=0;x<this.w;x++){if(this.t[y*this.w+x])continue;if(this.tag(x-1,y)===1||this.tag(x+1,y)===1||this.tag(x,y-1)===1||this.tag(x,y+1)===1)add.push([x,y])}for(const[x,y]of add)this.set(x,y,OUT,3)}
 toCanvas(ctx,bg){const im=ctx.createImageData(this.w,this.h);for(let i=0;i<this.c.length;i++){const c=this.c[i]||bg&&bg[i];if(!c)continue;const[r,g,b]=rgb(c);im.data[i*4]=r;im.data[i*4+1]=g;im.data[i*4+2]=b;im.data[i*4+3]=255}ctx.putImageData(im,0,0)}
}
const rot=(p,a)=>[p[0]*Math.cos(a)-p[1]*Math.sin(a),p[0]*Math.sin(a)+p[1]*Math.cos(a)];
const add=(a,b)=>[a[0]+b[0],a[1]+b[1]];
const dir=(a,L)=>[Math.cos(a)*L,Math.sin(a)*L];
const lerp=(a,b,t)=>a+(b-a)*t;
function ik(H,F,a,b,bend){const dx=F[0]-H[0],dy=F[1]-H[1];let d=Math.hypot(dx,dy);d=Math.min(d,a+b-.01);const A=Math.atan2(dy,dx),c=Math.acos(Math.max(-1,Math.min(1,(a*a+d*d-b*b)/(2*a*d))));return add(H,dir(A+bend*c,a))}
Buf.prototype.blit=function(S,flip,dx=0,dy=0){for(let y=0;y<S.h;y++)for(let x=0;x<S.w;x++){const i=y*S.w+x;if(!S.c[i])continue;const tx=flip?S.w-1-x:x;this.set(tx+dx,y+dy,S.c[i],S.t[i])}};
const INK={col:'#22142e',hi:'#4e2c70',lo:'#0c0614',eye:'#c070ff',eye2:'#ff3050'};
function tentacle(B,p0,p1,p2,r0,r1,eye){B.tube(p0,p1,p2,r0,r1,INK.col,INK.hi,INK.lo,1);if(eye){const t=.35,u=1-t;B.set(u*u*p0[0]+2*u*t*p1[0]+t*t*p2[0],u*u*p0[1]+2*u*t*p1[1]+t*t*p2[1],eye===true?INK.eye:eye,2)}}
