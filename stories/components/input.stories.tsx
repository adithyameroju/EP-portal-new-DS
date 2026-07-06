/**
 * Input stories — S2.3 pattern-setter.
 * Title from inputMeta.category ("atom" → "Atoms"). Input has no variant
 * axes (inputMeta.variants = []); the gallery renders the spec's own
 * examples verbatim from .claude/specs/components/input.md.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { inputMeta } from "@/components/ui/input.meta"
import { Label } from "@/components/ui/label"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Atoms/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(inputMeta) },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

/** Verbatim: spec:.claude/specs/components/input.md#basic-usage (standalone + Label). */
export const WithLabel: Story = {
  render: () => (
    <div className="grid w-80 gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="name@acko.com" />
    </div>
  ),
}

/** `type` values from the spec's Input types table (input.md#input-types). */
const INPUT_TYPES = [
  "text",
  "email",
  "password",
  "number",
  "search",
  "tel",
  "url",
  "date",
] as const

export const InputTypes: Story = {
  render: () => (
    <div className="grid w-80 gap-4">
      {INPUT_TYPES.map((type) => (
        <div key={type} className="grid gap-1.5">
          <Label htmlFor={`input-${type}`}>{type}</Label>
          <Input type={type} id={`input-${type}`} />
        </div>
      ))}
    </div>
  ),
}

/** Disabled state — spec:.claude/specs/components/input.md#states. */
export const Disabled: Story = {
  render: () => (
    <div className="grid w-80 gap-1.5">
      <Label htmlFor="disabled">disabled</Label>
      <Input id="disabled" disabled />
    </div>
  ),
}

/**
 * Manual error styling — verbatim from
 * spec:.claude/specs/components/input.md#states "Error state pattern"
 * (shown with the error present; the spec gates it on `hasError`).
 */
export const ErrorState: Story = {
  render: () => (
    <div className="grid w-80 gap-1.5">
      <Label htmlFor="error-email">Email</Label>
      <Input
        id="error-email"
        className="border-destructive focus-visible:ring-destructive"
      />
      <p className="text-sm text-destructive">Please enter a valid email.</p>
    </div>
  ),
}

/** Verbatim: spec:.claude/specs/components/input.md#input-with-iconprefixsuffix. */
export const WithIcon: Story = {
  render: () => (
    <div className="relative w-80">
      <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input className="pl-9" placeholder="Search..." aria-label="Search policies" />
    </div>
  ),
}

/** Verbatim: spec:.claude/specs/components/input.md#input-with-iconprefixsuffix. */
export const WithSuffix: Story = {
  render: () => (
    <div className="relative w-80">
      <Input className="pr-12" placeholder="0.00" aria-label="0.00" />
      <span className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
        INR
      </span>
    </div>
  ),
}
