"use client"

import { motion } from "framer-motion"
import ReturnPortalButton from "./ReturnPortalButton"

interface PlaceholderSectionProps {
  title: string
  subtitle: string
  onReturn: () => void
}

export default function PlaceholderSection({ title, subtitle, onReturn }: PlaceholderSectionProps) {
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

      <div className="relative z-20 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-2xl sm:text-4xl md:text-6xl tracking-widest mb-4"
          style={{
            fontFamily: "Glitch, sans-serif",
            letterSpacing: "clamp(4px, 1.5vw, 10px)",
            color: "#7dffb2",
            textShadow: "0 0 10px rgba(0,230,118,0.4)",
          }}
        >
          {title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div
            className="h-px w-48 mx-auto mb-8"
            style={{ background: "linear-gradient(to right, transparent, #00e676, transparent)" }}
          />
          <p
            className="font-mono text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.25em] mb-2"
            style={{ color: "rgba(159,230,184,0.5)" }}
          >
            {subtitle}
          </p>

          {/* Terminal-style "coming soon" */}
          <div
            className="mt-6 sm:mt-10 rounded-md inline-block px-4 sm:px-8 py-4 sm:py-6"
            style={{
              border: "1px solid rgba(0,230,118,0.2)",
              background: "rgba(0, 10, 0, 0.6)",
            }}
          >
            <div
              className="font-mono text-xs mb-3"
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                color: "rgba(159,230,184,0.4)",
              }}
            >
              $ access --section {title.toLowerCase().replace(/\s+/g, "_")}
            </div>
            <div
              className="font-mono text-sm sm:text-lg tracking-wider"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              <span style={{ color: "rgba(159,230,184,0.6)" }}>[STATUS]</span>{" "}
              <span style={{ color: "#7dffb2" }}>SECTION UNDER CONSTRUCTION</span>
            </div>
            <motion.div
              animate={{ opacity: [0.3, 0.85, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-4 font-mono text-sm"
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                color: "rgba(125,255,178,0.55)",
              }}
            >
              AWAITING DATA FEED...█
            </motion.div>
          </div>
        </motion.div>
      </div>

      <ReturnPortalButton onReturn={onReturn} />
    </motion.section>
  )
}
