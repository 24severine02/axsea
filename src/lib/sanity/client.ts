import { createClient } from "@sanity/client"
import { createImageUrlBuilder } from "@sanity/image-url"
import type { SanityImage } from "./types"

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET

if (!projectId || !dataset) {
  throw new Error(
    "Missing VITE_SANITY_PROJECT_ID or VITE_SANITY_DATASET — check your .env file (copy .env.example if it's missing).",
  )
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  // CDN-cached reads are fine here — this is public marketing content, not
  // anything that needs to reflect an edit within milliseconds.
  useCdn: true,
})

const builder = createImageUrlBuilder(sanityClient)

export function urlFor(source: SanityImage) {
  return builder.image(source)
}

/** Cropped, format-optimized URL for a Sanity image at a fixed display size. */
export function imageUrl(source: SanityImage, width: number, height: number) {
  return urlFor(source).width(width).height(height).fit("crop").auto("format").url()
}
