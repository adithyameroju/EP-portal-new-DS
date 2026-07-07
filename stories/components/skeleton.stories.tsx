/**
 * Skeleton stories — S2.3.
 * Title from skeletonMeta.category ("atom" → "Atoms"). Skeleton is
 * types-only (skeletonMeta.variants = [], specStatus "none"); the gallery
 * shows shape examples using only spacing/radius utility classes from the
 * scale — no authored composition.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Skeleton } from "@/components/ui/skeleton"
import { skeletonMeta } from "@/components/ui/skeleton.meta"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Atoms/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(skeletonMeta) },
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

/**
 * skeletonMeta.purpose: "Pulsing muted placeholder div used to indicate
 * loading content." Shapes below use only spacing scale (size-12, h-4,
 * w-64, w-48) and named radius (rounded-full; rounded-md is the
 * component's own default) utilities.
 */
export const Shapes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  ),
}

/** Block shape — spacing scale only (h-32, w-80). */
export const Block: Story = {
  render: () => <Skeleton className="h-32 w-80" />,
}
