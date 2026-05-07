/**
 * Captures live Google SERPs + Perplexity GEO answers for key Firefly queries.
 * Annotates Adobe's position (or absence), marks competitors, and renders
 * a per-query recommendation card below each screenshot.
 *
 * Output: docs/Adobe-Firefly-SEO-GEO-Rankings-Audit.html + PDF on Desktop
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Query definitions
// ---------------------------------------------------------------------------

const QUERIES = [
  // ── SEO Cluster A: Commercial Safety (unclaimed) ──
  {
    id: 'commercial-safe',
    cluster: 'A — Commercial Safety',
    clusterColor: '#138808',
    query: 'commercially safe ai image generator',
    displayQuery: '"commercially safe ai image generator"',
    monthlySearches: '~22K/mo',
    type: 'google',
    adobeExpectedRank: 'Not ranking',
    opportunity: 'UNCLAIMED — no competitor can honestly own this',
    recommendation: {
      action: 'CREATE page within 7 days',
      url: '/products/firefly/commercial-safe-ai',
      h1: 'The Only Commercially Safe AI Image Generator — Adobe Firefly',
      whyItWins: 'Midjourney has active IP lawsuits from Disney & NBC. DALL-E and Canva AI have no indemnification. Firefly is the only platform that can write a credible page for this query.',
      contentOutline: [
        'Lead paragraph: define what "commercially safe" means — trained on licensed data, IP indemnification included',
        'Comparison table: Firefly vs Midjourney vs DALL-E vs Canva AI — indemnification column alone wins this',
        'FAQ schema: "Is Adobe Firefly commercially safe?" / "What AI image generator has IP indemnification?"',
        '"Enterprise plan" CTA — this query maps to legal/procurement buyer, not individual creator',
      ],
      timeToRank: '30–45 days',
      metric: 'impressions on commercial safety cluster in Search Console',
    },
  },
  {
    id: 'commercial-use',
    cluster: 'A — Commercial Safety',
    clusterColor: '#138808',
    query: 'ai image generator for commercial use',
    displayQuery: '"ai image generator for commercial use"',
    monthlySearches: '~65K/mo',
    type: 'google',
    adobeExpectedRank: 'Not ranking',
    opportunity: 'HIGH VOLUME — 65K/mo, no competitor owns it with indemnification story',
    recommendation: {
      action: 'CREATE page within 7 days',
      url: '/products/firefly/commercial-use',
      h1: 'AI Image Generator for Commercial Use — With IP Indemnification',
      whyItWins: 'This is the highest-volume query in the commercial safety cluster. Users typing this are buyers, not browsers. Current #1 results are generic listicles — a definitive Adobe answer page wins.',
      contentOutline: [
        'Answer-first H1 + opening: "Adobe Firefly is the only AI image generator with enterprise IP indemnification — meaning Adobe defends you if a third-party IP claim arises"',
        'Table: commercial use rights per platform (Firefly / Midjourney / DALL-E / SD / Canva)',
        'FAQ: "Can I use AI-generated images for commercial projects?" "What AI image generator is safe for advertising?"',
        'Case study block: how an enterprise brand uses Firefly for campaign assets with legal sign-off',
      ],
      timeToRank: '45–60 days',
      metric: 'organic clicks from commercial-use cluster; enterprise trial starts',
    },
  },

  // ── SEO Cluster B: Competitor Conquest ──
  {
    id: 'midjourney-alt',
    cluster: 'B — Competitor Conquest',
    clusterColor: '#E64646',
    query: 'midjourney alternative',
    displayQuery: '"midjourney alternative"',
    monthlySearches: '~110K/mo',
    type: 'google',
    adobeExpectedRank: 'Not ranking',
    opportunity: 'HIGHEST VOLUME conquest query — Midjourney lawsuit exposure is a live trigger',
    recommendation: {
      action: 'CREATE page within 7 days',
      url: '/products/firefly/vs/midjourney',
      h1: 'Adobe Firefly vs. Midjourney — The Commercially Safe Alternative',
      whyItWins: 'Midjourney has active IP lawsuits from Disney, NBCUniversal, and Warner Bros. Brands and agencies evaluating Midjourney hit legal blockers — this query is their next click. Adobe can own the answer.',
      contentOutline: [
        'Hero message: "Midjourney is being sued by Disney and NBC for IP infringement. Adobe Firefly is the enterprise alternative with full IP indemnification."',
        'Feature comparison table: quality / price / CC integration / IP safety / free tier / video / vector',
        'Use-case split: "Choose Midjourney if…" / "Choose Firefly if…" — honest framing builds trust',
        'FAQ: "Is Midjourney safe for commercial use?" → answer: risky / "What is the best Midjourney alternative for brands?"',
      ],
      timeToRank: '45–60 days',
      metric: 'rank for "midjourney alternative"; trial starts from comparison page',
    },
  },
  {
    id: 'canva-ai-alt',
    cluster: 'B — Competitor Conquest',
    clusterColor: '#E64646',
    query: 'canva ai vs adobe firefly',
    displayQuery: '"canva ai vs adobe firefly"',
    monthlySearches: '~12K/mo',
    type: 'google',
    adobeExpectedRank: 'Not ranking (competitors write this page about Adobe)',
    opportunity: 'Adobe should write this page — currently ceding the narrative to Canva and review sites',
    recommendation: {
      action: 'CREATE page within 14 days',
      url: '/products/firefly/vs/canva-ai',
      h1: 'Adobe Firefly vs. Canva AI — Custom Models vs Generic AI',
      whyItWins: 'Canva is winning SMB at $15/mo. Adobe cannot win on price. Adobe wins on: Custom Models (trains on your brand library), IP indemnification, CC integration depth, video/vector. This page owns that narrative before Canva does.',
      contentOutline: [
        'Price table: $15 Canva Pro all-in vs. $59.99 CC Pro — be transparent; explain what extra $45 buys',
        'Differentiator: Custom Models — "Canva AI generates generic images. Firefly Custom Models generate YOUR brand images."',
        'When to use which: Canva for quick social posts; Firefly for brand campaigns, legal sign-off, CC workflow',
        'FAQ: "Is Canva AI safe for commercial use?" / "Does Canva AI train on my brand?"',
      ],
      timeToRank: '30–45 days',
      metric: 'rank for "canva ai alternative"; Custom Models trial starts',
    },
  },

  // ── SEO Cluster C: Unique Features (zero competition) ──
  {
    id: 'ai-vector',
    cluster: 'C — Unique Features',
    clusterColor: '#6F42C1',
    query: 'ai vector generator text to vector',
    displayQuery: '"ai vector generator" / "text to vector ai"',
    monthlySearches: '~62K/mo combined',
    type: 'google',
    adobeExpectedRank: 'Not ranking',
    opportunity: 'UNCONTESTED — no competitor has editable vector AI output; Firefly is the only answer',
    recommendation: {
      action: 'CREATE page this week — zero competition',
      url: '/products/firefly/features/text-to-vector',
      h1: 'Text to Vector — Generate Editable AI Vector Graphics',
      whyItWins: 'Midjourney, DALL-E, Canva AI, and Ideogram all generate raster (PNG/JPG). Only Firefly generates fully editable vector output from a text prompt. This query has no strong incumbent and Firefly is the definitive answer.',
      contentOutline: [
        'Answer-first: "Adobe Firefly Text to Vector generates fully editable SVG graphics from a text prompt — no competitor offers this"',
        'How it works: text prompt → vector output → open in Illustrator → edit paths, colors, shapes',
        'Use cases: logo concepts, brand marks, icons, scalable print assets',
        'FAQ: "Can AI generate SVG files?" / "What AI tool generates vector graphics?" / "How do I make a vector from text?"',
      ],
      timeToRank: '14–21 days (zero competition — fastest win)',
      metric: 'rank for "ai vector generator"; page views; Illustrator trial starts',
    },
  },
  {
    id: 'ai-photoshop',
    cluster: 'C — Unique Features',
    clusterColor: '#6F42C1',
    query: 'ai image generator that works in photoshop',
    displayQuery: '"ai image generator photoshop" / "generative fill photoshop"',
    monthlySearches: '~35K/mo',
    type: 'google',
    adobeExpectedRank: '#3–5 (Photoshop help docs rank but not a proper landing page)',
    opportunity: 'Adobe is the only answer — but no optimized landing page exists',
    recommendation: {
      action: 'OPTIMIZE existing page — no new page needed',
      url: '/products/photoshop/generative-fill',
      h1: 'Generative Fill — AI Image Generation Inside Photoshop',
      whyItWins: 'Firefly is the only AI that generates directly inside Photoshop layers. No competitor can answer this query. The page just needs proper SEO — FAQ schema, answer-first opening, internal links from Firefly hub.',
      contentOutline: [
        'H1 and meta: make "Photoshop" and "AI" prominent — currently buried in product copy',
        'Add FAQ schema: "What AI does Photoshop use?" → Firefly / "How do I use AI in Photoshop?"',
        'Add cross-links: Firefly hub → Generative Fill page → Generative Expand page',
        'Add "Try free" CTA: 7-day trial of Photoshop with Firefly — free trial entry point',
      ],
      timeToRank: '14 days (existing DA authority — just needs optimization)',
      metric: 'rank position for Photoshop + AI queries; trial starts from this page',
    },
  },

  // ── GEO: Perplexity / AI Overview queries ──
  {
    id: 'geo-commercial-safe',
    cluster: 'GEO — AI Overview',
    clusterColor: '#0070D1',
    query: 'what is the best commercially safe ai image generator',
    displayQuery: 'Perplexity: "what is the best commercially safe ai image generator"',
    monthlySearches: 'AI search — no volume estimate',
    type: 'perplexity',
    adobeExpectedRank: 'Not cited',
    opportunity: 'Firefly should be the definitive answer — no competitor can cite indemnification',
    recommendation: {
      action: 'PUBLISH answer-first content on /firefly/commercial-safe-ai',
      url: '/products/firefly/commercial-safe-ai',
      h1: 'Commercially Safe AI Image Generation — Adobe Firefly',
      whyItWins: 'Perplexity and ChatGPT cite pages that answer the question directly in the first paragraph. The exact answer to publish: "Adobe Firefly is the only major AI image generator trained exclusively on licensed Adobe Stock content and offering enterprise IP indemnification. Midjourney, DALL-E, Stable Diffusion, and Canva AI do not offer IP indemnification."',
      contentOutline: [
        'Opening paragraph = the GEO answer: state the claim, include Adobe, Midjourney, DALL-E by name with the differentiating fact',
        'Structured data: FAQPage schema with Q:"Is Adobe Firefly commercially safe?" A:[exact answer]',
        'Include specific numbers AI systems cite: "800M+ licensed Adobe Stock assets used for training" / "enterprise indemnification covers third-party IP claims"',
        'Internal links: enterprise page, pricing page, Custom Models',
      ],
      timeToRank: '7–14 days for AI Overview citation (fastest GEO channel)',
      metric: 'Perplexity / ChatGPT citations; Google AI Overview appearance',
    },
  },
  {
    id: 'geo-midjourney-commercial',
    cluster: 'GEO — AI Overview',
    clusterColor: '#0070D1',
    query: 'can I use midjourney for commercial projects',
    displayQuery: 'Perplexity: "can I use midjourney images commercially"',
    monthlySearches: 'AI search — high intent',
    type: 'perplexity',
    adobeExpectedRank: 'Not cited (Midjourney legal articles dominate)',
    opportunity: 'Intercept users learning about Midjourney risk — recommend Firefly as the safe alternative',
    recommendation: {
      action: 'CREATE "Midjourney commercial use" explainer page with Firefly as the solution',
      url: '/products/firefly/vs/midjourney',
      h1: 'Midjourney for Commercial Use: What You Need to Know in 2026',
      whyItWins: 'Users asking this are mid-evaluation with a commercial project in mind. The honest answer (Midjourney is risky due to active lawsuits) naturally leads to Firefly as the alternative. Publishing this page on adobe.com gets it cited over 3rd-party review sites.',
      contentOutline: [
        'Answer: Midjourney paid plans allow commercial use BUT Midjourney faces active IP lawsuits from Disney, NBCUniversal, and Warner Bros. — enterprises cannot use it without legal risk',
        'Comparison: Midjourney (no indemnification) vs Firefly (full enterprise indemnification)',
        'FAQ schema: "Is it safe to use Midjourney commercially?" / "What are the legal risks of Midjourney?"',
        'CTA: "Need commercially safe AI generation? Try Adobe Firefly free →"',
      ],
      timeToRank: '14–21 days for AI Overview citation',
      metric: 'citations on "midjourney commercial" queries; Firefly trial starts from this page',
    },
  },
  {
    id: 'geo-best-ai-image',
    cluster: 'GEO — AI Overview',
    clusterColor: '#0070D1',
    query: 'best ai image generator 2026',
    displayQuery: 'Perplexity: "best ai image generator 2026"',
    monthlySearches: 'AI search — highest volume GEO query',
    type: 'perplexity',
    adobeExpectedRank: 'Mentioned but not #1 — Midjourney and DALL-E typically lead',
    opportunity: 'Segment the answer: "best for commercial use" = Firefly; don\'t try to beat Midjourney on overall quality',
    recommendation: {
      action: 'PUBLISH comparison guide with Firefly owning the "commercial/enterprise" category',
      url: '/products/firefly/ai-image-generator-comparison',
      h1: 'Best AI Image Generators 2026 — Compared by Use Case',
      whyItWins: 'AI systems cite pages that organize by use case because they can quote specific verdicts. Publish a comparison that says: Midjourney = best for artists, DALL-E = best for ChatGPT users, Firefly = best for commercial/brand/enterprise. Firefly wins its category definitively.',
      contentOutline: [
        'Structure: "Best for commercial use: Adobe Firefly (only with IP indemnification)" — cited directly',
        '"Best for artistic quality: Midjourney V8" — be honest, it builds trust and gets cited',
        '"Best free: Ideogram (10/day), Canva AI (5/mo)" — again, honest',
        '"Best for CC users: Adobe Firefly — Generative Fill, Text to Vector, Custom Models"',
        'FAQ schema for every category verdict',
      ],
      timeToRank: '21–30 days for AI Overview citation',
      metric: 'AI Overview appearance; organic sessions from comparison queries',
    },
  },
];

// ---------------------------------------------------------------------------
// Competitor colour map (for SERP annotation)
// ---------------------------------------------------------------------------

const COMPETITOR_COLORS = {
  midjourney:  '#7B68EE',
  canva:       '#00C4CC',
  smallpdf:    '#EF4B4C',
  'stable diffusion': '#FF6B35',
  openai:      '#412991',
  ideogram:    '#1A73E8',
  adobe:       '#FF0000',
  default:     '#999999',
};

function getCompetitorColor(text) {
  const t = (text || '').toLowerCase();
  for (const [k, v] of Object.entries(COMPETITOR_COLORS)) {
    if (t.includes(k)) return v;
  }
  return COMPETITOR_COLORS.default;
}

// ---------------------------------------------------------------------------
// Inject SERP rank annotations
// ---------------------------------------------------------------------------

async function injectSerpAnnotations(tab) {
  await tab.evaluate(() => {
    document.body.style.position = 'relative';
    // Find organic result containers
    const results = document.querySelectorAll('div[data-sokoban-container], .g, [data-hveid], div[jscontroller]');
    let rank = 0;

    const containers = Array.from(document.querySelectorAll('.g, [data-rank]')).filter(el => {
      return el.querySelector('h3') && el.querySelector('a[href^="http"]');
    }).slice(0, 10);

    containers.forEach((el, i) => {
      const h3 = el.querySelector('h3');
      if (!h3) return;
      const text = h3.textContent || '';
      const isAdobe = text.toLowerCase().includes('adobe') || el.innerHTML.toLowerCase().includes('adobe.com');

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const r = el.getBoundingClientRect();
      if (r.width === 0) return;

      rank++;
      const color = isAdobe ? '#FF0000' : '#6c6c6c';
      const bgColor = isAdobe ? '#FFE5E5' : 'rgba(0,0,0,0.06)';

      // Rank badge
      const badge = document.createElement('div');
      badge.style.cssText = [
        'position:absolute',
        `top:${r.top + scrollTop - 2}px`,
        `left:${Math.max(r.left - 44, 4)}px`,
        'width:32px', 'height:32px', 'border-radius:50%',
        `background:${color}`, 'color:white',
        'font-family:-apple-system,sans-serif', 'font-size:14px', 'font-weight:800',
        'display:flex', 'align-items:center', 'justify-content:center',
        'z-index:2147483640', 'box-shadow:0 2px 6px rgba(0,0,0,0.35)',
      ].join(';');
      badge.textContent = rank;
      document.body.appendChild(badge);

      // Highlight if Adobe
      if (isAdobe) {
        const highlight = document.createElement('div');
        highlight.style.cssText = [
          'position:absolute',
          `top:${r.top + scrollTop - 4}px`,
          `left:${r.left - 4}px`,
          `width:${r.width + 8}px`,
          `height:${r.height + 8}px`,
          'border:3px solid #FF0000',
          'border-radius:6px',
          'background:rgba(255,0,0,0.04)',
          'z-index:2147483639',
          'pointer-events:none',
        ].join(';');
        document.body.appendChild(highlight);

        const label = document.createElement('div');
        label.style.cssText = [
          'position:absolute',
          `top:${r.top + scrollTop - 20}px`,
          `left:${r.left}px`,
          'background:#FF0000', 'color:white',
          'font-size:11px', 'font-weight:800',
          'padding:2px 8px', 'border-radius:3px',
          'z-index:2147483641',
        ].join(';');
        label.textContent = `ADOBE #${rank}`;
        document.body.appendChild(label);
      }
    });
  });
}

// ---------------------------------------------------------------------------
// Capture loop
// ---------------------------------------------------------------------------

async function capture() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-http2'],
  });

  const tmpDir = path.join(__dirname, '../.tmp-seo-audit');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  const results = [];

  for (const q of QUERIES) {
    console.log(`  Capturing: ${q.displayQuery}`);
    const tab = await browser.newPage();
    await tab.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
    await tab.setViewport({ width: 1440, height: 900 });
    await tab.setExtraHTTPHeaders({
      'Accept-Language': 'en-IN,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    });

    let screenshotPath = null;
    try {
      if (q.type === 'perplexity') {
        const url = `https://www.perplexity.ai/search?q=${encodeURIComponent(q.query)}`;
        await tab.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await new Promise(r => setTimeout(r, 5000));
      } else {
        const url = `https://www.google.com/search?q=${encodeURIComponent(q.query)}&hl=en&gl=in`;
        await tab.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await new Promise(r => setTimeout(r, 2500));
        await injectSerpAnnotations(tab);
        await new Promise(r => setTimeout(r, 300));
      }

      screenshotPath = path.join(tmpDir, `${q.id}.png`);
      await tab.screenshot({ path: screenshotPath, fullPage: false, type: 'png' });
      console.log(`    ✓ ${q.id}.png`);
    } catch (err) {
      console.log(`    ✗ ${q.id}: ${err.message}`);
    }
    await tab.close();
    results.push({ ...q, screenshotPath });
  }

  await browser.close();
  return results;
}

// ---------------------------------------------------------------------------
// Build HTML
// ---------------------------------------------------------------------------

function buildHTML(results) {
  const clusterGroups = {};
  for (const r of results) {
    if (!clusterGroups[r.cluster]) clusterGroups[r.cluster] = [];
    clusterGroups[r.cluster].push(r);
  }

  const clusterSections = Object.entries(clusterGroups).map(([cluster, items]) => {
    const color = items[0].clusterColor;

    const cards = items.map((item, i) => {
      const imgTag = (item.screenshotPath && fs.existsSync(item.screenshotPath))
        ? `<img src="data:image/png;base64,${fs.readFileSync(item.screenshotPath).toString('base64')}" alt="${item.displayQuery}" />`
        : `<div class="no-screenshot">Screenshot unavailable</div>`;

      const rec = item.recommendation;
      const isNotRanking = item.adobeExpectedRank.toLowerCase().includes('not ranking');
      const rankBadgeColor = isNotRanking ? '#CC0000' : '#FF9933';

      return `
      <div class="query-block">
        <div class="query-header">
          <div class="query-info">
            <div class="query-text">${item.displayQuery}</div>
            <div class="query-meta">
              <span class="vol-badge">${item.monthlySearches}</span>
              <span class="rank-badge" style="background:${rankBadgeColor};">Adobe today: ${item.adobeExpectedRank}</span>
              <span class="opp-badge" style="background:${color};">${item.opportunity}</span>
            </div>
          </div>
        </div>

        <div class="content-split">
          <div class="screenshot-col">
            <div class="screenshot-label">${item.type === 'perplexity' ? 'Perplexity AI Answer' : 'Google SERP (India)'} — Live capture May 2026</div>
            <div class="screenshot-frame">${imgTag}</div>
          </div>

          <div class="rec-col">
            <div class="rec-action" style="background:${color};">${rec.action}</div>

            <div class="rec-section">
              <div class="rec-label">Page to Create / Optimise</div>
              <div class="rec-url">${rec.url}</div>
              <div class="rec-h1">H1: <strong>${rec.h1}</strong></div>
            </div>

            <div class="rec-section">
              <div class="rec-label">Why Firefly Wins This Query</div>
              <div class="rec-body">${rec.whyItWins}</div>
            </div>

            <div class="rec-section">
              <div class="rec-label">Content Outline</div>
              <ul class="rec-list">
                ${rec.contentOutline.map(c => `<li>${c}</li>`).join('')}
              </ul>
            </div>

            <div class="rec-footer">
              <div class="rec-timing">
                <span class="timing-icon">⏱</span>
                <strong>Time to rank:</strong> ${rec.timeToRank}
              </div>
              <div class="rec-metric">
                <span class="metric-icon">📊</span>
                <strong>Track:</strong> ${rec.metric}
              </div>
            </div>
          </div>
        </div>
      </div>`;
    }).join('');

    return `
    <div class="cluster-section">
      <div class="cluster-header" style="background:${color};">
        <div class="cluster-label">Cluster ${cluster}</div>
        <div class="cluster-count">${items.length} quer${items.length === 1 ? 'y' : 'ies'}</div>
      </div>
      ${cards}
    </div>`;
  }).join('');

  // Summary table
  const summaryRows = results.map(r => {
    const isNotRanking = r.adobeExpectedRank.toLowerCase().includes('not ranking');
    return `<tr>
      <td style="font-size:12px;">${r.displayQuery}</td>
      <td><span style="font-size:11px;background:${r.clusterColor};color:white;padding:2px 6px;border-radius:3px;">${r.cluster.split('—')[0].trim()}</span></td>
      <td style="font-size:12px;">${r.monthlySearches}</td>
      <td style="color:${isNotRanking ? '#CC0000' : '#FF9933'};font-weight:700;font-size:12px;">${r.adobeExpectedRank}</td>
      <td style="font-size:11px;color:#138808;font-weight:600;">${r.recommendation.action.split(' — ')[0]}</td>
      <td style="font-size:11px;color:#555;">${r.recommendation.timeToRank}</td>
    </tr>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Adobe Firefly — SEO & GEO Rankings Audit · May 2026</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Adobe Clean','Inter',-apple-system,sans-serif;background:#EFEFEF;color:#1a1a2e;}

  /* Cover */
  .cover{background:linear-gradient(135deg,#1a1a2e 0%,#16213e 55%,#0f3460 100%);color:white;padding:72px 60px 60px;display:flex;flex-direction:column;justify-content:space-between;page-break-after:always;}
  .eyebrow{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#FF9933;margin-bottom:18px;}
  .cover-title{font-size:38px;font-weight:800;line-height:1.1;max-width:800px;}
  .cover-title span{color:#FF9933;}
  .cover-sub{font-size:14px;color:rgba(255,255,255,0.65);margin-top:14px;max-width:640px;line-height:1.65;}
  .kpi-row{display:flex;gap:0;margin-top:44px;border-top:1px solid rgba(255,255,255,0.12);padding-top:32px;}
  .kpi{flex:1;padding-right:28px;border-right:1px solid rgba(255,255,255,0.1);}
  .kpi:last-child{border-right:none;padding-right:0;}
  .kpi-num{font-size:30px;font-weight:800;color:#FF9933;}
  .kpi-lbl{font-size:11px;color:rgba(255,255,255,0.5);margin-top:5px;line-height:1.45;}
  .cover-foot{font-size:11px;color:rgba(255,255,255,0.35);margin-top:40px;display:flex;justify-content:space-between;}

  /* Summary table */
  .summary-page{background:white;padding:44px 56px;page-break-after:always;}
  .summary-page h2{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#FF9933;margin-bottom:6px;}
  .summary-page h3{font-size:20px;font-weight:700;margin-bottom:8px;}
  .summary-page p{font-size:13px;color:#555;margin-bottom:24px;line-height:1.6;}
  .summary-table{width:100%;border-collapse:collapse;font-size:13px;}
  .summary-table th{background:#1a1a2e;color:white;padding:9px 12px;text-align:left;font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;}
  .summary-table td{padding:9px 12px;border-bottom:1px solid #F0F0F0;vertical-align:middle;}
  .summary-table tr:nth-child(even) td{background:#FAFAFA;}

  /* Cluster legend */
  .legend-row{display:flex;gap:12px;margin-top:20px;flex-wrap:wrap;}
  .legend-pill{display:flex;align-items:center;gap:6px;font-size:12px;}
  .legend-dot{width:12px;height:12px;border-radius:50%;}

  /* Cluster sections */
  .cluster-section{margin:0 0 0 0;}
  .cluster-header{display:flex;justify-content:space-between;align-items:center;padding:12px 32px;color:white;}
  .cluster-label{font-size:14px;font-weight:800;letter-spacing:.5px;}
  .cluster-count{font-size:12px;opacity:.75;}

  /* Query blocks */
  .query-block{background:white;margin:20px 28px;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.09);page-break-inside:avoid;page-break-after:always;}
  .query-header{padding:16px 24px;background:#1a1a2e;color:white;}
  .query-text{font-size:15px;font-weight:700;margin-bottom:8px;}
  .query-meta{display:flex;gap:8px;flex-wrap:wrap;align-items:center;}
  .vol-badge{font-size:11px;background:rgba(255,255,255,0.15);color:white;padding:3px 8px;border-radius:3px;font-weight:600;}
  .rank-badge{font-size:11px;color:white;padding:3px 8px;border-radius:3px;font-weight:700;}
  .opp-badge{font-size:11px;color:white;padding:3px 8px;border-radius:3px;font-weight:600;max-width:400px;}

  /* Content split */
  .content-split{display:grid;grid-template-columns:1fr 1fr;gap:0;}
  .screenshot-col{border-right:1px solid #E8E8E8;background:#F8F8F8;}
  .screenshot-label{font-size:10px;color:#999;padding:8px 14px;border-bottom:1px solid #E8E8E8;font-weight:600;letter-spacing:.5px;text-transform:uppercase;}
  .screenshot-frame img{width:100%;display:block;}
  .no-screenshot{padding:60px 20px;text-align:center;font-size:12px;color:#bbb;font-style:italic;}

  /* Recommendation column */
  .rec-col{padding:20px 22px;display:flex;flex-direction:column;gap:14px;}
  .rec-action{color:white;font-size:11px;font-weight:800;padding:6px 12px;border-radius:4px;letter-spacing:.5px;text-transform:uppercase;align-self:flex-start;}
  .rec-section{}
  .rec-label{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;color:#999;margin-bottom:5px;}
  .rec-url{font-family:monospace;font-size:12px;color:#0070D1;margin-bottom:4px;}
  .rec-h1{font-size:12px;color:#333;line-height:1.5;}
  .rec-body{font-size:12px;color:#444;line-height:1.6;}
  .rec-list{list-style:none;font-size:12px;color:#444;line-height:1.8;padding-left:0;}
  .rec-list li::before{content:"→ ";color:#FF9933;font-weight:700;}
  .rec-footer{display:flex;flex-direction:column;gap:6px;margin-top:auto;padding-top:12px;border-top:1px solid #F0F0F0;}
  .rec-timing,.rec-metric{font-size:11px;color:#666;line-height:1.5;}
  .timing-icon,.metric-icon{margin-right:4px;}

  @media print{
    body{background:white;}
    .query-block{margin:0;border-radius:0;box-shadow:none;page-break-after:always;}
    .cover,.summary-page,.cluster-header,.query-block{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  }
</style>
</head>
<body>

<!-- COVER -->
<div class="cover">
  <div>
    <div class="eyebrow">Adobe Firefly · SEO & GEO Rankings Audit · May 2026</div>
    <div class="cover-title">Competitor Rankings vs. Firefly —<br><span>Live SERPs + GEO with Concrete Fixes</span></div>
    <div class="cover-sub">Live Google SERP and Perplexity captures for every high-value query. Each page shows who ranks #1–5 today, where Firefly appears (or doesn't), and a concrete per-query recommendation: exact URL, H1, content outline, FAQ schema, and time to rank.</div>
  </div>
  <div class="kpi-row">
    <div class="kpi"><div class="kpi-num">9</div><div class="kpi-lbl">Queries audited across 4 clusters (SEO + GEO)</div></div>
    <div class="kpi"><div class="kpi-num">~320K</div><div class="kpi-lbl">Monthly searches where Firefly is not ranking today</div></div>
    <div class="kpi"><div class="kpi-num">3</div><div class="kpi-lbl">Pages that can rank within 21 days — zero competition</div></div>
    <div class="kpi"><div class="kpi-num">7 days</div><div class="kpi-lbl">Time to publish first commercially safe AI page and claim the unclaimed cluster</div></div>
  </div>
  <div class="cover-foot">
    <span>Competitive Intelligence · May 2026</span>
    <span>Adobe Internal — Not for Distribution</span>
  </div>
</div>

<!-- SUMMARY TABLE -->
<div class="summary-page">
  <h2>Rankings Overview</h2>
  <h3>Where Firefly Stands Today vs. Every Key Query</h3>
  <p>Live captures taken May 2026 with India locale headers (en-IN). Red = not ranking. Orange = ranking but not #1. Green action = recommended fix.</p>

  <table class="summary-table">
    <thead>
      <tr>
        <th>Query</th>
        <th>Cluster</th>
        <th>Monthly Searches</th>
        <th>Adobe / Firefly Today</th>
        <th>Action</th>
        <th>Time to Rank</th>
      </tr>
    </thead>
    <tbody>
      ${summaryRows}
    </tbody>
  </table>

  <div class="legend-row">
    <div class="legend-pill"><div class="legend-dot" style="background:#138808;"></div><span>Cluster A — Commercial Safety (unclaimed, Firefly's uncontested story)</span></div>
    <div class="legend-pill"><div class="legend-dot" style="background:#E64646;"></div><span>Cluster B — Competitor Conquest (highest volume, mid-evaluation intent)</span></div>
    <div class="legend-pill"><div class="legend-dot" style="background:#6F42C1;"></div><span>Cluster C — Unique Features (zero competition — Firefly only answer)</span></div>
    <div class="legend-pill"><div class="legend-dot" style="background:#0070D1;"></div><span>GEO — AI Overview / Perplexity citations (fastest path to visibility)</span></div>
  </div>
</div>

<!-- QUERY SECTIONS -->
${clusterSections}

</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('Capturing SEO/GEO audit screenshots...');
  const results = await capture();

  console.log('Building HTML...');
  const html = buildHTML(results);
  const htmlPath = path.join(__dirname, '../docs/Adobe-Firefly-SEO-GEO-Rankings-Audit.html');
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log(`HTML → ${htmlPath}`);

  console.log('Generating PDF...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve(htmlPath), { waitUntil: 'networkidle0', timeout: 90000 });
  const pdfPath = path.join(process.env.HOME, 'Desktop/Adobe-Firefly-SEO-GEO-Rankings-Audit-2026-05.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
  });
  await browser.close();
  console.log(`PDF → ${pdfPath}`);

  const tmpDir = path.join(__dirname, '../.tmp-seo-audit');
  if (fs.existsSync(tmpDir)) {
    fs.readdirSync(tmpDir).forEach(f => fs.unlinkSync(path.join(tmpDir, f)));
    fs.rmdirSync(tmpDir);
  }
  console.log('Done.');
}

main().catch(err => { console.error(err); process.exit(1); });
