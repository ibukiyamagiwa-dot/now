# ステージの背景を点検する（背景の約束2・3。design/stages.md）
# 使い方: python3 audit_stage.py [組…]
#   覚悟の段ごとに、その段に出る敵と主人公を背景に立たせて、輪郭の差と合図の余白を出す。不合格があれば終了コード1。
#   組は敵の key（gate・dgate…）か、組の名前（門・赤・竜・影・居合・小鬼・からくり・イノシシ・主人公）。指定すると、その敵（主人公なら主人公）の行だけを見る。
#   点検する組の表は stage2.js の stageAuditList（資料集のページと同じもの）。
import asyncio,sys,os
from playwright.async_api import async_playwright
SRC=os.path.dirname(os.path.abspath(__file__))
GROUPS={'門':['gate','dgate','lord','lord2'],'赤':['red','red2','fallen','fallen2'],'竜':['dragon','hydra'],'影':['shade','shadeM'],
 '居合':['samurai','samuraiM'],'小鬼':['imp','impM'],'からくり':['doll','dollM'],'イノシシ':['boar','boarM'],'主人公':['hero']}
JS=r"""()=>({aud:AUD,rows:stageAudit(stageAuditList()).map(r=>({ok:stageOk(r),K:r.K,st:r.st,key:r.w,w:r.ttl,edge:+r.edge.toFixed(1),core:+r.core.toFixed(1),cue:+r.cue.toFixed(1)}))})"""
def keys(args):
  ks=set()
  for a in args:ks.update(GROUPS.get(a,[a]))
  return ks
async def main():
  want=keys(sys.argv[1:])
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page();await pg.goto(f'file://{SRC}/t3.html');await pg.wait_for_timeout(300)
    r=await pg.evaluate(JS);await b.close()
  A=r['aud'];rows=r['rows']
  if want:rows=[x for x in rows if x['key'] in want]
  bad=0
  for x in rows:
    ok=x['ok'];bad+=not ok
    print(f"{'  ' if ok else '× '}覚悟{x['K']} {x['st']:<16}{x['w']:<14} 輪郭の差 {x['edge']:5.1f}  芯の差 {x['core']:5.1f}  合図の余白 {x['cue']:5.1f}")
  print(f"{len(rows)}組のうち不合格 {bad}（輪郭の差 {A['edge']} 以上〈例外：{A['ex']}〉、合図の余白 {A['cue']} 以上で合格。主人公は芯の差 {A['edge']} 以上）");sys.exit(1 if bad else 0)
asyncio.run(main())
