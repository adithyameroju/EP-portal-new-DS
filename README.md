# Compass — Acko Enterprise Design System

> **v0.1.0** · Built on [shadcn/ui](https://ui.shadcn.com/) + [Tailwind CSS v4](https://tailwindcss.com/) + [Next.js 15](https://nextjs.org/)

Compass is Acko's enterprise design system — a single source of truth for every
color, spacing value, component, and interaction pattern used across Acko products.

---

## What's in this repo

| Directory | Contents |
|-----------|----------|
| `components/ui/` | ~55 shadcn/ui primitives, customized with Compass tokens |
| `components/blocks/` | Acko-specific screen compositions (Phase 3+) |
| `app/globals.css` | 3-layer token system: Tailwind primitives → Acko aliases → shadcn-compatible semantic names |
| `.claude/specs/` | Foundation specs, component specs, token cross-reference map |
| `.claude/` | AI agent config — skills, principles, contributor & designer guides |
| `scripts/token-audit.js` | Enforcement script — catches hardcoded values, bypassed tokens |
| `code-connect/` | Figma Code Connect mappings for Dev Mode |

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

Compass uses a **3-layer token system**:

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

Button, Input, and Card components are connected to Figma Dev Mode via Code Connect.
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
| `npm run figma-publish` | Publish Code Connect mappings to Figma |

---

## For designers

See **[Designer Guide](.claude/designers.md)** — plain-English guide for Figma workflow,
hand-off process, and what Code Connect means for your dev handoff.

## For contributors

See **[Contributing Guide](.claude/contributing.md)** — token rules, audit requirements,
component architecture, and the PR review process.

---

## Phase status

| Phase | Status | What was built |
|-------|--------|---------------|
| Phase 0 | ✅ Complete | Repo setup, Next.js + shadcn + Tailwind v4, 3-layer token architecture |
| Phase 1 | ✅ Complete | Foundation specs (color, spacing, typography, radius, elevation, motion), token reference |
| Phase 2 | ✅ Complete | Token audit script + CI, CODEOWNERS, Import Variables skill, Code Connect for Button/Input/Card |
| Phase 3 | ✅ Complete | Generate Code skill, component specs (Button, Card), AI testing, drift fixes |
| Phase 4 | 🔜 Planned | Additional component specs, team onboarding, more Code Connect mappings |

---

**Owner:** Nikhil Thakkar · Acko Design System Team
