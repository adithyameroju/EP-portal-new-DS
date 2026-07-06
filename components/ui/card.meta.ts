import type { ComponentMeta } from "./_meta-schema"

export const cardMeta: ComponentMeta = {
  name: "card",
  category: "molecule",
  purpose:
    "A composite surface container with 7 parts (Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter) for grouping related content and actions on an elevated card surface.",
  useCases: [
    "Basic card with title, description, and content (e.g. policy details)",
    "Card with action buttons in the footer (e.g. confirm/cancel)",
    "Card as a form container wrapping Label + Input pairs",
    "Card with a header action (button, link, or menu) top-right via CardAction",
    "Content-only card with no structured header",
    "Card grids and stacked card lists",
    "Interactive clickable card that navigates to a detail view",
  ],
  antiPatterns: [
    {
      wrong:
        "Put heading or subtitle text in manual divs inside CardHeader",
      instead:
        "Use CardTitle for heading text and CardDescription for subtitle text — using CardHeader alone is not enough; this is the most common structural drift",
      source: "spec:.claude/specs/components/card.md#rules-for-llms",
    },
    {
      wrong:
        "Recreate Card from scratch with a div carrying rounded, ring, and card background classes",
      instead: "Import and use the Card component from components/ui/card",
      source: "spec:.claude/specs/components/card.md#rules-for-llms",
    },
    {
      wrong:
        "Add border classes or a shadow to Card when Figma doesn't explicitly show them",
      instead:
        "The built-in subtle foreground ring IS the card's visual border — adding border classes creates a double frame; Card has no default shadow, so only add one if the Figma frame clearly shows elevation and note it in 'What I assumed'",
      source: "spec:.claude/specs/components/card.md#rules-for-llms",
    },
    {
      wrong: "Use multiple CardTitle elements in one card",
      instead:
        "One CardTitle per card; additional headings use text-lg font-semibold styling instead",
      source: "spec:.claude/specs/components/card.md#rules-for-llms",
    },
    {
      wrong:
        "Add explicit padding to CardHeader, CardContent, or CardFooter",
      instead:
        "Padding is built in — sub-components already have horizontal padding and Card itself has vertical padding",
      source: "spec:.claude/specs/components/card.md#rules-for-llms",
    },
    {
      wrong: "Use bg-background on a card surface",
      instead:
        "Cards use bg-card — the correct semantic token for elevated surfaces, even if both look identical in light mode",
      source: "spec:.claude/specs/components/card.md#rules-for-llms",
    },
    {
      wrong: "Nest a Card component inside another Card",
      instead:
        "The inner element is a div with bg-muted rounded-md p-4, not another Card component",
      source: "spec:.claude/specs/components/card.md#rules-for-llms",
    },
    {
      wrong:
        "Place CardAction outside CardHeader, or after CardDescription in the DOM",
      instead:
        "CardAction only works inside CardHeader, and the DOM order must be CardTitle, then CardAction, then CardDescription for the CSS grid to position it correctly",
      source:
        "spec:.claude/specs/components/card.md#card-with-header-action",
    },
    {
      wrong: "Use margin on individual cards to space a card list or grid",
      instead:
        "Use gap on the wrapper: gap-4 for compact lists, gap-6 for spacious grids",
      source: "spec:.claude/specs/components/card.md#card-in-layouts",
    },
    {
      wrong:
        "Style interactive cards with a shadow hover effect or transition-all",
      instead:
        "Use hover:bg-accent with cursor-pointer and transition-colors for clickable cards",
      source: "spec:.claude/specs/components/card.md#interactive-cards",
    },
  ],
  variants: [
    {
      prop: "size",
      values: ["default", "sm"],
      default: "default",
    },
  ],
  sizes: ["default", "sm"],
  parentComponents: [],
  childComponents: [
    "card-header",
    "card-footer",
    "card-title",
    "card-action",
    "card-description",
    "card-content",
  ],
  tokens: [
    "bg-card",
    "text-card-foreground",
    "ring-foreground/10",
    "bg-muted/50",
    "text-muted-foreground",
  ],
  a11y: [
    "CardTitle and CardDescription render as div elements in source (no implicit heading semantics), despite the spec anatomy table describing h3/p",
    "Interactive cards need cursor-pointer to indicate clickability; when wrapping in a Link, use a single wrapping anchor — never nested links inside",
  ],
  aiHints: {
    selectionCriteria: [],
    confusedWith: [],
    compositionRules: [
      "Use ALL composite sub-components: CardHeader > CardTitle (+ optional CardDescription, CardAction), then CardContent, then CardFooter — not manual divs",
      "CardAction goes inside CardHeader in the order CardTitle, CardAction, CardDescription; it positions itself top-right via CSS grid without affecting title/description layout",
      "In CardAction use Button variant=link for primary-colored navigational text, or variant=ghost size=sm for muted inline actions (see the button spec)",
      "Content-only cards (skipping all sub-components) need p-6 on Card itself since there is no CardContent to provide padding",
      "Footer actions follow the button spec: one primary button maximum per card",
      "Card lists/grids use wrapper gap (gap-4 compact, gap-6 spacious), never margins on individual cards",
      "Interactive cards add hover:bg-accent, cursor-pointer, and transition-colors",
    ],
    source: ".claude/specs/components/card.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/card.md",
  codeConnectStatus: "mapped",
  primitiveSource: "native",
  version: "1.0.0",
}
