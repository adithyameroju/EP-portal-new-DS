import type { ComponentMeta } from "./_meta-schema"

export const fieldMeta: ComponentMeta = {
  name: "field",
  category: "molecule",
  purpose:
    "Compass's framework-agnostic field layout system for form field structure — labels, help text, and error messages; this repo has no react-hook-form form.tsx, so Field plus FieldError is the equivalent for all form field structure.",
  useCases: [
    "Full form with validation, help text, and error messages",
    "Group of related checkboxes or radio buttons (FieldSet + FieldLegend)",
    "Settings page with horizontal label/input rows (orientation horizontal)",
    "Mobile-first form that switches to horizontal at the md breakpoint (orientation responsive)",
    "Checkbox or radio item with a title and description to its right (FieldContent with FieldTitle + FieldDescription)",
    "Field sections divided by a labelled separator (FieldSeparator)",
  ],
  antiPatterns: [
    {
      wrong:
        "Over-engineer a simple 2-field card form (e.g. a login card) with Field and FieldGroup",
      instead:
        "Use standalone Label + Input pairs in a div for simple card forms; use Field when you need errors or descriptions",
      source: "spec:.claude/specs/components/field.md#rules-for-llms",
    },
    {
      wrong: "Use FieldLabel without htmlFor, or an input without an id",
      instead:
        "The htmlFor on FieldLabel must match the id on the input — same rule as Label",
      source: "spec:.claude/specs/components/field.md#rules-for-llms",
    },
    {
      wrong: "Conditionally hide FieldError when there are no errors",
      instead:
        "Always render FieldError; it renders nothing when errors is empty or undefined",
      source: "spec:.claude/specs/components/field.md#rules-for-llms",
    },
    {
      wrong:
        "Use a plain div with a heading for a group of checkboxes or radio buttons",
      instead:
        "Use FieldSet + FieldLegend — the semantically correct HTML elements for grouped controls; a plain div with a heading is an accessibility violation",
      source: "spec:.claude/specs/components/field.md#rules-for-llms",
    },
    {
      wrong:
        "Build a manual div to stack a checkbox item's title and description",
      instead:
        "Use FieldContent inside Field with FieldTitle and FieldDescription when a checkbox needs a title and description to its right",
      source: "spec:.claude/specs/components/field.md#rules-for-llms",
    },
    {
      wrong: "Nest FieldGroup inside FieldGroup",
      instead: "One level of grouping is enough for standard forms",
      source: "spec:.claude/specs/components/field.md#rules-for-llms",
    },
    {
      wrong: "Use FieldLegend outside a FieldSet",
      instead:
        "FieldLegend only works meaningfully inside FieldSet; outside a fieldset it has no semantic value",
      source: "spec:.claude/specs/components/field.md#rules-for-llms",
    },
  ],
  variants: [
    {
      prop: "orientation",
      values: ["vertical", "horizontal", "responsive"],
      default: "vertical",
    },
    {
      prop: "variant",
      values: ["legend", "label"],
      default: "legend",
    },
  ],
  sizes: [],
  parentComponents: ["label", "separator"],
  childComponents: [
    "field-label",
    "field-description",
    "field-error",
    "field-group",
    "field-legend",
    "field-separator",
    "field-set",
    "field-content",
    "field-title",
  ],
  tokens: [
    "text-destructive",
    "text-muted-foreground",
    "text-primary",
    "border-primary/30",
    "bg-primary/5",
    "bg-background",
  ],
  a11y: [
    "Field root renders a div with role=group and reflects invalid state via data-invalid, turning the group's text destructive",
    "FieldError renders with role=alert so screen readers announce validation errors",
    "FieldSet and FieldLegend render native fieldset/legend elements — the semantically correct grouping for checkbox/radio groups",
    "FieldLabel wraps Label and must be connected to its input via matching htmlFor/id",
    "Disabled state dims FieldLabel and FieldTitle automatically via the field's group context",
  ],
  aiHints: {
    selectionCriteria: [
      "Use the Field system for a full form with validation, help text, and errors",
      "Use standalone Label + Input in a div instead for simple 1-2 input card forms (login form, search)",
      "Use FieldSet + FieldLegend for a group of related checkboxes or radio buttons",
      "Use Field orientation horizontal for settings pages with label/input rows",
      "Use Field orientation responsive for a mobile-first form that goes horizontal at a breakpoint",
      "Rule of thumb: if you need error messages or description text, use Field",
    ],
    confusedWith: [
      {
        component: "label",
        disambiguation:
          "Standalone Label + Input pairs suit simple 1-2 input card forms with no validation UI; the Field system is for forms that need descriptions and error messages",
      },
      {
        component: "input",
        disambiguation:
          "Input is the text control itself; Field is the layout wrapper that adds label, description, and error structure around any control",
      },
    ],
    compositionRules: [
      "Structure: FieldGroup > Field (orientation vertical | horizontal | responsive) > FieldLabel (or FieldTitle), then the control (Input/Select/Textarea), then optional FieldDescription, then conditional FieldError",
      "Grouped controls: FieldSet > FieldLegend + one Field per item, each holding the Checkbox/RadioGroupItem and a FieldContent stacking FieldTitle + FieldDescription",
      "FieldGroup wraps multiple Fields and controls vertical spacing — use it when a form has 2 or more fields; never nest FieldGroup inside FieldGroup",
      "FieldError accepts an errors array (deduplicated; multiple errors render as a list) or children directly, and renders nothing when empty",
      "Use FieldTitle instead of FieldLabel for non-label heading text when no htmlFor binding is needed",
      "FieldSeparator draws a divider between fields, optionally with centered text (e.g. 'or')",
    ],
    source: ".claude/specs/components/field.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/field.md",
  codeConnectStatus: "mapped",
  primitiveSource: "composite",
  version: "1.0.0",
}
