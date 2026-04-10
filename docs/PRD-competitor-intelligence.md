# PRD: Adobe Firefly Competitive Intelligence Automation

**Status**: Active  
**Version**: 1.0  
**Last Updated**: April 2026

---

## 1. Summary

This document describes an automated system that monitors seven AI image generation competitors every month, analyzes how they sell their credit packs and what features they highlight, and delivers a branded Adobe PDF report with specific recommendations for the Adobe Firefly PM team. The system replaces 3–5 hours of manual research with a 30-second automated run costing less than one cent.

---

## 2. Contacts

| Name | Role | Responsibility |
|---|---|---|
| Bharat Namatherdhala | Adobe Firefly PM (Owner) | Requirements, approvals, report consumer |
| Claude Sonnet 4.6 | AI Agent (Builder) | Code, automation, ongoing maintenance |

---

## 3. Background

### What is this?

Adobe Firefly competes in a fast-moving AI image generation market. Competitors like Midjourney, DALL-E, Canva AI, Stable Diffusion, Ideogram, Runway, and Leonardo AI change their pricing, add new features, and shift their messaging constantly. Keeping up requires manually browsing Reddit, YouTube, and dozens of news sources every month.

### Why now?

Three things became possible at once:
1. **Free API access to Reddit and web search** — Reddit's public API and Brave Search's free tier allow structured data collection at no cost
2. **Cheap AI analysis** — Claude Haiku (Anthropic's smallest model) can synthesize competitive intelligence for less than half a cent per report
3. **Reliable automation infrastructure** — Trigger.dev allows code to run on a schedule in the cloud without any server setup

### The status quo problem

A manual competitive analysis takes 3–5 hours. Done monthly, that's 36–60 hours per year on a single recurring task. The research is also inconsistent — what gets checked depends on who has time and what they happen to find.

---

## 4. Objective

### Goal

Give the Adobe Firefly PM team reliable, structured competitive intelligence every month — without manual effort — so they can make faster, better-informed decisions about credit pack pricing, feature prioritization, and marketing positioning.

### Why it matters

- **For the PM**: Reclaims 3–5 hours/month. Gets structured data instead of ad-hoc research.
- **For Adobe**: Faster response to competitor moves. Clearer differentiation strategy. Better credit pack positioning.
- **Strategic alignment**: Directly supports Adobe Firefly's goal of growing generative credit revenue by helping PMs identify gaps competitors are exploiting and strengths Adobe underutilizes.

### Key Results (SMART)

| # | Key Result | How Measured | Target |
|---|---|---|---|
| KR1 | Monthly report generated without manual effort | Report exists in `~/Desktop/` by the 2nd of each month | 12/12 months |
| KR2 | Report covers all 7 competitors across 3 data sources | Scraper output logs show > 0 results per competitor | Every run |
| KR3 | Cost per report stays under $0.05 | Anthropic API bill divided by reports generated | Monthly check |
| KR4 | PM uses at least 1 recommendation per quarter | Self-reported in quarterly review | 4/4 quarters |

---

## 5. Market Segment

### Primary user

**Adobe Firefly Product Manager** — someone who:
- Needs to understand competitor moves to make product and pricing decisions
- Has limited time for manual research
- Wants structured, consistent output rather than ad-hoc findings
- Does not need to understand how the automation works — just that it works

### Constraints

- Output must be readable without technical knowledge
- Report must be in PDF format (shareable in meetings, Slack, email)
- Must use Adobe brand standards (red `#EB1000`, clean typography)
- Total cost must stay under $0.50 per report
- No vendor lock-in — all APIs used have free tiers or are open

---

## 6. Value Proposition

### Jobs being done

| Job | Current solution | Pain |
|---|---|---|
| Stay current on competitor pricing | Manual browsing 1–2x/month | Inconsistent, time-consuming, easy to miss changes |
| Understand community sentiment | Manually reading Reddit threads | No structure, sampling bias |
| Identify Adobe Firefly strengths to market | Internal knowledge + gut feel | Missing external signal from actual users |
| Prepare for leadership strategy reviews | Ad-hoc slides | Takes hours to compile, often stale by the time it's done |

### Gains

- **Time back**: 3–5 hours reclaimed every month
- **Consistency**: Same 7 competitors checked, same 3 sources, same report structure — every time
- **Specificity**: Report is scoped to credit packs and Firefly models — not generic AI news
- **Actionability**: Every report ends with numbered PM recommendations, not just raw data

### Pains avoided

- Missing a competitor pricing change that happened mid-month
- Spending an afternoon on research the week before a strategy review
- Making pricing decisions based on stale or incomplete data

### Why better than alternatives

| Alternative | Why this is better |
|---|---|
| Manual research | 1000x faster, more consistent, costs less than a coffee |
| Hiring an analyst | $0.003 vs $50–200/hour |
| Generic market research tools | Scoped specifically to Firefly's credit pack question, not a generic market overview |
| Setting Google Alerts | No synthesis — just raw links, no PDF, no recommendations |

---

## 7. Solution

### 7.1 User Flow

```
PM runs: npm run test-run
         ↓
System scrapes Reddit + YouTube + Web for all 7 competitors
(~30 seconds)
         ↓
Claude Haiku analyzes the data and generates structured insights
(~10 seconds)
         ↓
PM runs: npm run save-report
         ↓
Adobe-branded PDF appears on Desktop
         ↓
PM reads report, shares with team, acts on recommendations
```

### 7.2 Key Features

**F1 — Multi-source scraping**
Pulls data from three sources per competitor:
- Reddit public API (top posts mentioning credits, pricing, vs. Adobe)
- YouTube Data API v3 (recent review videos and tutorials)
- Brave Search API (news, pricing page changes, press)

**F2 — AI-powered synthesis**
Claude Haiku (Anthropic's lowest-cost model) receives all scraped data and returns a structured JSON report covering:
- Executive summary (5 bullets)
- Credit pack pricing matrix per competitor
- Adobe Firefly strengths to amplify
- Numbered PM recommendations

**F3 — Branded PDF output**
Puppeteer renders an HTML template using Adobe brand colors (red `#EB1000`, dark greys) and saves a 3–4 page PDF to `~/Desktop/`. No design tool required.

**F4 — Graceful degradation**
If any single API fails (YouTube quota, Brave 429, etc.), the report still generates with whatever data is available. Missing sources are noted in the output — the run never fully crashes.

**F5 — Cost guardrails**
Claude Haiku input is hard-capped at 6,000 tokens per run. Data per competitor is truncated to 3 Reddit posts, 3 YouTube videos, 5 web results. Cost stays under $0.01/report regardless of how much data is scraped.

### 7.3 Technology

| Component | Technology | Why |
|---|---|---|
| Automation runtime | Trigger.dev (TypeScript) | Serverless, handles scheduling, logging, retries |
| Reddit data | Reddit public JSON API | Free, no API key required |
| Web/news search | Brave Search API | Free tier (2,000 queries/month), reliable |
| YouTube data | YouTube Data API v3 | Free (10,000 units/day), structured video metadata |
| AI analysis | Anthropic Claude Haiku | Cheapest capable model — $0.25/1M tokens |
| PDF generation | Puppeteer | HTML → PDF, full CSS control for branding |
| Language | TypeScript | Type safety, single language across the stack |

### 7.4 Assumptions

| # | Assumption | Risk if wrong |
|---|---|---|
| A1 | Reddit public API remains free and accessible | Medium — fallback: use Brave to search Reddit |
| A2 | Brave Search free tier (2K queries/month) is sufficient | Low — 14 queries/report, 142 reports possible per month |
| A3 | Claude Haiku returns valid JSON in every run | Medium — handled by JSON extraction with fallback parsing |
| A4 | Competitor credit pack info is publicly discussable on Reddit/YouTube | Low — these are public products with active communities |
| A5 | PM will run the script manually each month | Medium — could add a local cron job for full automation |

---

## 8. Release

### Version 1.0 — Current (Done)
- ✅ Reddit + Brave scraping for all 7 competitors
- ✅ Claude Haiku analysis with structured JSON output
- ✅ Adobe-branded PDF saved to Desktop
- ✅ Local test runner (`npm run test-run`)
- ✅ WAT framework CLAUDE.md + workflow SOP
- ✅ GitHub repo: [github.com/bnamatherdhala7/Competitive-research-Report-using-Claude](https://github.com/bnamatherdhala7/Competitive-research-Report-using-Claude)

### Version 1.1 — Near term
- [ ] YouTube scraper active (requires YouTube Data API key from Google Cloud)
- [ ] PDF auto-saved to Google Drive (shareable link in Slack)
- [ ] Email delivery via Resend (report lands in inbox automatically)

### Version 2.0 — Future
- [ ] Trend tracking — compare this month's report to last month's, flag changes
- [ ] Slack bot — post executive summary to a Slack channel automatically
- [ ] Expand to Twitter/X data (requires paid X API tier)
- [ ] Dashboard — web UI showing report history and trend charts
