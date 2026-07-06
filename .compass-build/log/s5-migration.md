# S5 Migration Tool — Track Log

> Append-only, timestamped. Track owner: S5 sub-agent (Fable 5). Gate: S1 (meta.ts)
> for Part B implementation; S2 for Storybook integration; S3 for CLI shipping.
> NOT gated on S4. Per PLAN.md §2/§3 and S5_Migration_Tool_Design_Spec.md.

---

## 2026-07-06 — Session 1: docs read, build checklist PROPOSED

**Done this session:**
- Read in full: `Compass_GA_Roadmap.md`, `.compass-build/STATE.md`,
  `.compass-build/design/S5_Migration_Tool_Design_Spec.md`, `.compass-build/PLAN.md`,
  root `CLAUDE.md`.
- Studied repo: 55 primitives in `components/ui/` (incl. `resizable`, `tabs`,
  `empty`, `skeleton`, `input-group` — useful for the Migrate UI shell); existing
  skills are **flat files** (`.claude/skills/generate-code.md` etc.), not
  `<name>/SKILL.md` directories; `components/blocks/` exists (1 test file);
  Storybook configured but zero stories; S0 running concurrently in the same tree.
- No files created/modified other than this log (per session constraints).

**Status:** checklist below is PROPOSED — nothing executes until Nikhil approves
via the orchestrator.

---

### PROPOSED build checklist — "BUILD NOW" scope only (Part A + Part C shell)

#### Part A — `compass-migrate` skill skeleton (no dependencies)

- [ ] **A1. Create the skill file** at `.claude/skills/compass-migrate.md`
      (flat file, matching the 3 existing skills — see Open Question 1; the S5
      spec says `compass-migrate/SKILL.md`, which conflicts with current layout).
      Architecture reverse-engineered from shadcn's `migrate-radix-to-base` skill
      (cited as ancestor; discipline reused, mappings discarded).
- [ ] **A2. Preflight section** (procedure text in the skill): require clean git
      tree in the *target* repo; always work on a migration branch; detect package
      manager from lockfile and use it; run the target's typecheck/build FIRST and
      record the baseline to `.migration/_baseline.md` so pre-existing failures are
      never attributed to the migration.
- [ ] **A3. Strangler-fig orchestration section**: migrate one flow/component at a
      time; write migrated version as a `-compass` variant so original + new
      coexist and the target stays buildable at every step; repoint consumers one
      at a time with a typecheck after each; only then delete original and rename
      `-compass` → original. Explicitly forbid big-bang rewrites.
- [ ] **A4. Golden-pair diffing section**: when the source library is identifiable
      (MUI/Chakra/Ant/stock shadcn), diff each component against its stock origin
      to separate team customizations from base; customizations survive the swap.
      Bespoke/unknown source → fall back to role-based resolution (Part B —
      written as a stub section explicitly marked **GATED ON S1**, no mapping
      tables, no heuristics content yet).
- [ ] **A5. `.migration/` report format** — templates embedded in the skill (the
      real `.migration/` directory is created inside the *target* repo at run
      time, never in this repo):
      - `_baseline.md` — pre-existing typecheck/build/lint state, package manager,
        detected stack, source library (if identified).
      - `<unit>.md` — one per flow/component, fixed structure:
        **Changed / Left alone / Behavior changes (→ QA) / Verify by hand**.
      - `_gap-list.md` — "no Compass equivalent" items (feeds S6); schema stub.
      - `_needs-decision.md` — low-confidence mappings + unclustered tokens queued
        for Nikhil; schema stub.
      - Rule: migration status is **derived from disk** (scan for un-migrated
        imports), never maintained as a hand-edited index.
- [ ] **A6. Hard rules embedded verbatim in the skill**: presentation layer only
      (JSX / className / imports; never hooks logic, data fetching, routing,
      state); flag behavior deltas for QA, never silently patch; honest reporting
      (skipped ≠ migrated; flagged listed as flagged); low confidence / no
      equivalent → human review / gap list, never a guess; per-batch
      plan-then-execute with owner approval.
- [ ] **A7. Scope statement in the skill**: v1 targets React + Tailwind only;
      prove end-to-end on one internal repo before widening.

#### Part C — "Migrate" UI shell (isolated component, NOT wired into Storybook)

- [ ] **C1. Location** `components/blocks/migrate/` (blocks = Acko compositions
      per CLAUDE.md; NOT `components/ui/`, which is gated). Kebab-case files.
      *Sequencing note:* S0 is concurrently editing this tree — I will only start
      C1 when the orchestrator confirms no S0 collision (see Open Question 2).
- [ ] **C2. `migrate-entry.tsx`** — entry pane: GitHub URL input OR zip upload
      dropzone (Compass `input`, `input-group`, `button`, `card`, `empty`).
      Pure presentation: props + callbacks, static/mock state, **no network, no
      unzip, no execution logic**.
- [ ] **C3. `migrate-batch-list.tsx`** — batch breakdown view: batches by
      route/flow with status (pending / in review / approved / flagged / skipped),
      per-batch confidence summary and gap-list count (Compass `card`, `badge`,
      `table` or `item`, `progress`). Mock data via props.
- [ ] **C4. `migrate-preview.tsx`** — dual preview panes: original vs Compass
      side-by-side (Compass `resizable` split, `tabs` for look/report toggle,
      `skeleton` loading states, `separator`). Panes accept arbitrary children /
      mock frames; no live rendering of foreign code in this shell.
- [ ] **C5. `migrate-report.tsx`** — per-batch report view rendering the A5
      structure (Changed / Left alone / Behavior changes / Verify by hand) +
      gap-list and needs-decision sections, with approve / flag actions as
      callback props (no state management beyond local UI state).
- [ ] **C6. `index.ts`** barrel for the block + a `mock-data.ts` with one
      realistic sample migration (clearly marked SAMPLE).
- [ ] **C7. Compliance pass**: tokens-only styling (semantic classes, no hex, no
      arbitrary values), composite sub-components used correctly, lucide icons
      only, `npm run audit` 0 errors, `npx tsc --noEmit` no new errors vs
      baseline, no `data-figma-*` attrs. Not imported by any route or story yet.

#### Bookkeeping (every session)

- [ ] **D1.** Append timestamped entry to this log after each work session.
- [ ] **D2.** Commit(s) via orchestrator convention `S5.<task>: <what> [PROPOSED]`
      — I will not run git myself unless the orchestrator delegates it.

---

### DESIGN NOW / BUILD AFTER S1 (for visibility — not in this checklist's scope)

Part B resolution design (inventory role-detection signals, meta.ts matching
fields, confidence rubric with numeric thresholds, token clustering method, gap
list + needs-decision schemas) will be written to this log as PROPOSED in the
next session, after this checklist is approved. **No Part B implementation until
STATE.md shows S1 exit criteria met.** Storybook wiring waits for S2; `compass
migrate` CLI waits for S3.

---

### Open questions for Nikhil (via orchestrator)

1. **Skill file shape:** S5 spec says `.claude/skills/compass-migrate/SKILL.md`;
   the 3 existing skills are flat `.claude/skills/<name>.md`. I recommend the
   flat file to match the repo's current convention (and let a future S3 CLI
   restructure all skills at once if needed). Confirm?
2. **UI shell location/timing:** OK to create `components/blocks/migrate/` for
   the Part C shell? And should I wait for S0 to exit before touching
   `components/blocks/` (S0 is live in the same tree), or is a coordinated
   go-ahead enough?
3. **Golden-pair reference set:** for v1, which known libraries should the
   golden-pair procedure name explicitly? Proposed: stock shadcn/ui, MUI,
   Chakra, Ant (per spec) — plus Lovable/Replit default output (usually stock
   shadcn) since PM handoff is the headline use case.

**Blocked on:** Nikhil's approval of this checklist (relayed by orchestrator).
Nothing above executes until then.
