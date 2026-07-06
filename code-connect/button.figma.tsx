/**
 * Compass Code Connect — Button
 *
 * HOW TO COMPLETE THIS FILE (do this in Cursor after ICC linking in Figma Dev Mode):
 *
 * 1. Replace FIGMA_COMPONENT_URL with your actual Figma component URL.
 *    In Figma: right-click the Button component → Copy link to selection.
 *    It looks like: https://www.figma.com/design/FILE_ID/File-Name?node-id=XXX
 *
 * 2. Verify that the figma.enum() first argument (e.g. 'Variant') matches
 *    the EXACT property name in Figma (check in the Properties panel).
 *    The keys inside the enum object (e.g. 'Default') must match Figma option names exactly.
 *
 * 3. Run `npx figma connect publish --token YOUR_TOKEN` to push to Figma Dev Mode.
 */

import figma from "@figma/code-connect";
import { Button } from "@/components/ui/button";

figma.connect(Button, "https://www.figma.com/design/zgzPlhKxDXc3E9OmfxmF9y/ACKO-Enterprise-Design-System-v1.0.0?node-id=37-931&t=KAX2wMtU6zm0Lu1V-11", {
  props: {
    variant: figma.enum("Variant", {
      Default: "default",
      Secondary: "secondary",
      Destructive: "destructive",
      Outline: "outline",
      Ghost: "ghost",
      Link: "link",
    }),
    // State omitted: Code Connect uses a static parser — expressions like
    // disabled={state === "disabled"} aren't evaluatable at parse time.
    // Disabled/loading states are documented in specs/components/button.md.
    size: figma.enum("Size", {
      default: "default",
      xs: "xs",
      sm: "sm",
      lg: "lg",
      icon: "icon",
      "icon-xs": "icon-xs",
      "icon-sm": "icon-sm",
      "icon-lg": "icon-lg",
    }),
    label: figma.string("Button Text"),
  },
  example: ({ variant, size, label }) => (
    <Button variant={variant} size={size}>
      {label}
    </Button>
  ),
});
