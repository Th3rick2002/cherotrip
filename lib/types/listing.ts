export type ListingType = "event" | "place"

export type Category = {
  id: number
  slug: string
  name: string
  icon: string | null
  sort_order: number
}

export type Listing = {
  id: number
  slug: string
  type: ListingType
  title: string
  description: string
  department: string
  meeting_point: string | null
  cover_image_url: string | null
  starts_at: string | null
  ends_at: string | null
  schedule_text: string | null
  price_from: number | null
  payment_methods: string[]
  transport_info: string | null
  accessibility_notes: string | null
  extras: Record<string, unknown>
  restrictions: string | null
  tags: string[]
  whatsapp_phone: string
  verified: boolean
  featured: boolean
  published_at: string | null
  categories?: Category[]
}

export const DEPARTMENTS = [
  "San Miguel",
  "Morazán",
  "Usulután",
  "La Unión",
] as const

export type Department = (typeof DEPARTMENTS)[number]
