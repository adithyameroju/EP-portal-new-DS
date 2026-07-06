import type { ComponentMeta } from "./_meta-schema"

export const toggleMeta: ComponentMeta = {
  name: "toggle",
  category: "atom",
  purpose:
    "Two-state pressed/unpressed button built on the Base UI Toggle primitive, with default and outline variants and three sizes; exports toggleVariants for reuse.",
  useCases: [],
  antiPatterns: [],
  variants: [
    {
      prop: "variant",
      values: ["default", "outline"],
      default: "default",
    },
    {
      prop: "size",
      values: ["default", "sm", "lg"],
      default: "default",
    },
  ],
  sizes: ["default", "sm", "lg"],
  parentComponents: [],
  childComponents: [],
  tokens: [
    "bg-muted",
    "text-foreground",
    "border-ring",
    "ring-ring",
    "border-destructive",
    "ring-destructive",
    "border-input",
  ],
  a11y: [
    "Pressed styling responds to aria-pressed (and the data-state=on attribute) set by the Base UI primitive",
    "Styling responds to aria-invalid (destructive border and ring)",
  ],
  aiHints: {
    selectionCriteria: [],
    confusedWith: [],
    compositionRules: [],
    source: "types-only",
  },
  specStatus: "none",
  specPath: null,
  codeConnectStatus: "not-planned",
  primitiveSource: "base-ui",
  version: "1.0.0",
}
