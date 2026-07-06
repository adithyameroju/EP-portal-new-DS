# S2 — Storybook Foundations + Infrastructure lane (append-only log)

Lane owner: this agent owns **foundations + infra** for S2 — `.storybook/`
(sole agent allowed to touch it this session), `stories/foundations/`, and
`stories/Principles.mdx`. `stories/components/` belongs to another agent;
`components/`, `scripts/`, `app/`, `package.json` untouched.

---

- **2026-07-07 — session start.** Read Compass_GA_Roadmap.md (S2), STATE.md
  (incl. DECISION LOG + standing gates), CLAUDE.md, all 6 foundation specs,
  `.claude/principles.md`, token package
  (`node_modules/@acko/enterprise-tokens/globals.css`, v1.0.0 from Nexus),
  `scripts/token-audit.mjs` (scans .tsx/.ts/.jsx/.js/.css incl. `stories/`;
  MDX not scanned — rules applied there anyway), `.storybook/main.ts` +
  `preview.ts`, `app/fonts.css` (Euclid @font-face, weights 300–700 + italics).

- **2026-07-07 — plan for this lane (mechanical, all derived from tokens/specs):**
  1. `.storybook/preview.ts` — extend storySort to full taxonomy
     (Introduction → Foundations → Atoms → Molecules → Organisms → Patterns;
     existing entries kept).
  2. `stories/foundations/` — 6 MDX pages (Color, Typography, Spacing, Radius,
     Elevation, Motion), each backed by a `.tsx` blocks file (so tsc + audit
     scan the rendering code). Swatches/scales render **live CSS vars /
     Tailwind token classes** from `@acko/enterprise-tokens`; names, groups,
     and usage strings quoted from `.claude/specs/foundations/*`.
  3. Every foundations page carries the owner-mandated UNVERIFIED banner:
     "Token source: @acko/enterprise-tokens@1.0.0 (Nexus) — pending FE-dev
     verification against latest local copy."
  4. `stories/Principles.mdx` — title "Introduction/Design Principles",
     transcludes `.claude/principles.md` live via Vite `?raw` import +
     addon-docs `<Markdown>` block (no copied/authored prose).
  5. Verify: `npm run build-storybook`, `npm run audit` (0 errors),
     `npx tsc --noEmit`.

- **2026-07-07 — mechanical derivation notes (flags, not decisions):**
  - Spec `color.md` lists alpha tokens (`alpha-5…90`) and `--ring-offset`;
    **neither exists in the published token package** — pages render only
    vars that exist in the live layer, so these are listed as
    "documented in spec, not present in @acko/enterprise-tokens@1.0.0"
    rather than faked. → surfaced for owner/FE-dev with the UNVERIFIED gate.
  - Typography spec lists weight tokens 100–900; self-hosted Euclid faces
    cover 300–700 (+italics). Page states this factually; weights outside
    300–700 render browser-synthesized.

---

# S2 — COMPONENT DOCS lane (separate agent)

Lane owner: this agent owns **`stories/components/`** — the shared
meta-driven doc renderer (`meta-doc-blocks.tsx`) + the 10 code-connect-mapped
component stories (S2.3 pattern-setters). Does NOT touch `.storybook/`
(trusts the infra lane's storySort; titles coordinate via `meta.category`
plurals: Atoms/Molecules/Organisms/Templates/Patterns), `stories/foundations/`,
`components/`, `scripts/`, `package.json`.

- **2026-07-07 — session start (component-docs).** Read roadmap S2.3, STATE.md
  (expanded-autonomy grant covers meta-driven doc pages + variant galleries;
  authored prose stays propose-first), CLAUDE.md, `_meta-schema.ts`,
  `_meta-index.ts`, the 10 meta files, and the 10 specs' "Common patterns"
  sections. token-audit.mjs scans `stories/` (.tsx) — semantic tokens only.
- **Plan:** `stories/components/meta-doc-blocks.tsx` — mechanical renderer of
  the S2.3 page structure (purpose → when-to-use/when-not → variants (+gallery)
  → do's & don'ts → tokens → a11y → AI hints → parent/child → version+status).
  Zero authored prose: every rendered string is a meta field value, a
  `_meta-schema.ts` field name, or a roadmap-S2.3 structure label; empty
  fields render "Not documented yet". Then 10 `<name>.stories.tsx` with
  titles `<CategoryPlural>/<Name>` from `meta.category`, autodocs pages via
  the shared renderer, and variant galleries driven by meta variant axes +
  each component's OWN spec "Common patterns" examples (provenance-clean,
  simplified only to be self-contained).

- **2026-07-07 — BUILT + VERIFIED (component-docs lane).** Files created:
  `stories/components/meta-doc-blocks.tsx` + 10 stories: button (Atoms),
  input (Atoms), card/select/field/tabs (Molecules), dialog/table/sheet/
  sidebar (Organisms). Verification evidence:
  - `npm run build-storybook` ✅ (index: 10 docs pages + 42 gallery stories,
    all under Atoms/Molecules/Organisms per meta.category).
  - Playwright smoke on the static build: 5 sampled docs pages
    (button/card/dialog/sidebar/field) render the full S2.3 structure with
    0 console/page errors; screenshot of Atoms/Button archived in session.
  - `npx tsc --noEmit` ✅ 0 errors. `npm run audit` ✅ 0 errors / 34 warnings
    / 17 files = exact pre-existing baseline (stories contribute zero).

- **2026-07-07 — GENERATION NOTE for the remaining 45 (next session):**
  **Generic (zero per-component work — reuse as-is):**
  - `meta-doc-blocks.tsx` handles the entire docs page from any ComponentMeta:
    purpose, when-to-use/when-not (selectionCriteria + useCases / confusedWith),
    variants table, gallery slot, do's & don'ts (wrong/instead + small source
    citation), tokens, a11y, AI hints (compositionRules + source), parent/child
    links (resolved via componentMetaIndex), status badges (category/specStatus/
    codeConnectStatus/version/primitiveSource + specPath citation). Empty
    fields → "Not documented yet" everywhere.
  - Per-file boilerplate is mechanical: title literal `<CategoryPlural>/<Pascal>`
    from meta.category (CSF requires a static string — cannot be computed;
    `storyTitle()` in meta-doc-blocks is the canonical derivation, keep them
    in sync), `tags:["autodocs"]`, `parameters.docs.page: metaDocsPage(meta)`.
  - Prop-axis galleries are mechanical: `.map()` over `meta.variants[axis].values`
    with a cast to `ComponentProps<typeof X>["prop"]`; label text = the value
    string itself (see button Variant/Size, card Size, select Size,
    field LegendVariant, sidebar MenuButtonVariants).
  **Hand-shaped per component (the parts needing judgment next time):**
  - Composition stories: copy the component's OWN spec "Common patterns"
    examples verbatim; simplifications limited to self-containment —
    (a) spec `{/* ... */}` placeholders filled with the spec's own text-content
    shape (tabs), (b) `next/link` render targets and `<img>` logo dropped in
    Storybook context (sidebar; logo → its alt text), (c) controlled-state
    examples (useState) skipped, (d) spec-less axis values derived from the
    nearest spec pattern and flagged in a comment (sheet side="top").
  - Interactive/overlay composites need Storybook params: `layout:"centered"`
    (dialog, sheet); sidebar needs `layout:"fullscreen"` +
    `docs.story:{inline:false, iframeHeight}` (fixed-position component would
    overlay the docs page).
  - Story wrapper widths (`w-96`/`w-80` on form-ish demos) are the only
    non-spec layout choice — semantic scale values, audit-clean.
  - sidebar.meta.ts has TWO `variant` axes (Sidebar's and SidebarMenuButton's) —
    disambiguated by array position; same pattern may recur in other
    multi-part composites (dropdown-menu, menubar…).
  **Flags for owner / other lanes:**
  - `scripts/token-audit.mjs` does not exclude `storybook-static/` → a fresh
    `build-storybook` output makes `npm run audit` report ~484 false errors.
    Deleted the artifact to restore baseline; spawned a task chip for the S4
    audit lane (one-line EXCLUDE_DIRS fix). Until fixed: delete
    storybook-static/ before auditing.
  - Parent/child links resolve to `/?path=/docs/<slug>--docs`; targets exist
    only for the 10 mapped components until the remaining 45 stories land.
  - buttonMeta.aiHints.confusedWith is empty → Button's "When not" card shows
    "Not documented yet" (correct per meta; noting since Button is the
    flagship page).
