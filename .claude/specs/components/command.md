# Command — Compass Component Spec

> **Purpose:** This file is the complete specification for the Command component.
> LLMs must follow this spec exactly when generating command palettes and search interfaces.
> It overrides any general foundation spec where they conflict.

---

## Component location

```
Import: import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "@/components/ui/command"

File: components/ui/command.tsx
```

---

## What Command is

`Command` is a keyboard-navigable search/command interface built on the
`cmdk` library. It is designed for **⌘K command palettes**, global search,
and action launchers — not for form field selection (use `Select` or
`Combobox` for those).

Two usage modes:
1. **Inline** — `Command` renders directly in the page (e.g., inside a Popover)
2. **Dialog** — `CommandDialog` wraps it in a centered modal for ⌘K palettes

---

## Anatomy

```
Command (root — renders inline)
  ├── CommandInput (search field with magnifier icon)
  ├── CommandList (scrollable results area)
  │     ├── CommandEmpty (shown when search has no results)
  │     ├── CommandGroup (section with heading)
  │     │     ├── CommandItem (one result/action)
  │     │     │     └── CommandShortcut (keyboard hint — right-aligned)
  │     │     └── ...
  │     └── CommandSeparator

CommandDialog (Command inside a Dialog — for ⌘K palettes)
  └── (same children as Command)
```

| Sub-component | Role | Required? |
|--------------|------|-----------|
| `Command` | Root container | Always (unless using CommandDialog) |
| `CommandDialog` | Command + Dialog wrapper for ⌘K | For modal command palettes |
| `CommandInput` | Search field (SearchIcon built-in) | Usually |
| `CommandList` | Scrollable results container | Always |
| `CommandEmpty` | "No results" message | Always (shown when list is empty) |
| `CommandGroup` | Named section of results | When grouping items |
| `CommandItem` | A single result or action | One per item |
| `CommandShortcut` | Keyboard hint text — right-aligned | Optional |
| `CommandSeparator` | Divider between sections | Optional |

---

## CommandDialog props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `open` | `boolean` | — | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | — | Controlled change handler |
| `title` | `string` | `"Command Palette"` | Screen reader title (visually hidden) |
| `description` | `string` | `"Search for a command to run..."` | Screen reader description |
| `showCloseButton` | `boolean` | `false` | Show × button (off by default for palettes) |

---

## Default styling

| Element | Styling |
|---------|---------|
| Container | `bg-popover text-popover-foreground` |
| Input | Embedded in `InputGroup`, `h-8`, muted background, SearchIcon right |
| List | `max-h-72` scrollable, `no-scrollbar` |
| Item | `px-2 py-1.5 text-sm`, hover/selected: `bg-muted text-foreground` |
| Group heading | `text-xs font-medium text-muted-foreground px-2 py-1.5` |
| Shortcut | `text-xs text-muted-foreground` right-aligned |
| Empty | `py-6 text-center text-sm` |

---

## Common patterns

### ⌘K command palette (most common)

Open/close with a keyboard shortcut and render in a `CommandDialog`:

```tsx
const [open, setOpen] = React.useState(false)

React.useEffect(() => {
  const down = (e: KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      setOpen((open) => !open)
    }
  }
  document.addEventListener("keydown", down)
  return () => document.removeEventListener("keydown", down)
}, [])

<CommandDialog open={open} onOpenChange={setOpen}>
  <CommandInput placeholder="Search policies, claims, documents..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Policies">
      <CommandItem>
        <FileText className="size-4" />
        Motor Insurance 2024
        <CommandShortcut>↵</CommandShortcut>
      </CommandItem>
      <CommandItem>
        <FileText className="size-4" />
        Health Insurance - Family
      </CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Actions">
      <CommandItem>
        <PlusIcon className="size-4" />
        New Claim
        <CommandShortcut>⌘N</CommandShortcut>
      </CommandItem>
      <CommandItem>
        <DownloadIcon className="size-4" />
        Download Policy Document
      </CommandItem>
    </CommandGroup>
  </CommandList>
</CommandDialog>
```

### Inline command (inside a Popover)

```tsx
<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger render={<Button variant="outline" className="w-48 justify-between" />}>
    {value || "Select option..."}
    <ChevronsUpDownIcon className="size-4 opacity-50" />
  </PopoverTrigger>
  <PopoverContent className="w-48 p-0">
    <Command>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          <CommandItem value="motor" onSelect={() => { setValue("Motor"); setOpen(false) }}>
            Motor
          </CommandItem>
          <CommandItem value="health" onSelect={() => { setValue("Health"); setOpen(false) }}>
            Health
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>
```

### Search with filtered results

```tsx
<Command>
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Recent">
      <CommandItem>Dashboard</CommandItem>
      <CommandItem>Claims</CommandItem>
    </CommandGroup>
    <CommandGroup heading="Settings">
      <CommandItem>Profile</CommandItem>
      <CommandItem>Notifications</CommandItem>
      <CommandItem>Billing</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Search palette in a centered modal | `CommandDialog` |
| Search input with magnifier icon | `CommandInput` (icon is built-in) |
| Grouped search results | `CommandGroup` with `heading` prop |
| Single result/action row | `CommandItem` |
| Keyboard shortcut label on right | `CommandShortcut` |
| "No results" empty state | `CommandEmpty` |
| Divider between groups | `CommandSeparator` |

---

## Rules for LLMs

1. **Always include `CommandEmpty`.** When a search produces no results,
   `CommandEmpty` shows the fallback message. Without it, the list appears
   blank with no feedback.

2. **`Command` is not a form select.** It does not produce a form value.
   For form fields with search, use `Combobox`. Use `Command` for
   action/navigation palettes.

3. **`CommandDialog` hides its title visually.** The `title` and `description`
   props render in an `sr-only` `DialogHeader` for screen readers. Do not
   add a visible title inside the dialog — Command palettes are title-free
   in visual design.

4. **`CommandItem` filtering is automatic.** `cmdk` filters items by the
   text content of `CommandItem` as the user types in `CommandInput`. You
   do not need to manage filtering manually.

5. **Add keyboard shortcut listener manually.** `CommandDialog` does not
   auto-open on ⌘K — you must add the `useEffect` listener yourself
   (see the command palette pattern above).

6. **`CommandShortcut` must be the last child of `CommandItem`.**
   It uses `ml-auto` to push to the right edge.
