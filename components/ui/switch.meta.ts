import type { ComponentMeta } from "./_meta-schema"

export const switchMeta: ComponentMeta = {
  name: "switch",
  category: "atom",
  purpose:
    "A pill-shaped toggle switch for binary settings that take effect immediately on toggle (no Save needed), built on Base UI's switch primitive.",
  useCases: [
    "Enabling/disabling a feature immediately (dark mode, email alerts)",
    "Settings page rows combining Switch with Field, FieldLabel, and FieldDescription",
    "Controlled toggle bound to app state via checked/onCheckedChange (auto-renew)",
    "Compact toggle in dense layouts like table rows or toolbars (size sm)",
    "Disabled toggle for an unavailable feature",
  ],
  antiPatterns: [
    {
      wrong: "Render a Switch without an associated Label",
      instead:
        "Always pair Switch with Label via htmlFor/id — a switch without a label is inaccessible",
      source: "spec:.claude/specs/components/switch.md#rules-for-llms",
    },
    {
      wrong:
        "Handle changes with the native onChange event and event.target.checked",
      instead:
        "Use onCheckedChange — Switch uses the Base UI API and passes the checked boolean directly",
      source: "spec:.claude/specs/components/switch.md#rules-for-llms",
    },
    {
      wrong:
        "Use Switch for a form preference that only applies when the user clicks Save/Continue",
      instead:
        "Use Checkbox for submit-confirmed form fields; Switch is for immediate-effect toggles",
      source: "spec:.claude/specs/components/switch.md#rules-for-llms",
    },
    {
      wrong:
        "Expect the label of a disabled Switch to dim automatically outside a Field",
      instead:
        "Add opacity-50 to the Label manually when not inside a Field — the automatic dimming only works inside the Field component",
      source: "spec:.claude/specs/components/switch.md#rules-for-llms",
    },
    {
      wrong: "Use Switch where the Figma design shows a square checkbox",
      instead:
        "Use Checkbox for square components; use Switch only when the Figma component is pill-shaped",
      source: "spec:.claude/specs/components/switch.md#rules-for-llms",
    },
    {
      wrong: "Default to size sm for ordinary layouts",
      instead:
        "Use the default size in most contexts; size sm is only for genuinely space-constrained dense layouts (table rows, toolbars)",
      source: "spec:.claude/specs/components/switch.md#rules-for-llms",
    },
    {
      wrong: "Add width or height utility classes to Switch",
      instead:
        "Dimensions are controlled by the size prop via CSS data attributes; utility overrides break the thumb animation",
      source: "spec:.claude/specs/components/switch.md#rules-for-llms",
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
  childComponents: [],
  tokens: [
    "bg-input",
    "bg-primary",
    "bg-background",
    "border-destructive",
    "ring-destructive/20",
    "border-ring",
    "ring-ring/50",
  ],
  a11y: [
    "Built on the Base UI switch primitive, which provides switch semantics and keyboard toggling",
    "Must be paired with a Label via htmlFor/id — an unlabelled switch is inaccessible",
    "aria-invalid triggers destructive border and ring styling for error states",
    "Visible focus ring (ring-ring at 50 percent opacity) on keyboard focus; an invisible expanded hit area extends beyond the visual track",
    "Disabled state applies reduced opacity and a not-allowed cursor",
  ],
  aiHints: {
    selectionCriteria: [
      "Use Switch for a setting that takes effect immediately on toggle, with no Save needed",
      "Use Switch for enabling/disabling a feature (dark mode, email alerts) or a binary state that should feel like a physical toggle",
      "Use Checkbox instead for a preference in a form that applies on submit",
      "Use Checkbox instead for selecting/deselecting an option in a multi-select list",
      "Use Checkbox instead for terms-and-conditions consent",
      "Decisive rule: immediate app change means Switch; confirmed on Save/Continue means Checkbox",
    ],
    confusedWith: [
      {
        component: "checkbox",
        disambiguation:
          "Checkbox is for form fields confirmed on submit, multi-select lists, and consent; Switch is for immediate-effect toggles that feel like a physical switch",
      },
    ],
    compositionRules: [
      "Single component — no sub-components to import; the track and sliding thumb are internal",
      "Standard pattern: Switch + Label inside a flex items-center gap-2 container, linked via id/htmlFor",
      "Settings page pattern: Field orientation horizontal containing FieldLabel + FieldDescription and the Switch",
      "Controlled usage: checked plus onCheckedChange (receives the checked boolean directly)",
    ],
    source: ".claude/specs/components/switch.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/switch.md",
  codeConnectStatus: "not-planned",
  primitiveSource: "base-ui",
  version: "1.0.0",
}
