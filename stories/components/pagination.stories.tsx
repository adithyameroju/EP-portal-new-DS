/**
 * Pagination stories — S2.3 (types-only meta).
 * Title from paginationMeta.category ("molecule" → "Molecules"). No spec
 * exists (specStatus "none") and paginationMeta.variants = []; the story
 * composes the full sub-component anatomy from paginationMeta.childComponents
 * (content, item, link, previous, next, ellipsis) with mechanical page
 * numbers — no invented copy. Active state per paginationMeta.a11y:
 * "aria-current=page on the active PaginationLink".
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { paginationMeta } from "@/components/ui/pagination.meta"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Molecules/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(paginationMeta) },
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Full anatomy from paginationMeta.childComponents; `href="#"` keeps the
 * anchor-based links (see paginationMeta.purpose) non-navigating in Storybook.
 */
export const Default: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}
