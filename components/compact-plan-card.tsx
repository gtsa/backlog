"use client"

import type React from "react"
import type { Plan } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface CompactPlanCardProps {
  plan: Plan
  onClick: () => void
  onDelete: () => void
}

export function CompactPlanCard({ plan, onClick, onDelete }: CompactPlanCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete()
  }

  const statusColors = {
    "to-plan": "bg-slate-500/10 text-slate-700 dark:text-slate-300",
    planning: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
    "in-progress": "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    review: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
    done: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  }

  const statusLabels = {
    "to-plan": "To Plan",
    planning: "Planning",
    "in-progress": "In Progress",
    review: "Review",
    done: "Done",
  }

  return (
    <Card
      className="p-3 cursor-pointer hover:shadow-md transition-shadow relative group flex items-center gap-3"
      onClick={onClick}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge className={`text-xs ${statusColors[plan.status]}`} variant="secondary">
            {statusLabels[plan.status]}
          </Badge>
          {plan.tags.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {plan.tags.length} {plan.tags.length === 1 ? "tag" : "tags"}
            </span>
          )}
        </div>
        <h3 className="font-semibold text-sm text-balance line-clamp-1">{plan.title}</h3>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </Card>
  )
}
