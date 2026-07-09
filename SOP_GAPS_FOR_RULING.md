# SOP gaps for owner ruling

This document surfaces the 13 open questions ("gaps") flagged in the interactive
"Working with Compass" SOP (the five pages in `stories/working-with-compass/`), so
you can rule on them in one pass. Each gap comes straight from the SOP's own
`⚠ NEEDS OWNER DECISION` blocks and flagged decision-tree leaves, catalogued in
`.compass-build/design/s2/sop-interactive-structure.PROPOSED.md:54-75`. For every
gap I re-checked whether any existing source (the component and foundation specs
in `.claude/specs/`, `.claude/principles.md`, `.claude/contributing.md`,
`.claude/designers.md`, `CLAUDE.md`, `Compass_GA_Roadmap.md`, and the
`components/ui/*.meta.ts` contracts) actually answers it. Where a source answers
it, I quote the answer with a `file:line` citation. Where it needs a fresh
decision, I give realistic options and a recommendation **only** when the
recommendation traces to real code, Figma, or an existing pattern — otherwise it
is marked `⚠ NEW OPINION` and left for you. Nothing here invents a Compass
answer. Every citation was opened and verified.

## Summary

| Gap # | Title | Status |
|-------|-------|--------|
| 1 | Card vs Item distinction | needs-owner-decision |
| 2 | Promotion threshold (when a pattern earns promotion) | needs-owner-decision |
| 3 | Chart conventions beyond tokens/ChartContainer | needs-owner-decision |
| 4 | Card default shadow / border | **RESOLVED 2026-07-07** |
| 5 | Default density | needs-owner-decision |
| 6 | Which spacing list designers design to | needs-owner-decision |
| 7 | Where generated files live | needs-owner-decision |
| 8 | Who commits / PRs designer builds | needs-owner-decision |
| 9 | Truth surface for component status | needs-owner-decision |
| 10 | Acceptable compliance-score threshold | needs-owner-decision |
| 11 | Button vs link-variant vs icon-button general rule | needs-owner-decision |
| 12 | Feedback success-confirmation path (sonner) | needs-owner-decision |
| 13 | Chart-state flow (loading / error / empty) | needs-owner-decision |

**Counts:** resolved = 1 · answered-by-spec = 0 · needs-owner-decision = 12

---

## Gap #1 — Card vs Item distinction

- **Where in the SOP:** *Choosing a Component* (`stories/working-with-compass/choosing-components.mdx:272-284`) — the "Card vs Item" section, rendered as a flagged `GapCard`.
- **The unanswered question:** When should a designer reach for `Item` (the list-row molecule) instead of a `Card`, or instead of a `Table` row?
- **Does an existing source answer it?** **No source decides this.** `Item` has no spec and its meta carries no selection guidance: `components/ui/item.meta.ts:8-9` shows `useCases: []` and `antiPatterns: []`; `item.meta.ts:44-50` shows `selectionCriteria: []`, `confusedWith: []`, `source: "types-only"`, `specStatus: "none"`. The two purposes *are* stated in code — Item is a "Flexible list-row primitive ... with media, content, title, description, actions ... groupable via ItemGroup" (`item.meta.ts:6-7`), while Card is the bordered container with header/content/footer sub-components (`.claude/specs/components/card.md:45-53`) — but no source draws the boundary between them, and neither addresses Item-vs-Table-row.
- **If it needs a new decision — options + recommendation:**
  - (a) Write a short selection rule and put it in `item.meta.ts` / a new `item.md`.
  - (b) Add an Item-vs-Card-vs-Table row to an existing decision flow.
  - (c) Leave Item unspecced (demand-driven backfill per `Compass_GA_Roadmap.md:283-284`).
  - **Recommendation (partial, traced):** The Card-vs-Item split *does* trace to the two code purposes above — use `Card` for a self-contained bordered content block, use `Item` for a dense, repeating list row with media/title/actions slots. That much can be written without new opinion. **But the Item-vs-Table-row boundary is `⚠ NEW OPINION — no source; owner must decide`** (when is a row a `TableRow` vs an `Item`?). Options (a) or (b) if you want it decided; (c) if you'd rather wait for real usage.

---

## Gap #2 — Promotion threshold (when a pattern earns promotion)

- **Where in the SOP:** *Choosing a Component* (`stories/working-with-compass/choosing-components.mdx:326-345`) — the "When a pattern earns promotion" collapsible plus its trailing `GapCard`.
- **The unanswered question:** What is the concrete trigger — how many uses, across how many features — before a feature-local composition is brought to review for promotion into `components/ui/`?
- **Does an existing source answer it?** **Partial.** The roadmap defines the *pipeline* but not the *trigger*. `Compass_GA_Roadmap.md:271-281` (S6.1–S6.2) describes the guided scaffold flow (component + spec + meta + story + Code Connect + audit) with "owner approval + a version bump," and `Compass_GA_Roadmap.md:283-284` (S6.3) says coverage is done "**when the audit/drift signal says so**, not front-loaded." So the roadmap points at the drift signal as the trigger, but no source states a countable threshold a designer can check against.
- **If it needs a new decision — options + recommendation:**
  - (a) Tie promotion to the existing drift-hotspot mechanism — a pattern earns review when Detect flags it as a hotspot (`.claude/skills/compass-audit/SKILL.md:75-79`, `rubric.detect.hotspotMinBuilds`).
  - (b) Set a fixed count (e.g. "used in ≥3 features").
  - (c) Owner-judgment each time, no rule.
  - **Recommendation (traced, for the mechanism only):** Option (a) traces cleanly — the roadmap already says promotion is driven by "the audit/drift signal" (`Compass_GA_Roadmap.md:283-284`), and that signal already exists as the hotspot detector. Reusing it avoids inventing a number. **Picking a specific numeric count (option b) is `⚠ NEW OPINION — no source; owner must decide`.**

---

## Gap #3 — Chart conventions beyond tokens / ChartContainer

- **Where in the SOP:** *Common Tasks* → Charts accordion (`stories/working-with-compass/common-tasks.mdx:138-181`) — the flagged `GapCard` at lines 174-181.
- **The unanswered question:** Beyond the ordered chart color tokens and the ChartContainer requirement, which chart types are preferred, how are axes/legends/tooltips configured by default, and when is a table better than a chart?
- **Does an existing source answer it?** **No source decides this.** Chart has no spec — `components/ui/chart.meta.ts:46` shows `specStatus: "none"`, and its only rule is the composition constraint at `chart.meta.ts:41-42` (pieces must live inside `ChartContainer`). The ordered-color rule exists (`.claude/specs/foundations/color.md` "Chart colors", quoted in the SOP), but conventions are *deliberately* blank: `.claude/principles.md:81` lists "**Data visualization conventions** — which chart types, how much annotation?" among the sections "intentionally blank ... filled in as the first Acko enterprise products are ... built."
- **If it needs a new decision — options + recommendation:** `⚠ NEW OPINION — no source; owner must decide.` Principles explicitly reserves this until real product work forms the opinion, so I will not pick one. Options: (a) leave blank until a product uses charts, then fill `principles.md` (the roadmap's stated method); (b) author a minimal chart spec now covering only defaults you're already confident in; (c) keep the flagged leaf as-is.

---

## Gap #4 — Card default shadow / border — **RESOLVED 2026-07-07**

- **Where in the SOP:** *Common Tasks* → Layout density accordion (`stories/working-with-compass/common-tasks.mdx:234-245`) — currently the "open fork" `⚠ NEEDS OWNER DECISION` block.
- **The unanswered question (now answered):** Do cards carry a default shadow and a real border?
- **Does an existing source answer it?** **Yes — the owner ruled it on 2026-07-07.** **Ruling: Card default = `rounded-xl` (12px), 1px border, `shadow-xs`, white background — matching the Figma library.** This resolves the three-way fork that was logged as unresolved in the build state: `.compass-build/STATE.md:28` records the definitive Figma evidence (library Card node 21123:292666 renders "**shadow/xs** (0px 1px 2px 0px rgba(0,0,0,0.05)) **and a real 1px solid border** (base/border #e5e5e5)"), and `.compass-build/STATE.md:29` records the fork against code (`card.tsx` renders no shadow + `ring-1 ring-foreground/10`) and `elevation.md`. The ruling selects **option (b) — Figma wins**. Note the downstream edits this implies (not part of this read-only doc, listed for the owner): `card.tsx` shadow/border, `.claude/specs/components/card.md:69` (Shadow "none" → shadow-xs) and `:75-81` callouts, the `card.md:249` cheat-sheet line, `.claude/specs/foundations/elevation.md:82` (rule 3), and the SOP block at `common-tasks.mdx:234-245`. The ruling is not yet transcribed into the STATE.md DECISION LOG (per your memory note, macOS access was revoked at the time).
- **If it needs a new decision — options + recommendation:** Not needed — resolved. No options.

---

## Gap #5 — Default density

- **Where in the SOP:** *Common Tasks* → Layout density accordion (`stories/working-with-compass/common-tasks.mdx:250-255`) — the second `⚠ NEEDS OWNER DECISION` block.
- **The unanswered question:** Is the Compass default "compact" or "spacious" — for tables and for forms — beyond the per-context spacing patterns?
- **Does an existing source answer it?** **No source decides this.** `.claude/principles.md:79` lists "**Information density preferences** — compact tables vs. spacious cards?" and `.claude/principles.md:82` lists "**Form density** — one field per row vs. multi-column forms?" among the intentionally-blank sections (`principles.md:76-77`). The per-context spacing patterns exist (`.claude/specs/foundations/spacing.md:104-116`) but they don't set a global density stance.
- **If it needs a new decision — options + recommendation:** `⚠ NEW OPINION — no source; owner must decide.` Principles reserves this for real product work. Options: (a) declare a default (e.g. "compact tables, one-field-per-row forms") and add it to `principles.md`; (b) leave blank until product work decides; (c) decide per-product, no system default.

---

## Gap #6 — Which spacing list designers design to

- **Where in the SOP:** *The Figma → Code Loop* → Step 1 (`stories/working-with-compass/figma-to-code-loop.mdx:86-96`) — the `⚠ NEEDS OWNER DECISION` block.
- **The unanswered question:** Do designers design to the Designer Guide's 11-value "8-point grid" or to the full Tailwind scale in the spacing foundation spec?
- **Does an existing source answer it?** **Partial / conflicting.** Two sources give two different lists. `.claude/designers.md:77-78` says "Compass uses an 8-point spacing grid. The named values are: `4px, 8px, 12px, 16px, 24px, 32px, 40px, 48px, 64px, 80px, 96px`" (11 values). The foundation spec publishes the full Tailwind scale including 6px, 10px, 14px, 20px, 28px, etc. (`.claude/specs/foundations/spacing.md:14-50`) on a 4px grid (`spacing.md:127`), and asserts itself as the source of allowed values ("If a spacing value isn't listed here, it doesn't exist in the system," `spacing.md:5`). A designer following the 11-value list will get "rounded" against the fuller scale. No source states which one governs the designer's workflow.
- **If it needs a new decision — options + recommendation:**
  - (a) `spacing.md` full scale is authoritative; `designers.md`'s 11 values are relabeled "the everyday subset."
  - (b) `designers.md`'s 11-value grid becomes the intentional design constraint and `spacing.md` is the code superset.
  - (c) Reconcile the two lists to be identical.
  - **Recommendation (traced):** Option (a). It traces to `.claude/principles.md:53-56` ("the code's token system is the source of allowed values") and to `spacing.md:5` declaring itself the system's spacing source of truth. This is a doc-alignment decision, not a new design opinion — but confirm the direction, since it changes what `designers.md` tells designers.

---

## Gap #7 — Where generated files live

- **Where in the SOP:** *The Figma → Code Loop* → "Open questions in this loop" (`stories/working-with-compass/figma-to-code-loop.mdx:240-245`).
- **The unanswered question:** Which folder does a new designer-generated screen belong in — `components/blocks/`, an `app/` route, or somewhere else?
- **Does an existing source answer it?** **Partial.** The generate-code skill defines the output's *content* but never names a destination folder (verified: no folder/destination line in `.claude/skills/generate-code.md`; it references scanning `components/ui/` at line 33 only). `CLAUDE.md:141` describes `components/blocks/` as "Acko-specific compositions (Phase 3+)," and `.claude/contributing.md:82-84` says "`components/blocks/` is where Acko-specific screen compositions live — things like login forms, dashboard cards, etc. ... assembled from `components/ui/` primitives and ... less strictly gated." So a destination is *described* but never *assigned* to designer builds.
- **If it needs a new decision — options + recommendation:**
  - (a) `components/blocks/` for reusable compositions.
  - (b) an `app/` route for full screens.
  - (c) both, by build type.
  - **Recommendation (traced):** `components/blocks/` for compositions — it traces directly to `.claude/contributing.md:82-84` (that folder already exists for exactly "login forms, dashboard cards ... less strictly gated"). Confirm whether full-screen builds instead go to an `app/` route, which no source covers.

---

## Gap #8 — Who commits / PRs designer builds

- **Where in the SOP:** *The Figma → Code Loop* → "Open questions in this loop" (`stories/working-with-compass/figma-to-code-loop.mdx:249-252`).
- **The unanswered question:** Does a designer commit and open a PR for their own reviewed build, or hand the output to an engineer?
- **Does an existing source answer it?** **No source decides this.** The PR process is written for engineers and gated on CODEOWNERS: `.claude/contributing.md:1-3` ("Who this is for: Engineers"), `contributing.md:105-118` (branch/audit/PR-template/CODEOWNERS/squash). The Designer Guide ends at "Review the output" and never mentions commit/branch/PR (`.claude/designers.md:100-107`). No source bridges the two.
- **If it needs a new decision — options + recommendation:**
  - (a) Designer hands the reviewed output to an engineer, who commits/PRs.
  - (b) Designer commits their own build to `components/blocks/` (the "less strictly gated" area) and opens the PR.
  - **Recommendation (traced, tentative lean toward a):** `CLAUDE.md` frames the designer as "a designer, not a developer" (Working rhythm) and the PR path is CODEOWNERS-gated for engineers (`contributing.md:114-118`), which leans toward (a). But `contributing.md:84` explicitly calls `components/blocks/` "less strictly gated," which keeps (b) open. This is genuinely a workflow choice — I present both; the lean traces but the call is yours.

---

## Gap #9 — Truth surface for component status

- **Where in the SOP:** *The Figma → Code Loop* → "Open questions in this loop" (`stories/working-with-compass/figma-to-code-loop.mdx:256-262`).
- **The unanswered question:** Which surface is authoritative for live component status (which components have specs / Code Connect), so the SOP can point to one and retire the rest?
- **Does an existing source answer it?** **No source designates authority — and note a staleness caveat.** The Designer Guide's status table was refreshed on 2026-07-07 and now reads 55 components / 33 specs / 10 Code Connect (`.claude/designers.md:132-136`), so the SOP's own wording that the table "still says only Button/Input/Card" (`figma-to-code-loop.mdx:257-260`) is now **out of date**. The remaining live question is which document is authoritative: the hand-maintained `designers.md` table (`designers.md:132-140`) versus the machine-readable meta contract that Storybook badges, the compliance audit, and the scaffold pipeline all read (`stories/working-with-compass/working-with-ai.mdx:73-83`, from `components/ui/_meta-schema.ts`). No source names one as the single truth.
- **If it needs a new decision — options + recommendation:**
  - (a) The meta-driven surface (Storybook badges) is authoritative; retire the hand table in `designers.md`.
  - (b) Keep the `designers.md` table as the human-readable truth and hand-sync it.
  - **Recommendation (traced):** Option (a). It traces to how the SOP itself describes the meta contract — "the docs you read and the rules the AI is graded against cannot diverge" because Storybook, the audit, and the scaffold "all read this same contract" (`working-with-ai.mdx:80-83`). A hand-maintained table is exactly the thing that drifts (it already did). Confirm before retiring the table.

---

## Gap #10 — Acceptable compliance-score threshold

- **Where in the SOP:** *Working with AI* → below layer 5 (`stories/working-with-compass/working-with-ai.mdx:109-118`) — the `GapCard`.
- **The unanswered question:** What compliance score counts as "good" — the number a designer should treat as an acceptable build?
- **Does an existing source answer it?** **No source sets an acceptance threshold.** The formula and weights are defined — `.claude/skills/compass-audit/SKILL.md:60` gives `Score = startScore − errorWeight·errors − warningWeight·warnings (floor 0)`, and `SKILL.md:36` points to `scripts/audit-rubric.json` as the owner-tunable source of weights (default 100/−5/−1 per `.compass-build/STATE.md:18`) — but no source states a pass/fail number. The audit is explicitly advisory, not a gate: `SKILL.md` hard rule 4, quoted in the SOP as "token-audit stays the commit gate ... the compliance audit is advisory" (`working-with-ai.mdx:105-106`).
- **If it needs a new decision — options + recommendation:**
  - (a) Keep it advisory — no hard threshold; the token audit (zero errors) stays the only gate, and compliance is a trend signal.
  - (b) Set a soft target (e.g. "aim for ≥90; investigate below 75").
  - (c) Set a hard threshold.
  - **Recommendation (traced, for keeping it advisory):** Option (a) traces to the existing design — compliance is deliberately advisory (`SKILL.md` hard rule 4), and the drift loop reads *trends*, not a per-build pass. So "no threshold" is defensible from source. **Choosing any specific number (options b/c) is `⚠ NEW OPINION — no source; owner must decide`.**

---

## Gap #11 — Button vs link-variant vs icon-button general rule

- **Where in the SOP:** *Choosing a Component* — the flagged leaf inside the Selection-control / button flow (per the structure doc, `.compass-build/design/s2/sop-interactive-structure.PROPOSED.md:64-67`; the flow data lives in `stories/working-with-compass/decision-flows.ts`).
- **The unanswered question:** As a *general* rule, when is an action a text link (`variant="link"`) versus a subtle button (`variant="ghost"`)?
- **Does an existing source answer it?** **Partial.** `button.md` decides the neighbouring cases: navigation uses the render prop (`.claude/specs/components/button.md:145-155, 217`); icon-only buttons use `size="icon"` + `aria-label` (`button.md:124-139`); ghost-vs-outline is covered (`button.md:39-41`). And for the *specific* case of a small text-style action adjacent to a label / inside a form row, `button.md:182-189` gives a color-based rule ("purple/primary that navigates → `link`; purple with no route → `link type="button"`; foreground/gray → `ghost size="sm"`"). What's missing is a *general* "action = link vs ghost" rule outside that adjacent-inline context.
- **If it needs a new decision — options + recommendation:**
  - (a) Promote the existing color-based rule (`button.md:182-189`) to the general rule.
  - (b) Add a new intent-based rule (navigational text → link; low-emphasis action → ghost).
  - **Recommendation (traced):** Option (a) — the color-based rule already exists in `button.md:182-189` and generalizes naturally (primary-colored navigational text → `link`; foreground-colored low-emphasis action → `ghost`), so extending it is a small, source-anchored move rather than a new opinion. Confirm you're happy to state it as the general rule.

---

## Gap #12 — Feedback success-confirmation path (sonner)

- **Where in the SOP:** *Choosing a Component* → Feedback flow (`stories/working-with-compass/choosing-components.mdx:176-199`) — the flagged Toast/Sonner leaf (structure doc `.../sop-interactive-structure.PROPOSED.md:68-71`).
- **The unanswered question:** How should a transient success confirmation ("Saved", "Sent") actually be built, given the feedback table routes it to Toast/Sonner but Sonner has no spec?
- **Does an existing source answer it?** **Partial / thin.** The Alert spec's table routes transient confirmations to Sonner — "Transient confirmation that disappears after a few seconds → Toast/Sonner" (`.claude/specs/components/alert.md:33`). But there is **no sonner spec** (confirmed: `.claude/specs/components/` has no `sonner.md`), even though the component and its meta exist (`components/ui/sonner.tsx`, `sonner.meta.ts`). So the leaf can cite only the one `alert.md` row; nothing defines the Sonner usage/API/pattern.
- **If it needs a new decision — options + recommendation:**
  - (a) Author a minimal `sonner.md` spec (when-to-use + basic pattern).
  - (b) Leave it as the single citable `alert.md:33` row and keep the flagged leaf.
  - (c) Fold Sonner guidance into `alert.md`.
  - **Recommendation (traced, process-level):** A minimal spec (a) fits the roadmap's demand-driven backfill (`Compass_GA_Roadmap.md:283-284`) now that a real SOP flow depends on it. That's a process trace, not a design opinion — **the actual content of a Sonner spec (default duration, position, variants) has no source and would be `⚠ NEW OPINION`**, so I'm not drafting it here.

---

## Gap #13 — Chart-state flow (loading / error / empty)

- **Where in the SOP:** *Common Tasks* → Charts accordion (`stories/working-with-compass/common-tasks.mdx:138-181`) — folded into the same flagged Charts leaf (structure doc `.../sop-interactive-structure.PROPOSED.md:72-75`).
- **The unanswered question:** What are the standard chart loading (Skeleton), error, and empty states?
- **Does an existing source answer it?** **No current source defines them.** The roadmap names them only as *future* promotion candidates: `Compass_GA_Roadmap.md:280` lists "Standardized chart `Skeleton` / `Error` / `Empty` states" under S6.2's promotion pipeline (`Compass_GA_Roadmap.md:275-281`). No spec or meta defines them today (chart has no spec, `chart.meta.ts:46`).
- **If it needs a new decision — options + recommendation:**
  - (a) Defer to S6 as the roadmap already schedules; keep the flagged leaf until then.
  - (b) Author the three states now.
  - **Recommendation (traced, process-level):** Option (a) — the roadmap already assigns these to S6.2 (`Compass_GA_Roadmap.md:280`), so deferring is consistent with the plan rather than a new call. **The visual/behavioral design of the three states themselves is `⚠ NEW OPINION — no source; owner must decide` if you'd rather do them now.**
