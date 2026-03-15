"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ReturnPortalButton from "./ReturnPortalButton"

interface ConstructSectionProps {
  onReturn: () => void
}

/* ─── tiny matrix rain on a <canvas> ─── */
function MiniMatrixRain({ tint }: { tint?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null)

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

    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF"
    const fontSize = 13
    const cols = Math.floor(c.width / fontSize) || 1
    const drops: number[] = Array.from({ length: cols }, () => Math.random() * -50)

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.06)"
      ctx.fillRect(0, 0, c.width, c.height)
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        // head character (brighter)
        ctx.fillStyle = "#00ff41"
        ctx.fillText(ch, x, y)

        // trail character
        if (drops[i] > 1) {
          ctx.fillStyle = "rgba(0,255,65,0.3)"
          ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y - fontSize)
        }

        if (y > c.height && Math.random() > 0.975) drops[i] = 0
        drops[i] += 0.4 + Math.random() * 0.4
      }
    }

    const id = setInterval(draw, 38)
    return () => {
      clearInterval(id)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.5 }}
    />
  )
}

/* ─── sparking matrix chars along the divider ─── */
function DividerSparks() {
  const chars = "01アウカシツネ"
  const sparks = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    char: chars[Math.floor(Math.random() * chars.length)],
    top: `${5 + Math.random() * 90}%`,
    left: `${-8 + Math.random() * 16}px`,
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
          style={{
            top: s.top,
            left: s.left,
            color: "#00ff41",
            fontFamily: "monospace",
            textShadow: "0 0 6px #00ff41",
          }}
          initial={{ opacity: 0, y: 0, x: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [0, s.dx * 0.5],
            x: [0, s.dx],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            repeatDelay: 1 + Math.random() * 3,
          }}
        >
          {s.char}
        </motion.span>
      ))}
    </>
  )
}

/* ─── 3D-looking pill built in pure CSS ─── */
function Pill({ color, glowColor }: { color: string; glowColor: string }) {
  const scrollChars = "アイウエオカキクケコ01サシスセソ"

  return (
    <motion.div
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="relative mx-auto"
      style={{ width: 130, height: 54 }}
    >
      {/* pill body */}
      <div
        className="absolute inset-0 rounded-[50px] overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${color}dd, ${color}88, ${color}44)`,
          boxShadow: `
            0 0 20px ${glowColor},
            0 0 40px ${glowColor}88,
            inset 0 -4px 8px rgba(0,0,0,0.5),
            inset 0 4px 8px rgba(255,255,255,0.15)
          `,
        }}
      >
        {/* scrolling matrix chars on pill surface */}
        <motion.div
          className="absolute inset-0 flex flex-wrap items-center justify-center gap-[2px] text-[8px] leading-[10px] overflow-hidden"
          style={{
            color: "#00ff41",
            fontFamily: "monospace",
            opacity: 0.55,
            textShadow: "0 0 3px #00ff41",
          }}
          animate={{ y: [0, -40] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 120 }, (_, i) => (
            <span key={i}>
              {scrollChars[Math.floor(Math.random() * scrollChars.length)]}
            </span>
          ))}
        </motion.div>

        {/* specular highlight */}
        <div
          className="absolute top-0 left-[10%] w-[80%] h-[40%] rounded-b-full"
          style={{
            background: "linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)",
          }}
        />
      </div>

      {/* breathing glow */}
      <motion.div
        className="absolute inset-0 rounded-[50px]"
        animate={{
          boxShadow: [
            `0 0 15px ${glowColor}88, 0 0 30px ${glowColor}44`,
            `0 0 30px ${glowColor}bb, 0 0 60px ${glowColor}66`,
            `0 0 15px ${glowColor}88, 0 0 30px ${glowColor}44`,
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  )
}

/* ─── terminal card that slides up ─── */
function TerminalCard({
  label,
  accentColor,
}: {
  label: string
  accentColor: string
}) {
  return (
    <motion.div
      className="px-5 py-3 font-mono text-sm tracking-widest text-center select-none"
      style={{
        border: "1px solid #00ff41",
        background: "rgba(0, 10, 0, 0.75)",
        color: "#00ff41",
        fontFamily: "'Share Tech Mono', 'Orbitron', monospace",
        boxShadow: `inset 0 0 18px ${accentColor}40`,
        backdropFilter: "blur(4px)",
      }}
    >
      [ {label} ]
    </motion.div>
  )
}

/* ─── one half of the split ─── */
function HalfSide({
  side,
  pillColor,
  pillGlow,
  tintColor,
  trackLabel,
  cards,
  accentColor,
}: {
  side: "left" | "right"
  pillColor: string
  pillGlow: string
  tintColor: string
  trackLabel: string
  cards: string[]
  accentColor: string
}) {
  const [hovered, setHovered] = useState(false)

  const cardContainerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 260, damping: 22 },
    },
  }

  return (
    <div
      className="relative flex-1 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#000" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* matrix rain canvas */}
      <MiniMatrixRain />

      {/* tint overlay on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[2]"
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ background: tintColor }}
      />

      {/* content */}
      <div className="relative z-[5] flex flex-col items-center gap-5">
        {/* pill */}
        <motion.div
          animate={
            hovered
              ? { x: [-3, 3, -2, 2, 0], transition: { duration: 0.35 } }
              : {}
          }
        >
          <Pill color={pillColor} glowColor={pillGlow} />
        </motion.div>

        {/* track label */}
        <p
          className="text-sm tracking-[0.3em] mt-2"
          style={{
            color: "#00ff41",
            fontFamily: "'Orbitron', monospace",
            textShadow: "0 0 8px rgba(0,255,65,0.4)",
          }}
        >
          {">"} {trackLabel}
        </p>

        {/* hover-revealed cards */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="flex flex-col gap-3 mt-3"
              variants={cardContainerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {cards.map((c) => (
                <motion.div key={c} variants={cardVariants}>
                  <TerminalCard label={c} accentColor={accentColor} />
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
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "#000" }}
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-30"
        style={{
          backgroundImage: "linear-gradient(to bottom, transparent 50%, #00ff41 50%)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* ─── heading ─── */}
      <div className="relative z-20 text-center pt-10 pb-2">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-2xl sm:text-4xl md:text-6xl tracking-widest mb-3"
          style={{
            fontFamily: "Glitch, sans-serif",
            letterSpacing: "clamp(4px, 1.5vw, 10px)",
            color: "#7dffb2",
            textShadow: "0 0 10px rgba(0,230,118,0.4)",
          }}
        >
          THE CONSTRUCT
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div
            className="h-px w-48 mx-auto mb-3"
            style={{ background: "linear-gradient(to right, transparent, #00e676, transparent)" }}
          />
          <p
            className="font-mono text-xs sm:text-sm tracking-[0.25em]"
            style={{ color: "rgba(159,230,184,0.5)" }}
          >
            EXPLORE DOMAINS
          </p>
        </motion.div>
      </div>

      {/* ─── split screen ─── */}
      <div className="relative z-20 flex-1 flex flex-col md:flex-row">
        {/* left half – blue pill */}
        <HalfSide
          side="left"
          pillColor="#0060cc"
          pillGlow="#0080ff"
          tintColor="rgba(0, 128, 255, 0.07)"
          trackLabel="JUNIOR_TRACK"
          cards={["WEB_DEVELOPMENT", "DATA_SCIENCE"]}
          accentColor="#0080ff"
        />

        {/* ─── glowing center divider ─── */}
        <div className="relative z-30 flex items-center justify-center md:w-[3px] w-full md:h-auto h-[3px]">
          {/* main glow line */}
          <div
            className="md:w-[2px] md:h-full w-full h-[2px]"
            style={{
              background: "#00ff41",
              boxShadow:
                "0 0 8px #00ff41, 0 0 20px #00ff4188, 0 0 40px #00ff4144",
            }}
          />

          {/* "CHOOSE YOUR REALITY" label */}
          <div
            className="absolute top-4 md:top-8 left-1/2 -translate-x-1/2 whitespace-nowrap z-40"
          >
            <p
              className="text-[10px] sm:text-xs tracking-[0.35em]"
              style={{
                fontFamily: "'Orbitron', monospace",
                color: "#00ff41",
                textShadow: "0 0 10px #00ff41, 0 0 20px #00ff4188",
              }}
            >
              CHOOSE YOUR REALITY
            </p>
          </div>

          {/* sparking characters */}
          <div className="absolute inset-0 hidden md:block">
            <DividerSparks />
          </div>
        </div>

        {/* right half – red pill */}
        <HalfSide
          side="right"
          pillColor="#cc2020"
          pillGlow="#ff2020"
          tintColor="rgba(255, 32, 32, 0.07)"
          trackLabel="SENIOR_TRACK"
          cards={["BLOCKCHAIN", "AI_/_ML"]}
          accentColor="#ff2020"
        />
      </div>

      {/* return button */}
      <ReturnPortalButton onReturn={onReturn} />
    </motion.section>
  )
}
