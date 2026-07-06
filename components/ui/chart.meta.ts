import type { ComponentMeta } from "./_meta-schema"

export const chartMeta: ComponentMeta = {
  name: "chart",
  category: "organism",
  purpose:
    "Recharts wrapper that provides a config-driven ChartContainer (responsive sizing, per-series CSS color variables, themed Recharts overrides) plus styled tooltip and legend content components.",
  useCases: [],
  antiPatterns: [],
  variants: [
    {
      prop: "indicator",
      values: ["line", "dot", "dashed"],
      default: "dot",
    },
  ],
  sizes: [],
  parentComponents: [],
  childComponents: [
    "chart-container",
    "chart-tooltip",
    "chart-tooltip-content",
    "chart-legend",
    "chart-legend-content",
    "chart-style",
  ],
  tokens: [
    "fill-muted-foreground",
    "stroke-border",
    "fill-muted",
    "bg-muted",
    "bg-background",
    "border-border",
    "text-muted-foreground",
    "text-foreground",
  ],
  a11y: [],
  aiHints: {
    selectionCriteria: [],
    confusedWith: [],
    compositionRules: [
      "useChart (and therefore ChartTooltipContent/ChartLegendContent) must be used within a ChartContainer — the hook throws outside the ChartContext provider (source-comment:components/ui/chart.tsx)",
    ],
    source: "types-only",
  },
  specStatus: "none",
  specPath: null,
  codeConnectStatus: "not-planned",
  primitiveSource: "recharts",
  version: "1.0.0",
}
