import type { ComponentMeta } from "./_meta-schema"

export const calendarMeta: ComponentMeta = {
  name: "calendar",
  category: "organism",
  purpose:
    "A date-picking UI built on react-day-picker that renders an interactive month grid for selecting single dates, multiple dates, or date ranges.",
  useCases: [
    "Inline single-date selection (mode single)",
    "Date picker form field — Calendar inside a Popover triggered by a Button",
    "Date range selection (mode range), optionally with two months side-by-side via numberOfMonths",
    "Disabling past dates (disabled matcher, e.g. before today)",
    "Date of birth / expiry fields using captionLayout dropdown for fast month and year jumping",
  ],
  antiPatterns: [
    {
      wrong:
        "Omit the mode prop and rely on the implicit single-selection default",
      instead:
        "Always state mode explicitly (mode=\"single\" | \"multiple\" | \"range\") so intent is clear",
      source: "spec:.claude/specs/components/calendar.md#rules-for-llms",
    },
    {
      wrong: "Render Calendar inline inside a form as a date picker field",
      instead:
        "Wrap it in a Popover (Button trigger + PopoverContent + Calendar) so it appears on demand without consuming form layout space",
      source: "spec:.claude/specs/components/calendar.md#rules-for-llms",
    },
    {
      wrong: "Format dates for display with Date.toLocaleDateString()",
      instead: "Use format from date-fns — the codebase standard",
      source: "spec:.claude/specs/components/calendar.md#rules-for-llms",
    },
    {
      wrong: "Import CalendarDayButton directly",
      instead:
        "Use Calendar only; CalendarDayButton is an exported implementation detail",
      source: "spec:.claude/specs/components/calendar.md#rules-for-llms",
    },
    {
      wrong: "Add padding to PopoverContent when it contains a Calendar",
      instead:
        "Use className=\"w-auto p-0\" on PopoverContent — the calendar has its own internal padding",
      source: "spec:.claude/specs/components/calendar.md#rules-for-llms",
    },
    {
      wrong: "Import the DateRange type from Compass",
      instead: "Import DateRange from react-day-picker",
      source: "spec:.claude/specs/components/calendar.md#rules-for-llms",
    },
  ],
  variants: [
    {
      prop: "mode",
      values: ["single", "multiple", "range"],
      default: "single",
    },
    {
      prop: "captionLayout",
      values: ["label", "dropdown"],
      default: "label",
    },
    {
      prop: "buttonVariant",
      values: ["default", "outline", "secondary", "ghost", "destructive", "link"],
      default: "ghost",
    },
  ],
  sizes: [],
  parentComponents: ["button", "popover"],
  childComponents: ["calendar-day-button"],
  tokens: [
    "bg-background",
    "bg-primary",
    "text-primary-foreground",
    "bg-muted",
    "text-foreground",
    "text-muted-foreground",
    "bg-popover",
  ],
  a11y: [
    "Prev/next navigation buttons expose disabled state via aria-disabled (styled with aria-disabled:opacity-50)",
    "Day cells are real Button elements; the focused day (react-day-picker focused modifier) receives keyboard focus programmatically",
    "Outside-month days keep muted styling when aria-selected",
    "RTL locales flip the prev/next chevron icons automatically",
  ],
  aiHints: {
    selectionCriteria: [
      "Calendar is a display component that renders inline where placed; for a date picker that opens from a button, wrap it in a Popover",
    ],
    confusedWith: [],
    compositionRules: [
      "Standard form date-picker pattern: Popover > PopoverTrigger (render prop with an outline Button) > PopoverContent (className w-auto p-0) > Calendar",
      "Always pass mode explicitly; selected/onSelect types change per mode (Date, Date[], or DateRange)",
      "Use numberOfMonths={2} for range pickers showing two months side-by-side",
      "Use captionLayout=\"dropdown\" when the target month may be years away (date of birth, expiry)",
      "Format the selected date for display with date-fns format, not native locale methods",
    ],
    source: ".claude/specs/components/calendar.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/calendar.md",
  codeConnectStatus: "not-planned",
  primitiveSource: "react-day-picker",
  version: "1.0.0",
}
