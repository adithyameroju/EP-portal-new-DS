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
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DashboardHeader, DashboardSidebar } from "./employer-dashboard"
import { PageHeading } from "./page-heading"

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
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{config.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <PageHeading
            title={config.title}
            description={config.description}
          />

          <section className="grid gap-6 md:grid-cols-2">
            <Link
              href={`/dashboard/endorsements/${action}/quick`}
              className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Card className="h-full transition-colors hover:bg-accent">
                <CardHeader>
                  <CardTitle>{config.quickTitle}</CardTitle>
                  <CardDescription>{config.quickDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="link" className="px-0" type="button">
                    <Zap />
                    Continue with {config.quickTitle.toLowerCase()}
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Card>
              <CardHeader>
                <CardTitle>{config.bulkTitle}</CardTitle>
                <CardDescription>{config.bulkDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="link" className="px-0" type="button" disabled>
                  <FileSpreadsheet />
                  Continue with {config.bulkTitle.toLowerCase()}
                </Button>
              </CardContent>
            </Card>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
