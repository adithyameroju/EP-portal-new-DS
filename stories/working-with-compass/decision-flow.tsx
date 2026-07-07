/**
 * decision-flow.tsx — data-driven branch walker for the "Choosing a Component"
 * SOP page (owner-approved structure: .compass-build/design/s2/
 * sop-interactive-structure.PROPOSED.md, approved 2026-07-07).
 *
 * Renders a flow from decision-flows.ts as clickable option cards stepping
 * through the tree, with a breadcrumb of choices made and a restart control.
 * Leaves show the component name, a link to its Storybook docs page, and the
 * spec citation that decides it. Gap leaves render the visibly distinct
 * "⚠ Needs owner decision" card with the question text — flagged, not
 * silently absent.
 *
 * ZERO-NEW-CONTENT ENFORCEMENT (structural): validateFlows() runs at module
 * load and THROWS if any node or leaf is missing its `source` citation (or
 * points at a step that doesn't exist). All other rendered strings here are
 * UI labels ("Start over", "Open docs", "⚠ Needs owner decision", ...).
 *
 * Dogfooding: composed from Compass primitives only (Button, Card, Badge,
 * Collapsible) — no raw HTML interactive elements.
 */

import * as React from "react"
import { ChevronDownIcon, ChevronRightIcon, RotateCcwIcon } from "lucide-react"

import { componentMetaIndex } from "@/components/ui/_meta-index"
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import { storyTitle } from "../components/meta-doc-blocks"
import type { DecisionFlowData, FlowLeaf, FlowNode } from "./decision-flows"
import { allDecisionFlows } from "./decision-flows"

/* ── Zero-new-content enforcement — runs at module load ──────────────────── */

export function validateFlows(flows: DecisionFlowData[]): void {
  for (const flow of flows) {
    if (!flow.source) {
      throw new Error(`decision-flows: flow "${flow.id}" is missing its source citation`)
    }
    if (!flow.steps[flow.start]) {
      throw new Error(`decision-flows: flow "${flow.id}" start step "${flow.start}" does not exist`)
    }
    for (const step of Object.values(flow.steps)) {
      if (!step.source || step.source.trim() === "") {
        throw new Error(
          `decision-flows: ${flow.id}/${step.id} has no source citation — every node and leaf must cite the spec line that decides it (no invented content)`
        )
      }
      if (step.kind === "node") {
        if (step.options.length < 2 || step.options.length > 4) {
          throw new Error(
            `decision-flows: ${flow.id}/${step.id} has ${step.options.length} options — nodes carry 2–4 option cards`
          )
        }
        for (const option of step.options) {
          if (!flow.steps[option.to]) {
            throw new Error(
              `decision-flows: ${flow.id}/${step.id} option "${option.label}" points at missing step "${option.to}"`
            )
          }
        }
      }
    }
  }
}

// The renderer refuses to load with uncited flow data.
validateFlows(allDecisionFlows)

/* ── Helpers ─────────────────────────────────────────────────────────────── */

/** Storybook docs href for a ui component (same convention as the component
 *  pages' meta-doc-blocks renderer). */
function docsHref(componentName: string): string | null {
  const meta = componentMetaIndex[componentName]
  if (!meta) return null
  const id = storyTitle(meta).toLowerCase().replace(/[^a-z0-9]+/g, "-")
  return `/?path=/docs/${id}--docs`
}

/** Small provenance line — same grammar as the component docs pages. */
function SourceLine({ source }: { source: string }) {
  return <p className="font-mono text-xs text-muted-foreground">{source}</p>
}

/* ── Gap card — the flagged "not yet decided" surface ────────────────────── */

/** "⚠ Needs owner decision" card. Also exported for the MDX pages' inline
 *  gap flags (e.g. the Charts accordion's flagged leaf). */
export function GapCard({
  children,
  source,
}: {
  children: React.ReactNode
  source?: string
}) {
  return (
    <Card size="sm" className="bg-destructive/5 ring-destructive/30">
      <CardHeader>
        <CardTitle>
          <Badge variant="destructive">⚠ Needs owner decision</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="text-sm text-foreground">{children}</div>
        {source ? <SourceLine source={source} /> : null}
      </CardContent>
    </Card>
  )
}

/* ── The branch walker ───────────────────────────────────────────────────── */

interface Choice {
  label: string
  to: string
}

export function DecisionFlow({ flow }: { flow: DecisionFlowData }) {
  const [choices, setChoices] = React.useState<Choice[]>([])

  const currentId =
    choices.length > 0 ? choices[choices.length - 1].to : flow.start
  const step = flow.steps[currentId]

  const restart = () => setChoices([])
  const rewindTo = (index: number) => setChoices(choices.slice(0, index))
  const pick = (choice: Choice) => setChoices([...choices, choice])

  return (
    <div className="sb-unstyled flex flex-col gap-3 py-2 font-sans">
      {choices.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1">
          {choices.map((choice, i) => (
            <React.Fragment key={`${choice.to}-${i}`}>
              {i > 0 ? (
                <ChevronRightIcon className="size-3 shrink-0 text-muted-foreground" />
              ) : null}
              <Button
                variant="ghost"
                size="xs"
                className="max-w-72 text-muted-foreground"
                onClick={() => rewindTo(i)}
              >
                <span className="truncate">{choice.label}</span>
              </Button>
            </React.Fragment>
          ))}
          <Button variant="ghost" size="xs" className="ml-auto" onClick={restart}>
            <RotateCcwIcon data-icon="inline-start" />
            Start over
          </Button>
        </div>
      ) : null}

      {step.kind === "node" ? (
        <NodeCard node={step} onPick={pick} />
      ) : (
        <LeafCard leaf={step} onRestart={restart} />
      )}
    </div>
  )
}

function NodeCard({
  node,
  onPick,
}: {
  node: FlowNode
  onPick: (choice: Choice) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{node.question}</CardTitle>
        {node.detail ? <CardDescription>{node.detail}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="grid gap-2 md:grid-cols-2">
          {node.options.map((option) => (
            <Button
              key={option.to + option.label}
              variant="outline"
              className="h-auto min-h-8 w-full justify-between gap-2 px-3 py-2 text-left font-normal whitespace-normal"
              onClick={() => onPick({ label: option.label, to: option.to })}
            >
              <span>{option.label}</span>
              <ChevronRightIcon className="shrink-0 text-muted-foreground" />
            </Button>
          ))}
        </div>
        <SourceLine source={node.source} />
      </CardContent>
    </Card>
  )
}

function LeafCard({
  leaf,
  onRestart,
}: {
  leaf: FlowLeaf
  onRestart: () => void
}) {
  // Pure gap leaf: no component answer — the flagged question IS the result.
  if (leaf.gap && !leaf.component) {
    return (
      <div className="flex flex-col gap-2">
        <GapCard source={leaf.source}>{leaf.gap}</GapCard>
        <div>
          <Button variant="ghost" size="sm" onClick={onRestart}>
            <RotateCcwIcon data-icon="inline-start" />
            Start over
          </Button>
        </div>
      </div>
    )
  }

  const href = leaf.component ? docsHref(leaf.component) : null

  return (
    <Card className={leaf.gap ? "ring-destructive/30" : undefined}>
      <CardHeader>
        <CardDescription className="text-xs font-semibold tracking-wide uppercase">
          Use
        </CardDescription>
        <CardTitle>{leaf.title}</CardTitle>
        {leaf.detail ? <CardDescription>{leaf.detail}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {leaf.gap ? (
          <div className="flex flex-col gap-1.5">
            <Badge variant="destructive">⚠ Needs owner decision</Badge>
            <p className="text-sm text-destructive">{leaf.gap}</p>
          </div>
        ) : null}
        <SourceLine source={leaf.source} />
        <div className="flex flex-wrap items-center gap-2">
          {href ? (
            <Button
              variant="link"
              size="sm"
              className="px-0"
              render={<a href={href} target="_top" />}
            >
              Open docs
              <ChevronRightIcon data-icon="inline-end" />
            </Button>
          ) : null}
          <Button variant="ghost" size="sm" onClick={onRestart}>
            <RotateCcwIcon data-icon="inline-start" />
            Start over
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/* ── "Show the source table" collapsible ─────────────────────────────────── */

/**
 * Wraps an original decision table (markdown, passed as MDX children) in a
 * Collapsible below its flow. The trigger label is a UI label from the
 * approved structure doc ("show the source table"); `heading` carries the
 * original section heading text so nothing is lost.
 */
export function SourceCollapsible({
  heading,
  children,
}: {
  heading?: string
  children: React.ReactNode
}) {
  return (
    <Collapsible className="flex flex-col gap-2">
      <CollapsibleTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="sb-unstyled w-fit font-sans text-muted-foreground"
          />
        }
      >
        <ChevronDownIcon data-icon="inline-start" />
        Show the source table{heading ? ` — ${heading}` : ""}
      </CollapsibleTrigger>
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  )
}
