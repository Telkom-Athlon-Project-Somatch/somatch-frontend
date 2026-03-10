# Navbar Specification

## Purpose

Navbar berfungsi sebagai navigasi utama pada landing page.

Navbar harus:

- minimalis
- akademis
- profesional
- konsisten dengan desain AI product

Navbar juga harus mendukung **smooth scroll navigation** karena landing page bersifat SPA.

---

# Layout

Navbar berada di bagian paling atas halaman.

Gunakan layout:

container
max-w-6xl
mx-auto
px-6

Height:

h-16

Navbar harus menggunakan:

backdrop-blur
semi-transparent background

Example:

bg-slate-950/70
backdrop-blur

Border bottom:

border-b border-slate-800

---

# Navbar Structure

Navbar memiliki 3 bagian:

Left:
Logo / Project name

Center:
Navigation links

Right:
Call To Action button

Layout:

[Logo]   [Navigation Links]   [CTA Button]

---

# Logo

Nama project:

ScholarAI

atau

AI Scholarship Assistant

Style:

font-semibold
tracking-tight
text-slate-100

Logo clickable menuju:

/

---

# Navigation Links

Link harus melakukan smooth scroll menuju section tertentu.

Navigation:

Home
How It Works
Features
Testimonials
Impact

Contoh anchor:

#home
#how-it-works
#features
#testimonials
#impact

Style:

text-sm
text-slate-400
hover:text-slate-200

Spacing:

gap-6

---

# CTA Button

Button utama berada di kanan navbar.

Text:

Start AI Chat

Link:

/chat

Gunakan component:

Button (shadcn/ui)

Variant:

default

Style:

bg-blue-600
hover:bg-blue-500

---

# Mobile Behavior

Pada layar kecil:

Navbar berubah menjadi:

hamburger menu

Gunakan component:

Sheet / Drawer dari shadcn/ui

Menu items:

Home
How It Works
Features
Testimonials
Impact
Start AI Chat

---

# Sticky Navbar

Navbar harus sticky agar selalu terlihat.

Use:

sticky
top-0
z-50

---

# Accessibility

Gunakan:

aria-label untuk navigation

contoh:

<nav aria-label="Main Navigation">

---

# UX Notes

Navbar tidak boleh terlalu tinggi.

Pastikan scroll ke section terasa smooth.

Gunakan:

scroll-behavior: smooth