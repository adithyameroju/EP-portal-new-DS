# COMPASS_SYSTEM.md — the durable system handbook

**Stamped at tag `s3-build-complete` · 2026-07-07.** Everything below describes
what is actually built and verified in this repo at that tag. Anything planned
but NOT built is listed only in §9 ("Not built — do not assume"). Live build
state always supersedes this file: read `.compass-build/STATE.md` first.

---

## 1. What Compass is, in one paragraph

Compass is Acko's enterprise design system: 55 shadcn/ui-v4 components on
**Base UI** (not Radix), styled exclusively through a 3-layer semantic token
system, documented by machine-readable per-component contracts (`meta.ts`),
surfaced in a deployed Storybook, distributed as an npm package + CLI, policed
by a two-tier audit system (hard token gate + behavioral compliance loop), and
extended into foreign codebases by a migration skill. Its governing philosophy:
**the system proposes, the owner (Nikhil) approves; opinions are never
invented — every rule traces to a spec, and gaps are flagged, not filled.**

## 2. Architecture — the five surfaces and how they connect

```
                    ┌────────────────────────────────────────────┐
   Figma library ──▶│  SPECS (.claude/specs) + CLAUDE.md rules   │◀─ owner rulings
   (zgzPlhKxDXc3E9…)└──────────────────┬─────────────────────────┘   (DECISION LOG)
                                       │ S1 generation (cited, uncitable=omitted)
                                       ▼
                    ┌────────────────────────────────────────────┐
                    │  META LAYER components/ui/*.meta.ts (×55)  │  the machine-
                    │  + _meta-schema.ts + _meta-index.ts        │  readable contract
                    └───┬──────────────┬──────────────┬──────────┘
            reads meta  │              │              │ resolves against meta
                        ▼              ▼              ▼
              ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐
              │ STORYBOOK    │ │ AUDIT LOOP   │ │ MIGRATION TOOL   │
              │ (docs+SOP,   │ │ (C1–C7a,     │ │ (compass-migrate │
              │  Chromatic)  │ │  loop below) │ │  skill + engine) │
              └──────────────┘ └──────────────┘ └──────────────────┘
                        ▲              ▲              │ gap list feeds S6 (future)
                        └──────┬───────┘              │
                               │                      ▼
                    ┌──────────┴───────────┐  .migration/ reports in target repo
                    │ PACKAGE + CLI        │
                    │ (lib barrel, tsup,   │──▶ consumer projects
                    │  compass init)       │    (governance travels with install)
                    └──────────────────────┘
```

**Data flow of a designer build (the core loop):** Figma frame → Cursor/Claude
with `.claude/skills/generate-code.md` (constrained by CLAUDE.md + specs +
meta) → generated component → `npm run audit` (hard gate, 0 errors) →
`npm run audit:compliance` (behavioral score) → designer reviews "What I
assumed" → `npm run log` (drift ledger entry) → periodically `npm run detect`
(hotspots) → `npm run prescribe` (proposed spec tightenings, owner approves) →
approved spec edits regenerate that component's meta → Storybook rebuild →
`npm run chromatic` republish. That closed loop is the whole point.

## 3. The concepts and WHY

- **3-layer tokens.** Layer 1: Tailwind primitives. Layer 2: Acko brand
  aliases with light/dark values. Layer 3: shadcn-compatible semantic names
  (`--primary`, `--card`…). Code uses ONLY Layer-3 classes (`bg-primary`).
  The layers live in the **`@acko/enterprise-tokens@1.0.0`** npm package
  (Acko Nexus; FE-dev confirmed 2026-07-07 as the baseline), imported by
  `app/globals.css`. CRITICAL GOTCHA: the package declares its theme with
  `@theme inline`, meaning values compile into utilities at build time —
  runtime CSS-variable overrides are NOT read. This is why fonts are wired as
  classic `@font-face` under the exact family name `"Euclid Circular B"` in
  `app/fonts.css` (10 cuts, 300–700 + italics) instead of next/font: the
  package names the family literally, and Storybook imports globals.css
  without layout.tsx. (Full postmortem: critical-path log, session 4.)
- **meta.ts as the machine-readable contract.** Each component's
  `<name>.meta.ts` implements `ComponentMeta` (`_meta-schema.ts`): category
  (atom|molecule|organism|template|pattern), purpose, useCases, antiPatterns
  ({wrong, instead, source}), variant axes (verbatim from cva/types),
  parent/childComponents, tokens, a11y, aiHints (selectionCriteria,
  confusedWith, compositionRules, source), specStatus (specced ×33 /
  lightweight ×1 alert-dialog / none ×21), specPath, codeConnectStatus
  (mapped ×10), primitiveSource (base-ui|vaul|cmdk|embla|…), version.
  **The provenance rule is structural: every antiPattern/aiHints entry carries
  a `source:` citation; anything uncitable was omitted, never invented.**
  Consumers: Storybook doc pages, audit checks C2/C3/C4, migration resolution
  (B1 scoring), and the future S6 scaffold.
- **Closed-set / spec-first.** CLAUDE.md (auto-loaded) forbids raw elements
  where a Compass component exists, forbids new ui/ files without owner
  confirmation, and makes specs binding ("follow it exactly"). The audit
  enforces the token half mechanically.
- **Propose → approve firewall.** No generative output ships without owner
  approval. The DECISION LOG in STATE.md is append-only settled law. PROPOSED
  artifacts live in `.compass-build/design/`. The prescribe step encodes the
  firewall in code: it never drafts rules (Case A emits `[DRAFT REQUIRED]`
  placeholders; Case B emits `NEEDS OWNER DECISION` with options only).
- **Base UI, not Radix.** Composition uses the `render` prop, never `asChild`
  (one documented exception: Drawer wraps vaul, which is Radix-based and
  legitimately uses asChild — see drawer.md + drawerMeta). Base UI API shapes
  differ from Radix (e.g. Checkbox has a separate `indeterminate` boolean).

## 4. Artifact catalogue (where everything lives)

| Path | What it is |
|---|---|
| `CLAUDE.md` | Binding agent rules; auto-loaded. Repo tree + naming policy (kebab-case code; MDX doc pages PascalCase-exempt). |
| `.claude/specs/components/*.md` ×33 | Component specs (8-section template, Rules-for-LLMs). CANONICAL spec home. |
| `.claude/specs/foundations/*.md` ×6, `tokens/token-reference.md`, `figma/component-keys.md` | Foundation specs; token cross-ref; Figma write-back keys (library file `zgzPlhKxDXc3E9OmfxmF9y`). |
| `.claude/skills/` | 3 flat skills (generate-code, import-variables, write-to-figma) + 2 folder skills: `compass-audit/`, `compass-migrate/`. |
| `components/ui/*.tsx` ×55 | The primitives (protected: no edits without spec review). |
| `components/ui/*.meta.ts` ×55 + `_meta-schema.ts` + `_meta-index.ts` | The meta layer (§3). |
| `components/blocks/migrate/` ×7 | Migration UI shell (pure presentation, mock data). |
| `app/globals.css`, `app/fonts.css`, `app/fonts/` | Import chain; @font-face ×10; licensed woff2. |
| `stories/` | Storybook: `welcome/getting-started/Principles/Changelog` (Introduction), `working-with-compass/` (interactive SOP: decision-flow.tsx walker + decision-flows.ts [56 cited nodes, gap leaves], live-do-dont, task-picker, spec-table), `foundations/` (6 MDX + kebab block renderers, token-source banner), `components/` (55 stories + meta-doc-blocks.tsx renderer), `patterns/` (Migrate). |
| `scripts/` | `token-audit.mjs` (COMMIT GATE), `compliance-audit.mjs` (C1–C7a), `compass-log.mjs`, `detect-drift.mjs`, `prescribe.mjs`, `generate-dashboard.mjs`, `audit-rubric.json` (owner-tunable weights/severities). |
| `drift-log/` | Ledger: `entries/` (committed; `"demo": true` entries excluded from Detect), `reports/` + `dashboard.html` (gitignored, regenerable), `schema.json`, `proposals/`. |
| `lib/` | `index.ts` barrel (377 exports), `utils.ts` (cn), `PACKAGING.md` (consumer story). |
| `cli/compass.mjs` + `cli/lib/` | The CLI (§6). |
| `tsup.config.ts`, `package.json` exports/bin/files | Package build (§6). |
| `code-connect/` ×10 | Figma Code Connect mappings (button, card, dialog, field, input, select, sheet, sidebar, table, tabs). |
| `.compass-build/` | Build governance: `PLAN.md`, **`STATE.md` (live truth + DECISION LOG)**, `log/<track>.md` (append-only per-track logs), `design/` (PROPOSED artifacts incl. semver policy, SOP structure, S4 C7/C2-C4 designs, S5 resolution design, spot-check packs). |
| `.env.local` (gitignored) | `CHROMATIC_PROJECT_TOKEN`. Never committed. |

## 5. How to run each surface

**Prereqs:** Node ≥20, access to Acko Nexus for `@acko/*` (`.npmrc` routes the
scope to `nexus-dev.acko.in:8080/repository/quark-skill/`). `npm install`.

- **App:** `npm run dev` (port 3000 often taken on the owner's machine — use
  `PORT=3010 npm run dev`).
- **Storybook:** `npm run storybook` → localhost:6006. Static: `npm run
  build-storybook`. **Deploy:** `npm run chromatic` (token from `.env.local`;
  appId `6a4c6bc7a7294c9b64f0b80e`; live permalink
  `https://main--6a4c6bc7a7294c9b64f0b80e.chromatic.com`).
- **Package:** `npm run build:pkg` → `dist/` (esm+cjs+dts, `"use client"`
  banner). `npm pack` works despite `"private": true` (publish is what it
  blocks). KNOWN LIMITATION (reproduced): server components can render package
  components but cannot call non-component exports (`cn()`, meta reads) from
  server code — the banner makes every module client. Fix = unbundled build,
  deliberately out of scope at this tag.
- **CLI:** `node cli/compass.mjs --help` (or `npx compass` once installed).
  `compass init` scaffolds 58 governance items into a consumer (idempotent;
  refuses conflicts, exit 1). `compass component <name> [--spec|--json]`,
  `compass docs tokens`, `compass migrate` (pointer to the skill). Requires
  `typescript` resolvable in the host for meta loading (degrades with message).
- **Audit loop** (in repo or any `compass init`-ed consumer):
  - `npm run audit` — token audit. **The commit gate: 0 errors required.**
    Baseline carries 34 pre-existing warnings inside components/ui (accepted).
  - `npm run audit:compliance` — behavioral. Repo mode excludes components/ui
    by owner ruling. Modes: file list, `--entry <ledger-file>`, `--parity`
    (must equal token-audit exactly), `--no-report`. Rules: C1 tokens/tiering,
    C2 raw-element (error, `// compass-allow: raw-<el>` escape) + shape-match
    (heuristic warning; known false-positives kept in elevation-blocks.tsx as
    tuning data), C3 composite-completeness (warning), C4 spec-coverage
    (warning), C5 kebab naming (MDX exempt), C6 import hygiene, C7a font
    declaration-consistency (currently warns: spec weights 100–900 vs hosted
    300–700 — owner ruled HOST, pending font files). Scoring: 100 −5/error
    −1/warning, tunable in `audit-rubric.json`.
  - `npm run log` — appends a ledger entry (auto-detects changed files +
    components; paste the "What I assumed" block).
  - `npm run detect` — hotspots over the last N=10 non-demo entries
    (threshold 3 builds, tunable). `npm run prescribe` — proposals with the
    opinion firewall. `npm run dashboard` — regenerates `drift-log/dashboard.html`.
- **Migration:** open `.claude/skills/compass-migrate/SKILL.md` with an agent
  in the TARGET repo (v1 scope: React+Tailwind). Preflight → baseline →
  batches → strangler-fig `-compass` variants → per-unit `.migration/` reports
  → **STOP boundary: consumer repointing and deletion of originals require
  owner confirmation.** Thresholds/weights in `resolution-config.json`
  (tunable; guardrails block is not). Every token/spacing snap is logged.
  UNVALIDATED: golden-pair signals need one real sample repo per library
  before production use (`validation-checklist.md`).

## 6. Maintenance — how the system stays correct

1. **Reading the dashboard** (`drift-log/dashboard.html`): radar = per-check
   health (C1–C7); priority matrix = frequency × severity, top-right first;
   **the trend line is the single most important number** — it says whether
   the loop is working. Per-component cards show top failing rule.
2. **The tightening cadence** (roadmap): capture continuous · score per build ·
   detect + prescribe weekly at first, relaxing to monthly · owner approves
   every tightening and rules every NEEDS-OWNER-DECISION item.
3. **How a correction propagates:** owner approves a spec edit → edit the spec
   → regenerate that component's meta (same rules as S1: cited or omitted) →
   `npx tsc --noEmit` + `npm run audit` → Storybook page updates automatically
   (reads meta) → `npm run chromatic` republish → if the package is affected,
   version bump per policy below.
4. **Repo hygiene invariants:** commit gate 0 errors; tsc clean; lint clean;
   generated artifacts (`dist/`, `storybook-static/`, reports/dashboard) are
   gitignored AND excluded from audit+eslint — when adding a new generated
   output, exclude it in `token-audit.mjs` EXCLUDE_DIRS, the mirrored
   EXCLUDE_DIRS_LEGACY in `compliance-audit.mjs` (keep `--parity` green), and
   `eslint.config.mjs`.
5. **Release policy** (PROPOSED at `.compass-build/design/s3/semver-policy.PROPOSED.md`,
   NOT yet owner-approved): additive = minor; token/behavior change = major +
   codemod; docs-only = patch. Publish steps and CHANGELOG choice (plain file
   vs Changesets) await owner ruling. Publish to Nexus is owner-gated
   (credentials; flip react/next to peerDependencies; settle the package name —
   `@acko/compass` is a placeholder; drop `"private": true` at that moment).

## 7. The governance protocol (how work happens here)

- Owner = Nikhil (designer). Plain-English explanations; ask before
  irreversible actions; strategy decisions escalate, never decided unilaterally.
- **DECISION LOG** in STATE.md: append-only; never re-ask settled decisions;
  PROVISIONAL entries mark auto-resolved calls the owner may revisit.
- Multi-agent protocol: every agent reads roadmap + STATE.md before acting and
  writes append-only logs to `.compass-build/log/<track>.md`; PROPOSED outputs
  go to `.compass-build/design/`; agents never run git (orchestrator commits,
  batch-scoped); local git only, NO push without explicit owner approval.
- Session-limit resilience: checkpoint-commit early and often; STATE.md carries
  a resume script when risk is high. This has been exercised twice successfully.

## 8. External touchpoints

- **Chromatic**: appId `6a4c6bc7a7294c9b64f0b80e`; token in `.env.local`.
- **Acko Nexus**: `@acko` scope registry (tokens package source; future publish target).
- **Figma library**: `zgzPlhKxDXc3E9OmfxmF9y` (URL in STATE.md References).
  Access via the Figma MCP under the owner's account. Component keys for
  write-back: `.claude/specs/figma/component-keys.md`.
- **GitHub**: NO remote configured at this tag. 60+ local commits, tags
  `baseline-2026-07-06`, `s0-complete`, `s1-complete`, `s2-complete`,
  `s3-build-complete`. Per-stage PR push happens only on owner approval.

## 9. Not built — do not assume (honesty ledger at this tag)

- **S6 entirely**: `compass add` scaffold, promotion pipeline (PillSelector,
  ChartCard etc. are roadmap candidates only), demand-driven spec backfill.
- **C7b** (Playwright paint probe): designed only; trigger policy undecided.
- **Registry publish**: not done; package name unsettled; peerDeps flip pending.
- **Migration golden-pair validation**: zero sample repos run; production
  migration is NOT cleared until one per library passes.
- **Unresolved owner forks/rulings** (see STATE.md queue): Card default
  (Figma shadow/xs + solid border vs shadowless ring code — three-way with
  elevation.md's shadow-sm), `primitiveElements` schema field, C3 severity
  flag, `direction` category, 13 SOP flagged gaps, Table gaps #19–22 (no wrap
  variant, hover-on-static, className routing), Euclid weight cuts 100/200/
  800/900 (ruled HOST; files not yet supplied; foundry availability unconfirmed).
- **Known stale docs**: README.md (token-audit.js name, "Next.js 15", 3 Code
  Connect claims, phase table), designers.md status table (says 3 specs;
  reality 33/10). Both need a mechanical refresh pass.
- The `/test` page renders only Test 2 (Test 1 artifact `sign-in-test.tsx`
  never existed in this snapshot — documented in-page; do not recreate).
