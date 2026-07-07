/**
 * ToggleGroup stories — S2.3.
 * Title from toggleGroupMeta.category ("molecule" → "Molecules").
 * ToggleGroup is types-only (specStatus "none") but carries variant axes;
 * each gallery renders one ToggleGroup per axis value, with
 * ToggleGroupItems mapped from that same axis's values — all text is the
 * axis value string itself (button-story convention), no authored prose.
 */

import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { toggleGroupMeta } from "@/components/ui/toggle-group.meta"
import { metaDocsPage } from "./meta-doc-blocks"

type ToggleGroupProps = ComponentProps<typeof ToggleGroup>

const variantAxis = toggleGroupMeta.variants.find(
  (axis) => axis.prop === "variant",
)!
const sizeAxis = toggleGroupMeta.variants.find((axis) => axis.prop === "size")!
const orientationAxis = toggleGroupMeta.variants.find(
  (axis) => axis.prop === "orientation",
)!

const meta = {
  title: "Molecules/ToggleGroup",
  component: ToggleGroup,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(toggleGroupMeta) },
  },
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

/** One group per `variant` axis value from toggle-group.meta.ts. */
export const Variant: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      {variantAxis.values.map((variant) => (
        <ToggleGroup
          key={variant}
          aria-label={variant}
          variant={variant as ToggleGroupProps["variant"]}
        >
          {variantAxis.values.map((value) => (
            <ToggleGroupItem key={value} value={value}>
              {value}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      ))}
    </div>
  ),
}

/** One group per `size` axis value from toggle-group.meta.ts. */
export const Size: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      {sizeAxis.values.map((size) => (
        <ToggleGroup
          key={size}
          aria-label={size}
          variant="outline"
          size={size as ToggleGroupProps["size"]}
        >
          {sizeAxis.values.map((value) => (
            <ToggleGroupItem key={value} value={value}>
              {value}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      ))}
    </div>
  ),
}

/** One group per `orientation` axis value from toggle-group.meta.ts. */
export const Orientation: Story = {
  render: () => (
    <div className="flex items-start gap-8">
      {orientationAxis.values.map((orientation) => (
        <ToggleGroup
          key={orientation}
          aria-label={orientation}
          variant="outline"
          orientation={orientation as ToggleGroupProps["orientation"]}
        >
          {orientationAxis.values.map((value) => (
            <ToggleGroupItem key={value} value={value}>
              {value}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      ))}
    </div>
  ),
}
