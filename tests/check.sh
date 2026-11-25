#!/usr/bin/env bash
# pushする前に通す: bash tests/check.sh
set -e
cd "$(dirname "$0")/.."
if [ ! -d js ]; then echo "1ファイル版なので起動テストは飛ばす（分割後に有効）"; exit 0; fi
for f in js/*.js; do node --check "$f"; done
node tests/params.mjs . > /tmp/params.txt && echo "数値の台帳 OK" || { echo "数値の台帳 NG"; cat /tmp/params.txt; exit 1; }
node tests/smoke.mjs . > /tmp/smoke.json && echo "起動テスト OK" || { echo "起動テスト NG"; cat /tmp/smoke.json | head -c 2000; exit 1; }
node tests/newdraw.mjs . > /tmp/newdraw.json && echo "?new（骨組みの門番）のテスト OK" || { echo "?new のテスト NG"; cat /tmp/newdraw.json; exit 1; }
node tests/stage.mjs . > /tmp/stage.txt && echo "背景の点検 OK" || { echo "背景の点検 NG"; cat /tmp/stage.txt; exit 1; }
if [ -f rally.html ]; then node tests/pages.mjs . > /tmp/pages.json && echo "3ページのテスト OK" || { echo "3ページのテスト NG"; cat /tmp/pages.json; exit 1; }; fi
