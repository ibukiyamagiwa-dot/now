// 日報（nippo/）の形を見る。2023-06-26「日報のすすめ」・2022-11-28「チームの情報共有」：毎日、画面1枚と3〜5個の話題を書き、全員が読む。
// 2024-02-16「決断を先送りにするな」：決めてほしいことには、選べる案を必ず添える（決める人がその場で選べるように）。
// 見ること：①ファイル名が 日付_持ち場.md ②1行目が「# 日付 …」 ③今日の1枚が同じ名前の .png で、ファイルがある
//   ④見出しが したこと・決めたこと・困ったこと・決めてほしいこと・次 の順にある ⑤したことは1〜5個
//   ⑥決めてほしいことの各行に「案：」がある（「なし」と、「→ 決まった」がついた行は除く）
// 使い方: node tests/nippo.mjs [フォルダ=.]
import fs from 'node:fs'; import path from 'node:path';
const dir = path.resolve(process.argv[2] || '.'), nd = path.join(dir, 'nippo');
const HEADS = ['したこと', '決めたこと', '困ったこと', '決めてほしいこと', '次'], LANES = ['game', 'design', 'other'];
const files = fs.existsSync(nd) ? fs.readdirSync(nd).filter(f => f.endsWith('.md') && f !== 'README.md').sort() : [];
const bad = [];
for (const f of files) {
  const m = f.match(/^(\d{4}-\d{2}-\d{2})_([a-z]+)\.md$/);
  if (!m || !LANES.includes(m[2])) { bad.push(`${f}：名前は 日付_持ち場.md（持ち場は ${LANES.join('・')}）`); continue; }
  const md = fs.readFileSync(path.join(nd, f), 'utf8').replace(/\r\n/g, '\n'), lines = md.split('\n');
  if (!lines[0].startsWith(`# ${m[1]} `)) bad.push(`${f}：1行目は「# ${m[1]} 持ち場の名前」`);
  const png = f.replace(/\.md$/, '.png');
  if (!md.includes(`](${png})`)) bad.push(`${f}：今日の1枚 ![…](${png}) がない`);
  else if (!fs.existsSync(path.join(nd, png))) bad.push(`${f}：${png} のファイルがない`);
  const hs = lines.filter(l => l.startsWith('## ')).map(l => l.slice(3).trim());
  if (hs.join('/') !== HEADS.join('/')) bad.push(`${f}：見出しは ${HEADS.join('・')} の順（今は ${hs.join('・') || 'なし'}）`);
  const sec = h => { const i = lines.indexOf('## ' + h); if (i < 0) return []; const j = lines.findIndex((l, k) => k > i && l.startsWith('## ')); return lines.slice(i + 1, j < 0 ? undefined : j).filter(l => l.startsWith('- ')); };
  const did = sec('したこと');
  if (did.length < 1 || did.length > 5) bad.push(`${f}：したことは1〜5個（今は ${did.length}個）。多いときはまとめる`);
  for (const l of sec('決めてほしいこと')) if (l.trim() !== '- なし' && !l.includes('→ 決まった') && !l.includes('案：')) bad.push(`${f}：決めてほしいことに案がない：${l.slice(2, 40)}…`);
}
console.log(`日報 ${files.length}本`);
for (const b of bad) console.log('  × ' + b);
console.log(bad.length ? `形のくずれ ${bad.length}件` : '形のくずれなし');
process.exit(bad.length ? 1 : 0);
