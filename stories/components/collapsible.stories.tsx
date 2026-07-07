/**
 * Collapsible stories — S2.3 generation pass.
 * Title from collapsibleMeta.category ("molecule" → "Molecules"). Collapsible
 * has no variant axes (collapsibleMeta.variants = []); stories are the
 * composition shapes verbatim from .claude/specs/components/collapsible.md
 * "Common patterns". Skipped per lane-B conventions: "Collapsible with
 * animated chevron" and "Controlled collapsible" (controlled useState
 * examples).
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { collapsibleMeta } from "@/components/ui/collapsible.meta"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Molecules/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(collapsibleMeta) },
  },
} satisfies Meta<typeof Collapsible>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Verbatim: spec:.claude/specs/components/collapsible.md
 * "Basic collapsible section". w-96 is the lane-B sized-wrapper convention.
 */
export const BasicSection: Story = {
  render: () => (
    <div className="w-96">
      <Collapsible>
        <CollapsibleTrigger
          render={
            <Button variant="ghost" className="flex w-full justify-between" />
          }
        >
          Additional details
          <ChevronDownIcon className="size-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pt-2 pb-4">
          <p className="text-sm text-muted-foreground">
            This policy includes zero depreciation cover, roadside assistance,
            and engine protection add-ons.
          </p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/collapsible.md
 * "Collapsible inside a Card". w-96 is the lane-B sized-wrapper convention.
 */
export const InsideCard: Story = {
  render: () => (
    <div className="w-96">
      <Card>
        <CardHeader className="p-0">
          <Collapsible>
            <CollapsibleTrigger
              render={
                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-between rounded-none px-6 py-4"
                />
              }
            >
              <CardTitle>Policy Add-ons</CardTitle>
              <ChevronDownIcon className="size-4" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm">
                  <li>Zero Depreciation Cover</li>
                  <li>Engine Protect</li>
                  <li>Roadside Assistance</li>
                </ul>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </CardHeader>
      </Card>
    </div>
  ),
}
