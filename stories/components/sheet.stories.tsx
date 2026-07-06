/**
 * Sheet stories — S2.3 pattern-setter.
 * Title from sheetMeta.category ("organism" → "Organisms"). Covers sheetMeta's
 * `side` axis (top/right/bottom/left) via the spec's own per-side patterns,
 * verbatim from .claude/specs/components/sheet.md "Common patterns".
 * side="top" has no dedicated spec pattern — it reuses the spec's standard
 * panel shape with side="top" for axis coverage (mechanical derivation).
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { sheetMeta } from "@/components/ui/sheet.meta"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Organisms/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { page: metaDocsPage(sheetMeta) },
  },
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

/**
 * side="right" (default) — verbatim from
 * spec:.claude/specs/components/sheet.md "Standard right-side panel (edit/detail)".
 */
export const RightPanel: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Edit Policy</Button>} />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Policy</SheetTitle>
          <SheetDescription>
            Make changes to the policy details below.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4">
          <div className="grid gap-1.5">
            <Label htmlFor="policy-name">Policy Name</Label>
            <Input id="policy-name" defaultValue="Motor Insurance 2024" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="premium">Annual Premium</Label>
            <Input id="premium" type="number" defaultValue="12500" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose render={<Button variant="outline">Cancel</Button>} />
          <Button type="submit">Save Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

/** side="left" — verbatim from spec:.claude/specs/components/sheet.md "Left-side filter panel". */
export const LeftFilterPanel: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="outline">
            <SlidersHorizontal className="size-4" />
            Filters
          </Button>
        }
      />
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Filter Policies</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4">{/* filter controls */}</div>
        <SheetFooter>
          <SheetClose
            render={
              <Button variant="outline" className="w-full">
                Clear
              </Button>
            }
          />
          <Button className="w-full">Apply</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

/** side="bottom" — verbatim from spec:.claude/specs/components/sheet.md "Bottom sheet (mobile-friendly)". */
export const BottomSheet: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button>More Options</Button>} />
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Options</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 px-4 pb-2">
          <Button variant="outline" className="w-full justify-start">
            Download PDF
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Share
          </Button>
          <Button variant="destructive" className="w-full justify-start">
            Cancel Policy
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
}

/**
 * side="top" — the spec's standard panel shape with side="top"
 * (axis coverage for sheetMeta's `side` values; no dedicated spec pattern).
 */
export const TopSheet: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Edit Policy</Button>} />
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Edit Policy</SheetTitle>
          <SheetDescription>
            Make changes to the policy details below.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose render={<Button variant="outline">Cancel</Button>} />
          <Button type="submit">Save Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}
