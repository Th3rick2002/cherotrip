"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

type BackButtonProps = {
  label?: string
}

/**
 * Retrocede en el historial de la app (Home→detalle→Home, Explorar→detalle→Explorar).
 * No fuerza una ruta fija.
 */
export function BackButton({ label = "Atrás" }: BackButtonProps) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex items-center gap-1.5 rounded-full bg-card/95 px-3 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur"
      aria-label={label}
    >
      <ArrowLeft className="size-4" />
      {label}
    </button>
  )
}
