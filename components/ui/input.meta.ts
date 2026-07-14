import type { ComponentMeta } from "./_meta-schema"

export const inputMeta: ComponentMeta = {
  name: "input",
  category: "atom",
  purpose:
    "The styled single-line text input field — a Base UI Input primitive covering all text entry types (text, email, password, number, search, tel, url, date, file) with no built-in icons, prefixes, or suffixes.",
  useCases: [
    "Standalone labelled text field (Label + Input in a gap-1.5 wrapper)",
    "Typed entry fields — email, password, number, search, tel, url, date — via the type attribute",
    "File upload field (type file, with built-in file button styling)",
    "Search input with a left icon composed via a relative wrapper",
    "Amount input with a suffix (e.g. currency code) composed via a relative wrapper",
    "Disabled or read-only display of a non-editable value",
  ],
  antiPatterns: [
    {
      wrong: "Render an Input with only a placeholder and no label",
      instead:
        "Always pair Input with a Label — visible (Label with htmlFor) or invisible (aria-label attribute), no exceptions",
      source: "spec:.claude/specs/components/input.md#rules-for-llms",
    },
    {
      wrong: "Modify input.tsx to add icon, prefix, or suffix slots",
      instead:
        "Compose externally: relative wrapper, absolutely positioned icon (size-4, muted foreground), and padded Input (pl-9 for a left icon, pr-9 for a right icon)",
      source: "spec:.claude/specs/components/input.md#rules-for-llms",
    },
    {
      wrong: "Use type text for email, phone, or number fields",
      instead:
        "Use the correct type attribute (email, tel, number, search, url, date) — it affects mobile keyboards, autofill, and validation",
      source: "spec:.claude/specs/components/input.md#rules-for-llms",
    },
    {
      wrong:
        "Style the error state with a red background or invent a custom error prop",
      instead:
        "Error state is border-destructive on the input plus a destructive-colored error message below it",
      source: "spec:.claude/specs/components/input.md#rules-for-llms",
    },
    {
      wrong: "Set rows on Input or use CSS to make Input look multi-line",
      instead: "Use Textarea for multi-line text",
      source: "spec:.claude/specs/components/input.md#rules-for-llms",
    },
    {
      wrong: "Use placeholder text as the field's label",
      instead:
        "Placeholder disappears on input; it supplements the label and never replaces it",
      source: "spec:.claude/specs/components/input.md#rules-for-llms",
    },
  ],
  variants: [],
  sizes: [],
  parentComponents: ["field", "label", "input-group"],
  childComponents: [],
  tokens: [
    "border-input",
    "text-foreground",
    "text-muted-foreground",
    "border-ring",
    "ring-ring",
    "border-destructive",
    "ring-destructive",
    "bg-input",
  ],
  a11y: [
    "Every Input must have a Label — visible Label with htmlFor matching the Input's id, or an aria-label for icon-only patterns; this is an accessibility requirement, not a style preference",
    "Invalid state styling is driven by aria-invalid (destructive border and ring), applied automatically by validation wiring or set manually",
    "Focus ring appears on focus-visible only; do not customize it",
    "Correct type attributes give mobile users the right keyboard and enable browser autofill and validation",
  ],
  aiHints: {
    selectionCriteria: [
      "Use Input for single-line text entry of any type",
      "Use Textarea instead for multi-line text (comments, descriptions) or when Figma shows a tall text box",
      "Wrap in the Field system (Field + FieldLabel + FieldError) when the form needs validation, help text, or error messages",
      "Use standalone Label + Input pairs for simple 1-2 field card forms",
    ],
    confusedWith: [
      {
        component: "textarea",
        disambiguation:
          "Input is single-line; Textarea is multi-line with the same tokens and styling conventions (border, focus ring, font size, placeholder color)",
      },
    ],
    compositionRules: [
      "Every Input must be paired with a Label: visible Label whose htmlFor matches the Input's id, or an aria-label for hidden-label patterns like icon-only search",
      "Standalone pattern: Label + Input inside a grid gap-1.5 wrapper",
      "Icons/prefixes/suffixes are composed by wrapping — relative container, absolutely positioned and centered icon (size-4, muted foreground color), and adjusted Input padding (pl-9 left icon, pr-9 right icon); never modify input.tsx",
      "Error state: add border-destructive (and a destructive focus ring) via className plus a small destructive-colored message paragraph below the input",
      "File inputs are styled internally by the component — do not add custom file input styling",
    ],
    source: ".claude/specs/components/input.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/input.md",
  codeConnectStatus: "mapped",
  primitiveSource: "base-ui",
  primitiveElements: ["input"],
  version: "1.0.0",
}
