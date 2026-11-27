#!/usr/bin/env bash
# pushする前に通す: bash tests/check.sh
set -e
cd "$(dirname "$0")/.."
if [ ! -d js ]; then echo "1ファイル版なので起動テストは飛ばす（分割後に有効）"; exit 0; fi
for f in js/*.js; do node --check "$f"; done
node tests/params.mjs . > /tmp/params.txt && echo "数値の台帳 OK" || { echo "数値の台帳 NG"; cat /tmp/params.txt; exit 1; }
node tests/requests.mjs . > /tmp/requests.txt && echo "依頼の一覧 OK" || { echo "依頼の一覧 NG"; cat /tmp/requests.txt; exit 1; }
node tests/tickets.mjs . > /tmp/tickets.txt && echo "チケット OK" || { echo "チケット NG"; cat /tmp/tickets.txt; exit 1; }
node tests/nippo.mjs . > /tmp/nippo.txt && echo "日報の形 OK" || { echo "日報の形 NG"; cat /tmp/nippo.txt; exit 1; }
node tests/smoke.mjs . > /tmp/smoke.json && echo "起動テスト OK" || { echo "起動テスト NG"; cat /tmp/smoke.json | head -c 2000; exit 1; }
node tests/newdraw.mjs . > /tmp/newdraw.json && echo "骨組みの絵（?new の門番・居合の組、影の組）のテスト OK" || { echo "?new のテスト NG"; cat /tmp/newdraw.json; exit 1; }
# 自動で戦わせるテストは、手元では敵ごとに 800F（速さ優先）、GitHub（CI）では 2400F。夜通しは node tests/soak.mjs . 200000 <種>
SOAK_FR=${SOAK_FR:-$([ -n "$CI" ] && echo 2400 || echo 800)}
node tests/soak.mjs . "$SOAK_FR" > /tmp/soak.txt 2>&1 && echo "自動で戦わせるテスト OK（敵ごとに ${SOAK_FR}F）" || { echo "自動で戦わせるテスト NG"; grep -v agent-proxy /tmp/soak.txt; exit 1; }
node tests/stage.mjs . > /tmp/stage.txt && echo "背景の点検 OK" || { echo "背景の点検 NG"; cat /tmp/stage.txt; exit 1; }
if [ -f rally.html ]; then node tests/pages.mjs . > /tmp/pages.json && echo "3ページのテスト OK" || { echo "3ページのテスト NG"; cat /tmp/pages.json; exit 1; }; fi
node tools/handan.mjs .   # 判断待ちを出すだけ（落とさない）
node tools/tickets.mjs . game 5   # 進行中と次に取れるチケットを出すだけ（落とさない）
