"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface AdminTopbarProps {
  title: string;
  subtitle?: string;
}

export default function AdminTopbar({ title, subtitle }: AdminTopbarProps) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock newly added scholarships via AI
  const notifications = [
    { id: 1, title: "Beasiswa Data Science Jabar", time: "10 mins ago" },
    { id: 2, title: "Beasiswa Telkom University", time: "1 hour ago" },
    { id: 3, title: "Beasiswa BCA Finance", time: "2 hours ago" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("somatch_admin_auth");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b border-border bg-background/80 backdrop-blur-xl transition-colors">
      {/* Left */}
      <div>
        <h1 className="text-base font-bold font-heading text-foreground leading-none">{title}</h1>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <span className="text-base">🔔</span>
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 border-2 border-background" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-80 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden z-50 text-card-foreground"
                >
                  <div className="px-4 py-3 border-b border-border bg-muted/50">
                    <h3 className="text-sm font-semibold">Notifikasi AI Crawling</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Beasiswa baru ditambahkan ke sistem</p>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="px-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className="text-xl">🤖</div>
                          <div>
                            <p className="text-sm font-medium">{n.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-border">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        router.push("/admin/verification");
                      }}
                      className="w-full py-1.5 text-xs font-semibold text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 rounded-lg transition-colors"
                    >
                      Lihat Semua di Antrean
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('somatch_theme', isDark ? 'dark' : 'light');
          }}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all border border-border/50 shadow-sm"
          title="Toggle Light/Dark Mode"
        >
          <span className="text-base dark:hidden">🌙</span>
          <span className="text-base hidden dark:block">☀️</span>
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-border mx-1" />

        {/* Admin Avatar & Logout */}
        <div className="flex items-center gap-3 group relative">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/20 cursor-pointer">
            <span className="text-sm font-bold text-white">A</span>
          </div>
          <div className="hidden sm:block cursor-pointer">
            <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
              AdminSomatch
            </p>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-tight">Super Admin</p>
          </div>

          {/* Persistent Dropdown on Hover */}
          <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <div className="w-48 bg-card border border-border shadow-2xl rounded-2xl p-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-3 py-2 border-b border-border/50 mb-1">
                <p className="text-xs font-bold text-foreground">Scholarship Matching</p>
                <p className="text-[10px] text-muted-foreground">Admin Console v1.0</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-destructive hover:bg-destructive/10 transition-colors"
              >
                <span className="text-base">🚪</span>
                Log Out System
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
