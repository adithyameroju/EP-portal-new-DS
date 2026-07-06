# Carousel — Compass Component Spec

> **Purpose:** This file is the complete specification for the Carousel component.
> LLMs must follow this spec exactly when generating carousels and slideshows.
> It overrides any general foundation spec where they conflict.

---

## Component location

```
Import: import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel"

File: components/ui/carousel.tsx
```

---

## What Carousel is

`Carousel` is a scrollable slideshow built on `embla-carousel-react`. It
supports horizontal and vertical orientations, keyboard navigation (arrow
keys), and programmatic control via the `CarouselApi`.

---

## Anatomy

```
Carousel (root — relative-positioned container)
  ├── CarouselContent (overflow-hidden scroll track)
  │     └── CarouselItem (individual slide — basis-full by default)
  ├── CarouselPrevious (← button — absolute-positioned left)
  └── CarouselNext (→ button — absolute-positioned right)
```

| Sub-component | Role | Required? |
|--------------|------|-----------|
| `Carousel` | Root — manages Embla instance and context | Always |
| `CarouselContent` | Scroll track — clips overflow | Always |
| `CarouselItem` | Individual slide — `basis-full` by default | One per slide |
| `CarouselPrevious` | Prev button — absolutely at `-left-12` | Usually |
| `CarouselNext` | Next button — absolutely at `-right-12` | Usually |

---

## Carousel props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Scroll direction |
| `opts` | `EmblaOptionsType` | — | Embla carousel options (loop, align, etc.) |
| `plugins` | `EmblaPluginType[]` | — | Embla plugins (autoplay, etc.) |
| `setApi` | `(api: CarouselApi) => void` | — | Get Embla API for programmatic control |

Common `opts` values:
- `loop: true` — infinite loop
- `align: "start" | "center" | "end"` — slide alignment (default "start")
- `slidesToScroll: number` — how many slides to advance per click

---

## Navigation button behaviour

- `CarouselPrevious` is disabled when at the first slide (unless `loop: true`)
- `CarouselNext` is disabled when at the last slide (unless `loop: true`)
- Both buttons use `variant="outline" size="icon-sm"` and are circular
- Positioned at `-left-12` / `-right-12` — the Carousel container needs
  horizontal padding or margin to prevent clipping (`px-12` or `mx-12`)

---

## Common patterns

### Basic image carousel

```tsx
<div className="mx-12">
  <Carousel>
    <CarouselContent>
      <CarouselItem>
        <img src="/slide1.jpg" alt="Slide 1" className="w-full rounded-lg" />
      </CarouselItem>
      <CarouselItem>
        <img src="/slide2.jpg" alt="Slide 2" className="w-full rounded-lg" />
      </CarouselItem>
      <CarouselItem>
        <img src="/slide3.jpg" alt="Slide 3" className="w-full rounded-lg" />
      </CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</div>
```

### Card carousel (multiple visible slides)

Use `basis-1/3` on `CarouselItem` to show 3 cards at once:

```tsx
<Carousel opts={{ align: "start" }}>
  <CarouselContent className="-ml-4">
    {plans.map((plan) => (
      <CarouselItem key={plan.id} className="pl-4 basis-1/3">
        <Card>
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>₹{plan.premium}/year</p>
          </CardContent>
        </Card>
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

### Looping carousel with autoplay

```tsx
import Autoplay from "embla-carousel-autoplay"

<Carousel
  opts={{ loop: true }}
  plugins={[Autoplay({ delay: 3000 })]}
>
  <CarouselContent>
    {items.map((item) => (
      <CarouselItem key={item.id}>
        {/* slide content */}
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

### Controlled carousel with dot indicators

Use `setApi` to get the Embla API instance for custom navigation or
dot indicators:

```tsx
const [api, setApi] = React.useState<CarouselApi>()
const [current, setCurrent] = React.useState(0)
const [count, setCount] = React.useState(0)

React.useEffect(() => {
  if (!api) return
  setCount(api.scrollSnapList().length)
  setCurrent(api.selectedScrollSnap())
  api.on("select", () => setCurrent(api.selectedScrollSnap()))
}, [api])

<div>
  <Carousel setApi={setApi}>
    <CarouselContent>
      {items.map((item, index) => (
        <CarouselItem key={index}>{/* content */}</CarouselItem>
      ))}
    </CarouselContent>
  </Carousel>
  <div className="flex justify-center gap-1 mt-2">
    {Array.from({ length: count }).map((_, i) => (
      <button
        key={i}
        className={cn("size-1.5 rounded-full", i === current ? "bg-primary" : "bg-muted")}
        onClick={() => api?.scrollTo(i)}
      />
    ))}
  </div>
</div>
```

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Single full-width slide with ← → buttons | `Carousel` + `CarouselItem` (basis-full default) |
| Multiple cards visible at once | `CarouselItem` with `basis-1/2` or `basis-1/3` |
| Dots or pip indicators below | `setApi` + custom dot buttons |
| Auto-advancing slideshow | `opts={{ loop: true }}` + Autoplay plugin |

---

## Rules for LLMs

1. **Wrap Carousel in a container with `mx-12` or `px-12`.** The prev/next
   buttons are positioned at `-left-12` / `-right-12`. Without this margin,
   they will clip outside the viewport or overlap content:
   ```tsx
   // ✅ CORRECT
   <div className="mx-12">
     <Carousel>...</Carousel>
   </div>

   // ❌ WRONG — buttons will be clipped
   <Carousel>...</Carousel>
   ```

2. **`CarouselItem` is `basis-full` by default** (one slide fills the full
   width). Override with `basis-1/2`, `basis-1/3`, etc. for multi-item views.

3. **Import `CarouselApi` as a type, not a value.** It is a TypeScript type:
   ```tsx
   import { type CarouselApi } from "@/components/ui/carousel"
   ```

4. **Keyboard navigation is built in.** Arrow keys (← →) advance slides
   automatically. Do not add `onKeyDown` handlers manually.

5. **`CarouselPrevious` and `CarouselNext` auto-disable at boundaries.**
   At the first slide, `CarouselPrevious` is `disabled`. At the last slide,
   `CarouselNext` is `disabled`. Override with `opts={{ loop: true }}` to
   enable infinite looping.

6. **Install `embla-carousel-autoplay` separately for autoplay.** It is not
   bundled — requires `npm install embla-carousel-autoplay`.
