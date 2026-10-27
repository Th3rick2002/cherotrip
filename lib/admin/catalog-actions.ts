"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { getAdmin } from "@/lib/admin/auth"
import { createClient } from "@/lib/supabase/server"

const listingTypeSchema = z.enum(["place", "event"])
const slugSchema = z.string().trim().toLowerCase().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

function refreshCatalogs() {
  revalidateTag("public-categories", "max")
  revalidateTag("public-listings", "max")
  revalidatePath("/")
  revalidatePath("/explorar")
  revalidatePath("/admin/categorias")
}

export async function saveDirectoryCategory(formData: FormData) {
  if (!(await getAdmin())) redirect("/admin/login")
  const categoryIdRaw = String(formData.get("category_id") ?? "")
  const categoryId = categoryIdRaw ? Number(categoryIdRaw) : null
  const name = String(formData.get("name") ?? "").trim()
  const slugInput = String(formData.get("slug") ?? "").trim()
  const slug = slugSchema.safeParse(slugInput || slugify(name))
  const parsed = z.object({ name: z.string().min(2).max(100), icon: z.string().max(60), sort_order: z.coerce.number().int().min(0).max(10000) }).safeParse({
    name,
    icon: String(formData.get("icon") ?? "").trim(),
    sort_order: String(formData.get("sort_order") ?? "0"),
  })
  const listingTypes = formData.getAll("listing_types").map((value) => listingTypeSchema.safeParse(String(value)))
  if (!slug.success || !parsed.success || listingTypes.length === 0 || listingTypes.some((value) => !value.success)) {
    redirect("/admin/categorias?error=category")
  }
  if (categoryIdRaw && (!Number.isSafeInteger(categoryId) || (categoryId ?? 0) < 1)) {
    redirect("/admin/categorias?error=category")
  }

  const supabase = await createClient()
  const { error } = await supabase.rpc("save_admin_category", {
    p_category_id: categoryId,
    p_slug: slug.data,
    p_name: parsed.data.name,
    p_icon: parsed.data.icon,
    p_sort_order: parsed.data.sort_order,
    p_is_active: formData.get("is_active") === "on",
    p_listing_types: listingTypes.map((item) => item.data),
  })
  if (error) redirect(`/admin/categorias?error=${error.code === "23505" ? "duplicate" : "category"}`)
  refreshCatalogs()
  redirect("/admin/categorias?saved=1")
}

export async function setDirectoryCategoryActive(formData: FormData) {
  if (!(await getAdmin())) redirect("/admin/login")
  const id = Number(formData.get("category_id"))
  const active = formData.get("is_active") === "true"
  if (!Number.isSafeInteger(id) || id < 1) redirect("/admin/categorias?error=category")
  const supabase = await createClient()
  const { error } = await supabase.from("categories").update({ is_active: !active }).eq("id", id)
  if (error) redirect("/admin/categorias?error=category")
  refreshCatalogs()
  redirect("/admin/categorias?saved=1")
}

export async function saveActivityCategory(formData: FormData) {
  if (!(await getAdmin())) redirect("/admin/login")
  const idRaw = String(formData.get("category_id") ?? "")
  const id = idRaw ? Number(idRaw) : null
  const name = String(formData.get("name") ?? "").trim()
  const slugInput = String(formData.get("slug") ?? "").trim()
  const slug = slugSchema.safeParse(slugInput || slugify(name))
  const parsed = z.object({ name: z.string().min(2).max(100), sort_order: z.coerce.number().int().min(0).max(10000) }).safeParse({
    name,
    sort_order: String(formData.get("sort_order") ?? "0"),
  })
  if (!slug.success || !parsed.success || (idRaw && (!Number.isSafeInteger(id) || (id ?? 0) < 1))) {
    redirect("/admin/categorias?error=activity")
  }
  const supabase = await createClient()
  const payload = { slug: slug.data, name: parsed.data.name, sort_order: parsed.data.sort_order, is_active: formData.get("is_active") === "on" }
  const result = id
    ? await supabase.from("activity_categories").update(payload).eq("id", id)
    : await supabase.from("activity_categories").insert(payload)
  if (result.error) redirect(`/admin/categorias?error=${result.error.code === "23505" ? "duplicate" : "activity"}`)
  revalidatePath("/admin/categorias")
  revalidateTag("public-listings", "max")
  redirect("/admin/categorias?saved=1")
}

export async function setActivityCategoryActive(formData: FormData) {
  if (!(await getAdmin())) redirect("/admin/login")
  const id = Number(formData.get("category_id"))
  const active = formData.get("is_active") === "true"
  if (!Number.isSafeInteger(id) || id < 1) redirect("/admin/categorias?error=activity")
  const supabase = await createClient()
  const { error } = await supabase.from("activity_categories").update({ is_active: !active }).eq("id", id)
  if (error) redirect("/admin/categorias?error=activity")
  revalidatePath("/admin/categorias")
  revalidateTag("public-listings", "max")
  redirect("/admin/categorias?saved=1")
}

const homeLinkSchema = z.object({
  slug: slugSchema,
  section: z.enum(["collection", "service"]),
  label: z.string().trim().min(2).max(100),
  icon_key: z.enum(["backpack", "users", "mountain", "bus", "ship", "tent", "map-pin", "calendar-days", "utensils", "waves"]),
  target_kind: z.enum(["search", "tag", "category"]),
  target_value: z.string().trim().min(1).max(180),
  sort_order: z.coerce.number().int().min(0).max(10000),
})

export async function saveHomeQuickLink(formData: FormData) {
  if (!(await getAdmin())) redirect("/admin/login")
  const idRaw = String(formData.get("link_id") ?? "")
  const id = idRaw ? Number(idRaw) : null
  const parsed = homeLinkSchema.safeParse({
    slug: String(formData.get("slug") ?? "").trim(),
    section: String(formData.get("section") ?? ""),
    label: String(formData.get("label") ?? "").trim(),
    icon_key: String(formData.get("icon_key") ?? ""),
    target_kind: String(formData.get("target_kind") ?? ""),
    target_value: String(formData.get("target_value") ?? "").trim(),
    sort_order: String(formData.get("sort_order") ?? "0"),
  })
  if (!parsed.success || (idRaw && (!Number.isSafeInteger(id) || (id ?? 0) < 1))) {
    redirect("/admin/contenido?error=link")
  }
  const supabase = await createClient()
  const payload = { ...parsed.data, is_active: formData.get("is_active") === "on" }
  const result = id
    ? await supabase.from("home_quick_links").update(payload).eq("id", id)
    : await supabase.from("home_quick_links").insert(payload)
  if (result.error) redirect(`/admin/contenido?error=${result.error.code === "23505" ? "duplicate" : "link"}`)
  revalidateTag("home-content", "max")
  revalidatePath("/")
  revalidatePath("/admin/contenido")
  redirect("/admin/contenido?saved=1")
}

export async function setHomeQuickLinkActive(formData: FormData) {
  if (!(await getAdmin())) redirect("/admin/login")
  const id = Number(formData.get("link_id"))
  const active = formData.get("is_active") === "true"
  if (!Number.isSafeInteger(id) || id < 1) redirect("/admin/contenido?error=link")
  const supabase = await createClient()
  const { error } = await supabase.from("home_quick_links").update({ is_active: !active }).eq("id", id)
  if (error) redirect("/admin/contenido?error=link")
  revalidateTag("home-content", "max")
  revalidatePath("/")
  revalidatePath("/admin/contenido")
  redirect("/admin/contenido?saved=1")
}
