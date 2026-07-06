import type { ComponentMeta } from "./_meta-schema"

export const drawerMeta: ComponentMeta = {
  name: "drawer",
  category: "organism",
  purpose:
    "A mobile-first sliding panel built on the vaul library, optimised for touch with a visible drag handle, momentum-based drag-to-dismiss, and snap-point support.",
  useCases: [
    "Mobile action sheet with a few options (bottom drawer with stacked full-width buttons)",
    "Mobile-friendly bottom panel with touch drag-to-dismiss",
    "Drawer with form content (labelled inputs plus a Save/Cancel footer)",
    "Controlled drawer whose open state is managed via open/onOpenChange",
    "Responsive panel: Drawer on mobile, Sheet on desktop (switched via the useIsMobile hook)",
  ],
  antiPatterns: [
    {
      wrong: "Add a DrawerOverlay manually inside or next to DrawerContent",
      instead:
        "Use DrawerContent as-is; it renders the overlay automatically inside its portal",
      source: "spec:.claude/specs/components/drawer.md#rules-for-llms",
    },
    {
      wrong: "Add a manual drag-handle div to the top of the drawer",
      instead:
        "Rely on the built-in drag handle pill; it appears automatically for direction bottom and top",
      source: "spec:.claude/specs/components/drawer.md#rules-for-llms",
    },
    {
      wrong:
        "Expect DrawerFooter to lay out Cancel and Confirm side by side",
      instead:
        "DrawerFooter stacks buttons vertically (flex-col gap-2); for a side-by-side pattern wrap the buttons in a flex flex-row gap-2 div inside DrawerFooter",
      source: "spec:.claude/specs/components/drawer.md#rules-for-llms",
    },
    {
      wrong: "Use Drawer for a desktop side panel or persistent desktop workflow",
      instead:
        "Default to Sheet on desktop layouts; use Drawer when targeting mobile or building a responsive component that needs touch-friendly behaviour",
      source: "spec:.claude/specs/components/drawer.md#rules-for-llms",
    },
    {
      wrong: "Use DrawerHeader without a DrawerTitle",
      instead:
        "Always include DrawerTitle when DrawerHeader is used; accessibility requires a title on all modal surfaces",
      source: "spec:.claude/specs/components/drawer.md#rules-for-llms",
    },
  ],
  variants: [
    {
      prop: "direction",
      values: ["top", "bottom", "left", "right"],
      default: "bottom",
    },
  ],
  sizes: [],
  parentComponents: [],
  childComponents: [
    "drawer-portal",
    "drawer-overlay",
    "drawer-trigger",
    "drawer-close",
    "drawer-content",
    "drawer-header",
    "drawer-footer",
    "drawer-title",
    "drawer-description",
  ],
  tokens: [
    "bg-popover",
    "text-popover-foreground",
    "bg-muted",
    "text-foreground",
    "text-muted-foreground",
  ],
  a11y: [
    "DrawerTitle is required whenever DrawerHeader is used — accessibility requires a title on all modal surfaces",
    "DrawerTitle and DrawerDescription render vaul's Title and Description primitives, which provide the accessible name and description for the panel",
    "The drag handle pill is decorative and built-in; drag-to-dismiss is handled by vaul",
  ],
  aiHints: {
    selectionCriteria: [
      "Use Drawer for a mobile-first bottom panel with touch drag-to-dismiss",
      "Use Drawer (default direction bottom) for a mobile action sheet with a few options",
      "Use Sheet instead for a full-height side panel on desktop",
      "Use Sheet instead for a persistent panel alongside content",
      "For a desktop app with a responsive mobile panel, use Drawer for mobile and Sheet for desktop",
    ],
    confusedWith: [
      {
        component: "sheet",
        disambiguation:
          "Drawer is optimised for touch — visible drag handle, momentum-based dismissal, snap points; Sheet is a keyboard/pointer panel suited for desktop workflows",
      },
    ],
    compositionRules: [
      "DrawerTrigger and DrawerClose use asChild — Drawer is built on vaul (Radix-based), a documented exception to the repo-wide Base UI render-prop rule",
      "Structure: Drawer (root) > DrawerTrigger + DrawerContent; DrawerContent holds the built-in drag handle, DrawerHeader (DrawerTitle + DrawerDescription), your content, then DrawerFooter",
      "DrawerContent includes the overlay automatically — never add DrawerOverlay manually",
      "Set direction on the Drawer root (top, bottom, left, right); bottom is the default",
      "The drag handle appears automatically for direction bottom and top only",
      "Bottom and top drawers cap at 80 percent of viewport height; left and right drawers are three-quarters width capped at max-w-sm on small screens and up",
      "DrawerHeader text is centered on mobile and left-aligned at the md breakpoint for bottom/top drawers; always left-aligned for left/right drawers",
      "DrawerFooter stacks its buttons vertically; wrap buttons in a flex row div for side-by-side actions",
    ],
    source: ".claude/specs/components/drawer.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/drawer.md",
  codeConnectStatus: "not-planned",
  primitiveSource: "vaul",
  version: "1.0.0",
}
