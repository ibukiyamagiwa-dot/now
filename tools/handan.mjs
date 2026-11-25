// 判断待ちの一覧：日報の「決めてほしいこと」でまだ決まっていないもの、ゲームへの依頼の「保留」、保留のチケットを並べる。
// 2023-12-29「その日のうちに全てこなす」：判断を待つ時間は、ほかの人を待たせる時間。2024-02-16「決断を先送りにするな」。
// 決めたら、日報のその行の末尾に「→ 決まった：（選んだ案）」を足す。保留の節は状態を直す。
// 使い方: node tools/handan.mjs [フォルダ=.]
import fs from 'node:fs'; import path from 'node:path';
const dir = path.resolve(process.argv[2] || '.'), nd = path.join(dir, 'nippo'), today = new Date(), items = [];
const age = d => Math.floor((today - new Date(d + 'T00:00:00+09:00')) / 864e5);
for (const f of fs.existsSync(nd) ? fs.readdirSync(nd).filter(f => /^\d{4}-\d{2}-\d{2}_.+\.md$/.test(f)).sort() : []) {
  const lines = fs.readFileSync(path.join(nd, f), 'utf8').replace(/\r\n/g, '\n').split('\n'), i = lines.indexOf('## 決めてほしいこと');
  if (i < 0) continue;
  for (let k = i + 1; k < lines.length && !lines[k].startsWith('## '); k++) {
    const l = lines[k]; if (!l.startsWith('- ') || l.trim() === '- なし' || l.includes('→ 決まった')) continue;
    items.push({ d: f.slice(0, 10), from: `nippo/${f}`, s: l.slice(2) });
  }
}
const tdir = path.join(dir, 'tickets');
for (const f of fs.existsSync(tdir) ? fs.readdirSync(tdir).filter(f => /^T\d{3}_.+\.md$/.test(f)).sort() : []) {
  const md = fs.readFileSync(path.join(tdir, f), 'utf8'); if (!/^- 状態：保留$/m.test(md)) continue;
  items.push({ d: null, from: `tickets/${f}`, s: `${md.split('\n')[0].slice(2)}：${(md.match(/^- 決めること：(.*)$/m) || [])[1] || ''}` });
}
const rq = path.join(dir, 'design/GAME_REQUESTS.md');
if (fs.existsSync(rq)) for (const l of fs.readFileSync(rq, 'utf8').split('\n')) {
  const c = l.split('|').map(x => x.trim()); if (c[2] === '保留') items.push({ d: null, from: 'design/GAME_REQUESTS.md', s: `${c[1]}：${c[4]}` });
}
console.log(items.length ? `判断待ち ${items.length}件` : '判断待ちなし');
for (const it of items) console.log(`- ${it.d ? `${age(it.d)}日前 ` : ''}${it.s}（${it.from}）`);
