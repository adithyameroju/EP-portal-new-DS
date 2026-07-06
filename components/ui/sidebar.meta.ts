import type { ComponentMeta } from "./_meta-schema"

export const sidebarMeta: ComponentMeta = {
  name: "sidebar",
  category: "organism",
  purpose:
    "A composable navigation sidebar system — not a single component but a provider-wrapped layout system that manages open/collapsed state, mobile Sheet behaviour, cookie persistence, and a keyboard shortcut.",
  useCases: [
    "Full app layout with a persistent left navigation panel (SidebarProvider + Sidebar + SidebarInset)",
    "Icon-collapsible navigation with tooltips shown while collapsed",
    "Grouped navigation sections with labels (SidebarGroup + SidebarGroupLabel)",
    "Nav item with a notification count badge (SidebarMenuBadge)",
    "Nested sub-navigation under a parent item (SidebarMenuSub)",
    "User profile entry in the sidebar footer (SidebarMenuButton size lg)",
    "Search input inside the sidebar (SidebarInput)",
  ],
  antiPatterns: [
    {
      wrong:
        "Wrap only the Sidebar in SidebarProvider, leaving the page content outside",
      instead:
        "SidebarProvider must wrap the entire page layout — both Sidebar and SidebarInset must be its children",
      source: "spec:.claude/specs/components/sidebar.md#rules-for-llms",
    },
    {
      wrong:
        "Use asChild on SidebarMenuButton, or navigate with onClick and router.push",
      instead:
        "Compose navigation links via the Base UI render prop: SidebarMenuButton render={<Link href=\"/dashboard\" />} with icon and label as children",
      source: "spec:.claude/specs/components/sidebar.md#rules-for-llms",
    },
    {
      wrong:
        "Use collapsible icon mode without providing the tooltip prop on menu buttons",
      instead:
        "Always provide tooltip when using collapsible icon — labels are hidden when collapsed and tooltips are the only affordance to identify items",
      source: "spec:.claude/specs/components/sidebar.md#rules-for-llms",
    },
    {
      wrong:
        "Manually hide SidebarGroupLabel when the sidebar is collapsed",
      instead:
        "SidebarGroupLabel hides automatically in icon-collapsed mode via built-in data-attribute styling",
      source: "spec:.claude/specs/components/sidebar.md#rules-for-llms",
    },
    {
      wrong: "Wrap SidebarInset in another main element",
      instead:
        "SidebarInset already renders as main — put the page's header, breadcrumbs, and content directly inside it",
      source: "spec:.claude/specs/components/sidebar.md#rules-for-llms",
    },
    {
      wrong:
        "Omit SidebarTrigger from the page header inside SidebarInset",
      instead:
        "Always include SidebarTrigger in the page header — without it users have no visible way to toggle the sidebar (though Cmd/Ctrl+B still works)",
      source: "spec:.claude/specs/components/sidebar.md#rules-for-llms",
    },
    {
      wrong:
        "Use SidebarMenuBadge for status labels like Active or Expired",
      instead:
        "SidebarMenuBadge is for counts only; use Badge in the page content for status labels",
      source: "spec:.claude/specs/components/sidebar.md#rules-for-llms",
    },
  ],
  variants: [
    {
      prop: "side",
      values: ["left", "right"],
      default: "left",
    },
    {
      prop: "variant",
      values: ["sidebar", "floating", "inset"],
      default: "sidebar",
    },
    {
      prop: "collapsible",
      values: ["offcanvas", "icon", "none"],
      default: "offcanvas",
    },
    {
      prop: "variant",
      values: ["default", "outline"],
      default: "default",
    },
    {
      prop: "size",
      values: ["default", "sm", "lg"],
      default: "default",
    },
  ],
  sizes: ["default", "sm", "lg"],
  parentComponents: [
    "button",
    "input",
    "separator",
    "sheet",
    "skeleton",
    "tooltip",
  ],
  childComponents: [
    "sidebar-provider",
    "sidebar-header",
    "sidebar-footer",
    "sidebar-content",
    "sidebar-group",
    "sidebar-group-action",
    "sidebar-group-content",
    "sidebar-group-label",
    "sidebar-input",
    "sidebar-inset",
    "sidebar-menu",
    "sidebar-menu-action",
    "sidebar-menu-badge",
    "sidebar-menu-button",
    "sidebar-menu-item",
    "sidebar-menu-skeleton",
    "sidebar-menu-sub",
    "sidebar-menu-sub-button",
    "sidebar-menu-sub-item",
    "sidebar-rail",
    "sidebar-separator",
    "sidebar-trigger",
  ],
  tokens: [
    "bg-sidebar",
    "text-sidebar-foreground",
    "bg-sidebar-accent",
    "text-sidebar-accent-foreground",
    "border-sidebar-border",
    "ring-sidebar-ring",
    "bg-background",
  ],
  a11y: [
    "Cmd+B (Mac) / Ctrl+B (Windows) toggles the sidebar — built into SidebarProvider",
    "SidebarTrigger contains a visually hidden Toggle Sidebar label (sr-only span)",
    "SidebarRail is a button with aria-label Toggle Sidebar and tabIndex -1 (pointer-only drag target)",
    "On mobile the sidebar renders as a Sheet with a visually hidden SheetTitle and SheetDescription for screen readers",
    "SidebarMenu and SidebarMenuSub render as ul lists with li items for list semantics",
    "SidebarInset renders as the main landmark for the page content",
    "Disabled menu buttons get aria-disabled styling (reduced opacity, pointer-events disabled)",
  ],
  aiHints: {
    selectionCriteria: [
      "Use the Sidebar system for a full app layout with a persistent navigation panel — it is a system requiring SidebarProvider around the whole page, not a single drop-in component",
      "Mobile behaviour is built in: the Sidebar automatically renders as a Sheet slide-over on mobile with no extra code",
      "Choose collapsible offcanvas to slide fully off-screen, icon to collapse to icon-only width (3rem) with labels hidden, or none for an always-expanded panel",
      "Choose variant sidebar for a flush full-height panel with border, floating for a rounded shadowed panel with a gap, or inset to give the main content area a rounded elevated appearance",
    ],
    confusedWith: [
      {
        component: "sheet",
        disambiguation:
          "Sheet is a general-purpose slide-over panel; Sidebar is the full app navigation system, which itself renders as a Sheet automatically on mobile",
      },
    ],
    compositionRules: [
      "SidebarProvider wraps the full page and must contain both Sidebar and SidebarInset; it manages open state, mobile behaviour, and the cookie persisting sidebar state",
      "Panel hierarchy: Sidebar > SidebarHeader + SidebarContent (scrollable, holds SidebarGroups) + SidebarFooter",
      "Group hierarchy: SidebarGroup > SidebarGroupLabel + SidebarGroupContent > SidebarMenu > SidebarMenuItem > SidebarMenuButton",
      "SidebarMenuButton composes navigation links via render={<Link href=... />}; set isActive on the button matching the current pathname",
      "SidebarMenuBadge sits inside SidebarMenuItem as a sibling after SidebarMenuButton",
      "Sub-navigation: SidebarMenuSub > SidebarMenuSubItem > SidebarMenuSubButton, nested inside the parent SidebarMenuItem",
      "SidebarInset holds the page header (with SidebarTrigger) and page content; SidebarTrigger goes in that header",
      "useSidebar must be called within a SidebarProvider (it throws otherwise)",
    ],
    source: ".claude/specs/components/sidebar.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/sidebar.md",
  codeConnectStatus: "mapped",
  primitiveSource: "composite",
  version: "1.0.0",
}
