// チケットの見える化：進行中（7日を超えたら印）と、次に取れるチケット（前が全部済み）を出す。
// 使い方: node tools/tickets.mjs [フォルダ=.] [持ち場=game] [数=8]
import fs from 'node:fs'; import path from 'node:path';
const dir = path.resolve(process.argv[2] || '.'), lane = process.argv[3] || 'game', N = +(process.argv[4] || 8), td = path.join(dir, 'tickets');
const T = {};
for (const f of fs.existsSync(td) ? fs.readdirSync(td).filter(f => /^T\d{3}_.+\.md$/.test(f)).sort() : []) {
  const md = fs.readFileSync(path.join(td, f), 'utf8'), get = k => (md.match(new RegExp(`^- ${k}：(.*)$`, 'm')) || [])[1]?.trim() || '';
  const id = f.slice(0, 4); T[id] = { id, title: md.split('\n')[0].replace(/^# T\d{3} /, ''), st: get('状態'), lane: get('持ち場'), w: get('重さ'), s0: get('始めた日'), kind: get('種類'), rank: get('ランク'), pres: get('前') === 'なし' ? [] : get('前').split(/[、,\s]+/).filter(Boolean) };
}
const all = Object.values(T), days = d => Math.floor((Date.now() - new Date(d + 'T00:00:00+09:00')) / 864e5);
const cnt = ['まだ', '進行中', '済み', '保留', 'やめた'].map(s => `${s} ${all.filter(t => t.st === s).length}`).join('・');
console.log(`チケット ${all.length}枚（${cnt}）`);
const doing = all.filter(t => t.st === '進行中');
if (doing.length) { console.log('進行中'); for (const t of doing) console.log(`- ${t.id} ${t.title}（${t.lane}、${days(t.s0)}日目${days(t.s0) > 7 ? '　← 長い。切るか分ける' : ''}）`); }
const ready = all.filter(t => t.st === 'まだ' && t.lane === lane && t.pres.every(p => ['済み', 'やめた'].includes(T[p]?.st)))
  .sort((a, b) => (a.kind === 'バグ' ? a.rank.charCodeAt(0) - 100 : 0) - (b.kind === 'バグ' ? b.rank.charCodeAt(0) - 100 : 0) || a.id.localeCompare(b.id));
console.log(`次に取れる（${lane}、バグはランク順に先、あとは番号順）`);
for (const t of ready.slice(0, N)) console.log(`- ${t.id} ${t.title}（${t.kind === 'バグ' ? 'バグ' + t.rank + '・' : ''}${t.w}）`);
if (ready.length > N) console.log(`  ほか ${ready.length - N}枚`);
