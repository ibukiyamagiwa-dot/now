#!/usr/bin/env python3
"""index.html（1ファイル版）を css/ と js/ に分ける。何度でも再実行できる。
使い方: python3 tools/split.py 元のindex.html 出力先フォルダ
スクリプトは「/* ===== 見出し」の行で切り、順番はそのまま。中身は、全体を包む外側の { } を外す以外は1文字も変えない。"""
import re, sys, pathlib

SLUG = [  # 見出しの頭の言葉 → ファイル名
 ('パラメーター表','params'),('音（','sfx'),('敵データ','enemies'),('門のぬし','boss-lord'),
 ('深淵の目','abyss-eye'),('赤い騎士','boss-red'),('黒い門番','boss-gatek'),('打ち合い道場','dojo'),
 ('打ち合い（','rally'),('門番の運命','fate'),('BGM','bgm'),('技の書','unlocks'),('1周の中の強化','upgrades'),
 ('状態','state'),('チュートリアル','tutorial'),('一言ヒント','tips-records'),('技の練習','practice'),
 ('解説カード','cards'),('演出の部品','fx'),('自分の行動','hero'),('敵の行動','enemy-turn'),('とどめ','ko'),
 ('ループ','loop'),('描画','draw'),('タイトルとメニュー','menu'),('入力','input'),('開発者ページ','dev'),('起動','boot'),
]

def slug(head):
    t = head.split('=====',1)[1].strip()
    for k, v in SLUG:
        if t.startswith(k): return v
    raise SystemExit('名前の決まっていない見出し: ' + head[:60] + '\n→ tools/split.py の SLUG に足す')

def main(src, out):
    s = pathlib.Path(src).read_text(encoding='utf-8')
    out = pathlib.Path(out); (out/'js').mkdir(parents=True, exist_ok=True); (out/'css').mkdir(exist_ok=True)
    for f in (out/'js').glob('*.js'): f.unlink()
    st = re.findall(r'<style>([\s\S]*?)</style>', s); sc = re.findall(r'<script>([\s\S]*?)</script>', s)
    assert len(st) == 1 and len(sc) == 1, 'styleとscriptが1つずつである前提'
    (out/'css'/'style.css').write_text(st[0], encoding='utf-8')
    body = sc[0]
    # 元は全体が { … } のブロックに包まれている。ファイルをまたいで名前を共有するため、外側の括弧だけ外す
    m = re.fullmatch(r'(\s*)\{\n([\s\S]*)\n\}(\s*)', body)
    if m: body = m.group(2)
    lines = body.split('\n'); cuts = [0] + [i for i, l in enumerate(lines) if l.startswith('/* =====')] + [len(lines)]
    names, chunks = [], []
    for n, (a, b) in enumerate(zip(cuts, cuts[1:])):
        if a == b: continue
        name = 'base' if n == 0 else slug(lines[a])
        big = [i for i in range(a, b) if len(lines[i]) > 3000]  # 絵のデータなど巨大な行
        parts = [(a, big[-1] + 1, name + '-data'), (big[-1] + 1, b, name)] if big and b - big[-1] > 50 else [(a, b, name)]
        for x, y, nm in parts:
            names.append(f'{len(names):02d}-{nm}.js'); chunks.append('\n'.join(lines[x:y]))
    # 元の script の中身＝各ファイルを '\n' でつないだもの（往復で一致することを保証）
    assert '\n'.join(chunks) == body
    for nm, ch in zip(names, chunks): (out/'js'/nm).write_text(ch + '\n', encoding='utf-8')
    tags = '\n'.join(f'<script src="js/{nm}"></script>' for nm in names)
    html = s.replace('<style>'+st[0]+'</style>', '<link rel="stylesheet" href="css/style.css">', 1)
    html = html.replace('<script>'+sc[0]+'</script>', tags, 1)
    (out/'index.html').write_text(html, encoding='utf-8')
    print(len(names), 'files:', ' '.join(names))

if __name__ == '__main__': main(*sys.argv[1:3])
