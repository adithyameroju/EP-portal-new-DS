# Compass Design System — Claude Code Instructions

> You are working on **Compass**, Acko's enterprise design system built on
> shadcn/ui and Tailwind CSS v4. Read this file fully before writing or
> modifying any code. It overrides all default behaviors.

---

## Linked documentation

All supporting docs live in `.claude/`. Read the relevant ones before acting.

| File | When to read |
|------|-------------|
| [`.claude/principles.md`](.claude/principles.md) | When a design decision is ambiguous and specs don't resolve it — this is the tiebreaker |
| [`.claude/contributing.md`](.claude/contributing.md) | Before opening a PR or reviewing contributor workflows |
| [`.claude/designers.md`](.claude/designers.md) | When helping a designer with Figma handoff or setup |
| [`.claude/skills/generate-code.md`](.claude/skills/generate-code.md) | Before generating any UI code from a Figma frame or screenshot |
| [`.claude/skills/import-variables.md`](.claude/skills/import-variables.md) | Before syncing token changes from a Figma export |
| [`.claude/skills/write-to-figma.md`](.claude/skills/write-to-figma.md) | Before writing designs back to Figma |

## Spec files (read before touching any component)

| Spec area | Location | Contains |
|-----------|----------|----------|
| Foundations | `.claude/specs/foundations/` | color, spacing, typography, radius, elevation, motion |
| Components | `.claude/specs/components/` | button, input, card, dialog, tabs, and 30+ more |
| Token map | `.claude/specs/tokens/token-reference.md` | Master cross-reference of all Figma tokens to code |
| Figma keys | `.claude/specs/figma/component-keys.md` | Figma library component keys for write-back |

If a component spec exists in `.claude/specs/components/`, follow it exactly.

---

## Working rhythm (non-negotiable)

- **Plan-then-execute, always.** For any task with more than one step, propose
  a checklist first, wait for confirmation, then execute one item at a time.
  Mark each `[x]` done before moving to the next. Never batch changes silently.
- **Ask before anything irreversible.** Deleting files, restructuring folders,
  installing new dependencies, running scripts that modify many files, any Git
  operation. Reversible things (writing a new file, editing one just created) —
  proceed.
- **Nikhil is a designer, not a developer.** Explain in plain English as you go.
  When suggesting a command, say what it does. When something fails, explain why
  before fixing it.
- **Strategy decisions go back to Claude.ai.** If a real choice arises that's
  not in the spec files or this file, flag and pause. Don't decide unilaterally.

---

## Token rules (enforced by audit script)

- **Only use semantic token classes**: `bg-primary`, `text-foreground`,
  `border-input`, `text-muted-foreground`, etc.
- **Never hardcode hex values**: no `bg-[#6841E6]`, no `text-[#000000]`.
- **Never use Tailwind color utilities**: no `bg-purple-600`, no `text-gray-700`,
  no `bg-zinc-50`. These bypass the token system.
- **Never use arbitrary spacing**: no `p-[13px]`, no `gap-[22px]`. Only values
  from the spacing scale (`p-1` through `p-96`).
- **Never use arbitrary radius**: no `rounded-[7px]`. Only named tokens
  (`rounded-sm`, `rounded-md`, `rounded-lg`, etc.).
- `npm run audit` must pass with zero errors before any commit.

---

## Component rules

- **All components come from `components/ui/`**. Never write a raw `<button>`,
  `<input>`, or `<div>` where a Compass component exists.
- **Never create new files in `components/ui/`** without explicit owner
  confirmation. State what you're about to create and its purpose, then wait.
- **Never modify existing `components/ui/` files** without spec review. These
  are Compass primitives owned by CODEOWNERS.
- **Use composite sub-components correctly**: Card uses CardHeader/CardContent/
  CardFooter. Dialog uses DialogHeader/DialogTitle/DialogContent/DialogFooter.
  Form uses FormField/FormItem/FormLabel/FormControl/FormMessage. Don't
  reimplement their layouts with divs.
- **Icons from `lucide-react` only** (the active icon library). No mixing.
- **Navigation = `render={<Link href="..." />}` on Button**, not `onClick` + `router.push()`.
  Example: `<Button render={<Link href="/path" />} variant="link">Go</Button>`
- **Base UI composition pattern.** This repo uses shadcn/ui v4 which is built on
  Base UI, not Radix. For composition (rendering a component as a different element),
  use the `render` prop: `<SidebarMenuButton render={<Link href="/dashboard" />}>`.
  Do NOT use `asChild` — that is the Radix pattern and will cause React warnings.
  Check each component's source (`components/ui/`) if unsure.
- **No `data-node-id` or `data-figma-*` attributes in production code.** These
  Figma traceability attributes are acceptable in isolated test files
  (`components/blocks/`) and Storybook stories, but must never appear in
  production screens or reusable components.
- **Figma write-back: library instances only.** When writing designs to
  Figma, use `importComponentByKeyAsync()` with keys from
  `.claude/specs/figma/component-keys.md`. Never use `createFrame()` to represent
  a Compass component. See `.claude/skills/write-to-figma.md`.

---

## Next.js agent rules

This version of Next.js has breaking changes — APIs, conventions, and file
structure may differ from your training data. Read the relevant guide in
`node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

---

## Universal rule

**Never silently substitute.** When Figma data, a spec, or a token doesn't
cleanly map to what you're building, surface it explicitly. Present it as a
question the designer can confirm quickly — never bury the judgment call inside
the code. This is the single most important rule for preventing drift.

---

## Repo structure

```
compass-design-system/
├── CLAUDE.md                ← You are here (auto-loaded every session)
├── README.md                ← Project overview for humans
├── .claude/
│   ├── settings.json        ← Permissions & allowed commands
│   ├── principles.md        ← Design principles & tiebreakers
│   ├── contributing.md      ← Contributor workflows & PR process
│   ├── designers.md         ← Designer guide (Figma handoff, setup)
│   ├── skills/
│   │   ├── generate-code.md ← Figma frame → React component
│   │   ├── import-variables.md ← Figma token export → globals.css
│   │   └── write-to-figma.md   ← Code → Figma library instances
│   └── specs/               ← CANONICAL spec location (decided S0.1, 2026-07-06)
│       ├── foundations/     ← color, spacing, typography, radius, elevation, motion
│       ├── components/      ← button, input, card (33 specs; more added on demand)
│       ├── tokens/          ← token-reference.md (master cross-ref)
│       └── figma/           ← component-keys.md (Figma library keys)
├── app/
│   └── globals.css          ← imports Tailwind, shadcn, and @acko/enterprise-tokens
│                              (tokens live in that package) — do not hand-edit
├── components/
│   ├── ui/                  ← shadcn primitives (all ~55 components)
│   └── blocks/              ← Acko-specific compositions (Phase 3+)
├── stories/                 ← CANONICAL Storybook stories location (built in S2)
├── scripts/
│   └── token-audit.js       ← Runs on commit. Zero errors required.
└── code-connect/            ← .figma.tsx mapping files for Dev Mode
```

**Canonical layout (owner decision, S0.1):** specs live in `.claude/specs/` —
never in a top-level `specs/`; Storybook stories live in top-level `stories/`.
Any tree that diverges from this conforms to this layout, not the other way round.

---

## Audit command

```bash
npm run audit      # runs scripts/token-audit.js
```

Zero errors required before committing. If audit fails, fix before proceeding.
The audit catches: hardcoded hex colors, arbitrary pixel values, raw Tailwind
color utilities used instead of semantic token classes.
