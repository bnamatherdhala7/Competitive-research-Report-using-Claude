# Workflow: Competitive Analysis — Universal Template

## How to Use This Workflow

Invoke this workflow by providing:
1. **Product name** — what you're analyzing (e.g., "Adobe Acrobat", "Notion", "Figma")
2. **Audience** — who the output is for (e.g., "acquisition team", "PM org", "board")
3. **Lens** — what angle matters most (e.g., "pricing + packaging", "features + positioning", "go-to-market")
4. **Competitors** — list them, or ask Claude to identify them
5. **Cost guardrail** — max API cost per report (default: $0.50)

**Example prompt**:
> "Run a competitive analysis for Figma vs Sketch, Framer, Canva, and Adobe XD. Audience is the product leadership team. Focus on pricing and feature differentiation. Keep cost under $0.50."

Claude will research each competitor using web search and Reddit, then produce a report following the output template below.

---

## Agent Instructions

When this workflow is invoked, follow these steps in order:

### Step 1 — Clarify Inputs

Before researching, confirm:
- `[PRODUCT_NAME]` — the product being analyzed
- `[AUDIENCE]` — who will read the output and what decisions they need to make
- `[LENS]` — pricing / features / marketing / GTM / all
- `[COMPETITORS]` — if not provided, identify 5–8 based on the market
- `[COST_GUARDRAIL]` — default $0.50; web search only stays at $0.00

### Step 2 — Research Each Competitor

For each competitor, collect:

| Data Point | Where to Find It |
|---|---|
| Current pricing (all tiers) | Competitor pricing page via WebSearch |
| Free tier / trial terms | Competitor website |
| Perpetual vs subscription | Pricing page |
| Key feature claims | Homepage, features page |
| Positioning language | Hero copy on homepage |
| What users complain about | Reddit: `r/[tool]`, `r/[category]` — search "alternatives", "cancel", "pricing" |
| What users love | Reddit — search "switched to", "recommend", "best" |
| Recent moves | Google News last 90 days |
| Active conquest campaigns | Search "[Competitor] vs [Product]" and "[Competitor] alternative" |

**Cost note**: WebSearch-only research costs $0.00. Claude Haiku synthesis adds ~$0.003. Always confirm before using paid API calls.

### Step 3 — Identify the Strategic Frame

Before writing, answer:
1. What is the #1 reason customers leave `[PRODUCT_NAME]` for competitors?
2. What is the #1 reason customers choose `[PRODUCT_NAME]` over competitors?
3. What competitive move is most urgent to respond to in the next 90 days?
4. Which competitor segment is most vulnerable to conquest right now?

Use these answers to sharpen the TL;DR and recommendations.

### Step 4 — Produce the Output Document

Save the completed report as `docs/[product-name]-competitor-analysis.md`.

Then generate the PDF:
```bash
npx tsx scripts/md-to-pdf.ts docs/[product-name]-competitor-analysis.md
```

PDF saves to `~/Desktop/Adobe-[product-name]-competitor-analysis-YYYY-MM.pdf`.

---

## Output Template

Copy everything below this line into the output file. Replace every `[PLACEHOLDER]` with real content.

---

```markdown
# Competitive Analysis: [PRODUCT_NAME]
**Audience**: [AUDIENCE]
**Date**: [MONTH YEAR]
**Scope**: [LENS — e.g., Pricing · Features · Marketing · Packaging]
**Analyzed**: [N] competitors ([comma-separated list])
**Report cost**: $[X.XX] ([method — e.g., web research only, within $0.50 guardrail])

---

## TL;DR for [AUDIENCE]

> [2–3 sentence executive summary. Lead with: (1) the biggest competitive threat right now,
> (2) the biggest acquisition opportunity, (3) the strongest win story for [PRODUCT_NAME].
> Write this last — after all research is done.]

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

## 12. [AUDIENCE] Recommended Actions

### Immediate (This Month)
1. **[Action 1]** — [What exactly to do and why it matters now]
2. **[Action 2]** — [Same]
3. **[Action 3]** — [Same]

### Near-term (Next Quarter)
4. **[Action 4]** — [Same]
5. **[Action 5]** — [Same]
6. **[Action 6]** — [Same]

### Strategic (6 months+)
7. **[Action 7]** — [Same]
8. **[Action 8]** — [Same]

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

**To change the audience lens**:
- Acquisition team → emphasize churn triggers, win/loss signals, battlecards, ICP tiers
- PM org → emphasize feature gaps, positioning opportunities, roadmap threats
- Board / leadership → emphasize market share signals, structural threats, strategic bets
- Sales enablement → expand battlecard section to cover top 5 competitive situations

**To add a new competitor later**:
- Add a row to Section 2 (Competitive Landscape)
- Add a Section 3.N deep dive
- Add a column to Section 4 (Pricing) and Section 5 (Features)
- Add a battlecard to Section 9 if it's a top-3 competitive situation

**To run this on a schedule**:
- Adapt `src/trigger/competitor-analysis/orchestrator.ts` — change the competitor list and analysis prompt
- Set a cron in Trigger.dev dashboard
- Update Section 4 of `workflows/competitor-analysis.md` to document the schedule
