import type { EmployeeAction } from "@/components/blocks/employee-action-options"

export type DependentRecord = {
  id: number
  relation: string
  fullName: string
  dateOfBirth: string
  gender: string
  sameAsEmployee: boolean
  basePlan: string
  secondaryPlan: string
  topUpPlan: string
  addOnPlan: string
}

export type EmployeeRecord = {
  id: number
  fullName: string
  employeeId: string
  email: string
  dateOfBirth: string
  gender: string
  dateOfJoining: string
  mobile: string
  gmcEnabled: boolean
  gpaEnabled: boolean
  basePlan: string
  secondaryPlan: string
  topUpPlan: string
  addOnPlan: string
  gpaBasePlan: string
  dependents: DependentRecord[]
}

export type EndorsementDraft = {
  action: EmployeeAction
  employees: EmployeeRecord[]
}

export type EndorsementSubmission = {
  id: string
  action: EmployeeAction
  createdAt: number
  employeeCount: number
  dependentCount: number
}

export const ENDORSEMENT_PROCESSING_MS = 10_000

const DRAFT_KEY = "acko-endorsement-draft"
const SUBMISSIONS_KEY = "acko-endorsement-submissions"

function canUseStorage() {
  return typeof window !== "undefined"
}

export function saveEndorsementDraft(draft: EndorsementDraft) {
  if (!canUseStorage()) return
  window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
}

export function loadEndorsementDraft(): EndorsementDraft | null {
  if (!canUseStorage()) return null
  const raw = window.localStorage.getItem(DRAFT_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as EndorsementDraft
  } catch {
    return null
  }
}

export function clearEndorsementDraft() {
  if (!canUseStorage()) return
  window.localStorage.removeItem(DRAFT_KEY)
}

export function listEndorsementSubmissions(): EndorsementSubmission[] {
  if (!canUseStorage()) return []
  const raw = window.localStorage.getItem(SUBMISSIONS_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as EndorsementSubmission[]
  } catch {
    return []
  }
}

export function addEndorsementSubmission(
  submission: Omit<EndorsementSubmission, "id" | "createdAt">
) {
  if (!canUseStorage()) return null
  const next: EndorsementSubmission = {
    ...submission,
    id: `endorsement-${Date.now()}`,
    createdAt: Date.now(),
  }
  window.localStorage.setItem(
    SUBMISSIONS_KEY,
    JSON.stringify([next, ...listEndorsementSubmissions()])
  )
  return next
}

export function getEndorsementStatus(
  createdAt: number,
  now = Date.now()
): "processing" | "completed" {
  return now - createdAt < ENDORSEMENT_PROCESSING_MS
    ? "processing"
    : "completed"
}

export function planLabel(value: string) {
  const labels: Record<string, string> = {
    "base-3l": "3L",
    "base-5l": "5L",
    none: "None",
    "secondary-2l": "Secondary · 2L",
    "top-up-5l": "Top-up · 5L",
    wellness: "Wellness add-on",
    factor: "GPA FACTOR BASED",
    maxmin: "GPA MAX MIN",
    mileage: "Per mile flat rate",
    crystal: "GPA CRYSTAL-Base",
    corp: "GPA CRYD0CGPA",
  }
  return labels[value] ?? value
}
