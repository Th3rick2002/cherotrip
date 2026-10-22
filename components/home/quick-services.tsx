import Link from "next/link"
import { QUICK_SERVICES } from "@/lib/content/home"

export function QuickServices() {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-foreground">
        Servicios rápidos
      </h2>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {QUICK_SERVICES.map((service) => {
          const Icon = service.icon
          return (
            <Link
              key={service.slug}
              href={service.href}
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
