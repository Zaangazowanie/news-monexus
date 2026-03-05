#!/usr/bin/env python3
"""
Telegram channel scraper for war/Iran news
Uses simple HTTP requests with proper headers
"""
import json
import re
from datetime import datetime, timezone
from pathlib import Path
import urllib.request
import urllib.error

BASE = Path('/root/.openclaw/workspace/news-monexus')
OUT_FILE = BASE / 'data' / 'telegram_feeds.json'

# Telegram channels for war/Iran news (public channels via web preview)
CHANNELS = [
    ('https://t.me/s/wartranslated', 'War Translated', 'Conflict'),
    ('https://t.me/s/rybar_en', 'Rybar', 'Conflict'),
    ('https://t.me/s/ukraine_sitrep', 'Ukraine Sitrep', 'Ukraine'),
    ('https://t.me/s/iranintl', 'Iran Intl', 'Iran'),
    ('https://t.me/s/rtnews', 'RT News', 'Russia'),
    ('https://t.me/s/middleeast_eye', 'Middle East Eye', 'MENA'),
]

def fetch_channel(url: str) -> list:
    """Fetch recent posts from a public Telegram channel via web preview"""
    try:
        req = urllib.request.Request(
            url,
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            }
        )
        response = urllib.request.urlopen(req, timeout=30)
        html = response.read().decode('utf-8')
        
        posts = []
        # Parse posts from HTML - Telegram web preview uses specific classes
        # Look for message text in the HTML
        message_pattern = r'<div class="tgme_widget_message_text[^"]*"[^>]*>(.*?)</div>'
        matches = re.findall(message_pattern, html, re.DOTALL)
        
        for match in matches[:10]:
            # Clean HTML tags
            text = re.sub(r'<[^>]+>', '', match)
            text = text.strip()
            if len(text) > 50:
                posts.append({
                    'text': text[:500],
                    'time': datetime.now(timezone.utc).isoformat(),
                })
        
        return posts
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return []

def main():
    all_posts = []
    
    for url, name, category in CHANNELS:
        print(f"Fetching {name}...")
        posts = fetch_channel(url)
        for post in posts:
            all_posts.append({
                'source': name,
                'category': category,
                'text': post['text'],
                'time': post['time'],
                'url': url,
            })
        print(f"  -> {len(posts)} posts")
    
    OUT_FILE.write_text(json.dumps(all_posts, indent=2, ensure_ascii=False))
    print(f"\nWrote {len(all_posts)} posts to {OUT_FILE}")

if __name__ == '__main__':
    main()
