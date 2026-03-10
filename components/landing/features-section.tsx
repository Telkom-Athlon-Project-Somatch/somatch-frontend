"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, LayoutList, Search, Bell } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        icon: Wand2,
        title: "Personalized Recommendation",
        description:
            "AI memberikan rekomendasi beasiswa yang sesuai dengan kondisi akademik dan minat pengguna secara otomatis.",
    },
    {
        icon: LayoutList,
        title: "Structured Scholarship Data",
        description:
            "Informasi beasiswa disusun dalam format yang jelas dan mudah dipahami, tanpa perlu membaca banyak sumber.",
    },
    {
        icon: Search,
        title: "Intelligent Search",
        description:
            "Pengguna dapat mencari beasiswa menggunakan bahasa natural, cukup deskripsikan kebutuhanmu.",
    },
    {
        icon: Bell,
        title: "Deadline Tracking",
        description:
            "Sistem membantu pengguna memantau deadline pendaftaran beasiswa agar tidak ada peluang yang terlewatkan.",
    },
];

export function FeaturesSection() {
    return (
        <section id="features" className="py-24">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 text-center"
                >
                    <p className="text-sm font-medium text-blue-500 uppercase tracking-widest mb-3">
                        Fitur
                    </p>
                    <h2 className="text-3xl font-semibold tracking-tight text-slate-100">
                        Apa yang Bisa Dilakukan Somatch?
                    </h2>
                    <p className="mt-4 text-slate-400 max-w-xl mx-auto text-base">
                        Fitur-fitur dirancang untuk menyederhanakan proses pencarian dan
                        pendaftaran beasiswa bagi mahasiswa.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="bg-slate-900 border-slate-800 hover:border-blue-900/50 transition-colors h-full">
                                    <CardHeader className="pb-3">
                                        <div className="w-9 h-9 rounded-md bg-blue-950/50 border border-blue-900/30 flex items-center justify-center mb-3">
                                            <Icon className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <CardTitle className="text-sm font-semibold text-slate-200 leading-snug">
                                            {feature.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-slate-500 leading-relaxed">
                                            {feature.description}
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
