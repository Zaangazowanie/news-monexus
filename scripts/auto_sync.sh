#!/bin/bash
# Auto-sync Terminal Feeder to News Website
# Run every hour via cron

cd /root/.openclaw/workspace/news-monexus

# Convert JSON to Markdown
python3 scripts/convert_to_markdown.py

# Rebuild Next.js
npm run build

# Restart PM2
pm2 restart news-site

echo "$(date): Synced $(ls content/articles/*.md 2>/dev/null | wc -l) articles"
