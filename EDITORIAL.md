# Editorial Workflow

## Adding New Articles

### Method 1: Create Markdown File

1. Create new file in `/content/articles/YYYY-MM-DD-slug.md`

2. Add frontmatter:
```markdown
---
title: "Your Article Title"
date: 2026-03-05T12:00:00Z
category: "geopolitics" | "business" | "wellbeing" | "sports" | "opinion"
author: "Writer Name"
source: "Monexus News"
completeness: "draft" | "complete"
---

# Lead
Your opening paragraph here.

## Section Heading
Content continues...

## Sources
- Source 1
- Source 2

## What's Being Hidden
Hidden context here.

## Key Questions
- Question 1?
- Question 2?

## Kicker
Closing thought here.
```

3. Rebuild:
```bash
cd /root/.openclaw/workspace/news-publishing
npm run build
pm2 restart news-site
```

### Method 2: Use Conversion Script

1. Add article to `/news-main/data/editorial-articles.json`
2. Run:
```bash
python3 scripts/convert_editorial.py
npm run build
pm2 restart news-site
```

## Categories

- **geopolitics** - Global affairs, conflict, international relations
- **business** - Markets, economy, financial analysis
- **wellbeing** - Health, society, quality of life
- **sports** - Sports coverage and analysis
- **opinion** - Editorials, commentary, analysis

## Article Structure (Monexus Style)

### Lead
Opening paragraph that hooks the reader and establishes stakes.

### Body Sections
Organized with H2 headings for readability.

### Sources
List of sources and references.

### What's Being Hidden
Context that mainstream coverage misses.

### Key Questions
Questions readers should be asking.

### Kicker
Closing thought that resonates.

## File Naming Convention

Format: `YYYY-MM-DD-slug.md`

Examples:
- `2026-03-05-us-iran-escalation.md`
- `2026-03-05-fed-rate-decision.md`
- `2026-03-05-sleep-science.md`

## Deployment

After adding articles:
```bash
cd /root/.openclaw/workspace/news-publishing
npm run build
pm2 restart news-site
```

Site updates within seconds.
