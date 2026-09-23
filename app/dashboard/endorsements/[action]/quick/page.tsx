import { notFound } from "next/navigation"

import { EmployeeQuickFlow } from "@/components/blocks/employee-quick-flow"
import type { EmployeeAction } from "@/components/blocks/employee-action-options"

const employeeActions: EmployeeAction[] = ["add", "update", "delete"]

export function generateStaticParams() {
  return employeeActions.map((action) => ({ action }))
}

export default async function EmployeeQuickFlowPage({
  params,
}: {
  params: Promise<{ action: string }>
}) {
  const { action } = await params

  if (!employeeActions.includes(action as EmployeeAction)) {
    notFound()
  }

  return <EmployeeQuickFlow action={action as EmployeeAction} />
}
