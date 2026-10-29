#!/usr/bin/env bash
# Downloads the study logs from the running app into a local folder.
#
#   LOG_EXPORT_TOKEN=<token> ./pull-logs.sh https://your-app [target-dir]
#
# Safe to run repeatedly (e.g. from cron). A local file is only replaced by a
# download that is at least as large, so a restarted container that begins a
# fresh log file can never shrink what you already have.
set -euo pipefail

BASE_URL="${1:?usage: LOG_EXPORT_TOKEN=<token> $0 <app-url> [target-dir]}"
TARGET_DIR="${2:-./hitlais-logs}"
: "${LOG_EXPORT_TOKEN:?set LOG_EXPORT_TOKEN}"

mkdir -p "$TARGET_DIR"

fetch() {
  curl --fail --silent --show-error \
    -H "Authorization: Bearer $LOG_EXPORT_TOKEN" "$@"
}

names="$(fetch "$BASE_URL/api/logs")"

for name in $names; do
  tmp="$(mktemp)"
  fetch -o "$tmp" "$BASE_URL/api/logs?file=$name"

  target="$TARGET_DIR/$name"

  if [ ! -f "$target" ] || [ "$(wc -c < "$tmp")" -ge "$(wc -c < "$target")" ]; then
    mv "$tmp" "$target"
    echo "saved  $name"
  else
    rm "$tmp"
    echo "kept   $name (local copy is larger)"
  fi
done
