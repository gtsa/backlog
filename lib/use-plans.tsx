"use client"

import { useState, useCallback, useEffect } from "react"
import type { Plan, PlanStatus, Column } from "./types"

const demoPlans: Plan[] = [
  {
    id: "demo-1",
    title: "Q1 Marketing Campaign",
    description: "Plan and execute the Q1 marketing strategy for product launch",
    status: "to-plan",
    tags: ["marketing", "high-priority"],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    dueDate: new Date("2024-03-31"),
  },
  {
    id: "demo-2",
    title: "Website Redesign",
    description: "Modernize company website with new branding",
    status: "planning",
    tags: ["design", "frontend"],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-20"),
    dueDate: new Date("2024-04-15"),
  },
  {
    id: "demo-3",
    title: "API Integration",
    description: "Integrate third-party payment gateway",
    status: "in-progress",
    tags: ["backend", "urgent"],
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-22"),
    dueDate: new Date("2024-02-28"),
  },
  {
    id: "demo-4",
    title: "User Feedback Analysis",
    description: "Analyze Q4 user feedback and create action items",
    status: "review",
    tags: ["research", "ux"],
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-23"),
  },
  {
    id: "demo-5",
    title: "Security Audit",
    description: "Complete security audit for compliance",
    status: "done",
    tags: ["security", "compliance"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-18"),
    dueDate: new Date("2024-01-30"),
  },
]

export function usePlans(userEmail: string | null) {
  const [plans, setPlans] = useState<Plan[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  useEffect(() => {
    if (!userEmail) {
      // Not logged in - show demo plans
      setPlans(demoPlans)
    } else {
      // Logged in - load user's plans from localStorage
      const storageKey = `plans_${userEmail}`
      const storedPlans = localStorage.getItem(storageKey)
      if (storedPlans) {
        const parsed = JSON.parse(storedPlans)
        // Convert date strings back to Date objects
        const plansWithDates = parsed.map((plan: any) => ({
          ...plan,
          createdAt: new Date(plan.createdAt),
          updatedAt: new Date(plan.updatedAt),
          dueDate: plan.dueDate ? new Date(plan.dueDate) : undefined,
        }))
        setPlans(plansWithDates)
      } else {
        // New user - start with empty board
        setPlans([])
      }
    }
  }, [userEmail])

  useEffect(() => {
    if (userEmail && plans.length >= 0) {
      const storageKey = `plans_${userEmail}`
      localStorage.setItem(storageKey, JSON.stringify(plans))
    }
  }, [plans, userEmail])

  const allTags = Array.from(new Set(plans.flatMap((plan) => plan.tags))).sort()

  const filteredPlans = plans.filter((plan) => {
    const matchesSearch =
      searchQuery === "" ||
      plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => plan.tags.includes(tag))

    return matchesSearch && matchesTags
  })

  const columns: Column[] = [
    {
      id: "to-plan",
      title: "To Plan",
      plans: filteredPlans.filter((p) => p.status === "to-plan"),
    },
    {
      id: "planning",
      title: "Planning",
      plans: filteredPlans.filter((p) => p.status === "planning"),
    },
    {
      id: "in-progress",
      title: "In Progress",
      plans: filteredPlans.filter((p) => p.status === "in-progress"),
    },
    {
      id: "review",
      title: "Review",
      plans: filteredPlans.filter((p) => p.status === "review"),
    },
    {
      id: "done",
      title: "Done",
      plans: filteredPlans.filter((p) => p.status === "done"),
    },
  ]

  const movePlan = useCallback((planId: string, newStatus: PlanStatus) => {
    setPlans((prev) =>
      prev.map((plan) => (plan.id === planId ? { ...plan, status: newStatus, updatedAt: new Date() } : plan)),
    )
  }, [])

  const addPlan = useCallback((newPlan: Omit<Plan, "id" | "createdAt" | "updatedAt">) => {
    const plan: Plan = {
      ...newPlan,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setPlans((prev) => [...prev, plan])
    return plan
  }, [])

  const updatePlan = useCallback((planId: string, updates: Partial<Plan>) => {
    setPlans((prev) => prev.map((plan) => (plan.id === planId ? { ...plan, ...updates, updatedAt: new Date() } : plan)))
  }, [])

  const deletePlan = useCallback((planId: string) => {
    setPlans((prev) => prev.filter((plan) => plan.id !== planId))
  }, [])

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }, [])

  const clearTags = useCallback(() => {
    setSelectedTags([])
  }, [])

  return {
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
  }
}
