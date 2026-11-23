/* 作風の書き比べ：同じ4体（主人公・スライム・門番・門のぬし）を A/B/C で描く */
const O='#120910';
function hx(h){const n=parseInt(h.slice(1),16);return[n>>16&255,n>>8&255,n&255]}
function mx(a,b,t){const A=hx(a),B=hx(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')}
class Cv{constructor(w,h){this.w=w;this.h=h;this.c=new Array(w*h).fill(0);this.t=new Uint8Array(w*h)}
 set(x,y,c,t=1){x=Math.round(x);y=Math.round(y);if(x<0||y<0||x>=this.w||y>=this.h||!c)return;this.c[y*this.w+x]=c;this.t[y*this.w+x]=t}
 get(x,y){return(x<0||y<0||x>=this.w||y>=this.h)?0:this.c[y*this.w+x]} tag(x,y){return(x<0||y<0||x>=this.w||y>=this.h)?0:this.t[y*this.w+x]}
 outline(){const a=[];for(let y=0;y<this.h;y++)for(let x=0;x<this.w;x++){if(this.t[y*this.w+x]===1)continue;if(this.tag(x-1,y)===1||this.tag(x+1,y)===1||this.tag(x,y-1)===1||this.tag(x,y+1)===1)a.push([x,y])}for(const[x,y]of a)this.set(x,y,O,3)}
 blit(S,flip,dx=0){for(let y=0;y<S.h;y++)for(let x=0;x<S.w;x++){const i=y*S.w+x;if(S.c[i])this.set((flip?S.w-1-x:x)+dx,y,S.c[i],S.t[i])}}
 put(ctx){const im=ctx.createImageData(this.w,this.h);for(let i=0;i<this.c.length;i++){if(!this.c[i])continue;const[r,g,b]=hx(this.c[i]);im.data.set([r,g,b,255],i*4)}ctx.putImageData(im,0,0)}}
const K=(x,y)=>(y+512)*2048+x+512, KX=k=>k%2048-512, KY=k=>Math.floor(k/2048)-512;
function mPoly(pts){const m=new Set();let y0=1e9,y1=-1e9;for(const p of pts){y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1])}for(let y=Math.floor(y0);y<=Math.ceil(y1);y++){const yy=y+.5,xs=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];if((a[1]<=yy&&b[1]>yy)||(b[1]<=yy&&a[1]>yy))xs.push(a[0]+(yy-a[1])/(b[1]-a[1])*(b[0]-a[0]))}xs.sort((a,b)=>a-b);for(let k=0;k+1<xs.length;k+=2)for(let x=Math.ceil(xs[k]-.5);x<=Math.floor(xs[k+1]-.5);x++)m.add(K(x,y))}return m}
function mEll(cx,cy,rx,ry){const m=new Set();for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++){const dx=(x+.5-cx)/rx,dy=(y+.5-cy)/ry;if(dx*dx+dy*dy<=1)m.add(K(x,y))}return m}
function mThick(a,b,r){const m=new Set(),n=Math.max(2,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])));for(let i=0;i<=n;i++){const t=i/n,cx=a[0]+(b[0]-a[0])*t,cy=a[1]+(b[1]-a[1])*t;for(let y=Math.floor(cy-r);y<=Math.ceil(cy+r);y++)for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++){const dx=x+.5-cx,dy=y+.5-cy;if(dx*dx+dy*dy<=r*r)m.add(K(x,y))}}return m}
function U(...ms){const m=new Set();for(const s of ms)for(const k of s)m.add(k);return m}
const D4=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];
/* 塗り：A＝ベタ一色、B＝丸みの3段＋縁の光、C＝4段をディザでつなぐ。重なった縁は暗い線で区切る（中の輪郭） */
function paint(B,m,r,st,tag=1,noLine){let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const k of m){const x=KX(k),y=KY(k);x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}
 const rows={};for(const k of m){const x=KX(k),y=KY(k);(rows[y]=rows[y]||[1e9,-1e9]);rows[y][0]=Math.min(rows[y][0],x);rows[y][1]=Math.max(rows[y][1],x)}
 const line=st==='A'?O:mx(r[3],O,.55);
 for(const k of m){const x=KX(k),y=KY(k),[a,b]=rows[y],w=Math.max(1,b-a),u=(x-a)/w,v=(y-y0)/Math.max(1,y1-y0);
  let c;if(st==='A')c=r[1];
  else if(st==='B'){const s=u*.75+v*.35;c=s<.18?r[0]:s<.62?r[1]:s<.86?r[2]:r[3];if(!m.has(k-1)&&!m.has(k-2048)&&r[0])c=r[0]}
  else{const s=u*.7+v*.45,f=s*3.2,i=Math.floor(f),fr=f-i;c=r[Math.min(3,i+(fr*16>D4[y&3][x&3]?1:0))];if(!m.has(k-2048))c=mx(r[0],'#ffffff',.15)}
  const nb=!noLine&&[k-1,k+1,k-2048,k+2048].some(n=>!m.has(n)&&B.tag(KX(n),KY(n))===1);B.set(x,y,nb?line:c,tag)}}
const P={A:{},B:{},C:{}};
