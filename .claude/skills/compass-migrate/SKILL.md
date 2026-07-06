# Compass — Migrate a Foreign Codebase to Compass

> **Skill type:** Migration (presentation layer only)
> **Trigger:** User points at a repo (path, GitHub URL, or unpacked zip) and asks
> to migrate it to Compass — e.g. "migrate this to Compass", "compass-ify this
> Lovable output", "run the migration on the settings flow"
> **Tools:** Claude Code (this skill runs *against a target repo*, with the
> Compass repo/package available as the source of truth)
> **Output:** Compass-native presentation code in the target repo + a
> `.migration/` report directory + a gap list
> **Status:** Part A (skeleton) ACTIVE · Part B (resolution) GATED ON S1 —
> see [`resolution.md`](resolution.md)
>
> **Architectural ancestor:** shadcn's `migrate-radix-to-base` skill. We reuse
> its *discipline* — preflight, strangler-fig, golden-pair diffing, per-unit
> reports, flag-don't-patch, honest reporting — and replace its *content*
> (Radix→Base mapping tables) with Compass resolution driven by
> `components/ui/` meta (`meta.ts`, S1).

---

## Scope (v1 — deliberately constrained)

- **Targets: React + Tailwind codebases only.** Other stacks: stop and tell the
  user this is out of scope for v1. Prove the loop on one internal repo
  end-to-end before widening.
- **Presentation layer only.** You may rewrite JSX, className/styling, and
  component imports. You may NOT touch hooks logic, data fetching, routing,
  state management, business logic, API contracts, or copy. This is how
  "design and context stay as-is, UX/UI moves to Compass."
- The headline use case is **PM handoff**: a PM vibe-codes a feature on
  Lovable/Replit/Cursor, runs this once, and hands the dev a governed
  Compass-native starting point.

## Hard rules (non-negotiable, in priority order)

1. **Presentation layer only** (see scope above). If a migration seems to
   require a logic change, flag it in the report and skip the unit.
2. **Never guess a mapping.** Low-confidence component mappings and tokens that
   don't cluster cleanly go to the owner (Nikhil) via
   `.migration/_needs-decision.md`. Never silently pick a candidate.
3. **No Compass equivalent = gap list item** (`.migration/_gap-list.md`, feeds
   S6 extensibility). Never invent a component, never approximate with a
   lookalike above the confidence bar. The gap list is a feature, not a failure.
4. **Flag behavior deltas, never silently patch.** If the Compass component
   behaves differently (activation model, close-on-click, focus return,
   controlled/uncontrolled defaults), record it under `Behavior changes` for
   human QA. Do not write compensating code to force parity.
5. **Honest reporting.** Skipped ≠ migrated. Reverted units are listed as
   flagged. Pre-existing failures are named as pre-existing (that's what the
   baseline is for).
6. **Plan-then-execute, per batch.** Propose the batch plan, get the owner's
   go-ahead, migrate, report, wait for batch approval before the next batch.
   Ask before anything irreversible (deletes, renames, dependency changes).

---

## Step 0 — Preflight (always, before any edit)

1. **Clean tree required.** `git status` in the target repo must be clean. If
   dirty, stop and ask the user to commit or stash. If the target has no git at
   all (common for zip/Lovable exports), initialize one and make a baseline
   commit first — every later change must be diffable.
2. **Branch.** Create and work on `compass-migration` (or
   `compass-migration/<flow>` for a scoped run). Never migrate on the default
   branch.
3. **Detect the package manager** from the lockfile (`package-lock.json` → npm,
   `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, `bun.lockb`/`bun.lock` → bun)
   and use it for every install/run in the target. Never mix.
4. **Record the baseline BEFORE any change.** Run the target's own typecheck,
   build, and lint (whatever scripts it has). Write results to
   `.migration/_baseline.md` (template: [`report-templates.md`](report-templates.md)).
   Pre-existing failures are never attributed to the migration — and the
   migration must never make them worse.
5. **Identify the stack + source library** (for golden-pair diffing): check
   `package.json` deps and import patterns against
   [`golden-pairs.md`](golden-pairs.md). Record the identification (or
   "bespoke/unknown") in `_baseline.md`.

## Step 1 — Inventory & batch plan

1. Enumerate the target's routes/flows and their component dependency trees.
2. Split the migration into **batches** — one flow/feature at a time (e.g.
   "Settings flow", "Dashboard cards"). Never one monolithic pass.
3. For each foreign component, resolve it to a Compass target using the
   resolution procedure — **[`resolution.md`](resolution.md), GATED ON S1**.
   Until S1's `meta.ts` lands, this skill can preflight and plan batches but
   must not perform mappings.
4. Present the batch plan (order, contents, known risks, gap-list candidates)
   to the owner. Wait for approval.

## Step 2 — Migrate one batch (progressive strangler-fig)

Never big-bang. For each unit (component/flow) in the approved batch:

1. **Golden-pair diff first** (when the source library is identified): diff the
   unit against its stock origin per [`golden-pairs.md`](golden-pairs.md) to
   separate *the team's customizations* from *the base component*.
   Customizations must survive the swap — re-expressed as Compass semantic
   tokens/variants where legal, flagged in `_needs-decision.md` where not.
   Bespoke/unknown source → no golden pair; use pure role-based resolution
   ([`resolution.md`](resolution.md)).
2. **Write the migrated version beside the original** as a `-compass` variant
   (`stat-card.tsx` → `stat-card-compass.tsx`). Original and variant coexist;
   the project stays buildable at every step.
3. **Repoint consumers one at a time.** After each repoint, run the target's
   typecheck. Green → next consumer. Red → fix or revert that repoint before
   moving on.
4. **Only when all consumers are repointed and green:** delete the original and
   rename `-compass` → the original name (ask first — deletes are irreversible).
5. **Write the unit report** to `.migration/<unit>.md` with the fixed
   structure: `Changed / Left alone / Behavior changes / Verify by hand`
   (template: [`report-templates.md`](report-templates.md)).
6. New components created in the target follow Compass conventions:
   **kebab-case filenames**, semantic token classes only, composite
   sub-components used correctly, `lucide-react` icons.

## Step 3 — Verify the batch

1. Target's typecheck + build: no regressions vs `_baseline.md`.
2. Compass token audit over the migrated files: **0 errors is the acceptance
   test** (no hex, no arbitrary values, no raw Tailwind palette classes). The
   S4 compliance audit is the formal gate once it ships; until then run
   Compass's `token-audit` script against the migrated paths.
3. Present the batch report + live before/after to the owner. Batch is
   **approved / flagged / skipped** — recorded honestly. Only then start the
   next batch.

## Step 4 — Completion

1. Migration status is **derived from disk** — scan the target for remaining
   foreign-library imports and un-migrated units. Never maintain a
   hand-edited status index that can rot.
2. Write `.migration/_summary.md`: units migrated / flagged / skipped (counted
   from disk), gap list, open decisions, baseline deltas.
3. Hand off: the branch is the deliverable (publish to their repo/branch, or
   zip). The gap list goes back to the Compass owner as S6 candidates.

---

## Reference files in this skill folder

| File | Purpose | Status |
|------|---------|--------|
| [`report-templates.md`](report-templates.md) | The `.migration/` directory: every report template, verbatim | ACTIVE |
| [`golden-pairs.md`](golden-pairs.md) | v1 source-library identification + diffing notes (stock shadcn, MUI, Chakra, Ant, Lovable/Replit output) | ACTIVE |
| [`resolution.md`](resolution.md) | Part B: role detection → meta.ts matching, confidence rubric, token remap, gap list | **GATED ON S1 — stub only** |

Per-library mapping tables (e.g. `mui-mappings.md`) will be added to this folder
as they are approved — that is why this skill is a folder, not a flat file.
