/**
 * Card stories — S2.3 pattern-setter.
 * Title from cardMeta.category ("molecule" → "Molecules"). Composition shapes
 * verbatim from .claude/specs/components/card.md "Common patterns"; the size
 * gallery iterates cardMeta's size axis over the spec's "Basic card" shape.
 */

import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cardMeta } from "@/components/ui/card.meta"
import { metaDocsPage } from "./meta-doc-blocks"

type CardProps = ComponentProps<typeof Card>

const sizeAxis = cardMeta.variants.find((axis) => axis.prop === "size")!

const meta = {
  title: "Molecules/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(cardMeta) },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

/**
 * One card per `size` axis value from card.meta.ts, using the spec's
 * "Basic card with title and content" shape verbatim.
 */
export const Size: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      {sizeAxis.values.map((value) => (
        <Card key={value} size={value as CardProps["size"]}>
          <CardHeader>
            <CardTitle>Policy Details</CardTitle>
            <CardDescription>View and manage your active policy.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">size: {value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
}

/** Verbatim: spec:.claude/specs/components/card.md "Card with actions in footer". */
export const FooterActions: Story = {
  render: () => (
    <div className="w-96">
      <Card>
        <CardHeader>
          <CardTitle>Confirm Cancellation</CardTitle>
          <CardDescription>This action cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your policy will be cancelled effective immediately.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Go Back</Button>
          <Button variant="destructive">Cancel Policy</Button>
        </CardFooter>
      </Card>
    </div>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/card.md "Card with header action" —
 * DOM order CardTitle → CardAction → CardDescription is required.
 */
export const HeaderAction: Story = {
  render: () => (
    <div className="w-96">
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardAction>
            <Button variant="link" type="button">
              Sign up
            </Button>
          </CardAction>
          <CardDescription>Enter your email below to log in.</CardDescription>
        </CardHeader>
        <CardContent>{/* form fields */}</CardContent>
      </Card>
    </div>
  ),
}
