/**
 * Captures India journey screenshots for Acrobat opportunity analysis.
 * Adobe pages get numbered callout overlays injected before screenshotting
 * so reviewers can see exactly which element to change and what to change it to.
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Page definitions — Adobe pages include `annotations` arrays
// ---------------------------------------------------------------------------

const PAGES = [
  {
    id: 'acrobat-india-hub',
    label: 'Adobe Acrobat India — Hub Page',
    url: 'https://www.adobe.com/in/acrobat.html',
    opportunity: '3 changes needed: CTA copy, student offer surface, task grid below fold',
    opportunityType: 'gap',
    fullPage: true,
    viewport: { width: 1440, height: 900 },
    annotations: [
      {
        num: 1,
        color: '#E64646',
        borderStyle: 'solid',
        selectors: [
          'a[daa-ll*="buy" i]',
          '[data-analytics*="buy" i]',
          '.dexter-Cta a',
          '[class*="CTALink"]',
          'a[class*="button"][href*="plans"]',
          'a[href*="checkout"]',
          '.spectrum-Button--cta',
        ],
        fallbackRect: { top: 340, left: 540, width: 220, height: 52 },
        label: 'CHANGE → CTA copy: "Buy now" → "Try Acrobat for free" · destination: /in/acrobat/pricing.html (not checkout)',
      },
      {
        num: 2,
        color: '#FF9933',
        borderStyle: 'dashed',
        selectors: [
          '.dexter-FlexContainer--backgroundImage',
          '[class*="hero"]',
          '[class*="Hero"]',
          'section:first-of-type',
        ],
        fallbackRect: { top: 490, left: 80, width: 1280, height: 52 },
        label: 'ADD → Student banner below hero: "Are you a student in India? Get Acrobat free →" · links to /in/acrobat/students.html · 40M eligible, currently 0 touchpoints',
      },
      {
        num: 3,
        color: '#138808',
        borderStyle: 'dashed',
        selectors: [],
        fallbackRect: { top: 960, left: 80, width: 1280, height: 72 },
        label: 'ADD → 8-task grid below fold: Edit · Sign · Merge · Compress · OCR · PDF→Word · Protect · Fill & Sign · each tile deep-links to live tool · iLovePDF shows 29 such tiles — Adobe shows 0',
      },
      {
        num: 4,
        color: '#6F42C1',
        borderStyle: 'dashed',
        selectors: [
          '[class*="footnote"]',
          '[class*="legal"]',
          '[class*="disclaimer"]',
          'footer',
        ],
        fallbackRect: { top: 1100, left: 80, width: 900, height: 48 },
        label: 'ADD → ETF transparency callout near CTA: "Cancel anytime — no fees after 14 days" · directly counters the ₹749 trap narrative before visitors leave for Foxit',
      },
    ],
  },
  {
    id: 'acrobat-india-pricing',
    label: 'Adobe Acrobat India — Pricing Page',
    url: 'https://www.adobe.com/in/acrobat/pricing.html',
    opportunity: '4 changes needed: annual INR total, plan column order, Most Popular badge, UPI/GST callout',
    opportunityType: 'gap',
    fullPage: true,
    viewport: { width: 1440, height: 900 },
    annotations: [
      {
        num: 1,
        color: '#E64646',
        borderStyle: 'solid',
        selectors: [
          '[class*="price-point"]',
          '[class*="pricing"] [class*="price"]',
          '[class*="PricingCard"] [class*="amount"]',
          '.price',
          '[data-amount]',
        ],
        fallbackRect: { top: 360, left: 480, width: 700, height: 90 },
        label: 'CHANGE → Show annual total: "₹19,152 billed annually incl. GST" under monthly price — removes sticker shock, matches how Indians evaluate SaaS costs',
      },
      {
        num: 2,
        color: '#E64646',
        borderStyle: 'solid',
        selectors: [
          '.spectrum-Button--cta',
          '[class*="buy-now"]',
          'a[href*="checkout"]',
          '[data-analytics*="buy" i]',
        ],
        fallbackRect: { top: 480, left: 480, width: 700, height: 52 },
        label: 'CHANGE → Primary CTA: "Buy now" → "Try 7 days free" · secondary link: "See all plans →" · free trial entry matches all 4 competitors',
      },
      {
        num: 3,
        color: '#6F42C1',
        borderStyle: 'solid',
        selectors: [
          '[class*="recommended"]',
          '[class*="popular"]',
          '[class*="badge"]',
          '[class*="tag"]',
        ],
        fallbackRect: { top: 290, left: 900, width: 280, height: 36 },
        label: 'CHANGE → Move "Most Popular" badge: Pro → Standard · Standard is right-size for India SMB · Pro badge inflates perceived cost',
      },
      {
        num: 4,
        color: '#138808',
        borderStyle: 'dashed',
        selectors: [],
        fallbackRect: { top: 560, left: 480, width: 700, height: 60 },
        label: 'ADD → Below CTA buttons: UPI badge + "GST invoice provided on request" · 300M+ UPI users vs. 3% credit card penetration · GST invoice is table-stakes for Indian B2B buyers',
      },
      {
        num: 5,
        color: '#E64646',
        borderStyle: 'solid',
        selectors: [
          '[class*="plan-card"]:first-child',
          '[class*="PricingCard"]:first-child',
          '[class*="pricing-tier"]:first-child',
          '.plan:first-child',
          '[class*="card"]:first-child h2',
        ],
        fallbackRect: { top: 260, left: 160, width: 280, height: 380 },
        label: 'CHANGE → Reorder plan columns left-to-right: Free/Student · Standard · Pro · Teams · Currently Free is absent or rightmost — Indian visitors scan left-first and never see ₹0 option',
      },
      {
        num: 6,
        color: '#6F42C1',
        borderStyle: 'dashed',
        selectors: [
          '[class*="plan-card"]',
          '[class*="PricingCard"]',
        ],
        fallbackRect: { top: 620, left: 480, width: 700, height: 44 },
        label: 'ADD → "No cancellation fee after 12 months" trust badge on each paid plan card · Foxit uses this exact line as India conquest copy — Adobe needs to own it first',
      },
    ],
  },
  {
    id: 'acrobat-india-students',
    label: 'Adobe Acrobat India — Student Free Program',
    url: 'https://www.adobe.com/in/acrobat/students.html',
    opportunity: 'Page exists and works — but 0 links from hub or pricing page point here',
    opportunityType: 'opportunity',
    fullPage: false,
    viewport: { width: 1440, height: 900 },
    annotations: [
      {
        num: 1,
        color: '#138808',
        borderStyle: 'solid',
        selectors: ['h1', '[class*="hero-title"]', '[class*="Heading"]', '[class*="title"]'],
        fallbackRect: { top: 120, left: 80, width: 900, height: 120 },
        label: 'THIS PAGE EXISTS · 40M eligible Indian students · currently has 0 inbound links from hub page or pricing page · Week 1 fix: add one link in hub hero',
      },
    ],
  },
  {
    id: 'acrobat-india-cancel',
    label: 'Adobe Account — Manage Plan (₹749 Trap Origin)',
    url: 'https://account.adobe.com/plans',
    opportunity: '₹749 trap: cancellation triggers a monthly charge — no transparent explainer before the button',
    opportunityType: 'risk',
    fullPage: false,
    viewport: { width: 1440, height: 900 },
    annotations: [
      {
        num: 1,
        color: '#CC0000',
        borderStyle: 'solid',
        selectors: [
          '[class*="cancel" i]',
          'button[id*="cancel" i]',
          'a[href*="cancel"]',
          '[data-testid*="cancel" i]',
        ],
        fallbackRect: { top: 260, left: 160, width: 1120, height: 200 },
        label: '🔴 RISK → ₹749 trap origin: early termination fee charged with no upfront warning — root cause of Twitter trending & Quora India complaints',
      },
      {
        num: 2,
        color: '#138808',
        borderStyle: 'dashed',
        selectors: [],
        fallbackRect: { top: 480, left: 160, width: 1120, height: 72 },
        label: 'ADD → "What you\'ll be charged" explainer modal before any cancel action: shows remaining months × fee with a "No fee after 12 months" callout · also publish /in/acrobat/subscription-terms in EN + Hindi',
      },
      {
        num: 3,
        color: '#FF9933',
        borderStyle: 'dashed',
        selectors: [],
        fallbackRect: { top: 580, left: 160, width: 1120, height: 52 },
        label: 'ADD → SEM intercept: buy "acrobat cancel india", "adobe ₹749 charge", "adobe subscription cancel hindi" — capture users before they reach Foxit/WPS review pages',
      },
    ],
  },
  {
    id: 'ilovepdf',
    label: 'iLovePDF — Benchmark: 29 Free Tools Above Fold',
    url: 'https://www.ilovepdf.com/',
    opportunity: 'BENCHMARK: 29 task tiles visible without scrolling. Adobe hub shows 0 task tiles.',
    opportunityType: 'benchmark',
    fullPage: false,
    viewport: { width: 1440, height: 900 },
    annotations: [],
  },
  {
    id: 'smallpdf',
    label: 'Smallpdf — Benchmark: Free-First CTA Hero',
    url: 'https://smallpdf.com/',
    opportunity: 'BENCHMARK: Hero CTA is "Choose a PDF tool" → free task. No paywall until output.',
    opportunityType: 'benchmark',
    fullPage: false,
    viewport: { width: 1440, height: 900 },
    annotations: [],
  },
  {
    id: 'pdf24',
    label: 'PDF24 — Benchmark: Fully Free, India Top-3 Market',
    url: 'https://tools.pdf24.org/en/',
    opportunity: 'BENCHMARK: Entirely free, no signup required. Every task is a single click — no account gate.',
    opportunityType: 'benchmark',
    fullPage: false,
    viewport: { width: 1440, height: 900 },
    annotations: [],
  },
  {
    id: 'foxit-india',
    label: 'Foxit PDF Editor — India Pricing (₹5,500/yr)',
    url: 'https://www.foxit.com/pdf-editor/',
    opportunity: 'COMPETITOR: ₹5,500/yr vs Adobe ₹19,152/yr — 3.5× cheaper. Runs conquest ads on "adobe acrobat india" keywords.',
    opportunityType: 'competitor',
    fullPage: false,
    viewport: { width: 1440, height: 900 },
    annotations: [],
  },
  {
    id: 'wps-pdf',
    label: 'WPS PDF — India Pricing (₹1,750/yr)',
    url: 'https://pdf.wps.com/',
    opportunity: 'COMPETITOR: ₹1,750/yr — 11× cheaper than Adobe. Growing fast in India via WPS Office bundle.',
    opportunityType: 'competitor',
    fullPage: false,
    viewport: { width: 1440, height: 900 },
    annotations: [],
  },
];

// ---------------------------------------------------------------------------
// Type colour palette
// ---------------------------------------------------------------------------

const TYPE_COLORS = {
  gap:        { bg: '#FFF3CD', border: '#FF9933', label: '#7A4500', badge: '⚠ GAP' },
  opportunity:{ bg: '#D4EDDA', border: '#138808', label: '#0A4D1A', badge: '✓ OPPORTUNITY' },
  risk:       { bg: '#F8D7DA', border: '#CC0000', label: '#7A0000', badge: '🔴 RISK' },
  benchmark:  { bg: '#D1ECF1', border: '#0070D1', label: '#003D73', badge: '◉ BENCHMARK' },
  competitor: { bg: '#E2D9F3', border: '#6F42C1', label: '#3A1B6E', badge: '⚡ COMPETITOR' },
};

// ---------------------------------------------------------------------------
// Inject numbered callout overlays onto a live page before screenshotting
// ---------------------------------------------------------------------------

async function injectAnnotations(tab, annotations) {
  if (!annotations || annotations.length === 0) return;

  await tab.evaluate((anns) => {
    document.body.style.position = 'relative';

    for (const ann of anns) {
      let rect = null;

      // Try each selector until one matches
      for (const sel of (ann.selectors || [])) {
        try {
          const el = document.querySelector(sel);
          if (el) {
            const r = el.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            // Only use if it's actually visible (has non-zero size)
            if (r.width > 0 && r.height > 0) {
              rect = { top: r.top + scrollTop, left: r.left + scrollLeft, width: r.width, height: r.height };
              break;
            }
          }
        } catch (_) {}
      }

      if (!rect && ann.fallbackRect) rect = ann.fallbackRect;
      if (!rect) continue;

      const isDashed = ann.borderStyle === 'dashed';
      const PADDING = 6;

      // Outer highlight box
      const box = document.createElement('div');
      box.style.cssText = [
        'position:absolute',
        `top:${rect.top - PADDING}px`,
        `left:${rect.left - PADDING}px`,
        `width:${rect.width + PADDING * 2}px`,
        `height:${Math.max(rect.height, 44) + PADDING * 2}px`,
        `border:3px ${ann.borderStyle} ${ann.color}`,
        'border-radius:6px',
        `box-shadow:0 0 0 4px ${ann.color}22`,
        'z-index:2147483640',
        'pointer-events:none',
        `background:${isDashed ? ann.color + '08' : 'transparent'}`,
      ].join(';');

      // Number badge (circle)
      const badge = document.createElement('div');
      badge.textContent = ann.num;
      badge.style.cssText = [
        'position:absolute',
        'top:-18px',
        'left:-3px',
        'width:28px',
        'height:28px',
        'border-radius:50%',
        `background:${ann.color}`,
        'color:white',
        'font-family:-apple-system,BlinkMacSystemFont,sans-serif',
        'font-size:14px',
        'font-weight:800',
        'display:flex',
        'align-items:center',
        'justify-content:center',
        'z-index:2147483641',
        'box-shadow:0 2px 6px rgba(0,0,0,0.4)',
        'flex-shrink:0',
      ].join(';');

      // Label pill
      const label = document.createElement('div');
      label.textContent = ann.label;
      label.style.cssText = [
        'position:absolute',
        'top:-18px',
        'left:30px',
        `background:${ann.color}`,
        'color:white',
        'font-family:-apple-system,BlinkMacSystemFont,sans-serif',
        'font-size:11px',
        'font-weight:700',
        'padding:4px 10px 4px 8px',
        'border-radius:0 4px 4px 0',
        'max-width:520px',
        'line-height:1.45',
        'z-index:2147483641',
        'box-shadow:0 2px 6px rgba(0,0,0,0.25)',
      ].join(';');

      box.appendChild(badge);
      box.appendChild(label);
      document.body.appendChild(box);
    }
  }, annotations);
}

// ---------------------------------------------------------------------------
// Screenshot loop
// ---------------------------------------------------------------------------

async function captureScreenshots() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-http2'],
  });

  const screenshots = [];
  const tmpDir = path.join(__dirname, '../.tmp-india-screenshots');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  for (const pg of PAGES) {
    console.log(`  Capturing: ${pg.label}`);
    const tab = await browser.newPage();
    await tab.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
    await tab.setViewport(pg.viewport);
    await tab.setExtraHTTPHeaders({
      'Accept-Language': 'en-IN,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    });

    let screenshotPath = null;
    try {
      await tab.goto(pg.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 3000));

      // Inject annotations before screenshot
      if (pg.annotations && pg.annotations.length > 0) {
        await injectAnnotations(tab, pg.annotations);
        await new Promise(r => setTimeout(r, 300)); // let DOM settle
      }

      screenshotPath = path.join(tmpDir, `${pg.id}.png`);
      await tab.screenshot({ path: screenshotPath, fullPage: pg.fullPage, type: 'png' });
      console.log(`    ✓ ${pg.id}.png${pg.annotations && pg.annotations.length ? ` (${pg.annotations.length} annotations)` : ''}`);
    } catch (err) {
      console.log(`    ✗ ${pg.id}: ${err.message}`);
    }
    await tab.close();
    screenshots.push({ ...pg, screenshotPath });
  }

  await browser.close();
  return screenshots;
}

// ---------------------------------------------------------------------------
// HTML builder
// ---------------------------------------------------------------------------

function buildAnnotationLegend(annotations) {
  if (!annotations || annotations.length === 0) return '';
  const rows = annotations.map(a => {
    const isAdd = a.label.startsWith('ADD') || a.label.startsWith('THIS PAGE');
    const actionWord = isAdd ? 'ADD' : a.label.startsWith('🔴') ? 'RISK' : 'CHANGE';
    const actionColors = { ADD: '#138808', CHANGE: '#E64646', RISK: '#CC0000' };
    const ac = actionColors[actionWord] || a.color;
    return `
      <div class="ann-row">
        <div class="ann-num" style="background:${a.color};">${a.num}</div>
        <div class="ann-action" style="background:${ac};">${actionWord}</div>
        <div class="ann-text">${a.label}</div>
      </div>`;
  }).join('');
  return `<div class="ann-legend">${rows}</div>`;
}

function buildHTML(screenshots) {
  const items = screenshots.map((s, i) => {
    const c = TYPE_COLORS[s.opportunityType] || TYPE_COLORS.gap;
    let imgTag = '';
    if (s.screenshotPath && fs.existsSync(s.screenshotPath)) {
      const b64 = fs.readFileSync(s.screenshotPath).toString('base64');
      imgTag = `<img src="data:image/png;base64,${b64}" alt="${s.label}" />`;
    } else {
      imgTag = `<div class="no-screenshot">Screenshot unavailable — page required login or timed out</div>`;
    }

    const legend = buildAnnotationLegend(s.annotations);

    return `
    <div class="page-block" id="page-${i + 1}">
      <div class="page-header">
        <div class="page-number">${String(i + 1).padStart(2, '0')}</div>
        <div class="page-meta">
          <div class="page-label">${s.label}</div>
          <div class="page-url">${s.url}</div>
        </div>
        <div class="badge" style="background:${c.border};">${c.badge}</div>
      </div>
      <div class="opportunity-box" style="background:${c.bg}; border-left:4px solid ${c.border}; color:${c.label};">
        ${s.opportunity}
      </div>
      <div class="screenshot-wrap">
        ${imgTag}
      </div>
      ${legend}
    </div>`;
  });

  const toc = screenshots.map((s, i) => {
    const c = TYPE_COLORS[s.opportunityType] || TYPE_COLORS.gap;
    return `<li><span class="toc-num">${String(i + 1).padStart(2, '0')}</span><span class="toc-badge" style="background:${c.border};">${c.badge}</span>${s.label}</li>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Acrobat India — Journey Screenshots & Opportunity Analysis · May 2026</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Adobe Clean', 'Inter', -apple-system, sans-serif; background: #F0F0F0; color: #2C2C2C; }

  /* ── Cover ── */
  .cover {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    color: white; padding: 80px 60px; min-height: 340px;
    display: flex; flex-direction: column; justify-content: space-between;
    page-break-after: always;
  }
  .cover-eyebrow { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #FF9933; margin-bottom: 24px; }
  .cover-title { font-size: 42px; font-weight: 700; line-height: 1.1; max-width: 700px; }
  .cover-title span { color: #FF9933; }
  .cover-subtitle { font-size: 16px; color: rgba(255,255,255,0.7); margin-top: 16px; max-width: 560px; }
  .cover-meta { display: flex; gap: 40px; margin-top: 48px; }
  .cover-stat { border-top: 2px solid #FF9933; padding-top: 12px; }
  .cover-stat-num { font-size: 28px; font-weight: 700; color: #FF9933; }
  .cover-stat-label { font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 4px; }
  .cover-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 48px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.15); font-size: 12px; color: rgba(255,255,255,0.5); }

  /* ── Legend ── */
  .legend { background: white; padding: 32px 60px; border-bottom: 1px solid #E0E0E0; page-break-after: always; }
  .legend h2 { font-size: 18px; margin-bottom: 20px; }
  .legend-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
  .legend-item { padding: 12px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; }

  /* ── TOC ── */
  .toc { background: white; padding: 40px 60px; page-break-after: always; }
  .toc h2 { font-size: 22px; font-weight: 700; margin-bottom: 24px; }
  .toc ol { list-style: none; }
  .toc li { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid #F0F0F0; font-size: 14px; }
  .toc-num { font-size: 11px; color: #999; width: 24px; flex-shrink: 0; }
  .toc-badge { font-size: 10px; color: white; padding: 2px 7px; border-radius: 3px; flex-shrink: 0; }

  /* ── Page blocks ── */
  .page-block {
    background: white; margin: 28px 32px; border-radius: 10px;
    overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.10);
    page-break-inside: avoid; page-break-after: always;
  }
  .page-header { display: flex; align-items: center; gap: 16px; padding: 18px 24px; background: #1a1a2e; color: white; }
  .page-number { font-size: 28px; font-weight: 700; color: rgba(255,255,255,0.22); width: 48px; flex-shrink: 0; }
  .page-meta { flex: 1; }
  .page-label { font-size: 16px; font-weight: 600; }
  .page-url { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 3px; font-family: monospace; }
  .badge { font-size: 11px; font-weight: 700; color: white; padding: 4px 12px; border-radius: 4px; white-space: nowrap; }

  .opportunity-box { padding: 13px 24px; font-size: 13px; font-weight: 500; line-height: 1.6; }

  .screenshot-wrap { background: #E8E8E8; border-top: 1px solid #DDD; }
  .screenshot-wrap img { width: 100%; display: block; }
  .no-screenshot { padding: 60px 24px; text-align: center; font-size: 13px; color: #999; font-style: italic; }

  /* ── Annotation legend (below each Adobe screenshot) ── */
  .ann-legend {
    padding: 16px 20px;
    background: #FAFAFA;
    border-top: 2px solid #E0E0E0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .ann-row { display: flex; align-items: flex-start; gap: 10px; }
  .ann-num {
    width: 26px; height: 26px; border-radius: 50%;
    color: white; font-size: 13px; font-weight: 800;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; margin-top: 1px;
  }
  .ann-action {
    color: white; font-size: 10px; font-weight: 800;
    padding: 3px 8px; border-radius: 3px;
    flex-shrink: 0; margin-top: 3px; letter-spacing: 0.5px;
    height: 20px; display: flex; align-items: center;
  }
  .ann-text { font-size: 12px; line-height: 1.55; color: #333; padding-top: 2px; }

  /* ── Summary ── */
  .summary { background: #1a1a2e; color: white; padding: 60px; margin: 28px 32px; border-radius: 10px; }
  .summary h2 { font-size: 26px; font-weight: 700; color: #FF9933; margin-bottom: 32px; }
  .summary-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; }
  .summary-card { background: rgba(255,255,255,0.07); border-radius: 8px; padding: 20px; }
  .summary-card h3 { font-size: 12px; color: #FF9933; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; }
  .summary-card ul { list-style: none; font-size: 13px; line-height: 2.1; color: rgba(255,255,255,0.8); }
  .summary-card ul li::before { content: "→ "; color: #FF9933; }

  @media print {
    body { background: white; }
    .page-block { margin: 0; border-radius: 0; box-shadow: none; }
    .cover, .legend, .toc, .page-block, .summary, .ann-legend {
      -webkit-print-color-adjust: exact; print-color-adjust: exact;
    }
  }
</style>
</head>
<body>

<!-- COVER -->
<div class="cover">
  <div>
    <div class="cover-eyebrow">Adobe Acrobat · India Market · May 2026</div>
    <div class="cover-title">India Journey <span>Screenshots</span> &amp; Opportunity Analysis</div>
    <div class="cover-subtitle">Live page captures with numbered callout overlays — shows exactly which element to change and what to change it to. Adobe pages are annotated; competitor pages are benchmarks.</div>
  </div>
  <div class="cover-meta">
    <div class="cover-stat"><div class="cover-stat-num">16</div><div class="cover-stat-label">Callout annotations on Adobe pages</div></div>
    <div class="cover-stat"><div class="cover-stat-num">₹749</div><div class="cover-stat-label">Trap driving Twitter &amp; Quora churn</div></div>
    <div class="cover-stat"><div class="cover-stat-num">3.5×</div><div class="cover-stat-label">Adobe vs. Foxit price gap</div></div>
    <div class="cover-stat"><div class="cover-stat-num">40M</div><div class="cover-stat-label">Students eligible, 0 hub touchpoints</div></div>
  </div>
  <div class="cover-footer">
    <span>Competitive Intelligence · May 2026</span>
    <span>Adobe Internal — Not for Distribution</span>
  </div>
</div>

<!-- LEGEND -->
<div class="legend">
  <h2>How to Read This Document</h2>
  <div class="legend-grid">
    <div class="legend-item" style="background:#FFF3CD; color:#7A4500; border-left:4px solid #FF9933;">⚠ GAP — Feature or copy missing on Adobe India page that a competitor has</div>
    <div class="legend-item" style="background:#D4EDDA; color:#0A4D1A; border-left:4px solid #138808;">✓ OPPORTUNITY — Existing Adobe asset not surfaced on the right page</div>
    <div class="legend-item" style="background:#F8D7DA; color:#7A0000; border-left:4px solid #CC0000;">🔴 RISK — Active churn / reputation trigger requiring immediate fix</div>
    <div class="legend-item" style="background:#D1ECF1; color:#003D73; border-left:4px solid #0070D1;">◉ BENCHMARK — Competitor page setting the bar Adobe should match or exceed</div>
    <div class="legend-item" style="background:#E2D9F3; color:#3A1B6E; border-left:4px solid #6F42C1;">⚡ COMPETITOR — Rival pricing / positioning page for direct comparison</div>
  </div>
  <p style="margin-top:20px; font-size:13px; color:#555; line-height:1.6;">
    <strong>Annotation colours on Adobe screenshots:</strong>
    &nbsp;<span style="background:#E64646; color:white; padding:2px 8px; border-radius:3px; font-size:11px; font-weight:700;">CHANGE</span> — solid red border, something exists that needs copy/UX edit &nbsp;
    <span style="background:#138808; color:white; padding:2px 8px; border-radius:3px; font-size:11px; font-weight:700;">ADD</span> — dashed green border, something entirely missing that should be added &nbsp;
    <span style="background:#CC0000; color:white; padding:2px 8px; border-radius:3px; font-size:11px; font-weight:700;">RISK</span> — solid red border, active churn trigger
  </p>
</div>

<!-- TOC -->
<div class="toc">
  <h2>Pages Captured (${screenshots.length} total)</h2>
  <ol>${toc}</ol>
</div>

<!-- SCREENSHOTS -->
${items.join('\n')}

<!-- SUMMARY -->
<div class="summary">
  <h2>30-Day India Sprint — Action Summary</h2>
  <div class="summary-grid">
    <div class="summary-card">
      <h3>Week 1 — Copy Only (No Eng Required)</h3>
      <ul>
        <li>Hub CTA: "Buy now" → "Try Acrobat for free"</li>
        <li>Hub hero: add student banner linking to /in/acrobat/students.html</li>
        <li>Pricing: show ₹19,152/yr incl. GST below monthly figure</li>
        <li>Pricing: primary CTA → "Try 7 days free"</li>
        <li>Pricing: move "Most Popular" badge Pro → Standard</li>
      </ul>
    </div>
    <div class="summary-card">
      <h3>Days 8–30 — Engineering</h3>
      <ul>
        <li>8-task grid below hub fold (Edit · Sign · Merge · Compress · OCR · PDF→Word · Protect · Fill &amp; Sign)</li>
        <li>Reorder pricing columns: Free/Student → Standard → Pro → Teams</li>
        <li>"No cancellation fee after 12 months" badge on plan cards</li>
        <li>UPI badge + GST invoice callout on pricing page</li>
        <li>"What you'll be charged" modal before cancel · /in/acrobat/subscription-terms in EN+Hindi</li>
        <li>SEM: buy "acrobat cancel india" + "adobe ₹749 charge" + "adobe subscription cancel hindi"</li>
      </ul>
    </div>
    <div class="summary-card">
      <h3>Success Metrics</h3>
      <ul>
        <li>Student page CTR from hub: 0% → 8%+</li>
        <li>India pricing page bounce: −15%</li>
        <li>₹749 Twitter mentions: −40% in 30 days</li>
        <li>India free-to-paid conversion: +2 pp</li>
        <li>India cancellation rate: −10%</li>
      </ul>
    </div>
  </div>
</div>

</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('Capturing India journey screenshots with annotations...');
  const screenshots = await captureScreenshots();

  console.log('Building HTML...');
  const html = buildHTML(screenshots);
  const htmlPath = path.join(__dirname, '../docs/Acrobat-India-Journey-Screenshots.html');
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log(`HTML → ${htmlPath}`);

  console.log('Generating PDF...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve(htmlPath), { waitUntil: 'networkidle0', timeout: 90000 });
  const pdfPath = path.join(process.env.HOME, 'Desktop/Acrobat-India-Journey-Screenshots-2026-05.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
  });
  await browser.close();
  console.log(`PDF → ${pdfPath}`);

  // Cleanup
  const tmpDir = path.join(__dirname, '../.tmp-india-screenshots');
  if (fs.existsSync(tmpDir)) {
    fs.readdirSync(tmpDir).forEach(f => fs.unlinkSync(path.join(tmpDir, f)));
    fs.rmdirSync(tmpDir);
  }

  console.log('Done.');
}

main().catch(err => { console.error(err); process.exit(1); });
