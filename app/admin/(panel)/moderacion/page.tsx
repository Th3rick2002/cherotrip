import { CommunityReview } from "@/components/admin/community-review"
import { getPendingCommunitySubmissions } from "@/lib/admin/content"
import { requireAdmin } from "@/lib/admin/auth"

export const metadata = { title: "Moderación" }

export default async function CommunityModerationPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  await requireAdmin()
  const [{ saved, error }, submissions] = await Promise.all([searchParams, getPendingCommunitySubmissions()])
  return <CommunityReview submissions={submissions} saved={saved === "1"} error={error} />
}
