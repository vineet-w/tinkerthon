"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ReturnPortalButton from "./ReturnPortalButton"

interface SponsorsSectionProps {
  onReturn: () => void
}

const N8N_COLOR = "#EA4B71"
const ELECTROLYTE_COLOR = "#FFD700"
const UNSTOP_COLOR = "#FF6B35"
const GMC_COLOR = "#4A90D9"
const MATRIX_GREEN = "#00ff41"

export default function SponsorsSection({ onReturn }: SponsorsSectionProps) {
  const [bootSequence, setBootSequence] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setBootSequence(1), 500)
    const t2 = setTimeout(() => setBootSequence(2), 1200)
    const t3 = setTimeout(() => setBootSequence(3), 2000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen flex flex-col items-center px-4 sm:px-6 py-20 pb-28 overflow-y-auto overflow-x-hidden"
      style={{ background: "#020403" }}
    >
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-20 mix-blend-screen"
        style={{
          backgroundImage: "url('/assets/portals/The_Allies.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Matrix Scanline Background Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-10"
        style={{
          backgroundImage: "linear-gradient(to bottom, transparent 50%, #00e676 50%)",
          backgroundSize: "100% 4px",
        }}
      />

      <div className="relative z-20 w-full max-w-5xl">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-20"
        >
          <h2
            className="text-2xl sm:text-4xl md:text-6xl tracking-widest mb-4 uppercase"
            style={{
               fontFamily: "Glitch, sans-serif",
               letterSpacing: "clamp(4px, 1.5vw, 10px)",
               color: "#7dffb2",
               textShadow: "0 0 10px rgba(0,230,118,0.4)",
            }}
          >
            THE ALLIES
          </h2>
          <div
            className="h-px w-48 mx-auto mb-4"
            style={{ background: "linear-gradient(to right, transparent, #00e676, transparent)" }}
          />
          <p
             className="font-mono text-xs sm:text-sm tracking-[0.25em]"
             style={{ color: "rgba(159,230,184,0.5)" }}
          >
            OUR SPONSORS
          </p>
        </motion.div>

        {/* 2x2 Grid + Connection Lines */}
        <div className="relative">
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none hidden md:block" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
            {/* Horizontal top line */}
            <line x1="200" y1="130" x2="600" y2="130" stroke="rgba(0,255,65,0.2)" strokeWidth="1" />
            {/* Horizontal bottom line */}
            <line x1="200" y1="370" x2="600" y2="370" stroke="rgba(0,255,65,0.2)" strokeWidth="1" />
            {/* Vertical left line */}
            <line x1="200" y1="130" x2="200" y2="370" stroke="rgba(0,255,65,0.2)" strokeWidth="1" />
            {/* Vertical right line */}
            <line x1="600" y1="130" x2="600" y2="370" stroke="rgba(0,255,65,0.2)" strokeWidth="1" />
            {/* Diagonal lines */}
            <line x1="200" y1="130" x2="600" y2="370" stroke="rgba(0,255,65,0.1)" strokeWidth="1" />
            <line x1="600" y1="130" x2="200" y2="370" stroke="rgba(0,255,65,0.1)" strokeWidth="1" />

            {/* Traveling dots */}
            {bootSequence >= 3 && (
              <>
                <circle r="3" fill={MATRIX_GREEN} filter="url(#glow)">
                  <animateMotion dur="3s" repeatCount="indefinite" path="M200,130 L600,130" />
                </circle>
                <circle r="3" fill={MATRIX_GREEN} filter="url(#glow)">
                  <animateMotion dur="4s" repeatCount="indefinite" path="M200,370 L600,370" />
                </circle>
                <circle r="3" fill={MATRIX_GREEN} filter="url(#glow)">
                  <animateMotion dur="3.5s" repeatCount="indefinite" path="M200,130 L200,370" />
                </circle>
                <circle r="3" fill={MATRIX_GREEN} filter="url(#glow)">
                  <animateMotion dur="4.5s" repeatCount="indefinite" path="M600,130 L600,370" />
                </circle>
              </>
            )}
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>

          {/* Cards Grid */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-3xl mx-auto">
            {/* Row 1 Col 1: Unstop */}
            <SponsorCard 
              sponsorName="UNSTOP"
              sponsorColor={UNSTOP_COLOR}
              linkText="unstop.com"
              bootSequence={bootSequence}
              delay={0}
            >
              <div className="flex justify-center items-center w-full h-24">
                <div className="flex items-center gap-2">
                  <img 
                    src="/assets/unstop.png" 
                    alt="Unstop logo"
                    className="h-16 w-auto object-contain transition-all duration-300"
                  />
            
                </div>
              </div>
            </SponsorCard>

            {/* Row 1 Col 2: Electrolyte */}
            <SponsorCard 
              sponsorName="ELECTROLYTE"
              sponsorColor={ELECTROLYTE_COLOR}
              linkText="electrolyte"
              bootSequence={bootSequence}
              delay={0.2}
            >
              <div className="relative flex items-center justify-center w-[250px] h-[100px] overflow-hidden transition-all duration-300">
                <div className="absolute w-[250px] h-[250px] flex items-center justify-center pointer-events-none group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src="/assets/electrolyte-logo.jpg" 
                    alt="Electrolyte logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </SponsorCard>

            {/* Row 2 Col 1: n8n */}
            <SponsorCard 
              sponsorName="n8n"
              sponsorColor={N8N_COLOR}
              linkText="n8n.io"
              bootSequence={bootSequence}
              delay={0.4}
            >
               <div className="flex justify-center items-center w-full h-24">
                 <img 
                    src="/assets/n8n-logo.png" 
                    alt="n8n logo"
                    className="h-full w-auto object-contain brightness-0 invert opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:brightness-100 group-hover:invert-0"
                    style={{
                      filter: "brightness(0) invert(1)"
                    }}
                 />
               </div>
            </SponsorCard>

            {/* Row 2 Col 2: Give My Certificate */}
            <SponsorCard 
              sponsorName="GIVE MY CERTIFICATE"
              sponsorColor={GMC_COLOR}
              linkText="givemycertificate.com"
              bootSequence={bootSequence}
              delay={0.6}
            >
              <div className="flex justify-center items-center w-full h-24">
                {/* JSX text-based logo recreation */}
                <div className="flex items-center gap-3 transition-all duration-300">
                  {/* Triangle/Arrow icon */}
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <polygon 
                      points="20,4 36,36 4,36" 
                      fill="none" 
                      stroke="#4A90D9" 
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    <polygon 
                      points="20,14 28,30 12,30" 
                      fill="#4A90D9" 
                      opacity="0.4"
                    />
                  </svg>
                  <div className="text-left">
                    <div className="text-white font-bold text-sm tracking-wide leading-tight">
                      Give My
                    </div>
                    <div className="text-white font-bold text-sm tracking-wide leading-tight">
                      Certificate
                    </div>
                  </div>
                </div>
              </div>
            </SponsorCard>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-12 mb-8">
        <ReturnPortalButton onReturn={onReturn} fixed={false} />
      </div>
    </motion.section>
  )
}

function SponsorCard({ 
  children, sponsorName, sponsorColor, linkText, bootSequence, delay 
}: { 
  children: React.ReactNode, sponsorName: string, sponsorColor: string, linkText: string, bootSequence: number, delay: number 
}) {
  const isBooted = bootSequence >= 2
  return (
    <div className="flex flex-col items-center z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={bootSequence >= 1 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5, delay: delay }}
        className="group relative w-full bg-[rgba(0,0,0,0.7)] p-6 cursor-pointer overflow-hidden transition-all duration-300"
        style={{
          border: `1px solid ${MATRIX_GREEN}`,
          boxShadow: `inset 0 0 30px ${sponsorColor}26`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = sponsorColor
          e.currentTarget.style.boxShadow = `inset 0 0 40px ${sponsorColor}40, 0 0 20px ${sponsorColor}33`
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = MATRIX_GREEN
          e.currentTarget.style.boxShadow = `inset 0 0 30px ${sponsorColor}26`
        }}
      >
         {/* Corner Brackets */}
         <div className="absolute top-0 left-0 text-xl leading-none text-[#00ff41] font-mono group-hover:text-[var(--hover-color)] transition-colors p-1" style={{ '--hover-color': sponsorColor } as any}>╔</div>
         <div className="absolute top-0 right-0 text-xl leading-none text-[#00ff41] font-mono group-hover:text-[var(--hover-color)] transition-colors p-1" style={{ '--hover-color': sponsorColor } as any}>╗</div>
         <div className="absolute bottom-0 left-0 text-xl leading-none text-[#00ff41] font-mono group-hover:text-[var(--hover-color)] transition-colors p-1" style={{ '--hover-color': sponsorColor } as any}>╚</div>
         <div className="absolute bottom-0 right-0 text-xl leading-none text-[#00ff41] font-mono group-hover:text-[var(--hover-color)] transition-colors p-1" style={{ '--hover-color': sponsorColor } as any}>╝</div>

         {/* Scanline boot effect */}
         {!isBooted && bootSequence >= 1 && (
            <motion.div 
               initial={{ top: "-10%" }}
               animate={{ top: "110%" }}
               transition={{ duration: 1.5, ease: "linear" }}
               className="absolute left-0 right-0 h-4 bg-green-400/20 blur-sm z-20 pointer-events-none"
            />
         )}

         {/* Matrix rain hover effect overlay */}
         <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none overflow-hidden z-0 flex whitespace-pre font-mono text-xs text-[#00ff41] flex-wrap items-start justify-start p-2 leading-none">
            {Array.from({length: 100}).map((_, i) => Math.random() > 0.5 ? '1' : '0').join(' ')}
            <br />
            {Array.from({length: 100}).map((_, i) => Math.random() > 0.5 ? '0' : 'A').join(' ')}
            <br />
            {Array.from({length: 100}).map((_, i) => Math.random() > 0.5 ? 'X' : '1').join(' ')}
         </div>

         {/* Top Label */}
         <div className="font-mono text-sm tracking-widest text-[#00ff41] mb-8 relative z-10 group-hover:text-[var(--hover-color)] transition-colors" style={{ '--hover-color': sponsorColor } as any}>
            {">"} ALLY_IDENTIFIED
         </div>

         {/* Logo Container */}
         <div className="mb-8 relative z-10 mix-blend-screen px-4 min-h-[100px] flex items-center justify-center">
            {isBooted ? (
               <motion.div
                  initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.5 }}
               >
                  {children}
               </motion.div>
            ) : (
               <div className="text-[#00ff41] font-mono text-xs animate-pulse opacity-50 flex items-center justify-center w-full h-full min-h-[100px]">
                  [ LOADING_ASSET... ]
               </div>
            )}
         </div>

         {/* Status */}
         <div className="font-mono text-xs tracking-widest text-[#00ff41] mt-auto relative z-10 group-hover:text-[var(--hover-color)] transition-colors flex items-center gap-2" style={{ '--hover-color': sponsorColor } as any}>
            <span className="animate-pulse">■</span> STATUS: CONNECTED
         </div>
      </motion.div>

      {/* Subtext */}
      <motion.div 
         initial={{ opacity: 0 }}
         animate={isBooted ? { opacity: 1 } : { opacity: 0 }}
         transition={{ duration: 0.5, delay: delay + 0.3 }}
         className="mt-4 font-mono text-[10px] sm:text-xs text-[#00ff41] opacity-60 tracking-widest uppercase"
      >
         {linkText}
      </motion.div>
    </div>
  )
}
