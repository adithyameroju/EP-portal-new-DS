/**
 * DropdownMenu stories — generated from the S2.3 pattern.
 * Title from dropdownMenuMeta.category ("organism" → "Organisms"). ItemVariant
 * maps dropdownMenuMeta's `variant` axis; composition stories are verbatim
 * from .claude/specs/components/dropdown-menu.md "Common patterns".
 * Simplifications (lane-B conventions, flagged inline):
 * - content-only spec fragments are wrapped in the spec's own root + trigger
 *   shape from "Menu with grouped sections and labels" for self-containment;
 * - controlled checkbox/radio props (useState in the spec) are replaced with
 *   uncontrolled defaultChecked/defaultValue equivalents (lane-B convention
 *   (c) adapted: the shapes are kept instead of skipped so the checkbox/radio
 *   sub-components render in the gallery).
 */

import { Fragment, type ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import {
  Download,
  Edit,
  Eye,
  FileText,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Search,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { dropdownMenuMeta } from "@/components/ui/dropdown-menu.meta"
import { metaDocsPage } from "./meta-doc-blocks"

type DropdownMenuItemProps = ComponentProps<typeof DropdownMenuItem>

const variantAxis = dropdownMenuMeta.variants.find(
  (axis) => axis.prop === "variant",
)!

const meta = {
  title: "Organisms/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { page: metaDocsPage(dropdownMenuMeta) },
  },
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

/**
 * One DropdownMenuItem per `variant` axis value from dropdown-menu.meta.ts.
 * The destructive value sits below a DropdownMenuSeparator per the spec rule
 * "Always put a destructive action below a separator."
 */
export const ItemVariant: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        {variantAxis.prop}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {variantAxis.values.map((value) =>
          value === "destructive" ? (
            <Fragment key={value}>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant={value as DropdownMenuItemProps["variant"]}
              >
                {value}
              </DropdownMenuItem>
            </Fragment>
          ) : (
            <DropdownMenuItem
              key={value}
              variant={value as DropdownMenuItemProps["variant"]}
            >
              {value}
            </DropdownMenuItem>
          ),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/dropdown-menu.md
 * "Standard action menu (most common — table row actions)".
 */
export const StandardActionMenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
        <MoreHorizontal />
        <span className="sr-only">Open actions</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Eye />
          View details
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Edit />
          Edit policy
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2 />
          Cancel policy
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/dropdown-menu.md
 * "Menu with grouped sections and labels".
 */
export const GroupedSections: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Actions
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Policy</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <FileText />
            View document
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Download />
            Download PDF
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Support</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Phone />
            Contact agent
          </DropdownMenuItem>
          <DropdownMenuItem>
            <MessageSquare />
            Raise a query
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

/**
 * Verbatim content: spec:.claude/specs/components/dropdown-menu.md
 * "Menu with keyboard shortcuts". The spec fragment is content-only —
 * wrapped in the spec's "Menu with grouped sections" root + trigger shape
 * for self-containment (flagged simplification).
 */
export const KeyboardShortcuts: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Actions
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Search />
          Search
          <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Download />
          Export
          <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

/**
 * Verbatim content: spec:.claude/specs/components/dropdown-menu.md
 * "Checkbox items (view settings toggle)". Flagged simplifications:
 * content-only fragment wrapped as above; the spec's controlled
 * checked/onCheckedChange (useState) replaced with defaultChecked so both
 * checked and unchecked states render.
 */
export const CheckboxItems: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Actions
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>View options</DropdownMenuLabel>
        <DropdownMenuCheckboxItem defaultChecked>
          Show premium amount
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Show expiry date</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

/**
 * Verbatim content: spec:.claude/specs/components/dropdown-menu.md
 * "Radio items (sorting)". Flagged simplifications: content-only fragment
 * wrapped as above; the spec's controlled value/onValueChange (useState)
 * replaced with defaultValue set to the spec's first value.
 */
export const RadioItems: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Actions
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuRadioGroup defaultValue="name">
          <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="date">Date issued</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="premium">
            Premium amount
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

/**
 * Verbatim content: spec:.claude/specs/components/dropdown-menu.md
 * "Sub-menu". Content-only fragment wrapped as above (flagged simplification).
 */
export const SubMenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Actions
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>View</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Share</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Email link</DropdownMenuItem>
            <DropdownMenuItem>Copy link</DropdownMenuItem>
            <DropdownMenuItem>WhatsApp</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

/**
 * Verbatim content: spec:.claude/specs/components/dropdown-menu.md
 * "Inset alignment (when mixing icon and no-icon items)". Content-only
 * fragment wrapped as above (flagged simplification).
 */
export const InsetAlignment: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Actions
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Edit />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem inset>Rename</DropdownMenuItem>
        <DropdownMenuItem inset>Duplicate</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}
