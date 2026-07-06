/**
 * Select stories — S2.3 pattern-setter.
 * Title from selectMeta.category ("molecule" → "Molecules"). The size gallery
 * iterates selectMeta's size axis (a SelectTrigger prop); composition shapes
 * are verbatim from .claude/specs/components/select.md "Common patterns".
 */

import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { selectMeta } from "@/components/ui/select.meta"
import { metaDocsPage } from "./meta-doc-blocks"

type SelectTriggerProps = ComponentProps<typeof SelectTrigger>

const sizeAxis = selectMeta.variants.find((axis) => axis.prop === "size")!

const meta = {
  title: "Molecules/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(selectMeta) },
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

/**
 * One select per `size` axis value from select.meta.ts, using the spec's
 * "Basic select with placeholder" shape verbatim.
 */
export const Size: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      {sizeAxis.values.map((value) => (
        <Select key={value}>
          <SelectTrigger
            size={value as SelectTriggerProps["size"]}
            className="w-48"
            aria-label={value}
          >
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      ))}
    </div>
  ),
}

/** Verbatim: spec:.claude/specs/components/select.md "Select with groups and labels". */
export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select policy type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Motor</SelectLabel>
          <SelectItem value="car">Car Insurance</SelectItem>
          <SelectItem value="bike">Two-Wheeler Insurance</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Health</SelectLabel>
          <SelectItem value="individual">Individual Health</SelectItem>
          <SelectItem value="family">Family Health</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/select.md "Select paired with Label
 * (in a form)" — the `id` goes on SelectTrigger so htmlFor connects correctly.
 */
export const PairedWithLabel: Story = {
  render: () => (
    <div className="grid w-80 gap-1.5">
      <Label htmlFor="policy-type">Policy Type</Label>
      <Select>
        <SelectTrigger id="policy-type" className="w-full">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="motor">Motor</SelectItem>
          <SelectItem value="health">Health</SelectItem>
          <SelectItem value="life">Life</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

/** Verbatim: spec:.claude/specs/components/select.md "Disabled select". */
export const Disabled: Story = {
  render: () => (
    <div className="w-80">
      <Select disabled>
        <SelectTrigger className="w-full" aria-label="Not available">
          <SelectValue placeholder="Not available" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option">Option</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

/** Verbatim: spec:.claude/specs/components/select.md "Select with disabled items". */
export const DisabledItems: Story = {
  render: () => (
    <div className="w-80">
      <Select>
        <SelectTrigger className="w-full" aria-label="Select plan">
          <SelectValue placeholder="Select plan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="basic">Basic</SelectItem>
          <SelectItem value="standard">Standard</SelectItem>
          <SelectItem value="premium" disabled>
            Premium (unavailable in your region)
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}
