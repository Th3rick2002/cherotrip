import { ListingTable } from "@/components/admin/listing-table"
import { getAdminListings } from "@/lib/admin/content"
import { requireAdmin } from "@/lib/admin/auth"

export const metadata = { title: "Eventos" }

export default async function AdminEventsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin()
  const [{ saved }, listings] = await Promise.all([searchParams, getAdminListings("event")])
  return <ListingTable type="event" listings={listings} saved={saved === "1"} />
}
