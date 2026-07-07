/**
 * Slider stories — S2.3.
 * Title from sliderMeta.category ("atom" → "Atoms"). Slider is types-only
 * (sliderMeta.variants = [], specStatus "none"); stories map the states
 * named in sliderMeta fields ("single or multi-thumb values, horizontal or
 * vertical orientation" from sliderMeta.purpose; disabled from
 * sliderMeta.a11y) with minimal props — no authored composition.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Slider } from "@/components/ui/slider"
import { sliderMeta } from "@/components/ui/slider.meta"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Atoms/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(sliderMeta) },
  },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

/** "single … values" — sliderMeta.purpose. */
export const SingleValue: Story = {
  render: () => (
    <div className="w-80">
      <Slider defaultValue={[50]} />
    </div>
  ),
}

/** "multi-thumb values" — sliderMeta.purpose. */
export const MultiThumb: Story = {
  render: () => (
    <div className="w-80">
      <Slider defaultValue={[25, 75]} />
    </div>
  ),
}

/** "vertical orientation" — sliderMeta.purpose. */
export const Vertical: Story = {
  render: () => (
    <div className="h-48">
      <Slider orientation="vertical" defaultValue={[50]} />
    </div>
  ),
}

/**
 * "Control styling responds to the data-disabled state set by the Base UI
 * primitive" — sliderMeta.a11y.
 */
export const Disabled: Story = {
  render: () => (
    <div className="w-80">
      <Slider defaultValue={[50]} disabled />
    </div>
  ),
}
