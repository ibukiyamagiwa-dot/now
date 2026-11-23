/* ===== 起動 ===== */
layout();buildPanel();applyDev();toTitle();
document.addEventListener('pointerdown',ev=>{const b=ev.target.closest&&ev.target.closest('button,.it,.row,[data-dv],select,label,input[type=checkbox],input[type=range]');if(!b||b.matches('.cm,#def'))return;try{ac()}catch(_){}SFX.ui()},true);
let acc=0,last=performance.now();
function loop(now){let dt=Math.min(100,now-last);last=now;if(dbg.slow)dt/=4;dt*=window.VSPD??1;if(G.state==='ko'&&G.stop<=0&&G.t<koSlowLen())dt/=3;if(assistSlow())dt/=P.tutSlow;if(proSlow())dt/=2.5;acc+=dt;let n=0;while(acc>=1000/60&&n<6){acc-=1000/60;if((!MENU||G.mode==='title')&&!G.card){try{tick()}catch(err){loopErr(err)}}n++}try{draw()}catch(err){loopErr(err)}try{bgmTick()}catch(_){}requestAnimationFrame(loop)}
function loopErr(err){if(!window.__lErr){window.__lErr=1;console.error(err);setTimeout(()=>window.__lErr=0,2000)}}
requestAnimationFrame(loop);
