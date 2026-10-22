import Link from "next/link"
import { cn } from "cn"
import { Mountain, UtensilsCrossed, Waves } from "lucide-react"

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  aventura: Mountain,
  playa: Waves,
  gastronomia: UtensilsCrossed,
  hiking: Mountain,
  waves: Waves,
  utensils: UtensilsCrossed,
}

type CategoryChipProps = {
  slug: string
  name: string
  icon?: string | null
  active?: boolean
  href: string
}

export function CategoryChip({
  slug,
  name,
  icon,
  active = false,
  href,
}: CategoryChipProps) {
  const Icon = ICONS[icon ?? ""] ?? ICONS[slug] ?? Mountain

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted"
      )}
    >
      <Icon className="size-3.5" />
      {name}
    </Link>
  )
}

type FilterChipProps = {
  label: string
  href: string
  active?: boolean
}

export function FilterChip({ label, href, active = false }: FilterChipProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted"
      )}
    >
      {label}
    </Link>
  )
}
