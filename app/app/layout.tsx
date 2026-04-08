"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AppSidebar } from "@/components/app/AppSidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white relative">
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-600 font-medium z-10">Authenticating...</span>
        </div>
      </div>
    );
  }

  // Final fallback if user is somehow not found after redirect logic
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-white text-slate-900 relative">
      {/* Persistent Sidebar (includes mobile top bar + drawer) */}
      <AppSidebar />

      {/* Main Content Area */}
      {/* lg: offset by sidebar width | mobile: add top padding for top bar */}
      <main className="flex-1 lg:pl-64 pt-14 lg:pt-0 min-h-screen relative overflow-hidden">
        {/* Soft decorative glow background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
