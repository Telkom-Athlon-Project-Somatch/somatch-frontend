"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "🏠", exact: true },
  { href: "/admin/crawl", label: "Crawl Data", icon: "🔍", badge: "new" },
  { href: "/admin/verification", label: "Scholarship Management", icon: "✅" },
  { href: "/admin/users", label: "User Management", icon: "👥" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 flex flex-col border-r border-border bg-background transition-colors">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
          <span className="text-sm font-black text-primary-foreground">S</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold font-heading text-foreground leading-none">Somatch</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Admin Console</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <div className="mb-3">
          <p className="px-3 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            Navigation
          </p>
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative text-base">{item.icon}</span>
              <span className="relative flex-1">{item.label}</span>
              {item.badge && (
                <span className="relative text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/20 font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom info */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-xs font-bold text-white">A</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">Admin User</p>
            <p className="text-[10px] text-muted-foreground truncate">admin@somatch.id</p>
          </div>
          <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
        </div>
      </div>
    </aside>
  );
}
