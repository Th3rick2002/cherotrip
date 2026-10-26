import { redirect } from "next/navigation"
import { connection } from "next/server"
import { createClient } from "@/lib/supabase/server"

export type AdminUser = {
  id: string
  email: string | null
}

/**
 * Devuelve el admin actual o `null`. Verifica la sesión con Supabase Auth y la
 * pertenencia a `public.admin_users` vía `public.is_admin()`.
 */
export async function getAdmin(): Promise<AdminUser | null> {
  // Supabase checks token expiry against the current time, which Cache
  // Components rejects during prerender. The session is per request anyway.
  await connection()
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims
  if (!claims?.sub) return null

  const { data: isAdmin, error } = await supabase.rpc("is_admin")
  if (error || isAdmin !== true) return null

  return {
    id: claims.sub,
    email: typeof claims.email === "string" ? claims.email : null,
  }
}

/**
 * Exige un admin en páginas y Server Actions de `/admin`. El proxy ya filtra
 * las rutas, pero layouts y páginas se renderizan en paralelo, así que cada
 * lectura o mutación debe verificarlo por su cuenta.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdmin()
  if (!admin) redirect("/admin/login")
  return admin
}
