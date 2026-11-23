// 道場・ビューア・演出くらべの3ページが、エラーなく動くかを確かめる。
// 使い方: node tests/pages.mjs [フォルダ=.] [スクショの保存先フォルダ]
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const dir = path.resolve(process.argv[2] || '.'), shots = process.argv[3];
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.woff2': 'font/woff2', '.png': 'image/png' };
const srv = http.createServer((q, r) => { const f = path.join(dir, decodeURIComponent(q.url.split('?')[0]).replace(/\/$/, '/index.html'));
  if (!f.startsWith(dir) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
await new Promise(ok => srv.listen(0, ok));
const exe = process.env.CI ? null : ['/usr/bin/google-chrome', '/usr/bin/chromium'].find(fs.existsSync);
const browser = await pw.chromium.launch(exe ? { executablePath: exe } : {});
// 各ページで「動いている」ことを示す値を、時間をおいて2回読む。変わっていれば動いている
const PROBE = {
  'rally.html':  'document.querySelector("#ov")&&document.querySelector("#ov").textContent.includes("打ち合い")',
  'viewer.html': 'window.G_&&G_().en&&[G_().en.name,G_().state,G_().et,G_().anim,V_.wait].join("|")',
  'ukprev.html': 'window.UKT&&UKT()+"|"+performance.now()',
};
let ok = true; const out = {};
for (const [page, probe] of Object.entries(PROBE)) {
  const p = await browser.newPage({ viewport: { width: 1280, height: 800 } }); const errors = [];
  p.on('pageerror', e => errors.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await p.goto(`http://127.0.0.1:${srv.address().port}/${page}`); await p.waitForTimeout(1500);
  if (page === 'viewer.html') { await p.click('#vRe'); await p.waitForTimeout(500); }  // ビューアは操作するまで止まっている（元からの仕様）
  const a = await p.evaluate(probe); await p.waitForTimeout(1500); const b = await p.evaluate(probe);
  if (shots) await p.screenshot({ path: path.join(shots, page.replace('.html', '.png')) });
  const good = errors.length === 0 && !!a && (page === 'rally.html' || a !== b);
  out[page] = { good, errors: errors.slice(0, 5), a, b }; ok &&= good; await p.close();
}
await browser.close(); srv.close(); console.log(JSON.stringify(out, null, 1)); process.exit(ok ? 0 : 1);
