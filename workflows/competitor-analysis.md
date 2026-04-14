# Workflow: Adobe Firefly Competitor Analysis

## Objective
Generate a branded Adobe PDF report analyzing how competitors to Adobe Firefly sell AI image generation credit packs — surfacing what's working for them, key differentiators Adobe should amplify, and actionable PM recommendations.

## Frequency
Manual — run on demand via `npm run test-run` then `npm run save-report`

## Competitors Tracked
- Midjourney
- DALL-E / OpenAI
- Stable Diffusion / Stability AI
- Canva AI
- Ideogram
- Runway
- Leonardo AI
- Adobe Firefly (benchmarked for sentiment)

## Required Inputs
| Input | Source | Where stored | Free tier |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com | `.env` | $5 credit on signup |
| `BRAVE_API_KEY` | api.search.brave.com | `.env` | 2,000 queries/month |
| `YOUTUBE_API_KEY` | console.cloud.google.com → YouTube Data API v3 | `.env` | 10,000 units/day |
| `TWITTER_BEARER_TOKEN` | developer.twitter.com → Create App → Keys & Tokens | `.env` | 1M tweet reads/month (Basic) |

## Data Sources — What Each API Captures

### Reddit (public JSON API — no key required)
**Endpoint:** `reddit.com/search.json?q={competitor}+credits+pricing&sort=top`
**What it captures:** Community sentiment, pricing complaints, feature requests, "switched to" threads, competitor recommendations in relevant subreddits
**Key subreddits:** r/Adobe, r/software, r/graphic_design, r/Entrepreneur, r/smallbusiness, r/shopify
**Signal types:** Organic user opinions — highest trust, lowest noise of all sources
**Query pattern per competitor:** `"{competitor} pricing"`, `"{competitor} vs adobe"`, `"{competitor} cancel"`, `"{competitor} alternative"`
**Rate limit:** No hard limit on public JSON API; add 1-second delay between requests; include `User-Agent` header

### YouTube Data API v3
**Endpoint:** `youtube.googleapis.com/youtube/v3/search?q={competitor}+review&type=video&order=date`
**What it captures:** Recent review videos, tutorial trends, feature comparison videos, creator sentiment and recommendation patterns
**Signal types:** Leading indicator of market perception — YouTube tutorials predict tool adoption 2–3 months ahead
**Query pattern per competitor:** `"{competitor} review 2026"`, `"{competitor} tutorial"`, `"{competitor} vs adobe firefly"`, `"best {category} tool 2026"`
**Rate limit:** 10,000 units/day free; each search costs 100 units (~100 searches/day free); cache results aggressively

### Brave Search API
**Endpoint:** `api.search.brave.com/res/v1/web/search?q={query}`
**What it captures:** Live web results — competitor pricing pages, news articles, comparison landing pages, press releases, G2/Capterra reviews
**Signal types:** Real-time pricing and messaging changes; first signal of a competitor launch or price change
**Query pattern per competitor:** `"{competitor} pricing {year}"`, `"{competitor} vs adobe site:{competitor}.com"`, `"{competitor} news 2026"`, `"adobe {product} alternative"`
**Rate limit:** 2,000 queries/month free (~14 queries/report; supports ~142 reports/month on free tier)

### Twitter/X API (Bearer Token)
**Endpoint:** `api.twitter.com/2/tweets/search/recent?query={competitor}&max_results=10`
**What it captures:** Real-time competitor announcements, pricing change tweets, user complaints, launch announcements — earliest signal source of all four
**Signal types:** Breaking changes (competitors announce on X before any other channel); high-follower account sentiment; trending complaints
**Query pattern per competitor:** `"{competitor} pricing"`, `"from:{competitor_account} launch"`, `"{competitor} vs adobe"`, `"@{competitor_handle} cancel"`
**Rate limit:** 1M tweet reads/month on Basic tier; 15-minute rate limit window; use `next_token` pagination

## Tools Used (in order)
1. `src/trigger/competitor-analysis/reddit.ts` — Reddit public JSON API (no key); community sentiment per competitor
2. `src/trigger/competitor-analysis/youtube.ts` — YouTube Data API v3; recent review videos and tutorials
3. `src/trigger/competitor-analysis/web-search.ts` — Brave Search API; live pricing pages, news, comparison articles
4. `src/trigger/competitor-analysis/twitter.ts` — Twitter/X API v2; real-time announcements and sentiment *(Phase 2 — bearer token required)*
5. `src/trigger/competitor-analysis/analyzer.ts` — Claude Haiku synthesizes all source data into structured JSON
6. `src/trigger/competitor-analysis/report-template.ts` — generates Adobe-branded HTML from JSON
7. `scripts/save-report.ts` — Puppeteer converts HTML → PDF → saves to `~/Desktop/`

## How to Run

### Option A — Full local test (recommended first)
```bash
npm run test-run
```
Runs the entire pipeline locally. Outputs analysis to terminal. No PDF generated.

### Option B — Generate the PDF
```bash
npm run save-report
```
Fetches the latest completed Trigger.dev run output and saves a branded PDF to `~/Desktop/Adobe-Competitor-Report-YYYY-MM.pdf`.

## Expected Output
A 3–4 page branded PDF containing:
1. Executive Summary (5 bullets)
2. Credit Pack Pricing Matrix (table — all 7 competitors)
3. Adobe Firefly Strengths to Amplify (4–5 bullets)
4. Strategic Recommendations (5 numbered action items)

## Cost Per Run
| Source | Queries/run | Cost | Free tier limit |
|---|---|---|---|
| Reddit public JSON API | ~8 queries | $0.00 | No limit (rate-limited) |
| YouTube Data API v3 | ~7 searches (700 units) | $0.00 | 10,000 units/day |
| Brave Search API | ~14 queries | $0.00 | 2,000 queries/month |
| Twitter/X API (Basic) | ~8 queries | $0.00 | 1M reads/month |
| Claude Haiku analysis (~8K tokens) | 1 call | ~$0.003 | Pay per use |
| PDF generation (Puppeteer) | 1 render | $0.00 | Free (local) |
| **Total per report** | | **~$0.003** | |

## Edge Cases & Known Behaviour
- **No Anthropic key**: pipeline runs but analysis section returns placeholder text. Add key and re-run.
- **YouTube key missing**: YouTube scraper returns empty array gracefully. Report is generated without YouTube data.
- **Reddit rate limit**: 1-second delay between requests is built in. If rate limited, wait 60 seconds and retry.
- **Brave API 429**: free tier is 2K queries/month (~14 used per report). If quota exceeded, Brave returns 429 — reduce queries in `web-search.ts` or upgrade tier.
- **Claude malformed JSON**: `analyzer.ts` strips markdown code fences before parsing. If still failing, check for truncated output and increase `max_tokens`.

## Lessons Learned
- Reddit public JSON API works without auth but requires `User-Agent` header — include it on every request
- `--env-file=.env` flag in `tsx` reads env vars before imports; put `dotenv` config at very top of scripts to avoid race conditions
- Claude Haiku response sometimes wraps JSON in ```json ... ``` fences — always strip before `JSON.parse`
