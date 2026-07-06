# Progress — Compass Component Spec

> **Purpose:** This file is the complete specification for the Progress component.
> LLMs must follow this spec exactly when generating progress bars.
> It overrides any general foundation spec where they conflict.

---

## Component location

```
Import: import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"

File: components/ui/progress.tsx
```

---

## What Progress is

`Progress` is a horizontal progress bar built on Base UI's
`@base-ui/react/progress` primitive. It shows completion percentage for
tasks, uploads, form steps, or loading states.

---

## Anatomy

```
Progress (root — flex-wrap container, renders track automatically)
  ├── ProgressLabel (optional label text — top-left)
  ├── ProgressValue (optional percentage text — top-right)
  └── [ProgressTrack + ProgressIndicator — rendered automatically]
```

| Sub-component | Role | Notes |
|--------------|------|-------|
| `Progress` | Root — renders track + indicator automatically | Always |
| `ProgressLabel` | Text label above-left the bar | Optional |
| `ProgressValue` | Percentage text above-right the bar | Optional |
| `ProgressTrack` | The gray background bar | Rendered automatically — rarely imported directly |
| `ProgressIndicator` | The colored fill bar | Rendered automatically — rarely imported directly |

> **`ProgressTrack` and `ProgressIndicator` are rendered automatically.**
> They are exported from `components/ui/progress.tsx`, but the `Progress`
> root renders them for you, so you normally only import and use `Progress`,
> `ProgressLabel`, and `ProgressValue`.

---

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `value` | `number` | — | Progress value 0–100 |

---

## Default styling

| Element | Styling |
|---------|---------|
| Track | `h-1 w-full rounded-full bg-muted` (very thin, 4px) |
| Indicator | `bg-primary`, fills proportionally, `transition-all` |
| Label | `text-sm font-medium` |
| Value | `text-sm text-muted-foreground tabular-nums ml-auto` |
| Root layout | `flex flex-wrap gap-3` — label/value appear in a row above the bar |

---

## Common patterns

### Basic progress bar

```tsx
<Progress value={65} />
```

### Progress with label

```tsx
<Progress value={65}>
  <ProgressLabel>Uploading document</ProgressLabel>
</Progress>
```

### Progress with label and percentage value

```tsx
<Progress value={65}>
  <ProgressLabel>Profile completion</ProgressLabel>
  <ProgressValue />
</Progress>
```

`ProgressValue` automatically renders the current percentage. You do not
need to pass the number manually.

### Progress with custom value format

Pass children to `ProgressValue` to override the display:

```tsx
<Progress value={4} max={10}>
  <ProgressLabel>Step</ProgressLabel>
  <ProgressValue>4 of 10</ProgressValue>
</Progress>
```

### Multi-step form progress

```tsx
const steps = ["Basic Info", "Coverage", "Add-ons", "Review", "Payment"]
const currentStep = 3 // 0-indexed

<div className="flex flex-col gap-1.5">
  <Progress value={(currentStep / (steps.length - 1)) * 100}>
    <ProgressLabel>{steps[currentStep]}</ProgressLabel>
    <ProgressValue>{currentStep + 1} of {steps.length}</ProgressValue>
  </Progress>
</div>
```

### List of progress bars (file uploads)

```tsx
<div className="flex flex-col gap-3">
  {files.map((file) => (
    <div key={file.id} className="flex flex-col gap-1">
      <span className="text-sm truncate">{file.name}</span>
      <Progress value={file.progress} />
    </div>
  ))}
</div>
```

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Thin horizontal bar that fills left-to-right | `<Progress value={n} />` |
| Label text above-left the bar | `<ProgressLabel>text</ProgressLabel>` as child |
| Percentage text above-right the bar | `<ProgressValue />` as child |
| Thick progress bar | `ProgressTrack` with `className="h-2"` (but avoid — default h-1 is correct) |

---

## Rules for LLMs

1. **You normally never need to import `ProgressTrack` or
   `ProgressIndicator`.** They are exported, but the `Progress` root
   renders them automatically. For typical usage, only import `Progress`,
   `ProgressLabel`, and `ProgressValue`:
   ```tsx
   // ✅ CORRECT — typical usage
   import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"

   // ⚠️ UNNECESSARY — Progress already renders track + indicator for you
   import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress"
   ```

2. **`value` is 0–100.** Pass a number between 0 and 100.

3. **`ProgressLabel` and `ProgressValue` are children of `Progress`,
   not siblings.** They go inside the `Progress` component, not alongside it:
   ```tsx
   // ✅ CORRECT
   <Progress value={65}>
     <ProgressLabel>Loading</ProgressLabel>
     <ProgressValue />
   </Progress>

   // ❌ WRONG — outside the component
   <Progress value={65} />
   <span>Loading</span>
   ```

4. **Do not override `h-1` for the track.** The 4px height is intentional.
   If a design requires a thicker bar, check with the design owner before
   overriding — this is a global style decision.

5. **`ProgressValue` auto-renders the percentage.** It reads the value
   from context. Pass children only when you need a custom format
   (e.g., "4 of 10" instead of "40%").
