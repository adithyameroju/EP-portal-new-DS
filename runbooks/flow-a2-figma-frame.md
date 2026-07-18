# FLOW A2 — Same loop, but the input is a Figma frame

**Read [FLOW A](./flow-a-new-project.md) first.** Setup (steps 0–4) and the loop
(step 6) are **identical**. This runbook only covers **what differs** when the
input is a Figma frame instead of a text prompt.

The short version: *the loop doesn't change — the drift profile does.* A text
prompt under-specifies, so the AI invents little. A Figma frame over-specifies,
so the AI must **map** dozens of concrete values onto the system — and every
mapping is a chance to silently substitute. That's why this flow's "What I
assumed" list is the long one, and why it matters most here.

---

## What you need beyond Flow A

| Need | Why |
|---|---|
| **Figma MCP** connected in Cursor/Claude Code | lets the AI read the frame directly |
| Access to the Compass library | file key `zgzPlhKxDXc3E9OmfxmF9y` (see `.claude/specs/figma/component-keys.md`) |
| A **node-specific** frame URL | right-click the frame → *Copy link to selection* |

> If the Figma connector isn't authorized, this flow can't run — authorize it in
> your claude.ai connector settings (or `claude mcp` in an interactive session).

---

## The differences, step by step

### 1 · The input
```
Build this frame in Compass: https://figma.com/design/zgzPlhKxDXc3E9OmfxmF9y/...?node-id=1-2785
```
The `generate-code` skill (`.claude/skills/generate-code.md`) takes over. Its
Step 1 is **analyze before writing** — expect the AI to state what it sees
(components, layout, spacing, colors, text styles, states) *before* any code.
If it starts writing code immediately, stop it; the analysis is the contract.

### 2 · Code Connect does the heavy lifting — for 10 components
These are mapped to Figma Dev Mode today:

`button` · `card` · `dialog` · `field` · `input` · `select` · `sheet` · `sidebar` · `table` · `tabs`

For these, selecting the component in Dev Mode shows **real Compass React code**
instead of auto-generated CSS — the mapping is authoritative, and drift risk is
low. **Everything else** in the frame is resolved by the AI from the specs +
`meta.ts`, which is where mistakes concentrate. Read the assumption list for
those components especially closely.

> Code Connect coverage is deliberately demand-driven (the Tier-1 set). If a
> component keeps causing drift here, that's the signal it has earned a mapping —
> a real decision for you, not an automatic one.

### 3 · The drift profile changes
Figma gives exact values; Compass has a closed set. Every gap is an assumption:

| Figma shows | Honest outcome | Silent-substitution risk |
|---|---|---|
| `#6841E6` fill | → `bg-primary` (exact token match) | low |
| 15px gap | → `gap-4` (16px), **stated as a rounding** | low — but it must be *stated* |
| a shadow on a card | → the card's built-in `shadow-xs`, or a flagged exception | **high** |
| a colour not in the token set | → **must be flagged**, never "closest guess" | **high** |
| a component Compass lacks | → flagged; do not invent a new primitive | **high** |

The rule that governs all of it (CLAUDE.md, verbatim): **"Never silently
substitute."** A frame value that doesn't cleanly map must surface as a question,
not get buried in the code.

### 4 · Then the loop is exactly Flow A
```bash
npm run audit              # HARD GATE — 0 errors
npm run audit:compliance   # score
```
> Same caveat as [Flow A step 6](./flow-a-new-project.md): in a `compass init`
> project, `npm run log` / `npm run dashboard` aren't wired yet (parked on
> `init-hardening-wip`) and will fail with "missing script". Capture-and-dashboard
> works today only on the clone path (the full Compass repo — see the
> [Designer Quickstart](./designer-quickstart.md)).

### 5 · Optional — write back to Figma
If you want the built screen represented in Figma, the `write-to-figma` skill
uses **published library instances** via `importComponentByKeyAsync()` with the
keys in `component-keys.md`. It must never use `createFrame()` to fake a Compass
component — raw frames lose variables, fonts, and variant properties.

---

## What GOOD looks like (specific to this flow)

- The AI **analyzed first**, and its component list matches what you see.
- The assumption list is **all roundings and exact matches** — no decisions.
- Mapped components (the 10) came through as real Compass imports.
- `npm run audit` → **0 errors** (no hex leaked in from the frame).

## What DRIFT looks like (specific to this flow)

- **Hex from Figma survived into the code** → `audit` errors. The classic failure.
- **`C2-raw-element`** → it rebuilt a Compass component as divs to match the frame
  pixel-for-pixel instead of using the primitive.
- **An assumption that's a decision**, e.g. *"Assumed the card needs a border"* or
  *"Used Sheet because the frame looked like a panel"* — that's a judgment the AI
  shouldn't be making alone.
- **Silence.** An empty assumption list on a rich frame is a red flag, not a win —
  it means mappings happened without being surfaced.

## Where YOU make a call

1. **Every assumption** — heavier here than Flow A. This is the whole point.
2. **Any "Compass lacks this"** finding → it's a gap-list candidate (S6), not a
   licence to invent a component.
3. **Whether an unmapped component that keeps drifting earns Code Connect.**
4. **Frame-vs-system conflicts** — if the frame contradicts a spec (a shadow the
   component doesn't have), you decide which is right. The AI must flag it, not
   pick. *(This is exactly how the Card default got resolved: Figma said
   `shadow/xs` + border, code said neither — the fork went to you.)*
