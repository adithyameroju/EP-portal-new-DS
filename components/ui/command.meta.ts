import type { ComponentMeta } from "./_meta-schema"

export const commandMeta: ComponentMeta = {
  name: "command",
  category: "organism",
  purpose:
    "A keyboard-navigable search/command interface built on the cmdk library, designed for command-K command palettes, global search, and action launchers — not for form field selection.",
  useCases: [
    "Command palette in a centered modal opened with a keyboard shortcut (CommandDialog)",
    "Global search across records (policies, claims, documents)",
    "Action launcher with grouped actions and keyboard shortcut hints",
    "Inline searchable list rendered in the page, e.g. inside a Popover",
  ],
  antiPatterns: [
    {
      wrong: "Omit CommandEmpty from the list",
      instead:
        "Always include CommandEmpty — without it the list appears blank with no feedback when a search produces no results",
      source: "spec:.claude/specs/components/command.md#rules-for-llms",
    },
    {
      wrong: "Use Command as a form select to produce a form value",
      instead:
        "Use Combobox for form fields with search; use Command for action/navigation palettes",
      source: "spec:.claude/specs/components/command.md#rules-for-llms",
    },
    {
      wrong: "Add a visible title inside CommandDialog",
      instead:
        "Rely on the title and description props, which render in an sr-only DialogHeader for screen readers — command palettes are title-free in visual design",
      source: "spec:.claude/specs/components/command.md#rules-for-llms",
    },
    {
      wrong: "Manage search filtering of CommandItem entries manually",
      instead:
        "Let cmdk filter items automatically by the text content of CommandItem as the user types in CommandInput",
      source: "spec:.claude/specs/components/command.md#rules-for-llms",
    },
    {
      wrong:
        "Expect CommandDialog to open automatically on the command-K shortcut",
      instead:
        "Add the keydown useEffect listener yourself to toggle the controlled open state (see the spec's command palette pattern)",
      source: "spec:.claude/specs/components/command.md#rules-for-llms",
    },
    {
      wrong: "Place CommandShortcut before other children of CommandItem",
      instead:
        "CommandShortcut must be the last child of CommandItem — it uses ml-auto to push to the right edge",
      source: "spec:.claude/specs/components/command.md#rules-for-llms",
    },
  ],
  variants: [],
  sizes: [],
  parentComponents: ["dialog", "input-group"],
  childComponents: [
    "command-dialog",
    "command-input",
    "command-list",
    "command-empty",
    "command-group",
    "command-item",
    "command-shortcut",
    "command-separator",
  ],
  tokens: [
    "bg-popover",
    "text-popover-foreground",
    "bg-muted",
    "text-foreground",
    "text-muted-foreground",
    "bg-border",
  ],
  a11y: [
    "CommandDialog renders its title and description props in a visually hidden (sr-only) DialogHeader so screen readers announce the palette; defaults are Command Palette / Search for a command to run...",
    "cmdk provides keyboard navigation of the results list and automatic text filtering as the user types in CommandInput",
    "CommandDialog's close button is off by default (showCloseButton defaults to false) since palettes are dismissed via Escape or selection",
  ],
  aiHints: {
    selectionCriteria: [
      "Use Command for command-K command palettes, global search, and action launchers",
      "Do not use Command for form field selection — it does not produce a form value; use Select or Combobox for those",
      "Use CommandDialog for a centered modal palette; use inline Command (e.g. inside a Popover) when it renders directly in the page",
    ],
    confusedWith: [
      {
        component: "combobox",
        disambiguation:
          "Combobox is a searchable form field that produces a form value; Command is an action/navigation palette that does not produce a form value",
      },
      {
        component: "select",
        disambiguation:
          "Select is a simple form dropdown for a field; Command is a keyboard-navigable palette for actions and global search",
      },
    ],
    compositionRules: [
      "Sub-part order: Command (or CommandDialog) > CommandInput, then CommandList containing CommandEmpty, CommandGroup sections (heading via the heading prop) with CommandItem rows, and CommandSeparator between groups",
      "CommandInput has the search magnifier icon built in — do not add one",
      "CommandShortcut is optional, right-aligned, and must be the last child of its CommandItem",
      "CommandDialog wraps the same children as Command in a centered Dialog; wire the keyboard shortcut listener manually with controlled open state",
      "Always include CommandEmpty inside CommandList",
    ],
    source: ".claude/specs/components/command.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/command.md",
  codeConnectStatus: "not-planned",
  primitiveSource: "cmdk",
  version: "1.0.0",
}
