/**
 * live-do-dont.tsx — side-by-side LIVE rendered wrong/right pair for the
 * "Common Tasks" SOP page (owner-approved structure: .compass-build/design/
 * s2/sop-interactive-structure.PROPOSED.md, approved 2026-07-07).
 *
 * Same visual grammar as the component pages' do/don't strip
 * (stories/components/meta-doc-blocks.tsx DosAndDonts) but rendering actual
 * components instead of describing them. Only pairs whose source spec
 * contains BOTH sides as renderable code become live; prose-only rules stay
 * as the existing table rows on the page.
 *
 * ZERO NEW CONTENT: every `dontNote`/`doNote` string in the exported pairs
 * is the verbatim do/don't cell text from stories/working-with-compass/
 * common-tasks.mdx (which quotes the named spec); `source` carries the
 * citation, shown below the pair. "Don't"/"Do" strip labels are UI labels.
 * Demo strings ("Open", "Cancel", "Email") come from the cited spec examples
 * quoted on the SOP pages ("<DialogTrigger render={<Button>Open</Button>} />",
 * "Cancel/secondary on the left", field.md's Email field pattern).
 *
 * Dogfooding: Compass primitives only — no raw HTML interactive elements.
 */

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Dialog, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

/** Small provenance line — same grammar as the component docs pages. */
function SourceLine({ source }: { source: string }) {
  return (
    <p className="font-mono text-xs text-muted-foreground md:col-span-2">
      {source}
    </p>
  )
}

function PairCard({
  kind,
  note,
  children,
}: {
  kind: "dont" | "do"
  note: string
  children: React.ReactNode
}) {
  return (
    <Card size="sm" className={kind === "dont" ? "bg-destructive/5" : undefined}>
      <CardHeader>
        <CardTitle
          className={
            kind === "dont"
              ? "text-xs font-semibold tracking-wide text-destructive uppercase"
              : "text-xs font-semibold tracking-wide text-primary uppercase"
          }
        >
          {kind === "dont" ? "Don't" : "Do"}
        </CardTitle>
        <CardDescription>{note}</CardDescription>
      </CardHeader>
      <CardContent className="flex grow flex-col justify-end gap-2">
        {children}
      </CardContent>
    </Card>
  )
}

/**
 * One live wrong/right pair: two Cards side by side — destructive-tinted
 * "Don't" strip, default "Do" strip — with the spec citation below.
 */
export function LiveDoDont({
  dontNote,
  doNote,
  source,
  dontExample,
  doExample,
}: {
  dontNote: string
  doNote: string
  source: string
  dontExample: React.ReactNode
  doExample: React.ReactNode
}) {
  return (
    <div className="sb-unstyled grid gap-3 py-2 font-sans md:grid-cols-2">
      <PairCard kind="dont" note={dontNote}>
        {dontExample}
      </PairCard>
      <PairCard kind="do" note={doNote}>
        {doExample}
      </PairCard>
      <SourceLine source={source} />
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
 * The pairs. Each renders the wrong and right code from its cited rule, live.
 * ──────────────────────────────────────────────────────────────────────────── */

/** dialog.md rule 3 — trigger via render prop, never a nested Button. */
export function DialogTriggerPair() {
  return (
    <LiveDoDont
      dontNote={
        "Use asChild (“Radix pattern, causes React warnings in this repo”) or nest a Button as children (“button inside a button”)"
      }
      doNote={
        "Pass triggers via the render prop: <DialogTrigger render={<Button>Open</Button>} />"
      }
      source=".claude/specs/components/dialog.md §Rules for LLMs — rule 3 (via Common Tasks · Dialogs)"
      dontExample={
        <div className="flex">
          <Dialog>
            <DialogTrigger>
              <Button variant="outline">Open</Button>
            </DialogTrigger>
          </Dialog>
        </div>
      }
      doExample={
        <div className="flex">
          <Dialog>
            <DialogTrigger render={<Button variant="outline">Open</Button>} />
          </Dialog>
        </div>
      }
    />
  )
}

/** dialog.md rule 8 — footer order: cancel/secondary left, confirm/primary right. */
export function DialogFooterOrderPair() {
  return (
    <LiveDoDont
      dontNote="Reverse the order"
      doNote={
        "Order footer buttons: “Cancel/secondary on the left, confirm/primary on the right” (matches the built-in sm:justify-end)"
      }
      source=".claude/specs/components/dialog.md §Rules for LLMs — rule 8 (via Common Tasks · Dialogs)"
      dontExample={
        <DialogFooter>
          <Button>Save</Button>
          <Button variant="secondary">Cancel</Button>
        </DialogFooter>
      }
      doExample={
        <DialogFooter>
          <Button variant="secondary">Cancel</Button>
          <Button>Save</Button>
        </DialogFooter>
      }
    />
  )
}

/** field.md rule 2 — FieldLabel htmlFor must match the input's id. */
export function FieldLabelPair() {
  return (
    <LiveDoDont
      dontNote="Render FieldLabel with no htmlFor / input with no id"
      doNote="Match FieldLabel htmlFor to the input's id"
      source=".claude/specs/components/field.md §Rules for LLMs — rule 2 (via Common Tasks · Forms)"
      dontExample={
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input type="email" />
        </Field>
      }
      doExample={
        <Field>
          <FieldLabel htmlFor="sop-live-email">Email</FieldLabel>
          <Input id="sop-live-email" type="email" />
        </Field>
      }
    />
  )
}
