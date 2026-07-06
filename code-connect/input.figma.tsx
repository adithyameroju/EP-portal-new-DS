/**
 * Compass Code Connect — Input
 *
 * HOW TO COMPLETE THIS FILE (do this in Cursor after ICC linking in Figma Dev Mode):
 *
 * 1. Replace FIGMA_COMPONENT_URL with your actual Figma component URL.
 *    In Figma: right-click the Input component → Copy link to selection.
 *
 * 2. Verify property names match exactly (check Figma Properties panel).
 *    Figma `Variant` maps to the input `type`; `State` maps to disabled / aria-invalid /
 *    defaultValue for the static Code Connect preview.
 *
 * 3. Run `npx figma connect publish --token YOUR_TOKEN` to push to Figma Dev Mode.
 */

import figma from "@figma/code-connect";
import { Input } from "@/components/ui/input";

figma.connect(Input, "https://www.figma.com/design/zgzPlhKxDXc3E9OmfxmF9y/ACKO-Enterprise-Design-System-v1.0.0?node-id=65-533&m=dev", {
  props: {
    type: figma.enum("Variant", {
      Default: "text",
      File: "file",
      Password: "password",
    }),
    placeholder: figma.string("Placeholder Text"),
    // State omitted: Code Connect uses a static parser — expressions like
    // disabled={state === "disabled"} aren't evaluatable at parse time.
    // Error/disabled states are documented in specs/components/input.md.
  },
  example: ({ type, placeholder }) => (
    <Input type={type} placeholder={placeholder} />
  ),
});
