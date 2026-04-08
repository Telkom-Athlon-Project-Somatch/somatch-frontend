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

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('somatch_theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
