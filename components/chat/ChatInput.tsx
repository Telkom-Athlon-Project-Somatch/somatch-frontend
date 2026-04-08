"use client";

import { useRef, useEffect, KeyboardEvent } from "react";
import { SendHorizonal, Loader2 } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  loading: boolean;
}

export function ChatInput({ value, onChange, onSend, loading }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 150)}px`;
  }, [value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading && value.trim()) {
        onSend();
      }
    }
  };

  return (
    <div className="relative flex items-end gap-2 p-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-200">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        rows={1}
        placeholder="Tulis minat, jenjang, atau tanya beasiswa..."
        className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 resize-none outline-none py-1.5 px-1 max-h-[150px] disabled:opacity-50 scrollbar-thin"
        id="chat-input"
      />
      <button
        onClick={onSend}
        disabled={loading || !value.trim()}
        aria-label="Kirim pesan"
        id="send-button"
        className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[oklch(0.55_0.25_264)] to-[oklch(0.50_0.25_280)] text-white shadow-[0_2px_12px_oklch(0.55_0.25_264/0.3)] hover:shadow-[0_4px_20px_oklch(0.55_0.25_264/0.5)] hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none transition-all duration-200"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <SendHorizonal className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
