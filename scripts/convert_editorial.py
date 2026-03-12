#!/usr/bin/env python3
"""
Convert editorial-articles.json to Markdown files for news-publishing platform.
"""

import json
import os
from datetime import datetime
from pathlib import Path
import re

# Paths
INPUT_FILE = Path("/root/.openclaw/workspace/news-main/data/editorial-articles.json")
OUTPUT_DIR = Path("/root/.openclaw/workspace/news-publishing/content/articles")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def slugify(text):
    """Create URL-safe slug from text."""
    slug = text.lower().strip()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug[:100]

def convert_articles():
    """Convert JSON articles to Markdown."""
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        articles = json.load(f)
    
    print(f"📰 Converting {len(articles)} articles...")
    
    converted = 0
    for article in articles:
        try:
            # Generate slug
            date_str = article.get('publishedAt', '')[:10] or datetime.now().strftime('%Y-%m-%d')
            slug = f"{date_str}-{article['id']}"
            
            # Create frontmatter
            frontmatter = f"""---
title: "{article.get('title', 'Untitled')}"
date: {article.get('publishedAt', datetime.now().isoformat())}
category: "{article.get('category', 'news')}"
author: "{article.get('author', 'Monexus Editorial')}"
source: "{article.get('source', 'Monexus News')}"
completeness: "{article.get('completeness', 'draft')}"
---

"""
            
            # Write Markdown file
            output_path = OUTPUT_DIR / f"{slug}.md"
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(frontmatter + article.get('body', ''))
            
            converted += 1
            print(f"✅ {article.get('title', 'Untitled')[:60]}...")
            
        except Exception as e:
            print(f"⚠️ Error: {e}")
    
    print(f"\n✅ Converted {converted} articles to {OUTPUT_DIR}")

if __name__ == "__main__":
    convert_articles()
