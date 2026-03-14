"use client"

import { motion } from "framer-motion"

interface ReturnPortalButtonProps {
  onReturn: () => void
  fixed?: boolean
}

export default function ReturnPortalButton({ onReturn, fixed = true }: ReturnPortalButtonProps) {
  return (
    <motion.button
      onClick={onReturn}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        z-50
        ${fixed ? "fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2" : "relative mx-auto mt-10 sm:mt-14"}
        px-4 sm:px-8 py-2 sm:py-3
        bg-black/80 backdrop-blur-sm
        font-mono text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase
        cursor-pointer
        transition-all duration-300
        group
      `}
      style={{
        border: "1px solid rgba(0,230,118,0.45)",
        color: "#7dffb2",
      }}
    >
      <span className="relative">← RETURN TO PORTAL</span>
      {/* Glow line at top */}
      <div
        className="absolute top-0 left-0 w-full h-[1px] opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: "linear-gradient(to right, transparent, #00e676, transparent)" }}
      />
    </motion.button>
  )
}
