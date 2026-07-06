import type { ComponentMeta } from "./_meta-schema"

export const directionMeta: ComponentMeta = {
  name: "direction",
  category: "atom",
  purpose:
    "Re-export of the Base UI DirectionProvider context provider and useDirection hook for propagating text direction (LTR/RTL) to descendant components; renders no UI of its own.",
  useCases: [],
  antiPatterns: [],
  variants: [],
  sizes: [],
  parentComponents: [],
  childComponents: ["direction-provider"],
  tokens: [],
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
  primitiveSource: "base-ui",
  version: "1.0.0",
}
