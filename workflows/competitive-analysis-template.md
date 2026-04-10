# Workflow: Competitive Analysis — Universal Template

## How to Use This Workflow

**Just provide the product name. That's it.**

> "Competitive analysis for Notion"
> "Run comp analysis on Figma"
> "Analyze Stripe's competitors"

Claude will automatically identify the top 6–8 competitors, determine the right audience and lens based on the product category, research everything, and produce the full report. No other input needed.

---

## Agent Instructions

When this workflow is invoked, follow these steps in order. Do NOT ask the user for clarifying inputs — infer everything from the product name.

### Step 1 — Auto-Configure from Product Name

Given only `[PRODUCT_NAME]`, determine all of the following autonomously:

**Identify the market category**
Search: `"[PRODUCT_NAME] competitors"` and `"[PRODUCT_NAME] alternatives"` — use results to understand what category the product competes in.

**Identify 6–8 competitors**
Select competitors using this priority:
1. Direct competitors (same category, same buyer, same job-to-be-done)
2. Adjacent competitors (different approach, same outcome)
3. The "do nothing / status quo" option if it's a common reason deals are lost

Do not ask the user to confirm the competitor list. Research all of them.

**Default audience**: Product Managers defining competitive strategy — always. Every report is written for the PM who needs to understand the market, identify gaps, and make decisions about what to build, how to position, and where to compete. Sections, framing, and recommendations all default to this lens.

**Default lens**: pricing + features + marketing + positioning (all four, always) — with emphasis on:
- Where [PRODUCT_NAME] is losing market share and why
- Feature gaps competitors are exploiting that the roadmap should address
- Positioning moves competitors are making that require a response
- Strategic threats to monitor and concrete actions the PM team can take this quarter
- Battlecards and ICP guidance the PM team can hand off to acquisition and sales

**Default cost guardrail**: $0.00 (web search only — no paid API calls unless user specifies otherwise)

### Step 2 — Research the Product and Its Market

Run these searches first to understand the product and identify competitors:

```
"[PRODUCT_NAME] competitors 2025"
"[PRODUCT_NAME] alternatives"
"[PRODUCT_NAME] vs [likely competitor]"
"[PRODUCT_NAME] pricing"
"[PRODUCT_NAME] review reddit"
```

From these results:
- Confirm what the product does
- Extract the 6–8 most frequently mentioned competitors
- Note any recent news (price changes, product launches, acquisitions)
- Note the most common customer complaints

### Step 3 — Research Each Competitor

For each competitor identified, collect:

| Data Point | Search Query |
|---|---|
| Current pricing (all tiers) | `"[competitor] pricing [current year]"` → visit pricing page |
| Free tier / trial terms | `"[competitor] free tier"` or `"[competitor] free trial"` |
| Perpetual vs subscription | Pricing page — look for "one-time", "lifetime", "perpetual" |
| Key feature claims | `"[competitor] features"` → homepage |
| Positioning language | Homepage hero copy — what's their tagline? |
| What users complain about | `"[competitor] reddit"` → filter for "cancel", "pricing", "switched", "alternatives" |
| What users love | `"[competitor] reddit"` → filter for "recommend", "best", "love" |
| Recent moves | `"[competitor] news 2025"` → last 90 days |
| Conquest campaigns | `"[competitor] vs [PRODUCT_NAME]"` → look for landing pages targeting [PRODUCT_NAME] customers |

**Minimum research per competitor**: pricing page + one Reddit thread + one "vs" comparison page. Never leave a competitor with only a table row — every competitor gets a deep dive section.

**Cost note**: WebSearch-only research costs $0.00. Do all research this way unless user has specified a budget for API calls.

### Step 4 — Identify the Strategic Frame

Before writing, answer these internally from your research:
1. What is the #1 reason customers leave `[PRODUCT_NAME]` for competitors?
2. What is the #1 reason customers choose `[PRODUCT_NAME]` over competitors?
3. What competitive move is most urgent to respond to in the next 90 days?
4. Which competitor segment is most vulnerable to conquest right now?

Use these answers to write the TL;DR and Recommended Actions. These should feel like insights, not a list of obvious points.

### Step 5 — Produce the Output Document

Save the completed report as `docs/[product-name]-competitor-analysis.md`.

Then generate the PDF automatically — no user prompt needed:
```bash
npx tsx scripts/md-to-pdf.ts docs/[product-name]-competitor-analysis.md
```

PDF saves to `~/Desktop/Adobe-[product-name]-competitor-analysis-YYYY-MM.pdf`.

Tell the user: "Your report is on the Desktop: `Adobe-[product-name]-competitor-analysis-YYYY-MM.pdf`"

---

## Output Template

Copy everything below this line into the output file. Replace every `[PLACEHOLDER]` with real content.

---

```markdown
# Competitive Analysis: [PRODUCT_NAME]
**Audience**: Product Management — Competitive Strategy
**Date**: [MONTH YEAR]
**Scope**: Pricing · Features · Marketing · Positioning · Win/Loss · Roadmap Implications
**Analyzed**: [N] competitors ([comma-separated list])
**Report cost**: $[X.XX] (web research only — within $0.50 guardrail)

---

## TL;DR for Product Strategy

> [2–3 sentence executive summary written for PMs. Lead with: (1) the biggest competitive threat
> the roadmap needs to respond to, (2) the most important feature or positioning gap to close,
> (3) the clearest strategic advantage [PRODUCT_NAME] should double down on.
> Write this last — after all research is done. Be specific, not generic.]

---

## 1. Market Overview

[2–3 paragraphs covering:]
- [How the market is segmented — enterprise vs SMB vs consumer, etc.]
- [The key trend reshaping competition right now — pricing model shift, AI, regulation, etc.]
- [The current moment — any recent news, price increases, or competitor moves that create urgency]

---

## 2. Competitive Landscape

| Competitor | Segment | Pricing | Perpetual? | Free Tier | Biggest Win vs [PRODUCT_NAME] |
|---|---|---|---|---|---|
| **[Competitor 1]** | [SMB/Enterprise/Consumer] | [$X/mo or $X/yr] | [✅/❌] | [✅/❌] | [One-line win story] |
| **[Competitor 2]** | | | | | |
| **[Competitor 3]** | | | | | |
| **[Competitor 4]** | | | | | |
| **[Competitor 5]** | | | | | |
| **[Competitor 6]** | | | | | |

---

## 3. Competitor Deep Dives

### 3.1 [Competitor 1] — [Label: e.g., Primary Competitive Threat / Emerging Risk]

**Why they win deals against [PRODUCT_NAME]**:
- **[Reason 1]**: [Detail — be specific: price difference, feature name, policy, etc.]
- **[Reason 2]**: [Detail]
- **[Reason 3]**: [Detail]

**Pricing**:
| Plan | Cost |
|---|---|
| [Plan name] | [$X/mo or $X/yr or one-time] |
| [Plan name] | [$X] |
| [Plan name] | [$X] |

**Acquisition messaging they use against [PRODUCT_NAME]**: "[Direct quote or paraphrase of their conquest messaging]"

**[PRODUCT_NAME] counter**: [What [PRODUCT_NAME] has that this competitor lacks. Be specific — name the features or advantages.]

---

### 3.2 [Competitor 2] — [Label]

[Same structure as 3.1]

---

### 3.3 [Competitor 3] — [Label]

[Same structure as 3.1]

---

[Repeat for each competitor — minimum 5, maximum 8]

---

## 4. Pricing Comparison (Acquisition View)

| Product | Annual Cost (Individual) | Annual Cost (5-user team) | Early Termination Fee | Perpetual Available |
|---|---|---|---|---|
| **[PRODUCT_NAME]** | $[X] | ~$[X] | [Fee or "None"] | [✅/❌] |
| **[Competitor 1]** | $[X] | ~$[X] | [Fee or "None"] | [✅/❌] |
| **[Competitor 2]** | $[X] | ~$[X] | [Fee or "None"] | [✅/❌] |
| **[Competitor 3]** | $[X] | ~$[X] | [Fee or "None"] | [✅/❌] |
| **[Competitor 4]** | $[X] | ~$[X] | [Fee or "None"] | [✅/❌] |
| **[Competitor 5]** | $[X] | ~$[X] | [Fee or "None"] | [✅/❌] |

**Key acquisition insight**: [1–2 sentences on the most important pricing dynamic. What is the biggest pricing-related reason customers leave or don't buy?]

---

## 5. Feature Comparison (Acquisition-Critical)

[Choose 10–14 capabilities that matter most for buying decisions in this market. Include table-stakes AND differentiators.]

| Capability | [PRODUCT_NAME] | [Comp 1] | [Comp 2] | [Comp 3] | [Comp 4] | [Comp 5] |
|---|---|---|---|---|---|---|
| [Feature 1] | ✅ [qualifier] | ✅ / ⚠️ / ❌ | | | | |
| [Feature 2] | | | | | | |
| [Feature 3] | | | | | | |
| [Feature 4] | | | | | | |
| [Feature 5] | | | | | | |
| [Feature 6] | | | | | | |
| [Feature 7] | | | | | | |
| [Feature 8] | | | | | | |
| [Feature 9] | | | | | | |
| [Feature 10] | | | | | | |

Legend: ✅ Full support · ⚠️ Partial / limited · ❌ Not available

**Table-stakes** (must have to be in the deal): [comma-separated list of non-negotiable features]
**[PRODUCT_NAME] differentiators** (what closes deals): [comma-separated list of unique advantages]

---

## 6. Why Customers Leave [PRODUCT_NAME] (Churn Triggers)

Based on public review data and competitor conquest campaigns:

| Rank | Reason | Segment Most Affected |
|---|---|---|
| 1 | **[Top churn reason]** | [Individual / SMB / Enterprise] |
| 2 | **[Reason 2]** | |
| 3 | **[Reason 3]** | |
| 4 | **[Reason 4]** | |
| 5 | **[Reason 5]** | |

**Acquisition implication**: [1–2 sentences on how to re-engage churned customers or prevent churn at the moment of risk.]

---

## 7. Why Customers Choose [PRODUCT_NAME] (Win Signals)

| Rank | Reason | Segment |
|---|---|---|
| 1 | **[Top win reason]** | [Segment] |
| 2 | **[Reason 2]** | |
| 3 | **[Reason 3]** | |
| 4 | **[Reason 4]** | |
| 5 | **[Reason 5]** | |

---

## 8. Ideal Customer Profile (ICP) for Acquisition

### Tier 1 — Highest Win Rate

**[ICP segment name]**
- [Who they are — role, company type, situation]
- [What pain they have that [PRODUCT_NAME] solves uniquely]
- Message: "[The sentence that resonates most with this segment]"

**[ICP segment name]**
- [Same structure]

### Tier 2 — Good Win Rate with Right Positioning

**[ICP segment name]**
- [Who, pain, message]

### Tier 3 — Low Win Rate (Don't Chase)

- [Segment] — [Why [PRODUCT_NAME] consistently loses here — be honest]
- [Segment] — [Same]

---

## 9. Competitive Battlecard Summaries

### [PRODUCT_NAME] vs. [Most Common Competitor]

| | [PRODUCT_NAME] | [Competitor] |
|---|---|---|
| **Price** | $[X]/year | $[X]/year |
| **[Key feature 1]** | [status] | [status] |
| **[Key feature 2]** | [status] | [status] |
| **[Key feature 3]** | [status] | [status] |
| **[Key feature 4]** | [status] | [status] |
| **[Key differentiator]** | ✅ | ❌ |
| **Support** | [tier] | [tier] |

**Win move**: [The specific demo, question, or pivot that closes this competitive situation. Be tactical — name what to show or ask.]
**Lose scenario**: [The situation where [PRODUCT_NAME] will likely lose. Be honest so the team qualifies out efficiently.]

---

### [PRODUCT_NAME] vs. [Second Most Common Competitor]

[Same structure]

---

### [PRODUCT_NAME] vs. [Third Scenario — e.g., "status quo / do nothing"]

**Win move**: [How to create urgency when the prospect is comfortable doing nothing]
**Validation question**: "[The one question that reveals whether the prospect is a real buyer]"

---

## 10. Differentiation Opportunities for [AUDIENCE]

1. **[Opportunity title]** — [Why it's defensible and what the message should be. Who to target first.]

2. **[Opportunity title]** — [Same structure]

3. **[Opportunity title]** — [Same structure]

4. **[Opportunity title]** — [Same structure]

5. **[Opportunity title]** — [Same structure]

---

## 11. Threats to Monitor (Next 90 Days)

| Threat | Probability | Impact | Response |
|---|---|---|---|
| [Threat 1] | High / Medium / Low | High / Medium / Low | [Specific recommended response] |
| [Threat 2] | | | |
| [Threat 3] | | | |
| [Threat 4] | | | |
| [Threat 5] | | | |

---

## 12. PM Strategy — Recommended Actions

### Respond Now (This Sprint / Month)
1. **[Action 1]** — [Specific thing the PM team should do or decide immediately. Name the output: a brief, a decision, a competitive counter-message, a sales enablement doc.]
2. **[Action 2]** — [Same]
3. **[Action 3]** — [Same]

### Roadmap (Next Quarter)
4. **[Feature or initiative to add/prioritize]** — [Why this closes a competitive gap. Name the competitor it neutralizes.]
5. **[Positioning or packaging change]** — [What to change and what it defends against]
6. **[Go-to-market or pricing move]** — [What to test and what signal to watch]

### Strategic Bets (6 months+)
7. **[Longer-term initiative]** — [What market position it secures and why it compounds over time]
8. **[Capability or partnership to build]** — [What structural advantage it creates that competitors can't quickly copy]

---

*Sources: [list all URLs used for pricing and data]*
```

---

## Quality Checklist Before Delivery

Before saving the final output, verify:

- [ ] Every pricing figure is sourced from the competitor's live pricing page (not estimated)
- [ ] TL;DR written last — after all research is complete
- [ ] Each competitor has a dedicated deep dive section (not just a table row)
- [ ] Each battlecard has a specific "Win move" and "Lose scenario" — not generic advice
- [ ] ICP Tier 3 is honest — includes segments where [PRODUCT_NAME] consistently loses
- [ ] Actions are specific (name what to build, say, or do) — not "improve positioning"
- [ ] All [PLACEHOLDERS] replaced — no brackets remaining in the output
- [ ] PDF generated and saved to `~/Desktop/`
- [ ] Report cost is within the specified guardrail

---

## Customization Notes

**Default audience is always Product Managers doing competitive strategy.** Every report is pre-configured for PMs: it covers feature gaps, positioning, roadmap implications, win/loss signals, and battlecards they can hand off to sales.

**To shift the lens for a different audience (optional)**:
- Acquisition / sales team → emphasize Sections 6 (Churn Triggers), 8 (ICP), 9 (Battlecards); add objection handling scripts
- Board / leadership → collapse Sections 3–9 into a 2-page summary; expand Section 11 (Threats) with market share impact estimates
- Engineering → add a "Build vs. Buy vs. Partner" section after Section 10; link each feature gap to a technical decision

**To add a new competitor later**:
- Add a row to Section 2 (Competitive Landscape)
- Add a Section 3.N deep dive
- Add a column to Section 4 (Pricing) and Section 5 (Features)
- Add a battlecard to Section 9 if it's a top-3 competitive situation

**To run this on a schedule**:
- Adapt `src/trigger/competitor-analysis/orchestrator.ts` — change the competitor list and analysis prompt
- Set a cron in Trigger.dev dashboard
- Update Section 4 of `workflows/competitor-analysis.md` to document the schedule
