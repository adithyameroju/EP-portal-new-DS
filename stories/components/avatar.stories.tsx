/**
 * Avatar stories — S2.3.
 * Title from avatarMeta.category ("atom" → "Atoms"). The size gallery iterates
 * avatarMeta's size axis over the spec's "Avatar sizes" shape; composition
 * shapes are verbatim from .claude/specs/components/avatar.md "Common patterns".
 * NOTE: spec image srcs ("/avatar.jpg" etc.) do not resolve in Storybook, so
 * AvatarFallback renders — the spec's own designed fallback behavior
 * ("it is what the user sees when the image fails to load").
 */

import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import { avatarMeta } from "@/components/ui/avatar.meta"
import { metaDocsPage } from "./meta-doc-blocks"

type AvatarProps = ComponentProps<typeof Avatar>

const sizeAxis = avatarMeta.variants.find((axis) => axis.prop === "size")!

const meta = {
  title: "Atoms/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(avatarMeta) },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

/**
 * One avatar per `size` axis value from avatar.meta.ts, using the spec's
 * "Avatar sizes" shape verbatim.
 */
export const Size: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {sizeAxis.values.map((value) => (
        <Avatar key={value} size={value as AvatarProps["size"]}>
          <AvatarImage src="/avatar.jpg" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
}

/** Verbatim: spec:.claude/specs/components/avatar.md "Avatar with status badge". */
export const WithStatusBadge: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="/avatar.jpg" alt="Priya Sharma" />
      <AvatarFallback>PS</AvatarFallback>
      <AvatarBadge />
    </Avatar>
  ),
}

/** Verbatim: spec:.claude/specs/components/avatar.md "Fallback-only avatar (no image)". */
export const FallbackOnly: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>NT</AvatarFallback>
    </Avatar>
  ),
}

/** Verbatim: spec:.claude/specs/components/avatar.md "Avatar group (team / assignees)". */
export const Group: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar>
        <AvatarImage src="/user1.jpg" alt="User 1" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="/user2.jpg" alt="User 2" />
        <AvatarFallback>U2</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="/user3.jpg" alt="User 3" />
        <AvatarFallback>U3</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+4</AvatarGroupCount>
    </AvatarGroup>
  ),
}

/** Verbatim: spec:.claude/specs/components/avatar.md "Avatar in a user profile row". */
export const ProfileRow: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar size="lg">
        <AvatarImage src="/nikhil.jpg" alt="Nikhil Thakkar" />
        <AvatarFallback>NT</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium">Nikhil Thakkar</span>
        <span className="text-xs text-muted-foreground">nikhil@acko.com</span>
      </div>
    </div>
  ),
}
