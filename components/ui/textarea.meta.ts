import type { ComponentMeta } from "./_meta-schema"

export const textareaMeta: ComponentMeta = {
  name: "textarea",
  category: "atom",
  purpose:
    "Styled native multi-line text input with content-based auto-sizing (field-sizing), focus ring, and disabled and invalid state styling.",
  useCases: [],
  antiPatterns: [],
  variants: [],
  sizes: [],
  parentComponents: [],
  childComponents: [],
  tokens: [
    "border-input",
    "text-muted-foreground",
    "border-ring",
    "ring-ring",
    "bg-input",
    "border-destructive",
    "ring-destructive",
  ],
  a11y: [
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
  primitiveSource: "native",
  version: "1.0.0",
}
