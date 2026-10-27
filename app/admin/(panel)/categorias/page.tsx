import { CategoryManager } from "@/components/admin/category-manager"
import { getAdminActivityCategories, getAdminCategories } from "@/lib/admin/content"
import { requireAdmin } from "@/lib/admin/auth"

export const metadata = { title: "Categorías" }

export default async function AdminCategoriesPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  await requireAdmin()
  const [{ saved, error }, categories, activityCategories] = await Promise.all([
    searchParams,
    getAdminCategories(),
    getAdminActivityCategories(),
  ])
  return <CategoryManager categories={categories} activityCategories={activityCategories} saved={saved === "1"} error={error} />
}
