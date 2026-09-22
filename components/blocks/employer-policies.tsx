"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import {
  CalendarDays,
  ChevronDown,
  Download,
  FileText,
  Info,
  Search,
  ShieldCheck,
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
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DashboardHeader, DashboardSidebar } from "./employer-dashboard"

type PolicyStatus = "Active" | "Renewal Due" | "Draft" | "Expired"

type Policy = {
  number: string
  product: string
  category: "health" | "accident" | "life" | "opd"
  entity: string
  coveredLives: number
  sumInsured: number
  startDate: Date
  renewalDate: Date
  status: PolicyStatus
}

const policies: Policy[] = [
  {
    number: "POL-001-2024",
    product: "Group Health Insurance",
    category: "health",
    entity: "Entity 1",
    coveredLives: 845,
    sumInsured: 50000000,
    startDate: new Date(2024, 0, 1),
    renewalDate: new Date(2024, 11, 31),
    status: "Active",
  },
  {
    number: "POL-002-2024",
    product: "Group Personal Accident",
    category: "accident",
    entity: "Entity 1",
    coveredLives: 845,
    sumInsured: 20000000,
    startDate: new Date(2024, 0, 1),
    renewalDate: new Date(2024, 11, 31),
    status: "Active",
  },
  {
    number: "POL-003-2024",
    product: "Group Term Life",
    category: "life",
    entity: "Entity 2",
    coveredLives: 320,
    sumInsured: 35000000,
    startDate: new Date(2024, 2, 1),
    renewalDate: new Date(2025, 1, 28),
    status: "Renewal Due",
  },
  {
    number: "POL-004-2024",
    product: "OPD Benefit",
    category: "opd",
    entity: "Entity 1",
    coveredLives: 245,
    sumInsured: 5000000,
    startDate: new Date(2024, 3, 1),
    renewalDate: new Date(2025, 2, 31),
    status: "Draft",
  },
  {
    number: "POL-005-2023",
    product: "Group Health Insurance",
    category: "health",
    entity: "Entity 2",
    coveredLives: 310,
    sumInsured: 18000000,
    startDate: new Date(2023, 0, 1),
    renewalDate: new Date(2023, 11, 31),
    status: "Expired",
  },
]

const metrics = [
  { title: "Active Policies", value: "4" },
  { title: "Total Covered Lives", value: "1,248" },
  { title: "Total Sum Insured", value: "₹6.2", suffix: "cr" },
  { title: "Renewals Due", value: "2", suffix: "next 60 days" },
]

function PolicyMetrics() {
  return (
    <section className="flex flex-col gap-5" aria-label="Policy metrics">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader>
              <CardTitle className="text-sm font-normal text-muted-foreground">
                {metric.title}
              </CardTitle>
              <CardAction>
                <ShieldCheck className="size-12 rounded-full bg-accent p-2 text-accent-foreground" />
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
          Policy metrics are based on the currently selected entity
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

function PolicyStatusBadge({ status }: { status: PolicyStatus }) {
  const variant =
    status === "Active"
      ? "default"
      : status === "Expired"
        ? "destructive"
        : status === "Draft"
          ? "secondary"
          : "outline"

  return <Badge variant={variant}>{status}</Badge>
}

function ReportsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="lg" />}>
        <FileText />
        Reports
        <Badge>2 new</Badge>
        <ChevronDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Policy reports</DropdownMenuLabel>
          <DropdownMenuItem>
            <Download />
            Active policy report
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Download />
            Renewal report
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>View all downloads</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function PolicyTable() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [status, setStatus] = useState("all")
  const [sort, setSort] = useState("default")
  const [fromDate, setFromDate] = useState<Date>()
  const [toDate, setToDate] = useState<Date>()

  const visiblePolicies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const filtered = policies.filter((policy) => {
      const matchesQuery =
        !normalizedQuery ||
        policy.number.toLowerCase().includes(normalizedQuery) ||
        policy.product.toLowerCase().includes(normalizedQuery) ||
        policy.entity.toLowerCase().includes(normalizedQuery)
      const matchesCategory =
        category === "all" || policy.category === category
      const matchesStatus =
        status === "all" || policy.status.toLowerCase() === status
      const matchesFrom = !fromDate || policy.startDate >= fromDate
      const matchesTo = !toDate || policy.startDate <= toDate

      return (
        matchesQuery &&
        matchesCategory &&
        matchesStatus &&
        matchesFrom &&
        matchesTo
      )
    })

    return [...filtered].sort((first, second) => {
      if (sort === "renewal") {
        return first.renewalDate.getTime() - second.renewalDate.getTime()
      }
      if (sort === "lives") return second.coveredLives - first.coveredLives
      if (sort === "insured") return second.sumInsured - first.sumInsured
      return 0
    })
  }, [category, fromDate, query, sort, status, toDate])

  return (
    <Card className="min-w-0">
      <CardHeader className="min-w-0">
        <CardTitle className="col-span-2 text-xl xl:col-span-1">
          Policies
        </CardTitle>
        <CardDescription className="col-span-2 xl:col-span-1">
          View and manage all corporate insurance policies
        </CardDescription>
        <CardAction className="col-span-2 col-start-1 row-start-3 flex min-w-0 max-w-full flex-wrap justify-self-stretch gap-3 xl:justify-end">
          <InputGroup className="w-full sm:w-72">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search policy number or product"
              aria-label="Search policies"
            />
          </InputGroup>
          <DateFilter
            label="From date"
            value={fromDate}
            onChange={setFromDate}
          />
          <DateFilter label="To date" value={toDate} onChange={setToDate} />
          <Select
            value={category}
            onValueChange={(value) => value && setCategory(value)}
            items={{
              all: "All products",
              health: "Health",
              accident: "Accident",
              life: "Term life",
              opd: "OPD",
            }}
          >
            <SelectTrigger className="w-36" aria-label="Filter policy product">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All products</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="accident">Accident</SelectItem>
              <SelectItem value="life">Term life</SelectItem>
              <SelectItem value="opd">OPD</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={status}
            onValueChange={(value) => value && setStatus(value)}
            items={{
              all: "All statuses",
              active: "Active",
              "renewal due": "Renewal due",
              draft: "Draft",
              expired: "Expired",
            }}
          >
            <SelectTrigger className="w-36" aria-label="Filter policy status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="renewal due">Renewal due</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={sort}
            onValueChange={(value) => value && setSort(value)}
            items={{
              default: "Sort by",
              renewal: "Renewal date",
              lives: "Covered lives",
              insured: "Sum insured",
            }}
          >
            <SelectTrigger className="w-36" aria-label="Sort policies">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="default">Sort by</SelectItem>
              <SelectItem value="renewal">Renewal date</SelectItem>
              <SelectItem value="lives">Covered lives</SelectItem>
              <SelectItem value="insured">Sum insured</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="flex min-w-0 flex-col gap-4">
        <Table className="min-w-6xl">
          <TableCaption className="sr-only">
            Corporate policies with coverage, renewal date, and current status
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Policy number</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead className="text-right">Covered lives</TableHead>
              <TableHead className="text-right">Sum insured (₹)</TableHead>
              <TableHead>Start date</TableHead>
              <TableHead>Renewal date</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visiblePolicies.map((policy) => (
              <TableRow key={policy.number}>
                <TableCell className="font-medium">{policy.number}</TableCell>
                <TableCell>{policy.product}</TableCell>
                <TableCell>{policy.entity}</TableCell>
                <TableCell className="text-right">
                  {policy.coveredLives.toLocaleString("en-IN")}
                </TableCell>
                <TableCell className="text-right">
                  {policy.sumInsured.toLocaleString("en-IN")}
                </TableCell>
                <TableCell>
                  {format(policy.startDate, "dd MMM yyyy").toUpperCase()}
                </TableCell>
                <TableCell>
                  {format(policy.renewalDate, "dd MMM yyyy").toUpperCase()}
                </TableCell>
                <TableCell className="text-center">
                  <PolicyStatusBadge status={policy.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    render={
                      <Link
                        href={`/dashboard/policies/${encodeURIComponent(policy.number)}`}
                      />
                    }
                    variant="outline"
                    size="sm"
                  >
                    View policy
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {visiblePolicies.length === 0 ? (
          <Alert>
            <Info />
            <AlertDescription>
              No policies match the selected filters.
            </AlertDescription>
          </Alert>
        ) : null}
        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="/dashboard/policies?page=1"
                text=""
                aria-label="Previous policies page"
              />
            </PaginationItem>
            {[1, 2, 3, 4, 5].map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href={`/dashboard/policies?page=${page}`}
                  isActive={page === 1}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="/dashboard/policies?page=2"
                text=""
                aria-label="Next policies page"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  )
}

export function EmployerPolicies() {
  return (
    <SidebarProvider>
      <DashboardSidebar activeItem="policies" />
      <SidebarInset className="min-w-0 overflow-x-hidden bg-muted">
        <DashboardHeader />
        <main className="mx-auto flex min-w-0 w-full max-w-7xl flex-col gap-8 p-4 md:p-6 lg:p-8">
          <section className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Policy Management
              </h1>
              <p className="text-sm font-medium text-muted-foreground">
                Manage coverage, policy status, and upcoming renewals
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <ReportsMenu />
              <Button type="button" size="lg">
                <FileText />
                Generate Report
              </Button>
            </div>
          </section>
          <PolicyMetrics />
          <PolicyTable />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
