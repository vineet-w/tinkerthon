"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Upload, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import "@fontsource/share-tech-mono";

export default function PublicSubmitPage() {
  const [form, setForm] = useState({ name: "", email: "", teamName: "", message: "" });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      let fileUrl = "";
      let fileName = "";

      // Upload file first if present
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          fileUrl = uploadData.url;
          fileName = uploadData.filename;
        }
      }

      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
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

  return (
    <div className="min-h-screen relative" style={{ background: "#020403" }}>
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-10"
        style={{ backgroundImage: "linear-gradient(to bottom, transparent 50%, #00e676 50%)", backgroundSize: "100% 4px" }} />

      <div className="fixed inset-0 pointer-events-none z-10"
        style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.6) 100%)" }} />

      <div className="relative z-20 max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-xs tracking-widest mb-8 transition-colors group"
          style={{ color: "rgba(159,230,184,0.5)", fontFamily: "'Share Tech Mono', monospace" }}>
          <ArrowLeft className="w-4 h-4 group-hover:text-green-400 transition-colors" />RETURN TO MAIN TERMINAL
        </Link>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-10 text-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl tracking-widest mb-4"
            style={{ fontFamily: "Glitch, sans-serif", color: "#7dffb2", textShadow: "0 0 10px rgba(0,230,118,0.4)" }}>
            TRANSMIT DATA
          </h1>
          <div className="h-px w-48 mx-auto mb-4" style={{ background: "linear-gradient(to right, transparent, #00e676, transparent)" }} />
          <p className="text-[10px] sm:text-xs tracking-[0.2em]" style={{ color: "rgba(159,230,184,0.4)", fontFamily: "'Share Tech Mono', monospace" }}>
            SUBMIT YOUR TRANSMISSION TO THE SYSTEM
          </p>
        </motion.div>

        {success ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8"
            style={{ background: "rgba(0,12,0,0.6)", border: "1px solid rgba(0,230,118,0.3)" }}>
            <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: "#00e676" }} />
            <h2 className="text-lg tracking-widest mb-2" style={{ color: "#7dffb2", fontFamily: "'Share Tech Mono', monospace" }}>
              TRANSMISSION RECEIVED
            </h2>
            <p className="text-xs" style={{ color: "rgba(159,230,184,0.5)", fontFamily: "'Share Tech Mono', monospace" }}>
              Your submission has been successfully transmitted to the system.
            </p>
            <Link href="/"
              className="inline-block mt-6 px-6 py-2 text-xs tracking-widest"
              style={{ background: "rgba(0,230,118,0.15)", border: "1px solid rgba(0,230,118,0.3)", color: "#7dffb2", fontFamily: "'Share Tech Mono', monospace" }}>
              RETURN TO MAIN TERMINAL
            </Link>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="relative overflow-hidden"
            style={{ background: "rgba(0,10,0,0.7)", border: "1px solid rgba(0,230,118,0.25)" }}>
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,230,118,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />

            {/* Terminal title bar */}
            <div className="flex items-center gap-2 px-4 py-2.5"
              style={{ borderBottom: "1px solid rgba(0,230,118,0.15)", background: "rgba(0,0,0,0.5)" }}>
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-3 text-xs font-mono tracking-wider" style={{ color: "rgba(159,230,184,0.45)" }}>
                user@matrix:~/submit
              </span>
            </div>

            <form onSubmit={handleSubmit} className="relative z-10 p-5 sm:p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-widest mb-1.5" style={{ color: "rgba(159,230,184,0.5)", fontFamily: "'Share Tech Mono', monospace" }}>NAME *</label>
                  <input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm outline-none" style={inputStyle} placeholder="Your name" required />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest mb-1.5" style={{ color: "rgba(159,230,184,0.5)", fontFamily: "'Share Tech Mono', monospace" }}>EMAIL *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm outline-none" style={inputStyle} placeholder="your@email.com" required />
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-widest mb-1.5" style={{ color: "rgba(159,230,184,0.5)", fontFamily: "'Share Tech Mono', monospace" }}>TEAM NAME</label>
                <input value={form.teamName} onChange={(e) => setForm(f => ({ ...f, teamName: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm outline-none" style={inputStyle} placeholder="Team name (optional)" />
              </div>

              <div>
                <label className="block text-[10px] tracking-widest mb-1.5" style={{ color: "rgba(159,230,184,0.5)", fontFamily: "'Share Tech Mono', monospace" }}>MESSAGE *</label>
                <textarea value={form.message} onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm outline-none min-h-[100px] resize-y" style={inputStyle} placeholder="Your submission details..." required />
              </div>

              <div>
                <label className="block text-[10px] tracking-widest mb-1.5" style={{ color: "rgba(159,230,184,0.5)", fontFamily: "'Share Tech Mono', monospace" }}>ATTACH FILE (OPTIONAL)</label>
                <label className="flex items-center gap-2 px-4 py-2.5 cursor-pointer w-fit"
                  style={{ background: "rgba(0,230,118,0.08)", border: "1px solid rgba(0,230,118,0.2)", color: "rgba(159,230,184,0.6)", fontFamily: "'Share Tech Mono', monospace" }}>
                  <Upload className="w-4 h-4" />
                  <span className="text-xs">{file ? file.name : "CHOOSE FILE"}</span>
                  <input type="file" className="hidden" onChange={handleFileChange} />
                </label>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-center gap-2 px-3 py-2 text-xs"
                  style={{ background: "rgba(255,0,0,0.1)", border: "1px solid rgba(255,50,50,0.3)", color: "#ff4444", fontFamily: "'Share Tech Mono', monospace" }}>
                  <AlertTriangle className="w-4 h-4 shrink-0" />{error}
                </motion.div>
              )}

              <motion.button type="submit" disabled={submitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full py-3 text-sm tracking-[0.3em] uppercase cursor-pointer flex items-center justify-center gap-2"
                style={{ background: "rgba(0,230,118,0.15)", border: "1px solid rgba(0,230,118,0.4)", color: "#7dffb2", fontFamily: "'Share Tech Mono', monospace", boxShadow: "0 0 15px rgba(0,230,118,0.1)" }}>
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />TRANSMITTING...</> : <><Send className="w-4 h-4" />TRANSMIT</>}
              </motion.button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
