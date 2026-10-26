"use client"

import { useCallback, useEffect, useState } from "react"
import {
  FAVORITES_CHANGE_EVENT,
  getFavoriteIds,
  saveFavoriteIds,
} from "@/lib/favorites"

export function useFavorites() {
  const [ids, setIds] = useState<number[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const sync = () => {
      setIds(getFavoriteIds())
      setReady(true)
    }
    sync()
    window.addEventListener("storage", sync)
    window.addEventListener(FAVORITES_CHANGE_EVENT, sync)
    return () => {
      window.removeEventListener("storage", sync)
      window.removeEventListener(FAVORITES_CHANGE_EVENT, sync)
    }
  }, [])

  const toggleFavorite = useCallback((id: number) => {
    const current = getFavoriteIds()
    const next = current.includes(id)
      ? current.filter((favoriteId) => favoriteId !== id)
      : [...current, id]
    saveFavoriteIds(next)
    setIds(next)
  }, [])

  const removeFavorite = useCallback((id: number) => {
    const next = getFavoriteIds().filter((favoriteId) => favoriteId !== id)
    saveFavoriteIds(next)
    setIds(next)
  }, [])

  return { ids, ready, toggleFavorite, removeFavorite }
}
