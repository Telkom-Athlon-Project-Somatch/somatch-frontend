"use client";

import { motion } from "framer-motion";
import { Calendar, UserCircle } from "lucide-react";

interface DynamicActionButtonsProps {
  mode: string;
  response?: string;
  onSelect: (text: string) => void;
}

function generateCalendarUrl(title: string, deadline: string): string {
  const t = encodeURIComponent(title);
  const d = deadline.replace(/[^\d-]/g, ""); // basic clean
  const deadlineDate = d.replace(/-/g, "");
  const nextDay = new Date(d);
  if (isNaN(nextDay.getTime())) return ""; // failed date
  nextDay.setDate(nextDay.getDate() + 1);
  const endDate = nextDay.toISOString().split("T")[0].replace(/-/g, "");
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${t}&dates=${deadlineDate}/${endDate}&details=Scholarship Deadline from Somatch AI`;
}

export function generateDynamicActions(response: string, mode: string): string[] {
  const actions: string[] = [];
  
  // Custom logic to extract the first scholarship for "Show Detail" suggestion
  const firstTitleMatch = response.match(/\d\.\s\*\*(.*?)\*\*/);
  if (firstTitleMatch && (mode === "recommendation" || mode === "expansion")) {
     actions.push(`Tampilkan detail ${firstTitleMatch[1]}`);
  }

  switch (mode) {
    case "profile_request":
      actions.push("Saya jenjang S1", "Saya jenjang SMA", "IPK saya 3.5", "Minat teknologi", "Domisili Jakarta");
      break;
    case "recommendation":
    case "expansion":
      actions.push("Tampilkan lebih banyak", "Filter berdasarkan lokasi", "Hanya jenjang S1");
      break;
    case "general":
       if (response.includes("profilmu belum lengkap")) {
          actions.push("Lengkapi Profil", "Cari beasiswa S1");
       } else {
          actions.push("Cari beasiswa S1", "Beasiswa teknologi", "Beasiswa prestasi");
       }
      break;
    default:
      break;
  }
  return actions;
}

export function DynamicActionButtons({ mode, response = "", onSelect }: DynamicActionButtonsProps) {
  const actions = generateDynamicActions(response, mode);
  
  // Try to find scholarship detail patterns for calendar
  // Pattern: **Title** ... Deadline: YYYY-MM-DD or Batas: YYYY-MM-DD
  const titleMatch = response.match(/\*\*(.*?)\*\*/);
  // Flexible regex for common Indonesian/English date labels + YYYY-MM-DD
  const dateMatch = response.match(/(?:Deadline|Batas|Berakhir|Hingga|Pendaftaran):\s*(\d{4}-\d{2}-\d{2})/i) 
                  || response.match(/(\d{4}-\d{2}-\d{2})/); // Fallback to any date if identified
  
  const calendarUrl = (titleMatch && dateMatch) ? generateCalendarUrl(titleMatch[1], dateMatch[1]) : "";

  if (actions.length === 0 && !calendarUrl) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-wrap gap-2 py-2 px-4"
    >
      {/* Dynamic Suggestions */}
      {actions.map((action, i) => {
        const isPrimary = action.startsWith("Tampilkan detail") || action === "Lengkapi Profil";
        return (
          <button
            key={i}
            onClick={() => {
              if (action === "Lengkapi Profil") {
                window.location.href = "/app/profile";
              } else {
                onSelect(action);
              }
            }}
            className={`px-4 py-1.5 rounded-full text-[12px] font-bold border transition-all shrink-0 flex items-center gap-1.5 ${
              isPrimary 
                ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700" 
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
            }`}
          >
            {action === "Lengkapi Profil" && <UserCircle className="w-3.5 h-3.5" />}
            {action}
          </button>
        );
      })}

      {/* Special Calendar Action */}
      {calendarUrl && (
        <a
          href={calendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-1.5 rounded-full text-[12px] font-black border border-emerald-500 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shrink-0 flex items-center gap-2 shadow-sm shadow-emerald-500/10"
        >
          <Calendar className="w-3.5 h-3.5" />
          Tambahkan ke Calendar
        </a>
      )}
    </motion.div>
  );
}
