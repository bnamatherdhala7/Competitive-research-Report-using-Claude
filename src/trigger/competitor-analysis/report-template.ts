import type { AnalysisReport } from "./types.js";

// Adobe brand colours
const RED = "#EB1000";
const DARK = "#1E1E1E";
const GRAY = "#505050";
const LIGHT = "#F5F5F5";
const BORDER = "#E0E0E0";

function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function bulletList(items: string[]): string {
  return `<ul>${items.map((i) => `<li>${escHtml(i)}</li>`).join("")}</ul>`;
}

function pricingTable(rows: AnalysisReport["creditPackAnalysis"]): string {
  const headers = ["Competitor", "Model", "Free Tier", "Entry Price", "Community Sentiment"];
  const ths = headers
    .map((h) => `<th style="background:${DARK};color:#fff;padding:9px 12px;text-align:left;font-size:10pt">${h}</th>`)
    .join("");

  const trs = rows
    .map(
      (r, i) => `<tr style="background:${i % 2 === 0 ? "#fff" : LIGHT}">
        <td style="padding:9px 12px;border-bottom:1px solid ${BORDER}"><strong>${escHtml(r.competitor)}</strong></td>
        <td style="padding:9px 12px;border-bottom:1px solid ${BORDER}">${escHtml(r.model)}</td>
        <td style="padding:9px 12px;border-bottom:1px solid ${BORDER}">${escHtml(r.freeTier)}</td>
        <td style="padding:9px 12px;border-bottom:1px solid ${BORDER}">${escHtml(r.paidEntry)}</td>
        <td style="padding:9px 12px;border-bottom:1px solid ${BORDER};font-size:9.5pt;color:${GRAY}">${escHtml(r.sentiment)}</td>
      </tr>`
    )
    .join("");

  return `<table style="width:100%;border-collapse:collapse;font-size:10pt">
    <thead><tr>${ths}</tr></thead>
    <tbody>${trs}</tbody>
  </table>`;
}

function strengthCards(items: string[]): string {
  return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
    ${items
      .map(
        (s) =>
          `<div style="background:${LIGHT};border-left:4px solid ${RED};padding:10px 12px;font-size:10pt">${escHtml(s)}</div>`
      )
      .join("")}
  </div>`;
}

function recommendationList(items: string[]): string {
  return `<ol style="padding-left:20px;margin:0">${items
    .map(
      (r, i) =>
        `<li style="padding:8px 0;border-bottom:1px solid ${BORDER};font-size:10.5pt">${escHtml(r)}</li>`
    )
    .join("")}</ol>`;
}

function section(title: string, body: string): string {
  return `<div style="margin-bottom:28px;page-break-inside:avoid">
    <h2 style="color:${RED};font-size:12pt;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid ${RED};padding-bottom:6px;margin-bottom:14px">${title}</h2>
    ${body}
  </div>`;
}

export function generateHtml(report: AnalysisReport, generatedAt: string): string {
  const date = new Date(generatedAt);
  const monthYear = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      color: ${DARK};
      font-size: 11pt;
      line-height: 1.5;
    }
    ul { padding-left: 20px; }
    ul li { margin-bottom: 7px; font-size: 10.5pt; }
    @page { size: A4; margin: 0; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>

<!-- Header -->
<div style="background:${RED};color:#fff;padding:30px 48px 24px">
  <div style="font-size:26pt;font-weight:900;letter-spacing:-1px;margin-bottom:4px">Adobe</div>
  <div style="font-size:16pt;font-weight:300;opacity:0.92">Firefly — Competitive Intelligence Report</div>
  <div style="font-size:10pt;opacity:0.75;margin-top:4px">Credit Packs &amp; AI Image Generation &nbsp;|&nbsp; ${monthYear}</div>
</div>

<!-- Body -->
<div style="padding:32px 48px 48px">

  ${section(
    "Executive Summary",
    bulletList(report.executiveSummary)
  )}

  ${section(
    "Credit Pack &amp; Pricing Matrix",
    pricingTable(report.creditPackAnalysis)
  )}

  ${section(
    "Adobe Firefly Strengths to Amplify",
    strengthCards(report.adobeStrengths)
  )}

  ${section(
    "Strategic Recommendations",
    recommendationList(report.recommendations)
  )}

  <!-- Footer -->
  <div style="margin-top:36px;padding-top:12px;border-top:1px solid ${BORDER};color:${GRAY};font-size:8.5pt">
    Generated ${new Date(generatedAt).toUTCString()} &nbsp;|&nbsp; Adobe Firefly PM Intelligence &nbsp;|&nbsp; Confidential — Internal Use Only
  </div>

</div>
</body>
</html>`;
}
