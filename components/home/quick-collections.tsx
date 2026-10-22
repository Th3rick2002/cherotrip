import Link from "next/link"
import { QUICK_COLLECTIONS } from "@/lib/content/home"

export function QuickCollections() {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        Colecciones rápidas
      </h2>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {QUICK_COLLECTIONS.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.slug}
              href={item.href}
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
