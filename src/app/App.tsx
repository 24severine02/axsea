import { useState, useEffect } from "react"
import { motion } from "motion/react"
import {
  Menu, X, Play, Star, MapPin, Instagram, Youtube,
  ArrowRight, Anchor, ShoppingBag, BookOpen, Award,
  MessageCircle, ExternalLink, CheckCircle,
} from "lucide-react"
import axseaLogo from "@/imports/channels4_profile.jpg"

// ─── DATA ─────────────────────────────────────────────────────

const NAV_LINKS = ["Home", "About Me", "My Setups", "Courses", "Contact"]

const CATCH_LOG = [
  {
    id: 1, species: "Bluefin Tuna", location: "Gulf of Mexico", date: "Jun 12, 2025", weight: "187 lbs",
    photo: "https://images.unsplash.com/photo-1566177229701-8895c29b9c68?w=600&h=400&fit=crop&auto=format",
    story: "Three hours into the fight, this beast changed directions twice. Biggest blue I've ever put on the deck.",
  },
  {
    id: 2, species: "Mahi-Mahi", location: "Bahamas", date: "May 3, 2025", weight: "34 lbs",
    photo: "https://images.unsplash.com/photo-1515631604561-23e0be68ee06?w=600&h=400&fit=crop&auto=format",
    story: "Lit up like a neon sign when it hit the surface. Colour on this one was absolutely insane.",
  },
  {
    id: 3, species: "Striped Bass", location: "Cape Cod, MA", date: "Apr 18, 2025", weight: "48 lbs",
    photo: "https://images.unsplash.com/photo-1707314175601-0b614b1224a8?w=600&h=400&fit=crop&auto=format",
    story: "First bass of the season and she didn't disappoint. Popper bite at dawn, no better way to start the year.",
  },
  {
    id: 4, species: "Wahoo", location: "Florida Keys", date: "Mar 7, 2025", weight: "61 lbs",
    photo: "https://images.unsplash.com/photo-1601226041388-8bbabdd6e37e?w=600&h=400&fit=crop&auto=format",
    story: "Trolling spreader bars 35 miles out. This rocket hit the flat line at 40 knots then came back for more.",
  },
  {
    id: 5, species: "Snook", location: "Everglades, FL", date: "Feb 21, 2025", weight: "27 lbs",
    photo: "https://images.unsplash.com/photo-1562053923-52d3ebb09d31?w=600&h=400&fit=crop&auto=format",
    story: "Full moon low tide, mangrove edge. Swimbait. Gnarliest snook I've tangled with in the backcountry.",
  },
  {
    id: 6, species: "Mahi-Mahi", location: "Atlantic, NC", date: "Jan 14, 2025", weight: "29 lbs",
    photo: "https://images.unsplash.com/photo-1625183656263-171183307b15?w=600&h=400&fit=crop&auto=format",
    story: "Weedline was on fire. Caught 8 in a morning — this bull was the pick of the bunch.",
  },
]

const SPECIES_FILTERS = ["All", "Bluefin Tuna", "Mahi-Mahi", "Striped Bass", "Wahoo", "Snook"]

const VIDEOS = [
  { title: "187lb Bluefin Tuna — 3-Hour Battle in the Gulf", views: "1.2M views", duration: "22:14", platform: "YouTube", thumb: "https://images.unsplash.com/photo-1605750416507-734370f71920?w=600&h=340&fit=crop&auto=format" },
  { title: "Mahi Slaughter — Bahamas Weedline Run", views: "847K views", duration: "18:32", platform: "YouTube", thumb: "https://images.unsplash.com/photo-1601226041388-8bbabdd6e37e?w=600&h=340&fit=crop&auto=format" },
  { title: "Night Tarpon Under the Bridge — Keys POV", views: "3.1M views", duration: "09:47", platform: "TikTok", thumb: "https://images.unsplash.com/photo-1582658085438-790f8837944b?w=600&h=340&fit=crop&auto=format" },
  { title: "Rigging a Spreader Bar for Tuna — Full Tutorial", views: "612K views", duration: "31:05", platform: "YouTube", thumb: "https://images.unsplash.com/photo-1551131618-3f0a5cf594b4?w=600&h=340&fit=crop&auto=format" },
  { title: "Striped Bass on the Cape Cod Rip — Popper Bite", views: "498K views", duration: "14:21", platform: "YouTube", thumb: "https://images.unsplash.com/photo-1515631604561-23e0be68ee06?w=600&h=340&fit=crop&auto=format" },
  { title: "Reading Sonar: How I Find Fish in Open Water", views: "1.8M views", duration: "28:11", platform: "YouTube", thumb: "https://images.unsplash.com/photo-1595886565824-b4f5c5a9c2d5?w=600&h=340&fit=crop&auto=format" },
]

const GEAR = [
  {
    category: "Offshore Heavy",
    items: [
      { name: "Shimano Stella 20000", type: "Reel", desc: "Beast mode for tuna and marlin. This reel eats 200lb braid for breakfast.", img: "https://images.unsplash.com/photo-1537872384762-e785271d14f8?w=400&h=300&fit=crop&auto=format" },
      { name: "Penn Carnage III 80–130lb", type: "Rod", desc: "Full-length blank wrap. Built to subdue tuna, not tickle them.", img: "https://images.unsplash.com/photo-1551131618-3f0a5cf594b4?w=400&h=300&fit=crop&auto=format" },
      { name: "Boston Whaler 270 Dauntless", type: "Boat", desc: "Unsinkable hull, twin Yamaha 200s. My office from March through November.", img: "https://images.unsplash.com/photo-1625183656263-171183307b15?w=400&h=300&fit=crop&auto=format" },
      { name: "Williamson Speed Pro Lures", type: "Tackle", desc: "High-speed trolling lures that trigger tuna when nothing else will.", img: "https://images.unsplash.com/photo-1541742425281-c1d3fc8aff96?w=400&h=300&fit=crop&auto=format" },
    ],
  },
  {
    category: "Inshore Finesse",
    items: [
      { name: "Daiwa Tatula SV TW", type: "Reel", desc: "Buttery smooth for targeting snook and redfish on light braid.", img: "https://images.unsplash.com/photo-1505850557988-b858c0aec076?w=400&h=300&fit=crop&auto=format" },
      { name: "St. Croix Mojo Inshore", type: "Rod", desc: "Sensitive enough to feel the tick, stiff enough to set the hook hard.", img: "https://images.unsplash.com/photo-1529230117010-b6c436154f25?w=400&h=300&fit=crop&auto=format" },
      { name: "Rapala X-Rap Saltwater", type: "Lure", desc: "Walks the dog perfectly over grass flats. My go-to for snook on the prowl.", img: "https://images.unsplash.com/photo-1595886565824-b4f5c5a9c2d5?w=400&h=300&fit=crop&auto=format" },
      { name: "Power Pro Spectra 30lb", type: "Line", desc: "Zero stretch, incredible sensitivity. The backbone of every inshore setup.", img: "https://images.unsplash.com/photo-1552340745-89c5073640ad?w=400&h=300&fit=crop&auto=format" },
    ],
  },
]

const COURSES = [
  {
    name: "Beginner's Hook", price: "$49", level: "Beginner", emoji: "🎯", popular: false, accentColor: "#5DDBD3",
    desc: "Zero to first catch. Gear, knots, reading water, and setting the hook — everything you need to stop blanking.",
    includes: ["6 HD video modules", "Gear buying guide PDF", "Private Discord access", "Lifetime updates"],
  },
  {
    name: "Offshore Unlocked", price: "$149", level: "Intermediate", emoji: "🎣", popular: true, accentColor: "#FF6B35",
    desc: "Trolling strategy, sonar reading, rigging spreader bars, and fighting the big ones without blowing up your gear.",
    includes: ["12 HD video modules", "Trolling spread guide PDF", "Sonar cheat sheet", "Monthly Q&A calls", "Discord + lifetime access"],
  },
  {
    name: "Axel's Inner Circle", price: "$499", level: "Advanced", emoji: "🏆", popular: false, accentColor: "#F59E0B",
    desc: "Personal mentorship. Fish with Axel virtually and in-person. Limited to 10 students per cohort.",
    includes: ["Everything in Offshore Unlocked", "3 × 1hr Zoom calls with Axel", "Invite to 1 guided trip", "Axsea gear bundle"],
  },
]

const TESTIMONIALS = [
  { name: "Marco D.", location: "Miami, FL", course: "Offshore Unlocked", stars: 5, text: "Axel's sonar breakdown alone paid for the course ten times over. Landed my first bluefin three weeks after finishing." },
  { name: "Jenna R.", location: "Charleston, SC", course: "Beginner's Hook", stars: 5, text: "I went from not knowing what end of the rod to hold to catching stripers off the jetty. The knot videos saved my life." },
  { name: "Tyler K.", location: "Tampa, FL", course: "Axel's Inner Circle", stars: 5, text: "Best money I've ever spent on fishing. Axel called me after my first offshore trip and talked me through everything." },
]

const SPOTS = [
  { id: 1, name: "Gulf of Mexico", x: 27, y: 43, species: "Bluefin Tuna, Red Snapper", best: "Mar – Oct", note: "Deep water humps 80mi out. Current lines are everything." },
  { id: 2, name: "Bahamas", x: 33, y: 44, species: "Mahi-Mahi, Wahoo, Sailfish", best: "Jan – Jun", note: "Weedlines hold mahi. Deep blue walls hold wahoo on the troll." },
  { id: 3, name: "Florida Keys", x: 30, y: 47, species: "Snook, Tarpon, Bonefish", best: "Year-round", note: "Backcountry flats fishing. Night tarpon under bridges is legendary." },
  { id: 4, name: "Cape Cod, MA", x: 40, y: 34, species: "Striped Bass, Bluefish", best: "Apr – Nov", note: "Race Point rip in August — stripers stacked. Popper bite at dawn." },
  { id: 5, name: "Nova Scotia", x: 44, y: 28, species: "Atlantic Bluefin Tuna", best: "Aug – Oct", note: "Massive bluefin migration. Chunking on mackerel. Arm-burning fights." },
  { id: 6, name: "Cancún", x: 25, y: 47, species: "Sailfish, Marlin, Dorado", best: "Nov – Apr", note: "Blue water 10 miles out. Sails are thick all winter." },
]

const SPONSORS = ["PENN", "SHIMANO", "YETI", "SIMMS", "RAPALA", "BUFF®", "SEAGUAR", "CALCUTTA"]

const MERCH = [
  { name: "Axsea Logo Tee", price: "$35", img: "https://images.unsplash.com/photo-1529230117010-b6c436154f25?w=400&h=400&fit=crop&auto=format" },
  { name: "Fish or Die Cap", price: "$28", img: "https://images.unsplash.com/photo-1541742425281-c1d3fc8aff96?w=400&h=400&fit=crop&auto=format" },
  { name: "Offshore Hoodie", price: "$65", img: "https://images.unsplash.com/photo-1552340745-89c5073640ad?w=400&h=400&fit=crop&auto=format" },
]

// ─── INTRO ANIMATION ──────────────────────────────────────────

function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 700)
    const t2 = setTimeout(() => setPhase(2), 1350)
    const t3 = setTimeout(() => setPhase(3), 2050)
    const t4 = setTimeout(() => onComplete(), 2600)
    return () => [t1, t2, t3, t4].forEach(clearTimeout)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden select-none"
      style={{ backgroundColor: "#5DDBD3" }}
      animate={phase === 3 ? { y: "-100%", opacity: 0.8 } : { y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="flex flex-col items-center">
        {/* Fishing line */}
        <div className="relative flex flex-col items-center">
          <motion.div
            className="w-[2px] rounded-full origin-top"
            style={{ background: "rgba(13,13,13,0.3)" }}
            initial={{ height: 0 }}
            animate={{ height: phase <= 1 ? 110 : 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
          <motion.svg
            width="16" height="22" viewBox="0 0 16 22" fill="none"
            animate={{ opacity: phase <= 1 ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path d="M8 0 L8 14 Q8 20 14 20" stroke="rgba(13,13,13,0.4)" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="14" cy="20" r="2" fill="rgba(13,13,13,0.4)" />
          </motion.svg>
        </div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.75 }}
          animate={
            phase === 1 ? { opacity: 1, y: 0, scale: 1 } :
            phase === 2 ? { opacity: 1, y: -130, scale: 0.65 } :
            phase === 3 ? { opacity: 0, y: -180, scale: 0.5 } :
            { opacity: 0, y: 30, scale: 0.75 }
          }
          transition={{ type: "spring", damping: 13, stiffness: 180 }}
          className="mt-1"
        >
          <img
            src={axseaLogo}
            alt="Axsea"
            className="w-32 h-32 rounded-full"
            style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.25)" }}
          />
        </motion.div>

        {/* AXSEA wordmark */}
        <motion.p
          className="mt-5 text-5xl font-black tracking-[0.2em] text-black/80"
          style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: phase === 1 ? 1 : 0, y: phase === 1 ? 0 : 8 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          AXSEA
        </motion.p>
      </div>
    </motion.div>
  )
}

// ─── NAVBAR ───────────────────────────────────────────────────

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0D0D0D]/92 backdrop-blur-lg border-b border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2.5 group">
          <div className="relative">
            <img
              src={axseaLogo}
              alt="Axsea logo"
              className="w-9 h-9 rounded-full ring-2 ring-transparent group-hover:ring-[#5DDBD3]/60 transition-all duration-300"
            />
          </div>
          <span
            className="text-white font-bold text-[1.2rem] tracking-[0.18em]"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            AXSEA
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase().replace(" ", "-")}`}
                className="text-white/60 hover:text-[#5DDBD3] text-sm font-medium tracking-wide transition-colors duration-200"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#courses"
          className="hidden md:inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-[#ff7a47] text-white font-bold text-sm px-5 py-2.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(255,107,53,0.35)]"
        >
          Join a Course <ArrowRight className="w-4 h-4" />
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden bg-[#0D0D0D]/98 border-t border-white/[0.06] px-6 pb-7"
        >
          <ul className="flex flex-col gap-5 pt-5">
            {NAV_LINKS.map((link) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase().replace(" ", "-")}`}
                  className="text-white/75 text-lg font-semibold hover:text-[#5DDBD3] transition-colors block"
                  onClick={() => setMenuOpen(false)}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#courses"
            className="mt-6 inline-flex items-center gap-2 bg-[#FF6B35] text-white font-bold px-6 py-3 rounded-full"
            onClick={() => setMenuOpen(false)}
          >
            Join a Course <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      )}
    </motion.nav>
  )
}

// ─── HERO ─────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1605750416507-734370f71920?w=1800&h=1100&fit=crop&auto=format"
        alt="Silhouette fishing at sunset"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-[#0D0D0D]" />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20">
        <motion.span
          className="inline-block text-[#5DDBD3] text-xs font-bold tracking-[0.35em] uppercase mb-5 px-4 py-1.5 border border-[#5DDBD3]/40 rounded-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Axel Béchard · Content Creator · Fisherman
        </motion.span>

        <motion.h1
          className="text-[3.5rem] sm:text-[5rem] lg:text-[6.5rem] font-black text-white leading-[0.95] mb-6"
          style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700 }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.7 }}
        >
          Chasing Fish,
          <br />
          <span className="text-[#5DDBD3]">Sharing the Ride.</span>
        </motion.h1>

        <motion.p
          className="text-white/65 text-lg sm:text-xl max-w-lg mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.58, duration: 0.6 }}
        >
          From Gulf of Mexico tuna to Everglades snook — we go where the bite is hot and bring you along for every single cast.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72, duration: 0.5 }}
        >
          <button className="group flex items-center justify-center gap-3 bg-white text-black font-bold px-8 py-4 rounded-full hover:bg-[#5DDBD3] transition-all duration-250 hover:scale-105 active:scale-95 text-base shadow-[0_8px_30px_rgba(255,255,255,0.15)]">
            <span className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center group-hover:bg-black/15 transition-colors">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </span>
            Watch My Latest Catch
          </button>
          <a
            href="#courses"
            className="flex items-center justify-center gap-2 border-2 border-white/35 text-white font-bold px-8 py-4 rounded-full hover:border-[#5DDBD3] hover:text-[#5DDBD3] transition-all duration-250 text-base"
          >
            Explore Courses
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator — fishing hook motif */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span className="text-white/35 text-[10px] font-bold tracking-[0.3em] uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
          <svg width="18" height="26" viewBox="0 0 18 26" fill="none">
            <path d="M9 2 Q13 8 9 14 Q5 20 9 24" stroke="#5DDBD3" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="9" cy="24" r="2.5" fill="#5DDBD3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}

// ─── SOCIAL PROOF BAR ─────────────────────────────────────────

function SocialProofBar() {
  const stats = [
    { label: "YouTube", value: "248K", icon: <Youtube className="w-4 h-4" /> },
    { label: "Instagram", value: "183K", icon: <Instagram className="w-4 h-4" /> },
    { label: "TikTok", value: "512K", icon: <span className="text-xs font-black">TK</span> },
    { label: "Years Fishing", value: "14+", icon: <Anchor className="w-4 h-4" /> },
    { label: "Students", value: "3,200+", icon: <BookOpen className="w-4 h-4" /> },
    { label: "Biggest Catch", value: "248 lbs", icon: <Award className="w-4 h-4" /> },
  ]

  return (
    <section className="bg-[#5DDBD3] py-4">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap gap-5 justify-center md:justify-between items-center">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-2 text-black">
              <span className="opacity-55">{s.icon}</span>
              <span className="font-black text-lg" style={{ fontFamily: "'Fredoka', sans-serif" }}>{s.value}</span>
              <span className="text-xs font-semibold opacity-60 hidden sm:block">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FEATURED VIDEOS ──────────────────────────────────────────

function FeaturedVideos() {
  return (
    <section className="py-24 bg-[#0D0D0D]" id="videos">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[#5DDBD3] text-xs font-bold tracking-[0.3em] uppercase mb-2">Latest Content</p>
            <h2
              className="text-4xl sm:text-5xl font-black text-white"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              On the Water. On Your Screen.
            </h2>
          </div>
          <a href="#" className="hidden sm:flex items-center gap-1.5 text-[#5DDBD3] font-bold text-sm hover:gap-2.5 transition-all duration-200">
            All videos <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {VIDEOS.map((v, i) => (
            <motion.div
              key={v.title}
              className="group relative rounded-2xl overflow-hidden bg-[#1A1A1A] cursor-pointer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative h-48 bg-[#252525] overflow-hidden">
                <img
                  src={v.thumb}
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-13 h-13 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#5DDBD3]/80 transition-all duration-250 w-12 h-12">
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[11px] px-2 py-0.5 rounded font-mono">
                  {v.duration}
                </span>
                <span
                  className={`absolute top-2 left-2 text-[11px] font-black px-2.5 py-1 rounded-full ${
                    v.platform === "YouTube"
                      ? "bg-red-600 text-white"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  }`}
                >
                  {v.platform}
                </span>
              </div>
              <div className="p-4">
                <p className="text-white font-semibold text-sm leading-snug line-clamp-2 mb-2">{v.title}</p>
                <p className="text-white/35 text-xs">{v.views}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CATCH LOG ────────────────────────────────────────────────

function CatchLog() {
  const [filter, setFilter] = useState("All")
  const filtered = filter === "All" ? CATCH_LOG : CATCH_LOG.filter((c) => c.species === filter)

  return (
    <section className="py-24 bg-[#111111]" id="catch-log">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-[#5DDBD3] text-xs font-bold tracking-[0.3em] uppercase mb-2">Catch Log</p>
        <h2
          className="text-4xl sm:text-5xl font-black text-white mb-8"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          The Proof Is in the Cooler.
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-9">
          {SPECIES_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                filter === s
                  ? "bg-[#5DDBD3] text-black shadow-[0_4px_16px_rgba(93,219,211,0.3)]"
                  : "bg-[#1e1e1e] text-white/55 border border-white/10 hover:text-white hover:border-white/25"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/[0.05] hover:border-[#5DDBD3]/30 transition-colors group"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="relative h-52 bg-[#252525] overflow-hidden">
                <img
                  src={c.photo}
                  alt={c.species}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <span className="text-white font-black text-xl leading-tight" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                    {c.species}
                  </span>
                  <span className="bg-[#5DDBD3] text-black text-xs font-black px-2.5 py-1 rounded-full shrink-0 ml-2">
                    {c.weight}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 text-white/35 text-xs mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {c.location}
                  </span>
                  <span>{c.date}</span>
                </div>
                <p className="text-white/65 text-sm leading-relaxed">{c.story}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── ABOUT ME ─────────────────────────────────────────────────

function AboutMe() {
  const timeline = [
    { year: "2010", event: "First fishing rod at age 12 — immediately, embarrassingly obsessed." },
    { year: "2015", event: "First offshore trip. Caught a mahi. Life changed forever." },
    { year: "2018", event: "Started posting catch videos. 200 subscribers in year one." },
    { year: "2020", event: "Hit 10K on YouTube. Bought the Boston Whaler. No regrets." },
    { year: "2022", event: "Launched first fishing course — 400 students in 30 days." },
    { year: "2025", event: "943K total followers. Still chasing that 300lb tuna." },
  ]

  return (
    <section className="py-24 bg-[#0D0D0D]" id="about-me">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Photo */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-[#1A1A1A]">
              <img
                src="https://images.unsplash.com/photo-1582658085438-790f8837944b?w=800&h=1000&fit=crop&auto=format"
                alt="Axel Béchard fishing offshore"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating PB card */}
            <div className="absolute -bottom-5 -right-5 bg-[#5DDBD3] rounded-2xl p-5 shadow-2xl hidden sm:block">
              <p className="text-black font-black text-3xl" style={{ fontFamily: "'Fredoka', sans-serif" }}>248 lbs</p>
              <p className="text-black/65 text-sm font-semibold">Personal Best Bluefin</p>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="text-[#5DDBD3] text-xs font-bold tracking-[0.3em] uppercase mb-3">About Me</p>
            <h2
              className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              Hey, I'm Axel.
              <br />
              <span className="text-[#5DDBD3]">I Fish. I Film. I Teach.</span>
            </h2>
            <p className="text-white/65 leading-relaxed mb-4">
              Grew up on the coast of Nova Scotia, where my dad handed me a rod before I could read. Fishing wasn't a hobby — it was Sunday mornings, salt in the air, and the only time everything made sense.
            </p>
            <p className="text-white/65 leading-relaxed mb-9">
              I started filming my catches because my friends didn't believe me. Turns out a lot of strangers didn't either — until they watched the videos. Now I help thousands of people find the same thing I found on that first boat: total, embarrassing, unhinged obsession with fishing.
            </p>

            <div className="space-y-3.5">
              {timeline.map((t) => (
                <div key={t.year} className="flex gap-4 items-start">
                  <span
                    className="text-[#5DDBD3] font-black text-sm w-10 shrink-0 mt-0.5"
                    style={{ fontFamily: "'Fredoka', sans-serif" }}
                  >
                    {t.year}
                  </span>
                  <span className="text-white/55 text-sm leading-snug">{t.event}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── MY SETUPS ────────────────────────────────────────────────

function MySetups() {
  const [activeCategory, setActiveCategory] = useState(GEAR[0].category)
  const activeItems = GEAR.find((g) => g.category === activeCategory)?.items ?? []

  return (
    <section className="py-24 bg-[#111111]" id="my-setups">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-[#5DDBD3] text-xs font-bold tracking-[0.3em] uppercase mb-2">My Setups</p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
          <h2
            className="text-4xl sm:text-5xl font-black text-white"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            Gear That Actually Works.
          </h2>
          <div className="flex gap-2">
            {GEAR.map((g) => (
              <button
                key={g.category}
                onClick={() => setActiveCategory(g.category)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                  activeCategory === g.category
                    ? "bg-[#5DDBD3] text-black"
                    : "bg-[#1e1e1e] text-white/55 border border-white/10 hover:text-white"
                }`}
              >
                {g.category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {activeItems.map((item, i) => (
            <motion.div
              key={item.name}
              className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/[0.05] group hover:border-[#5DDBD3]/40 transition-all duration-250"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4 }}
            >
              <div className="h-44 bg-[#252525] overflow-hidden">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <span className="text-[#5DDBD3] text-[11px] font-black tracking-wider uppercase">{item.type}</span>
                <h3 className="text-white font-bold text-base mt-1 mb-2 leading-snug">{item.name}</h3>
                <p className="text-white/45 text-sm leading-snug mb-3">{item.desc}</p>
                <a href="#" className="flex items-center gap-1 text-[#FF6B35] text-sm font-bold hover:gap-2 transition-all duration-150">
                  Shop link <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── COURSES ──────────────────────────────────────────────────

function Courses() {
  return (
    <section className="py-24 bg-[#0D0D0D]" id="courses">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[#5DDBD3] text-xs font-bold tracking-[0.3em] uppercase mb-3">Courses</p>
          <h2
            className="text-4xl sm:text-5xl font-black text-white mb-4"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            Learn to Fish Like You Mean It.
          </h2>
          <p className="text-white/45 max-w-lg mx-auto text-base">
            No fluff, no filler. Just the exact knowledge that helped me land 187lb bluefin on 30lb braid.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {COURSES.map((course, i) => (
            <motion.div
              key={course.name}
              className={`relative rounded-3xl p-7 border transition-all duration-250 hover:-translate-y-1 ${
                course.popular
                  ? "bg-[#FF6B35] border-[#FF6B35] shadow-[0_20px_60px_rgba(255,107,53,0.35)]"
                  : "bg-[#1A1A1A] border-white/[0.07]"
              }`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {course.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-black px-5 py-1.5 rounded-full tracking-wider">
                  MOST POPULAR
                </span>
              )}
              <div className="text-4xl mb-3">{course.emoji}</div>
              <span
                className={`text-[11px] font-bold tracking-widest uppercase ${course.popular ? "text-white/70" : "text-[#5DDBD3]"}`}
              >
                {course.level}
              </span>
              <h3
                className="text-2xl font-black text-white mt-1 mb-2"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                {course.name}
              </h3>
              <p className={`text-sm leading-relaxed mb-4 ${course.popular ? "text-white/80" : "text-white/50"}`}>
                {course.desc}
              </p>
              <p
                className="text-4xl font-black text-white mb-6"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                {course.price}
              </p>
              <ul className="space-y-2.5 mb-8">
                {course.includes.map((inc) => (
                  <li
                    key={inc}
                    className={`flex items-start gap-2.5 text-sm ${course.popular ? "text-white/90" : "text-white/60"}`}
                  >
                    <CheckCircle
                      className={`w-4 h-4 mt-0.5 shrink-0 ${course.popular ? "text-white" : "text-[#5DDBD3]"}`}
                    />
                    {inc}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-4 rounded-full font-black text-sm transition-all hover:scale-[1.03] active:scale-[0.97] ${
                  course.popular ? "bg-white text-[#FF6B35]" : "bg-[#FF6B35] text-white shadow-[0_4px_20px_rgba(255,107,53,0.3)]"
                }`}
              >
                Enroll Now
              </button>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div>
          <p className="text-center text-white/25 text-xs font-bold tracking-[0.3em] uppercase mb-8">
            What Students Say
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/[0.06]"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                  ))}
                </div>
                <p className="text-white/65 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="text-white font-bold text-sm">{t.name}</p>
                  <p className="text-white/35 text-xs mt-0.5">
                    {t.location} · {t.course}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── SHOP TEASER ──────────────────────────────────────────────

function ShopTeaser() {
  return (
    <section className="py-20 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div>
            <p className="text-[#5DDBD3] text-xs font-bold tracking-[0.3em] uppercase mb-1">Merch</p>
            <h2 className="text-3xl font-black text-white" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Rep the Brand.
            </h2>
          </div>
          <a href="#" className="flex items-center gap-2 text-[#FF6B35] font-bold text-sm hover:gap-3 transition-all duration-200">
            Visit the shop <ShoppingBag className="w-4 h-4" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {MERCH.map((item, i) => (
            <motion.div
              key={item.name}
              className="group rounded-2xl overflow-hidden bg-[#1A1A1A] cursor-pointer border border-white/[0.05] hover:border-[#5DDBD3]/30 transition-colors"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <div className="h-56 bg-[#222] overflow-hidden">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 flex justify-between items-center">
                <p className="text-white font-bold">{item.name}</p>
                <p className="text-[#5DDBD3] font-black">{item.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── INTERACTIVE MAP ──────────────────────────────────────────

function InteractiveMap() {
  const [activeSpot, setActiveSpot] = useState<number | null>(null)
  const active = SPOTS.find((s) => s.id === activeSpot)

  return (
    <section className="py-24 bg-[#0D0D0D]" id="map">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-[#5DDBD3] text-xs font-bold tracking-[0.3em] uppercase mb-2">Fishing Spots</p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <h2
            className="text-4xl sm:text-5xl font-black text-white"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            Where Axel Fishes.
          </h2>
          <p className="text-white/35 text-sm">Tap a pin for the inside scoop.</p>
        </div>

        <div
          className="relative rounded-3xl overflow-hidden border border-white/[0.06]"
          style={{ height: 480 }}
        >
          <img
            src="https://images.unsplash.com/photo-1495171081156-cc1209ddf6a0?w=1400&h=800&fit=crop&auto=format"
            alt="Aerial ocean view"
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#061020]/60 to-[#0D0D0D]/85" />

          {/* Grid overlay for map feel */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "linear-gradient(rgba(93,219,211,1) 1px, transparent 1px), linear-gradient(90deg, rgba(93,219,211,1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {SPOTS.map((spot) => (
            <button
              key={spot.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              onClick={() => setActiveSpot(spot.id === activeSpot ? null : spot.id)}
            >
              {/* Pulse ring */}
              {activeSpot === spot.id && (
                <span className="absolute inset-0 rounded-full bg-[#FF6B35]/30 animate-ping" />
              )}
              <div
                className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
                  activeSpot === spot.id
                    ? "bg-[#FF6B35] scale-125 shadow-[0_0_20px_rgba(255,107,53,0.5)]"
                    : "bg-[#5DDBD3] group-hover:scale-110 shadow-[0_0_12px_rgba(93,219,211,0.4)]"
                }`}
              >
                <MapPin className="w-4 h-4 text-black fill-black/20" />
              </div>
              <span className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 bg-black/85 text-white text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {spot.name}
              </span>
            </button>
          ))}

          {/* Active spot tooltip */}
          {active && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-5 left-5 right-5 sm:right-auto sm:w-76 bg-[#1A1A1A]/95 backdrop-blur-md rounded-2xl p-5 border border-[#5DDBD3]/30 shadow-2xl"
              style={{ width: "min(calc(100% - 40px), 320px)" }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3
                  className="text-white font-black text-lg"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  {active.name}
                </h3>
                <button
                  onClick={() => setActiveSpot(null)}
                  className="text-white/35 hover:text-white transition-colors ml-3 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[#5DDBD3] text-xs font-bold mb-1">{active.species}</p>
              <p className="text-white/35 text-xs mb-2.5">Best: {active.best}</p>
              <p className="text-white/65 text-sm leading-relaxed">{active.note}</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── NEWSLETTER ───────────────────────────────────────────────

function Newsletter() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <section className="py-20 bg-[#5DDBD3]">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="text-5xl mb-5">🎣</div>
        <h2
          className="text-4xl sm:text-5xl font-black text-black mb-4"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          Get My Next Catch Report First.
        </h2>
        <p className="text-black/65 text-lg mb-9 leading-relaxed">
          Weekly dispatches from the water — spots, setups, and stories you won't find on the feed.
        </p>
        {submitted ? (
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-black/12 rounded-2xl p-7"
          >
            <p className="text-black font-black text-2xl" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              You're in! 🎉
            </p>
            <p className="text-black/60 text-sm mt-2">First report drops soon — check your inbox.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 bg-black/12 text-black placeholder-black/45 font-medium px-5 py-4 rounded-full border border-black/15 focus:outline-none focus:border-black/40 focus:bg-black/18 transition-all"
            />
            <button
              type="submit"
              className="bg-black text-white font-black px-7 py-4 rounded-full hover:bg-[#0D0D0D] transition-all hover:scale-105 active:scale-95 shadow-[0_6px_24px_rgba(0,0,0,0.2)] whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

// ─── SPONSORS ─────────────────────────────────────────────────

function Sponsors() {
  return (
    <section className="py-14 bg-[#0D0D0D] border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-white/20 text-[11px] font-bold tracking-[0.35em] uppercase mb-8">
          Brand Partnerships
        </p>
        <div className="flex flex-wrap gap-x-10 gap-y-5 justify-center items-center">
          {SPONSORS.map((s) => (
            <span
              key={s}
              className="text-white/18 hover:text-white/55 transition-colors duration-250 font-black text-xl tracking-widest cursor-pointer"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────

function Footer() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  return (
    <footer className="bg-[#080808] pt-20 pb-10 border-t border-white/[0.05]" id="contact">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={axseaLogo} alt="Axsea" className="w-11 h-11 rounded-full" />
              <span
                className="text-white font-black text-2xl tracking-[0.15em]"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                AXSEA
              </span>
            </div>
            <p className="text-white/35 text-sm leading-relaxed mb-7">
              Axel Béchard — fisherman, content creator, and firm believer that the best days end with salt in your hair and a cooler that barely closes.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <Instagram className="w-5 h-5" />, color: "hover:bg-[#E1306C]", label: "Instagram" },
                { icon: <Youtube className="w-5 h-5" />, color: "hover:bg-red-600", label: "YouTube" },
                { icon: <MessageCircle className="w-5 h-5" />, color: "hover:bg-green-600", label: "WhatsApp" },
                { icon: <span className="text-xs font-black">TK</span>, color: "hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500", label: "TikTok" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className={`w-10 h-10 rounded-full bg-white/8 flex items-center justify-center text-white/50 hover:text-white ${s.color} transition-all duration-250`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-white font-bold mb-5 text-sm tracking-wider">Quick Links</p>
            <ul className="space-y-3">
              {["Home", "About Me", "My Setups", "Courses", "Catch Log", "Shop", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(" ", "-")}`}
                    className="text-white/35 text-sm hover:text-[#5DDBD3] transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact form */}
          <div>
            <p className="text-white font-bold mb-5 text-sm tracking-wider">Send a Message</p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-white/[0.05] text-white placeholder-white/25 px-4 py-3 rounded-xl border border-white/[0.08] focus:outline-none focus:border-[#5DDBD3]/50 text-sm transition-colors"
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Brand partnership, collab, or just want to say hey?"
                rows={4}
                className="w-full bg-white/[0.05] text-white placeholder-white/25 px-4 py-3 rounded-xl border border-white/[0.08] focus:outline-none focus:border-[#5DDBD3]/50 text-sm resize-none transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-[#FF6B35] hover:bg-[#ff7a47] text-white font-black py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Send It
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/[0.05] pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/20 text-xs">© 2025 Axsea · Axel Béchard. All rights reserved.</p>
          <p className="text-white/20 text-xs">Built with salt, Wi-Fi, and too much coffee.</p>
        </div>
      </div>
    </footer>
  )
}

// ─── APP ──────────────────────────────────────────────────────

export default function App() {
  const [showIntro, setShowIntro] = useState(true)

  return (
    <div className="bg-[#0D0D0D] min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}

      <div>
        <Navbar />
        <Hero />
        <SocialProofBar />
        <FeaturedVideos />
        <CatchLog />
        <AboutMe />
        <MySetups />
        <Courses />
        <ShopTeaser />
        <InteractiveMap />
        <Newsletter />
        <Sponsors />
        <Footer />
      </div>
    </div>
  )
}
