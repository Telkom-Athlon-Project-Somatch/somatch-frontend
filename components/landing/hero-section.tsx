"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Sparkles, ArrowRight, Bot, User } from "lucide-react";
import Image from "next/image";
import { HeroChatDemo } from "./hero-chat-demo";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const heroFeatures = [
    "Rekomendasi beasiswa terpersonalisasi",
    "Informasi beasiswa yang terstruktur",
    "Pengingat deadline otomatis",
];

export function HeroSection() {
    return (
        <section
            id="home"
            className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden flex items-center justify-center min-h-[90vh]"
        >
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center max-w-7xl mx-auto px-6 relative z-10 w-full">
                {/* Left: Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col gap-8"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium w-fit">
                        <Image src="/favicon.png" alt="Somatch Logo" width={16} height={16} className="rounded-full" />
                        <span>AI-Powered Scholarship Assistant</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-100 leading-[1.1]">
                        Temukan <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">Beasiswa</span> yang Tepat untukmu dengan Bantuan <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-cyan-400 to-indigo-400">AI</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-xl">
                        Sistem AI cerdas yang memahami profil akademikmu dan secara otomatis merekomendasikan peluang beasiswa yang paling relevan.
                    </p>

                    {/* Feature bullets */}
                    <ul className="flex flex-col gap-4">
                        {heroFeatures.map((feature, i) => (
                            <motion.li
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                                key={feature}
                                className="flex items-center gap-3 text-base text-slate-300 font-medium"
                            >
                                <div className="p-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                                    <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                                </div>
                                {feature}
                            </motion.li>
                        ))}
                    </ul>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link
                            href="/chat"
                            className={cn(
                                buttonVariants({ size: "lg" }),
                                "group relative overflow-hidden bg-linear-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white border-0 shadow-[0_0_30px_-5px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_-5px_rgba(99,102,241,0.6)] transition-all duration-300 rounded-full px-8 h-14 text-base font-semibold"
                            )}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Mulai Cari Beasiswa
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </span>
                            {/* Subtle overlay effect on hover */}
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>

                        <button
                            className={cn(
                                buttonVariants({ variant: "outline", size: "lg" }),
                                "rounded-full px-8 h-14 text-base font-medium border-slate-700/50 bg-slate-800/50 backdrop-blur-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-300 hover:border-slate-600"
                            )}
                            onClick={() => {
                                document
                                    .getElementById("how-it-works")
                                    ?.scrollIntoView({ behavior: "smooth" });
                            }}
                        >
                            Pelajari Cara Kerjanya
                        </button>
                    </div>
                </motion.div>

                {/* Right: AI Chat Skeleton Placeholder */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    className="relative lg:ml-auto w-full max-w-lg"
                >
                    <HeroChatDemo />
                </motion.div>
            </div>
        </section>
    );
}
