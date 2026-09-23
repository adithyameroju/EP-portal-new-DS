import { EmployerClaimDetails } from "@/components/blocks/employer-claim-details"

const claimNumbers = [
  "ACK-2024-005",
  "ACK-2024-006",
  "ACK-2024-007",
  "ACK-2024-008",
  "ACK-2024-009",
  "ACK-2024-010",
  "ACK-2024-011",
  "ACK-2024-012",
]

export function generateStaticParams() {
  return claimNumbers.map((claimNumber) => ({ claimNumber }))
}

export default async function ClaimDetailsPage({
  params,
}: {
  params: Promise<{ claimNumber: string }>
}) {
  const { claimNumber } = await params

  return <EmployerClaimDetails claimNumber={decodeURIComponent(claimNumber)} />
}
