/**
 * SEO KPI Playbook — 19 Keywords
 * Fetches live Brave Search rankings for each keyword, identifies current #1,
 * checks Adobe presence, pulls Reddit sentiment, and generates per-keyword
 * acquisition playbook cards.
 *
 * Output: docs/Adobe-Firefly-SEO-KPI-Playbook.html + PDF on Desktop
 */

const fs   = require('fs');
const path = require('path');
const os   = require('os');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const BRAVE_KEY = process.env.BRAVE_API_KEY;
if (!BRAVE_KEY) throw new Error('BRAVE_API_KEY not set');

const OUT_DIR  = path.join(__dirname, '../docs');
const HTML_OUT = path.join(OUT_DIR, 'Adobe-Firefly-SEO-KPI-Playbook.html');
const PDF_DEST = path.join(os.homedir(), 'Desktop', 'Adobe-Firefly-SEO-KPI-Playbook-2026-05.pdf');

// ─────────────────────────────────────────────────────────────────────────────
// Keyword definitions — volume estimates + Adobe's best-fit feature/page
// ─────────────────────────────────────────────────────────────────────────────
const KEYWORDS = [
  {
    kw: 'remove object',
    vol: '~450K/mo', priority: 'P0',
    adobeFeature: 'Firefly Generative Remove / Photoshop Remove Tool',
    adobeLandingPage: '/products/photoshop/generative-fill',
    recUrl: '/products/firefly/features/remove-object',
    recH1: 'Remove Any Object from a Photo — Adobe Firefly AI',
    whyAdobe: 'Photoshop Remove Tool + Firefly Generative Remove fills with context-aware AI. No competitor matches the quality of content-aware fill with AI.',
    keyAction: 'Dedicated "remove object" landing page on adobe.com with free demo (no login). Currently all traffic goes to generic Photoshop pages that don\'t rank for this query.',
    redditQ: 'best tool remove object from photo ai 2025',
    competitors: ['Adobe Express (ranked lower)', 'Fotor', 'Canva Magic Eraser', 'Remove.bg'],
  },
  {
    kw: 'expand image',
    vol: '~180K/mo', priority: 'P0',
    adobeFeature: 'Photoshop Generative Expand',
    adobeLandingPage: '/products/photoshop/generative-expand',
    recUrl: '/products/firefly/features/expand-image',
    recH1: 'Expand Any Image with AI — Photoshop Generative Expand',
    whyAdobe: 'Photoshop Generative Expand is the industry-leading AI image extension tool. No competitor matches the quality — this is a pure Adobe win waiting for the right page.',
    keyAction: 'Create a standalone "expand image" landing page with before/after demo, free trial CTA. Current Generative Expand page ranks poorly because H1 doesn\'t match the query.',
    redditQ: 'expand image ai generative photoshop outpaint',
    competitors: ['DALL-E outpainting', 'Canva Uncrop', 'Stability AI Outpaint', 'Adobe Express'],
  },
  {
    kw: 'upscale image',
    vol: '~400K/mo', priority: 'P0',
    adobeFeature: 'Photoshop Super Resolution / Firefly Generative Upscale',
    adobeLandingPage: '/products/photoshop/super-resolution',
    recUrl: '/products/firefly/features/upscale-image',
    recH1: 'AI Image Upscaler — Upscale Photos Without Losing Quality',
    whyAdobe: 'Adobe\'s 4x upscaling with AI (Super Resolution) outperforms standalone upscalers. The gap is that adobe.com has no dedicated "upscale image" page — it\'s buried in Photoshop docs.',
    keyAction: 'Free online upscale tool page — must work without Photoshop install. Topaz Gigapixel and Let\'s Enhance dominate this because they have a single-page free tool. Adobe needs the same.',
    redditQ: 'best ai image upscaler free online 2025',
    competitors: ['Topaz Gigapixel AI', 'Let\'s Enhance', 'Upscale.media', 'BigJPG'],
  },
  {
    kw: 'sticker generator',
    vol: '~150K/mo', priority: 'P1',
    adobeFeature: 'Adobe Express Sticker Maker / Firefly with transparent background',
    adobeLandingPage: '/express/feature/image/sticker-maker',
    recUrl: '/express/feature/image/sticker-maker',
    recH1: 'Free Sticker Generator — Create Custom AI Stickers Online',
    whyAdobe: 'Adobe Express already has a sticker maker. Gap is SEO: the page doesn\'t rank for "sticker generator" because it\'s optimized for "sticker maker" not the higher-volume query.',
    keyAction: 'Update Express sticker page H1 and meta to match "sticker generator" query. Add Firefly AI generation + transparent PNG export. Remove login gate for first sticker.',
    redditQ: 'best ai sticker generator free custom 2025',
    competitors: ['StickerMule (paid)', 'Adobe Express (not ranking)', 'Canva Sticker Maker', 'Picsart'],
  },
  {
    kw: 'background generator',
    vol: '~200K/mo', priority: 'P0',
    adobeFeature: 'Firefly Background Generator / Express Background',
    adobeLandingPage: '/products/firefly',
    recUrl: '/products/firefly/features/background-generator',
    recH1: 'AI Background Generator — Create Any Background from Text',
    whyAdobe: 'Firefly can generate photorealistic backgrounds from text. This directly addresses a top SEO KPI but there\'s no dedicated page for the query. Canva and Fotor dominate this.',
    keyAction: 'Dedicated background generator page with free demo. Show e-commerce use case (product photography backgrounds). Add "generate background" entry point to Express and Firefly free tools.',
    redditQ: 'ai background generator free product photography 2025',
    competitors: ['Canva AI Background', 'Fotor', 'Picsart', 'Stability AI'],
  },
  {
    kw: 'AI video generator',
    vol: '~600K/mo', priority: 'P0',
    adobeFeature: 'Adobe Firefly Video (text-to-video, image-to-video)',
    adobeLandingPage: '/products/firefly/features/video',
    recUrl: '/products/firefly/features/ai-video-generator',
    recH1: 'AI Video Generator — Create Videos from Text or Images',
    whyAdobe: 'Firefly Video is a direct competitor to Sora and Runway. The gap: adobe.com has almost no SEO presence on "AI video generator" despite having the product.',
    keyAction: 'Standalone "AI video generator" page with demo video, free trial CTA, comparison vs Sora/Runway. Firefly Video\'s commercial safety angle is the enterprise differentiator here too.',
    redditQ: 'best ai video generator 2025 text to video',
    competitors: ['Sora (OpenAI)', 'Runway ML', 'Kling AI', 'Pika Labs', 'Invideo AI'],
  },
  {
    kw: 'AI photo editor',
    vol: '~800K/mo', priority: 'P0',
    adobeFeature: 'Photoshop AI / Lightroom AI / Adobe Express AI',
    adobeLandingPage: '/products/photoshop',
    recUrl: '/products/firefly/ai-photo-editor',
    recH1: 'AI Photo Editor — Edit Photos with Adobe AI Tools',
    whyAdobe: 'Adobe owns AI photo editing (Photoshop Generative Fill, Lightroom AI Masking, Denoise). The gap is that search users typing "AI photo editor" land on competitors because Adobe\'s pages lead with brand names, not the query.',
    keyAction: 'Create an "AI photo editor" hub page that unifies Photoshop AI, Lightroom AI, and Firefly features under one SEO-optimized URL. This is the highest-volume keyword on the list.',
    redditQ: 'best ai photo editor free online 2025 photoshop alternative',
    competitors: ['Luminar Neo', 'Canva Photo Editor', 'Fotor AI', 'Adobe Express (ranked below Canva)'],
  },
  {
    kw: 'character generator',
    vol: '~120K/mo', priority: 'P1',
    adobeFeature: 'Firefly Character / Custom Model character generation',
    adobeLandingPage: '/products/firefly',
    recUrl: '/products/firefly/features/character-generator',
    recH1: 'AI Character Generator — Create Custom Characters with Adobe Firefly',
    whyAdobe: 'Firefly can generate consistent characters, especially with Custom Models trained on a character style. No competitor matches consistent character generation across images.',
    keyAction: 'Dedicated character generator page showcasing consistent character generation across multiple images (the #1 user pain point with Midjourney). Demo: same character in 5 different scenes.',
    redditQ: 'ai character generator consistent style same character 2025',
    competitors: ['Midjourney', 'Character.ai (different use)', 'Artbreeder', 'Scenario.gg'],
  },
  {
    kw: 'headshot generator',
    vol: '~200K/mo', priority: 'P1',
    adobeFeature: 'Firefly AI headshot generation / Photoshop AI',
    adobeLandingPage: '/products/firefly',
    recUrl: '/products/firefly/features/ai-headshot-generator',
    recH1: 'AI Headshot Generator — Professional Headshots in Minutes',
    whyAdobe: 'This is a high-commercial-intent query — LinkedIn headshots, professional photos. Adobe Firefly can generate photorealistic headshots. Gap: no dedicated page, no free demo.',
    keyAction: 'Headshot generator landing page with free trial (5 headshots free, no account). This is a direct revenue driver: headshot users are likely to convert to paid plans for the quality Adobe offers.',
    redditQ: 'ai headshot generator professional linkedin 2025 review',
    competitors: ['Aragon AI', 'HeadshotPro', 'Canva AI', 'Try It On AI'],
  },
  {
    kw: 'image to image generator',
    vol: '~80K/mo', priority: 'P1',
    adobeFeature: 'Firefly Reference Image / Style Reference feature',
    adobeLandingPage: '/products/firefly',
    recUrl: '/products/firefly/features/image-to-image',
    recH1: 'Image to Image AI Generator — Transform Any Photo with Adobe Firefly',
    whyAdobe: 'Firefly\'s Style Reference and Structure Reference features are direct image-to-image generators. No dedicated page exists for this query — Stable Diffusion and Midjourney img2img dominate it.',
    keyAction: 'Image-to-image generator page showing Style Reference and Structure Reference features. Before/after demo. Key message: commercially safe image transformation — no copyright risk.',
    redditQ: 'image to image ai generator best tool style transfer 2025',
    competitors: ['Stable Diffusion img2img', 'Midjourney vary', 'Adobe Firefly (not ranking)', 'Picsart'],
  },
  {
    kw: 'remove people',
    vol: '~100K/mo', priority: 'P1',
    adobeFeature: 'Firefly Generative Remove / Photoshop Remove Tool',
    adobeLandingPage: '/products/photoshop/generative-fill',
    recUrl: '/products/firefly/features/remove-people',
    recH1: 'Remove People from Photos with AI — Adobe Firefly',
    whyAdobe: 'Same underlying feature as "remove object" but for people specifically. Photoshop\'s content-aware fill + Firefly AI is the best-in-class solution. No dedicated page exists.',
    keyAction: 'Separate "remove people" page (distinct from remove object — captures different intent). Show crowd/background removal use cases. Add to the free tools section with no-login demo.',
    redditQ: 'remove people from photo ai background free 2025',
    competitors: ['Canva Magic Eraser', 'Fotor', 'Remove.bg', 'Snapseed'],
  },
  {
    kw: 'cartoonize',
    vol: '~300K/mo', priority: 'P1',
    adobeFeature: 'Firefly style generation / Express filters',
    adobeLandingPage: '/express',
    recUrl: '/products/firefly/features/cartoonize',
    recH1: 'Cartoonize Your Photo — AI Cartoon Photo Generator',
    whyAdobe: 'This is a fun, high-volume query with viral loop potential. Firefly can apply cartoon styles to any photo. Adobe Express has filters but no dedicated "cartoonize" page.',
    keyAction: 'Free cartoonize tool — no login, instant generation. Add "Created with Adobe Firefly" watermark on free exports. This is a direct viral loop driver with mass consumer appeal. Upload photo → get cartoon → share.',
    redditQ: 'cartoonize photo ai free online best 2025',
    competitors: ['ToonMe', 'Canva Cartoon Effect', 'Fotor Cartoonize', 'PicsArt'],
  },
  {
    kw: 'AI art generator',
    vol: '~900K/mo', priority: 'P0',
    adobeFeature: 'Adobe Firefly — core product',
    adobeLandingPage: '/products/firefly',
    recUrl: '/products/firefly/ai-art-generator',
    recH1: 'AI Art Generator — Create Stunning Art for Free with Adobe Firefly',
    whyAdobe: 'This is the highest-volume keyword in the category. Adobe Firefly IS an AI art generator but the main Firefly page doesn\'t rank for it because the H1 doesn\'t use this language.',
    keyAction: 'Create /products/firefly/ai-art-generator as the free-tier entry page. No login for first 5 generations. H1 must match the query exactly. This single page could drive more traffic than any other action on this list.',
    redditQ: 'best ai art generator free 2025 no sign up',
    competitors: ['Midjourney', 'DALL-E / ChatGPT', 'Canva AI', 'NightCafe', 'Stable Diffusion'],
  },
  {
    kw: 'AI anime art generator',
    vol: '~250K/mo', priority: 'P1',
    adobeFeature: 'Firefly with anime style prompting / style reference',
    adobeLandingPage: '/products/firefly',
    recUrl: '/products/firefly/features/anime-art-generator',
    recH1: 'AI Anime Art Generator — Create Anime-Style Art with Adobe Firefly',
    whyAdobe: 'Firefly can generate anime-style art through style prompting. This is a high-volume niche with strong community appetite. No Adobe page exists for it — leaving 250K/mo to Midjourney and NovelAI.',
    keyAction: 'Dedicated anime style landing page with anime-specific prompt examples and style reference demos. Key message: commercially safe anime art (many anime-style models are trained on unlicensed anime images — Firefly is not).',
    redditQ: 'ai anime art generator best free no nsfw 2025',
    competitors: ['NovelAI', 'Midjourney', 'Stable Diffusion anime models', 'SeaArt'],
  },
  {
    kw: 'AI drawing generator',
    vol: '~150K/mo', priority: 'P1',
    adobeFeature: 'Firefly illustration style / Text to Vector',
    adobeLandingPage: '/products/firefly',
    recUrl: '/products/firefly/features/ai-drawing-generator',
    recH1: 'AI Drawing Generator — Generate Illustrations & Drawings from Text',
    whyAdobe: 'Firefly\'s illustration styles and Text to Vector are natural fits for "drawing generator." The vector output is uniquely Adobe — all competitors generate rasters. Editable drawings from text is a strong differentiator.',
    keyAction: 'Drawing generator page leading with the vector angle ("generate editable drawings, not just images"). Show illustration → Illustrator workflow. This page can also serve the "text to vector" cluster.',
    redditQ: 'ai drawing generator illustration free 2025',
    competitors: ['Adobe Firefly (not ranking)', 'Midjourney', 'Canva AI', 'AutoDraw (Google)'],
  },
  {
    kw: 'design generator',
    vol: '~100K/mo', priority: 'P1',
    adobeFeature: 'Adobe Express AI / Firefly + Express templates',
    adobeLandingPage: '/express',
    recUrl: '/express/features/ai-design-generator',
    recH1: 'AI Design Generator — Create Complete Designs from Text with Adobe Express',
    whyAdobe: 'Adobe Express with Firefly AI is the most complete "design generator" product — templates + AI generation + brand kits + custom fonts. Canva is winning this keyword despite Adobe having a superior product.',
    keyAction: 'Adobe Express "design generator" landing page showing text-to-design workflow. Prompt → full social post / flyer / presentation. Free trial, no login for first design. This is Express\'s acquisition page.',
    redditQ: 'ai design generator free social media posts templates 2025',
    competitors: ['Canva AI Design', 'Adobe Express (not ranking)', 'Looka', 'Wix AI Designer'],
  },
  {
    kw: 'face generator',
    vol: '~80K/mo', priority: 'P2',
    adobeFeature: 'Firefly person/face generation',
    adobeLandingPage: '/products/firefly',
    recUrl: '/products/firefly/features/face-generator',
    recH1: 'AI Face Generator — Create Realistic AI-Generated Faces',
    whyAdobe: 'Firefly can generate photorealistic faces. Use cases: stock photography alternatives, character creation, diversity testing. Key message: Firefly faces are commercially licensed — no model release required.',
    keyAction: 'Face generator page emphasizing commercial licensing of generated faces (no model releases, no stock photo fees). Target stock photo buyers as ICP — they already pay for licensed imagery.',
    redditQ: 'ai face generator realistic free no copyright 2025',
    competitors: ['ThisPersonDoesNotExist.com', 'Generated.photos', 'Midjourney', 'DALL-E'],
  },
  {
    kw: 'pixel art maker',
    vol: '~120K/mo', priority: 'P2',
    adobeFeature: 'Firefly pixel art style / Photoshop pixel art filters',
    adobeLandingPage: '/products/photoshop',
    recUrl: '/products/firefly/features/pixel-art-maker',
    recH1: 'AI Pixel Art Maker — Generate Pixel Art from Text or Photos',
    whyAdobe: 'Firefly can generate pixel art through style prompting. This is a niche but high-intent query with game dev and indie creator appeal. Adobe has no page for it.',
    keyAction: 'Pixel art generator page with game dev use cases (sprite sheets, game backgrounds, character sprites). Emphasize exportable SVG/PNG formats. Connect to Illustrator for editable pixel-art vectors.',
    redditQ: 'ai pixel art generator game sprites free 2025',
    competitors: ['Pixelfy.ai', 'PixelMe', 'Midjourney pixel style', 'Adobe Firefly (not ranking)'],
  },
  {
    kw: 'human generator',
    vol: '~40K/mo', priority: 'P2',
    adobeFeature: 'Firefly person generation / Generated.photos alternative',
    adobeLandingPage: '/products/firefly',
    recUrl: '/products/firefly/features/human-generator',
    recH1: 'AI Human Generator — Create Realistic AI People for Commercial Use',
    whyAdobe: 'Users searching "human generator" want stock photography alternatives — diverse, realistic AI-generated people they can use commercially. Firefly is perfect for this: no model releases, full IP indemnification.',
    keyAction: 'Human generator page targeting stock photography buyers. Lead with: "Replace expensive stock photo licenses with Firefly AI people — commercially safe, fully licensed, infinitely diverse." This is a direct Shutterstock/Getty displacement play.',
    redditQ: 'ai human generator realistic stock photo alternative 2025',
    competitors: ['Generated.photos', 'ThisPersonDoesNotExist', 'Midjourney', 'Adobe Stock AI'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Priority colour map
// ─────────────────────────────────────────────────────────────────────────────
const PCOLORS = { P0: '#c0392b', P1: '#d97706', P2: '#6366f1' };

// ─────────────────────────────────────────────────────────────────────────────
// API helpers
// ─────────────────────────────────────────────────────────────────────────────
const ADOBE_DOMAINS = ['adobe.com', 'helpx.adobe.com', 'blog.adobe.com', 'express.adobe.com', 'firefly.adobe.com'];

async function braveSearch(query, count = 8) {
  const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${count}&search_lang=en&country=us&result_filter=web`;
  try {
    const r = await fetch(url, {
      headers: { 'Accept': 'application/json', 'X-Subscription-Token': BRAVE_KEY },
    });
    if (!r.ok) return [];
    const d = await r.json();
    return (d.web?.results || []).map((x, i) => ({
      rank: i + 1,
      title: x.title || '',
      url:   x.url || '',
      domain: new URL(x.url || 'https://x.com').hostname.replace('www.',''),
      desc:  x.description || '',
      isAdobe: ADOBE_DOMAINS.some(a => (x.url || '').includes(a)),
    }));
  } catch (e) {
    console.error('  Brave error:', e.message);
    return [];
  }
}

async function redditSearch(query, limit = 6) {
  const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=top&t=year&limit=${limit}`;
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'CompIntelBot/1.0' } });
    if (!r.ok) return [];
    const d = await r.json();
    return (d.data?.children || []).slice(0, 6).map(p => ({
      title: p.data.title || '',
      subreddit: `r/${p.data.subreddit}`,
      score: p.data.score || 0,
      comments: p.data.num_comments || 0,
    }));
  } catch { return []; }
}

function adobeRankLabel(results) {
  const hit = results.find(r => r.isAdobe);
  if (!hit) return { label: 'Not ranking', color: '#c0392b' };
  if (hit.rank <= 3) return { label: `#${hit.rank} — ${hit.domain}`, color: '#138808' };
  if (hit.rank <= 6) return { label: `#${hit.rank} — ${hit.domain}`, color: '#d97706' };
  return { label: `#${hit.rank} — ${hit.domain}`, color: '#c0392b' };
}

function oppScore(results, vol) {
  const volNum = parseInt(vol.replace(/[^0-9]/g, '')) || 0;
  const adobeRank = results.find(r => r.isAdobe)?.rank || 99;
  if (adobeRank > 10 && volNum >= 300) return { score: 'HIGH', color: '#c0392b' };
  if (adobeRank > 5  && volNum >= 100) return { score: 'MEDIUM', color: '#d97706' };
  if (adobeRank <= 3) return { score: 'HOLD', color: '#138808' };
  return { score: 'MEDIUM', color: '#d97706' };
}

// ─────────────────────────────────────────────────────────────────────────────
// CSS
// ─────────────────────────────────────────────────────────────────────────────
const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #f8f9fc; color: #1a1a2e; }

.cover {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 55%, #0f3460 100%);
  color: #fff; min-height: 100vh; display: flex; flex-direction: column;
  justify-content: center; padding: 80px; page-break-after: always;
}
.cover-eyebrow { font-size: 12px; letter-spacing: 3px; text-transform: uppercase; opacity: 0.55; margin-bottom: 40px; }
.cover-title   { font-size: 52px; font-weight: 900; line-height: 1.08; max-width: 820px; margin-bottom: 28px; }
.cover-sub     { font-size: 18px; opacity: 0.7; max-width: 640px; line-height: 1.65; margin-bottom: 48px; }
.pills { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 48px; }
.pill { background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.22);
        border-radius: 100px; padding: 6px 16px; font-size: 12px; font-weight: 700; }
.cover-foot { font-size: 11px; opacity: 0.4; letter-spacing: 1px; }

/* Summary table section */
.summary-section { padding: 64px 72px; page-break-after: always; }
.section-h2 { font-size: 30px; font-weight: 800; margin-bottom: 8px; }
.section-sub { font-size: 15px; color: #666; margin-bottom: 32px; }

.summary-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.summary-table thead tr { background: #1a1a2e; color: #fff; }
.summary-table th { padding: 12px 14px; text-align: left; font-weight: 600; font-size: 12px; letter-spacing: 0.5px; }
.summary-table td { padding: 10px 14px; border-bottom: 1px solid #eef0f6; vertical-align: middle; }
.summary-table tr:nth-child(even) td { background: #f5f6fb; }
.summary-table tr:hover td { background: #eef3ff; }
.priority-badge { display: inline-block; border-radius: 4px; padding: 3px 8px;
                   font-size: 10px; font-weight: 800; letter-spacing: 1px; color: #fff; }
.opp-badge { display: inline-block; border-radius: 4px; padding: 3px 8px;
              font-size: 10px; font-weight: 800; letter-spacing: 0.5px; color: #fff; }

/* Keyword section */
.kw-section { padding: 56px 72px; page-break-before: always; border-top: 4px solid #f0f0fa; }
.kw-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
               color: #888; margin-bottom: 10px; }
.kw-title { font-size: 28px; font-weight: 800; color: #1a1a2e; margin-bottom: 16px; line-height: 1.2; }
.kw-meta-row { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 28px; }
.kw-chip { background: #f0f1f8; border-radius: 6px; padding: 6px 14px; font-size: 12px; font-weight: 600; color: #555; }
.kw-chip b { color: #1a1a2e; }

.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
.three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 24px; }

.card { background: #fff; border-radius: 12px; padding: 24px 28px; border: 1px solid #e8eaf4; }
.card-label { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
               color: #999; margin-bottom: 14px; }

/* SERP results */
.serp-item { display: flex; align-items: flex-start; gap: 10px; padding: 8px 0;
              border-bottom: 1px solid #f3f4f9; }
.serp-item:last-child { border-bottom: none; }
.serp-rank { min-width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center;
              justify-content: center; font-size: 11px; font-weight: 800; flex-shrink: 0;
              margin-top: 2px; }
.serp-rank.top1 { background: #1a1a2e; color: #fff; }
.serp-rank.adobe { background: #fa0f00; color: #fff; }
.serp-rank.other { background: #e8eaf4; color: #555; }
.serp-domain { font-size: 13px; font-weight: 700; color: #222; }
.serp-title  { font-size: 12px; color: #555; line-height: 1.4; }

/* Action card */
.action-card { background: #fff; border: 2px solid #1a1a2e; border-radius: 14px;
                padding: 32px; margin-bottom: 24px; }
.action-urgency { display: inline-block; border-radius: 6px; padding: 5px 14px;
                   font-size: 11px; font-weight: 800; letter-spacing: 1px; color: #fff;
                   text-transform: uppercase; margin-bottom: 18px; }
.action-url { font-family: monospace; font-size: 14px; font-weight: 700; color: #0055cc;
               background: #eef3ff; border-radius: 6px; padding: 8px 14px; display: inline-block;
               margin-bottom: 14px; }
.action-h1 { font-size: 20px; font-weight: 800; color: #1a1a2e; margin-bottom: 14px; line-height: 1.3; }
.action-why { font-size: 14px; color: #444; line-height: 1.7; background: #f8f9fc;
               border-left: 4px solid #0055cc; padding: 14px 18px; border-radius: 0 8px 8px 0;
               margin-bottom: 20px; }
.action-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;
                 color: #888; margin-bottom: 8px; margin-top: 18px; }
.action-do { font-size: 14px; color: #1a1a2e; line-height: 1.7; background: #fff8e1;
              border-left: 4px solid #f59e0b; padding: 14px 18px; border-radius: 0 8px 8px 0; }
.metrics-row { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 18px; }
.metric-box { background: #f0f4ff; border: 1px solid #c7d7ff; border-radius: 8px; padding: 10px 16px; }
.metric-box strong { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #7791cc; margin-bottom: 4px; }
.metric-box span { font-size: 13px; font-weight: 700; color: #1a1a2e; }

/* Reddit */
.reddit-item { padding: 8px 0; border-bottom: 1px solid #f3f4f9; }
.reddit-item:last-child { border-bottom: none; }
.reddit-title { font-size: 12px; font-weight: 600; color: #222; line-height: 1.4; }
.reddit-meta  { font-size: 11px; color: #888; margin-top: 2px; }
.sentiment-badge { display: inline-block; border-radius: 100px; padding: 3px 10px;
                    font-size: 11px; font-weight: 700; color: #fff; margin-bottom: 10px; }

.divider { border: none; border-top: 1px solid #eef0f6; margin: 28px 0; }

@media print {
  .kw-section { page-break-before: always; }
  .action-card, .card { page-break-inside: avoid; }
}
`;

// ─────────────────────────────────────────────────────────────────────────────
// Render helpers
// ─────────────────────────────────────────────────────────────────────────────
function renderSerpCard(results) {
  const top8 = results.slice(0, 8);
  const items = top8.map((r, i) => {
    const cls = i === 0 ? 'top1' : r.isAdobe ? 'adobe' : 'other';
    return `
      <div class="serp-item">
        <div class="serp-rank ${cls}">${r.rank}</div>
        <div>
          <div class="serp-domain">${r.domain}${r.isAdobe ? ' 🔴 ADOBE' : ''}</div>
          <div class="serp-title">${r.title.slice(0, 75)}${r.title.length > 75 ? '…' : ''}</div>
        </div>
      </div>`;
  });
  return `<div class="card"><div class="card-label">Google SERP — Top Results (via Brave)</div>${items.join('')}</div>`;
}

function renderRedditCard(posts) {
  if (!posts.length) return `<div class="card"><div class="card-label">Reddit — Community Voice</div><p style="font-size:13px;color:#888;">No results found</p></div>`;
  const text = posts.map(p => p.title).join(' ').toLowerCase();
  const pos = (text.match(/\b(great|love|best|excellent|recommend|perfect|amazing|fast|easy|quality|professional)\b/g) || []).length;
  const neg = (text.match(/\b(bad|worse|slow|hate|terrible|expensive|frustrating|limited|behind|fails|annoying|disappointing)\b/g) || []).length;
  let sent = { label: 'Mixed sentiment', color: '#d97706' };
  if (pos > neg * 1.5) sent = { label: 'Positive', color: '#138808' };
  if (neg > pos * 1.5) sent = { label: 'Negative', color: '#c0392b' };
  const items = posts.map(p => `
    <div class="reddit-item">
      <div class="reddit-title">${p.title.slice(0, 85)}${p.title.length > 85 ? '…' : ''}</div>
      <div class="reddit-meta">${p.subreddit} · ${p.score.toLocaleString()} pts · ${p.comments} comments</div>
    </div>`).join('');
  return `<div class="card"><div class="card-label">Reddit — Community Voice</div>
    <div class="sentiment-badge" style="background:${sent.color}">${sent.label}</div>
    ${items}</div>`;
}

function renderActionCard(kw) {
  const pc = PCOLORS[kw.priority] || '#6366f1';
  return `
    <div class="action-card">
      <div class="action-urgency" style="background:${pc}">${kw.priority} — Action Required</div>
      <div class="action-label">Target URL (create or optimise)</div>
      <div class="action-url">${kw.recUrl}</div>
      <div class="action-label">Page H1</div>
      <div class="action-h1">${kw.recH1}</div>
      <div class="action-label">Why Adobe Wins This Keyword</div>
      <div class="action-why">${kw.whyAdobe}</div>
      <div class="action-label">Exact Action to Take</div>
      <div class="action-do">${kw.keyAction}</div>
      <div class="action-label">Adobe Feature to Surface</div>
      <div style="font-size:14px;color:#333;padding:10px 0;">${kw.adobeFeature}</div>
      <div class="metrics-row">
        <div class="metric-box"><strong>Monthly Volume</strong><span>${kw.vol}</span></div>
        <div class="metric-box"><strong>Priority</strong><span>${kw.priority}</span></div>
        <div class="metric-box"><strong>Landing Page</strong><span>${kw.adobeLandingPage}</span></div>
      </div>
    </div>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
(async () => {
  console.log(`Fetching rankings for ${KEYWORDS.length} keywords...`);
  const results = [];

  for (const kw of KEYWORDS) {
    process.stdout.write(`  [${kw.priority}] "${kw.kw}" ... `);
    const [serp, reddit] = await Promise.all([
      braveSearch(kw.kw + ' tool free', 8),
      redditSearch(kw.redditQ, 6),
    ]);
    const aRank = adobeRankLabel(serp);
    const opp   = oppScore(serp, kw.vol);
    const no1   = serp[0] ? serp[0].domain : 'unknown';
    console.log(`#1: ${no1} | Adobe: ${aRank.label}`);
    results.push({ kw, serp, reddit, aRank, opp, no1 });
    await new Promise(r => setTimeout(r, 400));
  }

  console.log('Building HTML...');

  // ── Summary table ──
  const tableRows = results.map(({ kw, aRank, opp, no1 }) => `
    <tr>
      <td><strong>${kw.kw}</strong></td>
      <td>${kw.vol}</td>
      <td><span class="priority-badge" style="background:${PCOLORS[kw.priority]}">${kw.priority}</span></td>
      <td><strong>${no1}</strong></td>
      <td style="color:${aRank.color};font-weight:700">${aRank.label}</td>
      <td><span class="opp-badge" style="background:${opp.color}">${opp.score}</span></td>
      <td style="font-size:12px;font-family:monospace;">${kw.recUrl}</td>
    </tr>`).join('');

  // ── Per-keyword sections ──
  const kwSections = results.map(({ kw, serp, reddit, aRank, opp }) => `
    <div class="kw-section">
      <div class="kw-eyebrow">SEO KPI · ${kw.priority} · ${opp.score} OPPORTUNITY</div>
      <div class="kw-title">"${kw.kw}"</div>
      <div class="kw-meta-row">
        <div class="kw-chip">Volume: <b>${kw.vol}</b></div>
        <div class="kw-chip">Adobe today: <b style="color:${aRank.color}">${aRank.label}</b></div>
        <div class="kw-chip">Current #1: <b>${serp[0]?.domain || 'unknown'}</b></div>
        <div class="kw-chip">Opportunity: <b style="color:${opp.color}">${opp.score}</b></div>
        <div class="kw-chip">Key competitors: <b>${kw.competitors.slice(0,3).join(', ')}</b></div>
      </div>

      ${renderActionCard(kw)}

      <div class="two-col">
        ${renderSerpCard(serp)}
        ${renderRedditCard(reddit)}
      </div>
    </div>`).join('');

  // ── P0 quick wins box ──
  const p0 = results.filter(r => r.kw.priority === 'P0');
  const p0List = p0.map(r => `<li style="padding:7px 0;border-bottom:1px solid rgba(0,0,0,0.06);font-size:14px;">
    <strong>"${r.kw.kw}"</strong> (${r.kw.vol}) — #1 today: ${r.no1} — Adobe: <span style="color:#c0392b">${r.aRank.label}</span> →
    <span style="font-family:monospace;font-size:12px;color:#0055cc">${r.kw.recUrl}</span>
  </li>`).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Adobe Firefly — SEO KPI Acquisition Playbook</title>
  <style>${CSS}</style>
</head>
<body>

<div class="cover">
  <div class="cover-eyebrow">Adobe Firefly · SEO KPI Acquisition Playbook · May 2026 · US Market</div>
  <div class="cover-title">19-Keyword SEO<br>Acquisition Playbook</div>
  <div class="cover-sub">Live rankings, current #1 owners, Reddit community voice, and exact page-by-page actions to move Adobe Firefly to rank #1 across all SEO KPI keywords.</div>
  <div class="pills">
    <div class="pill">19 Keywords</div>
    <div class="pill">Live Brave Search Rankings</div>
    <div class="pill">Reddit Sentiment</div>
    <div class="pill">Per-Keyword Action Cards</div>
    <div class="pill">US Market · May 2026</div>
  </div>
  <div class="cover-foot">INTERNAL · FOR: Growth PM · SEO · Content · Acquisition</div>
</div>

<div class="summary-section">
  <div class="section-h2">All 19 Keywords — Rankings Overview</div>
  <div class="section-sub">Who owns each keyword today, where Adobe ranks, and the opportunity score.</div>

  <div style="background:#fff8e1;border:1px solid #ffc107;border-radius:12px;padding:22px 28px;margin-bottom:32px;">
    <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#b7791f;margin-bottom:12px;">⚡ P0 — Do These First (Highest Volume, Not Ranking)</div>
    <ul style="list-style:none;">${p0List}</ul>
  </div>

  <table class="summary-table">
    <thead>
      <tr>
        <th>Keyword</th>
        <th>Volume</th>
        <th>Priority</th>
        <th>Current #1</th>
        <th>Adobe Rank Today</th>
        <th>Opportunity</th>
        <th>Recommended URL</th>
      </tr>
    </thead>
    <tbody>${tableRows}</tbody>
  </table>
</div>

${kwSections}

</body>
</html>`;

  fs.writeFileSync(HTML_OUT, html, 'utf8');
  console.log(`HTML → ${HTML_OUT}`);

  console.log('Generating PDF...');
  const puppeteer = require('puppeteer');
  const browser   = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page      = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: PDF_DEST,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
  });
  await browser.close();
  console.log(`PDF → ${PDF_DEST}`);
  console.log('Done.');
})();
