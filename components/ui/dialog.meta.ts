import type { ComponentMeta } from "./_meta-schema"

export const dialogMeta: ComponentMeta = {
  name: "dialog",
  category: "organism",
  purpose:
    "A general-purpose modal for content and forms (edit, create, settings, informational overlays) that allows backdrop-click to close — destructive confirmations use AlertDialog instead.",
  useCases: [
    "Form inside a modal (edit profile, add nominee, settings)",
    "Informational overlay with a close button (what's covered explainer)",
    "Modal with a footer action bar (Cancel via DialogClose plus a primary Button)",
    "Controlled dialog whose open state is managed externally",
  ],
  antiPatterns: [
    {
      wrong:
        "Mix AlertDialog sub-components inside Dialog, or use Dialog for an irreversible confirmation",
      instead:
        "Use Dialog for content/forms and AlertDialog for irreversible confirmations — they are two separate components; never mix their sub-components",
      source: "spec:.claude/specs/components/dialog.md#rules-for-llms",
    },
    {
      wrong: "Use DialogHeader without a DialogTitle",
      instead:
        "DialogTitle is required whenever DialogHeader is used (same rule as Card) — omitting it is structural drift",
      source: "spec:.claude/specs/components/dialog.md#rules-for-llms",
    },
    {
      wrong:
        "Use asChild on DialogTrigger, or nest a Button as a plain child (which creates a button inside a button)",
      instead:
        "Pass the trigger element via the render prop (Base UI pattern), e.g. DialogTrigger render set to a Button",
      source: "spec:.claude/specs/components/dialog.md#rules-for-llms",
    },
    {
      wrong: "Add custom close logic or an extra close button to DialogContent",
      instead:
        "DialogContent has a built-in close button (showCloseButton defaults to true); add an explicit DialogClose in the footer only for a labelled Cancel button, and set showCloseButton to false only when the footer already has a cancel action",
      source: "spec:.claude/specs/components/dialog.md#rules-for-llms",
    },
    {
      wrong: "Hardcode widths on DialogContent",
      instead:
        "Keep the built-in small max-width (sm:max-w-sm) — it is the Compass standard; only override for confirmed design exceptions noted in What I assumed",
      source: "spec:.claude/specs/components/dialog.md#rules-for-llms",
    },
    {
      wrong: "Put the confirm/primary action before the cancel action in the footer",
      instead:
        "Order footer buttons cancel/secondary on the left, confirm/primary on the right — matching the built-in sm:justify-end layout",
      source: "spec:.claude/specs/components/dialog.md#rules-for-llms",
    },
  ],
  variants: [],
  sizes: [],
  parentComponents: ["button"],
  childComponents: [
    "dialog-trigger",
    "dialog-portal",
    "dialog-close",
    "dialog-overlay",
    "dialog-content",
    "dialog-header",
    "dialog-footer",
    "dialog-title",
    "dialog-description",
  ],
  tokens: [
    "bg-popover",
    "text-popover-foreground",
    "ring-foreground/10",
    "bg-muted/50",
    "text-muted-foreground",
  ],
  a11y: [
    "The built-in close button carries an sr-only Close label",
    "DialogTitle and DialogDescription are Base UI Title/Description parts, wiring the accessible name and description of the dialog — include DialogTitle whenever DialogHeader is used",
    "Focus handling and dismissal (Escape, backdrop click) come from the Base UI Dialog primitive; Dialog allows backdrop-click to close, unlike AlertDialog which forces an explicit choice",
    "The overlay is a subtle translucent dark backdrop with a light blur — not a heavy dark overlay",
  ],
  aiHints: {
    selectionCriteria: [
      "Use Dialog for a form inside a modal (edit, create, settings)",
      "Use Dialog for an informational overlay with a close button",
      "Use AlertDialog instead for destructive confirmations, warnings that require an explicit choice, or a simple message the user must acknowledge",
      "Key distinction: AlertDialog traps focus and prevents closing by clicking the backdrop; Dialog allows backdrop-click to close",
    ],
    confusedWith: [
      {
        component: "alert-dialog",
        disambiguation:
          "AlertDialog is for destructive confirmations and forces an explicit choice (no backdrop-click close); Dialog is for general content and forms and can be dismissed by backdrop click — separate components with separate imports, never mix their sub-components",
      },
    ],
    compositionRules: [
      "Sub-part order: Dialog root > DialogTrigger (element via render prop), then DialogContent containing DialogHeader (DialogTitle + optional DialogDescription), the content, and DialogFooter with actions",
      "DialogContent already includes the portal, overlay, and built-in top-right close button — never hand-roll them",
      "DialogFooter renders a muted action bar with a top border; set its showCloseButton prop to true to add a built-in outline Close button automatically",
      "Footer button order: cancel/secondary on the left, confirm/primary on the right",
      "Use DialogClose (via render with an outline Button) for a labelled Cancel action in the footer",
    ],
    source: ".claude/specs/components/dialog.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/dialog.md",
  codeConnectStatus: "mapped",
  primitiveSource: "base-ui",
  version: "1.0.0",
}
