/**
 * Chart stories — S2.3 generation pass.
 * Title from chartMeta.category ("organism" → "Organisms"). chart is
 * UNSPECCED (chartMeta.specStatus = "none", aiHints.source = "types-only") —
 * there is no spec "Common patterns" section to copy. The gallery is a
 * minimal recharts BarChart rendered through the Compass wrapper, per
 * chartMeta.purpose: "Recharts wrapper that provides a config-driven
 * ChartContainer (responsive sizing, per-series CSS color variables, themed
 * Recharts overrides) plus styled tooltip and legend content components."
 * It maps the `indicator` axis from chart.meta.ts onto ChartTooltipContent.
 * Series colors are the semantic chart tokens (--chart-1 / --chart-2 from
 * @acko/enterprise-tokens); config labels are those token names, and data
 * values are mechanical sample numbers.
 */

import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { chartMeta } from "@/components/ui/chart.meta"
import { metaDocsPage } from "./meta-doc-blocks"

type TooltipContentProps = ComponentProps<typeof ChartTooltipContent>

const indicatorAxis = chartMeta.variants.find(
  (axis) => axis.prop === "indicator",
)!

const chartConfig = {
  chart1: { label: "--chart-1", color: "var(--chart-1)" },
  chart2: { label: "--chart-2", color: "var(--chart-2)" },
} satisfies ChartConfig

const chartData = [
  { month: "Jan", chart1: 186, chart2: 80 },
  { month: "Feb", chart1: 305, chart2: 200 },
  { month: "Mar", chart1: 237, chart2: 120 },
  { month: "Apr", chart1: 73, chart2: 190 },
  { month: "May", chart1: 209, chart2: 130 },
  { month: "Jun", chart1: 214, chart2: 140 },
]

const meta = {
  title: "Organisms/Chart",
  component: ChartContainer,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(chartMeta) },
  },
} satisfies Meta<typeof ChartContainer>

export default meta
// ChartContainer has required props (config, children); this file's stories
// are render-only, so the story type is the unparameterised StoryObj.
type Story = StoryObj

/**
 * One ChartContainer per `indicator` axis value from chart.meta.ts, applied
 * to ChartTooltipContent (hover the bars to see the indicator shape).
 * `var(--color-chart1)` / `var(--color-chart2)` are the per-series CSS color
 * variables that ChartStyle generates from the config; w-96 is the lane-B
 * sized-wrapper convention.
 */
export const Indicator: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8">
      {indicatorAxis.values.map((value) => (
        <div key={value} className="flex w-96 flex-col gap-2">
          <p className="font-mono text-xs text-muted-foreground">{value}</p>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    indicator={value as TooltipContentProps["indicator"]}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="chart1" fill="var(--color-chart1)" radius={4} />
              <Bar dataKey="chart2" fill="var(--color-chart2)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      ))}
    </div>
  ),
}
