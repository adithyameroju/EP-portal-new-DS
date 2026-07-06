"use client"

// S5 "Migrate" UI shell — per-batch report view.
// Renders the fixed .migration/<unit>.md structure (Changed / Left alone /
// Behavior changes / Verify by hand) plus the gap list and the owner review
// queue. Approve/flag are callback props — this component holds no migration
// state and performs no writes. Honest reporting: empty sections still render,
// as "None".

import type * as React from "react"
import {
  AlertTriangle,
  CheckCircle2,
  Flag,
  HelpCircle,
  ListChecks,
  PackageX,
  Pencil,
  ShieldCheck,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import type { MigrationReport } from "./types"

interface MigrateReportProps {
  report: MigrationReport
  /** Owner approves the batch; the next batch may then start. */
  onApprove?: (batchId: string) => void
  /** Owner flags the batch; it is reported as flagged, never as migrated. */
  onFlag?: (batchId: string) => void
}

function ReportSection({
  icon,
  title,
  hint,
  entries,
}: {
  icon: React.ReactNode
  title: string
  hint?: string
  entries: string[]
}) {
  return (
    <section aria-label={title}>
      <h3 className="flex items-center gap-2 text-sm font-medium text-foreground [&_svg]:size-4 [&_svg]:shrink-0">
        {icon}
        {title}
        {hint ? (
          <span className="font-normal text-muted-foreground">— {hint}</span>
        ) : null}
      </h3>
      {entries.length === 0 ? (
        <p className="pt-1 pl-6 text-sm text-muted-foreground">None</p>
      ) : (
        <ul className="flex list-disc flex-col gap-1 pt-1 pl-10 text-sm text-muted-foreground marker:text-border">
          {entries.map((entry) => (
            <li key={entry}>{entry}</li>
          ))}
        </ul>
      )}
    </section>
  )
}

function MigrateReport({ report, onApprove, onFlag }: MigrateReportProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Batch report — {report.batchName}
          <Badge variant="secondary" className="ml-2 align-middle">
            min confidence {Math.round(report.confidence * 100)}%
          </Badge>
        </CardTitle>
        <CardDescription>
          Mirrors .migration/{report.batchId}.md. Skipped is reported as
          skipped — never as migrated.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ReportSection
          icon={<Pencil />}
          title="Changed"
          entries={report.sections.changed}
        />
        <ReportSection
          icon={<ShieldCheck />}
          title="Left alone"
          hint="logic, data, routing and state are out of scope by hard rule"
          entries={report.sections.leftAlone}
        />
        <ReportSection
          icon={<AlertTriangle />}
          title="Behavior changes"
          hint="flagged for QA, never silently patched"
          entries={report.sections.behaviorChanges}
        />
        <ReportSection
          icon={<ListChecks />}
          title="Verify by hand"
          entries={report.sections.verifyByHand}
        />

        <Separator />

        <section aria-label="Gap list">
          <h3 className="flex items-center gap-2 text-sm font-medium text-foreground [&_svg]:size-4 [&_svg]:shrink-0">
            <PackageX />
            Gap list
            <span className="font-normal text-muted-foreground">
              — no Compass equivalent; each entry is an S6 candidate
            </span>
          </h3>
          {report.gaps.length === 0 ? (
            <p className="pt-1 pl-6 text-sm text-muted-foreground">None</p>
          ) : (
            <ul className="flex flex-col gap-2 pt-2 pl-6">
              {report.gaps.map((gap) => (
                <li key={gap.name} className="text-sm">
                  <span className="font-medium text-foreground">{gap.name}</span>{" "}
                  <span className="text-muted-foreground">
                    ({gap.role}) · {gap.source} · used {gap.occurrences}×
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-label="Needs decision">
          <h3 className="flex items-center gap-2 text-sm font-medium text-foreground [&_svg]:size-4 [&_svg]:shrink-0">
            <HelpCircle />
            Needs decision
            <span className="font-normal text-muted-foreground">
              — low-confidence mappings and unclustered tokens, for Nikhil
            </span>
          </h3>
          {report.decisions.length === 0 ? (
            <p className="pt-1 pl-6 text-sm text-muted-foreground">None</p>
          ) : (
            <div className="flex flex-col gap-2 pt-2 pl-6">
              {report.decisions.map((decision) => (
                <Alert key={decision.id}>
                  <HelpCircle />
                  <AlertTitle>
                    {decision.id} · {decision.kind} · {decision.source}
                  </AlertTitle>
                  <AlertDescription>
                    {decision.why}. Candidates:{" "}
                    {decision.candidates
                      .map(
                        (candidate) =>
                          `${candidate.name} (${Math.round(candidate.confidence * 100)}%)`
                      )
                      .join(", ")}
                    . Nothing is applied until you decide.
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </section>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline" onClick={() => onFlag?.(report.batchId)}>
          <Flag data-icon="inline-start" />
          Flag batch
        </Button>
        <Button
          onClick={() => onApprove?.(report.batchId)}
          disabled={report.decisions.length > 0}
        >
          <CheckCircle2 data-icon="inline-start" />
          Approve batch
        </Button>
      </CardFooter>
    </Card>
  )
}

export { MigrateReport }
export type { MigrateReportProps }
