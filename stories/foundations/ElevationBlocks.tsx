/**
 * Elevation foundation — rendering blocks.
 *
 * Every tile is styled with the live Tailwind v4 shadow token utilities
 * (`shadow-*`, `inset-shadow-*`, `drop-shadow-*`, `ring-*`) — no box-shadow
 * value is hand-typed.
 *
 * Scale, hierarchy, and usage strings come from
 * `.claude/specs/foundations/elevation.md`.
 */

const dropShadows = [
  { token: 'shadow/2xs', cls: 'shadow-2xs', usage: 'Subtle border-like shadow' },
  { token: 'shadow/xs', cls: 'shadow-xs', usage: 'Buttons resting state' },
  { token: 'shadow/sm', cls: 'shadow-sm', usage: 'Cards, dropdowns resting' },
  { token: 'shadow/md', cls: 'shadow-md', usage: 'Elevated cards, popovers' },
  { token: 'shadow/lg', cls: 'shadow-lg', usage: 'Modals, dialogs' },
  { token: 'shadow/xl', cls: 'shadow-xl', usage: 'Prominent floating panels' },
  { token: 'shadow/2xl', cls: 'shadow-2xl', usage: 'Maximum elevation' },
];

export function DropShadowScale() {
  return (
    <div className="sb-unstyled grid grid-cols-2 gap-6 rounded-lg bg-background p-6 font-sans sm:grid-cols-3 md:grid-cols-4">
      {dropShadows.map((s) => (
        <div key={s.token} className="flex flex-col gap-2">
          <div className={`${s.cls} h-20 rounded-lg bg-card`} />
          <div>
            <code className="block text-sm font-medium text-foreground">{s.cls}</code>
            <span className="block text-xs text-muted-foreground">{s.usage}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

const insetShadows = [
  { token: 'inset-shadow/2xs', cls: 'inset-shadow-2xs', usage: 'Subtle pressed state' },
  { token: 'inset-shadow/xs', cls: 'inset-shadow-xs', usage: 'Input fields (inset)' },
  { token: 'inset-shadow/sm', cls: 'inset-shadow-sm', usage: 'Recessed panels' },
];

export function InsetShadowScale() {
  return (
    <div className="sb-unstyled grid grid-cols-2 gap-6 rounded-lg bg-background p-6 font-sans sm:grid-cols-3">
      {insetShadows.map((s) => (
        <div key={s.token} className="flex flex-col gap-2">
          <div className={`${s.cls} h-20 rounded-lg bg-muted`} />
          <div>
            <code className="block text-sm font-medium text-foreground">{s.cls}</code>
            <span className="block text-xs text-muted-foreground">{s.usage}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

const dropShadowFilters = [
  { token: 'drop-shadow/xs', cls: 'drop-shadow-xs' },
  { token: 'drop-shadow/sm', cls: 'drop-shadow-sm' },
  { token: 'drop-shadow/md', cls: 'drop-shadow-md' },
  { token: 'drop-shadow/lg', cls: 'drop-shadow-lg' },
  { token: 'drop-shadow/xl', cls: 'drop-shadow-xl' },
  { token: 'drop-shadow/2xl', cls: 'drop-shadow-2xl' },
];

export function DropShadowFilterScale() {
  return (
    <div className="sb-unstyled grid grid-cols-2 gap-6 rounded-lg bg-background p-6 font-sans sm:grid-cols-3 md:grid-cols-6">
      {dropShadowFilters.map((s) => (
        <div key={s.token} className="flex flex-col items-start gap-2">
          <div className={`${s.cls} size-16 rounded-full bg-primary`} />
          <code className="text-sm font-medium text-foreground">{s.cls}</code>
        </div>
      ))}
    </div>
  );
}

/**
 * Focus rings — rendered with the pattern quoted from elevation.md rule 5:
 * "Implement via Tailwind's focus-visible:ring-2 focus-visible:ring-ring pattern."
 * Shown here in the always-on form so the ring is visible without keyboard focus.
 */
export function FocusRings() {
  return (
    <div className="sb-unstyled flex flex-wrap gap-8 rounded-lg bg-background p-6 font-sans">
      <div className="flex flex-col items-start gap-2">
        <div className="h-10 w-32 rounded-md bg-primary ring-2 ring-ring ring-offset-2 ring-offset-background" />
        <div>
          <code className="block text-sm font-medium text-foreground">focus/default</code>
          <span className="block text-xs text-muted-foreground">
            Default keyboard focus indicator (ring-ring)
          </span>
        </div>
      </div>
      <div className="flex flex-col items-start gap-2">
        <div className="h-10 w-32 rounded-md bg-destructive ring-2 ring-destructive ring-offset-2 ring-offset-background" />
        <div>
          <code className="block text-sm font-medium text-foreground">focus/destructive</code>
          <span className="block text-xs text-muted-foreground">
            Focus on destructive elements (ring-destructive)
          </span>
        </div>
      </div>
    </div>
  );
}

/** Elevation hierarchy — table from elevation.md. */
const hierarchy = [
  { level: '0 (flat)', token: 'none', usage: 'Sections within the page, no elevation' },
  { level: '1 (subtle)', token: 'shadow-2xs or shadow-xs', usage: 'Buttons, chips, subtle separation' },
  { level: '2 (resting)', token: 'shadow-sm', usage: 'Cards, list items on hover' },
  { level: '3 (raised)', token: 'shadow-md', usage: 'Popovers, dropdown menus, tooltips' },
  { level: '4 (floating)', token: 'shadow-lg', usage: 'Modals, dialogs, command palettes' },
  { level: '5 (overlay)', token: 'shadow-xl or shadow-2xl', usage: 'Full-screen overlays, spotlight effects' },
];

export function ElevationHierarchyTable() {
  return (
    <table className="sb-unstyled w-full border-collapse font-sans text-sm">
      <thead>
        <tr className="border-b border-border text-left text-muted-foreground">
          <th className="py-2 pr-4 font-medium">Level</th>
          <th className="py-2 pr-4 font-medium">Shadow token</th>
          <th className="py-2 font-medium">When to use</th>
        </tr>
      </thead>
      <tbody>
        {hierarchy.map((h) => (
          <tr key={h.level} className="border-b border-border">
            <td className="py-2 pr-4 text-foreground">{h.level}</td>
            <td className="py-2 pr-4"><code className="text-foreground">{h.token}</code></td>
            <td className="py-2 text-muted-foreground">{h.usage}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
