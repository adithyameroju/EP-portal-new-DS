"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  CircleUserRound,
  EllipsisVertical,
  FileText,
  Info,
  Pencil,
  Send,
  ShieldCheck,
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
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
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
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DashboardHeader, DashboardSidebar } from "./employer-dashboard"

const basicInformation = [
  { label: "Employee ID", value: "EMP001" },
  { label: "Join Date", value: "2024-01-10" },
  { label: "Employee Type", value: "Full-time" },
]

const contactDetails = [
  { label: "Email", value: "john.doe@company.com", isLink: true },
  { label: "Phone", value: "+91 98765 43210" },
  { label: "Location", value: "Mumbai" },
  { label: "Emergency Contact", value: "+91 98765 43220" },
]

const organizationDetails = [
  { label: "Manager", value: "Sarah Wilson" },
  { label: "Org Hierarchy", value: "View Organization Chart", isLink: true },
]

const familyMembers = [
  { name: "Emily Doe", relation: "Spouse", age: "34 years" },
  { name: "Mike Doe", relation: "Son", age: "8 years" },
  { name: "Sarah Doe", relation: "Daughter", age: "4 years" },
]

const documents = [
  { id: "CLM001", status: "Processing" },
  { id: "CLM001", status: "Approved" },
  { id: "CLM001", status: "Processing" },
] as const

const editableEmployeeFields = [
  {
    id: "full-name",
    label: "Full Name",
    currentValue: "John Doe",
    type: "text",
    instruction: "Legal name as per documents",
  },
  {
    id: "email-address",
    label: "Email Address",
    currentValue: "john.doe@company.com",
    type: "email",
    instruction: "Official company email",
  },
  {
    id: "phone-number",
    label: "Phone Number",
    currentValue: "+91 98765 43210",
    type: "tel",
    instruction: "Primary contact number",
  },
  {
    id: "department",
    label: "Department",
    currentValue: "Engineering",
    type: "text",
    instruction: "Current department assignment",
  },
  {
    id: "position",
    label: "Position",
    currentValue: "Senior Developer",
    type: "text",
    instruction: "Job title or designation",
  },
  {
    id: "location",
    label: "Location",
    currentValue: "Mumbai",
    type: "text",
    instruction: "Work location or office",
  },
  {
    id: "emergency-contact",
    label: "Emergency Contact",
    currentValue: "+91 98765 43210",
    type: "tel",
    instruction: "Emergency contact number",
  },
  {
    id: "manager",
    label: "Manager",
    currentValue: "Sarah Wilson",
    type: "text",
    instruction: "Direct reporting manager",
  },
]

function DetailItem({
  label,
  value,
}: {
  label: string
  value: ReactNode
}) {
  return (
    <Item className="items-start p-0">
      <ItemMedia>
        <CircleUserRound className="size-4" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </ItemTitle>
        <ItemDescription className="text-lg font-medium text-foreground">
          {value}
        </ItemDescription>
      </ItemContent>
    </Item>
  )
}

function InformationColumn({
  title,
  items,
  children,
}: {
  title: string
  items: Array<{ label: string; value: string; isLink?: boolean }>
  children?: ReactNode
}) {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-base font-medium uppercase">{title}</h2>
      <ItemGroup className="gap-4">
        {items.map((item) => (
          <DetailItem
            key={item.label}
            label={item.label}
            value={
              item.isLink ? (
                <Button variant="link" type="button">
                  {item.value}
                </Button>
              ) : (
                item.value
              )
            }
          />
        ))}
        {children}
      </ItemGroup>
    </section>
  )
}

function EmployeeInformationCard() {
  return (
    <Card>
      <CardContent className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        <InformationColumn title="Basic Information" items={basicInformation}>
          <DetailItem label="Status" value={<Badge>Active</Badge>} />
        </InformationColumn>
        <InformationColumn title="Contact Details" items={contactDetails} />
        <InformationColumn title="Organization" items={organizationDetails} />
      </CardContent>
    </Card>
  )
}

function FamilyMembersCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <UsersRound className="size-5" />
          Family members
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          {familyMembers.map((member) => (
            <Item key={member.name} variant="muted">
              <ItemMedia className="size-10 rounded-full bg-accent">
                <UserRound className="size-5" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="text-lg">{member.name}</ItemTitle>
                <ItemDescription>
                  {member.relation}&nbsp; • &nbsp;{member.age}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge>Covered</Badge>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}

function PolicyDetailsCard({ policyNumber }: { policyNumber: string }) {
  const details = [
    { label: "Policy number", value: policyNumber },
    { label: "Coverage", value: "₹5,00,000" },
    { label: "Premium", value: "₹12,000/year" },
    { label: "Status", value: <Badge key="status">Active</Badge> },
    { label: "Start Date", value: "2024-01-01" },
    { label: "End Date", value: "2024-01-01" },
    { label: "Assigned to", value: "ACKO General Insurance" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <ShieldCheck className="size-5" />
          Policy details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ItemGroup className="grid gap-4 sm:grid-cols-2">
          {details.map((detail) => (
            <DetailItem
              key={detail.label}
              label={detail.label}
              value={detail.value}
            />
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}

function DocumentsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <FileText className="size-5" />
          Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          {documents.map((document, index) => (
            <Item key={`${document.id}-${index}`} variant="muted">
              <ItemMedia className="size-10 rounded-full bg-accent">
                <FileText className="size-5" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="text-lg">{document.id}</ItemTitle>
                <ItemDescription>
                  2024-01-15&nbsp; • &nbsp;Consultation
                </ItemDescription>
              </ItemContent>
              <ItemActions className="flex-col items-end gap-2">
                <span className="text-lg font-medium">₹2,500</span>
                <Badge
                  variant={
                    document.status === "Approved" ? "default" : "outline"
                  }
                >
                  {document.status}
                </Badge>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}

function EditEmployeeDialog() {
  const [open, setOpen] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="lg" type="button">
            <Pencil />
            Edit employee details
          </Button>
        }
      />
      <DialogContent className="max-h-dvh overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit employee details</DialogTitle>
          <DialogDescription>
            Review the current employee information and submit any changes for
            endorsement approval.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <FieldGroup className="grid gap-4 md:grid-cols-2">
            {editableEmployeeFields.map((field) => (
              <Field key={field.id}>
                <FieldLabel htmlFor={field.id}>{field.label}</FieldLabel>
                <Input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  defaultValue={field.currentValue}
                />
                <FieldDescription>
                  {field.instruction}
                </FieldDescription>
              </Field>
            ))}
          </FieldGroup>
          <Alert>
            <Info />
            <AlertDescription>
              Changes will be submitted for endorsement approval before taking
              effect.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancel
            </DialogClose>
            <Button type="submit">Submit for endorsements</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function EmployerPolicyDetails({
  policyNumber,
}: {
  policyNumber: string
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar activeItem="policies" />
      <SidebarInset className="bg-muted">
        <DashboardHeader />
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-4 md:p-6 lg:p-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/dashboard/policies" />}>
                  Policy Management
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{policyNumber}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-6">
              <Image
                src="/employer-dashboard/policy-employee.svg"
                alt=""
                width={64}
                height={64}
              />
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  John Doe
                </h1>
                <p className="text-sm font-medium text-muted-foreground">
                  Senior Developer&nbsp; • &nbsp;Engineering
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" size="lg" type="button">
                <Send />
                Send e-card
              </Button>
              <EditEmployeeDialog />
              <Button
                variant="outline"
                size="icon-lg"
                type="button"
                aria-label="More employee actions"
              >
                <EllipsisVertical />
              </Button>
            </div>
          </section>

          <EmployeeInformationCard />
          <section className="grid gap-8 xl:grid-cols-2">
            <FamilyMembersCard />
            <PolicyDetailsCard policyNumber={policyNumber} />
          </section>
          <DocumentsCard />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
