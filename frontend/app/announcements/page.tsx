"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import "@fontsource/share-tech-mono";

interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
  createdAt: string;
}

export default function PublicAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/announcements")
      .then((res) => res.json())
      .then((data) => setAnnouncements(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen relative" style={{ background: "#020403" }}>
      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-10"
        style={{
          backgroundImage: "linear-gradient(to bottom, transparent 50%, #00e676 50%)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.6) 100%)" }}
      />

      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-xs tracking-widest mb-8 transition-colors group"
          style={{ color: "rgba(159,230,184,0.5)", fontFamily: "'Share Tech Mono', monospace" }}>
          <ArrowLeft className="w-4 h-4 group-hover:text-green-400 transition-colors" />
          RETURN TO MAIN TERMINAL
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-10 sm:mb-16 text-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl tracking-widest mb-4"
            style={{ fontFamily: "Glitch, sans-serif", color: "#7dffb2", textShadow: "0 0 10px rgba(0,230,118,0.4)" }}>
            SYSTEM BROADCASTS
          </h1>
          <div className="h-px w-48 mx-auto mb-4" style={{ background: "linear-gradient(to right, transparent, #00e676, transparent)" }} />
          <p className="text-[10px] sm:text-xs tracking-[0.2em]" style={{ color: "rgba(159,230,184,0.4)", fontFamily: "'Share Tech Mono', monospace" }}>
            LATEST ANNOUNCEMENTS FROM THE SYSTEM
          </p>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="text-sm tracking-widest" style={{ color: "#7dffb2", fontFamily: "'Share Tech Mono', monospace" }}>
              DECRYPTING BROADCASTS...
            </motion.div>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-20 text-sm" style={{ color: "rgba(159,230,184,0.4)", fontFamily: "'Share Tech Mono', monospace" }}>
            NO BROADCASTS IN SYSTEM YET.
          </div>
        ) : (
          <div className="space-y-6">
            {announcements.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="relative overflow-hidden group"
                style={{ background: "rgba(0,12,0,0.6)", border: "1px solid rgba(0,230,118,0.2)" }}>
                {/* Scanning overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,230,118,0.03)_50%)] bg-[length:100%_4px] pointer-events-none" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(180deg, rgba(0,230,118,0.04) 0%, transparent 100%)" }} />

                <div className="relative z-10 p-5 sm:p-6">
                  {/* Date and timestamp */}
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className="text-[10px] px-2.5 py-1 flex items-center gap-1.5"
                      style={{ background: "rgba(0,230,118,0.1)", border: "1px solid rgba(0,230,118,0.2)", color: "rgba(159,230,184,0.7)", fontFamily: "'Share Tech Mono', monospace" }}>
                      <Calendar className="w-3 h-3" />{a.date}
                    </span>
                    <span className="text-[9px] tracking-wider" style={{ color: "rgba(159,230,184,0.25)", fontFamily: "'Share Tech Mono', monospace" }}>
                      PUBLISHED: {new Date(a.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-base sm:text-lg tracking-wider mb-3"
                    style={{ color: "#7dffb2", fontFamily: "'Share Tech Mono', monospace", textShadow: "0 0 6px rgba(0,230,118,0.2)" }}>
                    <span style={{ color: "rgba(0,230,118,0.4)" }}>{">"}</span> {a.title}
                  </h2>

                  {/* Description */}
                  <p className="text-xs sm:text-sm leading-relaxed pl-4" style={{ color: "rgba(125,255,178,0.65)", fontFamily: "'Share Tech Mono', monospace" }}>
                    {a.description}
                  </p>

                  {/* Image */}
                  {a.imageUrl && (
                    <div className="mt-4 pl-4">
                      <div className="inline-flex items-center gap-2 text-[10px] mb-2" style={{ color: "rgba(0,230,118,0.4)" }}>
                        <ImageIcon className="w-3 h-3" /> ATTACHED MEDIA
                      </div>
                      <img src={a.imageUrl} alt={a.title} className="max-w-full sm:max-w-md rounded-sm"
                        style={{ border: "1px solid rgba(0,230,118,0.15)" }} />
                    </div>
                  )}
                </div>

                {/* Bottom glow */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "linear-gradient(to right, transparent, #00e676, transparent)" }} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
