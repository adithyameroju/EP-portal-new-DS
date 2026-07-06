import type { ComponentMeta } from "./_meta-schema"

export const buttonGroupMeta: ComponentMeta = {
  name: "button-group",
  category: "molecule",
  purpose:
    "Container that visually joins adjacent buttons, inputs, and selects into a single horizontal or vertical segmented control by collapsing inner borders and radii.",
  useCases: [],
  antiPatterns: [],
  variants: [
    {
      prop: "orientation",
      values: ["horizontal", "vertical"],
      default: "horizontal",
    },
  ],
  sizes: [],
  parentComponents: ["separator"],
  childComponents: ["button-group-text", "button-group-separator"],
  tokens: ["bg-muted", "bg-input"],
  a11y: ["role=group on the ButtonGroup container"],
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
