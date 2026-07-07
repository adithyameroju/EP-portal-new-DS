/**
 * Progress stories — S2.3.
 * Title from progressMeta.category ("atom" → "Atoms"). Progress has no
 * variant axes (progressMeta.variants = []); stories are the composition
 * shapes verbatim from .claude/specs/components/progress.md "Common patterns".
 * Per the current spec text, ProgressTrack and ProgressIndicator are exported
 * but "the Progress root renders them for you" — only Progress, ProgressLabel,
 * and ProgressValue are imported here.
 * Simplifications (flagged per story):
 * - Each story sits in a `w-80` wrapper (story wrapper width only — the bar
 *   is `w-full` and needs a sized parent in Storybook).
 * - The spec's "List of progress bars (file uploads)" pattern is skipped —
 *   its `files` data is not defined in the spec (no invented copy).
 * - Each story carries `args` mirroring its render: `value` is a required
 *   prop on the Base UI progress root, so CSF story typing requires args.
 * - Custom ProgressValue text is passed as a function child: the Base UI
 *   Value part types `children` as a render function, so the spec's string
 *   children ("4 of 10") are wrapped in `() => ...` — same text, same output.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import { progressMeta } from "@/components/ui/progress.meta"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Atoms/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(progressMeta) },
  },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

/** Verbatim: spec:.claude/specs/components/progress.md "Basic progress bar". */
export const Basic: Story = {
  args: { value: 65 },
  render: () => (
    <div className="w-80">
      <Progress value={65} />
    </div>
  ),
}

/** Verbatim: spec:.claude/specs/components/progress.md "Progress with label". */
export const WithLabel: Story = {
  args: { value: 65 },
  render: () => (
    <div className="w-80">
      <Progress value={65}>
        <ProgressLabel>Uploading document</ProgressLabel>
      </Progress>
    </div>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/progress.md
 * "Progress with label and percentage value" — "`ProgressValue` automatically
 * renders the current percentage."
 */
export const WithLabelAndValue: Story = {
  args: { value: 65 },
  render: () => (
    <div className="w-80">
      <Progress value={65}>
        <ProgressLabel>Profile completion</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/progress.md
 * "Progress with custom value format" — children on ProgressValue override
 * the auto-rendered percentage.
 */
export const CustomValueFormat: Story = {
  args: { value: 4, max: 10 },
  render: () => (
    <div className="w-80">
      <Progress value={4} max={10}>
        <ProgressLabel>Step</ProgressLabel>
        {/* function child per Base UI Value typing — see file header */}
        <ProgressValue>{() => "4 of 10"}</ProgressValue>
      </Progress>
    </div>
  ),
}

// Verbatim consts from spec:.claude/specs/components/progress.md
// "Multi-step form progress".
const steps = ["Basic Info", "Coverage", "Add-ons", "Review", "Payment"]
const currentStep = 3 // 0-indexed

/** Verbatim: spec:.claude/specs/components/progress.md "Multi-step form progress". */
export const MultiStepForm: Story = {
  args: { value: (currentStep / (steps.length - 1)) * 100 },
  render: () => (
    <div className="w-80">
      <div className="flex flex-col gap-1.5">
        <Progress value={(currentStep / (steps.length - 1)) * 100}>
          <ProgressLabel>{steps[currentStep]}</ProgressLabel>
          {/* function child per Base UI Value typing — see file header */}
          <ProgressValue>
            {() => `${currentStep + 1} of ${steps.length}`}
          </ProgressValue>
        </Progress>
      </div>
    </div>
  ),
}
