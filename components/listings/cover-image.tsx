import Image from "next/image"
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
 * Usa la portada guardada en el listing. Si no existe, conserva el fallback
 * local en `/public/covers/{slug}.jpg` (optimizado por next/image).
 */
export function CoverImage({
  src,
  slug,
  alt,
  sizes,
  className,
  priority = false,
}: CoverImageProps) {
  const resolved = resolveCoverSrc(src, slug)

  if (!resolved) {
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
      // Externas: sin optimizador (timeouts). Locales: next/image.
      unoptimized={!isLocal}
      className={cn("object-cover", className)}
    />
  )
}

export function resolveCoverSrc(
  src?: string | null,
  slug?: string
): string | null {
  if (src) return src
  if (slug) return `/covers/${slug}.jpg`
  return null
}
