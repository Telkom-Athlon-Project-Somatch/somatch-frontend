"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem("somatch_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
      if (pathname === "/admin/login") {
        router.push("/admin/verification");
      }
    } else {
      setIsAuthenticated(false);
      if (pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    }
  }, [pathname, router]);

  // Don't render until we know auth state
  if (isAuthenticated === null) return null;

  if (pathname === "/admin/login") {
    return <main className="min-h-screen bg-[oklch(0.98_0_0)] dark:bg-[oklch(0.08_0.03_260)]">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-[oklch(0.98_0_0)] dark:bg-[oklch(0.08_0.03_260)]">
      <AdminSidebar />
      <div className="pl-64 min-h-screen transition-all">
        {children}
      </div>
    </div>
  );
}
