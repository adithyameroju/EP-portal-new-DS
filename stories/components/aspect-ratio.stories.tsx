/**
 * AspectRatio stories — S2.3.
 * Title from aspectRatioMeta.category ("atom" → "Atoms"). UNSPECCED
 * (specStatus "none", aiHints.source "types-only") and aspectRatioMeta.variants
 * = [] — the gallery is a minimal demo of the "required numeric ratio prop"
 * (aspectRatioMeta.purpose). Label text = the prop value itself.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { aspectRatioMeta } from "@/components/ui/aspect-ratio.meta"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Atoms/AspectRatio",
  component: AspectRatio,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(aspectRatioMeta) },
  },
} satisfies Meta<typeof AspectRatio>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Minimal demo of the required `ratio` prop. FLAG: `ratio` has no meta
 * variants axis, so the 16/9 value is a placeholder chosen for the demo,
 * not meta-derived; the visible label is the prop value itself.
 */
export const Ratio: Story = {
  // `ratio` is the component's required prop, so it is supplied via story args.
  args: { ratio: 16 / 9 },
  render: (args) => (
    <div className="w-96">
      <AspectRatio ratio={args.ratio}>
        <div className="flex size-full items-center justify-center rounded-lg bg-muted">
          <p className="font-mono text-sm text-muted-foreground">
            ratio: {args.ratio}
          </p>
        </div>
      </AspectRatio>
    </div>
  ),
}
