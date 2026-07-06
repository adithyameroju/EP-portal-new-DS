# S1 spot-check notes (running) — items needing Nikhil's ruling

Collected from generation agents' reports. Final spot-check pack will fold
these in alongside the antiPatterns/confusedWith citation review.

## From the lightweight (22) agent
1. **`direction` category is wrong-ish:** renders no UI — it re-exports Base
   UI's DirectionProvider + useDirection hook. Neither atom/template/pattern
   fits. Options: add a "utility" category to the schema, or exclude it from
   the taxonomy. → owner decision.
2. `sonner` = app-level Toaster singleton; "organism" defensible, noted only.
3. **primitiveSource judgment call:** `button-group` and `item` import only
   Base UI *utilities* (merge-props, use-render) while composing ui/separator.
   Agent applied the mechanical rule → "base-ui" (they ARE affected by Base UI
   version bumps — the S5/watch-item concern). Alternative: "composite".
4. `spinner` renders a lucide icon only → "native" (no lucide mapping exists).
5. `item`: ItemMedia's `variant` axis (default|icon|image) collides by prop
   name with root Item's `variant` (default|outline|muted); only root axes
   kept. Schema may eventually want per-sub-component variant scoping.
6. `toggle-group`'s numeric `spacing` prop omitted (schema wants string enums).
7. tokens arrays: opacity modifiers stripped (ring-ring, not with the /50
   suffix); non-semantic values (overlay utilities, slider's known bg-white
   thumb, native-select's Canvas background) deliberately excluded.
8. `sonner`/`pagination` have empty tokens (CSS-var styling / Button supplies).

## From the S5 agent (affects S1 consumers)
- Part B rubric = PROPOSED at .compass-build/design/s5/resolution-design.PROPOSED.md
  with 3 open questions for Nikhil (thresholds; provisional-mapping prewrite;
  spacing-snap handling).
- One embedded UX opinion flagged: report view disables "Approve batch" while
  needs-decision items are pending (inference from hard rules; removable).
