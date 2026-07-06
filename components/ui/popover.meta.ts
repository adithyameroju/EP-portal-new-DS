import type { ComponentMeta } from "./_meta-schema"

export const popoverMeta: ComponentMeta = {
  name: "popover",
  category: "molecule",
  purpose:
    "A click-triggered floating panel that opens on trigger click and closes on outside click or Escape, for interactive content like forms, pickers, and filters.",
  useCases: [
    "Date picker: Calendar inside PopoverContent with width auto and zero padding",
    "Filter panel with form controls (Label, Select) and an apply Button",
    "Info popover showing supplementary details on click from an icon button",
    "Controlled popover closed programmatically via open/onOpenChange",
  ],
  antiPatterns: [
    {
      wrong:
        "Use asChild on PopoverTrigger to compose the trigger element (Radix pattern)",
      instead:
        "Use the Base UI render prop: PopoverTrigger render={<Button variant=\"outline\" />} with the trigger label as children",
      source: "spec:.claude/specs/components/popover.md#rules-for-llms",
    },
    {
      wrong:
        "Keep the default PopoverContent width and padding when placing a Calendar inside",
      instead:
        "Use className=\"w-auto p-0\" on PopoverContent — the default w-72 and p-2.5 constrain and pad the calendar incorrectly (Calendar has its own internal padding)",
      source: "spec:.claude/specs/components/popover.md#rules-for-llms",
    },
    {
      wrong: "Use Popover for read-only hover previews",
      instead:
        "Use HoverCard for hover-triggered read-only content; reserve Popover for interactive panels that open on click",
      source: "spec:.claude/specs/components/popover.md#rules-for-llms",
    },
    {
      wrong: "Add a z-index to PopoverContent",
      instead:
        "It renders in a portal with z-50 already applied",
      source: "spec:.claude/specs/components/popover.md#rules-for-llms",
    },
    {
      wrong:
        "Include PopoverHeader when the panel has no title (e.g. just a Calendar)",
      instead:
        "PopoverHeader is optional — skip it entirely when there is no heading",
      source: "spec:.claude/specs/components/popover.md#rules-for-llms",
    },
  ],
  variants: [],
  sizes: [],
  parentComponents: [],
  childComponents: [
    "popover-trigger",
    "popover-content",
    "popover-header",
    "popover-title",
    "popover-description",
  ],
  tokens: [
    "bg-popover",
    "text-popover-foreground",
    "ring-foreground",
    "text-muted-foreground",
  ],
  a11y: [
    "Opens on trigger click; closes on outside click or Escape (Base UI popover behavior)",
    "PopoverTitle and PopoverDescription are Base UI Title/Description parts, giving the panel an accessible name and description",
    "PopoverContent renders in a portal with z-50; do not add z-index manually",
    "Icon-only triggers (e.g. an info button) should use an accessible Button per the spec's info popover pattern",
  ],
  aiHints: {
    selectionCriteria: [
      "Use Popover for click-triggered interactive content (forms, pickers, filters)",
      "Use Tooltip instead for short, non-interactive text shown on hover",
      "Use HoverCard instead for rich read-only previews shown on hover",
    ],
    confusedWith: [
      {
        component: "tooltip",
        disambiguation:
          "Tooltip is hover-triggered, short text only and non-interactive; Popover is click-triggered and holds interactive content",
      },
      {
        component: "hover-card",
        disambiguation:
          "HoverCard is a hover-triggered rich read-only preview; Popover is a click-triggered panel for interactive content",
      },
    ],
    compositionRules: [
      "Structure: Popover (root, manages open state) > PopoverTrigger (click target) + PopoverContent (portal-rendered panel); add PopoverHeader > PopoverTitle + PopoverDescription only when the panel has a heading",
      "Pass the trigger element via the Base UI render prop, e.g. PopoverTrigger render={<Button variant=\"outline\" />} — never asChild",
      "Default panel width is w-72; override with w-80 or w-auto as needed; use w-auto p-0 for Calendar",
      "Positioning props on PopoverContent: side (default bottom), align (default center), sideOffset (default 4), alignOffset (default 0)",
    ],
    source: ".claude/specs/components/popover.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/popover.md",
  codeConnectStatus: "not-planned",
  primitiveSource: "base-ui",
  version: "1.0.0",
}
