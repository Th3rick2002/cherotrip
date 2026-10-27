import { ListingTable } from "@/components/admin/listing-table"
import { getAdminListings } from "@/lib/admin/content"
import { requireAdmin } from "@/lib/admin/auth"

export const metadata = { title: "Lugares" }

export default async function AdminPlacesPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin()
  const [{ saved }, listings] = await Promise.all([searchParams, getAdminListings("place")])
  return <ListingTable type="place" listings={listings} saved={saved === "1"} />
}
