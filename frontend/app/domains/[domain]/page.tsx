"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Code, Brain, Link as LinkIcon, Database, Terminal, Cpu, Eye } from "lucide-react";
import Link from "next/link";
import "@fontsource/share-tech-mono";

interface ProblemStatement {
  id: string;
  domain: string;
  track: string;
  title: string;
  description: string;
  published: boolean;
  createdAt: string;
}

const DOMAIN_CONFIG: Record<string, {
  label: string; track: string; icon: React.ElementType;
  color: string; glow: string;
  quote: string; subtitle: string;
}> = {
  "web-development": {
    label: "WEB DEVELOPMENT", track: "JUNIOR", icon: Code,
    color: "#0080ff", glow: "rgba(0,128,255,0.4)",
    quote: "\"The body cannot live without the mind.\" — Morpheus",
    subtitle: "BUILD THE DIGITAL FRONTIER",
  },
  "data-science": {
    label: "DATA SCIENCE", track: "JUNIOR", icon: Database,
    color: "#0080ff", glow: "rgba(0,128,255,0.4)",
    quote: "\"There is no spoon... only data.\" — Neo",
    subtitle: "DECODE THE MATRIX OF INFORMATION",
  },
  "blockchain": {
    label: "BLOCKCHAIN", track: "SENIOR", icon: LinkIcon,
    color: "#ff2020", glow: "rgba(255,32,32,0.4)",
    quote: "\"Choice. The problem is choice.\" — Neo",
    subtitle: "FORGE UNBREAKABLE CHAINS OF TRUST",
  },
  "ai-ml": {
    label: "AI / ML", track: "SENIOR", icon: Brain,
    color: "#ff2020", glow: "rgba(255,32,32,0.4)",
    quote: "\"I know why you're here, Neo. I know what you've been doing... why you hardly sleep...\" — Trinity",
    subtitle: "TEACH THE MACHINES TO THINK",
  },
};

export default function DomainPage() {
  const params = useParams();
  const domain = params.domain as string;
  const [statements, setStatements] = useState<ProblemStatement[]>([]);
  const [loading, setLoading] = useState(true);

  const config = DOMAIN_CONFIG[domain];

  useEffect(() => {
    fetch("/api/problemstatements")
      .then((res) => res.json())
      .then((data) => {
        const filtered = (Array.isArray(data) ? data : [])
          .filter((ps: ProblemStatement) => ps.domain === domain && ps.published);
        setStatements(filtered);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [domain]);

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#020403" }}>
        <div className="text-center" style={{ fontFamily: "'Share Tech Mono', monospace", color: "#ff4444" }}>
          <p className="text-xl tracking-widest mb-4">DOMAIN NOT FOUND</p>
          <Link href="/" className="text-xs tracking-widest" style={{ color: "rgba(159,230,184,0.5)" }}>
            ← RETURN TO MAIN TERMINAL
          </Link>
        </div>
      </div>
    );
  }

  const Icon = config.icon;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#020403" }}>
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-10"
        style={{ backgroundImage: `linear-gradient(to bottom, transparent 50%, ${config.color} 50%)`, backgroundSize: "100% 4px" }} />

      {/* Color tint */}
      <div className="fixed inset-0 pointer-events-none z-[1]"
        style={{ background: `radial-gradient(ellipse at center, ${config.glow}15 0%, transparent 70%)` }} />

      {/* Vignette */}
      <div className="fixed inset-0 pointer-events-none z-10"
        style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.6) 100%)" }} />

      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Back link */}
        <Link href="/?view=portals" className="inline-flex items-center gap-2 text-xs tracking-widest mb-8 transition-colors group"
          style={{ color: "rgba(159,230,184,0.5)", fontFamily: "'Share Tech Mono', monospace" }}>
          <ArrowLeft className="w-4 h-4 group-hover:text-green-400 transition-colors" />
          RETURN TO THE CONSTRUCT
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-10 sm:mb-16 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 mb-6 relative">
            <div className="absolute inset-0 rounded-full" style={{ background: `${config.color}15`, border: `1px solid ${config.color}40` }} />
            <Icon className="w-8 h-8 relative z-10" style={{ color: config.color }} />
          </motion.div>

          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-[10px] px-2.5 py-1 tracking-widest"
              style={{ background: `${config.color}15`, border: `1px solid ${config.color}30`, color: config.color, fontFamily: "'Share Tech Mono', monospace" }}>
              {config.track} TRACK
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl tracking-widest mb-4"
            style={{ fontFamily: "Glitch, sans-serif", color: config.color, textShadow: `0 0 15px ${config.glow}` }}>
            {config.label}
          </h1>
          <div className="h-px w-48 mx-auto mb-4" style={{ background: `linear-gradient(to right, transparent, ${config.color}, transparent)` }} />
          <p className="text-[10px] sm:text-xs tracking-[0.2em] mb-6"
            style={{ color: `${config.color}88`, fontFamily: "'Share Tech Mono', monospace" }}>
            {config.subtitle}
          </p>

          {/* Matrix quote */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="max-w-xl mx-auto px-6 py-3 mb-4"
            style={{ background: "rgba(0,10,0,0.5)", border: "1px solid rgba(0,230,118,0.1)" }}>
            <p className="text-xs italic leading-relaxed" style={{ color: "rgba(125,255,178,0.5)", fontFamily: "'Share Tech Mono', monospace" }}>
              {config.quote}
            </p>
          </motion.div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="text-sm tracking-widest" style={{ color: config.color, fontFamily: "'Share Tech Mono', monospace" }}>
              DECRYPTING CHALLENGE PROTOCOLS...
            </motion.div>
          </div>
        ) : statements.length === 0 ? (
          /* No problem statements yet — "Coming Soon" Matrix themed */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-center py-8">

            {/* Terminal window */}
            <div className="max-w-xl mx-auto relative overflow-hidden"
              style={{ background: "rgba(0,10,0,0.7)", border: `1px solid ${config.color}30` }}>
              <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,230,118,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />

              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-2.5"
                style={{ borderBottom: `1px solid ${config.color}20`, background: "rgba(0,0,0,0.5)" }}>
                <div className="w-3 h-3 rounded-full" style={{ background: `${config.color}60` }} />
                <div className="w-3 h-3 rounded-full" style={{ background: `${config.color}40` }} />
                <div className="w-3 h-3 rounded-full" style={{ background: `${config.color}20` }} />
                <span className="ml-3 text-xs tracking-wider" style={{ color: "rgba(159,230,184,0.4)", fontFamily: "'Share Tech Mono', monospace" }}>
                  system@nexus:~/challenges/{domain}
                </span>
              </div>

              <div className="relative z-10 p-6 sm:p-8 space-y-4" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                {/* Animated lock icon */}
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="flex justify-center mb-6">
                  <div className="relative">
                    <Lock className="w-12 h-12" style={{ color: `${config.color}60` }} />
                    <motion.div animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0" style={{ filter: `drop-shadow(0 0 10px ${config.color})` }}>
                      <Lock className="w-12 h-12" style={{ color: config.color }} />
                    </motion.div>
                  </div>
                </motion.div>

                <div className="space-y-2 text-xs" style={{ color: `${config.color}88` }}>
                  <div><span style={{ color: `${config.color}50` }}>{">"}</span> Accessing challenge database...</div>
                  <div><span style={{ color: `${config.color}50` }}>{">"}</span> Connection established</div>
                  <div><span style={{ color: `${config.color}50` }}>{">"}</span> Authorization level: CLASSIFIED</div>
                  <div className="pt-2">
                    <span style={{ color: `${config.color}50` }}>{">"}</span>{" "}
                    <span style={{ color: config.color }}>STATUS:</span> CHALLENGE PROTOCOLS ENCRYPTED
                  </div>
                </div>

                <div className="pt-4">
                  <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.5, repeat: Infinity }}
                    className="text-base sm:text-lg tracking-widest text-center" style={{ color: config.color, textShadow: `0 0 10px ${config.glow}` }}>
                    PROBLEM STATEMENTS WILL BE RELEASED SOON
                  </motion.p>
                  <p className="text-[10px] tracking-[0.2em] text-center mt-3" style={{ color: "rgba(159,230,184,0.35)" }}>
                    THE ORACLE HAS NOT YET REVEALED THE PATH
                  </p>
                </div>

                {/* Blinking cursor */}
                <div className="flex items-center gap-2 pt-4">
                  <span className="text-xs" style={{ color: config.color }}>$</span>
                  <span className="text-xs" style={{ color: `${config.color}70` }}>awaiting_transmission</span>
                  <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity }}
                    style={{ color: config.color }}>█</motion.span>
                </div>
              </div>
            </div>

            {/* Additional flavor text */}
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              className="text-[10px] tracking-[0.2em] mt-6" style={{ color: "rgba(159,230,184,0.25)", fontFamily: "'Share Tech Mono', monospace" }}>
              &quot;YOU HAVE TO UNDERSTAND, MOST OF THESE PEOPLE ARE NOT READY TO BE UNPLUGGED.&quot; — MORPHEUS
            </motion.p>
          </motion.div>
        ) : (
          /* Problem statements list */
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="w-4 h-4" style={{ color: config.color }} />
              <span className="text-xs tracking-[0.2em]" style={{ color: config.color, fontFamily: "'Share Tech Mono', monospace" }}>
                {statements.length} CHALLENGE{statements.length !== 1 ? "S" : ""} DEPLOYED
              </span>
            </div>

            {statements.map((ps, i) => (
              <motion.div key={ps.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="relative overflow-hidden group"
                style={{ background: "rgba(0,12,0,0.6)", border: `1px solid ${config.color}25` }}>
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,230,118,0.03)_50%)] bg-[length:100%_4px] pointer-events-none" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(180deg, ${config.color}08 0%, transparent 100%)` }} />

                <div className="relative z-10 p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center gap-1.5 text-[10px] px-2.5 py-1"
                      style={{ background: `${config.color}10`, border: `1px solid ${config.color}25`, color: config.color, fontFamily: "'Share Tech Mono', monospace" }}>
                      <Eye className="w-3 h-3" />DEPLOYED
                    </span>
                    <span className="text-[9px] tracking-wider" style={{ color: "rgba(159,230,184,0.25)", fontFamily: "'Share Tech Mono', monospace" }}>
                      {new Date(ps.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg tracking-wider mb-3"
                    style={{ color: config.color, fontFamily: "'Share Tech Mono', monospace", textShadow: `0 0 6px ${config.glow}` }}>
                    <Terminal className="w-4 h-4 inline mr-2" style={{ color: `${config.color}60` }} />
                    {ps.title}
                  </h2>

                  <p className="text-xs sm:text-sm leading-relaxed pl-6 whitespace-pre-wrap"
                    style={{ color: "rgba(125,255,178,0.65)", fontFamily: "'Share Tech Mono', monospace" }}>
                    {ps.description}
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-[1px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(to right, transparent, ${config.color}, transparent)` }} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
