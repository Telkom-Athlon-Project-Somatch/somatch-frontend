"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scholarship, ScholarshipStatus } from "@/types/scholarship";
import { StatusBadge, TrustScoreBadge, Button } from "./ui";
import { cn } from "@/lib/utils";

interface DetailModalProps {
  scholarship: Scholarship | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onMarkPending: (id: string) => void;
  onSave: (id: string, updates: Partial<Scholarship>) => void;
  saving?: boolean;
}

export default function DetailModal({
  scholarship,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onMarkPending,
  onSave,
  saving = false,
}: DetailModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!scholarship) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleSaveLocal = () => {
    const titleEl = document.getElementById("edit-title") as HTMLInputElement;
    const providerEl = document.getElementById("edit-provider") as HTMLInputElement;
    const deadlineEl = document.getElementById("edit-deadline") as HTMLInputElement;
    const amountEl = document.getElementById("edit-amount") as HTMLInputElement;
    const descEl = document.getElementById("edit-desc") as HTMLTextAreaElement;
    const notesEl = document.getElementById("edit-notes") as HTMLTextAreaElement;

    onSave(scholarship.id, {
      title: titleEl?.value || scholarship.title,
      provider: providerEl?.value || scholarship.provider,
      deadline: deadlineEl?.value || scholarship.deadline,
      amount: amountEl?.value || scholarship.amount,
      description: descEl?.value || scholarship.description,
      admin_notes: notesEl?.value || scholarship.admin_notes,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-start justify-between gap-4 p-6 border-b border-border bg-card/80 backdrop-blur-md">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">
                    Scholarship Detail
                  </p>
                  <h2 className="text-xl font-bold font-heading text-foreground leading-tight line-clamp-2">
                    {scholarship.title}
                  </h2>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={scholarship.status} />
                  <button
                    onClick={onClose}
                    className="w-10 h-10 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-8">
                {/* AI Trust Score + Summary */}
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-primary">🧠 AI Analysis</span>
                      <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/30 font-bold tracking-wider">
                        AUTO-GENERATED
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground font-semibold">Trust Score</span>
                      <TrustScoreBadge score={scholarship.trust_score} />
                    </div>
                  </div>
                  {scholarship.ai_summary && (
                    <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                      {scholarship.ai_summary}
                    </p>
                  )}
                </div>

                {/* Editable Fields */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest border-l-4 border-primary pl-3">
                    Edit Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Title" id="edit-title" defaultValue={scholarship.title} />
                    <Field label="Provider" id="edit-provider" defaultValue={scholarship.provider} />
                    <Field label="Deadline" id="edit-deadline" type="date" defaultValue={scholarship.deadline} />
                    <Field label="Amount / Benefit" id="edit-amount" defaultValue={scholarship.amount || ""} />
                  </div>
                  <TextareaField label="Description" id="edit-desc" defaultValue={scholarship.description} rows={5} />
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <InfoCell label="Education Level" value={scholarship.education_level || "—"} />
                  <InfoCell label="Location" value={scholarship.location || "—"} />
                  <InfoCell
                    label="Source URL"
                    value={
                      <a
                        href={scholarship.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors truncate block font-bold"
                      >
                        {scholarship.source_url.replace(/^https?:\/\//, "").slice(0, 30)}…
                      </a>
                    }
                  />
                </div>

                {/* Requirements */}
                {scholarship.requirements && scholarship.requirements.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Requirements</p>
                    <div className="flex flex-wrap gap-2">
                      {scholarship.requirements.map((req, i) => (
                        <span
                          key={i}
                          className="text-xs px-3 py-1.5 rounded-xl bg-muted text-foreground font-semibold border border-border transition-colors hover:border-primary/30"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Notes */}
                <TextareaField
                  label="Admin Notes (Internal)"
                  id="edit-notes"
                  defaultValue={scholarship.admin_notes || ""}
                  rows={3}
                  placeholder="Only visible to admins..."
                />

                {/* Timestamps */}
                <div className="flex gap-4 text-xs text-muted-foreground font-medium pt-4 border-t border-border">
                  <span>Created: {new Date(scholarship.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span className="opacity-30">•</span>
                  <span>Updated: {new Date(scholarship.updated_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-4 p-5 border-t border-border bg-card/80 backdrop-blur-md">
                <div className="flex gap-2">
                  <Button
                    variant="success"
                    size="md"
                    onClick={() => onApprove(scholarship.id)}
                    disabled={scholarship.status === "verified"}
                  >
                    ✅ Approve
                  </Button>
                  <Button
                    variant="danger"
                    size="md"
                    onClick={() => onReject(scholarship.id)}
                    disabled={scholarship.status === "suspicious"}
                  >
                    ❌ Reject
                  </Button>
                  <Button
                    variant="warning"
                    size="md"
                    onClick={() => onMarkPending(scholarship.id)}
                    disabled={scholarship.status === "pending"}
                  >
                    ⏳ Pending
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="md" onClick={onClose} className="font-bold">
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleSaveLocal}
                    disabled={saving}
                    className="font-bold"
                  >
                    {saving ? "Saving..." : "💾 Save Changes"}
                  </Button>
                </div>
              </div>
            </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Helper sub-components ──

function Field({
  label,
  id,
  defaultValue,
  type = "text",
}: {
  label: string;
  id: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-bold text-muted-foreground uppercase tracking-tight pl-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        defaultValue={defaultValue}
        className={cn(
          "w-full px-4 py-2.5 rounded-xl text-sm text-foreground bg-background border border-border transition-all",
          "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm"
        )}
      />
    </div>
  );
}

function TextareaField({
  label,
  id,
  defaultValue,
  rows = 3,
  placeholder = "",
}: {
  label: string;
  id: string;
  defaultValue: string;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-bold text-muted-foreground uppercase tracking-tight pl-1">
        {label}
      </label>
      <textarea
        id={id}
        defaultValue={defaultValue}
        rows={rows}
        placeholder={placeholder}
        className={cn(
          "w-full px-4 py-3 rounded-xl text-sm text-foreground bg-background border border-border transition-all",
          "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
          "transition-all resize-none shadow-sm"
        )}
      />
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-muted/30 border border-border p-4 hover:border-primary/20 transition-colors">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
      <div className="text-sm text-foreground font-bold">{value}</div>
    </div>
  );
}
