/** Returns a safe absolute HTTP(S) URL for a link entered in the CMS. */
export function getSafeExternalUrl(value: string | null | undefined): string | null {
  const input = value?.trim()
  if (!input) return null

  const candidate = /^[a-z][a-z\d+.-]*:/i.test(input) ? input : `https://${input}`

  try {
    const url = new URL(candidate)
    if (
      (url.protocol !== "http:" && url.protocol !== "https:") ||
      !url.hostname ||
      url.username ||
      url.password
    ) {
      return null
    }

    return url.toString()
  } catch {
    return null
  }
}

/** Builds the Airbnb search route used by municipality search slugs. */
export function buildAirbnbSearchUrl(query: string): string | null {
  const location = query.trim()
  if (!location) return null

  return `https://www.airbnb.com/s/${encodeURIComponent(location)}/homes`
}
