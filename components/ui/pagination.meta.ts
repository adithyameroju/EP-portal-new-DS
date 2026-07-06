import type { ComponentMeta } from "./_meta-schema"

export const paginationMeta: ComponentMeta = {
  name: "pagination",
  category: "molecule",
  purpose:
    "Page navigation rendered as a nav landmark with a list of anchor-based page links (styled via Button), previous/next controls, and an ellipsis for truncated ranges.",
  useCases: [],
  antiPatterns: [],
  variants: [],
  sizes: [],
  parentComponents: ["button"],
  childComponents: [
    "pagination-content",
    "pagination-item",
    "pagination-link",
    "pagination-previous",
    "pagination-next",
    "pagination-ellipsis",
  ],
  tokens: [],
  a11y: [
    "role=navigation and aria-label=pagination on the nav root",
    "aria-current=page on the active PaginationLink",
    "aria-label on PaginationPrevious (Go to previous page) and PaginationNext (Go to next page)",
    "aria-hidden on PaginationEllipsis with an sr-only More pages label",
  ],
  aiHints: {
    selectionCriteria: [],
    confusedWith: [],
    compositionRules: [],
    source: "types-only",
  },
  specStatus: "none",
  specPath: null,
  codeConnectStatus: "not-planned",
  primitiveSource: "composite",
  version: "1.0.0",
}
