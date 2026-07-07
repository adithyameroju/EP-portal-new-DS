/**
 * NativeSelect stories — S2.3 (types-only meta).
 * Title from nativeSelectMeta.category ("atom" → "Atoms"). No spec exists
 * (specStatus "none"); galleries map nativeSelectMeta variant axes with
 * minimal Compass-composed children. All rendered text is mechanical —
 * axis value strings and meta.childComponents names — no invented copy.
 */

import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { nativeSelectMeta } from "@/components/ui/native-select.meta"
import { metaDocsPage } from "./meta-doc-blocks"

type NativeSelectProps = ComponentProps<typeof NativeSelect>

const sizeAxis = nativeSelectMeta.variants.find((axis) => axis.prop === "size")!

const meta = {
  title: "Atoms/NativeSelect",
  component: NativeSelect,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(nativeSelectMeta) },
  },
} satisfies Meta<typeof NativeSelect>

export default meta
type Story = StoryObj<typeof meta>

/**
 * One select per `size` axis value from native-select.meta.ts; option labels
 * are the axis value strings themselves.
 */
export const Size: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      {sizeAxis.values.map((value) => (
        <NativeSelect
          key={value}
          size={value as NativeSelectProps["size"]}
          aria-label={value}
          defaultValue={value}
        >
          {sizeAxis.values.map((option) => (
            <NativeSelectOption key={option} value={option}>
              {option}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      ))}
    </div>
  ),
}

/**
 * Option/optgroup wrappers from nativeSelectMeta.childComponents
 * ("native-select-option", "native-select-optgroup"), labeled by those
 * sub-component names.
 */
export const OptionGroups: Story = {
  render: () => (
    <NativeSelect aria-label={nativeSelectMeta.name}>
      <NativeSelectOptGroup label="native-select-optgroup">
        <NativeSelectOption value="native-select-option">
          native-select-option
        </NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  ),
}
