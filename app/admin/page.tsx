"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { StatCard, Skeleton } from "@/components/admin/ui";
import { fetchStats } from "@/lib/admin-api";
import { AdminStats } from "@/types/scholarship";
import Link from "next/link";
import { cn } from "@/lib/utils";

const STAT_CARDS = [
  { key: "total", label: "Total Scholarships", icon: "🎓", color: "text-primary", sublabel: "All entries" },
  { key: "verified", label: "Verified", icon: "✅", color: "text-emerald-500", sublabel: "Ready to show" },
  { key: "pending", label: "Pending Review", icon: "⏳", color: "text-amber-500", sublabel: "Awaiting admin" },
  { key: "suspicious", label: "Suspicious", icon: "⚠️", color: "text-rose-500", sublabel: "Flagged by AI" },
  { key: "unverified", label: "Unverified", icon: "🔍", color: "text-slate-500", sublabel: "Newly crawled" },
  {
    key: "avg_trust_score",
    label: "Avg Trust Score",
    icon: "🧠",
    color: "text-violet-500",
    sublabel: "AI confidence",
  },
] as const;

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch(() => {
        // Fallback mock data if backend is down
        setStats({
          total: 12,
          verified: 4,
          pending: 3,
          suspicious: 1,
          unverified: 4,
          avg_trust_score: 74.6,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <AdminTopbar
        title="Dashboard"
        subtitle="Somatch AI — Scholarship Management System"
      />

      <div className="p-6 space-y-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-3xl border border-primary/20 bg-primary/5 p-8 shadow-xl shadow-primary/5 group"
        >
          <div className="absolute -right-8 -top-8 w-64 h-64 rounded-full bg-primary/10 blur-3xl transition-transform group-hover:scale-125 duration-1000" />
          <div className="relative">
            <div className="flex items-start gap-4">
              <div className="text-5xl drop-shadow-lg">👋</div>
              <div>
                <h2 className="text-2xl font-black font-heading text-foreground mb-2 tracking-tight">
                  Welcome back, Admin!
                </h2>
                <p className="text-base text-muted-foreground max-w-2xl leading-relaxed font-medium">
                  Somatch AI has crawled new scholarship data overnight. The current trust level across 
                  the system is healthy, but <span className="text-primary font-bold">{stats?.unverified || 0} entries</span> need your manual certification to go live.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href="/admin/verification"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
              >
                🔍 Go to Verification Queue
              </Link>
              <Link
                href="/admin/scholarships"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card border border-border text-foreground hover:bg-muted text-sm font-bold transition-all shadow-sm hover:-translate-y-0.5"
              >
                📋 View All Scholarships
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div>
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-8 h-px bg-border" />
            System Overview
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card p-5">
                    <Skeleton className="h-3 w-20 mb-3" />
                    <Skeleton className="h-8 w-12" />
                  </div>
                ))
              : STAT_CARDS.map((card, i) => (
                  <motion.div
                    key={card.key}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <StatCard
                      label={card.label}
                      value={
                        card.key === "avg_trust_score"
                          ? `${stats?.[card.key] ?? 0}`
                          : stats?.[card.key] ?? 0
                      }
                      icon={card.icon}
                      color={card.color}
                      sublabel={card.sublabel}
                    />
                  </motion.div>
                ))}
          </div>
        </div>

        {/* Quick Action Cards */}
        <div>
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-8 h-px bg-border" />
            Quick Access
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                href: "/admin/verification",
                icon: "✨",
                title: "Verification Queue",
                desc: "Review AI-crawled scholarships pending your final seal of approval.",
                color: "border-primary/20 hover:border-primary/50",
              },
              {
                href: "/admin/scholarships",
                icon: "📚",
                title: "Master Database",
                desc: "Full administrative control over all scholarships in the system.",
                color: "border-violet-500/20 hover:border-violet-500/50",
              },
              {
                href: "/admin/reports",
                icon: "📈",
                title: "System Insights",
                desc: "Monitor system health, AI accuracy, and trend distribution.",
                color: "border-emerald-500/20 hover:border-emerald-500/50",
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className={cn(
                  "group relative overflow-hidden rounded-3xl border bg-card p-6 transition-all duration-300",
                  "hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1",
                  card.color
                )}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{card.icon}</div>
                <h3 className="text-lg font-black text-foreground mb-2 font-heading tracking-tight">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">{card.desc}</p>
                <div className="mt-4 flex items-center text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  EXPLORE NOW →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
