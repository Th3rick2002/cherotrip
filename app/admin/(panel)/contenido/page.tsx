import { HomeContentManager } from "@/components/admin/home-content-manager"
import { getAdminQuickLinks } from "@/lib/admin/content"
import { requireAdmin } from "@/lib/admin/auth"

export const metadata = { title: "Contenido del Home" }

export default async function HomeContentPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  await requireAdmin()
  const [{ saved, error }, links] = await Promise.all([searchParams, getAdminQuickLinks()])
  return <HomeContentManager links={links} saved={saved === "1"} error={error} />
}
