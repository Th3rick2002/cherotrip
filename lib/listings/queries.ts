import { cacheLife, cacheTag } from "next/cache"
import { createPublicClient } from "@/lib/supabase/public"
import {
  type ActivityCategory,
  type Category,
  type Department,
  type Listing,
  type ListingPartner,
  type SubEvent,
} from "@/lib/types/listing"

type ListingRow = Listing & {
  department_info?: { name: string } | { name: string }[] | null
  listing_categories?: { categories: Category | Category[] | null }[] | null
  listing_partners?: Array<Omit<ListingPartner, "partner"> & { partners: ListingPartner["partner"] | ListingPartner["partner"][] | null }> | null
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

  const departmentInfo = Array.isArray(row.department_info) ? row.department_info[0] : row.department_info
  const listing = { ...row, department: departmentInfo?.name ?? "" }
  delete listing.department_info
  delete listing.listing_categories
  const partners = (row.listing_partners ?? []).flatMap((entry) => {
    const partner = Array.isArray(entry.partners) ? entry.partners[0] : entry.partners
    return partner ? [{ id: entry.id, relationship_type: entry.relationship_type, display_text: entry.display_text, partner }] : []
  })
  delete listing.listing_partners
  return { ...listing, categories, partners }
}

const listingColumns = `
  id, slug, type, title, description, department_id,
  department_info:departments!listings_department_id_fkey(name), meeting_point,
  cover_image_url, starts_at, ends_at, schedule_text, price_from,
  payment_methods, transport_info, accessibility_notes, extras,
  restrictions, tags, whatsapp_phone, verified, featured, published_at
`

export type DepartmentListings = {
  departments: Department[]
  listingsByDepartment: Record<string, Listing[]>
}

export async function getPublicDepartments(): Promise<Department[]> {
  "use cache"
  cacheLife("minutes")
  cacheTag("public-departments")

  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from("departments")
    .select("id, name, slug, is_active, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
  if (error) {
    console.error("getPublicDepartments", error.message)
    return []
  }
  return (data ?? []) as Department[]
}

const listingSelect = `
  ${listingColumns},
  listing_categories (
    categories ( id, slug, name, icon, sort_order )
  )
`

const listingDetailSelect = `
  ${listingColumns},
  instagram_url, facebook_url, tiktok_url, ticket_url, ticket_provider,
  accommodation_url, accommodation_search_query,
  listing_categories (
    categories ( id, slug, name, icon, sort_order )
  ),
  listing_partners (
    id, relationship_type, display_text,
    partners ( id, name, description, category, logo_url, website_url, whatsapp_phone, instagram_url )
  )
`

export async function getCategories(): Promise<Category[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("public-categories")

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
  cacheTag("public-listings")

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
  cacheTag("public-listings")

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
  tag?: string
  type?: "event" | "place"
  limit?: number
}

export async function searchListings(
  params: SearchListingsParams = {}
): Promise<{ items: Listing[]; total: number }> {
  "use cache"
  cacheLife("minutes")
  cacheTag("public-listings")

  const { q, category, department, tag, type, limit = 24 } = params
  const supabase = createPublicClient()
  const departments = department ? await getPublicDepartments() : []
  const selectedDepartment = departments.find((item) => item.slug === department || item.name === department)
  if (department && !selectedDepartment) return { items: [], total: 0 }

  let query = supabase
    .from("listings")
    .select(listingSelect, { count: "exact" })
    .eq("is_published", true)
    .order("starts_at", { ascending: true, nullsFirst: false })
    .limit(limit)

  if (type) {
    query = query.eq("type", type)
  }
  if (department) {
    query = query.eq("department_id", selectedDepartment!.id)
  }
  if (tag?.trim()) {
    query = query.contains("tags", [tag.trim()])
  }
  if (q?.trim()) {
    const term = q.trim().replace(/[%_,]/g, "")
    query = query.or(
      `title.ilike.%${term}%,description.ilike.%${term}%,transport_info.ilike.%${term}%`
    )
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

export async function getPlacesByDepartment(
  department: string,
  limit = 6
): Promise<Listing[]> {
  "use cache"
  cacheLife("minutes")
  cacheTag("public-listings")

  const supabase = createPublicClient()
  const departments = await getPublicDepartments()
  const selectedDepartment = departments.find((item) => item.slug === department || item.name === department)
  if (!selectedDepartment) return []
  const { data, error } = await supabase
    .from("listings")
    .select(listingSelect)
    .eq("is_published", true)
    .eq("type", "place")
    .eq("department_id", selectedDepartment.id)
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("getPlacesByDepartment", error.message)
    return []
  }
  return (data as ListingRow[] | null)?.map(mapListing) ?? []
}

export async function getListingsGroupedByDepartment(
  limitPerDept = 6
): Promise<DepartmentListings> {
  "use cache"
  cacheLife("minutes")
  cacheTag("public-listings")

  const supabase = createPublicClient()
  const departments = await getPublicDepartments()
  const departmentIds = departments.map((department) => department.id)
  if (departmentIds.length === 0) return { departments, listingsByDepartment: {} }
  const now = new Date().toISOString()
  const [placesResult, eventsResult] = await Promise.all([
    supabase
      .from("listings")
      .select(listingSelect)
      .eq("is_published", true)
      .eq("type", "place")
      .in("department_id", departmentIds)
      .order("featured", { ascending: false })
      .order("published_at", { ascending: false }),
    supabase
      .from("listings")
      .select(listingSelect)
      .eq("is_published", true)
      .eq("type", "event")
      .in("department_id", departmentIds)
      .gte("starts_at", now)
      .order("starts_at", { ascending: true }),
  ])

  if (placesResult.error || eventsResult.error) {
    console.error("getListingsGroupedByDepartment", placesResult.error?.message ?? eventsResult.error?.message)
    return { departments, listingsByDepartment: Object.fromEntries(departments.map((d) => [d.slug, []])) }
  }

  const places = (placesResult.data as ListingRow[] | null)?.map(mapListing) ?? []
  const events = (eventsResult.data as ListingRow[] | null)?.map(mapListing) ?? []
  const grouped = Object.fromEntries(
    departments.map((department) => [
      department.slug,
      interleaveListings(
        places.filter((item) => item.department_id === department.id),
        events.filter((item) => item.department_id === department.id),
        limitPerDept
      ),
    ])
  ) as Record<string, Listing[]>

  return { departments, listingsByDepartment: grouped }
}

function interleaveListings(places: Listing[], events: Listing[], limit: number): Listing[] {
  const result: Listing[] = []
  let placeIndex = 0
  let eventIndex = 0
  while (result.length < limit && (placeIndex < places.length || eventIndex < events.length)) {
    if (placeIndex < places.length) result.push(places[placeIndex++])
    if (result.length < limit && eventIndex < events.length) result.push(events[eventIndex++])
  }
  return result
}

export async function getListingBySlug(
  slug: string
): Promise<Listing | null> {
  "use cache"
  cacheLife("minutes")
  cacheTag("public-listings")

  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from("listings")
    .select(listingDetailSelect)
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

export async function getSubEvents(listingId: number): Promise<SubEvent[]> {
  "use cache"
  cacheLife("minutes")
  cacheTag("public-listings")

  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from("sub_events")
    .select(
      "id, listing_id, event_date, start_time, end_time, title, description, venue, activity_category_id, sort_order, activity_categories ( id, slug, name, sort_order, is_active )"
    )
    .eq("listing_id", listingId)
    .order("event_date", { ascending: true })
    .order("start_time", { ascending: true })
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("getSubEvents", error.message)
    return []
  }

  return (data ?? []).map((row) => {
    const category = row.activity_categories
    return {
      ...row,
      activity_category: (Array.isArray(category) ? category[0] : category) as
        | ActivityCategory
        | null,
    } as SubEvent
  })
}

export async function getListingsByIds(ids: number[]): Promise<Listing[]> {
  if (ids.length === 0) return []

  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from("listings")
    .select(listingSelect)
    .eq("is_published", true)
    .in("id", ids)

  if (error) {
    console.error("getListingsByIds", error.message)
    return []
  }

  return (data as ListingRow[] | null)?.map(mapListing) ?? []
}
