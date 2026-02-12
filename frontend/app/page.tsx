"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import "@fontsource/orbitron/600.css";

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
  const style = document.createElement("style");
  style.textContent = `
    @font-face {
      font-family: "Glitch";
      src: url("/fonts/Hacked.ttf") format("truetype");
      font-weight: normal;
      font-style: normal;
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
  `;
  document.head.appendChild(style);

  return () => {
    document.head.removeChild(style);
  };
}, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "01";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
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

    const interval = setInterval(draw, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-40"
    />
  );
}

export default function TeaserPage() {
  const [showText, setShowText] = useState(false);
  const [showGlitch, setShowGlitch] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [phase, setPhase] = useState(0);

  // Add CSS for glitch animations - FIXED
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
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
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const sequence = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowText(true);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowGlitch(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setShowGlitch(false);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPhase(1);
      
      for (let i = 3; i > 0; i--) {
        setCountdown(i);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setPhase(2);
    };

    sequence();
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden relative">
      <MatrixRain />
      
      {/* Flickering screen effect */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.02, 0] }}
          transition={{
            repeat: Infinity,
            repeatDelay: Math.random() * 15 + 5,
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

      <main className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Phase 0: Initial loading */}
        {phase === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-8"
          >
            {showText ? (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2 }}
                >
                  <h1 className="text-4xl md:text-6xl tracking-widest mb-4">
                    SYSTEM.<span className="text-white">INITIALIZING</span>
                  </h1>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                  className="space-y-2"
                >
                  <p className="text-green-300 text-lg">
                    [ACCESSING SECURE CHANNEL]
                  </p>
                  <div className="flex items-center justify-center gap-2">
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

        {/* Phase 1: Countdown */}
        {phase === 1 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <motion.div
              key={countdown}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-[180px] md:text-[240px] font-bold leading-none"
            >
              {countdown}
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl mt-8 tracking-widest"
            >
              PREPARE FOR DOWNLOAD
            </motion.p>
          </motion.div>
        )}

        {/* Phase 2: Main teaser */}
        {phase === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl space-y-12"
          >
            <div className="relative">
              <motion.h1
                animate={{
                  x: showGlitch ? [-2, 2, -1, 1, 0] : 0,
                }}
                transition={{ duration: 0.3 }}
                className="text-5xl md:text-8xl tracking-tighter mb-4"
                style={{ 
                fontFamily: "Glitch, sans-serif",
                fontStyle: "normal",
                letterSpacing: "15px",
                 
              }}
                
                >
                
                <span className="text-green-400">TINKERTHON</span>
                <span className="text-white">'26</span>
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
            </div>

            <div className="space-y-8">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl md:text-2xl tracking-wide leading-relaxed"
              >
                THE MATRIX HAS YOU NEO...
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="space-y-4"
              >
                <p className="text-green-300/70 text-lg">
                  [Coming Soon...]
                </p>
                <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-green-400 to-transparent" />
 
              </motion.div>
            </div>

            {/* Pulsing CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
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
                <button className="px-12 py-4 bg-black border-2 border-green-400 text-green-400 text-xl tracking-widest hover:bg-green-400/10 transition-colors duration-300">
                  <span className="animate-pulse">ENTER</span>
                </button>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
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
          className="fixed bottom-0 left-0 right-0 p-6 text-sm"
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 animate-pulse" />
                <span>CONNECTION: ENCRYPTED</span>
              </div>
              <div className="text-green-300/50">
                <span>ACCESS: </span>
                <span className="animate-pulse">RESTRICTED</span>
              </div>
            </div>
            
            <div className="mt-4 font-mono text-xs text-green-300/30">
              <div>root@matrix:~$ █</div>
            </div>
          </div>
        </motion.footer>
      </main>
    </div>
  );
}