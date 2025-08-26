"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Plan, PlanStatus } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface PlanModalProps {
  plan?: Plan
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Plan>) => void
  onDelete?: () => void
  isDemo?: boolean
}

const statusOptions: { value: PlanStatus; label: string }[] = [
  { value: "to-plan", label: "To Plan" },
  { value: "planning", label: "Planning" },
  { value: "in-progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
]

export function PlanModal({ plan, isOpen, onClose, onSave, onDelete, isDemo = false }: PlanModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<PlanStatus>("to-plan")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [dueDate, setDueDate] = useState("")

  useEffect(() => {
    if (plan) {
      setTitle(plan.title)
      setDescription(plan.description)
      setStatus(plan.status)
      setTags(plan.tags)
      setDueDate(plan.dueDate ? new Date(plan.dueDate).toISOString().split("T")[0] : "")
    } else {
      setTitle("")
      setDescription("")
      setStatus("to-plan")
      setTags([])
      setTagInput("")
      setDueDate("")
    }
  }, [plan, isOpen])

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      title,
      description,
      status,
      tags,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{plan ? "Edit Plan" : "Create New Plan"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter plan title"
              required
              disabled={isDemo}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter plan description"
              rows={4}
              required
              disabled={isDemo}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as PlanStatus)} disabled={isDemo}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isDemo}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                placeholder="Add a tag"
                disabled={isDemo}
              />
              <Button type="button" variant="secondary" onClick={handleAddTag} disabled={isDemo}>
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    {!isDemo && (
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {isDemo && (
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
              Login to create and edit your own plans
            </div>
          )}

          <DialogFooter className="gap-2">
            {plan && onDelete && !isDemo && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  onDelete()
                  onClose()
                }}
                className="mr-auto"
              >
                Delete
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose}>
              {isDemo ? "Close" : "Cancel"}
            </Button>
            {!isDemo && <Button type="submit">Save</Button>}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
