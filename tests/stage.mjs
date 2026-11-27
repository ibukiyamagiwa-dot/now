// ステージの背景の点検（design/stages.md の「背景の約束」2・3。計算は design/v2/audit_stage.py と同じ）。
// 覚悟の段ごとに、その段の本番に出る敵を背景の前に立たせて測る。不合格があれば終了コード1。
//   輪郭の差：敵のふちの画素と、すぐ外の背景の L* の差（待機4コマの平均）が 14 以上
//   合図の余白：合図が出る所（x 70〜215、y 12〜105）の背景のいちばん明るい L* が、合図の一番暗い色より 14 以上暗い
// 影の組（影の剣士・うそつきの影）の床の尾（床の線から上2行）は、床にある影で輪郭ではないので数えない（soak.mjs の床の点検と同じ）。
//   資料集の点検はキャンバスの中だけなので尾が短いが、ゲームでは尾が画面の端まで続き、床に溶けて差を下げるため（T094）。
// 幽霊は「見えにくい敵」として半透明に作ってある（待機の不透明度 0.32）ので、輪郭の差は測るが合否には入れない。
// 使い方: node tests/stage.mjs [フォルダ=.]
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const dir = path.resolve(process.argv[2] || '.');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.woff2': 'font/woff2', '.png': 'image/png' };
const srv = http.createServer((q, r) => { const f = path.join(dir, decodeURIComponent(q.url.split('?')[0]).replace(/\/$/, '/index.html'));
  if (!f.startsWith(dir) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
await new Promise(ok => srv.listen(0, ok));
const exe = process.env.CI ? null : ['/usr/bin/google-chrome', '/usr/bin/chromium'].find(fs.existsSync);
const browser = await pw.chromium.launch(exe ? { executablePath: exe } : {});
const page = await browser.newPage({ viewport: { width: 960, height: 600 } }), errors = [];
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
await page.addInitScript(() => { let s = 12345; Math.random = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32); });
await page.goto(`http://127.0.0.1:${srv.address().port}/`); await page.waitForTimeout(800);
const AUD = { edge: 14, cue: 14, skip: /^ghost/ };
const res = await page.evaluate(({ edge, cue, skip }) => {
  window.VSPD = 0; try { closeMenu() } catch (e) {}
  const W = LW, H = LH, Ls = c => STAGE.lstar(c), re = new RegExp(skip);
  const cueL = Math.min(...['#ffffff', '#ff4040', '#ffd040', '#b060ff'].map(h => Ls(STAGE.rgb(h))));
  const rows = [];
  for (let K = 0; K < 5; K++) {
    const S = STAGE.get(K), bg = S.C, keys = new Set();
    for (let i = 0; i < 200; i++) makeOrder(K).forEach(k => keys.add(k));/* その段の本番に出うる敵（ならくの竜のあとは門のぬし） */
    for (const key0 of keys) {
      RM2 = freshMods(); G = baseG(); G.K = K; G.Kmin = K; G.order = [key0]; G.runLen = 1; startBattle(0, false);
      G.state = 'cmd'; G.enter = null; G.card = null; G.cards = [];
      let e = 0, n = 0; const yMax = G.en.kind === 'shade' ? FLOOR - 2 : H - 1;
      for (const a of [0, 24, 48, 72]) {
        G.anim = a; l.clearRect(0, 0, W, H); drawEnemy();
        const d = l.getImageData(0, 0, W, H).data, isF = i => d[i * 4 + 3] >= 128,
          fc = i => { const al = d[i * 4 + 3] / 255; return [0, 1, 2].map(c => d[i * 4 + c] * al + bg[i][c] * (1 - al)) };
        let se = 0, ne = 0;
        for (let y = 1; y < yMax; y++) for (let x = 1; x < W - 1; x++) { const i = y * W + x; if (!isF(i)) continue;
          for (const j of [i - 1, i + 1, i - W, i + W]) if (!isF(j)) { se += Math.abs(Ls(fc(i)) - Ls(bg[j])); ne++ } }
        e += ne ? se / ne : 0; n++;
      }
      const key = G.en.key, ed = e / n, ex = re.test(key);
      rows.push({ K, key, edge: +ed.toFixed(1), zone: +S.zmax.toFixed(1), margin: +(cueL - S.zmax).toFixed(1), ex, ok: ex || (ed >= edge && cueL - S.zmax >= cue) });
    }
  }
  return rows;
}, { edge: AUD.edge, cue: AUD.cue, skip: AUD.skip.source });
await browser.close(); srv.close();
let bad = 0;
for (let K = 0; K < 5; K++) {
  const R = res.filter(r => r.K === K), A = R.filter(r => !r.ex), min = A.reduce((m, r) => r.edge < m.edge ? r : m, A[0]);
  console.log(`覚悟${K}  真ん中の背景の最大 L* ${R[0].zone}（合図の余白 ${R[0].margin}）  輪郭の差のいちばん低い敵 ${min.key} ${min.edge}`);
  for (const r of R) if (!r.ok) { bad++; console.log(`  × ${r.key} 輪郭の差 ${r.edge}`) }
  const g = R.filter(r => r.ex); if (g.length) console.log(`    （合否の外：${g.map(r => `${r.key} ${r.edge}`).join('、')}）`);
}
if (errors.length) { console.log(errors.join('\n')); bad++ }
console.log(`${res.length}組のうち不合格 ${bad}（輪郭の差 ${AUD.edge} 以上、合図の余白 ${AUD.cue} 以上で合格）`);
process.exit(bad ? 1 : 0);
