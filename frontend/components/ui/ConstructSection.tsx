"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import ReturnPortalButton from "./ReturnPortalButton"

const MatrixParasite = dynamic(() => import("./MatrixParasite"), { ssr: false })

interface ConstructSectionProps {
  onReturn: () => void
}

const MAX_HITS = 3

/* ── Color palette ────────────────────────────────────────────────
   alive  = blood-red theme
   dead   = Matrix green theme
   ─────────────────────────────────────────────────────────────── */
const THEME = {
  alive: {
    primary:   "#ff1a1a",   // bright red
    dim:       "#8b0000",   // dark red
    glow:      "rgba(255,26,26,0.55)",
    rain:      { head: "#ff1a1a", trail: "rgba(200,0,0,0.25)" },
    scanline:  "#ff1a1a",
    divider:   "#cc0000",
    divShadow: "0 0 8px #cc0000, 0 0 20px #cc000088, 0 0 40px #cc000044",
    hud:       { border: "rgba(255,26,26,0.35)", bg: "rgba(10, 0, 0, 0.82)" },
    heading:   "#ff7070",
    subtext:   "rgba(255,100,100,0.5)",
    label:     "#ff3333",
    labelGlow: "0 0 8px rgba(255,50,50,0.5)",
    dotOff:    "#cc0000",
  },
  dead: {
    primary:   "#00ff41",
    dim:       "#00e676",
    glow:      "rgba(0,255,65,0.55)",
    rain:      { head: "#00ff41", trail: "rgba(0,255,65,0.25)" },
    scanline:  "#00ff41",
    divider:   "#00ff41",
    divShadow: "0 0 8px #00ff41, 0 0 20px #00ff4188, 0 0 40px #00ff4144",
    hud:       { border: "rgba(0,255,65,0.3)", bg: "rgba(0, 10, 0, 0.8)" },
    heading:   "#7dffb2",
    subtext:   "rgba(159,230,184,0.5)",
    label:     "#00ff41",
    labelGlow: "0 0 8px rgba(0,255,65,0.4)",
    dotOff:    "#00ff41",
  },
}

/* ─── full-screen binary rain background ─── */
function BinaryRain({ alive }: { alive: boolean }) {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const aliveRef = useRef(alive)

  useEffect(() => { aliveRef.current = alive }, [alive])

  useEffect(() => {
    const c = ref.current
    if (!c) return
    const ctx = c.getContext("2d")
    if (!ctx) return

    const resize = () => {
      c.width = c.offsetWidth
      c.height = c.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const chars = "01"
    const fontSize = 14
    let cols = Math.floor(c.width / fontSize) || 1
    let drops: number[] = Array.from({ length: cols }, () => Math.random() * -80)

    const onResize = () => {
      resize()
      cols = Math.floor(c.width / fontSize) || 1
      drops = Array.from({ length: cols }, () => Math.random() * -80)
    }
    window.addEventListener("resize", onResize)

    const draw = () => {
      const pal = aliveRef.current ? THEME.alive.rain : THEME.dead.rain
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, c.width, c.height)
      ctx.font = `${fontSize}px "Courier New", monospace`

      for (let i = 0; i < drops.length; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        ctx.fillStyle = pal.head
        ctx.fillText(ch, x, y)

        if (drops[i] > 1) {
          ctx.fillStyle = pal.trail
          ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y - fontSize)
        }

        if (y > c.height && Math.random() > 0.975) drops[i] = 0
        drops[i] += 0.4 + Math.random() * 0.5
      }
    }

    const id = setInterval(draw, 33)
    return () => {
      clearInterval(id)
      window.removeEventListener("resize", resize)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full z-0"
      style={{ opacity: 0.55 }}
    />
  )
}

/* ─── sparking divider chars ─── */
function DividerSparks({ color }: { color: string }) {
  const chars = "010110100101"
  const sparks = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    char: chars[Math.floor(Math.random() * chars.length)],
    top: `${5 + Math.random() * 90}%`,
    left: `${-10 + Math.random() * 20}px`,
    delay: Math.random() * 4,
    duration: 1.2 + Math.random() * 1.5,
    dx: (Math.random() - 0.5) * 30,
  }))

  return (
    <>
      {sparks.map((s) => (
        <motion.span
          key={s.id}
          className="absolute text-[10px] pointer-events-none select-none"
          style={{ top: s.top, left: s.left, color, fontFamily: "monospace", textShadow: `0 0 6px ${color}` }}
          initial={{ opacity: 0, y: 0, x: 0 }}
          animate={{ opacity: [0, 1, 1, 0], y: [0, s.dx * 0.5], x: [0, s.dx] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, repeatDelay: 1 + Math.random() * 3 }}
        >
          {s.char}
        </motion.span>
      ))}
    </>
  )
}

/* ─── clean 3D pill ─── */
function Pill({ color, glowColor }: { color: string; glowColor: string }) {
  return (
    <motion.div
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="relative mx-auto"
      style={{ width: 130, height: 54 }}
    >
      <div
        className="absolute inset-0 rounded-[50px] overflow-hidden"
        style={{
          background: `linear-gradient(145deg, ${color}ee, ${color}99, ${color}55)`,
          boxShadow: `0 0 20px ${glowColor}, 0 0 40px ${glowColor}88, inset 0 -5px 10px rgba(0,0,0,0.5), inset 0 5px 10px rgba(255,255,255,0.18)`,
        }}
      >
        <div className="absolute top-0 left-[10%] w-[80%] h-[45%] rounded-b-full"
          style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)" }} />
      </div>
      <motion.div
        className="absolute inset-0 rounded-[50px]"
        animate={{ boxShadow: [
          `0 0 15px ${glowColor}88, 0 0 30px ${glowColor}44`,
          `0 0 35px ${glowColor}bb, 0 0 70px ${glowColor}66`,
          `0 0 15px ${glowColor}88, 0 0 30px ${glowColor}44`,
        ]}}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  )
}

function getDomainSlug(label: string) {
  if (label === "WEB_DEVELOPMENT") return "web-development"
  if (label === "DATA_SCIENCE") return "data-science"
  if (label === "BLOCKCHAIN") return "blockchain"
  if (label === "AI_/_ML") return "ai-ml"
  return ""
}

/* ─── terminal card ─── */
function TerminalCard({ label, borderColor, accentColor }: { label: string; borderColor: string; accentColor: string }) {
  const slug = getDomainSlug(label)
  return (
    <Link href={`/domains/${slug}`} className="block">
      <motion.div
        className="px-5 py-3 font-mono text-sm tracking-widest text-center select-none cursor-pointer"
        style={{
          border: `1px solid ${borderColor}`,
          background: "rgba(0, 10, 0, 0.75)",
          color: borderColor,
          fontFamily: "'Share Tech Mono', 'Orbitron', monospace",
          boxShadow: `inset 0 0 18px ${accentColor}40`,
          backdropFilter: "blur(4px)",
        }}
        whileHover={{ scale: 1.05, boxShadow: `inset 0 0 30px ${accentColor}80` }}
        whileTap={{ scale: 0.95 }}
      >
        [ {label} ]
      </motion.div>
    </Link>
  )
}

/* ─── pill column ─── */
function PillColumn({
  pillColor, pillGlow, tintColor, trackLabel, cards, accentColor, unlocked, theme,
}: {
  pillColor: string; pillGlow: string; tintColor: string; trackLabel: string
  cards: string[]; accentColor: string; unlocked: boolean; theme: typeof THEME.alive
}) {
  const [hovered, setHovered] = useState(false)

  const cardContainerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 260, damping: 22 } },
  }

  return (
    <div
      className="relative flex flex-col items-center py-3 md:py-6 my-2 md:my-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ minWidth: "220px", cursor: unlocked ? "pointer" : "default" }}
    >
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none z-[1]"
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ background: tintColor }}
      />

      <div className="relative z-[5] flex flex-col items-center gap-4">
        <motion.div animate={hovered ? { x: [-3, 3, -2, 2, 0], transition: { duration: 0.35 } } : {}}>
          <Pill color={pillColor} glowColor={pillGlow} />
        </motion.div>

        <p className="text-xs sm:text-sm tracking-[0.3em]"
          style={{ color: theme.label, fontFamily: "'Orbitron', monospace", textShadow: theme.labelGlow }}>
          {">"} {trackLabel}
        </p>

        {!unlocked && (
          <p className="text-[10px] tracking-[0.2em] mt-1"
            style={{ color: theme.primary, fontFamily: "'Share Tech Mono', monospace", opacity: 0.7 }}>
            [LOCKED]
          </p>
        )}

        <AnimatePresence>
          {unlocked && hovered && (
            <motion.div className="flex flex-col gap-3 mt-1" variants={cardContainerVariants} initial="hidden" animate="visible" exit="hidden">
              {cards.map((c) => (
                <motion.div key={c} variants={cardVariants}>
                  <TerminalCard label={c} borderColor={theme.label} accentColor={accentColor} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ═══════════════════════ MAIN COMPONENT ═══════════════════════ */
export default function ConstructSection({ onReturn }: ConstructSectionProps) {
  const [hitCount, setHitCount] = useState(0)
  const [parasiteDead, setParasiteDead] = useState(false)
  const [flashHit, setFlashHit] = useState(false)
  const [missText, setMissText] = useState(false)

  const theme = parasiteDead ? THEME.dead : THEME.alive

  const handleParasiteDead = useCallback(() => {
    setParasiteDead(true)
  }, [])

  const handleScreenClick = useCallback((mouseX: number, mouseY: number) => {
    if (parasiteDead) return
    const parasitePos = (window as any).__parasitePos as { x: number; y: number } | undefined
    if (!parasitePos) return

    const screenX = (parasitePos.x / 4.3 + 0.5) * window.innerWidth
    const screenY = (-parasitePos.y / 4.3 + 0.5) * window.innerHeight
    const dist = Math.sqrt((mouseX - screenX) ** 2 + (mouseY - screenY) ** 2)

    if (dist < 120) {
      setHitCount((prev) => prev + 1)
      setFlashHit(true)
      setTimeout(() => setFlashHit(false), 300)
    } else {
      setMissText(true)
      setTimeout(() => setMissText(false), 500)
    }
  }, [parasiteDead])

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen flex flex-col overflow-y-auto overflow-x-hidden pb-12 md:pb-0"
      style={{ background: "#000" }}
    >
      {/* binary rain — color switches with theme */}
      <BinaryRain alive={!parasiteDead} />

      {/* color wash overlay — red tint when alive, fades out on kill */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[1]"
        animate={{ opacity: parasiteDead ? 0 : 1 }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
        style={{ background: "radial-gradient(ellipse at center, rgba(80,0,0,0.55) 0%, rgba(0,0,0,0) 75%)" }}
      />

      {/* 3D parasite overlay */}
      {!parasiteDead && (
        <MatrixParasite
          hitCount={hitCount}
          maxHits={MAX_HITS}
          onDead={handleParasiteDead}
          onScreenClick={handleScreenClick}
        />
      )}

      {/* hit flash */}
      <AnimatePresence>
        {flashHit && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-[50]"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ background: theme.primary }}
          />
        )}
      </AnimatePresence>

      {/* scanlines */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-30"
        animate={{ color: theme.scanline }}
        transition={{ duration: 1.5 }}
        style={{
          backgroundImage: `linear-gradient(to bottom, transparent 50%, ${theme.scanline} 50%)`,
          backgroundSize: "100% 4px",
        }}
      />

      {/* ─── heading ─── */}
      <div className="relative z-20 text-center pt-8 sm:pt-10 pb-2 flex-shrink-0">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0, color: theme.heading }}
          transition={{ duration: 0.8, color: { duration: 1.5 } }}
          className="text-2xl sm:text-4xl md:text-6xl tracking-widest mb-3"
          style={{
            fontFamily: "Glitch, sans-serif",
            letterSpacing: "clamp(4px, 1.5vw, 10px)",
            textShadow: `0 0 10px ${theme.glow}`,
          }}
        >
          THE CONSTRUCT
        </motion.h2>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
          <motion.div
            className="h-px w-48 mx-auto mb-3"
            animate={{ background: `linear-gradient(to right, transparent, ${theme.dim}, transparent)` }}
            transition={{ duration: 1.5 }}
          />
          <motion.p
            className="font-mono text-xs sm:text-sm tracking-[0.25em]"
            animate={{ color: theme.subtext }}
            transition={{ duration: 1.5 }}
          >
            EXPLORE DOMAINS
          </motion.p>
        </motion.div>
      </div>

      {/* ─── HUD: pinned bottom-center on mobile, right on desktop ─── */}
      {!parasiteDead && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 md:bottom-auto md:left-auto md:right-6 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 z-40 pointer-events-none w-full max-w-[90%] md:w-auto flex justify-center md:block">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="inline-block px-4 sm:px-6 py-2 sm:py-3 rounded whitespace-nowrap"
            style={{ background: theme.hud.bg, border: `1px solid ${theme.hud.border}` }}
          >
            <p className="text-xs tracking-[0.3em] mb-2"
              style={{ color: theme.primary, fontFamily: "'Share Tech Mono', monospace", textShadow: `0 0 6px ${theme.primary}88` }}>
              {">"} SENTINEL DETECTED — CLICK TO ATTACK
            </p>
            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: MAX_HITS }, (_, i) => (
                <div key={i} className="w-3 h-3 rounded-full border"
                  style={{
                    borderColor: i < hitCount ? "#ff2020" : theme.dotOff,
                    background: i < hitCount ? "#ff2020" : "transparent",
                    boxShadow: i < hitCount ? "0 0 8px #ff2020" : "none",
                  }} />
              ))}
              <span className="text-[10px] tracking-widest ml-2"
                style={{ color: theme.primary, fontFamily: "'Share Tech Mono', monospace" }}>
                [{hitCount}/{MAX_HITS}] DAMAGE
              </span>
            </div>
            <AnimatePresence>
              {missText && (
                <motion.p
                  initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -10 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                  className="text-[10px] tracking-widest mt-1 text-center"
                  style={{ color: "#ff4444", fontFamily: "'Share Tech Mono', monospace" }}>
                  MISS — AIM CLOSER TO THE SENTINEL
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* ─── Sentinel eliminated ─── */}
      <AnimatePresence>
        {parasiteDead && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 md:bottom-auto md:left-auto md:right-6 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 z-40 text-center w-full md:w-auto px-4">
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em]"
              style={{ color: "#00ff41", fontFamily: "'Share Tech Mono', monospace", textShadow: "0 0 10px #00ff41" }}>
              {">"} SENTINEL ELIMINATED — CHOOSE YOUR PATH
            </motion.p>
          </div>
        )}
      </AnimatePresence>

      {/* ─── unified content ─── */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center py-4 md:py-0 pb-32 md:pb-0">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, color: theme.label }}
          transition={{ delay: 0.5, duration: 0.8, color: { duration: 1.5 } }}
          className="text-[10px] sm:text-xs tracking-[0.35em] mb-4 sm:mb-8"
          style={{ fontFamily: "'Orbitron', monospace", textShadow: `0 0 10px ${theme.primary}, 0 0 20px ${theme.primary}88` }}
        >
          CHOOSE YOUR REALITY
        </motion.p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0 mt-4 sm:mt-8 md:mt-0">
          {/* blue pill */}
          <PillColumn
            pillColor="#0060cc" pillGlow="#0080ff" tintColor="rgba(0, 128, 255, 0.08)"
            trackLabel="JUNIOR_TRACK" cards={["WEB_DEVELOPMENT", "DATA_SCIENCE"]}
            accentColor="#0080ff" unlocked={parasiteDead} theme={theme}
          />

          {/* center divider */}
          <div className="relative flex items-center justify-center my-4 md:my-0 md:mx-10">
            <motion.div
              className="md:w-[2px] md:h-[280px] w-[200px] h-[2px]"
              animate={{ background: theme.divider, boxShadow: theme.divShadow }}
              transition={{ duration: 1.5 }}
            />
            <div className="absolute inset-0 hidden md:block overflow-visible">
              <DividerSparks color={theme.divider} />
            </div>
          </div>

          {/* red pill */}
          <PillColumn
            pillColor="#cc2020" pillGlow="#ff2020" tintColor="rgba(255, 32, 32, 0.08)"
            trackLabel="SENIOR_TRACK" cards={["BLOCKCHAIN", "AI_/_ML"]}
            accentColor="#ff2020" unlocked={parasiteDead} theme={theme}
          />
        </div>

        {/* PDF Download Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 md:mt-16"
        >
          <a
            href="/assets/Problem_Statements.pdf"
            download="Tinkerthon_Problem_Statements.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 transition-all duration-300 group"
            style={{
              border: `1px solid ${theme.label}`,
              color: theme.label,
              background: theme.hud.bg,
              boxShadow: `inset 0 0 20px ${theme.glow}, 0 0 10px ${theme.glow}`,
              fontFamily: "'Share Tech Mono', monospace",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `inset 0 0 30px ${theme.glow}, 0 0 20px ${theme.glow}`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `inset 0 0 20px ${theme.glow}, 0 0 10px ${theme.glow}`
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-1 transition-transform">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span className="text-xs sm:text-sm tracking-widest leading-none mt-1">VIEW DETAILED PDF</span>
          </a>
        </motion.div>
      </div>

      {/* return button — color follows theme */}
      <ReturnPortalButton onReturn={onReturn} accentColor={theme.dim} />
    </motion.section>
  )
}
