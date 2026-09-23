import {
  Activity,
  Calculator,
  CircleCheck,
  CreditCard,
  Layers3,
  Package,
  TrendingDown,
  UserRound,
  UsersRound,
  Wallet,
} from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Card,
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
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { EmployeeRecord } from "@/lib/endorsement-session"

export function CdImpactPanel({
  employees,
  isCalculating,
  hasCalculated,
}: {
  employees: EmployeeRecord[]
  isCalculating: boolean
  hasCalculated: boolean
}) {
  const dependentCount = employees.reduce(
    (total, employee) => total + employee.dependents.length,
    0
  )
  const gmcLives = employees.length + dependentCount

  return (
    <Card className="lg:h-full lg:min-h-0">
      <CardHeader>
        <CardTitle>Premium &amp; CD impact</CardTitle>
        <CardDescription>
          {hasCalculated
            ? "Estimated premium is ready for this batch."
            : "Current deposit and batch size stay visible while you fill the form."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isCalculating ? (
          <Item variant="muted">
            <ItemMedia>
              <Spinner />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Calculating premium</ItemTitle>
              <ItemDescription>
                Checking plan selections, taxes, and CD balance.
              </ItemDescription>
            </ItemContent>
          </Item>
        ) : hasCalculated ? (
          <>
            <Item variant="muted">
              <ItemMedia variant="icon">
                <Wallet />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>New CD balance</ItemTitle>
                <ItemDescription>After this estimated deduction</ItemDescription>
              </ItemContent>
              <ItemActions className="text-xl font-semibold text-primary">
                ₹47,06,630
              </ItemActions>
            </Item>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cover</TableHead>
                  <TableHead>Lives</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <UserRound className="size-4" />
                      GMC base
                    </span>
                  </TableCell>
                  <TableCell>{gmcLives}</TableCell>
                  <TableCell className="text-right">₹84,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <Activity className="size-4" />
                      GPA base
                    </span>
                  </TableCell>
                  <TableCell>{employees.length}</TableCell>
                  <TableCell className="text-right">₹28,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <Layers3 className="size-4" />
                      GMC secondary
                    </span>
                  </TableCell>
                  <TableCell>{dependentCount}</TableCell>
                  <TableCell className="text-right">₹6,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <Package className="size-4" />
                      GMC add-ons
                    </span>
                  </TableCell>
                  <TableCell>{dependentCount}</TableCell>
                  <TableCell className="text-right">₹3,500</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2}>Subtotal (excl. GST)</TableCell>
                  <TableCell className="text-right">₹1,21,500</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>GST (18%)</TableCell>
                  <TableCell className="text-right">₹21,870</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>Total premium</TableCell>
                  <TableCell className="text-right font-semibold text-primary">
                    ₹1,43,370
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            <ItemGroup>
              <Item variant="outline" size="xs">
                <ItemMedia>
                  <CreditCard className="size-4" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Current CD</ItemTitle>
                </ItemContent>
                <ItemActions>₹48,50,000</ItemActions>
              </Item>
              <Item variant="outline" size="xs">
                <ItemMedia>
                  <TrendingDown className="size-4" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Deduction</ItemTitle>
                </ItemContent>
                <ItemActions>−₹1,43,370</ItemActions>
              </Item>
            </ItemGroup>
            <Alert>
              <CircleCheck />
              <AlertDescription>
                Enough CD remains for this batch.
              </AlertDescription>
            </Alert>
          </>
        ) : (
          <ItemGroup>
            <Item variant="muted">
              <ItemMedia variant="icon">
                <Wallet />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Current CD balance</ItemTitle>
                <ItemDescription>Available for this endorsement</ItemDescription>
              </ItemContent>
              <ItemActions className="text-xl font-semibold">
                ₹48,50,000
              </ItemActions>
            </Item>
            <Item variant="outline" size="xs">
              <ItemMedia>
                <UsersRound className="size-4" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>In this request</ItemTitle>
                <ItemDescription>
                  {employees.length} employees · {dependentCount} dependents
                </ItemDescription>
              </ItemContent>
            </Item>
            <Alert>
              <Calculator />
              <AlertDescription>
                Complete the form, then calculate premium to see the deduction.
              </AlertDescription>
            </Alert>
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  )
}
