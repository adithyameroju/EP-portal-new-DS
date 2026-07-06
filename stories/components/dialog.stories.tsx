/**
 * Dialog stories — S2.3 pattern-setter.
 * Title from dialogMeta.category ("organism" → "Organisms"). Dialog has no
 * variant axes (dialogMeta.variants = []); stories are the composition
 * shapes verbatim from .claude/specs/components/dialog.md "Common patterns".
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { dialogMeta } from "@/components/ui/dialog.meta"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Organisms/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { page: metaDocsPage(dialogMeta) },
  },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

/** Verbatim: spec:.claude/specs/components/dialog.md "Basic dialog". */
export const BasicDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Edit Profile</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when done.
          </DialogDescription>
        </DialogHeader>
        {/* content */}
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

/** Verbatim: spec:.claude/specs/components/dialog.md "Dialog with form". */
export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button>Add Nominee</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Nominee</DialogTitle>
          <DialogDescription>
            Add a nominee to your policy. All fields are required.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="nominee-name">Full Name</Label>
            <Input id="nominee-name" placeholder="Enter full name" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="nominee-relation">Relationship</Label>
            <Input id="nominee-relation" placeholder="e.g. Spouse, Parent" />
          </div>
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button type="submit">Add Nominee</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

/** Verbatim: spec:.claude/specs/components/dialog.md "Dialog with no footer (informational)". */
export const Informational: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm">
            What&apos;s covered?
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>What&apos;s covered</DialogTitle>
          <DialogDescription>
            Your policy covers the following scenarios.
          </DialogDescription>
        </DialogHeader>
        <ul className="grid gap-2 text-sm text-muted-foreground">
          <li>Accidental damage</li>
          <li>Natural disasters</li>
          <li>Third-party liability</li>
        </ul>
      </DialogContent>
    </Dialog>
  ),
}
