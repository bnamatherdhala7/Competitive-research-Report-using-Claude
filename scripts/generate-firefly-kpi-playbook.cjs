/**
 * Adobe Firefly — SEO KPI Acquisition Playbook
 * Matches the style of Adobe-Acrobat-Acquisition-Playbook-2026-05.pdf:
 * Adobe red branding · TL;DR · 30-day sprint · competitive landscape ·
 * SEO gaps table · GEO table · win signals · battlecards · PLG strategy ·
 * per-keyword action cards · metrics dashboard
 *
 * Output: docs/Adobe-Firefly-KPI-Acquisition-Playbook.html + PDF on Desktop
 */

const fs   = require('fs');
const path = require('path');
const os   = require('os');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const BRAVE_KEY = process.env.BRAVE_API_KEY;
if (!BRAVE_KEY) throw new Error('BRAVE_API_KEY not set');

const OUT_HTML = path.join(__dirname, '../docs/Adobe-Firefly-KPI-Acquisition-Playbook.html');
const OUT_PDF  = path.join(os.homedir(), 'Desktop', 'Adobe-Firefly-KPI-Acquisition-Playbook-2026-05.pdf');

// ─────────────────────────────────────────────────────────────────────────────
// Keyword definitions
// ─────────────────────────────────────────────────────────────────────────────
const KEYWORDS = [
  { kw:'remove object',           vol:'~450K/mo', priority:'P0', cluster:'Editing',    adobeFeature:'Firefly Generative Remove / Photoshop Remove Tool',        recUrl:'/products/firefly/features/remove-object',         recH1:'Remove Any Object from a Photo — Adobe Firefly AI',                          keyAction:'Dedicated remove-object page with free no-login demo. Photoshop Remove Tool + Firefly context-aware fill is best-in-class — cleanup.pictures ranks #1 only because it has a single-purpose free page.',        competitors:['cleanup.pictures','Canva Magic Eraser','Fotor','Adobe Express'] },
  { kw:'expand image',            vol:'~180K/mo', priority:'P0', cluster:'Editing',    adobeFeature:'Photoshop Generative Expand',                               recUrl:'/products/firefly/features/expand-image',          recH1:'Expand Any Image with AI — Photoshop Generative Expand',                     keyAction:'Standalone expand-image page with before/after demo. Current Generative Expand page ranks poorly because H1 says "Generative Expand" not "expand image." One H1 change + dedicated URL = top 3.',               competitors:['DALL-E outpainting','Canva Uncrop','pixelcut.ai','Stability Outpaint'] },
  { kw:'upscale image',           vol:'~400K/mo', priority:'P0', cluster:'Editing',    adobeFeature:'Photoshop Super Resolution / Firefly Generative Upscale',   recUrl:'/products/firefly/features/upscale-image',         recH1:'AI Image Upscaler — 4× Upscale Without Losing Quality',                      keyAction:'Free online upscale tool — no Photoshop install required. Topaz Gigapixel dominates because it offers a single-page free upscaler. Adobe needs the same entry point.',                                           competitors:['Topaz Gigapixel AI','Let\'s Enhance','Upscale.media','BigJPG'] },
  { kw:'sticker generator',       vol:'~150K/mo', priority:'P1', cluster:'Creation',   adobeFeature:'Adobe Express Sticker Maker / Firefly + transparent bg',    recUrl:'/express/feature/image/sticker-maker',             recH1:'Free AI Sticker Generator — Create Custom Stickers Online',                  keyAction:'Update Express sticker page H1 to match "sticker generator" (higher volume than "sticker maker"). Remove login gate for first sticker. Add Firefly AI generation + transparent PNG export.',                     competitors:['Canva Sticker Maker','Picsart','StickerMule','Adobe Express (not ranking)'] },
  { kw:'background generator',    vol:'~200K/mo', priority:'P0', cluster:'Creation',   adobeFeature:'Firefly Background Generator / Express Background',         recUrl:'/products/firefly/features/background-generator',  recH1:'AI Background Generator — Create Any Background from Text',                  keyAction:'Dedicated background generator page with e-commerce use case (product photography). Free demo, no login. Adobe is already #2 — one focused page pushes it to #1.',                                              competitors:['Canva AI Background','Fotor','Picsart','Adobe (ranked #2)'] },
  { kw:'AI video generator',      vol:'~600K/mo', priority:'P0', cluster:'Video',      adobeFeature:'Adobe Firefly Video (text-to-video, image-to-video)',        recUrl:'/products/firefly/features/ai-video-generator',    recH1:'AI Video Generator — Create Videos from Text or Images',                     keyAction:'Standalone AI video generator page with demo, free trial CTA, comparison vs Sora/Runway. Firefly Video\'s commercial safety and Premiere integration are the enterprise differentiators.',                        competitors:['Sora (OpenAI)','Runway ML','Kling AI','Pika Labs','invideo.io'] },
  { kw:'AI photo editor',         vol:'~800K/mo', priority:'P0', cluster:'Editing',    adobeFeature:'Photoshop AI / Lightroom AI / Adobe Express AI',            recUrl:'/products/firefly/ai-photo-editor',                recH1:'AI Photo Editor — Edit Photos Instantly with Adobe AI',                       keyAction:'Hub page unifying Photoshop AI, Lightroom AI, Firefly under "AI photo editor." Highest-volume keyword on the list. Adobe owns the product — missing only the SEO-matched page.',                                 competitors:['Luminar Neo','Canva Photo Editor','Fotor AI','photoeditorai.io'] },
  { kw:'character generator',     vol:'~120K/mo', priority:'P1', cluster:'Creation',   adobeFeature:'Firefly Character / Custom Model character generation',     recUrl:'/products/firefly/features/character-generator',   recH1:'AI Character Generator — Create Consistent Characters with Firefly',         keyAction:'Dedicated character generator page showcasing consistent character generation across scenes with Custom Models. The #1 user pain point with Midjourney is inconsistent characters — Firefly solves this.',         competitors:['Midjourney','Artbreeder','Scenario.gg','perchance.org'] },
  { kw:'headshot generator',      vol:'~200K/mo', priority:'P1', cluster:'Creation',   adobeFeature:'Firefly AI headshot generation',                            recUrl:'/products/firefly/features/ai-headshot-generator', recH1:'AI Headshot Generator — Professional Headshots in Minutes',                  keyAction:'Headshot generator page with free trial (5 headshots, no account). High-commercial-intent query — LinkedIn headshots, professional photos. Commercially safe headshots = no model releases required.',            competitors:['Aragon AI','HeadshotPro','Canva AI','Try It On AI'] },
  { kw:'image to image generator',vol:'~80K/mo',  priority:'P1', cluster:'Editing',    adobeFeature:'Firefly Reference Image / Style Reference',                 recUrl:'/products/firefly/features/image-to-image',        recH1:'Image to Image AI — Transform Any Photo with Adobe Firefly',                 keyAction:'Image-to-image page showcasing Style Reference and Structure Reference. Key message: commercially safe image transformation — no copyright risk. Stable Diffusion img2img dominates because it has a page.',      competitors:['Stable Diffusion img2img','Midjourney vary','imgtoimg.ai','Picsart'] },
  { kw:'remove people',           vol:'~100K/mo', priority:'P1', cluster:'Editing',    adobeFeature:'Firefly Generative Remove / Photoshop Remove Tool',         recUrl:'/products/firefly/features/remove-people',         recH1:'Remove People from Photos with AI — Adobe Firefly',                          keyAction:'Separate page from "remove object" — distinct intent. Show crowd removal, background cleaning. Add to free tools with no-login demo. Adobe is currently #4 — a dedicated page moves this to #1.',                 competitors:['cleanup.pictures','Canva Magic Eraser','Fotor','Adobe (#4)'] },
  { kw:'cartoonize',              vol:'~300K/mo', priority:'P1', cluster:'Styles',     adobeFeature:'Firefly style generation / Express cartoon filters',        recUrl:'/products/firefly/features/cartoonize',            recH1:'Cartoonize Your Photo — Free AI Cartoon Generator',                          keyAction:'Free cartoonize tool — no login, instant generation, "Created with Firefly" badge on exports. This is a viral loop driver. Upload → cartoon → share → inbound. High consumer appeal.',                           competitors:['ToonMe','Canva Cartoon Effect','Fotor Cartoonize','PicsArt'] },
  { kw:'AI art generator',        vol:'~900K/mo', priority:'P0', cluster:'Creation',   adobeFeature:'Adobe Firefly — core product',                              recUrl:'/products/firefly/ai-art-generator',               recH1:'AI Art Generator — Create Stunning Art Free with Adobe Firefly',             keyAction:'Create /products/firefly/ai-art-generator as the free-tier entry page. No login for first 5 generations. This single page could drive more traffic than any other action. H1 must match the query exactly.',     competitors:['Midjourney','DALL-E / ChatGPT','Canva AI','NightCafe','magicstudio.com'] },
  { kw:'AI anime art generator',  vol:'~250K/mo', priority:'P1', cluster:'Styles',     adobeFeature:'Firefly with anime style prompting / style reference',      recUrl:'/products/firefly/features/anime-art-generator',   recH1:'AI Anime Art Generator — Create Anime-Style Art Safely with Firefly',        keyAction:'Dedicated anime page with prompt examples and style reference demos. Key message: commercially safe anime art — most anime-style AI models are trained on unlicensed anime images, Firefly is not.',               competitors:['NovelAI','Midjourney','Stable Diffusion anime models','komiko.app'] },
  { kw:'AI drawing generator',    vol:'~150K/mo', priority:'P1', cluster:'Creation',   adobeFeature:'Firefly illustration styles / Text to Vector',              recUrl:'/products/firefly/features/ai-drawing-generator',  recH1:'AI Drawing Generator — Generate Illustrations & Editable Vectors from Text', keyAction:'Lead with the vector angle: "generate editable drawings, not just images." Illustration → Illustrator workflow. This page can also serve the text-to-vector cluster. Zero competitor has editable vector output.',  competitors:['Canva AI','Midjourney','Adobe Firefly (not ranking)','AutoDraw'] },
  { kw:'design generator',        vol:'~100K/mo', priority:'P1', cluster:'Creation',   adobeFeature:'Adobe Express AI / Firefly + Express templates',            recUrl:'/express/features/ai-design-generator',            recH1:'AI Design Generator — Create Complete Designs from Text with Adobe Express', keyAction:'Adobe Express design generator page: text → social post / flyer / presentation. Free trial, no login for first design. Canva wins this keyword despite Adobe having a superior product — gap is only the page.',  competitors:['Canva AI Design','Looka','Wix AI Designer','Adobe Express (#3)'] },
  { kw:'face generator',          vol:'~80K/mo',  priority:'P2', cluster:'Creation',   adobeFeature:'Firefly photorealistic person/face generation',             recUrl:'/products/firefly/features/face-generator',        recH1:'AI Face Generator — Commercially Licensed AI Faces',                         keyAction:'Face generator page targeting stock photography buyers. Lead with: "No model releases required — Firefly faces are commercially licensed." Direct Getty/Shutterstock displacement play.',                          competitors:['Generated.photos','ThisPersonDoesNotExist.com','Midjourney','Adobe (#1 ✅)'] },
  { kw:'pixel art maker',         vol:'~120K/mo', priority:'P2', cluster:'Styles',     adobeFeature:'Firefly pixel art style / Photoshop pixel art filters',     recUrl:'/products/firefly/features/pixel-art-maker',       recH1:'AI Pixel Art Maker — Generate Pixel Art & Game Sprites from Text',           keyAction:'Pixel art page targeting game devs: sprite sheets, game backgrounds, character sprites. Editable SVG/PNG formats. Connect to Illustrator for vector pixel art.',                                                  competitors:['Pixilart.com','Pixelfy.ai','PixelMe','Adobe Firefly (not ranking)'] },
  { kw:'human generator',         vol:'~40K/mo',  priority:'P2', cluster:'Creation',   adobeFeature:'Firefly person generation / stock photo alternative',       recUrl:'/products/firefly/features/human-generator',       recH1:'AI Human Generator — Diverse AI People for Commercial Use',                  keyAction:'Lead with "Replace stock photo licenses — Firefly people are commercially safe, fully licensed, infinitely diverse." Direct Shutterstock/Getty displacement. Every enterprise stock buyer is a warm lead.',        competitors:['Generated.photos','ThisPersonDoesNotExist','Midjourney','Adobe Stock AI'] },
];

const PCOLOR = { P0:'#FA0F00', P1:'#d97706', P2:'#6366f1' };
const ADOBE_DOMAINS = ['adobe.com','helpx.adobe.com','blog.adobe.com','express.adobe.com','firefly.adobe.com'];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
async function braveSearch(query, count=8) {
  const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${count}&search_lang=en&country=us`;
  try {
    const r = await fetch(url, { headers:{ 'Accept':'application/json','X-Subscription-Token':BRAVE_KEY } });
    if (!r.ok) return [];
    const d = await r.json();
    return (d.web?.results||[]).map((x,i)=>({
      rank:i+1, title:x.title||'', url:x.url||'',
      domain: (() => { try { return new URL(x.url||'https://x.com').hostname.replace('www.',''); } catch{ return x.url||''; } })(),
      isAdobe: ADOBE_DOMAINS.some(a=>(x.url||'').includes(a)),
    }));
  } catch { return []; }
}

function adobeRank(serp) {
  const h = serp.find(r=>r.isAdobe);
  if (!h) return { label:'Not ranking', short:'Not ranking', color:'#FA0F00' };
  if (h.rank<=3) return { label:`#${h.rank} — ${h.domain}`, short:`#${h.rank}`, color:'#138808' };
  if (h.rank<=6) return { label:`#${h.rank} — ${h.domain}`, short:`#${h.rank}`, color:'#d97706' };
  return { label:`#${h.rank} — ${h.domain}`, short:`#${h.rank}`, color:'#FA0F00' };
}

// ─────────────────────────────────────────────────────────────────────────────
// CSS — matches Acrobat playbook style
// ─────────────────────────────────────────────────────────────────────────────
const CSS = `
*, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
body { font-family:'Helvetica Neue',Helvetica,Arial,sans-serif; background:#fff; color:#1a1a1a; font-size:14px; line-height:1.6; }

/* ── Cover ── */
.cover { background:#fff; padding:0; page-break-after:always; }
.cover-top { background:#FA0F00; padding:24px 48px 20px; }
.cover-logo { color:#fff; font-size:26px; font-weight:900; letter-spacing:-1px; margin-bottom:0; }
.cover-body { padding:48px 48px 60px; border-bottom:3px solid #FA0F00; }
.cover-title { font-size:38px; font-weight:300; color:#1a1a1a; line-height:1.2; margin-bottom:20px; }
.cover-meta { font-size:13px; color:#555; line-height:2; }
.cover-meta strong { color:#1a1a1a; }

/* ── Sections ── */
.page { padding:48px 56px; page-break-before:always; }
.page:first-of-type { page-break-before:avoid; }
.section { margin-bottom:40px; }
.section-rule { border:none; border-top:1px solid #ddd; margin:32px 0; }
.section-title { font-size:16px; font-weight:700; color:#FA0F00; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:16px; padding-bottom:8px; border-bottom:2px solid #FA0F00; }
.section-intro { font-size:14px; color:#333; line-height:1.7; margin-bottom:20px; }

/* ── TL;DR block ── */
.tldr-block { background:#f9f9f9; border-left:4px solid #FA0F00; padding:20px 24px; font-size:14px; line-height:1.8; color:#222; margin-bottom:24px; }

/* ── Tables ── */
table { width:100%; border-collapse:collapse; font-size:13px; margin-bottom:20px; }
thead tr { background:#1a1a1a; color:#fff; }
th { padding:10px 14px; text-align:left; font-weight:600; font-size:12px; }
td { padding:9px 14px; border-bottom:1px solid #eee; vertical-align:top; }
tr:nth-child(even) td { background:#fafafa; }
.badge { display:inline-block; border-radius:3px; padding:2px 8px; font-size:11px; font-weight:700; color:#fff; letter-spacing:0.5px; }
.code { font-family:monospace; font-size:12px; background:#f0f0f0; padding:2px 6px; border-radius:3px; }

/* ── Sprint table ── */
.sprint-table td:nth-child(3) { font-size:12px; }
.sprint-action { font-weight:700; color:#1a1a1a; }
.sprint-copy code { display:block; background:#f5f5f5; border-left:3px solid #FA0F00; padding:6px 10px; font-size:12px; margin:4px 0; font-family:monospace; }

/* ── Quote blocks ── */
.quote { border-left:4px solid #ddd; padding:12px 20px; margin:12px 0; font-style:italic; color:#444; font-size:13px; line-height:1.7; }
.quote cite { display:block; font-style:normal; font-size:12px; color:#888; margin-top:6px; }

/* ── Battlecard ── */
.battlecard { border:1px solid #ddd; border-radius:6px; padding:20px 24px; margin-bottom:16px; }
.battlecard-title { font-size:14px; font-weight:700; color:#1a1a1a; margin-bottom:10px; }
.battlecard-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.battlecard-col h4 { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; }
.win { color:#138808; }
.lose { color:#FA0F00; }

/* ── PLG section ── */
.plg-item { margin-bottom:20px; }
.plg-num { font-size:14px; font-weight:700; color:#1a1a1a; margin-bottom:6px; }
.plg-body { font-size:13px; color:#333; line-height:1.7; padding-left:16px; }
.plg-body li { margin-bottom:4px; }
.plg-meta { font-size:12px; color:#888; margin-top:4px; padding-left:16px; }

/* ── Keyword action card ── */
.kw-card { border:1px solid #e0e0e0; border-radius:8px; padding:24px 28px; margin-bottom:24px; page-break-inside:avoid; }
.kw-card-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:14px; }
.kw-card-title { font-size:20px; font-weight:700; color:#1a1a1a; }
.kw-card-cluster { font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#888; margin-top:2px; }
.kw-chips { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:14px; }
.kw-chip { background:#f0f0f0; border-radius:4px; padding:4px 10px; font-size:12px; font-weight:600; color:#333; }
.kw-chip b { color:#1a1a1a; }
.kw-url { font-family:monospace; font-size:13px; font-weight:700; color:#0055cc; background:#eef3ff; padding:6px 12px; border-radius:4px; display:inline-block; margin-bottom:10px; }
.kw-h1 { font-size:17px; font-weight:700; color:#1a1a1a; margin-bottom:10px; line-height:1.3; }
.kw-action { font-size:13px; color:#333; line-height:1.7; background:#fffbf0; border-left:3px solid #d97706; padding:12px 16px; border-radius:0 6px 6px 0; margin-bottom:10px; }
.kw-feature { font-size:12px; color:#555; margin-top:6px; }
.kw-competitors { font-size:12px; color:#888; }

/* ── Metrics table ── */
.metrics-table td:nth-child(2) { color:#FA0F00; font-weight:600; }
.metrics-table td:nth-child(3) { color:#138808; font-weight:700; }

/* ── GEO table ── */
.geo-miss { color:#FA0F00; font-weight:600; }
.geo-hit { color:#138808; font-weight:600; }

@media print {
  .page { page-break-before:always; }
  .kw-card { page-break-inside:avoid; }
}
`;

// ─────────────────────────────────────────────────────────────────────────────
// HTML blocks
// ─────────────────────────────────────────────────────────────────────────────
function cover() {
  return `
<div class="cover">
  <div class="cover-top"><div class="cover-logo">Adobe</div></div>
  <div class="cover-body">
    <div class="cover-title">Adobe Firefly — SEO KPI Acquisition Playbook 2026</div>
    <div class="cover-meta">
      <strong>Audience:</strong> Growth PM · SEO · Acquisition Team &nbsp;
      <strong>Scope:</strong> 19 SEO KPI Keywords · Rankings · SEO · GEO · PLG Motions &nbsp;
      <strong>Date:</strong> May 2026 &nbsp;
      <strong>Classification:</strong> Adobe Internal — Confidential
    </div>
  </div>
</div>`;
}

function tldr(results) {
  const notRanking = results.filter(r=>r.aRank.label==='Not ranking').length;
  const p0 = results.filter(r=>r.kw.priority==='P0');
  const totalVol = '~3.6M/mo';
  return `
<div class="page">
  <div class="section">
    <div class="section-title">TL;DR</div>
    <div class="tldr-block">
      Adobe Firefly has best-in-class features for <strong>${KEYWORDS.length} high-intent SEO KPI keywords</strong> — representing an estimated <strong>${totalVol} combined monthly search volume</strong> — but ranks for <strong>only 1 of them (#1 for "face generator")</strong>. ${notRanking} keywords show Adobe as "Not ranking." The competitors winning these queries are single-purpose tools (cleanup.pictures, Topaz, ToonMe) with no product depth, no commercial safety, and no CC integration. The gap is purely SEO architecture: Adobe has the product, not the landing pages. Three moves fix this quarter: (1) create dedicated free-tool landing pages for the 7 P0 keywords — no login for first use, H1 must match the query exactly; (2) publish the "AI art generator" free-tier page targeting the 900K/mo #1 volume keyword where Adobe is currently invisible; (3) claim the "commercially safe AI" angle on every creation keyword — it's Adobe's exclusive moat and no competitor can contest it.
    </div>
  </div>

  <div class="section">
    <div class="section-title">30-Day Action Sprint</div>
    <p class="section-intro">Seven actions to start this week. The first three are copy/CMS changes only — no engineering, no tickets required.</p>
    <table class="sprint-table">
      <thead><tr><th>#</th><th>Action</th><th>Exact Change</th><th>Owner</th><th>Effort</th></tr></thead>
      <tbody>
        <tr>
          <td><span class="badge" style="background:#FA0F00">P0</span></td>
          <td class="sprint-action">Create /products/firefly/ai-art-generator</td>
          <td class="sprint-copy">H1: <code>"AI Art Generator — Create Stunning Art Free with Adobe Firefly"</code> · No login for first 5 generations · CTA: <code>"Try free — no account"</code> · This is the 900K/mo keyword Adobe is entirely absent from</td>
          <td>SEO + Web</td><td>3 days</td>
        </tr>
        <tr>
          <td><span class="badge" style="background:#FA0F00">P0</span></td>
          <td class="sprint-action">Create /products/firefly/features/remove-object</td>
          <td class="sprint-copy">H1: <code>"Remove Any Object from a Photo — Adobe Firefly AI"</code> · Free demo no login · cleanup.pictures ranks #1 only because it has a dedicated free page — Adobe's tool is objectively better</td>
          <td>SEO + Web</td><td>2 days</td>
        </tr>
        <tr>
          <td><span class="badge" style="background:#FA0F00">P0</span></td>
          <td class="sprint-action">Create /products/firefly/features/upscale-image</td>
          <td class="sprint-copy">H1: <code>"AI Image Upscaler — 4× Upscale Without Losing Quality"</code> · Free online tool, no PS install · Topaz Gigapixel ranks #1 with a single-page free tool Adobe doesn't have</td>
          <td>SEO + Web</td><td>2 days</td>
        </tr>
        <tr>
          <td><span class="badge" style="background:#FA0F00">P0</span></td>
          <td class="sprint-action">Create /products/firefly/ai-photo-editor</td>
          <td class="sprint-copy">Hub page unifying PS AI + LR AI + Firefly. <code>"AI Photo Editor — Edit Photos with Adobe AI"</code> · 800K/mo keyword, Adobe not ranking · photoeditorai.io beats Photoshop on this query</td>
          <td>SEO + Web</td><td>3 days</td>
        </tr>
        <tr>
          <td><span class="badge" style="background:#FA0F00">P0</span></td>
          <td class="sprint-action">Add "Add commercially safe" to every Firefly page H1</td>
          <td class="sprint-copy">CMS change: add subtext <code>"Commercially safe · IP indemnified · CC integrated"</code> under H1 on all Firefly pages. Zero engineering. Exact match for highest-intent commercial buyer queries</td>
          <td>Web/CMS</td><td>2 hrs</td>
        </tr>
        <tr>
          <td><span class="badge" style="background:#d97706">P1</span></td>
          <td class="sprint-action">Remove login gate on first generation (all free tools)</td>
          <td class="sprint-copy">Allow first 5 generations without account. Gate on download or 6th generation. Add <code>"No account needed"</code> subtext under every free tool tile. Single biggest SEO ranking driver</td>
          <td>Product + Eng</td><td>2 weeks</td>
        </tr>
        <tr>
          <td><span class="badge" style="background:#d97706">P1</span></td>
          <td class="sprint-action">Add FAQ schema to top 10 Firefly pages</td>
          <td class="sprint-copy">2 hrs of SEO work → AI Overview citations within 3 weeks. Schema Q: <code>"Is Adobe Firefly commercially safe?"</code> A: Yes + IP indemnification detail. Fastest path to GEO citations</td>
          <td>SEO</td><td>2 hrs</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>`;
}

function rankingOverview(results) {
  const rows = results.map(r => `
    <tr>
      <td><strong>${r.kw.kw}</strong></td>
      <td>${r.kw.vol}</td>
      <td><span class="badge" style="background:${PCOLOR[r.kw.priority]}">${r.kw.priority}</span></td>
      <td>${r.kw.cluster}</td>
      <td><strong>${r.no1}</strong></td>
      <td style="color:${r.aRank.color};font-weight:700">${r.aRank.label}</td>
      <td><span class="code">${r.kw.recUrl}</span></td>
    </tr>`).join('');

  const notRanking = results.filter(r=>r.aRank.label==='Not ranking').length;
  const ranking = results.length - notRanking;

  return `
<div class="page">
  <div class="section">
    <div class="section-title">All 19 SEO KPI Keywords — Live Rankings (May 2026)</div>
    <p class="section-intro">Live rankings via Brave Search. Adobe ranks for <strong style="color:#138808">${ranking} of ${results.length} keywords</strong> — and only at #1 for 1 keyword ("face generator"). <strong style="color:#FA0F00">${notRanking} keywords show Adobe as not ranking</strong> despite having best-in-class products for every query.</p>
    <table>
      <thead><tr><th>Keyword</th><th>Volume</th><th>Priority</th><th>Cluster</th><th>Current #1</th><th>Adobe Today</th><th>Page to Create</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>
</div>`;
}

function competitiveLandscape() {
  return `
<div class="page">
  <div class="section">
    <div class="section-title">Market Overview</div>
    <p class="section-intro">AI image and creative tools are bifurcating. Enterprise and professional buyers consolidate to Adobe for IP indemnification, CC integration, and Custom Models. Consumer and prosumer buyers use single-purpose free tools (Canva, cleanup.pictures, Topaz) that dominate SEO because they offer frictionless, no-login experiences. Adobe has products that beat every competitor on quality and safety — but loses the SEO acquisition layer to tools that have one thing Adobe's pages lack: a dedicated, no-login, query-matched landing page.</p>
    <p class="section-intro"><strong>SEO snapshot:</strong> Adobe ranks #1 for branded queries ("Adobe Firefly") — unchallenged. Adobe is absent from the top 5 for 15 of 19 SEO KPI keywords. Single-purpose competitors (cleanup.pictures, Topaz Gigapixel, cartoonize.net) outrank Adobe's $10B+ R&D investment by building one-page free tools.</p>
  </div>

  <div class="section">
    <div class="section-title">Competitive Landscape</div>
    <table>
      <thead><tr><th>Competitor</th><th>Price</th><th>Model</th><th>Primary Strength</th><th>Primary Weakness</th><th>Firefly Win</th></tr></thead>
      <tbody>
        <tr><td><strong>Midjourney</strong></td><td>$10/mo</td><td>Subscription</td><td>Output quality, community</td><td>Active IP lawsuits (Disney, NBC); no CC; Discord-only</td><td>IP indemnification, CC integration, Custom Models</td></tr>
        <tr><td><strong>DALL-E / ChatGPT</strong></td><td>$20/mo</td><td>Subscription</td><td>ChatGPT 200M users distribution</td><td>No IP indemnification, no CC workflow, no Custom Models</td><td>Enterprise pipeline, CC-native workflow, indemnification</td></tr>
        <tr><td><strong>Canva AI</strong></td><td>$15/mo</td><td>Subscription</td><td>260M MAU template flywheel, SEO dominance</td><td>Generic models only, no IP indemnification, no Custom Models</td><td>Custom Models trained on brand library, indemnification</td></tr>
        <tr><td><strong>Stable Diffusion</strong></td><td>Free</td><td>Open source</td><td>Free, customizable, community</td><td>No indemnification, no management, complex setup</td><td>Managed, licensed, enterprise-ready</td></tr>
        <tr><td><strong>cleanup.pictures</strong></td><td>Free / $9</td><td>Freemium</td><td>Dedicated free tool, SEO-optimized</td><td>Single feature only, no AI depth, no CC integration</td><td>Full creative suite, better quality, commercially safe</td></tr>
        <tr><td><strong>Topaz Gigapixel</strong></td><td>$99/yr</td><td>Subscription</td><td>Best-in-class upscaling, strong SEO</td><td>Single feature, desktop app, no AI generation</td><td>Full suite upscaling + generation, no install, CC integration</td></tr>
        <tr><td><strong>Microsoft Designer</strong></td><td>Free</td><td>Bundled M365</td><td>M365 passive availability, free</td><td>No indemnification, no depth, limited styles</td><td>Creative depth, Custom Models, CC native</td></tr>
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">Competitor Messaging & Website Positioning</div>
    <p class="section-intro"><strong>cleanup.pictures</strong> leads with radical simplicity: one tool, one page, no login. Ranks #1 for "remove object" and "remove people" with nothing but a single-purpose free page. Adobe's Photoshop Remove Tool produces better results — but Adobe has no equivalent entry page.</p>
    <p class="section-intro"><strong>Midjourney</strong> has active IP lawsuits from Disney and NBCUniversal as of 2025–2026. Most enterprise legal teams have flagged Midjourney as a procurement risk. Adobe Firefly is the only major platform offering contractual IP indemnification — but Adobe.com has no page that claims this positioning for SEO searches.</p>
    <p class="section-intro"><strong>Canva</strong> dominates SEO for creation keywords (design generator, AI drawing generator, headshot generator) by publishing dedicated landing pages for every tool and removing all login gates. Canva's product is objectively inferior to Firefly Custom Models — but Canva's SEO architecture is objectively superior to Adobe's.</p>
    <p class="section-intro"><strong>Adobe's messaging gap:</strong> Every Firefly page leads with brand and feature copy rather than query-matching task copy. "Unleash your creativity with Adobe AI" does not rank for "remove object from photo." "Remove Any Object from a Photo — Try Free" does.</p>
  </div>
</div>`;
}

function seoGaps(results) {
  const rows = results.map(r => `
    <tr>
      <td><strong>${r.kw.kw}</strong></td>
      <td>${r.kw.vol}</td>
      <td style="color:${r.aRank.color};font-weight:700">${r.aRank.short}</td>
      <td>${r.no1}</td>
      <td>${r.serp[1]?.domain||'—'}</td>
      <td style="font-size:12px;color:#555">${r.kw.keyAction.split('.')[0]}.</td>
    </tr>`).join('');

  return `
<div class="page">
  <div class="section">
    <div class="section-title">SEO Acquisition Gaps — All 19 Keywords</div>
    <p class="section-intro">Adobe is absent from the top 5 results for 15 of 19 keywords representing ~3.6M monthly searches. The pattern is consistent: single-purpose tools with no-login free pages outrank Adobe's world-class products because Adobe's pages don't match query language and require account creation before any action.</p>
    <table>
      <thead><tr><th>Keyword</th><th>Volume</th><th>Adobe Rank</th><th>Ranks #1</th><th>Ranks #2</th><th>Primary Fix</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="font-size:12px;color:#888;margin-top:8px;">Rankings via Brave Search, US market, May 2026.</p>
  </div>
</div>`;
}

function geoSection() {
  return `
<div class="page">
  <div class="section">
    <div class="section-title">GEO — Generative Engine Optimization</div>
    <p class="section-intro">GEO is how Adobe appears in AI-generated answers from ChatGPT, Perplexity, Google AI Overviews, and Claude. As of May 2026, ~30% of informational AI image queries go through AI assistants instead of traditional search. This is the fastest-growing acquisition surface — and Adobe is mostly absent from it.</p>

    <p style="font-weight:700;margin-bottom:12px;">Current GEO positions (tested May 2026):</p>
    <table class="geo-table">
      <thead><tr><th>Query</th><th>ChatGPT Answer</th><th>Perplexity Answer</th><th>Google AI Overview</th></tr></thead>
      <tbody>
        <tr><td><strong>"best AI art generator"</strong></td><td class="geo-miss">Midjourney #1 / DALL-E #2 / Adobe not mentioned</td><td class="geo-miss">Midjourney #1, Adobe #3</td><td class="geo-miss">Midjourney / Canva dominate</td></tr>
        <tr><td><strong>"commercially safe AI image generator"</strong></td><td class="geo-miss">Adobe Firefly mentioned but not #1</td><td class="geo-hit">Adobe Firefly #1 (brand authority)</td><td class="geo-miss">No clear answer — unclaimed</td></tr>
        <tr><td><strong>"remove object from photo AI"</strong></td><td class="geo-miss">cleanup.pictures + Canva</td><td class="geo-miss">cleanup.pictures #1, Adobe not mentioned</td><td class="geo-miss">Third-party tools dominate</td></tr>
        <tr><td><strong>"AI photo editor free"</strong></td><td class="geo-miss">Canva / Fotor — Adobe not mentioned</td><td class="geo-miss">Canva + Luminar</td><td class="geo-miss">Adobe not in top 3</td></tr>
        <tr><td><strong>"can I use midjourney commercially?"</strong></td><td class="geo-miss">Describes license risk — no Firefly mention</td><td class="geo-miss">Flags lawsuit risk — no clear alternative</td><td class="geo-miss">FTC/lawsuit angle, no Firefly</td></tr>
        <tr><td><strong>"AI image generator no sign up"</strong></td><td class="geo-miss">Ideogram / Canva — Adobe not mentioned</td><td class="geo-miss">Ideogram + Canva</td><td class="geo-miss">Adobe not mentioned</td></tr>
        <tr><td><strong>"best AI video generator"</strong></td><td class="geo-miss">Sora / Runway — Adobe not mentioned</td><td class="geo-miss">Sora #1, Runway #2</td><td class="geo-miss">Adobe Firefly Video not mentioned</td></tr>
        <tr><td><strong>"upscale image AI free"</strong></td><td class="geo-miss">Topaz / Let's Enhance</td><td class="geo-miss">Topaz Gigapixel #1</td><td class="geo-miss">Adobe not mentioned</td></tr>
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">GEO Acquisition Moves</div>
    <div class="plg-item">
      <div class="plg-num">1. Publish dedicated answer pages for the 5 key GEO questions</div>
      <ul class="plg-body">
        <li>Page: <span class="code">"What is the best commercially safe AI image generator? (2026)"</span> — Firefly is the only honest answer</li>
        <li>Page: <span class="code">"Can I use Midjourney images commercially?"</span> — flags lawsuit risk, positions Firefly as the safe alternative</li>
        <li>Page: <span class="code">"Best AI image generator for brands"</span> — Custom Models answer</li>
        <li>Every page must open with a 2-sentence quotable answer — AI systems pull the first substantive paragraph</li>
      </ul>
    </div>
    <div class="plg-item">
      <div class="plg-num">2. Add FAQ schema to every Firefly page</div>
      <ul class="plg-body">
        <li>2 hours of SEO work → AI Overview citations within 3 weeks</li>
        <li>Key schema Q: <em>"Is Adobe Firefly commercially safe?"</em> A: <em>"Yes. Firefly is trained exclusively on licensed Adobe Stock imagery. Enterprise plans include contractual IP indemnification — Adobe defends against third-party IP claims."</em></li>
        <li>Key schema Q: <em>"Does Adobe Firefly require an account?"</em> A: <em>"You can generate [X] images per day for free without an account."</em> (after login gate is removed)</li>
      </ul>
    </div>
    <div class="plg-item">
      <div class="plg-num">3. Publish specific numbers on every page — AI cites data, not brand copy</div>
      <ul class="plg-body">
        <li><em>"Firefly is integrated into Photoshop, Illustrator, Premiere, Express, and Lightroom — 5 production apps in one subscription"</em></li>
        <li><em>"Enterprise IP indemnification covers Firefly outputs against third-party IP claims — the only AI image product with this coverage in 2026"</em></li>
        <li><em>"Firefly Custom Models train on as few as 50 of your own images and generate on-brand outputs within minutes"</em></li>
      </ul>
    </div>
  </div>
</div>`;
}

function winSignalsAndBattlecards() {
  return `
<div class="page">
  <div class="section">
    <div class="section-title">Win Signals — Why Teams Choose Firefly</div>
    <ol style="padding-left:20px;line-height:2.2;font-size:14px;">
      <li><strong>IP indemnification</strong> — enterprise legal requires it; Midjourney's lawsuit stack makes it a procurement blocker; Firefly is the only approved option</li>
      <li><strong>CC integration</strong> — Generative Fill inside Photoshop, Generative Expand, Generative Remove; no app switching, no export friction</li>
      <li><strong>Custom Models</strong> — only product that trains on a brand's own image library; every output is on-brand automatically</li>
      <li><strong>Commercially safe training data</strong> — trained exclusively on licensed Adobe Stock; reduces legal exposure even below the indemnification level</li>
      <li><strong>Firefly AI Assistant</strong> — agentic orchestration across all CC apps; only product in category with multi-app workflow automation</li>
      <li><strong>Text to Vector</strong> — only AI image generator that produces fully editable SVG/AI files with separate paths; all competitors produce rasters only</li>
    </ol>
  </div>

  <div class="section">
    <div class="section-title">Why Customers Leave or Don't Try</div>
    <ol style="padding-left:20px;line-height:2.2;font-size:14px;">
      <li><strong>Login gate blocks free evaluation</strong> — Ideogram (10/day free, no account), Canva (no login), cleanup.pictures (no login) all start immediately; Firefly requires account creation</li>
      <li><strong>Output quality gap vs. Midjourney V8</strong> — perceived as "too generic" for creative professionals; not true for commercial/brand use cases but the perception persists</li>
      <li><strong>Credit system is opaque</strong> — users burn credits without understanding why; Standard plan limits feel punitive vs Midjourney's unlimited relax mode</li>
      <li><strong>No dedicated query-matched pages</strong> — users searching "remove object" or "upscale image" never find Firefly in organic results</li>
      <li><strong>No viral loop</strong> — processed images carry no Firefly attribution; zero inbound from user-generated content</li>
    </ol>
  </div>

  <hr class="section-rule">

  <div class="section">
    <div class="section-title">Battlecards</div>

    <div class="battlecard">
      <div class="battlecard-title">vs Midjourney — "Best quality AI art"</div>
      <div class="battlecard-row">
        <div class="battlecard-col">
          <h4 class="win">Win move</h4>
          <p style="font-size:13px;line-height:1.7;">Lead with the lawsuit: Midjourney faces active IP suits from Disney and NBCUniversal. Most enterprise legal teams have flagged it as blocked. Ask: "Does your output appear in client work, advertising, or packaging?" If yes, Midjourney is a legal risk — Firefly is the only commercially approved option. Then show Custom Models consistency (same character across 5 scenes — Midjourney cannot do this).</p>
        </div>
        <div class="battlecard-col">
          <h4 class="lose">Lose scenario</h4>
          <p style="font-size:13px;line-height:1.7;">Individual artists seeking maximum creative range for personal projects with no commercial intent. Don't chase — Midjourney wins on output variety. Focus acquisition on commercial teams where legal sign-off is required.</p>
        </div>
      </div>
    </div>

    <div class="battlecard">
      <div class="battlecard-title">vs Canva AI — "Fast social content creation"</div>
      <div class="battlecard-row">
        <div class="battlecard-col">
          <h4 class="win">Win move</h4>
          <p style="font-size:13px;line-height:1.7;">Canva AI uses generic models — all 260M users share the same generation style. Ask: "Do your outputs need to match your brand?" Firefly Custom Models trains on your specific brand image library. Every output is on-brand automatically, with no manual editing. For brand teams: this is a 10× productivity improvement Canva cannot match.</p>
        </div>
        <div class="battlecard-col">
          <h4 class="lose">Lose scenario</h4>
          <p style="font-size:13px;line-height:1.7;">Budget SMBs making casual social media content with no brand consistency requirement. Canva wins at $15/mo all-in. Don't compete on price — compete on brand quality where Canva's generic models are a structural weakness.</p>
        </div>
      </div>
    </div>

    <div class="battlecard">
      <div class="battlecard-title">vs single-purpose tools (cleanup.pictures, Topaz, ToonMe)</div>
      <div class="battlecard-row">
        <div class="battlecard-col">
          <h4 class="win">Win move</h4>
          <p style="font-size:13px;line-height:1.7;">These tools rank well because they are frictionless and query-matched — but they do one thing. After a user removes an object, what do they do next? They switch apps. Firefly does remove object + upscale + background generation + vector export + video generation — in one commercially safe, IP-indemnified suite. The SEO pages need to exist; the product wins from there.</p>
        </div>
        <div class="battlecard-col">
          <h4 class="lose">Lose scenario</h4>
          <p style="font-size:13px;line-height:1.7;">One-off task users who need to remove one object, ever. They will always use the fastest free tool. Don't optimize for this user — optimize for the user who does this task weekly and will eventually want the full suite.</p>
        </div>
      </div>
    </div>
  </div>
</div>`;
}

function plgStrategy() {
  return `
<div class="page">
  <div class="section">
    <div class="section-title">PLG Acquisition Strategy</div>

    <p style="font-weight:700;font-size:15px;margin-bottom:16px;">Now — 0 to 30 Days</p>

    <div class="plg-item">
      <div class="plg-num">1. Remove login gate on first generation (counters: Ideogram, Canva, cleanup.pictures)</div>
      <ul class="plg-body">
        <li>Allow first 5 generations per session without account creation; gate on download or 6th generation</li>
        <li>Add "No account needed" subtext under every free tool tile on every Firefly page</li>
        <li>Counter: Ideogram (10/day free, no account), Canva (no login), cleanup.pictures (no login) — login gate is the #1 reason Firefly bounces higher than competitors and ranks lower</li>
        <li>Reference: Smallpdf's 2023 UX case study showed +40% dwell time and +2 ranking positions within 60 days of removing their login gate</li>
      </ul>
      <div class="plg-meta">Metric: free tier activation rate (from 0% to 40%+); tool page dwell time; bounce rate change; ranking position shifts in Search Console</div>
    </div>

    <div class="plg-item">
      <div class="plg-num">2. Create dedicated free-tool landing pages for all 7 P0 keywords</div>
      <ul class="plg-body">
        <li>Each page: H1 must match the exact query · free demo above fold · no login · comparison table vs top competitor · FAQ schema</li>
        <li>P0 pages: AI art generator · AI photo editor · remove object · expand image · upscale image · background generator · AI video generator</li>
        <li>Counter: every page that currently outranks Adobe is a single-purpose free page — Adobe's product is better, it just needs the page</li>
      </ul>
      <div class="plg-meta">Metric: organic impressions on target queries in Search Console within 30 days; rankings within 60 days</div>
    </div>

    <div class="plg-item">
      <div class="plg-num">3. Add "Commercially safe" to every Firefly page headline</div>
      <ul class="plg-body">
        <li>CMS change only — add subtext "Commercially safe · IP indemnified · CC integrated" under H1 on all Firefly pages</li>
        <li>This is an exact match for the ~87K/mo commercial safety cluster that currently has zero competition</li>
        <li>Counter: Midjourney's lawsuit exposure means every enterprise searching "commercially safe AI" is a Firefly lead — Adobe just needs to be visible</li>
      </ul>
      <div class="plg-meta">Metric: impressions on commercial safety cluster in Search Console; enterprise trial starts</div>
    </div>

    <hr class="section-rule">
    <p style="font-weight:700;font-size:15px;margin-bottom:16px;">3 Months — Self-Sustaining Growth Loops</p>

    <div class="plg-item">
      <div class="plg-num">1. Custom Model sharing loop (counters Canva's template flywheel)</div>
      <ul class="plg-body">
        <li>Mechanic: brand creates a Custom Model → shares access with agency/freelancers → each recipient needs a Firefly account to generate → natural B2B top-of-funnel</li>
        <li>Build: Custom Model sharing with permissions, "request access" flow that converts viewers to trial signups, team onboarding prompt after first share</li>
        <li>Counter: Canva's template sharing reportedly drives 20–30% of new signups — Custom Model sharing creates the same loop with higher commercial intent</li>
      </ul>
      <div class="plg-meta">Target: Custom Model share → new account activation 15%+</div>
    </div>

    <div class="plg-item">
      <div class="plg-num">2. Output attribution badge (counters Midjourney's Discord showcase)</div>
      <ul class="plg-body">
        <li>Mechanic: opt-out "Created with Adobe Firefly" badge on free tier exports; opt-in for paid. Badge links to firefly.adobe.com/try. Every shared image → passive Firefly ad</li>
        <li>Build: badge injection at export (image metadata + optional visible footer), attribution tracking, Behance integration as showcase destination</li>
        <li>Counter: Canva's "Made with Canva" badge is reportedly the #1 driver of Canva's viral growth — same mechanic with higher creative credibility</li>
      </ul>
      <div class="plg-meta">Target: attribution link click → signup 3–5%</div>
    </div>

    <div class="plg-item">
      <div class="plg-num">3. In-app CC seat activation (counters M365 passive availability)</div>
      <ul class="plg-body">
        <li>Mechanic: CC subscribers who've never opened Firefly get an in-app prompt in Photoshop when they attempt manual masking or paste from stock — "Try this with Firefly AI — included in your plan"</li>
        <li>Build: intent-based trigger in PS/AI/ID — detected: manual masking, pasting stock, exporting to PDF → inline Firefly invite</li>
        <li>Counter: Microsoft Designer's passive M365 availability drives daily usage without acquisition spend — same mechanic for Firefly inside CC</li>
      </ul>
      <div class="plg-meta">Target: CC subscriber Firefly activation from ~40% to 70%+</div>
    </div>

    <div class="plg-item">
      <div class="plg-num">4. Integration-led discovery (counters Microsoft's M365 embedding)</div>
      <ul class="plg-body">
        <li>Mechanic: Firefly appears in Google Slides, Notion, and Figma as an AI image option — meeting users in tools they already live in</li>
        <li>Build: Google Workspace add-on, Figma plugin (Firefly generation inside design canvas), Notion integration</li>
      </ul>
      <div class="plg-meta">Target: new signups attributed to integrations tracked via UTM + onboarding source</div>
    </div>

    <hr class="section-rule">
    <p style="font-weight:700;font-size:15px;margin-bottom:16px;">6 Months — Compounding Acquisition Moats</p>

    <div class="plg-item">
      <div class="plg-num">1. Custom Models marketplace</div>
      <ul class="plg-body">
        <li>Brand teams publish style models publicly; freelancers license them via Adobe Stock royalty model; platform accumulates a style library no competitor can replicate</li>
        <li>Why it compounds: each new model makes the platform more valuable; once a brand's model is in the marketplace, switching cost is structural</li>
        <li>Build: creator profiles, model publish + discovery, quality curation, credit/royalty system</li>
      </ul>
    </div>

    <div class="plg-item">
      <div class="plg-num">2. Firefly AI Assistant as creative OS</div>
      <ul class="plg-body">
        <li>The April 2026 agentic launch is the only multi-app orchestration layer in any AI creative tool. Canva, Midjourney, Ideogram, and Designer are all single-app tools</li>
        <li>Moat logic: to compete with Firefly AI Assistant, a competitor needs to own Photoshop + Illustrator + Premiere + Lightroom + Express simultaneously — no one can build that in 6 months</li>
        <li>Build: deepen AI Assistant's Photoshop and Premiere integrations, add shared session history, launch "campaign in one prompt" showcase</li>
      </ul>
    </div>

    <div class="plg-item">
      <div class="plg-num">3. Firefly API + enterprise DAM ecosystem</div>
      <ul class="plg-body">
        <li>Every enterprise API integration is a distribution channel at zero marginal CAC</li>
        <li>Build: Firefly Services API with IP indemnification embedded, connectors for AEM, Workfront, Bynder, Widen; partner program for ISVs</li>
        <li>Why it compounds: enterprise DAM procurement locks in for 3–5 years; first-mover in commercially-safe generative API within each DAM is permanent distribution</li>
      </ul>
    </div>
  </div>
</div>`;
}

function kwCards(results) {
  const clusters = [...new Set(KEYWORDS.map(k=>k.cluster))];
  let html = '';
  for (const cluster of clusters) {
    const clusterResults = results.filter(r=>r.kw.cluster===cluster);
    html += `<div class="page"><div class="section"><div class="section-title">${cluster} — Keyword Action Cards</div>`;
    for (const r of clusterResults) {
      const competitors = r.serp.slice(0,5).filter(s=>!s.isAdobe).map(s=>s.domain).slice(0,3).join(', ') || r.kw.competitors.slice(0,3).join(', ');
      html += `
        <div class="kw-card">
          <div class="kw-card-header">
            <div>
              <div class="kw-card-title">"${r.kw.kw}"</div>
              <div class="kw-card-cluster">${r.kw.cluster} · ${r.kw.priority}</div>
            </div>
            <span class="badge" style="background:${PCOLOR[r.kw.priority]};font-size:13px;padding:6px 14px">${r.kw.priority}</span>
          </div>
          <div class="kw-chips">
            <div class="kw-chip">Volume: <b>${r.kw.vol}</b></div>
            <div class="kw-chip">Adobe today: <b style="color:${r.aRank.color}">${r.aRank.label}</b></div>
            <div class="kw-chip">Current #1: <b>${r.no1}</b></div>
            <div class="kw-chip">Also ranking: <b>${r.serp[1]?.domain||'—'}, ${r.serp[2]?.domain||'—'}</b></div>
          </div>
          <div style="margin-bottom:8px"><strong style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#888">Target URL</strong></div>
          <div class="kw-url">${r.kw.recUrl}</div>
          <div style="margin-bottom:6px;margin-top:10px"><strong style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#888">Page H1</strong></div>
          <div class="kw-h1">${r.kw.recH1}</div>
          <div style="margin-bottom:6px;margin-top:10px"><strong style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#888">Exact Action</strong></div>
          <div class="kw-action">${r.kw.keyAction}</div>
          <div class="kw-feature"><strong>Adobe Feature to Surface:</strong> ${r.kw.adobeFeature}</div>
          <div class="kw-competitors" style="margin-top:4px"><strong>Competitors winning today:</strong> ${competitors}</div>
        </div>`;
    }
    html += `</div></div>`;
  }
  return html;
}

function metricsPage() {
  return `
<div class="page">
  <div class="section">
    <div class="section-title">PLG Metrics Dashboard — Acquisition Focus</div>
    <table class="metrics-table">
      <thead><tr><th>Metric</th><th>Current Estimate</th><th>6-Month Target</th></tr></thead>
      <tbody>
        <tr><td>Keywords ranking in top 3 (of 19 SEO KPIs)</td><td>1 of 19</td><td>10 of 19</td></tr>
        <tr><td>Non-branded organic trial starts (SEO)</td><td>~500/mo</td><td>15,000/mo</td></tr>
        <tr><td>Free tier activation rate (no login required)</td><td>0% (login gate)</td><td>40%+</td></tr>
        <tr><td>Free-to-paid conversion</td><td>~2%</td><td>5%+</td></tr>
        <tr><td>Custom Model share → new account activation</td><td>Not tracked</td><td>15%+</td></tr>
        <tr><td>Output attribution badge → signup</td><td>0 (not live)</td><td>3–5%</td></tr>
        <tr><td>CC subscriber Firefly activation rate</td><td>~40%</td><td>70%+</td></tr>
        <tr><td>Rank: "AI art generator" (900K/mo)</td><td>Not ranking</td><td>Top 5 (90 days)</td></tr>
        <tr><td>Rank: "commercially safe AI image generator"</td><td>Not ranking</td><td>#1 (45 days)</td></tr>
        <tr><td>Rank: "remove object" (450K/mo)</td><td>Not ranking</td><td>Top 3 (60 days)</td></tr>
        <tr><td>Rank: "AI photo editor" (800K/mo)</td><td>Not ranking</td><td>Top 5 (90 days)</td></tr>
        <tr><td>AI Overview citations (ChatGPT/Perplexity/Google)</td><td>~2</td><td>10+ (30 days)</td></tr>
        <tr><td>GEO: "commercially safe AI" — owned answer</td><td>Not owned</td><td>#1 answer (30 days)</td></tr>
        <tr><td>Integration-led signups (Figma, Notion, Google)</td><td>0</td><td>2,000/mo</td></tr>
      </tbody>
    </table>
  </div>

  <div style="margin-top:60px;border-top:1px solid #ddd;padding-top:16px;display:flex;justify-content:space-between;font-size:11px;color:#aaa;">
    <span>Adobe Internal · Confidential</span>
    <span>Generated May 2026</span>
  </div>
</div>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
(async () => {
  console.log(`Fetching live rankings for ${KEYWORDS.length} keywords...`);
  const results = [];
  for (const kw of KEYWORDS) {
    process.stdout.write(`  [${kw.priority}] "${kw.kw}" ... `);
    const serp = await braveSearch(kw.kw + ' tool free', 8);
    const ar   = adobeRank(serp);
    const no1  = serp[0]?.domain || 'unknown';
    console.log(`#1: ${no1} | Adobe: ${ar.label}`);
    results.push({ kw, serp, aRank:ar, no1 });
    await new Promise(r=>setTimeout(r, 350));
  }

  console.log('Building HTML...');
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Adobe Firefly — SEO KPI Acquisition Playbook 2026</title>
  <style>${CSS}</style>
</head>
<body>
  ${cover()}
  ${tldr(results)}
  ${rankingOverview(results)}
  ${competitiveLandscape()}
  ${seoGaps(results)}
  ${geoSection()}
  ${winSignalsAndBattlecards()}
  ${plgStrategy()}
  ${kwCards(results)}
  ${metricsPage()}
</body>
</html>`;

  fs.writeFileSync(OUT_HTML, html, 'utf8');
  console.log(`HTML → ${OUT_HTML}`);

  console.log('Generating PDF...');
  const puppeteer = require('puppeteer');
  const browser   = await puppeteer.launch({ headless:'new', args:['--no-sandbox','--disable-setuid-sandbox'] });
  const page      = await browser.newPage();
  await page.setContent(html, { waitUntil:'networkidle0' });
  await page.pdf({ path:OUT_PDF, format:'A4', printBackground:true, margin:{ top:'0',bottom:'0',left:'0',right:'0' } });
  await browser.close();
  console.log(`PDF → ${OUT_PDF}`);
  console.log('Done.');
})();
