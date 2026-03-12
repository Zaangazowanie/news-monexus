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
  source: string;
  completeness: string;
  body: string;
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

async function getArticlesByCategory(category: string): Promise<Article[]> {
  try {
    const files = await fs.readdir(CONTENT_DIR);
    const articles: Article[] = [];
    
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      
      const content = await fs.readFile(path.join(CONTENT_DIR, file), 'utf-8');
      const { frontmatter, body } = parseFrontmatter(content);
      
      if (frontmatter.category === category) {
        articles.push({
          slug: file.replace('.md', ''),
          title: frontmatter.title || 'Untitled',
          date: frontmatter.date || new Date().toISOString(),
          category: frontmatter.category || 'news',
          author: frontmatter.author || 'Monexus Editorial',
          source: frontmatter.source || 'Monexus News',
          completeness: frontmatter.completeness || 'draft',
          body
        });
      }
    }
    
    return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return [];
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const articles = await getArticlesByCategory(category);
  
  const categoryInfo: Record<string, { icon: string; color: string; description: string }> = {
    geopolitics: { icon: '🌍', color: 'cyan', description: 'Global affairs, conflict, and international relations' },
    business: { icon: '💼', color: 'purple', description: 'Markets, economy, and financial analysis' },
    wellbeing: { icon: '🌿', color: 'green', description: 'Health, society, and quality of life' },
    sports: { icon: '⚽', color: 'orange', description: 'Sports coverage and analysis' },
    opinion: { icon: '💭', color: 'yellow', description: 'Analysis, commentary, and editorial perspectives' }
  };
  
  const info = categoryInfo[category] || { icon: '📰', color: 'gray', description: 'News and analysis' };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <a href="/" className="text-cyan-400 hover:text-cyan-300 mb-4 inline-block">← Back to Home</a>
          <h1 className="text-5xl font-bold mb-4 flex items-center gap-4">
            <span className="text-6xl">{info.icon}</span>
            <span className="capitalize">{category}</span>
          </h1>
          <p className="text-xl text-gray-400">{info.description}</p>
          <div className="mt-4 text-gray-500">{articles.length} articles</div>
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <Link 
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="group bg-gray-800/50 rounded-lg border border-gray-700 hover:border-cyan-500 transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {article.body.split('\n').find(l => l.trim() && !l.startsWith('#'))?.slice(0, 150) || 'Read more...'}
                  </p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{article.author}</span>
                    <span>{new Date(article.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">No Articles Yet</h2>
            <p className="text-gray-400 mb-6">Our {category} desk is preparing original coverage.</p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
              <span className="text-cyan-400 font-semibold">Coming soon</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>© 2026 Monexus Media</p>
        </footer>
      </div>
    </div>
  );
}
