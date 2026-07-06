import type { ComponentMeta } from "./_meta-schema"

export const sliderMeta: ComponentMeta = {
  name: "slider",
  category: "atom",
  purpose:
    "Range slider built on the Base UI Slider primitive supporting single or multi-thumb values, horizontal or vertical orientation, with a muted track, primary-filled indicator, and edge-aligned thumbs.",
  useCases: [],
  antiPatterns: [],
  variants: [],
  sizes: [],
  parentComponents: [],
  childComponents: [],
  tokens: ["bg-muted", "bg-primary", "border-ring", "ring-ring"],
  a11y: [
    "Control styling responds to the data-disabled state set by the Base UI primitive",
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
