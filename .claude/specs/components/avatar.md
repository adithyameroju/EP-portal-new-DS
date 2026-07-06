# Avatar — Compass Component Spec

> **Purpose:** This file is the complete specification for the Avatar component.
> LLMs must follow this spec exactly when generating user avatars.
> It overrides any general foundation spec where they conflict.

---

## Component location

```
Import: import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
} from "@/components/ui/avatar"

File: components/ui/avatar.tsx
```

---

## Anatomy

```
Avatar (root — circular container)
  ├── AvatarImage (photo — hides if src fails to load)
  ├── AvatarFallback (initials/icon — shown when image fails or is absent)
  └── AvatarBadge (optional status dot — bottom-right corner)

AvatarGroup (horizontal stack of overlapping avatars)
  ├── Avatar (one per person)
  └── AvatarGroupCount ("+N" overflow indicator)
```

| Sub-component | Role | Required? |
|--------------|------|-----------|
| `Avatar` | Root circular container | Always |
| `AvatarImage` | Photo — auto-hides on load error | When you have a photo URL |
| `AvatarFallback` | Initials or icon fallback | Always (shown when image absent or broken) |
| `AvatarBadge` | Status dot bottom-right | Optional |
| `AvatarGroup` | Stack multiple avatars with overlap | When showing a group |
| `AvatarGroupCount` | "+N" overflow count in a group | When group has more avatars than shown |

---

## Sizes

| Size | Prop | Dimensions |
|------|------|-----------|
| Small | `size="sm"` | `size-6` (24px) |
| Default | `size="default"` (default) | `size-8` (32px) |
| Large | `size="lg"` | `size-10` (40px) |

The size prop lives on `Avatar` (root) and automatically cascades to
`AvatarFallback` text size and `AvatarBadge` size via group context.

---

## AvatarBadge sizing by avatar size

| Avatar size | Badge size | Icon inside badge |
|-------------|-----------|-------------------|
| `sm` | `size-2` (8px) | Hidden (too small) |
| `default` | `size-2.5` (10px) | `size-2` (8px) |
| `lg` | `size-3` (12px) | `size-2` (8px) |

Badge uses `bg-primary` with `ring-2 ring-background` to visually separate
from the avatar image.

---

## Common patterns

### Avatar with image and fallback (standard)

```tsx
<Avatar>
  <AvatarImage src="https://example.com/nikhil.jpg" alt="Nikhil Thakkar" />
  <AvatarFallback>NT</AvatarFallback>
</Avatar>
```

### Avatar sizes

```tsx
<Avatar size="sm">
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>U</AvatarFallback>
</Avatar>

<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>U</AvatarFallback>
</Avatar>

<Avatar size="lg">
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>U</AvatarFallback>
</Avatar>
```

### Avatar with status badge

```tsx
<Avatar>
  <AvatarImage src="/avatar.jpg" alt="Priya Sharma" />
  <AvatarFallback>PS</AvatarFallback>
  <AvatarBadge />
</Avatar>
```

### Avatar with icon in badge

```tsx
import { Check } from "lucide-react"

<Avatar size="lg">
  <AvatarImage src="/avatar.jpg" alt="Verified user" />
  <AvatarFallback>VU</AvatarFallback>
  <AvatarBadge>
    <Check />
  </AvatarBadge>
</Avatar>
```

### Fallback-only avatar (no image)

```tsx
<Avatar>
  <AvatarFallback>NT</AvatarFallback>
</Avatar>
```

### Avatar group (team / assignees)

```tsx
<AvatarGroup>
  <Avatar>
    <AvatarImage src="/user1.jpg" alt="User 1" />
    <AvatarFallback>U1</AvatarFallback>
  </Avatar>
  <Avatar>
    <AvatarImage src="/user2.jpg" alt="User 2" />
    <AvatarFallback>U2</AvatarFallback>
  </Avatar>
  <Avatar>
    <AvatarImage src="/user3.jpg" alt="User 3" />
    <AvatarFallback>U3</AvatarFallback>
  </Avatar>
  <AvatarGroupCount>+4</AvatarGroupCount>
</AvatarGroup>
```

### Avatar in a user profile row

```tsx
<div className="flex items-center gap-3">
  <Avatar size="lg">
    <AvatarImage src="/nikhil.jpg" alt="Nikhil Thakkar" />
    <AvatarFallback>NT</AvatarFallback>
  </Avatar>
  <div className="flex flex-col">
    <span className="text-sm font-medium">Nikhil Thakkar</span>
    <span className="text-xs text-muted-foreground">nikhil@acko.com</span>
  </div>
</div>
```

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Circular photo | `Avatar` + `AvatarImage` + `AvatarFallback` |
| Circular initials placeholder | `Avatar` + `AvatarFallback` (no AvatarImage) |
| Small avatar (24px) | `Avatar size="sm"` |
| Large avatar (40px) | `Avatar size="lg"` |
| Green/colored dot bottom-right | `AvatarBadge` |
| Overlapping avatars in a row | `AvatarGroup` with multiple `Avatar` children |
| "+3" overflow count | `AvatarGroupCount` at the end of `AvatarGroup` |

---

## Rules for LLMs

1. **Always include `AvatarFallback`.** If the image fails to load or the
   `src` is empty, `AvatarFallback` is what the user sees. Omitting it
   results in a blank circle:
   ```tsx
   // ✅ CORRECT
   <Avatar>
     <AvatarImage src={user.avatarUrl} alt={user.name} />
     <AvatarFallback>{initials}</AvatarFallback>
   </Avatar>

   // ❌ WRONG — no fallback
   <Avatar>
     <AvatarImage src={user.avatarUrl} alt={user.name} />
   </Avatar>
   ```

2. **`AvatarFallback` should be 1–2 character initials or a single icon.**
   Longer text will overflow the circle.

3. **`size` prop goes on `Avatar`, not sub-components.** The size cascades
   automatically to `AvatarFallback` and `AvatarBadge` via data attributes.
   Do not add `className="size-10"` to the avatar — use `size="lg"`.

4. **`AvatarGroup` applies overlap automatically.** It uses `-space-x-2`
   and adds `ring-2 ring-background` to each child avatar. Do not add
   negative margin manually.

5. **`AvatarBadge` icon is hidden at `size="sm"`.** The 24px avatar is
   too small to show an icon in the badge — the icon is automatically
   hidden via CSS. Use a plain `<AvatarBadge />` (no icon) for small sizes.

6. **Do not add `rounded-full` to Avatar.** It is built in. Adding it again
   is redundant.
