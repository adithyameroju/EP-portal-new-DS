import type { ComponentMeta } from "./_meta-schema"

export const resizableMeta: ComponentMeta = {
  name: "resizable",
  category: "organism",
  purpose:
    "Resizable split-pane layout built on react-resizable-panels, with a panel group, panels, and a draggable separator handle (optionally showing a grip bar).",
  useCases: [],
  antiPatterns: [],
  variants: [],
  sizes: [],
  parentComponents: [],
  childComponents: ["resizable-panel-group", "resizable-panel", "resizable-handle"],
  tokens: ["bg-border", "ring-ring", "ring-offset-background"],
  a11y: [
    "Group and handle styling respond to the aria-orientation attribute set by the react-resizable-panels separator",
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
  primitiveSource: "resizable-panels",
  version: "1.0.0",
}
