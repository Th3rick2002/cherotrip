export const FAVORITES_STORAGE_KEY = "cherotrip_favorites_v1"
export const FAVORITES_CHANGE_EVENT = "cherotrip:favorites-change"

function normalizeIds(value: unknown): number[] {
  if (!Array.isArray(value)) return []
  return [...new Set(value.filter((id): id is number => Number.isSafeInteger(id) && id > 0))]
}

export function getFavoriteIds(): number[] {
  if (typeof window === "undefined") return []
  try {
    return normalizeIds(JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) ?? "[]"))
  } catch {
    return []
  }
}

export function isFavorite(id: number): boolean {
  return getFavoriteIds().includes(id)
}

export function saveFavoriteIds(ids: number[]) {
  if (typeof window === "undefined") return
  const normalized = normalizeIds(ids)
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(normalized))
  window.dispatchEvent(new Event(FAVORITES_CHANGE_EVENT))
}
