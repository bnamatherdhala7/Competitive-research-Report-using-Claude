/**
 * md-to-pdf.ts — converts any markdown doc to an Adobe-branded PDF on the Desktop
 * Usage: npx tsx scripts/md-to-pdf.ts docs/acrobat-competitor-analysis.md
 */

import puppeteer from "puppeteer";
import { readFileSync } from "fs";
import { homedir } from "os";
import { join, basename } from "path";

const inputFile = process.argv[2];
if (!inputFile) {
  console.error("Usage: npx tsx scripts/md-to-pdf.ts <path-to-markdown-file>");
  process.exit(1);
}

const raw = readFileSync(inputFile, "utf-8");
const docName = basename(inputFile, ".md");
const date = new Date().toISOString().slice(0, 7);
const outputPath = join(homedir(), "Desktop", `Adobe-${docName}-${date}.pdf`);

// ─── Inline formatter ───────────────────────────────────────────────────────
function inline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

// ─── Block-level markdown → HTML ─────────────────────────────────────────────
function parseMarkdown(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let tableRows: string[] = [];
  let listItems: string[] = [];
  let listType: "ul" | "ol" = "ul";
  let inBlockquote = false;
  let bqLines: string[] = [];

  function flushTable() {
    if (!tableRows.length) return;
    // Find separator row index
    const sepIdx = tableRows.findIndex((r) => /^\|[\s\-:|]+\|$/.test(r));
    const headerRow = tableRows[0];
    const bodyRows = tableRows.slice(sepIdx + 1);
    const headers = headerRow
      .split("|")
      .filter((_, i, a) => i > 0 && i < a.length - 1)
      .map((h) => h.trim());

    out.push('<table><thead><tr>');
    headers.forEach((h) => out.push(`<th>${inline(h)}</th>`));
    out.push("</tr></thead><tbody>");

    bodyRows.forEach((row) => {
      const cells = row
        .split("|")
        .filter((_, i, a) => i > 0 && i < a.length - 1)
        .map((c) => c.trim());
      out.push("<tr>");
      cells.forEach((c) => out.push(`<td>${inline(c)}</td>`));
      out.push("</tr>");
    });
    out.push("</tbody></table>");
    tableRows = [];
  }

  function flushList() {
    if (!listItems.length) return;
    out.push(`<${listType}>`);
    listItems.forEach((li) => out.push(li));
    out.push(`</${listType}>`);
    listItems = [];
  }

  function flushBlockquote() {
    if (!bqLines.length) return;
    out.push(`<blockquote>${bqLines.map(inline).join(" ")}</blockquote>`);
    bqLines = [];
    inBlockquote = false;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Table row
    if (/^\|.+\|$/.test(line)) {
      flushList();
      flushBlockquote();
      tableRows.push(line);
      continue;
    }
    if (tableRows.length) flushTable();

    // Blockquote
    if (/^> /.test(line)) {
      flushList();
      inBlockquote = true;
      bqLines.push(line.replace(/^> /, ""));
      continue;
    }
    if (inBlockquote) flushBlockquote();

    // Unordered list
    if (/^[-*] /.test(line)) {
      if (listItems.length && listType !== "ul") flushList();
      listType = "ul";
      listItems.push(`<li>${inline(line.replace(/^[-*] /, ""))}</li>`);
      continue;
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      if (listItems.length && listType !== "ol") flushList();
      listType = "ol";
      listItems.push(`<li>${inline(line.replace(/^\d+\. /, ""))}</li>`);
      continue;
    }

    flushList();

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      out.push("<hr>");
      continue;
    }

    // Headings
    if (/^# /.test(line)) { out.push(`<h1>${inline(line.slice(2))}</h1>`); continue; }
    if (/^## /.test(line)) { out.push(`<h2>${inline(line.slice(3))}</h2>`); continue; }
    if (/^### /.test(line)) { out.push(`<h3>${inline(line.slice(4))}</h3>`); continue; }
    if (/^#### /.test(line)) { out.push(`<h4>${inline(line.slice(5))}</h4>`); continue; }

    // Empty line
    if (!line.trim()) { out.push(""); continue; }

    // Paragraph
    out.push(`<p>${inline(line)}</p>`);
  }

  // Flush remaining
  if (tableRows.length) flushTable();
  if (listItems.length) flushList();
  if (inBlockquote) flushBlockquote();

  return out.join("\n");
}

// ─── Build full HTML document ─────────────────────────────────────────────────
function buildHtml(md: string): string {
  // Extract H1 title and remove it from body
  const titleMatch = md.match(/^# (.+)$/m);
  const reportTitle = titleMatch ? titleMatch[1] : docName;
  const bodyMd = md.replace(/^# .+\n?/m, "");

  // Extract first bold-metadata line (Audience/Date/Scope lines)
  const metaMatch = bodyMd.match(/^\*\*[A-Z][^*]+\*\*[^\n]+/m);
  const metaRaw = metaMatch ? metaMatch[0] : "";
  const metaHtml = inline(metaRaw);
  const bodyMd2 = metaRaw ? bodyMd.replace(metaRaw, "").trimStart() : bodyMd;

  const body = parseMarkdown(bodyMd2);
  const generated = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  :root {
    --red: #EB1000;
    --dark: #1E1E1E;
    --gray: #505050;
    --mid: #888;
    --light: #F7F7F7;
    --border: #E2E2E2;
    --green: #1E8A2E;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    font-size: 10pt;
    color: var(--dark);
    line-height: 1.6;
    background: white;
  }

  /* ── Header ── */
  .header {
    background: var(--red);
    color: white;
    padding: 30px 48px 26px;
    page-break-after: avoid;
  }
  .header-logo {
    font-size: 28pt;
    font-weight: 900;
    letter-spacing: -1.5px;
    margin-bottom: 8px;
  }
  .header-title {
    font-size: 17pt;
    font-weight: 300;
    line-height: 1.25;
    margin-bottom: 10px;
  }
  .header-meta {
    font-size: 8.5pt;
    opacity: 0.75;
    line-height: 1.7;
    border-top: 1px solid rgba(255,255,255,0.3);
    padding-top: 10px;
    margin-top: 4px;
  }
  .header-meta strong { opacity: 1; font-weight: 700; }

  /* ── Content ── */
  .content { padding: 30px 48px 52px; }

  /* ── Typography ── */
  h1 { display: none; }
  h2 {
    color: var(--red);
    font-size: 12.5pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    border-bottom: 2.5px solid var(--red);
    padding-bottom: 6px;
    margin: 30px 0 14px;
    page-break-after: avoid;
  }
  h3 {
    font-size: 11pt;
    font-weight: 700;
    color: var(--dark);
    margin: 22px 0 8px;
    page-break-after: avoid;
  }
  h4 {
    font-size: 10.5pt;
    font-weight: 600;
    color: var(--gray);
    margin: 16px 0 6px;
  }
  p { margin: 6px 0 8px; }
  hr {
    border: none;
    border-top: 1px solid var(--border);
    margin: 22px 0;
  }
  a { color: var(--red); text-decoration: none; }
  code {
    background: var(--light);
    border: 1px solid var(--border);
    border-radius: 3px;
    padding: 1px 5px;
    font-family: 'SF Mono', 'Fira Code', Monaco, Consolas, monospace;
    font-size: 8.5pt;
  }
  strong { font-weight: 700; }
  em { font-style: italic; }

  /* ── Blockquote (TL;DR) ── */
  blockquote {
    background: var(--light);
    border-left: 5px solid var(--red);
    padding: 14px 18px;
    margin: 14px 0;
    font-size: 10.5pt;
    line-height: 1.65;
    page-break-inside: avoid;
  }

  /* ── Lists ── */
  ul, ol { padding-left: 20px; margin: 8px 0 10px; }
  li { margin: 4px 0; line-height: 1.55; }
  ul ul, ol ol { margin: 2px 0; }

  /* ── Tables ── */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0 18px;
    font-size: 9pt;
    page-break-inside: avoid;
  }
  thead tr { background: var(--dark); color: white; }
  th {
    padding: 9px 11px;
    text-align: left;
    font-weight: 700;
    font-size: 8.5pt;
    letter-spacing: 0.3px;
    white-space: nowrap;
  }
  td {
    padding: 8px 11px;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
    line-height: 1.45;
  }
  tr:nth-child(even) td { background: var(--light); }
  tr:first-child td { font-weight: 600; background: #f0f0f0; }

  /* ── Footer ── */
  .footer {
    margin-top: 44px;
    padding-top: 12px;
    border-top: 1px solid var(--border);
    color: var(--mid);
    font-size: 8pt;
    display: flex;
    justify-content: space-between;
  }

  /* ── Print ── */
  @page { size: A4; margin: 0; }
  @media print {
    h2 { page-break-before: auto; }
    table, blockquote { page-break-inside: avoid; }
    .no-break { page-break-inside: avoid; }
  }
</style>
</head>
<body>

<div class="header">
  <div class="header-logo">Adobe</div>
  <div class="header-title">${inline(reportTitle)}</div>
  <div class="header-meta">${metaHtml || `Generated ${generated} &nbsp;·&nbsp; Adobe Internal &nbsp;·&nbsp; Confidential`}</div>
</div>

<div class="content">
${body}
<div class="footer">
  <span>Adobe Internal &nbsp;·&nbsp; Confidential</span>
  <span>Generated ${generated}</span>
</div>
</div>

</body>
</html>`;
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`Reading: ${inputFile}`);
  const html = buildHtml(raw);

  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  console.log(`Saving PDF → ${outputPath}`);
  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
    margin: { top: "0", bottom: "0", left: "0", right: "0" },
  });

  await browser.close();
  console.log(`✅  Done: ${outputPath}`);
}

main().catch((err) => {
  console.error("❌ ", err instanceof Error ? err.message : err);
  process.exit(1);
});
