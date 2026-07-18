# Compass spec-tightening proposal — Status / semantic token family   [PROPOSED — nothing applied]

> **SHAPE-ONLY proposal. No colour values are chosen here.** This batch documents a
> recurring gap and proposes the *token shape* (names + intended usage), mirroring the
> existing `--destructive` / `--destructive-foreground` precedent exactly. Every value is
> left as `<brand decision — TBD>`. The owner + FE dev decide the actual colours; tokens
> ship from `@acko/enterprise-tokens` (FE-dev-owned). **This is the top spec-tightening
> candidate.**

Batch: 6 (Status token family — stage only) · Date: 2026-07-19
Governing docs: `.claude/specs/foundations/color.md`, `.claude/specs/tokens/token-reference.md`
Precedent to mirror: `--destructive` / `--destructive-foreground`

---

## 1. The gap (why this is the top candidate)

**Compass has no status / semantic-colour token family.** It ships `--primary`,
`--destructive`, backgrounds, and `--chart-1…5`, but nothing for **success / warning /
info**. Because there is no correct token to reach for, every product "status" colour
that appears in a Figma design has to drift onto *some* existing token — and it always
lands on chart tokens or `primary`. This is the classic "no correct token exists, so the
LLM silently substitutes" failure the Universal Rule in `CLAUDE.md` warns about.

`color.md` even encodes the symptom explicitly (Rule 5):

> "don't use `--chart-4` for 'success' just because it's green."

That rule tells the model what *not* to do but gives it nowhere to go instead. The fix is
to give it somewhere to go: a real status token family.

---

## 2. Evidence (from the 3 test builds — which flow / assumption each came from)

| # | Status meaning | Where it drifted to | Flow / assumption source | Notes |
|---|----------------|---------------------|--------------------------|-------|
| E1 | **success** | `--chart-4` (the green chart series) | **Flow A2** — green "cue" badges **AND** **Flow B** — `--success` | **Recurred in BOTH flows independently.** Strongest signal. |
| E2 | **info** | `--chart-3` (the blue chart series) | **Flow A2** — "porting" status badge | Blue chart series co-opted as an info cue. |
| E3 | **verify** | `--bg-primary` / `primary` | **Flow B** — `--verify` accent | See RULE below — this one is *correct by design*, not a gap. |
| E4 | **warning / amber** | `variant="outline"` (no fill) | **Flow B** — "skip" CTA | Amber is **audit-illegal** (no `amber-*` utility, no warning semantic), so the build fell back to an outline button rather than any colour. A warning semantic would have resolved it. |
| E5 | **upload / ready tint** | `--chart-4` + `--bg-muted` | **Flow B** — upload/ready surface | Green-tinted "ready" surface again borrowed the green chart series plus a muted background. |

**Recurrence:** success (E1) drifted onto `chart-4` in **two independent flows** — the
defining marker of a real, non-incidental gap. info (E2) and the amber/warning fallback
(E4) reinforce that the whole *feedback* dimension of colour is missing, not just one hue.

---

## 3. Proposed token SHAPE (names + usage only — NO values)

Follow the `--destructive` precedent **exactly**. In `@acko/enterprise-tokens`, destructive
is wired in four coordinated places; the new tokens must appear in the same four:

```
1. @theme inline   →  --color-destructive: var(--destructive);
2. Layer-1/2 vars  →  --acko-destructive-light / --acko-destructive-dark
                      --acko-destructive-foreground-light / --acko-destructive-foreground-dark
3. :root (light)   →  --destructive: var(--acko-destructive-light);
                      --destructive-foreground: var(--acko-destructive-foreground-light);
4. .dark           →  --destructive: var(--acko-destructive-dark);
                      --destructive-foreground: var(--acko-destructive-foreground-dark);
```

Add **three semantic pairs** in that identical shape (Layer-3 semantic name + `-foreground`
partner, each resolving light/dark via a `--acko-*-light` / `--acko-*-dark` backing pair,
and each exposed to Tailwind through a `--color-*: var(--*)` line in `@theme inline`):

| Semantic token | Foreground partner | Intended usage |
|----------------|--------------------|----------------|
| `--success` | `--success-foreground` | Positive / completed / "ready" states: success badges, confirmation banners, valid-field cues (E1, E5). Replaces the `chart-4` misuse. |
| `--warning` | `--warning-foreground` | Caution / needs-attention / skippable states: warning banners, amber "skip" CTAs, non-blocking alerts (E4). Replaces the audit-illegal amber + the `variant="outline"` fallback. |
| `--info` | `--info-foreground` | Neutral informational / in-progress states: info badges, "porting" status, informational callouts (E2). Replaces the `chart-3` misuse. |

**Foreground pairs** carry the on-surface text/icon colour, exactly as
`--destructive-foreground` does for destructive surfaces — so `text-*-foreground` reads
legibly on the matching `bg-*`.

Tailwind classes that would then exist (mirroring `bg-destructive` / `text-destructive`):
`bg-success` / `text-success` / `text-success-foreground`, and the same for `warning` and
`info`.

**All colour values: `<brand decision — TBD>`.** This batch does not pick them (see §5).

---

## 4. RULE — `verify` is NOT a system token

`verify` (E3, Flow B's `--verify`) must **not** get its own token. It is a **product
accent**, not a system-level semantic, and it should map to **`primary`** (Acko purple).
The Flow B build already resolved `--verify` → `bg-primary`, which is the *correct*
outcome. Adding a `--verify` token would fragment the brand anchor and invite exactly the
drift we're trying to remove.

**Do not add a `verify` token.** `verify` = `primary`, by rule.

So the family is **success / warning / info only** — three pairs, six tokens.

---

## 5. Values are a brand decision — this batch does not choose them

Per this batch's charter, **no colour values are invented here.** The decision on the
actual light/dark hex/oklch for success / warning / info belongs to the **owner + FE dev**,
and the resolved tokens ship in **`@acko/enterprise-tokens`** (FE-dev-owned) — the same
package where `--destructive` lives today (`node_modules/@acko/enterprise-tokens/globals.css`).
Once values are agreed, the FE dev adds them in the four-place shape above and
`.claude/specs/foundations/color.md` gets a new "### Status / feedback" table alongside the
existing "### Destructive" table.

### Figma check — what exists today (reported, not invented)

The Compass Figma library **was reachable** for this batch (authenticated as Nikhil
Thakkar, Acko enterprise plan; file key `zgzPlhKxDXc3E9OmfxmF9y` =
"ACKO Enterprise Design System v1.0.0"). Findings, by **variable name** (values NOT read
or invented — names only):

- **In the canonical Compass library ("ACKO Enterprise Design System v1.0.0"):**
  `destructive` is fully defined (`base/destructive`, `base/destructive-foreground`,
  `colors/destructive-light|dark`, `colors/destructive-foreground-light|dark`, plus
  `custom/destructive dark:destructive\90` etc.). Searching **success / warning / info /
  status** against this library returns **ZERO** variables and **ZERO** styles.
  → **Confirmed: the source-of-truth Compass library has no status/semantic colour family.**
  The code-side gap matches the Figma-side gap.

- **Other libraries visible to the account are NOT sources.** The read-only
  `search_design_system` results also surfaced status-token structures in unrelated libraries
  (e.g. an "Umbrella DS 2.0" library models `status/{success,warning,info}/…`). **Per owner
  ruling 2026-07-19, these carry NO authority for Compass** — different system, different
  product context, different visual language. Noted here only as unrelated prior art that
  happens to exist; it must **not** be cited as justification for any Compass value.

**Conclusion of the Figma check:** The gap is **real and unfilled** — the source-of-truth
Compass library (`zgzPlhKxDXc3E9OmfxmF9y`) defines `destructive` but **no** status/semantic
colour family, and neither does `@acko/enterprise-tokens`. **The ONLY valid sources for
Compass token values are this Figma library and `@acko/enterprise-tokens` (owner ruling
2026-07-19).** The values are a brand decision for the **owner + FE dev**, to be **added to
the ACKO Enterprise Figma library FIRST, then mirrored into `@acko/enterprise-tokens`** so
Figma and code agree from day one. This batch picks no colours and proposes no values from
any other source.

---

## 6. Recommendation

1. **Approve the shape** — three semantic pairs (`--success`/`--success-foreground`,
   `--warning`/`--warning-foreground`, `--info`/`--info-foreground`) in the exact
   four-place `--destructive` wiring. **Top tightening candidate.**
2. **Adopt the rule** — `verify` is not a token; it maps to `primary`.
3. **Owner + FE dev pick values** — add them to the ACKO Enterprise Figma library
   (`zgzPlhKxDXc3E9OmfxmF9y`) FIRST, then mirror into `@acko/enterprise-tokens` (Figma-first,
   so design + code agree from day one). Values come ONLY from these two sources — no other
   library (owner ruling 2026-07-19).
4. Then, and only then, add the "### Status / feedback" table to
   `.claude/specs/foundations/color.md` and the row block to
   `.claude/specs/tokens/token-reference.md`, and re-run `npm run audit`.

---

_Staged by Batch 6. No spec file edited, no token value chosen, no git operation performed.
Approval + value selection happen in the owner's tightening session._
