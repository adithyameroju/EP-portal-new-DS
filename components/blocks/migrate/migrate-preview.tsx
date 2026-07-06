"use client"

// S5 "Migrate" UI shell — dual preview panes.
// Renders the original product beside its Compass-migrated version for a
// single batch ("here's your Settings flow, and here's how it looks in
// Compass"). Pure presentation: the panes accept arbitrary children from the
// caller; this component never runs, fetches or renders foreign code itself.
// Skeletons stand in while a pane has no content.

import type * as React from "react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

interface MigratePreviewProps {
  batchName: string
  /** Rendered preview of the untouched original. Skeleton when absent. */
  originalPane?: React.ReactNode
  /** Rendered preview of the Compass-migrated version. Skeleton when absent. */
  compassPane?: React.ReactNode
}

function PanePlaceholder() {
  return (
    <div className="flex flex-col gap-3 p-4" aria-hidden="true">
      <Skeleton className="h-6 w-2/5" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-4 w-3/5" />
      <Skeleton className="h-24 w-full" />
    </div>
  )
}

function PreviewPane({
  label,
  badgeVariant,
  children,
}: {
  label: string
  badgeVariant: "outline" | "default"
  children?: React.ReactNode
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <Badge variant={badgeVariant}>{label}</Badge>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        {children ?? <PanePlaceholder />}
      </ScrollArea>
    </div>
  )
}

function MigratePreview({
  batchName,
  originalPane,
  compassPane,
}: MigratePreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{batchName} — before and after</CardTitle>
        <CardDescription>
          Left: your product, untouched. Right: the same flow on Compass.
          Structure, copy and behavior are preserved; behavioral differences
          are listed in the batch report, never silently patched.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96 overflow-hidden rounded-lg border border-border">
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize={50} minSize={25}>
              <PreviewPane label="Original" badgeVariant="outline">
                {originalPane}
              </PreviewPane>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} minSize={25}>
              <PreviewPane label="Compass" badgeVariant="default">
                {compassPane}
              </PreviewPane>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </CardContent>
    </Card>
  )
}

export { MigratePreview }
export type { MigratePreviewProps }
