import { EmployerPolicyDetails } from "@/components/blocks/employer-policy-details"

const policyNumbers = [
  "GMC-EMP-1024",
  "GPA-EMP-1024",
  "GMC-EMP-1025",
  "GPA-EMP-1025",
  "GMC-EMP-1026",
  "GPA-EMP-1026",
  "GMC-EMP-1027",
  "GMC-EMP-1028",
  "GPA-EMP-1028",
  "GMC-EMP-1029",
  "GMC-EMP-1030",
  "GPA-EMP-1030",
]

export function generateStaticParams() {
  return policyNumbers.map((policyNumber) => ({ policyNumber }))
}

export default async function PolicyDetailsPage({
  params,
}: {
  params: Promise<{ policyNumber: string }>
}) {
  const { policyNumber } = await params

  return <EmployerPolicyDetails policyNumber={decodeURIComponent(policyNumber)} />
}
