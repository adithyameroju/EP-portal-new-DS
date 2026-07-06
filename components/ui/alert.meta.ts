import type { ComponentMeta } from "./_meta-schema"

export const alertMeta: ComponentMeta = {
  name: "alert",
  category: "molecule",
  purpose:
    "An inline, non-modal notification banner for communicating page-level feedback (errors, warnings, informational messages) without interrupting the user's workflow.",
  useCases: [
    "Persistent status message visible in the page flow",
    "Informational or neutral page-level notice (policy renewal reminder, new feature announcement)",
    "Error state for a failed operation at page or section level (payment failed, claim rejected)",
    "Dismissible notice with a close action in the top-right corner",
  ],
  antiPatterns: [
    {
      wrong:
        "Lift Alert out of the page flow with fixed/absolute positioning or a high z-index, treating it like a dialog or toast",
      instead:
        "Place Alert inline in the JSX where it should appear; it is a non-modal, always-visible banner",
      source: "spec:.claude/specs/components/alert.md#rules-for-llms",
    },
    {
      wrong:
        "Add extra right padding manually when using AlertAction",
      instead:
        "Use AlertAction as-is; the alert automatically adds right padding to prevent text overlapping the action",
      source: "spec:.claude/specs/components/alert.md#rules-for-llms",
    },
    {
      wrong:
        "Put the icon inside AlertTitle or AlertDescription",
      instead:
        "Place the SVG icon as the direct first child of Alert so the two-column grid activates",
      source: "spec:.claude/specs/components/alert.md#rules-for-llms",
    },
    {
      wrong: "Use Alert for input validation errors below a specific field",
      instead:
        "Use FieldError from the Field system for field-level errors; Alert is for page- or section-level messages only",
      source: "spec:.claude/specs/components/alert.md#rules-for-llms",
    },
    {
      wrong:
        "Override the card background with a solid destructive or hardcoded red background class",
      instead:
        "Keep the built-in card background; the destructive variant intentionally changes only text and icon color to the destructive token",
      source: "spec:.claude/specs/components/alert.md#rules-for-llms",
    },
    {
      wrong: "Add role=alert manually to the Alert element",
      instead: "Rely on the built-in role=alert on the Alert root",
      source: "spec:.claude/specs/components/alert.md#rules-for-llms",
    },
    {
      wrong: "Wrap AlertTitle or AlertDescription in p or h3 elements",
      instead:
        "Use AlertTitle and AlertDescription directly; they already render as div elements",
      source: "spec:.claude/specs/components/alert.md#rules-for-llms",
    },
  ],
  variants: [
    {
      prop: "variant",
      values: ["default", "destructive"],
      default: "default",
    },
  ],
  sizes: [],
  parentComponents: [],
  childComponents: ["alert-title", "alert-description", "alert-action"],
  tokens: [
    "bg-card",
    "text-card-foreground",
    "text-destructive",
    "text-muted-foreground",
    "text-foreground",
  ],
  a11y: [
    "Root has role=alert built in; screen readers announce the content immediately when it appears — do not add it manually",
    "AlertAction dismiss buttons need an accessible label (spec example uses aria-label on the ghost icon Button)",
  ],
  aiHints: {
    selectionCriteria: [
      "Use Alert for a persistent status message visible in the page",
      "Use Toast/Sonner instead for a transient confirmation that disappears after a few seconds",
      "Use AlertDialog instead for a blocking confirmation requiring an explicit user choice",
      "Use Badge instead for a status label on a record (Active, Expired)",
      "Use FieldError (Field system) instead for an input validation error below a field",
    ],
    confusedWith: [
      {
        component: "sonner",
        disambiguation:
          "Toast/Sonner is a transient confirmation that disappears after a few seconds; Alert is a persistent inline banner in the page flow",
      },
      {
        component: "alert-dialog",
        disambiguation:
          "AlertDialog is a blocking modal confirmation requiring an explicit choice; Alert is non-modal and never interrupts the workflow",
      },
      {
        component: "badge",
        disambiguation:
          "Badge is a status label on a record (Active, Expired); Alert is a page-level feedback banner",
      },
      {
        component: "field",
        disambiguation:
          "FieldError handles input validation errors below a specific field; Alert is for page- or section-level messages only",
      },
    ],
    compositionRules: [
      "Sub-part order: optional SVG icon first (direct child of Alert), then AlertTitle, then AlertDescription, then optional AlertAction",
      "The icon must be the direct first child of Alert; the two-column grid activates via a has-svg selector and will not trigger for icons nested in AlertTitle or AlertDescription",
      "AlertAction is absolutely positioned top-right and typically contains a ghost icon-size Button (e.g. a close/dismiss control)",
      "Links inside AlertDescription are automatically underlined",
    ],
    source: ".claude/specs/components/alert.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/alert.md",
  codeConnectStatus: "not-planned",
  primitiveSource: "native",
  version: "1.0.0",
}
