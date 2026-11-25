# 予兆の瞬間の敵の絵を、同じ敵の技どうしで比べる（いちばん大事な原則の点検）
# 使い方: python3 audit_stance.py [組…] [--th=400] [-v]
#   一度に来る数や間がちがうのに、予兆の瞬間の絵がほぼ同じ組（差の画素数がしきい値より小さい組）を出す。例外を除いて残った組があれば終了コード1。
#   組は敵の key（gate・dgate…）か、組の名前（門・赤・竜・影・居合・小鬼・からくり・イノシシ）。指定しなければ全員。
#   -v で、例外の表で除いた組も理由つきで出す。
#   古い使い方（最初の引数に数だけ書く＝しきい値）も通る。
import asyncio,sys,os,re
from playwright.async_api import async_playwright
SRC=os.path.dirname(os.path.abspath(__file__))
GROUPS={'門':['gate','dgate','lord','lord2'],'赤':['red','red2','fallen','fallen2'],'竜':['dragon','hydra'],'影':['shade','shadeM'],
 '居合':['samurai','samuraiM'],'小鬼':['imp','impM'],'からくり':['doll','dollM'],'イノシシ':['boar','boarM']}
# 例外の表：design/DECISIONS.md の「いちばん大事な原則」に名前と理由を書いたものだけを置く（書いていないものは例外ではない）。
# どちらかの技がここに当たる組は、点検から除く。（理由, 当たるかを決める関数）
EXC=[
 ('フェイント（紫の輪）：ふりは本物と同じ構え。紫の輪で読む', lambda m:'p' in m['cols']),
 ('残心に手を出す：二撃目は、こちらが手を出したときだけ来る', lambda m:'zanpunish' in m['id']),
 ('居合の待つ長さ：構えてから光るまでを揺らす', lambda m:m['id'] in ('sm_iai','smM_iai')),
 ('からくり人形の拍の速さ：同じ技・同じ構えのまま拍が速くなる', lambda m:m['id']=='dl_fast'),
 ('打ち合い（金）：打ち合いの中の合で、軌跡の形と金の合図で読む', lambda m:m['n'].startswith('打ち合い')),
]
JS=r"""()=>{const out={};const ids=new Set(Object.values(MOVES_OF).flat());
for(const M of MV){if(!ids.has(M.id)||!M.hits||!M.hits.length)continue;const c0=(M.cues&&M.cues.length)?Math.min(...M.cues.map(c=>c.t)):Math.max(0,M.hits[0]-28);
 const save={cues:M.cues,hits:M.hits,trails:M.trails,noHero:M.noHero};M.cues=[];M.hits=[];M.trails=[];M.noHero=true;
 const imgs=[];for(const dt of[-6,0]){const t=Math.max(0,c0+dt);const B=frame(M,t);const a=[];for(let i=0;i<B.c.length;i++)a.push(B.t[i]&&B.t[i]!==6?B.c[i]:0);imgs.push(a)}
 Object.assign(M,save);
 const hs=M.hits.slice().sort((a,b)=>a-b);out[M.id]={f:M.f,n:M.n,c0,hits:hs,gaps:hs.slice(1).map((h,i)=>h-hs[i]),cols:(M.cues||[]).map(c=>c.col).join(''),imgs}}
return out}"""
def why(m):
  for r,f in EXC:
    if f(m):return r
async def main():
  args=sys.argv[1:];th=400;verbose='-v' in args;want=set()
  for a in args:
    if a=='-v':continue
    if a.startswith('--th='):th=int(a[5:])
    elif re.fullmatch(r'\d+',a):th=int(a)
    else:want.update(GROUPS.get(a,[a]))
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page();await pg.goto(f'file://{SRC}/t3.html');await pg.wait_for_timeout(300)
    r=await pg.evaluate(JS);await b.close()
  by={}
  for k,v in r.items():
    v['id']=k
    if not want or v['f'] in want:by.setdefault(v['f'],[]).append(v)
  bad,skip=[],[]
  for f,L in by.items():
    for i in range(len(L)):
      for j in range(i+1,len(L)):
        a,b=L[i],L[j]
        if len(a['hits'])==len(b['hits']) and all(abs(x-y)<=2 for x,y in zip(a['gaps'],b['gaps'])):continue
        d=sum(1 for x,y in zip(a['imgs'][1],b['imgs'][1]) if x!=y)
        if d>=th:continue
        row=(d,f,a['id'],a['n'],a['cols'],a['gaps'],b['id'],b['n'],b['cols'],b['gaps'])
        w=why(a) or why(b)
        (skip if w else bad).append((row,w))
  for (d,f,ia,na,ca,ga,ib,nb,cb,gb),_ in sorted(bad):
    print(f"× {f}：{na}（{ia}・{ca}・間{ga}）と {nb}（{ib}・{cb}・間{gb}）　差 {d}")
  if verbose:
    for (d,f,ia,na,ca,ga,ib,nb,cb,gb),w in sorted(skip):print(f"  例外 {f}：{na} と {nb}　差 {d}　← {w}")
  print(f"{'・'.join(sorted(by)) if want else '全員'}：不合格 {len(bad)}組（差 {th} 未満。例外で除いた組 {len(skip)}）")
  sys.exit(1 if bad else 0)
asyncio.run(main())
