"use client"

import Image from "next/image"
import Link from "next/link"
import {
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Download,
  FileText,
  Hospital,
  Stethoscope,
  UserRound,
  type LucideIcon,
} from "lucide-react"

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
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  DashboardHeader,
  DashboardSidebar,
} from "@/components/blocks/employer-dashboard"

const claimInformation = [
  {
    label: "Employee",
    value: "John Doe",
    meta: "EMP001 • Engineering",
    icon: UserRound,
  },
  {
    label: "Claim Amount",
    value: "₹2,500",
    icon: CircleDollarSign,
  },
  {
    label: "Submitted Date",
    value: "2024-01-10",
    icon: CalendarDays,
  },
  {
    label: "Treatment Date",
    value: "2024-01-10",
    icon: CalendarDays,
  },
  {
    label: "Approved Amount",
    value: "₹2,500",
    icon: ClipboardCheck,
  },
  {
    label: "Hospital",
    value: "Apollo Hospital",
    meta: "HSR layout, Bengaluru",
    icon: Hospital,
  },
]

const attachedDocuments = [
  "Medical report.pdf",
  "Medical report.pdf",
  "Medical report.pdf",
]

const timelineEvents = [
  {
    title: "Claim Approved",
    description: "Claim approved for full amount",
    date: "2024-01-20",
    time: "10:30 AM",
  },
  {
    title: "Medical Review completed",
    description: "Medical review of submitted documents",
    date: "2024-01-20",
    time: "10:30 AM",
  },
  {
    title: "Documents Verified",
    description: "All required documents verified and validated",
    date: "2024-01-20",
    time: "10:30 AM",
  },
  {
    title: "Claim Submitted",
    description: "Claim submitted by employee with all required documents",
    date: "2024-01-20",
    time: "10:30 AM",
  },
]

function ClaimInformationItem({
  label,
  value,
  meta,
  icon: Icon,
}: {
  label: string
  value: string
  meta?: string
  icon: LucideIcon
}) {
  return (
    <Item className="items-start p-0">
      <ItemMedia>
        <Icon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </ItemTitle>
        <ItemDescription className="text-lg font-medium text-foreground">
          {value}
        </ItemDescription>
        {meta ? (
          <ItemDescription className="text-xs">{meta}</ItemDescription>
        ) : null}
      </ItemContent>
    </Item>
  )
}

function ClaimStatusCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Current status</CardTitle>
        <CardAction>
          <Badge variant="default">Approved</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Progress value={75}>
          <ProgressLabel>Progress</ProgressLabel>
          <ProgressValue>
            {(_, value) => `${value ?? 0}% completed`}
          </ProgressValue>
        </Progress>
        <Separator />
        <ItemGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ClaimInformationItem
            label="Next Action"
            value="Payment processing"
            icon={ClipboardCheck}
          />
          <ClaimInformationItem
            label="Due Date"
            value="2024-01-20"
            icon={CalendarDays}
          />
        </ItemGroup>
      </CardContent>
    </Card>
  )
}

function ClaimInformationCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Claim information
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <ItemGroup className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {claimInformation.map((information) => (
            <ClaimInformationItem
              key={information.label}
              {...information}
            />
          ))}
        </ItemGroup>
        <Separator />
        <ItemGroup>
          <ClaimInformationItem
            label="Description"
            value="Routine health checkup and consultation"
            icon={FileText}
          />
          <ClaimInformationItem
            label="Diagnosis"
            value="Hypertension monitoring"
            icon={Stethoscope}
          />
        </ItemGroup>
      </CardContent>
    </Card>
  )
}

function ClaimDocumentsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Documents</CardTitle>
        <CardDescription>Attached Documents (3)</CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-3">
          {attachedDocuments.map((document, index) => (
            <Item key={`${document}-${index}`} variant="muted">
              <ItemMedia
                variant="icon"
                className="size-12 rounded-md bg-card"
              >
                <FileText className="size-6" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{document}</ItemTitle>
                <ItemDescription>
                  Medical report&nbsp; • &nbsp;2.4 MB&nbsp; • &nbsp;Uploaded
                  2024-01-15
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label={`Download ${document} ${index + 1}`}
                >
                  <Download />
                </Button>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}

function ClaimTimelineSheet() {
  return (
    <Sheet>
      <SheetTrigger render={<Button type="button" size="lg" />}>
        <Clock3 />
        View timeline
      </SheetTrigger>
      <SheetContent className="data-[side=right]:sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold">
            Claim timeline
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="min-h-0 flex-1">
          <ItemGroup className="gap-0 px-4 pb-4">
            {timelineEvents.map((event, index) => (
              <div key={event.title} className="flex gap-3">
                <div className="flex w-6 shrink-0 flex-col items-center">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 className="size-4" />
                  </div>
                  {index < timelineEvents.length - 1 ? (
                    <Separator orientation="vertical" className="min-h-12 flex-1" />
                  ) : null}
                </div>
                <Item className="items-start border-0 p-0 pb-6">
                  <ItemContent>
                    <ItemTitle>{event.title}</ItemTitle>
                    <ItemDescription>{event.description}</ItemDescription>
                    <ItemDescription className="text-xs">
                      {event.date}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions className="text-xs text-muted-foreground">
                    {event.time}
                  </ItemActions>
                </Item>
              </div>
            ))}
          </ItemGroup>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export function EmployerClaimDetails({
  claimNumber,
}: {
  claimNumber: string
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar activeItem="claims" />
      <SidebarInset className="bg-muted">
        <DashboardHeader />
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6 lg:p-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/dashboard/claims" />}>
                  Claims
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{claimNumber}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/employer-dashboard/claims-metric.svg"
                alt=""
                width={56}
                height={56}
              />
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  {claimNumber}
                </h1>
                <p className="text-sm font-medium text-muted-foreground">
                  Consultation&nbsp; • &nbsp;John Doe
                </p>
              </div>
            </div>
            <ClaimTimelineSheet />
          </section>

          <ClaimStatusCard />
          <ClaimInformationCard />
          <ClaimDocumentsCard />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
