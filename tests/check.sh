#!/usr/bin/env bash
# pushする前に通す: bash tests/check.sh
set -e
cd "$(dirname "$0")/.."
if [ ! -d js ]; then echo "1ファイル版なので起動テストは飛ばす（分割後に有効）"; exit 0; fi
for f in js/*.js; do node --check "$f"; done
node tests/smoke.mjs . > /tmp/smoke.json && echo "起動テスト OK" || { echo "起動テスト NG"; cat /tmp/smoke.json | head -c 2000; exit 1; }
