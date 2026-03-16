"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface PortalDoorProps {
  title: string
  subtitle: string
  sectionId: string
  quote: string
  image: string
  href?: string
  onSelect: (sectionId: string) => void
  index: number
}

export default function PortalDoor({ title, subtitle, sectionId, image, href, onSelect, index }: PortalDoorProps) {
  const router = useRouter()

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else {
      onSelect(sectionId)
    }
  }

  return (
    <motion.div
      onClick={handleClick}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className="relative group flex flex-col items-center cursor-pointer"
      tabIndex={0}
      role="button"
      aria-label={title}
    >

      {/* portal frame */}
      <div className="
        portal-door
        relative
        w-full
        h-28 sm:h-36 md:h-40
        rounded-md
        flex flex-col items-center justify-center gap-2
        overflow-hidden
      " style={{
        border: "1px solid rgba(0, 230, 119, 1)",
        background: "rgba(0,0,0,0.85)", // Fallback color
      }}>

        {/* Background Image */}
        {image && (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover opacity-60 mix-blend-screen"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        )}

        {/* portal energy glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: "rgba(0,230,118,0.08)" }}
        />

        {/* scanlines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.12,
            backgroundImage: "linear-gradient(to bottom, transparent 50%, #00e676 50%)",
            backgroundSize: "100% 4px",
          }}
        />

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4" style={{ borderTop: "2px solid rgba(0,230,118,0.5)", borderLeft: "2px solid rgba(0,230,118,0.5)" }} />
        <div className="absolute top-0 right-0 w-4 h-4" style={{ borderTop: "2px solid rgba(0,230,118,0.5)", borderRight: "2px solid rgba(0,230,118,0.5)" }} />
        <div className="absolute bottom-0 left-0 w-4 h-4" style={{ borderBottom: "2px solid rgba(0,230,118,0.5)", borderLeft: "2px solid rgba(0,230,118,0.5)" }} />
        <div className="absolute bottom-0 right-0 w-4 h-4" style={{ borderBottom: "2px solid rgba(0,230,118,0.5)", borderRight: "2px solid rgba(0,230,118,0.5)" }} />

        {/* title */}
        <span
          className="relative z-10 text-sm sm:text-lg md:text-2xl tracking-[0.15em] sm:tracking-[0.3em] font-bold font-mono uppercase text-center px-2"
          style={{
            color: "#7dffb2",
            textShadow: "0 0 8px rgba(0,0,0,1), 0 0 12px rgba(0,230,118,0.8)",
          }}
        >
          {title}
        </span>

        {/* subtitle */}
        <span
          className="relative z-10 text-[8px] sm:text-[10px] md:text-xs tracking-[0.15em] sm:tracking-[0.25em] font-mono uppercase text-center mt-1 px-2"
          style={{ 
            color: "rgba(125,255,178,0.8)",
            textShadow: "0 0 4px rgba(0,0,0,1)"
          }}
        >
          {subtitle}
        </span>
      </div>

      {/* outer glow on hover */}
      <div
        className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: "0 0 12px rgba(0,230,118,0.4), 0 0 35px rgba(0,230,118,0.15)",
        }}
      />

    </motion.div>
  )
}