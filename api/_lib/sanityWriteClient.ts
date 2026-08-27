import { createClient } from "@sanity/client"

const projectId = process.env.VITE_SANITY_PROJECT_ID
const dataset = process.env.VITE_SANITY_DATASET
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  throw new Error(
    "Missing VITE_SANITY_PROJECT_ID, VITE_SANITY_DATASET, or SANITY_WRITE_TOKEN — " +
      "set these in your local .env and in Vercel's Project Settings → Environment Variables.",
  )
}

export const sanityWriteClient = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
})
