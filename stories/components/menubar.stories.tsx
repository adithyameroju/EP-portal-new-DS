/**
 * Menubar stories — generated from the S2.3 pattern.
 * Title from menubarMeta.category ("organism" → "Organisms"). ItemVariant
 * maps menubarMeta's `variant` axis (MenubarItem's variant in
 * components/ui/menubar.tsx); the composition story is verbatim from
 * .claude/specs/components/menubar.md "Common patterns". Simplification
 * (lane-B convention (c) adapted, flagged inline): the spec's controlled
 * checkbox/radio props (useState) in the View menu are replaced with
 * uncontrolled defaultChecked/defaultValue equivalents instead of skipping —
 * "Standard app menubar" is the spec's only pattern.
 */

import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { menubarMeta } from "@/components/ui/menubar.meta"
import { metaDocsPage } from "./meta-doc-blocks"

type MenubarItemProps = ComponentProps<typeof MenubarItem>

const variantAxis = menubarMeta.variants.find((axis) => axis.prop === "variant")!

const meta = {
  title: "Organisms/Menubar",
  component: Menubar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { page: metaDocsPage(menubarMeta) },
  },
} satisfies Meta<typeof Menubar>

export default meta
type Story = StoryObj<typeof meta>

/** One MenubarItem per `variant` axis value from menubar.meta.ts. */
export const ItemVariant: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>{variantAxis.prop}</MenubarTrigger>
        <MenubarContent>
          {variantAxis.values.map((value) => (
            <MenubarItem
              key={value}
              variant={value as MenubarItemProps["variant"]}
            >
              {value}
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/menubar.md "Standard app menubar".
 * Flagged simplification: the View menu's controlled checked/onCheckedChange
 * and value/onValueChange (useState) replaced with defaultChecked /
 * defaultValue (first spec value) so checked and unchecked states render.
 */
export const StandardAppMenubar: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Policy
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Open
            <MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Export PDF
            <MenubarShortcut>⌘E</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo
            <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo
            <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem defaultChecked>Sidebar</MenubarCheckboxItem>
          <MenubarCheckboxItem>Preview</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarLabel>Sort by</MenubarLabel>
          <MenubarRadioGroup defaultValue="name">
            <MenubarRadioItem value="name">Name</MenubarRadioItem>
            <MenubarRadioItem value="date">Date</MenubarRadioItem>
            <MenubarRadioItem value="premium">Premium</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
}
