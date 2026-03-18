"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Code, Database, Link as LinkIcon, Brain } from "lucide-react";
import Link from "next/link";
import PageLockGuard from "@/components/PageLockGuard";
import "@fontsource/share-tech-mono";
import "@fontsource/orbitron";

/* ═══════════════════════════════════════════════════════════════════
   PROBLEM STATEMENTS DATA
   ═══════════════════════════════════════════════════════════════════ */

interface ProblemStatementData {
  id: string;
  title: string;
  description: string;
  domain: string;
  difficulty: string;
}

const PROBLEM_STATEMENTS: ProblemStatementData[] = [
  {
    id: "PS_01",
    title: "CareFlow",
    domain: "web-development",
    difficulty: "JUNIOR",
    description: "Healthcare institutions face increasing pressure to deliver efficient patient care, maintain transparent treatment processes, manage critical resources, and respond effectively to emergencies and climate-related disasters. However, many hospitals operate with fragmented digital systems where patient journey tracking, preventive health education, oxygen monitoring, emergency preparedness, and maternal health management are handled independently or manually. This lack of integration can lead to operational inefficiencies, delayed emergency responses, poor patient awareness, and resource mismanagement, especially during high-demand situations such as pandemics, heatwaves, floods, or mass casualty events.\n\nCareFlow proposes the development of a comprehensive web-based hospital management and patient engagement portal that unifies these critical components into a single, structured platform. The system will provide a Smart Patient Journey & Treatment Visualizer that allows patients to understand their complete treatment pathway—from appointment scheduling and diagnosis to surgery, recovery, and discharge—through interactive workflow mapping and step-by-step procedure explanations. A Preventive and Maternal Health Monitoring module will support proactive healthcare by offering lifestyle risk calculators, pregnancy tracking timelines, vaccination schedules, and child growth monitoring dashboards. To strengthen operational efficiency, the platform will include a Hospital Resource & Oxygen Monitoring Dashboard that tracks real-time bed occupancy, ICU availability, equipment status, and oxygen tank levels, along with graphical visualization of oxygen consumption rates and threshold-based alerts for shortages. Recognizing the growing impact of climate change on public health, CareFlow will also incorporate an Emergency & Climate Disaster Preparedness System that enables hospitals to simulate heatwave-related patient surges, manage flood-response planning, visualize pollution-related respiratory case trends, and coordinate emergency triage workflows. An optional Environmental Monitoring extension can further track biomedical waste generation and promote responsible resource management.",
  },
  {
    id: "PS_02",
    title: "SkyVerse",
    domain: "web-development",
    difficulty: "JUNIOR",
    description: "SkyVerse: An Interactive Web-Based Cosmology & Astronomy Learning Portal is a comprehensive educational platform designed to provide structured, immersive, and scientifically accurate learning in astronomy and cosmology through modern web technologies. The platform integrates an interactive 3D solar system simulation with zoom and orbit animations, a scientific constellation explorer, a 360° star map, detailed planetary science modules, curated astronomical image archives from recognized space agencies, structured educational video content, guided sky observation tools, and Earth climate visualization modules. Users can explore planetary motion, study stellar properties, analyze real space mission imagery, observe celestial events, and understand atmospheric processes such as the greenhouse effect through interactive visual models. By combining animated simulations, multimedia learning resources, and practical observation guidance into a unified digital ecosystem, SkyVerse enhances scientific literacy, promotes hands-on astronomy learning, and strengthens interdisciplinary understanding of planetary systems.",
  },
  {
    id: "PS_01",
    title: "Deepfake & Misinformation Detection",
    domain: "data-science",
    difficulty: "JUNIOR",
    description: "The rapid spread of misinformation and AI-generated deepfake content across digital platforms is eroding public trust, influencing elections, manipulating financial markets, and amplifying social unrest. With the rise of generative AI tools, fabricated text, images, and videos are becoming increasingly difficult to distinguish from authentic content, making automated detection systems a critical necessity. Develop a scalable AI-powered detection system capable of analyzing text, images, and short video inputs to determine authenticity using multimodal machine learning models. The system should generate confidence scores along with explainable reasoning for each prediction, enabling transparency and trust in model decisions. It should also be capable of monitoring real-time social media or streaming data to identify misinformation trends and simulate the spread of manipulated content under different intervention policies. It is necessary to incorporate interactive data visualizations that clearly represent misinformation patterns, model confidence levels, detection accuracy metrics, and propagation networks. Visual dashboards should help users interpret insights effectively and understand the impact of AI-driven interventions. The system must enhance digital trust, promote responsible information consumption, and demonstrate how advanced data science techniques can be leveraged to counter AI-generated threats.",
  },
  {
    id: "PS_02",
    title: "Infrastructure Failure Prediction",
    domain: "data-science",
    difficulty: "JUNIOR",
    description: "Critical infrastructure systems such as power grids, transportation networks, and industrial plants are increasingly vulnerable to unexpected failures due to aging components, overload conditions, and environmental stress. Delayed detection of anomalies can result in cascading failures, large-scale service disruptions, and significant economic losses. Develop a predictive analytics platform that processes real-time sensor and IoT time-series data to detect early warning signals of system failure. The solution should model interconnected infrastructure components using graph-based learning techniques, simulate stress conditions, predict cascading failures, and recommend preventive maintenance strategies based on dynamic risk scoring. It is mandatory to include comprehensive data visualization components such as real-time dashboards, anomaly trend graphs, failure heatmaps, network graphs, and risk distribution charts. These visualizations should enable stakeholders to interpret system health, identify vulnerabilities, and make informed decisions quickly. The platform must demonstrate how data-driven predictive maintenance and advanced analytics can minimize downtime, optimize operational efficiency, and improve long-term infrastructure resilience.",
  },
];

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
   BLUE MATRIX RAIN (CANVAS)
   ═══════════════════════════════════════════════════════════════════ */
const BlueMatrixRain = () => {
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
      ctx.fillStyle = "rgba(0, 4, 10, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        if (Math.random() > 0.95 * speedMultiplier) continue;

        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.shadowBlur = 5;
        ctx.shadowColor = "#0080ff";
        
        const intensity = Math.random();
        if (intensity > 0.9) {
          ctx.fillStyle = "#66b2ff"; 
        } else if (intensity > 0.5) {
          ctx.fillStyle = "#0080ff"; 
        } else {
          ctx.fillStyle = "#004080"; 
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
   BLUE PS CARD
   ═══════════════════════════════════════════════════════════════════ */

function BluePSCard({ ps, delay }: { ps: ProblemStatementData, delay: number }) {
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
        border: "1px solid rgba(0,128,255,0.25)",
        background: "rgba(0,8,16,0.85)",
        fontFamily: "'Share Tech Mono', monospace",
        transition: "box-shadow 0.3s ease, border-color 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 0 25px rgba(0,128,255,0.3)";
        e.currentTarget.style.borderColor = "rgba(0,128,255,0.5)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "rgba(0,128,255,0.25)";
      }}
    >
      {/* Scanline */}
      {!scanDone && (
        <div
          className="absolute left-0 right-0 h-[2px] z-30 pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, #0080ff, #0080ff, transparent)", boxShadow: "0 0 10px #0080ff, 0 0 20px #0080ff", animation: "blueScanSweep 0.8s linear forwards" }}
        />
      )}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-10" style={{ backgroundImage: "linear-gradient(to bottom, transparent 50%, #0080ff 50%)", backgroundSize: "100% 4px" }} />

      <div className="relative z-20 p-5 sm:p-6">
        <div className="text-[11px] tracking-widest mb-3 flex items-center" style={{ color: "#0080ff" }}>
          <span style={{ opacity: 0.5 }} className="mr-2">&gt;</span> {ps.id} ACCESSING...
        </div>
        <div className="h-px w-full max-w-[200px] mb-4" style={{ background: "linear-gradient(to right, #0080ff, transparent)" }} />

        <h3 className="text-lg sm:text-xl tracking-wider mb-4 font-bold" style={{ fontFamily: "'Orbitron', sans-serif", color: "#0080ff", textShadow: "0 0 8px rgba(0,128,255,0.4)" }}>
          {titleText || ps.title}
        </h3>

        <div className="relative">
          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "rgba(0,128,255,0.8)", maxHeight: expanded || !typeDone ? "none" : "5.4em", overflow: "hidden" }}>
            {displayBody}
          </p>
          {!expanded && typeDone && isLongText && (
            <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none" style={{ background: "linear-gradient(transparent, rgba(0,8,16,0.95))" }} />
          )}
        </div>

        {typeDone && isLongText && (
          <button onClick={() => setExpanded(!expanded)} className="mt-4 text-[11px] tracking-widest cursor-pointer hover:underline" style={{ color: "#0080ff", background: "none", border: "none", fontFamily: "'Share Tech Mono', monospace", textShadow: "0 0 6px rgba(0,128,255,0.4)" }}>
            &gt; {expanded ? "COLLAPSE" : "READ_MORE"}
          </button>
        )}

        {!typeDone && <span className="inline-block ml-1 animate-pulse" style={{ color: "#0080ff", fontSize: "14px" }}>█</span>}

        <div className="flex flex-wrap items-center justify-between mt-5 pt-3" style={{ borderTop: "1px solid rgba(0,128,255,0.1)" }}>
          <div className="flex flex-wrap gap-3 text-[10px] tracking-widest" style={{ color: "#0080ff" }}>
            <span>■ DIFFICULTY: {ps.difficulty}</span>
            <span>■ DOMAIN: {ps.domain === "web-development" ? "WEB_DEV" : "DATA_SCIENCE"}</span>
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

export default function DomainPage() {
  const params = useParams();
  const domain = params.domain as string;
  const config = DOMAIN_CONFIG[domain];

  const [timeline, setTimeline] = useState({
    bg: false,
    header: false,
    divider: false,
    badge: false,
    nav: false
  });

  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    // 0.3s -> Blue matrix rain fades in
    setTimeout(() => setTimeline(p => ({ ...p, bg: true })), 300);
    // 1.2s -> Header text types out 
    setTimeout(() => setTimeline(p => ({ ...p, header: true })), 1200);
    // 1.8s -> Horizontal divider
    setTimeout(() => setTimeline(p => ({ ...p, divider: true })), 1800);
    // 2.0s -> Track domain badge
    setTimeout(() => setTimeline(p => ({ ...p, badge: true })), 2000);
    // PS Cards are timed internally via delay
    // 3.0s -> Navigation
    setTimeout(() => setTimeline(p => ({ ...p, nav: true })), 3000);

    const glitchInterval = setInterval(() => {
      // 40% chance every 8s
      if (Math.random() > 0.6) {
        setGlitching(true);
        setTimeout(() => setGlitching(false), 200);
      }
    }, 8000);

    return () => clearInterval(glitchInterval);
  }, []);

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#020403" }}>
        <div className="text-center" style={{ fontFamily: "'Share Tech Mono', monospace", color: "#ff4444" }}>
          <p className="text-xl tracking-widest mb-4">DOMAIN NOT FOUND</p>
          <Link href="/?view=portals" className="text-xs tracking-widest" style={{ color: "rgba(159,230,184,0.5)" }}>
            ← RETURN TO MAIN TERMINAL
          </Link>
        </div>
      </div>
    );
  }

  const domainStatements = PROBLEM_STATEMENTS.filter((ps) => ps.domain === domain);
  const safeLabel = config.label || "UNKNOWN";
  
  const headerRawText = 
`╔═                                        ═╗
  > ACCESSING: DOMAIN_DATABASE
  ■ TRACK: ${config.track}_TRACK
  ■ DOMAIN: ${safeLabel}
  ■ CLEARANCE: ${config.track}_REQUIRED
  ■ STATUS: UNLOCKED
╚═                                        ═╝`;

  const { display: headerDisplayText } = useTypewriter(headerRawText, timeline.header, 40);
  const titleText = useTextScramble(safeLabel, timeline.badge, 40);

  return (
    <PageLockGuard pageKey={`domain:${domain}`}>
      <div className={`min-h-screen min-w-full relative overflow-x-hidden selection:bg-[#0080ff]/30 transition-all duration-75 ${glitching ? "mix-blend-color-dodge translate-x-[3px]" : ""}`} style={{ background: "#00050A", color: "#0080ff", filter: glitching ? "drop-shadow(4px 0 0 rgba(0,128,255,0.8)) drop-shadow(-4px 0 0 rgba(0,255,128,0.5))" : "none" }}>
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes blueScanSweep {
            0% { top: 0; opacity: 1; }
            90% { top: 100%; opacity: 0.8; }
            100% { top: 100%; opacity: 0; }
          }
        `}} />

        {/* MATRIX BACKGROUND */}
        {timeline.bg && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}><BlueMatrixRain /></motion.div>}

        {/* SUBTLE BLUE SCANLINE OVERLAY */}
        <div className="fixed inset-0 pointer-events-none z-10 opacity-5" style={{ background: "repeating-linear-gradient(transparent, transparent 2px, #0080ff 2px, #0080ff 4px)" }} />

        {/* RADIAL GLOW */}
        <div className="fixed inset-0 pointer-events-none z-0" style={{ background: "radial-gradient(ellipse at center, rgba(0,128,255,0.15) 0%, transparent 60%)" }} />

        {/* CRT VIGNETTE */}
        <div className="fixed inset-0 pointer-events-none z-[15]" style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,4,10,0.8) 100%)" }} />

        {/* WARNING WATERMARK */}
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-[5] overflow-hidden opacity-[0.03]">
          <div className="transform -rotate-45 whitespace-nowrap text-[150px] sm:text-[200px] font-black tracking-widest leading-none pointer-events-none uppercase" style={{ color: "#0080ff", fontFamily: "'Share Tech Mono', monospace" }}>
             JUNIOR_CLEARANCE_REQUIRED JUNIOR_CLEARANCE_REQUIRED
          </div>
        </div>

        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 font-mono">
          
          {/* PAGE HEADER BLOCK */}
          <div className="mb-12">
            <div className="relative max-w-2xl mx-auto flex items-center justify-center min-h-[160px]" style={{ fontFamily: "'Share Tech Mono', monospace", color: "#0080ff", textShadow: "0 0 5px rgba(0,128,255,0.5)" }}>
              <div className="text-[10px] sm:text-sm leading-loose sm:leading-relaxed whitespace-pre font-bold overflow-x-auto w-full max-w-[500px] mx-auto opacity-90">
                {headerDisplayText}
                {timeline.header && <span className="animate-pulse ml-1" style={{ textShadow: "0 0 8px #0080ff" }}>█</span>}
              </div>
            </div>
          </div>

          {/* DOMAIN TITLE BLOCK */}
          {timeline.badge && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 100 }} className="mb-10 w-full relative">
              <div className="border border-[#0080ff]/40 bg-[#00050a]/80 p-6 md:p-8 backdrop-blur-sm relative overflow-hidden shadow-[0_0_20px_rgba(0,128,255,0.1)]">
                 <div className="absolute inset-0 bg-[#0080ff]/5 pointer-events-none" />
                 <div className="relative z-10 flex flex-col items-center justify-center text-center">
                   <h1 className="text-xl sm:text-3xl md:text-4xl tracking-[0.2em] mb-8 font-bold text-center uppercase" style={{ fontFamily: "'Orbitron', sans-serif", color: "#0080ff", textShadow: "0 0 15px rgba(0,128,255,0.8)" }}>
                     {titleText}
                   </h1>
                   
                   <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-xs tracking-widest mt-2" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                      <div className="flex items-center gap-2">
                         <span className="w-2.5 h-4 bg-[#0080ff]" />
                         <span>{config.track}_TRACK</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="w-2.5 h-4 bg-[#0080ff]" />
                         <span>{domainStatements.length} PS AVAILABLE</span>
                      </div>
                   </div>
                   <div className="flex items-center justify-center gap-2 text-xs tracking-widest mt-4" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                      <span className="w-2.5 h-4 bg-[#0080ff]/60" />
                      <span className="text-[#0080ff]/90">CLEARANCE: {config.track}_REQUIRED</span>
                   </div>
                 </div>
              </div>
              
              {/* Divider */}
              {timeline.divider && (
                <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.8 }} className="h-[2px] mt-6 mx-auto shadow-[0_0_8px_#0080ff]" style={{ background: "linear-gradient(90deg, transparent, #0080ff, transparent)" }} />
              )}
            </motion.div>
          )}

          {/* PS CARDS */}
          {domainStatements.length > 0 ? (
            <div className="space-y-8 mt-12">
              {domainStatements.map((ps, idx) => (
                <BluePSCard key={idx} ps={ps} delay={2300 + idx * 300} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 mt-12" style={{ color: "#0080ff", fontFamily: "'Share Tech Mono', monospace" }}>
                <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.5, repeat: Infinity }}>
                  PROBLEM STATEMENTS WILL BE RELEASED SOON
                </motion.p>
            </div>
          )}

          {/* NAVIGATION BOTTOM */}
          {timeline.nav && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col md:flex-row justify-between items-center mt-16 gap-6 font-mono text-[10px] sm:text-xs tracking-widest pb-10">
              <Link href="/?view=portals" className="px-4 py-3 border border-[#0080ff]/50 text-[#0080ff] hover:bg-[#0080ff]/20 hover:shadow-[0_0_15px_rgba(0,128,255,0.5)] transition-all uppercase whitespace-nowrap flex items-center gap-2">
                [ ← BACK TO CONSTRUCT ]
              </Link>
              
              <Link 
                href={domain === "web-development" ? "/domains/data-science" : "/domains/web-development"} 
                className="hidden md:flex px-4 py-3 border border-[#0080ff]/50 text-[#0080ff] hover:bg-[#0080ff]/20 hover:shadow-[0_0_15px_rgba(0,128,255,0.5)] transition-all uppercase whitespace-nowrap items-center gap-2"
              >
                [ {domain === "web-development" ? "DATA SCIENCE" : "WEB DEV"} ]
              </Link>

              <Link href="/domains/ai-ml" className="px-4 py-3 border border-[#0080ff]/50 text-[#0080ff] hover:bg-[#0080ff]/20 hover:shadow-[0_0_15px_rgba(0,128,255,0.5)] transition-all uppercase whitespace-nowrap flex items-center gap-2">
                [ SENIOR TRACK → ]
              </Link>
            </motion.div>
          )}

        </div>
      </div>
    </PageLockGuard>
  );
}
