"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, MapPin, CalendarDays, Inbox, ImageIcon, Tags, PanelsTopLeft, Handshake } from "lucide-react"

const ADMIN_NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, ready: true },
  { href: "/admin/lugares", label: "Lugares", icon: MapPin, ready: true },
  { href: "/admin/eventos", label: "Eventos", icon: CalendarDays, ready: true },
  { href: "/admin/categorias", label: "Categorías", icon: Tags, ready: true },
  { href: "/admin/contenido", label: "Home", icon: PanelsTopLeft, ready: true },
  { href: "/admin/moderacion", label: "Moderación", icon: Inbox, ready: true },
  { href: "/admin/aliados", label: "Aliados", icon: Handshake, ready: true },
  { href: "/admin/portadas", label: "Portadas", icon: ImageIcon, ready: true },
] as const

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Panel" className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
      {ADMIN_NAV.map(({ href, label, icon: Icon, ready }) => {
        const itemClass =
          "flex min-h-10 shrink-0 items-center gap-2.5 rounded-lg px-3 text-sm font-medium"

        if (!ready) {
          return (
            <span
              key={href}
              aria-disabled="true"
              className={`${itemClass} cursor-not-allowed text-slate-500`}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
              <span className="ml-auto rounded bg-slate-800 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-400">
                Pronto
              </span>
            </span>
          )
        }

        const active = pathname === href || pathname.startsWith(`${href}/`)
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`${itemClass} transition ${
              active ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
            }`}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
