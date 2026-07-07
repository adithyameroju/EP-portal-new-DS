/**
 * HoverCard stories — generated from the S2.3 pattern.
 * Title from hoverCardMeta.category ("molecule" → "Molecules"). HoverCard has
 * no variant axes (hoverCardMeta.variants = []); stories are the composition
 * shapes verbatim from .claude/specs/components/hover-card.md "Common
 * patterns". Simplifications (lane-B conventions, flagged inline):
 * - AvatarImage (src="/nikhil.jpg") dropped — no static asset in Storybook
 *   context; the spec's own AvatarFallback carries the slot;
 * - the policy-preview `{policy.*}` bindings filled from sibling spec sample
 *   data (table.md "Basic table with status badges" row POL-2024-001 /
 *   Motor / Dec 2026 / Active→Badge variant="default"; policy name from
 *   sheet.md "Motor Insurance 2024"); the spec's "Sum insured" row dropped —
 *   no spec-sourced fill value exists for it.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { hoverCardMeta } from "@/components/ui/hover-card.meta"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Molecules/HoverCard",
  component: HoverCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { page: metaDocsPage(hoverCardMeta) },
  },
} satisfies Meta<typeof HoverCard>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Verbatim: spec:.claude/specs/components/hover-card.md
 * "User profile hover card" (AvatarImage dropped — flagged in file header).
 */
export const UserProfile: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger render={<Button variant="link" className="p-0 h-auto" />}>
        @nikhil.thakkar
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarFallback>NT</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">Nikhil Thakkar</p>
            <p className="text-xs text-muted-foreground">Product Design Lead</p>
            <p className="text-xs text-muted-foreground">Joined March 2021</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}

/**
 * Verbatim shape: spec:.claude/specs/components/hover-card.md
 * "Policy preview on hover" (`{policy.*}` bindings filled from sibling spec
 * sample data — flagged in file header).
 */
export const PolicyPreview: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger
        render={<Button variant="link" className="p-0 h-auto font-normal" />}
      >
        POL-2024-001
      </HoverCardTrigger>
      <HoverCardContent side="right">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Motor Insurance 2024</p>
            <Badge variant="default">Active</Badge>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>Premium</span>
            <span>₹12,500/yr</span>
            <span>Expires</span>
            <span>Dec 2026</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/hover-card.md
 * "Term definition on hover".
 */
export const TermDefinition: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger
        render={<span className="cursor-help underline decoration-dotted" />}
      >
        IDV
      </HoverCardTrigger>
      <HoverCardContent>
        <p className="text-sm font-medium">Insured Declared Value</p>
        <p className="text-xs text-muted-foreground mt-1">
          The maximum sum insured that the insurance company will pay in case
          of total loss or theft of the vehicle.
        </p>
      </HoverCardContent>
    </HoverCard>
  ),
}
