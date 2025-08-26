"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/use-auth"
import { usePlans } from "@/lib/use-plans"
import { KanbanColumn } from "@/components/kanban-column"
import { CompactPlanCard } from "@/components/compact-plan-card"
import { PlanModal } from "@/components/plan-modal"
import { FiltersBar } from "@/components/filters-bar"
import { LoginDialog } from "@/components/login-dialog"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import type { Plan, PlanStatus } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogIn, LogOut } from "lucide-react"

export default function HomePage() {
  const { isLoggedIn, userEmail, login, logout } = useAuth()

  const {
    columns,
    allTags,
    selectedTags,
    searchQuery,
    setSearchQuery,
    toggleTag,
    clearTags,
    movePlan,
    addPlan,
    updatePlan,
    deletePlan,
  } = usePlans(userEmail)

  const [draggedPlanId, setDraggedPlanId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>(undefined)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [mobileStatusFilter, setMobileStatusFilter] = useState<PlanStatus | "all">("all")
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; planId: string; planTitle: string }>({
    isOpen: false,
    planId: "",
    planTitle: "",
  })

  const handleDragStart = (planId: string) => {
    setDraggedPlanId(planId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (columnId: PlanStatus) => {
    if (draggedPlanId) {
      movePlan(draggedPlanId, columnId)
      setDraggedPlanId(null)
    }
  }

  const handlePlanClick = (planId: string) => {
    const plan = columns.flatMap((col) => col.plans).find((p) => p.id === planId)
    setSelectedPlan(plan)
    setIsModalOpen(true)
  }

  const handlePlanDelete = (planId: string) => {
    const plan = columns.flatMap((col) => col.plans).find((p) => p.id === planId)
    if (plan) {
      setDeleteConfirmation({
        isOpen: true,
        planId: plan.id,
        planTitle: plan.title,
      })
    }
  }

  const handleConfirmDelete = () => {
    deletePlan(deleteConfirmation.planId)
    setDeleteConfirmation({ isOpen: false, planId: "", planTitle: "" })
  }

  const handleCreatePlan = () => {
    setSelectedPlan(undefined)
    setIsModalOpen(true)
  }

  const handleSavePlan = (data: Partial<Plan>) => {
    if (selectedPlan) {
      updatePlan(selectedPlan.id, data)
    } else {
      addPlan({
        title: data.title!,
        description: data.description!,
        status: data.status || "to-plan",
        tags: data.tags || [],
        dueDate: data.dueDate,
      })
    }
  }

  const handleDeletePlan = () => {
    if (selectedPlan) {
      handlePlanDelete(selectedPlan.id)
      setIsModalOpen(false)
    }
  }

  const allPlans = columns.flatMap((col) => col.plans)
  const filteredMobilePlans =
    mobileStatusFilter === "all" ? allPlans : allPlans.filter((p) => p.status === mobileStatusFilter)

  const statusLabels: Record<PlanStatus | "all", string> = {
    all: "All",
    "to-plan": "To Plan",
    planning: "Planning",
    "in-progress": "In Progress",
    review: "Review",
    done: "Done",
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden p-4 sm:p-6">
      <div className="flex-1 flex flex-col overflow-hidden max-w-[1600px] mx-auto w-full">
        <div className="flex-shrink-0 mb-4 sm:mb-6 lg:mb-8 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 text-balance">Plans Board</h1>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground text-pretty">
              Organize and track your plans across different stages
            </p>
            {!isLoggedIn && (
              <div className="text-xs sm:text-sm text-muted-foreground mt-2 bg-muted/50 rounded-md px-3 py-2">
                Viewing demo board. All changes are temporary and won't be saved.
              </div>
            )}
            {isLoggedIn && userEmail && (
              <div className="text-xs sm:text-sm text-muted-foreground mt-2">
                Logged in as <span className="font-medium">{userEmail}</span>
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            {isLoggedIn ? (
              <Button onClick={logout} variant="outline" size="sm" className="gap-2 bg-transparent">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            ) : (
              <Button
                onClick={() => setIsLoginDialogOpen(true)}
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 mb-4 sm:mb-6">
          <FiltersBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            allTags={allTags}
            selectedTags={selectedTags}
            onToggleTag={toggleTag}
            onClearTags={clearTags}
            onCreatePlan={handleCreatePlan}
          />
        </div>

        <div className="flex-shrink-0 mb-4 md:hidden overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {(["all", "to-plan", "planning", "in-progress", "review", "done"] as const).map((status) => (
              <Badge
                key={status}
                variant={mobileStatusFilter === status ? "default" : "outline"}
                className="cursor-pointer whitespace-nowrap text-xs px-3 py-1"
                onClick={() => setMobileStatusFilter(status)}
              >
                {statusLabels[status]}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto md:hidden">
          <div className="space-y-2 pb-4">
            {filteredMobilePlans.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p className="text-sm">No plans found</p>
              </div>
            ) : (
              filteredMobilePlans.map((plan) => (
                <CompactPlanCard
                  key={plan.id}
                  plan={plan}
                  onClick={() => handlePlanClick(plan.id)}
                  onDelete={() => handlePlanDelete(plan.id)}
                />
              ))
            )}
          </div>
        </div>

        <div className="hidden md:flex flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex gap-3 lg:gap-4 h-full pb-4 min-w-min">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                onPlanClick={handlePlanClick}
                onPlanDelete={handlePlanDelete}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            ))}
          </div>
        </div>

        <PlanModal
          plan={selectedPlan}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSavePlan}
          onDelete={selectedPlan ? handleDeletePlan : undefined}
        />

        <LoginDialog isOpen={isLoginDialogOpen} onClose={() => setIsLoginDialogOpen(false)} onLogin={login} />

        <DeleteConfirmationDialog
          isOpen={deleteConfirmation.isOpen}
          onClose={() => setDeleteConfirmation({ isOpen: false, planId: "", planTitle: "" })}
          onConfirm={handleConfirmDelete}
          planTitle={deleteConfirmation.planTitle}
        />
      </div>
    </div>
  )
}
