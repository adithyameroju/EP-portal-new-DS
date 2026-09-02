# Compass Feel — Motion restraint

> How Compass moves: fast, quiet transitions — 150ms ease-in-out by default, no showy animation.

> Source note: motion tokens aren't in the Figma export; these values are the Tailwind v4 / shadcn defaults Compass inherits as its motion source of truth. <!-- foundations/motion.md -->

## Rules

- Default any state transition to 150ms + `ease-in-out`. Only deviate when the design explicitly calls for other timing. <!-- foundations/motion.md -->
- Use `transition-colors` for hover/focus color changes, not `transition-all` (which forces layout recalcs). <!-- foundations/motion.md -->
- Enter with `ease-out` (decelerate into rest); exit with `ease-in` (accelerate away). <!-- foundations/motion.md -->
- No animation on first paint — animate only on interaction or state change, never on page load. <!-- foundations/motion.md -->
- Respect `prefers-reduced-motion`: wrap transitions in `motion-safe:` or disable them. <!-- foundations/motion.md -->
- No custom keyframes. Use the shadcn defaults; flag anything a design needs beyond them. <!-- foundations/motion.md -->

## Typical timings

- Button hover: `transition-colors duration-150`. <!-- foundations/motion.md -->
- Dropdown open: `duration-200 ease-out`; close: `duration-150 ease-in`. <!-- foundations/motion.md -->
- Accordion / sidebar layout change: `duration-300 ease-in-out`. <!-- foundations/motion.md -->
- Dialog fade in: `duration-200 ease-out`; fade out: `duration-150 ease-in`. <!-- foundations/motion.md -->

## Do / Don't

- Do: `transition-colors duration-150` on an interactive element. <!-- foundations/motion.md -->
- Don't: `transition-all` on hover, or a bespoke keyframe when a shadcn default exists. <!-- foundations/motion.md -->
