# Agent Instructions

You're working inside the **WAT framework** (Workflows, Agents, Tools). This architecture separates concerns so that probabilistic AI handles reasoning while deterministic code handles execution. That separation is what makes this system reliable.

---

## The WAT Architecture

**Layer 1: Workflows (The Instructions)**
- Markdown SOPs stored in `workflows/`
- Each workflow defines the objective, required inputs, which tools to use, expected outputs, and how to handle edge cases
- Written in plain language, the same way you'd brief someone on your team

**Layer 2: Agents (The Decision-Maker)**
- This is your role. You're responsible for intelligent coordination.
- Read the relevant workflow, run tools in the correct sequence, handle failures gracefully, and ask clarifying questions when needed
- You connect intent to execution without trying to do everything yourself
- Example: If you need to scrape competitor data, don't attempt it ad-hoc. Read `workflows/competitor-analysis.md`, figure out the required inputs, then execute the correct tool from `scripts/` or `src/trigger/`

**Layer 3: Tools (The Execution)**
- TypeScript scripts in `scripts/` for local one-shot tasks
- Trigger.dev tasks in `src/trigger/` for cloud-based, scheduled, or long-running jobs
- API calls, data transformations, file operations — all deterministic
- Credentials and API keys are stored in `.env` — never anywhere else

**Why this matters:** When AI tries to handle every step directly, accuracy drops fast. If each step is 90% accurate, you're down to 59% success after just five steps. By offloading execution to deterministic scripts, you stay focused on orchestration and decision-making where you excel.

---

## How to Operate

**1. Look for existing tools first**
Before building anything new, check `scripts/` and `src/trigger/` based on what your workflow requires. Only create new files when nothing exists for that task.

**2. Always follow the workflow order**
For every automation request:
1. **Understand** — listen to the idea, do not write any code yet
2. **Research** — identify the best APIs/services; check docs, pricing, rate limits, free tiers, auth requirements
3. **Clarify** — ask targeted questions before assuming anything
4. **Plan** — write out what you will build in plain English; get explicit approval before coding
5. **Build** — create TypeScript task files following the conventions below
6. **Environment Setup** — add all required env vars to `.env` AND the Trigger.dev dashboard
7. **Test Locally** — run `npm run test-run` or start the dev server and trigger a test run
8. **Deploy** — only after explicit user approval; use `npx trigger.dev@latest deploy`
9. **Verify** — check run logs and confirm the automation works end-to-end

**3. Learn and adapt when things fail**
When you hit an error:
- Read the full error message and trace
- Fix the script and retest (if it uses paid API calls or credits, check with the user before re-running)
- Document what you learned in the workflow (rate limits, timing quirks, unexpected behavior)
- Update the relevant workflow SOP so the failure can't happen again

**4. Keep workflows current**
Workflows should evolve as you learn. When you find better methods, discover constraints, or encounter recurring issues, update the workflow. Do not create or overwrite workflows without asking unless explicitly told to.

---

## The Self-Improvement Loop

Every failure is a chance to make the system stronger:
1. Identify what broke
2. Fix the tool
3. Verify the fix works
4. Update the workflow SOP with the new approach
5. Move on with a more robust system

---

## File Structure

```
workflows/                     # Markdown SOPs — what to do and how
  competitor-analysis.md       # Adobe Firefly competitor research workflow

src/trigger/                   # Trigger.dev tasks (cloud execution)
  competitor-analysis/
    orchestrator.ts            # Main task: scrape → analyze → return report
    reddit.ts                  # Reddit JSON API scraper
    youtube.ts                 # YouTube Data API v3 scraper
    web-search.ts              # Brave Search API
    analyzer.ts                # Claude Haiku — structured analysis
    report-template.ts         # Adobe-branded HTML template
    types.ts                   # Shared TypeScript interfaces

scripts/                       # Local one-shot tools
  save-report.ts               # Fetch latest run output → puppeteer → Desktop PDF
  test-run.ts                  # Run full pipeline locally without Trigger.dev

.env                           # API keys (NEVER commit, NEVER hardcode)
.gitignore                     # Must include .env
trigger.config.ts              # Trigger.dev project config
```

**What goes where:**
- **Deliverables**: Final PDF saved to `~/Desktop/`
- **Intermediates**: Run output stored in Trigger.dev dashboard (accessible via Management API)
- **Secrets**: `.env` only — never in code, never in comments, never in logs

---

## Tech Stack Rules

- **Language**: TypeScript only — no Python scripts, no shell scripts, no exceptions
- **Runtime**: All scheduled/cloud work runs as Trigger.dev tasks; local tools use `tsx`
- **HTTP requests**: Use native `fetch` — no axios, no node-fetch
- **Imports between task files**: Always use `.js` extension: `import { x } from "./x.js"`

---

## Questions to Ask Before Writing Any Code

- **Source**: What data or service does this pull from? Does the user have an account/API key?
- **Output**: Where should results go? (Desktop PDF, email, Slack, Google Drive?)
- **Frequency**: Run on a schedule, respond to an event, or trigger manually?
- **Accounts**: What services does the user already have access to?
- **Success**: What does "working" look like? What exact output should they see?
- **Cost**: What is the per-run budget? Flag any API that charges per call.
- **Edge cases**: What if the source has no new data? What if an API call fails?

---

## Environment Variables — Security Rules

- **Every secret lives in `.env`** — API keys, tokens, workspace IDs, channel IDs. No exceptions.
- **Never log secret values** — `console.log("Key:", apiKey)` is a security violation
- **Never hardcode credentials** — not even temporarily, not even in comments
- **Always validate at the top of every task**:
  ```ts
  const apiKey = process.env.MY_API_KEY;
  if (!apiKey) throw new Error("MY_API_KEY is not set");
  ```
- **Verify `.gitignore` includes `.env`** before any commit

---

## Trigger.dev Critical Rules

- Use `@trigger.dev/sdk/v3` — NEVER `client.defineJob` (v2 pattern, breaks everything)
- Scheduled tasks use `schedules.task` with a `cron` string
- `triggerAndWait()` returns a `Result` object — always check `result.ok` before `result.output`
- **NEVER** wrap `triggerAndWait`, `batchTriggerAndWait`, or `wait.*` calls in `Promise.all`
- Use `idempotencyKey` when the same item could be triggered more than once
- TypeScript imports between task files need `.js` extension

---

## Deploying to Production

**NEVER deploy without explicit user approval.** Wait for the user to say "push it", "deploy", or "ship it".

**Pre-deploy checklist:**
- [ ] All env vars added to Trigger.dev dashboard (not just `.env`)
- [ ] Tested locally — at least one run succeeded
- [ ] User has explicitly confirmed the automation works
- [ ] `.env` is in `.gitignore`

---

## PM Skills Available

The following `/pm-*` skills are installed and should be used when relevant:

| Need | Skill |
|---|---|
| Competitor research | `/pm-market-research:competitive-analysis` |
| Pricing strategy | `/pm-product-strategy:pricing-strategy` |
| GTM / launch plan | `/pm-go-to-market:gtm-strategy` |
| Competitive battlecard | `/pm-go-to-market:competitive-battlecard` |
| Value proposition | `/pm-product-strategy:value-proposition` |
| SWOT analysis | `/pm-product-strategy:swot-analysis` |
| User personas | `/pm-market-research:user-personas` |
| PRD writing | `/pm-execution:create-prd` |
| OKRs | `/pm-execution:brainstorm-okrs` |

---

## Current Automations

| Automation | Workflow | Status |
|---|---|---|
| Adobe Firefly Competitor Analysis | `workflows/competitor-analysis.md` | Active — run `npm run test-run` |
