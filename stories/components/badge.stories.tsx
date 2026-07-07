/**
 * Badge stories — S2.3.
 * Title from badgeMeta.category ("atom" → "Atoms"). The variant gallery maps
 * badgeMeta's variant axis generically; composition shapes are verbatim from
 * .claude/specs/components/badge.md "Common patterns".
 */

import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { CheckCircle2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { badgeMeta } from "@/components/ui/badge.meta"
import { metaDocsPage } from "./meta-doc-blocks"

type BadgeProps = ComponentProps<typeof Badge>

const variantAxis = badgeMeta.variants.find((axis) => axis.prop === "variant")!

const meta = {
  title: "Atoms/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(badgeMeta) },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

/** One badge per `variant` axis value from badge.meta.ts. */
export const Variant: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {variantAxis.values.map((value) => (
        <Badge key={value} variant={value as BadgeProps["variant"]}>
          {value}
        </Badge>
      ))}
    </div>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/badge.md "Status badge (most common
 * usage)" — the Acko status-to-variant mapping.
 */
export const StatusBadge: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="default">Active</Badge>
      <Badge variant="outline">Pending</Badge>
      <Badge variant="destructive">Expired</Badge>
      <Badge variant="secondary">Cancelled</Badge>
    </div>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/badge.md "Badge with icon" —
 * "Icons inside Badge are automatically sized to `size-3` (12px)".
 */
export const WithIcon: Story = {
  render: () => (
    <Badge variant="default">
      <CheckCircle2 />
      Verified
    </Badge>
  ),
}

/** Verbatim: spec:.claude/specs/components/badge.md "Badge as a tag/category label". */
export const TagLabel: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="outline">Motor</Badge>
      <Badge variant="outline">Health</Badge>
      <Badge variant="outline">Life</Badge>
    </div>
  ),
}

/**
 * Spec "Badge rendered as a link" shape. FLAG (lane-B simplification b):
 * the spec's next/link render target is dropped in Storybook context —
 * rendered as a plain anchor via the same render prop.
 */
export const AsLink: Story = {
  render: () => (
    <Badge variant="link" render={<a href="/policies/active" />}>
      View active policies
    </Badge>
  ),
}
