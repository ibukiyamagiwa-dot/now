/* ===== 門番の運命 =====
   赤い騎士：深淵に飲まれず、門番にならなかった世界線の騎士（第1形態→削りきると第2形態、構えが変わる）
   倒すと暗い穴が残る。覗けば、その未来でさえ深淵に侵された姿「赤い門のぬし」と戦う。去ればそのままクリア */
function skipKo(){const K=G.ko;if(!K)return;if(!K.shattered)shatter();if(K.lord&&!K.rib)K.rib={x:K.ex+8,y:FLOOR-24,t:0};G.stop=0;win()}
function skipRoar(){const e=G.en;if(e.skin==='R'){if(G.t<22){if(e.p2)G.banner={s:'第二形態',t:0};msg(`${e.name}が本気になった！ 打ち合いが長く、速くなる`)}if(e.p2)e.hp=e.hpMax;G.t=63;return}
 if(G.t<26){const FF=e.skin==='F';e.form='B';e.lit=true;markSeen('lordB');if(e.p2){if(!FF)e.name='暗い門のぬし';G.banner={s:'第二形態',t:0}}msg(FF?'赤い門のぬしが、くらやみに呑まれていく…… 剣のあいまに、くらやみの技が増える':'門のぬしが、くらやみを解き放った！ 剣に、くらやみの技が混ざる')}if(e.p2)e.hp=e.hpMax;G.t=79}
const SILH=new WeakMap();function silh(img){let o=SILH.get(img);if(o)return o;o=document.createElement('canvas');o.width=img.width;o.height=img.height;const x=o.getContext('2d');x.drawImage(img,0,0);x.globalCompositeOperation='source-in';x.fillStyle='#5c6478';x.fillRect(0,0,o.width,o.height);SILH.set(img,o);return o}
