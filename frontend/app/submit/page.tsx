"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Send,
  Upload,
  CheckCircle,
  AlertTriangle,
  Loader2,
  ExternalLink,
  FileText,
  Github,
  Video,
  Users,
  UserCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import PageLockGuard from "@/components/PageLockGuard";
import "@fontsource/share-tech-mono";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
const UNSTOP_LINK = "https://unstop.com/o/i2YbERj?utm_medium=Share&utm_source=WhatsApp";

export default function PublicSubmitPage() {
  const [activeTab, setActiveTab] = useState<"home" | "submit">("home");

  return (
    <PageLockGuard pageKey="submit">
      <div className="min-h-screen relative" style={{ background: "#020403" }}>
        {/* Scanline overlay */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.03] z-10"
          style={{
            backgroundImage: "linear-gradient(to bottom, transparent 50%, #00e676 50%)",
            backgroundSize: "100% 4px",
          }}
        />

        <div
          className="fixed inset-0 pointer-events-none z-10"
          style={{
            background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.6) 100%)",
          }}
        />

        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          {/* Back link */}
          <Link
            href="/?view=portals"
            className="inline-flex items-center gap-2 text-xs tracking-widest mb-8 transition-colors group"
            style={{ color: "rgba(159,230,184,0.5)", fontFamily: "'Share Tech Mono', monospace" }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:text-green-400 transition-colors" />
            RETURN TO MAIN TERMINAL
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-10 text-center"
          >
            <h1
              className="text-2xl sm:text-4xl md:text-5xl tracking-widest mb-4"
              style={{
                fontFamily: "Glitch, sans-serif",
                color: "#7dffb2",
                textShadow: "0 0 10px rgba(0,230,118,0.4)",
              }}
            >
              ENTRY PORTAL
            </h1>
            <div
              className="h-px w-48 mx-auto mb-4"
              style={{ background: "linear-gradient(to right, transparent, #00e676, transparent)" }}
            />
            <p
              className="text-[10px] sm:text-xs tracking-[0.2em]"
              style={{ color: "rgba(159,230,184,0.4)", fontFamily: "'Share Tech Mono', monospace" }}
            >
              CHOOSE YOUR PATH — REGISTER OR SUBMIT YOUR WORK
            </p>
          </motion.div>

          {activeTab === "home" ? (
            /* ===== TWO CARDS VIEW ===== */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Registration */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="relative overflow-hidden group"
                style={{
                  background: "rgba(0,10,0,0.7)",
                  border: "1px solid rgba(0,230,118,0.25)",
                }}
              >
                {/* Scan overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,230,118,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: "linear-gradient(180deg, rgba(0,230,118,0.05) 0%, transparent 100%)",
                  }}
                />

                {/* Terminal title bar */}
                <div
                  className="flex items-center gap-2 px-4 py-2.5"
                  style={{
                    borderBottom: "1px solid rgba(0,230,118,0.15)",
                    background: "rgba(0,0,0,0.5)",
                  }}
                >
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <span
                    className="ml-3 text-xs tracking-wider"
                    style={{
                      color: "rgba(159,230,184,0.45)",
                      fontFamily: "'Share Tech Mono', monospace",
                    }}
                  >
                    user@matrix:~/register
                  </span>
                </div>

                <div
                  className="relative z-10 p-6 sm:p-8 flex flex-col items-center text-center"
                  style={{ fontFamily: "'Share Tech Mono', monospace" }}
                >
                  {/* Icon */}
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="mb-6"
                  >
                    <div
                      className="w-16 h-16 flex items-center justify-center"
                      style={{
                        background: "rgba(0,230,118,0.08)",
                        border: "1px solid rgba(0,230,118,0.2)",
                      }}
                    >
                      <Users className="w-8 h-8" style={{ color: "#00e676" }} />
                    </div>
                  </motion.div>

                  <h2
                    className="text-lg sm:text-xl tracking-[0.2em] mb-2"
                    style={{ color: "#7dffb2", textShadow: "0 0 8px rgba(0,230,118,0.3)" }}
                  >
                    REGISTRATION
                  </h2>
                  <p className="text-[10px] tracking-widest mb-8" style={{ color: "rgba(159,230,184,0.4)" }}>
                    JOIN THE NEXUS — REGISTER YOUR TEAM
                  </p>

                  {/* Unstop Button */}
                  <a
                    href={UNSTOP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center gap-3 px-5 py-3.5 mb-4 transition-all duration-200 group/btn"
                    style={{
                      background: "rgba(255,100,0,0.08)",
                      border: "1px solid rgba(255,100,0,0.3)",
                    }}
                  >
                    <div className="w-8 h-8 relative shrink-0 rounded overflow-hidden flex items-center justify-center">
                      <img 
                    src="/assets/unstop.png" 
                    alt="Unstop logo"
                    className="h-16 w-auto object-contain transition-all duration-300"
                  />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-xs tracking-widest" style={{ color: "#ff8c42" }}>
                        REGISTER ON UNSTOP
                      </div>
                      <div
                        className="text-[9px] tracking-wider mt-0.5"
                        style={{ color: "rgba(255,140,66,0.5)" }}
                      >
                        OFFICIAL EVENT REGISTRATION
                      </div>
                    </div>
                    <ExternalLink
                      className="w-4 h-4 shrink-0 transition-transform group-hover/btn:translate-x-1"
                      style={{ color: "rgba(255,140,66,0.5)" }}
                    />
                  </a>


                </div>

                {/* Bottom glow */}
                <div
                  className="absolute bottom-0 left-0 w-full h-[1px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "linear-gradient(to right, transparent, #00e676, transparent)" }}
                />
              </motion.div>

              {/* Card 2: Submissions */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="relative overflow-hidden group cursor-pointer"
                onClick={() => setActiveTab("submit")}
                style={{
                  background: "rgba(0,10,0,0.7)",
                  border: "1px solid rgba(0,230,118,0.25)",
                }}
              >
                {/* Scan overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,230,118,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: "linear-gradient(180deg, rgba(0,230,118,0.05) 0%, transparent 100%)",
                  }}
                />

                {/* Terminal title bar */}
                <div
                  className="flex items-center gap-2 px-4 py-2.5"
                  style={{
                    borderBottom: "1px solid rgba(0,230,118,0.15)",
                    background: "rgba(0,0,0,0.5)",
                  }}
                >
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <span
                    className="ml-3 text-xs tracking-wider"
                    style={{
                      color: "rgba(159,230,184,0.45)",
                      fontFamily: "'Share Tech Mono', monospace",
                    }}
                  >
                    user@matrix:~/submit
                  </span>
                </div>

                <div
                  className="relative z-10 p-6 sm:p-8 flex flex-col items-center text-center"
                  style={{ fontFamily: "'Share Tech Mono', monospace" }}
                >
                  {/* Icon */}
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="mb-6"
                  >
                    <div
                      className="w-16 h-16 flex items-center justify-center"
                      style={{
                        background: "rgba(0,230,118,0.08)",
                        border: "1px solid rgba(0,230,118,0.2)",
                      }}
                    >
                      <Send className="w-8 h-8" style={{ color: "#00e676" }} />
                    </div>
                  </motion.div>

                  <h2
                    className="text-lg sm:text-xl tracking-[0.2em] mb-2"
                    style={{ color: "#7dffb2", textShadow: "0 0 8px rgba(0,230,118,0.3)" }}
                  >
                    SUBMISSIONS
                  </h2>
                  <p className="text-[10px] tracking-widest mb-8" style={{ color: "rgba(159,230,184,0.4)" }}>
                    TRANSMIT YOUR PROJECT TO THE SYSTEM
                  </p>

                  {/* CTA */}
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-3 text-xs tracking-[0.2em] flex items-center justify-center gap-2"
                    style={{
                      background: "rgba(0,230,118,0.12)",
                      border: "1px solid rgba(0,230,118,0.3)",
                      color: "#7dffb2",
                      boxShadow: "0 0 15px rgba(0,230,118,0.08)",
                    }}
                  >
                    <Send className="w-4 h-4" />
                    OPEN SUBMISSION FORM
                  </motion.div>
                </div>

                {/* Bottom glow */}
                <div
                  className="absolute bottom-0 left-0 w-full h-[1px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "linear-gradient(to right, transparent, #00e676, transparent)" }}
                />
              </motion.div>
            </div>
          ) : (
            /* ===== SUBMISSION FORM VIEW ===== */
            <SubmissionForm onBack={() => setActiveTab("home")} />
          )}
        </div>
      </div>
    </PageLockGuard>
  );
}

/* ========================= SUBMISSION FORM ========================= */

function SubmissionForm({ onBack }: { onBack: () => void }) {
  const [form, setForm] = useState({
    teamLeaderName: "",
    teamName: "",
    githubLink: "",
    videoLink: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (selected) {
      const ext = selected.name.split(".").pop()?.toLowerCase();
      if (ext !== "pdf" && ext !== "ppt" && ext !== "pptx") {
        setError("Only PDF, PPT, or PPTX files are accepted");
        return;
      }
      if (selected.size > 26 * 1024 * 1024) {
        setError("File size must be under 25 MB");
        return;
      }
      setError("");
    }
    setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.teamLeaderName || !form.teamName) {
      setError("Team leader name and team name are required");
      return;
    }

    setSubmitting(true);

    try {
      let fileUrl = "";
      let fileName = "";

      // Upload file first if present
if (file) {
  const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

  const { data, error: uploadError } = await supabase.storage
    .from("uploads")
    .upload(filename, file);

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: publicUrlData } = supabase.storage
    .from("uploads")
    .getPublicUrl(filename);

  fileUrl = publicUrlData.publicUrl;
  fileName = file.name;
}


      const res = await fetch("/api/submissions", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    teamLeaderName: form.teamLeaderName,
    teamName: form.teamName,
    githubLink: form.githubLink || undefined,
    videoLink: form.videoLink || undefined,
    fileUrl: fileUrl || undefined,
    fileName: fileName || undefined,
  }),
});

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Submission failed");
        setSubmitting(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("CONNECTION FAILED: Unable to transmit");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    background: "rgba(0,20,0,0.6)",
    border: "1px solid rgba(0,230,118,0.2)",
    color: "#7dffb2",
    fontFamily: "'Share Tech Mono', monospace",
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8"
        style={{ background: "rgba(0,12,0,0.6)", border: "1px solid rgba(0,230,118,0.3)" }}
      >
        <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: "#00e676" }} />
        <h2
          className="text-lg tracking-widest mb-2"
          style={{ color: "#7dffb2", fontFamily: "'Share Tech Mono', monospace" }}
        >
          TRANSMISSION RECEIVED
        </h2>
        <p
          className="text-xs"
          style={{ color: "rgba(159,230,184,0.5)", fontFamily: "'Share Tech Mono', monospace" }}
        >
          Your submission has been successfully transmitted to the system.
        </p>
        <button
          onClick={onBack}
          className="inline-block mt-6 px-6 py-2 text-xs tracking-widest cursor-pointer"
          style={{
            background: "rgba(0,230,118,0.15)",
            border: "1px solid rgba(0,230,118,0.3)",
            color: "#7dffb2",
            fontFamily: "'Share Tech Mono', monospace",
          }}
        >
          RETURN TO ENTRY PORTAL
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      {/* Back to cards button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs tracking-widest mb-6 transition-colors group cursor-pointer"
        style={{ color: "rgba(159,230,184,0.5)", fontFamily: "'Share Tech Mono', monospace" }}
      >
        <ArrowLeft className="w-4 h-4 group-hover:text-green-400 transition-colors" />
        BACK TO ENTRY PORTAL
      </button>

      <div
        className="relative overflow-hidden max-w-2xl mx-auto"
        style={{ background: "rgba(0,10,0,0.7)", border: "1px solid rgba(0,230,118,0.25)" }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,230,118,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />

        {/* Terminal title bar */}
        <div
          className="flex items-center gap-2 px-4 py-2.5"
          style={{ borderBottom: "1px solid rgba(0,230,118,0.15)", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
          <span
            className="ml-3 text-xs font-mono tracking-wider"
            style={{ color: "rgba(159,230,184,0.45)" }}
          >
            user@matrix:~/submit/project
          </span>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 p-5 sm:p-6 space-y-5">
          {/* Team Leader Name */}
          <div>
            <label
              className="flex items-center gap-2 text-[10px] tracking-widest mb-1.5"
              style={{ color: "rgba(159,230,184,0.5)", fontFamily: "'Share Tech Mono', monospace" }}
            >
              <UserCircle className="w-3.5 h-3.5" />
              TEAM LEADER NAME *
            </label>
            <input
              value={form.teamLeaderName}
              onChange={(e) => setForm((f) => ({ ...f, teamLeaderName: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm outline-none"
              style={inputStyle}
              placeholder="Enter team leader's full name"
              required
            />
          </div>

          {/* Team Name */}
          <div>
            <label
              className="flex items-center gap-2 text-[10px] tracking-widest mb-1.5"
              style={{ color: "rgba(159,230,184,0.5)", fontFamily: "'Share Tech Mono', monospace" }}
            >
              <Users className="w-3.5 h-3.5" />
              TEAM NAME *
            </label>
            <input
              value={form.teamName}
              onChange={(e) => setForm((f) => ({ ...f, teamName: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm outline-none"
              style={inputStyle}
              placeholder="Enter your team name"
              required
            />
          </div>

          {/* GitHub Link */}
          <div>
            <label
              className="flex items-center gap-2 text-[10px] tracking-widest mb-1.5"
              style={{ color: "rgba(159,230,184,0.5)", fontFamily: "'Share Tech Mono', monospace" }}
            >
              <Github className="w-3.5 h-3.5" />
              GITHUB REPOSITORY LINK
            </label>
            <input
              value={form.githubLink}
              onChange={(e) => setForm((f) => ({ ...f, githubLink: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm outline-none"
              style={inputStyle}
              placeholder="https://github.com/your-repo"
            />
          </div>

          {/* Video Link */}
          <div>
            <label
              className="flex items-center gap-2 text-[10px] tracking-widest mb-1.5"
              style={{ color: "rgba(159,230,184,0.5)", fontFamily: "'Share Tech Mono', monospace" }}
            >
              <Video className="w-3.5 h-3.5" />
              VIDEO DEMONSTRATION LINK
            </label>
            <input
              value={form.videoLink}
              onChange={(e) => setForm((f) => ({ ...f, videoLink: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm outline-none"
              style={inputStyle}
              placeholder="https://youtube.com/... or https://drive.google.com/..."
            />
          </div>

          {/* PPT / PDF Upload */}
          <div>
            <label
              className="flex items-center gap-2 text-[10px] tracking-widest mb-1.5"
              style={{ color: "rgba(159,230,184,0.5)", fontFamily: "'Share Tech Mono', monospace" }}
            >
              <Upload className="w-3.5 h-3.5" />
              PPT / PDF UPLOAD
            </label>
            <label
              className="flex items-center gap-2 px-4 py-2.5 cursor-pointer w-fit"
              style={{
                background: "rgba(0,230,118,0.08)",
                border: "1px solid rgba(0,230,118,0.2)",
                color: "rgba(159,230,184,0.6)",
                fontFamily: "'Share Tech Mono', monospace",
              }}
            >
              <Upload className="w-4 h-4" />
              <span className="text-xs">{file ? file.name : "CHOOSE FILE (.pdf, .ppt, .pptx)"}</span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.ppt,.pptx"
                onChange={handleFileChange}
              />
            </label>
            <p
              className="text-[9px] mt-1.5 tracking-wider"
              style={{ color: "rgba(159,230,184,0.3)", fontFamily: "'Share Tech Mono', monospace" }}
            >
              MAX FILE SIZE: 25 MB
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 px-3 py-2 text-xs"
              style={{
                background: "rgba(255,0,0,0.1)",
                border: "1px solid rgba(255,50,50,0.3)",
                color: "#ff4444",
                fontFamily: "'Share Tech Mono', monospace",
              }}
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 text-sm tracking-[0.3em] uppercase cursor-pointer flex items-center justify-center gap-2"
            style={{
              background: "rgba(0,230,118,0.15)",
              border: "1px solid rgba(0,230,118,0.4)",
              color: "#7dffb2",
              fontFamily: "'Share Tech Mono', monospace",
              boxShadow: "0 0 15px rgba(0,230,118,0.1)",
            }}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                TRANSMITTING...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                TRANSMIT
              </>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
