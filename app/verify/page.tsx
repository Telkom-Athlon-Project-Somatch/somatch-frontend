"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:8000";

function VerifyOTPContent() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const email = searchParams.get("email");
  const name = searchParams.get("name") || "";

  useEffect(() => {
    if (!email) {
      router.push("/register");
    }
  }, [email, router]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp_code: otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Verifikasi gagal");
      }

      login(data.access_token, data.user || { email: email!, name: name });
      router.push("/app/explore");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resending || countdown > 0) return;
    setResending(true);
    setResendMsg("");
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Gagal mengirim ulang OTP");
      }

      setResendMsg("OTP baru telah dikirim ke email Anda.");
      setCountdown(60);
      setOtp("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="font-bold text-2xl tracking-tight text-white">
            So<span className="text-indigo-500">match</span>
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            <h1 className="text-2xl font-black text-white mb-1.5 tracking-tight">Verifikasi Email</h1>
            <p className="text-slate-500 text-sm">
              Kami telah mengirimkan 6 digit kode OTP ke
            </p>
            <p className="font-bold text-slate-200 text-sm mt-1">{email}</p>
            <p className="text-xs text-slate-600 mt-2">Kode berlaku selama 5 menit</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            {resendMsg && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm font-medium">
                {resendMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Masukkan Kode OTP</label>
              <input
                type="text"
                required
                maxLength={6}
                className="w-full text-center text-3xl tracking-[1rem] py-3 rounded-xl border border-slate-700 bg-slate-950 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none font-mono placeholder:tracking-normal placeholder:text-slate-600"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Memverifikasi..." : "Konfirmasi Kode"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              Tidak menerima email?{" "}
              {countdown > 0 ? (
                <span className="text-slate-600 font-medium">
                  Kirim ulang dalam {countdown}s
                </span>
              ) : (
                <button
                  className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors disabled:opacity-50"
                  onClick={handleResend}
                  disabled={resending}
                >
                  {resending ? "Mengirim..." : "Kirim Ulang"}
                </button>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900"><div className="text-slate-400">Loading...</div></div>}>
      <VerifyOTPContent />
    </Suspense>
  );
}
