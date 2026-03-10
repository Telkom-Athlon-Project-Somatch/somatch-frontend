"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Instagram, Linkedin, Github, Mail, Phone } from "lucide-react";

const navLinks = [
    { label: "Home", href: "#home" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Start Chat", href: "/chat" },
];

const resourceLinks = [
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/api" },
    { label: "Support", href: "/support" },
];

const socialLinks = [
    { label: "Instagram", href: "https://www.instagram.com/revzly/", icon: Instagram },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/kurniawan-andi-santoso-20b5b0195/", icon: Linkedin },
    { label: "GitHub", href: "https://github.com/andi2809/", icon: Github },
];

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-100 py-12 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            {/* Gradient divider */}
            <div className="h-px bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 mb-8" />
            <div className="max-w-6xl mx-auto px-6">
                {/* CTA */}
                <div className="flex flex-col items-start mb-12">
                    <h2 className="text-lg font-semibold text-white">
                        Mulai Temukan Beasiswa dengan AI
                    </h2>
                    <Link href="/chat" className="mt-3 inline-block px-5 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:opacity-90 transition-opacity">
                        Chat Sekarang
                    </Link>
                </div>
                {/* Multi‑column layout */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Project branding */}
                    <div>
                        <h3 className="text-sm font-medium text-white mb-2">AI Scholarship Recommendation System</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Universitas Negeri Jakarta
                        </p>
                    </div>
                    {/* Navigation */}
                    <nav aria-label="Footer navigation" className="flex flex-col gap-2">
                        <h4 className="text-sm font-medium text-white mb-1">Navigation</h4>
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="text-xs text-gray-400 hover:text-white transition-colors relative after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-200 hover:after:w-full">
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    {/* Resources */}
                    <nav aria-label="Resources" className="flex flex-col gap-2">
                        <h4 className="text-sm font-medium text-white mb-1">Resources</h4>
                        {resourceLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="text-xs text-gray-400 hover:text-white transition-colors relative after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-200 hover:after:w-full">
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    {/* Contact */}
                    <div className="flex flex-col gap-2">
                        <h4 className="text-sm font-medium text-white mb-1">Contact</h4>
                        <a href="mailto:info@scholarai.id" className="flex items-center text-xs text-gray-400 hover:text-white transition-colors">
                            <Mail className="h-4 w-4 mr-2" /> info@scholarai.id
                        </a>
                        <a href="tel:+628123456789" className="flex items-center text-xs text-gray-400 hover:text-white transition-colors">
                            <Phone className="h-4 w-4 mr-2" /> +62 812‑3456‑789
                        </a>
                        <div className="flex items-center gap-3 mt-2">
                            {socialLinks.map(({ label, href, icon: Icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <Icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Bottom line */}
                <Separator className="my-8 bg-gray-800" />
                <p className="text-center text-xs text-gray-500">
                    © {new Date().getFullYear()} AI Scholarship Recommendation System · Universitas Negeri Jakarta
                </p>
            </div>
        </footer>
    );
}
