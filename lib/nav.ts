export const MAIN_NAV = [
  { href: "/", label: "Inicio" },
  { href: "/explorar", label: "Explorar" },
  { href: "/guardados", label: "Mis Guardados" },
  { href: "/aportar", label: "Aporta a la comunidad" },
  { href: "/sobre", label: "Sobre Cherotrip" },
] as const

export function isNavActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname.startsWith(href)
}
