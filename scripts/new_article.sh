#!/bin/bash
# Quick script to add a new article

if [ -z "$1" ]; then
  echo "Usage: ./new_article.sh \"Article Title\" category"
  echo "Categories: geopolitics, business, wellbeing, sports, opinion"
  exit 1
fi

TITLE="$1"
CATEGORY="${2:-geopolitics}"
DATE=$(date +%Y-%m-%d)
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
FILENAME="${DATE}-${SLUG}.md"

cat > "/root/.openclaw/workspace/news-publishing/content/articles/$FILENAME" << EOF
---
title: "$TITLE"
date: $(date -Iseconds)
category: "$CATEGORY"
author: "Staff Writer"
source: "Monexus News"
completeness: "draft"
---

# Lead

[Opening paragraph - hook the reader and establish stakes]

## The Story

[Main content goes here]

## Sources

- Source 1
- Source 2

## What's Being Hidden

[Context that mainstream coverage misses]

## Key Questions

- Question 1?
- Question 2?

## Kicker

[Closing thought that resonates]
EOF

echo "✅ Created: content/articles/$FILENAME"
echo ""
echo "Next steps:"
echo "1. Edit the file with your content"
echo "2. Run: npm run build && pm2 restart news-site"
