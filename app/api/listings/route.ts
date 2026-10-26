import { getListingsByIds } from "@/lib/listings/queries"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const rawIds = url.searchParams.get("ids")?.split(",") ?? []
  if (rawIds.length > 100 || rawIds.some((value) => !/^\d+$/.test(value))) {
    return Response.json({ error: "Invalid listing IDs" }, { status: 400 })
  }

  const ids = [...new Set(rawIds.map(Number).filter(Number.isSafeInteger))]
  return Response.json(await getListingsByIds(ids), {
    headers: { "Cache-Control": "private, no-store" },
  })
}
