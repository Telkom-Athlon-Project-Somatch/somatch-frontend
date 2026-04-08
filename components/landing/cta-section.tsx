"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { useAuth } from "@/context/AuthContext";

export function CtaSection() {
    const { user } = useAuth();

    return (
        <section className="py-32 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="flex flex-col items-center text-center gap-6"
                >
                    <p className="text-sm font-semibold text-indigo-400 uppercase tracking-widest">
                        {user ? "Akses Sekarang" : "Mulai Sekarang — Gratis"}
                    </p>
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white max-w-2xl leading-tight">
                        {user 
                            ? "Siap Menemukan Beasiswa yang Cocok untukmu?" 
                            : "Dapatkan Rekomendasi Beasiswa dalam Hitungan Detik"}
                    </h2>
                    <p className="text-slate-300/80 text-lg max-w-xl leading-relaxed font-light mt-2">
                        {user 
                            ? "Lanjutkan percakapan dengan AI dan temukan beasiswa yang paling relevan dengan profil akademikmu."
                            : "Buat akun sekarang dan mulai gunakan asisten AI kami untuk mencocokkan profilmu dengan ribuan peluang beasiswa."}
                    </p>
                    <Link
                        href={user ? "/chat" : "/register"}
                        className={cn(
                            buttonVariants({ size: "lg" }),
                            "group relative overflow-hidden bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white mt-4 gap-2 border-0 shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 hover:-translate-y-0.5 rounded-full px-10 h-14"
                        )}
                    >
                        <span className="relative z-10 flex items-center gap-2 text-base font-semibold">
                            {user ? "Mulai Chat dengan AI" : "Daftar & Cari Beasiswa"}
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </span>
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
