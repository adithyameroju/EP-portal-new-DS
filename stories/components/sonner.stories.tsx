/**
 * Sonner stories — S2.3.
 * Title from sonnerMeta.category ("organism" → "Organisms"). Sonner is
 * types-only (sonnerMeta.variants = [], specStatus "none"). The component
 * is the app-level Toaster singleton ("Toast notifications via a themed
 * wrapper around the Sonner Toaster" — sonnerMeta.purpose), so the single
 * story renders the Toaster plus a Compass Button that fires a neutral
 * toast via the sonner toast() API.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { sonnerMeta } from "@/components/ui/sonner.meta"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Organisms/Sonner",
  component: Toaster,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { page: metaDocsPage(sonnerMeta) },
  },
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Toaster singleton + trigger. Button label is the API call it performs
 * (sonner toast() API) — no authored prose.
 */
export const Toast: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button variant="outline" onClick={() => toast("Event logged")}>
        toast(&quot;Event logged&quot;)
      </Button>
    </div>
  ),
}
