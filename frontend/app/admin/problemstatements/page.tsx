"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Eye, EyeOff, Loader2, Code, Brain, Link as LinkIcon, Database } from "lucide-react";
import "@fontsource/share-tech-mono";

interface ProblemStatement {
  id: string;
  domain: string;
  track: string;
  title: string;
  description: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

const DOMAINS = [
  { value: "web-development", label: "WEB DEVELOPMENT", track: "junior", icon: Code },
  { value: "data-science", label: "DATA SCIENCE", track: "junior", icon: Database },
  { value: "blockchain", label: "BLOCKCHAIN", track: "senior", icon: LinkIcon },
  { value: "ai-ml", label: "AI / ML", track: "senior", icon: Brain },
];

export default function ProblemStatementsAdmin() {
  const [statements, setStatements] = useState<ProblemStatement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ProblemStatement | null>(null);
  const [form, setForm] = useState({ domain: "web-development", track: "junior", title: "", description: "", published: false });
  const [saving, setSaving] = useState(false);
  const [filterDomain, setFilterDomain] = useState<string>("all");

  const fetchStatements = async () => {
    try {
      const res = await fetch("/api/problemstatements");
      const data = await res.json();
      setStatements(Array.isArray(data) ? data : []);
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchStatements(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ domain: "web-development", track: "junior", title: "", description: "", published: false });
    setShowModal(true);
  };

  const openEdit = (ps: ProblemStatement) => {
    setEditing(ps);
    setForm({ domain: ps.domain, track: ps.track, title: ps.title, description: ps.description, published: ps.published });
    setShowModal(true);
  };

  const handleDomainChange = (domain: string) => {
    const d = DOMAINS.find(dd => dd.value === domain);
    setForm(f => ({ ...f, domain, track: d?.track || "junior" }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editing ? `/api/problemstatements/${editing.id}` : "/api/problemstatements";
      const method = editing ? "PUT" : "POST";
      await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      setShowModal(false);
      await fetchStatements();
    } catch { /* ignore */ } finally { setSaving(false); }
  };

  const togglePublish = async (ps: ProblemStatement) => {
    await fetch(`/api/problemstatements/${ps.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !ps.published }),
    });
    await fetchStatements();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this problem statement?")) return;
    await fetch(`/api/problemstatements/${id}`, { method: "DELETE" });
    await fetchStatements();
  };

  const filtered = filterDomain === "all" ? statements : statements.filter(s => s.domain === filterDomain);

  const inputStyle = {
    background: "rgba(0,20,0,0.6)",
    border: "1px solid rgba(0,230,118,0.2)",
    color: "#7dffb2",
    fontFamily: "'Share Tech Mono', monospace",
  };

  return (
    <div style={{ fontFamily: "'Share Tech Mono', monospace" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl tracking-widest mb-1" style={{ fontFamily: "Glitch, sans-serif", color: "#7dffb2", textShadow: "0 0 10px rgba(0,230,118,0.4)" }}>
            PROBLEM STATEMENTS
          </h1>
          <p className="text-[10px] tracking-[0.2em]" style={{ color: "rgba(159,230,184,0.4)" }}>
            MANAGE CHALLENGE PROTOCOLS
          </p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 text-xs tracking-widest cursor-pointer"
          style={{ background: "rgba(0,230,118,0.15)", border: "1px solid rgba(0,230,118,0.4)", color: "#7dffb2" }}>
          <Plus className="w-4 h-4" /> NEW CHALLENGE
        </motion.button>
      </motion.div>

      {/* Domain filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setFilterDomain("all")} className="px-3 py-1.5 text-[10px] tracking-widest cursor-pointer"
          style={{ background: filterDomain === "all" ? "rgba(0,230,118,0.2)" : "transparent", border: "1px solid rgba(0,230,118,0.2)", color: "#7dffb2" }}>
          ALL
        </button>
        {DOMAINS.map(d => (
          <button key={d.value} onClick={() => setFilterDomain(d.value)} className="px-3 py-1.5 text-[10px] tracking-widest cursor-pointer"
            style={{ background: filterDomain === d.value ? "rgba(0,230,118,0.2)" : "transparent", border: "1px solid rgba(0,230,118,0.2)", color: "#7dffb2" }}>
            {d.label}
          </button>
        ))}
      </div>

      <div className="h-px w-full mb-6" style={{ background: "linear-gradient(to right, #00e676, transparent)" }} />

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" style={{ color: "#00e676" }} /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-sm" style={{ color: "rgba(159,230,184,0.4)" }}>
          NO CHALLENGE PROTOCOLS FOUND. CREATE ONE TO BEGIN.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((ps, i) => {
            const domainInfo = DOMAINS.find(d => d.value === ps.domain);
            const Icon = domainInfo?.icon || Code;
            return (
              <motion.div key={ps.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="p-4 sm:p-5 relative overflow-hidden group"
                style={{ background: "rgba(0,12,0,0.5)", border: `1px solid ${ps.published ? "rgba(0,230,118,0.3)" : "rgba(255,80,80,0.2)"}` }}>
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,230,118,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-[10px] px-2 py-0.5 flex items-center gap-1"
                        style={{ background: "rgba(0,230,118,0.1)", border: "1px solid rgba(0,230,118,0.2)", color: "rgba(159,230,184,0.6)" }}>
                        <Icon className="w-3 h-3" />{domainInfo?.label || ps.domain}
                      </span>
                      <span className="text-[10px] px-2 py-0.5"
                        style={{ background: ps.track === "senior" ? "rgba(255,30,30,0.1)" : "rgba(0,100,255,0.1)",
                          border: `1px solid ${ps.track === "senior" ? "rgba(255,30,30,0.3)" : "rgba(0,100,255,0.3)"}`,
                          color: ps.track === "senior" ? "#ff6666" : "#6699ff" }}>
                        {ps.track.toUpperCase()} TRACK
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 flex items-center gap-1`}
                        style={{ background: ps.published ? "rgba(0,230,118,0.15)" : "rgba(255,80,80,0.1)",
                          border: `1px solid ${ps.published ? "rgba(0,230,118,0.3)" : "rgba(255,80,80,0.2)"}`,
                          color: ps.published ? "#7dffb2" : "#ff8888" }}>
                        {ps.published ? <><Eye className="w-3 h-3" />LIVE</> : <><EyeOff className="w-3 h-3" />DRAFT</>}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base tracking-wider mb-2" style={{ color: "#7dffb2" }}>{ps.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(125,255,178,0.6)" }}>{ps.description.substring(0, 200)}{ps.description.length > 200 ? "..." : ""}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => togglePublish(ps)} className="p-2 cursor-pointer" title={ps.published ? "Unpublish" : "Publish"}
                      style={{ color: ps.published ? "rgba(0,230,118,0.6)" : "rgba(255,180,0,0.6)" }}>
                      {ps.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button onClick={() => openEdit(ps)} className="p-2 cursor-pointer" style={{ color: "rgba(0,230,118,0.5)" }}>
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(ps.id)} className="p-2 cursor-pointer" style={{ color: "rgba(255,80,80,0.5)" }}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)" }} onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg max-h-[85vh] overflow-y-auto p-6"
              style={{ background: "rgba(0,10,0,0.95)", border: "1px solid rgba(0,230,118,0.3)" }}
              onClick={(e) => e.stopPropagation()}>

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm tracking-[0.2em]" style={{ color: "#7dffb2" }}>
                  {editing ? "EDIT CHALLENGE" : "NEW CHALLENGE"}
                </h2>
                <button onClick={() => setShowModal(false)} className="cursor-pointer" style={{ color: "rgba(159,230,184,0.5)" }}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] tracking-widest mb-1.5" style={{ color: "rgba(159,230,184,0.5)" }}>DOMAIN</label>
                  <select value={form.domain} onChange={(e) => handleDomainChange(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm outline-none" style={inputStyle}>
                    {DOMAINS.map(d => <option key={d.value} value={d.value}>{d.label} ({d.track.toUpperCase()})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest mb-1.5" style={{ color: "rgba(159,230,184,0.5)" }}>TITLE</label>
                  <input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm outline-none" style={inputStyle} placeholder="Challenge title" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest mb-1.5" style={{ color: "rgba(159,230,184,0.5)" }}>DESCRIPTION</label>
                  <textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm outline-none min-h-[120px] resize-y" style={inputStyle}
                    placeholder="Full problem statement..." />
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.published}
                      onChange={(e) => setForm(f => ({ ...f, published: e.target.checked }))}
                      className="accent-green-500" />
                    <span className="text-xs tracking-widest" style={{ color: "#7dffb2" }}>PUBLISH IMMEDIATELY</span>
                  </label>
                </div>
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={saving}
                className="w-full mt-6 py-3 text-xs tracking-[0.2em] cursor-pointer flex items-center justify-center gap-2"
                style={{ background: "rgba(0,230,118,0.15)", border: "1px solid rgba(0,230,118,0.4)", color: "#7dffb2" }}>
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> SAVING...</> : (editing ? "UPDATE CHALLENGE" : "DEPLOY CHALLENGE")}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
