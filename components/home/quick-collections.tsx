import Link from "next/link"
import { Backpack, Bus, CalendarDays, MapPin, Mountain, Ship, Tent, Utensils, Users, Waves } from "lucide-react"
import { getHomeQuickLinks, homeQuickLinkHref } from "@/lib/content/home"

const ICONS = { backpack: Backpack, users: Users, mountain: Mountain, bus: Bus, ship: Ship, tent: Tent, "map-pin": MapPin, "calendar-days": CalendarDays, utensils: Utensils, waves: Waves }

export async function QuickCollections() {
  const links = await getHomeQuickLinks("collection")
  if (links.length === 0) return null
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        Colecciones rápidas
      </h2>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {links.map((item) => {
          const Icon = ICONS[item.icon_key as keyof typeof ICONS] ?? MapPin
          return (
            <Link
              key={item.slug}
              href={homeQuickLinkHref(item)}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground shadow-sm transition hover:border-primary/40 hover:bg-muted"
            >
              <Icon className="size-4 text-primary" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
