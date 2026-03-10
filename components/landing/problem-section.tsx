"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Globe,
    Filter,
    AlertTriangle,
    CalendarX,
} from "lucide-react";
import { motion } from "framer-motion";

const problems = [
    {
        icon: Globe,
        title: "Informasi Tersebar Dimana-mana",
        description:
            "Informasi beasiswa tersebar di berbagai platform sehingga mahasiswa harus membuka banyak website untuk menemukan satu beasiswa yang sesuai.",
    },
    {
        icon: Filter,
        title: "Kualifikasi yang Tidak Sesuai",
        description:
            "Banyak beasiswa tidak sesuai dengan kualifikasi seperti batas IPK atau persyaratan tertentu yang sering kali baru diketahui setelah membaca detail.",
    },
    {
        icon: AlertTriangle,
        title: "Informasi Tidak Konsisten",
        description:
            "Informasi persyaratan seringkali tidak konsisten antar sumber, membuat mahasiswa bingung dan kesulitan memverifikasi persyaratan yang benar.",
    },
    {
        icon: CalendarX,
        title: "Melewatkan Deadline",
        description:
            "Mahasiswa sering melewatkan deadline pendaftaran karena tidak ada sistem pengingat terpusat untuk semua beasiswa yang sedang diikuti.",
    },
];

export function ProblemSection() {
    return (
        <section className="py-24 bg-slate-900">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 text-center"
                >
                    <p className="text-sm font-medium text-blue-500 uppercase tracking-widest mb-3">
                        Masalah
                    </p>
                    <h2 className="text-3xl font-semibold tracking-tight text-slate-100">
                        Mengapa Mencari Beasiswa Itu Sulit?
                    </h2>
                    <p className="mt-4 text-slate-400 max-w-xl mx-auto text-base">
                        Banyak mahasiswa menghadapi hambatan yang sama dalam proses
                        pencarian beasiswa.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {problems.map((problem, index) => {
                        const Icon = problem.icon;
                        return (
                            <motion.div
                                key={problem.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors h-full">
                                    <CardHeader className="pb-3">
                                        <div className="w-9 h-9 rounded-md bg-slate-800 flex items-center justify-center mb-3">
                                            <Icon className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <CardTitle className="text-sm font-semibold text-slate-200 leading-snug">
                                            {problem.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-slate-500 leading-relaxed">
                                            {problem.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
