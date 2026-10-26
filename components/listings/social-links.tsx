import type { Listing } from "@/lib/types/listing"
import { getSafeExternalUrl } from "@/lib/external-url"

type SocialNetwork = "instagram" | "facebook" | "tiktok"

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
  const links = socialNetworks.flatMap(({ network, label, field }) => {
    const href = getSafeExternalUrl(listing[field])
    return href ? [{ network, label, href }] : []
  })

  if (links.length === 0) return null

  return (
    <nav aria-label="Redes sociales oficiales" className="flex items-center gap-3">
      {links.map(({ network, label, href }) => (
        <a
          key={network}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label} oficial de ${listing.title}`}
          className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <SocialNetworkIcon network={network} />
        </a>
      ))}
    </nav>
  )
}

function SocialNetworkIcon({ network }: { network: SocialNetwork }) {
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
