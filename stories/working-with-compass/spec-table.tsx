/**
 * spec-table.tsx — renders the SOP pages' verbatim spec tables through the
 * Compass Table primitive (dogfooding table.md rule 1: the full sub-component
 * tree, never raw markup).
 *
 * WHY THIS EXISTS: this Storybook's MDX pipeline has no GFM table support
 * (remark-gfm is not configured in .storybook/main.ts — out of scope for this
 * build to change), so markdown pipe tables render as raw text paragraphs.
 * SpecTable takes the same rows as data and renders them properly.
 *
 * ZERO NEW CONTENT: SpecTable renders exactly the strings it is given — the
 * MDX pages pass the verbatim cell text of the quoted spec tables (backtick
 * and ** markers are interpreted as inline code/bold, exactly as the markdown
 * source intended; nothing is added or reworded).
 */

import * as React from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

/** Interpret the markdown inline markers already present in the verbatim cell
 *  text: `code` spans and **bold**. Purely mechanical — no content added. */
function renderBold(text: string, key: number): React.ReactNode {
  const parts = text.split("**")
  if (parts.length === 1) return <React.Fragment key={key}>{text}</React.Fragment>
  return (
    <React.Fragment key={key}>
      {parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
      )}
    </React.Fragment>
  )
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split("`")
  if (parts.length === 1) return renderBold(text, 0)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <code key={i} className="rounded-sm bg-muted px-1 py-0.5 font-mono text-xs">
        {part}
      </code>
    ) : (
      renderBold(part, i)
    )
  )
}

/** A verbatim spec table, rendered with the Compass Table primitive. */
export function SpecTable({
  head,
  rows,
}: {
  head: string[]
  rows: string[][]
}) {
  return (
    <div className="sb-unstyled py-2 font-sans">
      <Table>
        <TableHeader>
          <TableRow>
            {head.map((label) => (
              <TableHead key={label}>{renderInline(label)}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              {row.map((cell, j) => (
                <TableCell key={j} className="align-top whitespace-normal">
                  {renderInline(cell)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
