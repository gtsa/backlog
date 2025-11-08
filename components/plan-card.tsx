"use client"

import type React from "react"

import type { Plan } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Trash2 } from "lucide-react"
import { format } from "date-fns"

interface PlanCardProps {
  plan: Plan
  onClick: () => void
  onDelete: () => void
  isDragging?: boolean
}

export function PlanCard({ plan, onClick, onDelete, isDragging = false }: PlanCardProps) {
  const isOverdue = plan.dueDate && new Date(plan.dueDate) < new Date()

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete()
  }

  return (
    <Card
      className={`p-3 sm:p-4 cursor-pointer hover:shadow-md transition-shadow relative group ${isDragging ? "opacity-50" : ""}`}
      onClick={onClick}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onClick={handleDelete}
      >
        <Trash2 className="h-3 w-3" />
      </Button>

      <h3 className="font-semibold text-sm mb-2 text-balance pr-8">{plan.title}</h3>
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2 text-pretty">{plan.description}</p>

      {plan.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {plan.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
        {plan.dueDate && (
          <div className={`flex items-center gap-1 ${isOverdue ? "text-destructive" : ""}`}>
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(plan.dueDate), "MMM d")}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{format(new Date(plan.updatedAt), "MMM d")}</span>
        </div>
      </div>
    </Card>
  )
}
