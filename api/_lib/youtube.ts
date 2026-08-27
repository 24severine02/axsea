import { sanityWriteClient } from "./sanityWriteClient"

export type YouTubeVideo = {
  videoId: string
  title: string
  url: string
  thumbnail: string
  duration: string
  views: number
  publishedAt: string
}

const CHANNEL_URL_PATTERN = /\/channel\/(UC[\w-]{22})/

function isoDurationToLabel(iso: string): string {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso)
  if (!match) return "0:00"
  const hours = Number(match[1] ?? 0)
  const minutes = Number(match[2] ?? 0)
  const seconds = Number(match[3] ?? 0)
  const mm = hours > 0 ? String(minutes).padStart(2, "0") : String(minutes)
  const ss = String(seconds).padStart(2, "0")
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`
}

async function resolveUploadsPlaylistId(): Promise<string> {
  const youtubeLink = await sanityWriteClient.fetch<string | null>(
    `*[_type == "siteSettings"][0].socialLinks.youtube`,
  )
  const match = youtubeLink ? CHANNEL_URL_PATTERN.exec(youtubeLink) : null
  if (!match) {
    throw new Error(
      `siteSettings.socialLinks.youtube ("${youtubeLink}") isn't a /channel/UC.../ URL — can't derive the uploads playlist.`,
    )
  }
  const channelId = match[1]
  return `UU${channelId.slice(2)}`
}

export async function fetchLatestVideos(maxResults = 6): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) throw new Error("Missing YOUTUBE_API_KEY")

  const uploadsPlaylistId = await resolveUploadsPlaylistId()

  const playlistUrl = new URL("https://www.googleapis.com/youtube/v3/playlistItems")
  playlistUrl.searchParams.set("part", "snippet")
  playlistUrl.searchParams.set("playlistId", uploadsPlaylistId)
  playlistUrl.searchParams.set("maxResults", String(maxResults))
  playlistUrl.searchParams.set("key", apiKey)

  const playlistRes = await fetch(playlistUrl)
  if (!playlistRes.ok) {
    throw new Error(`YouTube playlistItems.list failed: ${playlistRes.status} ${await playlistRes.text()}`)
  }
  const playlistData = await playlistRes.json()

  const items: { videoId: string; title: string; thumbnail: string; publishedAt: string }[] = (
    playlistData.items ?? []
  ).map((item: any) => ({
    videoId: item.snippet.resourceId.videoId,
    title: item.snippet.title,
    thumbnail:
      item.snippet.thumbnails?.maxres?.url ??
      item.snippet.thumbnails?.high?.url ??
      item.snippet.thumbnails?.medium?.url ??
      item.snippet.thumbnails?.default?.url,
    publishedAt: item.snippet.publishedAt,
  }))

  if (items.length === 0) return []

  const videosUrl = new URL("https://www.googleapis.com/youtube/v3/videos")
  videosUrl.searchParams.set("part", "contentDetails,statistics")
  videosUrl.searchParams.set("id", items.map((i) => i.videoId).join(","))
  videosUrl.searchParams.set("key", apiKey)

  const videosRes = await fetch(videosUrl)
  if (!videosRes.ok) {
    throw new Error(`YouTube videos.list failed: ${videosRes.status} ${await videosRes.text()}`)
  }
  const videosData = await videosRes.json()

  const detailsById = new Map<string, { duration: string; viewCount: string }>(
    (videosData.items ?? []).map((v: any) => [
      v.id,
      { duration: v.contentDetails.duration, viewCount: v.statistics?.viewCount ?? "0" },
    ]),
  )

  return items.map((item) => {
    const details = detailsById.get(item.videoId)
    return {
      videoId: item.videoId,
      title: item.title,
      url: `https://www.youtube.com/watch?v=${item.videoId}`,
      thumbnail: item.thumbnail,
      duration: details ? isoDurationToLabel(details.duration) : "0:00",
      views: details ? Number(details.viewCount) : 0,
      publishedAt: item.publishedAt,
    }
  })
}
