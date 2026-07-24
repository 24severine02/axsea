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

export default async function handler(req, res) {
  const sheetId = process.env.GOOGLE_SHEET_ID
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY

  if (!sheetId || !apiKey) {
    res.status(500).json({
      error: "Missing GOOGLE_SHEET_ID or GOOGLE_SHEETS_API_KEY environment variable.",
    })
    return
  }

  const tabNames = Object.values(SHEET_TABS)
  const rangesQuery = tabNames.map((name) => `ranges=${encodeURIComponent(name)}`).join("&")
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:batchGet?${rangesQuery}&key=${apiKey}`

  try {
    const sheetRes = await fetch(url)
    if (!sheetRes.ok) {
      const detail = await sheetRes.text()
      res.status(502).json({ error: `Google Sheets API responded with ${sheetRes.status}`, detail })
      return
    }

    const data = await sheetRes.json()
    const valueRanges = data.valueRanges ?? []

    const result = {}
    Object.keys(SHEET_TABS).forEach((key, i) => {
      const values = valueRanges[i]?.values
      result[key] = key === "config" ? configToObject(values) : rowsToObjects(values)
    })

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300")
    res.status(200).json(result)
  } catch (err) {
    res.status(502).json({ error: "Failed to fetch Google Sheet data", detail: String(err) })
  }
}
