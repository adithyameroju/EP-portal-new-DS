import type { ComponentMeta } from "./_meta-schema"

export const tooltipMeta: ComponentMeta = {
  name: "tooltip",
  category: "molecule",
  purpose:
    "A small label that appears on hover (or keyboard focus) to provide supplementary context for an element — typically an icon button, a truncated label, or an abbreviation; non-interactive supplementary information only.",
  useCases: [
    "Hover label on an icon-only button (most common)",
    "Supplementary explanation positioned beside an info icon",
    "Keyboard shortcut hint with a Kbd element inside the tooltip",
    "Explanation for a disabled button (trigger rendered as a focusable span wrapper)",
    "Layout-level TooltipProvider sharing one hover delay across all tooltips on a page",
  ],
  antiPatterns: [
    {
      wrong:
        "Use asChild on TooltipTrigger, or nest a Button inside TooltipTrigger's children (creates a nested button)",
      instead:
        "Pass the trigger element via the Base UI render prop: TooltipTrigger render={<Button variant=\"ghost\" size=\"icon\" />} with the icon as children",
      source: "spec:.claude/specs/components/tooltip.md#rules-for-llms",
    },
    {
      wrong:
        "Put buttons, links, or inputs inside TooltipContent",
      instead:
        "Tooltip content must be text only; use Popover for interactive popovers",
      source: "spec:.claude/specs/components/tooltip.md#rules-for-llms",
    },
    {
      wrong: "Create a TooltipProvider per tooltip",
      instead:
        "Wrap TooltipProvider once at the layout level — a single provider handles all tooltips on a page",
      source: "spec:.claude/specs/components/tooltip.md#rules-for-llms",
    },
    {
      wrong:
        "Rely on the tooltip alone for an icon-only button's label",
      instead:
        "Icon-only buttons need both an aria-label (for screen readers) and a tooltip (for sighted mouse users)",
      source: "spec:.claude/specs/components/tooltip.md#rules-for-llms",
    },
    {
      wrong: "Use Tooltip for form field descriptions or help text",
      instead:
        "Use FieldDescription from the Field system for form help text; Tooltip is for supplementary context on interactive elements",
      source: "spec:.claude/specs/components/tooltip.md#rules-for-llms",
    },
    {
      wrong: "Add a z-index to TooltipContent",
      instead:
        "TooltipContent renders in a portal with a z-50 layer already applied",
      source: "spec:.claude/specs/components/tooltip.md#rules-for-llms",
    },
    {
      wrong: "Specify the side prop on every tooltip",
      instead:
        "Top placement is the default; only set side when top placement causes clipping (e.g. near the top edge of the viewport)",
      source: "spec:.claude/specs/components/tooltip.md#rules-for-llms",
    },
  ],
  variants: [],
  sizes: [],
  parentComponents: [],
  childComponents: ["tooltip-trigger", "tooltip-content", "tooltip-provider"],
  tokens: ["bg-foreground", "text-background"],
  a11y: [
    "Opens on keyboard focus as well as hover, via the Base UI tooltip primitive",
    "Content must be non-interactive text only — no buttons, links, or form controls",
    "Icon-only triggers still require aria-label; the tooltip is not a screen-reader substitute",
    "Disabled elements cannot receive focus and therefore cannot show a tooltip — wrap the disabled control in a focusable span (tabIndex 0) used as the trigger's render element",
  ],
  aiHints: {
    selectionCriteria: [
      "Use Tooltip for a short hover/focus label supplementing an icon button, truncated label, or abbreviation",
      "Use Popover instead when the popup must contain interactive elements",
      "Use FieldDescription instead for form field help text",
      "Tooltip content is supplementary — never put essential information only in a tooltip trigger's popup without an aria-label on the trigger",
    ],
    confusedWith: [
      {
        component: "popover",
        disambiguation:
          "Popover holds interactive content (buttons, links, inputs); Tooltip is non-interactive supplementary text only",
      },
      {
        component: "field",
        disambiguation:
          "FieldDescription in the Field system handles form field help text; Tooltip is for supplementary context on interactive elements",
      },
    ],
    compositionRules: [
      "Structure: TooltipProvider (once, at page/layout level) > Tooltip (root) > TooltipTrigger + TooltipContent (portal-rendered with built-in arrow)",
      "TooltipTrigger composes its element via the Base UI render prop — the trigger's children become TooltipTrigger's children",
      "For disabled buttons, render the trigger as a focusable span (tabIndex 0) wrapping the disabled Button",
      "For keyboard shortcut hints, place a Kbd element inside TooltipContent after the text",
      "Positioning props on TooltipContent: side (top default), sideOffset (4 default), align (center default), alignOffset (0 default)",
    ],
    source: ".claude/specs/components/tooltip.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/tooltip.md",
  codeConnectStatus: "not-planned",
  primitiveSource: "base-ui",
  version: "1.0.0",
}
