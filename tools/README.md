# tools/

| ファイル | 何をするか |
| --- | --- |
| `build_pages.py` | 本編から、打ち合い道場 `rally.html`・モーションのビューア `viewer.html`・打ち返しの演出くらべ `ukprev.html` を作る。ゲームを直したら毎回実行する |
| `split.py` | 1ファイル版の `index.html` を css/ と js/ に分けたスクリプト（2026-11-23に実行済み。記録として残している） |
| `font/rebuild.py` | ゲームで使う文字だけのフォント `css/px.woff2`（DotGothic16、OFL）を作り直す。文字を増やしたら実行 |
| `shot.py` | ページを開いてスクリーンショットを撮る（見た目の確認用、Playwright） |
| `ichimai.mjs` | 日報の「今日の1枚」を撮る。ゲームの時間を止め、場面を作ってから、ゲームの画面だけを撮る |
| `handan.mjs` | 判断待ちの一覧。日報の「決めてほしいこと」でまだ決まっていないものと、依頼の「保留」を出す。`check.sh` の最後にも出る |

## 3ページのしくみ
- 3ページとも、本編と同じ `css/` と `js/` を読む。本編のコードを文字列置換で書きかえることはしない。
- 違いは、タイトル・見出しと、本編より前に置く `window.PAGE`（`js/08-dojo.js` の `RP_PAGE` がこれを見る）、本編のあとに読む `pages/viewer.js` `pages/ukprev.js` だけ。
- `pages/` のコードは本編の関数（`tick` `startEnemy` `press` など）を差しかえて動く。本編でこれらの名前を変えたら、`pages/` も直す。`bash tests/check.sh` で3ページが動くかを確かめられる。
