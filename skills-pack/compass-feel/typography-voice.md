# Compass Feel — Typography voice

> How Compass text should feel: single-typeface, semibold headings, tight display tracking.

## Rules

- Set everything in Euclid Circular B. Never substitute Inter, system-ui, or Arial. <!-- foundations/typography.md -->
- The system is single-typeface: sans, serif, and mono all point to Euclid Circular B. <!-- foundations/typography.md -->
- Body is `text-base font-normal` (16px / 24px line-height, weight 400). Don't drop to `text-sm` for body unless the design shows 14px. <!-- foundations/typography.md -->
- Headings are semibold (600). Don't reach for bold (700) unless the Figma design explicitly shows it. <!-- foundations/typography.md -->
- Use the heading presets (`heading-xl/lg/md/sm`), not hand-composed sizes. <!-- foundations/typography.md -->
- Keep the negative letter-spacing on headings (e.g. -1.2, -0.9). It is intentional — don't normalize it. <!-- foundations/typography.md -->
- Headings step down one size on mobile: apply the mobile size at base, desktop at `md:`/`lg:`. <!-- foundations/typography.md -->
- Reach for three weights: normal (400) body, medium (500) labels/nav, semibold (600) headings/buttons. Anything else needs the design to show it. <!-- foundations/typography.md -->
- Ship only weights 300–700. Thin/extralight and extrabold/black don't exist in the system. <!-- foundations/typography.md -->
- Use Tailwind text classes (`text-sm`, `text-base`), never raw `font-size: 14px`. <!-- foundations/typography.md -->

## Do / Don't

- Do: `className="text-5xl md:text-6xl font-semibold tracking-tighter"` for a hero heading. <!-- foundations/typography.md -->
- Don't: manually compose a heading from individual size/weight/spacing tokens when a preset fits. <!-- foundations/typography.md -->
