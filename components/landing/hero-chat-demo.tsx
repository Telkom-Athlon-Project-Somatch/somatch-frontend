"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TypeAnimation } from "react-type-animation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, User } from "lucide-react";
import Image from "next/image";

export function HeroChatDemo() {
    const router = useRouter();
    const [inputValue, setInputValue] = useState("");
    const [step, setStep] = useState(0);

    // Sequence timing logic
    useEffect(() => {
        // Step 0: Initial delay before AI starts typing 
        const timer1 = setTimeout(() => setStep(1), 500);
        // Step 1: AI typing first message. Let's say it takes ~4s to type
        const timer2 = setTimeout(() => setStep(2), 6500);
        // Step 2: User typing second message. Takes ~2.5s
        const timer3 = setTimeout(() => setStep(3), 10000);
        // Step 3: AI showing results. Takes ~2s
        const timer4 = setTimeout(() => setStep(4), 16000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            router.push(`/chat?message=${encodeURIComponent(inputValue.trim())}`);
        } else {
            router.push("/chat");
        }
    };

    return (
        <div className="relative w-full max-w-lg mx-auto lg:ml-auto group">
            {/* Decorative elements behind the card */}
            <div className="absolute -inset-1 rounded-[2rem] bg-linear-to-b from-indigo-500/20 via-cyan-500/10 to-transparent blur-xl opacity-50" />
            <div className="absolute -inset-0.5 rounded-[2rem] bg-linear-to-br from-indigo-500/30 via-transparent to-cyan-500/20 opacity-50" />

            {/* Glassmorphism Card */}
            <div className="relative h-[480px] rounded-[2rem] border border-white/10 bg-slate-950/60 backdrop-blur-2xl flex flex-col shadow-2xl overflow-hidden">
                {/* Top glow */}
                <div className="absolute top-0 inset-x-0 h-px w-1/2 mx-auto bg-linear-to-r from-transparent via-indigo-400/50 to-transparent" />

                {/* Chat header */}
                <div className="flex items-center gap-4 p-4 border-b border-white/5 relative z-10 bg-slate-900/50">
                    <div className="relative">
                        <div className="h-10 w-10 flex flex-col items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 overflow-hidden">
                            <Image src="/favicon.png" alt="Somatch Logo" width={40} height={40} className="w-full h-full object-cover rounded-full" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-teal-400 rounded-full border-2 border-slate-900 shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-100">Somatch</span>
                        <span className="text-xs text-slate-400">Online</span>
                    </div>
                </div>

                {/* Chat messages area */}
                <div className="flex flex-col gap-4 p-4 flex-1 overflow-y-auto relative z-10 scrollbar-none custom-scrollbar pb-6">
                    
                    <AnimatePresence>
                        {step >= 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className="flex gap-3"
                            >
                                <div className="h-8 w-8 flex flex-col items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 shrink-0 mt-1 overflow-hidden p-0.5">
                                    <Image src="/favicon.png" alt="Somatch Logo" width={32} height={32} className="w-full h-full object-cover rounded-full" />
                                </div>
                                <div className="flex flex-col gap-1 max-w-[85%]">
                                    <div className="bg-white/5 text-slate-200 p-3 rounded-2xl rounded-tl-sm border border-white/5 shadow-sm text-[13px] leading-relaxed">
                                        <TypeAnimation
                                            sequence={[
                                                "Halo selamat datang di Somatch, Scholarship Matching di mana aku akan membantu kamu untuk mencari beasiswa yang sesuai dengan diri kamu, silahkan untuk mengisi data IPK, Fakultas, dan Prodi kamu untuk lanjut ✨",
                                            ]}
                                            wrapper="span"
                                            speed={60}
                                            cursor={false}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {step >= 2 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className="flex gap-3 justify-end mt-2"
                            >
                                <div className="flex flex-col gap-1 max-w-[85%] items-end">
                                    <div className="bg-indigo-600/20 text-indigo-100 p-3 rounded-2xl rounded-tr-sm border border-indigo-500/20 shadow-sm text-[13px] leading-relaxed">
                                        <TypeAnimation
                                            sequence={[
                                                "Halo! IPK saya 3.85, Fakultas Ilmu Komputer, Program Studi S1 Teknik Informatika.",
                                            ]}
                                            wrapper="span"
                                            speed={50}
                                            cursor={false}
                                        />
                                    </div>
                                </div>
                                <div className="h-8 w-8 flex flex-col items-center justify-center rounded-full bg-slate-800 text-slate-400 shrink-0 mt-1">
                                    <User className="h-4 w-4" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {step === 3 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, display: "none" }}
                                className="flex gap-3 mt-2 items-center"
                            >
                                <div className="h-8 w-8 flex flex-col items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 shrink-0 overflow-hidden p-0.5">
                                    <Image src="/favicon.png" alt="Somatch Logo" width={32} height={32} className="w-full h-full object-cover rounded-full" />
                                </div>
                                <div className="bg-white/5 p-3 rounded-2xl rounded-tl-sm border border-white/5 shadow-sm flex gap-1 items-center h-10 px-4">
                                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {step >= 4 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className="flex gap-3 mt-2"
                            >
                                <div className="h-8 w-8 flex flex-col items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 shrink-0 mt-1 overflow-hidden p-0.5">
                                    <Image src="/favicon.png" alt="Somatch Logo" width={32} height={32} className="w-full h-full object-cover rounded-full" />
                                </div>
                                <div className="flex flex-col gap-2 w-full text-[13px]">
                                    <div className="bg-white/5 text-slate-200 p-3 rounded-2xl rounded-tl-sm border border-white/5 shadow-sm leading-relaxed w-fit">
                                        <TypeAnimation
                                            sequence={[
                                                "Berdasarkan datamu, ini top 3 beasiswa yang cocok:",
                                            ]}
                                            wrapper="span"
                                            speed={60}
                                            cursor={false}
                                        />
                                    </div>

                                    {/* Scholarship Cards appearing one by one after text */}
                                    <motion.div 
                                        initial={{ opacity: 0, x: -10 }} 
                                        animate={{ opacity: 1, x: 0 }} 
                                        transition={{ delay: 2.5 }}
                                        className="mt-2 flex flex-col gap-2"
                                    >
                                        <div className="w-full rounded-xl bg-linear-to-r from-white/5 to-white/2 border border-white/5 p-3 flex flex-col gap-1.5 hover:border-white/10 transition-colors">
                                            <span className="text-indigo-300 font-medium">1. Beasiswa Unggulan Kemendikbud</span>
                                            <span className="text-slate-400 text-xs">Cocok untuk mahasiswa S1 Informatika aktif dengan IPK tinggi.</span>
                                        </div>
                                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 3.2 }} className="w-full rounded-xl bg-linear-to-r from-white/5 to-white/2 border border-white/5 p-3 flex flex-col gap-1.5 hover:border-white/10 transition-colors">
                                            <span className="text-cyan-300 font-medium">2. Beasiswa BCA Finance</span>
                                            <span className="text-slate-400 text-xs">Fokus jurusan IT, IPK minimum 3.2. Proses mudah.</span>
                                        </motion.div>
                                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 3.9 }} className="w-full rounded-xl bg-linear-to-r from-white/5 to-white/2 border border-white/5 p-3 flex flex-col gap-1.5 hover:border-white/10 transition-colors">
                                            <span className="text-teal-300 font-medium">3. Djarum Beasiswa Plus</span>
                                            <span className="text-slate-400 text-xs">Mencari mahasiswa berprestasi dengan IPK &gt; 3.0.</span>
                                        </motion.div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Auto scroll bottom padding */}
                    <div className="h-4 w-full shrink-0" />
                </div>

                {/* Chat input */}
                <form onSubmit={handleSubmit} className="p-4 border-t border-white/5 relative z-10 bg-slate-900/40">
                    <div className="flex gap-2 items-center relative">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ketik pesan..."
                            className="h-11 flex-1 rounded-full bg-white/5 border border-white/10 px-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500/50 shadow-inner"
                        />
                        <button 
                            type="submit"
                            className="h-11 w-11 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-lg hover:bg-indigo-500/30 hover:text-indigo-300 transition-colors cursor-pointer shrink-0"
                        >
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                </form>
            </div>
            
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                }
            `}</style>
        </div>
    );
}
