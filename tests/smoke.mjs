// 起動テスト：ページを開いて、エラーなく動き、Aボタンで先へ進めるかを確かめる。
// 使い方: node tests/smoke.mjs [フォルダ=.] [スクショの保存先]
// 結果はJSONで出す。エラー、読み込み順の問題（宣言前の名前）、ゲームが進まない場合は終了コード1。
// ※ 1ファイル版は全体が { } に包まれていて中が見えないため、このテストは分割後の版で使う。
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const dir = path.resolve(process.argv[2] || '.'), shot = process.argv[3];
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.woff2': 'font/woff2', '.png': 'image/png' };
const srv = http.createServer((q, r) => { const f = path.join(dir, decodeURIComponent(q.url.split('?')[0]).replace(/\/$/, '/index.html'));
  if (!f.startsWith(dir) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
await new Promise(ok => srv.listen(0, ok));
const exe = process.env.CI ? null : ['/usr/bin/google-chrome', '/usr/bin/chromium'].find(fs.existsSync);
const browser = await pw.chromium.launch(exe ? { executablePath: exe } : {});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push('console: ' + m.text()); });
await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());   // 外部フォントは読まない
await page.addInitScript(() => { let s = 12345; Math.random = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32); });
await page.goto(`http://127.0.0.1:${srv.address().port}/`); await page.waitForTimeout(1500);
// 宣言された名前すべての型を記録（分割で読み込み順の問題が出ると、ここが変わる）
const src = fs.readFileSync(path.join(dir, 'index.html'), 'utf8') + (fs.existsSync(path.join(dir, 'js')) ? fs.readdirSync(path.join(dir, 'js')).map(f => fs.readFileSync(path.join(dir, 'js', f), 'utf8')).join('\n') : '');
const names = [...new Set([...src.matchAll(/^(?:const|let|var|function)\s+([A-Za-z_$][\w$]*)/gm)].map(m => m[1]))].sort();
const globals = await page.evaluate(ns => Object.fromEntries(ns.map(n => { try { return [n, eval('typeof ' + n)]; } catch (e) { return [n, 'ERR:' + e.name]; } })), names);
const fontOk = await page.evaluate(async () => { await document.fonts.ready; return document.fonts.check('16px PxFont'); });
if (!fontOk) errors.push('フォント PxFont（css/px.woff2）が読めていない');
const trail = [];
for (let i = 0; i < 40; i++) { await page.keyboard.press('Space'); await page.waitForTimeout(250);
  trail.push(await page.evaluate(() => typeof G === 'object' && G ? `${G.mode}/${G.state}` : 'noG')); }
if (shot) await page.screenshot({ path: shot });
await browser.close(); srv.close();
const res = { ok: errors.length === 0 && !trail.includes('noG') && !Object.values(globals).some(v => v.startsWith('ERR')), errors, states: [...new Set(trail)], globals };
console.log(JSON.stringify(res));
process.exit(res.ok ? 0 : 1);
