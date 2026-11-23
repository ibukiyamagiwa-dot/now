# ページを開いてスクリーンショットを撮る（見た目の確認用）。
# 使い方: python3 tools/shot.py ページ.html 出力.png [実行するJS] [幅] [高さ]
# 必要：pip install playwright && playwright install chromium
import sys,asyncio,os
from playwright.async_api import async_playwright
async def main(url,out,js,w,h):
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':w,'height':h})
    msgs=[];pg.on('console',lambda m:msgs.append(m.text));pg.on('pageerror',lambda e:msgs.append('ERR '+str(e)))
    await pg.goto(url if '://' in url else 'file://'+os.path.abspath(url));await pg.wait_for_timeout(300)
    if js: await pg.evaluate(js); await pg.wait_for_timeout(200)
    await pg.screenshot(path=out,full_page=True);print('\n'.join(msgs[:20]));await b.close()
a=sys.argv;asyncio.run(main(a[1],a[2],a[3] if len(a)>3 else '',int(a[4]) if len(a)>4 else 1024,int(a[5]) if len(a)>5 else 576))
