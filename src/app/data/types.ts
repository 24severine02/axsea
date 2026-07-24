export interface VideoItem {
  title: string
  views: string
  duration: string
  url: string
  // Derived from `url`, not read from the sheet — see src/app/lib/youtube.ts.
  thumb: string
}

export interface CatchLogItem {
  id: string
  species: string
  location: string
  date: string
  weight: string
  photo: string
  story: string
}

export interface GearItem {
  category: string
  name: string
  type: string
  desc: string
  img: string
  link: string
}

export interface CourseItem {
  name: string
  price: string
  level: string
  emoji: string
  popular: boolean
  accentColor: string
  desc: string
  includes: string[]
}

export interface TestimonialItem {
  name: string
  location: string
  course: string
  stars: number
  text: string
}

export interface SpotItem {
  id: string
  name: string
  x: number
  y: number
  species: string
  best: string
  note: string
}

export interface MerchItem {
  name: string
  price: string
  img: string
  link: string
}

export interface SponsorItem {
  name: string
}

export interface TimelineItem {
  year: string
  event: string
}

export interface SiteContent {
  videos: VideoItem[]
  catchLog: CatchLogItem[]
  gear: GearItem[]
  courses: CourseItem[]
  testimonials: TestimonialItem[]
  spots: SpotItem[]
  merch: MerchItem[]
  sponsors: SponsorItem[]
  timeline: TimelineItem[]
  config: Record<string, string>
}

// Shape of the JSON returned by /api/content — every field is still a raw
// string because it comes straight out of Google Sheets cells.
export interface RawSiteContent {
  videos: Record<string, string>[]
  catchLog: Record<string, string>[]
  gear: Record<string, string>[]
  courses: Record<string, string>[]
  testimonials: Record<string, string>[]
  spots: Record<string, string>[]
  merch: Record<string, string>[]
  sponsors: Record<string, string>[]
  timeline: Record<string, string>[]
  config: Record<string, string>
}
