"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Download, Search, Loader2, User, Users, File, Github, Video } from "lucide-react";
import "@fontsource/share-tech-mono";
import * as XLSX from "xlsx";
interface Submission {
  id: string;
  teamLeaderName: string;
  teamName: string;
  githubLink?: string;
  videoLink?: string;
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
}

export default function SubmissionsAdmin() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
const exportToExcel = () => {
  const data = filtered.map((s) => ({
    "Team Leader": s.teamLeaderName,
    "Team Name": s.teamName,
    "GitHub": s.githubLink || "",
    "Video": s.videoLink || "",
    "File Name": s.fileName || "",
    "File URL": s.fileUrl || "",
    "Submitted At": new Date(s.createdAt).toLocaleString()
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  // ✅ Add clickable hyperlinks
  data.forEach((row, index) => {
    const rowIndex = index + 2; // row 1 = header

    if (row.GitHub) {
      worksheet[`C${rowIndex}`] = {
        t: "s",
        v: "GitHub",
        l: { Target: row.GitHub }
      };
    }

    if (row.Video) {
      worksheet[`D${rowIndex}`] = {
        t: "s",
        v: "Video",
        l: { Target: row.Video }
      };
    }

    if (row["File URL"]) {
      worksheet[`F${rowIndex}`] = {
        t: "s",
        v: "File",
        l: { Target: row["File URL"] }
      };
    }
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");

  XLSX.writeFile(workbook, "submissions.xlsx");
};
  const fetchSubmissions = async () => {
    try {
      const res = await fetch("/api/submissions");
      const data = await res.json();
      setSubmissions(Array.isArray(data) ? data : []);
    } catch { /* ignore */ } finally { setLoading(false); }
  };

useEffect(() => {
  fetchSubmissions();
  const interval = setInterval(fetchSubmissions, 5000);
  return () => clearInterval(interval);
}, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this submission?")) return;
    await fetch(`/api/submissions/${id}`, { method: "DELETE" });
    await fetchSubmissions();
  };
 
  const filtered = submissions.filter(s =>
    (s.teamLeaderName || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.teamName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "'Share Tech Mono', monospace" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-xl sm:text-2xl tracking-widest mb-1" style={{ fontFamily: "Glitch, sans-serif", color: "#7dffb2", textShadow: "0 0 10px rgba(0,230,118,0.4)" }}>
          SUBMISSIONS
        </h1>
        <p className="text-[10px] tracking-[0.2em]" style={{ color: "rgba(159,230,184,0.4)" }}>
          INTERCEPTED TRANSMISSIONS • {submissions.length} TOTAL
        </p>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(0,230,118,0.4)" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm outline-none"
            style={{ background: "rgba(0,20,0,0.6)", border: "1px solid rgba(0,230,118,0.2)", color: "#7dffb2", fontFamily: "'Share Tech Mono', monospace" }}
            placeholder="Search by leader name or team..." />
        </div>

        <button
          onClick={exportToExcel}
          className="px-4 py-2 text-xs tracking-wider border"
          style={{
            border: "1px solid rgba(0,230,118,0.3)",
            color: "#7dffb2",
            background: "rgba(0,20,0,0.6)"
          }}
        >
          EXPORT TO EXCEL
        </button>
      </motion.div>

      <div className="h-px w-full mb-6" style={{ background: "linear-gradient(to right, #00e676, transparent)" }} />

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" style={{ color: "#00e676" }} /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-sm" style={{ color: "rgba(159,230,184,0.4)" }}>
          {search ? "NO MATCHING TRANSMISSIONS FOUND." : "NO TRANSMISSIONS RECEIVED."}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="p-4 sm:p-5 relative overflow-hidden group"
              style={{ background: "rgba(0,12,0,0.5)", border: "1px solid rgba(0,230,118,0.15)" }}>
              <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,230,118,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Meta info row */}
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className="flex items-center gap-1.5 text-xs" style={{ color: "#7dffb2" }}>
                        <User className="w-3.5 h-3.5" style={{ color: "rgba(0,230,118,0.5)" }} />{s.teamLeaderName}
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px]" style={{ color: "rgba(159,230,184,0.55)" }}>
                        <Users className="w-3 h-3" />{s.teamName}
                      </span>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-4 mb-2 flex-wrap">
                      {s.githubLink && (
                        <a href={s.githubLink} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[10px] transition-colors hover:underline"
                          style={{ color: "rgba(0,230,118,0.6)" }}>
                          <Github className="w-3 h-3" />GitHub
                        </a>
                      )}
                      {s.videoLink && (
                        <a href={s.videoLink} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[10px] transition-colors hover:underline"
                          style={{ color: "rgba(0,230,118,0.6)" }}>
                          <Video className="w-3 h-3" />Video
                        </a>
                      )}
                    </div>

                    {/* File & timestamp */}
                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                      {s.fileUrl && (
                        <a href={s.fileUrl} download className="flex items-center gap-1.5 text-[10px] cursor-pointer transition-colors"
                          style={{ color: "rgba(0,230,118,0.6)" }}>
                          <Download className="w-3 h-3" /><File className="w-3 h-3" />{s.fileName || "Download File"}
                        </a>
                      )}
                      <span className="text-[9px] tracking-wider" style={{ color: "rgba(159,230,184,0.25)" }}>
                        {new Date(s.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button onClick={() => handleDelete(s.id)} className="p-2 shrink-0 cursor-pointer transition-colors" style={{ color: "rgba(255,80,80,0.5)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#ff4444")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,80,80,0.5)")}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
