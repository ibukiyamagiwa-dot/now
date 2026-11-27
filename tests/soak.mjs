// 自動で戦わせ続けて、こわれ方を探す（2024-04-16「デバッグの体制」：スマブラではコンピューター戦を一晩流してバグを探す）。
// 2023-08-12「デバッグは終わらない」：組み合わせは人の手では当たりきれない。押す時間・選ぶ技・敵をばらばらにして、人が試さない組み合わせを機械に当てさせる。
// 敵ごとに練習で戦わせ、ボットが技を選び、A をでたらめな時間・ちょうどの時間・押さない、のどれかで押す。ゲームの時間は止めて tick() を直接進めるので、速い。
// 見ること：①tick と draw で例外が出ない ②HP が数（NaN でない）で、0〜最大のあいだ ③同じ状態に長く止まらない（詰み）
// 　　　　　④床と間合い（design/GAME_REQUESTS.md「床と間合い」）：敵の絵だけを描いて、床（FLOOR）より下に見える画素が0、
//         床で切る前の絵の沈み（剣先も含む）が【床に沈んでよい深さ】以内、だれも振っていないときに主人公と重ならない。床の影・床をすべるたまり・合図の光は数えない。
// 使い方: node tests/soak.mjs [フォルダ=.] [敵ごとのフレーム数=2400] [種=1]
//   check.sh では短く走らせる（手元 800F、GitHub の CI 2400F。SOAK_FR で変えられる）。夜通し回すなら: node tests/soak.mjs . 200000 7
// 落ちたときは、敵・種・フレームを出すので、同じ種で走らせれば同じところで落ちる。敵ごとの押した回数と状態は SOAK_STATS=1 で出る。
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const dir = path.resolve(process.argv[2] || '.'), FR = +(process.argv[3] || 2400), SEED = +(process.argv[4] || 1);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.woff2': 'font/woff2', '.png': 'image/png' };
const srv = http.createServer((q, r) => { const f = path.join(dir, decodeURIComponent(q.url.split('?')[0]).replace(/\/$/, '/index.html'));
  if (!f.startsWith(dir) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
await new Promise(ok => srv.listen(0, ok));
const exe = process.env.CI ? null : ['/usr/bin/google-chrome', '/usr/bin/chromium'].find(fs.existsSync);
const browser = await pw.chromium.launch(exe ? { executablePath: exe } : {});
const page = await browser.newPage({ viewport: { width: 960, height: 600 } }), pageErr = [];
page.on('pageerror', e => pageErr.push(e.message));
await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
await page.addInitScript(seed => { let s = seed; Math.random = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32); }, SEED);
await page.goto(`http://127.0.0.1:${srv.address().port}/`); await page.waitForTimeout(800);
const res = await page.evaluate(({ FR, SEED }) => {
  window.VSPD = 0; try { closeMenu() } catch (e) {}
  // ボットの乱数はゲームの乱数と分ける（ボットのせいでゲームの流れが変わりすぎないように）
  let bs = SEED * 7919 + 1; const rnd = () => ((bs = (bs * 1103515245 + 12345) >>> 0) / 2 ** 32);
  const STUCK = 60 * 60;          // 同じ状態に 60 秒いたら詰みとみなす
  const SINK = 3;                 // 【床に沈んでよい深さ】（画素）。足・ひづめ・ひっくり返った背中のように床につく部分の分
  const NOFX = { shadowPx: () => {}, drawHPool: () => {}, cueStar: () => {}, drawCue: () => {}, pxStar: () => {} };
  // 敵だけ（clip＝床で切る）か主人公だけを描いて、描いた画素の印を返す。床の影・床をすべるたまり・合図の光は描かない
  const layer = (fn) => { const keep = {}; for (const k in NOFX) { keep[k] = globalThis[k]; globalThis[k] = NOFX[k] }
    l.clearRect(0, 0, LW, LH); try { fn() } finally { Object.assign(globalThis, keep) }
    const d = l.getImageData(0, 0, LW, LH).data, m = new Uint8Array(LW * LH); for (let i = 0; i < m.length; i++) m[i] = d[i * 4 + 3] > 0; return m };
  const below = m => { let n = 0, dep = 0; for (let y = FLOOR; y < LH; y++) for (let x = 0; x < LW; x++) if (m[y * LW + x]) { n++; dep = y - FLOOR + 1 } return { n, dep } };
  const floorCheck = (k, f) => {
    // 沈みは毎回、床で切れているかと重なりは間引いて見る（全部を毎回見ると check.sh が遅くなるため）
    const raw = below(layer(() => { drawEnemy(); drawLordKo() })), cut = f % 12 === 0 ? below(layer(() => floorClip(() => { drawEnemy(); drawLordKo() }))) : { n: 0 };
    const mv = ((G.strikes || []).find(s => !s.done) || {}).mv || '';
    if (cut.n) return `${k}：${f}F（状態 ${G.state}${mv && '・' + mv}）床より下に見える画素が ${cut.n}`;
    if (raw.dep > SINK) return `${k}：${f}F（状態 ${G.state}${mv && '・' + mv}）床に ${raw.dep}画素沈んだ（${SINK}まで）`;
    // だれも振っていないとき（技を選ぶ間、敵の番で構えより前か当たりの16Fあと、主人公が構えのまま）は重ならない
    const quiet = G.state === 'cmd' || (G.state === 'enemy' && (G.strikes || []).every(s => s.done ? G.et - s.impact > 16 : G.et < s.start) && !(G.hpose && G.hpose.k !== 'idle'));
    if (quiet && f % 6 === 0) { const E = layer(() => floorClip(() => { drawEnemy(); drawLordKo() })), H = layer(drawHero); let n = 0; for (let i = 0; i < E.length; i++) n += E[i] & H[i];
      if (n) return `${k}：${f}F（状態 ${G.state}${mv && '・' + mv}）主人公と ${n}画素重なった` }
    return '' };
  const keys = Object.keys(EN), out = [], stats = {};
  for (const k of keys) {
    const st = stats[k] = { frames: 0, presses: 0, parry: 0, states: {} };
    try { startPractice(k) } catch (e) { out.push(`${k}：練習を始められない（${e.message}）`); continue }
    let same = 0, prev = '', mode = 0;
    for (let f = 0; f < FR; f++) {
      G.card = null;
      const s0 = G.state;
      try {
        if (s0 === 'cmd') { if (rnd() < .08) { const opts = [1, 2, 3].filter(n => { try { return usable(n) } catch (e) { return false } }); G.sel = opts[rnd() * opts.length | 0] || 1; press(); st.presses++ } }
        else if (s0 === 'enemy') {
          if (G.et === 0) mode = rnd() * 4 | 0;   // 0 ちょうど 1 早め 2 でたらめ 3 押さない
          const due = (G.strikes || []).find(s => !s.done && G.et === s.impact - (mode === 0 ? 2 : 10));
          if ((mode < 2 && due) || (mode === 2 && rnd() < .03)) { press(); st.presses++ }
        } else if (rnd() < .05) { press(); st.presses++ }
        tick(); if (f % 9 === 0) draw();
      } catch (e) { out.push(`${k}：${f}F（状態 ${s0}）で例外：${e.message}`); break }
      if (f % 4 === 0) { const bad = floorCheck(k, f); if (bad) { out.push(bad); break } }
      st.frames++; st.states[G.state] = (st.states[G.state] || 0) + 1;
      const h = G.hero, en = G.en;
      if (!Number.isFinite(h.hp) || h.hp < 0 || h.hp > h.max) { out.push(`${k}：${f}F 主人公の HP がおかしい（${h.hp}/${h.max}）`); break }
      if (en && (!Number.isFinite(en.hp) || en.hp > en.hpMax)) { out.push(`${k}：${f}F 敵の HP がおかしい（${en.hp}/${en.hpMax}）`); break }
      const now = G.state + '/' + (G.mode || '');
      same = now === prev ? same + 1 : 0; prev = now;
      if (same > STUCK && G.state !== 'cmd') { out.push(`${k}：${f}F 状態 ${G.state} から ${STUCK / 60} 秒動かない`); break }
      if (G.mode !== 'prac') startPractice(k);     // 練習が終わったらまた始める
    }
    st.parry = (G.strikes || []).filter(s => s.res === 'parry').length;
  }
  return { enemies: keys.length, out, stats };
}, { FR, SEED });
await browser.close(); srv.close();
for (const e of pageErr) res.out.push('ページのエラー：' + e);
const frames = Object.values(res.stats).reduce((a, s) => a + s.frames, 0);
console.log(`敵 ${res.enemies}体 × ${FR}F（種 ${SEED}）、合わせて ${frames}F（${Math.round(frames / 3600)}分ぶん）を自動で戦わせた`);
for (const o of res.out) console.log('  × ' + o);
if (process.env.SOAK_STATS) for (const [k, s] of Object.entries(res.stats)) console.log(`  ${k}: 押した ${s.presses}回 状態 ${Object.entries(s.states).map(([a, b]) => a + " " + b).join("・")}`);
console.log(res.out.length ? `こわれ方 ${res.out.length}件` : 'こわれ方なし');
process.exit(res.out.length ? 1 : 0);
