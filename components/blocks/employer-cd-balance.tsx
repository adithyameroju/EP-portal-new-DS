"use client"

import { useMemo, useState } from "react"
import { format } from "date-fns"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CalendarDays,
  ChevronDown,
  Download,
  FileText,
  ReceiptText,
  Scale,
  TrendingDown,
  WalletCards,
} from "lucide-react"

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
import { DashboardHeader, DashboardSidebar } from "./employer-dashboard"

const transactions = [
  {
    period: "March 2025",
    deposits: "₹3,000",
    deductions: "₹15,000",
    netChange: "-₹12,000",
    endBalance: "₹78,500",
    transactions: 2,
  },
  {
    period: "February 2025",
    deposits: "₹3,000",
    deductions: "₹15,000",
    netChange: "-₹12,000",
    endBalance: "₹78,500",
    transactions: 2,
  },
  {
    period: "January 2025",
    deposits: "₹3,000",
    deductions: "₹15,000",
    netChange: "-₹12,000",
    endBalance: "₹78,500",
    transactions: 2,
  },
  {
    period: "December 2025",
    deposits: "₹3,000",
    deductions: "₹15,000",
    netChange: "-₹12,000",
    endBalance: "₹78,500",
    transactions: 2,
  },
]

const transactionMetrics = [
  {
    label: "Transactions",
    value: "12",
    tone: "text-foreground",
    icon: ReceiptText,
  },
  {
    label: "Total deposits",
    value: "₹98,500",
    tone: "text-primary",
    icon: ArrowDownToLine,
  },
  {
    label: "Total deductions",
    value: "₹48,000",
    tone: "text-destructive",
    icon: ArrowUpFromLine,
  },
  {
    label: "Net change",
    value: "+₹50,500",
    tone: "text-primary",
    icon: Scale,
  },
]

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
      <PopoverTrigger render={<Button variant="outline" size="lg" />}>
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
          <DropdownMenuLabel>CD balance reports</DropdownMenuLabel>
          <DropdownMenuItem>
            <Download />
            Transaction report
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Download />
            Balance statement
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>View all downloads</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function BalanceSummary() {
  return (
    <section className="grid gap-6 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-normal text-muted-foreground">
            Current Balance
          </CardTitle>
          <CardAction>
            <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <WalletCards className="size-5" />
            </span>
          </CardAction>
          <CardDescription className="text-2xl font-semibold text-foreground">
            ₹78,500
          </CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-normal text-muted-foreground">
            Monthly Burn Rate
          </CardTitle>
          <CardAction>
            <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <TrendingDown className="size-5" />
            </span>
          </CardAction>
          <CardDescription className="text-2xl font-semibold text-foreground">
            ₹9,500
          </CardDescription>
        </CardHeader>
      </Card>
    </section>
  )
}

function TransactionMetrics() {
  return (
    <section
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      aria-label="Transaction metrics"
    >
      {transactionMetrics.map((metric) => (
        <Card key={metric.label}>
          <CardHeader>
            <CardTitle className="text-sm font-normal text-muted-foreground">
              {metric.label}
            </CardTitle>
            <CardAction>
              <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <metric.icon className="size-5" />
              </span>
            </CardAction>
            <CardDescription
              className={`text-2xl font-medium ${metric.tone}`}
            >
              {metric.value}
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </section>
  )
}

function TransactionHistory() {
  const [fromDate, setFromDate] = useState<Date>()
  const [toDate, setToDate] = useState<Date>()
  const [view, setView] = useState("quarterly")
  const [sort, setSort] = useState("newest")

  const visibleTransactions = useMemo(() => {
    if (sort !== "oldest") return transactions
    return [...transactions].reverse()
  }, [sort])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Transaction History</CardTitle>
        <CardAction className="col-start-1 row-start-2 flex flex-wrap justify-self-stretch gap-3 xl:col-start-2 xl:row-start-1 xl:justify-self-end">
          <DateFilter
            label="From date"
            value={fromDate}
            onChange={setFromDate}
          />
          <DateFilter label="To date" value={toDate} onChange={setToDate} />
          <Select
            value={view}
            onValueChange={(value) => value && setView(value)}
            items={{
              daily: "Daily view",
              monthly: "Monthly view",
              quarterly: "Quarterly view",
            }}
          >
            <SelectTrigger className="w-40" aria-label="Change history view">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily view</SelectItem>
              <SelectItem value="monthly">Monthly view</SelectItem>
              <SelectItem value="quarterly">Quarterly view</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={sort}
            onValueChange={(value) => value && setSort(value)}
            items={{ newest: "Sort by", oldest: "Oldest first" }}
          >
            <SelectTrigger className="w-32" aria-label="Sort transactions">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="newest">Sort by</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Table className="min-w-4xl">
          <TableCaption className="sr-only">
            CD balance transaction history by period
          </TableCaption>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Period</TableHead>
              <TableHead className="text-right">Deposits</TableHead>
              <TableHead className="text-right">Deductions</TableHead>
              <TableHead className="text-right">Net Change</TableHead>
              <TableHead className="text-right">End Balance</TableHead>
              <TableHead className="text-right">Transactions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleTransactions.map((transaction) => (
              <TableRow key={transaction.period}>
                <TableCell className="font-medium">
                  {transaction.period}
                </TableCell>
                <TableCell className="text-right text-primary">
                  {transaction.deposits}
                </TableCell>
                <TableCell className="text-right text-destructive">
                  {transaction.deductions}
                </TableCell>
                <TableCell className="text-right text-primary">
                  {transaction.netChange}
                </TableCell>
                <TableCell className="text-right">
                  {transaction.endBalance}
                </TableCell>
                <TableCell className="text-right">
                  {transaction.transactions}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="/dashboard/cd-balance?page=1"
                text=""
                aria-label="Previous transaction page"
              />
            </PaginationItem>
            {[1, 2, 3, 4, 5].map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href={`/dashboard/cd-balance?page=${page}`}
                  isActive={page === 1}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="/dashboard/cd-balance?page=2"
                text=""
                aria-label="Next transaction page"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  )
}

export function EmployerCdBalance() {
  return (
    <SidebarProvider>
      <DashboardSidebar activeItem="cd-balance" />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-8 bg-muted/40 p-4 md:p-8">
          <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-medium tracking-tight">CD Balance</h1>
              <p className="text-muted-foreground">
                Manage your Corporate Deposit balance.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ReportsMenu />
              <Button size="lg">
                <FileText />
                Generate report
              </Button>
            </div>
          </section>
          <BalanceSummary />
          <TransactionMetrics />
          <TransactionHistory />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
