// S5 "Migrate" UI shell — isolated block (approved 2026-07-06).
// Pure presentation with mock data. Not imported by any route or story yet:
// Storybook wiring happens at S2, CLI shipping at S3, and the resolution
// engine behind these props is gated on S1 (see .claude/skills/compass-migrate/).

export { MigrateEntry, type MigrateEntryProps } from "./migrate-entry"
export {
  MigrateBatchList,
  type MigrateBatchListProps,
} from "./migrate-batch-list"
export { MigratePreview, type MigratePreviewProps } from "./migrate-preview"
export { MigrateReport, type MigrateReportProps } from "./migrate-report"
export type {
  BatchStatus,
  DecisionItem,
  GapItem,
  MigrationBatch,
  MigrationReport,
  MigrationReportSections,
} from "./types"
export { SAMPLE_BATCHES, SAMPLE_REPORT, SAMPLE_REPO_NAME } from "./mock-data"
