# Golden-Pair Diffing — v1 Source-Library Set

> Used by `compass-migrate` Step 0.5 (identification) and Step 2.1 (diffing).
> **Purpose:** when the target repo is built on a known library, diff each of
> its components against that library's *stock origin* to separate **the team's
> customizations** (which must survive the migration) from **the base
> component** (which is replaced by Compass). No golden pair exists for
> bespoke/unknown systems — fall back to pure role-based resolution
> ([resolution.md](resolution.md), gated on S1).
>
> **v1 set (owner-approved 2026-07-06):** stock shadcn/ui · MUI · Chakra ·
> Ant Design · Lovable/Replit default output. Anything else = "bespoke/unknown"
> in `_baseline.md` — do not improvise an identification.
>
> **Validation note (honesty):** the identification signals below are drawn
> from these libraries' public conventions. Before the first production run on
> each library, validate the signals against one real sample repo and correct
> this file — do not treat unvalidated patterns as fact. Per-library mapping
> tables (e.g. `mui-mappings.md`) are added to this folder only after owner
> approval.

---

## The diffing procedure (same for every identified library)

1. **Pin the stock origin.** Determine the exact library version from the
   target's lockfile. Fetch/scaffold that version's stock component (for
   copy-in libraries like shadcn, generate the stock file with the same CLI
   version; for import libraries like MUI/Chakra/Ant, the "origin" is the
   documented default usage + default theme).
2. **Diff target vs origin** per component: props added/removed, className/sx
   /styled overrides, theme token overrides, structural JSX changes, added
   handlers (handlers = logic — left alone).
3. **Classify each delta:**
   - **Pristine** (no meaningful delta) -> straight swap to the Compass
     equivalent.
   - **Customization — style** (colors, spacing, radius, shadow, typography)
     -> re-express as Compass semantic tokens/variants if a legal mapping
     exists; otherwise `_needs-decision.md`. Never a hardcoded value.
   - **Customization — structure** (extra elements, rearranged anatomy) ->
     preserve the structure around the Compass component; flag in the unit
     report if Compass's composite anatomy conflicts.
   - **Customization — behavior** (changed interaction defaults) -> record
     under `Behavior changes`; never patch Compass to imitate it.
4. Record the classification per component in the unit report (`Changed` /
   `Left alone` / `Behavior changes`).

---

## Identification signals per library (checked in this order)

### 1. Lovable / Replit default output — THE HEADLINE PATH (PM handoff)

Characterize this one most carefully: it is the highest-value route, and it is
also the *easiest* golden pair, because these tools scaffold from stock
shadcn/ui — the "team customizations" are whatever the PM's prompts changed.

**Lovable output — identification signals:**
- Stack: Vite + React + TypeScript + Tailwind + **shadcn/ui copied into
  `src/components/ui/`** (that folder full of stock-looking shadcn files is
  the strongest single signal).
- Deps typically include: `lucide-react`, `class-variance-authority`, `clsx`,
  `tailwind-merge`, `react-router-dom`, `@tanstack/react-query`, `sonner`,
  and a broad set of `@radix-ui/react-*` packages (Lovable scaffolds are
  usually **Radix-era shadcn**, not Base UI — expect `asChild`,
  `data-[state=...]`).
- Tokens: HSL CSS variables in `src/index.css` under `:root` / `.dark`, wired
  through `tailwind.config.ts` `theme.extend.colors` (`hsl(var(--primary))`
  pattern) — semantic names largely identical to Compass's shadcn ancestry
  (`primary`, `muted`, `card`, `border`...), which makes the token remap
  unusually clean.
- Telltales: `README.md` mentioning Lovable, `lovable-tagger` dev dependency,
  `components.json` present.

**Replit (Agent) output — identification signals:**
- More variable than Lovable. Common shape: Vite or Next + Express monorepo
  (`client/` + `server/`), Tailwind, often shadcn/ui in
  `client/src/components/ui/` (same golden pair as Lovable when present);
  sometimes **raw Tailwind with hardcoded palette classes**
  (`bg-blue-600`, `text-gray-700`) and no component library at all.
- Telltales: `.replit` file, `replit.nix`, `replit.md`, `@replit/*` dev deps.
- When there is no component library, there is **no golden pair** — treat the
  JSX as bespoke (role-based resolution) but keep the Tailwind token remap
  (palette classes cluster well into semantic buckets).

**Golden-pair mechanics for both:** scaffold stock shadcn/ui (the Radix-era
version matching their deps) as the origin; diff their `components/ui/*`
against it. Expect three delta classes: (a) untouched stock files (majority —
straight swap to Compass's Base-UI equivalents, noting the Radix->Base
**behavior deltas** for the report), (b) PM-prompted style tweaks (usually
hex/palette edits in `index.css` or inline classes — token remap), (c) small
bespoke composites in `src/components/` built from the stock primitives
(migrate compositionally, primitive by primitive).

**Watch for in reports:** the Radix->Base UI behavioral deltas are *systemic*
for this path (`asChild` vs `render`, `data-[state=open]` vs `data-open`,
Portal/Positioner anatomy, focus handling) — list them under
`Behavior changes` once per unit, do not silently absorb them.

### 2. Stock shadcn/ui (hand-rolled projects)

- Signals: `components.json`, `components/ui/` or `src/components/ui/` with
  shadcn file shapes, `class-variance-authority` + `tailwind-merge` deps.
  Determine era: `@radix-ui/react-*` deps = Radix-era; `@base-ui/react` =
  Base-era (same platform as Compass — the cheapest migration of all).
- Origin: same-version shadcn CLI scaffold, per component.
- Note: customizations hide *inside* the copied primitive files (that is the
  shadcn model) — the golden-pair diff is mandatory, not optional, here.

### 3. MUI (Material UI)

- Signals: `@mui/material`, `@emotion/react`/`@emotion/styled` deps;
  `sx={{...}}` props; `styled()` wrappers; `createTheme`/`ThemeProvider`;
  `Grid`/`Stack`/`Typography` imports.
- Origin: documented default component + default theme for the locked version.
- Customization carriers to diff: `sx`, `styled()`, theme overrides
  (`components.MuiButton.styleOverrides`...), `variant`/`color` props.
- Watch for: MUI behavior is deeply theme-coupled (ripple, elevation,
  breakpoints object syntax); expect a heavier `Behavior changes` section and
  more `_needs-decision.md` traffic than the shadcn paths.

### 4. Chakra UI

- Signals: `@chakra-ui/react`, `@emotion/*` deps; style props on components
  (`bg=`, `px=`, `rounded=`); `extendTheme`/`ChakraProvider`;
  `useColorModeValue`.
- Origin: default theme + documented default usage for the locked version.
- Customization carriers: inline style props (the dominant pattern — these map
  to className token remaps), `extendTheme` semantic tokens, component
  `variant`s defined in theme.
- Watch for: color-mode logic (`useColorModeValue`) is presentation-adjacent
  but implemented as hooks — the *values* migrate to Compass tokens (which are
  already light/dark aware), the hook calls get removed only where purely
  stylistic; anything else -> flag.

### 5. Ant Design

- Signals: `antd` dep; `ConfigProvider`; `Form.Item`/`Table columns={}`
  config-object patterns; `@ant-design/icons`.
- Origin: default theme (v5 token system: `theme.token`/`theme.components`
  overrides are where customizations live) for the locked version.
- Customization carriers: ConfigProvider theme tokens, `styles`/`className`
  props, less commonly CSS-in-JS overrides.
- Watch for: Ant's config-object APIs (Table columns, Form rules) are
  *data/logic*, not JSX — the presentation-only rule means the Compass swap
  keeps those objects intact and only re-skins; if a Compass equivalent needs
  structural JSX where Ant used config objects, that unit's mapping is
  low-confidence by definition -> owner review.

---

## If identification is ambiguous

Two libraries present (e.g. MUI + a few shadcn files), or partial matches:
record ALL candidates in `_baseline.md`, pick the golden pair **per component**
by its import source, and route anything genuinely mixed to
`_needs-decision.md`. Never force a single label onto a mixed repo.
