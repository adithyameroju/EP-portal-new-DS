# S6 gap list — demand-driven Compass enhancements

The roadmap's principle: Compass grows on real demand, not speculation (S6.3).
This is the backlog of concrete gaps found through actual use — each waits for a
real product need before it's built. Nothing here is scheduled; it's the memory
so a real need meets a recorded gap instead of a blank page.

## Table primitive enhancements (found 2026-07-07, dogfooding Table for the foundations reference matrices)

| # | Gap | What it would take | Trigger to build |
|---|-----|--------------------|------------------|
| 19 | **No wrapping / prose-cell variant** — `TableHead`/`TableCell` hardcode `whitespace-nowrap`, so long prose columns horizontal-scroll instead of wrapping. | A `wrap` prop or a prose-cell variant that drops `whitespace-nowrap`. | A product table with genuine long-prose columns. |
| 20 | **No non-interactive / static variant** — `TableRow` bakes in `hover:bg-muted/50`, implying row interactivity on read-only tables. | A `static`/`non-interactive` variant (or a prop) that suppresses the hover affordance. | A read-only data table where the hover reads as false affordance. |
| 21 | **`className` routes to the inner `<table>`, not the overflow wrapper** — external CSS isolation needs an extra wrapping `<div>`. | Expose a `containerClassName` (or route `className` to the wrapper), mirroring how other scroll-wrapped primitives expose both. | A consumer needing to style Table's outer container directly. |

**Status:** all three are additive `table.tsx` (protected primitive) changes with
no current product demand — deferred per S6 demand-driven policy (owner ruling
2026-07-07). Gap #22 (header color) was closed as a non-issue: Table's default
`text-foreground` header is correct for real data tables.

## KPI-feature promotion candidates (from the roadmap, real source — not invented)

Seeded here so S6 promotion has real material (roadmap S6.2): the KPI feature
already built `PillSelector`, `GranularityToggle`, `DateNavigator`, `ChartCard`,
`KpiRow`, `ConfiguratorModal`, and standardized chart `Skeleton`/`Error`/`Empty`
states. These are promotion candidates when their feature code is available and
usage demand appears — NOT built speculatively.
