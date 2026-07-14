/**
 * Compass ComponentMeta schema — the machine-readable contract that Storybook
 * docs, the compliance audit (checks C2/C3/C4), migration resolution, and the
 * scaffold pipeline all read. Approved by owner 2026-07-06 (S1).
 *
 * Provenance rule (structural no-invention): every antiPattern and aiHints
 * block carries a `source` citation. Anything that cannot cite a spec,
 * CLAUDE.md, or observed drift is omitted — never invented.
 */

/** Where the component sits in the composition hierarchy (sidebar taxonomy,
 *  audit weighting, and S6 promotion target all read this). "pattern" is
 *  reserved for S6 promotions (e.g. PillSelector, ChartCard). */
export type ComponentCategory =
  | "atom"
  | "molecule"
  | "organism"
  | "template"
  | "pattern";

/** Documentation/coverage status, surfaced as the Storybook status badge. */
export type SpecStatus = "specced" | "lightweight" | "none";

export type CodeConnectStatus = "mapped" | "planned" | "not-planned";

/** One variant axis (e.g. Button's `variant` or `size` prop). */
export interface VariantAxis {
  /** Prop name as it appears in the component's TS types, e.g. "variant". */
  prop: string;
  /** Allowed values, verbatim from the component source. */
  values: string[];
  /** Default value if the component declares one. */
  default?: string;
}

/** A documented misuse. Sourced ONLY from spec "Rules for LLMs" sections or
 *  observed drift (S4 ledger) — never invented. `source` records provenance. */
export interface AntiPattern {
  /** What people do wrong, e.g. "Recreate CardHeader layout with divs". */
  wrong: string;
  /** What to do instead, e.g. "Use CardHeader/CardTitle/CardDescription". */
  instead: string;
  /** Provenance: "spec:<path>#<section>" | "drift:<ledger-entry>" | "claude-md". */
  source: string;
}

/** Hints consumed by LLMs (Cursor/Claude) during generation — the machine
 *  half of the spec. All entries require provenance like AntiPattern.source. */
export interface AiHints {
  /** When to pick this component over lookalikes. */
  selectionCriteria: string[];
  /** Components this one is commonly mistaken for, with the disambiguator.
   *  e.g. { component: "sheet", disambiguation: "Sheet is an overlay panel;
   *  Drawer is mobile-first bottom sheet (vaul)" } */
  confusedWith: Array<{ component: string; disambiguation: string }>;
  /** Composition rules the LLM must follow (render prop, sub-part order). */
  compositionRules: string[];
  /** Provenance for the block as a whole (spec path or "types-only"). */
  source: string;
}

export interface ComponentMeta {
  /** kebab-case name matching the file in components/ui/, e.g. "dropdown-menu". */
  name: string;
  category: ComponentCategory;
  /** One-sentence purpose, lifted from the spec's purpose statement where one
   *  exists, else from the component's doc comment / shadcn description. */
  purpose: string;
  /** Concrete use cases ("form submission action", "destructive confirmation"). */
  useCases: string[];
  /** Documented misuses. Empty array = none documented yet (NOT "none exist"). */
  antiPatterns: AntiPattern[];
  /** Variant axes read from the component's actual TS types. */
  variants: VariantAxis[];
  /** Size values if the component has a size axis (duplicated from variants
   *  for cheap lookup by the audit and Storybook). */
  sizes: string[];
  /** Composite parents this component belongs to (e.g. CardHeader → "card"). */
  parentComponents: string[];
  /** Sub-components this composite exposes (e.g. card → ["card-header", ...]).
   *  Audit check C3 (composite completeness) resolves against this. */
  childComponents: string[];
  /** Semantic tokens this component consumes (from spec Default Styling). */
  tokens: string[];
  /** Accessibility notes: roles, keyboard behavior, focus handling. */
  a11y: string[];
  aiHints: AiHints;
  specStatus: SpecStatus;
  /** Repo-relative spec path, or null when specStatus is "none".
   *  Audit check C4 (spec coverage) resolves against this. */
  specPath: string | null;
  codeConnectStatus: CodeConnectStatus;
  /** Underlying primitive source: "base-ui" | "vaul" | "cmdk" | "embla" |
   *  "react-day-picker" | "recharts" | "native" | "composite". S5 golden-pair
   *  diffing and the Base UI watch-item read this. */
  primitiveSource: string;
  /** Raw HTML element(s) this component is the canonical wrapper for — read
   *  by the C2 re-implemented-primitive check (a hand-rolled <button>/<input>/
   *  <select>/<textarea>/<table> should use the Compass wrapper instead).
   *  Undefined for composites and Base-UI role-primitives (checkbox, switch,
   *  slider, etc.), which do not render a raw governable element. */
  primitiveElements?: string[]
  /** Semver-style component version, starts "1.0.0"; bumped via S6 pipeline. */
  version: string;
}
