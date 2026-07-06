/**
 * Motion foundation — rendering blocks.
 *
 * Demos animate with the live Tailwind duration/easing token utilities
 * (`duration-*`, `ease-*`) — hover a row group to see the timing; no
 * millisecond or cubic-bezier value is hand-typed in styles.
 *
 * Scale, easing curves, patterns, and presets come from
 * `.claude/specs/foundations/motion.md` (Tailwind v4 defaults + shadcn/ui
 * conventions, per that spec's Status section).
 */

const durations = [
  { token: 'duration-75', ms: '75ms', cls: 'duration-75', usage: 'Instant feedback (opacity flashes)' },
  { token: 'duration-100', ms: '100ms', cls: 'duration-100', usage: 'Micro-interactions (checkbox, toggle)' },
  { token: 'duration-150', ms: '150ms', cls: 'duration-150', usage: 'Button hover/press states (default)' },
  { token: 'duration-200', ms: '200ms', cls: 'duration-200', usage: 'Tooltip show/hide, dropdown open' },
  { token: 'duration-300', ms: '300ms', cls: 'duration-300', usage: 'Panel slide, accordion expand' },
  { token: 'duration-500', ms: '500ms', cls: 'duration-500', usage: 'Page transitions, large layout shifts' },
  { token: 'duration-700', ms: '700ms', cls: 'duration-700', usage: 'Rare — slow reveals' },
  { token: 'duration-1000', ms: '1000ms', cls: 'duration-1000', usage: 'Rare — background fades' },
];

export function DurationScale() {
  return (
    <div className="sb-unstyled group flex flex-col gap-2 rounded-lg border border-border bg-card p-4 font-sans">
      <p className="text-xs text-muted-foreground">
        Hover this panel — each dot moves with its own duration token (ease-in-out).
      </p>
      {durations.map((d) => (
        <div key={d.token} className="flex items-center gap-4 py-1">
          <code className="w-32 shrink-0 text-sm text-foreground">{d.cls}</code>
          <span className="w-16 shrink-0 text-xs text-muted-foreground">{d.ms}</span>
          <div className="h-4 w-40 shrink-0 rounded-full bg-muted px-0.5 py-0.5">
            <div
              className={`${d.cls} size-3 rounded-full bg-primary transition-transform ease-in-out motion-safe:group-hover:translate-x-36`}
            />
          </div>
          <span className="hidden text-xs text-muted-foreground md:block">{d.usage}</span>
        </div>
      ))}
    </div>
  );
}

const easings = [
  { token: 'ease-linear', value: 'linear', cls: 'ease-linear', usage: 'Progress bars, loading indicators' },
  { token: 'ease-in', value: 'cubic-bezier(0.4, 0, 1, 1)', cls: 'ease-in', usage: 'Elements exiting the screen' },
  { token: 'ease-out', value: 'cubic-bezier(0, 0, 0.2, 1)', cls: 'ease-out', usage: 'Elements entering the screen' },
  { token: 'ease-in-out', value: 'cubic-bezier(0.4, 0, 0.2, 1)', cls: 'ease-in-out', usage: 'State changes in place (default)' },
];

export function EasingCurves() {
  return (
    <div className="sb-unstyled group flex flex-col gap-2 rounded-lg border border-border bg-card p-4 font-sans">
      <p className="text-xs text-muted-foreground">
        Hover this panel — each dot moves over 700ms with its own easing token.
      </p>
      {easings.map((e) => (
        <div key={e.token} className="flex items-center gap-4 py-1">
          <code className="w-28 shrink-0 text-sm text-foreground">{e.cls}</code>
          <div className="h-4 w-40 shrink-0 rounded-full bg-muted px-0.5 py-0.5">
            <div
              className={`${e.cls} size-3 rounded-full bg-primary transition-transform duration-700 motion-safe:group-hover:translate-x-36`}
            />
          </div>
          <div className="min-w-0">
            <code className="block truncate text-xs text-muted-foreground">{e.value}</code>
            <span className="block truncate text-xs text-muted-foreground">{e.usage}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Common transition patterns — table from motion.md. */
const patterns = [
  { pattern: 'Button hover', classes: 'transition-colors duration-150', when: 'Color changes on hover/focus' },
  { pattern: 'Dropdown open', classes: 'transition-all duration-200 ease-out', when: 'Dropdown appearing' },
  { pattern: 'Dropdown close', classes: 'transition-all duration-150 ease-in', when: 'Dropdown disappearing' },
  { pattern: 'Accordion expand', classes: 'transition-all duration-300 ease-in-out', when: 'Content height change' },
  { pattern: 'Dialog enter', classes: 'transition-opacity duration-200 ease-out', when: 'Modal fade in' },
  { pattern: 'Dialog exit', classes: 'transition-opacity duration-150 ease-in', when: 'Modal fade out' },
  { pattern: 'Sidebar collapse', classes: 'transition-all duration-300 ease-in-out', when: 'Width/layout change' },
  { pattern: 'Tooltip show', classes: 'transition-opacity duration-200', when: 'Tooltip appearing' },
];

export function TransitionPatternsTable() {
  return (
    <table className="sb-unstyled w-full border-collapse font-sans text-sm">
      <thead>
        <tr className="border-b border-border text-left text-muted-foreground">
          <th className="py-2 pr-4 font-medium">Pattern</th>
          <th className="py-2 pr-4 font-medium">Classes</th>
          <th className="py-2 font-medium">When</th>
        </tr>
      </thead>
      <tbody>
        {patterns.map((p) => (
          <tr key={p.pattern} className="border-b border-border">
            <td className="py-2 pr-4 text-foreground">{p.pattern}</td>
            <td className="py-2 pr-4"><code className="text-foreground">{p.classes}</code></td>
            <td className="py-2 text-muted-foreground">{p.when}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Animation presets (shadcn defaults) — table from motion.md. */
const presets = [
  { animation: 'accordion-down', description: 'Expand from 0 to auto height', usedBy: 'Accordion' },
  { animation: 'accordion-up', description: 'Collapse from auto to 0 height', usedBy: 'Accordion' },
  { animation: 'fadeIn', description: 'Opacity 0 → 1', usedBy: 'Dialog, Popover, Tooltip' },
  { animation: 'fadeOut', description: 'Opacity 1 → 0', usedBy: 'Dialog, Popover, Tooltip' },
  { animation: 'slideInFromTop', description: 'Translate from -100% + fade', usedBy: 'Sheet (top)' },
  { animation: 'slideInFromBottom', description: 'Translate from 100% + fade', usedBy: 'Sheet (bottom)' },
  { animation: 'slideInFromLeft', description: 'Translate from -100% + fade', usedBy: 'Sheet (left)' },
  { animation: 'slideInFromRight', description: 'Translate from 100% + fade', usedBy: 'Sheet (right)' },
];

export function AnimationPresetsTable() {
  return (
    <table className="sb-unstyled w-full border-collapse font-sans text-sm">
      <thead>
        <tr className="border-b border-border text-left text-muted-foreground">
          <th className="py-2 pr-4 font-medium">Animation</th>
          <th className="py-2 pr-4 font-medium">Description</th>
          <th className="py-2 font-medium">Used by</th>
        </tr>
      </thead>
      <tbody>
        {presets.map((p) => (
          <tr key={p.animation} className="border-b border-border">
            <td className="py-2 pr-4"><code className="text-foreground">{p.animation}</code></td>
            <td className="py-2 pr-4 text-foreground">{p.description}</td>
            <td className="py-2 text-muted-foreground">{p.usedBy}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
