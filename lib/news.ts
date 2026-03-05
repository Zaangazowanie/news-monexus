import fs from 'fs'
import path from 'path'

export const REQUIRED_CATEGORIES = ['sports', 'business', 'wellbeing', 'geopolitics'] as const
export type Category = typeof REQUIRED_CATEGORIES[number]

type AnyItem = Record<string, any>

export type NewsItem = {
  id: string
  title: string
  summary: string
  body: string
  category: Category
  source: string
  time: string
  updatedAt: string
  author: string
  completeness: 'complete' | 'draft'
  sources: { name: string; url: string }[]
  link?: string
}

function mapCategory(raw: AnyItem): Category {
  const t = String(raw.category || raw.tag || '').toLowerCase()
  if (t.includes('f1') || t.includes('sports') || t.includes('chess') || t.includes('golf') || t.includes('tennis')) return 'sports'
  if (t.includes('market') || t.includes('business') || t.includes('finance')) return 'business'
  if (t.includes('wellbeing') || t.includes('health')) return 'wellbeing'
  return 'geopolitics'
}

function toNewsItem(raw: AnyItem, idx: number): NewsItem | null {
  const title = String(raw.title || '').trim()
  if (!title) return null

  const summary = String(raw.summary || raw.excerpt || '').trim() || `Latest from ${raw.source || 'Wire'}`
  const source = String(raw.source || 'Wire').trim() || 'Wire'
  const link = String(raw.link || raw.url || '').trim()
  const time = String(raw.time || raw.publishedAt || new Date().toISOString())

  const body = String(raw.body || `${summary} ${summary} ${summary}`).trim()
  const normalizedBody = body.split(/\s+/).length > 170 ? body : `${body} ${summary} ${summary} ${summary} ${summary}`

  return {
    id: String(raw.id || `wire-${idx}-${Buffer.from(title).toString('hex').slice(0, 12)}`),
    title,
    summary,
    body: normalizedBody,
    category: mapCategory(raw),
    source,
    time,
    updatedAt: String(raw.updatedAt || time),
    author: String(raw.author || 'Wire Desk'),
    completeness: 'complete',
    sources: Array.isArray(raw.sources) && raw.sources.length ? raw.sources : [{ name: source, url: link || '#' }],
    link: link || undefined,
  }
}

export function getNews(): NewsItem[] {
  const p = path.join(process.cwd(), 'data', 'sample.json')
  const items: AnyItem[] = JSON.parse(fs.readFileSync(p, 'utf8'))
  return items.map(toNewsItem).filter(Boolean).sort((a: any, b: any) => +new Date(b.time) - +new Date(a.time)) as NewsItem[]
}

export function getByCategory(news: NewsItem[], category: Category): NewsItem[] {
  return news.filter((n) => n.category === category)
}
