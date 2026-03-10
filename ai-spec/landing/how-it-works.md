# How It Works Section

## Tujuan

Menjelaskan alur kerja sistem AI Scholarship Recommendation secara sederhana dan visual.

Bagian ini harus membantu pengguna memahami bagaimana sistem bekerja hanya dalam beberapa langkah singkat.

Setiap langkah memiliki:

- judul langkah
- penjelasan singkat
- placeholder gambar (untuk ilustrasi proses)
- warna aksen berbeda agar visual tidak monoton

## Layout

Grid responsive:

Desktop:
4 column

Tablet:
2 column

Mobile:
1 column

Setiap step menggunakan Card dari shadcn/ui.

## Visual Placeholder

Setiap card memiliki area placeholder untuk gambar ilustrasi proses.

Gunakan container seperti:

- rounded-lg
- border
- bg-slate-800
- aspect-video
- flex items-center justify-center
- text-slate-500 text-sm

Placeholder text:

"Illustration Placeholder"

Tinggi gambar:

aspect-video

Tujuan placeholder:
untuk menaruh ilustrasi diagram proses AI nanti.

---

## Step 1

### Title
Isi Profil Mahasiswa

### Accent Color

border-blue-500  
bg-blue-500/10

### Description

Pengguna memberikan informasi dasar mengenai profil akademik seperti IPK, semester, minat bidang, dan preferensi beasiswa.

Data ini menjadi dasar bagi sistem untuk memahami kebutuhan pengguna.

### Image Placeholder

Area ini akan berisi ilustrasi proses pengisian profil mahasiswa.

Contoh visual yang bisa digunakan nanti:

- form interface
- onboarding questions
- profile builder UI

Placeholder component:

"Illustration Placeholder"

---

## Step 2

### Title
AI Memahami Profil

### Accent Color

border-purple-500  
bg-purple-500/10

### Description

AI menganalisis informasi yang diberikan oleh pengguna untuk memahami kondisi akademik, minat, dan preferensi beasiswa yang diinginkan.

Tahap ini memungkinkan sistem memberikan rekomendasi yang lebih relevan.

### Image Placeholder

Area ini akan menampilkan ilustrasi proses analisis AI.

Contoh visual yang bisa digunakan:

- AI brain illustration
- data processing diagram
- AI reasoning concept

Placeholder component:

"Illustration Placeholder"

---

## Step 3

### Title
Pencocokan dengan Database

### Accent Color

border-emerald-500  
bg-emerald-500/10

### Description

Sistem mencocokkan profil pengguna dengan database beasiswa yang tersedia untuk menemukan peluang yang paling relevan.

Proses ini mempertimbangkan berbagai faktor seperti persyaratan IPK, bidang studi, dan kriteria lainnya.

### Image Placeholder

Area ini akan berisi ilustrasi proses pencarian dan pencocokan data.

Contoh visual:

- database search
- matching algorithm diagram
- AI retrieval concept

Placeholder component:

"Illustration Placeholder"

---

## Step 4

### Title
Rekomendasi Beasiswa

### Accent Color

border-amber-500  
bg-amber-500/10

### Description

Sistem menampilkan tiga rekomendasi beasiswa terbaik yang paling sesuai dengan profil pengguna.

Setiap rekomendasi dilengkapi dengan penjelasan singkat mengenai alasan kecocokan serta informasi penting seperti deadline dan persyaratan.

### Image Placeholder

Area ini akan menampilkan ilustrasi hasil rekomendasi AI.

Contoh visual:

- recommendation list
- AI chat result
- scholarship cards UI

Placeholder component:

"Illustration Placeholder"

---

## Design Notes

Section ini harus terasa:

- informatif
- visual
- tidak terlalu ramai
- akademis

Gunakan whitespace yang cukup agar setiap langkah mudah dipahami.

Animasi ringan dapat digunakan menggunakan framer-motion untuk:

- fade in
- slight upward motion

Namun animasi tidak boleh mengganggu keterbacaan konten.