# tools/

| ファイル | 何をするか |
| --- | --- |
| `build_rally.py` | 本編 `index.html` から打ち合い道場 `rally.html` を作る（`RP_PAGE` を true にし、見出しとタイトルを変えるだけ） |
| `build_viewer.py` | 本編からモーションのビューア `viewer.html` を作る（敵と技を選んで再生、速さ、コマ送り） |
| `build_ukprev.py` | 本編から打ち返し演出の比べ見ページ `ukprev.html` を作る |
| `font/rebuild.py` | ゲームで使う文字だけを含むフォント（DotGothic16、OFL）を作り直し、`index.html` に埋めこむ。文字を増やしたら実行 |
| `shot.py` | ページを開いてスクリーンショットを撮る（見た目の確認用、Playwright） |

## 決まり
- ゲームを直したら、`build_rally.py` `build_viewer.py` `build_ukprev.py` をすべて実行し、3ページもそろえる。
- 3つのビルドは、**1ファイルの `index.html` への文字列置換**で作っている。置換する元の文字列（`const RP_PAGE=false;`、`<title>パリィRPG 試作</title>` など）は `assert` で1か所だけあることを確かめているので、見つからなければ止まる。

## ファイル分割（setup ブランチの `tools/split.py`）と合わせるときの注意
- 分割すると、置換の元になる文字列は `js/` 以下の別ファイルへ移る。ビルドは「分割後のファイルを読み、フラグだけを差しかえたページを出す」形に書きかえる必要がある。いちばん簡単なのは、`RP_PAGE` などのフラグを URL のパラメーターかページごとの小さな `<script>` で決めるようにして、道場とビューアも同じ `js/` を読むようにすること。
- `<title>` を「いまだ！」に直すと、`build_rally.py` の置換元（`<title>パリィRPG 試作</title>`）も変わる。合わせて直す。
- 道場・ビューア・比べ見ページをリポジトリの直下に置くと、GitHub Pages で `…/now/rally.html` などとしてサインインなしで開けるようになる。claude.ai のアーティファクトがサインインなしで開けない問題の解決にもなる。公開してよいかは惟吹が決める。
