import type { ComponentMeta } from "./_meta-schema"

export const dropdownMenuMeta: ComponentMeta = {
  name: "dropdown-menu",
  category: "organism",
  purpose:
    "A popup menu of actions triggered from a button — DropdownMenu is for triggering actions; Select is for choosing a value.",
  useCases: [
    "Table row actions opened from a ghost icon trigger (View details, Edit, Delete)",
    "Grouped action sections with labels and separators (Policy actions, Support actions)",
    "Action items with right-aligned keyboard shortcut hints",
    "Checkbox items for toggleable view settings (show/hide columns)",
    "Radio item group for a single-select option like sort order",
    "Nested sub-menu for secondary actions (Share via email, link, WhatsApp)",
    "Right-click context actions on an element (triggered programmatically)",
  ],
  antiPatterns: [
    {
      wrong:
        "Use asChild on DropdownMenuTrigger to compose it with a Button (Radix pattern)",
      instead:
        "Pass the trigger element via the Base UI render prop: DropdownMenuTrigger render={<Button variant=\"ghost\" size=\"icon\" />} with the icon as children",
      source: "spec:.claude/specs/components/dropdown-menu.md#rules-for-llms",
    },
    {
      wrong:
        "Nest a Button element inside DropdownMenuTrigger's children, creating a nested button",
      instead:
        "Use the render prop so the trigger renders as the Button itself instead of wrapping it",
      source: "spec:.claude/specs/components/dropdown-menu.md#rules-for-llms",
    },
    {
      wrong: "Use DropdownMenu to pick a value that will be submitted in a form",
      instead:
        "Use Select for choosing a form value; DropdownMenu is only for choosing an action to execute",
      source: "spec:.claude/specs/components/dropdown-menu.md#rules-for-llms",
    },
    {
      wrong:
        "Place a destructive item directly among non-destructive items with no divider",
      instead:
        "Always put variant=\"destructive\" items below a DropdownMenuSeparator",
      source: "spec:.claude/specs/components/dropdown-menu.md#rules-for-llms",
    },
    {
      wrong:
        "Place DropdownMenuShortcut before the item text inside DropdownMenuItem",
      instead:
        "Make DropdownMenuShortcut the last child of DropdownMenuItem; it uses ml-auto and placing it first pushes all other content right",
      source: "spec:.claude/specs/components/dropdown-menu.md#rules-for-llms",
    },
    {
      wrong: "Add a size className to icons inside menu items",
      instead:
        "Leave icons unstyled; the item styles enforce 16px icons automatically",
      source: "spec:.claude/specs/components/dropdown-menu.md#rules-for-llms",
    },
    {
      wrong: "Add a manual ChevronRight icon to DropdownMenuSubTrigger",
      instead:
        "Rely on the built-in ChevronRight in DropdownMenuSubTrigger; adding one manually shows it twice",
      source: "spec:.claude/specs/components/dropdown-menu.md#rules-for-llms",
    },
    {
      wrong:
        "Mix icon items and icon-less items in the same list without inset, leaving text misaligned",
      instead:
        "Add the inset prop to icon-less DropdownMenuItem/DropdownMenuLabel so text aligns with text in icon items",
      source: "spec:.claude/specs/components/dropdown-menu.md#rules-for-llms",
    },
    {
      wrong:
        "Keep the default align=\"start\" for a menu opened from a button at the right edge of a table row",
      instead:
        "Use DropdownMenuContent align=\"end\" so the menu's right edge aligns with the trigger",
      source: "spec:.claude/specs/components/dropdown-menu.md#rules-for-llms",
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
  parentComponents: [],
  childComponents: [
    "dropdown-menu-portal",
    "dropdown-menu-trigger",
    "dropdown-menu-content",
    "dropdown-menu-group",
    "dropdown-menu-label",
    "dropdown-menu-item",
    "dropdown-menu-checkbox-item",
    "dropdown-menu-radio-group",
    "dropdown-menu-radio-item",
    "dropdown-menu-separator",
    "dropdown-menu-shortcut",
    "dropdown-menu-sub",
    "dropdown-menu-sub-trigger",
    "dropdown-menu-sub-content",
  ],
  tokens: [
    "bg-popover",
    "text-popover-foreground",
    "bg-accent",
    "text-accent-foreground",
    "text-destructive",
    "bg-destructive/10",
    "bg-border",
    "text-muted-foreground",
    "ring-foreground/10",
  ],
  a11y: [
    "Built on the Base UI Menu primitive, which provides menu semantics, arrow-key navigation, typeahead, and focus management",
    "Icon-only triggers need a visually hidden label; the spec's standard pattern includes a span with sr-only text inside the trigger",
    "Disabled items get data-disabled styling (reduced opacity, pointer-events disabled) via the primitive",
    "DropdownMenuShortcut is a visual hint only; it does not register the keyboard shortcut",
  ],
  aiHints: {
    selectionCriteria: [
      "Use DropdownMenu for a list of actions triggered from a button (Edit, Delete, Export)",
      "Use DropdownMenu for single-level action lists of 2-5 items, and for actions with sub-menus or groupings",
      "Use DropdownMenu (triggered programmatically) for right-click context actions on an element",
      "Use Select instead when the user is selecting a value for a form field",
      "Use NavigationMenu instead for top-level application navigation",
    ],
    confusedWith: [
      {
        component: "select",
        disambiguation:
          "Select is for choosing a value for a form field; DropdownMenu is for triggering actions",
      },
      {
        component: "navigation-menu",
        disambiguation:
          "NavigationMenu is for top-level application navigation; DropdownMenu is an action menu opened from a button",
      },
    ],
    compositionRules: [
      "Structure: DropdownMenu (root) > DropdownMenuTrigger + DropdownMenuContent; content holds Label/Group/Item/Separator/CheckboxItem/RadioGroup/Sub parts",
      "DropdownMenuTrigger composes its trigger element via the Base UI render prop, never asChild and never a nested Button",
      "DropdownMenuShortcut must be the last child of DropdownMenuItem",
      "Destructive items go below a DropdownMenuSeparator, at the end of the menu",
      "Sub-menus: DropdownMenuSub > DropdownMenuSubTrigger (chevron built in) + DropdownMenuSubContent > DropdownMenuItem",
      "DropdownMenuRadioItem must sit inside DropdownMenuRadioGroup (value/onValueChange live on the group)",
      "Use the inset prop on icon-less items/labels when the list mixes icon and no-icon items",
    ],
    source: ".claude/specs/components/dropdown-menu.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/dropdown-menu.md",
  codeConnectStatus: "not-planned",
  primitiveSource: "base-ui",
  version: "1.0.0",
}
