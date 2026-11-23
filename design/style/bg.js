const W=240,Hh=135,FLY=112;
function bgA(B){for(let y=0;y<Hh;y++)for(let x=0;x<W;x++){let c;if(y>=FLY)c=y===FLY?'#6a5a82':'#3e3456';else{const row=Math.floor(y/12),off=row%2?12:0;c=(y%12===0||(x+off)%24===0)?'#4a3e64':'#5a4c76'}B.set(x,y,c,6)}
 for(const tx of[60,170]){for(let i=0;i<8;i++)B.set(tx,40+i,'#3a2a24',6);for(let r=0;r<3;r++)for(let a=-r;a<=r;a++)B.set(tx+a,38-r*2+Math.abs(a),r?'#ffb040':'#fff0a0',6)}}
function bgB(B){for(let y=0;y<Hh;y++)for(let x=0;x<W;x++){let c;if(y>=FLY)c=y===FLY?'#3a3444':((x+(y>FLY+10?6:0))%24===0||y===FLY+10)?'#1a1620':'#221e2a';else{const row=Math.floor(y/7),off=row%2?7:0;c=(y%7===0||(x+off)%14===0)?'#1c1824':((x*7+y*3)%11===0?'#2c2636':'#26212e')}B.set(x,y,c,6)}
 for(const tx of[60,170]){for(let i=0;i<7;i++)B.set(tx,44+i,'#3a2a24',6);B.set(tx,42,'#ffd040',6);B.set(tx,41,'#ff8030',6);B.set(tx+1,40,'#ffb040',6);for(let r=3;r<18;r++)for(let a=0;a<36;a++){const x=Math.round(tx+Math.cos(a/36*6.28)*r),y=Math.round(42+Math.sin(a/36*6.28)*r);if(B.tag(x,y)===6&&(x+y)%(r>11?4:3)===0)B.set(x,y,mx(B.get(x,y),'#ff9040',.14),6)}}}
function bgC(B){for(let y=0;y<Hh;y++)for(let x=0;x<W;x++){let c;const n=((x*13+y*7)^(x*y))%17;if(y>=FLY){c=y===FLY?'#3a343c':n<3?'#1a171c':n<9?'#211d24':'#26222a'}else{const row=Math.floor(y/9),off=(row*5)%17,bx=(x+off)%17;const edge=y%9===0||bx===0;const dark=y/FLY;c=edge?'#141216':n<2?'#2c2a24':n<5?mx('#2a2730','#121014',dark*.6):mx('#24212a','#100e12',dark*.6);if(y>80&&n===4)c='#26301e'}B.set(x,y,c,6)}
 for(const tx of[60,170]){for(let i=0;i<7;i++)B.set(tx,44+i,'#2a1e1a',6);B.set(tx,42,'#ffe080',6);B.set(tx,41,'#ff9030',6);B.set(tx+1,40,'#ffb040',6);for(let r=2;r<26;r++)for(let a=0;a<60;a++){const x=Math.round(tx+Math.cos(a/60*6.28)*r),y=Math.round(42+Math.sin(a/60*6.28)*r);if(B.tag(x,y)===6&&(D4[y&3][x&3]>r*.6))B.set(x,y,mx(B.get(x,y),'#ff9040',.16),6)}}}
const BG={A:bgA,B:bgB,C:bgC};
function scene(st){const B=new Cv(W,Hh);BG[st](B);
 const Hc=new Cv(W,Hh);human(Hc,W-34,FLY,st,HERO);Hc.outline();B.blit(Hc,true);
 const E=new Cv(W,Hh);slime(E,88,FLY,st);human(E,142,FLY,st,GUARD);human(E,200,FLY,st,LORD,1.35);E.outline();B.blit(E,false);return B}
