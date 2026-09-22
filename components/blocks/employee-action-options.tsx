"use client"

import Link from "next/link"
import {
  FileSpreadsheet,
  UserMinus,
  UserPen,
  UserPlus,
  Zap,
} from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DashboardHeader, DashboardSidebar } from "./employer-dashboard"

export type EmployeeAction = "add" | "update" | "delete"

const actionConfig = {
  add: {
    title: "Add employees",
    description: "Choose how you want to add employees to the selected entity.",
    quickTitle: "Quick add",
    quickDescription:
      "Add up to five employees with policy plans and dependents.",
    bulkTitle: "Bulk add",
    bulkDescription: "Add a larger employee list using a spreadsheet.",
    icon: UserPlus,
  },
  update: {
    title: "Update employees",
    description: "Choose how you want to update employee information.",
    quickTitle: "Quick update",
    quickDescription:
      "Update up to five employee profiles, plans, and dependents.",
    bulkTitle: "Bulk update",
    bulkDescription: "Update multiple employee records from a spreadsheet.",
    icon: UserPen,
  },
  delete: {
    title: "Delete employees",
    description: "Choose how you want to remove employees from the policy.",
    quickTitle: "Quick delete",
    quickDescription:
      "Review and remove up to five employees from the selected entity.",
    bulkTitle: "Bulk delete",
    bulkDescription: "Remove multiple employees using a spreadsheet.",
    icon: UserMinus,
  },
} satisfies Record<EmployeeAction, object>

export function EmployeeActionOptions({
  action,
}: {
  action: EmployeeAction
}) {
  const config = actionConfig[action] as (typeof actionConfig)[EmployeeAction]
  const ActionIcon = config.icon

  return (
    <SidebarProvider>
      <DashboardSidebar activeItem="endorsements" />
      <SidebarInset className="min-w-0 bg-muted">
        <DashboardHeader />
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 p-4 md:p-6 lg:p-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  render={<Link href="/dashboard/endorsements" />}
                >
                  Endorsements
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>{config.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <section className="flex flex-col gap-2">
            <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <ActionIcon className="size-5" />
            </span>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {config.title}
            </h1>
            <p className="text-muted-foreground">{config.description}</p>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{config.quickTitle}</CardTitle>
                <CardAction>
                  <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Zap className="size-5" />
                  </span>
                </CardAction>
                <CardDescription>{config.quickDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Best for small changes that need individual review.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  render={
                    <Link
                      href={`/dashboard/endorsements/${action}/quick`}
                    />
                  }
                >
                  Choose {config.quickTitle.toLowerCase()}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{config.bulkTitle}</CardTitle>
                <CardAction>
                  <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <FileSpreadsheet className="size-5" />
                  </span>
                </CardAction>
                <CardDescription>{config.bulkDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Best for larger changes prepared in a standard template.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" type="button" disabled>
                  Choose {config.bulkTitle.toLowerCase()}
                </Button>
              </CardFooter>
            </Card>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
