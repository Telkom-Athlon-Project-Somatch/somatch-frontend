"use client";

import { GraduationCap, TrendingUp, BookOpen, Clock } from "lucide-react";
import { motion } from "framer-motion";

const users = [
    {
        icon: GraduationCap,
        title: "Mahasiswa Aktif",
        description:
            "Mahasiswa aktif yang sedang mencari beasiswa untuk meringankan biaya pendidikan.",
    },
    {
        icon: TrendingUp,
        title: "Calon Penerima Beasiswa",
        description:
            "Mahasiswa yang ingin melanjutkan studi dengan bantuan pendanaan dari berbagai program beasiswa.",
    },
    {
        icon: BookOpen,
        title: "Mahasiswa Kesulitan Informasi",
        description:
            "Mahasiswa yang kesulitan menemukan informasi beasiswa yang sesuai dengan kondisi akademiknya.",
    },
    {
        icon: Clock,
        title: "Pencari Efisiensi",
        description:
            "Mahasiswa yang ingin menghemat waktu dalam proses pencarian dan seleksi beasiswa.",
    },
];

export function TargetUsers() {
    return (
        <section className="py-32 relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mb-16 text-center"
                >
                    <p className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-3">
                        Target Pengguna
                    </p>
                    <h2 className="text-4xl font-bold tracking-tight text-white mb-6">
                        Untuk Siapa Somatch Ini?
                    </h2>
                    <p className="max-w-2xl mx-auto text-lg text-slate-300/80 leading-relaxed font-light">
                        Somatch dirancang khusus untuk membantu mahasiswa menemukan
                        peluang beasiswa yang paling relevan.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {users.map((user, index) => {
                        const Icon = user.icon;
                        return (
                            <motion.div
                                key={user.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="flex gap-5 p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-colors duration-300">
                                    <Icon className="h-6 w-6 text-indigo-400 group-hover:text-indigo-300" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-200 mb-2 group-hover:text-white transition-colors duration-300">
                                        {user.title}
                                    </h3>
                                    <p className="text-sm text-slate-400 font-light leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                                        {user.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
