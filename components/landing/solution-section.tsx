"use client";

import { CheckCircle2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const highlights = [
    "Analisis profil mahasiswa",
    "Pencocokan dengan database beasiswa",
    "Rekomendasi yang dipersonalisasi",
    "Penjelasan alasan kecocokan",
];

export function SolutionSection() {
    return (
        <section className="py-32 relative">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    {/* Left: Abstract Illustration */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="aspect-square max-w-md mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center overflow-hidden shadow-2xl shadow-indigo-900/20 relative">
                            {/* Glow element */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl -z-10" />

                            {/* Abstract AI graphic */}
                            <div className="relative w-full h-full flex items-center justify-center">
                                {/* Concentric rings */}
                                <div className="absolute w-64 h-64 rounded-full border border-white/5" />
                                <div className="absolute w-48 h-48 rounded-full border border-white/10" />
                                <div className="absolute w-32 h-32 rounded-full border border-indigo-500/30" />
                                {/* Center node */}
                                <div className="relative z-10 w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-400/30 flex items-center justify-center shadow-lg shadow-indigo-500/40 backdrop-blur-md">
                                    <Sparkles className="h-10 w-10 text-indigo-400" />
                                </div>
                                {/* Orbiting small nodes */}
                                <div className="absolute top-12 right-16 w-10 h-10 rounded-full bg-white/10 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-lg">
                                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                                </div>
                                <div className="absolute bottom-14 left-12 w-10 h-10 rounded-full bg-white/10 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-lg">
                                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                                </div>
                                <div className="absolute top-1/2 left-8 w-10 h-10 rounded-full bg-white/10 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-lg">
                                    <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                                </div>
                                <div className="absolute bottom-10 right-14 w-10 h-10 rounded-full bg-white/10 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-lg">
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                                </div>
                                {/* Connecting dotted lines using SVG */}
                                <svg
                                    className="absolute inset-0 w-full h-full"
                                    viewBox="0 0 400 400"
                                    fill="none"
                                >
                                    <line
                                        x1="200" y1="200" x2="280" y2="100"
                                        stroke="rgb(129,140,248)" strokeOpacity="0.3"
                                        strokeWidth="1.5" strokeDasharray="4 4"
                                    />
                                    <line
                                        x1="200" y1="200" x2="100" y2="280"
                                        stroke="rgb(34,211,238)" strokeOpacity="0.3"
                                        strokeWidth="1.5" strokeDasharray="4 4"
                                    />
                                    <line
                                        x1="200" y1="200" x2="80" y2="210"
                                        stroke="rgb(192,132,252)" strokeOpacity="0.3"
                                        strokeWidth="1.5" strokeDasharray="4 4"
                                    />
                                    <line
                                        x1="200" y1="200" x2="310" y2="295"
                                        stroke="rgb(96,165,250)" strokeOpacity="0.3"
                                        strokeWidth="1.5" strokeDasharray="4 4"
                                    />
                                </svg>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Text explanation */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col gap-6"
                    >
                        <div>
                            <p className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-3">
                                Solusi
                            </p>
                            <h2 className="text-4xl font-bold tracking-tight text-white leading-tight">
                                AI Assistant untuk Pencarian Beasiswa
                            </h2>
                        </div>
                        <p className="text-lg text-slate-300/80 leading-relaxed font-light">
                            Sistem ini menggunakan AI untuk memahami profil akademik mahasiswa
                            dan mencocokkannya dengan database beasiswa secara otomatis.
                        </p>
                        <p className="text-lg text-slate-300/80 leading-relaxed font-light">
                            AI membantu mahasiswa menemukan peluang beasiswa yang paling
                            relevan tanpa harus membaca puluhan sumber informasi secara
                            manual.
                        </p>

                        {/* Highlights */}
                        <ul className="flex flex-col gap-4 pt-2">
                            {highlights.map((item) => (
                                <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-200">
                                    <CheckCircle2 className="h-5 w-5 text-indigo-400 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
