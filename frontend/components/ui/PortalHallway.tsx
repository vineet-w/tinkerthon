"use client"

import { motion } from "framer-motion"
import { PORTALS } from "@/lib/portals"
import PortalDoor from "./PortalDoor"

interface PortalHallwayProps {
  onSelect: (sectionId: string) => void
}

export default function PortalHallway({ onSelect }: PortalHallwayProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-10 overflow-y-auto overflow-x-hidden"
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

      <div className="relative z-20 w-full max-w-7xl">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-16 md:mb-20"
        >
          <h2
            className="text-xl sm:text-3xl md:text-5xl tracking-widest mb-3"
            style={{
              fontFamily: "Glitch, sans-serif",
              letterSpacing: "clamp(4px, 1.5vw, 10px)",
              color: "#7dffb2",
              textShadow: "0 0 10px rgba(0,230,118,0.4)",
            }}
          >
            CHOOSE YOUR PATH
          </h2>
          <p
            className="text-[10px] sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] font-mono"
            style={{ color: "rgba(159,230,184,0.5)" }}
          >
            SELECT A PORTAL TO ENTER THE SYSTEM
          </p>
          <div
            className="h-px w-32 mx-auto mt-4"
            style={{ background: "linear-gradient(to right, transparent, #00e676, transparent)" }}
          />
        </motion.div>

        {/* Portal grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 md:gap-12 px-2 sm:px-4 md:px-10">
          {PORTALS.map((portal, index) => (
            <PortalDoor
              key={portal.title}
              title={portal.title}
              subtitle={portal.subtitle}
              sectionId={portal.sectionId}
              quote={portal.quote}
              image={portal.image}
              href={portal.href}
              onSelect={onSelect}
              index={index}
            />
          ))}
        </div>
      </div>
    </motion.section>
  )
}