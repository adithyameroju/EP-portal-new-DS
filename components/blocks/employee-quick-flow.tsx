"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  Calculator,
  CircleAlert,
  CircleCheck,
  CreditCard,
  Heart,
  Plus,
  Shield,
  Sparkles,
  Trash2,
  UserRound,
  UsersRound,
  X,
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
import { Checkbox } from "@/components/ui/checkbox"
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
import { Separator } from "@/components/ui/separator"
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
  secondaryPlanEnabled: boolean
  dependents: DependentRecord[]
}

type DependentRecord = {
  id: number
  relation: string
  fullName: string
  dateOfBirth: string
  gender: string
  sameAsEmployee: boolean
}

type RequiredEmployeeField =
  | "fullName"
  | "employeeId"
  | "email"
  | "dateOfBirth"
  | "gender"
  | "dateOfJoining"

type TouchedFields = Record<number, Record<string, boolean>>

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

const requiredEmployeeFields: RequiredEmployeeField[] = [
  "fullName",
  "employeeId",
  "email",
  "dateOfBirth",
  "gender",
  "dateOfJoining",
]

const dependentOptions = [
  { label: "Spouse", requiresSecondaryPlan: false },
  { label: "Son", requiresSecondaryPlan: false },
  { label: "Daughter", requiresSecondaryPlan: false },
  { label: "Father", requiresSecondaryPlan: true },
  { label: "Mother", requiresSecondaryPlan: true },
  { label: "Father-in-law", requiresSecondaryPlan: true },
  { label: "Mother-in-law", requiresSecondaryPlan: true },
  { label: "Brother", requiresSecondaryPlan: false },
  { label: "Sister", requiresSecondaryPlan: false },
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
    secondaryPlanEnabled: false,
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

function createDummyDependent(
  dependent: DependentRecord,
  index: number
): DependentRecord {
  return {
    ...dependent,
    fullName: `${dependent.relation} ${index + 1}`,
    dateOfBirth: "1995-08-20",
    gender: dependent.relation === "Son" ? "male" : "female",
  }
}

function isDependentComplete(dependent: DependentRecord) {
  return Boolean(
    dependent.fullName && dependent.dateOfBirth && dependent.gender
  )
}

function isEmployeeComplete(employee: EmployeeRecord) {
  return Boolean(
    employee.fullName &&
      employee.employeeId &&
      employee.email &&
      employee.dateOfBirth &&
      employee.gender &&
      employee.dateOfJoining &&
      employee.dependents.every(isDependentComplete)
  )
}

function BasicInformation({
  employee,
  touched,
  onChange,
  onTouch,
}: {
  employee: EmployeeRecord
  touched: Record<string, boolean>
  onChange: (patch: Partial<EmployeeRecord>) => void
  onTouch: (field: string) => void
}) {
  const complete = isEmployeeComplete(employee)
  const attempted = requiredEmployeeFields.some((field) => touched[field])

  function showError(field: RequiredEmployeeField) {
    return Boolean(touched[field] && !employee[field])
  }

  return (
    <FieldSet>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <FieldLegend className="flex items-center gap-2">
          <UserRound className="size-5" />
          Basic information
          </FieldLegend>
          <FieldDescription>
            Enter the employee information required for policy enrollment.
          </FieldDescription>
        </div>
        <Badge
          variant={complete ? "default" : attempted ? "destructive" : "secondary"}
        >
          {complete ? "Complete" : attempted ? "Needs fix" : "Not started"}
        </Badge>
      </div>
      <FieldGroup className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field data-invalid={showError("fullName") || undefined}>
          <FieldLabel htmlFor={`full-name-${employee.id}`}>
            Full name
          </FieldLabel>
          <Input
            id={`full-name-${employee.id}`}
            value={employee.fullName}
            onChange={(event) => onChange({ fullName: event.target.value })}
            onBlur={() => onTouch("fullName")}
            placeholder="e.g. Rahul Sharma"
            aria-invalid={showError("fullName") || undefined}
          />
          <FieldError>
            {showError("fullName") ? "Full name is required." : null}
          </FieldError>
        </Field>
        <Field data-invalid={showError("employeeId") || undefined}>
          <FieldLabel htmlFor={`employee-id-${employee.id}`}>
            Employee ID
          </FieldLabel>
          <Input
            id={`employee-id-${employee.id}`}
            value={employee.employeeId}
            onChange={(event) => onChange({ employeeId: event.target.value })}
            onBlur={() => onTouch("employeeId")}
            placeholder="e.g. EMP001"
            aria-invalid={showError("employeeId") || undefined}
          />
          <FieldError>
            {showError("employeeId") ? "Employee ID is required." : null}
          </FieldError>
        </Field>
        <Field data-invalid={showError("email") || undefined}>
          <FieldLabel htmlFor={`email-${employee.id}`}>Email</FieldLabel>
          <Input
            id={`email-${employee.id}`}
            type="email"
            value={employee.email}
            onChange={(event) => onChange({ email: event.target.value })}
            onBlur={() => onTouch("email")}
            placeholder="e.g. rahul@acko.com"
            aria-invalid={showError("email") || undefined}
          />
          <FieldError>
            {showError("email") ? "Email is required." : null}
          </FieldError>
        </Field>
        <Field data-invalid={showError("dateOfBirth") || undefined}>
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
            onBlur={() => onTouch("dateOfBirth")}
            aria-invalid={showError("dateOfBirth") || undefined}
          />
          <FieldError>
            {showError("dateOfBirth") ? "Date of birth is required." : null}
          </FieldError>
        </Field>
        <Field data-invalid={showError("gender") || undefined}>
          <FieldLabel htmlFor={`gender-${employee.id}`}>Gender</FieldLabel>
          <Select
            value={employee.gender}
            onValueChange={(value) => value && onChange({ gender: value })}
            items={{ male: "Male", female: "Female", other: "Other" }}
          >
            <SelectTrigger
              id={`gender-${employee.id}`}
              aria-label="Select employee gender"
              aria-invalid={showError("gender") || undefined}
              onBlur={() => onTouch("gender")}
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
            {showError("gender") ? "Gender is required." : null}
          </FieldError>
        </Field>
        <Field data-invalid={showError("dateOfJoining") || undefined}>
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
            onBlur={() => onTouch("dateOfJoining")}
            aria-invalid={showError("dateOfJoining") || undefined}
          />
          <FieldError>
            {showError("dateOfJoining")
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
    </FieldSet>
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
    <FieldSet>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <FieldLegend className="flex items-center gap-2">
            <Shield className="size-5" />
            Insurance plans
          </FieldLegend>
          <FieldDescription>
            Enable the policies and select the employee&apos;s base plan.
          </FieldDescription>
        </div>
        <Badge>Configured</Badge>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
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
                <Button
                  variant={
                    employee.secondaryPlanEnabled ? "default" : "outline"
                  }
                  size="sm"
                  type="button"
                  onClick={() =>
                    onChange({
                      secondaryPlanEnabled: !employee.secondaryPlanEnabled,
                    })
                  }
                >
                  {employee.secondaryPlanEnabled ? (
                    <CircleCheck />
                  ) : (
                    <Plus />
                  )}
                  {employee.secondaryPlanEnabled
                    ? "Secondary plan added"
                    : "Secondary plan"}
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
      </div>
    </FieldSet>
  )
}

function Dependents({
  employee,
  touched,
  onChange,
  onTouch,
}: {
  employee: EmployeeRecord
  touched: Record<string, boolean>
  onChange: (patch: Partial<EmployeeRecord>) => void
  onTouch: (field: string) => void
}) {
  const dependentsComplete = employee.dependents.every(isDependentComplete)
  const attempted = Object.keys(touched).some((key) =>
    key.startsWith("dependent-")
  )

  function addDependent(relation: string) {
    if (employee.dependents.some((item) => item.relation === relation)) return
    const nextId =
      Math.max(0, ...employee.dependents.map((dependent) => dependent.id)) + 1
    onChange({
      dependents: [
        ...employee.dependents,
        {
          id: nextId,
          relation,
          fullName: "",
          dateOfBirth: "",
          gender: "",
          sameAsEmployee: true,
        },
      ],
    })
  }

  function updateDependent(
    dependentId: number,
    patch: Partial<DependentRecord>
  ) {
    onChange({
      dependents: employee.dependents.map((dependent) =>
        dependent.id === dependentId
          ? { ...dependent, ...patch }
          : dependent
      ),
    })
  }

  function removeDependent(dependentId: number) {
    onChange({
      dependents: employee.dependents.filter(
        (dependent) => dependent.id !== dependentId
      ),
    })
  }

  return (
    <FieldSet>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <FieldLegend className="flex items-center gap-2">
            <UsersRound className="size-5" />
            Dependents
          </FieldLegend>
          <FieldDescription>
            Add the relationships covered under this employee&apos;s policy.
          </FieldDescription>
        </div>
        <div className="flex items-center gap-2">
          {!dependentsComplete && attempted ? (
            <Badge variant="destructive">Needs fix</Badge>
          ) : null}
          <Badge variant="secondary">
            {employee.dependents.length} added
          </Badge>
        </div>
      </div>
      <Alert>
        <CircleAlert />
        <AlertDescription>
          Parents and in-laws require the GMC secondary plan to be enabled.
        </AlertDescription>
      </Alert>
      <div className="flex flex-wrap gap-2" aria-label="Dependent types">
        {dependentOptions.map((option) => {
          const selected = employee.dependents.some(
            (dependent) => dependent.relation === option.label
          )
          const disabled =
            option.requiresSecondaryPlan && !employee.secondaryPlanEnabled
          return (
            <Button
              key={option.label}
              type="button"
              size="sm"
              variant={selected ? "secondary" : "outline"}
              disabled={disabled}
              onClick={() => addDependent(option.label)}
            >
              {selected ? <CircleCheck /> : <Plus />}
              {option.label}
            </Button>
          )
        })}
      </div>

      {employee.dependents.length === 0 ? (
        <FieldDescription>
          No dependents yet. Choose a relationship to add one.
        </FieldDescription>
      ) : (
        <div className="flex flex-col gap-4">
          {employee.dependents.map((dependent, index) => {
            const fullNameKey = `dependent-${dependent.id}-fullName`
            const dateOfBirthKey = `dependent-${dependent.id}-dateOfBirth`
            const genderKey = `dependent-${dependent.id}-gender`
            const showFullNameError =
              touched[fullNameKey] && !dependent.fullName
            const showDateOfBirthError =
              touched[dateOfBirthKey] && !dependent.dateOfBirth
            const showGenderError = touched[genderKey] && !dependent.gender

            return (
              <FieldSet
                key={dependent.id}
                className="rounded-lg border border-border p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <FieldLegend className="flex items-center gap-2">
                    <Heart className="size-4 text-primary" />
                    {dependent.relation} · Dependent {index + 1}
                  </FieldLegend>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove ${dependent.relation}`}
                    onClick={() => removeDependent(dependent.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
                <FieldGroup className="grid gap-4 md:grid-cols-3">
                  <Field data-invalid={showFullNameError || undefined}>
                    <FieldLabel
                      htmlFor={`dependent-name-${employee.id}-${dependent.id}`}
                    >
                      Full name
                    </FieldLabel>
                    <Input
                      id={`dependent-name-${employee.id}-${dependent.id}`}
                      value={dependent.fullName}
                      onChange={(event) =>
                        updateDependent(dependent.id, {
                          fullName: event.target.value,
                        })
                      }
                      onBlur={() => onTouch(fullNameKey)}
                      placeholder="Enter name"
                      aria-invalid={showFullNameError || undefined}
                    />
                    <FieldError>
                      {showFullNameError ? "Full name is required." : null}
                    </FieldError>
                  </Field>
                  <Field data-invalid={showDateOfBirthError || undefined}>
                    <FieldLabel
                      htmlFor={`dependent-dob-${employee.id}-${dependent.id}`}
                    >
                      Date of birth
                    </FieldLabel>
                    <Input
                      id={`dependent-dob-${employee.id}-${dependent.id}`}
                      type="date"
                      value={dependent.dateOfBirth}
                      onChange={(event) =>
                        updateDependent(dependent.id, {
                          dateOfBirth: event.target.value,
                        })
                      }
                      onBlur={() => onTouch(dateOfBirthKey)}
                      aria-invalid={showDateOfBirthError || undefined}
                    />
                    <FieldError>
                      {showDateOfBirthError
                        ? "Date of birth is required."
                        : null}
                    </FieldError>
                  </Field>
                  <Field data-invalid={showGenderError || undefined}>
                    <FieldLabel
                      htmlFor={`dependent-gender-${employee.id}-${dependent.id}`}
                    >
                      Gender
                    </FieldLabel>
                    <Select
                      value={dependent.gender}
                      onValueChange={(value) =>
                        value &&
                        updateDependent(dependent.id, { gender: value })
                      }
                      items={{
                        male: "Male",
                        female: "Female",
                        other: "Other",
                      }}
                    >
                      <SelectTrigger
                        id={`dependent-gender-${employee.id}-${dependent.id}`}
                        aria-label={`${dependent.relation} gender`}
                        aria-invalid={showGenderError || undefined}
                        onBlur={() => onTouch(genderKey)}
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError>
                      {showGenderError ? "Gender is required." : null}
                    </FieldError>
                  </Field>
                </FieldGroup>
                <Separator />
                <FieldSet>
                  <FieldLegend>GMC plans</FieldLegend>
                  <Field orientation="horizontal">
                    <Checkbox
                      id={`same-plan-${employee.id}-${dependent.id}`}
                      checked={dependent.sameAsEmployee}
                      onCheckedChange={(checked) =>
                        updateDependent(dependent.id, {
                          sameAsEmployee: checked,
                        })
                      }
                    />
                    <FieldContent>
                      <FieldLabel
                        htmlFor={`same-plan-${employee.id}-${dependent.id}`}
                      >
                        Same as employee
                      </FieldLabel>
                      <FieldDescription>
                        Apply the employee&apos;s selected GMC plan.
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                  <Alert>
                    <Shield />
                    <AlertDescription>
                      Inherited from employee · Base Plan ·{" "}
                      {employee.basePlan === "base-5l" ? "5L" : "3L"}
                    </AlertDescription>
                  </Alert>
                </FieldSet>
              </FieldSet>
            )
          })}
        </div>
      )}
    </FieldSet>
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
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({})

  const currentIndex = Math.max(
    0,
    employees.findIndex(
      (employee) => `employee-${employee.id}` === activeEmployee
    )
  )
  const completedProfiles = employees.filter(isEmployeeComplete).length
  const allProfilesComplete = completedProfiles === employees.length
  const hasAttemptedValidation = Object.values(touchedFields).some(
    (fields) => Object.keys(fields).length > 0
  )
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

  function touchField(employeeId: number, field: string) {
    setTouchedFields((current) => ({
      ...current,
      [employeeId]: {
        ...current[employeeId],
        [field]: true,
      },
    }))
  }

  function touchEmployee(employee: EmployeeRecord) {
    const fields = requiredEmployeeFields.reduce<Record<string, boolean>>(
      (result, field) => ({ ...result, [field]: true }),
      {}
    )
    employee.dependents.forEach((dependent) => {
      fields[`dependent-${dependent.id}-fullName`] = true
      fields[`dependent-${dependent.id}-dateOfBirth`] = true
      fields[`dependent-${dependent.id}-gender`] = true
    })
    setTouchedFields((current) => ({
      ...current,
      [employee.id]: {
        ...current[employee.id],
        ...fields,
      },
    }))
  }

  function changeActiveEmployee(value: string) {
    touchEmployee(employees[currentIndex])
    setActiveEmployee(value)
  }

  function addEmployee() {
    if (employees.length >= 5) return
    touchEmployee(employees[currentIndex])
    const nextId = Math.max(...employees.map((employee) => employee.id)) + 1
    setEmployees((current) => [...current, createEmployee(nextId)])
    setActiveEmployee(`employee-${nextId}`)
  }

  function removeEmployee(employeeId: number) {
    if (employees.length === 1) return
    const removedIndex = employees.findIndex(
      (employee) => employee.id === employeeId
    )
    const remaining = employees.filter(
      (employee) => employee.id !== employeeId
    )
    setEmployees(remaining)
    setTouchedFields((current) => {
      const next = { ...current }
      delete next[employeeId]
      return next
    })
    if (activeEmployee === `employee-${employeeId}`) {
      const nextEmployee =
        remaining[Math.min(removedIndex, remaining.length - 1)]
      setActiveEmployee(`employee-${nextEmployee.id}`)
    }
  }

  function prefillData() {
    setEmployees((current) =>
      current.map((employee) => ({
        ...createDummyEmployee(employee.id),
        secondaryPlanEnabled: employee.secondaryPlanEnabled,
        dependents: employee.dependents.map(createDummyDependent),
      }))
    )
  }

  function validateAllEmployees() {
    employees.forEach(touchEmployee)
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

            {allProfilesComplete ? (
              <Alert>
                <CircleCheck />
                <AlertDescription>
                  All employee profiles have the required information.
                </AlertDescription>
              </Alert>
            ) : hasAttemptedValidation ? (
              <Alert variant="destructive">
                <CircleAlert />
                <AlertDescription>
                  {employees.length - completedProfiles} employee{" "}
                  {employees.length - completedProfiles === 1 ? "has" : "have"}{" "}
                  missing required information.
                </AlertDescription>
              </Alert>
            ) : null}

            <Tabs
              value={activeEmployee}
              onValueChange={changeActiveEmployee}
              className="min-w-0"
            >
              <div className="grid min-w-0 gap-6 lg:grid-cols-3">
                <Card className="min-w-0 lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Employee details</CardTitle>
                    <CardAction>
                      <Button
                        variant="outline"
                        type="button"
                        onClick={addEmployee}
                        disabled={employees.length >= 5}
                      >
                        <Plus />
                        Add employee {Math.min(employees.length + 1, 5)}/5
                      </Button>
                    </CardAction>
                    <CardDescription>
                      Complete basic information, insurance plans, and
                      dependents for each employee.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="min-w-0">
                    <TabsList className="max-w-full flex-wrap justify-start group-data-horizontal/tabs:h-auto">
                      {employees.map((employee, index) => (
                        <div
                          key={employee.id}
                          className="flex items-center rounded-md"
                        >
                          <TabsTrigger
                            value={`employee-${employee.id}`}
                            className="flex-none"
                          >
                            Employee {index + 1}
                          </TabsTrigger>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            type="button"
                            disabled={employees.length === 1}
                            aria-label={`Remove employee ${index + 1}`}
                            onClick={() => removeEmployee(employee.id)}
                          >
                            <X />
                          </Button>
                        </div>
                      ))}
                    </TabsList>

                    {employees.map((employee) => (
                      <TabsContent
                        key={employee.id}
                        value={`employee-${employee.id}`}
                      >
                        <div className="flex flex-col gap-6 pt-6">
                          <BasicInformation
                            employee={employee}
                            touched={touchedFields[employee.id] ?? {}}
                            onChange={updateCurrentEmployee}
                            onTouch={(field) =>
                              touchField(employee.id, field)
                            }
                          />
                          <Separator />
                          <InsurancePlans
                            employee={employee}
                            onChange={updateCurrentEmployee}
                          />
                          <Separator />
                          <Dependents
                            employee={employee}
                            touched={touchedFields[employee.id] ?? {}}
                            onChange={updateCurrentEmployee}
                            onTouch={(field) =>
                              touchField(employee.id, field)
                            }
                          />
                        </div>
                      </TabsContent>
                    ))}
                  </CardContent>
                </Card>
                <CdImpact employees={employees} estimate={estimate} />
              </div>
            </Tabs>
          </div>

          <footer className="z-10 mt-auto flex flex-col gap-4 border-t border-border bg-card p-4 md:sticky md:bottom-0 md:flex-row md:items-center md:justify-between">
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
              onClick={validateAllEmployees}
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
