/**
 * Popover stories — S2.3.
 * Title from popoverMeta.category ("molecule" → "Molecules"). Popover has no
 * variant axes (popoverMeta.variants = []); stories are the composition
 * shapes verbatim from .claude/specs/components/popover.md "Common patterns".
 * Simplifications (flagged per story):
 * - "Date picker": the spec's `date` useState lives in a local wrapper
 *   component so the stateful spec shape stays self-contained in Storybook
 *   (uses the spec's corrected `autoFocus` prop on Calendar).
 * - "Controlled popover" is skipped per lane-B convention
 *   (controlled-state useState examples).
 */

import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { format } from "date-fns"
import { CalendarIcon, InfoIcon, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { popoverMeta } from "@/components/ui/popover.meta"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Molecules/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { page: metaDocsPage(popoverMeta) },
  },
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Verbatim: spec:.claude/specs/components/popover.md
 * "Date picker (Calendar in Popover)" — `className="w-auto p-0"` on
 * PopoverContent and `autoFocus` on Calendar per the spec. The spec's
 * `date` useState is wrapped in this local component (see file header).
 */
function DatePickerExample() {
  const [date, setDate] = React.useState<Date | undefined>()

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" className="w-48 justify-start font-normal" />
        }
      >
        <CalendarIcon className="size-4" />
        {date ? (
          format(date, "PPP")
        ) : (
          <span className="text-muted-foreground">Pick a date</span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} autoFocus />
      </PopoverContent>
    </Popover>
  )
}

export const DatePicker: Story = {
  render: () => <DatePickerExample />,
}

/** Verbatim: spec:.claude/specs/components/popover.md "Filter panel". */
export const FilterPanel: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        <SlidersHorizontal className="size-4" />
        Filters
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Filter policies</PopoverTitle>
          <PopoverDescription>
            Narrow down results by type and status.
          </PopoverDescription>
        </PopoverHeader>
        <div className="flex flex-col gap-3">
          <div className="grid gap-1.5">
            <Label>Policy type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="motor">Motor</SelectItem>
                <SelectItem value="health">Health</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Status</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full">Apply filters</Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/popover.md
 * "Info popover (supplementary details on click)". The aria-label added to
 * the icon-only trigger quotes the panel's own PopoverTitle text, per
 * popoverMeta.a11y ("Icon-only triggers ... should use an accessible Button").
 */
export const InfoPopover: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Zero Depreciation Cover"
          />
        }
      >
        <InfoIcon className="size-4" />
      </PopoverTrigger>
      <PopoverContent side="right">
        <PopoverHeader>
          <PopoverTitle>Zero Depreciation Cover</PopoverTitle>
        </PopoverHeader>
        <p className="text-sm text-muted-foreground">
          This add-on ensures you receive the full claim amount without any
          deduction for depreciation on replaced parts.
        </p>
      </PopoverContent>
    </Popover>
  ),
}
