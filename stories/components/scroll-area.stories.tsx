/**
 * ScrollArea stories — S2.3 (types-only meta).
 * Title from scrollAreaMeta.category ("molecule" → "Molecules"). No spec
 * exists (specStatus "none") and scrollAreaMeta.variants = []; the story
 * wraps mechanical numbered rows in a sized container so the styled vertical
 * scrollbar (rendered automatically by the ScrollArea wrapper — see
 * scrollAreaMeta.childComponents "scroll-bar") is visible. Row content is
 * index numbers only — no invented copy.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { ScrollArea } from "@/components/ui/scroll-area"
import { scrollAreaMeta } from "@/components/ui/scroll-area.meta"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Molecules/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(scrollAreaMeta) },
  },
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Vertical scrolling in an `h-48 w-64` wrapper (story wrapper size only —
 * ScrollArea sizes to its container).
 */
export const Default: Story = {
  render: () => (
    <ScrollArea className="h-48 w-64 rounded-lg border">
      <div className="flex flex-col divide-y px-4">
        {Array.from({ length: 30 }, (_, index) => (
          <div key={index} className="py-2 text-sm tabular-nums">
            {index + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
}
