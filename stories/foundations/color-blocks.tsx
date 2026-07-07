/**
 * Color foundation — rendering blocks.
 *
 * Swatches are painted with the LIVE CSS custom properties shipped by
 * `@acko/enterprise-tokens/globals.css` (imported app-wide via
 * `app/globals.css`, which `.storybook/preview.ts` loads). No color value is
 * hand-typed here: each swatch's background is `var(--<token>)`, and the dark
 * column simply wraps the same vars in a `.dark` scope (the package re-points
 * Layer 3 names to dark aliases under `.dark`).
 *
 * Token names, grouping, and usage strings come from
 * `.claude/specs/foundations/color.md` (Layer 3 semantic tokens).
 */

type TokenEntry = {
  /** CSS custom property name as shipped by the token package */
  token: string;
  /** Usage line quoted from .claude/specs/foundations/color.md */
  usage: string;
};

type TokenGroup = {
  name: string;
  tokens: TokenEntry[];
};

/** Grouping mirrors the "Semantic color tokens (Layer 3)" tables in color.md. */
export const colorGroups: TokenGroup[] = [
  {
    name: 'Backgrounds',
    tokens: [
      { token: '--background', usage: 'Page/app background' },
      { token: '--card', usage: 'Card surfaces, elevated containers' },
      { token: '--popover', usage: 'Dropdowns, tooltips, floating panels' },
      { token: '--muted', usage: 'Subtle backgrounds (disabled, secondary areas)' },
      { token: '--accent', usage: 'Hover/active state backgrounds' },
      { token: '--secondary', usage: 'Secondary button/element backgrounds' },
    ],
  },
  {
    name: 'Foregrounds (text & icons)',
    tokens: [
      { token: '--foreground', usage: 'Primary text' },
      { token: '--card-foreground', usage: 'Text on card surfaces' },
      { token: '--popover-foreground', usage: 'Text in floating panels' },
      { token: '--muted-foreground', usage: 'Secondary/helper text, placeholders' },
      { token: '--accent-foreground', usage: 'Text on accent backgrounds' },
      { token: '--secondary-foreground', usage: 'Text on secondary backgrounds' },
    ],
  },
  {
    name: 'Brand / interactive',
    tokens: [
      { token: '--primary', usage: 'Primary buttons, links, active indicators' },
      { token: '--primary-foreground', usage: 'Text/icons on primary surfaces' },
      { token: '--ring', usage: 'Focus rings (keyboard navigation)' },
    ],
  },
  {
    name: 'Destructive',
    tokens: [
      { token: '--destructive', usage: 'Delete buttons, error states, destructive actions' },
      { token: '--destructive-foreground', usage: 'Text on destructive surfaces' },
    ],
  },
  {
    name: 'Borders & inputs',
    tokens: [
      { token: '--border', usage: 'General dividers, card borders' },
      { token: '--input', usage: 'Input field borders' },
    ],
  },
  {
    name: 'Sidebar',
    tokens: [
      { token: '--sidebar', usage: 'Sidebar background' },
      { token: '--sidebar-foreground', usage: 'Sidebar text' },
      { token: '--sidebar-primary', usage: 'Active sidebar item highlight' },
      { token: '--sidebar-primary-foreground', usage: 'Text on active sidebar item' },
      { token: '--sidebar-accent', usage: 'Sidebar hover/secondary state' },
      { token: '--sidebar-accent-foreground', usage: 'Text on sidebar accent' },
      { token: '--sidebar-border', usage: 'Sidebar dividers' },
      { token: '--sidebar-ring', usage: 'Sidebar focus ring' },
    ],
  },
  {
    name: 'Chart colors',
    tokens: [
      { token: '--chart-1', usage: 'Primary data series' },
      { token: '--chart-2', usage: 'Second data series' },
      { token: '--chart-3', usage: 'Third data series' },
      { token: '--chart-4', usage: 'Fourth data series' },
      { token: '--chart-5', usage: 'Fifth data series' },
    ],
  },
];

function Swatch({ token, usage }: TokenEntry) {
  return (
    <div className="flex items-center gap-3">
      <div
        aria-hidden="true"
        className="size-10 shrink-0 rounded-md border border-border"
        style={{ background: `var(${token})` }}
      />
      <div className="min-w-0">
        <code className="block truncate font-medium text-sm text-foreground">{token}</code>
        <p className="truncate text-xs text-muted-foreground">{usage}</p>
      </div>
    </div>
  );
}

function ModePanel({ tokens, mode }: { tokens: TokenEntry[]; mode: 'light' | 'dark' }) {
  return (
    <div className={mode === 'dark' ? 'dark' : undefined}>
      <div className="h-full rounded-lg border border-border bg-background p-4">
        <p className="mb-3 text-xs font-medium text-muted-foreground">
          {mode === 'light' ? 'Light' : 'Dark'}
        </p>
        <div className="flex flex-col gap-3">
          {tokens.map((t) => (
            <Swatch key={t.token} {...t} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** One token group, rendered live in both modes side by side. */
export function ColorGroup({ name, tokens }: TokenGroup) {
  return (
    <section className="sb-unstyled mb-8 font-sans">
      <h3 className="mb-3 text-xl font-semibold text-foreground">{name}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <ModePanel tokens={tokens} mode="light" />
        <ModePanel tokens={tokens} mode="dark" />
      </div>
    </section>
  );
}

export function AllColorGroups() {
  return (
    <div>
      {colorGroups.map((g) => (
        <ColorGroup key={g.name} {...g} />
      ))}
    </div>
  );
}
