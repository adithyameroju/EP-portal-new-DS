# Compass packaging (S3) — how the npm package works

> Built 2026-07-07 (S3 packaging lane). Entry: `lib/index.ts` → `dist/` via
> `npm run build:pkg` (tsup). This file is the honest record of what the
> package ships, what a consumer must do, and the known limitations.

## What's in the tarball

`"files"` allowlist (we use `files`, **not** `.npmignore` — see below):

| Path | Why |
|---|---|
| `dist/` | Bundled ESM (`index.js`) + CJS (`index.cjs`) + types (`index.d.ts` / `.d.cts` / `.d.mts`) + sourcemaps + a `dist/package.json` (`{"type":"module"}`, see §Extensions) |
| `app/fonts.css` | `@font-face` rules for Euclid Circular B, exposed as the `./fonts.css` export |
| `app/fonts/` | The 10 licensed `.woff2` files that `app/fonts.css` references via relative `url("./fonts/…")` — they must sit next to it inside the package |
| `cli/` | The `compass` CLI (`"bin"` entry, built by the CLI lane) |
| `components/ui/` | CLI runtime needs: root anchor + `*.meta.ts` for `compass component`; also ships the readable source of record |
| `.claude/specs/`, `.claude/skills/`, `CLAUDE.md` | Copied into consumer projects by `compass init`; `compass component --spec` reads specs |
| `scripts/token-audit.mjs`, `scripts/compliance-audit.mjs`, `scripts/audit-rubric.json` | The three audit files `compass init` scaffolds (only these — other scripts stay private) |
| `app/globals.css` | Read (not exported) by `compass init` to generate the consumer token-import guide from the real import chain |
| `lib/PACKAGING.md` | This document |

`package.json`, `README.md` and `LICENSE*` are always included by npm
automatically. Everything else (app pages, stories/, Storybook config,
`.claude/settings.json`, drift-log, .compass-build, remaining scripts)
stays out — verified by listing the tarball (196 files, no leaks).

**Why `files` and not `.npmignore`:** `files` is an allowlist — anything new
added to the repo is excluded by default, so a forgotten ignore entry can
never leak internal material (specs, logs, tokens config, .env patterns)
into a published tarball. `.npmignore` is a denylist with the opposite
failure mode, and it *silently replaces* `.gitignore` when present. One
mechanism, fail-closed: `files`.

## Exports map

```jsonc
".":           { "import": { types, default: "./dist/index.js" },
                 "require": { types: "./dist/index.d.cts", default: "./dist/index.cjs" } },
"./fonts.css": "./app/fonts.css",
"./package.json": "./package.json"
```

Named exports: all public exports of the 55 `components/ui/*` modules
(377 unique names, zero collisions — verified with a TypeScript
program-level duplicate scan), plus the meta layer
(`componentMetaIndex`, `allComponentMeta`, every `*Meta` object, all
`_meta-schema` types) and `cn`.

## What a consumer imports (the CSS story)

The package ships **JS + fonts only**. Styling comes from Tailwind v4 +
the token chain, exactly mirroring this repo's `app/globals.css` (the
source of truth for this list):

```css
/* consumer's globals.css */
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@acko/enterprise-tokens/globals.css";   /* the Compass tokens — REQUIRED */
@import "compass-design-system/fonts.css";        /* Euclid Circular B @font-face */

@custom-variant dark (&:is(.dark *));

/* Tailwind v4 must scan the package's dist for class names it emits: */
@source "../node_modules/compass-design-system/dist";
```

Consumer prerequisites (verified in the acceptance test): only
`tailwindcss` v4 + `@tailwindcss/postcss` as devDependencies, plus the
`.npmrc` line for the `@acko` scope
(`@acko:registry=http://nexus-dev.acko.in:8080/repository/quark-skill/`).
`tw-animate-css`, `shadcn` (for `shadcn/tailwind.css`) and
`@acko/enterprise-tokens` all arrive automatically as the package's own
dependencies. We deliberately do **not** export `./globals.css`: that file
is this app's composition and imports the token package by name; consumers
own their globals and compose the same chain themselves (recipe above,
mirrored from `app/globals.css`).

The `@source` line matters: component class names live inside
`dist/index.js`, which is under the consumer's `node_modules` and outside
Tailwind's default content scan.

## Extensions / module format

Root `package.json` has **no** `"type": "module"`, deliberately: the repo is
also a Next app and the CLI lane may ship CJS bin scripts; flipping the root
type would change how every plain `.js` in the repo is parsed. Instead the
`build:pkg` script writes `dist/package.json` → `{"type":"module"}` after
tsup finishes (post-build step, not tsup `onSuccess` — that races the
parallel dts worker), so:

- `dist/index.js` = ESM (correctly parsed by Node, vitest, bundlers)
- `dist/index.cjs` = CJS (extension is self-describing)
- `dist/index.d.ts` = ESM types; `dist/index.d.cts` = copy for
  `moduleResolution: node16/nodenext` consumers on the `require` path

## "use client" — the honest limitation

esbuild (inside tsup) **drops per-file `"use client"` directives when
bundling**. We restore it with `banner: { js: '"use client";' }`, which puts
the directive at line 1 of **each whole bundle** (verified in dist output).

Consequence: the entire barrel is one client module. Verified behavior in
the S3 acceptance test (Next 16 consumer):

- **Rendering components from a server component works** — `<Badge>` in an
  RSC page builds and statically prerenders fine (the import is the client
  boundary; client components still SSR).
- The 19 components that are server-safe in source (badge, card, kbd,
  skeleton, table, …) become client components when imported from the
  package; importing anything pulls the whole module into the client graph.
- **Calling non-component exports from a server component FAILS**: a server
  page invoking `cn()` (or reading `componentMetaIndex` values) dies at
  build with `Error: Attempted to call cn() from the server but cn is on
  the client.` Consumers must use `cn`/meta from client modules — or, for
  meta in tooling, from plain Node scripts, where `"use client"` is a no-op
  (verified: `node -e "import('…/dist/index.js')"` reads all 55 metas).

If per-file directives ever matter, the fix is an unbundled build
(`bundle: false` + preserved module structure) or
`esbuild-plugin-preserve-directives`; deferred as out of S3 scope.

## Tree-shaking caveat

Single-bundle output + `"use client"` at module top: modern bundlers still
tree-shake the ESM build per-export, but side-effect analysis is coarser
than with per-file modules. Bundle is ~400 KB unminified pre-shake; fine for
apps, revisit (per-component entries) if bundle-size complaints arrive.

## Publishing (owner-held)

- `"private": true` **stays** — it blocks `npm publish` only. **Verified:
  `npm pack` works fine with `private: true`** (tarball produced, contents
  correct), so local/tarball distribution needs no change. At real publish
  time the owner flips `private` (and should rename — `compass-design-system`
  is a placeholder; roadmap says `@acko/compass` on Acko Nexus).
- Publish-time TODO (out of S3 scope, flag for owner/FE-dev):
  `react`/`react-dom`/`next` currently sit in `dependencies` (this repo is
  also the app). Before a real registry publish they should move to
  `peerDependencies`, or consumers risk a second React copy when versions
  drift. With the tarball flow and matching versions, npm dedupes and this
  is a non-issue (proved in the S3 acceptance test).
- Semver policy + CHANGELOG/Changesets: separate S3 checklist items, not
  part of this lane.

## Build & verify

```bash
npm run build:pkg                      # tsup → dist/
npm pack --pack-destination /private/tmp   # tarball (never in the repo; *.tgz gitignored)
```

Acceptance test (2026-07-07): fresh hand-rolled Next 16 app in
/private/tmp/compass-pkg-test, installed the tarball + externals,
`tsc --noEmit` + `next build` — see `.compass-build/log/s3-package.md`.
