/**
 * Resizable stories — S2.3 (types-only meta).
 * Title from resizableMeta.category ("organism" → "Organisms"). No spec
 * exists (specStatus "none") and resizableMeta.variants = []; the story is a
 * simple two-pane example in a sized wrapper composing
 * resizableMeta.childComponents (panel group, panels, handle). Pane labels
 * are the "resizable-panel" sub-component name from meta — no invented copy.
 * The handle's optional grip bar (see resizableMeta.purpose: "optionally
 * showing a grip bar") is shown via `withHandle`.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { resizableMeta } from "@/components/ui/resizable.meta"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Organisms/Resizable",
  component: ResizablePanelGroup,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(resizableMeta) },
  },
} satisfies Meta<typeof ResizablePanelGroup>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Two-pane split with a draggable handle (grip bar via `withHandle`), inside
 * an `h-48 w-96` wrapper — story wrapper size only (the group is
 * `h-full w-full` and needs a sized parent in Storybook).
 */
export const TwoPane: Story = {
  render: () => (
    <div className="h-48 w-96 rounded-lg border">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize="50%">
          <div className="flex h-full items-center justify-center p-4">
            <span className="font-mono text-sm text-muted-foreground">
              resizable-panel
            </span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="50%">
          <div className="flex h-full items-center justify-center p-4">
            <span className="font-mono text-sm text-muted-foreground">
              resizable-panel
            </span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
}
