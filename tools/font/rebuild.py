# ゲームで使う文字だけを含むフォント css/px.woff2 を作り直す。文字を増やしたら実行する。
# 必要：pip install fonttools brotli
import os, glob, subprocess, tempfile
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
HERE = os.path.dirname(os.path.abspath(__file__))
src = [os.path.join(ROOT, 'index.html'), os.path.join(ROOT, 'css', 'style.css')] + sorted(glob.glob(os.path.join(ROOT, 'js', '*.js'))) + sorted(glob.glob(os.path.join(ROOT, 'pages', '*.js')))
text = ''.join(open(p, encoding='utf-8').read() for p in src if os.path.exists(p))
chars = set(c for c in text if ord(c) > 127) | set(chr(i) for i in range(32, 127)) | set('０１２３４５６７８９：／（）！？・…ー〜「」『』、。●○◎✕▲▼▶◀←→↑↓＋−×％')
ct = os.path.join(tempfile.mkdtemp(), 'chars.txt'); open(ct, 'w', encoding='utf-8').write(''.join(sorted(chars)))
out = os.path.join(ROOT, 'css', 'px.woff2')
subprocess.run(['pyftsubset', os.path.join(HERE, 'DotGothic16.ttf'), '--text-file=' + ct, '--flavor=woff2', '--output-file=' + out, '--layout-features=*'], check=True)
print(len(chars), 'chars', os.path.getsize(out) // 1024, 'KB')
