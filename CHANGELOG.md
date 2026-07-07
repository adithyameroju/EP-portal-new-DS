# Changelog

All notable changes to Compass are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/); versioning follows the
approved Compass semver policy (additive = minor · token/behavior change =
major, shipped with a codemod · docs-only = patch).

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
