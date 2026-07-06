import type { ComponentMeta } from "./_meta-schema"

export const inputGroupMeta: ComponentMeta = {
  name: "input-group",
  category: "molecule",
  purpose:
    "Bordered field wrapper that composes Input or Textarea with inline or block addons (icons, text, buttons, kbd hints) inside a single focus-ring container.",
  useCases: [],
  antiPatterns: [],
  variants: [
    {
      prop: "align",
      values: ["inline-start", "inline-end", "block-start", "block-end"],
      default: "inline-start",
    },
    {
      prop: "size",
      values: ["xs", "sm", "icon-xs", "icon-sm"],
      default: "xs",
    },
  ],
  sizes: ["xs", "sm", "icon-xs", "icon-sm"],
  parentComponents: ["button", "input", "textarea"],
  childComponents: [
    "input-group-addon",
    "input-group-button",
    "input-group-text",
    "input-group-input",
    "input-group-textarea",
  ],
  tokens: [
    "border-input",
    "border-ring",
    "ring-ring",
    "border-destructive",
    "ring-destructive",
    "bg-input",
    "text-muted-foreground",
  ],
  a11y: [
    "role=group on InputGroup and InputGroupAddon",
    "Container styling responds to aria-invalid on the wrapped control (destructive border and ring)",
    "Clicking an addon (outside a button) moves focus to the wrapped input",
  ],
  aiHints: {
    selectionCriteria: [],
    confusedWith: [],
    compositionRules: [],
    source: "types-only",
  },
  specStatus: "none",
  specPath: null,
  codeConnectStatus: "not-planned",
  primitiveSource: "composite",
  version: "1.0.0",
}
