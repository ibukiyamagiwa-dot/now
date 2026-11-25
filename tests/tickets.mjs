// チケット（tickets/）の形と、依頼の一覧（design/GAME_REQUESTS.md）とのずれを見る。2023-04-11「チケットでタスク管理」。
// 見ること：①名前と1行目のID ②決まった項目と値（状態・種類・重さ・持ち場） ③節が依頼に実在する ④前のIDが実在し、輪になっていない
//   ⑤進行中には始めた日、済みには済んだ日 ⑥保留には「決めること：… 案：」 ⑦バグにはランク（A/B/C）
//   ⑧依頼の一覧の状態と合っている：チケットが全部済み（やめたを除く）なら節は済み、どれかが進行中か済みなら節は途中か済み、節が済みならチケットも全部済みかやめた
// 使い方: node tests/tickets.mjs [フォルダ=.]
import fs from 'node:fs'; import path from 'node:path';
const dir = path.resolve(process.argv[2] || '.'), td = path.join(dir, 'tickets');
const ST = ['まだ', '進行中', '済み', '保留', 'やめた'], KIND = ['作業', 'バグ'], W = ['小', '中', '大'], LANE = ['game', 'design', 'other'];
const rq = fs.readFileSync(path.join(dir, 'design/GAME_REQUESTS.md'), 'utf8');
const secs = new Set([...rq.matchAll(/^## (.+)$/gm)].map(m => m[1].trim()));
const secSt = {}; for (const l of rq.split('\n')) { const c = l.split('|').map(x => x.trim()); if (c.length > 4 && secs.has(c[1])) secSt[c[1]] = c[2]; }
const files = fs.existsSync(td) ? fs.readdirSync(td).filter(f => /^T\d+/.test(f)).sort() : [];
const bad = [], T = {};
for (const f of files) {
  const m = f.match(/^(T\d{3})_.+\.md$/); if (!m) { bad.push(`${f}：名前は T001_題.md`); continue; }
  const id = m[1], md = fs.readFileSync(path.join(td, f), 'utf8').replace(/\r\n/g, '\n');
  if (!md.startsWith(`# ${id} `)) bad.push(`${f}：1行目は「# ${id} 題」`);
  const get = k => { const r = md.match(new RegExp(`^- ${k}：(.*)$`, 'm')); return r ? r[1].trim() : null; };
  const t = { f, st: get('状態'), kind: get('種類'), w: get('重さ'), lane: get('持ち場'), sec: get('節'), pre: get('前'), s0: get('始めた日'), s1: get('済んだ日'), rank: get('ランク'), q: get('決めること') };
  if (T[id]) bad.push(`${f}：ID ${id} が重なっている`); T[id] = t;
  if (!ST.includes(t.st)) bad.push(`${f}：状態は ${ST.join('・')}（今は ${t.st}）`);
  if (!KIND.includes(t.kind)) bad.push(`${f}：種類は ${KIND.join('・')}`);
  if (!W.includes(t.w)) bad.push(`${f}：重さは ${W.join('・')}`);
  if (!LANE.includes(t.lane)) bad.push(`${f}：持ち場は ${LANE.join('・')}`);
  if (t.sec == null || t.pre == null || t.s0 == null || t.s1 == null) bad.push(`${f}：節・前・始めた日・済んだ日の行がそろっていない`);
  if (!/^## すること$/m.test(md) || !/^## 済みの条件$/m.test(md)) bad.push(`${f}：見出し「すること」「済みの条件」がない`);
  t.secs = !t.sec || t.sec === 'なし' ? [] : t.sec.split('／').map(x => x.trim());
  for (const s of t.secs) if (!secs.has(s)) bad.push(`${f}：節「${s}」が依頼にない`);
  t.pres = !t.pre || t.pre === 'なし' ? [] : t.pre.split(/[、,\s]+/).filter(Boolean);
  if (t.st === '進行中' && !/^\d{4}-\d{2}-\d{2}$/.test(t.s0 || '')) bad.push(`${f}：進行中なのに始めた日（YYYY-MM-DD）がない`);
  if (t.st === '済み' && !/^\d{4}-\d{2}-\d{2}$/.test(t.s1 || '')) bad.push(`${f}：済みなのに済んだ日（YYYY-MM-DD）がない`);
  if (t.st === '保留' && !(t.q && t.q.includes('案：'))) bad.push(`${f}：保留なのに「- 決めること：… 案：…」がない`);
  if (t.kind === 'バグ' && !['A', 'B', 'C'].includes(t.rank)) bad.push(`${f}：バグにはランク（A/B/C）をつける`);
}
for (const [id, t] of Object.entries(T)) {
  for (const p of t.pres) if (!T[p]) bad.push(`${t.f}：前の ${p} がない`);
  const seen = new Set(), walk = x => { if (x === id && seen.size) return true; if (seen.has(x) || !T[x]) return false; seen.add(x); return T[x].pres.some(walk); };
  if (t.pres.some(walk)) bad.push(`${t.f}：前が輪になっている`);
}
const bySec = {}; for (const t of Object.values(T)) for (const s of t.secs) (bySec[s] ||= []).push(t);
for (const [s, ts] of Object.entries(bySec)) {
  const st = secSt[s], live = ts.filter(t => t.st !== 'やめた'), done = live.length && live.every(t => t.st === '済み'), moving = ts.some(t => ['進行中', '済み'].includes(t.st));
  if (done && st !== '済み') bad.push(`節「${s}」：チケットが全部済みなのに、一覧の状態が ${st}（済みにする）`);
  else if (moving && !['途中', '済み'].includes(st)) bad.push(`節「${s}」：チケットが動いているのに、一覧の状態が ${st}（途中にする）`);
  if (st === '済み' && !done) bad.push(`節「${s}」：一覧は済みなのに、済んでいないチケットがある`);
}
const cnt = ST.map(s => `${s} ${Object.values(T).filter(t => t.st === s).length}`).join('・');
console.log(`チケット ${files.length}枚（${cnt}）`);
for (const b of bad) console.log('  × ' + b);
console.log(bad.length ? `くずれ ${bad.length}件` : 'くずれなし');
process.exit(bad.length ? 1 : 0);
