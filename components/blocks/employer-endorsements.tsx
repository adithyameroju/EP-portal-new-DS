"use client"

import { useState } from "react"
import {
  BrainCircuit,
  ChevronRight,
  Download,
  FileSpreadsheet,
  FileText,
  UserPen,
  UserMinus,
  UserPlus,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
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

const endorsementActions = [
  {
    label: "Add new Employees",
    description: "Add new employees with plan selection",
    icon: UserPlus,
  },
  {
    label: "Update Employee details",
    description: "Update details, dependents, or plans",
    icon: UserPen,
  },
  {
    label: "Delete Employee details",
    description: "Remove employees from the policy",
    icon: UserMinus,
  },
  {
    label: "Smart Endorsements",
    description: "Upload your own Excel—AI maps data and submit",
    icon: BrainCircuit,
    isNew: true,
  },
]

const transactionRows = Array.from({ length: 7 }, (_, index) => ({
  id: `endorsement-${index + 1}`,
  date: "12 March 2025",
  time: "12:00:12",
  action: "Bulk Addition",
  doneBy: "Rahul Jain",
}))

function EndorsementActions() {
  return (
    <ItemGroup className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {endorsementActions.map((action) => (
          <Item
            key={action.label}
            render={
              <Button
                type="button"
                variant="outline"
                className="whitespace-normal"
              />
            }
            variant="outline"
            className="relative min-h-48 flex-col items-start justify-between gap-4 bg-card p-5 text-left hover:bg-muted"
          >
            {action.isNew ? (
              <Badge className="absolute right-4 top-4">New</Badge>
            ) : null}
            <ItemMedia className="rounded-full bg-accent p-3 text-accent-foreground">
              <action.icon className="size-8" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="line-clamp-none text-base">
                {action.label}
              </ItemTitle>
              <ItemDescription>
                {action.description}
              </ItemDescription>
            </ItemContent>
            <ItemActions className="gap-1 text-primary">
              <span className="text-sm font-medium">Get started</span>
              <ChevronRight className="size-4" />
            </ItemActions>
          </Item>
        ))}
    </ItemGroup>
  )
}

function EndorsementHistory() {
  const [view, setView] = useState("monthly")
  const [dateRange, setDateRange] = useState("all")
  const [type, setType] = useState("all")
  const [sort, setSort] = useState("default")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Transaction History</CardTitle>
        <CardAction className="col-start-1 row-start-2 flex flex-wrap justify-self-stretch gap-3 xl:col-start-2 xl:row-start-1 xl:justify-self-end">
          <Select
            value={view}
            onValueChange={(value) => value && setView(value)}
            items={{
              monthly: "Monthly view",
              quarterly: "Quarterly view",
              yearly: "Yearly view",
            }}
          >
            <SelectTrigger className="w-40" aria-label="Change history view">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly view</SelectItem>
              <SelectItem value="quarterly">Quarterly view</SelectItem>
              <SelectItem value="yearly">Yearly view</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={dateRange}
            onValueChange={(value) => value && setDateRange(value)}
            items={{
              all: "Date Range",
              week: "Last 7 days",
              month: "Last 30 days",
            }}
          >
            <SelectTrigger className="w-36" aria-label="Filter date range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Date Range</SelectItem>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={type}
            onValueChange={(value) => value && setType(value)}
            items={{
              all: "All Types",
              addition: "Bulk Addition",
              deletion: "Bulk Deletion",
            }}
          >
            <SelectTrigger className="w-32" aria-label="Filter endorsement type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="addition">Bulk Addition</SelectItem>
              <SelectItem value="deletion">Bulk Deletion</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={sort}
            onValueChange={(value) => value && setSort(value)}
            items={{ default: "Sort by", newest: "Newest first" }}
          >
            <SelectTrigger className="w-32" aria-label="Sort endorsements">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="default">Sort by</SelectItem>
              <SelectItem value="newest">Newest first</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table className="min-w-4xl">
          <TableCaption className="sr-only">
            Endorsement transaction history and downloadable schedules
          </TableCaption>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Done by</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Endorsement Schedule</TableHead>
              <TableHead className="text-center">Download</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactionRows.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  {transaction.date}{" "}
                  <span className="text-muted-foreground">
                    {transaction.time}
                  </span>
                </TableCell>
                <TableCell>{transaction.action}</TableCell>
                <TableCell>{transaction.doneBy}</TableCell>
                <TableCell>
                  <Badge>Success</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    View file
                    <FileSpreadsheet />
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Download ${transaction.id}`}
                  >
                    <Download />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export function EmployerEndorsements() {
  return (
    <SidebarProvider>
      <DashboardSidebar activeItem="endorsements" />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-6 bg-muted/40 p-4 md:p-8">
          <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-medium tracking-tight">
              Endorsements
            </h1>
            <Button size="lg">
              <FileText />
              Generate report
            </Button>
          </section>
          <EndorsementActions />
          <EndorsementHistory />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
