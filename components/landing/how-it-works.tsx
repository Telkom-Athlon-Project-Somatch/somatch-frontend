"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const steps = [
    {
        number: "01",
        title: "Isi Profil Mahasiswa",
        description:
            "Pengguna memberikan informasi dasar mengenai profil akademik seperti IPK, semester, minat bidang, dan preferensi beasiswa. Data ini menjadi dasar bagi sistem untuk memahami kebutuhan pengguna.",
        accentBorder: "border-t-blue-500",
        accentBg: "bg-blue-500/10",
        accentText: "text-blue-400",
        placeholder: "Profil Mahasiswa",
    },
    {
        number: "02",
        title: "AI Memahami Profil",
        description:
            "AI menganalisis informasi yang diberikan oleh pengguna untuk memahami kondisi akademik, minat, dan preferensi beasiswa yang diinginkan. Tahap ini memungkinkan sistem memberikan rekomendasi yang lebih relevan.",
        accentBorder: "border-t-purple-500",
        accentBg: "bg-purple-500/10",
        accentText: "text-purple-400",
        placeholder: "Analisis AI",
    },
    {
        number: "03",
        title: "Pencocokan dengan Database",
        description:
            "Sistem mencocokkan profil pengguna dengan database beasiswa yang tersedia untuk menemukan peluang yang paling relevan. Proses ini mempertimbangkan berbagai faktor seperti persyaratan IPK, bidang studi, dan kriteria lainnya.",
        accentBorder: "border-t-emerald-500",
        accentBg: "bg-emerald-500/10",
        accentText: "text-emerald-400",
        placeholder: "Pencocokan Data",
    },
    {
        number: "04",
        title: "Rekomendasi Beasiswa",
        description:
            "Sistem menampilkan tiga rekomendasi beasiswa terbaik yang paling sesuai dengan profil pengguna. Setiap rekomendasi dilengkapi dengan penjelasan singkat mengenai alasan kecocokan serta informasi penting seperti deadline dan persyaratan.",
        accentBorder: "border-t-amber-500",
        accentBg: "bg-amber-500/10",
        accentText: "text-amber-400",
        placeholder: "Hasil Rekomendasi",
    },
];

export function HowItWorks() {
    // Framer Motion variants for staggered entrance
    const container = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.12,
            },
        },
    };

    return (
        <section id="how-it-works" className="py-24 bg-slate-900">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 text-center"
                >
                    <p className="text-sm font-medium text-blue-500 uppercase tracking-widest mb-3">
                        Cara Kerja
                    </p>
                    <h2 className="text-3xl font-semibold tracking-tight text-slate-100">
                        Bagaimana Sistem Ini Bekerja?
                    </h2>
                    <p className="mt-4 text-slate-400 max-w-xl mx-auto text-base">
                        Hanya dalam empat langkah, AI membantu kamu menemukan beasiswa yang
                        paling sesuai dengan profilmu.
                    </p>
                </motion.div>

                {/* Grid with staggered cards */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.number}
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                        >
                            <Card
                                className={`bg-slate-900 border-slate-800 border-t-4 ${step.accentBorder} h-full flex flex-col transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-xl`}
                            >
                                <CardHeader className="pb-3">
                                    <span
                                        className={`text-xs font-mono font-semibold tracking-widest ${step.accentText} mb-1`}
                                    >
                                        STEP {step.number}
                                    </span>
                                    <CardTitle className="text-base font-semibold text-slate-200 leading-snug">
                                        {step.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-4 flex-1">
                                    {/* Image placeholder with soft glow and gradient */}
                                    <div
                                        className={`aspect-video rounded-lg border border-slate-700 ${step.accentBg} flex items-center justify-center relative overflow-hidden`}
                                    >
                                        <span className="text-slate-500 text-xs text-center px-2">
                                            Illustration Placeholder
                                        </span>
                                        {/* Glow effect */}
                                        <div className="absolute inset-0 rounded-lg pointer-events-none" style={{
                                            boxShadow: `0 0 15px 4px ${step.accentBorder.replace('border-t-', '')}`
                                        }} />
                                    </div>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        {step.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

