# 予兆の瞬間の敵の絵を、同じ敵の技どうしで比べる（いちばん大事な原則の点検）
# 使い方: python3 audit_stance.py [しきい値=400]  … 一度に来る数や間がちがうのに、予兆の瞬間の絵がほぼ同じ組を出す（差の画素数が小さい順）
import asyncio,json,sys
from playwright.async_api import async_playwright
import os
SRC=os.path.dirname(os.path.abspath(__file__))
JS=r"""()=>{const out={};const ids=new Set(Object.values(MOVES_OF).flat());
for(const M of MV){if(!ids.has(M.id)||!M.hits||!M.hits.length)continue;const c0=(M.cues&&M.cues.length)?Math.min(...M.cues.map(c=>c.t)):Math.max(0,M.hits[0]-28);
 const save={cues:M.cues,hits:M.hits,trails:M.trails,noHero:M.noHero};M.cues=[];M.hits=[];M.trails=[];M.noHero=true;
 const imgs=[];for(const dt of[-6,0]){const t=Math.max(0,c0+dt);const B=frame(M,t);const a=[];for(let i=0;i<B.c.length;i++)a.push(B.t[i]&&B.t[i]!==6?B.c[i]:0);imgs.push(a)}
 Object.assign(M,save);
 const hs=M.hits.slice().sort((a,b)=>a-b);out[M.id]={f:M.f,n:M.n,c0,hits:hs,gaps:hs.slice(1).map((h,i)=>h-hs[i]),cols:(M.cues||[]).map(c=>c.col).join(''),imgs}}
return out}"""
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page();await pg.goto(f'file://{SRC}/t3.html');await pg.wait_for_timeout(300)
    r=await pg.evaluate(JS);await b.close()
  by={}
  for k,v in r.items():by.setdefault(v['f'],[]).append((k,v))
  res=[]
  for f,L in by.items():
    for i in range(len(L)):
      for j in range(i+1,len(L)):
        a,b=L[i][1],L[j][1]
        if len(a['hits'])==len(b['hits']) and all(abs(x-y)<=2 for x,y in zip(a['gaps'],b['gaps'])):continue
        d=min(sum(1 for x,y in zip(a['imgs'][q],b['imgs'][q]) if x!=y) for q in (1,))
        d6=sum(1 for x,y in zip(a['imgs'][0],b['imgs'][0]) if x!=y)
        res.append((d,d6,f,L[i][0],a['n'],a['cols'],a['gaps'],L[j][0],b['n'],b['cols'],b['gaps']))
  res.sort()
  for x in res:
    if x[0]<int(sys.argv[1] if len(sys.argv)>1 else 400):print(x)
asyncio.run(main())
