# Standing-queue proposals — for owner one-pass ruling (2026-07-07)

Five items. For each: what it is · options · recommendation + why (traced to
code/spec/Figma) · whether it MATCHES REALITY or is a NEW CALL. Nothing applied
yet — awaiting your confirm/override in one pass, then applied + logged.

| # | Item | Recommendation | Matches reality or new call? |
|---|------|----------------|------------------------------|
| 1 | primitiveElements meta field | Add optional field; backfill ~12 raw-element atoms only | Values = reality; adding field = your architecture call (not a design opinion) |
| 2 | C3 severity | Keep uniform WARNING | Matches reality (advisory audit; mixed required-ness) |
| 3 | C7b trigger policy | On-demand only, not gated; defer building | Matches reality (C7a + Chromatic already cover it) |
| 4 | Euclid weights | Narrow spec to 300–700 (YOUR RULING) | Matches reality exactly |
| 5 | Table gaps #19–22 | Log #19–21 to S6 gap-list; close #22 | Matches reality (demand-driven per roadmap) |

---

## 1 — `primitiveElements` meta field + backfill

**What it is.** An optional `primitiveElements?: string[]` on `ComponentMeta` —
the raw HTML element(s) a primitive renders (button→`["button"]`,
input→`["input"]`). The C2 audit check (flags a hand-rolled `<button>`/`<div>`
that re-implements a primitive) currently **derives** this at runtime from
source (`scripts/compliance-audit.mjs:714`, `derived:components/ui/<x>.tsx`),
with a TODO (`:694`) to read an explicit field "if/when Nikhil approves adding
it." The schema has `primitiveSource` but no `primitiveElements`
(`_meta-schema.ts:96`).

**Options.**
- (a) Add the optional field; backfill **only** the ~12 atoms that wrap a
  governable raw element (button, input, textarea, label, native-select,
  checkbox, switch, slider, progress, separator, toggle, kbd). Composites left
  undefined.
- (b) Add + backfill all 55 (most render `div`s → no C2 value, just noise).
- (c) Don't add it — keep C2's runtime derivation (works today).

**Recommendation: (a).** C2 works now, but an explicit field turns a runtime
heuristic into a reviewable contract, and the **values are facts read straight
from each component's rendered root** — not opinions. Backfilling composites
(b) adds noise with zero C2 benefit, so scope it to the element-wrapping atoms.

**Reality vs new call:** the values are reality (facts from source). The
decision to add the field + the scope is your architecture call — but it is
**NOT a new design opinion**; it just makes an existing heuristic explicit.

---

## 2 — C3 severity (composite completeness: error vs warn)

**What it is.** C3 flags a composite used with children but **none** of its
sub-parts (a `Card` with no `CardHeader`/`CardContent`). It is a uniform
**WARNING** today; the code notes "promotion to error = pending owner ruling"
(`compliance-audit.mjs:31`) because meta has no per-child "required" flag.

**Options.**
- (a) Keep uniform **WARNING**.
- (b) Uniform **ERROR**.
- (c) Add a "required" marker to `childComponents` in meta — factual, since the
  specs' anatomy tables already carry a **"Required?"** column (e.g. `card.md`
  CardTitle "When card has a title"; `dialog.md` DialogTitle required) → C3 =
  ERROR for missing **required** sub-parts, WARNING for optional.

**Recommendation: (a) keep WARNING.** Traced to reality: (1) the compliance
audit is **advisory** — you just ruled (#10) the token audit is the only gate,
so an "error" tier implies a hard line the audit doesn't enforce; (2)
required-ness genuinely **varies** (CardFooter optional, DialogTitle
required-for-a11y) — a uniform ERROR (b) would false-positive on optional
parts; (3) the precise answer (c) needs a meta backfill from the "Required?"
columns, worth it only if you later want required-ness actually enforced.

**Reality vs new call:** keeping WARNING matches reality. Promoting to ERROR is
a NEW stricter stance **and** needs the (c) backfill first to avoid false
errors — I would not do one without the other.

---

## 3 — C7b trigger policy (paint-level font check)

**What it is.** C7b = the designed-but-unbuilt Playwright rendered-DOM probe
that verifies computed `font-family` actually **paints** as Euclid (the S0
silent-fallback class of bug). **C7a** (static declaration-consistency) is
BUILT and runs in `npm run audit:compliance`. C7b needs a browser, so it can't
sit in the plain commit gate.

**Options for when it runs.**
- (a) On-demand manual command (`npm run audit:font`), run before releases / on
  font changes; **not** in the commit gate or default CI.
- (b) Nightly CI job.
- (c) Fold into the Chromatic/Storybook build.
- (d) Don't build C7b at all — C7a + Chromatic already cover it.

**Recommendation: (a), leaning (d)/defer** — on-demand only, not gated, and
build it only when a concrete paint bug slips past what already exists. Traced
to reality: **C7a already catches the exact S0 failure** (declared family, no
`@font-face`) at commit time, statically; and **Chromatic already renders every
story** and would visually surface a font regression. C7b's marginal value is
the narrow case where `@font-face` exists but still doesn't paint (corrupt
woff2, CSP block) — real but rare. A browser probe in the commit gate slows
every commit; nightly CI is blocked anyway until the Nexus-registry-in-CI issue
is solved.

**Reality vs new call:** matches reality (existing coverage + CI caveat).
Building/gating it now would be speculative — no trigger has occurred.

---

## 4 — Euclid weight cuts (YOUR RULING — narrow to 300–700)

**What it is.** `typography.md` lists 9 weight tokens 100–900; we host, and the
Euclid Circular B retail family ships, **300–700** (light→bold) + italics. C7a
warns that 100/200/800/900 have no `@font-face`. **C7a reads its expected
weights directly from this spec table** (`compliance-audit.mjs:487`), so
narrowing the spec clears the warning with **zero code change**.

**Your ruling:** narrow to 300–700; do not hunt for cuts we don't have.

**Exact scope I'll apply on your confirm:**
- `typography.md` — remove the 4 rows thin(100)/extralight(200)/extrabold(800)/
  black(900); keep light/normal/medium/semibold/bold (rows 55–59).
- `stories/foundations/typography-blocks.tsx` — narrow the rendered weight
  specimen to 300–700 and drop its now-moot "out-of-range weights render
  synthesized" note (mechanical consequence, flagged).
- Re-run `audit:compliance` → the C7a weight-gap warning clears automatically
  (that's the proof).

**Reality vs new call:** matches reality exactly (spec = what ships/hosts).

---

## 5 — Table gaps #19–22

**What they are** (found dogfooding Table for the foundations reference
matrices; recorded in `spot-check-notes.md`):
- **#19** No wrapping/prose-cell variant — `TableHead`/`TableCell` hardcode
  `whitespace-nowrap`, so long prose columns scroll instead of wrap.
- **#20** No non-interactive variant — `TableRow` bakes in `hover:bg-muted/50`,
  implying row interactivity on read-only tables.
- **#21** `className` routes to the inner `<table>`, not Table's overflow
  wrapper — external isolation needs an extra wrapping `<div>`.
- **#22** Header color — Table default `text-foreground` vs the matrices' prior
  `text-muted-foreground` (cosmetic).

**Options.**
- (a) Log #19–21 as **S6 gap-list** items (candidate Table enhancements — a
  wrap/prose variant, a static/non-interactive variant, wrapper-`className`
  support) to build on real product demand; **close #22** as a non-issue.
- (b) Fix #19–21 now in `table.tsx` (protected primitive; additive variant
  features).
- (c) Dismiss all.

**Recommendation: (a).** Traced to reality: these are additive **primitive**
features surfaced by ONE low-frequency internal use (docs matrices) — no product
needs them yet, which is exactly the roadmap's **demand-driven S6** material; and
editing the protected `table.tsx` speculatively isn't warranted while the audit
is advisory. **#22 is genuinely a non-issue** — Table's default header color is
correct for real data tables. I'd record #19–21 in a new
`.compass-build/design/s6/gap-list.md` (the S6 backlog) so they aren't lost.

**Reality vs new call:** matches reality (demand-driven per roadmap). Building
the variants now would be NEW speculative primitive features with no demand.
