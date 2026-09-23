"use client"

import { Fragment } from "react"
import Link from "next/link"
import { ArrowLeft, House } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type PageBreadcrumbItem = {
  label: string
  href?: string
}

export function PageBreadcrumb({
  backHref,
  backLabel,
  items,
}: {
  backHref: string
  backLabel: string
  items: PageBreadcrumbItem[]
}) {
  return (
    <div className="flex min-w-0 items-center gap-4">
      <Button
        nativeButton={false}
        render={<Link href={backHref} />}
        variant="secondary"
        className="shrink-0"
      >
        <ArrowLeft />
        {backLabel}
      </Button>
      <Separator orientation="vertical" className="h-8" />
      <Breadcrumb className="min-w-0">
        <BreadcrumbList className="flex-nowrap overflow-hidden">
          {items.map((item, index) => {
            const isCurrent = index === items.length - 1
            return (
              <Fragment key={`${item.label}-${index}`}>
                {index > 0 ? <BreadcrumbSeparator /> : null}
                <BreadcrumbItem className="min-w-0">
                  {isCurrent || !item.href ? (
                    <BreadcrumbPage className="flex min-w-0 items-center gap-2 truncate font-medium">
                      {index === 0 ? (
                        <House className="size-4 shrink-0" />
                      ) : null}
                      <span className="truncate">{item.label}</span>
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      render={<Link href={item.href} />}
                      className="flex min-w-0 items-center gap-2 truncate"
                    >
                      {index === 0 ? (
                        <House className="size-4 shrink-0" />
                      ) : null}
                      <span className="truncate">{item.label}</span>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
