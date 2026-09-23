"use client"

import { Fragment, useEffect, useRef, useState } from "react"
import { format } from "date-fns"
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Download,
  Eye,
  Mail,
  ReceiptText,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

type Transaction = {
  id: string
  title: string
  description: string
  amount: string
  amountType: "credit" | "debit"
  balance: string
  date: Date
  bank: string
  account: string
  mode: string
  reference: string
  status: string
}

type InvoiceStatus = "Generated" | "Paid" | "Expired" | "Generating"

type ProformaInvoice = {
  id: string
  date: Date
  amount: string
  total: string
  status: InvoiceStatus
}

const transactions: Transaction[] = [
  {
    id: "UTR20251115449",
    title: "Wallet deposit",
    description: "Treasury funding — corporate transfer, reference 1449",
    amount: "+₹4,20,700",
    amountType: "credit",
    balance: "₹2,59,23,300",
    date: new Date(2027, 4, 4),
    bank: "ICICI Bank",
    account: "****5278",
    mode: "IMPS",
    reference: "UTR20251115449",
    status: "Settled",
  },
  {
    id: "END-2025-1448",
    title: "Endorsement",
    description: "Duplicate debit reversal, reference 1448",
    amount: "-₹1,17,600",
    amountType: "debit",
    balance: "₹2,55,04,600",
    date: new Date(2027, 4, 2),
    bank: "CD wallet",
    account: "Entity 1",
    mode: "Endorsement",
    reference: "END-2025-1448",
    status: "Settled",
  },
  {
    id: "END-2025-1447",
    title: "Premium refund",
    description: "Brokerage & charges — net off, reference 1447",
    amount: "+₹21,200",
    amountType: "credit",
    balance: "₹2,56,22,200",
    date: new Date(2027, 4, 1),
    bank: "CD wallet",
    account: "Entity 1",
    mode: "Refund",
    reference: "END-2025-1447",
    status: "Settled",
  },
  {
    id: "END-2025-1446",
    title: "Premium settlement",
    description: "COI / TPA fee settlement, reference 1446",
    amount: "-₹75,400",
    amountType: "debit",
    balance: "₹2,55,99,000",
    date: new Date(2027, 3, 30),
    bank: "CD wallet",
    account: "Entity 1",
    mode: "Settlement",
    reference: "END-2025-1446",
    status: "Settled",
  },
  {
    id: "UTR20251115445",
    title: "Wallet deposit",
    description: "Mid-term correction — salary revision, reference 1445",
    amount: "+₹3,36,300",
    amountType: "credit",
    balance: "₹2,56,74,400",
    date: new Date(2027, 3, 28),
    bank: "HDFC Bank",
    account: "****8132",
    mode: "NEFT",
    reference: "UTR20251115445",
    status: "Settled",
  },
  {
    id: "END-2025-1444",
    title: "Endorsement",
    description: "Life event — newborn cover, reference 1444",
    amount: "-₹98,200",
    amountType: "debit",
    balance: "₹2,53,38,100",
    date: new Date(2027, 3, 27),
    bank: "CD wallet",
    account: "Entity 1",
    mode: "Endorsement",
    reference: "END-2025-1444",
    status: "Settled",
  },
]

const initialInvoices: ProformaInvoice[] = [
  {
    id: "ACKO/PI/A226/4855",
    date: new Date(2026, 2, 18),
    amount: "₹5,00,000",
    total: "₹5,00,000",
    status: "Generated",
  },
  {
    id: "ACKO/PI/A226/4721",
    date: new Date(2026, 1, 5),
    amount: "₹12,00,000",
    total: "₹12,00,000",
    status: "Paid",
  },
  {
    id: "ACKO/PI/A225/9912",
    date: new Date(2025, 10, 20),
    amount: "₹8,00,000",
    total: "₹8,00,000",
    status: "Expired",
  },
]

function TransactionDetails({ transaction }: { transaction: Transaction }) {
  return (
    <ItemGroup className="grid gap-2 md:grid-cols-3 xl:grid-cols-6">
      <Item size="xs">
        <ItemContent>
          <ItemDescription>Bank</ItemDescription>
          <ItemTitle>{transaction.bank}</ItemTitle>
        </ItemContent>
      </Item>
      <Item size="xs">
        <ItemContent>
          <ItemDescription>Account</ItemDescription>
          <ItemTitle>{transaction.account}</ItemTitle>
        </ItemContent>
      </Item>
      <Item size="xs">
        <ItemContent>
          <ItemDescription>Mode</ItemDescription>
          <ItemTitle>{transaction.mode}</ItemTitle>
        </ItemContent>
      </Item>
      <Item size="xs">
        <ItemContent>
          <ItemDescription>Reference</ItemDescription>
          <ItemTitle>{transaction.reference}</ItemTitle>
        </ItemContent>
      </Item>
      <Item size="xs">
        <ItemContent>
          <ItemDescription>Created on</ItemDescription>
          <ItemTitle>{format(transaction.date, "dd MMM yyyy")}</ItemTitle>
        </ItemContent>
      </Item>
      <Item size="xs">
        <ItemContent>
          <ItemDescription>Status</ItemDescription>
          <Badge variant="outline">
            <CircleCheck />
            {transaction.status}
          </Badge>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}

function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  if (status === "Generating") {
    return (
      <Badge variant="secondary">
        <Spinner />
        Generating
      </Badge>
    )
  }

  const variant =
    status === "Paid"
      ? "default"
      : status === "Expired"
        ? "secondary"
        : "outline"

  return <Badge variant={variant}>{status}</Badge>
}

export function EmployerCdBalanceLedger() {
  const generationTimer = useRef<number | undefined>(undefined)
  const [activeTab, setActiveTab] = useState("transactions")
  const [expandedId, setExpandedId] = useState<string | null>(transactions[0].id)
  const [detailTransaction, setDetailTransaction] =
    useState<Transaction | null>(null)
  const [proformaOpen, setProformaOpen] = useState(false)
  const [rechargeAmount, setRechargeAmount] = useState("500000")
  const [invoices, setInvoices] = useState(initialInvoices)
  const [highlightedInvoice, setHighlightedInvoice] = useState<string | null>(
    null
  )
  const [dateFilter, setDateFilter] = useState("all")
  const [view, setView] = useState("monthly")

  useEffect(() => {
    return () => {
      if (generationTimer.current) {
        window.clearTimeout(generationTimer.current)
      }
    }
  }, [])

  const formattedRecharge = Number(rechargeAmount || 0).toLocaleString("en-IN")

  function generateInvoice() {
    const invoiceId = "ACKO/PI/A226/5032"
    const newInvoice: ProformaInvoice = {
      id: invoiceId,
      date: new Date(),
      amount: `₹${formattedRecharge}`,
      total: `₹${formattedRecharge}`,
      status: "Generating",
    }

    setInvoices((current) => [newInvoice, ...current])
    setHighlightedInvoice(invoiceId)
    setProformaOpen(false)
    setActiveTab("invoices")

    generationTimer.current = window.setTimeout(() => {
      setInvoices((current) =>
        current.map((invoice) =>
          invoice.id === invoiceId
            ? { ...invoice, status: "Generated" }
            : invoice
        )
      )
    }, 2000)
  }

  return (
    <SidebarProvider>
      <DashboardSidebar activeItem="cd-balance" />
      <SidebarInset className="min-w-0 bg-muted/40">
        <DashboardHeader />
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
          <PageHeading
            title="CD Balance"
            description="Cash deposit wallet for premiums and endorsements"
            actions={
              <p className="text-sm text-muted-foreground">
                Last updated 30 Mar 2026, 02:30 pm
              </p>
            }
          />

          <section className="grid gap-4 lg:grid-cols-5">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-sm font-normal uppercase text-muted-foreground">
                  CD Balance
                </CardTitle>
                <CardDescription className="text-3xl font-semibold tracking-tight text-foreground">
                  ₹48,50,000
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={83}>
                  <ProgressLabel>83% remaining</ProgressLabel>
                  <ProgressValue>
                    {() => "₹9,70,000 utilized"}
                  </ProgressValue>
                </Progress>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Need to top up?</CardTitle>
                <CardDescription>
                  Raise a proforma invoice for bank and UTR instructions.
                </CardDescription>
                <CardAction>
                  <Button type="button" onClick={() => setProformaOpen(true)}>
                    <ReceiptText />
                    Raise proforma invoice
                  </Button>
                </CardAction>
              </CardHeader>
            </Card>
          </section>

          <Card className="min-w-0 flex-1">
            <CardContent className="min-w-0">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="min-w-0"
              >
                <div className="border-b">
                  <TabsList variant="line">
                    <TabsTrigger value="transactions">
                      Transaction history
                    </TabsTrigger>
                    <TabsTrigger value="invoices">
                      Proforma invoices
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="transactions">
                  <div className="flex flex-col gap-4 pt-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <p className="text-sm text-muted-foreground">
                        Deposits and deductions from your CD wallet.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Select
                          value={dateFilter}
                          onValueChange={(value) =>
                            value && setDateFilter(value)
                          }
                          items={{
                            all: "All dates",
                            month: "This month",
                            quarter: "This quarter",
                          }}
                        >
                          <SelectTrigger
                            className="w-32"
                            aria-label="Filter transactions by date"
                          >
                            <CalendarDays />
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent align="end">
                            <SelectItem value="all">All dates</SelectItem>
                            <SelectItem value="month">This month</SelectItem>
                            <SelectItem value="quarter">
                              This quarter
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={view}
                          onValueChange={(value) => value && setView(value)}
                          items={{
                            monthly: "Monthly view",
                            daily: "Daily view",
                          }}
                        >
                          <SelectTrigger
                            className="w-36"
                            aria-label="Change transaction view"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent align="end">
                            <SelectItem value="monthly">
                              Monthly view
                            </SelectItem>
                            <SelectItem value="daily">Daily view</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Table className="min-w-5xl">
                      <TableCaption className="sr-only">
                        CD wallet deposits and deductions
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10">
                            <span className="sr-only">Expand</span>
                          </TableHead>
                          <TableHead>Transaction ID</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">Balance</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((transaction) => {
                          const expanded = expandedId === transaction.id
                          return (
                            <Fragment key={transaction.id}>
                              <TableRow
                                data-state={expanded ? "selected" : undefined}
                                tabIndex={0}
                                aria-expanded={expanded}
                                onClick={() =>
                                  setExpandedId(
                                    expanded ? null : transaction.id
                                  )
                                }
                                onKeyDown={(event) => {
                                  if (
                                    event.key === "Enter" ||
                                    event.key === " "
                                  ) {
                                    event.preventDefault()
                                    setExpandedId(
                                      expanded ? null : transaction.id
                                    )
                                  }
                                }}
                                className="cursor-pointer"
                              >
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    type="button"
                                    aria-label={`${expanded ? "Collapse" : "Expand"} ${transaction.id}`}
                                    onClick={(event) => {
                                      event.stopPropagation()
                                      setExpandedId(
                                        expanded ? null : transaction.id
                                      )
                                    }}
                                  >
                                    {expanded ? (
                                      <ChevronDown />
                                    ) : (
                                      <ChevronRight />
                                    )}
                                  </Button>
                                </TableCell>
                                <TableCell className="font-medium">
                                  {transaction.id}
                                </TableCell>
                                <TableCell>
                                  <span className="block font-medium">
                                    {transaction.title}
                                  </span>
                                  <span className="block text-xs text-muted-foreground">
                                    {transaction.description}
                                  </span>
                                </TableCell>
                                <TableCell
                                  className={`text-right font-medium ${
                                    transaction.amountType === "debit"
                                      ? "text-destructive"
                                      : "text-primary"
                                  }`}
                                >
                                  {transaction.amount}
                                </TableCell>
                                <TableCell className="text-right">
                                  {transaction.balance}
                                </TableCell>
                                <TableCell>
                                  {format(transaction.date, "dd MMM yyyy")}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="secondary"
                                    size="xs"
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation()
                                      setDetailTransaction(transaction)
                                    }}
                                  >
                                    <Eye />
                                    View
                                  </Button>
                                </TableCell>
                              </TableRow>
                              {expanded ? (
                                <TableRow>
                                  <TableCell colSpan={7}>
                                    <TransactionDetails
                                      transaction={transaction}
                                    />
                                  </TableCell>
                                </TableRow>
                              ) : null}
                            </Fragment>
                          )
                        })}
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
                        {[1, 2, 3].map((page) => (
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
                  </div>
                </TabsContent>

                <TabsContent value="invoices">
                  <div className="flex flex-col gap-4 pt-4">
                    <p className="text-sm text-muted-foreground">
                      Proforma invoices for CD wallet top-ups.
                    </p>
                    <Table>
                      <TableCaption className="sr-only">
                        Generated proforma invoices
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice number</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">
                            Total (incl. GST)
                          </TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoices.map((invoice) => (
                          <TableRow
                            key={invoice.id}
                            data-state={
                              highlightedInvoice === invoice.id
                                ? "selected"
                                : undefined
                            }
                          >
                            <TableCell className="font-medium">
                              {invoice.id}
                            </TableCell>
                            <TableCell>
                              {format(invoice.date, "dd MMM yyyy")}
                            </TableCell>
                            <TableCell className="text-right">
                              {invoice.amount}
                            </TableCell>
                            <TableCell className="text-right">
                              {invoice.total}
                            </TableCell>
                            <TableCell>
                              <InvoiceStatusBadge status={invoice.status} />
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="secondary"
                                  size="xs"
                                  type="button"
                                >
                                  <Eye />
                                  View
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon-xs"
                                  type="button"
                                  aria-label={`Email ${invoice.id}`}
                                >
                                  <Mail />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon-xs"
                                  type="button"
                                  aria-label={`Download ${invoice.id}`}
                                >
                                  <Download />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>

        <Dialog
          open={Boolean(detailTransaction)}
          onOpenChange={(open) => !open && setDetailTransaction(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Deposit details</DialogTitle>
              <DialogDescription>
                {detailTransaction?.description}
              </DialogDescription>
            </DialogHeader>
            {detailTransaction ? (
              <ItemGroup>
                <Item size="xs">
                  <ItemContent>
                    <ItemDescription>Transaction ID</ItemDescription>
                    <ItemTitle>{detailTransaction.id}</ItemTitle>
                  </ItemContent>
                </Item>
                <Item size="xs">
                  <ItemContent>
                    <ItemDescription>Bank</ItemDescription>
                    <ItemTitle>{detailTransaction.bank}</ItemTitle>
                  </ItemContent>
                  <ItemActions>{detailTransaction.account}</ItemActions>
                </Item>
                <Item size="xs">
                  <ItemContent>
                    <ItemDescription>Mode</ItemDescription>
                    <ItemTitle>{detailTransaction.mode}</ItemTitle>
                  </ItemContent>
                  <ItemActions>{detailTransaction.reference}</ItemActions>
                </Item>
                <Item size="xs">
                  <ItemContent>
                    <ItemDescription>Amount</ItemDescription>
                    <ItemTitle className="text-primary">
                      {detailTransaction.amount}
                    </ItemTitle>
                  </ItemContent>
                  <ItemActions>{detailTransaction.balance}</ItemActions>
                </Item>
                <Item size="xs">
                  <ItemContent>
                    <ItemDescription>Status</ItemDescription>
                    <Badge variant="outline">
                      <CircleCheck />
                      {detailTransaction.status}
                    </Badge>
                  </ItemContent>
                </Item>
              </ItemGroup>
            ) : null}
            <DialogFooter showCloseButton />
          </DialogContent>
        </Dialog>

        <Dialog open={proformaOpen} onOpenChange={setProformaOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Raise Proforma Invoice</DialogTitle>
              <DialogDescription>
                Enter a recharge amount — there is no minimum.
              </DialogDescription>
            </DialogHeader>
            <Field>
              <FieldLabel htmlFor="recharge-amount">
                Recharge amount
              </FieldLabel>
              <InputGroup>
                <InputGroupAddon>₹</InputGroupAddon>
                <InputGroupInput
                  id="recharge-amount"
                  type="number"
                  min="0"
                  value={rechargeAmount}
                  onChange={(event) => setRechargeAmount(event.target.value)}
                  aria-label="Recharge amount"
                />
              </InputGroup>
            </Field>
            <div className="flex flex-wrap gap-2">
              {["200000", "500000", "1000000", "2500000"].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="xs"
                  type="button"
                  onClick={() => setRechargeAmount(amount)}
                >
                  ₹{Number(amount).toLocaleString("en-IN")}
                </Button>
              ))}
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Invoice preview</CardTitle>
              </CardHeader>
              <CardContent>
                <ItemGroup>
                  <Item size="xs">
                    <ItemContent>
                      <ItemTitle>CD Balance Recharge</ItemTitle>
                    </ItemContent>
                    <ItemActions>₹{formattedRecharge}</ItemActions>
                  </Item>
                  <Item size="xs">
                    <ItemContent>
                      <ItemTitle>GST</ItemTitle>
                    </ItemContent>
                    <ItemActions>Not applicable</ItemActions>
                  </Item>
                  <Item variant="muted" size="xs">
                    <ItemContent>
                      <ItemTitle>Total payable</ItemTitle>
                    </ItemContent>
                    <ItemActions className="font-semibold">
                      ₹{formattedRecharge}
                    </ItemActions>
                  </Item>
                </ItemGroup>
              </CardContent>
            </Card>
            <p className="text-xs text-muted-foreground">
              Billing entity: Acme India Pvt Ltd · GSTIN 29AABCR1234F1Z5
            </p>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <Button
                type="button"
                onClick={generateInvoice}
                disabled={!Number(rechargeAmount)}
              >
                Generate Invoice
                <ChevronRight />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  )
}
