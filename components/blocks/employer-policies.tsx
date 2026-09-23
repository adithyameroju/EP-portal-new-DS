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
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
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
import { PageHeading } from "./page-heading"

type PolicyStatus = "Active" | "Renewal Due" | "Draft" | "Expired"

type Policy = {
  number: string
  product: "GMC" | "GPA"
  category: "gmc" | "gpa"
  coveredLives: number
  sumInsured: number
  startDate: Date
  renewalDate: Date
  status: PolicyStatus
}

const policies: Policy[] = [
  {
    number: "GMC-ENT1-2026",
    product: "GMC",
    category: "gmc",
    coveredLives: 1248,
    sumInsured: 50000000,
    startDate: new Date(2026, 6, 1),
    renewalDate: new Date(2027, 5, 30),
    status: "Active",
  },
  {
    number: "GPA-ENT1-2026",
    product: "GPA",
    category: "gpa",
    coveredLives: 1190,
    sumInsured: 20000000,
    startDate: new Date(2026, 6, 1),
    renewalDate: new Date(2027, 5, 30),
    status: "Active",
  },
]

const metrics = [
  { title: "Active policies", value: "2" },
  { title: "GMC covered lives", value: "1,248" },
  { title: "GPA covered lives", value: "1,190" },
  { title: "Total sum insured", value: "₹7", suffix: "cr" },
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
                <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <ShieldCheck className="size-5" />
                </span>
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
        policy.product.toLowerCase().includes(normalizedQuery)
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
        <CardTitle className="text-xl">Policies</CardTitle>
        <CardAction className="col-start-1 row-start-2 flex min-w-0 flex-wrap justify-self-stretch gap-3 xl:col-start-2 xl:row-start-1 xl:justify-self-end">
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
              gmc: "GMC",
              gpa: "GPA",
            }}
          >
            <SelectTrigger className="w-36" aria-label="Filter policy product">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All products</SelectItem>
              <SelectItem value="gmc">GMC</SelectItem>
              <SelectItem value="gpa">GPA</SelectItem>
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
        <div className="hidden md:block">
          <Table className="table-fixed">
            <TableCaption className="sr-only">
              GMC and GPA policies for the currently selected entity
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-36">Policy number</TableHead>
                <TableHead className="w-20">Product</TableHead>
                <TableHead className="text-right">Covered lives</TableHead>
                <TableHead className="text-right">Sum insured (₹)</TableHead>
                <TableHead>Policy period</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visiblePolicies.map((policy) => (
                <TableRow key={policy.number}>
                  <TableCell className="whitespace-normal font-medium">
                    {policy.number}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{policy.product}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {policy.coveredLives.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-right">
                    {policy.sumInsured.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    {format(policy.startDate, "dd MMM yyyy")} –{" "}
                    {format(policy.renewalDate, "dd MMM yyyy")}
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
                      size="xs"
                    >
                      View policy
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <ItemGroup className="md:hidden">
          {visiblePolicies.map((policy) => (
            <Item key={policy.number} variant="outline">
              <ItemMedia className="rounded-full bg-accent">
                <ShieldCheck className="size-4" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
                  {policy.product} · {policy.number}
                </ItemTitle>
                <ItemDescription>
                  {policy.coveredLives.toLocaleString("en-IN")} covered lives ·
                  ₹{policy.sumInsured.toLocaleString("en-IN")}
                </ItemDescription>
                <ItemDescription>
                  {format(policy.startDate, "dd MMM yyyy")} –{" "}
                  {format(policy.renewalDate, "dd MMM yyyy")}
                </ItemDescription>
              </ItemContent>
              <ItemActions className="flex-col items-end">
                <PolicyStatusBadge status={policy.status} />
                <Button
                  render={
                    <Link
                      href={`/dashboard/policies/${encodeURIComponent(policy.number)}`}
                    />
                  }
                  variant="outline"
                  size="sm"
                >
                  View
                </Button>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
        {visiblePolicies.length === 0 ? (
          <Alert>
            <Info />
            <AlertDescription>
              No policies match the selected filters.
            </AlertDescription>
          </Alert>
        ) : null}
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
          <PageHeading
            title="Policy Management"
            description="Manage coverage, policy status, and upcoming renewals"
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
          <PolicyMetrics />
          <PolicyTable />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
