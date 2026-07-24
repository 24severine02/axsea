// Vercel Serverless Function — fetches the Axsea content Google Sheet and
// returns it as JSON, shaped for src/app/hooks/useSiteContent.ts.
//
// Requires env vars GOOGLE_SHEET_ID and GOOGLE_SHEETS_API_KEY (see README).
// Response is cached at the edge for 60s (stale-while-revalidate 300s) so a
// sheet edit shows up on the site within about a minute, without hammering
// the Sheets API.

const SHEET_TABS = {
  videos: "Videos",
  catchLog: "CatchLog",
  gear: "Gear",
  courses: "Courses",
  testimonials: "Testimonials",
  spots: "Spots",
  merch: "Merch",
  sponsors: "Sponsors",
  timeline: "Timeline",
  config: "Config",
}

function rowsToObjects(values) {
  if (!values || values.length === 0) return []
  const [header, ...rows] = values
  const keys = header.map((h) => (h ?? "").toString().trim())
  return rows
    .filter((row) => row.some((cell) => cell !== undefined && cell !== ""))
    .map((row) => Object.fromEntries(keys.map((key, i) => [key, (row[i] ?? "").toString().trim()])))
}

function configToObject(values) {
  const obj = {}
  for (const row of rowsToObjects(values)) {
    if (row.key) obj[row.key] = row.value ?? ""
  }
  return obj
}

// Tabs are fetched one at a time (rather than a single values:batchGet) on
// purpose: batchGet is all-or-nothing, so a single tab the site owner
// hasn't created yet would 400 the entire response. Fetching independently
// means a missing/renamed tab just comes back empty and that section falls
// back to defaults, instead of taking down every section.
async function fetchTab(sheetId, apiKey, tabName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(tabName)}?key=${apiKey}`
  const res = await fetch(url)
  if (!res.ok) return []
  const data = await res.json()
  return data.values ?? []
}

export default async function handler(req, res) {
  const sheetId = process.env.GOOGLE_SHEET_ID
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY

  if (!sheetId || !apiKey) {
    res.status(500).json({
      error: "Missing GOOGLE_SHEET_ID or GOOGLE_SHEETS_API_KEY environment variable.",
    })
    return
  }

  try {
    const entries = await Promise.all(
      Object.entries(SHEET_TABS).map(async ([key, tabName]) => {
        const values = await fetchTab(sheetId, apiKey, tabName)
        return [key, key === "config" ? configToObject(values) : rowsToObjects(values)]
      })
    )

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300")
    res.status(200).json(Object.fromEntries(entries))
  } catch (err) {
    res.status(502).json({ error: "Failed to fetch Google Sheet data", detail: String(err) })
  }
}
