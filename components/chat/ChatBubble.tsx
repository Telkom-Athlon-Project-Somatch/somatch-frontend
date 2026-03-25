"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  mode?: string;
}

// ─── Mode-based badge styles ──────────────────────────────────────────────────

const modeBadgeStyles: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  recommendation: {
    bg: "bg-[oklch(0.2_0.12_140/0.5)]",
    text: "text-[oklch(0.7_0.2_140)]",
    dot: "bg-[oklch(0.65_0.2_140)]",
    label: "recommendation",
  },
  profile_request: {
    bg: "bg-[oklch(0.2_0.1_60/0.5)]",
    text: "text-[oklch(0.75_0.15_60)]",
    dot: "bg-[oklch(0.7_0.15_60)]",
    label: "profile_request",
  },
  expansion: {
    bg: "bg-[oklch(0.2_0.1_200/0.5)]",
    text: "text-[oklch(0.7_0.15_200)]",
    dot: "bg-[oklch(0.65_0.15_200)]",
    label: "expansion",
  },
  reset: {
    bg: "bg-[oklch(0.2_0.08_300/0.5)]",
    text: "text-[oklch(0.7_0.12_300)]",
    dot: "bg-[oklch(0.65_0.12_300)]",
    label: "reset",
  },
  error: {
    bg: "bg-[oklch(0.2_0.12_25/0.5)]",
    text: "text-[oklch(0.7_0.18_25)]",
    dot: "bg-[oklch(0.65_0.18_25)]",
    label: "error",
  },
  general: {
    bg: "bg-[oklch(0.2_0.08_264/0.5)]",
    text: "text-[oklch(0.65_0.25_264)]",
    dot: "bg-[oklch(0.65_0.25_264)]",
    label: "general",
  },
};

function getModeBadge(mode: string) {
  return modeBadgeStyles[mode] ?? modeBadgeStyles.general;
}

// ─── Mode-based hint messages ─────────────────────────────────────────────────

const modeHints: Record<string, string> = {
  profile_request: "💡 Coba sebutkan jurusan, IPK, atau domisili kamu",
  recommendation: "🎯 Rekomendasi beasiswa untukmu",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function ChatBubble({ role, content, mode }: ChatBubbleProps) {
  const isUser = role === "user";
  const badge = mode ? getModeBadge(mode) : null;
  const hint = mode ? modeHints[mode] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className="flex flex-col gap-1 max-w-[70%]">
        {/* Avatar + Name Label removed for cleaner look */}

        {/* Bubble — highlight border for recommendation mode */}
        <div
          className={`relative px-4 py-3 text-sm leading-relaxed break-words markdown-content ${
            isUser
              ? "bg-gradient-to-br from-[oklch(0.55_0.25_264)] to-[oklch(0.45_0.25_280)] text-white rounded-2xl rounded-br-md shadow-[0_2px_16px_oklch(0.55_0.25_264/0.25)]"
              : `bg-[oklch(0.14_0.04_260)] text-[oklch(0.9_0.02_260)] rounded-2xl rounded-bl-md shadow-[0_2px_12px_oklch(0_0_0/0.2)] ${
                  mode === "recommendation"
                    ? "border border-[oklch(0.5_0.18_140/0.35)]"
                    : mode === "profile_request"
                    ? "border border-[oklch(0.5_0.12_60/0.35)]"
                    : "border border-[oklch(0.22_0.05_260)]"
                }`
          }`}
        >
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0" />,
              ul: ({ node, ...props }) => <ul {...props} className="list-disc ml-4 mb-2" />,
              ol: ({ node, ...props }) => <ol {...props} className="list-decimal ml-4 mb-2" />,
              li: ({ node, ...props }) => <li {...props} className="mb-0.5" />,
              strong: ({ node, ...props }) => <strong {...props} className="font-bold text-white" />,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* Hint (AI only) — logo/mode hidden as requested */}
        {!isUser && mode === "profile_request" && hint && (
          <div className="flex flex-col gap-1 px-1">
            <span className="text-[11px] text-[oklch(0.75_0.15_60/0.8)] italic px-0.5 font-medium flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.7_0.15_60)] animate-pulse" />
               {hint}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
