# S4 Audit Loop — Track Log

*Append-only. Timestamped. Owner: S4 sub-agent. Gate-keeper: Nikhil.*

---

## 2026-07-06 — Session 1: Read-in + proposed build checklist (AWAITING APPROVAL)

### What I did this session
- Read `Compass_GA_Roadmap.md` (S4 section + standing rules), `.compass-build/STATE.md`,
  and `.compass-build/design/S4_Audit_Loop_Design_Spec.md` in full.
- Studied `scripts/token-audit.js` (327 lines), `package.json`, `CLAUDE.md`, and repo layout.
- Wrote this entry + the proposed checklist below. **No repo files created or
  modified besides this log**, per orchestrator constraint (S0 is running
  concurrently in the same tree; `app/`, `components/`, `scripts/`, `public/`,
  `CLAUDE.md` are off-limits to me this session).

### Findings that shape the build
1. **token-audit.js is a solid C1 base.** It already does hex detection (with
   oklch/attr-selector escapes), Tailwind color-scale utilities (with `/opacity`
   escape for black/white overlays), arbitrary bracket values, and raw px in
   style props. What it lacks for C1 final form: **tiering** (today ALL arbitrary
   values are warnings; the spec wants color/spacing/radius arbitraries = error,
   layout dims like `w-[220px]` = warn), machine-readable output (console only,
   no JSON), `ruleId`s, per-component attribution, and a 0–100 score.
2. **Baseline parity target:** current `npm run audit` = 0 errors / 34 warnings /
   17 files (per STATE.md). The new compliance audit's C1 in "legacy mode" must
   reproduce this exactly before tiering changes anything — that's my regression
   test. Note: C1 tiering *reclassifies* some of today's 34 warnings; with
   current warnings confined to `components/ui/` primitives (which I'll treat as
   system-owned and exclude from *build* scoring by default), repo-wide behavior
   change should be minimal, but the parity check will say precisely.
3. **`npm run audit` stays untouched.** New script lands as
   `scripts/compliance-audit.js` + `npm run audit:compliance`. Swapping the
   `audit` alias (and any commit-gate) over is an owner decision, proposed only
   after parity is proven.
4. **Known C5 quirk:** the PascalCase `settings/` drift lives in the KPI branch,
   which is NOT in this tree (STATE.md approval #4) — so C5 will pass clean here;
   its value is for future designer builds. One live edge: `components/blocks/`
   contains `sign-in-test-2.tsx` (kebab, fine) but `app/test/page.tsx` imports a
   missing file — that's a pre-existing tsc error owned by S0, not mine.
5. **Lint context:** `token-audit.js` currently trips ESLint on `require()`.
   S0 owns housekeeping fixes; I'll write `compliance-audit.js` so it doesn't
   add new lint errors, and won't touch token-audit.js itself.
6. **No git-tracked state assumptions:** repo has fresh local git (baseline
   `f771c27`). `compass log`'s "changed files since last log" capture will use
   `git diff --name-only <last-log-commit-or-timestamp>` with a graceful
   fallback (`git status --porcelain`) and a manual `--files` flag so it never
   hard-fails for a designer.

### PROPOSED BUILD CHECKLIST — "build now" scope (S4.1 Capture + C1/C5/C6 + dashboard shell)

Each item executes one at a time, marked `[x]` here when done, after Nikhil's go.

- [ ] **1. Ledger scaffolding (`drift-log/`).** Create `drift-log/` at repo root
      with: `schema.json` (JSON Schema for the entry format from the design spec
      — timestamp, designer, tool, compassVersion, source, targetFiles,
      componentsUsed, assumptions[{text, category}]), a short `README.md`
      (what this folder is, how entries get here, "machine-readable truth;
      Slack is overflow"), and `entries/` + `reports/` subfolders with
      `.gitkeep`. Plain English: this is the filing cabinet the whole loop
      reads from.
- [ ] **2. `compass log` CLI (`scripts/compass-log.js` + npm script `log`).**
      One command, zero-friction: prompts for a paste of Cursor's "What I
      assumed" block (multi-line, end with blank line or EOF), auto-captures
      changed files via git since the previous ledger entry (fallbacks:
      `git status`, or `--files a.tsx,b.tsx`), auto-infers `componentsUsed` by
      scanning those files for `@/components/ui/<name>` imports, fills
      designer (from `git config user.name`, overridable) + compassVersion
      (from package.json), validates against `schema.json`, writes
      `drift-log/entries/<ISO-timestamp>__<designer>__<slug>.json`, prints what
      it recorded. Assumption categories: free-text with a suggested vocabulary
      (styling | spacing | component-choice | content | behavior | token) —
      suggested, not enforced, so capture never blocks.
- [ ] **3. `scripts/compliance-audit.js` — engine + C1.** New script (token-audit
      untouched). Ports token-audit's scanning core, restructured so every
      finding is `{ ruleId, level, file, line, message, component?, suggestion }`.
      C1 = existing hex/tailwind-color/raw-px checks plus **arbitrary-value
      tiering**: color/spacing/radius arbitraries (`bg-[`, `p-[`, `gap-[`,
      `rounded-[`, `text-[<color>]`…) = **error**; pure layout dims (`w-`, `h-`,
      `min/max-*`, `top/left/right/bottom-`, grid/flex basis px) = **warn**.
      Input modes: whole repo (default), explicit file list, or
      `--entry <ledger-file>` to score exactly one build's targetFiles.
      Output: human summary to console + JSON report to
      `drift-log/reports/<timestamp>__<scope>.json`.
- [ ] **4. C5 naming check.** All files under `app/`, `components/`, `hooks/`,
      `lib/` must be kebab-case (allowing Next.js reserved names like
      `page.tsx`, `layout.tsx`, route groups `(group)`, dynamic `[param]`);
      directories too. Error level. This is the check that would have caught
      the KPI feature's `settings/` PascalCase drift.
- [ ] **5. C6 import hygiene check.** In scanned build files: any import that
      resolves to a ui primitive must come from `@/components/ui/...` — flag
      relative reach-ins (`../../components/ui`, `./ui/button`) and copied
      primitives (a file outside `components/ui/` whose name shadows a ui
      primitive, e.g. a local `button.tsx`). Error level.
- [ ] **6. Scoring + `rubric.json`.** `scripts/audit-rubric.json` with
      owner-tunable weights; proposed defaults: score = 100 − (5 × errors) −
      (1 × warnings), floored at 0, computed per build (per ledger entry) and
      per file; per-component drift = error count attributed via
      componentsUsed + per-finding `component` field. Weights are MY PROPOSED
      DEFAULTS — Nikhil can retune the numbers in one file, no code change.
- [ ] **7. Dashboard shell (`scripts/generate-dashboard.js` + npm script
      `dashboard`).** Reads every JSON report in `drift-log/reports/`, emits
      static self-contained `drift-log/dashboard.html` (inline CSS + SVG, zero
      dependencies, opens by double-click). Sections per design spec Part 5:
      health radar (6 axes C1–C6; C2/C3/C4 rendered greyed "awaiting S1"),
      severity distribution, priority matrix (frequency × severity), per-
      component score cards with trend arrows, and the overall trend line.
      Ships with a friendly empty state ("no builds logged yet — run
      `npm run log`") so it's demo-able on day one.
- [ ] **8. Wire npm scripts + parity verification.** Add `log`,
      `audit:compliance`, `dashboard` to package.json (3-line diff, shown
      before applying since package.json is shared with S0). Then verify:
      (a) compliance audit in C1-legacy mode reproduces token-audit's
      0 errors / 34 warnings baseline exactly; (b) end-to-end dry run — create
      one sample ledger entry against an existing `components/blocks/` file,
      score it, generate the dashboard, eyeball it; (c) `npm run audit` still
      green and untouched. Sample/demo entries clearly marked and removable.
- [ ] **9. Design doc for the meta-gated parts (design-only, no code).** Write
      `.compass-build/design/s4/` PROPOSED designs for C2 (provenance), C3
      (composite completeness), C4 (spec coverage), the Detect clustering skill,
      the Prescribe step with the opinion firewall, and the
      `.claude/skills/compass-audit/SKILL.md` outline — each stating exactly
      which meta.ts fields it consumes, so the moment STATE.md shows S1 exit
      met, build is mechanical. Nothing meta-dependent gets implemented.

### Sequencing / conflict notes
- Items 3–6 and 8 touch `scripts/` and `package.json`, which are off-limits
  while S0 runs in this tree — so execution starts only after Nikhil's go AND
  the orchestrator confirms no S0 collision (or S0 has landed).
- Nothing in this checklist writes rules, edits specs, or changes existing
  audit behavior. The only shared-file edit is the 3-line package.json scripts
  addition (item 8), shown before applying.

### Decisions I need from Nikhil (with the approval)
1. **OK to add scripts as `audit:compliance` alongside `audit`** (recommended),
   leaving the existing commit-blocking `npm run audit` untouched for now?
2. **Git-commit policy for `drift-log/`:** commit ledger *entries* (they're the
   evidence trail — recommended yes); commit generated *reports* + *dashboard.html*
   too, or gitignore the generated ones? My recommendation: commit entries,
   gitignore `reports/` + `dashboard.html` (regenerable).
3. **Rubric defaults** (error −5 / warn −1 from 100): fine as starting point?
   Tunable later in `audit-rubric.json` without code changes.
4. **Should `components/ui/` primitives be excluded from *build* scoring by
   default** (they're system-owned; designers don't touch them), while still
   scanned in whole-repo mode? Recommended yes.

**STATUS: STOPPED. Awaiting Nikhil's approval of the checklist + the 4 decisions
above before executing item 1.**
