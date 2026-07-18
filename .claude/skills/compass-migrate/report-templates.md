# `.migration/` Report Templates

> Used by `compass-migrate` (see [SKILL.md](SKILL.md)). The `.migration/`
> directory is created **inside the target repo** at migration time — never in
> the Compass repo itself. Copy these templates verbatim; the fixed structure is
> what makes reports comparable across units and migrations.
>
> **Honesty rules apply to every file here:** skipped != migrated; flagged is
> listed as flagged; pre-existing failures are named as pre-existing. Status is
> always derived from disk (import scans), never hand-maintained.

---

## `_baseline.md` — written once, in preflight, before any change

```markdown
# Migration baseline — <target repo name>

- Date: <YYYY-MM-DD>
- Migration branch: compass-migration
- Package manager: <npm|pnpm|yarn|bun> (from <lockfile>)
- Stack: <e.g. Next 15 App Router + Tailwind v4 / Vite + React 18 + Tailwind v3>
- Source library identification: <stock shadcn/ui | MUI | Chakra | Ant |
  Lovable output (shadcn-based) | Replit output | bespoke/unknown>
  Evidence: <deps + import patterns that identify it>

## Pre-existing state (NEVER attribute these to the migration)

| Check | Command | Result |
|---|---|---|
| Typecheck | <e.g. npx tsc --noEmit> | <pass / N errors — list> |
| Build | <e.g. npm run build> | <pass / fails — how> |
| Lint | <e.g. npm run lint> | <N errors / N warnings> |

## Inventory summary

- Routes/flows found: <list>
- Foreign components found: <count> (<count> mapped, <count> low-confidence,
  <count> gap-list) — details per batch plan
```

---

## `<unit>.md` — one per migrated flow/component (e.g. `settings-flow.md`)

The four sections are mandatory, in this order, even when empty (write "None").

```markdown
# Migration report — <unit name>

- Batch: <batch name/number>
- Status: MIGRATED | FLAGGED | SKIPPED   <- never mark migrated unless fully repointed + green
- Confidence: <lowest mapping confidence used in this unit>

## Changed

<Exactly what was rewritten: files, foreign component -> Compass component,
token remaps applied, customizations re-expressed. One line each.>

## Left alone

<What was deliberately not touched and why: logic, hooks, data fetching,
routing, state, copy; plus any presentation left as-is with reason.>

## Behavior changes

<Every known behavioral delta between the foreign component and its Compass
replacement (activation, close-on-click, focus return, keyboard model,
controlled/uncontrolled). These go to QA. NEVER patched to force parity.>

## Verify by hand

<Concrete human checks: "open Settings -> Billing, confirm the dialog closes on
overlay click", etc. Anything a typecheck cannot prove.>
```

---

## `_gap-list.md` — "Compass lacks this" (feeds S6 extensibility)

```markdown
# Gap list — components/patterns with no Compass equivalent

<!-- Append-only. Each entry is an S6 candidate, not a failure. -->

## <foreign component name>

- Source: <file path in target repo>
- Role: <what it does, in one line>
- Nearest Compass components considered: <list + why each was rejected>
- Occurrences in target: <count / where>
- Suggested S6 disposition: <new atom | new molecule | new pattern | compose-from-existing>
```

---

## `_needs-decision.md` — owner review queue (low confidence / unclustered)

```markdown
# Needs decision — for Nikhil

<!-- Nothing in this file has been acted on. Each item blocks its unit. -->

## <item id> — <component mapping | token>

- Source: <file / value>
- Candidates: <ranked list with confidence scores>
- Why unresolved: <ambiguity in one line>
- Impact if wrong: <what breaks / drifts>
- Decision: [ ] pending -> <owner writes the call here>
```

---

## `_snap-log.md` — every snapped value, token or spacing (owner ruling 2026-07-07: never snap silently)

```markdown
# Snap log — <target repo name>

<!-- One line per snap, append-only. Same-tier snaps only (resolution-config
     tokenRemap.snapPolicy); anything beyond same-tier is a needs-decision
     item, not a snap. Every entry here ALSO appears in its unit report's
     `Changed` section. -->

| Unit | File | Original value | Snapped to | Tier | Why same-tier |
|---|---|---|---|---|---|
| settings-flow | billing-form.tsx | 15px gap | gap-4 (16px) | spacing | adjacent scale step, same tier |
```

---

## `_summary.md` — written at completion, counts derived from disk

```markdown
# Migration summary — <target repo name>

- Units migrated: <n> · flagged: <n> · skipped: <n>   <- from import scan, not memory
- Remaining foreign imports: <n> (<list or "none">)
- Gap list entries: <n> (see _gap-list.md)
- Open decisions: <n> (see _needs-decision.md)
- Baseline deltas: <"none — pre-existing failures unchanged" or list>
- Compass token audit over migrated files: <0 errors required>
```

## `_inventory.json` — machine-readable inventory (written in B1, one record per foreign component)

Written during the inventory pass (see resolution.md B1 Step 4), before any
per-unit report. One JSON record is appended per foreign component; `route` and
`configUsed` come from the thresholds in `resolution-config.json`:

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
