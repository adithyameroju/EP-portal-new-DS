# Compass Feel — Spacing rhythm

> How Compass space breathes: a 4px grid, Tailwind scale only, responsive page rhythm.

## Rules

- Use only values from the spacing scale. Never invent `p-[13px]` or `gap-[22px]`; snap to the nearest scale value. <!-- foundations/spacing.md -->
- Respect the 4px grid. Almost every value is a multiple of 4px (exceptions: `px`=1px and half-steps like 0.5=2px, 1.5=6px). <!-- foundations/spacing.md -->
- Use Tailwind spacing utilities (`p-4`, `gap-6`, `m-2`), never raw `padding: 16px`. The audit flags raw pixels. <!-- foundations/spacing.md -->
- Map Figma values to the nearest class: 24px padding → `p-6`, not `p-[24px]`. <!-- foundations/spacing.md -->
- Use responsive tokens for page-level layout (`container-padding-x`, `section-padding-y`); don't hardcode separate mobile/desktop values. <!-- foundations/spacing.md -->

## Rhythm patterns (guidelines, not tokens)

- Icon + text inline gap: `gap-2` (8px). <!-- foundations/spacing.md -->
- Input internal padding: `px-3 py-2` (12px / 8px). <!-- foundations/spacing.md -->
- Card internal padding: `p-4` or `p-6` (16px / 24px). <!-- foundations/spacing.md -->
- Stacked form fields: `gap-4` (16px). <!-- foundations/spacing.md -->
- Between page sections: `gap-8` to `gap-16` (32–64px). <!-- foundations/spacing.md -->
- Page horizontal margin: `px-4` mobile (16px), `px-6` desktop (24px). <!-- foundations/spacing.md -->

## Do / Don't

- Do: constrain content with a container token (`container/lg`=512px standard column). <!-- foundations/spacing.md -->
- Don't: hand-tune a one-off pixel gap when a scale step lands within a few px. <!-- foundations/spacing.md -->
