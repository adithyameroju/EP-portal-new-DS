import type { ComponentMeta } from "./_meta-schema"

export const contextMenuMeta: ComponentMeta = {
  name: "context-menu",
  category: "organism",
  purpose:
    "A right-click menu that opens when the user right-clicks (or long-presses on touch) the trigger element, built on Base UI's context-menu primitive.",
  useCases: [
    "Table row context menu (view details, download, destructive cancel action)",
    "Context menu on a card or list item, including nested share sub-menu",
    "View options with toggleable checkbox items (show thumbnails)",
    "Sort selection with a radio group (name, date, size)",
  ],
  antiPatterns: [
    {
      wrong:
        "Use asChild on ContextMenuTrigger, or nest the target element as a plain child (which creates an extra div as the trigger)",
      instead:
        "Pass the actual right-click target via the render prop (Base UI pattern), e.g. ContextMenuTrigger render set to a TableRow or Card",
      source: "spec:.claude/specs/components/context-menu.md#rules-for-llms",
    },
    {
      wrong: "Use ContextMenu as a substitute for a button-triggered menu",
      instead:
        "Use ContextMenu for right-click on an area; use DropdownMenu for menus opened by clicking a button",
      source: "spec:.claude/specs/components/context-menu.md#rules-for-llms",
    },
    {
      wrong: "Add a manual ChevronRight icon inside ContextMenuSubTrigger",
      instead:
        "Rely on the built-in ChevronRight — adding one manually makes it appear twice",
      source: "spec:.claude/specs/components/context-menu.md#rules-for-llms",
    },
    {
      wrong: "Place a destructive action directly among regular items",
      instead:
        "Put destructive actions below a ContextMenuSeparator (same rule as DropdownMenu)",
      source: "spec:.claude/specs/components/context-menu.md#rules-for-llms",
    },
    {
      wrong: "Override the select-none behavior on ContextMenuTrigger",
      instead:
        "Keep it — text inside the trigger area is intentionally not selectable while the context menu is active",
      source: "spec:.claude/specs/components/context-menu.md#rules-for-llms",
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
    "context-menu-trigger",
    "context-menu-content",
    "context-menu-item",
    "context-menu-checkbox-item",
    "context-menu-radio-item",
    "context-menu-label",
    "context-menu-separator",
    "context-menu-shortcut",
    "context-menu-group",
    "context-menu-portal",
    "context-menu-sub",
    "context-menu-sub-content",
    "context-menu-sub-trigger",
    "context-menu-radio-group",
  ],
  tokens: [
    "bg-popover",
    "text-popover-foreground",
    "bg-accent",
    "text-accent-foreground",
    "text-muted-foreground",
    "text-destructive",
    "bg-border",
  ],
  a11y: [
    "Opens on right-click, or long-press on touch devices",
    "Menu roles, focus management, and keyboard navigation come from the Base UI ContextMenu primitive; items show focus state via the accent tokens",
    "ContextMenuTrigger applies select-none automatically so trigger text is not selectable while the menu is active — intentional, do not override",
    "Checkbox and radio items expose their checked state via built-in indicator icons (CheckboxItemIndicator / RadioItemIndicator)",
  ],
  aiHints: {
    selectionCriteria: [
      "Use ContextMenu when the menu is triggered by right-clicking an area (table row, file, canvas item)",
      "Use DropdownMenu when the menu is triggered by clicking a button (an ellipsis action button)",
      "Both have identical item APIs — the only difference is how they open",
    ],
    confusedWith: [
      {
        component: "dropdown-menu",
        disambiguation:
          "DropdownMenu is opened by clicking a button; ContextMenu is opened by right-clicking (or long-pressing) an area — the item APIs are identical",
      },
    ],
    compositionRules: [
      "Sub-part order: ContextMenu root > ContextMenuTrigger (the right-click target, passed via the render prop) and ContextMenuContent containing ContextMenuLabel, ContextMenuGroup > ContextMenuItem (with optional trailing ContextMenuShortcut), ContextMenuSeparator, ContextMenuCheckboxItem, ContextMenuRadioGroup > ContextMenuRadioItem, and ContextMenuSub > ContextMenuSubTrigger + ContextMenuSubContent",
      "The variant prop lives on ContextMenuItem: destructive renders red text and belongs below a separator",
      "The inset prop on items and labels adds left padding so text aligns with icon items",
      "ContextMenuSubTrigger includes the ChevronRight indicator — never add one manually",
    ],
    source: ".claude/specs/components/context-menu.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/context-menu.md",
  codeConnectStatus: "not-planned",
  primitiveSource: "base-ui",
  version: "1.0.0",
}
