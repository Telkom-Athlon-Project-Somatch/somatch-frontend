"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote, Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
    {
        id: 1,
        quote:
            "AI ini membantu saya menemukan beasiswa yang benar-benar sesuai dengan kondisi akademik saya. Prosesnya luar biasa cepat, akurat, dan sangat menghemat waktu yang biasanya terbuang untuk riset manual. Penjelasan dari AI juga sangat mudah dipahami, memberikan insight berharga yang belum pernah saya pikirkan sebelumnya.",
        name: "Alya Pratiwi",
        role: "Mahasiswa Ilmu Komputer",
        university: "Universitas Indonesia",
        initials: "AP",
        avatar: "https://i.pravatar.cc/150?img=44",
        featured: true,
        delay: 0,
        duration: 5,
    },
    {
        id: 2,
        quote:
            "Saya biasanya harus membuka belasan website, tetapi dengan Somatch, rekomendasi yang muncul langsung relevan dengan profil target jurusan saya.",
        name: "Rizky Maulana",
        role: "Sistem Informasi",
        university: "Institut Teknologi Bandung",
        initials: "RM",
        avatar: "https://i.pravatar.cc/150?img=33",
        featured: false,
        delay: 1.5,
        duration: 5.5,
    },
    {
        id: 3,
        quote:
            "Penjelasan AI mengenai alasan kecocokan beasiswa sangat membantu saya memahami peluang terbaik mana yang paling layak untuk saya kejar.",
        name: "Dina Septika",
        role: "Hubungan Internasional",
        university: "Universitas Gadjah Mada",
        initials: "DS",
        avatar: "https://i.pravatar.cc/150?img=32",
        featured: false,
        delay: 0.8,
        duration: 6,
    },
];

const FloatingCard = ({
    testimonial,
    className = "",
}: {
    testimonial: typeof testimonials[0];
    className?: string;
}) => {
    return (
        <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{
                duration: testimonial.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: testimonial.delay,
            }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className={`w-full ${className}`}
        >
            <div
                className={`group relative rounded-3xl p-[1px] shadow-2xl transition-all duration-300 ${
                    testimonial.featured
                        ? "bg-linear-to-b from-cyan-400/40 via-cyan-500/10 to-slate-800/30 hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.3)]"
                        : "bg-linear-to-b from-slate-600/50 to-slate-800/20 hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.1)]"
                }`}
            >
                <Card className="bg-slate-900/60 backdrop-blur-2xl border-none rounded-[calc(1.5rem-1px)] h-full overflow-hidden relative">
                    {/* Glowing effect inside card */}
                    <div
                        className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] pointer-events-none transition-opacity duration-500 ${
                            testimonial.featured
                                ? "bg-cyan-500/20 group-hover:bg-cyan-500/30"
                                : "bg-slate-500/10 group-hover:bg-slate-500/20"
                        }`}
                    />

                    <CardContent
                        className={`flex flex-col h-full relative z-10 ${
                            testimonial.featured ? "p-8 md:p-12 text-center items-center" : "p-6 sm:p-8"
                        }`}
                    >
                        <div
                            className={`flex ${
                                testimonial.featured ? "justify-center mb-8" : "justify-between items-start mb-6"
                            }`}
                        >
                            {/* Stars */}
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        className={`w-5 h-5 ${
                                            testimonial.featured ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" : "text-amber-400"
                                        }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            {!testimonial.featured && (
                                <Quote className="w-8 h-8 text-slate-500/40 group-hover:text-amber-400/20 transition-colors duration-300" />
                            )}
                        </div>

                        {testimonial.featured && (
                            <Quote className="absolute top-8 left-8 w-16 h-16 text-cyan-500/10 -rotate-12 pointer-events-none" />
                        )}

                        <p
                            className={`text-slate-300 leading-relaxed mb-8 flex-1 relative ${
                                testimonial.featured ? "text-lg md:text-2xl font-medium tracking-tight" : "text-base"
                            }`}
                        >
                            &ldquo;{testimonial.quote}&rdquo;
                        </p>

                        <div
                            className={`flex items-center gap-4 w-full pt-6 border-t border-slate-700/50 mt-auto ${
                                testimonial.featured ? "justify-center" : "justify-start"
                            }`}
                        >
                            <Avatar
                                className={`${
                                    testimonial.featured
                                        ? "h-16 w-16 border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                                        : "h-12 w-12 border border-slate-600"
                                }`}
                            >
                                <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                <AvatarFallback className="bg-slate-800 text-cyan-400 font-bold">
                                    {testimonial.initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className={`${testimonial.featured ? "text-left" : ""}`}>
                                <p className="text-base font-semibold text-slate-100 group-hover:text-white transition-colors">
                                    {testimonial.name}
                                </p>
                                <p className="text-sm text-cyan-400/80 font-medium">{testimonial.role}</p>
                                <p className="text-xs text-slate-500 line-clamp-1">{testimonial.university}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
};

export function Testimonials() {
    return (
        <section id="testimonials" className="py-24 md:py-32 relative overflow-hidden bg-slate-950">
            {/* Background Details */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mb-20 text-center max-w-3xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 text-cyan-400 text-sm font-semibold tracking-wider mb-6 shadow-sm backdrop-blur-md">
                        <Star className="w-4 h-4" />
                        TESTIMONIALS
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-50 mb-6 leading-tight">
                        Disukai oleh Ribuan Pejuang{" "}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">
                            Beasiswa
                        </span>
                    </h2>
                    <p className="mt-4 text-slate-400 text-lg md:text-xl leading-relaxed">
                        Mulai dari menghemat waktu riset hingga menemukan peluang tersembunyi, lihat bagaimana kami
                        mengubah perjalanan akademik mereka menuju kesuksesan.
                    </p>
                </motion.div>

                {/* 
                  Asymmetric Layout:
                  Mobile: 1 column, stacked
                  Tablet: 2 columns, grid
                  Desktop: 12 columns grid. Large card spans 7, Small cards span 5 in a flex column to the right. 
                           Or Large Left, Small Right.
                */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
                    {/* Featured Testimonial (Large) */}
                    <div className="lg:col-span-7 h-full w-full">
                        <FloatingCard testimonial={testimonials[0]} className="h-full flex" />
                    </div>

                    {/* Small Testimonials (Stacked on Desktop) */}
                    <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-10">
                        <FloatingCard testimonial={testimonials[1]} />
                        <FloatingCard testimonial={testimonials[2]} />
                    </div>
                </div>
            </div>
        </section>
    );
}
