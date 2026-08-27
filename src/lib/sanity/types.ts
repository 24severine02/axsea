export type SanityImage = {
  asset?: { _ref: string; _type: "reference" }
  hotspot?: { x: number; y: number; height: number; width: number }
}

export type CtaButton = {
  label: string
  href: string
}

export type SiteSettings = {
  logo: SanityImage
  footerBio?: string
  copyrightLine?: string
  footerTagline?: string
  socialLinks?: {
    instagram?: string
    youtube?: string
    tiktok?: string
    whatsapp?: string
  }
}

export type Hero = {
  eyebrow?: string
  headingLine1: string
  headingLine2: string
  subtext?: string
  backgroundImage: SanityImage
  primaryButton?: CtaButton
  secondaryButton?: CtaButton
}

export type SocialProof = {
  youtubeCount?: string
  instagramCount?: string
  tiktokCount?: string
  yearsFishing?: string
  studentsCount?: string
  biggestCatch?: string
}

export type TimelineEntry = {
  year: string
  event: string
}

export type AboutMe = {
  photo: SanityImage
  personalBestValue?: string
  personalBestLabel?: string
  headingLine1?: string
  headingLine2?: string
  bioParagraphs?: string[]
  timeline?: TimelineEntry[]
}

export type MapSection = {
  backgroundImage: SanityImage
  hintText?: string
}

export type ShopSettings = {
  paymentQrCode: SanityImage
  paymentAppName?: string
  paymentInstructions?: string
  orderHoldMinutes?: number
  deliveryFee?: number
}

export type YouTubeVideo = {
  videoId: string
  title: string
  url: string
  thumbnail: string
  duration: string
  views: number
  publishedAt: string
}

export type CatchLogEntry = {
  _id: string
  species: string
  location: string
  date: string
  weight: number
  weightUnit: "lbs" | "kg"
  photo: SanityImage
  story?: string
}

export type GearItem = {
  _id: string
  category: string
  name: string
  type?: string
  description?: string
  image: SanityImage
  shopLink?: string
  order?: number
}

export type CourseDetail = {
  label: string
  value: string
}

export type Course = {
  _id: string
  name: string
  tagline?: string
  price: number
  skillLevel?: string
  emoji?: string
  popular?: boolean
  accentColor?: string
  details?: CourseDetail[]
  order?: number
}

export type FishingSpot = {
  _id: string
  name: string
  x: number
  y: number
  species?: string
  bestSeason?: string
  note?: string
}

export type Sponsor = {
  _id: string
  name: string
  logo?: SanityImage
  url?: string
  order?: number
}

export type ProductColor = {
  name: string
  hex: string
}

export type Product = {
  _id: string
  name: string
  price: number
  image: SanityImage
  sizes?: string[]
  colors?: ProductColor[]
  stock: "in-stock" | "low-stock" | "out-of-stock"
  stockCount?: number
  featured?: boolean
}

export type OrderStatus = "pending" | "confirmed" | "shipped"

export type OrderItem = {
  product?: { _ref: string }
  productName: string
  price: number
  quantity: number
  size?: string
  color?: string
}

export type Order = {
  _id: string
  orderRef: string
  items: OrderItem[]
  customerName?: string
  customerPhone?: string
  customerEmail?: string
  deliveryMethod: "pickup" | "delivery"
  deliveryAddress?: string
  subtotal: number
  deliveryFee: number
  total: number
  paymentReference?: string
  status: OrderStatus
}

export type OrderStatusResponse = {
  orderRef: string
  status: OrderStatus
  items: Pick<OrderItem, "productName" | "price" | "quantity" | "size" | "color">[]
  subtotal: number
  deliveryFee: number
  total: number
  deliveryMethod: "pickup" | "delivery"
  placedAt: string
}

export type CreateOrderRequestItem = {
  productId: string
  quantity: number
  size?: string
  color?: string
}

export type CreateOrderRequest = {
  items: CreateOrderRequestItem[]
  customerName: string
  customerPhone?: string
  customerEmail: string
  deliveryMethod: "pickup" | "delivery"
  deliveryAddress?: string
  paymentReference: string
}

export type CreateOrderResponse = {
  orderRef: string
  orderId: string
}

export type SiteContent = {
  siteSettings: SiteSettings | null
  hero: Hero | null
  socialProof: SocialProof | null
  aboutMe: AboutMe | null
  mapSection: MapSection | null
  shopSettings: ShopSettings | null
  catchLog: CatchLogEntry[]
  gear: GearItem[]
  courses: Course[]
  spots: FishingSpot[]
  sponsors: Sponsor[]
  products: Product[]
}
