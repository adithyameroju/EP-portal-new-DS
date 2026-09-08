# Compass — Acko Enterprise Design System

> **v0.1.0** · Built on [shadcn/ui](https://ui.shadcn.com/) + [Tailwind CSS v4](https://tailwindcss.com/) + [Next.js 16](https://nextjs.org/)

Compass is Acko's enterprise design system — a single source of truth for every
color, spacing value, component, and interaction pattern used across Acko products.

---

## What's in this repo

| Directory | Contents |
|-----------|----------|
| `components/ui/` | 55 shadcn/ui primitives, customized with Compass tokens (each with a `.meta.ts` descriptor) |
| `components/blocks/` | Acko-specific screen compositions (Phase 3+) |
| `app/globals.css` | Imports the token system from the `@acko/enterprise-tokens` package, plus `./fonts.css` (Euclid Circular B) |
| `.claude/specs/` | Foundation specs, 33 component specs, token cross-reference map |
| `.claude/` | AI agent config — skills, principles, contributor & designer guides |
| `scripts/token-audit.mjs` | Enforcement script — catches hardcoded values, bypassed tokens |
| `code-connect/` | Figma Code Connect mappings for Dev Mode (10 components) |
| `stories/` | Storybook stories and doc pages (deployed via Chromatic) |
| `cli/` | Compass CLI (`compass` binary — `cli/compass.mjs`) |
| `drift-log/` | Audit ledger — build-session entries, compliance reports, detect output, dashboard |
| `COMPASS_SYSTEM.md` | Durable system handbook (stamped at tag `s3-build-complete`) |
| `COMPASS_ONBOARDING.md` | Cold-start guide for any future session |
| `Compass_GA_Roadmap.md` | Road-to-GA build roadmap (stages S0–S6) |

---

## Getting started

```bash
# Install dependencies
npm install

# Run the dev server (view component kitchen sink at localhost:3000)
npm run dev

# Run the token audit (zero errors required before committing)
npm run audit
```

---

## Token architecture

Compass uses a **3-layer token system**, defined in the `@acko/enterprise-tokens`
package and imported via `app/globals.css`:

```
Layer 1 — Tailwind CSS v4 primitives
  @theme { --color-primary: ...; }

Layer 2 — Acko brand aliases
  --acko-primary-light: oklch(...)
  --acko-primary-dark: oklch(...)

Layer 3 — shadcn-compatible semantic names
  --primary: var(--acko-primary-light);  /* light mode */
  --primary: var(--acko-primary-dark);   /* dark mode */
```

Component code only ever uses Layer 3 names: `bg-primary`, `text-foreground`,
`border-input`, etc. Never hardcoded hex, never Tailwind color utilities.

---

## AI-assisted code generation

Compass is designed to work with AI tools (Cursor + Figma MCP) for converting
Figma frames into production-ready React components.

**How it works:**
1. Load the skill files (`.claude/skills/generate-code.md`)
2. Provide a Figma frame URL
3. The AI generates a component using only Compass tokens and `components/ui/` imports
4. Run `npm run audit` — zero errors required before accepting the output

**Proven in Phase 3 testing:**
- Test 1: 3 structural drift items found (CardTitle replaced with divs, extra border on Card, Ghost button className overrides)
- Test 2: All 3 fixed — zero drift items, zero errors, zero hallucinations

---

## Figma Code Connect

Ten components are mapped to Figma Dev Mode via Code Connect: Button, Card,
Dialog, Field, Input, Select, Sheet, Sidebar, Table, Tabs.
When a designer selects a Compass component in Figma's Dev Mode, they see correct
React code instead of auto-generated CSS.

```bash
# Publish Code Connect mappings (requires Figma PAT)
npm run figma-publish
```

---

## Key scripts

| Script | What it does |
|--------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run audit` | Run token audit (zero errors required before commit) |
| `npm run audit:compliance` | Behavioral compliance audit — grades a build against the rubric (additive to `audit`) |
| `npm run log` | Record an AI-assisted build session in the drift ledger (`drift-log/entries/`) |
| `npm run detect` | Cluster drift patterns across recent ledger entries |
| `npm run prescribe` | Propose tightening plans from detected drift (proposes only — owner approves) |
| `npm run dashboard` | Generate the static health dashboard (`drift-log/dashboard.html`) |
| `npm run storybook` | Start Storybook dev server (port 6006) |
| `npm run build:pkg` | Build the distributable package (tsup) |
| `npm run chromatic` | Publish Storybook to Chromatic |
| `npm run figma-publish` | Publish Code Connect mappings to Figma |

---

## For designers

See **[Designer Guide](.claude/designers.md)** — plain-English guide for Figma workflow,
hand-off process, and what Code Connect means for your dev handoff.

## For contributors

See **[Contributing Guide](.claude/contributing.md)** — token rules, audit requirements,
component architecture, and the PR review process.

---

## Build status

Stages per `Compass_GA_Roadmap.md`; ledger in `.compass-build/STATE.md`
(baseline tag `s3-build-complete`, 2026-07-07; latest on `main`, 2026-07-21).

**Live docs:** [Storybook on Chromatic](https://main--6a4c6bc7a7294c9b64f0b80e.chromatic.com/)
— 56 components / 176 stories, incl. the interactive Compass SOP. This is the stable
`main` branch permalink (always the latest published build; access-gated to repo members).

| Stage | Status | What was built |
|-------|--------|---------------|
| S0 | ✅ Complete | Foundation — Euclid Circular B fonts, tokens repointed to `@acko/enterprise-tokens@1.0.0`, metadata cleanup |
| S1 | ✅ Complete | Meta layer — 55 `.meta.ts` component descriptors + index, spec fixes |
| S2 | ✅ Complete | Storybook + SOP — deployed to Chromatic (55 components / 171 stories) |
| S3 | ✅ Built | Package + CLI — npm-pack tarball verified in a fresh Next 16 consumer; registry publish pending owner go |
| S4 | ✅ Operational | Audit loop — compliance scoring (C1–C8, incl. invented-motion advisory), drift ledger, detect, prescribe, dashboard |
| S5 | ✅ Built | Migration tool (compass-migrate) — engine live, dry-run verified; validation on sample repos pending |
| S6 | 🔜 Not started | — |

**Since GA (`main`, 2026-07-21):** interactive **Compass SOP** designer front-door
page (Setup / Loop / Updates) · **Compass Feel** craft pack · **Drive drift-telemetry**
transport — per-designer subfolders, owner-primary aggregation, fail-safe (never
blocks a build) · **sharpened compliance audit** (C8 invented-motion advisory,
per-entry scoring). See `CHANGELOG.md` → `[Unreleased]` and the SOP → **Updates** tab.

---

**Owner:** Nikhil Thakkar · Acko Design System Team
