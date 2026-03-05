// lib/stability.ts
interface LogoResult {
  url: string;
  seed: number;
}

const LOGO_PROMPTS = {
  terminal: "A minimalist logo for 'MONEXUS TERMINAL', monospace font, glowing cyan-green circuit lines on dark background, cyberpunk aesthetic, clean vector style, professional tech brand",
  news: "A bold newspaper logo for 'MONEXUS NEWS', serif typography, classic red and black colors, professional journalism aesthetic, clean design, authoritative"
};

export async function generateLogo(
  variant: 'terminal' | 'news',
  width: number = 1024,
  height: number = 1024
): Promise<LogoResult | null> {
  const apiKey = process.env.STABILITY_API_KEY;
  if (!apiKey) {
    console.warn('STABILITY_API_KEY not set');
    return null;
  }

  try {
    const response = await fetch(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          text_prompts: [{ text: LOGO_PROMPTS[variant], weight: 1 }],
          cfg_scale: 7,
          samples: 1,
          steps: 30,
          width,
          height
        })
      }
    );

    if (!response.ok) throw new Error(`Stability API error: ${response.status}`);
    const data = await response.json();
    
    return {
      url: `data:image/png;base64,${data.artifacts[0].base64}`,
      seed: data.artifacts[0].seed
    };
  } catch (error) {
    console.error('Failed to generate logo:', error);
    return null;
  }
}
