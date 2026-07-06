/**
 * Tabs stories — S2.3 pattern-setter.
 * Title from tabsMeta.category ("molecule" → "Molecules"). Galleries cover
 * tabsMeta's `variant` (default/line — a TabsList prop) and `orientation`
 * axes via the spec's own examples, verbatim from
 * .claude/specs/components/tabs.md "Common patterns". Placeholder comments
 * in spec examples (Table/Card contents) are simplified to the spec's own
 * text-content shape so stories are self-contained.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { FileText, History, User } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { tabsMeta } from "@/components/ui/tabs.meta"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Molecules/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(tabsMeta) },
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

/**
 * variant="default" — verbatim from
 * spec:.claude/specs/components/tabs.md "Standard content tabs (default variant)".
 */
export const DefaultVariant: Story = {
  render: () => (
    <div className="w-96">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <p className="text-sm text-muted-foreground">Policy overview content.</p>
        </TabsContent>
        <TabsContent value="documents">
          <p className="text-sm text-muted-foreground">Uploaded documents.</p>
        </TabsContent>
        <TabsContent value="history">
          <p className="text-sm text-muted-foreground">
            Claims and activity history.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  ),
}

/**
 * variant="line" — verbatim from
 * spec:.claude/specs/components/tabs.md "Filter tabs (line variant)"
 * (spec's Table placeholders simplified to its text-content shape).
 */
export const LineVariant: Story = {
  render: () => (
    <div className="w-96">
      <Tabs defaultValue="all">
        <TabsList variant="line">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <p className="text-sm text-muted-foreground">Policy overview content.</p>
        </TabsContent>
        <TabsContent value="active">
          <p className="text-sm text-muted-foreground">Policy overview content.</p>
        </TabsContent>
        <TabsContent value="expired">
          <p className="text-sm text-muted-foreground">Policy overview content.</p>
        </TabsContent>
        <TabsContent value="pending">
          <p className="text-sm text-muted-foreground">Policy overview content.</p>
        </TabsContent>
      </Tabs>
    </div>
  ),
}

/** Verbatim: spec:.claude/specs/components/tabs.md "Tabs with icons". */
export const WithIcons: Story = {
  render: () => (
    <div className="w-96">
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">
            <User className="size-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="size-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="size-4" />
            History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <p className="text-sm text-muted-foreground">Policy overview content.</p>
        </TabsContent>
        <TabsContent value="documents">
          <p className="text-sm text-muted-foreground">Uploaded documents.</p>
        </TabsContent>
        <TabsContent value="history">
          <p className="text-sm text-muted-foreground">
            Claims and activity history.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  ),
}

/**
 * orientation="vertical" — verbatim from
 * spec:.claude/specs/components/tabs.md "Vertical tabs (settings layout)"
 * (spec's Card `...` placeholders filled with its text-content shape).
 */
export const Vertical: Story = {
  render: () => (
    <Tabs orientation="vertical" defaultValue="profile" className="gap-4">
      <TabsList className="w-40">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Policy overview content.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="notifications">
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Uploaded documents.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="security">
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Claims and activity history.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
}
