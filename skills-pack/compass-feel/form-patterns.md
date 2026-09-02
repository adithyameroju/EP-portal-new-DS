# Compass Feel — Form patterns

> How Compass forms behave: every input labeled, Field for validation, one primary button, no reinvented primitives.

## Fields

- Use the `Field` system when you need error messages or description text; use standalone `Label` + `Input` for simple 2–3 field card forms. <!-- components/field.md -->
- `FieldLabel`'s `htmlFor` must match the input's `id` — no unbound labels. <!-- components/field.md -->
- `FieldError` is safe to always render; it shows nothing when errors is empty. <!-- components/field.md -->
- Wrap checkbox/radio groups in `FieldSet` + `FieldLegend` — a plain div with a heading is an a11y violation. <!-- components/field.md -->
- Put `FieldContent` (with `FieldTitle` + `FieldDescription`) inside a `Field` for checkbox/radio items — not a manual div. <!-- components/field.md -->
- Don't nest `FieldGroup` inside `FieldGroup`. One level of grouping is enough. <!-- components/field.md -->

## Inputs

- Every Input has a Label — visible `<Label>` or `aria-label`. No exceptions. <!-- components/input.md -->
- `htmlFor` on Label must match `id` on Input — accessibility, not style. <!-- components/input.md -->
- Placeholder is not a label; it supplements, never replaces. <!-- components/input.md -->
- Use the correct `type` (`email`, `tel`, `number`, …) — it drives mobile keyboard and validation. <!-- components/input.md -->
- Never modify `input.tsx`; compose icons/prefixes/suffixes by wrapping externally. <!-- components/input.md -->
- Error state = `border-destructive` + a message. Not a red background, not a custom error prop. <!-- components/input.md -->
- Textarea for multi-line; don't fake it by setting `rows` on Input. <!-- components/input.md -->

## Labels

- Always import `Label` from `@/components/ui/label`; never use raw `<label>`. <!-- components/label.md -->
- Don't re-add `text-sm` or `font-medium` to Label — already applied. It has no size variants. <!-- components/label.md -->
- Inside a Field, don't add `opacity-50`; the Field context dims automatically. <!-- components/label.md -->

## Buttons in forms

- One primary (`variant="default"`) button per form/card/dialog; the rest are secondary/outline/ghost. <!-- components/button.md -->
- Loading = children composition + `disabled` (`<Button disabled><Loader2 className="animate-spin"/> Saving...</Button>`). Never invent a `loading` prop. <!-- components/button.md -->
- Icon-only buttons need `size="icon"` and an `aria-label`. <!-- components/button.md -->
- Navigation uses `render={<Link href="..." />}`, not `onClick` + `router.push()`, and not `asChild`. <!-- components/button.md -->
- Don't override Button's built-in styles with className to make it "look like text" — pick `link` or `ghost` instead. <!-- components/button.md -->
