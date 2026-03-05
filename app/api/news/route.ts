import { NextResponse } from 'next/server'
import { getNews } from '../../../lib/news'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  return NextResponse.json({ ok: true, items: getNews() }, {
    headers: { 'Cache-Control': 'no-store, max-age=0' }
  })
}
