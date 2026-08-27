import type { VercelRequest, VercelResponse } from "@vercel/node"
import { fetchLatestVideos } from "./_lib/youtube"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  try {
    const videos = await fetchLatestVideos(6)
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400")
    res.status(200).json(videos)
  } catch (err) {
    console.error("Failed to fetch latest videos:", err)
    res.status(502).json({ error: "Couldn't load the latest videos." })
  }
}
