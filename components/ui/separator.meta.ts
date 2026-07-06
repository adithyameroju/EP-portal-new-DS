import type { ComponentMeta } from "./_meta-schema"

export const separatorMeta: ComponentMeta = {
  name: "separator",
  category: "atom",
  purpose:
    "A single-component visual divider built on Base UI's separator primitive that renders a thin line to divide sections of content — one prop (orientation), no sub-components, no variants.",
  useCases: [
    "One-off horizontal divider between two specific sections on a page or card",
    "Vertical divider between items in a horizontal toolbar or inline row",
    "Divider between CardHeader and CardContent inside a Card",
  ],
  antiPatterns: [
    {
      wrong:
        "Use Separator as a structural container or wrap content inside it",
      instead:
        "Treat Separator as decorative only — it renders a thin line with role separator and must stay a self-closing element",
      source: "spec:.claude/specs/components/separator.md#rules-for-llms",
    },
    {
      wrong:
        "Set explicit height or width utility classes on Separator (e.g. an h-4 or w-full override)",
      instead:
        "Rely on the built-in dimensions — hairline height and full width for horizontal, hairline width and self-stretch for vertical; overrides break the orientation logic",
      source: "spec:.claude/specs/components/separator.md#rules-for-llms",
    },
    {
      wrong:
        "Insert a repeated Separator between every item in a list of rows",
      instead:
        "Use Tailwind's divide-y (or divide-x) on the parent container for lists; reserve Separator for one-off dividers between two specific sections",
      source: "spec:.claude/specs/components/separator.md#rules-for-llms",
    },
    {
      wrong:
        "Place a vertical Separator outside a flex container",
      instead:
        "Put vertical separators inside a flex items-center container — self-stretch only works inside a flex row",
      source: "spec:.claude/specs/components/separator.md#rules-for-llms",
    },
    {
      wrong:
        "Override the divider color with a raw Tailwind gray or slate utility or a hardcoded color",
      instead:
        "Keep the built-in bg-border token — it is the correct token for all dividers",
      source: "spec:.claude/specs/components/separator.md#rules-for-llms",
    },
  ],
  variants: [
    {
      prop: "orientation",
      values: ["horizontal", "vertical"],
      default: "horizontal",
    },
  ],
  sizes: [],
  parentComponents: [],
  childComponents: [],
  tokens: ["bg-border"],
  a11y: [
    "Renders with role separator from the Base UI primitive; it is decorative and carries no semantic content",
  ],
  aiHints: {
    selectionCriteria: [
      "Use Separator explicitly for a one-off divider between two specific sections",
      "Use divide-y on the container instead when every row in a list needs a divider",
      "Use orientation vertical between items in a horizontal toolbar or inline row",
    ],
    confusedWith: [],
    compositionRules: [
      "Separator is a single self-closing element with no children and no sub-components",
      "Vertical separators must sit inside a flex items-center container so self-stretch can fill the row height — no explicit height needed",
      "Do not add height, width, or color overrides; dimensions and bg-border are built in per orientation",
    ],
    source: ".claude/specs/components/separator.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/separator.md",
  codeConnectStatus: "not-planned",
  primitiveSource: "base-ui",
  version: "1.0.0",
}
