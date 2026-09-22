"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  Calculator,
  CircleAlert,
  CircleCheck,
  CreditCard,
  Plus,
  Shield,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { DashboardHeader } from "./employer-dashboard"
import type { EmployeeAction } from "./employee-action-options"

type EmployeeRecord = {
  id: number
  fullName: string
  employeeId: string
  email: string
  dateOfBirth: string
  gender: string
  dateOfJoining: string
  mobile: string
  gmcEnabled: boolean
  gpaEnabled: boolean
  basePlan: string
  dependents: string[]
}

const flowConfig = {
  add: {
    title: "Quick Add Employees",
    description: "Add up to five employees with plans and dependents.",
    submitLabel: "Calculate premium",
    submitVariant: "default" as const,
  },
  update: {
    title: "Quick Update Employees",
    description: "Update up to five employee profiles, plans, and dependents.",
    submitLabel: "Review updates",
    submitVariant: "default" as const,
  },
  delete: {
    title: "Quick Delete Employees",
    description: "Review up to five employees before removing their coverage.",
    submitLabel: "Review deletion",
    submitVariant: "destructive" as const,
  },
}

const dependentOptions = [
  "Spouse",
  "Son",
  "Daughter",
  "Father",
  "Mother",
  "Father-in-law",
  "Mother-in-law",
  "Brother",
  "Sister",
]

function createEmployee(id: number): EmployeeRecord {
  return {
    id,
    fullName: "",
    employeeId: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    dateOfJoining: "",
    mobile: "",
    gmcEnabled: true,
    gpaEnabled: false,
    basePlan: "base-3l",
    dependents: [],
  }
}

function createDummyEmployee(id: number): EmployeeRecord {
  return {
    ...createEmployee(id),
    fullName: id === 1 ? "Rahul Sharma" : `Demo Employee ${id}`,
    employeeId: `EMP${String(id).padStart(3, "0")}`,
    email: `employee${id}@acko.com`,
    dateOfBirth: "1992-06-15",
    gender: "male",
    dateOfJoining: "2026-01-10",
    mobile: `98765432${String(id).padStart(2, "0")}`,
  }
}

function isEmployeeComplete(employee: EmployeeRecord) {
  return Boolean(
    employee.fullName &&
      employee.employeeId &&
      employee.email &&
      employee.dateOfBirth &&
      employee.gender &&
      employee.dateOfJoining
  )
}

function BasicInformation({
  employee,
  onChange,
}: {
  employee: EmployeeRecord
  onChange: (patch: Partial<EmployeeRecord>) => void
}) {
  const complete = isEmployeeComplete(employee)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserRound className="size-5" />
          Basic information
        </CardTitle>
        <CardAction>
          <Badge variant={complete ? "default" : "destructive"}>
            {complete ? "Complete" : "Needs fix"}
          </Badge>
        </CardAction>
        <CardDescription>
          Enter the employee information required for policy enrollment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field data-invalid={!employee.fullName}>
            <FieldLabel htmlFor={`full-name-${employee.id}`}>
              Full name
            </FieldLabel>
            <Input
              id={`full-name-${employee.id}`}
              value={employee.fullName}
              onChange={(event) => onChange({ fullName: event.target.value })}
              placeholder="e.g. Rahul Sharma"
              aria-invalid={!employee.fullName}
            />
            <FieldError>
              {!employee.fullName ? "Full name is required." : null}
            </FieldError>
          </Field>
          <Field data-invalid={!employee.employeeId}>
            <FieldLabel htmlFor={`employee-id-${employee.id}`}>
              Employee ID
            </FieldLabel>
            <Input
              id={`employee-id-${employee.id}`}
              value={employee.employeeId}
              onChange={(event) => onChange({ employeeId: event.target.value })}
              placeholder="e.g. EMP001"
              aria-invalid={!employee.employeeId}
            />
            <FieldError>
              {!employee.employeeId ? "Employee ID is required." : null}
            </FieldError>
          </Field>
          <Field data-invalid={!employee.email}>
            <FieldLabel htmlFor={`email-${employee.id}`}>Email</FieldLabel>
            <Input
              id={`email-${employee.id}`}
              type="email"
              value={employee.email}
              onChange={(event) => onChange({ email: event.target.value })}
              placeholder="e.g. rahul@acko.com"
              aria-invalid={!employee.email}
            />
            <FieldError>
              {!employee.email ? "Email is required." : null}
            </FieldError>
          </Field>
          <Field data-invalid={!employee.dateOfBirth}>
            <FieldLabel htmlFor={`date-of-birth-${employee.id}`}>
              Date of birth
            </FieldLabel>
            <Input
              id={`date-of-birth-${employee.id}`}
              type="date"
              value={employee.dateOfBirth}
              onChange={(event) =>
                onChange({ dateOfBirth: event.target.value })
              }
              aria-invalid={!employee.dateOfBirth}
            />
            <FieldError>
              {!employee.dateOfBirth ? "Date of birth is required." : null}
            </FieldError>
          </Field>
          <Field data-invalid={!employee.gender}>
            <FieldLabel htmlFor={`gender-${employee.id}`}>Gender</FieldLabel>
            <Select
              value={employee.gender}
              onValueChange={(value) => value && onChange({ gender: value })}
              items={{ male: "Male", female: "Female", other: "Other" }}
            >
              <SelectTrigger
                id={`gender-${employee.id}`}
                aria-label="Select employee gender"
                aria-invalid={!employee.gender}
              >
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FieldError>
              {!employee.gender ? "Gender is required." : null}
            </FieldError>
          </Field>
          <Field data-invalid={!employee.dateOfJoining}>
            <FieldLabel htmlFor={`date-of-joining-${employee.id}`}>
              Date of joining
            </FieldLabel>
            <Input
              id={`date-of-joining-${employee.id}`}
              type="date"
              value={employee.dateOfJoining}
              onChange={(event) =>
                onChange({ dateOfJoining: event.target.value })
              }
              aria-invalid={!employee.dateOfJoining}
            />
            <FieldError>
              {!employee.dateOfJoining
                ? "Date of joining is required."
                : null}
            </FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor={`mobile-${employee.id}`}>
              Mobile number
            </FieldLabel>
            <Input
              id={`mobile-${employee.id}`}
              type="tel"
              value={employee.mobile}
              onChange={(event) => onChange({ mobile: event.target.value })}
              placeholder="e.g. 9876543210"
            />
            <FieldDescription>Optional</FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

function InsurancePlans({
  employee,
  onChange,
}: {
  employee: EmployeeRecord
  onChange: (patch: Partial<EmployeeRecord>) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="size-5" />
          Insurance plans
        </CardTitle>
        <CardAction>
          <Badge>Configured</Badge>
        </CardAction>
        <CardDescription>
          Enable the policies and select the employee&apos;s base plan.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2">
        <FieldSet className="rounded-lg border border-border p-4">
          <FieldLegend>GMC</FieldLegend>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor={`gmc-${employee.id}`}>
                Group medical cover
              </FieldLabel>
              <FieldDescription>
                Hospitalization, OPD, and medical coverage.
              </FieldDescription>
            </FieldContent>
            <Switch
              id={`gmc-${employee.id}`}
              checked={employee.gmcEnabled}
              onCheckedChange={(checked) =>
                onChange({ gmcEnabled: checked })
              }
            />
          </Field>
          {employee.gmcEnabled ? (
            <>
              <Field>
                <FieldLabel htmlFor={`base-plan-${employee.id}`}>
                  Base plan
                </FieldLabel>
                <Select
                  value={employee.basePlan}
                  onValueChange={(value) =>
                    value && onChange({ basePlan: value })
                  }
                  items={{
                    "base-3l": "Base Plan · 3L — ₹3,00,000",
                    "base-5l": "Base Plan · 5L — ₹5,00,000",
                  }}
                >
                  <SelectTrigger
                    id={`base-plan-${employee.id}`}
                    aria-label="Select GMC base plan"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="base-3l">
                      Base Plan · 3L — ₹3,00,000
                    </SelectItem>
                    <SelectItem value="base-5l">
                      Base Plan · 5L — ₹5,00,000
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" type="button">
                  <Plus />
                  Top-up plan
                </Button>
                <Button variant="outline" size="sm" type="button">
                  <Plus />
                  Add-on plan
                </Button>
                <Button variant="outline" size="sm" type="button">
                  <Plus />
                  Secondary plan
                </Button>
              </div>
            </>
          ) : null}
        </FieldSet>

        <FieldSet className="rounded-lg border border-border p-4">
          <FieldLegend>GPA</FieldLegend>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor={`gpa-${employee.id}`}>
                Group personal accident
              </FieldLabel>
              <FieldDescription>
                Accidental death and disability coverage.
              </FieldDescription>
            </FieldContent>
            <Switch
              id={`gpa-${employee.id}`}
              checked={employee.gpaEnabled}
              onCheckedChange={(checked) =>
                onChange({ gpaEnabled: checked })
              }
            />
          </Field>
        </FieldSet>
      </CardContent>
    </Card>
  )
}

function Dependents({
  employee,
  onChange,
}: {
  employee: EmployeeRecord
  onChange: (patch: Partial<EmployeeRecord>) => void
}) {
  function toggleDependent(dependent: string) {
    const selected = employee.dependents.includes(dependent)
    onChange({
      dependents: selected
        ? employee.dependents.filter((item) => item !== dependent)
        : [...employee.dependents, dependent],
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UsersRound className="size-5" />
          Dependents
        </CardTitle>
        <CardDescription>
          Add the relationships covered under this employee&apos;s policy.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Alert>
          <CircleAlert />
          <AlertDescription>
            Parents and in-laws require the GMC secondary plan to be enabled.
          </AlertDescription>
        </Alert>
        <div className="flex flex-wrap gap-2" aria-label="Dependent types">
          {dependentOptions.map((dependent) => {
            const selected = employee.dependents.includes(dependent)
            return (
              <Button
                key={dependent}
                type="button"
                size="sm"
                variant={selected ? "default" : "outline"}
                onClick={() => toggleDependent(dependent)}
              >
                <Plus />
                {dependent}
              </Button>
            )
          })}
        </div>
        {employee.dependents.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No dependents yet. Choose a relationship to add one.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {employee.dependents.length} dependent relationship
            {employee.dependents.length === 1 ? "" : "s"} selected.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function CdImpact({
  employees,
  estimate,
}: {
  employees: EmployeeRecord[]
  estimate: number
}) {
  return (
    <Card className="lg:sticky lg:top-20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="size-5" />
          Premium &amp; CD impact
        </CardTitle>
        <CardDescription>
          Estimated impact for the employees in this endorsement.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ItemGroup>
          <Item variant="muted">
            <ItemMedia>
              <CreditCard className="size-4" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Current CD balance</ItemTitle>
              <ItemDescription>Available balance</ItemDescription>
            </ItemContent>
            <ItemActions className="font-semibold">₹48,50,000</ItemActions>
          </Item>
          <Item variant="muted">
            <ItemMedia>
              <UsersRound className="size-4" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Employees</ItemTitle>
              <ItemDescription>Included in this request</ItemDescription>
            </ItemContent>
            <ItemActions className="font-semibold">
              {employees.length}
            </ItemActions>
          </Item>
        </ItemGroup>
        <Alert>
          <Calculator />
          <AlertDescription>
            {estimate > 0
              ? `Estimated premium impact: ₹${estimate.toLocaleString("en-IN")}`
              : "Complete employee details to calculate the premium impact."}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

export function EmployeeQuickFlow({
  action,
}: {
  action: EmployeeAction
}) {
  const config = flowConfig[action]
  const [employees, setEmployees] = useState<EmployeeRecord[]>([
    createEmployee(1),
  ])
  const [activeEmployee, setActiveEmployee] = useState("employee-1")

  const currentIndex = Math.max(
    0,
    employees.findIndex(
      (employee) => `employee-${employee.id}` === activeEmployee
    )
  )
  const completedProfiles = employees.filter(isEmployeeComplete).length
  const dependentCount = employees.reduce(
    (total, employee) => total + employee.dependents.length,
    0
  )
  const estimate = useMemo(
    () =>
      completedProfiles > 0
        ? completedProfiles * 2500 + dependentCount * 1200
        : 0,
    [completedProfiles, dependentCount]
  )

  function updateCurrentEmployee(patch: Partial<EmployeeRecord>) {
    setEmployees((current) =>
      current.map((employee, index) =>
        index === currentIndex ? { ...employee, ...patch } : employee
      )
    )
  }

  function addEmployee() {
    if (employees.length >= 5) return
    const nextId = employees.length + 1
    setEmployees((current) => [...current, createEmployee(nextId)])
    setActiveEmployee(`employee-${nextId}`)
  }

  function prefillData() {
    setEmployees((current) =>
      current.map((employee) => createDummyEmployee(employee.id))
    )
  }

  return (
    <SidebarProvider>
      <SidebarInset className="min-w-0 bg-muted">
        <DashboardHeader />
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-col gap-6 p-4 md:p-6">
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
                  <BreadcrumbLink
                    render={
                      <Link href={`/dashboard/endorsements/${action}`} />
                    }
                  >
                    {flowConfig[action].title.replace("Quick ", "")}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>{config.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  {config.title}
                </h1>
                <p className="text-muted-foreground">{config.description}</p>
              </div>
              <Button variant="outline" type="button" onClick={prefillData}>
                <Sparkles />
                Prefill data
              </Button>
            </section>

            <Alert>
              {completedProfiles === employees.length ? (
                <CircleCheck />
              ) : (
                <CircleAlert />
              )}
              <AlertDescription>
                {completedProfiles === employees.length
                  ? "All employee profiles have the required information."
                  : `${employees.length - completedProfiles} employee ${
                      employees.length - completedProfiles === 1 ? "has" : "have"
                    } missing required information.`}
              </AlertDescription>
            </Alert>

            <Tabs
              value={activeEmployee}
              onValueChange={setActiveEmployee}
              className="min-w-0"
            >
              <div className="flex flex-wrap items-center gap-2">
                <TabsList>
                  {employees.map((employee, index) => (
                    <TabsTrigger
                      key={employee.id}
                      value={`employee-${employee.id}`}
                    >
                      Employee {index + 1}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <Button
                  variant="outline"
                  type="button"
                  onClick={addEmployee}
                  disabled={employees.length >= 5}
                >
                  <Plus />
                  Add employee {Math.min(employees.length + 1, 5)}/5
                </Button>
              </div>

              {employees.map((employee) => (
                <TabsContent
                  key={employee.id}
                  value={`employee-${employee.id}`}
                >
                  <div className="grid min-w-0 gap-6 pt-4 lg:grid-cols-3">
                    <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
                      <BasicInformation
                        employee={employee}
                        onChange={updateCurrentEmployee}
                      />
                      <InsurancePlans
                        employee={employee}
                        onChange={updateCurrentEmployee}
                      />
                      <Dependents
                        employee={employee}
                        onChange={updateCurrentEmployee}
                      />
                    </div>
                    <CdImpact employees={employees} estimate={estimate} />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <footer className="sticky bottom-0 z-10 mt-auto flex flex-col gap-4 border-t border-border bg-card p-4 md:flex-row md:items-center md:justify-between">
            <ItemGroup className="grid gap-2 sm:grid-cols-3">
              <Item variant="muted" size="sm">
                <ItemMedia>
                  <UsersRound className="size-4" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Employees</ItemTitle>
                  <ItemDescription>{employees.length}</ItemDescription>
                </ItemContent>
              </Item>
              <Item variant="muted" size="sm">
                <ItemMedia>
                  <CircleCheck className="size-4" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Profiles complete</ItemTitle>
                  <ItemDescription>
                    {completedProfiles} / {employees.length}
                  </ItemDescription>
                </ItemContent>
              </Item>
              <Item variant="muted" size="sm">
                <ItemMedia>
                  <UsersRound className="size-4" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Dependents</ItemTitle>
                  <ItemDescription>{dependentCount}</ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
            <Button
              size="lg"
              type="button"
              variant={config.submitVariant}
              disabled={completedProfiles !== employees.length}
            >
              <Calculator />
              {config.submitLabel}
            </Button>
          </footer>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
