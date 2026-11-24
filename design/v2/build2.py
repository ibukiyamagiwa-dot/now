import base64,json,os
HERE=os.path.dirname(os.path.abspath(__file__));os.chdir(HERE)
js=''.join(open(f).read()+'\n' for f in ['engine.js','rig.js','motion.js','specs.js','hero.js','cards.js','dragon.js','boar.js','moves.js','mobs.js','stages.js','content2.js','hurt.js','heromv.js','parried.js','shade.js'])
old={}
for k in ['samuraiB','gateK','lord','red','fallen','dragon','hydra','boar','boarM']:
    p=os.path.join(HERE,'..','old',k+'.png')
    if not os.path.exists(p):p=f'/tmp/oldc_{k}.png'
    old[k]='data:image/png;base64,'+base64.b64encode(open(p,'rb').read()).decode()
js+='const OLDIMG='+json.dumps(old)+';\n'+open('page.js').read()
html=open('shell2.html').read().replace('<script>/*JS*/</script>','<script>\n'+js+'\n</script>')
open('bible2.html','w').write(html);print(len(html))
