"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { ScholarshipStatus } from "@/types/scholarship";

type ExtendedScholarshipStatus = ScholarshipStatus | "approved" | "rejected";

// ─────────────────────────────────────────────
// StatusBadge
// ─────────────────────────────────────────────
const STATUS_CONFIG: Record<ExtendedScholarshipStatus, { label: string; className: string }> = {
  verified: {
    label: "Verified",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
  },
  unverified: {
    label: "Unverified",
    className: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20",
  },
  suspicious: {
    label: "Suspicious",
    className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
  },
  approved: {
    label: "Approved",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
  },
  rejected: {
    label: "Rejected",
    className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
  },
};

export function StatusBadge({ status }: { status: ExtendedScholarshipStatus }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        config.className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {config.label}
    </span>
  );
}

// ─────────────────────────────────────────────
// TrustScoreBadge
// ─────────────────────────────────────────────
function getTrustConfig(score: number) {
  if (score >= 71)
    return {
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500",
      track: "bg-emerald-500/15",
      label: "High",
    };
  if (score >= 41)
    return {
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500",
      track: "bg-amber-500/15",
      label: "Medium",
    };
  return {
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500",
    track: "bg-rose-500/15",
    label: "Low",
  };
}

export function TrustScoreBadge({ score }: { score: number }) {
  const config = getTrustConfig(score);
  return (
    <div className="flex items-center gap-2 min-w-[110px]">
      <div className={cn("w-16 h-1.5 rounded-full", config.track)}>
        <div
          className={cn("h-full rounded-full transition-all", config.bg)}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={cn("text-xs font-semibold tabular-nums", config.color)}>
        {score}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-foreground/5 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-foreground/5 before:to-transparent before:animate-shimmer",
        className
      )}
    />
  );
}

// ─────────────────────────────────────────────
// Toast
// ─────────────────────────────────────────────
export type ToastVariant = "success" | "error" | "info";

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  onClose?: () => void;
}

const TOAST_STYLES: Record<ToastVariant, string> = {
  success: "border-emerald-500/20 bg-emerald-50/90 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200",
  error: "border-rose-500/20 bg-rose-50/90 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200",
  info: "border-primary/20 bg-primary/5 dark:bg-primary/10 text-primary-foreground dark:text-primary",
};

const TOAST_ICONS: Record<ToastVariant, string> = {
  success: "✅",
  error: "❌",
  info: "ℹ️",
};

export function Toast({ message, variant = "success", onClose }: ToastProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm text-sm font-medium shadow-2xl",
        TOAST_STYLES[variant]
      )}
    >
      <span>{TOAST_ICONS[variant]}</span>
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
          ×
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// StatCard
// ─────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color?: string;
  sublabel?: string;
}

export function StatCard({ label, value, icon, color = "text-blue-400", sublabel }: StatCardProps) {
  return (
    <div className="group relative rounded-2xl border border-border bg-card shadow-sm hover:border-primary/30 transition-all duration-300">
      <div className="flex items-start justify-between p-5">
        <div>
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">{label}</p>
          <p className={cn("text-3xl font-bold font-heading", color)}>{value}</p>
          {sublabel && <p className="text-xs text-muted-foreground mt-1">{sublabel}</p>}
        </div>
        <div className={cn("text-2xl p-2 rounded-xl bg-primary/5 group-hover:scale-110 transition-transform", color)}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Button
// ─────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger" | "warning" | "success" | "outline";
  size?: "sm" | "md" | "lg";
}

const BUTTON_VARIANTS: Record<string, string> = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/10",
  ghost: "text-muted-foreground hover:text-foreground hover:bg-accent",
  danger: "bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20",
  warning: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20",
  success: "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
  outline: "border border-border text-muted-foreground hover:bg-accent hover:text-foreground",
};

const BUTTON_SIZES: Record<string, string> = {
  sm: "px-2.5 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none",
          BUTTON_VARIANTS[variant],
          BUTTON_SIZES[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
