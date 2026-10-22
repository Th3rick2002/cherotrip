export const MAIN_NAV = [
  { href: "/", label: "Inicio" },
  { href: "/explorar", label: "Explorar" },
  { href: "/sobre", label: "Sobre Cherotrip" },
  { href: "/contacto", label: "Contacto" },
] as const

export function isNavActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname.startsWith(href)
}
