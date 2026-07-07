/**
 * NavigationMenu stories — S2.3.
 * Title from navigationMenuMeta.category ("organism" → "Organisms").
 * NavigationMenu has no variant axes (navigationMenuMeta.variants = []);
 * stories are the composition shapes verbatim from
 * .claude/specs/components/navigation-menu.md "Common patterns".
 * Simplification (Storybook self-containment, per sidebar.stories.tsx
 * convention): the spec's next/link `render` targets are dropped so clicks
 * don't navigate the preview iframe — NavigationMenuLink renders its default
 * element and the Link's className moves onto NavigationMenuLink. Per the
 * current spec text, NavigationMenuPositioner is exported but "the
 * NavigationMenu root already includes it", so it is not imported here.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { navigationMenuMeta } from "@/components/ui/navigation-menu.meta"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Organisms/NavigationMenu",
  component: NavigationMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { page: metaDocsPage(navigationMenuMeta) },
  },
} satisfies Meta<typeof NavigationMenu>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Verbatim: spec:.claude/specs/components/navigation-menu.md
 * "Top nav with dropdown panel" (next/link targets dropped — see file header).
 */
export const TopNavWithDropdownPanel: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-96 grid-cols-2 gap-2 p-4">
              <NavigationMenuLink className="flex flex-col gap-1 rounded-md p-3 hover:bg-muted">
                <span className="text-sm font-medium">Motor Insurance</span>
                <span className="text-xs text-muted-foreground">
                  Comprehensive coverage for your vehicle
                </span>
              </NavigationMenuLink>
              <NavigationMenuLink className="flex flex-col gap-1 rounded-md p-3 hover:bg-muted">
                <span className="text-sm font-medium">Health Insurance</span>
                <span className="text-xs text-muted-foreground">
                  Individual and family health plans
                </span>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-48 gap-1 p-2">
              <NavigationMenuLink>Enterprise</NavigationMenuLink>
              <NavigationMenuLink>Small Business</NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            About
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/navigation-menu.md
 * "Simple nav with direct links only (no dropdowns)" (next/link targets
 * dropped — see file header).
 */
export const DirectLinksOnly: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Dashboard
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Policies
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Claims
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}
