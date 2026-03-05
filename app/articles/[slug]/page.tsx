import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'articles');

interface ArticleFrontmatter {
  title: string;
  date: string;
  category: string;
  source: string;
  region: string;
  tag: string;
  link: string;
  original_id: string;
}

interface Article {
  slug: string;
  frontmatter: ArticleFrontmatter;
  content: string;
}

function parseFrontmatter(content: string): { frontmatter: ArticleFrontmatter; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (!match) {
    return {
      frontmatter: {
        title: 'Untitled',
        date: new Date().toISOString(),
        category: 'news',
        source: 'Unknown',
        region: 'Global',
        tag: 'News',
        link: '',
        original_id: ''
      },
      body: content
    };
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
  
  return {
    frontmatter: {
      title: frontmatter.title || 'Untitled',
      date: frontmatter.date || new Date().toISOString(),
      category: frontmatter.category || 'news',
      source: frontmatter.source || 'Unknown',
      region: frontmatter.region || 'Global',
      tag: frontmatter.tag || 'News',
      link: frontmatter.link || '',
      original_id: frontmatter.original_id || ''
    },
    body: body.trim()
  };
}

function parseMarkdown(body: string): string {
  // Simple markdown to HTML conversion
  return body
    .replace(/^# (.*$)/gm, '<h1 class="text-4xl font-bold mb-6">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mb-4 mt-8">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-cyan-400 hover:underline" target="_blank" rel="noopener">$1</a>')
    .replace(/\n\n/g, '</p><p class="mb-4 text-gray-300">')
    .replace(/---/g, '<hr class="my-8 border-gray-700" />');
}

export async function generateStaticParams() {
  try {
    const files = await fs.readdir(CONTENT_DIR);
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => ({
        slug: file.replace('.md', '')
      }));
  } catch {
    return [];
  }
}

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const filePath = path.join(CONTENT_DIR, `${slug}.md`);
    const content = await fs.readFile(filePath, 'utf-8');
    const { frontmatter, body } = parseFrontmatter(content);
    
    return {
      slug,
      frontmatter,
      content: parseMarkdown(body)
    };
  } catch {
    return null;
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  
  if (!article) {
    notFound();
  }
  
  const { frontmatter, content } = article;
  const date = new Date(frontmatter.date);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-400">
          <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/" className="hover:text-cyan-400 transition-colors">{frontmatter.category}</Link>
        </nav>
        
        {/* Category Badge */}
        <div className="mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            {frontmatter.tag}
          </span>
          <span className="ml-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">
            {frontmatter.region}
          </span>
        </div>
        
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          {frontmatter.title}
        </h1>
        
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <time className="text-gray-400 text-sm">
              {date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <span className="text-gray-400 text-sm">{frontmatter.source}</span>
          </div>
        </div>
        
        {/* Content */}
        <article 
          className="prose prose-invert prose-lg max-w-none
            prose-headings:text-white prose-p:text-gray-300
            prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
            prose-hr:border-gray-700"
          dangerouslySetInnerHTML={{ __html: `<p class="mb-4 text-gray-300 text-lg leading-relaxed">${content}</p>` }}
        />
        
        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <a 
            href={frontmatter.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Original Source
          </a>
        </div>
      </div>
    </div>
  );
}
