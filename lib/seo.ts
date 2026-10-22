import type { Metadata } from "next"
import { absoluteMediaUrl } from "@/lib/media"
import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site"
import type { Listing } from "@/lib/types/listing"

export function listingMetadata(listing: Listing): Metadata {
  const description = listing.description.slice(0, 160)
  const path = `/${listing.type === "event" ? "evento" : "lugar"}/${listing.slug}`
  const url = `${getSiteUrl()}${path}`
  const image =
    absoluteMediaUrl(listing.cover_image_url ?? `/covers/${listing.slug}.jpg`) ??
    absoluteMediaUrl("/icons/icon-512.png")

  return {
    title: listing.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "es_SV",
      siteName: SITE_NAME,
      title: listing.title,
      description,
      url,
      images: image
        ? [{ url: image, width: 1200, height: 630, alt: listing.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: listing.title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

export function rootMetadata(): Metadata {
  const base = getSiteUrl()
  return {
    metadataBase: new URL(base),
    title: {
      default: `${SITE_NAME} · Oriente de El Salvador`,
      template: `%s · ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    keywords: [
      "El Salvador",
      "oriente",
      "turismo",
      "eventos",
      "Morazán",
      "Usulután",
      "La Unión",
      "San Miguel",
      "Cherotrip",
    ],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    alternates: { canonical: base },
    openGraph: {
      type: "website",
      locale: "es_SV",
      url: base,
      siteName: SITE_NAME,
      title: `${SITE_NAME} · Oriente de El Salvador`,
      description: SITE_DESCRIPTION,
      images: [
        {
          url: "/icons/icon-512.png",
          width: 512,
          height: 512,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      images: ["/icons/icon-512.png"],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: SITE_NAME,
    },
    formatDetection: {
      telephone: false,
    },
    icons: {
      icon: [
        { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
    },
  }
}
