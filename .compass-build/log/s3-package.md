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

---

## 2026-07-07 — packaging lane: barrel + tsup + exports + tarball acceptance test

Scope per orchestrator brief. Publish-to-registry HELD (owner go — DECISION LOG
2026-07-07); verification ran against a local `npm pack` tarball. Full consumer
story documented in `lib/PACKAGING.md` (new — the canonical packaging doc).

### Files created / changed
- `lib/index.ts` — NEW barrel: 55 `components/ui/*` modules (full public
  exports) + `_meta-schema` types + `_meta-index` (55 metas, `componentMetaIndex`,
  `allComponentMeta`) + `cn`. Duplicate-export scan (TS program-level): 377
  unique names, 0 real collisions (only the 7 schema types re-exported by both
  meta modules — same symbols, benign).
- `tsup.config.ts` — NEW: esm+cjs, dts, sourcemap, clean; externals = react/
  react-dom/next + all runtime deps (`/^@base-ui\/react/` regex for deep
  subpaths); banner `"use client";`; outExtension esm→`.js` / cjs→`.cjs`;
  dts `incremental:false` (repo tsconfig's `incremental:true` → TS5074 in
  tsup's dts worker).
- `package.json` — `build:pkg` script (tsup + post-steps writing
  `dist/package.json` `{"type":"module"}` and copying `index.d.ts`→`.d.cts`;
  NOT in tsup onSuccess — it races the parallel dts worker, empirically
  d.cts went missing); `main`/`module`/`types`; exports map (`.` with
  per-condition types, `./fonts.css` → app/fonts.css, `./package.json`);
  `bin: {compass: ./cli/compass.mjs}` (CLI lane's requested snippet, applied);
  `files` allowlist; `"private": true` UNTOUCHED; tsup → devDependencies.
- `.gitignore` — `/dist/`, `*.tgz`. `tsconfig.json` — exclude +`"dist"`
  (hygiene; root `**/*.ts` include was sweeping generated d.ts).
- `lib/PACKAGING.md` — NEW: tarball contents rationale, consumer CSS recipe,
  use-client limitation (with reproduced failure), format/extension design,
  publish-time TODOs.

### Key decisions
1. **`files` allowlist, no `.npmignore`** — fail-closed (new repo content
   excluded by default; `.npmignore` fails open and silently replaces
   .gitignore). Extended beyond the brief's three entries to carry the CLI
   runtime set (cli/, components/ui/, .claude/specs+skills, CLAUDE.md, the 3
   audit files, app/globals.css) — required for `bin` to work from
   node_modules; each entry justified in PACKAGING.md.
2. **No root `"type":"module"`** (CLI lane may ship CJS; repo-wide .js
   reparse risk). Instead `dist/package.json` `{"type":"module"}` →
   dist/index.js is real ESM, dist/index.cjs self-describing — exactly the
   exports shape the brief specified, Node-correct. `index.d.cts` for
   node16-resolution `require`.
3. **use-client = whole-bundle banner** (brief-offered option): esbuild drops
   per-file directives when bundling; banner puts `"use client"` at line 1 of
   both bundles (grep-verified: exactly once, first statement). Per-file
   preservation deferred (bundle:false / esbuild-plugin-preserve-directives).
4. **`@/` alias: no plugin needed** — esbuild + tsup dts both read tsconfig
   `paths` natively; proven by consumer type resolution from dist.

### Verification (all PASSED)
- `npm run build:pkg`: dist/index.js 401 KB ESM / index.cjs 430 KB /
  d.ts+.d.cts+.d.mts 60.7 KB / maps / dist/package.json. Externals stayed
  external (only the 15 external pkgs + react/jsx-runtime imported; cn +
  use-mobile inlined; no lucide/recharts internals).
- Node smoke: ESM import + CJS require load; 368 runtime exports; 55 metas
  readable from plain Node.
- **`npm pack` works WITH `"private":true`** (verified — private blocks
  publish only). Tarball `/private/tmp/compass-design-system-0.1.0.tgz`:
  953.1 kB / 3.4 MB unpacked / 196 files; leak-grep clean (no settings.json,
  .env, drift-log, stories, .compass-build).
- **Acceptance test** `/private/tmp/compass-pkg-test` (hand-rolled Next
  16.2.4 / react 19.2.4 consumer, repo .npmrc for @acko scope):
  `npm install` OK (tokens from Nexus as transitive dep; react deduped to a
  single copy); `tsc --noEmit` PASS; `next build` PASS with a client page
  (Button/Card/cn/meta) AND an RSC page rendering Badge from a server
  component. **CSS story proven end-to-end**: consumer added only
  tailwindcss + @tailwindcss/postcss; globals.css per PACKAGING.md recipe
  (incl. `@source` on package dist + `compass-design-system/fonts.css`);
  emitted CSS has token vars (--primary ×37), generated Compass utilities
  (.bg-primary), Euclid @font-face; woff2 in .next/static/media.
- **CLI-from-tarball proven**: `npx compass --help` / `component button`
  work from node_modules/.bin; `compass init` in a bare scratch project
  scaffolds 58 items (specs, skills incl. compass-audit/ + compass-migrate/,
  CLAUDE.md, audit scripts). Closes the CLI lane's bin flag; their dist/
  audit-scan flag was already resolved by the scripts lane (EXCLUDE_DIRS has
  'dist', annotated S3 2026-07-07) — `npm run audit` green with dist present.
- Repo green after all changes: `tsc --noEmit` 0 errors, `npm run lint`
  clean, `npm run audit` 0 errors (warnings = baseline).

### Honest caveats
1. **RSC boundary (reproduced, documented)**: server components may RENDER
   package components but may NOT CALL non-component exports — `cn()` from a
   server page fails `next build` ("Attempted to call cn() from the server
   but cn is on the client"); same for reading meta values. Client modules
   and plain Node scripts are fine.
2. The 19 source-server-safe components become client components via the
   package (still SSR; whole barrel is one client module; tree-shaking
   per-export but coarser than per-file). Fix = unbundled build, out of S3.
3. react/react-dom/next remain `dependencies` (repo doubles as the app) —
   flag for publish time: move to peerDependencies; harmless in tarball flow
   (single-React dedupe verified).
4. Package name `compass-design-system` is the placeholder; roadmap says
   `@acko/compass` — owner/publish-time rename.
5. Consumer needs the `@acko` .npmrc line (Nexus) or install fails on the
   tokens dependency.
6. `date-fns`/`next` are in the external list per brief but not actually
   imported by components/ui today (harmless).
7. Semver policy, CHANGELOG/Changesets, registry publish = remaining S3
   checklist items, not this lane.

Artifacts: tarball `/private/tmp/compass-design-system-0.1.0.tgz`
(sha1 of first pack a1856c88…; repacked after CLI-files extension),
consumer `/private/tmp/compass-pkg-test`, init scratch
`/private/tmp/compass-init-test`.
