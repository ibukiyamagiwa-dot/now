// 数値の台帳（js/01-params.js の DEF）と、コードの食いちがいを見つける。ブラウザは使わない。
// 2023-12-12「多くの人がファイルをいじる方法」：同じファイルを何人もいじると、直したものが消える「先祖帰り」が起きる。
// 2022-12-06「調整をしやすくする仕組み」・2023-01-30「パラメーターを【】でくくる」：数値は外に出し、【名前】で誰が見ても分かるようにする。
// 見ること：①キーと【名前】が重なっていない ②コードが読む P.○○ が台帳にある ③台帳の数値がどこかで使われている ④名前が【】でくくられている
// 使い方: node tests/params.mjs [フォルダ=.]
import fs from 'node:fs'; import path from 'node:path';
const dir = path.resolve(process.argv[2] || '.');
const src = fs.readFileSync(path.join(dir, 'js/01-params.js'), 'utf8');
const body = src.slice(src.indexOf('const DEF=['), src.indexOf('\n];', src.indexOf('const DEF=[')));
const defs = [...body.matchAll(/\{k:'([A-Za-z0-9_]+)',n:'([^']*)'/g)].map(m => ({ k: m[1], n: m[2] }));
const code = ['js', 'pages'].flatMap(d => fs.existsSync(path.join(dir, d)) ? fs.readdirSync(path.join(dir, d)).filter(f => f.endsWith('.js')).map(f => [`${d}/${f}`, fs.readFileSync(path.join(dir, d, f), 'utf8')]) : []);
const all = code.map(([, s]) => s).join('\n'), bad = [];
const keys = new Set(defs.map(d => d.k));
const dup = (a, f) => a.map(f).filter((v, i, x) => x.indexOf(v) !== i);
for (const k of dup(defs, d => d.k)) bad.push(`キーが重なっている：${k}`);
for (const n of dup(defs, d => d.n)) bad.push(`【名前】が重なっている：${n}`);
for (const d of defs) if (!/^【[^】]+】/.test(d.n)) bad.push(`名前が【】で始まっていない：${d.k} ${d.n}`);
/* コードが読む数値。P['頭'+…] のように頭だけ書いて組み立てるものは、その頭で始まる数値すべてを使うとみなす */
const prefixes = [...all.matchAll(/\bP\[\s*'([A-Za-z0-9_]+)'\s*\+/g)].map(m => m[1]);
for (const [f, s] of code) for (const m of s.matchAll(/\bP\.([A-Za-z_][A-Za-z0-9_]*)/g))
  if (!keys.has(m[1])) bad.push(`台帳にない数値を読んでいる：${f} の P.${m[1]}`);
/* 使われていない数値：P.キー、'キー'（技のデータの iv:'ivGate2' など）、頭で組み立てる P['頭'+…] のどれでもないもの */
const rest = all.replace(body, '');
for (const d of defs) {
  const used = new RegExp(`\\bP\\.${d.k}\\b|'${d.k}'|"${d.k}"`).test(rest) || prefixes.some(p => d.k.startsWith(p));
  if (!used) bad.push(`どこからも使われていない数値：${d.k} ${d.n}`);
}
console.log(`台帳の数値 ${defs.length}個、読んでいるファイル ${code.length}本`);
for (const b of [...new Set(bad)]) console.log('  × ' + b);
console.log(bad.length ? `食いちがい ${new Set(bad).size}件` : '食いちがいなし');
process.exit(bad.length ? 1 : 0);
