import { sanityClient } from "./client"
import type { SiteContent } from "./types"

// One combined query = one network round trip for the whole page, instead of
// a waterfall of section-by-section requests.
const SITE_CONTENT_QUERY = `{
  "siteSettings": *[_type == "siteSettings"][0]{
    logo, footerBio, copyrightLine, footerTagline, socialLinks
  },
  "hero": *[_type == "hero"][0]{
    eyebrow, headingLine1, headingLine2, subtext, backgroundImage, primaryButton, secondaryButton
  },
  "socialProof": *[_type == "socialProof"][0]{
    youtubeCount, instagramCount, tiktokCount, yearsFishing, studentsCount, biggestCatch
  },
  "aboutMe": *[_type == "aboutMe"][0]{
    photo, personalBestValue, personalBestLabel, headingLine1, headingLine2, bioParagraphs, timeline
  },
  "mapSection": *[_type == "mapSection"][0]{
    backgroundImage, hintText
  },
  "shopSettings": *[_type == "shopSettings"][0]{
    paymentQrCode, paymentAppName, paymentInstructions, orderHoldMinutes, deliveryFee
  },
  "catchLog": *[_type == "catchLogEntry"] | order(date desc){
    _id, species, location, date, weight, weightUnit, photo, story
  },
  "gear": *[_type == "gearItem"] | order(category asc, order asc){
    _id, category, name, type, description, image, shopLink, order
  },
  "courses": *[_type == "course"] | order(order asc){
    _id, name, tagline, price, skillLevel, emoji, popular, accentColor, details, order
  },
  "spots": *[_type == "fishingSpot"]{
    _id, name, x, y, species, bestSeason, note
  },
  "sponsors": *[_type == "sponsor"] | order(order asc){
    _id, name, logo, url, order
  },
  "products": *[_type == "product"]{
    _id, name, price, image, sizes, colors, stock, stockCount, featured
  }
}`

export function fetchSiteContent(): Promise<SiteContent> {
  return sanityClient.fetch(SITE_CONTENT_QUERY)
}
