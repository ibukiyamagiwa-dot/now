// 日報の「今日の1枚」を撮る（2023-06-26「日報のすすめ」：日報の最初に開発中の画面を1枚貼る）。
// ゲームの時間を止めて、場面を作ってから、ゲームの画面（#cv）だけを撮る。
// 使い方: node tools/ichimai.mjs 出力.png [ページ=/] [場面を作るJS]
//   例: node tools/ichimai.mjs nippo/2026-11-25_game.png / "startPractice('samuraiB');G.card=null;for(let i=0;i<90;i++)tick()"
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const dir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const [out, pg = '/', js = ''] = process.argv.slice(2);
if (!out) { console.log('使い方: node tools/ichimai.mjs 出力.png [ページ=/] [場面を作るJS]'); process.exit(1); }
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.woff2': 'font/woff2', '.png': 'image/png' };
const srv = http.createServer((q, r) => { const f = path.join(dir, decodeURIComponent(q.url.split('?')[0]).replace(/\/$/, '/index.html'));
  if (!f.startsWith(dir) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
await new Promise(ok => srv.listen(0, ok));
const exe = process.env.CI ? null : ['/usr/bin/google-chrome', '/usr/bin/chromium'].find(fs.existsSync);
const browser = await pw.chromium.launch(exe ? { executablePath: exe } : {});
const page = await browser.newPage({ viewport: { width: 960, height: 600 } }), errs = [];
page.on('pageerror', e => errs.push(e.message));
await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
await page.addInitScript(() => { let s = 12345; Math.random = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32); });
await page.goto(`http://127.0.0.1:${srv.address().port}${pg}`); await page.waitForTimeout(800);
await page.evaluate(code => { window.VSPD = 0; try { closeMenu() } catch (e) {} if (code) (0, eval)(code); draw(); }, js);
await page.locator('#cv').screenshot({ path: out });
await browser.close(); srv.close();
if (errs.length) { console.log('ページのエラー：\n' + errs.join('\n')); process.exit(1); }
console.log(`${out}（${Math.round(fs.statSync(out).size / 1024)}KB）`);
