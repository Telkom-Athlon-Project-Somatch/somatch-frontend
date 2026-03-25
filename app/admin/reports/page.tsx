"use client";

import AdminTopbar from "@/components/admin/AdminTopbar";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const STATUS_DATA = [
  { label: "Verified", count: 4, pct: 33, color: "bg-emerald-500", textColor: "text-emerald-400" },
  { label: "Pending", count: 3, pct: 25, color: "bg-amber-500", textColor: "text-amber-400" },
  { label: "Unverified", count: 4, pct: 33, color: "bg-zinc-500", textColor: "text-zinc-400" },
  { label: "Suspicious", count: 1, pct: 9, color: "bg-rose-500", textColor: "text-rose-400" },
];

const TRUST_RANGES = [
  { label: "High Trust (71–100)", count: 7, pct: 58, color: "bg-emerald-500" },
  { label: "Medium Trust (41–70)", count: 3, pct: 25, color: "bg-amber-500" },
  { label: "Low Trust (0–40)", count: 2, pct: 17, color: "bg-rose-500" },
];

export default function ReportsPage() {
  return (
    <div>
      <AdminTopbar title="Reports" subtitle="Analytics and trust score distribution" />
      <div className="p-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Status Distribution */}
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-black font-heading text-foreground tracking-tight">Status Distribution</h2>
            <div className="space-y-5">
              {STATUS_DATA.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className={cn(item.textColor, "font-bold uppercase tracking-widest text-[10px]")}>{item.label}</span>
                    <span className="text-muted-foreground font-bold">{item.count} items <span className="text-foreground/20 mx-1">|</span> {item.pct}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ delay: i * 0.1 + 0.2, duration: 0.8, ease: "easeOut" }}
                      className={cn("h-full rounded-full shadow-sm", item.color)}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Trust Score Distribution */}
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-black font-heading text-foreground tracking-tight">Trust Score Distribution</h2>
            <div className="space-y-5">
              {TRUST_RANGES.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-bold text-xs">{item.label}</span>
                    <span className="text-muted-foreground font-bold">{item.pct}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ delay: i * 0.1 + 0.2, duration: 0.8, ease: "easeOut" }}
                      className={cn("h-full rounded-full shadow-sm", item.color)}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="pt-4 border-t border-border mt-6">
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                Median Quality Index: <span className="text-violet-600 dark:text-violet-400 font-black text-sm ml-2">74.6%</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Activity Summary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl border border-border bg-card p-8 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black font-heading text-foreground tracking-tight">Recent System Activity</h2>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">LIVE UPDATES</span>
          </div>
          <div className="space-y-0.5">
            {[
              { time: "2 min ago", action: "Scholarship 'LPDP Reguler 2025' approved", icon: "✅" },
              { time: "15 min ago", action: "Scholarship 'Startup Akademi' flagged as suspicious", icon: "⚠️" },
              { time: "1 hour ago", action: "3 scholarships marked as pending review", icon: "⏳" },
              { time: "3 hours ago", action: "AI crawled 5 new scholarship entries", icon: "🤖" },
              { time: "Yesterday", action: "Djarum Plus 2025 verified and published", icon: "✅" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 text-sm py-4 border-b border-border last:border-0 group hover:bg-muted/30 transition-colors px-2 -mx-2 rounded-xl">
                <span className="text-xl shrink-0 grayscale group-hover:grayscale-0 transition-all">{item.icon}</span>
                <span className="flex-1 text-foreground/80 font-medium group-hover:text-foreground transition-colors">{item.action}</span>
                <span className="text-xs text-muted-foreground font-bold shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
