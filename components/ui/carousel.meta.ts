import type { ComponentMeta } from "./_meta-schema"

export const carouselMeta: ComponentMeta = {
  name: "carousel",
  category: "organism",
  purpose:
    "A scrollable slideshow built on embla-carousel-react, supporting horizontal and vertical orientations, keyboard navigation (arrow keys), and programmatic control via the CarouselApi.",
  useCases: [
    "Basic full-width image carousel with previous/next buttons",
    "Card carousel showing multiple slides at once (basis overrides on CarouselItem)",
    "Looping, auto-advancing slideshow via the Autoplay plugin",
    "Controlled carousel with custom dot indicators via setApi",
  ],
  antiPatterns: [
    {
      wrong:
        "Render Carousel without a wrapping container that has mx-12 or px-12",
      instead:
        "Wrap Carousel in a container with horizontal margin or padding — the prev/next buttons are absolutely positioned outside the carousel edges and will clip or overlap content otherwise",
      source: "spec:.claude/specs/components/carousel.md#rules-for-llms",
    },
    {
      wrong: "Import CarouselApi as a value",
      instead:
        "It is a TypeScript type — import it with a type-only import: import { type CarouselApi }",
      source: "spec:.claude/specs/components/carousel.md#rules-for-llms",
    },
    {
      wrong: "Add manual onKeyDown handlers for arrow-key navigation",
      instead:
        "Keyboard navigation is built in — left/right arrow keys advance slides automatically",
      source: "spec:.claude/specs/components/carousel.md#rules-for-llms",
    },
    {
      wrong: "Assume the Autoplay plugin ships with the carousel",
      instead:
        "Install embla-carousel-autoplay separately (npm install embla-carousel-autoplay) — it is not bundled",
      source: "spec:.claude/specs/components/carousel.md#rules-for-llms",
    },
  ],
  variants: [
    {
      prop: "orientation",
      values: ["horizontal", "vertical"],
      default: "horizontal",
    },
  ],
  sizes: [],
  parentComponents: ["button"],
  childComponents: [
    "carousel-content",
    "carousel-item",
    "carousel-previous",
    "carousel-next",
  ],
  tokens: [],
  a11y: [
    "Root has role=region with aria-roledescription=carousel; each CarouselItem has role=group with aria-roledescription=slide",
    "Arrow-key keyboard navigation is built into the root — do not add handlers manually",
    "CarouselPrevious and CarouselNext include sr-only labels ('Previous slide' / 'Next slide') and auto-disable at the first/last slide unless loop is enabled",
  ],
  aiHints: {
    selectionCriteria: [],
    confusedWith: [],
    compositionRules: [
      "Structure: Carousel > CarouselContent > CarouselItem (one per slide), with CarouselPrevious and CarouselNext as direct Carousel children",
      "Wrap the whole Carousel in a container with mx-12 or px-12 so the absolutely positioned prev/next buttons are not clipped",
      "CarouselItem is basis-full by default (one slide fills the width); override with basis-1/2, basis-1/3, etc. for multi-item views",
      "Prev/next buttons auto-disable at the boundaries; pass opts={{ loop: true }} for infinite looping",
      "Use setApi to get the Embla API for programmatic control, e.g. custom dot indicators driven by scrollSnapList/selectedScrollSnap",
      "Autoplay requires the separate embla-carousel-autoplay package passed via the plugins prop",
    ],
    source: ".claude/specs/components/carousel.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/carousel.md",
  codeConnectStatus: "not-planned",
  primitiveSource: "embla",
  version: "1.0.0",
}
