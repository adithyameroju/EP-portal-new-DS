# PROPOSED — C7 font compliance (paint-level) — backlog addition from Nikhil

*S4 track design doc. Status: PROPOSED — design only this session, per
coordinator instruction. Not implemented.*

## The failure this prevents (real, from S0)

Token audit + tsc + lint were all green while **every screen silently rendered
in the system fallback font**: the tokens package declared
`"Euclid Circular B"` but no `@font-face` under that exact family name existed
until `app/fonts.css` fixed it. Static scanning of component code can never
catch this class of failure — the code was "correct"; the *rendered paint* was
wrong.

## Two tiers (cheap static + definitive rendered)

### C7a — declaration consistency (static; could build pre-S1 with owner go)

No meta.ts dependency; pure file analysis, fits `compliance-audit.mjs` today:

- Collect every `font-family` **usage**: from the tokens package CSS
  (`node_modules/@acko/enterprise-tokens/**/*.css`), `app/globals.css`, and
  any `--font-*` variables.
- Collect every `@font-face { font-family: ... }` **declaration**: from
  `app/fonts.css` (and any other project css).
- **Error `C7-fontface-missing`** when a used family has no matching
  declaration (exact string match — the S0 bug was precisely a name mismatch)
  and is not on a known system-stack allowlist (`-apple-system`, `sans-serif`,
  `ui-monospace`, …).
- **Warning `C7-fontfile-missing`** when a declaration's `src: url(...)`
  resolves to a file that does not exist in `app/fonts/` / `public/`.
- Also verifies the reverse: declared faces that nothing references (dead
  weight, warning).

Catches the exact historical failure at commit time, zero browser needed.

### C7b — paint-level probe (rendered DOM; definitive)

Static consistency still can't prove the browser *loaded and painted* the font
(corrupt woff2, bad `unicode-range`, CSP, 404 at runtime). C7b runs a headless
browser probe — **Playwright is already a devDependency**, no new install:

- Boot the app (`next start` or the Storybook static build once S2 exists) on
  an ephemeral port; open a representative route (`/`; later: one story per
  foundations page).
- In-page assertions:
  1. `document.fonts.ready` then `document.fonts.check('16px "Euclid Circular B"')`
     must be true → else **error `C7-font-not-loaded`**;
  2. every `FontFace` in `document.fonts` with family `"Euclid Circular B"`
     has `status === 'loaded'` (not `error`);
  3. `getComputedStyle` on probe elements (`body`, first heading, a `Button`)
     — `font-family` must *begin with* the brand family, and a canvas
     measure-text width comparison against the fallback stack must differ
     (proves actual glyph substitution, not just the CSS string) → else
     **error `C7-computed-fallback`**.
- Emits findings in the standard shape into a normal compliance report
  (`file` = the probed route), so score/dashboard integration is free; the
  radar gets no new axis — C7 folds into the report totals, and the dashboard's
  DIMENSIONS list gains a C7 row (one-line change).

## Cadence + wiring (owner decision needed)

- C7a: cheap — candidate for every `audit:compliance` run.
- C7b: needs a built/served app (~seconds–minutes) — proposed as **on-demand +
  nightly/CI**, NOT the commit gate. `npm run audit:fonts` wrapper.

## NEEDS OWNER DECISION (flagged, not decided here)

1. Should C7a fold into the default `audit:compliance` run (recommended), and
   may it be built **before** S1 lands since it has no meta dependency? It is
   outside the currently approved build-now scope (C1/C5/C6), so it waits for
   explicit approval either way.
2. C7b trigger policy: nightly CI, pre-release only, or manual? (Trade-off:
   earlier catch vs. build-time cost.)
3. Probe surface for C7b once S2 exists: app routes, Storybook foundations
   pages, or both?
