import Link from "next/link"
import { Backpack, Bus, CalendarDays, MapPin, Mountain, Ship, Tent, Utensils, Users, Waves } from "lucide-react"
import { getHomeQuickLinks, homeQuickLinkHref } from "@/lib/content/home"

const ICONS = { backpack: Backpack, users: Users, mountain: Mountain, bus: Bus, ship: Ship, tent: Tent, "map-pin": MapPin, "calendar-days": CalendarDays, utensils: Utensils, waves: Waves }

export async function QuickServices() {
  const services = await getHomeQuickLinks("service")
  if (services.length === 0) return null
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-foreground">
        Servicios rápidos
      </h2>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {services.map((service) => {
          const Icon = ICONS[service.icon_key as keyof typeof ICONS] ?? MapPin
          return (
            <Link
              key={service.slug}
              href={homeQuickLinkHref(service)}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card px-2 py-4 text-center shadow-sm transition hover:border-primary/40 hover:bg-muted"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <span className="text-xs font-medium text-foreground sm:text-sm">
                {service.label}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
