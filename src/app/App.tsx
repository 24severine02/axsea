import { useState, useEffect } from "react"
import { motion } from "motion/react"
import {
  Menu, X, Play, MapPin, Instagram, Youtube,
  ArrowRight, Anchor, ShoppingBag, BookOpen, Award,
  MessageCircle, ExternalLink, CheckCircle,
} from "lucide-react"
import axseaLogo from "@/imports/channels4_profile.jpg"
import { imageUrl } from "@/lib/sanity/client"
import { fetchSiteContent } from "@/lib/sanity/queries"
import type {
  SiteContent,
  Hero as HeroData,
  AboutMe as AboutMeData,
  SocialProof,
  MapSection,
  ShopSettings,
  SiteSettings,
  YouTubeVideo,
  CatchLogEntry,
  GearItem,
  Course,
  FishingSpot,
  Sponsor,
  Product,
  CreateOrderRequest,
  CreateOrderResponse,
  OrderStatusResponse,
} from "@/lib/sanity/types"

// ─── DATA ─────────────────────────────────────────────────────
// Section anchors are structural, not content — they map 1:1 to the
// components below, so they stay hardcoded rather than living in Sanity.

const NAV_LINKS = ["Home", "About Me", "My Setups", "Sessions", "Contact"]

function formatViews(n?: number) {
  if (!n) return ""
  return `${new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n)} views`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

// ─── INTRO ANIMATION ──────────────────────────────────────────

function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 700)
    const t2 = setTimeout(() => setPhase(2), 1350)
    const t3 = setTimeout(() => setPhase(3), 2050)
    const t4 = setTimeout(() => onComplete(), 2600)
    return () => [t1, t2, t3, t4].forEach(clearTimeout)
    // Runs once on mount — must not restart when a parent re-render gives
    // `onComplete` a new identity (e.g. content loading, or a modal opening).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

function Navbar({ siteSettings }: { siteSettings: SiteSettings | null }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const logoSrc = siteSettings?.logo ? imageUrl(siteSettings.logo, 72, 72) : axseaLogo

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
              src={logoSrc}
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
          href="#sessions"
          className="hidden md:inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-[#ff7a47] text-white font-bold text-sm px-5 py-2.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(255,107,53,0.35)]"
        >
          Learn from Axel <ArrowRight className="w-4 h-4" />
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
            href="#sessions"
            className="mt-6 inline-flex items-center gap-2 bg-[#FF6B35] text-white font-bold px-6 py-3 rounded-full"
            onClick={() => setMenuOpen(false)}
          >
            Learn from Axel <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      )}
    </motion.nav>
  )
}

// ─── HERO ─────────────────────────────────────────────────────

function Hero({ hero }: { hero: HeroData }) {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img
        src={imageUrl(hero.backgroundImage, 1800, 1100)}
        alt="Silhouette fishing at sunset"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-[#0D0D0D]" />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20">
        {hero.eyebrow && (
          <motion.span
            className="inline-block text-[#5DDBD3] text-xs font-bold tracking-[0.35em] uppercase mb-5 px-4 py-1.5 border border-[#5DDBD3]/40 rounded-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {hero.eyebrow}
          </motion.span>
        )}

        <motion.h1
          className="text-[3.5rem] sm:text-[5rem] lg:text-[6.5rem] font-black text-white leading-[0.95] mb-6"
          style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700 }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.7 }}
        >
          {hero.headingLine1}
          <br />
          <span className="text-[#5DDBD3]">{hero.headingLine2}</span>
        </motion.h1>

        <motion.p
          className="text-white/65 text-lg sm:text-xl max-w-lg mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.58, duration: 0.6 }}
        >
          {hero.subtext}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72, duration: 0.5 }}
        >
          {hero.primaryButton && (
            <a
              href={hero.primaryButton.href}
              className="group flex items-center justify-center gap-3 bg-white text-black font-bold px-8 py-4 rounded-full hover:bg-[#5DDBD3] transition-all duration-250 hover:scale-105 active:scale-95 text-base shadow-[0_8px_30px_rgba(255,255,255,0.15)]"
            >
              <span className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center group-hover:bg-black/15 transition-colors">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </span>
              {hero.primaryButton.label}
            </a>
          )}
          {hero.secondaryButton && (
            <a
              href={hero.secondaryButton.href}
              className="flex items-center justify-center gap-2 border-2 border-white/35 text-white font-bold px-8 py-4 rounded-full hover:border-[#5DDBD3] hover:text-[#5DDBD3] transition-all duration-250 text-base"
            >
              {hero.secondaryButton.label}
            </a>
          )}
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

function SocialProofBar({ socialProof }: { socialProof: SocialProof | null }) {
  if (!socialProof) return null

  const stats = [
    { label: "YouTube", value: socialProof.youtubeCount, icon: <Youtube className="w-4 h-4" /> },
    { label: "Instagram", value: socialProof.instagramCount, icon: <Instagram className="w-4 h-4" /> },
    { label: "TikTok", value: socialProof.tiktokCount, icon: <span className="text-xs font-black">TK</span> },
    { label: "Years Fishing", value: socialProof.yearsFishing, icon: <Anchor className="w-4 h-4" /> },
    { label: "Students", value: socialProof.studentsCount, icon: <BookOpen className="w-4 h-4" /> },
    { label: "Biggest Catch", value: socialProof.biggestCatch, icon: <Award className="w-4 h-4" /> },
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

function FeaturedVideos({ videos, channelUrl }: { videos: YouTubeVideo[]; channelUrl?: string }) {
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
          {channelUrl && (
            <a href={channelUrl} target="_blank" rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-[#5DDBD3] font-bold text-sm hover:gap-2.5 transition-all duration-200">
              All videos <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((v, i) => (
            <motion.a
              key={v.videoId}
              href={v.url}
              target="_blank"
              rel="noreferrer"
              className="group relative rounded-2xl overflow-hidden bg-[#1A1A1A] cursor-pointer block"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative h-48 bg-[#252525] overflow-hidden">
                <img
                  src={v.thumbnail}
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
                <span className="absolute top-2 left-2 text-[11px] font-black px-2.5 py-1 rounded-full bg-red-600 text-white">
                  YouTube
                </span>
              </div>
              <div className="p-4">
                <p className="text-white font-semibold text-sm leading-snug line-clamp-2 mb-2">{v.title}</p>
                <p className="text-white/35 text-xs">{formatViews(v.views)}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CATCH LOG ────────────────────────────────────────────────

function CatchLog({ entries }: { entries: CatchLogEntry[] }) {
  const [filter, setFilter] = useState("All")
  const speciesFilters = ["All", ...Array.from(new Set(entries.map((c) => c.species)))]
  const filtered = filter === "All" ? entries : entries.filter((c) => c.species === filter)

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
          {speciesFilters.map((s) => (
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
              key={c._id}
              className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/[0.05] hover:border-[#5DDBD3]/30 transition-colors group"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="relative h-52 bg-[#252525] overflow-hidden">
                <img
                  src={imageUrl(c.photo, 600, 400)}
                  alt={c.species}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <span className="text-white font-black text-xl leading-tight" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                    {c.species}
                  </span>
                  <span className="bg-[#5DDBD3] text-black text-xs font-black px-2.5 py-1 rounded-full shrink-0 ml-2">
                    {c.weight} {c.weightUnit}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 text-white/35 text-xs mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {c.location}
                  </span>
                  <span>{formatDate(c.date)}</span>
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

function AboutMe({ aboutMe }: { aboutMe: AboutMeData | null }) {
  if (!aboutMe) return null
  const timeline = aboutMe.timeline ?? []

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
                src={imageUrl(aboutMe.photo, 800, 1000)}
                alt="Axel Béchard fishing offshore"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating PB card */}
            {aboutMe.personalBestValue && (
              <div className="absolute -bottom-5 -right-5 bg-[#5DDBD3] rounded-2xl p-5 shadow-2xl hidden sm:block">
                <p className="text-black font-black text-3xl" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  {aboutMe.personalBestValue}
                </p>
                <p className="text-black/65 text-sm font-semibold">{aboutMe.personalBestLabel}</p>
              </div>
            )}
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
              {aboutMe.headingLine1}
              <br />
              <span className="text-[#5DDBD3]">{aboutMe.headingLine2}</span>
            </h2>
            {(aboutMe.bioParagraphs ?? []).map((p, i) => (
              <p key={i} className={`text-white/65 leading-relaxed ${i === (aboutMe.bioParagraphs?.length ?? 1) - 1 ? "mb-9" : "mb-4"}`}>
                {p}
              </p>
            ))}

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

function MySetups({ gear }: { gear: GearItem[] }) {
  const categories = Array.from(new Set(gear.map((g) => g.category)))
  const [activeCategory, setActiveCategory] = useState(categories[0])
  const activeItems = gear.filter((g) => g.category === (activeCategory ?? categories[0]))

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
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                  activeCategory === category
                    ? "bg-[#5DDBD3] text-black"
                    : "bg-[#1e1e1e] text-white/55 border border-white/10 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {activeItems.map((item, i) => (
            <motion.div
              key={item._id}
              className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/[0.05] group hover:border-[#5DDBD3]/40 transition-all duration-250"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4 }}
            >
              <div className="h-44 bg-[#252525] overflow-hidden">
                <img
                  src={imageUrl(item.image, 400, 300)}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <span className="text-[#5DDBD3] text-[11px] font-black tracking-wider uppercase">{item.type}</span>
                <h3 className="text-white font-bold text-base mt-1 mb-2 leading-snug">{item.name}</h3>
                <p className="text-white/45 text-sm leading-snug mb-3">{item.description}</p>
                {item.shopLink && (
                  <a href={item.shopLink} className="flex items-center gap-1 text-[#FF6B35] text-sm font-bold hover:gap-2 transition-all duration-150">
                    Shop link <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── COURSES ──────────────────────────────────────────────────

function Sessions({ courses, whatsappLink }: { courses: Course[]; whatsappLink?: string }) {
  return (
    <section className="py-24 bg-[#0D0D0D]" id="sessions">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[#5DDBD3] text-xs font-bold tracking-[0.3em] uppercase mb-3">Sessions</p>
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

        {/* Session cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course, i) => {
            const enrollHref = whatsappLink
              ? `${whatsappLink}?text=${encodeURIComponent(`Hi Axel, I'd like to book the ${course.name} session.`)}`
              : undefined
            return (
              <motion.div
                key={course._id}
                className={`relative rounded-3xl p-7 border transition-all duration-250 hover:-translate-y-1 flex flex-col ${
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
                {course.skillLevel && (
                  <span
                    className={`text-[11px] font-bold tracking-widest uppercase ${course.popular ? "text-white/70" : "text-[#5DDBD3]"}`}
                  >
                    {course.skillLevel}
                  </span>
                )}
                <h3
                  className="text-2xl font-black text-white mt-1 mb-2"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  {course.name}
                </h3>
                {course.tagline && (
                  <p className={`text-sm leading-relaxed mb-4 ${course.popular ? "text-white/80" : "text-white/50"}`}>
                    {course.tagline}
                  </p>
                )}
                <p
                  className="text-4xl font-black text-white mb-6"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  {formatMUR(course.price)}
                </p>
                <dl className={`space-y-2.5 mb-8 flex-1 ${course.popular ? "text-white/90" : "text-white/60"}`}>
                  {(course.details ?? []).map((d) => (
                    <div key={d.label} className="text-sm leading-snug">
                      <dt className={`font-bold ${course.popular ? "text-white" : "text-[#5DDBD3]"}`}>{d.label}</dt>
                      <dd>{d.value}</dd>
                    </div>
                  ))}
                </dl>
                <a
                  href={enrollHref}
                  target="_blank"
                  rel="noreferrer"
                  aria-disabled={!enrollHref}
                  className={`block text-center w-full py-4 rounded-full font-black text-sm transition-all hover:scale-[1.03] active:scale-[0.97] ${
                    course.popular ? "bg-white text-[#FF6B35]" : "bg-[#FF6B35] text-white shadow-[0_4px_20px_rgba(255,107,53,0.3)]"
                  } ${!enrollHref ? "opacity-40 pointer-events-none" : ""}`}
                >
                  Enroll Now
                </a>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── SHOP TEASER ──────────────────────────────────────────────

function ShopTeaser({ products, onOpenShop }: { products: Product[]; onOpenShop: () => void }) {
  const featured = products.filter((p) => p.featured).slice(0, 3)
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
          <button
            onClick={onOpenShop}
            className="flex items-center gap-2 text-[#FF6B35] font-bold text-sm hover:gap-3 transition-all duration-200"
          >
            Visit the shop <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {featured.map((item, i) => (
            <motion.div
              key={item._id}
              className="group rounded-2xl overflow-hidden bg-[#1A1A1A] cursor-pointer border border-white/[0.05] hover:border-[#5DDBD3]/30 transition-colors"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              onClick={onOpenShop}
            >
              <div className="h-56 bg-[#222] overflow-hidden">
                <img
                  src={imageUrl(item.image, 400, 400)}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 flex justify-between items-center">
                <p className="text-white font-bold">{item.name}</p>
                <p className="text-[#5DDBD3] font-black">{formatMUR(item.price)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── INTERACTIVE MAP ──────────────────────────────────────────

function InteractiveMap({ mapSection, spots }: { mapSection: MapSection | null; spots: FishingSpot[] }) {
  const [activeSpot, setActiveSpot] = useState<string | null>(null)
  const active = spots.find((s) => s._id === activeSpot)

  if (!mapSection) return null

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
          <p className="text-white/35 text-sm">{mapSection.hintText}</p>
        </div>

        <div
          className="relative rounded-3xl overflow-hidden border border-white/[0.06]"
          style={{ height: 480 }}
        >
          <img
            src={imageUrl(mapSection.backgroundImage, 1400, 800)}
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

          {spots.map((spot) => (
            <button
              key={spot._id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              onClick={() => setActiveSpot(spot._id === activeSpot ? null : spot._id)}
            >
              {/* Pulse ring */}
              {activeSpot === spot._id && (
                <span className="absolute inset-0 rounded-full bg-[#FF6B35]/30 animate-ping" />
              )}
              <div
                className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
                  activeSpot === spot._id
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
              <p className="text-white/35 text-xs mb-2.5">Best: {active.bestSeason}</p>
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

function Sponsors({ sponsors }: { sponsors: Sponsor[] }) {
  return (
    <section className="py-14 bg-[#0D0D0D] border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-white/20 text-[11px] font-bold tracking-[0.35em] uppercase mb-8">
          Brand Partnerships
        </p>
        <div className="flex flex-wrap gap-x-10 gap-y-5 justify-center items-center">
          {sponsors.map((s) =>
            s.logo ? (
              <img
                key={s._id}
                src={imageUrl(s.logo, 140, 48)}
                alt={s.name}
                className="h-8 w-auto opacity-30 hover:opacity-70 transition-opacity duration-250 grayscale"
              />
            ) : (
              <span
                key={s._id}
                className="text-white/18 hover:text-white/55 transition-colors duration-250 font-black text-xl tracking-widest cursor-pointer"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                {s.name}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────

function Footer({ siteSettings }: { siteSettings: SiteSettings | null }) {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const logoSrc = siteSettings?.logo ? imageUrl(siteSettings.logo, 88, 88) : axseaLogo
  const social = siteSettings?.socialLinks

  return (
    <footer className="bg-[#080808] pt-20 pb-10 border-t border-white/[0.05]" id="contact">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logoSrc} alt="Axsea" className="w-11 h-11 rounded-full" />
              <span
                className="text-white font-black text-2xl tracking-[0.15em]"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                AXSEA
              </span>
            </div>
            <p className="text-white/35 text-sm leading-relaxed mb-7">{siteSettings?.footerBio}</p>
            <div className="flex gap-3">
              {[
                { icon: <Instagram className="w-5 h-5" />, color: "hover:bg-[#E1306C]", label: "Instagram", href: social?.instagram },
                { icon: <Youtube className="w-5 h-5" />, color: "hover:bg-red-600", label: "YouTube", href: social?.youtube },
                { icon: <MessageCircle className="w-5 h-5" />, color: "hover:bg-green-600", label: "WhatsApp", href: social?.whatsapp },
                { icon: <span className="text-xs font-black">TK</span>, color: "hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500", label: "TikTok", href: social?.tiktok },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href || "#"}
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
              {["Home", "About Me", "My Setups", "Sessions", "Catch Log", "Shop", "Contact"].map((link) => (
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
          <p className="text-white/20 text-xs">{siteSettings?.copyrightLine}</p>
          <p className="text-white/20 text-xs">{siteSettings?.footerTagline}</p>
        </div>
      </div>
    </footer>
  )
}

// ─── SHOP DATA & TYPES ────────────────────────────────────────

type CartItem = {
  id: string
  productId: string
  name: string
  price: number
  size?: string
  color?: string
  quantity: number
  img: string
}

type CheckoutInfo = {
  customerName: string
  customerEmail: string
  customerPhone?: string
  address?: string
}

function formatMUR(n: number) { return `MUR ${n.toLocaleString()}` }

// ─── QR CODE SVG ──────────────────────────────────────────────

function QRCodeDisplay({ seed, size = 180 }: { seed: string; size?: number }) {
  const N = 21
  const cell = size / N

  const seededBit = (r: number, c: number): boolean => {
    let s = r * N + c + 7
    for (let k = 0; k < seed.length; k++) s = (s * 31 + seed.charCodeAt(k)) & 0x7fffffff
    s = ((s ^ (s >>> 16)) * 0x45d9f3b) & 0x7fffffff
    s = ((s ^ (s >>> 16)) * 0x45d9f3b) & 0x7fffffff
    return ((s ^ (s >>> 16)) & 0x7fffffff) % 10 > 3
  }

  const isFinderZone = (r: number, c: number) =>
    (r < 8 && c < 8) || (r < 8 && c >= N - 8) || (r >= N - 8 && c < 8)
  const isTiming = (r: number, c: number) => r === 6 || c === 6

  const finderRects: { r: number; c: number }[] = []
  const addFinder = (r0: number, c0: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const edge = r === 0 || r === 6 || c === 0 || c === 6
        const inner = r >= 2 && r <= 4 && c >= 2 && c <= 4
        if (edge || inner) finderRects.push({ r: r0 + r, c: c0 + c })
      }
    }
  }
  addFinder(0, 0); addFinder(0, N - 7); addFinder(N - 7, 0)

  const dataRects: { r: number; c: number }[] = []
  const timingRects: { r: number; c: number }[] = []
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (!isFinderZone(r, c) && !isTiming(r, c) && seededBit(r, c)) dataRects.push({ r, c })
      if (isTiming(r, c) && !isFinderZone(r, c) && (r + c) % 2 === 0) timingRects.push({ r, c })
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" />
      {finderRects.map(({ r, c }) => (
        <rect key={`f${r}${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="#0D0D0D" />
      ))}
      {timingRects.map(({ r, c }) => (
        <rect key={`t${r}${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="#0D0D0D" />
      ))}
      {dataRects.map(({ r, c }) => (
        <rect key={`d${r}${c}`} x={c * cell + 0.5} y={r * cell + 0.5} width={cell - 1} height={cell - 1} fill="#0D0D0D" />
      ))}
    </svg>
  )
}

// ─── FISHING LINE STEPPER ─────────────────────────────────────

function FishingLineStepper({ steps, current }: { steps: string[]; current: number }) {
  const W = 300
  const nodeX = (i: number) => 20 + (i / (steps.length - 1)) * (W - 40)
  const Y = 28

  return (
    <div className="w-full max-w-xs mx-auto">
      <svg width="100%" viewBox={`0 0 ${W} 60`} preserveAspectRatio="xMidYMid meet">
        {steps.slice(0, -1).map((_, i) => {
          const x1 = nodeX(i) + 14
          const x2 = nodeX(i + 1) - 14
          const done = i < current
          return (
            <path
              key={i}
              d={`M ${x1} ${Y} Q ${(x1 + x2) / 2} ${done ? Y - 7 : Y + 5} ${x2} ${Y}`}
              stroke={done ? "#5DDBD3" : "rgba(255,255,255,0.14)"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={done ? "none" : "4 4"}
              fill="none"
            />
          )
        })}
        {steps.map((_, i) => {
          const x = nodeX(i)
          const done = i < current
          const active = i === current
          return (
            <g key={i}>
              <circle
                cx={x} cy={Y} r={13}
                fill={done ? "#5DDBD3" : active ? "#0D0D0D" : "#1A1A1A"}
                stroke={done ? "#5DDBD3" : active ? "#5DDBD3" : "rgba(255,255,255,0.14)"}
                strokeWidth="2"
              />
              {done && <text x={x} y={Y + 4} textAnchor="middle" fontSize="11" fill="#0D0D0D" fontWeight="bold">✓</text>}
              {active && (
                <motion.g
                  animate={{ translateY: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  <text x={x} y={Y + 5} textAnchor="middle" fontSize="13">🪝</text>
                </motion.g>
              )}
              {!done && !active && <circle cx={x} cy={Y} r={4} fill="rgba(255,255,255,0.18)" />}
            </g>
          )
        })}
      </svg>
      <div className="flex justify-between px-0">
        {steps.map((step, i) => (
          <span
            key={step}
            className={`text-[11px] font-bold text-center leading-tight ${i <= current ? "text-[#5DDBD3]" : "text-white/25"}`}
            style={{ width: `${100 / steps.length}%` }}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── SCREEN 1: PRODUCTS ───────────────────────────────────────

function ProductsScreen({
  products, onAddToCart, cartCount, onViewCart,
}: {
  products: Product[]
  onAddToCart: (item: CartItem) => void
  cartCount: number
  onViewCart: () => void
}) {
  const [selected, setSelected] = useState<Product | null>(null)
  const [selSize, setSelSize] = useState("")
  const [selColor, setSelColor] = useState("")
  const [justAdded, setJustAdded] = useState<string | null>(null)

  const open = (p: Product) => {
    if (p.stock === "out-of-stock") return
    setSelected(p); setSelSize(p.sizes?.[0] ?? ""); setSelColor(p.colors?.[0]?.name ?? "")
  }

  const addToCart = () => {
    if (!selected) return
    onAddToCart({
      id: `${selected._id}-${selSize}-${selColor}-${Date.now()}`,
      productId: selected._id, name: selected.name, price: selected.price,
      size: selSize || undefined, color: selColor || undefined,
      quantity: 1, img: imageUrl(selected.image, 200, 200),
    })
    setJustAdded(selected._id)
    setTimeout(() => { setJustAdded(null); setSelected(null) }, 900)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] shrink-0">
        <div>
          <p className="text-[#5DDBD3] text-[10px] font-black tracking-[0.3em] uppercase">The Axsea Store</p>
          <h2 className="text-xl font-black text-white leading-tight" style={{ fontFamily: "'Fredoka', sans-serif" }}>Shop the Brand</h2>
        </div>
        <button
          onClick={onViewCart}
          className="relative flex items-center gap-2 bg-[#1A1A1A] border border-white/[0.08] px-4 py-2 rounded-full text-white font-bold text-sm hover:border-[#5DDBD3]/40 transition-colors"
        >
          <ShoppingBag className="w-4 h-4" /> Cart
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#FF6B35] text-white text-[9px] font-black flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {products.map((p) => (
            <motion.div
              key={p._id}
              className={`rounded-2xl overflow-hidden bg-[#1A1A1A] border transition-all ${
                p.stock === "out-of-stock"
                  ? "border-white/[0.04] opacity-50 cursor-not-allowed"
                  : "border-white/[0.06] hover:border-[#5DDBD3]/40 cursor-pointer"
              }`}
              whileHover={p.stock !== "out-of-stock" ? { y: -3 } : {}}
              onClick={() => open(p)}
            >
              <div className="relative h-36 bg-[#252525] overflow-hidden">
                <img src={imageUrl(p.image, 300, 300)} alt={p.name} className="w-full h-full object-cover" />
                {p.stock !== "in-stock" && (
                  <span className={`absolute top-2 left-2 text-[10px] font-black px-2 py-0.5 rounded-full ${p.stock === "out-of-stock" ? "bg-white/20 text-white/60" : "bg-[#F59E0B] text-black"}`}>
                    {p.stock === "out-of-stock" ? "Sold Out" : `${p.stockCount} left!`}
                  </span>
                )}
                {justAdded === p._id && (
                  <motion.div className="absolute inset-0 flex items-center justify-center bg-[#5DDBD3]/90" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <CheckCircle className="w-9 h-9 text-black" />
                  </motion.div>
                )}
              </div>
              <div className="p-3">
                <p className="text-white font-semibold text-sm leading-snug">{p.name}</p>
                <p className="text-[#5DDBD3] font-black text-sm mt-0.5">{formatMUR(p.price)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Variant drawer */}
      {selected && (
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-20 p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => setSelected(null)}
        >
          <motion.div
            className="bg-[#1A1A1A] rounded-3xl w-full max-w-sm p-5 border border-white/[0.1]"
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-4 mb-5">
              <div className="w-18 h-18 rounded-xl overflow-hidden bg-[#252525] shrink-0" style={{ width: 72, height: 72 }}>
                <img src={imageUrl(selected.image, 144, 144)} alt={selected.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-white font-bold text-base leading-snug">{selected.name}</p>
                <p className="text-[#5DDBD3] font-black text-xl mt-0.5">{formatMUR(selected.price)}</p>
                {selected.stock === "low-stock" && (
                  <p className="text-[#F59E0B] text-xs font-bold mt-1">Only {selected.stockCount} left!</p>
                )}
              </div>
            </div>

            {(selected.sizes?.length ?? 0) > 0 && (
              <div className="mb-4">
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {selected.sizes!.map((s) => (
                    <button key={s} onClick={() => setSelSize(s)}
                      className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${selSize === s ? "bg-[#5DDBD3] text-black" : "bg-[#252525] text-white/55 border border-white/10 hover:text-white"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(selected.colors?.length ?? 0) > 0 && (
              <div className="mb-5">
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">
                  Colour — <span className="text-white/70 normal-case font-semibold">{selColor}</span>
                </p>
                <div className="flex gap-2.5">
                  {selected.colors!.map((c) => (
                    <button key={c.name} onClick={() => setSelColor(c.name)}
                      className={`w-8 h-8 rounded-full transition-all ${selColor === c.name ? "ring-2 ring-[#5DDBD3] ring-offset-2 ring-offset-[#1A1A1A]" : ""}`}
                      style={{ background: c.hex, border: "1px solid rgba(255,255,255,0.18)" }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            <button onClick={addToCart}
              className="w-full bg-[#FF6B35] text-white font-black py-3.5 rounded-full hover:bg-[#ff7a47] transition-all hover:scale-[1.02] active:scale-[0.97]">
              Add to Cart — {formatMUR(selected.price)}
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

// ─── SCREEN 2: CART ───────────────────────────────────────────

function CartScreen({
  cart, deliveryFee, onUpdateQty, onRemove, onCheckout, onBack,
}: {
  cart: CartItem[]
  deliveryFee: number
  onUpdateQty: (id: string, qty: number) => void
  onRemove: (id: string) => void
  onCheckout: (method: "pickup" | "delivery", info: CheckoutInfo) => void
  onBack: () => void
}) {
  const [delivery, setDelivery] = useState<"pickup" | "delivery">("pickup")
  const [address, setAddress] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  const total = subtotal + (delivery === "delivery" ? deliveryFee : 0)
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)
  const blockReason =
    cart.length === 0 ? null
    : customerName.trim() === "" ? "Enter your name to continue."
    : !emailValid ? "Enter a valid email to continue."
    : delivery === "delivery" && !address.trim() ? "Enter a delivery address to continue."
    : null
  const canCheckout = blockReason === null && cart.length > 0

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.08] shrink-0">
        <button onClick={onBack} className="text-white/40 hover:text-white transition-colors">
          <ArrowRight className="w-5 h-5 rotate-180" />
        </button>
        <div>
          <p className="text-[#5DDBD3] text-[10px] font-black tracking-[0.3em] uppercase">Order Summary</p>
          <p className="text-white/35 text-xs">Draft order</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.length === 0 && (
          <div className="text-center py-16 text-white/35">
            <p className="text-5xl mb-3">🎣</p>
            <p className="font-medium">Emptier than the bait bucket.</p>
          </div>
        )}
        {cart.map((item) => (
          <div key={item.id} className="flex gap-3 bg-[#1A1A1A] rounded-2xl p-3 border border-white/[0.05]">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#252525] shrink-0">
              <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-tight">{item.name}</p>
              <p className="text-white/35 text-xs mt-0.5">{[item.size, item.color].filter(Boolean).join(" · ")}</p>
              <p className="text-[#5DDBD3] font-black text-sm mt-1">{formatMUR(item.price)}</p>
            </div>
            <div className="flex flex-col items-end justify-between">
              <button onClick={() => onRemove(item.id)} className="text-white/20 hover:text-red-400 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-1.5">
                <button onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                  className="w-6 h-6 rounded-lg bg-[#252525] text-white text-sm font-bold flex items-center justify-center hover:bg-[#5DDBD3] hover:text-black transition-all">−</button>
                <span className="text-white font-bold text-sm w-4 text-center">{item.quantity}</span>
                <button onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                  className="w-6 h-6 rounded-lg bg-[#252525] text-white text-sm font-bold flex items-center justify-center hover:bg-[#5DDBD3] hover:text-black transition-all">+</button>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-white/[0.05]">
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-3">Your Details</p>
          <div className="space-y-2.5">
            <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Full name"
              className="w-full bg-[#252525] text-white placeholder-white/25 px-4 py-2.5 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-[#5DDBD3]/50" />
            <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-[#252525] text-white placeholder-white/25 px-4 py-2.5 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-[#5DDBD3]/50" />
            <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Phone (optional)"
              className="w-full bg-[#252525] text-white placeholder-white/25 px-4 py-2.5 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-[#5DDBD3]/50" />
          </div>
        </div>

        <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-white/[0.05]">
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-3">Delivery Method</p>
          <div className="flex gap-2 mb-3">
            {(["pickup", "delivery"] as const).map((m) => (
              <button key={m} onClick={() => setDelivery(m)}
                className={`flex-1 py-2.5 rounded-full font-bold text-sm transition-all ${delivery === m ? "bg-[#5DDBD3] text-black" : "bg-[#252525] text-white/45 border border-white/10"}`}>
                {m === "pickup" ? "🪝 Pickup" : `🛥️ Delivery +${deliveryFee}`}
              </button>
            ))}
          </div>
          {delivery === "delivery" && (
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
              placeholder="Delivery address"
              className="w-full bg-[#252525] text-white placeholder-white/25 px-4 py-2.5 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-[#5DDBD3]/50" />
          )}
        </div>
      </div>

      <div className="p-4 border-t border-white/[0.08] bg-[#0D0D0D]/60 shrink-0">
        <div className="space-y-1 mb-3">
          <div className="flex justify-between text-sm"><span className="text-white/40">Subtotal</span><span className="text-white">{formatMUR(subtotal)}</span></div>
          {delivery === "delivery" && <div className="flex justify-between text-sm"><span className="text-white/40">Delivery</span><span className="text-white">{formatMUR(deliveryFee)}</span></div>}
          <div className="flex justify-between pt-2 border-t border-white/[0.08]">
            <span className="text-white font-bold">Total</span>
            <span className="text-[#5DDBD3] font-black text-xl">{formatMUR(total)}</span>
          </div>
        </div>
        {blockReason && <p className="text-white/35 text-xs text-center mb-2">{blockReason}</p>}
        <button
          onClick={() => canCheckout && onCheckout(delivery, {
            customerName: customerName.trim(),
            customerEmail: customerEmail.trim(),
            customerPhone: customerPhone.trim() || undefined,
            address: delivery === "delivery" ? address.trim() : undefined,
          })}
          disabled={!canCheckout}
          className="w-full bg-[#FF6B35] text-white font-black py-4 rounded-full hover:bg-[#ff7a47] transition-all hover:scale-[1.02] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Proceed to Payment →
        </button>
      </div>
    </div>
  )
}

// ─── SCREEN 3: PAYMENT ────────────────────────────────────────

function PaymentScreen({
  cart, deliveryMethod, checkoutInfo, total, shopSettings, onConfirm, onBack,
}: {
  cart: CartItem[]
  deliveryMethod: "pickup" | "delivery"
  checkoutInfo: CheckoutInfo
  total: number
  shopSettings: ShopSettings | null
  onConfirm: (orderRef: string) => void
  onBack: () => void
}) {
  const [showInput, setShowInput] = useState(false)
  const [payRef, setPayRef] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reeled, setReeled] = useState(false)
  const [qrSeed] = useState(() => Math.random().toString(36).slice(2))

  useEffect(() => { const t = setTimeout(() => setReeled(true), 250); return () => clearTimeout(t) }, [])

  const confirm = async () => {
    if (!payRef.trim() || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const body: CreateOrderRequest = {
        items: cart.map((i) => ({ productId: i.productId, quantity: i.quantity, size: i.size, color: i.color })),
        customerName: checkoutInfo.customerName,
        customerEmail: checkoutInfo.customerEmail,
        customerPhone: checkoutInfo.customerPhone,
        deliveryMethod,
        deliveryAddress: checkoutInfo.address,
        paymentReference: payRef.trim(),
      }
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Couldn't save your order — please try again.")
        setSubmitting(false)
        return
      }
      onConfirm((data as CreateOrderResponse).orderRef)
    } catch {
      setError("Couldn't reach the server — check your connection and try again.")
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.08] shrink-0">
        <button onClick={onBack} className="text-white/40 hover:text-white transition-colors">
          <ArrowRight className="w-5 h-5 rotate-180" />
        </button>
        <div>
          <p className="text-[#5DDBD3] text-[10px] font-black tracking-[0.3em] uppercase">{shopSettings?.paymentAppName ?? "Payment"}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 flex flex-col items-center">
        {/* Hook + QR card animation */}
        <div className="relative flex flex-col items-center mb-5 mt-1">
          {/* Fishing line + hook reeling in */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: reeled ? 0 : -50, opacity: reeled ? 1 : 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 130, delay: 0.05 }}
          >
            <div className="w-[2px] h-7 rounded-full" style={{ background: "rgba(93,219,211,0.4)" }} />
            <motion.svg width="16" height="20" viewBox="0 0 16 20" fill="none"
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            >
              <path d="M8 0 L8 13 Q8 19 14 19" stroke="#5DDBD3" strokeWidth="2" strokeLinecap="round" fill="none" />
              <circle cx="14" cy="19" r="2.5" fill="#5DDBD3" />
            </motion.svg>
          </motion.div>

          {/* QR card — reeled up like a caught fish */}
          <motion.div
            className="rounded-3xl overflow-hidden shadow-[0_16px_60px_rgba(0,0,0,0.55)] mt-0.5"
            style={{ background: "#5DDBD3" }}
            initial={{ y: 50, opacity: 0, scale: 0.88 }}
            animate={{ y: reeled ? 0 : 50, opacity: reeled ? 1 : 0, scale: reeled ? 1 : 0.88 }}
            transition={{ type: "spring", damping: 17, stiffness: 150, delay: 0.15 }}
          >
            <div className="p-5">
              <div className="bg-white rounded-2xl p-2.5 flex items-center justify-center">
                {shopSettings?.paymentQrCode ? (
                  <img src={imageUrl(shopSettings.paymentQrCode, 170, 170)} alt="Payment QR code" width={170} height={170} />
                ) : (
                  <QRCodeDisplay seed={qrSeed} size={170} />
                )}
              </div>
              <div className="mt-4 text-center">
                <p className="text-black/55 text-[10px] font-black tracking-[0.25em] uppercase">Scan with</p>
                <p className="text-black font-black text-xl leading-tight" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  {shopSettings?.paymentAppName ?? "Payment App"}
                </p>
                <p className="text-black/60 text-xs mt-0.5">to pay</p>
                <p className="text-black font-black text-3xl mt-1" style={{ fontFamily: "'Fredoka', sans-serif" }}>{formatMUR(total)}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Instructions + CTA */}
        <div className="w-full max-w-xs text-center">
          <p className="text-white/35 text-xs leading-relaxed mb-5">
            {shopSettings?.paymentInstructions} Order held for {shopSettings?.orderHoldMinutes ?? 15} minutes.
          </p>

          {!showInput ? (
            <button
              onClick={() => setShowInput(true)}
              className="w-full bg-[#FF6B35] text-white font-black py-4 rounded-full hover:bg-[#ff7a47] transition-all hover:scale-[1.02] active:scale-[0.97] shadow-[0_6px_24px_rgba(255,107,53,0.35)]"
            >
              {"I've Paid — Confirm Order ✓"}
            </button>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <p className="text-white/50 text-sm">Enter your {shopSettings?.paymentAppName ?? "payment app"} transaction ref:</p>
              <input
                type="text"
                value={payRef}
                onChange={(e) => setPayRef(e.target.value.toUpperCase())}
                placeholder="JUIC-20250614-XXXX"
                autoFocus
                className="w-full bg-[#1A1A1A] text-white placeholder-white/25 px-4 py-3 rounded-xl border border-white/[0.1] focus:outline-none focus:border-[#5DDBD3]/60 font-mono text-sm text-center"
              />
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button
                onClick={confirm}
                disabled={!payRef.trim() || submitting}
                className="w-full bg-[#FF6B35] text-white font-black py-3.5 rounded-full transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? "Confirming…" : "Confirm Order →"}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── SCREEN 4: ORDER STATUS ───────────────────────────────────

const STATUS_MAP = {
  pending: { step: 0, label: "Pending", emoji: "⏳", desc: "Payment received and being verified. Hang tight!" },
  confirmed: { step: 1, label: "Confirmed", emoji: "🪝", desc: "Hooked! Your order is packed and ready to ship." },
  shipped: { step: 2, label: "Shipped / Ready", emoji: "🐟", desc: "Your order is on its way — or ready for pickup at our spot!" },
} as const

function OrderStatusScreen({ initialRef }: { initialRef?: string }) {
  const [lookupRef, setLookupRef] = useState(initialRef ?? "")
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<OrderStatusResponse | null>(null)
  const info = order ? STATUS_MAP[order.status] : null

  const search = async (ref: string) => {
    if (!ref.trim()) return
    setSearched(true)
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/orders/status?ref=${encodeURIComponent(ref.trim().toUpperCase())}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Couldn't find that order.")
        setOrder(null)
        return
      }
      setOrder(data as OrderStatusResponse)
    } catch {
      setError("Couldn't reach the server — check your connection and try again.")
      setOrder(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (initialRef) search(initialRef) }, [initialRef])

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-white/[0.08] shrink-0">
        <p className="text-[#5DDBD3] text-[10px] font-black tracking-[0.3em] uppercase mb-0.5">Track Your Order</p>
        <h2 className="text-xl font-black text-white" style={{ fontFamily: "'Fredoka', sans-serif" }}>Reel It In. 🎣</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex gap-2 mb-7">
          <input
            type="text"
            value={lookupRef}
            onChange={(e) => setLookupRef(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && search(lookupRef)}
            placeholder="AXSEA-XXXXXX"
            className="flex-1 bg-[#1A1A1A] text-white placeholder-white/25 px-4 py-3 rounded-xl border border-white/[0.1] focus:outline-none focus:border-[#5DDBD3]/60 font-mono text-sm"
          />
          <button onClick={() => search(lookupRef)}
            className="bg-[#5DDBD3] text-black font-black px-5 rounded-xl hover:bg-[#4FCCC4] transition-all">
            Go
          </button>
        </div>

        {!searched && (
          <div className="text-center py-10">
            <motion.div className="text-5xl mb-3" animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>🎣</motion.div>
            <p className="text-white/30 text-sm">Enter your order ref above to see where your catch is.</p>
          </div>
        )}

        {searched && loading && (
          <div className="text-center py-10">
            <p className="text-white/30 text-sm">Reeling it in…</p>
          </div>
        )}

        {searched && !loading && error && (
          <div className="text-center py-10">
            <p className="text-4xl mb-3">🪱</p>
            <p className="text-white/40 text-sm">{error}</p>
          </div>
        )}

        {searched && !loading && !error && order && info && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", damping: 22 }}>
            <div className="mb-7">
              <FishingLineStepper steps={["Pending", "Confirmed", "Shipped"]} current={info.step} />
            </div>

            {/* Status card */}
            <div className="rounded-2xl p-4 border mb-4" style={{ background: "#5DDBD318", borderColor: "#5DDBD340" }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#5DDBD325] flex items-center justify-center text-xl shrink-0">{info.emoji}</div>
                <div>
                  <p className="font-black text-white text-lg leading-tight" style={{ fontFamily: "'Fredoka', sans-serif" }}>{info.label}</p>
                  <p className="text-white/55 text-sm mt-1 leading-relaxed">{info.desc}</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-white/[0.06] space-y-2.5 mb-6">
              {[
                ["Order Ref", order.orderRef],
                ["Placed", new Date(order.placedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })],
                ["Method", order.deliveryMethod === "delivery" ? "🛥️ Delivery" : "🪝 Pickup"],
                ["Total", formatMUR(order.total)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-white/35">{k}</span>
                  <span className="text-white font-medium font-mono">{v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// ─── SHOP OVERLAY ─────────────────────────────────────────────

function ShopOverlay({
  products, shopSettings, onClose,
}: {
  products: Product[]
  shopSettings: ShopSettings | null
  onClose: () => void
}) {
  const [screen, setScreen] = useState<"products" | "cart" | "payment" | "status">("products")
  const [cart, setCart] = useState<CartItem[]>([])
  const [orderRef, setOrderRef] = useState<string | null>(null)
  const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfo>({ customerName: "", customerEmail: "" })

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup")
  const deliveryFee = shopSettings?.deliveryFee ?? 0
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0) + (deliveryMethod === "delivery" ? deliveryFee : 0)

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.productId === item.productId && i.size === item.size && i.color === item.color)
      return ex ? prev.map((i) => i.id === ex.id ? { ...i, quantity: i.quantity + 1 } : i) : [...prev, item]
    })
  }

  const TABS = [
    { key: "products" as const, label: "Shop", icon: "🛍️" },
    { key: "cart" as const, label: "Cart", icon: "🪣" },
    { key: "payment" as const, label: "Pay", icon: "📲" },
    { key: "status" as const, label: "Track", icon: "🐟" },
  ]

  return (
    <motion.div
      className="fixed inset-0 z-[150] flex items-center justify-center p-0 sm:p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />

      <motion.div
        className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-md bg-[#0D0D0D] sm:rounded-3xl border border-white/[0.08] shadow-[0_40px_120px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
        initial={{ scale: 0.92, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 230 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose}
          className="absolute top-3.5 right-4 z-30 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-all">
          <X className="w-4 h-4" />
        </button>

        {/* Screen */}
        <div className="flex-1 overflow-hidden relative min-h-0">
          {screen === "products" && (
            <ProductsScreen products={products} onAddToCart={addToCart} cartCount={cartCount} onViewCart={() => setScreen("cart")} />
          )}
          {screen === "cart" && (
            <CartScreen
              cart={cart} deliveryFee={deliveryFee}
              onUpdateQty={(id, qty) => qty <= 0 ? setCart((p) => p.filter((i) => i.id !== id)) : setCart((p) => p.map((i) => i.id === id ? { ...i, quantity: qty } : i))}
              onRemove={(id) => setCart((p) => p.filter((i) => i.id !== id))}
              onCheckout={(m, info) => { setDeliveryMethod(m); setCheckoutInfo(info); setScreen("payment") }}
              onBack={() => setScreen("products")}
            />
          )}
          {screen === "payment" && (
            <PaymentScreen
              cart={cart} deliveryMethod={deliveryMethod} checkoutInfo={checkoutInfo}
              total={total} shopSettings={shopSettings}
              onConfirm={(ref) => { setOrderRef(ref); setScreen("status") }}
              onBack={() => setScreen("cart")}
            />
          )}
          {screen === "status" && (
            <OrderStatusScreen initialRef={orderRef ?? undefined} />
          )}
        </div>

        {/* Tab bar */}
        <div className="border-t border-white/[0.08] bg-[#080808] flex shrink-0">
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => setScreen(tab.key)}
              className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-all text-xs font-bold relative ${screen === tab.key ? "text-[#5DDBD3]" : "text-white/25 hover:text-white/50"}`}>
              <span className="text-base leading-none">{tab.icon}</span>
              {tab.label}
              {tab.key === "cart" && cartCount > 0 && (
                <span className="absolute top-2 right-[calc(50%-18px)] w-4 h-4 rounded-full bg-[#FF6B35] text-white text-[9px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── APP ──────────────────────────────────────────────────────

export default function App() {
  const [introComplete, setIntroComplete] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const [content, setContent] = useState<SiteContent | null>(null)
  const [videos, setVideos] = useState<YouTubeVideo[] | null>(null)

  useEffect(() => {
    fetchSiteContent().then(setContent).catch(console.error)
    fetch("/api/videos").then((r) => r.json()).then(setVideos).catch(console.error)
  }, [])

  return (
    <div className="bg-[#0D0D0D] min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <IntroAnimation onComplete={() => setIntroComplete(true)} />

      {content && (
        <motion.div
          animate={{ opacity: introComplete ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <Navbar siteSettings={content.siteSettings} />
          {content.hero && <Hero hero={content.hero} />}
          <SocialProofBar socialProof={content.socialProof} />
          {videos && videos.length > 0 && (
            <FeaturedVideos videos={videos} channelUrl={content.siteSettings?.socialLinks?.youtube} />
          )}
          <CatchLog entries={content.catchLog} />
          <AboutMe aboutMe={content.aboutMe} />
          <MySetups gear={content.gear} />
          <Sessions courses={content.courses} whatsappLink={content.siteSettings?.socialLinks?.whatsapp} />
          <ShopTeaser products={content.products} onOpenShop={() => setShopOpen(true)} />
          <InteractiveMap mapSection={content.mapSection} spots={content.spots} />
          <Newsletter />
          <Sponsors sponsors={content.sponsors} />
          <Footer siteSettings={content.siteSettings} />
        </motion.div>
      )}

      {shopOpen && content && (
        <ShopOverlay products={content.products} shopSettings={content.shopSettings} onClose={() => setShopOpen(false)} />
      )}
    </div>
  )
}
