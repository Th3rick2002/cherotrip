"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SideDrawer } from "@/components/layout/side-drawer"
import { useState } from "react"

export function TopBar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-card/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-3 px-4 sm:px-6">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Abrir menú"
            onClick={() => setOpen(true)}
            className="text-brand"
          >
            <Menu className="size-5" />
          </Button>
          <Link
            href="/"
            className="font-heading text-lg font-bold tracking-tight text-brand sm:text-xl"
          >
            Cherotrip
          </Link>
        </div>
      </header>
      <SideDrawer open={open} onOpenChange={setOpen} />
    </>
  )
}
