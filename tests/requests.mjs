// ゲームへの依頼（design/GAME_REQUESTS.md）の「一覧（進み具合）」と、各節がずれていないかを見る。
// 2023-04-11「チケットでタスク管理」：やることと、どこまで済んだかを見えるようにする。一覧に漏れがあると、見えないやり残しになる。
// 見ること：①どの節にも一覧の行がある ②一覧の行がどれかの節を指している ③状態が決めた言葉のどれか ④「途中」には入ったものと残りが書いてある
// 使い方: node tests/requests.mjs [フォルダ=.]
import fs from 'node:fs'; import path from 'node:path';
const dir = path.resolve(process.argv[2] || '.');
const md = fs.readFileSync(path.join(dir, 'design/GAME_REQUESTS.md'), 'utf8').replace(/\r\n/g, '\n');
const SKIP = ['入れ方', '一覧（進み具合）'], STATES = ['済み', '途中', 'まだ', '保留', 'やめた', '決まり'];
const heads = md.split('\n').filter(l => l.startsWith('## ')).map(l => l.slice(3).trim()).filter(h => !SKIP.includes(h));
const sec = md.slice(md.indexOf('## 一覧（進み具合）'), md.indexOf('\n## ', md.indexOf('## 一覧（進み具合）') + 5));
const rows = sec.split('\n').filter(l => l.startsWith('| ') && !l.startsWith('| 節 ') && !l.startsWith('| ---')).map(l => l.split('|').slice(1, -1).map(c => c.trim()));
const bad = [], names = rows.map(r => r[0]);
for (const h of heads) if (!names.includes(h)) bad.push(`一覧に行がない節：${h}`);
for (const [n, st, got, rest] of rows) {
  if (!heads.includes(n)) bad.push(`一覧の行が指す節がない：${n}`);
  if (!STATES.includes(st)) bad.push(`状態が決めた言葉でない：${n}「${st}」（${STATES.join('・')}）`);
  if (st === '途中' && (!got || !rest)) bad.push(`「途中」なのに、入ったものか残りが空：${n}`);
}
const count = Object.fromEntries(STATES.map(s => [s, rows.filter(r => r[1] === s).length]).filter(([, n]) => n));
console.log(`節 ${heads.length}、一覧の行 ${rows.length}（${Object.entries(count).map(([s, n]) => `${s} ${n}`).join('・')}）`);
for (const b of bad) console.log('  × ' + b);
console.log(bad.length ? `ずれ ${bad.length}件` : 'ずれなし');
process.exit(bad.length ? 1 : 0);
