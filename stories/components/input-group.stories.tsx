/**
 * InputGroup stories — generated from the S2.3 pattern.
 * Title from inputGroupMeta.category ("molecule" → "Molecules"). InputGroup
 * is UNSPECCED (inputGroupMeta is types-only) — galleries map the meta
 * `align` axis (InputGroupAddon's align in components/ui/input-group.tsx)
 * and `size` axis (InputGroupButton's size) with minimal children from
 * Compass primitives; the axis value string is the only rendered copy.
 * Flagged: the size gallery pins the addon to align="inline-end" (layout-only
 * choice so the wrapped input stays first); icon-size buttons take an icon
 * child + aria-label per the button.stories.tsx icon-size precedent (X icon).
 */

import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { X } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { inputGroupMeta } from "@/components/ui/input-group.meta"
import { metaDocsPage } from "./meta-doc-blocks"

type InputGroupAddonProps = ComponentProps<typeof InputGroupAddon>
type InputGroupButtonProps = ComponentProps<typeof InputGroupButton>

const alignAxis = inputGroupMeta.variants.find((axis) => axis.prop === "align")!
const sizeAxis = inputGroupMeta.variants.find((axis) => axis.prop === "size")!

const meta = {
  title: "Molecules/InputGroup",
  component: InputGroup,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(inputGroupMeta) },
  },
} satisfies Meta<typeof InputGroup>

export default meta
type Story = StoryObj<typeof meta>

/**
 * One InputGroup per `align` axis value from input-group.meta.ts, applied
 * to InputGroupAddon with an InputGroupText child.
 */
export const Align: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      {alignAxis.values.map((value) => (
        <InputGroup key={value}>
          <InputGroupInput aria-label={value} />
          <InputGroupAddon align={value as InputGroupAddonProps["align"]}>
            <InputGroupText>{value}</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      ))}
    </div>
  ),
}

/**
 * One InputGroup per `size` axis value from input-group.meta.ts, applied
 * to InputGroupButton inside an inline-end addon.
 */
export const ButtonSize: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      {sizeAxis.values.map((value) => (
        <InputGroup key={value}>
          <InputGroupInput aria-label={value} />
          <InputGroupAddon align="inline-end">
            {value.startsWith("icon") ? (
              <InputGroupButton
                size={value as InputGroupButtonProps["size"]}
                aria-label={value}
              >
                <X />
              </InputGroupButton>
            ) : (
              <InputGroupButton size={value as InputGroupButtonProps["size"]}>
                {value}
              </InputGroupButton>
            )}
          </InputGroupAddon>
        </InputGroup>
      ))}
    </div>
  ),
}
