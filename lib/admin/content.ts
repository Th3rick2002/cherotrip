import type {
  ActivityCategory,
  Category,
  CommunitySubmission,
  Department,
  HomeQuickLink,
  Listing,
  ListingType,
  SubEvent,
} from "@/lib/types/listing"
import { createClient } from "@/lib/supabase/server"

export type AdminCategory = Category & {
  is_active: boolean
  listing_types: ListingType[]
}

export type AdminListing = Listing & {
  is_published: boolean
  created_at: string
  category_ids: number[]
}

export type AdminListingDetail = AdminListing & {
  sub_events: SubEvent[]
}

export type AdminActivityCategory = ActivityCategory

export async function getAdminDepartments(): Promise<Department[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("departments")
    .select("id, name, slug, is_active, sort_order")
    .order("sort_order", { ascending: true })
  if (error) throw new Error("No se pudieron cargar los departamentos.")
  return (data ?? []) as Department[]
}

export type AdminCommunitySubmission = CommunitySubmission & {
  converted_listing_id: number | null
  photo_url: string | null
}

export async function getAdminListings(type: ListingType): Promise<AdminListing[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("listings")
    .select("id, slug, type, title, description, department_id, department_info:departments!listings_department_id_fkey(name), cover_image_url, starts_at, ends_at, schedule_text, price_from, is_published, featured, verified, published_at, created_at, listing_categories(category_id)")
    .eq("type", type)
    .order("updated_at", { ascending: false })

  if (error) throw new Error(`No se pudo cargar el contenido: ${error.message}`)
  return ((data ?? []) as Array<Record<string, unknown>>).map((row) => {
    const departmentInfo = row.department_info as { name: string } | null
    delete row.department_info
    return {
      ...row,
      department: departmentInfo?.name ?? "",
      category_ids: ((row.listing_categories as Array<{ category_id: number }> | null) ?? []).map(
        (link) => link.category_id
      ),
    }
  }) as unknown as AdminListing[]
}

export async function getAdminListing(
  id: number,
  type: ListingType
): Promise<AdminListingDetail | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("listings")
    .select("*, department_info:departments!listings_department_id_fkey(name), listing_categories(category_id)")
    .eq("id", id)
    .eq("type", type)
    .maybeSingle()
  if (error) throw new Error(`No se pudo cargar el registro: ${error.message}`)
  if (!data) return null

  const { data: subEvents, error: agendaError } = await supabase
    .from("sub_events")
    .select("id, listing_id, event_date, start_time, end_time, title, description, venue, activity_category_id, sort_order")
    .eq("listing_id", id)
    .order("event_date", { ascending: true })
    .order("start_time", { ascending: true })
    .order("sort_order", { ascending: true })
  if (agendaError) throw new Error(`No se pudo cargar la agenda: ${agendaError.message}`)

  const row = data as unknown as Record<string, unknown>
  const departmentInfo = row.department_info as { name: string } | null
  delete row.department_info
  return {
    ...(row as unknown as Listing),
    department: departmentInfo?.name ?? "",
    is_published: row.is_published as boolean,
    created_at: row.created_at as string,
    category_ids: ((row.listing_categories as Array<{ category_id: number }> | null) ?? []).map(
      (link) => link.category_id
    ),
    sub_events: (subEvents ?? []) as unknown as SubEvent[],
  }
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const supabase = await createClient()
  const [{ data: categories, error }, { data: scopes, error: scopeError }] = await Promise.all([
    supabase.from("categories").select("id, slug, name, icon, sort_order, is_active").order("sort_order"),
    supabase.from("category_listing_types").select("category_id, listing_type"),
  ])
  if (error) {
    console.error("getAdminCategories: categories", error.code, error.message)
    throw new Error("No se pudieron cargar las categorías del directorio.")
  }
  if (scopeError) {
    console.error("getAdminCategories: category_listing_types", scopeError.code, scopeError.message)
    if (scopeError.code === "42P01" || scopeError.code === "PGRST205") {
      throw new Error("Falta aplicar la migración del CMS en Supabase para cargar los alcances de categorías.")
    }
    throw new Error("No se pudieron cargar los alcances de las categorías.")
  }

  const typesById = new Map<number, ListingType[]>()
  for (const scope of scopes ?? []) {
    const types = typesById.get(scope.category_id) ?? []
    types.push(scope.listing_type as ListingType)
    typesById.set(scope.category_id, types)
  }
  return ((categories ?? []) as Array<Category & { is_active: boolean }>).map((category) => ({
    ...category,
    listing_types: typesById.get(category.id) ?? [],
  }))
}

export async function getAdminActivityCategories(): Promise<AdminActivityCategory[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("activity_categories")
    .select("id, slug, name, sort_order, is_active")
    .order("sort_order", { ascending: true })
  if (error) throw new Error("No se pudieron cargar las categorías de agenda.")
  return (data ?? []) as AdminActivityCategory[]
}

export async function getAdminQuickLinks(): Promise<HomeQuickLink[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("home_quick_links")
    .select("id, slug, section, label, icon_key, target_kind, target_value, sort_order, is_active")
    .order("section", { ascending: true })
    .order("sort_order", { ascending: true })
  if (error) throw new Error("No se pudieron cargar los accesos rápidos.")
  return (data ?? []) as HomeQuickLink[]
}

export async function getPendingCommunitySubmissions(): Promise<AdminCommunitySubmission[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("community_submissions")
    .select("*, department_info:departments!community_submissions_department_id_fkey(name)")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
  if (error) throw new Error("No se pudieron cargar los aportes pendientes.")

  return Promise.all(
    ((data ?? []) as Array<CommunitySubmission & { department_info: { name: string } | null }>).map(async (submission) => {
      let photoUrl: string | null = null
      if (submission.photo_path) {
        const { data: signed } = await supabase.storage
          .from("community-submission-photos")
          .createSignedUrl(submission.photo_path, 10 * 60)
        photoUrl = signed?.signedUrl ?? null
      }
      const { department_info: departmentInfo, ...submissionData } = submission
      return {
        ...submissionData,
        department: departmentInfo?.name ?? "",
        converted_listing_id: (submission as CommunitySubmission & { converted_listing_id?: number }).converted_listing_id ?? null,
        photo_url: photoUrl,
      }
    })
  )
}

export async function getPendingCommunitySubmission(id: number): Promise<AdminCommunitySubmission | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("community_submissions")
    .select("*, department_info:departments!community_submissions_department_id_fkey(name)")
    .eq("id", id)
    .eq("status", "pending")
    .maybeSingle()
  if (error) throw new Error("No se pudo cargar el aporte.")
  if (!data) return null

  let photoUrl: string | null = null
  if (data.photo_path) {
    const { data: signed } = await supabase.storage
      .from("community-submission-photos")
      .createSignedUrl(data.photo_path, 10 * 60)
    photoUrl = signed?.signedUrl ?? null
  }
  const submission = data as unknown as CommunitySubmission & { department_info: { name: string } | null }
  const { department_info: departmentInfo, ...submissionData } = submission
  return {
    ...submissionData,
    department: departmentInfo?.name ?? "",
    converted_listing_id: (data as { converted_listing_id: number | null }).converted_listing_id,
    photo_url: photoUrl,
  }
}

export async function getHomeQuickLinks(section: HomeQuickLink["section"]): Promise<HomeQuickLink[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("home_quick_links")
    .select("id, slug, section, label, icon_key, target_kind, target_value, sort_order, is_active")
    .eq("section", section)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []) as HomeQuickLink[]
}

export function homeQuickLinkHref(link: Pick<HomeQuickLink, "target_kind" | "target_value">) {
  const params = new URLSearchParams()
  if (link.target_kind === "search") params.set("q", link.target_value)
  if (link.target_kind === "tag") params.set("tag", link.target_value)
  if (link.target_kind === "category") params.set("categoria", link.target_value)
  return `/explorar?${params.toString()}`
}
