import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';

export const revalidate = 3600;

const CONTENT_DIR = path.join(process.cwd(), 'content', 'articles');

interface Article {
  slug: string;
  title: string;
  date: string;
  category: string;
  author: string;
  excerpt: string;
}

function parseFrontmatter(content: string): { frontmatter: Record<string, string>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (!match) {
    return { frontmatter: {}, body: content };
  }
  
  const [, frontmatterStr, body] = match;
  const frontmatter: Record<string, string> = {};
  
  frontmatterStr.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim().replace(/^"|"$/g, '');
      frontmatter[key] = value;
    }
  });
  
  return { frontmatter, body: body.trim() };
}

async function getAllArticles(): Promise<Article[]> {
  try {
    const files = await fs.readdir(CONTENT_DIR);
    const articles: Article[] = [];
    
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      
      const content = await fs.readFile(path.join(CONTENT_DIR, file), 'utf-8');
      const { frontmatter, body } = parseFrontmatter(content);
      
      const excerpt = body
        .split('\n')
        .find(l => l.trim() && !l.startsWith('#') && l.length > 50)
        ?.slice(0, 200) || 'Read more...';
      
      articles.push({
        slug: file.replace('.md', ''),
        title: frontmatter.title || 'Untitled',
        date: frontmatter.date || new Date().toISOString(),
        category: frontmatter.category || 'news',
        author: frontmatter.author || 'Monexus Editorial',
        excerpt
      });
    }
    
    return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return [];
  }
}

export default async function Home() {
  const articles = await getAllArticles();
  const featured = articles[0];
  const latest = articles.slice(1, 7);
  const categories = [...new Set(articles.map(a => a.category))];
  
  const categoryMeta: Record<string, { icon: string; color: string; border: string }> = {
    geopolitics: { icon: '🌍', color: 'from-cyan-600 to-blue-600', border: 'border-cyan-400' },
    business: { icon: '💼', color: 'from-purple-600 to-pink-600', border: 'border-purple-400' },
    wellbeing: { icon: '🌿', color: 'from-green-600 to-teal-600', border: 'border-green-400' },
    sports: { icon: '⚽', color: 'from-orange-600 to-red-600', border: 'border-orange-400' },
    technology: { icon: '💻', color: 'from-indigo-600 to-violet-600', border: 'border-indigo-400' },
    opinion: { icon: '💭', color: 'from-yellow-600 to-amber-600', border: 'border-yellow-400' }
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0a0e17]/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Monexus Media
              </h1>
              <p className="text-xs text-gray-500">Intelligence-driven journalism</p>
            </div>
            <nav className="flex items-center gap-6">
              <span className="text-sm text-gray-400">{articles.length} articles</span>
              <a href="https://terminal.monexusmedia.uk" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                Terminal ↗
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Featured Article */}
        {featured && (
          <Link 
            href={`/articles/${featured.slug}`}
            className="block mb-16 group"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 hover:border-cyan-500/50 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-12">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl">{categoryMeta[featured.category]?.icon || '📰'}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                    FEATURED
                  </span>
                  <span className="text-sm text-gray-500 capitalize">{featured.category}</span>
                </div>
                <h2 className="text-5xl font-bold mb-6 leading-tight group-hover:text-cyan-400 transition-colors">
                  {featured.title}
                </h2>
                <p className="text-xl text-gray-400 mb-8 max-w-4xl leading-relaxed">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {featured.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(featured.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Categories */}
        <div className="mb-16">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(cat => (
              <Link
                key={cat}
                href={`/${cat}`}
                className={`group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br ${categoryMeta[cat]?.color || 'from-gray-700 to-gray-800'} border ${categoryMeta[cat]?.border || 'border-gray-600'} hover:scale-105 transition-all duration-300`}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                <div className="relative">
                  <div className="text-3xl mb-2">{categoryMeta[cat]?.icon || '📰'}</div>
                  <div className="font-semibold capitalize">{cat}</div>
                  <div className="text-xs opacity-75">{articles.filter(a => a.category === cat).length} articles</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Latest Articles */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">Latest Coverage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.map(article => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">{categoryMeta[article.category]?.icon || '📰'}</span>
                    <span className="text-xs text-gray-500 capitalize">{article.category}</span>
                  </div>
                  <h4 className="text-xl font-semibold mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{article.author}</span>
                    <span>{new Date(article.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-cyan-400">{articles.length}</div>
              <div className="text-sm text-gray-500">Articles Published</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">{categories.length}</div>
              <div className="text-sm text-gray-500">Editorial Desks</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">24/7</div>
              <div className="text-sm text-gray-500">Global Coverage</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400">2026</div>
              <div className="text-sm text-gray-500">Established</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-500 text-sm">
          <p>© 2026 Monexus Media. Independent journalism. Owned by no one.</p>
        </div>
      </footer>
    </div>
  );
}
