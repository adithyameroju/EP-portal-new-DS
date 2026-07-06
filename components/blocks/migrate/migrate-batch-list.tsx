"use client"

// S5 "Migrate" UI shell — batch breakdown view.
// The migration is presented as batches (one flow/feature at a time, per the
// strangler-fig procedure), never one monolith. Pure presentation over
// MigrationBatch props; status/counts are supplied by the caller (mocked
// until the Part B engine lands after S1).

import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  CircleDashed,
  Eye,
  SkipForward,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Progress } from "@/components/ui/progress"

import type { BatchStatus, MigrationBatch } from "./types"

const STATUS_META: Record<
  BatchStatus,
  {
    label: string
    badgeVariant: "default" | "secondary" | "destructive" | "outline" | "ghost"
    Icon: typeof CheckCircle2
  }
> = {
  pending: { label: "Pending", badgeVariant: "outline", Icon: CircleDashed },
  "in-review": { label: "In review", badgeVariant: "secondary", Icon: Eye },
  approved: { label: "Approved", badgeVariant: "default", Icon: CheckCircle2 },
  flagged: { label: "Flagged", badgeVariant: "destructive", Icon: AlertTriangle },
  skipped: { label: "Skipped", badgeVariant: "ghost", Icon: SkipForward },
}

interface MigrateBatchListProps {
  repoName: string
  batches: MigrationBatch[]
  /** Called with the batch id when the user opens a batch. */
  onSelectBatch?: (batchId: string) => void
}

function MigrateBatchList({
  repoName,
  batches,
  onSelectBatch,
}: MigrateBatchListProps) {
  const totalUnits = batches.reduce((sum, batch) => sum + batch.unitCount, 0)
  const migratedUnits = batches.reduce(
    (sum, batch) => sum + batch.migratedCount,
    0
  )
  const overallPercent =
    totalUnits === 0 ? 0 : Math.round((migratedUnits / totalUnits) * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Migration batches</CardTitle>
        <CardDescription>
          {repoName} — {migratedUnits} of {totalUnits} units migrated. Each
          batch is reviewed and approved before the next one starts; skipped
          batches are reported as skipped, never as migrated.
        </CardDescription>
        <Progress value={overallPercent} aria-label="Overall migration progress" />
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-2">
          {batches.map((batch) => {
            const meta = STATUS_META[batch.status]
            const flaggedForOwner =
              batch.gapCount > 0 || batch.needsDecisionCount > 0
            return (
              <Item key={batch.id} variant="outline">
                <ItemMedia variant="icon">
                  <meta.Icon />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>
                    {batch.name}
                    <Badge variant={meta.badgeVariant}>{meta.label}</Badge>
                  </ItemTitle>
                  <ItemDescription>
                    {batch.description} · {batch.migratedCount}/{batch.unitCount}{" "}
                    migrated
                    {batch.status !== "pending"
                      ? ` · min confidence ${Math.round(batch.confidence * 100)}%`
                      : ""}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  {batch.gapCount > 0 ? (
                    <Badge variant="outline">
                      {batch.gapCount} gap{batch.gapCount === 1 ? "" : "s"}
                    </Badge>
                  ) : null}
                  {batch.needsDecisionCount > 0 ? (
                    <Badge variant="destructive">
                      {batch.needsDecisionCount} for review
                    </Badge>
                  ) : null}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Open ${batch.name}${flaggedForOwner ? " (has items for review)" : ""}`}
                    onClick={() => onSelectBatch?.(batch.id)}
                  >
                    <ChevronRight />
                  </Button>
                </ItemActions>
              </Item>
            )
          })}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}

export { MigrateBatchList }
export type { MigrateBatchListProps }
