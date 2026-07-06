import type { ComponentMeta } from "./_meta-schema"

export const badgeMeta: ComponentMeta = {
  name: "badge",
  category: "atom",
  purpose:
    "A small pill-shaped label for status values, tags, and count indicators, chosen by semantic meaning rather than aesthetics.",
  useCases: [
    "Status label on a record (Active, Pending, Expired, Cancelled) using the Acko status-to-variant mapping",
    "Status badge inside a table cell or card header",
    "Tag or category label (e.g. Motor, Health, Life) with the outline variant",
    "Badge with a small auto-sized icon plus text",
    "Navigational label rendered as a link via the render prop (variant link)",
  ],
  antiPatterns: [
    {
      wrong: "Use Badge as a click target that triggers an action",
      instead:
        "Badge is for labels; use Button when the element performs an action (navigation-only labels may use variant link with render)",
      source: "spec:.claude/specs/components/badge.md#rules-for-llms",
    },
    {
      wrong:
        "Invent new status semantics, e.g. using secondary for Expired to soften it visually",
      instead:
        "Follow the Acko status-to-variant mapping table exactly (Expired/Failed/Rejected/Overdue are always destructive)",
      source: "spec:.claude/specs/components/badge.md#rules-for-llms",
    },
    {
      wrong:
        "Override the destructive variant with a solid red background and white text via className",
      instead:
        "Keep the intentionally soft destructive styling (10% opacity destructive background with destructive text) — it is by design for enterprise UI",
      source: "spec:.claude/specs/components/badge.md#rules-for-llms",
    },
    {
      wrong: "Add size classes to Badge (larger text or height utilities)",
      instead:
        "Badge has no size variants; the built-in extra-small text and fixed height are always correct",
      source: "spec:.claude/specs/components/badge.md#rules-for-llms",
    },
    {
      wrong: "Add padding overrides such as wider horizontal padding",
      instead:
        "Keep the built-in padding; wider badges should have more text, not more padding",
      source: "spec:.claude/specs/components/badge.md#rules-for-llms",
    },
    {
      wrong: "Add a className to size the icon inside a Badge",
      instead:
        "Icons inside Badge are automatically enforced to 12px; no icon class needed",
      source: "spec:.claude/specs/components/badge.md#rules-for-llms",
    },
    {
      wrong:
        "Use a plain span with a raw green/red color utility class for status text",
      instead:
        "Always use Badge with the semantically correct variant for status values",
      source: "spec:.claude/specs/components/badge.md#rules-for-llms",
    },
  ],
  variants: [
    {
      prop: "variant",
      values: [
        "default",
        "secondary",
        "destructive",
        "outline",
        "ghost",
        "link",
      ],
      default: "default",
    },
  ],
  sizes: [],
  parentComponents: [],
  childComponents: [],
  tokens: [
    "bg-primary",
    "text-primary-foreground",
    "bg-secondary",
    "text-secondary-foreground",
    "bg-destructive/10",
    "text-destructive",
    "border-border",
    "text-foreground",
    "bg-muted",
    "text-muted-foreground",
    "text-primary",
    "rounded-4xl",
  ],
  a11y: [
    "Renders as a span by default; when it must navigate, render it as an anchor/Link via the render prop rather than adding click handlers",
    "Source styles include focus-visible ring treatment and aria-invalid destructive styling for interactive/linked renders",
  ],
  aiHints: {
    selectionCriteria: [
      "Use variant default for positive/active/primary states (Active, Approved, Verified, Published)",
      "Use variant secondary for neutral/inactive states (Inactive, Cancelled, Draft)",
      "Use variant destructive for negative/error states (Expired, Failed, Rejected, Overdue)",
      "Use variant outline for informational/in-progress states (Pending, Processing, In Review)",
      "Use variant ghost for subtle supplementary tags/categories, and variant link when the badge itself should navigate",
    ],
    confusedWith: [
      {
        component: "button",
        disambiguation:
          "Badge is a label, not an action trigger; if the element needs to be clicked to trigger an action, use Button",
      },
    ],
    compositionRules: [
      "To render Badge as a link, use the render prop with an anchor or router Link (Base UI useRender pattern), not asChild",
      "Icons go directly inside Badge alongside the text and are auto-sized to 12px",
      "Apply the Acko status-to-variant mapping consistently across all enterprise screens",
    ],
    source: ".claude/specs/components/badge.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/badge.md",
  codeConnectStatus: "not-planned",
  primitiveSource: "base-ui",
  version: "1.0.0",
}
