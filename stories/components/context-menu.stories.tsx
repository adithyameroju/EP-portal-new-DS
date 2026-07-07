/**
 * ContextMenu stories — S2.3 generation pass.
 * Title from contextMenuMeta.category ("organism" → "Organisms"). Covers the
 * `variant` axis (ContextMenuItem) generically; composed examples verbatim
 * from .claude/specs/components/context-menu.md "Common patterns". Overlay
 * layout parameters copied from dialog.stories.tsx.
 */

import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Download, Eye, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { contextMenuMeta } from "@/components/ui/context-menu.meta"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { metaDocsPage } from "./meta-doc-blocks"

type ContextMenuItemProps = ComponentProps<typeof ContextMenuItem>

const variantAxis = contextMenuMeta.variants.find(
  (axis) => axis.prop === "variant",
)!

const meta = {
  title: "Organisms/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { page: metaDocsPage(contextMenuMeta) },
  },
} satisfies Meta<typeof ContextMenu>

export default meta
type Story = StoryObj<typeof meta>

/**
 * One ContextMenuItem per `variant` axis value from context-menu.meta.ts.
 * The destructive value sits below a ContextMenuSeparator (spec rule 4:
 * "Destructive actions must be below a separator"). The trigger is the
 * spec's Card trigger shape; its text is quoted from contextMenuMeta.a11y
 * ("Opens on right-click, or long-press on touch devices"). w-80 is the
 * lane-B sized-wrapper convention.
 */
export const ItemVariant: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger
        render={<Card className="w-80 cursor-context-menu" />}
      >
        <CardContent className="text-sm text-muted-foreground">
          Opens on right-click, or long-press on touch devices
        </CardContent>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {variantAxis.values.map((value) => (
          <ContextMenuItem
            key={value}
            variant={value as ContextMenuItemProps["variant"]}
          >
            {value}
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/context-menu.md
 * "Table row context menu". Simplifications (flagged): the spec's TableRow
 * fragment is embedded in Table > TableBody for valid table markup; the
 * data-bound expressions ({policy.name}, {policy.premium}, {policy.status},
 * statusVariant) are filled with static values in the spec's own domain
 * shape. w-96 is the lane-B sized-wrapper convention.
 */
export const TableRowMenu: Story = {
  render: () => (
    <div className="w-96">
      <Table>
        <TableBody>
          <ContextMenu>
            <ContextMenuTrigger
              render={<TableRow className="cursor-context-menu" />}
            >
              <TableCell>Motor Insurance 2024</TableCell>
              <TableCell>₹12,500</TableCell>
              <TableCell>
                <Badge variant="secondary">Active</Badge>
              </TableCell>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>
                <Eye />
                View details
              </ContextMenuItem>
              <ContextMenuItem>
                <Download />
                Download PDF
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem variant="destructive">
                <Trash2 />
                Cancel policy
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </TableBody>
      </Table>
    </div>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/context-menu.md
 * "Context menu on a card or list item". Simplification (flagged): the
 * data-bound expressions ({document.name}, {document.date}) are filled with
 * static values in the spec's own domain shape. w-80 is the lane-B
 * sized-wrapper convention.
 */
export const CardMenu: Story = {
  render: () => (
    <div className="w-80">
      <ContextMenu>
        <ContextMenuTrigger render={<Card className="cursor-context-menu" />}>
          <CardHeader>
            <CardTitle>Policy Document</CardTitle>
            <CardDescription>12 Mar 2026</CardDescription>
          </CardHeader>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Open</ContextMenuItem>
          <ContextMenuItem>Rename</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuSub>
            <ContextMenuSubTrigger>Share</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>Email link</ContextMenuItem>
              <ContextMenuItem>Copy link</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/context-menu.md
 * "Context menu with checkbox and radio items". Simplifications (flagged):
 * the spec shows only the ContextMenuContent fragment — it is wrapped in a
 * ContextMenu with the spec's Card trigger shape, its text quoted from
 * contextMenuMeta.useCases; the controlled checked/value state
 * (showThumbnails, sortBy) becomes uncontrolled defaultChecked/defaultValue
 * (lane-B: controlled-state examples are skipped). w-80 is the lane-B
 * sized-wrapper convention.
 */
export const CheckboxAndRadioItems: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger
        render={<Card className="w-80 cursor-context-menu" />}
      >
        <CardContent className="text-sm text-muted-foreground">
          View options with toggleable checkbox items (show thumbnails)
        </CardContent>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>View</ContextMenuLabel>
        <ContextMenuCheckboxItem defaultChecked>
          Show thumbnails
        </ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuLabel>Sort by</ContextMenuLabel>
        <ContextMenuRadioGroup defaultValue="name">
          <ContextMenuRadioItem value="name">Name</ContextMenuRadioItem>
          <ContextMenuRadioItem value="date">Date</ContextMenuRadioItem>
          <ContextMenuRadioItem value="size">Size</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  ),
}
