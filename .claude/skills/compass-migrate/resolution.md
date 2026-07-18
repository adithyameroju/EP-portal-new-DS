# Compass Resolution (Part B) — ACTIVE

> **Status: ACTIVE as of S1 exit (2026-07-07, tag `s1-complete`).** Resolves
> foreign components and tokens against the live meta registry:
> `components/ui/_meta-index.ts` (`componentMetaIndex`, 55 entries; schema in
> `components/ui/_meta-schema.ts`). All numeric knobs come from
> [`resolution-config.json`](resolution-config.json) — owner-tunable defaults,
> never hardcode them into a run.
>
> Owner rulings encoded here (STATE.md decision log, 2026-07-07):
> thresholds/snap policy are tunable config; provisional mappings MAY be
> pre-written as `-compass` variants; EVERY snap is logged; low-confidence and
> unclustered items go to `_needs-decision.md`; **no consumer repointing and no
> deletion of originals until the owner confirms — stop at that boundary.**

---

## Inputs

1. `componentMetaIndex` from `components/ui/_meta-index.ts` — the ONLY source
   of candidate targets. If it isn't in the index, it isn't a candidate.
2. [`resolution-config.json`](resolution-config.json) — weights, caps,
   thresholds, snap policy. Read it at run start; cite the values used in
   `_baseline.md`.
3. The golden-pair identification from preflight
   ([`golden-pairs.md`](golden-pairs.md)).

## B1 — Inventory: role detection and matching

### Step 1 — Detect the foreign component's role

Collect evidence per signal (weights from config, strongest first):

| Signal | Weight key | What to look at |
|---|---|---|
| Import source / golden pair | `importSource` | If the component comes from an identified library, its identity is known exactly (MUI `Dialog` -> modal dialog). Near-deterministic. |
| ARIA / semantics | `ariaSemantics` | `role=`, `aria-*`, rendered element (`<button>`, `<table>`), focus trap, portal usage. |
| Props signature | `propsSignature` | `open`/`onOpenChange` -> overlay; `value`/`onValueChange` + item children -> selection control; `columns`/`data` -> table; `checked` -> toggle control. |
| Name heuristics | `nameHeuristics` | Name tokens ("Modal", "Picker", "StatCard"). Weakest trusted signal — names lie. |
| Usage context | `usageContext` | Where it renders (form, nav, portal), children shape. Tiebreaker only. |

### Step 2 — Score candidates from the meta index

1. **Candidate set:** all `componentMetaIndex` entries whose `category`
   (atom/molecule/organism/template/pattern) fits the role's altitude. Never
   invent a name; never match to anything outside the index.
2. **Score each candidate** — confidence starts as the weighted fraction of
   signals whose evidence agrees with the candidate. **Renormalize weights
   over the signals that can bear evidence at all** (a bespoke component has
   no import identity — importSource is excluded and the remaining weights
   scale up proportionally; found in dry-run 2026-07-07, flagged to owner).
   Absence of expected evidence is NOT excluded — an interactive control with
   no ARIA at all is disagreeing evidence, not a missing signal. Then adjust:
   - `purpose` + `useCases`: does the detected role fit what this component is
     FOR? Disqualify on explicit purpose conflicts (e.g. tabs meta: "must
     never cause page navigation" — a URL-changing foreign tab bar fails tabs
     and points to navigation-menu).
   - `aiHints.selectionCriteria`: spec-backed confirm/deny per criterion
     ("Use X for...", "Use Y instead for..." — an "instead" hit redirects
     scoring to Y).
   - `aiHints.confusedWith`: MANDATORY check. For every documented confusion
     on the top candidate, the evidence must resolve the disambiguation (e.g.
     dialog vs alert-dialog turns on backdrop-click dismissal / forced
     choice). Unresolvable with the evidence at hand -> cap at
     `caps.unresolvedConfusedWith`.
   - `variants`: can the foreign API surface (its variant/size props) be
     expressed? Each foreign feature with no variant equivalent ->
     `penalties.perMissingVariantEquivalent` (floor 0); genuinely core missing
     features usually mean wrong candidate or gap.
   - `childComponents`: composite anatomy compatibility (foreign header/body/
     footer maps to the Compass sub-part set).
   - **Lightweight-meta cap:** if the top candidate's `aiHints.source` is
     `"types-only"` (the 21 types-only-meta components), there is no spec-backed
     confirmation possible -> cap at `caps.lightweightMeta` (provisional at
     best, never auto-map). Record "lightweight meta" in the evidence.
   - Conflicting signals (e.g. name says card, ARIA says button) ->
     `penalties.conflictingSignals`.
3. **Every score ships with its evidence list.** A number without evidence is
   invalid — the owner must be able to audit any mapping from the record alone.

### Step 3 — Route by threshold (values from config)

| Confidence | Route |
|---|---|
| >= `thresholds.map` | **Map.** Listed in the unit report with score + evidence. |
| >= `thresholds.provisional`, < map | **Provisional.** MAY be pre-written as a `-compass` variant (owner ruling 2026-07-07) — but it never replaces the original, and batch approval BLOCKS until the owner confirms each provisional in `_needs-decision.md`. |
| < `thresholds.provisional` | **Flagged.** `_needs-decision.md` with ranked candidates + evidence; unit is FLAGGED, not migrated; nothing written. |
| No candidate >= `thresholds.gapList` | **Gap list.** `_gap-list.md` entry (S6 candidate). Never invent, never force a lookalike. |

### Step 4 — Record the inventory

Append one record per foreign component to `.migration/_inventory.json`:

```json
{
  "source": "src/components/StatCard.tsx",
  "role": "content card",
  "compassTarget": "card",
  "confidence": 0.87,
  "route": "map | provisional | needs-decision | gap",
  "candidates": [{ "name": "card", "score": 0.87 }, { "name": "item", "score": 0.55 }],
  "evidence": ["props: title/children surface", "anatomy fits card-header/content", "confusedWith(item): resolved — not a list row"],
  "configUsed": { "map": 0.85, "provisional": 0.6, "gapList": 0.3 }
}
```

## B2 — Token remap

1. **Harvest:** CSS custom properties (`:root`/`.dark`), `tailwind.config`
   `theme.extend`, raw palette utilities (`bg-blue-600`), arbitrary values
   (`p-[13px]`, hex), inline styles.
2. **Cluster by usage context, not by value:** for each value, census where it
   is used (interactive-primary bg, page bg, body text, muted text, border,
   destructive, radius, spacing steps). A cluster = one usage bucket with a
   dominant value.
3. **Map cluster -> Compass semantic token** (`primary`, `background`,
   `foreground`, `muted-foreground`, `border`, `destructive`, radius/spacing
   scale). Cross-check against the target Compass component's own `tokens`
   list in meta (e.g. card surfaces use `bg-card`, never `bg-background` —
   that distinction is IN the meta/spec).
4. **Snapping (`tokenRemap.snapPolicy`):** near-scale values may snap to the
   nearest step ONLY within the same tier. **LOG EVERY SNAP — token or
   spacing, never silently** (owner ruling): each snap goes in the unit
   report's `Changed` section AND `.migration/_snap-log.md`
   (template in [`report-templates.md`](report-templates.md)).
5. **Unclustered = `_needs-decision.md`** (config `tokenRemap.unclusteredRoute`).
   A value serving conflicting buckets is never guessed.
6. **Acceptance test:** Compass token audit over migrated files = **0 errors**
   (`scripts/token-audit.mjs`; the S4 compliance audit once shipped).

## B3 — Component swap

1. Order within a unit: tokens first (readable diffs), then primitives
   leaf-up (atoms before the composites containing them).
2. Follow the target's meta `aiHints.compositionRules` and `childComponents`
   verbatim (sub-part order, built-in padding, anti-patterns are documented
   per component — check `antiPatterns` before writing).
3. Golden-pair survivors (team customizations) re-express as: Compass variant
   prop where one exists -> semantic token utility classes where legal ->
   otherwise `_needs-decision.md`. Never a hardcoded value; never a
   modification to `components/ui/` primitives.
4. Behavior deltas: consult the target's `primitiveSource` (base-ui, vaul,
   cmdk, embla...) plus the systemic Radix->Base list in
   [`golden-pairs.md`](golden-pairs.md); write every delta into the unit
   report's `Behavior changes`. Never patch for parity.
5. **STOP BOUNDARY (owner ruling, non-negotiable):** writing `-compass`
   variants and reports is as far as an unattended run goes. **Do NOT repoint
   any consumer and do NOT delete/rename any original until the owner has
   confirmed the batch.** After confirmation: repoint one consumer at a time
   with a typecheck each, then delete + rename with ask-first (SKILL.md
   Step 2).
