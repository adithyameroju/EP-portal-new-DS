/**
 * Button stories — S2.3 pattern-setter.
 * Title from buttonMeta.category ("atom" → "Atoms"). Docs page = shared
 * meta renderer. Galleries iterate buttonMeta variant axes; composed
 * examples are verbatim from .claude/specs/components/button.md.
 */

import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Loader2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { buttonMeta } from "@/components/ui/button.meta"
import { metaDocsPage } from "./meta-doc-blocks"

type ButtonProps = ComponentProps<typeof Button>

const variantAxis = buttonMeta.variants.find((axis) => axis.prop === "variant")!
const sizeAxis = buttonMeta.variants.find((axis) => axis.prop === "size")!

const meta = {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(buttonMeta) },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/** One button per `variant` axis value from button.meta.ts. */
export const Variant: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {variantAxis.values.map((value) => (
        <Button key={value} variant={value as ButtonProps["variant"]}>
          {value}
        </Button>
      ))}
    </div>
  ),
}

/**
 * One button per `size` axis value from button.meta.ts.
 * Icon sizes follow spec:.claude/specs/components/button.md#icons-in-buttons —
 * variant="outline" size="icon*" + aria-label, X icon (spec's own example).
 */
export const Size: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {sizeAxis.values.map((value) =>
        value.startsWith("icon") ? (
          <Button
            key={value}
            variant="outline"
            size={value as ButtonProps["size"]}
            aria-label={value}
          >
            <X />
          </Button>
        ) : (
          <Button key={value} size={value as ButtonProps["size"]}>
            {value}
          </Button>
        ),
      )}
    </div>
  ),
}

/**
 * Loading via children composition + disabled — verbatim from
 * spec:.claude/specs/components/button.md#loading-state--decision-record.
 */
export const Loading: Story = {
  render: () => (
    <Button disabled>
      <Loader2 className="animate-spin" />
      Saving...
    </Button>
  ),
}
