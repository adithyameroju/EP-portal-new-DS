# drift-log/ — the Compass drift ledger

This folder is the **machine-readable truth** for the S4 audit loop: every
AI-assisted build session gets one JSON entry here. Slack stays as informal
overflow, but the loop only reads this ledger.

## How an entry gets here

After finishing a build (e.g. a Cursor session from a Figma frame), run:

```bash
npm run log
```

That command (`scripts/compass-log.mjs`):

1. asks you to paste the "What I assumed" block from the AI's output
   (finish with an empty line),
2. auto-detects which files the session created/changed (via git; override
   with `--files a.tsx,b.tsx` if needed),
3. auto-detects which Compass components those files import,
4. writes `entries/<ISO-timestamp>__<designer>__<slug>.json`
   (format: [`schema.json`](./schema.json)).

Designed for **zero friction** — if any auto-detection fails it degrades
gracefully rather than blocking; you can always log with flags only.

## Folder layout — one handoverable drift folder

This folder is designed to be **the whole drift picture in one hand**: capture,
scoring, clustering, proposals, and migration evidence all live here.

| Path | What | In git? |
|------|------|---------|
| `schema.json` | Entry format (JSON Schema) | yes |
| `entries/` | One JSON per build session — the evidence trail (Capture) | **yes (committed)** |
| `proposals/` | Spec-tightening proposals (Prescribe output; owner approves) | **yes (committed)** |
| `reports/` | Compliance-audit JSON reports (`npm run audit:compliance`) — derived | no (gitignored) |
| `detect/` | Drift-clustering output (`npm run detect`) — derived | no (gitignored) |
| `dashboard.html` | Per-project health dashboard (`npm run dashboard`) — derived | no (gitignored) |
| `owner-dashboard.html` | **Owner-level cross-team rollup (`node scripts/owner-dashboard.mjs`) — derived, NEW** | no (safe to gitignore) |
| `migrations/<project>/` | **Migration reports for `compass-migrate` runs, per target project — NEW** | see note below |

**Committed (evidence trail):** `entries/` and `proposals/` — the human-authored
record the loop reasons over. **Derived (regenerable, gitignored):** `reports/`,
`detect/`, `dashboard.html`, `owner-dashboard.html`.

### `migrations/<project>/` (NEW)

When the `compass-migrate` skill migrates a foreign codebase, its report set is
written **here in the Compass repo** (not in the target repo, where reports used
to land under `.migration/`). One subfolder per target project/flow
(`<project>` = target repo/flow name, kebab-case), each containing the fixed
report files: `_baseline.md`, one `<unit>.md` per migrated unit,
`_needs-decision.md`, `_gap-list.md`, `_snap-log.md`, `_summary.md`, and
`_inventory.json`. The **target** repo gets only the migrated code branch; the
Compass drift-log gets the reports — so the owner reviews one folder, not two
repos. Templates live in
[`.claude/skills/compass-migrate/report-templates.md`](../.claude/skills/compass-migrate/report-templates.md).

### Per-project dashboard vs owner dashboard

- **`dashboard.html`** (`npm run dashboard` → `scripts/generate-dashboard.mjs`)
  answers *"how is THIS repo doing?"* from the compliance reports: health radar,
  severity distribution, priority matrix, per-component cards, score trend.
- **`owner-dashboard.html`** (`node scripts/owner-dashboard.mjs`) answers the
  **owner's** question across the ledger: *"across every designer, project, and
  Compass version, where is drift concentrating and on whom?"* — component &
  rule hotspots (frequency × severity), rule frequency, per-designer and
  per-project rollups, and a trend over time. It **excludes demo entries** and
  renders an honest empty state ("No non-demo entries yet — this fills as
  designers build") when there is little/no real data; it never invents numbers.
  `project` is not a ledger field, so it is **derived** from each entry's
  `targetFiles` and labeled as derived in the page. Preview the populated layout
  on sample data with `node scripts/owner-dashboard.mjs --include-demo` (output
  is clearly marked DEMO).

  > **Integrator note (wiring left open):** the owner dashboard is invoked
  > directly with `node scripts/owner-dashboard.mjs`. An `owner:dashboard` npm
  > script was **not** added because `package.json`'s scripts block is shared
  > across concurrent work — the integrator should add
  > `"owner:dashboard": "node scripts/owner-dashboard.mjs"` to `package.json`
  > and, if desired, a `/drift-log/owner-dashboard.html` line to `.gitignore`
  > (alongside the existing `dashboard.html` entry) when consolidating.

## How the loop uses it

- **Score** — `npm run audit:compliance -- --entry drift-log/entries/<file>.json`
  scores exactly that build's files (checks C1/C5/C6 now; C2/C3/C4 after S1)
  and writes a report to `reports/`.
- **Detect** (post-S1) — reads the last N entries + reports, clusters drift
  hotspots per component/rule, and mines recurring assumption categories
  (a repeated assumption = a spec that failed to decide something).
- **Prescribe** (post-S1) — every proposed spec tightening must cite entries
  from this ledger as evidence. Proposals only — the owner approves; nothing
  is ever auto-applied.

Entries with `"demo": true` are samples and are ignored by Detect and by the
owner dashboard (both exclude them unless `--include-demo` is passed).
