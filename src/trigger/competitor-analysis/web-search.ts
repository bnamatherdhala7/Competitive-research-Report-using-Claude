import type { WebResult } from "./types.js";

// Brave Search API — free tier: 2,000 queries/month.
// We make 1 query per competitor (8 total = 8 queries, well within limits).

export async function searchWeb(competitor: string): Promise<WebResult[]> {
  const apiKey = process.env.BRAVE_API_KEY;
  if (!apiKey) throw new Error("BRAVE_API_KEY is not set");

  const query = `${competitor} AI image generator credit pack pricing 2025`;
  const params = new URLSearchParams({ q: query, count: "5" });

  try {
    const res = await fetch(
      `https://api.search.brave.com/res/v1/web/search?${params}`,
      {
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
          "X-Subscription-Token": apiKey,
        },
      }
    );
    if (!res.ok) return [];

    const data = (await res.json()) as {
      web?: { results: { title: string; url: string; description: string }[] };
    };

    return (data.web?.results ?? []).slice(0, 5).map((r) => ({
      title: r.title.slice(0, 100),
      url: r.url,
      snippet: (r.description ?? "").slice(0, 120),
    }));
  } catch {
    return [];
  }
}
