"use client";

import { useState } from "react";
import Link from "next/link";
import { User, LogOut, Settings, Award, GraduationCap, MapPin, Loader2, X, Check, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:8000";

export default function ProfilePage() {
  const { user, token, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || "",
    university: user?.profile?.university || "",
    major: user?.profile?.major || "",
    semester: user?.profile?.semester || 1,
    gpa: user?.profile?.gpa || 0.0,
    location: user?.profile?.location || "",
    economic_status: user?.profile?.economic_status || "Menengah",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          university: formData.university,
          major: formData.major,
          semester: Number(formData.semester),
          gpa: Number(formData.gpa),
          location: formData.location,
          economic_status: formData.economic_status,
        }),
      });

      if (!res.ok) throw new Error("Gagal update profil");
      const data = await res.json();
      updateUser(data.user);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-5 sm:p-8 lg:p-12 max-w-7xl mx-auto space-y-10 min-h-screen">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-2xl sm:rounded-3xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-4xl sm:text-5xl shadow-2xl shadow-indigo-500/20 shrink-0">
          {user?.name?.[0] || user?.email?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0 space-y-4 pt-0 sm:pt-2">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading truncate">{user?.name || "Somatch User"}</h1>
            <p className="text-slate-500 font-medium text-sm truncate">{user?.email}</p>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-widest">
              <GraduationCap className="w-4 h-4 text-indigo-500" /> {user?.profile?.semester ? `Semester ${user.profile.semester}` : "Freshman"}
            </span>
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-widest">
              <MapPin className="w-4 h-4 text-emerald-500" /> {user?.profile?.location || "Lokasi Belum Diatur"}
            </span>
          </div>

          {/* Action buttons inline on mobile */}
          <div className="flex gap-2 sm:gap-3 sm:hidden">
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all text-sm font-bold shadow-sm"
            >
              <Settings className="w-4 h-4" /> Edit Profil
            </button>
            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all text-sm font-bold"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action buttons — desktop (sm+) */}
        <div className="hidden sm:flex gap-3 pt-2 shrink-0">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all text-sm font-bold shadow-sm"
          >
            <Settings className="w-4 h-4" /> Edit Profil
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all text-sm font-bold"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <section className="bg-white rounded-3xl border border-slate-200 p-8 space-y-8 relative overflow-hidden backdrop-blur-sm shadow-sm">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
              
              <div className="flex items-center gap-4 pb-6 border-b border-slate-100 relative z-10">
                 <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-inner">
                    <Award className="w-6 h-6 text-indigo-500" />
                 </div>
                 <div>
                    <h2 className="text-xl font-bold text-slate-900 font-heading">Akademik & Minat</h2>
                    <p className="text-sm text-slate-500 font-medium tracking-tight">Detail profil akademik untuk AI Matching</p>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 relative z-10">
                 <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 w-fit px-2 py-0.5 rounded-md border border-slate-200">Universitas / Sekolah</p>
                    <p className="text-slate-800 font-bold text-lg">{user?.profile?.university || "Belum diisi"}</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 w-fit px-2 py-0.5 rounded-md border border-slate-200">Jurusan / Konsentrasi</p>
                    <p className="text-slate-800 font-bold text-lg">{user?.profile?.major || "Belum diisi"}</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 w-fit px-2 py-0.5 rounded-md border border-slate-200">Status Kuliah</p>
                    <p className="text-slate-800 font-bold text-lg">Semester {user?.profile?.semester || "n/a"}</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 w-fit px-2 py-0.5 rounded-md border border-slate-200">Indeks Prestasi Kumulatif</p>
                    <div className="flex items-baseline gap-2">
                       <p className="font-black text-indigo-400 text-5xl font-heading">{user?.profile?.gpa || "0.00"}</p>
                       <span className="text-slate-600 font-bold text-sm tracking-widest lowercase">/ 4.00</span>
                    </div>
                 </div>
              </div>
           </section>
        </div>
        
        <div className="space-y-8">
           <section className="bg-linear-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 blur-3xl rounded-full" />
              <div className="relative z-10 space-y-4">
                 <h3 className="text-xl font-black font-heading tracking-tight">Cari Beasiswa Sekarang?</h3>
                 <p className="text-white/80 text-sm leading-relaxed mb-6">Profilmu sudah lengkap. AI asisten siap membantu carikan beasiswa terbaik berdasarkan datamu.</p>
                 <Link 
                   href={`/app/chat?q=${encodeURIComponent(`Halo, saya ${user?.name || "User"} dari ${user?.profile?.university || "Universitas"} jurusan ${user?.profile?.major || "Jurusan"}. Carikan beasiswa yang cocok buat saya.`)}`}
                   className="w-full inline-flex items-center justify-center py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl active:scale-95"
                 >
                   Mulai Chat AI
                 </Link>
              </div>
           </section>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/20 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl shadow-2xl relative animate-in fade-in slide-in-from-bottom-4 sm:zoom-in duration-200 max-h-[90dvh] flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 pb-0 shrink-0">
              <div>
                <h2 className="text-xl font-black text-slate-900 font-heading tracking-tight">Edit Detail Profil</h2>
                <p className="text-slate-500 text-xs mt-0.5">Update informasimu untuk hasil rekomendasi AI yang lebih baik.</p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all shrink-0 ml-4"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all shadow-sm"
                    placeholder="Contoh: Budi Santoso"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Universitas / Sekolah</label>
                  <input 
                    type="text" 
                    value={formData.university}
                    onChange={(e) => setFormData({...formData, university: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all shadow-sm"
                    placeholder="Contoh: Universitas Indonesia"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Jurusan</label>
                  <input 
                    type="text" 
                    value={formData.major}
                    onChange={(e) => setFormData({...formData, major: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all shadow-sm"
                    placeholder="Contoh: Teknik Informatika"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Semester</label>
                  <input 
                    type="number" 
                    value={formData.semester}
                    onChange={(e) => setFormData({...formData, semester: Number(e.target.value)})}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all shadow-sm"
                    placeholder="1-14"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">IPK Saat Ini</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.gpa}
                    onChange={(e) => setFormData({...formData, gpa: Number(e.target.value)})}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all shadow-sm"
                    placeholder="Contoh: 3.85"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Domisili (Provinsi)</label>
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all shadow-sm"
                    placeholder="Contoh: Jawa Barat"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2 pb-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-white border border-slate-200 text-slate-600 text-sm font-bold uppercase tracking-widest hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-[2] py-3.5 px-6 rounded-2xl bg-indigo-600 text-white text-sm font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
