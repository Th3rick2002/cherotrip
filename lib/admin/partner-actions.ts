"use server"

import { revalidatePath, updateTag } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { getAdmin } from "@/lib/admin/auth"
import { createClient } from "@/lib/supabase/server"

const url = z.union([z.literal(""), z.string().url().refine((value) => /^https?:\/\//i.test(value))])
const partnerSchema = z.object({
  name: z.string().trim().min(2).max(160),
  description: z.string().trim().max(1000),
  category: z.enum(["food", "accommodation", "transport", "activities", "other"]),
  logo_url: url,
  website_url: url,
  whatsapp_phone: z.string().trim().max(40),
  instagram_url: url,
})

export async function createPartnerAction(formData: FormData) {
  if (!(await getAdmin())) redirect("/admin/login")
  const parsed = partnerSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) redirect("/admin/aliados?error=partner")
  const supabase = await createClient()
  const { error } = await supabase.from("partners").insert({
    ...parsed.data,
    logo_url: parsed.data.logo_url || null,
    website_url: parsed.data.website_url || null,
    whatsapp_phone: parsed.data.whatsapp_phone || null,
    instagram_url: parsed.data.instagram_url || null,
  })
  if (error) redirect("/admin/aliados?error=partner")
  revalidatePath("/admin/aliados")
  redirect("/admin/aliados?saved=partner")
}

export async function linkPartnerAction(formData: FormData) {
  if (!(await getAdmin())) redirect("/admin/login")
  const parsed = z.object({
    listing_id: z.coerce.number().int().positive(),
    partner_id: z.coerce.number().int().positive(),
    relationship_type: z.enum(["editorial", "paid_marketing", "sponsor"]),
    display_text: z.string().trim().max(500),
  }).safeParse(Object.fromEntries(formData))
  if (!parsed.success) redirect("/admin/aliados?error=association")
  const supabase = await createClient()
  const { error } = await supabase.from("listing_partners").upsert({
    ...parsed.data,
    is_active: true,
  }, { onConflict: "listing_id,partner_id" })
  if (error) redirect("/admin/aliados?error=association")
  updateTag("public-listings")
  revalidatePath("/admin/aliados")
  redirect("/admin/aliados?saved=association")
}
