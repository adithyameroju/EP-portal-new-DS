"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import {
  CalendarDays,
  ChevronDown,
  Download,
  FileText,
  Info,
  Search,
} from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  DashboardHeader,
  DashboardSidebar,
} from "@/components/blocks/employer-dashboard"
import { PageHeading } from "@/components/blocks/page-heading"

type ClaimStatus = "Rejected" | "Under Review" | "Processing" | "Approved"
type ClaimType = "Reimbursement" | "Cashless"

type Claim = {
  number: string
  employee: string
  type: ClaimType
  amount: number
  submittedAt: Date
  status: ClaimStatus
}

const claims: Claim[] = [
  { number: "ACK-2024-005", employee: "David Brown", type: "Reimbursement", amount: 15000, submittedAt: new Date(2025, 0, 12), status: "Rejected" },
  { number: "ACK-2024-005", employee: "David Brown", type: "Reimbursement", amount: 15000, submittedAt: new Date(2025, 0, 12), status: "Under Review" },
  { number: "ACK-2024-005", employee: "David Brown", type: "Cashless", amount: 15000, submittedAt: new Date(2025, 0, 12), status: "Processing" },
  { number: "ACK-2024-006", employee: "Alice Smith", type: "Reimbursement", amount: 20000, submittedAt: new Date(2025, 0, 15), status: "Approved" },
  { number: "ACK-2024-007", employee: "John Doe", type: "Cashless", amount: 30000, submittedAt: new Date(2025, 0, 18), status: "Rejected" },
  { number: "ACK-2024-008", employee: "Emily Johnson", type: "Reimbursement", amount: 25000, submittedAt: new Date(2025, 0, 20), status: "Under Review" },
  { number: "ACK-2024-009", employee: "Michael Lee", type: "Reimbursement", amount: 22000, submittedAt: new Date(2025, 0, 22), status: "Processing" },
  { number: "ACK-2024-010", employee: "Sarah Wilson", type: "Cashless", amount: 18000, submittedAt: new Date(2025, 0, 25), status: "Approved" },
  { number: "ACK-2024-011", employee: "James Taylor", type: "Reimbursement", amount: 27000, submittedAt: new Date(2025, 0, 28), status: "Under Review" },
  { number: "ACK-2024-012", employee: "Laura Martinez", type: "Cashless", amount: 19000, submittedAt: new Date(2025, 0, 30), status: "Processing" },
]

const metrics = [
  { title: "Total Claims", value: "385", suffix: "YTD" },
  { title: "Top Claim Category", value: "Cataract" },
  { title: "Claims Paid", value: "₹2.4", suffix: "cr" },
  { title: "Avg Settlement Time", value: "5", suffix: "days" },
]

function ClaimsMetricCards() {
  return (
    <section className="flex flex-col gap-5" aria-label="Claims metrics">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader>
              <CardTitle className="text-sm font-normal text-muted-foreground">
                {metric.title}
              </CardTitle>
              <CardAction>
                <Image
                  src="/employer-dashboard/claims-metric.svg"
                  alt=""
                  width={56}
                  height={56}
                />
              </CardAction>
              <CardDescription className="text-2xl font-semibold tracking-tight text-foreground">
                {metric.value}{" "}
                {metric.suffix ? (
                  <span className="text-sm font-normal tracking-normal">
                    {metric.suffix}
                  </span>
                ) : null}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
      <Alert className="w-fit">
        <Info />
        <AlertDescription className="text-foreground">
          All reported metrics are calculated from the start date of the master
          policy
        </AlertDescription>
      </Alert>
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

function ClaimStatusBadge({ status }: { status: ClaimStatus }) {
  const variant =
    status === "Approved"
      ? "default"
      : status === "Rejected"
        ? "destructive"
        : "outline"

  return <Badge variant={variant}>{status}</Badge>
}

function ReportsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="lg" />}>
        <Image
          src="/employer-dashboard/claims-report.svg"
          alt=""
          width={24}
          height={24}
          className="size-6"
        />
        Reports
        <Badge>2 new</Badge>
        <ChevronDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Claims reports</DropdownMenuLabel>
          <DropdownMenuItem>
            <Download />
            Claims Report 1
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Download />
            Claims Report 2
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>View all downloads</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function RecentClaims() {
  const [query, setQuery] = useState("")
  const [type, setType] = useState("all")
  const [sort, setSort] = useState("default")
  const [fromDate, setFromDate] = useState<Date>()
  const [toDate, setToDate] = useState<Date>()

  const visibleClaims = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const filtered = claims.filter((claim) => {
      const matchesQuery =
        !normalizedQuery ||
        claim.employee.toLowerCase().includes(normalizedQuery) ||
        claim.number.toLowerCase().includes(normalizedQuery)
      const matchesType =
        type === "all" || claim.type.toLowerCase() === type
      const matchesFrom = !fromDate || claim.submittedAt >= fromDate
      const matchesTo = !toDate || claim.submittedAt <= toDate

      return matchesQuery && matchesType && matchesFrom && matchesTo
    })

    return [...filtered].sort((first, second) => {
      if (sort === "amount-high") return second.amount - first.amount
      if (sort === "employee") {
        return first.employee.localeCompare(second.employee)
      }
      if (sort === "newest") {
        return second.submittedAt.getTime() - first.submittedAt.getTime()
      }
      return 0
    })
  }, [fromDate, query, sort, toDate, type])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Recent Claims</CardTitle>
        <CardAction className="col-start-1 row-start-2 flex flex-wrap justify-self-stretch gap-3 xl:col-start-2 xl:row-start-1 xl:justify-self-end">
          <InputGroup className="w-full sm:w-72">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by employee name/ID/email"
              aria-label="Search recent claims"
            />
          </InputGroup>
          <DateFilter label="From date" value={fromDate} onChange={setFromDate} />
          <DateFilter label="To date" value={toDate} onChange={setToDate} />
          <Select
            value={type}
            onValueChange={(value) => {
              if (value) setType(value)
            }}
            items={{
              all: "All Types",
              reimbursement: "Reimbursement",
              cashless: "Cashless",
            }}
          >
            <SelectTrigger className="w-36" aria-label="Filter by claim type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="reimbursement">Reimbursement</SelectItem>
              <SelectItem value="cashless">Cashless</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={sort}
            onValueChange={(value) => {
              if (value) setSort(value)
            }}
            items={{
              default: "Sort by",
              newest: "Newest first",
              "amount-high": "Amount: high to low",
              employee: "Employee name",
            }}
          >
            <SelectTrigger className="w-36" aria-label="Sort claims">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="default">Sort by</SelectItem>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="amount-high">Amount: high to low</SelectItem>
              <SelectItem value="employee">Employee name</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Table className="min-w-4xl">
          <TableCaption className="sr-only">
            Recent claims with employee, amount, submission date, and status
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Claim number</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount (₹)</TableHead>
              <TableHead>Submitted date</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleClaims.map((claim, index) => (
              <TableRow
                key={`${claim.number}-${claim.status}-${index}`}
              >
                <TableCell className="font-medium">{claim.number}</TableCell>
                <TableCell>{claim.employee}</TableCell>
                <TableCell>{claim.type}</TableCell>
                <TableCell className="text-right">
                  {claim.amount.toLocaleString("en-IN")}
                </TableCell>
                <TableCell>
                  {format(claim.submittedAt, "dd MMM yyyy").toUpperCase()}
                </TableCell>
                <TableCell className="text-center">
                  <ClaimStatusBadge status={claim.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    render={
                      <Link
                        href={`/dashboard/claims/${encodeURIComponent(claim.number)}`}
                      />
                    }
                    variant="outline"
                    size="xs"
                  >
                    View details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {visibleClaims.length === 0 ? (
          <Alert>
            <Info />
            <AlertDescription>
              No claims match the selected filters.
            </AlertDescription>
          </Alert>
        ) : null}
        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="/dashboard/claims?page=1"
                text=""
                aria-label="Previous claims page"
              />
            </PaginationItem>
            {[1, 2, 3, 4, 5].map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href={`/dashboard/claims?page=${page}`}
                  isActive={page === 1}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="/dashboard/claims?page=2"
                text=""
                aria-label="Next claims page"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  )
}

export function EmployerClaims() {
  return (
    <SidebarProvider>
      <DashboardSidebar activeItem="claims" />
      <SidebarInset className="bg-muted">
        <DashboardHeader />
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-4 md:p-6 lg:p-8">
          <PageHeading
            title="Claims"
            description="Manage claims and track insurance claims"
            actions={
              <>
                <ReportsMenu />
                <Button type="button" size="lg">
                  <FileText />
                  Generate Report
                </Button>
              </>
            }
          />
          <ClaimsMetricCards />
          <RecentClaims />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
