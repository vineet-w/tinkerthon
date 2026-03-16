"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Download, Table } from "lucide-react";
import Link from "next/link";
import "@fontsource/share-tech-mono";

interface ResultEntry {
  id: string;
  title: string;
  description: string;
  pdfUrl?: string;
  tableData?: { headers: string[]; rows: string[][] };
  createdAt: string;
}

export default function PublicResultsPage() {
  const [results, setResults] = useState<ResultEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/results")
      .then((res) => res.json())
      .then((data) => setResults(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen relative" style={{ background: "#020403" }}>
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-10"
        style={{ backgroundImage: "linear-gradient(to bottom, transparent 50%, #00e676 50%)", backgroundSize: "100% 4px" }} />

      <div className="fixed inset-0 pointer-events-none z-10"
        style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.6) 100%)" }} />

      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-xs tracking-widest mb-8 transition-colors group"
          style={{ color: "rgba(159,230,184,0.5)", fontFamily: "'Share Tech Mono', monospace" }}>
          <ArrowLeft className="w-4 h-4 group-hover:text-green-400 transition-colors" />RETURN TO MAIN TERMINAL
        </Link>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-10 sm:mb-16 text-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl tracking-widest mb-4"
            style={{ fontFamily: "Glitch, sans-serif", color: "#7dffb2", textShadow: "0 0 10px rgba(0,230,118,0.4)" }}>
            DECRYPTED DATA
          </h1>
          <div className="h-px w-48 mx-auto mb-4" style={{ background: "linear-gradient(to right, transparent, #00e676, transparent)" }} />
          <p className="text-[10px] sm:text-xs tracking-[0.2em]" style={{ color: "rgba(159,230,184,0.4)", fontFamily: "'Share Tech Mono', monospace" }}>
            PUBLISHED RESULTS
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="text-sm tracking-widest" style={{ color: "#7dffb2", fontFamily: "'Share Tech Mono', monospace" }}>
              DECRYPTING DATA STREAMS...
            </motion.div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20 text-sm" style={{ color: "rgba(159,230,184,0.4)", fontFamily: "'Share Tech Mono', monospace" }}>
            NO RESULTS PUBLISHED YET.
          </div>
        ) : (
          <div className="space-y-6">
            {results.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="relative overflow-hidden"
                style={{ background: "rgba(0,12,0,0.6)", border: "1px solid rgba(0,230,118,0.2)" }}>
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,230,118,0.03)_50%)] bg-[length:100%_4px] pointer-events-none" />

                <div className="relative z-10 p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    {r.pdfUrl && <span className="text-[10px] px-2 py-0.5 flex items-center gap-1" style={{ background: "rgba(0,230,118,0.1)", border: "1px solid rgba(0,230,118,0.2)", color: "rgba(159,230,184,0.6)" }}><FileText className="w-3 h-3" />PDF</span>}
                    {r.tableData && <span className="text-[10px] px-2 py-0.5 flex items-center gap-1" style={{ background: "rgba(0,230,118,0.1)", border: "1px solid rgba(0,230,118,0.2)", color: "rgba(159,230,184,0.6)" }}><Table className="w-3 h-3" />TABLE</span>}
                    <span className="text-[9px] tracking-wider" style={{ color: "rgba(159,230,184,0.25)", fontFamily: "'Share Tech Mono', monospace" }}>
                      {new Date(r.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg tracking-wider mb-3"
                    style={{ color: "#7dffb2", fontFamily: "'Share Tech Mono', monospace" }}>
                    <span style={{ color: "rgba(0,230,118,0.4)" }}>{">"}</span> {r.title}
                  </h2>

                  <p className="text-xs sm:text-sm leading-relaxed pl-4 mb-4" style={{ color: "rgba(125,255,178,0.65)", fontFamily: "'Share Tech Mono', monospace" }}>
                    {r.description}
                  </p>

                  {/* PDF download */}
                  {r.pdfUrl && (
                    <div className="pl-4">
                      <a href={r.pdfUrl} download target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs tracking-widest transition-all"
                        style={{ background: "rgba(0,230,118,0.1)", border: "1px solid rgba(0,230,118,0.3)", color: "#7dffb2", fontFamily: "'Share Tech Mono', monospace" }}>
                        <Download className="w-3.5 h-3.5" /> DOWNLOAD PDF
                      </a>
                    </div>
                  )}

                  {/* Table display */}
                  {r.tableData && r.tableData.headers.length > 0 && (
                    <div className="pl-4 mt-2 overflow-x-auto">
                      <table className="w-full text-xs" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                        <thead>
                          <tr>
                            {r.tableData.headers.map((h, hi) => (
                              <th key={hi} className="text-left px-3 py-2 tracking-wider"
                                style={{ color: "#7dffb2", borderBottom: "1px solid rgba(0,230,118,0.3)", background: "rgba(0,230,118,0.05)" }}>
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {r.tableData.rows.map((row, ri) => (
                            <tr key={ri} className="group">
                              {row.map((cell, ci) => (
                                <td key={ci} className="px-3 py-2 transition-colors"
                                  style={{ color: "rgba(125,255,178,0.65)", borderBottom: "1px solid rgba(0,230,118,0.1)" }}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
