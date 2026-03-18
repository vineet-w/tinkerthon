"use client"

import { motion } from "framer-motion"

interface QuoteTransitionProps {
  quote: string
}

export default function QuoteTransition({ quote }: QuoteTransitionProps) {
  return (
    <motion.div
      key={quote}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative h-screen flex items-center justify-center px-4 sm:px-8 overflow-hidden z-30"
      style={{ background: "#020403" }}
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(to bottom, transparent 50%, #00e676 50%)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Quote content */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative text-center max-w-2xl px-2"
      >
        {/* Decorative line above */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-24 h-px mx-auto mb-4 sm:mb-8"
          style={{ background: "rgba(0,230,118,0.4)" }}
        />

        <p
          className="text-base sm:text-xl md:text-2xl leading-relaxed italic"
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            lineHeight: "1.7",
            letterSpacing: "0.05em",
            color: "#9fe6b8",
            textShadow: "0 0 20px rgba(0,230,118,0.15)",
          }}
        >
          &ldquo;{quote}&rdquo;
        </p>

        {/* Decorative line below */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="w-24 h-px mx-auto mt-8"
          style={{ background: "rgba(0,230,118,0.4)" }}
        />

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 font-mono text-xs tracking-[0.4em]"
          style={{ color: "rgba(125,255,178,0.35)" }}
        >
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ENTERING SYSTEM...
          </motion.span>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
