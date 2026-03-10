import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Somatch — Temukan Beasiswa yang Tepat dengan Bantuan AI",
  description:
    "Sistem AI yang memahami profil akademik mahasiswa dan memberikan rekomendasi beasiswa yang relevan secara otomatis. Temukan beasiswa Unggulan, LPDP, dan Indonesia Maju dalam hitungan detik.",
  keywords: [
    "beasiswa",
    "AI scholarship",
    "rekomendasi beasiswa",
    "LPDP",
    "beasiswa unggulan",
    "mahasiswa",
  ],
  openGraph: {
    title: "Somatch — Temukan Beasiswa yang Tepat dengan Bantuan AI",
    description:
      "Sistem AI yang memahami profil akademik mahasiswa dan memberikan rekomendasi beasiswa yang relevan secara otomatis.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`dark ${inter.variable} ${jakarta.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
