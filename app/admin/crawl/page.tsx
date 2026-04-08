"use client";

import { useState } from "react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { motion } from "framer-motion";
import Link from "next/link";
import { ToastContainer, useToast } from "@/components/admin/ToastSystem";
import { Button } from "@/components/admin/ui";
import { Loader2 } from "lucide-react";
import ScholarshipTable from "@/components/admin/ScholarshipTable";
import DetailModal from "@/components/admin/DetailModal";
import { Scholarship } from "@/types/scholarship";
import {
  updateScholarshipStatus,
  updateScholarship,
  deleteScholarship,
  approveStagingEntry,
  rejectStagingEntry,
  deleteStagingEntry,
  updateStagingEntry,
  isStagingId,
} from "@/lib/admin-api";
import { useAuth } from "@/context/AuthContext";

const MOCK_CRAWL_HISTORY = [
  { id: 1, keyword: "beasiswa S1 luar negeri 2026 fully funded", total: 12, status: "completed", timestamp: "2025-04-08T10:30:00" },
  { id: 2, keyword: "LPDP magister 2025", total: 45, status: "completed", timestamp: "2025-04-08T09:15:00" },
  { id: 3, keyword: "beasiswa kemendikbud", total: 0, status: "failed", timestamp: "2025-04-07T16:20:00" },
  { id: 4, keyword: "tanoto foundation scholarship", total: 1, status: "completed", timestamp: "2025-04-07T14:10:00" },
];

export default function ScholarshipsPage() {
  const { token } = useAuth();
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toasts, toast, dismiss } = useToast();

  // For ScholarshipTable
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [modalScholarship, setModalScholarship] = useState<Scholarship | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savingModal, setSavingModal] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [scholarshipToDelete, setScholarshipToDelete] = useState<{id: string, title: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCrawl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    
    setLoading(true);
    setResult(null);
    setSelectedIds(new Set());
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_AI_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
      
      const res = await fetch(`${cleanBaseUrl}/api/admin/crawl-by-keyword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ keyword }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || "Gagal melakukan pencarian.");
      }
      
      setResult(data);
      toast(`Berhasil memproses pencarian. Disimpan dalam status pending.`, "success");
      setKeyword("");
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // ── Action helpers ──
  const updateStatus = async (id: string, status: string, label: string) => {
    try {
      if (isStagingId(id)) {
        if (status === "verified") {
          await approveStagingEntry(id, undefined, token);
        } else if (status === "suspicious" || status === "rejected") {
          await rejectStagingEntry(id, undefined, token);
        }
        // Update local state to reflect status
        if (result) {
          setResult((prev: any) => ({
            ...prev,
            items: prev.items.map((s: Scholarship) =>
              s.id === id ? { ...s, status: status as Scholarship["status"] } : s
            ),
          }));
        }
      } else {
        await updateScholarshipStatus(id, status, token);
        if (result) {
          setResult((prev: any) => ({
            ...prev,
            items: prev.items.map((s: Scholarship) =>
              s.id === id ? { ...s, status: status as Scholarship["status"] } : s
            ),
          }));
        }
      }

      toast(`Scholarship ${label} successfully.`, "success");

      if (modalScholarship?.id === id) {
        setModalScholarship((prev) =>
          prev ? { ...prev, status: status as Scholarship["status"] } : prev
        );
      }
    } catch (err: any) {
      toast(err.message || "Failed to update status.", "error");
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

    try {
      if (isStagingId(scholarshipToDelete.id)) {
        await deleteStagingEntry(scholarshipToDelete.id, token);
      } else {
        await deleteScholarship(scholarshipToDelete.id, token);
      }
      toast("Scholarship deleted successfully.", "success");

      if (result) {
        setResult((prev: any) => ({
          ...prev,
          items: prev.items.filter((s: Scholarship) => s.id !== scholarshipToDelete.id),
        }));
      }
    } catch (err: any) {
      toast(err.message || "Failed to delete scholarship.", "error");
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setScholarshipToDelete(null);
    }
  };

  const handleSave = async (id: string, updates: Partial<Scholarship>) => {
    setSavingModal(true);
    try {
      if (isStagingId(id)) {
        // Map flat Scholarship fields to CrawlResultUpdate fields
        const stagingUpdates: Record<string, any> = {};
        if (updates.title !== undefined) stagingUpdates.title = updates.title;
        if (updates.deadline !== undefined) stagingUpdates.deadline = updates.deadline;
        if (updates.description !== undefined) stagingUpdates.description = updates.description;
        if (updates.location !== undefined) stagingUpdates.location = updates.location;
        if (updates.provider !== undefined) stagingUpdates.provider_name = updates.provider;
        if (updates.amount !== undefined) stagingUpdates.amount = updates.amount;
        if (updates.admin_notes !== undefined) stagingUpdates.admin_notes = updates.admin_notes;
        await updateStagingEntry(id, stagingUpdates, token);
        setModalScholarship((prev) => (prev ? { ...prev, ...updates } : prev));
        if (result) {
          setResult((prev: any) => ({
            ...prev,
            items: prev.items.map((s: Scholarship) =>
              s.id === id ? { ...s, ...updates } : s
            ),
          }));
        }
      } else {
        const updated = await updateScholarship(id, updates, token);
        setModalScholarship(updated);
        if (result) {
          setResult((prev: any) => ({
            ...prev,
            items: prev.items.map((s: Scholarship) =>
              s.id === id ? { ...s, ...updates } : s
            ),
          }));
        }
      }
      toast("Scholarship updated successfully.", "success");
      setIsModalOpen(false);
    } catch (err: any) {
      toast(err.message || "Failed to save changes.", "error");
    } finally {
      setSavingModal(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (!result?.items) return;
    setSelectedIds(checked ? new Set(result.items.map((s: Scholarship) => s.id)) : new Set());
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

  return (
    <div>
      <AdminTopbar title="Crawl Data / Search Scholarship" subtitle="Search and crawl scholarship data using AI" />
      <div className="p-6 mx-auto space-y-6">
        
        {/* Search & Crawl Component */}
        <motion.div
           initial={{ opacity: 0, y: 16 }}
           animate={{ opacity: 1, y: 0 }}
           className="p-6 rounded-3xl border border-border bg-card shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-2xl">
              🤖
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">AI Auto-Discovery</h2>
              <p className="text-sm text-muted-foreground">Search and crawl scholarships directly from the internet using keywords.</p>
            </div>
          </div>
          
          <form onSubmit={handleCrawl} className="flex gap-3 max-w-2xl">
            <input
              type="text"
              placeholder="e.g. beasiswa S1 luar negeri 2026 fully funded"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              disabled={loading}
              className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground disabled:opacity-50"
            />
            <Button 
                type="submit" 
                size="lg" 
                disabled={loading || !keyword.trim()}
                className="whitespace-nowrap min-w-[160px] justify-center flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                "Search & Crawl 🔍"
              )}
            </Button>
          </form>

          {result && (
            <motion.div 
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: "auto" }}
               className="mt-6 pt-6 border-t border-border"
            >
              <div className="flex justify-between items-center mb-6">
                 <div>
                   <h3 className="font-bold text-lg text-foreground mb-1">Discovery Results</h3>
                   <p className="text-sm text-muted-foreground">
                      Found {result.total_found} URLs. All results are saved in pending status for review.
                   </p>
                 </div>
                 <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                   {result.status}
                 </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-muted p-4 rounded-xl border border-border">
                  <p className="text-xs uppercase text-muted-foreground font-bold mb-1">Found URLs</p>
                  <p className="text-3xl font-black text-foreground">{result.total_found}</p>
                </div>
                <div className="bg-muted p-4 rounded-xl border border-border">
                  <p className="text-xs uppercase text-emerald-500 font-bold mb-1">Inserted</p>
                  <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{result.inserted}</p>
                </div>
                <div className="bg-muted p-4 rounded-xl border border-border">
                  <p className="text-xs uppercase text-amber-500 font-bold mb-1">Dup/Invalid (Pending)</p>
                  <p className="text-3xl font-black text-amber-600 dark:text-amber-400">{result.skipped}</p>
                </div>
              </div>

              {result.items && result.items.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-foreground flex items-center gap-2">
                      <span className="text-primary">✨</span> New Scholarships Added
                    </p>
                  </div>
                  
                  <ScholarshipTable
                    scholarships={result.items}
                    loading={false}
                    selectedIds={selectedIds}
                    onSelectAll={handleSelectAll}
                    onSelectOne={handleSelectOne}
                    onView={handleView}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onMarkPending={handlePending}
                    onDelete={openDeleteModal}
                  />
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

          {/* Crawl History Section */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-foreground mb-4">Crawl History</h2>
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Keyword</th>
                    <th className="px-6 py-4 font-semibold">Total Results</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {MOCK_CRAWL_HISTORY.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{item.keyword}</td>
                      <td className="px-6 py-4">{item.total}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.status === 'completed' 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(item.timestamp).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
      </div>

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
      {deleteModalOpen && scholarshipToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
      
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
