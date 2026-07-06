# Compass compliance rubric — ruleId reference

Weights: `scripts/audit-rubric.json` (owner-tunable; do not restate numbers
here). Implementation: `scripts/compliance-audit.mjs`.

## C1 — token discipline

| ruleId | Level | Fires when | Fix |
|--------|-------|-----------|-----|
| `C1-hex` | error | hardcoded hex color in class/style | semantic token (`.claude/specs/tokens/token-reference.md`) |
| `C1-tw-color` | error | raw Tailwind color utility (`bg-red-500`, `text-zinc-700`) | semantic token class |
| `C1-arbitrary-value` | error | arbitrary spacing/typography/radius (`p-[13px]`, `text-[15px]`, `rounded-[7px]`) | scale value (`.claude/specs/foundations/spacing.md`) |
| `C1-arbitrary-layout` | warning | arbitrary pure layout dimension (`w-[220px]`, `h-[64px]`) | OK if intentional; prefer scale when close |
| `C1-arbitrary-other` | warning | arbitrary value with unrecognized prefix | judge case by case |
| `C1-raw-style` | warning | raw px in a `style` object | Tailwind utility |

Notes: opacity overlays (`bg-black/80`) and quoted attr-selector hexes
(`[stroke='#ccc']`) are deliberately allowed, matching token-audit.

## C2 — provenance (re-implemented primitives)

| ruleId | Level | Fires when |
|--------|-------|-----------|
| `C2-raw-element` | error | raw `<button>/<input>/<select>/<textarea>/<table>` where a Compass primitive exists. Element→primitive map is DERIVED at runtime from primitive sources + the CLAUDE.md component rule — never hand-maintained. Escape hatch for legitimate cases: `// compass-allow: raw-<element>` on the same or previous line. |
| `C2-shape-match` | warning | `div`/`span` whose className carries ≥2 of a primitive's meta `tokens` (≥1 distinctive to ≤2 components) without importing that primitive. Heuristic — always verify. |

TODO (pending owner ruling): replace derivation with a `primitiveElements`
field on ComponentMeta if approved.

## C3 — composite completeness

| ruleId | Level | Fires when |
|--------|-------|-----------|
| `C3-missing-subparts` | warning | a composite (meta `childComponents` non-empty) is rendered WITH children but none of its sub-parts appear in the file. Self-closing usage is skipped. |

Severity is uniformly `warning`: promoting specific composites (e.g. Dialog
without DialogTitle — an a11y failure) to `error` is a pending owner tuning
decision; meta has no "required sub-part" flag to cite yet.

## C4 — spec coverage

| ruleId | Level | Fires when |
|--------|-------|-----------|
| `C4-unspecced` | warning | imported ui component has `specStatus: "none"` / no `specPath`. This is the demand-driven backfill signal (S6.3) — no per-build action needed. |
| `C4-spec-missing` | warning | meta `specPath` points at a file that doesn't exist (flag to owner; never edit meta). |
| `C4-no-meta` | warning | imported ui component missing from the meta index entirely (unexpected). |

## C5 — naming

| ruleId | Level | Fires when |
|--------|-------|-----------|
| `C5-naming` | error | non-kebab-case file or directory in `app/`, `components/`, `hooks/`, `lib/`, `stories/`. Allowed: Next.js conventions (`(group)`, `[param]`, `@slot`, `_private`), leading-underscore files (`_meta-schema.ts`), multi-dot suffixes (`button.figma.tsx`). Code files only. |

Open owner question (2026-07-07): should `stories/` follow kebab-case or
Storybook's PascalCase convention? Until ruled, the documented kebab rule
applies and findings there are true per the current rule.

## C6 — import hygiene

| ruleId | Level | Fires when |
|--------|-------|-----------|
| `C6-import-path` | error | ui primitive imported via a relative/non-alias path instead of `@/components/ui/<name>` |
| `C6-shadow-primitive` | error | a `.tsx/.jsx` file outside `components/ui/` named exactly after a primitive (copied/re-implemented primitive). `code-connect/` exempt. |

## C7 — font compliance (DESIGN-ONLY)

Not implemented. Two proposed tiers (static declaration-consistency + headless
paint probe): `.compass-build/design/s4/c7-font-compliance.PROPOSED.md`.
