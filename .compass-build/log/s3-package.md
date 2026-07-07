# S3 Package & Distribution — Track Log

*Append-only. Timestamped. Lanes: packaging (barrel/tsup/exports) · CLI.*

---

## 2026-07-07 — CLI lane: compass CLI built + verified

### What was built (CLI lane only — package.json/lib/tsup untouched, owned by packaging lane)
- `cli/compass.mjs` — entry (shebang, dispatch, help). Commands: `init [--dry-run]`,
  `component <name> [--spec|--json]`, `docs tokens`, `migrate` (pointer only), `--help`.
- `cli/lib/paths.mjs` — package-root resolution (two dirs above the lib file), works both
  from the repo checkout and from `node_modules/<pkg>/`; anchors verified (components/ui,
  .claude/specs, .claude/skills, CLAUDE.md) so a broken install fails loudly.
- `cli/lib/meta-loader.mjs` — ComponentMeta loader; same TS-transpile trick as
  scripts/compliance-audit.mjs#loadMetaIndex (transpileModule + data: URL import), with a
  cwd-relative `createRequire` fallback so a consumer's hoisted `typescript` is found.
  Clear "install typescript" message when absent.
- `cli/lib/init.mjs` — scaffolds into cwd: compass-tokens-import.md (GENERATED at run time
  from the package's app/globals.css import chain; fonts.css carried as an explicit
  manual-step note since Euclid is licensed and not distributed), .claude/specs/** (42
  files), .claude/skills/** (12 files incl. compass-audit/ + compass-migrate/), CLAUDE.md,
  scripts/token-audit.mjs + compliance-audit.mjs + audit-rubric.json, and merges npm
  scripts `audit` / `audit:compliance`. Never clobbers: identical → "already present,
  skipped"; differing → CONFLICT, refused, exit 1. `--dry-run` prints the plan, writes
  nothing.
- Zero runtime dependencies beyond node built-ins (`typescript` is read from the host
  project, exactly like compliance-audit does).

### Verification (all passed)
- `node cli/compass.mjs --help` — factual usage.
- `compass component button` — real meta (variants, tokens, anti-patterns w/ sources,
  aiHints); `--spec` dumps button.md; `--json` raw meta; unknown name → exit 1 + the
  55-name list.
- `compass docs tokens` — prints token-reference.md (178 lines).
- `compass migrate` — pointer to .claude/skills/compass-migrate/SKILL.md, no logic.
- /private/tmp/compass-cli-test (bare package.json): `init --dry-run` (58 items, nothing
  written) → real init (58 created, scripts merged) → re-run (0 created, 58 skipped,
  exit 0) → conflict test (edited CLAUDE.md + scripts.audit → both refused, untouched,
  exit 1). Copied scripts run in the consumer: token-audit exit 0; compliance-audit
  exit 0 (C2/C3/C4 degrade gracefully without typescript).
- node_modules simulation: package copied to consumer/node_modules/@acko/compass;
  `component badge`, `component field --spec`, `docs tokens`, `init` all work; meta loads
  via the consumer's hoisted typescript.
- Repo hygiene: `npx eslint cli/` clean; cli/ contains no hex or arbitrary-value strings
  (grep-verified); tsc/audit/lint failures present in the tree trace to dist/ (packaging
  lane tsup output — dist/index.js is what flips `npm run audit` red) and
  stories/patterns/migrate.stories.tsx (S5 lane) — NOT cli/.

### For the orchestrator
- bin snippet to add when packaging lane touches package.json:
  `"bin": { "compass": "./cli/compass.mjs" }`
- FLAG (packaging lane): dist/ output is currently scanned by token-audit and eslint —
  needs an ignore (audit EXCLUDE_DIRS + eslint ignores + .npmignore reconciliation).
- Note: `compass init` at the repo root itself would generate compass-tokens-import.md
  (everything else reports already-present); harmless, only ran with --dry-run.
