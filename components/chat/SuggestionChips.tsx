"use client";

import { motion } from "framer-motion";
import { GraduationCap, Globe, Lightbulb } from "lucide-react";

interface SuggestionChipsProps {
  onSelect: (text: string) => void;
}

const suggestions = [
  { text: "Cari beasiswa S1", icon: GraduationCap },
  { text: "Beasiswa luar negeri", icon: Globe },
  { text: "Saya minat teknologi", icon: Lightbulb },
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
            className="group flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-[oklch(0.8_0.08_264)] bg-[oklch(0.16_0.05_260)] border border-[oklch(0.25_0.08_264/0.4)] hover:bg-[oklch(0.2_0.08_264/0.5)] hover:border-[oklch(0.45_0.2_264/0.5)] hover:text-white transition-all duration-200 shadow-sm hover:shadow-[0_0_16px_oklch(0.55_0.25_264/0.15)]"
          >
            <Icon className="w-4 h-4 text-[oklch(0.6_0.2_264)] group-hover:text-[oklch(0.65_0.25_264)] transition-colors duration-200" />
            {s.text}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
