import { cacheLife } from "next/cache"
import { createPublicClient } from "@/lib/supabase/public"
import type { Category, Listing } from "@/lib/types/listing"

type ListingRow = Listing & {
  listing_categories?: { categories: Category | Category[] | null }[] | null
}

function mapListing(row: ListingRow): Listing {
  const categories =
    row.listing_categories
      ?.flatMap((entry) => {
        if (!entry.categories) return []
        return Array.isArray(entry.categories)
          ? entry.categories
          : [entry.categories]
      })
      .filter(Boolean) ?? []

  const { listing_categories: _ignored, ...listing } = row
  return { ...listing, categories }
}

const listingSelect = `
  id, slug, type, title, description, department, meeting_point,
  cover_image_url, starts_at, ends_at, schedule_text, price_from,
  payment_methods, transport_info, accessibility_notes, extras,
  restrictions, tags, whatsapp_phone, verified, featured, published_at,
  listing_categories (
    categories ( id, slug, name, icon, sort_order )
  )
`

export async function getCategories(): Promise<Category[]> {
  "use cache"
  cacheLife("hours")

  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, name, icon, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("getCategories", error.message)
    return []
  }
  return data ?? []
}

export async function getUpcomingEvents(limit = 6): Promise<Listing[]> {
  "use cache"
  cacheLife("minutes")

  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from("listings")
    .select(listingSelect)
    .eq("is_published", true)
    .eq("type", "event")
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(limit)

  if (error) {
    console.error("getUpcomingEvents", error.message)
    return []
  }
  return (data as ListingRow[] | null)?.map(mapListing) ?? []
}

export async function getFeaturedPlaces(limit = 6): Promise<Listing[]> {
  "use cache"
  cacheLife("minutes")

  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from("listings")
    .select(listingSelect)
    .eq("is_published", true)
    .eq("type", "place")
    .eq("featured", true)
    .order("published_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("getFeaturedPlaces", error.message)
    return []
  }
  return (data as ListingRow[] | null)?.map(mapListing) ?? []
}

export type SearchListingsParams = {
  q?: string
  category?: string
  department?: string
  limit?: number
}

export async function searchListings(
  params: SearchListingsParams = {}
): Promise<{ items: Listing[]; total: number }> {
  "use cache"
  cacheLife("minutes")

  const { q, category, department, limit = 24 } = params
  const supabase = createPublicClient()

  let query = supabase
    .from("listings")
    .select(listingSelect, { count: "exact" })
    .eq("is_published", true)
    .order("starts_at", { ascending: true, nullsFirst: false })
    .limit(limit)

  if (department) {
    query = query.eq("department", department)
  }
  if (q?.trim()) {
    const term = q.trim().replace(/[%_,]/g, "")
    query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`)
  }
  if (category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", category)
      .maybeSingle()

    if (!cat) return { items: [], total: 0 }

    const { data: links } = await supabase
      .from("listing_categories")
      .select("listing_id")
      .eq("category_id", cat.id)

    const ids = (links ?? []).map((l) => l.listing_id)
    if (ids.length === 0) return { items: [], total: 0 }
    query = query.in("id", ids)
  }

  const { data, error, count } = await query
  if (error) {
    console.error("searchListings", error.message)
    return { items: [], total: 0 }
  }

  return {
    items: (data as ListingRow[] | null)?.map(mapListing) ?? [],
    total: count ?? 0,
  }
}

export async function getListingBySlug(
  slug: string
): Promise<Listing | null> {
  "use cache"
  cacheLife("minutes")

  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from("listings")
    .select(listingSelect)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle()

  if (error) {
    console.error("getListingBySlug", error.message)
    return null
  }
  if (!data) return null
  return mapListing(data as ListingRow)
}
