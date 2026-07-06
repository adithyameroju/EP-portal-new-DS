# S4 — Self-Correcting Audit Loop — Build-Ready Design Spec

*Track: S4 (critical-path tail). Read alongside Compass_GA_Roadmap.md + STATE.md.*

> **What this is.** The design a sub-agent builds against, so the hard parts aren't
> improvised. The loop moves Compass from a *static* audit (hex/arbitrary at commit)
> to a *behavioral* one: is the LLM still generating correct, on-token, on-component
> code over time — and when it drifts, detect it and PROPOSE a fix for owner approval.
>
> **Non-negotiable guardrail:** the loop proposes, the human approves. It never
> auto-writes a rule. A prescription must trace to observed drift evidence; if a fix
> needs a *new opinion* (not just tightening an existing ambiguous rule), it is
> FLAGGED for owner decision, never proposed as a rule. Invented opinions are the
> exact failure Compass exists to prevent.

---

## Dependency gate (what can start now vs. what waits for S1)

| Part | Can build now | Gated on S1 (meta.ts) |
|------|---------------|------------------------|
| Capture (ledger) | ✅ fully | — |
| Score C1 (tokens), C5 (naming), C6 (imports) | ✅ | — |
| Score C2 (provenance), C3 (composite), C4 (spec coverage) | design now | ⛔ needs meta.ts |
| Detect (clustering) | design now | ⛔ consumes scored reports |
| Prescribe | design now | ⛔ needs specs + meta to target edits |
| Dashboard (HTML) | ✅ shell now | fills once scores exist |

So the sub-agent builds Capture + C1/C5/C6 + the dashboard shell immediately, and
wires C2–C4 + Detect + Prescribe the moment `meta.ts` lands.

---

## Part 1 — Capture (the drift ledger)

**Design constraint above all else: zero friction.** If logging is annoying,
designers won't do it and the loop starves. Optimize for one command.

- **Location:** `drift-log/` at repo root. One file per build session:
  `drift-log/<ISO-timestamp>__<designer>__<slug>.json`.
- **Written by:** a `compass log` CLI command. It (a) prompts the designer to paste
  Cursor's "What I assumed" block, and (b) auto-captures the session's new/changed
  files via `git diff --name-only` since the last log. Stretch: a Cursor rule that
  auto-appends an entry on each build so it's fully hands-free.
- **Keep Slack** as informal overflow, but the ledger is the machine-readable truth.

**Entry schema:**
```json
{
  "timestamp": "2026-07-10T14:32:00Z",
  "designer": "nikhil",
  "tool": "cursor",
  "compassVersion": "0.2.0",
  "source": "figma-frame-url-or-prompt-summary",
  "targetFiles": ["components/blocks/kpi-row.tsx", "..."],
  "componentsUsed": ["card", "button", "toggle-group", "chart"],
  "assumptions": [
    { "text": "assumed Card border stays default", "category": "styling" }
  ]
}
```

---

## Part 2 — Score (compliance audit)

Extend `scripts/token-audit.js` → `scripts/compliance-audit.js`. Input: a set of
target files (one build's output, or the whole repo). Every check emits
`{ ruleId, level: pass|warn|error, file, line, message, component? }`.

| Rule | Level | What it checks | Needs meta? |
|------|-------|----------------|-------------|
| **C1 tokens** | error/warn | no hex, no raw tailwind color utils; arbitrary-value tiering (layout dims like `220px` = warn; color/spacing = error) | no (exists) |
| **C2 provenance** | error | JSX hand-rolled as `div/span` that matches a Compass primitive's shape (re-implemented Card/Button as a div) instead of importing it | **yes** (needs each primitive's signature) |
| **C3 composite completeness** | error/warn | composite used without its sub-parts (Card without CardHeader/Content; Dialog without DialogHeader) | **yes** (childComponents from meta) |
| **C4 spec coverage** | warn | a `ui/` component used that has no spec → flag for backfill | **yes** (specPath from meta) |
| **C5 naming** | error | file names kebab-case (catches the `settings/` PascalCase drift in the KPI feature) | no |
| **C6 import hygiene** | error | components imported from `@/components/ui`, not relative/copied paths | no |

**Output:** JSON report (machine) + human summary. Per-file scores, per-component
error counts, and a build **compliance score 0–100** (weighted: each error −X, each
warn −Y; define weights in a `rubric.json` the owner can tune). Per-component drift
= error count attributable to that component, carried across builds.

---

## Part 3 — Detect (drift clustering)

A Claude Code skill run (scheduled, or on-demand "every N builds"). Reads the last
N ledger entries + their compliance reports and aggregates:

- **Component hotspots:** which components accumulate the most errors.
- **Rule hotspots:** which `ruleId`s fire most.
- **`{component, rule}` clusters:** e.g. `Card / C3-composite: 4 builds`,
  `Button / C1-arbitrary: 2 builds`.
- **Assumption mining:** recurring `assumptions[].category` values = spec-ambiguity
  signals. If the LLM keeps *assuming* the same thing, the spec failed to decide it.

**Output:** a drift report (JSON + feeds the dashboard). Ranked hotspots, newest
first, with links back to the ledger entries that evidence each one.

---

## Part 4 — Prescribe (propose, human approves)

For each top hotspot, generate a **proposed** tightening:

- Which spec file, which rule to add or tighten, the **exact diff**.
- **Evidence trace:** cite the ledger entries that justify it ("drifted in builds
  A, B, C, D — all Card border overrides").
- **Opinion firewall:** if the fix is just *disambiguating an existing rule the LLM
  had to guess on* → propose the edit. If the fix requires a *new design opinion*
  Compass hasn't made yet → do NOT propose a rule; emit a **"needs owner decision"**
  item describing the choice, options, and trade-offs. Never invent the answer.

Output is a markdown plan the owner reviews (this is what feeds the monthly
Claude.ai tightening session). Nothing is applied automatically.

---

## Part 5 — The health dashboard (HTML, no deps)

Model on designsystemops.com's output. Static HTML generated from the JSON reports,
opens in any browser:

- Health radar (one axis per compliance dimension C1–C6)
- Severity distribution (errors vs. warns over the window)
- Priority matrix (frequency × severity — top-right = fix first)
- Per-component score cards (score, top failing rule, trend arrow)
- Trend line: is the system drifting more or less over time? (the single most
  important number — it tells you if the loop is *working*)

---

## Part 6 — Packaging: the third skill

`.claude/skills/compass-audit/SKILL.md` (or `skills/`, per S0's canonical layout):
- What to check (the C1–C6 rubric) and how to run it
- The scoring rubric + weights (references `rubric.json`)
- The detect + prescribe procedure, including the opinion firewall
- Report + dashboard templates

This is the third skill your Phase 4 backlog earmarked ("Compass Review Code skill").

---

## Human-in-the-loop cadence

- **Capture:** continuous (every build).
- **Score:** per build (fast, mechanical).
- **Detect + Prescribe:** weekly to start, relaxing to monthly as the system
  stabilizes (matches your existing cadence plan).
- **Approve:** owner only. Every tightening, every "needs decision" item.

---

## Sub-agent kickoff prompt (paste when S4 track starts)

```
You own the S4 Audit Loop track. Read Compass_GA_Roadmap.md,
.compass-build/STATE.md, and S4_Audit_Loop_Design_Spec.md fully before acting.
Log all progress to .compass-build/log/s4-audit.md.

BUILD NOW (no S1 dependency): the Capture ledger (compass log CLI + drift-log/
schema), compliance-audit.js checks C1/C5/C6 (extend the existing token-audit),
and the static HTML dashboard shell.

DESIGN NOW, BUILD AFTER S1 (meta.ts) LANDS: checks C2/C3/C4, the Detect
clustering skill, and the Prescribe step. Write their design to your log; do not
implement the meta-dependent parts until STATE.md shows S1 exit criteria met.

HARD RULES:
- The loop PROPOSES, the owner APPROVES. Never auto-write a rule.
- A prescription must cite ledger evidence. If a fix needs a new design opinion
  Compass hasn't made, FLAG it as "needs owner decision" — never invent it.
- Plan-then-execute: propose your checklist, wait for Nikhil, execute one item at
  a time, mark each done.
- Explain commands in plain English. Ask before anything irreversible.

Start by proposing your build checklist for the "build now" items and STOP.
```
