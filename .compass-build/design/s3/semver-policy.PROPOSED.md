# Compass semver policy (PROPOSED — S3; owner approves per roadmap)

Source: Compass_GA_Roadmap.md §S3 bullet, near-verbatim; mechanics added only
where the roadmap is silent (marked).

## The policy

| Change | Bump | Ships with |
|---|---|---|
| New component or new variant (additive) | **minor** | changelog entry |
| Token value change or component behavior change | **major** | **a codemod** (non-negotiable — roadmap) |
| Docs/spec/story-only | **patch** | changelog entry |

- Per-component `version` in `meta.ts` bumps through the S6 promotion pipeline
  (scaffold skill auto-updates CHANGELOG on additive changes — roadmap §S6.1).
- Package version = the repo `package.json` version; component versions are
  informational surfaces of the same release train (mechanics addition — no
  roadmap statement; owner may prefer independent component versioning).

## Changelog discipline (choice for owner)

- **(a) Plain CHANGELOG.md** — hand-maintained per release, format: Keep-a-
  Changelog headings; zero new dependencies. RECOMMENDED for now: one writer
  (Nikhil + orchestrator), low release cadence.
- **(b) Changesets** — per-PR changeset files, automated versioning/publish;
  one devDependency; earns its keep when multiple contributors release.
  Roadmap names it as the alternative ("or Changesets").

## Release steps (once owner approves + provides registry credentials)

1. `npm run build:pkg` → dist/ ; 2. version bump per table; 3. CHANGELOG entry;
4. `npm publish` to Acko Nexus (@acko scope per .npmrc) — **owner-gated, needs
credentials**; 5. tag `v<version>`.
