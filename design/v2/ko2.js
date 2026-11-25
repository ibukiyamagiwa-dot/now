/* ===== 中ボスとモブの撃破：共通の芯＋短い固有の後味（DECISIONS.md「撃破の手応え」） =====
   芯は全員同じ：とどめのあと、閃光（白に黒のふち→黒紫の暗い衝撃の輪）、その敵の材料のかけら、残煙、画面の揺れ。数値はイノシシと同じ（mobs.js の boarBurst）。
   そのあと、その敵だけの後味（崩れ方）を短く見せる。長さはイノシシと同じ：モブ 96F（約1.5秒）、中ボス 110F（約1.8秒）。
   根拠：2023-01-02「閃光、爆発、残煙」（閃光→爆炎→煙、短いと手応えがない、画面振動）、2023-02-11「遅さは罪」 */
const KOMAT={/* かけらの色：[かけら1, かけら2, ふち, 床に落ちた色]、煙：[煙1, 煙2] */
 sh:{n:'影のしぶき',frag:['#0e0a14','#1c1626','#3a3048','#120e18'],smoke:['#1c1626','#2e2638']},
 sm:{n:'浸食の黒い粒',frag:['#07050a','#16121c','#3a2e4a','#0e0a12'],smoke:['#120e16','#241c2c']},
 im:{n:'石と土ぼこり',frag:['#5a5048','#3e3832','#8a7e70','#4a423a'],smoke:['#4a4038','#5e5248']},
 dl:{n:'木くずと歯車と真鍮の歯',frag:['#6a4a2e','#4a3220','#806428','#3a2818'],smoke:['#5a4630','#6e5a40']}};
function koBurst(B,c,d,n,k,mid,m){/* boarBurst と同じ芯。かけらと煙の色だけ材料にする */
 if(d>=-1&&d<6){const r=(d<0?15:21+d*2.6)*k;for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++){const q=Math.hypot(x,y);if(q>r)continue;const ring=q>r-2.2,hole=d>=2&&q<r-2.2-(d-1)*5;if(hole)continue;B.set(c[0]+x,c[1]+y*.75,d<=1?(ring?((x+y)&1?'#000000':'#ffffff'):'#ffffff'):ring?((x+y)&1?'#000000':'#3e2e54'):d<3?'#d8d0e0':((x+y)&1?'#1d1728':'#2c2238'),4)}}
 for(let i=0;i<n;i++){const a=-Math.PI*(.08+.84*hsh(i,1)),v=(1.4+hsh(i,2)*2.6)*k,s=hsh(i,3)>.45?3:2,tl=d-1;if(tl<0)continue;let x=c[0]+Math.cos(a)*v*tl,y=c[1]+Math.sin(a)*v*tl+.11*tl*tl;const land=y>=FL;if(land){y=FL;x=c[0]+Math.cos(a)*v*Math.min(tl,(Math.sqrt(Math.max(0,(Math.sin(a)*v)**2+.44*(FL-c[1])))-Math.sin(a)*v)/.22)}
  const life=34+hsh(i,4)*14;if(d<1||tl>life)continue;const fade=land?Math.max(0,1-(tl-life*.55)/(life*.45)):1;if(fade<=0||(land&&hsh(i,tl)>fade))continue;
  /* からくりの歯車：かけらの3つに1つは、歯のある真鍮の輪 */if(m===KOMAT.dl&&i%3===0&&!land){for(const[dx,dy]of[[0,-1],[1,0],[0,1],[-1,0],[-1,-1],[1,1]])B.set(x+dx+1,y+dy-1,dx===0&&dy===0?'#2a1e10':m.frag[2],4);continue}
  for(let yy=0;yy<s;yy++)for(let xx=0;xx<s+(land?1:0);xx++)B.set(x+xx,y-yy,(yy===s-1||xx===0)&&!land?m.frag[2]:land?m.frag[3]:(i+xx)%2?m.frag[0]:m.frag[1],4)}
 if(d>=4&&d<44)for(let i=0;i<(mid?7:5);i++){const u=(d-4)/40,x=c[0]+(hsh(i,5)-.5)*16*k+Math.sin(d*.15+i)*2,y=c[1]-u*18*k-hsh(i,6)*4,r=(1.5+u*3)*k;for(let yy=-r;yy<=r;yy++)for(let xx=-r;xx<=r;xx++){if(xx*xx+yy*yy>r*r)continue;if(hsh(Math.round(x+xx),Math.round(y+yy)+d)<.5-u*.45)B.set(x+xx,y+yy,(xx+yy)&1?m.smoke[0]:m.smoke[1],5)}}}
/* 今ある撃破のモーションを、時間を縮めて（長さ len2 へ）、閃光（flashAt）とかけらを足す */
function koCore(id,mat,len2,flashAt,cy,n,k,mid){const M=MV.find(m=>m.id===id);if(!M||M.koCore)return;const s=M.len/len2,pp=M.pp,fx=M.fx;M.koCore=1;
 M.keys=M.keys.map(q=>({t:Math.round(q.t/s),p:q.p,e:q.e}));for(let i=1;i<M.keys.length;i++)if(M.keys[i].t<=M.keys[i-1].t)M.keys[i].t=M.keys[i-1].t+1;
 M.len=len2;M.gifEnd=len2-1;M.pp=pp?(P,t)=>pp(P,Math.round(t*s)):null;
 M.fx=(B,J,t,S,MM)=>{if(fx)fx(B,J,Math.round(t*s),S,MM);koBurst(B,[EXX+(M.ox||0),FL-cy],t-flashAt,n,k,mid,KOMAT[mat])};
 M.cap=M.cap+`最後の一撃の${flashAt}F後に、閃光と、${KOMAT[mat].n}のかけらと、残煙（全員共通の撃破の芯）。`;}
for(const[pre,mat,mid]of[['sh','sh',0],['shM','sh',1],['sm','sm',0],['smM','sm',1],['im','im',0],['imM','im',1],['dl','dl',0],['dlM','dl',1]]){
 const k=mid?1.25:1,F={sh:[10,16],sm:[14,16],im:[10,12],dl:[8,18]}[mat];koCore(pre+'_down',mat,mid?110:96,F[0],F[1]*k,mid?28:18,k,mid)}
