"use client"

import { useCallback, useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

interface ConfirmDialogProps {
  readonly title: string
  readonly description: string
  readonly confirmLabel?: string
  readonly isOpen: boolean
  readonly onConfirm: () => void
  readonly onCancel: () => void
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel = "삭제",
  isOpen,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return

    // Focus cancel button when dialog opens
    cancelRef.current?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onCancel()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-desc"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className="bg-background border border-border rounded-xl p-6 max-w-sm mx-4 shadow-xl">
        <h3 id="confirm-dialog-title" className="text-base font-semibold mb-1">{title}</h3>
        <p id="confirm-dialog-desc" className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="flex justify-end gap-2">
          <Button ref={cancelRef} variant="ghost" size="sm" onClick={onCancel}>
            취소
          </Button>
          <Button variant="destructive" size="sm" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * Hook for confirm dialog state management.
 */
export function useConfirmDialog() {
  const [state, setState] = useState<{
    isOpen: boolean
    onConfirm: (() => void) | null
  }>({ isOpen: false, onConfirm: null })

  const confirm = useCallback((action: () => void) => {
    setState({ isOpen: true, onConfirm: action })
  }, [])

  const handleConfirm = useCallback(() => {
    state.onConfirm?.()
    setState({ isOpen: false, onConfirm: null })
  }, [state.onConfirm])

  const handleCancel = useCallback(() => {
    setState({ isOpen: false, onConfirm: null })
  }, [])

  return {
    isOpen: state.isOpen,
    confirm,
    onConfirm: handleConfirm,
    onCancel: handleCancel,
  }
}
