import type { ComponentMeta } from "./_meta-schema"

export const collapsibleMeta: ComponentMeta = {
  name: "collapsible",
  category: "molecule",
  purpose:
    "A minimal show/hide primitive built on Base UI's collapsible — a behaviour-only wrapper with no built-in styling, used for a single independent expandable section styled with Tailwind.",
  useCases: [
    "Single independent expandable section (additional details, claim history)",
    "Expandable section header inside a Card (policy add-ons list)",
    "Show/hide toggle with an animated chevron indicator driven by controlled state",
    "Controlled details section whose open state is managed externally",
  ],
  antiPatterns: [
    {
      wrong:
        "Use asChild on CollapsibleTrigger, or nest a Button as a plain child (which renders an unstyled button inside your button)",
      instead:
        "Pass the trigger element via the render prop (Base UI pattern), e.g. CollapsibleTrigger render set to a ghost Button; the trigger's children become CollapsibleTrigger's children",
      source: "spec:.claude/specs/components/collapsible.md#rules-for-llms",
    },
    {
      wrong: "Expect CollapsibleContent to have built-in padding",
      instead:
        "Add padding via className (e.g. horizontal padding plus bottom padding utilities)",
      source: "spec:.claude/specs/components/collapsible.md#rules-for-llms",
    },
    {
      wrong:
        "Use Collapsible for multiple sections where only one should be open at a time (or any managed group)",
      instead:
        "Use Accordion for grouped expand/collapse; Collapsible is for a single independent section",
      source: "spec:.claude/specs/components/collapsible.md#rules-for-llms",
    },
    {
      wrong:
        "Expect the chevron icon to animate automatically when the section opens",
      instead:
        "Use controlled open state and a rotate-180 class conditioned on open to animate the indicator",
      source: "spec:.claude/specs/components/collapsible.md#rules-for-llms",
    },
    {
      wrong: "Import CollapsiblePanel from the collapsible file",
      instead:
        "Use CollapsibleContent — the export name is CollapsibleContent but it renders the Base UI Panel under the hood; CollapsiblePanel does not exist",
      source: "spec:.claude/specs/components/collapsible.md#rules-for-llms",
    },
  ],
  variants: [],
  sizes: [],
  parentComponents: [],
  childComponents: ["collapsible-trigger", "collapsible-content"],
  tokens: [],
  a11y: [
    "Trigger/panel ARIA wiring (aria-expanded, aria-controls) and keyboard toggling are handled by the Base UI Collapsible primitive; the wrapper adds no manual ARIA",
    "Render the trigger as a real button (spec examples pass a Button via the render prop) so keyboard activation works",
  ],
  aiHints: {
    selectionCriteria: [
      "Use Collapsible for a single independent expandable section",
      "Use Accordion instead when multiple sections should be managed as a group or only one should be open at a time",
      "Multiple independent expandable sections = multiple separate Collapsible components, not an Accordion",
    ],
    confusedWith: [
      {
        component: "accordion",
        disambiguation:
          "Accordion manages a group of sections where only one is open at a time; Collapsible is a single independent expandable section with no group management",
      },
    ],
    compositionRules: [
      "Sub-part order: Collapsible root manages open/closed state and wraps CollapsibleTrigger (toggle button) then CollapsibleContent (expandable content); all three are always required",
      "CollapsibleTrigger takes its rendered element via the render prop (e.g. a ghost Button) — never asChild and never a Button nested as a plain child",
      "CollapsibleContent has no built-in padding; add it via className",
      "Use keepMounted on CollapsibleContent to keep closed content in the DOM for pre-rendering",
      "The chevron does not animate automatically — drive rotation from controlled open state with a conditional rotate-180 class",
    ],
    source: ".claude/specs/components/collapsible.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/collapsible.md",
  codeConnectStatus: "not-planned",
  primitiveSource: "base-ui",
  version: "1.0.0",
}
