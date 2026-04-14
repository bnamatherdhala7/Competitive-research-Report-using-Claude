# Demo Guide: Adobe Competitive Intelligence Automation

**Audience**: Product managers with no technical background  
**Duration**: 10 minutes  
**Format**: Works live (Zoom/in-person) or recorded (Loom)

---

## Deliverables — What This System Produces

This system generates focused, acquisition-oriented competitive intelligence reports for Adobe product teams. All reports are available as PDFs in this repository:

| Report | File | Focus |
|---|---|---|
| **Adobe Acrobat Acquisition Playbook** | `Adobe-Acrobat-Acquisition-Playbook-2026-04.pdf` | Pricing · Battlecards · PLG motions (cancel intervention, signer-to-trial, CC add-on) |
| **Adobe Express Acquisition Playbook** | `Adobe-Express-Acquisition-Playbook-2026-04.pdf` | Pricing · Canva/M365 battlecards · PLG motions (template AI, Photoshop export, viral share) |
| **Remove Background Acquisition Playbook** | `Adobe-Remove-Background-Playbook-2026-04.pdf` | 18M search keyword · SEO gap analysis · E-commerce go-to-market · Firefly vs remove.bg/PhotoRoom |

Each report includes: TL;DR → Competitive Landscape → Pricing Comparison → Competitor Messaging → Battlecards (3 per report) → PLG Now / 3M / 6M → Metrics Dashboard.

---

## Before You Start

### Pre-demo checklist
- [ ] Terminal window open, sized to fill half the screen
- [ ] `.env` file has all three API keys (`ANTHROPIC_API_KEY`, `BRAVE_API_KEY`)
- [ ] Run `npm run test-run` once beforehand so you know it works
- [ ] Have a sample PDF ready to show in case of live failure (see Backup Plan below)
- [ ] Browser tab open to the GitHub repo

---

## The 10-Minute Script

---

### Minute 0–2: The Problem

**What to say:**

> "Every month, someone on a PM team needs to answer this question: what are our competitors doing right now with their pricing, their features, their messaging? For us, that means going to Reddit, searching YouTube, reading tech blogs — manually — for Midjourney, DALL-E, Canva, and four other competitors. That's 3 to 5 hours of work, every single month. And it's inconsistent — whoever does it checks different things, misses different things."

> "What if that 5-hour task took 30 seconds and cost less than a penny? That's what I'm going to show you."

**What they're thinking**: *Is this real? Can it actually do that?*

---

### Minute 2–5: Hit Run (The Magic Moment)

**What to do:**  
Open your terminal. Type this and hit Enter:

```bash
npm run test-run
```

**What to say as it runs:**

> "What you're seeing right now is the system searching Reddit for what real users say about Midjourney's credits... now Canva AI... now DALL-E... It's pulling the most upvoted posts, the most recent YouTube videos, the latest news stories — for all seven competitors at once."

> "No browser tabs. No copy-paste. No reading. It's doing in 30 seconds what would take a person an afternoon."

**Point at the terminal output as competitors appear:**

> "There — Midjourney. Reddit: 3 posts. Web: 5 results. There's Canva. There's DALL-E. And here — this is where it gets interesting — it's also pulling data on Adobe Firefly itself, so we can benchmark our own community sentiment."

**When analysis starts:**

> "Now it's sending everything it found to Claude — Anthropic's AI. Claude reads all of it and does the hard thinking: what's the pattern here? What's working for competitors? What should we be doing differently?"

---

### Minute 5–7: Show the Output

**What to do:**  
Open any of the PDF playbooks from the `docs/` folder.

**What to say:**

> "Here's the report. This is what a consultant would charge several thousand dollars to produce."

**Walk through the Acrobat Acquisition Playbook:**

**TL;DR:**
> "Three sentences. The most important insight from this entire report. This is what you'd share in a leadership sync before the full read."

**Pricing Comparison Table:**
> "Side-by-side — Adobe Acrobat at $239/year vs Foxit at $160, UPDF at $30, Smallpdf at $84. You can see immediately where the price gap hurts and where it's justified."

**Competitor Messaging section:**
> "Foxit's homepage headline is literally 'Switch from Acrobat and save.' This is what the competitor is saying to our customers right now. The report shows you their exact pitch — so you can build the counter-pitch."

**Battlecards:**
> "Three ready-to-use sales battlecards. vs Foxit, vs Microsoft 365, vs UPDF. Each one has the win move, the trap to avoid, and the scenario where we should stop competing and let them go."

**PLG Acquisition Strategy:**
> "Not generic advice. Three specific product moves for the next 30 days — each one names the competitor it counters, what to build, and what metric to track. This is what acquisition PMs can take to their sprint planning tomorrow."

---

### Minute 7–9: The Punchline

**What to say:**

> "Total cost of that report: three-tenths of one cent. $0.003."

> "If we run this monthly for a year, the total cost is four cents. The alternative is 60 hours of someone's time."

> "But the real value isn't the cost. It's the consistency. Every month, same competitors, same structure, same report format. No more hoping someone had time to do the research. No more stale data in strategy reviews."

**Show the GitHub repo:**

> "Everything that powers this is here on GitHub — documented, version controlled, reproducible. This isn't a one-off script I ran once. It's a product. It has a workflow SOP. It gets better every time we run it."

---

### Minute 9–10: What's Possible

**What to say:**

> "This is one workflow. One use case. The same approach — plain English instructions, AI for reasoning, code for execution — works for any repetitive research or analysis task a PM does."

> "Win/loss analysis. Customer interview synthesis. Feature request triage. Release note drafting. Stakeholder updates. Any task that follows a consistent process can be automated this way."

> "The question isn't 'can we automate this?' The question is 'which task do we automate next?'"

---

## Using This in Your Claude Account

You can run this competitive intelligence system in your own Claude account without any coding. Here's how:

### Option 1: Ask Claude directly (no setup required)
Open Claude at claude.ai and paste this prompt:

> "You are a competitive intelligence analyst for Adobe. I need a focused acquisition playbook for [product name — e.g., Adobe Acrobat / Adobe Express / Adobe Firefly]. Cover: (1) TL;DR in 2–3 sentences, (2) pricing comparison table vs top 5–6 competitors with real prices, (3) competitor website messaging and positioning, (4) top churn triggers with rank, (5) win signals, (6) 3 battlecards (win move + lose scenario for each major competitor), (7) PLG acquisition strategy with Now/3M/6M moves — each move must name the competitor it counters, what to build, and what metric to track, (8) PLG metrics dashboard table with current estimates and 6-month targets. Use web search to verify current pricing before writing."

Claude will produce the same quality of analysis as these reports, on demand, for any product.

### Option 2: Use Claude Code (requires Claude Code CLI)
If your team uses Claude Code (the terminal AI), you can run the full automated pipeline:

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

### Option 3: Generate a PDF from any markdown report
If you have a markdown competitive analysis file, convert it to an Adobe-branded PDF with:

```bash
npx tsx scripts/md-to-pdf.ts docs/your-report.md
```

The PDF appears on your Desktop with Adobe branding, section formatting, and print-ready layout.

---

## Q&A Prep

**"Is the data accurate?"**
> "It pulls from real Reddit posts and real web search results — the same sources you'd check manually. The AI synthesizes patterns, but all the source data is real. The report includes the source links if you want to verify anything."

**"What if a competitor isn't on Reddit?"**
> "The Brave Search results also pick up Twitter/X, news sites, and blog posts. Reddit is the richest signal for sentiment, but it's one of three sources."

**"Can it track more competitors?"**
> "Yes. Adding a competitor is one line of code — just add their name to the list. The system handles the rest."

**"What does it cost to run more often?"**
> "Three-tenths of a cent per run. You could run it daily for a year for about $1. The bottleneck isn't cost — it's how often the data meaningfully changes. Monthly is the right cadence for strategic decisions."

**"Who maintains it?"**
> "Claude Code built it and can maintain it. Any change to the workflow — new competitors, new data sources, different report format — takes minutes to implement."

**"Is this safe? Where does the data go?"**
> "Everything runs locally or in Trigger.dev's cloud. No data is stored anywhere except the PDF on your Desktop. API keys are in a `.env` file that's never committed to GitHub. The scraping uses only public data — same as what you'd find by Googling."

**"Can non-technical PMs run this?"**
> "Right now it requires running two terminal commands. The Option 1 above (asking Claude directly) requires zero setup and works for anyone with a Claude account."

---

## Backup Plan (If Something Fails Live)

1. **API error during test-run**: Say "Let me show you the output from the last run" and open one of the pre-saved PDFs from `docs/`. Continue the demo from the PDF section.

2. **PDF doesn't generate**: Show the terminal output. Say "The analysis is done — the PDF step is a formatting layer we can look at separately. Here's the actual intelligence the system produced."

3. **Slow internet / API timeout**: This is a great teaching moment. Say "This is exactly why we built error handling in — if one source fails, the report generates with the other two. Let me show you what a completed report looks like."

---

## Loom Recording Script

If recording async, follow the same structure but:
- Record at **1.25x actual speed** if the scraping is slow
- Use **Quicktime** to record terminal + PDF side by side
- Keep it under **8 minutes** for async attention spans
- End with a **clear call to action**: "Reply with what repetitive PM task you'd want automated next"

---

## Slide Deck Option

If your org prefers a deck, structure it as:

| Slide | Content |
|---|---|
| 1 | Title: "30 Seconds vs. 5 Hours" |
| 2 | The problem: manual competitive research |
| 3 | The solution: one command, one PDF |
| 4 | Screenshot: terminal running |
| 5 | Screenshot: PDF report sections |
| 6 | The numbers: $0.003, 30 seconds, 7 competitors |
| 7 | Reports available: Acrobat · Express · Remove Background |
| 8 | How to use it in your Claude account (3 options) |
| 9 | Q&A |
