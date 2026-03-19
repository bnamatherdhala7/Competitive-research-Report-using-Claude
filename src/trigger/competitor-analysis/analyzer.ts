import Anthropic from "@anthropic-ai/sdk";
import type { CompetitorData, AnalysisReport } from "./types.js";

// Token budget: ~6K input / 1,500 output max → < $0.005 per run with claude-haiku
const MAX_INPUT_CHARS = 18000; // ~4,500 tokens — safe under 6K with prompt overhead
const MAX_OUTPUT_TOKENS = 3000;

function buildDataSummary(allData: CompetitorData[]): string {
  const lines: string[] = [];

  for (const c of allData) {
    lines.push(`\n## ${c.name}`);

    if (c.redditPosts.length > 0) {
      lines.push("Reddit:");
      for (const p of c.redditPosts) {
        lines.push(`  - [${p.score}⬆] ${p.title} | ${p.snippet}`);
      }
    }

    if (c.youtubeVideos.length > 0) {
      lines.push("YouTube:");
      for (const v of c.youtubeVideos) {
        lines.push(`  - "${v.title}" by ${v.channel}`);
      }
    }

    if (c.webResults.length > 0) {
      lines.push("Web:");
      for (const w of c.webResults) {
        lines.push(`  - ${w.title}: ${w.snippet}`);
      }
    }
  }

  const full = lines.join("\n");
  // Hard cap — truncate if over budget
  return full.slice(0, MAX_INPUT_CHARS);
}

const SYSTEM_PROMPT = `You are a senior Product Manager at Adobe. Analyze competitor data for Adobe Firefly and its Credit Pack pricing model. Be concise and specific — every sentence must be actionable.`;

const USER_PROMPT_TEMPLATE = (dataSummary: string) => `
Research data from the past month (Reddit, YouTube, web) for Adobe Firefly competitors:
${dataSummary}

Return ONLY valid JSON matching this exact shape — no markdown, no extra text:
{
  "executiveSummary": ["5 short bullet points on key competitive dynamics"],
  "creditPackAnalysis": [
    {
      "competitor": "name",
      "model": "subscription|credits|hybrid",
      "freeTier": "what is free",
      "paidEntry": "cheapest paid plan",
      "sentiment": "1 sentence on community view of their pricing"
    }
  ],
  "adobeStrengths": ["5 Adobe Firefly advantages we should be marketing harder to drive credit pack sales"],
  "recommendations": ["5 specific actions the Adobe Firefly PM should take this month"]
}
`.trim();

function placeholderReport(allData: CompetitorData[]): AnalysisReport {
  const names = allData.filter((d) => d.name !== "Adobe Firefly").map((d) => d.name);
  return {
    executiveSummary: [
      "⚠️  ANTHROPIC_API_KEY not set — this is a data-collection test run only.",
      `Scraped data for ${allData.length} competitors: ${names.join(", ")}.`,
      "Reddit, YouTube, and web results collected successfully.",
      "Add ANTHROPIC_API_KEY to .env to enable AI analysis.",
      "Re-run after adding the key to get the full report.",
    ],
    creditPackAnalysis: names.map((n) => ({
      competitor: n,
      model: "— pending AI analysis —",
      freeTier: "—",
      paidEntry: "—",
      sentiment: "—",
    })),
    adobeStrengths: ["Add ANTHROPIC_API_KEY to generate this section."],
    recommendations: ["Add ANTHROPIC_API_KEY to generate this section."],
  };
}

export async function analyzeCompetitors(
  allData: CompetitorData[]
): Promise<AnalysisReport> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return placeholderReport(allData);

  const client = new Anthropic({ apiKey });
  const dataSummary = buildDataSummary(allData);

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: MAX_OUTPUT_TOKENS,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: USER_PROMPT_TEMPLATE(dataSummary) }],
  });

  const raw = message.content[0];
  if (raw.type !== "text") throw new Error("Unexpected response type from Claude");

  // Strip any accidental markdown fences
  const jsonText = raw.text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  return JSON.parse(jsonText) as AnalysisReport;
}
