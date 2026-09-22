import { EmployerPolicyDetails } from "@/components/blocks/employer-policy-details"

export default async function PolicyDetailsPage({
  params,
}: {
  params: Promise<{ policyNumber: string }>
}) {
  const { policyNumber } = await params

  return <EmployerPolicyDetails policyNumber={decodeURIComponent(policyNumber)} />
}
