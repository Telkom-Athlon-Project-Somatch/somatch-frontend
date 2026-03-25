"use client";

import { useState, useEffect, useCallback, useDeferredValue } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminTopbar from "@/components/admin/AdminTopbar";
import ScholarshipTable from "@/components/admin/ScholarshipTable";
import DetailModal from "@/components/admin/DetailModal";
import { ToastContainer, useToast } from "@/components/admin/ToastSystem";
import { Button, StatCard, Skeleton } from "@/components/admin/ui";
import {
  fetchScholarships,
  fetchStats,
  updateScholarshipStatus,
  updateScholarship,
  bulkUpdateStatus,
  deleteScholarship,
} from "@/lib/admin-api";
import {
  Scholarship,
  ScholarshipListResponse,
  AdminStats,
} from "@/types/scholarship";
import { cn } from "@/lib/utils";

const STATUS_FILTERS = [
  { value: "all", label: "All", icon: "🗂️" },
  { value: "unverified", label: "Unverified", icon: "🔍" },
  { value: "pending", label: "Pending", icon: "⏳" },
  { value: "verified", label: "Verified", icon: "✅" },
  { value: "suspicious", label: "Suspicious", icon: "⚠️" },
];

const SORT_OPTIONS = [
  { value: "created_at", label: "Newest First" },
  { value: "trust_score", label: "Trust Score" },
  { value: "deadline", label: "Deadline" },
];

// ------------------------------------------------------------------
// MOCK DATA — used when backend is unavailable
// ------------------------------------------------------------------
const MOCK_SCHOLARSHIPS: Scholarship[] = [
  {
    id: "sch-001",
    title: "Beasiswa LPDP Reguler 2025",
    provider: "Lembaga Pengelola Dana Pendidikan (LPDP)",
    deadline: "2025-06-30",
    description: "Beasiswa penuh untuk program magister dan doktoral di perguruan tinggi terkemuka.",
    source_url: "https://lpdp.kemenkeu.go.id/beasiswa/reguler",
    requirements: ["WNI", "IPK min 3.0", "TOEFL/IELTS"],
    amount: "Penuh (tuition + living allowance)",
    education_level: "S2/S3",
    location: "Nasional / Internasional",
    status: "verified",
    trust_score: 98,
    ai_summary: "LPDP Reguler adalah beasiswa bergengsi dari Kemenkeu. Data sangat terpercaya.",
    admin_notes: "",
    created_at: "2025-01-10T08:00:00",
    updated_at: "2025-01-15T12:00:00",
  },
  {
    id: "sch-002",
    title: "Kampus Merdeka — Magang Bersertifikat Batch 7",
    provider: "Kemdikbudristek",
    deadline: "2025-05-15",
    description: "Program magang industri bersertifikat selama 6 bulan bersama ratusan mitra.",
    source_url: "https://kampusmerdeka.kemdikbud.go.id/program/magang",
    requirements: ["Mahasiswa aktif S1/D4 min Sem 5", "IPK min 2.75"],
    amount: "Uang saku bulanan + sertifikat",
    education_level: "D4/S1",
    location: "Seluruh Indonesia",
    status: "verified",
    trust_score: 95,
    ai_summary: "Program resmi Kemendikbud. Sangat terpercaya.",
    admin_notes: "",
    created_at: "2025-01-12T09:30:00",
    updated_at: "2025-01-20T10:00:00",
  },
  {
    id: "sch-003",
    title: "Beasiswa Unggulan Kemendikbud 2025",
    provider: "Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi",
    deadline: "2025-07-31",
    description: "Beasiswa untuk mahasiswa berprestasi jenjang S1, S2, dan S3.",
    source_url: "https://beasiswaunggulan.kemdikbud.go.id",
    requirements: ["WNI", "Min IPK 3.25", "Surat rekomendasi"],
    amount: "Biaya pendidikan + tunjangan bulanan",
    education_level: "S1/S2/S3",
    location: "Nasional",
    status: "pending",
    trust_score: 91,
    ai_summary: "Beasiswa resmi Kemendikbud. Deadline perlu dikonfirmasi.",
    admin_notes: "",
    created_at: "2025-02-01T08:00:00",
    updated_at: "2025-02-05T14:00:00",
  },
  {
    id: "sch-004",
    title: "Beasiswa Orbit Future Academy 2025",
    provider: "Orbit Future Academy",
    deadline: "2025-04-20",
    description: "Beasiswa penuh untuk program coding bootcamp intensif 6 bulan.",
    source_url: "https://orbitfutureacademy.id/beasiswa",
    requirements: ["Lulusan SMA/SMK", "Tes seleksi online"],
    amount: "Gratis biaya bootcamp Rp 15 juta",
    education_level: "SMA/SMK/D3/S1",
    location: "Online / Jakarta",
    status: "unverified",
    trust_score: 62,
    ai_summary: "Organisasi terdaftar resmi. Perlu verifikasi tambahan.",
    admin_notes: "",
    created_at: "2025-02-10T11:00:00",
    updated_at: "2025-02-10T11:00:00",
  },
  {
    id: "sch-005",
    title: "Beasiswa Indonesia Maju (BIM) Luar Negeri",
    provider: "Puslapdik Kemendikbud",
    deadline: "2025-08-15",
    description: "Beasiswa untuk studi S1, S2, dan S3 di universitas luar negeri.",
    source_url: "https://bim.kemdikbud.go.id",
    requirements: ["WNI", "IPK min 3.0", "LoA universitas"],
    amount: "Penuh termasuk tuition dan biaya hidup",
    education_level: "S1/S2/S3",
    location: "Luar Negeri",
    status: "pending",
    trust_score: 88,
    ai_summary: "Beasiswa dari unit Kemendikbud terpercaya.",
    admin_notes: "",
    created_at: "2025-02-15T08:00:00",
    updated_at: "2025-02-18T09:00:00",
  },
  {
    id: "sch-006",
    title: "Beasiswa Garuda Maskapai Prestasi 2025",
    provider: "Garuda Indonesia Foundation",
    deadline: "2025-03-15",
    description: "Beasiswa untuk mahasiswa berprestasi di bidang aviasi dan pariwisata.",
    source_url: "https://garudaindonesia.com/beasiswa-garuda-prestasi",
    requirements: ["S1 Penerbangan/Pariwisata", "IPK min 3.3"],
    amount: "Rp 2.000.000/bulan",
    education_level: "S1",
    location: "Jakarta / Tangerang",
    status: "unverified",
    trust_score: 45,
    ai_summary: "URL mencurigakan — bukan domain resmi Garuda. Perlu pengecekan.",
    admin_notes: "",
    created_at: "2025-02-20T13:00:00",
    updated_at: "2025-02-20T13:00:00",
  },
  {
    id: "sch-007",
    title: "Beasiswa Tanoto Foundation Scholars Program",
    provider: "Tanoto Foundation",
    deadline: "2025-04-30",
    description: "Beasiswa komprehensif dari Tanoto untuk mahasiswa S1 terbaik.",
    source_url: "https://tanotofoundation.org/id/scholarship",
    requirements: ["Mahasiswa S1 Semester 2-6", "IPK min 3.0", "Keluarga kurang mampu"],
    amount: "Biaya pendidikan + tunjangan + program pengembangan",
    education_level: "S1",
    location: "UI / ITB / IPB / UNPAD / USU / UNHAS",
    status: "verified",
    trust_score: 93,
    ai_summary: "Yayasan internasional terpercaya. Data sangat konsisten.",
    admin_notes: "",
    created_at: "2025-01-25T10:00:00",
    updated_at: "2025-02-01T08:00:00",
  },
  {
    id: "sch-008",
    title: "Beasiswa Astra 1914 Program 2025",
    provider: "PT Astra International Tbk",
    deadline: "2025-05-31",
    description: "Beasiswa dari Astra untuk mahasiswa S1 teknik dan bisnis.",
    source_url: "https://www.astra.co.id/CSR/beasiswa-astra",
    requirements: ["S1 Teknik atau Bisnis", "IPK min 3.0", "Semester 3-5"],
    amount: "Rp 12.000.000/tahun",
    education_level: "S1",
    location: "10 PTN Mitra Astra",
    status: "verified",
    trust_score: 90,
    ai_summary: "Beasiswa dari konglomerat terkemuka Indonesia. Terverifikasi.",
    admin_notes: "",
    created_at: "2025-02-05T09:00:00",
    updated_at: "2025-02-10T11:00:00",
  },
  {
    id: "sch-009",
    title: "Beasiswa Prestasi Digital Startup Akademi",
    provider: "Startup Akademi Indonesia (Tidak Resmi)",
    deadline: "2025-03-01",
    description: "Beasiswa untuk mahasiswa berbakat di bidang teknologi dan startup.",
    source_url: "https://startupakademi-id.blogspot.com/beasiswa-prestasi",
    requirements: ["Usia 18-25 tahun", "Follow akun Instagram"],
    amount: "Akses kelas online senilai Rp 5 juta",
    education_level: "SMA/D3/S1",
    location: "Online",
    status: "suspicious",
    trust_score: 12,
    ai_summary: "⚠️ SANGAT MENCURIGAKAN: URL dari blogspot, syarat follow media sosial. Kemungkinan penipuan.",
    admin_notes: "Flagged by AI system - likely scam",
    created_at: "2025-02-25T16:00:00",
    updated_at: "2025-02-25T16:00:00",
  },
  {
    id: "sch-010",
    title: "Beasiswa YBM BRI untuk Mahasiswa Kurang Mampu",
    provider: "Yayasan Baitul Maal Bank BRI (YBM BRI)",
    deadline: "2025-06-15",
    description: "Beasiswa dari yayasan sosial Bank BRI untuk mahasiswa dari keluarga kurang mampu.",
    source_url: "https://ybmbri.org/program/beasiswa",
    requirements: ["WNI", "KIP/SKTM", "IPK min 2.75"],
    amount: "Bantuan biaya pendidikan + uang saku",
    education_level: "S1",
    location: "Seluruh Indonesia",
    status: "pending",
    trust_score: 82,
    ai_summary: "Yayasan di bawah Bank BRI. Data cukup lengkap.",
    admin_notes: "",
    created_at: "2025-03-01T08:00:00",
    updated_at: "2025-03-01T08:00:00",
  },
  {
    id: "sch-011",
    title: "Beasiswa Djarum Plus 2025",
    provider: "Djarum Foundation",
    deadline: "2025-05-20",
    description: "Program beasiswa dan pengembangan karakter dari Djarum Foundation.",
    source_url: "https://djarumbeasiswa.com",
    requirements: ["IPK min 3.2", "Aktif berorganisasi", "Semester 4"],
    amount: "Rp 1.000.000/bulan + program pengembangan",
    education_level: "S1",
    location: "Perguruan Tinggi Negeri Terpilih",
    status: "verified",
    trust_score: 96,
    ai_summary: "Salah satu beasiswa swasta paling bergengsi di Indonesia.",
    admin_notes: "",
    created_at: "2025-01-20T08:00:00",
    updated_at: "2025-01-25T10:00:00",
  },
  {
    id: "sch-012",
    title: "Beasiswa Google Developer Expert Indonesia",
    provider: "Google.org / Google Southeast Asia",
    deadline: "2025-07-15",
    description: "Beasiswa pengembangan teknologi dari Google untuk talenta muda.",
    source_url: "https://developers.google.com/community/experts/indonesia",
    requirements: ["S1 Informatika", "Portofolio teknologi"],
    amount: "Akses penuh platform Google + sertifikasi",
    education_level: "S1",
    location: "Online / Indonesia",
    status: "unverified",
    trust_score: 71,
    ai_summary: "Domain Google resmi. Perlu konfirmasi dari kanal resmi Indonesia.",
    admin_notes: "",
    created_at: "2025-03-05T10:00:00",
    updated_at: "2025-03-05T10:00:00",
  },
];

export default function VerificationQueuePage() {
  // ── State ──
  const [data, setData] = useState<ScholarshipListResponse | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [modalScholarship, setModalScholarship] = useState<Scholarship | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savingModal, setSavingModal] = useState(false);
  const [usesMock, setUsesMock] = useState(false);

  // Expose delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [scholarshipToDelete, setScholarshipToDelete] = useState<{id: string, title: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const deferredSearch = useDeferredValue(search);
  const { toasts, toast, dismiss } = useToast();

  // ── Load data ──
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchScholarships({
        search: deferredSearch || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
        page,
        page_size: 10,
      });
      setData(result);
      setUsesMock(false);
    } catch {
      // Use mock data when backend is down
      let filtered = [...MOCK_SCHOLARSHIPS];
      if (statusFilter !== "all") {
        filtered = filtered.filter((s) => s.status === statusFilter);
      }
      if (deferredSearch) {
        const q = deferredSearch.toLowerCase();
        filtered = filtered.filter(
          (s) => s.title.toLowerCase().includes(q) || s.provider.toLowerCase().includes(q)
        );
      }
      if (sortBy === "trust_score") {
        filtered.sort((a, b) =>
          sortOrder === "desc" ? b.trust_score - a.trust_score : a.trust_score - b.trust_score
        );
      }
      const total = filtered.length;
      const start = (page - 1) * 10;
      setData({
        scholarships: filtered.slice(start, start + 10),
        total,
        page,
        page_size: 10,
        total_pages: Math.max(1, Math.ceil(total / 10)),
      });
      setUsesMock(true);
    } finally {
      setLoading(false);
    }
  }, [deferredSearch, statusFilter, sortBy, sortOrder, page]);

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const s = await fetchStats();
      setStats(s);
    } catch {
      setStats({
        total: MOCK_SCHOLARSHIPS.length,
        verified: MOCK_SCHOLARSHIPS.filter((s) => s.status === "verified").length,
        pending: MOCK_SCHOLARSHIPS.filter((s) => s.status === "pending").length,
        suspicious: MOCK_SCHOLARSHIPS.filter((s) => s.status === "suspicious").length,
        unverified: MOCK_SCHOLARSHIPS.filter((s) => s.status === "unverified").length,
        avg_trust_score: Math.round(
          MOCK_SCHOLARSHIPS.reduce((a, s) => a + s.trust_score, 0) / MOCK_SCHOLARSHIPS.length
        ),
      });
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Reset page on filter/search change
  useEffect(() => {
    setPage(1);
    setSelectedIds(new Set());
  }, [deferredSearch, statusFilter, sortBy, sortOrder]);

  // ── Action helpers ──
  const updateStatus = async (id: string, status: string, label: string) => {
    if (usesMock) {
      // Mock update
      if (data) {
        setData((prev) =>
          prev
            ? {
                ...prev,
                scholarships: prev.scholarships.map((s) =>
                  s.id === id ? { ...s, status: status as Scholarship["status"] } : s
                ),
              }
            : prev
        );
      }
      if (modalScholarship?.id === id) {
        setModalScholarship((prev) =>
          prev ? { ...prev, status: status as Scholarship["status"] } : prev
        );
      }
      toast(`Scholarship ${label} (demo mode)`, "success");
      return;
    }
    try {
      await updateScholarshipStatus(id, status);
      toast(`Scholarship ${label} successfully.`, "success");
      loadData();
      loadStats();
      if (modalScholarship?.id === id) {
        setModalScholarship((prev) =>
          prev ? { ...prev, status: status as Scholarship["status"] } : prev
        );
      }
    } catch {
      toast("Failed to update status.", "error");
    }
  };

  const handleApprove = (id: string) => updateStatus(id, "verified", "approved");
  const handleReject = (id: string) => updateStatus(id, "suspicious", "rejected");
  const handlePending = (id: string) => updateStatus(id, "pending", "marked as pending");

  const openDeleteModal = (id: string, title: string) => {
    setScholarshipToDelete({ id, title });
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!scholarshipToDelete) return;
    setIsDeleting(true);
    
    if (usesMock) {
      if (data) {
        setData((prev) => prev ? {
          ...prev,
          scholarships: prev.scholarships.filter(s => s.id !== scholarshipToDelete.id),
          total: prev.total - 1
        } : prev);
      }
      toast("Scholarship deleted (demo mode).", "success");
      setDeleteModalOpen(false);
      setScholarshipToDelete(null);
      setIsDeleting(false);
      return;
    }
    
    try {
      await deleteScholarship(scholarshipToDelete.id);
      toast("Scholarship deleted successfully.", "success");
      loadData();
      loadStats();
    } catch {
      toast("Failed to delete scholarship.", "error");
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setScholarshipToDelete(null);
    }
  };

  const handleSave = async (id: string, updates: Partial<Scholarship>) => {
    setSavingModal(true);
    if (usesMock) {
      if (data) {
        setData((prev) =>
          prev
            ? {
                ...prev,
                scholarships: prev.scholarships.map((s) =>
                  s.id === id ? { ...s, ...updates } : s
                ),
              }
            : prev
        );
      }
      setModalScholarship((prev) => (prev ? { ...prev, ...updates } : prev));
      toast("Changes saved (demo mode).", "success");
      setSavingModal(false);
      setIsModalOpen(false);
      return;
    }
    try {
      const updated = await updateScholarship(id, updates);
      setModalScholarship(updated);
      toast("Scholarship updated successfully.", "success");
      loadData();
      setIsModalOpen(false);
    } catch {
      toast("Failed to save changes.", "error");
    } finally {
      setSavingModal(false);
    }
  };

  const handleBulkAction = async (status: string) => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    if (usesMock) {
      if (data) {
        setData((prev) =>
          prev
            ? {
                ...prev,
                scholarships: prev.scholarships.map((s) =>
                  ids.includes(s.id) ? { ...s, status: status as Scholarship["status"] } : s
                ),
              }
            : prev
        );
      }
      toast(`${ids.length} item(s) ${status} (demo mode).`, "success");
      setSelectedIds(new Set());
      return;
    }
    try {
      const result = await bulkUpdateStatus(ids, status);
      toast(result.message, "success");
      setSelectedIds(new Set());
      loadData();
      loadStats();
    } catch {
      toast("Bulk action failed.", "error");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (!data) return;
    setSelectedIds(checked ? new Set(data.scholarships.map((s) => s.id)) : new Set());
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const handleView = (s: Scholarship) => {
    setModalScholarship(s);
    setIsModalOpen(true);
  };

  const scholarships = data?.scholarships ?? [];
  const totalPages = data?.total_pages ?? 1;
  const total = data?.total ?? 0;

  return (
    <div>
      <AdminTopbar
        title="Verification Queue"
        subtitle="Review and verify AI-crawled scholarship data"
      />

      <div className="p-6 space-y-6">
        {/* Mock Warning Banner */}
        {/* Mock Warning Banner */}
        <AnimatePresence>
          {usesMock && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm"
            >
              <span>⚠️</span>
              <span>
                <strong>Demo Mode:</strong> Backend is unavailable. Showing mock data — changes won&apos;t persist.
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {statsLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-4">
                  <Skeleton className="h-3 w-16 mb-2" />
                  <Skeleton className="h-7 w-10" />
                </div>
              ))
            : [
                { label: "Total", value: stats?.total ?? 0, color: "text-primary", icon: "🎓" },
                { label: "Verified", value: stats?.verified ?? 0, color: "text-emerald-500", icon: "✅" },
                { label: "Pending", value: stats?.pending ?? 0, color: "text-amber-500", icon: "⏳" },
                { label: "Suspicious", value: stats?.suspicious ?? 0, color: "text-rose-500", icon: "⚠️" },
                { label: "Unverified", value: stats?.unverified ?? 0, color: "text-slate-500", icon: "🔍" },
                { label: "Avg Trust", value: `${stats?.avg_trust_score ?? 0}`, color: "text-violet-500", icon: "🧠" },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <StatCard label={s.label} value={s.value} icon={s.icon} color={s.color} />
                </motion.div>
              ))}
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              🔍
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or provider..."
              className={cn(
                "w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-foreground",
                "bg-card border border-border placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
                "transition-all shadow-sm"
              )}
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={cn(
                "pl-3 pr-8 py-2.5 rounded-xl text-sm text-foreground bg-card border border-border shadow-sm",
                "focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none cursor-pointer"
              )}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  Sort: {o.label}
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">⌄</span>
          </div>

          <button
            onClick={() => setSortOrder((p) => (p === "desc" ? "asc" : "desc"))}
            className="px-4 py-2.5 rounded-xl text-sm text-muted-foreground bg-card border border-border hover:bg-muted/50 transition-all shadow-sm"
            title="Toggle sort order"
          >
            {sortOrder === "desc" ? "↓ Desc" : "↑ Asc"}
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm",
                statusFilter === f.value
                  ? "bg-primary text-primary-foreground border border-primary"
                  : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-border"
              )}
            >
              <span>{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-wrap items-center gap-4 px-5 py-4 rounded-xl border border-primary/20 bg-primary/10 shadow-lg"
            >
              <span className="text-sm text-primary font-bold">
                {selectedIds.size} selected items
              </span>
              <div className="flex gap-2">
                <Button variant="success" size="sm" onClick={() => handleBulkAction("verified")}>
                  ✅ Approve All
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleBulkAction("suspicious")}>
                  ❌ Reject All
                </Button>
                <Button variant="warning" size="sm" onClick={() => handleBulkAction("pending")}>
                  ⏳ Pending All
                </Button>
                <div className="w-px h-8 bg-primary/20 mx-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIds(new Set())}
                >
                  Clear Selection
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table */}
        <ScholarshipTable
          scholarships={scholarships}
          loading={loading}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
          onView={handleView}
          onApprove={handleApprove}
          onReject={handleReject}
          onMarkPending={handlePending}
          onDelete={openDeleteModal}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pb-8">
            <p className="text-sm text-muted-foreground font-medium">
              Showing <span className="text-foreground">{(page - 1) * 10 + 1}–{Math.min(page * 10, total)}</span> of <span className="text-foreground">{total}</span> scholarships
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← Prev
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={cn(
                        "w-9 h-9 rounded-lg text-sm font-bold transition-all shadow-sm",
                        page === pageNum
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border"
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next →
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <DetailModal
        scholarship={modalScholarship}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTimeout(() => setModalScholarship(null), 300);
        }}
        onApprove={handleApprove}
        onReject={handleReject}
        onMarkPending={handlePending}
        onSave={handleSave}
        saving={savingModal}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && scholarshipToDelete && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => !isDeleting && setDeleteModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl overflow-hidden"
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Delete Scholarship</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Are you sure you want to delete <span className="font-semibold text-foreground">&quot;{scholarshipToDelete.title}&quot;</span>? This action is permanent and cannot be undone.
                </p>
                <div className="flex justify-end gap-3 mt-8">
                  <Button variant="outline" onClick={() => setDeleteModalOpen(false)} disabled={isDeleting}>
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={confirmDelete} disabled={isDeleting}>
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
