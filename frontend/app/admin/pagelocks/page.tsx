"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Unlock,
  Clock,
  Loader2,
  ShieldAlert,
  Megaphone,
  Trophy,
  FileText,
  Code,
  Database,
  Link as LinkIcon,
  Brain,
} from "lucide-react";
import "@fontsource/share-tech-mono";

interface PageLock {
  id: string;
  pageKey: string;
  locked: boolean;
  scheduledUnlock?: string;
  lockedAt: string;
  updatedAt: string;
  lockedBy: string;
}

const LOCKABLE_PAGES = [
  { key: "announcements", label: "ANNOUNCEMENTS", subtitle: "System Broadcasts", icon: Megaphone, path: "/announcements" },
  { key: "results", label: "RESULTS", subtitle: "Decrypted Data", icon: Trophy, path: "/results" },
  { key: "submit", label: "SUBMISSIONS", subtitle: "Transmit Data Form", icon: FileText, path: "/submit" },
  { key: "domain:web-development", label: "WEB DEVELOPMENT", subtitle: "Junior Track Domain", icon: Code, path: "/domains/web-development" },
  { key: "domain:data-science", label: "DATA SCIENCE", subtitle: "Junior Track Domain", icon: Database, path: "/domains/data-science" },
  { key: "domain:blockchain", label: "BLOCKCHAIN", subtitle: "Senior Track Domain", icon: LinkIcon, path: "/domains/blockchain" },
  { key: "domain:ai-ml", label: "AI / ML", subtitle: "Senior Track Domain", icon: Brain, path: "/domains/ai-ml" },
];

export default function AdminPageLocks() {
  const [locks, setLocks] = useState<PageLock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchLocks = async () => {
    try {
      const res = await fetch("/api/pagelocks");
      const data = await res.json();
      setLocks(Array.isArray(data) ? data : []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocks();
  }, []);

  const getLock = (pageKey: string): PageLock | undefined => {
    return locks.find((l) => l.pageKey === pageKey);
  };

  const isLocked = (pageKey: string): boolean => {
    const lock = getLock(pageKey);
    return lock?.locked ?? false;
  };

  const toggleLock = async (pageKey: string) => {
    const currentlyLocked = isLocked(pageKey);
    setSaving(pageKey);
    try {
      await fetch("/api/pagelocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageKey,
          locked: !currentlyLocked,
          scheduledUnlock: !currentlyLocked ? getLock(pageKey)?.scheduledUnlock : undefined,
        }),
      });
      await fetchLocks();
    } catch {
      /* ignore */
    } finally {
      setSaving(null);
    }
  };

  const setScheduledUnlock = async (pageKey: string, datetime: string) => {
    setSaving(pageKey);
    try {
      await fetch("/api/pagelocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageKey,
          locked: true,
          scheduledUnlock: datetime || undefined,
        }),
      });
      await fetchLocks();
    } catch {
      /* ignore */
    } finally {
      setSaving(null);
    }
  };

  const clearSchedule = async (pageKey: string) => {
    const lock = getLock(pageKey);
    if (!lock) return;
    setSaving(pageKey);
    try {
      await fetch(`/api/pagelocks/${encodeURIComponent(pageKey)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locked: lock.locked, scheduledUnlock: null }),
      });
      await fetchLocks();
    } catch {
      /* ignore */
    } finally {
      setSaving(null);
    }
  };

  return (
    <div style={{ fontFamily: "'Share Tech Mono', monospace" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <ShieldAlert className="w-6 h-6" style={{ color: "#00e676" }} />
          <h1
            className="text-xl sm:text-2xl tracking-widest"
            style={{
              fontFamily: "Glitch, sans-serif",
              color: "#7dffb2",
              textShadow: "0 0 10px rgba(0,230,118,0.4)",
            }}
          >
            PAGE LOCKS
          </h1>
        </div>
        <p className="text-[10px] tracking-[0.2em]" style={{ color: "rgba(159,230,184,0.4)" }}>
          CONTROL ACCESS TO PUBLIC PAGES — LOCK PAGES AND SET SCHEDULED UNLOCK TIMES
        </p>
        <div
          className="h-px w-full mt-4"
          style={{ background: "linear-gradient(to right, #00e676, transparent)" }}
        />
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#00e676" }} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {LOCKABLE_PAGES.map((page, i) => {
            const lock = getLock(page.key);
            const locked = isLocked(page.key);
            const isSaving = saving === page.key;
            const Icon = page.icon;

            return (
              <motion.div
                key={page.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative overflow-hidden group"
                style={{
                  background: "rgba(0,12,0,0.5)",
                  border: `1px solid ${locked ? "rgba(255,60,60,0.3)" : "rgba(0,230,118,0.2)"}`,
                  transition: "border-color 0.3s ease",
                }}
              >
                {/* Scan overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,230,118,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />

                <div className="relative z-10 p-4 sm:p-5">
                  {/* Page info row */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className="shrink-0 w-10 h-10 flex items-center justify-center"
                        style={{
                          background: locked ? "rgba(255,60,60,0.1)" : "rgba(0,230,118,0.08)",
                          border: `1px solid ${locked ? "rgba(255,60,60,0.25)" : "rgba(0,230,118,0.15)"}`,
                        }}
                      >
                        <Icon className="w-5 h-5" style={{ color: locked ? "#ff6666" : "rgba(0,230,118,0.6)" }} />
                      </div>
                      <div>
                        <h3 className="text-sm tracking-wider" style={{ color: locked ? "#ff8888" : "#7dffb2" }}>
                          {page.label}
                        </h3>
                        <p className="text-[10px] tracking-widest" style={{ color: "rgba(159,230,184,0.35)" }}>
                          {page.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Status badge */}
                    <div
                      className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 text-[10px] tracking-widest"
                      style={{
                        background: locked ? "rgba(255,60,60,0.15)" : "rgba(0,230,118,0.12)",
                        border: `1px solid ${locked ? "rgba(255,60,60,0.3)" : "rgba(0,230,118,0.25)"}`,
                        color: locked ? "#ff6666" : "#7dffb2",
                      }}
                    >
                      {locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      {locked ? "LOCKED" : "UNLOCKED"}
                    </div>
                  </div>

                  {/* Path */}
                  <div className="text-[10px] tracking-wider mb-4" style={{ color: "rgba(159,230,184,0.25)" }}>
                    PATH: {page.path}
                  </div>

                  {/* Controls */}
                  <div className="flex flex-col gap-3">
                    {/* Lock/Unlock toggle */}
                    <button
                      onClick={() => toggleLock(page.key)}
                      disabled={isSaving}
                      className="w-full py-2.5 text-xs tracking-[0.2em] cursor-pointer flex items-center justify-center gap-2 transition-all duration-200"
                      style={{
                        background: locked
                          ? "rgba(0,230,118,0.12)"
                          : "rgba(255,60,60,0.12)",
                        border: `1px solid ${locked ? "rgba(0,230,118,0.3)" : "rgba(255,60,60,0.3)"}`,
                        color: locked ? "#7dffb2" : "#ff8888",
                      }}
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : locked ? (
                        <>
                          <Unlock className="w-4 h-4" /> UNLOCK PAGE
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" /> LOCK PAGE
                        </>
                      )}
                    </button>

                    {/* Scheduled unlock */}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 shrink-0" style={{ color: "rgba(159,230,184,0.4)" }} />
                      <input
                        type="datetime-local"
                        value={lock?.scheduledUnlock ? lock.scheduledUnlock.slice(0, 16) : ""}
                        onChange={(e) => {
                          if (e.target.value) {
                            const isoDate = new Date(e.target.value).toISOString();
                            setScheduledUnlock(page.key, isoDate);
                          }
                        }}
                        className="flex-1 px-2 py-1.5 text-xs outline-none"
                        style={{
                          background: "rgba(0,20,0,0.6)",
                          border: "1px solid rgba(0,230,118,0.15)",
                          color: "#7dffb2",
                          fontFamily: "'Share Tech Mono', monospace",
                          colorScheme: "dark",
                        }}
                      />
                      {lock?.scheduledUnlock && (
                        <button
                          onClick={() => clearSchedule(page.key)}
                          className="px-2 py-1.5 text-[10px] tracking-widest cursor-pointer"
                          style={{
                            background: "rgba(255,60,60,0.1)",
                            border: "1px solid rgba(255,60,60,0.2)",
                            color: "#ff8888",
                          }}
                        >
                          CLEAR
                        </button>
                      )}
                    </div>

                    {/* Scheduled time display */}
                    {lock?.scheduledUnlock && (
                      <div className="text-[10px] tracking-widest flex items-center gap-2" style={{ color: "rgba(255,200,100,0.5)" }}>
                        <Clock className="w-3 h-3" />
                        AUTO-UNLOCK: {new Date(lock.scheduledUnlock).toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Last updated */}
                  {lock && (
                    <div className="text-[9px] tracking-wider mt-3 pt-3" style={{ color: "rgba(159,230,184,0.2)", borderTop: "1px solid rgba(0,230,118,0.08)" }}>
                      LAST UPDATED: {new Date(lock.updatedAt).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Bottom glow */}
                <div
                  className="absolute bottom-0 left-0 w-full h-[1px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(to right, transparent, ${locked ? "#ff3c3c" : "#00e676"}, transparent)`,
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
