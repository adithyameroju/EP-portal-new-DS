/**
 * Drawer stories — S2.3 generation pass.
 * Title from drawerMeta.category ("organism" → "Organisms"). Covers the
 * `direction` axis generically; composed examples verbatim from
 * .claude/specs/components/drawer.md "Common patterns". DrawerTrigger and
 * DrawerClose use asChild — per drawerMeta.aiHints.compositionRules, "Drawer
 * is built on vaul (Radix-based), a documented exception to the repo-wide
 * Base UI render-prop rule". Skipped per lane-B conventions: "Controlled
 * drawer" and "Responsive: Drawer on mobile, Sheet on desktop" (controlled
 * useState / hook examples). Overlay layout parameters copied from
 * dialog.stories.tsx.
 */

import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Download, Share, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { drawerMeta } from "@/components/ui/drawer.meta"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { metaDocsPage } from "./meta-doc-blocks"

type DrawerProps = ComponentProps<typeof Drawer>

const directionAxis = drawerMeta.variants.find(
  (axis) => axis.prop === "direction",
)!

const meta = {
  title: "Organisms/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { page: metaDocsPage(drawerMeta) },
  },
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

/**
 * One drawer per `direction` axis value from drawer.meta.ts, using the
 * spec's DrawerHeader shape (spec rule 6: DrawerTitle is required with
 * DrawerHeader). Only `bottom` has a dedicated spec pattern (see
 * ActionSheet below); the other values reuse the same shape for axis
 * coverage (mechanical derivation, as in sheet.stories.tsx side="top").
 * The description quotes drawerMeta.aiHints.compositionRules.
 */
export const Direction: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {directionAxis.values.map((value) => (
        <Drawer key={value} direction={value as DrawerProps["direction"]}>
          <DrawerTrigger asChild>
            <Button variant="outline">{value}</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{value}</DrawerTitle>
              <DrawerDescription>
                Set direction on the Drawer root (top, bottom, left, right);
                bottom is the default
              </DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/drawer.md
 * "Standard bottom drawer (action sheet)".
 */
export const ActionSheet: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>More Options</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Policy Actions</DrawerTitle>
          <DrawerDescription>
            Choose an action for this policy.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-2 px-4 pb-2">
          <Button variant="outline" className="w-full justify-start">
            <Download />
            Download PDF
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Share />
            Share
          </Button>
          <Button variant="destructive" className="w-full justify-start">
            <Trash2 />
            Cancel Policy
          </Button>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

/** Verbatim: spec:.claude/specs/components/drawer.md "Drawer with form content". */
export const WithForm: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Edit Details</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Policy</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-4 px-4">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Policy name</Label>
            <Input id="name" defaultValue="Motor Insurance 2024" />
          </div>
        </div>
        <DrawerFooter>
          <Button>Save Changes</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}
