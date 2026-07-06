# Calendar — Compass Component Spec

> **Purpose:** This file is the complete specification for the Calendar component.
> LLMs must follow this spec exactly when generating date pickers and calendars.
> It overrides any general foundation spec where they conflict.

---

## Component location

```
Import: import { Calendar } from "@/components/ui/calendar"

File: components/ui/calendar.tsx
```

---

## What Calendar is

`Calendar` is a date-picking UI built on `react-day-picker`. It renders an
interactive month grid for selecting single dates, multiple dates, or date
ranges. It is **not a Base UI primitive** — it wraps `react-day-picker`'s
`DayPicker` component with Compass styling.

**Calendar is a display component.** It renders inline where placed. For a
date picker that opens from a button, wrap it in a `Popover`.

---

## Key props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `mode` | `"single" \| "multiple" \| "range"` | `"single"` | Selection mode (from react-day-picker) |
| `selected` | `Date \| Date[] \| DateRange` | — | Controlled selected value |
| `onSelect` | function | — | Called when user selects a date |
| `defaultMonth` | `Date` | — | Month to show initially |
| `captionLayout` | `"label" \| "dropdown"` | `"label"` | `"dropdown"` shows month/year select dropdowns |
| `showOutsideDays` | `boolean` | `true` | Show days from adjacent months |
| `buttonVariant` | Button variant | `"ghost"` | Style of prev/next navigation buttons |
| `disabled` | `Matcher \| Matcher[]` | — | Dates to disable (e.g. before today) |
| `numberOfMonths` | `number` | `1` | Show multiple months side-by-side |

All `react-day-picker` `DayPicker` props are accepted and passed through.

---

## Selection modes

| Mode | Description | `selected` type | `onSelect` type |
|------|-------------|----------------|----------------|
| `single` | One date at a time | `Date \| undefined` | `(date: Date \| undefined) => void` |
| `multiple` | Multiple independent dates | `Date[]` | `(dates: Date[]) => void` |
| `range` | Start and end date | `{ from: Date, to?: Date }` | `(range: DateRange \| undefined) => void` |

---

## Visual states

| State | Appearance |
|-------|-----------|
| Selected single date | `bg-primary text-primary-foreground` |
| Range start / end | `bg-primary text-primary-foreground`, rounded on outer edge |
| Range middle | `bg-muted text-foreground`, no border radius |
| Today (unselected) | `bg-muted text-foreground` |
| Outside month days | `text-muted-foreground` (dimmed) |
| Disabled day | `text-muted-foreground opacity-50` |

---

## Common patterns

### Inline calendar (single date)

```tsx
const [date, setDate] = React.useState<Date | undefined>()

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
/>
```

### Date picker (Calendar inside a Popover)

The standard pattern for forms — a button triggers a Popover containing the Calendar:

```tsx
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

const [date, setDate] = React.useState<Date | undefined>()

<Popover>
  <PopoverTrigger render={<Button variant="outline" className="w-48 justify-start text-left font-normal" />}>
    <CalendarIcon className="mr-2 size-4" />
    {date ? format(date, "PPP") : <span className="text-muted-foreground">Pick a date</span>}
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0">
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      initialFocus
    />
  </PopoverContent>
</Popover>
```

### Date range picker

```tsx
import { DateRange } from "react-day-picker"

const [range, setRange] = React.useState<DateRange | undefined>()

<Calendar
  mode="range"
  selected={range}
  onSelect={setRange}
  numberOfMonths={2}
/>
```

### Calendar with disabled past dates

```tsx
<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  disabled={{ before: new Date() }}
/>
```

### Calendar with dropdown navigation

Use `captionLayout="dropdown"` for easier month/year jumping (useful for
date of birth or expiry date fields where the target month may be years away):

```tsx
<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  captionLayout="dropdown"
/>
```

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Month grid with date cells | `<Calendar mode="single" ... />` |
| Calendar in a popup from a button | `Popover` + `PopoverContent` + `Calendar` |
| Start date highlighted purple, end date purple, middle blue/muted | `mode="range"` |
| Two months side by side | `numberOfMonths={2}` |
| Month/year dropdowns instead of arrows | `captionLayout="dropdown"` |
| Grayed-out past dates | `disabled={{ before: new Date() }}` |

---

## Rules for LLMs

1. **Always use `mode` explicitly.** The default is `"single"` but always
   state it so the intent is clear:
   ```tsx
   // ✅ CORRECT
   <Calendar mode="single" selected={date} onSelect={setDate} />

   // ❌ UNCLEAR — mode is implicit
   <Calendar selected={date} onSelect={setDate} />
   ```

2. **For date picker fields in forms, always wrap in Popover.** Do not
   render `Calendar` inline in a form — use the Popover pattern so it
   appears on demand without consuming form layout space.

3. **Use `date-fns` for date formatting.** The codebase uses `date-fns`.
   Always `import { format } from "date-fns"` for display formatting.
   Do not use `Date.toLocaleDateString()` for display.

4. **`CalendarDayButton` is internal — do not import it.** It is exported
   from the file but is an implementation detail. Use `Calendar` only.

5. **Do not add padding to `PopoverContent` when it contains Calendar.**
   Use `className="w-auto p-0"` on `PopoverContent` — the calendar has its
   own internal padding (`p-2`).

6. **Import `DateRange` type from `react-day-picker`, not from Compass.**
   ```tsx
   import { DateRange } from "react-day-picker"
   ```
