"use client";

import Link from "next/link";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sparkles, LogOut, User } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const leftLinks = [
    { label: "Home", href: "#home" },
    { label: "How It Works", href: "#how-it-works" },
];

const rightLinks = [
    { label: "Features", href: "#features" },
    { label: "Impact", href: "#impact" },
    { label: "Testimonials", href: "#testimonials" },
];

const allLinks = [...leftLinks, ...rightLinks];

export function Navbar() {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("home");

    // Scroll style effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Scroll spy using IntersectionObserver
    useEffect(() => {
        const sectionIds = allLinks.map((l) => l.href.replace("#", ""));
        const observers: IntersectionObserver[] = [];

        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (!el) return;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveSection(id);
                    }
                },
                {
                    rootMargin: "-40% 0px -55% 0px",
                    threshold: 0,
                }
            );
            observer.observe(el);
            observers.push(observer);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, []);

    const handleLinkClick = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
            e.preventDefault();
            const id = href.replace("#", "");
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: "smooth" });
                setActiveSection(id);
            }
            setOpen(false);
        },
        []
    );

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${scrolled
                ? "bg-[oklch(0.08_0.02_260/0.75)] backdrop-blur-2xl border-b border-[oklch(0.3_0.08_264/0.15)] shadow-[0_4px_30px_oklch(0_0_0/0.3)]"
                : "bg-transparent border-b border-transparent"
                }`}
        >
            {/* Top glow line */}
            <div
                className={`absolute top-0 left-0 right-0 h-px transition-opacity duration-500 ${scrolled ? "opacity-100" : "opacity-0"
                    }`}
                style={{
                    background:
                        "linear-gradient(90deg, transparent, oklch(0.65 0.25 264 / 0.4), oklch(0.75 0.20 280 / 0.3), transparent)",
                }}
            />

            <nav
                aria-label="Main Navigation"
                className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between"
            >
                {/* Left Nav Links */}
                <div className="hidden md:flex items-center gap-1 flex-1 justify-end pr-8">
                    <ul className="flex items-center gap-1">
                        {leftLinks.map((link) => (
                            <NavLink
                                key={link.href}
                                link={link}
                                isActive={
                                    activeSection === link.href.replace("#", "")
                                }
                                onClick={handleLinkClick}
                            />
                        ))}
                    </ul>
                </div>

                {/* Center Logo */}
                <Link
                    href="/#home"
                    className="group relative flex items-center justify-center gap-2 shrink-0"
                    aria-label="Go to home"
                >
                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 group-hover:border-white/20 transition-colors">
                        <Image src="/favicon.png" alt="Somatch Logo" width={32} height={32} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-bold tracking-tight text-[oklch(0.95_0.02_260)] group-hover:text-white transition-colors">
                        So
                        <span className="bg-linear-to-r from-[oklch(0.65_0.25_264)] to-[oklch(0.75_0.20_280)] bg-clip-text text-transparent">
                            match
                        </span>
                    </span>
                </Link>

                {/* Right Nav Links & Auth Area */}
                <div className="hidden md:flex flex-1 items-center justify-between pl-8">
                    <div className="flex items-center gap-3">
                        {!user ? (
                            <>
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-[oklch(0.6_0.04_260)] hover:text-white transition-colors"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    className="relative inline-flex h-9 px-5 items-center justify-center rounded-full text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 active:scale-95 shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                                >
                                    Daftar Gratis
                                </Link>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center border-r border-white/10 pr-3 py-1">
                                    <User className="w-3.5 h-3.5 text-slate-400 mr-2" />
                                    <span className="text-sm text-white font-medium truncate max-w-[80px] xl:max-w-[120px]">
                                        {user.name || user.email.split('@')[0]}
                                    </span>
                                </div>
                                <Link
                                    href="/app/explore"
                                    className="text-sm font-medium text-slate-400 hover:text-white transition-all px-2"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => logout()}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-all"
                                    title="Keluar"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>

                    <div className="flex items-center pl-4">
                        <Link
                            href={user ? "/app/chat" : "/login"}
                            className="group relative inline-flex items-center gap-2 h-9 px-5 rounded-full text-sm font-bold text-white overflow-hidden transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] shadow-lg shadow-indigo-500/20"
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-indigo-600 to-purple-600 group-hover:from-indigo-500 group-hover:to-purple-500 transition-all" />
                            <Sparkles className="w-4 h-4 relative animate-pulse" />
                            <span className="relative uppercase tracking-widest text-xs">Mulai Chat</span>
                        </Link>
                    </div>
                </div>

                {/* Mobile Hamburger */}
                <div className="md:hidden flex-1 flex justify-end">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger
                            aria-label="Open mobile menu"
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-[oklch(0.7_0.05_260)] hover:text-white hover:bg-[oklch(0.2_0.08_260/0.5)] transition-all duration-200"
                        >
                            <Menu className="h-5 w-5" />
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="bg-[oklch(0.08_0.02_260/0.95)] backdrop-blur-2xl border-l border-[oklch(0.25_0.08_264/0.2)] w-72 p-0"
                        >
                            <div className="flex flex-col h-full">
                                {/* Mobile Header */}
                                <div className="flex items-center justify-between p-6 border-b border-[oklch(0.2_0.06_260/0.5)]">
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center justify-center w-7 h-7 rounded-lg overflow-hidden">
                                            <Image src="/favicon.png" alt="Somatch Logo" width={28} height={28} className="w-full h-full object-cover" />
                                        </div>
                                        <span style={{ fontFamily: "var(--font-heading), var(--font-sans)" }} className="font-bold tracking-tight text-[oklch(0.95_0.02_260)]">
                                            So
                                            <span className="bg-linear-to-r from-[oklch(0.65_0.25_264)] to-[oklch(0.75_0.20_280)] bg-clip-text text-transparent">
                                                match
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                {/* Mobile Nav Links */}
                                <nav className="flex flex-col gap-1 p-4 flex-1">
                                    {allLinks.map((link, i) => {
                                        const isActive =
                                            activeSection ===
                                            link.href.replace("#", "");
                                        return (
                                            <motion.a
                                                key={link.href}
                                                href={link.href}
                                                onClick={(e) =>
                                                    handleLinkClick(
                                                        e,
                                                        link.href
                                                    )
                                                }
                                                initial={{
                                                    opacity: 0,
                                                    x: 20,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    x: 0,
                                                }}
                                                transition={{
                                                    delay: i * 0.05,
                                                    duration: 0.3,
                                                }}
                                                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                                    ? "text-white bg-[oklch(0.25_0.1_264/0.5)]"
                                                    : "text-[oklch(0.6_0.04_260)] hover:text-white hover:bg-[oklch(0.2_0.06_260/0.3)]"
                                                    }`}
                                            >
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="mobile-active"
                                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-linear-to-b from-[oklch(0.65_0.25_264)] to-[oklch(0.75_0.20_280)]"
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 300,
                                                            damping: 30,
                                                        }}
                                                    />
                                                )}
                                                {link.label}
                                            </motion.a>
                                        );
                                    })}
                                </nav>

                                {/* Mobile CTA & Auth */}
                                <div className="p-4 border-t border-[oklch(0.2_0.06_260/0.5)] flex flex-col gap-3">
                                    {!user ? (
                                        <div className="grid grid-cols-2 gap-3">
                                            <Link
                                                href="/login"
                                                onClick={() => setOpen(false)}
                                                className="flex items-center justify-center h-11 rounded-xl bg-[oklch(0.15_0.04_260)] text-white text-sm font-semibold border border-[oklch(0.25_0.08_264/0.2)]"
                                            >
                                                Masuk
                                            </Link>
                                            <Link
                                                href="/register"
                                                onClick={() => setOpen(false)}
                                                className="flex items-center justify-center h-11 rounded-xl bg-white/10 text-white text-sm font-semibold border border-white/10"
                                            >
                                                Daftar
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Signed In As</span>
                                                    <span className="text-sm text-white font-black font-heading truncate max-w-[160px]">
                                                        {user.name || user.email.split('@')[0]}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => { logout(); setOpen(false); }}
                                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20"
                                                >
                                                    <LogOut className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <Link
                                                href="/app/explore"
                                                onClick={() => setOpen(false)}
                                                className="flex items-center justify-center h-11 rounded-xl bg-white/5 text-white text-sm font-bold border border-white/10"
                                            >
                                                Buka Dashboard
                                            </Link>
                                        </div>
                                    )}

                                    <Link
                                        href="/app/chat"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center justify-center gap-2 h-11 w-full rounded-xl bg-linear-to-r from-[oklch(0.55_0.25_264)] via-[oklch(0.60_0.25_272)] to-[oklch(0.65_0.20_280)] text-white text-sm font-semibold shadow-[0_0_20px_oklch(0.65_0.25_264/0.25)] hover:shadow-[0_0_30px_oklch(0.65_0.25_264/0.4)] transition-shadow duration-300"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        Mulai Chat AI
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </header >
    );
}

// ─── NavLink Component ───────────────────────────────────────────────────────

interface NavLinkProps {
    link: { label: string; href: string };
    isActive: boolean;
    onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

function NavLink({ link, isActive, onClick }: NavLinkProps) {
    return (
        <li>
            <a
                href={link.href}
                onClick={(e) => onClick(e, link.href)}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 group ${isActive
                    ? "text-white"
                    : "text-[oklch(0.6_0.04_260)] hover:text-[oklch(0.85_0.03_260)]"
                    }`}
            >
                {link.label}

                {/* Hover underline grow effect */}
                <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-px transition-all duration-300 ease-out ${isActive
                        ? "w-full bg-linear-to-r from-transparent via-[oklch(0.65_0.25_264)] to-transparent"
                        : "w-0 group-hover:w-3/4 bg-linear-to-r from-transparent via-[oklch(0.6_0.15_264/0.5)] to-transparent"
                        }`}
                />

                {/* Active glow dot */}
                {isActive && (
                    <motion.span
                        layoutId="nav-active-glow"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[oklch(0.65_0.25_264)] shadow-[0_0_8px_oklch(0.65_0.25_264/0.8),0_0_16px_oklch(0.65_0.25_264/0.4)]"
                        transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 30,
                        }}
                    />
                )}
            </a>
        </li>
    );
}
