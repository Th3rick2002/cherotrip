"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { SideDrawer } from "@/components/layout/side-drawer"
import { CommunityContributionDialog } from "@/components/community/community-contribution-dialog"
import { isNavActive, MAIN_NAV } from "@/lib/nav"

export function TopBar() {
  const [open, setOpen] = useState(false)
  const [contributionOpen, setContributionOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-card/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-3 px-4 sm:h-16 sm:px-6">
          {/* Móvil: hamburguesa */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Abrir menú"
            onClick={() => setOpen(true)}
            className="text-brand md:hidden"
          >
            <Menu className="size-5" />
          </Button>

          <Link
            href="/"
            className="font-heading text-lg font-bold tracking-tight text-brand sm:text-xl"
          >
            Cherotrip
          </Link>

          {/* Tablet / laptop: links en el header */}
          <nav
            aria-label="Principal"
            className="ml-auto hidden items-center gap-1 md:flex"
          >
            {MAIN_NAV.map((item) => {
              const active = isNavActive(pathname, item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-muted text-brand"
                      : "text-foreground/80 hover:bg-muted/70 hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Drawer solo relevante en móvil */}
      <div className="md:hidden">
        <SideDrawer
          open={open}
          onOpenChange={setOpen}
          onContribute={() => setContributionOpen(true)}
        />
      </div>
      <CommunityContributionDialog
        open={contributionOpen}
        onOpenChange={setContributionOpen}
      />
    </>
  )
}
