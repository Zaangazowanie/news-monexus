import { headers } from 'next/headers'
import fs from 'fs'
import { getNews } from '../lib/news'

function variantFromHost(host: string): string {
  const h = (host || '').toLowerCase()
  if (h.startsWith('lucy.news.') || h.endsWith(':3101')) return 'LUCY'
  if (h.startsWith('bob.news.') || h.endsWith(':3102')) return 'BOB'
  if (h.startsWith('shadow.news.') || h.endsWith(':3100') || h.endsWith(':3103')) return 'SHADOW'
  return 'MAIN'
}

function getFeedUpdatedAt() {
  const p = '/root/.openclaw/workspace/news-monexus/data/sample.json'
  try {
    const st = fs.statSync(p)
    return st.mtime.toISOString()
  } catch {
    return null
  }
}

// Generate a placeholder image URL based on category and title
function getThumbnailUrl(item: any): string {
  const category = item.category || 'news'
  const hash = Buffer.from(item.id || item.title).toString('hex').slice(0, 8)
  
  // Use Unsplash source with category keywords
  const keywords: Record<string, string> = {
    sports: 'sports,stadium,athlete',
    business: 'business,finance,city',
    wellbeing: 'health,medical,wellness',
    geopolitics: 'world,global,politics'
  }
  
  const keyword = keywords[category] || 'news'
  return `https://source.unsplash.com/120x80/?${keyword}&sig=${hash}`
}

export default function Page() {
  const host = headers().get('host') || ''
  const variant = variantFromHost(host)
  const feedUpdatedAt = getFeedUpdatedAt()
  const news = getNews()

  return (
    <main className="container">
      <header className="header">
        <div>
          <div className="brand">Monexus News</div>
          <div className="sub">Real-time wire feed across Sports, Business, Wellbeing, and Geopolitics</div>
          <div className="sub">Feed last updated: {feedUpdatedAt ? new Date(feedUpdatedAt).toUTCString() : 'unknown'}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="badge">{host || 'terminal.monexusmedia.uk'}</span>
          <span className="badge variant">{variant}</span>
        </div>
      </header>

      {/* Chronological Wire Feed */}
      <section className="wire-feed">
        <div className="feed-header">
          <h2>Latest Updates</h2>
          <span className="feed-count">{news.length} stories</span>
        </div>
        
        <div className="feed-list">
          {news.map((item) => (
            <article className="wire-item" key={item.id}>
              <div className="wire-thumbnail">
                <img 
                  src={getThumbnailUrl(item)} 
                  alt={item.title}
                  loading="lazy"
                  width="120"
                  height="80"
                />
              </div>
              
              <div className="wire-content">
                <div className="wire-meta">
                  <span className={`category-tag ${item.category}`}>{item.category}</span>
                  <span className="time">{new Date(item.time).toLocaleString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit'
                  })}</span>
                  <span className="source">{item.source}</span>
                </div>
                
                <h3 className="wire-title">
                  {item.link ? (
                    <a href={item.link} target="_blank" rel="noreferrer">{item.title}</a>
                  ) : (
                    item.title
                  )}
                </h3>
                
                <p className="wire-summary">{item.summary}</p>
                
                <div className="wire-footer">
                  <span className="author">{item.author}</span>
                  <span className="status">{item.completeness}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">© Monexus Media Labs — autonomous briefing engine</footer>
    </main>
  )
}
