"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import "@fontsource/orbitron/600.css";
import "@fontsource/share-tech-mono";
import PortalHallway from "@/components/ui/PortalHallway";
import AboutSection from "@/components/ui/AboutSection";
import PlaceholderSection from "@/components/ui/PlaceholderSection";
import ConstructSection from "@/components/ui/ConstructSection";
import QuoteTransition from "@/components/ui/QuoteTransition";
import TimelineSection from "@/components/ui/TimelineSection";
import SponsorsSection from "@/components/ui/SponsorsSection";
import { PORTALS } from "@/lib/portals";

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "01";
    const fontSize = 14;
    let columns = Math.ceil(canvas.width / fontSize);
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    const draw = () => {
      ctx.fillStyle = "rgba(0, 10, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ff41";
      ctx.font = `${fontSize}px "Courier New", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = "#00ff41";
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        const speed = 0.5 + Math.random() * 0.5;
        drops[i] += speed;
      }
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const newColumns = Math.ceil(canvas.width / fontSize);
      if (newColumns > drops.length) {
        for (let i = drops.length; i < newColumns; i++) {
          drops[i] = Math.random() * -100;
        }
      }
    };
    window.addEventListener("resize", handleResize);

    const interval = setInterval(draw, 30);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-40"
    />
  );
}

type ViewType = "hero" | "portals" | "about" | "domains" | "timeline" | "sponsors" | "registration" | "quote";

const SECTION_META: Record<string, { title: string; subtitle: string }> = {
  domains: { title: "THE CONSTRUCT", subtitle: "EXPLORE DOMAINS" },
  timeline: { title: "THE DESCENT", subtitle: "EVENT TIMELINE" },
  sponsors: { title: "THE ALLIES", subtitle: "OUR SPONSORS" },
  registration: { title: "REGISTRATION GROUND", subtitle: "USER REGISTRATION" },
};

const RETURN_QUOTE = "Every exit is an entry somewhere else.";
const HERO_RETURN_QUOTE = "Follow the white rabbit.";
const QUOTE_DURATION = 2500;

function TopLeftHud({ show, activeView }: { show: boolean, activeView?: string }) {
  const [ping, setPing] = useState(12);

  useEffect(() => {
    if (!show) return;

    const interval = setInterval(() => {
      setPing(Math.floor(Math.random() * 18) + 8);
    }, 2000);

    return () => clearInterval(interval);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="fixed top-4 left-4 z-50"
        >
          <div className="relative w-[280px] px-4 py-3 overflow-hidden" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", boxShadow: "0 0 18px rgba(0,255,65,0.2)" }}>
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(to bottom, rgba(0,255,65,0.08) 1px, transparent 1px)", backgroundSize: "100% 3px", opacity: 0.16 }} />

            <motion.div
              className="absolute right-3 top-7 w-20 h-20 rounded-full border border-green-400/30 pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              style={{ opacity: 0.3 }}
            />

            <motion.div
              className="absolute inset-y-2 left-0 w-8 pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent, rgba(0,255,65,0.35), transparent)", animation: "hud-sweep 3.8s linear infinite" }}
            />

            <div className="absolute top-0 left-0 w-5 h-4 border-t-2 border-l-2 border-green-400" />
            <div className="absolute top-0 right-0 w-5 h-4 border-t-2 border-r-2 border-green-400" />
            <div className="absolute bottom-0 left-0 w-5 h-4 border-b-2 border-l-2 border-green-400" />
            <div className="absolute bottom-0 right-0 w-5 h-4 border-b-2 border-r-2 border-green-400" />

            <div className="relative z-10 font-mono text-[11px] tracking-[0.12em] text-green-400/95">
              <div className="flex items-center justify-between h-5">
                <span>◈ SYS_ID: NX-26</span>
                <span className="flex items-center gap-1.5"><span style={{ animation: "hud-live-blink 1s step-end infinite" }}>●</span>LIVE</span>
              </div>

              <div className="h-px bg-green-400/45 my-2" />

              <div className="flex items-center gap-2 h-9">
                <Image
                  src="/images/nexus-logo.png"
                  alt="Nexus Logo"
                  width={36}
                  height={36}
                  style={{ filter: "brightness(0) invert(1) drop-shadow(0 0 6px #00ff41)" }}
                />
                <span className="text-green-300">AUTH NODE</span>
              </div>

              <div className="h-px bg-green-400/45 my-2" />

              <div className="h-4">&gt; TUNNEL LINK ESTABLISHED</div>

              <div className="h-px bg-green-400/45 my-2" />

              <div className="flex items-center justify-between h-5">
                <span>PING: {ping}ms</span>
                <span>▮▮▮▮ SIGNAL</span>
              </div>

              {(activeView === "hero" || activeView === "portals") && (
                <div className="mt-1 h-4 text-[12px] tracking-[0.1em] text-green-300/70">
                  <span className="text-green-400/60">:</span>
                  ORGANIZED BY TINKERER'S ECS
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function TeaserPage() {
  const [showText, setShowText] = useState(false);
  const [showGlitch, setShowGlitch] = useState(false);
  const [phase, setPhase] = useState(0);
  const [activeView, setActiveView] = useState<ViewType>("hero");
  const [currentQuote, setCurrentQuote] = useState("");
  const [pendingView, setPendingView] = useState<ViewType>("portals");
  const flickerRepeatDelay = 10;
  const showNavbar = activeView !== "hero" || phase === 2;

  // Check URL params — skip boot if returning from external page
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("view") === "portals") {
      setPhase(2);
      setActiveView("portals");
      // Clean the URL
      window.history.replaceState({}, "", "/");
    }
  }, []);

  const handlePortalSelect = (sectionId: string) => {
    // Direct navigation to portals (from "ENTER THE SYSTEM") — no quote needed
    if (sectionId === "portals") {
      setActiveView("portals");
      return;
    }

    const portal = PORTALS.find((p) => p.sectionId === sectionId);
    const quote = sectionId === "hero" ? HERO_RETURN_QUOTE : (portal?.quote || "");

    setCurrentQuote(quote);
    setPendingView(sectionId as ViewType);
    setActiveView("quote");
  };

  const handleReturn = () => {
    setCurrentQuote(RETURN_QUOTE);
    setPendingView("portals");
    setActiveView("quote");
  };

  // After quote transition ends, switch to the pending view
  useEffect(() => {
    if (activeView !== "quote") return;

    const timer = setTimeout(() => {
      if (pendingView === "hero") {
        setPhase(0);
        setShowText(false);
        setShowGlitch(false);
      }
      setActiveView(pendingView);
    }, QUOTE_DURATION);

    return () => clearTimeout(timer);
  }, [activeView, pendingView]);

  // Add CSS for glitch animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: "Glitch";
        src: url("/fonts/Hacked.ttf") format("truetype");
      }
      @keyframes pulse-glow {
        0%, 100% { 
          box-shadow: 0 0 20px #00ff41,
                     0 0 40px #00ff41;
        }
        50% { 
          box-shadow: 0 0 10px #00ff41,
                     0 0 30px #00ff41;
        }
      }
      @keyframes logo-breathe {
        0%, 100% { opacity: 0.85; }
        50% { opacity: 1.0; }
      }
      @keyframes logo-scanline {
        0% { top: -10%; opacity: 0.7; }
        80% { opacity: 0.7; }
        100% { top: 110%; opacity: 0; }
      }
      @keyframes logo-glitch {
        0%, 95%, 100% {
          filter: drop-shadow(0 0 10px #00ff41);
          transform: translate(0, 0);
        }
        95.5% {
          filter: drop-shadow(2px 0 0 #ff0000) drop-shadow(-2px 0 0 #00ffff);
          transform: translate(2px, 0);
        }
        96% {
          filter: drop-shadow(-2px 0 0 #ff0000) drop-shadow(2px 0 0 #00ffff);
          transform: translate(-2px, 0);
        }
        96.5% {
          filter: drop-shadow(2px 0 0 #00ff00) drop-shadow(-2px 0 0 #0000ff);
          transform: translate(1px, -1px);
        }
        97% {
          filter: drop-shadow(0 0 10px #00ff41);
          transform: translate(0, 0);
        }
      }
      @keyframes hud-sweep {
        0% { transform: translateX(-120%); opacity: 0; }
        25% { opacity: 0.45; }
        60% { opacity: 0.15; }
        100% { transform: translateX(260%); opacity: 0; }
      }
      @keyframes hud-beacon {
        0%, 100% { opacity: 0.35; box-shadow: 0 0 0 0 rgba(0,255,65,0.35); }
        50% { opacity: 1; box-shadow: 0 0 0 6px rgba(0,255,65,0); }
      }
      @keyframes hud-live-blink {
        0%, 49% { opacity: 1; }
        50%, 100% { opacity: 0.3; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (activeView !== "hero" || phase !== 0) return;

    const sequence = async () => {
      await new Promise(r => setTimeout(r, 800));
      setShowText(true);

      await new Promise(r => setTimeout(r, 2800));
      setShowGlitch(true);
      await new Promise(r => setTimeout(r, 300));
      setShowGlitch(false);

      await new Promise(r => setTimeout(r, 1800));
      setPhase(2);
    };

    sequence();
  }, [activeView, phase]);

  return (
    <div
      className={`bg-black text-green-400 font-mono relative h-screen ${(activeView === "timeline" || activeView === "sponsors" || activeView === "portals" || activeView === "domains")
          ? "overflow-y-auto overflow-x-hidden"
          : "overflow-hidden"
        }`}
    >
      <MatrixRain />

      {/* Flickering screen effect */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.02, 0] }}
          transition={{
            repeat: Infinity,
            repeatDelay: flickerRepeatDelay,
            duration: 0.08,
          }}
        />
      </div>

      {/* Scan lines */}
      <div
        className="fixed inset-0 z-10 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to bottom, transparent 50%, #00ff41 50%)`,
          backgroundSize: "100% 4px",
        }}
      />

      <TopLeftHud show={showNavbar} activeView={activeView} />

      <AnimatePresence mode="wait">
        {activeView === "hero" && (
          <motion.main
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="relative z-20 flex flex-col items-center justify-center h-screen px-6"
          >
            {/* Phase 0: System Initializing */}
            {phase === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="text-center space-y-8"
              >
                {showText ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    >
                      <h1 className="text-2xl sm:text-4xl md:text-6xl tracking-widest mb-4">
                        SYSTEM.<span className="text-white">INITIALIZING</span>
                      </h1>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2, duration: 1.2 }}
                      className="space-y-2"
                    >
                      <p className="text-green-300 text-sm sm:text-lg">
                        [ACCESSING SECURE CHANNEL]
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>ESTABLISHING CONNECTION...</span>
                      </div>
                    </motion.div>
                  </>
                ) : (
                  <div className="h-32" />
                )}
              </motion.div>
            )}

            {/* Phase 2: Main Hero */}
            {phase === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                className="text-center max-w-3xl space-y-6 sm:space-y-12 px-2"
              >
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.0, ease: "easeOut" }}
                    className="mb-4 sm:mb-6 flex flex-col items-center"
                  >
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                      <Image src="/assets/tink.png" alt="Tinkerer's Lab" width={60} height={60} className="object-contain" />
                      <p className="text-lg sm:text-2xl md:text-3xl tracking-wide leading-relaxed font-bold text-center" style={{ color: "rgba(0,230,118,0.6)" }}>
                        Department of Electronics and Computer Science
                      </p>
                      <Image src="/assets/ves.png" alt="VES" width={60} height={60} className="object-contain" />
                    </div>
                    <p className="text-base sm:text-xl md:text-2xl tracking-wide leading-relaxed mt-2 sm:mt-4 text-center" style={{ color: "rgba(125,255,178,0.6)" }}>
                      Tinkerer&apos;s Lab ECS presents
                    </p>
                  </motion.div>

                  <motion.h1
                    animate={{
                      x: showGlitch ? [-2, 2, -1, 1, 0] : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="text-3xl sm:text-5xl md:text-8xl tracking-tighter mb-4"
                    style={{
                      fontFamily: "Glitch, sans-serif",
                      fontStyle: "normal",
                      letterSpacing: "clamp(4px, 2vw, 15px)",
                    }}
                  >
                    <span className="text-green-400">NEXUS</span>
                    <span className="text-white">&apos;26</span>
                  </motion.h1>

                  {showGlitch && (
                    <motion.div
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(90deg, #ff0000, #00ff00, #0000ff)",
                        mixBlendMode: "screen",
                        filter: "blur(2px)",
                      }}
                    />
                  )}
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-xs sm:text-sm text-white tracking-[0.2em] mt-2"
                  >
                    CONNECTING MINDS TO CREATE SOLUTION
                  </motion.p>
                </div>

                <div className="space-y-8">
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
                    className="text-base sm:text-xl md:text-2xl tracking-wide leading-relaxed"
                  >
                    THE MATRIX HAS YOU NEO...
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 1.5, duration: 1.0, ease: "easeOut" }}
                    className="space-y-4"
                  >
                    <p className="text-green-300/70 text-lg">
                    </p>
                    <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-green-400 to-transparent" />
                  </motion.div>
                </div>

                {/* Pulsing CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.2, duration: 1.0, ease: "easeOut" }}
                  className="pt-8"
                >
                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 20px #00ff41",
                        "0 0 40px #00ff41",
                        "0 0 20px #00ff41",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    className="inline-block"
                  >
                    <button
                      onClick={() => handlePortalSelect("portals")}
                      className="px-6 sm:px-12 py-3 sm:py-4 bg-black border-2 border-green-400 text-green-400 text-base sm:text-xl tracking-widest hover:bg-green-400/10 transition-colors duration-300 cursor-pointer"
                    >
                      <span className="animate-pulse">ENTER THE SYSTEM</span>
                    </button>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.2, duration: 1.0 }}
                    className="mt-6 text-sm text-green-300/50 tracking-widest"
                  >
                    FOLLOW THE WHITE RABBIT
                  </motion.p>
                </motion.div>
              </motion.div>
            )}

            {/* Terminal footer */}
            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 2 }}
              className="fixed bottom-0 left-0 right-0 p-3 sm:p-6 text-[10px] sm:text-sm"
            >
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-0">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 animate-pulse" />
                    <span>CONNECTION: ENCRYPTED</span>
                  </div>
                  <div className="text-green-300/50">
                    <span>ACCESS: </span>
                    <span className="animate-pulse">RESTRICTED</span>
                  </div>
                </div>

                <div className="mt-2 sm:mt-4 font-mono text-xs text-green-300/30 hidden sm:block">
                  <div>root@matrix:~$ █</div>
                </div>
              </div>
            </motion.footer>
          </motion.main>
        )}

        {activeView === "portals" && (
          <PortalHallway key="portals" onSelect={handlePortalSelect} />
        )}

        {activeView === "quote" && (
          <QuoteTransition key={`quote-${currentQuote}`} quote={currentQuote} />
        )}

        {activeView === "about" && (
          <AboutSection key="about" onReturn={handleReturn} />
        )}

        {activeView === "timeline" && (
          <TimelineSection key="timeline" onReturn={handleReturn} />
        )}

        {activeView === "domains" && (
          <ConstructSection key="domains" onReturn={handleReturn} />
        )}

        {activeView === "sponsors" && (
          <SponsorsSection key="sponsors" onReturn={handleReturn} />
        )}

        {activeView === "registration" && (
          <PlaceholderSection
            key="registration"
            title={SECTION_META["registration"]?.title || "REGISTRATION"}
            subtitle={SECTION_META["registration"]?.subtitle || ""}
            onReturn={handleReturn}
          />
        )}
      </AnimatePresence>
    </div>
  );
}