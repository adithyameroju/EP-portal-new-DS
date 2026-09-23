import { notFound } from "next/navigation"

import { EmployeePreview } from "@/components/blocks/employee-preview"
import type { EmployeeAction } from "@/components/blocks/employee-action-options"

const employeeActions: EmployeeAction[] = ["add", "update", "delete"]

export default async function EmployeePreviewPage({
  params,
}: {
  params: Promise<{ action: string }>
}) {
  const { action } = await params

  if (!employeeActions.includes(action as EmployeeAction)) {
    notFound()
  }

  return <EmployeePreview action={action as EmployeeAction} />
}
