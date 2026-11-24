"""修正前と修正後を並べた比較ページを作る。
使い方: python3 compare.py <修正前のgitの版> <技ID> [技ID ...]
  修正前 = リポジトリ（/home/claude/now）の指定の版の design/v2/*.js、修正後 = この作業フォルダの *.js。
  出力: /home/claude/cmp/（index.html と技ごとのGIF）。中身は毎回入れかえる。"""
import asyncio,base64,io,os,shutil,subprocess,sys,html
from playwright.async_api import async_playwright
from PIL import Image,ImageDraw,ImageFont
REV,IDS=sys.argv[1],sys.argv[2:]
HERE=os.path.dirname(os.path.abspath(__file__));REPO='/home/claude/now';OUT='/home/claude/cmp';TMP='/tmp/cmpsrc'
shutil.rmtree(TMP,ignore_errors=True)
for v in('old','new'):
  os.makedirs(f'{TMP}/{v}');[shutil.copy(f'{HERE}/{f}',f'{TMP}/{v}/') for f in os.listdir(HERE) if f.endswith('.js') or f=='t3.html']
for f in os.listdir(f'{TMP}/old'):
  if f.endswith('.js'):
    r=subprocess.run(['git','-C',REPO,'show',f'{REV}:design/v2/{f}'],capture_output=True)
    if r.returncode==0:open(f'{TMP}/old/{f}','wb').write(r.stdout)
JS="""(ids)=>{const o={};for(const id of ids){const M=MV.find(m=>m.id===id);if(!M){o[id]=null;continue}const h0=M.hits&&M.hits.length?M.hits[0]:20,h1=M.hits&&M.hits.length?M.hits[M.hits.length-1]:M.len-40;const t0=Math.max(0,h0-34),t1=Math.min(M.len-1,h1+36);const fr=[];for(let t=t0;t<=t1;t++){const c=document.createElement('canvas');c.width=CW;c.height=CH;const x=c.getContext('2d');bgFill(x,M.bg);const B=frame(M,t);const im=x.getImageData(0,0,CW,CH);for(let i=0;i<B.c.length;i++){if(!B.c[i])continue;const[r,g,b]=rgb(B.c[i]);im.data[i*4]=r;im.data[i*4+1]=g;im.data[i*4+2]=b}x.putImageData(im,0,0);fr.push(c.toDataURL())}o[id]={t0,hits:M.hits||[],n:M.n,cap:M.cap||'',fr}}return o}"""
async def get(v):
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page();await pg.goto(f'file://{TMP}/{v}/t3.html');await pg.wait_for_timeout(300);r=await pg.evaluate(JS,IDS);await b.close();return r
old,new=asyncio.run(get('old')),asyncio.run(get('new'))
shutil.rmtree(OUT,ignore_errors=True);os.makedirs(OUT)
F=ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc',22);S=3;secs=[]
for id in IDS:
  o,n=old[id] or new[id],new[id]
  def img(d,i):i=min(i,len(d['fr'])-1);return Image.open(io.BytesIO(base64.b64decode(d['fr'][i].split(',')[1]))).convert('RGB').resize((136*S,118*S),Image.NEAREST)
  fs=[]
  for i in range(max(len(o['fr']),len(n['fr']))):
    W=Image.new('RGB',(136*S*2+12,118*S+40),(17,17,17));W.paste(img(o,i),(0,34));W.paste(img(n,i),(136*S+12,34));d=ImageDraw.Draw(W)
    d.text((8,4),'修正前',fill=(200,120,120),font=F);d.text((136*S+20,4),'修正後',fill=(140,210,150),font=F);t=n['t0']+i;d.text((136*S*2-120,4),f'{t}F',fill=(150,150,150),font=F)
    if any(h<=t<h+3 for h in n['hits']):d.text((136*S*2-60,4),'当',fill=(255,220,120),font=F)
    fs.append(W.convert('P',palette=Image.ADAPTIVE,colors=128))
  fs[0].save(f'{OUT}/{id}.gif',save_all=True,append_images=fs[1:],duration=40,loop=0,optimize=True)
  secs.append(f'<section><h2>{html.escape(n["n"])}</h2><p class="n">{html.escape(n["cap"])}</p><img src="{id}.gif" alt="{html.escape(n["n"])}の比較"></section>')
open(f'{OUT}/index.html','w').write('<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>修正前と修正後</title><style>body{margin:0;background:#111;color:#e8e8e8;font-family:"Hiragino Sans","Noto Sans JP",sans-serif;line-height:1.6}main{max-width:860px;margin:0 auto;padding:20px 14px 60px}h1{font-size:20px;margin:0 0 6px}p.lead{color:#aaa;font-size:14px;margin:0 0 22px}section{margin:0 0 30px}h2{font-size:16px;margin:0 0 4px}p.n{color:#bbb;font-size:13px;margin:0 0 8px}img{width:100%;height:auto;image-rendering:pixelated;border-radius:6px;display:block}</style></head><body><main><h1>修正前と修正後</h1><p class="lead">左が修正前、右が修正後。同じフレームを並べ、約2/5の速さでくり返し再生。右上はフレーム、「当」は当たりの瞬間。説明文は修正後のもの。</p>'+''.join(secs)+'</main></body></html>')
print('\n'.join(sorted(os.listdir(OUT))))
