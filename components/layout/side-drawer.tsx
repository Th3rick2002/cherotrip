"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { cn } from "cn"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/explorar", label: "Explorar" },
  { href: "/sobre", label: "Sobre Cherotrip" },
  { href: "/contacto", label: "Contacto / Soporte" },
] as const

type SideDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SideDrawer({ open, onOpenChange }: SideDrawerProps) {
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[min(100%,20rem)] gap-0 bg-card p-0 sm:max-w-sm"
      >
        <SheetHeader className="border-b border-border px-5 py-5 text-left">
          <SheetTitle className="text-xl font-bold text-brand">
            Cherotrip
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Info verificada · Oriente SV
          </SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col gap-1 p-3">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors",
                  active
                    ? "bg-muted text-brand"
                    : "text-foreground hover:bg-muted/70"
                )}
              >
                {item.label}
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
            )
          })}
        </nav>

        <p className="mt-auto px-5 py-4 text-xs text-muted-foreground">
          Menú MVP simplificado — sin perfil, guardados ni notificaciones.
        </p>
      </SheetContent>
    </Sheet>
  )
}
