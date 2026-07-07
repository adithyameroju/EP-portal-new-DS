/**
 * Breadcrumb stories — S2.3.
 * Title from breadcrumbMeta.category ("molecule" → "Molecules"). Breadcrumb
 * has no variant axes (breadcrumbMeta.variants = []); stories are the
 * composition shapes verbatim from .claude/specs/components/breadcrumb.md
 * "Common patterns". FLAG (lane-B simplification b): the spec's next/link
 * render targets are dropped in Storybook context — BreadcrumbLink renders
 * its default plain anchor with href instead of render={<Link .../>}.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { breadcrumbMeta } from "@/components/ui/breadcrumb.meta"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Molecules/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(breadcrumbMeta) },
  },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Spec "Standard 3-level breadcrumb" shape (see file header for the
 * next/link simplification).
 */
export const StandardTrail: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/policies">Policies</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Motor Insurance 2024</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
}

/**
 * Spec "Breadcrumb with collapsed middle (ellipsis)" shape — "Use
 * `BreadcrumbEllipsis` when the trail is long and middle crumbs are hidden"
 * (see file header for the next/link simplification).
 */
export const CollapsedMiddle: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/policies">Policies</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Claim Details</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
}

/**
 * Spec "Custom separator" — "Override the default ChevronRight by passing
 * children to `BreadcrumbSeparator`". FLAG: the spec snippet is the separator
 * line only; it is hosted here in the spec's "Standard 3-level breadcrumb"
 * shape (with the file-header next/link simplification).
 */
export const CustomSeparator: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="/policies">Policies</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Motor Insurance 2024</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
}
