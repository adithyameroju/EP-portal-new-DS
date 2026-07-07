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

## SPEC DRIFT found by R1's compile-check — PROPOSED spec fixes (owner approves)
These are exactly what the compile-check exists for. None applied; each needs a
spec edit Nikhil signs off (S0.3 follow-through):
1. **checkbox.md uses the Radix-era indeterminate API.** `checked="indeterminate"`
   does not type-check: Base UI's CheckboxRoot has `checked?: boolean` plus a
   SEPARATE `indeterminate?: boolean` prop (verified in the installed .d.ts).
   The "Select all" example + cheat-sheet row need updating. Note: revises the
   earlier "zero Radix staleness" sweep conclusion — the sweep caught
   data-attribute/asChild patterns, not API shapes.
2. **button.md sizes table drifted from source cva:** spec says default h-9/px-4,
   sm h-8, lg h-10, icon h-9 w-9; source is default h-8/px-2.5, sm h-7, lg h-9,
   icon size-8. Spec also omits real sizes xs, icon-xs, icon-sm, icon-lg.
3. **button.md destructive/outline styling mismatch:** spec says bg-destructive +
   destructive-foreground text; source uses translucent destructive tint +
   text-destructive. Outline: spec border-input; source border-border (light) /
   border-input (dark only).
4. **card.md anatomy drift:** spec says CardTitle=h3, CardDescription=p; source
   renders both as div. Internal inconsistency: styling table "Shadow: none" vs
   cheat sheet "default shadow-sm is preferred".

## SPEC DRIFT found by R3's compile-check — PROPOSED spec fixes (owner approves)
5. **input.md teaches a Form composite that does not exist.** Three sections
   import Form/FormControl/FormField/etc. from @/components/ui/form — form.tsx
   is absent (field.md itself says the repo has no react-hook-form composite).
   Agent omitted input.md Rule-for-LLMs #5 from meta (would direct generators
   at nonexistent components); Field-system alternative captured instead.
   ⚠️ WIDER: CLAUDE.md's component rules ALSO still say "Form uses FormField/
   FormItem/FormLabel/FormControl/FormMessage" — same stale reference in the
   top-level rules file. Both need one coordinated fix.
6. **input.md default-styling table drifted from source:** spec bg-background/
   rounded-md/h-9/px-3/text-sm vs source bg-transparent/rounded-lg/h-8/
   px-2.5 py-1/text-base md:text-sm + ring-ring focus at 3px width.
7. **field.md malformed JSX:** "Field with separator" example closes the last
   Field with </FieldSeparator> (~line 224) — would not compile.
8. **drawer.md prop-name inconsistency:** "Drawer vs Sheet" table says
   side="bottom" but vaul's prop (and the spec's own Direction section) is
   `direction`. (vaul's Radix basis verified — its asChild usage is legitimate
   and captured as a documented exception in drawer.meta.ts.)

## SPEC DRIFT found by R2/R4 compile-checks — PROPOSED spec fixes (owner approves)
9. **combobox.md chips example doesn't type-check:** ComboboxChip (Base UI
   Combobox.Chip) has no `value` prop (verified in installed .d.ts); Base UI
   renders chips from selected values. Static chips example needs rework.
10. **collapsible.md Rule 4 factual claim is stale:** Base UI DOES expose
    `data-panel-open` on the trigger. The rule's remedy still works.
11. **command.md styling text:** says SearchIcon is on the right; source
    renders it left (InputGroupAddon default align inline-start).
12. **popover.md date-picker example uses deprecated `initialFocus`** (react-
    day-picker 9.x deprecates it for `autoFocus`). Compiles today; update spec.
13. **"internal — do not import" claims contradict exports:** progress spec
    says ProgressTrack/ProgressIndicator are internal, but progress.tsx exports
    both; same for NavigationMenuPositioner in navigation-menu spec rule 4.
    Decide: stop exporting, or reword the rules.
14. popover.md props table lists 4 `side` values; Base UI's Side type also has
    inline-start/inline-end (source styles those data attributes).

## Residual items awaiting owner ruling (post-fix wave)
15. **button.md "Icons in buttons" prose drift** (found during fix wave): says
    icon size-4 for default/small, size-5 for large — source: sm uses size-3.5,
    lg uses size-4, size-5 appears nowhere. Mechanical fix, one sentence;
    awaiting go since it's outside the ruled-on 14.
16. **button.md outline Background cell**: fix agent also corrected it
    transparent → bg-background (dark bg-input/30) per source cva — flag to
    owner in case he wants that single cell reverted.

## New spec-vs-implementation items from S2 story generation (owner nod, then mechanical)
17. **progress.md examples omit the required `value` prop nuance** — Base UI's
    progress root REQUIRES `value`; spec examples work but CSF typing exposed it.
    Suggest a one-line spec note.
18. **progress.md shows plain-string children on ProgressValue** — Base UI types
    Value children as a render function (`{() => "4 of 10"}`); spec's plain
    strings don't type-check. Same class as the ruled-on 14.

## From the S4 agent — flags needing decisions
- **Schema addition request: `primitiveElements?: string[]` on ComponentMeta**
  (C2 provenance check needs each primitive's DOM shape). Additive, optional
  field — owner call, then a small backfill pass over the 55.
- **C7a font declaration-consistency check could be built pre-S1** (no meta
  dependency) — outside approved scope, needs explicit go. C7b (Playwright
  paint probe) trigger policy: nightly CI vs manual — open decision.
- compass-audit skill folder will live in .claude/skills/ — needs orchestrator
  coordination with S5's folder when built (no conflict expected; just timing).
- Demo ledger entry (marked "demo": true) kept as format example — delete if
  unwanted.

## From the S5 agent (affects S1 consumers)
- Part B rubric = PROPOSED at .compass-build/design/s5/resolution-design.PROPOSED.md
  with 3 open questions for Nikhil (thresholds; provisional-mapping prewrite;
  spacing-snap handling).
- One embedded UX opinion flagged: report view disables "Approve batch" while
  needs-decision items are pending (inference from hard rules; removable).
