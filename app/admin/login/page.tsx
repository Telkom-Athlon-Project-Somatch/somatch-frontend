"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "AdminSomatch" && password === "ScholarshipMatching") {
      localStorage.setItem("somatch_admin_auth", "true");
      router.push("/admin");
    } else {
      setError("Username atau password salah");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-3xl bg-card border border-border shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 mb-6 rotate-3">
            <span className="text-3xl font-black text-primary-foreground -rotate-3">S</span>
          </div>
          <h1 className="text-3xl font-black font-heading text-foreground tracking-tight">Somatch Admin</h1>
          <p className="text-sm font-medium text-muted-foreground mt-2 text-center max-w-[240px]">
            Welcome back. Please authenticate to access the scholarship console.
          </p>
        </div>

        {error && (
          <div className="p-3 mb-6 text-sm text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={cn(
                "w-full px-4 py-2.5 rounded-xl text-sm bg-background border border-border text-foreground",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-medium"
              )}
              placeholder="AdminSomatch"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "w-full px-4 py-2.5 rounded-xl text-sm bg-background border border-border text-foreground",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-medium"
              )}
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" variant="primary" className="w-full py-3 justify-center mt-4 text-sm font-bold shadow-2xl shadow-primary/30">
            Authenticate Dashboard
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
