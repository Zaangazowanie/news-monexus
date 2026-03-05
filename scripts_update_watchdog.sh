#!/usr/bin/env bash
set -euo pipefail
DATA=/root/.openclaw/workspace/news-monexus/data/sample.json
SYNC=/root/.openclaw/workspace/news-monexus/scripts_sync_worldmonitor.sh
LOG=/root/.openclaw/workspace/news-monexus/logs/update_watchdog.log
mkdir -p /root/.openclaw/workspace/news-monexus/logs
now=$(date +%s)
if [ -f "$DATA" ]; then
  mtime=$(stat -c %Y "$DATA")
  age=$((now-mtime))
else
  age=999999
fi
if [ "$age" -gt 1200 ]; then
  echo "$(date -Iseconds) stale=${age}s -> forcing sync" >> "$LOG"
  "$SYNC" >> "$LOG" 2>&1 || true
else
  echo "$(date -Iseconds) healthy=${age}s" >> "$LOG"
fi
