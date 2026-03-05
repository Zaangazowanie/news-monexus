#!/usr/bin/env python3
"""
Convert Terminal Feeder JSON to Markdown articles for Next.js SSG.
"""

import json
import os
from datetime import datetime
from pathlib import Path
import hashlib

# Paths
DATA_DIR = Path(__file__).parent.parent / "data"
CONTENT_DIR = Path(__file__).parent.parent / "content" / "articles"
CONTENT_DIR.mkdir(parents=True, exist_ok=True)

def slugify(text):
    """Create URL-safe slug from text."""
    slug = text.lower().strip()
    slug = ''.join(c if c.isalnum() or c in '- ' else '' for c in slug)
    slug = slug.replace(' ', '-')[:80]
    return slug

def get_category(tag, region):
    """Map tag/region to category."""
    tag_map = {
        "Conflict": "geopolitics",
        "Politics": "geopolitics",
        "Economy": "business",
        "Finance": "business",
        "Opinion": "opinion",
        "Analysis": "opinion",
    }
    return tag_map.get(tag, "news")

def convert_article(article):
    """Convert single article to Markdown with frontmatter."""
    
    # Parse time
    try:
        dt = datetime.fromisoformat(article['time'].replace('+00:00', ''))
        date_str = dt.strftime('%Y-%m-%d')
        datetime_str = dt.strftime('%Y-%m-%dT%H:%M:%SZ')
    except:
        date_str = datetime.now().strftime('%Y-%m-%d')
        datetime_str = datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ')
    
    # Generate slug
    slug = f"{date_str}-{article['id'][:8]}"
    
    # Category
    category = get_category(article.get('tag', ''), article.get('region', ''))
    
    # Frontmatter
    frontmatter = f"""---
title: "{article.get('title', 'Untitled')}"
date: {datetime_str}
category: "{category}"
source: "{article.get('source', 'Unknown')}"
region: "{article.get('region', 'Global')}"
tag: "{article.get('tag', 'News')}"
link: "{article.get('link', '')}"
original_id: "{article.get('id', '')}"
---

"""
    
    # Content
    content = f"""# {article.get('title', 'Untitled')}

{article.get('summary', '')}

---

**Source:** [{article.get('source', 'Unknown')}]({article.get('link', '#')})  
**Region:** {article.get('region', 'Global')}  
**Tag:** {article.get('tag', 'News')}
"""
    
    return slug, frontmatter + content

def main():
    """Process all JSON files and convert to Markdown."""
    
    # Load sample.json
    json_file = DATA_DIR / "sample.json"
    if not json_file.exists():
        print(f"❌ No data file found: {json_file}")
        return
    
    with open(json_file, 'r', encoding='utf-8') as f:
        articles = json.load(f)
    
    print(f"📰 Converting {len(articles)} articles...")
    
    converted = 0
    for article in articles:
        try:
            slug, markdown = convert_article(article)
            output_path = CONTENT_DIR / f"{slug}.md"
            
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(markdown)
            
            converted += 1
        except Exception as e:
            print(f"⚠️ Error converting article: {e}")
    
    print(f"✅ Converted {converted} articles to {CONTENT_DIR}")

if __name__ == "__main__":
    main()
