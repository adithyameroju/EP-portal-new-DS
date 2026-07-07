/**
 * Spinner stories — S2.3.
 * Title from spinnerMeta.category ("atom" → "Atoms"). Spinner is types-only
 * (spinnerMeta.variants = [], specStatus "none"); the gallery renders the
 * component as-is — "Spinning loading indicator that renders the
 * lucide-react Loader2 icon with a spin animation and status semantics"
 * (spinnerMeta.purpose).
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Spinner } from "@/components/ui/spinner"
import { spinnerMeta } from "@/components/ui/spinner.meta"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Atoms/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(spinnerMeta) },
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

/** "role=status and aria-label=Loading on the icon" — spinnerMeta.a11y. */
export const Default: Story = {
  render: () => <Spinner />,
}
