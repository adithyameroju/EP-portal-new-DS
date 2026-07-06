/**
 * Table stories — S2.3 pattern-setter.
 * Title from tableMeta.category ("organism" → "Organisms"). Table has no
 * variant axes (tableMeta.variants = []); stories are the composition
 * shapes verbatim from .claude/specs/components/table.md "Common patterns".
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { tableMeta } from "@/components/ui/table.meta"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Organisms/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(tableMeta) },
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

/** Verbatim: spec:.claude/specs/components/table.md "Basic table". */
export const BasicTable: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Policy</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Premium</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>POL-2024-001</TableCell>
          <TableCell>Motor</TableCell>
          <TableCell>₹12,500</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>POL-2024-002</TableCell>
          <TableCell>Health</TableCell>
          <TableCell>₹8,000</TableCell>
          <TableCell>Expired</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/table.md "Table with status badges
 * (Acko enterprise pattern)" — categorical state uses Badge, never colored text.
 */
export const WithStatusBadges: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Policy Number</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Expiry</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>POL-2024-001</TableCell>
          <TableCell>Motor</TableCell>
          <TableCell>Dec 2026</TableCell>
          <TableCell>
            <Badge variant="default">Active</Badge>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>POL-2023-089</TableCell>
          <TableCell>Health</TableCell>
          <TableCell>Mar 2025</TableCell>
          <TableCell>
            <Badge variant="destructive">Expired</Badge>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>POL-2024-012</TableCell>
          <TableCell>Life</TableCell>
          <TableCell>Jun 2027</TableCell>
          <TableCell>
            <Badge variant="outline">Pending</Badge>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

/** Verbatim: spec:.claude/specs/components/table.md "Table with footer summary". */
export const WithFooterSummary: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Policy</TableHead>
          <TableHead className="text-right">Premium</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Motor Insurance</TableCell>
          <TableCell className="text-right">₹12,500</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Health Insurance</TableCell>
          <TableCell className="text-right">₹8,000</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell className="text-right">₹20,500</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
}
