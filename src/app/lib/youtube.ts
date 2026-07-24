const YOUTUBE_ID_PATTERN = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/

export function getYouTubeVideoId(url: string): string | null {
  const match = url.match(YOUTUBE_ID_PATTERN)
  return match ? match[1] : null
}

// hqdefault is used over maxresdefault because it's guaranteed to exist for
// every public video; maxresdefault 404s for older/lower-res uploads.
export function getYouTubeThumbnail(url: string): string {
  const id = getYouTubeVideoId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : ""
}
