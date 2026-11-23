# ゲームの文字だけを含むフォントを作り直し、index.html に埋めこむ。文字を増やしたら実行する。
# 必要：pip install fonttools brotli
import base64,re,subprocess,os,tempfile
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
HERE=os.path.dirname(os.path.abspath(__file__))
p=os.path.join(ROOT,'index.html');s=open(p,encoding='utf-8').read()
s2=re.sub(r'url\(data:font/woff2;base64,[A-Za-z0-9+/=]+\)','url(X)',s)
chars=set(c for c in s2 if ord(c)>127)|set(chr(i) for i in range(32,127))|set('０１２３４５６７８９：／（）！？・…ー〜「」『』、。●○◎✕▲▼▶◀←→↑↓＋−×％')
tmp=tempfile.mkdtemp();ct=os.path.join(tmp,'chars.txt');out=os.path.join(tmp,'px.woff2')
open(ct,'w',encoding='utf-8').write(''.join(sorted(chars)))
subprocess.run(['pyftsubset',os.path.join(HERE,'DotGothic16.ttf'),'--text-file='+ct,'--flavor=woff2','--output-file='+out,"--layout-features=*"],check=True)
b64=base64.b64encode(open(out,'rb').read()).decode()
s=re.sub(r'url\(data:font/woff2;base64,[A-Za-z0-9+/=]+\)','url(data:font/woff2;base64,'+b64+')',s,count=1)
open(p,'w',encoding='utf-8').write(s);print(len(chars),'chars',len(b64)//1024,'KB b64')
