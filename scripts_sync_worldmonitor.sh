#!/usr/bin/env bash
set -euo pipefail
BASE=/root/.openclaw/workspace/news-monexus
LOG="$BASE/worldmonitor_sync.log"
PYTHON="$BASE/.venv/bin/python"
if [ ! -x "$PYTHON" ]; then
  PYTHON=python3
fi

mkdir -p "$BASE/logs" "$BASE/data"

$PYTHON - <<'PY' >> "$LOG" 2>&1
import json, re, hashlib
from datetime import datetime, timezone
from pathlib import Path
from collections import defaultdict, deque
import xml.etree.ElementTree as ET
from urllib.request import Request, urlopen

BASE = Path('/root/.openclaw/workspace/news-monexus')
DATA_FILE = BASE / 'data' / 'sample.json'
HEALTH_FILE = BASE / 'data' / 'source_health.json'

FEEDS = [
 ('BBC World','http://feeds.bbci.co.uk/news/world/rss.xml','Global','Geopolitics'),
 # REMOVED: Reuters feeds discontinued (DNS dead) - 2026-03-01
 # ('Reuters World','https://feeds.reuters.com/reuters/worldNews','Global','Wire'),
 # ('Reuters Business','https://feeds.reuters.com/reuters/businessNews','Global','Markets'),
 # ('Reuters Tech','https://feeds.reuters.com/reuters/technologyNews','Global','Tech'),
 # DISABLED: RSSHub rate-limited, needs self-hosted instance - 2026-03-01
 # ('AP Top','https://rsshub.app/apnews/topics/apf-topnews','US','Wire'),
 # ('AP World','https://rsshub.app/apnews/topics/apf-intlnews','Global','Wire'),
 # ('AP Business','https://rsshub.app/apnews/topics/apf-business','US','Markets'),
 # ('AP Sports','https://rsshub.app/apnews/topics/apf-sports','US','Sports'),
 ('Al Jazeera','https://www.aljazeera.com/xml/rss/all.xml','MENA','Conflict'),
 ('France24','https://www.france24.com/en/rss','Europe','Policy'),
 ('DW','https://rss.dw.com/rdf/rss-en-world','Europe','Policy'),
 ('NPR World','https://feeds.npr.org/1004/rss.xml','US','Policy'),
 ('NPR Business','https://feeds.npr.org/1006/rss.xml','US','Markets'),
 ('NPR Health','https://feeds.npr.org/1008/rss.xml','US','Wellbeing'),
 ('Guardian World','https://www.theguardian.com/world/rss','Global','Policy'),
 ('Guardian Business','https://www.theguardian.com/business/rss','Global','Markets'),
 ('Guardian Sport','https://www.theguardian.com/sport/rss','Global','Sports'),
 ('NYT World','https://rss.nytimes.com/services/xml/rss/nyt/World.xml','US','Policy'),
 ('NYT Business','https://rss.nytimes.com/services/xml/rss/nyt/Business.xml','US','Markets'),
 ('FT World','https://www.ft.com/world?format=rss','Global','Markets'),
 ('CNBC World','https://www.cnbc.com/id/100727362/device/rss/rss.html','US','Markets'),
 ('CNBC Tech','https://www.cnbc.com/id/19854910/device/rss/rss.html','US','Tech'),
 ('Bloomberg','https://feeds.bloomberg.com/business/news.rss','Global','Markets'),
 ('WSJ World','https://feeds.a.dj.com/rss/RSSWorldNews.xml','US','Policy'),
 ('WSJ Business','https://feeds.a.dj.com/rss/WSJcomUSBusiness.xml','US','Markets'),
 ('BBC Sport','http://feeds.bbci.co.uk/sport/rss.xml?edition=int','Global','Sports'),
 ('BBC Business','http://feeds.bbci.co.uk/news/business/rss.xml','Global','Markets'),
 ('BBC Health','http://feeds.bbci.co.uk/news/health/rss.xml','Global','Wellbeing'),
 ('ESPN','https://www.espn.com/espn/rss/news','Global','Sports'),
 ('ESPN F1','https://www.espn.com/espn/rss/f1/news','Sports','F1'),
 ('Sky Sports','https://www.skysports.com/rss/12040','Global','Sports'),
 ('Yahoo Sports','https://sports.yahoo.com/rss/','Global','Sports'),
 ('CBS Sports','https://www.cbssports.com/rss/headlines/','Global','Sports'),
 ('Healthline','https://www.healthline.com/rss/news','Global','Wellbeing'),
 ('Medical News Today','https://www.medicalnewstoday.com/rss','Global','Wellbeing'),
 ('WebMD','https://rssfeeds.webmd.com/rss/rss.aspx?RSSSource=RSS_PUBLIC','Global','Wellbeing'),
 ('WHO News','https://www.who.int/feeds/entity/news/en/rss.xml','Global','Wellbeing'),
 ('Defense One','https://www.defenseone.com/rss/all/','US','Defense'),
 ('The Diplomat','https://thediplomat.com/feed/','APAC','Geopolitics'),
 ('Kyiv Independent','https://kyivindependent.com/feed/','Ukraine','Conflict'),
 ('Ukrinform','https://www.ukrinform.net/rss/block-lastnews','Ukraine','Wire'),
 ('UN News','https://news.un.org/feed/subscribe/en/news/all/rss.xml','Global','Policy'),
 ('Politico EU','https://www.politico.eu/feed/','Europe','Policy'),
 ('Foreign Policy','https://foreignpolicy.com/feed/','Global','Geopolitics'),
 ('Axios','https://api.axios.com/feed/','US','Wire'),
 ('CNN','http://rss.cnn.com/rss/edition.rss','Global','Wire'),
 ('Washington Post','https://feeds.washingtonpost.com/rss/world','US','Policy'),
 # Alternative and analysis sources
 ('Brownstone','https://brownstone.org/feed/','US','Policy'),
 ('The American Conservative','https://www.theamericanconservative.com/rss','US','Analysis'),
 ('Antiwar','https://www.antiwar.com/rss','US','Policy'),
 ('Consortium News','https://consortiumnews.com/feed/','US','Analysis'),
 ('MintPress News','https://mintpressnews.com/feed/','MENA','Analysis'),
 ('Grayzone','https://thegrayzone.com/feed/','US','Investigation'),
 # Real-time conflict/geopolitics sources
 # DISABLED: RSSHub rate-limited - 2026-03-01
 # ('ISW Russia','https://rsshub.app/understandingwar/russia','Conflict','Analysis'),
 # ('ISW Iran','https://rsshub.app/understandingwar/iran','Iran','Analysis'),
 # ('ISW Ukraine','https://rsshub.app/understandingwar/ukraine','Ukraine','Analysis'),
 ('Middle East Eye','https://www.middleeasteye.net/rss','MENA','Conflict'),
 ('Iran Intl','https://www.iranintl.com/rss','Iran','Wire'),
 ('Times of Israel','https://www.timesofisrael.com/rss','MENA','Wire'),
 ('Jerusalem Post','https://www.jpost.com/rss/rssfeedsheadlines','MENA','Wire'),
 ('Haaretz','https://www.haaretz.com/rss','MENA','Wire'),
 ('Al Mayadeen','https://www.almayadeen.net/rss','MENA','Wire'),
 ('Press TV Iran','https://www.presstv.ir/rss','Iran','Wire'),
 ('TASS Russian','http://tass.com/rss/v2.xml','Russia','Wire'),
 ('RT News','https://www.rt.com/rss','Russia','Wire'),
]

FALLBACK = [
 {'title':'Global risk monitor refresh','summary':'Fallback: core feeds partially degraded; monitor still updating.','region':'Global','tag':'Macro','source':'Monexus Fallback','link':''},
 {'title':'Policy and markets pulse','summary':'Fallback: macro, policy and energy headlines continue to drive risk posture.','region':'Markets','tag':'Policy','source':'Monexus Fallback','link':''},
]

now = datetime.now(timezone.utc).isoformat()
health = {}
all_items = []

try:
    from scrapling import Fetcher
    fx = Fetcher()
    fetch_mode = 'scrapling'
except Exception as e:
    fx = None
    fetch_mode = f'urllib ({type(e).__name__})'


def fetch_bytes(url: str) -> bytes:
    if fx is not None:
        try:
            r = fx.get(url, timeout=18)
            b = getattr(r, 'body', None)
            if isinstance(b, (bytes, bytearray)) and b:
                return bytes(b)
        except Exception:
            pass
    req = Request(url, headers={'User-Agent':'Mozilla/5.0 (MonexusWireBot/2.0)'})
    # Follow redirects (up to 5)
    response = urlopen(req, timeout=18)
    final_url = response.geturl()  # Get final URL after redirects
    return response.read()


def txt(node, key):
    v = node.findtext(key)
    return (v or '').strip()

for source, url, region, tag in FEEDS:
    st = datetime.now(timezone.utc)
    ok = False
    count = 0
    err = ''
    try:
        data = fetch_bytes(url)
        # Strip XML namespaces to handle RDF feeds (DW, etc.)
        data_str = data.decode('utf-8', errors='ignore')
        data_str = re.sub(r'\sxmlns[^"]]*"[^"]*"', '', data_str)
        data_str = re.sub(r'<([a-z0-9]+):([a-z0-9]+)', r'<\2', data_str)
        data_str = re.sub(r'</([a-z0-9]+):([a-z0-9]+)', r'</\2', data_str)
        root = ET.fromstring(data_str.encode('utf-8'))
        nodes = root.findall('.//item') or root.findall('.//entry')
        for it in nodes[:20]:
            title = txt(it, 'title')
            link = txt(it, 'link')
            if not link:
                lnode = it.find('link')
                if lnode is not None:
                    link = (lnode.attrib.get('href') or '').strip()
            desc = txt(it, 'description') or txt(it, 'summary')
            desc = re.sub('<[^<]+?>', '', desc).strip()
            if title:
                all_items.append({
                    'title': title[:180],
                    'summary': (desc[:260] if desc else f'Latest from {source}'),
                    'region': region,
                    'tag': tag,
                    'source': source,
                    'time': now,
                    'link': link,
                    'id': hashlib.sha1(f"{source}|{title.lower()}".encode()).hexdigest()[:16]
                })
                count += 1
        ok = count > 0
    except Exception as e:
        err = str(e)[:180]

    health[source] = {
        'ok': ok,
        'items': count,
        'last_checked': now,
        'latency_ms': int((datetime.now(timezone.utc)-st).total_seconds()*1000),
        'error': err,
        'url': url,
    }

seen = set(); ded = []
for x in all_items:
    key = re.sub(r'\W+', ' ', x['title'].lower()).strip()
    if key and key not in seen:
        seen.add(key)
        ded.append(x)

groups = defaultdict(list)
for x in ded:
    groups[x['source']].append(x)
for s in list(groups):
    groups[s] = groups[s][:10]

queues = [deque(v) for _, v in sorted(groups.items())]
out = []
while queues and len(out) < 160:
    nxt = []
    for q in queues:
        if q:
            out.append(q.popleft())
        if q:
            nxt.append(q)
    queues = nxt

active_sources = len([1 for v in health.values() if v['ok']])
if len(out) < 30:
    for f in FALLBACK:
        z = dict(f)
        z['time'] = now
        z['id'] = hashlib.sha1((z['source']+z['title']).encode()).hexdigest()[:16]
        out.append(z)

payload = out[:120]
DATA_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding='utf-8')
HEALTH_FILE.write_text(json.dumps({
    'updated_at': now,
    'fetch_mode': fetch_mode,
    'active_sources': active_sources,
    'total_sources': len(FEEDS),
    'items_written': len(payload),
    'sources': health,
}, ensure_ascii=False, indent=2), encoding='utf-8')

print(f"{now} sync_ok mode={fetch_mode} active={active_sources}/{len(FEEDS)} raw={len(all_items)} dedup={len(ded)} wrote={len(payload)}")
if active_sources < max(5, int(len(FEEDS)*0.4)):
    print(f"{now} WARN stale-source-detection active_sources_low")
PY
