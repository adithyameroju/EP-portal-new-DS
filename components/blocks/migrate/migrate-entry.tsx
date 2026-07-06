"use client"

// S5 "Migrate" UI shell — entry pane (GitHub URL or zip upload).
// Pure presentation: no fetching, no unzipping, no execution. The callbacks
// exist so the future engine (Part B, gated on S1) can be wired in without
// changing this component. Not wired into Storybook until S2.

import * as React from "react"
import { FolderArchive, FolderGit2, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MigrateEntryProps {
  /** Called with the entered repository URL. Presentation-only stub. */
  onSubmitUrl?: (url: string) => void
  /** Called when the user asks to pick a zip. Presentation-only stub. */
  onSelectZip?: () => void
  disabled?: boolean
}

function MigrateEntry({ onSubmitUrl, onSelectZip, disabled }: MigrateEntryProps) {
  const [url, setUrl] = React.useState("")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Migrate to Compass</CardTitle>
        <CardDescription>
          Point at a React + Tailwind codebase. The migration runs one flow at
          a time and only touches the presentation layer — logic, data,
          routing and state stay exactly as they are.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="url">
          <TabsList>
            <TabsTrigger value="url">
              <FolderGit2 data-icon="inline-start" />
              GitHub URL
            </TabsTrigger>
            <TabsTrigger value="zip">
              <FolderArchive data-icon="inline-start" />
              Zip upload
            </TabsTrigger>
          </TabsList>
          <TabsContent value="url" className="pt-4">
            <InputGroup>
              <InputGroupAddon>
                <FolderGit2 />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="https://github.com/org/repo"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                disabled={disabled}
                aria-label="Repository URL"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  onClick={() => onSubmitUrl?.(url)}
                  disabled={disabled || url.length === 0}
                >
                  Fetch repo
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <p className="pt-2 text-xs text-muted-foreground">
              v1 supports React + Tailwind targets. Anything else is flagged,
              not force-migrated.
            </p>
          </TabsContent>
          <TabsContent value="zip" className="pt-4">
            <Empty className="border border-dashed border-input">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Upload />
                </EmptyMedia>
                <EmptyTitle>Drop a project zip</EmptyTitle>
                <EmptyDescription>
                  Lovable, Replit or Cursor export — the whole project folder,
                  zipped. It is unpacked and run locally so you can see your
                  real product before anything changes.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  variant="outline"
                  onClick={onSelectZip}
                  disabled={disabled}
                >
                  <Upload data-icon="inline-start" />
                  Choose file
                </Button>
              </EmptyContent>
            </Empty>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export { MigrateEntry }
export type { MigrateEntryProps }
