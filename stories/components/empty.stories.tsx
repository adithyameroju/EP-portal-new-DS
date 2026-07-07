/**
 * Empty stories — generated from the S2.3 pattern.
 * Title from emptyMeta.category ("molecule" → "Molecules"). Empty is
 * UNSPECCED (emptyMeta is types-only) — the gallery maps the meta `variant`
 * axis (EmptyMedia's variant in components/ui/empty.tsx) with minimal
 * children from Compass primitives and neutral strings only; no invented
 * copy. Flagged: the media icon (Inbox) is a placeholder-only lucide-react
 * choice, and the axis value string doubles as the title text.
 */

import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Inbox } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { emptyMeta } from "@/components/ui/empty.meta"
import { metaDocsPage } from "./meta-doc-blocks"

type EmptyMediaProps = ComponentProps<typeof EmptyMedia>

const variantAxis = emptyMeta.variants.find((axis) => axis.prop === "variant")!

const meta = {
  title: "Molecules/Empty",
  component: Empty,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(emptyMeta) },
  },
} satisfies Meta<typeof Empty>

export default meta
type Story = StoryObj<typeof meta>

/**
 * One Empty per `variant` axis value from empty.meta.ts, applied to
 * EmptyMedia ("slots for media (plain or icon tile), title, description,
 * and follow-up content" — emptyMeta.purpose). Neutral strings only.
 */
export const MediaVariant: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      {variantAxis.values.map((value) => (
        <Empty key={value}>
          <EmptyHeader>
            <EmptyMedia variant={value as EmptyMediaProps["variant"]}>
              <Inbox />
            </EmptyMedia>
            <EmptyTitle>{value}</EmptyTitle>
            <EmptyDescription>Description</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" size="sm">
              Label
            </Button>
          </EmptyContent>
        </Empty>
      ))}
    </div>
  ),
}
