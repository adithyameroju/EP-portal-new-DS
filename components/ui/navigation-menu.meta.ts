import type { ComponentMeta } from "./_meta-schema"

export const navigationMenuMeta: ComponentMeta = {
  name: "navigation-menu",
  category: "organism",
  purpose:
    "A horizontal navigation bar where menu items can open rich dropdown panels (mega-menus) on hover, built on Base UI's navigation-menu primitive.",
  useCases: [
    "Website-style top navigation bar with hover-triggered dropdown panels",
    "Mega-menu panel with a grid of product links, each with title and description",
    "Simple top nav with direct links only (no dropdowns)",
    "Direct nav link styled to match dropdown triggers via navigationMenuTriggerStyle()",
  ],
  antiPatterns: [
    {
      wrong:
        "Use asChild on NavigationMenuLink to compose a router link (Radix pattern)",
      instead:
        "Use the Base UI render prop: NavigationMenuLink render={<Link href=... />} with the link text as children",
      source: "spec:.claude/specs/components/navigation-menu.md#rules-for-llms",
    },
    {
      wrong:
        "Pass href directly to NavigationMenuLink for router navigation, which renders a nested anchor",
      instead:
        "Pass the Next.js Link via the render prop instead of an href on NavigationMenuLink",
      source: "spec:.claude/specs/components/navigation-menu.md#rules-for-llms",
    },
    {
      wrong:
        "Leave direct-link nav items (no dropdown) unstyled or style them with custom classes",
      instead:
        "Apply navigationMenuTriggerStyle() as the className so direct links match the visual style of items with dropdowns",
      source: "spec:.claude/specs/components/navigation-menu.md#rules-for-llms",
    },
    {
      wrong: "Add a manual chevron icon to NavigationMenuTrigger",
      instead:
        "Rely on the built-in ChevronDownIcon, which rotates 180 degrees when the panel is open",
      source: "spec:.claude/specs/components/navigation-menu.md#rules-for-llms",
    },
    {
      wrong: "Import or add NavigationMenuPositioner manually",
      instead:
        "The positioner is internal — it is included automatically inside the NavigationMenu root",
      source: "spec:.claude/specs/components/navigation-menu.md#rules-for-llms",
    },
    {
      wrong:
        "Use NavigationMenu for app sidebars or desktop-app menu bars",
      instead:
        "Use Sidebar for app sidebars and Menubar for File/Edit/View menu bars; NavigationMenu is for website-style horizontal nav",
      source: "spec:.claude/specs/components/navigation-menu.md#rules-for-llms",
    },
    {
      wrong:
        "Expect NavigationMenuContent to have a fixed width or set the panel width on it directly",
      instead:
        "Panel width is determined by its content; set width via className on the inner container div (e.g. w-96)",
      source: "spec:.claude/specs/components/navigation-menu.md#rules-for-llms",
    },
  ],
  variants: [],
  sizes: [],
  parentComponents: [],
  childComponents: [
    "navigation-menu-list",
    "navigation-menu-item",
    "navigation-menu-trigger",
    "navigation-menu-content",
    "navigation-menu-link",
    "navigation-menu-indicator",
    "navigation-menu-positioner",
  ],
  tokens: [
    "bg-muted",
    "bg-popover",
    "text-popover-foreground",
    "ring-ring",
    "ring-foreground",
    "bg-border",
  ],
  a11y: [
    "NavigationMenuList renders a semantic ul with NavigationMenuItem as li children",
    "The built-in ChevronDownIcon on triggers is decorative and marked aria-hidden=true",
    "Triggers open the panel on hover and toggle on click; focus uses a focus-visible ring on both triggers and links",
    "The dropdown panel renders in a portal via the internal positioner (z-50) so it layers above page content",
  ],
  aiHints: {
    selectionCriteria: [
      "Use NavigationMenu for website-style top navigation with hover-triggered dropdown panels",
      "Use Menubar instead for desktop-app File/Edit/View menus (click-triggered)",
      "Use Sidebar instead for persistent left/right navigation in app layouts",
    ],
    confusedWith: [
      {
        component: "menubar",
        disambiguation:
          "Menubar is desktop-app File/Edit/View menus, click-triggered; NavigationMenu is website-style top nav with hover-triggered dropdown panels",
      },
      {
        component: "sidebar",
        disambiguation:
          "Sidebar is persistent left/right navigation for app layouts; NavigationMenu is a horizontal top nav bar",
      },
    ],
    compositionRules: [
      "Structure: NavigationMenu > NavigationMenuList > NavigationMenuItem; an item with a dropdown contains NavigationMenuTrigger + NavigationMenuContent (with NavigationMenuLink inside the panel); a direct-link item contains only NavigationMenuLink",
      "Router links use the Base UI render prop: NavigationMenuLink render={<Link href=... />} — never asChild and never a plain href",
      "Apply navigationMenuTriggerStyle() as the className on direct-link items so they match trigger styling",
      "Do not add NavigationMenuPositioner — the NavigationMenu root includes it automatically (its align prop defaults to start)",
      "Set the dropdown panel width via className on the inner container div inside NavigationMenuContent, not on the content itself",
    ],
    source: ".claude/specs/components/navigation-menu.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/navigation-menu.md",
  codeConnectStatus: "not-planned",
  primitiveSource: "base-ui",
  version: "1.0.0",
}
