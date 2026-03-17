"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, ArrowLeft, Clock, ShieldAlert } from "lucide-react";
import Link from "next/link";
import "@fontsource/share-tech-mono";

interface PageLockGuardProps {
  pageKey: string;
  children: React.ReactNode;
}

interface LockInfo {
  locked: boolean;
  scheduledUnlock?: string;
}

export default function PageLockGuard({ pageKey, children }: PageLockGuardProps) {
  const [lockInfo, setLockInfo] = useState<LockInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    fetch(`/api/pagelocks/${encodeURIComponent(pageKey)}`)
      .then((res) => res.json())
      .then((data) => setLockInfo(data))
      .catch(() => setLockInfo({ locked: false }))
      .finally(() => setLoading(false));
  }, [pageKey]);

  // Countdown timer for scheduled unlock
  useEffect(() => {
    if (!lockInfo?.locked || !lockInfo.scheduledUnlock) {
      setCountdown("");
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const unlock = new Date(lockInfo.scheduledUnlock!);
      const diff = unlock.getTime() - now.getTime();

      if (diff <= 0) {
        // Time has passed — unlock
        setLockInfo({ ...lockInfo, locked: false });
        setCountdown("");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const parts = [];
      if (hours > 0) parts.push(`${hours}h`);
      parts.push(`${minutes.toString().padStart(2, "0")}m`);
      parts.push(`${seconds.toString().padStart(2, "0")}s`);

      setCountdown(parts.join(" : "));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [lockInfo]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#020403" }}>
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-sm tracking-widest"
          style={{ color: "#7dffb2", fontFamily: "'Share Tech Mono', monospace" }}
        >
          VERIFYING ACCESS CLEARANCE...
        </motion.div>
      </div>
    );
  }

  // Unlocked — render children
  if (!lockInfo?.locked) {
    return <>{children}</>;
  }

  // Locked — show restriction screen
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#020403" }}>
      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-10"
        style={{
          backgroundImage: "linear-gradient(to bottom, transparent 50%, #ff2020 50%)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* Red tint */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{ background: "radial-gradient(ellipse at center, rgba(255,32,32,0.06) 0%, transparent 70%)" }}
      />

      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)" }}
      />

      <div className="relative z-20 max-w-xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs tracking-widest mb-12 transition-colors group"
          style={{ color: "rgba(159,230,184,0.5)", fontFamily: "'Share Tech Mono', monospace" }}
        >
          <ArrowLeft className="w-4 h-4 group-hover:text-green-400 transition-colors" />
          RETURN TO MAIN TERMINAL
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Terminal window */}
          <div
            className="relative overflow-hidden"
            style={{ background: "rgba(0,10,0,0.7)", border: "1px solid rgba(255,32,32,0.3)" }}
          >
            {/* Scan effect */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,32,32,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />

            {/* Title bar */}
            <div
              className="flex items-center gap-2 px-4 py-2.5"
              style={{ borderBottom: "1px solid rgba(255,32,32,0.2)", background: "rgba(0,0,0,0.5)" }}
            >
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-red-500/40" />
              <div className="w-3 h-3 rounded-full bg-red-500/20" />
              <span
                className="ml-3 text-xs tracking-wider"
                style={{ color: "rgba(255,100,100,0.5)", fontFamily: "'Share Tech Mono', monospace" }}
              >
                system@nexus:~/access-control
              </span>
            </div>

            <div
              className="relative z-10 p-6 sm:p-10 space-y-6"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              {/* Animated shield icon */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="flex justify-center mb-4"
              >
                <div className="relative">
                  <ShieldAlert className="w-16 h-16" style={{ color: "rgba(255,60,60,0.4)" }} />
                  <motion.div
                    animate={{ opacity: [0.3, 0.9, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0"
                    style={{ filter: "drop-shadow(0 0 15px rgba(255,32,32,0.8))" }}
                  >
                    <ShieldAlert className="w-16 h-16" style={{ color: "#ff3c3c" }} />
                  </motion.div>
                </div>
              </motion.div>

              {/* Terminal output */}
              <div className="space-y-2 text-xs text-left max-w-sm mx-auto" style={{ color: "rgba(255,100,100,0.7)" }}>
                <div><span style={{ color: "rgba(255,60,60,0.5)" }}>{">"}</span> Attempting access...</div>
                <div><span style={{ color: "rgba(255,60,60,0.5)" }}>{">"}</span> Authorization check: FAILED</div>
                <div><span style={{ color: "rgba(255,60,60,0.5)" }}>{">"}</span> Security level: MAXIMUM</div>
                <div className="pt-1">
                  <span style={{ color: "rgba(255,60,60,0.5)" }}>{">"}</span>{" "}
                  <span style={{ color: "#ff3c3c" }}>STATUS:</span> PAGE LOCKED BY ADMIN
                </div>
              </div>

              {/* Main message */}
              <div className="pt-2">
                <motion.h1
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="text-2xl sm:text-3xl tracking-[0.3em]"
                  style={{
                    fontFamily: "Glitch, sans-serif",
                    color: "#ff3c3c",
                    textShadow: "0 0 20px rgba(255,32,32,0.5)",
                  }}
                >
                  ACCESS RESTRICTED
                </motion.h1>
              </div>

              <div className="h-px w-32 mx-auto" style={{ background: "linear-gradient(to right, transparent, #ff3c3c, transparent)" }} />

              {/* Scheduled unlock countdown */}
              {lockInfo.scheduledUnlock && countdown && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="pt-2 space-y-3"
                >
                  <div className="flex items-center justify-center gap-2 text-xs" style={{ color: "rgba(255,200,100,0.6)" }}>
                    <Clock className="w-4 h-4" />
                    <span className="tracking-widest">SCHEDULED UNLOCK</span>
                  </div>

                  <div
                    className="text-2xl sm:text-3xl tracking-[0.2em] font-bold"
                    style={{
                      color: "#ffaa33",
                      textShadow: "0 0 15px rgba(255,170,50,0.4)",
                      fontFamily: "'Share Tech Mono', monospace",
                    }}
                  >
                    {countdown}
                  </div>

                  <div className="text-[10px] tracking-widest" style={{ color: "rgba(255,200,100,0.4)" }}>
                    {new Date(lockInfo.scheduledUnlock).toLocaleString()}
                  </div>
                </motion.div>
              )}

              {!lockInfo.scheduledUnlock && (
                <p className="text-xs tracking-widest pt-2" style={{ color: "rgba(255,100,100,0.4)" }}>
                  THIS PAGE HAS BEEN RESTRICTED BY THE SYSTEM ADMINISTRATOR
                </p>
              )}

              {/* Blinking cursor */}
              <div className="flex items-center justify-center gap-2 pt-4">
                <span className="text-xs" style={{ color: "#ff3c3c" }}>$</span>
                <span className="text-xs" style={{ color: "rgba(255,100,100,0.5)" }}>access_denied</span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{ color: "#ff3c3c" }}
                >
                  █
                </motion.span>
              </div>
            </div>
          </div>

          {/* Bottom flavor text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-[10px] tracking-[0.2em] mt-8"
            style={{ color: "rgba(159,230,184,0.2)", fontFamily: "'Share Tech Mono', monospace" }}
          >
            &quot;YOU HAVE TO UNDERSTAND, MOST OF THESE PEOPLE ARE NOT READY TO BE UNPLUGGED.&quot; — MORPHEUS
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
