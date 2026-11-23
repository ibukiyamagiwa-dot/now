# 打ち合い道場ページを本編から作る（同じコード。フラグと見出しだけ変える）
import os,sys
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
s=open(os.path.join(ROOT,'index.html'),encoding='utf-8').read()
for o,n in [("const RP_PAGE=false;","const RP_PAGE=true;"),("<h1>いまだ！　試作</h1>","<h1>いまだ！　打ち合い道場</h1>"),("<title>パリィRPG 試作</title>","<title>いまだ！ 打ち合い道場</title>")]:
    assert s.count(o)==1,o;s=s.replace(o,n)
open(os.path.join(ROOT,'rally.html'),'w',encoding='utf-8').write(s);print('built rally.html')
