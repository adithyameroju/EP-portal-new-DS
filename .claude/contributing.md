# Contributing to Compass

> **Who this is for:** Engineers contributing code to the Compass design system.
> Read this before opening a PR. It covers the token rules, audit requirements,
> component architecture, and the review process.

---

## Before you start

1. **Read `CLAUDE.md`** — it's the single source of truth for coding rules in
   this repo. This file expands on it for contributor workflows.

2. **Read the relevant spec file** for any component you're touching:
   - `.claude/specs/foundations/` — color, spacing, typography, radius, elevation, motion
   - `.claude/specs/components/` — Button, Input, Card (more added over time)
   - `.claude/specs/tokens/token-reference.md` — the master token cross-reference

3. **Never modify a spec file without a design system review.** Specs are the
   contract between design and code. Changes need explicit sign-off from the
   design system owner.

---

## Token rules (non-negotiable)

Compass enforces a semantic token system. Every color, spacing value, and radius
in component code must use a named token — never a raw value.

| Rule | Example — WRONG | Example — CORRECT |
|------|----------------|-------------------|
| No hardcoded hex | `bg-[#6841E6]` | `bg-primary` |
| No Tailwind color utilities | `bg-purple-600`, `text-gray-700` | `bg-primary`, `text-muted-foreground` |
| No arbitrary spacing | `p-[13px]`, `gap-[22px]` | `p-3`, `gap-4` |
| No arbitrary radius | `rounded-[7px]` | `rounded-md` |

### Running the audit

```bash
npm run audit
```

This scans all files in `components/`, `app/`, and `styles/` for violations.
**Zero errors required before any commit.** Warnings are acceptable in shadcn
base components (they use some internal arbitrary values) but should not be
introduced in new code.

The audit runs automatically on every PR via GitHub Actions (`.github/workflows/audit.yml`).
A PR with audit errors will not be merged.

---

## Component architecture

### Three layers — don't cross them

```
Layer 1: Tailwind CSS v4 primitives (@theme in globals.css)
           |
Layer 2: Acko brand aliases (--acko-primary-light, --acko-primary-dark, ...)
           |
Layer 3: shadcn-compatible semantic names (--primary, --foreground, ...)
```

- **Layer 1** (globals.css `@theme` block) — Only touch during token import.
  Follow `.claude/skills/import-variables.md`.
- **Layer 2** — Acko brand values mapped to light/dark. Same — only touch during
  token sync.
- **Layer 3** — What component code uses (`bg-primary`, `text-foreground`, etc.).
  This is the only layer you interact with when writing components.

### Component files

All component primitives live in `components/ui/`. These are shadcn/ui components,
customized for Compass tokens. **The full list of owned files is in `.github/CODEOWNERS`.**

**Rules for `components/ui/`:**
- Do not create new files here without going through the component proposal process
- Do not modify existing files without a spec review and CODEOWNERS approval
- All PRs touching these files require `@nikhilpthakkar` review

**`components/blocks/`** is where Acko-specific screen compositions live —
things like login forms, dashboard cards, etc. These are assembled from `components/ui/`
primitives and are less strictly gated.

---

## Working with the AI toolchain

Compass uses AI-assisted code generation via **Cursor + Figma MCP**. The
`.claude/skills/` directory contains prompt files that define how to generate
code from Figma frames.

When you're reviewing AI-generated code:

- Check that every component import comes from `@/components/ui/`
- Check the "What I assumed" section in the AI's output — confirm or correct each item
- Run `npm run audit` before accepting the output
- The drift check in `.claude/skills/generate-code.md` Step 4 defines
  what the AI should self-verify — use it as your review checklist too

---

## PR process

1. **Branch from `main`**. Branch naming: `feat/`, `fix/`, `docs/`, `chore/`
   prefix + short description. Example: `feat/add-select-spec`

2. **Run `npm run audit`** and confirm zero errors.

3. **Fill out the PR template** (when one exists). For now: describe what changed,
   link to the spec or Figma frame it's based on, and list any assumptions made.

4. **CODEOWNERS review:** PRs touching `components/ui/`, `.claude/specs/`, `.claude/skills/`,
   `app/globals.css`, `CLAUDE.md`, or `.claude/principles.md` require `@nikhilpthakkar`
   approval before merge.

5. **Squash merge** to keep the `main` history clean.

---

## Figma Code Connect

The `code-connect/` directory contains `.figma.tsx` mapping files that connect
Figma components to their React equivalents for Dev Mode display.

To publish Code Connect mappings:
```bash
npm run figma-publish
```

This requires a Figma Personal Access Token. See the Code Connect setup doc
(or ask the design system owner for the token).

**Important:** The `--skip-validation` flag is required for our Figma file —
it exceeds the validation step's size limit. This flag is already baked into
`npm run figma-publish`.

---

## Adding a new component spec

If you're adding a component to `.claude/specs/components/`:

1. Copy the structure from an existing spec (`button.md` is the reference)
2. Include: component location, anatomy table, variants table, common patterns,
   Figma -> code translation cheat sheet, and Rules for LLMs section
3. The "Rules for LLMs" section is required — it's what the code generator reads
4. Have it reviewed by the design system owner before merging

---

## Getting help

- **Design system owner:** Nikhil Thakkar (`@nikhilpthakkar`)
- **Slack:** #compass-design-system
- **Spec questions:** Open a discussion in the repo before making changes
