/**
 * Accordion stories — S2.3.
 * Title from accordionMeta.category ("molecule" → "Molecules"). UNSPECCED
 * (specStatus "none", aiHints.source "types-only"): no spec "Common patterns"
 * to quote, and accordionMeta.variants = [] — the gallery is a minimal
 * structural story. All rendered text is meta-field data (childComponents
 * names as trigger labels, meta.purpose as panel content) — zero authored prose.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { accordionMeta } from "@/components/ui/accordion.meta"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Molecules/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(accordionMeta) },
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Minimal structure: one AccordionItem per accordionMeta.childComponents
 * entry (trigger label = the child component name, panel text =
 * accordionMeta.purpose). No variant axes to map (accordionMeta.variants = []).
 */
export const Structure: Story = {
  render: () => (
    <Accordion className="w-96">
      {accordionMeta.childComponents.map((name) => (
        <AccordionItem key={name} value={name}>
          <AccordionTrigger>{name}</AccordionTrigger>
          <AccordionContent>{accordionMeta.purpose}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
}
