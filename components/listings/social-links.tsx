import type { Listing } from "@/lib/types/listing"
import { getSafeExternalUrl } from "@/lib/external-url"
import { buildWhatsAppUrl, normalizeWhatsAppPhone } from "@/lib/whatsapp"

type SocialNetwork = "instagram" | "facebook" | "tiktok" | "whatsapp"

const socialNetworks: {
  network: SocialNetwork
  label: string
  field: "instagram_url" | "facebook_url" | "tiktok_url"
}[] = [
  { network: "instagram", label: "Instagram", field: "instagram_url" },
  { network: "facebook", label: "Facebook", field: "facebook_url" },
  { network: "tiktok", label: "TikTok", field: "tiktok_url" },
]

export function SocialLinks({ listing }: { listing: Listing }) {
  const socialLinks = socialNetworks.flatMap(({ network, label, field }) => {
    const href = getSafeExternalUrl(listing[field])
    return href ? [{ network, label, href }] : []
  })
  const whatsappHref = normalizeWhatsAppPhone(listing.whatsapp_phone)
    ? buildWhatsAppUrl({
        phone: listing.whatsapp_phone,
        title: listing.title,
        type: listing.type,
        slug: listing.slug,
      })
    : null
  const links = [
    ...socialLinks,
    ...(whatsappHref
      ? [{ network: "whatsapp" as const, label: "WhatsApp", href: whatsappHref }]
      : []),
  ]

  if (links.length === 0) return null

  return (
    <nav aria-label="Redes sociales" className="flex items-center gap-3">
      {links.map(({ network, label, href }) => (
        <a
          key={network}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={
            network === "whatsapp"
              ? `Contactar por WhatsApp: ${listing.title}`
              : `${label} oficial de ${listing.title}`
          }
          title={label}
          className={`flex size-10 items-center justify-center rounded-full border border-border bg-card transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${iconColorClasses(network)}`}
        >
          <SocialNetworkIcon network={network} />
        </a>
      ))}
    </nav>
  )
}

function iconColorClasses(network: SocialNetwork) {
  switch (network) {
    case "instagram":
      return "text-[#E1306C] hover:border-[#E1306C] hover:bg-[#E1306C]/5"
    case "facebook":
      return "text-[#1877F2] hover:border-[#1877F2] hover:bg-[#1877F2]/5"
    case "tiktok":
      return "text-[#111111] hover:border-[#111111] hover:bg-[#111111]/5"
    case "whatsapp":
      return "text-[#25D366] hover:border-[#25D366] hover:bg-[#25D366]/5"
  }
}

function SocialNetworkIcon({ network }: { network: SocialNetwork }) {
  if (network === "whatsapp") {
    return (
      <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="none">
        <path
          d="M20.5 3.5A11.8 11.8 0 0 0 12.1.1C5.6.1.3 5.4.3 11.9c0 2.1.5 4.1 1.6 5.9L.2 23.8l6.1-1.6a11.8 11.8 0 0 0 5.8 1.5h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.1-3.5-8.4Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M8.6 7.2c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.2 4.9 4.3 2.4.9 2.9.7 3.4.6.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.1-1.4-.1-.2-.3-.3-.7-.4l-2.1-1c-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.1-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6l-.9-2.1Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  if (network === "instagram") {
    return (
      <svg
        aria-hidden="true"
        className="size-5"
        fill="none"
        viewBox="0 0 24 24"
      >
        <rect
          x="3.25"
          y="3.25"
          width="17.5"
          height="17.5"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.65" cy="6.55" r="1.1" fill="currentColor" />
      </svg>
    )
  }

  if (network === "facebook") {
    return (
      <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M13.45 21v-8.2h2.76l.42-3.2h-3.18V7.56c0-.93.26-1.56 1.6-1.56h1.7V3.14c-.3-.04-1.34-.14-2.55-.14-2.53 0-4.26 1.54-4.26 4.37V9.6H7.08v3.2h2.86V21h3.51Z"
        />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M15.2 3h3.1c.2 1.8 1.2 3.2 2.7 3.8v3.1a8 8 0 0 1-2.7-.9v6.2a5.8 5.8 0 1 1-5.8-5.8c.4 0 .8 0 1.2.1v3.2a2.8 2.8 0 1 0 1.7 2.6V3Z"
      />
    </svg>
  )
}
