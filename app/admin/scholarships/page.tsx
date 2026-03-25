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
import { updateScholarshipStatus, updateScholarship } from "@/lib/admin-api";

export default function ScholarshipsPage() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toasts, toast, dismiss } = useToast();

  // For ScholarshipTable
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [modalScholarship, setModalScholarship] = useState<Scholarship | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savingModal, setSavingModal] = useState(false);

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
      await updateScholarshipStatus(id, status);
      toast(`Scholarship ${label} successfully.`, "success");
      
      if (result) {
        setResult((prev: any) => ({
          ...prev,
          items: prev.items.map((s: Scholarship) =>
            s.id === id ? { ...s, status: status as Scholarship["status"] } : s
          ),
        }));
      }

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

  const handleSave = async (id: string, updates: Partial<Scholarship>) => {
    setSavingModal(true);
    try {
      const updated = await updateScholarship(id, updates);
      setModalScholarship(updated);
      toast("Scholarship updated successfully.", "success");
      
      if (result) {
        setResult((prev: any) => ({
          ...prev,
          items: prev.items.map((s: Scholarship) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        }));
      }

      setIsModalOpen(false);
    } catch {
      toast("Failed to save changes.", "error");
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
      <AdminTopbar title="Scholarships" subtitle="Browse and manage all scholarship entries" />
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
                  />
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

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
      
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
