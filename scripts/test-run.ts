/**
 * test-run.ts — runs the full pipeline locally without Trigger.dev
 * Usage: npm run test-run
 */

import { config } from "dotenv";
config(); // load .env before anything else

import { scrapeReddit } from "../src/trigger/competitor-analysis/reddit.js";
import { scrapeYouTube } from "../src/trigger/competitor-analysis/youtube.js";
import { searchWeb } from "../src/trigger/competitor-analysis/web-search.js";
import { analyzeCompetitors } from "../src/trigger/competitor-analysis/analyzer.js";
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

async function main() {
  console.log("=== Adobe Firefly Competitor Analysis — Test Run ===\n");

  const allData: CompetitorData[] = [];

  for (const name of COMPETITORS) {
    process.stdout.write(`Scraping: ${name} ...`);

    const [redditPosts, youtubeVideos, webResults] = await Promise.all([
      scrapeReddit(name).catch(() => []),
      scrapeYouTube(name).catch(() => []),
      searchWeb(name).catch(() => []),
    ]);

    allData.push({ name, redditPosts, youtubeVideos, webResults });

    console.log(
      ` reddit=${redditPosts.length}  youtube=${youtubeVideos.length}  web=${webResults.length}`
    );
  }

  console.log("\nRunning analysis...");
  const report = await analyzeCompetitors(allData);

  console.log("\n--- EXECUTIVE SUMMARY ---");
  report.executiveSummary.forEach((b) => console.log(" •", b));

  console.log("\n--- CREDIT PACK MATRIX ---");
  report.creditPackAnalysis.forEach((c) => {
    console.log(`\n  ${c.competitor}`);
    console.log(`    Model:      ${c.model}`);
    console.log(`    Free tier:  ${c.freeTier}`);
    console.log(`    Entry paid: ${c.paidEntry}`);
    console.log(`    Sentiment:  ${c.sentiment}`);
  });

  console.log("\n--- ADOBE STRENGTHS TO AMPLIFY ---");
  report.adobeStrengths.forEach((s) => console.log(" •", s));

  console.log("\n--- RECOMMENDATIONS ---");
  report.recommendations.forEach((r, i) => console.log(`  ${i + 1}. ${r}`));

  console.log("\n✅  Done.");
}

main().catch((err) => {
  console.error("\n❌ ", err instanceof Error ? err.message : err);
  process.exit(1);
});
