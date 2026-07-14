# C7 font compliance (paint-level) — backlog addition from Nikhil

*S4 track design doc. Status: **C7a BUILT 2026-07-07**. **C7b TRIGGER POLICY
RULED 2026-07-07 (owner): on-demand only, NOT gated, and BUILD DEFERRED** — no
trigger has occurred, and C7a (static, runs at commit) + Chromatic (renders
every story, catches a visual font regression) already cover the real failure
mode. C7b's only marginal value is the rare "@font-face exists but still
doesn't paint" case (corrupt woff2, CSP block). If a paint bug ever slips past
C7a + Chromatic, build C7b then as a manual `npm run audit:font` command run
pre-release / on font changes — never in the commit gate, and nightly CI stays
blocked until the Nexus-registry-in-CI issue is solved.*

## The failure this prevents (real, from S0)

Token audit + tsc + lint were all green while **every screen silently rendered
in the system fallback font**: the tokens package declared
`"Euclid Circular B"` but no `@font-face` under that exact family name existed
until `app/fonts.css` fixed it. Static scanning of component code can never
catch this class of failure — the code was "correct"; the *rendered paint* was
wrong.

## Two tiers (cheap static + definitive rendered)

### C7a — declaration consistency (static) — ✅ BUILT 2026-07-07

Lives in `scripts/compliance-audit.mjs` (repo mode only — it grades the
project's font wiring, not a designer's build, so entry/files scores are
unaffected). As built: token layer = `--font-*` in
`node_modules/@acko/enterprise-tokens/globals.css`; @font-face sources = every
`.css` under `app/`; rules = `C7-fontface-missing` (error — token-declared
non-system family with zero @font-face under that EXACT name, with near-miss
diagnosis for case/name mismatches) + `C7-weight-gap` (warning — weights the
typography spec's table lists but no hosted face/range covers). Severities +
system-family allowlist owner-tunable in `scripts/audit-rubric.json` ("c7a").
The reverse dead-weight check and `src:` file-existence check from the original
sketch below were deferred (not in the granted scope). Dashboard: C7 radar
axis added, auto-ungreys from `checks.implemented` (`C7a` → `C7`).

Original design sketch (no meta.ts dependency; pure file analysis):

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

1. ~~Should C7a fold into the default `audit:compliance` run, and may it be
   built pre-S1?~~ **RESOLVED 2026-07-07**: build granted (STATE.md DECISION
   LOG PROVISIONAL entry); C7a now runs in every default (repo-mode)
   `audit:compliance` run.
2. **OPEN** — C7b trigger policy: nightly CI, pre-release only, or manual?
   (Trade-off: earlier catch vs. build-time cost.) C7b stays unbuilt until
   this is decided.
3. **OPEN** — Probe surface for C7b once S2 exists: app routes, Storybook
   foundations pages, or both?
4. **OPEN (new, from the C7a build)** — the known weight gap is now live
   signal: spec lists 100–900, hosted faces cover 300–700, so every repo run
   carries one `C7-weight-gap` warning for 100/200/800/900. Host the missing
   weight files, or narrow the spec's weight table? (Both sides are owner
   artifacts; the check just reports.)
