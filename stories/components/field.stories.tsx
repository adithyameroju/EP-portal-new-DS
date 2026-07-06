/**
 * Field stories — S2.3 pattern-setter.
 * Title from fieldMeta.category ("molecule" → "Molecules"). The orientation
 * gallery uses the spec's own per-orientation examples
 * (.claude/specs/components/field.md#field-orientation); the legend-variant
 * gallery iterates fieldMeta's FieldLegend `variant` axis over the spec's
 * FieldSet pattern. Composed forms are verbatim from "Common patterns".
 */

import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { fieldMeta } from "@/components/ui/field.meta"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { metaDocsPage } from "./meta-doc-blocks"

type FieldLegendProps = ComponentProps<typeof FieldLegend>

const legendVariantAxis = fieldMeta.variants.find(
  (axis) => axis.prop === "variant",
)!

const meta = {
  title: "Molecules/Field",
  component: Field,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(fieldMeta) },
  },
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

/**
 * One Field per `orientation` axis value, each verbatim from
 * spec:.claude/specs/components/field.md#field-orientation
 * (vertical / horizontal / responsive examples).
 */
export const Orientation: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-6">
      {/* Vertical (default) */}
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" type="email" />
      </Field>
      {/* Horizontal */}
      <Field orientation="horizontal">
        <FieldLabel htmlFor="notifications">Email notifications</FieldLabel>
        <Switch id="notifications" />
      </Field>
      {/* Responsive */}
      <Field orientation="responsive">
        <FieldLabel htmlFor="name">Full Name</FieldLabel>
        <Input id="name" />
      </Field>
    </div>
  ),
}

/**
 * One FieldSet per FieldLegend `variant` axis value from field.meta.ts,
 * using the spec's "Checkbox group with FieldSet" shape.
 */
export const LegendVariant: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-6">
      {legendVariantAxis.values.map((value) => (
        <FieldSet key={value}>
          <FieldLegend variant={value as FieldLegendProps["variant"]}>
            Notification preferences
          </FieldLegend>
          <Field orientation="horizontal">
            <Checkbox id={`email-notif-${value}`} />
            <FieldContent>
              <FieldTitle>Email</FieldTitle>
              <FieldDescription>Receive policy updates by email.</FieldDescription>
            </FieldContent>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id={`sms-notif-${value}`} />
            <FieldContent>
              <FieldTitle>SMS</FieldTitle>
              <FieldDescription>Receive alerts by text message.</FieldDescription>
            </FieldContent>
          </Field>
        </FieldSet>
      ))}
    </div>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/field.md "Standard form with
 * validation" (FieldError shown with the spec's Option A errors array).
 */
export const StandardForm: Story = {
  render: () => (
    <form className="grid w-96 gap-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="form-name">Full Name</FieldLabel>
          <Input id="form-name" placeholder="Rahul Sharma" />
        </Field>
        <Field>
          <FieldLabel htmlFor="form-email">Email Address</FieldLabel>
          <Input id="form-email" type="email" placeholder="rahul@acko.com" />
          <FieldDescription>
            We&apos;ll send your policy documents to this address.
          </FieldDescription>
          <FieldError errors={[{ message: "Email is required" }]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="form-phone">Phone Number</FieldLabel>
          <Input id="form-phone" type="tel" placeholder="+91 98765 43210" />
          <FieldError>Please enter a valid 10-digit number</FieldError>
        </Field>
      </FieldGroup>
      <Button type="submit" className="w-full">
        Continue
      </Button>
    </form>
  ),
}

/** Verbatim: spec:.claude/specs/components/field.md "Field with separator". */
export const WithSeparator: Story = {
  render: () => (
    <div className="w-96">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="first-name">First Name</FieldLabel>
          <Input id="first-name" />
        </Field>
        <FieldSeparator>or</FieldSeparator>
        <Field>
          <FieldLabel htmlFor="full-name">Full Name</FieldLabel>
          <Input id="full-name" />
        </Field>
      </FieldGroup>
    </div>
  ),
}
