/** URL absoluta para OG / share (paths locales `/covers/...`). */
export function absoluteMediaUrl(
  pathOrUrl: string | null | undefined
): string | undefined {
  if (!pathOrUrl) return undefined
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "")
  const vercel = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : null
  const base = site || vercel || "http://localhost:3000"

  return `${base}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`
}
