#!/usr/bin/env python3
"""
Reddit monitoring via Scrapling - FREE
Reddit blocks RSS, so we use Scrapling to scrape
"""
import json
from datetime import datetime, timezone
from pathlib import Path
from scrapling.fetchers import StealthyFetcher

BASE = Path('/root/.openclaw/workspace/news-monexus')
OUT_FILE = BASE / 'data' / 'reddit_feeds.json'

# Subreddits to monitor
SUBREDDITS = [
    ('geopolitics', 'Geopolitics'),
    ('worldnews', 'World News'),
    ('Iran', 'Iran'),
    ('Ukraine', 'Ukraine'),
    ('syriancivilwar', 'Syria'),
    ('CombatFootage', 'Combat'),
    ('finance', 'Finance'),
    ('business', 'Business'),
]

def fetch_subreddit(subreddit: str) -> list:
    """Scrape subreddit hot posts"""
    url = f"https://old.reddit.com/r/{subreddit}/hot"
    try:
        page = StealthyFetcher.fetch(url, headless=True, timeout=30)
        posts = []
        
        for post in page.css('.thing'):
            title = post.css('a.title::text').get() or ''
            link = post.css('a.title::attr(href)').get() or ''
            score = post.css('.score.unvoted::text').get() or '0'
            
            if title and len(title) > 10:
                posts.append({
                    'title': title,
                    'link': f"https://reddit.com{link}" if link.startswith('/') else link,
                    'score': score,
                    'subreddit': subreddit,
                })
        
        return posts[:10]
    except Exception as e:
        print(f"Error fetching r/{subreddit}: {e}")
        return []

def main():
    all_posts = []
    
    for subreddit, category in SUBREDDITS:
        print(f"Fetching r/{subreddit}...")
        posts = fetch_subreddit(subreddit)
        for post in posts:
            all_posts.append({
                **post,
                'category': category,
                'fetched_at': datetime.now(timezone.utc).isoformat(),
            })
        print(f"  -> {len(posts)} posts")
    
    OUT_FILE.write_text(json.dumps(all_posts, indent=2, ensure_ascii=False))
    print(f"\nTotal Reddit posts: {len(all_posts)}")
    print(f"Saved to {OUT_FILE}")

if __name__ == '__main__':
    main()
