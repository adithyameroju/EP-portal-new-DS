# Compass — Road to GA Roadmap

**From "validated prototype" to "shareable, self-auditing enterprise design system"**

*Owner: Nikhil | Orchestration: Claude.ai (strategy) + Claude Code (repo execution) + Fable 5 (heavy build) | Drafted: July 2026*

> **What this doc is.** A single sequenced plan that absorbs the unexecuted
> `Claude_Code_Goal_Final.md` and the deferred Phase 4 backlog, and adds the
> new asks: an Astryx-grade Storybook, a Compass-native design-to-code SOP, the
> self-correcting audit loop, and a Compass migration tool. It is staged so each
> stage unblocks the next. Stages are labelled **S0–S6** to avoid collision with
> the historical Phase 0–6 numbering.
>
> **The goal state (your words):** share Compass to fellow designers so they can
> stress-test it, scale fast, and let you audit usage / performance / efficiency
> and tighten the loop. That milestone is reached at the **end of S4** (the
> "Shareable + Auditable" gate). S5–S6 are leverage multipliers that run partly
> in parallel afterwards.

---

## Standing rules (apply to every stage, every tool)

1. **Propose, then approve.** No generative step (meta.ts, specs, SOP text,
   audit tightening plans, migration mappings) ships without owner review.
   Invented opinions are actively harmful because Cursor follows them literally.
   This is the single most important rule in the whole system.
2. **No speculative opinions in specs.** Compass has no legacy products to draw
   voice from yet. Opinions form through real product work (the KPI feature is
   the first source), never through invention.
3. **Evidence, not assertion.** Every "it's done" is backed by a passing audit,
   a green typecheck, or a rendered screen — never a claim.
4. **One canonical repo.** Everything below assumes a single `main` with branch
   protection. Reconciling that is S0, Task 1 — it is currently violated.

---

## Tooling model (who does what)

| Tool | Role in this roadmap |
|------|----------------------|
| **Claude.ai (this)** | Strategy, stage planning, spec/SOP review, the monthly drift-tightening sessions, approving mapping heuristics. The "brain," not the "hands." |
| **Claude Code** | Repo-wide execution: running skills, wiring config, per-component orchestration, running the audit, committing. The "hands" that touch the repo. |
| **Fable 5** | Heavy generation: meta.ts for 55, Storybook pages, the audit dashboard, the migration engine. Drives volume; output always gated by review. |
| **Nikhil** | Approves every gate. Owns versioning policy, spec tightening, migration heuristics, and the decision to open Compass to designers. |

**Critical path:** S0 → S1 → S2 → S3 → S4 is a hard chain (each needs the prior).
S4's *capture* design can start in parallel with S2/S3. S5 and S6 both need S1
(meta) + S3 (package) but not each other, so they parallelize.

---

## S0 — Reconcile & true the foundation (fast, ~2 days)

**Goal:** one canonical repo, the brand font actually rendering, specs accurate
to Base UI. This is the cheapest, highest-morale work and it directly fixes the
"doesn't look like Compass" feeling.

### S0.1 — Reconcile branches to one `main`
You currently have divergent repo states in circulation: the late-June branch
keeps specs under `.claude/specs/` with **no `stories/`**, while the KPI-feature
branch has specs at **top-level `specs/`** *and* a `stories/foundations/`. Before
anything else, pick the canonical layout, merge, and enable branch protection
(require PR review + audit CI). Building S1–S6 on two diverging trees will fan
out chaos the moment designers clone.

- [ ] Diff the two trees; choose canonical spec location (recommend `.claude/specs/` so Claude Code auto-reads, with a top-level symlink or docs pointer)
- [ ] Merge, tag the reconciled state, enable branch protection on `main`
- [ ] Confirm `npm run audit` is green on the canonical tree

### S0.2 — Wire the real brand font (the #1 look fix)
`app/layout.tsx` loads **Geist** from Google Fonts and sets `--font-geist-sans`;
nothing ever sets `--font-sans`. Your typography spec says the system typeface is
**Euclid Circular B**. So every built screen — including the KPI dashboard —
renders in Geist while Figma renders in Euclid. Fix once, every feature corrects
retroactively.

- [ ] Host Euclid Circular B (self-host `.woff2` in `app/fonts/`, or `next/font/local`)
- [ ] Set `--font-sans`, `--font-serif`, `--font-mono` to Euclid; remove Geist imports
- [ ] Replace `"Create Next App"` metadata with real Compass metadata; replace favicon
- [ ] Delete Vercel/Next starter SVGs from `public/`
- [ ] Re-render the KPI feature; confirm the look now reads as Compass

### S0.3 — Base UI spec-accuracy pass
Compass is **already on Base UI** (`@base-ui/react`, shadcn 4.3.1) — the platform
migration is behind you. But specs written in the Radix era may reference stale
patterns. Use shadcn's own `class-mapping.md` (from their migrate skill) as the
checklist: `data-[state=open]` → `data-open`, `asChild` → `render`, the
Portal→Positioner→Popup shape, `--radix-*` CSS vars → Base UI equivalents,
ToggleGroup's array `value` API, etc.

- [ ] Grep all 33 specs for Radix-era data-attributes / prop names; fix stale ones
- [ ] Confirm each spec's code examples compile against the actual Base UI component

**Exit:** single `main` with branch protection, Euclid rendering everywhere,
boilerplate gone, all 33 specs accurate to Base UI, KPI feature looks like Compass.

---

## S1 — Metadata keystone: `meta.ts` for all 55 (~3 days)

**Goal:** the machine-readable contract that Storybook, the audit, migration, and
extensibility all read. This is *the* keystone — nothing downstream works well
without it. This is `Claude_Code_Goal_Final.md` Phase 1, finally executed.

- [ ] `components/ui/_meta-schema.ts` — the `ComponentMeta` interface (category, purpose, useCases, antiPatterns, variants, sizes, parent/child, tokens, a11y, aiHints, codeConnectStatus, specPath)
- [ ] Extend `category` to `atom | molecule | organism | template | pattern` (you'll need "pattern" for S6)
- [ ] Generate `meta.ts` for the 33 specced components (rich: anti-patterns, aiHints, confused-with)
- [ ] Generate lightweight `meta.ts` for the remaining 22 (name/category/purpose/variants from TS types)
- [ ] `components/ui/_meta-index.ts` re-exporting all 55
- [ ] `npx tsc --noEmit` clean

**Tooling:** Fable 5 generates per-component from `[name].tsx` + `[name].md`;
Claude Code orchestrates the loop and commits; Nikhil spot-checks 5–10 for
accuracy (especially `antiPatterns` and `confusedWith` — the parts most prone to
invention).

**Exit:** 55 `meta.ts` files, index compiles, spot-check passes.

---

## S2 — The Storybook (Astryx-feel) + Compass SOP (~1.5 weeks)

**Goal:** the shareable, referenceable surface designers and devs live in. Clone
Astryx's *experience* (Getting Started → Foundations → Components → Patterns →
Playground, with a first-class "Working with AI" doc) on your shadcn foundation.
Storybook is installed and configured but has **zero stories today** — this is a
from-scratch build, not an upgrade.

### S2.1 — Structure & Getting Started
- [ ] `stories/Introduction.mdx` — tagline, what Compass is, quick links, live status (55 components / N specs / 10 Code Connect / audit status)
- [ ] `stories/GettingStarted.mdx` — install, `npx compass init` (stub until S3), the designer Cursor workflow end-to-end
- [ ] `stories/Principles.mdx` — render PRINCIPLES.md
- [ ] Sidebar taxonomy driven by `meta.category`: **Foundations → Atoms → Molecules → Organisms → Patterns**

### S2.2 — Foundations (rendered from tokens, not hand-typed)
- [ ] Color (swatches from the token package, grouped: bg/fg/brand/destructive/border/sidebar/chart, light+dark)
- [ ] Typography (Euclid specimen, the size scale at real size, heading presets)
- [ ] Spacing, Radius, Elevation, Motion

### S2.3 — Component docs (all 55, read from `meta.ts`)
Each page: purpose → when-to-use / when-not → anatomy → variant gallery →
rules (from spec LLM-Rules) → do's & don'ts (side-by-side) → tokens → a11y →
AI hints → parent/child relationships → **version + status badge**.

- [ ] 33 specced components get full docs
- [ ] 22 unspecced get minimal docs (purpose + variants); flag for spec backfill (S6, demand-driven)

### S2.4 — The Compass SOP ("Working with Compass")
This is your ask #3 — a Compass-native version of the ACKO D2C SOP, living inside
Storybook. Model it on shadcn's own `skills/shadcn/rules/` folder
(`composition.md`, `forms.md`, `styling.md`, `base-vs-radix.md`, `icons.md`),
which is exactly an operational "when to do what" SOP.

- [ ] Decision flows: "which component for this job," "compose vs. request-new," "when a pattern earns promotion"
- [ ] Do / Don't per common task (forms, dialogs, tables, charts, layout density)
- [ ] The Figma → Cursor → review → write-back loop, written as steps
- [ ] "Working with AI" page: how the specs/skills/meta constrain the LLM, and how to read the "What I assumed" output

### S2.5 — Versioning surface & deploy
- [ ] Changelog page; per-component version/status from `meta.ts`
- [ ] Deploy Storybook (Chromatic or Vercel) so it has a shareable URL

**Exit:** full Storybook deployed at a URL, all 55 documented, Foundations render
from live tokens, SOP live, versioning visible.

---

## S3 — Package & distribution: make it consumable (~1 week)

**Goal:** designers can pull Compass into their own projects. This is what turns
"a repo" into "a system others use," and it's the prerequisite for stress-testing
at scale. `package.json` is still `"private": true` with no barrel/tsup today.

- [ ] `lib/index.ts` barrel (all 55 components + meta exports)
- [ ] `tsup.config.ts` (esm+cjs, dts, externalize react/next), `build:pkg` script
- [ ] `package.json` exports/main/module/types; `.npmignore`
- [ ] **Semver policy** written down: additive (new component/variant) = minor; token/behavior change = major *shipped with a codemod*; docs-only = patch
- [ ] `CHANGELOG.md` discipline (or Changesets) wired into the release
- [ ] Publish to Acko's private registry / GitHub Packages
- [ ] **CLI**: `npx compass init` (drops tokens/specs/skills/CLAUDE.md/audit into a consumer project) + `compass component <name>` / `compass docs tokens` (surfaces meta/specs to the AI on demand — the Astryx CLI idea)
- [ ] Verify: `npm i @acko/compass` + `compass init` works on a fresh Next app

**Tooling:** the FE dev leads packaging (per their existing ownership); Fable 5
builds the CLI; Nikhil approves the semver policy.

**Exit:** a fresh project can install Compass and scaffold via `compass init`; the
CLI surfaces docs to Cursor/Claude.

---

## S4 — The self-correcting audit loop (~1.5 weeks) → **SHAREABLE + AUDITABLE GATE**

**Goal:** move from static audit (hex/arbitrary at commit) to *behavioral* audit —
is the LLM still generating correct, on-token, on-component code over time, and
when it drifts, detect it and propose a tightening plan. This must be live
*before* wide designer rollout so capture starts on day one. This is your
long-promised third skill (`compass-audit`).

### S4.1 — Capture
- [ ] Structured drift ledger: each build appends its "What I assumed" block + the generated file path + component list to `drift-log/` (a file the audit reads — formalizes the Slack-paste habit)
- [ ] Lightweight, zero-friction: a `compass log` command or a Cursor rule that writes the entry

### S4.2 — Score (extend `token-audit.js` → compliance audit)
Beyond hex/arbitrary, check:
- [ ] Components imported from `@/components/ui` (not re-implemented as divs)
- [ ] Composite sub-parts used (Card→CardHeader, Dialog→DialogHeader…)
- [ ] Only spec-covered components used; flag unspecced usage
- [ ] **Naming convention** (kebab-case files) — this would have caught the `settings/` PascalCase drift in the KPI feature
- [ ] Arbitrary-value tiering (layout dims like `220px` = warning; color/spacing = error)
- [ ] Emit a score per build and per component

### S4.3 — Detect (every N builds)
- [ ] Scheduled Claude Code skill run reads the last N ledger entries, ranks components by drift frequency, clusters failure modes (e.g., "Card border overridden 4×")

### S4.4 — Prescribe (propose, human approves)
- [ ] Output a **proposed tightening plan**: "component X drifted 4×, all on rule Y; here's the exact spec edit that prevents it" — for owner approval, never auto-applied
- [ ] **HTML health dashboard** (model on designsystemops.com's output: health radar, severity distribution, priority matrix, per-component score cards) so you can *see* system health at a glance
- [ ] Wire the monthly Claude.ai tightening session to consume this

**Exit — and the gate to open Compass to designers:** a designer build produces a
compliance score; a drift run produces an approvable tightening plan + dashboard;
capture is frictionless. **At this point Compass is shareable and you can audit
usage, performance, and efficiency — your stated goal.** Onboard the first cohort
of designers here.

---

## S5 — Migration to Compass: the "Migrate" tool (~2 weeks, parallel with S6)

**Goal:** any product on any system → Compass-native code, so designers (and PMs
vibe-coding on Lovable/Replit/Cursor) can hand devs a clean Compass starting point.
Reverse-engineer shadcn's `migrate-radix-to-base` skill's **architecture**,
replace its **content**.

### S5.1 — Reuse the skeleton (proven, borrow directly)
- [ ] Preflight: clean git tree, work on a branch, baseline typecheck/build first, detect package manager
- [ ] **Progressive strangler-fig mode**: migrate one flow/component at a time; original and `-compass` variant coexist; repoint consumers one at a time; typecheck each
- [ ] **Golden-pair diffing**: classify each incoming component (pristine vs. customized) by diffing against its origin, so customizations survive
- [ ] Per-unit reports in `.migration/<unit>.md` with the fixed structure (Changed / Left alone / Behavior changes / Verify by hand)
- [ ] **Flag behavior deltas, never silently patch**; honest reporting (skipped ≠ migrated)
- [ ] Hard rule: don't touch non-presentation code (routing, data, business logic) — migrate the presentation layer only, so "design & context stay as-is, UX/UI moves to Compass"

### S5.2 — Replace the content (Compass-specific, needs S1 meta)
- [ ] **Inventory pass**: read the target repo; map its components/tokens/patterns → nearest Compass equivalent (resolved against `meta.ts`); emit a **gap list** (what Compass lacks) → feeds S6
- [ ] **Token remap**: their color/spacing/radius → Compass semantic tokens; the audit script (S4) is the acceptance test (0 errors = migrated)
- [ ] **Component swap**: their primitives → Compass imports, preserving structure/copy/behavior; flag ambiguous cases for review

### S5.3 — The "Migrate" surface (in Storybook)
- [ ] Entry point in Storybook: URL (GitHub) **or** zip upload
- [ ] Unpack + run the project locally, open it, break migration into **batches** (a flow at a time)
- [ ] For each batch: show live "this is how it looks/behaves in Compass"
- [ ] On completion: write Compass-native code → **publish or download**
- [ ] PM handoff mode: run once before handoff → clean Compass-native codebase as the dev starting point

**Honesty / scoping:** arbitrary-system migration is fuzzy. Start constrained
(React + Tailwind targets), prove it on one internal repo, then widen. The gap
list is a feature, not a failure — it drives S6.

**Exit:** a sample external repo migrates to buildable Compass-native output with a
per-batch review report and a gap list.

---

## S6 — Extensibility & contribution: grow without breaking (~1 week + ongoing)

**Goal:** you keep adding atoms/molecules/organisms/patterns as usage expands,
with publishing and downstream migration handled, and nothing breaks consumers.
Seed it with the real candidates the KPI feature already produced.

### S6.1 — Scaffold skill (`npx compass add`)
- [ ] One guided flow generates: component + spec + `meta.ts` + story + Code Connect stub + passing audit — so nothing enters the system half-documented
- [ ] Semver-aware: additive = minor, auto-updates CHANGELOG

### S6.2 — Promotion pipeline (feature-local → system)
Seed from the KPI feature's promotion candidates (already built, composed from
Compass atoms, just need to be systematized):
- [ ] `PillSelector` (wraps ToggleGroup), `GranularityToggle`, `DateNavigator`
- [ ] `ChartCard`, `KpiRow`, `ConfiguratorModal`
- [ ] Standardized chart `Skeleton` / `Error` / `Empty` states
- [ ] Each promoted via S6.1 with owner approval + a version bump

### S6.3 — Demand-driven coverage (not speculative grind)
- [ ] Remaining specs (22) and additional Code Connect are done **when the audit/drift signal says so**, not front-loaded. The 10 Code Connect done cover Tier 1; the audit loop tells you the next ones to earn their keep.

### S6.4 — Ongoing cadence (from your existing Phase 6)
- [ ] Weekly commit review + Slack triage; Monthly drift-tightening with Claude.ai; Quarterly system review + token health check + PRINCIPLES update

**Exit:** a molecule from a feature can be promoted into Compass in one guided
flow with a version bump; consumers get it via `npm update`; the migration tool
handles adopting it in existing screens.

---

## Direct answers to your Stage-1 questions

**"shadcn moved Radix → Base UI — what changes for us?"**
Nothing to migrate — you're *already* on Base UI (`@base-ui/react`, shadcn 4.3.1),
so the platform shift is behind you for all 55 components. Two implications:
(1) specs must reflect Base UI APIs, not Radix (S0.3 — the ToggleGroup array
`value` you saw in `pill-selector` is Base UI's shape); (2) the exact skill shadcn
shipped for that migration is the architectural template for *your* migration tool
(S5). One watch-item: Base UI is newer/less battle-tested than Radix — track
upstream changes for the Base-UI-backed components.

**"Some components are Code Connect mapped, the rest were for later — what now?"**
Keep it demand-driven. The 10 done cover your Tier 1 high-frequency set; that was
the right 80/20 call and it still holds. Don't grind Code Connect for all 55 —
let the audit loop's drift data (S4) + Slack signals tell you which component
earns the next mapping. Speculative Code Connect is wasted effort on components
that may never get pulled from Figma.

**"How good/complete are the 33 specs? Move to the rest?"**
They follow the 8-section template and I spot-checked several as solid, but don't
judge completeness by hand — S1's meta generation + a spec-completeness audit will
surface gaps objectively. Complete coverage to 55, but **weight the effort by
drift signal**: fill the specs for components that are actually drifting first,
keep simple components' specs short (4 sections), and let the rest be lightweight
until usage demands more.

---

## Sequencing summary

```
S0 Foundation ── S1 Meta ── S2 Storybook+SOP ── S3 Package ── S4 Audit loop ★ SHAREABLE GATE
                    │                                              │
                    └──────────────────────────────┬─────────────┘
                                                    ├── S5 Migration tool  ┐ (parallel)
                                                    └── S6 Extensibility    ┘
```

★ **End of S4 = the moment you open Compass to fellow designers.** Everything
before it makes Compass *shareable and auditable*; everything after it *scales*
what you can do with it.

**Suggested immediate next action:** execute **S0** now — I can spec the exact
`layout.tsx` / font / `public/` changes and the branch-reconciliation steps as a
Claude Code prompt, and in parallel draft the `_meta-schema.ts` for S1 so Fable 5
can start the meta generation the moment S0 lands.
