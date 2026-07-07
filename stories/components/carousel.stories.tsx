/**
 * Carousel stories — S2.3 generation pass.
 * Title from carouselMeta.category ("organism" → "Organisms"). Covers the
 * `orientation` axis generically; composed examples verbatim from
 * .claude/specs/components/carousel.md "Common patterns".
 * Skipped per lane-B conventions: "Looping carousel with autoplay"
 * (embla-carousel-autoplay is not installed in this repo — spec rule 6:
 * "Install embla-carousel-autoplay separately") and "Controlled carousel
 * with dot indicators" (controlled useState example; its dots are also raw
 * <button> elements, which stories/ may not contain).
 */

import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { carouselMeta } from "@/components/ui/carousel.meta"
import { metaDocsPage } from "./meta-doc-blocks"

type CarouselProps = ComponentProps<typeof Carousel>

const orientationAxis = carouselMeta.variants.find(
  (axis) => axis.prop === "orientation",
)!

const meta = {
  title: "Organisms/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(carouselMeta) },
  },
} satisfies Meta<typeof Carousel>

export default meta
type Story = StoryObj<typeof meta>

/**
 * One carousel per `orientation` axis value from carousel.meta.ts, with the
 * spec's basic slide shape. Mechanical derivations (flagged):
 * - the spec's mx-12 container rule becomes my-12 for the vertical value
 *   (its prev/next buttons sit at -top-12 / -bottom-12);
 * - the vertical scroll track gets a fixed h-64 (embla's vertical axis needs
 *   an explicit track height; no spec pattern exists for vertical).
 * w-64 slide width is the lane-B sized-wrapper convention.
 */
export const Orientation: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-8">
      {orientationAxis.values.map((value) => (
        <div
          key={value}
          className={value === "vertical" ? "my-12 w-64" : "mx-12 w-64"}
        >
          <Carousel orientation={value as CarouselProps["orientation"]}>
            <CarouselContent
              className={value === "vertical" ? "h-64" : undefined}
            >
              {[1, 2, 3].map((slide) => (
                <CarouselItem key={slide}>
                  <Card>
                    <CardContent className="flex h-40 items-center justify-center">
                      <span className="font-mono text-sm text-muted-foreground">
                        {value}
                      </span>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      ))}
    </div>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/carousel.md "Basic image carousel".
 * Simplification (flagged): the spec's <img src="/slideN.jpg"> assets do not
 * exist in Storybook — each slide keeps the spec's alt text ("Slide N") as
 * Card content instead of a raw <img>. Outer w-96 is the lane-B sized
 * wrapper; the inner mx-12 div is the spec's own container rule.
 */
export const BasicCarousel: Story = {
  render: () => (
    <div className="w-96">
      <div className="mx-12">
        <Carousel>
          <CarouselContent>
            {["Slide 1", "Slide 2", "Slide 3"].map((slide) => (
              <CarouselItem key={slide}>
                <Card className="w-full rounded-lg">
                  <CardContent className="flex h-40 items-center justify-center">
                    <span className="text-sm text-muted-foreground">
                      {slide}
                    </span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/carousel.md
 * "Card carousel (multiple visible slides)" — basis-1/3 shows 3 cards at
 * once. Simplifications (flagged): the spec's data-bound `plans` array is
 * filled with static values in the spec's own domain shape; the whole
 * carousel gets the spec-rule-1 mx-12 container plus a lane-B w-96 wrapper.
 */
export const CardCarousel: Story = {
  render: () => {
    const plans = [
      { id: "motor", name: "Motor", premium: "12,500" },
      { id: "health", name: "Health", premium: "18,000" },
      { id: "life", name: "Life", premium: "9,999" },
      { id: "travel", name: "Travel", premium: "2,499" },
    ]
    return (
      <div className="w-96">
        <div className="mx-12">
          <Carousel opts={{ align: "start" }}>
            <CarouselContent className="-ml-4">
              {plans.map((plan) => (
                <CarouselItem key={plan.id} className="basis-1/3 pl-4">
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
        </div>
      </div>
    )
  },
}
