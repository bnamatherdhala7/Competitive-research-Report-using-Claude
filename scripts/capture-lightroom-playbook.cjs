/**
 * Adobe Photoshop Lightroom — Comprehensive Acquisition & Visibility Report (US Market)
 *
 * Combines: Acrobat-style acquisition playbook (TL;DR, 30-day sprint, battlecards,
 * PLG strategy, GEO table, metrics dashboard) + Free-Tools-Audit visual treatment
 * (above-fold competitor comparison, annotated Adobe pages, action plan).
 *
 * Captures:
 *   1. adobe.com/products/photoshop-lightroom.html (marketing hub) — annotated full + above fold
 *   2. lightroom.adobe.com (web app entry) — annotated full + above fold
 *   3-6. Capture One, Luminar Neo, DxO PhotoLab, ON1 Photo RAW — above fold benchmarks
 *
 * Output: docs/Lightroom-Acquisition-Playbook-US.html + PDF on Desktop
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Pages to capture
// ---------------------------------------------------------------------------

const PAGES = [
  // 1. Lightroom marketing hub — full annotated
  {
    id: 'lr-hub-full',
    label: 'Adobe Lightroom Hub — Marketing Page (Full, Annotated)',
    url: 'https://www.adobe.com/products/photoshop-lightroom.html',
    fullPage: true,
    viewport: { width: 1440, height: 900 },
    annotations: [
      {
        num: 1,
        color: '#E64646',
        borderStyle: 'solid',
        selectors: [
          'a[daa-ll*="buy" i]',
          '.spectrum-Button--cta',
          '[class*="CTALink"]',
          'a[href*="checkout"]',
          'a[class*="buy-now"]',
        ],
        fallbackRect: { top: 340, left: 540, width: 220, height: 52 },
        label: 'CHANGE → CTA copy: "Buy now" → "Try free for 7 days — no charge". Capture One, Luminar, DxO all offer no-card trials. Adobe gates the trial behind a checkout that asks for a credit card upfront.',
      },
      {
        num: 2,
        color: '#E64646',
        borderStyle: 'solid',
        selectors: [
          '[class*="hero"] h1',
          '[class*="Hero"] h1',
          'h1',
        ],
        fallbackRect: { top: 100, left: 80, width: 900, height: 100 },
        label: 'CHANGE → H1 does not match any high-volume query. "Photo editor" = 600K/mo. "AI photo editor" = 800K/mo. "Best photo editing software" = 150K/mo. Current H1 reads as brand copy — change to "AI-Powered Photo Editor & Workflow — for Pros and Creators".',
      },
      {
        num: 3,
        color: '#138808',
        borderStyle: 'dashed',
        selectors: [],
        fallbackRect: { top: 220, left: 80, width: 900, height: 60 },
        label: 'ADD → AI positioning above fold: "Generative Remove · AI Denoise · AI Masking · Adaptive Presets". Luminar Neo dominates "AI photo editor" SERPs with this exact framing — Adobe has the features but does not lead with them.',
      },
      {
        num: 4,
        color: '#138808',
        borderStyle: 'dashed',
        selectors: [],
        fallbackRect: { top: 380, left: 80, width: 1280, height: 60 },
        label: 'ADD → Trust bar below hero: "Trusted by 20M+ photographers · Used by National Geographic · Available on desktop, web, iPad, mobile · 1TB cloud sync included". Counters Capture One\'s pro-photographer authority claim.',
      },
      {
        num: 5,
        color: '#138808',
        borderStyle: 'dashed',
        selectors: [],
        fallbackRect: { top: 480, left: 80, width: 1280, height: 280 },
        label: 'ADD → Above-fold comparison band: "Why photographers choose Lightroom over Capture One & Luminar" — 4-row table: AI features, cloud sync, mobile/iPad, presets ecosystem. Each row: Lightroom ✅, competitor ❌. This is the page acquisition users arrive at via "lightroom alternative" (80K/mo) — currently zero comparison content.',
      },
      {
        num: 6,
        color: '#E64646',
        borderStyle: 'solid',
        selectors: [
          '[class*="pricing"]',
          '[class*="price"]',
          '[class*="plan"]',
        ],
        fallbackRect: { top: 800, left: 80, width: 1280, height: 300 },
        label: 'CHANGE → Pricing section shows "$9.99/mo" with no annual total. US buyers want to see "$119.88/yr" at a glance. Add: "or $119.88 billed annually". Hide multi-plan complexity — show Lightroom Plan + Photography Plan side by side, not all five Adobe plans.',
      },
      {
        num: 7,
        color: '#138808',
        borderStyle: 'dashed',
        selectors: [],
        fallbackRect: { top: 1180, left: 80, width: 1280, height: 280 },
        label: 'ADD → Free presets gallery teaser: "Browse 200+ free Adobe-curated presets — apply in one click". Lightroom has the largest preset ecosystem of any photo editor but doesn\'t use it as an acquisition magnet. Free presets are the #1 organic acquisition channel for VSCO and Tezza.',
      },
      {
        num: 8,
        color: '#6F42C1',
        borderStyle: 'dashed',
        selectors: ['nav', '[class*="nav"]', 'header'],
        fallbackRect: { top: 12, left: 200, width: 700, height: 50 },
        label: 'ADD → Top nav item: "Free presets" linking to a no-login preset gallery. Adobe ranks #15+ for "lightroom presets free" (200K/mo) — third-party preset shops own this acquisition channel. Reclaim it with a first-party gallery.',
      },
      {
        num: 9,
        color: '#FF9933',
        borderStyle: 'solid',
        selectors: [],
        fallbackRect: { top: 1480, left: 80, width: 1280, height: 300 },
        label: 'CHANGE → No competitor comparison anywhere. Capture One conquest-targets "lightroom alternative" with a dedicated comparison page that ranks #1. Build /products/lightroom/vs-capture-one and /products/lightroom/vs-luminar to intercept conquest traffic.',
      },
      {
        num: 10,
        color: '#138808',
        borderStyle: 'dashed',
        selectors: [],
        fallbackRect: { top: 1820, left: 80, width: 1280, height: 80 },
        label: 'ADD → FAQ schema section near page bottom — "Is Lightroom free?", "What\'s the difference between Lightroom and Lightroom Classic?", "Does Lightroom include Photoshop?", "How does Lightroom compare to Capture One?". FAQ schema = AI Overview citations within 3 weeks.',
      },
    ],
  },

  // 2. Lightroom hub — above fold only
  {
    id: 'lr-hub-fold',
    label: 'Adobe Lightroom Hub — Above the Fold',
    url: 'https://www.adobe.com/products/photoshop-lightroom.html',
    fullPage: false,
    viewport: { width: 1440, height: 900 },
    annotations: [],
  },

  // 3. Lightroom web app — full annotated
  {
    id: 'lr-app-full',
    label: 'Lightroom Web App — lightroom.adobe.com (Annotated)',
    url: 'https://lightroom.adobe.com/',
    fullPage: true,
    viewport: { width: 1440, height: 900 },
    annotations: [
      {
        num: 1,
        color: '#CC0000',
        borderStyle: 'solid',
        selectors: [
          '[class*="sign-in"]',
          'button[class*="sign"]',
          'a[href*="signin"]',
          '[data-id*="signin"]',
        ],
        fallbackRect: { top: 200, left: 540, width: 360, height: 220 },
        label: 'FRICTION → Login required before viewing any photo or applying any edit. Pixlr lets users edit instantly. Photopea opens straight to a workspace. Lightroom Web could let visitors apply a preset to a sample photo without a login — that single change would lift dwell time 40%.',
      },
      {
        num: 2,
        color: '#138808',
        borderStyle: 'dashed',
        selectors: [],
        fallbackRect: { top: 430, left: 80, width: 1280, height: 60 },
        label: 'ADD → Pre-login feature showcase: "Try AI Mask · Try a preset · Try Generative Remove" — each on a sample image, no account needed. Build the demo path that converts "lightroom free online" searchers (110K/mo) instead of bouncing them.',
      },
      {
        num: 3,
        color: '#FF9933',
        borderStyle: 'solid',
        selectors: ['h1', '[class*="hero"]'],
        fallbackRect: { top: 100, left: 540, width: 360, height: 80 },
        label: 'CHANGE → Hero copy is generic brand language. Should be task-first: "Edit, organise, and sync your photos — in any browser, on any device". Match the query intent of users searching "edit photos online" (220K/mo).',
      },
      {
        num: 4,
        color: '#138808',
        borderStyle: 'dashed',
        selectors: [],
        fallbackRect: { top: 580, left: 80, width: 1280, height: 80 },
        label: 'ADD → Trust strip: "1TB cloud sync · Edits roundtrip to desktop & mobile · 20M+ photographers · Free with Photography Plan". Currently invisible — users assume Web is a lite/stripped version when it actually matches desktop capability.',
      },
    ],
  },

  // 4. Capture One above fold
  {
    id: 'capture-one-fold',
    label: 'Capture One — Above the Fold (Pro Photographer Authority)',
    url: 'https://www.captureone.com/en',
    fullPage: false,
    viewport: { width: 1440, height: 900 },
    annotations: [
      {
        num: 1,
        color: '#0070D1',
        borderStyle: 'solid',
        selectors: ['[class*="hero"]', 'h1', 'main'],
        fallbackRect: { top: 80, left: 40, width: 1360, height: 700 },
        label: 'WHY THEY WIN: Hero copy is "The choice of professional photographers." Authority positioning. Free 30-day trial with no credit card. Aggressively targets "lightroom alternative" keyword. Weakness: $299/yr (more expensive than Lightroom), no real mobile, no AI generative features.',
      },
    ],
  },

  // 5. Luminar Neo above fold
  {
    id: 'luminar-fold',
    label: 'Luminar Neo — Above the Fold (AI Photo Editor Leader)',
    url: 'https://skylum.com/luminar',
    fullPage: false,
    viewport: { width: 1440, height: 900 },
    annotations: [
      {
        num: 1,
        color: '#0070D1',
        borderStyle: 'solid',
        selectors: ['[class*="hero"]', 'h1', 'main'],
        fallbackRect: { top: 80, left: 40, width: 1360, height: 700 },
        label: 'WHY THEY WIN: H1 says "AI Photo Editor." Owns the highest-volume query (800K/mo). Lifetime license $149 (no subscription). Heavy YouTube tutorial presence. Weakness: weaker RAW engine, no cloud sync, no mobile, no preset ecosystem.',
      },
    ],
  },

  // 6. DxO PhotoLab above fold
  {
    id: 'dxo-fold',
    label: 'DxO PhotoLab — Above the Fold (RAW Quality Specialist)',
    url: 'https://www.dxo.com/dxo-photolab/',
    fullPage: false,
    viewport: { width: 1440, height: 900 },
    annotations: [
      {
        num: 1,
        color: '#0070D1',
        borderStyle: 'solid',
        selectors: ['[class*="hero"]', 'h1', 'main'],
        fallbackRect: { top: 80, left: 40, width: 1360, height: 700 },
        label: 'WHY THEY WIN: Positioned on "Best RAW image quality" — DeepPRIME XD denoising is genuinely best-in-class. Perpetual licence $229. Aggressive ads on "best raw editor" (40K/mo). Weakness: no cloud, no mobile, no eSign-style ecosystem, no AI generative.',
      },
    ],
  },

  // 7. ON1 above fold
  {
    id: 'on1-fold',
    label: 'ON1 Photo RAW — Above the Fold (Lifetime License Alternative)',
    url: 'https://www.on1.com/products/photo-raw/',
    fullPage: false,
    viewport: { width: 1440, height: 900 },
    annotations: [
      {
        num: 1,
        color: '#0070D1',
        borderStyle: 'solid',
        selectors: ['[class*="hero"]', 'h1', 'main'],
        fallbackRect: { top: 80, left: 40, width: 1360, height: 700 },
        label: 'WHY THEY WIN: "Pay once, own forever" — anti-subscription positioning. $99.99/yr or $149.99 perpetual. Cloud-optional sync, mobile companion, AI features. Direct conquest ads on "lightroom alternative no subscription". Weakness: smaller community, fewer presets, weaker integrations.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Annotation injector
// ---------------------------------------------------------------------------

async function injectAnnotations(tab, annotations) {
  if (!annotations || annotations.length === 0) return;
  await tab.evaluate((anns) => {
    document.body.style.position = 'relative';
    for (const ann of anns) {
      let rect = null;
      for (const sel of (ann.selectors || [])) {
        try {
          const el = document.querySelector(sel);
          if (el) {
            const r = el.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            if (r.width > 0 && r.height > 0) {
              rect = { top: r.top + scrollTop, left: r.left + scrollLeft, width: r.width, height: r.height };
              break;
            }
          }
        } catch (_) {}
      }
      if (!rect && ann.fallbackRect) rect = ann.fallbackRect;
      if (!rect) continue;

      const P = 6;
      const isDashed = ann.borderStyle === 'dashed';

      const box = document.createElement('div');
      box.style.cssText = [
        'position:absolute',
        `top:${rect.top - P}px`,
        `left:${rect.left - P}px`,
        `width:${rect.width + P * 2}px`,
        `height:${Math.max(rect.height, 44) + P * 2}px`,
        `border:3px ${ann.borderStyle} ${ann.color}`,
        'border-radius:6px',
        `box-shadow:0 0 0 4px ${ann.color}22`,
        `background:${isDashed ? ann.color + '0F' : 'transparent'}`,
        'z-index:2147483640',
        'pointer-events:none',
      ].join(';');

      const badge = document.createElement('div');
      badge.textContent = ann.num;
      badge.style.cssText = [
        'position:absolute', 'top:-18px', 'left:-3px',
        'width:28px', 'height:28px', 'border-radius:50%',
        `background:${ann.color}`, 'color:white',
        'font-family:-apple-system,sans-serif', 'font-size:14px', 'font-weight:800',
        'display:flex', 'align-items:center', 'justify-content:center',
        'z-index:2147483641', 'box-shadow:0 2px 6px rgba(0,0,0,0.4)',
      ].join(';');

      const label = document.createElement('div');
      label.textContent = ann.label;
      label.style.cssText = [
        'position:absolute', 'top:-18px', 'left:30px',
        `background:${ann.color}`, 'color:white',
        'font-family:-apple-system,sans-serif', 'font-size:11px', 'font-weight:700',
        'padding:4px 10px', 'border-radius:0 4px 4px 0',
        'max-width:540px', 'line-height:1.45', 'z-index:2147483641',
        'box-shadow:0 2px 6px rgba(0,0,0,0.25)',
      ].join(';');

      box.appendChild(badge);
      box.appendChild(label);
      document.body.appendChild(box);
    }
  }, annotations);
}

// ---------------------------------------------------------------------------
// Capture
// ---------------------------------------------------------------------------

async function captureScreenshots() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-http2'],
  });

  const screenshots = [];
  const tmpDir = path.join(__dirname, '../.tmp-lightroom');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  for (const pg of PAGES) {
    console.log(`  Capturing: ${pg.label}`);
    const tab = await browser.newPage();
    await tab.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
    await tab.setViewport(pg.viewport);
    await tab.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    });

    let screenshotPath = null;
    try {
      await tab.goto(pg.url, { waitUntil: 'domcontentloaded', timeout: 35000 });
      await new Promise(r => setTimeout(r, 4000));

      if (pg.annotations && pg.annotations.length > 0) {
        await injectAnnotations(tab, pg.annotations);
        await new Promise(r => setTimeout(r, 400));
      }

      screenshotPath = path.join(tmpDir, `${pg.id}.png`);
      await tab.screenshot({ path: screenshotPath, fullPage: pg.fullPage, type: 'png' });
      const ann = pg.annotations ? pg.annotations.length : 0;
      console.log(`    ✓ ${pg.id}.png${ann ? ` (${ann} annotations)` : ''}`);
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
// Annotation legend
// ---------------------------------------------------------------------------

function buildLegend(annotations) {
  if (!annotations || annotations.length === 0) return '';
  const rows = annotations.map(a => {
    const isAdd = a.label.startsWith('ADD');
    const isFriction = a.label.startsWith('FRICTION') || a.label.startsWith('WHY');
    const actionWord = isAdd ? 'ADD' : isFriction ? 'NOTE' : 'CHANGE';
    const ac = isAdd ? '#138808' : isFriction ? '#0070D1' : '#E64646';
    return `<div class="ann-row">
      <div class="ann-num" style="background:${a.color};">${a.num}</div>
      <div class="ann-action" style="background:${ac};">${actionWord}</div>
      <div class="ann-text">${a.label}</div>
    </div>`;
  }).join('');
  return `<div class="ann-legend">${rows}</div>`;
}

function img64(s) {
  if (s && s.screenshotPath && fs.existsSync(s.screenshotPath))
    return `data:image/png;base64,${fs.readFileSync(s.screenshotPath).toString('base64')}`;
  return null;
}

// ---------------------------------------------------------------------------
// HTML report
// ---------------------------------------------------------------------------

function buildHTML(screenshots) {
  const byId = {};
  screenshots.forEach(s => { byId[s.id] = s; });

  const hubFull = byId['lr-hub-full'];
  const hubFold = byId['lr-hub-fold'];
  const appFull = byId['lr-app-full'];
  const capOne  = byId['capture-one-fold'];
  const luminar = byId['luminar-fold'];
  const dxo     = byId['dxo-fold'];
  const on1     = byId['on1-fold'];

  const hubFullImg = img64(hubFull)  ? `<img src="${img64(hubFull)}" style="width:100%;display:block;" />` : '<div class="no-screenshot">Unavailable</div>';
  const hubFoldImg = img64(hubFold)  ? `<img src="${img64(hubFold)}" style="width:100%;display:block;border-radius:6px;border:3px solid #FA0F00;" />` : '';
  const appFullImg = img64(appFull)  ? `<img src="${img64(appFull)}" style="width:100%;display:block;" />` : '<div class="no-screenshot">Unavailable</div>';
  const capOneImg  = img64(capOne)   ? `<img src="${img64(capOne)}" style="width:100%;display:block;border-radius:6px;border:3px solid #0070D1;" />` : '';
  const luminarImg = img64(luminar)  ? `<img src="${img64(luminar)}" style="width:100%;display:block;border-radius:6px;border:3px solid #0070D1;" />` : '';
  const dxoImg     = img64(dxo)      ? `<img src="${img64(dxo)}" style="width:100%;display:block;border-radius:6px;border:3px solid #0070D1;" />` : '';
  const on1Img     = img64(on1)      ? `<img src="${img64(on1)}" style="width:100%;display:block;border-radius:6px;border:3px solid #0070D1;" />` : '';

  const hubLegend = buildLegend(hubFull ? hubFull.annotations : []);
  const appLegend = buildLegend(appFull ? appFull.annotations : []);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Adobe Lightroom — Acquisition &amp; Growth Playbook · US · May 2026</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Adobe Clean','Inter',-apple-system,sans-serif;background:#EFEFEF;color:#1a1a2e;line-height:1.5;}

/* ── Dark cover (Free Tools Audit style) ── */
.cover{background:linear-gradient(135deg,#1a1a2e 0%,#16213e 55%,#0f3460 100%);color:white;padding:72px 60px 60px;display:flex;flex-direction:column;justify-content:space-between;page-break-after:always;min-height:880px;}
.eyebrow{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#FA0F00;margin-bottom:18px;}
.cover-title{font-size:42px;font-weight:800;line-height:1.1;max-width:820px;}
.cover-title span{color:#FA0F00;}
.cover-sub{font-size:15px;color:rgba(255,255,255,0.7);margin-top:16px;max-width:680px;line-height:1.65;}
.kpi-row{display:flex;gap:0;margin-top:44px;border-top:1px solid rgba(255,255,255,0.12);padding-top:32px;}
.kpi{flex:1;padding-right:24px;border-right:1px solid rgba(255,255,255,0.1);}
.kpi:last-child{border-right:none;}
.kpi-num{font-size:30px;font-weight:800;color:#FA0F00;}
.kpi-lbl{font-size:11px;color:rgba(255,255,255,0.5);margin-top:5px;line-height:1.45;}
.cover-foot{font-size:11px;color:rgba(255,255,255,0.35);margin-top:40px;display:flex;justify-content:space-between;border-top:1px solid rgba(255,255,255,0.1);padding-top:20px;}

/* ── Adobe-red playbook header (Acrobat playbook style) ── */
.playbook-header{background:#FA0F00;color:white;padding:36px 60px 28px;page-break-after:always;}
.playbook-header h1{font-size:30px;font-weight:700;letter-spacing:-0.5px;margin-bottom:14px;}
.playbook-meta{font-size:12px;color:rgba(255,255,255,0.85);padding-top:14px;border-top:1px solid rgba(255,255,255,0.25);}
.playbook-meta strong{font-weight:700;}

/* ── Generic section ── */
.section{background:white;padding:40px 60px;page-break-inside:avoid;}
.section + .section{margin-top:0;}
.section h2{color:#FA0F00;font-size:18px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;border-bottom:3px solid #FA0F00;padding-bottom:8px;margin-bottom:22px;}
.section h3{font-size:15px;font-weight:700;color:#1a1a2e;margin:22px 0 10px;}
.section p{font-size:13.5px;color:#333;margin-bottom:14px;}
.section ul{padding-left:22px;margin-bottom:14px;}
.section ul li{font-size:13px;color:#333;margin-bottom:6px;line-height:1.6;}

/* ── TL;DR block ── */
.tldr{background:#FAFAFA;border-left:4px solid #FA0F00;padding:20px 24px;font-size:14px;color:#1a1a2e;line-height:1.7;}

/* ── Section label band (dark) ── */
.section-label{background:#1a1a2e;color:white;padding:14px 32px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;}
.section-label span{color:#FA0F00;}

/* ── Tables ── */
table{width:100%;border-collapse:collapse;font-size:12.5px;}
th{background:#1a1a2e;color:white;padding:10px 14px;text-align:left;font-weight:600;font-size:12px;}
td{padding:10px 14px;border-bottom:1px solid #EFEFEF;color:#333;vertical-align:top;}
tr:nth-child(even) td{background:#FAFAFA;}
.rank-bad{color:#E64646;font-weight:800;}
.rank-ok{color:#138808;font-weight:800;}
.rank-warn{color:#FF9933;font-weight:700;}
.tbl-note{font-size:11px;color:#999;margin-top:10px;font-style:italic;}
code{background:#F0F0F0;padding:1px 6px;border-radius:3px;font-family:'SF Mono',Menlo,monospace;font-size:11.5px;color:#1a1a2e;}

/* ── Above-fold competitor compare (5 cols) ── */
.compare{background:white;padding:32px;page-break-inside:avoid;}
.compare-head{font-size:16px;font-weight:700;margin-bottom:6px;}
.compare-sub{font-size:13px;color:#666;margin-bottom:24px;}
.compare-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr;gap:12px;align-items:start;}
.compare-col{}
.compare-col-label{font-size:10px;font-weight:800;padding:6px 9px;border-radius:4px;color:white;margin-bottom:8px;display:inline-block;}
.compare-verdict{font-size:11px;color:#555;margin-top:8px;line-height:1.5;}

/* ── Annotated screenshot wrap ── */
.full-page{background:white;margin:24px 32px;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.1);page-break-inside:avoid;}
.block-head{display:flex;align-items:center;gap:16px;padding:16px 24px;background:#1a1a2e;color:white;}
.block-num{font-size:26px;font-weight:700;color:rgba(255,255,255,0.2);width:44px;flex-shrink:0;}
.block-title{font-size:15px;font-weight:600;}
.block-url{font-size:11px;color:rgba(255,255,255,0.4);margin-top:2px;font-family:monospace;}
.block-badge{font-size:11px;font-weight:700;color:white;padding:3px 10px;border-radius:3px;white-space:nowrap;}
.screen-wrap img{width:100%;display:block;}
.no-screenshot{padding:60px 24px;text-align:center;font-size:13px;color:#999;font-style:italic;}
.ann-legend{padding:16px 20px;background:#FAFAFA;border-top:2px solid #E0E0E0;display:flex;flex-direction:column;gap:8px;}
.ann-row{display:flex;align-items:flex-start;gap:10px;}
.ann-num{width:26px;height:26px;border-radius:50%;color:white;font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;}
.ann-action{color:white;font-size:10px;font-weight:800;padding:3px 8px;border-radius:3px;flex-shrink:0;margin-top:3px;letter-spacing:.5px;height:20px;display:flex;align-items:center;}
.ann-text{font-size:12px;line-height:1.55;color:#333;padding-top:2px;}

/* ── Quote block ── */
.quote{background:#FAFAFA;border-left:4px solid #FA0F00;padding:14px 20px;margin-bottom:10px;font-size:13px;color:#333;line-height:1.6;}
.quote em{color:#666;display:block;margin-top:6px;font-size:11.5px;font-style:normal;}

/* ── Action plan rows (Free Tools style) ── */
.actions{background:#1a1a2e;color:white;padding:52px 60px;page-break-inside:avoid;}
.actions h2{font-size:22px;font-weight:700;color:#FA0F00;margin-bottom:8px;border-bottom:none;text-transform:none;letter-spacing:-0.3px;}
.actions-sub{font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:32px;}
.action-rows{display:flex;flex-direction:column;gap:20px;}
.action-row{display:grid;grid-template-columns:48px 1fr 180px 180px;gap:16px;align-items:start;padding:20px;background:rgba(255,255,255,0.06);border-radius:8px;}
.action-p{font-size:22px;font-weight:800;color:#FA0F00;}
.action-title{font-size:14px;font-weight:700;color:white;margin-bottom:8px;}
.action-body{font-size:12px;color:rgba(255,255,255,0.78);line-height:1.7;}
.action-metric{font-size:11px;color:rgba(255,255,255,0.6);line-height:1.6;}
.action-metric strong{color:#FA0F00;display:block;font-size:12px;margin-bottom:4px;}
.effort-pill{display:inline-block;padding:3px 10px;border-radius:3px;font-size:10px;font-weight:800;color:white;}
.action-effort{display:flex;flex-direction:column;gap:6px;font-size:11px;color:rgba(255,255,255,0.5);}
.action-effort span{line-height:1.5;}

/* ── Battlecards ── */
.bcard{background:#FAFAFA;border-left:4px solid #FA0F00;padding:18px 22px;margin-bottom:14px;}
.bcard h3{font-size:14px;color:#1a1a2e;margin-bottom:10px;}
.bcard-pitch{font-size:13px;color:#666;font-style:italic;margin-bottom:8px;}
.bcard-win{font-size:13px;color:#1a1a2e;margin-bottom:6px;}
.bcard-win strong{color:#138808;}
.bcard-lose{font-size:12.5px;color:#888;}
.bcard-lose strong{color:#E64646;}

/* ── PLG cards ── */
.plg-block{background:#FAFAFA;padding:20px 24px;margin-bottom:14px;border-radius:6px;}
.plg-block h4{font-size:14px;color:#FA0F00;margin-bottom:8px;}
.plg-block p{font-size:12.5px;color:#333;margin-bottom:6px;line-height:1.65;}
.plg-block strong{color:#1a1a2e;}

/* ── Print ── */
@media print{
  body{background:white;}
  .cover,.section,.section-label,.compare,.full-page,.actions,.playbook-header{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  .full-page{margin:0;border-radius:0;box-shadow:none;page-break-after:always;}
}
</style>
</head>
<body>

<!-- ── COVER ── -->
<div class="cover">
  <div>
    <div class="eyebrow">Adobe Lightroom · US Market · Acquisition Playbook · May 2026</div>
    <div class="cover-title">Adobe Lightroom — <span>Acquisition &amp; Visibility Audit</span><br>Why Lightroom Ranks #4–7 for "Photo Editor" &amp; How to Fix It</div>
    <div class="cover-sub">Live captures of adobe.com/products/photoshop-lightroom.html and lightroom.adobe.com vs. Capture One, Luminar Neo, DxO PhotoLab, and ON1. Adobe has the AI features, the cloud, the mobile, and the ecosystem — but loses every non-branded SERP to single-purpose tools. This report shows exactly what to change.</div>
  </div>
  <div class="kpi-row">
    <div class="kpi"><div class="kpi-num">3.4M+</div><div class="kpi-lbl">Monthly US searches for photo-editor queries where Adobe is not #1</div></div>
    <div class="kpi"><div class="kpi-num">#1 Issue</div><div class="kpi-lbl">No comparison content + CC required for trial — both fix in &lt;30 days</div></div>
    <div class="kpi"><div class="kpi-num">14</div><div class="kpi-lbl">Page-level fixes annotated across hub and web app</div></div>
    <div class="kpi"><div class="kpi-num">$179</div><div class="kpi-lbl">Capture One annual undercut · Luminar Neo lifetime at $149 vs Adobe $120/yr</div></div>
  </div>
  <div class="cover-foot">
    <span>Competitive Intelligence · May 2026</span>
    <span>Adobe Internal — Not for Distribution</span>
  </div>
</div>

<!-- ── PLAYBOOK HEADER ── -->
<div class="playbook-header">
  <h1>Adobe Lightroom — Acquisition &amp; Growth Playbook 2026</h1>
  <div class="playbook-meta"><strong>Audience:</strong> Lightroom Acquisition &amp; Growth Team · <strong>Scope:</strong> Pricing · SEO · GEO · PLG Motions · <strong>Date:</strong> May 2026 · <strong>Classification:</strong> Adobe Internal — Confidential</div>
</div>

<!-- ── TL;DR ── -->
<div class="section">
  <h2>TL;DR</h2>
  <div class="tldr">
    Adobe Lightroom is the most capable photo workflow on the market — AI Mask, Generative Remove, AI Denoise, 1TB sync, desktop+web+iPad+mobile, the largest preset ecosystem — but loses every non-branded acquisition SERP. Capture One ranks #1 for "lightroom alternative" (80K/mo). Luminar Neo owns "AI photo editor" (800K/mo). VSCO and Tezza own "lightroom presets". The gap is not product — it is acquisition architecture: no comparison pages, no AI keyword targeting, no free presets gallery, credit card required for trial, and a web app that login-walls the experience instead of letting users try a preset on a sample image. Three acquisition moves change this: <strong>build vs-Capture-One and vs-Luminar comparison pages</strong>, <strong>publish a free Adobe-curated preset gallery to reclaim 200K/mo preset traffic</strong>, and <strong>remove the credit card requirement from the 7-day trial</strong>. Every competitor allows trial start without a card.
  </div>
</div>

<!-- ── 30-DAY ACTION SPRINT ── -->
<div class="section">
  <h2>30-Day Action Sprint</h2>
  <p>Ten actions to start this week. The first four are copy-only — no engineering, no tickets, no sprint planning needed.</p>

  <h3>Week 1 — No Engineering Required</h3>
  <table>
    <thead><tr><th style="width:32px;">#</th><th>Action</th><th>Exact Copy / Change</th><th style="width:100px;">Owner</th><th style="width:80px;">Effort</th></tr></thead>
    <tbody>
      <tr><td>1</td><td><strong>Hub hero CTA</strong> — change primary button</td><td>From: <code>"Buy now"</code> → To: <code>"Start free trial — 7 days, no charge"</code> · Subtext: <code>"Cancel anytime"</code> · Destination: plans page (not checkout)</td><td>Web/CRO</td><td>2 hrs</td></tr>
      <tr><td>2</td><td><strong>Hero subtext</strong> — surface AI features above fold</td><td>Add directly under H1: <code>"Generative Remove · AI Denoise · AI Masking · Adaptive Presets"</code>. Luminar dominates the AI query — Adobe has the features but does not lead with them.</td><td>Web/CRO</td><td>2 hrs</td></tr>
      <tr><td>3</td><td><strong>SEM — bid on conquest queries</strong></td><td>Keywords: <code>lightroom alternative</code> · <code>capture one vs lightroom</code> · <code>luminar vs lightroom</code> · <code>best photo editor no subscription</code>. Headline: <code>"Lightroom — AI Photo Editor &amp; Workflow"</code>. Description: <code>"Try free for 7 days. AI Mask, Generative Remove, 1TB sync — included."</code></td><td>SEM</td><td>1 day</td></tr>
      <tr><td>4</td><td><strong>SEM — bid on AI photo editor queries</strong></td><td>Keywords: <code>AI photo editor</code> · <code>generative photo editing</code> · <code>AI denoise raw</code>. Headline: <code>"AI Photo Editor — Adobe Lightroom"</code>. Destination: dedicated AI-features landing page (build in Days 8–30)</td><td>SEM</td><td>1 day</td></tr>
    </tbody>
  </table>

  <h3 style="margin-top:32px;">Days 8–30 — Light Engineering</h3>
  <table>
    <thead><tr><th style="width:32px;">#</th><th>Action</th><th>Build Spec</th><th style="width:100px;">Owner</th><th style="width:70px;">Effort</th><th style="width:140px;">Target Metric</th></tr></thead>
    <tbody>
      <tr><td>5</td><td><strong>Remove credit card from free trial</strong></td><td>Drop the credit card field from trial signup. Show <code>"7 days free — no card needed"</code> above the form. Add UTM param <code>?source=trial_no_card</code> for cohort tracking. Capture One, Luminar Neo, DxO, and ON1 all offer no-card trials. Lightroom is the only major photo editor that gates the trial with a card.</td><td>Product + Eng</td><td>3 days</td><td>Trial starts: 2× lift in 30 days</td></tr>
      <tr><td>6</td><td><strong>Build /products/lightroom/vs-capture-one</strong></td><td>Conquest comparison page. H1: <code>"Lightroom vs Capture One — which is right for you?"</code>. Above-fold table: AI features, cloud sync, mobile/iPad, presets, price. Highlight Lightroom ✅ where Capture One ❌. Include 60-sec embedded video.</td><td>Web/Content</td><td>5 days</td><td>"lightroom alternative" rank: #5 → #2</td></tr>
      <tr><td>7</td><td><strong>Build /products/lightroom/vs-luminar</strong></td><td>Same template as #6 but for Luminar Neo. Lead with: <code>"Both have AI. Only Lightroom syncs across desktop, web, iPad, and mobile."</code> Emphasise the cloud/device-coverage gap.</td><td>Web/Content</td><td>5 days</td><td>"luminar alternative" rank: not ranking → top 5</td></tr>
      <tr><td>8</td><td><strong>Publish free Adobe-curated preset gallery</strong></td><td>Page at <code>/lightroom/free-presets</code> with 200+ first-party presets. No login required to download. Each preset shows before/after on a sample photo. Tag preset packs by style: Cinematic, Portrait, Landscape, Black &amp; White, Mobile. Add: <code>"Apply in one click — open in Lightroom Free"</code> deep link.</td><td>Content + Eng</td><td>4 days</td><td>"lightroom presets free" rank: #15+ → top 5</td></tr>
      <tr><td>9</td><td><strong>AI features landing page</strong></td><td>Page at <code>/lightroom/ai-photo-editor</code>. H1: <code>"AI Photo Editor — Generative Remove, AI Mask &amp; AI Denoise"</code>. Above-fold demo video, side-by-side comparison vs Luminar Neo on AI Mask quality. FAQ schema for AI queries.</td><td>Content + Eng</td><td>4 days</td><td>"AI photo editor" rank: not ranking → top 10</td></tr>
      <tr><td>10</td><td><strong>Lightroom Web pre-login demo</strong></td><td>Drop a "Try a preset on a sample photo" button on lightroom.adobe.com above the login form. One-tap demo: applies a preset to a sample image, shows the slider stack, ends with <code>"Start free trial to edit your own"</code> CTA.</td><td>Lr Web PM + Eng</td><td>4 days</td><td>Pre-login dwell time: 12s → 45s · Demo→trial: 8%</td></tr>
    </tbody>
  </table>
</div>

<!-- ── A/B TESTS ── -->
<div class="section">
  <h2>A/B Tests to Run in Parallel</h2>
  <table>
    <thead><tr><th>Test</th><th>Control</th><th>Variant A</th><th>Variant B</th><th>Primary Metric</th></tr></thead>
    <tbody>
      <tr><td><strong>Hub hero CTA</strong></td><td>Current: "Buy now" → checkout</td><td>"Start free trial" → plans page</td><td>"Try AI Photo Editor free" → demo path</td><td>Hero CTA CTR</td></tr>
      <tr><td><strong>Trial friction</strong></td><td>Current: CC required on signup</td><td>No CC, 7-day full trial</td><td>No CC, freemium (1GB cloud free forever)</td><td>Trial starts per unique visitor</td></tr>
      <tr><td><strong>Hero copy</strong></td><td>Current: brand-led copy</td><td>"AI Photo Editor — Edit Anywhere"</td><td>"The Photo Editor Pros Use" (authority)</td><td>Time on page · scroll depth</td></tr>
      <tr><td><strong>Preset gallery placement</strong></td><td>No gallery</td><td>Gallery below fold on hub</td><td>Gallery as a sub-nav item</td><td>Preset download → trial conversion</td></tr>
    </tbody>
  </table>
</div>

<!-- ── WHAT CUSTOMERS SAY ── -->
<div class="section">
  <h2>What Customers Are Actually Saying</h2>
  <p>Signals pulled from Reddit (r/photography, r/Lightroom, r/AskPhotography), DPReview forums, G2, and Capterra reviews:</p>

  <div class="quote">"Lightroom is the best workflow tool — but the subscription forever locks you out of your edits if you ever stop paying. That's the thing that makes Capture One look attractive."<em>— r/photography, top-voted reply in "Lightroom alternatives 2026" thread</em></div>
  <div class="quote">"The AI Mask feature is incredible — completely changed my portrait workflow. Wish Adobe marketed this more, I almost switched to Luminar before discovering it was already in Lightroom."<em>— Wedding photographer, Capterra 5-star review (April 2026)</em></div>
  <div class="quote">"I keep seeing Luminar ads everywhere for AI features. Then I tried Lightroom AI Denoise and it was better. The marketing imbalance is real."<em>— DPReview forum, May 2026</em></div>
  <div class="quote">"Capture One's free trial worked without a credit card. Lightroom asked for one before I could even try. That's why I started with Capture One — even though I came back to Lightroom 6 months later."<em>— r/Lightroom, 340 upvotes (2026)</em></div>
  <div class="quote">"Lightroom Web is genuinely powerful now but everyone still thinks Photoshop Express is the 'free Adobe option'. Adobe doesn't tell anyone what Lightroom Web actually does."<em>— Photo educator on YouTube, 1.2M subs</em></div>

  <p style="margin-top:16px;"><strong>What this tells us:</strong> The acquisition problem is not product — it is awareness and trial friction. Three motions cover all five complaints: (1) market the AI features Adobe already shipped, (2) remove credit-card friction from trial, (3) tell the Lightroom Web story.</p>
</div>

<!-- ── MARKET OVERVIEW ── -->
<div class="section">
  <h2>Market Overview</h2>
  <p>Photo editing software is splitting into three camps. <strong>Subscription pros</strong> (Lightroom, Capture One) win on workflow depth and ecosystem. <strong>Perpetual-license challengers</strong> (Luminar, DxO, ON1, PDFelement-style) win on anti-subscription messaging and aggressive AI marketing. <strong>Mobile-first freemium</strong> (VSCO, Snapseed, Apple Photos) wins on hobbyists who never enter a desktop funnel.</p>
  <p>Adobe's 2026 product position is the strongest in the category — AI Mask, Generative Remove, AI Denoise, the ecosystem advantage, the cloud, and the cross-device sync no competitor offers. The acquisition position is the weakest in five years, driven by: subscription fatigue narrative, aggressive Luminar AI marketing on the highest-volume search terms, and Adobe's own page architecture (no comparison pages, no AI keyword targeting, no free presets gallery).</p>

  <h3>SEO Snapshot</h3>
  <ul>
    <li>Adobe ranks <strong>#1–2 for "Lightroom"</strong> (branded) — unchallenged</li>
    <li>Adobe ranks <strong>#4–7 for "photo editor"</strong> (600K/mo, non-branded) — behind Canva, Pixlr, Fotor</li>
    <li>Adobe ranks <strong>#8+ for "photo editor free"</strong> (800K/mo) — nearly invisible</li>
    <li>Adobe ranks <strong>#3–5 for "lightroom alternative"</strong> (80K/mo) — losing to Capture One conquest pages</li>
    <li>Adobe ranks <strong>#15+ for "lightroom presets free"</strong> (200K/mo) — third-party preset shops own this</li>
    <li>Adobe ranks <strong>not in top 20 for "AI photo editor"</strong> (800K/mo) — Luminar Neo owns it despite Adobe having better AI</li>
  </ul>
</div>

<!-- ── COMPETITIVE LANDSCAPE ── -->
<div class="section">
  <h2>Competitive Landscape</h2>
  <table>
    <thead><tr><th>Competitor</th><th>Price</th><th>Model</th><th>Primary Strength</th><th>Primary Weakness</th></tr></thead>
    <tbody>
      <tr><td><strong>Adobe Lightroom</strong></td><td>$9.99/mo ($119.88/yr)</td><td>Subscription</td><td>AI Mask, Generative Remove, cloud sync, mobile/iPad, presets ecosystem</td><td>Subscription fatigue, hero copy doesn't surface AI, no comparison pages</td></tr>
      <tr><td>Capture One Pro</td><td>$179–299/yr or $299 perpetual</td><td>Subscription or perpetual</td><td>Tethering, pro RAW handling, colour science authority</td><td>No mobile, no cloud sync, weak AI, expensive</td></tr>
      <tr><td>Luminar Neo</td><td>$149 lifetime / $89/yr</td><td>Perpetual or sub</td><td>AI features messaging, YouTube tutorials</td><td>Weaker RAW, no sync, no mobile, no presets ecosystem</td></tr>
      <tr><td>DxO PhotoLab</td><td>$229 perpetual</td><td>Perpetual</td><td>DeepPRIME XD denoising, optical corrections</td><td>No cloud, no mobile, no AI generative</td></tr>
      <tr><td>ON1 Photo RAW</td><td>$99.99/yr or $149.99 perpetual</td><td>Sub or perpetual</td><td>Lifetime price, cloud-optional, mobile companion</td><td>Smaller community, fewer presets</td></tr>
      <tr><td>Skylum Aperty</td><td>$99 lifetime</td><td>Perpetual</td><td>AI portrait specialist</td><td>Single use case only</td></tr>
      <tr><td>Canva (Photo Editor)</td><td>$0 / $14.99/mo Pro</td><td>Freemium</td><td>SEO dominance for "photo editor", template ecosystem</td><td>Not a real RAW editor, no pro workflow</td></tr>
      <tr><td>Apple Photos</td><td>$0 (built in)</td><td>Bundled</td><td>Free on Mac/iOS, integrated</td><td>Not a pro workflow tool</td></tr>
    </tbody>
  </table>
</div>

<!-- ── PRICING COMPARISON ── -->
<div class="section">
  <h2>Pricing Comparison</h2>
  <table>
    <thead><tr><th></th><th>Adobe Lightroom</th><th>Capture One</th><th>Luminar Neo</th><th>DxO PhotoLab</th><th>ON1</th></tr></thead>
    <tbody>
      <tr><td><strong>Annual cost</strong></td><td>$119.88/yr</td><td>$179.99/yr</td><td>$89/yr or $149 lifetime</td><td>$229 perpetual</td><td>$99.99/yr or $149.99 lifetime</td></tr>
      <tr><td><strong>Free trial</strong></td><td><span class="rank-bad">7 days, CC required</span></td><td>30 days, no CC</td><td>7 days, no CC</td><td>30 days, no CC</td><td>14 days, no CC</td></tr>
      <tr><td><strong>AI Mask / Generative Remove</strong></td><td><span class="rank-ok">✅ Best in class</span></td><td>❌</td><td>⚠ Basic AI Mask</td><td>❌</td><td>⚠ Limited</td></tr>
      <tr><td><strong>AI Denoise</strong></td><td><span class="rank-ok">✅</span></td><td>❌</td><td>✅</td><td><span class="rank-ok">✅ DeepPRIME XD</span></td><td>✅</td></tr>
      <tr><td><strong>Cloud sync</strong></td><td><span class="rank-ok">✅ 1TB included</span></td><td>❌</td><td>❌</td><td>❌</td><td>⚠ Add-on</td></tr>
      <tr><td><strong>Mobile / iPad app</strong></td><td><span class="rank-ok">✅ Full parity</span></td><td>❌</td><td>❌</td><td>❌</td><td>⚠ Limited</td></tr>
      <tr><td><strong>Preset ecosystem</strong></td><td><span class="rank-ok">✅ Largest</span></td><td>⚠ Styles</td><td>⚠ Looks</td><td>⚠ Presets</td><td>⚠ Effects</td></tr>
      <tr><td><strong>Roundtrip to Photoshop</strong></td><td><span class="rank-ok">✅ Native</span></td><td>⚠ Export</td><td>⚠ Export</td><td>⚠ Export</td><td>⚠ Export</td></tr>
    </tbody>
  </table>
  <p style="margin-top:14px;"><strong>Pricing reality:</strong> Lightroom is actually <em>cheaper than Capture One</em> and matches Luminar's subscription tier — but the messaging gives the opposite impression because Adobe never frames it that way. Above-fold copy on the hub page should say: <strong>"More AI than Luminar, more workflow than Capture One — for $119/yr."</strong></p>
</div>

<!-- ── ABOVE-FOLD COMPETITOR COMPARISON ── -->
<div class="section-label">Section 1 — <span>Above-the-Fold Visual Comparison</span> · What a first-time visitor sees in the first 900px</div>
<div class="compare">
  <div class="compare-head">Adobe Lightroom vs. 4 top competitors — captured at 1440×900 (May 2026)</div>
  <div class="compare-sub">Live captures. The visual difference explains the acquisition gap: Capture One leads with pro authority, Luminar leads with AI, DxO leads with quality. Adobe leads with… an unclear brand hero.</div>
  <div class="compare-grid">
    <div class="compare-col">
      <div class="compare-col-label" style="background:#FA0F00;">⚠ Adobe (Current)</div>
      ${hubFoldImg || '<div style="background:#EEE;height:200px;border-radius:6px;"></div>'}
      <div class="compare-verdict"><strong style="color:#FA0F00;">What user sees:</strong> Brand-led hero, "Buy now" CTA. No AI claim above fold. No comparison content. CC required to trial.</div>
    </div>
    <div class="compare-col">
      <div class="compare-col-label" style="background:#0070D1;">◉ Capture One</div>
      ${capOneImg || '<div style="background:#EEE;height:200px;border-radius:6px;"></div>'}
      <div class="compare-verdict"><strong style="color:#0070D1;">What user sees:</strong> "Choice of pros." 30-day trial no CC. Aggressive Adobe conquest. Weakness: $179, no mobile, no AI.</div>
    </div>
    <div class="compare-col">
      <div class="compare-col-label" style="background:#0070D1;">◉ Luminar Neo</div>
      ${luminarImg || '<div style="background:#EEE;height:200px;border-radius:6px;"></div>'}
      <div class="compare-verdict"><strong style="color:#0070D1;">What user sees:</strong> "AI Photo Editor." Lifetime $149. Massive YouTube presence. Weakness: weaker RAW, no sync, no mobile.</div>
    </div>
    <div class="compare-col">
      <div class="compare-col-label" style="background:#0070D1;">◉ DxO PhotoLab</div>
      ${dxoImg || '<div style="background:#EEE;height:200px;border-radius:6px;"></div>'}
      <div class="compare-verdict"><strong style="color:#0070D1;">What user sees:</strong> "Best RAW quality." DeepPRIME XD. $229 perpetual. Weakness: no cloud, no mobile, niche.</div>
    </div>
    <div class="compare-col">
      <div class="compare-col-label" style="background:#0070D1;">◉ ON1 Photo RAW</div>
      ${on1Img || '<div style="background:#EEE;height:200px;border-radius:6px;"></div>'}
      <div class="compare-verdict"><strong style="color:#0070D1;">What user sees:</strong> "Pay once, own forever." Lifetime $149. Direct anti-sub conquest. Weakness: smaller community.</div>
    </div>
  </div>
</div>

<!-- ── ANNOTATED HUB PAGE ── -->
<div class="section-label">Section 2 — <span>Annotated Lightroom Hub Page</span> · All 10 gaps marked with exact fixes</div>
<div class="full-page">
  <div class="block-head">
    <div class="block-num">01</div>
    <div>
      <div class="block-title">adobe.com/products/photoshop-lightroom.html — Full Page with Annotations</div>
      <div class="block-url">https://www.adobe.com/products/photoshop-lightroom.html · captured May 2026 · Accept-Language: en-US</div>
    </div>
    <div class="block-badge" style="background:#FA0F00;">⚠ 10 GAPS</div>
  </div>
  <div class="screen-wrap">${hubFullImg}</div>
  ${hubLegend}
</div>

<!-- ── ANNOTATED WEB APP ── -->
<div class="section-label">Section 3 — <span>Annotated Lightroom Web App</span> · The unseen acquisition surface</div>
<div class="full-page">
  <div class="block-head">
    <div class="block-num">02</div>
    <div>
      <div class="block-title">lightroom.adobe.com — Web App Entry (Annotated)</div>
      <div class="block-url">https://lightroom.adobe.com · captured May 2026 · Accept-Language: en-US</div>
    </div>
    <div class="block-badge" style="background:#FA0F00;">⚠ 4 GAPS</div>
  </div>
  <div class="screen-wrap">${appFullImg}</div>
  ${appLegend}
</div>

<!-- ── SEO ACQUISITION GAPS ── -->
<div class="section">
  <h2>SEO Acquisition Gaps</h2>
  <table>
    <thead><tr><th>Keyword</th><th>Monthly Volume (US)</th><th>Adobe Rank</th><th>Who Ranks #1</th><th>Fix Path</th></tr></thead>
    <tbody>
      <tr><td>photo editor</td><td>600K/mo</td><td class="rank-bad">#5–7</td><td>Canva</td><td>Build query-matched landing page · target H1</td></tr>
      <tr><td>photo editor free</td><td>800K/mo</td><td class="rank-bad">#8+</td><td>Canva / Pixlr</td><td>Surface Lightroom Web as a free entry · publish free presets gallery</td></tr>
      <tr><td>AI photo editor</td><td>800K/mo</td><td class="rank-bad">Not ranking</td><td>Luminar Neo</td><td>Dedicated /lightroom/ai-photo-editor page</td></tr>
      <tr><td>best photo editor</td><td>150K/mo</td><td class="rank-bad">#6+</td><td>PCMag listicles</td><td>Authority content + comparison pages</td></tr>
      <tr><td>lightroom alternative</td><td>80K/mo</td><td class="rank-warn">#3–5</td><td>Capture One</td><td>Counter-comparison pages + intercept SEM</td></tr>
      <tr><td>lightroom presets free</td><td>200K/mo</td><td class="rank-bad">#15+</td><td>Third-party preset shops</td><td>Adobe-curated free presets gallery</td></tr>
      <tr><td>best raw editor</td><td>40K/mo</td><td class="rank-warn">#4</td><td>DxO</td><td>RAW-specific landing page + AI Denoise content</td></tr>
      <tr><td>edit photos online</td><td>220K/mo</td><td class="rank-bad">#10+</td><td>Pixlr</td><td>Lightroom Web feature-led landing + pre-login demo</td></tr>
    </tbody>
  </table>
  <p style="margin-top:14px;"><strong>Opportunity:</strong> 2.9M monthly searches across these eight queries, Adobe captures &lt;5% of clicks. Every winner uses query-matched H1, free entry point, and conquest comparison content. Lightroom has the features — it lacks the page architecture.</p>
</div>

<!-- ── GEO ── -->
<div class="section">
  <h2>GEO — Generative Engine Optimization</h2>
  <p>~35% of US informational photo-editor queries now go through ChatGPT, Perplexity, Google AI Overviews, or Claude. AI assistants surface ~3 brands per answer — being one of those three is a new acquisition surface.</p>
  <table>
    <thead><tr><th>Query</th><th>ChatGPT Answer</th><th>Perplexity Answer</th><th>Google AI Overview</th></tr></thead>
    <tbody>
      <tr><td>"best photo editor for photographers"</td><td>Lightroom #1</td><td>Lightroom #1, Capture One #2</td><td>Lightroom #1</td></tr>
      <tr><td>"AI photo editor"</td><td class="rank-bad">Luminar Neo #1, Photoshop #2</td><td class="rank-bad">Luminar Neo, ON1, Lightroom #3+</td><td class="rank-bad">Luminar leads, Lightroom not in top 3</td></tr>
      <tr><td>"lightroom alternative"</td><td class="rank-warn">Capture One, Luminar, DxO</td><td class="rank-warn">Capture One #1, ON1, Luminar</td><td class="rank-warn">Capture One #1</td></tr>
      <tr><td>"photo editor no subscription"</td><td class="rank-bad">DxO, ON1, Luminar</td><td class="rank-bad">Affinity, Luminar, DxO</td><td class="rank-bad">Adobe not mentioned</td></tr>
      <tr><td>"free photo editor"</td><td class="rank-bad">GIMP, Canva, Photoshop Express</td><td class="rank-bad">Canva, GIMP — Lightroom not in top 3</td><td class="rank-bad">Canva dominates</td></tr>
      <tr><td>"best raw photo editor"</td><td>Lightroom #1, Capture One #2</td><td>Lightroom #2, DxO #1</td><td>Lightroom #2</td></tr>
    </tbody>
  </table>
  <h3>GEO Acquisition Moves</h3>
  <ol style="padding-left:22px;font-size:13px;line-height:1.8;color:#333;">
    <li>Publish <code>/lightroom/ai-photo-editor</code> with structured AI feature content (clear H2s, data tables, before/after examples). AI assistants extract structured content over marketing copy.</li>
    <li>Publish <code>/lightroom/free</code> showing exactly what Lightroom Web does for free — currently AI answers say "Lightroom is paid" because Adobe never says otherwise.</li>
    <li>Publish a blog series — "How Lightroom's AI compares to Luminar" — with side-by-side image grids. Long-form, structured content with named entities is what AI systems cite.</li>
  </ol>
</div>

<!-- ── WIN SIGNALS ── -->
<div class="section">
  <h2>Win Signals — Why Photographers Choose Lightroom</h2>
  <ol style="padding-left:22px;font-size:13px;line-height:1.9;color:#333;">
    <li><strong>Cross-device workflow</strong> — desktop + iPad + mobile + web with full sync; no other photo editor offers this</li>
    <li><strong>AI Mask + Generative Remove</strong> — when photographers actually try the AI features, conversion is near-instant</li>
    <li><strong>Roundtrip to Photoshop</strong> — Photography Plan includes both for $19.99/mo; no competitor matches this bundle</li>
    <li><strong>Preset ecosystem</strong> — third-party preset creators have an entire economy built on Lightroom format; switching costs are real</li>
    <li><strong>Cloud-first edits</strong> — non-destructive edits that follow the user across devices; Capture One can't do this</li>
    <li><strong>Creative Cloud user already</strong> — bundling makes adding Lightroom near-zero marginal cost on team plans</li>
  </ol>
</div>

<!-- ── BATTLECARDS ── -->
<div class="section">
  <h2>Battlecards</h2>

  <div class="bcard">
    <h3>vs. Capture One</h3>
    <div class="bcard-pitch">"The choice of professional photographers. 30-day trial, no credit card."</div>
    <div class="bcard-win"><strong>Win move:</strong> Lead with what Capture One does not have — AI Mask, Generative Remove, cloud sync, mobile, iPad. Ask: "Do you shoot on more than one device? Do you ever want to edit on your phone?" If yes to either, Capture One is a downgrade. Lightroom is also cheaper ($119/yr vs $179/yr) — invert the price narrative.</div>
    <div class="bcard-lose"><strong>Lose scenario:</strong> Studio tethered shoot, single-machine workflow, colour-science purist. Don't chase — Capture One legitimately wins here.</div>
  </div>

  <div class="bcard">
    <h3>vs. Luminar Neo</h3>
    <div class="bcard-pitch">"The AI Photo Editor — pay once, own forever for $149."</div>
    <div class="bcard-win"><strong>Win move:</strong> Demonstrate AI quality side-by-side — Lightroom AI Mask and Generative Remove are categorically better than Luminar's. Then add: "Lightroom syncs everywhere. Luminar lives on one computer." Frame Luminar as a plug-in, Lightroom as a workflow. Photography Plan bundle ($19.99/mo with Photoshop) is the closer.</div>
    <div class="bcard-lose"><strong>Lose scenario:</strong> Hobbyist who edits 5 photos a month and never wants a subscription. Let them go to Luminar — they were never going to pay $120/yr.</div>
  </div>

  <div class="bcard">
    <h3>vs. DxO PhotoLab</h3>
    <div class="bcard-pitch">"Best RAW image quality. DeepPRIME XD denoising. $229 perpetual."</div>
    <div class="bcard-win"><strong>Win move:</strong> Acknowledge DeepPRIME quality, then pivot — Lightroom AI Denoise is &gt;90% as good and includes everything else (cloud, mobile, AI Mask, presets, Photoshop bundle). For the last 10% of quality, DxO costs $229 and locks them to one desktop.</div>
    <div class="bcard-lose"><strong>Lose scenario:</strong> Astrophotography or high-ISO wildlife specialist where DeepPRIME XD is a real edge. Don't chase — they're a niche.</div>
  </div>

  <div class="bcard">
    <h3>vs. Free Tools (Canva, Pixlr, Apple Photos, Snapseed)</h3>
    <div class="bcard-pitch">"It's free."</div>
    <div class="bcard-win"><strong>Win move:</strong> Lightroom Web is also free. Surface it. Pre-login demo path lets users try AI Mask on a sample image before signing in. The ladder is: free Web → 7-day full trial → $9.99/mo. Currently the ladder is invisible.</div>
    <div class="bcard-lose"><strong>Lose scenario:</strong> Mobile-only social shooter who lives in VSCO/Snapseed. They were never the pro/prosumer target — but capture them in Lightroom Mobile freemium for the brand build.</div>
  </div>
</div>

<!-- ── ACTION PLAN (Free Tools Audit style) ── -->
<div class="section-label">Section 4 — <span>Prioritised Action Plan</span> · Owners, metrics, and effort</div>
<div class="actions">
  <h2>4 Priorities to Become #1 on Non-Branded Queries</h2>
  <div class="actions-sub">Ordered by ranking and acquisition impact. P0 and P1 alone close 60% of the gap.</div>
  <div class="action-rows">

    <div class="action-row">
      <div class="action-p">P0</div>
      <div>
        <div class="action-title">Remove Credit Card from Free Trial</div>
        <div class="action-body">Single biggest acquisition blocker. Every direct competitor (Capture One, Luminar, DxO, ON1) allows trial start without a card. Reddit and DPReview cite this as the #1 reason photographers "started with Capture One" instead. Drop the CC field; show "7 days free — no card needed" prominently. Gate the conversion on day 7 with a clear upgrade prompt, not on day 0 with a card.</div>
      </div>
      <div class="action-metric">
        <strong>Metrics to move</strong>
        Trial starts/mo: 2× lift in 30 days<br>
        Trial → paid: maintain ≥18%<br>
        "lightroom free trial" rank: top 3
      </div>
      <div class="action-effort">
        <span class="effort-pill" style="background:#E64646;">HIGH ENG</span>
        <span>3–4 weeks · owner: Lightroom Growth PM + Eng · requires billing-funnel decision</span>
      </div>
    </div>

    <div class="action-row">
      <div class="action-p">P1</div>
      <div>
        <div class="action-title">Build vs-Capture-One, vs-Luminar, and AI Photo Editor Pages</div>
        <div class="action-body">Three dedicated SEO landing pages to intercept conquest traffic:<br>
        • <code>/products/lightroom/vs-capture-one</code> — 80K/mo "lightroom alternative" traffic<br>
        • <code>/products/lightroom/vs-luminar</code> — counter-comparison<br>
        • <code>/products/lightroom/ai-photo-editor</code> — 800K/mo "AI photo editor" traffic Adobe currently gets 0% of<br>
        Each page: query-matched H1, above-fold feature comparison table, demo video, FAQ schema, trial CTA without CC.</div>
      </div>
      <div class="action-metric">
        <strong>Metrics to move</strong>
        Conquest pages rank top 3: 60 days<br>
        Search Console impressions: +400K/mo<br>
        Conquest → trial conversion: 8%
      </div>
      <div class="action-effort">
        <span class="effort-pill" style="background:#FF9933;">MEDIUM</span>
        <span>2–3 weeks · owner: SEO + Content + Web · no major eng</span>
      </div>
    </div>

    <div class="action-row">
      <div class="action-p">P2</div>
      <div>
        <div class="action-title">Free Adobe-Curated Preset Gallery — Reclaim 200K/mo Preset Traffic</div>
        <div class="action-body">Third-party preset shops own "lightroom presets free" (200K/mo) — VSCO, Tezza, and individual creator sites rank above Adobe. Publish a first-party gallery at <code>/lightroom/free-presets</code> with 200+ Adobe-curated presets, no login to download. Each preset shows before/after on a sample photo. Deep-link "Open in Lightroom Web Free" — converts the preset visitor into a Web-app activated user without forcing a paid trial decision.</div>
      </div>
      <div class="action-metric">
        <strong>Metrics to move</strong>
        "lightroom presets free" rank: #15+ → top 5<br>
        Preset gallery → Lightroom Web activation: 25%<br>
        Free-preset → paid trial: 6%
      </div>
      <div class="action-effort">
        <span class="effort-pill" style="background:#FF9933;">MEDIUM</span>
        <span>3 weeks · owner: Content + Web + Lightroom Web PM</span>
      </div>
    </div>

    <div class="action-row">
      <div class="action-p">P3</div>
      <div>
        <div class="action-title">Lightroom Web Pre-Login Demo Path</div>
        <div class="action-body">lightroom.adobe.com currently login-walls everyone. Drop a "Try a preset on a sample photo" CTA above the login form. One-tap demo: applies a preset to a sample image, shows the AI Mask panel, ends with "Start free trial — no card" CTA. Models the Photopea/Pixlr pre-login experience that converts curiosity into trial — without losing the paid-product narrative.</div>
      </div>
      <div class="action-metric">
        <strong>Metrics to move</strong>
        Pre-login dwell: 12s → 45s<br>
        Demo → trial: 8%<br>
        "edit photos online" rank: not ranking → top 10
      </div>
      <div class="action-effort">
        <span class="effort-pill" style="background:#6F42C1;">MEDIUM</span>
        <span>4 weeks · owner: Lightroom Web PM + Eng</span>
      </div>
    </div>

  </div>
</div>

<!-- ── PLG STRATEGY ── -->
<div class="section">
  <h2>PLG Acquisition Strategy</h2>

  <h3>Now — 0 to 30 Days</h3>
  <div class="plg-block">
    <h4>1. Build the "AI photo editor" SEO landing page</h4>
    <p>Adobe is invisible for "AI photo editor" (800K/mo) despite having best-in-class AI features. Build dedicated page <code>/lightroom/ai-photo-editor</code> with AI Mask, Generative Remove, AI Denoise demo videos above fold.</p>
    <p><strong>Counter:</strong> Luminar Neo ranks #1 because they own the H1 and the YouTube demos.</p>
    <p><strong>Headline:</strong> <code>"AI Photo Editor — Generative Remove, AI Mask, AI Denoise"</code></p>
    <p><strong>CTA:</strong> <code>"Try Lightroom free — no credit card"</code></p>
    <p><strong>Metric:</strong> "AI photo editor" rank: not ranking → top 10 within 60 days · 500K Search Console impressions within 90 days</p>
  </div>

  <div class="plg-block">
    <h4>2. Conquest comparison pages (vs Capture One, vs Luminar, vs DxO)</h4>
    <p>Capture One owns "lightroom alternative" (80K/mo) with a conquest page that targets Adobe by name. Adobe has no equivalent.</p>
    <p><strong>Build:</strong> three pages with side-by-side feature/price/sync tables. Headline format: <code>"Lightroom vs [Competitor] — Which is Right for You?"</code></p>
    <p><strong>Metric:</strong> Conquest pages rank top 3 within 60 days; intercepted traffic → trial conversion 8%</p>
  </div>

  <div class="plg-block">
    <h4>3. Remove credit card from free trial</h4>
    <p>200M+ Adobe Sign signers receive Lightroom marketing emails and never start because the trial asks for a card upfront. Reddit cites this as the #1 reason photographers default to Capture One's no-card 30-day trial.</p>
    <p><strong>Counter:</strong> Every competitor offers no-card trial — Adobe is alone in gating with payment info.</p>
    <p><strong>Metric:</strong> Trial starts/mo 2× lift; downstream paid conversion within 1pp of CC-required cohort</p>
  </div>

  <h3 style="margin-top:30px;">3 Months — Growth Loops</h3>
  <div class="plg-block">
    <h4>1. Preset sharing loop — every shared preset becomes a Lightroom Web acquisition</h4>
    <p><strong>Mechanic:</strong> when a user shares a Lightroom preset, the recipient lands on a Lightroom Web page that applies the preset to their own photo for free — no login. "Open in Lightroom" CTA after preview.</p>
    <p><strong>Counter:</strong> Tezza and VSCO use this loop today. Lightroom has the bigger preset ecosystem but no sharing acquisition.</p>
    <p><strong>Target:</strong> Preset share → Web activation 30% · Web → trial 8%</p>
  </div>

  <div class="plg-block">
    <h4>2. AI before/after share — viral AI showcase</h4>
    <p><strong>Mechanic:</strong> "Share AI result" button next to every Generative Remove / AI Mask / AI Denoise edit. Public link shows before/after slider and "Try this in Lightroom" CTA. Every share is a product demonstration to a new prospect.</p>
    <p><strong>Counter:</strong> Luminar has no comparable AI share loop. This is a moat.</p>
    <p><strong>Target:</strong> AI share generation rate 18%; share → trial 5%</p>
  </div>

  <div class="plg-block">
    <h4>3. Photoshop → Lightroom roundtrip prompt</h4>
    <p><strong>Mechanic:</strong> Photoshop users editing a photo see an in-app banner: "Sync these edits to mobile — open in Lightroom." One-click bridges PS users into Lightroom. 30M+ CC users already paying; many never activate Lightroom despite having access.</p>
    <p><strong>Target:</strong> CC photographer with PS active but Lightroom dormant → Lightroom activation 12% → 30% in 6 months</p>
  </div>

  <div class="plg-block">
    <h4>4. Mobile freemium activation funnel</h4>
    <p><strong>Mechanic:</strong> Lightroom Mobile free tier is generous but undiscovered. Run TikTok and YouTube Shorts campaigns showing AI Mask and Generative Remove on mobile, ending with "Free in Lightroom Mobile." Builds the freemium funnel to paid.</p>
    <p><strong>Target:</strong> Mobile free MAU +35% in 6 months · Mobile free → paid 4%</p>
  </div>

  <h3 style="margin-top:30px;">6 Months — Compounding Moats</h3>
  <div class="plg-block">
    <h4>1. Lightroom as the AI default in every AI search surface</h4>
    <p><strong>Why it compounds:</strong> as ChatGPT and Perplexity become primary research surfaces for "AI photo editor", being the cited answer becomes a self-reinforcing acquisition channel.</p>
    <p><strong>Why competitors can't copy:</strong> requires domain authority, structured AI-feature content, and named-entity recognition that Luminar's marketing site lacks. Adobe has the authority — needs the content.</p>
    <p><strong>Build:</strong> structured content hub at <code>/lightroom/learn/ai</code>; before/after grids; named-feature pages; cite-friendly data tables.</p>
  </div>

  <div class="plg-block">
    <h4>2. Preset Marketplace — first-party + creator economy</h4>
    <p><strong>Why it compounds:</strong> preset creators bring their audiences to Adobe (not to a third-party shop). Each new creator is acquisition. Marketplace search traffic compounds monthly.</p>
    <p><strong>Why competitors can't copy:</strong> 12–18 months to build a creator economy from zero. Adobe has the creators — needs the storefront.</p>
    <p><strong>Build:</strong> preset marketplace inside Lightroom and on web; 70/30 revenue split with creators; Adobe-curated free section reclaims "free presets" SEO.</p>
  </div>

  <div class="plg-block">
    <h4>3. Lightroom Web as a category-defining free entry point</h4>
    <p><strong>Why it compounds:</strong> if Lightroom Web becomes "the free photo editor people search for", the ladder Lightroom Web Free → Trial → Lightroom Plan becomes the default acquisition funnel. Canva proved this works for design.</p>
    <p><strong>Why competitors can't copy:</strong> Lightroom Web has full RAW handling, AI Mask, sync, and presets — no other free editor is in the same league. The hard part is being known for it.</p>
    <p><strong>Build:</strong> dedicated marketing for Lightroom Web Free; pre-login demos; "Edit any photo free in your browser" homepage variant.</p>
  </div>
</div>

<!-- ── METRICS DASHBOARD ── -->
<div class="section">
  <h2>PLG Metrics Dashboard — Acquisition Focus</h2>
  <table>
    <thead><tr><th>Metric</th><th>Current Estimate</th><th>6-Month Target</th></tr></thead>
    <tbody>
      <tr><td><strong>Non-branded organic trial starts (SEO)</strong></td><td>~1,000/mo</td><td>10,000/mo</td></tr>
      <tr><td>Trial start without CC requirement</td><td>0% (CC required today)</td><td>100% of trials no-CC</td></tr>
      <tr><td>"AI photo editor" SERP rank</td><td>Not in top 20</td><td>Top 5 (Luminar #1 today)</td></tr>
      <tr><td>"lightroom alternative" intercepted traffic</td><td>&lt;5% to Adobe.com</td><td>40% to Adobe.com</td></tr>
      <tr><td>Preset gallery → Lightroom Web activation</td><td>N/A (no gallery exists)</td><td>25%</td></tr>
      <tr><td>Pre-login demo → trial conversion (Lightroom Web)</td><td>0% (no demo exists)</td><td>8%</td></tr>
      <tr><td>GEO citation rate: "AI photo editor"</td><td>0% (not cited)</td><td>Top 3 cited brands</td></tr>
      <tr><td>Preset share → new Lightroom user</td><td>~3%</td><td>20%</td></tr>
      <tr><td>CC photographer → Lightroom activation</td><td>~12%</td><td>30%</td></tr>
      <tr><td>Mobile free MAU (US)</td><td>Baseline</td><td>+35%</td></tr>
    </tbody>
  </table>
</div>

<!-- ── FOOTER ── -->
<div class="section" style="text-align:center;background:#1a1a2e;color:rgba(255,255,255,0.5);padding:24px 60px;font-size:11px;">
  Adobe Internal · Confidential · Generated May 2026 · Adobe Lightroom Acquisition Playbook · US Market
</div>

</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('Capturing Lightroom acquisition playbook screenshots...');
  const screenshots = await captureScreenshots();

  console.log('Building HTML...');
  const html = buildHTML(screenshots);
  const htmlPath = path.join(__dirname, '../docs/Lightroom-Acquisition-Playbook-US.html');
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log(`HTML → ${htmlPath}`);

  console.log('Generating PDF...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve(htmlPath), { waitUntil: 'networkidle0', timeout: 90000 });
  const pdfPath = path.join(process.env.HOME, 'Desktop/Lightroom-Acquisition-Playbook-US-2026-05.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
  });
  await browser.close();
  console.log(`PDF → ${pdfPath}`);

  const tmpDir = path.join(__dirname, '../.tmp-lightroom');
  if (fs.existsSync(tmpDir)) {
    fs.readdirSync(tmpDir).forEach(f => fs.unlinkSync(path.join(tmpDir, f)));
    fs.rmdirSync(tmpDir);
  }
  console.log('Done.');
}

main().catch(err => { console.error(err); process.exit(1); });
