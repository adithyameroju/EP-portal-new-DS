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

- [x] **1. Ledger scaffolding (`drift-log/`).** Create `drift-log/` at repo root
      with: `schema.json` (JSON Schema for the entry format from the design spec
      — timestamp, designer, tool, compassVersion, source, targetFiles,
      componentsUsed, assumptions[{text, category}]), a short `README.md`
      (what this folder is, how entries get here, "machine-readable truth;
      Slack is overflow"), and `entries/` + `reports/` subfolders with
      `.gitkeep`. Plain English: this is the filing cabinet the whole loop
      reads from.
- [x] **2. `compass log` CLI (`scripts/compass-log.js` + npm script `log`).**
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
- [x] **3. `scripts/compliance-audit.js` — engine + C1.** New script (token-audit
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
- [x] **4. C5 naming check.** All files under `app/`, `components/`, `hooks/`,
      `lib/` must be kebab-case (allowing Next.js reserved names like
      `page.tsx`, `layout.tsx`, route groups `(group)`, dynamic `[param]`);
      directories too. Error level. This is the check that would have caught
      the KPI feature's `settings/` PascalCase drift.
- [x] **5. C6 import hygiene check.** In scanned build files: any import that
      resolves to a ui primitive must come from `@/components/ui/...` — flag
      relative reach-ins (`../../components/ui`, `./ui/button`) and copied
      primitives (a file outside `components/ui/` whose name shadows a ui
      primitive, e.g. a local `button.tsx`). Error level.
- [x] **6. Scoring + `rubric.json`.** `scripts/audit-rubric.json` with
      owner-tunable weights; proposed defaults: score = 100 − (5 × errors) −
      (1 × warnings), floored at 0, computed per build (per ledger entry) and
      per file; per-component drift = error count attributed via
      componentsUsed + per-finding `component` field. Weights are MY PROPOSED
      DEFAULTS — Nikhil can retune the numbers in one file, no code change.
- [x] **7. Dashboard shell (`scripts/generate-dashboard.js` + npm script
      `dashboard`).** Reads every JSON report in `drift-log/reports/`, emits
      static self-contained `drift-log/dashboard.html` (inline CSS + SVG, zero
      dependencies, opens by double-click). Sections per design spec Part 5:
      health radar (6 axes C1–C6; C2/C3/C4 rendered greyed "awaiting S1"),
      severity distribution, priority matrix (frequency × severity), per-
      component score cards with trend arrows, and the overall trend line.
      Ships with a friendly empty state ("no builds logged yet — run
      `npm run log`") so it's demo-able on day one.
- [x] **8. Wire npm scripts + parity verification.** Add `log`,
      `audit:compliance`, `dashboard` to package.json (3-line diff, shown
      before applying since package.json is shared with S0). Then verify:
      (a) compliance audit in C1-legacy mode reproduces token-audit's
      0 errors / 34 warnings baseline exactly; (b) end-to-end dry run — create
      one sample ledger entry against an existing `components/blocks/` file,
      score it, generate the dashboard, eyeball it; (c) `npm run audit` still
      green and untouched. Sample/demo entries clearly marked and removable.
- [x] **9. Design doc for the meta-gated parts (design-only, no code).** Write
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

---

## 2026-07-06 — Session 2: Approved build executed (items 1–9 DONE)

Nikhil approved the full checklist + all 4 decisions (via orchestrator):
(1) `audit:compliance` additive, token-audit stays the commit gate — and is now
`scripts/token-audit.mjs` (ESM), so all new scripts are `.mjs`;
(2) commit ledger entries, gitignore generated reports + dashboard;
(3) rubric defaults 100 / −5 / −1 approved as tunable start;
(4) `components/ui/` excluded from compliance scoring.
Mid-session interruption: usage-limit kill after item 7 — orchestrator
checkpoint-committed; on resume all scripts verified working on disk before
continuing (node --check + functional re-runs).

### What was built
1. **[x] Ledger scaffolding** — `drift-log/{schema.json, README.md, entries/, reports/}`.
   Schema adds optional `gitHead` (enables since-last-log diffing), `notes`, `demo`.
2. **[x] `compass log` CLI** — `scripts/compass-log.mjs` (`npm run log`).
   Interactive paste OR flags-only (`--no-input`); auto-detects changed files via
   git (fallbacks: `git status`, `--files`), auto-infers componentsUsed from
   `@/components/ui/*` imports, validates, writes timestamped entry.
3. **[x] Compliance engine + C1** — `scripts/compliance-audit.mjs`
   (`npm run audit:compliance`). Finding shape `{ruleId, level, file, line,
   message, component?, suggestion}`. C1 ported from token-audit + tiering:
   spacing/radius/typography arbitraries = ERROR (`C1-arbitrary-value`), layout
   dims = WARNING (`C1-arbitrary-layout`), unknown prefixes stay warnings.
   Modes: repo (default, ui/ excluded) | file args | `--entry <ledger>` |
   `--parity` (token-audit replication self-test, ui/ included, legacy
   severities, no report) | `--no-report`.
4. **[x] C5 naming** — kebab-case files+dirs in app/, components/, hooks/, lib/,
   stories/; allows Next conventions ((group), [param], @slot, _prefix — also
   future `_meta-schema.ts`); code files only (README.md etc. untouched).
5. **[x] C6 import hygiene** — `C6-import-path` (relative/non-alias ui imports)
   + `C6-shadow-primitive` (file outside ui/ named after a primitive;
   code-connect/ exempt).
6. **[x] Scoring + rubric** — `scripts/audit-rubric.json` (approved defaults);
   overall + per-file scores, per-component attribution via JSX-tag heuristic
   (longest-Pascal-match), byRule totals; JSON report to `drift-log/reports/`.
7. **[x] Dashboard shell** — `scripts/generate-dashboard.mjs` (`npm run dashboard`)
   → self-contained `drift-log/dashboard.html` (inline CSS/SVG, zero deps):
   health radar (C2/C3/C4 greyed "activate when S1 lands"), severity
   distribution, priority matrix, per-component cards w/ trend arrows, score
   trend line, friendly empty state.
8. **[x] Wiring + verification** — package.json scripts (`log`,
   `audit:compliance`, `dashboard`; 3 lines after `audit`), .gitignore
   (`/drift-log/reports/*.json`, `/drift-log/dashboard.html`). Evidence:
   - **Parity:** `token-audit.mjs` vs `compliance-audit.mjs --parity` on the
     same tree: **114 files / 0 errors / 34 warnings — IDENTICAL** (earlier in
     the session both equally reported 2 hex errors from S5's in-progress
     `components/blocks/migrate/mock-data.ts`, since fixed upstream — the
     ports agreed finding-for-finding throughout).
   - **Rule self-test:** throwaway fixture (`lib/s4-selftest/`, deleted after)
     fired all 9 rule paths with correct severities; score 63/100 = 100−7·5−2·1. ✓
   - **E2E:** `npm run log` (demo entry, `components/blocks/sign-in-test-2.tsx`,
     components auto-detected: button/card/input/label, 2 categorized
     assumptions) → `npm run audit:compliance -- --entry …` → **100/100**,
     report written → `npm run dashboard` → all sections render.
   - **Repo green:** `npm run audit` 0 err/34 warn (baseline parity),
     `npx tsc --noEmit` clean, `npm run lint` clean. Repo-wide compliance
     snapshot (ui/ excluded): 27 files, 0/0, **100/100**.
   - Sample entry `2026-07-06T16-03-29-094Z__nikhil__s4-demo.json` kept on disk,
     marked `"demo": true` (Detect will ignore it) — serves as the format
     example; Nikhil may delete it freely.
9. **[x] Meta-gated designs (design-only)** — `.compass-build/design/s4/`:
   `c2-c3-c4-checks.PROPOSED.md`, `detect-clustering.PROPOSED.md`,
   `prescribe.PROPOSED.md` (opinion firewall spelled out),
   `compass-audit-skill.PROPOSED.md`, **plus new backlog item**
   `c7-font-compliance.PROPOSED.md` (paint-level font check: static
   declaration-consistency tier C7a + Playwright rendered-DOM probe tier C7b —
   designed only, 3 owner decisions flagged inside). Nothing meta-dependent
   implemented; gate remains STATE.md showing S1 exit met.

### Flagged for Nikhil
- **C2 needs one meta field:** requested `primitiveElements?: string[]` in the
  S1 ComponentMeta schema (see c2-c3-c4 design doc) — S1 owner's call.
- **C7a could be built pre-S1** (no meta dependency) but is outside the
  approved build-now scope — awaiting explicit go (decision list in the C7 doc).
- **compass-audit skill folder** will live under `.claude/skills/` (currently
  S5-locked) — needs orchestrator clearance at build time.
- Demo ledger entry: keep as living format example, or delete — either is fine.

**STATUS: Build-now scope COMPLETE and verified. Next S4 action: implement
C2/C3/C4 + Detect + Prescribe when STATE.md shows S1 exit criteria met.**

---

## 2026-07-07 — Session 3: Meta-gated half built (S1 exit met; run-freely grant)

Gate lifted per STATE.md (S1 COMPLETE, tag `s1-complete`). Coordinator relayed
Nikhil's run-freely autonomy for exactly: C2/C3/C4, Detect clustering,
Prescribe scaffolding, + clearance for `.claude/skills/compass-audit/`.
C7 stays design-only. Meta files are read-only owner artifacts — untouched.

### Decisions taken (logged per instruction)
1. **C2 element mapping — DERIVED, not invented.** `primitiveElements` is still
   an open owner ruling, so `deriveElementMap()` builds the raw-element →
   primitive map at audit runtime from two citable signals per primitive
   source (renders the raw element; types as `React.ComponentProps<"el">`),
   plus the CLAUDE.md-cited baseline for button/input ("Never write a raw
   <button>, <input>…"). TODO in code keyed to the pending ruling. Result map:
   button→button (claude-md), input→input (claude-md), select→native-select,
   textarea→textarea, table→table (derived). Escape hatch:
   `// compass-allow: raw-<el>`.
2. **C3 severity uniform WARNING.** Meta has no "required sub-part" flag to
   cite, so promoting specific composites (e.g. dialog without DialogTitle) to
   error is flagged as a pending owner tuning decision — not invented.
3. **C2 shape-match is meta-token-driven**: div/span carrying ≥2 of a
   primitive's `meta.tokens` (≥1 distinctive to ≤2 components) without
   importing it → warning, explicitly labeled heuristic.

### What was built
- **C2/C3/C4 live** in `scripts/compliance-audit.mjs`. Meta loaded read-only by
  transpiling `components/ui/*.meta.ts` with the repo's own `typescript`
  devDependency (zero new deps); graceful skip (C1/C5/C6 keep working) if meta
  ever fails to load. `checks.implemented` in reports is now dynamic.
- **Detect** — `scripts/detect-drift.mjs` (`npm run detect`). Window of last N
  non-demo entries (N from `rubric.detect.windowSize`, default 10), joins
  reports via `report.entry`, aggregates component/rule hotspots,
  {component,rule} clusters counted in DISTINCT BUILDS (hotspot ≥
  `rubric.detect.hotspotMinBuilds`, default 3), assumption themes (category +
  ≥2 shared content words), unscored entries. Every hotspot carries evidence
  entry filenames. Demo entries excluded unless `--include-demo`
  (output then labeled DEMO). JSON + md to `drift-log/detect/` (gitignored).
- **Prescribe scaffold** — `scripts/prescribe.mjs` (`npm run prescribe`).
  Opinion firewall implemented exactly per design: locates governing doc
  (meta specPath → foundations spec → CLAUDE.md), QUOTES existing rule lines
  verbatim (never rewrites), classifies Case A (ambiguity-tightening candidate,
  `[DRAFT REQUIRED]` placeholder — the scaffold never drafts rules) vs Case B
  (NEEDS OWNER DECISION, options only, no recommendation-as-rule). Below
  threshold → "Watching, not acting". No-evidence items are refused. Output:
  `drift-log/proposals/<date>__tightening-plan.md` (committed; `.SAMPLE` +
  banner when built from demo-mode detect). Nothing is ever applied.
- **Third skill** — `.claude/skills/compass-audit/` (folder shape per owner's
  S5 ruling): `SKILL.md` (hard rules first, rubric table, score/detect/
  prescribe procedures incl. the firewall verbatim), `rubric-reference.md`
  (every ruleId), `templates/tightening-plan.md`.
- **Wiring**: npm scripts `detect` + `prescribe`; `.gitignore` +
  `/drift-log/detect/` (entries + proposals stay committed); rubric gains
  owner-tunable `detect.hotspotMinBuilds`/`windowSize`; dashboard radar axes
  now un-grey automatically from the latest report's `checks.implemented`.

### Verification (all outputs in session transcript)
- **Fixture test**: raw <button>/<input>/<select> → 3× C2-raw-element (correct
  mappings + provenance shown); `compass-allow: raw-textarea` suppressed;
  Card-without-subparts → C3; spinner import → C4-unspecced; hand-rolled
  popover-ish div → C2-shape-match. Fixture deleted.
- **Full pipeline (synthetic, honestly labeled)**: 3 fixture builds logged as
  `demo:true` entries → scored 99/99/94 (C3×3 builds; C1-arbitrary-value×1) →
  `npm run detect` default: **0 in window (demo exclusion proven)** →
  `--include-demo`: 1 hotspot cluster `card/C3-missing-subparts: 3 builds` +
  1 assumption-theme hotspot (card border, 4 assumptions/4 builds) →
  `npm run prescribe`: SAMPLE plan with Case A candidate quoting card.md's
  real rule ("do not recreate their layout manually with divs", L28–29),
  full evidence traces, DRAFT-REQUIRED placeholder, watching section.
  Fixtures deleted; demo entries + SAMPLE plan kept (clearly bannered).
- **Repo green**: `npm run audit` 0 err / 34 warn @159 files; parity mode
  IDENTICAL (159/0/34); `npx tsc --noEmit` clean; `npm run lint` clean.
  (One transient `npm run audit` run mid-session showed 485 errors from
  another track's in-flight story files; it self-resolved and cannot be from
  S4 — scripts/ is excluded from token-audit and drift-log emits only
  .json/.md/.html, which token-audit never scans.)
- **Repo-wide compliance snapshot** now surfaces REAL cross-track signal:
  C5-naming×7 (PascalCase `stories/foundations/*.tsx`), C2-raw-element×6
  (raw <button>s in stories), C4-unspecced×6 (migrate blocks), C3×1, score
  22/100. Advisory only — token-audit gate unaffected.

### Flagged for Nikhil (owner decisions, not resolved by the loop)
1. **Stories naming**: `stories/foundations/*.tsx` are PascalCase; the
   documented kebab-case rule flags them (C5). Enforce kebab in stories/, or
   carve out a Storybook-convention exception? (Also affects future
   `*.stories.tsx` naming.)
2. **Raw <button> in foundations stories** (S2 work): real C2 errors by the
   current rule — Compass Button, or `compass-allow` escapes for spec-demo
   purposes? S2's call with your sign-off.
3. **C3 severity promotion** (e.g. dialog missing DialogTitle → error) —
   needs either a meta "required sub-part" flag (schema change, your call) or
   a rubric override list.
4. **`primitiveElements` on ComponentMeta** — still open; C2 derivation works
   without it but the field would make the mapping explicit and reviewable.
5. Demo entries (4) + SAMPLE tightening plan are kept as living pipeline
   examples, all clearly marked — delete any time.

**STATUS: S4 scope COMPLETE — Capture, Score C1–C6, Detect, Prescribe
scaffold, dashboard, and the compass-audit skill are all live and verified.
Remaining S4 items are all owner-gated: C7 build approval, the 5 flags above,
and first real (non-demo) capture once designers start building.**

## 2026-07-07 — First live C2 heuristic-tuning signal (from owner ruling)
ElevationBlocks (stories/foundations, L40 + L78): shape-match flagged demo
swatches as "hand-rolled Menubar/Resizable" because they coincidentally carry
those components' signature token combos (bg-muted+rounded-lg; ring-ring+
ring-offset-background). Owner ruling: warnings stay in place as tuning data.
Tuning direction for next S4 session: the C2 shape-match heuristic must
distinguish "carries these token classes" from "is actually this component" —
candidate signals: element role/interactivity (button/anchor vs presentational
div), structural children match vs bare styled box, and count of distinctive
vs generic tokens. Do not tune away sensitivity without a false-negative check.

---

## 2026-07-07 — Session 4: C7a built (static font declaration-consistency)

Build granted per STATE.md DECISION LOG 2026-07-07 PROVISIONAL entry
("remaining steps for S4" read as the C7a go). **C7b (Playwright paint probe)
stays unbuilt** — trigger policy is still an open owner decision.

### What was built
- **C7a in `scripts/compliance-audit.mjs`** (additive; token-audit.mjs
  untouched). Repo mode only — it grades the project's font wiring, not a
  designer's build, so entry/files/parity scores are unaffected.
  - Parses `--font-*` declarations in
    `node_modules/@acko/enterprise-tokens/globals.css` (the css the app
    actually imports) → non-system families needing hosting (system-stack
    allowlist exempt).
  - Parses every `@font-face` in `app/**/*.css` (fonts.css today;
    future-proof) → families + weights (single values, keywords, and
    variable-font ranges).
  - **`C7-fontface-missing` (error)**: token-declared family with zero
    @font-face under that EXACT name — the S0 silent-fallback failure; exact
    string match on purpose, with a near-miss note when a case/name-mismatched
    face exists.
  - **`C7-weight-gap` (warning)**: weights listed in the typography spec's
    Font-weights table (parsed from the md, not hardcoded) that no hosted
    face/range covers.
  - Severities + system-family allowlist owner-tunable in
    `scripts/audit-rubric.json` → new `"c7a"` block (code carries fallback
    defaults). Graceful skip (with honest `checks.skipped`) if the tokens
    package css is absent.
- **Report shape**: `checks.implemented` gains `C7a` when it ran;
  `designOnly` is now `["C7b"]`.
- **Dashboard** (`scripts/generate-dashboard.mjs`): radar gains the `C7 Fonts`
  axis; auto-ungrey logic now rolls tier ids up to their axis (`C7a` → `C7`),
  so the axis went live automatically from the first post-build report.
- **Parity mirror re-synced**: token-audit.mjs gained a `storybook-static`
  exclusion (S5's Storybook build output) since the last parity check; added
  the same dir to `EXCLUDE_DIRS_LEGACY` (comment cites the sync) — this also
  keeps generated Storybook bundles out of compliance repo mode. token-audit
  itself untouched, per standing rule.

### Verification
- **Repo mode (healthy current state)**: 101 files; C7a contributes exactly
  `C7-weight-gap×1` on app/fonts.css — spec lists 100–900, hosted = 300–700,
  missing 100/200/800/900 — and **zero `C7-fontface-missing`**. All other
  rule counts unchanged by C7a.
- **Error path (throwaway fixture, deleted after; real fonts.css never
  touched)**: scratchpad copy of the script + minimal tree. (a) fonts.css
  registering `"euclid circular b"` (case mismatch) → C7-fontface-missing
  ERROR with near-miss diagnosis, exit 1, score 95/100; (b) no @font-face at
  all (the literal S0 state) → same error, no near-miss note. Fixture deleted.
- **Parity**: `npm run audit` vs `--parity`, same tree, same moment:
  **214 files / 1 error / 68 warnings — IDENTICAL** (after the
  storybook-static re-sync; before it, parity mode was scanning 207 generated
  bundle files token-audit now skips). No C7 rules fire in parity mode.
- **Dashboard**: regenerated; all 7 axes (C1–C7) render live from the latest
  report's `checks.implemented`.
- **My files green**: `node --check` both scripts, `npx eslint` on both = 0
  problems, rubric JSON parses.
- **Repo-level reds are cross-track, not S4's** (verified sources):
  `npm run audit` 1 error = `bg-white` in generated `dist/index.js` (new
  root-level build artifact token-audit doesn't exclude — flagged below);
  `tsc` errors in `stories/patterns/migrate.stories.tsx` (S3 in-flight);
  lint noise from minified bundles. S4 touched only scripts/*.mjs +
  rubric json + .compass-build docs — none type-checked or scanned by those.

### Flagged for Nikhil
1. **Weight-gap ruling (new live signal)**: every repo run now carries one
   C7-weight-gap warning (100/200/800/900 unhosted). Host the missing weights
   or narrow the spec's weight table — owner call, both sides are owner
   artifacts.
2. **`dist/` build artifact breaks the commit gate**: something generated
   `dist/index.js` at repo root; token-audit scans it (`bg-white` error,
   line 5806) and it isn't S4's to exclude or delete. Whichever track emits it
   should gitignore/exclude it — else `npm run audit` stays red.
3. C7a deferred sub-checks (dead-weight declared faces; `src:` file existence)
   were in the original design sketch but outside the granted wording — cheap
   to add on request.
4. C7b decisions still open: trigger policy + probe surface (design doc §NEEDS
   OWNER DECISION, items 2–3).

**STATUS: C7a live and verified. C7b design-only, awaiting trigger-policy
decision.**
