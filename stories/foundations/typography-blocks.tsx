/**
 * Typography foundation — rendering blocks.
 *
 * Everything renders through the live token chain: `--font-sans/serif/mono`
 * come from `@acko/enterprise-tokens` (`@theme inline`), the faces load via
 * `app/globals.css` → `app/fonts.css` (@font-face "Euclid Circular B"),
 * and sizes/weights use the Tailwind token classes the specs mandate.
 *
 * Structure, size/line-height figures, and usage strings come from
 * `.claude/specs/foundations/typography.md`.
 */

const SPECIMEN_TEXT = 'The quick brown fox jumps over the lazy dog 0123456789';

/** Euclid Circular B specimen across the three family slots (all one typeface by spec). */
export function FontFamilySpecimen() {
  const slots = [
    { token: 'font-sans', cls: 'font-sans', cssVar: '--font-sans' },
    { token: 'font-serif', cls: 'font-serif', cssVar: '--font-serif' },
    { token: 'font-mono', cls: 'font-mono', cssVar: '--font-mono' },
  ];
  return (
    <div className="sb-unstyled flex flex-col gap-4 font-sans">
      {slots.map((s) => (
        <div key={s.token} className="rounded-lg border border-border bg-card p-4">
          <div className="mb-2 flex items-baseline gap-3">
            <code className="text-sm font-medium text-foreground">{s.token}</code>
            <code className="text-xs text-muted-foreground">var({s.cssVar})</code>
            <span className="text-xs text-muted-foreground">Euclid Circular B</span>
          </div>
          <p className={`${s.cls} text-2xl text-foreground`}>{SPECIMEN_TEXT}</p>
        </div>
      ))}
    </div>
  );
}

/** Size scale from typography.md, rendered at real size via the Tailwind token classes. */
const textSizes = [
  { token: 'text/xs', cls: 'text-xs', size: 12, lh: 16, usage: 'Captions, badges, fine print' },
  { token: 'text/sm', cls: 'text-sm', size: 14, lh: 20, usage: 'Helper text, secondary labels' },
  { token: 'text/base', cls: 'text-base', size: 16, lh: 24, usage: 'Body text (default)' },
  { token: 'text/lg', cls: 'text-lg', size: 18, lh: 28, usage: 'Emphasized body, subheads' },
  { token: 'text/xl', cls: 'text-xl', size: 20, lh: 28, usage: 'Small headings, card titles' },
  { token: 'text/2xl', cls: 'text-2xl', size: 24, lh: 32, usage: 'Section subheadings' },
  { token: 'text/3xl', cls: 'text-3xl', size: 30, lh: 36, usage: 'Section headings' },
  { token: 'text/4xl', cls: 'text-4xl', size: 36, lh: 40, usage: 'Page headings' },
  { token: 'text/5xl', cls: 'text-5xl', size: 48, lh: 48, usage: 'Hero headings' },
  { token: 'text/6xl', cls: 'text-6xl', size: 60, lh: 60, usage: 'Display text' },
  { token: 'text/7xl', cls: 'text-7xl', size: 72, lh: 72, usage: 'Large display' },
  { token: 'text/8xl', cls: 'text-8xl', size: 96, lh: 96, usage: 'Extra-large display' },
  { token: 'text/9xl', cls: 'text-9xl', size: 128, lh: 128, usage: 'Maximum display' },
];

export function TextSizeScale() {
  return (
    <div className="sb-unstyled flex flex-col gap-2 font-sans">
      {textSizes.map((t) => (
        <div key={t.token} className="rounded-lg border border-border bg-card p-4">
          <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <code className="text-sm font-medium text-foreground">{t.cls}</code>
            <span className="text-xs text-muted-foreground">
              {t.size}px / line-height {t.lh}px
            </span>
            <span className="text-xs text-muted-foreground">{t.usage}</span>
          </div>
          <p className={`${t.cls} overflow-hidden text-ellipsis whitespace-nowrap text-foreground`}>
            Compass
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * Weight tokens from typography.md — Compass ships 300–700 (light through bold),
 * the range the self-hosted Euclid faces in app/fonts.css cover.
 */
const fontWeights = [
  { token: 'font-weight/light', cls: 'font-light', value: 300, usage: 'Large display text' },
  { token: 'font-weight/normal', cls: 'font-normal', value: 400, usage: 'Body text (default)' },
  { token: 'font-weight/medium', cls: 'font-medium', value: 500, usage: 'Labels, navigation items' },
  { token: 'font-weight/semibold', cls: 'font-semibold', value: 600, usage: 'Headings, buttons, emphasis' },
  { token: 'font-weight/bold', cls: 'font-bold', value: 700, usage: 'Strong emphasis' },
];

export function FontWeightScale() {
  return (
    <div className="sb-unstyled flex flex-col gap-2 font-sans">
      {fontWeights.map((w) => (
        <div key={w.token} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 rounded-lg border border-border bg-card px-4 py-3">
          <code className="w-32 shrink-0 text-sm font-medium text-foreground">{w.cls}</code>
          <span className="w-10 shrink-0 text-xs text-muted-foreground">{w.value}</span>
          <span className={`${w.cls} text-xl text-foreground`}>Euclid Circular B</span>
          <span className="text-xs text-muted-foreground">{w.usage}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Heading presets from typography.md (Custom collection). Rendered with the
 * spec's responsive Tailwind equivalents: mobile size at base, desktop at md:.
 */
const headingPresets = [
  {
    preset: 'heading-xl',
    cls: 'text-5xl md:text-6xl font-semibold tracking-tighter',
    desktop: 'size 60px / weight 600 / lh 60px / ls -1.5',
    mobile: 'size 48px / weight 600 / lh 48px / ls -1.2',
  },
  {
    preset: 'heading-lg',
    cls: 'text-4xl md:text-5xl font-semibold tracking-tighter',
    desktop: 'size 48px / weight 600 / lh 48px / ls -1.2',
    mobile: 'size 36px / weight 600 / lh 40px / ls -0.9',
  },
  {
    preset: 'heading-md',
    cls: 'text-3xl md:text-4xl font-semibold tracking-tight',
    desktop: 'size 36px / weight 600 / lh 40px / ls -0.9',
    mobile: 'size 30px / weight 600 / lh 36px / ls -0.75',
  },
  {
    preset: 'heading-sm',
    cls: 'text-xl md:text-2xl font-semibold tracking-tight',
    desktop: 'size 24px / weight 600 / lh 32px / ls -0.6',
    mobile: 'size 20px / weight 600 / lh 28px / ls -0.5',
  },
];

export function HeadingPresets() {
  return (
    <div className="sb-unstyled flex flex-col gap-2 font-sans">
      {headingPresets.map((h) => (
        <div key={h.preset} className="rounded-lg border border-border bg-card p-4">
          <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <code className="text-sm font-medium text-foreground">{h.preset}</code>
            <span className="text-xs text-muted-foreground">desktop {h.desktop}</span>
            <span className="text-xs text-muted-foreground">mobile {h.mobile}</span>
          </div>
          <code className="mb-2 block text-xs text-muted-foreground">{h.cls}</code>
          <p className={`${h.cls} text-foreground`}>Compass heading</p>
        </div>
      ))}
    </div>
  );
}
