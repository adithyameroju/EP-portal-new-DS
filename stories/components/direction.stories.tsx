/**
 * Direction stories — S2.3 generation pass.
 * Title from directionMeta.category ("atom" → "Atoms"). direction is
 * UNSPECCED (directionMeta.specStatus = "none", aiHints.source =
 * "types-only") and renders no UI — directionMeta.purpose: "Re-export of the
 * Base UI DirectionProvider context provider and useDirection hook for
 * propagating text direction (LTR/RTL) to descendant components; renders no
 * UI of its own." This page is docs-only: the autodocs page plus one story
 * showing DirectionProvider wrapping a simple Compass Button with dir
 * toggled ("ltr" / "rtl" — the provider's own direction values). Labels are
 * the direction values themselves; no other UI belongs to this component.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DirectionProvider } from "@/components/ui/direction"
import { directionMeta } from "@/components/ui/direction.meta"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Atoms/Direction",
  component: DirectionProvider,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(directionMeta) },
  },
} satisfies Meta<typeof DirectionProvider>

export default meta
type Story = StoryObj<typeof meta>

/**
 * DirectionProvider wrapping a Compass Button, once per direction value.
 * The `dir` attribute on the wrapping div applies the same direction to the
 * DOM (the provider propagates it to Base UI descendants); the trailing icon
 * flips sides under "rtl".
 */
export const DirectionToggle: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-8">
      {(["ltr", "rtl"] as const).map((direction) => (
        <div key={direction} className="flex flex-col gap-2">
          <p className="font-mono text-xs text-muted-foreground">
            {direction}
          </p>
          <DirectionProvider direction={direction}>
            <div dir={direction}>
              <Button variant="outline">
                {direction}
                <ChevronRight />
              </Button>
            </div>
          </DirectionProvider>
        </div>
      ))}
    </div>
  ),
}
