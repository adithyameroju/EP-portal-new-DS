"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  BarChart3,
  Bell,
  Bolt,
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
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
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

const balanceConfig = {
  balance: { label: "CD Balance", color: "var(--chart-1)" },
} satisfies ChartConfig

const statusConfig = {
  approved: { label: "Approved", color: "var(--chart-1)" },
  inProgress: { label: "In Progress", color: "var(--chart-2)" },
  rejected: { label: "Rejected", color: "var(--chart-3)" },
  completed: { label: "Completed", color: "var(--chart-4)" },
} satisfies ChartConfig

const familyConfig = {
  employee: { label: "Employee", color: "var(--chart-1)" },
  spouse: { label: "Spouse", color: "var(--chart-2)" },
  child: { label: "Child", color: "var(--chart-3)" },
  parent: { label: "Parent", color: "var(--chart-4)" },
} satisfies ChartConfig

const treatmentConfig = {
  hospitalisation: { label: "Hospitalisation", color: "var(--chart-1)" },
  dayCare: { label: "Day care", color: "var(--chart-2)" },
  maternity: { label: "Maternity", color: "var(--chart-3)" },
} satisfies ChartConfig

const totalLivesConfig = {
  employees: { label: "Employees", color: "var(--chart-1)" },
  dependents: { label: "Dependents", color: "var(--chart-2)" },
} satisfies ChartConfig

const openClaimsConfig = {
  openClaims: { label: "Open claims", color: "var(--chart-1)" },
  completed: { label: "Completed", color: "var(--chart-2)" },
} satisfies ChartConfig

const claimsViews = {
  status: {
    config: statusConfig,
    series: ["approved", "inProgress", "rejected", "completed"],
    diagram: "grouped",
    info: "200 Claims were processed this week. Avg claim approval time is 2.5 days.",
    count: [
      { month: "February", approved: 22, inProgress: 2, rejected: 4, completed: 16 },
      { month: "March", approved: 23, inProgress: 20, rejected: 18, completed: 13 },
      { month: "April", approved: 22, inProgress: 2, rejected: 4, completed: 16 },
      { month: "May", approved: 23, inProgress: 20, rejected: 18, completed: 13 },
      { month: "June", approved: 15, inProgress: 2, rejected: 7, completed: 10 },
      { month: "July", approved: 22, inProgress: 2, rejected: 4, completed: 16 },
    ],
    amount: [
      { month: "February", approved: 820, inProgress: 110, rejected: 90, completed: 640 },
      { month: "March", approved: 940, inProgress: 760, rejected: 420, completed: 610 },
      { month: "April", approved: 880, inProgress: 95, rejected: 130, completed: 700 },
      { month: "May", approved: 980, inProgress: 810, rejected: 390, completed: 670 },
      { month: "June", approved: 620, inProgress: 80, rejected: 170, completed: 430 },
      { month: "July", approved: 900, inProgress: 120, rejected: 150, completed: 650 },
    ],
  },
  member: {
    config: familyConfig,
    series: ["employee", "spouse", "child", "parent"],
    diagram: "stacked",
    info: "Employees account for the highest claim volume, followed by spouses and children.",
    count: [
      { month: "February", employee: 13, spouse: 8, child: 5, parent: 3 },
      { month: "March", employee: 18, spouse: 10, child: 7, parent: 5 },
      { month: "April", employee: 15, spouse: 9, child: 6, parent: 4 },
      { month: "May", employee: 20, spouse: 12, child: 8, parent: 6 },
      { month: "June", employee: 12, spouse: 7, child: 4, parent: 3 },
      { month: "July", employee: 17, spouse: 11, child: 7, parent: 5 },
    ],
    amount: [
      { month: "February", employee: 510, spouse: 290, child: 180, parent: 220 },
      { month: "March", employee: 690, spouse: 360, child: 250, parent: 310 },
      { month: "April", employee: 580, spouse: 330, child: 210, parent: 270 },
      { month: "May", employee: 760, spouse: 430, child: 290, parent: 350 },
      { month: "June", employee: 450, spouse: 260, child: 160, parent: 200 },
      { month: "July", employee: 650, spouse: 390, child: 240, parent: 300 },
    ],
  },
  treatments: {
    config: treatmentConfig,
    series: ["hospitalisation", "dayCare", "maternity"],
    diagram: "line",
    info: "Hospitalisation remains the most common treatment type across the period.",
    count: [
      { month: "February", hospitalisation: 24, dayCare: 10, maternity: 6 },
      { month: "March", hospitalisation: 29, dayCare: 14, maternity: 8 },
      { month: "April", hospitalisation: 21, dayCare: 13, maternity: 7 },
      { month: "May", hospitalisation: 32, dayCare: 16, maternity: 10 },
      { month: "June", hospitalisation: 18, dayCare: 9, maternity: 5 },
      { month: "July", hospitalisation: 27, dayCare: 15, maternity: 9 },
    ],
    amount: [
      { month: "February", hospitalisation: 920, dayCare: 330, maternity: 410 },
      { month: "March", hospitalisation: 1150, dayCare: 440, maternity: 520 },
      { month: "April", hospitalisation: 840, dayCare: 390, maternity: 460 },
      { month: "May", hospitalisation: 1280, dayCare: 510, maternity: 610 },
      { month: "June", hospitalisation: 710, dayCare: 280, maternity: 350 },
      { month: "July", hospitalisation: 1080, dayCare: 470, maternity: 550 },
    ],
  },
}

type ClaimsView = keyof typeof claimsViews
type ClaimsMetric = "count" | "amount"
type ClaimsDatum = Record<string, string | number>

const totalLivesData = [
  { category: "employees", value: 60, fill: "var(--color-employees)" },
  { category: "dependents", value: 40, fill: "var(--color-dependents)" },
]

const openClaimsData = [
  { category: "openClaims", value: 14, fill: "var(--color-openClaims)" },
  { category: "completed", value: 52, fill: "var(--color-completed)" },
]

const navigationItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Claims", href: "/dashboard/claims", icon: FileCheck2 },
  { label: "Endorsements", href: "/dashboard#endorsements", icon: FilePenLine },
  { label: "CD Balance", href: "/dashboard#balance", icon: WalletCards },
  { label: "Policy Management", href: "/dashboard#policies", icon: ShieldCheck },
  { label: "Reports", href: "/dashboard#reports", icon: FileText },
]

const QUICK_ACTION_ANIMATION_MS = 520

const quickActions = [
  {
    title: "Send e-Cards",
    description: "to employees and dependents",
    image: "/employer-dashboard/send-ecards.gif",
    stillImage: "/employer-dashboard/send-ecards-still.png",
    finalImage: "/employer-dashboard/send-ecards-final.png",
  },
  {
    title: "Bulk endorsements",
    description: "Add, modify, delete details",
    image: "/employer-dashboard/bulk-endorsements.gif",
    stillImage: "/employer-dashboard/bulk-endorsements-still.png",
    finalImage: "/employer-dashboard/bulk-endorsements-final.png",
  },
  {
    title: "Find Hospitals",
    description: "From 1000+ hospital network",
    image: "/employer-dashboard/find-hospitals.gif",
    stillImage: "/employer-dashboard/find-hospitals-still.png",
    finalImage: "/employer-dashboard/find-hospitals-final.png",
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
  config,
}: {
  data: typeof totalLivesData
  label: string
  value: string
  config: ChartConfig
}) {
  return (
    <ChartContainer
      config={config}
      className="size-24 shrink-0 aspect-square"
      initialDimension={{ width: 96, height: 96 }}
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel nameKey="category" />}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="category"
          innerRadius={30}
          outerRadius={42}
          strokeWidth={0}
          isAnimationActive={false}
        >
          <Label
            value={label}
            position="center"
            dy={-8}
            className="fill-muted-foreground text-xs"
          />
          <Label
            value={value}
            position="center"
            dy={10}
            className="fill-foreground text-base font-semibold"
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}

function MetricLegend({
  firstLabel,
  secondLabel,
  firstValue,
  secondValue,
}: {
  firstLabel: string
  secondLabel: string
  firstValue: string
  secondValue: string
}) {
  return (
    <ItemGroup className="flex-row flex-wrap gap-4">
      <Item size="xs" className="w-auto p-0">
        <ItemMedia>
          <span className="size-2.5 rounded-sm bg-chart-1" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="text-xs font-normal">{firstLabel}</ItemTitle>
        </ItemContent>
        <ItemActions className="text-xs font-medium">{firstValue}</ItemActions>
      </Item>
      <Item size="xs" className="w-auto p-0">
        <ItemMedia>
          <span className="size-2.5 rounded-sm bg-chart-2" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="text-xs font-normal">{secondLabel}</ItemTitle>
        </ItemContent>
        <ItemActions className="text-xs font-medium">{secondValue}</ItemActions>
      </Item>
    </ItemGroup>
  )
}

function MetricCard({
  title,
  value,
  donutLabel,
  donutValue,
  data,
  config,
  firstLabel,
  secondLabel,
  firstValue,
  secondValue,
}: {
  title: string
  value: string
  donutLabel: string
  donutValue: string
  data: typeof totalLivesData
  config: ChartConfig
  firstLabel: string
  secondLabel: string
  firstValue: string
  secondValue: string
}) {
  return (
    <Card className="min-h-44 rounded-2xl border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-base uppercase text-muted-foreground">
          {title}
        </CardTitle>
        <CardAction>
          <DonutChart
            data={data}
            label={donutLabel}
            value={donutValue}
            config={config}
          />
        </CardAction>
        <CardDescription className="text-3xl font-semibold tracking-tight text-foreground">
          {value}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MetricLegend
          firstLabel={firstLabel}
          secondLabel={secondLabel}
          firstValue={firstValue}
          secondValue={secondValue}
        />
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
      <CardContent className="flex flex-1 flex-col justify-end">
        <ChartContainer
          config={balanceConfig}
          className="h-60 w-full aspect-auto"
          initialDimension={{ width: 320, height: 240 }}
        >
          <LineChart
            accessibilityLayer
            data={balanceData}
            margin={{ top: 8, right: 16, bottom: 0, left: 8 }}
          >
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
              width={36}
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

function QuickActionItem({
  action,
}: {
  action: (typeof quickActions)[number]
}) {
  const [phase, setPhase] = useState<"idle" | "playing" | "complete">("idle")

  useEffect(() => {
    if (phase !== "playing") return

    const animationTimer = window.setTimeout(
      () => setPhase("complete"),
      QUICK_ACTION_ANIMATION_MS
    )

    return () => window.clearTimeout(animationTimer)
  }, [phase])

  const image =
    phase === "playing"
      ? action.image
      : phase === "complete"
        ? action.finalImage
        : action.stillImage

  return (
    <Item
      variant="outline"
      className="flex-1 bg-card"
      onMouseEnter={() => setPhase("playing")}
      onMouseLeave={() => setPhase("idle")}
    >
      <ItemMedia variant="image" className="size-16">
        <Image
          key={phase}
          src={image}
          alt=""
          width={64}
          height={64}
          unoptimized
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-lg">{action.title}</ItemTitle>
        <ItemDescription>{action.description}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Open ${action.title}`}
        >
          <ChevronRight />
        </Button>
      </ItemActions>
    </Item>
  )
}

function QuickActions() {
  return (
    <Card className="min-h-96 rounded-2xl border-0 bg-linear-to-b from-card to-primary/10 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 uppercase">
          <Bolt className="size-5" />
          Quick actions
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1">
        <ItemGroup className="gap-3">
          {quickActions.map((action) => (
            <QuickActionItem key={action.title} action={action} />
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}

function ClaimsDiagram({
  view,
  metric,
}: {
  view: ClaimsView
  metric: ClaimsMetric
}) {
  const settings = claimsViews[view]
  const data: ClaimsDatum[] = settings[metric]
  const tickFormatter = (value: number) =>
    metric === "amount" ? `₹${value}K` : String(value)

  return (
    <ChartContainer
      key={`${view}-${metric}`}
      config={settings.config}
      className="h-80 w-full aspect-auto"
      initialDimension={{ width: 900, height: 320 }}
    >
      {settings.diagram === "line" ? (
        <LineChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={tickFormatter}
            width={48}
          />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          <ChartLegend content={<ChartLegendContent />} />
          {settings.series.map((series) => (
            <Line
              key={series}
              type="monotone"
              dataKey={series}
              stroke={`var(--color-${series})`}
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      ) : (
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={tickFormatter}
            width={48}
          />
          <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
          <ChartLegend content={<ChartLegendContent />} />
          {settings.series.map((series) => (
            <Bar
              key={series}
              dataKey={series}
              fill={`var(--color-${series})`}
              stackId={settings.diagram === "stacked" ? "claims" : undefined}
              radius={4}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      )}
    </ChartContainer>
  )
}

function ClaimsMetricTabs({ view }: { view: ClaimsView }) {
  const settings = claimsViews[view]

  return (
    <Tabs defaultValue="count" className="gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Alert className="lg:max-w-2xl">
          <Info />
          <AlertDescription>{settings.info}</AlertDescription>
        </Alert>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">
            View claims by
          </span>
          <TabsList>
            <TabsTrigger value="count">Count</TabsTrigger>
            <TabsTrigger value="amount">Amount</TabsTrigger>
          </TabsList>
        </div>
      </div>
      <TabsContent value="count">
        <ClaimsDiagram view={view} metric="count" />
      </TabsContent>
      <TabsContent value="amount">
        <ClaimsDiagram view={view} metric="amount" />
      </TabsContent>
    </Tabs>
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
          <TabsList className="w-full justify-start overflow-x-auto">
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
            <ClaimsMetricTabs view="status" />
          </TabsContent>
          <TabsContent value="member">
            <ClaimsMetricTabs view="member" />
          </TabsContent>
          <TabsContent value="treatments">
            <ClaimsMetricTabs view="treatments" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export function DashboardSidebar({
  activeItem = "dashboard",
}: {
  activeItem?: "dashboard" | "claims"
}) {
  return (
    <Sidebar collapsible="icon" className="bg-card">
      <SidebarHeader>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={item.label.toLowerCase() === activeItem}
                    tooltip={item.label}
                    size="lg"
                  >
                    <item.icon />
                    <span className="group-data-[collapsible=icon]:hidden">
                      {item.label}
                    </span>
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
              <span className="group-data-[collapsible=icon]:hidden">
                Quick Actions
              </span>
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
              <span className="group-data-[collapsible=icon]:hidden">
                Contact
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/dashboard#settings" />}
              tooltip="Settings"
            >
              <Settings />
              <span className="group-data-[collapsible=icon]:hidden">
                Settings
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="group-data-[collapsible=icon]:hidden">
          <AckoLogo />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between gap-4 border-b border-border bg-card px-4 md:px-8">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <VimaLogo />
      </div>
      <div className="flex items-center gap-4 md:gap-8">
        <InputGroup className="hidden w-80 lg:flex">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            aria-label="Search employees"
            placeholder="Search employees by name/ID/email"
          />
        </InputGroup>
        <Select
          defaultValue="entity-1"
          items={{
            "entity-1": "Entity 1",
            "entity-2": "Entity 2",
            "entity-3": "Entity 3",
          }}
        >
          <SelectTrigger
            aria-label="Select active entity"
            className="hidden w-40 md:flex"
          >
            <Avatar size="sm">
              <AvatarImage
                src="/employer-dashboard/entity.png"
                alt="Entity 1"
              />
              <AvatarFallback>E1</AvatarFallback>
            </Avatar>
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="entity-1">Entity 1</SelectItem>
            <SelectItem value="entity-2">Entity 2</SelectItem>
            <SelectItem value="entity-3">Entity 3</SelectItem>
          </SelectContent>
        </Select>
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
      <DashboardSidebar activeItem="dashboard" />
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
                config={totalLivesConfig}
                firstLabel="Employees"
                secondLabel="Dependents"
                firstValue="60%"
                secondValue="40%"
              />
              <MetricCard
                title="Open Claims"
                value="14"
                donutLabel="Total Claims"
                donutValue="66"
                data={openClaimsData}
                config={openClaimsConfig}
                firstLabel="Open claims"
                secondLabel="Completed"
                firstValue="21%"
                secondValue="79%"
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
