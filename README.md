
  # Axsea Personal Brand Website

  This is a code bundle for Axsea Personal Brand Website. The original project is available at https://www.figma.com/design/Nm2ykSPKPo3ZU7sI4I8UxB/Axsea-Personal-Brand-Website.

  All site content — videos, catch log, gear/setups, courses, testimonials,
  fishing spots, merch, sponsors, bio timeline, and hero/about/social text —
  is pulled from a Google Sheet at runtime through a Vercel Serverless
  Function (`api/content.js`). There is no database and no traditional
  backend to run or maintain: editing the sheet is how you update the site.

  ## Running the code locally

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the Vite dev server for UI work. Without the
  Vercel CLI, `/api/content` isn't served locally, so the site falls back to
  the bundled default content (`src/app/data/defaultContent.ts`) — the site
  still looks complete, it just won't reflect your sheet.

  To test the real sheet integration locally, install the Vercel CLI and run
  `vercel dev` instead, with a `.env` file (see `.env.example`) populated
  with `GOOGLE_SHEET_ID` and `GOOGLE_SHEETS_API_KEY`.

  ## Setting up the Google Sheet

  1. Create a new Google Sheet and add one tab per section below, each with
     a header row exactly matching the column names listed (case-sensitive).
     One row = one item.

     | Tab            | Columns |
     |----------------|---------|
     | `Videos`       | `title`, `views`, `duration`, `platform`, `thumb`, `url` |
     | `CatchLog`     | `id`, `species`, `location`, `date`, `weight`, `photo`, `story` |
     | `Gear`         | `category`, `name`, `type`, `desc`, `img`, `link` |
     | `Courses`      | `name`, `price`, `level`, `emoji`, `popular`, `accentColor`, `desc`, `includes` |
     | `Testimonials` | `name`, `location`, `course`, `stars`, `text` |
     | `Spots`        | `id`, `name`, `x`, `y`, `species`, `best`, `note` |
     | `Merch`        | `name`, `price`, `img`, `link` |
     | `Sponsors`     | `name` |
     | `Timeline`     | `year`, `event` |
     | `Config`       | `key`, `value` (one row per setting, see below) |

     Notes on a few columns:
     - `img` / `photo` / `thumb` — a public image URL (Unsplash, a Google
       Drive "anyone with the link" direct image URL, your own CDN, etc.).
     - `popular` — `TRUE` or `FALSE` (only one course should be `TRUE`).
     - `includes` — pipe-separated, e.g. `6 HD video modules|Gear buying guide PDF`.
     - `x` / `y` — percentage position (0–100) of a map pin on the spots image.
     - `Config` keys used by the site: `heroKicker`, `heroTitleLine1`,
       `heroTitleLine2`, `heroSubtitle`, `heroImage`, `statYoutube`,
       `statInstagram`, `statTiktok`, `statYearsFishing`, `statStudents`,
       `statBiggestCatch`, `aboutName`, `aboutPhoto`, `aboutParagraph1`,
       `aboutParagraph2`, `personalBestValue`, `personalBestLabel`,
       `mapImage`, `socialInstagramUrl`, `socialYoutubeUrl`,
       `socialWhatsappUrl`, `socialTiktokUrl`, `footerBio`, `copyrightText`.
       Leave a tab or a `Config` key blank and the site quietly falls back
       to the built-in default for just that piece.

  2. Share the sheet: **Share → General access → Anyone with the link →
     Viewer**. (The content isn't sensitive, so a simple API-key read is
     used instead of a service account.)

  3. Copy the Sheet ID out of its URL:
     `https://docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`

  4. Get a Google Sheets API key: in the [Google Cloud
     Console](https://console.cloud.google.com/), create (or reuse) a
     project, enable the **Google Sheets API**, then create an **API key**
     under Credentials. Restrict the key to the Sheets API for safety.

  5. Set both values as environment variables — locally in `.env`, and on
     Vercel under Project Settings → Environment Variables:
     - `GOOGLE_SHEET_ID`
     - `GOOGLE_SHEETS_API_KEY`

  ## Deploying to Vercel

  1. Push this repo to GitHub (or your Git provider of choice) and import it
     in Vercel, or run `vercel` from the project root.
  2. Vercel auto-detects the Vite frontend (`npm run build`, output `dist/`)
     and deploys `api/content.js` as a Serverless Function automatically —
     no extra configuration needed.
  3. Add the two environment variables above in the Vercel dashboard, then
     redeploy.

  Sheet edits show up on the live site within about a minute (the function
  caches responses for 60 seconds), with no redeploy required.
  