export interface RedditPost {
  title: string;
  subreddit: string;
  score: number;
  url: string;
  snippet: string; // max 150 chars
}

export interface YouTubeVideo {
  title: string;
  channel: string;
  publishedAt: string;
  videoId: string;
}

export interface WebResult {
  title: string;
  url: string;
  snippet: string; // max 120 chars
}

export interface CompetitorData {
  name: string;
  redditPosts: RedditPost[];
  youtubeVideos: YouTubeVideo[];
  webResults: WebResult[];
}

export interface CompetitorPricing {
  competitor: string;
  model: string;       // how they sell (subscription, credits, hybrid)
  freeTier: string;    // what's free
  paidEntry: string;   // cheapest paid option
  sentiment: string;   // community view on pricing
}

export interface AnalysisReport {
  executiveSummary: string[];          // 5 bullets
  creditPackAnalysis: CompetitorPricing[];
  adobeStrengths: string[];            // 5 bullets — what to market harder
  recommendations: string[];          // 5 actionable items for the PM
}

export interface RunOutput {
  report: AnalysisReport;
  generatedAt: string;
}
