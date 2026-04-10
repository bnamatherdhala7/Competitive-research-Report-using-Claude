# Adobe Firefly — Competitive Intelligence Automation

> **Every month, this system automatically researches 7 competitors, analyzes how they sell AI credits, and delivers a branded Adobe PDF report to your Desktop. Cost: $0.003. Time: 30 seconds.**

---

## The Problem It Solves

Keeping up with competitors like Midjourney, DALL-E, and Canva AI requires manually browsing Reddit threads, watching YouTube reviews, and reading tech news — every single month. That takes 3–5 hours of focused research time, and it's easy to miss things.

This automation does all of that for you, automatically.

---

## What It Does

Every time you run it, the system:

1. **Searches Reddit** for what real users are saying about each competitor's pricing, credits, and features
2. **Searches the web** for recent news, pricing page changes, and press coverage
3. **Searches YouTube** for review videos and tutorials about each competitor
4. **Reads all of that with AI** and pulls out the most important insights
5. **Writes a report** — in plain English — with specific recommendations for the Adobe Firefly team
6. **Saves a branded Adobe PDF** directly to your Desktop, ready to share

---

## Competitors Tracked

| Competitor | What's monitored |
|---|---|
| Midjourney | Credit packs, pricing tiers, community sentiment |
| DALL-E / OpenAI | API pricing, consumer product, positioning |
| Stable Diffusion / Stability AI | Open source vs. paid model, credit system |
| Canva AI | Bundled AI credits, design-first positioning |
| Ideogram | Free tier strategy, typography focus |
| Runway | Video + image credits, Pro tier |
| Leonardo AI | Token model, free tier generosity |
| **Adobe Firefly** | Community perception, credit pack sentiment |

---

## What the Report Looks Like

The PDF includes:

- **Executive Summary** — 5 bullets on the biggest findings this month
- **Credit Pack Pricing Matrix** — side-by-side comparison of how every competitor prices their AI credits
- **Adobe Firefly Strengths to Amplify** — things Adobe already does well that aren't being marketed strongly enough
- **Strategic Recommendations** — 5 specific actions the PM team can take this month

The report is branded in Adobe red and white and is ready to drop into a presentation or share in Slack.

---

## How to Run It

### Step 1 — Run the analysis
```bash
npm run test-run
```
This scrapes all 7 competitors and runs the AI analysis. You'll see results in the terminal in about 30–60 seconds.

### Step 2 — Save the PDF
```bash
npm run save-report
```
This converts the report into a branded Adobe PDF and saves it to your Desktop as `Adobe-Competitor-Report-YYYY-MM.pdf`.

That's it.

---

## What It Costs

| Item | Cost |
|---|---|
| Reddit research | Free |
| Web search (Brave) | Free |
| YouTube research | Free |
| AI analysis (Claude Haiku) | ~$0.003 |
| PDF generation | Free |
| **Total per report** | **~$0.003** |

For comparison: a freelance analyst charges $50–200/hour. This report costs less than a paperclip.

---

## How It's Built (Non-Technical Version)

Think of it as three layers:

```
WORKFLOWS  →  What to do and in what order (plain English instructions)
   ↓
AGENT      →  Claude AI reads the workflows and coordinates everything
   ↓
TOOLS      →  TypeScript scripts that do the actual work (scraping, analysis, PDF)
```

No magic. Just structured automation where AI handles the reasoning and code handles the execution.

---

## Setup (One Time)

You need three free API keys:

| Key | Where to get it | Cost |
|---|---|---|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) | New accounts get $5 free |
| `BRAVE_API_KEY` | [api.search.brave.com](https://api.search.brave.com) | Free (2,000 searches/month) |
| `YOUTUBE_API_KEY` | [Google Cloud Console](https://console.cloud.google.com) | Free (10,000 units/day) |

Add them to a `.env` file in the project root:
```
ANTHROPIC_API_KEY=your-key-here
BRAVE_API_KEY=your-key-here
YOUTUBE_API_KEY=your-key-here
```

Then install dependencies:
```bash
npm install
```

You're ready.

---

## Project Structure

```
workflows/                    ← Plain English instructions for each automation
  competitor-analysis.md      ← The SOP for this workflow

src/trigger/                  ← The code that runs in the cloud
  competitor-analysis/        ← All scraping and analysis logic

scripts/                      ← Tools you run locally
  test-run.ts                 ← Run the full pipeline and see results
  save-report.ts              ← Save the latest report as a PDF

docs/
  PRD-competitor-intelligence.md   ← Full product requirements document
  DEMO-GUIDE.md                    ← How to demo this to your team
```

---

## What's Next

- [ ] Automatic Google Drive upload so the report is shareable via link
- [ ] Monthly Slack summary posted to your team channel automatically  
- [ ] Trend tracking — compare this month vs. last month, flag changes
- [ ] Twitter/X data (requires paid X API)

---

## Questions?

Open an issue on GitHub or reach out to the repo owner.

Built with [Claude Code](https://claude.ai/code) · Powered by [Trigger.dev](https://trigger.dev) · AI by [Anthropic](https://anthropic.com)
