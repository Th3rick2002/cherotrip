import type { MetadataRoute } from "next"
import { createPublicClient } from "@/lib/supabase/public"
import { getSiteUrl } from "@/lib/site"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    {
      url: `${base}/explorar`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/sobre`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${base}/contacto`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ]

  const supabase = createPublicClient()
  const { data } = await supabase
    .from("listings")
    .select("slug, type, updated_at, published_at")
    .eq("is_published", true)

  const listingRoutes: MetadataRoute.Sitemap = (data ?? []).map((row) => ({
    url: `${base}/${row.type === "event" ? "evento" : "lugar"}/${row.slug}`,
    lastModified: row.updated_at
      ? new Date(row.updated_at)
      : row.published_at
        ? new Date(row.published_at)
        : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...listingRoutes]
}
