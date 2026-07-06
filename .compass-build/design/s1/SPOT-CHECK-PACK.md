# S1 Spot-Check Pack — self-contained review (v2)

**How to read:** every `antiPatterns` and `confusedWith` entry from the 8
selected meta files is shown as a stack — CLAIM (what the meta asserts),
CITATION (the exact verbatim spec text), SOURCE (file:line). Verify the
citation supports the claim; you never need to open another file. Entries the
extractors could not support would read "UNCITED — flagged" — **there are none:
65/65 entries cited.** Four entries carry a NOTE where part of the supporting
text lives at a second spec location (an honest cross-reference, not a failure).

Extraction was done by four fresh agents independent of the ones that generated
the meta. No meta files were changed in producing this document.

| Component | antiPatterns | confusedWith | UNCITED |
|---|---|---|---|
| button | 9 | 0 (none in meta) | 0 |
| card | 10 | 0 (none in meta) | 0 |
| checkbox | 6 | 2 | 0 |
| dialog | 6 | 1 | 0 |
| drawer | 5 | 1 | 0 |
| combobox | 5 | 1 | 0 |
| sidebar | 7 | 1 | 0 |
| alert | 7 | 4 | 0 |

---

## button

### antiPatterns

#### antiPatterns 1
CLAIM: Invent a loading prop on Button (e.g. loading={true}) to show a spinner → Use children composition with the disabled prop: Button disabled wrapping a Loader2 icon with animate-spin plus the label (e.g. 'Saving...'); Button has no loading prop
CITATION:
> **Decision: Use children composition, not a loading prop.**
> ```tsx
> // CORRECT — loading via children composition
> <Button disabled>
>   <Loader2 className="animate-spin" />
>   Saving...
> </Button>
> // WRONG — inventing a loading prop that doesn't exist
> <Button loading={true}>Save</Button>
> ```

SOURCE: .claude/specs/components/button.md:84-95

#### antiPatterns 2
CLAIM: Show a loading spinner without also setting the disabled prop → Always pair the loading spinner with disabled to prevent double-clicks during loading
CITATION:
> **Rules for loading state:**
> 1. Always pair loading spinner with `disabled` prop

SOURCE: .claude/specs/components/button.md:103-104
NOTE: the "prevents double-clicks during loading" rationale appears in the same section at .claude/specs/components/button.md:97-100 ("the `disabled` prop prevents double-clicks during loading").

#### antiPatterns 3
CLAIM: Use multiple default (primary) variant buttons in the same card, form, or dialog → One primary button per visible area; other actions use secondary, outline, or ghost
CITATION:
> 1. **One default (primary) button per visible area.** Multiple primary buttons
>    in the same card/form/dialog is always wrong.

SOURCE: .claude/specs/components/button.md:207-208

#### antiPatterns 4
CLAIM: Create a custom button component or a raw button element with hand-written styles → All buttons use the Button component from components/ui/button
CITATION:
> 2. **Never create a custom button component.** All buttons use `@/components/ui/button`.
>    No `<button className="...">` with hand-written styles.

SOURCE: .claude/specs/components/button.md:209-210

#### antiPatterns 5
CLAIM: Render an icon-only button without an accessible label → Icon-only buttons must use size=icon and include an aria-label every time
CITATION:
> 4. **Icon-only buttons need `aria-label`.** Every time.

SOURCE: .claude/specs/components/button.md:212
NOTE: meta cites #rules-for-llms, which supports the aria-label requirement; the `size="icon"` requirement is stated at .claude/specs/components/button.md:123 ("Icon-only buttons MUST have `size="icon"` and should include an accessible label via `aria-label`").

#### antiPatterns 6
CLAIM: Navigate with onClick plus router.push, or compose links via asChild → Use render={<Link href=... />} for navigation; asChild is the Radix pattern and this repo uses Base UI
CITATION:
> 5. **Navigation = `render={<Link href="..." />}`.** Not `onClick` + `router.push()`, and not `asChild` (that's Radix — this repo uses Base UI).

SOURCE: .claude/specs/components/button.md:213

#### antiPatterns 7
CLAIM: Create a 'pressed' state prop or variant → Pressed/active is handled automatically by the CSS active pseudo-class; hover and focus are also automatic
CITATION:
> 6. **Pressed/active is CSS.** Do not create a "pressed" state prop or variant.

SOURCE: .claude/specs/components/button.md:214
NOTE: meta cites #rules-for-llms, which supports the pressed/active claim; the "hover and focus are also automatic" portion is supported at .claude/specs/components/button.md:67-69 (States handled automatically by CSS table: Hover `:hover` pseudo-class, Focused `:focus-visible` pseudo-class).

#### antiPatterns 8
CLAIM: Override Button's built-in styles with className (custom hover classes, or structural overrides like h-auto, p-0, shadow-none to make a button look like text) → Choose the right variant (link or ghost) instead of fighting the variant's defaults; only layout utilities (w-full, shrink-0, mt-2) that don't override visual token properties are acceptable
CITATION:
> 7. **Do not override Button's built-in styles with className.** This means:
>    - No `hover:bg-transparent`, `hover:bg-*`, or any other custom `hover:` class
>    - No structural overrides like `h-auto`, `p-0`, `shadow-none` to make a button "look like text"
>    - If a button needs to look like text, choose the right variant (`link` or `ghost`) — do not fight the variant's defaults
>    - The only acceptable className additions are layout utilities (`w-full`, `shrink-0`, `mt-2`) that don't override visual token properties

SOURCE: .claude/specs/components/button.md:215-219

#### antiPatterns 9
CLAIM: Add manual mr-2 or ml-2 spacing between a button's icon and text → The gap between icon and text is handled by the button's built-in flex gap
CITATION:
> - Gap between icon and text is handled by the button's flex gap (built into shadcn) — do not add manual `mr-2` or `ml-2`

SOURCE: .claude/specs/components/button.md:122

### confusedWith — none in meta

---

## card

### antiPatterns

#### antiPatterns 1
CLAIM: Put heading or subtitle text in manual divs inside CardHeader → Use CardTitle for heading text and CardDescription for subtitle text — using CardHeader alone is not enough; this is the most common structural drift
CITATION:
> 1. **Use ALL composite sub-components.** CardHeader, CardTitle, CardContent,
>    CardFooter — not manual divs. Using `CardHeader` is not enough — you must
>    also use `CardTitle` inside it for heading text and `CardDescription` for
>    subtitle text. … This is the most common structural drift.

SOURCE: .claude/specs/components/card.md:255-276

#### antiPatterns 2
CLAIM: Recreate Card from scratch with a div carrying rounded, ring, and card background classes → Import and use the Card component from components/ui/card
CITATION:
> 3. **Do not recreate Card from scratch.** No `<div className="rounded-xl ring-1 bg-card ...">`.
>    Import and use the Card component.

SOURCE: .claude/specs/components/card.md:280-281

#### antiPatterns 3
CLAIM: Add border classes or a shadow to Card when Figma doesn't explicitly show them → The built-in subtle foreground ring IS the card's visual border — adding border classes creates a double frame; Card has no default shadow, so only add one if the Figma frame clearly shows elevation and note it in 'What I assumed'
CITATION:
> 4. **Do not add `border` or `shadow` to Card unless Figma explicitly shows them.**
>    The `ring-1 ring-foreground/10` IS the card's visual border — do not add
>    `border border-border` on top. Only add a shadow class if the Figma frame
>    clearly shows elevation. Note it in "What I assumed."

SOURCE: .claude/specs/components/card.md:283-286
NOTE: the "double frame" wording is supported at .claude/specs/components/card.md:75-77 ("Adding an explicit `border` on top creates a visible double frame"), in the Default styling tokens section rather than #rules-for-llms.

#### antiPatterns 4
CLAIM: Use multiple CardTitle elements in one card → One CardTitle per card; additional headings use text-lg font-semibold styling instead
CITATION:
> 5. **One CardTitle per card.** If you need multiple headings inside a card,
>    use `text-lg font-semibold` on additional headings, not multiple CardTitle.

SOURCE: .claude/specs/components/card.md:288-289

#### antiPatterns 5
CLAIM: Add explicit padding to CardHeader, CardContent, or CardFooter → Padding is built in — sub-components already have horizontal padding and Card itself has vertical padding
CITATION:
> 7. **Card padding is built in.** Do not add explicit padding to CardHeader,
>    CardContent, or CardFooter — they already have `px-4`. Card itself has `py-4`.

SOURCE: .claude/specs/components/card.md:294-295

#### antiPatterns 6
CLAIM: Use bg-background on a card surface → Cards use bg-card — the correct semantic token for elevated surfaces, even if both look identical in light mode
CITATION:
> 8. **Cards use `bg-card`, not `bg-background`.** Even though both may be white
>    in light mode, `bg-card` is the correct semantic token for elevated surfaces.

SOURCE: .claude/specs/components/card.md:297-298

#### antiPatterns 7
CLAIM: Nest a Card component inside another Card → The inner element is a div with bg-muted rounded-md p-4, not another Card component
CITATION:
> 9. **No nested cards.** If Figma shows a card inside a card, the inner element
>    is a `div` with `bg-muted rounded-md p-4`, not another Card component.

SOURCE: .claude/specs/components/card.md:300-301

#### antiPatterns 8
CLAIM: Place CardAction outside CardHeader, or after CardDescription in the DOM → CardAction only works inside CardHeader, and the DOM order must be CardTitle, then CardAction, then CardDescription for the CSS grid to position it correctly
CITATION:
> **Rules for CardAction:**
> - Only place `CardAction` inside `CardHeader` — it has no effect elsewhere.
> - The DOM order must be: `CardTitle` → `CardAction` → `CardDescription`.
>   This is required for the CSS grid to position `CardAction` correctly.

SOURCE: .claude/specs/components/card.md:166-169

#### antiPatterns 9
CLAIM: Use margin on individual cards to space a card list or grid → Use gap on the wrapper: gap-4 for compact lists, gap-6 for spacious grids
CITATION:
> **Spacing between cards:** Use `gap-4` (16px) for compact lists, `gap-6` (24px)
> for spacious grids. Do not use margin on individual cards.

SOURCE: .claude/specs/components/card.md:209-210

#### antiPatterns 10
CLAIM: Style interactive cards with a shadow hover effect or transition-all → Use hover:bg-accent with cursor-pointer and transition-colors for clickable cards
CITATION:
> - Add `hover:bg-accent` for hover state (not `hover:shadow-md`)
> - Add `cursor-pointer` to indicate clickability
> - If wrapping in a `<Link>`, use the link on the Card itself or a single
>   wrapping anchor, not nested links inside
> - Add `transition-colors` for smooth hover — not `transition-all`

SOURCE: .claude/specs/components/card.md:228-232

### confusedWith — none in meta

---

## checkbox

### antiPatterns

#### antiPatterns 1
CLAIM: Render a Checkbox without a Label → Always pair Checkbox with a Label connected via matching id and htmlFor — an unlabeled checkbox is inaccessible
CITATION:
> **Always pair Checkbox with Label via `htmlFor`/`id`.** A checkbox without a label is inaccessible

SOURCE: .claude/specs/components/checkbox.md:184-185

#### antiPatterns 2
CLAIM: Group related checkboxes in a plain div with a heading → Three or more related checkboxes belong in FieldSet with FieldLegend (a real fieldset/legend); a div with a heading is not semantically correct
CITATION:
> **Use `FieldSet` + `FieldLegend` for checkbox groups.** Three or more related checkboxes should be inside a `<fieldset>` with a `<legend>`. A `<div>` with a heading is not semantically correct.

SOURCE: .claude/specs/components/checkbox.md:195-197

#### antiPatterns 3
CLAIM: Resize the checkbox with size-5, size-6, or width/height className overrides → The checkbox is a fixed size-4 (16 by 16 pixels) with no size variants — never resize it
CITATION:
> **Checkbox is 16px — do not resize it.** `size-4` is fixed. Never add `size-5`, `size-6`, or `w-5 h-5` className overrides.

SOURCE: .claude/specs/components/checkbox.md:199-200

#### antiPatterns 4
CLAIM: Expect the Label to dim automatically when a standalone Checkbox is disabled → Add className opacity-50 to the Label manually in the standalone checkbox + label pattern; auto-dimming only happens inside a disabled Field
CITATION:
> **Disabled Label needs `opacity-50` manually.** When the checkbox is `disabled`, the label does not automatically dim unless it's inside a `Field` with `group-has-disabled/field:opacity-50`. Add `className="opacity-50"` to the Label when using standalone checkbox + label pattern.

SOURCE: .claude/specs/components/checkbox.md:202-205

#### antiPatterns 5
CLAIM: Handle changes with the native onChange prop → Use onCheckedChange — Checkbox uses the Base UI API, not the native change event
CITATION:
> **Use `onCheckedChange`, not `onChange`.** Checkbox uses the Base UI API — the prop is `onCheckedChange`, not the native `onChange`.

SOURCE: .claude/specs/components/checkbox.md:207-208

#### antiPatterns 6
CLAIM: Substitute Checkbox for Switch (or vice versa) when Figma shows the other → If Figma shows a toggle/switch shape use Switch; if it shows a square checkbox use Checkbox — never swap them
CITATION:
> **Checkbox vs Switch — never substitute one for the other.** If Figma shows a toggle/switch shape, use `Switch`. If it shows a square checkbox, use `Checkbox`. Do not use either where the other is shown.

SOURCE: .claude/specs/components/checkbox.md:210-212

### confusedWith

#### confusedWith 1
CLAIM: switch: Checkbox marks a preference that takes effect when the form is submitted; Switch applies the change instantly with no form submission
CITATION:
> **The key distinction between Checkbox and Switch:**
> - `Checkbox` = the user marks a preference that takes effect when they submit the form
> - `Switch` = the change happens instantly (no form submission needed)

SOURCE: .claude/specs/components/checkbox.md:29-31

#### confusedWith 2
CLAIM: radio-group: RadioGroup selects exactly one option from a mutually exclusive set; Checkbox handles independent options where any number can be selected
CITATION:
> | One or more independent options in a form (submitted on Save) | `Checkbox` |
> | A single setting that takes effect immediately on toggle | `Switch` |
> | Selecting exactly one option from a mutually exclusive set | `RadioGroup` |

SOURCE: .claude/specs/components/checkbox.md:23-25

---

## dialog

### antiPatterns

#### antiPatterns 1
CLAIM: Mix AlertDialog sub-components inside Dialog, or use Dialog for an irreversible confirmation → Use Dialog for content/forms and AlertDialog for irreversible confirmations — they are two separate components; never mix their sub-components
CITATION:
> **Dialog vs AlertDialog — never mix.** Use `Dialog` for content/forms. Use `AlertDialog` for irreversible confirmations. Never use Dialog sub-components inside AlertDialog or vice versa.

SOURCE: .claude/specs/components/dialog.md:325-327

#### antiPatterns 2
CLAIM: Use DialogHeader without a DialogTitle → DialogTitle is required whenever DialogHeader is used (same rule as Card) — omitting it is structural drift
CITATION:
> **DialogTitle is required whenever DialogHeader is used.** Same rule as Card: using `DialogHeader` without `DialogTitle` is structural drift.

SOURCE: .claude/specs/components/dialog.md:329-330

#### antiPatterns 3
CLAIM: Use asChild on DialogTrigger, or nest a Button as a plain child (which creates a button inside a button) → Pass the trigger element via the render prop (Base UI pattern), e.g. DialogTrigger render set to a Button
CITATION:
> **DialogTrigger uses the `render` prop** (Base UI pattern, NOT `asChild`). Pass the trigger element via `render` so it renders as your Button: […] // ❌ WRONG — asChild is Radix pattern, causes React warnings in this repo […] // ❌ WRONG — creates a button inside a button
> `<DialogTrigger><Button>Open</Button></DialogTrigger>`

SOURCE: .claude/specs/components/dialog.md:332-347

#### antiPatterns 4
CLAIM: Add custom close logic or an extra close button to DialogContent → DialogContent has a built-in close button (showCloseButton defaults to true); add an explicit DialogClose in the footer only for a labelled Cancel button, and set showCloseButton to false only when the footer already has a cancel action
CITATION:
> **No custom close logic for Dialog.** `DialogContent` has a built-in close button (`showCloseButton={true}` by default). Only add explicit `DialogClose` in the footer if you need a labelled "Cancel" button. Set `showCloseButton={false}` only when the footer already has a cancel action.

SOURCE: .claude/specs/components/dialog.md:361-364

#### antiPatterns 5
CLAIM: Hardcode widths on DialogContent → Keep the built-in small max-width (sm:max-w-sm) — it is the Compass standard; only override for confirmed design exceptions noted in What I assumed
CITATION:
> **No hardcoded widths on DialogContent.** The built-in `sm:max-w-sm` is the Compass standard. Only override for confirmed design exceptions noted in "What I assumed."

SOURCE: .claude/specs/components/dialog.md:366-368

#### antiPatterns 6
CLAIM: Put the confirm/primary action before the cancel action in the footer → Order footer buttons cancel/secondary on the left, confirm/primary on the right — matching the built-in sm:justify-end layout
CITATION:
> **Footer button order:** Cancel/secondary on the left, confirm/primary on the right. This matches the built-in `sm:justify-end` layout.

SOURCE: .claude/specs/components/dialog.md:370-371

### confusedWith

#### confusedWith 1
CLAIM: alert-dialog: AlertDialog is for destructive confirmations and forces an explicit choice (no backdrop-click close); Dialog is for general content and forms and can be dismissed by backdrop click — separate components with separate imports, never mix their sub-components
CITATION:
> ⚠️ **These are two separate components** with separate imports. Dialog = general content/forms. AlertDialog = destructive confirmations. Do not mix their sub-components.
> […]
> **The key distinction:** AlertDialog traps focus and prevents closing by clicking the backdrop — it forces the user to make an explicit choice. Dialog allows backdrop-click to close.

SOURCE: .claude/specs/components/dialog.md:44-46, 60

---

## drawer

### antiPatterns

#### antiPatterns 1
CLAIM: Add a DrawerOverlay manually inside or next to DrawerContent → Use DrawerContent as-is; it renders the overlay automatically inside its portal
CITATION:
> **`DrawerContent` includes the overlay automatically.** Do not add a `DrawerOverlay` manually — it is rendered inside `DrawerContent`.

SOURCE: .claude/specs/components/drawer.md:238-239

#### antiPatterns 2
CLAIM: Add a manual drag-handle div to the top of the drawer → Rely on the built-in drag handle pill; it appears automatically for direction bottom and top
CITATION:
> **The drag handle is automatic for bottom/top.** Do not add a manual drag handle div — it appears for `direction="bottom"` and `direction="top"`.

SOURCE: .claude/specs/components/drawer.md:241-242

#### antiPatterns 3
CLAIM: Expect DrawerFooter to lay out Cancel and Confirm side by side → DrawerFooter stacks buttons vertically (flex-col gap-2); for a side-by-side pattern wrap the buttons in a flex flex-row gap-2 div inside DrawerFooter
CITATION:
> **`DrawerFooter` buttons stack vertically.** `DrawerFooter` uses `flex-col gap-2`. For a side-by-side Cancel + Confirm pattern, wrap them in a `flex flex-row gap-2` div inside `DrawerFooter`.

SOURCE: .claude/specs/components/drawer.md:244-246

#### antiPatterns 4
CLAIM: Use Drawer for a desktop side panel or persistent desktop workflow → Default to Sheet on desktop layouts; use Drawer when targeting mobile or building a responsive component that needs touch-friendly behaviour
CITATION:
> **Drawer is for mobile; Sheet is for desktop.** Default to `Sheet` on desktop layouts. Use `Drawer` when targeting mobile or building a responsive component that needs touch-friendly behaviour.

SOURCE: .claude/specs/components/drawer.md:248-250

#### antiPatterns 5
CLAIM: Use DrawerHeader without a DrawerTitle → Always include DrawerTitle when DrawerHeader is used; accessibility requires a title on all modal surfaces
CITATION:
> **`DrawerTitle` is required when `DrawerHeader` is used.** Accessibility requires a title on all modal surfaces.

SOURCE: .claude/specs/components/drawer.md:252-253

### confusedWith

#### confusedWith 1
CLAIM: sheet: Drawer is optimised for touch — visible drag handle, momentum-based dismissal, snap points; Sheet is a keyboard/pointer panel suited for desktop workflows
CITATION:
> **The key distinction:** `Drawer` is optimised for touch — it has a visible drag handle, momentum-based dismissal, and snap points. `Sheet` is a keyboard/pointer panel suited for desktop workflows.

SOURCE: .claude/specs/components/drawer.md:41-43

---

## combobox

### antiPatterns

#### antiPatterns 1
CLAIM: Omit ComboboxEmpty from the popup → Always include ComboboxEmpty inside ComboboxList — without it the popup appears empty with no feedback when the search yields no results
CITATION:
> **Always include `ComboboxEmpty`.** Without it, the popup appears empty with no feedback when the search yields no results.

SOURCE: .claude/specs/components/combobox.md:222-223

#### antiPatterns 2
CLAIM: Add a manual checkmark to the selected ComboboxItem → Rely on the built-in CheckIcon indicator that ComboboxItem includes automatically
CITATION:
> **Selected item checkmark is built in.** `ComboboxItem` includes a `CheckIcon` indicator automatically. Do not add a manual checkmark.

SOURCE: .claude/specs/components/combobox.md:225-226

#### antiPatterns 3
CLAIM: Build chips mode without wiring an anchor, leaving the popup positioned against the input only → Create a ref with useComboboxAnchor, set it as ref on ComboboxChips, and pass it as anchor to ComboboxContent so the popup positions relative to the chip container
CITATION:
> **Use `useComboboxAnchor` for chips mode.** The chips container needs to be passed as `anchor` to `ComboboxContent` so the popup positions relative to the chip container, not just the input:
> ```tsx
> const anchor = useComboboxAnchor()
> <ComboboxChips ref={anchor}>...</ComboboxChips>
> <ComboboxContent anchor={anchor}>...</ComboboxContent>
> ```

SOURCE: .claude/specs/components/combobox.md:228-235

#### antiPatterns 4
CLAIM: Use Combobox for a short, static option list → Use Select for short static lists; use Combobox when the list has 15+ items or the user needs to type to find an option
CITATION:
> **Combobox vs Select:** If the list has 15+ items, or the user needs to type to find an option, use `Combobox`. For a short, static list, use `Select`.

SOURCE: .claude/specs/components/combobox.md:237-239

#### antiPatterns 5
CLAIM: Assume ComboboxInput stretches to fill its container inside a form field → ComboboxInput width defaults to w-auto — add a full-width className or a fixed width when inside a form field
CITATION:
> **`ComboboxInput` width defaults to `w-auto`.** Add `className="w-full"` or a fixed width when inside a form field.

SOURCE: .claude/specs/components/combobox.md:241-242

### confusedWith

#### confusedWith 1
CLAIM: select: Select is for short static lists (15 or fewer options, no search); Combobox adds type-to-filter and covers long lists, multi-select chips, and free-text entry with suggestions
CITATION:
> | Situation | Use |
> |-----------|-----|
> | 15 or fewer options, no search needed | `Select` |
> | 15+ options, or user needs to search/filter | `Combobox` |
> | Multi-select with chip tags | `Combobox` (chips mode) |
> | Free-text entry that also suggests options | `Combobox` |
> | Simple dropdown for a form field | `Select` |

SOURCE: .claude/specs/components/combobox.md:35-41

---

## sidebar

### antiPatterns

#### antiPatterns 1
CLAIM: Wrap only the Sidebar in SidebarProvider, leaving the page content outside → SidebarProvider must wrap the entire page layout — both Sidebar and SidebarInset must be its children
CITATION:
> **`SidebarProvider` must wrap the entire page layout**, not just the sidebar. Both `Sidebar` and `SidebarInset` must be children of `SidebarProvider`.

SOURCE: .claude/specs/components/sidebar.md:287-288

#### antiPatterns 2
CLAIM: Use asChild on SidebarMenuButton, or navigate with onClick and router.push → Compose navigation links via the Base UI render prop: SidebarMenuButton render={<Link href="/dashboard" />} with icon and label as children
CITATION:
> **`SidebarMenuButton` uses `render` prop for navigation links.** This repo uses shadcn v4 / Base UI — NOT Radix. Composition uses `render`, not `asChild`: … `// ✅ CORRECT — Base UI render prop` `<SidebarMenuButton render={<Link href="/dashboard" />}>` … `// ❌ WRONG — asChild is the Radix pattern, causes React warnings here` … `// ❌ WRONG — onClick for navigation` `<SidebarMenuButton onClick={() => router.push("/dashboard")}>`

SOURCE: .claude/specs/components/sidebar.md:290-306

#### antiPatterns 3
CLAIM: Use collapsible icon mode without providing the tooltip prop on menu buttons → Always provide tooltip when using collapsible icon — labels are hidden when collapsed and tooltips are the only affordance to identify items
CITATION:
> **Always provide `tooltip` when using `collapsible="icon"`.** When the sidebar collapses to icons, labels are hidden — tooltips are the only affordance for the user to identify items.

SOURCE: .claude/specs/components/sidebar.md:308-310

#### antiPatterns 4
CLAIM: Manually hide SidebarGroupLabel when the sidebar is collapsed → SidebarGroupLabel hides automatically in icon-collapsed mode via built-in data-attribute styling
CITATION:
> **`SidebarGroupLabel` hides automatically when collapsed.** Do not manually hide it — the `group-data-[collapsible=icon]:-mt-8 opacity-0` handles this.

SOURCE: .claude/specs/components/sidebar.md:315-316

#### antiPatterns 5
CLAIM: Wrap SidebarInset in another main element → SidebarInset already renders as main — put the page's header, breadcrumbs, and content directly inside it
CITATION:
> **`SidebarInset` is `<main>`.** Do not wrap it in another `<main>`. The page's content, header, and breadcrumbs all go inside `SidebarInset`.

SOURCE: .claude/specs/components/sidebar.md:318-319

#### antiPatterns 6
CLAIM: Omit SidebarTrigger from the page header inside SidebarInset → Always include SidebarTrigger in the page header — without it users have no visible way to toggle the sidebar (though Cmd/Ctrl+B still works)
CITATION:
> **Always include `<SidebarTrigger />` in the page header inside `SidebarInset`.** Without it, users have no visible way to toggle the sidebar (though `Cmd/Ctrl+B` still works).

SOURCE: .claude/specs/components/sidebar.md:321-323

#### antiPatterns 7
CLAIM: Use SidebarMenuBadge for status labels like Active or Expired → SidebarMenuBadge is for counts only; use Badge in the page content for status labels
CITATION:
> **Do not use `SidebarMenuBadge` for status — use it for counts only.** For status labels (Active, Expired), use `Badge` in the page content, not inside sidebar menu items.

SOURCE: .claude/specs/components/sidebar.md:325-327

### confusedWith

#### confusedWith 1
CLAIM: sheet: Sheet is a general-purpose slide-over panel; Sidebar is the full app navigation system, which itself renders as a Sheet automatically on mobile
CITATION:
> **On mobile:** The Sidebar automatically renders as a `Sheet` (slide-over panel). This is built-in — no extra code needed.

SOURCE: .claude/specs/components/sidebar.md:59

---

## alert

### antiPatterns

#### antiPatterns 1
CLAIM: Lift Alert out of the page flow with fixed/absolute positioning or a high z-index, treating it like a dialog or toast → Place Alert inline in the JSX where it should appear; it is a non-modal, always-visible banner
CITATION:
> **`Alert` is inline — it is not a dialog.** Do not add `fixed`, `absolute`, `z-50`, or any positioning that lifts it out of the page flow. It sits inline where you place it in the JSX.

SOURCE: .claude/specs/components/alert.md:183-185

#### antiPatterns 2
CLAIM: Add extra right padding manually when using AlertAction → Use AlertAction as-is; the alert automatically adds right padding to prevent text overlapping the action
CITATION:
> **`AlertAction` is absolutely positioned top-right.** When using `AlertAction`, the alert automatically adds `pr-18` to prevent text overlapping the action. Do not add extra padding manually.

SOURCE: .claude/specs/components/alert.md:187-189

#### antiPatterns 3
CLAIM: Put the icon inside AlertTitle or AlertDescription → Place the SVG icon as the direct first child of Alert so the two-column grid activates
CITATION:
> **Icon must be the direct first child of `Alert`.** The two-column grid activates via `has-[>svg]`. An icon inside `AlertTitle` or `AlertDescription` will not trigger the layout:

SOURCE: .claude/specs/components/alert.md:191-193

#### antiPatterns 4
CLAIM: Use Alert for input validation errors below a specific field → Use FieldError from the Field system for field-level errors; Alert is for page- or section-level messages only
CITATION:
> **Do not use Alert for field validation errors.** For errors below a specific input, use `FieldError` from the Field system. Use `Alert` for page-level or section-level messages only.

SOURCE: .claude/specs/components/alert.md:207-209

#### antiPatterns 5
CLAIM: Override the card background with a solid destructive or hardcoded red background class → Keep the built-in card background; the destructive variant intentionally changes only text and icon color to the destructive token
CITATION:
> **Do not override `bg-card` with a colored background.** The destructive variant uses `text-destructive` on a card background — not a solid red background. Do not add `className="bg-destructive"` or `bg-red-50`.

SOURCE: .claude/specs/components/alert.md:211-213

#### antiPatterns 6
CLAIM: Add role=alert manually to the Alert element → Rely on the built-in role=alert on the Alert root
CITATION:
> **`role="alert"` is built in.** Do not add it manually. Screen readers will announce the content of `Alert` immediately when it appears.

SOURCE: .claude/specs/components/alert.md:215-217

#### antiPatterns 7
CLAIM: Wrap AlertTitle or AlertDescription in p or h3 elements → Use AlertTitle and AlertDescription directly; they already render as div elements
CITATION:
> **`AlertTitle` and `AlertDescription` are `<div>` elements.** Do not wrap them in `<p>` or `<h3>` — they render as divs already.

SOURCE: .claude/specs/components/alert.md:218-219

### confusedWith

#### confusedWith 1
CLAIM: sonner: Toast/Sonner is a transient confirmation that disappears after a few seconds; Alert is a persistent inline banner in the page flow
CITATION:
> | Persistent status message visible in the page | `Alert` |
> | Transient confirmation that disappears after a few seconds | Toast/Sonner |

SOURCE: .claude/specs/components/alert.md:32-33

#### confusedWith 2
CLAIM: alert-dialog: AlertDialog is a blocking modal confirmation requiring an explicit choice; Alert is non-modal and never interrupts the workflow
CITATION:
> | Blocking confirmation requiring an explicit user choice | `AlertDialog` |
> […]
> `Alert` is an **inline, non-modal notification banner** for communicating page-level feedback (errors, warnings, informational messages) without interrupting the user's workflow.

SOURCE: .claude/specs/components/alert.md:34, 21-23

#### confusedWith 3
CLAIM: badge: Badge is a status label on a record (Active, Expired); Alert is a page-level feedback banner
CITATION:
> | Status label on a record (Active, Expired) | `Badge` |

SOURCE: .claude/specs/components/alert.md:35

#### confusedWith 4
CLAIM: field: FieldError handles input validation errors below a specific field; Alert is for page- or section-level messages only
CITATION:
> | Input validation error below a field | `FieldError` (in the Field system) |
> […]
> **Do not use Alert for field validation errors.** For errors below a specific input, use `FieldError` from the Field system. Use `Alert` for page-level or section-level messages only.

SOURCE: .claude/specs/components/alert.md:36, 207-209

---

# Also rule on (full detail in spot-check-notes.md)

1. **Category assignments** (all 55, orchestrator-proposed): 18 atom / 20 molecule / 17 organism. Odd one: `direction` (renders no UI — provider utility). Add a "utility" category, or leave as atom?
2. **14 spec-drift findings** from the compile-checks (notes #1–14) — each is a PROPOSED spec edit for your approval; the checkbox-indeterminate and input.md-Form-composite ones also touch CLAUDE.md.
3. **S4's schema request:** optional `primitiveElements?: string[]` field for the C2 provenance check (additive; small backfill pass if approved).
4. **primitiveSource judgment** on button-group/item ("base-ui" via utilities vs "composite").

# What passed mechanically (no action needed)

55/55 files; `_meta-index.ts` compiles; tsc 0 errors; audit 0 errors / 34
pre-existing warnings; lint clean; name↔file↔key consistency 55/55; specced
count 33 = spec files; mapped count 10 = code-connect/ files.
