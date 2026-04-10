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
| Input | Source | Where stored |
|---|---|---|
| Brave Search API key | api.search.brave.com | `.env → BRAVE_API_KEY` |
| Anthropic API key | console.anthropic.com | `.env → ANTHROPIC_API_KEY` |
| YouTube API key (optional) | Google Cloud Console | `.env → YOUTUBE_API_KEY` |

## Tools Used (in order)
1. `src/trigger/competitor-analysis/reddit.ts` — scrape Reddit (public JSON API, no key needed)
2. `src/trigger/competitor-analysis/youtube.ts` — scrape YouTube (optional, needs key)
3. `src/trigger/competitor-analysis/web-search.ts` — Brave Search for news + Twitter mentions
4. `src/trigger/competitor-analysis/analyzer.ts` — Claude Haiku synthesizes all data
5. `src/trigger/competitor-analysis/report-template.ts` — generates Adobe-branded HTML
6. `scripts/save-report.ts` — puppeteer converts HTML → PDF → saves to `~/Desktop/`

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
| Item | Cost |
|---|---|
| Reddit API | $0.00 |
| Brave Search (~14 queries) | $0.00 (free tier: 2K/month) |
| Claude Haiku (~8K tokens total) | ~$0.003 |
| PDF generation | $0.00 |
| **Total** | **~$0.003** |

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
