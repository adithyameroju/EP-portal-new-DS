import type { ComponentMeta } from "./_meta-schema"

export const buttonMeta: ComponentMeta = {
  name: "button",
  category: "atom",
  purpose:
    "The single button component for all actions in Compass — six variants matching the Figma component set exactly, covering primary, secondary, destructive, outline, ghost, and link actions.",
  useCases: [
    "Primary actions (Submit, Save, Continue) with the default variant",
    "Secondary actions (Cancel, Back) with the secondary variant",
    "Dangerous, irreversible actions (Delete, Remove) with the destructive variant",
    "Tertiary actions and form controls with the outline variant",
    "Toolbar, inline, and icon-only actions with the ghost variant",
    "Navigational text that behaves like a link (link variant with render={<Link />})",
    "Loading state during form submission via children composition (spinner + disabled)",
    "Inline text-style actions such as the 'Forgot your password?' pattern",
  ],
  antiPatterns: [
    {
      wrong:
        "Invent a loading prop on Button (e.g. loading={true}) to show a spinner",
      instead:
        "Use children composition with the disabled prop: Button disabled wrapping a Loader2 icon with animate-spin plus the label (e.g. 'Saving...'); Button has no loading prop",
      source:
        "spec:.claude/specs/components/button.md#loading-state--decision-record",
    },
    {
      wrong:
        "Show a loading spinner without also setting the disabled prop",
      instead:
        "Always pair the loading spinner with disabled to prevent double-clicks during loading",
      source:
        "spec:.claude/specs/components/button.md#loading-state--decision-record",
    },
    {
      wrong:
        "Use multiple default (primary) variant buttons in the same card, form, or dialog",
      instead:
        "One primary button per visible area; other actions use secondary, outline, or ghost",
      source: "spec:.claude/specs/components/button.md#rules-for-llms",
    },
    {
      wrong:
        "Create a custom button component or a raw button element with hand-written styles",
      instead: "All buttons use the Button component from components/ui/button",
      source: "spec:.claude/specs/components/button.md#rules-for-llms",
    },
    {
      wrong: "Render an icon-only button without an accessible label",
      instead:
        "Icon-only buttons must use size=icon and include an aria-label every time",
      source: "spec:.claude/specs/components/button.md#rules-for-llms",
    },
    {
      wrong:
        "Navigate with onClick plus router.push, or compose links via asChild",
      instead:
        "Use render={<Link href=... />} for navigation; asChild is the Radix pattern and this repo uses Base UI",
      source: "spec:.claude/specs/components/button.md#rules-for-llms",
    },
    {
      wrong: "Create a 'pressed' state prop or variant",
      instead:
        "Pressed/active is handled automatically by the CSS active pseudo-class; hover and focus are also automatic",
      source: "spec:.claude/specs/components/button.md#rules-for-llms",
    },
    {
      wrong:
        "Override Button's built-in styles with className (custom hover classes, or structural overrides like h-auto, p-0, shadow-none to make a button look like text)",
      instead:
        "Choose the right variant (link or ghost) instead of fighting the variant's defaults; only layout utilities (w-full, shrink-0, mt-2) that don't override visual token properties are acceptable",
      source: "spec:.claude/specs/components/button.md#rules-for-llms",
    },
    {
      wrong:
        "Add manual mr-2 or ml-2 spacing between a button's icon and text",
      instead:
        "The gap between icon and text is handled by the button's built-in flex gap",
      source: "spec:.claude/specs/components/button.md#icons-in-buttons",
    },
  ],
  variants: [
    {
      prop: "variant",
      values: [
        "default",
        "outline",
        "secondary",
        "ghost",
        "destructive",
        "link",
      ],
      default: "default",
    },
    {
      prop: "size",
      values: [
        "default",
        "xs",
        "sm",
        "lg",
        "icon",
        "icon-xs",
        "icon-sm",
        "icon-lg",
      ],
      default: "default",
    },
  ],
  sizes: [
    "default",
    "xs",
    "sm",
    "lg",
    "icon",
    "icon-xs",
    "icon-sm",
    "icon-lg",
  ],
  parentComponents: ["button-group"],
  childComponents: [],
  tokens: [
    "bg-primary",
    "text-primary-foreground",
    "bg-secondary",
    "text-secondary-foreground",
    "bg-destructive",
    "text-destructive",
    "border-border",
    "border-input",
    "bg-background",
    "bg-muted",
    "text-foreground",
    "text-primary",
    "ring-ring",
  ],
  a11y: [
    "Icon-only buttons (size=icon) must have an aria-label every time",
    "Keyboard focus shows a visible focus ring via focus-visible styles (ring-ring based) — do not modify",
    "disabled reduces opacity and removes pointer events via the native attribute; loading buttons must also be disabled to prevent double-clicks",
    "aria-invalid switches border and ring to destructive tokens automatically",
  ],
  aiHints: {
    selectionCriteria: [
      "One primary action per visible area — a card, form, or dialog gets at most one variant=default button; others use secondary, outline, or ghost",
      "Destructive is for irreversible actions only ('Delete account' yes; 'Remove filter' no — that's outline or ghost)",
      "Ghost vs Outline: ghost has no border and is more subtle — use it for toolbar/icon-only actions; use outline when the button needs visible boundaries (e.g. in a form alongside inputs)",
      "Inline text-style actions: primary-colored text that navigates uses variant=link with render={<Link />}; foreground-colored (muted) inline text uses variant=ghost size=sm",
    ],
    confusedWith: [],
    compositionRules: [
      "Loading = children composition + disabled: Button disabled wrapping Loader2 (from lucide-react) with animate-spin and size-4, replacing or prepending the label (e.g. 'Save' becomes 'Saving...')",
      "Navigation: Button render={<Link href=... />} — never onClick + router.push, never asChild",
      "Icon left of text for most actions; icon right of text for directional actions ('Next', external links); icon-only requires size=icon plus aria-label",
      "Icon size matches the button size tier: size-4 for default/small, size-5 for large; the icon-text gap is built in",
      "For ghost inline text actions, accept the subtle hover background — it is intentional; do not override it with className",
    ],
    source: ".claude/specs/components/button.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/button.md",
  codeConnectStatus: "mapped",
  primitiveSource: "base-ui",
  primitiveElements: ["button"],
  version: "1.0.0",
}
