/**
 * decision-flows.ts — data for the five "Choosing a Component" decision flows
 * (owner-approved structure: .compass-build/design/s2/sop-interactive-structure
 * .PROPOSED.md, approved 2026-07-07).
 *
 * ZERO NEW CONTENT: every option label, leaf answer, and detail quote below is
 * lifted verbatim from stories/working-with-compass/choosing-components.mdx
 * (which itself quotes the named specs — the `source` field on every node and
 * leaf carries that citation). Node questions and structural option labels
 * that only name components are UI labels, not content. Gaps #2 (promotion),
 * #11 (link-vs-ghost) and #12 (sonner) were RESOLVED by owner ruling
 * 2026-07-07 and now render as answers with cited sources; the remaining
 * deferred gaps live as flagged GapCards in the .mdx pages.
 *
 * ENFORCEMENT: decision-flow.tsx validates these flows at module load and
 * THROWS if any node or leaf is missing its `source` field.
 */

export interface FlowOption {
  /** Verbatim table row / quoted rule from choosing-components.mdx, or a
   *  structural UI label that only names components. */
  label: string
  /** id of the next node or leaf in `steps`. */
  to: string
}

export interface FlowNode {
  kind: "node"
  id: string
  /** Short UI-label question (structure only — the content is in the options). */
  question: string
  /** Optional verbatim quote from the source that decides this node. */
  detail?: string
  options: FlowOption[]
  /** MANDATORY citation — decision-flow.tsx throws at module load without it. */
  source: string
}

export interface FlowLeaf {
  kind: "leaf"
  id: string
  /** The answer (component name or quoted action). */
  title: string
  /** kebab-case components/ui name — resolves the Storybook docs link. */
  component?: string
  /** Optional verbatim supporting quote. */
  detail?: string
  /** Owner-flagged gap text (verbatim from the existing ⚠ blocks / the
   *  approved structure doc's flagged-gaps list). Renders the distinct
   *  "⚠ Needs owner decision" treatment. */
  gap?: string
  /** MANDATORY citation — decision-flow.tsx throws at module load without it. */
  source: string
}

export type FlowStep = FlowNode | FlowLeaf

export interface DecisionFlowData {
  id: string
  /** UI label (flow names from the approved structure doc). */
  title: string
  start: string
  steps: Record<string, FlowStep>
  source: string
}

/* ────────────────────────────────────────────────────────────────────────────
 * Flow 1 — Selection control
 * Derived from: checkbox.md, switch.md, radio-group.md, select.md and
 * dropdown-menu.md "When to use" tables/rules as quoted on Choosing a
 * Component. Gap #11 (link vs ghost) RESOLVED (owner ruling 2026-07-07):
 * promotes button.md:182-189's color rule as the general link-vs-ghost rule.
 * ──────────────────────────────────────────────────────────────────────────── */

export const selectionControlFlow: DecisionFlowData = {
  id: "selection-control",
  title: "Selection control",
  start: "intent",
  source:
    ".claude/specs/components/{checkbox,switch,radio-group,select,dropdown-menu}.md — via Choosing a Component",
  steps: {
    intent: {
      kind: "node",
      id: "intent",
      question: "Triggering an action, or choosing a value?",
      detail:
        "“The key distinction: DropdownMenu is for triggering actions; Select is for choosing a value.”",
      source:
        ".claude/specs/components/dropdown-menu.md §“When to use DropdownMenu vs Select vs other components” — table verbatim",
      options: [
        {
          label:
            "List of actions triggered from a button (Edit, Delete, Export)",
          to: "leaf-dropdown-menu",
        },
        { label: "Selecting a value for a form field", to: "value-kind" },
        {
          label: "When is an action a text link vs a ghost button?",
          to: "leaf-gap-link-vs-ghost",
        },
      ],
    },
    "value-kind": {
      kind: "node",
      id: "value-kind",
      question: "Which situation matches?",
      source:
        ".claude/specs/components/checkbox.md §“When to use Checkbox vs Switch vs RadioGroup” — table verbatim",
      options: [
        {
          label:
            "One or more independent options in a form (submitted on Save)",
          to: "leaf-checkbox",
        },
        {
          label: "A single setting that takes effect immediately on toggle",
          to: "leaf-switch",
        },
        {
          label: "Selecting exactly one option from a mutually exclusive set",
          to: "one-of-set",
        },
        {
          label: "“Select all” with child selections",
          to: "leaf-checkbox-indeterminate",
        },
      ],
    },
    "one-of-set": {
      kind: "node",
      id: "one-of-set",
      question: "Can the whole set be shown at once?",
      detail:
        "“RadioGroup is for choosing exactly one option from a visible set. If the set is too long to show all at once, use Select instead.”",
      source:
        ".claude/specs/components/radio-group.md §“When to use RadioGroup vs Checkbox vs Select” — “the key rule” quoted",
      options: [
        {
          label: "Choosing exactly one option from a visible set",
          to: "leaf-radio-group",
        },
        {
          label: "The set is too long to show all at once",
          to: "list-pick",
        },
      ],
    },
    "list-pick": {
      kind: "node",
      id: "list-pick",
      question: "Select or Combobox?",
      detail:
        "“Select is for fixed, short option sets. When in doubt about list length, default to Select — it's simpler to implement and sufficient for most Acko form fields.”",
      source:
        ".claude/specs/components/select.md §“When to use Select vs Combobox” — table verbatim; closing sentence quoted",
      options: [
        {
          label: "Short list (≤15 items), user picks from fixed options",
          to: "leaf-select",
        },
        {
          label: "Long list (15+ items) or user may type to search",
          to: "leaf-combobox",
        },
        {
          label: "User needs to pick multiple items",
          to: "leaf-combobox-multi",
        },
        {
          label: "Options are dynamic or fetched from API",
          to: "leaf-combobox",
        },
      ],
    },
    "leaf-dropdown-menu": {
      kind: "leaf",
      id: "leaf-dropdown-menu",
      title: "DropdownMenu",
      component: "dropdown-menu",
      detail:
        "Single-level action list with 2–5 items; actions with sub-menus or groupings; right-click context actions on an element (triggered programmatically).",
      source:
        ".claude/specs/components/dropdown-menu.md §“When to use DropdownMenu vs Select vs other components” — table verbatim",
    },
    "leaf-gap-link-vs-ghost": {
      kind: "leaf",
      id: "leaf-gap-link-vs-ghost",
      title: "Text link vs ghost button",
      component: "button",
      detail:
        "Choose by color (button.md's color-based rule, promoted to the general rule): primary/purple-colored navigational text → “variant=\"link\"” (with “render={<Link href=\"...\" />}” when it routes); foreground-colored (gray, low-emphasis) inline action → “variant=\"ghost\" size=\"sm\"”. For ghost here, accept the subtle hover background — it is intentional; do not override it.",
      source:
        ".claude/specs/components/button.md:182-189 — color-based rule for an inline text action (primary/navigational → link; foreground/low-emphasis → ghost size=\"sm\")",
    },
    "leaf-checkbox": {
      kind: "leaf",
      id: "leaf-checkbox",
      title: "Checkbox",
      component: "checkbox",
      detail:
        "“If it's a form field that's confirmed when the user clicks Save/Continue, use Checkbox.” Also: Terms & conditions / consent → Checkbox.",
      source:
        ".claude/specs/components/checkbox.md — table verbatim; .claude/specs/components/switch.md §“When to use Switch vs Checkbox” — “the decisive rule” quoted",
    },
    "leaf-checkbox-indeterminate": {
      kind: "leaf",
      id: "leaf-checkbox-indeterminate",
      title: "Checkbox (indeterminate state)",
      component: "checkbox",
      source:
        ".claude/specs/components/checkbox.md §“When to use Checkbox vs Switch vs RadioGroup” — table verbatim",
    },
    "leaf-switch": {
      kind: "leaf",
      id: "leaf-switch",
      title: "Switch",
      component: "switch",
      detail:
        "“If toggling it should immediately change something in the app (no form submit), use Switch.”",
      source:
        ".claude/specs/components/switch.md §“When to use Switch vs Checkbox” — “the decisive rule” quoted",
    },
    "leaf-radio-group": {
      kind: "leaf",
      id: "leaf-radio-group",
      title: "RadioGroup",
      component: "radio-group",
      detail:
        "“RadioGroup is for choosing exactly one option from a visible set.”",
      source:
        ".claude/specs/components/radio-group.md §“When to use RadioGroup vs Checkbox vs Select” — “the key rule” quoted",
    },
    "leaf-select": {
      kind: "leaf",
      id: "leaf-select",
      title: "Select",
      component: "select",
      detail:
        "Options are fixed and known at design time → Select. “When in doubt about list length, default to Select.”",
      source:
        ".claude/specs/components/select.md §“When to use Select vs Combobox” — table verbatim; closing sentence quoted",
    },
    "leaf-combobox": {
      kind: "leaf",
      id: "leaf-combobox",
      title: "Combobox",
      component: "combobox",
      detail:
        "Long list (15+ items), user may type to search, or options are dynamic or fetched from API.",
      source:
        ".claude/specs/components/select.md §“When to use Select vs Combobox” — table verbatim",
    },
    "leaf-combobox-multi": {
      kind: "leaf",
      id: "leaf-combobox-multi",
      title: "Combobox (multi) or Checkbox group",
      component: "combobox",
      source:
        ".claude/specs/components/select.md §“When to use Select vs Combobox” — table verbatim",
    },
  },
}

/* ────────────────────────────────────────────────────────────────────────────
 * Flow 2 — Overlay
 * Derived from: sheet.md table, dialog.md / drawer.md / sheet.md quoted
 * distinctions, popover.md "Popover vs HoverCard vs Tooltip" table.
 * ──────────────────────────────────────────────────────────────────────────── */

export const overlayFlow: DecisionFlowData = {
  id: "overlay",
  title: "Overlay",
  start: "trigger",
  source:
    ".claude/specs/components/{sheet,dialog,drawer,popover}.md — via Choosing a Component",
  steps: {
    trigger: {
      kind: "node",
      id: "trigger",
      question: "How is it triggered, and how big is it?",
      source:
        ".claude/specs/components/popover.md §“What Popover is” — “Popover vs HoverCard vs Tooltip” table verbatim; .claude/specs/components/sheet.md §“When to use Sheet vs Dialog vs Drawer” — table verbatim",
      options: [
        { label: "Hover", to: "hover-kind" },
        {
          label: "Click — interactive content (forms, pickers, filters)",
          to: "leaf-popover",
        },
        {
          label: "A panel over the page: Sheet / Dialog / Drawer / AlertDialog",
          to: "panel-kind",
        },
      ],
    },
    "hover-kind": {
      kind: "node",
      id: "hover-kind",
      question: "What does it show?",
      source:
        ".claude/specs/components/popover.md §“What Popover is” — “Popover vs HoverCard vs Tooltip” table verbatim",
      options: [
        { label: "Short text only, non-interactive", to: "leaf-tooltip" },
        { label: "Rich read-only preview", to: "leaf-hover-card" },
      ],
    },
    "panel-kind": {
      kind: "node",
      id: "panel-kind",
      question: "Which situation matches?",
      source:
        ".claude/specs/components/sheet.md §“When to use Sheet vs Dialog vs Drawer” — table verbatim",
      options: [
        {
          label: "Full-height side panel with detailed content or a form",
          to: "leaf-sheet",
        },
        {
          label:
            "Compact confirmation or short form in the center of the screen",
          to: "center-kind",
        },
        {
          label: "Mobile-optimised bottom panel (snap points, touch-friendly)",
          to: "leaf-drawer",
        },
        { label: "Navigation sidebar on mobile", to: "leaf-sidebar" },
      ],
    },
    "center-kind": {
      kind: "node",
      id: "center-kind",
      question: "Dialog or AlertDialog?",
      detail:
        "“AlertDialog traps focus and prevents closing by clicking the backdrop — it forces the user to make an explicit choice. Dialog allows backdrop-click to close.”",
      source:
        ".claude/specs/components/dialog.md §“When to use which” — key distinction quoted",
      options: [
        {
          label: "Destructive confirmation requiring explicit choice",
          to: "leaf-alert-dialog",
        },
        {
          label:
            "Compact confirmation or short form in the center of the screen",
          to: "leaf-dialog",
        },
      ],
    },
    "leaf-tooltip": {
      kind: "leaf",
      id: "leaf-tooltip",
      title: "Tooltip",
      component: "tooltip",
      detail: "Trigger: hover. Content: short text only, non-interactive.",
      source:
        ".claude/specs/components/popover.md — “Popover vs HoverCard vs Tooltip” table verbatim",
    },
    "leaf-hover-card": {
      kind: "leaf",
      id: "leaf-hover-card",
      title: "HoverCard",
      component: "hover-card",
      detail: "Trigger: hover. Content: rich read-only preview.",
      source:
        ".claude/specs/components/popover.md — “Popover vs HoverCard vs Tooltip” table verbatim",
    },
    "leaf-popover": {
      kind: "leaf",
      id: "leaf-popover",
      title: "Popover",
      component: "popover",
      detail:
        "Trigger: click. Content: interactive content (forms, pickers, filters).",
      source:
        ".claude/specs/components/popover.md — “Popover vs HoverCard vs Tooltip” table verbatim",
    },
    "leaf-sheet": {
      kind: "leaf",
      id: "leaf-sheet",
      title: "Sheet",
      component: "sheet",
      detail:
        "“Sheet is for tasks that need more space than a Dialog but shouldn't navigate away from the current page — editing a record, viewing details, multi-step forms, filters/configuration panels.”",
      source:
        ".claude/specs/components/sheet.md §“When to use Sheet vs Dialog vs Drawer” — closing sentence quoted",
    },
    "leaf-drawer": {
      kind: "leaf",
      id: "leaf-drawer",
      title: "Drawer",
      component: "drawer",
      detail:
        "“Drawer is optimised for touch — it has a visible drag handle, momentum-based dismissal, and snap points. Sheet is a keyboard/pointer panel suited for desktop workflows.”",
      source:
        ".claude/specs/components/drawer.md §“When to use Drawer vs Sheet” — key distinction quoted",
    },
    "leaf-sidebar": {
      kind: "leaf",
      id: "leaf-sidebar",
      title: "Sidebar (uses Sheet internally)",
      component: "sidebar",
      source:
        ".claude/specs/components/sheet.md §“When to use Sheet vs Dialog vs Drawer” — table verbatim",
    },
    "leaf-dialog": {
      kind: "leaf",
      id: "leaf-dialog",
      title: "Dialog",
      component: "dialog",
      detail: "“Dialog allows backdrop-click to close.”",
      source:
        ".claude/specs/components/dialog.md §“When to use which” — key distinction quoted; .claude/specs/components/sheet.md — table verbatim",
    },
    "leaf-alert-dialog": {
      kind: "leaf",
      id: "leaf-alert-dialog",
      title: "AlertDialog",
      component: "alert-dialog",
      detail:
        "“AlertDialog traps focus and prevents closing by clicking the backdrop — it forces the user to make an explicit choice.”",
      source:
        ".claude/specs/components/dialog.md §“When to use which” — key distinction quoted; .claude/specs/components/sheet.md — table verbatim",
    },
  },
}

/* ────────────────────────────────────────────────────────────────────────────
 * Flow 3 — Feedback
 * Derived from: alert.md "When to use Alert vs other feedback components"
 * table. Gap #12 RESOLVED (owner ruling 2026-07-07): resolves to Sonner and
 * points at the now-authored .claude/specs/components/sonner.md.
 * ──────────────────────────────────────────────────────────────────────────── */

export const feedbackFlow: DecisionFlowData = {
  id: "feedback",
  title: "Feedback",
  start: "situation",
  source:
    ".claude/specs/components/alert.md §“When to use Alert vs other feedback components” — table verbatim",
  steps: {
    situation: {
      kind: "node",
      id: "situation",
      question: "Which situation matches?",
      source:
        ".claude/specs/components/alert.md §“When to use Alert vs other feedback components” — table verbatim",
      options: [
        {
          label: "Persistent status message visible in the page",
          to: "leaf-alert",
        },
        {
          label:
            "Transient confirmation that disappears after a few seconds",
          to: "leaf-sonner",
        },
        {
          label:
            "Blocking confirmation requiring an explicit user choice",
          to: "leaf-alert-dialog",
        },
        { label: "Badge / FieldError", to: "label-or-error" },
      ],
    },
    "label-or-error": {
      kind: "node",
      id: "label-or-error",
      question: "Which situation matches?",
      source:
        ".claude/specs/components/alert.md §“When to use Alert vs other feedback components” — table verbatim",
      options: [
        {
          label: "Status label on a record (Active, Expired)",
          to: "leaf-badge",
        },
        {
          label: "Input validation error below a field",
          to: "leaf-field-error",
        },
      ],
    },
    "leaf-alert": {
      kind: "leaf",
      id: "leaf-alert",
      title: "Alert",
      component: "alert",
      source:
        ".claude/specs/components/alert.md §“When to use Alert vs other feedback components” — table verbatim",
    },
    "leaf-sonner": {
      kind: "leaf",
      id: "leaf-sonner",
      title: "Toast/Sonner",
      component: "sonner",
      detail:
        "A transient success confirmation that disappears after a few seconds → Toast/Sonner. Build it per the Sonner spec.",
      source:
        ".claude/specs/components/alert.md:33 — row “Transient confirmation that disappears after a few seconds → Toast/Sonner”; usage/API per .claude/specs/components/sonner.md",
    },
    "leaf-alert-dialog": {
      kind: "leaf",
      id: "leaf-alert-dialog",
      title: "AlertDialog",
      component: "alert-dialog",
      source:
        ".claude/specs/components/alert.md §“When to use Alert vs other feedback components” — table verbatim",
    },
    "leaf-badge": {
      kind: "leaf",
      id: "leaf-badge",
      title: "Badge",
      component: "badge",
      source:
        ".claude/specs/components/alert.md §“When to use Alert vs other feedback components” — table verbatim",
    },
    "leaf-field-error": {
      kind: "leaf",
      id: "leaf-field-error",
      title: "FieldError (in the Field system)",
      component: "field",
      source:
        ".claude/specs/components/alert.md §“When to use Alert vs other feedback components” — table verbatim",
    },
  },
}

/* ────────────────────────────────────────────────────────────────────────────
 * Flow 4 — Text input
 * Derived from: input.md "Input vs Textarea" table and field.md "When to use
 * Field vs standalone Label + Input" table.
 * ──────────────────────────────────────────────────────────────────────────── */

export const textInputFlow: DecisionFlowData = {
  id: "text-input",
  title: "Text input",
  start: "shape",
  source:
    ".claude/specs/components/input.md §“Input vs Textarea”; .claude/specs/components/field.md §“When to use Field vs standalone Label + Input” — tables verbatim",
  steps: {
    shape: {
      kind: "node",
      id: "shape",
      question: "Which situation matches?",
      source:
        ".claude/specs/components/input.md §“Input vs Textarea” — table verbatim",
      options: [
        { label: "Single-line text", to: "leaf-input" },
        {
          label: "Multi-line text (comments, descriptions)",
          to: "leaf-textarea",
        },
        { label: "Figma shows a tall text box", to: "leaf-textarea" },
        {
          label: "Field system vs standalone Label + Input",
          to: "field-or-standalone",
        },
      ],
    },
    "field-or-standalone": {
      kind: "node",
      id: "field-or-standalone",
      question: "Which situation matches?",
      detail:
        "“Rule of thumb: If you need error messages or description text, use Field. If it's a simple card-level form (2–3 fields, no validation UI), use standalone Label + Input pairs.”",
      source:
        ".claude/specs/components/field.md §“When to use Field vs standalone Label + Input” — table verbatim; rule of thumb quoted",
      options: [
        {
          label: "Full form with validation, help text, and errors",
          to: "leaf-field-system",
        },
        {
          label: "Simple 1–2 inputs inside a Card (login form, search)",
          to: "leaf-standalone",
        },
        {
          label: "Group of related checkboxes or radio buttons",
          to: "leaf-fieldset",
        },
        {
          label: "Settings page with horizontal label/input rows",
          to: "leaf-field-horizontal",
        },
      ],
    },
    "leaf-input": {
      kind: "leaf",
      id: "leaf-input",
      title: "Input",
      component: "input",
      source:
        ".claude/specs/components/input.md §“Input vs Textarea” — table verbatim",
    },
    "leaf-textarea": {
      kind: "leaf",
      id: "leaf-textarea",
      title: "Textarea",
      component: "textarea",
      detail:
        "Multi-line text (comments, descriptions); Figma shows a tall text box.",
      source:
        ".claude/specs/components/input.md §“Input vs Textarea” — table verbatim",
    },
    "leaf-field-system": {
      kind: "leaf",
      id: "leaf-field-system",
      title: "Field system",
      component: "field",
      detail:
        "“If you need error messages or description text, use Field.”",
      source:
        ".claude/specs/components/field.md §“When to use Field vs standalone Label + Input” — table verbatim; rule of thumb quoted",
    },
    "leaf-standalone": {
      kind: "leaf",
      id: "leaf-standalone",
      title: "Standalone Label + Input in a div",
      component: "label",
      detail:
        "“If it's a simple card-level form (2–3 fields, no validation UI), use standalone Label + Input pairs.”",
      source:
        ".claude/specs/components/field.md §“When to use Field vs standalone Label + Input” — table verbatim; rule of thumb quoted",
    },
    "leaf-fieldset": {
      kind: "leaf",
      id: "leaf-fieldset",
      title: "FieldSet + FieldLegend",
      component: "field",
      source:
        ".claude/specs/components/field.md §“When to use Field vs standalone Label + Input” — table verbatim",
    },
    "leaf-field-horizontal": {
      kind: "leaf",
      id: "leaf-field-horizontal",
      title: "Field orientation=“horizontal”",
      component: "field",
      detail:
        "Mobile-first form that goes horizontal at a breakpoint → Field orientation=“responsive”.",
      source:
        ".claude/specs/components/field.md §“When to use Field vs standalone Label + Input” — table verbatim",
    },
  },
}

/* ────────────────────────────────────────────────────────────────────────────
 * Flow 5 — Compose vs request new
 * Derived from: CLAUDE.md spec-files rule, principles.md #1/#4,
 * generate-code.md Step 2 STOP rule, designers.md request path, and the
 * roadmap §S6 promotion pipeline — all as quoted on Choosing a Component.
 * The promotion leaf carries the standing promotion-threshold gap.
 * ──────────────────────────────────────────────────────────────────────────── */

export const composeVsRequestNewFlow: DecisionFlowData = {
  id: "compose-vs-request-new",
  title: "Compose vs request new",
  start: "spec-exists",
  source:
    "CLAUDE.md; .claude/principles.md; .claude/skills/generate-code.md; .claude/designers.md; Compass_GA_Roadmap.md §S6 — via Choosing a Component",
  steps: {
    "spec-exists": {
      kind: "node",
      id: "spec-exists",
      question: "Does a spec cover it?",
      source:
        "CLAUDE.md §“Spec files” — “If a component spec exists in .claude/specs/components/, follow it exactly.”; generate-code.md “Before you start” #2",
      options: [
        {
          label: "A component spec exists in .claude/specs/components/",
          to: "leaf-follow-spec",
        },
        { label: "No spec exists", to: "leaf-default-api" },
        {
          label: "The system doesn't have what you need",
          to: "extend",
        },
      ],
    },
    extend: {
      kind: "node",
      id: "extend",
      question: "Extend the system — how?",
      detail:
        "“If the system doesn't have what you need, that's a signal to extend the system, not work around it.” “The primitives are a closed set — tightly specified, owned by CODEOWNERS review, not modified casually. But composition is open — any combination of existing primitives into layouts, patterns, and pages is encouraged.”",
      source:
        ".claude/principles.md #1 “System over invention” and #4 “Closed set, open composition” — quoted",
      options: [
        { label: "For a custom or complex layout", to: "leaf-compose" },
        {
          label:
            "A Figma element doesn't map to any existing component",
          to: "leaf-stop",
        },
        { label: "To request a new component", to: "leaf-request" },
        {
          label: "When a pattern earns promotion into Compass",
          to: "leaf-promotion",
        },
      ],
    },
    "leaf-follow-spec": {
      kind: "leaf",
      id: "leaf-follow-spec",
      title: "Follow it exactly",
      detail:
        "“If a component spec exists in .claude/specs/components/, follow it exactly.”",
      source:
        "CLAUDE.md §“Spec files” — quoted verbatim",
    },
    "leaf-default-api": {
      kind: "leaf",
      id: "leaf-default-api",
      title: "Default shadcn/ui API with Compass tokens",
      detail:
        "“If no spec exists, use the component's default shadcn/ui API with Compass tokens.”",
      source:
        ".claude/skills/generate-code.md “Before you start” #2 — quoted verbatim",
    },
    "leaf-compose": {
      kind: "leaf",
      id: "leaf-compose",
      title: "First, compose",
      detail:
        "“Compose from existing primitives. Use div with Tailwind flex/grid for layout. Do not create wrapper components for one-off layouts.”",
      source:
        ".claude/skills/generate-code.md Step 2 — quoted verbatim",
    },
    "leaf-stop": {
      kind: "leaf",
      id: "leaf-stop",
      title: "The AI must STOP and ask",
      detail:
        "“This would create a new primitive component called [exact name]. It would handle [specific responsibility]. Should I proceed, or should I compose this from existing parts?” — and wait for explicit, named confirmation.",
      source:
        ".claude/skills/generate-code.md Step 2 STOP rule — quoted verbatim",
    },
    "leaf-request": {
      kind: "leaf",
      id: "leaf-request",
      title: "Request a new component",
      detail:
        "Design it using existing Compass tokens, flag it as “new component proposal” in the design file, and bring it to the next design system review — “don't build one-offs in product files.” The rule: “No new component in components/ui/ without owner review.”",
      source:
        ".claude/designers.md §“How to request a new component” — the 3 steps",
    },
    "leaf-promotion": {
      kind: "leaf",
      id: "leaf-promotion",
      title: "Promotion pipeline (roadmap S6)",
      detail:
        "A pattern earns promotion review when the drift-hotspot detector flags it — there is NO fixed numeric count. Detect clusters {component, rule} hotspots across distinct builds (a hotspot at ≥ rubric.detect.hotspotMinBuilds); coverage is demand-driven, added “when the audit/drift signal says so, not front-loaded.” Promotion then runs one guided flow that “generates: component + spec + meta.ts + story + Code Connect stub + passing audit,” with owner approval and a version bump.",
      source:
        ".claude/skills/compass-audit/SKILL.md §Detect — hotspot at ≥ rubric.detect.hotspotMinBuilds; Compass_GA_Roadmap.md:283-284 §S6.3 — demand-driven coverage",
    },
  },
}

export const allDecisionFlows: DecisionFlowData[] = [
  selectionControlFlow,
  overlayFlow,
  feedbackFlow,
  textInputFlow,
  composeVsRequestNewFlow,
]
