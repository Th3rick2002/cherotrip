import { getSiteUrl } from "@/lib/site"

/** URL absoluta para OG / share (paths locales `/covers/...`). */
export function absoluteMediaUrl(
  pathOrUrl: string | null | undefined
): string | undefined {
  if (!pathOrUrl) return undefined
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl
  }

  const base = getSiteUrl()
  return `${base}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`
}
