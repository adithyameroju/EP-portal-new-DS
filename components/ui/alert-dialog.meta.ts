import type { ComponentMeta } from "./_meta-schema"

export const alertDialogMeta: ComponentMeta = {
  name: "alert-dialog",
  category: "organism",
  purpose:
    "Modal confirmation dialog for destructive or irreversible actions that traps focus and prevents backdrop-click dismissal, forcing the user to make an explicit choice.",
  useCases: [],
  antiPatterns: [
    {
      wrong: "Wrap AlertDialogAction in a Button",
      instead:
        "AlertDialogAction already renders as a Button; pass variant/size props directly on it",
      source: "spec:.claude/specs/components/dialog.md#rules-for-llms",
    },
    {
      wrong: "Use Dialog sub-components inside AlertDialog (or vice versa)",
      instead:
        "Dialog and AlertDialog are separate components with separate imports; use only AlertDialog* sub-components",
      source: "spec:.claude/specs/components/dialog.md#rules-for-llms",
    },
    {
      wrong: "Show an AlertDialog with only one button",
      instead:
        "Always include both AlertDialogCancel and AlertDialogAction so the user has an explicit escape",
      source: "spec:.claude/specs/components/dialog.md#rules-for-llms",
    },
  ],
  variants: [
    {
      prop: "size",
      values: ["default", "sm"],
      default: "default",
    },
  ],
  sizes: ["default", "sm"],
  parentComponents: ["button"],
  childComponents: [
    "alert-dialog-trigger",
    "alert-dialog-portal",
    "alert-dialog-overlay",
    "alert-dialog-content",
    "alert-dialog-header",
    "alert-dialog-footer",
    "alert-dialog-media",
    "alert-dialog-title",
    "alert-dialog-description",
    "alert-dialog-action",
    "alert-dialog-cancel",
  ],
  tokens: [
    "bg-popover",
    "text-popover-foreground",
    "ring-foreground",
    "bg-muted",
    "text-muted-foreground",
    "text-foreground",
  ],
  a11y: [
    "Traps focus and prevents closing by clicking the backdrop (spec:.claude/specs/components/dialog.md#when-to-use-which)",
    "AlertDialogTitle and AlertDialogDescription render the Base UI Title/Description primitives, which wire up the dialog's accessible name and description",
  ],
  aiHints: {
    selectionCriteria: [],
    confusedWith: [
      {
        component: "dialog",
        disambiguation:
          "Dialog is for general content/forms and allows backdrop-click close; AlertDialog is for destructive confirmations and blocks backdrop dismissal (spec:.claude/specs/components/dialog.md#when-to-use-which)",
      },
    ],
    compositionRules: [
      "AlertDialogTrigger uses the render prop (Base UI pattern), never asChild (spec:.claude/specs/components/dialog.md#rules-for-llms)",
      "AlertDialogHeader wraps AlertDialogTitle and AlertDialogDescription; Content, Header, Title, Description, Footer, Action, and Cancel are all required parts (spec:.claude/specs/components/dialog.md#alertdialog-anatomy)",
      "Footer button order: Cancel/secondary on the left, confirm/primary on the right (spec:.claude/specs/components/dialog.md#rules-for-llms)",
    ],
    source: "spec:.claude/specs/components/dialog.md",
  },
  specStatus: "lightweight",
  specPath: ".claude/specs/components/dialog.md",
  codeConnectStatus: "not-planned",
  primitiveSource: "base-ui",
  version: "1.0.0",
}
