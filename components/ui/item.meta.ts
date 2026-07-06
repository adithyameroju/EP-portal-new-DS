import type { ComponentMeta } from "./_meta-schema"

export const itemMeta: ComponentMeta = {
  name: "item",
  category: "molecule",
  purpose:
    "Flexible list-row primitive (rendered via the Base UI useRender utility) with media, content, title, description, actions, header, and footer slots, groupable via ItemGroup with separators.",
  useCases: [],
  antiPatterns: [],
  variants: [
    {
      prop: "variant",
      values: ["default", "outline", "muted"],
      default: "default",
    },
    {
      prop: "size",
      values: ["default", "sm", "xs"],
      default: "default",
    },
  ],
  sizes: ["default", "sm", "xs"],
  parentComponents: ["separator"],
  childComponents: [
    "item-group",
    "item-separator",
    "item-media",
    "item-content",
    "item-title",
    "item-description",
    "item-actions",
    "item-header",
    "item-footer",
  ],
  tokens: [
    "border-ring",
    "ring-ring",
    "bg-muted",
    "border-border",
    "text-muted-foreground",
    "text-primary",
  ],
  a11y: ["role=list on ItemGroup"],
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
