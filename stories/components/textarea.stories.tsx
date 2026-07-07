/**
 * Textarea stories — S2.3.
 * Title from textareaMeta.category ("atom" → "Atoms"). Textarea is
 * types-only (textareaMeta.variants = [], specStatus "none"); stories map
 * the states named in textareaMeta fields ("disabled and invalid state
 * styling" from textareaMeta.purpose; aria-invalid from textareaMeta.a11y)
 * with minimal Compass-composed children. Label text = the prop/state name
 * itself — no authored prose.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { textareaMeta } from "@/components/ui/textarea.meta"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Atoms/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(textareaMeta) },
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

/** Label text = textareaMeta.name; paired via htmlFor/id. */
export const WithLabel: Story = {
  render: () => (
    <div className="grid w-80 gap-1.5">
      <Label htmlFor="textarea">textarea</Label>
      <Textarea id="textarea" />
    </div>
  ),
}

/** "disabled … state styling" — textareaMeta.purpose. */
export const Disabled: Story = {
  render: () => (
    <div className="grid w-80 gap-1.5">
      <Label htmlFor="disabled">disabled</Label>
      <Textarea id="disabled" disabled />
    </div>
  ),
}

/**
 * "Styling responds to aria-invalid (destructive border and ring)" —
 * textareaMeta.a11y.
 */
export const Invalid: Story = {
  render: () => (
    <div className="grid w-80 gap-1.5">
      <Label htmlFor="invalid">aria-invalid</Label>
      <Textarea id="invalid" aria-invalid />
    </div>
  ),
}
