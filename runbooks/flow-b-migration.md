# FLOW B — Existing codebase (Lovable prototype) → Compass-native

**Read this box before you run anything.**

> ### Heavy flagging is the design working, not the tool failing.
>
> The migration engine has **never run on a real repository**. This run *is* its
> first validation (`.claude/skills/compass-migrate/validation-checklist.md`).
>
> Expect: a long `_needs-decision.md`, a populated `_gap-list.md`, and plenty of
> confidence scores below the auto-map line. **That is the intended behaviour.**
> The engine was built to a stated principle: *"it's better to flag 20% for review
> than to silently mis-map 5%."* A migration that reported everything clean on its
> first-ever run against a bespoke prototype would mean the confidence rubric is
> broken — not that the tool is good.
>
> Two more things that are features, not bugs:
> - **The gap list is the point.** Every "Compass lacks this" is a real S6
>   candidate discovered by real use — the flywheel the roadmap describes.
> - **It stops before the irreversible part.** Repointing consumers and deleting
>   originals need *your* explicit confirmation. An unattended run ends with
>   `-compass` variants sitting safely beside the originals.

Stamped against the build at `s3-build-complete`, updated through 2026-07-18 to
fold in the post-build rulings (Card composition ruling, the 12 SOP rulings, the
standing decision queue, and the Storybook story fixes; see
`.compass-build/STATE.md`).

> **Not the "Using Compass in Loop" Cursor rule.** That rule sets up Compass and
> builds *new* screens. Migration is a different, deliberately human-gated skill
> (`compass-migrate`) run inside the target repo — the rule does not cover it and
> nothing here changes because of it. Follow the steps below.

Scope of v1: **React + Tailwind**
targets. Lovable output is a first-class golden-pair target (it's the PM-handoff
path, so it was characterized deepest).

---

## 0 · Prereqs

- The Lovable repo cloned locally, **clean git tree** (preflight refuses a dirty tree).
- Node ≥ 20, `.npmrc` with the `@acko` scope line.
- The Compass tarball (see [Flow A](./flow-a-new-project.md) step 2).
- Claude Code (or Cursor) pointed at the **target repo**.

## 1 · Prepare the target

```bash
cd lovable-prototype
git status                      # must be clean
git checkout -b compass-migration
npm install /path/to/acko-compass-0.1.0.tgz     # so -compass variants can import real components
npx compass init                # drops the specs, skills (incl. compass-migrate), and the two audit scripts
```
> `init` refuses to overwrite anything you've already got (it reports CONFLICT and
> exits). If the Lovable repo has its own `CLAUDE.md`, decide which wins — that's
> a call, not something the tool should silently make.

## 2 · Run the migration skill

Migration is a **skill**, not a CLI command — the CLI only points at it:
```bash
npx compass migrate             # prints where the procedure lives
```
Then, in Claude Code inside the target repo:
> *"Migrate this project to Compass using the compass-migrate skill. Start with
> preflight and the inventory pass; do one batch at a time."*

### What the skill does, in order
1. **Preflight** — clean tree, migration branch, detects the package manager, and
   runs the target's own typecheck/build **first** to record a baseline in
   `.migration/_baseline.md`. *(Pre-existing failures get named as pre-existing —
   they'll never be blamed on the migration.)*
2. **Inventory** — reads the repo, classifies each foreign component by role, and
   resolves it against Compass's `meta.ts` with a confidence score.
3. **Batches** — splits by route/flow. You approve batch by batch.
4. **Strangler-fig swap** — writes a `-compass` variant beside each original.
   **Nothing is repointed. Nothing is deleted.** The app stays buildable throughout.

## 3 · Read the reports — this is the actual work

Everything lands in `.migration/` **in the target repo**:

| File | What it tells you |
|---|---|
| `_baseline.md` | the target's health *before* we touched it |
| `<unit>.md` | per flow: **Changed / Left alone / Behavior changes / Verify by hand** |
| `_gap-list.md` | what Compass **lacks** → feeds S6 |
| `_needs-decision.md` | **your queue** — low-confidence mappings + unclustered tokens |
| `_snap-log.md` | **every** token/spacing snap, logged — never silent |
| `_summary.md` | the honest roll-up (skipped ≠ migrated) |

### How to read a confidence score
| Score | What happens | Your involvement |
|---|---|---|
| **≥ 0.85** | mapped automatically | shown in the report; spot-check |
| **0.60 – 0.84** | **provisional** — written as a `-compass` variant, but *not* trusted | **you confirm each one** |
| **< 0.60** | flagged, not mapped → `_needs-decision.md` | **you decide** |
| **< 0.30** | no Compass equivalent → `_gap-list.md` | triage to S6 |

> **Expect a lot of 0.84s.** 21 of the 55 components have types-only meta (no
> spec), and the rubric deliberately caps a types-only match at **0.84** — it can
> never auto-map. On a bespoke Lovable app, that plus role-inference means a big
> provisional pile. That's the rubric being honest about what it doesn't know.

### Lovable-specific things to expect
- Lovable output is usually **Vite + stock shadcn in `src/components/ui/`** with
  **HSL-var tokens** — which remap unusually cleanly. Good news for step 4.
- It's typically on the **Radix era**. Compass is Base UI. So expect
  **systemic behavior deltas** (`asChild` → `render`, `data-[state=…]` →
  `data-…`, the Checkbox `indeterminate` API). These get **flagged for QA, never
  silently patched.**
- Presentation layer only — the skill must not touch routing, data fetching,
  state, or business logic. If a report shows those changed, stop and tell me.

## 4 · Audit the migrated output — the acceptance test

```bash
npm run audit              # 0 errors = the token remap actually succeeded
npm run audit:compliance   # behavioral score on the -compass variants
```

> `npm run dashboard` (and the rest of the drift ledger) is **not** wired by
> `compass init` yet — it's parked on `init-hardening-wip`, so it will fail with
> "missing script" in a migration target project. The two audits above are the
> acceptance test for a migration; the dashboard lives on the clone path (the
> full Compass repo — see the [Designer Quickstart](./designer-quickstart.md))
> until init-hardening merges.
**`npm run audit` returning 0 errors is the migration's definition of done** for
the token layer. Errors remaining = values that never clustered onto Compass
tokens — go look at `_snap-log.md` and `_needs-decision.md`.

## 5 · The stop boundary

The skill halts here. **Repointing consumers to the `-compass` variants and
deleting the originals require your explicit confirmation** (a standing guardrail
in `resolution-config.json`, marked non-tunable). Only after you approve does
anything become irreversible.

---

## What GOOD looks like

```
  Token Audit Complete
  Errors:            0            ← the token remap landed
```
- `_summary.md` is **honest**: skipped units listed as skipped, not migrated.
- `_baseline.md` exists and pre-existing failures are named as pre-existing.
- `_gap-list.md` has entries — **this is success**, not failure.
- Behavior deltas are **listed for QA**, not quietly "fixed".
- Originals still there; app still builds.

## What TROUBLE looks like

- **`audit` still has errors** → token remap incomplete; unclustered values were
  left behind. Check `_snap-log.md`.
- **A report claims something was migrated that wasn't** → honesty violation;
  that's a bug in the tool, tell me.
- **Logic/routing/state files changed** → hard-rule violation; stop.
- **An empty `_needs-decision.md` on a bespoke app** → suspicious. It means the
  rubric mapped confidently where it shouldn't have. Distrust it and tell me.
- **Silent snaps** — a token changed with no `_snap-log.md` line. Same: a bug.

## Where YOU make a call

1. **Every `_needs-decision.md` item** — the main event.
2. **Every provisional (0.60–0.84) mapping** — they're pre-written for you to
   look at, *not* pre-approved.
3. **Gap-list triage** → which become S6 candidates.
4. **Behavior deltas** → accept, or fix by hand.
5. **Repointing + deleting originals** → the irreversible gate. Yours alone.
6. **Whether to tune the rubric** — thresholds (0.85/0.60/0.30) and the
   spacing-snap policy live in `resolution-config.json` and are *proposed
   defaults*. If this run shows they're wrong, tune them; that's what the first
   real run is for. (The guardrails block in that file is **not** tunable.)

## After the run — close the loop

This run is the **golden-pair validation for Lovable**
(`validation-checklist.md`). Whatever you learn — signals that misfired,
thresholds that were off, gaps that recurred — record it, because
"no production migration on an unvalidated library" is the standing rule, and
this is what lifts Lovable out of unvalidated.
