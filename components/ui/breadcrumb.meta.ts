import type { ComponentMeta } from "./_meta-schema"

export const breadcrumbMeta: ComponentMeta = {
  name: "breadcrumb",
  category: "molecule",
  purpose:
    "A navigation trail (a nav landmark wrapping an ordered list) that shows the current page's location in the hierarchy, with clickable ancestor links and a non-interactive current-page label.",
  useCases: [
    "Standard 3-level breadcrumb trail (Dashboard > Policies > current page)",
    "Long trail with collapsed middle pages via BreadcrumbEllipsis",
    "Breadcrumb with a custom separator (slash or other character instead of the chevron)",
    "Breadcrumb inside a page header above the page title",
  ],
  antiPatterns: [
    {
      wrong:
        "Use asChild on BreadcrumbLink to compose with a router Link",
      instead:
        "Pass the render prop instead: BreadcrumbLink render={<Link href=... />} — this component uses Base UI's useRender pattern, and asChild is not a prop",
      source: "spec:.claude/specs/components/breadcrumb.md#rules-for-llms",
    },
    {
      wrong: "Place BreadcrumbSeparator inside a BreadcrumbItem",
      instead:
        "Render BreadcrumbSeparator as its own sibling between BreadcrumbItem elements",
      source: "spec:.claude/specs/components/breadcrumb.md#rules-for-llms",
    },
    {
      wrong: "Render the last crumb as a BreadcrumbLink",
      instead:
        "The last crumb is always BreadcrumbPage — it has aria-current=page and aria-disabled=true and is semantically the current location, not a navigation target",
      source: "spec:.claude/specs/components/breadcrumb.md#rules-for-llms",
    },
    {
      wrong: "Place BreadcrumbEllipsis directly in the list without a wrapper",
      instead:
        "Wrap BreadcrumbEllipsis in a BreadcrumbItem to maintain proper list structure; it is presentational, not a link",
      source: "spec:.claude/specs/components/breadcrumb.md#rules-for-llms",
    },
    {
      wrong: "Add aria-label=breadcrumb manually to the root",
      instead:
        "Rely on the built-in aria-label on the Breadcrumb component's nav element",
      source: "spec:.claude/specs/components/breadcrumb.md#rules-for-llms",
    },
    {
      wrong: "Put meaningful content inside BreadcrumbSeparator",
      instead:
        "Keep separators purely decorative — they are aria-hidden and screen readers skip them, inferring structure from the list",
      source: "spec:.claude/specs/components/breadcrumb.md#rules-for-llms",
    },
  ],
  variants: [],
  sizes: [],
  parentComponents: [],
  childComponents: [
    "breadcrumb-list",
    "breadcrumb-item",
    "breadcrumb-link",
    "breadcrumb-page",
    "breadcrumb-separator",
    "breadcrumb-ellipsis",
  ],
  tokens: ["text-muted-foreground", "text-foreground"],
  a11y: [
    "Root Breadcrumb renders a nav with aria-label=breadcrumb built in — do not add it manually",
    "BreadcrumbPage carries role=link, aria-disabled=true, and aria-current=page to mark the current location",
    "BreadcrumbSeparator and BreadcrumbEllipsis are role=presentation and aria-hidden=true; the ellipsis includes an sr-only 'More' label",
  ],
  aiHints: {
    selectionCriteria: [],
    confusedWith: [],
    compositionRules: [
      "Structure: Breadcrumb > BreadcrumbList > BreadcrumbItem elements, with BreadcrumbSeparator between every pair of items",
      "Each crumb lives in its own BreadcrumbItem; ancestor crumbs use BreadcrumbLink, the final crumb uses BreadcrumbPage",
      "BreadcrumbLink composes with router links via the render prop (render={<Link href=... />}), not asChild; without render it renders a plain anchor",
      "Collapse long trails by placing BreadcrumbEllipsis inside a BreadcrumbItem in the middle of the list",
      "Override the default chevron by passing children to BreadcrumbSeparator (e.g. a slash character)",
    ],
    source: ".claude/specs/components/breadcrumb.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/breadcrumb.md",
  codeConnectStatus: "not-planned",
  primitiveSource: "base-ui",
  version: "1.0.0",
}
