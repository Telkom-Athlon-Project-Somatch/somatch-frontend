"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Search,
  Bookmark,
  BookmarkCheck,
  Calendar,
  ExternalLink,
  Loader2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  MapPin,
  Clock,
  Shield,
  CheckCircle2,
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
  requirements: string[];
  amount?: string;
  education_level?: string;
  location?: string;
  status: string;
  trust_score: number;
  ai_summary?: string;
}

function generateCalendarUrl(scholarship: Scholarship): string {
  const title = encodeURIComponent(scholarship.title);
  const details = encodeURIComponent(
    `Beasiswa: ${scholarship.title}\nPenyelenggara: ${scholarship.provider}\nInfo: ${scholarship.source_url}`
  );

  if (!scholarship.deadline) return "#";

  const deadlineDate = scholarship.deadline.replace(/-/g, "");
  const nextDay = new Date(scholarship.deadline);
  nextDay.setDate(nextDay.getDate() + 1);
  const endDate = nextDay.toISOString().split("T")[0].replace(/-/g, "");
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${deadlineDate}/${endDate}&details=${details}`;
}

function getDeadlineStatus(deadline: string): { label: string; color: string } {
  if (!deadline) return { label: "Unknown", color: "text-slate-400" };

  const now = new Date();
  const dl = new Date(deadline);
  const days = Math.ceil((dl.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (days < 0) return { label: "Expired", color: "text-slate-500" };
  if (days <= 7) return { label: `${days}d left`, color: "text-rose-400" };
  if (days <= 30) return { label: `${days}d left`, color: "text-amber-400" };
  return { label: `${days}d left`, color: "text-emerald-400" };
}

// ──────────────────────────────────────────────────────────────────
// Reusable scholarship card
// ──────────────────────────────────────────────────────────────────
function ScholarshipCard({
  s,
  isBookmarked,
  bookmarkLoading,
  onToggleBookmark,
  isPending = false,
}: {
  s: Scholarship;
  isBookmarked: boolean;
  bookmarkLoading: string | null;
  onToggleBookmark: (id: string) => void;
  isPending?: boolean;
}) {
  const deadlineInfo = getDeadlineStatus(s.deadline);

  return (
    <div
      className={`bg-white rounded-3xl border p-6 hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden ${
        isPending
          ? "border-amber-200 hover:border-amber-400/50"
          : "border-slate-200 hover:border-indigo-500/30"
      }`}
    >
      <div
        className={`absolute top-0 right-0 w-24 h-24 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 transition-colors ${
          isPending
            ? "bg-amber-500/5 group-hover:bg-amber-500/10"
            : "bg-indigo-500/5 group-hover:bg-indigo-500/10"
        }`}
      />

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
          onClick={() => onToggleBookmark(s.id)}
          disabled={bookmarkLoading === s.id}
          className="shrink-0 p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-500/50 transition-all"
          title={isBookmarked ? "Hapus bookmark" : "Simpan bookmark"}
        >
          {isBookmarked ? (
            <BookmarkCheck className="w-4 h-4 text-indigo-400" />
          ) : (
            <Bookmark className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
          )}
        </button>
      </div>

      {/* Provider */}
      <p className="text-sm font-medium text-slate-500 mb-4">{s.provider}</p>

      {/* Description */}
      <div className="relative mb-6">
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 group-hover:text-slate-700 transition-colors">
          {s.description}
        </p>
      </div>

      {/* Date & Deadline Info */}
      <div className="flex items-center justify-between mb-6 relative z-10 px-1">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Deadline</span>
          <p className="text-sm font-bold text-slate-800">{s.deadline || "-"}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[10px] font-bold uppercase tracking-tight ${deadlineInfo.color}`}
        >
          <Clock className="w-3 h-3" /> {deadlineInfo.label}
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-5 border-t border-slate-100 relative z-10">
        {s.deadline && (
          <a
            href={generateCalendarUrl(s)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            title="Add deadline to Google Calendar"
          >
            <Calendar className="w-4 h-4" /> Tambahkan ke Google Calendar
          </a>
        )}
        {s.source_url && (
          <a
            href={s.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50 shadow-sm transition-all text-xs"
          >
            <ExternalLink className="w-4 h-4" /> Lihat Detail Sumber
          </a>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Main page
// ──────────────────────────────────────────────────────────────────
export default function ExplorePage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [bookmarkLoading, setBookmarkLoading] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [pendingOpen, setPendingOpen] = useState(false);

  // Load bookmarks
  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/api/auth/bookmarks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setBookmarks(new Set(data.bookmarks || [])))
      .catch(() => {});
  }, [token]);

  // Load scholarships
  const loadScholarships = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (educationLevel) params.set("education_level", educationLevel);
      if (location) params.set("location", location);
      params.set("page", String(page));
      params.set("page_size", "12");

      const res = await fetch(`${API_BASE}/api/scholarships?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setScholarships(data.scholarships || []);
      setTotalPages(data.total_pages || 1);
      setTotal(data.total || 0);
    } catch {
      setScholarships([]);
    } finally {
      setLoading(false);
    }
  }, [token, query, educationLevel, location, page]);

  useEffect(() => {
    if (token) loadScholarships();
  }, [loadScholarships, token]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [query, educationLevel, location]);

  const toggleBookmark = async (scholarshipId: string) => {
    if (!token || bookmarkLoading) return;
    setBookmarkLoading(scholarshipId);

    const isBookmarked = bookmarks.has(scholarshipId);
    try {
      if (isBookmarked) {
        await fetch(`${API_BASE}/api/auth/bookmarks/${scholarshipId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookmarks((prev) => {
          const next = new Set(prev);
          next.delete(scholarshipId);
          return next;
        });
      } else {
        await fetch(`${API_BASE}/api/auth/bookmarks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ scholarship_id: scholarshipId }),
        });
        setBookmarks((prev) => new Set(prev).add(scholarshipId));
        setToastMessage("Berhasil ditambahkan ke bookmark");
        setTimeout(() => setToastMessage(""), 3000);
      }
    } catch {}
    setBookmarkLoading(null);
  };

  // Split results by status
  const approvedList = scholarships.filter((s) => s.status === "verified" || s.status === "approved");
  const pendingList  = scholarships.filter((s) => s.status === "pending");

  return (
    <div className="p-5 sm:p-8 lg:p-12 max-w-7xl mx-auto space-y-8 min-h-screen">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">Explore Scholarships</h1>
          <p className="text-slate-500 font-medium text-sm sm:text-base">Temukan peluang beasiswa terbaik dari seluruh penjuru Indonesia.</p>
          <div className="pt-1 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
              {approvedList.length} Beasiswa Terverifikasi
            </span>
            {pendingList.length > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20">
                {pendingList.length} Menunggu Verifikasi
              </span>
            )}
          </div>
        </div>

        <Link
          href="/app/bookmarks"
          className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-600/20 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shrink-0"
        >
          <Bookmark className="w-4 h-4" /> Buka Bookmarks
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm relative z-20">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari beasiswa..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-400 border border-slate-200 shadow-sm"
          />
        </div>
        <select
          value={educationLevel}
          onChange={(e) => setEducationLevel(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <option value="">Semua Jenjang</option>
          <option value="SMA">SMA/SMK</option>
          <option value="D3">D3</option>
          <option value="S1">S1</option>
          <option value="S2">S2</option>
          <option value="S3">S3</option>
        </select>
        <div className="relative flex-1 sm:flex-none">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Lokasi..."
            className="pl-12 pr-4 py-3 rounded-xl bg-white text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none w-full sm:w-44 border border-slate-200 shadow-sm"
          />
        </div>
      </div>

      {/* ── Verified Scholarship Grid ─────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-200 p-6 animate-pulse shadow-sm">
              <div className="h-6 bg-slate-200 rounded w-3/4 mb-4" />
              <div className="h-4 bg-slate-200/80 rounded w-1/2 mb-6" />
              <div className="space-y-2 mb-6">
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-2/3" />
              </div>
              <div className="flex gap-2">
                <div className="h-8 bg-slate-100 rounded-xl w-24" />
                <div className="h-8 bg-slate-100 rounded-xl w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : approvedList.length === 0 && pendingList.length === 0 ? (
        <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
          <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-1">No scholarships found</h3>
          <p className="text-slate-500 text-sm">Coba ubah kata kunci atau filter pencarianmu.</p>
        </div>
      ) : (
        <>
          {approvedList.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedList.map((s) => (
                <ScholarshipCard
                  key={s.id}
                  s={s}
                  isBookmarked={bookmarks.has(s.id)}
                  bookmarkLoading={bookmarkLoading}
                  onToggleBookmark={toggleBookmark}
                />
              ))}
            </div>
          )}

          {/* ── Pending Accordion ─────────────────────────────── */}
          {pendingList.length > 0 && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/40 overflow-hidden">
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
                      {pendingList.length} beasiswa sedang dalam proses review oleh tim kami
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
                        <ScholarshipCard
                          key={s.id}
                          s={s}
                          isBookmarked={bookmarks.has(s.id)}
                          bookmarkLoading={bookmarkLoading}
                          onToggleBookmark={toggleBookmark}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-3 rounded-xl border border-slate-200 bg-white text-slate-500 disabled:opacity-20 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="bg-white border border-slate-200 px-5 py-2 rounded-xl shadow-sm">
            <span className="text-sm text-slate-700 font-bold uppercase tracking-widest">
              {page} <span className="text-slate-400 mx-1">/</span> {totalPages}
            </span>
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-3 rounded-xl border border-slate-200 bg-white text-slate-500 disabled:opacity-20 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-2xl shadow-2xl"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
