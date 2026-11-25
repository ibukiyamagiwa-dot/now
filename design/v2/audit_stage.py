# ステージの背景を点検する（背景の約束2・3。design/stages.md）
# 使い方: python3 audit_stage.py   … 覚悟の段ごとに、その段に出る敵を背景に立たせて、輪郭の差と合図の余白を出す。不合格があれば終了コード1
import asyncio,json,sys,os
from playwright.async_api import async_playwright
SRC=os.path.dirname(os.path.abspath(__file__))
JS=r"""()=>{const L=[];for(let K=0;K<5;K++)L.push({K,s:{st:'maze',k2:1,n:'迷宮の階'},who:ROSTER[K]});
 const S=id=>STAGES.find(x=>x.id===id);L.push({K:0,s:S('s_gate'),who:['gate']},{K:3,s:S('s_gate_k'),who:['dgate']},{K:4,s:S('s_gate_k'),who:['dgate']});
 for(let K=1;K<5;K++)L.push({K,s:S('s_mon'),who:['dragon']});for(let K=2;K<4;K++)L.push({K,s:S('s_monh'),who:['hydra']});
 for(const id of ['s_lord','s_lord2','s_red','s_red2','s_hole','s_hole2'])L.push({K:4,s:S(id),who:S(id).who.map(w=>w[0])});
 return {aud:AUD,rows:stageAudit(L).map(r=>({K:r.K,st:r.st,w:r.ttl,edge:+r.edge.toFixed(1),core:+r.core.toFixed(1),cue:+r.cue.toFixed(1)}))}}"""
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page();await pg.goto(f'file://{SRC}/t3.html');await pg.wait_for_timeout(300)
    r=await pg.evaluate(JS);await b.close()
  A=r['aud'];bad=0
  for x in r['rows']:
    ok=x['edge']>=A['ex'].get(x['st'],A['edge']) and x['cue']>=A['cue'];bad+=not ok
    print(f"{'  ' if ok else '× '}覚悟{x['K']} {x['st']:<12}{x['w']:<14} 輪郭の差 {x['edge']:5.1f}  芯の差 {x['core']:5.1f}  合図の余白 {x['cue']:5.1f}")
  print(f"{len(r['rows'])}組のうち不合格 {bad}（輪郭の差 {A['edge']} 以上〈例外：{A['ex']}〉、合図の余白 {A['cue']} 以上で合格）");sys.exit(1 if bad else 0)
asyncio.run(main())
