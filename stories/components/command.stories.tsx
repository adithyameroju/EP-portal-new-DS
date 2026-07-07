/**
 * Command stories — S2.3 generation pass.
 * Title from commandMeta.category ("organism" → "Organisms"). Command has no
 * variant axes (commandMeta.variants = []); stories are the composition
 * shapes verbatim from .claude/specs/components/command.md "Common
 * patterns". Skipped per lane-B conventions: "Inline command (inside a
 * Popover)" (controlled useState value/open example). Overlay layout
 * parameters copied from dialog.stories.tsx.
 */

import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { DownloadIcon, FileText, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { commandMeta } from "@/components/ui/command.meta"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Organisms/Command",
  component: Command,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { page: metaDocsPage(commandMeta) },
  },
} satisfies Meta<typeof Command>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Verbatim: spec:.claude/specs/components/command.md
 * "Search with filtered results". w-96 is the lane-B sized-wrapper
 * convention.
 */
export const SearchWithFilteredResults: Story = {
  render: () => (
    <div className="w-96">
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Recent">
            <CommandItem>Dashboard</CommandItem>
            <CommandItem>Claims</CommandItem>
          </CommandGroup>
          <CommandGroup heading="Settings">
            <CommandItem>Profile</CommandItem>
            <CommandItem>Notifications</CommandItem>
            <CommandItem>Billing</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/command.md
 * "⌘K command palette (most common)" — the CommandDialog children are
 * unchanged. Simplification (flagged): the spec's document-level ⌘K keydown
 * useEffect listener is replaced by a visible Button toggling the same
 * controlled open state, so the story is self-contained in Storybook
 * (CommandDialog is controlled-only — spec rule 5: "Add keyboard shortcut
 * listener manually"). The Button label is CommandDialog's default `title`
 * prop value ("Command Palette").
 */
function CommandPaletteExample() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Command Palette
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search policies, claims, documents..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Policies">
            <CommandItem>
              <FileText className="size-4" />
              Motor Insurance 2024
              <CommandShortcut>↵</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <FileText className="size-4" />
              Health Insurance - Family
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem>
              <PlusIcon className="size-4" />
              New Claim
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <DownloadIcon className="size-4" />
              Download Policy Document
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

export const CommandPalette: Story = {
  render: () => <CommandPaletteExample />,
}
