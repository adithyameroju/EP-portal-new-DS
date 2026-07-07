/**
 * Migrate pattern stories — S5 C-integration (Storybook wiring; S2 gate met
 * per .compass-build/STATE.md, wired 2026-07-07).
 *
 * These stories surface the S5 "Migrate" UI SHELL from
 * `components/blocks/migrate/` rendering the SAMPLE data from its
 * `mock-data.ts` (a fictitious Lovable-export migration — nothing here comes
 * from a real repo or a real mapping run). The migration engine itself runs
 * via the `compass-migrate` skill (`.claude/skills/compass-migrate/`) in
 * Claude Code against a target repo — it does NOT run in the browser.
 *
 * One story per shell component (entry, batch list, dual preview, report)
 * plus a full-flow composition in the roadmap S5.3 order:
 * entry → batches → preview → report. All callback props are named
 * `fn()` spies so interactions log to the Storybook Actions panel — the
 * shell stays pure presentation.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"

import {
  MigrateBatchList,
  type MigrateBatchListProps,
  MigrateEntry,
  type MigrateEntryProps,
  MigratePreview,
  MigrateReport,
  type MigrateReportProps,
  SAMPLE_BATCHES,
  SAMPLE_REPO_NAME,
  SAMPLE_REPORT,
} from "@/components/blocks/migrate"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const meta = {
  title: "Patterns/Migrate",
  parameters: {
    layout: "padded",
  },
} satisfies Meta

export default meta
type Story = StoryObj

/** Args for the full-flow composition — the union of the shell callbacks. */
type FullFlowArgs = Pick<MigrateEntryProps, "onSubmitUrl" | "onSelectZip"> &
  Pick<MigrateBatchListProps, "onSelectBatch"> &
  Pick<MigrateReportProps, "onApprove" | "onFlag">

/**
 * SAMPLE pane content for the dual-preview story. In a real run the panes
 * host the target product itself (unpacked and run locally); the shell only
 * accepts arbitrary children and never executes foreign code. The "original"
 * side is a deliberately inert grey-box sketch; the "Compass" side shows the
 * same screen rebuilt from real Compass primitives.
 */
function SampleOriginalPane() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <p className="text-sm font-semibold text-foreground">
        Settings — Billing
      </p>
      <p className="text-xs text-muted-foreground">
        SAMPLE sketch of the pre-migration screen. In a real run this pane
        renders the target product, untouched.
      </p>
      <div
        className="flex flex-col gap-2 rounded-md border border-border p-3"
        aria-hidden="true"
      >
        <div className="h-4 w-1/3 rounded-sm bg-muted" />
        <div className="h-8 w-full rounded-sm bg-muted" />
        <div className="h-3 w-2/3 rounded-sm bg-muted" />
        <div className="h-8 w-1/4 rounded-md bg-muted" />
      </div>
    </div>
  )
}

function SampleCompassPane() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <p className="text-sm font-semibold text-foreground">
        Settings — Billing
      </p>
      <p className="text-xs text-muted-foreground">
        SAMPLE of the same screen after the swap — real Compass primitives,
        semantic tokens only. Structure, copy and behavior are preserved.
      </p>
      <div className="flex flex-col gap-3 rounded-md border border-border p-3">
        <Field>
          <FieldLabel htmlFor="migrate-preview-billing-email">
            Billing email
          </FieldLabel>
          <Input
            id="migrate-preview-billing-email"
            defaultValue="finance@acme.test"
            readOnly
          />
          <FieldDescription>Invoices are sent here.</FieldDescription>
        </Field>
        <Button size="sm" className="self-start">
          Save changes
        </Button>
      </div>
    </div>
  )
}

/**
 * S5.3 flow step 1 — entry pane: GitHub URL or zip upload. Callbacks only;
 * no fetching, no unzipping, no execution happens in the shell.
 */
export const Entry: StoryObj<MigrateEntryProps> = {
  args: {
    onSubmitUrl: fn().mockName("onSubmitUrl"),
    onSelectZip: fn().mockName("onSelectZip"),
  },
  render: (args) => (
    <div className="mx-auto w-full max-w-2xl">
      <MigrateEntry {...args} />
    </div>
  ),
}

/**
 * S5.3 flow step 2 — batch breakdown: the migration presented as batches
 * (one flow/feature at a time, per the strangler-fig procedure), never one
 * monolith. Statuses, confidence and counts come from SAMPLE data.
 */
export const BatchList: StoryObj<MigrateBatchListProps> = {
  args: {
    onSelectBatch: fn().mockName("onSelectBatch"),
  },
  render: (args) => (
    <div className="mx-auto w-full max-w-2xl">
      <MigrateBatchList
        {...args}
        repoName={SAMPLE_REPO_NAME}
        batches={SAMPLE_BATCHES}
      />
    </div>
  ),
}

/**
 * S5.3 flow step 3 — dual preview: original beside the Compass-migrated
 * version for one batch. The panes accept arbitrary children (SAMPLE frames
 * here); the shell never runs or renders foreign code itself. Drag the
 * handle to resize; omit a pane's children to see the skeleton state.
 */
export const DualPreview: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-4xl">
      <MigratePreview
        batchName="Settings flow"
        originalPane={<SampleOriginalPane />}
        compassPane={<SampleCompassPane />}
      />
    </div>
  ),
}

/**
 * S5.3 flow step 4 — per-batch report mirroring the fixed
 * `.migration/` structure (Changed / Left alone / Behavior changes / Verify
 * by hand) plus the gap list and the owner review queue. Approve is disabled
 * while needs-decision items are pending; Flag stays available. Both log to
 * the Actions panel.
 */
export const Report: StoryObj<MigrateReportProps> = {
  args: {
    onApprove: fn().mockName("onApprove"),
    onFlag: fn().mockName("onFlag"),
  },
  render: (args) => (
    <div className="mx-auto w-full max-w-2xl">
      <MigrateReport {...args} report={SAMPLE_REPORT} />
    </div>
  ),
}

/**
 * The whole S5.3 flow in order — entry → batch breakdown → per-batch dual
 * preview → batch report — arranged as one page, all on SAMPLE data. This is
 * a composition of the four shell components above, not a working tool: the
 * engine runs via the `compass-migrate` skill in Claude Code, not in the
 * browser.
 */
export const FullFlow: StoryObj<FullFlowArgs> = {
  args: {
    onSubmitUrl: fn().mockName("onSubmitUrl"),
    onSelectZip: fn().mockName("onSelectZip"),
    onSelectBatch: fn().mockName("onSelectBatch"),
    onApprove: fn().mockName("onApprove"),
    onFlag: fn().mockName("onFlag"),
  },
  render: (args) => (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <MigrateEntry
        onSubmitUrl={args.onSubmitUrl}
        onSelectZip={args.onSelectZip}
      />
      <MigrateBatchList
        repoName={SAMPLE_REPO_NAME}
        batches={SAMPLE_BATCHES}
        onSelectBatch={args.onSelectBatch}
      />
      <MigratePreview
        batchName="Settings flow"
        originalPane={<SampleOriginalPane />}
        compassPane={<SampleCompassPane />}
      />
      <MigrateReport
        report={SAMPLE_REPORT}
        onApprove={args.onApprove}
        onFlag={args.onFlag}
      />
    </div>
  ),
}
