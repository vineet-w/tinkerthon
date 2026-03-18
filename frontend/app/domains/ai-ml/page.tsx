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
    title: "REAL-TIME BOX COUNTING ALGORITHM",
    difficulty: "SENIOR",
    domain: "AI_/_ML",
    description: "In modern warehouse and logistics operations, manual counting of packaged boxes being placed into large containers is still widely practiced. Manual counting is error-prone and does not provide verifiable proof of packing operations. Industrial vision systems that automate counting are often expensive and require controlled environments such as conveyor belts and fixed camera setups.\n\nThis hackathon challenge focuses on developing a robust AI-based box counting algorithm capable of operating in real-world warehouse conditions where boxes are manually placed inside a larger carton or container. The system must function with different camera angles, heights, lighting conditions, and box arrangements.\n\nDesign and implement a real-time box counting algorithm that runs in a Ubuntu-based Linux environment. Participants will be provided with a dataset and a pre-trained box detection model. Participants must design their own counting algorithm to determine the number of boxes present in the container. The solution should be designed to deploy on a Raspberry Pi system seamlessly.\n\nParticipants will be provided with recorded video datasets representing a carton or container being filled with smaller boxes of different sizes. The counting logic must update dynamically when a new box is added, a box is removed, or boxes are rearranged or stacked.\n\nFunctional Requirements:\n- Accept video input from the provided dataset\n- Use the provided pre-trained YOLO-based model for box detection\n- Design a custom counting algorithm to maintain the current number of boxes\n- Handle stacked boxes and partial occlusions\n- Maintain stable counting even if some frames are missed\n- Display detection output with box count overlay\n\nTechnical Constraints:\n- Development must be performed in a Ubuntu/Linux environment\n- The provided YOLO-based model must be used for box detection\n- No cloud-based detection services are allowed\n- Solution should run on Raspberry Pi hardware without major modification\n- System should target efficient real-time performance\n- Counting accuracy should target ≥95%\n\nExpected Deliverables:\n- Working box counting algorithm\n- Demonstration using the provided dataset\n- Performance metrics (FPS and accuracy)\n- Source code and model integration\n- README with setup and execution instructions",
  },
  {
    id: "PS_02",
    title: "WAREHOUSE PACKING MANAGEMENT SYSTEM",
    difficulty: "SENIOR",
    domain: "AI_/_ML",
    description: "Beyond counting boxes, warehouse operations require traceability and verification of packing activities. A complete system should allow operators to manage packing sessions, record video evidence, and store structured data about packing operations.\n\nThis challenge focuses on building a full system that integrates a Raspberry Pi-based box counting algorithm with a web application that manages sessions, records video, stores data, and generates packing reports.\n\nDevelop a Linux-based system where the box counting algorithm and a web application operate together to manage and record packing operations. Object detection will run in a Linux environment while a web application controls the system and displays results.\n\nFunctional Requirements:\n\nApplication Interface:\n- Start and stop packing sessions\n- Display live video feed\n- Display real-time box count\n- Adjust YOLO detection parameters (confidence threshold etc.)\n\nDatabase System:\n- Store timestamp, Operator ID, Batch ID, Box count, Detection logs\n\nVideo Storage:\n- Record compressed video clips during packing sessions\n- Store detection overlay video\n- Retain recordings for one month\n- Automatically archive or delete old recordings\n\nChallan Generation:\n- Generate packing report containing Batch ID, Operator ID, Date & Time, and Final Box Count\n- Include reference to recorded video\n- Export report as PDF\n\nTechnical Constraints:\n- Object detection and processing must run in a Linux environment\n- A web application must control the system and display real-time box count\n- The web application may be developed using any framework or IDE\n- The application must communicate with the Linux detection system\n- The system must generate a PDF challan containing required packing details\n- No external cloud services allowed\n\nExpected Deliverables:\n- Working web or mobile application\n- Integration with the Linux-based box counting system\n- Local database implementation\n- Video recording and compression system\n- Automated PDF challan generation\n- Demonstration of the full workflow\n\nEvaluation Focus:\n- Accuracy of box counting\n- System robustness in real-world conditions\n- Edge performance optimization\n- Quality of system integration\n- Usability of the application",
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

export default function AIMLPage() {
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
    // PS Cards are timed internally via \`delay\` (2300 and 2600)
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
  ■ DOMAIN: ARTIFICIAL_INTELLIGENCE / ML
  ■ CLEARANCE: SENIOR_REQUIRED
  ■ STATUS: UNLOCKED
╚═                                        ═╝`;

  const { display: headerDisplayText } = useTypewriter(headerRawText, timeline.header, 40);
  const titleText = useTextScramble("A R T I F I C I A L   I N T E L L I G E N C E  /  M L", timeline.badge, 40);

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
                 <h1 className="text-xl sm:text-3xl md:text-4xl tracking-[0.2em] mb-8 font-bold text-center" style={{ fontFamily: "'Orbitron', sans-serif", color: "#FF2020", textShadow: "0 0 15px rgba(255,32,32,0.8)" }}>
                   {titleText || "A R T I F I C I A L   I N T E L L I G E N C E  /  M L"}
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
            <Link href="/?view=portals" className="px-4 py-3 border border-[#FF2020]/50 text-[#FF2020] hover:bg-[#FF2020]/20 hover:shadow-[0_0_15px_rgba(255,32,32,0.5)] transition-all uppercase whitespace-nowrap flex items-center gap-2">
              [ ← BACK TO CONSTRUCT ]
            </Link>
            
            <div className="hidden md:flex px-4 py-3 border border-[#FF2020]/30 text-[#FF2020]/60 cursor-not-allowed uppercase whitespace-nowrap items-center gap-2" title="Already on Senior Track">
              [ ↑ SENIOR TRACK ]
            </div>

            <Link href="/domains/blockchain" className="px-4 py-3 border border-[#FF2020]/50 text-[#FF2020] hover:bg-[#FF2020]/20 hover:shadow-[0_0_15px_rgba(255,32,32,0.5)] transition-all uppercase whitespace-nowrap flex items-center gap-2">
              [ BLOCKCHAIN → ]
            </Link>
          </motion.div>
        )}

      </div>
    </div>
  );
}
