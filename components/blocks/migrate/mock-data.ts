// SAMPLE DATA ONLY — a fictitious Lovable-export migration used to render the
// S5 "Migrate" UI shell in isolation. Nothing here comes from a real repo or a
// real mapping run (the resolution engine is gated on S1). Do not treat any
// mapping below as an approved heuristic.

import type { MigrationBatch, MigrationReport } from "./types"

export const SAMPLE_REPO_NAME = "acme/billing-portal (SAMPLE)"

export const SAMPLE_BATCHES: MigrationBatch[] = [
  {
    id: "settings-flow",
    name: "Settings flow",
    description: "Account, billing and notification screens (7 units)",
    status: "in-review",
    unitCount: 7,
    migratedCount: 5,
    confidence: 0.82,
    gapCount: 1,
    needsDecisionCount: 2,
  },
  {
    id: "dashboard-cards",
    name: "Dashboard cards",
    description: "KPI stat cards and usage chart wrappers (4 units)",
    status: "approved",
    unitCount: 4,
    migratedCount: 4,
    confidence: 0.94,
    gapCount: 0,
    needsDecisionCount: 0,
  },
  {
    id: "invoice-table",
    name: "Invoice table",
    description: "Invoice list, filters and export drawer (5 units)",
    status: "pending",
    unitCount: 5,
    migratedCount: 0,
    confidence: 0,
    gapCount: 0,
    needsDecisionCount: 0,
  },
  {
    id: "onboarding-wizard",
    name: "Onboarding wizard",
    description: "Three-step signup wizard (3 units)",
    status: "flagged",
    unitCount: 3,
    migratedCount: 1,
    confidence: 0.55,
    gapCount: 1,
    needsDecisionCount: 1,
  },
]

export const SAMPLE_REPORT: MigrationReport = {
  batchId: "settings-flow",
  batchName: "Settings flow",
  status: "in-review",
  confidence: 0.82,
  sections: {
    changed: [
      "settings-page.tsx — stock shadcn Card/Tabs (Radix era) swapped to Compass card/tabs imports",
      "billing-form.tsx — Input, Label, Button repointed to Compass; hardcoded purple hex accents remapped to bg-primary",
      "notification-toggles.tsx — Switch swapped; custom row layout preserved as-is",
      "index.css — 12 HSL variables clustered and remapped to Compass semantic tokens",
    ],
    leftAlone: [
      "use-billing.ts — data fetching hook (logic; out of scope by hard rule)",
      "react-router routes — untouched (routing; out of scope by hard rule)",
      "All user-facing copy — untouched",
    ],
    behaviorChanges: [
      "Tabs: Radix data-[state=open] activation replaced by Base UI data-open — arrow-key activation model differs; flagged for QA",
      "Dialog (plan-change modal): Base UI focus return lands on the trigger, source returned focus to body — flagged for QA",
    ],
    verifyByHand: [
      "Open Settings → Billing, confirm the plan-change dialog closes on overlay click",
      "Tab through the notification toggles and confirm visible focus ring on each Switch",
    ],
  },
  gaps: [
    {
      name: "UsageMeter",
      source: "src/components/UsageMeter.tsx",
      role: "segmented quota meter with threshold colors",
      occurrences: 3,
    },
  ],
  decisions: [
    {
      id: "D-01",
      kind: "component",
      source: "src/components/PlanPicker.tsx",
      candidates: [
        { name: "radio-group", confidence: 0.58 },
        { name: "toggle-group", confidence: 0.51 },
      ],
      why: "Card-styled single-select; role signals split between radio-group and toggle-group",
    },
    {
      id: "D-02",
      kind: "token",
      source: "--brand-warm (hardcoded amber hex in index.css)",
      candidates: [
        { name: "chart-4", confidence: 0.4 },
        { name: "no clean cluster", confidence: 0 },
      ],
      why: "Used for both warning banners and decorative chart fills — does not cluster to one semantic bucket",
    },
  ],
}
