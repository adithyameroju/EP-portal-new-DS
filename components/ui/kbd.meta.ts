import type { ComponentMeta } from "./_meta-schema"

export const kbdMeta: ComponentMeta = {
  name: "kbd",
  category: "atom",
  purpose:
    "Inline keyboard-key badge rendered as a native kbd element with muted styling, plus a KbdGroup wrapper for key combinations.",
  useCases: [],
  antiPatterns: [],
  variants: [],
  sizes: [],
  parentComponents: [],
  childComponents: ["kbd-group"],
  tokens: [
    "bg-muted",
    "text-muted-foreground",
    "bg-background",
    "text-background",
  ],
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
