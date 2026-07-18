# FLOW A — New project: prompt → build → audit → log → dashboard

**What this is.** The everyday loop: you start a fresh project, prompt an AI to
build a screen, and the system tells you honestly how on-Compass the output is.
Stamped against the build at `s3-build-complete` (2026-07-07), updated through
2026-07-18 to fold in the post-build rulings — the Card composition ruling, the
12 SOP rulings, the standing decision queue, and the Storybook story fixes. See
`.compass-build/STATE.md` (the decision log) for the authoritative record.

**Read this first:** the compliance score is *advisory*. The only hard gate is
`npm run audit` (0 errors). Everything else is a signal, not a verdict.

> **Designer shortcut (Cursor).** Flow A is the *package* path — Compass dropped
> into your own separate project via the tarball (the `.npmrc` @acko scope +
> Acko-network/VPN for Nexus are required, or `npm install` fails with
> `E404 @acko/enterprise-tokens`). If you're a designer starting fresh, the
> faster, more reliable path is the **clone** path driven by the "Using Compass in
> Loop" Cursor rule — see the [Designer Quickstart](./designer-quickstart.md).
> Use Flow A only when you specifically need Compass inside an existing project of
> your own.

---

## 0 · One-time setup

| Need | Why | Note |
|---|---|---|
| Node ≥ 20 | runtime | — |
| `.npmrc` with the `@acko` scope line | pulls `@acko/enterprise-tokens` from Acko Nexus | copy the line from the Compass repo's `.npmrc` |
| The Compass tarball | **the package is NOT on a registry** (owner ruling) | see step 2 |
| Euclid Circular B | brand font | ships inside the package (`@acko/compass/fonts.css` + `app/fonts/`) — licensed, don't redistribute outside Acko |

---

## 1 · Create the project

```bash
npx create-next-app@latest my-feature      # React + Tailwind v4
cd my-feature
```

## 2 · Install Compass (from the tarball)

```bash
# in the Compass repo:
npm run build:pkg && npm pack        # → acko-compass-0.1.0.tgz

# in my-feature:
npm install /path/to/acko-compass-0.1.0.tgz
```
`@acko/enterprise-tokens` comes along as a transitive dep from Nexus.
`react` / `react-dom` / `next` are **peer** deps — your app supplies them.

## 3 · Wire the CSS chain

`compass init` (next step) generates **`compass-tokens-import.md`** in your
project, built from Compass's *actual* `app/globals.css` — so it can't go stale.
Follow it exactly; it gives you the `@import` lines for your `globals.css`
(Tailwind → shadcn → `@acko/enterprise-tokens/globals.css` → the Euclid
`fonts.css`).

> **Sanity check:** if text renders in the system font, the font chain is wrong.
> `npm run audit:compliance` check **C7a** exists precisely to catch that.

## 4 · Scaffold the governance

```bash
npx compass init          # add --dry-run first to see the plan
```
This drops the specs (`.claude/specs`), the skills (`.claude/skills`),
`CLAUDE.md`, and the two audit scripts (`token-audit.mjs`,
`compliance-audit.mjs` + `audit-rubric.json`), and wires the `audit` and
`audit:compliance` npm scripts. Re-running is safe (it reports "already present,
skipped"); it refuses to overwrite anything you've changed.

> **What `init` does *not* scaffold yet:** the full drift-loop tooling
> (`compass-log.mjs`, `detect-drift.mjs`, `prescribe.mjs`, the dashboard, the
> `drift-log/` ledger) is **not** wired by `compass init` today — that hardening
> is parked on a branch. If you want the complete loop right now, use the
> clone-based [Designer Quickstart](./designer-quickstart.md) (the Compass repo
> has everything wired). `compass init` gives you the guardrails — token audit +
> compliance audit — which is what Flow A needs to keep a *new* project on-spec.

## 5 · Build by prompting

Open the project in Cursor or Claude Code. `CLAUDE.md` and `.claude/**` are
picked up automatically — that's what constrains the AI to Compass components
and tokens.

> Prompt example: *"Build a signup card: heading, email + password fields,
> primary submit, and a 'Forgot password?' text action."*

## 6 · Run the loop

`compass init` wires the two guardrail scripts, so in a Flow-A target project
these are the loop:

```bash
npm run audit              # 1. HARD GATE — must be 0 errors
npm run audit:compliance   # 2. advisory score + which rules fired
```

> **Not available in a `compass init` project yet.** The drift-ledger half of
> the loop — `npm run log`, `npm run dashboard`, and the periodic
> `npm run detect` / `npm run prescribe` — is **not** wired by `init` today
> (that hardening is parked on `init-hardening-wip`). Running them in a Flow-A
> project will fail with "missing script". They work today only on the
> **clone path** — the full Compass repo (see the
> [Designer Quickstart](./designer-quickstart.md)), where the ledger, dashboard,
> and prescribe pipeline are all wired. Once init-hardening merges, this section
> gains `log` → `dashboard` (every session) and `detect` → `prescribe`
> (weekly → monthly) with no other change.

---

## What GOOD looks like

**`npm run audit`** — the only thing that must be true:
```
  Token Audit Complete
  Errors:            0
  Warnings:          3
  ⚠ Audit passed with warnings.
```
Warnings are fine (they're usually layout arbitraries like `w-[220px]`).

**`npm run audit:compliance`** — a high score and no C2/C3:
```
  Compliance score:  98 / 100
  By rule:           C1-arbitrary-layout×2
```

**The "What I assumed" block** — short, and every item is a *trivial rounding*:
> - Rounded 15px gap → `gap-4` (16px)

## What DRIFT looks like

**Token drift** (the AI hardcoded instead of using the system):
```
  components/blocks/signup-card.tsx
    ✗ ERROR  line 12
           Hardcoded color `#6841E6` found
           → text-primary / bg-primary
```
→ This *blocks the commit*. Fix it (or have the AI fix it) before anything else.

**Behavioral drift** (it used the wrong thing, or re-implemented Compass):
```
  Compliance score:  82 / 100
  ✗ C2-raw-element   line 24  Raw <button> where the Compass `Button` primitive exists
  ⚠ C3-missing-subparts      Card rendered without CardHeader/CardContent
  ⚠ C4-unspecced             `slider` used — no spec (backfill signal)
  ✗ C5-naming                File `SignupCard.tsx` is not kebab-case
```

**Assumption drift** — the tell is an assumption about a *decision*, not a
rounding:
> - "Assumed Card should have a border" ← the AI is guessing at a rule.
> A repeated assumption means **the spec failed to decide something** — that's
> exactly what `detect` → `prescribe` exists to surface.

---

## Where YOU make a call

1. **Every "What I assumed" item** — confirm, correct, or escalate. This is the
   drift-prevention mechanism; skipping it defeats the loop.
2. **Each `prescribe` proposal** (clone path today; Flow-A projects once
   init-hardening merges — see step 6) — it will hand you a *proposed* spec edit
   with evidence, or a **"NEEDS OWNER DECISION"** flag. It never writes a rule
   itself. You approve, amend, or reject.
3. **Anything the specs don't decide** — it surfaces as a flag, not a guess.
   Rule it when real work makes the answer obvious; leaving it open is legitimate.

## Honest limitations (at this tag)

- The package is **tarball-only** (no registry publish).
- **C2/C3/C4** need the meta contract. They run when Compass is installed (the
  package ships it) — if you see *"meta unavailable — C2/C3/C4 skipped"*, the
  install or the path is wrong, and you're only getting half the score.
- `detect` needs **≥3 builds** in its window before it will cluster a hotspot
  (tunable: `scripts/audit-rubric.json` → `detect.hotspotMinBuilds`).
