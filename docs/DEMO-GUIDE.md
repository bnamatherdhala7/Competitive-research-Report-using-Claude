# Demo Guide: Adobe Competitive Intelligence — 5-Minute PM Demo

**Audience**: All PMs — no technical background required  
**Duration**: 5 minutes  
**Format**: Live (Zoom/in-person) or async (Loom)  
**Goal**: Show how Claude Code turns a 5-hour PM research task into a 30-second automated output — and explain how to use it yourself

---

## The Problem We're Solving

**What happens today:**  
A PM needs to answer "what are our competitors doing with pricing and messaging right now?" That means manually checking Reddit, Foxit's website, G2, YouTube, and news — for 6–8 competitors. It takes 3–5 hours. The output is a Notion doc that's stale within 30 days and reflects what one person happened to look at.

**What slips through:**  
- The FTC sued Adobe in June 2024 specifically over the cancellation ETF. By the time our team had context, it was already the #1 result when prospects searched "Adobe Acrobat review" — above the product itself. A competitive monitoring system would have flagged this the week it filed.
- Foxit is actively bidding on "Adobe Acrobat alternative" and "Adobe Acrobat cancel" in Google Ads. Adobe cedes that traffic entirely today.
- UPDF launched at $29.99/year (vs our $239.88) and now dominates r/Entrepreneur recommendation threads. Our team had no visibility until users started citing it in sales calls.

**What we built:**  
One command. 30 seconds. A fully formatted PDF acquisition playbook — pricing comparison, competitor messaging, battlecards, PLG strategy with exact copy and A/B test specs. For less than one cent per run.

---

## How It Works — The Architecture

Three layers. Each does one job.

### Layer 1: CLAUDE.md — The Brain

Every project has a `CLAUDE.md` file at the root. When Claude Code opens this project, it reads `CLAUDE.md` first — before anything else. Think of it as an onboarding doc written for AI instead of a new hire.

Our `CLAUDE.md` defines:
- **The WAT framework** — Workflows (markdown SOPs), Agents (Claude reasoning), Tools (TypeScript scripts that execute deterministically)
- **Report requirements** — the 13 sections every competitive analysis must have, what goes in each, what "actionable" means
- **Data sources** — Brave Search, Reddit, YouTube, Twitter/X — and the exact API endpoints to use
- **Cost rules** — hard cap $0.50/report; prefer Haiku for synthesis (73% cheaper than Sonnet)
- **Security rules** — every secret in `.env`, never log API keys, always validate at startup

This is what makes the system reproducible. Claude doesn't guess — it follows the SOP.

### Layer 2: Skills — Pre-Built Capabilities

Skills are slash commands that trigger specific, pre-built research workflows. Instead of writing a prompt from scratch, you invoke a skill:

| Skill | What it does |
|---|---|
| `/competitor-research` | Full automated competitive analysis pipeline — scrape → analyze → PDF |
| `/pm-market-research:competitive-analysis` | Deep competitive analysis with structured 13-section output |
| `/pm-go-to-market:competitive-battlecard` | Battlecard generation for a specific competitor matchup |
| `/pm-product-strategy:pricing-strategy` | Pricing analysis with competitor comparison |
| `/pm-execution:create-prd` | PRD writing with competitive context built in |

Skills are reusable, versioned, and shared across the team. When someone improves the competitive analysis skill, everyone gets the improvement.

### Layer 3: MCP — External Connections

MCP (Model Context Protocol) lets Claude connect to external services and call them directly from the conversation — without copy-pasting, without leaving the terminal.

In this project, that means Claude can reach:
- **Adobe Analytics** — pull real traffic and conversion data to validate competitive hypotheses
- **AEM (Content)** — read and update live Adobe.com pages
- **Firefly** — generate images for report visuals
- **Frame.io** — attach reports to video review workflows

When Claude runs a competitive analysis, it can cross-reference "Adobe ranks #8 for 'PDF editor free'" against real Analytics data to confirm the SEO gap is real — not estimated.

---

## The Acrobat Acquisition Playbook — 5 Key Findings

Open [docs/Acrobat-Acquisition-Playbook.md](Acrobat-Acquisition-Playbook.md) (or the PDF on Desktop).

Walk through these five moments — each is a finding that changes what a PM does next week.

---

### Finding 1: The FTC Lawsuit is a Live Acquisition Liability

**Where**: TL;DR + Market Overview section

> *"Any prospect researching 'Adobe Acrobat review' hits the FTC lawsuit story before they hit product reviews."*

The FTC sued Adobe in June 2024 over the ETF and cancellation difficulty. That case now surfaces as the #1 organic result before product content. Foxit runs paid ads on `adobe acrobat cancel` and `adobe acrobat ETF` — Adobe cedes 100% of that traffic to a competitor today.

**The action this unlocks** (from the 30-Day Action Sprint):
> Week 1 · SEM · $0 incremental: Bid on `adobe acrobat cancel subscription`, `adobe acrobat ETF` · Ad: `"Acrobat's Terms, Explained Plainly — See exactly what you're signing up for."` · Destination: `/subscription-terms`

This is a 1-day SEM change. No engineering.

---

### Finding 2: Adobe is Invisible for the Highest-Volume Entry Keyword

**Where**: SEO Acquisition Gaps table

| Keyword | Monthly Volume | Adobe Rank | Who Ranks #1 |
|---|---|---|---|
| PDF editor free | 200K/mo | #8+ | Smallpdf / ILovePDF |
| PDF editor | 450K/mo | #5–7 | Smallpdf / Foxit |

Adobe ranks #8+ for "PDF editor free" — the highest-volume entry keyword in the category. Smallpdf wins this with a single-purpose landing page. Adobe has the tool. It lacks the SEO architecture and the CC-free trial that makes the landing page convert.

**The action this unlocks**:
> Week 1 · CRO · 2-hour copy change: Hero CTA `"Try Acrobat Studio"` → `"Try Acrobat for free"` + subtext `"7 days free — no credit card"` · Link to plans page, not checkout

---

### Finding 3: 200 Million Warm Leads See Zero Conversion Prompt

**Where**: PLG Acquisition Strategy — Now (0–30 days)

Every Acrobat Sign document generates a "Document signed" confirmation screen seen by the recipient. There are 200M+ free signers receiving these monthly. Every one of them just experienced Acrobat's most compelling use case — and sees no prompt to convert.

**The action this unlocks**:
> Days 8–30 · 2-day build: On Acrobat Sign confirmation screen, add below the checkmark: `"Want to send documents for signature? → Try Acrobat free"` · Link: `acrobat.adobe.com/free-trial?source=signer_confirm`

At 1% conversion, that's 2 million trial starts per month from a surface that currently produces zero.

---

### Finding 4: The Price Gap is Real but Addressable at the Framing Layer

**Where**: Pricing Comparison + Battlecards

Acrobat is $239.88/year. Foxit is $159.99. UPDF is $29.99. The 50% premium over Foxit is defensible — but only if the trial framing justifies it before asking for the card. Right now, Adobe requires a credit card to start the 7-day trial. Every competitor in the study — Foxit, UPDF, Smallpdf, iLovePDF — offers CC-free entry.

**The action this unlocks**:
> Days 8–30 · 3-day engineering: Remove CC from trial signup. Show `"7 days free — no card needed"` above the form. Metric: trial starts ~500/mo → 3,000/mo.

The price story doesn't change. The acquisition friction story does.

---

### Finding 5: Adobe is Invisible in AI Search for the Fastest-Growing Query Set

**Where**: GEO — Generative Engine Optimization

As of May 2026, ~30% of PDF tool queries go through ChatGPT, Perplexity, or Google AI Overviews instead of traditional search. Current AI answers:

| Query | ChatGPT | Perplexity |
|---|---|---|
| "free PDF editor" | Not mentioned | Smallpdf #1 |
| "PDF editor no subscription" | Nitro/PDFelement — Adobe not mentioned | UPDF, Nitro |
| "cancel Adobe Acrobat" | Describes ETF process | Links to FTC case |

**The action this unlocks**:
> 6 months · Content moat: Structured content hub at `acrobat.adobe.com/learn` covering every PDF use case. Optimized for AI citation patterns: clear headings, data tables, FAQ schema. Publish "Why Acrobat is worth the price" with comparison data tables that AI systems extract reliably.

---

## The 30-Day Sprint — What Ships This Month

**Where**: 30-Day Action Sprint section (new, added this week)

Four actions this week. Zero engineering. No sprint planning needed.

| # | Action | Exact change | Effort |
|---|---|---|---|
| 1 | Hub page hero CTA | `"Try Acrobat Studio"` → `"Try Acrobat for free"` + subtext `"7 days free — no credit card"` | 2 hrs · Web/CRO |
| 2 | Pricing page CTAs | `"Get Acrobat Pro"` → `"Start free trial"` + `"Cancel anytime."` | 2 hrs · Web/CRO |
| 3 | SEM: FTC-intent keywords | Bid on `adobe acrobat cancel`, `adobe acrobat ETF` · Ad: `"Acrobat's Terms, Explained Plainly"` | 1 day · SEM |
| 4 | SEM: competitor-switch keywords | Bid on `foxit alternative`, `pdf editor no credit card` · Ad: `"More Powerful Than Foxit. Try Free."` | 1 day · SEM |

Total cost to ship all four: one person, two days. No engineering tickets.

---

## How Any PM Can Run This

### Option 1: Use a Skill in Claude Code (recommended)

In Claude Code, type:

```
/pm-market-research:competitive-analysis
```

Claude will ask for the product name. Provide it. It runs the full 13-section analysis, saves the markdown to `docs/`, and generates the PDF on your Desktop. Works for any product in any vertical.

### Option 2: Ask Claude Directly (no setup required)

Open Claude at claude.ai and paste:

> "You are a competitive intelligence analyst for Adobe. I need a focused acquisition playbook for [product name]. Cover: (1) TL;DR in 2–3 sentences, (2) pricing comparison table vs top 5–6 competitors with real prices, (3) competitor website messaging, (4) top churn triggers, (5) win signals, (6) 3 battlecards with win move + lose scenario per competitor, (7) PLG acquisition strategy with Now/3M/6M — each move must name the competitor it counters, exact copy or build spec, and metric to track, (8) PLG metrics dashboard with current estimates and 6-month targets. Use web search to verify current pricing."

Same quality output. Zero setup. Works today.

### Option 3: Full Automated Pipeline

```bash
npm run test-run     # Runs pipeline: scrape → analyze → report
npm run save-report  # Fetches latest output → formats → saves PDF to Desktop
```

Under 60 seconds. Under $0.01. Any product.

---

## Q&A Prep

**"Is the data accurate?"**
> "It pulls from real Reddit posts and live web search — same sources you'd check manually. All source links are in the report. Pricing is verified against live competitor pricing pages, not cached data."

**"What's CLAUDE.md and why does it matter?"**
> "It's the SOP written in plain English that Claude reads before every session. It's what makes the output consistent — same structure, same sections, same depth — regardless of who runs it or when. Think of it as the playbook that replaces a 30-minute briefing."

**"What are skills?"**
> "Slash commands that trigger pre-built research workflows. `/competitor-research` is the one that runs this pipeline. They're reusable — one PM improves the skill, everyone gets the improvement automatically."

**"What's MCP?"**
> "Model Context Protocol — it's how Claude connects to external tools like Adobe Analytics, AEM, and Firefly directly from the conversation. Instead of copy-pasting data between tabs, Claude can pull live traffic numbers from Analytics to validate a competitive finding while it's writing the report."

**"What does it cost?"**
> "Under one cent per report. A year of monthly runs costs less than a cup of coffee. The real cost is the 30 minutes of setup to configure it for a new product."

**"Can we run this for other products?"**
> "Yes. Any product name. The system infers competitors, audience, and framing — you don't need to provide them. Just the product name."

**"Who maintains it?"**
> "Claude Code can update the workflow when something changes — new data source, new competitor, different report format. The CLAUDE.md and skills are version controlled. Changes take minutes."

---

## Pre-Demo Checklist

- [ ] Terminal open, `.env` has `ANTHROPIC_API_KEY` and `BRAVE_API_KEY`
- [ ] Pre-run `npm run test-run` once to verify it works
- [ ] Acrobat Acquisition Playbook PDF open on Desktop (backup if live run fails)
- [ ] Browser tab open to the GitHub repo
- [ ] Know the 5 findings cold — you won't have time to read them live

**If something fails live:** Switch to the pre-saved PDF immediately. Say: "Let me show you the output from the last run — same thing, already formatted." The findings walkthrough is the demo. The live run is just the opening.

---

## Slide Deck Option (if your org prefers slides)

| Slide | Content |
|---|---|
| 1 | "5 Hours → 30 Seconds. One Command." |
| 2 | The problem: FTC lawsuit in search results · Foxit ads on our branded terms · UPDF invisible until sales calls |
| 3 | The architecture: CLAUDE.md (the brain) · Skills (the commands) · MCP (the connections) |
| 4 | Screenshot: `npm run test-run` terminal output |
| 5 | Finding 1: FTC lawsuit as acquisition liability + the 1-day SEM fix |
| 6 | Finding 2: #8 for "PDF editor free" + the 2-hour CTA fix |
| 7 | Finding 3: 200M signers, 0% conversion + the 2-day build |
| 8 | The 30-day sprint: 4 actions, 2 days, $0 engineering |
| 9 | How to run it yourself: `/pm-market-research:competitive-analysis` |
| 10 | "Which task do we automate next?" |
