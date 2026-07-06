# PROPOSED — Checks C2 / C3 / C4 (build after S1 meta.ts lands)

*S4 track design doc. Status: PROPOSED — not implemented. Gate: STATE.md must
show S1 exit criteria met (55 meta.ts files, index compiles, spot-check passed).
Implementation target: extend `scripts/compliance-audit.mjs` (same finding shape
`{ruleId, level, file, line, message, component, suggestion}`; scoring flows
through `scripts/audit-rubric.json` unchanged).*

## Shared plumbing (build once)

A meta loader: import `components/ui/_meta-index.ts` output (or read the
compiled JSON if the audit stays dependency-free — decide at build time: either
`tsx` execution or a small `meta-export.mjs` codegen step that dumps
`_meta-index` to `drift-log/meta-cache.json` on demand). The audit consumes,
per component: `name`, `category`, `childComponents`, `specPath`, plus (if S1
approves the field request below) `primitiveElements`.

**Request to S1 schema (needs S1 owner-approval, flagged, not invented here):**
add `primitiveElements?: string[]` to `ComponentMeta` — the raw HTML elements a
primitive replaces (button → `["button"]`, input → `["input"]`, select →
`["select"]`, table → `["table"]`). C2's precise tier depends on it.

## C2 — provenance (error): re-implemented primitives

Catches JSX hand-rolled as raw elements where a Compass primitive exists
(CLAUDE.md already states the rule; C2 makes it detectable).

Two tiers, to keep false positives near zero:

1. **Exact-element tier (error):** a raw `<button>`, `<input>`, `<select>`,
   `<table>`, `<textarea>` rendered in a scanned build file when meta says a
   primitive covers that element (`primitiveElements`) and the file does NOT
   import that primitive. Escape hatches: elements inside `components/ui/`
   (excluded anyway) and a `// compass-allow: raw-<element>` comment for the
   rare legitimate case (each use is visible in review).
2. **Shape-match tier (warning):** a `div`/`span` subtree whose className set
   overlaps a primitive's characteristic token classes (e.g. div with
   `rounded-xl border bg-card text-card-foreground` = Card's signature). The
   signature list per primitive is *derived from the primitive's own source*
   (top-level cva/className of `components/ui/<name>.tsx`) at audit runtime —
   never hand-maintained. Warning-level because heuristic.

## C3 — composite completeness (error/warn): sub-parts used correctly

- Input: `childComponents` from meta (e.g. card → CardHeader/CardContent/
  CardFooter; dialog → DialogHeader/DialogTitle/DialogContent).
- Check per scanned file: composite root is rendered (`<Card`) with JSX
  children, but none of its sub-parts appear anywhere in the file.
  - **Error** when meta marks structural sub-parts required (dialog without
    DialogTitle is also an a11y failure).
  - **Warning** when sub-parts are conventional but optional (card with only
    CardContent is fine; card with raw `<div className="p-6">` padding hack is
    what we're catching).
- Mechanics: regex-level JSX tag inventory (same approach as C6's import scan);
  no AST dependency needed for tier 1. Revisit with an AST only if false
  positives show up in real ledger data.

## C4 — spec coverage (warn): unspecced component used

- Input: `specPath` from meta.
- Check: any `@/components/ui/<name>` import in scanned files where meta has no
  `specPath` (or the file does not exist on disk) → **warning**
  `C4-unspecced: <name> used without a spec — backfill candidate`.
- This is the demand-driven signal S6.3 consumes: Detect aggregates C4 warnings
  to rank which of the 22 unspecced components earns a spec next. It never
  blocks a build (warn only).

## Scoring integration

New ruleIds: `C2-raw-element` (error), `C2-shape-match` (warning),
`C3-missing-subparts` (error or warning per meta), `C4-unspecced` (warning).
No rubric change needed — weights stay error −5 / warn −1 unless Nikhil retunes.
Dashboard radar axes C2/C3/C4 automatically un-grey once their ruleIds appear
in reports (dashboard already keys on ruleId prefixes).
