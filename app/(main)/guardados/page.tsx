import type { Metadata } from "next"
import { FavoriteListings } from "@/components/listings/favorite-listings"

export const metadata: Metadata = {
  title: "Mis Guardados",
  description: "Lugares y eventos que guardaste para tu próximo viaje.",
  robots: { index: false, follow: false },
}

export default function GuardadosPage() {
  return <FavoriteListings />
}
