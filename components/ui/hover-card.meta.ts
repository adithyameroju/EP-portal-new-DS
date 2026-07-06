import type { ComponentMeta } from "./_meta-schema"

export const hoverCardMeta: ComponentMeta = {
  name: "hover-card",
  category: "molecule",
  purpose:
    "A rich preview popup that appears when the user hovers over a trigger element — for displaying supplementary context about a link, user, or entity without requiring a click.",
  useCases: [
    "User profile preview on hover over a username link (avatar, name, role, metadata)",
    "Policy preview on hover over a policy ID in a table (name, status badge, premium, expiry)",
    "Term definition on hover over a dotted-underline abbreviation (e.g. IDV)",
  ],
  antiPatterns: [
    {
      wrong:
        "Use asChild on HoverCardTrigger to compose it with a Button (Radix pattern)",
      instead:
        "Pass the trigger element via the Base UI render prop: HoverCardTrigger render={<Button variant=\"link\" />} with the visible text as children",
      source: "spec:.claude/specs/components/hover-card.md#rules-for-llms",
    },
    {
      wrong:
        "Nest the trigger element as a plain child of HoverCardTrigger, creating an unstyled wrapper",
      instead:
        "Use the render prop so the trigger renders as the passed element itself",
      source: "spec:.claude/specs/components/hover-card.md#rules-for-llms",
    },
    {
      wrong:
        "Place buttons, inputs, or other interactive controls inside HoverCardContent",
      instead:
        "Keep HoverCard content read-only — it is a preview, not a control surface; use Popover for interactive content",
      source: "spec:.claude/specs/components/hover-card.md#rules-for-llms",
    },
    {
      wrong: "Use HoverCard for a simple one-line text hint",
      instead:
        "Use Tooltip for one-line hints; use HoverCard when the preview needs layout — avatar, multiple lines, metadata rows",
      source: "spec:.claude/specs/components/hover-card.md#rules-for-llms",
    },
    {
      wrong:
        "Override the fixed w-64 width with a much wider card for standard previews",
      instead:
        "Keep the default width; if you genuinely need a wider card, use className w-80 but keep it constrained",
      source: "spec:.claude/specs/components/hover-card.md#rules-for-llms",
    },
    {
      wrong: "Add a z-index to HoverCardContent",
      instead:
        "Rely on the built-in stacking; it renders in a portal with z-50 already applied",
      source: "spec:.claude/specs/components/hover-card.md#rules-for-llms",
    },
  ],
  variants: [],
  sizes: [],
  parentComponents: [],
  childComponents: ["hover-card-trigger", "hover-card-content"],
  tokens: ["bg-popover", "text-popover-foreground", "ring-foreground/10"],
  a11y: [
    "Built on Base UI's PreviewCard primitive, which manages the hover-open state and open delay",
    "Content must be read-only — hover-triggered surfaces are not a reliable home for interactive controls; use Popover for anything the user must click or type into",
  ],
  aiHints: {
    selectionCriteria: [
      "Use HoverCard for rich card content on hover — avatar, metadata, stats — with an open delay; it can contain links",
      "Use Tooltip instead for a short one-line text label that appears instantly with no rich content",
      "Use Popover instead when the surface opens on click or contains interactive controls (forms, buttons)",
    ],
    confusedWith: [
      {
        component: "tooltip",
        disambiguation:
          "Tooltip is a short one-line text label that appears instantly; HoverCard is rich card content (avatar, metadata, stats) with an open delay",
      },
      {
        component: "popover",
        disambiguation:
          "Popover opens on click and can contain interactive controls; HoverCard opens on hover and its content is read-only",
      },
      {
        component: "card",
        disambiguation:
          "HoverCard is built on Base UI's PreviewCard popup primitive, not the Card layout component — do not confuse the two",
      },
    ],
    compositionRules: [
      "Structure: HoverCard (root) > HoverCardTrigger + HoverCardContent; content is portal-rendered",
      "HoverCardTrigger composes its trigger element via the Base UI render prop, never asChild and never a bare nested element",
      "Position via HoverCardContent props: side (top, right, bottom, left; default bottom), sideOffset (default 4), align (start, center, end; default center), alignOffset (default 4)",
      "Content is custom JSX (avatar + metadata, definition text, key-value rows) — there are no header/footer sub-components",
    ],
    source: ".claude/specs/components/hover-card.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/hover-card.md",
  codeConnectStatus: "not-planned",
  primitiveSource: "base-ui",
  version: "1.0.0",
}
