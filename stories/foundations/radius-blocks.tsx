/**
 * Radius foundation — rendering blocks.
 *
 * Corner rounding on each tile comes from the live `--radius-*` variables in
 * `@acko/enterprise-tokens` via the Tailwind `rounded-*` token classes —
 * no radius value is hand-typed.
 *
 * Scale, special values, and component mappings come from
 * `.claude/specs/foundations/radius.md`.
 */

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const radiusScale = [
  { token: 'radius/xs', cls: 'rounded-xs', px: 2, usage: 'Subtle rounding (tags, inline badges)' },
  { token: 'radius/sm', cls: 'rounded-sm', px: 4, usage: 'Small elements (checkboxes, small chips)' },
  { token: 'radius/md', cls: 'rounded-md', px: 6, usage: 'Default component radius (inputs, buttons)' },
  { token: 'radius/lg', cls: 'rounded-lg', px: 8, usage: 'Cards, dropdowns, dialogs' },
  { token: 'radius/xl', cls: 'rounded-xl', px: 12, usage: 'Large cards, prominent containers' },
  { token: 'radius/2xl', cls: 'rounded-2xl', px: 16, usage: 'Hero cards, large modals' },
  { token: 'radius/3xl', cls: 'rounded-3xl', px: 20, usage: 'Feature sections' },
  { token: 'radius/4xl', cls: 'rounded-4xl', px: 24, usage: 'Maximum decorative rounding' },
];

const specialRadius = [
  { token: 'rounded-none', cls: 'rounded-none', label: '0', usage: 'No rounding (tables, full-bleed sections)' },
  { token: 'rounded-full', cls: 'rounded-full', label: '9999px', usage: 'Circles, pills, avatar containers' },
];

export function RadiusScale() {
  return (
    <div className="sb-unstyled grid grid-cols-2 gap-4 font-sans sm:grid-cols-3 md:grid-cols-4">
      {radiusScale.map((r) => (
        <div key={r.token} className="flex flex-col items-start gap-2">
          <div className={`${r.cls} size-20 border-2 border-primary bg-muted`} />
          <div>
            <code className="block text-sm font-medium text-foreground">{r.cls}</code>
            <span className="block text-xs text-muted-foreground">
              var(--{r.cls.replace('rounded', 'radius')}) — {r.px}px
            </span>
            <span className="block text-xs text-muted-foreground">{r.usage}</span>
          </div>
        </div>
      ))}
      {specialRadius.map((r) => (
        <div key={r.token} className="flex flex-col items-start gap-2">
          <div className={`${r.cls} size-20 border-2 border-primary bg-muted`} />
          <div>
            <code className="block text-sm font-medium text-foreground">{r.cls}</code>
            <span className="block text-xs text-muted-foreground">{r.label}</span>
            <span className="block text-xs text-muted-foreground">{r.usage}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Common component mappings — table from radius.md. */
const componentMappings = [
  { component: 'Button', radius: '6px', token: 'rounded-md' },
  { component: 'Input / Select / Textarea', radius: '6px', token: 'rounded-md' },
  { component: 'Card', radius: '8px', token: 'rounded-lg' },
  { component: 'Dialog / Sheet', radius: '8–12px', token: 'rounded-lg or rounded-xl' },
  { component: 'Dropdown menu', radius: '8px', token: 'rounded-lg' },
  { component: 'Tooltip', radius: '6px', token: 'rounded-md' },
  { component: 'Badge / Tag', radius: '4px', token: 'rounded-sm' },
  { component: 'Avatar', radius: '9999px', token: 'rounded-full' },
  { component: 'Checkbox', radius: '4px', token: 'rounded-sm' },
  { component: 'Switch (track)', radius: '9999px', token: 'rounded-full' },
];

export function ComponentRadiusTable() {
  return (
    <div className="sb-unstyled font-sans">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Component</TableHead>
            <TableHead>Recommended radius</TableHead>
            <TableHead>Token</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {componentMappings.map((m) => (
            <TableRow key={m.component}>
              <TableCell className="text-foreground">{m.component}</TableCell>
              <TableCell className="text-foreground">{m.radius}</TableCell>
              <TableCell><code className="text-foreground">{m.token}</code></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
