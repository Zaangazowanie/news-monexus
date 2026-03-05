// lib/unsplash.ts
interface UnsplashImage {
  url: string;
  author: string;
  authorLink: string;
  downloadLocation: string;
}

const CATEGORY_KEYWORDS: Record<string, string> = {
  geopolitics: 'politics,government,international,diplomacy',
  business: 'finance,markets,corporate,office',
  sports: 'stadium,athlete,competition,sports',
  wellbeing: 'health,wellness,medical,fitness',
  'africa tech': 'africa,technology,innovation,startup',
  crypto: 'cryptocurrency,bitcoin,blockchain,digital',
  climate: 'climate,environment,nature,renewable',
  enterprise: 'business,technology,modern,professional'
};

export async function fetchCategoryImage(
  category: string,
  width: number = 800
): Promise<UnsplashImage | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.warn('UNSPLASH_ACCESS_KEY not set');
    return null;
  }

  const keywords = CATEGORY_KEYWORDS[category] || 'news,journalism';
  
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(keywords)}&w=${width}&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${accessKey}`
        }
      }
    );

    if (!response.ok) throw new Error(`Unsplash API error: ${response.status}`);
    
    const data = await response.json();
    
    return {
      url: data.urls.regular,
      author: data.user.name,
      authorLink: data.user.links.html,
      downloadLocation: data.links.download_location
    };
  } catch (error) {
    console.error('Failed to fetch Unsplash image:', error);
    return null;
  }
}

// For sync script — batch fetch with rate limit protection
export async function enrichArticlesWithImages(
  articles: any[],
  delayMs: number = 100
): Promise<any[]> {
  const enriched = [];
  
  for (const article of articles) {
    const image = await fetchCategoryImage(article.category, 800);
    if (image) {
      // Trigger download attribution (required by Unsplash)
      fetch(image.downloadLocation, {
        headers: { 'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` }
      }).catch(() => {}); // Non-blocking
    }
    
    enriched.push({
      ...article,
      image: image ? {
        url: image.url,
        author: image.author,
        authorLink: image.authorLink
      } : null
    });
    
    // Rate limit protection: 50 req/hour on demo, 5000 on production
    await new Promise(r => setTimeout(r, delayMs));
  }
  
  return enriched;
}
