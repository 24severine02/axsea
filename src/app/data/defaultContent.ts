import type { SiteContent } from "./types"

// Fallback content, shown instantly on load and used for any section the
// Google Sheet hasn't been filled in for yet (or if the sheet is
// unreachable). Keeps the site looking complete at all times.
export const DEFAULT_CONTENT: SiteContent = {
  videos: [
    { title: "187lb Bluefin Tuna — 3-Hour Battle in the Gulf", views: "1.2M views", duration: "22:14", platform: "YouTube", thumb: "https://images.unsplash.com/photo-1605750416507-734370f71920?w=600&h=340&fit=crop&auto=format", url: "#" },
    { title: "Mahi Slaughter — Bahamas Weedline Run", views: "847K views", duration: "18:32", platform: "YouTube", thumb: "https://images.unsplash.com/photo-1601226041388-8bbabdd6e37e?w=600&h=340&fit=crop&auto=format", url: "#" },
    { title: "Night Tarpon Under the Bridge — Keys POV", views: "3.1M views", duration: "09:47", platform: "TikTok", thumb: "https://images.unsplash.com/photo-1582658085438-790f8837944b?w=600&h=340&fit=crop&auto=format", url: "#" },
    { title: "Rigging a Spreader Bar for Tuna — Full Tutorial", views: "612K views", duration: "31:05", platform: "YouTube", thumb: "https://images.unsplash.com/photo-1551131618-3f0a5cf594b4?w=600&h=340&fit=crop&auto=format", url: "#" },
    { title: "Striped Bass on the Cape Cod Rip — Popper Bite", views: "498K views", duration: "14:21", platform: "YouTube", thumb: "https://images.unsplash.com/photo-1515631604561-23e0be68ee06?w=600&h=340&fit=crop&auto=format", url: "#" },
    { title: "Reading Sonar: How I Find Fish in Open Water", views: "1.8M views", duration: "28:11", platform: "YouTube", thumb: "https://images.unsplash.com/photo-1595886565824-b4f5c5a9c2d5?w=600&h=340&fit=crop&auto=format", url: "#" },
  ],

  catchLog: [
    { id: "1", species: "Bluefin Tuna", location: "Gulf of Mexico", date: "Jun 12, 2025", weight: "187 lbs", photo: "https://images.unsplash.com/photo-1566177229701-8895c29b9c68?w=600&h=400&fit=crop&auto=format", story: "Three hours into the fight, this beast changed directions twice. Biggest blue I've ever put on the deck." },
    { id: "2", species: "Mahi-Mahi", location: "Bahamas", date: "May 3, 2025", weight: "34 lbs", photo: "https://images.unsplash.com/photo-1515631604561-23e0be68ee06?w=600&h=400&fit=crop&auto=format", story: "Lit up like a neon sign when it hit the surface. Colour on this one was absolutely insane." },
    { id: "3", species: "Striped Bass", location: "Cape Cod, MA", date: "Apr 18, 2025", weight: "48 lbs", photo: "https://images.unsplash.com/photo-1707314175601-0b614b1224a8?w=600&h=400&fit=crop&auto=format", story: "First bass of the season and she didn't disappoint. Popper bite at dawn, no better way to start the year." },
    { id: "4", species: "Wahoo", location: "Florida Keys", date: "Mar 7, 2025", weight: "61 lbs", photo: "https://images.unsplash.com/photo-1601226041388-8bbabdd6e37e?w=600&h=400&fit=crop&auto=format", story: "Trolling spreader bars 35 miles out. This rocket hit the flat line at 40 knots then came back for more." },
    { id: "5", species: "Snook", location: "Everglades, FL", date: "Feb 21, 2025", weight: "27 lbs", photo: "https://images.unsplash.com/photo-1562053923-52d3ebb09d31?w=600&h=400&fit=crop&auto=format", story: "Full moon low tide, mangrove edge. Swimbait. Gnarliest snook I've tangled with in the backcountry." },
    { id: "6", species: "Mahi-Mahi", location: "Atlantic, NC", date: "Jan 14, 2025", weight: "29 lbs", photo: "https://images.unsplash.com/photo-1625183656263-171183307b15?w=600&h=400&fit=crop&auto=format", story: "Weedline was on fire. Caught 8 in a morning — this bull was the pick of the bunch." },
  ],

  gear: [
    { category: "Offshore Heavy", name: "Shimano Stella 20000", type: "Reel", desc: "Beast mode for tuna and marlin. This reel eats 200lb braid for breakfast.", img: "https://images.unsplash.com/photo-1537872384762-e785271d14f8?w=400&h=300&fit=crop&auto=format", link: "#" },
    { category: "Offshore Heavy", name: "Penn Carnage III 80–130lb", type: "Rod", desc: "Full-length blank wrap. Built to subdue tuna, not tickle them.", img: "https://images.unsplash.com/photo-1551131618-3f0a5cf594b4?w=400&h=300&fit=crop&auto=format", link: "#" },
    { category: "Offshore Heavy", name: "Boston Whaler 270 Dauntless", type: "Boat", desc: "Unsinkable hull, twin Yamaha 200s. My office from March through November.", img: "https://images.unsplash.com/photo-1625183656263-171183307b15?w=400&h=300&fit=crop&auto=format", link: "#" },
    { category: "Offshore Heavy", name: "Williamson Speed Pro Lures", type: "Tackle", desc: "High-speed trolling lures that trigger tuna when nothing else will.", img: "https://images.unsplash.com/photo-1541742425281-c1d3fc8aff96?w=400&h=300&fit=crop&auto=format", link: "#" },
    { category: "Inshore Finesse", name: "Daiwa Tatula SV TW", type: "Reel", desc: "Buttery smooth for targeting snook and redfish on light braid.", img: "https://images.unsplash.com/photo-1505850557988-b858c0aec076?w=400&h=300&fit=crop&auto=format", link: "#" },
    { category: "Inshore Finesse", name: "St. Croix Mojo Inshore", type: "Rod", desc: "Sensitive enough to feel the tick, stiff enough to set the hook hard.", img: "https://images.unsplash.com/photo-1529230117010-b6c436154f25?w=400&h=300&fit=crop&auto=format", link: "#" },
    { category: "Inshore Finesse", name: "Rapala X-Rap Saltwater", type: "Lure", desc: "Walks the dog perfectly over grass flats. My go-to for snook on the prowl.", img: "https://images.unsplash.com/photo-1595886565824-b4f5c5a9c2d5?w=400&h=300&fit=crop&auto=format", link: "#" },
    { category: "Inshore Finesse", name: "Power Pro Spectra 30lb", type: "Line", desc: "Zero stretch, incredible sensitivity. The backbone of every inshore setup.", img: "https://images.unsplash.com/photo-1552340745-89c5073640ad?w=400&h=300&fit=crop&auto=format", link: "#" },
  ],

  courses: [
    { name: "Beginner's Hook", price: "$49", level: "Beginner", emoji: "🎯", popular: false, accentColor: "#5DDBD3", desc: "Zero to first catch. Gear, knots, reading water, and setting the hook — everything you need to stop blanking.", includes: ["6 HD video modules", "Gear buying guide PDF", "Private Discord access", "Lifetime updates"] },
    { name: "Offshore Unlocked", price: "$149", level: "Intermediate", emoji: "🎣", popular: true, accentColor: "#FF6B35", desc: "Trolling strategy, sonar reading, rigging spreader bars, and fighting the big ones without blowing up your gear.", includes: ["12 HD video modules", "Trolling spread guide PDF", "Sonar cheat sheet", "Monthly Q&A calls", "Discord + lifetime access"] },
    { name: "Axel's Inner Circle", price: "$499", level: "Advanced", emoji: "🏆", popular: false, accentColor: "#F59E0B", desc: "Personal mentorship. Fish with Axel virtually and in-person. Limited to 10 students per cohort.", includes: ["Everything in Offshore Unlocked", "3 × 1hr Zoom calls with Axel", "Invite to 1 guided trip", "Axsea gear bundle"] },
  ],

  testimonials: [
    { name: "Marco D.", location: "Miami, FL", course: "Offshore Unlocked", stars: 5, text: "Axel's sonar breakdown alone paid for the course ten times over. Landed my first bluefin three weeks after finishing." },
    { name: "Jenna R.", location: "Charleston, SC", course: "Beginner's Hook", stars: 5, text: "I went from not knowing what end of the rod to hold to catching stripers off the jetty. The knot videos saved my life." },
    { name: "Tyler K.", location: "Tampa, FL", course: "Axel's Inner Circle", stars: 5, text: "Best money I've ever spent on fishing. Axel called me after my first offshore trip and talked me through everything." },
  ],

  spots: [
    { id: "1", name: "Gulf of Mexico", x: 27, y: 43, species: "Bluefin Tuna, Red Snapper", best: "Mar – Oct", note: "Deep water humps 80mi out. Current lines are everything." },
    { id: "2", name: "Bahamas", x: 33, y: 44, species: "Mahi-Mahi, Wahoo, Sailfish", best: "Jan – Jun", note: "Weedlines hold mahi. Deep blue walls hold wahoo on the troll." },
    { id: "3", name: "Florida Keys", x: 30, y: 47, species: "Snook, Tarpon, Bonefish", best: "Year-round", note: "Backcountry flats fishing. Night tarpon under bridges is legendary." },
    { id: "4", name: "Cape Cod, MA", x: 40, y: 34, species: "Striped Bass, Bluefish", best: "Apr – Nov", note: "Race Point rip in August — stripers stacked. Popper bite at dawn." },
    { id: "5", name: "Nova Scotia", x: 44, y: 28, species: "Atlantic Bluefin Tuna", best: "Aug – Oct", note: "Massive bluefin migration. Chunking on mackerel. Arm-burning fights." },
    { id: "6", name: "Cancún", x: 25, y: 47, species: "Sailfish, Marlin, Dorado", best: "Nov – Apr", note: "Blue water 10 miles out. Sails are thick all winter." },
  ],

  merch: [
    { name: "Axsea Logo Tee", price: "$35", img: "https://images.unsplash.com/photo-1529230117010-b6c436154f25?w=400&h=400&fit=crop&auto=format", link: "#" },
    { name: "Fish or Die Cap", price: "$28", img: "https://images.unsplash.com/photo-1541742425281-c1d3fc8aff96?w=400&h=400&fit=crop&auto=format", link: "#" },
    { name: "Offshore Hoodie", price: "$65", img: "https://images.unsplash.com/photo-1552340745-89c5073640ad?w=400&h=400&fit=crop&auto=format", link: "#" },
  ],

  sponsors: ["PENN", "SHIMANO", "YETI", "SIMMS", "RAPALA", "BUFF®", "SEAGUAR", "CALCUTTA"].map((name) => ({ name })),

  timeline: [
    { year: "2010", event: "First fishing rod at age 12 — immediately, embarrassingly obsessed." },
    { year: "2015", event: "First offshore trip. Caught a mahi. Life changed forever." },
    { year: "2018", event: "Started posting catch videos. 200 subscribers in year one." },
    { year: "2020", event: "Hit 10K on YouTube. Bought the Boston Whaler. No regrets." },
    { year: "2022", event: "Launched first fishing course — 400 students in 30 days." },
    { year: "2025", event: "943K total followers. Still chasing that 300lb tuna." },
  ],

  config: {
    heroKicker: "Axel Béchard · Content Creator · Fisherman",
    heroTitleLine1: "Chasing Fish,",
    heroTitleLine2: "Sharing the Ride.",
    heroSubtitle: "From Gulf of Mexico tuna to Everglades snook — we go where the bite is hot and bring you along for every single cast.",
    heroImage: "https://images.unsplash.com/photo-1605750416507-734370f71920?w=1800&h=1100&fit=crop&auto=format",

    statYoutube: "248K",
    statInstagram: "183K",
    statTiktok: "512K",
    statYearsFishing: "14+",
    statStudents: "3,200+",
    statBiggestCatch: "248 lbs",

    aboutName: "Axel",
    aboutPhoto: "https://images.unsplash.com/photo-1582658085438-790f8837944b?w=800&h=1000&fit=crop&auto=format",
    aboutParagraph1: "Grew up on the coast of Nova Scotia, where my dad handed me a rod before I could read. Fishing wasn't a hobby — it was Sunday mornings, salt in the air, and the only time everything made sense.",
    aboutParagraph2: "I started filming my catches because my friends didn't believe me. Turns out a lot of strangers didn't either — until they watched the videos. Now I help thousands of people find the same thing I found on that first boat: total, embarrassing, unhinged obsession with fishing.",
    personalBestValue: "248 lbs",
    personalBestLabel: "Personal Best Bluefin",

    mapImage: "https://images.unsplash.com/photo-1495171081156-cc1209ddf6a0?w=1400&h=800&fit=crop&auto=format",

    socialInstagramUrl: "#",
    socialYoutubeUrl: "#",
    socialWhatsappUrl: "#",
    socialTiktokUrl: "#",

    footerBio: "Axel Béchard — fisherman, content creator, and firm believer that the best days end with salt in your hair and a cooler that barely closes.",
    copyrightText: "© 2025 Axsea · Axel Béchard. All rights reserved.",
  },
}
