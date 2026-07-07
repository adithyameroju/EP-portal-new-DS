/**
 * Kbd stories — generated from the S2.3 pattern.
 * Title from kbdMeta.category ("atom" → "Atoms"). Kbd is UNSPECCED (kbdMeta
 * is types-only) and has no variant axes (kbdMeta.variants = []); stories
 * compose Kbd and the meta childComponent kbd-group minimally — "Inline
 * keyboard-key badge ... plus a KbdGroup wrapper for key combinations"
 * (kbdMeta.purpose). Flagged: the key glyphs are quoted from a sibling spec,
 * spec:.claude/specs/components/dropdown-menu.md "Menu with keyboard
 * shortcuts" (⌘K, ⌘E) — not invented copy.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { kbdMeta } from "@/components/ui/kbd.meta"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Atoms/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(kbdMeta) },
  },
} satisfies Meta<typeof Kbd>

export default meta
type Story = StoryObj<typeof meta>

/** Single keyboard-key badges (glyphs from the dropdown-menu spec: ⌘K, ⌘E). */
export const Key: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Kbd>⌘K</Kbd>
      <Kbd>⌘E</Kbd>
    </div>
  ),
}

/** KbdGroup "wrapper for key combinations" — the ⌘K combination as two keys. */
export const Group: Story = {
  render: () => (
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
  ),
}
