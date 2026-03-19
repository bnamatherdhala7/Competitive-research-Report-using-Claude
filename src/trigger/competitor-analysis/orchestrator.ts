import { task, logger } from "@trigger.dev/sdk/v3";
import { scrapeReddit } from "./reddit.js";
import { scrapeYouTube } from "./youtube.js";
import { searchWeb } from "./web-search.js";
import { analyzeCompetitors } from "./analyzer.js";
import type { CompetitorData, RunOutput } from "./types.js";

const COMPETITORS = [
  "Midjourney",
  "DALL-E OpenAI",
  "Stable Diffusion Stability AI",
  "Canva AI",
  "Ideogram",
  "Runway",
  "Leonardo AI",
  "Adobe Firefly", // include own product to benchmark sentiment
];

export const competitorAnalysis = task({
  id: "competitor-analysis",
  run: async (_payload) => {
    logger.info("Starting competitor analysis", { competitors: COMPETITORS.length });

    const allData: CompetitorData[] = [];

    // Scrape sequentially to respect rate limits (Reddit: 1 req/sec)
    for (const name of COMPETITORS) {
      logger.info(`Scraping: ${name}`);

      const [redditPosts, youtubeVideos, webResults] = await Promise.all([
        scrapeReddit(name).catch((e) => {
          logger.warn(`Reddit failed for ${name}`, { error: String(e) });
          return [];
        }),
        scrapeYouTube(name).catch((e) => {
          logger.warn(`YouTube failed for ${name}`, { error: String(e) });
          return [];
        }),
        searchWeb(name).catch((e) => {
          logger.warn(`Brave search failed for ${name}`, { error: String(e) });
          return [];
        }),
      ]);

      allData.push({ name, redditPosts, youtubeVideos, webResults });

      logger.info(`Scraped ${name}`, {
        reddit: redditPosts.length,
        youtube: youtubeVideos.length,
        web: webResults.length,
      });
    }

    logger.info("Running AI analysis");
    const report = await analyzeCompetitors(allData);

    const output: RunOutput = {
      report,
      generatedAt: new Date().toISOString(),
    };

    logger.info("Analysis complete", {
      strengths: report.adobeStrengths.length,
      recommendations: report.recommendations.length,
    });

    return output;
  },
});
