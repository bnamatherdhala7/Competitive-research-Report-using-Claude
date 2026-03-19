/**
 * save-report.ts
 *
 * Runs the full pipeline (scrape → analyse → render) locally and saves
 * the branded Adobe PDF to ~/Desktop/Adobe-Firefly-Report-YYYY-MM.pdf
 *
 * Usage: npm run save-report
 */

import { config } from "dotenv";
config();

import puppeteer from "puppeteer";
import { homedir } from "os";
import { join } from "path";
import { scrapeReddit } from "../src/trigger/competitor-analysis/reddit.js";
import { scrapeYouTube } from "../src/trigger/competitor-analysis/youtube.js";
import { searchWeb } from "../src/trigger/competitor-analysis/web-search.js";
import { analyzeCompetitors } from "../src/trigger/competitor-analysis/analyzer.js";
import { generateHtml } from "../src/trigger/competitor-analysis/report-template.js";
import type { CompetitorData } from "../src/trigger/competitor-analysis/types.js";

const COMPETITORS = [
  "Midjourney",
  "DALL-E OpenAI",
  "Stable Diffusion Stability AI",
  "Canva AI",
  "Ideogram",
  "Runway",
  "Leonardo AI",
  "Adobe Firefly",
];

async function savePdf(html: string, outputPath: string): Promise<void> {
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log("=== Adobe Firefly — Generating Competitor Report ===\n");

  // 1. Scrape all competitors
  const allData: CompetitorData[] = [];
  for (const name of COMPETITORS) {
    process.stdout.write(`  Scraping ${name}...`);
    const [redditPosts, youtubeVideos, webResults] = await Promise.all([
      scrapeReddit(name).catch(() => []),
      scrapeYouTube(name).catch(() => []),
      searchWeb(name).catch(() => []),
    ]);
    allData.push({ name, redditPosts, youtubeVideos, webResults });
    console.log(` reddit=${redditPosts.length} web=${webResults.length}`);
  }

  // 2. Analyse with Claude Haiku
  console.log("\n  Running AI analysis...");
  const report = await analyzeCompetitors(allData);

  // 3. Render HTML
  const generatedAt = new Date().toISOString();
  const html = generateHtml(report, generatedAt);

  // 4. Convert to PDF and save to Desktop
  const label = generatedAt.slice(0, 7); // YYYY-MM
  const filename = `Adobe-Firefly-Report-${label}.pdf`;
  const outputPath = join(homedir(), "Desktop", filename);

  console.log("  Generating PDF...");
  await savePdf(html, outputPath);

  console.log(`\n✅  Saved to: ${outputPath}`);
}

main().catch((err) => {
  console.error("\n❌ ", err instanceof Error ? err.message : err);
  process.exit(1);
});
