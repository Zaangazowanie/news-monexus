#!/bin/bash
# Sync Terminal Feeder to News Website
# Runs every hour at minute 5

set -e

LOG_FILE="/var/log/feeder_sync.log"
WORK_DIR="/root/.openclaw/workspace/news-monexus"

# Convert JSON to Markdown
python3 scripts/convert_to_markdown.py >> "$LOG_FILE" 2>&1

# Rebuild Next.js (only if files changed)
if [ "$(ls -lt content/articles/*.md 2>/dev/null | wc -l)" -gt 0 ]; then
    npm run build >> "$LOG_FILE" 2>&1
    pm2 restart news-site >> "$LOG_FILE" 2>&1
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Synced $(ls content/articles/*.md 2>/dev/null | wc -l) articles" >> "$LOG_FILE"
