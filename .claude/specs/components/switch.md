# Switch — Compass Component Spec

> **Purpose:** This file is the complete specification for the Switch component.
> LLMs must follow this spec exactly when generating toggle switches.
> It overrides any general foundation spec where they conflict.

---

## Component location

```
Import: import { Switch } from "@/components/ui/switch"

File: components/ui/switch.tsx
```

---

## When to use Switch vs Checkbox

| Situation | Use |
|-----------|-----|
| A setting that takes effect **immediately** on toggle (no Save needed) | `Switch` |
| A preference in a form that applies **on submit** | `Checkbox` |
| Enabling/disabling a feature ("Dark mode", "Email alerts") | `Switch` |
| Selecting/deselecting an option in a multi-select list | `Checkbox` |
| "Terms & conditions" consent | `Checkbox` |
| A binary state where the visual affordance should feel like a physical toggle | `Switch` |

**The decisive rule:** If toggling it should immediately change something in the
app (no form submit), use `Switch`. If it's a form field that's confirmed when
the user clicks Save/Continue, use `Checkbox`.

---

## Anatomy

Switch is a single component. It renders:
- `SwitchPrimitive.Root` — the track (pill-shaped background)
- `SwitchPrimitive.Thumb` — the circular handle that slides

No sub-components to import separately.

---

## Sizes

| Size | Prop | Track dimensions | Thumb size |
|------|------|-----------------|-----------|
| Default | `size="default"` (default) | 32px × 18.4px | 16px circle |
| Small | `size="sm"` | 24px × 14px | 12px circle |

```tsx
<Switch />                    // default (32px wide)
<Switch size="sm" />          // small (24px wide)
```

---

## Default styling

| State | Track color | Thumb color |
|-------|------------|-------------|
| Off (unchecked) | `bg-input` | `bg-background` |
| On (checked) | `bg-primary` | `bg-background` |
| Disabled | `opacity-50 cursor-not-allowed` | — |
| Error | `border-destructive ring-destructive/20` | — |
| Focus | `ring-3 ring-ring/50` | — |

---

## Common patterns

### Switch with Label (standard)

```tsx
<div className="flex items-center gap-2">
  <Switch id="dark-mode" />
  <Label htmlFor="dark-mode">Dark mode</Label>
</div>
```

### Switch in a horizontal Field (settings page pattern)

```tsx
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"

<Field orientation="horizontal">
  <div className="flex flex-col gap-0.5">
    <FieldLabel htmlFor="email-alerts">Email alerts</FieldLabel>
    <FieldDescription>Receive policy updates by email.</FieldDescription>
  </div>
  <Switch id="email-alerts" />
</Field>
```

### Settings list with multiple switches

```tsx
<div className="flex flex-col divide-y">
  <Field orientation="horizontal" className="py-4">
    <div className="flex flex-col gap-0.5">
      <FieldLabel htmlFor="push-notif">Push notifications</FieldLabel>
      <FieldDescription>Alerts on your mobile device.</FieldDescription>
    </div>
    <Switch id="push-notif" defaultChecked />
  </Field>
  <Field orientation="horizontal" className="py-4">
    <div className="flex flex-col gap-0.5">
      <FieldLabel htmlFor="sms-notif">SMS notifications</FieldLabel>
      <FieldDescription>Text messages for important updates.</FieldDescription>
    </div>
    <Switch id="sms-notif" />
  </Field>
  <Field orientation="horizontal" className="py-4">
    <div className="flex flex-col gap-0.5">
      <FieldLabel htmlFor="marketing">Marketing emails</FieldLabel>
      <FieldDescription>Tips, offers, and news from Acko.</FieldDescription>
    </div>
    <Switch id="marketing" />
  </Field>
</div>
```

### Controlled switch

```tsx
const [enabled, setEnabled] = React.useState(false)

<div className="flex items-center gap-2">
  <Switch
    id="auto-renew"
    checked={enabled}
    onCheckedChange={setEnabled}
  />
  <Label htmlFor="auto-renew">Auto-renew policy</Label>
</div>
```

### Disabled switch

```tsx
<div className="flex items-center gap-2">
  <Switch id="feature-flag" disabled />
  <Label htmlFor="feature-flag" className="opacity-50">
    Advanced analytics (coming soon)
  </Label>
</div>
```

### Small switch (compact UI)

```tsx
<div className="flex items-center gap-2">
  <Switch id="compact" size="sm" />
  <Label htmlFor="compact" className="text-xs">Show preview</Label>
</div>
```

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Pill-shaped toggle, off (gray track) | `<Switch />` |
| Pill-shaped toggle, on (purple track) | `<Switch defaultChecked />` |
| Toggle with label to the right | `Switch` + `Label` in `flex items-center gap-2` |
| Toggle with label above and description | `Field orientation="horizontal"` pattern |
| Small/compact toggle | `<Switch size="sm" />` |
| Disabled toggle | `<Switch disabled>` |
| Square checkbox shape | Use `Checkbox`, not Switch |

---

## Rules for LLMs

1. **Always pair Switch with Label via `htmlFor`/`id`.**
   A switch without a label is inaccessible:
   ```tsx
   // ✅ CORRECT
   <Switch id="dark-mode" />
   <Label htmlFor="dark-mode">Dark mode</Label>

   // ❌ WRONG — no label, not accessible
   <Switch />
   ```

2. **Use `onCheckedChange`, not `onChange`.** Switch uses the Base UI API:
   ```tsx
   // ✅ CORRECT
   <Switch onCheckedChange={(checked) => setEnabled(checked)} />

   // ❌ WRONG — native onChange is not the right prop
   <Switch onChange={(e) => setEnabled(e.target.checked)} />
   ```

3. **Switch is for immediate-effect toggles.** If the state only applies
   after a form submit, use `Checkbox`. See the decision table above.

4. **Disabled Label needs `opacity-50` manually** when not inside a
   `Field`. The automatic `group-has-disabled/field:opacity-50` only
   works when Switch is inside a `Field` component.

5. **Do not use `Switch` where Figma shows a checkbox.** If the Figma
   component is square, use `Checkbox`. If it's pill-shaped, use `Switch`.

6. **`size="sm"` is for dense/compact layouts only.** Default size is
   appropriate in most contexts. Use `sm` only when space is genuinely
   constrained (e.g., table rows, toolbars).

7. **Do not add `w-` or `h-` classes to Switch.** The dimensions are
   controlled by the `size` prop via CSS data attributes. Overriding
   with utility classes breaks the thumb animation.
