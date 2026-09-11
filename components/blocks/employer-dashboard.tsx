"use client"

import Image from "next/image"
import Link from "next/link"
import {
  BarChart3,
  Bell,
  Bolt,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  FileCheck2,
  FilePenLine,
  FileText,
  HeartPulse,
  Info,
  LayoutDashboard,
  Search,
  Settings,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Input } from "@/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const balanceData = [
  { month: "Jun 25", balance: 20 },
  { month: "", balance: 45 },
  { month: "Jul 25", balance: 74 },
  { month: "", balance: 45 },
  { month: "", balance: 61 },
  { month: "", balance: 58 },
  { month: "", balance: 34 },
  { month: "Aug 25", balance: 54 },
]

const claimsData = [
  { month: "February", approved: 22, inProgress: 2, rejected: 4, completed: 16 },
  { month: "March", approved: 23, inProgress: 20, rejected: 18, completed: 13 },
  { month: "April", approved: 22, inProgress: 2, rejected: 4, completed: 16 },
  { month: "May", approved: 23, inProgress: 20, rejected: 18, completed: 13 },
  { month: "June", approved: 15, inProgress: 2, rejected: 7, completed: 10 },
  { month: "July", approved: 22, inProgress: 2, rejected: 4, completed: 16 },
]

const balanceConfig = {
  balance: { label: "CD Balance", color: "var(--chart-1)" },
} satisfies ChartConfig

const claimsConfig = {
  approved: { label: "Approved", color: "var(--chart-1)" },
  inProgress: { label: "In Progress", color: "var(--chart-2)" },
  rejected: { label: "Rejected", color: "var(--chart-3)" },
  completed: { label: "Completed", color: "var(--chart-4)" },
} satisfies ChartConfig

const totalLivesData = [
  { name: "Employees", value: 60, fill: "var(--chart-2)" },
  { name: "Dependents", value: 40, fill: "var(--chart-1)" },
]

const openClaimsData = [
  { name: "Open claims", value: 60, fill: "var(--chart-2)" },
  { name: "Completed", value: 40, fill: "var(--chart-1)" },
]

const navigationItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, active: true },
  { label: "Claims", href: "/dashboard#claims", icon: FileCheck2 },
  { label: "Endorsements", href: "/dashboard#endorsements", icon: FilePenLine },
  { label: "CD Balance", href: "/dashboard#balance", icon: WalletCards },
  { label: "Policy Management", href: "/dashboard#policies", icon: ShieldCheck },
  { label: "Reports", href: "/dashboard#reports", icon: FileText },
]

const quickActions = [
  {
    title: "Send e-Cards",
    description: "to employees and dependents",
    image: "/employer-dashboard/send-ecards.gif",
  },
  {
    title: "Bulk endorsements",
    description: "Add, modify, delete details",
    image: "/employer-dashboard/bulk-endorsements.gif",
  },
  {
    title: "Find Hospitals",
    description: "From 1000+ hospital network",
    image: "/employer-dashboard/find-hospitals.gif",
  },
]

function VimaLogo() {
  return (
    <div
      className="flex h-8 items-center gap-1 rounded-md bg-foreground px-2"
      aria-label="VIMA"
      role="img"
    >
      <div className="relative h-5 w-3">
        <Image
          src="/employer-dashboard/vima-shape-2.svg"
          alt=""
          fill
          className="object-contain"
        />
        <Image
          src="/employer-dashboard/vima-shape-1.svg"
          alt=""
          width={8}
          height={8}
          className="absolute right-0 top-0"
        />
      </div>
      <Image
        src="/employer-dashboard/vima-shape-3.svg"
        alt=""
        width={30}
        height={12}
      />
    </div>
  )
}

function AckoLogo() {
  return (
    <div className="flex items-center gap-1" aria-label="Powered by ACKO">
      <span className="text-xs text-muted-foreground">Powered by</span>
      <Image
        src="/employer-dashboard/acko-mark.svg"
        alt=""
        width={25}
        height={19}
      />
      <Image
        src="/employer-dashboard/acko-wordmark.svg"
        alt="ACKO"
        width={55}
        height={14}
      />
    </div>
  )
}

function DonutChart({
  data,
  label,
  value,
}: {
  data: typeof totalLivesData
  label: string
  value: string
}) {
  return (
    <div className="relative size-24 shrink-0">
      <ChartContainer
        config={claimsConfig}
        className="size-24 aspect-square"
        initialDimension={{ width: 96, height: 96 }}
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={30}
            outerRadius={42}
            strokeWidth={0}
            isAnimationActive={false}
          />
        </PieChart>
      </ChartContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-base font-semibold text-foreground">{value}</span>
      </div>
    </div>
  )
}

function MetricLegend({
  firstLabel,
  secondLabel,
}: {
  firstLabel: string
  secondLabel: string
}) {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-foreground">
      <div className="flex items-center gap-2">
        <span className="size-2.5 rounded-sm bg-chart-2" />
        <span>{firstLabel}</span>
        <span className="font-medium">60%</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="size-2.5 rounded-sm bg-chart-1" />
        <span>{secondLabel}</span>
        <span className="font-medium">40%</span>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  donutLabel,
  donutValue,
  data,
  firstLabel,
  secondLabel,
}: {
  title: string
  value: string
  donutLabel: string
  donutValue: string
  data: typeof totalLivesData
  firstLabel: string
  secondLabel: string
}) {
  return (
    <Card className="min-h-44 rounded-2xl border-0 shadow-none">
      <CardHeader className="grid grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-1">
          <CardDescription className="text-base font-medium uppercase">
            {title}
          </CardDescription>
          <CardTitle className="text-3xl font-semibold tracking-tight">
            {value}
          </CardTitle>
        </div>
        <DonutChart data={data} label={donutLabel} value={donutValue} />
      </CardHeader>
      <CardContent>
        <MetricLegend firstLabel={firstLabel} secondLabel={secondLabel} />
      </CardContent>
    </Card>
  )
}

function BalanceCard() {
  return (
    <Card
      id="balance"
      className="min-h-96 rounded-2xl border-0 shadow-none"
    >
      <CardHeader>
        <CardDescription className="text-base font-medium uppercase">
          CD Balance Trend
        </CardDescription>
        <CardTitle className="text-3xl font-semibold tracking-tight">
          ₹ 1,06,500
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={balanceConfig}
          className="h-60 w-full aspect-auto"
          initialDimension={{ width: 320, height: 240 }}
        >
          <LineChart accessibilityLayer data={balanceData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}K`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="var(--color-balance)"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function QuickActions() {
  return (
    <section className="flex min-h-96 flex-col gap-4 rounded-2xl bg-linear-to-b from-card to-primary/10 p-4">
      <div className="flex items-center gap-2">
        <Bolt className="size-5" />
        <h2 className="text-base font-medium uppercase text-foreground">
          Quick actions
        </h2>
      </div>
      <div className="flex flex-1 flex-col gap-3">
        {quickActions.map((action) => (
          <Card key={action.title} size="sm" className="flex-1">
            <CardContent className="flex h-full items-center gap-4">
              <Image
                src={action.image}
                alt=""
                width={64}
                height={64}
                unoptimized
                className="size-16 shrink-0 object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-lg font-medium text-foreground">
                  {action.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {action.description}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Open ${action.title}`}
              >
                <ChevronRight />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

function ClaimsChart() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2">
          <Info className="size-5 shrink-0" />
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">200 Claims</span> were processed
            this week. Avg claim approval time is{" "}
            <span className="font-semibold">2.5 days</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">
            View claims by
          </span>
          <Button type="button" size="sm">
            Count
          </Button>
          <Button type="button" variant="outline" size="sm">
            Amount
          </Button>
        </div>
      </div>
      <ChartContainer
        config={claimsConfig}
        className="h-80 w-full aspect-auto"
        initialDimension={{ width: 900, height: 320 }}
      >
        <BarChart accessibilityLayer data={claimsData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <YAxis
            domain={[0, 40]}
            ticks={[0, 10, 20, 30, 40]}
            tickLine={false}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="approved"
            fill="var(--color-approved)"
            radius={4}
            isAnimationActive={false}
          />
          <Bar
            dataKey="inProgress"
            fill="var(--color-inProgress)"
            radius={4}
            isAnimationActive={false}
          />
          <Bar
            dataKey="rejected"
            fill="var(--color-rejected)"
            radius={4}
            isAnimationActive={false}
          />
          <Bar
            dataKey="completed"
            fill="var(--color-completed)"
            radius={4}
            isAnimationActive={false}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

function ClaimsTrend() {
  return (
    <Card id="claims" className="rounded-xl border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Claims Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="status" className="gap-6">
          <TabsList className="grid h-auto w-full grid-cols-1 gap-2 rounded-2xl p-3 sm:grid-cols-3">
            <TabsTrigger value="status">
              <BarChart3 />
              View by status
            </TabsTrigger>
            <TabsTrigger value="member">
              <Users />
              View by family member
            </TabsTrigger>
            <TabsTrigger value="treatments">
              <HeartPulse />
              View by treatments
            </TabsTrigger>
          </TabsList>
          <TabsContent value="status">
            <ClaimsChart />
          </TabsContent>
          <TabsContent value="member">
            <ClaimsChart />
          </TabsContent>
          <TabsContent value="treatments">
            <ClaimsChart />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function DashboardSidebar() {
  return (
    <Sidebar collapsible="offcanvas" className="bg-card">
      <SidebarContent>
        <SidebarGroup className="pt-8">
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={item.active}
                    tooltip={item.label}
                    size="lg"
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="gap-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/dashboard#quick-actions" />}
              tooltip="Quick Actions"
              size="lg"
            >
              <Bolt />
              <span>Quick Actions</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/dashboard#contact" />}
              tooltip="Contact"
            >
              <CircleHelp />
              <span>Contact</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/dashboard#settings" />}
              tooltip="Settings"
            >
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <AckoLogo />
      </SidebarFooter>
    </Sidebar>
  )
}

function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between gap-4 border-b border-border bg-card px-4 md:px-8">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <VimaLogo />
      </div>
      <div className="flex items-center gap-4 md:gap-8">
        <div className="relative hidden w-80 lg:block">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            aria-label="Search employees"
            placeholder="Search employees by name/ID/email"
            className="pl-8"
          />
        </div>
        <Button type="button" variant="secondary" className="hidden md:inline-flex">
          <Avatar size="sm">
            <AvatarImage
              src="/employer-dashboard/entity.png"
              alt="Entity 1"
            />
            <AvatarFallback>E1</AvatarFallback>
          </Avatar>
          Entity 1
          <ChevronDown />
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          aria-label="Notifications"
        >
          <Bell />
        </Button>
        <Avatar size="lg">
          <AvatarFallback>PS</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}

export function EmployerDashboard() {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="bg-muted">
        <DashboardHeader />
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6 lg:p-8">
          <section className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Welcome back, Purushottam
            </h1>
            <p className="text-sm text-muted-foreground">
              Here are some <span className="font-semibold">quick insights</span>{" "}
              you might be interested
            </p>
          </section>
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <BalanceCard />
            <div className="grid gap-6">
              <MetricCard
                title="Total Lives"
                value="1,234"
                donutLabel="Total Lives"
                donutValue="100%"
                data={totalLivesData}
                firstLabel="Employees"
                secondLabel="Dependents"
              />
              <MetricCard
                title="Open Claims"
                value="14"
                donutLabel="Total Claims"
                donutValue="66"
                data={openClaimsData}
                firstLabel="Open claims"
                secondLabel="Completed"
              />
            </div>
            <div id="quick-actions">
              <QuickActions />
            </div>
          </section>
          <ClaimsTrend />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
