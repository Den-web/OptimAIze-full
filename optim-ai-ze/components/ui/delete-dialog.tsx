"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface DeleteDialogProps {
  title: string
  description: string
  onDelete: () => void
  onCancel?: () => void
  buttonClassName?: string
}

export function DeleteDialog({
  title,
  description,
  onDelete,
  onCancel,
  buttonClassName,
}: DeleteDialogProps) {
  const [open, setOpen] = React.useState(false)

  const handleDelete = () => {
    onDelete()
    setOpen(false)
  }

  const handleCancel = () => {
    onCancel?.()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={buttonClassName}
        >
          <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 