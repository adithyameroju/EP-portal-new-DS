import { Suspense } from "react"

import { EmployerEndorsements } from "@/components/blocks/employer-endorsements"

export default function EndorsementsPage() {
  return (
    <Suspense>
      <EmployerEndorsements />
    </Suspense>
  )
}
