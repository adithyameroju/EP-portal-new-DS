/**
 * Calendar stories — S2.3.
 * Title from calendarMeta.category ("organism" → "Organisms"). Galleries map
 * calendarMeta's three variant axes (mode, captionLayout, buttonVariant)
 * generically; composition shapes come from .claude/specs/components/calendar.md
 * "Common patterns". FLAG (lane-B simplification c): every spec pattern is
 * useState-controlled — the `const [date, setDate] = React.useState(...)` /
 * `selected`/`onSelect` wiring is dropped here and the calendars render
 * uncontrolled (react-day-picker manages selection internally); structure is
 * otherwise verbatim.
 */

import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { calendarMeta } from "@/components/ui/calendar.meta"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { metaDocsPage } from "./meta-doc-blocks"

type CalendarProps = ComponentProps<typeof Calendar>

const modeAxis = calendarMeta.variants.find((axis) => axis.prop === "mode")!
const captionLayoutAxis = calendarMeta.variants.find(
  (axis) => axis.prop === "captionLayout",
)!
const buttonVariantAxis = calendarMeta.variants.find(
  (axis) => axis.prop === "buttonVariant",
)!

const meta = {
  title: "Organisms/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(calendarMeta) },
  },
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

/**
 * One calendar per `mode` axis value from calendar.meta.ts. `mode` is a
 * react-day-picker discriminated union, so each axis value narrows to a
 * literal instead of a cast; label text = the axis value.
 */
export const Mode: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-8">
      {modeAxis.values.map((value) => (
        <div key={value} className="flex flex-col items-start gap-2">
          <p className="font-mono text-xs text-muted-foreground">
            mode: {value}
          </p>
          {value === "multiple" ? (
            <Calendar mode="multiple" className="rounded-lg border" />
          ) : value === "range" ? (
            <Calendar mode="range" className="rounded-lg border" />
          ) : (
            <Calendar mode="single" className="rounded-lg border" />
          )}
        </div>
      ))}
    </div>
  ),
}

/**
 * One calendar per `captionLayout` axis value from calendar.meta.ts
 * (mode stated explicitly per the spec's "Always state mode explicitly" rule).
 */
export const CaptionLayout: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-8">
      {captionLayoutAxis.values.map((value) => (
        <div key={value} className="flex flex-col items-start gap-2">
          <p className="font-mono text-xs text-muted-foreground">
            captionLayout: {value}
          </p>
          <Calendar
            mode="single"
            captionLayout={value as CalendarProps["captionLayout"]}
            className="rounded-lg border"
          />
        </div>
      ))}
    </div>
  ),
}

/** One calendar per `buttonVariant` axis value from calendar.meta.ts. */
export const ButtonVariant: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-8">
      {buttonVariantAxis.values.map((value) => (
        <div key={value} className="flex flex-col items-start gap-2">
          <p className="font-mono text-xs text-muted-foreground">
            buttonVariant: {value}
          </p>
          <Calendar
            mode="single"
            buttonVariant={value as CalendarProps["buttonVariant"]}
            className="rounded-lg border"
          />
        </div>
      ))}
    </div>
  ),
}

/**
 * Spec "Date picker (Calendar inside a Popover)" — "The standard pattern for
 * forms — a button triggers a Popover containing the Calendar". Structure
 * verbatim; FLAG (see file header): useState wiring dropped, so the trigger
 * shows the spec's placeholder branch ("Pick a date") instead of
 * `format(date, "PPP")`.
 */
export const DatePickerInPopover: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className="w-48 justify-start text-left font-normal"
          />
        }
      >
        <CalendarIcon className="mr-2 size-4" />
        <span className="text-muted-foreground">Pick a date</span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" initialFocus />
      </PopoverContent>
    </Popover>
  ),
}

/**
 * Spec "Calendar with disabled past dates" — `disabled={{ before: new Date() }}`.
 * FLAG (see file header): useState wiring dropped.
 */
export const DisabledPastDates: Story = {
  render: () => (
    <Calendar
      mode="single"
      disabled={{ before: new Date() }}
      className="rounded-lg border"
    />
  ),
}
