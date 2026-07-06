import type { ComponentMeta } from "./_meta-schema"

export const nativeSelectMeta: ComponentMeta = {
  name: "native-select",
  category: "atom",
  purpose:
    "Styled native HTML select element with a decorative chevron icon and option/optgroup wrappers, offering platform-native dropdown behavior.",
  useCases: [],
  antiPatterns: [],
  variants: [
    {
      prop: "size",
      values: ["sm", "default"],
      default: "default",
    },
  ],
  sizes: ["sm", "default"],
  parentComponents: [],
  childComponents: ["native-select-option", "native-select-optgroup"],
  tokens: [
    "border-input",
    "bg-primary",
    "text-primary-foreground",
    "text-muted-foreground",
    "border-ring",
    "ring-ring",
    "border-destructive",
    "ring-destructive",
    "bg-input",
  ],
  a11y: [
    "aria-hidden=true on the decorative chevron icon",
    "Select styling responds to aria-invalid (destructive border and ring)",
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
  primitiveSource: "native",
  version: "1.0.0",
}
