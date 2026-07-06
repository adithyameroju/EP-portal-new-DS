import type { ComponentMeta } from "./_meta-schema"

export const sheetMeta: ComponentMeta = {
  name: "sheet",
  category: "organism",
  purpose:
    "A slide-over panel for tasks that need more space than a Dialog but shouldn't navigate away from the current page — editing a record, viewing details, multi-step forms, filters/configuration panels.",
  useCases: [
    "Right-side edit panel for a record with form fields and Save/Cancel actions",
    "Full-height detail view opened from a list or table row",
    "Left-side filter/configuration panel with Clear and Apply actions",
    "Bottom sheet with stacked action buttons (mobile-friendly options menu)",
    "Sheet opened programmatically (controlled open/onOpenChange, no trigger)",
  ],
  antiPatterns: [
    {
      wrong:
        "Use asChild on SheetTrigger, or nest a Button inside SheetTrigger's children (creates a button inside a button)",
      instead:
        "Pass the trigger element via the Base UI render prop: SheetTrigger render={<Button variant=\"outline\">Open</Button>}",
      source: "spec:.claude/specs/components/sheet.md#rules-for-llms",
    },
    {
      wrong: "Use SheetHeader without a SheetTitle",
      instead:
        "Always include SheetTitle when SheetHeader is used — accessibility requires a title on all modal-like surfaces",
      source: "spec:.claude/specs/components/sheet.md#rules-for-llms",
    },
    {
      wrong: "Add mt-auto manually to SheetFooter",
      instead:
        "SheetFooter already stacks with mt-auto and pushes to the bottom of the panel regardless of content height",
      source: "spec:.claude/specs/components/sheet.md#rules-for-llms",
    },
    {
      wrong:
        "Assume SheetContent pads its children like Card and leave content flush against the panel edges",
      instead:
        "Add px-4 to content divs between SheetHeader and SheetFooter — SheetContent does not apply padding to its children",
      source: "spec:.claude/specs/components/sheet.md#rules-for-llms",
    },
    {
      wrong:
        "Set a fixed height on SheetContent for the right or left side",
      instead:
        "Right and left sheets are always full-height; setting a height breaks the layout",
      source: "spec:.claude/specs/components/sheet.md#rules-for-llms",
    },
    {
      wrong:
        "Use Sheet for content that fits comfortably in a centered modal (under roughly 500px tall)",
      instead:
        "Use Dialog for compact content; use Sheet when the content needs full viewport height or a scrollable panel",
      source: "spec:.claude/specs/components/sheet.md#rules-for-llms",
    },
    {
      wrong: "Mix Sheet sub-components with Dialog sub-components",
      instead:
        "Sheet and Dialog share the same Base UI Dialog primitive but have different layouts — keep each family's sub-components together",
      source: "spec:.claude/specs/components/sheet.md#component-location",
    },
  ],
  variants: [
    {
      prop: "side",
      values: ["top", "right", "bottom", "left"],
      default: "right",
    },
  ],
  sizes: [],
  parentComponents: ["button"],
  childComponents: [
    "sheet-trigger",
    "sheet-close",
    "sheet-content",
    "sheet-header",
    "sheet-footer",
    "sheet-title",
    "sheet-description",
  ],
  tokens: [
    "bg-popover",
    "text-popover-foreground",
    "text-foreground",
    "text-muted-foreground",
  ],
  a11y: [
    "Built on the Base UI Dialog primitive, which provides modal dialog semantics, focus management, and dismiss behavior",
    "SheetTitle is required whenever SheetHeader is used — modal-like surfaces must have a title",
    "The built-in close button includes a visually hidden Close label (sr-only span) for screen readers",
  ],
  aiHints: {
    selectionCriteria: [
      "Use Sheet for a full-height side panel with detailed content or a form",
      "Use Dialog instead for a compact confirmation or short form in the center of the screen",
      "Use Drawer instead for a mobile-optimised bottom panel with snap points and touch-friendly behavior",
      "Use AlertDialog instead for a destructive confirmation requiring an explicit choice",
      "Use Sidebar (which uses Sheet internally) for navigation sidebars on mobile",
    ],
    confusedWith: [
      {
        component: "dialog",
        disambiguation:
          "Dialog is a compact centered modal for confirmations and short forms; Sheet is a full-height slide-over panel for tasks needing more space",
      },
      {
        component: "drawer",
        disambiguation:
          "Drawer is the mobile-optimised bottom panel with snap points; Sheet is the general slide-over panel from any edge",
      },
      {
        component: "alert-dialog",
        disambiguation:
          "AlertDialog is a blocking destructive confirmation requiring an explicit choice; Sheet is a workspace panel",
      },
      {
        component: "sidebar",
        disambiguation:
          "Sidebar is the app navigation system (it renders as a Sheet internally on mobile); Sheet is a general-purpose slide-over panel",
      },
    ],
    compositionRules: [
      "Structure: Sheet (root) > SheetTrigger + SheetContent; SheetContent holds the built-in close button, SheetHeader (SheetTitle + SheetDescription), your content, then SheetFooter",
      "SheetTrigger and SheetClose compose their elements via the Base UI render prop, never asChild and never a nested Button",
      "Use SheetClose render={<Button variant=\"outline\">Cancel</Button>} for a labelled cancel button in the footer; the built-in showCloseButton x icon is separate and can coexist",
      "Content divs between SheetHeader and SheetFooter need their own px-4 padding",
      "A Sheet can be opened programmatically with controlled open/onOpenChange and no SheetTrigger",
    ],
    source: ".claude/specs/components/sheet.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/sheet.md",
  codeConnectStatus: "mapped",
  primitiveSource: "base-ui",
  version: "1.0.0",
}
