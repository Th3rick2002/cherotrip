import type { LucideIcon } from "lucide-react"
import {
  Backpack,
  Bus,
  Mountain,
  Ship,
  Tent,
  Users,
} from "lucide-react"

export type QuickCollection = {
  slug: string
  label: string
  icon: LucideIcon
  href: string
}

export const QUICK_COLLECTIONS: QuickCollection[] = [
  {
    slug: "mochilero",
    label: "Mochilero",
    icon: Backpack,
    href: "/explorar?tag=Mochilero",
  },
  {
    slug: "familiar",
    label: "Familiar",
    icon: Users,
    href: "/explorar?tag=Familiar",
  },
  {
    slug: "aventura-4x4",
    label: "Aventura 4x4",
    icon: Mountain,
    href: "/explorar?q=4x4",
  },
]

export type QuickService = {
  slug: string
  label: string
  icon: LucideIcon
  href: string
}

export const QUICK_SERVICES: QuickService[] = [
  {
    slug: "buses",
    label: "Rutas de buses",
    icon: Bus,
    href: "/explorar?q=bus",
  },
  {
    slug: "lancheros",
    label: "Lancheros",
    icon: Ship,
    href: "/explorar?q=lancha",
  },
  {
    slug: "camping",
    label: "Zonas de camping",
    icon: Tent,
    href: "/explorar?tag=Camping",
  },
]
