#!/usr/bin/env python3
"""
X (Twitter) monitoring via Nitter - FREE
Nitter is a free Twitter frontend that provides RSS feeds
"""
import json
import feedparser
from datetime import datetime, timezone
from pathlib import Path

BASE = Path('/root/.openclaw/workspace/news-monexus')
OUT_FILE = BASE / 'data' / 'x_feeds.json'

# Nitter instances (rotating in case one goes down)
NITTER_INSTANCES = [
    'https://nitter.net',
    'https://nitter.poast.org',
    'https://nitter.privacydev.net',
]

# X accounts/searches to monitor for news
X_FEEDS = [
    # War/Conflict
    ('search', 'war Ukraine', 'War News'),
    ('search', 'Iran news', 'Iran'),
    ('search', 'Middle East conflict', 'MENA'),
    
    # Journalists/Analysts
    ('user', 'wartranslated', 'War Translated'),
    ('user', 'ASL26', 'ASL26 Analytics'),
    ('user', 'b_judah', 'Ben Judah'),
    
    # News wires
    ('user', 'Reuters', 'Reuters'),
    ('user', 'AP', 'Associated Press'),
    ('user', 'BBCWorld', 'BBC World'),
    
    # Alternative
    ('user', 'MTaibbi', 'Matt Taibbi'),
    ('user', 'ggreenwald', 'Glenn Greenwald'),
]

from urllib.parse import quote

def fetch_nitter_feed(instance: str, feed_type: str, query: str) -> list:
    """Fetch RSS from Nitter"""
    if feed_type == 'search':
        url = f"{instance}/search/rss?f=tweets&q={quote(query)}"
    else:  # user
        url = f"{instance}/{query}/rss"
    
    try:
        parsed = feedparser.parse(url)
        posts = []
        for entry in parsed.entries[:10]:
            posts.append({
                'title': entry.get('title', ''),
                'text': entry.get('description', ''),
                'link': entry.get('link', ''),
                'published': entry.get('published', ''),
                'source': query,
            })
        return posts
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return []

def main():
    all_posts = []
    
    for instance in NITTER_INSTANCES:
        print(f"Trying {instance}...")
        for feed_type, query, category in X_FEEDS:
            posts = fetch_nitter_feed(instance, feed_type, query)
            for post in posts:
                all_posts.append({
                    **post,
                    'category': category,
                    'fetched_at': datetime.now(timezone.utc).isoformat(),
                })
            if posts:
                print(f"  {query}: {len(posts)} posts")
        if all_posts:
            break  # Success, no need to try other instances
    
    OUT_FILE.write_text(json.dumps(all_posts, indent=2, ensure_ascii=False))
    print(f"\nTotal X posts: {len(all_posts)}")
    print(f"Saved to {OUT_FILE}")

if __name__ == '__main__':
    main()
