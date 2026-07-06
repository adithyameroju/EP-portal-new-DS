// S5 "Migrate" UI shell — shared types.
// Pure presentation contract: these shapes mirror the .migration/ report
// format defined in .claude/skills/compass-migrate/report-templates.md.
// No engine exists yet (Part B is gated on S1) — consumers feed these props.

export type BatchStatus =
  | "pending"
  | "in-review"
  | "approved"
  | "flagged"
  | "skipped"

export interface MigrationBatch {
  id: string
  /** Flow/feature name, e.g. "Settings flow" */
  name: string
  description: string
  status: BatchStatus
  /** Units (components/screens) in this batch */
  unitCount: number
  /** Units migrated so far (derived from disk by the engine, mocked here) */
  migratedCount: number
  /** Lowest mapping confidence in the batch, 0–1 */
  confidence: number
  /** "No Compass equivalent" items found in this batch */
  gapCount: number
  /** Low-confidence mappings / unclustered tokens awaiting Nikhil */
  needsDecisionCount: number
}

/** Mirrors the fixed four-section structure of `.migration/<unit>.md`. */
export interface MigrationReportSections {
  changed: string[]
  leftAlone: string[]
  /** Behavior deltas — flagged for QA, never silently patched */
  behaviorChanges: string[]
  verifyByHand: string[]
}

/** Mirrors `.migration/_gap-list.md` entries (feeds S6). */
export interface GapItem {
  name: string
  source: string
  role: string
  occurrences: number
}

/** Mirrors `.migration/_needs-decision.md` entries (owner review queue). */
export interface DecisionItem {
  id: string
  kind: "component" | "token"
  source: string
  candidates: Array<{ name: string; confidence: number }>
  why: string
}

export interface MigrationReport {
  batchId: string
  batchName: string
  status: BatchStatus
  /** Lowest mapping confidence used in the batch, 0–1 */
  confidence: number
  sections: MigrationReportSections
  gaps: GapItem[]
  decisions: DecisionItem[]
}
