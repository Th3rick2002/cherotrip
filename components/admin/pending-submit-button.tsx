"use client"

import { LoaderCircle } from "lucide-react"
import { useFormStatus } from "react-dom"
import type { ReactNode } from "react"

export function PendingSubmitButton({
  children,
  pendingLabel = "Guardando…",
  className,
}: {
  children: ReactNode
  pendingLabel?: string
  className: string
}) {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending} aria-busy={pending} className={`${className} disabled:cursor-wait disabled:opacity-65`}>
      {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
      {pending ? pendingLabel : children}
    </button>
  )
}
