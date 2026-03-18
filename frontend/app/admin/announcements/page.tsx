"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Upload, Image, Calendar, Loader2 } from "lucide-react";
import "@fontsource/share-tech-mono";

interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AnnouncementsAdmin() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState({ title: "", description: "", date: "", imageUrl: "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/announcements");
      const data = await res.json();
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", description: "", date: new Date().toISOString().split("T")[0], imageUrl: "" });
    setShowModal(true);
  };

  const openEdit = (a: Announcement) => {
    setEditing(a);
    setForm({ title: a.title, description: a.description, date: a.date, imageUrl: a.imageUrl || "" });
    setShowModal(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) setForm((f) => ({ ...f, imageUrl: data.url }));
    } catch { /* ignore */ } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editing ? `/api/announcements/${editing.id}` : "/api/announcements";
      const method = editing ? "PUT" : "POST";
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setShowModal(false);
      await fetchAnnouncements();
    } catch { /* ignore */ } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    await fetch(`/api/announcements/${id}`, { method: "DELETE" });
    await fetchAnnouncements();
  };

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
            ANNOUNCEMENTS
          </h1>
          <p className="text-[10px] tracking-[0.2em]" style={{ color: "rgba(159,230,184,0.4)" }}>
            MANAGE SYSTEM BROADCASTS
          </p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 text-xs tracking-widest cursor-pointer"
          style={{ background: "rgba(0,230,118,0.15)", border: "1px solid rgba(0,230,118,0.4)", color: "#7dffb2" }}>
          <Plus className="w-4 h-4" /> NEW BROADCAST
        </motion.button>
      </motion.div>

      <div className="h-px w-full mb-6" style={{ background: "linear-gradient(to right, #00e676, transparent)" }} />

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#00e676" }} />
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-16 text-sm" style={{ color: "rgba(159,230,184,0.4)" }}>
          NO BROADCASTS IN SYSTEM. CREATE ONE TO BEGIN.
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 sm:p-5 relative overflow-hidden group"
              style={{ background: "rgba(0,12,0,0.5)", border: "1px solid rgba(0,230,118,0.15)" }}>
              <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,230,118,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-[10px] px-2 py-0.5" style={{ background: "rgba(0,230,118,0.1)", border: "1px solid rgba(0,230,118,0.2)", color: "rgba(159,230,184,0.6)" }}>
                        <Calendar className="w-3 h-3 inline mr-1" />{a.date}
                      </span>
                      <span className="text-[9px] tracking-wider" style={{ color: "rgba(159,230,184,0.3)" }}>
                        {new Date(a.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base tracking-wider mb-2" style={{ color: "#7dffb2" }}>{a.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(125,255,178,0.6)" }}>{a.description}</p>
                    {a.imageUrl && (
                      <div className="mt-3 flex items-center gap-2 text-[10px]" style={{ color: "rgba(0,230,118,0.5)" }}>
                        <Image className="w-3 h-3" /> {a.imageUrl}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => openEdit(a)} className="p-2 cursor-pointer transition-colors" style={{ color: "rgba(0,230,118,0.5)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#00e676")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(0,230,118,0.5)")}>
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(a.id)} className="p-2 cursor-pointer transition-colors" style={{ color: "rgba(255,80,80,0.5)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#ff4444")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,80,80,0.5)")}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)" }}
            onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg max-h-[85vh] overflow-y-auto p-6"
              style={{ background: "rgba(0,10,0,0.95)", border: "1px solid rgba(0,230,118,0.3)" }}
              onClick={(e) => e.stopPropagation()}>

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm tracking-[0.2em]" style={{ color: "#7dffb2" }}>
                  {editing ? "EDIT BROADCAST" : "NEW BROADCAST"}
                </h2>
                <button onClick={() => setShowModal(false)} className="cursor-pointer" style={{ color: "rgba(159,230,184,0.5)" }}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] tracking-widest mb-1.5" style={{ color: "rgba(159,230,184,0.5)" }}>TITLE</label>
                  <input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm outline-none" style={inputStyle} placeholder="Announcement title" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest mb-1.5" style={{ color: "rgba(159,230,184,0.5)" }}>DESCRIPTION</label>
                  <textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm outline-none min-h-[100px] resize-y" style={inputStyle} placeholder="Details here..." />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest mb-1.5" style={{ color: "rgba(159,230,184,0.5)" }}>DATE</label>
                  <input type="date" value={form.date} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm outline-none" style={inputStyle} />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest mb-1.5" style={{ color: "rgba(159,230,184,0.5)" }}>IMAGE (OPTIONAL)</label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-3 py-2 text-xs cursor-pointer"
                      style={{ background: "rgba(0,230,118,0.1)", border: "1px solid rgba(0,230,118,0.2)", color: "rgba(159,230,184,0.6)" }}>
                      <Upload className="w-3.5 h-3.5" />
                      {uploading ? "UPLOADING..." : "UPLOAD"}
                      <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                    </label>
                    {form.imageUrl && <span className="text-[10px] truncate flex-1" style={{ color: "rgba(159,230,184,0.4)" }}>{form.imageUrl}</span>}
                  </div>
                </div>
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={saving}
                className="w-full mt-6 py-3 text-xs tracking-[0.2em] cursor-pointer flex items-center justify-center gap-2"
                style={{ background: "rgba(0,230,118,0.15)", border: "1px solid rgba(0,230,118,0.4)", color: "#7dffb2" }}>
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> SAVING...</> : (editing ? "UPDATE BROADCAST" : "PUBLISH BROADCAST")}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
