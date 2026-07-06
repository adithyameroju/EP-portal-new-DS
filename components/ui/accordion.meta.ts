import type { ComponentMeta } from "./_meta-schema"

export const accordionMeta: ComponentMeta = {
  name: "accordion",
  category: "molecule",
  purpose:
    "Vertically stacked set of expandable sections built on the Base UI Accordion primitive, with chevron-icon triggers and height-animated content panels.",
  useCases: [],
  antiPatterns: [],
  variants: [],
  sizes: [],
  parentComponents: [],
  childComponents: ["accordion-item", "accordion-trigger", "accordion-content"],
  tokens: [
    "border-ring",
    "ring-ring",
    "text-muted-foreground",
    "text-foreground",
  ],
  a11y: [
    "Trigger styling responds to aria-disabled (pointer-events and opacity) and aria-expanded (chevron swap) states set by the Base UI primitive",
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
