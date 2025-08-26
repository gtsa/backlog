"use client"

import type React from "react"

import type { Column } from "@/lib/types"
import { PlanCard } from "./plan-card"

interface KanbanColumnProps {
  column: Column
  onPlanClick: (planId: string) => void
  onPlanDelete: (planId: string) => void
  onDragStart: (planId: string) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (columnId: string) => void
}

export function KanbanColumn({
  column,
  onPlanClick,
  onPlanDelete,
  onDragStart,
  onDragOver,
  onDrop,
}: KanbanColumnProps) {
  return (
    <div className="flex flex-col min-w-[280px] sm:min-w-[300px] flex-shrink-0">
      <div className="bg-muted/50 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm">{column.title}</h2>
          <span className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-full">
            {column.plans.length}
          </span>
        </div>
      </div>

      <div
        className="flex-1 space-y-3 min-h-[200px] rounded-lg p-2"
        onDragOver={onDragOver}
        onDrop={() => onDrop(column.id)}
      >
        {column.plans.map((plan) => (
          <div key={plan.id} draggable onDragStart={() => onDragStart(plan.id)}>
            <PlanCard plan={plan} onClick={() => onPlanClick(plan.id)} onDelete={() => onPlanDelete(plan.id)} />
          </div>
        ))}
      </div>
    </div>
  )
}
