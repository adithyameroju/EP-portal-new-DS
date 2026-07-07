/**
 * AlertDialog stories — S2.3.
 * Title from alertDialogMeta.category ("organism" → "Organisms"). Lightweight
 * spec: alertDialogMeta cites .claude/specs/components/dialog.md — stories are
 * the "AlertDialog patterns" examples verbatim from that spec; together they
 * cover both `size` axis values from alert-dialog.meta.ts ("default", "sm").
 * Overlay composite: layout "centered", same as dialog.stories.tsx.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Trash2 } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { alertDialogMeta } from "@/components/ui/alert-dialog.meta"
import { Button } from "@/components/ui/button"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Organisms/AlertDialog",
  component: AlertDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { page: metaDocsPage(alertDialogMeta) },
  },
} satisfies Meta<typeof AlertDialog>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Verbatim: spec:.claude/specs/components/dialog.md "Destructive confirmation
 * (standard)" — covers size axis value "default" (the AlertDialogContent default).
 */
export const DestructiveConfirmation: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button variant="destructive">Delete Policy</Button>}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this policy?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Your policy will be permanently
            deleted and all associated data will be removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/dialog.md "Compact confirmation
 * with icon (size=\"sm\")" — covers size axis value "sm".
 */
export const CompactWithIcon: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Remove item">
            <Trash2 className="size-4" />
          </Button>
        }
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Trash2 />
          </AlertDialogMedia>
          <AlertDialogTitle>Remove item?</AlertDialogTitle>
          <AlertDialogDescription>
            This item will be removed from your list.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Remove</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}
