import type { ComponentMeta } from "./_meta-schema"

export const tableMeta: ComponentMeta = {
  name: "table",
  category: "organism",
  purpose:
    "Composable data table for Acko enterprise data — column headers, data rows, summary footer, caption, and a built-in horizontal-scroll container.",
  useCases: [
    "Policy listing with status column",
    "Claims list with linked policy numbers",
    "Premium summary table with totals footer",
    "Paginated enterprise data table (Pagination below the Table)",
    "Selectable rows (data-state selected)",
  ],
  antiPatterns: [
    {
      wrong:
        "Use raw table, thead, tbody, tr, th, or td elements directly",
      instead:
        "Always use the full sub-component tree (Table, TableHeader, TableBody, TableRow, TableHead, TableCell) — it provides tokens, hover states, and scroll behaviour",
      source: "spec:.claude/specs/components/table.md#rules-for-llms",
    },
    {
      wrong:
        "Represent status with colored text (e.g. a span with a green Tailwind text utility)",
      instead:
        "Use Badge inside TableCell with the documented status-to-variant mapping",
      source: "spec:.claude/specs/components/table.md#rules-for-llms",
    },
    {
      wrong:
        "Use a plain anchor tag or onClick + router.push() for navigable text in cells",
      instead:
        'Use Button with render={<Link href="..." />} and variant="link" (Base UI render prop, never asChild)',
      source: "spec:.claude/specs/components/table.md#rules-for-llms",
    },
    {
      wrong: "Put actions or pagination inside TableFooter",
      instead:
        "TableFooter is for summary rows only; Pagination goes below the Table, not inside it",
      source: "spec:.claude/specs/components/table.md#rules-for-llms",
    },
    {
      wrong: "Leave numeric columns (currency, counts, percentages) left-aligned",
      instead:
        "Add the text-right class to both the TableHead and TableCell of numeric columns",
      source: "spec:.claude/specs/components/table.md#rules-for-llms",
    },
    {
      wrong: "Add manual hover styles to TableRow",
      instead:
        "The muted hover background is already built into TableRow; adding more hover classes creates doubled effects",
      source: "spec:.claude/specs/components/table.md#rules-for-llms",
    },
    {
      wrong: "Place TableCaption outside the Table",
      instead:
        "TableCaption goes inside Table; it renders below the table as an accessibility caption and visible footnote",
      source: "spec:.claude/specs/components/table.md#rules-for-llms",
    },
    {
      wrong:
        "Modify the Table primitive for one-off layouts (special row colours, custom borders, non-standard structure)",
      instead:
        'Flag it in "What I assumed" and compose using Tailwind utilities on the existing sub-components rather than creating a new component',
      source: "spec:.claude/specs/components/table.md#rules-for-llms",
    },
  ],
  variants: [],
  sizes: [],
  parentComponents: [],
  childComponents: [
    "table-header",
    "table-body",
    "table-footer",
    "table-head",
    "table-row",
    "table-cell",
    "table-caption",
  ],
  tokens: ["bg-muted", "text-foreground", "text-muted-foreground"],
  a11y: [
    "Uses native semantic table elements (table, thead, tbody, tfoot, tr, th, td, caption) so assistive technology gets table semantics for free",
    "TableCaption renders a native caption element — an accessibility caption and visible footnote below the table",
    "Selected rows are communicated via a data-state selected attribute on TableRow",
    "Cells and header cells that contain a checkbox (role=checkbox) get adjusted padding for row-selection patterns",
    "Horizontal overflow is handled by the built-in scroll container, keeping wide tables reachable on narrow screens",
  ],
  aiHints: {
    selectionCriteria: [
      "Use for tabular data with column headers (a Figma data table with headers maps to Table with TableHeader + TableBody)",
      "Use TableFooter when the table has a totals or summary row",
      "Use TableCaption for an accessible description or visible footnote",
      "Categorical state in a cell (colored status label in Figma) maps to Badge inside TableCell, never colored text",
    ],
    confusedWith: [],
    compositionRules: [
      "Sub-part order inside Table: TableHeader, then TableBody, then optional TableFooter; TableCaption also goes inside Table",
      "Every column needs one TableHead in the header row and one TableCell per body row",
      "Status to Badge variant mapping (spec:.claude/specs/components/table.md#table-with-status-badges-acko-enterprise-pattern): Active / Approved / Success use variant default; Pending / Processing / Draft use variant outline; Expired / Failed / Rejected use variant destructive; Inactive / Cancelled use variant secondary",
      'Linked text in cells: Button with render={<Link href="..." />} and variant="link" inside TableCell',
      "Pagination sits below the Table in a flex column, using the Pagination component — never build custom pagination and never place it inside TableFooter",
      'Mark a selected row with data-state="selected" on TableRow',
      "Right-align numeric columns by adding text-right to both TableHead and TableCell",
    ],
    source: ".claude/specs/components/table.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/table.md",
  codeConnectStatus: "mapped",
  primitiveSource: "native",
  primitiveElements: ["table"],
  version: "1.0.0",
}
