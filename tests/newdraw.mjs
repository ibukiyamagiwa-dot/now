// ?new（資料集の骨組みで描く門番）のテスト。門番と戦わせ、エラーが出ないこと・骨組みの絵が使われていること・1枚を描く時間を確かめる。
// 使い方: node tests/newdraw.mjs [フォルダ=.] [スクショの保存先フォルダ]
//   保存先を渡すと、?new なし（今の公開版）とありで、同じ場面を撮って並べる（old_*.png と new_*.png）。
// ゲームの時間は止めて（VSPD=0）、tick() を自分で進めるので、毎回同じフレームが撮れる。
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const dir = path.resolve(process.argv[2] || '.'), out = process.argv[3];
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.woff2': 'font/woff2', '.png': 'image/png' };
const srv = http.createServer((q, r) => { const f = path.join(dir, decodeURIComponent(q.url.split('?')[0]).replace(/\/$/, '/index.html'));
  if (!f.startsWith(dir) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
await new Promise(ok => srv.listen(0, ok));
const exe = process.env.CI ? null : ['/usr/bin/google-chrome', '/usr/bin/chromium'].find(fs.existsSync);
const browser = await pw.chromium.launch(exe ? { executablePath: exe } : {});
// 場面：名前と、そこまで進める手順（ページの中で実行する）
const SCENES = ['idle', 'bored1', 'bored2', 'wind1', 'swing1', 'hit1', 'wind2', 'hit2', 'parry1', 'parry2', 'broken', 'recover', 'kneel'];
async function run(q) {
  const page = await browser.newPage({ viewport: { width: 960, height: 600 } }), errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push('console: ' + m.text()); });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.addInitScript(() => { let s = 12345; Math.random = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32); });
  await page.goto(`http://127.0.0.1:${srv.address().port}/${q}`); await page.waitForTimeout(800);
  await page.evaluate(() => {
    window.VSPD = 0;
    const T = window.__T = {};
    T.fresh = () => { closeMenu && closeMenu(); startPractice('samuraiB'); G.card = null; G.cards = []; G.state = 'cmd'; G.t = 0; G.en.hp = G.en.hpMax = 9999; for (let i = 0; i < 30; i++) tick() };
    T.step = n => { for (let i = 0; i < n; i++) tick() };
    T.until = (f, max = 600) => { for (let i = 0; i < max && !f(); i++) tick(); };
    T.s = i => G.strikes.filter(s => !s.fake)[i];
    T.parryAll = (stopAt) => { for (let i = 0; i < 400; i++) { const s = G.state === 'enemy' && G.strikes.find(s => !s.done && G.et === s.impact - 2); if (s) press(); tick(); if (stopAt && stopAt()) break } };
    T.scene = name => {
      T.fresh();
      if (name === 'idle') T.step(20);
      if (name === 'bored1') { T.until(() => G.bored); T.step(35) }
      if (name === 'bored2') { T.until(() => G.bored); T.step(100) }
      if (name === 'wind1') { startEnemy(); T.until(() => G.et >= T.s(0).cue + 2) }
      if (name === 'swing1') { startEnemy(); T.until(() => G.et >= T.s(0).impact - 2) }
      if (name === 'hit1') { startEnemy(); T.until(() => G.et >= T.s(0).impact + 1) }
      if (name === 'wind2') { startEnemy(); T.until(() => G.et >= T.s(1).cue + 2) }
      if (name === 'hit2') { startEnemy(); T.until(() => G.et >= T.s(1).impact + 1) }
      if (name === 'parry1') { startEnemy(); let a = -1; T.parryAll(() => { if (a < 0 && T.s(0).res === 'parry') a = G.anim; return a >= 0 && G.anim - a >= 8 }) }
      if (name === 'parry2') { startEnemy(); let a = -1; T.parryAll(() => { if (a < 0 && T.s(1) && T.s(1).res === 'parry') a = G.anim; return a >= 0 && G.anim - a >= 14 }) }
      if (name === 'broken') { G.en.broken = 1; T.step(40) }
      if (name === 'recover') { G.en.broken = 1; T.step(40); G.en.broken = 0; T.step(3) }
      if (name === 'kneel') { ko(false); T.until(() => G.t >= 60) }
      draw();
      return { state: G.state, et: G.et, strikes: (G.strikes || []).map(s => [s.mv, s.start, s.cue, s.impact, s.res]) };
    };
  });
  const shots = {}, info = {};
  for (const name of SCENES) {
    info[name] = await page.evaluate(n => window.__T.scene(n), name);
    if (out) { const f = path.join(out, `${q ? 'new' : 'old'}_${name}.png`); await page.locator('#cv').screenshot({ path: f }); shots[name] = f }
  }
  // ひまなとき（T039）：コマンドを選ばずに【ひまなときまでの秒】たつと一度だけ見せ、光らず（撃も合図も作らない）、終われば戻り、同じ番の中では二度は出ない
  const bored = await page.evaluate(() => { const T = window.__T; T.fresh(); const F = Math.round(P.boredS * 60); let at = -1, len = 0, starts = 0, strikes = 0, was = false;
    for (let i = 0; i < F + 900; i++) { tick(); if (G.bored && !was) { starts++; if (at < 0) { at = G.t; len = G.bored.len } } was = !!G.bored; strikes += (G.strikes || []).length + G.rings.length; if (G.state !== 'cmd') break }
    return { has: !!RIG.bored(G.en), at, F, len, starts, strikes, state: G.state, after: !!G.bored } });
  // 影の出現・ひまなとき・撃破（T009）：?new では、出現は資料集の長さで終わってあなたの番に、ひまなときは影ごとの長さ、撃破は砕かずに【撃破の長さ】で勝ちへ
  const shade = await page.evaluate(() => { const r = {};
    for (const key of ['shade', 'shadeM']) { closeMenu && closeMenu(); startPractice(key); G.card = null; G.cards = []; const o = r[key] = { enter: G.state === 'enter' ? G.enter.rig : 0 };
      let n = 0; while (G.state === 'enter' && n < 400) { tick(); n++ } o.enterTicks = n; o.afterEnter = G.state;
      const b = RIG.bored(G.en); o.bored = b ? b.len : 0;
      G.en.hp = 0; ko(false); n = 0; let shattered = false; while (G.state === 'ko' && n < 600) { tick(); n++; if (G.ko && G.ko.shattered) shattered = true }
      o.down = G.ko ? G.ko.down0 : null; o.koTicks = n; o.afterKo = G.state; o.shattered = shattered; o.len = G.en.mid ? P.koLenMid : P.koLenMob }
    return r });
  // 自動で戦わせて、例外が出ないかを見る（パリィとガードをまぜる）
  const auto = await page.evaluate(() => { const T = window.__T; T.fresh(); let turns = 0;
    for (let k = 0; k < 40; k++) { startEnemy(); turns++; for (let i = 0; i < 300 && G.state === 'enemy'; i++) { const s = G.strikes.find(s => !s.done && G.et === s.impact - (k % 3 ? 2 : 12)); if (s) press(); tick() } G.state = 'cmd'; G.en.broken = k % 5 === 4 ? 1 : 0; T.step(20) }
    const used = typeof RIG === 'object' && RIG.on(G.en);
    // 1枚を描く時間（骨組み→画素→キャンバス）
    let ms = null; if (used) { const t0 = performance.now(); for (let i = 0; i < 300; i++) { G.anim++; RIG.img(G.en, 'n') } ms = (performance.now() - t0) / 300 }
    return { turns, used, ms };
  });
  await page.close();
  return { errors, info, auto, shots, bored, shade };
}
const oldR = await run(''), newR = await run('?new');
await browser.close(); srv.close();
const B = newR.bored, boredOk = B.has && B.at === B.F && B.starts === 1 && !B.strikes && B.state === 'cmd' && !B.after && !oldR.bored.has && oldR.bored.starts === 0;
const SN = newR.shade, SO = oldR.shade, shadeOk = ['shade', 'shadeM'].every(k => SN[k].enter === 110 && SN[k].enterTicks === 110 && SN[k].afterEnter === 'cmd' && SN[k].bored === (k === 'shadeM' ? 180 : 160)
  && SN[k].down === 1 && !SN[k].shattered && SN[k].afterKo === 'win' && SO[k].enter === 0 && SO[k].bored === 0 && SO[k].down == null && SO[k].shattered);
const ok = shadeOk && !oldR.errors.length && !newR.errors.length && newR.auto.used && !oldR.auto.used && newR.auto.ms < 4 && boredOk;
console.log(JSON.stringify({ ok, old: { errors: oldR.errors, used: oldR.auto.used }, new: { errors: newR.errors, used: newR.auto.used, msPerFrame: newR.auto.ms && +newR.auto.ms.toFixed(3), bored: B, shade: shadeOk ? 'OK' : SN }, oldShade: shadeOk ? 'OK' : SO, timing: newR.info.hit2 && newR.info.hit2.strikes }, null, 1));
process.exit(ok ? 0 : 1);
