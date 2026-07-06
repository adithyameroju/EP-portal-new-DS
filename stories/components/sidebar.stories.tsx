/**
 * Sidebar stories — S2.3 pattern-setter.
 * Title from sidebarMeta.category ("organism" → "Organisms"). The layout
 * template is the spec's "Standard app layout" from
 * .claude/specs/components/sidebar.md "Common patterns", simplified to be
 * self-contained in Storybook: the logo <img> is replaced by its alt text
 * ("Acko") and next/link `render` targets are plain SidebarMenuButtons (the
 * spec's own "Collapsible to icons" shape) so clicks don't navigate the
 * preview iframe. Stories cover the Sidebar-level axes (side / variant /
 * collapsible) via args; SidebarMenuButton's variant/size axes get a
 * dedicated gallery story.
 */

import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { BarChart2, FileText, Home, User } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { sidebarMeta } from "@/components/ui/sidebar.meta"
import { metaDocsPage } from "./meta-doc-blocks"

type SidebarProps = ComponentProps<typeof Sidebar>
type MenuButtonProps = ComponentProps<typeof SidebarMenuButton>

// SidebarMenuButton axes from sidebar.meta.ts (the second `variant` axis and
// the `size` axis belong to SidebarMenuButton, not Sidebar).
const menuButtonVariantAxis = sidebarMeta.variants.filter(
  (axis) => axis.prop === "variant",
)[1]!
const menuButtonSizeAxis = sidebarMeta.variants.find(
  (axis) => axis.prop === "size",
)!

/** Spec "Standard app layout" shape (see file header for simplifications). */
function AppLayout(args: SidebarProps) {
  return (
    <SidebarProvider>
      <Sidebar {...args}>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <span className="text-sm font-medium">Acko</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Dashboard">
                    <Home className="size-4" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Policies">
                    <FileText className="size-4" />
                    <span>Policies</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Claims">
                    <BarChart2 className="size-4" />
                    <span>Claims</span>
                  </SidebarMenuButton>
                  {/* spec "Menu item with badge (notification count)" */}
                  <SidebarMenuBadge>3</SidebarMenuBadge>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <User className="size-5" />
                <span>Nikhil Thakkar</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-12 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-sm font-medium">Dashboard</h1>
        </header>
      </SidebarInset>
    </SidebarProvider>
  )
}

const meta = {
  title: "Organisms/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      page: metaDocsPage(sidebarMeta),
      // Sidebar positions itself against the viewport — render docs
      // examples in iframes so they don't overlay the docs page.
      story: { inline: false, iframeHeight: 420 },
    },
  },
  render: (args) => <AppLayout {...args} />,
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

// ── Sidebar axes from sidebar.meta.ts: side / variant / collapsible ─────────

/** side="left" (default), variant="sidebar", collapsible="offcanvas". */
export const Default: Story = {}

/** side axis: "right". */
export const SideRight: Story = { args: { side: "right" } }

/** variant axis: "floating". */
export const VariantFloating: Story = { args: { variant: "floating" } }

/** variant axis: "inset". */
export const VariantInset: Story = { args: { variant: "inset" } }

/**
 * collapsible axis: "icon" — spec:.claude/specs/components/sidebar.md
 * "Collapsible to icons with tooltips" (tooltip provided on every item).
 */
export const CollapsibleIcon: Story = { args: { collapsible: "icon" } }

/** collapsible axis: "none". */
export const CollapsibleNone: Story = { args: { collapsible: "none" } }

/**
 * SidebarMenuButton `variant` × `size` axis values from sidebar.meta.ts,
 * one menu item per combination, labeled by its values.
 */
export const MenuButtonVariants: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar collapsible="none">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuButtonVariantAxis.values.flatMap((variant) =>
                  menuButtonSizeAxis.values.map((size) => (
                    <SidebarMenuItem key={`${variant}-${size}`}>
                      <SidebarMenuButton
                        variant={variant as MenuButtonProps["variant"]}
                        size={size as MenuButtonProps["size"]}
                      >
                        <Home className="size-4" />
                        <span>
                          {variant} / {size}
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )),
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ),
}
