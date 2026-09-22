import { notFound } from "next/navigation"

import {
  EmployeeActionOptions,
  type EmployeeAction,
} from "@/components/blocks/employee-action-options"

const employeeActions: EmployeeAction[] = ["add", "update", "delete"]

export default async function EmployeeActionPage({
  params,
}: {
  params: Promise<{ action: string }>
}) {
  const { action } = await params

  if (!employeeActions.includes(action as EmployeeAction)) {
    notFound()
  }

  return <EmployeeActionOptions action={action as EmployeeAction} />
}
