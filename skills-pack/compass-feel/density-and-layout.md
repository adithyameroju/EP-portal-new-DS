# Compass Feel — Density and layout

> How dense Compass feels: 4px-grid spacing, restrained radius, and shadow used sparingly for real elevation.

## Spacing density

- Snap to the spacing scale; respect the 4px grid (only `px` and half-steps break it). <!-- foundations/spacing.md -->
- Card padding is `p-4` or `p-6`; stacked fields sit at `gap-4`. <!-- foundations/spacing.md -->
- Section-to-section breathing room is `gap-8`–`gap-16` (32–64px). <!-- foundations/spacing.md -->

## Radius (restraint)

- Pick from the closed radius scale. Never `rounded-[7px]` or `rounded-[10px]`. <!-- foundations/radius.md -->
- Default component radius is `rounded-md` (6px) — buttons, inputs, selects. When in doubt, use this. <!-- foundations/radius.md -->
- Cards and containers step up to `rounded-lg` (8px). <!-- foundations/radius.md -->
- `rounded-full` is only for circles and pills (avatars, status dots, pill badges) — never cards. <!-- foundations/radius.md -->
- Nested rounding shrinks inward: inner radius smaller than outer (a `rounded-lg` card holding a `rounded-md` button), never the reverse. <!-- foundations/radius.md -->

## Elevation (restraint)

- Use only shadow tokens; never write arbitrary `box-shadow`. <!-- foundations/elevation.md -->
- Flat by default. Sections within a page carry no elevation (level 0). <!-- foundations/elevation.md -->
- Cards rest at `shadow-xs` (1px border + `shadow-xs`), lifting to `hover:shadow-md`. <!-- foundations/elevation.md -->
- Dialogs and modals use `shadow-lg` — not `shadow-2xl` (that's rare max emphasis). <!-- foundations/elevation.md -->
- More elevation = higher in the hierarchy: popovers/dropdowns `shadow-md`, modals `shadow-lg`, overlays `shadow-xl`/`2xl`. <!-- foundations/elevation.md -->
- No text shadows — not part of Compass. <!-- foundations/elevation.md -->

## Do / Don't

- Do: let depth read through the token hierarchy — flat page, subtle cards, real shadow only on floating surfaces. <!-- foundations/elevation.md -->
- Don't: increase shadow opacity for dark mode; the tokens already handle it. <!-- foundations/elevation.md -->
