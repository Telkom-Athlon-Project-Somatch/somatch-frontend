"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { SuggestionChips } from "@/components/chat/SuggestionChips";
import { DynamicActionButtons } from "@/components/chat/DynamicActionButtons";

// ─── Types ────────────────────────────────────────────────────────────────────

type Message = {
  role: "user" | "assistant";
  content: string;
  mode?: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
const API_URL = `${BASE_URL}/api/chat`;
const STORAGE_KEY_MESSAGES = "somatch_messages";
const STORAGE_KEY_SESSION = "somatch_session_id";
const MAX_HISTORY = 8;
const REQUEST_TIMEOUT_MS = 30_000;

const INITIAL_GREETING: Message = {
  role: "assistant",
  content: "Halo! Aku Somatch AI, asisten pribadimu untuk mencari beasiswa di Indonesia 🎓\n\nAgar aku bisa memberikan rekomendasi yang paling akurat dan sesuai, silakan beritahu aku detail profilmu seperti:\n- **Jenjang Pendidikan** (misal: S1, D3, SMA)\n- **Minat/Jurusan** (misal: Teknik, Seni, Ekonomi)\n- **Domisili** (Provinsi/Kota)\n- **IPK Terakhir** (opsional)\n\nApa yang bisa aku bantu hari ini?",
  mode: "general",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(STORAGE_KEY_SESSION);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY_SESSION, id);
  }
  return id;
}

function loadPersistedMessages(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MESSAGES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // corrupted data — ignore
  }
  return [];
}

function persistMessages(messages: Message[]) {
  try {
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
  } catch {
    // quota exceeded or unavailable — silent fail
  }
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [errorMsg, setErrorMsg] = useState<Message | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef("");

  // ─── Initialize: session + persisted messages ────────────────────────────

  useEffect(() => {
    sessionId.current = getSessionId();
    const saved = loadPersistedMessages();
    if (saved.length > 0) {
      setMessages(saved);
    } else {
      // First visit → show initial greeting
      setMessages([INITIAL_GREETING]);
    }
    setHydrated(true);
  }, []);

  // ─── Persist messages on change ──────────────────────────────────────────

  useEffect(() => {
    if (hydrated) {
      persistMessages(messages);
    }
  }, [messages, hydrated]);

  // ─── Auto-scroll on new messages or loading ──────────────────────────────

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  // ─── Send Message ────────────────────────────────────────────────────────

  const sendMessage = useCallback(
    async (text?: string) => {
      const messageText = (text ?? input).trim();
      if (!messageText || loading) return;

      // Clear previous error
      setErrorMsg(null);

      // 1. Add user message to state
      const userMessage: Message = { role: "user", content: messageText };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput("");
      setLoading(true);

      // 2. Build history — limit to last MAX_HISTORY entries
      const trimmedHistory = updatedMessages.slice(-MAX_HISTORY).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // 3. History Summarization
      const userProfileSummary = "User belum memberikan informasi lengkap";
      const historyWithSummary = [
        { role: "user", content: `[System Summary]: ${userProfileSummary}` }, // Note: Using role: 'user' as backend Pydantic might restrict role to user/assistant
        ...trimmedHistory
      ];

      // 4. Build request payload
      const payload = {
        session_id: sessionId.current,
        message: messageText,
        history: historyWithSummary,
      };

      console.log("📤 [Somatch] Request:", JSON.stringify(payload, null, 2));

      // 5. Fetch with AbortController timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort("Request timeout after " + REQUEST_TIMEOUT_MS + "ms"),
        REQUEST_TIMEOUT_MS
      );

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        console.log("📥 [Somatch] Response:", JSON.stringify(data, null, 2));

        // Defensive parsing — never trust the shape blindly
        const responseText =
          data?.response ?? data?.message ?? "Maaf, terjadi kesalahan pada sistem.";
        const mode = data?.mode ?? "general";

        const aiMessage: Message = {
          role: "assistant",
          content: responseText,
          mode,
        };

        setMessages((prev) => [...prev, aiMessage]);
      } catch (error: unknown) {
        console.error("❌ [Somatch] Error:", error);

        const isAbort =
          (error instanceof DOMException && error.name === "AbortError") ||
          controller.signal.aborted;

        const errorResponse: Message = {
          role: "assistant",
          content: isAbort
            ? "Koneksi ke server terlalu lama ⏱️ Coba lagi ya!"
            : "Terjadi kesalahan sistem, coba lagi ya 🙏",
          mode: "error",
        };
        // Do NOT add to messages state to avoid history noise
        setErrorMsg(errorResponse);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    },
    [input, loading, messages]
  );

  // ─── Suggestion Chip Handler ─────────────────────────────────────────────

  const handleSuggestion = useCallback(
    (text: string) => {
      sendMessage(text);
    },
    [sendMessage]
  );

  // ─── Don't render until hydrated (avoid flash) ──────────────────────────

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-dvh bg-[oklch(0.09_0.025_260)]">
        <Loader2 className="w-6 h-6 text-[oklch(0.65_0.25_264)] animate-spin" />
      </div>
    );
  }

  // ─── Check if only greeting is shown (for suggestion chips) ──────────────

  const showSuggestions =
    messages.length <= 1 &&
    messages[0]?.role === "assistant" &&
    messages[0]?.content === INITIAL_GREETING.content;

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-dvh bg-[oklch(0.09_0.025_260)] overflow-hidden">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="relative flex-shrink-0 flex items-center gap-3 px-4 sm:px-6 h-16 border-b border-[oklch(0.2_0.05_260)] bg-[oklch(0.08_0.02_260/0.8)] backdrop-blur-xl z-10">
        {/* Glow line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.65 0.25 264 / 0.3), oklch(0.75 0.20 280 / 0.2), transparent)",
          }}
        />

        <Link
          href="/"
          className="flex items-center justify-center w-9 h-9 rounded-xl text-[oklch(0.7_0.05_260)] hover:text-white hover:bg-[oklch(0.2_0.08_260/0.5)] transition-all duration-200"
          aria-label="Kembali ke halaman utama"
          id="back-button"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg overflow-hidden">
            <Image src="/favicon.png" alt="Somatch Logo" width={32} height={32} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-white leading-tight truncate font-[family-name:var(--font-heading)]">
              Somatch AI
            </h1>
            <p className="text-[11px] text-[oklch(0.6_0.04_260)] leading-tight truncate">
              Temukan beasiswa yang cocok untukmu
            </p>
          </div>
        </div>
      </header>

      {/* ── Chat Area ─────────────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4 scroll-smooth"
        id="chat-area"
      >
        {/* Welcome + Suggestions (first visit only) */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              key="welcome-suggestions"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-col items-center gap-5 pt-4 pb-2"
            >
              {/* Logo */}
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl overflow-hidden">
                <Image src="/favicon.png" alt="Somatch Logo" width={56} height={56} className="w-full h-full object-cover" />
              </div>

              <p className="text-sm text-[oklch(0.55_0.04_260)] text-center max-w-xs leading-relaxed">
                Ceritakan profilmu — jenjang, minat, atau lokasi — dan aku
                carikan beasiswa paling cocok untukmu.
              </p>

              <SuggestionChips onSelect={handleSuggestion} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        {messages.map((msg, i) => {
          const isLastMessage = i === messages.length - 1;
          const showActions = isLastMessage && msg.role === "assistant" && !loading && !errorMsg;

          return (
            <div key={`${i}-${msg.role}`} className="flex flex-col gap-2">
              <ChatBubble
                role={msg.role}
                content={msg.content}
                mode={msg.mode}
              />
              {showActions && msg.mode && (
                <DynamicActionButtons
                  mode={msg.mode}
                  response={msg.content}
                  onSelect={handleSuggestion}
                />
              )}
            </div>
          );
        })}

        {/* Error Message (not saved in history) */}
        {errorMsg && (
          <ChatBubble
            role={errorMsg.role}
            content={errorMsg.content}
            mode={errorMsg.mode}
          />
        )}

        {/* Loading Indicator */}
        <AnimatePresence>
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 px-1"
            >
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl rounded-bl-md bg-[oklch(0.14_0.04_260)] border border-[oklch(0.22_0.05_260)]">
                <Loader2 className="w-4 h-4 text-[oklch(0.65_0.25_264)] animate-spin" />
                <span className="text-sm text-[oklch(0.6_0.04_260)]">
                  Somatch sedang mengetik...
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Input Area ────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-4 sm:px-6 pb-4 pt-2 bg-gradient-to-t from-[oklch(0.09_0.025_260)] via-[oklch(0.09_0.025_260)] to-transparent">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={() => sendMessage()}
            loading={loading}
          />
          <p className="text-center text-[10px] text-[oklch(0.45_0.03_260)] mt-2">
            Somatch AI dapat membuat kesalahan. Verifikasi info beasiswa di
            sumber resmi.
          </p>
        </div>
      </div>
    </div>
  );
}
