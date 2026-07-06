import type { ComponentMeta } from "./_meta-schema"

export const selectMeta: ComponentMeta = {
  name: "select",
  category: "molecule",
  purpose:
    "A dropdown for picking exactly one option from a short, fixed set of options (15 or fewer items) known at design time.",
  useCases: [
    "Basic select with placeholder (status, state, type fields)",
    "Grouped options with SelectGroup, SelectLabel, and SelectSeparator between groups",
    "Form field select paired with Label (id on SelectTrigger)",
    "Disabled select or individually disabled items (unavailable plans)",
    "Controlled select with value/onValueChange",
    "Compact dropdown in dense UIs, tables, or toolbars via size sm",
  ],
  antiPatterns: [
    {
      wrong: "Render SelectTrigger without SelectValue inside it",
      instead:
        "Always pair SelectTrigger with SelectValue — a trigger without it shows nothing when an item is selected",
      source: "spec:.claude/specs/components/select.md#rules-for-llms",
    },
    {
      wrong: "Put the id for Label pairing on the Select root",
      instead:
        "Put the id on SelectTrigger — Select is a non-DOM root; SelectTrigger is the actual button element",
      source: "spec:.claude/specs/components/select.md#rules-for-llms",
    },
    {
      wrong:
        "Leave SelectTrigger at its default width in a form (w-fit collapses to the placeholder text width)",
      instead:
        "Give SelectTrigger an explicit width: w-full in forms, or a fixed width like w-48 when standalone",
      source: "spec:.claude/specs/components/select.md#rules-for-llms",
    },
    {
      wrong: "Add a chevron icon to SelectTrigger manually",
      instead: "SelectTrigger renders ChevronDownIcon automatically",
      source: "spec:.claude/specs/components/select.md#rules-for-llms",
    },
    {
      wrong: "Add a checkmark to SelectItem manually",
      instead:
        "The selected item indicator (CheckIcon) is built into SelectItem",
      source: "spec:.claude/specs/components/select.md#rules-for-llms",
    },
    {
      wrong: "Use SelectLabel as a standalone heading outside a group",
      instead: "SelectLabel only works inside SelectGroup",
      source: "spec:.claude/specs/components/select.md#rules-for-llms",
    },
    {
      wrong: "Place SelectSeparator between individual items inside a group",
      instead:
        "SelectSeparator goes between two SelectGroup blocks, not inside them",
      source: "spec:.claude/specs/components/select.md#rules-for-llms",
    },
    {
      wrong: "Use Select for boolean Yes/No or On/Off toggles",
      instead: "Binary choices belong in a Switch or Checkbox, not a Select",
      source: "spec:.claude/specs/components/select.md#rules-for-llms",
    },
  ],
  variants: [
    {
      prop: "size",
      values: ["sm", "default"],
      default: "default",
    },
  ],
  sizes: ["sm", "default"],
  parentComponents: [],
  childComponents: [
    "select-trigger",
    "select-value",
    "select-content",
    "select-item",
    "select-group",
    "select-label",
    "select-separator",
    "select-scroll-up-button",
    "select-scroll-down-button",
  ],
  tokens: [
    "border-input",
    "text-muted-foreground",
    "border-ring",
    "ring-ring",
    "border-destructive",
    "ring-destructive",
    "bg-popover",
    "text-popover-foreground",
    "bg-accent",
    "text-accent-foreground",
    "bg-border",
    "bg-input",
    "ring-foreground",
  ],
  a11y: [
    "Put the id for Label pairing on SelectTrigger (the real button element), not on the Select root, so htmlFor connects correctly",
    "aria-invalid on the trigger renders the destructive border and ring error state",
    "The selected item indicator (CheckIcon) and trigger chevron are built in and non-interactive (pointer-events-none)",
    "Scroll up/down arrows render automatically inside SelectContent for overflowing lists",
    "Disabled trigger and disabled items get reduced opacity; disabled items also block pointer events",
  ],
  aiHints: {
    selectionCriteria: [
      "Use Select for a short list (15 or fewer items) of fixed options known at design time",
      "Use Combobox instead for long lists (15+ items), type-to-search, or dynamic/API-fetched options",
      "Use Combobox (multi) or a Checkbox group instead when the user picks multiple items",
      "When in doubt about list length, default to Select — simpler to implement and sufficient for most Acko form fields",
    ],
    confusedWith: [
      {
        component: "combobox",
        disambiguation:
          "Combobox is for long (15+), searchable, or dynamically fetched option lists and multi-select; Select is for short fixed option sets",
      },
      {
        component: "switch",
        disambiguation:
          "Boolean Yes/No or On/Off choices belong in a Switch or Checkbox; Select is for picking one of several fixed options",
      },
    ],
    compositionRules: [
      "Structure: Select (root state) > SelectTrigger (with SelectValue inside) + SelectContent > SelectItem; wrap categorized items in SelectGroup with a SelectLabel, and put SelectSeparator between groups",
      "SelectValue carries the placeholder prop shown when nothing is selected",
      "Chevron on the trigger and CheckIcon on the selected item are built in — never add them manually",
      "Use size=\"sm\" on SelectTrigger for dense UIs, tables, and toolbars; default height matches form inputs",
    ],
    source: ".claude/specs/components/select.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/select.md",
  codeConnectStatus: "mapped",
  primitiveSource: "base-ui",
  version: "1.0.0",
}
