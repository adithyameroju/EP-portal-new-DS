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

## Folder layout

| Path | What | In git? |
|------|------|---------|
| `schema.json` | Entry format (JSON Schema) | yes |
| `entries/` | One JSON per build session — the evidence trail | **yes (committed)** |
| `reports/` | Compliance-audit JSON reports (`npm run audit:compliance`) | no (regenerable, gitignored) |
| `dashboard.html` | Static health dashboard (`npm run dashboard`) | no (regenerable, gitignored) |

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

Entries with `"demo": true` are samples and are ignored by Detect.
