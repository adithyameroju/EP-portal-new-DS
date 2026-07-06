import type { ComponentMeta } from "./_meta-schema"

export const menubarMeta: ComponentMeta = {
  name: "menubar",
  category: "organism",
  purpose:
    "A horizontal row of menu triggers — the classic File/Edit/View desktop-app menu pattern where each trigger opens a dropdown when clicked.",
  useCases: [
    "Desktop-style application menu bar (File, Edit, View, Help)",
    "View toggles via checkbox items (e.g. show/hide sidebar, preview)",
    "Mutually exclusive sort/display options via radio items",
    "Action items with keyboard shortcut hints (MenubarShortcut)",
  ],
  antiPatterns: [
    {
      wrong: "Wrap MenubarTrigger with asChild or nest it in another button",
      instead:
        "MenubarTrigger is already the styled button — use it directly with text children",
      source: "spec:.claude/specs/components/menubar.md#rules-for-llms",
    },
    {
      wrong:
        "Expect checkbox/radio indicators on the right side like DropdownMenu",
      instead:
        "Menubar shows checkbox and radio indicators left-aligned (pl-7 content indentation)",
      source: "spec:.claude/specs/components/menubar.md#rules-for-llms",
    },
    {
      wrong:
        "Place MenubarTrigger/MenubarContent directly under Menubar without a MenubarMenu wrapper",
      instead:
        "Wrap each individual menu (File, Edit, ...) in MenubarMenu; the Menubar root wraps all of them",
      source: "spec:.claude/specs/components/menubar.md#rules-for-llms",
    },
    {
      wrong: "Add a manual chevron icon to MenubarSubTrigger",
      instead: "MenubarSubTrigger has ChevronRight built in",
      source: "spec:.claude/specs/components/menubar.md#rules-for-llms",
    },
    {
      wrong:
        "Use Menubar for website top navigation or a single contextual action menu",
      instead:
        "Use NavigationMenu for hover-panel site nav; use DropdownMenu for a single standalone menu from a button",
      source: "spec:.claude/specs/components/menubar.md#rules-for-llms",
    },
  ],
  variants: [
    {
      prop: "variant",
      values: ["default", "destructive"],
      default: "default",
    },
  ],
  sizes: [],
  parentComponents: ["dropdown-menu"],
  childComponents: [
    "menubar-portal",
    "menubar-menu",
    "menubar-trigger",
    "menubar-content",
    "menubar-group",
    "menubar-separator",
    "menubar-label",
    "menubar-item",
    "menubar-shortcut",
    "menubar-checkbox-item",
    "menubar-radio-group",
    "menubar-radio-item",
    "menubar-sub",
    "menubar-sub-trigger",
    "menubar-sub-content",
  ],
  tokens: [
    "bg-popover",
    "text-popover-foreground",
    "bg-muted",
    "bg-accent",
    "text-accent-foreground",
    "text-destructive",
    "bg-border",
    "text-muted-foreground",
    "rounded-lg",
    "shadow-md",
    "ring-foreground/10",
  ],
  a11y: [
    "Multiple menus are keyboard-navigable as a group (Base UI Menubar root)",
    "MenubarTrigger exposes open state via aria-expanded (styled with aria-expanded:bg-muted)",
    "Checked state on checkbox/radio items is rendered via Base UI item indicators (CheckIcon), announced by the menu item role",
    "Disabled items get data-disabled styling (opacity-50) and are removed from pointer interaction",
  ],
  aiHints: {
    selectionCriteria: [
      "Desktop app menu bar (File, Edit, View, Help) — click to open",
      "Multiple menus grouped in one pill container, keyboard-navigable as a group",
      "Use for desktop app interfaces only, not website navigation",
    ],
    confusedWith: [
      {
        component: "navigation-menu",
        disambiguation:
          "NavigationMenu is website top nav with hover-triggered mega-menu panels; Menubar is a desktop app menu bar opened by click",
      },
      {
        component: "dropdown-menu",
        disambiguation:
          "DropdownMenu is a single standalone dropdown from a button; Menubar groups multiple menus in a pill container",
      },
    ],
    compositionRules: [
      "Order: Menubar > MenubarMenu > (MenubarTrigger + MenubarContent); content holds MenubarLabel/MenubarGroup/MenubarItem/MenubarSeparator/MenubarCheckboxItem/MenubarRadioGroup/MenubarSub",
      "MenubarShortcut goes inside MenubarItem, after the item text",
      "MenubarRadioItem must be nested inside MenubarRadioGroup (value/onValueChange on the group)",
      "MenubarSub wraps MenubarSubTrigger + MenubarSubContent for nested menus",
      "MenubarTrigger takes plain text children — no asChild, no wrapper button",
    ],
    source: ".claude/specs/components/menubar.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/menubar.md",
  codeConnectStatus: "not-planned",
  primitiveSource: "base-ui",
  version: "1.0.0",
}
