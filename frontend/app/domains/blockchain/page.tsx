"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import "@fontsource/share-tech-mono";
import "@fontsource/orbitron";

/* ═══════════════════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════════════════ */

function useTextScramble(text: string, trigger: boolean, speed = 30) {
  const [display, setDisplay] = useState("")
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?"

  useEffect(() => {
    if (!trigger) {
      setDisplay("")
      return
    }

    let frame = 0
    const totalFrames = text.length * 3

    const interval = setInterval(() => {
      const progress = frame / totalFrames
      const revealedCount = Math.floor(progress * text.length)

      let result = ""
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " " || text[i] === "\n") {
          result += text[i]
        } else if (i < revealedCount) {
          result += text[i]
        } else {
          result += chars[Math.floor(Math.random() * chars.length)]
        }
      }

      setDisplay(result)
      frame++

      if (frame > totalFrames) {
        setDisplay(text)
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, trigger, speed])

  return display
}

function useTypewriter(text: string, trigger: boolean, speed = 8) {
  const [display, setDisplay] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!trigger) return
    if (done) return

    let i = 0
    setDisplay("")

    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplay(text.slice(0, i + 1))
        i++
      } else {
        setDone(true)
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, trigger, speed, done])

  return { display, done }
}

/* ═══════════════════════════════════════════════════════════════════
   RED MATRIX RAIN (CANVAS)
   ═══════════════════════════════════════════════════════════════════ */
const RedMatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
    const fontSize = 14;
    const columns = Math.ceil(canvas.width / fontSize);

    const drops = Array(columns).fill(1).map(() => Math.random() * -100);
    const speeds = Array(columns).fill(0).map(() => Math.random() * 0.5 + 0.5);

    let speedMultiplier = 1;
    const scrollHandler = () => {
      speedMultiplier = 1.5;
      clearTimeout((window as any).scrollTimeout);
      (window as any).scrollTimeout = setTimeout(() => {
        speedMultiplier = 1;
      }, 150);
    };
    window.addEventListener('scroll', scrollHandler);

    let animationId: number;

    const draw = () => {
      ctx.fillStyle = "rgba(10, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        if (Math.random() > 0.95 * speedMultiplier) continue;

        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.shadowBlur = 5;
        ctx.shadowColor = "#FF2020";
        
        const intensity = Math.random();
        if (intensity > 0.9) {
          ctx.fillStyle = "#FF5050"; 
        } else if (intensity > 0.5) {
          ctx.fillStyle = "#FF2020"; 
        } else {
          ctx.fillStyle = "#660000"; 
        }

        ctx.fillText(char, x, y);
        ctx.shadowBlur = 0;

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
          speeds[i] = Math.random() * 0.5 + 0.5;
        }

        drops[i] += speeds[i] * speedMultiplier * 0.5;
      }
      
      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      window.removeEventListener("scroll", scrollHandler);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-50" />;
};

/* ═══════════════════════════════════════════════════════════════════
   PROBLEM STATEMENTS DATA
   ═══════════════════════════════════════════════════════════════════ */

const PS_DATA = [
  {
    id: "PS_01",
    title: "BLOCKCHAIN MICRO-FINANCE & IMPACT SCORING",
    difficulty: "SENIOR",
    domain: "BLOCKCHAIN",
    description: "A small street vendor applies for a micro-loan but is rejected due to the absence of formal credit history. Although she consistently participates in community health programs, completes skill-development courses, and engages in local sustainability initiatives, the banking system lacks a structured way to recognize these positive behavioral indicators during credit assessment.\n\nTraditional underwriting models rely heavily on past borrowing data, limiting access for first-time borrowers and underserved populations. Design a blockchain-enabled micro-finance ecosystem that augments conventional credit evaluation with a dynamic “Impact Score.” This score should incorporate verified on-chain records of constructive activities—such as health compliance, certified educational progress, and validated sustainability participation—to act as a supplementary risk modifier. The system must use smart contracts to automate score-based loan adjustments (interest incentives, borrowing limits, or collateral flexibility), maintain tamper-proof audit trails, and ensure privacy and regulatory compatibility while promoting inclusive access to financial services.",
  },
  {
    id: "PS_02",
    title: "BLOCKCHAIN PROCUREMENT & MILESTONE SYSTEM",
    difficulty: "SENIOR",
    domain: "BLOCKCHAIN",
    description: "A government authority allocates funds for a road construction or hospital equipment project. The project involves multiple stakeholders—contractors, material suppliers, engineers, inspectors, and financial authorities. However, procurement processes are often opaque. Issues such as inflated material costs, use of substandard materials, delayed payments, duplicate invoicing, and lack of verifiable audit trails reduce trust and lead to financial leakages. Once funds are disbursed, tracking how materials were sourced and whether milestones were genuinely completed becomes difficult due to centralized and manually maintained records.\n\nDesign a blockchain-based procurement and milestone payment system that records project creation, budget allocation, material procurement logs, inspection approvals, and contractor payments on a tamper-proof ledger. The system should use smart contracts to release payments only after predefined milestones are verified by authorized inspectors. Material invoices and quality certificates must be stored as hashed records to prevent document manipulation, while providing transparent audit access to regulators or funding authorities. The objective is to improve accountability in project execution, reduce corruption risks, ensure quality compliance, and enhance financial transparency in infrastructure or institutional projects.",
  }
];

/* ═══════════════════════════════════════════════════════════════════
   RED PS CARD
   ═══════════════════════════════════════════════════════════════════ */

function RedPSCard({ ps, delay }: { ps: any, delay: number }) {
  const [booted, setBooted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [scanDone, setScanDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!booted) return;
    const t = setTimeout(() => setScanDone(true), 800);
    return () => clearTimeout(t);
  }, [booted]);

  const titleText = useTextScramble(ps.title, booted, 35);
  const { display: bodyText, done: typeDone } = useTypewriter(ps.description, scanDone, 4);

  const COLLAPSE_LENGTH = 280;
  const isLongText = ps.description.length > COLLAPSE_LENGTH;
  const displayBody = expanded || !typeDone
    ? bodyText
    : bodyText.slice(0, COLLAPSE_LENGTH) + (isLongText ? "..." : "");

  if (!booted) return <div className="h-16" />;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative group mb-6"
      style={{
        border: "1px solid rgba(255,32,32,0.25)",
        background: "rgba(10,0,0,0.85)",
        fontFamily: "'Share Tech Mono', monospace",
        transition: "box-shadow 0.3s ease, border-color 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 0 25px rgba(255,32,32,0.3)";
        e.currentTarget.style.borderColor = "rgba(255,32,32,0.5)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "rgba(255,32,32,0.25)";
      }}
    >
      {/* Scanline */}
      {!scanDone && (
        <div
          className="absolute left-0 right-0 h-[2px] z-30 pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, #FF2020, #FF2020, transparent)", boxShadow: "0 0 10px #FF2020, 0 0 20px #FF2020", animation: "redScanSweep 0.8s linear forwards" }}
        />
      )}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-10" style={{ backgroundImage: "linear-gradient(to bottom, transparent 50%, #FF2020 50%)", backgroundSize: "100% 4px" }} />

      <div className="relative z-20 p-5 sm:p-6">
        <div className="text-[11px] tracking-widest mb-3 flex items-center" style={{ color: "#FF2020" }}>
          <span style={{ opacity: 0.5 }} className="mr-2">&gt;</span> {ps.id} ACCESSING...
        </div>
        <div className="h-px w-full max-w-[200px] mb-4" style={{ background: "linear-gradient(to right, #FF2020, transparent)" }} />

        <h3 className="text-lg sm:text-xl tracking-wider mb-4 font-bold" style={{ fontFamily: "'Orbitron', sans-serif", color: "#FF2020", textShadow: "0 0 8px rgba(255,32,32,0.4)" }}>
          {titleText || ps.title}
        </h3>

        <div className="relative">
          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "rgba(255,32,32,0.8)", maxHeight: expanded || !typeDone ? "none" : "5.4em", overflow: "hidden" }}>
            {displayBody}
          </p>
          {!expanded && typeDone && isLongText && (
            <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none" style={{ background: "linear-gradient(transparent, rgba(10,0,0,0.95))" }} />
          )}
        </div>

        {typeDone && isLongText && (
          <button onClick={() => setExpanded(!expanded)} className="mt-4 text-[11px] tracking-widest cursor-pointer hover:underline" style={{ color: "#FF2020", background: "none", border: "none", fontFamily: "'Share Tech Mono', monospace", textShadow: "0 0 6px rgba(255,32,32,0.4)" }}>
            &gt; {expanded ? "COLLAPSE" : "READ_MORE"}
          </button>
        )}

        {!typeDone && <span className="inline-block ml-1 animate-pulse" style={{ color: "#FF2020", fontSize: "14px" }}>█</span>}

        <div className="flex flex-wrap items-center justify-between mt-5 pt-3" style={{ borderTop: "1px solid rgba(255,32,32,0.1)" }}>
          <div className="flex flex-wrap gap-3 text-[10px] tracking-widest" style={{ color: "#FF2020" }}>
            <span>■ DIFFICULTY: {ps.difficulty}</span>
            <span>■ DOMAIN: {ps.domain}</span>
            <span>■ STATUS: UNLOCKED</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════ */

export default function BlockchainPage() {
  const [timeline, setTimeline] = useState({
    bg: false,
    header: false,
    divider: false,
    badge: false,
    nav: false
  });

  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    // 0.3s -> Red matrix rain fades in
    setTimeout(() => setTimeline(p => ({ ...p, bg: true })), 300);
    // 1.2s -> Header text types out 
    setTimeout(() => setTimeline(p => ({ ...p, header: true })), 1200);
    // 1.8s -> Red horizontal divider
    setTimeout(() => setTimeline(p => ({ ...p, divider: true })), 1800);
    // 2.0s -> Track domain badge
    setTimeout(() => setTimeline(p => ({ ...p, badge: true })), 2000);
    // PS Cards are timed internally via delay (2300 and 2600)
    // 3.0s -> Navigation
    setTimeout(() => setTimeline(p => ({ ...p, nav: true })), 3000);

    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.4) {
        setGlitching(true);
        setTimeout(() => setGlitching(false), 200);
      }
    }, 8000);

    return () => clearInterval(glitchInterval);
  }, []);

  const headerRawText = 
`╔═                                        ═╗
  > ACCESSING: DOMAIN_DATABASE
  ■ TRACK: SENIOR_TRACK
  ■ DOMAIN: BLOCKCHAIN
  ■ CLEARANCE: SENIOR_REQUIRED
  ■ STATUS: UNLOCKED
╚═                                        ═╝`;

  const { display: headerDisplayText } = useTypewriter(headerRawText, timeline.header, 40);
  const titleText = useTextScramble("B L O C K C H A I N", timeline.badge, 40);

  return (
    <div className={`min-h-screen min-w-full relative overflow-x-hidden selection:bg-[#FF2020]/30 transition-all duration-75 ${glitching ? "mix-blend-color-dodge translate-x-[3px]" : ""}`} style={{ background: "#0A0000", color: "#FF2020", filter: glitching ? "drop-shadow(4px 0 0 rgba(200,0,0,0.8)) drop-shadow(-4px 0 0 rgba(0,0,200,0.5))" : "none" }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes redScanSweep {
          0% { top: 0; opacity: 1; }
          90% { top: 100%; opacity: 0.8; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />

      {/* MATRIX BACKGROUND */}
      {timeline.bg && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}><RedMatrixRain /></motion.div>}

      {/* SUBTLE RED SCANLINE OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-10 opacity-5" style={{ background: "repeating-linear-gradient(transparent, transparent 2px, #FF2020 2px, #FF2020 4px)" }} />

      {/* RADIAL GLOW */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ background: "radial-gradient(ellipse at center, rgba(204,0,0,0.15) 0%, transparent 60%)" }} />

      {/* CRT VIGNETTE */}
      <div className="fixed inset-0 pointer-events-none z-[15]" style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(10,0,0,0.8) 100%)" }} />

      {/* WARNING WATERMARK */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-[5] overflow-hidden opacity-[0.03]">
        <div className="transform -rotate-45 whitespace-nowrap text-[150px] sm:text-[200px] font-black tracking-widest leading-none pointer-events-none uppercase" style={{ color: "#FF2020", fontFamily: "'Share Tech Mono', monospace" }}>
          SENIOR_CLEARANCE_REQUIRED SENIOR_CLEARANCE_REQUIRED SENIOR_CLEARANCE_REQUIRED
        </div>
      </div>

      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 font-mono">
        
        {/* PAGE HEADER BLOCK */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto flex items-center justify-center min-h-[160px]" style={{ fontFamily: "'Share Tech Mono', monospace", color: "#FF2020", textShadow: "0 0 5px rgba(255,32,32,0.5)" }}>
            <div className="text-[10px] sm:text-sm leading-loose sm:leading-relaxed whitespace-pre font-bold overflow-x-auto w-full max-w-[500px] mx-auto opacity-90">
              {headerDisplayText}
              {timeline.header && <span className="animate-pulse ml-1" style={{ textShadow: "0 0 8px #FF2020" }}>█</span>}
            </div>
          </div>
        </div>

        {/* DOMAIN TITLE BLOCK */}
        {timeline.badge && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 100 }} className="mb-10 w-full relative">
            <div className="border border-[#FF2020]/40 bg-[#0a0000]/80 p-6 md:p-8 backdrop-blur-sm relative overflow-hidden shadow-[0_0_20px_rgba(255,32,32,0.1)]">
               <div className="absolute inset-0 bg-[#FF2020]/5 pointer-events-none" />
               <div className="relative z-10 flex flex-col items-center justify-center text-center">
                 <h1 className="text-xl sm:text-3xl md:text-4xl tracking-[0.4em] mb-8 font-bold text-center" style={{ fontFamily: "'Orbitron', sans-serif", color: "#FF2020", textShadow: "0 0 15px rgba(255,32,32,0.8)" }}>
                   {titleText || "B L O C K C H A I N"}
                 </h1>
                 
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-xs tracking-widest mt-2" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                    <div className="flex items-center gap-2">
                       <span className="w-2.5 h-4 bg-[#FF2020]" />
                       <span>SENIOR_TRACK</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="w-2.5 h-4 bg-[#FF2020]" />
                       <span>2 PS AVAILABLE</span>
                    </div>
                 </div>
                 <div className="flex items-center justify-center gap-2 text-xs tracking-widest mt-4" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                    <span className="w-2.5 h-4 bg-[#FF2020]/60" />
                    <span className="text-[#FF2020]/90">CLEARANCE: SENIOR_REQUIRED</span>
                 </div>
               </div>
            </div>
            
            {/* Divider */}
            {timeline.divider && (
              <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.8 }} className="h-[2px] mt-6 mx-auto shadow-[0_0_8px_#FF2020]" style={{ background: "linear-gradient(90deg, transparent, #FF2020, transparent)" }} />
            )}
          </motion.div>
        )}

        {/* PS CARDS */}
        <div className="space-y-8 mt-12">
          <RedPSCard ps={PS_DATA[0]} delay={2300} />
          <RedPSCard ps={PS_DATA[1]} delay={2600} />
        </div>

        {/* NAVIGATION BOTTOM */}
        {timeline.nav && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col md:flex-row justify-between items-center mt-16 gap-6 font-mono text-[10px] sm:text-xs tracking-widest pb-10">
            <Link href="/domains/ai-ml" className="px-4 py-3 border border-[#FF2020]/50 text-[#FF2020] hover:bg-[#FF2020]/20 hover:shadow-[0_0_15px_rgba(255,32,32,0.5)] transition-all uppercase whitespace-nowrap flex items-center gap-2">
              <span>[ ← AI / ML ]</span>
            </Link>
            
            <div className="hidden md:flex px-4 py-3 border border-[#FF2020]/30 text-[#FF2020]/60 cursor-not-allowed uppercase whitespace-nowrap items-center gap-2" title="Already on Senior Track">
              [ ↑ SENIOR TRACK ]
            </div>

            <Link href="/?view=portals" className="px-4 py-3 border border-[#FF2020]/50 text-[#FF2020] hover:bg-[#FF2020]/20 hover:shadow-[0_0_15px_rgba(255,32,32,0.5)] transition-all uppercase whitespace-nowrap flex items-center gap-2">
              <span>[ BACK TO CONSTRUCT → ]</span>
            </Link>
          </motion.div>
        )}

      </div>
    </div>
  );
}
