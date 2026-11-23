/* ===== BGM：曲ごとに作曲した小さな音楽エンジン =====
   ・場面ごとに別の曲（道中／中ボス／ボス／門のぬし／暗い門のぬし／赤い騎士／赤い門のぬし）
   ・「一周した」と感じにくいように：1曲40〜48小節の長い構成＋周ごとに楽器・伴奏・調を変える＋装飾音をゆらす
   ・旋律は「音階の何番目か」で書く。曲ごとに音階を差し替えると同じ旋律が別の顔になる
     （赤い騎士＝長調の英雄譚 → 赤い門のぬし＝同じ旋律を和声的短音階で。門のぬし → 暗い門のぬし＝フリギア）
   ・道中は打楽器なし（拍で読む敵とぶつけない）。打ち合い・拍で読む攻撃・予兆の音の間は大きく引く */
const mtof=m=>440*Math.pow(2,(m-69)/12);
const SCL={maj:[0,2,4,5,7,9,11],min:[0,2,3,5,7,8,10],hmin:[0,2,3,5,7,8,11],phr:[0,1,3,5,7,8,10]};
function bSemi(tok,S){const m=/^(-?\d+)([#b]*)(?:@(\w+))?$/.exec(tok);const sc=m[3]?((S.rmap&&S.rmap[m[3]])||m[3]):S.scale,T=SCL[sc]||SCL[S.scale];
 const d=+m[1],o=Math.floor(d/7),i=((d%7)+7)%7;let st=T[i]+12*o;for(const c of m[2])st+=c==='#'?1:-1;return st}
function bShift(tok,k){const m=/^(-?\d+)(.*)$/.exec(tok);return(+m[1]+k)+m[2]}
function bChord(tok,S){const m=/^(-?\d+)([#b]*)(@\w+)?(7?)$/.exec(tok),d=+m[1],rest=m[2]+(m[3]||'');const f=k=>bSemi((d+k)+rest,S),r=[f(0),f(2),f(4)];if(m[4])r.push(f(6));return r}
function bMel(str){const ev=[];let t=0;for(const tk of str.split(/[\s|]+/).filter(Boolean)){const[n,l]=tk.split(':');if(n!=='r')ev.push({t,d:+l,n});t+=+l}return{ev,len:t}}
/* ---- 楽器 ---- */
const BI={
 lead:{osc:[{t:'triangle'},{t:'sine',r:2,g:.25}],amp:{a:.02,d:.3,s:.75,r:.25},vib:{r:5,d:7,dl:.25},v:.075},
 flute:{osc:[{t:'sine'},{t:'triangle',r:2,g:.18}],amp:{a:.07,d:.3,s:.8,r:.3},vib:{r:5.5,d:9,dl:.15},breath:.012,v:.075},
 square:{osc:[{t:'square'}],flt:{t:'lowpass',f:1900,q:.8},amp:{a:.01,d:.15,s:.6,r:.12},vib:{r:6,d:6,dl:.2},v:.03},
 brass:{osc:[{t:'sawtooth',dt:-7},{t:'sawtooth',dt:7}],flt:{t:'lowpass',f:650,q:2.2,env:{a:.07,d:.35,amt:2100}},amp:{a:.04,d:.25,s:.85,r:.22},vib:{r:5,d:6,dl:.3},v:.03},
 brassDark:{osc:[{t:'sawtooth',dt:-9},{t:'sawtooth',dt:9}],flt:{t:'lowpass',f:480,q:2,env:{a:.09,d:.4,amt:1200}},amp:{a:.05,d:.3,s:.85,r:.25},vib:{r:4.5,d:6,dl:.35},v:.034},
 brassDist:{osc:[{t:'sawtooth',dt:-16},{t:'sawtooth',dt:13}],dist:18,flt:{t:'lowpass',f:520,q:3,env:{a:.1,d:.5,amt:1300}},amp:{a:.05,d:.3,s:.85,r:.3},vib:{r:3.6,d:14,dl:.25},v:.024},
 organ:{osc:[{t:'sine'},{t:'sine',r:2,g:.55},{t:'sine',r:3,g:.28},{t:'sine',r:4,g:.16}],amp:{a:.06,d:.2,s:.9,r:.35},v:.045},
 bell:{osc:[{t:'sine'},{t:'sine',r:2.76,g:.45},{t:'sine',r:5.4,g:.22}],amp:{a:.004,d:1.4,s:0,r:.9},v:.05},
 str:{osc:[{t:'sawtooth',dt:-9},{t:'sawtooth',dt:9}],flt:{t:'lowpass',f:950,q:.6},amp:{a:.45,d:.4,s:.85,r:.7},v:.011},
 choir:{osc:[{t:'sawtooth',dt:-6},{t:'sawtooth',dt:7},{t:'triangle',r:2,g:.3}],flt:{t:'bandpass',f:820,q:2.4},amp:{a:.6,d:.4,s:.9,r:.8},vib:{r:4.2,d:10,dl:.3},v:.04},
 dark:{osc:[{t:'sawtooth',dt:-15},{t:'sawtooth',dt:15}],flt:{t:'lowpass',f:420,q:1.2},amp:{a:.7,d:.4,s:.9,r:.9},v:.016},
 stac:{osc:[{t:'sawtooth',dt:-6},{t:'sawtooth',dt:6}],flt:{t:'lowpass',f:1100,q:1},amp:{a:.003,d:.11,s:0,r:.05},v:.034},
 pluck:{osc:[{t:'triangle'},{t:'sine',r:2,g:.2}],amp:{a:.003,d:.28,s:0,r:.12},v:.04},
 bass:{osc:[{t:'triangle'},{t:'sine',r:.5,g:.6}],amp:{a:.01,d:.35,s:.7,r:.15},v:.085},
 bassDist:{osc:[{t:'sawtooth'},{t:'sine',r:.5,g:.5}],dist:12,flt:{t:'lowpass',f:380,q:1.4},amp:{a:.01,d:.3,s:.75,r:.15},v:.05}};
function bCurve(k){if(bCurve[k])return bCurve[k];const n=513,c=new Float32Array(n);bCurve[k]=c;for(let i=0;i<n;i++){const x=i*2/(n-1)-1;c[i]=(1+k)*x/(1+k*Math.abs(x))}return c}
function bNoise(a){const k='_nb';if(a[k])return a[k];const b=a.createBuffer(1,a.sampleRate,a.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return a[k]=b}
function bVoice(a,I,m,t,d,vel,dest){if(!I)return;const f=mtof(m),g=a.createGain();g.gain.value=0;const A=I.amp,pk=I.v*(vel||1),end=t+d+A.r*4+.05;let inp=g;
 if(I.flt){const fl=a.createBiquadFilter();fl.type=I.flt.t;fl.frequency.setValueAtTime(I.flt.f,t);fl.Q.value=I.flt.q||.7;if(I.flt.env){const e=I.flt.env;fl.frequency.linearRampToValueAtTime(I.flt.f+e.amt,t+e.a);fl.frequency.setTargetAtTime(I.flt.f+e.amt*.35,t+e.a,e.d)}fl.connect(inp);inp=fl}
 if(I.dist){const ws=a.createWaveShaper();ws.curve=bCurve(I.dist);ws.connect(inp);inp=ws}
 let lg=null;if(I.vib&&d>.3){const lfo=a.createOscillator();lg=a.createGain();lfo.frequency.value=I.vib.r;lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(I.vib.d,t+Math.min(d,I.vib.dl+.25));lfo.connect(lg);lfo.start(t);lfo.stop(end)}
 for(const o of I.osc){const os=a.createOscillator();os.type=o.t;os.frequency.setValueAtTime(f*(o.r||1),t);if(o.dt)os.detune.value=o.dt;if(lg)lg.connect(os.detune);
  let on=os;if(o.g!=null){const og=a.createGain();og.gain.value=o.g;os.connect(og);on=og}on.connect(inp);os.start(t);os.stop(end)}
 if(I.breath){const ns=a.createBufferSource(),nf=a.createBiquadFilter(),ng=a.createGain();ns.buffer=bNoise(a);nf.type='bandpass';nf.frequency.value=f*2;nf.Q.value=2;ng.gain.setValueAtTime(I.breath*(vel||1),t);ng.gain.setTargetAtTime(0,t+.08,.06);ns.connect(nf).connect(ng).connect(dest);ns.start(t);ns.stop(t+.4)}
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(pk,t+A.a);g.gain.setTargetAtTime(pk*A.s,t+A.a,A.d/3+.001);g.gain.setTargetAtTime(0,t+d,A.r/3+.001);g.connect(dest)}
function bTimp(a,t,v,dest){const os=a.createOscillator(),g=a.createGain();os.type='sine';os.frequency.setValueAtTime(96,t);os.frequency.exponentialRampToValueAtTime(52,t+.35);g.gain.setValueAtTime(.16*v,t);g.gain.setTargetAtTime(0,t+.02,.18);os.connect(g).connect(dest);os.start(t);os.stop(t+1.2);
 const ns=a.createBufferSource(),nf=a.createBiquadFilter(),ng=a.createGain();ns.buffer=bNoise(a);nf.type='lowpass';nf.frequency.value=500;ng.gain.setValueAtTime(.06*v,t);ng.gain.setTargetAtTime(0,t,.04);ns.connect(nf).connect(ng).connect(dest);ns.start(t);ns.stop(t+.3)}
function bSnare(a,t,v,dest){const ns=a.createBufferSource(),nf=a.createBiquadFilter(),ng=a.createGain();ns.buffer=bNoise(a);nf.type='bandpass';nf.frequency.value=1900;nf.Q.value=.8;ng.gain.setValueAtTime(.035*v,t);ng.gain.setTargetAtTime(0,t,.045);ns.connect(nf).connect(ng).connect(dest);ns.start(t);ns.stop(t+.3)}
function bCrash(a,t,dest){const ns=a.createBufferSource(),nf=a.createBiquadFilter(),ng=a.createGain();ns.buffer=bNoise(a);ns.loop=true;nf.type='highpass';nf.frequency.value=4200;ng.gain.setValueAtTime(.05,t);ng.gain.setTargetAtTime(0,t+.02,.5);ns.connect(nf).connect(ng).connect(dest);ns.start(t);ns.stop(t+2.6)}
function bWhis(a,t,dest){const ns=a.createBufferSource(),nf=a.createBiquadFilter(),ng=a.createGain();ns.buffer=bNoise(a);ns.loop=true;nf.type='bandpass';nf.Q.value=6;nf.frequency.setValueAtTime(500,t);nf.frequency.linearRampToValueAtTime(1500,t+1.6);ng.gain.setValueAtTime(0,t);ng.gain.linearRampToValueAtTime(.05,t+.7);ng.gain.linearRampToValueAtTime(0,t+1.8);ns.connect(nf).connect(ng).connect(dest);ns.start(t);ns.stop(t+2)}
/* ---- 曲 ---- */
const SONGS={
 /* 道中：二短調の旅の歌。打楽器なし */
 field:{bpm:80,root:62,scale:'min',mel:'lead',pad:'str',bass:'hold',gain:1,
  sec:{A:{ch:'0 0 5 4@h 0 6 5 4@h',mel:'0:4 2:2 3:2 | 4:6 3:2 | 2:4 1:2 0:2 | -1#:6 r:2 | 0:4 2:2 4:2 | 5:6 4:2 | 3:4 2:2 1:2 | 0:8'},
   A2:{ch:'0 0 5 4@h 0 6 5 4@h',mel:'0:4 2:2 3:2 | 4:4 7:4 | 6:3 5:1 4:2 3:2 | 4:6 r:2 | 5:4 4:2 3:2 | 2:4 3:2 4:2 | 3:2 2:2 1:2 -1#:2 | 0:8'},
   B:{ch:'2 6 0 5 2 6 3 4@h',oct:-1,bass:'rf',arp:'broken',mel:'9:2 11:2 13:4 | 12:2 11:2 8:4 | 7:3 9:1 11:4 | 12:6 11:2 | 9:2 11:2 14:4 | 13:4 12:2 11:2 | 10:4 12:2 10:2 | 13#:4 11:4'},
   C:{ch:'5 3 5 3 5 6 4@h 4@h',mi:'bell',oct:1,mel:'5:8 | 3:8 | 4:4 5:4 | 3:8 | 2:6 1:2 | 2:4 4:4 | 1:8 | r:8'},
   A3:{ch:'0 0 5 4@h 0 6 5 4@h',oct:1,mi:'flute',mel:'0:4 2:2 3:2 | 4:6 3:2 | 2:4 1:2 0:2 | -1#:6 r:2 | 0:4 2:2 4:2 | 5:6 4:2 | 3:4 2:2 1:2 | 0:8'},
   B2:{ch:'2 6 0 5 3 4@h 0 0',oct:-1,bass:'rf',arp:'broken',mel:'11:4 9:2 11:2 | 13:4 12:2 11:2 | 11:2 9:2 7:4 | 9:2 8:2 7:4 | 10:3 9:1 10:4 | 8:2 6#:2 4:4 | 7:8 | r:8'}},
  form:['A','A2','B','C','A3','B2'],pv:[{},{mel:'flute',arp:'broken'},{tr:-2,arp:'up8',orn:.3}]},
 /* 中ボス：ホ短調、刻む低音で立ちはだかる */
 mid:{bpm:96,react:1,root:52,scale:'min',mel:'brassDark',pad:'str',bass:'pulse8',gain:1,
  sec:{A:{ch:'0 0 5 6 0 0 3 4@h',mel:'7:2 r:1 7:1 6:2 4:2 | 2:3 3:1 4:4 | 4:2 r:1 4:1 5:2 4:2 | 3:4 1:4 | 7:2 r:1 7:1 9:2 10:2 | 11:6 10:2 | 9:2 7:2 5:2 3:2 | -1#:8'},
   B:{ch:'5 6 0 0 5 6 4@h 4@h',bass:'rf',mel:'7:4 5:4 | 8:4 6:4 | 9:6 7:2 | 4:8 | 7:2 8:2 9:4 | 10:4 8:4 | 8:4 6#:4 | 4:8'},
   A2:{ch:'0 0 5 6 0 0 3 4@h',mi:'organ',arp:'up8',mel:'7:2 r:1 7:1 6:2 4:2 | 2:3 3:1 4:4 | 4:2 r:1 4:1 5:2 4:2 | 3:4 1:4 | 7:2 r:1 7:1 9:2 10:2 | 11:6 10:2 | 9:2 7:2 5:2 3:2 | -1#:8'},
   C:{ch:'3 0 3 0 5 6 4@h 4@h',perc:'timp',mel:'3:2 3:2 5:2 7:2 | 4:4 2:4 | 5:2 5:2 7:2 9:2 | 7:8 | 7:2 9:2 12:4 | 13:4 10:4 | 11:2 10:2 8:2 6#:2 | 8:4 11:4'},
   B2:{ch:'5 6 0 2 5 6 4@h 0',bass:'rf',arp:'broken',mel:'7:4 5:4 | 8:4 6:4 | 9:6 7:2 | 9:2 11:2 13:4 | 12:4 11:4 | 10:4 8:4 | 8:4 6#:4 | 7:8'}},
  form:['A','B','A2','C','B2'],pv:[{},{mel:'organ',arp:'up8'},{tr:-2,arp:'broken',orn:.25}]},
 /* ボス（くらやみの竜・三つ首・門番）：ハ短調の重い行進 */
 boss:{bpm:92,react:1,root:60,scale:'min',mel:'brassDark',pad:'str',bass:'march',perc:'timp',gain:1,
  sec:{A:{ch:'0 5 2 6 0 5 3 4@h',mel:'0:2 4:2 7:4 | 7:2 9:2 8:2 7:2 | 9:6 6:2 | 8:4 6:4 | 7:2 9:2 11:4 | 12:4 11:2 9:2 | 10:4 9:2 8:2 | 8:4 6#:4'},
   B:{ch:'5 6 0 0 5 6 4@h 4@h',mel:'12:6 11:2 | 10:4 8:4 | 9:3 8:1 7:4 | 4:8 | 5:2 7:2 9:4 | 8:2 10:2 13:4 | 11:6 10:2 | 11:4 8:4'},
   A2:{ch:'0 5 2 6 0 5 3 4@h',arp:'broken',mel:'0:2 4:2 7:4 | 7:2 9:2 8:2 7:2 | 9:6 6:2 | 8:4 6:4 | 7:2 9:2 11:4 | 12:4 11:2 9:2 | 10:4 9:2 8:2 | 8:4 6#:4'},
   C:{ch:'3 0 3 0 5 2 4@h 4@h',bass:'hold',perc:'none',mi:'organ',mel:'3:4 5:4 | 4:4 2:4 | 5:4 7:4 | 6:4 4:4 | 5:2 7:2 9:2 7:2 | 6:2 9:2 11:2 9:2 | 8:2 6#:2 4:2 6#:2 | 8:8'},
   D:{ch:'0 0 5 5 6 6 4@h 4@h',perc:'timp2',arp:'up8',mel:'7:2 7:1 7:1 9:2 11:2 | 14:6 11:2 | 12:4 9:4 | 12:2 11:2 9:2 7:2 | 8:4 10:4 | 13:4 10:4 | 11:4 8:4 | 6#:4 4:4'}},
  form:['A','B','A2','C','D'],pv:[{},{harm:1,arp:'broken'},{tr:2,arp:'up8',orn:.2}]},
 /* 門のぬし：イ短調、鐘とオルガンの荘重な門の歌 */
 lord1:{bpm:92,react:1,root:57,scale:'min',mel:'organ',pad:'choir',bass:'gallop',perc:'timp2',arp:'bell1',ost:1,gain:1,
  sec:{I:{ch:'0 0 5 4@h',mi:'bell',perc:'none',ost:0,bass:'hold',mel:'7:4 4:4 | 7:4 9:4 | 8:4 7:4 | 6#:8'},
   A:{ch:'0 3 6 2 5 3 4@h 4@h',mel:'7:6 9:2 | 10:4 9:2 8:2 | 8:6 6:2 | 9:8 | 7:4 9:4 | 8:4 10:4 | 6#:6 8:2 | 4:8'},
   B:{ch:'5 6 2 0 3 5 4@h 4@h',mel:'12:6 11:2 | 13:4 10:4 | 11:4 9:4 | 7:8 | 10:4 12:4 | 14:6 12:2 | 13#:4 11:4 | 8:8'},
   A2:{ch:'0 3 6 2 5 3 4@h 4@h',perc:'timp2',arp:'broken',mel:'7:6 9:2 | 10:4 9:2 8:2 | 8:6 6:2 | 9:8 | 7:4 9:4 | 8:4 10:4 | 6#:6 8:2 | 4:8'},
   C:{ch:'3 0 3 0 5 6 4@h 0',perc:'timp2',mel:'10:8 | 9:4 7:4 | 12:8 | 11:4 9:4 | 12:4 14:4 | 13:4 15:4 | 13#:8 | 14:8'}},
  form:['I','A','B','A2','C'],pv:[{},{mel:'brassDark',oct:-1,arp:'broken'},{tr:-2,orn:.2}]},
 /* 赤い騎士：ニ長調の英雄譚。Aメロ（静か）→Bメロ（刻んで盛り上げ、最後の小節で音を抜く）→サビ（王道進行、金管全開、シンバル）。最後のサビは全音上へ転調 */
 red:{bpm:128,react:1,root:62,scale:'maj',mel:'brass',pad:'str',bass:'march',perc:'march',ost:1,gain:1,
  sec:{In:{ch:'0 5@m 6@m 0',mel:'0:2 4:1 4:1 7:4 | 5@m:2 7:2 9@m:4 | 6@m:2 8:2 10:4 | 7:8',roll:1},
   A:{ch:'5 3 0 4 5 3 4 4',mi:'brassDark',bass:'gallop',perc:'timp2',mel:'5:3 4:1 5:2 7:2 | 7:3 8:1 7:2 5:2 | 4:6 2:2 | 1:6 r:2 | 5:3 4:1 5:2 9:2 | 10:4 9:2 7:2 | 8:3 7:1 6:2 4:2 | 4:8'},
   A2:{ch:'5 3 0 4 5 3 4 4',bass:'gallop',perc:'march',mel:'9:3 8:1 9:2 12:2 | 10:4 9:2 7:2 | 7:3 9:1 11:2 9:2 | 8:6 r:2 | 9:3 8:1 9:2 12:2 | 14:4 12:2 10:2 | 13:3 12:1 11:2 8:2 | 11:8'},
   B:{ch:'3 3 4 4 5 5 4 4',bass:'pulse8',perc:'build',arp:'up8',drop:1,mel:'7:2 8:2 9:2 10:2 | 11:4 10:4 | 8:2 9:2 10:2 11:2 | 12:4 11:4 | 9:2 10:2 11:2 12:2 | 14:4 12:4 | 13:2 13:2 13:2 13:2 | 13:2 r:6'},
   S:{ch:'3 4 2 5 3 4 0 0',crash:1,harm:1,arp:'broken',mel:'12:4 11:2 10:2 | 11:6 13:2 | 13:3 12:1 11:2 9:2 | 12:6 9:2 | 10:3 11:1 12:2 14:2 | 15:4 13:4 | 14:8 | 14:4 r:2 11:1 13:1'},
   C:{ch:'5 2 3 0 5 2 3 4',mi:'choir',bass:'gallop',perc:'timp',mel:'9:4 7:4 | 9:4 6:4 | 7:6 5:2 | 4:8 | 9:2 11:2 12:4 | 13:4 11:4 | 12:3 11:1 10:4 | 8:8'},
   S3:{ch:'3 4 2 5 3 4 0 0',tr:2,crash:1,harm:1,arp:'up8',mel:'12:4 11:2 10:2 | 11:6 13:2 | 13:3 12:1 11:2 9:2 | 12:6 9:2 | 10:3 11:1 12:2 14:2 | 15:4 13:4 | 14:8 | 14:4 r:4'}},
  form:['In','A','B','S','A2','B','S','C','B','S3'],pv:[{},{harm:1},{tr:3,orn:.15}]}};
/* 赤い騎士の本気（第二形態）：同じ英雄譚を速く、厚く */
SONGS.red2=Object.assign({},SONGS.red,{bpm:138,pv:[{harm:1},{harm:1,tr:3},{harm:1,tr:-2,orn:.2}]});
/* 赤い門のぬし：赤い騎士の英雄譚を、和声的短音階・ゆがんだ金管・三全音の持続音で怪物に */
SONGS.fallen=Object.assign({},SONGS.red,{bpm:112,scale:'hmin',mel:'brassDist',pad:'dark',bassI:'bassDist',perc:'timp2',oct:-1,drone:[0,6],whis:1,glitch:.12,
 pv:[{},{harm:1,arp:'broken'},{tr:-1,orn:.2}]});
/* 暗い門のぬし：門の歌をフリギアに。半音上の和音が濁り、刻む低音とささやきが混ざる */
SONGS.lord2=Object.assign({},SONGS.lord1,{bpm:100,scale:'phr',rmap:{h:'phr'},mel:'brassDist',oct:-1,pad:'dark',bass:'pulse8',bassI:'bassDist',perc:'timp2',drone:[0,6],whis:1,glitch:.1,
 pv:[{},{mel:'organ',oct:0,arp:'broken'},{tr:1,orn:.2}]});
/* ---- 1小節ぶんを鳴らす ---- */
const BPAT={broken:[0,2,3,2,1,2,3,2],up8:[0,1,2,3,0,1,2,3]};
function bFold(n,lo){while(n<lo)n+=12;while(n>=lo+12)n-=12;return n}
/* 層：base＝和音と低音／mel＝旋律・ハモり・分散和音／ost＝低い刻み／perc＝太鼓／hb＝鼓動。戦いの状況で層ごとに出し入れする */
function bBar(a,S,secN,bar,pass,t0,dest){const D=dest.mel?dest:{mel:dest,base:dest,ost:dest,perc:dest,hb:null},sec=S.sec[secN],pv=S.pv[pass%S.pv.length]||{},e=60/S.bpm/2,R=S.root+(pv.tr||0)+(sec.tr||0);
 const CH=sec.ch.split(/[\s|]+/).filter(Boolean),ct=CH[bar];if(ct==null)return;const ch=bChord(ct,S),drop=sec.drop&&bar===CH.length-1,hd=drop?e*1.5:0;
 if(sec.crash&&bar===0){bCrash(a,t0,D.perc);bTimp(a,t0,1.2,D.perc)}
 if(drop){for(const sx of ch)bVoice(a,BI[S.pad],bFold(R+sx,52),t0,hd,1,D.base);bVoice(a,BI[S.bassI||'bass'],bFold(R+ch[0],38),t0,hd,1,D.base);bTimp(a,t0,1,D.perc);for(let i=0;i<12;i++)bSnare(a,t0+2*e+i*e/2,.25+i*.07,D.perc)}
 if(!drop){
 for(const s of ch)bVoice(a,BI[S.pad],bFold(R+s,52),t0,e*8*.98,1,D.base);
 const br=bFold(R+ch[0],38),b5=bFold(R+ch[2],38),BI2=BI[S.bassI||'bass'],bp=sec.bass||S.bass,B=D.base;
 if(bp==='hold')bVoice(a,BI2,br,t0,e*8*.95,1,B);
 else if(bp==='rf'){[br,b5,br,b5].forEach((n,i)=>bVoice(a,BI2,n,t0+i*2*e,e*1.8,i%2?.8:1,B))}
 else if(bp==='march'){[[0,3,br],[3,1,br],[4,2,b5],[6,2,br]].forEach(([s,l,n])=>bVoice(a,BI2,n,t0+s*e,e*l*.9,s===0?1:.8,B))}
 else if(bp==='pulse8'){for(let i=0;i<8;i++)bVoice(a,BI2,i===4?br+12:br,t0+i*e,e*.8,i%2?.7:1,B)}
 else if(bp==='gallop'){for(let q=0;q<4;q++){const b0=t0+q*2*e;bVoice(a,BI2,br,b0,e*.9,1,B);bVoice(a,BI2,br,b0+e,e*.45,.7,B);bVoice(a,BI2,q%2?b5:br,b0+1.5*e,e*.45,.7,B)}}
 const os=sec.ost!=null?sec.ost:S.ost;if(os||(S.react&&sec.ost!==0&&dest.mel)){const lo=bFold(R+ch[0],50),fi=bFold(R+ch[2],50),P16=[0,0,1,0,0,0,1,0,0,0,1,0,0,1,0,1];P16.forEach((k,i)=>bVoice(a,BI.stac,k?fi:lo,t0+i*e/2,e*.4,i%4===0?1:.65,os?D.ost:D.ostT))}
 if(D.hb){for(let q=0;q<2;q++){const hb=t0+q*4*e;bThump(a,hb,1,D.hb);bThump(a,hb+.2,.7,D.hb)}}
 }
 const M=sec._m||(sec._m=bMel(sec.mel)),oct=(sec.oct||0)+(pv.oct!=null?pv.oct:(S.oct||0)),MI=BI[sec.mi&&pass%2===0?sec.mi:(pv.mel||sec.mi||S.mel)];
 for(const n of M.ev){if(n.t<bar*8||n.t>=bar*8+8)continue;const t=t0+(n.t-bar*8)*e;let m=R+bSemi(n.n,S)+12*oct;if(S.glitch&&Math.random()<S.glitch)m+=1;
  if(pv.orn&&n.d>=4&&Math.random()<pv.orn){bVoice(a,MI,m,t,(n.d-1)*e*.95,1,D.mel);bVoice(a,MI,R+bSemi(bShift(n.n,1),S)+12*oct,t+(n.d-1)*e,e*.9,.8,D.mel)}
  else bVoice(a,MI,m,t,n.d*e*.95,1,D.mel);
  if(pv.harm||sec.harm)bVoice(a,BI.str,R+bSemi(bShift(n.n,-2),S)+12*oct,t,n.d*e*.95,1.6,D.mel)}
 const ap=drop?null:(pv.arp||sec.arp||S.arp);
 if(ap==='bell1')bVoice(a,BI.bell,bFold(R+ch[0],72),t0,e*6,.6,D.mel);
 else if(BPAT[ap]){const tones=[...ch.map(s=>bFold(R+s,62))].sort((x,y)=>x-y);tones.push(tones[0]+12);BPAT[ap].forEach((k,i)=>bVoice(a,BI.pluck,tones[k%tones.length],t0+i*e,e*.9,i%2?.7:1,D.mel))}
 const pc=drop?'none':(sec.perc||S.perc),last=bar===CH.length-1,P=D.perc;
 if(pc==='build'){bTimp(a,t0,.8,P);for(let i=0;i<8;i++)bSnare(a,t0+i*e,.15+.6*(bar/CH.length)+(i%2?0:.1),P)}
 if(pc==='timp')bTimp(a,t0,1,P);
 else if(pc==='timp2'){bTimp(a,t0,1,P);bTimp(a,t0+4*e,.7,P)}
 else if(pc==='march'){bTimp(a,t0,1,P);bTimp(a,t0+4*e,.75,P);bSnare(a,t0+2*e,.8,P);bSnare(a,t0+6*e,.8,P);
  if(last&&sec.roll)for(let i=0;i<8;i++)bSnare(a,t0+4*e+i*e/2,.4+i*.09,P)}
 if(S.whis&&bar===0)bWhis(a,t0,P)}
/* 鼓動：低く短い「ドクン」 */
function bThump(a,t,v,dest){const os=a.createOscillator(),g=a.createGain();os.type='sine';os.frequency.setValueAtTime(70,t);os.frequency.exponentialRampToValueAtTime(42,t+.12);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.2*v,t+.008);g.gain.setTargetAtTime(0,t+.02,.06);os.connect(g).connect(dest);os.start(t);os.stop(t+.5)}
/* ---- 再生の管理 ---- */
const BGM={cur:null,out:null,song:null,si:0,bar:0,pass:0,next:0,drones:[]};
function bgmWant(){if(!AC||!CFG.bgm||G.mode==='title'||!G.en)return null;if(['clear','lose','dying','hole','result'].includes(G.state))return null;if(G.state==='enter'&&G.enter&&G.enter.t<106)return null;if(G.state==='bintro'&&G.t<66)return null;
 const e=G.en,k=e.key;if(k==='lord')return e.form==='B'?'lord2':'lord1';if(k==='red')return e.p2?'red2':'red';if(k==='fallen')return'fallen';return e.boss?'boss':e.mid?'mid':'field'}
function bgmBus(){if(BGM.bus)return BGM.bus;const a=AC,c=a.createDynamicsCompressor();c.threshold.value=-18;c.ratio.value=3;c.connect(a.destination);
 const cv=a.createConvolver(),L=Math.round(a.sampleRate*2.2),ir=a.createBuffer(2,L,a.sampleRate);for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<L;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/L,2.6)}cv.buffer=ir;const rg=a.createGain();rg.gain.value=.32;cv.connect(rg).connect(c);
 BGM.rev=cv;return BGM.bus=c}
function bgmOut(){const o=AC.createGain();o.gain.value=0;o.connect(bgmBus());o.connect(BGM.rev);o.L={};for(const k of['mel','base','ost','ostT','perc','hb','ral']){const g=AC.createGain();g.gain.value=k==='mel'||k==='base'||k==='ost'||k==='perc'?1:0;g.connect(o);o.L[k]=g}return o}
function bgmMute(){if(AC&&BGM.out)BGM.out.gain.setTargetAtTime(0,AC.currentTime,.05)}
function bgmStopDrones(t){for(const d of BGM.drones){try{d.stop(t)}catch(_){}}BGM.drones=[]}
function bgmTick(){if(!AC||AC.state!=='running')return;if(!BGM.out)BGM.out=bgmOut();
 const w=bgmWant(),now=AC.currentTime;
 const fam=x=>x==='lord2'?'lord1':x==='red2'?'red':x;
 if(w!==BGM.cur&&w&&BGM.cur&&fam(w)===fam(BGM.cur)){/* 怒り・変身：曲は止めず、次の小節から同じ位置で編曲だけ変える */
  BGM.cur=w;BGM.song=SONGS[w];bgmStopDrones(now+.3);const S=BGM.song;if(S.drone)for(const iv of S.drone){const os=AC.createOscillator(),g=AC.createGain();os.type='sawtooth';os.frequency.value=mtof(bFold(S.root+iv,38));const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=260;g.gain.value=.018;os.connect(f).connect(g).connect(BGM.out);os.start(now+.3);BGM.drones.push(os)}}
 if(w!==BGM.cur){const o=BGM.out,prev=BGM.cur;o.gain.setTargetAtTime(0,now,prev&&w?.7:.35);setTimeout(()=>{try{o.disconnect()}catch(_){}},5000);BGM.out=bgmOut();bgmStopDrones(now+1.5);
  BGM.cur=w;BGM.song=w?SONGS[w]:null;BGM.si=0;BGM.bar=0;BGM.pass=0;BGM.next=now+(prev&&w?1.2:.15);BGM.fin=prev&&w?now+3:0;
  const S=BGM.song;if(S&&S.drone)for(const iv of S.drone){const os=AC.createOscillator(),g=AC.createGain();os.type='sawtooth';os.frequency.value=mtof(bFold(S.root+iv,38));const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=260;g.gain.value=.018;os.connect(f).connect(g).connect(BGM.out);os.start(now+.4);BGM.drones.push(os)}}
 /* 拍で読む攻撃・予兆の音・打ち合いの間は音楽を引く */
 const S0=BGM.song,RE=!!(S0&&S0.react),ral=!!(G.rally&&G.rally.on),tense=G.state==='enemy'&&!ral,low=G.hero&&G.hero.hp>0&&G.hero.hp/G.hero.max<.3;
 if(BGM.out&&BGM.out.L){const L=BGM.out.L,set=(k,v)=>L[k].gain.setTargetAtTime(v,now,.12);
  if(RE){set('mel',ral?0:tense?.18:1);set('base',ral?.3:tense?.65:1);set('ost',ral?0:1);set('ostT',ral?0:tense?1:0);set('perc',ral?.35:tense?.7:1);set('hb',Math.max(ral?.6:tense?.9:0,low?.8:0));set('ral',ral?1:0)}
  else{for(const k of['mel','base','ost','perc'])set(k,1);set('ostT',0);set('hb',0);set('ral',0)}}
 /* 打ち合いの刻み：16分で、合を重ねるごとに全音ずつ上がる */
 if(RE&&ral&&S0){const e16=60/S0.bpm/4;if(!BGM.rn||BGM.rn<now)BGM.rn=now+.03;const base=bFold(S0.root,50),up=Math.min(14,2*((G.rally.n||1)-1));
  while(BGM.rn<now+.12){const i=BGM.ri=(BGM.ri||0)+1;bVoice(AC,BI.stac,base+up+(i%4===2?7:0),BGM.rn,e16*.8,i%4===0?1.1:.7,BGM.out.L.ral);BGM.rn+=e16}}else BGM.rn=0;
 const beat=G.state==='enemy'&&G.strikes&&G.strikes.some(s=>!s.done&&!s.cx&&(s.beats||s.beat||s.rhythm)),cue=now<DUCK,
  duck=(G&&G.uk&&G.uk.t<UK.HIT?.06:1)*(ral?(RE?.75:.15):G.state==='ko'?.4:G.state==='roar'?.55:1)*(beat?.3:1)*(cue?.45:1)*(MENU?.35:1),tgt=w?(CFG.bgm/10)*.42*duck*((BGM.song&&BGM.song.gain)||1):0;
 BGM.out.gain.setTargetAtTime(tgt,now,cue?.03:now<(BGM.fin||0)?.9:w?.25:.4);
 if(!w)return;const S=BGM.song,e=60/S.bpm/2;
 if(BGM.next<now)BGM.next=now+.05;
 while(BGM.next<now+.8){const sn=S.form[BGM.si],sec=S.sec[sn],nb=sec.ch.split(/[\s|]+/).filter(Boolean).length;
  try{bBar(AC,S,sn,BGM.bar,BGM.pass,BGM.next,S.react?BGM.out.L:Object.assign({},BGM.out.L,{hb:null}))}catch(err){console.error(err)}
  BGM.next+=8*e;BGM.bar++;if(BGM.bar>=nb){BGM.bar=0;BGM.si++;if(BGM.si>=S.form.length){BGM.si=0;BGM.pass++}}}}

function holeItems(){return[{l:'のぞいてみる',h:'',a:()=>{G.order.push('fallen');G.csel=0;G.hero.hp=G.hero.max;G.hero.pot=Math.max(G.hero.pot,3);SFX.full();startBattle(G.bi+1,false);text(HX,FLOOR-44,'HP・薬 全快','#9dffc4',true)}},{l:'立ち去る',h:'',a:()=>{G.state='clear';G.t=0;G.csel=0;SFX.win();confetti();bookClear()}}]}
function holeStep(){if(G.t%4===0){const a=Math.random()*Math.PI*2;G.pts.push({x:EX+Math.cos(a)*10,y:FLOOR-1,vx:-Math.cos(a)*.25,vy:-.2-Math.random()*.5,t:0,life:30,col:Math.random()<.3?'#c89aff':'#4a2260',sz:1,drag:.98,g:-.01})}if(G.t===40)SFX.whisper()}
function drawHole(){const st=G.state==='hole'?Math.min(1,G.t/40):G.state==='enter'&&G.en&&G.en.key==='fallen'&&G.enter?Math.max(0,1-G.enter.t/120):0;if(st<=0)return;
 const cx=EX,cy=FLOOR,rw=Math.round(16*st),rh=Math.max(1,Math.round(4*st));
 for(let yy=-rh;yy<=rh;yy++){const ww=Math.round(rw*Math.sqrt(Math.max(0,1-(yy*yy)/(rh*rh+.01))));if(ww<=0)continue;l.fillStyle='#4a2260';l.fillRect(cx-ww-1,cy+yy,ww*2+3,1);l.fillStyle='#050208';l.fillRect(cx-ww,cy+yy,ww*2+1,1)}
 for(let i=0;i<6;i++){const a=G.anim*.05+i*1.05,r=rw*.7;px(cx+Math.cos(a)*r,cy+Math.sin(a)*rh*.6,i%2?'#9060ac':'#c89aff')}}
/* 黒い門番：多枚絵になったので、触手の付け根は絵ごとの基準点から取る */
function drawGateK(e,x,y,v){const fr=lordFrame(e),A=LANC[fr]||LANC.lK_idle,ns=G.state==='enemy'&&G.strikes&&G.strikes.find(s=>!s.done),k=ns&&G.et>=ns.start?Math.max(0,1-Math.abs(G.et-ns.cue)/10):0,ct=nCol('#4a2260',v,e.tint),cT=nCol('#c070e0',v,e.tint);G.lordTip=null;
 const FR=[-5,-3,-1,1,3,5].map((dx,j)=>[x+A.vz[0]+dx,y+A.vz[1]+(j%2)]),LN=[7,11,9,6,10,8];
 if(!G.ko){for(let j=0;j<6;j++){const R=FR[j],L=LN[j];for(let i=0;i<L;i++){const f=i/L,sw=Math.sin(G.anim*.08+j*1.7+i*.5)*f*2.2,cu=-k*f*f*(6+j);px(Math.round(R[0]+sw+cu),R[1]+Math.round(i*(1-.3*k)),i===L-1?cT:ct)}}
  for(let j=0;j<3;j++){const R=[x+A.cp[0]+j*3,y+A.cp[1]+1];for(let i=0;i<6;i++){const f=i/6,a=Math.sin(G.anim*.07+j*2.1)*.8+.6+f*.9;px(Math.round(R[0]+Math.cos(a)*i*1.1),Math.round(R[1]-Math.sin(a)*i*1.1+i*.3),i===5?cT:ct)}}}
 if(G.state==='enemy'&&G.strikes){const cur=ns;
  for(const s of G.strikes){if(s.cx)continue;const d=G.et-s.impact;
   if(s.fake){if(s.mv==='yank'&&G.et>=s.start&&G.et<=s.end){const H=[x+A.fh[0],y+A.fh[1]];for(let i=0;i<10;i++){const a=i*.7+G.anim*.3;px(H[0]+Math.cos(a)*3.5,H[1]+Math.sin(a)*2.2,i%2?ct:cT)}}continue}
   if(G.et<s.start||d>12)continue;
   if(s.mv==='vlash'){const j=(s.ten||0)%4+1,R=[FR[j][0],FR[j][1]+3];tentStab(s,R,[R[0]-10-(s.ten||0)*10,R[1]-24+(s.ten||0)*8],[R[0]-2,R[1]+8],[HX+16,FLOOR-20],v,e,cur,2.2)}
   else if(s.mv==='cape')tentSweep(s,[x+A.cp[0]+3,y+A.cp[1]],v,e,cur)}}
 if(ns&&(ns.mv==='vlash'||ns.mv==='cape')&&G.lordTip)return G.lordTip;
 if(ns&&ns.mv==='cut2')return{x:x+A.bh[0]+2,y:y+A.bh[1]-2};
 return{x:x+A.fs[0],y:y+A.fs[1]}}
function lordFrame(e){const F=e.skin==='R'?'lR_':e.skin==='F'?'lF_':e.skin==='G'?'lG_':e.skin==='K'?'lK_':e.form==='B'?'lB_':'lA_',SUB=e.skin==='G'||e.skin==='K',
 ok=f=>NSPR[F+f]?F+f:F+'idle',I=(e.skin==='R'&&e.p2)?((G.anim>>5)%2?'hi2':'hi'):((G.anim>>5)%2?'idle2':'idle');
 if(G.state==='enter')return ok(G.enter?G.enter.f:'idle');
 if(G.state==='roar')return e.skin==='R'?(G.t<22?'lR_clash':'lR_hi'):e.skin==='F'?(G.t<26?'lF_kneel':'lF_mawR'):(G.t<26?'lA_kneel':'lB_mawR');
 if(G.ko)return ok(G.ko.lordF||(e.cine?'clash':'kneel'));
 if(e.broken)return ok('kneel');
 if(G.state==='enemy'&&G.strikes){
  const r=G.strikes.filter(s=>s.done&&!s.cx&&!s.fake&&s.impact<=G.et&&G.et<s.impact+12).pop();
  if(r&&r.res==='parry'&&G.et<r.impact+5)return ok('clash');
  const s=G.strikes.find(s=>!s.done);
  if(s&&s.rally&&G.rally&&G.rally.on&&G.et<s.start)return ok('clash');
  if(s&&G.et>=s.start){const m=LMV[s.mv]||LMV.cut,d=G.et-s.impact;
   if(s.fake){const k=G.et-s.cue;return ok(s.mv==='cut'||s.mv==='yank'||SUB?(k>=6?'cutS':k>=3?'cutM':'cutR'):(k>=2&&k<10?'thrS':'thrR'))}
   return ok(d>=-3?m[1]:m[0])}
  if(r)return ok(r.res==='parry'?'clash':(LMV[r.mv]||LMV.cut)[2]);
  if((G.pings||[]).some(pg=>!pg.done)||(s&&(s.mv==='bk'||s.mv==='vlash')))return ok(SUB?'idle':'mawR');
 }
 if(e.stance)return ok('guard');
 return ok(I)}

function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a}
function makeOrder(K){K=K??(G&&G.K!=null?G.K:1);const P1=a=>pick(a),P2=(a,b)=>{const x=pick(a);return[x,pick(b.filter(k=>k!==x))]};
 /* 新しい動きは中ボス・ボスで初めて出会う：突進=大イノシシ、連撃=門番、フェイント=うそつきの影、居合=浪人頭、投げ物と拍=小鬼のおかしら、チクタク=人形改、足音=大亡霊 */
 if(K<=0){const[f1,f2]=P2(['shroom','armor'],['shroom','armor','bomb']);return[f1,f2,'boarM','gslime',P1(['boar','bomb','armor'].filter(k=>k!==f2)),'samuraiB']}
 if(K===1){const[f1,f2]=P2(['slime','bat','boar'],['slime','bat','shroom','armor','bomb']);return[f1,f2,'shadeM',P1(['shade','armor','boar']),'gslime','samuraiM',P1(['samurai','bomb']),'dragon']}
 if(K===2){const[f1,f2]=P2(['boar','bat','slime'],['armor','bomb','shade','samurai']);return[f1,f2,'impM',P1(['imp','golem','beast']),'gslime','dollM',P1(['doll','golem','beast']),'dragon']}
 if(K===3){const[f1,f2]=P2(['imp','boar','beast'],['doll','bomb','shade','golem']);return[f1,f2,'ghostM',P1(['ghost','samurai']),'gslime','samuraiB',P1(['ghost','shade','doll']),'dragon']}
 const[f1,f2]=P2(['imp','beast','doll','ghost'],['bomb','shade','golem','samurai','doll']);return[f1,f2,P1(['impM','dollM','ghostM']),P1(['ghost','samurai','golem']),'gslime','samuraiB',P1(['ghost','shade','doll','beast']),'dragon','lord']}

function aliveIdx(){const e=G.en;if(!e||!e.uhp)return[0];const a=[];e.uhp.forEach((v,i)=>{if(v>0)a.push(i)});return a.length?a:[e.uhp.length-1]}
function aliveN(){const e=G.en;if(e&&e.uhp)return Math.max(1,e.uhp.filter(v=>v>0).length);return e&&e.swarm?Math.max(1,Math.ceil(e.hp/(e.hpMax/e.swarm)-1e-6)):1}
function mixHex(a,b,t){const A=parseInt(a.slice(1),16),B=parseInt(b.slice(1),16),f=(sh)=>Math.round(((A>>sh)&255)*(1-t)+((B>>sh)&255)*t);return'#'+[16,8,0].map(sh=>f(sh).toString(16).padStart(2,'0')).join('')}

