import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const ADMIN_LOGIN_PATH = "/admin/login"
const ADMIN_HOME_PATH = "/admin/dashboard"

/**
 * Refresca la sesión de Supabase y protege `/admin/*`.
 *
 * Solo corre en rutas de admin (ver `matcher` en `proxy.ts`); el sitio público
 * sigue sin sesión. Estar autenticado no basta: además debe pasar
 * `public.is_admin()`. Las páginas y Server Actions vuelven a verificarlo con
 * `requireAdmin()`, porque este chequeo es solo la primera barrera.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and getClaims(): it refreshes
  // the session cookies that the rest of the request relies on.
  const { data } = await supabase.auth.getClaims()
  const isSignedIn = Boolean(data?.claims?.sub)

  const { pathname } = request.nextUrl
  const isLoginPage = pathname === ADMIN_LOGIN_PATH

  let isAdmin = false
  if (isSignedIn) {
    const { data: adminFlag } = await supabase.rpc("is_admin")
    isAdmin = adminFlag === true
  }

  if (isLoginPage) {
    return isAdmin ? redirectTo(request, supabaseResponse, ADMIN_HOME_PATH) : supabaseResponse
  }

  if (!isAdmin) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = ADMIN_LOGIN_PATH
    loginUrl.search = ""
    if (pathname !== "/admin" && pathname !== ADMIN_HOME_PATH) {
      loginUrl.searchParams.set("next", pathname)
    }
    return redirectTo(request, supabaseResponse, loginUrl)
  }

  if (pathname === "/admin") {
    return redirectTo(request, supabaseResponse, ADMIN_HOME_PATH)
  }

  return supabaseResponse
}

/** Redirige conservando las cookies de sesión que Supabase acaba de refrescar. */
function redirectTo(
  request: NextRequest,
  sessionResponse: NextResponse,
  destination: string | URL
) {
  const url =
    typeof destination === "string" ? new URL(destination, request.url) : destination
  const response = NextResponse.redirect(url)
  sessionResponse.cookies.getAll().forEach((cookie) => response.cookies.set(cookie))
  return response
}
