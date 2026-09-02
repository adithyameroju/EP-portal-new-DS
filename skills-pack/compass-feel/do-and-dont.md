# Compass Feel — Do and Don't

> The Compass reflexes: tokens over values, system over invention, surface every judgment call.

## Tokens

- Do: use semantic token classes — `bg-primary`, `text-foreground`, `border-input`, `text-muted-foreground`. <!-- CLAUDE.md (Token rules) -->
- Don't: hardcode hex — no `bg-[#6841E6]`, no `text-[#000000]`. <!-- CLAUDE.md (Token rules) -->
- Don't: use raw Tailwind color utilities — no `bg-purple-600`, `text-gray-700`, `bg-zinc-50`. They bypass the token system. <!-- CLAUDE.md (Token rules) -->
- Don't: use arbitrary spacing or radius — no `p-[13px]`, `gap-[22px]`, `rounded-[7px]`. Scale/named tokens only. <!-- CLAUDE.md (Token rules) -->
- Do: keep `npm run audit` at zero errors before any commit. <!-- CLAUDE.md (Token rules) -->

## Components

- Do: source every element from `components/ui/`. Never hand-write a `<button>`/`<input>`/`<div>` where a Compass component exists. <!-- CLAUDE.md (Component rules) -->
- Don't: create or modify files in `components/ui/` without owner confirmation / spec review — these are CODEOWNERS-owned primitives. <!-- CLAUDE.md (Component rules) -->
- Do: use composite sub-components correctly (Card → CardHeader/Content/Footer; Field → Field/FieldLabel/FieldError). Don't rebuild their layouts with divs. <!-- CLAUDE.md (Component rules) -->
- Do: icons from `lucide-react` only — no mixing. <!-- CLAUDE.md (Component rules) -->
- Do: navigate with `render={<Link href="..." />}` on Button; use the `render` prop for composition, never Radix `asChild`. <!-- CLAUDE.md (Component rules) -->

## Universal reflex

- Do: surface it. When Figma data, a spec, or a token doesn't cleanly map, present it as a quick question — never bury the judgment call in code. <!-- CLAUDE.md (Universal rule) -->
- Don't: silently substitute. This is the single most important rule against drift. <!-- CLAUDE.md (Universal rule) -->

## Principles (tiebreakers)

- System over invention: compose from existing components; if the system lacks it, that's a signal to extend the system, not work around it. <!-- .claude/principles.md -->
- Tokens over values: every color/space/radius/shadow/font is a token; approximation isn't allowed. <!-- .claude/principles.md -->
- Correctness over speed: an extra iteration to match the spec beats "close enough" shipped fast. <!-- .claude/principles.md -->
- Closed set, open composition: primitives are tightly specified and owned; any composition of them into layouts is encouraged. <!-- .claude/principles.md -->
- When two principles don't resolve it, surface the ambiguity to the designer — don't guess. <!-- .claude/principles.md -->
