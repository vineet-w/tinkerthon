"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import ReturnPortalButton from "./ReturnPortalButton"

interface TimelineEvent {
  date: string;
  title: string;
}

const EVENTS: TimelineEvent[] = [
  { date: "16/03/2026", title: "Registration Starts (FCFS for Domain)" },
  { date: "18/03/2026", title: "Registration ends" },
  { date: "19/03/2026", title: "Domain Allocation Result" },
  { date: "20/03/2026", title: "PS Release + Hackathon Starts" },
  { date: "21/03/2026", title: "Project Submission (Video + Code Files)" },
  { date: "22/03/2026", title: "Top Teams Shortlisting" },
  { date: "23/03/2026", title: "Final Presentation (in college) & Results" },
];

interface TimelineSectionProps {
  onReturn: () => void
}

interface TypewriterPayloadProps {
  text: string
  startDelayMs?: number
  charIntervalMs?: number
}

function TypewriterPayload({
  text,
  startDelayMs = 0,
  charIntervalMs = 30,
}: TypewriterPayloadProps) {
  const [visibleChars, setVisibleChars] = useState(0)

  useEffect(() => {
    setVisibleChars(0)

    let intervalId: ReturnType<typeof setInterval> | null = null
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setVisibleChars((prev) => {
          if (prev >= text.length) {
            if (intervalId) clearInterval(intervalId)
            return prev
          }
          return prev + 1
        })
      }, charIntervalMs)
    }, startDelayMs)

    return () => {
      clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
    }
  }, [text, startDelayMs, charIntervalMs])

  return (
    <>
      {text.slice(0, visibleChars)}
      {visibleChars > 0 && (
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="inline-block w-2 sm:w-3 h-4 sm:h-5 bg-green-400 ml-2 align-middle"
        />
      )}
    </>
  )
}

export default function TimelineSection({ onReturn }: TimelineSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen w-full flex flex-col pt-24 pb-32 px-4 sm:px-6 overflow-y-auto overflow-x-hidden"
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

      <div className="relative z-20 w-full max-w-4xl mx-auto pb-20">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-10 sm:mb-16 text-center"
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
            THE DESCENT
          </h2>
          <div
            className="h-px w-48 mx-auto mb-4"
            style={{ background: "linear-gradient(to right, transparent, #00e676, transparent)" }}
          />
          <p
            className="font-mono text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.25em]"
            style={{ color: "rgba(159,230,184,0.5)" }}
          >
            EVENT TIMELINE
          </p>
        </motion.div>

        {/* Timeline body - The Descent Stream */}
        <div className="max-w-3xl mx-auto relative pl-6 sm:pl-10">
          {/* Main data stream beam */}
          <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-transparent via-green-500 to-transparent shadow-[0_0_15px_rgba(0,230,118,0.8)] opacity-70" />

          {EVENTS.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
              className="relative mb-12 sm:mb-16 group"
            >
              {/* Event Node Connection */}
              <div className="absolute -left-6 sm:-left-10 top-2 w-6 sm:w-10 h-px bg-green-500/50 group-hover:bg-green-400 transition-colors duration-300" />
              
              {/* Data Node Indicator */}
              <div className="absolute -left-[1.65rem] sm:-left-[2.65rem] top-1 w-3 h-3 bg-black border border-green-500 rotate-45 group-hover:bg-green-400 group-hover:scale-125 transition-all duration-300 shadow-[0_0_10px_rgba(0,230,118,0.5)]" />

              {/* Data Block */}
              <div className="relative p-4 sm:p-6 bg-black border border-green-500/30 group-hover:border-green-400 overflow-hidden transition-colors duration-300">
                {/* Background scanning effect */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,230,118,0.05)_50%)] bg-[length:100%_4px] pointer-events-none" />
                
                {/* Decrypting Header */}
                <div className="flex items-center gap-3 mb-2 sm:mb-4">
                  <span className="text-[10px] sm:text-xs font-mono text-green-300/50 px-2 py-0.5 border border-green-500/20 bg-green-500/5">
                    SYS.DATE / {event.date}
                  </span>
                  <span className="hidden sm:inline-block text-[10px] font-mono text-green-500/40 tracking-[0.2em] group-hover:animate-pulse">
                    [0x{Math.random().toString(16).substring(2, 8).toUpperCase()}]
                  </span>
                </div>

                {/* Payload Text */}
                <h3 className="relative z-10 font-mono font-bold text-sm sm:text-xl text-green-400 tracking-widest leading-relaxed drop-shadow-[0_0_8px_rgba(0,230,118,0.4)]">
                  <span className="text-white/60 mr-2">{">"}</span>
                  <TypewriterPayload
                    text={event.title}
                    startDelayMs={500 + index * 200}
                    charIntervalMs={24}
                  />
                </h3>
                
                {/* Glitch Overlay Effect on hover */}
                <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 mix-blend-screen transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ReturnPortalButton onReturn={onReturn} fixed={false} />
    </motion.section>
  )
}
