/**
 * Captures key India journey screenshots for Acrobat opportunity analysis.
 * Produces an annotated HTML report compiled into a PDF.
 *
 * Pages captured:
 *  1. Adobe Acrobat India hub  — missing student offer, no free CTA
 *  2. Adobe Acrobat India pricing — no annual INR total, no UPI, no GST callout
 *  3. Adobe cancellation/manage page — ₹749 trap origin point
 *  4. Adobe student program page — offer buried, not linked from hub
 *  5. iLovePDF — 29 free tools above fold (benchmark)
 *  6. Smallpdf — free-first CTA (benchmark)
 *  7. PDF24 — fully free, prominent India traffic
 *  8. Foxit India — ₹5,500/yr competitor pricing page
 *  9. WPS PDF — ₹1,750/yr India pricing
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const PAGES = [
  {
    id: 'acrobat-india-hub',
    label: 'Adobe Acrobat India — Hub Page',
    url: 'https://www.adobe.com/in/acrobat.html',
    opportunity: 'MISSING: Student free tier offer not surfaced · No "Try for free" CTA · No task grid below fold',
    opportunityType: 'gap',
    fullPage: true,
    viewport: { width: 1440, height: 900 },
  },
  {
    id: 'acrobat-india-pricing',
    label: 'Adobe Acrobat India — Pricing Page',
    url: 'https://www.adobe.com/in/acrobat/pricing.html',
    opportunity: 'MISSING: Annual total in INR incl. GST · No UPI payment badge · No free plan shown left-most · "Most Popular" on Pro not Standard',
    opportunityType: 'gap',
    fullPage: true,
    viewport: { width: 1440, height: 900 },
  },
  {
    id: 'acrobat-india-students',
    label: 'Adobe Acrobat India — Student Free Program',
    url: 'https://www.adobe.com/in/acrobat/students.html',
    opportunity: 'OPPORTUNITY: 40M eligible students — this page exists but is NOT linked from the hub page or pricing page',
    opportunityType: 'opportunity',
    fullPage: false,
    viewport: { width: 1440, height: 900 },
  },
  {
    id: 'acrobat-india-cancel',
    label: 'Adobe Account — Manage Plan (₹749 Trap Origin)',
    url: 'https://account.adobe.com/plans',
    opportunity: '₹749 TRAP: Cancellation triggers ₹749/mo charge — this page is where the Twitter/Quora complaints originate. Needs a transparent "What you\'ll be charged" explainer before the Cancel button.',
    opportunityType: 'risk',
    fullPage: false,
    viewport: { width: 1440, height: 900 },
  },
  {
    id: 'ilovepdf',
    label: 'iLovePDF — Benchmark: 29 Free Tools Above Fold',
    url: 'https://www.ilovepdf.com/',
    opportunity: 'BENCHMARK: 29 task tiles visible without scrolling. Adobe hub shows 0 task tiles. This is the direct conversion pattern Adobe should replicate.',
    opportunityType: 'benchmark',
    fullPage: false,
    viewport: { width: 1440, height: 900 },
  },
  {
    id: 'smallpdf',
    label: 'Smallpdf — Benchmark: Free-First CTA Hero',
    url: 'https://smallpdf.com/',
    opportunity: 'BENCHMARK: Hero CTA is "Choose a PDF tool" → free task. No paywall until output. Adobe\'s hero CTA is "Buy now" — opposite funnel entry.',
    opportunityType: 'benchmark',
    fullPage: false,
    viewport: { width: 1440, height: 900 },
  },
  {
    id: 'pdf24',
    label: 'PDF24 — Benchmark: Fully Free, India Top-3 Market',
    url: 'https://tools.pdf24.org/en/',
    opportunity: 'BENCHMARK: Entirely free, no signup required. India is a top-3 traffic market. Every task is a single click — no account gate.',
    opportunityType: 'benchmark',
    fullPage: false,
    viewport: { width: 1440, height: 900 },
  },
  {
    id: 'foxit-india',
    label: 'Foxit PDF Editor — India Pricing (₹5,500/yr)',
    url: 'https://www.foxit.com/pdf-editor/',
    opportunity: 'COMPETITOR: ₹5,500/yr vs Adobe ₹19,152/yr — 3.5× cheaper. Foxit runs conquest ads on "adobe acrobat india" keywords. Price gap is the primary switch trigger.',
    opportunityType: 'competitor',
    fullPage: false,
    viewport: { width: 1440, height: 900 },
  },
  {
    id: 'wps-pdf',
    label: 'WPS PDF — India Pricing (₹1,750/yr)',
    url: 'https://pdf.wps.com/',
    opportunity: 'COMPETITOR: ₹1,750/yr — 11× cheaper than Adobe. Growing fast in India via WPS Office bundle. Free tier with watermark.',
    opportunityType: 'competitor',
    fullPage: false,
    viewport: { width: 1440, height: 900 },
  },
];

const TYPE_COLORS = {
  gap:        { bg: '#FFF3CD', border: '#FF9933', label: '#7A4500', badge: '⚠ GAP' },
  opportunity:{ bg: '#D4EDDA', border: '#138808', label: '#0A4D1A', badge: '✓ OPPORTUNITY' },
  risk:       { bg: '#F8D7DA', border: '#CC0000', label: '#7A0000', badge: '🔴 RISK' },
  benchmark:  { bg: '#D1ECF1', border: '#0070D1', label: '#003D73', badge: '◉ BENCHMARK' },
  competitor: { bg: '#E2D9F3', border: '#6F42C1', label: '#3A1B6E', badge: '⚡ COMPETITOR' },
};

async function captureScreenshots() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-http2',
    ],
  });

  const screenshots = [];
  const tmpDir = path.join(__dirname, '../.tmp-india-screenshots');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  for (const page of PAGES) {
    console.log(`  Capturing: ${page.label}`);
    const tab = await browser.newPage();
    await tab.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
    await tab.setViewport(page.viewport);
    await tab.setExtraHTTPHeaders({
      'Accept-Language': 'en-IN,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    });

    let screenshotPath = null;
    try {
      await tab.goto(page.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 3000));

      screenshotPath = path.join(tmpDir, `${page.id}.png`);
      await tab.screenshot({
        path: screenshotPath,
        fullPage: page.fullPage,
        type: 'png',
      });
      console.log(`    ✓ saved ${page.id}.png`);
    } catch (err) {
      console.log(`    ✗ ${page.id}: ${err.message} — will note as unavailable`);
    }
    await tab.close();

    screenshots.push({
      ...page,
      screenshotPath,
    });
  }

  await browser.close();
  return screenshots;
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
      <div class="opportunity-box" style="background:${c.bg}; border-left: 4px solid ${c.border}; color:${c.label};">
        ${s.opportunity}
      </div>
      <div class="screenshot-wrap">
        ${imgTag}
      </div>
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
  body { font-family: 'Adobe Clean', 'Inter', sans-serif; background: #F5F5F5; color: #2C2C2C; }

  /* Cover */
  .cover {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    color: white;
    padding: 80px 60px;
    min-height: 320px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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

  /* Legend */
  .legend {
    background: white;
    padding: 32px 60px;
    border-bottom: 1px solid #E0E0E0;
    page-break-after: always;
  }
  .legend h2 { font-size: 18px; margin-bottom: 20px; }
  .legend-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
  .legend-item { padding: 12px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; }

  /* TOC */
  .toc {
    background: white;
    padding: 40px 60px;
    page-break-after: always;
  }
  .toc h2 { font-size: 22px; font-weight: 700; margin-bottom: 24px; }
  .toc ol { list-style: none; }
  .toc li { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid #F0F0F0; font-size: 14px; }
  .toc-num { font-size: 11px; color: #999; width: 24px; flex-shrink: 0; }
  .toc-badge { font-size: 10px; color: white; padding: 2px 7px; border-radius: 3px; flex-shrink: 0; }

  /* Page blocks */
  .page-block {
    background: white;
    margin: 32px 40px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    page-break-inside: avoid;
    page-break-after: always;
  }
  .page-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px 24px;
    background: #1a1a2e;
    color: white;
  }
  .page-number { font-size: 28px; font-weight: 700; color: rgba(255,255,255,0.25); width: 48px; flex-shrink: 0; }
  .page-meta { flex: 1; }
  .page-label { font-size: 16px; font-weight: 600; }
  .page-url { font-size: 11px; color: rgba(255,255,255,0.45); margin-top: 3px; font-family: monospace; }
  .badge { font-size: 11px; font-weight: 700; color: white; padding: 4px 12px; border-radius: 4px; white-space: nowrap; }

  .opportunity-box {
    padding: 14px 24px;
    font-size: 13px;
    font-weight: 500;
    line-height: 1.6;
  }

  .screenshot-wrap {
    padding: 0;
    background: #F0F0F0;
  }
  .screenshot-wrap img {
    width: 100%;
    display: block;
    border-top: 1px solid #E0E0E0;
  }
  .no-screenshot {
    padding: 60px 24px;
    text-align: center;
    font-size: 13px;
    color: #999;
    font-style: italic;
  }

  /* Summary */
  .summary {
    background: #1a1a2e;
    color: white;
    padding: 60px;
    margin: 32px 40px;
    border-radius: 10px;
  }
  .summary h2 { font-size: 26px; font-weight: 700; color: #FF9933; margin-bottom: 32px; }
  .summary-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; }
  .summary-card { background: rgba(255,255,255,0.07); border-radius: 8px; padding: 20px; }
  .summary-card h3 { font-size: 13px; color: #FF9933; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; }
  .summary-card ul { list-style: none; font-size: 13px; line-height: 2; color: rgba(255,255,255,0.8); }
  .summary-card ul li::before { content: "→ "; color: #FF9933; }

  @media print {
    body { background: white; }
    .page-block { margin: 0; border-radius: 0; box-shadow: none; }
    .cover { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .legend, .toc, .page-block, .summary { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>
</head>
<body>

<!-- COVER -->
<div class="cover">
  <div>
    <div class="cover-eyebrow">Adobe Acrobat · India Market</div>
    <div class="cover-title">India Journey <span>Screenshots</span> &amp; Opportunity Analysis</div>
    <div class="cover-subtitle">Live captures of Adobe Acrobat India pages vs. key competitors — annotated with gaps, risks, and benchmarks for the PM sprint.</div>
  </div>
  <div class="cover-meta">
    <div class="cover-stat">
      <div class="cover-stat-num">3</div>
      <div class="cover-stat-label">Gaps on Adobe India pages</div>
    </div>
    <div class="cover-stat">
      <div class="cover-stat-num">₹749</div>
      <div class="cover-stat-label">Trap driving churn &amp; Twitter noise</div>
    </div>
    <div class="cover-stat">
      <div class="cover-stat-num">3.5×</div>
      <div class="cover-stat-label">Adobe vs. Foxit price gap</div>
    </div>
    <div class="cover-stat">
      <div class="cover-stat-num">40M</div>
      <div class="cover-stat-label">Students eligible for free tier</div>
    </div>
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
    <div class="legend-item" style="background:#FFF3CD; color:#7A4500; border-left:4px solid #FF9933;">⚠ GAP — Feature or copy missing from Adobe India page that a competitor has</div>
    <div class="legend-item" style="background:#D4EDDA; color:#0A4D1A; border-left:4px solid #138808;">✓ OPPORTUNITY — Existing Adobe asset not surfaced on the right page</div>
    <div class="legend-item" style="background:#F8D7DA; color:#7A0000; border-left:4px solid #CC0000;">🔴 RISK — Active churn or reputation trigger requiring immediate fix</div>
    <div class="legend-item" style="background:#D1ECF1; color:#003D73; border-left:4px solid #0070D1;">◉ BENCHMARK — Competitor page setting the bar Adobe should match or beat</div>
    <div class="legend-item" style="background:#E2D9F3; color:#3A1B6E; border-left:4px solid #6F42C1;">⚡ COMPETITOR — Rival pricing / positioning page for direct comparison</div>
  </div>
</div>

<!-- TOC -->
<div class="toc">
  <h2>Pages Captured</h2>
  <ol>${toc}</ol>
</div>

<!-- SCREENSHOTS -->
${items.join('\n')}

<!-- SUMMARY -->
<div class="summary">
  <h2>30-Day India Sprint — What These Screenshots Tell You</h2>
  <div class="summary-grid">
    <div class="summary-card">
      <h3>Week 1 — Copy Only (No Eng)</h3>
      <ul>
        <li>"Are you a student in India? Get Acrobat free →" on hub hero</li>
        <li>Annual total: ₹19,152 billed annually incl. GST on pricing page</li>
        <li>Move free plan to left-most column on pricing page</li>
        <li>Change hero CTA to "Try Acrobat for free" → plans page</li>
        <li>Add UPI badge + "GST invoice provided" callout</li>
      </ul>
    </div>
    <div class="summary-card">
      <h3>Days 8–30 — Engineering</h3>
      <ul>
        <li>8-tool task grid below hero fold (Edit · Sign · Merge · Compress · OCR · PDF→Word · Protect · Fill &amp; Sign)</li>
        <li>Transparent billing explainer before Cancel button (/in/acrobat/cancel-terms)</li>
        <li>SEM: buy "acrobat cancel india" + "adobe ₹749 charge" keywords</li>
        <li>India student eligibility check widget (college email domain lookup)</li>
      </ul>
    </div>
    <div class="summary-card">
      <h3>Success Metrics</h3>
      <ul>
        <li>Student page CTR from hub: 0% → 8%+</li>
        <li>India pricing page bounce rate: −15%</li>
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

async function main() {
  console.log('Capturing India journey screenshots...');
  const screenshots = await captureScreenshots();

  console.log('Building annotated HTML...');
  const html = buildHTML(screenshots);

  const htmlPath = path.join(__dirname, '../docs/Acrobat-India-Journey-Screenshots.html');
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log(`HTML saved → ${htmlPath}`);

  console.log('Generating PDF...');
  const puppeteer2 = require('puppeteer');
  const browser = await puppeteer2.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve(htmlPath), { waitUntil: 'networkidle0', timeout: 60000 });

  const pdfPath = path.join(process.env.HOME, 'Desktop/Acrobat-India-Journey-Screenshots-2026-05.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
  });
  await browser.close();
  console.log(`PDF saved → ${pdfPath}`);

  // Cleanup tmp screenshots
  const tmpDir = path.join(__dirname, '../.tmp-india-screenshots');
  fs.readdirSync(tmpDir).forEach(f => fs.unlinkSync(path.join(tmpDir, f)));
  fs.rmdirSync(tmpDir);

  console.log('Done.');
}

main().catch(err => { console.error(err); process.exit(1); });
