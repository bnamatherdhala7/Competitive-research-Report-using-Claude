import type { RedditPost } from "./types.js";

// Rate limit: 1 req/sec per Reddit guidelines. We make 1 request per competitor.
const DELAY_MS = 1200;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function scrapeReddit(competitor: string): Promise<RedditPost[]> {
  await sleep(DELAY_MS);

  const query = `${competitor} AI credits pricing`;
  const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=top&t=month&limit=3`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "AdobeFireflyResearch/1.0" },
    });
    if (!res.ok) return [];

    const data = (await res.json()) as {
      data: { children: { data: Record<string, unknown> }[] };
    };

    return (data.data?.children ?? []).slice(0, 3).map((c) => {
      const p = c.data;
      return {
        title: String(p.title ?? "").slice(0, 100),
        subreddit: String(p.subreddit ?? ""),
        score: Number(p.score ?? 0),
        url: `https://reddit.com${String(p.permalink ?? "")}`,
        snippet: String(p.selftext ?? p.title ?? "").slice(0, 150),
      };
    });
  } catch {
    return [];
  }
}
