import type { ComponentMeta } from "./_meta-schema"

export const checkboxMeta: ComponentMeta = {
  name: "checkbox",
  category: "atom",
  purpose:
    "A form control for one or more independent options where the user marks a preference that takes effect when the form is submitted (unlike Switch, which applies instantly).",
  useCases: [
    "Independent options in a form, submitted on Save",
    "Terms & conditions / consent confirmation",
    "Checkbox group with FieldSet + FieldLegend (e.g. selecting coverage types)",
    "Controlled checkbox via checked/onCheckedChange",
    "'Select all' pattern with an indeterminate parent checkbox",
    "Error state via aria-invalid, and disabled state",
  ],
  antiPatterns: [
    {
      wrong: "Render a Checkbox without a Label",
      instead:
        "Always pair Checkbox with a Label connected via matching id and htmlFor — an unlabeled checkbox is inaccessible",
      source: "spec:.claude/specs/components/checkbox.md#rules-for-llms",
    },
    {
      wrong:
        "Group related checkboxes in a plain div with a heading",
      instead:
        "Three or more related checkboxes belong in FieldSet with FieldLegend (a real fieldset/legend); a div with a heading is not semantically correct",
      source: "spec:.claude/specs/components/checkbox.md#rules-for-llms",
    },
    {
      wrong:
        "Resize the checkbox with size-5, size-6, or width/height className overrides",
      instead:
        "The checkbox is a fixed size-4 (16 by 16 pixels) with no size variants — never resize it",
      source: "spec:.claude/specs/components/checkbox.md#rules-for-llms",
    },
    {
      wrong:
        "Expect the Label to dim automatically when a standalone Checkbox is disabled",
      instead:
        "Add className opacity-50 to the Label manually in the standalone checkbox + label pattern; auto-dimming only happens inside a disabled Field",
      source: "spec:.claude/specs/components/checkbox.md#rules-for-llms",
    },
    {
      wrong: "Handle changes with the native onChange prop",
      instead:
        "Use onCheckedChange — Checkbox uses the Base UI API, not the native change event",
      source: "spec:.claude/specs/components/checkbox.md#rules-for-llms",
    },
    {
      wrong:
        "Substitute Checkbox for Switch (or vice versa) when Figma shows the other",
      instead:
        "If Figma shows a toggle/switch shape use Switch; if it shows a square checkbox use Checkbox — never swap them",
      source: "spec:.claude/specs/components/checkbox.md#rules-for-llms",
    },
  ],
  variants: [],
  sizes: [],
  parentComponents: ["field", "label"],
  childComponents: [],
  tokens: [
    "border-input",
    "bg-primary",
    "border-primary",
    "text-primary-foreground",
    "ring-ring/50",
    "border-destructive",
    "ring-destructive/20",
  ],
  a11y: [
    "Must be paired with a Label via htmlFor/id — a checkbox without a label is inaccessible",
    "Keyboard focus shows a visible focus-visible ring (ring based on the ring token)",
    "Error state is driven by setting aria-invalid on the element, which switches border/ring to destructive tokens",
    "Disabled state applies reduced opacity and cursor-not-allowed; inside a disabled Field the checkbox dims automatically via the group-has-disabled selector",
    "The check icon is built into the indicator — do not add one manually",
  ],
  aiHints: {
    selectionCriteria: [
      "Use Checkbox for one or more independent options in a form that are submitted on Save",
      "Use Switch instead for a single setting that takes effect immediately on toggle",
      "Use RadioGroup instead for selecting exactly one option from a mutually exclusive set",
      "Use Checkbox with the indeterminate state for 'select all' with child selections",
      "Use Checkbox for terms & conditions / consent",
    ],
    confusedWith: [
      {
        component: "switch",
        disambiguation:
          "Checkbox marks a preference that takes effect when the form is submitted; Switch applies the change instantly with no form submission",
      },
      {
        component: "radio-group",
        disambiguation:
          "RadioGroup selects exactly one option from a mutually exclusive set; Checkbox handles independent options where any number can be selected",
      },
    ],
    compositionRules: [
      "Standard pattern: Checkbox + Label in a flex items-center gap-2 container, connected via id/htmlFor",
      "Groups with descriptions use the Field system: FieldSet > FieldLegend, then Field orientation=horizontal wrapping Checkbox + FieldContent (FieldTitle, FieldDescription)",
      "Controlled usage goes through checked and onCheckedChange",
      "Error state: set aria-invalid on the Checkbox and render the error message text separately below",
    ],
    source: ".claude/specs/components/checkbox.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/checkbox.md",
  codeConnectStatus: "not-planned",
  primitiveSource: "base-ui",
  version: "1.0.0",
}
