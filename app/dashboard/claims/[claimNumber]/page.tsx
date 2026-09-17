import { EmployerClaimDetails } from "@/components/blocks/employer-claim-details"

export default async function ClaimDetailsPage({
  params,
}: {
  params: Promise<{ claimNumber: string }>
}) {
  const { claimNumber } = await params

  return <EmployerClaimDetails claimNumber={decodeURIComponent(claimNumber)} />
}
