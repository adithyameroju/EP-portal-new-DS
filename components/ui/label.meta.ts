import type { ComponentMeta } from "./_meta-schema"

export const labelMeta: ComponentMeta = {
  name: "label",
  category: "atom",
  purpose:
    "A thin wrapper around the native HTML label element that applies consistent typography (text-sm font-medium leading-none) and automatic disabled-state dimming — no variants, no size props, no sub-components.",
  useCases: [
    "Form field label connected to an Input via htmlFor/id",
    "Label paired with a disabled input, auto-dimming via the peer selector",
    "Label with an inline icon before the text (built-in flex gap-2 layout)",
    "Simple one-off pairings with checkboxes, switches, or toggle groups",
  ],
  antiPatterns: [
    {
      wrong: "Render a Label without htmlFor pointing at its control's id",
      instead:
        "Always connect Label to its control via htmlFor/id; a label that is not programmatically associated with an input is inaccessible",
      source: "spec:.claude/specs/components/label.md#rules-for-llms",
    },
    {
      wrong: "Add text-sm or font-medium classes to Label",
      instead:
        "They are already applied; adding them again does nothing but creates noise",
      source: "spec:.claude/specs/components/label.md#rules-for-llms",
    },
    {
      wrong: "Add className opacity-50 to a Label inside a Field",
      instead:
        "The Field's group context handles dimming automatically when the field is disabled; only add opacity-50 for standalone label + disabled input patterns where the input appears after the label in DOM order",
      source: "spec:.claude/specs/components/label.md#rules-for-llms",
    },
    {
      wrong: "Use raw Label for form fields inside a Field",
      instead:
        "Use FieldLabel inside a Field — it adds the correct htmlFor binding and field context; raw Label is for simple one-off pairings",
      source: "spec:.claude/specs/components/label.md#rules-for-llms",
    },
    {
      wrong: "Use the raw HTML label element directly",
      instead:
        "Always import and use Label from components/ui/label; the raw element lacks the consistent styling and disabled-state behaviour",
      source: "spec:.claude/specs/components/label.md#rules-for-llms",
    },
    {
      wrong:
        "Add text size overrides (text-xs, text-base, text-lg) to Label",
      instead:
        "Label has no size variants; text-sm is always correct",
      source: "spec:.claude/specs/components/label.md#rules-for-llms",
    },
  ],
  variants: [],
  sizes: [],
  parentComponents: ["field"],
  childComponents: [],
  tokens: [],
  a11y: [
    "Must be programmatically associated with its control via htmlFor matching the control's id",
    "Auto-dims when the paired input is disabled via peer-disabled (the input must come before the label in DOM order for the peer selector to work) or via the Field group context (group-data-disabled)",
    "Pointer events are disabled and cursor set to not-allowed for disabled peers, preventing misleading interaction",
    "Text is select-none so click-to-focus behaviour is not disrupted by accidental text selection",
  ],
  aiHints: {
    selectionCriteria: [
      "Use Label for simple one-off control pairings (checkboxes, switches, toggle groups) and simple card forms",
      "Prefer FieldLabel (from the Field component) over raw Label when building form fields with descriptions or error states",
    ],
    confusedWith: [
      {
        component: "field",
        disambiguation:
          "FieldLabel (from the Field system) is the right label inside a Field — it adds field context; raw Label is for simple standalone pairings",
      },
    ],
    compositionRules: [
      "Standard pattern: Label with htmlFor above its Input (matching id) inside a grid gap-1.5 wrapper",
      "For standalone disabled inputs, the input must come before the label in DOM order for auto-dimming; if the label comes first, add opacity-50 manually",
      "Label's built-in flex items-center gap-2 handles an icon before the text — no extra wrapper needed",
      "Inside a Field, use FieldLabel instead; disabled dimming is then handled regardless of DOM order",
    ],
    source: ".claude/specs/components/label.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/label.md",
  codeConnectStatus: "not-planned",
  primitiveSource: "native",
  version: "1.0.0",
}
