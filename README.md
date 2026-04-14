# Adobe Competitive Intelligence — Powered by Claude

> **This system generates branded, acquisition-focused competitive intelligence PDFs for Adobe product teams in under 60 seconds. Cost per report: $0.003–$0.15. No analyst required.**

**Live reports →** [competitive-research-report-using-c.vercel.app](https://competitive-research-report-using-c.vercel.app)

---

## Available Reports

| Report | Focus | PDF |
|---|---|---|
| **Adobe Acrobat Acquisition Playbook** | Pricing vs Foxit/UPDF/M365 · Battlecards · SEO gaps · GEO positions · PLG Now/3M/6M | [Download](https://competitive-research-report-using-c.vercel.app/Adobe-Acrobat-Acquisition-Playbook-2026-04.pdf) |
| **Adobe Express Acquisition Playbook** | vs Canva/M365 · Firefly Safe enterprise pitch · Viral share loop · ChatGPT plugin · GEO | [Download](https://competitive-research-report-using-c.vercel.app/Adobe-Express-Acquisition-Playbook-2026-04.pdf) |
| **Remove Background Keyword Playbook** | 18M search keyword · #6 → #1 SEO sprint · Shopify app GTM · Developer API roadmap | [Download](https://competitive-research-report-using-c.vercel.app/Adobe-Remove-Background-Playbook-2026-04.pdf) |

Each report includes: **TL;DR → Real user quotes (Reddit/G2/FTC) → 3rd-party intelligence guide → SEO gaps table → GEO positions in ChatGPT/Perplexity → Competitive landscape → Pricing table → Competitor messaging → 3 Battlecards → PLG Now/3M/6M → Acquisition metrics dashboard**

---

## The Problem This Solves

Keeping up with competitors requires manually browsing Reddit, YouTube, G2, pricing pages, and news — every month. That's 3–5 hours of inconsistent research per report, per product.

This system replaces that with a single command. It researches the same sources a PM would, synthesizes findings with Claude, and outputs a structured PDF with specific acquisition recommendations — in 30–60 seconds.

**One command. One PDF. Less than a penny.**

---

## How a Report Is Generated — Full Pipeline

```
You type: "generate acquisition playbook for Adobe Acrobat"
              ↓
   Claude reads CLAUDE.md + workflow SOP
   (decides what to research, what sections to write)
              ↓
   Brave Search API (live web research)
   ├── "Adobe Acrobat pricing 2026"
   ├── "Foxit PDF Editor pricing 2026"
   ├── "Adobe Acrobat review reddit"
   ├── "Adobe Acrobat alternative"
   └── Returns: live results from competitor sites, G2, forums
              ↓
   Claude Sonnet synthesizes findings → writes 13-section markdown
   (pricing tables · battlecards · SEO gaps · GEO analysis · PLG motions)
              ↓
   md-to-pdf.ts runs (Puppeteer + inline CSS, no external fonts)
   → Parses markdown → builds HTML with Adobe branding
   → Headless Chrome renders → saves A4 PDF
              ↓
   Adobe-Acrobat-Acquisition-Playbook-2026-04.pdf
   appears on your Desktop
```

**APIs used per report:**

| API | Purpose | Cost |
|---|---|---|
| Brave Search API | Live competitor pricing, Reddit threads, news | Free (2K queries/mo) |
| Anthropic Claude Sonnet | Research synthesis + full report writing | ~$0.10–0.15/report |
| Puppeteer (headless Chrome) | Markdown → Adobe-branded PDF | Free (local) |

For the automated Firefly pipeline (Trigger.dev): Reddit public JSON + YouTube Data API v3 + Brave + Claude Haiku = **$0.003/report**.

---

## Using This in Your Claude Account

You can run this competitive intelligence system in your own Claude account without any coding. Here's how:

### Option 1 — Ask Claude directly (no setup required)

Open Claude at [claude.ai](https://claude.ai) and paste this prompt:

```
You are a competitive intelligence analyst for Adobe. I need a focused
acquisition playbook for [product name — e.g., Adobe Acrobat / Adobe Express
/ Adobe Firefly]. Cover:

(1) TL;DR in 2–3 sentences
(2) Pricing comparison table vs top 5–6 competitors with real prices
(3) Competitor website messaging and positioning
(4) Top churn triggers with rank
(5) Win signals
(6) 3 battlecards (win move + lose scenario for each major competitor)
(7) PLG acquisition strategy with Now/3M/6M moves — each move must name
    the competitor it counters, what to build, and what metric to track
(8) PLG metrics dashboard table with current estimates and 6-month targets

Use web search to verify current pricing before writing.
```

Claude will produce the same quality of analysis as these reports, on demand, for any product.

---

### Option 2 — Use Claude Code (generates PDF automatically)

If your team uses Claude Code (the terminal AI), run the full automated pipeline:

```bash
# 1. Clone the repo
git clone https://github.com/bnamatherdhala7/Competitive-research-Report-using-Claude

# 2. Install dependencies
npm install

# 3. Add your API keys to .env
# ANTHROPIC_API_KEY=your_key
# BRAVE_API_KEY=your_key

# 4. Run a competitive analysis on any product
npm run test-run

# 5. Generate the PDF report
npm run save-report
```

The system automatically researches Reddit, YouTube, and web sources, synthesizes findings with Claude, and outputs a formatted PDF — in under 60 seconds.

---

### Option 3 — Convert any markdown to a PDF

If you already have a competitive analysis in markdown, convert it to an Adobe-branded PDF:

```bash
npx tsx scripts/md-to-pdf.ts docs/your-report.md
```

The PDF appears on your Desktop with Adobe branding, section formatting, and print-ready A4 layout.

---

## Demo Walkthrough — 10 Minutes

Use this script to walk your team through the system live.

### Minute 0–2: The Problem
> "Every month, a PM needs to answer: what are competitors doing with pricing, features, and messaging? For Adobe, that means checking Foxit, UPDF, Canva, Midjourney, remove.bg, and a dozen others — manually. That's 3–5 hours of work per product, every month. And whoever does it checks different things, misses different things."
>
> "What if a complete acquisition playbook — pricing, battlecards, SEO gaps, and PLG recommendations — took 30 seconds and cost less than a penny?"

### Minute 2–5: Hit Run

Open terminal. Type and hit Enter:
```bash
npm run test-run
```

**As it runs, narrate what's happening:**
> "It's searching Brave for live competitor pricing right now... pulling Reddit discussions about Foxit vs Acrobat... checking what remove.bg changed on their pricing page this week... sending all of that to Claude for synthesis..."

### Minute 5–7: Show the PDF

Open one of the PDFs from the `docs/` folder. Walk through:

1. **TL;DR** — "Three sentences. The most important insight. This is what you'd share in a leadership sync."
2. **What Customers Are Saying** — "Real quotes from FTC complaint filings, Reddit threads, and G2 reviews — the same sources a PM would check manually."
3. **SEO Gaps Table** — "Adobe ranks #6 for 'remove background' — an 18M-search keyword — for a feature we give away free. This is a pure distribution problem, not a product problem."
4. **GEO Section** — "How Adobe appears in ChatGPT and Perplexity when users ask 'best PDF editor.' This is a new acquisition surface that didn't exist 12 months ago."
5. **Battlecards** — "Three ready-to-use sales battlecards. Each one has the win move, the trap to avoid, and when to stop competing."
6. **PLG Metrics Dashboard** — "Acquisition KPIs. Not vanity metrics — each row ties to a specific PLG motion in the report."

### Minute 7–9: The Numbers

> "Total cost: three-tenths of one cent. Run monthly for a year: four cents. The alternative is 60 hours of analyst time."
>
> "The real value is consistency. Same competitors, same structure, every month. No more stale data in strategy reviews."

### Minute 9–10: What's Next

> "This is one workflow. The same approach works for any recurring PM research task — win/loss analysis, customer interview synthesis, feature request triage, PRD drafts. The question isn't 'can we automate this.' It's 'which task do we automate next.'"

---

## Q&A Prep

**"Is the data accurate?"**
> "It pulls from real web search results — the same sources you'd check manually. The AI synthesizes patterns, but all source data is real. Real pricing pages, real Reddit threads, real G2 reviews. The report shows what queries were run."

**"What if a competitor isn't on Reddit?"**
> "Brave Search also pulls Twitter/X, news sites, and blog posts. Reddit is the richest signal for sentiment, but it's one of three sources. The report works well even when Reddit coverage is sparse."

**"Can it track more competitors?"**
> "Yes. Adding a competitor is one line of code — add their name to the list. The system handles the rest. The prompt in Option 1 works for any company name too — just swap in whoever you want."

**"What does it cost to run more often?"**
> "Three-tenths of a cent per automated run. You could run it daily for a year for about $1. The bottleneck isn't cost — it's how often the data meaningfully changes. Monthly is the right cadence for strategic decisions; weekly if a competitor just launched something."

**"Who maintains it?"**
> "Claude Code built it and can maintain it. Any change to the workflow — new competitors, new data sources, different report format, new sections — takes minutes. The CLAUDE.md file is the instruction set; changing it changes the system."

**"Is this safe? Where does the data go?"**
> "Everything runs locally or in Trigger.dev's cloud. No data is stored anywhere except the PDF on your Desktop. API keys are in a `.env` file that's never committed to GitHub. The scraping uses only public data — same as what you'd find by Googling."

**"Can non-technical PMs run this?"**
> "Option 1 above — asking Claude directly at claude.ai — requires zero setup and works for anyone with a Claude account. No terminal, no API keys, no installation. Claude.ai has web search built in."

**"How is this different from just asking ChatGPT?"**
> "Three things: (1) This system has a structured workflow SOP that produces a consistent 13-section output every time — ChatGPT gives you whatever it decides to write. (2) The PDF output is Adobe-branded and ready to share in a meeting. (3) The CLAUDE.md instructions encode hard-won decisions about what sections matter, what data to verify, and what makes a recommendation actionable — that context is baked in."

---

## What Each Report Contains

Every playbook follows this structure:

| Section | What it covers |
|---|---|
| TL;DR | 2–3 sentence summary — written last, specific not generic |
| What Customers Are Saying | 4–5 real quotes from Reddit, FTC filings, G2, and review sites |
| 3rd-Party Intelligence Guide | Exact Brave/Reddit/YouTube/Twitter queries to run for live monitoring |
| Market Overview | Bifurcation, key stats, urgent context |
| Competitive Landscape | Table of 6–8 competitors with strengths/weaknesses |
| Pricing Comparison | Real figures from live pricing pages, never estimated |
| Competitor Messaging | What each competitor says on their homepage — and Adobe's gap |
| SEO Acquisition Gaps | Keyword · monthly volume · Adobe's rank · who ranks #1 |
| GEO Positions | How Adobe appears in ChatGPT · Perplexity · Google AI Overviews |
| Win Signals | Why teams choose Adobe, ranked by frequency |
| Battlecards | 3 per report: win move + trap to avoid + lose scenario |
| PLG Acquisition Strategy | Now (0–30 days) · 3 months · 6 months |
| Acquisition Metrics Dashboard | 8 KPIs with current estimates and 6-month targets |

---

## What It Costs

| Mode | Per report | Monthly | Annual (12 reports) |
|---|---|---|---|
| Manual via Claude.ai (free) | $0 | $0 | $0 |
| Manual via Claude Code | ~$0.10–0.15 | ~$0.12 | ~$1.44 |
| Automated via Trigger.dev | ~$0.003 | ~$0.003 | ~$0.036 |

For comparison: a freelance analyst charges $50–200/hour for similar research. This system costs less than a paperclip per run.

---

## How It's Built

Three layers. AI handles reasoning; code handles execution.

```
LAYER 1 — WORKFLOWS  (workflows/*.md)
Plain English SOPs — what to research, what sections to write,
what makes a recommendation actionable.

LAYER 2 — AGENT  (Claude Sonnet / Haiku)
Reads the workflow, runs web searches, synthesizes findings,
writes the report. Handles the judgment calls.

LAYER 3 — TOOLS  (scripts/ + src/trigger/)
Deterministic code: Brave Search scraping, Reddit JSON API,
YouTube Data API, md-to-pdf.ts for PDF generation.
```

---

## Setup (One Time)

You need two API keys to run the full pipeline locally:

| Key | Where to get it | Cost |
|---|---|---|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) | New accounts get $5 free credit |
| `BRAVE_API_KEY` | [api.search.brave.com](https://api.search.brave.com) | Free (2,000 searches/month) |
| `YOUTUBE_API_KEY` | [console.cloud.google.com](https://console.cloud.google.com) | Free (10,000 units/day) |

```bash
# .env file (never commit this)
ANTHROPIC_API_KEY=your-key-here
BRAVE_API_KEY=your-key-here
YOUTUBE_API_KEY=your-key-here
```

```bash
npm install
npm run test-run      # scrape + analyze
npm run save-report   # generate PDF → Desktop
```

---

## Project Structure

```
workflows/
  competitor-analysis.md            ← Firefly automated pipeline SOP
  competitive-analysis-template.md  ← Universal template for any product

src/trigger/competitor-analysis/
  orchestrator.ts    ← Main task: coordinates all scrapers
  reddit.ts          ← Reddit public JSON API scraper
  youtube.ts         ← YouTube Data API v3 scraper
  web-search.ts      ← Brave Search API
  analyzer.ts        ← Claude Haiku analysis
  report-template.ts ← HTML report template

scripts/
  md-to-pdf.ts       ← Markdown → Adobe-branded PDF
  test-run.ts        ← Run full pipeline locally
  save-report.ts     ← Fetch latest run → PDF on Desktop

docs/
  Acrobat-Acquisition-Playbook.md       ← Markdown source
  Express-Acquisition-Playbook.md       ← Markdown source
  Remove-Background-Playbook.md         ← Markdown source
  Adobe-Acrobat-Acquisition-Playbook-2026-04.pdf
  Adobe-Express-Acquisition-Playbook-2026-04.pdf
  Adobe-Remove-Background-Playbook-2026-04.pdf
  DEMO-GUIDE.md      ← Full 10-minute demo script + Q&A prep
  PRD-competitive-intelligence.md  ← Full PRD: pipeline, API calls, phase roadmap

CLAUDE.md            ← Agent instructions — the brain of the system
.env                 ← API keys (never committed)
```

---

## Roadmap

| Phase | What | Status |
|---|---|---|
| **Phase 1** | Local generation — Claude Code + md-to-pdf · 3 playbooks live | ✅ Done |
| **Phase 2** | Slack delivery — monthly auto-post to `#competitive-intel` · on-demand `/competitive-intel [product]` slash command | 🔜 Next |
| **Phase 3** | Platform — trend tracking · dashboard · Linear ticket auto-creation from PLG recs · Notion/Confluence sync | 📋 Planned |

Full roadmap with API calls and MCP integrations: [docs/PRD-competitive-intelligence.md](docs/PRD-competitive-intelligence.md)

---

Built with [Claude Code](https://claude.ai/code) · Automated by [Trigger.dev](https://trigger.dev) · AI by [Anthropic](https://anthropic.com) · Search by [Brave](https://api.search.brave.com)
