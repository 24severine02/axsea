import { useEffect, useState } from "react"
import { DEFAULT_CONTENT } from "@/app/data/defaultContent"
import type { RawSiteContent, SiteContent } from "@/app/data/types"

function toBool(v: string | undefined) {
  return (v ?? "").trim().toUpperCase() === "TRUE"
}

function toNum(v: string | undefined, fallback: number) {
  const n = Number(v)
  return Number.isFinite(n) && v !== "" ? n : fallback
}

function normalize(raw: Partial<RawSiteContent>): SiteContent {
  return {
    videos: (raw.videos ?? []).map((r) => ({
      title: r.title ?? "",
      views: r.views ?? "",
      duration: r.duration ?? "",
      platform: r.platform ?? "",
      thumb: r.thumb ?? "",
      url: r.url || "#",
    })),
    catchLog: (raw.catchLog ?? []).map((r) => ({
      id: r.id ?? "",
      species: r.species ?? "",
      location: r.location ?? "",
      date: r.date ?? "",
      weight: r.weight ?? "",
      photo: r.photo ?? "",
      story: r.story ?? "",
    })),
    gear: (raw.gear ?? []).map((r) => ({
      category: r.category ?? "",
      name: r.name ?? "",
      type: r.type ?? "",
      desc: r.desc ?? "",
      img: r.img ?? "",
      link: r.link || "#",
    })),
    courses: (raw.courses ?? []).map((r) => ({
      name: r.name ?? "",
      price: r.price ?? "",
      level: r.level ?? "",
      emoji: r.emoji ?? "",
      popular: toBool(r.popular),
      accentColor: r.accentColor || "#5DDBD3",
      desc: r.desc ?? "",
      includes: (r.includes ?? "")
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean),
    })),
    testimonials: (raw.testimonials ?? []).map((r) => ({
      name: r.name ?? "",
      location: r.location ?? "",
      course: r.course ?? "",
      stars: toNum(r.stars, 5),
      text: r.text ?? "",
    })),
    spots: (raw.spots ?? []).map((r) => ({
      id: r.id ?? "",
      name: r.name ?? "",
      x: toNum(r.x, 50),
      y: toNum(r.y, 50),
      species: r.species ?? "",
      best: r.best ?? "",
      note: r.note ?? "",
    })),
    merch: (raw.merch ?? []).map((r) => ({
      name: r.name ?? "",
      price: r.price ?? "",
      img: r.img ?? "",
      link: r.link || "#",
    })),
    sponsors: (raw.sponsors ?? []).map((r) => ({ name: r.name ?? "" })),
    timeline: (raw.timeline ?? []).map((r) => ({ year: r.year ?? "", event: r.event ?? "" })),
    config: raw.config ?? {},
  }
}

// Sheet data replaces a section only once that section actually has rows —
// an empty/not-yet-filled-in tab keeps showing the bundled default content
// instead of rendering blank.
function mergeWithDefaults(normalized: SiteContent): SiteContent {
  return {
    videos: normalized.videos.length ? normalized.videos : DEFAULT_CONTENT.videos,
    catchLog: normalized.catchLog.length ? normalized.catchLog : DEFAULT_CONTENT.catchLog,
    gear: normalized.gear.length ? normalized.gear : DEFAULT_CONTENT.gear,
    courses: normalized.courses.length ? normalized.courses : DEFAULT_CONTENT.courses,
    testimonials: normalized.testimonials.length ? normalized.testimonials : DEFAULT_CONTENT.testimonials,
    spots: normalized.spots.length ? normalized.spots : DEFAULT_CONTENT.spots,
    merch: normalized.merch.length ? normalized.merch : DEFAULT_CONTENT.merch,
    sponsors: normalized.sponsors.length ? normalized.sponsors : DEFAULT_CONTENT.sponsors,
    timeline: normalized.timeline.length ? normalized.timeline : DEFAULT_CONTENT.timeline,
    config: { ...DEFAULT_CONTENT.config, ...normalized.config },
  }
}

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch("/api/content")
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}) as { error?: string })
          throw new Error(body.error ?? `Request failed with status ${res.status}`)
        }
        return res.json() as Promise<Partial<RawSiteContent>>
      })
      .then((raw) => {
        if (cancelled) return
        setContent(mergeWithDefaults(normalize(raw)))
      })
      .catch((err: unknown) => {
        if (cancelled) return
        // Keep showing DEFAULT_CONTENT — this just means the sheet isn't
        // configured yet (e.g. local `npm run dev` without `vercel dev`).
        setError(err instanceof Error ? err.message : "Failed to load site content")
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { content, error }
}
