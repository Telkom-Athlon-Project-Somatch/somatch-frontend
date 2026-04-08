"use client";

import { motion } from "framer-motion";
import { GraduationCap, Cpu, LineChart, MapPin, RefreshCcw } from "lucide-react";

interface SuggestionChipsProps {
  onSelect: (text: string) => void;
}

const suggestions = [
  { text: "Cari beasiswa S1 di Indonesia", icon: GraduationCap },
  { text: "Cari beasiswa S2 di Indonesia", icon: GraduationCap },
  { text: "Saya minat bidang teknologi", icon: Cpu },
  { text: "Saya minat bidang ekonomi", icon: LineChart },
  { text: "Saya domisili Jakarta", icon: MapPin },
  { text: "reset profile", icon: RefreshCcw },
];

export function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex flex-wrap items-center justify-center gap-2"
    >
      {suggestions.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.button
            key={s.text}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(s.text)}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-indigo-300 hover:text-slate-900 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Icon className="w-4 h-4 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" />
            {s.text}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
