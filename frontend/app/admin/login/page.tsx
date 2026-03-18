"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Lock, User, AlertTriangle } from "lucide-react";
import "@fontsource/share-tech-mono";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);

  const BOOT_SEQUENCE = [
    "INITIALIZING SECURE TERMINAL...",
    "LOADING ENCRYPTION PROTOCOLS...",
    "ESTABLISHING SECURE CHANNEL...",
    "SYSTEM READY. AWAITING CREDENTIALS.",
  ];

  // Boot sequence on mount
  useState(() => {
    let lineIdx = 0;
    const interval = setInterval(() => {
      if (lineIdx < BOOT_SEQUENCE.length) {
        setBootLines((prev) => [...prev, BOOT_SEQUENCE[lineIdx]]);
        lineIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowForm(true), 400);
      }
    }, 500);
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "ACCESS DENIED");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setError("CONNECTION FAILED: System unreachable");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
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

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.8) 100%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 w-full max-w-lg"
      >
        {/* Terminal window */}
        <div
          className="rounded-md overflow-hidden"
          style={{
            background: "rgba(0, 10, 0, 0.85)",
            border: "1px solid rgba(0,230,118,0.3)",
            boxShadow: "0 0 40px rgba(0,230,118,0.1), inset 0 0 80px rgba(0,0,0,0.5)",
          }}
        >
          {/* Title bar */}
          <div
            className="flex items-center gap-2 px-4 py-2.5"
            style={{
              borderBottom: "1px solid rgba(0,230,118,0.15)",
              background: "rgba(0,0,0,0.6)",
            }}
          >
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span
              className="ml-3 text-xs font-mono tracking-wider"
              style={{ color: "rgba(159,230,184,0.45)" }}
            >
              root@matrix:~/admin_access
            </span>
            <Lock className="ml-auto w-3.5 h-3.5" style={{ color: "rgba(0,230,118,0.4)" }} />
          </div>

          {/* Body */}
          <div
            className="p-6 sm:p-8"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          >
            {/* Header */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl sm:text-3xl tracking-widest mb-6 text-center"
              style={{
                fontFamily: "Glitch, sans-serif",
                color: "#7dffb2",
                textShadow: "0 0 10px rgba(0,230,118,0.4)",
              }}
            >
              SYSTEM ACCESS
            </motion.h1>

            {/* Boot sequence lines */}
            <div className="mb-6 space-y-1 text-xs" style={{ color: "rgba(159,230,184,0.5)" }}>
              {bootLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span style={{ color: "rgba(0,230,118,0.4)" }}>{">"}</span> {line}
                </motion.div>
              ))}
            </div>

            {/* Login form */}
            {showForm && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                onSubmit={handleLogin}
                className="space-y-5"
              >
                {/* Username */}
                <div>
                  <label
                    className="block text-xs tracking-widest mb-2"
                    style={{ color: "rgba(159,230,184,0.6)" }}
                  >
                    USER_ID
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: "rgba(0,230,118,0.4)" }}
                    />
                    <input
                      id="admin-username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 text-sm tracking-wider outline-none"
                      style={{
                        background: "rgba(0,20,0,0.6)",
                        border: "1px solid rgba(0,230,118,0.2)",
                        color: "#7dffb2",
                        fontFamily: "'Share Tech Mono', monospace",
                      }}
                      placeholder="enter_username"
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    className="block text-xs tracking-widest mb-2"
                    style={{ color: "rgba(159,230,184,0.6)" }}
                  >
                    ACCESS_KEY
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: "rgba(0,230,118,0.4)" }}
                    />
                    <input
                      id="admin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 text-sm tracking-wider outline-none"
                      style={{
                        background: "rgba(0,20,0,0.6)",
                        border: "1px solid rgba(0,230,118,0.2)",
                        color: "#7dffb2",
                        fontFamily: "'Share Tech Mono', monospace",
                      }}
                      placeholder="••••••••••"
                      required
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-3 py-2 text-xs"
                    style={{
                      background: "rgba(255,0,0,0.1)",
                      border: "1px solid rgba(255,50,50,0.3)",
                      color: "#ff4444",
                    }}
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    {error}
                  </motion.div>
                )}

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 text-sm tracking-[0.3em] uppercase font-bold cursor-pointer transition-all duration-300 flex items-center justify-center gap-2"
                  style={{
                    background: loading ? "rgba(0,230,118,0.1)" : "rgba(0,230,118,0.15)",
                    border: "1px solid rgba(0,230,118,0.4)",
                    color: "#7dffb2",
                    fontFamily: "'Share Tech Mono', monospace",
                    boxShadow: "0 0 15px rgba(0,230,118,0.1)",
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      AUTHENTICATING...
                    </>
                  ) : (
                    "INITIATE LOGIN"
                  )}
                </motion.button>

                {/* Footer text */}
                <p
                  className="text-center text-[10px] tracking-widest mt-4"
                  style={{ color: "rgba(159,230,184,0.3)" }}
                >
                  AUTHORIZED PERSONNEL ONLY • ENCRYPTED CONNECTION
                </p>
              </motion.form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
