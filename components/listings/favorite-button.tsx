"use client"

import { Heart } from "lucide-react"
import { cn } from "cn"
import { useFavorites } from "@/hooks/use-favorites"

export function FavoriteButton({
  listingId,
  className,
}: {
  listingId: number
  className?: string
}) {
  const { ids, ready, toggleFavorite } = useFavorites()
  const active = ids.includes(listingId)

  return (
    <button
      type="button"
      aria-label={active ? "Quitar de Mis Guardados" : "Guardar en Mis Guardados"}
      aria-pressed={active}
      disabled={!ready}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggleFavorite(listingId)
      }}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full border border-border/80 bg-card/95 text-muted-foreground shadow-sm backdrop-blur transition hover:scale-105 hover:text-rose-600 disabled:cursor-wait",
        active && "text-rose-600",
        className
      )}
    >
      <Heart
        aria-hidden="true"
        className={cn("size-5 transition-transform", active && "scale-110 fill-rose-500 text-rose-500")}
      />
    </button>
  )
}
