import type { ComponentMeta } from "./_meta-schema"

export const comboboxMeta: ComponentMeta = {
  name: "combobox",
  category: "organism",
  purpose:
    "A searchable select built on Base UI's Combobox — an input field with a filtered option popup, offering a standard single-input mode and a chips mode for multi-select with removable tags.",
  useCases: [
    "Searchable single-select for long option lists (15 or more options)",
    "Multi-select with removable chip tags (chips mode)",
    "Free-text entry that also suggests options",
    "Grouped, filterable options with headings and separators",
    "Select inside a Field with label and error (add a full-width className on ComboboxInput)",
  ],
  antiPatterns: [
    {
      wrong: "Omit ComboboxEmpty from the popup",
      instead:
        "Always include ComboboxEmpty inside ComboboxList — without it the popup appears empty with no feedback when the search yields no results",
      source: "spec:.claude/specs/components/combobox.md#rules-for-llms",
    },
    {
      wrong: "Add a manual checkmark to the selected ComboboxItem",
      instead:
        "Rely on the built-in CheckIcon indicator that ComboboxItem includes automatically",
      source: "spec:.claude/specs/components/combobox.md#rules-for-llms",
    },
    {
      wrong:
        "Build chips mode without wiring an anchor, leaving the popup positioned against the input only",
      instead:
        "Create a ref with useComboboxAnchor, set it as ref on ComboboxChips, and pass it as anchor to ComboboxContent so the popup positions relative to the chip container",
      source: "spec:.claude/specs/components/combobox.md#rules-for-llms",
    },
    {
      wrong: "Use Combobox for a short, static option list",
      instead:
        "Use Select for short static lists; use Combobox when the list has 15+ items or the user needs to type to find an option",
      source: "spec:.claude/specs/components/combobox.md#rules-for-llms",
    },
    {
      wrong:
        "Assume ComboboxInput stretches to fill its container inside a form field",
      instead:
        "ComboboxInput width defaults to w-auto — add a full-width className or a fixed width when inside a form field",
      source: "spec:.claude/specs/components/combobox.md#rules-for-llms",
    },
  ],
  variants: [],
  sizes: [],
  parentComponents: ["button", "input-group"],
  childComponents: [
    "combobox-input",
    "combobox-content",
    "combobox-list",
    "combobox-item",
    "combobox-group",
    "combobox-label",
    "combobox-collection",
    "combobox-empty",
    "combobox-separator",
    "combobox-chips",
    "combobox-chip",
    "combobox-chips-input",
    "combobox-trigger",
    "combobox-value",
  ],
  tokens: [
    "bg-popover",
    "text-popover-foreground",
    "text-muted-foreground",
    "bg-accent",
    "text-accent-foreground",
    "border-input",
    "border-ring",
    "ring-ring/50",
    "border-destructive",
    "bg-muted",
    "text-foreground",
    "bg-border",
  ],
  a11y: [
    "ARIA combobox semantics (listbox popup, option roles, expanded state) are managed by the Base UI Combobox primitive",
    "Always include ComboboxEmpty so a no-results search gives feedback instead of a silent empty popup",
    "The selected option is announced via the built-in ItemIndicator checkmark on ComboboxItem",
  ],
  aiHints: {
    selectionCriteria: [
      "Use Select for 15 or fewer options when no search is needed",
      "Use Combobox when there are 15+ options or the user needs to search/filter",
      "Use Combobox chips mode for multi-select with chip tags",
      "Use Combobox for free-text entry that also suggests options",
      "Use Select for a simple dropdown on a form field",
    ],
    confusedWith: [
      {
        component: "select",
        disambiguation:
          "Select is for short static lists (15 or fewer options, no search); Combobox adds type-to-filter and covers long lists, multi-select chips, and free-text entry with suggestions",
      },
    ],
    compositionRules: [
      "Two documented modes (spec #two-modes): Mode 1 standard single input — ComboboxInput is an input plus chevron trigger all-in-one, with a ComboboxContent popup; Mode 2 chips multi-select — a ComboboxChips tag-input where each selected item becomes a removable ComboboxChip inside the field",
      "Standard mode order: Combobox root > ComboboxInput, then ComboboxContent > ComboboxList containing ComboboxEmpty, ComboboxGroup (ComboboxLabel heading + ComboboxItem options), and ComboboxSeparator between groups",
      "Chips mode: pass multiple to the Combobox root; ComboboxChips holds ComboboxChip tags plus a ComboboxChipsInput for type-in search, and ComboboxContent is anchored to the chips container via useComboboxAnchor (ref on ComboboxChips, anchor on ComboboxContent)",
      "Always include ComboboxEmpty inside ComboboxList",
      "showClear shows a clear button only when a value is selected — use it only when the field should be clearable; showTrigger (default true) controls the chevron button",
    ],
    source: ".claude/specs/components/combobox.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/combobox.md",
  codeConnectStatus: "not-planned",
  primitiveSource: "base-ui",
  version: "1.0.0",
}
