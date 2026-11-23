# 本編 index.html から、道場・ビューア・演出くらべの3ページを作る。ゲームを直したら毎回実行する。
# 3ページとも本編と同じ css/ と js/ を読む。違うのは、見出し・タイトルと、
#   - 本編より前に置く window.PAGE（どのページかの印。js/08-dojo.js の RP_PAGE がこれを見る）
#   - 本編のあとに読む pages/<名前>.js（ビューアや演出くらべの操作パネル）
# だけ。本編の中身を文字列置換で書きかえることはしない。
import os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
PAGES = [  # ファイル名, PAGEの値, タイトル, 見出し, 後から読むJS
    ('rally.html', 'rally', 'いまだ！ 打ち合い道場', 'いまだ！　打ち合い道場', None),
    ('viewer.html', 'viewer', 'いまだ！ モーション・演出ビューア', None, 'pages/viewer.js'),
    ('ukprev.html', 'ukprev', 'いまだ！ 打ち返しの演出くらべ', None, 'pages/ukprev.js'),
]
def one(s, pat, new):
    n = len(re.findall(pat, s)); assert n == 1, (pat, n); return re.sub(pat, lambda m: new, s)
first = re.search(r'<script src="js/[^"]+"></script>', src).group(0)
last = re.findall(r'<script src="js/[^"]+"></script>', src)[-1]
for fn, page, title, h1, js in PAGES:
    s = one(src, r'<title>[^<]*</title>', f'<title>{title}</title>')
    s = re.sub(r'\n<meta property="og:[^\n]*', '', s)  # 共有用の情報は本編だけ
    if h1: s = one(s, r'<h1>[^<]*</h1>', f'<h1>{h1}</h1>')
    s = s.replace(first, f'<script>var PAGE={page!r};</script>\n' + first, 1)
    if js: s = s.replace(last, last + f'\n<script src="{js}"></script>', 1)
    open(os.path.join(ROOT, fn), 'w', encoding='utf-8').write(s); print('built', fn)
