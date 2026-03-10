"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Bot, User } from "lucide-react";
import { TypeAnimation } from "react-type-animation";

type MessageRole = "user" | "ai";

interface ChatMessage {
    role: MessageRole;
    content: string;
}

const chatMessages: ChatMessage[] = [
    {
        role: "user",
        content:
            "Saya mahasiswa semester 4 dengan IPK 3.7. Apakah ada beasiswa yang cocok untuk saya?",
    },
    {
        role: "ai",
        content:
            "Berdasarkan profil Anda, berikut tiga rekomendasi beasiswa yang paling sesuai:",
    },
];

const recommendations = [
    {
        name: "Beasiswa Unggulan",
        match: "Sangat Cocok",
        reason: "IPK di atas 3.5, mahasiswa aktif semester 4",
    },
    {
        name: "Beasiswa LPDP",
        match: "Cocok",
        reason: "Mendukung mahasiswa berprestasi untuk melanjutkan studi",
    },
    {
        name: "Beasiswa Indonesia Maju",
        match: "Cocok",
        reason: "Terbuka untuk mahasiswa S1 dengan IPK ≥ 3.0",
    },
];

export function DemoPreview() {
    const [step, setStep] = useState(0);
    const containerRef = useRef<HTMLElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    // Sequence timing logic - Faster than Hero Chat Demo
    useEffect(() => {
        if (!isInView) return;

        // Step 0: Initial Delay
        const timer1 = setTimeout(() => setStep(1), 1500);
        // Step 1: User typing message (Fast)
        const timer2 = setTimeout(() => setStep(2), 3500);
        // Step 2: AI Loading (Short wait)
        const timer3 = setTimeout(() => setStep(3), 4500);
        // Step 3: AI writing text
        const timer4 = setTimeout(() => setStep(4), 7000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
        };
    }, [isInView]);

    return (
        <section ref={containerRef} className="py-32 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mb-16 text-center"
                >
                    <p className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-3">
                        Demo
                    </p>
                    <h2 className="text-4xl font-bold tracking-tight text-white leading-tight">
                        Lihat AI Bekerja Secara Langsung
                    </h2>
                    <p className="mt-5 text-slate-300/80 max-w-xl mx-auto text-lg font-light leading-relaxed">
                        Berikut contoh percakapan dengan AI yang memberikan rekomendasi
                        beasiswa berdasarkan profilmu.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="max-w-3xl mx-auto"
                >
                    <Card className="bg-black/40 backdrop-blur-2xl border-white/10 shadow-2xl shadow-indigo-900/20 overflow-hidden">
                        <CardContent className="p-0">
                            {/* Chat header */}
                            <div className="flex items-center gap-4 px-6 py-5 border-b border-white/10 bg-white/5">
                                <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                    <Bot className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-sm font-semibold text-white">
                                        Somatch
                                    </p>
                                    <p className="text-xs text-indigo-300/80 font-medium">AI Scholarship Assistant</p>
                                </div>
                                <div className="ml-auto flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-xs font-medium text-emerald-400">Online</span>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex flex-col gap-6 p-6 min-h-[460px]">
                                {/* User message */}
                                <AnimatePresence>
                                    {step >= 1 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className="flex gap-4 justify-end"
                                        >
                                            <div className="max-w-[80%] bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-2xl rounded-tr-sm px-5 py-3.5 text-sm leading-relaxed shadow-lg shadow-indigo-500/20 font-medium">
                                                <TypeAnimation
                                                    sequence={[chatMessages[0].content]}
                                                    wrapper="span"
                                                    speed={80}
                                                    cursor={false}
                                                />
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-1 border border-white/5">
                                                <User className="h-4 w-4 text-white/80" />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* AI message */}
                                <AnimatePresence>
                                    {step === 2 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, display: "none" }}
                                            className="flex gap-4"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-1 border border-white/5">
                                                <Bot className="h-4 w-4 text-indigo-400" />
                                            </div>
                                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl rounded-tl-sm px-5 py-3.5 text-sm flex gap-1 items-center h-12 w-fit">
                                                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 bg-indigo-300 rounded-full" />
                                                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-indigo-300 rounded-full" />
                                                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-indigo-300 rounded-full" />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <AnimatePresence>
                                    {step >= 3 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className="flex gap-4"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-1 border border-white/5">
                                                <Bot className="h-4 w-4 text-indigo-400" />
                                            </div>
                                            <div className="flex flex-col gap-4 max-w-[90%] md:max-w-[85%]">
                                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl rounded-tl-sm px-5 py-3.5 text-sm text-slate-200 leading-relaxed font-light w-fit">
                                                    <TypeAnimation
                                                        sequence={[chatMessages[1].content]}
                                                        wrapper="span"
                                                        speed={80}
                                                        cursor={false}
                                                    />
                                                </div>

                                                {/* Scholarship cards in AI reply */}
                                                <AnimatePresence>
                                                    {step >= 4 && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.4 }}
                                                            className="flex flex-col gap-3"
                                                        >
                                                            {recommendations.map((rec, i) => (
                                                                <motion.div
                                                                    initial={{ opacity: 0, x: -10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: i * 0.2 }}
                                                                    key={rec.name}
                                                                    className="bg-black/20 border border-white/5 rounded-xl px-4 md:px-5 py-4 flex items-start gap-4 hover:bg-white/5 transition-colors duration-300"
                                                                >
                                                                    <span className="text-xs font-mono font-bold text-indigo-400 mt-1 pb-1 border-b border-indigo-500/30">
                                                                        {String(i + 1).padStart(2, "0")}
                                                                    </span>
                                                                    <div className="flex-1">
                                                                        <p className="text-sm font-semibold text-white">
                                                                            {rec.name}
                                                                        </p>
                                                                        <p className="text-sm text-slate-400 font-light mt-1">
                                                                            {rec.reason}
                                                                        </p>
                                                                    </div>
                                                                    <span className="hidden md:block text-xs text-emerald-300 font-semibold bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 whitespace-nowrap">
                                                                        {rec.match}
                                                                    </span>
                                                                </motion.div>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Input area (static) */}
                            <div className="px-6 pb-6 mt-auto">
                                <div className="flex items-center gap-3 bg-black/40 rounded-xl px-5 py-4 border border-white/10 shadow-inner">
                                    <span className="text-sm text-slate-500 font-light flex-1">
                                        Tanyakan tentang beasiswamu...
                                    </span>
                                    <div className="w-9 h-9 rounded-lg bg-linear-to-r from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20 cursor-pointer hover:opacity-80 transition-opacity">
                                        <svg
                                            className="h-4 w-4 text-white"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M22 2L11 13" />
                                            <path d="M22 2L15 22l-4-9-9-4 20-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}
