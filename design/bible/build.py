import os
HERE=os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)
import base64,json
js=''.join(open(f).read()+'\n' for f in ['engine.js','rig.js','motion.js','specs.js','cards.js','moves.js','stages.js','content.js'])
old={}
for k in ['samuraiB','gateK','lord','red','fallen']:
    old[k]='data:image/png;base64,'+base64.b64encode(open(os.path.join(HERE,'..','old',k+'.png'),'rb').read()).decode()
js+='const OLDIMG='+json.dumps(old)+';\n'+open('page.js').read()
html=open('shell.html').read().replace('<script>/*JS*/</script>','<script>\n'+js+'\n</script>')
open('bible.html','w').write(html);print(len(html))
