export type PlanStatus = "to-plan" | "planning" | "in-progress" | "review" | "done"

export interface Plan {
  id: string
  title: string
  description: string
  status: PlanStatus
  tags: string[]
  createdAt: Date
  updatedAt: Date
  dueDate?: Date
}

export interface Column {
  id: PlanStatus
  title: string
  plans: Plan[]
}
