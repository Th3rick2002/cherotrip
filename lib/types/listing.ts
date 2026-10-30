export type ListingType = "event" | "place"
export type CommunitySubmissionStatus = "pending" | "approved" | "rejected"

export type Category = {
  id: number
  slug: string
  name: string
  icon: string | null
  sort_order: number
}

export type Department = {
  id: number
  name: string
  slug: string
  is_active: boolean
  sort_order: number
}

export type Listing = {
  id: number
  slug: string
  type: ListingType
  title: string
  description: string
  department_id: number
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
  partners?: ListingPartner[]
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

export type HomeQuickLink = {
  id: number
  slug: string
  section: "collection" | "service"
  label: string
  icon_key: string
  target_kind: "search" | "tag" | "category"
  target_value: string
  sort_order: number
  is_active: boolean
}

export type CommunitySubmission = {
  id: number
  title: string
  listing_type: ListingType
  department_id: number
  department: string
  comment: string
  description: string | null
  meeting_point: string | null
  schedule_text: string | null
  price_from: number | null
  payment_methods: string[]
  transport_info: string | null
  accessibility_notes: string | null
  tags: string[]
  starts_at: string | null
  ends_at: string | null
  photo_path: string | null
  contact_optional: string | null
  status: CommunitySubmissionStatus
  created_at: string
}

export type ListingPartner = {
  id: number
  relationship_type: "editorial" | "paid_marketing" | "sponsor"
  display_text: string
  partner: {
    id: number
    name: string
    description: string
    category: "food" | "accommodation" | "transport" | "activities" | "other"
    logo_url: string | null
    website_url: string | null
    whatsapp_phone: string | null
    instagram_url: string | null
  }
}
