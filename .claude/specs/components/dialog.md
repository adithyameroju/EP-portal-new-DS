# Dialog — Compass Component Spec

> **Purpose:** This file is the complete specification for the Dialog and
> AlertDialog components. LLMs must follow this spec exactly when generating
> code that includes dialogs or confirmation modals.
> It overrides any general foundation spec where they conflict.

---

## Component location

```
Dialog import:
  import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

AlertDialog import:
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

Files:
  components/ui/dialog.tsx
  components/ui/alert-dialog.tsx
```

> ⚠️ **These are two separate components** with separate imports.
> Dialog = general content/forms. AlertDialog = destructive confirmations.
> Do not mix their sub-components.

---

## When to use which

| Situation | Use |
|-----------|-----|
| Form inside a modal (edit, create, settings) | `Dialog` |
| Informational overlay with close button | `Dialog` |
| Destructive confirmation ("Delete this policy?") | `AlertDialog` |
| Warning that requires an explicit choice | `AlertDialog` |
| Simple message the user must acknowledge | `AlertDialog` with one action |

**The key distinction:** AlertDialog traps focus and prevents closing by clicking the backdrop — it forces the user to make an explicit choice. Dialog allows backdrop-click to close.

---

## Dialog anatomy

```
┌──────────────────────────────────┐
│  [×]  DialogHeader               │
│         DialogTitle              │
│         DialogDescription        │
│                                  │
│       (your content)             │
│                                  │
│  ░░░░ DialogFooter ░░░░░░░░░░░░  │
│    [Cancel]          [Confirm]   │
└──────────────────────────────────┘
```

| Sub-component | Role | Required? |
|--------------|------|-----------|
| `Dialog` | Root — controls open/closed state | Always |
| `DialogTrigger` | The element that opens the dialog | Usually |
| `DialogContent` | Popup container — includes overlay + close button | Always |
| `DialogHeader` | Top section wrapping title + description | When dialog has a title |
| `DialogTitle` | Heading text | When dialog has a title |
| `DialogDescription` | Subtitle or context below title | Optional |
| `DialogFooter` | Bottom action bar — `bg-muted/50` | When dialog has actions |
| `DialogClose` | Explicit close trigger (for custom close buttons) | Optional |

---

## Dialog default styling

| Property | Value | Notes |
|----------|-------|-------|
| Background | `bg-popover` | Matches popover surface token |
| Text | `text-popover-foreground` | |
| Border | `ring-1 ring-foreground/10` | Same ring pattern as Card |
| Border radius | `rounded-xl` | |
| Max width (mobile) | `calc(100% - 2rem)` | Full width with safe margins |
| Max width (sm+) | `sm:max-w-sm` (384px) | Standard dialog width |
| Padding | `p-4` | |
| Gap between sections | `gap-4` | |
| Overlay | `bg-black/10` with `backdrop-blur-xs` | Subtle — not a heavy dark overlay |
| Close button | Ghost icon button, top-right, always shown by default | |
| Footer background | `bg-muted/50` with `border-t` | |
| Animation | Fade + zoom in/out via `data-open`/`data-closed` | Built-in — do not override |

---

## Dialog props

### `DialogContent`

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `showCloseButton` | `boolean` | `true` | Set to `false` only when the dialog has explicit close actions in the footer |

### `DialogFooter`

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `showCloseButton` | `boolean` | `false` | Set to `true` to add a built-in "Close" outline button automatically |

---

## Common patterns

### Basic dialog

```tsx
<Dialog>
  <DialogTrigger render={<Button variant="outline">Edit Profile</Button>} />
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here. Click save when done.
      </DialogDescription>
    </DialogHeader>
    {/* content */}
    <DialogFooter>
      <Button type="submit">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Dialog with form

```tsx
<Dialog>
  <DialogTrigger render={<Button>Add Nominee</Button>} />
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add Nominee</DialogTitle>
      <DialogDescription>
        Add a nominee to your policy. All fields are required.
      </DialogDescription>
    </DialogHeader>
    <form className="grid gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="nominee-name">Full Name</Label>
        <Input id="nominee-name" placeholder="Enter full name" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="nominee-relation">Relationship</Label>
        <Input id="nominee-relation" placeholder="e.g. Spouse, Parent" />
      </div>
    </form>
    <DialogFooter>
      <DialogClose render={<Button variant="outline">Cancel</Button>} />
      <Button type="submit">Add Nominee</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Dialog with no footer (informational)

```tsx
<Dialog>
  <DialogTrigger render={<Button variant="ghost" size="sm">What's covered?</Button>} />
  <DialogContent>
    <DialogHeader>
      <DialogTitle>What's covered</DialogTitle>
      <DialogDescription>
        Your policy covers the following scenarios.
      </DialogDescription>
    </DialogHeader>
    <ul className="grid gap-2 text-sm text-muted-foreground">
      <li>Accidental damage</li>
      <li>Natural disasters</li>
      <li>Third-party liability</li>
    </ul>
  </DialogContent>
</Dialog>
```

### Controlled dialog (open state managed externally)

```tsx
const [open, setOpen] = React.useState(false)

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger render={<Button>Open</Button>} />
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Controlled Dialog</DialogTitle>
    </DialogHeader>
    <DialogFooter>
      <Button onClick={() => setOpen(false)}>Done</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## AlertDialog anatomy

```
┌──────────────────────────────┐
│  AlertDialogHeader           │
│    [icon]  AlertDialogTitle  │
│            AlertDialogDesc   │
│                              │
│  ░░░ AlertDialogFooter ░░░░  │
│  [AlertDialogCancel]         │
│  [AlertDialogAction]         │
└──────────────────────────────┘
```

| Sub-component | Role | Required? |
|--------------|------|-----------|
| `AlertDialog` | Root | Always |
| `AlertDialogTrigger` | Opens the dialog | Usually |
| `AlertDialogContent` | Popup container | Always |
| `AlertDialogHeader` | Wraps title + description | Always |
| `AlertDialogTitle` | Heading | Always |
| `AlertDialogDescription` | Context for the decision | Always |
| `AlertDialogFooter` | Action bar | Always |
| `AlertDialogAction` | Confirm button (renders as `<Button>`) | Always |
| `AlertDialogCancel` | Cancel button (renders as `<Button variant="outline">`) | Always |
| `AlertDialogMedia` | Optional icon/image in header (renders in `bg-muted` circle) | Optional |

---

## AlertDialog props

### `AlertDialogContent`

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `size` | `"default" \| "sm"` | `"default"` | `"sm"` shows a compact centered layout with a 2-column footer |

---

## AlertDialog patterns

### Destructive confirmation (standard)

```tsx
<AlertDialog>
  <AlertDialogTrigger render={<Button variant="destructive">Delete Policy</Button>} />
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete this policy?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. Your policy will be permanently
        deleted and all associated data will be removed.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Compact confirmation with icon (size="sm")

```tsx
import { Trash2 } from "lucide-react"

<AlertDialog>
  <AlertDialogTrigger render={<Button variant="ghost" size="icon" aria-label="Remove item"><Trash2 className="size-4" /></Button>} />
  <AlertDialogContent size="sm">
    <AlertDialogHeader>
      <AlertDialogMedia>
        <Trash2 />
      </AlertDialogMedia>
      <AlertDialogTitle>Remove item?</AlertDialogTitle>
      <AlertDialogDescription>
        This item will be removed from your list.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction variant="destructive">Remove</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Modal with editable fields | `Dialog` with form content |
| Modal with close × button | `Dialog` — close button built in (`showCloseButton` defaults to `true`) |
| Confirmation modal ("Are you sure?") | `AlertDialog` |
| Delete/cancel confirmation | `AlertDialog` with `AlertDialogAction variant="destructive"` |
| Small confirmation with icon | `AlertDialogContent size="sm"` with `AlertDialogMedia` |
| Modal with Cancel + primary action | `DialogFooter` with `DialogClose` + `Button` |
| Modal that can't be dismissed by backdrop click | Use `AlertDialog` |

---

## Rules for LLMs

1. **Dialog vs AlertDialog — never mix.** Use `Dialog` for content/forms. Use
   `AlertDialog` for irreversible confirmations. Never use Dialog sub-components
   inside AlertDialog or vice versa.

2. **DialogTitle is required whenever DialogHeader is used.** Same rule as Card:
   using `DialogHeader` without `DialogTitle` is structural drift.

3. **DialogTrigger uses the `render` prop** (Base UI pattern, NOT `asChild`).
   Pass the trigger element via `render` so it renders as your Button:
   ```tsx
   // ✅ CORRECT — Base UI render prop
   <DialogTrigger render={<Button>Open</Button>} />

   // ❌ WRONG — asChild is Radix pattern, causes React warnings in this repo
   <DialogTrigger asChild>
     <Button>Open</Button>
   </DialogTrigger>

   // ❌ WRONG — creates a button inside a button
   <DialogTrigger>
     <Button>Open</Button>
   </DialogTrigger>
   ```

4. **AlertDialog always has both Cancel and Action.** Never show an AlertDialog
   with only one button — the user must have an explicit escape.

5. **AlertDialogAction is already a Button.** Do not wrap it in `<Button>`:
   ```tsx
   // ✅ CORRECT
   <AlertDialogAction variant="destructive">Delete</AlertDialogAction>

   // ❌ WRONG
   <AlertDialogAction><Button variant="destructive">Delete</Button></AlertDialogAction>
   ```

6. **No custom close logic for Dialog.** `DialogContent` has a built-in close
   button (`showCloseButton={true}` by default). Only add explicit
   `DialogClose` in the footer if you need a labelled "Cancel" button.
   Set `showCloseButton={false}` only when the footer already has a cancel action.

7. **No hardcoded widths on DialogContent.** The built-in `sm:max-w-sm` is the
   Compass standard. Only override for confirmed design exceptions noted in
   "What I assumed."

8. **Footer button order:** Cancel/secondary on the left, confirm/primary on
   the right. This matches the built-in `sm:justify-end` layout.
