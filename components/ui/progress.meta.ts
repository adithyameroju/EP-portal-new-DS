import type { ComponentMeta } from "./_meta-schema"

export const progressMeta: ComponentMeta = {
  name: "progress",
  category: "atom",
  purpose:
    "A horizontal progress bar that shows completion percentage for tasks, uploads, form steps, or loading states.",
  useCases: [
    "Basic progress bar with a value from 0 to 100",
    "Progress with a label above-left the bar (ProgressLabel)",
    "Progress with label and auto-rendered percentage above-right (ProgressValue)",
    "Custom value format such as step counts (ProgressValue children, e.g. 4 of 10 with max)",
    "Multi-step form progress indicator",
    "List of progress bars for concurrent file uploads",
  ],
  antiPatterns: [
    {
      wrong: "Import ProgressTrack or ProgressIndicator",
      instead:
        "They are internal — the Progress root renders them automatically; import only Progress, ProgressLabel, and ProgressValue",
      source: "spec:.claude/specs/components/progress.md#rules-for-llms",
    },
    {
      wrong:
        "Place label or value text as siblings alongside the Progress element",
      instead:
        "ProgressLabel and ProgressValue are children of Progress, not siblings — put them inside the component",
      source: "spec:.claude/specs/components/progress.md#rules-for-llms",
    },
    {
      wrong: "Override the h-1 track height to make a thicker bar",
      instead:
        "The 4px height is intentional; check with the design owner before overriding — it is a global style decision",
      source: "spec:.claude/specs/components/progress.md#rules-for-llms",
    },
    {
      wrong: "Pass the percentage number manually as children to ProgressValue",
      instead:
        "ProgressValue reads the value from context and auto-renders the percentage; pass children only for a custom format (e.g. 4 of 10 instead of 40 percent)",
      source: "spec:.claude/specs/components/progress.md#rules-for-llms",
    },
  ],
  variants: [],
  sizes: [],
  parentComponents: [],
  childComponents: [
    "progress-track",
    "progress-indicator",
    "progress-label",
    "progress-value",
  ],
  tokens: ["bg-muted", "bg-primary", "text-muted-foreground"],
  a11y: [
    "Built on the Base UI progress primitive, which renders the progressbar role and aria value attributes from the value prop",
    "ProgressLabel is the Base UI Label part, associating the visible label text with the progress bar",
    "ProgressValue announces the current value as human-readable text (auto-formatted percentage by default)",
  ],
  aiHints: {
    selectionCriteria: [],
    confusedWith: [],
    compositionRules: [
      "The Progress root renders ProgressTrack and ProgressIndicator automatically — compose only ProgressLabel and ProgressValue as children",
      "Root layout is flex flex-wrap gap-3: label appears top-left, value top-right, and the bar wraps below them",
      "value is a number from 0 to 100; pass max for custom scales (e.g. value 4 with max 10)",
    ],
    source: ".claude/specs/components/progress.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/progress.md",
  codeConnectStatus: "not-planned",
  primitiveSource: "base-ui",
  version: "1.0.0",
}
