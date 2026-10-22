"use client"

import { Share2 } from "lucide-react"
import { useState } from "react"

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  async function onShare() {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // usuario canceló share
    }
  }

  return (
    <button
      type="button"
      onClick={onShare}
      className="inline-flex items-center gap-1.5 rounded-full bg-card/95 px-3 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur"
      aria-label="Compartir enlace"
    >
      <Share2 className="size-4" />
      {copied ? "Copiado" : "Compartir"}
    </button>
  )
}
