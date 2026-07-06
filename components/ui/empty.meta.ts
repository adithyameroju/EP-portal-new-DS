import type { ComponentMeta } from "./_meta-schema"

export const emptyMeta: ComponentMeta = {
  name: "empty",
  category: "molecule",
  purpose:
    "Centered empty-state layout with a dashed-border container and slots for media (plain or icon tile), title, description, and follow-up content.",
  useCases: [],
  antiPatterns: [],
  variants: [
    {
      prop: "variant",
      values: ["default", "icon"],
      default: "default",
    },
  ],
  sizes: [],
  parentComponents: [],
  childComponents: [
    "empty-header",
    "empty-media",
    "empty-title",
    "empty-description",
    "empty-content",
  ],
  tokens: ["bg-muted", "text-foreground", "text-muted-foreground", "text-primary"],
  a11y: [],
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
