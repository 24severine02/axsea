// One-time migration: copies the placeholder content that used to be
// hardcoded in App.tsx into real Sanity documents, so the Studio (and the
// live site) start with something populated instead of blank. Safe to
// re-run — every document uses a fixed _id and createOrReplace.
//
// Run with:  node --env-file=.env scripts/seed.mjs

import { readFile } from "node:fs/promises"
import { Agent, setGlobalDispatcher } from "undici"
import { createClient } from "@sanity/client"

// This sandbox blackholes outbound IPv6 (connections hang until timeout
// instead of failing), which made fetch's dual-stack happy-eyeballs race
// unreliable. Forcing IPv4-only connections avoids racing a route that
// never resolves.
setGlobalDispatcher(new Agent({ connect: { family: 4 } }))

const projectId = process.env.VITE_SANITY_PROJECT_ID
const dataset = process.env.VITE_SANITY_DATASET
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error(
    "Missing VITE_SANITY_PROJECT_ID, VITE_SANITY_DATASET, or SANITY_WRITE_TOKEN.\n" +
      "Add SANITY_WRITE_TOKEN to your .env file (a write-permission token from manage.sanity.io) and try again.",
  )
  process.exit(1)
}

const client = createClient({ projectId, dataset, token, apiVersion: "2024-01-01", useCdn: false })

const imageCache = new Map()

async function fetchWithRetry(url, attempts = 4) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fetch(url, { signal: AbortSignal.timeout(20000) })
    } catch (err) {
      if (attempt === attempts) throw err
      const delay = attempt * 1500
      console.log(`  retrying ${url} (attempt ${attempt + 1}/${attempts}) after ${err.message}`)
      await new Promise((r) => setTimeout(r, delay))
    }
  }
}

async function imageFromUrl(url, filename) {
  if (imageCache.has(url)) return imageCache.get(url)
  const res = await fetchWithRetry(url)
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const asset = await client.assets.upload("image", buffer, { filename })
  const image = { _type: "image", asset: { _type: "reference", _ref: asset._id } }
  imageCache.set(url, image)
  console.log(`  uploaded ${filename}`)
  return image
}

async function imageFromFile(fileUrl, filename) {
  const buffer = await readFile(fileUrl)
  const asset = await client.assets.upload("image", buffer, { filename })
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } }
}

async function run() {
  console.log("Seeding Axsea content into Sanity...\n")

  // ---- Singletons ----

  const logo = await imageFromFile(
    new URL("../src/imports/channels4_profile.jpg", import.meta.url),
    "axsea-logo.jpg",
  )
  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    logo,
    footerBio:
      "Axel Béchard — fisherman, content creator, and firm believer that the best days end with salt in your hair and a cooler that barely closes.",
    copyrightLine: "© 2025 Axsea · Axel Béchard. All rights reserved.",
    footerTagline: "Built with salt, Wi-Fi, and too much coffee.",
  })
  console.log("✓ siteSettings (social links left empty — add Axel's real profile URLs in Studio)")

  const heroBg = await imageFromUrl(
    "https://images.unsplash.com/photo-1605750416507-734370f71920?w=1800&h=1100&fit=crop&auto=format",
    "hero-bg.jpg",
  )
  await client.createOrReplace({
    _id: "hero",
    _type: "hero",
    eyebrow: "Axel Béchard · Content Creator · Fisherman",
    headingLine1: "Chasing Fish,",
    headingLine2: "Sharing the Ride.",
    subtext:
      "From Gulf of Mexico tuna to Everglades snook — we go where the bite is hot and bring you along for every single cast.",
    backgroundImage: heroBg,
    primaryButton: { label: "Watch My Latest Catch", href: "#videos" },
    secondaryButton: { label: "Explore Courses", href: "#courses" },
  })
  console.log("✓ hero")

  await client.createOrReplace({
    _id: "socialProof",
    _type: "socialProof",
    youtubeCount: "248K",
    instagramCount: "183K",
    tiktokCount: "512K",
    yearsFishing: "14+",
    studentsCount: "3,200+",
    biggestCatch: "248 lbs",
  })
  console.log("✓ socialProof")

  const aboutPhoto = await imageFromUrl(
    "https://images.unsplash.com/photo-1582658085438-790f8837944b?w=800&h=1000&fit=crop&auto=format",
    "about-axel.jpg",
  )
  await client.createOrReplace({
    _id: "aboutMe",
    _type: "aboutMe",
    photo: aboutPhoto,
    personalBestValue: "248 lbs",
    personalBestLabel: "Personal Best Bluefin",
    headingLine1: "Hey, I'm Axel.",
    headingLine2: "I Fish. I Film. I Teach.",
    bioParagraphs: [
      "Grew up on the coast of Nova Scotia, where my dad handed me a rod before I could read. Fishing wasn't a hobby — it was Sunday mornings, salt in the air, and the only time everything made sense.",
      "I started filming my catches because my friends didn't believe me. Turns out a lot of strangers didn't either — until they watched the videos. Now I help thousands of people find the same thing I found on that first boat: total, embarrassing, unhinged obsession with fishing.",
    ],
    timeline: [
      { year: "2010", event: "First fishing rod at age 12 — immediately, embarrassingly obsessed." },
      { year: "2015", event: "First offshore trip. Caught a mahi. Life changed forever." },
      { year: "2018", event: "Started posting catch videos. 200 subscribers in year one." },
      { year: "2020", event: "Hit 10K on YouTube. Bought the Boston Whaler. No regrets." },
      { year: "2022", event: "Launched first fishing course — 400 students in 30 days." },
      { year: "2025", event: "943K total followers. Still chasing that 300lb tuna." },
    ].map((t, i) => ({ _key: `timeline-${i}`, ...t })),
  })
  console.log("✓ aboutMe")

  const mapBg = await imageFromUrl(
    "https://images.unsplash.com/photo-1495171081156-cc1209ddf6a0?w=1400&h=800&fit=crop&auto=format",
    "map-bg.jpg",
  )
  await client.createOrReplace({
    _id: "mapSection",
    _type: "mapSection",
    backgroundImage: mapBg,
    hintText: "Tap a pin for the inside scoop.",
  })
  console.log("✓ mapSection")

  await client.createOrReplace({
    _id: "shopSettings",
    _type: "shopSettings",
    paymentAppName: "MCB Juice",
    paymentInstructions: "Open MCB Juice → Scan to Pay → point at QR above.",
    orderHoldMinutes: 15,
    deliveryFee: 150,
  })
  console.log("✓ shopSettings (no QR image yet — upload the real MCB Juice QR in Studio)")

  // ---- Catch log ----

  const catchData = [
    {
      id: "catch-1",
      species: "Bluefin Tuna",
      location: "Gulf of Mexico",
      date: "2025-06-12",
      weight: 187,
      photo: "https://images.unsplash.com/photo-1566177229701-8895c29b9c68?w=600&h=400&fit=crop&auto=format",
      story: "Three hours into the fight, this beast changed directions twice. Biggest blue I've ever put on the deck.",
    },
    {
      id: "catch-2",
      species: "Mahi-Mahi",
      location: "Bahamas",
      date: "2025-05-03",
      weight: 34,
      photo: "https://images.unsplash.com/photo-1515631604561-23e0be68ee06?w=600&h=400&fit=crop&auto=format",
      story: "Lit up like a neon sign when it hit the surface. Colour on this one was absolutely insane.",
    },
    {
      id: "catch-3",
      species: "Striped Bass",
      location: "Cape Cod, MA",
      date: "2025-04-18",
      weight: 48,
      photo: "https://images.unsplash.com/photo-1707314175601-0b614b1224a8?w=600&h=400&fit=crop&auto=format",
      story: "First bass of the season and she didn't disappoint. Popper bite at dawn, no better way to start the year.",
    },
    {
      id: "catch-4",
      species: "Wahoo",
      location: "Florida Keys",
      date: "2025-03-07",
      weight: 61,
      photo: "https://images.unsplash.com/photo-1601226041388-8bbabdd6e37e?w=600&h=400&fit=crop&auto=format",
      story: "Trolling spreader bars 35 miles out. This rocket hit the flat line at 40 knots then came back for more.",
    },
    {
      id: "catch-5",
      species: "Snook",
      location: "Everglades, FL",
      date: "2025-02-21",
      weight: 27,
      photo: "https://images.unsplash.com/photo-1562053923-52d3ebb09d31?w=600&h=400&fit=crop&auto=format",
      story: "Full moon low tide, mangrove edge. Swimbait. Gnarliest snook I've tangled with in the backcountry.",
    },
    {
      id: "catch-6",
      species: "Mahi-Mahi",
      location: "Atlantic, NC",
      date: "2025-01-14",
      weight: 29,
      photo: "https://images.unsplash.com/photo-1625183656263-171183307b15?w=600&h=400&fit=crop&auto=format",
      story: "Weedline was on fire. Caught 8 in a morning — this bull was the pick of the bunch.",
    },
  ]
  for (const c of catchData) {
    const photo = await imageFromUrl(c.photo, `${c.id}.jpg`)
    await client.createOrReplace({
      _id: c.id,
      _type: "catchLogEntry",
      species: c.species,
      location: c.location,
      date: c.date,
      weight: c.weight,
      weightUnit: "lbs",
      photo,
      story: c.story,
    })
  }
  console.log(`✓ ${catchData.length} catch log entries`)

  // ---- Gear ----

  const gearData = [
    {
      id: "gear-1",
      category: "Offshore Heavy",
      name: "Shimano Stella 20000",
      type: "Reel",
      description: "Beast mode for tuna and marlin. This reel eats 200lb braid for breakfast.",
      image: "https://images.unsplash.com/photo-1537872384762-e785271d14f8?w=400&h=300&fit=crop&auto=format",
      order: 1,
    },
    {
      id: "gear-2",
      category: "Offshore Heavy",
      name: "Penn Carnage III 80–130lb",
      type: "Rod",
      description: "Full-length blank wrap. Built to subdue tuna, not tickle them.",
      image: "https://images.unsplash.com/photo-1551131618-3f0a5cf594b4?w=400&h=300&fit=crop&auto=format",
      order: 2,
    },
    {
      id: "gear-3",
      category: "Offshore Heavy",
      name: "Boston Whaler 270 Dauntless",
      type: "Boat",
      description: "Unsinkable hull, twin Yamaha 200s. My office from March through November.",
      image: "https://images.unsplash.com/photo-1625183656263-171183307b15?w=400&h=300&fit=crop&auto=format",
      order: 3,
    },
    {
      id: "gear-4",
      category: "Offshore Heavy",
      name: "Williamson Speed Pro Lures",
      type: "Tackle",
      description: "High-speed trolling lures that trigger tuna when nothing else will.",
      image: "https://images.unsplash.com/photo-1541742425281-c1d3fc8aff96?w=400&h=300&fit=crop&auto=format",
      order: 4,
    },
    {
      id: "gear-5",
      category: "Inshore Finesse",
      name: "Daiwa Tatula SV TW",
      type: "Reel",
      description: "Buttery smooth for targeting snook and redfish on light braid.",
      image: "https://images.unsplash.com/photo-1505850557988-b858c0aec076?w=400&h=300&fit=crop&auto=format",
      order: 1,
    },
    {
      id: "gear-6",
      category: "Inshore Finesse",
      name: "St. Croix Mojo Inshore",
      type: "Rod",
      description: "Sensitive enough to feel the tick, stiff enough to set the hook hard.",
      image: "https://images.unsplash.com/photo-1529230117010-b6c436154f25?w=400&h=300&fit=crop&auto=format",
      order: 2,
    },
    {
      id: "gear-7",
      category: "Inshore Finesse",
      name: "Rapala X-Rap Saltwater",
      type: "Lure",
      description: "Walks the dog perfectly over grass flats. My go-to for snook on the prowl.",
      image: "https://images.unsplash.com/photo-1595886565824-b4f5c5a9c2d5?w=400&h=300&fit=crop&auto=format",
      order: 3,
    },
    {
      id: "gear-8",
      category: "Inshore Finesse",
      name: "Power Pro Spectra 30lb",
      type: "Line",
      description: "Zero stretch, incredible sensitivity. The backbone of every inshore setup.",
      image: "https://images.unsplash.com/photo-1552340745-89c5073640ad?w=400&h=300&fit=crop&auto=format",
      order: 4,
    },
  ]
  for (const g of gearData) {
    const image = await imageFromUrl(g.image, `${g.id}.jpg`)
    await client.createOrReplace({
      _id: g.id,
      _type: "gearItem",
      category: g.category,
      name: g.name,
      type: g.type,
      description: g.description,
      image,
      order: g.order,
    })
  }
  console.log(`✓ ${gearData.length} gear items`)

  // ---- Courses ----

  const coursesData = [
    {
      id: "course-gear-rigging-basics",
      name: "Gear & Rigging Basics",
      tagline: "Learn to set up your tackle like a pro",
      price: 500,
      skillLevel: "Beginner",
      emoji: "🎯",
      popular: false,
      accentColor: "#5DDBD3",
      details: [
        { label: "Format", value: "In-person, 1-on-1 or small group" },
        { label: "Duration", value: "1–2 hours" },
        { label: "Covers", value: "Knot tying, bait selection by fish/fishing type, hook tying, basic rig setups" },
        { label: "What to bring", value: "Your own rod/reel" },
        { label: "What's included", value: "Sample hooks/line to take home" },
        { label: "Location", value: "Château Koenig, Black River" },
        { label: "Group size", value: "Max 4 persons" },
        { label: "Minors", value: "Must be accompanied by a guardian" },
        { label: "Weather policy", value: "Rescheduled in case of bad weather" },
        { label: "Cancellation policy", value: "No refund for cancellations/no-shows" },
      ],
      order: 1,
    },
    {
      id: "course-shore-casting-class",
      name: "Shore Casting Class",
      tagline: "Hands-on casting technique and gear walkthrough",
      price: 1000,
      skillLevel: "Beginner–Intermediate",
      emoji: "🎣",
      popular: true,
      accentColor: "#FF6B35",
      details: [
        { label: "Format", value: "In-person demo + hands-on practice" },
        { label: "Duration", value: "1–2 hours" },
        { label: "Covers", value: "Casting technique, shore fishing fundamentals, gear recommendations for shore fishing" },
        { label: "Location", value: "West Coast" },
        { label: "Group size", value: "Max 4 persons" },
        { label: "Minors", value: "Must be accompanied by a guardian" },
        { label: "Weather policy", value: "Rescheduled in case of bad weather" },
        { label: "Cancellation policy", value: "No refund for cancellations/no-shows" },
      ],
      order: 2,
    },
    {
      id: "course-kayak-fishing-101",
      name: "Kayak Fishing 101",
      tagline: "Self-paced intro to kayak fishing, safety, and gear",
      price: 200,
      skillLevel: "Complete beginner — no prior experience needed",
      emoji: "🛶",
      popular: false,
      accentColor: "#F59E0B",
      details: [
        { label: "Format", value: "Online, self-paced" },
        { label: "Covers", value: "Kayak fishing intro, safety essentials, gear overview" },
        { label: "Delivery", value: "Video modules + digital booklet (PDF)" },
        { label: "Access", value: "One-time purchase, lifetime access" },
      ],
      order: 3,
    },
  ]
  const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  for (const c of coursesData) {
    const details = (c.details ?? []).map((d) => ({ _key: slugify(d.label), _type: "courseDetail", ...d }))
    await client.createOrReplace({ _id: c.id, _type: "course", ...c, id: undefined, details })
  }
  console.log(`✓ ${coursesData.length} courses`)

  // ---- Fishing spots ----

  const spotsData = [
    {
      id: "spot-1",
      name: "Gulf of Mexico",
      x: 27,
      y: 43,
      species: "Bluefin Tuna, Red Snapper",
      bestSeason: "Mar – Oct",
      note: "Deep water humps 80mi out. Current lines are everything.",
    },
    {
      id: "spot-2",
      name: "Bahamas",
      x: 33,
      y: 44,
      species: "Mahi-Mahi, Wahoo, Sailfish",
      bestSeason: "Jan – Jun",
      note: "Weedlines hold mahi. Deep blue walls hold wahoo on the troll.",
    },
    {
      id: "spot-3",
      name: "Florida Keys",
      x: 30,
      y: 47,
      species: "Snook, Tarpon, Bonefish",
      bestSeason: "Year-round",
      note: "Backcountry flats fishing. Night tarpon under bridges is legendary.",
    },
    {
      id: "spot-4",
      name: "Cape Cod, MA",
      x: 40,
      y: 34,
      species: "Striped Bass, Bluefish",
      bestSeason: "Apr – Nov",
      note: "Race Point rip in August — stripers stacked. Popper bite at dawn.",
    },
    {
      id: "spot-5",
      name: "Nova Scotia",
      x: 44,
      y: 28,
      species: "Atlantic Bluefin Tuna",
      bestSeason: "Aug – Oct",
      note: "Massive bluefin migration. Chunking on mackerel. Arm-burning fights.",
    },
    {
      id: "spot-6",
      name: "Cancún",
      x: 25,
      y: 47,
      species: "Sailfish, Marlin, Dorado",
      bestSeason: "Nov – Apr",
      note: "Blue water 10 miles out. Sails are thick all winter.",
    },
  ]
  for (const s of spotsData) {
    await client.createOrReplace({ _id: s.id, _type: "fishingSpot", ...s, id: undefined })
  }
  console.log(`✓ ${spotsData.length} fishing spots`)

  // ---- Sponsors ----

  const sponsorsData = ["PENN", "SHIMANO", "YETI", "SIMMS", "RAPALA", "BUFF®", "SEAGUAR", "CALCUTTA"]
  for (let i = 0; i < sponsorsData.length; i++) {
    await client.createOrReplace({ _id: `sponsor-${i + 1}`, _type: "sponsor", name: sponsorsData[i], order: i + 1 })
  }
  console.log(`✓ ${sponsorsData.length} sponsors`)

  // ---- Shop products (unifies the old MERCH teaser + full SHOP_PRODUCTS_DATA) ----

  const COLOR_HEX = { Black: "#0D0D0D", White: "#F0F0F0", Teal: "#5DDBD3", Navy: "#1B2A4A", Charcoal: "#3A3A3A" }
  const productsData = [
    {
      id: "product-1",
      name: "Axsea Logo Tee",
      price: 1400,
      image: "https://images.unsplash.com/photo-1529230117010-b6c436154f25?w=500&h=500&fit=crop&auto=format",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Black", "White", "Teal"],
      stock: "in-stock",
      featured: true,
    },
    {
      id: "product-2",
      name: "Fish or Die Cap",
      price: 1100,
      image: "https://images.unsplash.com/photo-1541742425281-c1d3fc8aff96?w=500&h=500&fit=crop&auto=format",
      sizes: [],
      colors: ["Black", "Navy", "Teal"],
      stock: "low-stock",
      stockCount: 3,
      featured: true,
    },
    {
      id: "product-3",
      name: "Offshore Hoodie",
      price: 2600,
      image: "https://images.unsplash.com/photo-1552340745-89c5073640ad?w=500&h=500&fit=crop&auto=format",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "Charcoal"],
      stock: "in-stock",
      featured: true,
    },
    {
      id: "product-4",
      name: "Axsea Snapback",
      price: 900,
      image: "https://images.unsplash.com/photo-1551131618-3f0a5cf594b4?w=500&h=500&fit=crop&auto=format",
      sizes: [],
      colors: ["Black", "Teal", "White"],
      stock: "out-of-stock",
      featured: false,
    },
    {
      id: "product-5",
      name: "Sticker Pack (10pc)",
      price: 400,
      image: "https://images.unsplash.com/photo-1562053923-52d3ebb09d31?w=500&h=500&fit=crop&auto=format",
      sizes: [],
      colors: [],
      stock: "in-stock",
      featured: false,
    },
    {
      id: "product-6",
      name: "UV Shield Long Sleeve",
      price: 1800,
      image: "https://images.unsplash.com/photo-1582658085438-790f8837944b?w=500&h=500&fit=crop&auto=format",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["White", "Teal"],
      stock: "low-stock",
      stockCount: 2,
      featured: false,
    },
  ]
  for (const p of productsData) {
    const image = await imageFromUrl(p.image, `${p.id}.jpg`)
    const colors = p.colors.map((name) => ({ _key: name, name, hex: COLOR_HEX[name] ?? "#888888" }))
    await client.createOrReplace({
      _id: p.id,
      _type: "product",
      name: p.name,
      price: p.price,
      image,
      sizes: p.sizes,
      colors,
      stock: p.stock,
      stockCount: p.stockCount,
      featured: p.featured,
    })
  }
  console.log(`✓ ${productsData.length} products`)

  console.log("\nDone. Open the Studio and take a look.")
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
