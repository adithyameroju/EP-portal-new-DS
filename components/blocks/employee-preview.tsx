"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Pencil, Send } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { CdImpactPanel } from "./cd-impact-panel"
import type { EmployeeAction } from "./employee-action-options"
import { DashboardHeader, DashboardSidebar } from "./employer-dashboard"
import { PageHeading } from "./page-heading"
import { WorkflowSteps } from "./workflow-steps"
import {
  addEndorsementSubmission,
  clearEndorsementDraft,
  loadEndorsementDraft,
  planLabel,
} from "@/lib/endorsement-session"

const titles: Record<EmployeeAction, string> = {
  add: "Preview employees",
  update: "Preview updates",
  delete: "Preview deletions",
}

export function EmployeePreview({ action }: { action: EmployeeAction }) {
  const router = useRouter()
  const [employees] = useState(() => {
    const draft = loadEndorsementDraft()
    if (!draft || draft.action !== action) return []
    return draft.employees
  })

  useEffect(() => {
    if (employees.length === 0) {
      router.replace(`/dashboard/endorsements/${action}/quick`)
    }
  }, [action, employees.length, router])

  const dependentCount = employees.reduce(
    (total, employee) => total + employee.dependents.length,
    0
  )

  function submitEndorsement() {
    addEndorsementSubmission({
      action,
      employeeCount: employees.length,
      dependentCount,
    })
    clearEndorsementDraft()
    router.push("/dashboard/endorsements?submitted=1")
  }

  if (employees.length === 0) {
    return null
  }

  return (
    <SidebarProvider className="lg:h-svh lg:min-h-0 lg:overflow-hidden">
      <DashboardSidebar activeItem="endorsements" />
      <SidebarInset className="min-w-0 bg-muted lg:h-svh lg:min-h-0 lg:overflow-hidden">
        <DashboardHeader />
        <main className="flex min-w-0 flex-1 flex-col lg:min-h-0 lg:overflow-hidden">
          <div className="flex flex-col gap-4 p-4 md:p-6 lg:min-h-0 lg:flex-1 lg:overflow-hidden">
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
                  <BreadcrumbLink
                    render={<Link href={`/dashboard/endorsements/${action}`} />}
                  >
                    {action === "add"
                      ? "Add employees"
                      : action === "update"
                        ? "Update employees"
                        : "Delete employees"}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    render={
                      <Link
                        href={`/dashboard/endorsements/${action}/quick`}
                      />
                    }
                  >
                    Quick {action}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Preview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <PageHeading
                title={titles[action]}
                description="Review every employee before submitting this endorsement."
              />
              <WorkflowSteps currentStep={3} />
            </section>

            <div className="grid min-w-0 gap-6 lg:min-h-0 lg:flex-1 lg:grid-cols-3 lg:overflow-hidden">
              <div className="flex min-w-0 flex-col gap-4 overflow-y-auto lg:col-span-2 lg:min-h-0">
                {employees.map((employee, index) => (
                  <Card key={employee.id}>
                    <CardHeader>
                      <CardTitle>
                        Employee {index + 1} · {employee.fullName}
                      </CardTitle>
                      <CardDescription>
                        {employee.employeeId} · {employee.email}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Date of birth</p>
                          <p className="font-medium">{employee.dateOfBirth}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Gender</p>
                          <p className="font-medium capitalize">
                            {employee.gender}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Date of joining</p>
                          <p className="font-medium">
                            {employee.dateOfJoining}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Mobile</p>
                          <p className="font-medium">
                            {employee.mobile || "—"}
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex flex-wrap gap-2">
                        {employee.gmcEnabled ? (
                          <Badge>
                            GMC {planLabel(employee.basePlan)}
                          </Badge>
                        ) : null}
                        {employee.gpaEnabled ? (
                          <Badge variant="secondary">
                            GPA {planLabel(employee.gpaBasePlan)}
                          </Badge>
                        ) : null}
                        {employee.secondaryPlan !== "none" ? (
                          <Badge variant="outline">
                            {planLabel(employee.secondaryPlan)}
                          </Badge>
                        ) : null}
                      </div>
                      {employee.dependents.length > 0 ? (
                        <>
                          <Separator />
                          <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium">Dependents</p>
                            <div className="flex flex-col gap-2">
                              {employee.dependents.map((dependent) => (
                                <div
                                  key={dependent.id}
                                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm"
                                >
                                  <span className="font-medium">
                                    {dependent.fullName}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {dependent.relation} · {dependent.gender} ·{" "}
                                    {dependent.dateOfBirth}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : null}
                    </CardContent>
                  </Card>
                ))}
              </div>
              <CdImpactPanel
                employees={employees}
                isCalculating={false}
                hasCalculated
              />
            </div>
          </div>
          <footer className="z-10 mt-auto flex shrink-0 flex-col gap-3 border-t border-border bg-card px-4 py-2 md:flex-row md:items-center md:justify-end">
            <Button
              variant="outline"
              size="lg"
              render={
                <Link href={`/dashboard/endorsements/${action}/quick`} />
              }
            >
              <Pencil />
              Edit
            </Button>
            <Button size="lg" type="button" onClick={submitEndorsement}>
              <Send />
              Submit endorsement
            </Button>
          </footer>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
