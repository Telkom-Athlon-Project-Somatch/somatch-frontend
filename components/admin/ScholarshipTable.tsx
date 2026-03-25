"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Scholarship } from "@/types/scholarship";
import { StatusBadge, TrustScoreBadge, Button, Skeleton } from "./ui";
import { cn } from "@/lib/utils";

interface ScholarshipTableProps {
  scholarships: Scholarship[];
  loading: boolean;
  selectedIds: Set<string>;
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string, checked: boolean) => void;
  onView: (scholarship: Scholarship) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onMarkPending: (id: string) => void;
  onDelete: (id: string, title: string) => void;
}

export default function ScholarshipTable({
  scholarships,
  loading,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onView,
  onApprove,
  onReject,
  onMarkPending,
  onDelete,
}: ScholarshipTableProps) {
  const allSelected =
    scholarships.length > 0 && scholarships.every((s) => selectedIds.has(s.id));

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/8 overflow-hidden">
        <div className="p-4 border-b border-white/8">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="divide-y divide-white/5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 grid grid-cols-6 gap-4 items-center">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 col-span-2" />
              <Skeleton className="h-4" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (scholarships.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="rounded-2xl border border-border overflow-hidden bg-card shadow-sm">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left p-4 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded border-border bg-background accent-primary"
                />
              </th>
              <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Title
              </th>
              <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                Provider
              </th>
              <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                Deadline
              </th>
              <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Trust Score
              </th>
              <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="text-right p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <AnimatePresence>
              {scholarships.map((s, i) => (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                  className={cn(
                    "group hover:bg-muted/30 transition-colors duration-150",
                    selectedIds.has(s.id) && "bg-primary/5"
                  )}
                >
                  {/* Checkbox */}
                  <td className="p-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(s.id)}
                      onChange={(e) => onSelectOne(s.id, e.target.checked)}
                      className="w-4 h-4 rounded border-border bg-background accent-primary"
                    />
                  </td>

                  {/* Title */}
                  <td className="p-4 max-w-[220px]">
                    <p className="font-semibold text-foreground truncate leading-snug">
                      {s.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 md:hidden">{s.provider}</p>
                  </td>

                  {/* Provider */}
                  <td className="p-4 hidden md:table-cell">
                    <p className="text-muted-foreground text-sm truncate max-w-[160px]">{s.provider}</p>
                  </td>

                  {/* Deadline */}
                  <td className="p-4 hidden lg:table-cell">
                    <p className="text-muted-foreground text-sm">{formatDate(s.deadline)}</p>
                  </td>

                  {/* Trust Score */}
                  <td className="p-4">
                    <TrustScoreBadge score={s.trust_score} />
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <StatusBadge status={s.status} />
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="View Detail"
                        onClick={() => onView(s)}
                      >
                        👁️
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        title="Approve"
                        onClick={() => onApprove(s.id)}
                        disabled={s.status === "verified"}
                      >
                        ✅
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        title="Reject"
                        onClick={() => onReject(s.id)}
                        disabled={s.status === "suspicious"}
                      >
                        ❌
                      </Button>
                      <Button
                        variant="warning"
                        size="sm"
                        title="Mark Pending"
                        onClick={() => onMarkPending(s.id)}
                        disabled={s.status === "pending"}
                      >
                        ⏳
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        title="Delete"
                        onClick={() => onDelete(s.id, s.title)}
                        className="opacity-70 hover:opacity-100"
                      >
                        🗑️
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Empty State ──
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 rounded-2xl border border-border bg-card shadow-sm text-center"
    >
      <div className="text-6xl mb-4 opacity-20">🎓</div>
      <h3 className="text-lg font-bold text-foreground mb-2">No Scholarships Found</h3>
      <p className="text-sm text-muted-foreground max-w-xs px-4">
        No scholarships match your current filters. Try adjusting your search or filter criteria.
      </p>
    </motion.div>
  );
}

// ── Helpers ──
function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
