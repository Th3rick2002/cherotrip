import { cacheLife, cacheTag } from "next/cache"
import type { HomeQuickLink } from "@/lib/types/listing"
import { createPublicClient } from "@/lib/supabase/public"

export const DEFAULT_QUICK_COLLECTIONS: Array<Omit<HomeQuickLink, "id">> = [
  { slug: "mochilero", section: "collection", label: "Mochilero", icon_key: "backpack", target_kind: "tag", target_value: "Mochilero", sort_order: 10, is_active: true },
  { slug: "familiar", section: "collection", label: "Familiar", icon_key: "users", target_kind: "tag", target_value: "Familiar", sort_order: 20, is_active: true },
  { slug: "aventura-4x4", section: "collection", label: "Aventura 4x4", icon_key: "mountain", target_kind: "search", target_value: "4x4", sort_order: 30, is_active: true },
]

export const DEFAULT_QUICK_SERVICES: Array<Omit<HomeQuickLink, "id">> = [
  { slug: "buses", section: "service", label: "Rutas de buses", icon_key: "bus", target_kind: "search", target_value: "bus", sort_order: 10, is_active: true },
  { slug: "lancheros", section: "service", label: "Lancheros", icon_key: "ship", target_kind: "search", target_value: "lancha", sort_order: 20, is_active: true },
  { slug: "camping", section: "service", label: "Zonas de camping", icon_key: "tent", target_kind: "tag", target_value: "Camping", sort_order: 30, is_active: true },
]

export async function getHomeQuickLinks(section: HomeQuickLink["section"]): Promise<Array<Omit<HomeQuickLink, "id"> & { id?: number }>> {
  "use cache"
  cacheLife("hours")
  cacheTag("home-content")

  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from("home_quick_links")
    .select("id, slug, section, label, icon_key, target_kind, target_value, sort_order, is_active")
    .eq("section", section)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
  if (error) {
    console.error("getHomeQuickLinks", error.message)
    return section === "collection" ? DEFAULT_QUICK_COLLECTIONS : DEFAULT_QUICK_SERVICES
  }
  return (data ?? []) as Array<HomeQuickLink>
}

export function homeQuickLinkHref(link: Pick<HomeQuickLink, "target_kind" | "target_value">) {
  const params = new URLSearchParams()
  if (link.target_kind === "search") params.set("q", link.target_value)
  if (link.target_kind === "tag") params.set("tag", link.target_value)
  if (link.target_kind === "category") params.set("categoria", link.target_value)
  return `/explorar?${params.toString()}`
}
