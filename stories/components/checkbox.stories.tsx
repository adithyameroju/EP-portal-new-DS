/**
 * Checkbox stories — S2.3 generation pass.
 * Title from checkboxMeta.category ("atom" → "Atoms"). Checkbox has no
 * variant axes (checkboxMeta.variants = []); stories are the composition
 * shapes verbatim from .claude/specs/components/checkbox.md "Common
 * patterns". Skipped per lane-B conventions: "Controlled checkbox"
 * (controlled useState example).
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Checkbox } from "@/components/ui/checkbox"
import { checkboxMeta } from "@/components/ui/checkbox.meta"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Atoms/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(checkboxMeta) },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

/** Verbatim: spec:.claude/specs/components/checkbox.md "Checkbox with Label (standard)". */
export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">I agree to the terms and conditions</Label>
    </div>
  ),
}

/** Verbatim: spec:.claude/specs/components/checkbox.md "Checkbox group with FieldSet". */
export const GroupWithFieldSet: Story = {
  render: () => (
    <FieldSet>
      <FieldLegend>Select coverage types</FieldLegend>

      <Field orientation="horizontal">
        <Checkbox id="coverage-own-damage" />
        <FieldContent>
          <FieldTitle>Own Damage</FieldTitle>
          <FieldDescription>Covers damage to your own vehicle.</FieldDescription>
        </FieldContent>
      </Field>

      <Field orientation="horizontal">
        <Checkbox id="coverage-third-party" />
        <FieldContent>
          <FieldTitle>Third-Party Liability</FieldTitle>
          <FieldDescription>Covers damage caused to others.</FieldDescription>
        </FieldContent>
      </Field>

      <Field orientation="horizontal">
        <Checkbox id="coverage-personal-accident" />
        <FieldContent>
          <FieldTitle>Personal Accident</FieldTitle>
          <FieldDescription>Covers injury or death of the driver.</FieldDescription>
        </FieldContent>
      </Field>
    </FieldSet>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/checkbox.md "Checkbox with error state".
 * Simplification (flagged): the spec's external `hasConsented` state is fixed
 * to the error-visible case — aria-invalid is set and the error message
 * renders unconditionally (lane-B: controlled-state examples are skipped).
 */
export const ErrorState: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Checkbox id="consent" aria-invalid />
        <Label htmlFor="consent">I have read the policy document</Label>
      </div>
      <p className="text-sm text-destructive">
        You must read and agree before continuing.
      </p>
    </div>
  ),
}

/** Verbatim: spec:.claude/specs/components/checkbox.md "Disabled checkbox". */
export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="auto-renew" disabled />
      <Label htmlFor="auto-renew" className="opacity-50">
        Auto-renew (not available for this policy type)
      </Label>
    </div>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/checkbox.md
 * "'Select all' with indeterminate state". Simplification (flagged): the
 * spec's derived allChecked/someChecked state is fixed to the mixed case —
 * the separate `indeterminate` boolean prop is set statically (lane-B:
 * controlled-state examples are skipped).
 */
export const Indeterminate: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="select-all" indeterminate />
      <Label htmlFor="select-all">Select all</Label>
    </div>
  ),
}
