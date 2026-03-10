"use client";

import { motion } from "framer-motion";

const metrics = [
    {
        value: "80%",
        label: "Lebih cepat menemukan beasiswa",
        description: "Dibandingkan pencarian manual di berbagai platform",
        gradient: "from-blue-400 via-cyan-400 to-teal-400",
        glowColor: "rgba(56, 189, 248, 0.15)",
    },
    {
        value: "3",
        label: "Rekomendasi personal dari AI",
        description: "Dipilih AI berdasarkan profil dan kriteria unikmu",
        gradient: "from-violet-400 via-purple-400 to-indigo-400",
        glowColor: "rgba(167, 139, 250, 0.15)",
    },
    {
        value: "1",
        label: "Platform untuk semua informasi",
        description: "Satu tempat untuk cari, filter, dan kelola beasiswa",
        gradient: "from-rose-400 via-pink-400 to-fuchsia-400",
        glowColor: "rgba(244, 114, 182, 0.15)",
    },
];

export function ImpactSection() {
    return (
        <section id="impact" className="relative py-28 overflow-hidden">
            {/* Background subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/80 to-slate-950" />
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage:
                        "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(99, 102, 241, 0.12), transparent)",
                }}
            />

            <div className="relative z-10 max-w-5xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-20 text-center"
                >
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Impact
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                        Angka yang Berbicara
                    </h2>
                    <p className="mt-4 text-slate-400 max-w-lg mx-auto text-base leading-relaxed">
                        Lihat bagaimana Somatch mengubah cara mahasiswa menemukan
                        beasiswa yang tepat.
                    </p>
                </motion.div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
                    {metrics.map((metric, index) => (
                        <motion.div
                            key={metric.label}
                            initial={{ opacity: 0, y: 32 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.15,
                                ease: [0.21, 0.47, 0.32, 0.98],
                            }}
                            className="group relative"
                        >
                            <div
                                className="relative flex flex-col items-center text-center p-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.04]"
                                style={{
                                    boxShadow: `0 0 60px ${metric.glowColor}`,
                                }}
                            >
                                {/* Large Metric Number */}
                                <span
                                    className={`text-6xl md:text-7xl font-extrabold tracking-tighter bg-gradient-to-br ${metric.gradient} bg-clip-text text-transparent leading-none`}
                                >
                                    {metric.value}
                                </span>

                                {/* Subtle divider */}
                                <div
                                    className={`w-10 h-[2px] mt-5 mb-5 rounded-full bg-gradient-to-r ${metric.gradient} opacity-40 group-hover:opacity-70 group-hover:w-14 transition-all duration-500`}
                                />

                                {/* Label */}
                                <p className="text-base font-semibold text-slate-100 leading-snug mb-2">
                                    {metric.label}
                                </p>

                                {/* Description */}
                                <p className="text-sm text-slate-500 leading-relaxed max-w-[220px]">
                                    {metric.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
