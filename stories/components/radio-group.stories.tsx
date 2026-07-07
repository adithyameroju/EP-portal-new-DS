/**
 * RadioGroup stories — S2.3.
 * Title from radioGroupMeta.category ("molecule" → "Molecules"). RadioGroup
 * has no variant axes (radioGroupMeta.variants = []); stories are the
 * composition shapes verbatim from .claude/specs/components/radio-group.md
 * "Common patterns".
 * Simplifications (flagged per story):
 * - "Controlled radio group" is skipped per lane-B convention
 *   (controlled-state useState examples).
 * - "Radio group with error state": the spec's `hasSelection` state is pinned
 *   to `false` so the error state renders statically.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { radioGroupMeta } from "@/components/ui/radio-group.meta"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Molecules/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(radioGroupMeta) },
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

/** Verbatim: spec:.claude/specs/components/radio-group.md "Standard radio group (vertical)". */
export const StandardVertical: Story = {
  render: () => (
    <RadioGroup defaultValue="motor">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="motor" id="type-motor" />
        <Label htmlFor="type-motor">Motor</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="health" id="type-health" />
        <Label htmlFor="type-health">Health</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="life" id="type-life" />
        <Label htmlFor="type-life">Life</Label>
      </div>
    </RadioGroup>
  ),
}

/** Verbatim: spec:.claude/specs/components/radio-group.md "Radio group inside a FieldSet". */
export const InsideFieldSet: Story = {
  render: () => (
    <FieldSet>
      <FieldLegend>Coverage type</FieldLegend>
      <RadioGroup defaultValue="comprehensive">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="comprehensive" id="cov-comp" />
          <Label htmlFor="cov-comp">Comprehensive</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="third-party" id="cov-tp" />
          <Label htmlFor="cov-tp">Third-party only</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="own-damage" id="cov-od" />
          <Label htmlFor="cov-od">Own damage only</Label>
        </div>
      </RadioGroup>
    </FieldSet>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/radio-group.md
 * "Radio group with description per option" (Field system rich options).
 */
export const WithDescriptions: Story = {
  render: () => (
    <FieldSet>
      <FieldLegend>Payment frequency</FieldLegend>
      <RadioGroup defaultValue="annual">
        <Field orientation="horizontal">
          <RadioGroupItem value="monthly" id="freq-monthly" />
          <FieldContent>
            <FieldTitle>Monthly</FieldTitle>
            <FieldDescription>₹1,050/month — pay as you go</FieldDescription>
          </FieldContent>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="annual" id="freq-annual" />
          <FieldContent>
            <FieldTitle>Annual</FieldTitle>
            <FieldDescription>₹12,000/year — save ₹600</FieldDescription>
          </FieldContent>
        </Field>
      </RadioGroup>
    </FieldSet>
  ),
}

/** Verbatim: spec:.claude/specs/components/radio-group.md "Horizontal radio group (compact)". */
export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="active" className="flex flex-row gap-4">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="active" id="status-active" />
        <Label htmlFor="status-active">Active</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="inactive" id="status-inactive" />
        <Label htmlFor="status-inactive">Inactive</Label>
      </div>
    </RadioGroup>
  ),
}

// Spec "Radio group with error state" `hasSelection` pinned to false so the
// error state renders statically (see file header).
const hasSelection = false

/** Verbatim: spec:.claude/specs/components/radio-group.md "Radio group with error state". */
export const ErrorState: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <RadioGroup aria-invalid={!hasSelection}>
        <div className="flex items-center gap-2">
          <RadioGroupItem
            value="yes"
            id="consent-yes"
            aria-invalid={!hasSelection}
          />
          <Label htmlFor="consent-yes">Yes, I consent</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem
            value="no"
            id="consent-no"
            aria-invalid={!hasSelection}
          />
          <Label htmlFor="consent-no">No, I decline</Label>
        </div>
      </RadioGroup>
      {!hasSelection && (
        <p className="text-sm text-destructive">
          Please select an option to continue.
        </p>
      )}
    </div>
  ),
}
