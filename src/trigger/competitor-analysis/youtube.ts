import type { YouTubeVideo } from "./types.js";

// YouTube Data API v3 — each search costs 100 units. Free quota: 10,000/day.
// We make 1 search per competitor (8 total = 800 units, well within limits).

export async function scrapeYouTube(competitor: string): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return []; // skip gracefully if key not configured yet

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const query = `${competitor} AI image generator credits pricing`;
  const params = new URLSearchParams({
    part: "snippet",
    q: query,
    type: "video",
    order: "relevance",
    publishedAfter: oneMonthAgo.toISOString(),
    maxResults: "3",
    key: apiKey,
  });

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params}`
    );
    if (!res.ok) return [];

    const data = (await res.json()) as {
      items: {
        id: { videoId: string };
        snippet: {
          title: string;
          channelTitle: string;
          publishedAt: string;
        };
      }[];
    };

    return (data.items ?? []).slice(0, 3).map((item) => ({
      title: item.snippet.title.slice(0, 100),
      channel: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      videoId: item.id.videoId,
    }));
  } catch {
    return [];
  }
}
