/**
 * Compass Code Connect — Card
 *
 * HOW TO COMPLETE THIS FILE (do this in Cursor after ICC linking in Figma Dev Mode):
 *
 * 1. Replace FIGMA_COMPONENT_URL with your actual Figma Card component URL.
 *    In Figma: right-click the Card component → Copy link to selection.
 *
 * 2. Card is a composite component — the example shows its sub-components.
 *    Sub-components used in code: Card, CardHeader, CardTitle, CardDescription,
 *    CardContent, CardFooter, CardAction. Do not replace these with plain divs.
 *
 * 3. Verify the 'Size' property name matches Figma exactly (may be called
 *    'Size', 'Density', or 'Variant' depending on the Figma file).
 *
 * 4. Figma nested component children map to figma.children() or figma.nestedProps()
 *    if the card has slotted areas in the Figma component. Adjust as needed.
 *
 * 5. Run `npx figma connect publish --token YOUR_TOKEN` to push to Figma Dev Mode.
 */

import figma from "@figma/code-connect";
import {
  Card,
  CardAction,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

figma.connect(Card, "https://www.figma.com/design/zgzPlhKxDXc3E9OmfxmF9y/ACKO-Enterprise-Design-System-v1.0.0?node-id=21123-292666&m=dev", {
  props: {
    size: figma.enum("Size", {
      default: "default",
      sm: "sm",
    }),
    title: figma.string("Card Title"),
    description: figma.string("Card Description"),
    // Boolean show/hide toggles (Show Image, Card Header, Show Action, etc.) omitted:
    // Code Connect's static parser can't evaluate {showImage && <div />} expressions.
    // The canonical structure below shows the full composite — remove slots you don't need.
  },
  example: ({ size, title, description }) => (
    <Card size={size}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Content goes here */}
      </CardContent>
      <CardFooter>
        {/* Footer actions go here */}
      </CardFooter>
    </Card>
  ),
});
