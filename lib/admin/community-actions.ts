"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getAdmin } from "@/lib/admin/auth"
import { createClient } from "@/lib/supabase/server"

export async function rejectCommunitySubmission(formData: FormData) {
  if (!(await getAdmin())) redirect("/admin/login")
  const id = Number(formData.get("submission_id"))
  if (!Number.isSafeInteger(id) || id < 1) redirect("/admin/moderacion?error=invalid")
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("community_submissions")
    .update({ status: "rejected" })
    .eq("id", id)
    .eq("status", "pending")
    .select("id")
    .maybeSingle()
  if (error || !data) redirect("/admin/moderacion?error=save")
  revalidatePath("/admin/moderacion")
  redirect("/admin/moderacion?saved=1")
}
