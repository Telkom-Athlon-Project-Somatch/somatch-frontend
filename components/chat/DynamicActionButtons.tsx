"use client";

import { motion } from "framer-motion";

interface DynamicActionButtonsProps {
  mode: string;
  response?: string;
  onSelect: (text: string) => void;
}

export function generateDynamicActions(response: string, mode: string): string[] {
  switch (mode) {
    case "profile_request":
      return [
        "Saya jenjang S1",
        "Saya jenjang SMA",
        "IPK saya 3.5",
        "Minat teknologi",
        "Domisili Jakarta",
      ];
    case "recommendation":
    case "expansion":
      return [
        "Tampilkan lebih banyak",
        "Filter berdasarkan lokasi",
        "Hanya beasiswa S2",
        "Hanya jenjang S1",
      ];
    case "general":
      return [
        "Cari beasiswa S1 di Indonesia",
        "Beasiswa teknologi",
        "Beasiswa domisili Jakarta",
      ];
    case "reset":
      return ["reset profile"];
    case "error":
      return [];
    default:
      return [];
  }
}

export function DynamicActionButtons({ mode, response = "", onSelect }: DynamicActionButtonsProps) {
  const actions = generateDynamicActions(response, mode);

  if (actions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex overflow-x-auto gap-2 py-1 scrollbar-hide px-3"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      <div className="flex gap-2 min-w-[max-content]">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => onSelect(action)}
            className="px-4 py-2 rounded-full text-[13px] font-medium border border-[oklch(0.25_0.08_264/0.7)] bg-[oklch(0.12_0.04_260)] text-[oklch(0.7_0.04_260)] hover:bg-[oklch(0.2_0.08_264/0.8)] hover:text-white hover:border-[oklch(0.45_0.2_264/0.5)] transition-all duration-200 shrink-0"
          >
            {action}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
