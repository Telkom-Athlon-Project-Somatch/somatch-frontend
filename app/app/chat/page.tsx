"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, Loader2, UserCircle, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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

const API_URL = "/api/chat";
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

export function ChatPageContent() {
  const { user, token, logout, isLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [errorMsg, setErrorMsg] = useState<Message | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef("");
  const router = useRouter();

  const searchParams = useSearchParams();
  const processedRef = useRef(false);

  // ─── Auth Protection Check ────────────────────────────────────────────────
  useEffect(() => {
    if (hydrated && !isLoading && !user) {
      router.push("/login");
    }
  }, [hydrated, isLoading, user, router]);



  useEffect(() => {
    sessionId.current = getSessionId();
    const saved = loadPersistedMessages();
    if (saved.length > 0) {
      setMessages(saved);
    } else {
      // First visit → show initial greeting
      const profileIncomplete = !user?.profile?.semester && !user?.profile?.university;
      const greeting: Message = {
        role: "assistant",
        content: `Halo ${user?.name || ""}! Aku Somatch AI, asisten pribadimu untuk mencari beasiswa di Indonesia 🎓\n\n${
          profileIncomplete 
          ? "Sepertinya profilmu belum lengkap. Yuk, **[Lengkapi Profil di Sini](/app/profile)** agar aku bisa memberikan rekomendasi yang paling akurat!" 
          : "Agar aku bisa memberikan rekomendasi yang paling akurat, silakan beritahu aku jika ada perubahan profilmu."
        }\n\nApa yang bisa aku bantu hari ini?`,
        mode: "general",
      };
      setMessages([greeting]);
    }
    setHydrated(true);
  }, [user]); // Add user to dependency to ensure profile check is accurate

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
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
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

  // Handle Query Param from Profile (Moved after sendMessage declaration)
  useEffect(() => {
    if (hydrated && !isLoading && user && !processedRef.current) {
      const q = searchParams.get("q");
      if (q) {
        processedRef.current = true;
        sendMessage(q);
        // Clear param from URL without reloading
        const newUrl = window.location.pathname;
        window.history.replaceState({ path: newUrl }, "", newUrl);
      }
    }
  }, [hydrated, isLoading, user, searchParams, sendMessage]);

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
      <div className="flex items-center justify-center h-dvh bg-white">
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
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* ── Chat Area ─────────────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 sm:px-8 py-10 space-y-6 scroll-smooth"
        id="chat-area"
      >
        {/* Page Header (inside chat) */}
        <div className="mb-10 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center border border-indigo-500/20 mb-4">
             <Image src="/favicon.png" alt="Logo" width={40} height={40} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-heading">AI Scholarship Assistant</h1>
          <p className="text-slate-500 text-sm mt-1">Carikan beasiswa yang paling pas buat masa depanmu.</p>
        </div>
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

              <p className="text-sm text-slate-600 text-center max-w-xs leading-relaxed">
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
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl rounded-bl-md bg-white border border-slate-200 shadow-sm">
                <Loader2 className="w-4 h-4 text-[oklch(0.65_0.25_264)] animate-spin" />
                <span className="text-sm text-slate-600">
                  Somatch sedang mengetik...
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Input Area ────────────────────────────────────────────────────── */}
      <div className="shrink-0 px-4 sm:px-6 pb-4 pt-2 bg-linear-to-t from-white via-white to-transparent relative z-10">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={() => sendMessage()}
            loading={loading}
          />
          <p className="text-center text-[10px] text-slate-500 mt-2">
            Somatch AI dapat membuat kesalahan. Verifikasi info beasiswa di
            sumber resmi.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-dvh bg-white">
        <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  );
}
