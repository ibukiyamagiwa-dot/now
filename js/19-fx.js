/* ===== 演出の部品 ===== */
function shake(a){G.shk=Math.max(G.shk,a*(RM?.3:1)*CFG.shake/100)}
function flash(cols){G.fl=cols.slice()}
function text(x,y,s,col,big,life){G.txt.push({x,y,s,col,t:0,big:!!big,l:life})}
function burst(x,y,col,n,sp,sz){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=sp*(.4+Math.random());G.pts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-.3,t:0,life:16+Math.random()*14,col,sz:Math.max(1,Math.round(sz*(.6+Math.random()*.8)))})}}
function pose(k,t){G.hpose={k,t}}

