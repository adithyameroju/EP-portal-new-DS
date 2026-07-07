/**
 * Separator stories — S2.3.
 * Title from separatorMeta.category ("atom" → "Atoms"). The Orientation
 * gallery iterates separatorMeta's orientation axis; composition shapes are
 * verbatim from .claude/specs/components/separator.md "Common patterns".
 * Simplifications (flagged per story):
 * - The spec's "Separator in a settings section list" pattern is skipped —
 *   it demonstrates `divide-y` on the container and contains no Separator.
 * - Toolbar icon Buttons get aria-labels naming their spec icons (the spec
 *   shape has icon-only buttons with no labels).
 */

import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { AlignLeftIcon, BoldIcon, ItalicIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { separatorMeta } from "@/components/ui/separator.meta"
import { metaDocsPage } from "./meta-doc-blocks"

type SeparatorProps = ComponentProps<typeof Separator>

const orientationAxis = separatorMeta.variants.find(
  (axis) => axis.prop === "orientation",
)!

const meta = {
  title: "Atoms/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(separatorMeta) },
  },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

/**
 * One separator per `orientation` axis value from separator.meta.ts, labeled
 * by the value string. Vertical sits inside a `flex items-center` container
 * per the spec rule ("self-stretch only works inside a flex row"); the `w-80`
 * wrapper is story wrapper width only.
 */
export const Orientation: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-8">
      {orientationAxis.values.map((value) =>
        value === "vertical" ? (
          <div key={value} className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{value}</span>
            <Separator orientation="vertical" />
            <span className="text-sm text-muted-foreground">{value}</span>
          </div>
        ) : (
          <div key={value} className="flex flex-col gap-4">
            <span className="text-sm text-muted-foreground">{value}</span>
            <Separator
              orientation={value as SeparatorProps["orientation"]}
            />
            <span className="text-sm text-muted-foreground">{value}</span>
          </div>
        ),
      )}
    </div>
  ),
}

/** Verbatim: spec:.claude/specs/components/separator.md "Horizontal separator (default)". */
export const HorizontalBetweenSections: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <p>Section one content</p>
      <Separator />
      <p>Section two content</p>
    </div>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/separator.md "Vertical separator"
 * (toolbar shape; aria-labels added — see file header).
 */
export const VerticalInToolbar: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" aria-label="BoldIcon">
        <BoldIcon />
      </Button>
      <Button variant="ghost" size="icon" aria-label="ItalicIcon">
        <ItalicIcon />
      </Button>
      <Separator orientation="vertical" />
      <Button variant="ghost" size="icon" aria-label="AlignLeftIcon">
        <AlignLeftIcon />
      </Button>
    </div>
  ),
}

/** Verbatim: spec:.claude/specs/components/separator.md "Separator inside a Card". */
export const InsideCard: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Policy Details</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <p>Premium: ₹12,500 / year</p>
      </CardContent>
    </Card>
  ),
}
