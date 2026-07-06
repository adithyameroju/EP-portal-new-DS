import type { ComponentMeta } from "./_meta-schema"

export const tabsMeta: ComponentMeta = {
  name: "tabs",
  category: "molecule",
  purpose:
    "In-page switcher between related content views on the same page — Tabs must never cause page navigation; if clicking a tab changes the URL, use NavigationMenu or page-level routing instead.",
  useCases: [
    "Switching between related content panels on a record page (Overview / Documents / History)",
    "Filtering a list or table with line-variant tabs (All / Active / Expired / Pending)",
    "Vertical tabs to the left of content for settings pages",
    "Tabs with lucide icons alongside labels",
    "Controlled tabs whose active value is managed externally",
  ],
  antiPatterns: [
    {
      wrong:
        "Give TabsTrigger and its TabsContent different value strings",
      instead:
        "The value must match exactly between TabsTrigger and TabsContent — a mismatch means a tab click shows nothing",
      source: "spec:.claude/specs/components/tabs.md#rules-for-llms",
    },
    {
      wrong: "Omit defaultValue on Tabs",
      instead:
        "Always set defaultValue — without it no tab is active on first render and all content panels are hidden",
      source: "spec:.claude/specs/components/tabs.md#rules-for-llms",
    },
    {
      wrong: "Pick the TabsList variant based on aesthetics",
      instead:
        "Choose by Figma's active indicator: pill/capsule active state means variant default; underline active state means variant line",
      source: "spec:.claude/specs/components/tabs.md#rules-for-llms",
    },
    {
      wrong:
        "Use Tabs for navigation that changes the URL or routes to a new page",
      instead:
        "Use NavigationMenu or Next.js Link routing for navigation; Tabs are for in-page view switching only",
      source: "spec:.claude/specs/components/tabs.md#rules-for-llms",
    },
    {
      wrong:
        "Add extra TabsTrigger buttons without matching TabsContent panels (or vice versa)",
      instead:
        "Every trigger must have exactly one matching content panel — one TabsContent per TabsTrigger",
      source: "spec:.claude/specs/components/tabs.md#rules-for-llms",
    },
    {
      wrong: "Add a padding className directly to TabsContent",
      instead:
        "Wrap content in a Card or a padded div inside the content panel; padding on TabsContent itself causes layout issues",
      source: "spec:.claude/specs/components/tabs.md#rules-for-llms",
    },
    {
      wrong:
        "Use a non-default icon size or add manual margins to icons inside TabsTrigger",
      instead:
        "Use size-4 icons — they are inline and the built-in gap handles spacing automatically",
      source: "spec:.claude/specs/components/tabs.md#rules-for-llms",
    },
  ],
  variants: [
    {
      prop: "variant",
      values: ["default", "line"],
      default: "default",
    },
    {
      prop: "orientation",
      values: ["horizontal", "vertical"],
      default: "horizontal",
    },
  ],
  sizes: [],
  parentComponents: [],
  childComponents: ["tabs-list", "tabs-trigger", "tabs-content"],
  tokens: [
    "bg-muted",
    "text-muted-foreground",
    "bg-background",
    "text-foreground",
    "text-foreground/60",
    "bg-foreground",
    "ring-ring/50",
  ],
  a11y: [
    "Built on the Base UI Tabs primitive, which provides tab list semantics, keyboard activation, and active-tab state",
    "Keyboard focus shows a visible ring (ring-ring at 50 percent opacity) on triggers",
    "Disabled triggers get reduced opacity with pointer events disabled, via both disabled and aria-disabled styling",
    "TabsContent panels are focus-managed with outline-none on the panel element",
  ],
  aiHints: {
    selectionCriteria: [
      "Use Tabs for switching between related content views on the same page",
      "Use Tabs with variant line for filtering a list or table (e.g. All / Active / Expired)",
      "Use Tabs with 2 triggers for toggling between two views",
      "Use Sidebar or NavigationMenu instead for top-level app navigation that moves between pages/routes",
      "Use a custom Stepper instead for a step-by-step wizard with a linear flow — not Tabs",
    ],
    confusedWith: [
      {
        component: "navigation-menu",
        disambiguation:
          "NavigationMenu is for top-level navigation that changes the URL; Tabs switch views in-page without navigation",
      },
      {
        component: "sidebar",
        disambiguation:
          "Sidebar is top-level app navigation between pages/routes; Tabs switch related content views within one page",
      },
    ],
    compositionRules: [
      "Structure: Tabs (root, manages active state) > TabsList (the tab bar) with TabsTrigger children, followed by one TabsContent per trigger",
      "TabsTrigger and TabsContent are paired by identical value strings; always set defaultValue on Tabs",
      "Variant lives on TabsList (default pill style or line underline style); orientation lives on Tabs (horizontal default, vertical for settings layouts)",
      "Icons inside TabsTrigger are size-4 and inline; the built-in gap handles spacing",
      "Controlled usage: value plus onValueChange on Tabs",
    ],
    source: ".claude/specs/components/tabs.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/tabs.md",
  codeConnectStatus: "mapped",
  primitiveSource: "base-ui",
  version: "1.0.0",
}
