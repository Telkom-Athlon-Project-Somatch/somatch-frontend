# Somatch AI - Frontend

<div align="center">
  <h3>✨ Temukan beasiswa yang cocok untukmu dengan bantuan AI ✨</h3>
</div>

**Somatch AI** adalah aplikasi *chatbot* cerdas berbasis Artificial Intelligence (Google Gemini) yang membantu pelajar dan mahasiswa Indonesia dalam menemukan rekomendasi beasiswa yang paling pas dengan jenjang, minat, GPA, dan domisili mereka.

Repositori ini berisi **Frontend Service** dari Somatch AI yang dikembangkan menggunakan **Next.js**.

---

## 🚀 Fitur Utama

- **Premium & Modern UI/UX**: Desain interface yang estetik dengan efek *glassmorphism*, gradient yang mulus, dan palet warna *dark mode* yang elegan.
- **Interactive Chat Interface**: Pengalaman chatting yang natural dilengkapi dengan animasi pengetikan (typing effect) dan transisi elemen yang *smooth*.
- **Smart Suggestion Chips**: Rekomendasi cepat (shortcut) bagi pengguna baru untuk mulai berinteraksi dengan AI tanpa perlu mengetik panjang.
- **Session Memory State**: Menyimpan riwayat obrolan (chat history) secara lokal agar interaksi tidak hilang ketika halaman di-*refresh*.
- **Adaptive Response Cards**: Mampu me-render rekomendasi beasiswa secara terstruktur dan merespons pertanyaan *general* (FAQ).

---

## 💻 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Library UI:** [React](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Language:** TypeScript

---

## ⚙️ Persyaratan Sistem (Prerequisites)

Pastikan kamu sudah menginstal *tools* berikut di komputermu:
- **Node.js** (versi 18.x atau lebih baru)
- **npm** (versi 9.x atau lebih baru)
- **Backend Service:** Pastikan [Somatch AI Backend/Service](https://github.com/Telkom-Athlon-Project-Somatch/somatch-ai-service) (FastAPI) sudah berjalan di `http://localhost:8000`.

---

## 🛠️ Panduan Instalasi & Menjalankan Aplikasi

1. **Clone repository ini:**
   ```bash
   git clone <URL_REPOSITORY_FRONTEND>
   cd somatch-frontend
   ```

2. **Instal seluruh *dependencies*:**
   ```bash
   npm install
   ```
   *(Atau gunakan `yarn install` / `pnpm install` / `bun install` sesuai *package manager* pilihanmu).*

3. **Jalankan *Development Server*:**
   ```bash
   npm run dev
   ```

4. **Buka Aplikasi di Browser:**
   Akses [http://localhost:3000](http://localhost:3000) pada browser kamu untuk melihat hasilnya.

---

## 📁 Struktur Direktori Utama

```
somatch-frontend/
├── app/
│   ├── chat/             # Halaman utama Chatbot (UI Chat Interface)
│   ├── fonts/            # Custom fonts (Geist, dll)
│   ├── globals.css       # Tailwind entry point & Global CSS variables (Colors dll)
│   ├── layout.tsx        # Root layout Next.js
│   └── page.tsx          # Halaman Landing Page aplikasi
├── components/           # Reusable React components
│   └── chat/             # Komponen khusus untuk fitur Chat (Bubble, Input, dll)
├── public/               # Static assets (images, icons)
├── tailwind.config.ts    # Konfigurasi Tailwind CSS
└── package.json          # List dependency & scripts
```

---

## 🤝 Berkontribusi (Contributing)

Jika kamu ingin berkontribusi dalam pengembangan *frontend* ini:
1. Pahami struktur kode dan hindari merusak *rules* ESLint/TypeScript yang sudah ada.
2. Buat *branch* baru untuk fitur atau *bug fix* yang akan dikerjakan (`git checkout -b feature/nama-fitur`).
3. Ajukan *Pull Request* (PR) dengan deskripsi perubahan yang jelas dan padat.

---

<div align="center">
  <p>Dibuat dengan ❤️ untuk pelajar Indonesia</p>
</div>
