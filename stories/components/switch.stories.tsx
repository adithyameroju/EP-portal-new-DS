/**
 * Switch stories — S2.3.
 * Title from switchMeta.category ("atom" → "Atoms"). The size gallery
 * iterates switchMeta's size axis; composition shapes are verbatim from
 * .claude/specs/components/switch.md "Common patterns".
 * SIMPLIFICATION (lane-B convention c): the spec's "Controlled switch"
 * pattern (useState) is skipped — controlled-state examples are omitted
 * in Storybook context.
 */

import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { switchMeta } from "@/components/ui/switch.meta"
import { metaDocsPage } from "./meta-doc-blocks"

type SwitchProps = ComponentProps<typeof Switch>

const sizeAxis = switchMeta.variants.find((axis) => axis.prop === "size")!

const meta = {
  title: "Atoms/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(switchMeta) },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

/**
 * One switch per `size` axis value from switch.meta.ts, each in the spec's
 * "Switch with Label (standard)" shape.
 */
export const Size: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {sizeAxis.values.map((value) => (
        <div key={value} className="flex items-center gap-2">
          <Switch id={`size-${value}`} size={value as SwitchProps["size"]} />
          <Label htmlFor={`size-${value}`}>{value}</Label>
        </div>
      ))}
    </div>
  ),
}

/** Verbatim: spec:.claude/specs/components/switch.md "Switch with Label (standard)". */
export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="dark-mode" />
      <Label htmlFor="dark-mode">Dark mode</Label>
    </div>
  ),
}

/** Verbatim: spec:.claude/specs/components/switch.md "Switch in a horizontal Field (settings page pattern)". */
export const HorizontalField: Story = {
  render: () => (
    <Field orientation="horizontal">
      <div className="flex flex-col gap-0.5">
        <FieldLabel htmlFor="email-alerts">Email alerts</FieldLabel>
        <FieldDescription>Receive policy updates by email.</FieldDescription>
      </div>
      <Switch id="email-alerts" />
    </Field>
  ),
}

/** Verbatim: spec:.claude/specs/components/switch.md "Settings list with multiple switches". */
export const SettingsList: Story = {
  render: () => (
    <div className="flex flex-col divide-y">
      <Field orientation="horizontal" className="py-4">
        <div className="flex flex-col gap-0.5">
          <FieldLabel htmlFor="push-notif">Push notifications</FieldLabel>
          <FieldDescription>Alerts on your mobile device.</FieldDescription>
        </div>
        <Switch id="push-notif" defaultChecked />
      </Field>
      <Field orientation="horizontal" className="py-4">
        <div className="flex flex-col gap-0.5">
          <FieldLabel htmlFor="sms-notif">SMS notifications</FieldLabel>
          <FieldDescription>Text messages for important updates.</FieldDescription>
        </div>
        <Switch id="sms-notif" />
      </Field>
      <Field orientation="horizontal" className="py-4">
        <div className="flex flex-col gap-0.5">
          <FieldLabel htmlFor="marketing">Marketing emails</FieldLabel>
          <FieldDescription>Tips, offers, and news from Acko.</FieldDescription>
        </div>
        <Switch id="marketing" />
      </Field>
    </div>
  ),
}

/** Verbatim: spec:.claude/specs/components/switch.md "Disabled switch". */
export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="feature-flag" disabled />
      <Label htmlFor="feature-flag" className="opacity-50">
        Advanced analytics (coming soon)
      </Label>
    </div>
  ),
}

/** Verbatim: spec:.claude/specs/components/switch.md "Small switch (compact UI)". */
export const SmallSwitch: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="compact" size="sm" />
      <Label htmlFor="compact" className="text-xs">
        Show preview
      </Label>
    </div>
  ),
}
