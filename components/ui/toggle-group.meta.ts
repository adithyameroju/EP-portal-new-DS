import type { ComponentMeta } from "./_meta-schema"

export const toggleGroupMeta: ComponentMeta = {
  name: "toggle-group",
  category: "molecule",
  purpose:
    "Group of Toggle items built on the Base UI ToggleGroup primitive that shares variant/size/spacing/orientation via context, joining items into a segmented control when spacing is 0.",
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
    {
      prop: "orientation",
      values: ["horizontal", "vertical"],
      default: "horizontal",
    },
  ],
  sizes: ["default", "sm", "lg"],
  parentComponents: ["toggle"],
  childComponents: ["toggle-group-item"],
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
