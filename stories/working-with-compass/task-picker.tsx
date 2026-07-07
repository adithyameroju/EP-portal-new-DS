/**
 * task-picker.tsx — the "What do you want to do?" entry grid for the SOP
 * Overview page (owner-approved structure: .compass-build/design/s2/
 * sop-interactive-structure.PROPOSED.md, approved 2026-07-07).
 *
 * ZERO NEW CONTENT: the eight task labels are the entry-grid list from the
 * approved structure doc ("Build a form · Ask for confirmation · Show
 * feedback · Pick a selection control · Show data in a table · Lay out a
 * page · Go from Figma to code · Understand the AI guardrails"); each card's
 * small line is the destination page title from the "Map of this SOP" table.
 * Links deep-link to the right SOP page (same href convention as the
 * component pages' meta-doc-blocks renderer).
 *
 * Dogfooding: Compass Card composed inside a plain anchor (the repo's
 * link-wrapping pattern, per stories/components/meta-doc-blocks.tsx).
 */

import { ArrowRightIcon } from "lucide-react"

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

/** Storybook docs ids for the five SOP pages (sanitized Meta titles). */
const SOP_DOCS = {
  choosing: "/?path=/docs/introduction-working-with-compass-choosing-a-component--docs",
  tasks: "/?path=/docs/introduction-working-with-compass-common-tasks--docs",
  loop: "/?path=/docs/introduction-working-with-compass-the-figma-code-loop--docs",
  ai: "/?path=/docs/introduction-working-with-compass-working-with-ai--docs",
} as const

interface TaskEntry {
  /** Task label — verbatim from the approved structure doc's entry grid. */
  task: string
  /** Destination page title — from the Overview "Map of this SOP" table. */
  page: string
  href: string
}

const TASKS: TaskEntry[] = [
  { task: "Build a form", page: "Common Tasks", href: SOP_DOCS.tasks },
  {
    task: "Ask for confirmation",
    page: "Choosing a Component",
    href: SOP_DOCS.choosing,
  },
  { task: "Show feedback", page: "Choosing a Component", href: SOP_DOCS.choosing },
  {
    task: "Pick a selection control",
    page: "Choosing a Component",
    href: SOP_DOCS.choosing,
  },
  { task: "Show data in a table", page: "Common Tasks", href: SOP_DOCS.tasks },
  { task: "Lay out a page", page: "Common Tasks", href: SOP_DOCS.tasks },
  {
    task: "Go from Figma to code",
    page: "The Figma → Code Loop",
    href: SOP_DOCS.loop,
  },
  {
    task: "Understand the AI guardrails",
    page: "Working with AI",
    href: SOP_DOCS.ai,
  },
]

export function TaskPicker() {
  return (
    <div className="sb-unstyled grid gap-3 py-2 font-sans sm:grid-cols-2 lg:grid-cols-4">
      {TASKS.map((entry) => (
        <a
          key={entry.task}
          href={entry.href}
          target="_top"
          className="no-underline"
        >
          <Card
            size="sm"
            className="h-full transition-shadow hover:ring-primary/40"
          >
            <CardHeader>
              <CardTitle>{entry.task}</CardTitle>
              <CardDescription>{entry.page}</CardDescription>
              <CardAction>
                <ArrowRightIcon className="size-4 text-muted-foreground" />
              </CardAction>
            </CardHeader>
          </Card>
        </a>
      ))}
    </div>
  )
}
