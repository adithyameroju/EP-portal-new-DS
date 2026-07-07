/**
 * Alert stories — S2.3.
 * Title from alertMeta.category ("molecule" → "Molecules"). The variant
 * gallery iterates alertMeta's variant axis over the spec's "Informational
 * alert" shape; composition shapes are verbatim from
 * .claude/specs/components/alert.md "Common patterns".
 */

import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { AlertCircle, Info, X } from "lucide-react"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { alertMeta } from "@/components/ui/alert.meta"
import { Button } from "@/components/ui/button"
import { metaDocsPage } from "./meta-doc-blocks"

type AlertProps = ComponentProps<typeof Alert>

const variantAxis = alertMeta.variants.find((axis) => axis.prop === "variant")!

const meta = {
  title: "Molecules/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(alertMeta) },
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

/**
 * One alert per `variant` axis value from alert.meta.ts, using the spec's
 * "Informational alert" title verbatim; description = the axis value.
 */
export const Variant: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      {variantAxis.values.map((value) => (
        <Alert key={value} variant={value as AlertProps["variant"]}>
          <AlertTitle>Policy renewal reminder</AlertTitle>
          <AlertDescription>variant: {value}</AlertDescription>
        </Alert>
      ))}
    </div>
  ),
}

/** Verbatim: spec:.claude/specs/components/alert.md "Error alert with icon". */
export const ErrorWithIcon: Story = {
  render: () => (
    <div className="w-96">
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>
          Your payment could not be processed. Please update your payment
          details.
        </AlertDescription>
      </Alert>
    </div>
  ),
}

/** Verbatim: spec:.claude/specs/components/alert.md "Alert with a close action". */
export const WithCloseAction: Story = {
  render: () => (
    <div className="w-96">
      <Alert>
        <Info />
        <AlertTitle>New feature available</AlertTitle>
        <AlertDescription>
          You can now download policy documents directly from the portal.
        </AlertDescription>
        <AlertAction>
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            aria-label="Dismiss"
          >
            <X />
          </Button>
        </AlertAction>
      </Alert>
    </div>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/alert.md "Alert with a link in the
 * description" — "Links inside `AlertDescription` are automatically underlined".
 */
export const LinkInDescription: Story = {
  render: () => (
    <div className="w-96">
      <Alert>
        <AlertTitle>Documents required</AlertTitle>
        <AlertDescription>
          Upload your RC book and driving licence to complete KYC.{" "}
          <a href="/upload">Upload now</a>
        </AlertDescription>
      </Alert>
    </div>
  ),
}
