/**
 * Tooltip stories — S2.3.
 * Title from tooltipMeta.category ("molecule" → "Molecules"). Tooltip has
 * no variant axes (tooltipMeta.variants = []); stories are the composition
 * shapes verbatim from .claude/specs/components/tooltip.md "Common
 * patterns". Layout parameters follow the overlay pattern
 * (dialog.stories.tsx).
 * SIMPLIFICATIONS (lane-B conventions, self-containment only):
 * - The spec assumes a layout-level TooltipProvider for every pattern after
 *   the first; each story here wraps its own TooltipProvider so it renders
 *   standalone in Storybook.
 * - The spec's "Multiple tooltips sharing a provider (layout-level
 *   pattern)" example is a layout snippet with a {children} placeholder —
 *   not self-contained, skipped.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { DownloadIcon, InfoIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { tooltipMeta } from "@/components/ui/tooltip.meta"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Molecules/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { page: metaDocsPage(tooltipMeta) },
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

/** Verbatim: spec:.claude/specs/components/tooltip.md "Icon button with tooltip (most common)". */
export const IconButton: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button variant="ghost" size="icon" aria-label="Download policy" />
          }
        >
          <DownloadIcon />
        </TooltipTrigger>
        <TooltipContent>Download policy PDF</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}

/** Verbatim: spec:.claude/specs/components/tooltip.md "Tooltip on the right side". */
export const RightSide: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="ghost" size="icon" />}>
          <InfoIcon />
        </TooltipTrigger>
        <TooltipContent side="right">
          This coverage applies to third-party damage only.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}

/** Verbatim: spec:.claude/specs/components/tooltip.md "Tooltip on a disabled button". */
export const DisabledButton: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<span tabIndex={0} />}>
          <Button disabled>Renew</Button>
        </TooltipTrigger>
        <TooltipContent>
          Renewal not available for this policy type.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}

/** Verbatim: spec:.claude/specs/components/tooltip.md "Tooltip with keyboard shortcut". */
export const WithKeyboardShortcut: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="ghost" size="icon" />}>
          <SearchIcon />
        </TooltipTrigger>
        <TooltipContent>
          Search
          <Kbd>⌘K</Kbd>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}
