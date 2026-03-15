"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Megaphone, Trophy, FileText, Activity } from "lucide-react";
import "@fontsource/share-tech-mono";

interface Stats {
  announcements: number;
  results: number;
  submissions: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ announcements: 0, results: 0, submissions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [annRes, resRes, subRes] = await Promise.all([
          fetch("/api/announcements"),
          fetch("/api/results"),
          fetch("/api/submissions"),
        ]);
        const announcements = await annRes.json();
        const results = await resRes.json();
        const submissions = await subRes.json();

        setStats({
          announcements: Array.isArray(announcements) ? announcements.length : 0,
          results: Array.isArray(results) ? results.length : 0,
          submissions: Array.isArray(submissions) ? submissions.length : 0,
        });
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      label: "ANNOUNCEMENTS",
      count: stats.announcements,
      icon: Megaphone,
      href: "/admin/announcements",
      color: "#00e676",
    },
    {
      label: "RESULTS",
      count: stats.results,
      icon: Trophy,
      href: "/admin/results",
      color: "#00e676",
    },
    {
      label: "SUBMISSIONS",
      count: stats.submissions,
      icon: FileText,
      href: "/admin/submissions",
      color: "#00e676",
    },
  ];

  return (
    <div style={{ fontFamily: "'Share Tech Mono', monospace" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1
          className="text-2xl sm:text-3xl tracking-widest mb-2"
          style={{
            fontFamily: "Glitch, sans-serif",
            color: "#7dffb2",
            textShadow: "0 0 10px rgba(0,230,118,0.4)",
          }}
        >
          COMMAND CENTER
        </h1>
        <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(159,230,184,0.4)" }}>
          <Activity className="w-3.5 h-3.5" style={{ color: "#00e676" }} />
          <span>SYSTEM STATUS: ALL MODULES OPERATIONAL</span>
        </div>
        <div
          className="h-px w-full mt-4"
          style={{ background: "linear-gradient(to right, #00e676, transparent)" }}
        />
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.a
              key={card.label}
              href={card.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ scale: 1.03, y: -2 }}
              className="block p-5 relative overflow-hidden group cursor-pointer"
              style={{
                background: "rgba(0,15,0,0.6)",
                border: "1px solid rgba(0,230,118,0.2)",
              }}
            >
              {/* Scanning bar effect */}
              <div
                className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,230,118,0.03)_50%)] bg-[length:100%_4px] pointer-events-none"
              />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(180deg, rgba(0,230,118,0.05) 0%, transparent 100%)" }} />

              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p
                    className="text-[10px] tracking-[0.2em] mb-3"
                    style={{ color: "rgba(159,230,184,0.5)" }}
                  >
                    {card.label}
                  </p>
                  <p
                    className="text-3xl sm:text-4xl font-bold"
                    style={{ color: card.color, textShadow: `0 0 15px ${card.color}40` }}
                  >
                    {loading ? "—" : card.count}
                  </p>
                </div>
                <Icon className="w-6 h-6" style={{ color: "rgba(0,230,118,0.3)" }} />
              </div>
              {/* Bottom glow */}
              <div
                className="absolute bottom-0 left-0 w-full h-[1px] opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "linear-gradient(to right, transparent, #00e676, transparent)" }}
              />
            </motion.a>
          );
        })}
      </div>

      {/* System info panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-5 relative overflow-hidden"
        style={{
          background: "rgba(0,10,0,0.5)",
          border: "1px solid rgba(0,230,118,0.15)",
        }}
      >
        <div
          className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,230,118,0.02)_50%)] bg-[length:100%_4px] pointer-events-none"
        />
        <h3
          className="text-xs tracking-[0.2em] mb-4 relative z-10"
          style={{ color: "rgba(159,230,184,0.5)" }}
        >
          SYSTEM LOG
        </h3>
        <div className="space-y-2 text-xs relative z-10" style={{ color: "rgba(125,255,178,0.6)" }}>
          <div>
            <span style={{ color: "rgba(0,230,118,0.4)" }}>{">"}</span> Admin panel initialized
          </div>
          <div>
            <span style={{ color: "rgba(0,230,118,0.4)" }}>{">"}</span> Use the sidebar to manage announcements, results, and submissions
          </div>
          <div>
            <span style={{ color: "rgba(0,230,118,0.4)" }}>{">"}</span> All changes reflect instantly on the public website
          </div>
          <div>
            <span style={{ color: "rgba(0,230,118,0.4)" }}>{">"}</span> Session encrypted with JWT tokens
          </div>
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2 mt-3"
          >
            <span style={{ color: "#00e676" }}>$</span> awaiting_command
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ color: "#7dffb2" }}
            >
              █
            </motion.span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
