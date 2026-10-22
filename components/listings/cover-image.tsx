"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "cn"

type CoverImageProps = {
  src?: string | null
  slug?: string
  alt: string
  sizes: string
  className?: string
  priority?: boolean
}

/**
 * Prefiere covers locales en `/public/covers/{slug}.jpg`
 * para evitar timeouts del optimizador con Unsplash.
 */
export function CoverImage({
  src,
  slug,
  alt,
  sizes,
  className,
  priority = false,
}: CoverImageProps) {
  const [failed, setFailed] = useState(false)
  const resolved = resolveCoverSrc(src, slug)

  if (!resolved || failed) {
    return (
      <div
        className={cn(
          "bg-gradient-to-br from-primary/25 via-brand/20 to-sand/30",
          className
        )}
        aria-hidden
      />
    )
  }

  const isLocal = resolved.startsWith("/")

  return (
    <Image
      src={resolved}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={!isLocal}
      className={cn("object-cover", className)}
      onError={() => setFailed(true)}
    />
  )
}

export function resolveCoverSrc(
  src?: string | null,
  slug?: string
): string | null {
  if (slug) return `/covers/${slug}.jpg`
  if (!src) return null
  if (src.startsWith("/")) return src
  return src
}
