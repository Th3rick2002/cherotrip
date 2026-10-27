"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

export type SignInState = {
  error: string | null
  email: string
}

const signInSchema = z.object({
  email: z.email("Escribe un correo válido.").max(254),
  password: z.string().min(1, "Escribe tu contraseña.").max(512),
  next: z.string().max(512).optional(),
})

const GENERIC_ERROR = "Correo o contraseña incorrectos."

export async function signIn(
  _prev: SignInState,
  formData: FormData
): Promise<SignInState> {
  const parsed = signInSchema.safeParse({
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    next: formData.get("next") ? String(formData.get("next")) : undefined,
  })
  const email = String(formData.get("email") ?? "").trim()

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? GENERIC_ERROR, email }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })
  if (error) {
    return { error: GENERIC_ERROR, email }
  }

  const { data: isAdmin } = await supabase.rpc("is_admin")
  if (isAdmin !== true) {
    // Valid account without admin rights: drop the session so it is not left
    // behind in the browser.
    await supabase.auth.signOut()
    return { error: "Esta cuenta no tiene acceso al panel.", email }
  }

  redirect(safeAdminPath(parsed.data.next))
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/admin/login")
}

/** Solo permite volver a rutas internas de `/admin` para evitar open redirects. */
function safeAdminPath(next: string | undefined) {
  if (
    next &&
    next.startsWith("/admin/") &&
    !next.startsWith("//") &&
    !next.includes("\\") &&
    next !== "/admin/login"
  ) {
    return next
  }
  return "/admin/dashboard"
}
