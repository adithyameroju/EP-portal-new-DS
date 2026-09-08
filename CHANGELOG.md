# Changelog

All notable changes to Compass are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/); versioning follows the
approved Compass semver policy (additive = minor · token/behavior change =
major, shipped with a codemod · docs-only = patch).

> **Release definition-of-done (owner ruling 2026-07-21; amended 2026-09-08):** a
> release is NOT shipped until its entry appears in BOTH this file AND the
> **SOP → Updates** tab (`stories/compass-sop.mdx` + `compass-sop.html`), phrased for
> designers (date · what changed · what they do — usually "nothing, pull is
> automatic"), **AND a local Chromatic republish (`npm run chromatic`) has run so the
> live docs show the change** — a release isn't shipped until the live docs carry it.
> Same enforcement discipline as the `.compass-build/STATE.md` decision log.

## [Unreleased] — on `main`, 2026-07-21

Designer-facing changes shipped this week. **What you do: nothing** — the rule pulls
these automatically next time you say "Using Compass in Loop" (one-time exceptions:
paste the Settings bootstrap once, and build on a branch).

### Added / changed
- **Automatic drift capture on every build** — the AI commits its raw output, then
  records a `drift-log/entries/` record (your "What I assumed" list) with no manual
  step. This is how the system learns from what it got wrong.
- **`/compass-health` is scoped to *your* work** and every warning now carries a
  plain "To fix, prompt Cursor:" line. The rich trend dashboard moved to owners.
- **Audit accuracy** — a false "hand-rolled Menubar" flag was removed; a new advisory
  check catches bespoke CSS/animation outside the motion system.
- **Status/semantic-token gap now surfaces as the top drift hotspot** — driven by real
  Figma-frame + migration builds that kept mapping success/info/warning onto other
  tokens. (Proposal staged; values are an owner + FE-dev decision.)
- **Zero-touch updates** — on session start the rule fetches and offers to pull
  Compass tightenings into your branch (never force).
- **Safer access** — `main` is branch-protected (PR + owner review + audit CI); you
  build on your own branch and push it at end of day.
- **Drift telemetry via Google Drive** — after each build the drift entry + score
  sync to a shared "Compass Drift" folder (per-designer subfolder, username derived
  from git/GitHub identity, sticky). Fail-safe: offline → queued locally, drained
  next session; never blocks a build. Owner reads the synced folder as the primary
  aggregation source. No PATs, no API keys, no git remote for telemetry.
  *What designers do differently: nothing after setup* (one-time: accept the folder
  share, Add-shortcut-to-Drive, paste the path once when the rule asks).
- **This SOP page** + the **Compass Feel** craft pack (Setup tab) + a third-party
  skills gate.

## [0.1.0] — 2026-07-07

First packaged release (tag `s3-build-complete`).

### Added
- 55 components on shadcn/ui v4 + Base UI, all with machine-readable
  `meta.ts` contracts (33 fully specced, 10 Figma Code Connect mapped).
- Package: `@acko/compass` — esm+cjs+types barrel (377 exports), verified
  against a fresh Next 16 consumer via tarball install.
- CLI: `compass init` (58-item governance scaffold), `compass component`,
  `compass docs tokens`, `compass migrate`.
- Storybook: 55 component docs pages, 6 token-rendered foundations pages,
  interactive "Working with Compass" SOP, Changelog page; deployed to
  Chromatic.
- Audit loop: token audit (commit gate) + behavioral compliance audit
  (C1–C7a) + drift ledger (`compass log`) + detect/prescribe + HTML dashboard.
- Migration skill (`compass-migrate`): React+Tailwind targets, strangler-fig
  procedure, meta-resolved component mapping, owner-gated repointing.
- Euclid Circular B self-hosted (300–700 + italics) under the exact family
  name the token package declares.

### Known limitations
- Bundle carries a top-of-file `"use client"` banner: server components can
  render package components but cannot call non-component exports from server
  code (documented in `lib/PACKAGING.md`).
- Migration golden-pair signals unvalidated against real sample repos.
