import type { ComponentMeta } from "./_meta-schema"

export const radioGroupMeta: ComponentMeta = {
  name: "radio-group",
  category: "molecule",
  purpose:
    "A group of radio buttons for choosing exactly one option from a visible, mutually exclusive set (2-5 options).",
  useCases: [
    "Mutually exclusive choice among a small visible set (policy type, payment frequency)",
    "Binary agree/decline consent choice",
    "Radio group with a heading inside FieldSet + FieldLegend",
    "Rich options with title and description per option via the Field system",
    "Compact horizontal radio row (status filters)",
    "Error state via aria-invalid when no selection has been made",
  ],
  antiPatterns: [
    {
      wrong: "Render a RadioGroupItem without a paired Label",
      instead:
        "Always pair RadioGroupItem with Label via htmlFor/id — a radio without a label is inaccessible",
      source: "spec:.claude/specs/components/radio-group.md#rules-for-llms",
    },
    {
      wrong: "Omit or reuse value/id across RadioGroupItems",
      instead:
        "Give each RadioGroupItem a unique value (selection state) and id (links to the label)",
      source: "spec:.claude/specs/components/radio-group.md#rules-for-llms",
    },
    {
      wrong:
        "Use a div with a heading above a radio group of three or more related items",
      instead:
        "Use FieldSet + FieldLegend — a semantic fieldset with a legend is the correct grouping",
      source: "spec:.claude/specs/components/radio-group.md#rules-for-llms",
    },
    {
      wrong:
        "Leave the Label at full opacity when its RadioGroupItem is disabled outside a Field",
      instead:
        "Add className=\"opacity-50\" to the Label manually — the same rule as Checkbox",
      source: "spec:.claude/specs/components/radio-group.md#rules-for-llms",
    },
    {
      wrong: "Resize RadioGroupItem with size-5 or w-5 h-5 overrides",
      instead:
        "Do not resize — it is fixed at size-4 (16px), the same as Checkbox",
      source: "spec:.claude/specs/components/radio-group.md#rules-for-llms",
    },
    {
      wrong: "Show 6 or more radio buttons in a form",
      instead:
        "Switch to Select when the option count grows — more than 5 radios clutters the form",
      source: "spec:.claude/specs/components/radio-group.md#rules-for-llms",
    },
  ],
  variants: [],
  sizes: [],
  parentComponents: [],
  childComponents: ["radio-group-item"],
  tokens: [
    "border-input",
    "border-primary",
    "bg-primary",
    "text-primary-foreground",
    "bg-primary-foreground",
    "border-ring",
    "ring-ring",
    "border-destructive",
    "ring-destructive",
    "bg-input",
  ],
  a11y: [
    "Pair each RadioGroupItem with a Label via htmlFor/id — a radio without a label is inaccessible",
    "Use FieldSet + FieldLegend for radio groups with a heading (semantic fieldset/legend)",
    "aria-invalid on the group and items renders the destructive border and ring error state",
    "Focus uses a focus-visible ring; disabled items get cursor-not-allowed and reduced opacity",
    "Each item has an enlarged invisible hit area extending beyond the 16px circle (after pseudo-element in source)",
  ],
  aiHints: {
    selectionCriteria: [
      "Use RadioGroup for exactly one option from a mutually exclusive visible set of 2-5 options",
      "Use Checkbox instead for one or more independent options in a form",
      "Use Select instead for exactly one option from a long list (6+ options)",
      "Use Switch instead for a setting that takes effect immediately on toggle",
      "RadioGroup is correct for binary agree/disagree choices",
    ],
    confusedWith: [
      {
        component: "checkbox",
        disambiguation:
          "Checkbox is for one or more independent options; RadioGroup enforces exactly one choice from a mutually exclusive set",
      },
      {
        component: "select",
        disambiguation:
          "Select is for exactly one option from a long list (6+ options) too long to show all at once; RadioGroup shows the full set visibly (2-5 options)",
      },
      {
        component: "switch",
        disambiguation:
          "Switch is a setting that takes effect immediately on toggle; RadioGroup is a form choice submitted with the form",
      },
    ],
    compositionRules: [
      "Compose each option as a flex row wrapper containing RadioGroupItem + Label paired via htmlFor/id — RadioGroup has no layout sub-components of its own",
      "Default layout is a vertical grid (grid gap-2); override with className=\"flex flex-row gap-4\" for horizontal layout",
      "Use FieldSet + FieldLegend for a group heading; use Field orientation=\"horizontal\" + FieldContent + FieldTitle + FieldDescription for options with descriptions",
      "Control selection with value/onValueChange, or defaultValue for uncontrolled groups",
    ],
    source: ".claude/specs/components/radio-group.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/radio-group.md",
  codeConnectStatus: "not-planned",
  primitiveSource: "base-ui",
  version: "1.0.0",
}
