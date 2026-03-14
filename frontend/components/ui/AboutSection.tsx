"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import ReturnPortalButton from "./ReturnPortalButton"

const TERMINAL_LINES = [
  "SYSTEM LOG: TINKERTHON INITIATIVE",
  "",
  "The Architect has prepared a challenge.",
  "",
  "Tinkerthon is the innovation playground,",
  "where students experiment, prototype, and build",
  "solutions across emerging technologies.",
  "",
  "Here, curiosity becomes code,",
  "and ideas evolve into working systems.",
  "",
  "Welcome to the system.",
]

interface AboutSectionProps {
  onReturn: () => void
}

export default function AboutSection({ onReturn }: AboutSectionProps) {
  const [visibleLines, setVisibleLines] = useState(0)

  useEffect(() => {
    setVisibleLines(0)
    let i = 0
    const interval = setInterval(() => {
      i++
      setVisibleLines(i)
      if (i >= TERMINAL_LINES.length) clearInterval(interval)
    }, 150)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-10 overflow-y-auto overflow-x-hidden"
      style={{ background: "#020403" }}
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-10"
        style={{
          backgroundImage: "linear-gradient(to bottom, transparent 50%, #00e676 50%)",
          backgroundSize: "100% 4px",
        }}
      />

      <div className="relative z-20 w-full max-w-4xl pb-16">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 sm:mb-12 text-center"
        >
          <h2
            className="text-2xl sm:text-4xl md:text-6xl tracking-widest mb-4"
            style={{
              fontFamily: "Glitch, sans-serif",
              letterSpacing: "clamp(4px, 1.5vw, 10px)",
              color: "#7dffb2",
              textShadow: "0 0 10px rgba(0,230,118,0.4)",
            }}
          >
            THE ARCHITECT
          </h2>
          <div
            className="h-px w-48 mx-auto"
            style={{ background: "linear-gradient(to right, transparent, #00e676, transparent)" }}
          />
        </motion.div>

        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="rounded-md overflow-hidden"
          style={{
            background: "rgba(0, 10, 0, 0.75)",
            border: "1px solid rgba(0,230,118,0.25)",
          }}
        >
          {/* Terminal title bar */}
          <div
            className="flex items-center gap-2 px-4 py-2"
            style={{
              borderBottom: "1px solid rgba(0,230,118,0.15)",
              background: "rgba(0,0,0,0.5)",
            }}
          >
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span
              className="ml-3 text-xs font-mono tracking-wider"
              style={{ color: "rgba(159,230,184,0.45)" }}
            >
              architect@matrix:~/system_log
            </span>
          </div>

          {/* Terminal body */}
          <div className="p-4 sm:p-6 md:p-8 text-xs sm:text-sm md:text-base leading-relaxed min-h-[200px] sm:min-h-[280px]"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          >
            <div
              className="mb-4 text-xs"
              style={{ color: "rgba(159,230,184,0.45)" }}
            >
              $ cat /var/log/tinkerthon.log
            </div>

            {TERMINAL_LINES.map((line, i) => (
              <div
                key={i}
                style={{
                  opacity: i < visibleLines ? 1 : 0,
                  transform: i < visibleLines ? "translateY(0)" : "translateY(4px)",
                  transition: "opacity 0.3s, transform 0.3s",
                }}
              >
                {i === 0 ? (
                  <span style={{ color: "#9fe6b8", fontWeight: "bold" }}>{line}</span>
                ) : line === "" ? (
                  <br />
                ) : (
                  <span style={{ color: "rgba(125,255,178,0.75)" }}>{line}</span>
                )}
              </div>
            ))}

            {/* Blinking cursor */}
            {visibleLines >= TERMINAL_LINES.length && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.85, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="inline-block mt-4"
                style={{ color: "#7dffb2" }}
              >
                █
              </motion.span>
            )}
          </div>
        </motion.div>
      </div>

      <ReturnPortalButton onReturn={onReturn} />
    </motion.section>
  )
}
