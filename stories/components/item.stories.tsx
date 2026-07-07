/**
 * Item stories — generated from the S2.3 pattern.
 * Title from itemMeta.category ("molecule" → "Molecules"). Item is UNSPECCED
 * (itemMeta is types-only) — galleries map the meta `variant` and `size`
 * axes with minimal children from Compass primitives; the axis value string
 * is the title text and "Description" is the only other rendered copy
 * (neutral strings per the unspecced convention). The variant gallery is
 * wrapped in ItemGroup + ItemSeparator to exercise the meta childComponents;
 * the size gallery pins variant="outline" so the sized box is visible
 * (layout-only choice, flagged).
 */

import { Fragment, type ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { itemMeta } from "@/components/ui/item.meta"
import { metaDocsPage } from "./meta-doc-blocks"

type ItemProps = ComponentProps<typeof Item>

const variantAxis = itemMeta.variants.find((axis) => axis.prop === "variant")!
const sizeAxis = itemMeta.variants.find((axis) => axis.prop === "size")!

const meta = {
  title: "Molecules/Item",
  component: Item,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(itemMeta) },
  },
} satisfies Meta<typeof Item>

export default meta
type Story = StoryObj<typeof meta>

/**
 * One Item per `variant` axis value from item.meta.ts, listed inside
 * ItemGroup with ItemSeparators (meta childComponents composition).
 */
export const Variant: Story = {
  render: () => (
    <ItemGroup className="w-96">
      {variantAxis.values.map((value, index) => (
        <Fragment key={value}>
          {index > 0 ? <ItemSeparator /> : null}
          <Item variant={value as ItemProps["variant"]}>
            <ItemContent>
              <ItemTitle>{value}</ItemTitle>
              <ItemDescription>Description</ItemDescription>
            </ItemContent>
          </Item>
        </Fragment>
      ))}
    </ItemGroup>
  ),
}

/** One Item per `size` axis value from item.meta.ts (outline for visibility). */
export const Size: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      {sizeAxis.values.map((value) => (
        <Item key={value} variant="outline" size={value as ItemProps["size"]}>
          <ItemContent>
            <ItemTitle>{value}</ItemTitle>
            <ItemDescription>Description</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </div>
  ),
}
