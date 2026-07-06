# Compass GA Build — Execution Plan (PROPOSED)

**Status: AWAITING NIKHIL'S APPROVAL — nothing below executes until approved.**
Source of truth: `Compass_GA_Roadmap.md` (repo parent folder). This plan implements
it; it never overrides it. Drafted 2026-07-06 by Claude Code (orchestrator).

---

## 0. Baseline (recorded 2026-07-06, before any change)

Environment: local snapshot at `enterprise-compass-design-system-main/`.
**No `.git` directory exists** — this is a downloaded zip, not a clone. Git must
be initialized (locally only) before the commit strategy below can work.
`npm install` succeeded (967 packages; private `@acko/enterprise-tokens@1.0.0`
resolved from Acko's Nexus registry).

**Pre-existing issues — NOT caused by this build, never to be attributed to it:**

| Check | Result | Pre-existing issues |
|---|---|---|
| `npm run audit` | **PASS** (0 errors) | 34 warnings across 17 files — arbitrary values inside `components/ui/` primitives themselves (`ring-[3px]`, `text-[0.8rem]`, `rounded-[2px]`, etc.) |
| `npx tsc --noEmit` | **1 error** | `app/test/page.tsx` imports `@/components/blocks/sign-in-test`, but the folder only contains `sign-in-test-2.tsx` — broken import predates us |
| `npm run lint` | **5 errors, 3 warnings** | setState-in-effect in `components/ui/carousel.tsx:98` and `hooks/use-mobile.ts:14`; `require()` imports in `scripts/token-audit.js:17-18`; unescaped `'` in `components/blocks/sign-in-test-2.tsx`; 3 unused-variable warnings |
| `npm install` | OK | 21 npm dependency vulnerabilities (2 low / 6 moderate / 9 high / 4 critical) — dependency-level, untouched (fixing would change deps) |

**Grounding facts confirmed:**
- 55 components in `components/ui/`; 33 specs in `.claude/specs/components/`; 3 skills.
- This snapshot has the **late-June layout**: `.claude/specs/`, **no** `stories/`, **no** top-level `specs/`. The KPI-feature branch is **not present** in this folder.
- Spec sweep (sub-agent, full read of all 43 spec/skill files): **zero Radix-era staleness** — all 33 specs already Base UI-aligned (`render` prop, no `asChild`, no `data-[state=…]`). S0.3 becomes a verification pass, not a rewrite.
- `app/layout.tsx` loads Geist + "Create Next App" metadata (roadmap's S0.2 diagnosis confirmed). Tokens live in the `@acko/enterprise-tokens` package, not hand-written in `globals.css`.
- Storybook 10 installed and configured (`.storybook/main.ts` reads `../stories/**`), but no `stories/` directory exists — zero stories, as the roadmap says.

---

## 1. CRITICAL-PATH TRACK (orchestrator-owned, strictly sequential)

`S0 → S1 → S2 → S3 → S4`. A stage starts only when the prior stage's exit
criterion is met **and Nikhil has approved it**. One checklist item at a time.

### S0 — Reconcile & true the foundation
- **S0.0 (new, forced by reality): initialize local git.** No `.git` exists. `git init` + initial commit tagged `baseline-2026-07-06` so every later change is diffable. *Needs approval.*
- **S0.1 Layout reconciliation** — BLOCKED on Nikhil's canonical-layout decision (see §4 Open Decisions). Note: the KPI branch isn't in this snapshot, so full merge reconciliation happens later on GitHub; locally we conform *this* tree to the chosen layout.
- **S0.2 Euclid Circular B** — Nikhil supplies the licensed `.woff2` files (we cannot download a licensed font); wire via `next/font/local` in `app/fonts/`; set `--font-sans/serif/mono`; remove Geist; fix metadata + favicon; delete starter SVGs *(deletion = approval gate)*; re-render check.
- **S0.3 Base UI accuracy** — sweep already found zero staleness; remaining work: compile-verify spec code examples (fold into S1 generation loop as a cheap double-check).
- **Exit:** Euclid rendering, boilerplate gone, specs verified, audit still 0 errors, tsc/lint no worse than baseline. → *Nikhil approves before S1.*

### S1 — meta.ts keystone (55 components)
- `_meta-schema.ts` (ComponentMeta; category extended to atom|molecule|organism|template|pattern) → **schema itself is an approval gate**.
- Fable 5 generates rich meta for the 33 specced (antiPatterns/aiHints/confusedWith flagged **PROPOSED** until reviewed), lightweight meta for the 22 unspecced.
- Batch size ~5 components per commit; `npx tsc --noEmit` after every batch.
- Nikhil spot-checks 5–10 (focus: antiPatterns, confusedWith — invention risk).
- **Exit:** 55 meta files + `_meta-index.ts` compile clean; spot-check passed. → *approval.*

### S2 — Storybook (Astryx-feel) + Compass SOP
- S2.1 structure/Getting Started → S2.2 Foundations from live tokens → S2.3 all 55 component docs read from meta.ts → S2.4 SOP ("Working with Compass" + "Working with AI") → S2.5 versioning surface + deploy.
- All SOP prose and doc opinions sourced from specs/CLAUDE.md/roadmap only — **no invented opinions**; anything new is flagged PROPOSED.
- Deploy target (Chromatic vs Vercel) = decision for Nikhil at S2.5.
- **Exit:** Storybook builds locally with all 55 documented + SOP; deployed URL. → *approval.*

### S3 — Package & distribution
- Barrel, tsup, exports map, `.npmignore`, semver policy (**PROPOSED** text for approval), changelog discipline, publish to Acko registry, `npx compass init` CLI, fresh-app verification.
- Publishing to the registry = outward-facing → explicit approval gate.
- **Exit:** fresh Next app installs Compass + `compass init` works. → *approval.*

### S4 — Self-correcting audit loop → SHAREABLE GATE
- S4.1 drift ledger capture → S4.2 compliance scoring (extend token-audit.js) → S4.3 drift detection skill → S4.4 tightening-plan proposals + HTML health dashboard.
- Tightening plans are always PROPOSED, never auto-applied.
- **Exit:** designer build → compliance score; drift run → approvable plan + dashboard. **Compass opens to designers here.** → *approval.*

---

## 2. PARALLEL DESIGN TRACKS (sub-agents; DESIGN now, IMPLEMENTATION gated)

Sub-agents may **design** — write skill drafts, spec outlines, UI shells,
architecture notes — into `.compass-build/design/<track>/` immediately. They may
**not** implement anything gated. Every design doc lands as PROPOSED.

| Track | Designs now (allowed) | Implementation gate |
|---|---|---|
| **audit-loop (S4)** | `compass-audit` skill draft; ledger entry format; scoring rubric; dashboard HTML mock (static sample data) | Scoring rules that resolve against component metadata (composite sub-part checks, spec-coverage checks) **cannot be built until S1 `meta.ts` lands**. Basic non-meta checks (naming convention, arbitrary-value tiering) may be built once **S0 exits**, since they extend the existing local script and ship in-repo, not as a package feature. |
| **migration (S5)** | Skill architecture doc (strangler-fig, golden-pair diffing, report format — reverse-engineered from shadcn's migrate skill); Storybook "Migrate" surface UI shell; batch-flow wireframe | Inventory/mapping engine resolves targets against `meta.ts` → **blocked until S1 lands**. Anything shipping as a package/CLI feature (`compass migrate`) → **blocked until S3 lands**. Mapping heuristics themselves → Nikhil approval (roadmap standing rule). |
| **extensibility (S6)** | `compass add` scaffold-skill draft; promotion-pipeline SOP draft; promotion-candidate dossiers (PillSelector, GranularityToggle, DateNavigator, ChartCard, KpiRow, ConfiguratorModal, chart states — *note: KPI feature code is not in this snapshot; dossiers stay outline-level until it's available*) | Scaffold generates meta.ts + story → **blocked until S1** (meta schema) **and S2** (story format exist). Semver-aware publishing → **blocked until S3**. Each promotion → individual Nikhil approval. |

Parallel tracks start **only after this PLAN is approved**, and their design
docs are review material, not commitments.

---

## 3. SHARED CONTEXT PROTOCOL (mandatory for every agent)

1. On session start, **read** `Compass_GA_Roadmap.md` + `.compass-build/STATE.md`. No exceptions.
2. **Log** progress to `.compass-build/log/<track>.md` (tracks: `critical-path`, `audit-loop`, `migration`, `extensibility`) — append-only, timestamped entries: what was done, what's PROPOSED, what's blocked.
3. Sub-agents share **no live context window** — these files are the only channel. Writing them is part of the task, not optional.
4. Orchestrator updates `STATE.md` after every stage transition, approval, or blocker.
5. Design outputs go to `.compass-build/design/<track>/`; nothing under `.compass-build/` ships in the published package.

---

## 4. OPEN DECISIONS (blocking, Nikhil only)

1. **Canonical spec/story layout (blocks S0.1).** This snapshot: `.claude/specs/`, no `stories/`. **Recommendation: keep `.claude/specs/` canonical** (Claude Code auto-reads it; CLAUDE.md, all 3 skills, and the audit output already point there) **and add top-level `stories/`** for Storybook (`.storybook/main.ts` already expects `../stories/`). Specs and stories are different artifacts — this isn't a compromise, it's the correct separation. Optional top-level `specs → .claude/specs` symlink or docs pointer for humans.
2. **Git initialization (blocks all commits).** Approve `git init` + baseline commit/tag in this folder. Local only; nothing pushes anywhere.
3. **Euclid Circular B files (blocks S0.2).** Nikhil provides licensed `.woff2` (Regular/Medium/SemiBold/Bold + italics as available). We can't fetch a licensed font ourselves.
4. **KPI-feature branch access (affects S0.1 finalization + S6 dossiers).** Not in this snapshot. Provide it (second download or repo access), or confirm we proceed on this tree and reconcile on GitHub at stage-push time.

## 5. APPROVAL GATES (standing, from roadmap rule #1)

Every generative output is **PROPOSED** until Nikhil approves: meta.ts
antiPatterns/aiHints/confusedWith · new/edited specs · SOP text · audit scoring
rubrics & tightening plans · migration mappings & heuristics · semver policy ·
promotion candidates. No invented opinions, ever — anything not traceable to a
spec, CLAUDE.md, the roadmap, or real product code gets flagged, not written as fact.

## 6. LOCAL COMMIT STRATEGY

- Git is **local only**. No remote configured until Nikhil wires one; `git push` never runs without explicit per-stage approval.
- One commit per stage minimum; within S1, one commit per ~5-component meta batch; within S2, one per Storybook section.
- Commit message format: `S<stage>.<task>: <what> [PROPOSED|APPROVED]`.
- Stage completion → tag `s<N>-complete` → Nikhil reviews → only then is a push/PR to main discussed. Never a big-bang push.
- Before every commit: `npm run audit` (0 errors) + `npx tsc --noEmit` (no new errors vs baseline).
