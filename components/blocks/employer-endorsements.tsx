"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { toast } from "sonner"
import {
  CalendarDays,
  ChevronRight,
  CircleCheck,
  Clock3,
  Download,
  Eye,
  FileText,
  Info,
  ListPlus,
  Search,
  UserPen,
  UserMinus,
  UserPlus,
} from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { DashboardHeader, DashboardSidebar } from "./employer-dashboard"
import { PageHeading } from "./page-heading"
import {
  getEndorsementStatus,
  listEndorsementSubmissions,
  type EndorsementSubmission,
} from "@/lib/endorsement-session"

const endorsementActions = [
  {
    label: "Add employees",
    description: "Add new employees with plan selection",
    icon: UserPlus,
    slug: "add",
  },
  {
    label: "Update employees",
    description: "Update details, dependents, or plans",
    icon: UserPen,
    slug: "update",
  },
  {
    label: "Delete employees",
    description: "Remove employees from the policy",
    icon: UserMinus,
    slug: "delete",
  },
]

const endorsementRows = [
  {
    id: "endorsement-1",
    date: new Date(2026, 4, 30, 10, 30),
    activity: "Addition",
    detail: "1 employee added",
    entryMode: "Quick",
    doneBy: "Adithya M.",
    result: "1/1",
  },
  {
    id: "endorsement-2",
    date: new Date(2026, 4, 30, 10),
    activity: "Modification",
    detail: "2 records · SI upgrade",
    entryMode: "Quick",
    doneBy: "Priya S.",
    result: "2/2",
  },
  {
    id: "endorsement-3",
    date: new Date(2026, 4, 29, 11, 45),
    activity: "Addition",
    detail: "5 employees · bulk add",
    entryMode: "Bulk",
    doneBy: "Rahul K.",
    result: "5/5",
  },
  {
    id: "endorsement-4",
    date: new Date(2026, 4, 29, 11, 15),
    activity: "Addition",
    detail: "9 lives · HRMS sync",
    entryMode: "HRMS",
    doneBy: "System",
    result: "9/9",
  },
]

const scheduleRows = [
  {
    id: "schedule-1",
    completedAt: new Date(2026, 4, 30, 10, 30),
    type: "Addition",
    lives: "1 life",
    premium: "−₹35,200",
    premiumType: "Premium debit",
  },
  {
    id: "schedule-2",
    completedAt: new Date(2026, 4, 30, 10),
    type: "Modification",
    lives: "2 lives",
    premium: "−₹51,800",
    premiumType: "Premium debit",
  },
]

function EndorsementActions() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {endorsementActions.map((action) => (
        <Link
          key={action.label}
          href={`/dashboard/endorsements/${action.slug}`}
          className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Card className="flex h-full cursor-pointer flex-col transition-colors group-hover:bg-accent">
            <CardHeader>
              <CardTitle className="text-base">{action.label}</CardTitle>
              <CardAction>
                <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <action.icon className="size-5" />
                </span>
              </CardAction>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="outline">Quick and bulk options</Badge>
            </CardContent>
            <CardFooter className="mt-auto justify-between text-sm font-medium text-primary">
              Choose a method
              <ChevronRight className="size-4" />
            </CardFooter>
          </Card>
        </Link>
      ))}
    </section>
  )
}

function DateFilter({
  label,
  value,
  onChange,
}: {
  label: string
  value: Date | undefined
  onChange: (date: Date | undefined) => void
}) {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        <CalendarDays />
        {value ? format(value, "dd MMM yyyy") : label}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}

function TablePagination({
  total,
  pages,
}: {
  total: number
  pages: number
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing 1–{Math.min(10, total)} of {total}
      </p>
      <Pagination className="mx-0 w-auto justify-start sm:justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="/dashboard/endorsements?page=1"
              text=""
              aria-label="Previous page"
            />
          </PaginationItem>
          {Array.from({ length: pages }, (_, index) => index + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href={`/dashboard/endorsements?page=${page}`}
                isActive={page === 1}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="/dashboard/endorsements?page=2"
              text=""
              aria-label="Next page"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

function EndorsementsTable({
  submissions,
}: {
  submissions: EndorsementSubmission[]
}) {
  const [now, setNow] = useState(() => 0)

  useEffect(() => {
    const sync = () => setNow(Date.now())
    sync()
    const timer = window.setInterval(sync, 1000)
    return () => window.clearInterval(timer)
  }, [])

  const submittedRows = submissions.map((submission) => {
    const status = getEndorsementStatus(submission.createdAt, now)
    const activity =
      submission.action === "delete"
        ? "Deletion"
        : submission.action === "update"
          ? "Modification"
          : "Addition"
    return {
      id: submission.id,
      date: new Date(submission.createdAt),
      activity,
      detail: `${submission.employeeCount} employees · ${submission.dependentCount} dependents`,
      entryMode: "Quick",
      doneBy: "You",
      result: `${submission.employeeCount}/${submission.employeeCount}`,
      status,
    }
  })

  const rows = [...submittedRows, ...endorsementRows.map((row) => ({
    ...row,
    status: "completed" as const,
  }))]

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="hidden xl:block">
        <Table className="table-fixed [&_td]:whitespace-normal [&_th]:whitespace-normal">
          <TableCaption className="sr-only">
            Endorsement activity, results, and schedule status
          </TableCaption>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Entry mode</TableHead>
              <TableHead>Done by</TableHead>
              <TableHead>Endorsement status</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Actions</TableHead>
              <TableHead>Schedule status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((endorsement) => (
              <TableRow key={endorsement.id}>
                <TableCell>
                  <span className="block font-medium">
                    {format(endorsement.date, "dd MMM yyyy")}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {format(endorsement.date, "hh:mm a")}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="block font-medium">
                    {endorsement.activity}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {endorsement.detail}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{endorsement.entryMode}</Badge>
                </TableCell>
                <TableCell>{endorsement.doneBy}</TableCell>
                <TableCell>
                  {endorsement.status === "processing" ? (
                    <Badge variant="secondary">
                      <Spinner />
                      Processing
                    </Badge>
                  ) : (
                    <Badge>
                      <CircleCheck />
                      Completed
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="font-medium text-primary">
                  {endorsement.result}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="secondary" size="xs" type="button">
                      <Eye />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      type="button"
                      aria-label={`Download ${endorsement.id}`}
                    >
                      <Download />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    <Clock3 />
                    Pending
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ItemGroup className="xl:hidden">
        {rows.map((endorsement) => (
          <Item key={endorsement.id} variant="outline">
            <ItemContent>
              <ItemTitle>
                {endorsement.activity} · {endorsement.detail}
              </ItemTitle>
              <ItemDescription>
                {format(endorsement.date, "dd MMM yyyy, hh:mm a")} ·{" "}
                {endorsement.entryMode} · {endorsement.doneBy}
              </ItemDescription>
              <ItemDescription>
                Result: {endorsement.result} · Schedule pending
              </ItemDescription>
            </ItemContent>
            <ItemActions className="flex-col items-end gap-2">
              {endorsement.status === "processing" ? (
                <Badge variant="secondary">
                  <Spinner />
                  Processing
                </Badge>
              ) : (
                <Badge>
                  <CircleCheck />
                  Completed
                </Badge>
              )}
              <div className="flex gap-1">
                <Button variant="secondary" size="xs" type="button">
                  <Eye />
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  type="button"
                  aria-label={`Download ${endorsement.id}`}
                >
                  <Download />
                </Button>
              </div>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
      <TablePagination total={68 + submissions.length} pages={7} />
    </div>
  )
}

function SchedulesTable({
  generated = false,
  generationStatus = "idle",
}: {
  generated?: boolean
  generationStatus?: "idle" | "generating" | "generated"
}) {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="hidden xl:block">
        <Table className="table-fixed [&_td]:whitespace-normal [&_th]:whitespace-normal">
        <TableCaption className="sr-only">
          Endorsement schedules with affected lives and premium impact
        </TableCaption>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Date completed</TableHead>
            <TableHead>Endorsement type</TableHead>
            <TableHead>Lives affected</TableHead>
            <TableHead className="text-right">Premium impact</TableHead>
            <TableHead>Endorsement status</TableHead>
            <TableHead>Schedule status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {generated && generationStatus !== "idle" ? (
            <TableRow data-state="selected">
              <TableCell>
                <span className="block font-medium">
                  {format(new Date(), "dd MMM yyyy")}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {format(new Date(), "hh:mm a")}
                </span>
              </TableCell>
              <TableCell>Mixed endorsements</TableCell>
              <TableCell>34 lives</TableCell>
              <TableCell className="text-right">
                <span className="block font-semibold">−₹3,42,600</span>
                <span className="block text-xs text-muted-foreground">
                  Estimated premium debit
                </span>
              </TableCell>
              <TableCell>
                <Badge>
                  <CircleCheck />
                  Success
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    generationStatus === "generating"
                      ? "secondary"
                      : "default"
                  }
                >
                  {generationStatus === "generating" ? (
                    <Spinner />
                  ) : (
                    <CircleCheck />
                  )}
                  {generationStatus === "generating"
                    ? "Generating"
                    : "Generated"}
                </Badge>
              </TableCell>
            </TableRow>
          ) : null}
          {scheduleRows.map((schedule) => (
            <TableRow key={schedule.id}>
              <TableCell>
                <span className="block font-medium">
                  {format(schedule.completedAt, "dd MMM yyyy")}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {format(schedule.completedAt, "hh:mm a")}
                </span>
              </TableCell>
              <TableCell>{schedule.type}</TableCell>
              <TableCell>{schedule.lives}</TableCell>
              <TableCell className="text-right">
                <span className="block font-semibold">{schedule.premium}</span>
                <span className="block text-xs text-muted-foreground">
                  {schedule.premiumType}
                </span>
              </TableCell>
              <TableCell>
                <Badge>
                  <CircleCheck />
                  Success
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={generated ? "secondary" : "outline"}>
                  {generated ? <CircleCheck /> : <Clock3 />}
                  {generated ? "Generated" : "Pending"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </div>
      <ItemGroup className="xl:hidden">
        {generated && generationStatus !== "idle" ? (
          <Item variant="muted">
            <ItemContent>
              <ItemTitle>Mixed endorsements · 34 lives</ItemTitle>
              <ItemDescription>
                {format(new Date(), "dd MMM yyyy, hh:mm a")} · Estimated
                premium debit −₹3,42,600
              </ItemDescription>
            </ItemContent>
            <ItemActions className="flex-col items-end gap-2">
              <Badge>
                <CircleCheck />
                Success
              </Badge>
              <Badge
                variant={
                  generationStatus === "generating"
                    ? "secondary"
                    : "default"
                }
              >
                {generationStatus === "generating" ? (
                  <Spinner />
                ) : (
                  <CircleCheck />
                )}
                {generationStatus === "generating"
                  ? "Generating"
                  : "Generated"}
              </Badge>
            </ItemActions>
          </Item>
        ) : null}
        {scheduleRows.map((schedule) => (
          <Item key={schedule.id} variant="outline">
            <ItemContent>
              <ItemTitle>
                {schedule.type} · {schedule.lives}
              </ItemTitle>
              <ItemDescription>
                {format(schedule.completedAt, "dd MMM yyyy, hh:mm a")} ·{" "}
                {schedule.premium} {schedule.premiumType.toLowerCase()}
              </ItemDescription>
            </ItemContent>
            <ItemActions className="flex-col items-end gap-2">
              <Badge>
                <CircleCheck />
                Success
              </Badge>
              <Badge variant={generated ? "secondary" : "outline"}>
                {generated ? <CircleCheck /> : <Clock3 />}
                {generated ? "Generated" : "Pending"}
              </Badge>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
      <TablePagination total={21} pages={3} />
    </div>
  )
}

function EndorsementHistory({
  submissions,
}: {
  submissions: EndorsementSubmission[]
}) {
  const [endorsementFrom, setEndorsementFrom] = useState<Date>()
  const [endorsementTo, setEndorsementTo] = useState<Date>()
  const [scheduleFrom, setScheduleFrom] = useState<Date>()
  const [scheduleTo, setScheduleTo] = useState<Date>()
  const [endorsementStatus, setEndorsementStatus] = useState("all")
  const [scheduleType, setScheduleType] = useState("all")
  const [query, setQuery] = useState("")
  const [confirmGenerate, setConfirmGenerate] = useState(false)
  const [historyTab, setHistoryTab] = useState("endorsements")
  const [scheduleTab, setScheduleTab] = useState("pending")
  const [generationStatus, setGenerationStatus] = useState<
    "idle" | "generating" | "generated"
  >("idle")
  const generationTimer = useRef<number | undefined>(undefined)
  const pendingSchedules = 21

  useEffect(() => {
    return () => {
      if (generationTimer.current) {
        window.clearTimeout(generationTimer.current)
      }
    }
  }, [])

  function generateSchedules() {
    setConfirmGenerate(false)
    setHistoryTab("schedules")
    setScheduleTab("generated")
    setGenerationStatus("generating")
    toast("Schedule generation started", {
      description:
        "21 schedules are being generated. You can track progress in this row.",
    })

    generationTimer.current = window.setTimeout(() => {
      setGenerationStatus("generated")
      toast.success("21 schedules generated successfully", {
        description:
          "The schedules are ready and the premium impact is reflected in the CD balance.",
      })
    }, 7000)
  }

  return (
    <Card className="min-w-0">
      <CardContent className="min-w-0">
        <Tabs
          value={historyTab}
          onValueChange={setHistoryTab}
          className="min-w-0"
        >
          <div className="border-b">
            <TabsList variant="line">
              <TabsTrigger value="endorsements">Endorsements</TabsTrigger>
              <TabsTrigger value="schedules">
                Endorsement schedules
                <Badge>{pendingSchedules}</Badge>
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="endorsements">
            <div className="flex min-w-0 flex-col gap-4 pt-4">
              <div className="flex flex-wrap justify-end gap-3">
                <InputGroup className="w-full sm:w-72">
                  <InputGroupAddon>
                    <Search />
                  </InputGroupAddon>
                  <InputGroupInput
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by activity or done by"
                    aria-label="Search endorsements"
                  />
                </InputGroup>
                <DateFilter
                  label="From date"
                  value={endorsementFrom}
                  onChange={setEndorsementFrom}
                />
                <DateFilter
                  label="To date"
                  value={endorsementTo}
                  onChange={setEndorsementTo}
                />
                <Select
                  value={endorsementStatus}
                  onValueChange={(value) =>
                    value && setEndorsementStatus(value)
                  }
                  items={{
                    all: "All endorsement statuses",
                    success: "Completed",
                    processing: "Processing",
                    failed: "Failed",
                  }}
                >
                  <SelectTrigger
                    className="w-52"
                    aria-label="Filter endorsement status"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value="all">
                      All endorsement statuses
                    </SelectItem>
                    <SelectItem value="success">Completed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <EndorsementsTable submissions={submissions} />
            </div>
          </TabsContent>
          <TabsContent value="schedules">
            <div className="pt-4">
              <Tabs value={scheduleTab} onValueChange={setScheduleTab}>
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                  <TabsList>
                    <TabsTrigger value="pending">
                      Pending schedules ({pendingSchedules})
                    </TabsTrigger>
                    <TabsTrigger value="generated">
                      Schedules generated
                    </TabsTrigger>
                  </TabsList>
                  <div className="flex flex-wrap gap-3">
                    <DateFilter
                      label="From date"
                      value={scheduleFrom}
                      onChange={setScheduleFrom}
                    />
                    <DateFilter
                      label="To date"
                      value={scheduleTo}
                      onChange={setScheduleTo}
                    />
                    <Select
                      value={scheduleType}
                      onValueChange={(value) =>
                        value && setScheduleType(value)
                      }
                      items={{
                        all: "All types",
                        addition: "Addition",
                        modification: "Modification",
                      }}
                    >
                      <SelectTrigger
                        className="w-36"
                        aria-label="Filter endorsement type"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent align="end">
                        <SelectItem value="all">All types</SelectItem>
                        <SelectItem value="addition">Addition</SelectItem>
                        <SelectItem value="modification">
                          Modification
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      onClick={() => setConfirmGenerate(true)}
                      disabled={generationStatus === "generating"}
                    >
                      <ListPlus />
                      Generate schedule ({pendingSchedules})
                    </Button>
                  </div>
                </div>
                <Alert>
                  <Info />
                  <AlertDescription>
                    Endorsements without a schedule are included in the
                    automatic month-end schedule run unless you generate one
                    earlier.
                  </AlertDescription>
                </Alert>
                <TabsContent value="pending">
                  <div className="pt-2">
                    <SchedulesTable />
                  </div>
                </TabsContent>
                <TabsContent value="generated">
                  <div className="pt-2">
                    <SchedulesTable
                      generated
                      generationStatus={generationStatus}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>
        <AlertDialog open={confirmGenerate} onOpenChange={setConfirmGenerate}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Generate {pendingSchedules} schedules?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This will create {pendingSchedules} endorsement schedules from
                the pending endorsements. Premium impact will be applied to the
                CD balance after generation.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <ItemGroup>
              <Item size="xs" variant="muted">
                <ItemContent>
                  <ItemDescription>Pending schedules</ItemDescription>
                  <ItemTitle>{pendingSchedules} endorsements</ItemTitle>
                </ItemContent>
                <ItemActions>12 additions · 9 modifications</ItemActions>
              </Item>
              <Item size="xs">
                <ItemContent>
                  <ItemDescription>Affected lives</ItemDescription>
                  <ItemTitle>34 lives</ItemTitle>
                </ItemContent>
                <ItemActions>Employees and dependents</ItemActions>
              </Item>
              <Item size="xs">
                <ItemContent>
                  <ItemDescription>Estimated premium impact</ItemDescription>
                  <ItemTitle>−₹3,42,600</ItemTitle>
                </ItemContent>
                <ItemActions>Premium debit</ItemActions>
              </Item>
              <Item size="xs">
                <ItemContent>
                  <ItemDescription>Estimated CD balance</ItemDescription>
                  <ItemTitle>₹45,07,400</ItemTitle>
                </ItemContent>
                <ItemActions>After generation</ItemActions>
              </Item>
            </ItemGroup>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                type="button"
                onClick={generateSchedules}
              >
                Generate schedules
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}

export function EmployerEndorsements() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [submissions] = useState(listEndorsementSubmissions)

  useEffect(() => {
    if (searchParams.get("submitted") !== "1") return
    toast.success("Endorsement submitted", {
      description: "The endorsement is processing and will complete shortly.",
    })
    router.replace("/dashboard/endorsements")
  }, [router, searchParams])

  return (
    <SidebarProvider>
      <DashboardSidebar activeItem="endorsements" />
      <SidebarInset className="min-w-0 overflow-x-hidden">
        <DashboardHeader />
        <main className="flex min-w-0 flex-1 flex-col gap-6 bg-muted/40 p-4 md:p-8">
          <PageHeading
            title="Endorsements"
            description="Add, update, or delete employees and generate schedules"
            actions={
              <Button type="button" size="lg">
                <FileText />
                Generate Report
              </Button>
            }
          />
          <EndorsementActions />
          <EndorsementHistory submissions={submissions} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
