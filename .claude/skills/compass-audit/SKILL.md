# Compass — Audit the System (score · detect · prescribe)

> **Skill type:** Behavioral audit (the S4 self-correcting loop)
> **Trigger:** After any AI-assisted build ("score this build"), on the
> weekly/monthly drift cadence ("run the drift check", "any drift this
> month?"), or before onboarding designers ("baseline the health dashboard")
> **Tools:** Claude Code, in this repo
> **Output:** compliance reports + health dashboard (derived), drift reports,
> and a tightening-plan PROPOSAL for owner review
> **Status:** Capture/Score/Detect/Prescribe-scaffold ACTIVE ·
> C7 font compliance DESIGN-ONLY (`.compass-build/design/s4/c7-font-compliance.PROPOSED.md`)

---

## Hard rules (non-negotiable — read first)

1. **The loop proposes, the owner approves.** Never edit a spec, CLAUDE.md, a
   meta file, or any rule from this skill. The only artifact you may produce
   about rules is a *proposal* in `drift-log/proposals/`.
2. **Every prescription cites ledger evidence** — the exact
   `drift-log/entries/` filenames. No evidence, no prescription.
3. **The opinion firewall.** If a fix merely disambiguates an existing rule
   the LLM had to guess on → draft the spec diff *as a proposal* (Case A). If
   the fix requires a design opinion Compass has not made → emit a
   **NEEDS OWNER DECISION** item with options and trade-offs, and **never**
   phrase a recommendation as a rule (Case B). When unsure which case: Case B.
4. **token-audit stays the commit gate.** `npm run audit` (scripts/token-audit.mjs)
   is untouched by this loop; the compliance audit is advisory.
5. **Demo entries** (`"demo": true` in a ledger entry) never feed a real
   detect run or tightening plan.

---

## The rubric (C1–C7)

Scoring weights live in `scripts/audit-rubric.json` — the single source of
truth, owner-tunable. Per-rule detail: [`rubric-reference.md`](rubric-reference.md).

| Check | What it catches | Level |
|-------|-----------------|-------|
| C1 tokens | hex colors, Tailwind color utils, arbitrary values (tiered: spacing/radius/type = error, layout dims = warn), raw px styles | error/warn |
| C2 provenance | raw `<button>/<input>/<select>/<textarea>/<table>` where a primitive exists; div/span wearing a primitive's signature tokens | error / warn |
| C3 composites | composite rendered with children but none of its meta `childComponents` | warn |
| C4 spec coverage | ui component used whose meta has no spec (backfill signal) | warn |
| C5 naming | non-kebab-case files/dirs in build areas | error |
| C6 imports | ui primitives not imported via `@/components/ui/`; copied primitives | error |
| C7 fonts | **design-only, not implemented** — paint-level font verification | — |

C2/C3/C4 resolve against `components/ui/*.meta.ts` (S1). The audit *reads*
meta; it never writes it.

## Score a build

```bash
npm run log            # capture: paste "What I assumed", files auto-detected
npm run audit:compliance -- --entry drift-log/entries/<entry>.json
npm run dashboard      # regenerate drift-log/dashboard.html
```

Score = `startScore − errorWeight·errors − warningWeight·warnings` (floor 0),
from `scripts/audit-rubric.json`. The report JSON (`drift-log/reports/`)
carries `findings[]`, `perFile`, `perComponent`, `totals.byRule`.

Repo-wide health snapshot: `npm run audit:compliance` (components/ui/ excluded
by owner decision — the audit grades feature builds, not stock primitives).
Self-test that C1 still matches token-audit: `npm run audit:compliance -- --parity`.

## Detect (weekly → monthly)

```bash
npm run detect                    # last rubric.detect.windowSize entries
npm run detect -- --window 20
```

Reads entries + reports, outputs `drift-log/detect/<stamp>__window-N.json` +
`.md`: component hotspots, rule hotspots, `{component, rule}` clusters counted
in **distinct builds** (hotspot at ≥ `rubric.detect.hotspotMinBuilds`),
assumption themes (recurring assumptions = spec ambiguity), and unscored
entries. Every hotspot lists its evidence entries.

## Prescribe (after every Detect that finds hotspots)

```bash
npm run prescribe                 # scaffolds from the newest detect report
```

The scaffold writes `drift-log/proposals/<date>__tightening-plan.md`
(template: [`templates/tightening-plan.md`](templates/tightening-plan.md)):
it locates each hotspot's governing doc (meta `specPath`, foundations spec, or
CLAUDE.md), quotes candidate existing-rule lines verbatim, and pre-classifies
Case A vs Case B. **Your job in the skill run:**

1. For each **Case A** item: verify the quoted rule genuinely governs the
   drift. If yes, replace the `[DRAFT REQUIRED]` placeholder with an exact
   unified diff of the spec edit, keeping the evidence list. If the quote does
   not actually govern it, reclassify to Case B.
2. For each **Case B / NEEDS OWNER DECISION** item: describe the decision,
   give 2–3 options with trade-offs. No recommendation phrased as a rule.
3. Leave "Watching, not acting" untouched — below-threshold signal is
   deliberately not actioned.
4. Hand the finished plan to Nikhil (monthly Claude.ai tightening session).
   Apply **nothing** yourself. Approved diffs get applied later by a
   human-driven edit + audit re-run; rejected items get noted in the plan so
   the loop doesn't re-propose them verbatim.

## Cadence

- Capture: every build. Score: per build (seconds).
- Detect + Prescribe: weekly to start, relaxing to monthly as scores stabilize.
- Approve: owner only — every tightening, every NEEDS OWNER DECISION item.
