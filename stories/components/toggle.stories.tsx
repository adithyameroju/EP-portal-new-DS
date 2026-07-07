/**
 * Toggle stories — S2.3.
 * Title from toggleMeta.category ("atom" → "Atoms"). Toggle is types-only
 * (specStatus "none") but carries variant axes; galleries iterate
 * toggleMeta's `variant` and `size` axes generically — label text = the
 * axis value string itself (button-story convention).
 */

import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Toggle } from "@/components/ui/toggle"
import { toggleMeta } from "@/components/ui/toggle.meta"
import { metaDocsPage } from "./meta-doc-blocks"

type ToggleProps = ComponentProps<typeof Toggle>

const variantAxis = toggleMeta.variants.find((axis) => axis.prop === "variant")!
const sizeAxis = toggleMeta.variants.find((axis) => axis.prop === "size")!

const meta = {
  title: "Atoms/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(toggleMeta) },
  },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

/** One toggle per `variant` axis value from toggle.meta.ts. */
export const Variant: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {variantAxis.values.map((value) => (
        <Toggle key={value} variant={value as ToggleProps["variant"]}>
          {value}
        </Toggle>
      ))}
    </div>
  ),
}

/** One toggle per `size` axis value from toggle.meta.ts. */
export const Size: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {sizeAxis.values.map((value) => (
        <Toggle key={value} size={value as ToggleProps["size"]}>
          {value}
        </Toggle>
      ))}
    </div>
  ),
}

/**
 * "Pressed styling responds to aria-pressed (and the data-state=on
 * attribute) set by the Base UI primitive" — toggleMeta.a11y.
 */
export const Pressed: Story = {
  render: () => <Toggle defaultPressed>pressed</Toggle>,
}
