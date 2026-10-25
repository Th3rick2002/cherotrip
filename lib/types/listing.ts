export type ListingType = "event" | "place"
export type CommunitySubmissionStatus = "pending" | "approved" | "rejected"

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
  instagram_url: string | null
  facebook_url: string | null
  tiktok_url: string | null
  ticket_url: string | null
  ticket_provider: string | null
  accommodation_url: string | null
  accommodation_search_query: string | null
  verified: boolean
  featured: boolean
  published_at: string | null
  categories?: Category[]
}

export type ActivityCategory = {
  id: number
  slug: string
  name: string
  sort_order: number
  is_active: boolean
}

export type SubEvent = {
  id: number
  listing_id: number
  event_date: string
  start_time: string
  end_time: string | null
  title: string
  description: string | null
  venue: string | null
  activity_category_id: number
  sort_order: number
  activity_category?: ActivityCategory
}

export type CommunitySubmission = {
  id: number
  place_name: string
  department: string
  comment: string
  photo_path: string | null
  contact_optional: string | null
  status: CommunitySubmissionStatus
  created_at: string
}

export const DEPARTMENTS = [
  "San Miguel",
  "Morazán",
  "Usulután",
  "La Unión",
] as const

export type Department = (typeof DEPARTMENTS)[number]
