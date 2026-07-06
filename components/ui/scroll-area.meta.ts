import type { ComponentMeta } from "./_meta-schema"

export const scrollAreaMeta: ComponentMeta = {
  name: "scroll-area",
  category: "molecule",
  purpose:
    "Custom-scrollbar container built on the Base UI ScrollArea primitive, wrapping content in a focusable viewport with styled vertical/horizontal scrollbars, thumb, and corner.",
  useCases: [],
  antiPatterns: [],
  variants: [],
  sizes: [],
  parentComponents: [],
  childComponents: ["scroll-bar"],
  tokens: ["ring-ring", "bg-border"],
  a11y: [
    "Viewport is keyboard-focusable with a visible focus-visible ring",
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
