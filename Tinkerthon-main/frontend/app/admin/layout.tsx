"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Megaphone,
  Trophy,
  FileText,
  LogOut,
  Menu,
  X,
  Shield,
  Zap,
} from "lucide-react";
import "@fontsource/share-tech-mono";

const NAV_ITEMS = [
  { label: "DASHBOARD", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "ANNOUNCEMENTS", href: "/admin/announcements", icon: Megaphone },
  { label: "PROBLEM STATEMENTS", href: "/admin/problemstatements", icon: Zap },
  { label: "RESULTS", href: "/admin/results", icon: Trophy },
  { label: "SUBMISSIONS", href: "/admin/submissions", icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Skip auth check for login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setAuthenticated(true);
      return;
    }

    fetch("/api/auth/verify")
      .then((res) => {
        if (!res.ok) {
          router.push("/admin/login");
          return;
        }
        setAuthenticated(true);
      })
      .catch(() => router.push("/admin/login"));
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (isLoginPage) return <>{children}</>;

  if (authenticated === null) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#020403" }}
      >
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-sm tracking-widest"
          style={{ color: "#7dffb2", fontFamily: "'Share Tech Mono', monospace" }}
        >
          VERIFYING ACCESS...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#020403" }}>
      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02] z-50"
        style={{
          backgroundImage: "linear-gradient(to bottom, transparent 50%, #00e676 50%)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* Mobile menu toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 cursor-pointer"
        style={{
          background: "rgba(0,10,0,0.9)",
          border: "1px solid rgba(0,230,118,0.3)",
          color: "#7dffb2",
        }}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || true) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            className={`fixed lg:sticky top-0 left-0 h-screen w-[260px] z-40 flex flex-col
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
              transition-transform duration-300 lg:transition-none`}
            style={{
              background: "rgba(0,8,0,0.95)",
              borderRight: "1px solid rgba(0,230,118,0.15)",
            }}
          >
            {/* Logo section */}
            <div
              className="p-5 flex items-center gap-3"
              style={{ borderBottom: "1px solid rgba(0,230,118,0.1)" }}
            >
              <Shield className="w-6 h-6" style={{ color: "#00e676" }} />
              <div>
                <h2
                  className="text-sm tracking-[0.2em]"
                  style={{
                    fontFamily: "Glitch, sans-serif",
                    color: "#7dffb2",
                    textShadow: "0 0 8px rgba(0,230,118,0.3)",
                  }}
                >
                  ADMIN PANEL
                </h2>
                <p
                  className="text-[10px] tracking-widest mt-0.5"
                  style={{ color: "rgba(159,230,184,0.35)" }}
                >
                  NEXUS&apos;26
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <button
                    key={item.href}
                    onClick={() => {
                      router.push(item.href);
                      setSidebarOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-xs tracking-[0.15em] transition-all duration-200 cursor-pointer group"
                    style={{
                      background: isActive ? "rgba(0,230,118,0.1)" : "transparent",
                      borderLeft: isActive ? "2px solid #00e676" : "2px solid transparent",
                      color: isActive ? "#7dffb2" : "rgba(159,230,184,0.5)",
                      fontFamily: "'Share Tech Mono', monospace",
                    }}
                  >
                    <Icon
                      className="w-4 h-4 transition-colors"
                      style={{ color: isActive ? "#00e676" : "rgba(0,230,118,0.4)" }}
                    />
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full"
                        style={{ background: "#00e676", boxShadow: "0 0 6px #00e676" }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="p-3" style={{ borderTop: "1px solid rgba(0,230,118,0.1)" }}>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-xs tracking-[0.15em] transition-all duration-200 cursor-pointer group"
                style={{
                  color: "rgba(255,80,80,0.7)",
                  fontFamily: "'Share Tech Mono', monospace",
                }}
              >
                <LogOut className="w-4 h-4" />
                TERMINATE SESSION
              </button>
              <div
                className="mt-3 px-3 py-2 text-[9px] tracking-widest"
                style={{ color: "rgba(159,230,184,0.2)" }}
              >
                <div>ENCRYPTED SESSION</div>
                <div className="flex items-center gap-1 mt-1">
                  <div
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: "#00e676" }}
                  />
                  SYSTEM ONLINE
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 min-h-screen lg:ml-0 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
