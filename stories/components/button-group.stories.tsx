/**
 * ButtonGroup stories — S2.3.
 * Title from buttonGroupMeta.category ("molecule" → "Molecules"). UNSPECCED
 * (specStatus "none", aiHints.source "types-only"): the gallery maps
 * buttonGroupMeta's orientation axis generically with minimal children —
 * label text is the axis value (via ButtonGroupText) and the Compass Button
 * component name; ButtonGroupSeparator shows the remaining child part.
 */

import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Button } from "@/components/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group"
import { buttonGroupMeta } from "@/components/ui/button-group.meta"
import { metaDocsPage } from "./meta-doc-blocks"

type ButtonGroupProps = ComponentProps<typeof ButtonGroup>

const orientationAxis = buttonGroupMeta.variants.find(
  (axis) => axis.prop === "orientation",
)!

const meta = {
  title: "Molecules/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(buttonGroupMeta) },
  },
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

/**
 * One group per `orientation` axis value from button-group.meta.ts, with
 * minimal children: ButtonGroupText (label = the axis value), two Buttons,
 * and a ButtonGroupSeparator between them.
 */
export const Orientation: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-8">
      {orientationAxis.values.map((value) => (
        <ButtonGroup
          key={value}
          orientation={value as ButtonGroupProps["orientation"]}
        >
          <ButtonGroupText>{value}</ButtonGroupText>
          <Button variant="outline">button</Button>
          <ButtonGroupSeparator />
          <Button variant="outline">button</Button>
        </ButtonGroup>
      ))}
    </div>
  ),
}
