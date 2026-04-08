"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  Bookmark,
  Calendar,
  ExternalLink,
  Loader2,
  Trash2,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:8000";

interface Scholarship {
  id: string;
  title: string;
  provider: string;
  deadline: string;
  description: string;
  source_url: string;
  education_level?: string;
  location?: string;
  status?: string;
}

function generateCalendarUrl(scholarship: Scholarship): string {
  const title = encodeURIComponent(scholarship.title);
  const details = encodeURIComponent(
    `Beasiswa: ${scholarship.title}\nPenyelenggara: ${scholarship.provider}`
  );
  const deadlineDate = scholarship.deadline.replace(/-/g, "");
  const nextDay = new Date(scholarship.deadline);
  nextDay.setDate(nextDay.getDate() + 1);
  const endDate = nextDay.toISOString().split("T")[0].replace(/-/g, "");
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${deadlineDate}/${endDate}&details=${details}`;
}

// ──────────────────────────────────────────────────────────────────
// Single bookmark card
// ──────────────────────────────────────────────────────────────────
function BookmarkCard({
  s,
  deleting,
  onDelete,
  isPending = false,
}: {
  s: Scholarship;
  deleting: string | null;
  onDelete: (id: string) => void;
  isPending?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-3xl border p-6 hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden ${
        isPending
          ? "border-amber-200 hover:border-amber-400/50"
          : "border-slate-200 hover:border-indigo-500/30"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
        <h3
          className={`text-base font-bold text-slate-900 leading-snug line-clamp-2 flex-1 transition-colors ${
            isPending ? "group-hover:text-amber-600" : "group-hover:text-indigo-600"
          }`}
        >
          {s.title}
        </h3>
        <button
          onClick={() => onDelete(s.id)}
          disabled={deleting === s.id}
          className="shrink-0 p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-rose-500/50 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all"
          title="Hapus bookmark"
        >
          {deleting === s.id ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>

      <p className="text-sm font-medium text-slate-500 mb-6 font-heading uppercase tracking-widest">
        {s.provider}
      </p>

      {/* Deadline */}
      <div className="flex items-center justify-between mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Deadline</span>
          <p className="text-sm font-black text-slate-800">{s.deadline || "-"}</p>
        </div>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
            isPending
              ? "bg-amber-500/10 border-amber-500/20"
              : "bg-indigo-500/10 border-indigo-500/20"
          }`}
        >
          <Calendar className={`w-5 h-5 ${isPending ? "text-amber-500" : "text-indigo-500"}`} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 relative z-10">
        <a
          href={generateCalendarUrl(s)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 hover:bg-linear-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white transition-all shadow-sm"
        >
          <Calendar className="w-4 h-4" /> Tambah ke Calendar
        </a>
        {s.source_url && (
          <a
            href={s.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50 shadow-sm transition-all text-xs font-bold"
          >
            <ExternalLink className="w-4 h-4" /> Info Lengkap
          </a>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Main page
// ──────────────────────────────────────────────────────────────────
export default function BookmarksPage() {
  const { token, isLoading } = useAuth();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [pendingOpen, setPendingOpen] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchBookmarks = async () => {
      setLoading(true);
      try {
        // 1. Get bookmark IDs
        const resIds = await fetch(`${API_BASE}/api/auth/bookmarks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { bookmarks: ids } = await resIds.json();

        if (!ids || ids.length === 0) {
          setScholarships([]);
          setLoading(false);
          return;
        }

        // 2. Fetch scholarship batch details (approved + pending)
        const resDetails = await fetch(`${API_BASE}/api/scholarships/batch`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(ids),
        });
        const details = await resDetails.json();
        setScholarships(details || []);
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [token]);

  const removeBookmark = async (id: string) => {
    if (!token || deleting) return;
    setDeleting(id);
    try {
      await fetch(`${API_BASE}/api/auth/bookmarks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setScholarships((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to remove bookmark:", err);
    } finally {
      setDeleting(null);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  // Split by status
  const approvedList = scholarships.filter(
    (s) => !s.status || s.status === "verified" || s.status === "approved"
  );
  const pendingList = scholarships.filter((s) => s.status === "pending");

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-10 min-h-screen">
      <div className="space-y-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight font-heading">My Bookmarks</h1>
        <p className="text-slate-500 font-medium">Koleksi beasiswa yang telah kamu simpan untuk ditinjau nanti.</p>
        {scholarships.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
              {approvedList.length} Terverifikasi
            </span>
            {pendingList.length > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20">
                {pendingList.length} Pending
              </span>
            )}
          </div>
        )}
      </div>

      {scholarships.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
          <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 mb-6">
            <Bookmark className="w-10 h-10 text-indigo-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Belum ada bookmark</h3>
          <p className="text-slate-500 text-center max-w-xs px-6">
            Klik ikon bookmark pada beasiswa yang kamu sukai di halaman Explore untuk melihatnya di sini.
          </p>
        </div>
      ) : (
        <>
          {/* ── Verified grid ─────────────────────────────────── */}
          {approvedList.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedList.map((s) => (
                <BookmarkCard
                  key={s.id}
                  s={s}
                  deleting={deleting}
                  onDelete={(id) => setConfirmDeleteId(id)}
                />
              ))}
            </div>
          )}

          {/* ── Pending accordion ─────────────────────────────── */}
          {pendingList.length > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/40 overflow-hidden">
              <button
                onClick={() => setPendingOpen((v) => !v)}
                className="w-full flex items-center justify-between gap-3 px-6 py-4 text-left hover:bg-amber-50/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-amber-700">
                      Menunggu Verifikasi (Pending) — Informasi mungkin perlu pembaruan
                    </p>
                    <p className="text-xs text-amber-600/80 mt-0.5">
                      {pendingList.length} bookmark sedang dalam proses review oleh tim kami
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-amber-500 shrink-0 transition-transform duration-200 ${pendingOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence initial={false}>
                {pendingOpen && (
                  <motion.div
                    key="pending-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pendingList.map((s) => (
                        <BookmarkCard
                          key={s.id}
                          s={s}
                          deleting={deleting}
                          onDelete={(id) => setConfirmDeleteId(id)}
                          isPending
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-2">Hapus Bookmark?</h3>
              <p className="text-slate-500 text-sm mb-6">
                Apakah kamu yakin ingin menghapus beasiswa ini dari daftar bookmark?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    removeBookmark(confirmDeleteId);
                    setConfirmDeleteId(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-all shadow-sm"
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
