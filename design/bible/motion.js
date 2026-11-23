/* ===== モーション：キーの並び。数値は補間、fxは効果 ===== */
const ez={lin:t=>t,io:t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,out:t=>1-Math.pow(1-t,3),in:t=>t*t*t,snap:t=>t<1?0:1};
function poseAt(M,t,base){base=base||PDEF;const K=M.keys;let a=K[0],b=K[0];for(let i=0;i<K.length;i++){if(K[i].t<=t)a=K[i];if(K[i].t>=t){b=K[i];break}if(i===K.length-1)b=K[i]}
 if(a===b||b.t===a.t)return Object.assign({},a.p);const u=(ez[b.e||'io'])((t-a.t)/(b.t-a.t)),o={};const ks=new Set([...Object.keys(a.p),...Object.keys(b.p)]);
 for(const k of ks){const A=a.p[k]!==undefined?a.p[k]:base[k],Bv=b.p[k]!==undefined?b.p[k]:base[k];o[k]=(typeof A==='number'&&typeof Bv==='number')?lerp(A,Bv,u):(u<.5?A:Bv)}return o}
function poseAt0(M,t,base){if(t<M.keys[0].t)return Object.assign({},M.keys[0].p);if(t>M.keys[M.keys.length-1].t)return Object.assign({},M.keys[M.keys.length-1].p);return poseAt(M,t,base)}
/* 効果：光の意味は本編と同じ。白＝ふつう、赤＝重い、紫の輪＝フェイント、金＝打ち合い */
const FXC={w:['#ffffff','#bfe8ff'],r:['#ff4040','#ffb0a0'],g:['#ffd040','#fff0a0'],p:['#b060ff','#e0c0ff']};
function star(B,x,y,r,col){const[c1,c2]=FXC[col];for(let i=-r;i<=r;i++){B.set(x+i,y,Math.abs(i)<r/2?c2:c1,4);B.set(x,y+i,Math.abs(i)<r/2?c2:c1,4)}const d=Math.round(r*.45);for(let i=-d;i<=d;i++){B.set(x+i,y+i,c1,4);B.set(x+i,y-i,c1,4)}B.set(x,y,'#ffffff',4)}
function ring(B,x,y,r,col){const c=FXC[col][0];for(let a=0;a<64;a++){const t=a/64*Math.PI*2;B.set(x+Math.cos(t)*r,y+Math.sin(t)*r,c,4)}}
function arc(B,cx,cy,r,a0,a1,col,w=2){const[c1,c2]=FXC[col]||[col,col];for(let i=0;i<=40;i++){const t=lerp(a0,a1,i/40);for(let j=0;j<w;j++)B.set(cx+Math.cos(t)*(r-j),cy+Math.sin(t)*(r-j),j?c1:c2,4)}}
function glow(B,x,y,r,col){const c=FXC[col]?FXC[col][0]:col;for(let yy=-r;yy<=r;yy++)for(let xx=-r;xx<=r;xx++){if(xx*xx+yy*yy<=r*r&&B.get(x+xx,y+yy)===0&&((xx+yy)&1))B.set(x+xx,y+yy,c,5)}}
