/**
 * Spacing foundation — rendering blocks.
 *
 * Bars are sized with the Tailwind spacing/container utility classes
 * themselves (`w-4`, `w-3xs`, …), so what you see is the live token value
 * from the Tailwind v4 theme — nothing is hand-measured.
 *
 * Scale, container sizes, breakpoints, and responsive tokens come from
 * `.claude/specs/foundations/spacing.md`.
 */

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const spacingScale = [
  { token: 'spacing/0', cls: 'w-0', px: 0 },
  { token: 'spacing/px', cls: 'w-px', px: 1 },
  { token: 'spacing/0.5', cls: 'w-0.5', px: 2 },
  { token: 'spacing/1', cls: 'w-1', px: 4 },
  { token: 'spacing/1.5', cls: 'w-1.5', px: 6 },
  { token: 'spacing/2', cls: 'w-2', px: 8 },
  { token: 'spacing/2.5', cls: 'w-2.5', px: 10 },
  { token: 'spacing/3', cls: 'w-3', px: 12 },
  { token: 'spacing/3.5', cls: 'w-3.5', px: 14 },
  { token: 'spacing/4', cls: 'w-4', px: 16 },
  { token: 'spacing/5', cls: 'w-5', px: 20 },
  { token: 'spacing/6', cls: 'w-6', px: 24 },
  { token: 'spacing/7', cls: 'w-7', px: 28 },
  { token: 'spacing/8', cls: 'w-8', px: 32 },
  { token: 'spacing/9', cls: 'w-9', px: 36 },
  { token: 'spacing/10', cls: 'w-10', px: 40 },
  { token: 'spacing/11', cls: 'w-11', px: 44 },
  { token: 'spacing/12', cls: 'w-12', px: 48 },
  { token: 'spacing/14', cls: 'w-14', px: 56 },
  { token: 'spacing/16', cls: 'w-16', px: 64 },
  { token: 'spacing/20', cls: 'w-20', px: 80 },
  { token: 'spacing/24', cls: 'w-24', px: 96 },
  { token: 'spacing/28', cls: 'w-28', px: 112 },
  { token: 'spacing/32', cls: 'w-32', px: 128 },
  { token: 'spacing/36', cls: 'w-36', px: 144 },
  { token: 'spacing/40', cls: 'w-40', px: 160 },
  { token: 'spacing/44', cls: 'w-44', px: 176 },
  { token: 'spacing/48', cls: 'w-48', px: 192 },
  { token: 'spacing/52', cls: 'w-52', px: 208 },
  { token: 'spacing/56', cls: 'w-56', px: 224 },
  { token: 'spacing/60', cls: 'w-60', px: 240 },
  { token: 'spacing/64', cls: 'w-64', px: 256 },
  { token: 'spacing/72', cls: 'w-72', px: 288 },
  { token: 'spacing/80', cls: 'w-80', px: 320 },
  { token: 'spacing/96', cls: 'w-96', px: 384 },
];

export function SpacingScale() {
  return (
    <div className="sb-unstyled flex flex-col gap-1 font-sans">
      {spacingScale.map((s) => (
        <div key={s.token} className="flex items-center gap-4 py-1">
          <code className="w-24 shrink-0 text-sm text-foreground">{s.cls.slice(2)}</code>
          <span className="w-14 shrink-0 text-xs text-muted-foreground">{s.px}px</span>
          <div className={`${s.cls} h-4 max-w-full shrink-0 rounded-xs bg-primary`} />
        </div>
      ))}
    </div>
  );
}

/** Container size tokens (Theme collection) rendered via live w-* container utilities. */
const containerSizes = [
  { token: 'container/3xs', cls: 'w-3xs', px: 256, usage: 'Tiny panels, tooltips' },
  { token: 'container/2xs', cls: 'w-2xs', px: 288, usage: 'Small dialogs' },
  { token: 'container/xs', cls: 'w-xs', px: 320, usage: 'Narrow sidebars, mobile content' },
  { token: 'container/sm', cls: 'w-sm', px: 384, usage: 'Compact content areas' },
  { token: 'container/md', cls: 'w-md', px: 448, usage: 'Medium panels' },
  { token: 'container/lg', cls: 'w-lg', px: 512, usage: 'Standard content columns' },
  { token: 'container/xl', cls: 'w-xl', px: 576, usage: 'Wide content columns' },
  { token: 'container/2xl', cls: 'w-2xl', px: 672, usage: 'Two-column content' },
  { token: 'container/3xl', cls: 'w-3xl', px: 768, usage: 'Tablet-width content' },
  { token: 'container/4xl', cls: 'w-4xl', px: 896, usage: 'Desktop content' },
  { token: 'container/5xl', cls: 'w-5xl', px: 1024, usage: 'Wide desktop content' },
  { token: 'container/6xl', cls: 'w-6xl', px: 1152, usage: 'Full-width sections' },
  { token: 'container/7xl', cls: 'w-7xl', px: 1280, usage: 'Max content width' },
];

export function ContainerSizes() {
  return (
    <div className="sb-unstyled flex flex-col gap-1 font-sans">
      {containerSizes.map((c) => (
        <div key={c.token} className="py-1">
          <div className="mb-1 flex flex-wrap items-baseline gap-x-3">
            <code className="text-sm text-foreground">{c.token}</code>
            <span className="text-xs text-muted-foreground">
              {c.px}px — {c.usage}
            </span>
          </div>
          <div className={`${c.cls} h-3 max-w-full rounded-xs bg-primary`} />
        </div>
      ))}
    </div>
  );
}

/** Responsive layout tokens (Custom collection) — table data from spacing.md. */
const responsiveTokens = [
  { token: 'container-padding-x', desktop: 'spacing/6 (24px)', mobile: 'spacing/4 (16px)', usage: 'Horizontal page padding' },
  { token: 'section-padding-y', desktop: 'spacing/24 (96px)', mobile: 'spacing/16 (64px)', usage: 'Vertical section spacing' },
  { token: 'section-title-gap-xl', desktop: 'spacing/6 (24px)', mobile: 'spacing/5 (20px)', usage: 'Gap below XL section titles' },
  { token: 'section-title-gap-lg', desktop: 'spacing/5 (20px)', mobile: 'spacing/4 (16px)', usage: 'Gap below LG section titles' },
  { token: 'section-title-gap-md', desktop: 'spacing/5 (20px)', mobile: 'spacing/4 (16px)', usage: 'Gap below MD section titles' },
  { token: 'section-title-gap-sm', desktop: 'spacing/4 (16px)', mobile: 'spacing/3 (12px)', usage: 'Gap below SM section titles' },
];

const breakpoints = [
  { token: 'breakpoint/sm', px: 640, usage: 'Mobile landscape' },
  { token: 'breakpoint/md', px: 768, usage: 'Tablet' },
  { token: 'breakpoint/lg', px: 1024, usage: 'Desktop' },
  { token: 'breakpoint/xl', px: 1280, usage: 'Wide desktop' },
  { token: 'breakpoint/2xl', px: 1536, usage: 'Ultra-wide' },
];

export function ResponsiveTokensTable() {
  return (
    <div className="sb-unstyled font-sans">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Token</TableHead>
            <TableHead>Desktop</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Usage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {responsiveTokens.map((r) => (
            <TableRow key={r.token}>
              <TableCell><code className="text-foreground">{r.token}</code></TableCell>
              <TableCell className="text-foreground">{r.desktop}</TableCell>
              <TableCell className="text-foreground">{r.mobile}</TableCell>
              <TableCell className="text-muted-foreground">{r.usage}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function BreakpointsTable() {
  return (
    <div className="sb-unstyled font-sans">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Token</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Usage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {breakpoints.map((b) => (
            <TableRow key={b.token}>
              <TableCell><code className="text-foreground">{b.token}</code></TableCell>
              <TableCell className="text-foreground">{b.px}px</TableCell>
              <TableCell className="text-muted-foreground">{b.usage}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
