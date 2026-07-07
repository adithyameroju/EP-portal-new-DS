/**
 * Label stories — generated from the S2.3 pattern.
 * Title from labelMeta.category ("atom" → "Atoms"). Label has no variant
 * axes (labelMeta.variants = []); stories are the composition shapes
 * verbatim from .claude/specs/components/label.md "Common patterns", each
 * pairing Label with Compass Input per the spec. Simplifications (lane-B
 * conventions, flagged inline): w-80 story wrapper widths are the only
 * non-spec layout choice; the "Label with icon" spec snippet gets the Input
 * its htmlFor points at, per the spec's own rule "Always connect Label to
 * its control via htmlFor/id".
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { SearchIcon } from "lucide-react"

import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { labelMeta } from "@/components/ui/label.meta"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Atoms/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(labelMeta) },
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

/** Verbatim: spec:.claude/specs/components/label.md "Label with an input (standard)". */
export const WithInput: Story = {
  render: () => (
    <div className="grid w-80 gap-1.5">
      <Label htmlFor="email">Email address</Label>
      <Input id="email" type="email" />
    </div>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/label.md "Label with disabled
 * input (standalone)" — "The input must come before the label for
 * auto-dimming to work".
 */
export const WithDisabledInput: Story = {
  render: () => (
    <div className="flex w-80 items-center gap-2">
      <Input id="readonly-field" disabled />
      <Label htmlFor="readonly-field">Read-only field</Label>
    </div>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/label.md "Label inside a Field
 * (preferred for forms)" — "Inside a Field, disabled state is handled
 * automatically regardless of DOM order".
 */
export const InsideField: Story = {
  render: () => (
    <Field className="w-80">
      <FieldLabel htmlFor="policy-name">Policy name</FieldLabel>
      <Input id="policy-name" />
    </Field>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/label.md "Label with icon" —
 * "Label's built-in flex items-center gap-2 handles an icon before the
 * text". Input added so htmlFor="search" resolves (flagged in file header).
 */
export const WithIcon: Story = {
  render: () => (
    <div className="grid w-80 gap-1.5">
      <Label htmlFor="search">
        <SearchIcon className="size-3.5" />
        Search policies
      </Label>
      <Input id="search" />
    </div>
  ),
}
