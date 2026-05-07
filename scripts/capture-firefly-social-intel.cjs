/**
 * Firefly Social Intelligence + SEO Action Report
 * Fetches Reddit, YouTube (via Brave), Twitter/X (via Brave), and news per keyword.
 * Combines with explicit per-keyword recommendation cards.
 *
 * Output: docs/Adobe-Firefly-Social-Intel-Report.html + PDF on Desktop
 */

const fs   = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const BRAVE_KEY = process.env.BRAVE_API_KEY;
if (!BRAVE_KEY) throw new Error('BRAVE_API_KEY not set in .env');

const OUT_DIR  = path.join(__dirname, '../docs');
const HTML_OUT = path.join(OUT_DIR, 'Adobe-Firefly-Social-Intel-Report.html');
const PDF_DEST = path.join(OUT_DIR, 'Adobe-Firefly-Social-Intel-Report-2026-05.pdf');

// ---------------------------------------------------------------------------
// Per-keyword definitions with EXPLICIT recommendation cards
// ---------------------------------------------------------------------------

const TOPICS = [
  {
    id: 'commercial-safe',
    cluster: 'A — Commercial Safety',
    clusterColor: '#138808',
    title: '"Commercially Safe AI Image Generator"',
    monthlySearches: '~87K/mo combined',
    adobeRank: 'Not ranking',
    who1: 'Generic listicles / Ideogram',
    redditQuery: 'adobe firefly commercial use safe',
    braveYTQuery: 'adobe firefly commercial use license site:youtube.com',
    braveTWQuery: 'adobe firefly commercially safe OR ip indemnification site:x.com OR site:twitter.com',
    braveNewsQuery: 'midjourney lawsuit disney NBC ip copyright 2025 2026',
    recommendation: {
      urgency: 'P0 — Create within 7 days',
      pages: [
        {
          url: '/products/firefly/commercial-safe-ai',
          h1: 'The Only Commercially Safe AI Image Generator — Adobe Firefly',
          openingCopy: 'Adobe Firefly is the only major AI image generator trained exclusively on licensed Adobe Stock imagery — with zero scraped web content. Every paid plan includes enterprise IP indemnification: if a third-party IP claim arises from your Firefly output, Adobe defends you and pays damages. Midjourney, DALL-E, Canva AI, and Stable Diffusion offer no such protection.',
          faqSchema: [
            { q: 'Is Adobe Firefly commercially safe?', a: 'Yes. Firefly is trained on licensed data only and includes IP indemnification on paid plans — meaning Adobe covers legal costs if a third-party IP claim arises from your output.' },
            { q: 'Which AI image generators are safe for commercial use?', a: 'Adobe Firefly is the only major platform offering enterprise IP indemnification. Midjourney, DALL-E, Canva AI, and Stable Diffusion do not.' },
            { q: 'What does IP indemnification mean for AI art?', a: 'IP indemnification means the platform legally defends you against copyright or IP claims on generated outputs. Adobe Firefly enterprise plans include contractual indemnification — the only AI image product with this in 2026.' },
          ],
          contentOutline: [
            'H1 + answer-first 2 sentences (quotable for GEO citations)',
            'Comparison table: Firefly / Midjourney / DALL-E / Canva AI / SD — columns: training data, indemnification, lawsuit exposure, commercial license',
            'Section: "What IP indemnification means" — translate legal language to buyer language',
            'Section: "Midjourney\'s active lawsuits" — Disney, NBCUniversal — procurement blocker context',
            'Case study: enterprise brand using Firefly for campaign assets with legal sign-off',
            '3 FAQ schema items (above)',
            'CTA: "Try Firefly free" + Enterprise contact',
            'Internal links: /products/firefly, /firefly/vs/midjourney, Photoshop Generative Fill page',
          ],
          internalLinks: ['Photoshop Generative Fill page', '/products/firefly/enterprise', '/firefly/vs/midjourney'],
          timeToRank: '30–45 days',
          metric: 'Impressions on commercial-safe + commercial-use cluster in Search Console; Enterprise trial starts',
          geoWin: 'Answer to: "What is the best commercially safe AI image generator?" — Perplexity and Google AI Overviews',
        },
      ],
    },
  },

  {
    id: 'midjourney-alt',
    cluster: 'B — Competitor Conquest',
    clusterColor: '#E64646',
    title: '"Midjourney Alternative" / "Midjourney vs Adobe Firefly"',
    monthlySearches: '~128K/mo combined',
    adobeRank: 'Not ranking',
    who1: 'Alternatives.co / techradar / Zapier listicles',
    redditQuery: 'midjourney vs adobe firefly which is better',
    braveYTQuery: 'midjourney vs adobe firefly comparison 2025 2026 site:youtube.com',
    braveTWQuery: 'midjourney lawsuit OR midjourney alternative firefly site:x.com OR site:twitter.com',
    braveNewsQuery: 'midjourney lawsuit disney nbc 2025 2026 settlement',
    recommendation: {
      urgency: 'P0 — Create within 7 days',
      pages: [
        {
          url: '/products/firefly/vs/midjourney',
          h1: 'Adobe Firefly vs. Midjourney: Which Is Right for Commercial Teams?',
          openingCopy: 'Midjourney produces stunning images but faces active IP lawsuits from Disney and NBCUniversal — making it a procurement blocker for most enterprise legal teams. Adobe Firefly offers enterprise IP indemnification, native Photoshop integration, and Custom Models trained on your brand library. If your outputs will appear in advertising, packaging, or client work, Firefly is the only commercially approved option.',
          faqSchema: [
            { q: 'Is Midjourney safe for commercial use?', a: 'Midjourney faces active IP lawsuits from Disney and NBCUniversal in 2025–2026. Most enterprise legal teams have flagged Midjourney as a procurement risk. Adobe Firefly includes IP indemnification — the legally safe alternative.' },
            { q: 'Adobe Firefly vs Midjourney — which is better for brands?', a: 'For brand teams: Firefly wins on legal safety (IP indemnification), CC integration, and Custom Models. For maximum creative range: Midjourney wins. For enterprise or agency work where legal approval is required, Firefly is the only viable option.' },
            { q: 'Can enterprises use Midjourney?', a: 'Enterprise legal teams widely flag Midjourney due to active IP lawsuits. Adobe Firefly is the enterprise-approved alternative with contractual IP indemnification included.' },
          ],
          contentOutline: [
            'H1 + answer-first paragraph leading with the lawsuit angle (quotable)',
            'Comparison table: 10 dimensions — IP safety, CC integration, Custom Models, free tier, price, output quality, enterprise SSO, API availability, training data, indemnification',
            'Section: "When to choose Midjourney" (honest, builds trust)',
            'Section: "When Firefly wins" — legal teams, brand consistency, enterprise, CC-integrated workflows',
            'Section: "Midjourney\'s current legal situation" — active lawsuits, procurement risk',
            'FAQ schema (above)',
            'CTA: "Switch to Firefly — try free, no credit card"',
            'Internal links: /commercial-safe-ai, /features/custom-models, Photoshop page',
          ],
          internalLinks: ['/products/firefly/commercial-safe-ai', '/products/firefly/features/custom-models', '/products/photoshop'],
          timeToRank: '45–60 days',
          metric: 'Rank for "midjourney alternative" (target: top 3); organic clicks from MJ-switching users',
          geoWin: 'Answer to: "Can I use Midjourney commercially?" — GEO answer on every AI assistant',
        },
      ],
    },
  },

  {
    id: 'canva-alt',
    cluster: 'B — Competitor Conquest',
    clusterColor: '#E64646',
    title: '"Canva AI Alternative" / "Canva vs Adobe Firefly"',
    monthlySearches: '~40K/mo combined',
    adobeRank: 'Not ranking',
    who1: 'Zapier / G2 / TechRadar listicles',
    redditQuery: 'canva vs adobe firefly ai which should I use',
    braveYTQuery: 'canva ai vs adobe firefly 2025 2026 comparison site:youtube.com',
    braveTWQuery: 'canva ai OR canva magic studio vs adobe firefly site:x.com OR site:twitter.com',
    braveNewsQuery: 'canva ai image generator custom brand 2025 2026',
    recommendation: {
      urgency: 'P1 — Create within 14 days',
      pages: [
        {
          url: '/products/firefly/vs/canva-ai',
          h1: 'Adobe Firefly vs. Canva AI: Custom Brand Models vs. Generic Templates',
          openingCopy: 'Canva AI generates images quickly and integrates with Canva\'s 260M user template library — but every image is generated from a generic model, meaning your outputs look like everyone else\'s. Adobe Firefly Custom Models trains on your own brand image library: your specific visual style, color palette, and product imagery. For brand teams who need on-brand outputs without manual editing, Firefly Custom Models is the only solution.',
          faqSchema: [
            { q: 'Adobe Firefly vs Canva AI — which is better?', a: 'Canva AI is faster for casual social content. Firefly is better for enterprise brand work: Custom Models trained on your own images, IP indemnification, and native Photoshop/Illustrator integration.' },
            { q: 'Can Canva AI generate brand-consistent images?', a: 'Canva AI uses generic models — all users share the same generation style. Adobe Firefly Custom Models trains on your specific brand imagery, producing on-brand outputs automatically.' },
            { q: 'Does Canva AI have IP indemnification?', a: 'No. Canva AI does not offer IP indemnification. Adobe Firefly enterprise plans include IP indemnification — Adobe defends you against third-party IP claims on generated outputs.' },
          ],
          contentOutline: [
            'H1 + answer-first paragraph on the brand consistency angle',
            'Comparison table: Custom Models, IP indemnification, price, CC integration, template library, free tier',
            '"Canva wins when" section (honest)',
            '"Firefly wins when" section — brand teams, regulated industries, CC workflows',
            'Custom Models demo: "Your logo + 50 product images → every Firefly output matches your brand"',
            'FAQ schema (above)',
            'CTA: "Try Custom Models free for 30 days"',
          ],
          internalLinks: ['/products/firefly/features/custom-models', '/products/firefly/commercial-safe-ai'],
          timeToRank: '30–45 days',
          metric: 'Rank for "canva ai alternative" (target: top 5); Custom Models trial starts from page',
          geoWin: 'Answer to: "What is the best AI image generator for brands?" on ChatGPT/Perplexity',
        },
      ],
    },
  },

  {
    id: 'ai-vector',
    cluster: 'C — Unique Features',
    clusterColor: '#7B4FDB',
    title: '"AI Vector Generator" / "Text to Vector AI"',
    monthlySearches: '~62K/mo combined',
    adobeRank: 'Not ranking',
    who1: 'Vectorizer.ai / Canva Magic Media / generic listicles',
    redditQuery: 'ai vector generator best tool 2025 2026',
    braveYTQuery: 'ai text to vector generator 2025 adobe firefly illustrator site:youtube.com',
    braveTWQuery: 'ai vector generator OR text to vector ai site:x.com OR site:twitter.com',
    braveNewsQuery: 'adobe firefly text to vector illustrator 2025 2026',
    recommendation: {
      urgency: 'P1 — Create within 14 days',
      pages: [
        {
          url: '/products/firefly/features/text-to-vector',
          h1: 'Text to Vector AI — Generate Editable Vector Graphics with Adobe Firefly',
          openingCopy: 'Adobe Firefly is the only major AI image generator that produces fully editable vector graphics — with separate paths, layers, and anchor points, exportable directly to Illustrator in .ai or .svg format. Every other AI image tool (Midjourney, DALL-E, Canva, Stable Diffusion) generates rasters only. Type your prompt, get an editable vector in seconds.',
          faqSchema: [
            { q: 'Can AI generate vector graphics?', a: 'Yes. Adobe Firefly\'s Text to Vector feature generates fully editable .svg and .ai vector files from text prompts. This is the only AI image generator that produces native vector output — competitors like Midjourney and DALL-E produce raster images only.' },
            { q: 'What is the best AI vector generator?', a: 'Adobe Firefly Text to Vector is the only AI tool that generates native editable vector graphics (SVG/AI format with separate paths and layers). Other tools like Vectorizer.ai convert rasters to vectors — Firefly generates vectors natively from text.' },
            { q: 'Can I use AI-generated vectors in Illustrator?', a: 'Yes. Firefly Text to Vector exports directly to Adobe Illustrator as .ai files with fully editable paths, anchor points, and layers — no conversion step required.' },
          ],
          contentOutline: [
            'H1 + answer-first paragraph: "only AI that generates editable vectors" — the key differentiator',
            'Before/after visual: Midjourney raster (pixelates when scaled) vs Firefly vector (scales infinitely)',
            'Step-by-step: type prompt → generate vector → open in Illustrator → edit paths',
            '"Export formats: SVG, AI, PDF — all editable" specs block',
            'Use case gallery: logos, icons, illustrations, infographics',
            'Comparison: Firefly Text to Vector vs Vectorizer.ai vs Canva Magic Media vs Midjourney',
            'FAQ schema (above)',
            'CTA: "Try Text to Vector free — 25 vectors/month on free plan"',
            'Internal links: Illustrator integration page, Firefly features overview',
          ],
          internalLinks: ['/products/illustrator', '/products/firefly', '/products/firefly/features'],
          timeToRank: '14–21 days',
          metric: 'Rank for "ai vector generator" (target: #1 — zero competition currently); Illustrator integration page referrals',
          geoWin: 'Answer to: "What AI can generate vector graphics?" — currently no clear AI answer exists',
        },
      ],
    },
  },

  {
    id: 'photoshop-ai',
    cluster: 'C — Unique Features',
    clusterColor: '#7B4FDB',
    title: '"AI Image Generator Photoshop" / "Generative Fill"',
    monthlySearches: '~35K/mo',
    adobeRank: 'Not ranking on generic query',
    who1: 'YouTube tutorials / How-to articles',
    redditQuery: 'adobe firefly photoshop generative fill workflow',
    braveYTQuery: 'adobe firefly generative fill photoshop tutorial 2025 site:youtube.com',
    braveTWQuery: 'generative fill photoshop firefly site:x.com OR site:twitter.com',
    braveNewsQuery: 'adobe photoshop generative fill firefly update 2025 2026',
    recommendation: {
      urgency: 'P1 — Create within 14 days',
      pages: [
        {
          url: '/products/firefly/photoshop-integration',
          h1: 'AI Image Generator Built Into Photoshop — Adobe Firefly Generative Fill',
          openingCopy: 'Adobe Firefly is the only AI image generator with native Photoshop integration. Generative Fill lets you select any area of a photo and generate new content directly in Photoshop — no app switching, no file export, no quality loss from compression. Select, describe, generate. Firefly runs inside Photoshop on your active layer.',
          faqSchema: [
            { q: 'What AI image generator works inside Photoshop?', a: 'Adobe Firefly is natively integrated into Photoshop via Generative Fill and Generative Expand. You can generate, extend, or replace any part of an image directly in your Photoshop workspace — no external tool required.' },
            { q: 'How do I use AI to generate images in Photoshop?', a: 'In Photoshop, select any area with any selection tool, click the Generative Fill button in the contextual toolbar, type a description, and click Generate. Adobe Firefly generates on-brand, commercially safe content directly in your layer.' },
            { q: 'Is Generative Fill in Photoshop free?', a: 'Generative Fill is included in all Creative Cloud plans that include Photoshop. Each generation uses Firefly credits — Photoshop subscribers receive 1,000 credits per month.' },
          ],
          contentOutline: [
            'H1 + answer-first paragraph: native integration angle — the only AI that lives inside PS',
            'Step-by-step with screenshots: 1. select → 2. describe → 3. generate → 4. choose result',
            'Use cases: background replacement, object removal, product photography extension, image restoration',
            'Comparison: Firefly (native PS) vs Midjourney (export + manual compositing) vs DALL-E (export/re-import)',
            '"Included in your Creative Cloud plan" — activation CTA for existing CC subscribers',
            'FAQ schema (above)',
            'Internal links: /products/photoshop, /products/firefly, Generative Expand feature page',
          ],
          internalLinks: ['/products/photoshop', '/products/firefly', '/products/photoshop/generative-expand'],
          timeToRank: '30–45 days',
          metric: 'Rank for "ai image generator photoshop" (target: top 3); CC subscriber Firefly activation rate',
          geoWin: 'Answer to: "What AI image generator works inside Photoshop?" — high search intent, currently unclear AI answer',
        },
      ],
    },
  },
];

// ---------------------------------------------------------------------------
// Data fetching helpers
// ---------------------------------------------------------------------------

async function braveSearch(query, count = 6) {
  const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${count}&search_lang=en&country=us`;
  try {
    const r = await fetch(url, {
      headers: { 'Accept': 'application/json', 'X-Subscription-Token': BRAVE_KEY },
    });
    if (!r.ok) return [];
    const d = await r.json();
    return (d.web?.results || []).map(x => ({
      title: x.title || '',
      url:   x.url   || '',
      desc:  x.description || '',
    }));
  } catch { return []; }
}

async function redditSearch(query, limit = 8) {
  const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=top&t=year&limit=${limit}`;
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'CompetitiveIntelBot/1.0' } });
    if (!r.ok) return [];
    const d = await r.json();
    return (d.data?.children || []).map(p => ({
      title:    p.data.title || '',
      subreddit: `r/${p.data.subreddit}`,
      score:    p.data.score || 0,
      comments: p.data.num_comments || 0,
      url:      `https://reddit.com${p.data.permalink}`,
      text:     (p.data.selftext || '').slice(0, 200),
    }));
  } catch { return []; }
}

function sentimentLabel(posts) {
  const text = posts.map(p => p.title + ' ' + p.text).join(' ').toLowerCase();
  const pos = (text.match(/\b(great|love|amazing|best|excellent|better|recommend|win|fast|easy|safe|professional)\b/g) || []).length;
  const neg = (text.match(/\b(slow|bad|terrible|worse|hate|annoying|fail|behind|unreliable|expensive|hard|frustrating|disappointing|limited|stuck)\b/g) || []).length;
  if (pos > neg * 1.4) return { label: 'Mostly positive', color: '#138808' };
  if (neg > pos * 1.4) return { label: 'Mostly negative', color: '#c0392b' };
  return { label: 'Mixed', color: '#d97706' };
}

function domainIcon(url) {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return '▶';
  if (url.includes('twitter.com') || url.includes('x.com')) return '𝕏';
  if (url.includes('reddit.com')) return '🔴';
  return '🔗';
}

function isYT(url)   { return url.includes('youtube.com') || url.includes('youtu.be'); }
function isTwitter(url) { return url.includes('twitter.com') || url.includes('x.com'); }

// ---------------------------------------------------------------------------
// HTML helpers
// ---------------------------------------------------------------------------

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #f9f9fb; color: #1a1a2e; }

  .cover {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%);
    color: #fff; min-height: 100vh; display: flex; flex-direction: column;
    justify-content: center; align-items: flex-start; padding: 80px;
    page-break-after: always;
  }
  .cover-logo { font-size: 13px; letter-spacing: 3px; text-transform: uppercase; opacity: 0.6; margin-bottom: 48px; }
  .cover-title { font-size: 48px; font-weight: 800; line-height: 1.1; max-width: 780px; margin-bottom: 24px; }
  .cover-sub { font-size: 18px; opacity: 0.7; max-width: 600px; line-height: 1.6; margin-bottom: 48px; }
  .cover-meta { font-size: 12px; opacity: 0.5; letter-spacing: 1px; }
  .cover-pills { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 48px; }
  .pill { background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
          border-radius: 100px; padding: 6px 16px; font-size: 13px; font-weight: 600; }

  .section { padding: 60px 80px; page-break-before: always; }
  .section-header { margin-bottom: 40px; }
  .cluster-badge { display: inline-block; border-radius: 4px; padding: 4px 12px;
                   font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
                   color: #fff; margin-bottom: 16px; }
  .section-title { font-size: 32px; font-weight: 800; color: #1a1a2e; line-height: 1.2; margin-bottom: 8px; }
  .section-meta { display: flex; gap: 24px; flex-wrap: wrap; margin-top: 12px; }
  .meta-chip { background: #f0f0f8; border-radius: 6px; padding: 6px 14px; font-size: 13px; font-weight: 600; color: #555; }
  .meta-chip span { color: #1a1a2e; }

  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
  .three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 32px; }

  .card { background: #fff; border-radius: 12px; padding: 28px; border: 1px solid #e8e8f0; }
  .card-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
                color: #888; margin-bottom: 16px; }

  /* Recommendation card */
  .rec-card { background: #fff; border-radius: 16px; padding: 36px; border: 2px solid #1a1a2e;
              margin-bottom: 32px; page-break-inside: avoid; }
  .rec-urgency { display: inline-block; background: #1a1a2e; color: #fff; border-radius: 6px;
                  padding: 6px 14px; font-size: 12px; font-weight: 700; letter-spacing: 1px;
                  text-transform: uppercase; margin-bottom: 20px; }
  .rec-url { font-family: 'Courier New', monospace; font-size: 15px; font-weight: 700;
              color: #0066cc; background: #f0f5ff; border-radius: 6px; padding: 8px 14px;
              margin-bottom: 16px; display: inline-block; }
  .rec-h1 { font-size: 22px; font-weight: 800; color: #1a1a2e; margin-bottom: 16px; line-height: 1.3; }
  .rec-copy { font-size: 15px; color: #444; line-height: 1.7; margin-bottom: 24px;
               background: #f9f9fb; border-left: 4px solid #0066cc; padding: 16px 20px;
               border-radius: 0 8px 8px 0; font-style: italic; }
  .rec-section-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
                        color: #888; margin-bottom: 10px; margin-top: 20px; }
  .outline-list { list-style: none; }
  .outline-list li { padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333;
                      padding-left: 20px; position: relative; }
  .outline-list li::before { content: '→'; position: absolute; left: 0; color: #0066cc; font-weight: 700; }
  .faq-block { background: #f9fafb; border-radius: 10px; padding: 20px; margin-bottom: 8px; }
  .faq-q { font-size: 14px; font-weight: 700; color: #1a1a2e; margin-bottom: 6px; }
  .faq-q::before { content: 'Q: '; color: #0066cc; }
  .faq-a { font-size: 13px; color: #555; line-height: 1.6; }
  .faq-a::before { content: 'A: '; color: #138808; font-weight: 700; }
  .rec-metrics { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 20px; }
  .metric-chip { background: #f0f5ff; border: 1px solid #cce0ff; border-radius: 8px;
                  padding: 10px 16px; font-size: 13px; }
  .metric-chip strong { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;
                          color: #888; margin-bottom: 4px; }
  .geo-win-box { background: linear-gradient(135deg, #f0f5ff, #e8f4ff); border: 1px solid #cce0ff;
                  border-radius: 10px; padding: 16px 20px; margin-top: 20px; }
  .geo-win-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
                    color: #0066cc; margin-bottom: 6px; }
  .geo-win-text { font-size: 14px; color: #1a1a2e; }

  /* Social intelligence cards */
  .social-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 32px; }
  .social-card { background: #fff; border-radius: 12px; padding: 24px; border: 1px solid #e8e8f0;
                  page-break-inside: avoid; }
  .social-icon { font-size: 22px; margin-bottom: 8px; }
  .social-title { font-size: 14px; font-weight: 700; color: #1a1a2e; margin-bottom: 16px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; }
  .post-item { padding: 10px 0; border-bottom: 1px solid #f5f5f5; }
  .post-item:last-child { border-bottom: none; }
  .post-title { font-size: 13px; font-weight: 600; color: #222; line-height: 1.4; margin-bottom: 4px; }
  .post-meta { font-size: 11px; color: #888; }
  .sentiment-pill { display: inline-block; border-radius: 100px; padding: 3px 10px;
                     font-size: 11px; font-weight: 700; color: #fff; margin-bottom: 12px; }
  .yt-item { padding: 8px 0; border-bottom: 1px solid #f5f5f5; }
  .yt-item:last-child { border-bottom: none; }
  .yt-title { font-size: 13px; font-weight: 600; color: #222; line-height: 1.4; }
  .yt-channel { font-size: 11px; color: #888; }
  .tw-item { padding: 8px 0; border-bottom: 1px solid #f5f5f5; }
  .tw-title { font-size: 13px; color: #222; line-height: 1.4; }
  .tw-url  { font-size: 11px; color: #0066cc; word-break: break-all; }

  /* Quick-win summary box */
  .quick-win { background: linear-gradient(135deg, #fff8e1, #fff3cd); border: 1px solid #ffc107;
                border-radius: 12px; padding: 24px 28px; margin-bottom: 32px; }
  .quick-win-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
                      color: #b7791f; margin-bottom: 12px; }
  .quick-win-item { font-size: 14px; color: #555; padding: 6px 0; border-bottom: 1px solid rgba(0,0,0,0.06); }
  .quick-win-item:last-child { border-bottom: none; }
  .quick-win-item strong { color: #1a1a2e; }

  .divider { border: none; border-top: 1px solid #e8e8f0; margin: 32px 0; }

  @media print {
    .section { page-break-before: always; }
    .rec-card, .social-card { page-break-inside: avoid; }
  }
`;

function renderRecCard(page, clusterColor) {
  return `
    <div class="rec-card">
      <div class="rec-urgency">${page.urgency || 'Action Required'}</div>
      <div class="rec-section-label">Target URL</div>
      <div class="rec-url">${page.url}</div>
      <div class="rec-section-label">Page H1 Headline</div>
      <div class="rec-h1">${page.h1}</div>
      <div class="rec-section-label">GEO-Ready Opening Copy (answer-first — optimized for ChatGPT/Perplexity citations)</div>
      <div class="rec-copy">${page.openingCopy}</div>
      <div class="rec-section-label">Content Outline (build in this order)</div>
      <ul class="outline-list">
        ${page.contentOutline.map(i => `<li>${i}</li>`).join('')}
      </ul>
      <div class="rec-section-label">FAQ Schema (add to &lt;script type="application/ld+json"&gt;)</div>
      ${page.faqSchema.map(f => `
        <div class="faq-block">
          <div class="faq-q">${f.q}</div>
          <div class="faq-a">${f.a}</div>
        </div>
      `).join('')}
      <div class="rec-section-label">Internal Links to Add</div>
      <ul class="outline-list">
        ${page.internalLinks.map(l => `<li>${l}</li>`).join('')}
      </ul>
      <div class="rec-metrics">
        <div class="metric-chip"><strong>Time to Rank</strong>${page.timeToRank}</div>
        <div class="metric-chip"><strong>Success Metric</strong>${page.metric}</div>
      </div>
      <div class="geo-win-box">
        <div class="geo-win-label">GEO Win — Own This Answer in AI Overviews / ChatGPT / Perplexity</div>
        <div class="geo-win-text">${page.geoWin}</div>
      </div>
    </div>
  `;
}

function renderSocialSection(topic, redditPosts, ytResults, twResults) {
  const sentiment = sentimentLabel(redditPosts);

  const redditHtml = redditPosts.length ? redditPosts.slice(0, 6).map(p => `
    <div class="post-item">
      <div class="post-title">${p.title.slice(0, 100)}${p.title.length > 100 ? '…' : ''}</div>
      <div class="post-meta">${p.subreddit} · ${p.score.toLocaleString()} pts · ${p.comments} comments</div>
    </div>
  `).join('') : '<div class="post-meta">No results found</div>';

  const ytFiltered = ytResults.filter(r => isYT(r.url));
  const ytHtml = ytFiltered.length ? ytFiltered.slice(0, 5).map(r => `
    <div class="yt-item">
      <div class="yt-title">${r.title.slice(0, 80)}${r.title.length > 80 ? '…' : ''}</div>
      <div class="yt-channel">${r.url.replace('https://','').split('/').slice(0,2).join('/')}</div>
    </div>
  `).join('') : ytResults.slice(0, 5).map(r => `
    <div class="yt-item">
      <div class="yt-title">${r.title.slice(0, 80)}</div>
      <div class="yt-channel">${r.url.replace('https://','').split('/').slice(0,2).join('/')}</div>
    </div>
  `).join('');

  const twHtml = twResults.length ? twResults.slice(0, 5).map(r => `
    <div class="tw-item">
      <div class="tw-title">${r.title.slice(0, 90)}${r.title.length > 90 ? '…' : ''}</div>
      <div class="tw-url">${r.url.slice(0, 60)}</div>
    </div>
  `).join('') : '<div class="post-meta">No results found</div>';

  return `
    <div class="social-grid">
      <div class="social-card">
        <div class="social-icon">🔴</div>
        <div class="social-title">Reddit — What Customers Say</div>
        <div class="sentiment-pill" style="background:${sentiment.color}">${sentiment.label}</div>
        ${redditHtml}
      </div>
      <div class="social-card">
        <div class="social-icon">▶</div>
        <div class="social-title">YouTube — Video Activity</div>
        ${ytHtml || '<div class="post-meta">No results found</div>'}
      </div>
      <div class="social-card">
        <div class="social-icon">𝕏</div>
        <div class="social-title">Twitter / X — Discussions</div>
        ${twHtml}
      </div>
    </div>
  `;
}

function renderQuickWins() {
  return `
    <div class="quick-win">
      <div class="quick-win-title">⚡ Zero-Engineering Quick Wins (Do These Today)</div>
      <div class="quick-win-item"><strong>1. Add FAQ schema to existing Firefly pages</strong> — 2 hours of SEO work → AI Overview citations within 3 weeks. No engineering required.</div>
      <div class="quick-win-item"><strong>2. Add "Commercially safe · IP indemnified" to every Firefly page H1</strong> — CMS change only. Exact match for highest-intent commercial buyer queries that have zero competition.</div>
      <div class="quick-win-item"><strong>3. Add "No account needed for first 5 generations" to every free tool page</strong> — matches "no sign up" query modifier. Removes the #1 organic rank blocker.</div>
      <div class="quick-win-item"><strong>4. Update meta descriptions</strong> on all Firefly pages to include "commercially safe," "IP indemnification," "no copyright risk" — drives CTR from existing rankings.</div>
      <div class="quick-win-item"><strong>5. Add internal links from Photoshop, Illustrator, Express pages to /products/firefly</strong> — these are high-DA pages; internal link equity from them boosts Firefly's rankings.</div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

(async () => {
  console.log('Fetching social intelligence data...');

  const topicData = [];

  for (const topic of TOPICS) {
    console.log(`  Fetching data: ${topic.title}`);
    const [redditPosts, ytResults, twResults] = await Promise.all([
      redditSearch(topic.redditQuery, 8),
      braveSearch(topic.braveYTQuery, 6),
      braveSearch(topic.braveTWQuery, 6),
    ]);
    topicData.push({ topic, redditPosts, ytResults, twResults });
    await new Promise(r => setTimeout(r, 500)); // gentle rate limit
  }

  // Also fetch overall Midjourney lawsuit news
  console.log('  Fetching Midjourney lawsuit news...');
  const mjNews = await braveSearch('midjourney lawsuit disney NBC 2025 2026 ip copyright', 8);
  const mjTweets = await braveSearch('midjourney lawsuit site:x.com OR site:twitter.com 2025', 6);

  console.log('Building HTML report...');

  const sections = topicData.map(({ topic, redditPosts, ytResults, twResults }) => {
    const pages = topic.recommendation.pages;
    return `
      <div class="section">
        <div class="section-header">
          <div class="cluster-badge" style="background:${topic.clusterColor}">${topic.cluster}</div>
          <div class="section-title">${topic.title}</div>
          <div class="section-meta">
            <div class="meta-chip">Volume: <span>${topic.monthlySearches}</span></div>
            <div class="meta-chip">Adobe rank: <span>${topic.adobeRank}</span></div>
            <div class="meta-chip">#1 today: <span>${topic.who1}</span></div>
            <div class="meta-chip">Urgency: <span>${topic.recommendation.urgency}</span></div>
          </div>
        </div>

        <h3 style="font-size:16px;font-weight:700;color:#1a1a2e;margin-bottom:16px;">
          📋 Recommended Action — Exact Page to Build
        </h3>
        ${pages.map(p => renderRecCard(p, topic.clusterColor)).join('')}

        <h3 style="font-size:16px;font-weight:700;color:#1a1a2e;margin-bottom:16px;margin-top:32px;">
          📡 What the Market Is Saying — Reddit · YouTube · Twitter
        </h3>
        ${renderSocialSection(topic, redditPosts, ytResults, twResults)}
      </div>
    `;
  }).join('');

  // Midjourney lawsuit intelligence section
  const mjNewsHtml = mjNews.slice(0, 6).map(r => `
    <div class="post-item">
      <div class="post-title">${r.title.slice(0, 90)}</div>
      <div class="post-meta">${r.url.replace('https://','').split('/').slice(0,2).join('/')} · ${r.desc.slice(0,80)}</div>
    </div>
  `).join('');
  const mjTweetHtml = mjTweets.slice(0, 4).map(r => `
    <div class="tw-item">
      <div class="tw-title">${r.title.slice(0, 90)}</div>
      <div class="tw-url">${r.url.slice(0, 60)}</div>
    </div>
  `).join('');

  const mjSection = `
    <div class="section">
      <div class="section-header">
        <div class="cluster-badge" style="background:#c0392b">COMPETITIVE INTEL — LIVE THREAT</div>
        <div class="section-title">Midjourney Lawsuit Monitor — Active Procurement Blocker</div>
      </div>
      <div class="quick-win" style="background:linear-gradient(135deg,#fff0f0,#ffe8e8);border-color:#e74c3c;">
        <div class="quick-win-title" style="color:#c0392b;">⚠️ Why This Is a Live Revenue Opportunity for Firefly</div>
        <div class="quick-win-item"><strong>Disney & NBCUniversal lawsuits are active.</strong> Enterprise procurement teams are flagging Midjourney as blocked. Every enterprise using Midjourney right now is a warm Firefly lead.</div>
        <div class="quick-win-item"><strong>Action:</strong> Add "Midjourney lawsuit" + "commercially safe alternative" to paid search bidding immediately. These users are actively searching for alternatives.</div>
        <div class="quick-win-item"><strong>Action:</strong> Ensure /firefly/vs/midjourney exists and leads with the lawsuit angle — this is the highest-conversion message for enterprise buyers.</div>
      </div>
      <div class="two-col">
        <div class="card">
          <div class="card-title">Latest News — Midjourney Legal</div>
          ${mjNewsHtml}
        </div>
        <div class="card">
          <div class="card-title">𝕏 Twitter / X — Lawsuit Discussions</div>
          ${mjTweetHtml}
        </div>
      </div>
    </div>
  `;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Adobe Firefly — Social Intel &amp; SEO Action Report</title>
  <style>${CSS}</style>
</head>
<body>

  <!-- COVER -->
  <div class="cover">
    <div class="cover-logo">Adobe · Firefly Growth Intelligence · May 2026</div>
    <div class="cover-title">Firefly Social Intel &amp; SEO Action Report</div>
    <div class="cover-sub">What Reddit, YouTube &amp; Twitter are saying about every target keyword — plus exact pages to build, H1 headlines, FAQ schema, and time-to-rank estimates for each.</div>
    <div class="cover-pills">
      <div class="pill">5 Keyword Clusters</div>
      <div class="pill">Reddit Sentiment</div>
      <div class="pill">YouTube Activity</div>
      <div class="pill">Twitter/X Intel</div>
      <div class="pill">Midjourney Lawsuit Monitor</div>
      <div class="pill">GEO Answer Playbook</div>
    </div>
    <div class="cover-meta">INTERNAL · FOR: Growth PM · SEO · Content · Acquisition</div>
  </div>

  <!-- QUICK WINS -->
  <div class="section" style="page-break-before:always;">
    <div class="section-header">
      <div class="section-title">Quick Wins — Zero Engineering Required</div>
    </div>
    ${renderQuickWins()}

    <h3 style="font-size:18px;font-weight:800;margin-bottom:16px;margin-top:40px;">Priority Summary — Pages to Build</h3>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <thead>
        <tr style="background:#1a1a2e;color:#fff;">
          <th style="padding:12px 16px;text-align:left;">Priority</th>
          <th style="padding:12px 16px;text-align:left;">Page URL</th>
          <th style="padding:12px 16px;text-align:left;">Target Query</th>
          <th style="padding:12px 16px;text-align:left;">Volume</th>
          <th style="padding:12px 16px;text-align:left;">Adobe Now</th>
          <th style="padding:12px 16px;text-align:left;">Time to Rank</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background:#fff;">
          <td style="padding:10px 16px;font-weight:700;color:#c0392b;">P0</td>
          <td style="padding:10px 16px;font-family:monospace;font-size:12px;">/products/firefly/commercial-safe-ai</td>
          <td style="padding:10px 16px;">commercially safe ai image generator</td>
          <td style="padding:10px 16px;font-weight:700;">~87K/mo</td>
          <td style="padding:10px 16px;color:#c0392b;">Not ranking</td>
          <td style="padding:10px 16px;color:#138808;">30–45 days</td>
        </tr>
        <tr style="background:#f9f9fb;">
          <td style="padding:10px 16px;font-weight:700;color:#c0392b;">P0</td>
          <td style="padding:10px 16px;font-family:monospace;font-size:12px;">/products/firefly/vs/midjourney</td>
          <td style="padding:10px 16px;">midjourney alternative</td>
          <td style="padding:10px 16px;font-weight:700;">~128K/mo</td>
          <td style="padding:10px 16px;color:#c0392b;">Not ranking</td>
          <td style="padding:10px 16px;color:#138808;">45–60 days</td>
        </tr>
        <tr style="background:#fff;">
          <td style="padding:10px 16px;font-weight:700;color:#d97706;">P1</td>
          <td style="padding:10px 16px;font-family:monospace;font-size:12px;">/products/firefly/features/text-to-vector</td>
          <td style="padding:10px 16px;">ai vector generator</td>
          <td style="padding:10px 16px;font-weight:700;">~62K/mo</td>
          <td style="padding:10px 16px;color:#c0392b;">Not ranking</td>
          <td style="padding:10px 16px;color:#138808;">14–21 days ← FASTEST WIN</td>
        </tr>
        <tr style="background:#f9f9fb;">
          <td style="padding:10px 16px;font-weight:700;color:#d97706;">P1</td>
          <td style="padding:10px 16px;font-family:monospace;font-size:12px;">/products/firefly/vs/canva-ai</td>
          <td style="padding:10px 16px;">canva ai alternative</td>
          <td style="padding:10px 16px;font-weight:700;">~40K/mo</td>
          <td style="padding:10px 16px;color:#c0392b;">Not ranking</td>
          <td style="padding:10px 16px;color:#138808;">30–45 days</td>
        </tr>
        <tr style="background:#fff;">
          <td style="padding:10px 16px;font-weight:700;color:#d97706;">P1</td>
          <td style="padding:10px 16px;font-family:monospace;font-size:12px;">/products/firefly/photoshop-integration</td>
          <td style="padding:10px 16px;">ai image generator photoshop</td>
          <td style="padding:10px 16px;font-weight:700;">~35K/mo</td>
          <td style="padding:10px 16px;color:#c0392b;">Not ranking</td>
          <td style="padding:10px 16px;color:#138808;">30–45 days</td>
        </tr>
      </tbody>
    </table>
  </div>

  ${sections}
  ${mjSection}

</body>
</html>`;

  fs.writeFileSync(HTML_OUT, html, 'utf8');
  console.log(`HTML → ${HTML_OUT}`);

  // PDF via puppeteer
  console.log('Generating PDF...');
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfPath = path.join(require('os').homedir(), 'Desktop', 'Adobe-Firefly-Social-Intel-Report-2026-05.pdf');
  await page.pdf({ path: pdfPath, format: 'A4', printBackground: true, margin: { top: '0', bottom: '0', left: '0', right: '0' } });
  await browser.close();
  console.log(`PDF → ${pdfPath}`);
  console.log('Done.');
})();
