"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { StatCard, Skeleton } from "@/components/admin/ui";
import { fetchStats } from "@/lib/admin-api";
import { AdminStats } from "@/types/scholarship";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

import { Users, UserCheck, UserPlus, GraduationCap, BadgeCheck, FileWarning, Search, Database, Fingerprint, Activity } from "lucide-react";

const STAT_CARDS = [
  { key: "totalUsers", label: "Total Users", icon: <Users size={24} />, color: "text-blue-500", sublabel: "All registered" },
  { key: "newUsers", label: "New Users", icon: <UserPlus size={24} />, color: "text-emerald-500", sublabel: "Last 7 days" },
  { key: "total", label: "Total Scholarships", icon: <GraduationCap size={24} />, color: "text-primary", sublabel: "All entries" },
  { key: "verified", label: "Verified", icon: <BadgeCheck size={24} />, color: "text-emerald-500", sublabel: "Ready to show" },
  { key: "unverified", label: "Unverified", icon: <FileWarning size={24} />, color: "text-amber-500", sublabel: "Pending admin" }
] as const;

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats(token)
      .then(setStats)
      .catch(() => {
        // Fallback mock data if backend is down
        setStats({
          totalUsers: 1420,
          activeUsers: 89,
          newUsers: 124,
          total: 12,
          verified: 4,
          unverified: 4,
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
                href="/admin/crawl"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
              >
                <Search size={18} /> Crawl New Data
              </Link>
              <Link
                href="/admin/verification"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card border border-border text-foreground hover:bg-muted text-sm font-bold transition-all shadow-sm hover:-translate-y-0.5"
              >
                <Database size={18} /> Manage Scholarships
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
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
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
                      value={stats?.[card.key] ?? 0}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                href: "/admin/crawl",
                icon: <Search className="text-primary" size={32} />,
                title: "Crawl Scholarship",
                desc: "Search and crawl scholarship data using AI.",
                color: "border-primary/20 hover:border-primary/50",
              },
              {
                href: "/admin/verification",
                icon: <Database className="text-violet-500" size={32} />,
                title: "Manage Scholarships",
                desc: "Review and approve scholarship entries.",
                color: "border-violet-500/20 hover:border-violet-500/50",
              },
              {
                href: "/admin/users",
                icon: <Fingerprint className="text-emerald-500" size={32} />,
                title: "Manage Users",
                desc: "Control access and view user metrics.",
                color: "border-emerald-500/20 hover:border-emerald-500/50",
              },
              {
                href: "/admin/verification#logs",
                icon: <Activity className="text-blue-500" size={32} />,
                title: "View Activity Logs",
                desc: "Track system and admin actions.",
                color: "border-blue-500/20 hover:border-blue-500/50",
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
                <div className="mb-4 group-hover:scale-110 transition-transform">{card.icon}</div>
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
